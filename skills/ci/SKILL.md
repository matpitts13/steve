---
name: ci
description: "Sets up or reviews CI/CD configuration. GitHub Actions focused. Invoked via /ci-setup."
---

# CI

Invoked via `/ci-setup` to create or review the CI pipeline for the current project.

## Detect existing CI

Check for `.github/workflows/` — if it exists, review rather than create.

## Standard pipeline for Electron + React + TypeScript

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npx eslint src --max-warnings 0
      - run: npm run test
      - run: npm audit --audit-level=high
```

## Electron-specific notes

- Electron apps can't be built or E2E tested on headless Linux without Xvfb. Add `xvfb-run` for Playwright tests on Linux:
  ```yaml
  - run: xvfb-run npx playwright test
  ```
- For release builds, use `windows-latest` and `macos-latest` runners.
- Never commit secrets to CI config — use GitHub Secrets (`${{ secrets.TOKEN }}`).

## Caching

Always cache `node_modules` via `actions/setup-node` with `cache: npm`. This saves 30-60s per run.

## Branch protection

After CI is set up, recommend enabling branch protection on `main`:
- Require status checks to pass before merging
- Require branches to be up to date

## Credentials

Prefer short-lived OIDC credentials over long-lived secrets wherever the target supports it (add `permissions: id-token: write` to the job):
- npm publish → Trusted Publishing (`npm publish --provenance`)
- VS Code Marketplace → `vsce publish --oidc` (@vscode/vsce ≥ 4.0.2)
- AWS / Azure / GCP → their official OIDC login actions

Where OIDC isn't available (e.g. Cloudflare `wrangler`), use a narrowly scoped API token in GitHub Secrets — never a global key. When reviewing existing CI, flag any PAT or account-wide key that could be replaced.

## Never

- Commit API keys, tokens, or credentials in `.github/workflows/`.
- Skip `npm ci` in favor of `npm install` in CI — lockfile reproducibility matters.
- Add `--no-verify` or `--force` to any CI git commands.
