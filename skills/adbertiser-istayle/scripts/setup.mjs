#!/usr/bin/env node
// One-time setup: copies the engine to ~/.adbertiser-istayle/engine (or $ISTAYLE_ENGINE),
// installs Remotion, and synthesizes the SFX kit. Safe to re-run after updating the skill.
import {spawnSync} from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {CLI, ENGINE, HERE, SRC_ENGINE, has} from './common.mjs';
import {makeSfx} from './sfx.mjs';

if (Number(process.versions.node.split('.')[0]) < 18) {
  console.error(`Node.js 18+ needed (you have ${process.versions.node}).`);
  process.exit(1);
}

const same = path.resolve(ENGINE) === path.resolve(SRC_ENGINE);
if (!same) {
  fs.mkdirSync(ENGINE, {recursive: true});
  fs.cpSync(SRC_ENGINE, ENGINE, {
    recursive: true,
    filter: (src) => {
      const rel = path.relative(SRC_ENGINE, src).split(path.sep);
      return !['node_modules', 'out'].includes(rel[0]) && !(rel[0] === 'public' && ['jobs', 'sfx'].includes(rel[1]));
    },
  });
  console.log(`engine copied to ${ENGINE}`);
}

const hash = crypto.createHash('sha1').update(fs.readFileSync(path.join(ENGINE, 'package.json'))).digest('hex');
const stamp = path.join(ENGINE, '.pkg-hash');
const stale = !fs.existsSync(stamp) || fs.readFileSync(stamp, 'utf8') !== hash;
if (!fs.existsSync(CLI) || (!same && stale)) {
  console.log('installing Remotion (first time takes a few minutes)...');
  const win = process.platform === 'win32';
  const r = spawnSync(win ? 'npm.cmd' : 'npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], {cwd: ENGINE, stdio: 'inherit', shell: win});
  if (r.status !== 0) {
    console.error('npm install failed');
    process.exit(1);
  }
  fs.writeFileSync(stamp, hash);
}

if (has('ffmpeg')) {
  const made = makeSfx(path.join(ENGINE, 'public', 'sfx'));
  console.log(`sfx kit ready (${made} new)`);
} else {
  console.log('ffmpeg not found: videos render without SFX and without the -14 LUFS master. Install ffmpeg, then re-run setup.');
}

console.log(`\nAdbertiser Istayle is ready.\nengine: ${ENGINE}\nnext:   node "${path.join(HERE, 'render.mjs')}" <job.json> --stills 1,3`);
