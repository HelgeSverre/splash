//! What's in a session's folder: git changes, file contents, the tree, and a
//! watcher that says when any of it moved. Every path is kept inside the
//! session's folder.

use std::path::{Component, Path, PathBuf};
use std::time::Duration;

use serde::{Deserialize, Serialize};

use crate::git::{self, git};

/// Files larger than this are shown as "too large".
const MAX_FILE: u64 = 1_000_000;

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct FileChange {
    /// Relative to the session folder.
    pub path: String,
    /// M modified, A added, D deleted, ? untracked, T type change.
    pub status: String,
    pub additions: u32,
    pub deletions: u32,
    pub binary: bool,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct FileDiff {
    pub path: String,
    /// At the base commit; `None` when the file is new.
    pub old: Option<String>,
    /// On disk; `None` when deleted.
    pub new: Option<String>,
    pub binary: bool,
    pub too_large: bool,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct DirEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct FileContent {
    pub path: String,
    pub text: Option<String>,
    pub binary: bool,
    pub too_large: bool,
    pub size: f64,
}

/// Resolve `path` (relative, or absolute inside `root`) to a relative path,
/// refusing anything that would escape `root`.
pub fn relative(root: &Path, path: &str) -> Result<PathBuf, String> {
    let p = Path::new(path);
    let rel = if p.is_absolute() {
        let root_c = root.canonicalize().unwrap_or_else(|_| root.to_path_buf());
        p.strip_prefix(&root_c)
            .or_else(|_| p.strip_prefix(root))
            .map_err(|_| format!("{path} is outside the session folder"))?
            .to_path_buf()
    } else {
        p.to_path_buf()
    };
    if rel
        .components()
        .any(|c| !matches!(c, Component::Normal(_) | Component::CurDir))
    {
        return Err(format!("{path} is outside the session folder"));
    }
    // Symlinks could still point out; check the real location when it exists.
    let full = root.join(&rel);
    if let (Ok(real), Ok(real_root)) = (full.canonicalize(), root.canonicalize()) {
        if !real.starts_with(&real_root) {
            return Err(format!("{path} links outside the session folder"));
        }
    }
    Ok(rel)
}

/// Changes in `root` against `base` (a commit; `HEAD` for in-place sessions),
/// including untracked files.
pub fn status(root: &Path, base: &str) -> Result<Vec<FileChange>, String> {
    if !git::is_git(root) {
        return Ok(Vec::new());
    }
    let base = base_or_head(root, base);
    let mut changes: Vec<FileChange> = Vec::new();

    // Statuses, then line counts, for tracked files (working tree vs base).
    let names = git(
        root,
        &["diff", "--no-renames", "--name-status", "-z", base, "--"],
    )
    .unwrap_or_default();
    let mut parts = names.split('\0').filter(|s| !s.is_empty());
    while let (Some(st), Some(path)) = (parts.next(), parts.next()) {
        changes.push(FileChange {
            path: path.to_string(),
            status: st.chars().next().unwrap_or('M').to_string(),
            additions: 0,
            deletions: 0,
            binary: false,
        });
    }
    let nums = git(
        root,
        &["diff", "--no-renames", "--numstat", "-z", base, "--"],
    )
    .unwrap_or_default();
    for rec in nums.split('\0').filter(|s| !s.is_empty()) {
        let mut f = rec.splitn(3, '\t');
        let (Some(a), Some(d), Some(path)) = (f.next(), f.next(), f.next()) else {
            continue;
        };
        if let Some(c) = changes.iter_mut().find(|c| c.path == path) {
            c.binary = a == "-";
            c.additions = a.parse().unwrap_or(0);
            c.deletions = d.parse().unwrap_or(0);
        }
    }

    let untracked =
        git(root, &["ls-files", "--others", "--exclude-standard", "-z"]).unwrap_or_default();
    for path in untracked.split('\0').filter(|s| !s.is_empty()) {
        let full = root.join(path);
        let (lines, binary) = match std::fs::metadata(&full) {
            Ok(m) if m.len() <= MAX_FILE => match std::fs::read(&full) {
                Ok(bytes) if is_binary(&bytes) => (0, true),
                Ok(bytes) => (
                    String::from_utf8_lossy(&bytes).lines().count() as u32,
                    false,
                ),
                Err(_) => (0, false),
            },
            _ => (0, false),
        };
        changes.push(FileChange {
            path: path.to_string(),
            status: "?".into(),
            additions: lines,
            deletions: 0,
            binary,
        });
    }
    changes.sort_by(|a, b| a.path.cmp(&b.path));
    Ok(changes)
}

/// The file at `base` and on disk, for a diff view.
pub fn file_diff(root: &Path, base: &str, path: &str) -> Result<FileDiff, String> {
    let rel = relative(root, path)?;
    let rel_s = rel.to_string_lossy().replace('\\', "/");
    let base = base_or_head(root, base);
    let old = git_show(root, base, &rel_s);
    let new = std::fs::read(root.join(&rel)).ok();
    let too_large = old.as_ref().is_some_and(|b| b.len() as u64 > MAX_FILE)
        || new.as_ref().is_some_and(|b| b.len() as u64 > MAX_FILE);
    let binary = old.as_deref().is_some_and(is_binary) || new.as_deref().is_some_and(is_binary);
    let text = |b: Option<Vec<u8>>| {
        if too_large || binary {
            None
        } else {
            b.map(|b| String::from_utf8_lossy(&b).into_owned())
        }
    };
    Ok(FileDiff {
        path: rel_s,
        old: text(old),
        new: text(new),
        binary,
        too_large,
    })
}

fn git_show(root: &Path, base: &str, rel: &str) -> Option<Vec<u8>> {
    git::git_bytes(root, &["show", &format!("{base}:{rel}")]).ok()
}

/// `base` if it still names a commit, else `HEAD`.
fn base_or_head<'a>(root: &Path, base: &'a str) -> &'a str {
    if git::resolves(root, base) {
        base
    } else {
        "HEAD"
    }
}

/// One level of the tree, honouring `.gitignore`; directories first.
pub fn list_dir(root: &Path, path: &str) -> Result<Vec<DirEntry>, String> {
    let rel = if path.is_empty() {
        PathBuf::new()
    } else {
        relative(root, path)?
    };
    let dir = root.join(&rel);
    let mut out: Vec<DirEntry> = ignore::WalkBuilder::new(&dir)
        .max_depth(Some(1))
        .hidden(false)
        .git_ignore(true)
        .git_exclude(true)
        .parents(true)
        .require_git(false)
        .filter_entry(|e| e.file_name() != ".git")
        .build()
        .filter_map(Result::ok)
        .filter(|e| e.depth() == 1)
        .map(|e| {
            let name = e.file_name().to_string_lossy().into_owned();
            let is_dir = e.file_type().is_some_and(|t| t.is_dir());
            let path = rel.join(&name).to_string_lossy().replace('\\', "/");
            DirEntry { name, path, is_dir }
        })
        .collect();
    out.sort_by(|a, b| {
        b.is_dir
            .cmp(&a.is_dir)
            .then_with(|| a.name.to_lowercase().cmp(&b.name.to_lowercase()))
    });
    Ok(out)
}

pub fn read_file(root: &Path, path: &str) -> Result<FileContent, String> {
    let rel = relative(root, path)?;
    let full = root.join(&rel);
    let meta = std::fs::metadata(&full).map_err(|e| format!("{path}: {e}"))?;
    let rel_s = rel.to_string_lossy().replace('\\', "/");
    if meta.len() > MAX_FILE {
        return Ok(FileContent {
            path: rel_s,
            text: None,
            binary: false,
            too_large: true,
            size: meta.len() as f64,
        });
    }
    let bytes = std::fs::read(&full).map_err(|e| format!("{path}: {e}"))?;
    let binary = is_binary(&bytes);
    Ok(FileContent {
        path: rel_s,
        text: (!binary).then(|| String::from_utf8_lossy(&bytes).into_owned()),
        binary,
        too_large: false,
        size: meta.len() as f64,
    })
}

fn is_binary(bytes: &[u8]) -> bool {
    bytes.iter().take(8192).any(|&b| b == 0)
}

/// Paths that change constantly and never matter to the UI.
fn noise(rel: &Path) -> bool {
    let s = rel.to_string_lossy();
    s.starts_with(".git/objects")
        || s.starts_with(".git/logs")
        || rel.components().any(|c| {
            matches!(
                c.as_os_str().to_str(),
                Some("node_modules" | "target" | ".next" | "dist" | "__pycache__" | ".venv")
            )
        })
}

pub type Watcher = notify_debouncer_full::Debouncer<
    notify_debouncer_full::notify::RecommendedWatcher,
    notify_debouncer_full::RecommendedCache,
>;

/// Watch `root`, calling `on_change` with relative paths (debounced 300ms).
pub fn watch(
    root: &Path,
    on_change: impl Fn(Vec<String>) + Send + 'static,
) -> Result<Watcher, String> {
    use notify_debouncer_full::notify::RecursiveMode;
    let root_buf = root.canonicalize().unwrap_or_else(|_| root.to_path_buf());
    let base = root_buf.clone();
    let mut debouncer = notify_debouncer_full::new_debouncer(
        Duration::from_millis(300),
        None,
        move |res: notify_debouncer_full::DebounceEventResult| {
            let Ok(events) = res else { return };
            let mut paths: Vec<String> = events
                .iter()
                .flat_map(|e| e.paths.iter())
                .filter_map(|p| p.strip_prefix(&base).ok())
                .filter(|rel| !noise(rel))
                .map(|rel| rel.to_string_lossy().replace('\\', "/"))
                .collect();
            paths.sort();
            paths.dedup();
            if !paths.is_empty() {
                paths.truncate(200);
                on_change(paths);
            }
        },
    )
    .map_err(|e| e.to_string())?;
    debouncer
        .watch(&root_buf, RecursiveMode::Recursive)
        .map_err(|e| e.to_string())?;
    Ok(debouncer)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn repo() -> PathBuf {
        let root = std::env::temp_dir().join(crate::store::new_id("ws"));
        std::fs::create_dir_all(root.join("src")).unwrap();
        git(&root, &["init", "-q"]).unwrap();
        std::fs::write(root.join("src/a.txt"), "one\ntwo\nthree\n").unwrap();
        std::fs::write(root.join("gone.txt"), "bye\n").unwrap();
        std::fs::write(root.join(".gitignore"), "build/\n").unwrap();
        git(&root, &["add", "."]).unwrap();
        git(
            &root,
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
        root
    }

    #[test]
    fn status_counts_lines_and_includes_untracked() {
        let root = repo();
        std::fs::write(root.join("src/a.txt"), "one\n2\nthree\nfour\n").unwrap();
        std::fs::remove_file(root.join("gone.txt")).unwrap();
        std::fs::write(root.join("new.txt"), "x\ny\n").unwrap();
        std::fs::create_dir_all(root.join("build")).unwrap();
        std::fs::write(root.join("build/out.o"), "ignored").unwrap();

        let st = status(&root, "HEAD").unwrap();
        let by = |p: &str| {
            st.iter()
                .find(|c| c.path == p)
                .cloned()
                .unwrap_or_else(|| panic!("{p} in {st:?}"))
        };
        assert_eq!(
            (
                by("src/a.txt").status.as_str(),
                by("src/a.txt").additions,
                by("src/a.txt").deletions
            ),
            ("M", 2, 1)
        );
        assert_eq!(by("gone.txt").status, "D");
        assert_eq!(
            (by("new.txt").status.as_str(), by("new.txt").additions),
            ("?", 2)
        );
        assert!(!st.iter().any(|c| c.path.starts_with("build")));
        let _ = std::fs::remove_dir_all(root);
    }

    #[test]
    fn diffs_read_both_sides() {
        let root = repo();
        std::fs::write(root.join("src/a.txt"), "one\n").unwrap();
        let d = file_diff(&root, "HEAD", "src/a.txt").unwrap();
        assert_eq!(d.old.as_deref(), Some("one\ntwo\nthree\n"));
        assert_eq!(d.new.as_deref(), Some("one\n"));
        let new = file_diff(&root, "HEAD", "fresh.txt");
        assert!(new.unwrap().old.is_none());
        let _ = std::fs::remove_dir_all(root);
    }

    #[test]
    fn paths_cannot_escape_the_session_folder() {
        let root = repo();
        assert!(relative(&root, "../etc/passwd").is_err());
        assert!(relative(&root, "/etc/passwd").is_err());
        assert!(read_file(&root, "src/../../x").is_err());
        let abs = root.canonicalize().unwrap().join("src/a.txt");
        assert_eq!(
            relative(&root, &abs.to_string_lossy()).unwrap(),
            PathBuf::from("src/a.txt")
        );
        #[cfg(unix)]
        {
            std::os::unix::fs::symlink("/etc", root.join("escape")).unwrap();
            assert!(read_file(&root, "escape/hosts").is_err());
        }
        let _ = std::fs::remove_dir_all(root);
    }

    #[test]
    fn tree_lists_dirs_first_and_respects_gitignore() {
        let root = repo();
        std::fs::create_dir_all(root.join("build")).unwrap();
        std::fs::write(root.join("build/x"), "").unwrap();
        let top: Vec<String> = list_dir(&root, "")
            .unwrap()
            .into_iter()
            .map(|e| e.name)
            .collect();
        assert_eq!(top, vec!["src", ".gitignore", "gone.txt"]);
        let src = list_dir(&root, "src").unwrap();
        assert_eq!(src[0].path, "src/a.txt");
        let _ = std::fs::remove_dir_all(root);
    }

    #[test]
    fn binary_and_large_files_are_flagged() {
        let root = repo();
        std::fs::write(root.join("bin.dat"), [0u8, 1, 2, 3]).unwrap();
        assert!(read_file(&root, "bin.dat").unwrap().binary);
        std::fs::write(root.join("big.txt"), vec![b'a'; (MAX_FILE + 1) as usize]).unwrap();
        assert!(read_file(&root, "big.txt").unwrap().too_large);
        let _ = std::fs::remove_dir_all(root);
    }
}
