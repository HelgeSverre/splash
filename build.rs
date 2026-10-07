//! Embeds the app icon and version details in the Windows desktop executable,
//! where Explorer, the taskbar, Task Manager and file properties read them.

use std::env;
use std::path::PathBuf;

fn main() {
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rerun-if-changed=Cargo.toml");
    println!("cargo:rerun-if-changed=packaging/icons/splash.ico");
    let windows = env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("windows");
    if windows && env::var_os("CARGO_FEATURE_DESKTOP").is_some() {
        windows_resource();
    }
}

fn windows_resource() {
    let var = |name: &str| env::var(name).unwrap_or_else(|_| panic!("cargo sets {name}"));
    let root = PathBuf::from(var("CARGO_MANIFEST_DIR"));
    // Forward slashes keep the resource compiler from reading `\` as an escape.
    let icon = root
        .join("packaging/icons/splash.ico")
        .display()
        .to_string()
        .replace('\\', "/");
    let version = var("CARGO_PKG_VERSION");
    let numeric = format!(
        "{},{},{},0",
        var("CARGO_PKG_VERSION_MAJOR"),
        var("CARGO_PKG_VERSION_MINOR"),
        var("CARGO_PKG_VERSION_PATCH")
    );
    let company = var("CARGO_PKG_AUTHORS");
    // Icon resource 1 is the one Explorer shows and `WindowIcon::Resource(1)` loads.
    let rc = format!(
        r#"#pragma code_page(65001)
1 ICON "{icon}"
1 VERSIONINFO
FILEVERSION {numeric}
PRODUCTVERSION {numeric}
FILEFLAGSMASK 0x3F
FILEFLAGS 0
FILEOS 0x40004
FILETYPE 1
FILESUBTYPE 0
BEGIN
  BLOCK "StringFileInfo"
  BEGIN
    BLOCK "040904B0"
    BEGIN
      VALUE "CompanyName", "{company}"
      VALUE "FileDescription", "Splash"
      VALUE "FileVersion", "{version}"
      VALUE "InternalName", "splash"
      VALUE "LegalCopyright", "Copyright © 2026 {company}. MIT License."
      VALUE "OriginalFilename", "splash.exe"
      VALUE "ProductName", "Splash"
      VALUE "ProductVersion", "{version}"
    END
  END
  BLOCK "VarFileInfo"
  BEGIN
    VALUE "Translation", 0x409, 1200
  END
END
"#
    );
    let path = PathBuf::from(var("OUT_DIR")).join("splash-desktop.rc");
    std::fs::write(&path, rc).expect("write the Windows resource script");
    embed_resource::compile_for(&path, ["splash"], embed_resource::NONE)
        .manifest_required()
        .expect("compile the Windows resource script (needs rc.exe, llvm-rc or windres)");
}
