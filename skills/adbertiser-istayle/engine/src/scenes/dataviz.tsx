import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Pill} from '../lib/Fx';
import {alpha, ease, fitSize, ink, pop, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Data-viz look: B58 big number · B59 donut · B60 ranking bars · B61 annotated line chart · K22 data CTA.
// Clean charts on a dark slate, one brand-color series, gray context, numbers count up. Real numbers or the SAMPLE overlay.
type P = Record<string, any>;
const SLATE = '#0F1420';
const GRID = 'rgba(255,255,255,.08)';
const MUTED = 'rgba(255,255,255,.55)';

const fmt = (v: number, decimals = 0) => v.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
const Head: React.FC<{title: string; sub?: string}> = ({title, sub}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  return (
    <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.13 : L.H * 0.07, opacity: ease(f, 0, 10)}}>
      <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: Math.min(72 * L.u, fitSize(title, L.u, L.portrait, 90)), color: '#FFFFFF', lineHeight: 1.1}}>{title}</div>
      {sub && <div style={{fontFamily: b.fB, fontWeight: 500, fontSize: 32 * L.u, color: MUTED, marginTop: 10 * L.u}}>{sub}</div>}
    </div>
  );
};

/* ---------------- B58 big number ---------------- */

/** B58: one giant number counts up with a label and a delta chip (e.g. "+212%") */
export const BigNumber: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const value = Number(p.value ?? 1240);
  const dec = Number(p.decimals ?? 0);
  const pre = txt(p.prefix, '');
  const suf = txt(p.suffix, '');
  const label = txt(p.label, 'messages this month');
  const delta = txt(p.delta, '+212%');
  const k = ease(f, 4, 4 + L.fps * 1.2);
  const shown = `${pre}${fmt(value * k, dec)}${suf}`;
  const full = `${pre}${fmt(value, dec)}${suf}`;
  const size = Math.min(300 * L.u, ((L.W * 0.88) / Math.max(3, full.length)) * 1.7);
  const neg = delta.startsWith('-');
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${alpha(b.primary, 0.16)}, ${SLATE} 60%)`, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 * L.u}}>
      <div style={{fontFamily: b.fH, fontSize: size, lineHeight: 1, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums'}}>{shown}</div>
      {label && <div style={{fontFamily: b.fB, fontWeight: 600, fontSize: 44 * L.u, color: MUTED, opacity: ease(f, 8, 16)}}>{label}</div>}
      {delta && <div style={{transform: `scale(${pop(f, L.fps, 4 + Math.round(L.fps * 1.2), 300, 12)})`}}><Pill text={`${neg ? '▼' : '▲'} ${delta.replace(/^[+-]/, '')}`} bg={neg ? '#FF5C5C' : '#22C55E'} color="#FFFFFF" size={44 * L.u} font={b.fB} /></div>}
    </AbsoluteFill>
  );
};
export const bigEnd = (fps: number) => 4 + Math.round(fps * 1.2);

/* ---------------- B59 donut ---------------- */

/** B59: donut draws to a percentage; center shows the value; optional legend line */
export const Donut: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const pct = Math.max(0, Math.min(100, Number(p.value ?? 72)));
  const label = txt(p.label, 'ng viewers, nanood hanggang dulo');
  const title = txt(p.title, '');
  const k = ease(f, 6, 6 + L.fps * 1.1);
  const R = Math.min(L.W, L.H) * 0.3;
  const sw = R * 0.24;
  const C = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{background: SLATE}}>
      {title && <Head title={title} />}
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
        <circle cx={L.W / 2} cy={L.H * 0.47} r={R} fill="none" stroke={GRID} strokeWidth={sw} />
        <circle cx={L.W / 2} cy={L.H * 0.47} r={R} fill="none" stroke={p.color ?? b.primary} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${C * (pct / 100) * k} ${C}`} transform={`rotate(-90 ${L.W / 2} ${L.H * 0.47})`} style={{filter: `drop-shadow(0 0 ${14 * L.u}px ${alpha(p.color ?? b.primary, 0.6)})`}} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.H * 0.47 - R * 0.36, textAlign: 'center', fontFamily: b.fH, fontSize: R * 0.6, lineHeight: 1, color: '#FFFFFF'}}>{Math.round(pct * k)}%</div>
      {label && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.H * 0.47 + R + sw + 40 * L.u, textAlign: 'center', fontFamily: b.fB, fontWeight: 600, fontSize: 42 * L.u, color: MUTED, opacity: ease(f, 14, 22)}}>{label}</div>}
    </AbsoluteFill>
  );
};

/* ---------------- B60 ranking bars ---------------- */

export const rankList = (p: P): {label: string; value: number}[] => (Array.isArray(p.bars) && p.bars.length ? p.bars : [{label: 'Video ads', value: 64}, {label: 'Photo ads', value: 22}, {label: 'Text posts', value: 9}, {label: 'Others', value: 5}]).slice(0, 6).map((x: any) => ({label: String(x.label ?? ''), value: Number(x.value) || 0}));

/** B60: horizontal ranking bars grow in order; the top bar is in the brand color, values count up */
export const RankBars: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const bars = rankList(p);
  const title = txt(p.title, 'Saan galing ang benta?');
  const suf = txt(p.suffix, '%');
  const max = Math.max(1, ...bars.map((x) => x.value));
  const top = L.portrait ? L.H * 0.3 : L.H * 0.25;
  const rowH = Math.min(150 * L.u, (L.H * 0.48) / bars.length);
  const bw = L.W - 2 * L.pad;
  return (
    <AbsoluteFill style={{background: SLATE}}>
      <Head title={title} />
      {bars.map((x, i) => {
        const k = ease(f, 6 + i * 5, 6 + i * 5 + L.fps * 0.8);
        const hi = i === 0;
        return (
          <div key={i} style={{position: 'absolute', left: L.pad, width: bw, top: top + i * rowH, height: rowH - 20 * L.u}}>
            <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: Math.min(36 * L.u, rowH * 0.28), color: hi ? '#FFFFFF' : MUTED, marginBottom: 8 * L.u}}>{x.label}</div>
            <div style={{position: 'relative', height: rowH * 0.42, background: GRID, borderRadius: 10 * L.u}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(x.value / max) * 80 * k}%`, background: hi ? (p.color ?? b.primary) : 'rgba(255,255,255,.35)', borderRadius: 10 * L.u}} />
              <div style={{position: 'absolute', left: `calc(${(x.value / max) * 80 * k}% + ${14 * L.u}px)`, top: '50%', transform: 'translateY(-50%)', fontFamily: b.fH, fontSize: rowH * 0.34, color: hi ? (p.color ?? b.primary) : '#FFFFFF', whiteSpace: 'nowrap'}}>{Math.round(x.value * k)}{suf}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- B61 annotated line chart ---------------- */

/** B61: a line draws through the points; a callout marks the turning point ("Bagong ad dito") */
export const LineNote: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const series: number[] = Array.isArray(p.series) && p.series.length > 2 ? p.series.map(Number) : [8, 9, 7, 10, 9, 18, 26, 31, 42];
  const mark = typeof p.mark === 'number' ? p.mark : 4;
  const note = txt(p.note, 'Bagong ad dito');
  const title = txt(p.title, 'Messages per day');
  const W = L.W - 2 * L.pad;
  const H = L.portrait ? L.H * 0.36 : L.H * 0.5;
  const x0 = L.pad;
  const y0 = L.portrait ? L.H * 0.32 : L.H * 0.28;
  const mx = Math.max(...series);
  const pts = series.map((v, i) => [(i / (series.length - 1)) * W, H - (v / mx) * H * 0.9]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const k = ease(f, 6, 6 + L.fps * 1.3);
  const markAt = 6 + Math.round(L.fps * 1.3 * (mark / (series.length - 1)));
  const mk = pop(f, L.fps, markAt, 280, 12);
  const [mxp, myp] = pts[Math.min(mark, pts.length - 1)];
  const c = p.color ?? b.primary;
  return (
    <AbsoluteFill style={{background: SLATE}}>
      <Head title={title} />
      <svg width={W} height={H} style={{position: 'absolute', left: x0, top: y0, overflow: 'visible'}}>
        {range(5).map((i) => <line key={i} x1={0} x2={W} y1={(H / 4) * i} y2={(H / 4) * i} stroke={GRID} strokeWidth={2 * L.u} />)}
        <line x1={mxp} x2={mxp} y1={0} y2={H} stroke={alpha(c, 0.5)} strokeWidth={3 * L.u} strokeDasharray={`${10 * L.u} ${8 * L.u}`} opacity={mk} />
        <path d={d} pathLength={1} fill="none" stroke={c} strokeWidth={8 * L.u} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - k} style={{filter: `drop-shadow(0 0 ${10 * L.u}px ${alpha(c, 0.6)})`}} />
        {f >= markAt && <circle cx={mxp} cy={myp} r={14 * L.u} fill="#FFFFFF" stroke={c} strokeWidth={6 * L.u} />}
      </svg>
      {note && f >= markAt && (
        <div style={{position: 'absolute', left: Math.min(x0 + mxp - 40 * L.u, L.W - L.pad - 420 * L.u), top: y0 + myp - 150 * L.u, transform: `scale(${mk})`, transformOrigin: 'left bottom'}}>
          <Pill text={note} bg="#FFFFFF" color={SLATE} size={38 * L.u} font={b.fB} style={{boxShadow: '0 8px 24px rgba(0,0,0,.4)'}} />
        </div>
      )}
    </AbsoluteFill>
  );
};
export const lineMarkAt = (p: P, fps: number) => {
  const n = Array.isArray(p.series) && p.series.length > 2 ? p.series.length : 9;
  const mark = typeof p.mark === 'number' ? p.mark : 4;
  return 6 + Math.round(fps * 1.3 * (mark / (n - 1)));
};

/* ---------------- K22 data CTA ---------------- */

/** K22: "Gusto mo ng ganitong numbers?" with the CTA pill and a tiny sparkline */
export const DataCTA: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const title = txt(p.title, 'Gusto mo ng ganitong numbers?');
  const cta = txt(p.cta, b.cta);
  const handle = txt(p.handle, b.handle ?? '');
  const k = ease(f, 4, 24);
  const W = L.W * 0.6;
  const pts = [10, 12, 9, 15, 14, 22, 27, 35].map((v, i, a) => [(i / (a.length - 1)) * W, 120 * L.u - (v / 35) * 110 * L.u]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(b.primary, 0.18)}, ${SLATE} 60%)`, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40 * L.u}}>
      <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: Math.min(80 * L.u, fitSize(title, L.u, L.portrait, 100)), color: '#FFFFFF', textAlign: 'center', padding: `0 ${L.pad}px`, opacity: ease(f, 0, 10)}}>{title}</div>
      <svg width={W} height={130 * L.u}><path d={d} pathLength={1} fill="none" stroke={b.primary} strokeWidth={8 * L.u} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - k} /></svg>
      {cta && <div style={{transform: `scale(${pop(f, L.fps, 14, 260, 12)})`}}><Pill text={cta} bg={b.primary} color={ink(b.primary)} size={56 * L.u} font={b.fH} style={{textTransform: 'uppercase'}} /></div>}
      {handle && <div style={{fontFamily: b.fB, fontWeight: 600, fontSize: 34 * L.u, color: MUTED}}>{handle}</div>}
    </AbsoluteFill>
  );
};
