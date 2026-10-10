// Splash vs ccgui. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const CCGUI: Comparison = {
	slug: 'ccgui',
	name: 'ccgui',
	description: 'How Splash and ccgui (CC GUI) compare on agents, platforms, licensing, worktrees, review and remote access, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and ccgui, also called CC GUI, are open-source desktop apps for working with several AI coding agents. ccgui, a Tauri app, connects each of its built-in engines, among them Claude Code, Codex, Kimi, Grok and OpenCode, through an adapter written for that engine. Splash drives every agent over the Agent Client Protocol.',
	other: {
		name: 'ccgui',
		url: 'https://docs.mossx.ai/en/desktop/index',
		maker: 'MossX',
		summary: 'An open-source Tauri desktop app that runs Claude Code, Codex, Kimi, Grok, OpenCode and other AI coding CLIs in one window. A VS Code extension and a JetBrains plugin share the CC GUI name.',
		cite: ['ccgui-readme', 'ccgui-docs-en-intro']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'Desktop app that runs several AI coding CLIs in one window and can serve its UI to browsers on other devices', cite: ['ccgui-readme', 'ccgui-docs-intro'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v1.1.2 (8 October 2026), the latest of 122 releases since February 2026, none of them marked as a prerelease', cite: ['ccgui-releases'] } },
				{ label: 'License', splash: S.license, other: { text: 'The README and docs say MIT, but the repository has no LICENSE file and GitHub detects no license', cite: ['ccgui-readme', 'ccgui-docs-contribute', 'ccgui-repo-api'] } },
				{ label: 'Price', splash: S.price, other: { text: 'No price or paid plan is listed, and the download site says its open-source projects stay free; providers bill model usage', cite: ['ccgui-download', 'ccgui-docs-claude'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS (Apple silicon and Intel), Windows 10 or later x64 with WebView2, and Linux x64 as AppImage or .rpm', cite: ['ccgui-docs-install', 'ccgui-release-1-1-2', 'ccgui-readme'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Tauri 2, with a Rust backend and a React 18 and TypeScript frontend', cite: ['ccgui-readme', 'ccgui-docs-intro'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'README lists 11 built-in engines, among them Claude Code, Codex, Kimi, Grok and OpenCode; docs cover seven. Users can’t add more', cite: ['ccgui-readme', 'ccgui-docs-intro', 'ccgui-plugin-guide'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'An adapter per CLI: stream-json for Claude Code, codex app-server, ACP for Kimi, Grok, Qoder and MiniMax, HTTP for OpenCode', cite: ['ccgui-readme', 'ccgui-claude-rs', 'ccgui-codex-app-rs', 'ccgui-grok-acp-rs', 'ccgui-qoder-rs', 'ccgui-opencode-rs'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Reuses each CLI’s own login, or stores provider API keys with a base URL and model mapping; the provider bills usage', cite: ['ccgui-docs-claude', 'ccgui-docs-setup'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'No ccgui account is described; it needs at least one working AI runtime and a project folder', cite: ['ccgui-docs-setup', 'ccgui-mossx-home'] } },
				{ label: 'Model and mode pickers', splash: S.models, other: { text: 'Engine per session, model and thinking level per tab, and auto, manual, plan or bypass modes where the engine supports them', mark: 'yes', cite: ['ccgui-readme', 'ccgui-docs-modes'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Prompts offer allow, always allow or deny, and agent questions open as cards. Grok and Qoder have one mode, bypass; Pi and DeepSeek Harness have auto', mark: 'yes', cite: ['ccgui-docs-modes', 'ccgui-readme'] } },
				{ label: 'MCP servers', splash: S.mcp, other: { text: 'Lists configured MCP servers for Claude Code and Codex and turns them on or off; new servers are added in each runtime’s own config', mark: 'partial', cite: ['ccgui-docs-extensions'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'Sessions belong to a workspace; worktree sub-workspaces, from a new or existing branch or a GitHub PR, get their own sessions', mark: 'yes', cite: ['ccgui-docs-workspace', 'ccgui-git-worktree-rs', 'ccgui-worktree-dialog', 'ccgui-release-1-0-9', 'ccgui-changelog-ts'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'Startup scripts saved per workspace run on demand in a terminal tab; no setup hook for new worktrees and no dev-server handling are documented', mark: 'partial', cite: ['ccgui-changelog-ts', 'ccgui-launch-script-run', 'ccgui-worktree-design'] } },
				{ label: 'Terminal', splash: S.terminal, other: { text: 'A PTY-backed terminal dock (xterm with WebGL) inside the app, one shell per tab', mark: 'yes', cite: ['ccgui-readme', 'ccgui-docs-workspace'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Browser tabs show web pages in native webviews inside the app; the entry is a beta feature, off by default', mark: 'partial', cite: ['ccgui-changelog-ts', 'ccgui-beta-features'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Permission prompts and question cards appear in each session, with optional system notifications; no queue across sessions is documented', mark: 'partial', cite: ['ccgui-docs-modes', 'ccgui-docs-settings', 'ccgui-docs-sessions'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Git panel and tool-call diffs, and plans that wait for approval; line comments back to the agent aren’t documented', mark: 'yes', cite: ['ccgui-docs-git', 'ccgui-readme', 'ccgui-docs-modes', 'ccgui-diffview'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A file tree with Git status colors and a CodeMirror editor with Markdown preview; the Git panel shows diffs', mark: 'yes', cite: ['ccgui-readme', 'ccgui-docs-workspace'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'The Git panel stages and commits, with AI-written commit messages; creating pull requests isn’t among its documented features', mark: 'no', cite: ['ccgui-docs-workspace', 'ccgui-docs-git'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Starts a worktree from a PR number or URL; PR, issue and CI views aren’t documented', mark: 'partial', cite: ['ccgui-git-worktree-rs', 'ccgui-pr-input', 'ccgui-docs-workspace'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Browser access over the LAN with a token, QR code and per-device approval, or beyond it through your own Cloudflare Worker', mark: 'yes', cite: ['ccgui-readme', 'ccgui-web-rs', 'ccgui-relay-rs', 'ccgui-release-1-0-0'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'None published; the mobile client’s docs are still in preparation. Phones can open the desktop UI in a browser', mark: 'no', cite: ['ccgui-docs-mobile', 'ccgui-web-rs'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'A built-in updater gets new versions from GitHub Releases', mark: 'yes', cite: ['ccgui-docs-setup', 'ccgui-tauri-conf'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; the README says it reads each CLI’s own session files, and the docs separate history by runtime', mark: 'unknown', cite: ['ccgui-readme', 'ccgui-docs-providers'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'One search box covers files, sessions, past messages, skills and commands', mark: 'yes', cite: ['ccgui-docs-workspace'] } },
				{ label: 'Fork a conversation', splash: S.fork, other: { text: 'Claude Code and Codex fork and roll back where supported; DeepSeek Harness can fork; other engines don’t list it', mark: 'partial', cite: ['ccgui-docs-sessions'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'ccgui wires each built-in engine through its own adapter: stream-json for Claude Code and Antigravity, <code>codex app-server</code> for Codex, ACP for Kimi, Grok, Qoder and MiniMax Code, RPC for Pi and OMP, and local HTTP servers for OpenCode and DeepSeek Harness. Adding an engine takes a new build. Splash speaks the <strong>Agent Client Protocol</strong> with every agent, natively or through an adapter.',
			cite: ['ccgui-readme', 'ccgui-claude-rs', 'ccgui-agy-rs', 'ccgui-codex-app-rs', 'ccgui-grok-acp-rs', 'ccgui-qoder-rs', 'ccgui-pi-family-rs', 'ccgui-opencode-rs', 'ccgui-dsh-rs', 'ccgui-plugin-guide', 'splash-registry', 'acp']
		},
		{
			title: 'Where it runs and how you reach it',
			text: 'Both run agents as local processes. ccgui serves its UI to browsers on your network with a token and per-device approval on the desktop, and since v1.0.0 can relay it through a Cloudflare Worker in your own account. Splash can instead run as <code>splash-server</code> on the machine with your code, reached in a browser over an SSH tunnel.',
			cite: ['ccgui-docs-intro', 'ccgui-readme', 'ccgui-web-rs', 'ccgui-relay-rs', 'ccgui-release-1-0-0', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, license and analytics',
			text: 'ccgui lists no price, and you pay whichever model provider you configure. Its README and docs call it MIT-licensed, but the repository has no LICENSE file, and production builds load Baidu Tongji (百度统计) analytics a few seconds after launch, which the README and user docs don’t mention. Splash is free, MIT-licensed and has no accounts.',
			cite: ['ccgui-download', 'ccgui-docs-claude', 'ccgui-readme', 'ccgui-docs-contribute', 'ccgui-repo-api', 'ccgui-analytics', 'ccgui-bootstrap', 'splash-download', 'splash-license', 'splash-build']
		},
		{
			title: 'Around the session',
			text: 'ccgui has a Git panel that stages and commits with AI-written messages, a file editor, startup scripts per workspace, split views, bundled skills, a plugin SDK with a marketplace and, as a beta, browser tabs. Splash has a Needs attention queue across sessions, review with a feedback box, importing agent history over ACP, and a GitHub view of issues, PRs and Actions runs.',
			cite: ['ccgui-docs-git', 'ccgui-readme', 'ccgui-changelog-ts', 'ccgui-launch-script-run', 'ccgui-docs-extensions', 'ccgui-release-1-0-0', 'ccgui-beta-features', 'splash-features', 'splash-history', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want every agent driven over the Agent Client Protocol, including Gemini, Copilot and Goose next to Claude Code and Codex.',
			'You want one Needs attention queue for permission requests and finished turns across all sessions.',
			'You want to import conversations agents started elsewhere and search their saved text with the rest.',
			'You want a GitHub view of issues, pull requests and Actions runs across repositories.'
		],
		other: [
			'You want Grok, Qoder or MiniMax Code in the same window as Claude Code and Codex.',
			'You want to open the desktop app’s UI from a phone browser on your network or, through your own relay, from elsewhere.',
			'You want to stage and commit from a Git panel, with commit messages written by AI.',
			'You want an app that updates itself, with a file editor, split views and a plugin SDK.'
		]
	},
	sources: [
		{ id: 'ccgui-docs-en-intro', title: 'CC GUI desktop overview', url: 'https://docs.mossx.ai/en/desktop/index', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-docs-intro', title: 'CC GUI 客户端简介', url: 'https://docs.mossx.ai/desktop/index', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-docs-install', title: '下载安装', url: 'https://docs.mossx.ai/desktop/start/install', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-docs-setup', title: '准备环境', url: 'https://docs.mossx.ai/desktop/start/setup', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-docs-claude', title: 'Claude Code', url: 'https://docs.mossx.ai/desktop/providers/claude', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-docs-providers', title: '多供应商总览', url: 'https://docs.mossx.ai/desktop/providers/overview', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-docs-modes', title: '运行模式与权限', url: 'https://docs.mossx.ai/desktop/chat/modes', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-docs-sessions', title: '会话与历史', url: 'https://docs.mossx.ai/desktop/chat/sessions', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-docs-workspace', title: '工作区与面板', url: 'https://docs.mossx.ai/desktop/workspace/overview', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-docs-git', title: 'Git 与 Commit', url: 'https://docs.mossx.ai/desktop/workspace/git', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-docs-settings', title: '设置总览', url: 'https://docs.mossx.ai/desktop/settings/overview', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-docs-extensions', title: '拓展', url: 'https://docs.mossx.ai/desktop/extensions', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-docs-mobile', title: 'CC GUI 手机端简介', url: 'https://docs.mossx.ai/mobile/index', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-docs-contribute', title: '交流与贡献', url: 'https://docs.mossx.ai/desktop/community/contribute', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-mossx-home', title: 'MossX - Next-Gen VibeCoding Portal', url: 'https://www.mossx.ai/en', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-download', title: 'MossX Client', url: 'https://www.mossx.ai/en/download', publisher: 'MossX', checked: '2026-10-10' },
		{ id: 'ccgui-readme', title: 'desktop-cc-gui README', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-repo-api', title: 'Repository metadata (GitHub API)', url: 'https://api.github.com/repos/zhukunpenglinyutong/desktop-cc-gui', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-releases', title: 'Releases (GitHub API)', url: 'https://api.github.com/repos/zhukunpenglinyutong/desktop-cc-gui/releases', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-release-1-1-2', title: 'Release v1.1.2', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/releases/tag/v1.1.2', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-release-1-0-9', title: 'Release v1.0.9', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/releases/tag/v1.0.9', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-release-1-0-0', title: 'Release v1.0.0', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/releases/tag/v1.0.0', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-beta-features', title: 'src/features/settings/beta-features.ts', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src/features/settings/beta-features.ts', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-plugin-guide', title: 'docs/plugin-development-guide.zh-CN.md', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/docs/plugin-development-guide.zh-CN.md', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-agy-rs', title: 'src-tauri/src/engine/agy.rs', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src-tauri/src/engine/agy.rs', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-claude-rs', title: 'src-tauri/src/engine/claude.rs', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src-tauri/src/engine/claude.rs', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-codex-app-rs', title: 'src-tauri/src/engine/codex_app.rs', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src-tauri/src/engine/codex_app.rs', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-grok-acp-rs', title: 'src-tauri/src/engine/grok_acp.rs', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src-tauri/src/engine/grok_acp.rs', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-qoder-rs', title: 'src-tauri/src/engine/qoder_session.rs', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src-tauri/src/engine/qoder_session.rs', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-pi-family-rs', title: 'src-tauri/src/engine/pi_family.rs', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src-tauri/src/engine/pi_family.rs', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-opencode-rs', title: 'src-tauri/src/engine/opencode_server.rs', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src-tauri/src/engine/opencode_server.rs', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-dsh-rs', title: 'src-tauri/src/engine/dsh.rs', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src-tauri/src/engine/dsh.rs', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-git-worktree-rs', title: 'src-tauri/src/git_worktree.rs', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src-tauri/src/git_worktree.rs', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-worktree-dialog', title: 'src/features/worktree/WorktreeCreateDialog.tsx', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src/features/worktree/WorktreeCreateDialog.tsx', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-pr-input', title: 'src/features/worktree/pr-input.ts', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src/features/worktree/pr-input.ts', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-launch-script-run', title: 'src/features/launch-script/run.ts', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src/features/launch-script/run.ts', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-worktree-design', title: 'docs/design/worktree-implementation.zh-CN.md', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/docs/design/worktree-implementation.zh-CN.md', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-changelog-ts', title: 'src/version/changelog.ts (in-app release notes)', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src/version/changelog.ts', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-diffview', title: 'src/features/git/DiffView.tsx', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src/features/git/DiffView.tsx', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-web-rs', title: 'src-tauri/src/web.rs', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src-tauri/src/web.rs', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-relay-rs', title: 'src-tauri/src/relay.rs', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src-tauri/src/relay.rs', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-tauri-conf', title: 'src-tauri/tauri.conf.json', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src-tauri/tauri.conf.json', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-analytics', title: 'src/lib/analytics.ts', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src/lib/analytics.ts', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' },
		{ id: 'ccgui-bootstrap', title: 'src/bootstrap.tsx', url: 'https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/main/src/bootstrap.tsx', publisher: 'zhukunpenglinyutong/desktop-cc-gui on GitHub', checked: '2026-10-10' }
	]
};
