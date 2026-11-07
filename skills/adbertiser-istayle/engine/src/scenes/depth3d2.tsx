import React from 'react';
import {AbsoluteFill, Img, random, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Media, asset, parseDemo} from '../lib/Media';
import {alpha, ease, fitSize, lin, pop, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {Extruded, mix, range, txt} from './depth3d';

// 3D look, part 2 (CSS 3D): D7 3D bar chart · D4 floating product spin · D9 photo fly-through · G11 3D title on footage.
type P = Record<string, any>;

/* ---------------- D7 3D bar chart ---------------- */

const BARS = [
  {label: 'Week 1', value: 12},
  {label: 'Week 2', value: 25},
  {label: 'Week 3', value: 41},
  {label: 'Week 4', value: 68},
];
export const barsList = (p: P): {label: string; value: number}[] => (Array.isArray(p.bars) && p.bars.length ? p.bars : BARS).slice(0, 6).map((x: any) => ({label: String(x.label ?? ''), value: Number(x.value) || 0}));
export const barTimes = (k: number, fps: number) => range(k).map((i) => Math.round(fps * 0.3) + i * 6);

/** D7: 3D bars (CSS cuboids) grow one by one with counting values; use real numbers or keep the SAMPLE tag */
export const Bars3D: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const bars = barsList(p);
  const ts = barTimes(bars.length, L.fps);
  const title = txt(p.title, 'Messages per week');
  const pre = txt(p.prefix, '');
  const suf = txt(p.suffix, '');
  const max = Math.max(...bars.map((x) => x.value), 1);
  const areaW = L.portrait ? L.W * 0.78 : L.W * 0.55;
  const bw = (areaW / bars.length) * 0.6;
  const gapW = (areaW / bars.length) * 0.4;
  const maxH = L.portrait ? L.H * 0.34 : L.H * 0.5;
  const dep = bw * 0.6;
  const camY = -24 + Math.sin(f / (L.fps * 1.4)) * 5;
  const tk = pop(f, L.fps, 0, 220, 13);
  const face = p.color ?? b.primary;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 60%, ${alpha(face, 0.18)} 0%, ${b.bg} 55%, #000 100%)`, overflow: 'hidden'}}>
      {title && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.14 : L.H * 0.07, textAlign: 'center', fontFamily: b.fH, fontSize: Math.min(100 * L.u, fitSize(title, L.u, L.portrait, 120)), lineHeight: 1.02, color: b.text, textTransform: 'uppercase', opacity: tk, transform: `translateY(${(1 - tk) * -40 * L.u}px)`}}>{title}</div>
      )}
      <AbsoluteFill style={{perspective: 1600 * L.u, alignItems: 'center', justifyContent: 'center', paddingTop: L.portrait ? L.H * 0.14 : L.H * 0.1}}>
        <div style={{position: 'relative', width: areaW, height: maxH, transformStyle: 'preserve-3d', transform: `rotateX(-14deg) rotateY(${camY}deg)`}}>
          {bars.map((x, i) => {
            const k = ease(f, ts[i], ts[i] + Math.round(L.fps * 0.6));
            const h = Math.max(4 * L.u, (x.value / max) * maxH * k);
            const left = i * (bw + gapW) + gapW / 2;
            const shown = Number.isInteger(x.value) ? Math.round(x.value * k).toLocaleString('en-US') : (x.value * k).toFixed(1);
            const hi = i === bars.length - 1;
            const col = hi ? face : mix(face, 0.25);
            return (
              <div key={i} style={{position: 'absolute', left, bottom: 0, width: bw, height: h, transformStyle: 'preserve-3d'}}>
                <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${col}, ${mix(face, 0.45)})`, transform: `translateZ(${dep / 2}px)`, boxShadow: hi ? `0 0 ${40 * L.u}px ${alpha(face, 0.6)}` : 'none'}} />
                <div style={{position: 'absolute', top: 0, left: 0, width: bw, height: dep, background: '#FFFFFF', opacity: 0.55, transformOrigin: 'top', transform: `translateZ(${dep / 2}px) rotateX(90deg)`}} />
                <div style={{position: 'absolute', top: 0, left: bw, width: dep, height: '100%', background: mix(face, 0.55), transformOrigin: 'left', transform: `translateZ(${dep / 2}px) rotateY(90deg)`}} />
                <div style={{position: 'absolute', left: -bw * 0.5, right: -bw * 0.5, top: -84 * L.u, textAlign: 'center', fontFamily: b.fH, fontSize: Math.min(64 * L.u, bw * 0.55), color: hi ? face : b.text, transform: `translateZ(${dep / 2}px)`, opacity: ease(f, ts[i], ts[i] + 6), whiteSpace: 'nowrap'}}>
                  {pre}
                  {shown}
                  {suf}
                </div>
              </div>
            );
          })}
          {bars.map((x, i) => (
            <div key={`l${i}`} style={{position: 'absolute', left: i * (bw + gapW) + gapW / 2 - bw * 0.5, width: bw * 2, top: maxH + 22 * L.u, textAlign: 'center', fontFamily: b.fB, fontWeight: 700, fontSize: Math.min(34 * L.u, bw * 0.3), color: alpha(b.text, 0.8), transform: `translateZ(${dep / 2}px)`, whiteSpace: 'nowrap'}}>{x.label}</div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- D4 floating product spin ---------------- */

/** D4: product (transparent PNG) sways on a glowing podium; thickness from stacked layers, light ring behind */
export const ProductSpin: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const src: string = p.product ?? 'demo:🧴';
  const demo = parseDemo(src);
  const size = Math.min(L.W, L.H) * (L.portrait ? 0.6 : 0.5);
  const cy = L.H * 0.47;
  const inK = pop(f, L.fps, 0, 150, 13);
  const rot = (1 - inK) * -90 + Math.sin(f / (L.fps * 0.75)) * 30;
  const float = Math.sin(f / (L.fps * 0.55)) * 14 * L.u;
  const title = txt(p.title, '');
  const sub = txt(p.sub, '');
  const ts = pop(f, L.fps, 10, 220, 13);
  const layer = (i: number, top: boolean) => {
    const st: React.CSSProperties = {position: 'absolute', inset: 0, transform: `translateZ(${top ? 2 * L.u : -i * 1.6 * L.u}px)`, filter: top ? undefined : `brightness(${0.55 - i * 0.02})`};
    return demo ? (
      <div key={`${top}${i}`} style={{...st, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.8, lineHeight: 1}}>{demo.emoji}</div>
    ) : (
      <Img key={`${top}${i}`} src={asset(src)} style={{...st, width: size, height: size, objectFit: 'contain'}} />
    );
  };
  const pod = size * 1.1;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% ${(cy / L.H) * 100}%, ${alpha(b.primary, 0.3)} 0%, ${b.bg} 50%, #000 100%)`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: L.W / 2 - size * 0.62, top: cy - size * 0.62, width: size * 1.24, height: size * 1.24, boxSizing: 'border-box', borderRadius: '50%', border: `${10 * L.u}px solid ${alpha(b.primary, 0.75)}`, boxShadow: `0 0 ${80 * L.u}px ${alpha(b.primary, 0.6)}, inset 0 0 ${60 * L.u}px ${alpha(b.primary, 0.4)}`, transform: `scale(${0.6 + 0.4 * inK})`, opacity: inK}} />
      <div style={{position: 'absolute', left: L.W / 2 - pod / 2, top: cy + size * 0.42, width: pod, height: pod * 0.3}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: pod * 0.07, height: pod * 0.18, background: `linear-gradient(90deg, ${mix(b.secondary, 0.6)}, ${b.secondary}, ${mix(b.secondary, 0.6)})`, borderBottomLeftRadius: '50% 40%', borderBottomRightRadius: '50% 40%'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: pod * 0.15, borderRadius: '50%', background: `radial-gradient(ellipse at 50% 40%, ${alpha('#FFFFFF', 0.55)}, ${b.secondary} 72%)`, boxShadow: `0 0 ${40 * L.u}px ${alpha(b.primary, 0.5)}`}} />
      </div>
      <div style={{position: 'absolute', left: (L.W - size) / 2, top: cy - size / 2 + float - (1 - inK) * L.H * 0.4, width: size, height: size, perspective: 1400 * L.u}}>
        <div style={{position: 'relative', width: size, height: size, transformStyle: 'preserve-3d', transform: `rotateY(${rot}deg)`}}>
          {range(12).map((i) => layer(i, false))}
          {layer(0, true)}
        </div>
      </div>
      {range(14).map((i) => {
        const a = random(`sp${i}`) * Math.PI * 2;
        const r = size * (0.55 + random(`sr${i}`) * 0.35);
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / 8 + i));
        return <div key={i} style={{position: 'absolute', left: L.W / 2 + Math.cos(a + f / 90) * r, top: cy + Math.sin(a + f / 90) * r * 0.8, width: 8 * L.u, height: 8 * L.u, borderRadius: '50%', background: '#FFFFFF', opacity: tw * inK, boxShadow: `0 0 ${12 * L.u}px ${b.primary}`}} />;
      })}
      {(title || sub) && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.12 : L.H * 0.06, textAlign: 'center', opacity: ts, transform: `translateY(${(1 - ts) * -40 * L.u}px)`}}>
          {title && <div style={{fontFamily: b.fH, fontSize: Math.min(110 * L.u, fitSize(title, L.u, L.portrait, 130)), lineHeight: 1.02, color: b.text, textTransform: 'uppercase'}}>{title}</div>}
          {sub && <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: 44 * L.u, color: b.primary, marginTop: 10 * L.u}}>{sub}</div>}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- D9 photo fly-through ---------------- */

const FLY = ['demo:📸:200', 'demo:🎬:30', 'demo:🛍️:320'];

/** D9: the camera flies forward through a tunnel of photos/clips; each one passes by and the last one lands full screen */
export const FlyThrough: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const photos: string[] = (Array.isArray(p.photos) && p.photos.length ? p.photos : FLY).slice(0, 6);
  const labels: string[] = Array.isArray(p.labels) ? p.labels : [];
  const n = photos.length;
  const gapZ = 1500 * L.u;
  const travel = ease(f, 0, Math.max(10, dur - Math.round(L.fps * 0.5))) * (n - 1) * gapZ;
  const cw = L.portrait ? L.W * 0.7 : L.W * 0.42;
  const ch = cw * (L.portrait ? 1.35 : 0.75);
  const title = txt(p.title, '');
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(b.secondary, 0.3)} 0%, ${b.bg} 60%, #000 100%)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{perspective: 1100 * L.u, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: cw, height: ch, transformStyle: 'preserve-3d', transform: `translateZ(${travel}px)`}}>
          {photos
            .map((src, i) => ({src, i}))
            .reverse()
            .map(({src, i}) => {
              const z = -i * gapZ;
              const rel = z + travel; // 0 = at the screen plane, >0 = passed the camera
              const fade = rel > 300 * L.u ? Math.max(0, 1 - (rel - 300 * L.u) / (500 * L.u)) : Math.min(1, 1 + rel / (gapZ * 2.2));
              const side = i === n - 1 ? 0 : (i % 2 ? 1 : -1) * cw * 0.18;
              const tilt = i === n - 1 ? 0 : (i % 2 ? -8 : 8);
              return (
                <div key={i} style={{position: 'absolute', inset: 0, transform: `translate3d(${side}px, 0, ${z}px) rotateY(${tilt}deg)`, opacity: fade, borderRadius: 26 * L.u, overflow: 'hidden', boxShadow: `0 ${30 * L.u}px ${70 * L.u}px rgba(0,0,0,.6)`, border: `${4 * L.u}px solid ${alpha('#FFFFFF', 0.85)}`}}>
                  <Media src={src} zoom="none" />
                  {labels[i] && (
                    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: `${22 * L.u}px`, background: 'linear-gradient(transparent, rgba(0,0,0,.75))', fontFamily: b.fH, fontSize: 64 * L.u, color: '#FFFFFF', textTransform: 'uppercase', textAlign: 'center'}}>{labels[i]}</div>
                  )}
                </div>
              );
            })}
        </div>
      </AbsoluteFill>
      {title && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.12 : L.H * 0.06, textAlign: 'center', fontFamily: b.fH, fontSize: Math.min(100 * L.u, fitSize(title, L.u, L.portrait, 120)), lineHeight: 1.02, color: b.text, textTransform: 'uppercase', textShadow: '0 6px 24px rgba(0,0,0,.7)', opacity: ease(f, 0, 8)}}>{title}</div>
      )}
    </AbsoluteFill>
  );
};
export const flyCount = (p: P) => (Array.isArray(p.photos) && p.photos.length ? Math.min(6, p.photos.length) : FLY.length);

/* ---------------- G11 3D title on footage ---------------- */

/** G11: a thick 3D title flips up over your footage (top, middle or bottom third), with a soft shadow */
export const Title3D: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const lines = txt(p.title, 'Panalong|Ad').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const longest = Math.max(...lines.map((l) => l.length), 3);
  const size = Math.min(L.portrait ? 190 * L.u : 170 * L.u, ((L.W * 0.86) / longest) * 1.6);
  const at = Math.round((p.titleAt ?? 0.2) * L.fps);
  const k = ease(f, at, at + Math.round(L.fps * 0.45));
  const s = pop(f, L.fps, at + 6, 200, 11);
  const flip = (1 - k) * -95;
  const sway = Math.sin(f / (L.fps * 1.2)) * 6 * k;
  const sheen = lin(f, at + 10, at + L.fps, -20, 120);
  const pos = p.position ?? 'middle';
  const top = pos === 'top' ? (L.portrait ? L.H * 0.24 : L.H * 0.12) : pos === 'bottom' ? (L.portrait ? L.H * 0.58 : L.H * 0.6) : L.H * 0.5 - (lines.length * size) / 2;
  const sub = txt(p.sub, '');
  return (
    <AbsoluteFill>
      <Media src={p.media ?? 'demo:🌆:210'} zoom="in" dim={0.2} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,.35), transparent 70%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top, perspective: 1300 * L.u, display: 'flex', justifyContent: 'center'}}>
        <div style={{transformStyle: 'preserve-3d', transformOrigin: '50% 100%', transform: `rotateX(${flip}deg) rotateY(${-14 + sway}deg) scale(${0.92 + 0.08 * s})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.04, opacity: Math.min(1, k * 2.5), filter: `drop-shadow(0 ${20 * L.u}px ${30 * L.u}px rgba(0,0,0,.55))`}}>
          {lines.map((l, i) => (
            <Extruded key={i} text={l} size={size} font={b.fH} face={i % 2 ? b.text : p.color ?? b.primary} side={i % 2 ? '#9A9AA8' : p.color ?? b.primary} depth={size * 0.45} sheen={sheen} />
          ))}
        </div>
      </div>
      {sub && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: top + lines.length * size * 1.08 + 30 * L.u, textAlign: 'center', fontFamily: b.fB, fontWeight: 800, fontSize: 46 * L.u, color: '#FFFFFF', opacity: ease(f, at + 12, at + 20), textShadow: '0 4px 16px rgba(0,0,0,.85)'}}>{sub}</div>
      )}
    </AbsoluteFill>
  );
};
