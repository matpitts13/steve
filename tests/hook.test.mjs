import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { check } from '../hooks/block-dangerous.mjs';

const HOOK = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'hooks', 'block-dangerous.mjs');

const run = (input) => spawnSync(process.execPath, [HOOK], { input, encoding: 'utf8' });

for (const command of [
  'git push --force',
  'git push origin main -f',
  'git reset --hard HEAD~1',
  'git clean -fd',
  'git rebase main',
  'rm -rf /',
  'rm -rf ~',
  'rm -rf $HOME',
  'psql -c "DROP TABLE users"',
  'sqlite3 app.db "delete from users;"',
  'git commit --no-verify -m x',
  'git add .env',
  'git add config/credentials.json',
  'git add server.PEM',
  'git add .',
  'git add -A',
  'git add --all',
  'git add .env.local',
  'git -C app add secrets.yml',
  'git -C app push --force',
  'git push -fu origin main',
  'git push origin +main',
  'git reset HEAD~1 --hard',
  'git clean --force',
  'rm -rf /*',
  'rm -rf ~/',
  'rm -rf ~/*',
  'rm -rf "$HOME"',
  'rm -fr /',
  'rm -r -f /',
  'Remove-Item -Force -Recurse C:\\Windows',
  'DROP DATABASE app',
  'TRUNCATE users',
  'psql -c "TRUNCATE TABLE users"',
  'psql -c "DELETE FROM public.users;"',
  "sqlite3 db 'delete from t'",
  'psql -c "truncate table users"',
  'git add a.ts && git add .',
  'git -C "dir with space" push -f',
  'rm -rf /;',
  '(rm -rf ~)',
]) {
  test(`asks before: ${command}`, () => {
    assert.match(check(command), /^Steve safety:/);
  });
}

for (const command of [
  'git push',
  'git push --force-with-lease',
  'git push origin feature-x',
  'git rebase --abort',
  'git reset --soft HEAD~1',
  'rm -rf dist',
  'rm -rf ./build',
  'DELETE FROM users WHERE id = 1',
  'git add src/app.ts',
  'npm test',
  'git add .env.example',
  'git add x.txt && cat .env',
  'git push --force-if-includes',
  'git push origin feature-f',
  'git push --follow-tags',
  'git rebase --continue',
  'git commit -m "explain why we rebase and reset --hard"',
  'rm -rf /tmp/build',
  'rm -rf ~/project/dist',
  'truncate -s 0 app.log',
  'truncate app.log -s 0',
  'git commit -m "fix: truncate titles"',
  'grep truncate src/',
  'git add a.ts\ngit commit -m "don\'t log credentials\n* first . item"',
]) {
  test(`stays quiet on: ${command}`, () => {
    assert.equal(check(command), null);
  });
}

test('a very long command is checked quickly', () => {
  const started = Date.now();
  check(`git ${'-c '.repeat(5000)}status`);
  check(`rm -${'r'.repeat(5000)}x /tmp`);
  assert.ok(Date.now() - started < 1000);
});

test('a match returns an "ask" decision to Claude Code', () => {
  const result = run(JSON.stringify({ tool_input: { command: 'git reset --hard' } }));
  assert.equal(result.status, 0);
  const output = JSON.parse(result.stdout).hookSpecificOutput;
  assert.equal(output.hookEventName, 'PreToolUse');
  assert.equal(output.permissionDecision, 'ask');
  assert.match(output.permissionDecisionReason, /irreversibly/);
});

for (const [name, input] of [
  ['a safe command', JSON.stringify({ tool_input: { command: 'npm test' } })],
  ['invalid JSON', 'not json'],
  ['empty input', ''],
  ['JSON null', 'null'],
  ['a missing command', JSON.stringify({ tool_input: {} })],
  ['a non-string command', JSON.stringify({ tool_input: { command: 5 } })],
]) {
  test(`exits silently on ${name}`, () => {
    const result = run(input);
    assert.equal(result.status, 0);
    assert.equal(result.stdout, '');
  });
}
