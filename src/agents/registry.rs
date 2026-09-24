//! The agents Splash knows how to drive. All of them speak ACP over stdio —
//! natively, or through a pinned npm adapter that wraps the vendor's CLI.

use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize, specta::Type)]
#[serde(rename_all = "snake_case")]
pub enum Transport {
    /// The CLI itself serves ACP (`glue acp`, `pool acp`).
    Native,
    /// An npm package bridges ACP to the vendor CLI.
    Adapter,
}

/// How to check whether the user is logged in, without starting a session.
#[derive(Clone, Copy, Debug)]
pub enum AuthCheck {
    /// Run the command; exit status 0 means authenticated.
    Command(&'static [&'static str]),
    /// A credentials file (relative to `$HOME`) exists.
    File(&'static str),
    /// No cheap check exists; the probe tells.
    None,
}

#[derive(Clone, Copy, Debug)]
pub struct AgentSpec {
    pub id: &'static str,
    pub name: &'static str,
    /// The vendor CLI that must be installed (what `--version` runs against).
    pub cli: &'static str,
    /// The ACP server process: program + args.
    pub program: &'static str,
    pub args: &'static [&'static str],
    pub transport: Transport,
    pub experimental: bool,
    pub auth: AuthCheck,
}

pub const AGENTS: &[AgentSpec] = &[
    AgentSpec {
        id: "claude",
        name: "Claude Code",
        cli: "claude",
        program: "npx",
        args: &["-y", "@agentclientprotocol/claude-agent-acp@0.81.1"],
        transport: Transport::Adapter,
        experimental: false,
        auth: AuthCheck::Command(&["claude", "auth", "status"]),
    },
    AgentSpec {
        id: "codex",
        name: "Codex",
        cli: "codex",
        program: "npx",
        args: &["-y", "@agentclientprotocol/codex-acp@1.13.1"],
        transport: Transport::Adapter,
        experimental: false,
        auth: AuthCheck::Command(&["codex", "login", "status"]),
    },
    AgentSpec {
        id: "glue",
        name: "Glue",
        cli: "glue",
        program: "glue",
        args: &["acp"],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::Command(&["glue", "doctor"]),
    },
    AgentSpec {
        id: "copilot",
        name: "Copilot",
        cli: "copilot",
        program: "copilot",
        args: &["--acp"],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "junie",
        name: "Junie",
        cli: "junie",
        program: "junie",
        args: &["--acp=true"],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "opencode",
        name: "OpenCode",
        cli: "opencode",
        program: "opencode",
        args: &["acp"],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "pi",
        name: "Pi",
        cli: "pi",
        program: "npx",
        args: &["-y", "pi-acp@0.0.33"],
        transport: Transport::Adapter,
        experimental: false,
        // `pi auth check` needs a provider or model; the probe covers it.
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "pool",
        name: "Pool",
        cli: "pool",
        program: "pool",
        args: &["acp"],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::File(".config/poolside/credentials.json"),
    },
];

pub fn find(id: &str) -> Option<&'static AgentSpec> {
    AGENTS.iter().find(|a| a.id == id)
}
