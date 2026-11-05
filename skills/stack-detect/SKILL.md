---
name: stack-detect
description: "Detects the tech stack of the current project. Returns a list of active language/framework tags to load from language-rules."
---

# Stack Detect

Invoked by `language-rules` or `orchestrator` when the stack is not obvious from context.

## Detection steps

1. **`package.json`** — read `dependencies` and `devDependencies`:
   - `electron` → tag: `electron`, `typescript`, `react`
   - `react` / `react-dom` → tag: `react`, `typescript` (if TS present)
   - `typescript` → tag: `typescript`
   - `vite` / `webpack` / `esbuild` → confirms frontend build (already covered by react/ts tags)
   - `vitest` / `jest` → confirms test framework (use in `test-strategy`)

2. **File extensions** — scan `src/`:
   - `.tsx` files → `react`
   - `.ts` files → `typescript`
   - `.cs` files → `csharp`
   - `.cpp` / `.cc` / `.h` files → `cpp`
   - `.liquid` files → `liquid-shopify`, `html-css`
   - `.html` / `.css` / `.scss` files → `html-css`
   - `*.db` / `*.sqlite` in project or migration files → `sqlite`

3. **Config files**:
   - `tsconfig.json` present → `typescript`
   - `electron-builder.yml` / `electron.vite.config.*` → `electron`
   - `.shopifyignore` / `config/settings_data.json` → `liquid-shopify`

## Output

Return a list of tags: e.g. `["typescript", "react", "electron", "sqlite"]`

Load the corresponding sub-files from `language-rules/`.

## Never

- Guess the stack without reading at least one signal file.
- Return `html-css` alone when `react` is detected (React implies JS-driven DOM, not raw HTML authoring).
