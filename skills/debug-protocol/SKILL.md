---
name: debug-protocol
description: "Structured debugging: reproduce → isolate → hypothesize → fix → verify. Each attempt states its hypothesis before touching code."
---

# Debug Protocol

Invoked by orchestrator when a task is primarily a bug fix, or manually for a stuck problem.

## Process

**Step 1 — Reproduce**
Confirm the bug is reproducible. State the exact condition: input, state, sequence of actions. If it can't be reproduced, stop and say so — don't guess-fix.

**Step 2 — Isolate**
Narrow the failure surface. Use language tooling or a targeted search to find what calls the suspect code. Read only the files in the call path. Don't read the whole codebase.

**Step 3 — Hypothesize**
State one hypothesis in one line before changing any code:
> "Hypothesis: the IPC listener is being registered twice due to React StrictMode remounting, causing the handler to fire twice."

**Step 4 — Fix**
Make the minimal change that addresses the hypothesis. Don't fix adjacent things.

**Step 5 — Verify**
Run the reproduction case. Run the test suite. Confirm the fix doesn't break existing tests.

## Two-strike rule

Canonical version in the Steve section of `CLAUDE.md`. Concrete trigger here: 2 distinct hypotheses/fixes that don't solve the problem → STOP, summarize what each revealed, list ranked next options, wait for direction.

## Never

- Change code without stating a hypothesis first.
- Fix multiple things in one attempt (contaminates the hypothesis).
- Mark a bug fixed without running a verification step.
