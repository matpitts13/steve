# /release

Run the release checklist and ship a new version.

## Usage
```
/release patch          # bump patch version (bug fixes)
/release minor          # bump minor version (new features)
/release major          # bump major version (breaking changes)
/release --dry-run      # check all gates without bumping version
```

## What this does

Invokes the `release` skill:
1. Runs all pre-release quality gates
2. Prompts for CHANGELOG entry
3. Bumps version in `package.json`
4. Creates git commit + tag
5. Builds the app
6. Pushes tag to remote

Stops if any gate fails and tells you what to fix.

## Never run /release on an unclean working tree.
