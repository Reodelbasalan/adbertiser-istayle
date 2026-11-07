import type React from 'react';
import {ChatStory, CommentReply, Notifications} from './scenes/social';
import {Doodle} from './scenes/doodle';
import {EndCard} from './scenes/endcard';
import {Newspaper, ServicesGrid, StatCounters} from './scenes/data';
import {PaperCutout, Scrapbook, StickyNotes, TornReveal} from './scenes/paper';
import {FootageShot, PriceSlam, ProductHero, TextBehind} from './scenes/product';
import {HookQuestion, KineticText, POVHook} from './scenes/text';
import {Cards3D, CoinsRain, Logo3D, Phone3D, Text3D, cardTimes, cardsList, coinsTitleAt, textLand} from './scenes/depth3d';
import {BrutalCTA, BrutalGrid, BrutalTitle, Marquee, PhotoBlock, cellList, cellTimes} from './scenes/brutal';
import {IsoBlocks, IsoCTA, IsoPath, IsoTowers, blockList, blockTimes, pathSteps, pathTimes} from './scenes/iso';
import {MapCTA, MapPins, MapRadius, MapRoute, pinList, pinTimes, routeEnd} from './scenes/mapz';
import {GameHud, PixelCTA, PixelLoad, PixelTitle, hudLevelAt, loadEnd} from './scenes/pixel';
import {CrayonCTA, CrayonDoodles, CrayonList, CrayonTitle, crayonItems, crayonTimes, doodleList, doodleTimes} from './scenes/crayon';
import {BigNumber, DataCTA, Donut, LineNote, RankBars, bigEnd, lineMarkAt, rankList} from './scenes/dataviz';
import {CrtTv, VhsCTA, VhsFootage, VhsTitle, Y2KChrome} from './scenes/retro';
import {Editorial, MinimalCTA, MinimalFeatures, MinimalProduct, MinimalTitle, minimalItems, minimalTimes} from './scenes/minimal';
import {DepthCTA, DepthTitle, Parallax} from './scenes/depth25';
import {CineEnd, CineFlash, CineShot, CineStatement, CineTitle, flashTimes, flashWords} from './scenes/cinematic';
import {ComicBubble, ComicCTA, ComicPanels, ComicPrice, ComicTitle, burstAt, panelList, panelTimes, priceSlamAt} from './scenes/comic';
import {Flow, LineIcons, MarkerCTA, MarkerList, MarkerTitle, SketchChart, chartEnd, ctaWriteEnd, flowNodes, flowTimes, iconItems, iconTimes, markerItems, markerTimes, writeEnd} from './scenes/whiteboard';
import {CursorDemo, Dashboard, GlassCTA, GlassPricing, GlassTitle, Workflow, clickTimes, cursorButtons, stepTimes, stepsList, tierList, tierTimes} from './scenes/glass';
import {HoloHUD, HoloProduct, NeonCTA, NeonList, NeonPrice, NeonSign, ctaOn, hudItems, hudTimes, listTimes, neonItems, priceOn, signTimes} from './scenes/neon';
import {Bars3D, FlyThrough, ProductSpin, Title3D, barTimes, barsList, flyCount} from './scenes/depth3d2';
import {ButtonPress, CommentKeyword, GreenScreen, MythFact, OldVsNew, SlotsCounter, SplitDialogue, UsVsThem, commentTimes, dialogAt, mythTimes, oldNewTimes, pressTimes, slotTimes, vsAt} from './scenes/formats';
import type {SceneProps} from './types';

type Ev = {at: number; name: string; volume?: number}; // at = frame inside the scene
type P = Record<string, any>;

export type Entry = {
  name: string;
  C: React.FC<SceneProps>;
  dur: number; // default seconds
  props?: P; // fixed variant props
  sfx?: (p: P, dur: number, fps: number) => Ev[];
};

const n = (v: unknown, fallback: number) => (Array.isArray(v) && v.length ? v.length : fallback);
const wc = (s: unknown, fallback: number) => (typeof s === 'string' ? s.split(/\s+/).filter(Boolean).length : fallback);
const range = (k: number) => Array.from({length: k}, (_, i) => i);

const hookSfx = (p: P, _d: number, fps: number): Ev[] => [
  {at: 0, name: p.big ? 'impact' : 'whoosh_fast'},
  {at: (p.big ? 7 : 0) + wc(p.text, 3) * 3 + 6, name: 'pop', volume: 0.8},
  ...(p.sub ? [{at: Math.round(fps * 0.9), name: 'click', volume: 0.6}] : []),
];

const priceSfx = (p: P, _d: number, fps: number): Ev[] => {
  const at = Math.round((p.slamAt ?? 0.5) * fps);
  return [{at: 0, name: 'whoosh_soft'}, {at, name: 'impact'}, {at: at + 6, name: 'ding', volume: 0.7}];
};

/** templates that show their own big text: captions hide there unless scene.captions === true */
export const OWN_TEXT = new Set(['J1', 'J8', 'B1', 'A4', 'B3', 'B4', 'J12', 'A6', 'J7', 'B5', 'B7', 'B10', 'C1', 'C2', 'C3', 'C4', 'J10', 'F1', 'J3', 'F6', 'J4', 'G6', 'J9', 'K7', 'K1', 'K4', 'A8', 'A17', 'A18', 'A20', 'J11', 'K2', 'K3', 'D3', 'D5', 'D6', 'K8', 'D1', 'D7', 'D4', 'G11', 'D9', 'B12', 'B26', 'B27', 'B28', 'B29', 'K9', 'B17', 'B2', 'B22', 'B23', 'B30', 'K10', 'B31', 'B25', 'B32', 'B33', 'B34', 'K11', 'B35', 'B19', 'B36', 'B37', 'K12', 'B38', 'B40', 'B41', 'K13', 'D11', 'K14', 'B13', 'B43', 'B44', 'K15', 'B15', 'B45', 'B46', 'B47', 'K16', 'B16', 'B48', 'B49', 'B50', 'K17', 'B6', 'B51', 'B52', 'K18', 'B8', 'B53', 'B54', 'K19', 'B55', 'B56', 'B57', 'K20', 'C8', 'C10', 'C11', 'K21', 'B58', 'B59', 'B60', 'B61', 'K22']);

export const REGISTRY: Record<string, Entry> = {
  // hooks + text
  J1: {name: 'Bold question hook', C: HookQuestion, dur: 2.5, sfx: hookSfx},
  J8: {name: 'Number hook', C: HookQuestion, dur: 2.5, props: {big: '3', text: 'Mali sa ads mo', highlight: 'mali'}, sfx: hookSfx},
  B1: {name: 'Kinetic typography', C: KineticText, dur: 3, sfx: (p, d) => {
    const k = n(p.lines, 3);
    return range(k).map((i) => ({at: Math.round((i * d) / k), name: i === k - 1 ? 'impact' : 'whoosh_fast', volume: 0.8}));
  }},
  A4: {name: 'POV text hook', C: POVHook, dur: 3, sfx: () => [{at: 0, name: 'typing', volume: 0.6}]},
  // social
  B3: {name: 'Chat story', C: ChatStory, dur: 5, sfx: (p, d, fps) => {
    const msgs: P[] = p.messages ?? [{from: 'them'}, {from: 'me'}, {from: 'them'}, {from: 'me'}];
    const start = Math.round(fps * 0.5);
    const gap = Math.max(10, (d - start - fps * 0.6) / msgs.length);
    return msgs.map((m, i) => ({at: Math.round(start + i * gap), name: m.from === 'me' ? 'pop' : 'notif', volume: 0.7}));
  }},
  B4: {name: 'Notification stack', C: Notifications, dur: 4, sfx: (p, d, fps) => {
    const k = n(p.items, 4);
    const gap = Math.max(8, (d - fps * 0.8) / k);
    return range(k).map((i) => ({at: Math.round(fps * 0.4 + i * gap), name: 'notif', volume: 0.7}));
  }},
  J12: {name: 'Notification ping hook', C: Notifications, dur: 2.5, sfx: (p, d, fps) => range(n(p.items, 4)).map((i) => ({at: Math.round(fps * 0.4 + i * Math.max(8, (d - fps * 0.8) / n(p.items, 4))), name: 'notif', volume: 0.7}))},
  A6: {name: 'Reply to comment', C: CommentReply, dur: 4, sfx: (_p, _d, fps) => [{at: 4, name: 'notif'}, {at: Math.round(fps * 1.3), name: 'whoosh_soft', volume: 0.6}, {at: Math.round(fps * 1.8), name: 'pop'}]},
  J7: {name: 'Comment reply hook', C: CommentReply, dur: 3, sfx: (_p, _d, fps) => [{at: 4, name: 'notif'}, {at: Math.round(fps * 1.8), name: 'pop'}]},
  // motion graphics
  B5: {name: 'Infographic counters', C: StatCounters, dur: 3.5, sfx: (p) => range(n(p.stats, 3)).map((i) => ({at: 6 + i * 8, name: 'pop', volume: 0.7}))},
  B7: {name: 'Services grid', C: ServicesGrid, dur: 3.5, sfx: (p) => range(Math.min(6, n(p.items, 6))).map((i) => ({at: 6 + i * 4, name: 'pop', volume: 0.55}))},
  B10: {name: 'Newspaper headline', C: Newspaper, dur: 3.5, sfx: (_p, _d, fps) => [{at: 0, name: 'whoosh'}, {at: Math.round(fps * 0.7) + 4, name: 'impact'}]},
  B11: {name: 'Doodle on footage', C: Doodle, dur: 3.5, sfx: (p, _d, fps) => {
    const marks: P[] = p.marks ?? [{}, {}, {}];
    return marks.map((m, i) => ({at: Math.round((m.at ?? 0.35 + i * 0.6) * fps), name: 'scribble', volume: 0.7}));
  }},
  // paper + craft
  C1: {name: 'Paper cutout stop-motion', C: PaperCutout, dur: 4, sfx: (p) => {
    const letters = String(p.title ?? 'Fresh Daily').replace(/\s/g, '').length;
    const at = 6 + letters * 2 + 6;
    return [{at: 2, name: 'paper'}, ...range(n(p.items, 3)).map((i) => ({at: at + i * 4, name: 'pop', volume: 0.6}))];
  }},
  C2: {name: 'Scrapbook collage', C: Scrapbook, dur: 4, sfx: (p) => [{at: 0, name: 'paper', volume: 0.7}, ...range(Math.min(4, n(p.photos, 3))).map((i) => ({at: 8 + i * 12, name: 'shutter', volume: 0.7}))]},
  C3: {name: 'Sticky notes', C: StickyNotes, dur: 4.5, sfx: (p, d) => {
    const k = n(p.notes, 4);
    const allIn = 10 + k * 7 + 8;
    const gap = Math.max(6, (d - allIn - 10) / k);
    return [...range(k).map((i) => ({at: 10 + i * 7, name: 'pop', volume: 0.7})), ...(p.check === false ? [] : range(k).map((i) => ({at: Math.round(allIn + i * gap), name: 'scribble', volume: 0.6})))];
  }},
  C4: {name: 'Torn paper reveal', C: TornReveal, dur: 3, sfx: (p, d, fps) => [{at: Math.round((p.tearAt ?? Math.min(1.2, (d / fps) * 0.35)) * fps), name: 'rip'}]},
  J10: {name: 'Paper rip open', C: TornReveal, dur: 2.5, props: {tearAt: 0.5}, sfx: (_p, _d, fps) => [{at: Math.round(0.5 * fps), name: 'rip'}]},
  // product
  F1: {name: 'Product hero', C: ProductHero, dur: 3, sfx: (_p, _d, fps) => [{at: 0, name: 'whoosh_soft'}, {at: Math.round(fps * 0.5), name: 'sparkle', volume: 0.6}]},
  J3: {name: 'Product slam hook', C: ProductHero, dur: 2.5, props: {drop: true}, sfx: (_p, _d, fps) => [{at: 0, name: 'whoosh_fast'}, {at: Math.round(fps * 0.45), name: 'impact'}]},
  F6: {name: 'Price tag slam', C: PriceSlam, dur: 3, sfx: priceSfx},
  J4: {name: 'Price reveal hook', C: PriceSlam, dur: 2.5, sfx: priceSfx},
  G6: {name: 'Text behind subject', C: TextBehind, dur: 3, sfx: () => [{at: 0, name: 'whoosh_low'}]},
  J9: {name: 'Text behind subject hook', C: TextBehind, dur: 2.5, sfx: () => [{at: 0, name: 'whoosh_low'}]},
  U1: {name: 'Footage / photo shot', C: FootageShot, dur: 3, sfx: (p, _d, fps) => (p.title ? [{at: Math.round((p.titleAt ?? 0.3) * fps), name: 'pop', volume: 0.7}] : [])},
  // ad formats
  A5: {name: 'Green screen reaction', C: GreenScreen, dur: 4, sfx: (p) => [{at: 0, name: 'whoosh_soft'}, {at: 6, name: 'pop', volume: 0.7}, ...(p.title === false || p.title === '' ? [] : [{at: 10, name: 'click', volume: 0.6}])]},
  A8: {name: 'Split-screen dialogue', C: SplitDialogue, dur: 5, sfx: (p, d, fps) => [{at: 0, name: 'whoosh_fast', volume: 0.7}, ...dialogAt(p, d, fps).map((at, i) => ({at, name: 'pop', volume: i % 2 ? 0.8 : 0.65}))]},
  A17: {name: 'Myth vs fact', C: MythFact, dur: 4, sfx: (p, d, fps) => {
    const t = mythTimes(p, d, fps);
    return [{at: 0, name: 'whoosh_fast'}, {at: t.xAt, name: 'error'}, {at: t.flip - 6, name: 'whoosh', volume: 0.7}, {at: t.checkAt, name: 'ding'}];
  }},
  A18: {name: 'Us vs them', C: UsVsThem, dur: 4.5, sfx: (p, d, fps) => [{at: 0, name: 'whoosh_soft'}, ...vsAt(p, d, fps).flatMap((t) => [{at: t + 4, name: 'click', volume: 0.5}, {at: t + 9, name: 'pop', volume: 0.8}])]},
  A20: {name: 'Slots / deadline counter', C: SlotsCounter, dur: 3.5, sfx: (p, d, fps) => {
    if (p.mode === 'timer') return [{at: 0, name: 'whoosh_fast'}, ...range(Math.floor(d / fps)).map((i) => ({at: (i + 1) * fps, name: 'tick', volume: 0.8})).filter((e) => e.at < d)];
    const t = slotTimes(p, d, fps);
    return [{at: 0, name: 'whoosh_fast'}, ...t.ticks.map((at) => ({at, name: 'tick', volume: 0.8})), ...(t.ticks.length ? [{at: t.end, name: 'impact', volume: 0.8}] : [])];
  }},
  J11: {name: 'Old way vs new way', C: OldVsNew, dur: 3, sfx: (p, d, fps) => {
    const t = oldNewTimes(d, fps, p.newAt);
    return [{at: 0, name: 'whoosh_fast'}, {at: t.xAt, name: 'error', volume: 0.6}, {at: t.newAt, name: 'whoosh'}, {at: t.checkAt, name: 'ding', volume: 0.8}];
  }},
  // bold brutalist look
  B16: {name: 'Brutalist title', C: BrutalTitle, dur: 2.5, sfx: (p) => String(p.text ?? 'a|b|c').split('|').filter((x) => x.trim()).map((_, i) => ({at: 3 + i * 6, name: 'impact', volume: 0.6}))},
  B48: {name: 'Marquee bands', C: Marquee, dur: 3, sfx: () => [{at: 0, name: 'whoosh_fast'}, {at: 6, name: 'whoosh_fast', volume: 0.6}]},
  B49: {name: 'Brutalist grid', C: BrutalGrid, dur: 3.5, sfx: (p, _d, fps) => cellTimes(cellList(p).length, fps).map((at) => ({at, name: 'impact', volume: 0.45}))},
  B50: {name: 'Photo block', C: PhotoBlock, dur: 3, sfx: () => [{at: 0, name: 'impact', volume: 0.6}, {at: 8, name: 'pop', volume: 0.6}]},
  // isometric look
  B6: {name: 'Isometric blocks', C: IsoBlocks, dur: 3.5, sfx: (p, _d, fps) => blockTimes(blockList(p).length, fps, p.at).map((at) => ({at, name: 'pop', volume: 0.7}))},
  B51: {name: 'Isometric path', C: IsoPath, dur: 3.5, sfx: (p, d, fps) => pathTimes(pathSteps(p).length, d, fps).map((at) => ({at, name: 'pop', volume: 0.6}))},
  B52: {name: 'Isometric towers', C: IsoTowers, dur: 3.5, sfx: () => [{at: 6, name: 'riser', volume: 0.4}, {at: 30, name: 'ding', volume: 0.6}]},
  // map look
  B8: {name: 'Map pins', C: MapPins, dur: 3.5, sfx: (p, _d, fps) => pinTimes(pinList(p).length, fps, p.at).map((at) => ({at, name: 'pop', volume: 0.7}))},
  B53: {name: 'Map route', C: MapRoute, dur: 4, sfx: (_p, d, fps) => [{at: 10, name: 'whoosh_soft', volume: 0.6}, {at: routeEnd(d, fps), name: 'ding', volume: 0.7}]},
  B54: {name: 'Coverage radius', C: MapRadius, dur: 3, sfx: () => [{at: 4, name: 'whoosh_soft', volume: 0.6}, {at: 16, name: 'pop', volume: 0.7}]},
  // pixel look
  B55: {name: 'Pixel title', C: PixelTitle, dur: 3, sfx: () => [{at: 0, name: 'typing', volume: 0.5}, {at: 26, name: 'typing', volume: 0.4}]},
  B56: {name: 'Game HUD', C: GameHud, dur: 3.5, sfx: (_p, d) => [...[8, 16, 24, 32, 40].map((at) => ({at, name: 'tick', volume: 0.6})), {at: hudLevelAt(d), name: 'ding', volume: 0.8}]},
  B57: {name: 'Pixel loading bar', C: PixelLoad, dur: 3, sfx: (_p, d) => [...[6, 15, 24, 33, 42, 51].filter((t) => t < loadEnd(d)).map((at) => ({at, name: 'tick', volume: 0.5})), {at: loadEnd(d), name: 'ding', volume: 0.8}]},
  // crayon look
  C8: {name: 'Crayon title', C: CrayonTitle, dur: 3, sfx: () => [{at: 2, name: 'scribble', volume: 0.6}, {at: 14, name: 'scribble', volume: 0.5}]},
  C10: {name: 'Crayon doodles', C: CrayonDoodles, dur: 4, sfx: (p, d, fps) => doodleTimes(doodleList(p).length, d, fps, p.at).map((at) => ({at, name: 'scribble', volume: 0.6}))},
  C11: {name: 'Crayon list', C: CrayonList, dur: 4, sfx: (p, d, fps) => crayonTimes(crayonItems(p).length, d, fps, p.at).map((at) => ({at, name: 'scribble', volume: 0.55}))},
  // data-viz look
  B58: {name: 'Big number', C: BigNumber, dur: 3, sfx: (_p, _d, fps) => [{at: 4, name: 'riser', volume: 0.4}, {at: bigEnd(fps), name: 'ding', volume: 0.7}]},
  B59: {name: 'Donut chart', C: Donut, dur: 3, sfx: () => [{at: 6, name: 'whoosh_soft', volume: 0.6}, {at: 40, name: 'pop', volume: 0.6}]},
  B60: {name: 'Ranking bars', C: RankBars, dur: 3.5, sfx: (p) => rankList(p).map((_, i) => ({at: 6 + i * 5, name: 'whoosh_fast', volume: 0.4}))},
  B61: {name: 'Annotated line', C: LineNote, dur: 3.5, sfx: (p, _d, fps) => [{at: 6, name: 'whoosh_soft', volume: 0.5}, {at: lineMarkAt(p, fps), name: 'pop', volume: 0.7}]},
  // retro VHS / Y2K look
  B13: {name: 'VHS title', C: VhsTitle, dur: 2.5, sfx: () => [{at: 0, name: 'glitch', volume: 0.6}, {at: 4, name: 'click', volume: 0.6}]},
  B42: {name: 'VHS footage', C: VhsFootage, dur: 3, sfx: () => [{at: 0, name: 'glitch', volume: 0.4}]},
  B43: {name: 'Y2K chrome text', C: Y2KChrome, dur: 2.5, sfx: () => [{at: 2, name: 'sparkle', volume: 0.7}, {at: 4, name: 'pop', volume: 0.6}]},
  B44: {name: 'CRT TV', C: CrtTv, dur: 3, sfx: () => [{at: 0, name: 'click', volume: 0.7}, {at: 2, name: 'glitch', volume: 0.5}]},
  // minimal luxury look
  B15: {name: 'Minimal title', C: MinimalTitle, dur: 3, sfx: () => [{at: 6, name: 'whoosh_soft', volume: 0.5}]},
  B45: {name: 'Minimal product', C: MinimalProduct, dur: 3.5, sfx: () => [{at: 0, name: 'whoosh_soft', volume: 0.5}, {at: 14, name: 'sparkle', volume: 0.35}]},
  B46: {name: 'Minimal features', C: MinimalFeatures, dur: 4, sfx: (p, d, fps) => minimalTimes(minimalItems(p).length, d, fps, p.at).map((at) => ({at, name: 'click', volume: 0.4}))},
  B47: {name: 'Editorial split', C: Editorial, dur: 3.5, sfx: () => [{at: 0, name: 'whoosh_soft', volume: 0.5}, {at: 14, name: 'paper', volume: 0.4}]},
  // 2.5D look
  D2: {name: '2.5D parallax photo', C: Parallax, dur: 3.5, sfx: (p) => [{at: 0, name: 'whoosh_low', volume: 0.6}, ...(p.title ? [{at: 8, name: 'pop', volume: 0.6}] : [])]},
  D11: {name: 'Title between depth layers', C: DepthTitle, dur: 3, sfx: () => [{at: 2, name: 'whoosh_low'}, {at: 12, name: 'impact', volume: 0.5}]},
  // cinematic film look
  B38: {name: 'Cinematic title', C: CineTitle, dur: 3, sfx: () => [{at: 0, name: 'whoosh_low'}, {at: 6, name: 'riser', volume: 0.4}, {at: 18, name: 'impact', volume: 0.5}]},
  B39: {name: 'Graded film shot', C: CineShot, dur: 3, sfx: () => []},
  B40: {name: 'Trailer statement', C: CineStatement, dur: 3.5, sfx: () => [{at: 0, name: 'whoosh_low', volume: 0.7}]},
  B41: {name: 'Trailer word flash', C: CineFlash, dur: 3, sfx: (p, d) => flashTimes(flashWords(p).length, d).map((at) => ({at, name: 'impact', volume: 0.75}))},
  // comic look
  B35: {name: 'Comic title burst', C: ComicTitle, dur: 2.5, sfx: (_p, _d, fps) => [{at: 0, name: 'whoosh_fast'}, {at: burstAt(fps), name: 'impact'}, {at: burstAt(fps) + 3, name: 'pop', volume: 0.7}]},
  B19: {name: 'Comic panels', C: ComicPanels, dur: 4.5, sfx: (p, d, fps) => panelTimes(panelList(p).length, d, fps, p.at).flatMap((at, i) => [{at, name: i % 2 ? 'whoosh_fast' : 'impact', volume: 0.6}, ...(panelList(p)[i].say ? [{at: at + 6, name: 'pop', volume: 0.6}] : [])])},
  B36: {name: 'Comic speech bubble', C: ComicBubble, dur: 3, sfx: (p, _d, fps) => [{at: Math.round(fps * 0.25), name: 'pop'}, ...(p.caption ? [{at: Math.round(fps * 0.6), name: 'click', volume: 0.6}] : [])]},
  B37: {name: 'Comic price', C: ComicPrice, dur: 3, sfx: (_p, _d, fps) => [{at: 2, name: 'pop'}, {at: priceSlamAt(fps), name: 'impact'}, {at: priceSlamAt(fps) + 4, name: 'ding', volume: 0.7}]},
  // whiteboard look
  B31: {name: 'Marker title', C: MarkerTitle, dur: 3, sfx: (p) => {
    const lines = String(p.text ?? 'Bakit walang|nag-me-message?').split('|').map((x) => x.trim()).filter(Boolean);
    let t = 4;
    const ev: {at: number; name: string; volume?: number}[] = [];
    lines.forEach((l) => {
      ev.push({at: t, name: 'scribble', volume: 0.6});
      t = writeEnd(l, t) + 3;
    });
    return [...ev, {at: t, name: 'scribble', volume: 0.5}];
  }},
  B25: {name: 'Line icons draw-on', C: LineIcons, dur: 3.5, sfx: (p, d, fps) => iconTimes(iconItems(p).length, d, fps, p.at).map((at) => ({at, name: 'scribble', volume: 0.55}))},
  B32: {name: 'Whiteboard flow', C: Flow, dur: 4, sfx: (p, d, fps) => flowTimes(flowNodes(p).length, d, fps, p.at).map((at) => ({at, name: 'scribble', volume: 0.6}))},
  B33: {name: 'Marker list', C: MarkerList, dur: 4.5, sfx: (p, _d, fps) => markerTimes(markerItems(p), fps, p.at).flatMap((at, i) => [{at, name: 'scribble', volume: 0.5}, {at: writeEnd(markerItems(p)[i], at, 0.8), name: 'pop', volume: 0.5}])},
  B34: {name: 'Sketch chart', C: SketchChart, dur: 3.5, sfx: (_p, _d, fps) => [{at: 6, name: 'scribble', volume: 0.5}, {at: 18, name: 'whoosh_soft', volume: 0.6}, {at: chartEnd(fps), name: 'ding', volume: 0.7}]},
  // glass UI look
  B17: {name: 'Glass title', C: GlassTitle, dur: 2.5, sfx: () => [{at: 0, name: 'whoosh_soft'}, {at: 14, name: 'sparkle', volume: 0.5}]},
  B2: {name: 'Dashboard', C: Dashboard, dur: 3.5, sfx: (p) => [{at: 0, name: 'whoosh_soft'}, ...[8, 13, 18].map((at) => ({at, name: 'pop', volume: 0.5})), {at: 14, name: 'riser', volume: 0.35}]},
  B22: {name: 'Cursor demo', C: CursorDemo, dur: 4, sfx: (p, d, fps) => {
    const ts = clickTimes(cursorButtons(p).length, d, fps, p.at);
    return [{at: 0, name: 'whoosh_soft'}, ...ts.map((at) => ({at, name: 'click', volume: 0.9})), {at: (ts[ts.length - 1] ?? 0) + 8, name: 'ding', volume: 0.7}];
  }},
  B23: {name: 'Workflow steps', C: Workflow, dur: 4, sfx: (p, d, fps) => stepTimes(stepsList(p).length, d, fps, p.at).map((at) => ({at, name: 'pop', volume: 0.7}))},
  B30: {name: 'Glass pricing', C: GlassPricing, dur: 3.5, sfx: (p, _d, fps) => [{at: 0, name: 'whoosh_soft'}, ...tierTimes(tierList(p).length, fps).map((at) => ({at, name: 'whoosh_fast', volume: 0.5})), {at: tierTimes(tierList(p).length, fps).slice(-1)[0] + 10, name: 'ding', volume: 0.6}]},
  // neon / hologram look
  B12: {name: 'Neon sign', C: NeonSign, dur: 2.5, sfx: (p, _d, fps) => signTimes(String(p.text ?? 'a|b').split('|').filter((x) => x.trim()).length, fps).map((at) => ({at, name: 'buzz', volume: 0.6}))},
  B26: {name: 'Hologram HUD', C: HoloHUD, dur: 4, sfx: (p, _d, fps) => [{at: 0, name: 'whoosh_soft'}, {at: 6, name: 'buzz', volume: 0.5}, ...hudTimes(hudItems(p).length, fps).map((at) => ({at, name: 'typing', volume: 0.45}))]},
  B27: {name: 'Neon price', C: NeonPrice, dur: 3, sfx: (p, _d, fps) => [{at: 2, name: 'buzz', volume: 0.5}, {at: priceOn(fps), name: 'buzz', volume: 0.7}, {at: priceOn(fps) + 3, name: 'ding', volume: 0.7}, ...(p.oldPrice ? [{at: priceOn(fps) + 14, name: 'scribble', volume: 0.5}] : [])]},
  B28: {name: 'Hologram product', C: HoloProduct, dur: 3.5, sfx: () => [{at: 0, name: 'whoosh_low'}, {at: 4, name: 'buzz', volume: 0.6}, {at: 16, name: 'sparkle', volume: 0.5}]},
  B29: {name: 'Neon checklist', C: NeonList, dur: 4, sfx: (p, _d, fps) => [{at: 2, name: 'buzz', volume: 0.45}, ...listTimes(neonItems(p).length, fps, p.at).map((at) => ({at, name: 'buzz', volume: 0.55}))]},
  // 3D look
  D7: {name: '3D bar chart', C: Bars3D, dur: 3.5, sfx: (p, _d, fps) => [{at: 0, name: 'whoosh_soft'}, ...barTimes(barsList(p).length, fps).map((at, i, a) => ({at: at + 2, name: i === a.length - 1 ? 'ding' : 'tick', volume: 0.7}))]},
  D4: {name: 'Floating product spin', C: ProductSpin, dur: 3.5, sfx: (p, _d, fps) => [{at: 0, name: 'whoosh_low'}, {at: Math.round(fps * 0.4), name: 'sparkle', volume: 0.6}, ...(p.title || p.sub ? [{at: 10, name: 'pop', volume: 0.6}] : [])]},
  D9: {name: 'Photo fly-through', C: FlyThrough, dur: 4, sfx: (p, d) => range(flyCount(p)).map((i) => ({at: Math.round((i * d) / Math.max(1, flyCount(p))), name: 'whoosh', volume: 0.6}))},
  G11: {name: '3D title on footage', C: Title3D, dur: 3, sfx: (p, _d, fps) => {
    const at = Math.round((p.titleAt ?? 0.2) * fps);
    return [{at, name: 'whoosh_fast'}, {at: at + Math.round(fps * 0.45), name: 'impact', volume: 0.7}];
  }},
  D1: {name: '3D UI cards', C: Cards3D, dur: 3.5, sfx: (p, _d, fps) => [{at: 0, name: 'whoosh_soft'}, ...cardTimes(cardsList(p).length, fps).map((at) => ({at: at + 4, name: 'pop', volume: 0.7}))]},
  D3: {name: '3D text reveal', C: Text3D, dur: 2.5, sfx: (_p, _d, fps) => [{at: 0, name: 'whoosh_low'}, {at: textLand(fps), name: 'impact'}, {at: textLand(fps) + 4, name: 'sparkle', volume: 0.6}]},
  D5: {name: '3D phone mockup', C: Phone3D, dur: 3.5, sfx: (p) => [{at: 0, name: 'whoosh'}, ...(p.title === false || p.title === '' ? [] : [{at: 6, name: 'pop', volume: 0.7}])]},
  D6: {name: 'Coins rain', C: CoinsRain, dur: 3, sfx: (_p, _d, fps) => [{at: 0, name: 'riser', volume: 0.5}, {at: coinsTitleAt(fps), name: 'impact'}, {at: coinsTitleAt(fps) + 3, name: 'ding'}, ...[8, 14, 19, 27, 33].map((at) => ({at: coinsTitleAt(fps) + at, name: 'tick', volume: 0.45}))]},
  K8: {name: '3D logo end card', C: Logo3D, dur: 3, sfx: (_p, _d, fps) => [{at: 0, name: 'whoosh_low'}, {at: Math.round(fps * 0.8), name: 'impact', volume: 0.8}, {at: Math.round(fps * 0.8) + 2, name: 'sparkle', volume: 0.6}, {at: Math.round(fps * 0.8) + 6, name: 'pop', volume: 0.7}]},
  // CTA
  K2: {name: 'Comment keyword CTA', C: CommentKeyword, dur: 3, sfx: (p, d, fps) => {
    const t = commentTimes(p, d, fps);
    return [{at: 5, name: 'impact', volume: 0.8}, {at: t.typeAt, name: 'typing', volume: 0.6}, {at: t.sendAt, name: 'click'}, {at: t.postAt, name: 'notif', volume: 0.8}];
  }},
  K3: {name: 'Button press CTA', C: ButtonPress, dur: 2.5, sfx: (p, d, fps) => {
    const {pressAt} = pressTimes(p, d, fps);
    return [{at: 0, name: 'whoosh_soft'}, {at: pressAt, name: 'click'}, {at: pressAt + 2, name: 'sparkle', volume: 0.7}];
  }},
  K9: {name: 'Neon CTA', C: NeonCTA, dur: 2.5, sfx: (_p, _d, fps) => [{at: 2, name: 'buzz', volume: 0.5}, {at: ctaOn(fps), name: 'buzz', volume: 0.7}, {at: ctaOn(fps) + 4, name: 'pop', volume: 0.6}]},
  K10: {name: 'Glass CTA', C: GlassCTA, dur: 2.8, sfx: () => [{at: 0, name: 'whoosh_soft'}, {at: 12, name: 'pop', volume: 0.7}, {at: 20, name: 'sparkle', volume: 0.5}]},
  K11: {name: 'Marker CTA', C: MarkerCTA, dur: 3, sfx: (p) => {
    const end = ctaWriteEnd(p, String(p.cta ?? 'MESSAGE US'));
    return [{at: 2, name: 'scribble', volume: 0.5}, {at: end - 8, name: 'scribble', volume: 0.6}, {at: end, name: 'scribble', volume: 0.5}, {at: end + 10, name: 'pop', volume: 0.6}];
  }},
  K12: {name: 'Comic CTA', C: ComicCTA, dur: 2.5, sfx: () => [{at: 0, name: 'whoosh_fast'}, {at: 8, name: 'impact', volume: 0.8}, {at: 14, name: 'pop', volume: 0.6}]},
  K13: {name: 'Cinematic end card', C: CineEnd, dur: 3, sfx: () => [{at: 0, name: 'whoosh_low'}, {at: 10, name: 'sparkle', volume: 0.4}, {at: 18, name: 'impact', volume: 0.5}]},
  K14: {name: 'Depth CTA', C: DepthCTA, dur: 3, sfx: () => [{at: 0, name: 'whoosh_soft'}, {at: 6, name: 'pop', volume: 0.7}]},
  K15: {name: 'VHS CTA', C: VhsCTA, dur: 2.5, sfx: () => [{at: 0, name: 'click', volume: 0.7}, {at: 6, name: 'glitch', volume: 0.4}]},
  K16: {name: 'Minimal CTA', C: MinimalCTA, dur: 3, sfx: () => [{at: 14, name: 'click', volume: 0.5}]},
  K17: {name: 'Brutalist CTA', C: BrutalCTA, dur: 2.5, sfx: () => [{at: 0, name: 'impact', volume: 0.6}, {at: 8, name: 'impact', volume: 0.4}, {at: 16, name: 'impact', volume: 0.4}]},
  K18: {name: 'Isometric CTA', C: IsoCTA, dur: 2.8, sfx: () => [{at: 2, name: 'pop', volume: 0.6}, {at: 14, name: 'pop', volume: 0.7}]},
  K19: {name: 'Map CTA', C: MapCTA, dur: 3, sfx: () => [{at: 0, name: 'whoosh_soft'}, {at: 4, name: 'pop', volume: 0.6}, {at: 14, name: 'pop', volume: 0.6}]},
  K20: {name: 'Press start CTA', C: PixelCTA, dur: 2.5, sfx: () => [{at: 12, name: 'ding', volume: 0.7}]},
  K21: {name: 'Crayon CTA', C: CrayonCTA, dur: 3, sfx: () => [{at: 2, name: 'scribble', volume: 0.6}, {at: 12, name: 'scribble', volume: 0.5}]},
  K22: {name: 'Data CTA', C: DataCTA, dur: 3, sfx: () => [{at: 4, name: 'whoosh_soft', volume: 0.5}, {at: 14, name: 'pop', volume: 0.7}]},
  K7: {name: 'Brand end card', C: EndCard, dur: 3, sfx: () => [{at: 0, name: 'whoosh'}, {at: 14, name: 'pop'}]},
  K1: {name: 'One-line CTA', C: EndCard, dur: 2, props: {variant: 'line'}, sfx: () => [{at: 0, name: 'impact', volume: 0.7}]},
  K4: {name: 'Offer card', C: EndCard, dur: 4, props: {variant: 'offer'}, sfx: (p) => {
    const k = n(p.items, 3);
    return [...range(k).map((i) => ({at: 8 + i * 5, name: 'pop', volume: 0.6})), ...(p.price ? [{at: 10 + k * 5, name: 'ding'}] : []), {at: 16 + k * 5, name: 'click'}];
  }},
};
