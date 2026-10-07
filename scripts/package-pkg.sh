#!/usr/bin/env bash
# Build the universal macOS installer from the two notarized release ZIPs:
# merge the Apple silicon and Intel executables into one app, sign and
# notarize it, then wrap it in a signed, notarized and stapled .pkg that
# installs Splash into /Applications.
set -euo pipefail

if [[ $# -ne 3 ]]; then
  echo "Usage: scripts/package-pkg.sh ARM64_ZIP X86_64_ZIP OUTPUT_PKG" >&2
  exit 2
fi
arm_zip="$1"
x86_zip="$2"
package="$3"
: "${APPLE_APPLICATION_SIGNING_IDENTITY:?Set a Developer ID Application signing identity}"
: "${APPLE_INSTALLER_SIGNING_IDENTITY:?Set a Developer ID Installer signing identity}"
[[ "$APPLE_APPLICATION_SIGNING_IDENTITY" == "Developer ID Application: "* ]] || { echo "A Developer ID Application identity is required" >&2; exit 1; }
[[ "$APPLE_INSTALLER_SIGNING_IDENTITY" == "Developer ID Installer: "* ]] || { echo "A Developer ID Installer identity is required" >&2; exit 1; }

notary_args=()
if [[ -n "${APPLE_NOTARY_PROFILE:-}" ]]; then
  notary_args=(--keychain-profile "$APPLE_NOTARY_PROFILE")
else
  : "${APPLE_NOTARY_KEY_PATH:?Set APPLE_NOTARY_KEY_PATH or APPLE_NOTARY_PROFILE}"
  : "${APPLE_NOTARY_KEY_ID:?Set APPLE_NOTARY_KEY_ID}"
  : "${APPLE_NOTARY_ISSUER_ID:?Set APPLE_NOTARY_ISSUER_ID}"
  notary_args=(--key "$APPLE_NOTARY_KEY_PATH" --key-id "$APPLE_NOTARY_KEY_ID" --issuer "$APPLE_NOTARY_ISSUER_ID")
fi
keychain_args=()
[[ -z "${APPLE_SIGNING_KEYCHAIN:-}" ]] || keychain_args=(--keychain "$APPLE_SIGNING_KEYCHAIN")

[[ ! -e "$package" ]] || { echo "Package already exists: $package" >&2; exit 1; }
mkdir -p "$(dirname "$package")"
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT

notarize() {
  local submission="$1" result status id exit_code=0
  result="$scratch/notarization-$(basename "$submission").json"
  xcrun notarytool submit "$submission" "${notary_args[@]}" \
    --wait --timeout 30m --output-format json > "$result" || exit_code=$?
  cat "$result"
  status=$(plutil -extract status raw -o - "$result" 2>/dev/null || true)
  if [[ "$exit_code" -ne 0 || "$status" != "Accepted" ]]; then
    id=$(plutil -extract id raw -o - "$result" 2>/dev/null || true)
    [[ -z "$id" ]] || xcrun notarytool log "$id" "${notary_args[@]}" || true
    echo "Notarization was not accepted: $(basename "$submission")" >&2
    exit 1
  fi
}

# Both inputs must be the same release of the same app, one per architecture.
ditto -x -k "$arm_zip" "$scratch/arm64"
ditto -x -k "$x86_zip" "$scratch/x86_64"
info() { plutil -extract "$2" raw -o - "$scratch/$1/Splash.app/Contents/Info.plist"; }
for arch in arm64 x86_64; do
  [[ "$(info "$arch" CFBundleIdentifier)" == "no.helgesverre.splash" ]] || { echo "Unexpected bundle identifier in the $arch app" >&2; exit 1; }
  [[ "$(lipo -archs "$scratch/$arch/Splash.app/Contents/MacOS/splash")" == "$arch" ]] || { echo "The $arch ZIP holds a different architecture" >&2; exit 1; }
done
version=$(info arm64 CFBundleShortVersionString)
[[ "$(info x86_64 CFBundleShortVersionString)" == "$version" ]] || { echo "The two apps have different versions" >&2; exit 1; }

# The Apple silicon bundle supplies everything but the executable. Splash has
# one executable and no embedded frameworks or helper apps, so a single lipo
# makes the bundle universal. Its old signature and stapled ticket no longer
# match and are replaced.
root="$scratch/root"
app="$root/Applications/Splash.app"
mkdir -p "$root/Applications"
ditto "$scratch/arm64/Splash.app" "$app"
lipo -create -output "$app/Contents/MacOS/splash" \
  "$scratch/arm64/Splash.app/Contents/MacOS/splash" "$scratch/x86_64/Splash.app/Contents/MacOS/splash"
[[ "$(lipo -archs "$app/Contents/MacOS/splash")" == "x86_64 arm64" ]] || { echo "Universal executable is missing an architecture" >&2; exit 1; }
rm -f "$app/Contents/CodeResources"
codesign --remove-signature "$app"
codesign --force --options runtime --timestamp --sign "$APPLE_APPLICATION_SIGNING_IDENTITY" ${keychain_args[@]+"${keychain_args[@]}"} "$app"
codesign --verify --deep --strict --verbose=2 "$app"
ditto -c -k --keepParent "$app" "$scratch/Splash-app.zip"
notarize "$scratch/Splash-app.zip"
xcrun stapler staple "$app"
spctl --assess --type execute --verbose=2 "$app"

# Install to /Applications only: a relocatable bundle would update a copy of
# Splash found anywhere else on the disk instead.
pkgbuild --analyze --root "$root" "$scratch/components.plist"
plutil -replace 0.BundleIsRelocatable -bool NO "$scratch/components.plist"
mkdir -p "$scratch/packages"
pkgbuild --root "$root" --component-plist "$scratch/components.plist" \
  --identifier no.helgesverre.splash --version "$version" --install-location / \
  "$scratch/packages/Splash.pkg"
cat > "$scratch/distribution.xml" <<EOF
<?xml version="1.0" encoding="utf-8"?>
<installer-gui-script minSpecVersion="2">
  <title>Splash</title>
  <options customize="never" require-scripts="false" hostArchitectures="arm64,x86_64"/>
  <domains enable_localSystem="true"/>
  <volume-check>
    <allowed-os-versions><os-version min="14.0"/></allowed-os-versions>
  </volume-check>
  <choices-outline>
    <line choice="default"><line choice="no.helgesverre.splash"/></line>
  </choices-outline>
  <choice id="default"/>
  <choice id="no.helgesverre.splash" visible="false"><pkg-ref id="no.helgesverre.splash"/></choice>
  <pkg-ref id="no.helgesverre.splash" version="$version" onConclusion="none">Splash.pkg</pkg-ref>
</installer-gui-script>
EOF
productbuild --distribution "$scratch/distribution.xml" --package-path "$scratch/packages" \
  --sign "$APPLE_INSTALLER_SIGNING_IDENTITY" ${keychain_args[@]+"${keychain_args[@]}"} --timestamp "$scratch/Splash.pkg"
pkgutil --check-signature "$scratch/Splash.pkg"
notarize "$scratch/Splash.pkg"
xcrun stapler staple "$scratch/Splash.pkg"
xcrun stapler validate "$scratch/Splash.pkg"
spctl --assess --type install --verbose=2 "$scratch/Splash.pkg"

# Verify what the installer will actually put on disk.
pkgutil --expand-full "$scratch/Splash.pkg" "$scratch/expanded"
installed="$scratch/expanded/Splash.pkg/Payload/Applications/Splash.app"
codesign --verify --deep --strict --verbose=2 "$installed"
xcrun stapler validate "$installed"
[[ "$(lipo -archs "$installed/Contents/MacOS/splash")" == "x86_64 arm64" ]] || { echo "Installed executable is not universal" >&2; exit 1; }

mv "$scratch/Splash.pkg" "$package"
(
  cd "$(dirname "$package")"
  shasum -a 256 "$(basename "$package")" > "$(basename "$package").sha256"
)
