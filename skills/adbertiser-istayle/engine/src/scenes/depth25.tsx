import React, {useEffect, useMemo, useState} from 'react';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {AbsoluteFill, Img, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Pill} from '../lib/Fx';
import {Media, asset, parseDemo} from '../lib/Media';
import {alpha, ease, fitSize, ink, lin, pop, useLayout} from '../lib/util';
import type {SceneProps} from '../types';
import {useDrawWhenReady, txt} from './depth3d';

// 2.5D look: D2 parallax photo (true depth with a depth map) · D11 title between depth layers · K14 depth CTA.
// Depth maps come from scripts/depth.py (Depth Anything V2 Small, Apache 2.0); without one, a soft center-near depth is used.
type P = Record<string, any>;

const gradientDepth = () => {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(128, 150, 10, 128, 140, 180);
  gr.addColorStop(0, '#FFFFFF');
  gr.addColorStop(1, '#000000');
  g.fillStyle = gr;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
};
const demoPhoto = (emoji: string, hue: number) => {
  const c = document.createElement('canvas');
  c.width = 720;
  c.height = 1280;
  const g = c.getContext('2d')!;
  const gr = g.createLinearGradient(0, 0, 0, 1280);
  gr.addColorStop(0, `hsl(${hue} 70% 62%)`);
  gr.addColorStop(1, `hsl(${hue + 40} 60% 28%)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 720, 1280);
  g.font = '360px sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(emoji, 360, 700);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

/** load an image texture (holds the frame until loaded); demo:/empty → generated fallback */
const useTex = (src: string | undefined, fallback: 'depth' | 'photo') => {
  const demo = parseDemo(src);
  const url = src && !demo ? asset(src) : null;
  const fb = useMemo(() => (url ? null : fallback === 'depth' ? gradientDepth() : demoPhoto(demo?.emoji ?? '🏞️', demo?.hue ?? 150)), [url, fallback, demo?.emoji, demo?.hue]);
  const [tex, setTex] = useState<THREE.Texture | null>(fb);
  const [h] = useState(() => (url ? delayRender(`2.5D texture ${url}`) : -1));
  useEffect(() => {
    if (!url) return;
    new THREE.TextureLoader().load(
      url,
      (t) => {
        if (fallback === 'photo') t.colorSpace = THREE.SRGBColorSpace;
        setTex(t);
        continueRender(h);
      },
      undefined,
      () => continueRender(h),
    );
  }, [url, h, fallback]);
  return tex;
};

/** camera path for the parallax move */
const Cam: React.FC<{motion: string; k: number; D: number}> = ({motion, k, D}) => {
  const {camera} = useThree();
  const s = k * 2 - 1; // -1..1
  if (motion === 'orbit') camera.position.set(Math.sin(s * 1.2) * D * 0.12, 0, D);
  else if (motion === 'rise') camera.position.set(0, s * D * 0.08, D * (1 - 0.05 * k));
  else camera.position.set(s * D * 0.03, 0, D * (1 - 0.16 * k)); // dolly in
  camera.lookAt(0, 0, 0);
  return null;
};

const Plane: React.FC<{photo?: string; depth?: string; aspect: number; w: number; h: number; amount: number}> = ({photo, depth, aspect, w, h, amount}) => {
  const ptex = useTex(photo, 'photo');
  const dtex = useTex(depth, 'depth');
  const ready = ptex && dtex ? ptex : null;
  useDrawWhenReady(ready, false);
  // cover-fit the photo on the plane (plane already matches the frame)
  if (ptex) {
    const img = ptex.image as {width?: number; height?: number} | undefined;
    const a = (img?.width ?? 9) / (img?.height ?? 16);
    for (const t of [ptex, dtex]) {
      if (!t) continue;
      if (a > aspect) {
        t.repeat.set(aspect / a, 1);
        t.offset.set((1 - aspect / a) / 2, 0);
      } else {
        t.repeat.set(1, a / aspect);
        t.offset.set(0, (1 - a / aspect) / 2);
      }
    }
  }
  const geo = useMemo(() => new THREE.PlaneGeometry(w, h, 220, Math.round(220 / aspect)), [w, h, aspect]);
  if (!ready) return null;
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial key="ready" color="#000000" emissive="#FFFFFF" emissiveMap={ptex} displacementMap={dtex} displacementScale={amount} toneMapped={false} />
    </mesh>
  );
};

/* ---------------- D2 parallax photo ---------------- */

/** D2: a still photo becomes a 2.5D shot: depth-displaced plane, camera dollies / orbits / rises */
export const Parallax: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const D = 4;
  const fov = 35;
  const vh = 2 * D * Math.tan((fov * Math.PI) / 360) * 1.16; // overscan so edges never show
  const aspect = L.W / L.H;
  const k = ease(f, 0, dur);
  const title = txt(p.title, '');
  const sub = txt(p.sub, '');
  const tk = pop(f, L.fps, 8, 220, 13);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <ThreeCanvas width={L.W} height={L.H} camera={{fov, position: [0, 0, D]}} gl={{antialias: true, preserveDrawingBuffer: true}}>
        <Cam motion={p.motion ?? 'dolly'} k={k} D={D} />
        <Plane photo={p.photo} depth={p.depth} aspect={aspect} w={vh * aspect} h={vh} amount={Number(p.amount ?? 0.4)} />
      </ThreeCanvas>
      {(title || sub) && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.2 : L.H * 0.12, textAlign: 'center', opacity: tk, transform: `translateY(${(1 - tk) * 30 * L.u}px)`}}>
          {title && <div style={{fontFamily: b.fH, fontSize: Math.min(120 * L.u, fitSize(title, L.u, L.portrait, 140)), lineHeight: 1.02, color: '#FFFFFF', textTransform: 'uppercase', textShadow: '0 6px 30px rgba(0,0,0,.7)'}}>{title}</div>}
          {sub && <div style={{marginTop: 14 * L.u, display: 'flex', justifyContent: 'center'}}><Pill text={sub} bg={b.primary} color={ink(b.primary)} size={40 * L.u} font={b.fB} /></div>}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- D11 title between depth layers ---------------- */

/** D11: big title sits between the background and the subject (foreground cut from depth.py), all drifting at different depths */
export const DepthTitle: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const title = txt(p.title, 'Ganda ng Shot').toUpperCase();
  const sub = txt(p.sub, '');
  const k = ease(f, 0, dur);
  const size = Math.min(L.H * 0.22, ((L.W * 0.94) / Math.max(3, title.length)) * 1.75);
  const tk = ease(f, 2, 16);
  const layer = (scale: number, x: number): React.CSSProperties => ({position: 'absolute', inset: 0, transform: `scale(${scale}) translateX(${x}px)`});
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <div style={layer(1.05 + 0.05 * k, -10 * L.u * k)}>
        <Media src={p.photo ?? 'demo:🏞️:150'} zoom="none" dim={0.15} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: p.y != null ? L.H * Number(p.y) - size / 2 : L.portrait ? L.H * 0.26 : L.H * 0.14, display: 'flex', justifyContent: 'center', transform: `scale(${1.02 + 0.05 * k}) translateY(${(1 - tk) * size * 0.6}px)`, opacity: tk}}>
        <span style={{fontFamily: b.fH, fontSize: size, lineHeight: 1, color: p.color ?? b.primary, whiteSpace: 'nowrap', textShadow: '0 10px 40px rgba(0,0,0,.35)'}}>{title}</span>
      </div>
      {p.fg && <Img src={asset(p.fg)} style={{...layer(1.05 + 0.1 * k, 10 * L.u * k), width: '100%', height: '100%', objectFit: 'cover'}} />}
      {sub && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.68 : L.H * 0.82, textAlign: 'center', fontFamily: b.fB, fontWeight: 800, fontSize: 48 * L.u, color: '#FFFFFF', opacity: ease(f, 12, 20), textShadow: '0 4px 16px rgba(0,0,0,.85)'}}>{sub}</div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- K14 depth CTA ---------------- */

/** K14: the photo keeps drifting in depth behind a dark glass band with the CTA */
export const DepthCTA: React.FC<SceneProps> = ({p, dur}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const cta = txt(p.cta, b.cta);
  const title = txt(p.title, b.name);
  const handle = txt(p.handle, b.handle ?? '');
  const k = ease(f, 0, dur);
  const bk = pop(f, L.fps, 6, 220, 13);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${1.12 - 0.08 * k})`}}>
        <Media src={p.photo ?? 'demo:🏞️:150'} zoom="none" dim={0.35} blur={4 * L.u} />
      </div>
      {p.fg && <Img src={asset(p.fg)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.04 + 0.08 * k})`, opacity: 0.9}} />}
      <div style={{position: 'absolute', left: 0, right: 0, top: L.H * 0.5 - 180 * L.u, height: 360 * L.u, background: 'linear-gradient(90deg, transparent, rgba(0,0,0,.65) 15%, rgba(0,0,0,.65) 85%, transparent)', backdropFilter: `blur(${10 * L.u}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 * L.u, opacity: bk, transform: `scaleY(${0.6 + 0.4 * bk})`}}>
        {title && <div style={{fontFamily: b.fH, fontSize: Math.min(100 * L.u, ((L.W * 0.8) / Math.max(4, title.length)) * 1.6), color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 3 * L.u}}>{title}</div>}
        {cta && <Pill text={cta} bg={b.primary} color={ink(b.primary)} size={52 * L.u} font={b.fH} style={{boxShadow: `0 0 ${40 * L.u}px ${alpha(b.primary, 0.6)}`, textTransform: 'uppercase'}} />}
        {handle && <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: 34 * L.u, color: alpha('#FFFFFF', 0.85)}}>{handle}</div>}
      </div>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(0deg, rgba(0,0,0,${lin(f, 0, 12, 0.6, 0.2)}), transparent 40%)`}} />
    </AbsoluteFill>
  );
};
