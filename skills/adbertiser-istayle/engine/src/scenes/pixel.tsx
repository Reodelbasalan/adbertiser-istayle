import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {font, useBrand} from '../brand';
import {Media} from '../lib/Media';
import {ease, step, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Pixel / 8-bit look: B55 pixel title · B56 game HUD · B57 pixel loading bar · K20 press start CTA.
// Press Start 2P (OFL), hard pixel edges, stepped motion (holds every 3 frames), chiptune-y SFX.
type P = Record<string, any>;
export const pixelFont = () => `'${font('Press Start 2P', [400])}', monospace`;
const NAVY = '#1A1C2C';
const P8 = ['#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8'];

/** pixel-art sprite from rows of chars (each char = palette index or '.') drawn as box-shadows */
export const Sprite: React.FC<{rows: string[]; px: number; colors: Record<string, string>}> = ({rows, px, colors}) => {
  const shadows: string[] = [];
  rows.forEach((r, y) => r.split('').forEach((c, x) => {
    if (c !== '.' && colors[c]) shadows.push(`${x * px}px ${y * px}px 0 ${colors[c]}`);
  }));
  return <div style={{width: px, height: px, boxShadow: shadows.join(','), position: 'relative'}} />;
};
const HEART = ['.11.11.', '1111111', '1111111', '.11111.', '..111..', '...1...'];
const COIN = ['.222.', '22322', '22322', '22322', '.222.'];
const STAR = ['...1...', '...1...', '1111111', '.11111.', '.1...1.', '1.....1'];

const Grid: React.FC<{u: number}> = ({u}) => (
  <AbsoluteFill style={{backgroundImage: `linear-gradient(rgba(255,255,255,.04) ${2 * u}px, transparent ${2 * u}px), linear-gradient(90deg, rgba(255,255,255,.04) ${2 * u}px, transparent ${2 * u}px)`, backgroundSize: `${24 * u}px ${24 * u}px`}} />
);

/* ---------------- B55 pixel title ---------------- */

/** B55: 8-bit title types in block by block over a starfield, with a blinking cursor */
export const PixelTitle: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const lines = txt(p.text, 'LEVEL UP|YOUR ADS').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const sub = txt(p.sub, '');
  const longest = Math.max(4, ...lines.map((l) => l.length));
  const size = Math.min(110 * L.u, (L.W * 0.88) / longest);
  const sf = step(f, 3);
  const typed = Math.floor(sf / 2);
  const offs = lines.map((_, i) => lines.slice(0, i).reduce((a, l) => a + l.length, 0));
  return (
    <AbsoluteFill style={{background: NAVY, overflow: 'hidden'}}>
      {range(40).map((i) => <div key={i} style={{position: 'absolute', left: `${(i * 37) % 100}%`, top: `${((i * 53) % 100 + sf * 0.3 * ((i % 3) + 1)) % 100}%`, width: 6 * L.u, height: 6 * L.u, background: i % 5 ? '#FFFFFF' : P8[i % P8.length], opacity: 0.6}} />)}
      <Grid u={L.u} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: size * 0.6}}>
        {lines.map((l, i) => {
          const n = Math.max(0, Math.min(l.length, typed - offs[i]));
          const typing = typed - offs[i] >= 0 && n < l.length;
          return (
            <div key={i} style={{fontFamily: pixelFont(), fontSize: size, lineHeight: 1.2, color: i % 2 ? (p.color ?? b.primary) : '#FFFFFF', textShadow: `${size * 0.1}px ${size * 0.1}px 0 ${P8[0]}`, whiteSpace: 'pre'}}>
              {l.slice(0, n)}
              {typing && <span style={{opacity: f % 10 < 5 ? 1 : 0}}>█</span>}
              <span style={{visibility: 'hidden'}}>{l.slice(n + (typing ? 1 : 0))}</span>
            </div>
          );
        })}
        {sub && <div style={{fontFamily: pixelFont(), fontSize: 30 * L.u, color: P8[2], opacity: ease(f, 24, 26), marginTop: 10 * L.u}}>{sub}</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const pixelTypeEnd = (p: P) => txt(p.text, 'LEVEL UP|YOUR ADS').replace(/\|/g, '').length * 6;

/* ---------------- B56 game HUD ---------------- */

/** B56: footage (or a level) with a game HUD: score counting, hearts, coins popping, "+100" and LEVEL UP */
export const GameHud: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const score = Number(p.score ?? 2400);
  const sf = step(f, 3);
  const k = ease(sf, 4, dur * 0.7);
  const label = txt(p.label, 'LEVEL UP!');
  const px = 12 * L.u;
  const lvlAt = Math.round(dur * 0.65);
  return (
    <AbsoluteFill style={{background: NAVY, overflow: 'hidden'}}>
      {p.media ? <div style={{position: 'absolute', inset: 0, filter: 'saturate(1.4) contrast(1.15)'}}><Media src={p.media} zoom="in" /></div> : <Grid u={L.u} />}
      <div style={{position: 'absolute', left: 50 * L.u, top: L.portrait ? L.H * 0.14 : 40 * L.u, display: 'flex', gap: 14 * L.u}}>
        {range(3).map((i) => <Sprite key={i} rows={HEART} px={px} colors={{1: P8[0]}} />).map((s, i) => <div key={i} style={{width: 7 * px + 10 * L.u, height: 6 * px}}>{s}</div>)}
      </div>
      <div style={{position: 'absolute', right: 50 * L.u, top: L.portrait ? L.H * 0.14 : 40 * L.u, fontFamily: pixelFont(), fontSize: 44 * L.u, color: '#FFFFFF', textShadow: `4px 4px 0 ${NAVY}`}}>
        SCORE {String(Math.round(score * k)).padStart(5, '0')}
      </div>
      {range(5).map((i) => {
        const at = 8 + i * 8;
        const t = sf - at;
        if (t < 0 || t > 18) return null;
        return (
          <div key={i} style={{position: 'absolute', left: `${20 + ((i * 17) % 60)}%`, top: `${45 - t * 1.2}%`, opacity: 1 - t / 18}}>
            <Sprite rows={COIN} px={px * 1.4} colors={{2: P8[2], 3: P8[1]}} />
            <div style={{fontFamily: pixelFont(), fontSize: 28 * L.u, color: P8[2], marginTop: 8 * px, marginLeft: -10 * L.u}}>+100</div>
          </div>
        );
      })}
      {sf >= lvlAt && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: pixelFont(), fontSize: Math.min(96 * L.u, (L.W * 0.86) / Math.max(5, label.length)), color: P8[2], textShadow: `${8 * L.u}px ${8 * L.u}px 0 ${P8[0]}`, transform: `scale(${sf - lvlAt < 6 ? 1.3 : 1})`, opacity: f % 8 < 6 ? 1 : 0.6}}>{label}</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
export const hudLevelAt = (dur: number) => Math.round(dur * 0.65);

/* ---------------- B57 pixel loading bar ---------------- */

/** B57: blocky loading bar fills in steps ("LOADING ADS...") then flips to a done line */
export const PixelLoad: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const label = txt(p.label, 'LOADING ADS...');
  const done = txt(p.done, 'READY!');
  const blocks = 12;
  const end = Math.round(dur * 0.7);
  const filled = Math.min(blocks, Math.floor((step(f, 3) / end) * blocks));
  const bw = L.portrait ? L.W * 0.82 : L.W * 0.6;
  const bs = (bw - 20 * L.u) / blocks;
  return (
    <AbsoluteFill style={{background: NAVY, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 * L.u}}>
      <Grid u={L.u} />
      <div style={{fontFamily: pixelFont(), fontSize: Math.min(56 * L.u, (L.W * 0.86) / Math.max(6, label.length)), color: '#FFFFFF'}}>{filled >= blocks ? done : label}</div>
      <div style={{width: bw, padding: 10 * L.u, border: `${8 * L.u}px solid #FFFFFF`, display: 'flex', boxSizing: 'border-box'}}>
        {range(blocks).map((i) => <div key={i} style={{width: bs - 6 * L.u, height: 60 * L.u, marginRight: 6 * L.u, background: i < filled ? (filled >= blocks ? P8[3] : (p.color ?? b.primary)) : 'transparent'}} />)}
      </div>
      <div style={{fontFamily: pixelFont(), fontSize: 36 * L.u, color: P8[2]}}>{Math.round((filled / blocks) * 100)}%</div>
      {filled >= blocks && <div style={{position: 'absolute', top: L.H * 0.28}}><Sprite rows={STAR} px={16 * L.u} colors={{1: P8[2]}} /></div>}
    </AbsoluteFill>
  );
};
export const loadEnd = (dur: number) => Math.round(dur * 0.7);

/* ---------------- K20 press start CTA ---------------- */

/** K20: "PRESS START" blinks, then the CTA appears as a pixel button with a pixel arrow */
export const PixelCTA: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const cta = txt(p.cta, b.cta);
  const top = txt(p.title, 'PRESS START');
  const handle = txt(p.handle, b.handle ?? '');
  const show = f >= 12;
  const fs = Math.min(64 * L.u, (L.W * 0.8) / Math.max(6, cta.length + 2));
  return (
    <AbsoluteFill style={{background: NAVY, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 * L.u}}>
      <Grid u={L.u} />
      <div style={{fontFamily: pixelFont(), fontSize: 50 * L.u, color: '#FFFFFF', opacity: f % 16 < 10 ? 1 : 0}}>{top}</div>
      {show && (
        <div style={{display: 'flex', alignItems: 'center', gap: 24 * L.u}}>
          <div style={{fontFamily: pixelFont(), fontSize: fs, color: P8[2], transform: `translateX(${step(f, 4) % 8 < 4 ? 0 : 10 * L.u}px)`}}>▶</div>
          <div style={{fontFamily: pixelFont(), fontSize: fs, color: NAVY, background: p.color ?? b.primary, padding: `${22 * L.u}px ${30 * L.u}px`, boxShadow: `${10 * L.u}px ${10 * L.u}px 0 #FFFFFF`}}>{cta}</div>
        </div>
      )}
      {handle && show && <div style={{fontFamily: pixelFont(), fontSize: 28 * L.u, color: '#FFFFFF', opacity: 0.8}}>{handle}</div>}
    </AbsoluteFill>
  );
};
