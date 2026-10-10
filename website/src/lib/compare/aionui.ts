// Splash vs AionUi. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const AIONUI: Comparison = {
	slug: 'aionui',
	name: 'AionUi',
	description: 'How Splash and AionUi compare on agents, licensing, accounts, workspaces, review and remote use, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and AionUi are open-source desktop apps that run agents such as Claude Code and Codex. AionUi is a general-purpose agent workspace with office assistants, team mode and schedules; it uses the Agent Client Protocol for most agents and connects to Claude Code and Codex through their own CLI interfaces. Splash drives every coding session over ACP, optionally in a git worktree.',
	other: {
		name: 'AionUi',
		url: 'https://www.aionui.com',
		maker: 'AionUi',
		summary: 'An Electron desktop app where a built-in agent and 20+ CLI agents work in a local project folder, with office-document assistants, team mode, scheduled tasks, a browser WebUI and chat-app control.',
		cite: ['aionui-readme', 'aionui-wiki-faq', 'aionui-wiki-getting-started']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Electron desktop app for coding and office work, with a WebUI mode; a standalone web server builds from the repo', cite: ['aionui-wiki-faq', 'aionui-home', 'aionui-webui-doc', 'aionui-wiki-webui', 'aionui-dockerfile'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v2.2.2 (9 September 2026), not labelled beta; since August 2026 installers come from aionui.com rather than GitHub Releases', cite: ['aionui-update-manifest', 'aionui-download', 'aionui-release-2-1-47', 'aionui-release-2-2-2'] } },
				{ label: 'License', splash: S.license, other: { text: 'Apache-2.0 on GitHub and in the site footer; the aionui.com app’s terms grant a revocable license and say certain components may be open source', cite: ['aionui-license', 'aionui-core-license', 'aionui-download', 'aionui-terms'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Free; you pay your model provider for API use. The terms also describe a prepaid balance mode, with no published prices', cite: ['aionui-home', 'aionui-readme', 'aionui-terms'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 12+ (Apple silicon and Intel), Windows 10+ x64 and arm64, Ubuntu 20.04+ and Debian 11+ x64 and arm64 (.deb)', cite: ['aionui-download'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron and TypeScript, plus a Rust backend (aioncore, on Axum, Tokio and SQLite) that the app starts', cite: ['aionui-wiki-faq', 'aionui-readme', 'aionui-dev-doc', 'aionui-core-architecture'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'A built-in agent plus 20+ detected CLIs, including Claude Code, Codex, Gemini CLI and Goose; you can add other ACP CLIs', cite: ['aionui-readme', 'aionui-wiki-acp'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'ACP for most CLIs; Claude Code, Codex and Antigravity driven directly through their own CLI modes, not ACP; an embedded engine for the built-in agent', cite: ['aionui-wiki-acp', 'aionui-core-factory', 'aionui-core-claude', 'aionui-core-codex'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Each CLI uses its own login; the built-in agent uses API keys you enter. AionUi charges no model fee in BYOK mode', cite: ['aionui-wiki-acp', 'aionui-wiki-faq', 'aionui-readme', 'aionui-terms'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'None in the GitHub code, which skips sign-in locally; release notes say the aionui.com build (AionUi Pro) requires sign-in (Google for now)', cite: ['aionui-readme', 'aionui-core-cli', 'aionui-backend-launcher', 'aionui-release-2-1-47', 'aionui-migration-dialog', 'aionui-authorize'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Approval prompts, one-time or persistent; Team Mode gives each agent its own dialog. Unattended modes depend on the agent', mark: 'yes', cite: ['aionui-wiki-acp', 'aionui-readme'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Servers added once in settings (stdio, SSE, HTTP), then synced or injected into each agent as its support allows', mark: 'yes', cite: ['aionui-wiki-mcp', 'aionui-readme', 'aionui-home'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'One project folder per conversation, which agents read and write directly and Team Mode agents share; existing git worktrees show up in the Changes tab, but creating them is not documented', mark: 'no', cite: ['aionui-wiki-getting-started', 'aionui-readme', 'aionui-conversation-strings', 'aionui-release-2-2-1', 'aionui-release-2-2-2', 'aionui-core-changelog'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'Commands ACP agents run through the app show as live output cards with a Stop button; folders open in an external terminal. No terminal panel is documented', mark: 'partial', cite: ['aionui-terminal-card', 'aionui-workspace-open'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Since v2.2.1, a sidebar icon marks ACP, Codex and Aion CLI conversations waiting on a permission or a question, with a desktop notification when unfocused', mark: 'yes', cite: ['aionui-release-2-2-1'] } },
				{ label: 'Agents handing off work', hint: 'One agent launching or messaging another', splash: S.handoff, other: { text: 'Team Mode: a Leader agent splits a task and hands parts to Teammate agents that run in parallel, coordinated over MCP', mark: 'yes', cite: ['aionui-readme'] } },
				{ label: 'Scheduled tasks', hint: 'Agents that start without a prompt from you', splash: S.scheduler, other: { text: 'Cron with time zone, fixed interval or one-time triggers; agents can schedule tasks themselves, and each task can set its own model and folder', mark: 'yes', cite: ['aionui-readme'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'A browser tab in the preview panel that the agent drives through a bundled MCP server, aionui-browser, since v2.1.47', mark: 'yes', cite: ['aionui-release-2-1-47'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Lists changed files and opens each as a diff; Add to chat puts selected diff text in the message box', mark: 'yes', cite: ['aionui-scm-view', 'aionui-conversation-strings', 'aionui-scm-panel', 'aionui-diff-viewer', 'aionui-selection-toolbar'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A project folder tree; stage, unstage or discard changes; preview tabs open 10+ formats and edit code, Markdown and HTML in place', mark: 'yes', cite: ['aionui-wiki-getting-started', 'aionui-scm-view', 'aionui-conversation-strings', 'aionui-readme'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'No pull requests, CI checks or issues. Git actions are stage, unstage and discard; no commit or push', mark: 'no', cite: ['aionui-core-scm', 'aionui-scm-model'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'WebUI in any browser over LAN, Tailscale or a server, for one admin; chat bots for Telegram, Slack, Discord and more', mark: 'yes', cite: ['aionui-readme', 'aionui-wiki-remote', 'aionui-core-channels', 'aionui-wiki-slack'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'The app updates from a feed on AionUi’s servers; since August 2026 GitHub releases hold notes, not installers', mark: 'yes', cite: ['aionui-update-manifest', 'aionui-release-2-1-47', 'aionui-release-2-2-2'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; conversations live in AionUi’s own local SQLite database', mark: 'unknown', cite: ['aionui-readme'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Keyword search across past messages that loads more as you scroll and jumps to the matching message', mark: 'yes', cite: ['aionui-conversation-strings'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Fork from a message: Codex at any turn, Claude Code and ACP agents at the latest message', mark: 'yes', cite: ['aionui-release-2-1-47'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'AionUi connects most CLIs over the Agent Client Protocol, but its backend (AionCore v0.2.2) runs Claude Code as a headless <code>claude --print</code> process with stream-json, drives Codex through <code>codex app-server</code>, and gives its built-in agent an embedded engine. Splash connects to every agent over ACP, natively or through a pinned adapter for the vendor’s CLI.',
			cite: ['aionui-wiki-acp', 'aionui-core-factory', 'aionui-core-claude', 'aionui-core-codex', 'splash-registry', 'acp']
		},
		{
			title: 'Folders and worktrees',
			text: 'AionUi ties each conversation to a project folder that agents edit directly, and Team Mode agents share that folder; existing git worktrees show up in its Changes tab, and creating them is not documented. Splash runs a session in the project folder or in a new git worktree on its own branch.',
			cite: ['aionui-wiki-getting-started', 'aionui-readme', 'aionui-conversation-strings', 'aionui-release-2-2-1', 'aionui-release-2-2-2', 'aionui-core-changelog', 'splash-features', 'splash-worktree']
		},
		{
			title: 'License, price and accounts',
			text: 'AionUi’s repositories are Apache-2.0, and the code there runs without an account. Since August 2026 installers come from aionui.com. Release notes call that build a “commercial counterpart” and say it requires sign-in (Google for now); its terms grant a revocable license and describe a prepaid balance mode. Splash is free, MIT-licensed and has no accounts.',
			cite: ['aionui-license', 'aionui-core-license', 'aionui-core-cli', 'aionui-release-2-1-47', 'aionui-release-2-2-2', 'aionui-terms', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Scope of work',
			text: 'AionUi reaches beyond code: 21 built-in assistants for slides, spreadsheets, documents and more, a Team Mode where a leader agent delegates, scheduled tasks, an agent-driven browser, and control from chat apps. Splash centers on coding sessions: a Needs attention queue, a review screen, transcript search, importing agent history and a GitHub view across repositories.',
			cite: ['aionui-readme', 'aionui-home', 'aionui-release-2-1-47', 'splash-features', 'splash-history', 'splash-github']
		},
		{
			title: 'Platforms and remote use',
			text: 'AionUi ships for macOS, Windows and Linux (.deb), on x64 and arm64; its WebUI serves the app to phones and other computers for one admin, and a standalone web server builds from the repo. Splash builds for macOS 14+, Windows 11 x64 and Ubuntu 24.04 x64, plus <code>splash-server</code>, used in a browser over an SSH tunnel.',
			cite: ['aionui-download', 'aionui-readme', 'aionui-wiki-remote', 'aionui-wiki-webui', 'aionui-dockerfile', 'splash-install', 'splash-server']
		}
	],
	fit: {
		splash: [
			'You want every agent, Claude Code and Codex included, driven over the Agent Client Protocol.',
			'You want each session in its own git worktree on its own branch.',
			'You want to import conversations agents started outside the app and search them with the rest.',
			'You want a GitHub view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want built-in assistants for slides, spreadsheets and documents alongside coding agents.',
			'You want a leader agent to split work across teammate agents, and tasks that start on a schedule.',
			'You want to reach your agents from a phone browser or from chat apps such as Telegram, Slack or Discord.',
			'You want an in-app browser the agent can drive, and a preview panel that edits code, Markdown and HTML.'
		]
	},
	sources: [
		{ id: 'aionui-home', title: 'AionUi home page', url: 'https://www.aionui.com/en/', publisher: 'AionUi', checked: '2026-10-10' },
		{ id: 'aionui-download', title: 'Download', url: 'https://www.aionui.com/en/download', publisher: 'AionUi', checked: '2026-10-10' },
		{ id: 'aionui-terms', title: 'Terms of Service', url: 'https://www.aionui.com/en/terms', publisher: 'AionUi', checked: '2026-10-10' },
		{ id: 'aionui-authorize', title: 'Sign in to AionUi', url: 'https://www.aionui.com/en/authorize', publisher: 'AionUi', checked: '2026-10-10' },
		{ id: 'aionui-update-manifest', title: 'latest-mac.yml (update manifest)', url: 'https://static.aionui.com/releases/latest-mac.yml', publisher: 'AionUi', checked: '2026-10-10' },
		{ id: 'aionui-readme', title: 'README', url: 'https://github.com/iOfficeAI/AionUi', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-license', title: 'LICENSE', url: 'https://github.com/iOfficeAI/AionUi/blob/main/LICENSE', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-release-2-1-47', title: 'Release v2.1.47-final', url: 'https://github.com/iOfficeAI/AionUi/releases/tag/v2.1.47-final', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-release-2-2-1', title: 'Release v2.2.1', url: 'https://github.com/iOfficeAI/AionUi/releases/tag/v2.2.1', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-release-2-2-2', title: 'Release v2.2.2', url: 'https://github.com/iOfficeAI/AionUi/releases/tag/v2.2.2', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-wiki-faq', title: 'FAQ (wiki)', url: 'https://github.com/iOfficeAI/AionUi/wiki/FAQ', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-wiki-getting-started', title: 'Quick Start Guide (wiki)', url: 'https://github.com/iOfficeAI/AionUi/wiki/Getting-Started', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-wiki-acp', title: 'ACP Setup (wiki)', url: 'https://github.com/iOfficeAI/AionUi/wiki/ACP-Setup', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-wiki-mcp', title: 'MCP Configuration Guide (wiki)', url: 'https://github.com/iOfficeAI/AionUi/wiki/MCP-Configuration-Guide', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-wiki-webui', title: 'WebUI Configuration Guide (wiki)', url: 'https://github.com/iOfficeAI/AionUi/wiki/WebUI-Configuration-Guide', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-wiki-remote', title: 'Remote Internet Access Guide (wiki)', url: 'https://github.com/iOfficeAI/AionUi/wiki/Remote-Internet-Access-Guide', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-wiki-slack', title: 'Slack Bot Setup Guide (wiki)', url: 'https://github.com/iOfficeAI/AionUi/wiki/Slack-Bot-Setup-Guide', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-webui-doc', title: 'docs/guides/webui.md', url: 'https://github.com/iOfficeAI/AionUi/blob/main/docs/guides/webui.md', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-dev-doc', title: 'docs/contributing/development.md', url: 'https://github.com/iOfficeAI/AionUi/blob/main/docs/contributing/development.md', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-dockerfile', title: 'Dockerfile', url: 'https://github.com/iOfficeAI/AionUi/blob/main/Dockerfile', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-backend-launcher', title: 'packages/web-host/src/backend-launcher.ts', url: 'https://github.com/iOfficeAI/AionUi/blob/main/packages/web-host/src/backend-launcher.ts', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-migration-dialog', title: 'UpdateMigrationDialog.tsx', url: 'https://github.com/iOfficeAI/AionUi/blob/main/packages/desktop/src/renderer/components/settings/UpdateMigrationDialog.tsx', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-terminal-card', title: 'MessageAcpTerminalOutput.tsx', url: 'https://github.com/iOfficeAI/AionUi/blob/main/packages/desktop/src/renderer/pages/conversation/Messages/acp/MessageAcpTerminalOutput.tsx', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-workspace-open', title: 'WorkspaceOpenButton.tsx', url: 'https://github.com/iOfficeAI/AionUi/blob/main/packages/desktop/src/renderer/pages/conversation/components/ChatLayout/WorkspaceOpenButton.tsx', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-scm-view', title: 'ScmChangesView.tsx', url: 'https://github.com/iOfficeAI/AionUi/blob/main/packages/desktop/src/renderer/pages/conversation/SourceControl/ScmChangesView.tsx', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-scm-panel', title: 'ScmPanel.tsx', url: 'https://github.com/iOfficeAI/AionUi/blob/main/packages/desktop/src/renderer/pages/conversation/SourceControl/ScmPanel.tsx', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-scm-model', title: 'scmModel.ts', url: 'https://github.com/iOfficeAI/AionUi/blob/main/packages/desktop/src/renderer/pages/conversation/SourceControl/scmModel.ts', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-diff-viewer', title: 'DiffViewer.tsx', url: 'https://github.com/iOfficeAI/AionUi/blob/main/packages/desktop/src/renderer/pages/conversation/Preview/components/viewers/DiffViewer.tsx', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-selection-toolbar', title: 'SelectionToolbar.tsx', url: 'https://github.com/iOfficeAI/AionUi/blob/main/packages/desktop/src/renderer/pages/conversation/Preview/components/renderers/SelectionToolbar.tsx', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-conversation-strings', title: 'en-US/conversation.json (UI strings)', url: 'https://github.com/iOfficeAI/AionUi/blob/main/packages/desktop/src/renderer/services/i18n/locales/en-US/conversation.json', publisher: 'iOfficeAI/AionUi on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-core-license', title: 'LICENSE (AionCore)', url: 'https://github.com/iOfficeAI/AionCore/blob/main/LICENSE', publisher: 'iOfficeAI/AionCore on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-core-architecture', title: 'ARCHITECTURE.md', url: 'https://github.com/iOfficeAI/AionCore/blob/main/ARCHITECTURE.md', publisher: 'iOfficeAI/AionCore on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-core-changelog', title: 'CHANGELOG.md', url: 'https://github.com/iOfficeAI/AionCore/blob/main/CHANGELOG.md', publisher: 'iOfficeAI/AionCore on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-core-cli', title: 'crates/aionui-app/src/cli.rs', url: 'https://github.com/iOfficeAI/AionCore/blob/main/crates/aionui-app/src/cli.rs', publisher: 'iOfficeAI/AionCore on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-core-scm', title: 'crates/aionui-project/src/scm/types.rs', url: 'https://github.com/iOfficeAI/AionCore/blob/main/crates/aionui-project/src/scm/types.rs', publisher: 'iOfficeAI/AionCore on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-core-factory', title: 'crates/aionui-ai-agent/src/factory/acp.rs (v0.2.2)', url: 'https://github.com/iOfficeAI/AionCore/blob/v0.2.2/crates/aionui-ai-agent/src/factory/acp.rs', publisher: 'iOfficeAI/AionCore on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-core-claude', title: 'crates/aionui-session/src/adapter/claude.rs (v0.2.2)', url: 'https://github.com/iOfficeAI/AionCore/blob/v0.2.2/crates/aionui-session/src/adapter/claude.rs', publisher: 'iOfficeAI/AionCore on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-core-codex', title: 'crates/aionui-session/src/backend/codex_conn.rs (v0.2.2)', url: 'https://github.com/iOfficeAI/AionCore/blob/v0.2.2/crates/aionui-session/src/backend/codex_conn.rs', publisher: 'iOfficeAI/AionCore on GitHub', checked: '2026-10-10' },
		{ id: 'aionui-core-channels', title: 'crates/aionui-app/Cargo.toml (v0.2.2)', url: 'https://github.com/iOfficeAI/AionCore/blob/v0.2.2/crates/aionui-app/Cargo.toml', publisher: 'iOfficeAI/AionCore on GitHub', checked: '2026-10-10' }
	]
};
