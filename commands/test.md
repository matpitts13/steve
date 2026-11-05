# /test

Run the test suite at the appropriate depth.

## Usage
```
/test           # auto-detect depth from recent changes
/test small     # lint + typecheck only
/test medium    # the project's test suite
/test large     # full suite + build + dependency audit
```

## What this does

Invokes the `test-strategy` skill. Depth is determined by:
- Explicit argument (small / medium / large)
- Or auto-detected from the size of recent changes (lines changed + files changed)

Reports results and lists any failures. On failure, offers to invoke `debug-protocol`.
