import React from 'react';
import {AbsoluteFill, Img, random, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Media, asset, parseDemo} from '../lib/Media';
import {alpha, ease, fitSize, lin, pop, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Neon / hologram look: B12 neon sign · B26 hologram HUD · B27 neon price · B28 hologram product · B29 neon checklist · K9 neon CTA.
// Colors default to the brand (primary = neon 1, secondary = neon 2); override with color / color2.
type P = Record<string, any>;

/** layered glow for neon tubes */
export const glow = (c: string, u: number, k = 1) =>
  `0 0 ${2 * u}px #fff, 0 0 ${6 * u * k}px ${c}, 0 0 ${16 * u * k}px ${c}, 0 0 ${34 * u * k}px ${c}, 0 0 ${64 * u * k}px ${alpha(c, 0.8)}`;

/** neon warm-up: random flicker for ~12 frames after `on`, then steady with rare quick dips */
export const flicker = (f: number, on: number, seed: string) => {
  if (f < on) return 0;
  const k = f - on;
  if (k < 12) return random(`${seed}w${k}`) > 0.45 ? 1 : 0.15;
  return random(`${seed}d${Math.floor(f / 2)}`) > 0.97 ? 0.55 : 1;
};

/** brighten a hex color toward white so a dark brand color still reads as neon */
const lift = (hex: string, k = 0.35) => {
  if (!hex.startsWith('#')) return hex;
  const h = hex.length === 4 ? hex.slice(1).split('').map((c) => c + c).join('') : hex.slice(1, 7);
  const n = parseInt(h, 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (255 - v) * k));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};
const neon1 = (p: P, b: {primary: string}) => p.color ?? lift(b.primary, 0.1);
const neon2 = (p: P, b: {secondary: string}) => p.color2 ?? lift(b.secondary, 0.35);

/** dark wall with soft colored light spill */
export const NeonWall: React.FC<{c1: string; c2: string; u: number; bg?: string; level?: number}> = ({c1, c2, u, bg, level = 1}) => (
  <AbsoluteFill style={{background: '#08070B'}}>
    {bg ? <Media src={bg} zoom="none" dim={0.78} blur={6 * u} /> : null}
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${alpha('#FFFFFF', 0.035)} ${2 * u}px, transparent ${2 * u}px), linear-gradient(90deg, ${alpha('#FFFFFF', 0.025)} ${2 * u}px, transparent ${2 * u}px)`,
        backgroundSize: `${180 * u}px ${62 * u}px`,
      }}
    />
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, ${alpha(c1, 0.22 * level)}, transparent 55%), radial-gradient(circle at 50% 70%, ${alpha(c2, 0.16 * level)}, transparent 55%)`}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,.75) 100%)'}} />
  </AbsoluteFill>
);

/** scanlines + slow sweep for hologram parts */
const Scan: React.FC<{c: string; f: number; u: number; opacity?: number}> = ({c, f, u, opacity = 1}) => (
  <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
    <AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(0deg, ${alpha(c, 0.12)} 0 ${2 * u}px, transparent ${2 * u}px ${6 * u}px)`}} />
    <AbsoluteFill style={{background: `linear-gradient(180deg, transparent 0%, ${alpha(c, 0.25)} 50%, transparent 100%)`, height: '18%', transform: `translateY(${((f * 9 * u) % (2400 * u)) - 300 * u}px)`}} />
  </AbsoluteFill>
);

/* ---------------- B12 neon sign ---------------- */

export const signTimes = (n: number, fps: number) => range(n).map((i) => Math.round(fps * 0.15) + i * 10);

/** B12: neon tube sign flickers on line by line (line 1 script, others block letters) */
export const NeonSign: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const lines = txt(p.text, 'Bukas na|Ads mo?').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const ts = signTimes(lines.length, L.fps);
  const c1 = neon1(p, b);
  const c2 = neon2(p, b);
  const sub = txt(p.sub, '');
  const lit = Math.max(...ts.map((t, i) => flicker(f, t, `l${i}`)));
  return (
    <AbsoluteFill>
      <NeonWall c1={c1} c2={c2} u={L.u} bg={p.bg} level={lit} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 * L.u, paddingBottom: L.portrait ? L.H * 0.06 : 0}}>
        {lines.map((l, i) => {
          const on = flicker(f, ts[i], `l${i}`);
          const script = i === 0 && p.script !== false;
          const c = i % 2 ? c2 : c1;
          const longest = Math.max(4, l.length);
          const size = script ? Math.min(210 * L.u, ((L.W * 0.86) / longest) * 1.9) : Math.min(200 * L.u, ((L.W * 0.86) / longest) * 1.55);
          return (
            <div
              key={i}
              style={{
                fontFamily: script ? b.fHand : b.fH,
                fontSize: size,
                lineHeight: 1.08,
                whiteSpace: 'nowrap',
                textTransform: script ? 'none' : 'uppercase',
                color: on > 0.5 ? lift(c, 0.75) : alpha(c, 0.25),
                textShadow: on > 0.5 ? glow(c, L.u, on) : 'none',
                transform: `rotate(${script ? -4 : 0}deg)`,
                letterSpacing: script ? 0 : 4 * L.u,
              }}
            >
              {l}
            </div>
          );
        })}
        {sub && <div style={{marginTop: 30 * L.u, fontFamily: b.fB, fontWeight: 700, fontSize: 44 * L.u, color: '#FFFFFF', opacity: ease(f, ts[ts.length - 1] + 12, ts[ts.length - 1] + 20), textShadow: `0 0 ${18 * L.u}px ${c2}`}}>{sub}</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- B26 hologram HUD ---------------- */

const HUD_ITEMS = ['Hook sa unang 3 segundo', 'Malinaw na offer', 'Isang CTA lang'];
export const hudItems = (p: P): string[] => (Array.isArray(p.items) && p.items.length ? p.items : HUD_ITEMS).slice(0, 5).map(String);
export const hudTimes = (n: number, fps: number) => range(n).map((i) => Math.round(fps * 0.7) + i * 8);

/** B26: hologram HUD: spinning rings around a big value, then items type in with scanlines */
export const HoloHUD: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const c = neon2(p, b);
  const c1 = neon1(p, b);
  const items = hudItems(p);
  const ts = hudTimes(items.length, L.fps);
  const value = txt(p.value, '98%');
  const label = txt(p.label, 'AD SCORE');
  const title = txt(p.title, '');
  const R = Math.min(L.W, L.H) * (L.portrait ? 0.27 : 0.22);
  const cx = L.portrait ? L.W / 2 : L.W * 0.3;
  const cy = L.portrait ? L.H * 0.36 : L.H * 0.5;
  const inK = ease(f, 0, 14);
  const jitter = random(`hj${Math.floor(f / 3)}`) > 0.93 ? (random(`hx${f}`) - 0.5) * 10 * L.u : 0;
  const ring = (r: number, w: number, dash: string, speed: number, op: number, key: string) => (
    <circle key={key} cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={w} strokeDasharray={dash} opacity={op} transform={`rotate(${f * speed} ${cx} ${cy})`} style={{filter: `drop-shadow(0 0 ${8 * L.u}px ${c})`}} />
  );
  const listLeft = L.portrait ? L.pad : L.W * 0.52;
  const listTop = L.portrait ? cy + R + 70 * L.u : L.H * 0.3;
  return (
    <AbsoluteFill style={{transform: `translateX(${jitter}px)`}}>
      <NeonWall c1={c} c2={c1} u={L.u} bg={p.bg} level={0.8} />
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0, opacity: inK}}>
        {ring(R, 6 * L.u, `${R * 0.9} ${R * 0.25}`, 1.2, 0.9, 'a')}
        {ring(R * 0.84, 3 * L.u, `${4 * L.u} ${10 * L.u}`, -0.8, 0.7, 'b')}
        {ring(R * 1.12, 2 * L.u, `${R * 0.3} ${R * 0.6}`, -1.6, 0.6, 'c')}
        {range(36).map((i) => {
          const a = (i / 36) * Math.PI * 2;
          const r1 = R * 1.2;
          const r2 = R * (i % 3 ? 1.24 : 1.29);
          return <line key={i} x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1} x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2} stroke={c} strokeWidth={2 * L.u} opacity={0.6} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: cx - R, top: cy - R * 0.42, width: R * 2, textAlign: 'center', opacity: flicker(f, 6, 'hv')}}>
        <div style={{fontFamily: b.fH, fontSize: R * 0.62, lineHeight: 1, color: lift(c, 0.7), textShadow: glow(c, L.u, 0.8)}}>{value}</div>
        <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: R * 0.13, letterSpacing: 6 * L.u, color: lift(c, 0.5), marginTop: 8 * L.u}}>{label}</div>
      </div>
      {title && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.1 : L.H * 0.12, textAlign: L.portrait ? 'center' : 'left', fontFamily: b.fH, fontSize: Math.min(90 * L.u, fitSize(title, L.u, L.portrait, 110)), color: lift(c1, 0.7), textShadow: glow(c1, L.u, 0.7), textTransform: 'uppercase', opacity: flicker(f, 2, 'ht')}}>{title}</div>}
      <div style={{position: 'absolute', left: listLeft, right: L.pad, top: listTop, display: 'flex', flexDirection: 'column', gap: 18 * L.u}}>
        {items.map((it, i) => {
          const k = ease(f, ts[i], ts[i] + 6);
          const chars = Math.floor(lin(f, ts[i], ts[i] + 14, 0, it.length));
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20 * L.u, opacity: k, transform: `translateX(${(1 - k) * -30 * L.u}px)`, border: `${2 * L.u}px solid ${alpha(c, 0.6)}`, background: alpha(c, 0.08), borderRadius: 14 * L.u, padding: `${14 * L.u}px ${22 * L.u}px`, boxShadow: `0 0 ${18 * L.u}px ${alpha(c, 0.35)}, inset 0 0 ${18 * L.u}px ${alpha(c, 0.15)}`}}>
              <div style={{width: 18 * L.u, height: 18 * L.u, borderRadius: 4 * L.u, background: c, boxShadow: `0 0 ${12 * L.u}px ${c}`, flexShrink: 0}} />
              <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: 40 * L.u, color: lift(c, 0.85), whiteSpace: 'nowrap', overflow: 'hidden'}}>
                {it.slice(0, chars)}
                {chars < it.length && <span style={{opacity: f % 8 < 4 ? 1 : 0}}>▍</span>}
              </div>
            </div>
          );
        })}
      </div>
      <Scan c={c} f={f} u={L.u} opacity={0.7} />
    </AbsoluteFill>
  );
};

/* ---------------- B27 neon price ---------------- */

export const priceOn = (fps: number) => Math.round(fps * 0.35);

/** B27: neon frame flickers on with the label; the price buzzes in; old price gets a neon strike */
export const NeonPrice: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const c1 = neon1(p, b);
  const c2 = neon2(p, b);
  const label = txt(p.label, 'PROMO');
  const price = txt(p.price, '₱999');
  const old = txt(p.oldPrice, '');
  const note = txt(p.note, '');
  const on = priceOn(L.fps);
  const frameOn = flicker(f, 2, 'pf');
  const priceLit = flicker(f, on, 'pp');
  const ps = Math.min(260 * L.u, ((L.W * 0.7) / Math.max(3, price.length)) * 1.6);
  const bw = L.portrait ? L.W * 0.8 : L.W * 0.5;
  const bh = ps * (old ? 2.25 : 1.85) + 40 * L.u;
  const strike = ease(f, on + 14, on + 22);
  return (
    <AbsoluteFill>
      <NeonWall c1={c1} c2={c2} u={L.u} bg={p.bg} level={Math.max(frameOn, priceLit)} />
      <div style={{position: 'absolute', left: (L.W - bw) / 2, top: L.mid - bh / 2, width: bw, height: bh, boxSizing: 'border-box', borderRadius: 40 * L.u, border: `${7 * L.u}px solid ${frameOn > 0.5 ? lift(c2, 0.6) : alpha(c2, 0.2)}`, boxShadow: frameOn > 0.5 ? `0 0 ${20 * L.u}px ${c2}, 0 0 ${50 * L.u}px ${alpha(c2, 0.7)}, inset 0 0 ${30 * L.u}px ${alpha(c2, 0.5)}` : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'absolute', top: -46 * L.u, padding: `${6 * L.u}px ${30 * L.u}px`, background: '#08070B', fontFamily: b.fH, fontSize: 64 * L.u, letterSpacing: 8 * L.u, color: frameOn > 0.5 ? lift(c2, 0.7) : alpha(c2, 0.25), textShadow: frameOn > 0.5 ? glow(c2, L.u, 0.7) : 'none'}}>{label}</div>
        {old && (
          <div style={{position: 'relative', fontFamily: b.fB, fontWeight: 800, fontSize: ps * 0.34, color: alpha('#FFFFFF', 0.75), marginBottom: 6 * L.u, opacity: ease(f, on, on + 6)}}>
            {old}
            <div style={{position: 'absolute', left: '-8%', top: '50%', height: 7 * L.u, width: `${116 * strike}%`, background: lift(c1, 0.6), boxShadow: `0 0 ${12 * L.u}px ${c1}, 0 0 ${24 * L.u}px ${c1}`, transform: 'rotate(-8deg)', transformOrigin: 'left'}} />
          </div>
        )}
        <div style={{fontFamily: b.fH, fontSize: ps, lineHeight: 1, color: priceLit > 0.5 ? lift(c1, 0.75) : alpha(c1, 0.2), textShadow: priceLit > 0.5 ? glow(c1, L.u, 1.1) : 'none', whiteSpace: 'nowrap', transform: `scale(${0.92 + 0.08 * pop(f, L.fps, on, 300, 12)})`}}>{price}</div>
      </div>
      {note && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.mid + bh / 2 + 40 * L.u, textAlign: 'center', fontFamily: b.fB, fontWeight: 700, fontSize: 44 * L.u, color: '#FFFFFF', opacity: ease(f, on + 12, on + 20), textShadow: `0 0 ${16 * L.u}px ${c2}`}}>{note}</div>}
    </AbsoluteFill>
  );
};

/* ---------------- B28 hologram product ---------------- */

/** B28: product projected as a hologram: tinted, scanlined, flickering, on a glowing projector pad */
export const HoloProduct: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const c = neon2(p, b);
  const src: string = p.product ?? 'demo:🧴';
  const demo = parseDemo(src);
  const size = Math.min(L.W, L.H) * (L.portrait ? 0.58 : 0.48);
  const cy = L.H * 0.45;
  const grow = ease(f, 0, 16);
  const on = flicker(f, 4, 'hp');
  const jx = random(`pj${Math.floor(f / 2)}`) > 0.94 ? (random(`px${f}`) - 0.5) * 16 * L.u : 0;
  const bob = Math.sin(f / (L.fps * 0.6)) * 10 * L.u;
  const title = txt(p.title, '');
  const sub = txt(p.sub, '');
  const mask = demo ? 'radial-gradient(circle, black 40%, transparent 68%)' : `url(${asset(src)})`;
  const maskStyle: React.CSSProperties = {maskImage: mask, WebkitMaskImage: mask, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center'};
  const padY = cy + size * 0.5;
  return (
    <AbsoluteFill>
      <NeonWall c1={c} c2={neon1(p, b)} u={L.u} bg={p.bg} level={0.7} />
      {/* projector cone */}
      <div style={{position: 'absolute', left: L.W / 2 - size * 0.55, top: cy - size * 0.55, width: size * 1.1, height: padY - (cy - size * 0.55), background: `linear-gradient(0deg, ${alpha(c, 0.35)}, transparent 85%)`, clipPath: 'polygon(30% 100%, 70% 100%, 100% 0, 0 0)', opacity: grow * 0.8}} />
      <div style={{position: 'absolute', left: L.W / 2 - size * 0.42, top: padY - size * 0.05, width: size * 0.84, height: size * 0.16, borderRadius: '50%', border: `${4 * L.u}px solid ${c}`, background: alpha(c, 0.18), boxShadow: `0 0 ${40 * L.u}px ${c}, inset 0 0 ${30 * L.u}px ${alpha(c, 0.6)}`}} />
      <div style={{position: 'absolute', left: L.W / 2 - size / 2 + jx, top: cy - size / 2 + bob, width: size, height: size, transform: `scaleY(${grow})`, transformOrigin: 'bottom', opacity: on}}>
        {demo ? (
          <div style={{width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.78, lineHeight: 1, filter: `grayscale(1) brightness(1.4) drop-shadow(0 0 ${20 * L.u}px ${c})`, opacity: 0.85}}>{demo.emoji}</div>
        ) : (
          <Img src={asset(src)} style={{width: size, height: size, objectFit: 'contain', filter: `grayscale(1) brightness(1.3) drop-shadow(0 0 ${20 * L.u}px ${c})`, opacity: 0.85}} />
        )}
        <div style={{position: 'absolute', inset: 0, ...maskStyle, background: alpha(c, 0.55), mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, ...maskStyle, backgroundImage: `repeating-linear-gradient(0deg, ${alpha('#000000', 0.45)} 0 ${3 * L.u}px, transparent ${3 * L.u}px ${7 * L.u}px)`, backgroundPosition: `0 ${f * 2 * L.u}px`}} />
      </div>
      {(title || sub) && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.1 : L.H * 0.06, textAlign: 'center', opacity: flicker(f, 10, 'pt')}}>
          {title && <div style={{fontFamily: b.fH, fontSize: Math.min(100 * L.u, fitSize(title, L.u, L.portrait, 120)), lineHeight: 1.04, color: lift(c, 0.75), textShadow: glow(c, L.u, 0.7), textTransform: 'uppercase'}}>{title}</div>}
          {sub && <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: 42 * L.u, color: '#FFFFFF', marginTop: 12 * L.u}}>{sub}</div>}
        </div>
      )}
      <Scan c={c} f={f} u={L.u} opacity={0.5} />
    </AbsoluteFill>
  );
};

/* ---------------- B29 neon checklist ---------------- */

const LIST = ['Script', 'Edit + captions', 'Music + SFX', 'Ready to post'];
export const neonItems = (p: P): string[] => (Array.isArray(p.items) && p.items.length ? p.items : LIST).slice(0, 5).map(String);
export const listTimes = (n: number, fps: number, at?: number[]) => range(n).map((i) => (Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : Math.round(fps * 0.4) + i * 12));

/** B29: neon checklist: each line's tube buzzes on with a neon check */
export const NeonList: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const c1 = neon1(p, b);
  const c2 = neon2(p, b);
  const items = neonItems(p);
  const ts = listTimes(items.length, L.fps, p.at);
  const title = txt(p.title, 'Kasama na');
  const fs = Math.min(64 * L.u, (L.W * 0.62) / Math.max(8, ...items.map((s) => s.length)) * 1.9);
  return (
    <AbsoluteFill>
      <NeonWall c1={c1} c2={c2} u={L.u} bg={p.bg} />
      {title && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.top - 40 * L.u : L.H * 0.1, textAlign: 'center', fontFamily: b.fHand, fontSize: Math.min(140 * L.u, ((L.W * 0.85) / Math.max(4, title.length)) * 1.9), color: lift(c1, 0.75), textShadow: glow(c1, L.u, flicker(f, 2, 'lt')), opacity: flicker(f, 2, 'lt') > 0.5 ? 1 : 0.25, transform: 'rotate(-3deg)'}}>{title}</div>}
      <div style={{position: 'absolute', left: L.pad * 1.3, right: L.pad, top: L.portrait ? L.top + 170 * L.u : L.H * 0.34, display: 'flex', flexDirection: 'column', gap: 34 * L.u}}>
        {items.map((it, i) => {
          const on = flicker(f, ts[i], `li${i}`);
          const lit = on > 0.5;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 30 * L.u}}>
              <div style={{width: fs * 1.2, height: fs * 1.2, borderRadius: 14 * L.u, boxSizing: 'border-box', border: `${5 * L.u}px solid ${lit ? lift(c2, 0.5) : alpha(c2, 0.25)}`, boxShadow: lit ? `0 0 ${16 * L.u}px ${c2}, inset 0 0 ${12 * L.u}px ${alpha(c2, 0.6)}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                {lit && (
                  <svg width={fs * 0.8} height={fs * 0.8} viewBox="0 0 100 100">
                    <path d="M18 54 L42 76 L84 26" pathLength={1} fill="none" stroke={lift(c1, 0.7)} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - ease(f, ts[i] + 4, ts[i] + 12)} style={{filter: `drop-shadow(0 0 ${6 * L.u}px ${c1})`}} />
                  </svg>
                )}
              </div>
              <div style={{fontFamily: b.fH, fontSize: fs, letterSpacing: 2 * L.u, textTransform: 'uppercase', color: lit ? lift(c2, 0.8) : alpha(c2, 0.22), textShadow: lit ? glow(c2, L.u, 0.75) : 'none', whiteSpace: 'nowrap'}}>{it}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- K9 neon CTA ---------------- */

export const ctaOn = (fps: number) => Math.round(fps * 0.4);

/** K9: neon sign CTA in a glowing tube box, chasing neon arrows point at it */
export const NeonCTA: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const c1 = neon1(p, b);
  const c2 = neon2(p, b);
  const cta = txt(p.cta, b.cta);
  const title = txt(p.title, 'Ready ka na?');
  const handle = txt(p.handle, b.handle ?? '');
  const on = ctaOn(L.fps);
  const lit = flicker(f, on, 'cta');
  const tl = flicker(f, 2, 'ct');
  const fs = Math.min(120 * L.u, ((L.W * 0.7) / Math.max(5, cta.length)) * 1.6);
  const cy = L.portrait ? L.H * 0.5 : L.H * 0.52;
  return (
    <AbsoluteFill>
      <NeonWall c1={c1} c2={c2} u={L.u} bg={p.bg} level={Math.max(lit, tl)} />
      {title && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: cy - fs - 250 * L.u, textAlign: 'center', fontFamily: b.fHand, fontSize: Math.min(140 * L.u, ((L.W * 0.85) / Math.max(4, title.length)) * 1.9), color: tl > 0.5 ? lift(c2, 0.75) : alpha(c2, 0.25), textShadow: tl > 0.5 ? glow(c2, L.u) : 'none', transform: 'rotate(-4deg)'}}>{title}</div>}
      <div style={{position: 'absolute', left: 0, right: 0, top: cy - fs * 0.5 - 34 * L.u, display: 'flex', justifyContent: 'center'}}>
        <div style={{padding: `${26 * L.u}px ${54 * L.u}px`, borderRadius: 999, border: `${7 * L.u}px solid ${lit > 0.5 ? lift(c1, 0.55) : alpha(c1, 0.2)}`, boxShadow: lit > 0.5 ? `0 0 ${22 * L.u}px ${c1}, 0 0 ${60 * L.u}px ${alpha(c1, 0.7)}, inset 0 0 ${26 * L.u}px ${alpha(c1, 0.5)}` : 'none', fontFamily: b.fH, fontSize: fs, lineHeight: 1, letterSpacing: 4 * L.u, textTransform: 'uppercase', color: lit > 0.5 ? lift(c1, 0.8) : alpha(c1, 0.22), textShadow: lit > 0.5 ? glow(c1, L.u) : 'none', whiteSpace: 'nowrap', transform: `scale(${1 + 0.03 * Math.sin(f / 5) * (lit > 0.5 ? 1 : 0)})`}}>{cta}</div>
      </div>
      {p.arrow !== false && (
        <div style={{position: 'absolute', left: 0, right: 0, top: cy + fs * 0.5 + 70 * L.u, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 * L.u}}>
          {range(3).map((i) => {
            const k = (Math.floor((f - on) / 5) % 3) === i && f > on + 10;
            return (
              <svg key={i} width={90 * L.u} height={46 * L.u} viewBox="0 0 90 46">
                <path d="M10 8 L45 38 L80 8" fill="none" stroke={k ? lift(c2, 0.6) : alpha(c2, 0.25)} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" style={{filter: k ? `drop-shadow(0 0 ${8 * L.u}px ${c2})` : undefined}} />
              </svg>
            );
          })}
        </div>
      )}
      {handle && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: cy + fs * 0.5 + 260 * L.u, textAlign: 'center', fontFamily: b.fB, fontWeight: 700, fontSize: 40 * L.u, color: alpha('#FFFFFF', 0.85)}}>{handle}</div>}
    </AbsoluteFill>
  );
};
