import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {BrandProvider, useBrand} from './brand';
import {Captions} from './Captions';
import {asset} from './lib/Media';
import {Grain, SampleTag, Vignette, Watermark} from './Overlays';
import {REGISTRY} from './registry';
import {TRANSITION_SFX, TransitionIn} from './Transitions';
import type {Job, Scene, SceneProps} from './types';

export const SIZES: Record<string, [number, number]> = {'9:16': [1080, 1920], '16:9': [1920, 1080], '1:1': [1080, 1080], '4:5': [1080, 1350]};

export const transitionFrames = (fps: number) => Math.round(fps * 0.4);

export const timeline = (scenes: Scene[], fps: number) => {
  let cursor = 0;
  return scenes.map((s) => {
    const d = Math.max(1, Math.round(s.dur * fps));
    const item = {s, from: cursor, d};
    cursor += d;
    return item;
  });
};

const Missing: React.FC<SceneProps & {id: string}> = ({id}) => {
  const b = useBrand();
  return (
    <AbsoluteFill style={{background: '#300', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: b.fB, fontSize: 60, textAlign: 'center'}}>
      Unknown style “{id}”
      <br />
      (not a template yet)
    </AbsoluteFill>
  );
};

const Body: React.FC<Job> = (job) => {
  const {fps} = useVideoConfig();
  const T = transitionFrames(fps);
  const items = timeline(job.scenes, fps);
  const avail = new Set(job.sfxAvailable ?? []);
  const vol = job.sfxVolume ?? 0.5;
  const events: {at: number; name: string; volume?: number}[] = [];
  items.forEach(({s, from, d}, i) => {
    const e = REGISTRY[s.style];
    const p = {...(e?.props ?? {}), ...(s.props ?? {})};
    if (job.sfx !== false && e?.sfx) e.sfx(p, d, fps).forEach((ev) => events.push({...ev, at: from + ev.at}));
    if (job.sfx !== false && i > 0 && s.transition && TRANSITION_SFX[s.transition]) events.push({at: Math.max(0, from - 2), name: TRANSITION_SFX[s.transition], volume: 0.8});
    (s.sfx ?? []).forEach((ev) => events.push({...ev, at: from + Math.round(ev.at * fps)}));
  });
  const vo = job.audio?.vo;
  const music = job.audio?.music;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {items.map(({s, from, d}, i) => {
        const next = items[i + 1];
        const tail = next && next.s.transition && TRANSITION_SFX[next.s.transition] ? T : 0;
        const e = REGISTRY[s.style];
        const p = {...(e?.props ?? {}), ...(s.props ?? {})};
        return (
          <Sequence key={i} from={from} durationInFrames={d + tail} name={`${s.style} ${e?.name ?? ''}`}>
            <TransitionIn type={i > 0 ? s.transition : undefined} frames={T}>
              {e ? <e.C p={p} dur={d} /> : <Missing id={s.style} p={p} dur={d} />}
            </TransitionIn>
          </Sequence>
        );
      })}
      {job.overlays?.vignette && <Vignette />}
      {job.overlays?.grain ? <Grain amount={job.overlays.grain} /> : null}
      {job.captions?.words?.length ? <Captions words={job.captions.words} style={job.captions.style} y={job.captions.y} /> : null}
      {job.overlays?.watermark && <Watermark />}
      {job.overlays?.sample && <SampleTag />}
      {vo && <Audio src={asset(vo)} volume={job.audio?.voVolume ?? 1} />}
      {music && <Audio src={asset(music)} loop volume={job.audio?.musicVolume ?? (vo ? 0.12 : 0.35)} />}
      {events
        .filter((ev) => avail.has(ev.name))
        .map((ev, i) => (
          <Sequence key={`sfx${i}`} from={ev.at} durationInFrames={fps * 2} layout="none">
            <Audio src={staticFile(`sfx/${ev.name}.wav`)} volume={(ev.volume ?? 1) * vol} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};

export const Istayle: React.FC<Job> = (job) => (
  <BrandProvider brand={job.brand}>
    <Body {...job} />
  </BrandProvider>
);
