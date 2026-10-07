# CI artifact smoke test — 7 October 2026

Tested the downloaded artifacts from [CI run 37619800935](https://github.com/HelgeSverre/splash/actions/runs/37619800935), commit `af8228e5fbcc398b3c288c16c4689a9d97424dc0` (Splash 0.1.0). No application binaries were rebuilt for these tests. Every downloaded package matched its SHA-256 sidecar.

## Linux: passed

Ubuntu 24.04 `linux/amd64` Docker containers, running through OrbStack on an Apple silicon Mac. Desktop checks ran as the unprivileged `smoke` user with Xvfb and a fresh private TMPDIR. WebKit's sandbox remained enabled; the outer Docker seccomp/AppArmor restrictions were relaxed to allow its sandbox namespaces.

- AppImage extraction, executable startup, real frontend render and IPC readiness passed.
- The extracted DEB payload passed; a separate container then installed the DEB through `apt-get install` and launched `/usr/bin/splash` successfully.
- The desktop tarball extracted and passed the renderer/IPC readiness check.
- The headless server archive passed version/help, startup, duplicate data-directory lock rejection, token login, authenticated assets/state and foreign-Origin rejection.
- An actual screenshot of the installed DEB is in the README gallery.

The first screenshot attempt exhausted local host disk space and stopped OrbStack. After removing this task's temporary build outputs and restarting it, the installed-DEB and tarball tests plus screenshot capture passed again. This was a test-host storage failure, not a Splash startup failure.

## Windows: passed

A dedicated `t3.large` EC2 instance in `eu-north-1`, using the `lisethsolutions` AWS profile and Amazon's `Windows_Server-2025-English-Full-Base-2026.09.17` AMI. No inbound security-group rules were opened. Systems Manager targeted the exact newly created instance ID; application checks ran in interactive desktop session 1 as the non-administrator `SplashSmoke` user.

WebView2 Evergreen `154.0.4258.62` was installed from Microsoft's signature-verified installer. Python 3.13.7's embedded distribution ran the test scripts. No Visual Studio, compiler, or additional VC++ redistributable was installed. The Amazon AMI already contained VC++ runtime DLLs, so runtime absence is not claimed; the separate PE import checks confirmed that both Splash executables import no external VC++ runtime DLLs.

- Portable ZIP extracted and passed real frontend render/IPC readiness.
- The per-user installer installed into a path containing spaces, created its HKCU uninstall entry, and passed the installed-app renderer/IPC test.
- The headless server ZIP passed the same HTTP/authentication and data-directory locking checks as Linux.
- The installer uninstalled successfully: its application executable and uninstall registry entry were removed, while the isolated user-data directory remained.
- The installed app was maximized and captured on the real Windows desktop. The scheduled test task completed with exit code 0 and a PASS result.

## Scope

These are artifact installation/startup smoke tests, not provider certification. No private conversations, agent accounts or real agent prompts were used. Windows Server 2025 is the tested VM OS; Windows 11 was not separately tested. Linux tests used X11/Xvfb and AppImage extraction, not Wayland or FUSE mounting. The macOS build was not retested in this exercise.

## Cleanup

The explicitly created instance `i-0bb8af246e9583f8a` was terminated. A subsequent exact-ID query confirmed its `terminated` state, and its root volume was confirmed deleted. Cleanup removed the dedicated VPC, subnet, route table, internet gateway, security group, IAM role and instance profile, and temporary S3 bucket. Follow-up queries confirmed the VPC, IAM role/profile and bucket no longer exist.

No other EC2 instance was enumerated, modified, stopped or terminated.

## Artifact checksums

```text
aa21561b1b87d06c5f14a9182ba0498176c0f968d470f19aab575a1e38eee766  linux/Splash-0.1.0-linux-x86_64.AppImage
76c9c240baa2c209ebe3e173bf2135305db2d377399726584a50c7f935cce668  linux/Splash-0.1.0-linux-x86_64.deb
b7dedde6f74fe98c651a65788e9247a02ebe1773b39409bc9e5c26a4227df928  linux/Splash-0.1.0-linux-x86_64.tar.gz
11c2cc25ac5c4dd1aa80bb51d44b044b93028f431f678aa78702a1918b2d1fe0  linux/splash-server-0.1.0-linux-x86_64.tar.gz
1c6e84ae2b7af67a2e044bc380e5dc78b3d58840de0161b87ab7dcecfac53949  windows/Splash-0.1.0-windows-x86_64-setup.exe
6d8df64c1d628a5026dcced60ee6ff3d20f1167b8a8b1bb9114660a364d06f79  windows/Splash-0.1.0-windows-x86_64.zip
f5ac53c8a411efd5f7378a5579c7b229269a0eda81dd2536214c3ef07cd80f8e  windows/splash-server-0.1.0-windows-x86_64.zip
```
