#!/usr/bin/env python3
"""Package already-built native binaries. No cross-compilation or signing claims."""
import argparse
import datetime
import hashlib
import os
from pathlib import Path
import platform
import re
import shutil
import sys
import subprocess
import tarfile
import tempfile
import tomllib
import zipfile

ROOT = Path(__file__).resolve().parents[1]
VERSION = tomllib.loads((ROOT / 'Cargo.toml').read_text())['package']['version']
# Windows version resources take four numbers; prerelease suffixes are dropped.
VERSION_NUMERIC = '.'.join(re.match(r'(\d+)\.(\d+)\.(\d+)', VERSION).groups()) + '.0'
APP_ID = 'no.helgesverre.splash'

def run(*args, **kwargs):
    subprocess.run([str(arg) for arg in args], check=True, **kwargs)

def checksum(path):
    path.with_name(path.name + '.sha256').write_text(hashlib.sha256(path.read_bytes()).hexdigest() + '  ' + path.name + '\n')

def copy(source, target, mode=0o755):
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
    target.chmod(mode)

def install_linux_metadata(root):
    """Desktop entry, theme icons and AppStream metadata under a /usr prefix."""
    copy(ROOT / f'packaging/{APP_ID}.desktop', root / f'share/applications/{APP_ID}.desktop', 0o644)
    shutil.copytree(ROOT / 'packaging/icons/hicolor', root / 'share/icons/hicolor', dirs_exist_ok=True)
    copy(ROOT / 'app/public/icon.svg', root / f'share/icons/hicolor/scalable/apps/{APP_ID}.svg', 0o644)
    for icon in (root / 'share/icons').rglob('*'):
        icon.chmod(0o755 if icon.is_dir() else 0o644)
    stamp = int(os.environ.get('SOURCE_DATE_EPOCH') or datetime.datetime.now().timestamp())
    date = datetime.datetime.fromtimestamp(stamp, datetime.timezone.utc).date()
    metainfo = (ROOT / f'packaging/{APP_ID}.metainfo.xml').read_text().replace(
        '</component>', f'  <releases>\n    <release version="{VERSION}" date="{date}"/>\n  </releases>\n</component>')
    target = root / f'share/metainfo/{APP_ID}.metainfo.xml'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(metainfo)
    target.chmod(0o644)

def archive(source, output):
    if output.suffix == '.zip':
        with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as package:
            for file in source.rglob('*'):
                if file.is_file(): package.write(file, file.relative_to(source.parent))
    else:
        with tarfile.open(output, 'w:gz') as package: package.add(source, arcname=source.name)
    checksum(output)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--desktop', default='target/release/splash')
    parser.add_argument('--server', default='target/headless/release/splash-server')
    parser.add_argument('--output', default='target/distrib')
    parser.add_argument('--appimagetool', type=Path)
    parser.add_argument('--runtime', type=Path)
    args = parser.parse_args()
    os.chdir(ROOT)
    output = Path(args.output).resolve(); output.mkdir(parents=True, exist_ok=True)
    system = {'Darwin': 'macos', 'Windows': 'windows', 'Linux': 'linux'}[platform.system()]
    arch = 'arm64' if platform.machine().lower() in ('arm64', 'aarch64') else 'x86_64'
    extension = '.exe' if system == 'windows' else ''
    desktop = Path(args.desktop + extension).resolve()
    server = Path(args.server + extension).resolve()
    suffix = '.zip' if system == 'windows' else '.tar.gz'
    with tempfile.TemporaryDirectory(prefix='splash-package-') as temp:
        temp = Path(temp)
        standalone = temp / f'splash-server-{VERSION}-{system}-{arch}'
        copy(server, standalone / server.name)
        copy(ROOT / 'LICENSE', standalone / 'LICENSE', 0o644)
        (standalone / 'README.txt').write_text('Run splash-server --help. Binds localhost only. For remote access use an SSH tunnel.\nLogin token is stored in the server data directory.\nhttps://github.com/HelgeSverre/splash#run-as-a-web-app-over-ssh\n')
        archive(standalone, output / (standalone.name + suffix))
        if system == 'windows':
            run(sys.executable, ROOT / 'scripts/verify-windows.py', desktop, server)
            portable = temp / f'Splash-{VERSION}-windows-{arch}'
            copy(desktop, portable / 'splash.exe')
            copy(ROOT / 'LICENSE', portable / 'LICENSE', 0o644)
            (portable / 'README.txt').write_text('Windows 11 x64. Requires Microsoft Edge WebView2 Evergreen Runtime.\nDownload runtime: https://developer.microsoft.com/microsoft-edge/webview2/\nThis build is unsigned.\n')
            archive(portable, output / (portable.name + '.zip'))
            makensis = shutil.which('makensis') or str(Path(os.environ.get('PROGRAMFILES(X86)', 'C:/Program Files (x86)')) / 'NSIS/makensis.exe')
            run(makensis, f'/DVERSION={VERSION}', f'/DVERSION_NUMERIC={VERSION_NUMERIC}', f'/DSOURCE={portable}', f'/DOUTPUT={output / (portable.name + "-setup.exe")}', ROOT / 'packaging/windows.nsi')
            checksum(output / (portable.name + '-setup.exe'))
        elif system == 'linux':
            stage = temp / 'deb'
            copy(desktop, stage / 'usr/bin/splash')
            install_linux_metadata(stage / 'usr')
            control = stage / 'DEBIAN/control'; control.parent.mkdir()
            control.write_text(f'Package: splash\nVersion: {VERSION}\nArchitecture: amd64\nMaintainer: Helge Sverre\nSection: devel\nPriority: optional\n'
                               f'Homepage: https://github.com/HelgeSverre/splash\nDepends: libgtk-3-0t64, libwebkit2gtk-4.1-0, libxdo3, libssl3t64\n'
                               'Description: Run coding agents in your git projects\n'
                               ' Splash runs coding agents such as Claude Code, Codex and Gemini CLI over the\n'
                               ' Agent Client Protocol, each session in a project folder or its own git\n'
                               ' worktree. Agents are installed separately.\n')
            deb = output / f'Splash-{VERSION}-linux-{arch}.deb'
            run('dpkg-deb', '--root-owner-group', '--build', stage, deb); checksum(deb)
            portable = temp / f'Splash-{VERSION}-linux-{arch}'
            copy(desktop, portable / 'splash')
            copy(ROOT / 'packaging/linux-runtime.txt', portable / 'README.txt', 0o644)
            copy(ROOT / 'LICENSE', portable / 'LICENSE', 0o644)
            archive(portable, output / (portable.name + suffix))
            if not args.appimagetool or not args.runtime: raise SystemExit('Linux packaging requires pinned --appimagetool and --runtime')
            appdir = temp / 'Splash.AppDir'
            copy(desktop, appdir / 'usr/bin/splash')
            copy(ROOT / 'packaging/AppRun', appdir / 'AppRun')
            install_linux_metadata(appdir / 'usr')
            # appimagetool takes the entry and icon named by its Icon= key from the AppDir root.
            copy(ROOT / f'packaging/{APP_ID}.desktop', appdir / f'{APP_ID}.desktop', 0o644)
            copy(ROOT / f'packaging/icons/hicolor/256x256/apps/{APP_ID}.png', appdir / f'{APP_ID}.png', 0o644)
            copy(ROOT / 'packaging/linux-runtime.txt', appdir / 'README.txt', 0o644)
            image = output / f'Splash-{VERSION}-linux-{arch}.AppImage'
            run(args.appimagetool.resolve(), '--runtime-file', args.runtime.resolve(), appdir, image,
                env={**os.environ, 'ARCH': 'x86_64', 'APPIMAGE_EXTRACT_AND_RUN': '1'})
            image.chmod(0o755); checksum(image)

if __name__ == '__main__': main()
