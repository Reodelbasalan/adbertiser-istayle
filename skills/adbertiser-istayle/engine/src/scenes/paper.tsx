import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Media, Thing} from '../lib/Media';
import {Cutout, NOISE, PaperBg, Tape, tearLine} from '../lib/Paper';
import {ease, ink, lin, pop, rnd, step, useLayout, words} from '../lib/util';
import type {SceneProps} from '../types';

type PItem = {emoji?: string; image?: string; label?: string};

/** C1 paper cutout stop-motion: torn-paper letters, cut-out items, motion on threes */
export const PaperCutout: React.FC<SceneProps> = ({p}) => {
  const raw = useCurrentFrame();
  const f = step(raw, 3);
  const L = useLayout();
  const b = useBrand();
  const title: string = (p.title ?? 'Fresh Daily').toUpperCase();
  const items: PItem[] = p.items ?? [{emoji: '🍌', label: 'Real banana'}, {emoji: '🔥', label: 'Crispy'}, {emoji: '🛍️', label: '3 for ₱100'}];
  const palette: string[] = p.colors ?? [b.primary, '#FFFFFF', b.secondary, '#2B2B2B'];
  const tw = words(title);
  const longest = Math.max(...tw.map((w) => w.length));
  const ls = Math.min(185 * L.u, (L.W - 2 * L.pad) / (longest * 0.95));
  let li = 0;
  const boil = (k: string | number) => rnd(`${k}-${f}`, -1.4, 1.4);
  const itemSize = Math.min(L.portrait ? 250 * L.u : 230 * L.u, (L.W - 2 * L.pad) / items.length - 30 * L.u);
  const itemsAt = 6 + title.replace(/\s/g, '').length * 2 + 6;
  return (
    <AbsoluteFill>
      <PaperBg color={p.paperColor ?? b.paper} fibers u={L.u} />
      {[0, 1, 2].map((k) => (
        <Cutout key={k} w={(260 + k * 60) * L.u} h={(200 + k * 50) * L.u} seed={`blob${k}`} color={palette[(k + 2) % palette.length]} rotate={rnd(`br${k}`, -20, 20) + boil(`b${k}`)} style={{position: 'absolute', left: [-80, L.W / L.u - 230, -60][k] * L.u, top: [L.H * 0.08, L.H * 0.4, L.H * 0.78][k], opacity: 0.9}} />
      ))}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40 * L.u, padding: L.pad}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 * L.u}}>
          {tw.map((w, wi) => (
            <div key={wi} style={{display: 'flex', gap: 6 * L.u}}>
              {w.split('').map((ch, ci) => {
                const idx = li++;
                const s = pop(f, L.fps, 4 + idx * 2, 260, 10);
                const bg = palette[idx % palette.length];
                return (
                  <Cutout key={ci} w={ls * 0.82} h={ls * 1.08} seed={`L${idx}`} color={bg} rotate={rnd(`lr${idx}`, -9, 9) + boil(`l${idx}`)} style={{transform: `scale(${s})`, opacity: s > 0.05 ? 1 : 0}}>
                    <span style={{fontFamily: idx % 3 === 1 ? b.fSerif : b.fH, fontWeight: 900, fontSize: ls * 0.8, color: ink(bg), lineHeight: 1}}>{ch}</span>
                  </Cutout>
                );
              })}
            </div>
          ))}
        </div>
        {p.sub && (
          <div style={{position: 'relative', transform: `scale(${pop(f, L.fps, itemsAt - 4, 220, 12)})`}}>
            <Cutout w={Math.min(L.W - 2 * L.pad, p.sub.length * 30 * L.u + 120 * L.u)} h={110 * L.u} seed="sub" color="#FFFFFF" rotate={-2 + boil('s')}>
              <span style={{fontFamily: b.fHand, fontSize: 56 * L.u, color: '#222'}}>{p.sub}</span>
            </Cutout>
            <Tape w={140 * L.u} h={44 * L.u} rotate={-30} style={{position: 'absolute', left: -40 * L.u, top: -14 * L.u}} />
          </div>
        )}
        <div style={{display: 'flex', gap: 30 * L.u, alignItems: 'flex-end'}}>
          {items.map((it, i) => {
            const t = itemsAt + i * 4;
            const s = pop(f, L.fps, t, 200, 11);
            const bob = Math.sin((f + i * 12) / 7) * 8 * L.u;
            return (
              <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 * L.u, transform: `translateY(${(1 - s) * 260 * L.u + bob}px)`, opacity: s > 0.05 ? 1 : 0}}>
                <Cutout w={itemSize} h={itemSize} seed={`it${i}`} color="#FFFFFF" rotate={rnd(`ir${i}`, -7, 7) + boil(`i${i}`)} inner={{padding: itemSize * 0.08}}>
                  {it.image ? <Media src={it.image} zoom="none" /> : <Thing src={`demo:${it.emoji ?? '⭐'}`} size={itemSize * 0.8} />}
                </Cutout>
                {it.label && <span style={{fontFamily: b.fHand, fontSize: 40 * L.u, color: '#222', transform: `rotate(${rnd(`tl${i}`, -4, 4)}deg)`}}>{it.label}</span>}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SPOTS: Record<number, [number, number, number][]> = {
  1: [[0.5, 0.5, -3]],
  2: [[0.32, 0.42, -6], [0.66, 0.58, 5]],
  3: [[0.3, 0.38, -6], [0.7, 0.45, 5], [0.45, 0.66, -2]],
  4: [[0.3, 0.36, -6], [0.7, 0.4, 5], [0.32, 0.64, 4], [0.68, 0.68, -5]],
};

/** C2 scrapbook collage: polaroids drop in with tape, handwritten notes, doodle stars */
export const Scrapbook: React.FC<SceneProps> = ({p}) => {
  const f = step(useCurrentFrame(), 2);
  const L = useLayout();
  const b = useBrand();
  const photos: string[] = (p.photos ?? ['demo:🧋:30', 'demo:🍓:340', 'demo:🧁:280']).slice(0, 4);
  const notes: string[] = p.notes ?? ['best seller!', 'new flavor', 'sulit 💯'];
  const spots = SPOTS[photos.length] ?? SPOTS[3];
  const ph = L.portrait ? L.W * 0.46 : L.H * 0.42;
  const title: string = p.title ?? 'Our favorites';
  return (
    <AbsoluteFill>
      <PaperBg color={p.paperColor ?? '#F6F2E8'} lines="grid" u={L.u} />
      <div style={{position: 'absolute', top: L.portrait ? L.top - 70 * L.u : L.H * 0.06, width: '100%', textAlign: 'center'}}>
        <span style={{fontFamily: b.fHand, fontSize: 110 * L.u * (L.portrait ? 1 : 0.8), color: '#222', display: 'inline-block', transform: `rotate(-3deg) scale(${pop(f, L.fps, 0, 200, 12)})`}}>{title}</span>
        <svg width={L.W} height={40 * L.u} style={{display: 'block'}}>
          <path d={`M${L.W * 0.28},${20 * L.u} Q${L.W * 0.5},${34 * L.u} ${L.W * 0.72},${14 * L.u}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, 6, 16)} stroke={b.primary} strokeWidth={12 * L.u} fill="none" strokeLinecap="round" />
        </svg>
      </div>
      {photos.map((src, i) => {
        const [x, y, r] = spots[i];
        const t = 8 + i * 12;
        const s = pop(f, L.fps, t, 230, 13);
        if (f < t) return null;
        return (
          <div key={i} style={{position: 'absolute', left: x * L.W - ph / 2, top: (L.portrait ? L.top + (y - 0.3) * (L.bottom - L.top) * 1.35 : y * L.H) - ph * 0.6, transform: `scale(${1.35 - 0.35 * s}) rotate(${r}deg)`, opacity: Math.min(1, s * 2)}}>
            <Cutout w={ph} h={ph * 1.18} seed={`pol${i}`} color="#FFFFFF" amp={3} inner={{flexDirection: 'column', justifyContent: 'flex-start', padding: ph * 0.06, gap: ph * 0.03}}>
              <div style={{width: '100%', height: ph * 0.86, position: 'relative', overflow: 'hidden'}}>
                <Media src={src} zoom="none" />
              </div>
              <span style={{fontFamily: b.fHand, fontSize: ph * 0.09, color: '#333'}}>{notes[i] ?? ''}</span>
            </Cutout>
            <Tape w={ph * 0.42} h={ph * 0.12} rotate={rnd(`tp${i}`, -12, 12)} seed={`tp${i}`} style={{position: 'absolute', left: ph * 0.29, top: -ph * 0.05}} />
          </div>
        );
      })}
      {[0, 1].map((k) => {
        const s = pop(f, L.fps, 30 + k * 6, 240, 10);
        return (
          <div key={k} style={{position: 'absolute', left: [0.12, 0.84][k] * L.W, top: [0.72, 0.3][k] * L.H, fontSize: 90 * L.u, color: b.primary, transform: `scale(${s}) rotate(${k ? 14 : -10}deg)`, fontFamily: b.fHand}}>
            ★
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const NOTE_COLORS = ['#FFE45C', '#FF9EBB', '#9EE6FF', '#B6F28A'];

/** C3 sticky notes on a board, optional check marks */
export const StickyNotes: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const notes: string[] = p.notes ?? ['Hook sa 1st 3 seconds', 'Captions lagi', 'SFX bawat pop', 'CTA sa dulo'];
  const cols = L.portrait ? 2 : Math.min(4, notes.length);
  const size = Math.min(L.portrait ? L.W * 0.38 : L.H * 0.36, ((L.W - 2 * L.pad) / cols) * 0.9);
  const allIn = 10 + notes.length * 7 + 8;
  const checkGap = Math.max(6, (dur - allIn - 10) / notes.length);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40 * L.u}}>
      <PaperBg color={p.boardColor ?? '#C9A27A'} fibers u={L.u} />
      {p.title && (
        <Cutout w={Math.min(L.W - 2 * L.pad, p.title.length * 44 * L.u + 120 * L.u)} h={130 * L.u} seed="nt" color="#FFFFFF" rotate={-2} style={{transform: `scale(${pop(f, L.fps, 0, 220, 12)})`}}>
          <span style={{fontFamily: b.fH, fontSize: 76 * L.u, color: '#222', textTransform: 'uppercase'}}>{p.title}</span>
        </Cutout>
      )}
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: 34 * L.u}}>
        {notes.map((n, i) => {
          const t = 10 + i * 7;
          const s = pop(f, L.fps, t, 300, 14);
          const ct = allIn + i * checkGap;
          const ck = p.check === false ? 0 : ease(f, ct, ct + 8);
          return (
            <div key={i} style={{width: size, height: size, position: 'relative', background: NOTE_COLORS[i % 4], backgroundImage: NOISE, backgroundBlendMode: 'multiply', transform: `rotate(${rnd(`nr${i}`, -5, 5)}deg) scale(${1.4 - 0.4 * s})`, opacity: f >= t ? 1 : 0, boxShadow: `0 ${(18 - 12 * s) * L.u}px ${(36 - 20 * s) * L.u}px rgba(0,0,0,.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: size * 0.1, clipPath: 'polygon(0 0, 100% 0, 100% 86%, 86% 100%, 0 100%)'}}>
              <span style={{fontFamily: b.fHand, fontSize: Math.min(size * 0.16, (size * 2.2) / Math.max(6, n.length)), color: '#222', textAlign: 'center', lineHeight: 1.15}}>{n}</span>
              {ck > 0 && (
                <svg width={size * 0.36} height={size * 0.36} viewBox="0 0 100 100" style={{position: 'absolute', right: -size * 0.04, top: -size * 0.08}}>
                  <path d="M12,55 L40,82 L92,14" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ck} stroke="#16A34A" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** C4 / J10 torn paper reveal: a paper sheet rips in half to show what is under it */
export const TornReveal: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const tearAt = Math.round((p.tearAt ?? Math.min(1.2, (dur / L.fps) * 0.35)) * L.fps);
  const k = ease(f, tearAt, tearAt + L.fps * 0.6);
  const pre = f < tearAt ? Math.sin(f * 1.7) * lin(f, tearAt - 10, tearAt, 0, 4 * L.u) : 0;
  const jag = tearLine(L.H, L.W / 2, 'tear', 26 * L.u, 34 * L.u);
  const left = `polygon(0 0, ${jag.map(([x, y]) => `${x}px ${y}px`).join(', ')}, 0 ${L.H}px)`;
  const right = `polygon(${L.W}px 0, ${jag.map(([x, y]) => `${x}px ${y}px`).join(', ')}, ${L.W}px ${L.H}px)`;
  const edge = jag.map(([x, y]) => `${x},${y}`).join(' ');
  const top: string = p.top ?? 'Ano kaya ang bago?';
  const sheet = (clip: string, dir: number) => (
    <AbsoluteFill style={{clipPath: clip, transform: `translate(${dir * k * L.W * 0.75 + pre}px, ${k * 60 * L.u}px) rotate(${dir * k * 9}deg)`, transformOrigin: dir < 0 ? 'left center' : 'right center'}}>
      <PaperBg color={p.paperColor ?? b.paper} u={L.u} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: L.pad}}>
        <span style={{fontFamily: b.fHand, fontSize: 120 * L.u * (L.portrait ? 1 : 0.8), color: '#222', textAlign: 'center', lineHeight: 1.1}}>{top}</span>
      </AbsoluteFill>
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
        <polyline points={edge} fill="none" stroke="#FFFFFF" strokeWidth={10 * L.u} opacity={k > 0 ? 1 : 0} />
      </svg>
    </AbsoluteFill>
  );
  const ts = pop(f, L.fps, tearAt + 8, 220, 12);
  return (
    <AbsoluteFill style={{background: '#111'}}>
      <Media src={p.media ?? 'demo:🎁:320'} />
      {p.title && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: L.portrait ? 'flex-end' : 'center', paddingBottom: L.portrait ? L.H - L.bottom : 0}}>
          <span style={{fontFamily: b.fH, fontSize: 130 * L.u, color: '#fff', textTransform: 'uppercase', textShadow: '0 8px 30px rgba(0,0,0,.6)', transform: `scale(${ts})`, textAlign: 'center', padding: `0 ${L.pad}px`}}>{p.title}</span>
        </AbsoluteFill>
      )}
      {k < 1 && sheet(left, -1)}
      {k < 1 && sheet(right, 1)}
    </AbsoluteFill>
  );
};
