import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {useBrand} from './brand';
import {alpha, ink, pop, useLayout} from './lib/util';
import type {Word} from './types';

export const CAPTION_STYLES = ['G1', 'G2', 'G3', 'G7', 'G8'];

const chunk = (ws: Word[], max: number, gap = 0.45) => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  for (const w of ws) {
    const last = cur[cur.length - 1];
    if (last && (cur.length >= max || w.s - last.e > gap || /[.!?,]$/.test(last.w))) {
      out.push(cur);
      cur = [];
    }
    cur.push(w);
  }
  if (cur.length) out.push(cur);
  return out;
};

/** word-timed captions. G1 gold active word · G2 one big word · G3 karaoke box · G7 highlighter · G8 TikTok native */
export const Captions: React.FC<{words: Word[]; style?: string; y?: number; hidden?: [number, number][]}> = ({words, style = 'G1', y, hidden = []}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const t = f / L.fps;
  const groups = useMemo(() => chunk(words, style === 'G2' ? 1 : 3), [words, style]);
  if (hidden.some(([a, z]) => t >= a && t < z)) return null;
  let g: Word[] | undefined;
  for (let i = 0; i < groups.length; i++) {
    const next = groups[i + 1];
    const end = Math.min(groups[i][groups[i].length - 1].e + 0.35, next ? next[0].s : Infinity);
    if (t >= groups[i][0].s - 0.04 && t < end) g = groups[i];
  }
  if (!g) return null;
  const s = pop(f, L.fps, Math.round(g[0].s * L.fps), 320, 14);
  const top = (y ?? (L.portrait ? 0.63 : 0.8)) * L.H;
  const big = style === 'G2';
  const size = (big ? 150 : 82) * L.u * (L.portrait ? 1 : 0.8);
  const stroke = `${(big ? 8 : 6) * L.u}px #000`;
  return (
    <div style={{position: 'absolute', left: L.pad, right: L.pad, top, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.34, rowGap: size * 0.1, transform: `translateY(-50%) scale(${0.85 + 0.15 * s})`}}>
      {g.map((w, i) => {
        const active = t >= w.s - 0.03 && (t < w.e + 0.05 || i === g!.length - 1);
        const passed = t >= w.s;
        const base: React.CSSProperties = {
          fontFamily: big ? b.fH : b.fB,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.1,
          textTransform: 'uppercase',
          display: 'inline-block',
          color: '#fff',
          WebkitTextStroke: stroke,
          paintOrder: 'stroke fill',
          textShadow: `0 ${5 * L.u}px ${14 * L.u}px rgba(0,0,0,.45)`,
        };
        if (style === 'G1' || big) Object.assign(base, {color: active ? b.primary : '#fff', transform: `scale(${active ? 1.04 : 1})`});
        if (style === 'G3' && active) Object.assign(base, {background: b.primary, color: ink(b.primary), WebkitTextStroke: '0', padding: `0 ${size * 0.15}px`, borderRadius: size * 0.18, textShadow: 'none'});
        if (style === 'G7' && passed)
          Object.assign(base, {color: '#111', WebkitTextStroke: '0', textShadow: 'none', padding: `0 ${size * 0.1}px`, backgroundImage: `linear-gradient(${alpha(b.primary, 0.92)}, ${alpha(b.primary, 0.92)})`, backgroundRepeat: 'no-repeat', backgroundSize: `${Math.min(1, (t - w.s) / 0.15) * 100}% 80%`, backgroundPosition: 'left center'});
        if (style === 'G8') Object.assign(base, {transform: `scale(${active ? 1.04 : 1})`});
        return (
          <span key={`${w.s}-${i}`} style={base}>
            {w.w}
          </span>
        );
      })}
    </div>
  );
};
