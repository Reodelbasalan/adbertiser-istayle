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
