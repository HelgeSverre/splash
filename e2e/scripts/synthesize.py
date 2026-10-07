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
    for i, u in enumerate(updates, 1):
        rows.append({"t": t + i * 40, "dir": "in", "line": {"jsonrpc": "2.0", "method": "session/update",
                                                            "params": {"sessionId": SID, "update": u}}})
    rows.append({"t": t + (len(updates) + 1) * 40, "dir": "in",
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


write("plan_edit", PLAN_EDIT)
