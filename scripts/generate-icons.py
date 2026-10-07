#!/usr/bin/env python3
"""Render every app icon from app/public/icon.svg. Needs resvg, Pillow and (for
the .icns) macOS iconutil. Outputs are committed, so builds need none of them.

  app/public/icon.png                  1024px on Apple's grid (824px body): the
                                       rata bundle source, About dialog, README
  packaging/icons/AppIcon.icns         macOS bundle icon, swapped in before signing
  packaging/icons/splash.ico           Windows executable, window and installer
  packaging/icons/hicolor/             Linux theme sizes (the SVG is installed as
                                       the scalable icon at package time)

Where the tile body is under 40px the spray dots turn into specks, so those
sizes show the drop alone at the height of the full mark.
"""
from io import BytesIO
from pathlib import Path
import re
import shutil
import struct
import subprocess
import tempfile

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'app/public/icon.svg'
ICONS = ROOT / 'packaging/icons'
LINUX_NAME = 'no.helgesverre.splash'
SIMPLE_BELOW = 40
ICO_SIZES = [16, 20, 24, 32, 40, 48, 64, 256]
HICOLOR_SIZES = [16, 24, 32, 48, 64, 128, 256, 512]
ICONSET = [(16, '16x16'), (32, '16x16@2x'), (32, '32x32'), (64, '32x32@2x'), (128, '128x128'),
           (256, '128x128@2x'), (256, '256x256'), (512, '256x256@2x'), (512, '512x512'), (1024, '512x512@2x')]
# Apple's grid: an 824px body centred on a 1024px canvas.
APPLE_BODY = 824 / 1024


def variants():
    svg = SOURCE.read_text()
    inner = re.search(r'<svg[^>]*>(.*)</svg>', svg, re.S).group(1)
    transform = re.search(r'<g id="mark" transform="([^"]*)"', inner)
    dots = re.findall(r'\s*<circle [^>]*/>', inner)
    assert transform and dots, 'icon.svg needs a <g id="mark" transform> holding the drop and spray dots'
    simple = inner.replace(transform.group(0), '<g id="mark" transform="translate(0 .24)"')
    for dot in dots:
        simple = simple.replace(dot, '')
    # The drop alone, unscaled: 64% of the tile, as tall as the full mark, and
    # centred halfway between its bounding-box centre (y 30.5) and mass (y 33).
    return {'detailed': inner, 'simple': simple}


def render(parts, size, inset, scratch):
    """Rasterise one size; `inset` is the transparent margin around the tile."""
    inner = parts['simple' if size * (1 - 2 * inset) < SIMPLE_BELOW else 'detailed']
    scale = 1 - 2 * inset
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
           f'<g transform="translate({64 * inset} {64 * inset}) scale({scale})">{inner}</g></svg>')
    source = scratch / f'{size}-{inset}.svg'
    target = scratch / f'{size}-{inset}.png'
    source.write_text(svg)
    subprocess.run(['resvg', '-w', str(size), '-h', str(size), source, target], check=True)
    return target


def bmp_entry(png):
    """32-bit DIB with an AND mask, the form every ICO reader accepts below 256px."""
    image = Image.open(png).convert('RGBA')
    width, height = image.size
    pixels = image.transpose(Image.Transpose.FLIP_TOP_BOTTOM).tobytes('raw', 'BGRA')
    stride = (width + 31) // 32 * 4
    mask = bytearray(stride * height)
    alpha = image.transpose(Image.Transpose.FLIP_TOP_BOTTOM).getchannel('A').tobytes()
    for y in range(height):
        for x in range(width):
            if alpha[y * width + x] == 0:
                mask[y * stride + x // 8] |= 0x80 >> (x % 8)
    header = struct.pack('<IiiHHIIiiII', 40, width, height * 2, 1, 32, 0, len(pixels) + len(mask), 0, 0, 0, 0)
    return header + pixels + bytes(mask)


def write_ico(entries, target):
    """`entries` is [(size, png_path)]. 256px is stored as PNG, smaller sizes as DIB."""
    images = [(size, png.read_bytes() if size >= 256 else bmp_entry(png)) for size, png in entries]
    offset = 6 + 16 * len(images)
    directory = struct.pack('<HHH', 0, 1, len(images))
    for size, data in images:
        directory += struct.pack('<BBBBHHII', size % 256, size % 256, 0, 0, 1, 32, len(data), offset)
        offset += len(data)
    target.write_bytes(directory + b''.join(data for _, data in images))


def optimise(png, target):
    Image.open(png).save(target, optimize=True)


def main():
    if not shutil.which('resvg'):
        raise SystemExit('resvg is required: brew install resvg (or cargo install resvg)')
    if not shutil.which('iconutil'):
        raise SystemExit('iconutil is required for AppIcon.icns; run this on macOS')
    parts = variants()
    apple_inset = (1 - APPLE_BODY) / 2
    with tempfile.TemporaryDirectory(prefix='splash-icons-') as scratch:
        scratch = Path(scratch)
        optimise(render(parts, 1024, apple_inset, scratch), ROOT / 'app/public/icon.png')

        iconset = scratch / 'AppIcon.iconset'
        iconset.mkdir()
        for size, name in ICONSET:
            shutil.copy(render(parts, size, apple_inset, scratch), iconset / f'icon_{name}.png')
        ICONS.mkdir(parents=True, exist_ok=True)
        subprocess.run(['iconutil', '-c', 'icns', iconset, '-o', ICONS / 'AppIcon.icns'], check=True)

        write_ico([(size, render(parts, size, 0, scratch)) for size in ICO_SIZES], ICONS / 'splash.ico')

        shutil.rmtree(ICONS / 'hicolor', ignore_errors=True)
        for size in HICOLOR_SIZES:
            target = ICONS / f'hicolor/{size}x{size}/apps/{LINUX_NAME}.png'
            target.parent.mkdir(parents=True)
            optimise(render(parts, size, 0, scratch), target)
    for path in sorted([ROOT / 'app/public/icon.png', *ICONS.rglob('*.*')]):
        print(f'{path.relative_to(ROOT)}  {path.stat().st_size:,} bytes')


if __name__ == '__main__':
    main()
