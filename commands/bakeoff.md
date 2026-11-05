# /bakeoff

Build the same task 2–3 different ways in isolated worktrees, then have an independent judge pick the winner. Manual only — costs 3–4× a normal run.

## Usage
```
/bakeoff "<task>"                       # Steve proposes 2–3 approaches
/bakeoff "<task>" --approaches "A" "B"  # you name them
```

## When to use

A large task with genuinely competing designs where picking wrong is expensive (data model, sync strategy, IPC architecture). Not for small fixes, and never auto-invoked by the orchestrator.

## Steps

1. **Frame** — write one shared spec: goal, constraints, acceptance criteria (the judge scores against this). Name 2–3 approaches that differ in *design*, not just style. Show them to the user and wait for go-ahead.
2. **Build** — spawn one `general-purpose` agent per approach with `isolation: "worktree"`, all in a single message so they run in parallel. Each gets the spec + its approach, and must: implement it, run typecheck + `npm run test`, and report diff size, test result, and known weaknesses.
3. **Judge** — give the `reviewer` agent (pinned to a different model than the builders) all diffs + reports, anonymized as A/B/C. It scores each against the acceptance criteria, then correctness, risk, and diff size, and picks a winner with reasons.
4. **Report** — a short table: approach · tests · diff size · judge's verdict. Recommend one; the user decides.
5. **Adopt** — merge only the chosen worktree's changes into the working branch. Delete the other worktrees only after the user confirms.

## Never

- Run more than 3 attempts.
- Merge anything before the user picks.
- Let builders share a worktree or see each other's output.
