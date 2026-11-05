---
name: sdd
description: "Software Design Document. Interviews the user to capture requirements, then generates or updates docs/SDD.md."
---

# SDD — Software Design Document

Invoked via `/sdd` before starting a new feature or sprint. Creates or updates `docs/SDD.md`.

## When to use

- Before any Large task (per orchestrator classification)
- At the start of a new feature that spans multiple files or introduces new data models
- When requirements are ambiguous and need to be pinned down before code is written

## Process

### Step 1 — Interview

Use the interview template at `sdd/interview-template.md`. Ask questions one group at a time — don't dump all questions at once. Adapt based on answers.

### Step 2 — Draft the SDD

After the interview, write `docs/SDD.md` using this structure:

```markdown
# SDD: <Feature Name>

**Version:** 1.0
**Date:** YYYY-MM-DD
**Status:** Draft | Active | Superseded

## Summary

One paragraph: what this feature is, who it's for, and why it's being built.

## Requirements

### Must have
- <requirement>

### Should have (if time allows)
- <requirement>

### Out of scope
- <explicitly excluded>

## Technical Design

### Data model changes
<DB columns or schema changes, or "none">

### IPC / API surface
<new channels or endpoints, with payload shapes>

### Component / module changes
<what files are touched and how>

### Edge cases
<known edge cases and how they're handled>

## Open questions
<unresolved decisions — resolve before coding begins>

## Acceptance criteria
<how to verify this is done — testable statements>
```

### Step 3 — Confirm before coding

Present the SDD to the user. Get explicit confirmation before writing any code. "Looks good" is sufficient.

## Rules

- SDD is a living document — update it when scope changes during implementation.
- ADRs reference the SDD; the SDD references ADRs by number.
- Never start a Large task without a confirmed SDD.
