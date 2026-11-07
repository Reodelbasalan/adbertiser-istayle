// Synthesizes the basic SFX kit with ffmpeg (original sounds: no samples, no licenses to worry about).
// Swap in your own: drop a .wav with the same name into <engine>/public/sfx/.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

// name: [aevalsrc expression, seconds, extra filters]
export const SFX = {
  whoosh: ['(2*random(0)-1)*pow(sin(PI*t/0.55),2)', 0.55, 'highpass=f=250,lowpass=f=3200,volume=2.2'],
  whoosh_fast: ['(2*random(0)-1)*pow(sin(PI*t/0.3),2)', 0.3, 'highpass=f=400,lowpass=f=4500,volume=2.2'],
  whoosh_soft: ['(2*random(0)-1)*pow(sin(PI*t/0.75),2)', 0.75, 'highpass=f=200,lowpass=f=1500,volume=1.6'],
  whoosh_low: ['(2*random(0)-1)*pow(sin(PI*t/0.9),2)', 0.9, 'lowpass=f=600,volume=3'],
  pop: ['0.9*sin(2*PI*(900*t-2500*t*t))*exp(-t*38)', 0.14, 'volume=1'],
  click: ['(2*random(0)-1)*exp(-t*380)', 0.05, 'highpass=f=1800,volume=1.5'],
  impact: ['0.95*sin(2*PI*(120*t-150*t*t))*exp(-t*8)+0.35*(2*random(0)-1)*exp(-t*28)', 0.7, 'lowpass=f=2000,volume=1.2'],
  glitch: ['0.6*(2*random(0)-1)*gt(sin(2*PI*17*t),0)', 0.32, 'acrusher=bits=4:samples=24:mix=1,volume=1.2'],
  shutter: ['(2*random(0)-1)*(exp(-t*260)+0.8*gte(t,0.07)*exp(-(t-0.07)*260))', 0.2, 'highpass=f=1200,lowpass=f=6000,volume=2'],
  sparkle: ['0.3*sin(2*PI*2600*t)*exp(-t*10)+0.25*gte(t,0.07)*sin(2*PI*3520*t)*exp(-(t-0.07)*12)+0.2*gte(t,0.14)*sin(2*PI*4400*t)*exp(-(t-0.14)*14)', 0.7, 'volume=1.4'],
  ding: ['0.6*sin(2*PI*1320*t)*exp(-t*4.5)+0.22*sin(2*PI*2640*t)*exp(-t*7)', 1.0, 'volume=1'],
  rip: ['(2*random(0)-1)*(0.45+0.55*abs(sin(2*PI*38*t)))*pow(sin(PI*t/0.45),0.6)', 0.45, 'highpass=f=900,lowpass=f=7000,volume=1.6'],
  paper: ['(2*random(0)-1)*gt(random(1),0.8)*exp(-t*3.5)', 0.45, 'highpass=f=1200,volume=2'],
  typing: ['(2*random(0)-1)*exp(-mod(t,0.085)*260)', 0.85, 'highpass=f=1500,volume=1.2'],
  scribble: ['(2*random(0)-1)*(0.35+0.65*abs(sin(2*PI*6*t)))*pow(sin(PI*t/0.5),0.5)', 0.5, 'highpass=f=1800,lowpass=f=6500,volume=1'],
  notif: ['0.5*lt(t,0.12)*sin(2*PI*880*t)*exp(-t*14)+0.5*gte(t,0.1)*sin(2*PI*1320*t)*exp(-(t-0.1)*9)', 0.55, 'volume=1'],
  error: ['0.5*(sin(2*PI*150*t)+0.6*sin(2*PI*300*t)+0.3*sin(2*PI*450*t))*(lt(t,0.13)+gte(t,0.18)*lt(t,0.34))', 0.36, 'lowpass=f=2200,volume=0.6'],
  tick: ['0.8*sin(2*PI*2400*t)*exp(-t*120)+0.4*(2*random(0)-1)*exp(-t*400)', 0.06, 'highpass=f=900,volume=1.3'],
  riser: ['(2*random(0)-1)*pow(t/1.2,2)*0.7+0.2*sin(2*PI*(200*t+250*t*t))*(t/1.2)', 1.2, 'highpass=f=300,volume=1.4'],
};

export function makeSfx(dir, {force = false} = {}) {
  fs.mkdirSync(dir, {recursive: true});
  let made = 0;
  for (const [name, [expr, d, af]] of Object.entries(SFX)) {
    const out = path.join(dir, `${name}.wav`);
    if (!force && fs.existsSync(out)) continue;
    const r = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', `aevalsrc='${expr}':s=44100:d=${d}`, '-af', `${af},afade=t=out:st=${Math.max(0, d - 0.04).toFixed(2)}:d=0.04,alimiter=limit=0.9`, '-ac', '1', '-c:a', 'pcm_s16le', out], {encoding: 'utf8'});
    if (r.status === 0) made++;
    else console.error(`sfx ${name}: ${(r.stderr ?? '').slice(0, 300)}`);
  }
  return made;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const dir = process.argv[2] ?? 'sfx';
  console.log(`made ${makeSfx(dir, {force: process.argv.includes('--force')})} sounds in ${dir}`);
}
