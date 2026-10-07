//! Resolve executable paths using the host OS, independently of the browser OS.
use std::ffi::{OsStr, OsString};
use std::path::{Path, PathBuf};
use std::sync::OnceLock;

static PATH: OnceLock<OsString> = OnceLock::new();

pub fn path() -> &'static OsStr {
    PATH.get_or_init(|| login_shell_path().unwrap_or_else(fallback_path))
        .as_os_str()
}

#[cfg(unix)]
fn login_shell_path() -> Option<OsString> {
    let shell = std::env::var_os("SHELL").unwrap_or_else(|| "/bin/sh".into());
    let out = crate::procs::run_with_timeout(
        std::process::Command::new(shell).args(["-lic", "printf '__PATH__%s' \"$PATH\""]),
        std::time::Duration::from_secs(5),
    )?;
    if !out.status.success() {
        return None;
    }
    let text = String::from_utf8(out.stdout).ok()?;
    let (_, path) = text.rsplit_once("__PATH__")?;
    (!path.trim().is_empty()).then(|| OsString::from(path.trim()))
}

#[cfg(windows)]
fn login_shell_path() -> Option<OsString> {
    None
}

fn fallback_path() -> OsString {
    let inherited = std::env::var_os("PATH").unwrap_or_default();
    let mut parts: Vec<PathBuf> = std::env::split_paths(&inherited).collect();
    let mut extras = Vec::new();
    if let Some(home) = dirs::home_dir() {
        extras.extend([
            home.join(".local/bin"),
            home.join(".bun/bin"),
            home.join(".cargo/bin"),
        ]);
    }
    #[cfg(windows)]
    if let Some(appdata) = dirs::config_dir() {
        extras.push(appdata.join("npm"));
    }
    #[cfg(unix)]
    extras.extend([
        PathBuf::from("/opt/homebrew/bin"),
        PathBuf::from("/usr/local/bin"),
    ]);
    for extra in extras {
        if !parts.contains(&extra) {
            parts.push(extra);
        }
    }
    std::env::join_paths(parts).unwrap_or(inherited)
}

/// Search native PATH/PATHEXT. Explicit paths never fall back to another program.
pub fn which(program: &str) -> Option<PathBuf> {
    let direct = Path::new(program);
    if direct.components().count() > 1 || direct.is_absolute() {
        return executable(direct);
    }
    std::env::split_paths(path()).find_map(|dir| executable(&dir.join(program)))
}

fn executable(p: &Path) -> Option<PathBuf> {
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        p.metadata()
            .ok()
            .filter(|m| m.is_file() && m.permissions().mode() & 0o111 != 0)
            .map(|_| p.to_owned())
    }
    #[cfg(windows)]
    {
        let extensions = std::env::var("PATHEXT").unwrap_or_else(|_| ".COM;.EXE;.BAT;.CMD".into());
        if p.extension().is_some() {
            return p.is_file().then(|| p.to_owned());
        }
        extensions
            .split(';')
            .filter(|ext| ext.starts_with('.'))
            .map(|ext| {
                let mut name = p.as_os_str().to_owned();
                name.push(ext);
                PathBuf::from(name)
            })
            .find(|candidate| candidate.is_file())
    }
}

/// Native interactive shell and arguments. SPLASH_SHELL is an executable path.
pub fn shell() -> (OsString, Vec<&'static str>) {
    #[cfg(unix)]
    {
        (
            std::env::var_os("SPLASH_SHELL")
                .or_else(|| std::env::var_os("SHELL"))
                .unwrap_or_else(|| "/bin/sh".into()),
            vec!["-l"],
        )
    }
    #[cfg(windows)]
    {
        let shell = std::env::var_os("SPLASH_SHELL")
            .or_else(|| which("pwsh").map(PathBuf::into_os_string))
            .or_else(|| which("powershell").map(PathBuf::into_os_string))
            .or_else(|| std::env::var_os("COMSPEC"))
            .unwrap_or_else(|| "cmd.exe".into());
        let is_cmd = Path::new(&shell)
            .file_stem()
            .is_some_and(|s| s.to_string_lossy().eq_ignore_ascii_case("cmd"));
        (shell, if is_cmd { vec!["/D"] } else { vec!["-NoLogo"] })
    }
}
