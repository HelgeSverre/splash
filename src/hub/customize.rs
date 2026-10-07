//! Settings, and what agents are customised with: skills, command files and
//! MCP servers, read from the user's home and each project.

use std::collections::BTreeMap;
use std::path::PathBuf;
use std::sync::Arc;

use super::{blocking, Core, Result};
use crate::agents::customize::{self, CommandFile, Doc, McpList, Skill};

pub struct Customize {
    core: Arc<Core>,
}

impl Customize {
    pub fn new(core: Arc<Core>) -> Self {
        Self { core }
    }

    pub async fn settings(&self) -> Result<BTreeMap<String, String>> {
        let data_dir = &self.core.data_dir;
        let mut s = self.core.store().await?.settings().await?;
        s.insert("data_dir".into(), data_dir.display().to_string());
        s.insert(
            "worktrees_dir".into(),
            data_dir.join("worktrees").display().to_string(),
        );
        Ok(s)
    }

    pub async fn set_setting(&self, key: &str, value: &str) -> Result<()> {
        self.core.store().await?.set_setting(key, value).await
    }

    pub async fn skills(&self) -> Result<Vec<Skill>> {
        let (home, projects) = self.roots().await?;
        blocking(move || customize::skills(&home, &projects)).await
    }

    pub async fn command_files(&self) -> Result<Vec<CommandFile>> {
        let (home, projects) = self.roots().await?;
        blocking(move || customize::command_files(&home, &projects)).await
    }

    pub async fn read_doc(&self, path: &str) -> Result<Doc> {
        let (home, projects) = self.roots().await?;
        let path = path.to_string();
        Ok(blocking(move || customize::read_doc(&home, &projects, &path)).await??)
    }

    pub async fn mcp_servers(&self) -> Result<McpList> {
        let home = home();
        blocking(move || customize::mcp_servers(&home)).await
    }

    /// Where skills and commands live: the home folder, and each project
    /// (by name).
    async fn roots(&self) -> Result<(PathBuf, Vec<(String, PathBuf)>)> {
        let projects = self
            .core
            .store()
            .await?
            .projects()
            .await?
            .into_iter()
            .map(|p| (p.name, PathBuf::from(p.path)))
            .collect();
        Ok((home(), projects))
    }
}

fn home() -> PathBuf {
    dirs::home_dir().unwrap_or_else(std::env::temp_dir)
}
