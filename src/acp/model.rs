//! What the UI sees: a transcript of entries plus session metadata. Built from
//! raw ACP JSON by [`super::map`]; wire-safe (no i64, ids are strings).

use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum Entry {
    User {
        text: String,
    },
    Agent {
        text: String,
        streaming: bool,
    },
    Thought {
        text: String,
        streaming: bool,
    },
    Tool {
        id: String,
        title: String,
        /// ACP tool kind: read, edit, delete, move, search, execute, think, fetch, other.
        tool_kind: String,
        /// pending, in_progress, completed, failed.
        status: String,
        locations: Vec<Location>,
        content: Vec<ToolContent>,
        /// A one-line summary of the raw input (command, path, query…).
        input: Option<String>,
        /// Raw output as text, truncated.
        output: Option<String>,
    },
    Plan {
        items: Vec<PlanItem>,
    },
    Permission {
        request_id: String,
        title: String,
        tool_id: Option<String>,
        options: Vec<PermissionChoice>,
        /// The chosen option id, `"cancelled"`, or `None` while waiting.
        resolution: Option<String>,
    },
    Divider {
        text: String,
    },
    Error {
        text: String,
    },
    /// Agent output outside any turn (startup warnings, MCP failures…).
    Notice {
        text: String,
    },
    /// A `session/update` we don't understand, kept verbatim.
    Unknown {
        json: String,
    },
    TurnEnd {
        stop_reason: String,
        duration_ms: f64,
    },
}

impl Entry {
    pub fn kind(&self) -> &'static str {
        match self {
            Entry::User { .. } => "user",
            Entry::Agent { .. } => "agent",
            Entry::Thought { .. } => "thought",
            Entry::Tool { .. } => "tool",
            Entry::Plan { .. } => "plan",
            Entry::Permission { .. } => "permission",
            Entry::Divider { .. } => "divider",
            Entry::Error { .. } => "error",
            Entry::Notice { .. } => "notice",
            Entry::Unknown { .. } => "unknown",
            Entry::TurnEnd { .. } => "turn_end",
        }
    }

    /// Still changing — not worth persisting on every chunk.
    pub fn is_live(&self) -> bool {
        match self {
            Entry::Agent { streaming, .. } | Entry::Thought { streaming, .. } => *streaming,
            Entry::Tool { status, .. } => status == "pending" || status == "in_progress",
            Entry::Permission { resolution, .. } => resolution.is_none(),
            _ => false,
        }
    }
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct Location {
    pub path: String,
    pub line: Option<u32>,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum ToolContent {
    Text {
        text: String,
    },
    Diff {
        path: String,
        old: Option<String>,
        new: String,
    },
    Terminal {
        id: String,
    },
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct PlanItem {
    pub content: String,
    pub priority: String,
    pub status: String,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct PermissionChoice {
    pub id: String,
    pub name: String,
    /// allow_once, allow_always, reject_once, reject_always.
    pub kind: String,
}

/// A select-type session config option (model, mode, effort…).
#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct ConfigOption {
    pub id: String,
    pub name: String,
    pub category: String,
    pub current: String,
    pub choices: Vec<Choice>,
}

#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct Choice {
    pub value: String,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct SlashCommand {
    pub name: String,
    pub description: String,
    pub hint: Option<String>,
}

#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct Usage {
    pub used: f64,
    pub size: f64,
    pub cost_usd: Option<f64>,
    /// Numbers the agent adds in `_meta` (input/output/cached tokens…).
    pub extra: Vec<UsageExtra>,
}

#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct UsageExtra {
    pub label: String,
    pub value: f64,
}

/// Everything about a live session that isn't transcript.
#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct SessionMeta {
    /// Config options, falling back to legacy `modes` as a synthetic "mode" option.
    pub options: Vec<ConfigOption>,
    /// True when `options` holds legacy modes (changed via `session/set_mode`).
    pub legacy_modes: bool,
    pub commands: Vec<SlashCommand>,
    pub usage: Option<Usage>,
    pub title: Option<String>,
}
