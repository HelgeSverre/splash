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
    /// Extra environment for the ACP server process.
    pub env: &'static [(&'static str, &'static str)],
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
        env: &[],
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
        env: &[],
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
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::Command(&["glue", "doctor"]),
    },
    AgentSpec {
        id: "amp",
        name: "Amp",
        cli: "amp",
        program: "npx",
        args: &["-y", "amp-acp@0.9.0"],
        env: &[],
        transport: Transport::Adapter,
        experimental: false,
        // `amp account list` exits 0 with no accounts, and `AMP_API_KEY`
        // logins have none; the probe tells.
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "autohand",
        name: "Autohand",
        cli: "autohand",
        program: "npx",
        args: &["-y", "@autohandai/autohand-acp@0.2.1"],
        env: &[],
        transport: Transport::Adapter,
        experimental: false,
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "copilot",
        name: "Copilot",
        cli: "copilot",
        program: "copilot",
        args: &["--acp"],
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "devin",
        name: "Devin",
        cli: "devin",
        program: "devin",
        args: &["acp"],
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "dirac",
        name: "Dirac",
        cli: "dirac",
        program: "dirac",
        args: &["--acp"],
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "droid",
        name: "Droid",
        cli: "droid",
        program: "droid",
        args: &["exec", "--output-format", "acp-daemon"],
        // Don't self-update mid-session (the ACP registry sets these too).
        env: &[
            ("DROID_DISABLE_AUTO_UPDATE", "true"),
            ("FACTORY_DROID_AUTO_UPDATE_ENABLED", "false"),
        ],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "gemini",
        name: "Gemini",
        cli: "gemini",
        program: "gemini",
        args: &["--acp"],
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "goose",
        name: "Goose",
        cli: "goose",
        program: "goose",
        args: &["acp"],
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "hermes",
        name: "Hermes",
        cli: "hermes",
        program: "hermes",
        args: &["acp"],
        env: &[],
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
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "kimi",
        name: "Kimi",
        cli: "kimi",
        program: "kimi",
        args: &["acp"],
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "letta",
        name: "Letta",
        cli: "letta",
        program: "npx",
        args: &["-y", "@letta-ai/letta-acp@0.1.11"],
        // The adapter pulls in sharp, whose install tries (and fails) to build
        // from source when Homebrew's libvips is present. Use its prebuilt.
        env: &[("SHARP_IGNORE_GLOBAL_LIBVIPS", "1")],
        transport: Transport::Adapter,
        experimental: false,
        // Logins live in the OS keychain; the probe tells.
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "opencode",
        name: "OpenCode",
        cli: "opencode",
        program: "opencode",
        args: &["acp"],
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    },
    AgentSpec {
        id: "openhands",
        name: "OpenHands",
        cli: "openhands",
        program: "openhands",
        args: &["acp"],
        env: &[],
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
        env: &[],
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
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::File(".config/poolside/credentials.json"),
    },
    AgentSpec {
        id: "vibe",
        name: "Vibe",
        cli: "vibe",
        program: "vibe-acp",
        args: &[],
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    },
];

pub fn find(id: &str) -> Option<&'static AgentSpec> {
    AGENTS.iter().find(|a| a.id == id)
}
