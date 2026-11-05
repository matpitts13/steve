---
name: autotest
description: "Automated test generation and execution. Generates Vitest + Playwright tests, runs them, fixes failures, and parks flaky tests to TECH_DEBT.md."
---

# Autotest

Invoked via `/autotest`. Generates, runs, and maintains the test suite.

## Load first

Read `testing-philosophy` before running for the first time in a repo. Sets the foundation for what to test and how.

Also read `autotest/philosophy.md` (extended notes) and `autotest/harness.md` (project-specific harness setup).

## File placement rules

- **`tests/autotest/`** — generated tests. Overwritten on every `/autotest` run. Never hand-edit these.
- **`tests/`** — hand-crafted tests. **Never touched by autotest.**
- **`*.test.ts` adjacent to module** — unit tests. Autotest may generate these but only for modules with zero existing tests.

## Resolving the test command

Use `npm run test` / `npm run test:e2e` (the project's own `package.json` scripts), not bare `npx vitest run` / `npx playwright test` — `npx` can resolve a mismatched global version and fail with errors like "Vitest failed to find the runner" even when the suite is actually green.

## Snapshot before starting

```
git branch steve-backup/YYYY-MM-DD-HHmm
```
Mention the branch name once. Do not push.

## Step 1 — IPC contract pre-pass (Vitest)

Before any Playwright tests, write Vitest tests for all IPC channels:
- Test that each channel accepts valid input and returns the expected shape.
- Test that each channel rejects invalid input gracefully (no crashes, sensible error response).
- Use real in-memory SQLite. No mocks.

Run: `npm run test -- tests/autotest/ipc/`

Fix failures before proceeding. If a failure can't be fixed in 2 attempts → park it (see Parking Rules).

## Step 2 — Unit tests (Vitest)

For each pure function / utility with no existing test:
1. Identify from `src/` (use Grep to find exported functions with no `*.test.ts` adjacent).
2. Generate test file: `tests/autotest/unit/<module>.test.ts`.
3. Test happy path + 2 edge cases minimum.

Run: `npm run test -- tests/autotest/unit/`

## Step 3 — Playwright golden paths

One Playwright test per user-visible feature, testing the happy path only.

Rules:
- Test via the actual Electron app — no DOM mocking.
- Each test is independent: create its own project/document state, clean up after.
- Maximum 3 new Playwright tests per `/autotest` run — don't write tests for the whole app at once.
- All generated tests go in `tests/autotest/e2e/`.

Run: `npm run test:e2e -- tests/autotest/e2e/`

## Step 4 — Flaky detection

Run the full autotest suite **twice** identically. If a test fails on run 1 but passes on run 2: it's flaky.

- First failure → mark as SUSPECT, run again.
- Fails both → real failure. Fix it.
- Passes on retry → FLAKY. Park it.

## Step 5 — Fix loop

For each failing test:
1. Read the failure output.
2. State one hypothesis.
3. Fix or update the test.
4. Run again.
5. Two failed attempts → park it (see Parking Rules).

Never update a test to make it pass if the underlying behavior is broken — fix the code, or park the test with a TECH_DEBT entry explaining the real issue.

## Parking rules

When a test can't be fixed in 2 attempts:
1. Add `it.skip(...)` to the test with a comment: `// PARKED: <reason> <date>`
2. Add to `TECH_DEBT.md` under "PARKed: Tests"
3. Write to `TEST_FIX_STATE.md` if this is an active fix session

## Session checkpoint

After each step, update `TEST_FIX_STATE.md`. This file survives context compaction.

## Actual recommendations

After the test run, generate a short "Testing Health" report:

```markdown
## Testing Health — YYYY-MM-DD

### Coverage
- IPC handlers: N/M covered
- Pure functions: N/M covered  
- E2E golden paths: N features covered

### Findings
- <specific observation about gaps or risks>

### Recommendations
- <honest advice about what to test next and why>
- <flag if a feature is completely untested and the risk that poses>
```

Be honest. If a critical feature has zero tests, say so and explain the risk — don't soften it.
