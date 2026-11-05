---
name: senior-adr
description: "Architecture Decision Record. Documents a significant design decision with context, options, rationale, and consequences."
---

# Senior: Architecture Decision Record (ADR)

Invoked by `orchestrator` after large tasks, or directly when a significant design decision was made.

## When to write an ADR

- New architecture, data model, or IPC contract introduced
- Existing pattern deliberately broken (with good reason)
- A third-party library was added or removed
- A major performance or security trade-off was accepted

## ADR format

Write to `docs/adr/NNNN-short-title.md`:

```markdown
# ADR NNNN: Short Title

**Date:** YYYY-MM-DD
**Status:** Accepted | Superseded by ADR-XXXX | Deprecated

## Context

What problem were we solving? What constraints existed? What was the triggering event?

## Options considered

1. **Option A** — brief description. Pros: X. Cons: Y.
2. **Option B** — brief description. Pros: X. Cons: Y.

## Decision

We chose Option A because [one clear reason].

## Consequences

- Positive: [what this enables]
- Negative / trade-offs: [what this costs or defers]
- Follow-up required: [open questions or future work]
```

## Rules

- One decision per ADR. Split if multiple decisions were made.
- Consequences section is mandatory — don't skip it.
- If this decision supersedes a prior ADR, update the prior ADR's status line.
- ADRs are immutable once accepted — amend by writing a new one that supersedes the old.

## Never

- Write an ADR for routine implementation choices (how to name a variable, minor refactors).
- Omit the "Options considered" section — the reasoning for *not* choosing alternatives is often the most valuable part.
