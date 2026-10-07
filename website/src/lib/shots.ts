// Real captures from the repository's screenshots/ folder (documentation
// assets; the site references them, nothing is copied). Each has the README's
// alt text.
import githubTriage from '$repo/screenshots/github-triage.png';
import actionsDetail from '$repo/screenshots/actions-detail.png';
import actionsOverview from '$repo/screenshots/actions-overview.png';
import issueEditor from '$repo/screenshots/issue-editor.png';
import sessionLibrary from '$repo/screenshots/session-library.jpg';
import sessionSearch from '$repo/screenshots/session-search.jpg';
import agentSessionBrowser from '$repo/screenshots/agent-session-browser.jpg';
import agentSessionPreview from '$repo/screenshots/agent-session-preview.jpg';
import sessionFork from '$repo/screenshots/session-fork.jpg';
import serverLibrary from '$repo/screenshots/server-library.jpg';
import serverLogin from '$repo/screenshots/server-login.jpg';
import serverOffline from '$repo/screenshots/server-offline.jpg';
import serverFolders from '$repo/screenshots/server-folders.jpg';
import newSessionFolders from '$repo/screenshots/new-session-folders.jpg';
import terminal from '$repo/screenshots/terminal.png';
import settingsAgents from '$repo/screenshots/settings-agents.png';
import settingsAgent from '$repo/screenshots/platform-agent-check.jpg';
import linuxArtifact from '$repo/screenshots/linux-ci-artifact.png';
import windowsArtifact from '$repo/screenshots/windows-ci-artifact.png';

export type Shot = { src: string; alt: string; caption: string };

export const SHOTS = {
	githubTriage: { src: githubTriage, alt: 'GitHub triage across repositories with an issue open in the detail pane', caption: 'GitHub triage' },
	actionsOverview: { src: actionsOverview, alt: 'Workflow runs combined across repositories, newest first', caption: 'Actions run overview' },
	actionsDetail: { src: actionsDetail, alt: 'A failed run with job steps and a searchable log preview', caption: 'Failed jobs and searchable logs' },
	issueEditor: { src: issueEditor, alt: 'New issue composer with a Markdown editor', caption: 'Issue editor' },
	sessionLibrary: { src: sessionLibrary, alt: 'Saved conversations across agents, with project, agent and status filters', caption: 'Session library' },
	sessionSearch: { src: sessionSearch, alt: 'Transcript search results with excerpts from active and archived conversations', caption: 'Search saved and archived transcripts' },
	agentSessionBrowser: { src: agentSessionBrowser, alt: 'Unified agent history with independent pagination, search, activity filters and sorting', caption: 'Browse history across agents and folders' },
	agentSessionPreview: { src: agentSessionPreview, alt: 'ACP session discovery and conversation preview before adding it to Splash', caption: 'Preview existing agent sessions' },
	sessionFork: { src: sessionFork, alt: 'Conversation fork choices showing the workspace folders shared with the original session', caption: 'Fork a conversation' },
	serverLibrary: { src: serverLibrary, alt: 'Connected server status and saved conversations in the browser', caption: 'Server session library' },
	serverLogin: { src: serverLogin, alt: 'Token login for the authenticated Splash server', caption: 'Sign in to a Splash server' },
	serverOffline: { src: serverOffline, alt: 'Offline banner with a saved conversation and an unsent draft preserved', caption: 'Drafts survive a disconnect' },
	serverFolders: { src: serverFolders, alt: 'Browser folder picker showing projects on the server filesystem', caption: 'Choose a folder on the server' },
	newSessionFolders: { src: newSessionFolders, alt: 'New session setup with additional workspace folders, mode, model and permission choices', caption: 'New session' },
	terminal: { src: terminal, alt: 'Integrated terminal in the session folder', caption: 'Terminal' },
	settingsAgents: { src: settingsAgents, alt: 'Agent settings listing installed agents with status and versions', caption: 'Agents' },
	settingsAgent: { src: settingsAgent, alt: 'Agent settings showing a successful ACP handshake on the host', caption: 'Verify ACP compatibility' },
	linuxArtifact: { src: linuxArtifact, alt: 'Splash installed from the .deb, running on Ubuntu 24.04', caption: 'Splash on Ubuntu 24.04' },
	windowsArtifact: { src: windowsArtifact, alt: 'Splash installed for a standard user, running on Windows Server 2025', caption: 'Splash on Windows Server 2025' }
} satisfies Record<string, Shot>;
