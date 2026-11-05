# /sdd

Create or update the Software Design Document for the current feature.

## Usage
```
/sdd                    # start SDD interview for the current task
/sdd "feature name"     # start SDD for a named feature
/sdd --update           # update existing docs/SDD.md
/sdd --view             # show the current SDD without editing
```

## What this does

Invokes the `sdd` skill:
1. Reads `sdd/interview-template.md` for guided questions
2. Interviews you one question group at a time
3. Writes or updates `docs/SDD.md`
4. Waits for your confirmation before coding begins

Run `/sdd` before any Large task to pin down requirements before writing code.
