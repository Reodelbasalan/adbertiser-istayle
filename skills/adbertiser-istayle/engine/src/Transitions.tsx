import React from 'react';
import {AbsoluteFill, Easing, random, useCurrentFrame} from 'remotion';
import {useBrand} from './brand';
import {tearLine} from './lib/Paper';
import {alpha, useLayout} from './lib/util';

/** transition ID → default SFX */
export const TRANSITION_SFX: Record<string, string> = {
  H1: 'whoosh_fast',
  H2: 'glitch',
  H3: 'sparkle',
  H4: 'shutter',
  H6: 'whoosh',
  H7: 'impact',
  H9: 'rip',
  H10: 'whoosh_fast',
  H12: 'whoosh_soft',
  H14: 'whoosh',
  H17: 'buzz',
};

export const TRANSITIONS = Object.keys(TRANSITION_SFX);

/** wraps the ENTERING scene; the previous scene keeps playing underneath for `frames` */
export const TransitionIn: React.FC<{type?: string; frames: number; children: React.ReactNode}> = ({type, frames, children}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  if (!type || !TRANSITION_SFX[type] || f >= frames) return <AbsoluteFill>{children}</AbsoluteFill>;
  const t = f / frames;
  const e = Easing.out(Easing.cubic)(t);
  const v = 1 - e;
  switch (type) {
    case 'H1':
      return <AbsoluteFill style={{transform: `translateX(${v * 100}%)`}}>{children}</AbsoluteFill>;
    case 'H10':
      return <AbsoluteFill style={{transform: `translateX(${v * 100}%) skewX(${-v * 14}deg)`, filter: `blur(${v * 40 * L.u}px)`}}>{children}</AbsoluteFill>;
    case 'H7':
      return <AbsoluteFill style={{transform: `scale(${1 + 0.6 * v})`, filter: `blur(${v * 18 * L.u}px)`, opacity: Math.min(1, t * 3)}}>{children}</AbsoluteFill>;
    case 'H4':
      return (
        <AbsoluteFill style={{transform: `scale(${1.06 - 0.06 * e})`}}>
          {children}
          <AbsoluteFill style={{background: '#fff', opacity: 1 - t}} />
        </AbsoluteFill>
      );
    case 'H3':
      return (
        <AbsoluteFill style={{opacity: Math.min(1, t * 2.5)}}>
          {children}
          <AbsoluteFill style={{background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,.9) 50%, transparent 70%)', transform: `translateX(${(t * 2.4 - 1.2) * 100}%)`, mixBlendMode: 'screen'}} />
        </AbsoluteFill>
      );
    case 'H17': {
      // neon flicker: the new scene buzzes on like a neon tube
      const on = [0, 1, 0, 0, 1, 0.4, 1, 0, 1, 1, 1, 1][Math.min(11, Math.floor(f))] ?? 1;
      return (
        <AbsoluteFill style={{opacity: on, filter: on ? `brightness(${1.7 - 0.7 * e}) saturate(1.4)` : undefined}}>
          {children}
          <AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(0deg, ${alpha(b.primary, 0.3)} 0 ${3 * L.u}px, transparent ${3 * L.u}px ${9 * L.u}px)`, opacity: v}} />
        </AbsoluteFill>
      );
    }
    case 'H14':
      // cube spin: the new scene is the cube's right face turning to the front
      return (
        <AbsoluteFill style={{perspective: 1800 * L.u}}>
          <AbsoluteFill style={{transformOrigin: '0% 50%', transform: `translateX(${v * 100}%) rotateY(${v * 90}deg)`, filter: `brightness(${0.55 + 0.45 * e})`}}>{children}</AbsoluteFill>
        </AbsoluteFill>
      );
    case 'H12':
      return <AbsoluteFill style={{clipPath: `circle(${e * 75}% at 50% 50%)`}}>{children}</AbsoluteFill>;
    case 'H6': {
      const x = e * 135 - 15;
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{clipPath: `polygon(0 0, ${x}% 0, ${x - 15}% 100%, 0 100%)`}}>{children}</AbsoluteFill>
          <AbsoluteFill style={{clipPath: `polygon(${x}% 0, ${x + 9}% 0, ${x - 6}% 100%, ${x - 15}% 100%)`, background: b.primary}} />
        </AbsoluteFill>
      );
    }
    case 'H9': {
      const x0 = -0.12 * L.W + e * 1.3 * L.W;
      const jag = tearLine(L.H, x0, 'rip', 26 * L.u, 30 * L.u);
      const clip = `polygon(0 0, ${jag.map(([x, y]) => `${x}px ${y}px`).join(', ')}, 0 ${L.H}px)`;
      const pts = jag.map(([x, y]) => `${x},${y}`).join(' ');
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{clipPath: clip}}>{children}</AbsoluteFill>
          <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
            <polyline points={pts} fill="none" stroke="rgba(0,0,0,.28)" strokeWidth={8 * L.u} transform={`translate(${12 * L.u},0)`} />
            <polyline points={pts} fill="none" stroke="#F4EFE4" strokeWidth={22 * L.u} />
          </svg>
        </AbsoluteFill>
      );
    }
    case 'H2': {
      const k = Math.floor(f / 2);
      const jx = (random(`g${k}`) - 0.5) * 70 * L.u * v;
      const colors = ['#ff004c', '#00e5ff', '#ffffff'];
      return (
        <AbsoluteFill style={{transform: `translateX(${jx}px)`, filter: `hue-rotate(${v * 90}deg) saturate(${1 + v})`}}>
          {children}
          {v > 0.1 &&
            [0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{position: 'absolute', left: 0, right: 0, top: `${random(`gy${k}${i}`) * 100}%`, height: `${2 + random(`gh${k}${i}`) * 8}%`, background: colors[i % 3], mixBlendMode: 'difference', opacity: 0.7 * v, transform: `translateX(${(random(`gx${k}${i}`) - 0.5) * 90 * L.u}px)`}} />
            ))}
        </AbsoluteFill>
      );
    }
    default:
      return <AbsoluteFill>{children}</AbsoluteFill>;
  }
};

/** transitions that also move the OUTGOING scene during the next scene's entry */
export const OUT_TRANSITIONS = new Set(['H14']);

/** wraps the LEAVING scene; `start` = frame where the next scene starts entering */
export const TransitionOut: React.FC<{type?: string; start: number; frames: number; children: React.ReactNode}> = ({type, start, frames, children}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  if (!type || !OUT_TRANSITIONS.has(type) || f < start) return <AbsoluteFill>{children}</AbsoluteFill>;
  const e = Easing.out(Easing.cubic)(Math.min(1, (f - start) / frames));
  // H14: the old face turns away to the left around its right edge
  return (
    <AbsoluteFill style={{perspective: 1800 * L.u}}>
      <AbsoluteFill style={{transformOrigin: '100% 50%', transform: `translateX(${-e * 100}%) rotateY(${-e * 90}deg)`, filter: `brightness(${1 - 0.45 * e})`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
