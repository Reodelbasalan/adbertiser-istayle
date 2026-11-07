import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Glow, Rays} from '../lib/Fx';
import {asset} from '../lib/Media';
import {alpha, ease, fitSize, ink, lin, pop, useLayout} from '../lib/util';
import type {SceneProps} from '../types';

const Button: React.FC<{text: string; f: number; at: number}> = ({text, f, at}) => {
  const L = useLayout();
  const b = useBrand();
  const s = pop(f, L.fps, at, 240, 11);
  const pulse = 1 + 0.045 * Math.max(0, Math.sin((f - at) / 6));
  const shine = lin((f - at) % (L.fps * 1.6), 6, 26, -1.3, 1.3);
  const fs = Math.min(64 * L.u, ((L.W - 2 * L.pad) / Math.max(8, text.length)) * 1.4);
  return (
    <div style={{position: 'relative', overflow: 'hidden', background: b.primary, color: ink(b.primary), fontFamily: b.fH, fontSize: fs, padding: `${fs * 0.45}px ${fs * 1.1}px`, borderRadius: fs, transform: `scale(${s * pulse})`, boxShadow: `0 0 ${50 * L.u}px ${alpha(b.primary, 0.55)}`, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
      {text}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,.65) 50%, transparent 65%)', transform: `translateX(${shine * 100}%)`}} />
    </div>
  );
};

/** K7 brand end card · K1 one-line CTA (variant:"line") · K4 offer card (variant:"offer") */
export const EndCard: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const variant: string = p.variant ?? 'card';
  const cta: string = p.cta ?? b.cta;
  if (variant === 'line') {
    const size = fitSize(cta, L.u, L.portrait, 150);
    const s = pop(f, L.fps, 0, 260, 12);
    return (
      <AbsoluteFill style={{background: b.bg, alignItems: 'center', justifyContent: 'center', gap: 30 * L.u}}>
        <Glow color={b.primary} strength={0.3} />
        <div style={{fontFamily: b.fH, fontSize: size, color: b.text, textTransform: 'uppercase', textAlign: 'center', padding: `0 ${L.pad}px`, transform: `scale(${1.3 - 0.3 * s})`, opacity: s}}>{cta}</div>
        <div style={{fontSize: 110 * L.u, color: b.primary, transform: `translateY(${Math.abs(Math.sin(f / 6)) * 24 * L.u}px)`}}>{p.arrow ?? '👇'}</div>
      </AbsoluteFill>
    );
  }
  if (variant === 'offer') {
    const items: string[] = p.items ?? ['5 video ads', 'Captions + music', 'Posting schedule'];
    return (
      <AbsoluteFill style={{background: b.bg, alignItems: 'center', justifyContent: 'center', gap: 26 * L.u, padding: L.pad}}>
        <Rays color={b.primary} opacity={0.06} />
        <div style={{fontFamily: b.fH, fontSize: fitSize(p.title ?? 'Package', L.u, L.portrait, 120), color: b.text, textTransform: 'uppercase', textAlign: 'center', opacity: ease(f, 0, 8)}}>{p.title ?? 'Starter Package'}</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16 * L.u, width: '100%'}}>
          {items.map((it, i) => {
            const s = pop(f, L.fps, 8 + i * 5, 240, 13);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20 * L.u, background: alpha(b.text, 0.06), borderRadius: 24 * L.u, padding: `${18 * L.u}px ${26 * L.u}px`, transform: `translateX(${(1 - s) * -80 * L.u}px)`, opacity: s}}>
                <div style={{width: 54 * L.u, height: 54 * L.u, borderRadius: '50%', background: b.primary, color: ink(b.primary), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: b.fB, fontWeight: 900, fontSize: 32 * L.u}}>✓</div>
                <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: 44 * L.u, color: b.text}}>{it}</div>
              </div>
            );
          })}
        </div>
        {p.price && (
          <div style={{fontFamily: b.fH, fontSize: 150 * L.u, color: b.primary, lineHeight: 1, transform: `scale(${pop(f, L.fps, 10 + items.length * 5, 300, 11)})`}}>{p.price}</div>
        )}
        {p.note && <div style={{fontFamily: b.fB, fontWeight: 600, fontSize: 34 * L.u, color: alpha(b.text, 0.8)}}>{p.note}</div>}
        <Button text={cta} f={f} at={16 + items.length * 5} />
      </AbsoluteFill>
    );
  }
  const logo: string | undefined = p.logo ?? b.logo;
  const ls = pop(f, L.fps, 0, 200, 12);
  return (
    <AbsoluteFill style={{background: b.bg, alignItems: 'center', justifyContent: 'center', gap: 36 * L.u, padding: L.pad}}>
      <Rays color={b.primary} opacity={0.09} />
      <Glow color={b.primary} strength={0.3} y="40%" />
      <div style={{transform: `scale(${ls}) rotate(${(1 - ls) * -10}deg)`}}>
        {logo ? (
          <Img src={asset(logo)} style={{maxWidth: L.W * 0.55, maxHeight: L.H * 0.18, objectFit: 'contain'}} />
        ) : (
          <div style={{fontFamily: b.fH, fontSize: fitSize(b.name, L.u, L.portrait, 150), color: b.primary, textTransform: 'uppercase'}}>{b.name}</div>
        )}
      </div>
      {p.headline && <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: fitSize(p.headline, L.u, L.portrait, 90), color: b.text, textAlign: 'center', opacity: ease(f, 8, 16)}}>{p.headline}</div>}
      <Button text={cta} f={f} at={14} />
      {(p.handle ?? b.handle) && <div style={{fontFamily: b.fB, fontWeight: 600, fontSize: 36 * L.u, color: alpha(b.text, 0.75), opacity: ease(f, 20, 28)}}>{p.handle ?? b.handle}</div>}
    </AbsoluteFill>
  );
};
