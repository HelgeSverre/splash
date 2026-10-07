<script lang="ts">
	// Real ACP traffic, replayed: a recorded Claude Code session from the
	// repository's test fixtures (fixtures/claude/edit_allow.jsonl), the same
	// file the mapper tests replay. Runs once it scrolls into view.
	import raw from '$repo/fixtures/claude/edit_allow.jsonl?raw';
	import { onMount } from 'svelte';

	type Frame = { t: number; dir: 'in' | 'out'; line: Record<string, any> };
	type Row = { t: number; dir: 'in' | 'out'; name: string; detail: string; json: string; count: number };

	const frames: Frame[] = raw.trim().split('\n').map((l: string) => JSON.parse(l));
	const methods = new Map<string, string>();

	function summarize(f: Frame): Omit<Row, 't' | 'dir' | 'json' | 'count'> {
		const m = f.line;
		if (m.method) {
			if (m.id !== undefined) methods.set(String(m.id), m.method);
			const p = m.params ?? {};
			const u = p.update ?? {};
			if (m.method === 'session/update') {
				const kind = u.sessionUpdate as string;
				const text = u.content?.text ?? '';
				const detail = kind === 'usage_update' ? `${u.used.toLocaleString()} / ${u.size.toLocaleString()} tokens` : kind.startsWith('tool_call') ? `${u.status ?? ''} ${u.title ?? ''}`.trim() : kind === 'available_commands_update' ? `${u.availableCommands?.length ?? 0} commands` : text;
				return { name: kind, detail };
			}
			if (m.method === 'initialize') return { name: 'initialize', detail: `protocolVersion ${p.protocolVersion}` };
			if (m.method === 'session/new') return { name: 'session/new', detail: p.cwd };
			if (m.method === 'session/prompt') return { name: 'session/prompt', detail: p.prompt?.[0]?.text ?? '' };
			return { name: m.method, detail: '' };
		}
		const of = methods.get(String(m.id)) ?? 'request';
		const r = m.result ?? {};
		const detail = r.agentInfo ? `${r.agentInfo.name} ${r.agentInfo.version}` : r.sessionId ? `sessionId ${r.sessionId.slice(0, 8)}…` : r.stopReason ? `stopReason ${r.stopReason}` : '';
		return { name: `${of} ✓`, detail };
	}

	// Consecutive message chunks read as one streamed row.
	const rows: Row[] = [];
	for (const f of frames) {
		const s = summarize(f);
		const prev = rows.at(-1);
		if (prev && s.name === 'agent_message_chunk' && prev.name === s.name) {
			prev.detail += s.detail;
			prev.count++;
			continue;
		}
		rows.push({ t: f.t, dir: f.dir, ...s, json: JSON.stringify(f.line, null, 2), count: 1 });
	}

	let shown = $state(0);
	let open: number | null = $state(null);
	let el: HTMLElement;
	let list: HTMLOListElement;
	// Follow new rows unless the reader scrolled up to look at something.
	let follow = true;
	const onscroll = () => (follow = list.scrollHeight - list.scrollTop - list.clientHeight < 40);
	let timers: ReturnType<typeof setTimeout>[] = [];

	function play() {
		timers.forEach(clearTimeout);
		shown = 0;
		open = null;
		const start = rows[0].t;
		follow = true;
		timers = rows.map((r, i) =>
			setTimeout(() => {
				shown = i + 1;
				if (follow) requestAnimationFrame(() => (list.scrollTop = list.scrollHeight));
			}, (r.t - start) * 0.6 + i * 60)
		);
	}

	onMount(() => {
		const io = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) {
				play();
				io.disconnect();
			}
		}, { threshold: 0.35 });
		io.observe(el);
		return () => {
			io.disconnect();
			timers.forEach(clearTimeout);
		};
	});

	const time = (t: number) => `${((t - rows[0].t) / 1000).toFixed(2)}s`;
</script>

<div class="trace" bind:this={el}>
	<div class="bar">
		<span class="file">fixtures/claude/edit_allow.jsonl</span>
		<span class="meta">Claude Code adapter 0.81.1 · recorded over stdio</span>
		<button class="replay" onclick={play}>Replay</button>
	</div>
	<ol class="rows" bind:this={list} {onscroll}>
		{#each rows.slice(0, shown) as r, i (i)}
			<li class:open={open === i}>
				<button class="row" onclick={() => (open = open === i ? null : i)} aria-expanded={open === i}>
					<span class="t">{time(r.t)}</span>
					<span class="dir {r.dir}" aria-label={r.dir === 'out' ? 'Splash to agent' : 'Agent to Splash'}>{r.dir === 'out' ? '→' : '←'}</span>
					<span class="name">{r.name}{#if r.count > 1}<span class="count">×{r.count}</span>{/if}</span>
					<span class="detail">{r.detail}</span>
				</button>
				{#if open === i}<pre class="json">{r.json}</pre>{/if}
			</li>
		{/each}
	</ol>
</div>

<style>
	.trace {
		border: 1px solid var(--border-strong);
		border-radius: 12px;
		background: var(--bg);
		overflow: hidden;
		box-shadow: var(--site-card-shadow);
		font: 12.5px / 1.5 var(--font-mono);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 14px;
		height: 38px;
		padding: 0 8px 0 14px;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
	}
	.file {
		color: var(--text);
	}
	.meta {
		flex: 1;
		color: var(--muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.replay {
		height: 24px;
		padding: 0 8px;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius);
		background: var(--soft);
		color: var(--text-2);
		font: var(--fw-medium) 12px var(--font-ui);
		cursor: pointer;
	}
	.replay:is(:hover, :focus-visible) {
		color: var(--text);
		background: var(--hover);
	}
	.rows {
		margin: 0;
		padding: 6px 0;
		list-style: none;
		height: 420px;
		overflow: auto;
	}
	li {
		animation: arrive 0.25s ease-out;
	}
	@keyframes arrive {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}
	.row {
		display: grid;
		grid-template-columns: 56px 18px 230px minmax(0, 1fr);
		gap: 8px;
		width: 100%;
		padding: 3px 14px;
		border: 0;
		background: none;
		color: var(--text-2);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	.row:is(:hover, :focus-visible),
	.open .row {
		background: var(--soft);
	}
	.t {
		color: var(--faint);
		font-variant-numeric: tabular-nums;
	}
	.dir.out {
		color: var(--accent);
	}
	.dir.in {
		color: var(--ok-dim);
	}
	.name {
		color: var(--text);
	}
	.count {
		margin-left: 6px;
		color: var(--muted);
	}
	.detail {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.json {
		margin: 4px 14px 8px 96px;
		padding: 10px 12px;
		max-height: 260px;
		overflow: auto;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--surface);
		color: var(--text-2);
		font-size: 12px;
		white-space: pre;
	}
	@media (max-width: 760px) {
		.row {
			grid-template-columns: 18px minmax(0, 1fr);
		}
		.t,
		.detail {
			display: none;
		}
		.json {
			margin-left: 14px;
		}
		.meta {
			display: none;
		}
	}
</style>
