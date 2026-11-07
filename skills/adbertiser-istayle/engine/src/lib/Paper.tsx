import React from 'react';
import {AbsoluteFill, random} from 'remotion';

const svgUri = (svg: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

/** procedural paper grain (no image files, no license issues) */
export const NOISE = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.55'/></svg>`,
);

/** coarse fibers for kraft / cork */
export const FIBERS = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.02 0.35' numOctaves='2' seed='4'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#f)' opacity='0.35'/></svg>`,
);

export const PaperBg: React.FC<{color: string; lines?: 'none' | 'grid' | 'ruled'; fibers?: boolean; u?: number}> = ({
  color,
  lines = 'none',
  fibers = false,
  u = 1,
}) => (
  <AbsoluteFill style={{background: color}}>
    <AbsoluteFill style={{backgroundImage: NOISE, mixBlendMode: 'multiply', opacity: 0.45}} />
    {fibers && <AbsoluteFill style={{backgroundImage: FIBERS, mixBlendMode: 'multiply', opacity: 0.5}} />}
    {lines === 'grid' && (
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(70,100,170,.16) 2px, transparent 2px), linear-gradient(90deg, rgba(70,100,170,.16) 2px, transparent 2px)',
          backgroundSize: `${64 * u}px ${64 * u}px`,
        }}
      />
    )}
    {lines === 'ruled' && (
      <AbsoluteFill
        style={{backgroundImage: 'linear-gradient(rgba(70,100,170,.22) 2px, transparent 2px)', backgroundSize: `100% ${72 * u}px`}}
      />
    )}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(60,40,10,.22))'}} />
  </AbsoluteFill>
);

/** SVG path of a rectangle with hand-torn edges */
export const tornRect = (w: number, h: number, seed: string | number, amp = 6, stepPx = 14) => {
  const r = (k: string) => random(`${seed}-${k}`) * amp;
  const pts: string[] = [];
  for (let x = 0; x <= w; x += stepPx) pts.push(`${x.toFixed(1)},${r(`t${x}`).toFixed(1)}`);
  for (let y = 0; y <= h; y += stepPx) pts.push(`${(w - r(`r${y}`)).toFixed(1)},${y.toFixed(1)}`);
  for (let x = w; x >= 0; x -= stepPx) pts.push(`${x.toFixed(1)},${(h - r(`b${x}`)).toFixed(1)}`);
  for (let y = h; y >= 0; y -= stepPx) pts.push(`${r(`l${y}`).toFixed(1)},${y.toFixed(1)}`);
  return `M${pts.join('L')}Z`;
};

/** jagged vertical tear line points (x around x0) from top to bottom */
export const tearLine = (h: number, x0: number, seed: string, amp: number, stepPx: number) => {
  const pts: [number, number][] = [];
  for (let y = 0; y <= h + stepPx; y += stepPx) pts.push([x0 + (random(`${seed}${y}`) - 0.5) * 2 * amp, Math.min(y, h)]);
  return pts;
};

type CutoutProps = {
  w: number;
  h: number;
  seed?: string | number;
  color?: string;
  rotate?: number;
  amp?: number;
  shadow?: number;
  texture?: boolean;
  style?: React.CSSProperties;
  inner?: React.CSSProperties;
  children?: React.ReactNode;
};

/** a torn piece of paper with a soft drop shadow */
export const Cutout: React.FC<CutoutProps> = ({w, h, seed = 1, color = '#fff', rotate = 0, amp, shadow = 1, texture = true, style, inner, children}) => {
  const a = amp ?? Math.max(3, Math.min(w, h) * 0.035);
  const d = tornRect(w, h, seed, a, Math.max(8, Math.min(w, h) * 0.06));
  const s = Math.max(2, Math.min(w, h) * 0.03) * shadow;
  return (
    <div style={{width: w, height: h, transform: `rotate(${rotate}deg)`, filter: `drop-shadow(${s * 0.4}px ${s}px ${s * 1.1}px rgba(0,0,0,.32))`, ...style}}>
      <div
        style={{
          width: '100%',
          height: '100%',
          clipPath: `path('${d}')`,
          backgroundColor: color,
          backgroundImage: texture ? NOISE : undefined,
          backgroundBlendMode: 'multiply',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          ...inner,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** translucent masking tape strip */
export const Tape: React.FC<{w: number; h: number; rotate?: number; seed?: string | number; style?: React.CSSProperties}> = ({w, h, rotate = 0, seed = 't', style}) => (
  <Cutout w={w} h={h} seed={seed} rotate={rotate} color="rgba(238,226,186,.78)" amp={h * 0.12} shadow={0.25} style={style} />
);
