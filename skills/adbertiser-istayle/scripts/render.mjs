#!/usr/bin/env node
// Render a job file.
//   node render.mjs <job.json> --stills 0.5,3,7   preview stills + contact sheet (fast, do this first)
//   node render.mjs <job.json> [--out file.mp4]   full MP4, mastered to -14 LUFS / -1 dBTP when ffmpeg exists
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {ENGINE, bundle, contactSheet, ffmpeg, has, remotion, requireEngine, slug} from './common.mjs';

const args = process.argv.slice(2);
const opt = (k) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : undefined;
};
if (!args[0] || args[0].startsWith('--')) {
  console.error('usage: node render.mjs <job.json> [--stills 1,3.5] [--out out.mp4] [--concurrency N]');
  process.exit(1);
}
requireEngine();

const jobPath = path.resolve(args[0]);
const base = path.dirname(jobPath);
const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
if (!Array.isArray(job.scenes) || !job.scenes.length) throw new Error('job.scenes is empty');
const name = slug(job.name ?? path.basename(jobPath, '.json'));
const fps = job.fps ?? 30;

// 1. stage local files into the engine's public folder
// one job at a time: old staged jobs are cleared so bundles stay small
const stage = path.join(ENGINE, 'public', 'jobs', name);
fs.rmSync(path.join(ENGINE, 'public', 'jobs'), {recursive: true, force: true});
fs.mkdirSync(stage, {recursive: true});
const MEDIA = /\.(png|jpe?g|webp|gif|svg|avif|mp4|webm|mov|m4v|mp3|wav|m4a|aac|ogg|flac)$/i;
const staged = new Map();
const missing = [];
const walk = (v) => {
  if (typeof v === 'string') {
    if (!MEDIA.test(v) || /^(https?:|data:|demo:)/.test(v)) return v;
    const src = path.resolve(base, v);
    if (!fs.existsSync(src)) {
      missing.push(v);
      return v;
    }
    if (!staged.has(src)) {
      const file = `${staged.size}_${path.basename(src).replace(/[^\w.-]+/g, '_')}`;
      fs.copyFileSync(src, path.join(stage, file));
      staged.set(src, `jobs/${name}/${file}`);
    }
    return staged.get(src);
  }
  if (Array.isArray(v)) return v.map(walk);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === 'style' || k === 'transition' ? x : walk(x)]));
  return v;
};
const props = walk(job);
if (missing.length) {
  console.error(`missing files (paths are relative to the job file):\n  ${missing.join('\n  ')}`);
  process.exit(1);
}

// 2. captions: words file → [{w,s,e}] (accepts {w,s,e}, {word,start,end} or Whisper-style segments)
if (props.captions?.file) {
  const raw = JSON.parse(fs.readFileSync(path.resolve(base, job.captions.file), 'utf8'));
  const flat = (Array.isArray(raw) ? raw : raw.segments ?? raw.words ?? []).flatMap((x) => (Array.isArray(x.words) ? x.words : [x]));
  props.captions.words = flat
    .map((x) => ({w: String(x.w ?? x.word ?? x.text ?? '').trim(), s: Number(x.s ?? x.start), e: Number(x.e ?? x.end)}))
    .filter((x) => x.w && Number.isFinite(x.s) && Number.isFinite(x.e));
  delete props.captions.file;
}

// 3. which SFX exist
const sfxDir = path.join(ENGINE, 'public', 'sfx');
props.sfxAvailable = fs.existsSync(sfxDir) ? fs.readdirSync(sfxDir).filter((f) => f.endsWith('.wav')).map((f) => f.slice(0, -4)) : [];

const propsFile = path.join(stage, 'props.json');
fs.writeFileSync(propsFile, JSON.stringify(props));
const log = path.join(stage, 'render.log');
const outDir = path.join(base, 'out');
fs.mkdirSync(outDir, {recursive: true});
const total = job.scenes.reduce((a, s) => a + s.dur, 0);
const entry = path.join(ENGINE, 'src', 'index.ts');

// 4a. stills
const stills = opt('--stills');
if (stills) {
  const files = [];
  const serve = bundle(log);
  for (const t of stills.split(',').map(Number).filter((x) => Number.isFinite(x))) {
    const frame = Math.min(Math.round(t * fps), Math.round(total * fps) - 1);
    const out = path.join(outDir, `${name}_${t}s.jpg`);
    remotion(['still', serve, 'Istayle', out, `--props=${propsFile}`, `--frame=${frame}`, '--scale=0.5', '--log=error'], log);
    files.push(out);
  }
  const sheet = contactSheet(files, path.join(outDir, `${name}_sheet.jpg`));
  console.log(`stills:\n  ${files.join('\n  ')}${sheet ? `\nsheet: ${sheet}` : ''}`);
  process.exit(0);
}

// 4b. full render
const final = path.resolve(opt('--out') ?? path.join(outDir, `${name}.mp4`));
const raw = path.join(os.tmpdir(), `istayle-${name}-${Date.now()}.mp4`);
const conc = opt('--concurrency') ?? String(Math.max(1, Math.min(6, Math.floor(os.cpus().length / 2))));
const t0 = Date.now();
remotion(['render', entry, 'Istayle', raw, `--props=${propsFile}`, `--concurrency=${conc}`, '--log=error'], log);
let mastered = false;
if (has('ffmpeg')) {
  const r = ffmpeg(['-i', raw, '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', final]);
  mastered = r.status === 0;
}
if (!mastered) fs.copyFileSync(raw, final);
fs.rmSync(raw, {force: true});
console.log(`done in ${Math.round((Date.now() - t0) / 1000)} s: ${final}${mastered ? ' (mastered -14 LUFS)' : ''}`);
