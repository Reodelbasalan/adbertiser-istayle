import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Glow, Pill} from '../lib/Fx';
import {Media} from '../lib/Media';
import {PaperBg} from '../lib/Paper';
import {alpha, ease, fitSize, pop, shake, useLayout} from '../lib/util';
import type {SceneProps} from '../types';

type Stat = {value: number; label: string; prefix?: string; suffix?: string};

/** B5 infographic counters + bars (SAMPLE label on unless sample:false) */
export const StatCounters: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const stats: Stat[] = p.stats ?? [
    {value: 1200, suffix: '+', label: 'Orders this month'},
    {value: 4.9, label: 'Average rating', suffix: '★'},
    {value: 38, suffix: '%', label: 'Repeat buyers'},
  ];
  const max = Math.max(...stats.map((s) => s.value));
  const fs = (stats.length === 1 ? 220 : stats.length === 2 ? 160 : L.portrait ? 120 : 110) * L.u;
  return (
    <AbsoluteFill style={{background: b.bg}}>
      <Glow color={b.primary} strength={0.2} y="35%" />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: L.pad, gap: 34 * L.u}}>
        {p.title && (
          <div style={{fontFamily: b.fH, fontSize: 84 * L.u, color: b.text, textTransform: 'uppercase', textAlign: 'center', opacity: ease(f, 0, 10), marginBottom: 10 * L.u}}>
            {p.title}
          </div>
        )}
        <div style={{display: 'flex', flexDirection: L.portrait ? 'column' : 'row', gap: 30 * L.u, width: '100%'}}>
          {stats.map((s, i) => {
            const d = 6 + i * 8;
            const k = ease(f, d, d + L.fps * 1.1);
            const v = s.value * k;
            const txt = Number.isInteger(s.value) ? Math.round(v).toLocaleString('en-US') : v.toFixed(1);
            const sIn = pop(f, L.fps, d, 200, 14);
            return (
              <div key={i} style={{flex: 1, background: alpha(b.text, 0.06), border: `2px solid ${alpha(b.primary, 0.45)}`, borderRadius: 34 * L.u, padding: `${28 * L.u}px ${36 * L.u}px`, transform: `translateY(${(1 - sIn) * 60 * L.u}px)`, opacity: sIn}}>
                <div style={{fontFamily: b.fH, fontSize: fs, lineHeight: 1, color: b.primary}}>
                  {s.prefix ?? ''}
                  {txt}
                  {s.suffix ?? ''}
                </div>
                <div style={{fontFamily: b.fB, fontWeight: 600, fontSize: 38 * L.u, color: b.text, marginTop: 8 * L.u}}>{s.label}</div>
                <div style={{height: 14 * L.u, borderRadius: 10 * L.u, background: alpha(b.text, 0.1), marginTop: 18 * L.u, overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${(s.value / max) * 100 * k}%`, background: b.primary, borderRadius: 10 * L.u}} />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {p.sample !== false && <Pill text="SAMPLE" bg="rgba(255,255,255,.14)" color="#fff" size={26 * L.u} font={b.fB} style={{position: 'absolute', top: 40 * L.u, left: 40 * L.u}} />}
    </AbsoluteFill>
  );
};

type Item = {icon: string; label: string};

/** B7 services / features grid, tiles pop one by one */
export const ServicesGrid: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const items: Item[] = p.items ?? [
    {icon: '🎬', label: 'Video Ads'},
    {icon: '📸', label: 'Product Photos'},
    {icon: '📅', label: 'Posting'},
    {icon: '🤖', label: 'Chatbot'},
    {icon: '📈', label: 'Ads Setup'},
    {icon: '💬', label: 'Replies'},
  ];
  const cols = L.portrait ? 2 : Math.min(4, Math.ceil(items.length / 2));
  const tile = ((L.portrait ? L.W - 2 * L.pad : L.W * 0.8) - (cols - 1) * 26 * L.u) / cols;
  return (
    <AbsoluteFill style={{background: b.bg, alignItems: 'center', justifyContent: 'center', gap: 36 * L.u}}>
      <Glow color={b.secondary} strength={0.25} />
      {p.title && (
        <div style={{fontFamily: b.fH, fontSize: fitSize(p.title, L.u, L.portrait, 110), color: b.text, textTransform: 'uppercase', textAlign: 'center', padding: `0 ${L.pad}px`, opacity: ease(f, 0, 10)}}>
          {p.title}
        </div>
      )}
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${tile}px)`, gap: 26 * L.u}}>
        {items.map((it, i) => {
          const s = pop(f, L.fps, 6 + i * 4, 240, 12);
          const bob = Math.sin((f + i * 9) / 14) * 5 * L.u;
          return (
            <div key={i} style={{height: tile * (L.portrait ? 0.78 : 0.7), background: alpha(b.text, 0.06), border: `2px solid ${alpha(b.primary, 0.5)}`, borderRadius: 34 * L.u, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 * L.u, transform: `translateY(${bob}px) scale(${s}) rotate(${(1 - s) * (i % 2 ? 8 : -8)}deg)`, opacity: s}}>
              <div style={{fontSize: tile * 0.3, lineHeight: 1}}>{it.icon}</div>
              <div style={{fontFamily: b.fB, fontWeight: 800, fontSize: Math.min(44 * L.u, tile * 0.13), color: b.text, textAlign: 'center', padding: `0 ${12 * L.u}px`}}>{it.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** B10 newspaper / breaking headline: page spins in, BREAKING slams */
export const Newspaper: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const spinEnd = Math.round(L.fps * 0.7);
  const k = ease(f, 0, spinEnd);
  const slamAt = spinEnd + 4;
  const sh = shake(f, slamAt, 8, 12 * L.u);
  const slam = pop(f, L.fps, slamAt, 320, 14);
  const pw = L.portrait ? L.W * 0.9 : L.H * 0.95 * 0.78;
  const ph = L.portrait ? L.H * 0.66 : L.H * 0.92;
  const headline: string = p.headline ?? 'Local brand sold out in 3 days';
  const hs = fitSize(headline, L.u, true, 140) * (L.portrait ? 1 : 0.9);
  const push = 1 + 0.05 * ease(f, spinEnd, spinEnd + L.fps * 3);
  return (
    <AbsoluteFill style={{background: '#1A1A1A', alignItems: 'center', justifyContent: 'center', transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <div style={{width: pw, height: ph, position: 'relative', transform: `rotate(${(1 - k) * -540 - 2}deg) scale(${(0.05 + 0.95 * k) * push})`, boxShadow: '0 30px 80px rgba(0,0,0,.6)', overflow: 'hidden'}}>
        <PaperBg color="#EFE8D6" u={L.u} />
        <div style={{position: 'absolute', inset: 0, padding: 34 * L.u, display: 'flex', flexDirection: 'column', gap: 16 * L.u}}>
          <div style={{fontFamily: b.fSerif, fontWeight: 900, fontSize: 82 * L.u, textAlign: 'center', color: '#111', borderBottom: '4px solid #111', paddingBottom: 6 * L.u, lineHeight: 1}}>{p.paper ?? 'THE DAILY NEWS'}</div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: b.fType, fontSize: 24 * L.u, color: '#333', borderBottom: '2px solid #111', paddingBottom: 8 * L.u}}>
            <span>{p.date ?? 'SPECIAL EDITION'}</span>
            <span>₱0.00</span>
          </div>
          <div style={{fontFamily: b.fSerif, fontWeight: 900, fontSize: hs, lineHeight: 1.02, color: '#111', textTransform: 'uppercase'}}>{headline}</div>
          {p.sub && <div style={{fontFamily: b.fSerif, fontWeight: 700, fontStyle: 'italic', fontSize: 40 * L.u, color: '#333'}}>{p.sub}</div>}
          <div style={{flex: 1, position: 'relative', minHeight: 0, filter: 'grayscale(1) contrast(1.25)'}}>
            <Media src={p.image ?? 'demo:📰:30'} zoom="none" />
            <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(0,0,0,.35) 30%, transparent 32%)', backgroundSize: `${9 * L.u}px ${9 * L.u}px`, mixBlendMode: 'multiply'}} />
          </div>
          <div style={{display: 'flex', gap: 16 * L.u}}>
            {[0, 1, 2].map((c) => (
              <div key={c} style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 9 * L.u}}>
                {[0, 1, 2, 3].map((r) => (
                  <div key={r} style={{height: 9 * L.u, background: 'rgba(0,0,0,.28)', width: `${70 + ((c * 7 + r * 13) % 30)}%`}} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {f >= slamAt && (
        <div style={{position: 'absolute', top: L.portrait ? L.top - 30 * L.u : L.H * 0.12, transform: `rotate(-6deg) scale(${2.4 - 1.4 * slam})`, opacity: Math.min(1, slam * 2)}}>
          <Pill text={p.banner ?? 'BREAKING'} bg="#E0242B" color="#fff" size={64 * L.u} font={b.fH} style={{borderRadius: 12 * L.u, letterSpacing: 6 * L.u}} />
        </div>
      )}
    </AbsoluteFill>
  );
};
