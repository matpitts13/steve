// Keeps the package self-contained: no leftovers from one machine, and no links to tools that aren't included.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const REPO = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHIPPED = ['skills', 'commands', 'agents', 'hooks', 'templates'];
const LEFTOVERS = /graphify|chronicle|setup-machine|NEW_MACHINE|graph first|knowledge graph|no-comment rule|C:\\Users|~\/\.claude\/projects|```powershell|\.ps1\b|\/schedule\b|\/security-review|\/fewer-permission|\/review ultra|Artifact page/i;

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
const files = SHIPPED.flatMap((dir) => walk(path.join(REPO, dir)));

test('shipped files have no machine-specific or missing-tool references', () => {
  const hits = files.filter((file) => LEFTOVERS.test(fs.readFileSync(file, 'utf8')));
  assert.deepEqual(hits.map((file) => path.relative(REPO, file)), []);
});

test('every skill has a name that matches its folder, and a description', () => {
  for (const file of files.filter((f) => path.basename(f) === 'SKILL.md')) {
    const text = fs.readFileSync(file, 'utf8');
    assert.equal(text.match(/^name: (.+)$/m)?.[1].trim(), path.basename(path.dirname(file)), file);
    assert.match(text, /^description: .+$/m, file);
  }
});

test('every command listed in the instructions exists', () => {
  const template = fs.readFileSync(path.join(REPO, 'templates', 'CLAUDE.steve.md'), 'utf8');
  const listed = [...template.matchAll(/^- `\/([a-z-]+)`/gm)].map((match) => match[1]);
  assert.ok(listed.length > 0);
  for (const name of listed) {
    const asCommand = fs.existsSync(path.join(REPO, 'commands', `${name}.md`));
    const asSkill = fs.existsSync(path.join(REPO, 'skills', name, 'SKILL.md'));
    assert.ok(asCommand || asSkill, `/${name} not found`);
  }
  for (const file of fs.readdirSync(path.join(REPO, 'commands'))) {
    const name = file.replace(/\.md$/, '');
    assert.ok(listed.includes(name), `/${name} missing from the instructions`);
  }
});
