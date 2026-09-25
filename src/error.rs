//! The error the app's services return. Its message reaches the UI verbatim,
//! and the UI matches on one of them: "dirty".

use std::fmt;

#[derive(Clone, Debug, PartialEq)]
pub enum Error {
    /// What was asked for isn't there ("no such session", "unknown agent").
    NotFound(&'static str),
    /// A worktree has uncommitted changes; the UI asks before discarding them.
    Dirty,
    Git(String),
    Store(String),
    Io(String),
    Other(String),
}

pub type Result<T, E = Error> = std::result::Result<T, E>;

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::NotFound(what) => f.write_str(what),
            Error::Dirty => f.write_str("dirty"),
            Error::Git(s) | Error::Store(s) | Error::Io(s) | Error::Other(s) => f.write_str(s),
        }
    }
}

impl std::error::Error for Error {}

impl From<String> for Error {
    fn from(s: String) -> Self {
        Error::Other(s)
    }
}

impl From<&str> for Error {
    fn from(s: &str) -> Self {
        Error::Other(s.to_string())
    }
}

impl From<std::io::Error> for Error {
    fn from(e: std::io::Error) -> Self {
        Error::Io(e.to_string())
    }
}

impl From<tokio::task::JoinError> for Error {
    fn from(e: tokio::task::JoinError) -> Self {
        Error::Other(e.to_string())
    }
}

impl From<Error> for elyra::Error {
    fn from(e: Error) -> Self {
        elyra::Error::command(e)
    }
}
