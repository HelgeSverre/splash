# Releasing Splash

Splash's permanent bundle identifier is `no.helgesverre.splash`, following the
`no.helgesverre.*` convention used by Token, Strek and MDViewer.
On macOS the database and worktrees remain in `~/Library/Application Support/Splash`.
Windows and Linux use their native application data directories.

## GitHub Actions setup

Use `scripts/release.py setup` to validate an existing certificate export and
App Store Connect API key. By default it only validates; `--apply` configures
GitHub and stores a local notarization profile in Keychain. It checks the
certificate's expiry, matching private key, installed signing identity and
Apple authentication before writing settings. Secret values are sent to `gh`
over stdin and never printed or placed in command arguments.

Run from the Splash repository root using the local, ignored signing assets:

```bash
python3 scripts/release.py setup \
  --application-p12 signing/developer-id-application.p12 \
  --password-file signing/password.txt \
  --installer-p12 signing/developer-id-installer-release.p12 \
  --notary-key signing/AuthKey_M6BZU43Q98.p8 \
  --issuer-file signing/issuer-id.txt \
  --repo HelgeSverre/splash \
  --apply
```

This uses a team API key, not an Apple ID app-specific password. The certificate
password only decrypts the `.p12` export. Signing assets live in the local
`signing/` directory, including `issuer-id.txt`. This directory is ignored by Git,
excluded from Cargo packages and Docker build contexts, and is not an application
bundle resource. Keep its permissions at `0700` and its files at `0600`. A fresh
clone needs these files provisioned separately; they are never committed.
`developer-id-installer-release.p12` is built from `developer-id-installer.key`
and `developerID_installer.cer` with the same password file
(`openssl pkcs12 -export -legacy … -passout file:signing/password.txt`); the
original installer export has a different password. `--installer-password-file`
accepts a separate password when needed. Local non-secret configuration is written to
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
| `APPLE_INSTALLER_CERTIFICATE_BASE64` | Base64-encoded Developer ID Installer certificate and private key as `.p12`, for the `.pkg` |
| `APPLE_INSTALLER_CERTIFICATE_PASSWORD` | That `.p12`'s password, as plain text |
| `APPLE_NOTARY_KEY_BASE64` | Base64-encoded App Store Connect `.p8` API key |

Configure these repository variables:

| Variable | Value |
| --- | --- |
| `APPLE_APPLICATION_SIGNING_IDENTITY` | Full certificate identity, such as `Developer ID Application: Liseth Solutions AS (9Z2L5FBZS3)` |
| `APPLE_INSTALLER_SIGNING_IDENTITY` | Full installer identity, such as `Developer ID Installer: Liseth Solutions AS (9Z2L5FBZS3)` |
| `APPLE_NOTARY_KEY_ID` | App Store Connect API key ID |
| `APPLE_NOTARY_ISSUER_ID` | App Store Connect issuer UUID |

The workflow imports credentials into a temporary runner keychain and removes
them even if the build fails. Missing credentials fail the release; there is no
unsigned fallback.

### Universal macOS installer

After both macOS jobs finish, **macOS universal installer** runs
`scripts/package-pkg.sh` on their notarized ZIPs. It merges the two executables
with `lipo` (Splash has one executable and no frameworks), re-signs and notarizes
the universal app, staples it, and wraps it in `Splash-VERSION-macos-universal.pkg`:
a non-relocatable package that installs into `/Applications`, requires macOS 14,
and is signed with the Developer ID Installer identity, notarized and stapled.
The script verifies the expanded payload before publishing. The per-architecture
ZIPs stay in the release for people who prefer to drag the app into place.

## Automated release lifecycle

1. Set the same new version in `Cargo.toml` and `elyra.toml`, and update
   `Cargo.lock`. Commit or merge that version bump to `main`. The version bump is
   the release decision; ordinary commits with an already-tagged version do not
   create another release.
2. CI runs native checks, frontend tests, real webview/IPC smoke tests and package
   checks on macOS arm64/x64, Linux x64 and Windows x64. It also checks the Linux
   server without GUI dependencies. Candidate packages remain available as
   Actions artifacts on ordinary pushes and pull requests.
3. After successful CI on a same-repository `main` push, **Tag checked version**
   creates `vVERSION` at that exact tested commit and dispatches **Release** on
   the tag. It never moves an existing tag. It uses the built-in `GITHUB_TOKEN`;
   no personal access token or additional secret is needed. Explicit dispatch is
   necessary because token-created tag pushes do not trigger workflows.
4. Release validates all version files before starting expensive jobs. It runs
   the CI/package gate and both macOS signing jobs concurrently. macOS bundles
   use hardened runtime, an Apple-accepted notarization submission, a stapled
   ticket and verification of the extracted distribution ZIP.
5. One publishing job requires all 11 packages and their 11 SHA-256 sidecars,
   verifies their names and hashes, creates a hidden draft, uploads the complete
   set, checks the remote inventory, then publishes automatically. A failed build
   cannot publish a partial release.
6. GitHub generates release notes. Optional `.github/release-notes-VERSION.md`
   text is prepended for curated highlights. Versions such as `1.2.3-rc.1` become
   prereleases and do not become Latest; stable releases use GitHub's automatic
   version/date selection for Latest.

You can still push a matching `v*` tag yourself. The release checks the exact
commit behind that tag. Tags are serialized so overlapping runs cannot upload
at the same time. A retry resumes an incomplete draft; an already-published
release is left unchanged, including its binaries and notes.

To retry a failed release, rerun its failed Actions jobs or dispatch the workflow
on its tag:

```sh
gh workflow run release.yml --ref vVERSION
```

A manual workflow run on a branch builds signed artifacts but does not publish.
No manual approval, draft publication, release-note file or tag creation is
required in the normal version-bump flow. Signing credentials still need initial
setup and renewal when they expire. We intentionally do not infer version bumps
from arbitrary commit messages or publish every commit as a stable version.

The CI gate is rerun on the tag to keep direct tag pushes and retries equally
verified; package jobs are not duplicated inside that release run. Build caches
reduce repeated compilation. macOS runners build Apple silicon (`macos-15`) and
Intel (`macos-15-intel`) ZIPs. The frontend targets Safari 17 and the minimum
macOS version is 14.

### Historical release backfill

`v0.1.0` already had a successful release workflow and a draft containing the
original signed/notarized Apple silicon ZIP and checksum. Those original assets
were downloaded and their checksum, signature, stapled ticket and Gatekeeper
assessment verified before publishing the draft. Its tag remains at
`be6738e8fb78aae4340503acf9c2d2546ee6d083`. It does not contain the later Windows,
Linux, Intel macOS or headless packages. Newer CI binaries must never be attached
to an older tag. Other historical tags should only be backfilled from successful
builds of their exact commit, not current `main`.

References: [GitHub workflow triggering and token behavior](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow),
[generated release notes](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes),
and [release API / Latest selection](https://docs.github.com/en/rest/releases/releases).

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

## Windows, Linux and headless artifacts

The reusable `packages.yml` workflow runs with CI on main and pull requests.
It builds native Windows x64 installers and portable ZIPs, Ubuntu 24.04 x64
DEBs, AppImages and tarballs, and standalone headless server archives for all
four OS/architecture targets. Every artifact has a SHA-256 sidecar. Download
`splash-packages-*` from the completed CI run. Windows packages and standalone
server archives are unsigned; Apple signing applies to the desktop app ZIPs.

Windows uses a per-user NSIS installer and requires WebView2 Evergreen. The
MSVC runtime is statically linked for both app and server; packaging inspects PE
imports and rejects external VC++ runtime DLL dependencies. CI
silently installs into a path containing spaces, waits for the real renderer
and IPC handshake, and uninstalls. User data is retained by uninstall.

Linux AppImages use the host GTK/WebKit runtime; Ubuntu 24.04 (glibc 2.39) is
the baseline, not a claim of compatibility with older distributions. The pinned
appimagetool and its embedded runtime are checksum verified. The final image
is inspected for executable permissions on AppRun and the binary and for its
glibc symbol requirements. A fresh ordinary-user container with its own TMPDIR
then exercises the extracted AppImage, DEB payload and server archive. WebKit's
sandbox remains enabled. Xvfb covers X11; Wayland still needs a native manual
check. See the README for runtime packages and FUSE-free extraction.

On a version tag, the Release workflow waits for these packages and both
signed macOS desktop ZIPs, then one publishing job verifies and publishes the
complete release automatically. A branch workflow run only uploads Actions
artifacts. These gates are startup/install smoke tests, not exhaustive agent or
operating-system certification; see the artifact smoke-test report for coverage.

## App icon

`app/public/icon.svg` is the single source; the website favicon and the in-app
`SplashMark` use the same drop. After changing it, run `just icons` on macOS
(needs `resvg` and Pillow) and commit the outputs. Releases do not render icons.

| Output | Used by |
|---|---|
| `app/public/icon.png` | 1024px on Apple's grid: `rata bundle` source, About dialog, README |
| `packaging/icons/AppIcon.icns` | Replaces rata's scaled `.icns` in `scripts/package-release.sh` before signing |
| `packaging/icons/splash.ico` | `splash.exe` resource (`build.rs`), title bar and taskbar, NSIS installer and uninstaller |
| `packaging/icons/hicolor/` | DEB and AppImage theme icons, Linux window icon; `icon.svg` installs as the scalable size |

Sizes whose tile is under 40px show the drop alone, without the spray dots.
`splash.exe` and the installer also carry Windows version details. Linux
packages install `no.helgesverre.splash.desktop` and AppStream metadata
(`no.helgesverre.splash.metainfo.xml`) under the same ID as the icon; CI
checks both with `desktop-file-validate` and `appstreamcli validate-tree`.
