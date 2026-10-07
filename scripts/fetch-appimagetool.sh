#!/usr/bin/env bash
set -euo pipefail
mkdir -p target/appimage-tools
cd target/appimage-tools
curl --fail --location --retry 3 https://github.com/AppImage/appimagetool/releases/download/1.9.1/appimagetool-x86_64.AppImage --output appimagetool
printf '%s\n' 'ed4ce84f0d9caff66f50bcca6ff6f35aae54ce8135408b3fa33abfc3cb384eb0  appimagetool' | sha256sum --check
chmod 0755 appimagetool
# Reuse the verified tool image runtime; do not fetch an unpinned runtime.
offset=$(env -u APPIMAGE_EXTRACT_AND_RUN ./appimagetool --appimage-offset)
[[ "$offset" =~ ^[0-9]+$ && "$offset" -gt 0 ]]
head -c "$offset" appimagetool > runtime
