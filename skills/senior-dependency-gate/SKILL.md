---
name: senior-dependency-gate
description: "Reviews a proposed new npm dependency before it's added. Checks size, maintenance, security, and whether it's actually needed."
---

# Senior: Dependency Gate

Invoked whenever a new npm package is proposed. Must pass before `npm install`.

## Review steps

### 1. Is it necessary?
- Can this be done with what's already in `package.json`? Check existing deps first.
- Can it be done with <20 lines of native code? If yes, write it inline — don't add a dep.
- Is this only needed in one place? Inline it.

### 2. Package health
Check the following (use npm registry or package README):
- **Last published**: > 1 year without a release on an active project is a yellow flag.
- **Weekly downloads**: < 1000/week is low adoption — prefer alternatives with broader use.
- **Open issues / PRs**: a large backlog of unresolved security issues is a red flag.
- **Maintainer**: single-maintainer packages with no activity are a bus-factor risk.

### 3. Security
- Run `npm audit` after installing (but before committing) — or check Snyk for known CVEs.
- Check if the package calls `eval`, spawns child processes, or makes network requests at install time (`postinstall` scripts).

### 4. Size
- Check bundle impact with `bundlephobia.com` or equivalent.
- For an Electron app, renderer bundle size matters less than startup time — prefer lazy imports for heavy deps.

### 5. License
- Check the license. `MIT`, `Apache-2.0`, `BSD-*` are fine.
- `GPL`/`AGPL` requires careful review — may affect distribution rights.
- `UNLICENSED` or no license → block.

## Output

```
APPROVE / BLOCK

Package: <name>@<version>
Reason: <one line>
Alternative: <if blocking, suggest what to use instead>
```

## Never

- Approve a package with a known CVE without a documented exception.
- Add a package just because it's popular — evaluate fit for this project.
