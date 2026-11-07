import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Media} from '../lib/Media';
import {ease, ink, pop, shake, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Bold brutalist look: B16 brutalist title · B48 marquee bands · B49 brutalist grid · B50 photo block · K17 brutalist CTA.
// Huge condensed type, hard black borders, flat color blocks, mono labels, no rounding, no soft shadows.
type P = Record<string, any>;
export const BK = '#0A0A0A';
const MONO = "'Courier New', monospace";
/** brutalist accent: brand primary, or acid yellow */
const acc = (p: P, primary: string) => p.color ?? primary ?? '#E8FF2A';

const Label: React.FC<{text: string; size: number; bg?: string; color?: string; style?: React.CSSProperties}> = ({text, size, bg = BK, color = '#FFFFFF', style}) => (
  <div style={{display: 'inline-block', background: bg, color, fontFamily: MONO, fontWeight: 700, fontSize: size, letterSpacing: size * 0.08, padding: `${size * 0.25}px ${size * 0.5}px`, textTransform: 'uppercase', ...style}}>{text}</div>
);

/* ---------------- B16 brutalist title ---------------- */

/** B16: giant condensed words slam in block by block on flat color, mono labels and a hard border grid */
export const BrutalTitle: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const a = acc(p, b.primary);
  const words = txt(p.text, 'Stop|Boring|Ads').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 4);
  const label = txt(p.label, 'AD NO. 001');
  const longest = Math.max(3, ...words.map((w) => w.length));
  const size = Math.min(L.H * 0.2, ((L.W * 0.96) / longest) * 1.62);
  const top = L.portrait ? L.H * 0.2 : L.H * 0.08;
  return (
    <AbsoluteFill style={{background: '#F2F0EA', overflow: 'hidden'}}>
      <AbsoluteFill style={{backgroundImage: `linear-gradient(${BK} ${2 * L.u}px, transparent ${2 * L.u}px), linear-gradient(90deg, ${BK} ${2 * L.u}px, transparent ${2 * L.u}px)`, backgroundSize: `${L.W / 4}px ${L.W / 4}px`, opacity: 0.12}} />
      <div style={{position: 'absolute', left: L.pad * 0.5, top: top - 70 * L.u}}><Label text={label} size={30 * L.u} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column'}}>
        {words.map((w, i) => {
          const at = 3 + i * 6;
          const k = pop(f, L.fps, at, 400, 18);
          const sh = shake(f, at, 5, 10 * L.u);
          const inv = i % 2 === 1;
          return (
            <div key={i} style={{alignSelf: i % 2 ? 'flex-end' : 'flex-start', background: inv ? a : 'transparent', borderTop: `${6 * L.u}px solid ${BK}`, padding: `0 ${20 * L.u}px`, transform: `translate(${(1 - k) * (i % 2 ? 1 : -1) * L.W + sh.x}px, ${sh.y}px)`}}>
              <div style={{fontFamily: b.fH, fontSize: size, lineHeight: 0.92, color: inv ? ink(a) : BK, textTransform: 'uppercase', letterSpacing: -size * 0.01, whiteSpace: 'nowrap'}}>{w}</div>
            </div>
          );
        })}
      </div>
      {p.sub && <div style={{position: 'absolute', left: L.pad * 0.5, bottom: L.portrait ? L.H * 0.24 : L.H * 0.08, opacity: ease(f, 20, 24)}}><Label text={String(p.sub)} size={34 * L.u} bg={a} color={ink(a)} /></div>}
    </AbsoluteFill>
  );
};

/* ---------------- B48 marquee bands ---------------- */

/** B48: two crossing marquee bands scroll a repeating phrase (SALE / BAGO / LIMITED) over a photo or color */
export const Marquee: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const a = acc(p, b.primary);
  const text = txt(p.text, 'BAGONG ADS').toUpperCase();
  const text2 = txt(p.text2, 'LIMITED SLOTS').toUpperCase();
  const size = 130 * L.u;
  const band = (t: string, rot: number, y: number, dir: number, bg: string, fg: string) => {
    const unit = `${t} ✦ `;
    const rep = unit.repeat(8);
    return (
      <div style={{position: 'absolute', left: '-30%', width: '160%', top: y, height: size * 1.25, background: bg, border: `${6 * L.u}px solid ${BK}`, transform: `rotate(${rot}deg)`, overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
        <div style={{fontFamily: b.fH, fontSize: size, lineHeight: 1, color: fg, whiteSpace: 'nowrap', transform: `translateX(${dir * ((f * 9 * L.u) % (size * unit.length * 0.52)) - size * unit.length * 0.52}px)`}}>{rep}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: a, overflow: 'hidden'}}>
      {p.media && <div style={{position: 'absolute', inset: 0, filter: 'grayscale(1) contrast(1.4)'}}><Media src={p.media} zoom="in" dim={0.2} /></div>}
      {band(text, -8, L.H * 0.36, -1, BK, a)}
      {band(text2, 7, L.H * 0.52, 1, '#FFFFFF', BK)}
    </AbsoluteFill>
  );
};

/* ---------------- B49 brutalist grid ---------------- */

const CELLS = [
  {label: 'Price', value: '₱999'},
  {label: 'Videos', value: '3'},
  {label: 'Turnaround', value: '48H'},
  {label: 'Revisions', value: 'FREE'},
];
export const cellList = (p: P): {label: string; value: string}[] => (Array.isArray(p.cells) && p.cells.length ? p.cells : CELLS).slice(0, 6).map((c: any) => ({label: String(c.label ?? ''), value: String(c.value ?? '')}));
export const cellTimes = (n: number, fps: number) => range(n).map((i) => Math.round(fps * 0.2) + i * 5);

/** B49: rigid 2-column grid with hard borders; each cell's value slams in, one cell in the accent color */
export const BrutalGrid: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const a = acc(p, b.primary);
  const cells = cellList(p);
  const ts = cellTimes(cells.length, L.fps);
  const title = txt(p.title, 'The deal');
  const cols = 2;
  const rows = Math.ceil(cells.length / cols);
  const gw = L.portrait ? L.W - L.pad : L.W * 0.7;
  const cw = gw / cols;
  const ch = Math.min(cw * 0.85, (L.H * 0.5) / rows);
  const x0 = (L.W - gw) / 2;
  const y0 = L.portrait ? L.H * 0.3 : L.H * 0.25;
  const hi = typeof p.highlight === 'number' ? p.highlight : 0;
  return (
    <AbsoluteFill style={{background: '#F2F0EA'}}>
      <div style={{position: 'absolute', left: x0, top: y0 - 150 * L.u, fontFamily: b.fH, fontSize: 120 * L.u, color: BK, textTransform: 'uppercase', lineHeight: 1, opacity: ease(f, 0, 4)}}>{title}</div>
      <div style={{position: 'absolute', left: x0, top: y0, width: gw, height: rows * ch, border: `${8 * L.u}px solid ${BK}`, boxSizing: 'border-box'}} />
      {cells.map((c, i) => {
        const x = x0 + (i % cols) * cw;
        const y = y0 + Math.floor(i / cols) * ch;
        const k = pop(f, L.fps, ts[i], 420, 20);
        const on = f >= ts[i];
        const isHi = i === hi;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: cw, height: ch, boxSizing: 'border-box', border: `${4 * L.u}px solid ${BK}`, background: on && isHi ? a : 'transparent', padding: 24 * L.u, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 28 * L.u, color: isHi ? ink(a) : BK, textTransform: 'uppercase', letterSpacing: 2 * L.u}}>{String(i + 1).padStart(2, '0')} / {c.label}</div>
            <div style={{fontFamily: b.fH, fontSize: Math.min(ch * 0.5, (cw * 0.9) / Math.max(2, c.value.length) * 1.6), lineHeight: 1, color: isHi ? ink(a) : BK, transform: `scale(${on ? k : 0})`, transformOrigin: 'left bottom'}}>{c.value}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- B50 photo block ---------------- */

/** B50: photo in a thick black frame, giant index number, raw sticker label */
export const PhotoBlock: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const a = acc(p, b.primary);
  const label = txt(p.label, 'Real footage');
  const num = txt(p.number, '01');
  const k = pop(f, L.fps, 0, 380, 20);
  const pw = L.portrait ? L.W * 0.86 : L.W * 0.5;
  const ph = L.portrait ? L.H * 0.5 : L.H * 0.7;
  const x = (L.W - pw) / 2;
  const y = L.portrait ? L.H * 0.24 : L.H * 0.15;
  return (
    <AbsoluteFill style={{background: a}}>
      <div style={{position: 'absolute', left: x - 10 * L.u, top: y - 270 * L.u, fontFamily: b.fH, fontSize: 260 * L.u, lineHeight: 1, color: BK, opacity: ease(f, 2, 6)}}>{num}</div>
      <div style={{position: 'absolute', left: x, top: y, width: pw, height: ph, border: `${12 * L.u}px solid ${BK}`, boxSizing: 'border-box', overflow: 'hidden', transform: `translate(${(1 - k) * 40 * L.u}px, ${(1 - k) * 40 * L.u}px)`, boxShadow: `${24 * L.u}px ${24 * L.u}px 0 ${BK}`}}>
        <Media src={p.media ?? 'demo:📷:40'} zoom="in" />
      </div>
      <div style={{position: 'absolute', left: x + pw * 0.45, top: y + ph - 40 * L.u, transform: `rotate(-4deg) scale(${pop(f, L.fps, 8, 400, 16)})`}}>
        <Label text={label} size={44 * L.u} bg="#FFFFFF" color={BK} style={{border: `${5 * L.u}px solid ${BK}`}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- K17 brutalist CTA ---------------- */

/** K17: the CTA fills the frame in stacked giant words with an arrow; colors flip on the beat */
export const BrutalCTA: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const a = acc(p, b.primary);
  const words = txt(p.cta, b.cta).split(/\s+/).filter(Boolean).slice(0, 4);
  const handle = txt(p.handle, b.handle ?? '');
  const flip = Math.floor(f / 8) % 2 === 1;
  const bg = flip ? BK : a;
  const fg = flip ? a : BK;
  const longest = Math.max(3, ...words.map((w) => w.length));
  const size = Math.min(L.H * 0.2, ((L.W * 0.94) / longest) * 1.62);
  return (
    <AbsoluteFill style={{background: bg, justifyContent: 'center', padding: `0 ${L.pad * 0.5}px`}}>
      {words.map((w, i) => (
        <div key={i} style={{fontFamily: b.fH, fontSize: size, lineHeight: 0.9, color: fg, textTransform: 'uppercase', transform: `translateX(${(1 - pop(f, L.fps, i * 4, 420, 20)) * -L.W}px)`}}>{w}</div>
      ))}
      <div style={{fontFamily: b.fH, fontSize: size, lineHeight: 0.9, color: fg, transform: `translateX(${Math.sin(f / 4) * 20 * L.u}px)`}}>→</div>
      {handle && <div style={{position: 'absolute', left: L.pad * 0.5, bottom: L.portrait ? L.H * 0.22 : L.H * 0.06}}><Label text={handle} size={34 * L.u} bg={fg} color={bg} /></div>}
    </AbsoluteFill>
  );
};
