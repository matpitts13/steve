# /status

Show the current project health summary.

## What this does

Runs in order and prints a consolidated report:

1. **Git status** — clean/dirty, current branch, commits ahead/behind remote
2. **Typecheck** — the project's typecheck command, if it has one — pass/fail
3. **Tests** — last known test run result (from `TEST_FIX_STATE.md` if present, or runs the project's test command)
4. **Tech debt** — summary of `TECH_DEBT.md` if present (count by severity)
5. **Memory** — recent relevant notes from Claude Code's memory for this project

## Output format

```
## Project Status — YYYY-MM-DD HH:mm

Git:       clean | main (0 ahead, 0 behind)
Typecheck: PASS
Tests:     PASS (last run: YYYY-MM-DD)
Tech debt: 0 critical, 1 high, 3 medium
```

## Usage
```
/status
```
