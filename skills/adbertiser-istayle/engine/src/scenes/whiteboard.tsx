import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {ease, ink, lin, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Whiteboard look: B31 marker title · B25 line icons · B32 flow · B33 marker list · B34 sketch chart · K11 marker CTA.
// Everything is "written" or "drawn" live: text reveals behind a marker, strokes draw with pathLength.
type P = Record<string, any>;

export const INK = '#1F2430';
const BLUE = '#2563EB';
const RED = '#E5484D';
const GREEN = '#16A34A';
/** marker accent from the brand: a light brand color is unreadable on white, so fall back to blue */
const accent = (p: P, primary: string) => p.color ?? (ink(primary) === '#111111' ? BLUE : primary);

/** white board with a soft sheen; `sketch` filter id gives strokes a hand-drawn wobble */
export const Board: React.FC<{u: number; children?: React.ReactNode}> = ({u, children}) => (
  <AbsoluteFill style={{background: '#FBFBF8'}}>
    <AbsoluteFill style={{background: 'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.9) 45%, rgba(255,255,255,0) 60%), radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.08) 100%)'}} />
    <AbsoluteFill style={{boxShadow: `inset 0 0 0 ${14 * u}px #D9DCE1, inset 0 0 0 ${18 * u}px #B9BEC6`}} />
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <filter id="sketch">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={3} />
        <feDisplacementMap in="SourceGraphic" scale={3.5} />
      </filter>
    </svg>
    {children}
  </AbsoluteFill>
);

/** small marker pen drawn at the writing point */
const Pen: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{display: 'block', filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,.25))'}}>
    <g transform="rotate(35 30 30)">
      <rect x="24" y="2" width="12" height="40" rx="3" fill={color} />
      <rect x="24" y="2" width="12" height="9" rx="3" fill="#FFFFFF" opacity={0.35} />
      <path d="M25 42 L35 42 L32 52 L28 52 Z" fill="#E6E6E6" />
      <path d="M28 52 L32 52 L30 58 Z" fill={color} />
    </g>
  </svg>
);

/** handwritten line revealed left-to-right behind a marker; returns frame it finishes */
export const writeEnd = (text: string, at: number, speed = 1.1) => at + Math.ceil(text.length * speed) + 2;
export const Written: React.FC<{text: string; at: number; size: number; color: string; font: string; speed?: number; pen?: boolean; style?: React.CSSProperties}> = ({text, at, size, color, font, speed = 1.1, pen = true, style}) => {
  const f = useCurrentFrame();
  const end = writeEnd(text, at, speed);
  const k = lin(f, at, end);
  if (f < at) return <div style={{fontFamily: font, fontSize: size, lineHeight: 1.12, visibility: 'hidden', whiteSpace: 'nowrap', ...style}}>{text || ' '}</div>;
  return (
    <div style={{position: 'relative', display: 'inline-block', ...style}}>
      <div style={{fontFamily: font, fontSize: size, lineHeight: 1.12, color, whiteSpace: 'nowrap', clipPath: `inset(-20% ${(1 - k) * 100}% -20% -5%)`}}>{text}</div>
      {pen && k < 1 && (
        <div style={{position: 'absolute', left: `${k * 100}%`, top: size * 0.15, transform: `translate(-20%, -70%)`}}>
          <Pen size={size * 1.1} color={color} />
        </div>
      )}
    </div>
  );
};

/** drawn stroke path(s) in a 100x100 box */
const Stroke: React.FC<{d: string; k: number; color: string; w?: number}> = ({d, k, color, w = 6}) => (
  <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - k} opacity={k > 0 ? 1 : 0} />
);
const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;

/** simple line icons (each a list of strokes, 100x100) */
export const ICONS: Record<string, string[]> = {
  phone: ['M32 8 L68 8 Q74 8 74 14 L74 86 Q74 92 68 92 L32 92 Q26 92 26 86 L26 14 Q26 8 32 8 Z', 'M44 82 L56 82'],
  chart: ['M14 86 L14 14', 'M14 86 L88 86', 'M22 70 L40 52 L55 60 L82 28', 'M70 28 L82 28 L82 40'],
  megaphone: ['M18 42 L18 62 L34 62 L72 82 L72 22 L34 42 Z', 'M34 62 L40 84 L50 84 L46 66', 'M80 40 Q88 52 80 64'],
  cart: ['M8 18 L24 18 L34 64 L80 64 L90 32 L28 32', circ(40, 78, 6), circ(74, 78, 6)],
  chat: ['M18 20 L82 20 Q90 20 90 28 L90 58 Q90 66 82 66 L42 66 L24 82 L28 66 L18 66 Q10 66 10 58 L10 28 Q10 20 18 20 Z', 'M28 38 L72 38', 'M28 50 L58 50'],
  bulb: ['M50 12 C30 12 22 32 30 48 C35 57 38 61 38 70 L62 70 C62 61 65 57 70 48 C78 32 70 12 50 12 Z', 'M40 78 L60 78', 'M44 87 L56 87'],
  check: ['M18 52 L42 76 L84 26'],
  money: ['M10 28 L90 28 L90 74 L10 74 Z', circ(50, 51, 12), 'M20 40 L20 62', 'M80 40 L80 62'],
  camera: ['M10 30 L66 30 L66 72 L10 72 Z', 'M66 46 L90 32 L90 70 L66 56'],
  target: [circ(46, 54, 34), circ(46, 54, 20), circ(46, 54, 6), 'M46 54 L86 14', 'M74 14 L86 14 L86 26'],
  user: [circ(50, 32, 15), 'M20 88 C20 58 80 58 80 88'],
  clock: [circ(50, 50, 36), 'M50 50 L50 26', 'M50 50 L66 60'],
  heart: ['M50 84 C20 62 10 46 18 30 C26 16 44 18 50 32 C56 18 74 16 82 30 C90 46 80 62 50 84 Z'],
  star: ['M50 10 L61 38 L90 38 L66 56 L75 86 L50 68 L25 86 L34 56 L10 38 L39 38 Z'],
};

/* ---------------- B31 marker title ---------------- */

/** B31: title written by marker line by line, then a scribbled underline */
export const MarkerTitle: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const lines = txt(p.text, 'Bakit walang|nag-me-message?').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const acc = accent(p, b.primary);
  const longest = Math.max(4, ...lines.map((l) => l.length));
  const size = Math.min(L.portrait ? 150 * L.u : 130 * L.u, ((L.W * 0.86) / longest) * 1.75);
  const starts: number[] = [];
  let t = 4;
  lines.forEach((l) => {
    starts.push(t);
    t = writeEnd(l, t) + 3;
  });
  const ul = ease(f, t, t + 10);
  const sub = txt(p.sub, '');
  return (
    <Board u={L.u}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 * L.u}}>
        {lines.map((l, i) => (
          <Written key={i} text={l} at={starts[i]} size={size} color={i === lines.length - 1 ? acc : INK} font={b.fHand} />
        ))}
        <svg width={L.W * 0.7} height={50 * L.u} viewBox="0 0 100 10" preserveAspectRatio="none" style={{overflow: 'visible', filter: 'url(#sketch)'}}>
          <Stroke d="M2 6 C25 2 50 9 98 4" k={ul} color={RED} w={1.6} />
          <Stroke d="M8 9 C35 6 60 10 92 7" k={ease(f, t + 6, t + 14)} color={RED} w={1.1} />
        </svg>
        {sub && <div style={{marginTop: 10 * L.u}}><Written text={sub} at={t + 12} size={46 * L.u} color={INK} font={b.fB} speed={0.6} pen={false} style={{fontWeight: 700}} /></div>}
      </AbsoluteFill>
    </Board>
  );
};

/* ---------------- B25 line icons ---------------- */

const ICON_ITEMS = [
  {icon: 'phone', label: 'Phone lang'},
  {icon: 'camera', label: 'Shoot'},
  {icon: 'chart', label: 'Benta'},
];
export const iconItems = (p: P): {icon: string; label?: string}[] => (Array.isArray(p.icons) && p.icons.length ? p.icons : ICON_ITEMS).slice(0, 4).map((x: any) => (typeof x === 'string' ? {icon: x} : x));
export const iconTimes = (n: number, dur: number, fps: number, at?: number[]) => {
  const gap = Math.max(10, (dur - fps * 0.5) / Math.max(1, n));
  return range(n).map((i) => (Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : Math.round(fps * 0.2 + i * gap)));
};

/** B25: line icons draw themselves one by one, each with a handwritten label */
export const LineIcons: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const items = iconItems(p);
  const ts = iconTimes(items.length, dur, L.fps, p.at);
  const acc = accent(p, b.primary);
  const title = txt(p.title, '');
  const n = items.length;
  const vert = L.portrait && n > 2;
  const box = vert ? Math.min(260 * L.u, (L.H * 0.5) / n) : Math.min(320 * L.u, (L.W * 0.8) / n);
  return (
    <Board u={L.u}>
      {title && (
        <div style={{position: 'absolute', left: 0, right: 0, top: L.portrait ? L.H * 0.13 : L.H * 0.08, display: 'flex', justifyContent: 'center'}}>
          <Written text={title} at={2} size={Math.min(110 * L.u, ((L.W * 0.85) / Math.max(4, title.length)) * 1.75)} color={INK} font={b.fHand} />
        </div>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: vert ? L.H * 0.26 : 0, bottom: vert ? 'auto' : 0, display: 'flex', flexDirection: vert ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: vert ? 26 * L.u : 60 * L.u}}>
        {items.map((it, i) => {
          const strokes = ICONS[it.icon] ?? ICONS.star;
          const t = ts[i];
          const per = 10;
          return (
            <div key={i} style={{display: 'flex', flexDirection: vert ? 'row' : 'column', alignItems: 'center', gap: 30 * L.u, width: vert ? L.W * 0.7 : box}}>
              <svg width={box * (vert ? 0.75 : 1)} height={box * (vert ? 0.75 : 1)} viewBox="0 0 100 100" style={{overflow: 'visible', filter: 'url(#sketch)', flexShrink: 0}}>
                {strokes.map((d, j) => (
                  <Stroke key={j} d={d} k={ease(f, t + j * (per / 2), t + j * (per / 2) + per)} color={j === 0 ? INK : acc} w={5} />
                ))}
              </svg>
              {it.label && <Written text={it.label} at={t + strokes.length * (per / 2) + 4} size={Math.min(80 * L.u, box * 0.3)} color={INK} font={b.fHand} pen={false} />}
            </div>
          );
        })}
      </div>
    </Board>
  );
};

/* ---------------- B32 whiteboard flow ---------------- */

const FLOW = ['Problema', 'Solusyon', 'Resulta'];
export const flowNodes = (p: P): string[] => (Array.isArray(p.nodes) && p.nodes.length ? p.nodes : FLOW).slice(0, 4).map(String);
export const flowTimes = (n: number, dur: number, fps: number, at?: number[]) => {
  const gap = Math.max(14, (dur - fps * 0.6) / Math.max(1, n));
  return range(n).map((i) => (Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : Math.round(fps * 0.2 + i * gap)));
};

/** B32: boxes drawn around handwritten words, joined by drawn arrows (problem → solution → result) */
export const Flow: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const nodes = flowNodes(p);
  const ts = flowTimes(nodes.length, dur, L.fps, p.at);
  const acc = accent(p, b.primary);
  const title = txt(p.title, '');
  const n = nodes.length;
  const vert = L.portrait;
  const bw = vert ? L.W * 0.62 : (L.W * 0.78) / n - 70 * L.u;
  const bh = vert ? Math.min(170 * L.u, (L.H * 0.5) / n - 60 * L.u) : 200 * L.u;
  const gap = vert ? Math.min(110 * L.u, (L.H * 0.56 - n * bh) / Math.max(1, n - 1)) : 90 * L.u;
  const totalH = vert ? n * bh + (n - 1) * gap : bh;
  const totalW = vert ? bw : n * bw + (n - 1) * gap;
  const x0 = (L.W - totalW) / 2;
  const y0 = vert ? L.H * 0.52 - totalH / 2 + (title ? 50 * L.u : 0) : L.H * 0.5 - bh / 2;
  const pos = (i: number) => (vert ? [x0, y0 + i * (bh + gap)] : [x0 + i * (bw + gap), y0]);
  const colors = [RED, acc, GREEN, INK];
  return (
    <Board u={L.u}>
      {title && (
        <div style={{position: 'absolute', left: 0, right: 0, top: vert ? L.H * 0.12 : L.H * 0.08, display: 'flex', justifyContent: 'center'}}>
          <Written text={title} at={2} size={Math.min(100 * L.u, ((L.W * 0.85) / Math.max(4, title.length)) * 1.75)} color={INK} font={b.fHand} />
        </div>
      )}
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: 'url(#sketch)'}}>
        {nodes.map((_, i) => {
          const [x, y] = pos(i);
          const k = ease(f, ts[i], ts[i] + 10);
          const d = `M${x + 8} ${y} L${x + bw} ${y + 4} L${x + bw - 4} ${y + bh} L${x} ${y + bh - 6} Z`;
          return <path key={i} d={d} pathLength={1} fill="none" stroke={colors[i % colors.length]} strokeWidth={6 * L.u} strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - k} opacity={k > 0 ? 1 : 0} />;
        })}
        {nodes.slice(0, -1).map((_, i) => {
          const [x, y] = pos(i);
          const [nx, ny] = pos(i + 1);
          const k = ease(f, ts[i + 1] - 8, ts[i + 1]);
          const [ax, ay, bx2, by2] = vert ? [x + bw / 2, y + bh + 12 * L.u, nx + bw / 2, ny - 12 * L.u] : [x + bw + 12 * L.u, y + bh / 2, nx - 12 * L.u, ny + bh / 2];
          const head = vert ? `M${bx2 - 18 * L.u} ${by2 - 22 * L.u} L${bx2} ${by2} L${bx2 + 18 * L.u} ${by2 - 22 * L.u}` : `M${bx2 - 22 * L.u} ${by2 - 18 * L.u} L${bx2} ${by2} L${bx2 - 22 * L.u} ${by2 + 18 * L.u}`;
          return (
            <g key={`a${i}`}>
              <path d={`M${ax} ${ay} L${bx2} ${by2}`} pathLength={1} fill="none" stroke={INK} strokeWidth={6 * L.u} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - k} opacity={k > 0 ? 1 : 0} />
              <path d={head} fill="none" stroke={INK} strokeWidth={6 * L.u} strokeLinecap="round" strokeLinejoin="round" opacity={k >= 1 ? 1 : 0} />
            </g>
          );
        })}
      </svg>
      {nodes.map((t, i) => {
        const [x, y] = pos(i);
        const size = Math.min(bh * 0.42, (bw * 0.9) / Math.max(4, t.length) * 1.7);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: bw, height: bh, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Written text={t} at={ts[i] + 8} size={size} color={colors[i % colors.length] === INK ? INK : colors[i % colors.length]} font={b.fHand} />
          </div>
        );
      })}
    </Board>
  );
};

/* ---------------- B33 marker list ---------------- */

const MLIST = ['Hook sa 3 segundo', 'Ipakita ang produkto', 'Malinaw na presyo', 'Isang CTA'];
export const markerItems = (p: P): string[] => (Array.isArray(p.items) && p.items.length ? p.items : MLIST).slice(0, 5).map(String);
export const markerTimes = (items: string[], fps: number, at?: number[]) => {
  let t = Math.round(fps * 0.6);
  return items.map((it, i) => {
    const s = Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : t;
    t = writeEnd(it, s, 0.8) + 4;
    return s;
  });
};

/** B33: numbered handwritten list; each line gets a drawn check, one can get a red circle */
export const MarkerList: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const items = markerItems(p);
  const ts = markerTimes(items, L.fps, p.at);
  const title = txt(p.title, 'Checklist bago mag-boost');
  const acc = accent(p, b.primary);
  const hl = typeof p.highlight === 'number' ? p.highlight : -1;
  const fs = Math.min(76 * L.u, ((L.W * 0.66) / Math.max(10, ...items.map((s) => s.length))) * 1.8);
  return (
    <Board u={L.u}>
      <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.14 : L.H * 0.08}}>
        <Written text={title} at={2} size={Math.min(96 * L.u, ((L.W * 0.82) / Math.max(4, title.length)) * 1.75)} color={acc} font={b.fHand} />
      </div>
      <div style={{position: 'absolute', left: L.pad * 1.1, right: L.pad, top: L.portrait ? L.H * 0.27 : L.H * 0.26, display: 'flex', flexDirection: 'column', gap: 30 * L.u}}>
        {items.map((it, i) => {
          const end = writeEnd(it, ts[i], 0.8);
          return (
            <div key={i} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 22 * L.u}}>
              <svg width={fs * 1.1} height={fs * 1.1} viewBox="0 0 100 100" style={{overflow: 'visible', filter: 'url(#sketch)', flexShrink: 0}}>
                <Stroke d="M14 14 L86 16 L84 86 L16 84 Z" k={ease(f, ts[i] - 6, ts[i])} color={INK} w={6} />
                <Stroke d="M24 54 L44 74 L92 10" k={ease(f, end, end + 7)} color={GREEN} w={11} />
              </svg>
              <Written text={it} at={ts[i]} size={fs} color={INK} font={b.fHand} speed={0.8} />
              {i === hl && (
                <svg width={L.W * 0.8} height={fs * 1.9} viewBox="0 0 100 30" preserveAspectRatio="none" style={{position: 'absolute', left: -20 * L.u, top: -fs * 0.4, overflow: 'visible', filter: 'url(#sketch)'}}>
                  <Stroke d="M50 2 C90 1 99 12 96 20 C92 30 30 30 8 24 C-2 18 6 4 40 3" k={ease(f, end + 8, end + 20)} color={RED} w={1.2} />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </Board>
  );
};

/* ---------------- B34 sketch chart ---------------- */

/** B34: axes drawn by hand, a rising arrow line, labelled start and end points */
export const SketchChart: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const acc = accent(p, b.primary);
  const title = txt(p.title, 'Messages per week');
  const from = txt(p.from, '5');
  const to = txt(p.to, '60');
  const xLabel = txt(p.xLabel, 'Bago');
  const xLabel2 = txt(p.xLabel2, 'Pagkatapos');
  const W = L.portrait ? L.W * 0.78 : L.W * 0.55;
  const H = L.portrait ? L.H * 0.36 : L.H * 0.5;
  const x0 = (L.W - W) / 2;
  const y0 = L.portrait ? L.H * 0.3 : L.H * 0.25;
  const axis = ease(f, 6, 18);
  const line = ease(f, 18, 18 + L.fps * 0.9);
  const pts = [[0.04, 0.9], [0.25, 0.78], [0.42, 0.82], [0.6, 0.55], [0.78, 0.4], [0.96, 0.1]];
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(x * W).toFixed(1)} ${(y * H).toFixed(1)}`).join(' ');
  const endAt = 18 + Math.round(L.fps * 0.9);
  return (
    <Board u={L.u}>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.portrait ? L.H * 0.13 : L.H * 0.07, display: 'flex', justifyContent: 'center'}}>
        <Written text={title} at={2} size={Math.min(96 * L.u, ((L.W * 0.82) / Math.max(4, title.length)) * 1.75)} color={INK} font={b.fHand} />
      </div>
      <svg width={W} height={H} style={{position: 'absolute', left: x0, top: y0, overflow: 'visible', filter: 'url(#sketch)'}}>
        <path d={`M0 0 L2 ${H} L${W} ${H - 3}`} pathLength={1} fill="none" stroke={INK} strokeWidth={7 * L.u} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - axis} />
        <path d={d} pathLength={1} fill="none" stroke={acc} strokeWidth={10 * L.u} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - line} opacity={line > 0 ? 1 : 0} />
        {line >= 1 && <path d={`M${0.96 * W - 40 * L.u} ${0.1 * H + 6 * L.u} L${0.96 * W} ${0.1 * H} L${0.96 * W - 10 * L.u} ${0.1 * H + 40 * L.u}`} fill="none" stroke={acc} strokeWidth={10 * L.u} strokeLinecap="round" strokeLinejoin="round" />}
        {line > 0 && <circle cx={0.04 * W} cy={0.9 * H} r={14 * L.u} fill={RED} />}
        {line >= 1 && <circle cx={0.96 * W} cy={0.1 * H} r={16 * L.u} fill={GREEN} />}
      </svg>
      <div style={{position: 'absolute', left: x0 - 20 * L.u, top: y0 + 0.9 * H - 120 * L.u}}>
        <Written text={from} at={20} size={72 * L.u} color={RED} font={b.fHand} pen={false} />
      </div>
      <div style={{position: 'absolute', right: L.W - x0 - W - 10 * L.u, top: y0 + 0.1 * H - 140 * L.u}}>
        <Written text={to} at={endAt + 2} size={96 * L.u} color={GREEN} font={b.fHand} pen={false} />
      </div>
      <div style={{position: 'absolute', left: x0, width: W, top: y0 + H + 20 * L.u, display: 'flex', justifyContent: 'space-between'}}>
        <Written text={xLabel} at={10} size={44 * L.u} color={INK} font={b.fHand} pen={false} />
        <Written text={xLabel2} at={endAt + 6} size={44 * L.u} color={INK} font={b.fHand} pen={false} />
      </div>
    </Board>
  );
};
export const chartEnd = (fps: number) => 18 + Math.round(fps * 0.9);

/* ---------------- K11 marker CTA ---------------- */

/** K11: CTA written by marker, a box drawn around it, an arrow and a little star */
export const MarkerCTA: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const cta = txt(p.cta, b.cta);
  const title = txt(p.title, 'Tara, usap tayo');
  const handle = txt(p.handle, b.handle ?? '');
  const acc = accent(p, b.primary);
  const tEnd = writeEnd(title, 2);
  const cAt = tEnd + 2;
  const cEnd = writeEnd(cta, cAt, 0.9);
  const fs = Math.min(140 * L.u, ((L.W * 0.7) / Math.max(5, cta.length)) * 1.6);
  const boxK = ease(f, cEnd, cEnd + 10);
  const bw = Math.min(L.W * 0.86, cta.length * fs * 0.62 + 120 * L.u);
  const bh = fs * 1.6;
  const cy = L.H * 0.5;
  return (
    <Board u={L.u}>
      <div style={{position: 'absolute', left: 0, right: 0, top: cy - bh / 2 - 190 * L.u, display: 'flex', justifyContent: 'center'}}>
        <Written text={title} at={2} size={Math.min(100 * L.u, ((L.W * 0.85) / Math.max(4, title.length)) * 1.75)} color={INK} font={b.fHand} />
      </div>
      <svg width={bw} height={bh} viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', left: (L.W - bw) / 2, top: cy - bh / 2, overflow: 'visible', filter: 'url(#sketch)'}}>
        <Stroke d="M4 8 L97 4 L95 94 L3 92 Z" k={boxK} color={RED} w={1.6} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: cy - fs * 0.62, display: 'flex', justifyContent: 'center'}}>
        <Written text={cta} at={cAt} size={fs} color={acc} font={b.fH} speed={0.9} style={{textTransform: 'uppercase'}} />
      </div>
      <svg width={160 * L.u} height={160 * L.u} viewBox="0 0 100 100" style={{position: 'absolute', left: (L.W - bw) / 2 - 130 * L.u, top: cy + bh / 2 - 20 * L.u, overflow: 'visible', filter: 'url(#sketch)'}}>
        <Stroke d="M10 90 C20 50 50 30 88 20" k={ease(f, cEnd + 8, cEnd + 16)} color={INK} w={5} />
        <Stroke d="M70 12 L90 20 L78 38" k={ease(f, cEnd + 14, cEnd + 18)} color={INK} w={5} />
      </svg>
      <svg width={110 * L.u} height={110 * L.u} viewBox="0 0 100 100" style={{position: 'absolute', left: (L.W + bw) / 2 - 40 * L.u, top: cy - bh / 2 - 90 * L.u, overflow: 'visible', filter: 'url(#sketch)'}}>
        <Stroke d={ICONS.star[0]} k={ease(f, cEnd + 10, cEnd + 20)} color={acc} w={6} />
      </svg>
      {handle && (
        <div style={{position: 'absolute', left: 0, right: 0, top: cy + bh / 2 + 60 * L.u, display: 'flex', justifyContent: 'center'}}>
          <Written text={handle} at={cEnd + 12} size={50 * L.u} color={INK} font={b.fHand} pen={false} />
        </div>
      )}
    </Board>
  );
};
export const ctaWriteEnd = (p: P, cta: string) => writeEnd(cta, writeEnd(String(p.title ?? 'Tara, usap tayo'), 2) + 2, 0.9);
