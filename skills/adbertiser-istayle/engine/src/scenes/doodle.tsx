import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Media} from '../lib/Media';
import {ease, pop, useLayout} from '../lib/util';
import type {SceneProps} from '../types';

export type Mark = {type: 'circle' | 'arrow' | 'underline' | 'x' | 'check'; x: number; y: number; w?: number; h?: number; at?: number; color?: string; label?: string};

const P = (pts: [number, number][]) => `M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}`;

/** hand-drawn path(s) for one mark, in pixels */
export const markPaths = (m: Mark, W: number, H: number, seed: string): string[] => {
  const cx = m.x * W;
  const cy = m.y * H;
  const w = (m.w ?? 0.3) * W;
  const h = (m.h ?? 0.1) * H;
  const j = (k: string, a: number) => (random(`${seed}${k}`) - 0.5) * 2 * a;
  if (m.type === 'circle') {
    const pts: [number, number][] = [];
    const a0 = -2.2;
    for (let i = 0; i <= 64; i++) {
      const a = a0 + (i / 64) * Math.PI * 2 * 1.12;
      const r = 1 + j(`r${Math.floor(i / 8)}`, 0.05) + (i / 64) * 0.06;
      pts.push([cx + Math.cos(a) * (w / 2) * r, cy + Math.sin(a) * (h / 2) * r]);
    }
    return [P(pts)];
  }
  if (m.type === 'underline') {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 24; i++) pts.push([cx - w / 2 + (i / 24) * w, cy + Math.sin(i / 3.5) * h * 0.06 + j(`u${i}`, h * 0.02)]);
    return [P(pts)];
  }
  if (m.type === 'arrow') {
    const sx = cx - w * 0.7;
    const sy = cy + h * 1.6;
    const qx = cx - w * 0.6;
    const qy = cy + h * 0.2;
    const tx = cx - w * 0.08;
    const ty = cy + h * 0.08;
    const ang = Math.atan2(ty - qy, tx - qx);
    const hl = Math.min(W, H) * 0.05;
    const head = (d: number): [number, number] => [tx - Math.cos(ang + d) * hl, ty - Math.sin(ang + d) * hl];
    return [`M${sx},${sy} Q${qx},${qy} ${tx},${ty}`, P([head(0.5), [tx, ty], head(-0.5)])];
  }
  if (m.type === 'x') {
    const r = Math.min(w, h) / 2;
    return [P([[cx - r, cy - r], [cx + r, cy + r + j('x1', r * 0.1)]]), P([[cx + r, cy - r], [cx - r + j('x2', r * 0.1), cy + r]])];
  }
  const r = Math.min(w, h) / 2;
  return [P([[cx - r, cy], [cx - r * 0.25, cy + r * 0.7], [cx + r, cy - r * 0.8]])];
};

/** B11 doodles drawn over footage: circles, arrows, underlines, X, check */
export const Doodle: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const marks: Mark[] = p.marks ?? [
    {type: 'circle', x: 0.5, y: 0.42, w: 0.6, h: 0.18, label: 'ITO!'},
    {type: 'arrow', x: 0.5, y: 0.6, w: 0.3, h: 0.06},
    {type: 'underline', x: 0.5, y: 0.7, w: 0.6, h: 0.1},
  ];
  const drawLen = Math.round(L.fps * 0.45);
  return (
    <AbsoluteFill>
      <Media src={p.media ?? 'demo:🍜:20'} />
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: `drop-shadow(0 ${4 * L.u}px ${6 * L.u}px rgba(0,0,0,.35))`}}>
        {marks.map((m, i) => {
          const at = Math.round((m.at ?? 0.35 + i * 0.6) * L.fps);
          const paths = markPaths(m, L.W, L.H, `m${i}`);
          return paths.map((d, k) => {
            const seg = drawLen / paths.length;
            const t = ease(f, at + k * seg, at + (k + 1) * seg);
            return <path key={`${i}-${k}`} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} fill="none" stroke={m.color ?? b.primary} strokeWidth={13 * L.u} strokeLinecap="round" strokeLinejoin="round" />;
          });
        })}
      </svg>
      {marks.map((m, i) => {
        if (!m.label) return null;
        const at = Math.round((m.at ?? 0.35 + i * 0.6) * L.fps) + drawLen;
        const s = pop(f, L.fps, at, 260, 11);
        return (
          <div key={i} style={{position: 'absolute', left: m.x * L.W, top: (m.y - (m.h ?? 0.1) / 2) * L.H - 110 * L.u, transform: `translateX(-50%) rotate(-6deg) scale(${s})`, fontFamily: b.fHand, fontSize: 90 * L.u, color: m.color ?? b.primary, textShadow: '0 4px 10px rgba(0,0,0,.5)', whiteSpace: 'nowrap'}}>
            {m.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
