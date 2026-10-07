#!/usr/bin/env python3
"""Package already-built native binaries. No cross-compilation or signing claims."""
import argparse
import hashlib
import os
from pathlib import Path
import platform
import shutil
import subprocess
import tarfile
import tempfile
import tomllib
import zipfile

ROOT = Path(__file__).resolve().parents[1]
VERSION = tomllib.loads((ROOT / 'Cargo.toml').read_text())['package']['version']

def run(*args, **kwargs):
    subprocess.run([str(arg) for arg in args], check=True, **kwargs)

def checksum(path):
    path.with_name(path.name + '.sha256').write_text(hashlib.sha256(path.read_bytes()).hexdigest() + '  ' + path.name + '\n')

def copy(source, target, mode=0o755):
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
    target.chmod(mode)

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
            portable = temp / f'Splash-{VERSION}-windows-{arch}'
            copy(desktop, portable / 'splash.exe')
            copy(ROOT / 'LICENSE', portable / 'LICENSE', 0o644)
            (portable / 'README.txt').write_text('Windows 11 x64. Requires Microsoft Edge WebView2 Evergreen Runtime.\nDownload runtime: https://developer.microsoft.com/microsoft-edge/webview2/\nThis build is unsigned.\n')
            archive(portable, output / (portable.name + '.zip'))
            makensis = shutil.which('makensis') or str(Path(os.environ.get('PROGRAMFILES(X86)', 'C:/Program Files (x86)')) / 'NSIS/makensis.exe')
            run(makensis, f'/DVERSION={VERSION}', f'/DSOURCE={portable}', f'/DOUTPUT={output / (portable.name + "-setup.exe")}', ROOT / 'packaging/windows.nsi')
            checksum(output / (portable.name + '-setup.exe'))
        elif system == 'linux':
            stage = temp / 'deb'
            copy(desktop, stage / 'usr/bin/splash')
            copy(ROOT / 'packaging/splash.desktop', stage / 'usr/share/applications/no.helgesverre.splash.desktop', 0o644)
            copy(ROOT / 'app/public/icon.png', stage / 'usr/share/icons/hicolor/256x256/apps/splash.png', 0o644)
            control = stage / 'DEBIAN/control'; control.parent.mkdir()
            control.write_text(f'Package: splash\nVersion: {VERSION}\nArchitecture: amd64\nMaintainer: Helge Sverre\nDepends: libgtk-3-0t64, libwebkit2gtk-4.1-0, libxdo3, libssl3t64\nDescription: Workspace for ACP coding agents\n')
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
            copy(ROOT / 'packaging/splash.desktop', appdir / 'splash.desktop', 0o644)
            copy(ROOT / 'app/public/icon.png', appdir / 'splash.png', 0o644)
            copy(ROOT / 'packaging/linux-runtime.txt', appdir / 'README.txt', 0o644)
            image = output / f'Splash-{VERSION}-linux-{arch}.AppImage'
            run(args.appimagetool.resolve(), '--runtime-file', args.runtime.resolve(), appdir, image,
                env={**os.environ, 'ARCH': 'x86_64', 'APPIMAGE_EXTRACT_AND_RUN': '1'})
            image.chmod(0o755); checksum(image)

if __name__ == '__main__': main()
