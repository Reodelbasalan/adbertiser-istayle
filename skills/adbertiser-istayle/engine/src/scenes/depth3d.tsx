import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas, useOffthreadVideoTexture} from '@remotion/three';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {AbsoluteFill, Img, continueRender, delayRender, random, useCurrentFrame} from 'remotion';
import {useBrand} from '../brand';
import {Glow, Pill} from '../lib/Fx';
import {asset, isVideo, parseDemo} from '../lib/Media';
import {alpha, ease, fitSize, ink, lin, pop, shake, useLayout} from '../lib/util';
import type {SceneProps} from '../types';

// 3D look: D3 3D text reveal · D5 3D phone mockup · D6 coins rain · K8 3D logo end card.
// D3 and K8 are CSS 3D (any font, no GPU); D5 and D6 are three.js through @remotion/three.
type P = Record<string, any>;
export const range = (k: number) => Array.from({length: Math.max(0, k)}, (_, i) => i);
const off = (v: unknown) => v === false || v === '';
export const txt = (v: unknown, d: string) => (off(v) ? '' : typeof v === 'string' || typeof v === 'number' ? String(v) : d);

/* ---------------- CSS 3D helpers ---------------- */

export const mix = (hex: string, k: number) => {
  // darken a hex color by k (0..1)
  if (!hex.startsWith('#')) return hex;
  const h = hex.length === 4 ? hex.slice(1).split('').map((c) => c + c).join('') : hex.slice(1, 7);
  const n = parseInt(h, 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * (1 - k)));
  return `rgb(${c.join(',')})`;
};

/** extruded text: stacked layers in CSS 3D; front face gets a moving metallic sheen */
export const Extruded: React.FC<{text: string; size: number; font: string; face: string; side: string; depth: number; sheen: number}> = ({text, size, font, face, side, depth, sheen}) => {
  const layers = 26;
  const common: React.CSSProperties = {fontFamily: font, fontSize: size, lineHeight: 1.02, whiteSpace: 'nowrap', textTransform: 'uppercase', textAlign: 'center'};
  return (
    <div style={{position: 'relative', transformStyle: 'preserve-3d'}}>
      {range(layers).map((i) => (
        <div key={i} style={{...common, position: 'absolute', inset: 0, color: mix(side, 0.15 + (0.55 * i) / layers), transform: `translateZ(${(-depth * (i + 1)) / layers}px)`}}>
          {text}
        </div>
      ))}
      <div
        style={{
          ...common,
          position: 'relative',
          backgroundImage: `linear-gradient(105deg, ${face} 0%, ${face} ${sheen - 12}%, #FFFFFF ${sheen}%, ${face} ${sheen + 12}%, ${face} 100%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitTextStroke: `${Math.max(1, size * 0.012)}px ${alpha('#FFFFFF', 0.25)}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** receding neon floor grid for depth */
const FloorGrid: React.FC<{color: string; f: number; u: number}> = ({color, f, u}) => (
  <div style={{position: 'absolute', left: '-50%', right: '-50%', bottom: 0, height: '40%', perspective: 700 * u, overflow: 'hidden'}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: 'rotateX(62deg)',
        transformOrigin: 'bottom',
        backgroundImage: `linear-gradient(${alpha(color, 0.75)} ${3 * u}px, transparent ${3 * u}px), linear-gradient(90deg, ${alpha(color, 0.75)} ${3 * u}px, transparent ${3 * u}px)`,
        backgroundSize: `${110 * u}px ${110 * u}px`,
        backgroundPosition: `0 ${(f * 4 * u) % (110 * u)}px`,
        maskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
      }}
    />
  </div>
);

/* ---------------- D3 3D text reveal ---------------- */

export const textLand = (fps: number) => Math.round(fps * 0.55);

/** D3: big extruded 3D text flies in from depth, swings and lands; sheen sweeps across */
export const Text3D: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const lines = txt(p.text, 'Ads na|Bumebenta').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const sub = txt(p.sub, '');
  const longest = Math.max(...lines.map((l) => l.length), 3);
  const size = Math.min(L.portrait ? 230 * L.u : 200 * L.u, ((L.W * 0.86) / longest) * 1.6);
  const land = textLand(L.fps);
  const k = ease(f, 0, land);
  const s = pop(f, L.fps, land - 4, 200, 11);
  const swing = (1 - k) * 75 + k * (-22 + Math.sin(f / (L.fps * 1.1)) * 8);
  const z = (1 - k) * -2400 * L.u;
  const sh = shake(f, land, 8, 10 * L.u);
  const sheen = lin(f, land + 2, land + L.fps * 0.9, -20, 120);
  const face = p.color ?? b.primary;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, ${b.bg} 0%, #000 85%)`, overflow: 'hidden'}}>
      <Glow color={face} strength={0.25 + 0.15 * s} y="42%" />
      <FloorGrid color={p.gridColor ?? b.secondary} f={f} u={L.u} />
      <AbsoluteFill style={{perspective: 1400 * L.u, alignItems: 'center', justifyContent: 'center', transform: `translate(${sh.x}px, ${sh.y - (L.portrait ? 60 * L.u : 0)}px)`}}>
        <div style={{transformStyle: 'preserve-3d', transform: `translateZ(${z}px) rotateY(${swing}deg) rotateX(${16 - 4 * k}deg) scale(${0.9 + 0.1 * s})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.06, opacity: Math.min(1, k * 3)}}>
          {lines.map((l, i) => (
            <Extruded key={i} text={l} size={size} font={b.fH} face={i % 2 ? b.text : face} side={i % 2 ? '#8A8A99' : face} depth={size * 0.55} sheen={sheen} />
          ))}
        </div>
      </AbsoluteFill>
      {sub && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.66 : L.H * 0.82, textAlign: 'center', fontFamily: b.fB, fontWeight: 800, fontSize: 46 * L.u, color: b.text, opacity: ease(f, land + 6, land + 14), textShadow: '0 4px 16px rgba(0,0,0,.8)'}}>{sub}</div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- K8 3D logo end card ---------------- */

/** K8: logo (or brand name) spins in as a thick 3D badge, then the CTA pops */
export const Logo3D: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const logo: string | undefined = p.logo ?? b.logo;
  const name = txt(p.name, b.name);
  const cta = txt(p.cta, b.cta);
  const handle = txt(p.handle, b.handle ?? '');
  const land = Math.round(L.fps * 0.8);
  const k = ease(f, 0, land);
  const spin = (1 - k) * 360 + k * (-20 + Math.sin(f / L.fps) * 8);
  const sheen = lin(f, land, land + L.fps * 0.8, -20, 120);
  const ctaK = pop(f, L.fps, land + 4, 240, 12);
  const box = Math.min(L.W, L.H) * (L.portrait ? 0.5 : 0.36);
  const cy = L.portrait ? L.H * 0.42 : L.H * 0.4;
  const nameSize = Math.min(150 * L.u, ((L.W * 0.84) / Math.max(4, name.length)) * 1.6);
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, ${alpha(b.primary, 0.22)} 0%, ${b.bg} 55%, #000 100%)`}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: cy - box / 2, height: box, perspective: 1600 * L.u, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{transformStyle: 'preserve-3d', transform: `rotateY(${spin}deg) rotateX(${6 * Math.sin(f / 20)}deg) scale(${0.6 + 0.4 * k})`}}>
          {logo ? (
            <div style={{position: 'relative', width: box, height: box, transformStyle: 'preserve-3d'}}>
              {range(14).map((i) => (
                <Img key={i} src={asset(logo)} style={{position: 'absolute', inset: 0, width: box, height: box, objectFit: 'contain', transform: `translateZ(${-i * 2.2 * L.u}px)`, filter: `brightness(${0.75 - i * 0.04})`}} />
              ))}
              <Img src={asset(logo)} style={{position: 'absolute', inset: 0, width: box, height: box, objectFit: 'contain', transform: `translateZ(${2 * L.u}px)`}} />
            </div>
          ) : (
            <Extruded text={name} size={nameSize} font={b.fH} face={b.primary} side={b.primary} depth={nameSize * 0.55} sheen={sheen} />
          )}
        </div>
      </div>
      {logo && name && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: cy + box / 2 + 30 * L.u, textAlign: 'center', fontFamily: b.fH, fontSize: 70 * L.u, color: b.text, textTransform: 'uppercase', opacity: ease(f, land, land + 10)}}>{name}</div>
      )}
      {cta && (
        <div style={{position: 'absolute', left: 0, right: 0, top: L.portrait ? L.H * 0.66 : L.H * 0.78, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 * L.u, transform: `scale(${ctaK})`}}>
          <Pill text={cta} bg={b.primary} color={ink(b.primary)} size={56 * L.u} font={b.fH} style={{boxShadow: `0 0 ${50 * L.u}px ${alpha(b.primary, 0.5)}`, textTransform: 'uppercase'}} />
          {handle && <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: 38 * L.u, color: alpha(b.text, 0.8)}}>{handle}</div>}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- three.js helpers ---------------- */

/** studio reflections so metal looks like metal */
const Env: React.FC = () => {
  const {gl, scene} = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    return () => {
      tex.dispose();
      pm.dispose();
    };
  }, [gl, scene]);
  return null;
};

const roundedShape = (w: number, h: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

/** ShapeGeometry with 0..1 UVs (so a texture fills the rounded screen) */
const screenGeometry = (w: number, h: number, r: number) => {
  const g = new THREE.ShapeGeometry(roundedShape(w, h, r), 12);
  const pos = g.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) + w / 2) / w;
    uv[i * 2 + 1] = (pos.getY(i) + h / 2) / h;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
};

/** cover-fit a texture onto a box of aspect `box` (w/h) */
const cover = (t: THREE.Texture | null, box: number) => {
  if (!t) return t;
  const img = t.image as {width?: number; height?: number; videoWidth?: number; videoHeight?: number} | undefined;
  const iw = img?.videoWidth || img?.width || 1080;
  const ih = img?.videoHeight || img?.height || 1920;
  const a = iw / ih;
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  if (a > box) {
    t.repeat.set(box / a, 1);
    t.offset.set((1 - box / a) / 2, 0);
  } else {
    t.repeat.set(1, a / box);
    t.offset.set(0, (1 - a / box) / 2);
  }
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const useImageTexture = (src: string) => {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [handle] = useState(() => delayRender(`texture ${src}`));
  useEffect(() => {
    new THREE.TextureLoader().load(
      src,
      (t) => {
        setTex(t);
        continueRender(handle);
      },
      undefined,
      () => continueRender(handle),
    );
  }, [src, handle]);
  return tex;
};

const demoTexture = (emoji: string, hue: number, w = 540, h = 1080) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  const gr = g.createLinearGradient(0, 0, w, h);
  gr.addColorStop(0, `hsl(${hue} 72% 60%)`);
  gr.addColorStop(1, `hsl(${hue + 35} 62% 30%)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, w, h);
  g.font = `${w * 0.42}px sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(emoji, w / 2, h / 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

/**
 * ThreeCanvas only redraws when the frame changes, but textures arrive later (async).
 * Hold the frame until the texture is on the material, then redraw once.
 * perFrame: a video texture changes every frame, so hold again on each new frame.
 */
const useDrawWhenReady = (tex: THREE.Texture | null, perFrame: boolean) => {
  const frame = useCurrentFrame();
  const {advance} = useThree();
  const hold = useRef<{h: number; frame: number; tex: THREE.Texture | null} | null>(null);
  if (!hold.current || (perFrame && hold.current.h === -1 && hold.current.frame !== frame)) {
    hold.current = {h: delayRender('3D screen texture'), frame, tex};
  }
  useLayoutEffect(() => {
    const cur = hold.current;
    if (!cur || cur.h === -1 || !tex || (perFrame && tex === cur.tex)) return;
    advance(performance.now());
    continueRender(cur.h);
    cur.h = -1;
  });
};

const ScreenMat: React.FC<{tex: THREE.Texture | null; aspect: number; perFrame?: boolean}> = ({tex, aspect, perFrame = false}) => {
  useDrawWhenReady(tex, perFrame);
  // key: three.js must rebuild the material (shader) when the first texture arrives
  return tex ? <meshBasicMaterial key="map" map={cover(tex, aspect)} toneMapped={false} /> : <meshBasicMaterial key="wait" color="#000000" />;
};
const VideoScreen: React.FC<{src: string; aspect: number}> = ({src, aspect}) => <ScreenMat tex={useOffthreadVideoTexture({src})} aspect={aspect} perFrame />;
const ImageScreen: React.FC<{src: string; aspect: number}> = ({src, aspect}) => <ScreenMat tex={useImageTexture(src)} aspect={aspect} />;
const DemoScreen: React.FC<{emoji: string; hue: number; aspect: number}> = ({emoji, hue, aspect}) => {
  const t = useMemo(() => demoTexture(emoji, hue), [emoji, hue]);
  return <ScreenMat tex={t} aspect={aspect} />;
};
const Screen: React.FC<{src?: string; aspect: number}> = ({src, aspect}) => {
  const demo = parseDemo(src) ?? (!src ? {emoji: '📱', hue: 260} : null);
  if (demo) return <DemoScreen emoji={demo.emoji} hue={demo.hue} aspect={aspect} />;
  return isVideo(src) ? <VideoScreen src={asset(src)} aspect={aspect} /> : <ImageScreen src={asset(src!)} aspect={aspect} />;
};

/* ---------------- D5 3D phone mockup ---------------- */

const PW = 1.0;
const PH = 2.05;

/** D5: a 3D phone turns in and floats; your ad (clip or image) plays on its screen */
export const Phone3D: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const title = txt(p.title, 'Ganito dapat ang ad mo');
  const sub = txt(p.sub, '');
  const body = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedShape(PW, PH, 0.15), {depth: 0.07, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 5, curveSegments: 20});
    g.center();
    return g;
  }, []);
  const scr = useMemo(() => screenGeometry(PW - 0.07, PH - 0.07, 0.12), []);
  const island = useMemo(() => screenGeometry(0.26, 0.07, 0.035), []);
  const k = ease(f, 0, Math.round(L.fps * 0.9));
  const inK = pop(f, L.fps, 0, 140, 14);
  const side = p.side === 'left' ? -1 : 1;
  const rotY = (1 - k) * -1.3 * side + 0.26 * side + Math.sin(f / (L.fps * 1.1)) * 0.06;
  const rotX = 0.06 + Math.sin(f / (L.fps * 1.6)) * 0.03;
  const floatY = Math.sin(f / (L.fps * 0.7)) * 0.04;
  const px = L.portrait ? 0 : -1.05;
  const py = L.portrait ? -0.32 : -0.05;
  const ts = pop(f, L.fps, 6, 220, 13);
  const fs = Math.min(110 * L.u, fitSize(title, L.u, L.portrait, 130));
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(b.primary, 0.25)} 0%, ${b.bg} 50%, #000 100%)`}}>
      <ThreeCanvas width={L.W} height={L.H} camera={{fov: 30, position: [0, 0, 7.6]}} gl={{antialias: true, preserveDrawingBuffer: true}}>
        <Env />
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <pointLight position={[-2.5, 1.5, -1.5]} intensity={18} color={b.primary} />
        <pointLight position={[2.5, -1.5, -1]} intensity={10} color={b.secondary} />
        <group position={[px, py + floatY, 0]} rotation={[rotX, rotY, 0]} scale={0.8 + 0.2 * inK}>
          <mesh geometry={body}>
            <meshStandardMaterial color={p.phoneColor ?? '#1C1C22'} metalness={0.85} roughness={0.28} />
          </mesh>
          <mesh geometry={scr} position={[0, 0, 0.061]}>
            <Screen src={p.media} aspect={(PW - 0.07) / (PH - 0.07)} />
          </mesh>
          <mesh geometry={island} position={[0, PH / 2 - 0.12, 0.062]}>
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
      </ThreeCanvas>
      {title && (
        <div style={{position: 'absolute', left: L.portrait ? L.pad : L.W * 0.5, right: L.pad, top: L.portrait ? L.H * 0.14 : L.H * 0.3, textAlign: L.portrait ? 'center' : 'left', fontFamily: b.fH, fontSize: fs, lineHeight: 1.02, color: b.text, textTransform: 'uppercase', transform: `translateY(${(1 - ts) * -40 * L.u}px)`, opacity: ts, textShadow: '0 6px 24px rgba(0,0,0,.6)'}}>{title}</div>
      )}
      {sub && (
        <div style={{position: 'absolute', left: L.portrait ? 0 : L.W * 0.5, right: L.portrait ? 0 : L.pad, top: L.portrait ? L.H * 0.14 + fs * 2.2 : L.H * 0.55, display: 'flex', justifyContent: L.portrait ? 'center' : 'flex-start', transform: `scale(${pop(f, L.fps, 14, 240, 12)})`}}>
          <Pill text={sub} bg={b.primary} color={ink(b.primary)} size={40 * L.u} font={b.fB} />
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- D6 coins rain ---------------- */

const coinFace = (symbol: string, font: string) => {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(100, 90, 20, 128, 128, 128);
  gr.addColorStop(0, '#FFF2B0');
  gr.addColorStop(0.6, '#F2C230');
  gr.addColorStop(1, '#B8860B');
  g.fillStyle = gr;
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = 'rgba(120,80,0,.6)';
  g.lineWidth = 12;
  g.beginPath();
  g.arc(128, 128, 104, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = 'rgba(120,80,0,.85)';
  g.font = `900 150px ${font}, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(symbol, 128, 136);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

export const coinsTitleAt = (fps: number) => Math.round(fps * 0.35);

/** D6: gold coins rain and spin in 3D behind a big headline (price, savings, "SALE") */
export const CoinsRain: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const title = txt(p.title, '₱999');
  const sub = txt(p.sub, 'Sulit na ad package');
  const n = Math.max(8, Math.min(70, Number(p.count ?? 36)));
  const face = useMemo(() => coinFace(txt(p.symbol, '₱'), 'sans-serif'), [p.symbol]);
  const geo = useMemo(() => new THREE.CylinderGeometry(0.3, 0.3, 0.06, 48), []);
  const mats = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({color: '#E0A800', metalness: 1, roughness: 0.3});
    const top = new THREE.MeshStandardMaterial({map: face, metalness: 0.75, roughness: 0.32});
    return [edge, top, top];
  }, [face]);
  const t = f / L.fps;
  const span = L.portrait ? 1.8 : 3.4; // half width of the view at z=0 (fov 30, z 7)
  const coins = range(n).map((i) => {
    const x = (random(`cx${i}`) * 2 - 1) * span;
    const z = (random(`cz${i}`) * 2 - 1) * 1.2;
    const y0 = 2.4 + random(`cy${i}`) * 4.5;
    const v = 1.4 + random(`cv${i}`) * 1.4;
    const y = y0 - v * t - 0.9 * t * t;
    return {x, y, z, rx: t * (2 + random(`rx${i}`) * 4) + i, rz: t * (1 + random(`rz${i}`) * 3) + i * 0.7, s: 0.7 + random(`cs${i}`) * 0.6};
  });
  const ts = pop(f, L.fps, coinsTitleAt(L.fps), 260, 11);
  const sh = shake(f, coinsTitleAt(L.fps) + 2, 8, 12 * L.u);
  const size = Math.min(L.portrait ? 300 * L.u : 260 * L.u, ((L.W * 0.86) / Math.max(3, title.length)) * 1.55);
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${alpha('#F2C230', 0.22)} 0%, ${b.bg} 55%, #000 100%)`}}>
      <ThreeCanvas width={L.W} height={L.H} camera={{fov: 30, position: [0, 0, 7]}} gl={{antialias: true, preserveDrawingBuffer: true}}>
        <Env />
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 5, 4]} intensity={2.4} />
        {coins.map((c, i) => (
          <mesh key={i} geometry={geo} material={mats} position={[c.x, c.y, c.z]} rotation={[c.rx, 0, c.rz]} scale={c.s} />
        ))}
      </ThreeCanvas>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.portrait ? L.mid - size * 0.75 : L.H * 0.5 - size * 0.7, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translate(${sh.x}px, ${sh.y}px) scale(${f >= coinsTitleAt(L.fps) ? 2.2 - 1.2 * ts : 0})`}}>
        <div style={{fontFamily: b.fH, fontSize: size, lineHeight: 1, color: p.color ?? '#FFD24A', textShadow: `0 ${8 * L.u}px 0 ${mix('#B8860B', 0.2)}, 0 0 ${60 * L.u}px ${alpha('#FFD24A', 0.6)}`, whiteSpace: 'nowrap'}}>{title}</div>
      </div>
      {sub && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.mid + size * 0.45 : L.H * 0.5 + size * 0.5, textAlign: 'center', fontFamily: b.fB, fontWeight: 800, fontSize: 50 * L.u, color: b.text, opacity: ease(f, coinsTitleAt(L.fps) + 6, coinsTitleAt(L.fps) + 14), textShadow: '0 4px 16px rgba(0,0,0,.85)'}}>{sub}</div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- D1 3D UI cards ---------------- */

const CARDS = [
  {icon: '📈', value: '+120%', label: 'Reach this week'},
  {icon: '💬', value: '48', label: 'New messages'},
  {icon: '🛒', value: '12', label: 'Orders today'},
];
export const cardsList = (p: P): {icon?: string; value?: string; label?: string; image?: string}[] => (Array.isArray(p.cards) && p.cards.length ? p.cards : CARDS).slice(0, 4);
export const cardTimes = (k: number, fps: number) => range(k).map((i) => Math.round(fps * 0.25) + i * 7);

/** D1: glass UI cards (stats, posts, screenshots) float in 3D at different depths while the camera drifts */
export const Cards3D: React.FC<SceneProps> = ({p}) => {
  const f = useCurrentFrame();
  const L = useLayout();
  const b = useBrand();
  const cards = cardsList(p);
  const ts = cardTimes(cards.length, L.fps);
  const title = txt(p.title, 'Ganito ang resulta');
  const cw = L.portrait ? L.W * 0.66 : L.W * 0.32;
  const ch = (cards.some((c) => c.image) ? 1.25 : 0.36) * cw;
  const gap = L.portrait ? Math.min(ch * 1.05, (L.H * 0.5) / cards.length) : 0;
  const camY = -16 + Math.sin(f / (L.fps * 1.3)) * 7;
  const camX = 10 + Math.sin(f / (L.fps * 1.7)) * 4;
  const tk = pop(f, L.fps, 0, 220, 13);
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(b.secondary, 0.35)} 0%, ${b.bg} 55%, #000 100%)`, overflow: 'hidden'}}>
      {p.bg && <Img src={asset(p.bg)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25, filter: `blur(${12 * L.u}px)`}} />}
      <Glow color={b.primary} strength={0.18} y="55%" />
      {title && (
        <div style={{position: 'absolute', left: L.pad, right: L.pad, top: L.portrait ? L.H * 0.14 : L.H * 0.08, textAlign: 'center', fontFamily: b.fH, fontSize: Math.min(110 * L.u, fitSize(title, L.u, L.portrait, 130)), lineHeight: 1.02, color: b.text, textTransform: 'uppercase', opacity: tk, transform: `translateY(${(1 - tk) * -40 * L.u}px)`}}>{title}</div>
      )}
      <AbsoluteFill style={{perspective: 1500 * L.u, alignItems: 'center', justifyContent: 'center', paddingTop: L.portrait ? L.H * 0.1 : L.H * 0.12}}>
        <div style={{position: 'relative', width: L.portrait ? cw : cw * cards.length + 40 * L.u * (cards.length - 1), height: L.portrait ? gap * (cards.length - 1) + ch : ch, transformStyle: 'preserve-3d', transform: `rotateX(${camX}deg) rotateY(${camY}deg)`}}>
          {cards.map((c, i) => {
            const k = pop(f, L.fps, ts[i], 170, 14);
            const z = (cards.length / 2 - i) * 90 * L.u;
            const x = L.portrait ? (i % 2 ? 1 : -1) * cw * 0.12 : i * (cw + 40 * L.u);
            const y = L.portrait ? i * gap : 0;
            const bob = Math.sin(f / (L.fps * 0.6) + i) * 8 * L.u;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y + bob,
                  width: cw,
                  height: ch,
                  boxSizing: 'border-box',
                  borderRadius: 32 * L.u,
                  background: `linear-gradient(135deg, ${alpha('#FFFFFF', 0.2)}, ${alpha('#FFFFFF', 0.06)})`,
                  border: `${2 * L.u}px solid ${alpha('#FFFFFF', 0.35)}`,
                  backdropFilter: `blur(${16 * L.u}px)`,
                  boxShadow: `0 ${30 * L.u}px ${60 * L.u}px rgba(0,0,0,.45), inset 0 ${2 * L.u}px 0 ${alpha('#FFFFFF', 0.3)}`,
                  transform: `translateZ(${z - (1 - k) * 900 * L.u}px)`,
                  opacity: Math.min(1, k * 1.6),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 28 * L.u,
                  padding: c.image ? 14 * L.u : `0 ${36 * L.u}px`,
                  overflow: 'hidden',
                }}
              >
                {c.image ? (
                  <Img src={asset(c.image)} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 22 * L.u}} />
                ) : (
                  <>
                    {c.icon && <div style={{width: ch * 0.62, height: ch * 0.62, borderRadius: '50%', background: alpha(b.primary, 0.2), border: `${3 * L.u}px solid ${b.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: ch * 0.32, flexShrink: 0}}>{c.icon}</div>}
                    <div style={{minWidth: 0}}>
                      {c.value && <div style={{fontFamily: b.fH, fontSize: ch * 0.42, lineHeight: 1, color: b.primary}}>{c.value}</div>}
                      {c.label && <div style={{fontFamily: b.fB, fontWeight: 700, fontSize: ch * 0.17, color: alpha(b.text, 0.85), marginTop: 6 * L.u, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{c.label}</div>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
