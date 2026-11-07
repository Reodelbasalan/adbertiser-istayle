export type Brand = {
  name: string;
  primary: string; // highlight / accent color
  secondary: string;
  bg: string;
  text: string;
  paper: string; // paper styles base color
  font: string; // body font (bundled Google font or a locally installed family)
  headingFont: string;
  handFont: string;
  logo?: string;
  cta: string;
  handle?: string;
};

export type Sfx = {at: number; name: string; volume?: number}; // at = seconds from scene start

export type Scene = {
  style: string; // style ID from the catalog, e.g. "C1"
  dur: number; // seconds
  props?: Record<string, any>;
  transition?: string; // transition ID used to ENTER this scene, e.g. "H9"
  sfx?: Sfx[];
};

export type Word = {w: string; s: number; e: number};

export type Job = {
  name?: string;
  size?: '9:16' | '16:9' | '1:1' | '4:5';
  fps?: number;
  brand?: Partial<Brand>;
  scenes: Scene[];
  audio?: {vo?: string; music?: string; musicVolume?: number; voVolume?: number};
  captions?: {style?: string; words?: Word[]; y?: number};
  overlays?: {watermark?: boolean; grain?: number; vignette?: boolean; sample?: boolean};
  sfx?: boolean; // auto SFX on (default true)
  sfxVolume?: number;
  sfxAvailable?: string[]; // filled in by render.mjs
};

export type SceneProps = {p: Record<string, any>; dur: number}; // dur in frames
