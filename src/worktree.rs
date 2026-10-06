//! Worktrees for isolated sessions.

use std::path::{Path, PathBuf};

use crate::error::{Error, Result};
use crate::git::{git, head_sha, resolves};

/// `feat: Fix the login bug!` → `fix-the-login-bug`.
pub fn slug(text: &str, max: usize) -> String {
    let mut out = String::new();
    for c in text.chars() {
        if c.is_ascii_alphanumeric() {
            out.push(c.to_ascii_lowercase());
        } else if !out.ends_with('-') && !out.is_empty() {
            out.push('-');
        }
        if out.len() >= max {
            break;
        }
    }
    out.trim_matches('-').to_string()
}

pub struct Created {
    pub path: PathBuf,
    pub branch: String,
    pub base_sha: String,
}

/// `git worktree add -b <branch> <dest> HEAD`, retrying the branch name if taken.
pub fn create(repo: &Path, dest: &Path, branch: &str) -> Result<Created> {
    let base_sha =
        head_sha(repo).ok_or_else(|| Error::Git("the repository has no commits yet".into()))?;
    create_from(repo, dest, branch, &base_sha)
}

pub fn create_from(repo: &Path, dest: &Path, branch: &str, revision: &str) -> Result<Created> {
    let base_sha = git(
        repo,
        &["rev-parse", "--verify", &format!("{revision}^{{commit}}")],
    )?
    .trim()
    .to_owned();
    if let Some(parent) = dest.parent() {
        std::fs::create_dir_all(parent)?;
    }
    let mut name = branch.to_string();
    for attempt in 2..20 {
        if !resolves(repo, &format!("refs/heads/{name}")) {
            break;
        }
        name = format!("{branch}-{attempt}");
    }
    git(
        repo,
        &[
            "worktree",
            "add",
            "-b",
            &name,
            &dest.to_string_lossy(),
            &base_sha,
        ],
    )?;
    Ok(Created {
        path: dest.to_path_buf(),
        branch: name,
        base_sha,
    })
}

/// Remove a worktree; the branch stays. `force` discards uncommitted changes.
pub fn remove(repo: &Path, dest: &Path, force: bool) -> Result<()> {
    let path = dest.to_string_lossy();
    let mut args = vec!["worktree", "remove"];
    if force {
        args.push("--force");
    }
    args.push(&path);
    git(repo, &args)?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::git::is_dirty;

    #[test]
    fn slugs() {
        assert_eq!(
            slug("feat: Fix the login bug!", 40),
            "feat-fix-the-login-bug"
        );
        assert_eq!(slug("  ---  ", 40), "");
        assert_eq!(slug("abcdefghij", 4), "abcd");
    }

    #[test]
    fn create_and_remove_a_worktree() {
        let root = std::env::temp_dir().join(crate::store::new_id("wt"));
        let repo = root.join("repo");
        std::fs::create_dir_all(&repo).unwrap();
        git(&repo, &["init", "-q"]).unwrap();
        std::fs::write(repo.join("a.txt"), "a").unwrap();
        git(&repo, &["add", "."]).unwrap();
        git(
            &repo,
            &[
                "-c",
                "user.email=t@t",
                "-c",
                "user.name=t",
                "commit",
                "-qm",
                "init",
            ],
        )
        .unwrap();

        let first = create(&repo, &root.join("wt1"), "splash/demo").unwrap();
        assert_eq!(first.branch, "splash/demo");
        assert!(first.path.join("a.txt").exists());
        // The same branch name again gets a suffix.
        let second = create(&repo, &root.join("wt2"), "splash/demo").unwrap();
        assert_eq!(second.branch, "splash/demo-2");

        // A fetched PR revision can differ from the user's current HEAD.
        std::fs::write(repo.join("a.txt"), "newer checkout").unwrap();
        git(&repo, &["add", "."]).unwrap();
        git(
            &repo,
            &[
                "-c",
                "user.email=t@t",
                "-c",
                "user.name=t",
                "commit",
                "-qm",
                "newer",
            ],
        )
        .unwrap();
        let checkout_head = head_sha(&repo).unwrap();
        std::fs::write(repo.join("untracked.txt"), "keep me").unwrap();
        let pr = create_from(&repo, &root.join("pr"), "splash/pr", &first.base_sha).unwrap();
        assert_eq!(head_sha(&pr.path).as_deref(), Some(first.base_sha.as_str()));
        assert_eq!(head_sha(&repo).as_deref(), Some(checkout_head.as_str()));
        assert_eq!(std::fs::read_to_string(pr.path.join("a.txt")).unwrap(), "a");
        assert!(repo.join("untracked.txt").exists());
        assert!(create_from(&repo, &root.join("bad"), "splash/bad", "missing-ref").is_err());

        std::fs::write(first.path.join("b.txt"), "b").unwrap();
        assert!(is_dirty(&first.path));
        assert!(
            remove(&repo, &first.path, false).is_err(),
            "dirty worktree needs force"
        );
        remove(&repo, &first.path, true).unwrap();
        assert!(!first.path.exists());
        // The branch survives.
        assert!(git(&repo, &["rev-parse", "--verify", "splash/demo"]).is_ok());
        let _ = std::fs::remove_dir_all(root);
    }
}
