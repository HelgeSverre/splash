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
    let path = path.canonicalize().map_err(unreadable)?;
    let mut folders = Vec::new();
    let mut truncated = false;
    for entry in std::fs::read_dir(&path).map_err(unreadable)? {
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
/// Why a typed folder can't be listed, in words rather than an OS error code.
fn unreadable(e: std::io::Error) -> Error {
    Error::Other(match e.kind() {
        std::io::ErrorKind::NotFound => "No folder exists at that path on the server".into(),
        std::io::ErrorKind::NotADirectory => "That path is a file, not a folder".into(),
        std::io::ErrorKind::PermissionDenied => {
            "Splash does not have permission to open that folder".into()
        }
        _ => format!("Could not open that folder: {e}"),
    })
}
fn display(path: &Path) -> String {
    path.to_string_lossy().into_owned()
}
