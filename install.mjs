#!/usr/bin/env node
// Installs Steve into Claude Code. Needs Node 20+ and no packages.
//
//   node install.mjs                  for you, in ~/.claude
//   node install.mjs --project [dir]  for a team, in a repo's .claude/ and CLAUDE.md
//   Add --dry-run to preview, --force to replace files you've changed.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.dirname(fileURLToPath(import.meta.url));
const COPY_DIRS = ['skills', 'commands', 'agents', 'hooks'];
const START = '<!-- steve:start -->';
const END = '<!-- steve:end -->';
const HOOK_FILE = 'block-dangerous.mjs';
const USAGE = 'Usage: node install.mjs [--project [dir]] [--dry-run] [--force]';

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const count = (text, mark) => text.split(mark).length - 1;

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

function refuse(file, problem, options) {
  return new Error(`${file} ${problem}. Fix it and run the installer again. Nothing was changed.`, options);
}

function readSettings(file) {
  if (!fs.existsSync(file)) return {};
  const text = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw refuse(file, "isn't valid JSON", { cause: err });
  }
  if (!isObject(parsed)) throw refuse(file, "isn't a JSON object");
  return parsed;
}

function withHook(settings, command, file) {
  if (settings.hooks !== undefined && !isObject(settings.hooks)) throw refuse(file, 'has a "hooks" value that isn\'t an object');
  const preToolUse = settings.hooks?.PreToolUse ?? [];
  if (!Array.isArray(preToolUse)) throw refuse(file, 'has a "PreToolUse" value that isn\'t a list');
  for (const group of preToolUse) {
    const hooksOk = isObject(group) && (group.hooks === undefined || (Array.isArray(group.hooks) && group.hooks.every(isObject)));
    if (!hooksOk) throw refuse(file, 'has a "PreToolUse" entry in an unexpected format');
  }

  const installed = preToolUse.some((group) => group.hooks?.some((hook) => typeof hook.command === 'string' && hook.command.includes(HOOK_FILE)));
  if (installed) return null;
  return {
    ...settings,
    hooks: {
      ...settings.hooks,
      PreToolUse: [
        ...preToolUse,
        { matcher: 'Bash|PowerShell', hooks: [{ type: 'command', command, shell: 'bash', timeout: 15 }] },
      ],
    },
  };
}

function withInstructions(existing, block, file) {
  const starts = count(existing, START);
  const ends = count(existing, END);
  const start = existing.indexOf(START);
  const end = existing.indexOf(END);
  const hasSection = starts === 1 && ends === 1 && start < end;
  if (!hasSection && (starts > 0 || ends > 0)) {
    throw refuse(file, `has damaged Steve markers (expected one ${START} followed by one ${END})`);
  }

  const eol = existing.includes('\r\n') ? '\r\n' : '\n';
  const section = `${START}\n${block.replace(/\r\n/g, '\n').trim()}\n${END}`.replace(/\n/g, eol);
  if (hasSection) return existing.slice(0, start) + section + existing.slice(end + END.length);
  if (!existing.trim()) return `${section}${eol}`;
  return `${existing.replace(/\s*$/, '')}${eol}${eol}${section}${eol}`;
}

function backupPath(dest) {
  const first = `${dest}.steve-backup`;
  if (!fs.existsSync(first)) return first;
  for (let n = 2; ; n += 1) {
    const next = `${first}-${n}`;
    if (!fs.existsSync(next)) return next;
  }
}

/** Installs into `home` (user scope) or `project` (team scope). Returns what happened. */
export function install({ home = os.homedir(), project = null, force = false, dryRun = false } = {}) {
  const claudeDir = project ? path.join(project, '.claude') : path.join(home, '.claude');
  const claudeMd = project ? path.join(project, 'CLAUDE.md') : path.join(claudeDir, 'CLAUDE.md');
  const settingsFile = path.join(claudeDir, 'settings.json');
  const hookCommand = project
    ? `node "$CLAUDE_PROJECT_DIR/.claude/hooks/${HOOK_FILE}"`
    : `node "$HOME/.claude/hooks/${HOOK_FILE}"`;

  // Work out the shared files first, so a problem in either stops the install before anything is written.
  const settings = withHook(readSettings(settingsFile), hookCommand, settingsFile);
  const block = fs.readFileSync(path.join(REPO, 'templates', 'CLAUDE.steve.md'), 'utf8');
  const existingMd = fs.existsSync(claudeMd) ? fs.readFileSync(claudeMd, 'utf8') : '';
  const nextMd = withInstructions(existingMd, block, claudeMd);

  const result = { target: claudeDir, copied: [], unchanged: [], skipped: [], backedUp: [] };
  for (const dir of COPY_DIRS) {
    for (const source of listFiles(path.join(REPO, dir))) {
      const rel = path.relative(REPO, source);
      const dest = path.join(claudeDir, rel);
      const incoming = fs.readFileSync(source);
      if (fs.existsSync(dest)) {
        if (fs.readFileSync(dest).equals(incoming)) {
          result.unchanged.push(rel);
          continue;
        }
        if (!force) {
          result.skipped.push(rel);
          continue;
        }
        if (!dryRun) fs.copyFileSync(dest, backupPath(dest));
        result.backedUp.push(rel);
      }
      if (!dryRun) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, incoming);
      }
      result.copied.push(rel);
    }
  }

  if (!dryRun) {
    fs.mkdirSync(path.dirname(claudeMd), { recursive: true });
    fs.writeFileSync(claudeMd, nextMd);
    if (settings) {
      fs.mkdirSync(claudeDir, { recursive: true });
      fs.writeFileSync(settingsFile, `${JSON.stringify(settings, null, 2)}\n`);
    }
  }
  result.hookAdded = Boolean(settings);
  result.claudeMd = claudeMd;
  return result;
}

function parseArgs(args) {
  const options = { project: null, force: false, dryRun: false };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--force') options.force = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg.startsWith('--project=')) options.project = arg.slice('--project='.length);
    else if (arg === '--project') {
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        options.project = next;
        i += 1;
      } else {
        options.project = process.cwd();
      }
    } else throw new Error(`Unknown option: ${arg}\n${USAGE}`);
  }
  if (options.project !== null) {
    if (!options.project) throw new Error(`--project needs a folder.\n${USAGE}`);
    options.project = path.resolve(options.project);
    if (!fs.statSync(options.project, { throwIfNoEntry: false })?.isDirectory()) {
      throw new Error(`Project folder not found: ${options.project}`);
    }
  }
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const result = install(options);

  console.log(`${options.dryRun ? 'Dry run, nothing written. Target' : 'Installed to'}: ${result.target}`);
  console.log(`Copied ${result.copied.length} files, ${result.unchanged.length} already up to date.`);
  console.log(`Instructions: ${result.claudeMd}`);
  console.log(`Safety hook: ${result.hookAdded ? 'added to settings.json' : 'already set up'}`);
  if (result.backedUp.length) console.log(`Replaced ${result.backedUp.length} changed files; each original is saved beside it with a .steve-backup ending. Don't commit those.`);
  if (result.skipped.length) {
    console.log(`\nKept ${result.skipped.length} files you've changed (use --force to replace them):`);
    for (const rel of result.skipped) console.log(`  ${rel}`);
  }
  if (!options.dryRun) console.log('\nRestart Claude Code, then run /init-steve in your project.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}
