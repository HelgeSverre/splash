//! Raw ACP JSON → transcript. Pure and synchronous, so it's tested against
//! recorded fixtures without any process or UI.
//!
//! Works on `serde_json::Value` rather than the SDK's typed structs: adapters
//! add fields (`_meta`, `name`) and send updates the typed enum would drop.

use std::collections::{BTreeSet, HashMap};

use serde::{Deserialize, Serialize};
use serde_json::Value;

use super::model::*;
use crate::json::{str_at, str_or};

/// A change to push to the frontend. `version` counts changes per entry:
/// an `Upsert` is a full snapshot (apply if newer); an `AppendText` must be
/// exactly `local + 1`, otherwise the frontend resyncs.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
#[serde(tag = "op", rename_all = "snake_case")]
pub enum Change {
    Upsert {
        index: u32,
        version: u32,
        entry: Entry,
    },
    AppendText {
        index: u32,
        version: u32,
        delta: String,
    },
}

/// A transcript with per-entry versions, for (re)syncing the frontend.
#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct TranscriptSnapshot {
    pub entries: Vec<Entry>,
    pub versions: Vec<u32>,
}

impl TranscriptSnapshot {
    /// Stored entries, at version 1 like a restored [`Transcript`].
    pub fn from_history(entries: Vec<Entry>) -> Self {
        Self {
            versions: vec![1; entries.len()],
            entries,
        }
    }

    /// Apply a change by the rules `transcripts.svelte.ts` uses. False on a
    /// gap — an append that isn't exactly the next version of a text entry —
    /// which the frontend answers with a resync.
    pub fn apply(&mut self, change: &Change) -> bool {
        match change {
            Change::Upsert {
                index,
                version,
                entry,
            } => {
                let i = *index as usize;
                while self.entries.len() <= i {
                    self.entries.push(Entry::Divider {
                        text: String::new(),
                    });
                    self.versions.push(0);
                }
                if *version > self.versions[i] {
                    self.entries[i] = entry.clone();
                    self.versions[i] = *version;
                }
                true
            }
            Change::AppendText {
                index,
                version,
                delta,
            } => {
                let i = *index as usize;
                match self.entries.get_mut(i) {
                    Some(Entry::Agent { text, .. } | Entry::Thought { text, .. })
                        if self.versions[i] + 1 == *version =>
                    {
                        text.push_str(delta);
                        self.versions[i] = *version;
                        true
                    }
                    _ => false,
                }
            }
        }
    }
}

/// Settle a checkpointed entry whose actor no longer exists.
///
/// Actor checkpoints can be written between an update and the terminal ACP
/// message. Once that actor is gone, leaving that transient state in a cold
/// transcript would show a permanent spinner or unanswered permission.
/// Returns whether the entry changed so a live [`Transcript`] can persist its
/// recovery on the next flush.
pub fn settle_interrupted_entry(entry: &mut Entry) -> bool {
    match entry {
        Entry::Agent { streaming, .. } | Entry::Thought { streaming, .. } if *streaming => {
            *streaming = false;
            true
        }
        Entry::Tool { status, .. } if status == "pending" || status == "in_progress" => {
            *status = "failed".into();
            true
        }
        Entry::Permission {
            resolution: resolution @ None,
            ..
        } => {
            *resolution = Some("cancelled".into());
            true
        }
        _ => false,
    }
}

/// What an update did besides touching entries.
#[derive(Debug, Default, PartialEq)]
pub struct Effects {
    pub meta_changed: bool,
    /// Something on disk probably changed (a tool finished).
    pub workspace_dirty: bool,
}

const MAX_OUTPUT: usize = 8_000;
const MAX_INPUT: usize = 400;

#[derive(Default)]
pub struct Transcript {
    entries: Vec<Entry>,
    versions: Vec<u32>,
    tools: HashMap<String, usize>,
    /// The open streaming agent/thought entry.
    open: Option<usize>,
    /// Text appended to an entry since the last flush, not yet sent.
    pending: HashMap<usize, String>,
    /// Entries needing a full snapshot on the next flush.
    dirty: BTreeSet<usize>,
    /// Entries whose persisted form is stale.
    unsaved: BTreeSet<usize>,
    /// Where the current turn began (for replacing its plan).
    turn_start: usize,
    /// Between `begin_turn` and `end_turn`; output outside a turn is a notice.
    turn_active: bool,
    pub meta: SessionMeta,
}

impl Transcript {
    pub fn new() -> Self {
        Self::default()
    }

    /// Rebuild from persisted entries (versions restart at 1).
    ///
    /// Entries are checkpointed while a turn is live. If Splash did not get a
    /// chance to stop the actor cleanly, that checkpoint cannot keep claiming
    /// the old process is still streaming after a relaunch.
    pub fn restore(entries: Vec<Entry>) -> Self {
        let mut t = Self::new();
        for (i, e) in entries.iter().enumerate() {
            if let Entry::Tool { id, .. } = e {
                t.tools.insert(id.clone(), i);
            }
        }
        t.versions = vec![1; entries.len()];
        t.entries = entries;
        for i in 0..t.entries.len() {
            if settle_interrupted_entry(&mut t.entries[i]) {
                // Persist the recovered state on the actor's first flush so a
                // later retry does not recover the same stale checkpoint.
                t.touch(i);
            }
        }
        t.turn_start = t.entries.len();
        t
    }

    pub fn entries(&self) -> &[Entry] {
        &self.entries
    }

    pub fn len(&self) -> usize {
        self.entries.len()
    }

    pub fn is_empty(&self) -> bool {
        self.entries.is_empty()
    }

    pub fn push(&mut self, entry: Entry) -> usize {
        self.entries.push(entry);
        self.versions.push(0);
        let i = self.entries.len() - 1;
        self.touch(i);
        i
    }

    fn touch(&mut self, i: usize) {
        self.dirty.insert(i);
        self.unsaved.insert(i);
        self.pending.remove(&i);
    }

    pub fn begin_turn(&mut self, prompt: &str) {
        self.close_open();
        self.turn_start = self.entries.len();
        self.turn_active = true;
        self.push(Entry::User {
            text: prompt.to_string(),
        });
    }

    pub fn end_turn(&mut self, stop_reason: &str, duration_ms: f64) {
        self.close_open();
        self.turn_active = false;
        // A turn can't end with a question still open.
        for i in self.turn_start..self.entries.len() {
            if let Entry::Permission {
                resolution: r @ None,
                ..
            } = &mut self.entries[i]
            {
                *r = Some("cancelled".into());
                self.touch(i);
            }
        }
        // Tools the agent never finished (cancel, crash) shouldn't spin forever.
        // Only the normal completion signal proves a pending tool completed.
        // Cancellation, a disconnected agent, refusal, or any future terminal
        // reason leave the tool outcome unknown, which the UI represents as
        // failed instead of a misleading green check.
        let stop_status = if stop_reason == "end_turn" {
            "completed"
        } else {
            "failed"
        };
        for i in self.turn_start..self.entries.len() {
            if let Entry::Tool { status, .. } = &mut self.entries[i] {
                if status == "pending" || status == "in_progress" {
                    *status = stop_status.to_string();
                    self.touch(i);
                }
            }
        }
        self.push(Entry::TurnEnd {
            stop_reason: stop_reason.to_string(),
            duration_ms,
        });
    }

    fn close_open(&mut self) {
        if let Some(i) = self.open.take() {
            if let Entry::Agent { streaming, .. } | Entry::Thought { streaming, .. } =
                &mut self.entries[i]
            {
                *streaming = false;
            }
            self.touch(i);
        }
    }

    /// Apply the `update` object of a `session/update` notification.
    pub fn apply(&mut self, update: &Value) -> Effects {
        let mut fx = Effects::default();
        match update["sessionUpdate"].as_str().unwrap_or("") {
            "agent_message_chunk" => self.chunk(update, false),
            "agent_thought_chunk" => self.chunk(update, true),
            // Echoes of our own prompt (and replays on session/load): the
            // transcript already has it.
            "user_message_chunk" => {}
            "tool_call" => {
                self.close_open();
                let id = str_at(update, "toolCallId");
                let entry = Entry::Tool {
                    id: id.clone(),
                    title: str_or(update, "title", "tool"),
                    tool_kind: str_or(update, "kind", "other"),
                    status: str_or(update, "status", "pending"),
                    locations: locations(update),
                    content: content(update),
                    input: update.get("rawInput").and_then(summarize_input),
                    output: update.get("rawOutput").and_then(output_text),
                };
                match self.tools.get(&id).copied() {
                    Some(i) => {
                        self.entries[i] = entry;
                        self.touch(i);
                    }
                    None => {
                        let i = self.push(entry);
                        self.tools.insert(id, i);
                    }
                }
            }
            "tool_call_update" => {
                let id = str_at(update, "toolCallId");
                let Some(&i) = self.tools.get(&id) else {
                    // An update for a call we never saw: treat as a new call.
                    let mut as_call = update.clone();
                    as_call["sessionUpdate"] = "tool_call".into();
                    return self.apply(&as_call);
                };
                if let Entry::Tool {
                    title,
                    tool_kind,
                    status,
                    locations: locs,
                    content: cont,
                    input,
                    output,
                    ..
                } = &mut self.entries[i]
                {
                    if let Some(v) = update["title"].as_str() {
                        *title = v.to_string();
                    }
                    if let Some(v) = update["kind"].as_str() {
                        *tool_kind = v.to_string();
                    }
                    if let Some(v) = update["status"].as_str() {
                        if (v == "completed" || v == "failed") && status != v {
                            fx.workspace_dirty = true;
                        }
                        *status = v.to_string();
                    }
                    if update.get("locations").is_some_and(Value::is_array) {
                        *locs = locations(update);
                    }
                    if update.get("content").is_some_and(Value::is_array) {
                        let c = content(update);
                        if !c.is_empty() {
                            *cont = c;
                        }
                    }
                    if let Some(s) = update.get("rawInput").and_then(summarize_input) {
                        *input = Some(s);
                    }
                    if let Some(s) = update.get("rawOutput").and_then(output_text) {
                        *output = Some(s);
                    }
                }
                self.touch(i);
            }
            "plan" => {
                self.close_open();
                let items = update["entries"]
                    .as_array()
                    .into_iter()
                    .flatten()
                    .map(|e| PlanItem {
                        content: str_at(e, "content"),
                        priority: str_or(e, "priority", "medium"),
                        status: str_or(e, "status", "pending"),
                    })
                    .collect();
                let existing = (self.turn_start..self.entries.len())
                    .rev()
                    .find(|&i| matches!(self.entries[i], Entry::Plan { .. }));
                match existing {
                    Some(i) => {
                        self.entries[i] = Entry::Plan { items };
                        self.touch(i);
                    }
                    None => {
                        self.push(Entry::Plan { items });
                    }
                }
            }
            "available_commands_update" => {
                self.meta.commands = update["availableCommands"]
                    .as_array()
                    .into_iter()
                    .flatten()
                    .map(|c| SlashCommand {
                        name: str_at(c, "name"),
                        description: str_at(c, "description"),
                        hint: c["input"]["hint"].as_str().map(String::from),
                    })
                    .collect();
                fx.meta_changed = true;
            }
            "current_mode_update" => {
                if let Some(mode) = update["currentModeId"].as_str() {
                    for o in self
                        .meta
                        .options
                        .iter_mut()
                        .filter(|o| o.category == "mode")
                    {
                        o.current = mode.to_string();
                    }
                    fx.meta_changed = true;
                }
            }
            "config_option_update" => {
                if let Some(opts) = update.get("configOptions") {
                    self.meta.options = config_options(opts);
                    self.meta.legacy_modes = false;
                    fx.meta_changed = true;
                }
            }
            "usage_update" => {
                let prev = self.meta.usage.take().unwrap_or_default();
                let mut extra = usage_extra(&update["_meta"]);
                if extra.is_empty() {
                    extra = prev.extra;
                }
                self.meta.usage = Some(Usage {
                    used: update["used"].as_f64().unwrap_or(0.0),
                    size: update["size"].as_f64().unwrap_or(0.0),
                    cost_usd: update["cost"]["amount"].as_f64().or(prev.cost_usd),
                    extra,
                });
                fx.meta_changed = true;
            }
            "session_info_update" => {
                if let Some(value) = update.get("title") {
                    self.meta.title = value.as_str().map(String::from);
                }
                if let Some(value) = update.get("updatedAt") {
                    self.meta.source_updated_at = value.as_str().map(String::from);
                }
                if let Some(value) = update.get("_meta") {
                    self.meta.source_metadata_json = (!value.is_null()).then(|| value.to_string());
                }
                self.meta.info_revision = self.meta.info_revision.wrapping_add(1);
                fx.meta_changed = true;
            }
            _ => {
                self.close_open();
                self.push(Entry::Unknown {
                    json: update.to_string(),
                });
            }
        }
        fx
    }

    fn chunk(&mut self, update: &Value, thought: bool) {
        let block = &update["content"];
        let text = match block["type"].as_str() {
            Some("text") | None => str_at(block, "text"),
            Some(other) => format!("[{other}]"),
        };
        if text.is_empty() {
            return;
        }
        // Outside a turn (e.g. an MCP server failing at startup) this isn't a
        // reply: collect it as a notice, which never streams.
        if !self.turn_active {
            self.close_open();
            let last = self.entries.len().checked_sub(1);
            if let Some(i) = last.filter(|&i| matches!(self.entries[i], Entry::Notice { .. })) {
                if let Entry::Notice { text: t } = &mut self.entries[i] {
                    t.push_str(&text);
                }
                self.touch(i);
            } else {
                self.push(Entry::Notice { text });
            }
            return;
        }
        if let Some(i) = self.open {
            let same = matches!(
                (&self.entries[i], thought),
                (Entry::Agent { .. }, false) | (Entry::Thought { .. }, true)
            );
            if same {
                if let Entry::Agent { text: t, .. } | Entry::Thought { text: t, .. } =
                    &mut self.entries[i]
                {
                    t.push_str(&text);
                }
                self.unsaved.insert(i);
                if !self.dirty.contains(&i) {
                    self.pending.entry(i).or_default().push_str(&text);
                }
                return;
            }
            self.close_open();
        }
        let i = self.push(if thought {
            Entry::Thought {
                text,
                streaming: true,
            }
        } else {
            Entry::Agent {
                text,
                streaming: true,
            }
        });
        self.open = Some(i);
    }

    /// Record a permission request as an entry; returns its index.
    pub fn permission(&mut self, request_id: &str, params: &Value) -> usize {
        self.close_open();
        let tool = &params["toolCall"];
        let tool_id = tool["toolCallId"].as_str().map(String::from);
        let title = tool["title"]
            .as_str()
            .map(String::from)
            .or_else(|| tool_id.as_ref().and_then(|id| self.tool_title(id)))
            .unwrap_or_else(|| "Permission requested".into());
        let options = params["options"]
            .as_array()
            .into_iter()
            .flatten()
            .map(|o| PermissionChoice {
                id: str_at(o, "optionId"),
                name: str_at(o, "name"),
                kind: str_at(o, "kind"),
            })
            .collect();
        self.push(Entry::Permission {
            request_id: request_id.to_string(),
            title,
            tool_id,
            options,
            resolution: None,
        })
    }

    fn tool_title(&self, id: &str) -> Option<String> {
        let i = *self.tools.get(id)?;
        match &self.entries[i] {
            Entry::Tool { title, input, .. } => Some(match input {
                Some(inp) if !title.contains(inp.as_str()) => format!("{title}: {inp}"),
                _ => title.clone(),
            }),
            _ => None,
        }
    }

    pub fn resolve_permission(&mut self, request_id: &str, resolution: &str) {
        let found = self.entries.iter().rposition(
            |e| matches!(e, Entry::Permission { request_id: r, resolution: None, .. } if r == request_id),
        );
        if let Some(i) = found {
            if let Entry::Permission { resolution: r, .. } = &mut self.entries[i] {
                *r = Some(resolution.to_string());
            }
            self.touch(i);
        }
    }

    /// Changes since the last flush, in index order.
    pub fn flush(&mut self) -> Vec<Change> {
        let mut out = Vec::new();
        let mut indices: BTreeSet<usize> = self.dirty.iter().copied().collect();
        indices.extend(self.pending.keys().copied());
        for i in indices {
            self.versions[i] += 1;
            let version = self.versions[i];
            if self.dirty.contains(&i) {
                out.push(Change::Upsert {
                    index: i as u32,
                    version,
                    entry: self.entries[i].clone(),
                });
            } else if let Some(delta) = self.pending.get(&i) {
                out.push(Change::AppendText {
                    index: i as u32,
                    version,
                    delta: delta.clone(),
                });
            }
        }
        self.dirty.clear();
        self.pending.clear();
        out
    }

    /// Entries to write to the database: changed and settled, or all changed
    /// when `checkpoint` (so a crash mid-stream loses little).
    pub fn take_unsaved(&mut self, checkpoint: bool) -> Vec<(usize, Entry)> {
        let ready: Vec<usize> = self
            .unsaved
            .iter()
            .copied()
            .filter(|&i| checkpoint || !self.entries[i].is_live())
            .collect();
        ready
            .into_iter()
            .map(|i| {
                self.unsaved.remove(&i);
                (i, self.entries[i].clone())
            })
            .collect()
    }

    /// Adopt the options a `session/new` or `session/load` response advertised.
    pub fn set_session_state(&mut self, result: &Value) {
        let mut options = config_options(&result["configOptions"]);
        let mut legacy = false;
        // Legacy `modes` are only worth a picker when no option already covers
        // them (pi reports its thinking levels as both).
        let mode_ids: Vec<&str> = result["modes"]["availableModes"]
            .as_array()
            .into_iter()
            .flatten()
            .filter_map(|m| m["id"].as_str())
            .collect();
        let duplicated = options.iter().any(|o| {
            !mode_ids.is_empty()
                && mode_ids
                    .iter()
                    .all(|id| o.choices.iter().any(|c| c.value == *id))
        });
        if !duplicated && !options.iter().any(|o| o.category == "mode") {
            if let Some(modes) = result.get("modes").filter(|m| m.is_object()) {
                options.push(ConfigOption {
                    id: "mode".into(),
                    name: "Mode".into(),
                    category: "mode".into(),
                    current: str_at(modes, "currentModeId"),
                    choices: modes["availableModes"]
                        .as_array()
                        .into_iter()
                        .flatten()
                        .map(|m| Choice {
                            value: str_at(m, "id"),
                            name: str_at(m, "name"),
                            description: m["description"].as_str().map(String::from),
                        })
                        .collect(),
                });
                legacy = true;
            }
        }
        self.meta.options = options;
        self.meta.legacy_modes = legacy;
    }
}

/// Numeric `_meta` fields of a usage update, with readable labels:
/// `poolside/cachedReadTokens` → "Cached read tokens".
fn usage_extra(meta: &Value) -> Vec<UsageExtra> {
    let Some(obj) = meta.as_object() else {
        return Vec::new();
    };
    obj.iter()
        .filter_map(|(k, v)| {
            let value = v.as_f64()?;
            let key = k.rsplit('/').next().unwrap_or(k).trim_start_matches('_');
            let mut label = String::new();
            for (i, c) in key.chars().enumerate() {
                if c.is_uppercase() && i > 0 {
                    label.push(' ');
                    label.extend(c.to_lowercase());
                } else if c == '_' || c == '-' {
                    label.push(' ');
                } else if i == 0 {
                    label.extend(c.to_uppercase());
                } else {
                    label.push(c);
                }
            }
            Some(UsageExtra { label, value })
        })
        .collect()
}

fn config_options(v: &Value) -> Vec<ConfigOption> {
    let rank = |c: &str| match c {
        "model" => 0,
        "mode" => 1,
        "thought_level" => 2,
        _ => 3,
    };
    let mut out: Vec<ConfigOption> = v
        .as_array()
        .into_iter()
        .flatten()
        .filter(|o| o["type"].as_str().unwrap_or("select") == "select")
        .map(|o| ConfigOption {
            id: str_at(o, "id"),
            name: str_at(o, "name"),
            category: str_or(o, "category", "other"),
            current: o["currentValue"]
                .as_str()
                .map(String::from)
                .unwrap_or_else(|| o["currentValue"].to_string()),
            choices: flatten_choices(&o["options"]),
        })
        .collect();
    out.sort_by_key(|o| rank(&o.category));
    out
}

/// Select options may be flat or grouped (`[{group, options: [...]}]`).
fn flatten_choices(v: &Value) -> Vec<Choice> {
    let mut out = Vec::new();
    for c in v.as_array().into_iter().flatten() {
        if let Some(inner) = c.get("options").filter(|o| o.is_array()) {
            out.extend(flatten_choices(inner));
        } else {
            out.push(Choice {
                value: str_at(c, "value"),
                name: str_at(c, "name"),
                description: c["description"].as_str().map(String::from),
            });
        }
    }
    out
}

fn locations(v: &Value) -> Vec<Location> {
    v["locations"]
        .as_array()
        .into_iter()
        .flatten()
        .filter_map(|l| {
            Some(Location {
                path: l["path"].as_str()?.to_string(),
                line: l["line"].as_u64().map(|n| n as u32),
            })
        })
        .collect()
}

fn content(v: &Value) -> Vec<ToolContent> {
    v["content"]
        .as_array()
        .into_iter()
        .flatten()
        .filter_map(|c| match c["type"].as_str()? {
            "content" => {
                let block = &c["content"];
                let text = block["text"].as_str()?.to_string();
                Some(ToolContent::Text {
                    text: truncate(&text, MAX_OUTPUT),
                })
            }
            "diff" => Some(ToolContent::Diff {
                path: c["path"].as_str()?.to_string(),
                old: c["oldText"].as_str().map(String::from),
                new: str_at(c, "newText"),
            }),
            "terminal" => Some(ToolContent::Terminal {
                id: c["terminalId"].as_str()?.to_string(),
            }),
            _ => None,
        })
        .collect()
}

/// The one input field that says what a call is about.
fn summarize_input(v: &Value) -> Option<String> {
    let obj = v.as_object()?;
    if obj.is_empty() {
        return None;
    }
    for key in [
        "command",
        "cmd",
        "file_path",
        "path",
        "pattern",
        "url",
        "query",
        "description",
        "prompt",
    ] {
        let found = match obj.get(key) {
            Some(Value::String(s)) => Some(s.clone()),
            Some(Value::Array(parts)) => Some(
                parts
                    .iter()
                    .filter_map(Value::as_str)
                    .collect::<Vec<_>>()
                    .join(" "),
            ),
            _ => None,
        };
        if let Some(s) = found.filter(|s| !s.is_empty()) {
            return Some(truncate(s.lines().next().unwrap_or(""), MAX_INPUT));
        }
    }
    Some(truncate(&v.to_string(), MAX_INPUT))
}

fn output_text(v: &Value) -> Option<String> {
    let text = match v {
        Value::Null => return None,
        Value::String(s) => s.clone(),
        Value::Object(o) => ["formatted_output", "output", "stdout", "content", "text"]
            .iter()
            .find_map(|k| o.get(*k).and_then(Value::as_str).map(String::from))
            .unwrap_or_else(|| v.to_string()),
        other => other.to_string(),
    };
    (!text.is_empty()).then(|| truncate(&text, MAX_OUTPUT))
}

pub fn truncate(s: &str, max: usize) -> String {
    if s.len() <= max {
        return s.to_string();
    }
    let mut end = max;
    while !s.is_char_boundary(end) {
        end -= 1;
    }
    format!("{}\n… ({} more bytes)", &s[..end], s.len() - end)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn agent(text: &str) -> Entry {
        Entry::Agent {
            text: text.into(),
            streaming: true,
        }
    }

    fn upsert(index: u32, version: u32, entry: Entry) -> Change {
        Change::Upsert {
            index,
            version,
            entry,
        }
    }

    fn append(index: u32, version: u32, delta: &str) -> Change {
        Change::AppendText {
            index,
            version,
            delta: delta.into(),
        }
    }

    #[test]
    fn upserts_fill_holes_and_only_move_forward() {
        let mut m = TranscriptSnapshot::default();
        assert!(m.apply(&upsert(2, 1, agent("c"))));
        assert_eq!(m.versions, vec![0, 0, 1]);
        assert!(matches!(&m.entries[0], Entry::Divider { text } if text.is_empty()));
        assert!(m.apply(&upsert(2, 3, agent("new"))));
        // A stale snapshot is ignored, not a gap.
        assert!(m.apply(&upsert(2, 2, agent("old"))));
        assert_eq!((m.entries[2].clone(), m.versions[2]), (agent("new"), 3));
    }

    #[test]
    fn appends_need_exactly_the_next_version_of_a_text_entry() {
        let mut m =
            TranscriptSnapshot::from_history(vec![agent("a"), Entry::User { text: "u".into() }]);
        assert_eq!(m.versions, vec![1, 1]);
        assert!(m.apply(&append(0, 2, "b")));
        assert!(!m.apply(&append(0, 4, "skipped")), "a version was skipped");
        assert!(!m.apply(&append(0, 2, "again")), "already applied");
        assert!(!m.apply(&append(1, 2, "x")), "not a text entry");
        assert!(!m.apply(&append(9, 1, "x")), "no such entry");
        assert!(m.apply(&append(0, 3, "c")));
        assert_eq!(m.entries[0], agent("abc"));
        assert_eq!(m.versions, vec![3, 1]);
    }

    #[test]
    fn an_interrupted_turn_marks_unfinished_tools_as_failed() {
        let mut transcript = Transcript::new();
        transcript.begin_turn("check the app");
        transcript.apply(&serde_json::json!({
            "sessionUpdate": "tool_call",
            "toolCallId": "running-command",
            "status": "in_progress",
        }));

        transcript.end_turn("error", 42.0);

        assert!(matches!(
            &transcript.entries()[1],
            Entry::Tool { status, .. } if status == "failed"
        ));
    }

    #[test]
    fn restoring_an_interrupted_checkpoint_settles_live_entries() {
        let mut transcript = Transcript::restore(vec![
            Entry::Agent {
                text: "partial".into(),
                streaming: true,
            },
            Entry::Tool {
                id: "running-command".into(),
                title: "Run tests".into(),
                tool_kind: "execute".into(),
                status: "in_progress".into(),
                locations: vec![],
                content: vec![],
                input: None,
                output: None,
            },
            Entry::Permission {
                request_id: "permission-1".into(),
                title: "Allow command".into(),
                tool_id: None,
                options: vec![],
                resolution: None,
            },
        ]);

        assert!(matches!(
            &transcript.entries()[0],
            Entry::Agent {
                streaming: false,
                ..
            }
        ));
        assert!(matches!(
            &transcript.entries()[1],
            Entry::Tool { status, .. } if status == "failed"
        ));
        assert!(matches!(
            &transcript.entries()[2],
            Entry::Permission { resolution: Some(resolution), .. } if resolution == "cancelled"
        ));
        assert_eq!(transcript.take_unsaved(false).len(), 3);
    }
}

/// History replay has its own message boundaries. Live prompt echoes must still
/// be ignored by `Transcript::apply`, but historical user messages must survive.
#[derive(Default)]
pub struct Replay {
    transcript: Transcript,
    last_message: Option<(String, Option<String>)>,
}

impl Replay {
    pub fn apply(&mut self, update: &Value) {
        let kind = str_at(update, "sessionUpdate");
        if matches!(
            kind.as_str(),
            "user_message_chunk" | "agent_message_chunk" | "agent_thought_chunk"
        ) {
            let id = update["messageId"].as_str().map(String::from);
            let same = self
                .last_message
                .as_ref()
                .is_some_and(|(k, i)| k == &kind && i == &id);
            if !same {
                self.transcript.close_open();
            }
            self.last_message = Some((kind.clone(), id));
            self.transcript.turn_active = true;
            if kind == "user_message_chunk" {
                let text = match update["content"]["type"].as_str() {
                    Some("text") | None => str_at(&update["content"], "text"),
                    Some(kind) => format!("[{kind}]"),
                };
                if same {
                    if let Some(Entry::User { text: previous }) = self.transcript.entries.last_mut()
                    {
                        previous.push_str(&text);
                        return;
                    }
                }
                self.transcript.begin_turn(&text);
                return;
            }
        } else if matches!(kind.as_str(), "tool_call" | "tool_call_update" | "plan") {
            self.last_message = None;
        }
        self.transcript.apply(update);
    }

    pub fn finish(mut self) -> Vec<Entry> {
        self.transcript.close_open();
        // A historical tool cannot remain a live spinner in a read-only preview.
        for entry in &mut self.transcript.entries {
            if let Entry::Tool { status, .. } = entry {
                if status == "pending" || status == "in_progress" {
                    *status = "failed".into();
                }
            }
        }
        self.transcript.entries
    }
}
