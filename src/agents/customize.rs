//! What agents can be customised with, read from disk: skills (`SKILL.md`
//! folders) and MCP servers from each agent's own config. Read-only, and
//! secrets never leave this module — headers and env are reported by key.

use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::json::str_opt;

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct Skill {
    pub name: String,
    pub description: String,
    /// The skill's folder.
    pub path: String,
    /// Where it was found, for grouping (`~/.claude/skills`).
    pub source: String,
    /// Agents that read this location (empty for shared `.agents/skills`).
    pub agents: Vec<String>,
    /// The project it belongs to, for project-level skills.
    pub project: Option<String>,
    /// `user-invocable: false` hides it from the `/` menu (Claude).
    pub user_invocable: bool,
    /// `disable-model-invocation: true`: only runs when called by name.
    pub manual_only: bool,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct McpServer {
    pub agent: String,
    pub name: String,
    /// stdio, http, sse…
    pub transport: String,
    /// The command line or URL (never headers or env values).
    pub target: String,
    pub enabled: bool,
    pub header_keys: Vec<String>,
    pub env_keys: Vec<String>,
    /// The config file it came from.
    pub source: String,
    /// For project-scoped servers (Claude's per-project config).
    pub project: Option<String>,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct McpSourceError {
    pub agent: String,
    pub source: String,
    pub error: String,
}

#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct McpList {
    pub servers: Vec<McpServer>,
    pub errors: Vec<McpSourceError>,
}

// ── skills ───────────────────────────────────────────────────────────────────

/// Skill folders under the user's home, and which agent reads each.
const HOME_SKILLS: &[(&str, &[&str])] = &[
    (".claude/skills", &["claude"]),
    (".codex/skills", &["codex"]),
    (".config/poolside/skills", &["pool"]),
    (".pi/agent/skills", &["pi"]),
    (".glue/skills", &["glue"]),
    (".agents/skills", &[]),
];

/// Per-project skill folders.
const PROJECT_SKILLS: &[(&str, &[&str])] =
    &[(".claude/skills", &["claude"]), (".agents/skills", &[])];

pub fn skills(home: &Path, projects: &[(String, PathBuf)]) -> Vec<Skill> {
    let mut out = Vec::new();
    for (rel, agents) in HOME_SKILLS {
        scan(&home.join(rel), &format!("~/{rel}"), agents, None, &mut out);
    }
    for (name, root) in projects {
        for (rel, agents) in PROJECT_SKILLS {
            scan(
                &root.join(rel),
                &format!("{name}/{rel}"),
                agents,
                Some(name),
                &mut out,
            );
        }
    }
    out
}

fn scan(dir: &Path, source: &str, agents: &[&str], project: Option<&String>, out: &mut Vec<Skill>) {
    let Ok(read) = std::fs::read_dir(dir) else {
        return;
    };
    let mut found: Vec<Skill> = read
        .filter_map(Result::ok)
        .filter_map(|e| {
            let folder = e.path();
            // Follow symlinked skill folders.
            if !std::fs::metadata(&folder).ok()?.is_dir() {
                return None;
            }
            let text = std::fs::read_to_string(folder.join("SKILL.md")).ok()?;
            let (front, _) = split_frontmatter(&text);
            let fallback = e.file_name().to_string_lossy().into_owned();
            Some(Skill {
                name: front["name"].as_str().map(String::from).unwrap_or(fallback),
                description: front["description"]
                    .as_str()
                    .unwrap_or("")
                    .trim()
                    .to_string(),
                path: folder.display().to_string(),
                source: source.to_string(),
                agents: agents.iter().map(|a| a.to_string()).collect(),
                project: project.cloned(),
                user_invocable: front["user-invocable"].as_bool().unwrap_or(true),
                manual_only: front["disable-model-invocation"].as_bool().unwrap_or(false),
            })
        })
        .collect();
    found.sort_by_key(|s| s.name.to_lowercase());
    out.extend(found);
}

/// Split a markdown file into its frontmatter — the YAML between leading
/// `---` lines, as JSON (`Null` when absent or bad) — and the body after it.
fn split_frontmatter(text: &str) -> (Value, &str) {
    let Some(rest) = text.trim_start().strip_prefix("---") else {
        return (Value::Null, text);
    };
    let Some(end) = rest.find("\n---") else {
        return (Value::Null, text);
    };
    let front = serde_yaml_ng::from_str::<Value>(&rest[..end]).unwrap_or(Value::Null);
    let body = rest[end + 4..].split_once('\n').map_or("", |(_, b)| b);
    (front, body)
}

// ── command files ────────────────────────────────────────────────────────────

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct CommandFile {
    pub agent: String,
    /// As typed after `/`: subfolders become namespaces (`git:commit`).
    pub name: String,
    pub path: String,
    pub project: Option<String>,
}

/// Where agents keep custom commands, by agent.
const HOME_COMMANDS: &[(&str, &str)] = &[
    (".claude/commands", "claude"),
    (".codex/prompts", "codex"),
    (".pi/agent/prompts", "pi"),
];
const PROJECT_COMMANDS: &[(&str, &str)] = &[(".claude/commands", "claude")];

pub fn command_files(home: &Path, projects: &[(String, PathBuf)]) -> Vec<CommandFile> {
    let mut out = Vec::new();
    for (rel, agent) in HOME_COMMANDS {
        collect_commands(&home.join(rel), &home.join(rel), agent, None, &mut out);
    }
    for (name, root) in projects {
        for (rel, agent) in PROJECT_COMMANDS {
            collect_commands(
                &root.join(rel),
                &root.join(rel),
                agent,
                Some(name),
                &mut out,
            );
        }
    }
    out.sort_by(|a, b| (&a.agent, &a.name).cmp(&(&b.agent, &b.name)));
    out
}

fn collect_commands(
    base: &Path,
    dir: &Path,
    agent: &str,
    project: Option<&String>,
    out: &mut Vec<CommandFile>,
) {
    let Ok(read) = std::fs::read_dir(dir) else {
        return;
    };
    for e in read.filter_map(Result::ok) {
        let path = e.path();
        let Ok(meta) = std::fs::metadata(&path) else {
            continue;
        };
        if meta.is_dir() {
            collect_commands(base, &path, agent, project, out);
        } else if path.extension().is_some_and(|x| x == "md") {
            let rel = path.strip_prefix(base).unwrap_or(&path).with_extension("");
            let name = rel
                .components()
                .map(|c| c.as_os_str().to_string_lossy())
                .collect::<Vec<_>>()
                .join(":");
            out.push(CommandFile {
                agent: agent.into(),
                name,
                path: path.display().to_string(),
                project: project.cloned(),
            });
        }
    }
}

// ── reading a skill or command ───────────────────────────────────────────────

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct DocField {
    pub key: String,
    pub value: Value,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct Doc {
    pub path: String,
    pub frontmatter: Vec<DocField>,
    pub body: String,
}

/// Read a skill's `SKILL.md` (or a skill folder) or a command file — but only
/// from the folders skills and commands are discovered in, so this can't be
/// used to read anything else.
pub fn read_doc(home: &Path, projects: &[(String, PathBuf)], path: &str) -> Result<Doc, String> {
    let mut target = PathBuf::from(path);
    if target.is_dir() {
        target = target.join("SKILL.md");
    }
    let real = target.canonicalize().map_err(|e| format!("{path}: {e}"))?;
    let mut roots: Vec<PathBuf> = HOME_SKILLS
        .iter()
        .map(|(rel, _)| home.join(rel))
        .chain(HOME_COMMANDS.iter().map(|(rel, _)| home.join(rel)))
        .collect();
    for (_, root) in projects {
        roots.extend(PROJECT_SKILLS.iter().map(|(rel, _)| root.join(rel)));
        roots.extend(PROJECT_COMMANDS.iter().map(|(rel, _)| root.join(rel)));
    }
    let allowed = real.extension().is_some_and(|x| x == "md")
        && roots
            .iter()
            .filter_map(|r| r.canonicalize().ok())
            .any(|r| real.starts_with(&r));
    if !allowed {
        return Err(format!("{path} is not a skill or command file"));
    }
    let text = std::fs::read_to_string(&real).map_err(|e| format!("{path}: {e}"))?;
    let (front, body) = split_frontmatter(&text);
    let frontmatter = front
        .as_object()
        .map(|m| {
            m.iter()
                .map(|(k, v)| DocField {
                    key: k.clone(),
                    value: v.clone(),
                })
                .collect()
        })
        .unwrap_or_default();
    Ok(Doc {
        path: real.display().to_string(),
        frontmatter,
        body: body.trim_start_matches('\n').to_string(),
    })
}

/// A server found in a config: (project, name, raw object).
type Found = (Option<String>, String, Value);

// ── MCP servers ──────────────────────────────────────────────────────────────

pub fn mcp_servers(home: &Path) -> McpList {
    let mut list = McpList::default();
    let mut read = |agent: &str,
                    rel: &str,
                    parse: fn(&str) -> Result<Value, String>,
                    extract: fn(&Value) -> Vec<Found>| {
        let path = home.join(rel);
        let source = path.display().to_string();
        let Ok(text) = std::fs::read_to_string(&path) else {
            return;
        };
        match parse(&text) {
            Ok(doc) => {
                for (project, name, v) in extract(&doc) {
                    list.servers
                        .push(server(agent, &name, &v, &source, project));
                }
            }
            Err(error) => list.errors.push(McpSourceError {
                agent: agent.into(),
                source,
                error,
            }),
        }
    };
    read("claude", ".claude.json", json, |doc| {
        let mut out = entries(&doc["mcpServers"], None);
        if let Some(projects) = doc["projects"].as_object() {
            for (path, p) in projects {
                out.extend(entries(&p["mcpServers"], Some(path.clone())));
            }
        }
        out
    });
    read("codex", ".codex/config.toml", toml_doc, |doc| {
        entries(&doc["mcp_servers"], None)
    });
    read("pool", ".config/poolside/settings.yaml", yaml, |doc| {
        entries(&doc["mcp_servers"], None)
    });
    read("pi", ".pi/agent/mcp.json", json, |doc| {
        entries(&doc["mcpServers"], None)
    });
    read("glue", ".glue/config.yaml", yaml, |doc| {
        entries(&doc["mcp"]["servers"], None)
    });
    list
}

fn json(text: &str) -> Result<Value, String> {
    serde_json::from_str(text).map_err(|e| e.to_string())
}
fn toml_doc(text: &str) -> Result<Value, String> {
    toml::from_str::<Value>(text).map_err(|e| e.to_string())
}
fn yaml(text: &str) -> Result<Value, String> {
    serde_yaml_ng::from_str::<Value>(text).map_err(|e| e.to_string())
}

fn entries(map: &Value, project: Option<String>) -> Vec<Found> {
    map.as_object()
        .into_iter()
        .flatten()
        .map(|(name, v)| (project.clone(), name.clone(), v.clone()))
        .collect()
}

/// One server object, whatever the agent's shape: flat (`command`/`url`) or
/// nested (`transport: {type, url}`).
fn server(agent: &str, name: &str, v: &Value, source: &str, project: Option<String>) -> McpServer {
    let t = &v["transport"];
    let url = str_opt(v, "url")
        .or_else(|| str_opt(v, "httpUrl"))
        .or_else(|| str_opt(t, "url"));
    let command = str_opt(v, "command").or_else(|| str_opt(t, "command"));
    let args: Vec<String> = [&v["args"], &t["args"]]
        .iter()
        .find_map(|a| a.as_array())
        .map(|a| {
            a.iter()
                .filter_map(|x| x.as_str().map(String::from))
                .collect()
        })
        .unwrap_or_default();
    let transport = str_opt(v, "type")
        .or_else(|| str_opt(t, "type"))
        .or_else(|| t.as_str().map(String::from))
        .unwrap_or_else(|| {
            if url.is_some() {
                "http".into()
            } else if command.is_some() {
                "stdio".into()
            } else {
                "?".into()
            }
        });
    let target = match (&url, &command) {
        (Some(u), _) => u.clone(),
        (None, Some(c)) => std::iter::once(c.clone())
            .chain(args)
            .collect::<Vec<_>>()
            .join(" "),
        (None, None) => "(configured elsewhere)".into(),
    };
    let enabled =
        v["enabled"].as_bool().unwrap_or(true) && !v["disabled"].as_bool().unwrap_or(false);
    let mut header_keys = Vec::new();
    for h in [&v["headers"], &v["http_headers"], &t["headers"]] {
        header_keys.extend(keys_of(h));
    }
    McpServer {
        agent: agent.into(),
        name: name.into(),
        transport,
        target,
        enabled,
        header_keys,
        env_keys: keys_of(&v["env"]),
        source: source.into(),
        project,
    }
}

/// Keys of a map, or the names from `"Key: value"` strings — never the values.
fn keys_of(v: &Value) -> Vec<String> {
    match v {
        Value::Object(m) => m.keys().cloned().collect(),
        Value::Array(items) => items
            .iter()
            .filter_map(|i| i.as_str())
            .filter_map(|s| s.split_once(':').map(|(k, _)| k.trim().to_string()))
            .collect(),
        _ => Vec::new(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn home() -> PathBuf {
        let h = std::env::temp_dir().join(crate::store::new_id("home"));
        std::fs::create_dir_all(&h).unwrap();
        h
    }

    fn write(path: PathBuf, text: &str) {
        std::fs::create_dir_all(path.parent().unwrap()).unwrap();
        std::fs::write(path, text).unwrap();
    }

    #[test]
    fn skills_come_from_frontmatter_per_location() {
        let h = home();
        write(
            h.join(".claude/skills/deploy/SKILL.md"),
            "---\nname: deploy\ndescription: >\n  Ship it\n  safely.\nhidden: true\n---\n# body",
        );
        write(
            h.join(".agents/skills/review/SKILL.md"),
            "---\nname: review\ndescription: \"Review: diffs\"\nuser-invocable: false\ndisable-model-invocation: true\n---\n",
        );
        write(h.join(".codex/skills/nofront/SKILL.md"), "just text");
        std::fs::create_dir_all(h.join(".claude/skills/empty")).unwrap();
        let proj = h.join("repo");
        write(
            proj.join(".claude/skills/local/SKILL.md"),
            "---\nname: local-one\ndescription: here\n---\n",
        );

        let s = skills(&h, &[("repo".into(), proj)]);
        let by = |n: &str| {
            s.iter()
                .find(|x| x.name == n)
                .unwrap_or_else(|| panic!("{n} in {s:?}"))
        };
        assert_eq!(by("deploy").description, "Ship it safely.");
        assert_eq!(by("deploy").agents, vec!["claude"]);
        assert_eq!(by("review").description, "Review: diffs");
        assert!(by("review").agents.is_empty());
        assert!(!by("review").user_invocable && by("review").manual_only);
        assert!(by("deploy").user_invocable && !by("deploy").manual_only);
        assert_eq!(by("nofront").source, "~/.codex/skills");
        assert_eq!(by("local-one").project.as_deref(), Some("repo"));
        assert!(
            !s.iter().any(|x| x.name == "empty"),
            "folders without SKILL.md are skipped"
        );
        let _ = std::fs::remove_dir_all(h);
    }

    #[test]
    fn command_files_are_namespaced_by_folder() {
        let h = home();
        write(h.join(".claude/commands/review.md"), "Review the diff");
        write(
            h.join(".claude/commands/git/commit.md"),
            "---\ndescription: commit\n---\nCommit it",
        );
        write(h.join(".codex/prompts/plan.md"), "Plan");
        write(h.join(".codex/prompts/notes.txt"), "not a command");
        let proj = h.join("repo");
        write(proj.join(".claude/commands/deploy.md"), "Deploy");

        let files = command_files(&h, &[("repo".into(), proj)]);
        let names: Vec<(&str, &str)> = files
            .iter()
            .map(|f| (f.agent.as_str(), f.name.as_str()))
            .collect();
        assert_eq!(
            names,
            vec![
                ("claude", "deploy"),
                ("claude", "git:commit"),
                ("claude", "review"),
                ("codex", "plan")
            ]
        );
        assert_eq!(files[0].project.as_deref(), Some("repo"));
        let _ = std::fs::remove_dir_all(h);
    }

    #[test]
    fn read_doc_parses_frontmatter_and_stays_inside_the_roots() {
        let h = home();
        write(h.join(".claude/skills/deploy/SKILL.md"), "---\nname: deploy\nallowed-tools: [Bash, Read]\nuser-invocable: false\n---\n# Deploy\nShip it.\n");
        write(h.join("secret.md"), "nope");
        let doc = read_doc(&h, &[], &h.join(".claude/skills/deploy").to_string_lossy()).unwrap();
        let keys: Vec<&str> = doc.frontmatter.iter().map(|f| f.key.as_str()).collect();
        assert_eq!(keys, vec!["name", "allowed-tools", "user-invocable"]);
        assert_eq!(doc.body, "# Deploy\nShip it.\n");
        assert!(read_doc(&h, &[], &h.join("secret.md").to_string_lossy()).is_err());
        assert!(read_doc(
            &h,
            &[],
            &h.join(".claude/skills/../../secret.md").to_string_lossy()
        )
        .is_err());
        assert!(read_doc(&h, &[], "/etc/hosts").is_err());
        #[cfg(unix)]
        {
            std::os::unix::fs::symlink(
                h.join("secret.md"),
                h.join(".claude/skills/deploy/link.md"),
            )
            .unwrap();
            assert!(read_doc(
                &h,
                &[],
                &h.join(".claude/skills/deploy/link.md").to_string_lossy()
            )
            .is_err());
        }
        let _ = std::fs::remove_dir_all(h);
    }

    #[test]
    fn mcp_servers_from_every_agent_without_secrets() {
        let h = home();
        write(
            h.join(".claude.json"),
            r#"{"mcpServers":{"docs":{"type":"http","url":"https://d.example/mcp","headers":{"Authorization":"Bearer SECRET"}}},
            "projects":{"/w/app":{"mcpServers":{"db":{"command":"npx","args":["db-mcp"],"env":{"DB_PASSWORD":"hunter2"}}}}}}"#,
        );
        write(h.join(".codex/config.toml"), "[mcp_servers.nightwatch]\nurl = \"https://n.example/mcp\"\nenabled = false\n\n[mcp_servers.repl]\ncommand = \"node\"\nargs = [\"repl.js\"]\n[mcp_servers.repl.env]\nTOKEN = \"x\"\n");
        write(h.join(".config/poolside/settings.yaml"), "mcp_servers:\n  wiki:\n    transport:\n      type: http\n      url: https://wiki.example/mcp\n      headers:\n        - 'Authorization: Bearer wiki-secret-token'\n");
        write(h.join(".pi/agent/mcp.json"), "{ not json");

        let list = mcp_servers(&h);
        let by = |n: &str| {
            list.servers
                .iter()
                .find(|x| x.name == n)
                .unwrap_or_else(|| panic!("{n} in {list:?}"))
        };
        assert_eq!(
            (by("docs").transport.as_str(), by("docs").target.as_str()),
            ("http", "https://d.example/mcp")
        );
        assert_eq!(by("docs").header_keys, vec!["Authorization"]);
        assert_eq!(by("db").project.as_deref(), Some("/w/app"));
        assert_eq!(by("db").target, "npx db-mcp");
        assert_eq!(by("db").env_keys, vec!["DB_PASSWORD"]);
        assert!(!by("nightwatch").enabled);
        assert_eq!(by("repl").transport, "stdio");
        assert_eq!(by("wiki").target, "https://wiki.example/mcp");
        assert_eq!(by("wiki").header_keys, vec!["Authorization"]);
        assert_eq!(list.errors.len(), 1);
        assert_eq!(list.errors[0].agent, "pi");
        let dump = serde_json::to_string(&list).unwrap();
        // Distinctive values: the dump includes temp paths, whose random
        // characters can contain a short marker such as "abc".
        for secret in ["SECRET", "hunter2", "wiki-secret-token", "\"x\""] {
            assert!(!dump.contains(secret), "leaked {secret}");
        }
        let _ = std::fs::remove_dir_all(h);
    }
}
