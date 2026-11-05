# /ship

Gate + commit + push for the current task. Orchestrated path.

## What this does

Runs in order:
1. `code-review` skill — reviews the current diff
2. If the change touches auth, file handling, or inter-process messaging: `senior-security` skill
3. If those pass: `test-strategy` skill at medium depth, or large depth for a large change
4. If tests pass: `commit-sync` skill — stages, commits with conventional message, syncs, pushes

## Usage
```
/ship
/ship "optional message override"
```

## When to use

After completing a feature or fix and wanting to merge-ready it. This is the full gate — prefer `/commit` for quick saves during development.

## Stops when

- Code review or the security check finds a FAIL item → fix it, then re-run `/ship`
- Tests fail → fix them, then re-run `/ship`
- Sync conflicts → reports the conflict, stops for manual resolution
