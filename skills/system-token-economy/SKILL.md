---
name: system-token-economy
description: "Token-budget discipline. Prevents context bloat that degrades reasoning quality and inflates cost."
---

# System: Token Economy

Passive guidelines applied in every session. No explicit invocation needed.

## Core principles

**Read selectively.** Never read a full file to find one value. Use Grep to locate the line, then Read with `offset`/`limit` to get just the context. Read the whole file only when the whole file is relevant.

**Don't repeat code.** When modifying code, show only the changed block — not the whole function, not the whole file. Use Edit, not Write, for modifications.

**Compress subagent results.** When a subagent or Explore agent returns results, extract what's needed and discard the raw output. Don't pass full file dumps back into the main conversation.

**Summarize before closing long threads.** When a multi-step task completes, one sentence: what changed and what's next. No recap of all the steps.

**Skip affirmations.** No "Great!", "Sure!", "I'll do that." responses. Start with the action or the answer.

## Context budget signals

- **Compaction notice** in context → trim reading habits immediately: switch to grep-first, read-second.
- **Long conversation** (>30 turns) → preference for external memory (`TECH_DEBT.md`, `TEST_FIX_STATE.md`) over re-deriving from scratch.

## Expensive operations to avoid

- Reading `node_modules/**`
- Reading full `package-lock.json`
- Reading large generated files (`dist/**`)
- Grepping with no file glob on a large repo (always scope with `*.ts`, `src/**`, etc.)

## Never

- Re-read a file you've already read in this session unless it changed.
- Print full file contents to the user "for reference."
