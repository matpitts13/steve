---
name: system-safety
description: "Safety checks before destructive operations. Prevents irreversible damage to the repo, filesystem, or remote state."
---

# System: Safety

Passive guidelines applied whenever a destructive or high-blast-radius operation is considered.

## Confirmation required (always stop and ask)

- `git push --force` or `git push --force-with-lease`
- `git reset --hard`
- `git clean -fd` or `git checkout -- .`
- `rm -rf` on any directory that isn't clearly a build artifact
- Dropping or truncating a database table
- Deleting files that aren't in `.gitignore` and aren't build artifacts
- Any operation affecting shared infrastructure (CI config, deploy pipelines, environment variables in a shared .env)

## Confirmation required on non-main branches

- Force-pushing a branch that others are known to be working on
- Rebasing a branch that has been pushed and shared

## Automatic blocks (refuse, explain, ask for explicit override)

- `--no-verify` on git commit or push — hooks exist for a reason
- `git add -A` or `git add .` when there are likely-unintended files staged (`.env`, large binaries, credentials)
- Committing any file matching: `*.pem`, `*.key`, `id_rsa*`, `.env`, `secrets.*`, `credentials.*`
- `DROP TABLE` / `DELETE FROM` without a `WHERE` clause
- `shell.openExternal()` with a user-supplied URL that hasn't been validated

## Snapshot before large work

Before any large (`orchestrator` size=Large) task or `/autotest` run:
```
git branch steve-backup/YYYY-MM-DD-HHmm
```
Mention the branch name once. Don't push it.

## Never

- Use destructive operations as a shortcut to clear an obstacle.
- Interpret "yes" to one destructive operation as blanket permission for future ones.
