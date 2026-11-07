#!/usr/bin/env node
// Look up styles without reading the whole catalog.
//   node style.mjs --list            menu, one line per style
//   node style.mjs --list C          one category (A–K, U)
//   node style.mjs --templates       only styles that render now
//   node style.mjs C1                one style + its props
//   node style.mjs paper scrapbook   search names and aliases
import fs from 'node:fs';
import path from 'node:path';
import {SKILL} from './common.mjs';

const CATS = {A: 'Ad formats', B: '2D motion graphics', C: 'Paper & craft', D: '3D & 2.5D', E: 'AI looks', F: 'Product showcase', G: 'Captions & text', H: 'Transitions', I: 'Overlays', J: 'Hooks', K: 'CTA & end cards', U: 'Utility'};
const rows = fs
  .readFileSync(path.join(SKILL, 'catalog', 'STYLES.md'), 'utf8')
  .split('\n')
  .filter((l) => /^\| [A-Z]\d+ \|/.test(l))
  .map((l) => {
    const [id, name, kind, aliases, look, best, how] = l.split('|').slice(1, -1).map((s) => s.trim());
    return {id, name, kind, aliases, look, best, how};
  });
const one = (r) => `${r.id.padEnd(4)} ${r.name.padEnd(30)} [${r.kind}]`;
const args = process.argv.slice(2);

if (!args.length || args[0] === '--list' || args[0] === '--templates') {
  const only = args[0] === '--list' && args[1] ? args[1].toUpperCase() : null;
  const tpl = args[0] === '--templates';
  for (const [k, title] of Object.entries(CATS)) {
    if (only && k !== only) continue;
    const list = rows.filter((r) => r.id[0] === k && (!tpl || r.kind === 'template'));
    if (!list.length) continue;
    console.log(`\n${k}. ${title}`);
    list.forEach((r) => console.log(`  ${one(r)}`));
  }
  const n = rows.filter((r) => r.kind === 'template').length;
  console.log(`\n${rows.length} styles · ${n} templates render now`);
  process.exit(0);
}

const q = args.join(' ').trim();
const exact = rows.find((r) => r.id.toUpperCase() === q.toUpperCase());
if (exact) {
  const r = exact;
  console.log(`${r.id} · ${r.name} · ${r.kind}\nlooks:    ${r.look}\nbest for: ${r.best}\nhow:      ${r.how}`);
  const props = fs.readFileSync(path.join(SKILL, 'reference', 'props.md'), 'utf8').split(/\n(?=## )/);
  const sec = props.find((s) => s.startsWith('## ') && new RegExp(`\\b${r.id}\\b`).test(s.split('\n')[0]));
  if (sec) console.log(`\n${sec.trim()}`);
  process.exit(0);
}

const toks = q.toLowerCase().split(/[\s,+]+/).filter(Boolean);
const scored = rows
  .map((r) => {
    const hay = `${r.name} ${r.aliases}`.toLowerCase();
    const soft = `${r.look} ${r.best}`.toLowerCase();
    const s = toks.reduce((a, t) => a + (hay.includes(t) ? 3 : 0) + (soft.includes(t) ? 1 : 0), 0) + (hay.includes(q.toLowerCase()) ? 3 : 0);
    return {r, s};
  })
  .filter((x) => x.s > 0)
  .sort((a, b) => b.s - a.s || (a.r.kind === 'template' ? -1 : 1))
  .slice(0, 8);
if (!scored.length) console.log(`no style matches "${q}". Try: node style.mjs --list`);
scored.forEach(({r}) => console.log(`${one(r)}  ${r.look}`));
