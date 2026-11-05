# /autotest

Generate and run automated tests for the current project.

## Usage
```
/autotest               # full run: IPC pre-pass → unit → E2E → flaky detection
/autotest --ipc         # IPC contract tests only
/autotest --unit        # unit tests only
/autotest --e2e         # Playwright E2E tests only
/autotest --fix         # attempt to fix existing failing tests (no generation)
/autotest --report      # show Testing Health report without running
```

## What this does

Invokes the `autotest` skill:

1. Reads `testing-philosophy` and `autotest/philosophy.md` for foundation
2. Takes a backup branch: `steve-backup/YYYY-MM-DD-HHmm`
3. Runs IPC pre-pass (Vitest, real SQLite)
4. Generates unit tests for uncovered pure functions
5. Generates Playwright E2E golden paths (max 3 new tests per run)
6. Runs full suite twice for flaky detection
7. Parks unresolvable failures to `TECH_DEBT.md`
8. Updates `TEST_FIX_STATE.md` checkpoint
9. Outputs Testing Health report

## Important notes

- Tests generated in `tests/autotest/` are always overwritten
- Hand-crafted tests in `tests/` are never touched
- Run after a sprint or before a release to verify coverage
