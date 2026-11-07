#!/usr/bin/env node
// Show what a style looks like: renders a still of its built-in demo (no files needed).
//   node preview.mjs C1            → ./istayle-previews/C1.jpg
//   node preview.mjs C1,G6,H9      → several + contact sheet
//   node preview.mjs all [--out dir] [--scale 0.5]
import fs from 'node:fs';
import path from 'node:path';
import {bundle, contactSheet, remotion, requireEngine} from './common.mjs';

const args = process.argv.slice(2);
if (!args[0]) {
  console.error('usage: node preview.mjs <ID[,ID...]|all> [--out dir] [--scale 0.5]');
  process.exit(1);
}
requireEngine();
const opt = (k, d) => (args.indexOf(k) >= 0 ? args[args.indexOf(k) + 1] : d);
const outDir = path.resolve(opt('--out', 'istayle-previews'));
const scale = opt('--scale', '0.5');
fs.mkdirSync(outDir, {recursive: true});
const log = path.join(outDir, 'preview.log');
const entry = bundle(log);

// "P-C1   30   1080x1920   120 (4.00 sec)"
const comps = new Map();
for (const line of remotion(['compositions', entry], log).split('\n')) {
  const m = line.trim().match(/^P-(\S+)\s+(\d+)\s+\d+x\d+\s+(\d+)/);
  if (m) comps.set(m[1], {fps: Number(m[2]), frames: Number(m[3])});
}
const ids = args[0] === 'all' ? [...comps.keys()] : args[0].split(',').map((s) => s.trim().toUpperCase());

// moment to capture (seconds); default = 82% through the demo
const AT = {C4: 1.13, J10: 0.6, A4: 2.4, B1: 2.6, J1: 1.8, J8: 1.8, K3: 1.2, J11: 2.2};
const done = [];
for (const id of ids) {
  const c = comps.get(id);
  if (!c) {
    console.error(`${id}: no template yet (see: node style.mjs ${id})`);
    continue;
  }
  const t = /^H\d/.test(id) ? 1.12 : /^G\d/.test(id) ? 1.45 : /^I\d/.test(id) ? 0.6 : AT[id];
  const frame = Math.min(c.frames - 1, t != null ? Math.round(t * c.fps) : Math.round(c.frames * 0.82));
  const out = path.join(outDir, `${id}.jpg`);
  remotion(['still', entry, `P-${id}`, out, `--frame=${frame}`, `--scale=${scale}`, '--log=error'], log);
  done.push(out);
}
const sheet = done.length > 1 ? contactSheet(done, path.join(outDir, '_sheet.jpg'), 6) : null;
console.log(`${done.length} preview(s) in ${outDir}${sheet ? `\nsheet: ${sheet}` : ''}`);
