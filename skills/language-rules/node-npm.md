# Node.js / npm Conventions

## Async
- `async/await` everywhere — no raw `.then()/.catch()` chains unless interoping with non-async code.
- `Promise.all()` for parallel independent awaits; `for await...of` for serial streams.
- Never `await` inside a `.forEach()` — it silently drops the promise. Use `for...of` or `Promise.all(arr.map(...))`.

## Error handling
- `try/catch` at I/O boundaries (file ops, network, child_process). Re-throw with context: `throw new Error('reading config', { cause: err })`.
- Process-level `unhandledRejection` handler should log and exit — never swallow.

## Modules
- ESM (`import`/`export`) in new code. CommonJS only for files that must interop with CJS-only dependencies.
- `"type": "module"` in `package.json` for new projects.

## npm scripts
- `build`, `dev`, `test`, `lint` are the canonical script names. Don't invent synonyms.
- `npm ci` in CI — not `npm install`. Deterministic installs from lockfile.
- `npm audit --audit-level=high` before shipping. Don't suppress without a written reason.

## Environment
- Read env vars at startup once; validate that required vars are present; throw early if they're missing.
- Never default a secret to an empty string — fail loud.
- `.env.example` committed; `.env` gitignored.

## File paths
- `path.join()` / `path.resolve()` — never string concatenation for paths.
- `__dirname` and `__filename` not available in ESM — use `fileURLToPath(import.meta.url)`.

## Never
- `require()` user-controlled paths (path traversal).
- Synchronous fs operations in a hot path (blocking the event loop).
- `npm install --save` arbitrary packages without `senior-dependency-gate` review.
