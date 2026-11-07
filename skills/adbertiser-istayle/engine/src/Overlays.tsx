import React from 'react';
import {AbsoluteFill, Img, random, useCurrentFrame} from 'remotion';
import {useBrand} from './brand';
import {Pill} from './lib/Fx';
import {asset} from './lib/Media';
import {NOISE} from './lib/Paper';
import {useLayout} from './lib/util';

/** I1 logo / brand-name watermark, top right */
export const Watermark: React.FC = () => {
  const L = useLayout();
  const b = useBrand();
  const top = L.portrait ? L.H * 0.06 : 36 * L.u;
  return (
    <div style={{position: 'absolute', top, right: L.portrait ? L.W * 0.16 : 40 * L.u, opacity: 0.85}}>
      {b.logo ? (
        <Img src={asset(b.logo)} style={{height: 70 * L.u, objectFit: 'contain'}} />
      ) : (
        <span style={{fontFamily: b.fH, fontSize: 40 * L.u, color: b.text, letterSpacing: 2 * L.u, textShadow: '0 2px 8px rgba(0,0,0,.5)', WebkitTextStroke: `${2 * L.u}px rgba(0,0,0,.55)`, paintOrder: 'stroke fill'}}>{b.name}</span>
      )}
    </div>
  );
};

/** I2 film grain */
export const Grain: React.FC<{amount?: number}> = ({amount = 0.18}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{backgroundImage: NOISE, backgroundPosition: `${random(`gx${f}`) * 260}px ${random(`gy${f}`) * 260}px`, opacity: amount, mixBlendMode: 'overlay', pointerEvents: 'none'}} />;
};

/** I5 vignette */
export const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.5))'}} />;

/** I10 SAMPLE tag for mock stats, dashboards and concept ads */
export const SampleTag: React.FC<{text?: string}> = ({text = 'SAMPLE'}) => {
  const L = useLayout();
  const b = useBrand();
  return <Pill text={text} bg="rgba(0,0,0,.6)" color="#fff" size={26 * L.u} font={b.fB} style={{position: 'absolute', top: L.portrait ? L.H * 0.06 : 36 * L.u, left: 40 * L.u}} />;
};

/** I3 drifting warm light leaks */
export const LightLeaks: React.FC = () => {
  const f = useCurrentFrame();
  const x = 15 + Math.sin(f / 41) * 35;
  const y = 25 + Math.cos(f / 57) * 20;
  return <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,140,60,${0.28 + 0.12 * Math.sin(f / 13)}), transparent 45%), radial-gradient(circle at ${100 - x}% ${100 - y}%, rgba(255,60,120,.16), transparent 40%)`}} />;
};

/** I4 VHS lines: scanlines + a rolling tracking band */
export const VhsLines: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,.16) 0 ${2 * L.u}px, transparent ${2 * L.u}px ${4 * L.u}px)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: `${((f * 6) % 140) - 20}%`, height: '5%', background: 'linear-gradient(180deg, transparent, rgba(255,255,255,.1), transparent)'}} />
    </AbsoluteFill>
  );
};

/** I6 paper texture multiplied over everything */
export const PaperTexture: React.FC = () => <AbsoluteFill style={{pointerEvents: 'none', backgroundImage: `url("${NOISE}")`, backgroundSize: '400px 400px', mixBlendMode: 'multiply', opacity: 0.35}} />;

/** I7 lens flare that slowly crosses the frame */
export const LensFlare: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const x = ((f * 2.2 * L.u) % (L.W * 1.6)) - L.W * 0.3;
  const y = L.H * 0.22;
  const dots = [0.35, 0.6, 0.85, 1.1];
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      <div style={{position: 'absolute', left: x - 160 * L.u, top: y - 160 * L.u, width: 320 * L.u, height: 320 * L.u, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,240,.9), rgba(255,200,120,.35) 30%, transparent 70%)'}} />
      <div style={{position: 'absolute', left: x - 500 * L.u, top: y - 3 * L.u, width: 1000 * L.u, height: 6 * L.u, background: 'linear-gradient(90deg, transparent, rgba(255,230,190,.6), transparent)'}} />
      {dots.map((k, i) => {
        const dx = x + (L.W / 2 - x) * k * 2;
        const dy = y + (L.H / 2 - y) * k * 2;
        return <div key={i} style={{position: 'absolute', left: dx - (30 + i * 20) * L.u, top: dy - (30 + i * 20) * L.u, width: (60 + i * 40) * L.u, height: (60 + i * 40) * L.u, borderRadius: '50%', background: `radial-gradient(circle, rgba(${i % 2 ? '140,200,255' : '255,180,120'},.22), transparent 70%)`}} />;
      })}
    </AbsoluteFill>
  );
};

/** I8 floating sparkle particles */
export const Sparkles: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 26}, (_, i) => {
        const x = random(`spx${i}`) * L.W;
        const y = ((random(`spy${i}`) * L.H - f * (0.8 + random(`spv${i}`)) * L.u * 2) % L.H + L.H) % L.H;
        const tw = Math.max(0, Math.sin(f / (5 + (i % 4)) + i));
        const s = (8 + random(`sps${i}`) * 16) * L.u;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, transform: `rotate(45deg) scale(${tw})`, background: 'radial-gradient(circle, #fff 20%, rgba(255,230,150,.6) 45%, transparent 70%)', opacity: 0.85}} />;
      })}
    </AbsoluteFill>
  );
};
