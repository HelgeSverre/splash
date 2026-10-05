# Releasing Splash

Splash's permanent bundle identifier is `no.helgesverre.splash`, following the
`no.helgesverre.*` convention used by Token, Strek and MDViewer.
The database and worktrees remain in `~/Library/Application Support/Splash`.

## GitHub Actions setup

Use `scripts/release.py setup` to validate an existing certificate export and
App Store Connect API key. By default it only validates; `--apply` configures
GitHub and stores a local notarization profile in Keychain. It checks the
certificate's expiry, matching private key, installed signing identity and
Apple authentication before writing settings. Secret values are sent to `gh`
over stdin and never printed or placed in command arguments.

For the existing shared Sourcefour assets:

```bash
python3 scripts/release.py setup \
  --application-p12 ../sourcefour/signing/developer-id-application.p12 \
  --password-file ../sourcefour/signing/password.txt \
  --notary-key ../sourcefour/signing/AuthKey_M6BZU43Q98.p8 \
  --issuer-id "$(gh variable get APPLE_NOTARY_ISSUER_ID --repo HelgeSverre/sourcefour)" \
  --repo HelgeSverre/splash \
  --apply
```

This uses a team API key, not an Apple ID app-specific password. The certificate
password only decrypts the `.p12` export. The shared assets are read in place;
they are not copied into Splash. Local non-secret configuration is written to
`~/.config/splash/release.json` (override with `SPLASH_RELEASE_CONFIG`), and the
default Keychain profile is `splash-notary`. The default GitHub repository comes
from the current checkout; `--repo` makes the destination explicit.

After setup:

```bash
just release-status   # validate Apple authentication and GitHub settings
just release          # check, build, sign, notarize, staple, verify; no publication
```

`just release` writes a timestamped ZIP and SHA-256 file under `target/distrib`.
To package an already-built app, run `python3 scripts/release.py package`.
The setup helper requires macOS, Python 3.9+, OpenSSL, Xcode command-line tools,
and an authenticated GitHub CLI with permission to manage repository settings.
Re-running setup with `--apply` updates Splash's named secrets, variables and
Keychain profile. The settings it manages are listed below.

Configure these repository secrets using the same Apple signing assets as your
other desktop projects:

| Secret | Value |
| --- | --- |
| `APPLE_APPLICATION_CERTIFICATE_BASE64` | Base64-encoded Developer ID Application certificate and private key exported as `.p12` |
| `APPLE_APPLICATION_CERTIFICATE_PASSWORD` | The `.p12` password, as plain text (not base64) |
| `APPLE_NOTARY_KEY_BASE64` | Base64-encoded App Store Connect `.p8` API key |

Configure these repository variables:

| Variable | Value |
| --- | --- |
| `APPLE_APPLICATION_SIGNING_IDENTITY` | Full certificate identity, such as `Developer ID Application: Liseth Solutions AS (9Z2L5FBZS3)` |
| `APPLE_NOTARY_KEY_ID` | App Store Connect API key ID |
| `APPLE_NOTARY_ISSUER_ID` | App Store Connect issuer UUID |

The workflow imports credentials into a temporary runner keychain and removes
them even if the build fails. Missing credentials fail the release; there is no
unsigned fallback. No Installer certificate is needed for the app ZIP.

## Create a release

1. Set the same version in `Cargo.toml` and `elyra.toml`, and update `Cargo.lock`.
2. Write `.github/release-notes-VERSION.md`, commit the changes and push a
   matching tag, for example `v0.1.0`.
3. The Release workflow runs the reusable CI gate on that exact commit before
   building the app. It then signs with hardened runtime and a secure timestamp,
   submits to Apple, requires an accepted notarization result, and staples the app.
4. The workflow packages the stapled app, extracts the ZIP, checks its signature,
   ticket and Gatekeeper assessment, and creates a SHA-256 checksum.
5. Download and launch the app on a clean Mac, exercise an agent session, cancel,
   restart/resume and the dirty-worktree deletion confirmation, then publish the
   draft release manually.

Manual workflow runs also require signing and notarization. They upload Actions
artifacts; runs on branches do not create a GitHub release. The ZIP name records
the build host architecture. The current `macos-15` runner builds for Apple Silicon.

## Local verification

Build and check the app:

```bash
just frontend
just check
rata build
rata bundle
```

With the Developer ID certificate already in your keychain and notarization
credentials stored using `xcrun notarytool store-credentials`, run:

```bash
export APPLE_APPLICATION_SIGNING_IDENTITY='Developer ID Application: Liseth Solutions AS (9Z2L5FBZS3)'
export APPLE_NOTARY_PROFILE='your-notary-profile'
scripts/package-release.sh target/release/bundle/Splash.app target/distrib/Splash-local.zip
```

Alternatively, set `APPLE_NOTARY_KEY_PATH`, `APPLE_NOTARY_KEY_ID` and
`APPLE_NOTARY_ISSUER_ID` for API-key authentication. The script submits the app to
Apple and produces the ZIP only after all checks pass. Choose a new output path
for each run; existing ZIPs are not overwritten. Running `rata bundle` again
replaces the signed bundle with an ad-hoc signed one, so rerun the release script
after rebuilding.

References: [Apple's notarization workflow](https://developer.apple.com/documentation/security/customizing-the-notarization-workflow)
and [GitHub's certificate setup](https://docs.github.com/en/actions/how-tos/deploy/deploy-to-third-party-platforms/sign-xcode-applications).
