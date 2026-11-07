import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Glow, Pill} from '../lib/Fx';
import {Media, Placeholder, Thing, asset, isVideo, parseDemo} from '../lib/Media';
import {alpha, ease, fitSize, ink, lin, pop, shake, useLayout} from '../lib/util';
import type {SceneProps} from '../types';

// Ad-format pack: A5 A8 A17 A18 A20 J11 K2 K3. Timing helpers are exported so registry.ts can put SFX on the same frames.
type P = Record<string, any>;
const RED = '#E5484D';
const GREEN = '#22B573';
const range = (k: number) => Array.from({length: Math.max(0, k)}, (_, i) => i);
const off = (v: unknown) => v === false || v === '';
const txt = (v: unknown, d: string) => (off(v) ? '' : typeof v === 'string' || typeof v === 'number' ? String(v) : d);

/** photo/clip that fills its box, with a movable focus point (scrolls tall screenshots) */
const Pic: React.FC<{src?: string; pos?: string; style?: React.CSSProperties}> = ({src, pos = '50% 50%', style}) => {
  const demo = parseDemo(src);
  const fill: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos};
  return (
    <AbsoluteFill style={{overflow: 'hidden', ...style}}>
      {demo ? <Placeholder {...demo} /> : !src ? <Placeholder emoji="🎬" hue={220} /> : isVideo(src) ? <OffthreadVideo src={asset(src)} muted style={fill} /> : <Img src={asset(src)} style={fill} />}
    </AbsoluteFill>
  );
};

/** hand-drawn X or check; k = 0→1 draw progress; disc = white mark on a colored circle */
export const Mark: React.FC<{kind: 'x' | 'check'; size: number; k: number; color?: string; stroke?: number; disc?: boolean}> = ({kind, size, k, color, stroke, disc}) => {
  const c = color ?? (kind === 'x' ? RED : GREEN);
  const paths = kind === 'x' ? ['M27 27 L73 73', 'M73 27 L27 73'] : ['M24 53 L43 71 L77 31'];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', display: 'block'}}>
      {disc && <circle cx="50" cy="50" r="48" fill={c} />}
      {paths.map((d, i) => {
        const kk = kind === 'x' ? Math.max(0, Math.min(1, (k - i * 0.5) * 2)) : k;
        return (
          <path key={i} d={d} pathLength={1} fill="none" stroke={disc ? '#fff' : c} strokeWidth={stroke ?? (disc ? 11 : 14)} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - kk} opacity={kk > 0 ? 1 : 0} />
        );
      })}
    </svg>
  );
};

/* ---------------- A5 green screen reaction ---------------- */

/** A5: a cut-out person in front of a post / website / article screenshot (scrolls slowly) */
export const GreenScreen: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const right = p.side === 'right';
  const src: string = p.bg ?? 'demo:📰:210';
  const title = txt(p.title, 'Nakita mo na ba ’to?');
  const cardIn = pop(f, L.fps, 0, 180, 15);
  const subIn = pop(f, L.fps, 6, 170, 14);
  const y = p.scroll === false ? 50 : lin(f, 0, dur, 0, 100);
  const bob = Math.sin(f / (L.fps * 0.45)) * 5 * L.u;
  const cw = L.portrait ? L.W - L.pad * 1.2 : L.W * 0.58;
  const cx = L.portrait ? (L.W - cw) / 2 : right ? L.W * 0.05 : L.W * 0.37;
  const ct = L.portrait ? L.H * 0.21 : L.H * 0.14;
  const ch = L.portrait ? L.H * 0.43 : L.H * 0.74;
  const sH = L.portrait ? L.H * 0.5 : L.H * 0.86;
  const sW = sH * 0.8;
  const full = p.frame === 'full';
  return (
    <AbsoluteFill style={{background: b.bg}}>
      {full ? (
        <Pic src={src} pos={`50% ${y}%`} />
      ) : (
        <>
          <Media src={src} zoom="none" blur={40 * L.u} dim={0.6} />
          <div style={{position: 'absolute', left: cx, top: ct, width: cw, height: ch, borderRadius: 28 * L.u, overflow: 'hidden', border: `${5 * L.u}px solid rgba(255,255,255,.92)`, boxShadow: '0 30px 80px rgba(0,0,0,.6)', opacity: Math.min(1, cardIn * 1.6), transform: `translateY(${(1 - cardIn) * 90 * L.u}px) scale(${0.9 + 0.1 * cardIn}) rotate(${right ? 1.2 : -1.2}deg)`}}>
            <Pic src={src} pos={`50% ${y}%`} />
          </div>
        </>
      )}
      {title && (
        <div style={{position: 'absolute', left: cx, width: cw, top: ct - 58 * L.u, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, L.fps, 9, 260, 12)})`}}>
          <Pill text={title} bg={b.primary} color={ink(b.primary)} size={50 * L.u} font={b.fH} style={{whiteSpace: 'normal', textAlign: 'center', maxWidth: cw, boxShadow: '0 10px 30px rgba(0,0,0,.45)', textTransform: 'uppercase'}} />
        </div>
      )}
      <div style={{position: 'absolute', bottom: 0, [right ? 'right' : 'left']: -sW * 0.06, width: sW, height: sH, transform: `translateY(${(1 - subIn) * sH * 0.7 + bob}px)`}}>
        <Thing src={p.subject ?? 'demo:🙋'} size={sH} style={{width: sW, height: sH, objectPosition: right ? 'right bottom' : 'left bottom', filter: 'drop-shadow(0 0 28px rgba(0,0,0,.55))'}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- A8 split-screen dialogue ---------------- */

const DIALOG = [
  {who: 0, text: 'Magkano po ito?'},
  {who: 1, text: '₱499 lang po, free delivery!'},
  {who: 0, text: 'Sige, order na ako!'},
];
export const dialogLines = (p: P): {who: number; text: string; at?: number}[] => (Array.isArray(p.lines) && p.lines.length ? p.lines : DIALOG).map((l: any) => ({who: l.who ? 1 : 0, text: String(l.text ?? ''), at: typeof l.at === 'number' ? l.at : undefined}));
export const dialogTimes = (k: number, dur: number, fps: number) => {
  const start = Math.round(fps * 0.25);
  const gap = Math.max(8, (dur - start - fps * 0.4) / Math.max(1, k));
  return range(k).map((i) => Math.round(start + i * gap));
};
/** frame each line pops: its own `at` (seconds) or evenly spread */
export const dialogAt = (p: P, dur: number, fps: number) => {
  const ls = dialogLines(p);
  const def = dialogTimes(ls.length, dur, fps);
  return ls.map((l, i) => (l.at != null ? Math.round(l.at * fps) : def[i]));
};

/** A8: two people stacked (9:16) or side by side; the speaker's line pops as a bubble, the listener dims */
export const SplitDialogue: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const names: string[] = Array.isArray(p.names) ? p.names : ['Customer', 'Seller'];
  const lines = dialogLines(p);
  const ts = dialogAt(p, dur, L.fps);
  let cur = -1;
  ts.forEach((t, i) => {
    if (f >= t) cur = i;
  });
  const who = cur >= 0 ? lines[cur].who : -1;
  const vert = L.portrait;
  const panel = (i: 0 | 1) => {
    const k = ease(f, i * 3, i * 3 + 10);
    const box: React.CSSProperties = vert ? {left: 0, width: L.W, top: i ? L.H / 2 : 0, height: L.H / 2} : {top: 0, height: L.H, left: i ? L.W / 2 : 0, width: L.W / 2};
    const tr = vert ? `translateX(${(1 - k) * (i ? 1 : -1) * L.W}px)` : `translateY(${(1 - k) * (i ? 1 : -1) * L.H}px)`;
    const name = names[i];
    const tag: React.CSSProperties = vert ? (i ? {top: 34 * L.u, right: 34 * L.u} : {top: L.H * 0.13, left: 34 * L.u}) : {top: L.H * 0.1, left: 34 * L.u};
    return (
      <div key={i} style={{position: 'absolute', ...box, overflow: 'hidden', transform: tr}}>
        <Media src={i ? p.b ?? 'demo:🧑‍🍳:30' : p.a ?? 'demo:🙋:200'} zoom={i ? 'out' : 'in'} dim={who === -1 || who === i ? 0.05 : 0.5} />
        {name && (
          <div style={{position: 'absolute', ...tag}}>
            <Pill text={name} bg={i ? b.primary : '#FFFFFF'} color={i ? ink(b.primary) : '#111'} size={38 * L.u} font={b.fB} style={{boxShadow: '0 6px 18px rgba(0,0,0,.4)'}} />
          </div>
        )}
      </div>
    );
  };
  const line = cur >= 0 ? lines[cur] : null;
  const k = cur >= 0 ? pop(f, L.fps, ts[cur], 280, 15) : 0;
  const i = line?.who ?? 0;
  const pos: React.CSSProperties = vert ? (i ? {top: L.H / 2 + 120 * L.u} : {bottom: L.H / 2 + 46 * L.u}) : {top: L.H * 0.6};
  const side: React.CSSProperties = vert ? {left: L.pad * 0.7, right: L.pad * 0.7} : i ? {left: L.W / 2 + L.pad * 0.6, right: L.pad * 0.6} : {left: L.pad * 0.6, right: L.W / 2 + L.pad * 0.6};
  const fs = Math.min(64 * L.u, fitSize(line?.text ?? '', L.u, L.portrait, 92));
  return (
    <AbsoluteFill style={{background: b.bg}}>
      {panel(0)}
      {panel(1)}
      <div style={{position: 'absolute', background: b.primary, ...(vert ? {left: 0, right: 0, top: L.H / 2 - 5 * L.u, height: 10 * L.u} : {top: 0, bottom: 0, left: L.W / 2 - 5 * L.u, width: 10 * L.u}), transform: vert ? `scaleX(${ease(f, 4, 14)})` : `scaleY(${ease(f, 4, 14)})`}} />
      {line && line.text && (
        <div style={{position: 'absolute', ...pos, ...side, display: 'flex', justifyContent: i ? 'flex-end' : 'flex-start'}}>
          <div
            style={{
              maxWidth: '86%',
              background: i ? b.primary : '#FFFFFF',
              color: i ? ink(b.primary) : '#111111',
              fontFamily: b.fB,
              fontWeight: 800,
              fontSize: fs,
              lineHeight: 1.18,
              padding: `${24 * L.u}px ${36 * L.u}px`,
              borderRadius: 40 * L.u,
              ...(vert ? (i ? {borderBottomRightRadius: 8 * L.u} : {borderTopLeftRadius: 8 * L.u}) : {borderTopLeftRadius: 8 * L.u}),
              boxShadow: '0 14px 40px rgba(0,0,0,.45)',
              transform: `scale(${k})`,
              transformOrigin: i ? 'right top' : 'left bottom',
            }}
          >
            {line.text}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- A17 myth vs fact ---------------- */

export const mythTimes = (p: P, dur: number, fps: number) => {
  const flip = Math.round(p.flipAt != null ? p.flipAt * fps : dur * 0.48);
  return {xAt: Math.round(Math.max(fps * 0.45, flip - fps * 0.6)), flip, checkAt: flip + Math.round(fps * 0.3)};
};

/** A17: MYTH card gets a red X, flips over to the FACT with a green check */
export const MythFact: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const {xAt, flip, checkAt} = mythTimes(p, dur, L.fps);
  const labels: string[] = Array.isArray(p.labels) ? p.labels : ['MYTH', 'FACT'];
  const isFact = f >= flip;
  const rot = !isFact ? lin(f, flip - 6, flip, 0, 90) : lin(f, flip, flip + 7, -90, 0);
  const inK = pop(f, L.fps, 0, 200, 15);
  const c = isFact ? GREEN : RED;
  const text = isFact ? txt(p.fact, 'Phone lang + tamang hook, pwede na') : txt(p.myth, 'Kailangan ng mahal na camera para sa magandang ad');
  const xk = ease(f, xAt, xAt + 8);
  const sh = shake(f, xAt + 3, 8, 14 * L.u);
  const cw = L.portrait ? L.W - 2 * L.pad : L.W * 0.62;
  const chh = L.portrait ? 660 * L.u : L.H * 0.66;
  const left = (L.W - cw) / 2;
  const top = L.mid - chh / 2;
  return (
    <AbsoluteFill style={{background: b.bg}}>
      {p.media ? <Media src={p.media} dim={0.62} /> : <Glow color={c} strength={0.3} y="48%" />}
      <div style={{position: 'absolute', left, top, width: cw, height: chh, perspective: 2200 * L.u, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        <div
          style={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            transform: `rotateY(${rot}deg) scale(${0.85 + 0.15 * inK})`,
            opacity: Math.min(1, inK * 1.5),
            borderRadius: 36 * L.u,
            background: isFact ? '#FFFFFF' : '#17171D',
            border: `${6 * L.u}px solid ${c}`,
            boxShadow: `0 0 ${70 * L.u}px ${alpha(c, 0.45)}, 0 30px 70px rgba(0,0,0,.5)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 36 * L.u,
            padding: 64 * L.u,
          }}
        >
          <Pill text={isFact ? labels[1] ?? 'FACT' : labels[0] ?? 'MYTH'} bg={c} color="#FFFFFF" size={54 * L.u} font={b.fH} style={{letterSpacing: 8 * L.u}} />
          <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: fitSize(text, L.u, L.portrait, 122), lineHeight: 1.16, textAlign: 'center', color: isFact ? '#111111' : '#FFFFFF', opacity: isFact ? 1 : 1 - 0.45 * xk}}>{text}</div>
        </div>
        {!isFact && f >= xAt && (
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotateY(${rot}deg)`}}>
            <Mark kind="x" size={chh * 0.78} k={xk} stroke={11} />
          </div>
        )}
        {isFact && (
          <div style={{position: 'absolute', right: -24 * L.u, top: -70 * L.u, transform: `scale(${pop(f, L.fps, checkAt, 320, 12)})`}}>
            <Mark kind="check" size={200 * L.u} k={ease(f, checkAt, checkAt + 9)} disc />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- A18 us vs them ---------------- */

const ROWS = ['Mabilis mag-reply', 'Libre ang revisions', 'Fixed price, walang hidden fee', 'May sample bago magbayad'];
export const vsRows = (p: P): {label: string; them: boolean | string; us: boolean | string; at?: number}[] =>
  (Array.isArray(p.rows) && p.rows.length ? p.rows : ROWS).map((r: any) => (typeof r === 'string' ? {label: r, them: false, us: true} : {label: String(r.label ?? ''), them: r.them ?? false, us: r.us ?? true, at: typeof r.at === 'number' ? r.at : undefined}));
export const rowTimes = (k: number, dur: number, fps: number) => {
  const start = Math.round(fps * 0.45);
  const gap = Math.max(8, Math.min(fps * 0.7, (dur - start - fps * 0.7) / Math.max(1, k)));
  return range(k).map((i) => Math.round(start + i * gap));
};
export const vsAt = (p: P, dur: number, fps: number) => {
  const rs = vsRows(p);
  const def = rowTimes(rs.length, dur, fps);
  return rs.map((r, i) => (r.at != null ? Math.round(r.at * fps) : def[i]));
};

/** A18: generic "others vs us" table; rows tick in (others ✗, us ✓). Never name a real competitor. */
export const UsVsThem: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const rows = vsRows(p);
  const ts = vsAt(p, dur, L.fps);
  const title = txt(p.title, 'Bakit kami?');
  const us = txt(p.us, b.name === 'YOUR BRAND' ? 'US' : b.name);
  const them = txt(p.them, 'OTHERS');
  const tw = L.portrait ? L.W - L.pad * 1.2 : L.W * 0.7;
  const tl = (L.W - tw) / 2;
  const colL = tw * 0.46;
  const colW = tw * 0.27;
  const hh = 130 * L.u;
  const rh = Math.min(160 * L.u, ((L.portrait ? L.H * 0.44 : L.H * 0.56) - hh) / Math.max(1, rows.length));
  const th = hh + rh * rows.length;
  const top = L.mid - th / 2 + (title ? 50 * L.u : 0);
  const colIn = pop(f, L.fps, 4, 220, 15);
  const cell = (v: boolean | string, at: number, mine: boolean) => {
    const k = pop(f, L.fps, at, 320, 13);
    if (typeof v === 'string')
      return <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: 40 * L.u, color: mine ? b.text : alpha(b.text, 0.6), transform: `scale(${k})`, textAlign: 'center'}}>{v}</div>;
    return (
      <div style={{transform: `scale(${k})`}}>
        <Mark kind={v ? 'check' : 'x'} size={(mine ? 86 : 70) * L.u} k={ease(f, at, at + 7)} disc color={v ? GREEN : mine ? RED : '#5A5A66'} />
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: b.bg}}>
      {p.media && <Media src={p.media} dim={0.72} blur={10 * L.u} />}
      <Glow color={b.primary} strength={0.18} x="70%" y="50%" />
      {title && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: top - 170 * L.u, textAlign: 'center', fontFamily: b.fH, fontSize: Math.min(120 * L.u, fitSize(title, L.u, L.portrait, 140)), color: b.text, textTransform: 'uppercase', lineHeight: 1, transform: `scale(${pop(f, L.fps, 0, 240, 13)})`}}>
          {title}
        </div>
      )}
      <div style={{position: 'absolute', left: tl + colL + colW, top: top - 14 * L.u, width: colW, height: th + 28 * L.u, borderRadius: 28 * L.u, background: alpha(b.primary, 0.14), border: `${4 * L.u}px solid ${b.primary}`, boxShadow: `0 0 ${50 * L.u}px ${alpha(b.primary, 0.35)}`, transform: `scaleY(${colIn})`, transformOrigin: 'top'}} />
      <div style={{position: 'absolute', left: tl, top, width: tw, height: hh, display: 'flex', alignItems: 'center'}}>
        <div style={{width: colL}} />
        <div style={{width: colW, textAlign: 'center', fontFamily: b.fH, fontSize: 46 * L.u, color: alpha(b.text, 0.55), textTransform: 'uppercase', opacity: ease(f, 2, 10)}}>{them}</div>
        <div style={{width: colW, display: 'flex', justifyContent: 'center', transform: `scale(${colIn})`}}>
          <Pill text={us} bg={b.primary} color={ink(b.primary)} size={Math.min(46 * L.u, (colW * 1.25) / Math.max(2, us.length))} font={b.fH} style={{textTransform: 'uppercase'}} />
        </div>
      </div>
      {rows.map((r, i) => {
        const t = ts[i];
        const k = ease(f, t, t + 7);
        return (
          <div key={i} style={{position: 'absolute', left: tl, top: top + hh + i * rh, width: tw, height: rh, display: 'flex', alignItems: 'center', borderTop: `${2 * L.u}px solid ${alpha(b.text, 0.12)}`}}>
            <div style={{width: colL, paddingLeft: 12 * L.u, paddingRight: 16 * L.u, boxSizing: 'border-box', fontFamily: b.fB, fontWeight: 800, fontSize: 42 * L.u, lineHeight: 1.12, color: b.text, opacity: k, transform: `translateX(${(1 - k) * -40 * L.u}px)`}}>{r.label}</div>
            <div style={{width: colW, display: 'flex', justifyContent: 'center'}}>{cell(r.them, t + 4, false)}</div>
            <div style={{width: colW, display: 'flex', justifyContent: 'center'}}>{cell(r.us, t + 9, true)}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- A20 slots / deadline counter ---------------- */

export const slotTimes = (p: P, dur: number, fps: number) => {
  const from = Math.max(0, Math.round(Number(p.from ?? 10)));
  const to = Math.max(0, Math.min(from, Math.round(Number(p.to ?? 3))));
  const steps = from - to;
  const start = Math.round(fps * 0.4);
  const span = Math.min(steps * fps * 0.16, dur * 0.55);
  const ticks = range(steps).map((i) => Math.round(start + ((i + 1) * span) / Math.max(1, steps)));
  return {from, to, ticks, end: Math.round(start + span)};
};
const toSecs = (s: unknown) => {
  const parts = String(s ?? '02:00:00').split(':').map((x) => Number(x) || 0);
  return parts.reduce((a, v) => a * 60 + v, 0);
};
const two = (n: number) => String(n).padStart(2, '0');

/** A20: slots left counting down to the real number (or a deadline timer). Use only true numbers. */
export const SlotsCounter: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const timer = p.mode === 'timer';
  const title = txt(p.title, '');
  const note = txt(p.note, '');
  const label = txt(p.label, timer ? 'PROMO ENDS IN' : 'SLOTS LEFT');
  const {from, to, ticks, end} = slotTimes(p, dur, L.fps);
  const passed = ticks.filter((t) => f >= t).length;
  const count = from - passed;
  const lastTick = ticks.filter((t) => f >= t).pop();
  const bump = lastTick != null ? 1 + 0.12 * (1 - ease(f, lastTick, lastTick + 6)) : 1;
  const hit = !timer && ticks.length ? pop(f, L.fps, end, 300, 10) : 0;
  const sh = timer ? {x: 0, y: 0} : shake(f, end, 9, 16 * L.u);
  const total = Math.max(1, Math.min(30, Math.round(Number(p.total ?? from))));
  const cols = total <= 5 ? total : total <= 20 ? 5 : 10;
  const gridW = L.portrait ? L.W - 2 * L.pad : L.W * 0.5;
  const box = Math.min(150 * L.u, gridW / cols - 18 * L.u);
  const labelTop = L.portrait ? L.top + (title ? 70 * L.u : 0) : L.H * 0.12;
  const numSize = L.portrait ? 380 * L.u : 300 * L.u;
  const secs = Math.max(0, toSecs(p.time) - Math.floor(f / L.fps));
  const hms = [Math.floor(secs / 3600), Math.floor((secs % 3600) / 60), secs % 60];
  return (
    <AbsoluteFill style={{background: b.bg, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      {p.media && <Media src={p.media} dim={0.7} />}
      <Glow color={timer ? RED : b.primary} strength={0.28} y="40%" />
      {title && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: labelTop - 110 * L.u, textAlign: 'center', fontFamily: b.fH, fontSize: Math.min(90 * L.u, fitSize(title, L.u, L.portrait, 120)), color: b.text, textTransform: 'uppercase', lineHeight: 1, opacity: ease(f, 0, 8)}}>{title}</div>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: labelTop, display: 'flex', justifyContent: 'center', transform: `scale(${pop(f, L.fps, 0, 260, 13)})`}}>
        <Pill text={label} bg={timer ? RED : b.primary} color={timer ? '#FFFFFF' : ink(b.primary)} size={50 * L.u} font={b.fH} style={{letterSpacing: 6 * L.u}} />
      </div>
      {!timer ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: labelTop + 90 * L.u, textAlign: 'center', fontFamily: b.fH, fontSize: numSize, lineHeight: 1, color: b.primary, textShadow: `0 0 ${60 * L.u}px ${alpha(b.primary, 0.5)}`, transform: `scale(${bump * (1 + 0.1 * hit * (1 - ease(f, end + 4, end + 16)))})`}}>{count}</div>
          <div style={{position: 'absolute', left: (L.W - gridW) / 2, width: gridW, top: labelTop + 110 * L.u + numSize, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18 * L.u}}>
            {range(total).map((i) => {
              const takenAt = i < total - from ? -1 : ticks[i - (total - from)];
              const taken = takenAt != null && f >= takenAt;
              const k = takenAt != null && takenAt >= 0 ? pop(f, L.fps, takenAt, 360, 12) : 1;
              const open = !taken;
              const blink = open && f >= end ? 0.75 + 0.25 * Math.sin((f - end) / 3) : 1;
              return (
                <div key={i} style={{width: box, height: box, borderRadius: 22 * L.u, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: ease(f, 2 + i, 8 + i) * blink, background: open ? alpha(b.primary, 0.16) : '#2A2A33', border: `${4 * L.u}px solid ${open ? b.primary : '#3A3A44'}`, boxShadow: open ? `0 0 ${24 * L.u}px ${alpha(b.primary, 0.4)}` : 'none', transform: `scale(${taken ? 0.9 + 0.1 * k : 1})`}}>
                  {taken && <Mark kind="x" size={box * 0.62} k={1} color="#6A6A76" stroke={12} />}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{position: 'absolute', left: 0, right: 0, top: labelTop + 150 * L.u, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 14 * L.u}}>
          {hms.map((v, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div style={{fontFamily: b.fH, fontSize: 170 * L.u, color: RED, lineHeight: 1.1, opacity: f % L.fps < L.fps / 2 ? 1 : 0.35}}>:</div>}
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 * L.u}}>
                <div style={{width: 250 * L.u, height: 250 * L.u, borderRadius: 30 * L.u, background: '#17171D', border: `${4 * L.u}px solid ${alpha(RED, 0.6)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: b.fH, fontSize: 170 * L.u, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums', boxShadow: `0 0 ${40 * L.u}px ${alpha(RED, 0.3)}`}}>{two(v)}</div>
                <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: 32 * L.u, color: alpha(b.text, 0.7), letterSpacing: 4 * L.u}}>{['HRS', 'MINS', 'SECS'][i]}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
      {note && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.bottom - 70 * L.u : L.H * 0.86, textAlign: 'center', fontFamily: b.fB, fontWeight: 700, fontSize: 42 * L.u, color: alpha(b.text, 0.85), opacity: ease(f, L.fps * 0.6, L.fps * 0.9)}}>{note}</div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- J11 old way vs new way ---------------- */

export const oldNewTimes = (dur: number, fps: number, at?: number) => {
  const newAt = Math.round(typeof at === 'number' ? at * fps : Math.min(fps * 1.0, dur * 0.35));
  return {xAt: Math.round(fps * 0.45), newAt, checkAt: newAt + Math.round(fps * 0.35)};
};

/** J11: old way (grey, ✗) on top, new way (color, ✓) wipes in below; side by side on 16:9 */
export const OldVsNew: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const {xAt, newAt, checkAt} = oldNewTimes(dur, L.fps, p.newAt);
  const labels: string[] = Array.isArray(p.labels) ? p.labels : ['OLD WAY', 'NEW WAY'];
  const vert = L.portrait;
  const half = (i: 0 | 1) => {
    const mine = i === 1;
    const text = mine ? txt(p.newText, 'AI workflow: 15 minutes') : txt(p.oldText, 'Edit 3 hours per video');
    const k = mine ? ease(f, newAt, newAt + 9) : ease(f, 0, 8);
    const box: React.CSSProperties = vert ? {left: 0, width: L.W, top: i ? L.H / 2 : 0, height: L.H / 2} : {top: 0, height: L.H, left: i ? L.W / 2 : 0, width: L.W / 2};
    const clip = mine ? `inset(0 0 0 ${(1 - k) * 100}%)` : `inset(0 ${(1 - k) * 100}% 0 0)`;
    const markAt = mine ? checkAt : xAt;
    const tb: React.CSSProperties = vert ? (mine ? {top: 60 * L.u} : {bottom: 60 * L.u}) : {bottom: L.H * 0.16};
    const fs = Math.min(96 * L.u, fitSize(text, L.u, L.portrait, 130));
    return (
      <div key={i} style={{position: 'absolute', ...box, overflow: 'hidden', clipPath: clip}}>
        <div style={{position: 'absolute', inset: 0, filter: mine ? 'saturate(1.25)' : 'grayscale(1) contrast(.9)'}}>
          <Media src={mine ? p.newMedia ?? 'demo:🚀:140' : p.oldMedia ?? 'demo:😩:0'} zoom={mine ? 'in' : 'none'} dim={mine ? 0.25 : 0.45} punchAt={mine ? newAt : undefined} />
        </div>
        <div style={{position: 'absolute', left: L.pad * 0.7, right: L.pad * 0.7, ...tb, display: 'flex', flexDirection: 'column', alignItems: vert ? 'center' : 'flex-start', gap: 18 * L.u}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16 * L.u}}>
            <Pill text={labels[i] ?? ''} bg={mine ? b.primary : '#3A3A44'} color={mine ? ink(b.primary) : '#FFFFFF'} size={44 * L.u} font={b.fH} style={{letterSpacing: 5 * L.u}} />
            <div style={{transform: `scale(${pop(f, L.fps, markAt, 320, 12)})`}}>
              <Mark kind={mine ? 'check' : 'x'} size={84 * L.u} k={ease(f, markAt, markAt + 7)} disc />
            </div>
          </div>
          {text && <div style={{fontFamily: b.fH, fontSize: fs, lineHeight: 1.02, color: '#FFFFFF', textTransform: 'uppercase', textAlign: vert ? 'center' : 'left', textShadow: '0 6px 24px rgba(0,0,0,.7)', opacity: mine ? ease(f, newAt + 4, newAt + 10) : ease(f, 4, 10)}}>{text}</div>}
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: b.bg}}>
      {half(0)}
      {half(1)}
      <div style={{position: 'absolute', background: b.primary, ...(vert ? {left: 0, right: 0, top: L.H / 2 - 6 * L.u, height: 12 * L.u} : {top: 0, bottom: 0, left: L.W / 2 - 6 * L.u, width: 12 * L.u}), transform: vert ? `scaleX(${ease(f, newAt - 4, newAt + 6)})` : `scaleY(${ease(f, newAt - 4, newAt + 6)})`, boxShadow: `0 0 ${30 * L.u}px ${alpha(b.primary, 0.6)}`}} />
    </AbsoluteFill>
  );
};

/* ---------------- K2 comment keyword CTA ---------------- */

export const commentTimes = (p: P, dur: number, fps: number) => {
  const kw = txt(p.keyword, 'GUIDE');
  const typeAt = Math.round(fps * 0.7);
  const perChar = Math.max(1, Math.min(3, Math.floor((dur * 0.45 - typeAt) / Math.max(1, kw.length))));
  const sendAt = typeAt + kw.length * perChar + 6;
  return {kw, typeAt, perChar, sendAt, postAt: sendAt + 5};
};

const Send: React.FC<{size: number; color: string; fill: string}> = ({size, color, fill}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block'}}>
    <circle cx="50" cy="50" r="50" fill={fill} />
    <path d="M30 28 L76 50 L30 72 L38 50 Z" fill={color} />
  </svg>
);

/** K2: "COMMENT <KEYWORD>" + arrow; the word gets typed into a generic comment box and posted */
export const CommentKeyword: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const {kw, typeAt, perChar, sendAt, postAt} = commentTimes(p, dur, L.fps);
  const lead = txt(p.text, 'Comment');
  const sub = txt(p.sub, 'at isesend namin sa’yo ang free guide');
  const word = kw.toUpperCase();
  const ks = Math.min(210 * L.u, ((L.W - 2 * L.pad) / Math.max(3, word.length)) * 1.45);
  const slam = pop(f, L.fps, 5, 330, 12);
  const sh = shake(f, 7, 8, 12 * L.u);
  const typed = f < typeAt ? '' : f >= sendAt ? '' : kw.slice(0, Math.min(kw.length, Math.floor((f - typeAt) / perChar) + 1));
  const sendK = f >= sendAt ? 1 + 0.25 * (1 - ease(f, sendAt, sendAt + 6)) : 1 + 0.06 * Math.sin(f / 4) * (f > typeAt ? 1 : 0);
  const post = pop(f, L.fps, postAt, 240, 14);
  const fieldH = 116 * L.u;
  const fieldW = L.portrait ? L.W - 1.4 * L.pad : L.W * 0.5;
  const fx = (L.W - fieldW) / 2;
  const fieldTop = L.portrait ? L.H * 0.665 : L.H * 0.8;
  const top = L.portrait ? L.top : L.H * 0.1;
  const bounce = Math.abs(Math.sin(f / 6)) * 22 * L.u;
  return (
    <AbsoluteFill style={{background: b.bg}}>
      {p.media ? <Media src={p.media} dim={0.66} blur={6 * L.u} /> : <Glow color={b.secondary} strength={0.3} y="38%" />}
      <div style={{position: 'absolute', left: L.pad, right: L.pad, top, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        {lead && <div style={{fontFamily: b.fH, fontSize: 120 * L.u, color: b.text, textTransform: 'uppercase', lineHeight: 1, opacity: ease(f, 0, 6), transform: `translateY(${(1 - ease(f, 0, 8)) * -40 * L.u}px)`}}>{lead}</div>}
        <div style={{marginTop: 16 * L.u, background: b.primary, color: ink(b.primary), fontFamily: b.fH, fontSize: ks, lineHeight: 1.05, padding: `${8 * L.u}px ${40 * L.u}px`, borderRadius: 24 * L.u, transform: `scale(${f >= 5 ? 2.2 - 1.2 * slam : 0}) rotate(-3deg)`, boxShadow: `0 0 ${60 * L.u}px ${alpha(b.primary, 0.5)}`, whiteSpace: 'nowrap'}}>{word}</div>
        {sub && <div style={{marginTop: 30 * L.u, fontFamily: b.fB, fontWeight: 700, fontSize: 44 * L.u, color: alpha(b.text, 0.9), textAlign: 'center', lineHeight: 1.2, opacity: ease(f, 12, 20)}}>{sub}</div>}
      </div>
      {L.portrait && (
        <svg width={140 * L.u} height={170 * L.u} viewBox="0 0 140 170" style={{position: 'absolute', left: (L.W - 140 * L.u) / 2, top: L.H * 0.47 + bounce, opacity: ease(f, 10, 18), overflow: 'visible'}}>
          <path d="M70 8 C 40 50, 100 90, 70 150" stroke={b.primary} strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M40 122 L70 156 L100 122" stroke={b.primary} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {f >= postAt && (
        <div style={{position: 'absolute', left: fx, width: fieldW, top: fieldTop - 150 * L.u, height: 124 * L.u, borderRadius: 26 * L.u, background: 'rgba(255,255,255,.96)', display: 'flex', alignItems: 'center', gap: 22 * L.u, padding: `0 ${28 * L.u}px`, boxSizing: 'border-box', opacity: post, transform: `translateY(${(1 - post) * 50 * L.u}px)`, boxShadow: '0 14px 40px rgba(0,0,0,.4)'}}>
          <div style={{width: 74 * L.u, height: 74 * L.u, borderRadius: '50%', background: b.secondary, flexShrink: 0}} />
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: 28 * L.u, color: '#666'}}>You · just now</div>
            <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: 46 * L.u, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{kw}</div>
          </div>
          <div style={{fontSize: 46 * L.u, transform: `scale(${pop(f, L.fps, postAt + 6, 360, 10)})`}}>❤️</div>
        </div>
      )}
      <div style={{position: 'absolute', left: fx, width: fieldW, top: fieldTop, height: fieldH, borderRadius: fieldH / 2, background: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 20 * L.u, padding: `0 ${16 * L.u}px 0 ${22 * L.u}px`, boxSizing: 'border-box', boxShadow: '0 14px 40px rgba(0,0,0,.45)', opacity: ease(f, 6, 14), transform: `translateY(${(1 - ease(f, 6, 14)) * 60 * L.u}px)`}}>
        <div style={{width: 70 * L.u, height: 70 * L.u, borderRadius: '50%', background: b.secondary, flexShrink: 0}} />
        <div style={{flex: 1, fontFamily: b.fB, fontWeight: typed ? 800 : 500, fontSize: 44 * L.u, color: typed ? '#111' : '#999', whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {typed || 'Add a comment…'}
          {typed && <span style={{opacity: f % 16 < 8 ? 1 : 0, color: b.secondary}}>|</span>}
        </div>
        <div style={{transform: `scale(${sendK})`}}>
          <Send size={84 * L.u} fill={b.primary} color={ink(b.primary)} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- K3 button press CTA ---------------- */

export const pressTimes = (p: P, dur: number, fps: number) => ({pressAt: Math.round(p.pressAt != null ? p.pressAt * fps : Math.min(fps * 1.05, dur * 0.5))});

/** K3: a big CTA button gets tapped: finger comes in, button squishes, ripple + sparks */
export const ButtonPress: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const {pressAt} = pressTimes(p, dur, L.fps);
  const label = txt(p.button, b.cta);
  const after = txt(p.after, '');
  const title = txt(p.title, 'Ready ka na?');
  const sub = txt(p.sub, '');
  const icon = txt(p.icon, '💬');
  const bw = Math.min(L.W - 2 * L.pad, (label.length + (icon ? 2.5 : 0)) * 50 * L.u + 160 * L.u);
  const bh = 176 * L.u;
  const cx = L.W / 2;
  const cy = L.portrait ? L.mid + 20 * L.u : L.H * 0.55;
  const inK = pop(f, L.fps, 6, 220, 13);
  const pressed = f >= pressAt;
  const squish = pressed ? 0.88 + 0.12 * pop(f, L.fps, pressAt + 3, 300, 9) : 1 + 0.03 * Math.sin(f / 5);
  const swap = after && f >= pressAt + 8;
  const hx = cx + 60 * L.u;
  const hy = cy + 40 * L.u;
  const hk = ease(f, pressAt - 18, pressAt - 1);
  const handX = lin(hk, 0, 1, L.W * 0.95, hx);
  const handY = lin(hk, 0, 1, L.H * 0.98, hy) + (pressed ? 14 * L.u * (1 - ease(f, pressAt, pressAt + 6)) : 0) + (f > pressAt + 12 ? ease(f, pressAt + 12, pressAt + 24) * 120 * L.u : 0);
  const rip = (d: number) => lin(f, pressAt + d, pressAt + d + 16);
  return (
    <AbsoluteFill style={{background: b.bg}}>
      {p.media ? <Media src={p.media} dim={0.62} /> : <Glow color={b.primary} strength={0.3} y={`${(cy / L.H) * 100}%`} />}
      {title && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: cy - bh / 2 - 240 * L.u, textAlign: 'center', fontFamily: b.fH, fontSize: Math.min(130 * L.u, fitSize(title, L.u, L.portrait, 150)), color: b.text, textTransform: 'uppercase', lineHeight: 1, transform: `scale(${pop(f, L.fps, 0, 240, 13)})`}}>{title}</div>
      )}
      {pressed &&
        [0, 5].map((d) => (
          <div key={d} style={{position: 'absolute', left: hx - 150 * L.u, top: hy - 150 * L.u - 40 * L.u, width: 300 * L.u, height: 300 * L.u, borderRadius: '50%', border: `${8 * L.u}px solid ${b.primary}`, opacity: f >= pressAt + d ? 1 - rip(d) : 0, transform: `scale(${0.3 + 2.4 * rip(d)})`}} />
        ))}
      <div style={{position: 'absolute', left: cx - bw / 2, top: cy - bh / 2, width: bw, height: bh, borderRadius: bh / 2, background: swap ? GREEN : b.primary, color: swap ? '#FFFFFF' : ink(b.primary), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22 * L.u, fontFamily: b.fH, fontSize: Math.min(84 * L.u, (bw - 120 * L.u) / Math.max(4, label.length * 0.62)), letterSpacing: 2 * L.u, boxShadow: `0 ${pressed && f < pressAt + 4 ? 4 : 18}px ${50 * L.u}px ${alpha(swap ? GREEN : b.primary, 0.55)}, inset 0 -${10 * L.u}px 0 rgba(0,0,0,.18)`, transform: `scale(${inK * squish})`, whiteSpace: 'nowrap'}}>
        {!swap && icon && <span style={{fontSize: 70 * L.u}}>{icon}</span>}
        <span style={{textTransform: 'uppercase'}}>{swap ? after : label}</span>
      </div>
      {pressed &&
        range(10).map((i) => {
          const a = (i / 10) * Math.PI * 2;
          const k = ease(f, pressAt + 1, pressAt + 13);
          const r = bw * 0.5 + 40 * L.u + k * 90 * L.u;
          return <div key={i} style={{position: 'absolute', left: cx + Math.cos(a) * r * 1.0 - 8 * L.u, top: cy + Math.sin(a) * (bh / 2 + 40 * L.u + k * 90 * L.u) - 22 * L.u, width: 16 * L.u, height: 44 * L.u, borderRadius: 8 * L.u, background: b.primary, opacity: 1 - k, transform: `rotate(${(a * 180) / Math.PI + 90}deg)`}} />;
        })}
      {sub && <div style={{position: 'absolute', left: L.pad, right: L.pad, top: cy + bh / 2 + 60 * L.u, textAlign: 'center', fontFamily: b.fB, fontWeight: 700, fontSize: 44 * L.u, color: alpha(b.text, 0.88), opacity: ease(f, 10, 18)}}>{sub}</div>}
      {p.hand !== false && <div style={{position: 'absolute', left: handX - 70 * L.u, top: handY, fontSize: 170 * L.u, lineHeight: 1, transform: `rotate(-12deg) scale(${pressed && f < pressAt + 5 ? 0.92 : 1})`, filter: 'drop-shadow(0 12px 20px rgba(0,0,0,.45))', opacity: ease(f, pressAt - 18, pressAt - 12)}}>👆</div>}
    </AbsoluteFill>
  );
};
