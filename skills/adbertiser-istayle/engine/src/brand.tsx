import React, {createContext, useContext} from 'react';
import * as Anton from '@remotion/google-fonts/Anton';
import * as Poppins from '@remotion/google-fonts/Poppins';
import * as PermanentMarker from '@remotion/google-fonts/PermanentMarker';
import * as SpecialElite from '@remotion/google-fonts/SpecialElite';
import * as PlayfairDisplay from '@remotion/google-fonts/PlayfairDisplay';
import * as Montserrat from '@remotion/google-fonts/Montserrat';
import * as BebasNeue from '@remotion/google-fonts/BebasNeue';
import * as Inter from '@remotion/google-fonts/Inter';
import * as Bangers from '@remotion/google-fonts/Bangers';
import * as PressStart2P from '@remotion/google-fonts/PressStart2P';
import * as Gaegu from '@remotion/google-fonts/Gaegu';
import type {Brand} from './types';

type FontModule = {
  loadFont: (style?: string, opts?: {weights?: string[]; subsets?: string[]}) => {fontFamily: string};
  getInfo: () => {fontFamily: string; fonts: Record<string, Record<string, Record<string, string>>>};
};

// Bundled Google Fonts (OFL). Any other family name is used as a locally installed font.
const FONTS = {
  Anton,
  Poppins,
  'Permanent Marker': PermanentMarker,
  'Special Elite': SpecialElite,
  'Playfair Display': PlayfairDisplay,
  Montserrat,
  'Bebas Neue': BebasNeue,
  Inter,
  Bangers,
  'Press Start 2P': PressStart2P,
  Gaegu,
} as unknown as Record<string, FontModule>;

const cache = new Map<string, string>();

export const font = (family: string, weights: number[] = [400, 700]): string => {
  const key = `${family}|${weights.join(',')}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const mod = FONTS[family];
  if (!mod) {
    cache.set(key, family);
    return family;
  }
  const normal = mod.getInfo().fonts.normal ?? {};
  const have = Object.keys(normal);
  const w = weights.map(String).filter((x) => have.includes(x));
  const first = normal[w[0] ?? have[0]] ?? {};
  const subsets = ['latin'].filter((s) => s in first);
  const {fontFamily} = mod.loadFont('normal', {
    weights: w.length ? w : [have[0]],
    subsets: subsets.length ? subsets : Object.keys(first).slice(0, 1),
  });
  cache.set(key, fontFamily);
  return fontFamily;
};

export const DEFAULT_BRAND: Brand = {
  name: 'YOUR BRAND',
  primary: '#FFD23F',
  secondary: '#7C5CFF',
  bg: '#0E0E12',
  text: '#FFFFFF',
  paper: '#F2EADB',
  font: 'Poppins',
  headingFont: 'Anton',
  handFont: 'Permanent Marker',
  cta: 'MESSAGE US',
};

export type Theme = Brand & {fH: string; fB: string; fHand: string; fType: string; fSerif: string};

const Ctx = createContext<Theme | null>(null);

const makeTheme = (brand?: Partial<Brand>): Theme => {
  const b: Brand = {...DEFAULT_BRAND, ...(brand ?? {})};
  const body = font(b.font, [400, 600, 700, 800, 900]);
  // body font + sans-serif as fallback for glyphs a display font lacks (₱, accents)
  const stack = (f: string) => `'${f}', '${body}', sans-serif`;
  return {
    ...b,
    fH: stack(font(b.headingFont, [400, 700, 900])),
    fB: `'${body}', sans-serif`,
    fHand: stack(font(b.handFont, [400])),
    fType: stack(font('Special Elite', [400])),
    fSerif: stack(font('Playfair Display', [700, 900])),
  };
};

export const BrandProvider: React.FC<{brand?: Partial<Brand>; children: React.ReactNode}> = ({brand, children}) => (
  <Ctx.Provider value={makeTheme(brand)}>{children}</Ctx.Provider>
);

export const useBrand = (): Theme => useContext(Ctx) ?? makeTheme();
