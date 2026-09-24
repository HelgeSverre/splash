//! Where a session's code lives upstream: the remote's web URL, the branch,
//! and the pull request for it (via `gh`, when installed).

use std::path::Path;
use std::time::Duration;

use serde::{Deserialize, Serialize};

use crate::worktree::git;

#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct PullRequest {
    pub number: f64,
    pub url: String,
    /// OPEN, CLOSED, MERGED.
    pub state: String,
    pub title: String,
}

#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct GitInfo {
    /// `github.com/owner/repo`, for display.
    pub repo: Option<String>,
    /// `https://github.com/owner/repo`.
    pub web_url: Option<String>,
    pub branch: Option<String>,
    /// The branch on the web, when there is a web URL.
    pub branch_url: Option<String>,
    pub pr: Option<PullRequest>,
}

pub fn info(dir: &Path) -> GitInfo {
    if !crate::worktree::is_git(dir) {
        return GitInfo::default();
    }
    let branch = crate::worktree::current_branch(dir);
    let web_url = git(dir, &["remote", "get-url", "origin"])
        .ok()
        .and_then(|r| web_url(&r));
    let repo = web_url
        .as_ref()
        .map(|u| u.trim_start_matches("https://").to_string());
    let branch_url = match (&web_url, &branch) {
        (Some(w), Some(b)) => Some(format!("{w}/tree/{b}")),
        _ => None,
    };
    let pr = match (&web_url, &branch) {
        (Some(_), Some(b)) => pull_request(dir, b),
        _ => None,
    };
    GitInfo {
        repo,
        web_url,
        branch,
        branch_url,
        pr,
    }
}

/// `git@github.com:o/r.git`, `ssh://git@host:22/o/r.git`, `https://host/o/r.git`
/// → `https://host/o/r`. Local paths and unknown schemes give `None`.
pub fn web_url(remote: &str) -> Option<String> {
    let r = remote.trim();
    let (host, path) = if let Some(rest) = r
        .strip_prefix("https://")
        .or_else(|| r.strip_prefix("http://"))
    {
        let rest = rest.rsplit_once('@').map(|(_, h)| h).unwrap_or(rest); // drop credentials
        rest.split_once('/')?
    } else if let Some(rest) = r.strip_prefix("ssh://") {
        let rest = rest.split_once('@').map(|(_, h)| h).unwrap_or(rest);
        let (host, path) = rest.split_once('/')?;
        (host.split(':').next()?, path)
    } else if let Some((user_host, path)) = r.split_once(':') {
        if user_host.contains('/') || path.starts_with("//") {
            return None;
        }
        (user_host.rsplit('@').next()?, path)
    } else {
        return None;
    };
    let path = path.trim_end_matches('/').trim_end_matches(".git");
    (!host.is_empty() && !path.is_empty()).then(|| format!("https://{host}/{path}"))
}

fn pull_request(dir: &Path, branch: &str) -> Option<PullRequest> {
    let gh = crate::agents::env::which("gh")?;
    let mut child = std::process::Command::new(gh)
        .args(["pr", "view", branch, "--json", "number,url,state,title"])
        .current_dir(dir)
        .env("PATH", crate::agents::env::path())
        .env("GH_PROMPT_DISABLED", "1")
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::null())
        .spawn()
        .ok()?;
    let deadline = std::time::Instant::now() + Duration::from_secs(5);
    while child.try_wait().ok()?.is_none() {
        if std::time::Instant::now() > deadline {
            let _ = child.kill();
            return None;
        }
        std::thread::sleep(Duration::from_millis(50));
    }
    let out = child.wait_with_output().ok()?;
    if !out.status.success() {
        return None;
    }
    let v: serde_json::Value = serde_json::from_slice(&out.stdout).ok()?;
    Some(PullRequest {
        number: v["number"].as_f64()?,
        url: v["url"].as_str()?.to_string(),
        state: v["state"].as_str().unwrap_or("").to_string(),
        title: v["title"].as_str().unwrap_or("").to_string(),
    })
}

#[cfg(test)]
mod tests {
    use super::web_url;

    #[test]
    fn remotes_normalise_to_web_urls() {
        let gh = Some("https://github.com/kwhorne/elyra".to_string());
        assert_eq!(web_url("git@github.com:kwhorne/elyra.git"), gh);
        assert_eq!(web_url("https://github.com/kwhorne/elyra.git"), gh);
        assert_eq!(web_url("https://github.com/kwhorne/elyra"), gh);
        assert_eq!(web_url("https://user:tok@github.com/kwhorne/elyra.git"), gh);
        assert_eq!(web_url("ssh://git@github.com:22/kwhorne/elyra.git"), gh);
        assert_eq!(
            web_url("git@gitlab.example.com:group/sub/proj.git"),
            Some("https://gitlab.example.com/group/sub/proj".into())
        );
        assert_eq!(web_url("/Users/me/repo"), None);
        assert_eq!(web_url("../other"), None);
    }
}
