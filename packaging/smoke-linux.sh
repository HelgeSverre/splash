#!/usr/bin/env bash
set -euo pipefail
export TMPDIR
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT
export XDG_RUNTIME_DIR="$TMPDIR/runtime"
mkdir -m 0700 "$XDG_RUNTIME_DIR"
for file in /packages/*.sha256; do (cd /packages && sha256sum --check "$(basename "$file")"); done

# Test the supported installation path as well as the raw payload.  Installing
# needs root, while every executable check below deliberately runs as a fresh
# ordinary desktop user.
package=(/packages/*.deb)
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends "${package[0]}"
dpkg-query --show splash >/dev/null

chown -R smoke:smoke "$TMPDIR"
run_as_smoke() {
  runuser -u smoke -- env HOME=/home/smoke TMPDIR="$TMPDIR" XDG_RUNTIME_DIR="$XDG_RUNTIME_DIR" "$@"
}

cd "$TMPDIR"
# Extraction bypasses FUSE, not permissions, library resolution, or WebKit sandbox.
image=(/packages/*.AppImage)
run_as_smoke "${image[0]}" --appimage-extract >/dev/null
run_as_smoke env -u SPLASH_SMOKE_SCREENSHOT xvfb-run -a dbus-run-session -- python3 /opt/tests/test-desktop.py squashfs-root/AppRun
mkdir deb
dpkg-deb -x "${package[0]}" deb
chown -R smoke:smoke deb
run_as_smoke env -u SPLASH_SMOKE_SCREENSHOT xvfb-run -a dbus-run-session -- python3 /opt/tests/test-desktop.py deb/usr/bin/splash
if [[ -n "${SPLASH_SMOKE_SCREENSHOT:-}" ]]; then
  # Screenshot support is installed after the fresh-DEB dependency check, so it
  # cannot mask a missing runtime dependency.  Capture is opt-in for docs runs.
  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends python3-gi gir1.2-gtk-3.0
  screenshot="$TMPDIR/desktop.png"
  run_as_smoke env SPLASH_SMOKE_SCREENSHOT="$screenshot" xvfb-run -a dbus-run-session -- python3 /opt/tests/test-desktop.py /usr/bin/splash
  install -D -m 0644 "$screenshot" "$SPLASH_SMOKE_SCREENSHOT"
else
  run_as_smoke xvfb-run -a dbus-run-session -- python3 /opt/tests/test-desktop.py /usr/bin/splash
fi
server=(/packages/splash-server-*.tar.gz)
tar -xf "${server[0]}"
chown -R smoke:smoke splash-server-*
run_as_smoke python3 /opt/tests/test-server-http.py splash-server-*/splash-server
