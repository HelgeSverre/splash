//! Running git: one place that sets the resolved `PATH` and turns off
//! credential prompts, plus the few questions Splash asks of a repository.

use std::path::Path;
use std::process::{Command, Output};

use crate::agents::env;
use crate::error::{Error, Result};

fn run(dir: &Path, args: &[&str]) -> Result<Output> {
    Command::new("git")
        .args(args)
        .current_dir(dir)
        .env("PATH", env::path())
        .env("GIT_TERMINAL_PROMPT", "0")
        .output()
        .map_err(|e| Error::Git(format!("git: {e}")))
}

/// Stdout as text (trailing newline trimmed), or stderr as the error.
pub fn git(dir: &Path, args: &[&str]) -> Result<String> {
    let out = run(dir, args)?;
    if out.status.success() {
        Ok(String::from_utf8_lossy(&out.stdout).trim_end().to_string())
    } else {
        Err(Error::Git(
            String::from_utf8_lossy(&out.stderr).trim().to_string(),
        ))
    }
}

/// Stdout as raw bytes, for file contents that may not be text.
pub fn git_bytes(dir: &Path, args: &[&str]) -> Result<Vec<u8>> {
    let out = run(dir, args)?;
    if out.status.success() {
        Ok(out.stdout)
    } else {
        Err(Error::Git(
            String::from_utf8_lossy(&out.stderr).trim().to_string(),
        ))
    }
}

pub fn is_git(dir: &Path) -> bool {
    git(dir, &["rev-parse", "--is-inside-work-tree"]).is_ok_and(|s| s == "true")
}

pub fn head_sha(dir: &Path) -> Option<String> {
    git(dir, &["rev-parse", "HEAD"]).ok()
}

/// Resolve `HEAD`, retaining errors that callers need to present.
///
/// `git rev-parse --verify --quiet HEAD` reserves exit status 1 for an
/// unborn `HEAD`. Other non-zero statuses, including a missing working
/// directory or a failed Git invocation, remain errors instead of looking
/// like a new repository.
pub fn checked_head_sha(dir: &Path) -> Result<Option<String>> {
    let out = run(dir, &["rev-parse", "--verify", "--quiet", "HEAD"])?;
    match out.status.code() {
        Some(0) => Ok(Some(
            String::from_utf8_lossy(&out.stdout).trim_end().to_string(),
        )),
        Some(1) => Ok(None),
        _ => {
            let stderr = String::from_utf8_lossy(&out.stderr).trim().to_string();
            let message = if stderr.is_empty() {
                format!("git rev-parse failed: {}", out.status)
            } else {
                stderr
            };
            Err(Error::Git(message))
        }
    }
}

pub fn current_branch(dir: &Path) -> Option<String> {
    git(dir, &["rev-parse", "--abbrev-ref", "HEAD"])
        .ok()
        .filter(|b| b != "HEAD")
}

/// Whether `rev` names a commit here.
pub fn resolves(dir: &Path, rev: &str) -> bool {
    git(dir, &["rev-parse", "--verify", "--quiet", rev]).is_ok()
}

/// Uncommitted changes (tracked or untracked).
pub fn is_dirty(dir: &Path) -> bool {
    git(dir, &["status", "--porcelain"]).is_ok_and(|s| !s.is_empty())
}

/// Forget worktrees whose folders are gone.
pub fn prune(repo: &Path) {
    let _ = git(repo, &["worktree", "prune"]);
}
