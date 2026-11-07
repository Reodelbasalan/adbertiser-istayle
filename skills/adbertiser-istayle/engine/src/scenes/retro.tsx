import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Media} from '../lib/Media';
import {alpha, ease, pop, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Retro VHS / Y2K look: B13 VHS title · B42 VHS footage · B43 Y2K chrome text · B44 CRT TV · K15 VHS CTA.
type P = Record<string, any>;
const MONO = "'Courier New', 'Special Elite', monospace";

/** RGB-split text shadow (chromatic aberration) */
export const rgbSplit = (u: number, k = 1) => `${-4 * u * k}px 0 0 rgba(255,0,60,.75), ${4 * u * k}px 0 0 rgba(0,220,255,.75)`;

/** scanlines, rolling tracking band, noise flecks, slight jitter: the VHS layer */
export const VHS: React.FC<{f: number; u: number; strength?: number}> = ({f, u, strength = 1}) => {
  const roll = ((f * 7) % 140) - 20;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,${0.18 * strength}) 0 ${2 * u}px, transparent ${2 * u}px ${4 * u}px)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: `${roll}%`, height: '6%', background: `linear-gradient(180deg, transparent, rgba(255,255,255,${0.12 * strength}), transparent)`, filter: `blur(${2 * u}px)`}} />
      {range(10).map((i) => (random(`vn${i}${f}`) > 0.6 ? <div key={i} style={{position: 'absolute', left: `${random(`vx${i}${f}`) * 100}%`, top: `${random(`vy${i}${f}`) * 100}%`, width: (20 + random(`vw${i}${f}`) * 120) * u, height: 2 * u, background: 'rgba(255,255,255,.55)', opacity: strength}} /> : null))}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.6) 100%)'}} />
    </AbsoluteFill>
  );
};

/** camcorder on-screen display: PLAY/REC, counter, date */
export const OSD: React.FC<{f: number; fps: number; u: number; mode?: string; date?: string}> = ({f, fps, u, mode = 'PLAY ▶', date = 'NOV 07 2026'}) => {
  const s = Math.floor(f / fps);
  const t = `00:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const st: React.CSSProperties = {position: 'absolute', fontFamily: MONO, fontWeight: 700, fontSize: 44 * u, color: '#FFFFFF', textShadow: `${rgbSplit(u, 0.5)}, 0 0 ${8 * u}px rgba(255,255,255,.5)`, letterSpacing: 2 * u};
  return (
    <>
      <div style={{...st, left: 60 * u, top: 120 * u}}>{mode.startsWith('REC') ? <span style={{color: '#FF3B3B', opacity: f % 30 < 18 ? 1 : 0}}>● </span> : null}{mode}</div>
      <div style={{...st, right: 60 * u, bottom: 330 * u, textAlign: 'right', fontSize: 38 * u}}>
        {t}
        <br />
        {date}
      </div>
    </>
  );
};

const jitterX = (f: number, u: number) => (random(`jx${Math.floor(f / 2)}`) > 0.9 ? (random(`jv${f}`) - 0.5) * 18 * u : 0);

/* ---------------- B13 VHS title ---------------- */

/** B13: VHS screen: blue "PLAY" bg, tracking lines, RGB-split chunky title that jitters */
export const VhsTitle: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const lines = txt(p.text, 'Throwback|Pero Bago').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const sub = txt(p.sub, '');
  const longest = Math.max(4, ...lines.map((l) => l.length));
  const size = Math.min(220 * L.u, ((L.W * 0.86) / longest) * 1.55);
  const k = ease(f, 4, 12);
  const split = 1 + (random(`sp${Math.floor(f / 3)}`) > 0.8 ? 2 : 0);
  return (
    <AbsoluteFill style={{background: p.bg ? '#000' : `linear-gradient(180deg, #1636B8, #0A1E7A)`, overflow: 'hidden'}}>
      {p.bg && <div style={{position: 'absolute', inset: 0, filter: 'saturate(1.4) contrast(1.1)'}}><Media src={p.bg} zoom="in" dim={0.4} /></div>}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: `translateX(${jitterX(f, L.u)}px)`}}>
        {lines.map((l, i) => (
          <div key={i} style={{fontFamily: b.fH, fontSize: size, lineHeight: 1, color: i % 2 ? (p.color ?? b.primary) : '#FFFFFF', textTransform: 'uppercase', textShadow: rgbSplit(L.u, split), opacity: k, transform: `scaleY(${0.3 + 0.7 * k})`}}>{l}</div>
        ))}
        {sub && <div style={{marginTop: 24 * L.u, fontFamily: MONO, fontWeight: 700, fontSize: 44 * L.u, color: '#FFFFFF', textShadow: rgbSplit(L.u, 0.5), opacity: ease(f, 14, 20)}}>{sub}</div>}
      </AbsoluteFill>
      <OSD f={f} fps={L.fps} u={L.u} mode={p.mode ?? 'PLAY ▶'} date={p.date} />
      <VHS f={f} u={L.u} />
    </AbsoluteFill>
  );
};

/* ---------------- B42 VHS footage ---------------- */

/** B42: your clip as a camcorder tape: chroma shift, scanlines, REC/PLAY display, optional title */
export const VhsFootage: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const title = txt(p.title, '');
  const src = p.media ?? 'demo:📼:300';
  const jx = jitterX(f, L.u);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${jx}px)`, filter: 'saturate(1.45) contrast(1.15) brightness(1.05)'}}>
        <Media src={src} zoom="in" />
      </div>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${6 * L.u + jx}px)`, mixBlendMode: 'screen', opacity: 0.35, filter: 'sepia(1) saturate(6) hue-rotate(-50deg)'}}>
        <Media src={src} zoom="in" />
      </div>
      {title && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.62 : L.H * 0.74, textAlign: 'center', fontFamily: b.fH, fontSize: 96 * L.u, color: '#FFFFFF', textTransform: 'uppercase', textShadow: rgbSplit(L.u), opacity: ease(f, 6, 12)}}>{title}</div>}
      <OSD f={f} fps={L.fps} u={L.u} mode={p.mode ?? 'REC'} date={p.date} />
      <VHS f={f} u={L.u} />
    </AbsoluteFill>
  );
};

/* ---------------- B43 Y2K chrome text ---------------- */

/** B43: Y2K chrome lettering on a pastel gradient with twinkling stars and bubble shapes */
export const Y2KChrome: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const lines = txt(p.text, 'Bagong|Drop').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const sub = txt(p.sub, '');
  const longest = Math.max(4, ...lines.map((l) => l.length));
  const size = Math.min(240 * L.u, ((L.W * 0.86) / longest) * 1.6);
  const k = pop(f, L.fps, 2, 200, 11);
  const shine = ((f * 3) % 200) - 50;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(160deg, #FFB3E6 0%, #B5C7FF 45%, #A6F4E8 100%)', overflow: 'hidden'}}>
      {range(5).map((i) => (
        <div key={i} style={{position: 'absolute', left: `${random(`bx${i}`) * 90}%`, top: `${random(`by${i}`) * 90}%`, width: (120 + random(`bs${i}`) * 220) * L.u, height: (120 + random(`bs${i}`) * 220) * L.u, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), rgba(255,255,255,.15) 45%, rgba(255,255,255,0) 70%)', border: `${2 * L.u}px solid rgba(255,255,255,.6)`, transform: `translateY(${Math.sin(f / 20 + i) * 20 * L.u}px)`}} />
      ))}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontFamily: b.fH,
              fontSize: size,
              lineHeight: 1,
              textTransform: 'uppercase',
              backgroundImage: `linear-gradient(180deg, #FFFFFF 0%, #C9D3E0 38%, #5E6A7D 50%, #F2F6FA 62%, #9AA6B8 100%), linear-gradient(100deg, transparent ${shine}%, rgba(255,255,255,.9) ${shine + 6}%, transparent ${shine + 12}%)`,
              backgroundBlendMode: 'screen',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextStroke: `${size * 0.02}px #44506A`,
              filter: `drop-shadow(0 ${8 * L.u}px 0 ${alpha('#7B4DFF', 0.6)}) drop-shadow(0 ${16 * L.u}px ${20 * L.u}px rgba(0,0,0,.25))`,
              transform: `scale(${k}) rotate(${i % 2 ? 3 : -3}deg)`,
            }}
          >
            {l}
          </div>
        ))}
        {sub && <div style={{marginTop: 24 * L.u, padding: `${10 * L.u}px ${30 * L.u}px`, borderRadius: 99, background: 'rgba(255,255,255,.7)', border: `${3 * L.u}px solid #FFFFFF`, fontFamily: b.fB, fontWeight: 800, fontSize: 44 * L.u, color: '#5A3DD6', opacity: ease(f, 10, 18)}}>{sub}</div>}
      </AbsoluteFill>
      {range(9).map((i) => {
        const tw = Math.max(0, Math.sin(f / 6 + i * 1.7));
        return (
          <svg key={`s${i}`} width={70 * L.u} height={70 * L.u} viewBox="0 0 40 40" style={{position: 'absolute', left: `${8 + random(`sx${i}`) * 84}%`, top: `${10 + random(`sy${i}`) * 80}%`, transform: `scale(${0.4 + tw})`, opacity: tw}}>
            <path d="M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0 Z" fill="#FFFFFF" />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- B44 CRT TV ---------------- */

/** B44: your clip plays inside an old CRT TV; it switches on through static with a channel number */
export const CrtTv: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const title = txt(p.title, '');
  const ch = txt(p.channel, 'CH 03');
  const on = ease(f, 6, 14);
  const tvW = L.portrait ? L.W * 0.9 : L.H * 1.05;
  const tvH = tvW * 0.82;
  const sx = (L.W - tvW) / 2;
  const sy = L.portrait ? L.H * 0.3 : (L.H - tvH) / 2;
  const scrW = tvW * 0.72;
  const scrH = tvH * 0.74;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, #3A2A20, #120C08 70%)`}}>
      {title && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.14 : L.H * 0.05, textAlign: 'center', fontFamily: b.fH, fontSize: Math.min(110 * L.u, ((L.W * 0.85) / Math.max(4, title.length)) * 1.6), color: '#FFF3D6', textTransform: 'uppercase', textShadow: rgbSplit(L.u, 0.6)}}>{title}</div>}
      <div style={{position: 'absolute', left: sx, top: sy, width: tvW, height: tvH, borderRadius: 50 * L.u, background: 'linear-gradient(160deg, #8B6A4A, #5A3F28)', boxShadow: `inset 0 0 0 ${8 * L.u}px #3B2716, 0 ${30 * L.u}px ${60 * L.u}px rgba(0,0,0,.6)`}}>
        <div style={{position: 'absolute', left: tvW * 0.05, top: tvH * 0.08, width: scrW, height: scrH, borderRadius: `${scrW * 0.08}px / ${scrH * 0.12}px`, overflow: 'hidden', background: '#111', boxShadow: `inset 0 0 ${40 * L.u}px rgba(0,0,0,.9)`}}>
          <div style={{position: 'absolute', inset: 0, opacity: on, transform: `scaleY(${0.02 + 0.98 * on})`, filter: 'saturate(1.3) contrast(1.1)'}}>
            <Media src={p.media ?? 'demo:📺:30'} zoom="none" />
          </div>
          {f < 14 && (
            <AbsoluteFill style={{opacity: 1 - on * 0.9, backgroundImage: `repeating-radial-gradient(circle at ${random(`st${f}`) * 100}% ${random(`su${f}`) * 100}%, #fff 0 1px, #222 1px 3px)`}} />
          )}
          <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 2px, transparent 2px 4px)'}} />
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,.12), transparent 50%, rgba(0,0,0,.5) 100%)'}} />
          <div style={{position: 'absolute', right: 20 * L.u, top: 16 * L.u, fontFamily: MONO, fontWeight: 700, fontSize: 40 * L.u, color: '#3BFF6B', textShadow: '0 0 8px #3BFF6B', opacity: f < 40 ? 1 : 0}}>{ch}</div>
        </div>
        {/* knobs + speaker */}
        {[0.25, 0.5].map((y, i) => <div key={i} style={{position: 'absolute', left: tvW * 0.83, top: tvH * y, width: tvW * 0.1, height: tvW * 0.1, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #DDD, #555)', boxShadow: '0 4px 8px rgba(0,0,0,.5)', transform: `rotate(${f * (i ? -2 : 3)}deg)`}} />)}
        <div style={{position: 'absolute', left: tvW * 0.81, top: tvH * 0.68, width: tvW * 0.14, height: tvH * 0.2, backgroundImage: 'repeating-linear-gradient(0deg, #2B1C10 0 4px, transparent 4px 9px)'}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- K15 VHS CTA ---------------- */

/** K15: blue VHS menu screen: "▶ MESSAGE US" blinking like a VCR prompt, with the handle */
export const VhsCTA: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const cta = txt(p.cta, b.cta);
  const title = txt(p.title, 'PRESS PLAY');
  const handle = txt(p.handle, b.handle ?? '');
  const blink = f % 20 < 13 ? 1 : 0.15;
  const fs = Math.min(130 * L.u, ((L.W * 0.78) / Math.max(5, cta.length + 2)) * 1.6);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #1636B8, #0A1E7A)', overflow: 'hidden'}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40 * L.u, transform: `translateX(${jitterX(f, L.u)}px)`}}>
        {title && <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 56 * L.u, color: '#FFFFFF', letterSpacing: 6 * L.u, textShadow: rgbSplit(L.u, 0.5), opacity: ease(f, 2, 8)}}>{title}</div>}
        <div style={{fontFamily: b.fH, fontSize: fs, color: '#FFFFFF', textTransform: 'uppercase', textShadow: rgbSplit(L.u), opacity: blink, whiteSpace: 'nowrap'}}>▶ {cta}</div>
        {handle && <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 40 * L.u, color: b.primary, textShadow: rgbSplit(L.u, 0.4)}}>{handle}</div>}
      </AbsoluteFill>
      <OSD f={f} fps={L.fps} u={L.u} mode="PLAY ▶" date={p.date} />
      <VHS f={f} u={L.u} />
    </AbsoluteFill>
  );
};
