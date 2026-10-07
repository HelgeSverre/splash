# Elyra headless feature patch

MIT-licensed Elyra v0.8.0, upstream commit fb0bbd4 (see Cargo.lock for the full
revision of sibling crates). Source retained locally so native desktop and
headless builds use the same command router, security policy, and event bus.

Changes: optional `desktop` feature gates tao/wry/muda and the window event loop;
HTTP types come directly from the `http` crate. `system` implies desktop.
Headless window operations report unavailable. Linux uses Wry build_gtk with
Tao’s default GTK container for X11 and Wayland support. Sibling crates remain pinned
to upstream v0.8.0. No change to the IPC format or router authorization.

When updating Elyra, reapply/review these changes and run the server HTTP tests
with `--no-default-features`, plus the desktop matrix. Remove this copy when
upstream provides an equivalent supported feature boundary.

Enable Wry `linux-body` so Linux custom-protocol IPC receives MessagePack POST
bodies (requires WebKitGTK 2.40+, satisfied by Ubuntu 24.04). Native renderer
smoke tests exercise this round trip.

On Windows, the initialization script translates the 0.8 runtime's exact
`elyra://localhost/` fetch prefix to Wry's `http://elyra.localhost/` WebView2
origin. Token/client headers and router authorization are unchanged. Remove
this bridge when the frontend runtime supports the platform origin itself.

`App::window_icon(WindowIcon)` sets each window's title-bar and task-switcher
icon on Windows and Linux; upstream sets none. `WindowIcon::Png` decodes with the `png` crate already in
the desktop dependency graph; `WindowIcon::Resource` loads an icon embedded in
the Windows executable at the window's 16px and 32px logical sizes. macOS keeps
using the bundle icon.
