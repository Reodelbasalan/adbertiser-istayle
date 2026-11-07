import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Pill} from '../lib/Fx';
import {alpha, ease, fitSize, ink, pop, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {mix, range, txt} from './depth3d';

// Isometric look: B6 isometric blocks · B51 isometric path · B52 isometric towers · K18 isometric CTA.
// Flat-shaded CSS cubes on an isometric grid (rotateX 60°, rotateZ -45°); icons stand up on the top faces.
type P = Record<string, any>;
const ISO = 'rotateX(58deg) rotateZ(-45deg)';
const PAL = ['#5B8CFF', '#FF7A59', '#2BC48A', '#FFC93C', '#B57BFF'];

/** one flat-shaded cube: x,y on the floor grid (px), w,d footprint, h height */
export const IsoBox: React.FC<{x: number; y: number; w: number; d: number; h: number; color: string; children?: React.ReactNode}> = ({x, y, w, d, h, color, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: d, transformStyle: 'preserve-3d'}}>
    <div style={{position: 'absolute', inset: 0, background: mix(color, 0.45), transform: 'translateZ(0px)'}} />
    {/* front (y+d) face */}
    <div style={{position: 'absolute', left: 0, top: d, width: w, height: h, background: mix(color, 0.28), transformOrigin: 'top', transform: 'rotateX(90deg)'}} />
    {/* right (x+w) face */}
    <div style={{position: 'absolute', left: w, top: 0, width: h, height: d, background: mix(color, 0.12), transformOrigin: 'left', transform: 'rotateY(-90deg)'}} />
    <div style={{position: 'absolute', inset: 0, background: color, transform: `translateZ(${h}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', transformStyle: 'preserve-3d'}}>{children}</div>
  </div>
);

/** emoji that stands upright on a top face (counter-rotates the iso view) */
const Upright: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <div style={{fontSize: size, lineHeight: 1, transform: 'rotateZ(45deg) rotateX(-58deg) translateY(-30%)', transformOrigin: 'bottom center'}}>{children}</div>
);

const Stage: React.FC<{u: number; size: number; y: number; children: React.ReactNode}> = ({u, size, y, children}) => (
  <div style={{position: 'absolute', left: '50%', top: y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, transform: ISO, transformStyle: 'preserve-3d'}}>
    <div style={{position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(0,0,0,.08) ${2 * u}px, transparent ${2 * u}px), linear-gradient(90deg, rgba(0,0,0,.08) ${2 * u}px, transparent ${2 * u}px)`, backgroundSize: `${size / 6}px ${size / 6}px`, background: undefined}} />
    {children}
  </div>
);

const Title: React.FC<{text: string; top: number}> = ({text, top}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const k = pop(f, L.fps, 0, 220, 13);
  return <div style={{position: 'absolute', left: L.pad, right: L.pad, top, textAlign: 'center', fontFamily: b.fH, fontSize: Math.min(110 * L.u, fitSize(text, L.u, L.portrait, 130)), lineHeight: 1.02, color: '#1E2235', textTransform: 'uppercase', transform: `scale(${k})`}}>{text}</div>;
};

/* ---------------- B6 isometric blocks ---------------- */

const BLOCKS = [
  {icon: '📱', label: 'Ads'},
  {icon: '💬', label: 'Messages'},
  {icon: '📦', label: 'Orders'},
];
export const blockList = (p: P): {icon?: string; label?: string; color?: string}[] => (Array.isArray(p.blocks) && p.blocks.length ? p.blocks : BLOCKS).slice(0, 4);
export const blockTimes = (n: number, fps: number, at?: number[]) => range(n).map((i) => (Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : Math.round(fps * 0.3) + i * 9));

/** B6: isometric blocks rise one by one, each with an icon standing on top and a label */
export const IsoBlocks: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const blocks = blockList(p);
  const ts = blockTimes(blocks.length, L.fps, p.at);
  const title = txt(p.title, 'Ganito ang daloy');
  const S = Math.min(L.W, L.H) * 0.86;
  const cell = S / 4.2;
  const pos = [[0.4, 0.4], [1.6, 1.6], [2.8, 2.8], [1.6, 0.2]];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #EEF2FF, #DCE4FF)'}}>
      {title && <Title text={title} top={L.portrait ? L.H * 0.13 : L.H * 0.06} />}
      <Stage u={L.u} size={S} y={L.portrait ? L.H * 0.52 : L.H * 0.56}>
        {blocks.map((bl, i) => {
          const k = pop(f, L.fps, ts[i], 200, 13);
          const [gx, gy] = pos[i];
          const c = bl.color ?? (i === 0 ? b.primary : PAL[i % PAL.length]);
          return (
            <IsoBox key={i} x={gx * cell} y={gy * cell} w={cell} d={cell} h={cell * 0.55 * k} color={c}>
              {bl.icon && k > 0.5 && <Upright size={cell * 0.6}>{bl.icon}</Upright>}
            </IsoBox>
          );
        })}
      </Stage>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.portrait ? L.H * 0.78 : L.H * 0.88, display: 'flex', justifyContent: 'center', gap: 24 * L.u, flexWrap: 'wrap'}}>
        {blocks.map((bl, i) => (bl.label ? <div key={i} style={{opacity: ease(f, ts[i] + 6, ts[i] + 12)}}><Pill text={bl.label} bg={i === 0 ? b.primary : PAL[i % PAL.length]} color={ink(i === 0 ? b.primary : PAL[i % PAL.length])} size={36 * L.u} font={b.fB} /></div> : null))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- B51 isometric path ---------------- */

export const pathSteps = (p: P): string[] => (Array.isArray(p.steps) && p.steps.length ? p.steps : ['Script', 'Shoot', 'Edit', 'Post']).slice(0, 5).map(String);
export const pathTimes = (n: number, dur: number, fps: number) => range(n).map((i) => Math.round(fps * 0.3 + (i * (dur - fps * 0.8)) / Math.max(1, n)));

/** B51: an isometric path of tiles; a ball hops from tile to tile as each step lights up */
export const IsoPath: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const steps = pathSteps(p);
  const ts = pathTimes(steps.length, dur, L.fps);
  const title = txt(p.title, '');
  const n = steps.length;
  const S = Math.min(L.W, L.H) * 0.9;
  const cell = S / (n + 0.6);
  let cur = 0;
  ts.forEach((t, i) => {
    if (f >= t) cur = i;
  });
  const hop = Math.sin(Math.min(1, (f - ts[cur]) / 8) * Math.PI) * cell * 0.5;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #FFF6E8, #FFE7C7)'}}>
      {title && <Title text={title} top={L.portrait ? L.H * 0.13 : L.H * 0.06} />}
      <Stage u={L.u} size={S} y={L.H * 0.5}>
        {steps.map((_, i) => {
          const lit = f >= ts[i];
          return <IsoBox key={i} x={i * cell + cell * 0.1} y={i * cell * 0.15 + S * 0.35} w={cell * 0.86} d={cell * 0.86} h={cell * (lit ? 0.3 : 0.12)} color={lit ? b.primary : '#C9C3B8'} />;
        })}
        <div style={{position: 'absolute', left: cur * cell + cell * 0.53 - cell * 0.15, top: cur * cell * 0.15 + S * 0.35 + cell * 0.43 - cell * 0.15, width: cell * 0.3, height: cell * 0.3, borderRadius: '50%', background: '#1E2235', transform: `translateZ(${cell * 0.3 + cell * 0.15 + hop}px)`, boxShadow: '0 0 0 rgba(0,0,0,0)'}} />
      </Stage>
      <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.74 : L.H * 0.84, textAlign: 'center', fontFamily: b.fH, fontSize: 90 * L.u, color: '#1E2235', textTransform: 'uppercase'}}>
        <span style={{opacity: 0.35}}>{String(cur + 1).padStart(2, '0')} </span>
        {steps[cur]}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- B52 isometric towers ---------------- */

export const towerList = (p: P): {label: string; value: number}[] => (Array.isArray(p.bars) && p.bars.length ? p.bars : [{label: 'W1', value: 12}, {label: 'W2', value: 25}, {label: 'W3', value: 41}, {label: 'W4', value: 68}]).slice(0, 5).map((x: any) => ({label: String(x.label ?? ''), value: Number(x.value) || 0}));

/** B52: isometric towers grow like a 3D bar chart; the last one is highlighted. Real numbers or SAMPLE. */
export const IsoTowers: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const bars = towerList(p);
  const title = txt(p.title, 'Messages per week');
  const max = Math.max(1, ...bars.map((x) => x.value));
  const S = Math.min(L.W, L.H) * 0.86;
  const cell = S / (bars.length + 1.2);
  const maxH = S * 0.5;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #ECFFF6, #CFF5E4)'}}>
      {title && <Title text={title} top={L.portrait ? L.H * 0.13 : L.H * 0.06} />}
      <Stage u={L.u} size={S} y={L.portrait ? L.H * 0.62 : L.H * 0.64}>
        {bars.map((x, i) => {
          const k = ease(f, 6 + i * 6, 6 + i * 6 + L.fps * 0.6);
          const hi = i === bars.length - 1;
          return (
            <IsoBox key={i} x={i * cell + cell * 0.3} y={S * 0.42} w={cell * 0.7} d={cell * 0.7} h={Math.max(2, (x.value / max) * maxH * k)} color={hi ? b.primary : '#5B8CFF'}>
              <Upright size={cell * 0.32}>
                <span style={{fontFamily: b.fH, color: '#1E2235', opacity: k}}>{Math.round(x.value * k)}</span>
              </Upright>
            </IsoBox>
          );
        })}
      </Stage>
      <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.82 : L.H * 0.9, display: 'flex', justifyContent: 'center', gap: 30 * L.u, fontFamily: b.fB, fontWeight: 700, fontSize: 30 * L.u, color: alpha('#1E2235', 0.7)}}>
        {bars.map((x, i) => <span key={i}>{x.label}</span>)}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- K18 isometric CTA ---------------- */

/** K18: an isometric phone rises with a chat bubble icon; the CTA pill pops underneath */
export const IsoCTA: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const cta = txt(p.cta, b.cta);
  const title = txt(p.title, b.name);
  const handle = txt(p.handle, b.handle ?? '');
  const S = Math.min(L.W, L.H) * 0.7;
  const k = pop(f, L.fps, 2, 180, 13);
  const ck = pop(f, L.fps, 14, 240, 12);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #F3EDFF, #E2D6FF)'}}>
      {title && <Title text={title} top={L.portrait ? L.H * 0.14 : L.H * 0.06} />}
      <Stage u={L.u} size={S} y={L.H * 0.46}>
        <IsoBox x={S * 0.1} y={S * 0.1} w={S * 0.8} d={S * 0.8} h={S * 0.06} color="#FFFFFF" />
        <IsoBox x={S * 0.3} y={S * 0.2} w={S * 0.4} d={S * 0.6} h={S * 0.12 * k + S * 0.06} color="#1E2235">
          {k > 0.6 && <Upright size={S * 0.22}>💬</Upright>}
        </IsoBox>
      </Stage>
      {cta && <div style={{position: 'absolute', left: 0, right: 0, top: L.portrait ? L.H * 0.72 : L.H * 0.82, display: 'flex', justifyContent: 'center', transform: `scale(${ck})`}}><Pill text={cta} bg={b.primary} color={ink(b.primary)} size={56 * L.u} font={b.fH} style={{textTransform: 'uppercase'}} /></div>}
      {handle && <div style={{position: 'absolute', left: 0, right: 0, top: L.portrait ? L.H * 0.79 : L.H * 0.9, textAlign: 'center', fontFamily: b.fB, fontWeight: 700, fontSize: 34 * L.u, color: '#1E2235', opacity: ease(f, 18, 24)}}>{handle}</div>}
    </AbsoluteFill>
  );
};
