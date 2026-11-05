# Reference

## Commands

| Command | What it does |
|---|---|
| `/autotest` | Generate and run automated tests for the current project. |
| `/bakeoff` | Build the same task 2–3 different ways in isolated worktrees, then have an independent judge pick the winner. Manual only — costs 3–4× a normal run. |
| `/ci-setup` | Set up or review the CI/CD pipeline for the current project. |
| `/init-steve` | Initialize Steve for a new project. Run once when starting work in a new repo. |
| `/insight-repo` | Save a note, decision, or finding to Claude Code's memory for this project. |
| `/release` | Run the release checklist and ship a new version. |
| `/review` | Review the current diff or a specific PR. |
| `/sdd` | Create or update the Software Design Document for the current feature. |
| `/ship` | Gate + commit + push for the current task. Orchestrated path. |
| `/status` | Show the current project health summary. |
| `/test` | Run the test suite at the appropriate depth. |

## Skills

| Skill | What it does |
|---|---|
| `autotest` | Automated test generation and execution. Generates Vitest + Playwright tests, runs them, fixes failures, and parks flaky tests to TECH_DEBT.md. |
| `ci` | Sets up or reviews CI/CD configuration. GitHub Actions focused. Invoked via /ci-setup. |
| `code-review` | Pre-commit gate. Reviews diff for correctness bugs, security, broken contracts, missing error handling. Returns pass/fail bullet list. |
| `commit` | Pre-commit safety routine: flags large files, deleted assets, and cache directories; updates .gitignore if needed; then stages, commits with a descriptive message, and pushes. |
| `commit-sync` | Runs only after code-review passes. Stages specific files, writes a conventional-commit message, commits, and pushes. |
| `debug-protocol` | Structured debugging: reproduce → isolate → hypothesize → fix → verify. Each attempt states its hypothesis before touching code. |
| `language-rules` | Per-language coding conventions. Routes to the right sub-file based on detected stack. Invoked by orchestrator or directly when code conventions are unclear. |
| `orchestrator` | Routing brain for multi-step tasks. Classifies size, plans, executes sub-skills in order, verifies, and hands off to commit-sync. |
| `release` | Release checklist for shipping a new version. Verifies quality gates, bumps version, builds, and tags. |
| `sdd` | Software Design Document. Interviews the user to capture requirements, then generates or updates docs/SDD.md. |
| `senior-adr` | Architecture Decision Record. Documents a significant design decision with context, options, rationale, and consequences. |
| `senior-archaeology` | Investigates why code exists or why a decision was made, using git history, blame, and comments as evidence. |
| `senior-dependency-gate` | Reviews a proposed new npm dependency before it's added. Checks size, maintenance, security, and whether it's actually needed. |
| `senior-design-gate` | Pre-code gate for large tasks. Checks that the approach is sound before writing any code. |
| `senior-error-observability` | Reviews error handling and logging quality. Ensures errors are surfaced, not swallowed, and have enough context to debug. |
| `senior-estimation` | Estimates effort for a task before starting. Surfaces hidden complexity and flags scope creep risk. |
| `senior-retrospective` | End-of-sprint retrospective. Captures what worked, what didn't, and what to carry forward. Feeds into memory and TECH_DEBT.md. |
| `senior-security` | Security review for Electron/Node/React code. Checks for IPC vulnerabilities, injection, secret leakage, and unsafe APIs. |
| `senior-tech-debt` | Tracks, surfaces, and triages tech debt. Writes to TECH_DEBT.md. Used when deferring fixes or when the user asks for a debt review. |
| `stack-detect` | Detects the tech stack of the current project. Returns a list of active language/framework tags to load from language-rules. |
| `system-safety` | Safety checks before destructive operations. Prevents irreversible damage to the repo, filesystem, or remote state. |
| `system-session` | Session management: checkpoint files, state handoff, and recovery patterns for long or interrupted tasks. |
| `system-token-economy` | Token-budget discipline. Prevents context bloat that degrades reasoning quality and inflates cost. |
| `test-strategy` | Decides and runs the right test depth for the task size. Creates tests for new logic on medium/large tasks. |
| `testing-philosophy` | Opinionated testing guidance for this project. Loaded by test-strategy on first use in a new repo. Sets the foundation before writing any tests. |

## Agents

| Agent | What it does |
|---|---|
| `researcher` | Research agent for codebase exploration, library docs, and architecture questions. Used by orchestrator when significant doc reading or unfamiliar code exploration is needed. |
| `reviewer` | Independent code reviewer. Reviews a diff with fresh eyes, free of implementation bias. Used by code-review skill for medium/large diffs. |

## Hook

`hooks/block-dangerous.mjs` runs before each shell command and asks a person to approve risky ones. Edit the lists at the top of the file to change what it checks.
