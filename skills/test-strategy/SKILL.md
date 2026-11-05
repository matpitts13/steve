---
name: test-strategy
description: "Decides and runs the right test depth for the task size. Creates tests for new logic on medium/large tasks."
---

# Test Strategy

Invoked by orchestrator after code is written. Depth scales with task size.

## Load first

On first use in a new repo, load `testing-philosophy` skill to set the right foundation before building anything.

## Depth by size

The commands below are for Node projects. On another stack, run the equivalent lint, typecheck, test, build and dependency-audit commands from the project's own scripts or CI config.

**Small** — lint + typecheck only. One line: "Small change — skipping test run."
```bash
npx tsc --noEmit
npx eslint src --max-warnings 0
```

**Medium** — run existing suite. Create tests for any new logic lacking coverage.
```bash
npm run test
```

**Large** — full suite + build verification + `npm audit`.
```bash
npm run test
npm run build
npm audit --audit-level=high
```

## Resolving the test command

`npm run test` (not `npx vitest run`) — `npx` can resolve a globally installed Vitest that mismatches the project's pinned version, producing false failures like "Vitest failed to find the runner" even when the suite is green. Always run the project's own `package.json` scripts. If a project has no `test` script, check `package.json` for the actual runner before falling back to `npx`.

## Creating tests

When new logic has no coverage on a medium/large task:
1. Detect framework from `package.json` (Vitest preferred, Jest fallback).
2. Write test file alongside the module (`*.test.ts` or `*.spec.ts`).
3. Test pure functions directly; test handlers and APIs at the unit or integration level, not through the UI.
4. Test the contract (input → output), not the implementation.

## On-screen verification (UI changes, medium/large)

Green tests don't prove the user's workflow works. When the task changes anything a user sees or clicks:
1. Launch the app using the project's dev command.
2. Reproduce the user's actual scenario step by step — the one from the request, not a happy path you chose.
3. Screenshot the result and look at it before reporting done. Use the project's browser or UI test driver if it has one.
4. If the app can't be launched in this session, say so explicitly — never imply it was verified.

## Never

- Skip tests on medium/large tasks without saying so explicitly.
- Report a UI change as working based on tests alone.
- Mock the database when a real or in-memory one is practical.
- Write slow end-to-end tests for things a unit test can cover.
