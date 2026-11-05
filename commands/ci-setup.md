# /ci-setup

Set up or review the CI/CD pipeline for the current project.

## Usage
```
/ci-setup               # create .github/workflows/ci.yml (or review if exists)
/ci-setup --review      # review existing CI config without changing it
```

## What this does

Invokes the `ci` skill:
1. Checks for existing `.github/workflows/`
2. If exists: reviews the config against the standard checklist
3. If not: creates `.github/workflows/ci.yml` for the detected stack

For Electron + TypeScript + Vitest projects, generates:
- TypeScript check
- ESLint
- Vitest run
- npm audit
- Optional Playwright on matrix (ubuntu + windows)
