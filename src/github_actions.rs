//! Read-only GitHub Actions discovery, run attempts, and bounded job logs.
use crate::{
    error::{Error, Result},
    github::{encode_path, validate_repository, Github},
};
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct ActionsRun {
    pub id: String,
    pub repository: String,
    pub workflow_id: String,
    pub workflow: String,
    pub title: String,
    pub number: u32,
    pub attempt: u32,
    pub status: String,
    pub conclusion: Option<String>,
    pub branch: String,
    pub sha: String,
    pub event: String,
    pub actor: String,
    pub created_at: String,
    pub updated_at: String,
    pub started_at: Option<String>,
    pub url: String,
}
#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct ActionsWorkflow {
    pub id: String,
    pub repository: String,
    pub name: String,
    pub path: String,
    pub state: String,
    pub url: String,
}
#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct ActionsStep {
    pub number: u32,
    pub name: String,
    pub status: String,
    pub conclusion: Option<String>,
    pub started_at: Option<String>,
    pub completed_at: Option<String>,
}
#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct ActionsJob {
    pub id: String,
    pub name: String,
    pub status: String,
    pub conclusion: Option<String>,
    pub started_at: Option<String>,
    pub completed_at: Option<String>,
    pub runner: String,
    pub url: String,
    pub steps: Vec<ActionsStep>,
}
#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct ActionsRuns {
    pub runs: Vec<ActionsRun>,
    pub next_page: Option<u32>,
    pub total: u32,
}
#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct ActionsWorkflows {
    pub workflows: Vec<ActionsWorkflow>,
    pub next_page: Option<u32>,
}
#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct ActionsJobs {
    pub jobs: Vec<ActionsJob>,
    pub next_page: Option<u32>,
}
#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct ActionsFilters {
    pub status: String,
    pub branch: String,
    pub event: String,
    pub created: String,
    pub workflow_id: Option<String>,
}
#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct ActionsLog {
    pub text: String,
    pub truncated: bool,
}

fn text(v: &Value, key: &str) -> String {
    v[key].as_str().unwrap_or_default().to_owned()
}
fn optional(v: &Value, key: &str) -> Option<String> {
    v[key].as_str().map(str::to_owned)
}
fn num(v: &Value, key: &str) -> u32 {
    v[key]
        .as_u64()
        .and_then(|n| n.try_into().ok())
        .unwrap_or_default()
}
fn id(v: &Value, key: &str) -> String {
    v[key].as_u64().map(|n| n.to_string()).unwrap_or_default()
}
fn validate_id(value: &str) -> Result<()> {
    if value.is_empty()
        || !value.bytes().all(|b| b.is_ascii_digit())
        || value.parse::<u64>().ok().filter(|n| *n > 0).is_none()
    {
        return Err(Error::Other("Invalid Actions identifier".into()));
    }
    Ok(())
}
fn validate_page(page: u32) -> Result<()> {
    if !(1..=10000).contains(&page) {
        return Err(Error::Other("Invalid Actions page".into()));
    }
    Ok(())
}
fn nodes<'a>(value: &'a Value, key: &str) -> Result<&'a Vec<Value>> {
    value[key]
        .as_array()
        .ok_or_else(|| Error::Other("Invalid GitHub Actions response".into()))
}
fn next(value: &Value, page: u32, size: u32, count: usize) -> Option<u32> {
    (count > 0 && page.saturating_mul(size) < num(value, "total_count") && page < 10000)
        .then_some(page + 1)
}
fn runs_endpoint(repository: &str, filters: &ActionsFilters, page: u32) -> Result<String> {
    validate_repository(repository)?;
    validate_page(page)?;
    let base = if let Some(workflow) = &filters.workflow_id {
        validate_id(workflow)?;
        format!("repos/{repository}/actions/workflows/{workflow}/runs")
    } else {
        format!("repos/{repository}/actions/runs")
    };
    let mut endpoint = format!("{base}?per_page=30&page={page}");
    if !filters.status.is_empty()
        && ![
            "completed",
            "in_progress",
            "queued",
            "requested",
            "waiting",
            "pending",
            "success",
            "failure",
            "cancelled",
            "timed_out",
            "action_required",
            "neutral",
            "skipped",
            "stale",
        ]
        .contains(&filters.status.as_str())
    {
        return Err(Error::Other("Invalid Actions status".into()));
    }
    for (key, value) in [
        ("status", &filters.status),
        ("branch", &filters.branch),
        ("event", &filters.event),
        ("created", &filters.created),
    ] {
        if value.len() > 256 {
            return Err(Error::Other("Actions filter is too long".into()));
        }
        if !value.is_empty() {
            endpoint.push_str(&format!("&{key}={}", encode_path(value)));
        }
    }
    Ok(endpoint)
}
fn run(repository: &str, v: &Value) -> ActionsRun {
    ActionsRun {
        id: id(v, "id"),
        repository: repository.into(),
        workflow_id: id(v, "workflow_id"),
        workflow: text(v, "name"),
        title: text(v, "display_title"),
        number: num(v, "run_number"),
        attempt: num(v, "run_attempt").max(1),
        status: text(v, "status"),
        conclusion: optional(v, "conclusion"),
        branch: text(v, "head_branch"),
        sha: text(v, "head_sha"),
        event: text(v, "event"),
        actor: text(&v["actor"], "login"),
        created_at: text(v, "created_at"),
        updated_at: text(v, "updated_at"),
        started_at: optional(v, "run_started_at"),
        url: text(v, "html_url"),
    }
}
impl Github {
    pub async fn actions_runs(
        &self,
        repository: &str,
        filters: ActionsFilters,
        page: u32,
    ) -> Result<ActionsRuns> {
        let value = self
            .api(&runs_endpoint(repository, &filters, page)?, None, false)
            .await?;
        let rows = nodes(&value, "workflow_runs")?;
        Ok(ActionsRuns {
            runs: rows.iter().map(|v| run(repository, v)).collect(),
            next_page: next(&value, page, 30, rows.len()),
            total: num(&value, "total_count"),
        })
    }
    pub async fn actions_workflows(&self, repository: &str, page: u32) -> Result<ActionsWorkflows> {
        validate_repository(repository)?;
        validate_page(page)?;
        let value = self
            .api(
                &format!("repos/{repository}/actions/workflows?per_page=100&page={page}"),
                None,
                false,
            )
            .await?;
        let rows = nodes(&value, "workflows")?;
        Ok(ActionsWorkflows {
            workflows: rows
                .iter()
                .map(|v| ActionsWorkflow {
                    id: id(v, "id"),
                    repository: repository.into(),
                    name: text(v, "name"),
                    path: text(v, "path"),
                    state: text(v, "state"),
                    url: text(v, "html_url"),
                })
                .collect(),
            next_page: next(&value, page, 100, rows.len()),
        })
    }
    pub async fn actions_jobs(
        &self,
        repository: &str,
        run_id: &str,
        attempt: u32,
        page: u32,
    ) -> Result<ActionsJobs> {
        validate_repository(repository)?;
        validate_id(run_id)?;
        validate_page(page)?;
        if attempt == 0 {
            return Err(Error::Other("Invalid run attempt".into()));
        }
        let value = self.api(&format!("repos/{repository}/actions/runs/{run_id}/attempts/{attempt}/jobs?per_page=100&page={page}"),None,false).await?;
        let rows = nodes(&value, "jobs")?;
        Ok(ActionsJobs {
            jobs: rows
                .iter()
                .map(|v| ActionsJob {
                    id: id(v, "id"),
                    name: text(v, "name"),
                    status: text(v, "status"),
                    conclusion: optional(v, "conclusion"),
                    started_at: optional(v, "started_at"),
                    completed_at: optional(v, "completed_at"),
                    runner: text(v, "runner_name"),
                    url: text(v, "html_url"),
                    steps: v["steps"]
                        .as_array()
                        .into_iter()
                        .flatten()
                        .map(|step| ActionsStep {
                            number: num(step, "number"),
                            name: text(step, "name"),
                            status: text(step, "status"),
                            conclusion: optional(step, "conclusion"),
                            started_at: optional(step, "started_at"),
                            completed_at: optional(step, "completed_at"),
                        })
                        .collect(),
                })
                .collect(),
            next_page: next(&value, page, 100, rows.len()),
        })
    }
    pub async fn actions_log(&self, repository: &str, job_id: &str) -> Result<ActionsLog> {
        use std::{process::Stdio, time::Duration};
        use tokio::{io::AsyncReadExt, process::Command};
        validate_repository(repository)?;
        validate_id(job_id)?;
        let _permit = self
            .requests
            .acquire()
            .await
            .map_err(|e| Error::Other(e.to_string()))?;
        let gh = self.executable_path().await?;
        // Recent gh releases reject ANSI-bearing responses by default. We capture
        // logs into a bounded pipe and render them as plain text, never a terminal.
        // Older releases lack this flag and already allow the captured response.
        let help = tokio::time::timeout(
            Duration::from_secs(5),
            Command::new(&gh)
                .args(["api", "--help"])
                .stdin(Stdio::null())
                .stderr(Stdio::null())
                .kill_on_drop(true)
                .output(),
        )
        .await;
        let allow_escapes = help
            .ok()
            .and_then(std::result::Result::ok)
            .is_some_and(|output| {
                output.status.success()
                    && String::from_utf8_lossy(&output.stdout).contains("--allow-escape-sequences")
            });
        let mut command = Command::new(gh);
        if allow_escapes {
            command.arg("api").arg("--allow-escape-sequences");
        } else {
            command.arg("api");
        }
        let mut child = command
            .args([
                "--hostname",
                "github.com",
                &format!("repos/{repository}/actions/jobs/{job_id}/logs"),
            ])
            .env("GH_PROMPT_DISABLED", "1")
            .env("GH_PAGER", "cat")
            .stdin(Stdio::null())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .kill_on_drop(true)
            .spawn()?;
        let stdout = child
            .stdout
            .take()
            .ok_or_else(|| Error::Other("Cannot read job log".into()))?;
        let stderr = child
            .stderr
            .take()
            .ok_or_else(|| Error::Other("Cannot read log error".into()))?;
        const LIMIT: usize = 512 * 1024;
        let operation = async {
            let errors = tokio::spawn(async move {
                let mut bytes = Vec::new();
                stderr
                    .take(8192)
                    .read_to_end(&mut bytes)
                    .await
                    .map(|_| bytes)
            });
            let mut bytes = Vec::new();
            stdout
                .take((LIMIT + 1) as u64)
                .read_to_end(&mut bytes)
                .await?;
            let truncated = bytes.len() > LIMIT;
            if truncated {
                let _ = child.kill().await;
            }
            let status = child.wait().await?;
            let errors = errors.await??;
            if !truncated && !status.success() {
                return Err(Error::Other(format!(
                    "Job log unavailable: {}",
                    String::from_utf8_lossy(&errors).trim()
                )));
            }
            bytes.truncate(LIMIT);
            Ok(ActionsLog {
                text: String::from_utf8_lossy(&bytes).into_owned(),
                truncated,
            })
        };
        tokio::time::timeout(Duration::from_secs(45), operation)
            .await
            .map_err(|_| Error::Other("Job log request timed out".into()))?
    }
}
#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    #[test]
    fn filters_cannot_inject_query_parameters() {
        let filters = ActionsFilters {
            status: "failure".into(),
            branch: "feature/a&status=success".into(),
            event: "".into(),
            created: ">=2026-10-01".into(),
            workflow_id: Some("42".into()),
        };
        let path = runs_endpoint("a/b", &filters, 2).unwrap();
        assert!(path.contains("workflows/42/runs?per_page=30&page=2"));
        assert!(path.contains("branch=feature%2Fa%26status%3Dsuccess"));
        assert!(runs_endpoint("a/b?x", &filters, 1).is_err());
        assert!(runs_endpoint("a/b", &filters, 0).is_err());
        assert!(validate_id("1/../../secrets").is_err());
    }
    #[test]
    fn preserves_incomplete_runs_attempts_and_large_ids() {
        let run = run(
            "a/b",
            &json!({"id":9007199254740993_u64,"status":"queued","conclusion":null,"run_attempt":2}),
        );
        assert_eq!(run.id, "9007199254740993");
        assert_eq!(run.attempt, 2);
        assert_eq!(run.conclusion, None);
        assert_eq!(run.started_at, None);
        assert_eq!(next(&json!({"total_count":31}), 1, 30, 30), Some(2));
        assert_eq!(next(&json!({"total_count":31}), 2, 30, 1), None);
    }
}
