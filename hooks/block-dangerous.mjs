#!/usr/bin/env node
// PreToolUse hook for Bash/PowerShell. Claude Code sends the tool call as JSON on stdin.
// A match does not hard-block: it returns permissionDecision "ask", so a person approves
// or rejects that one command. No match means no output and no opinion.
//
// This is a guard rail against accidents, not a security boundary: a command can be written
// in ways these patterns don't recognize. If the input can't be read, the hook stays silent.

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// "git", then any global options such as -C <dir>, then the subcommand.
const GIT = String.raw`\bgit(?:\s+-[cC]\s+(?:"[^"]*"|'[^']*'|\S+)|\s+--[\w-]+(?:=\S+)?|\s+-[pP]\b)*\s+`;
const git = (rest) => new RegExp(GIT + rest, 'i');

// Stays within one command: stops at a separator or a new line.
const ARGS = String.raw`[^;&|\n]*`;

const BLOCKED = [
  [git(String.raw`push\b${ARGS}\s(?:--force(?!-with-lease|-if-includes)\b|-[a-z]*f[a-z]*\b|\+\S)`), 'Force-push can overwrite upstream history. Prefer --force-with-lease.'],
  [git(String.raw`reset\b${ARGS}\s--hard\b`), 'Discards all local changes irreversibly.'],
  [git(String.raw`clean\b${ARGS}\s(?:-[a-z]*f|--force)`), 'Deletes untracked files irreversibly.'],
  [git(String.raw`rebase\b(?!${ARGS}\s--(?:abort|continue|skip|quit)\b)`), 'Rebase rewrites history.'],
  [/\brm\s+(?:-[a-z]*r[a-z]*f[a-z]*|-[a-z]*f[a-z]*r[a-z]*|-r\s+-f|-f\s+-r|--recursive\s+--force|--force\s+--recursive)\s+(?:--\s+)?["']?(?:\/|~|\$HOME|\$\{HOME\})\/?\*?["']?(?:\s|$|[;&|)])/i, 'Deletes the root or home directory.'],
  [/\bRemove-Item\b(?=.*-Recurse)(?=.*-Force).*C:\\Windows/i, 'Windows system directory delete.'],
  [/\bDROP\s+(?:TABLE|DATABASE|SCHEMA)\b/i, 'Drops data irreversibly.'],
  // Lowercase "truncate" alone is usually English or the shell command, so only uppercase counts without TABLE.
  [/\btruncate\s+table\b/i, 'Deletes all rows irreversibly.'],
  [/\bTRUNCATE\s+[\w."`[]/, 'Deletes all rows irreversibly.'],
  [/\bDELETE\s+FROM\s+[\w."`[\]]+\s*(?:;|$|"|')/i, 'DELETE without WHERE clause deletes all rows.'],
  [/--no-verify/i, 'Bypasses git hooks. Fix the hook failure instead.'],
];

const STAGE = new RegExp(`${GIT}add\\s+(${ARGS})`, 'gi');

function isSensitiveFile(token) {
  const name = token.replace(/^["']|["']$/g, '').split(/[\\/]/).pop().toLowerCase();
  return /^\.env(?:\.(?!example$|sample$|template$).+)?$/.test(name)
    || /\.(?:pem|key)$/.test(name)
    || name.startsWith('id_rsa')
    || name.includes('credentials')
    || name.includes('secrets');
}

/** Returns why a command needs a person's approval, or null if it doesn't. */
export function check(command) {
  for (const [pattern, reason] of BLOCKED) {
    if (pattern.test(command)) return `Steve safety: ${reason}`;
  }
  for (const stage of command.matchAll(STAGE)) {
    const tokens = stage[1].trim().split(/\s+/);
    if (tokens.some((token) => ['.', '*', '-a', '--all'].includes(token.toLowerCase()))) {
      return 'Steve safety: stages everything, which can sweep in secrets. Stage specific files.';
    }
    const sensitive = tokens.find(isSensitiveFile);
    if (sensitive) return `Steve safety: staging '${sensitive}' - likely sensitive.`;
  }
  return null;
}

function main() {
  let command;
  try {
    command = JSON.parse(fs.readFileSync(0, 'utf8'))?.tool_input?.command;
  } catch {
    return;
  }
  if (typeof command !== 'string' || !command) return;

  const reason = check(command);
  if (!reason) return;
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: reason,
    },
  }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
