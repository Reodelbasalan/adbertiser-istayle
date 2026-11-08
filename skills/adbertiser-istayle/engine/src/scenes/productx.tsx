import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Burst, Glow, Pill} from '../lib/Fx';
import {Thing} from '../lib/Media';
import {alpha, ease, fitSize, ink, lin, pop, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Product pack: F3 exploded view · F7 bundle builder · F8 catalog flip · F9 variant grid · F10 spec callouts · F12 size comparison.
type P = Record<string, any>;
type Item = {image?: string; icon?: string; label?: string; name?: string; price?: string};
const pic = (it: Item) => it.image ?? (it.icon ? `demo:${it.icon}:40` : undefined);

const Title: React.FC<{text: string; top?: number}> = ({text, top}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const k = pop(f, L.fps, 0, 220, 13);
  if (!text) return null;
  return <div style={{position: 'absolute', left: L.pad, right: L.pad, top: top ?? (L.portrait ? L.H * 0.12 : L.H * 0.06), textAlign: 'center', fontFamily: b.fH, fontSize: Math.min(110 * L.u, fitSize(text, L.u, L.portrait, 130)), lineHeight: 1.02, color: b.text, textTransform: 'uppercase', transform: `scale(${k})`}}>{text}</div>;
};

/** small item visual: image (contain) or a bare emoji */
const ItemPic: React.FC<{it: Item; size: number}> = ({it, size}) =>
  it.image ? <Thing src={it.image} size={size} /> : <div style={{width: size, height: size, fontSize: size * 0.8, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{it.icon ?? '✨'}</div>;

/* ---------------- F3 exploded view ---------------- */

const PARTS: Item[] = [
  {icon: '🍃', label: 'Aloe'},
  {icon: '🍋', label: 'Vitamin C'},
  {icon: '💧', label: 'Hyaluronic'},
  {icon: '🌼', label: 'Chamomile'},
];
export const partList = (p: P): Item[] => (Array.isArray(p.parts) && p.parts.length ? p.parts : PARTS).slice(0, 6);

/** F3: parts / ingredients burst out from behind the product to an orbit, each with a leader line and label */
export const Exploded: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const parts = partList(p);
  const size = Math.min(L.W, L.H) * (L.portrait ? 0.42 : 0.36);
  const cx = L.W / 2;
  const cy = L.portrait ? L.H * 0.5 : L.H * 0.52;
  const R = Math.min(L.W, L.H) * (L.portrait ? 0.38 : 0.34);
  const isz = 150 * L.u;
  return (
    <AbsoluteFill style={{background: b.bg}}>
      <Glow color={b.primary} strength={0.3} y={`${(cy / L.H) * 100}%`} />
      <Title text={txt(p.title, 'Ano ang laman?')} />
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
        {parts.map((_, i) => {
          const a = -Math.PI / 2 + (i / parts.length) * Math.PI * 2;
          const k = ease(f, 10 + i * 4, 22 + i * 4);
          return <line key={i} x1={cx + Math.cos(a) * size * 0.35} y1={cy + Math.sin(a) * size * 0.35} x2={cx + Math.cos(a) * R * k} y2={cy + Math.sin(a) * R * k * 0.92} stroke={alpha(b.primary, 0.7)} strokeWidth={3 * L.u} strokeDasharray={`${8 * L.u} ${6 * L.u}`} />;
        })}
      </svg>
      {parts.map((it, i) => {
        const a = -Math.PI / 2 + (i / parts.length) * Math.PI * 2;
        const k = pop(f, L.fps, 10 + i * 4, 200, 13);
        const x = cx + Math.cos(a) * R * k;
        const y = cy + Math.sin(a) * R * k * 0.92;
        return (
          <div key={i} style={{position: 'absolute', left: x - isz / 2, top: y - isz / 2, width: isz, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(1, k * 2), transform: `rotate(${Math.sin(f / 15 + i) * 5}deg)`}}>
            <div style={{width: isz, height: isz, borderRadius: '50%', background: alpha('#FFFFFF', 0.12), border: `${3 * L.u}px solid ${alpha(b.primary, 0.8)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
              <ItemPic it={it} size={isz * 0.75} />
            </div>
            {it.label && <div style={{marginTop: 10 * L.u, fontFamily: b.fB, fontWeight: 800, fontSize: 32 * L.u, color: b.text, whiteSpace: 'nowrap', textShadow: '0 2px 8px rgba(0,0,0,.6)'}}>{it.label}</div>}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: cx - size / 2, top: cy - size / 2, transform: `scale(${0.9 + 0.1 * ease(f, 0, 12)}) translateY(${Math.sin(f / 18) * 8 * L.u}px)`}}>
        <Thing src={p.product ?? 'demo:🧴'} size={size} style={{filter: 'drop-shadow(0 20px 30px rgba(0,0,0,.5))'}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- F7 bundle builder ---------------- */

const BUNDLE: Item[] = [{icon: '🧴'}, {icon: '🧼'}, {icon: '🪥'}];
export const bundleItems = (p: P): Item[] => (Array.isArray(p.items) && p.items.length ? p.items : BUNDLE).slice(0, 5);
export const bundleTimes = (n: number, fps: number) => ({drops: range(n).map((i) => Math.round(fps * 0.3) + i * 9), lid: Math.round(fps * 0.3) + n * 9 + 4});

/** F7: items drop one by one into an open box; the lid closes and a bundle price tag pops */
export const Bundle: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const items = bundleItems(p);
  const {drops, lid} = bundleTimes(items.length, L.fps);
  const bw = Math.min(L.W * 0.7, 720 * L.u);
  const bh = bw * 0.55;
  const bx = (L.W - bw) / 2;
  const by = L.portrait ? L.H * 0.5 : L.H * 0.48;
  const isz = Math.min(220 * L.u, (bw * 0.9) / items.length);
  const lk = ease(f, lid, lid + 8);
  const tk = pop(f, L.fps, lid + 8, 300, 11);
  const price = txt(p.price, '₱999');
  const label = txt(p.label, 'Bundle');
  return (
    <AbsoluteFill style={{background: b.bg}}>
      <Glow color={b.primary} strength={0.25} y="55%" />
      <Title text={txt(p.title, 'Sulit bundle')} />
      {items.map((it, i) => {
        const t = drops[i];
        const k = ease(f, t, t + 8);
        const x = bx + bw * ((i + 0.5) / items.length) - isz / 2;
        const y = lin(k, 0, 1, -isz * 1.5, by - isz * 0.55);
        if (f < t) return null;
        return <div key={i} style={{position: 'absolute', left: x, top: y, transform: `rotate(${(1 - k) * (i % 2 ? 20 : -20)}deg)`}}><ItemPic it={it} size={isz} /></div>;
      })}
      {/* box front */}
      <div style={{position: 'absolute', left: bx, top: by, width: bw, height: bh, background: `linear-gradient(180deg, #C9925B, #A8743F)`, borderRadius: 10 * L.u, boxShadow: '0 20px 40px rgba(0,0,0,.45)'}}>
        <div style={{position: 'absolute', left: '42%', right: '42%', top: 0, bottom: 0, background: 'rgba(255,255,255,.18)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: bh * 0.38, textAlign: 'center', fontFamily: b.fH, fontSize: bh * 0.22, color: alpha('#3B2412', 0.75), textTransform: 'uppercase'}}>{label}</div>
      </div>
      {/* lid */}
      <div style={{position: 'absolute', left: bx - 10 * L.u, top: by - 30 * L.u, width: bw + 20 * L.u, height: 40 * L.u, background: '#B88350', borderRadius: 8 * L.u, transformOrigin: 'left bottom', transform: `rotate(${(1 - lk) * -110}deg)`, boxShadow: '0 6px 12px rgba(0,0,0,.3)'}} />
      {f >= lid + 8 && (
        <div style={{position: 'absolute', left: bx + bw - 140 * L.u, top: by - 170 * L.u, transform: `scale(${tk}) rotate(12deg)`}}>
          <Burst r={140 * L.u} color={b.primary} style={{position: 'absolute', left: 0, top: 0}} />
          <div style={{position: 'absolute', left: 0, top: 0, width: 280 * L.u, height: 280 * L.u, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: b.fH, fontSize: Math.min(90 * L.u, (240 * L.u) / Math.max(3, price.length) * 1.5), color: ink(b.primary)}}>{price}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- F8 catalog flip ---------------- */

const CATALOG: Item[] = [
  {icon: '👟', name: 'Classic White', price: '₱1,299'},
  {icon: '🥾', name: 'Trail Brown', price: '₱1,499'},
  {icon: '👠', name: 'Night Red', price: '₱1,399'},
];
export const catalogItems = (p: P): Item[] => (Array.isArray(p.items) && p.items.length ? p.items : CATALOG).slice(0, 6);
export const flipTimes = (n: number, dur: number) => range(n).map((i) => Math.round((i * dur * 0.85) / Math.max(1, n)));

/** F8: variant cards flip past like catalog pages; each shows the item, name and price */
export const CatalogFlip: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const items = catalogItems(p);
  const ts = flipTimes(items.length, dur);
  const cw = L.portrait ? L.W * 0.74 : L.W * 0.38;
  const ch = cw * 1.25;
  const x = (L.W - cw) / 2;
  const y = L.portrait ? L.H * 0.22 : L.H * 0.1;
  return (
    <AbsoluteFill style={{background: b.bg}}>
      <Glow color={b.secondary} strength={0.3} y="45%" />
      <div style={{position: 'absolute', left: x, top: y, width: cw, height: ch, perspective: 2200 * L.u}}>
        {items.map((it, i) => {
          const start = ts[i];
          const end = ts[i + 1];
          const inK = ease(f, start, start + 8);
          const outK = end != null ? ease(f, end, end + 8) : 0;
          if (f < start) return null;
          return (
            <div key={i} style={{position: 'absolute', inset: 0, borderRadius: 30 * L.u, background: '#FFFFFF', boxShadow: '0 30px 60px rgba(0,0,0,.4)', transformOrigin: 'left center', transform: `rotateY(${(1 - inK) * 80 - outK * 100}deg)`, opacity: outK > 0.95 ? 0 : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 40 * L.u, boxSizing: 'border-box', zIndex: i}}>
              <div style={{alignSelf: 'flex-start', fontFamily: b.fB, fontWeight: 700, fontSize: 28 * L.u, color: '#888'}}>{String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</div>
              <ItemPic it={it} size={cw * 0.62} />
              <div style={{textAlign: 'center'}}>
                {it.name && <div style={{fontFamily: b.fH, fontSize: 64 * L.u, color: '#111', textTransform: 'uppercase'}}>{it.name}</div>}
                {it.price && <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: 48 * L.u, color: ink(b.primary) === '#111111' ? '#111' : b.primary}}>{it.price}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- F9 variant grid ---------------- */

const VARIANTS: Item[] = [{icon: '🍓', name: 'Strawberry'}, {icon: '🍫', name: 'Choco'}, {icon: '🍌', name: 'Banana'}, {icon: '🥭', name: 'Mango'}];
export const variantItems = (p: P): Item[] => (Array.isArray(p.items) && p.items.length ? p.items : VARIANTS).slice(0, 6);

/** F9: all variants in one grid, popping in one by one; one gets a BEST SELLER tag */
export const VariantGrid: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const items = variantItems(p);
  const cols = items.length <= 4 ? 2 : 3;
  const rows = Math.ceil(items.length / cols);
  const gw = L.portrait ? L.W - 1.4 * L.pad : L.W * 0.7;
  const gap = 24 * L.u;
  const cw = (gw - gap * (cols - 1)) / cols;
  const ch = Math.min(cw * 1.1, (L.H * 0.56 - gap * (rows - 1)) / rows);
  const x0 = (L.W - gw) / 2;
  const y0 = L.portrait ? L.H * 0.24 : L.H * 0.2;
  const hl = typeof p.highlight === 'number' ? p.highlight : 0;
  const tag = txt(p.tag, 'BEST SELLER');
  return (
    <AbsoluteFill style={{background: b.bg}}>
      <Title text={txt(p.title, 'Pili ka ng flavor')} />
      {items.map((it, i) => {
        const k = pop(f, L.fps, 6 + i * 5, 240, 13);
        const x = x0 + (i % cols) * (cw + gap);
        const y = y0 + Math.floor(i / cols) * (ch + gap);
        const hi = i === hl;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: cw, height: ch, borderRadius: 26 * L.u, background: hi ? alpha(b.primary, 0.18) : alpha('#FFFFFF', 0.08), border: `${hi ? 5 : 2}px solid ${hi ? b.primary : alpha('#FFFFFF', 0.2)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 * L.u, transform: `scale(${k})`, boxSizing: 'border-box'}}>
            <ItemPic it={it} size={Math.min(cw, ch) * 0.55} />
            {it.name && <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: Math.min(44 * L.u, cw * 0.12), color: b.text}}>{it.name}</div>}
            {it.price && <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: Math.min(36 * L.u, cw * 0.1), color: b.primary}}>{it.price}</div>}
            {hi && tag && <div style={{position: 'absolute', top: -22 * L.u, right: 16 * L.u, transform: `scale(${pop(f, L.fps, 6 + items.length * 5 + 4, 300, 12)})`}}><Pill text={tag} bg={b.primary} color={ink(b.primary)} size={26 * L.u} font={b.fB} /></div>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- F10 spec callouts ---------------- */

const SPECS = [
  {x: 0.3, y: 0.25, label: 'Pump cap'},
  {x: 0.65, y: 0.5, label: '250 ml'},
  {x: 0.35, y: 0.75, label: 'Recyclable bottle'},
];
export const specList = (p: P): {x: number; y: number; label: string}[] => (Array.isArray(p.specs) && p.specs.length ? p.specs : SPECS).slice(0, 5);
export const specTimes = (n: number, fps: number, at?: number[]) => range(n).map((i) => (Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : Math.round(fps * 0.3) + i * 7));

/** F10: lines draw from points on the product to feature labels on alternating sides */
export const SpecCallouts: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const specs = specList(p);
  const ts = specTimes(specs.length, L.fps, p.at);
  const size = Math.min(L.W, L.H) * (L.portrait ? 0.56 : 0.48);
  const px = (L.W - size) / 2;
  const py = L.portrait ? L.H * 0.28 : L.H * 0.2;
  return (
    <AbsoluteFill style={{background: b.bg}}>
      <Glow color={b.primary} strength={0.22} y="48%" />
      <Title text={txt(p.title, '')} />
      <div style={{position: 'absolute', left: px, top: py}}>
        <Thing src={p.product ?? 'demo:🧴'} size={size} style={{filter: 'drop-shadow(0 20px 30px rgba(0,0,0,.45))'}} />
      </div>
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
        {specs.map((s, i) => {
          const sx = px + s.x * size;
          const sy = py + s.y * size;
          const right = s.x >= 0.5;
          const ex = right ? L.W - L.pad * 0.6 : L.pad * 0.6;
          const k = ease(f, ts[i], ts[i] + 10);
          const midx = sx + (right ? 1 : -1) * 60 * L.u;
          return (
            <g key={i} opacity={f >= ts[i] ? 1 : 0}>
              <circle cx={sx} cy={sy} r={12 * L.u} fill={b.primary} />
              <path d={`M${sx} ${sy} L${midx} ${sy - 60 * L.u} L${ex} ${sy - 60 * L.u}`} pathLength={1} fill="none" stroke={b.primary} strokeWidth={4 * L.u} strokeDasharray="1 1" strokeDashoffset={1 - k} />
            </g>
          );
        })}
      </svg>
      {specs.map((s, i) => {
        const right = s.x >= 0.5;
        const sy = py + s.y * size;
        return (
          <div key={i} style={{position: 'absolute', [right ? 'right' : 'left']: L.pad * 0.6, top: sy - 60 * L.u - 64 * L.u, fontFamily: b.fB, fontWeight: 800, fontSize: 40 * L.u, color: b.text, opacity: ease(f, ts[i] + 8, ts[i] + 14), textShadow: '0 2px 8px rgba(0,0,0,.6)', whiteSpace: 'nowrap'}}>{s.label}</div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- F12 size comparison ---------------- */

const REFS: Record<string, {icon: string; ratio: number}> = {hand: {icon: '✋', ratio: 1}, coin: {icon: '🪙', ratio: 0.25}, phone: {icon: '📱', ratio: 0.85}, card: {icon: '💳', ratio: 0.5}};

/** F12: product next to a familiar object (hand, coin, phone, card) with dimension lines and a size label */
export const SizeCompare: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const ref = REFS[p.ref ?? 'hand'] ?? REFS.hand;
  const label = txt(p.size, '12 cm');
  const ratio = Number(p.ratio ?? 0.8); // product height vs the reference object
  const base = Math.min(L.W, L.H) * (L.portrait ? 0.42 : 0.36);
  const refH = base * ref.ratio;
  const prodH = base * ratio;
  const floor = L.portrait ? L.H * 0.66 : L.H * 0.72;
  const k = ease(f, 14, 26);
  const px = L.W * 0.3 - prodH / 2;
  const rx = L.W * 0.68 - refH / 2;
  return (
    <AbsoluteFill style={{background: b.bg}}>
      <Glow color={b.primary} strength={0.2} y="55%" />
      <Title text={txt(p.title, 'Ganito kalaki')} />
      <div style={{position: 'absolute', left: 0, right: 0, top: floor, height: 4 * L.u, background: alpha(b.text, 0.2)}} />
      <div style={{position: 'absolute', left: px, top: floor - prodH, transform: `scale(${pop(f, L.fps, 2, 220, 13)})`, transformOrigin: 'bottom center'}}>
        <Thing src={p.product ?? 'demo:🧴'} size={prodH} />
      </div>
      <div style={{position: 'absolute', left: rx, top: floor - refH, width: refH, height: refH, fontSize: refH * 0.9, lineHeight: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', transform: `scale(${pop(f, L.fps, 8, 220, 13)})`, transformOrigin: 'bottom center'}}>{ref.icon}</div>
      {/* dimension line next to the product */}
      <div style={{position: 'absolute', left: px - 50 * L.u, top: floor - prodH * k, width: 4 * L.u, height: prodH * k, background: b.primary}} />
      {[0, 1].map((e) => <div key={e} style={{position: 'absolute', left: px - 64 * L.u, top: e ? floor - 2 * L.u : floor - prodH * k, width: 32 * L.u, height: 4 * L.u, background: b.primary, opacity: k}} />)}
      <div style={{position: 'absolute', left: px - 80 * L.u, top: floor - prodH - 110 * L.u, opacity: ease(f, 24, 30)}}>
        <Pill text={label} bg={b.primary} color={ink(b.primary)} size={40 * L.u} font={b.fH} />
      </div>
    </AbsoluteFill>
  );
};
