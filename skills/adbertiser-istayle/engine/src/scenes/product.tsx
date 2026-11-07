import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Burst, Glow, Pill, Rays} from '../lib/Fx';
import {Media, Thing, asset, parseDemo} from '../lib/Media';
import {alpha, ease, fitSize, ink, lin, pop, shake, useLayout} from '../lib/util';
import type {SceneProps} from '../types';

/** F1 product hero (J3: drop:true for a product slam): float, glow, light sweep */
export const ProductHero: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const size = Math.min(L.W, L.H) * (L.portrait ? 0.62 : 0.52);
  const drop = !!p.drop;
  const land = Math.round(L.fps * 0.45);
  const d = drop ? pop(f, L.fps, 0, 170, 9) : 1;
  const sh = drop ? shake(f, land, 9, 16 * L.u) : {x: 0, y: 0};
  const float = Math.sin(f / (L.fps * 0.32)) * 14 * L.u;
  const sweep = lin(f, L.fps * 0.5, L.fps * 1.3, -1.2, 1.2);
  const demo = parseDemo(p.product) || !p.product;
  const mask = demo ? 'radial-gradient(circle, black 45%, transparent 70%)' : `url(${asset(p.product)})`;
  const cy = L.portrait ? L.H * 0.43 : L.H * 0.44;
  const ts = pop(f, L.fps, drop ? land + 4 : 10, 220, 13);
  return (
    <AbsoluteFill style={{background: b.bg, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Rays color={b.primary} opacity={0.08} />
      <Glow color={b.primary} y={`${(cy / L.H) * 100}%`} strength={0.42} />
      <div style={{position: 'absolute', left: (L.W - size * 0.7) / 2, top: cy + size * 0.48, width: size * 0.7, height: size * 0.09, borderRadius: '50%', background: 'rgba(0,0,0,.55)', filter: `blur(${16 * L.u}px)`, transform: `scale(${1 - float / (200 * L.u)})`}} />
      <div style={{position: 'absolute', left: (L.W - size) / 2, top: cy - size / 2, width: size, height: size, transform: `translateY(${(1 - d) * -L.H * 0.7 + float}px) rotate(${Math.sin(f / 23) * 2}deg)`}}>
        <Thing src={p.product ?? 'demo:🧴'} size={size} style={{filter: `drop-shadow(0 ${24 * L.u}px ${40 * L.u}px rgba(0,0,0,.45))`}} />
        <div style={{position: 'absolute', inset: 0, maskImage: mask, WebkitMaskImage: mask, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center', mixBlendMode: 'screen'}}>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,.75) 50%, transparent 65%)', transform: `translateX(${sweep * 100}%)`}} />
        </div>
      </div>
      {(p.title || p.sub) && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.bottom - 170 * L.u : L.H * 0.8, textAlign: 'center', transform: `translateY(${(1 - ts) * 60 * L.u}px)`, opacity: ts}}>
          {p.title && <div style={{fontFamily: b.fH, fontSize: fitSize(p.title, L.u, L.portrait, 120), color: b.text, textTransform: 'uppercase', lineHeight: 1}}>{p.title}</div>}
          {p.sub && <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: 42 * L.u, color: b.primary, marginTop: 10 * L.u}}>{p.sub}</div>}
        </div>
      )}
    </AbsoluteFill>
  );
};

/** F6 / J4 price slam: stamp hits with a starburst, old price struck out */
export const PriceSlam: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const at = Math.round((p.slamAt ?? 0.5) * L.fps);
  const s = pop(f, L.fps, at, 340, 13);
  const sh = shake(f, at + 2, 9, 18 * L.u);
  const price: string = p.price ?? '₱999';
  const ps = Math.min(250 * L.u, ((L.W - 2 * L.pad) / Math.max(3, price.length)) * 1.45);
  const prod = Math.min(L.W, L.H) * (L.portrait ? 0.46 : 0.4);
  const cy = L.portrait ? L.top + prod * 0.55 : L.H * 0.3;
  const strike = ease(f, at + 8, at + 16);
  return (
    <AbsoluteFill style={{background: b.bg, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Glow color={b.primary} strength={0.3} y="30%" />
      {p.badge !== false && (
        <div style={{position: 'absolute', top: L.portrait ? L.top - 120 * L.u : 50 * L.u, width: '100%', display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, L.fps, 2, 260, 12)})`}}>
          <Pill text={p.badge ?? 'PROMO'} bg={b.secondary} color={ink(b.secondary)} size={44 * L.u} font={b.fH} />
        </div>
      )}
      <div style={{position: 'absolute', left: (L.W - prod) / 2, top: cy - prod / 2, transform: `translateY(${Math.sin(f / 10) * 8 * L.u}px)`}}>
        <Thing src={p.product ?? 'demo:🍪'} size={prod} style={{filter: 'drop-shadow(0 20px 30px rgba(0,0,0,.45))'}} />
      </div>
      {p.name && (
        <div style={{position: 'absolute', top: cy + prod * 0.5, width: '100%', textAlign: 'center', fontFamily: b.fB, fontWeight: 800, fontSize: 52 * L.u, color: b.text, zIndex: 2, textShadow: '0 3px 12px rgba(0,0,0,.7)'}}>{p.name}</div>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: L.portrait ? L.mid + 170 * L.u : L.H * 0.66, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {p.oldPrice && (
          <div style={{position: 'relative', fontFamily: b.fB, fontWeight: 800, fontSize: 70 * L.u, color: alpha(b.text, 0.7), opacity: ease(f, at - 6, at)}}>
            {p.oldPrice}
            <div style={{position: 'absolute', left: '-6%', top: '52%', height: 8 * L.u, width: `${112 * strike}%`, background: '#E0242B', transform: 'rotate(-8deg)', transformOrigin: 'left'}} />
          </div>
        )}
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${3 - 2 * s}) rotate(${-14 + 8 * s}deg)`, opacity: f >= at ? Math.min(1, s * 2) : 0}}>
          <Burst r={Math.max(ps * 1.1, ps * price.length * 0.36)} color={b.primary} rot={f * 0.6} style={{position: 'absolute'}} />
          <span style={{position: 'relative', fontFamily: b.fH, fontSize: ps, color: ink(b.primary), lineHeight: 1}}>{price}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** G6 / J9 text behind subject: huge title rises behind a cut-out person/product */
export const TextBehind: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const title: string = (p.title ?? 'GLOW UP').toUpperCase();
  const size = Math.min(L.H * 0.3, ((L.W * 0.94) / Math.max(3, title.length)) * 1.75);
  const k = ease(f, 3, 3 + L.fps * 0.55);
  const subjH = L.portrait ? L.H * 0.62 : L.H * 0.86;
  return (
    <AbsoluteFill style={{background: b.bg}}>
      <Media src={p.bg ?? 'demo:🌇:20'} dim={0.25} />
      <div style={{position: 'absolute', left: 0, right: 0, top: L.portrait ? L.H * 0.28 : L.H * 0.12, height: size * 1.05, overflow: 'hidden', display: 'flex', justifyContent: 'center'}}>
        <span style={{fontFamily: b.fH, fontSize: size, lineHeight: 1, color: p.titleColor ?? b.primary, transform: `translateY(${(1 - k) * size}px)`, whiteSpace: 'nowrap', textShadow: '0 10px 40px rgba(0,0,0,.35)'}}>{title}</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: L.portrait ? L.H * 0.12 : 0, height: subjH, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', transform: `scale(${1 + 0.03 * ease(f, 0, L.fps * 3)})`, transformOrigin: 'bottom center'}}>
        <Thing src={p.subject ?? 'demo:🧍'} size={subjH} style={{filter: 'drop-shadow(0 20px 40px rgba(0,0,0,.5))'}} />
      </div>
      {p.sub && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.bottom - 60 * L.u : L.H * 0.86, textAlign: 'center', fontFamily: b.fB, fontWeight: 800, fontSize: 48 * L.u, color: '#fff', opacity: ease(f, L.fps * 0.6, L.fps * 0.9), textShadow: '0 4px 14px rgba(0,0,0,.7)'}}>{p.sub}</div>
      )}
    </AbsoluteFill>
  );
};

/** U1 footage or photo shot: Ken Burns or punch zoom, optional super */
export const FootageShot: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const tAt = Math.round((p.titleAt ?? 0.3) * L.fps);
  const s = pop(f, L.fps, tAt, 240, 12);
  return (
    <AbsoluteFill>
      <Media src={p.media ?? 'demo:🏪:150'} zoom={p.zoom ?? 'in'} punchAt={p.punchAt != null ? Math.round(p.punchAt * L.fps) : undefined} />
      {p.title && (
        <div style={{position: 'absolute', left: 0, right: 0, top: L.portrait ? L.top : L.H * 0.1, display: 'flex', justifyContent: 'center', transform: `scale(${s})`}}>
          <Pill text={p.title} bg={b.primary} color={ink(b.primary)} size={56 * L.u} font={b.fH} style={{borderRadius: 16 * L.u, textTransform: 'uppercase', maxWidth: L.W - 2 * L.pad, whiteSpace: 'normal', textAlign: 'center'}} />
        </div>
      )}
    </AbsoluteFill>
  );
};
