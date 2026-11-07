import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Pill} from '../lib/Fx';
import {alpha, ease, fitSize, ink, pop, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Map look: B8 map pins · B53 route · B54 coverage radius · K19 map CTA.
// A stylized, made-up street map drawn in code (no map tiles, no real places implied unless you label them).
type P = Record<string, any>;

/** generated city: water edge, park, streets */
export const CityMap: React.FC<{seed?: string; dark?: boolean}> = ({seed = 'city', dark}) => {
  const L = useLayout();
  const land = dark ? '#1B1F2A' : '#EEF1F4';
  const road = dark ? '#2C3344' : '#FFFFFF';
  const major = dark ? '#3A4358' : '#FFE08A';
  const water = dark ? '#0F2338' : '#BFDDF5';
  const park = dark ? '#173226' : '#CFEFD6';
  const streets: React.ReactNode[] = [];
  for (let i = 0; i < 14; i++) {
    const y = (i / 14) * L.H + random(`${seed}y${i}`) * 40 * L.u;
    streets.push(<line key={`h${i}`} x1={0} y1={y} x2={L.W} y2={y + (random(`${seed}t${i}`) - 0.5) * 120 * L.u} stroke={road} strokeWidth={(i % 4 === 0 ? 22 : 10) * L.u} />);
  }
  for (let i = 0; i < 9; i++) {
    const x = (i / 9) * L.W + random(`${seed}x${i}`) * 40 * L.u;
    streets.push(<line key={`v${i}`} x1={x} y1={0} x2={x + (random(`${seed}u${i}`) - 0.5) * 140 * L.u} y2={L.H} stroke={road} strokeWidth={(i % 3 === 0 ? 22 : 10) * L.u} />);
  }
  return (
    <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
      <rect width={L.W} height={L.H} fill={land} />
      <path d={`M0 ${L.H * 0.78} C ${L.W * 0.3} ${L.H * 0.7}, ${L.W * 0.6} ${L.H * 0.9}, ${L.W} ${L.H * 0.8} L ${L.W} ${L.H} L 0 ${L.H} Z`} fill={water} />
      <rect x={L.W * 0.62} y={L.H * 0.18} width={L.W * 0.26} height={L.H * 0.12} rx={30 * L.u} fill={park} />
      {streets}
      <path d={`M0 ${L.H * 0.42} C ${L.W * 0.4} ${L.H * 0.38}, ${L.W * 0.6} ${L.H * 0.52}, ${L.W} ${L.H * 0.47}`} stroke={major} strokeWidth={30 * L.u} fill="none" />
    </svg>
  );
};

/** map pin with a pulse ring */
export const Pin: React.FC<{x: number; y: number; at: number; color: string; label?: string; icon?: string}> = ({x, y, at, color, label, icon}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  if (f < at) return null;
  const k = pop(f, L.fps, at, 260, 12);
  const pulse = ((f - at) % 30) / 30;
  const s = 90 * L.u;
  return (
    <>
      <div style={{position: 'absolute', left: x - s, top: y - s * 0.5, width: s * 2, height: s, borderRadius: '50%', border: `${4 * L.u}px solid ${color}`, opacity: 1 - pulse, transform: `scale(${0.3 + pulse})`}} />
      <div style={{position: 'absolute', left: x - s / 2, top: y - s * 1.25 - (1 - k) * 200 * L.u, width: s, height: s * 1.25}}>
        <svg width={s} height={s * 1.25} viewBox="0 0 40 50" style={{filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.35))'}}>
          <path d="M20 49 C20 49 3 30 3 18 A17 17 0 0 1 37 18 C37 30 20 49 20 49 Z" fill={color} stroke="#FFFFFF" strokeWidth={2.5} />
          <circle cx={20} cy={18} r={7} fill="#FFFFFF" />
        </svg>
        {icon && <div style={{position: 'absolute', left: 0, right: 0, top: s * 0.12, textAlign: 'center', fontSize: s * 0.36}}>{icon}</div>}
      </div>
      {label && (
        <div style={{position: 'absolute', left: x - 300 * L.u, width: 600 * L.u, top: y + 14 * L.u, display: 'flex', justifyContent: 'center', opacity: ease(f, at + 4, at + 10)}}>
          <Pill text={label} bg="#FFFFFF" color="#1E2235" size={34 * L.u} font={b.fB} style={{boxShadow: '0 6px 16px rgba(0,0,0,.25)'}} />
        </div>
      )}
    </>
  );
};

const Head: React.FC<{text: string}> = ({text}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const k = pop(f, L.fps, 0, 220, 13);
  return (
    <div style={{position: 'absolute', left: L.pad * 0.6, right: L.pad * 0.6, top: L.portrait ? L.H * 0.1 : L.H * 0.05, display: 'flex', justifyContent: 'center', transform: `scale(${k})`}}>
      <div style={{background: '#FFFFFF', borderRadius: 24 * L.u, padding: `${18 * L.u}px ${34 * L.u}px`, boxShadow: '0 12px 30px rgba(0,0,0,.25)', fontFamily: b.fH, fontSize: Math.min(84 * L.u, fitSize(text, L.u, L.portrait, 100)), color: '#1E2235', textTransform: 'uppercase', textAlign: 'center'}}>{text}</div>
    </div>
  );
};

/* ---------------- B8 map pins ---------------- */

const PINS = [
  {x: 0.3, y: 0.38, label: 'Branch 1'},
  {x: 0.68, y: 0.5, label: 'Branch 2'},
  {x: 0.45, y: 0.64, label: 'Branch 3'},
];
export const pinList = (p: P): {x: number; y: number; label?: string; icon?: string}[] => (Array.isArray(p.pins) && p.pins.length ? p.pins : PINS).slice(0, 6);
export const pinTimes = (n: number, fps: number, at?: number[]) => range(n).map((i) => (Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : Math.round(fps * 0.4) + i * 10));

/** B8: stylized city map; pins drop in with labels (branches, delivery points) */
export const MapPins: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const pins = pinList(p);
  const ts = pinTimes(pins.length, L.fps, p.at);
  const zoom = 1.08 - 0.08 * ease(f, 0, L.fps * 2);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <CityMap seed={p.seed ?? 'city'} dark={p.dark} />
        {pins.map((pn, i) => <Pin key={i} x={pn.x * L.W} y={pn.y * L.H} at={ts[i]} color={i === 0 ? '#E5484D' : '#2563EB'} label={pn.label} icon={pn.icon} />)}
      </AbsoluteFill>
      {txt(p.title, 'Malapit lang kami') && <Head text={txt(p.title, 'Malapit lang kami')} />}
    </AbsoluteFill>
  );
};

/* ---------------- B53 route ---------------- */

/** B53: a route draws from A to B through the streets; a vehicle rides it; ETA tag pops at the end */
export const MapRoute: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const from = p.from ?? {x: 0.22, y: 0.3, label: 'Shop'};
  const to = p.to ?? {x: 0.74, y: 0.66, label: 'Ikaw'};
  const eta = txt(p.eta, '30 mins');
  const icon = txt(p.icon, '🛵');
  const A = [from.x * L.W, from.y * L.H];
  const B = [to.x * L.W, to.y * L.H];
  const pts = [A, [A[0], (A[1] + B[1]) / 2], [B[0], (A[1] + B[1]) / 2], B];
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const end = Math.max(20, dur - Math.round(L.fps * 0.8));
  const k = ease(f, 10, end);
  // position along the polyline
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = seg.reduce((a, s) => a + s, 0);
  let left = k * total;
  let pos = A;
  for (let i = 0; i < seg.length; i++) {
    if (left <= seg[i]) {
      const t = left / seg[i];
      pos = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t];
      break;
    }
    left -= seg[i];
    pos = pts[i + 1];
  }
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <CityMap seed={p.seed ?? 'route'} dark={p.dark} />
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
        <path d={d} fill="none" stroke={alpha('#1E2235', 0.25)} strokeWidth={18 * L.u} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} pathLength={1} fill="none" stroke={p.color ?? '#2563EB'} strokeWidth={14 * L.u} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - k} />
      </svg>
      <Pin x={A[0]} y={A[1]} at={2} color="#1E2235" label={from.label} />
      <Pin x={B[0]} y={B[1]} at={6} color="#E5484D" label={to.label} />
      <div style={{position: 'absolute', left: pos[0] - 45 * L.u, top: pos[1] - 60 * L.u, fontSize: 90 * L.u, lineHeight: 1, filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.35))'}}>{icon}</div>
      {eta && f > end && <div style={{position: 'absolute', left: B[0] - 200 * L.u, width: 400 * L.u, top: B[1] - 260 * L.u, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, L.fps, end, 300, 12)})`}}><Pill text={eta} bg={b.primary} color={ink(b.primary)} size={48 * L.u} font={b.fH} /></div>}
      {txt(p.title, '') && <Head text={txt(p.title, '')} />}
    </AbsoluteFill>
  );
};

/* ---------------- B54 coverage radius ---------------- */

/** B54: pulsing radius around a pin with an area label ("Within 5 km", "Metro-wide delivery") */
export const MapRadius: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const cx = (p.x ?? 0.5) * L.W;
  const cy = (p.y ?? 0.52) * L.H;
  const r = Math.min(L.W, L.H) * (p.radius ?? 0.36) * ease(f, 4, 22);
  const label = txt(p.label, 'Within 5 km');
  const c = p.color ?? '#2563EB';
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <CityMap seed={p.seed ?? 'area'} dark={p.dark} />
      <div style={{position: 'absolute', left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: alpha(c, 0.18), border: `${6 * L.u}px dashed ${c}`, transform: `rotate(${f * 0.4}deg)`}} />
      {range(2).map((i) => {
        const pl = ((f + i * 15) % 30) / 30;
        return <div key={i} style={{position: 'absolute', left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: '50%', border: `${4 * L.u}px solid ${c}`, opacity: (1 - pl) * 0.6, transform: `scale(${0.2 + pl * 0.8})`}} />;
      })}
      <Pin x={cx} y={cy} at={0} color="#E5484D" />
      <div style={{position: 'absolute', left: 0, right: 0, top: cy + r * 0.55, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, L.fps, 16, 280, 12)})`}}><Pill text={label} bg={c} color="#FFFFFF" size={52 * L.u} font={b.fH} style={{textTransform: 'uppercase'}} /></div>
      {txt(p.title, '') && <Head text={txt(p.title, '')} />}
    </AbsoluteFill>
  );
};

/* ---------------- K19 map CTA ---------------- */

/** K19: map zooms into one pin; a card shows name, address line and the CTA */
export const MapCTA: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const name = txt(p.name, b.name);
  const address = txt(p.address, 'Open daily · 9AM–9PM');
  const cta = txt(p.cta, b.cta);
  const z = 1 + 0.5 * ease(f, 0, 24);
  const k = pop(f, L.fps, 14, 220, 13);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 45%'}}>
        <CityMap seed={p.seed ?? 'cta'} dark={p.dark} />
      </AbsoluteFill>
      <Pin x={L.W / 2} y={L.H * 0.45} at={4} color="#E5484D" />
      <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.H * 0.55, background: '#FFFFFF', borderRadius: 30 * L.u, padding: `${34 * L.u}px ${40 * L.u}px`, boxShadow: '0 20px 50px rgba(0,0,0,.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 * L.u, transform: `translateY(${(1 - k) * 200 * L.u}px)`, opacity: Math.min(1, k * 1.5)}}>
        <div style={{fontFamily: b.fH, fontSize: Math.min(84 * L.u, ((L.W * 0.7) / Math.max(4, name.length)) * 1.6), color: '#1E2235', textTransform: 'uppercase'}}>{name}</div>
        {address && <div style={{fontFamily: b.fB, fontWeight: 600, fontSize: 34 * L.u, color: '#5A6070'}}>{address}</div>}
        {cta && <Pill text={cta} bg={b.primary} color={ink(b.primary)} size={48 * L.u} font={b.fH} style={{marginTop: 10 * L.u, textTransform: 'uppercase'}} />}
      </div>
    </AbsoluteFill>
  );
};
export const routeEnd = (dur: number, fps: number) => Math.max(20, dur - Math.round(fps * 0.8));
