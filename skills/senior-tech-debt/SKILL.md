---
name: senior-tech-debt
description: "Tracks, surfaces, and triages tech debt. Writes to TECH_DEBT.md. Used when deferring fixes or when the user asks for a debt review."
---

# Senior: Tech Debt

Invoked when deferring a known issue, when asked to review accumulated debt, or when `/autotest` parks a failing test.

## When to invoke

- Deferring a bug fix that can't be addressed now
- Parking a flaky or failing test (from `autotest`)
- The user asks "what's our tech debt?" or similar
- After a sprint to capture what was left unresolved

## TECH_DEBT.md format

Write to the project root. Append to existing file if present; create if not.

```markdown
# Tech Debt

Last updated: YYYY-MM-DD

## Critical (blocking next release)
- [ ] `<issue>` — <impact>. Added <date>. Unblocked by: <condition>.

## High (should fix this sprint)
- [ ] `<issue>` — <impact>. Added <date>.

## Medium (fix when nearby)
- [ ] `<issue>` — <context>. Added <date>.

## Low / Cosmetic
- [ ] `<issue>`. Added <date>.

## PARKed: Tests
- `<test name>` — FLAKY: <description>. Tracked <date>.
- `<test name>` — SKIP: <reason>. Tracked <date>.

## Resolved (archive)
- [x] `<issue>` — fixed in <commit/PR>. <date>.
```

## Triage rules

- **Critical**: data loss risk, security hole, or blocker for shipping
- **High**: user-visible bug or broken dev workflow
- **Medium**: technical correctness issue that doesn't affect end users today
- **Low**: cleanup, naming, minor inconsistency

## Never

- Delete debt items without resolving them — move to Resolved with a commit reference.
- Add debt without a severity label and a date.
