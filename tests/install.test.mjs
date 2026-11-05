import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { install } from '../install.mjs';

const INSTALLER = fileURLToPath(new URL('../install.mjs', import.meta.url));

let root;
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const write = (rel, text) => {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
};
const exists = (...parts) => fs.existsSync(path.join(root, ...parts));
const hookGroups = (rel) => JSON.parse(read(rel)).hooks.PreToolUse;

beforeEach(() => { root = fs.mkdtempSync(path.join(os.tmpdir(), 'steve-')); });
afterEach(() => { fs.rmSync(root, { recursive: true, force: true }); });

test('user install puts everything in ~/.claude', () => {
  install({ home: root });
  assert.ok(exists('.claude/skills/orchestrator/SKILL.md'));
  assert.ok(exists('.claude/commands/ship.md'));
  assert.ok(exists('.claude/agents/reviewer.md'));
  assert.ok(exists('.claude/hooks/block-dangerous.mjs'));
  assert.match(read('.claude/CLAUDE.md'), /steve:start/);
  assert.match(hookGroups('.claude/settings.json')[0].hooks[0].command, /\$HOME\/\.claude\/hooks/);
});

test('project install uses the repo and a project-relative hook', () => {
  install({ project: root });
  assert.ok(exists('.claude/skills/orchestrator/SKILL.md'));
  assert.match(read('CLAUDE.md'), /steve:start/);
  assert.match(hookGroups('.claude/settings.json')[0].hooks[0].command, /\$CLAUDE_PROJECT_DIR\/\.claude\/hooks/);
});

test('running twice changes nothing', () => {
  install({ project: root });
  const claudeMd = read('CLAUDE.md');
  const settings = read('.claude/settings.json');
  const second = install({ project: root });
  assert.equal(second.copied.length, 0);
  assert.equal(second.hookAdded, false);
  assert.equal(read('CLAUDE.md'), claudeMd);
  assert.equal(read('.claude/settings.json'), settings);
});

test('keeps existing settings and hooks', () => {
  write('.claude/settings.json', JSON.stringify({
    model: 'opus',
    hooks: {
      PreToolUse: [{ matcher: 'Write', hooks: [{ type: 'command', command: 'lint' }] }],
      SessionStart: [{ hooks: [{ type: 'command', command: 'hello' }] }],
    },
  }));
  install({ project: root });
  const settings = JSON.parse(read('.claude/settings.json'));
  assert.equal(settings.model, 'opus');
  assert.equal(settings.hooks.PreToolUse.length, 2);
  assert.equal(settings.hooks.PreToolUse[0].hooks[0].command, 'lint');
  assert.equal(settings.hooks.SessionStart[0].hooks[0].command, 'hello');
});

test('reads settings saved with a byte order mark', () => {
  write('.claude/settings.json', '﻿{"model":"opus"}');
  install({ project: root });
  assert.equal(JSON.parse(read('.claude/settings.json')).model, 'opus');
});

for (const [name, text] of [['invalid JSON', '{ nope'], ['a non-object', '[]']]) {
  test(`${name} in settings stops the install before anything is written`, () => {
    write('.claude/settings.json', text);
    assert.throws(() => install({ project: root }), /Nothing was changed/);
    assert.equal(read('.claude/settings.json'), text);
    assert.equal(exists('.claude/skills'), false);
    assert.equal(exists('CLAUDE.md'), false);
  });
}

for (const [name, settings] of [
  ['hooks as a string', { hooks: 'abc' }],
  ['hooks as a list', { hooks: [] }],
  ['PreToolUse as an object', { hooks: { PreToolUse: {} } }],
  ['a null PreToolUse entry', { hooks: { PreToolUse: [null] } }],
  ['group hooks that are not a list', { hooks: { PreToolUse: [{ hooks: 'x' }] } }],
  ['a null hook', { hooks: { PreToolUse: [{ hooks: [null] }] } }],
]) {
  test(`${name} in settings stops the install with a clear message`, () => {
    const text = JSON.stringify(settings);
    write('.claude/settings.json', text);
    assert.throws(() => install({ project: root }), /Nothing was changed/);
    assert.equal(read('.claude/settings.json'), text);
    assert.equal(exists('.claude/skills'), false);
  });
}

test('tolerates entries without hooks and hooks without a command', () => {
  write('.claude/settings.json', JSON.stringify({ hooks: { PreToolUse: [{ matcher: 'x' }, { hooks: [{ type: 'prompt' }] }] } }));
  install({ project: root });
  assert.equal(hookGroups('.claude/settings.json').length, 3);
});

for (const [name, text] of [
  ['only a start marker', '# Mine\n<!-- steve:start -->\nmy text\n'],
  ['only an end marker', '# Mine\n<!-- steve:end -->\n'],
  ['markers in the wrong order', '<!-- steve:end -->\nmy text\n<!-- steve:start -->\n'],
  ['two start markers', '<!-- steve:start -->\n<!-- steve:start -->\n<!-- steve:end -->\n'],
]) {
  test(`${name} in CLAUDE.md stops the install before anything is written`, () => {
    write('CLAUDE.md', text);
    assert.throws(() => install({ project: root }), /damaged Steve markers/);
    assert.equal(read('CLAUDE.md'), text);
    assert.equal(exists('.claude'), false);
  });
}

test('keeps Windows line endings in CLAUDE.md, and stays stable when run again', () => {
  write('CLAUDE.md', '# Mine\r\n\r\nRules.\r\n');
  install({ project: root });
  const once = read('CLAUDE.md');
  assert.equal(once.replace(/\r\n/g, '').includes('\n'), false);
  install({ project: root });
  assert.equal(read('CLAUDE.md'), once);
});

test('running twice in user scope changes nothing', () => {
  install({ home: root });
  const second = install({ home: root });
  assert.equal(second.copied.length, 0);
  assert.equal(second.hookAdded, false);
});

test('a second --force keeps the first backup', () => {
  install({ project: root });
  const rel = '.claude/skills/orchestrator/SKILL.md';
  write(rel, 'first edits');
  install({ project: root, force: true });
  write(rel, 'second edits');
  install({ project: root, force: true });
  assert.equal(read(`${rel}.steve-backup`), 'first edits');
  assert.equal(read(`${rel}.steve-backup-2`), 'second edits');
});

test('--force with --dry-run changes nothing', () => {
  install({ project: root });
  const rel = '.claude/skills/orchestrator/SKILL.md';
  write(rel, 'my edits');
  const result = install({ project: root, force: true, dryRun: true });
  assert.ok(result.copied.includes(path.join('skills', 'orchestrator', 'SKILL.md')));
  assert.equal(read(rel), 'my edits');
  assert.equal(exists(`${rel}.steve-backup`), false);
});

for (const [name, args] of [
  ['a misspelled flag', ['--dryrun']],
  ['an extra argument', ['somewhere']],
]) {
  test(`the command line rejects ${name} without installing`, () => {
    const result = spawnSync(process.execPath, [INSTALLER, '--project', root, ...args], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Unknown option/);
    assert.deepEqual(fs.readdirSync(root), []);
  });
}

test('the command line accepts --project=<dir>', () => {
  const result = spawnSync(process.execPath, [INSTALLER, `--project=${root}`], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(exists('.claude/skills/orchestrator/SKILL.md'));
});

test('the command line rejects an empty --project=', () => {
  const result = spawnSync(process.execPath, [INSTALLER, '--project='], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /needs a folder/);
  assert.deepEqual(fs.readdirSync(root), []);
});

test('--project with no folder means the current folder', () => {
  const result = spawnSync(process.execPath, [INSTALLER, '--project', '--dry-run'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes(path.join(fs.realpathSync(root), '.claude')) || result.stdout.includes(path.join(root, '.claude')));
  assert.deepEqual(fs.readdirSync(root), []);
});

for (const [name, target] of [['a missing folder', 'missing'], ['a file', 'file.txt']]) {
  test(`the command line rejects --project pointing at ${name}`, () => {
    write('file.txt', 'x');
    const result = spawnSync(process.execPath, [INSTALLER, '--project', path.join(root, target)], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Project folder not found/);
  });
}

test('keeps surrounding CLAUDE.md text and updates only the Steve section', () => {
  write('CLAUDE.md', '# My team\n\nOur rules.\n');
  install({ project: root });
  const once = read('CLAUDE.md');
  assert.ok(once.startsWith('# My team\n\nOur rules.\n\n<!-- steve:start -->'));

  write('CLAUDE.md', `${once.replace('# Steve\n', '# Old Steve\n')}\nAfter.\n`);
  install({ project: root });
  const updated = read('CLAUDE.md');
  assert.ok(updated.startsWith('# My team'));
  assert.ok(updated.endsWith('After.\n'));
  assert.equal(updated.includes('# Old Steve'), false);
  assert.equal(updated.match(/steve:start/g).length, 1);
});

test('keeps a file you changed unless --force, which saves a backup', () => {
  install({ project: root });
  const rel = '.claude/skills/orchestrator/SKILL.md';
  const original = read(rel);
  write(rel, 'my edits');

  const kept = install({ project: root });
  assert.deepEqual(kept.skipped, [path.join('skills', 'orchestrator', 'SKILL.md')]);
  assert.equal(read(rel), 'my edits');

  install({ project: root, force: true });
  assert.equal(read(rel), original);
  assert.equal(read(`${rel}.steve-backup`), 'my edits');
});

test('the command line installs into the home folder the OS reports', () => {
  // os.homedir() reads USERPROFILE on Windows and HOME elsewhere, so set both.
  const result = spawnSync(process.execPath, [INSTALLER], {
    env: { ...process.env, HOME: root, USERPROFILE: root },
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(exists('.claude/skills/orchestrator/SKILL.md'));
  assert.ok(result.stdout.includes(path.join(root, '.claude')));
});

test('the command line reports a broken settings file and fails', () => {
  write('.claude/settings.json', '{ nope');
  const result = spawnSync(process.execPath, [INSTALLER, '--project', root], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Nothing was changed/);
});

test('dry run writes nothing', () => {
  const result = install({ project: root, dryRun: true });
  assert.ok(result.copied.length > 0);
  assert.deepEqual(fs.readdirSync(root), []);
});
