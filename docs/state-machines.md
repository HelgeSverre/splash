# Splash state machines

Audit date: 2026-11-08. Scope: first-party application code in `src/` and
`app/src/`, including the desktop harness and authenticated server. Vendored
framework internals and provider-side implementations are outside this audit.
The tests use fixture agents, temporary repositories and isolated databases.

This is the single inventory, transition reference, bug ledger and verification
record for this work. A state machine includes combinations of flags and pending
operations, not only Rust enums. Tables group equivalent inputs; an omitted
transition is not implicitly allowed. Provider strings are open wire vocabularies,
not enums Splash can assume exhaustive.

## Baseline and commit scope

Baseline revision: 508aef8b66738dc4f2fc87ff7619c900ef7f9a20.
Existing local changes to e2e/package.json, e2e/package-lock.json and the untracked
.claude/ directory preceded this task and are excluded from the cleanup commit.
The Playwright file hashes were rechecked before committing; neither file changed
during the final review. All other included changes are the cleanup, its tests and
this document. Public command names and serialized bindings remain unchanged;
removed Rust convenience interfaces and frontend helpers were contracted under
the user's explicit instruction to migrate callers and delete the old paths.
External Rust-library consumers were not independently surveyed.

## Review method and evidence

1. Inventory explicit enums and state-bearing maps, flags, futures and timers;
   trace public commands and their writers through normal and failure paths.
2. Exercise suspected violations through actual owning modules with regression
   tests; hold asynchronous operations at controlled gates to force interleavings.
3. Review fixes and interfaces again, including cancellation, retries, stale
   replies, generation replacement, persistence and obsolete call paths.
4. Run the repository gates and both fixture-driven browser harnesses. The final
   verification section records actual results, not intended coverage.

A failing deterministic regression is stronger evidence than a possible
interleaving inferred from code. The bug ledger distinguishes confirmed failures
from remaining fault-injection or platform coverage gaps. No issue is promoted
merely because several booleans could represent a bad combination.

## 1. Session actor and admission

Owner: [`src/acp/actor.rs`](../src/acp/actor.rs), with command admission and live
ownership in [`src/hub/sessions.rs`](../src/hub/sessions.rs).

Explicit `Status`: `Starting`, `Idle`, `Running`, `AwaitingPermission`, `Error`,
`Exited`. Orthogonal state: pending prompt future, permission responder map,
startup deadline, closed-output grace timer and actor lifetime token. `Error` is
not synonymous with a dead process: prompt errors can leave the connection alive.
Absence from the hub's live map displays as `Exited`.

Invariants:

- At most one current actor and one admitted prompt per session. A successful
  admission reserves the turn before another submission can pass readiness.
- Prompt admission waits for successful initialize and new/load/resume; a failed
  restore must never silently create a replacement native conversation.
- Only callbacks carrying the current active token can update the mirror, record
  or persistent queue. Token validation and invalidation share the callback gate.
- `AwaitingPermission` means unresolved responders remain. Cancellation is still
  an active turn until the provider acknowledges its terminal outcome.
- Startup has a 180-second RPC budget; admission waits up to 185 seconds. These
  are different deadlines. Closed output gets a five-second exit grace period.

| From | Input / guard | To | Effects |
| --- | --- | --- | --- |
| Absent | Connect/create; writable record | Starting | Reserve live slot; restore saved entries; launch ACP |
| Starting | Initialize and new/load/resume succeed | Idle | Save native identity and capabilities |
| Starting | Spawn/protocol/restore failure or timeout | Error | Preserve native identity and transcript; report reason |
| Idle | Nonempty admitted prompt | Running | Append user entry; clear attention; publish Running before acknowledging acceptance |
| Running | Permission request | AwaitingPermission | Append card; retain responder |
| AwaitingPermission | Valid answer; other requests remain | AwaitingPermission | Resolve that card/responder once |
| AwaitingPermission | Last request resolved | Running if prompt pending, else Idle | Clear permission wait |
| Running or AwaitingPermission | Cancel | Active until prompt result | Notify provider; cancel pending requests |
| Active turn | Successful prompt response | Idle | Settle live entries; append turn end; refresh workspace |
| Active turn | Prompt RPC failure | Error | Settle turn as failed; append diagnostic |
| Active turn | Output closes | Grace wait, then Exited or Error | Wait for child exit diagnostics; never report success |
| Any live state | Child exits | Exited | Finish interrupted turn; checkpoint exit reason |
| Idle/Error/Exited | Explicit reconnect | Starting | Invalidate old actor; drain queued store writes; restore |
| Any live state | Shutdown | Exited / removed | Checkpoint; bounded provider close; retire process tree |
| Starting reservation | Startup future dropped before actor launch | Absent | Drop claim invalidates only its own lifetime; retry remains possible |
| Busy | Second prompt or reconnect | Unchanged; reject | Never acknowledge a silently dropped prompt |

## 2. Transcript, streams, tools, permissions and replay

Owner: [`src/acp/map.rs`](../src/acp/map.rs). State: current turn, optional open
stream index, tool-ID index, dirty full entries, pending text deltas and unsaved
entries. Each mirror entry has a monotonically increasing version within its
snapshot generation. A history replacement resets that generation.

| Object / from | Input | To / action |
| --- | --- | --- |
| Between turns | Begin prompt | Active turn; append user; establish turn start |
| Active, no stream | Agent/thought chunk | Open streaming entry |
| Open stream of same kind | Next chunk | Append text and buffer delta |
| Open stream | Different kind/tool/permission/end | Close old stream; emit full settled entry |
| Tool absent in current turn | Tool call or orphan update | Create tool entry and index |
| Tool current | Tool update | Update only supplied fields; terminal statuses dirty workspace |
| Permission absent | Request | Unresolved card with offered choices |
| Permission unresolved | Answer/cancel/end | Resolved card; duplicate answer has no effect |
| Active turn | `end_turn` | Completed turn; pending tools become completed |
| Active turn | Other stop reason | Interrupted turn; pending tools become failed |
| Between turns | Agent output | Notice, rather than a new active answer |
| Checkpoint contains live entries | Restore/cold display | Nonstreaming text, failed tools, cancelled permissions |
| Dirty entries | Flush | Versioned upserts; text-only continuation may use delta |
| Unsaved entries | Checkpoint | Ordered persistence; live entries otherwise wait for checkpoint |

Invariants: a terminal turn cannot retain an unresolved permission, streaming
text or pending tool. A delta only applies to the immediately preceding version
of an agent/thought entry. A full upsert can advance over missed versions. The
mapper owns turn-local indexing, settlement, versioning and persistence selection;
callers must not reconstruct those rules. `Replay` converts provider history to
settled entries; history connections always cancel permission requests and never
send prompts.

## 3. Stored session, project, worktree and native history lifecycle

Owners: [`src/hub/sessions.rs`](../src/hub/sessions.rs),
[`src/hub/sessions/library.rs`](../src/hub/sessions/library.rs),
[`src/worktree.rs`](../src/worktree.rs), [`src/store.rs`](../src/store.rs).

Stored existence, archive state, native deletion, native identity and live actor
status are independent dimensions. `external` controls directory ownership;
`source.deleted` makes the local history read-only. A disconnected imported
conversation is valid. An archived record can still retain its branch and history.

| From | Operation / guard | To / effect |
| --- | --- | --- |
| No project | Add canonical existing directory | Stored project; announce project |
| Project present | Create in place | Stored writable session; reuse project folder |
| Git project present | Create worktree | New branch and checkout; save base SHA; create actor |
| Session writable/disconnected | Reconnect | Same local and native identity, current actor |
| Idle live session | Disconnect | Provider close when supported; retire actor; settle writes |
| Busy/starting live session | Disconnect/history replacement | Reject; no replacement |
| Disconnected history | Refresh from provider | Atomic saved history + search index replacement; publish reset |
| Disconnected history | Native fork supported | New native/local identity; parent link; never rewrite parent |
| Disconnected history | Native delete succeeds | Keep local entries/files; set read-only tombstone |
| Native delete/refresh fails | Failure | Keep prior local history and tombstone state |
| Writable session | Archive; owned checkout clean or force | Retire actor; remove owned worktree; retain branch/history |
| Session present | Local delete; checkout clean or force | Remove local record/mirrors; never delete external directory |
| Shared active checkout | Archive/delete owner | Reject until other local copies no longer use it |
| Project present | Remove project | Stop its actors; remove project and cascading stored sessions |

History preview state is `absent → loading → cached → imported/expired`, with
at most eight cached previews and a 15-minute lifetime. Import deduplicates by
agent/native ID/launch profile, rejects stale previews after local activity or
newer synchronization, validates roots and refuses changed working directories.
Pagination rejects repeated cursors and bounds current-history lookup at 100 pages.
Fork failure after the provider created a native ID reports that ID for recovery.

Invariants: project removal and session creation must be serialized; no orphan
live actor can own a removed record. History replacement must exclude a live
writer. File ownership must not be inferred solely from a path: external history
never grants permission to remove the original checkout. Native deletion never
means filesystem deletion. These ordering rules belong to Sessions.

## 4. Attention and shutdown recovery

Owner: `Sessions::status`, `acknowledge`, `shut_down` and stored `AttentionKind`
(`Permission`, `Review`, `Failed`). Attention is durable; unread notification
markers are client-local and independent.

| Previous / event | Result |
| --- | --- |
| Any / begin admitted work | Clear old attention |
| Active / permission wait | Permission attention |
| Running or permission wait / Idle | Review attention |
| Any / Error | Failed attention with diagnostic |
| Starting/running/permission / unexpected Exited | Failed attention |
| Idle / unexpected Exited | No new failure solely for stopping an idle actor |
| Review / reconnect | Retain review until acknowledgement or new work |
| Permission / acknowledgement while actively waiting | Retain; only an answer clears active permission |
| Review or failed / acknowledgement | Clear and persist |
| App shutdown during Running | Persist recovery failure before killing children |
| App shutdown during permission wait | Keep permission attention for recovery |
| App-initiated shutdown callbacks | Do not overwrite recovery with spurious agent failure |

## 5. Persistent writer and snapshot generations

Owner: `Store`. The queue is FIFO: entries, identity, activity, usage, attention,
title and source changes precede a barrier submitted after them. `settle` waits
for this barrier; it is not an acknowledgement that earlier writes succeeded.
Writes can fail and are currently logged to stderr. Direct transactional history
replacement also updates the FTS index; ordinary queue writes and destructive
operations must respect actor invalidation plus drain ordering.

| From | Input | Result |
| --- | --- | --- |
| Unopened | First store request | Connect, migrate, start writer; OnceCell shares initialization |
| Initializing | Initialization error | Return error; a later request may retry |
| Ready | Queue write | Pending FIFO operation |
| Pending write | SQL success | Durable update |
| Pending write | SQL failure | Diagnostic; writer continues (durability coverage gap) |
| Queue | Barrier | Acknowledge processing all earlier messages |
| Stored history | Transactional replace | Commit entries, metadata and searchable text together |

## 6. Browser transcript replication

Owner: [`app/src/lib/transcripts.svelte.ts`](../app/src/lib/transcripts.svelte.ts).
State: loading, authoritative-load in flight, queued events, revision, recovery
request, needs-resync bit, retry timer/delay and error-report suppression.

| From | Event | To / action |
| --- | --- | --- |
| Absent | Open/create | Create local lifetime; load full history or empty transcript |
| Loading | Live event | Queue until full load completes |
| Ready | New upsert | Apply if version newer; fill missing slots provisionally |
| Ready | Contiguous delta of text kind | Append; advance version |
| Ready | Gap/wrong-kind delta | Mark recovery needed; request authoritative snapshot |
| Recovery pending | Another event/load supersedes it | Discard stale reply by revision/lifetime |
| Recovery pending | Matching snapshot | Replace mirror; clear retry/error state |
| Recovery pending | Failure | Keep content; report once; exponential retry 250–2,000 ms |
| Any | Reset event | Replace snapshot generation; invalidate older recovery reply |
| Any | Drop | Cancel timer; delete lifetime; reject stale completions |

Invariants: snapshots must not erase updates that arrived during the request;
versions from different snapshot generations cannot be compared as if global.
A dropped transcript must never be resurrected by an asynchronous completion.
Opening a transcript does not itself mean the agent was started.

## 7. Server connection, authentication and command transport

Owners: [`app/src/lib/server.svelte.ts`](../app/src/lib/server.svelte.ts),
[connection transition owner](../app/src/lib/server-connection-model.ts),
[`src/server/bridge.js`](../src/server/bridge.js), [`src/server.rs`](../src/server.rs).
Client states: `connecting`, `syncing`, `online`, `offline`, `auth`; orthogonal
single-flight checking, server instance/token, recovery-needed and retry timer.

| From | Event | To / action |
| --- | --- | --- |
| Connecting/offline | State endpoint succeeds; new instance or recovery needed | Syncing; renew IPC identity and reconcile workspace |
| Syncing | Reconcile succeeds with current connection state | Online; clear error/backoff |
| Any authenticated state | Network error/offline/403 stale IPC token | Offline; schedule check |
| Any | 401/auth-required | Auth; stop treating retry as authentication |
| Offline | Check/reconcile failure | Offline; bounded exponential retry |
| Online | Visibility/online event | Recheck/reconcile; no mutation replay |
| Online | Periodic five-second check | Keep online if identity and workspace remain current |
| Any | Successful sign out or already-unauthorized sign out | Reload login |
| Any | Sign-out network failure | Offline; retain local drafts |

The bridge changes only IPC URLs and refreshes headers. It must never replay a
mutation after ambiguous network failure: send/create may already have reached the
server. Event polling can retry a stale token as 503. HTTP authentication uses a
stable per-data-directory secret/cookie; the IPC token and instance change on
restart. Foreign origins, invalid Host, oversized bodies and unsupported desktop
system routes are rejected before command dispatch. Command and event concurrency
permits are separate, so long polls cannot starve commands.

## 8. Agent history discovery in the client

Owners: [`app/src/lib/agent-history.svelte.ts`](../app/src/lib/agent-history.svelte.ts)
and its [request owner](../app/src/lib/agent-history-model.ts).
Scope is agent + launch arguments + working folder; cursors are memory-only.

| From | Event | Result |
| --- | --- | --- |
| Absent | Load | First page pending |
| Cached | Load | Reuse cache |
| Cached | Refresh | First page pending; preserve old content until success |
| Cached with next cursor | More | Next page pending; retain prior rows |
| Pending | Same-scope second load | Coalesce/skip rather than duplicate |
| Pending | Matching successful reply | Merge by native ID; record cursor/date; clear loading |
| Pending | Error | Keep rows; retry the failed first/next-page operation |
| Pending/cached | Invalidate agent | Retire source lifetime; old replies cannot update new lifetime |
| Next-page success | Repeated next cursor | End pagination and show actionable error |

## 9. Workspace reads and leases

Owners: [`app/src/lib/workspace.svelte.ts`](../app/src/lib/workspace.svelte.ts),
[`src/hub/workspace.rs`](../src/hub/workspace.rs),
[`src/workspace.rs`](../src/workspace.rs).

| From | Input | Result |
| --- | --- | --- |
| Absent client workspace | Ensure/open | Empty tree/changes model |
| Cached | Change event | Debounced status request; touch affected paths; reload expanded parents |
| Request pending | New request same path | Older completion loses version check |
| Request pending | Drop/recreate same session | Older completion loses lifetime check |
| Directory request | Failure | Explicit tree error, distinguished from empty directory |
| Status request | Failure/missing archived checkout | Empty changes; clear matching loading |
| No server watcher | First subscriber | Create watcher and lease |
| Watcher present | Another subscriber/renew | Add/renew client lease |
| Watcher present | Client leaves | Remove only that client; retain other clients |
| Watcher lease | 90-second expiry when next watch call prunes | Remove expired subscribers and unused watcher |
| Session retired | Forget | Close terminal, remove watcher and cached git info |

File operations validate containment with host-native paths and reject escaping
symlinks. Browser path display follows reported host conventions; it is not a
backend containment validator.

## 10. Terminal and process lifetimes

Owner: [`src/terminal.rs`](../src/terminal.rs),
[`app/src/components/TerminalPane.svelte`](../app/src/components/TerminalPane.svelte),
[`src/procs.rs`](../src/procs.rs) and its platform implementations.

| From | Event | Result |
| --- | --- | --- |
| No shell | Open | Create PTY, process tree, reader and internal generation |
| Live/draining shell | Open | Resize/reattach same generation; snapshot scrollback + sequence floor |
| Live shell | Output | Bound scrollback; publish strictly ordered sequenced chunk |
| Child exited, ConPTY output still open | Watcher | Close master; reader drains final output |
| Reader EOF | Finish once | Allocate terminal exit sequence; mark done; reap internally; publish exit |
| Done shell | Open | Retire old generation; start replacement above old sequence floor |
| Any shell | Close/session stop | Invalidate emission; terminate tree; reap child |
| Old generation | Late event/cleanup | Cannot retire replacement; clients discard events below snapshot floor |
| Client attaching | Output event | Queue until attach snapshot; replay only newer events |
| Client ready | Input | Serialize writes; keep keystrokes queued behind in-flight write |
| Client exited | First key | Start replacement; retain triggering keystrokes |
| Client removed | Async completion | Identity check prevents writes into disposed xterm |

The terminal module now owns reaping and generation checks: callers supply only
an event publisher and never an exit cleanup rule or generation parameter.
A `ProcessTree` owns registration and idempotent kill; drop also kills descendants.
Unix shutdown signals the tracked groups then escalates; Windows uses job objects.
The native implementations require platform-specific validation.

## 11. Preferences and reusable asynchronous reads

Owners: [`app/src/lib/prefs.svelte.ts`](../app/src/lib/prefs.svelte.ts),
[`app/src/lib/load.svelte.ts`](../app/src/lib/load.svelte.ts).

| Machine / from | Event | Result |
| --- | --- | --- |
| Preference confirmed | Local intent | Optimistic display; serialize write behind same-key predecessor |
| Preference pending | Success | Advance confirmed value |
| Latest preference pending | Failure | Roll back to last confirmed value; show error |
| Older preference pending | Failure after newer intent | Do not roll back newer display (including A → B → A) |
| Snapshot pending | Local intent or previously pending write | Snapshot must not override protected key |
| Generic read idle/ready | Reactive dependency changes | Start new generation; optionally reset displayed value |
| Generic read pending | Older reply | Ignore by generation |
| Generic read pending | Current success/error | Set value or explicit error |

## 12. Navigation, composition, layout and modal workflows

Owners: session/route/tabs/layout modules, `Composer.svelte`, `NewSession.svelte`,
`SessionHistoryActions.svelte`, `ServerFolderPicker.svelte`, `ReviewPanel.svelte`.
View is one of welcome/session/library/attention/GitHub/Actions/playground.
Settings, new-session, issue composer and preview are independent overlays.

| Machine / event | Transition / invariant |
| --- | --- |
| Navigation / open session | Select session, ensure local tabs/workspace, load history, clear unread |
| Navigation / initial data loaded | Install URL route once; preserve user navigation made while loading |
| Session / local deletion or project removal | Drop drafts/transcript/tabs/workspace/terminal; fall back to welcome |
| Tabs / open known tab | Focus existing tab; file location can advance |
| Tabs / close | Chat remains; adjust active index to remaining list |
| Composer / send | Busy during admission; preserve draft on failed admission |
| Composer / session switch | Per-session unsent drafts survive |
| New session / create | Busy until completion; surface failure; successful creation selects new session |
| History action / pending operation | Disable conflicting actions; read-only archived/deleted history cannot prompt |
| Review / feedback | Capture session ID; send once; clear matching draft after success |
| Layout / persisted value | Validate object, finite sizes, booleans and known side tab; apply defaults/clamps |
| Layout / resize | Keep saved preferred size; derive viewport-constrained visible size |
| Folder picker / browse | Latest request generation owns path/list/error/loading |
| Folder picker / close | Invalidate outstanding browse; resolve pending caller once |
| Folder picker / replacement open | Resolve preceding picker with null |

## 13. GitHub feeds, Actions and provider readiness

Owners: `github.svelte.ts`, `github-actions.svelte.ts`, `github-inbox.svelte.ts`,
`src/github.rs`, `src/github_actions.rs`, `src/hub/agents.rs`, `src/agents/probe.rs`.

| Machine / event | Transition / invariant |
| --- | --- |
| Catalog absent / load | Single-flight catalog request; explicit error on failure |
| Catalog / login changes | Invalidate feed generation, pages, selection and locally created rows |
| Feed / scope load | New generation; bounded concurrent queue (four feed, three Actions requests) |
| Queue / success | Replace or append page; deduplicate IDs; retain cursor and sync date |
| Queue / ordinary error | Preserve cached rows/cursor; record error |
| Queue / global auth/rate-limit error | Pause undispatched work; already-dispatched requests may finish |
| Queue / stop/scope replacement | Increment generation; discard old replies |
| Actions / filter signature change | Clear incompatible pages |
| Issue draft / create | Validate repository/title; retain draft on error; merge successful item |
| Backend GitHub / request | Acquire bounded permit; enforce deadline; validate endpoints/IDs/pages |
| Backend mutation / ambiguous timeout | Report uncertainty; user must check before retrying creation |
| Agent cache / detect | Installed/runner/auth are separate from probe success |
| Agent probe / handshake | Initialize then bounded capability inspection; no real prompt |
| Agent args / edit | Persist launch arguments; update cached status |

GitHub run/job/step statuses, conclusions, workflow states, ACP tool/plan statuses
and provider config choices are foreign states displayed from responses. Splash
cannot force remote transitions; it validates and interprets the snapshots it gets.
CLI detection alone is not proof that a provider works.

## 14. Launch-argument parsing

Owner: split_args in [the hub](../src/hub/mod.rs). This is a small explicit
lexer state machine, shared by every live/history/probe launch. It does not run
a shell, expand variables, or interpret command substitution.

| State | Input | Transition / output |
| --- | --- | --- |
| Between arguments | Whitespace | Stay between arguments |
| Between arguments or word | Single/double quote | Enter quoted mode; preserve an empty quoted argument |
| Word | Whitespace | Finish current argument |
| Single quoted | Closing single quote | Return to word |
| Single quoted | Other character | Append literally, including backslashes |
| Double quoted | Closing double quote | Return to word |
| Word/double quoted | Backslash before whitespace or quote | Append escaped character |
| Word/double quoted | Other backslash | Preserve path separator, including UNC prefixes |
| Any unquoted state | End of input | Finish current argument if started |
| Quoted | End of input | Return validation error; do not spawn or save invalid profile |

The raw profile text remains the identity used by history imports. A probe must
not reconstruct it by joining parsed argv, which loses quotes and changes that
identity. Windows paths ending in a backslash can be single quoted so the closing
quote is not interpreted as escaped. Tests cover quoted spaces, empty arguments,
escaped whitespace, Windows drive paths, UNC paths and unfinished quotes; native
Windows execution remains a separate platform check.

## Confirmed bug ledger and grouped issues

Severity is impact-based: P1 means loss of acknowledged messages or recorded
history; P2 means a broken workflow, stranded retry, misleading wait state or
incorrect launch. Cleanup fixes landed on main in b8610d8 and shipped in
[v0.2.3](https://github.com/HelgeSverre/splash/releases/tag/v0.2.3), whose immutable
tag points to 2c359831e5284f0abb7dd3861326c6b46c14cc44. The publication-only collector
repair landed afterward in 6b40f1d; it does not alter those released binaries.
Issue creation alone is not evidence that a released build contains a fix.

| Priority | Confirmed violation and reachable trace | Group / evidence | Fix |
| --- | --- | --- | --- |
| P1 | A later turn reuses a tool ID; call or update-only message rewrites an earlier completed entry | [#9](https://github.com/HelgeSverre/splash/issues/9); mapper regression failed with only the second tool remaining | One current-turn lookup for calls, orphan updates and permission titles; restored history stays immutable |
| P1 | Idle metadata races queued prompt admission; another message is acknowledged then actor silently drops it | [#13](https://github.com/HelgeSverre/splash/issues/13); confirmed source-level metadata/command schedule (not a controlled old-race reproduction); only_the_actor_admits_a_queued_prompt verifies success follows Running and a second queued send is explicitly rejected | Actor-owned acceptance response, replacing optimistic hub ownership |
| P2 | Project removal completes while Git worktree creation is blocked before session insert | [#11](https://github.com/HelgeSverre/splash/issues/11); gated real Git regression failed before lifecycle locks | One lifecycle lock spans creation and removal |
| P2 | Startup future is cancelled after live-slot claim, leaving Starting with no receiver; retry cannot recover | [#11](https://github.com/HelgeSverre/splash/issues/11); actual startup cancelled while store initialization is held | Scoped claim removes only its own generation on drop |
| P2 | Cold lifecycle commands read an unhydrated cache: reconnect/archive fail NotFound, while delete can skip worktree guards | [#11](https://github.com/HelgeSverre/splash/issues/11); fresh-Hub reconnect and destructive-action regressions | Hydrate store/records inside lifecycle entry points before lookup |
| P2 | Cancel drains permission responders but leaves AwaitingPermission until slow provider completion | [#9](https://github.com/HelgeSverre/splash/issues/9); delayed-cancel actor regression was red | Shared permission-wait exit rule returns to Running while cleanup remains active |
| P2 | Invalidate/recreate source while discovery is pending; both request versions are 1 and a stale reply strands the replacement | [#10](https://github.com/HelgeSverre/splash/issues/10); deferred-promise regression | Source lifetime plus request version owns completion; wrapped reactive identity retained |
| P2 | Auth-required arrives during pending reconciliation; its older success/failure overwrites Auth | [#12](https://github.com/HelgeSverre/splash/issues/12); deferred reconcile regression | Generation invalidation checks after every await and in failure handling; server authentication remains enforced |
| P2 | Quoted launch profile is split into fragments; malformed quotes launch instead of failing validation | [#14](https://github.com/HelgeSverre/splash/issues/14); parser regression for spaces and incomplete quotes | One fallible parser used by live, probe and history paths |

During fix review, the new client owner initially retained an unwrapped object
rather than the reactive store's authoritative object; a first integrated e2e run
exposed stuck history searches. The run was interrupted, identity handling was
corrected, and a proxy-backed regression added. The same review caught a repeated
cursor retry being incorrectly treated as a cache hit; retries now force refresh.
These were caught during this work, not attributed to the original release.

## Module depth and interface review

The deletion test is applied by responsibility, not file size. The terminal,
transcript, lifecycle, history-source, preferences, workspace, HTTP transport,
filesystem and provider modules earn their place by hiding ownership, ordering,
validation or recovery behavior. Deleting them would distribute that knowledge
among callers. Small pure formatters, wire data types and test-id attribute types
are contracts or computations, not artificial lifecycle layers to enlarge.

| Module | Responsibility now hidden from callers | Removed interface / deletion test |
| --- | --- | --- |
| Sessions | Parent/child serialization, cold hydration, cancellation-safe actor ownership | Public ensure_live removed; only lifecycle commands start actors |
| Actor | Single-turn admission and permission-wait transitions | Admission acknowledgement replaces optimistic hub status ownership |
| Transcript | Turn-local tool indexing, orphan updates, history settlement | One lookup replaces subtly different call/update/title rules |
| Agent history | Cache key, lifetime, cursor progression, refresh and failed-page retry | Component keys and boolean load flags removed; one agentHistory owner; old exports/call paths deleted |
| Server connection | Single-flight state probe, instance reconciliation, auth generation | Transition flags and late-reply rules moved out of browser event callbacks |
| Terminals | Generation checks and exit reaping before publishing events | Public reap and callback generation argument removed; Workspace only publishes events |
| Launch parsing | Quoting and malformed-input validation | Whitespace parser removed; no caller may invent argv splitting |
| Store / workspace / processes / HTTP / GitHub | Transactions and FIFO, native containment/leases, child ownership, auth/permits, remote pagination/validation | Retain modules: deletion would redistribute their behavior to all callers |
| Views / layout / format / wire types | Presentation, persisted-value normalization, pure transformations and data contracts | Retain cohesive computations/contracts; do not manufacture larger abstractions for small pure functions |

No compatibility wrapper retains the removed ensure_live, terminal reap,
generation callback, history key helper or boolean history loading interface.
After actor acceptance, prompt auto-titling uses an infallible queued write under
the callback gate. It cannot turn an accepted message into a reported send failure
or overwrite a newer provider title between the unnamed check and the write.
Browser effects remain in their adapters; the owning state models receive the
actual discovery/probe/reconcile dependencies, so tests exercise their transitions
without a browser or personal agent data.

## Final precommit review round

Reviewed baseline-to-index patch SHA-256:
b7c1b55f64050545b943c25523d63f095e4dad874d4d50cc805d1c7a7ec56525.
Only provenance and round bookkeeping were added after that review; application
code and tests remained unchanged.

| Reviewer | Rotated assignment and evidence | Disposition |
| --- | --- | --- |
| actor_states | Frontend history/connection owners, migrated consumers and auth e2e; reran all 20 app tests | Verified; no confirmed defects |
| client_states | Lifecycle claims, cold entry points, terminal ownership, argument parsing and retired interfaces; checked staged diff and whitespace | Verified; no confirmed defects |
| lifecycle_states | Actor admission, permission cancellation, mapper turn isolation, fake agent, regressions and document against completed gate logs | Verified; no confirmed defects |

Earlier discovery and challenge work overlapped implementation, followed by
cross-review and repairs documented above. This final round checked the same
frozen staged snapshot through three independent lenses; it does not claim a
formal concurrency proof or retrospectively recast earlier work as separate,
strictly sequential sweeps. A suspected premature-validation finding was
withdrawn after the reviewer checked the completed logs rather than older
progress messages. No code changes were required by this final round.

## Verification and limitations

| Check | Result |
| --- | --- |
| Final just check (format, clippy, Svelte/types, UI token/focus/copy lint, Rust suites) | Passed; 106 Rust tests |
| Final cargo test --no-default-features | Passed; 106 Rust tests; headless build |
| just frontend | Passed; final e2e recipe rebuilds frontend before backend binaries |
| node --experimental-strip-types --test app/tests/*.test.ts | Passed; 20 tests |
| Focused just e2e history + web connection | Passed; 39 tests |
| Full just e2e after admission and client fixes | Passed; 274 tests, 9 explicitly skipped (notification/capture cases), including cold-entry follow-up |
| Final prompt-title callback gate / a_prompt_names_the_session_until_the_agent_does | Passed; callback gate keeps the unnamed check and queued title write together with provider updates |
| Isolated HTTP smoke script through uv run | Passed; login, authenticated assets/state, origin checks and headless startup |
| Diff whitespace and local documentation links | Passed |

Three subagents covered actor/transcript, session/history lifecycle and client
state. Subsequent rounds cross-reviewed ownership and lock ordering, then reviewed
the fixes again: orphan tool updates after restore, Svelte proxy identity,
repeated-cursor retry, cancellation of an actual startup future, auth after
reconciliation, acceptance ordering and no fallible work after prompt acceptance.
The first full e2e run was interrupted after detecting the temporary proxy bug;
it is not counted as passing validation.

Actual host: macOS arm64. Default desktop and headless Rust builds were tested.
The desktop-labelled browser tests run the real splash-web harness, not a native
webview; web tests run splash-server. No visual layout changed, so no new UI
screenshots were substituted for runtime checks. At that local cleanup snapshot, native macOS x64, Windows MSVC, Ubuntu x64
and native webview runtime/packaging CI had not been run. The later release
follow-up below records the completed native CI and installer validation.

The source-level prompt/metadata schedule is documented explicitly; its regression
locks the new admission contract rather than pretending to replay that exact old
race. Fixture tests do not establish every provider's behavior or all adversarial
schedules. Disk-full/write-error durability is not fault-injected; Store::settle
still acknowledges processing rather than durable success. Project removal retains
worktrees/files intentionally; no cleanup of user work is inferred from removing
a sidebar project. These limits are not counted as newly confirmed bugs.

## 15. Release follow-up: notarization ticket delivery

The release follow-up extends scope to scripts/package-release.sh,
scripts/package-pkg.sh, their shared scripts/notary-retry.sh owner, and the
isolated script regression/CI wiring. This follows the cleanup verification
above; its live release verification is tracked separately below.

[Issue #15](https://github.com/HelgeSverre/splash/issues/15), P2: accepted Intel
notarization failed to become a distributable archive because the one-shot
stapling call lost its connection to Apple’s ticket service. Release run
42426912427 failed twice (jobs 128567083819 and 128571717010): codesign
verified, notarization returned Accepted, then NSURLErrorDomain Code=-1005
and stapler exit 68 prevented publication. Both attempts used v0.2.2 at
1d0f8d4999cb1c4bdaa51fb20a162e04d9c53794; that tag remains immutable and
unpublished. The packaging correction shipped in v0.2.3.

| From | Event / guard | Effect / next state |
| --- | --- | --- |
| Signed artifact | Notarization accepted | Keep the same signed artifact and request its ticket |
| Ticket request | Stapler succeeds | Return success; caller must validate ticket and Gatekeeper |
| Ticket request | Network-labelled failure; attempts remain | Retain artifact; retry after 5, 10, 20, then 40 seconds |
| Ticket request | Permanent failure or fifth failed attempt | Preserve tool failure status; stop packaging without publishing |
| Stapled artifact | Ticket/signature/Gatekeeper validation fails | Fail closed; no archive/installer is published |
| Validated package set | All required jobs/assets pass | Publish the complete checksum-verified release |

The helper owns classification, attempt bounds, logging and temporary-log cleanup.
Callers supply only the artifact path. It never re-signs or re-submits notarization
while retrying ticket delivery, and app/installer callers retain their existing
validation gates. The helper retries ticket retrieval, not mutations or whole
release publication. This is resilience against the observed network failure,
not proof that Apple’s service will recover within the retry window.

The actual archive-packager regression was red before the fix (exit 68 after its
first simulated network failure). After the fix, tests exercise recovery after
two failures, one signing/submission only, permanent failure without retry,
five-attempt exhaustion, installer paths with spaces, mandatory ticket validation,
and mandatory Gatekeeper assessment. These fixtures replace external signing and
network commands; they do not assert live Apple readiness.

Local release-follow-up checks: six notarization regressions, four release-tool
tests and eleven pipeline tests; Ruff, shellcheck, manifest consistency and locked
Cargo metadata. Live v0.2.3 build, native, webview, browser and package gates all passed in
[run 42430099714](https://github.com/HelgeSverre/splash/actions/runs/42430099714).
Intel signing job 128576907818 reproduced three Apple network failures, then
stapled successfully on the fourth attempt after 5/10/20-second backoffs.
The same accepted artifact passed ticket validation and Gatekeeper, both before
and after ZIP extraction. The universal signed/notarized installer also passed.
Publication was subsequently recovered from the collector issue described below.

Release-repair review at staged patch 1187f6612b70428430653b0ef9ca5b1ae5ac8dc9d941f074d6975fa9f79c4d88:
three read-only reviewers checked retry/exit/trap semantics, real-packager test
coverage and CI wiring, and version/document consistency. No code findings;
release-guide wording was corrected to five total attempts (four retries).
Installer coverage tests the shared helper directly; full native installer
validation remains the release workflow's responsibility.

## 16. Release follow-up: shipping artifact collection

[Issue #16](https://github.com/HelgeSverre/splash/issues/16), P2: all v0.2.3 native,
package and notarization jobs passed in run 42430099714, but publisher job
128581905875 downloaded the Windows native-test diagnostics through its broad
`splash-*` pattern. The strict file allowlist correctly rejected those unexpected
files. This is a collection-scope error, not a failed or missing package.

The publisher now collects `splash-macos-*` and `splash-packages-*` explicitly.
The exact package/checksum allowlist is unchanged. The workflow-pattern regression
reads the actual publisher configuration: it was red with the broad glob and is
green with all seven shipping artifacts included and diagnostics excluded.

| State | Event / guard | Effect / next state |
| --- | --- | --- |
| All build/test/notarization gates passed | Collect intended artifact families from exact run | Stage only shipping artifacts |
| Staged artifacts | Unexpected/missing filenames or bad checksum | Reject; no public release |
| Exact complete verified package set | Release absent | Create hidden draft and upload all files |
| Draft uploaded | Exact remote inventory and uploaded states | Publish; immutable release |
| Published release | Retry | Leave binaries and notes unchanged |

Recovery uses the existing run's shipping artifacts and a clean detached checkout
of v0.2.3 at 2c359831e5284f0abb7dd3861326c6b46c14cc44. It invokes that checkout's
unchanged strict publisher after verifying the full package set. No binary is
rebuilt, no validation is disabled, and the tag remains unchanged. The unchanged tag publisher verified all 24 files locally, created a hidden
draft, uploaded the complete set, checked the remote inventory, then published
[v0.2.3](https://github.com/HelgeSverre/splash/releases/tag/v0.2.3) at
2026-11-08 01:59 CET (00:59 UTC). GitHub marks it Latest. All 24 uploaded sizes and GitHub
SHA-256 digests were independently matched against the verified source files
after publication. No test diagnostics were uploaded. The workflow-level
collector repair and configuration regression keep future releases on the same
strict intended input set.

Collector repair review at staged eaea5aaeb2fa0c691315d73066ff7a39c311aac8cd58f81285fa2d1302f77b8e:
three read-only reviewers verified producer/dependency coverage, disjoint shipping
files, diagnostic exclusion, the real workflow-pattern regression, and preservation
of the strict publisher. No source findings. Ruff, actionlint, the new collector
regression and whitespace checks passed. The released app/binaries remain exactly
the tested v0.2.3 tag; only publication input collection and documentation changed
after that tag.

Final release evidence: the publisher retry in run 42430099714 completed
successfully through its already-published no-op guard; all 24 asset IDs, sizes,
digests and release notes remained unchanged. The collector repair at 6b40f1d also
passed [full CI run 42434719951](https://github.com/HelgeSverre/splash/actions/runs/42434719951),
including its new configuration regression, native matrix, browser and package
checks. v0.2.3 is published and Latest; v0.2.2 remains an unpublished immutable
tag. Temporary recovery worktree and artifact downloads were removed.
