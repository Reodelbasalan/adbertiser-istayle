import React from 'react';
import {Composition} from 'remotion';
import type {CalculateMetadataFunction} from 'remotion';
import {Istayle, SIZES} from './Istayle';
import {REGISTRY} from './registry';
import {TRANSITIONS} from './Transitions';
import {CAPTION_STYLES} from './Captions';
import type {Job, Word} from './types';

const meta: CalculateMetadataFunction<Job> = ({props}) => {
  const fps = props.fps ?? 30;
  const [width, height] = SIZES[props.size ?? '9:16'] ?? SIZES['9:16'];
  const d = props.scenes.reduce((a, s) => a + Math.max(1, Math.round(s.dur * fps)), 0);
  return {durationInFrames: Math.max(1, d), fps, width, height};
};

const DEMO_WORDS: Word[] = 'Ito yung style na pumapatok ngayon sa ads'.split(' ').map((w, i) => ({w, s: 0.2 + i * 0.32, e: 0.2 + i * 0.32 + 0.28}));

export const DEMO_JOB: Job = {
  name: 'demo',
  size: '9:16',
  brand: {name: 'BANANA CO.'},
  overlays: {watermark: true, grain: 0.12},
  scenes: [
    {style: 'J1', dur: 2.4, props: {text: 'Bakit walang bumibili?', highlight: 'bumibili'}},
    {style: 'C1', dur: 3.6, transition: 'H9', props: {title: 'Crispy Daily', sub: 'Gawa sa totoong saging'}},
    {style: 'C2', dur: 3.4, transition: 'H1'},
    {style: 'B3', dur: 4.2, transition: 'H7'},
    {style: 'F6', dur: 2.8, transition: 'H2', props: {price: '₱100', oldPrice: '₱120', name: '3 packs'}},
    {style: 'K7', dur: 2.6, transition: 'H12', props: {headline: 'Order na today'}},
  ],
};

/** one preview job per style ID, used for gallery stills */
export const previewJob = (id: string): Job => {
  const bg = {style: 'U1', dur: 1, props: {media: 'demo:🌅:25'}};
  if (TRANSITIONS.includes(id)) return {size: '9:16', scenes: [bg, {style: 'U1', dur: 1.2, transition: id, props: {media: 'demo:🌃:250'}}]};
  if (CAPTION_STYLES.includes(id)) return {size: '9:16', scenes: [{style: 'U1', dur: 3.4, props: {media: 'demo:🎤:200'}}], captions: {style: id, words: DEMO_WORDS}};
  if (id === 'I1') return {size: '9:16', scenes: [bg], overlays: {watermark: true}};
  if (id === 'I2') return {size: '9:16', scenes: [bg], overlays: {grain: 0.35}};
  if (id === 'I5') return {size: '9:16', scenes: [bg], overlays: {vignette: true}};
  if (id === 'I10') return {size: '9:16', scenes: [bg], overlays: {sample: true}};
  if (id === 'I3') return {size: '9:16', scenes: [bg], overlays: {lightLeaks: true}};
  if (id === 'I4') return {size: '9:16', scenes: [bg], overlays: {vhs: true}};
  if (id === 'I6') return {size: '9:16', scenes: [bg], overlays: {paper: true}};
  if (id === 'I7') return {size: '9:16', scenes: [bg], overlays: {flare: true}};
  if (id === 'I8') return {size: '9:16', scenes: [bg], overlays: {sparkle: true}};
  const e = REGISTRY[id];
  return {size: '9:16', scenes: [{style: id, dur: e?.dur ?? 3}]};
};

export const PREVIEW_IDS = [...Object.keys(REGISTRY), ...TRANSITIONS, ...CAPTION_STYLES, 'I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I10'];

export const Root: React.FC = () => (
  <>
    <Composition id="Istayle" component={Istayle} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={DEMO_JOB} calculateMetadata={meta} />
    {PREVIEW_IDS.map((id) => (
      <Composition key={id} id={`P-${id}`} component={Istayle} durationInFrames={90} fps={30} width={1080} height={1920} defaultProps={previewJob(id)} calculateMetadata={meta} />
    ))}
  </>
);
