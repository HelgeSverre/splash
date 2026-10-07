//! Folder selection always operates on the backend host, never on the browser.
use crate::error::{Error, Result};
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

#[derive(Debug, Serialize, Deserialize, specta::Type)]
pub struct FolderListing {
    pub path: String,
    pub parent: Option<String>,
    pub folders: Vec<String>,
    pub truncated: bool,
}

pub fn browse(path: Option<&str>) -> Result<FolderListing> {
    let path = match path.filter(|p| !p.trim().is_empty()) {
        Some(path) => PathBuf::from(path),
        None => dirs::home_dir().ok_or(Error::NotFound("No home directory is available"))?,
    };
    if !path.is_absolute() {
        return Err(Error::Other(
            "Enter an absolute folder path on the server".into(),
        ));
    }
    let path = path.canonicalize()?;
    let mut folders = Vec::new();
    let mut truncated = false;
    for entry in std::fs::read_dir(&path)? {
        let entry = entry?;
        if entry.path().is_dir() && !entry.file_name().to_string_lossy().starts_with('.') {
            if folders.len() >= 1000 {
                truncated = true;
                break;
            }
            folders.push(entry.path().to_string_lossy().into_owned());
        }
    }
    folders.sort_by_key(|s| s.to_lowercase());
    Ok(FolderListing {
        parent: path.parent().map(display),
        path: display(&path),
        folders,
        truncated,
    })
}
fn display(path: &Path) -> String {
    path.to_string_lossy().into_owned()
}
