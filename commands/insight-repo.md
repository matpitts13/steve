# /insight-repo

Save a note, decision, or finding to Claude Code's memory for this project.

## Usage
```
/insight-repo "note or observation here"
/insight-repo --type feedback "this approach caused X"
/insight-repo --type project "deadline is Y"
/insight-repo --type user "user prefers Z"
/insight-repo --type reference "bugs tracked in Linear INGEST project"
```

## What this does

Saves the provided note to the appropriate file in Claude Code's memory folder for this project:

1. Determines the memory type from `--type` flag, or infers it from content:
   - Preferences / behavior corrections → `feedback`
   - Project state / deadlines / decisions → `project`
   - Who the user is / their expertise → `user`
   - Where to find things externally → `reference`

2. Checks `MEMORY.md` for an existing related entry to update rather than creating a duplicate.

3. Writes or updates the memory file following the standard frontmatter format.

4. Updates `MEMORY.md` index.

## Note

This is `/insight-repo` (not `/insights`) to avoid conflicting with Claude's built-in `/insights` command. They serve different purposes: `/insights` is a built-in Claude Code feature; `/insight-repo` saves a note to this project's memory.
