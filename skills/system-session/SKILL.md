---
name: system-session
description: "Session management: checkpoint files, state handoff, and recovery patterns for long or interrupted tasks."
---

# System: Session

Patterns for persisting task state across context compaction or session restarts.

## When to use checkpoints

- Long multi-step tasks (>10 distinct operations)
- `/autotest` runs
- Any task that may hit context compaction before completion

## Checkpoint file: `TEST_FIX_STATE.md`

Used by `/autotest` and long debug sessions. Written to the project root.

Format:
```markdown
# TEST_FIX_STATE

Last updated: YYYY-MM-DD HH:mm
Task: <one-line description>

## Status
- [x] Step 1 — completed
- [x] Step 2 — completed
- [ ] Step 3 — in progress
- [ ] Step 4 — pending

## Active context
<2-3 lines: what was last done, what's next, any gotchas>

## Blocked
<empty if unblocked, else: what's blocking and what's needed>
```

## Handoff protocol

If context compaction occurs mid-task:
1. Write or update `TEST_FIX_STATE.md` before compaction.
2. On resume, read `TEST_FIX_STATE.md` first — don't re-derive state from scratch.
3. Pick up from the last unchecked step.

## TECH_DEBT.md

PARKed items (unresolved autotest failures, deferred fixes, known regressions) flow into `TECH_DEBT.md` at the project root.

Format:
```markdown
# TECH DEBT

## PARKed: Autotest
- `<test name>` — FLAKY: <description>. Tracked <date>.
- `<test name>` — SKIP: <reason>. Tracked <date>.

## Deferred fixes
- <issue>: <context>. Deferred <date>, unblocked by <condition>.
```

## Never

- Write checkpoint files to `~/.claude/` — they belong in the project root where they're visible to the team.
- Delete `TEST_FIX_STATE.md` after a task completes — archive it to git instead so the history is preserved.
