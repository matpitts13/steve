# Electron Conventions

## Security baseline (non-negotiable)
- `contextIsolation: true` always. Never disable it.
- `nodeIntegration: false` always in renderer. Never enable it.
- All Node.js access goes through `contextBridge` in `preload.ts`. No direct `require()` in renderer.
- Validate and sanitize every value received over IPC before using it in main process.
- `sandbox: true` on renderer unless there's a documented reason it can't be.

## IPC pattern
- Channel names are kebab-case strings, prefixed with a namespace: `app:save`, `file:open`.
- Every channel is declared in a single `ipc-channels.ts` (or equivalent) file — no magic strings scattered through the codebase.
- Preload exposes only what the renderer needs: typed, named functions — not a raw `ipcRenderer.invoke` passthrough.
- Main process handler validates the input shape before acting. Never trust renderer data blindly.
- One listener per channel in main. Use a keyed Map (channel → handler) to prevent double-registration from StrictMode.

## Main vs renderer separation
- No UI code in main process. No file system or native API calls in renderer.
- Shared types (IPC payload types, document model) live in `src/types/` — imported by both sides.
- `electron/` directory for all main-process code. `src/` for renderer.

## Window management
- Track `BrowserWindow` instances in a `Map<id, BrowserWindow>`. Null-check before `.webContents.send()`.
- Always call `webContents.send()` after `did-finish-load` or inside the `ready-to-show` handler.

## Packaging
- Don't include `devDependencies` in the packaged build. Use `electron-builder`'s `files` glob to exclude non-prod paths.
- `.cache/`, `*.test.*`, and `node_modules/.cache` should be in the `files` exclude list.

## Never
- `shell.openExternal()` with unvalidated user-supplied URLs (open redirect / code execution risk).
- `nativeImage` from user-supplied paths without validation.
- Store secrets or tokens in localStorage or sessionStorage — use the OS keychain or encrypted SQLite.
