---
name: senior-archaeology
description: "Investigates why code exists or why a decision was made, using git history, blame, and comments as evidence."
---

# Senior: Archaeology

Invoked when the purpose of code is unclear, before deleting something that might be load-bearing, or when a bug looks intentional.

## Investigation steps

### 1. Git blame
```
git log --follow -p -- <file>
git blame <file>
```
Find the commit that introduced the suspicious code. Read the commit message.

### 2. Commit context
```
git show <hash>
```
Read the full diff of that commit — the context often explains why the code exists.

### 3. Issue / PR reference
If the commit message references an issue or PR number, look it up.

### 4. Search for related code
```
grep -r "PATTERN" src/
```
Find other places that rely on the same behavior. Something looking like dead code may be a contract honored elsewhere.

### 5. Smoke test
If still uncertain: write a test that verifies the current behavior before changing it. This documents the contract even if the reason remains unclear.

## Output format

```
Finding: <what the code does>
Origin: commit <hash> on <date>, "<commit message>"
Reason: <inferred or confirmed purpose>
Safe to remove: YES / NO / UNCERTAIN
Evidence: <what supports the conclusion>
```

## Never

- Delete or disable code without completing an archaeology pass first.
- Assume code is dead just because it looks unused — search for string matches of the function/class name before concluding.
