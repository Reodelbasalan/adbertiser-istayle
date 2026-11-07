import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Media, Thing, asset} from '../lib/Media';
import {alpha, ease, lin, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Minimal luxury look: B15 minimal title · B45 minimal product · B46 minimal features · B47 editorial split · K16 minimal CTA.
// Ivory (or black with `dark: true`), thin serif + spaced small caps, hairlines, slow fades.
type P = Record<string, any>;

export const palette = (p: P) =>
  p.dark ? {bg: '#0E0D0B', ink: '#F3EEE6', soft: 'rgba(243,238,230,.6)', line: 'rgba(243,238,230,.35)'} : {bg: '#F5F1EA', ink: '#1C1A17', soft: 'rgba(28,26,23,.55)', line: 'rgba(28,26,23,.25)'};

const Caps: React.FC<{text: string; size: number; color: string; font: string; style?: React.CSSProperties}> = ({text, size, color, font, style}) => (
  <div style={{fontFamily: font, fontWeight: 600, fontSize: size, letterSpacing: size * 0.38, textTransform: 'uppercase', color, ...style}}>{text}</div>
);

const Fade: React.FC<{at: number; children: React.ReactNode; y?: number; style?: React.CSSProperties}> = ({at, children, y = 20, style}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const k = ease(f, at, at + 18);
  return <div style={{opacity: k, transform: `translateY(${(1 - k) * y * L.u}px)`, ...style}}>{children}</div>;
};

/* ---------------- B15 minimal title ---------------- */

/** B15: lots of space, a spaced small-caps label, a thin serif title and a hairline that draws */
export const MinimalTitle: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const c = palette(p);
  const label = txt(p.label, b.name);
  const lines = txt(p.title, 'Less noise.|More sales.').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const sub = txt(p.sub, '');
  const longest = Math.max(6, ...lines.map((l) => l.length));
  const size = Math.min(130 * L.u, ((L.W * 0.8) / longest) * 1.7);
  return (
    <AbsoluteFill style={{background: c.bg, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34 * L.u}}>
      {label && <Fade at={2}><Caps text={label} size={26 * L.u} color={c.soft} font={b.fB} /></Fade>}
      <div style={{width: L.W * 0.18 * ease(f, 6, 26), height: 1.5 * L.u, background: c.line}} />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {lines.map((l, i) => (
          <Fade key={i} at={10 + i * 8}>
            <div style={{fontFamily: b.fSerif, fontWeight: 700, fontStyle: i % 2 ? 'italic' : 'normal', fontSize: size, lineHeight: 1.12, color: c.ink, textAlign: 'center'}}>{l}</div>
          </Fade>
        ))}
      </div>
      {sub && <Fade at={10 + lines.length * 8 + 4}><div style={{fontFamily: b.fB, fontWeight: 400, fontSize: 38 * L.u, color: c.soft, letterSpacing: 1 * L.u, textAlign: 'center', padding: `0 ${L.pad}px`}}>{sub}</div></Fade>}
    </AbsoluteFill>
  );
};

/* ---------------- B45 minimal product ---------------- */

/** B45: product on an empty stage with a soft shadow, thin frame corners, name in serif, one line, small price */
export const MinimalProduct: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const c = palette(p);
  const name = txt(p.name, 'The Essential');
  const line = txt(p.line, 'Made to be used every day');
  const price = txt(p.price, '');
  const size = Math.min(L.W, L.H) * (L.portrait ? 0.56 : 0.46);
  const k = ease(f, 0, 22);
  const drift = lin(f, 0, dur, 0, -16 * L.u);
  const cy = L.H * 0.44;
  const corner = (x: number, y: number, rx: number, ry: number) => (
    <div style={{position: 'absolute', left: x, top: y, width: 60 * L.u, height: 60 * L.u, borderLeft: rx ? 'none' : `${1.5 * L.u}px solid ${c.line}`, borderRight: rx ? `${1.5 * L.u}px solid ${c.line}` : 'none', borderTop: ry ? 'none' : `${1.5 * L.u}px solid ${c.line}`, borderBottom: ry ? `${1.5 * L.u}px solid ${c.line}` : 'none', opacity: ease(f, 8, 20)}} />
  );
  const fx = (L.W - size * 1.3) / 2;
  const fy = cy - size * 0.65;
  return (
    <AbsoluteFill style={{background: c.bg}}>
      {corner(fx, fy, 0, 0)}
      {corner(fx + size * 1.3 - 60 * L.u, fy, 1, 0)}
      {corner(fx, fy + size * 1.3 - 60 * L.u, 0, 1)}
      {corner(fx + size * 1.3 - 60 * L.u, fy + size * 1.3 - 60 * L.u, 1, 1)}
      <div style={{position: 'absolute', left: L.W / 2 - size * 0.35, top: cy + size * 0.48, width: size * 0.7, height: size * 0.06, borderRadius: '50%', background: p.dark ? 'rgba(0,0,0,.6)' : 'rgba(0,0,0,.18)', filter: `blur(${14 * L.u}px)`, opacity: k}} />
      <div style={{position: 'absolute', left: (L.W - size) / 2, top: cy - size / 2 + drift, opacity: k, transform: `scale(${0.96 + 0.04 * k})`}}>
        <Thing src={p.product ?? 'demo:🧴'} size={size} />
      </div>
      <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.74 : L.H * 0.82, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 * L.u}}>
        <Fade at={14}><div style={{fontFamily: b.fSerif, fontWeight: 700, fontSize: 70 * L.u, color: c.ink}}>{name}</div></Fade>
        {line && <Fade at={20}><div style={{fontFamily: b.fB, fontSize: 34 * L.u, color: c.soft}}>{line}</div></Fade>}
        {price && <Fade at={26}><Caps text={price} size={30 * L.u} color={c.ink} font={b.fB} style={{marginTop: 6 * L.u}} /></Fade>}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- B46 minimal features ---------------- */

const FEATS = ['Malinis na script', 'Tamang ilaw', 'Isang malinaw na CTA'];
export const minimalItems = (p: P): string[] => (Array.isArray(p.items) && p.items.length ? p.items : FEATS).slice(0, 5).map(String);
export const minimalTimes = (n: number, dur: number, fps: number, at?: number[]) => {
  const gap = Math.max(10, (dur - fps * 0.8) / Math.max(1, n));
  return range(n).map((i) => (Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : Math.round(fps * 0.4 + i * gap)));
};

/** B46: 01 / 02 / 03 features with hairline dividers, each fading up in turn */
export const MinimalFeatures: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const c = palette(p);
  const items = minimalItems(p);
  const ts = minimalTimes(items.length, dur, L.fps, p.at);
  const title = txt(p.title, 'The details');
  return (
    <AbsoluteFill style={{background: c.bg}}>
      <div style={{position: 'absolute', left: L.pad * 1.3, right: L.pad * 1.3, top: L.portrait ? L.H * 0.22 : L.H * 0.16}}>
        <Fade at={0}><Caps text={title} size={28 * L.u} color={c.soft} font={b.fB} /></Fade>
        <div style={{marginTop: 40 * L.u, display: 'flex', flexDirection: 'column'}}>
          {items.map((it, i) => (
            <div key={i} style={{borderTop: `${1.5 * L.u}px solid ${c.line}`, padding: `${36 * L.u}px 0`, display: 'flex', alignItems: 'baseline', gap: 40 * L.u, opacity: ease(f, ts[i], ts[i] + 16), transform: `translateY(${(1 - ease(f, ts[i], ts[i] + 16)) * 16 * L.u}px)`}}>
              <div style={{fontFamily: b.fB, fontWeight: 600, fontSize: 28 * L.u, color: c.soft, letterSpacing: 4 * L.u}}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{fontFamily: b.fSerif, fontWeight: 700, fontSize: 60 * L.u, color: c.ink, lineHeight: 1.1}}>{it}</div>
            </div>
          ))}
          <div style={{borderTop: `${1.5 * L.u}px solid ${c.line}`, width: `${ease(f, ts[ts.length - 1], ts[ts.length - 1] + 16) * 100}%`}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- B47 editorial split ---------------- */

/** B47: magazine layout: a tall photo with a slow zoom and an editorial text block (kicker, title, line) */
export const Editorial: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const c = palette(p);
  const kicker = txt(p.kicker, 'Issue 01');
  const title = txt(p.title, 'Ang ad na tahimik pero mabenta');
  const text = txt(p.text, '');
  const vert = L.portrait;
  const pw = vert ? L.W - 2 * L.pad : L.W * 0.42;
  const ph = vert ? L.H * 0.44 : L.H - 2 * 80 * L.u;
  const k = ease(f, 0, 20);
  return (
    <AbsoluteFill style={{background: c.bg}}>
      <div style={{position: 'absolute', left: L.pad, top: vert ? L.H * 0.12 : 80 * L.u, width: pw, height: ph, overflow: 'hidden', opacity: k}}>
        <Media src={p.photo ?? 'demo:🌿:120'} zoom="in" />
      </div>
      <div style={{position: 'absolute', left: vert ? L.pad : L.pad * 2 + pw, right: L.pad, top: vert ? L.H * 0.12 + ph + 50 * L.u : L.H * 0.3}}>
        <Fade at={8}><Caps text={kicker} size={24 * L.u} color={c.soft} font={b.fB} /></Fade>
        <Fade at={14}><div style={{marginTop: 18 * L.u, fontFamily: b.fSerif, fontWeight: 700, fontSize: Math.min(76 * L.u, ((pw * 0.95) / Math.max(10, title.length)) * 2.6), lineHeight: 1.12, color: c.ink}}>{title}</div></Fade>
        {text && <Fade at={22}><div style={{marginTop: 18 * L.u, fontFamily: b.fB, fontSize: 34 * L.u, lineHeight: 1.45, color: c.soft}}>{text}</div></Fade>}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- K16 minimal CTA ---------------- */

/** K16: spaced wordmark (or logo), hairline, outlined button, handle */
export const MinimalCTA: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const c = palette(p);
  const logo: string | undefined = p.logo ?? b.logo;
  const name = txt(p.name, b.name);
  const cta = txt(p.cta, b.cta);
  const handle = txt(p.handle, b.handle ?? '');
  return (
    <AbsoluteFill style={{background: c.bg, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40 * L.u}}>
      <Fade at={2}>{logo ? <Img src={asset(logo)} style={{height: 130 * L.u, objectFit: 'contain'}} /> : <Caps text={name} size={Math.min(64 * L.u, ((L.W * 0.8) / Math.max(4, name.length)) * 0.9)} color={c.ink} font={b.fB} />}</Fade>
      <div style={{width: L.W * 0.2 * ease(f, 8, 24), height: 1.5 * L.u, background: c.line}} />
      {cta && (
        <Fade at={14}>
          <div style={{border: `${2 * L.u}px solid ${c.ink}`, padding: `${24 * L.u}px ${60 * L.u}px`, fontFamily: b.fB, fontWeight: 600, fontSize: 32 * L.u, letterSpacing: 10 * L.u, textTransform: 'uppercase', color: c.ink, background: alpha(c.ink === '#1C1A17' ? '#FFFFFF' : '#000000', 0.15 + 0.1 * Math.sin(f / 10))}}>{cta}</div>
        </Fade>
      )}
      {handle && <Fade at={20}><div style={{fontFamily: b.fB, fontSize: 30 * L.u, color: c.soft, letterSpacing: 2 * L.u}}>{handle}</div></Fade>}
    </AbsoluteFill>
  );
};
