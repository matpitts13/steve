# Autotest: Extended Philosophy

## Why generated tests overwrite

Generated tests in `tests/autotest/` are regenerated fresh on each `/autotest` run. This prevents accumulation of stale tests that no longer reflect the current code. The hand-crafted tests in `tests/` are the long-lived source of truth — autotest is a sweep, not a maintainer.

## The IPC pre-pass exists because UI tests lie

Playwright tests pass when the UI renders correctly. But a UI can render fine while the underlying IPC handler is silently returning wrong data. The IPC pre-pass catches broken contracts before they show up as mysterious E2E failures.

## Why we run the suite twice for flaky detection

A test suite that "sometimes passes" trains developers to ignore red builds. The two-run protocol catches flakiness before it becomes a habit. Flaky tests are worse than no tests.

## Why we don't mock the database

Mocked databases pass tests with SQL that would fail in production. SQLite in-memory runs the real SQL engine — it catches migration errors, column type mismatches, constraint violations, and query bugs. It's also fast (100-500ms per test suite).

## On coverage metrics

Coverage % is a vanity metric without context. 80% coverage that tests only happy paths is weaker than 40% coverage that tests the error handling and edge cases that users actually hit. Focus coverage on:
1. IPC handlers (high blast radius if broken)
2. Data transformation functions (bugs are invisible until they corrupt data)
3. Any function that handles user input (the user will find every edge case)

## On E2E test count

More E2E tests = more flakiness, more maintenance, slower CI. Keep the Playwright suite to golden paths only. If you find yourself writing Playwright tests to verify a single function's behavior, move that test to Vitest instead.

## The parking rule is a feature

Parking a test is not giving up — it's being honest that the failure is either non-deterministic, depends on an external condition, or requires a code fix that isn't in scope right now. A parked test with a TECH_DEBT entry is better than a disabled test with no explanation.
