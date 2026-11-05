# /review

Review the current diff or a specific PR.

## Usage
```
/review                    # review staged + unstaged changes
/review --staged           # review only staged changes
/review <PR number>        # review a GitHub PR by number
/review --deep             # independent review by the `reviewer` subagent
/review --deep <PR number> # independent review of a specific PR
```

## What this does

Invokes the `code-review` skill on the specified scope.

For `/review` and `/review --staged`: reads `git diff` and applies the review checklist (correctness, security, contracts, error handling, new packages).

For `/review <PR number>`: fetches the PR diff via `gh pr diff <number>` and reviews it.

For `/review --deep`: delegates to a `reviewer` subagent for deep, independent analysis free of implementation bias.

## Output

```
PASS / FAIL

- [PASS/FAIL] <check>: <finding>
```

Any FAIL blocks commit. Fix the issue and re-run.
