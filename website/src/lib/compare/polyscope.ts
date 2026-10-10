// Splash vs Polyscope. Facts checked 2026-10-10 against the sources listed at the bottom.
import { S } from './splash.ts';
import type { Comparison } from './types.ts';

export const POLYSCOPE: Comparison = {
	slug: 'polyscope',
	name: 'Polyscope',
	description: 'How Splash and Polyscope compare on agents, platforms, pricing, workspaces, review and remote access, with a source for every fact.',
	checked: '2026-10-10',
	intro: 'Splash and Polyscope both run several coding agents at once and can give each its own branch. Polyscope, a macOS and Windows app, launches the installed Claude Code, Codex or Cursor CLI in cloned workspaces, and paid plans add remote access. Splash, a free, open-source app for macOS, Windows and Ubuntu, drives agents over the Agent Client Protocol.',
	other: {
		name: 'Polyscope',
		url: 'https://getpolyscope.com',
		maker: 'Beyond Code',
		summary: 'A macOS and Windows app, pitched at Laravel developers, that runs Claude Code, Codex and Cursor CLI in parallel workspaces, each a repo clone. Pro adds browser and phone access and a headless Linux server.',
		cite: ['polyscope-home', 'polyscope-docs', 'polyscope-workspaces', 'polyscope-standalone']
	},
	groups: [
		{
			title: 'The basics',
			rows: [
				{ label: 'What it is', splash: S.formFactor, other: { text: 'macOS and Windows desktop app, headless Linux server, browser and phone access on Pro, and a REST API with SDKs', cite: ['polyscope-docs', 'polyscope-standalone', 'polyscope-remote', 'polyscope-api'] } },
				{ label: 'Release status', splash: S.maturity, other: { text: 'v0.29.0 of 7 October 2026; the changelog lists 27 releases, the first 0.5.1 in March. FFF file search is experimental, as was workspace archiving when added in 0.16.0', cite: ['polyscope-changelog', 'polyscope-fff'] } },
				{ label: 'License', splash: S.license, other: { text: 'Proprietary under an EULA barring modification or reverse engineering; its JS and Laravel SDKs and Chrome extension are MIT', cite: ['polyscope-eula', 'polyscope-js-repo', 'polyscope-laravel-repo', 'polyscope-chrome-repo'] } },
				{ label: 'Price', splash: S.price, other: { text: 'Personal free; Pro $99 a year adds phone and browser access and a headless server on your own Linux machine; Team $299 a year for 10 seats; tax extra', cite: ['polyscope-home'] } },
				{ label: 'Platforms', splash: S.platforms, other: { text: 'macOS 13.3+ and Windows desktop apps, with no CPU types listed beyond a mention of Apple silicon; Linux x86_64 or aarch64 for the headless server', cite: ['polyscope-docs', 'polyscope-voice', 'polyscope-standalone'] } },
				{ label: 'Built with', splash: S.tech, other: { text: 'Electron since 0.17.0 (April 2026), replacing Tauri; the app bundles a local server and stores its data in SQLite', cite: ['polyscope-changelog', 'polyscope-data-paths'] } }
			]
		},
		{
			title: 'Agents',
			rows: [
				{ label: 'Agents', splash: S.agents, other: { text: 'Claude Code, OpenAI Codex and Cursor CLI; Kimi 2.5 is announced as coming soon. Adding other agents isn’t documented', cite: ['polyscope-home', 'polyscope-api-models'] } },
				{ label: 'How it runs agents', splash: S.protocol, other: { text: 'Runs the installed claude, codex or cursor CLI; Claude chat uses the Claude Code SDK, Terminal Mode its TUI', cite: ['polyscope-outdated-agent', 'polyscope-standalone', 'polyscope-agent-permissions', 'polyscope-terminal-mode'] } },
				{ label: 'Agent sign-in', hint: 'Who pays for the model', splash: S.signIn, other: { text: 'Uses the subscription or API key already set up in each CLI; providers bill AI usage, outside the Polyscope license', cite: ['polyscope-home'] } },
				{ label: 'Account required', splash: S.account, other: { text: 'Install ends with a GitHub login, and the license is checked online; remote and standalone-server access need Pro', cite: ['polyscope-docs', 'polyscope-home', 'polyscope-remote', 'polyscope-standalone'] } },
				{ label: 'Permission requests', hint: 'When an agent asks before it acts', splash: S.permissions, other: { text: 'Chat mode auto-approves tools, confines file-writing tools to the workspace and linked ones, and offers plan approval; Terminal Mode keeps Claude Code’s prompts', mark: 'partial', cite: ['polyscope-agent-permissions', 'polyscope-terminal-mode'] } }
			]
		},
		{
			title: 'Working in parallel',
			rows: [
				{ label: 'Isolation per session', splash: S.isolation, other: { text: 'A repo clone on a fresh branch per workspace, copy-on-write on macOS APFS; or one workspace on the repo itself', mark: 'yes', cite: ['polyscope-workspaces', 'polyscope-workflows'] } },
				{ label: 'Setup scripts and dev servers', splash: S.setupScripts, other: { text: 'polyscope.json setup, archive and run scripts with autostart, and a preview URL per workspace; no port allocation is documented', mark: 'yes', cite: ['polyscope-json', 'polyscope-run-scripts'] } },
				{ label: 'Built-in browser', splash: S.browser, other: { text: 'Embedded browser with a console for the preview URL; the Visual Editor sends a picked element to the agent', mark: 'yes', cite: ['polyscope-visual-editor'] } },
				{ label: 'What needs you', splash: S.attention, other: { text: 'Sidebar spinner while an agent runs and badge when it awaits plan approval or an answer; optional Needs you / Active / Inactive grouping; stale-agent warnings', mark: 'yes', cite: ['polyscope-workspaces', 'polyscope-changelog'] } },
				{ label: 'Agents handing off work', hint: 'One session passing work or context to another', splash: S.handoff, other: { text: 'Autopilot runs a goal as stories in fresh sessions; Opinions results and linked workspaces hand context to an agent', mark: 'yes', cite: ['polyscope-autopilot', 'polyscope-opinions', 'polyscope-linking', 'polyscope-changelog'] } }
			]
		},
		{
			title: 'Review and shipping',
			rows: [
				{ label: 'Review changes', splash: S.review, other: { text: 'Split or unified diffs with inline comments the agent addresses, and a Review mode that runs a separate review agent', mark: 'yes', cite: ['polyscope-home', 'polyscope-quickstart', 'polyscope-review'] } },
				{ label: 'Files and diffs', splash: S.files, other: { text: 'A diff panel with find in diff and multi-file discard, plus a Monaco-based editor for files', mark: 'yes', cite: ['polyscope-quickstart', 'polyscope-changelog'] } },
				{ label: 'Create pull requests', splash: S.prs, other: { text: 'Agent-run commit, push and PR or draft PR through gh, from editable prompts; direct merge and push to an open PR', mark: 'yes', cite: ['polyscope-github'] } },
				{ label: 'GitHub', splash: S.github, other: { text: 'Via gh: workspaces from issues or PRs, Actions check status in the feed, and it can prompt the agent to fix failing CI', mark: 'yes', cite: ['polyscope-github'] } },
				{ label: 'Issue trackers', splash: S.issueTrackers, other: { text: 'Start workspaces from GitHub issues, Linear issues, Sentry errors or Laravel Nightwatch issues; GitLab and Jira aren’t documented', mark: 'yes', cite: ['polyscope-github', 'polyscope-linear', 'polyscope-sentry', 'polyscope-nightwatch'] } }
			]
		},
		{
			title: 'Where it runs',
			rows: [
				{ label: 'Remote access', splash: S.remote, other: { text: 'Pro: phone, tablet or browser access to your own desktop or Linux server through an end-to-end encrypted relay', mark: 'yes', cite: ['polyscope-remote', 'polyscope-standalone'] } },
				{ label: 'Mobile app', splash: S.mobile, other: { text: 'A mobile interface in the phone’s browser via the relay, on Pro; no App Store or Play Store app is documented', mark: 'partial', cite: ['polyscope-remote'] } },
				{ label: 'Auto-update', splash: S.updates, other: { text: 'Checks for new versions automatically and offers to install them; Check for Updates runs it by hand', mark: 'yes', cite: ['polyscope-updates'] } }
			]
		},
		{
			title: 'History and search',
			rows: [
				{ label: 'Existing agent history', hint: 'Conversations started outside the app', splash: S.history, other: { text: 'Not documented; Polyscope stores its own conversations in a local SQLite database, with per-turn checkpoints you can revert', mark: 'unknown', cite: ['polyscope-data-paths', 'polyscope-changelog'] } },
				{ label: 'Search transcripts', splash: S.search, other: { text: 'Not documented; the command palette searches command, workspace and branch names, and the sidebar searches workspaces', mark: 'unknown', cite: ['polyscope-command-palette', 'polyscope-changelog'] } }
			]
		}
	],
	differences: [
		{
			title: 'How agents connect',
			text: 'Polyscope launches the <code>claude</code>, <code>codex</code> or <code>cursor</code> CLI installed on the machine. Claude’s chat view goes through the Claude Code SDK, and Terminal Mode runs Claude Code’s own interface instead; the docs don’t say how Codex and Cursor are driven or mention ACP. Splash connects to every agent over the <strong>Agent Client Protocol</strong>, natively or through an adapter.',
			cite: ['polyscope-outdated-agent', 'polyscope-standalone', 'polyscope-agent-permissions', 'polyscope-terminal-mode', 'polyscope-changelog', 'splash-registry', 'acp']
		},
		{
			title: 'Permissions and safeguards',
			text: 'In chat mode Polyscope runs Claude Code with <code>--dangerously-skip-permissions</code> and its own check that keeps file-writing tools inside the workspace and any linked workspaces; shell commands, git and network access are not restricted. Plan mode adds a plan approval step, and Terminal Mode keeps Claude Code’s own prompts unless you turn them off. Splash shows the permission requests an agent sends in the transcript and holds pending ones in <strong>Needs attention</strong>.',
			cite: ['polyscope-agent-permissions', 'polyscope-terminal-mode', 'splash-features']
		},
		{
			title: 'Where agents run',
			text: 'Polyscope runs agents on the computer with the desktop app or on a Linux machine running <code>polyscope-server</code>. On Pro you reach either from a browser or phone through Polyscope’s relay, with end-to-end encryption. The API docs add that every Polyscope server keeps a connection to the Polyscope cloud, which the REST API goes through. Splash runs agents on your computer, or under <code>splash-server</code> on another machine, which you open in a browser through an SSH tunnel.',
			cite: ['polyscope-standalone', 'polyscope-remote', 'polyscope-api-servers', 'splash-readme', 'splash-server']
		},
		{
			title: 'Price, accounts and license',
			text: 'Polyscope is proprietary. Personal is free; Pro ($99 a year) and Team ($299 a year, 10 seats) are subscriptions billed through Paddle, and the EULA lets Beyond Code change or end the free plan. Setup includes a GitHub login, and the license is checked online. Splash is free, MIT-licensed and has no accounts.',
			cite: ['polyscope-eula', 'polyscope-home', 'polyscope-docs', 'splash-license', 'splash-download', 'splash-build']
		},
		{
			title: 'Workflow focus',
			text: 'Polyscope targets Laravel developers: it detects Laravel Herd and suggests a <code>.test</code> URL per workspace, offers a Laravel new-project wizard and starts workspaces from Nightwatch issues; its docs also show Node.js setups. Autopilot, Opinions and voice dictation are built in. Splash’s additions are a Needs attention queue, transcript search, imported agent history and a GitHub triage view.',
			cite: ['polyscope-home', 'polyscope-herd', 'polyscope-changelog', 'polyscope-nightwatch', 'polyscope-json', 'polyscope-workflows', 'polyscope-autopilot', 'polyscope-opinions', 'polyscope-voice', 'splash-features', 'splash-history', 'splash-github']
		}
	],
	fit: {
		splash: [
			'You want a free, MIT-licensed app that needs no account.',
			'You want the desktop app on Ubuntu as well as macOS and Windows.',
			'You want Gemini, Copilot, Goose and other agents next to Claude Code and Codex, all over the Agent Client Protocol.',
			'You want to import conversations agents started outside the app and search their text with the rest.'
		],
		other: [
			'You build Laravel apps and want Herd .test URLs, Nightwatch and Sentry issues, and setup and run scripts per workspace.',
			'You want a file editor, inline diff comments and a separate review agent before the agent commits and opens a PR.',
			'You want Autopilot to work through a goal story by story, or Opinions to compare several models’ answers.',
			'You want to check on agents from a phone or browser, or run them on your own Linux server, with a Pro plan.'
		]
	},
	sources: [
		{ id: 'polyscope-home', title: 'Polyscope', url: 'https://getpolyscope.com/', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-docs', title: 'Documentation: Installation', url: 'https://getpolyscope.com/docs', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-quickstart', title: 'Quickstart', url: 'https://getpolyscope.com/docs/getting-started/quickstart', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-standalone', title: 'Standalone Server', url: 'https://getpolyscope.com/docs/getting-started/standalone-server', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-updates', title: 'Updates', url: 'https://getpolyscope.com/docs/getting-started/updates', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-workspaces', title: 'Workspaces', url: 'https://getpolyscope.com/docs/core-concepts/workspaces', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-workflows', title: 'Workflow', url: 'https://getpolyscope.com/docs/core-concepts/workflows', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-json', title: 'polyscope.json', url: 'https://getpolyscope.com/docs/core-concepts/polyscope-json', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-run-scripts', title: 'Run Scripts', url: 'https://getpolyscope.com/docs/digging-deeper/run-scripts', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-terminal-mode', title: 'Terminal Mode', url: 'https://getpolyscope.com/docs/digging-deeper/terminal-mode', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-remote', title: 'Remote Access', url: 'https://getpolyscope.com/docs/digging-deeper/remote', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-review', title: 'Review', url: 'https://getpolyscope.com/docs/digging-deeper/review', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-autopilot', title: 'Autopilot', url: 'https://getpolyscope.com/docs/digging-deeper/autopilot', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-opinions', title: 'Opinions', url: 'https://getpolyscope.com/docs/digging-deeper/opinions', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-linking', title: 'Linking Workspaces', url: 'https://getpolyscope.com/docs/digging-deeper/linking-workspaces', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-visual-editor', title: 'Visual Editor', url: 'https://getpolyscope.com/docs/digging-deeper/visual-editor', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-voice', title: 'Voice Interaction', url: 'https://getpolyscope.com/docs/digging-deeper/voice-interaction', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-fff', title: 'FFF (Fast File Finder)', url: 'https://getpolyscope.com/docs/digging-deeper/fff', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-command-palette', title: 'Command Palette', url: 'https://getpolyscope.com/docs/digging-deeper/command-palette', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-agent-permissions', title: 'Agent Permissions', url: 'https://getpolyscope.com/docs/advanced/agent-permissions', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-github', title: 'GitHub', url: 'https://getpolyscope.com/docs/integrations/github', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-linear', title: 'Linear', url: 'https://getpolyscope.com/docs/integrations/linear', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-sentry', title: 'Sentry', url: 'https://getpolyscope.com/docs/integrations/sentry', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-nightwatch', title: 'Nightwatch', url: 'https://getpolyscope.com/docs/integrations/nightwatch', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-herd', title: 'Laravel Herd', url: 'https://getpolyscope.com/docs/integrations/laravel-herd', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-outdated-agent', title: 'Outdated Claude or Codex Version', url: 'https://getpolyscope.com/docs/troubleshooting/outdated-agent-version', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-data-paths', title: 'Directories and Files', url: 'https://getpolyscope.com/docs/troubleshooting/data-paths', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-api', title: 'API Reference: Overview', url: 'https://getpolyscope.com/docs/api/api', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-api-models', title: 'API Reference: Models', url: 'https://getpolyscope.com/docs/api/models', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-api-servers', title: 'API Reference: Servers', url: 'https://getpolyscope.com/docs/api/servers', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-changelog', title: 'Changelog', url: 'https://getpolyscope.com/docs/changelog/changelog', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-eula', title: 'End-User License Agreement', url: 'https://getpolyscope.com/eula', publisher: 'Beyond Code', checked: '2026-10-10' },
		{ id: 'polyscope-js-repo', title: 'beyondcode/polyscope-js', url: 'https://github.com/beyondcode/polyscope-js', publisher: 'beyondcode/polyscope-js on GitHub', checked: '2026-10-10' },
		{ id: 'polyscope-laravel-repo', title: 'beyondcode/polyscope-laravel', url: 'https://github.com/beyondcode/polyscope-laravel', publisher: 'beyondcode/polyscope-laravel on GitHub', checked: '2026-10-10' },
		{ id: 'polyscope-chrome-repo', title: 'beyondcode/polyscope-chrome', url: 'https://github.com/beyondcode/polyscope-chrome', publisher: 'beyondcode/polyscope-chrome on GitHub', checked: '2026-10-10' }
	]
};
