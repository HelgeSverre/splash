# Comparison pages: next round

Status on 2026-10-10, when round 2 was stopped to save usage.

| State | Count | Where |
| --- | --- | --- |
| Live: drafted, reviewed, registered | 49 (12 from round 1, 37 from round 2) | `website/src/lib/compare/<slug>.ts` |
| Drafted, not reviewed | 53 | `website/src/lib/compare/drafts/<slug>.ts` |
| Directory entries ("More tools in this space" on `/vs`) | 76 | `website/src/lib/compare/directory.ts` |

Nothing imports `drafts/`; `svelte-check` still type-checks it. Each draft was
written from facts that an Opus verifier had already checked against live
sources, but the review pass (re-open every source, fix drift and overreach)
has not run on any of them. Round-2 reviews changed 6 to 16 statements per
page, one of them an outdated fact, so **do not publish a draft without a
review**.

## Deferred pages

"interrupted" means a review was running when the workflow stopped. It may
have left partial edits, so review those files from scratch.

| Slug | Product | Maker | Tier | Group | Review |
| --- | --- | --- | --- | --- | --- |
| `agentastic` | Agentastic | Agentastic.ai | 2 | app | not started |
| `aizen` | Aizen | Vivy Company | 2 | app | not started |
| `amp` | Amp macOS & iOS apps | Amp | 1 | vendor | interrupted |
| `antigravity` | Google Antigravity | Google | 1 | vendor | not started |
| `armada` | Armada | Magenta Creations | 2 | app | not started |
| `bellows` | Bellows | Not stated on site (GitHub org bellowsai) | 2 | app | not started |
| `capy` | Capy | Capy | 1 | vendor | interrupted |
| `codeagentswarm` | CodeAgentSwarm | CodeAgentSwarm (Arturo García) | 2 | app | not started |
| `codefleet` | CodeFleet | jrcaz | 2 | app | not started |
| `continuum` | Continuum | Continuum | 2 | app | not started |
| `crewtower` | CrewTower | Said Altan | 2 | app | not started |
| `cursor-agents` | Cursor Agents Window | Anysphere (Cursor) | 1 | vendor | interrupted |
| `devin-desktop` | Devin Desktop (formerly Windsurf) | Cognition | 1 | vendor | interrupted |
| `devswarm` | DevSwarm | 21st Idea, Inc. (DevSwarm) | 1 | app | interrupted |
| `devthrottle` | DevThrottle | thefrederiksen | 2 | app | not started |
| `ensoai` | EnsoAI | J3n5en | 2 | app | not started |
| `episko` | Episko | Respeak | 2 | app | not started |
| `factory` | Factory App | Factory | 1 | vendor | interrupted |
| `fanbox` | FanBox | alchaincyf (Huasheng) | 2 | app | not started |
| `flock` | Flock | Brandon Anderson (baahaus) | 2 | app | not started |
| `happier` | Happier | happier-dev | 2 | app | interrupted |
| `harness-desktop` | Harness | Autonomous | 2 | app | not started |
| `harnss` | Harnss | OpenSource03 (independent) | 2 | app | not started |
| `helmor` | Helmor | dohooo | 2 | app | not started |
| `herdr-gpui` | Herdr GPUI | penso | 2 | app | not started |
| `jetbrains-air` | JetBrains Air | JetBrains | 1 | vendor | interrupted |
| `kanbots` | KanBots | KanBots (leodavinci1) | 2 | app | not started |
| `lanes` | Lanes | Lanes (lanes-sh) | 2 | app | not started |
| `lody` | Lody | Lody | 2 | app | not started |
| `lpm` | lpm | lpm (gug007) | 2 | app | not started |
| `nimbalyst` | Nimbalyst | Nimbalyst (formerly Stravu, maker of Crystal) | 2 | app | not started |
| `offrun` | Offrun | Founderly, Inc. | 2 | app | not started |
| `opencove` | OpenCove | DeadWaveWave | 2 | app | interrupted |
| `pane` | Pane | Greenfield (Dcouple) | 2 | app | not started |
| `parallel-code` | Parallel Code | Johannes Millan (johannesjo) | 2 | app | not started |
| `pideck` | PiDeck | ayuayue | 2 | app | not started |
| `quack` | Quack | Alek Dobrohotov (AlekDob) | 2 | app | not started |
| `routa` | Routa | phodal | 2 | app | not started |
| `scape` | Scape | Scape (Elliot Nash) | 2 | app | not started |
| `sculptor` | Sculptor | Imbue | 2 | app | not started |
| `shepherd-terminal` | Shepherd Terminal | Junseo (Chato) Ko (kotoro) | 2 | app | not started |
| `superlite` | Superlite | Superlite | 2 | app | not started |
| `termdock` | Termdock | Termdock | 2 | app | not started |
| `trae` | TRAE (TRAE SOLO / TraeWork, now merged into the all-new TRAE) | ByteDance (TRAE) | 1 | vendor | interrupted |
| `traycer` | Traycer | Traycer AI (traycerai) | 2 | app | not started |
| `velaterm` | VelaTerm | VLINX (vlinx.io) | 2 | app | not started |
| `vibe-island` | Vibe Island | Vibe Island (Edward) | 2 | app | not started |
| `vibeworkspace` | VibeWorkspace | VibeWorkspace | 2 | app | not started |
| `vibeyard` | Vibeyard | Eliran Tutia | 2 | app | not started |
| `vscode-agents` | VS Code Agents window (GitHub Copilot) | Microsoft / GitHub | 1 | vendor | not started |
| `waku` | Waku | egoist | 2 | app | not started |
| `xirp` | Xirp | Spotify | 2 | app | not started |
| `zcode` | ZCode | Z.ai (Zhipu AI) | 1 | vendor | not started |

The product and maker columns come from discovery; the draft's own `other`
block is the checked version.

## Finishing a draft

1. Review `drafts/<slug>.ts` against its live sources: every cell, the intro,
   differences and fit. Fix drift, overreach and quotes longer than a few
   words, and move `checked` dates to the review day.
2. Move it to `website/src/lib/compare/` and change its imports from
   `'../splash.ts'` / `'../types.ts'` back to `'./…'`.
3. Import it in `compare/index.ts` and add it to `COMPARISONS` and to
   `COMPARISON_LINKS` in `site.ts`, both in slug order. `group` is `vendor`
   for an agent or IDE maker's own app, otherwise `app`.
4. `bun run check`, `bun run build` (the prerender fails on a bad citation),
   then `bun run og vs` and commit the new card.

Once `cursor-agents` is live, give it `featured: true` in `COMPARISON_LINKS`.
The chosen footer set was Claude Code Desktop, ChatGPT desktop app, Cursor,
GitHub Copilot app, Conductor and Orca; Solo stands in for Cursor until then.

## Inputs kept outside the repo

Copied from the session scratchpad to `~/.cache/splash-compare-facts/` on
this machine (not committed, 4 MB):

- `<slug>.verified.json` for each deferred page: the Opus-verified facts,
  each with source URL and quote.
- `yes.json`: the 90 round-2 targets with tier, category, stars and URLs.
- `reviews.txt`: every round-2 review report.

The drafts carry the same facts and sources, so a review can work from the
draft alone if these files are gone.

## Open items on live pages

- `munder-difflin`: the Pro launch offer ends on 2026-10-10. Recheck the
  Price row.
- `directory.ts` comes from round 1's directory verification. Round 2 reran
  it and nobody has compared the two. The Cindy summary reads "split task
  across" (grammar).
- Review notes that were left as judgment calls are listed under "Review
  notes" below.

## Lessons for the next run

- Model trial on 30 products each, all checked by an Opus verifier:

  | Model | Confirmed as worded | False "not documented" | Fabricated quotes | High-severity misses |
  | --- | --- | --- | --- | --- |
  | Haiku | 83% | 82 | 13 | 40 |
  | Sonnet | 88% | 17 | 4 | 14 |
  | Opus | 89% | 4 | 1 | 6 |

  Haiku is usable only with the verifier. Sonnet is close to Opus.
- Workflow resume caches only the longest unchanged prefix of `agent()`
  calls. Changing one early call (one model override) reran every research,
  verify and draft step after it. Pass per-item settings in a way that keeps
  earlier calls identical, or run separate workflows per stage.
- Round 2 hit the session limit once (39 drafts and 90 reviews failed).
  Run reviews in batches of about 15 pages.
- `vite preview` keeps serving old HTML after a rebuild; restart it.

## Review notes

Judgment calls and unconfirmed points from the round-2 reviews of the live
pages. None blocks publishing; each is a candidate for the next recheck.

### `opencode-desktop`

- The "Isolation per session" mark stays "yes". It rests on the v1.17.12 release notes and code: the v2 selector has no gate, and v1 prod builds hide only the new-session selector. Nobody has run a build to confirm it.
- The troubleshooting page says Desktop needs WebView2 on Windows. That looks out of date for an Electron app, so I left it off the page.
- Three cells are slightly long: GitHub and Remote access at 22 words each, and the intro at 57 words. They are accurate, so I left them.

### `codelayer`

- The Splash "Team collaboration" cell shares a 5-word run ("is a personal, single-user service") with the Splash README. That is at the limit, not over it, so I left it.
- I couldn't confirm whether the GitHub PR tab has left Experiments since 0.172.0. The cell keeps "experimental", which is the latest documented status.

### `aionui`

- **Existing agent history** stays `unknown`, with "Not documented". The verifier found no import code, so `no` would also be defensible.
- **Account required:** nobody installed the aionui.com build, so the sign-in requirement rests on the release notes and source code. The cell attributes it to the release notes.

### `cmux`

- The Cloud docs say early access (turned on for Macs in stages), but the 0.65.0 changelog says Cloud is available to everyone. The page now gives both.
- The iOS docs say early access comes with Founder's Edition, while the pricing page lists the iOS app on paid plans. The page cites pricing ("on paid plans").
- 0.65.0 added Direct SSH to the iOS app, which works without a paired Mac or a cmux account. I left it out because it isn't in the verified facts and doesn't fit neatly with "on paid plans".

### `happy`

- The Remote Server guide was rewritten on 2026-10-10. The verified quotes from the old Remote Agents page ("offers to set up gh…") are gone, but the new page supports every reworded statement.
- The Happy Agent README has also changed since verification (the resume/fork picker line is gone). None of the statements left in the file depended on it.
- The Scheduled tasks "yes" covers scheduled messages between agents, not cron or recurring jobs; the cell text says exactly what it is.

### `ccgui`

- The docs still describe a read-only "Browser Agent" for v0.9.0. I couldn't confirm it exists in v1.x, so the page no longer mentions it.
- `other.maker` stays "MossX". It is the brand on the docs and website, but no document names the legal publisher; the repo belongs to the individual account zhukunpenglinyutong.
- "Existing agent history" stays `unknown`. The README's history scanner suggests sessions started outside the app are listed, but the docs don't say so.

### `munder-difflin`

- The Pro launch offer ends today (10 October 2026). After today the Price row needs updating to $200 a year unless the offer is extended.
- The splash-server cell ("is a personal, single-user service") shares about 5 words with the Splash README. It's at the limit, and I left it to match the other pages.
- The sources disagree on whether system-wide dictation is free (README) or Pro (homepage). I avoided claiming either way.

### `automaker`

- "Automaker Core Contributors" is the copyright holder named in LICENSE. The site credits Cody Seibert (WebDevCody) as the creator. I kept the LICENSE name.
- The README's June 2026 Claude Agent SDK billing note is stale. The page doesn't repeat it, and the price and sign-in cells don't depend on it.

### `zeron`

- **`other.maker`:** left as 'zeronsh'. The site footer names "1499487 B.C. LTD." and the LICENSE names "Wing". Both are official, so the GitHub org name seemed the clearest short name.
- **Cursor and Pi permissions:** the "auto-approves agents' tool calls" claim relies on the code's stated unattended policy and on the Claude, Codex, ACP and OpenCode drivers. No source explicitly covers tool approval for Cursor or Pi.
- **Existing agent history:** left `unknown` rather than `no`, matching how other pages mark undocumented imports.

### `atlas-agents`

- **What needs you** stays partial. The homepage's cross-session Inbox appears in neither the docs nor the code I found. A notification center exists on main, but the changelog lists notifications under unreleased 0.4.0.
- **Platforms** still shows the conflicting minimum macOS versions (13+ in the README and homepage, 11+ in the install docs), as before.

### `kimi-code`

- judgment calls)**
- **Remote access stays "partial".** Remote Control is a CLI feature, and nothing documents it for the app. "no" or "unknown" would also be defensible.
- **The "How it runs agents" claim leans on internal notes.** "embedded local server… over REST and WebSocket" comes from a contributor note in the repo (`surfaces.md`) and the kap-server CHANGELOG, not from user-facing docs.
- **The GitHub row rests on a translation.** Its source is the Chinese launch post, so the cell translates it.

### `golutra`

- Memory, the stores and Feishu connectors appear only in the Details paragraphs, not as rows, because no Splash source plainly states "no memory".
- `maker` stays 'Golutra'. The site footer says Golutra Inc., but the README and LICENSE name seekskyworld.
- The bundle URL has a hashed filename and will break when Golutra redeploys.
- Permission requests, Auto-update and Existing agent history stay `unknown` because official sources don't cover them.

### `maestro`

- The docs don't say whether in-app updates cover every package type, such as portable Windows and .deb/.rpm. The Auto-update cell makes no claim about those.
- Maestro's own sources conflict on whether Cue is on by default, and its privacy page (reviewed against 0.18) conflicts with the Remote Control docs on the web token. The page states neither.

### `agent-orchestrator`

- The site says 23 to 25 agents, the docs catalog lists 35, and the repo description says "+25 more". The page shows both the docs and site counts, so this is disclosed rather than settled.
- The Files and diffs row is marked yes. No Orchestrator page documents an in-app editor; the mark relies on file browsing, diffs and the IDE links.

### `kiro-crew`

- **Existing agent history** keeps the mark "unknown". Importing sessions from other agents isn't documented, but nothing says it's officially absent either.
- **Memory:** there's still no row for Kiro Crew's cross-session memory, because no Splash source states that Splash lacks it. It's covered in the Differences and fit sections.
- kiro.dev sources still list "AWS" as publisher. The site calls itself "Kiro" and has no copyright footer, so AWS is defensible but could be changed.

### `github-copilot-app`

- The sources still conflict on cloud sessions. The docs describe them, v1.1.27 removed creating new ones, and v1.1.28 still lists a "Cloud" choice in a menu. The page states this conflict openly in the Cloud execution cell.
- v1.1.28 removed the standalone Changes tab from the Agent conversation view, but it stays in ordinary coding workspaces. The Review changes cell is still accurate.

### `supacode`

- "Neither docs nor source mention ACP" and the "not documented" absences rest on searches of the docs and code; no source states them outright.
- Publisher 'Supabit' for supacode.sh and the docs comes from the LICENSE ("Supabit, LLC"); the site itself names no company.
- The tip release page shows "11 Feb" as its publish date, although its build is from 5 September 2026. Readers checking the "Tip builds" claims may find that confusing.

### `xum`

- **Facts I added myself:** heartbeats and the Coder Runtime page are not in `xum.verified.json`. I verified both against the live docs and the coder/xum source, but no earlier verifier checked them.
- **Two "unknown" marks kept:** "Existing agent history" and "Search transcripts" stay unknown. The verifier found both "not documented" rather than officially absent, and comparable pages mark them the same way.
- **README vs docs on Windows:** the README still lists binaries for macOS and Linux only. The install docs and v0.31.0 assets include Windows x64 (alpha), and the page follows those.

### `nodeterm`

- The "Setup scripts" row is marked `yes`, but setup and archive scripts and shared paths appear only in the app's settings source, not in the docs or changelog. The dev-server port listing is in the changelog.
- "Create pull requests" is marked `no` because it isn't documented, not because nodeterm says it's absent. That matches how the other pages mark it.
- The web, video and browser nodes are described only in the README, on the homepage and in a release note; the docs' node-type list leaves them out.
- The nodeterm docs still contradict the app in a few places (four agents vs seven, Windows support, telemetry default). The page already notes the agents and Windows conflicts in its cells.

### `monocode`

- `other.maker` is still "Nick (hardbeat920)". It is short, and the LICENSE and Cargo.toml only name "Nick", so the handle is what identifies him.
- MonoCode releases almost daily. The README and docs were restructured today, so re-check the README, CHANGELOG and docs/* just before publishing.

### `synara`

- **Mark judgement:** "MCP servers" stays partial and "Existing agent history" stays partial, because import is limited to Codex, Claude Code and Droid.
- **Droid import:** it is documented only in the 0.5.2 changelog, not the current docs.
- **Publisher name:** trysynara.com sources keep "Emanuele Di Pietro" as publisher, which matches the pattern for other single-maker products (for example "Pedram Amini").

### `shikigami`

- Two cells stay unknown: "Existing agent history" and "Search transcripts". The site doesn't document either feature, but doesn't say they're absent either.
- "Create pull requests" and "GitHub" stay marked "no". The site describes no such features and llms.txt lists the git features without them, but no page says outright that they're absent.
- The update feeds suggest the app may update itself, but no page says so. I didn't add an Auto-update row.
- I couldn't run the build's source check directly: it needs Vite, and running it under Bun failed. I checked the same things by parsing the file.

### `baton`

- The home page version line ("v3.4.1 · Released 3 months ago") did not show in my headless render. The release-status cell cites the manifest, which confirms the version and date, so the cell is unaffected.
- No release note says when SSH workspaces arrived. The `yes` mark rests on the remote-workspaces page, the privacy policy, the Terms and the CLI page all describing it.
- The mobile/remote-control status contradicts itself across Baton's own pages ("Coming soon" on the home page, described as working in the privacy policy). It is marked `partial` and the cell says where each claim comes from.

### `zenflow`

- not errors in the file):**
- The Remote Hosts doc asks for Zenflow 2.5.1 or later, but the changelog ends at v2.3.4 (26 August 2026). The page states both sides as they are.
- How Zenflow talks to the agent CLIs is not documented, and the page says so.

### `piebald`

- There is no row for the HTTP traffic inspector, hooks or goals. Piebald has them and Splash doesn't, but no Splash source states that, so they stay in the summary and differences only.
- Other pages mark plan-gated features inconsistently, some partial and some yes. I applied the rule that a feature which is documented and available is yes.
- The issue-tracker repo README and issues #26 and #31 weren't part of the n-gram copy check. I checked those cells by eye.

### `poolside`

- The `partial` mark on Create pull requests is a judgement call; `no` would also be defensible if you prefer.
- The "Release status" cell says the app launched on 28 July 2026, while the GitHub release v1.6.0 calls itself "Initial release" on 2 October. Both are sourced, but readers may find the gap odd.

### `bb`

- The Files and diffs and Auto-update rows rely on sources that aren't in `bb.verified.json`. I confirmed them myself today.
- bb's retry after usage limits (f39) and its experimental Account Pooler (f19) have no row. No Splash source states that Splash lacks them, so I couldn't write a sourced Splash cell.
- `other.maker` stays "Michael Yong", the LICENSE copyright holder. The site names no company, and the privacy contact is a terragonlabs.com address.
- Fit lists are four items each and positive.

### `augment-intent`

- The maker is not named on intentapp.dev. "SHV Labs" rests on the App Store listing and SHV Labs' Projects page.
- Whether the shipped desktop app approves tool requests automatically is inferred from the source and was not tested by running the app.
- Fact f4 in the verified file wrongly calls the numbered pre-releases beta builds. I fixed the page, not the verified file.

### `cate`

- The Product Hunt "Free" label is confirmed only through a WebFetch summary. The raw page was blocked.
- Whether Antigravity is actually enabled in Cate's chat panel wasn't checked by running the app. The cell attributes it to the README.
- The Cate privacy page is partly stale (it still calls 1.3.0 the latest build). The page doesn't use that part.

### `zed-delta`

- "Existing agent history" stays `unknown`. Every source I checked is silent on importing other tools' transcripts, and Zed's August 2026 launch post described syncing Claude Code sessions live into Delta. Other compare pages use `unknown` for "Not documented" in the same way.
- "Splash has no accounts" in the "Where code and data live" paragraph repeats `S.account`, but the README never says it outright.
- The two Delta docs pages that disagree on whether bring-your-own-key requests go through Zed Cloud aren't mentioned on the page.

### `polyscope`

- "Existing agent history" and "Search transcripts" stay marked unknown because Polyscope's docs don't mention either feature. Most other comparison pages use unknown for "not documented".
- The "Agents handing off work" row keeps its own hint ("One session passing work or context to another") instead of the usual one. The "yes" mark depends on that hint: Polyscope's handoffs work through Autopilot, Opinions and linked workspaces, not one agent launching another.

### `org-2`

- Publisher for the org2.ai pages is left as "ORG2 AI", the GitHub org's display name and the maker. The site's footer says "ORG-2".
- Permission requests stays partial. The docs say ACP agents' approvals show up as ORG-2 prompts, but that CLIs, Copilot included, launch pre-approved. I did not try to reconcile the two in the cell.

### `agentgrid`

- Cloud agents are listed in the Pro plan but described nowhere, so that row stays `unknown`.
- Desktop notifications aren't documented for AgentGrid, so I didn't add a notifications row.
- Housekeeping: I downloaded pages into an existing scratchpad folder, `scratchpad/ag/`, and my text conversion rewrote some `.txt` files left there by an earlier run (only regenerated from that run's own HTML). It doesn't affect the repository.

### `verdent`

- **Older docs:** the security policy (Nov 2025) predates BYOK and BYOA. It is now quoted with attribution, but its "most Desktop requests" wording may not reflect current routing.

