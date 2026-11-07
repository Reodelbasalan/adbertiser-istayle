import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alpha} from './util';

export const Glow: React.FC<{color: string; x?: string; y?: string; strength?: number}> = ({color, x = '50%', y = '45%', strength = 0.35}) => (
  <AbsoluteFill style={{background: `radial-gradient(circle at ${x} ${y}, ${alpha(color, strength)}, transparent 62%)`}} />
);

export const Rays: React.FC<{color: string; opacity?: number; speed?: number}> = ({color, opacity = 0.1, speed = 0.4}) => {
  const f = useCurrentFrame();
  const mask = 'radial-gradient(circle, black 8%, transparent 58%)';
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      <div
        style={{
          width: '260%',
          aspectRatio: '1',
          flexShrink: 0,
          background: `repeating-conic-gradient(from ${f * speed}deg, ${alpha(color, opacity)} 0deg 9deg, transparent 9deg 22deg)`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </AbsoluteFill>
  );
};

export const burstPoints = (r: number, spikes = 16, inner = 0.8) => {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i * Math.PI) / spikes;
    const rad = i % 2 ? r * inner : r;
    pts.push(`${(r + rad * Math.cos(a)).toFixed(1)},${(r + rad * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
};

export const Burst: React.FC<{r: number; color: string; rot?: number; style?: React.CSSProperties}> = ({r, color, rot = 0, style}) => (
  <svg width={2 * r} height={2 * r} style={{transform: `rotate(${rot}deg)`, overflow: 'visible', ...style}}>
    <polygon points={burstPoints(r)} fill={color} />
  </svg>
);

export const Pill: React.FC<{text: string; bg: string; color: string; size: number; font: string; style?: React.CSSProperties}> = ({text, bg, color, size, font, style}) => (
  <div
    style={{
      background: bg,
      color,
      fontFamily: font,
      fontWeight: 800,
      fontSize: size,
      padding: `${size * 0.32}px ${size * 0.8}px`,
      borderRadius: size * 2,
      letterSpacing: size * 0.04,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {text}
  </div>
);
