---
name: senior-security
description: "Security review for Electron/Node/React code. Checks for IPC vulnerabilities, injection, secret leakage, and unsafe APIs."
---

# Senior: Security

Invoked by `orchestrator` and `/ship` on any task touching IPC, auth, or file I/O.

## Electron-specific checks

- [ ] `contextIsolation: true` — non-negotiable. Flag immediately if false.
- [ ] `nodeIntegration: false` in renderer — non-negotiable.
- [ ] `sandbox: true` unless explicitly disabled with documented reason.
- [ ] No direct `ipcRenderer` passthrough in preload — only named, typed functions exposed via `contextBridge`.
- [ ] All IPC input validated in main before use — never trust renderer data.
- [ ] `shell.openExternal()` called only with validated, allowlisted URLs.
- [ ] No remote code execution via `eval`, `Function()`, or `new Function()` in any process.

## General web/Node checks

- [ ] No SQL string concatenation — parameterized queries only.
- [ ] No path traversal via `path.join(userInput)` without normalization and boundary check.
- [ ] No `child_process.exec(userInput)` — use `execFile` with explicit args array.
- [ ] Secrets not logged, not stored in `localStorage`/`sessionStorage`, not in URLs.
- [ ] `npm audit --audit-level=high` clean.

## Auth / session

- [ ] Tokens stored in OS keychain or encrypted storage, not plain-text files.
- [ ] JWTs validated (signature + expiry) on every request — not just decoded.
- [ ] No hardcoded API keys, passwords, or tokens in source code.

## Output

```
PASS / FAIL

- [PASS/FAIL] <check>: <finding or confirmation>
```

Severity for failures: `CRITICAL` (must fix before ship) / `HIGH` / `MEDIUM` / `LOW`.

## Never

- Approve a CRITICAL finding without an explicit user decision.
- Flag style issues here — this is security only.
