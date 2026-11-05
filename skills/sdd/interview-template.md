# SDD Interview Template

Ask these questions conversationally, one group at a time. Skip questions that were already answered in the task description.

## Group 1 — Goal

1. What problem does this solve? What's the user experience before and after?
2. Who uses this? Is it the end user, a developer workflow, or internal tooling?
3. What does "done" look like? How would you know it's working correctly?

## Group 2 — Scope

4. What's explicitly out of scope? What are we NOT building?
5. Any hard deadlines or dependencies on other work?
6. Does this replace existing behavior, or is it additive?

## Group 3 — Data

7. What data does this feature need that doesn't exist yet?
8. Does any existing data change shape or meaning?
9. Are there migration concerns (existing user data that must be preserved)?

## Group 4 — Integration

10. What existing code does this touch? Which files are likely to change?
11. Does this require new IPC channels or change existing ones?
12. Does this require any new npm packages?

## Group 5 — Edge cases

13. What happens if the user's data is in an unexpected state?
14. What's the failure mode? What should happen if this breaks?
15. Are there any platform-specific concerns (Windows/Mac, different screen sizes)?

## When to stop

Stop interviewing when you can fill out all sections of the SDD without open questions. The goal is a document that removes ambiguity — not a perfect spec. If a question would take longer to answer than to discover during implementation, leave it as an open question in the SDD.
