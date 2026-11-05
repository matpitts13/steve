---
name: code-review
description: "Pre-commit gate. Reviews diff for correctness bugs, security, broken contracts, missing error handling. Returns pass/fail bullet list."
---

# Code Review

Invoked by orchestrator after medium/large tasks, and directly via `/review`.

## Review checklist

- **Correctness** — logic bugs, off-by-one, null dereferences, missing awaits, wrong branching
- **Security** — secrets/tokens in diff, injection vectors, unsafe Electron IPC (nodeIntegration on, contextIsolation off), unvalidated input at system boundaries, unsafe child_process usage
- **Contracts** — IPC channel type mismatches, changed signatures without caller updates, missing return values
- **Error handling** — swallowed exceptions, missing error paths, unhandled promise rejections, no catch on async calls
- **New packages** — flag any new dep for senior-dependency-gate before approving

## What NOT to flag

- Code style or formatting (formatter handles this)
- Comment presence or absence, unless the project has its own rule
- Naming preferences unless genuinely ambiguous

## Delegation

For medium/large diffs: delegate to the `reviewer` subagent for fresh-eyes analysis free of implementation bias. Small diffs: review inline.

## Output format

```
PASS / FAIL

- [PASS] No secrets in diff
- [FAIL] editor/Editor.tsx:47 — promise not awaited; unhandled rejection in IPC handler
- [PASS] All catch blocks handle or rethrow with context
```

Any FAIL blocks commit. Fix, re-run review, then proceed.
