import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Media, asset} from '../lib/Media';
import {alpha, ease, fitSize, ink, lin, pop, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Glass UI look: B17 glass title · B2 dashboard · B22 cursor demo · B23 workflow steps · B30 glass pricing · K10 glass CTA.
type P = Record<string, any>;

/** soft moving color blobs (brand colors) behind frosted glass; optional photo/clip underneath */
export const GlassBg: React.FC<{c1: string; c2: string; f: number; u: number; bg?: string}> = ({c1, c2, f, u, bg}) => {
  const a = (k: number, s: number) => 50 + Math.sin(f / s + k) * 22;
  return (
    <AbsoluteFill style={{background: '#0B0B12'}}>
      {bg ? <Media src={bg} zoom="in" dim={0.45} blur={26 * u} /> : null}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${a(0, 40)}% ${a(1, 55)}%, ${alpha(c1, 0.55)}, transparent 42%), radial-gradient(circle at ${a(2, 47)}% ${a(3, 38)}%, ${alpha(c2, 0.55)}, transparent 45%), radial-gradient(circle at ${a(4, 60)}% ${a(5, 44)}%, ${alpha('#2EC5FF', 0.28)}, transparent 40%)`,
          filter: `blur(${30 * u}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** frosted glass panel style */
export const glassStyle = (u: number, strong = false): React.CSSProperties => ({
  background: `linear-gradient(135deg, ${alpha('#FFFFFF', strong ? 0.24 : 0.16)}, ${alpha('#FFFFFF', 0.05)})`,
  border: `${2 * u}px solid ${alpha('#FFFFFF', 0.32)}`,
  backdropFilter: `blur(${24 * u}px)`,
  WebkitBackdropFilter: `blur(${24 * u}px)`,
  boxShadow: `0 ${24 * u}px ${60 * u}px rgba(0,0,0,.35), inset 0 ${2 * u}px 0 ${alpha('#FFFFFF', 0.35)}`,
  borderRadius: 36 * u,
  boxSizing: 'border-box',
});

/** diagonal shine that crosses a glass panel once */
const Shine: React.FC<{f: number; at: number; fps: number}> = ({f, at, fps}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit', pointerEvents: 'none'}}>
    <div style={{position: 'absolute', top: '-20%', bottom: '-20%', width: '40%', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.35), transparent)', transform: `translateX(${lin(f, at, at + fps * 0.8, -150, 350)}%) skewX(-12deg)`}} />
  </div>
);

/* ---------------- B17 glass title ---------------- */

/** B17: frosted glass card rises over moving color blobs; big title, sub and a shine */
export const GlassTitle: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const title = txt(p.title, 'Ads na mukhang premium');
  const sub = txt(p.sub, 'Kahit phone lang ang gamit');
  const tag = txt(p.tag, '');
  const k = pop(f, L.fps, 0, 160, 15);
  const cw = L.portrait ? L.W - 2 * L.pad : L.W * 0.6;
  return (
    <AbsoluteFill>
      <GlassBg c1={b.primary} c2={b.secondary} f={f} u={L.u} bg={p.bg} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{...glassStyle(L.u, true), position: 'relative', width: cw, padding: `${70 * L.u}px ${60 * L.u}px`, textAlign: 'center', transform: `translateY(${(1 - k) * 160 * L.u}px) scale(${0.92 + 0.08 * k})`, opacity: Math.min(1, k * 1.5)}}>
          {tag && <div style={{display: 'inline-block', marginBottom: 26 * L.u, padding: `${8 * L.u}px ${26 * L.u}px`, borderRadius: 99, background: alpha(b.primary, 0.9), color: ink(b.primary), fontFamily: b.fB, fontWeight: 800, fontSize: 32 * L.u, letterSpacing: 2 * L.u}}>{tag}</div>}
          <div style={{fontFamily: b.fH, fontSize: Math.min(130 * L.u, fitSize(title, L.u, L.portrait, 150)), lineHeight: 1.02, color: '#FFFFFF', textTransform: 'uppercase'}}>{title}</div>
          {sub && <div style={{fontFamily: b.fB, fontWeight: 600, fontSize: 44 * L.u, color: alpha('#FFFFFF', 0.85), marginTop: 26 * L.u, opacity: ease(f, 10, 18)}}>{sub}</div>}
          <Shine f={f} at={14} fps={L.fps} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- B2 dashboard ---------------- */

const KPIS = [
  {label: 'Reach', value: 48200, delta: '+32%'},
  {label: 'Messages', value: 312, delta: '+18%'},
  {label: 'Cost / msg', value: 42, prefix: '₱', delta: '-21%'},
];
export const kpiList = (p: P): {label: string; value: number; prefix?: string; suffix?: string; delta?: string}[] => (Array.isArray(p.kpis) && p.kpis.length ? p.kpis : KPIS).slice(0, 3);

/** B2: glass app dashboard: KPI tiles count up, a line chart draws itself. Mock data needs the SAMPLE overlay. */
export const Dashboard: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const kpis = kpiList(p);
  const series: number[] = Array.isArray(p.series) && p.series.length > 1 ? p.series.map(Number) : [12, 18, 15, 26, 31, 29, 44, 52];
  const title = txt(p.title, 'Ads Dashboard');
  const k = pop(f, L.fps, 0, 170, 15);
  const ww = L.portrait ? L.W - 1.2 * L.pad : L.W * 0.72;
  const wh = L.portrait ? L.H * 0.56 : L.H * 0.76;
  const cw = ww - 80 * L.u;
  const chH = wh * 0.42;
  const mx = Math.max(...series);
  const mn = Math.min(...series);
  const pts = series.map((v, i) => [(i / (series.length - 1)) * cw, chH - ((v - mn) / Math.max(1, mx - mn)) * chH * 0.85 - chH * 0.05]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const draw = ease(f, 14, 14 + L.fps * 1.2);
  const lastI = Math.min(pts.length - 1, Math.floor(draw * (pts.length - 1)));
  return (
    <AbsoluteFill>
      <GlassBg c1={b.primary} c2={b.secondary} f={f} u={L.u} bg={p.bg} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: L.portrait ? L.H * 0.04 : 0}}>
        <div style={{...glassStyle(L.u, true), position: 'relative', width: ww, height: wh, padding: 40 * L.u, transform: `translateY(${(1 - k) * 140 * L.u}px) rotateX(${(1 - k) * 18}deg)`, opacity: Math.min(1, k * 1.5), display: 'flex', flexDirection: 'column', gap: 30 * L.u}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14 * L.u}}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{width: 18 * L.u, height: 18 * L.u, borderRadius: '50%', background: c}} />)}
            <div style={{marginLeft: 16 * L.u, fontFamily: b.fB, fontWeight: 800, fontSize: 38 * L.u, color: '#FFFFFF'}}>{title}</div>
          </div>
          <div style={{display: 'flex', gap: 18 * L.u}}>
            {kpis.map((x, i) => {
              const kk = ease(f, 8 + i * 5, 8 + i * 5 + L.fps * 0.9);
              const v = x.value * kk;
              const shown = Number.isInteger(x.value) ? Math.round(v).toLocaleString('en-US') : v.toFixed(1);
              const neg = String(x.delta ?? '').startsWith('-');
              return (
                <div key={i} style={{flex: 1, minWidth: 0, borderRadius: 22 * L.u, background: alpha('#FFFFFF', 0.08), border: `${1.5 * L.u}px solid ${alpha('#FFFFFF', 0.18)}`, padding: `${18 * L.u}px ${20 * L.u}px`, opacity: ease(f, 6 + i * 5, 12 + i * 5)}}>
                  <div style={{fontFamily: b.fB, fontWeight: 600, fontSize: 26 * L.u, color: alpha('#FFFFFF', 0.7), whiteSpace: 'nowrap'}}>{x.label}</div>
                  <div style={{fontFamily: b.fH, fontSize: 58 * L.u, color: '#FFFFFF', lineHeight: 1.1, whiteSpace: 'nowrap'}}>
                    {x.prefix ?? ''}
                    {shown}
                    {x.suffix ?? ''}
                  </div>
                  {x.delta && <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: 26 * L.u, color: neg && x.label.toLowerCase().includes('cost') ? '#3BE38B' : neg ? '#FF6B6B' : '#3BE38B'}}>{x.delta}</div>}
                </div>
              );
            })}
          </div>
          <div style={{position: 'relative', flex: 1, borderRadius: 22 * L.u, background: alpha('#FFFFFF', 0.06), border: `${1.5 * L.u}px solid ${alpha('#FFFFFF', 0.14)}`, padding: `${20 * L.u}px ${20 * L.u}px`}}>
            <svg width={cw} height={chH} style={{position: 'absolute', left: 20 * L.u, bottom: 20 * L.u, overflow: 'visible'}}>
              <defs>
                <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={b.primary} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={b.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              {range(4).map((i) => <line key={i} x1={0} x2={cw} y1={(chH / 4) * i} y2={(chH / 4) * i} stroke={alpha('#FFFFFF', 0.1)} strokeWidth={1.5 * L.u} />)}
              <path d={`${d} L${cw},${chH} L0,${chH} Z`} fill="url(#gArea)" opacity={draw} />
              <path d={d} pathLength={1} fill="none" stroke={b.primary} strokeWidth={7 * L.u} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - draw} style={{filter: `drop-shadow(0 0 ${10 * L.u}px ${alpha(b.primary, 0.8)})`}} />
              {draw > 0.02 && <circle cx={pts[lastI][0]} cy={pts[lastI][1]} r={11 * L.u} fill="#FFFFFF" stroke={b.primary} strokeWidth={5 * L.u} />}
            </svg>
          </div>
          <Shine f={f} at={20} fps={L.fps} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- B22 cursor demo ---------------- */

const BUTTONS = ['Isulat ang hook', 'Piliin ang style', 'I-render ang ad'];
export const cursorButtons = (p: P): string[] => (Array.isArray(p.buttons) && p.buttons.length ? p.buttons : BUTTONS).slice(0, 4).map(String);
export const clickTimes = (n: number, dur: number, fps: number, at?: number[]) => {
  const start = Math.round(fps * 0.75);
  const gap = Math.max(10, (dur - start - fps * 0.9) / Math.max(1, n));
  return range(n).map((i) => (Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : Math.round(start + i * gap)));
};

const Pointer: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{display: 'block', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.45))'}}>
    <path d="M6 3 L6 33 L14 25 L20 37 L25 35 L19 23 L30 23 Z" fill="#FFFFFF" stroke="#111" strokeWidth={2.4} strokeLinejoin="round" />
  </svg>
);

/** B22: a cursor clicks through buttons in a glass app; each click ticks a step, then the result pops */
export const CursorDemo: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const btns = cursorButtons(p);
  const ts = clickTimes(btns.length, dur, L.fps, p.at);
  const title = txt(p.title, 'Ad Maker');
  const result = txt(p.result, 'Ad ready ✓');
  const k = pop(f, L.fps, 0, 170, 15);
  const ww = L.portrait ? L.W - 1.4 * L.pad : L.W * 0.5;
  const bh = 120 * L.u;
  const gap = 26 * L.u;
  const wx = (L.W - ww) / 2;
  const headH = 110 * L.u;
  const wh = headH + btns.length * (bh + gap) + 60 * L.u + 130 * L.u;
  const wy = L.H / 2 - wh / 2;
  const btnY = (i: number) => wy + headH + 30 * L.u + i * (bh + gap);
  // cursor path: start bottom-right, move to each button before its click
  const targets = btns.map((_, i) => [wx + ww * (0.62 + (i % 2) * 0.12), btnY(i) + bh * 0.55]);
  let cx = L.W * 0.9;
  let cy = L.H * 0.85;
  targets.forEach(([tx, ty], i) => {
    const m = ease(f, ts[i] - 12, ts[i] - 1);
    cx = cx + (tx - cx) * m;
    cy = cy + (ty - cy) * m;
  });
  const lastT = ts[ts.length - 1] ?? 0;
  const resK = pop(f, L.fps, lastT + 8, 240, 12);
  return (
    <AbsoluteFill>
      <GlassBg c1={b.primary} c2={b.secondary} f={f} u={L.u} bg={p.bg} />
      <div style={{...glassStyle(L.u, true), position: 'absolute', left: wx, top: wy, width: ww, height: wh, padding: `${30 * L.u}px ${36 * L.u}px`, transform: `translateY(${(1 - k) * 120 * L.u}px)`, opacity: Math.min(1, k * 1.5)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14 * L.u, height: headH - 30 * L.u}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{width: 18 * L.u, height: 18 * L.u, borderRadius: '50%', background: c}} />)}
          <div style={{marginLeft: 16 * L.u, fontFamily: b.fB, fontWeight: 800, fontSize: 40 * L.u, color: '#FFFFFF'}}>{title}</div>
        </div>
      </div>
      {btns.map((t, i) => {
        const clicked = f >= ts[i];
        const press = clicked && f < ts[i] + 4 ? 0.95 : 1;
        return (
          <div key={i} style={{position: 'absolute', left: wx + 36 * L.u, width: ww - 72 * L.u, top: btnY(i), height: bh, borderRadius: 26 * L.u, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 22 * L.u, padding: `0 ${30 * L.u}px`, background: clicked ? alpha(b.primary, 0.9) : alpha('#FFFFFF', 0.1), border: `${2 * L.u}px solid ${clicked ? b.primary : alpha('#FFFFFF', 0.25)}`, color: clicked ? ink(b.primary) : '#FFFFFF', fontFamily: b.fB, fontWeight: 800, fontSize: 42 * L.u, transform: `scale(${press})`, opacity: ease(f, 6 + i * 4, 12 + i * 4), boxShadow: clicked ? `0 0 ${30 * L.u}px ${alpha(b.primary, 0.5)}` : 'none'}}>
            <div style={{width: 46 * L.u, height: 46 * L.u, borderRadius: '50%', border: `${4 * L.u}px solid ${clicked ? ink(b.primary) : alpha('#FFFFFF', 0.5)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 * L.u, flexShrink: 0}}>{clicked ? '✓' : i + 1}</div>
            <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{t}</div>
          </div>
        );
      })}
      {result && f >= lastT + 8 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: btnY(btns.length) + 10 * L.u, display: 'flex', justifyContent: 'center', transform: `scale(${resK})`}}>
          <div style={{padding: `${20 * L.u}px ${44 * L.u}px`, borderRadius: 99, background: '#22B573', color: '#FFFFFF', fontFamily: b.fH, fontSize: 56 * L.u, boxShadow: `0 0 ${40 * L.u}px ${alpha('#22B573', 0.6)}`}}>{result}</div>
        </div>
      )}
      {ts.map((t, i) => (f >= t && f < t + 12 ? <div key={i} style={{position: 'absolute', left: targets[i][0] - 50 * L.u, top: targets[i][1] - 50 * L.u, width: 100 * L.u, height: 100 * L.u, borderRadius: '50%', border: `${5 * L.u}px solid #FFFFFF`, opacity: 1 - (f - t) / 12, transform: `scale(${0.3 + ((f - t) / 12) * 1.2})`}} /> : null))}
      <div style={{position: 'absolute', left: cx - 8 * L.u, top: cy - 6 * L.u, transform: `scale(${ts.some((t) => f >= t && f < t + 4) ? 0.85 : 1})`}}>
        <Pointer size={84 * L.u} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- B23 workflow steps ---------------- */

const STEPS = [
  {icon: '📝', label: 'Script'},
  {icon: '🎬', label: 'Shoot o AI'},
  {icon: '✂️', label: 'Edit + captions'},
  {icon: '🚀', label: 'Post + ads'},
];
export const stepsList = (p: P): {icon?: string; label: string}[] => (Array.isArray(p.steps) && p.steps.length ? p.steps : STEPS).slice(0, 5).map((s: any) => (typeof s === 'string' ? {label: s} : {icon: s.icon, label: String(s.label ?? '')}));
export const stepTimes = (n: number, dur: number, fps: number, at?: number[]) => {
  const start = Math.round(fps * 0.3);
  const gap = Math.max(8, (dur - start - fps * 0.6) / Math.max(1, n));
  return range(n).map((i) => (Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : Math.round(start + i * gap)));
};

/** B23: glass step cards connected by a line; a light dot travels the line as each step pops */
export const Workflow: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const steps = stepsList(p);
  const ts = stepTimes(steps.length, dur, L.fps, p.at);
  const title = txt(p.title, 'Ganito ang proseso');
  const n = steps.length;
  const vert = L.portrait;
  const cardW = vert ? L.W * 0.68 : (L.W * 0.8) / n - 30 * L.u;
  const cardH = vert ? Math.min(150 * L.u, (L.H * 0.44) / n - 30 * L.u) : 230 * L.u;
  const gap = vert ? (L.H * 0.46 - n * cardH) / Math.max(1, n - 1) : 30 * L.u;
  const x0 = vert ? (L.W - cardW) / 2 + 40 * L.u : (L.W - (n * cardW + (n - 1) * gap)) / 2;
  const y0 = vert ? L.H * 0.27 : L.H * 0.42;
  const pos = (i: number) => (vert ? [x0, y0 + i * (cardH + gap)] : [x0 + i * (cardW + gap), y0]);
  const lineK = (i: number) => ease(f, ts[i], ts[i + 1] ?? ts[i] + 10);
  const tk = pop(f, L.fps, 0, 220, 13);
  return (
    <AbsoluteFill>
      <GlassBg c1={b.primary} c2={b.secondary} f={f} u={L.u} bg={p.bg} />
      {title && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: vert ? L.H * 0.13 : L.H * 0.14, textAlign: 'center', fontFamily: b.fH, fontSize: Math.min(100 * L.u, fitSize(title, L.u, L.portrait, 120)), color: '#FFFFFF', textTransform: 'uppercase', opacity: tk, transform: `translateY(${(1 - tk) * -30 * L.u}px)`}}>{title}</div>}
      {/* connectors */}
      {steps.slice(0, -1).map((_, i) => {
        const [ax, ay] = pos(i);
        const [bx, by] = pos(i + 1);
        const k2 = lineK(i);
        const x1 = vert ? x0 - 40 * L.u : ax + cardW;
        const y1 = vert ? ay + cardH : ay + cardH / 2;
        const x2 = vert ? x0 - 40 * L.u : bx;
        const y2 = vert ? by : by + cardH / 2;
        return (
          <svg key={i} width={L.W} height={L.H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * k2} y2={y1 + (y2 - y1) * k2} stroke={b.primary} strokeWidth={6 * L.u} strokeLinecap="round" style={{filter: `drop-shadow(0 0 ${8 * L.u}px ${b.primary})`}} />
            {k2 > 0 && k2 < 1 && <circle cx={x1 + (x2 - x1) * k2} cy={y1 + (y2 - y1) * k2} r={12 * L.u} fill="#FFFFFF" style={{filter: `drop-shadow(0 0 ${12 * L.u}px #fff)`}} />}
          </svg>
        );
      })}
      {steps.map((s, i) => {
        const [x, y] = pos(i);
        const k = pop(f, L.fps, ts[i], 220, 14);
        const done = f >= ts[i];
        return (
          <React.Fragment key={i}>
            {vert && <div style={{position: 'absolute', left: x0 - 40 * L.u - 22 * L.u, top: y + cardH / 2 - 22 * L.u, width: 44 * L.u, height: 44 * L.u, borderRadius: '50%', background: done ? b.primary : alpha('#FFFFFF', 0.25), color: ink(b.primary), fontFamily: b.fB, fontWeight: 900, fontSize: 24 * L.u, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: done ? `0 0 ${16 * L.u}px ${b.primary}` : 'none'}}>{i + 1}</div>}
            <div style={{...glassStyle(L.u), position: 'absolute', left: x + (vert ? 30 * L.u : 0), top: y, width: cardW, height: cardH, display: 'flex', flexDirection: vert ? 'row' : 'column', alignItems: 'center', justifyContent: vert ? 'flex-start' : 'center', gap: 24 * L.u, padding: `0 ${30 * L.u}px`, transform: `scale(${0.85 + 0.15 * k})`, opacity: Math.min(1, k * 1.6), borderRadius: 28 * L.u}}>
              {s.icon && <div style={{fontSize: cardH * (vert ? 0.42 : 0.3), lineHeight: 1}}>{s.icon}</div>}
              <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: Math.min(48 * L.u, cardH * 0.32), color: '#FFFFFF', textAlign: vert ? 'left' : 'center', lineHeight: 1.1}}>{s.label}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- B30 glass pricing ---------------- */

const TIERS = [
  {name: 'Starter', price: '₱999', items: ['1 video ad', 'Captions + music']},
  {name: 'Growth', price: '₱2,499', items: ['3 video ads', 'Hooks A/B test'], best: true},
  {name: 'Pro', price: '₱4,999', items: ['6 video ads', 'Monthly report']},
];
export const tierList = (p: P): {name: string; price: string; items?: string[]; best?: boolean}[] => (Array.isArray(p.tiers) && p.tiers.length ? p.tiers : TIERS).slice(0, 3);
export const tierTimes = (n: number, fps: number) => range(n).map((i) => Math.round(fps * 0.35) + i * 7);

/** B30: 1–3 glass price tiers slide in; the best one glows with a tag */
export const GlassPricing: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const tiers = tierList(p);
  const ts = tierTimes(tiers.length, L.fps);
  const title = txt(p.title, 'Pili ka ng package');
  const vert = L.portrait;
  const cw = vert ? L.W - 1.6 * L.pad : (L.W * 0.8) / tiers.length - 30 * L.u;
  const ch = vert ? Math.min(250 * L.u, (L.H * 0.56) / tiers.length - 26 * L.u) : L.H * 0.5;
  const tk = pop(f, L.fps, 0, 220, 13);
  return (
    <AbsoluteFill>
      <GlassBg c1={b.primary} c2={b.secondary} f={f} u={L.u} bg={p.bg} />
      {title && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: vert ? L.H * 0.12 : L.H * 0.08, textAlign: 'center', fontFamily: b.fH, fontSize: Math.min(100 * L.u, fitSize(title, L.u, L.portrait, 120)), color: '#FFFFFF', textTransform: 'uppercase', opacity: tk}}>{title}</div>}
      <div style={{position: 'absolute', left: 0, right: 0, top: vert ? L.H * 0.24 : L.H * 0.28, display: 'flex', flexDirection: vert ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: 26 * L.u}}>
        {tiers.map((t, i) => {
          const k = pop(f, L.fps, ts[i], 200, 14);
          const best = !!t.best;
          return (
            <div key={i} style={{...glassStyle(L.u, best), position: 'relative', width: cw, height: ch, padding: `${26 * L.u}px ${36 * L.u}px`, display: 'flex', flexDirection: vert ? 'row' : 'column', alignItems: vert ? 'center' : 'flex-start', justifyContent: 'space-between', gap: 20 * L.u, border: best ? `${4 * L.u}px solid ${b.primary}` : glassStyle(L.u).border, boxShadow: best ? `0 0 ${50 * L.u}px ${alpha(b.primary, 0.55)}, ${glassStyle(L.u).boxShadow}` : glassStyle(L.u).boxShadow, transform: `translateX(${(1 - k) * (vert ? (i % 2 ? 1 : -1) * L.W * 0.5 : 0)}px) translateY(${vert ? 0 : (1 - k) * 200 * L.u}px) scale(${best ? 1.03 : 1})`, opacity: Math.min(1, k * 1.5)}}>
              {best && <div style={{position: 'absolute', top: -24 * L.u, right: 30 * L.u, padding: `${6 * L.u}px ${20 * L.u}px`, borderRadius: 99, background: b.primary, color: ink(b.primary), fontFamily: b.fB, fontWeight: 900, fontSize: 26 * L.u, letterSpacing: 2 * L.u}}>{txt(p.bestLabel, 'BEST VALUE')}</div>}
              <div style={{minWidth: 0}}>
                <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: 42 * L.u, color: '#FFFFFF'}}>{t.name}</div>
                {(t.items ?? []).slice(0, 3).map((it, j) => <div key={j} style={{fontFamily: b.fB, fontWeight: 600, fontSize: 28 * L.u, color: alpha('#FFFFFF', 0.8), whiteSpace: 'nowrap'}}>✓ {it}</div>)}
              </div>
              <div style={{fontFamily: b.fH, fontSize: Math.min(96 * L.u, ch * 0.42), color: best ? b.primary : '#FFFFFF', whiteSpace: 'nowrap'}}>{t.price}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- K10 glass CTA ---------------- */

/** K10: glass end card: logo or name, headline, glowing CTA button with shine, handle */
export const GlassCTA: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const logo: string | undefined = p.logo ?? b.logo;
  const name = txt(p.name, b.name);
  const headline = txt(p.headline, 'Simulan na natin');
  const cta = txt(p.cta, b.cta);
  const handle = txt(p.handle, b.handle ?? '');
  const k = pop(f, L.fps, 0, 170, 15);
  const bk = pop(f, L.fps, 12, 240, 12);
  const cw = L.portrait ? L.W - 2 * L.pad : L.W * 0.5;
  return (
    <AbsoluteFill>
      <GlassBg c1={b.primary} c2={b.secondary} f={f} u={L.u} bg={p.bg} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{...glassStyle(L.u, true), position: 'relative', width: cw, padding: `${60 * L.u}px ${50 * L.u}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 * L.u, transform: `translateY(${(1 - k) * 140 * L.u}px)`, opacity: Math.min(1, k * 1.5)}}>
          {logo ? <Img src={asset(logo)} style={{height: 150 * L.u, objectFit: 'contain'}} /> : <div style={{fontFamily: b.fH, fontSize: Math.min(110 * L.u, ((cw * 0.85) / Math.max(4, name.length)) * 1.6), color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 2 * L.u}}>{name}</div>}
          {headline && <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: 48 * L.u, color: alpha('#FFFFFF', 0.9), textAlign: 'center'}}>{headline}</div>}
          {cta && (
            <div style={{position: 'relative', overflow: 'hidden', padding: `${26 * L.u}px ${64 * L.u}px`, borderRadius: 99, background: b.primary, color: ink(b.primary), fontFamily: b.fH, fontSize: 64 * L.u, textTransform: 'uppercase', letterSpacing: 2 * L.u, boxShadow: `0 0 ${50 * L.u}px ${alpha(b.primary, 0.6)}`, transform: `scale(${bk * (1 + 0.03 * Math.sin(f / 5))})`, whiteSpace: 'nowrap'}}>
              {cta}
              <Shine f={f} at={20} fps={L.fps} />
            </div>
          )}
          {handle && <div style={{fontFamily: b.fB, fontWeight: 600, fontSize: 36 * L.u, color: alpha('#FFFFFF', 0.75)}}>{handle}</div>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
