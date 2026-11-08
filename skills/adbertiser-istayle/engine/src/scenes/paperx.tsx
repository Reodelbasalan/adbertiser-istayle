import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Cutout, PaperBg, Tape} from '../lib/Paper';
import {Media} from '../lib/Media';
import {ease, pop, rnd, step, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Paper look, part 2: C5 kraft / cardboard · C6 ransom-note letters · C7 polaroid stack · C9 pop-up book.
type P = Record<string, any>;

/* ---------------- C5 kraft / cardboard ---------------- */

/** C5: corrugated cardboard backdrop, stamped title, tape strips and a hand-written note */
export const Kraft: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const title = txt(p.title, 'Handmade').toUpperCase();
  const note = txt(p.note, 'gawa sa Pinas');
  const sub = txt(p.sub, '');
  const sf = step(f, 3);
  const stamp = pop(sf, L.fps, 6, 380, 14);
  const size = Math.min(170 * L.u, ((L.W * 0.8) / Math.max(4, title.length)) * 1.6);
  return (
    <AbsoluteFill style={{background: '#B98A57'}}>
      <AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,.07) 0 ${6 * L.u}px, transparent ${6 * L.u}px ${18 * L.u}px)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(255,230,190,.35), transparent 60%), radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(60,30,10,.45) 100%)'}} />
      {p.photo && (
        <div style={{position: 'absolute', left: L.W * 0.18, top: L.H * 0.48, transform: `rotate(-4deg) scale(${pop(sf, L.fps, 12, 260, 13)})`}}>
          <Cutout w={L.W * 0.64} h={L.W * 0.5} seed="kp" color="#FFFFFF" amp={3} inner={{padding: 14 * L.u}}>
            <div style={{width: '100%', height: '100%', position: 'relative', overflow: 'hidden'}}><Media src={p.photo} zoom="in" /></div>
          </Cutout>
          <Tape w={180 * L.u} h={50 * L.u} rotate={-8} seed="kt" style={{position: 'absolute', left: -30 * L.u, top: -20 * L.u}} />
        </div>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: L.portrait ? L.H * 0.24 : L.H * 0.14, display: 'flex', justifyContent: 'center'}}>
        <div style={{fontFamily: b.fH, fontSize: size, color: 'rgba(40,20,8,.82)', border: `${8 * L.u}px solid rgba(40,20,8,.82)`, padding: `${4 * L.u}px ${26 * L.u}px`, letterSpacing: 6 * L.u, transform: `rotate(-6deg) scale(${f >= 6 ? 1.6 - 0.6 * stamp : 0})`, opacity: 0.88, mixBlendMode: 'multiply'}}>{title}</div>
      </div>
      {note && <div style={{position: 'absolute', left: 0, right: 0, top: (L.portrait ? L.H * 0.24 : L.H * 0.14) + size * 1.5, textAlign: 'center', fontFamily: b.fHand, fontSize: 70 * L.u, color: '#2A160A', transform: 'rotate(-3deg)', opacity: ease(sf, 14, 20)}}>{note}</div>}
      {sub && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.H * 0.78, textAlign: 'center', fontFamily: b.fB, fontWeight: 800, fontSize: 42 * L.u, color: '#2A160A', opacity: ease(sf, 20, 26)}}>{sub}</div>}
    </AbsoluteFill>
  );
};

/* ---------------- C6 ransom-note letters ---------------- */

/** C6: every letter cut from a different "magazine" (font, color, tilt), stuck on one by one */
export const Ransom: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const lines = txt(p.text, 'Sale|Ngayon').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const longest = Math.max(4, ...lines.map((l) => l.length));
  const size = Math.min(150 * L.u, (L.W * 0.88) / longest / 0.95);
  const fonts = [b.fH, b.fSerif, b.fHand, b.fType, b.fB];
  const bgs = ['#FFFFFF', '#111111', '#FFD23F', '#E63946', '#1D70E0', '#F2EADB', '#2BB24C'];
  const sf = step(f, 2);
  let n = 0;
  return (
    <AbsoluteFill>
      <PaperBg color={p.paperColor ?? '#ECE6DA'} lines="none" u={L.u} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: size * 0.2}}>
        {lines.map((l, i) => (
          <div key={i} style={{display: 'flex', gap: size * 0.06}}>
            {l.split('').map((ch, j) => {
              const k = n++;
              const at = 2 + k * 2;
              if (ch === ' ') return <div key={j} style={{width: size * 0.4}} />;
              const bg = bgs[Math.floor(rnd(`rb${k}`) * bgs.length)];
              const dark = bg === '#111111' || bg === '#E63946' || bg === '#1D70E0' || bg === '#2BB24C';
              const s = pop(sf, L.fps, at, 420, 15);
              return (
                <div key={j} style={{background: bg, padding: `${size * 0.04}px ${size * 0.1}px`, transform: `rotate(${rnd(`rr${k}`, -10, 10)}deg) scale(${sf >= at ? 1.4 - 0.4 * s : 0}) translateY(${rnd(`ry${k}`, -8, 8)}px)`, boxShadow: '0 4px 8px rgba(0,0,0,.25)', fontFamily: fonts[Math.floor(rnd(`rf${k}`) * fonts.length)], fontWeight: 900, fontSize: size * rnd(`rs${k}`, 0.78, 1.0), lineHeight: 1, color: dark ? '#FFFFFF' : '#111111', textTransform: rnd(`rc${k}`) > 0.5 ? 'uppercase' : 'lowercase'}}>{ch}</div>
              );
            })}
          </div>
        ))}
        {txt(p.sub, '') && <div style={{marginTop: size * 0.3, fontFamily: b.fType, fontSize: 44 * L.u, color: '#222', opacity: ease(sf, 2 + n * 2, 8 + n * 2)}}>{txt(p.sub, '')}</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const ransomCount = (p: P) => txt(p.text, 'Sale|Ngayon').replace(/\|/g, '').length;

/* ---------------- C7 polaroid stack ---------------- */

export const polaroidTimes = (n: number, dur: number, fps: number) => range(n).map((i) => Math.round(fps * 0.2 + (i * (dur - fps * 0.8)) / Math.max(1, n)));

/** C7: polaroids drop onto a pile one after another, each with a hand-written caption; the newest sits on top */
export const PolaroidStack: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const photos: string[] = (Array.isArray(p.photos) && p.photos.length ? p.photos : ['demo:🍰:20', 'demo:☕:30', 'demo:🥐:40']).slice(0, 5);
  const notes: string[] = Array.isArray(p.notes) ? p.notes : ['best seller', 'bagong luto', 'sulit!'];
  const ts = polaroidTimes(photos.length, dur, L.fps);
  const pw = L.portrait ? L.W * 0.68 : L.H * 0.6;
  const ph = pw * 1.18;
  return (
    <AbsoluteFill>
      <PaperBg color={p.paperColor ?? '#D9C3A0'} lines="none" u={L.u} />
      {photos.map((src, i) => {
        if (f < ts[i]) return null;
        const k = pop(f, L.fps, ts[i], 240, 14);
        const r = rnd(`pr${i}`, -12, 12);
        const dx = rnd(`px${i}`, -60, 60) * L.u;
        const dy = rnd(`py${i}`, -40, 40) * L.u;
        return (
          <div key={i} style={{position: 'absolute', left: (L.W - pw) / 2 + dx, top: L.H * 0.47 - ph / 2 + dy, transform: `rotate(${r}deg) scale(${1.25 - 0.25 * k}) translateY(${(1 - k) * -120 * L.u}px)`, opacity: Math.min(1, k * 2)}}>
            <Cutout w={pw} h={ph} seed={`pol${i}`} color="#FFFFFF" amp={2} inner={{flexDirection: 'column', justifyContent: 'flex-start', padding: pw * 0.055, gap: pw * 0.03}}>
              <div style={{width: '100%', height: pw * 0.86, position: 'relative', overflow: 'hidden'}}><Media src={src} zoom="none" /></div>
              <span style={{fontFamily: b.fHand, fontSize: pw * 0.085, color: '#333'}}>{notes[i] ?? ''}</span>
            </Cutout>
          </div>
        );
      })}
      {txt(p.title, '') && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.1 : L.H * 0.05, textAlign: 'center', fontFamily: b.fHand, fontSize: 110 * L.u, color: '#2A1A0A', transform: 'rotate(-3deg)'}}>{txt(p.title, '')}</div>}
    </AbsoluteFill>
  );
};

/* ---------------- C9 pop-up book ---------------- */

/** C9: an open book; paper layers fold up out of the spread one by one (scene, item, sign with the title) */
export const PopUpBook: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const title = txt(p.title, 'Bagong Bukas!');
  const bw = L.portrait ? L.W * 0.92 : L.W * 0.62;
  const bx = (L.W - bw) / 2;
  const spine = L.portrait ? L.H * 0.62 : L.H * 0.66;
  const pageH = bw * 0.32;
  const open = ease(f, 0, 14);
  const fold = (at: number) => ease(f, at, at + 12);
  const layer = (at: number, w: number, h: number, color: string, dx: number, children?: React.ReactNode, z = 1) => {
    const k = fold(at);
    return (
      <div style={{position: 'absolute', left: L.W / 2 - w / 2 + dx, top: spine - h, width: w, height: h, transformOrigin: 'bottom center', transform: `scaleY(${k}) skewX(${(1 - k) * 8}deg)`, background: color, borderRadius: `${18 * L.u}px ${18 * L.u}px 0 0`, boxShadow: `0 ${-4 * L.u}px ${16 * L.u}px rgba(0,0,0,.18), inset 0 ${-14 * L.u}px 0 rgba(0,0,0,.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: z}}>{children}</div>
    );
  };
  return (
    <AbsoluteFill>
      <PaperBg color={p.paperColor ?? '#F4E9D8'} lines="none" u={L.u} />
      {/* open book: two pages in perspective */}
      <div style={{position: 'absolute', left: bx, top: spine, width: bw, height: pageH, opacity: open}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: bw / 2, height: pageH, background: '#FFFDF7', clipPath: `polygon(${(1 - open) * 30 + 6}% 0, 100% 0, 100% 100%, 0 100%)`, boxShadow: 'inset -20px 0 30px rgba(0,0,0,.08)'}} />
        <div style={{position: 'absolute', left: bw / 2, top: 0, width: bw / 2, height: pageH, background: '#FFFDF7', clipPath: `polygon(0 0, ${100 - ((1 - open) * 30 + 6)}% 0, 100% 100%, 0 100%)`, boxShadow: 'inset 20px 0 30px rgba(0,0,0,.08)'}} />
        <div style={{position: 'absolute', left: bw / 2 - 2 * L.u, top: 0, width: 4 * L.u, height: pageH, background: '#D8CBB6'}} />
        <div style={{position: 'absolute', left: -10 * L.u, right: -10 * L.u, top: pageH, height: 22 * L.u, background: '#8C5A3C', borderRadius: `0 0 ${12 * L.u}px ${12 * L.u}px`}} />
      </div>
      {layer(8, bw * 0.86, bw * 0.62, '#7FC8A9', 0, null, 1)}
      {layer(14, bw * 0.4, bw * 0.48, '#F2A65A', -bw * 0.2, <div style={{fontSize: bw * 0.2}}>{txt(p.icon, '🏪')}</div>, 2)}
      {layer(20, bw * 0.62, bw * 0.24, b.primary, bw * 0.12, <div style={{fontFamily: b.fH, fontSize: Math.min(bw * 0.09, ((bw * 0.56) / Math.max(5, title.length)) * 1.6), color: '#1E1A12', textTransform: 'uppercase', padding: `0 ${10 * L.u}px`, textAlign: 'center'}}>{title}</div>, 3)}
      {txt(p.sub, '') && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: spine + pageH + 50 * L.u, textAlign: 'center', fontFamily: b.fHand, fontSize: 64 * L.u, color: '#3A2A18', opacity: ease(f, 30, 38)}}>{txt(p.sub, '')}</div>}
    </AbsoluteFill>
  );
};
