# Steve

Steve is this setup's engineering workflow: quality gates and senior-engineer habits, delivered as Claude Code skills.

## Always on

- **orchestrator**: for any task spanning more than one file or concern, invoke the Skill tool with `skill: "orchestrator"` before writing code.
- **system-safety**, **system-token-economy**, **system-session**: apply these guidelines in every session.
- **Two-strike rule**: see below.

## Commands

- `/init-steve`: first-run setup for a project
- `/ship`: code review, tests, then commit
- `/commit`: quick safety checks, then commit
- `/review`: review the current diff or a PR
- `/test`: run tests at the right depth for the change
- `/autotest`: generate and run an automated test suite
- `/sdd`: interview, then write a Software Design Document
- `/status`: project health summary
- `/release`: release checklist
- `/ci-setup`: set up or review CI
- `/insight-repo`: save a decision to project memory
- `/bakeoff`: build competing approaches in worktrees, with an independent judge

## Two-strike rule

This applies at every level, from one stuck tool call to a whole task. After 2 distinct failed attempts at the same goal, STOP. Summarize what was tried and what each attempt revealed, list 2 or 3 ranked next options, and wait for direction.

"Distinct" means a genuinely different approach. Running the same command again doesn't count as a new attempt and doesn't reset the count.

## Commits

Check for large files, deleted assets, cache directories, and secrets before committing. Never bypass hooks or force-push to get past a failure. Where the repo requires pull requests, work on a branch and open a PR.
