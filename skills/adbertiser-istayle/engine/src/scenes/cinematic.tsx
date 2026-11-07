import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Media} from '../lib/Media';
import {alpha, ease, lin, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Cinematic film look: B38 cinematic title · B39 graded shot with subtitle · B40 trailer statement · B41 trailer word flash · K13 cinematic end card.
// Letterbox bars, film grade, grain, light leaks; serif titles with wide tracking.
type P = Record<string, any>;

const GRADES: Record<string, string> = {
  warm: 'contrast(1.12) saturate(1.15) sepia(.18) brightness(.95)',
  teal: 'contrast(1.15) saturate(1.1) hue-rotate(-8deg) brightness(.92)',
  mono: 'grayscale(1) contrast(1.25) brightness(.95)',
  none: 'none',
};
export const grade = (g?: string) => GRADES[g ?? 'warm'] ?? GRADES.warm;

/** 2.39:1 letterbox bars (slide in over `k`) */
export const Letterbox: React.FC<{k?: number; ratio?: number}> = ({k = 1, ratio = 2.39}) => {
  return (
    <AbsoluteFill style={{pointerEvents: 'none', containerType: 'size'}}>
      <BarPair k={k} ratio={ratio} />
    </AbsoluteFill>
  );
};
const BarPair: React.FC<{k: number; ratio: number}> = ({k, ratio}) => {
  const L = useLayout();
  // portrait: bars frame a wide band in the middle; landscape: classic scope bars
  const band = L.portrait ? L.W / 1.25 : L.W / ratio;
  const bar = Math.max(0, (L.H - band) / 2) * (L.portrait ? 0.55 : 1) * k;
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: bar, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: bar, background: '#000'}} />
    </>
  );
};

/** animated film grain + soft light leak */
export const FilmFx: React.FC<{f: number; u: number; leak?: boolean; grain?: number; leakColor?: string}> = ({f, u, leak = true, grain = 0.12, leakColor = '#FF8A3D'}) => {
  const x = 20 + Math.sin(f / 37) * 30;
  const y = 30 + Math.cos(f / 53) * 25;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {leak && <AbsoluteFill style={{background: `radial-gradient(circle at ${x}% ${y}%, ${alpha(leakColor, 0.35 + 0.15 * Math.sin(f / 9))}, transparent 45%)`, mixBlendMode: 'screen'}} />}
      <AbsoluteFill style={{opacity: grain, backgroundImage: 'repeating-radial-gradient(circle at 17% 32%, rgba(255,255,255,.5) 0 1px, transparent 1px 3px)', backgroundSize: `${180 + (f % 3) * 7}px ${180 + (f % 5) * 5}px`, backgroundPosition: `${random(`gx${f}`) * 100}% ${random(`gy${f}`) * 100}%`, mixBlendMode: 'overlay'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%)'}} />
      {/* dust specks */}
      {range(5).map((i) => (random(`d${i}${Math.floor(f / 2)}`) > 0.75 ? <div key={i} style={{position: 'absolute', left: `${random(`dx${i}${f}`) * 100}%`, top: `${random(`dy${i}${f}`) * 100}%`, width: 3 * u, height: (4 + random(`dh${i}${f}`) * 10) * u, background: 'rgba(255,255,255,.5)', borderRadius: 2 * u}} /> : null))}
    </AbsoluteFill>
  );
};

/** serif title with wide tracking that settles in (blur + letter-spacing) */
const SerifReveal: React.FC<{text: string; size: number; at: number; color?: string; italic?: boolean}> = ({text, size, at, color = '#F5EFE6', italic}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const k = ease(f, at, at + 22);
  return (
    <div style={{fontFamily: b.fSerif, fontStyle: italic ? 'italic' : 'normal', fontWeight: 700, fontSize: size, lineHeight: 1.08, color, letterSpacing: `${(0.32 - 0.2 * k) * size * 0.4}px`, opacity: k, filter: `blur(${(1 - k) * 12 * L.u}px)`, textAlign: 'center', textShadow: '0 4px 30px rgba(0,0,0,.6)', textTransform: italic ? 'none' : 'uppercase'}}>{text}</div>
  );
};

/* ---------------- B38 cinematic title ---------------- */

/** B38: letterbox bars close in over graded footage; a serif title settles with wide tracking */
export const CineTitle: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const lines = txt(p.title, 'Isang ad.|Isang kwento.').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const sub = txt(p.sub, '');
  const longest = Math.max(6, ...lines.map((l) => l.length));
  const size = Math.min(L.portrait ? 120 * L.u : 110 * L.u, ((L.W * 0.86) / longest) * 1.5);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, filter: grade(p.grade)}}>
        <Media src={p.media ?? 'demo:🌄:25'} zoom="in" dim={0.35} />
      </div>
      <FilmFx f={f} u={L.u} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 * L.u, padding: `0 ${L.pad}px`}}>
        {lines.map((l, i) => (
          <SerifReveal key={i} text={l} size={size} at={6 + i * 10} />
        ))}
        {sub && <div style={{marginTop: 24 * L.u}}><SerifReveal text={sub} size={42 * L.u} at={6 + lines.length * 10 + 6} italic color={alpha('#F5EFE6', 0.85)} /></div>}
      </AbsoluteFill>
      <Letterbox k={ease(f, 0, 14)} />
    </AbsoluteFill>
  );
};

/* ---------------- B39 graded shot ---------------- */

/** B39: your footage, film-graded, slow push-in, letterboxed, with a movie-style subtitle line */
export const CineShot: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const line = txt(p.line, '');
  const lk = ease(f, 8, 20);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, filter: grade(p.grade)}}>
        <Media src={p.media ?? 'demo:🏙️:200'} zoom={p.zoom ?? 'in'} />
      </div>
      <FilmFx f={f} u={L.u} leak={p.leak !== false} />
      <Letterbox />
      {line && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.66 : L.H * 0.78, textAlign: 'center', fontFamily: b.fSerif, fontStyle: 'italic', fontWeight: 700, fontSize: (L.portrait ? 52 : 46) * L.u, color: '#F5EFE6', opacity: lk, textShadow: '0 2px 12px rgba(0,0,0,.9)'}}>{line}</div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- B40 trailer statement ---------------- */

/** B40: black screen, a statement fades in word by word ("Ngayong taon... isang ad ang magbabago"), soft flare */
export const CineStatement: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const text = txt(p.text, 'Isang ad lang ang kailangan');
  const words = text.split(/\s+/).filter(Boolean);
  const per = Math.max(3, Math.min(8, Math.floor((dur * 0.6) / Math.max(1, words.length))));
  const size = Math.min(120 * L.u, ((L.W * 0.84) / Math.max(8, Math.min(text.length, 22))) * 2.0);
  const flare = lin(f, 0, dur, -30, 130);
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 6% at ${flare}% 50%, rgba(255,214,170,.35), transparent 70%)`, mixBlendMode: 'screen'}} />
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.32, rowGap: size * 0.1, padding: `0 ${L.pad}px`}}>
        {words.map((w, i) => {
          const k = ease(f, 4 + i * per, 4 + i * per + 12);
          return (
            <span key={i} style={{fontFamily: b.fSerif, fontWeight: 700, fontSize: size, color: '#F5EFE6', opacity: k, filter: `blur(${(1 - k) * 10 * L.u}px)`, letterSpacing: 2 * L.u, textTransform: 'uppercase'}}>{w}</span>
          );
        })}
      </div>
      <FilmFx f={f} u={L.u} leak={false} grain={0.08} />
    </AbsoluteFill>
  );
};

/* ---------------- B41 trailer word flash ---------------- */

export const flashWords = (p: P): string[] => (Array.isArray(p.words) && p.words.length ? p.words : ['Mas malinaw.', 'Mas mabilis.', 'Mas mabenta.']).slice(0, 5).map(String);
export const flashTimes = (n: number, dur: number) => range(n).map((i) => Math.round((i * dur) / Math.max(1, n)));

/** B41: trailer-style hard cuts of big serif words, each with a white flash and a bass hit */
export const CineFlash: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const words = flashWords(p);
  const ts = flashTimes(words.length, dur);
  let cur = 0;
  ts.forEach((t, i) => {
    if (f >= t) cur = i;
  });
  const local = f - ts[cur];
  const w = words[cur];
  const size = Math.min(150 * L.u, ((L.W * 0.86) / Math.max(5, w.length)) * 1.55);
  const flash = Math.max(0, 1 - local / 5);
  const zoom = 1 + local * 0.004;
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
      {p.media && <div style={{position: 'absolute', inset: 0, filter: grade(p.grade), opacity: 0.35}}><Media src={p.media} zoom="in" /></div>}
      <div style={{fontFamily: b.fSerif, fontWeight: 900, fontSize: size, color: '#F5EFE6', letterSpacing: 4 * L.u, textTransform: 'uppercase', transform: `scale(${zoom})`, textShadow: '0 0 40px rgba(255,220,180,.25)', textAlign: 'center', padding: `0 ${L.pad}px`}}>{w}</div>
      <AbsoluteFill style={{background: '#FFF7EA', opacity: flash * 0.85}} />
      <FilmFx f={f} u={L.u} leak={false} grain={0.1} />
      <Letterbox />
    </AbsoluteFill>
  );
};

/* ---------------- K13 cinematic end card ---------------- */

/** K13: brand name in wide-tracked serif, a thin rule, the CTA and a date-style line, with a light sweep */
export const CineEnd: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const name = txt(p.name, b.name);
  const cta = txt(p.cta, b.cta);
  const line = txt(p.line, 'Ngayon na.');
  const size = Math.min(130 * L.u, ((L.W * 0.86) / Math.max(5, name.length)) * 1.5);
  const sweep = lin(f, 10, 10 + L.fps, -40, 140);
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26 * L.u}}>
      <div style={{position: 'relative', overflow: 'hidden'}}>
        <SerifReveal text={name} size={size} at={2} />
        <div style={{position: 'absolute', top: 0, bottom: 0, width: '30%', left: `${sweep}%`, background: 'linear-gradient(90deg, transparent, rgba(255,240,215,.45), transparent)', mixBlendMode: 'screen'}} />
      </div>
      <div style={{width: L.W * 0.4 * ease(f, 12, 26), height: 2 * L.u, background: alpha('#F5EFE6', 0.7)}} />
      {cta && <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: 40 * L.u, letterSpacing: 10 * L.u, color: b.primary, opacity: ease(f, 18, 28), textTransform: 'uppercase'}}>{cta}</div>}
      {line && <SerifReveal text={line} size={40 * L.u} at={24} italic color={alpha('#F5EFE6', 0.75)} />}
      <FilmFx f={f} u={L.u} leak grain={0.08} />
    </AbsoluteFill>
  );
};
