---
name: release
description: "Release checklist for shipping a new version. Verifies quality gates, bumps version, builds, and tags."
---

# Release

Invoked via `/release` when preparing to ship a new version.

## Pre-release gates (must all pass)

- [ ] `npx tsc --noEmit` — zero errors
- [ ] `npm run test` — all tests pass (use the project's own script, not bare `npx vitest run` — a mismatched global Vitest can fail with "failed to find the runner" even when the suite is green)
- [ ] `npm audit --audit-level=high` — no high/critical vulnerabilities
- [ ] `npm run build` — build succeeds without warnings
- [ ] Manual smoke test: launch the app, verify the golden paths work
- [ ] `TECH_DEBT.md` reviewed — no Critical items unresolved

## Version bump

Follow semver:
- **patch** (x.x.N): bug fixes, no new features
- **minor** (x.N.0): new features, no breaking changes
- **major** (N.0.0): breaking changes

```
npm version patch|minor|major
```

This updates `package.json`, creates a commit, and creates a git tag.

## Build

```
npm run build
```

Electron apps use `electron-builder` — the built app goes to `dist/`.

## Tag and push

```
git push origin main --tags
```

## Changelog entry

Before releasing, add an entry to `CHANGELOG.md`:

```markdown
## [x.y.z] — YYYY-MM-DD

### Added
- <new feature>

### Fixed
- <bug fix>

### Changed
- <behavior change>
```

## Never

- Release from an unclean working tree (`git status` must be clean).
- Skip the smoke test — tests verify code, not the actual packaged app.
- Force-push after tagging — the tag is the release artifact.
