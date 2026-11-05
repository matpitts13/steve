---
name: orchestrator
description: "Routing brain for multi-step tasks. Classifies size, plans, executes sub-skills in order, verifies, and hands off to commit-sync."
---

# Orchestrator

Auto-triggered on any task spanning >1 file or >1 concern. Skip entirely for trivial one-file edits — just do them.

## Workflow

1. **Restate** the goal in one line.
2. **Classify** size:
   - **Small** — ≤3 files, single concern, no new deps
   - **Medium** — multi-file feature/refactor, existing patterns
   - **Large** — new architecture, new deps, data model changes, IPC contracts
3. **Plan** — terse numbered checklist. Skip for small.
4. **Execute** — call the `Skill` tool for each required sub-skill in sequence. Do not write code before pre-code gates complete.
5. **Verify** — call `Skill` tool with `skill: "test-strategy"`.
6. **Commit** — call `Skill` tool with `skill: "commit-sync"`.

> **Hard rule:** Every gate in the table below must be completed via an actual `Skill` tool call. Do not apply gates inline or skip them.

## Gates by size

| Size | Pre-code | Tests | Post-code |
|------|----------|-------|-----------|
| Small | — | lint + typecheck | commit-sync |
| Medium | — | full suite + new tests | code-review → commit-sync |
| Large | senior-design-gate + senior-estimation | full suite + build + security scan | senior-adr + code-review → commit-sync |

## Trigger-based gates (any size, in addition to the size gates above)

These fire based on what the task touches, independent of Small/Medium/Large classification — call the `Skill` tool for each, same as the size gates:

- **Touches IPC, auth, or file I/O** → `senior-security`, before commit-sync. (The Large-tier "security scan" in the table above is the full audit; this is the lighter always-on check for Small/Medium work in these areas.)
- **Task is primarily a bug fix** → `debug-protocol` instead of freeform investigation.
- **Any task that writes code** → load `language-rules` (via `stack-detect` if the stack isn't already obvious) before writing it.

## SDD

If `docs/SDD.md` exists, read it before any medium/large task. Flag contradictions before writing code.

## Two-strike rule

Canonical version in the Steve section of `CLAUDE.md` — applies here unchanged, including to individual sub-skill steps.

## Snapshot before large work

Before large tasks or `/autotest` runs: `git branch steve-backup/<YYYY-MM-DD-HHmm>` (local only). Mention the branch name once.

## Research delegation

For tasks requiring significant library doc reading or unfamiliar code exploration, delegate to the `researcher` subagent. Pass a compressed summary back into the main session.
