import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CL} from './util';

export const asset = (s?: string) =>
  !s ? '' : /^(https?:|data:|blob:)/.test(s) ? s : staticFile(s.replace(/^\/+/, ''));

export const isVideo = (s?: string) => !!s && /\.(mp4|webm|mov|m4v|mkv)$/i.test(s);

/** "demo:<emoji>:<hue>" = built-in placeholder, so styles preview without any files */
export const parseDemo = (s?: string) => {
  if (!s || !s.startsWith('demo:')) return null;
  const [, emoji = '✨', hue = '40'] = s.split(':');
  return {emoji, hue: Number(hue) || 40};
};

export const Placeholder: React.FC<{emoji: string; hue: number}> = ({emoji, hue}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, hsl(${hue} 72% 60%), hsl(${hue + 35} 62% 30%))`,
      alignItems: 'center',
      justifyContent: 'center',
      containerType: 'size',
    }}
  >
    <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 22%, rgba(255,255,255,.38), transparent 55%)'}} />
    <div style={{fontSize: '42cqmin', lineHeight: 1, filter: 'drop-shadow(0 2cqmin 4cqmin rgba(0,0,0,.35))'}}>{emoji}</div>
  </AbsoluteFill>
);

type MediaProps = {
  src?: string;
  zoom?: 'in' | 'out' | 'none';
  punchAt?: number; // frame of a punch-in
  fit?: 'cover' | 'contain';
  dim?: number;
  blur?: number;
  style?: React.CSSProperties;
};

/** full-bleed photo/video with Ken Burns zoom; placeholder when src is empty or demo: */
export const Media: React.FC<MediaProps> = ({src, zoom = 'in', punchAt, fit = 'cover', dim = 0, blur = 0, style}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  let s = zoom === 'in' ? interpolate(f, [0, d], [1, 1.12], CL) : zoom === 'out' ? interpolate(f, [0, d], [1.12, 1], CL) : 1;
  if (punchAt != null) s *= interpolate(f, [punchAt, punchAt + 4], [1, 1.12], CL);
  const demo = parseDemo(src);
  const fill: React.CSSProperties = {width: '100%', height: '100%', objectFit: fit};
  const inner = demo ? (
    <Placeholder {...demo} />
  ) : !src ? (
    <Placeholder emoji="🎬" hue={220} />
  ) : isVideo(src) ? (
    <OffthreadVideo src={asset(src)} muted style={fill} />
  ) : (
    <Img src={asset(src)} style={fill} />
  );
  return (
    <AbsoluteFill style={{overflow: 'hidden', ...style}}>
      <AbsoluteFill style={{transform: `scale(${s})`, filter: blur ? `blur(${blur}px)` : undefined}}>{inner}</AbsoluteFill>
      {dim > 0 && <AbsoluteFill style={{background: `rgba(0,0,0,${dim})`}} />}
    </AbsoluteFill>
  );
};

/** a product / cut-out subject (transparent PNG), or a demo emoji */
export const Thing: React.FC<{src?: string; size: number; style?: React.CSSProperties}> = ({src, size, style}) => {
  const demo = parseDemo(src);
  if (demo || !src)
    return (
      <div style={{fontSize: size * 0.82, lineHeight: 1, width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style}}>
        {demo?.emoji ?? '📦'}
      </div>
    );
  return <Img src={asset(src)} style={{width: size, height: size, objectFit: 'contain', ...style}} />;
};
