---
name: senior-estimation
description: "Estimates effort for a task before starting. Surfaces hidden complexity and flags scope creep risk."
---

# Senior: Estimation

Invoked by `orchestrator` on large tasks, or directly when the user asks how long something will take.

## Process

### 1. Break it down
List all distinct sub-tasks. Each sub-task should be independently implementable. If a sub-task can't be described in one line, split it further.

### 2. Classify each sub-task

| Level | Meaning | Typical effort |
|-------|---------|---------------|
| XS | Trivial change, fully understood | 5-15 min |
| S | Clear change, known pattern | 15-45 min |
| M | Multi-step, some unknowns | 1-3 hours |
| L | Complex, significant unknowns | half day |
| XL | Architecturally novel, risky | full day+ |

### 3. Flag risks
For each M/L/XL sub-task, name the biggest unknown:
> "IPC contract change — unknown how many callers need updating."

### 4. Surface scope creep risk
State explicitly if the task touches areas that commonly expand scope:
- DB schema changes (migration risk)
- Shared types used across processes
- UI components with hidden state complexity
- Third-party API integrations with undocumented behavior

### 5. Recommend approach
For tasks with XL sub-tasks: recommend splitting into a spike (investigate) + implementation sprint, so the first pass validates the approach before committing to it.

## Output format

```
Total: M (estimated 1-2 hours)

Sub-tasks:
- [S] Add DB column + migration
- [M] Update rowToDocument + updateDocument handlers — risk: many callers
- [S] Update TypeScript type
- [S] Wire Inspector UI control

Risks: The updateDocument handler touches a large switch — check for untested branches.
```

## Never

- Give a single time estimate without a breakdown.
- Ignore XL sub-tasks — they're where sprints blow up.
