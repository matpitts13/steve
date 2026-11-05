---
name: language-rules
description: "Per-language coding conventions. Routes to the right sub-file based on detected stack. Invoked by orchestrator or directly when code conventions are unclear."
---

# Language Rules

Loads the relevant language sub-file and applies those conventions for the current task.

## How to use

On any medium/large code task, load the relevant sub-file(s) for the detected stack before writing code:

- TypeScript / JavaScript → `typescript.md`
- React (with TS) → `typescript.md` + `react.md`
- Electron → `typescript.md` + `react.md` + `electron.md`
- Node.js scripts → `node-npm.md`
- HTML / CSS → `html-css.md`
- Shopify themes → `html-css.md` + `liquid-shopify.md`
- C# → `csharp.md`
- C++ → `cpp.md`
- SQLite → `sqlite.md`

## Stack detection

Use `stack-detect` skill to determine which sub-files apply if not obvious from context.

## Never

- Override a project's existing conventions with these rules — these are defaults, not mandates.
- Apply rules from one language to another (e.g. don't apply C# patterns to TypeScript).
- Read all sub-files — load only what's needed for this task.
