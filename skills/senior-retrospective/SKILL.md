---
name: senior-retrospective
description: "End-of-sprint retrospective. Captures what worked, what didn't, and what to carry forward. Feeds into memory and TECH_DEBT.md."
---

# Senior: Retrospective

Invoked after a sprint completes, or at the end of a large task. Typically preceded by `/commit`.

## Structure

### What was built?
One paragraph. What changed in the codebase and why it matters.

### What went well?
2-3 bullets. Focus on patterns or approaches that should be repeated.

### What was harder than expected?
2-3 bullets. Root cause for each: was it unclear requirements, wrong approach, missing tooling, or an unknown dependency?

### What would we do differently?
1-2 bullets. Concrete: "Next time we'd read the migration system first before designing the schema change."

### What's deferred?
List items to add to `TECH_DEBT.md`. For each: what it is, why it was deferred, what would unblock it.

### What should be remembered?
1-2 things worth saving to memory — non-obvious learnings that apply beyond this sprint.

## Output flow

1. Print the retrospective in the conversation.
2. Add deferred items to `TECH_DEBT.md`.
3. For each "remember" item: save to Claude Code's memory for this project as a feedback or project memory.

## Never

- Turn the retrospective into a blame session or a list of complaints without actionable follow-up.
- Skip the "What would we do differently?" section — that's the most valuable part for future sessions.
