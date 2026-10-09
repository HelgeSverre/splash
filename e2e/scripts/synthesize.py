#!/usr/bin/env python3
"""Write the synthesized recordings in fixtures/e2e/ that the browser tests replay.

Each starts from Claude Code's real handshake (fixtures/claude/read.jsonl) and
scripts one turn. Paths use $CWD, which fake-acp replaces with the session's
folder. Run from anywhere: python3 e2e/scripts/synthesize.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CLAUDE = [json.loads(l) for l in (ROOT / "fixtures/claude/read.jsonl").read_text().splitlines() if l.strip()]
SID = next(r["line"]["result"]["sessionId"] for r in CLAUDE if "configOptions" in (r["line"].get("result") or {}))

# The repository every test starts from (e2e/support/git.ts).
CALC = "def add(a, b):\n    return a + b\n\n\ndef subtract(a, b):\n    return a - b\n"


def handshake():
    """initialize and session/new, exactly as recorded."""
    out = []
    for r in CLAUDE:
        if r["dir"] == "out" and r["line"].get("method") == "session/prompt":
            return out
        out.append(r)
    raise SystemExit("no prompt in the Claude recording")


def turn(prompt, updates, stop="end_turn", t=10_000):
    rows = [{"t": t, "dir": "out", "line": {"jsonrpc": "2.0", "id": "prompt-1", "method": "session/prompt",
                                             "params": {"sessionId": SID, "prompt": [{"type": "text", "text": prompt}]}}}]
    # An update comes 40 ms after the previous one, or (ms, update) for a longer
    # gap (kept when a test replays at recorded speed: world.agents.speed(agent, 1)).
    for u in updates:
        gap, u = u if isinstance(u, tuple) else (40, u)
        t += gap
        rows.append({"t": t, "dir": "in", "line": {"jsonrpc": "2.0", "method": "session/update",
                                                   "params": {"sessionId": SID, "update": u}}})
    rows.append({"t": t + 40, "dir": "in",
                 "line": {"jsonrpc": "2.0", "id": "prompt-1", "result": {"stopReason": stop}}})
    return rows


def say(text):
    return {"sessionUpdate": "agent_message_chunk", "content": {"type": "text", "text": text}}


def think(text):
    return {"sessionUpdate": "agent_thought_chunk", "content": {"type": "text", "text": text}}


def plan(*steps):
    return {"sessionUpdate": "plan", "entries": [{"content": c, "priority": "medium", "status": s} for c, s in steps]}


def edit(call, title, path, old, new, status):
    diff = {"type": "diff", "path": f"$CWD/{path}", "oldText": old, "newText": new}
    u = {"sessionUpdate": "tool_call" if status == "pending" else "tool_call_update", "toolCallId": call,
         "status": status, "content": [diff]}
    if status == "pending":
        u.update(title=title, kind="edit", locations=[{"path": f"$CWD/{path}", "line": 7}])
    return u


MULTIPLY = CALC + "\n\ndef multiply(a, b):\n    return a * b\n"
TESTS = "from calc import multiply\n\n\ndef test_multiply():\n    assert multiply(2, 3) == 6\n"

PLAN_EDIT = handshake() + turn("Add a multiply function with a test", [
    think("The user wants multiply next to add and subtract. "),
    think("I'll add it to calc.py and cover it with a test."),
    plan(("Read calc.py", "completed"), ("Add multiply to calc.py", "in_progress"), ("Add a test", "pending")),
    edit("edit-1", "Edit calc.py", "calc.py", CALC, MULTIPLY, "pending"),
    edit("edit-1", "Edit calc.py", "calc.py", CALC, MULTIPLY, "completed"),
    plan(("Read calc.py", "completed"), ("Add multiply to calc.py", "completed"), ("Add a test", "in_progress")),
    edit("edit-2", "Write test_calc.py", "test_calc.py", None, TESTS, "pending"),
    edit("edit-2", "Write test_calc.py", "test_calc.py", None, TESTS, "completed"),
    plan(("Read calc.py", "completed"), ("Add multiply to calc.py", "completed"), ("Run the tests", "in_progress")),
    say("I added `multiply` to `calc.py` and a test for it in `test_calc.py`."),
    {"sessionUpdate": "usage_update", "used": 31000, "size": 200000, "cost": {"amount": 0.21, "currency": "USD"}},
])


def write(name, rows):
    path = ROOT / "fixtures/e2e" / f"{name}.jsonl"
    path.write_text("".join(json.dumps(r, separators=(",", ":")) + "\n" for r in rows))
    print(path.relative_to(ROOT))


# A reply with three kinds of diagram and one fence mermaid can't parse. The
# first fence arrives in two chunks with a 4 s pause between them: while it is
# open, the transcript must show it as code, not a half-drawn diagram.
FLOW_OPEN = (
    "Here is the path a prompt takes through Splash, from the composer to the agent and back.\n\n"
    "```mermaid\nflowchart LR\n"
    '  C["Composer"] --> S["Session store"]\n'
    '  S --> A{"Agent running?"}\n'
)
FLOW_CLOSE = (
    '  A -->|"yes"| P["session/prompt over ACP"]\n'
    '  A -->|"no"| L["Launch the adapter"]\n'
    "  L --> P\n"
    '  P --> U["session/update stream"]\n'
    '  U --> T["Transcript"]\n'
    "```\n\n"
)
SEQUENCE = (
    "Each turn is one request with streamed updates:\n\n"
    "```mermaid\nsequenceDiagram\n"
    "    participant U as User\n"
    "    participant S as Splash\n"
    "    participant A as Agent (ACP)\n"
    "    U->>S: prompt\n"
    "    S->>A: session/prompt\n"
    "    A-->>S: agent_message_chunk, repeated\n"
    "    A-->>S: tool_call, tool_call_update\n"
    "    S-->>U: transcript entries\n"
    "    A-->>S: result: end_turn\n"
    "```\n\n"
)
STATES = (
    "And the states a session moves through:\n\n"
    "```mermaid\nstateDiagram-v2\n"
    "    [*] --> starting\n"
    "    starting --> idle: session/new\n"
    "    idle --> running: prompt sent\n"
    "    running --> awaiting_permission: permission request\n"
    "    awaiting_permission --> running: answered\n"
    "    running --> idle: end_turn\n"
    "    running --> exited: agent died\n"
    "    exited --> [*]\n"
    "```\n\n"
)
BROKEN = (
    "One mermaid cannot parse, so its source shows instead:\n\n"
    "```mermaid\nflowchart LR\n  A --> B -->\n```\n\n"
    "That is the whole loop."
)

MERMAID = handshake() + turn("Draw how a prompt gets from the composer to the agent", [
    say(FLOW_OPEN),
    (4000, say(FLOW_CLOSE)),
    say(SEQUENCE),
    say(STATES),
    say(BROKEN),
    {"sessionUpdate": "usage_update", "used": 28000, "size": 200000, "cost": {"amount": 0.18, "currency": "USD"}},
])


write("plan_edit", PLAN_EDIT)
write("mermaid", MERMAID)
