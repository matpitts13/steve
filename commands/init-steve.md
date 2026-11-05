# /init-steve

Initialize Steve for a new project. Run once when starting work in a new repo.

## Usage
```
/init-steve
```

## What this does

1. **Stack detection** — runs `stack-detect` skill, identifies frameworks and languages
2. **Language rules** — loads the relevant language rule files for this stack
3. **SDD check** — checks if `docs/SDD.md` exists; if not, offers to create one
4. **Test check** — finds the project's test setup; on a JavaScript or TypeScript project with none, offers to set up the harness via `autotest/harness.md`
5. **Memory init** — runs a brief orientation pass and saves any immediately relevant project context to Claude Code's memory for this project
6. **Permissions** — offers to add this repo's common read-only commands to the allowlist in `.claude/settings.json`
7. **Status** — prints a `/status` summary

## After running

You're ready to work. The orchestrator will auto-invoke the right skills for each task based on the detected stack.
