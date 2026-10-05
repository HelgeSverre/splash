#!/usr/bin/env bash
# Sign an existing rata bundle, notarize it, and verify the final ZIP.
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: scripts/package-release.sh APP_PATH OUTPUT_ZIP" >&2
  exit 2
fi
app_path="$1"
archive="$2"
: "${APPLE_APPLICATION_SIGNING_IDENTITY:?Set a Developer ID Application signing identity}"
if [[ "$APPLE_APPLICATION_SIGNING_IDENTITY" != "Developer ID Application: "* ]]; then
  echo "A Developer ID Application identity is required" >&2
  exit 1
fi

notary_args=()
if [[ -n "${APPLE_NOTARY_PROFILE:-}" ]]; then
  notary_args=(--keychain-profile "$APPLE_NOTARY_PROFILE")
else
  : "${APPLE_NOTARY_KEY_PATH:?Set APPLE_NOTARY_KEY_PATH or APPLE_NOTARY_PROFILE}"
  : "${APPLE_NOTARY_KEY_ID:?Set APPLE_NOTARY_KEY_ID}"
  : "${APPLE_NOTARY_ISSUER_ID:?Set APPLE_NOTARY_ISSUER_ID}"
  notary_args=(--key "$APPLE_NOTARY_KEY_PATH" --key-id "$APPLE_NOTARY_KEY_ID" --issuer "$APPLE_NOTARY_ISSUER_ID")
fi

[[ -x "$app_path/Contents/MacOS/splash" ]] || { echo "Missing Splash executable" >&2; exit 1; }
identifier=$(plutil -extract CFBundleIdentifier raw -o - "$app_path/Contents/Info.plist")
[[ "$identifier" == "no.helgesverre.splash" ]] || { echo "Unexpected bundle identifier: $identifier" >&2; exit 1; }
[[ ! -e "$archive" ]] || { echo "Archive already exists: $archive" >&2; exit 1; }
mkdir -p "$(dirname "$archive")"
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT

signing_args=(--force --options runtime --timestamp --sign "$APPLE_APPLICATION_SIGNING_IDENTITY")
if [[ -n "${APPLE_SIGNING_KEYCHAIN:-}" ]]; then
  signing_args+=(--keychain "$APPLE_SIGNING_KEYCHAIN")
fi
# Splash has one executable and no embedded frameworks or helper apps.
codesign "${signing_args[@]}" "$app_path"
codesign --verify --deep --strict --verbose=2 "$app_path"
ditto -c -k --keepParent "$app_path" "$scratch/submission.zip"
notary_exit=0
xcrun notarytool submit "$scratch/submission.zip" "${notary_args[@]}" \
  --wait --timeout 30m --output-format json > "$scratch/notarization.json" || notary_exit=$?
cat "$scratch/notarization.json"
notary_status=$(plutil -extract status raw -o - "$scratch/notarization.json" 2>/dev/null || true)
if [[ "$notary_exit" -ne 0 || "$notary_status" != "Accepted" ]]; then
  submission=$(plutil -extract id raw -o - "$scratch/notarization.json" 2>/dev/null || true)
  if [[ -n "$submission" ]]; then
    xcrun notarytool log "$submission" "${notary_args[@]}" || true
  fi
  echo "Notarization was not accepted" >&2
  exit 1
fi
xcrun stapler staple "$app_path"
xcrun stapler validate "$app_path"
spctl --assess --type execute --verbose=2 "$app_path"

# Package only after stapling, then verify what a recipient will extract.
ditto -c -k --keepParent "$app_path" "$scratch/release.zip"
ditto -x -k "$scratch/release.zip" "$scratch/extracted"
extracted="$scratch/extracted/$(basename "$app_path")"
codesign --verify --deep --strict --verbose=2 "$extracted"
xcrun stapler validate "$extracted"
spctl --assess --type execute --verbose=2 "$extracted"
mv "$scratch/release.zip" "$archive"
(
  cd "$(dirname "$archive")"
  shasum -a 256 "$(basename "$archive")" > "$(basename "$archive").sha256"
)
