import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {font, useBrand} from '../brand';
import {ease, step, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';
import {ICONS} from './whiteboard';

// Crayon / kid-drawing look: C8 crayon title · C10 crayon doodles · C11 crayon list · K21 crayon CTA.
// Gaegu (OFL) handwriting, waxy rough strokes (SVG turbulence), paper, wobbly stop-motion (holds 3 frames).
type P = Record<string, any>;
export const kidFont = () => `'${font('Gaegu', [700])}', 'Permanent Marker', sans-serif`;
const CR = ['#E63946', '#1D70E0', '#2BB24C', '#F4A11D', '#8E44AD', '#FF6FAE'];

/** paper + waxy filter (shared) */
export const CrayonPaper: React.FC<{u: number; f: number; children?: React.ReactNode}> = ({u, f, children}) => (
  <AbsoluteFill style={{background: '#FFFDF6'}}>
    <AbsoluteFill style={{backgroundImage: `linear-gradient(rgba(29,112,224,.12) ${2 * u}px, transparent ${2 * u}px)`, backgroundSize: `100% ${64 * u}px`}} />
    <div style={{position: 'absolute', top: 0, bottom: 0, left: 110 * u, width: 3 * u, background: 'rgba(230,57,70,.35)'}} />
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <filter id="crayon">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={step(f, 3) % 7} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={5} result="d" />
        <feComposite in="d" in2="n" operator="in" />
      </filter>
      <filter id="wobble">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={1} seed={step(f, 3) % 5} />
        <feDisplacementMap in="SourceGraphic" scale={6} />
      </filter>
    </svg>
    {children}
  </AbsoluteFill>
);

const Scrawl: React.FC<{d: string; k: number; color: string; w: number}> = ({d, k, color, w}) => (
  <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - k} opacity={k > 0 ? 0.95 : 0} />
);

/* ---------------- C8 crayon title ---------------- */

/** C8: big kid-handwriting title in crayon colors, letters wobble; scribbled stars and a sun around it */
export const CrayonTitle: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const lines = txt(p.text, 'Simple lang|ang ads!').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const longest = Math.max(4, ...lines.map((l) => l.length));
  const size = Math.min(190 * L.u, ((L.W * 0.86) / longest) * 1.75);
  const sf = step(f, 3);
  let n = 0;
  return (
    <CrayonPaper u={L.u} f={f}>
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0, filter: 'url(#wobble)'}}>
        <g transform={`translate(${L.W * 0.78} ${L.H * 0.16})`}>
          <Scrawl d="M-60 0 a60 60 0 1 0 120 0 a60 60 0 1 0 -120 0" k={ease(sf, 4, 14)} color={CR[3]} w={14 * L.u} />
          {range(8).map((i) => {
            const a = (i / 8) * Math.PI * 2;
            return <Scrawl key={i} d={`M${Math.cos(a) * 80} ${Math.sin(a) * 80} L${Math.cos(a) * 120} ${Math.sin(a) * 120}`} k={ease(sf, 12 + i, 16 + i)} color={CR[3]} w={10 * L.u} />;
          })}
        </g>
        <g transform={`translate(${L.W * 0.14} ${L.H * 0.78}) scale(${2.2 * L.u})`}>
          <Scrawl d={ICONS.star[0]} k={ease(sf, 18, 30)} color={CR[5]} w={5} />
        </g>
      </svg>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', filter: 'url(#wobble)'}}>
        {lines.map((l, i) => (
          <div key={i} style={{display: 'flex'}}>
            {l.split('').map((ch, j) => {
              const idx = n++;
              const show = sf >= 2 + idx * 1.2;
              return <span key={j} style={{fontFamily: kidFont(), fontWeight: 700, fontSize: size, lineHeight: 1.05, color: CR[(idx + i) % CR.length], opacity: show ? 1 : 0, transform: `rotate(${((idx * 37) % 11) - 5}deg) translateY(${((idx * 13) % 7) - 3}px)`, display: 'inline-block', whiteSpace: 'pre'}}>{ch}</span>;
            })}
          </div>
        ))}
      </AbsoluteFill>
    </CrayonPaper>
  );
};

/* ---------------- C10 crayon doodles ---------------- */

export const doodleList = (p: P): {icon: string; label?: string}[] => (Array.isArray(p.doodles) && p.doodles.length ? p.doodles : [{icon: 'heart', label: 'Gusto ng tao'}, {icon: 'chat', label: 'Nagme-message'}, {icon: 'cart', label: 'Bumibili'}]).slice(0, 4).map((x: any) => (typeof x === 'string' ? {icon: x} : x));
export const doodleTimes = (n: number, dur: number, fps: number, at?: number[]) => range(n).map((i) => (Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : Math.round(fps * 0.2 + (i * (dur - fps * 0.6)) / Math.max(1, n))));

/** C10: crayon doodles (heart, chat, cart, star...) scribble themselves in, each with a kid label */
export const CrayonDoodles: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const items = doodleList(p);
  const ts = doodleTimes(items.length, dur, L.fps, p.at);
  const sf = step(f, 3);
  const box = Math.min(260 * L.u, (L.H * 0.5) / items.length);
  return (
    <CrayonPaper u={L.u} f={f}>
      {txt(p.title, '') && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.H * 0.12, textAlign: 'center', fontFamily: kidFont(), fontWeight: 700, fontSize: 110 * L.u, color: CR[1], filter: 'url(#wobble)'}}>{txt(p.title, '')}</div>}
      <div style={{position: 'absolute', left: L.pad * 1.6, right: L.pad, top: L.H * 0.26, display: 'flex', flexDirection: 'column', gap: 30 * L.u}}>
        {items.map((it, i) => {
          const strokes = ICONS[it.icon] ?? ICONS.star;
          const c = CR[i % CR.length];
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 40 * L.u}}>
              <svg width={box} height={box} viewBox="0 0 100 100" style={{overflow: 'visible', filter: 'url(#wobble)', flexShrink: 0}}>
                {strokes.map((d, j) => <Scrawl key={j} d={d} k={ease(sf, ts[i] + j * 4, ts[i] + j * 4 + 9)} color={c} w={7} />)}
              </svg>
              {it.label && <div style={{fontFamily: kidFont(), fontWeight: 700, fontSize: Math.min(90 * L.u, box * 0.4), color: c, opacity: sf >= ts[i] + 8 ? 1 : 0, filter: 'url(#wobble)'}}>{it.label}</div>}
            </div>
          );
        })}
      </div>
    </CrayonPaper>
  );
};

/* ---------------- C11 crayon list ---------------- */

export const crayonItems = (p: P): string[] => (Array.isArray(p.items) && p.items.length ? p.items : ['Kuha sa phone', 'Lagyan ng hook', 'Post at mag-ads']).slice(0, 5).map(String);
export const crayonTimes = (n: number, dur: number, fps: number, at?: number[]) => range(n).map((i) => (Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : Math.round(fps * 0.4 + (i * (dur - fps * 0.8)) / Math.max(1, n))));

/** C11: kid-style numbered list; each line appears with a scribbled underline and a crayon tick */
export const CrayonList: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const items = crayonItems(p);
  const ts = crayonTimes(items.length, dur, L.fps, p.at);
  const sf = step(f, 3);
  const title = txt(p.title, 'Steps ko');
  const fs = Math.min(96 * L.u, ((L.W * 0.7) / Math.max(8, ...items.map((s) => s.length))) * 2.1);
  return (
    <CrayonPaper u={L.u} f={f}>
      <div style={{position: 'absolute', left: 150 * L.u, top: L.H * 0.14, fontFamily: kidFont(), fontWeight: 700, fontSize: 120 * L.u, color: CR[0], filter: 'url(#wobble)', transform: 'rotate(-3deg)'}}>{title}</div>
      <div style={{position: 'absolute', left: 150 * L.u, right: L.pad, top: L.H * 0.3, display: 'flex', flexDirection: 'column', gap: 40 * L.u}}>
        {items.map((it, i) => {
          const on = sf >= ts[i];
          const c = CR[(i + 1) % CR.length];
          return (
            <div key={i} style={{position: 'relative', opacity: on ? 1 : 0, filter: 'url(#wobble)'}}>
              <span style={{fontFamily: kidFont(), fontWeight: 700, fontSize: fs, color: c}}>{i + 1}. {it}</span>
              <svg width={L.W * 0.7} height={30 * L.u} viewBox="0 0 100 10" preserveAspectRatio="none" style={{position: 'absolute', left: 0, top: fs * 1.05, overflow: 'visible'}}>
                <Scrawl d="M0 5 C20 2 40 8 60 4 S90 6 100 3" k={ease(sf, ts[i] + 3, ts[i] + 12)} color={c} w={1.4} />
              </svg>
              <svg width={fs} height={fs} viewBox="0 0 100 100" style={{position: 'absolute', left: -fs * 1.15, top: 0, overflow: 'visible'}}>
                <Scrawl d="M15 55 L40 80 L88 18" k={ease(sf, ts[i] + 8, ts[i] + 14)} color={CR[2]} w={12} />
              </svg>
            </div>
          );
        })}
      </div>
    </CrayonPaper>
  );
};

/* ---------------- K21 crayon CTA ---------------- */

/** K21: CTA scribbled inside a wobbly crayon cloud, arrow and hearts around it */
export const CrayonCTA: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const cta = txt(p.cta, b.cta);
  const title = txt(p.title, 'Tara na!');
  const sf = step(f, 3);
  const fs = Math.min(150 * L.u, ((L.W * 0.7) / Math.max(5, cta.length)) * 1.9);
  return (
    <CrayonPaper u={L.u} f={f}>
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: 'url(#wobble)'}}>
        <g transform={`translate(${L.W / 2} ${L.H * 0.5})`}>
          <Scrawl d={`M${-L.W * 0.4} 0 C${-L.W * 0.42} ${-L.H * 0.12}, ${-L.W * 0.1} ${-L.H * 0.15}, 0 ${-L.H * 0.1} C${L.W * 0.1} ${-L.H * 0.16}, ${L.W * 0.44} ${-L.H * 0.12}, ${L.W * 0.4} 0 C${L.W * 0.44} ${L.H * 0.12}, ${L.W * 0.1} ${L.H * 0.14}, 0 ${L.H * 0.1} C${-L.W * 0.1} ${L.H * 0.15}, ${-L.W * 0.44} ${L.H * 0.12}, ${-L.W * 0.4} 0 Z`} k={ease(sf, 2, 18)} color={CR[1]} w={12 * L.u} />
        </g>
        <g transform={`translate(${L.W * 0.2} ${L.H * 0.74}) scale(${2 * L.u})`}><Scrawl d={ICONS.heart[0]} k={ease(sf, 18, 28)} color={CR[0]} w={6} /></g>
        <g transform={`translate(${L.W * 0.68} ${L.H * 0.22}) scale(${1.6 * L.u})`}><Scrawl d={ICONS.star[0]} k={ease(sf, 22, 32)} color={CR[3]} w={6} /></g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.H * 0.3, textAlign: 'center', fontFamily: kidFont(), fontWeight: 700, fontSize: 110 * L.u, color: CR[0], opacity: sf >= 4 ? 1 : 0, filter: 'url(#wobble)'}}>{title}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.H * 0.5 - fs * 0.55, textAlign: 'center', fontFamily: kidFont(), fontWeight: 700, fontSize: fs, color: CR[2], opacity: sf >= 12 ? 1 : 0, filter: 'url(#wobble)', textTransform: 'uppercase'}}>{cta}</div>
    </CrayonPaper>
  );
};
