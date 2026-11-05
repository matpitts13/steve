---
name: senior-design-gate
description: "Pre-code gate for large tasks. Checks that the approach is sound before writing any code."
---

# Senior: Design Gate

Invoked by `orchestrator` before large tasks. Must pass before code is written.

## Checklist

Work through each item. If any item is uncertain, resolve it before proceeding.

### 1. Scope clarity
- Can you state the goal in one sentence without ambiguity?
- Are there unstated assumptions? List them and verify with context or the user.

### 2. Data model impact
- Does this change the DB schema? If so, is the migration additive-only?
- Does this change any TypeScript types shared across main/renderer boundary? Update the IPC contract first.

### 3. IPC contract
- Are new IPC channels introduced? Document them in the channels file before implementing.
- Are existing channel payload shapes changing? Flag all callers for update.

### 4. Dependency check
- Does this require a new npm package? Pause and invoke `senior-dependency-gate` before adding it.

### 5. Existing pattern fit
- Does the codebase already have a pattern for this? Use it. Don't introduce a parallel approach.
- Check `docs/SDD.md` if it exists for design decisions that constrain this area.

### 6. Test surface
- What tests will verify this works? If none are planned, state why.
- If this changes existing behavior, which existing tests will break?

### 7. Rollback
- Can this be reverted cleanly? If not, document what's irreversible.

## Output

After the checklist: one paragraph stating what you're about to build and why the approach is sound. If any item flagged a concern, state it explicitly and how it was resolved.

## Never

- Skip the design gate because the task "seems straightforward."
- Start coding before all checklist items are resolved.
