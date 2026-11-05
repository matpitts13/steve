---
name: testing-philosophy
description: "Opinionated testing guidance for this project. Loaded by test-strategy on first use in a new repo. Sets the foundation before writing any tests."
---

# Testing Philosophy

Read this before writing the first test in a new project, or when `/autotest` is first run.

## What tests are for

Tests are a **safety net**, not a proof of correctness. Their job is to catch regressions, not to document every behavior. Write tests for things that have broken before, things you're uncertain about, and things that would be painful to discover broke in production.

## Test pyramid

```
         /\
        /  \  E2E (Playwright)
       /    \  — user-visible flows, golden paths only
      /------\
     /        \  Integration (Vitest + real DB)
    /          \  — IPC handlers, service layer, DB migrations
   /------------\
  /              \  Unit (Vitest)
 /________________\  — pure functions, utils, transformations
```

- **Unit**: pure functions only. If a function has side effects, it's not a unit test target — it's an integration test.
- **Integration**: IPC handlers tested with real in-memory SQLite (not mocked). Service layer tested with real file system when possible.
- **E2E**: golden path only. Don't recreate integration tests at the E2E layer. One happy path per feature.

## What NOT to test

- Implementation details. Test the output, not how the output was computed.
- The framework itself (Electron, React, SQLite). Trust them.
- Things that can't realistically fail. Not every getter needs a test.
- CSS / visual layout — use the app for that.

## Real dependencies, not mocks

The #1 cause of test suites that pass but apps that break: mocked database, mocked file system, mocked IPC.

- Use real in-memory SQLite for DB tests (it's fast enough).
- Use real temp directories for file tests.
- Use real Electron IPC in Playwright tests.
- Mock only: external HTTP APIs, OS-level dialogs, the system clock.

## Cross-OS filename rules

Enforce Windows-hostile characters in filename validation on ALL platforms (not just Windows):
```
< > : " / \ | ? *
```
If a user can do it, they will. Test this on every platform.

## Flaky tests

A test that fails intermittently is **worse than no test** — it trains you to ignore failures.

- Two-strike rule: if a test fails twice in a row in CI, it's a real failure. If it passes on the second identical run, it's flaky.
- Flaky tests must be fixed or explicitly `skip`-ed with a TECH_DEBT entry. Never leave them in `it.only` or commented out.

## Test file locations

- `tests/autotest/` — generated tests from `/autotest`. Overwritten on each run. Don't hand-edit.
- `tests/` (root) — hand-crafted tests. Never overwritten by autotest. These are the source of truth.
- `*.test.ts` / `*.spec.ts` — unit tests adjacent to the module they test.
