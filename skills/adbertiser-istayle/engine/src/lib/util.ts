import {Easing, interpolate, random, spring, useVideoConfig} from 'remotion';

export const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** spring 0→1 starting at `delay` frames */
export const pop = (f: number, fps: number, delay = 0, stiffness = 200, damping = 12) =>
  spring({frame: Math.max(0, f - delay), fps, config: {stiffness, damping, mass: 0.6}});

/** eased 0→1 (or from→to) between frames a and b */
export const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {...CL, easing: Easing.out(Easing.cubic)});

export const lin = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], CL);

/** hold each pose n frames: the choppy stop-motion feel */
export const step = (f: number, n = 3) => Math.floor(f / n) * n;

export const rnd = (seed: string | number, min = 0, max = 1) => min + random(String(seed)) * (max - min);

/** camera shake offsets for `len` frames after frame `at` */
export const shake = (f: number, at: number, len = 8, amp = 14) => {
  const k = f - at;
  if (k < 0 || k > len) return {x: 0, y: 0};
  const fall = 1 - k / len;
  return {x: (random(`sx${k}`) - 0.5) * 2 * amp * fall, y: (random(`sy${k}`) - 0.5) * 2 * amp * fall};
};

const hexRgb = (hex: string): [number, number, number] => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const alpha = (hex: string, a: number) => {
  if (!hex.startsWith('#')) return hex;
  const [r, g, b] = hexRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};

/** readable text color on top of `hex` */
export const ink = (hex: string) => {
  if (!hex.startsWith('#')) return '#111111';
  const [r, g, b] = hexRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#111111' : '#FFFFFF';
};

/** layout numbers for any aspect; content box keeps 9:16 safe zone (25%–75% height) */
export const useLayout = () => {
  const {width: W, height: H, fps} = useVideoConfig();
  const u = Math.min(W, H) / 1080;
  const portrait = H > W * 1.15;
  const top = portrait ? H * 0.22 : H * 0.08;
  const bottom = portrait ? H * 0.74 : H * 0.92;
  return {W, H, fps, u, portrait, top, bottom, mid: (top + bottom) / 2, pad: portrait ? W * 0.08 : W * 0.06};
};

/** font size from text length, scaled to the frame */
export const fitSize = (text: string, u: number, portrait: boolean, base = 170) => {
  const n = text.length;
  const k = n <= 12 ? 1 : n <= 24 ? 0.82 : n <= 40 ? 0.66 : n <= 70 ? 0.52 : 0.42;
  return base * k * u * (portrait ? 1 : 0.85);
};

export const words = (s: string) => s.split(/\s+/).filter(Boolean);

export const clean = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
