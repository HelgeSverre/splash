//! The agent list: what's installed, the last probe of each, and the extra
//! arguments the user gave them.

use std::collections::HashMap;
use std::sync::Arc;

use parking_lot::Mutex;

use super::{split_args, warm_env, Core, Error, Result};
use crate::agents::detect::{self, AgentStatus};
use crate::agents::probe;

pub struct Agents {
    core: Arc<Core>,
    /// Detection is slow (it runs every CLI); keep the last result.
    cache: Mutex<Vec<AgentStatus>>,
}

impl Agents {
    pub fn new(core: Arc<Core>) -> Self {
        Self {
            core,
            cache: Mutex::default(),
        }
    }

    pub async fn list(&self, refresh: bool) -> Result<Vec<AgentStatus>> {
        if !refresh && !self.cache.lock().is_empty() {
            return Ok(self.cache.lock().clone());
        }
        let store = self.core.store().await?;
        warm_env().await;
        let mut list = detect::detect_all().await;
        let probes: HashMap<String, String> = store.probes().await?.into_iter().collect();
        for a in &mut list {
            a.probe = probes.get(&a.id).and_then(|j| serde_json::from_str(j).ok());
            a.extra_args = store.extra_args(&a.id).await.unwrap_or_default();
        }
        *self.cache.lock() = list.clone();
        Ok(list)
    }

    pub async fn probe(&self, agent_id: &str) -> Result<AgentStatus> {
        let spec = self.core.agent(agent_id)?;
        let store = self.core.store().await?;
        warm_env().await;
        let extra = split_args(&store.extra_args(agent_id).await?);
        let result = probe::probe(spec, &extra).await;
        store
            .save_probe(
                agent_id,
                &serde_json::to_string(&result).unwrap_or_default(),
            )
            .await?;
        let mut status = detect::detect(spec).await;
        status.probe = Some(result);
        status.extra_args = extra.join(" ");
        self.replace(status.clone());
        Ok(status)
    }

    pub async fn set_args(&self, agent_id: &str, args: &str) -> Result<AgentStatus> {
        let args = args.trim();
        self.core
            .store()
            .await?
            .set_extra_args(agent_id, args)
            .await?;
        let mut status = self
            .list(false)
            .await?
            .into_iter()
            .find(|a| a.id == agent_id)
            .ok_or(Error::NotFound("unknown agent"))?;
        status.extra_args = args.to_string();
        self.replace(status.clone());
        Ok(status)
    }

    fn replace(&self, status: AgentStatus) {
        {
            let mut cache = self.cache.lock();
            match cache.iter_mut().find(|a| a.id == status.id) {
                Some(a) => *a = status.clone(),
                None => cache.push(status.clone()),
            }
        }
        self.core.emit("agents", &status);
    }
}
