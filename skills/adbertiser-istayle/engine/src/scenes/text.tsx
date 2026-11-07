import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Glow, Rays} from '../lib/Fx';
import {Media} from '../lib/Media';
import {clean, ease, fitSize, ink, pop, useLayout, words} from '../lib/util';
import type {SceneProps} from '../types';

const list = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : v ? [String(v)] : []);

/** J1 bold question hook (J8: add `big` for a giant number) */
export const HookQuestion: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const text: string = p.text ?? 'Bakit walang bumibili?';
  const hi = list(p.highlight ?? (p.text ? [] : ['bumibili'])).map(clean);
  const ws = words(text);
  const size = fitSize(text, L.u, L.portrait, 175);
  const lead = p.big ? 7 : 0;
  const end = lead + ws.length * 3 + 8;
  const punch = 1 + 0.04 * ease(f, end, end + 6);
  return (
    <AbsoluteFill style={{background: b.bg}}>
      {p.bg ? <Media src={p.bg} dim={0.55} /> : <><Rays color={b.primary} opacity={0.07} /><Glow color={b.primary} strength={0.28} /></>}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: L.pad}}>
        {p.big && (
          <div style={{fontFamily: b.fH, fontSize: size * 2.3, lineHeight: 0.95, color: b.primary, transform: `scale(${pop(f, L.fps, 0, 260, 10)})`}}>
            {p.big}
          </div>
        )}
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.24, rowGap: size * 0.06, transform: `scale(${punch})`}}>
          {ws.map((w, i) => {
            const s = pop(f, L.fps, lead + i * 3, 240, 11);
            const on = hi.includes(clean(w));
            return (
              <span
                key={i}
                style={{
                  fontFamily: b.fH,
                  fontSize: size,
                  lineHeight: 1.08,
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  color: on ? ink(b.primary) : b.text,
                  background: on ? b.primary : 'transparent',
                  padding: on ? `0 ${size * 0.12}px` : 0,
                  transform: `translateY(${(1 - s) * size * 0.5}px) scale(${0.6 + 0.4 * s}) rotate(${on ? -2 : 0}deg)`,
                  opacity: Math.min(1, s * 1.6),
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        {p.sub && (
          <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: Math.max(34 * L.u, size * 0.3), color: b.text, opacity: ease(f, end, end + 8), marginTop: size * 0.4, textAlign: 'center'}}>
            {p.sub}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** B1 kinetic typography: one line at a time, slammed in */
export const KineticText: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const lines = list(p.lines).length ? list(p.lines) : ['Stop scrolling', 'Ito na', 'ang sagot'];
  const n = lines.length;
  const seg = dur / n;
  const i = Math.min(n - 1, Math.floor(f / seg));
  const lf = f - i * seg;
  const accent = (Array.isArray(p.accent) ? p.accent : [n - 1]).includes(i);
  const line = lines[i];
  const size = fitSize(line, L.u, L.portrait, 190);
  const s = pop(lf, L.fps, 0, 260, 12);
  const bg = accent ? b.primary : b.bg;
  const fg = accent ? ink(b.primary) : b.text;
  return (
    <AbsoluteFill style={{background: bg, alignItems: 'center', justifyContent: 'center', padding: L.pad}}>
      {!accent && <Glow color={b.primary} strength={0.18} />}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: size * 0.22,
          transform: `scale(${1.35 - 0.35 * s}) rotate(${(i % 2 ? 3 : -3) * (1 - s)}deg)`,
          opacity: Math.min(1, s * 2),
        }}
      >
        {words(line).map((w, k) => {
          const ws = pop(lf, L.fps, k * 2, 300, 13);
          return (
            <span key={k} style={{fontFamily: b.fH, fontSize: size, lineHeight: 1.05, color: k % 3 === 1 && !accent ? b.primary : fg, textTransform: 'uppercase', display: 'inline-block', transform: `translateY(${(1 - ws) * 40 * L.u}px)`}}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** A4 POV text hook over footage, typed on */
export const POVHook: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const text: string = p.text ?? 'POV: 3 orders na habang tulog ka';
  const shown = Math.min(text.length, Math.floor(f / 1.3));
  const size = fitSize(text, L.u, L.portrait, 120);
  const outline = `${3 * L.u}px`;
  return (
    <AbsoluteFill>
      <Media src={p.media ?? 'demo:🛵:200'} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.55), transparent 45%)'}} />
      <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.27 : L.H * 0.12, textAlign: 'center'}}>
        <span
          style={{
            fontFamily: b.fB,
            fontWeight: 900,
            fontSize: size,
            lineHeight: 1.15,
            color: '#fff',
            WebkitTextStroke: `${outline} #000`,
            paintOrder: 'stroke fill',
            textShadow: `0 ${6 * L.u}px ${18 * L.u}px rgba(0,0,0,.45)`,
          }}
        >
          {text.slice(0, shown)}
          <span style={{opacity: Math.floor(f / 8) % 2 ? 0 : 1, color: b.primary}}>|</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
