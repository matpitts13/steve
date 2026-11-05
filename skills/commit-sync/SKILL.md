---
name: commit-sync
description: "Runs only after code-review passes. Stages specific files, writes a conventional-commit message, commits, and pushes."
---

# Commit-Sync

Invoked by orchestrator after code-review passes. This is the gated commit path — for the quick safety-check path use `/commit`.

## When to use

- Orchestrator's final step on medium/large tasks
- After `/ship` command

## Steps

1. **Verify code-review passed.** If not, stop and say so.
2. **Stage specific files** — never `git add -A`. Stage only files changed by this task.
3. **Write conventional-commit message:**
   ```
   type(scope): short summary (≤72 chars)

   - bullet: what changed and why
   - bullet: any breaking changes or notable side-effects
   ```
   Types: `feat` / `fix` / `refactor` / `test` / `docs` / `chore`
4. **Commit.** If you are on the default branch and the repo requires pull requests (protected branch, or `CONTRIBUTING` says so), create a branch first, and open a PR instead of pushing to the default branch.
5. **Sync** (skip if the branch has no upstream yet) — try in order, stop at first success:
   1. `git pull --ff-only` (preferred — no new commit)
   2. `git pull --no-rebase` (merge commit). If this conflicts: `git merge --abort`, then try step 3.
   3. `git pull --rebase` (last resort). If this conflicts: `git rebase --abort`, STOP, print the conflicting files, report — do not push.
6. **Push.** Never force-push. If the branch has no upstream, push with `-u origin <branch-name>`. If push still fails after sync: report, stop.
7. **Open the PR**, if this branch needs one, with `gh pr create`. If `gh` isn't available, tell the user the branch is pushed and the PR still needs opening.

## Two-strike rule

Canonical version in the Steve section of `CLAUDE.md`. Concrete trigger here: pull fails twice → stop and report, don't loop.

## Never

- Force-push
- `git add -A` blindly
- Commit `.env`, credentials, or secrets
