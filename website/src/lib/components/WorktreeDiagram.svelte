<script lang="ts">
	// One repository, one checkout per session: the demo world's sessions as
	// branches off main, with the app's agent icons and status dots.
	import AgentIcon from '$splash/components/AgentIcon.svelte';
	import { sessions, AGENT_ROWS } from '../demo/world';

	const name = (id: string) => AGENT_ROWS.find(([a]) => a === id)?.[1] ?? id;
	const rows = sessions().filter((s) => !s.archived);
	const label: Record<string, string> = { idle: 'ready to review', awaiting_permission: 'waiting for you', error: 'needs recovery', exited: 'saved', running: 'working' };
</script>

<div class="tree" role="img" aria-label="The atlas repository with one checkout per session: four worktrees on splash branches and one session in place on main.">
	<div class="root">
		<span class="repo">~/code/atlas</span>
		<span class="branch">main</span>
	</div>
	<ul>
		{#each rows as s, i (s.id)}
			<li style:--i={i}>
				<span class="elbow" aria-hidden="true"></span>
				<span class="card" class:inplace={s.isolation === 'in_place'}>
					<span class="icon splash-ui"><AgentIcon id={s.agent_id} size={16} /></span>
					<span class="text">
						<span class="title">{s.title}</span>
						<span class="meta">{name(s.agent_id)} · {s.isolation === 'worktree' ? s.branch : 'in place on main'}</span>
					</span>
					<span class="state"><span class="splash-ui dot {i === 0 ? 'running' : s.status}"></span>{i === 0 ? 'working' : label[s.status]}</span>
				</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.tree {
		padding: 28px;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--surface);
		box-shadow: var(--site-card-shadow);
	}
	.root {
		display: flex;
		align-items: center;
		gap: 10px;
		font: 13px var(--font-mono);
	}
	.repo {
		color: var(--text);
	}
	.branch {
		padding: 2px 8px;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-pill);
		color: var(--text-2);
	}
	ul {
		position: relative;
		margin: 10px 0 0 14px;
		padding: 0 0 0 0;
		list-style: none;
	}
	li {
		position: relative;
		display: flex;
		align-items: center;
		padding: 8px 0 8px 28px;
		animation: grow 0.5s calc(var(--i) * 90ms) both var(--site-ease, ease-out);
	}
	/* The trunk: full height through each row, half height into the last. */
	li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		border-left: 1px solid var(--border-strong);
	}
	li:last-child::before {
		bottom: 50%;
	}
	.elbow {
		position: absolute;
		left: 0;
		top: 0;
		width: 22px;
		height: 50%;
		border-left: 1px solid var(--border-strong);
		border-bottom: 1px solid var(--border-strong);
		border-bottom-left-radius: 8px;
	}
	.card {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
		padding: 10px 12px;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		background: var(--bg);
	}
	.card.inplace {
		border-style: dashed;
	}
	.icon {
		display: inline-flex;
		flex: none;
	}
	.text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}
	.title {
		color: var(--text);
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.meta {
		color: var(--muted);
		font: 12px var(--font-mono);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.state {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		flex: none;
		color: var(--text-2);
		font-size: 12.5px;
	}
	@keyframes grow {
		from {
			opacity: 0;
			transform: translateX(-6px);
		}
	}
	@media (max-width: 560px) {
		.state {
			display: none;
		}
		.tree {
			padding: 18px;
		}
	}
</style>
