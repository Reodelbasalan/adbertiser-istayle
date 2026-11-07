import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Pill} from '../lib/Fx';
import {Media, asset} from '../lib/Media';
import {alpha, ease, fitSize, ink, lin, pop, rnd, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {range, txt} from './depth3d';

// Extras: B9 timeline · B18 retro poster · B20 cartoon host · B21 sticker pop · B24 sample montage
//         A14 podcast clip · A22 push-in slide · G10 lower-third name tag · K6 logo animation outro.
type P = Record<string, any>;

/* ---------------- B9 timeline / roadmap ---------------- */

const STEPS = [{date: 'Day 1', label: 'Brief + script'}, {date: 'Day 2', label: 'Shoot'}, {date: 'Day 3', label: 'Edit + captions'}, {date: 'Day 4', label: 'Ads live'}];
export const timelineSteps = (p: P): {date?: string; label: string}[] => (Array.isArray(p.steps) && p.steps.length ? p.steps : STEPS).slice(0, 6);
export const timelineTimes = (n: number, dur: number, fps: number, at?: number[]) => range(n).map((i) => (Array.isArray(at) && typeof at[i] === 'number' ? Math.round(at[i] * fps) : Math.round(fps * 0.3 + (i * (dur - fps * 0.7)) / Math.max(1, n))));

/** B9: a timeline line grows; milestones (date + label) pop as the progress dot reaches them */
export const Timeline: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const steps = timelineSteps(p);
  const ts = timelineTimes(steps.length, dur, L.fps, p.at);
  const n = steps.length;
  const vert = L.portrait;
  const len = vert ? L.H * 0.5 : L.W * 0.8;
  const x0 = vert ? L.W * 0.2 : L.W * 0.1;
  const y0 = vert ? L.H * 0.26 : L.H * 0.55;
  const pos = (i: number) => (n === 1 ? 0 : (i / (n - 1)) * len);
  let cur = -1;
  ts.forEach((t, i) => {
    if (f >= t) cur = i;
  });
  const prog = cur < 0 ? 0 : cur >= n - 1 ? pos(n - 1) : pos(cur) + (pos(cur + 1) - pos(cur)) * ease(f, ts[cur], ts[cur + 1]);
  return (
    <AbsoluteFill style={{background: b.bg}}>
      {txt(p.title, '') && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: vert ? L.H * 0.12 : L.H * 0.12, textAlign: 'center', fontFamily: b.fH, fontSize: Math.min(100 * L.u, fitSize(txt(p.title, ''), L.u, L.portrait, 120)), color: b.text, textTransform: 'uppercase'}}>{txt(p.title, '')}</div>}
      <div style={{position: 'absolute', left: x0, top: y0, width: vert ? 8 * L.u : len, height: vert ? len : 8 * L.u, background: alpha(b.text, 0.15), borderRadius: 4 * L.u}} />
      <div style={{position: 'absolute', left: x0, top: y0, width: vert ? 8 * L.u : prog, height: vert ? prog : 8 * L.u, background: b.primary, borderRadius: 4 * L.u, boxShadow: `0 0 ${16 * L.u}px ${alpha(b.primary, 0.6)}`}} />
      {steps.map((s, i) => {
        const k = pop(f, L.fps, ts[i], 260, 13);
        const done = f >= ts[i];
        const px = vert ? x0 + 4 * L.u : x0 + pos(i);
        const py = vert ? y0 + pos(i) : y0 + 4 * L.u;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: px - 22 * L.u, top: py - 22 * L.u, width: 44 * L.u, height: 44 * L.u, borderRadius: '50%', background: done ? b.primary : b.bg, border: `${5 * L.u}px solid ${done ? b.primary : alpha(b.text, 0.3)}`, boxSizing: 'border-box', transform: `scale(${done ? 0.8 + 0.2 * k : 1})`}} />
            <div style={{position: 'absolute', left: vert ? px + 50 * L.u : px - 160 * L.u, width: vert ? L.W * 0.62 : 320 * L.u, top: vert ? py - 40 * L.u : py + (i % 2 ? 40 : -150) * L.u, textAlign: vert ? 'left' : 'center', opacity: done ? Math.min(1, k * 1.5) : 0.25, transform: `translateX(${(1 - k) * 30 * L.u}px)`}}>
              {s.date && <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: 30 * L.u, color: b.primary, letterSpacing: 2 * L.u, textTransform: 'uppercase'}}>{s.date}</div>}
              <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: 46 * L.u, color: b.text, lineHeight: 1.1}}>{s.label}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- B18 retro poster ---------------- */

/** B18: 70s/Swiss poster: sun circle with stripes, big type, small print, paper grain */
export const RetroPoster: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const title = txt(p.title, 'Summer Sale').toUpperCase();
  const sub = txt(p.sub, 'Nov 20 – 30 · Online only');
  const year = txt(p.year, '2026');
  const cols = ['#E85D3A', '#F2A541', '#F5D06F', '#2F7F79'];
  const R = Math.min(L.W, L.H) * 0.34;
  const cy = L.portrait ? L.H * 0.4 : L.H * 0.42;
  const k = ease(f, 0, 18);
  const size = Math.min(170 * L.u, ((L.W * 0.88) / Math.max(4, title.length)) * 1.65);
  return (
    <AbsoluteFill style={{background: '#F3E9D2', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: L.W / 2 - R, top: cy - R + (1 - k) * 200 * L.u, width: 2 * R, height: 2 * R, borderRadius: '50%', overflow: 'hidden', background: cols[0]}}>
        {range(4).map((i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: R + i * R * 0.22, height: R * 0.12, background: '#F3E9D2'}} />)}
      </div>
      {range(4).map((i) => (
        <div key={i} style={{position: 'absolute', left: -L.W * 0.1, right: -L.W * 0.1, top: cy + R * 0.95 + i * 26 * L.u, height: 22 * L.u, background: cols[i], transform: `translateX(${(1 - ease(f, 4 + i * 3, 16 + i * 3)) * (i % 2 ? 1 : -1) * L.W}px)`}} />
      ))}
      <div style={{position: 'absolute', left: L.pad * 0.6, right: L.pad * 0.6, top: cy + R + 150 * L.u, fontFamily: b.fH, fontSize: size, lineHeight: 0.95, color: '#2A2420', textAlign: 'center', opacity: ease(f, 14, 22)}}>{title}</div>
      <div style={{position: 'absolute', left: L.pad, right: L.pad, top: cy + R + 160 * L.u + size * 1.1, display: 'flex', justifyContent: 'space-between', fontFamily: b.fB, fontWeight: 700, fontSize: 30 * L.u, color: '#2A2420', letterSpacing: 2 * L.u, textTransform: 'uppercase', opacity: ease(f, 20, 28)}}>
        <span>{sub}</span>
        <span>{year}</span>
      </div>
      <AbsoluteFill style={{opacity: 0.18, backgroundImage: 'repeating-radial-gradient(circle at 30% 40%, rgba(0,0,0,.4) 0 1px, transparent 1px 3px)', mixBlendMode: 'multiply'}} />
    </AbsoluteFill>
  );
};

/* ---------------- B20 cartoon host ---------------- */

/** B20: a simple generic cartoon mascot (drawn in code) bobs, blinks and "talks" next to a speech bubble */
export const CartoonHost: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const say = txt(p.say, 'Hi! Tutulungan kita sa ads mo.');
  const color = p.color ?? b.primary;
  const talking = f % 8 < 4 && f > 6;
  const blink = f % 70 > 66;
  const bob = Math.sin(f / 6) * 10 * L.u;
  const S = Math.min(L.W, L.H) * 0.55;
  const bk = pop(f, L.fps, 4, 260, 13);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${alpha(color, 0.25)}, ${b.bg})`}}>
      <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.16 : L.H * 0.1, display: 'flex', justifyContent: 'center', transform: `scale(${bk})`, transformOrigin: '50% 100%'}}>
        <div style={{position: 'relative', background: '#FFFFFF', color: '#111', borderRadius: 40 * L.u, padding: `${30 * L.u}px ${40 * L.u}px`, fontFamily: b.fB, fontWeight: 800, fontSize: Math.min(56 * L.u, ((L.W * 0.75) / Math.max(10, say.length)) * 2.4), textAlign: 'center', boxShadow: '0 12px 30px rgba(0,0,0,.3)', maxWidth: L.W * 0.8}}>
          {say}
          <div style={{position: 'absolute', left: '50%', bottom: -26 * L.u, width: 50 * L.u, height: 50 * L.u, background: '#FFFFFF', transform: 'translateX(-50%) rotate(45deg)'}} />
        </div>
      </div>
      <svg width={S} height={S * 1.2} viewBox="0 0 200 240" style={{position: 'absolute', left: (L.W - S) / 2, top: L.H * 0.4 + bob}}>
        <ellipse cx="100" cy="230" rx="60" ry="8" fill="rgba(0,0,0,.25)" />
        <rect x="45" y="140" width="110" height="90" rx="40" fill={color} />
        <circle cx="100" cy="90" r="70" fill={color} />
        <circle cx="100" cy="90" r="70" fill="url(#hl)" />
        <defs>
          <radialGradient id="hl" cx="35%" cy="30%" r="60%"><stop offset="0%" stopColor="#fff" stopOpacity=".45" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></radialGradient>
        </defs>
        {blink ? (
          <>
            <path d="M68 80 L88 80" stroke="#111" strokeWidth="6" strokeLinecap="round" />
            <path d="M112 80 L132 80" stroke="#111" strokeWidth="6" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="78" cy="80" r="11" fill="#fff" />
            <circle cx="122" cy="80" r="11" fill="#fff" />
            <circle cx="80" cy="82" r="6" fill="#111" />
            <circle cx="124" cy="82" r="6" fill="#111" />
          </>
        )}
        {talking ? <ellipse cx="100" cy="118" rx="18" ry="13" fill="#3A1010" /> : <path d="M84 114 Q100 128 116 114" stroke="#3A1010" strokeWidth="6" fill="none" strokeLinecap="round" />}
        <circle cx="62" cy="104" r="9" fill="#FF8FA3" opacity=".6" />
        <circle cx="138" cy="104" r="9" fill="#FF8FA3" opacity=".6" />
        <path d={`M45 170 Q20 ${150 + Math.sin(f / 5) * 15} 25 ${130 + Math.sin(f / 5) * 15}`} stroke={color} strokeWidth="18" fill="none" strokeLinecap="round" />
      </svg>
      {txt(p.name, '') && <div style={{position: 'absolute', left: 0, right: 0, top: L.H * 0.4 + S * 1.2 + 10 * L.u, display: 'flex', justifyContent: 'center'}}><Pill text={txt(p.name, '')} bg={color} color={ink(color)} size={36 * L.u} font={b.fB} /></div>}
    </AbsoluteFill>
  );
};

/* ---------------- B21 sticker pop ---------------- */

const STICKERS = [{text: 'NEW!', x: 0.22, y: 0.3}, {emoji: '🔥', x: 0.78, y: 0.36}, {text: 'SULIT', x: 0.3, y: 0.66}, {emoji: '💯', x: 0.74, y: 0.62}];
export const stickerList = (p: P): {text?: string; emoji?: string; x: number; y: number}[] => (Array.isArray(p.stickers) && p.stickers.length ? p.stickers : STICKERS).slice(0, 8);

/** B21: die-cut stickers (word badges or emoji) slap onto your footage one by one */
export const StickerPop: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const st = stickerList(p);
  const cols = [b.primary, '#FF5DA2', '#3DD6F5', '#7CFF6B', '#FFFFFF'];
  return (
    <AbsoluteFill>
      <Media src={p.media ?? 'demo:🛍️:300'} zoom="in" />
      {st.map((s, i) => {
        const at = 6 + i * 6;
        if (f < at) return null;
        const k = pop(f, L.fps, at, 420, 12);
        const c = cols[i % cols.length];
        const rot = rnd(`sr${i}`, -14, 14);
        return (
          <div key={i} style={{position: 'absolute', left: s.x * L.W, top: s.y * L.H, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${1.6 - 0.6 * k})`, opacity: Math.min(1, k * 2), filter: `drop-shadow(0 ${6 * L.u}px ${8 * L.u}px rgba(0,0,0,.35))`}}>
            {s.emoji ? (
              <div style={{fontSize: 150 * L.u, lineHeight: 1, filter: `drop-shadow(0 0 0 #fff) drop-shadow(${5 * L.u}px 0 0 #fff) drop-shadow(-${5 * L.u}px 0 0 #fff) drop-shadow(0 ${5 * L.u}px 0 #fff) drop-shadow(0 -${5 * L.u}px 0 #fff)`}}>{s.emoji}</div>
            ) : (
              <div style={{background: c, color: ink(c), fontFamily: b.fH, fontSize: 72 * L.u, padding: `${10 * L.u}px ${30 * L.u}px`, borderRadius: 24 * L.u, border: `${8 * L.u}px solid #FFFFFF`, textTransform: 'uppercase'}}>{s.text}</div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- B24 sample montage ---------------- */

/** B24: a 2x2 (or 3x2) wall of sample clips/photos fills in fast, then pushes in; label on top */
export const SampleMontage: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const media: string[] = (Array.isArray(p.media) && p.media.length ? p.media : ['demo:🍔:20', 'demo:💄:330', 'demo:🏠:120', 'demo:👟:200']).slice(0, 6);
  const label = txt(p.label, 'Sample outputs');
  const cols = 2;
  const rows = Math.ceil(media.length / cols);
  const g = 14 * L.u;
  const push = 1 + 0.08 * ease(f, 20, 60);
  const cw = (L.W - g * (cols + 1)) / cols;
  const ch = (L.H * (L.portrait ? 0.62 : 0.8) - g * (rows + 1)) / rows;
  const top = L.portrait ? L.H * 0.22 : L.H * 0.12;
  return (
    <AbsoluteFill style={{background: '#0B0B0F'}}>
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        {media.map((m, i) => {
          const at = 2 + i * 4;
          const k = pop(f, L.fps, at, 300, 14);
          return (
            <div key={i} style={{position: 'absolute', left: g + (i % cols) * (cw + g), top: top + Math.floor(i / cols) * (ch + g), width: cw, height: ch, borderRadius: 20 * L.u, overflow: 'hidden', transform: `scale(${f >= at ? k : 0})`}}>
              <Media src={m} zoom="in" />
            </div>
          );
        })}
      </AbsoluteFill>
      {label && <div style={{position: 'absolute', left: 0, right: 0, top: L.portrait ? L.H * 0.12 : L.H * 0.03, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, L.fps, 0, 240, 13)})`}}><Pill text={label} bg={b.primary} color={ink(b.primary)} size={48 * L.u} font={b.fH} style={{textTransform: 'uppercase'}} /></div>}
    </AbsoluteFill>
  );
};

/* ---------------- A14 podcast clip ---------------- */

/** A14: podcast-style clip: framed video, live waveform, show name + guest, a pull quote */
export const PodcastClip: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const show = txt(p.show, 'The Ads Talk');
  const guest = txt(p.guest, 'Episode 12');
  const quote = txt(p.quote, '');
  const vw = L.W - 2 * L.pad * 0.6;
  const vh = L.portrait ? vw * 1.0 : L.H * 0.6;
  const top = L.portrait ? L.H * 0.2 : L.H * 0.08;
  return (
    <AbsoluteFill style={{background: '#121218'}}>
      <div style={{position: 'absolute', left: (L.W - vw) / 2, top, width: vw, height: vh, borderRadius: 28 * L.u, overflow: 'hidden', border: `${4 * L.u}px solid ${alpha(b.primary, 0.8)}`}}>
        <Media src={p.media ?? 'demo:🎙️:280'} zoom="in" />
        <div style={{position: 'absolute', left: 20 * L.u, top: 20 * L.u, display: 'flex', alignItems: 'center', gap: 10 * L.u, background: 'rgba(0,0,0,.55)', padding: `${8 * L.u}px ${18 * L.u}px`, borderRadius: 99, fontFamily: b.fB, fontWeight: 800, fontSize: 28 * L.u, color: '#fff'}}>
          <span style={{width: 16 * L.u, height: 16 * L.u, borderRadius: '50%', background: '#FF3B3B', opacity: f % 30 < 18 ? 1 : 0.3}} />
          PODCAST
        </div>
      </div>
      <div style={{position: 'absolute', left: (L.W - vw) / 2, width: vw, top: top + vh + 30 * L.u, display: 'flex', alignItems: 'flex-end', gap: 6 * L.u, height: 90 * L.u}}>
        {range(40).map((i) => {
          const h = 0.2 + Math.abs(Math.sin(f / 3 + i * 0.7) * Math.cos(f / 7 + i * 0.3));
          return <div key={i} style={{flex: 1, height: `${h * 100}%`, background: i < 40 * ((f % 120) / 120) ? b.primary : alpha('#FFFFFF', 0.3), borderRadius: 3 * L.u}} />;
        })}
      </div>
      <div style={{position: 'absolute', left: (L.W - vw) / 2, top: top + vh + 140 * L.u}}>
        <div style={{fontFamily: b.fH, fontSize: 64 * L.u, color: '#fff', textTransform: 'uppercase'}}>{show}</div>
        <div style={{fontFamily: b.fB, fontWeight: 600, fontSize: 34 * L.u, color: alpha('#fff', 0.7)}}>{guest}</div>
      </div>
      {quote && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: top + vh * 0.6, textAlign: 'center', fontFamily: b.fB, fontWeight: 900, fontSize: 58 * L.u, color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,.9)', opacity: ease(f, 8, 16)}}>“{quote}”</div>}
    </AbsoluteFill>
  );
};

/* ---------------- A22 push-in slide ---------------- */

/** A22: clean presentation slide (headline, bullets, optional image); the camera slowly pushes in */
export const PushSlide: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const title = txt(p.title, '3 parte ng panalong ad');
  const bullets: string[] = (Array.isArray(p.bullets) ? p.bullets : ['Hook sa unang 3 segundo', 'Malinaw na offer', 'Isang CTA']).slice(0, 5).map(String);
  const push = lin(f, 0, dur, 1, 1.12);
  return (
    <AbsoluteFill style={{background: '#E9ECF2', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 40%'}}>
        <div style={{position: 'absolute', left: L.pad * 0.6, right: L.pad * 0.6, top: L.portrait ? L.H * 0.18 : L.H * 0.1, bottom: L.portrait ? L.H * 0.22 : L.H * 0.1, background: '#FFFFFF', borderRadius: 20 * L.u, boxShadow: '0 20px 60px rgba(20,30,60,.15)', padding: `${60 * L.u}px ${56 * L.u}px`, boxSizing: 'border-box'}}>
          <div style={{width: 80 * L.u, height: 10 * L.u, background: b.primary, borderRadius: 5 * L.u}} />
          <div style={{marginTop: 26 * L.u, fontFamily: b.fB, fontWeight: 900, fontSize: Math.min(76 * L.u, fitSize(title, L.u, L.portrait, 96)), color: '#14182A', lineHeight: 1.1}}>{title}</div>
          <div style={{marginTop: 40 * L.u, display: 'flex', flexDirection: 'column', gap: 26 * L.u}}>
            {bullets.map((t, i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22 * L.u, opacity: ease(f, 8 + i * 8, 16 + i * 8), transform: `translateX(${(1 - ease(f, 8 + i * 8, 16 + i * 8)) * 30 * L.u}px)`}}>
                <div style={{width: 46 * L.u, height: 46 * L.u, borderRadius: '50%', background: b.primary, color: ink(b.primary), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: b.fB, fontWeight: 900, fontSize: 26 * L.u, flexShrink: 0}}>{i + 1}</div>
                <div style={{fontFamily: b.fB, fontWeight: 600, fontSize: 44 * L.u, color: '#2A3048'}}>{t}</div>
              </div>
            ))}
          </div>
          {p.image && <Img src={asset(p.image)} style={{position: 'absolute', right: 40 * L.u, bottom: 40 * L.u, width: '40%', borderRadius: 16 * L.u}} />}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- G10 lower-third name tag ---------------- */

/** G10: footage with a lower-third name tag (name + role) that slides in and out */
export const LowerThird: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const name = txt(p.name, 'Juan Dela Cruz');
  const role = txt(p.role, 'Owner, Sample Shop');
  const inK = ease(f, 6, 18);
  const outK = ease(f, dur - 14, dur - 4);
  const x = (1 - inK + outK) * -L.W;
  return (
    <AbsoluteFill>
      <Media src={p.media ?? 'demo:🧑‍💼:200'} zoom="in" />
      <div style={{position: 'absolute', left: L.pad * 0.6, top: L.portrait ? L.H * 0.64 : L.H * 0.74, transform: `translateX(${x}px)`}}>
        <div style={{display: 'flex', alignItems: 'stretch'}}>
          <div style={{width: 14 * L.u, background: b.primary}} />
          <div style={{background: 'rgba(10,10,14,.85)', padding: `${16 * L.u}px ${30 * L.u}px`}}>
            <div style={{fontFamily: b.fB, fontWeight: 900, fontSize: 52 * L.u, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{name}</div>
            <div style={{fontFamily: b.fB, fontWeight: 600, fontSize: 32 * L.u, color: alpha('#FFFFFF', 0.75), whiteSpace: 'nowrap'}}>{role}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- K6 logo animation outro ---------------- */

/** K6: logo (or name) builds itself: ring draws, mark pops, letters drop in, tagline fades */
export const LogoOutro: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const logo: string | undefined = p.logo ?? b.logo;
  const name = txt(p.name, b.name);
  const tagline = txt(p.tagline, '');
  const R = Math.min(L.W, L.H) * 0.18;
  const ring = ease(f, 0, 16);
  const mk = pop(f, L.fps, 12, 300, 11);
  const cy = L.H * 0.42;
  const letters = name.split('');
  const fs = Math.min(110 * L.u, ((L.W * 0.86) / Math.max(4, name.length)) * 1.6);
  return (
    <AbsoluteFill style={{background: b.bg}}>
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
        <circle cx={L.W / 2} cy={cy} r={R} fill="none" stroke={b.primary} strokeWidth={10 * L.u} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring} transform={`rotate(-90 ${L.W / 2} ${cy})`} />
      </svg>
      <div style={{position: 'absolute', left: L.W / 2 - R * 0.75, top: cy - R * 0.75, width: R * 1.5, height: R * 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${mk})`}}>
        {logo ? <Img src={asset(logo)} style={{width: '100%', height: '100%', objectFit: 'contain'}} /> : <div style={{fontFamily: b.fH, fontSize: R * 1.1, color: b.primary}}>{name.charAt(0)}</div>}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: cy + R + 50 * L.u, display: 'flex', justifyContent: 'center'}}>
        {letters.map((ch, i) => {
          const k = pop(f, L.fps, 18 + i * 2, 300, 12);
          return <span key={i} style={{fontFamily: b.fH, fontSize: fs, color: b.text, display: 'inline-block', whiteSpace: 'pre', transform: `translateY(${(1 - k) * -80 * L.u}px)`, opacity: f >= 18 + i * 2 ? 1 : 0, textTransform: 'uppercase'}}>{ch}</span>;
        })}
      </div>
      {tagline && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: cy + R + 70 * L.u + fs, textAlign: 'center', fontFamily: b.fB, fontWeight: 600, fontSize: 40 * L.u, color: alpha(b.text, 0.75), opacity: ease(f, 18 + letters.length * 2 + 4, 18 + letters.length * 2 + 12)}}>{tagline}</div>}
    </AbsoluteFill>
  );
};
