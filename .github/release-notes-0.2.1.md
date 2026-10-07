# Splash 0.2.1

A universal installer for macOS: one package for Apple silicon and Intel Macs
that puts Splash in Applications.

## New

- **`Splash-0.2.1-macos-universal.pkg`:** one installer for every Mac running
  macOS 14 or later. The app inside runs natively on Apple silicon and Intel.
  It is signed with a Developer ID, notarized by Apple, and stapled, as is the
  installer itself.

## Downloads

| Platform | Files |
| --- | --- |
| macOS 14+ | `Splash-0.2.1-macos-universal.pkg` (Apple silicon and Intel), or `Splash-0.2.1-macos-arm64.zip` / `Splash-0.2.1-macos-x86_64.zip` to drag into Applications. |
| Windows 11 x64 | `Splash-0.2.1-windows-x86_64-setup.exe` (per-user installer), `Splash-0.2.1-windows-x86_64.zip` (portable). Requires the WebView2 Runtime. |
| Ubuntu 24.04 x64 | `Splash-0.2.1-linux-x86_64.deb`, `.AppImage` and `.tar.gz`. Install the `.deb` with apt to pull in GTK and WebKit. |
| Headless server | `splash-server-0.2.1-<os>-<arch>` for macOS (Apple silicon and Intel), Linux and Windows. |

Every archive and installer has an adjacent SHA-256 checksum.

See the [README](https://github.com/HelgeSverre/splash#readme) for setup and
[open an issue](https://github.com/HelgeSverre/splash/issues/new/choose) for bugs
or compatibility problems.
