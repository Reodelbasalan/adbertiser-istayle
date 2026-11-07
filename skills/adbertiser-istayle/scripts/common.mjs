// Shared helpers for the Adbertiser Istayle scripts.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const SKILL = path.join(HERE, '..');
export const SRC_ENGINE = path.join(SKILL, 'engine');
export const ENGINE = process.env.ISTAYLE_ENGINE || path.join(os.homedir(), '.adbertiser-istayle', 'engine');
export const CLI = path.join(ENGINE, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');

export const engineReady = () => fs.existsSync(CLI);

export const requireEngine = () => {
  if (!engineReady()) {
    console.error(`Engine not set up at ${ENGINE}\nRun first:  node "${path.join(HERE, 'setup.mjs')}"`);
    process.exit(1);
  }
};

export const has = (bin) => spawnSync(bin, ['-version'], {stdio: 'ignore'}).status === 0;

/** run the Remotion CLI quietly; full output goes to logFile */
export const remotion = (args, logFile) => {
  const r = spawnSync(process.execPath, [CLI, ...args], {cwd: ENGINE, encoding: 'utf8', maxBuffer: 1 << 28});
  const out = `${r.stdout ?? ''}\n${r.stderr ?? ''}`;
  if (logFile) fs.appendFileSync(logFile, `\n$ remotion ${args.join(' ')}\n${out}`);
  if (r.status !== 0) {
    console.error(out.trim().split('\n').slice(-25).join('\n'));
    throw new Error(`remotion ${args[0]} failed (exit ${r.status})`);
  }
  return out;
};

/** bundle once (≈20 s), then many stills render from it quickly */
export const bundle = (log) => {
  remotion(['bundle', path.join(ENGINE, 'src', 'index.ts'), '--log=error'], log);
  return path.join(ENGINE, 'build');
};

export const ffmpeg = (args) => spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], {encoding: 'utf8'});

/** paste stills into one contact sheet (≤2000 px wide) */
export const contactSheet = (files, out, cols = 4) => {
  if (!files.length || !has('ffmpeg')) return null;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'istayle-sheet-'));
  files.forEach((f, i) => fs.copyFileSync(f, path.join(tmp, `${String(i).padStart(3, '0')}.jpg`)));
  const c = Math.min(cols, files.length);
  const rows = Math.ceil(files.length / c);
  const w = Math.floor(2000 / c) - 8;
  const r = ffmpeg(['-i', path.join(tmp, '%03d.jpg'), '-vf', `scale=${w}:-2,tile=${c}x${rows}:padding=6:margin=6:color=white`, '-frames:v', '1', '-q:v', '3', out]);
  fs.rmSync(tmp, {recursive: true, force: true});
  return r.status === 0 ? out : null;
};

export const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'job';
