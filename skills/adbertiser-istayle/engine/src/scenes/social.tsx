import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Glow, Pill} from '../lib/Fx';
import {Media} from '../lib/Media';
import {alpha, ease, ink, pop, useLayout, words} from '../lib/util';
import type {SceneProps} from '../types';

type Msg = {from?: 'me' | 'them'; text: string};

/** B3 chat / messenger story (generic chat look, no real app branding) */
export const ChatStory: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const msgs: Msg[] = p.messages ?? [
    {from: 'them', text: 'Hi! Available pa po ba?'},
    {from: 'me', text: 'Yes po! Ilan po order nila?'},
    {from: 'them', text: '3 boxes po, COD'},
    {from: 'me', text: 'Noted po, ship today ✅'},
  ];
  const start = Math.round(L.fps * 0.5);
  const gap = Math.max(10, (dur - start - L.fps * 0.6) / msgs.length);
  const at = msgs.map((_, i) => start + i * gap);
  const cardW = L.portrait ? L.W * 0.86 : L.H * 0.62;
  const cardH = L.portrait ? L.bottom - L.top + L.H * 0.06 : L.H * 0.84;
  const fs = 40 * L.u * (L.portrait ? 1 : 0.85);
  const typingIdx = msgs.findIndex((m, i) => m.from !== 'me' && f >= at[i] - 14 && f < at[i] && gap > 18);
  const name: string = p.name ?? 'Customer';
  const enter = pop(f, L.fps, 0, 180, 14);
  return (
    <AbsoluteFill style={{background: b.bg, alignItems: 'center', justifyContent: 'center'}}>
      <Glow color={b.secondary} strength={0.3} />
      <div
        style={{
          width: cardW,
          height: cardH,
          background: '#FFFFFF',
          borderRadius: 48 * L.u,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: `0 ${30 * L.u}px ${80 * L.u}px rgba(0,0,0,.45)`,
          transform: `translateY(${(1 - enter) * 120 * L.u}px) scale(${0.9 + 0.1 * enter})`,
          opacity: enter,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 22 * L.u, padding: `${28 * L.u}px ${32 * L.u}px`, borderBottom: '2px solid #EEE'}}>
          <div style={{width: 84 * L.u, height: 84 * L.u, borderRadius: '50%', background: b.secondary, color: ink(b.secondary), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: b.fB, fontWeight: 800, fontSize: 38 * L.u}}>
            {name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: fs, color: '#111'}}>{name}</div>
            <div style={{fontFamily: b.fB, fontSize: fs * 0.62, color: '#21A453'}}>● Active now</div>
          </div>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 18 * L.u, padding: 30 * L.u, overflow: 'hidden', background: '#FAFAFA'}}>
          {msgs.map((m, i) => {
            if (f < at[i]) return null;
            const s = pop(f, L.fps, at[i], 260, 14);
            const me = m.from === 'me';
            return (
              <div key={i} style={{alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '78%', transform: `scale(${0.6 + 0.4 * s})`, transformOrigin: me ? 'right bottom' : 'left bottom', opacity: s}}>
                <div style={{background: me ? b.primary : '#E9E9EC', color: me ? ink(b.primary) : '#111', fontFamily: b.fB, fontWeight: 600, fontSize: fs, lineHeight: 1.3, padding: `${18 * L.u}px ${28 * L.u}px`, borderRadius: 38 * L.u}}>
                  {m.text}
                </div>
              </div>
            );
          })}
          {typingIdx >= 0 && (
            <div style={{alignSelf: 'flex-start', background: '#E9E9EC', borderRadius: 38 * L.u, padding: `${22 * L.u}px ${30 * L.u}px`, display: 'flex', gap: 10 * L.u}}>
              {[0, 1, 2].map((k) => (
                <div key={k} style={{width: 16 * L.u, height: 16 * L.u, borderRadius: '50%', background: '#888', transform: `translateY(${Math.sin((f + k * 4) / 3) * 5 * L.u}px)`}} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

type Notif = {title: string; text: string; time?: string};

/** B4 / J12 notification stack on a lock screen (always labelled SAMPLE unless sample:false) */
export const Notifications: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const items: Notif[] = p.items ?? [
    {title: 'New order', text: 'Juan ordered 2x Classic Pack', time: 'now'},
    {title: 'New order', text: 'Ana ordered 1x Family Box', time: '1m'},
    {title: 'New message', text: '"Pa-reserve po ako ng 3"', time: '2m'},
    {title: 'New order', text: 'Mark ordered 5x Reseller Kit', time: '3m'},
  ];
  const app: string = p.app ?? b.name;
  const gap = Math.max(8, (dur - L.fps * 0.8) / items.length);
  const w = L.portrait ? L.W * 0.88 : L.H * 0.8;
  const fs = 36 * L.u * (L.portrait ? 1 : 0.85);
  const visible = items.map((_, i) => Math.round(L.fps * 0.4 + i * gap)).filter((t) => f >= t).length;
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <Media src={p.bg ?? 'demo:📱:250'} blur={24 * L.u} dim={0.35} zoom="none" />
      <div style={{position: 'absolute', top: L.portrait ? L.H * 0.14 : L.H * 0.06, width: '100%', textAlign: 'center', fontFamily: b.fB, fontWeight: 300, fontSize: 150 * L.u, color: '#fff'}}>
        9:41
      </div>
      <div style={{position: 'absolute', top: L.top + (L.portrait ? 40 * L.u : 120 * L.u), width: w, display: 'flex', flexDirection: 'column-reverse', gap: 18 * L.u}}>
        {items.slice(0, visible).map((n, i) => {
          const t = Math.round(L.fps * 0.4 + i * gap);
          const s = pop(f, L.fps, t, 220, 15);
          return (
            <div key={i} style={{display: 'flex', gap: 22 * L.u, alignItems: 'center', background: 'rgba(255,255,255,.88)', borderRadius: 40 * L.u, padding: 26 * L.u, transform: `translateY(${(1 - s) * -80 * L.u}px)`, opacity: s, boxShadow: '0 10px 30px rgba(0,0,0,.18)'}}>
              <div style={{width: 92 * L.u, height: 92 * L.u, flexShrink: 0, borderRadius: 24 * L.u, background: b.primary, color: ink(b.primary), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: b.fH, fontSize: 48 * L.u}}>
                {app.slice(0, 1)}
              </div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: b.fB, fontSize: fs * 0.75, color: '#555'}}>
                  <span style={{fontWeight: 700}}>{app.toUpperCase()}</span>
                  <span>{n.time ?? 'now'}</span>
                </div>
                <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: fs, color: '#111'}}>{n.title}</div>
                <div style={{fontFamily: b.fB, fontSize: fs * 0.9, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{n.text}</div>
              </div>
            </div>
          );
        })}
      </div>
      {p.sample !== false && <Pill text="SAMPLE" bg="rgba(0,0,0,.6)" color="#fff" size={26 * L.u} font={b.fB} style={{position: 'absolute', top: 40 * L.u, left: 40 * L.u}} />}
    </AbsoluteFill>
  );
};

/** A6 / J7 reply-to-comment: comment card pops, then the answer */
export const CommentReply: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const name: string = p.name ?? 'Maria S.';
  const comment: string = p.comment ?? 'Magkano po shipping pa-Mindanao?';
  const reply: string = p.reply ?? 'FREE po kapag 3 boxes pataas!';
  const s = pop(f, L.fps, 4, 220, 13);
  const move = ease(f, L.fps * 1.3, L.fps * 1.8);
  const w = L.portrait ? L.W * 0.84 : L.W * 0.5;
  const fs = 44 * L.u * (L.portrait ? 1 : 0.85);
  const y0 = L.mid - 140 * L.u;
  const y1 = L.top;
  const rw = words(reply);
  return (
    <AbsoluteFill style={{background: b.bg}}>
      {p.media ? <Media src={p.media} dim={0.35} /> : <Glow color={b.primary} strength={0.25} />}
      <div
        style={{
          position: 'absolute',
          left: (L.W - w) / 2,
          top: y0 + (y1 - y0) * move,
          width: w,
          background: '#fff',
          borderRadius: 34 * L.u,
          padding: 30 * L.u,
          display: 'flex',
          gap: 22 * L.u,
          boxShadow: '0 20px 60px rgba(0,0,0,.35)',
          transform: `scale(${(0.5 + 0.5 * s) * (1 - 0.12 * move)})`,
          transformOrigin: 'center top',
          opacity: s,
        }}
      >
        <div style={{width: 90 * L.u, height: 90 * L.u, borderRadius: '50%', flexShrink: 0, background: b.secondary, color: ink(b.secondary), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: b.fB, fontWeight: 800, fontSize: 40 * L.u}}>
          {name.slice(0, 1)}
        </div>
        <div>
          <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: fs * 0.8, color: '#111'}}>{name}</div>
          <div style={{fontFamily: b.fB, fontSize: fs, color: '#222', lineHeight: 1.3}}>{comment}</div>
          <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: fs * 0.6, color: '#888', marginTop: 8 * L.u}}>Reply · Like</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.mid + 60 * L.u, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 22 * L.u}}>
        {rw.map((w2, i) => {
          const ws = pop(f, L.fps, L.fps * 1.8 + i * 3, 260, 12);
          return (
            <span key={i} style={{fontFamily: b.fH, fontSize: 110 * L.u * (L.portrait ? 1 : 0.8), color: i === 0 ? b.primary : b.text, textTransform: 'uppercase', display: 'inline-block', lineHeight: 1.1, transform: `scale(${ws})`, opacity: ws}}>
              {w2}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
