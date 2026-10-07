"""GitHub Actions release coordination. Uses only the repository GITHUB_TOKEN."""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tomllib


def run(*args):
    return subprocess.check_output(args, text=True).strip()


def version(root=Path('.'), tag=None):
    cargo = tomllib.loads((root / 'Cargo.toml').read_text())['package']['version']
    bundle = tomllib.loads((root / 'elyra.toml').read_text())['bundle']
    if not re.fullmatch(r'(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?', cargo):
        raise ValueError('Expected a release version such as 1.2.3 or 1.2.3-rc.1')
    locked = tomllib.loads((root / 'Cargo.lock').read_text())['package']
    if bundle['version'] != cargo or not any(p['name'] == 'splash' and p['version'] == cargo for p in locked):
        raise ValueError('Cargo.toml, Cargo.lock and elyra.toml versions must agree')
    if bundle['identifier'] != 'no.helgesverre.splash':
        raise ValueError('Unexpected bundle identifier')
    if tag is not None and tag != f'v{cargo}':
        raise ValueError('Tag must match the app version')
    return cargo


def release_for(tag):
    pages = json.loads(run('gh', 'api', '--paginate', '--slurp',
                           f'repos/{os.environ["GITHUB_REPOSITORY"]}/releases'))
    return next((r for page in pages for r in page if r['tag_name'] == tag), None)


def auto_tag():
    tag = 'v' + version()
    sha = run('git', 'rev-parse', 'HEAD')
    refs = run('git', 'ls-remote', '--tags', 'origin', f'refs/tags/{tag}', f'refs/tags/{tag}^{{}}')
    if refs:
        mapping = dict(line.split()[::-1] for line in refs.splitlines())
        existing = mapping.get(f'refs/tags/{tag}^{{}}', mapping[f'refs/tags/{tag}'])
        if existing != sha:
            print(f'{tag} already exists at another commit; bump the app version to release again.')
            return
    else:
        run('gh', 'api', '--method', 'POST', f'repos/{os.environ["GITHUB_REPOSITORY"]}/git/refs',
            '-f', f'ref=refs/tags/{tag}', '-f', f'sha={sha}')
    existing_release = release_for(tag)
    if existing_release and not existing_release['draft']:
        print(f'{tag} is already published.')
        return
    # Token-created tag pushes do not trigger Actions; dispatch explicitly.
    run('gh', 'workflow', 'run', 'release.yml', '--ref', tag)
    print(f'Dispatched Release for {tag} at {sha}.')


def expected_assets(v):
    names = {f'Splash-{v}-linux-x86_64{ext}' for ext in ('.deb', '.AppImage', '.tar.gz')}
    names |= {f'Splash-{v}-windows-x86_64{ext}' for ext in ('.zip', '-setup.exe')}
    names |= {f'Splash-{v}-macos-{arch}.zip' for arch in ('arm64', 'x86_64')}
    names |= {f'splash-server-{v}-{target}{ext}' for target, ext in (
        ('linux-x86_64', '.tar.gz'), ('windows-x86_64', '.zip'),
        ('macos-arm64', '.tar.gz'), ('macos-x86_64', '.tar.gz'))}
    return names


def verify_assets(folder, v):
    expected = expected_assets(v)
    actual = {p.name for p in folder.iterdir()}
    if actual != expected | {n + '.sha256' for n in expected}:
        raise ValueError('Release assets are missing, unexpected, or have mismatched versions')
    for name in sorted(expected):
        digest, filename = (folder / (name + '.sha256')).read_text().strip().split(maxsplit=1)
        if filename != name or hashlib.sha256((folder / name).read_bytes()).hexdigest() != digest:
            raise ValueError(f'Invalid checksum for {name}')
    return sorted(folder.iterdir())


def publish():
    tag = os.environ['GITHUB_REF_NAME']
    v = version(tag=tag)
    # Never retag or replace already-published binaries on a retry.
    existing = release_for(tag)
    if existing and not existing['draft']:
        print(f'{tag} is already published; leaving it unchanged.')
        return
    assets = verify_assets(Path('release-assets'), v)
    prerelease = '-' in v
    if not existing:
        args = ['gh', 'release', 'create', tag, '--verify-tag', '--draft',
                '--title', f'Splash {tag}', '--generate-notes']
        notes = Path(f'.github/release-notes-{v}.md')
        if notes.is_file():
            args += ['--notes-file', str(notes)]
        if prerelease:
            args += ['--prerelease']
        run(*args)
    # Keep the draft hidden until every file is present; retries resume the draft.
    run('gh', 'release', 'upload', tag, *(str(p) for p in assets), '--clobber')
    uploaded = release_for(tag)['assets']
    if {a['name'] for a in uploaded} != {p.name for p in assets} or any(a['state'] != 'uploaded' for a in uploaded):
        raise ValueError('Remote release asset inventory does not match the verified packages')
    release_id = release_for(tag)['id']
    # Let GitHub compare versions instead of promoting an older backfill to Latest.
    run('gh', 'api', '--method', 'PATCH',
        f'repos/{os.environ["GITHUB_REPOSITORY"]}/releases/{release_id}',
        '-F', 'draft=false', '-F', f'prerelease={str(prerelease).lower()}',
        '-f', 'make_latest=false' if prerelease else 'make_latest=legacy')
    print(f'Published {tag}.')


if __name__ == '__main__':
    operation = os.environ.get('RELEASE_OPERATION', 'validate')
    if operation == 'tag':
        auto_tag()
    elif operation == 'publish':
        publish()
    elif operation == 'validate':
        print(version(tag=os.environ.get('GITHUB_REF_NAME') if os.environ.get('GITHUB_REF_TYPE') == 'tag' else None))
    else:
        raise ValueError('Unknown RELEASE_OPERATION')
