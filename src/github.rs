//! GitHub account triage through the user's existing `gh` authentication.
//! Credentials stay in gh; only typed, bounded results cross the UI bridge.

use std::collections::BTreeMap;
use std::path::Path;
use std::process::Stdio;
use std::sync::Arc;
use std::time::Duration;

use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use tokio::io::AsyncWriteExt;
use tokio::process::Command;
use tokio::sync::Semaphore;

use crate::error::{Error, Result};
use crate::hub::Core;

const PAGE_SIZE: usize = 30;

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct GithubRepository {
    pub full_name: String,
    pub owner: String,
    pub private: bool,
    pub archived: bool,
    pub has_issues: bool,
    pub updated_at: String,
    pub project_ids: Vec<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct GithubCatalog {
    pub login: String,
    pub repositories: Vec<GithubRepository>,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize, specta::Type)]
#[serde(rename_all = "snake_case")]
pub enum GithubKind {
    Issue,
    PullRequest,
    Branch,
    Activity,
}

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct GithubItem {
    pub id: String,
    pub repository: String,
    pub kind: GithubKind,
    pub number: Option<u32>,
    pub title: String,
    pub body: String,
    pub url: String,
    pub state: String,
    pub updated_at: String,
    pub author: String,
    pub assignees: Vec<String>,
    pub reviewers: Vec<String>,
    pub labels: Vec<String>,
    pub branch: Option<String>,
    pub checks: Option<String>,
    pub review_decision: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct GithubPage {
    pub items: Vec<GithubItem>,
    pub next_cursor: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct GithubComment {
    pub author: String,
    pub body: String,
    pub url: String,
    pub created_at: String,
}

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct GithubComments {
    pub comments: Vec<GithubComment>,
    pub has_more: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize, specta::Type)]
pub struct GithubSearch {
    pub text: String,
    pub author: String,
    pub assignee: String,
    pub label: String,
    pub review: String,
    pub state: String,
}

pub struct Github {
    core: Arc<Core>,
    pub(crate) requests: Semaphore,
    #[cfg(test)]
    executable: Option<std::path::PathBuf>,
}

impl Github {
    pub fn new(core: Arc<Core>) -> Self {
        Self {
            core,
            requests: Semaphore::new(4),
            #[cfg(test)]
            executable: None,
        }
    }

    pub(crate) async fn executable_path(&self) -> Result<std::path::PathBuf> {
        let gh = tokio::task::spawn_blocking(|| crate::agents::env::which("gh")).await?;
        #[cfg(test)]
        let gh = self.executable.clone().or(gh);
        gh.ok_or_else(|| {
            Error::Other("Install GitHub CLI, then run gh auth login --hostname github.com.".into())
        })
    }

    pub(crate) async fn api(
        &self,
        endpoint: &str,
        body: Option<Value>,
        paginate: bool,
    ) -> Result<Value> {
        let _permit = self
            .requests
            .acquire()
            .await
            .map_err(|e| Error::Other(e.to_string()))?;
        let gh = self.executable_path().await?;
        let mut command = Command::new(gh);
        command
            .args(["api", "--hostname", "github.com", endpoint])
            .env("GH_PROMPT_DISABLED", "1")
            .env("GH_PAGER", "cat")
            .stdin(Stdio::null())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .kill_on_drop(true);
        if paginate {
            command.args(["--paginate", "--slurp"]);
        }
        if body.is_some() {
            command.args(["--input", "-"]).stdin(Stdio::piped());
        }
        let operation = async {
            let mut child = command.spawn()?;
            if let Some(body) = body {
                let mut stdin = child
                    .stdin
                    .take()
                    .ok_or_else(|| Error::Other("Cannot write GitHub request".into()))?;
                stdin.write_all(body.to_string().as_bytes()).await?;
                stdin.shutdown().await?;
            }
            let output = child.wait_with_output().await?;
            if !output.status.success() {
                return Err(Error::Other(format!(
                    "GitHub: {}",
                    String::from_utf8_lossy(&output.stderr).trim()
                )));
            }
            let value: Value = serde_json::from_slice(&output.stdout)
                .map_err(|e| Error::Other(format!("Invalid GitHub response: {e}")))?;
            if let Some(errors) = value.get("errors") {
                return Err(Error::Other(format!("GitHub: {errors}")));
            }
            Ok(value)
        };
        tokio::time::timeout(Duration::from_secs(if paginate { 180 } else { 45 }), operation)
            .await.map_err(|_| Error::Other("GitHub request timed out. For issue creation, check GitHub before retrying; the issue may have been created.".into()))?
    }

    pub async fn catalog(&self) -> Result<GithubCatalog> {
        let user = self.api("user", None, false).await?;
        let pages = self.api("user/repos?per_page=100&sort=pushed&direction=desc&affiliation=owner,collaborator,organization_member", None, true).await?;
        let store = self.core.store().await?;
        let settings = store.settings().await?;
        let projects = store.projects().await?;
        let known_projects: std::collections::HashSet<_> =
            projects.iter().map(|p| p.id.clone()).collect();
        let automatic = tokio::task::spawn_blocking(move || {
            let mut links: BTreeMap<String, Vec<String>> = BTreeMap::new();
            for project in projects {
                if let Ok(remotes) = crate::git::git(
                    Path::new(&project.path),
                    &["config", "--get-regexp", r"remote\..*\.url"],
                ) {
                    for line in remotes.lines() {
                        if let Some((_, remote)) = line.split_once(char::is_whitespace) {
                            if let Some(repo) = github_remote(remote) {
                                let ids = links.entry(repo.to_lowercase()).or_default();
                                if !ids.contains(&project.id) {
                                    ids.push(project.id.clone());
                                }
                            }
                        }
                    }
                }
            }
            links
        })
        .await?;
        let mut repositories = Vec::new();
        for page in pages
            .as_array()
            .ok_or_else(|| Error::Other("Invalid repository list".into()))?
        {
            for repo in page
                .as_array()
                .ok_or_else(|| Error::Other("Invalid repository page".into()))?
            {
                let full_name = string(repo, "full_name");
                let key = full_name.to_lowercase();
                let mut project_ids = automatic.get(&key).cloned().unwrap_or_default();
                if let Some(value) = settings.get(&format!("github.link.{key}")) {
                    for id in manual_links(value) {
                        if known_projects.contains(&id) && !project_ids.contains(&id) {
                            project_ids.push(id);
                        }
                    }
                }
                repositories.push(GithubRepository {
                    full_name,
                    owner: string(&repo["owner"], "login"),
                    private: repo["private"].as_bool().unwrap_or(false),
                    archived: repo["archived"].as_bool().unwrap_or(false),
                    has_issues: repo["has_issues"].as_bool().unwrap_or(false),
                    updated_at: repo["pushed_at"].as_str().unwrap_or("").to_owned(),
                    project_ids,
                });
            }
        }
        let mut seen = std::collections::HashSet::new();
        repositories.retain(|r| seen.insert(r.full_name.to_lowercase()));
        Ok(GithubCatalog {
            login: string(&user, "login"),
            repositories,
        })
    }

    pub async fn link(&self, repository: &str, project_id: Option<&str>) -> Result<()> {
        validate_repository(repository)?;
        let store = self.core.store().await?;
        if let Some(id) = project_id {
            if !store.projects().await?.iter().any(|p| p.id == id) {
                return Err(Error::NotFound("No such project"));
            }
        }
        let key = format!("github.link.{}", repository.to_lowercase());
        let mut ids = store
            .settings()
            .await?
            .get(&key)
            .map(|value| manual_links(value))
            .unwrap_or_default();
        if let Some(id) = project_id {
            if !ids.iter().any(|existing| existing == id) {
                ids.push(id.to_owned());
            }
        } else {
            ids.clear();
        }
        let value = serde_json::to_string(&ids).map_err(|e| Error::Other(e.to_string()))?;
        store.set_setting(&key, &value).await
    }

    pub async fn page(
        &self,
        repository: &str,
        kind: GithubKind,
        cursor: Option<String>,
    ) -> Result<GithubPage> {
        let (owner, name) = validate_repository(repository)?;
        if kind == GithubKind::Activity {
            let page = cursor
                .as_deref()
                .unwrap_or("1")
                .parse::<u32>()
                .map_err(|_| Error::Other("Invalid activity page".into()))?;
            if !(1..=10).contains(&page) {
                return Err(Error::Other("Invalid activity page".into()));
            }
            let value = self
                .api(
                    &format!("repos/{repository}/events?per_page={PAGE_SIZE}&page={page}"),
                    None,
                    false,
                )
                .await?;
            let events = value
                .as_array()
                .ok_or_else(|| Error::Other("Invalid activity response".into()))?;
            return Ok(GithubPage {
                items: events.iter().map(|v| event_item(repository, v)).collect(),
                next_cursor: (events.len() == PAGE_SIZE && page < 10)
                    .then(|| (page + 1).to_string()),
            });
        }
        let (field, connection) = match kind {
            GithubKind::Issue => ("issues", "issues(first:30,after:$cursor,orderBy:{field:UPDATED_AT,direction:DESC}) { nodes { id number title body url state updatedAt author { login } assignees(first:100) { nodes { login } } labels(first:30) { nodes { name } } } pageInfo { hasNextPage endCursor } }"),
            GithubKind::PullRequest => ("pullRequests", "pullRequests(first:30,after:$cursor,orderBy:{field:UPDATED_AT,direction:DESC}) { nodes { id number title body url state updatedAt isDraft headRefName reviewDecision author { login } assignees(first:100) { nodes { login } } labels(first:30) { nodes { name } } reviewRequests(first:100) { nodes { requestedReviewer { ... on User { login } } } } commits(last:1) { nodes { commit { statusCheckRollup { state } } } } } pageInfo { hasNextPage endCursor } }"),
            GithubKind::Branch => ("refs", "refs(refPrefix:\"refs/heads/\",first:30,after:$cursor) { nodes { id name target { ... on Commit { committedDate message url author { name user { login } } } } } pageInfo { hasNextPage endCursor } }"),
            GithubKind::Activity => return Err(Error::Other("Activity requires REST pagination".into())),
        };
        let query = format!("query($owner:String!,$name:String!,$cursor:String) {{ repository(owner:$owner,name:$name) {{ {connection} }} }}");
        let value = self
            .api(
                "graphql",
                Some(
                    json!({"query":query,"variables":{"owner":owner,"name":name,"cursor":cursor}}),
                ),
                false,
            )
            .await?;
        let data = &value["data"]["repository"][field];
        let nodes = data["nodes"]
            .as_array()
            .ok_or_else(|| Error::Other("Repository unavailable or access denied".into()))?;
        Ok(GithubPage {
            items: nodes
                .iter()
                .filter(|v| !v.is_null())
                .map(|v| node_item(repository, kind, v))
                .collect(),
            next_cursor: data["pageInfo"]["hasNextPage"]
                .as_bool()
                .unwrap_or(false)
                .then(|| data["pageInfo"]["endCursor"].as_str().map(str::to_owned))
                .flatten(),
        })
    }

    pub async fn search(
        &self,
        repositories: &[String],
        kind: GithubKind,
        filters: GithubSearch,
        cursor: Option<String>,
    ) -> Result<GithubPage> {
        let query_text = search_query(repositories, kind, &filters)?;
        let typename = if kind == GithubKind::Issue {
            "Issue"
        } else {
            "PullRequest"
        };
        let extra = if kind == GithubKind::PullRequest {
            "isDraft headRefName reviewDecision reviewRequests(first:100) { nodes { requestedReviewer { ... on User { login } } } } commits(last:1) { nodes { commit { statusCheckRollup { state } } } }"
        } else {
            ""
        };
        let query = format!("query($q:String!,$cursor:String) {{ search(type:ISSUE,query:$q,first:30,after:$cursor) {{ nodes {{ ... on {typename} {{ id number title body url state updatedAt repository {{ nameWithOwner }} author {{ login }} assignees(first:100) {{ nodes {{ login }} }} labels(first:30) {{ nodes {{ name }} }} {extra} }} }} pageInfo {{ hasNextPage endCursor }} }} }}");
        let value = self
            .api(
                "graphql",
                Some(json!({"query":query,"variables":{"q":query_text,"cursor":cursor}})),
                false,
            )
            .await?;
        let data = &value["data"]["search"];
        let nodes = data["nodes"]
            .as_array()
            .ok_or_else(|| Error::Other("Invalid GitHub search response".into()))?;
        Ok(GithubPage {
            items: nodes
                .iter()
                .filter_map(|v| {
                    let name = v["repository"]["nameWithOwner"].as_str()?;
                    let repository = repositories.iter().find(|r| r.eq_ignore_ascii_case(name))?;
                    Some(node_item(repository, kind, v))
                })
                .collect(),
            next_cursor: data["pageInfo"]["hasNextPage"]
                .as_bool()
                .unwrap_or(false)
                .then(|| data["pageInfo"]["endCursor"].as_str().map(str::to_owned))
                .flatten(),
        })
    }

    /// Fetch into a unique temporary ref, never checking out or resetting the project.
    pub async fn pull_request_revision(
        &self,
        project_id: &str,
        repository: &str,
        number: u32,
    ) -> Result<String> {
        validate_repository(repository)?;
        if number == 0 {
            return Err(Error::Other("Invalid pull request number".into()));
        }
        let project = self.core.store().await?.project(project_id).await?;
        let path = std::path::PathBuf::from(project.path);
        let repo = repository.to_owned();
        let local = path.clone();
        let remote = tokio::task::spawn_blocking(move || {
            let remotes = crate::git::git(&local, &["remote"])?;
            for name in remotes.lines() {
                let url = crate::git::git(&local, &["remote", "get-url", name])?;
                if github_remote(url.trim()).is_some_and(|r| r.eq_ignore_ascii_case(&repo)) { return Ok(name.to_owned()); }
            }
            Err(Error::Other("This project has no GitHub remote matching the pull request. Link the matching local checkout first.".into()))
        }).await??;
        let reference = format!("refs/splash/{}", crate::store::new_id("fetch"));
        let spec = format!("refs/pull/{number}/head:{reference}");
        let result = tokio::time::timeout(
            Duration::from_secs(90),
            Command::new("git")
                .current_dir(&path)
                .env("GIT_TERMINAL_PROMPT", "0")
                .args(["fetch", "--no-tags", "--", &remote, &spec])
                .kill_on_drop(true)
                .output(),
        )
        .await;
        let cleanup_path = path.clone();
        let cleanup_ref = reference.clone();
        let resolved = tokio::task::spawn_blocking(move || {
            let sha = crate::git::git(
                &cleanup_path,
                &[
                    "rev-parse",
                    "--verify",
                    &format!("{cleanup_ref}^{{commit}}"),
                ],
            );
            let _ = crate::git::git(&cleanup_path, &["update-ref", "-d", &cleanup_ref]);
            sha.map(|s| s.trim().to_owned())
        })
        .await?;
        let output =
            result.map_err(|_| Error::Other("Fetching the pull request timed out".into()))??;
        if !output.status.success() {
            return Err(Error::Git(
                String::from_utf8_lossy(&output.stderr).into_owned(),
            ));
        }
        resolved
    }

    pub async fn comments(
        &self,
        repository: &str,
        number: u32,
        kind: GithubKind,
    ) -> Result<GithubComments> {
        let (owner, name) = validate_repository(repository)?;
        let field = match kind {
            GithubKind::Issue => "issue",
            GithubKind::PullRequest => "pullRequest",
            _ => return Err(Error::Other("This item has no discussion".into())),
        };
        let query = format!("query($owner:String!,$name:String!,$number:Int!) {{ repository(owner:$owner,name:$name) {{ {field}(number:$number) {{ comments(last:30) {{ nodes {{ author {{ login }} body url createdAt }} pageInfo {{ hasPreviousPage }} }} }} }} }}");
        let value = self
            .api(
                "graphql",
                Some(
                    json!({"query":query,"variables":{"owner":owner,"name":name,"number":number}}),
                ),
                false,
            )
            .await?;
        let data = &value["data"]["repository"][field]["comments"];
        let nodes = data["nodes"]
            .as_array()
            .ok_or_else(|| Error::Other("Discussion unavailable".into()))?;
        Ok(GithubComments {
            comments: nodes
                .iter()
                .map(|v| GithubComment {
                    author: string(&v["author"], "login"),
                    body: string(v, "body"),
                    url: string(v, "url"),
                    created_at: string(v, "createdAt"),
                })
                .collect(),
            has_more: data["pageInfo"]["hasPreviousPage"]
                .as_bool()
                .unwrap_or(false),
        })
    }

    pub async fn create_issue(
        &self,
        repository: &str,
        title: &str,
        body: &str,
    ) -> Result<GithubItem> {
        validate_repository(repository)?;
        let title = title.trim();
        if title.is_empty() || title.chars().count() > 256 {
            return Err(Error::Other(
                "Issue title must contain 1 to 256 characters".into(),
            ));
        }
        if body.chars().count() > 65536 {
            return Err(Error::Other("Issue description is too long".into()));
        }
        // JSON through stdin: titles/body are never shell syntax or gh flag values.
        let value = self
            .api(
                &format!("repos/{repository}/issues"),
                Some(json!({"title":title,"body":body})),
                false,
            )
            .await?;
        let node = json!({"id":value["node_id"],"number":value["number"],"title":value["title"],"body":value["body"],"url":value["html_url"],"state":"OPEN","updatedAt":value["updated_at"],"author":value["user"]});
        Ok(node_item(repository, GithubKind::Issue, &node))
    }
}

fn manual_links(value: &str) -> Vec<String> {
    serde_json::from_str(value).unwrap_or_else(|_| {
        if value.is_empty() {
            vec![]
        } else {
            vec![value.to_owned()]
        }
    })
}

fn string(v: &Value, key: &str) -> String {
    v[key].as_str().unwrap_or_default().to_owned()
}
fn names(v: &Value, field: &str) -> Vec<String> {
    v["nodes"]
        .as_array()
        .into_iter()
        .flatten()
        .filter_map(|v| v[field].as_str().map(str::to_owned))
        .collect()
}

fn search_query(
    repositories: &[String],
    kind: GithubKind,
    filters: &GithubSearch,
) -> Result<String> {
    if repositories.is_empty() || repositories.len() > 10 {
        return Err(Error::Other(
            "Search requires 1 to 10 repositories per page".into(),
        ));
    }
    for repository in repositories {
        validate_repository(repository)?;
    }
    let kind = match kind {
        GithubKind::Issue => "issue",
        GithubKind::PullRequest => "pr",
        _ => {
            return Err(Error::Other(
                "GitHub search supports issues and pull requests".into(),
            ))
        }
    };
    if filters.text.chars().count() > 200 {
        return Err(Error::Other(
            "Search text must be 200 characters or fewer".into(),
        ));
    }
    let quote = |s: &str| format!("\"{}\"", s.replace('\\', "\\\\").replace('"', "\\\""));
    let mut parts: Vec<String> = repositories.iter().map(|r| format!("repo:{r}")).collect();
    parts.extend([format!("is:{kind}"), "sort:updated-desc".into()]);
    // User text is literal; qualifiers are provided by the structured controls.
    parts.extend(filters.text.split_whitespace().map(quote));
    for (key, value) in [
        ("author", &filters.author),
        ("assignee", &filters.assignee),
        ("label", &filters.label),
    ] {
        if !value.trim().is_empty() {
            parts.push(format!("{key}:{}", quote(value.trim())));
        }
    }
    match filters.state.as_str() {
        "all" => {}
        "open" => parts.push("is:open".into()),
        "closed" => parts.push("is:closed".into()),
        _ => return Err(Error::Other("Invalid search state".into())),
    }
    match filters.review.as_str() {
        "" => {}
        "required" | "approved" | "changes_requested" => {
            parts.push(format!("review:{}", filters.review))
        }
        "requested" => parts.push("review-requested:@me".into()),
        _ => return Err(Error::Other("Invalid review filter".into())),
    }
    Ok(parts.join(" "))
}

fn node_item(repository: &str, kind: GithubKind, v: &Value) -> GithubItem {
    let branch = kind == GithubKind::Branch;
    let target = &v["target"];
    GithubItem {
        id: string(v, "id"),
        repository: repository.to_owned(),
        kind,
        number: v["number"].as_u64().and_then(|n| n.try_into().ok()),
        title: string(v, if branch { "name" } else { "title" }),
        body: if branch {
            string(target, "message")
        } else {
            string(v, "body")
        },
        url: if branch {
            format!(
                "https://github.com/{repository}/tree/{}",
                encode_path(&string(v, "name"))
            )
        } else {
            string(v, "url")
        },
        state: if branch {
            "Branch".into()
        } else if v["isDraft"].as_bool().unwrap_or(false) && v["state"] == "OPEN" {
            "DRAFT".into()
        } else {
            string(v, "state")
        },
        updated_at: if branch {
            string(target, "committedDate")
        } else {
            string(v, "updatedAt")
        },
        author: if branch {
            target["author"]["user"]["login"]
                .as_str()
                .or(target["author"]["name"].as_str())
                .unwrap_or_default()
                .to_owned()
        } else {
            string(&v["author"], "login")
        },
        assignees: names(&v["assignees"], "login"),
        labels: names(&v["labels"], "name"),
        reviewers: v["reviewRequests"]["nodes"]
            .as_array()
            .into_iter()
            .flatten()
            .filter_map(|r| r["requestedReviewer"]["login"].as_str().map(str::to_owned))
            .collect(),
        branch: if branch {
            Some(string(v, "name"))
        } else {
            v["headRefName"].as_str().map(str::to_owned)
        },
        checks: v["commits"]["nodes"][0]["commit"]["statusCheckRollup"]["state"]
            .as_str()
            .map(str::to_owned),
        review_decision: v["reviewDecision"].as_str().map(str::to_owned),
    }
}

fn event_item(repository: &str, v: &Value) -> GithubItem {
    let payload = &v["payload"];
    let event_type = string(v, "type");
    let subject = payload
        .get("issue")
        .or_else(|| payload.get("pull_request"))
        .or_else(|| payload.get("release"));
    let action = string(payload, "action");
    let title = match event_type.as_str() {
        "PushEvent" => format!(
            "Pushed to {}",
            string(payload, "ref").trim_start_matches("refs/heads/")
        ),
        "CreateEvent" | "DeleteEvent" => format!(
            "{} {} {}",
            if event_type == "CreateEvent" {
                "Created"
            } else {
                "Deleted"
            },
            string(payload, "ref_type"),
            string(payload, "ref")
        ),
        _ => format!(
            "{}{}{}",
            event_type.trim_end_matches("Event"),
            if action.is_empty() {
                String::new()
            } else {
                format!(" · {action}")
            },
            subject
                .and_then(|s| s["title"].as_str().or(s["name"].as_str()))
                .map(|s| format!(": {s}"))
                .unwrap_or_default()
        ),
    };
    let comment = payload.get("comment").or_else(|| payload.get("review"));
    let url = comment
        .and_then(|c| c["html_url"].as_str())
        .or_else(|| subject.and_then(|s| s["html_url"].as_str()))
        .map(str::to_owned)
        .unwrap_or_else(|| {
            if event_type == "PushEvent" {
                format!(
                    "https://github.com/{repository}/commits/{}",
                    encode_path(string(payload, "ref").trim_start_matches("refs/heads/"))
                )
            } else {
                format!("https://github.com/{repository}")
            }
        });
    GithubItem {
        id: format!("event:{}", string(v, "id")),
        repository: repository.to_owned(),
        kind: GithubKind::Activity,
        number: None,
        title,
        body: comment
            .and_then(|c| c["body"].as_str())
            .or_else(|| subject.and_then(|s| s["body"].as_str()))
            .unwrap_or_default()
            .to_owned(),
        url,
        state: event_type.trim_end_matches("Event").to_owned(),
        updated_at: string(v, "created_at"),
        author: string(&v["actor"], "login"),
        assignees: vec![],
        reviewers: vec![],
        labels: vec![],
        branch: None,
        checks: None,
        review_decision: None,
    }
}

pub(crate) fn validate_repository(repository: &str) -> Result<(&str, &str)> {
    let (owner, name) = repository
        .split_once('/')
        .ok_or_else(|| Error::Other("Expected owner/repository".into()))?;
    let valid = |s: &str| {
        !s.is_empty()
            && s != "."
            && s != ".."
            && s.bytes()
                .all(|b| b.is_ascii_alphanumeric() || b"._-".contains(&b))
    };
    if !valid(owner) || !valid(name) {
        return Err(Error::Other("Invalid GitHub repository".into()));
    }
    Ok((owner, name))
}

fn github_remote(remote: &str) -> Option<String> {
    let url = crate::git_info::web_url(remote)?;
    let repo = url.strip_prefix("https://github.com/")?;
    validate_repository(repo).ok()?;
    Some(repo.to_owned())
}

pub(crate) fn encode_path(value: &str) -> String {
    value
        .bytes()
        .map(|b| {
            if b.is_ascii_alphanumeric() || b"-._~".contains(&b) {
                char::from(b).to_string()
            } else {
                format!("%{b:02X}")
            }
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn repository_inputs_cannot_change_endpoint_or_host() {
        for input in [
            "owner/repo?x=1",
            "../repo",
            "owner/../repo",
            "owner/repo/extra",
            "https://evil/repo",
            "owner/",
            "owner/repo#x",
        ] {
            assert!(validate_repository(input).is_err(), "{input}");
        }
        assert!(validate_repository("HelgeSverre/splash").is_ok());
        assert_eq!(
            github_remote("git@github.com:HelgeSverre/splash.git"),
            Some("HelgeSverre/splash".into())
        );
        assert_eq!(github_remote("https://github.com.evil/owner/repo"), None);
        assert_eq!(encode_path("feature/a#b"), "feature%2Fa%23b");
    }

    #[test]
    fn draft_pr_keeps_reviewers_checks_and_assignees() {
        let item = node_item(
            "a/b",
            GithubKind::PullRequest,
            &json!({"id":"PR1","number":12,"state":"OPEN","isDraft":true,"assignees":{"nodes":[{"login":"owner"}]},"reviewRequests":{"nodes":[{"requestedReviewer":{"login":"reviewer"}},{"requestedReviewer":{}}]},"commits":{"nodes":[{"commit":{"statusCheckRollup":{"state":"FAILURE"}}}]}}),
        );
        assert_eq!(item.state, "DRAFT");
        assert_eq!(item.reviewers, vec!["reviewer"]);
        assert_eq!(item.assignees, vec!["owner"]);
        assert_eq!(item.checks.as_deref(), Some("FAILURE"));
    }

    #[test]
    fn branch_date_is_commit_date_and_comments_link_to_comment() {
        let branch = node_item(
            "a/b",
            GithubKind::Branch,
            &json!({"id":"ref1","name":"feat/a","target":{"message":"fix","committedDate":"2026-01-01T00:00:00Z"}}),
        );
        assert_eq!(branch.updated_at, "2026-01-01T00:00:00Z");
        assert!(branch.url.ends_with("feat%2Fa"));
        let event = event_item(
            "a/b",
            &json!({"id":"1","type":"IssueCommentEvent","payload":{"action":"created","issue":{"title":"fix","html_url":"https://github.com/a/b/issues/1"},"comment":{"body":"hello","html_url":"https://github.com/a/b/issues/1#issuecomment-1"}}}),
        );
        assert_eq!(event.body, "hello");
        assert!(event.url.ends_with("#issuecomment-1"));
    }
    fn filters() -> GithubSearch {
        GithubSearch {
            text: "fix login".into(),
            author: "@me".into(),
            assignee: "".into(),
            label: "good first issue".into(),
            review: "".into(),
            state: "open".into(),
        }
    }

    #[test]
    fn search_scope_and_qualifiers_are_structured() {
        let q = search_query(&["a/b".into()], GithubKind::Issue, &filters()).unwrap();
        assert!(q.starts_with("repo:a/b is:issue sort:updated-desc"));
        assert!(q.contains(r#"label:"good first issue""#));
        assert!(q.contains("is:open"));
        let grouped =
            search_query(&["a/b".into(), "c/d".into()], GithubKind::Issue, &filters()).unwrap();
        assert!(grouped.starts_with("repo:a/b repo:c/d is:issue"));
        assert!(search_query(&[], GithubKind::Issue, &filters()).is_err());
        assert!(search_query(&vec!["a/b".into(); 11], GithubKind::Issue, &filters()).is_err());
        let mut f = filters();
        f.text = r#"repo:evil/other OR author:someone"#.into();
        let q = search_query(&["a/b".into()], GithubKind::Issue, &f).unwrap();
        assert!(q.contains(r#""repo:evil/other" "OR" "author:someone""#));
        assert!(search_query(&["a/b".into()], GithubKind::Branch, &f).is_err());
        f.review = "unknown".into();
        assert!(search_query(&["a/b".into()], GithubKind::Issue, &f).is_err());
    }

    #[tokio::test]
    async fn search_preserves_cursor_and_rejects_out_of_scope_results() {
        let fixture = Fixture::new();
        fixture.response(r#"{"data":{"search":{"nodes":[{"id":"one","number":1,"repository":{"nameWithOwner":"A/B"},"state":"OPEN"},{"id":"outside","repository":{"nameWithOwner":"c/d"}}],"pageInfo":{"hasNextPage":true,"endCursor":"next"}}}}"#, true);
        let page = fixture
            .github
            .search(
                &["a/b".into()],
                GithubKind::Issue,
                filters(),
                Some("before".into()),
            )
            .await
            .unwrap();
        assert_eq!(page.items.len(), 1);
        assert_eq!(page.items[0].repository, "a/b");
        assert_eq!(page.next_cursor.as_deref(), Some("next"));
        let input: Value =
            serde_json::from_str(&std::fs::read_to_string(fixture.dir.join("input")).unwrap())
                .unwrap();
        assert_eq!(input["variables"]["cursor"], "before");
        assert!(input["variables"]["q"]
            .as_str()
            .unwrap()
            .contains("repo:a/b"));
        fixture.response(
            r#"{"data":{"search":{"nodes":[]}},"errors":[{"message":"rate limit exceeded"}]}"#,
            true,
        );
        assert!(fixture
            .github
            .search(&["a/b".into()], GithubKind::Issue, filters(), None)
            .await
            .unwrap_err()
            .to_string()
            .contains("rate limit"));
    }

    struct Fixture {
        dir: std::path::PathBuf,
        github: Github,
    }
    impl Fixture {
        fn new() -> Self {
            let dir = std::env::temp_dir().join(crate::store::new_id("github-test"));
            std::fs::create_dir_all(&dir).unwrap();
            let hub = crate::hub::Hub::new(dir.clone(), elyra::EventBus::new());
            let mut github = Github::new(hub.core.clone());
            github.executable = Some(dir.join(if cfg!(windows) { "gh.cmd" } else { "gh" }));
            Self { dir, github }
        }
        fn response(&self, json: &str, success: bool) {
            std::fs::write(self.dir.join("response.json"), json).unwrap();
            std::fs::write(self.dir.join("status"), if success { "0" } else { "1" }).unwrap();
            std::fs::write(self.dir.join("fixture.py"), r#"import pathlib, sys
root = pathlib.Path(__file__).parent
(root / 'args').write_text('\n'.join(sys.argv[1:]), encoding='utf-8')
if '--input' in sys.argv:
    (root / 'input').write_text(sys.stdin.read(), encoding='utf-8')
status = int((root / 'status').read_text())
print((root / 'response.json').read_text(encoding='utf-8'), file=sys.stderr if status else sys.stdout)
sys.exit(status)
"#).unwrap();
            #[cfg(windows)]
            std::fs::write(
                self.dir.join("gh.cmd"),
                "@echo off\r\npython \"%~dp0fixture.py\" %*\r\n",
            )
            .unwrap();
            #[cfg(unix)]
            {
                use std::os::unix::fs::PermissionsExt;
                let path = self.dir.join("gh");
                std::fs::write(
                    &path,
                    "#!/bin/sh\nexec python3 \"$(dirname \"$0\")/fixture.py\" \"$@\"\n",
                )
                .unwrap();
                std::fs::set_permissions(path, std::fs::Permissions::from_mode(0o700)).unwrap();
            }
        }
    }
    impl Drop for Fixture {
        fn drop(&mut self) {
            let _ = std::fs::remove_dir_all(&self.dir);
        }
    }

    #[tokio::test]
    async fn actions_pages_jobs_and_logs_are_bounded_and_read_only() {
        use crate::github_actions::ActionsFilters;
        let fixture = Fixture::new();
        fixture.response(r#"{"total_count":31,"workflow_runs":[{"id":42,"run_attempt":2,"status":"in_progress","workflow_id":7,"display_title":"Build"}]}"#, true);
        let filters = ActionsFilters {
            status: "in_progress".into(),
            branch: "feat/a&b".into(),
            event: "".into(),
            created: "".into(),
            workflow_id: None,
        };
        let page = fixture
            .github
            .actions_runs("a/b", filters, 1)
            .await
            .unwrap();
        assert_eq!(page.next_page, Some(2));
        assert_eq!(page.runs[0].attempt, 2);
        let args = std::fs::read_to_string(fixture.dir.join("args")).unwrap();
        assert!(args.contains("branch=feat%2Fa%26b"));
        assert!(!args.contains("--input"));
        fixture.response(r#"{"total_count":1,"jobs":[{"id":99,"name":"test","status":"completed","conclusion":"failure","steps":[{"number":2,"name":"tests","status":"completed","conclusion":"failure"}]}]}"#,true);
        let jobs = fixture
            .github
            .actions_jobs("a/b", "42", 2, 1)
            .await
            .unwrap();
        assert_eq!(jobs.jobs[0].steps[0].conclusion.as_deref(), Some("failure"));
        assert!(std::fs::read_to_string(fixture.dir.join("args"))
            .unwrap()
            .contains("runs/42/attempts/2/jobs"));
        fixture.response(
            r#"{"total_count":1,"workflows":[{"id":7,"name":"CI","state":"disabled_manually"}]}"#,
            true,
        );
        let workflows = fixture.github.actions_workflows("a/b", 1).await.unwrap();
        assert_eq!(workflows.workflows[0].state, "disabled_manually");
        fixture.response(
            "--allow-escape-sequences hello <script>literal log</script>",
            true,
        );
        let log = fixture.github.actions_log("a/b", "99").await.unwrap();
        assert!(log.text.contains("<script>"));
        assert!(!log.truncated);
        assert!(std::fs::read_to_string(fixture.dir.join("args"))
            .unwrap()
            .contains("--allow-escape-sequences"));
        fixture.response(&"x".repeat(512 * 1024 + 100), true);
        let log = fixture.github.actions_log("a/b", "99").await.unwrap();
        assert!(log.truncated);
        assert_eq!(log.text.len(), 512 * 1024);
        fixture.response("HTTP 410: logs expired", false);
        assert!(fixture
            .github
            .actions_log("a/b", "99")
            .await
            .unwrap_err()
            .to_string()
            .contains("410"));
        assert!(fixture
            .github
            .actions_jobs("a/b", "42", 0, 1)
            .await
            .is_err());
        assert!(fixture.github.actions_log("a/b", "../99").await.is_err());
    }

    #[tokio::test]
    async fn issue_creation_passes_literal_json_and_preserves_errors() {
        let fixture = Fixture::new();
        fixture.response(r#"{"node_id":"issue-1","number":42,"title":"created","html_url":"https://github.com/a/b/issues/42","updated_at":"2026-10-06T00:00:00Z"}"#, true);
        let title = "Literal $(touch unexpected) `command` \"quote\"";
        let body = "## Context\n- [ ] a task\n\n**bold** & <html>";
        let created = fixture
            .github
            .create_issue("a/b", title, body)
            .await
            .unwrap();
        assert_eq!(created.number, Some(42));
        let sent: Value =
            serde_json::from_str(&std::fs::read_to_string(fixture.dir.join("input")).unwrap())
                .unwrap();
        assert_eq!(sent, json!({"title":title,"body":body}));
        let args = std::fs::read_to_string(fixture.dir.join("args")).unwrap();
        assert!(args.contains("repos/a/b/issues\n--input\n-"));
        assert!(!fixture.dir.join("unexpected").exists());
        fixture.response("HTTP 403: issues are disabled", false);
        assert!(fixture
            .github
            .create_issue("a/b", "title", "")
            .await
            .unwrap_err()
            .to_string()
            .contains("403"));
        assert!(fixture.github.create_issue("a/b", " ", "").await.is_err());
    }

    #[tokio::test]
    async fn graphql_pages_forward_cursors_and_reject_partial_errors() {
        let fixture = Fixture::new();
        fixture.response(r#"{"data":{"repository":{"issues":{"nodes":[{"id":"i1","number":1,"title":"one","state":"OPEN"}],"pageInfo":{"hasNextPage":true,"endCursor":"next"}}}}}"#, true);
        let page = fixture
            .github
            .page("a/b", GithubKind::Issue, Some("previous".into()))
            .await
            .unwrap();
        assert_eq!(page.items.len(), 1);
        assert_eq!(page.next_cursor.as_deref(), Some("next"));
        let sent: Value =
            serde_json::from_str(&std::fs::read_to_string(fixture.dir.join("input")).unwrap())
                .unwrap();
        assert_eq!(sent["variables"]["cursor"], "previous");
        fixture.response(r#"{"data":{},"errors":[{"message":"rate limit"}]}"#, true);
        assert!(fixture
            .github
            .page("a/b", GithubKind::Issue, None)
            .await
            .unwrap_err()
            .to_string()
            .contains("rate limit"));
    }

    #[tokio::test]
    async fn manual_links_keep_multiple_projects_and_validate_ids() {
        let fixture = Fixture::new();
        let store = fixture.github.core.store().await.unwrap();
        let first = store
            .add_project(fixture.dir.to_str().unwrap(), "first", false)
            .await
            .unwrap();
        let other = fixture.dir.join("other");
        std::fs::create_dir(&other).unwrap();
        let second = store
            .add_project(other.to_str().unwrap(), "second", false)
            .await
            .unwrap();
        fixture.github.link("a/b", Some(&first.id)).await.unwrap();
        fixture.github.link("A/B", Some(&second.id)).await.unwrap();
        let settings = store.settings().await.unwrap();
        assert_eq!(
            manual_links(&settings["github.link.a/b"]),
            vec![first.id, second.id]
        );
        assert!(fixture.github.link("a/b", Some("missing")).await.is_err());
    }
}
