//! The environment agents run in. A Dock-launched macOS app inherits a bare
//! `PATH`, so resolve the user's login-shell `PATH` once and use it everywhere.

use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::OnceLock;
use std::time::Duration;

use crate::procs::run_with_timeout;

static PATH: OnceLock<String> = OnceLock::new();

/// The login shell's `PATH`, falling back to the current one plus the usual
/// install locations.
pub fn path() -> &'static str {
    PATH.get_or_init(|| login_shell_path().unwrap_or_else(fallback_path))
}

fn login_shell_path() -> Option<String> {
    let shell = std::env::var("SHELL").unwrap_or_else(|_| "/bin/sh".into());
    // An interactive rc file can hang (prompts, plugins): give it 5s.
    let out = run_with_timeout(
        Command::new(shell).args(["-lic", "printf '__PATH__%s' \"$PATH\""]),
        Duration::from_secs(5),
    )?;
    let text = String::from_utf8_lossy(&out.stdout);
    let path = text.rsplit("__PATH__").next()?.trim().to_string();
    (!path.is_empty()).then_some(path)
}

fn fallback_path() -> String {
    let home = std::env::var("HOME").unwrap_or_default();
    let mut parts: Vec<String> = std::env::var("PATH")
        .unwrap_or_default()
        .split(':')
        .map(String::from)
        .collect();
    for extra in [
        format!("{home}/.local/bin"),
        format!("{home}/.bun/bin"),
        format!("{home}/.cargo/bin"),
        "/opt/homebrew/bin".into(),
        "/usr/local/bin".into(),
    ] {
        if !parts.contains(&extra) {
            parts.push(extra);
        }
    }
    parts.join(":")
}

/// Locate `program` on the resolved `PATH`.
pub fn which(program: &str) -> Option<PathBuf> {
    if program.contains('/') {
        let p = PathBuf::from(program);
        return is_executable(&p).then_some(p);
    }
    path()
        .split(':')
        .map(|dir| Path::new(dir).join(program))
        .find(|p| is_executable(p))
}

fn is_executable(p: &Path) -> bool {
    use std::os::unix::fs::PermissionsExt;
    p.metadata()
        .map(|m| m.is_file() && m.permissions().mode() & 0o111 != 0)
        .unwrap_or(false)
}
