---
name: adbertiser-istayle
description: Adbertiser Istayle — 150+ named video ad styles (paper cutout, scrapbook, sticky notes, torn paper, kinetic text, chat story, notifications, newspaper, doodles, price slam, product hero, text behind subject, captions, transitions, end cards, plus 3D and AI-look recipes) rendered with Remotion from one JSON job file. Use when someone wants a video ad, reel, TikTok, short or promo in a named style ("paper style", "scrapbook", "3D product", "kinetic text", "price reveal", "newspaper style"), asks what styles exist ("anong styles meron", "show styles"), gives style IDs like C1 + G6 + H9, or says "istayle" or "adbertiser".
---

# Adbertiser Istayle

One job file (JSON) → a finished ad. Every style has an ID (C1 paper cutout, G6 text behind subject, H9 paper rip...).
Skill folder: `${CLAUDE_SKILL_DIR}`. Run scripts as `node "${CLAUDE_SKILL_DIR}/scripts/<name>.mjs"`; docs are in `${CLAUDE_SKILL_DIR}/reference/` and `${CLAUDE_SKILL_DIR}/catalog/`.

## 1. First run
If `~/.adbertiser-istayle/engine/node_modules` is missing, run `setup.mjs` once (Node 18+; ffmpeg recommended for SFX and loudness). It takes a few minutes; tell the user.

## 2. Pick styles
- `style.mjs --list` → the menu, one line per style. `style.mjs --list C` → one category.
- `style.mjs paper` or `style.mjs C1` → details + props. Look up only the styles you use; never read the whole catalog.
- `preview.mjs C1,G6,H9` → stills of each style's built-in demo, so the user can see it before choosing.
- Kinds: **template** renders now · **planned** = use its "Meanwhile" hint · **recipe** = needs the user's footage or an outside AI tool; say what to bring.
- "Ikaw na bahala" / "you pick": propose 2 combos (hook + body + CTA + transitions + captions), one line each, and let the user choose.

## 3. Write the job
Create `<project>/job.json` (format: `reference/job.md`; props: the matching sections of `reference/props.md`). Ask only for what is missing: brand colors/logo, product photos or footage, script or VO, length, size.

Ad rules, always:
- Hook in the first 1–3 s with an on-screen line of 6 words or fewer (J styles).
- Something changes every 3–6 s: a new scene, transition, zoom or pop.
- On 9:16 keep key text between 25% and 75% of the height (templates already do).
- Product ads are footage-first: the user's real photos and clips (U1, F1, C2) carry the beats; motion styles are hooks and pattern interrupts.
- End on one clear CTA (K1, K7 or K4) in the last 2–3 s.
- No fake social proof: mock numbers, notifications and dashboards keep their SAMPLE tag; testimonials only from real customers, never stock people.
- Health, beauty and money offers: no before/after, no guaranteed results, no "you" call-outs about personal attributes.
- Faces only of the user or people who consented. No real brand, newspaper or app logos that aren't the user's.

## 4. Preview, then render
1. `render.mjs job.json --stills 1,4,8` (seconds) → read `out/<name>_sheet.jpg`; fix overflowing text and 🎬 placeholders (= a missing media path) before rendering.
2. `render.mjs job.json` → `out/<name>.mp4`, mastered to -14 LUFS / -1 dBTP. Run long renders in the background.
3. Give the user the file path plus 2–3 post caption ideas.

## Sound
Templates fire their own SFX from a kit synthesized at setup (`<engine>/public/sfx`). Any sound can be replaced by a .wav with the same name. Music = the user's own licensed track (`audio.music`); never download copyrighted songs.

## Limits
- One render at a time (jobs are staged in `<engine>/public/jobs`).
- Remotion is free for individuals and small teams; companies of 4+ people need a Remotion company license (remotion.dev/license).
