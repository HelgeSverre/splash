#!/usr/bin/env python3
"""Inspect the final AppImage, including permissions that owner-only tests miss."""
from pathlib import Path
import os
import re
import subprocess
import sys
import tempfile

image = Path(sys.argv[1]).resolve()
with tempfile.TemporaryDirectory(prefix='splash-image-') as directory:
    subprocess.run([str(image), '--appimage-extract'], cwd=directory, check=True, stdout=subprocess.DEVNULL)
    root = Path(directory, 'squashfs-root')
    for name in ['AppRun', 'usr/bin/splash']:
        file = (root / name).resolve()
        assert file.is_relative_to(root), f'{name} escapes the image'
        assert file.stat().st_mode & 0o555 == 0o555, f'{name} must be executable by every user'
    for file in root.rglob('*'):
        if not file.is_file() or file.read_bytes()[:4] != b'\x7fELF': continue
        symbols = subprocess.check_output(['objdump', '-T', str(file)], text=True)
        versions = [tuple(map(int, match.split('.'))) for match in re.findall(r'GLIBC_(\d+\.\d+)', symbols)]
        assert max(versions, default=(0, 0)) <= (2, 39), f'{file} exceeds Ubuntu 24.04 glibc baseline'
    subprocess.run([str(root / 'AppRun'), '--version'], check=True)
print('Final AppImage: launcher permissions, contained paths, glibc baseline and loader passed')
