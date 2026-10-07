#!/usr/bin/env bash
set -euo pipefail
export TMPDIR
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT
export XDG_RUNTIME_DIR="$TMPDIR/runtime"
mkdir -m 0700 "$XDG_RUNTIME_DIR"
cd "$TMPDIR"
for file in /packages/*.sha256; do (cd /packages && sha256sum --check "$(basename "$file")"); done
# Extraction bypasses FUSE, not permissions, library resolution, or WebKit sandbox.
image=(/packages/*.AppImage)
"${image[0]}" --appimage-extract >/dev/null
xvfb-run -a dbus-run-session -- python3 /opt/tests/test-desktop.py squashfs-root/AppRun
mkdir deb
package=(/packages/*.deb)
dpkg-deb -x "${package[0]}" deb
xvfb-run -a dbus-run-session -- python3 /opt/tests/test-desktop.py deb/usr/bin/splash
server=(/packages/splash-server-*.tar.gz)
tar -xf "${server[0]}"
python3 /opt/tests/test-server-http.py splash-server-*/splash-server
