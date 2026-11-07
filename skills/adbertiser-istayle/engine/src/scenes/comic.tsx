import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {font, useBrand} from '../brand';
import {Burst, Rays} from '../lib/Fx';
import {Media} from '../lib/Media';
import {ease, pop, shake, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Comic look: B35 comic title burst · B19 comic panels · B36 speech bubble on footage · B37 comic price · K12 comic CTA.
// Lettering uses Bangers (OFL); ink outlines, halftone dots, speed lines, starbursts.
type P = Record<string, any>;

export const CINK = '#111111';
const CREAM = '#FFF4D6';
const CRED = '#E63946';
const CYEL = '#FFD60A';
export const comicFont = () => `'${font('Bangers', [400])}', 'Anton', sans-serif`;

/** halftone dots */
export const Halftone: React.FC<{u: number; color?: string; size?: number; opacity?: number}> = ({u, color = 'rgba(0,0,0,.28)', size = 12, opacity = 1}) => (
  <AbsoluteFill style={{backgroundImage: `radial-gradient(circle, ${color} ${size * 0.17 * u}px, transparent ${size * 0.2 * u}px)`, backgroundSize: `${size * u}px ${size * u}px`, opacity, pointerEvents: 'none'}} />
);

/** comic lettering: thick black outline + offset shadow */
export const Letter: React.FC<{text: string; size: number; color: string; rot?: number; style?: React.CSSProperties}> = ({text, size, color, rot = 0, style}) => (
  <div style={{fontFamily: comicFont(), fontSize: size, lineHeight: 0.95, color, WebkitTextStroke: `${size * 0.06}px ${CINK}`, paintOrder: 'stroke fill', textShadow: `${size * 0.05}px ${size * 0.06}px 0 ${CINK}`, transform: `rotate(${rot}deg)`, whiteSpace: 'nowrap', letterSpacing: size * 0.02, ...style}}>
    {text}
  </div>
);

/** speech bubble with a tail; `tail` = 'bl' | 'br' | 'tl' | 'tr' */
export const Bubble: React.FC<{text: string; w: number; size: number; tail?: string; k?: number}> = ({text, w, size, tail = 'bl', k = 1}) => {
  const left = tail.endsWith('l');
  const bottom = tail.startsWith('b');
  return (
    <div style={{position: 'relative', width: w, transform: `scale(${k})`, transformOrigin: `${left ? '20%' : '80%'} ${bottom ? '100%' : '0%'}`}}>
      <div style={{background: '#FFFFFF', border: `${size * 0.09}px solid ${CINK}`, borderRadius: '50%', padding: `${size * 0.7}px ${size * 0.9}px`, textAlign: 'center', fontFamily: comicFont(), fontSize: size, lineHeight: 1.05, color: CINK, boxShadow: `${size * 0.1}px ${size * 0.12}px 0 ${CINK}`}}>{text}</div>
      <svg width={size * 1.6} height={size * 1.4} viewBox="0 0 40 36" style={{position: 'absolute', [left ? 'left' : 'right']: w * 0.18, [bottom ? 'top' : 'bottom']: '100%', transform: `translateY(${bottom ? -size * 0.2 : size * 0.2}px) scaleX(${left ? 1 : -1}) scaleY(${bottom ? 1 : -1})`, overflow: 'visible'}}>
        <path d="M4 0 L18 34 L26 0" fill="#FFFFFF" stroke={CINK} strokeWidth={3.6} strokeLinejoin="round" />
        <rect x={5} y={-3} width={19} height={5} fill="#FFFFFF" />
      </svg>
    </div>
  );
};

/** yellow narration box */
export const Caption: React.FC<{text: string; size: number; style?: React.CSSProperties}> = ({text, size, style}) => (
  <div style={{display: 'inline-block', background: CYEL, border: `${size * 0.1}px solid ${CINK}`, padding: `${size * 0.25}px ${size * 0.5}px`, fontFamily: comicFont(), fontSize: size, color: CINK, letterSpacing: size * 0.03, boxShadow: `${size * 0.1}px ${size * 0.1}px 0 ${CINK}`, ...style}}>{text}</div>
);

/* ---------------- B35 comic title burst ---------------- */

export const burstAt = (fps: number) => Math.round(fps * 0.2);

/** B35: comic title slams onto a starburst with speed lines and halftone (POW! style hook) */
export const ComicTitle: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const lines = txt(p.text, 'Bagsak|Ang Ads?').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const caption = txt(p.caption, '');
  const at = burstAt(L.fps);
  const k = pop(f, L.fps, at, 320, 11);
  const sh = shake(f, at + 2, 9, 18 * L.u);
  const longest = Math.max(4, ...lines.map((l) => l.length));
  const size = Math.min(260 * L.u, ((L.W * 0.82) / longest) * 1.75);
  const R = Math.max(L.W, size * longest * 0.5) * 0.62;
  const burstColor = p.color ?? CYEL;
  return (
    <AbsoluteFill style={{background: CRED, overflow: 'hidden', transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Rays color="#FFFFFF" opacity={0.22} speed={0.6} />
      <Halftone u={L.u} color="rgba(0,0,0,.22)" size={16} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'absolute', transform: `scale(${k}) rotate(${-8 + f * 0.15}deg)`}}>
          <Burst r={R} color={CINK} style={{position: 'absolute', left: -R - 10 * L.u, top: -R - 10 * L.u, width: 2 * R + 20 * L.u, height: 2 * R + 20 * L.u}} />
          <Burst r={R} color={burstColor} style={{position: 'absolute', left: -R, top: -R}} />
        </div>
        <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${f >= at ? 2.4 - 1.4 * k : 0}) rotate(-6deg)`}}>
          {lines.map((l, i) => (
            <Letter key={i} text={l.toUpperCase()} size={size} color={i % 2 ? CRED : '#FFFFFF'} rot={i % 2 ? 3 : -2} />
          ))}
        </div>
      </AbsoluteFill>
      {caption && <Caption text={caption.toUpperCase()} size={46 * L.u} style={{position: 'absolute', left: L.pad, top: L.portrait ? L.H * 0.16 : L.H * 0.08, transform: `rotate(-2deg) translateX(${(1 - ease(f, 0, 8)) * -400 * L.u}px)`}} />}
    </AbsoluteFill>
  );
};

/* ---------------- B19 comic panels ---------------- */

const PANELS = [
  {media: 'demo:😩:10', caption: 'DATI...', say: 'Walang nagme-message!'},
  {media: 'demo:💡:45', caption: 'TAPOS...', say: 'Inayos ko ang hook!'},
  {media: 'demo:🤑:120', caption: 'NGAYON!', say: 'Sunod-sunod na!'},
];
export const panelList = (p: P): {media?: string; caption?: string; say?: string}[] => (Array.isArray(p.panels) && p.panels.length ? p.panels : PANELS).slice(0, 4);
export const panelTimes = (n: number, dur: number, fps: number, at?: number[]) => {
  const gap = Math.max(10, (dur - fps * 0.6) / Math.max(1, n));
  return range(n).map((i) => (Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : Math.round(fps * 0.1 + i * gap)));
};

/** B19: comic page; panels (photo/clip + narration + speech bubble) slam in one by one */
export const ComicPanels: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const panels = panelList(p);
  const ts = panelTimes(panels.length, dur, L.fps, p.at);
  const n = panels.length;
  const g = 22 * L.u;
  const vert = L.portrait;
  const top = vert ? L.H * 0.12 : L.H * 0.06;
  const areaH = vert ? L.H * 0.72 : L.H * 0.88;
  const areaW = L.W - 2 * (vert ? 40 * L.u : L.W * 0.05);
  const left0 = (L.W - areaW) / 2;
  const ph = vert ? (areaH - (n - 1) * g) / n : areaH;
  const pw = vert ? areaW : (areaW - (n - 1) * g) / n;
  return (
    <AbsoluteFill style={{background: CREAM, overflow: 'hidden'}}>
      <Halftone u={L.u} color="rgba(230,57,70,.18)" size={14} />
      {panels.map((pn, i) => {
        const k = pop(f, L.fps, ts[i], 260, 13);
        const x = vert ? left0 : left0 + i * (pw + g);
        const y = vert ? top + i * (ph + g) : top;
        const skew = vert ? (i % 2 ? -1.5 : 1.5) : 0;
        if (f < ts[i]) return null;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: pw, height: ph, transform: `rotate(${skew}deg) scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 2)}}>
            <div style={{position: 'absolute', inset: 0, border: `${9 * L.u}px solid ${CINK}`, background: '#FFFFFF', overflow: 'hidden', boxShadow: `${10 * L.u}px ${12 * L.u}px 0 ${CINK}`}}>
              <div style={{position: 'absolute', inset: 0, filter: 'contrast(1.25) saturate(1.3)'}}>
                <Media src={pn.media ?? 'demo:💥:20'} zoom="in" />
              </div>
              <Halftone u={L.u} color="rgba(0,0,0,.25)" size={10} opacity={0.6} />
            </div>
            {pn.caption && <Caption text={String(pn.caption).toUpperCase()} size={40 * L.u} style={{position: 'absolute', left: -6 * L.u, top: -6 * L.u}} />}
            {pn.say && (
              <div style={{position: 'absolute', right: vert ? 30 * L.u : 10 * L.u, bottom: vert ? ph * 0.12 : ph * 0.08, maxWidth: pw * 0.7}}>
                <Bubble text={String(pn.say)} w={Math.min(pw * 0.62, 520 * L.u)} size={Math.min(44 * L.u, ph * 0.1)} tail="bl" k={pop(f, L.fps, ts[i] + 6, 300, 12)} />
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- B36 speech bubble on footage ---------------- */

/** B36: your footage in a comic frame (halftone, ink border) with a speech bubble and narration box */
export const ComicBubble: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const say = txt(p.say, 'Ito na ang ad na hinahanap mo!');
  const caption = txt(p.caption, '');
  const right = p.side === 'right';
  const k = pop(f, L.fps, Math.round(L.fps * 0.25), 300, 12);
  const bw = L.portrait ? L.W * 0.7 : L.W * 0.4;
  return (
    <AbsoluteFill style={{background: CINK}}>
      <div style={{position: 'absolute', inset: 22 * L.u, border: `${10 * L.u}px solid ${CINK}`, overflow: 'hidden', outline: `${8 * L.u}px solid #FFFFFF`}}>
        <div style={{position: 'absolute', inset: 0, filter: 'contrast(1.3) saturate(1.35)'}}>
          <Media src={p.media ?? 'demo:🎥:200'} zoom="in" />
        </div>
        <Halftone u={L.u} color="rgba(0,0,0,.28)" size={11} opacity={0.55} />
      </div>
      {say && (
        <div style={{position: 'absolute', top: L.portrait ? L.H * 0.2 : L.H * 0.1, [right ? 'right' : 'left']: L.pad * 0.8}}>
          <Bubble text={say} w={bw} size={Math.min(64 * L.u, (bw / Math.max(10, say.length)) * 2.6)} tail={right ? 'br' : 'bl'} k={k} />
        </div>
      )}
      {caption && <Caption text={caption.toUpperCase()} size={48 * L.u} style={{position: 'absolute', left: L.pad, bottom: L.portrait ? L.H * 0.24 : L.H * 0.1, transform: `rotate(-2deg) scale(${pop(f, L.fps, Math.round(L.fps * 0.6), 280, 12)})`}} />}
    </AbsoluteFill>
  );
};

/* ---------------- B37 comic price ---------------- */

export const priceSlamAt = (fps: number) => Math.round(fps * 0.45);

/** B37: "WOW!" burst, then the price slams on a starburst; old price crossed out with ink */
export const ComicPrice: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const word = txt(p.word, 'WOW!');
  const price = txt(p.price, '₱999');
  const old = txt(p.oldPrice, '');
  const note = txt(p.note, '');
  const at = priceSlamAt(L.fps);
  const wk = pop(f, L.fps, 2, 300, 11);
  const k = pop(f, L.fps, at, 320, 11);
  const sh = shake(f, at + 2, 9, 16 * L.u);
  const ps = Math.min(300 * L.u, ((L.W * 0.7) / Math.max(3, price.length)) * 1.8);
  const R = Math.max(ps * 1.2, ps * price.length * 0.42);
  const cy = L.H * 0.52;
  return (
    <AbsoluteFill style={{background: '#1D4ED8', overflow: 'hidden', transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Rays color="#FFFFFF" opacity={0.16} speed={0.5} />
      <Halftone u={L.u} color="rgba(255,255,255,.18)" size={16} />
      <div style={{position: 'absolute', left: L.pad, top: L.portrait ? L.H * 0.17 : L.H * 0.08, transform: `scale(${wk}) rotate(-10deg)`, transformOrigin: 'left'}}>
        <Letter text={word} size={150 * L.u} color={CYEL} />
      </div>
      <div style={{position: 'absolute', left: L.W / 2, top: cy, transform: `scale(${k}) rotate(${-6 + f * 0.2}deg)`}}>
        <Burst r={R + 10 * L.u} color={CINK} style={{position: 'absolute', left: -R - 10 * L.u, top: -R - 10 * L.u}} />
        <Burst r={R} color={p.color ?? CYEL} style={{position: 'absolute', left: -R, top: -R}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: cy - ps * 0.5, display: 'flex', justifyContent: 'center', transform: `scale(${f >= at ? 2.2 - 1.2 * k : 0}) rotate(-5deg)`}}>
        <Letter text={price} size={ps} color={CRED} />
      </div>
      {old && (
        <div style={{position: 'absolute', left: 0, right: 0, top: cy - R - 120 * L.u, display: 'flex', justifyContent: 'center', opacity: ease(f, 6, 12)}}>
          <div style={{position: 'relative'}}>
            <Letter text={old} size={90 * L.u} color="#FFFFFF" />
            <div style={{position: 'absolute', left: '-8%', right: '-8%', top: '45%', height: 12 * L.u, background: CRED, border: `${3 * L.u}px solid ${CINK}`, transform: `rotate(-8deg) scaleX(${ease(f, at - 6, at)})`, transformOrigin: 'left'}} />
          </div>
        </div>
      )}
      {note && <Caption text={note.toUpperCase()} size={48 * L.u} style={{position: 'absolute', left: '50%', top: cy + R + 40 * L.u, transform: `translateX(-50%) rotate(2deg) scale(${pop(f, L.fps, at + 8, 280, 12)})`}} />}
    </AbsoluteFill>
  );
};

/* ---------------- K12 comic CTA ---------------- */

/** K12: CTA in a starburst bubble, a big pointing hand, speed lines */
export const ComicCTA: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const cta = txt(p.cta, b.cta);
  const title = txt(p.title, 'Ano pang hinihintay mo?');
  const handle = txt(p.handle, b.handle ?? '');
  const k = pop(f, L.fps, 8, 300, 11);
  const tk = pop(f, L.fps, 0, 260, 12);
  const cs = Math.min(150 * L.u, ((L.W * 0.7) / Math.max(5, cta.length)) * 1.7);
  const cy = L.H * 0.52;
  const bob = Math.sin(f / 4) * 14 * L.u;
  return (
    <AbsoluteFill style={{background: CYEL, overflow: 'hidden'}}>
      <Rays color="#FFFFFF" opacity={0.35} speed={0.8} />
      <Halftone u={L.u} color="rgba(230,57,70,.25)" size={14} />
      {title && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.2 : L.H * 0.1, display: 'flex', justifyContent: 'center', transform: `scale(${tk})`}}>
          <Caption text={title.toUpperCase()} size={Math.min(64 * L.u, ((L.W * 0.8) / Math.max(8, title.length)) * 1.8)} style={{transform: 'rotate(-2deg)'}} />
        </div>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: cy - cs * 0.7, display: 'flex', justifyContent: 'center', transform: `scale(${k}) rotate(-4deg)`}}>
        <div style={{background: CRED, border: `${10 * L.u}px solid ${CINK}`, borderRadius: 30 * L.u, padding: `${24 * L.u}px ${50 * L.u}px`, boxShadow: `${14 * L.u}px ${16 * L.u}px 0 ${CINK}`}}>
          <Letter text={cta.toUpperCase()} size={cs} color="#FFFFFF" />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: cy + cs * 0.9 + bob, textAlign: 'center', fontSize: 170 * L.u, lineHeight: 1, opacity: ease(f, 14, 20), filter: `drop-shadow(${8 * L.u}px ${10 * L.u}px 0 ${CINK})`}}>👆</div>
      {handle && <div style={{position: 'absolute', left: 0, right: 0, top: cy + cs * 0.9 + 220 * L.u, display: 'flex', justifyContent: 'center'}}><Letter text={handle} size={56 * L.u} color="#FFFFFF" /></div>}
    </AbsoluteFill>
  );
};
