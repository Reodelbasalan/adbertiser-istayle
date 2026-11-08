# Adbertiser Istayle

**150+ video ad styles for Claude Code. Isang command lang.**

Adbertiser Istayle is a free Claude Code plugin that turns "gawa ka ng ad, paper style" into a finished, captioned, sound-designed video. Every style has an ID (C1 paper cutout, G6 text behind subject, H9 paper rip...), so you can mix them like a menu: `J1 + C1 + F6 + K7`.

- **177 templates render today, in 19 looks: 2D motion, paper and craft, social UI, footage edit, 3D, 2.5D parallax, neon/hologram, glass UI, whiteboard, comic, cinematic film, retro VHS/Y2K, minimal luxury, bold brutalist, isometric, map, pixel/8-bit, crayon and data-viz** (brutalist grids and marquees, isometric blocks, map routes, 8-bit HUDs, crayon doodles, charts, VHS and CRT screens, Y2K chrome, editorial layouts, 2.5D photos with real depth, letterbox titles, trailer flashes, film burns, comic panels and bursts, marker titles, drawn icons and flows, glass dashboard, cursor demo, workflow steps, pricing tiers, neon sign, hologram HUD and product, neon price and CTA, 3D text, 3D phone, 3D cards, 3D bar chart, product spin, photo fly-through, coins rain, cube transition, 3D logo, hooks, paper and craft, chat stories, newspaper, doodles, myth vs fact, us vs them, split-screen dialogue, green screen reaction, slots counter, price slams, product hero, captions, transitions, overlays, comment and button CTAs, end cards).
- **43 more** are step-by-step recipes for things that need your own footage or an AI tool (talking head, AI clone, testimonials, AI looks like claymation or anime).
- 9:16, 16:9, 1:1 and 4:5. Safe-zone aware. Auto SFX on every pop. Mastered to -14 LUFS.
- No stock media or paid packs inside: textures are procedural, SFX are synthesized at setup, fonts are open (OFL).

<!-- GALLERY -->
<table>
<tr><td align="center"><img src="previews/B1.jpg" width="180" alt="B1"><br><sub><b>B1</b> Kinetic typography</sub></td><td align="center"><img src="previews/C1.jpg" width="180" alt="C1"><br><sub><b>C1</b> Paper cutout stop-motion</sub></td><td align="center"><img src="previews/B3.jpg" width="180" alt="B3"><br><sub><b>B3</b> Chat story</sub></td><td align="center"><img src="previews/G6.jpg" width="180" alt="G6"><br><sub><b>G6</b> Text behind subject</sub></td></tr>
<tr><td align="center"><img src="previews/D5.jpg" width="180" alt="D5"><br><sub><b>D5</b> 3D phone / laptop mockup</sub></td><td align="center"><img src="previews/D11.jpg" width="180" alt="D11"><br><sub><b>D11</b> Title between depth layers</sub></td><td align="center"><img src="previews/B12.jpg" width="180" alt="B12"><br><sub><b>B12</b> Neon sign</sub></td><td align="center"><img src="previews/B2.jpg" width="180" alt="B2"><br><sub><b>B2</b> Dashboard</sub></td></tr>
<tr><td align="center"><img src="previews/B31.jpg" width="180" alt="B31"><br><sub><b>B31</b> Marker title</sub></td><td align="center"><img src="previews/B35.jpg" width="180" alt="B35"><br><sub><b>B35</b> Comic title burst</sub></td><td align="center"><img src="previews/B38.jpg" width="180" alt="B38"><br><sub><b>B38</b> Cinematic title</sub></td><td align="center"><img src="previews/B44.jpg" width="180" alt="B44"><br><sub><b>B44</b> CRT TV</sub></td></tr>
<tr><td align="center"><img src="previews/B45.jpg" width="180" alt="B45"><br><sub><b>B45</b> Minimal product</sub></td><td align="center"><img src="previews/B16.jpg" width="180" alt="B16"><br><sub><b>B16</b> Brutalist title</sub></td><td align="center"><img src="previews/B6.jpg" width="180" alt="B6"><br><sub><b>B6</b> Isometric blocks</sub></td><td align="center"><img src="previews/B53.jpg" width="180" alt="B53"><br><sub><b>B53</b> Map route</sub></td></tr>
<tr><td align="center"><img src="previews/B56.jpg" width="180" alt="B56"><br><sub><b>B56</b> Game HUD</sub></td><td align="center"><img src="previews/C10.jpg" width="180" alt="C10"><br><sub><b>C10</b> Crayon doodles</sub></td><td align="center"><img src="previews/B59.jpg" width="180" alt="B59"><br><sub><b>B59</b> Donut chart</sub></td><td align="center"><img src="previews/F3.jpg" width="180" alt="F3"><br><sub><b>F3</b> Exploded view / ingredients</sub></td></tr>
</table>

All 177 template previews: [previews/](previews/README.md)
<!-- /GALLERY -->

## Install

In Claude Code:

```
/plugin marketplace add Reodelbasalan/adbertiser-istayle
/plugin install adbertiser-istayle@adbertiser-istayle
```

From a terminal instead: `claude plugin marketplace add Reodelbasalan/adbertiser-istayle` then `claude plugin install adbertiser-istayle@adbertiser-istayle`.

The skill starts on its own when you ask for a styled video, or call it directly with `/adbertiser-istayle:adbertiser-istayle`.

Then ask Claude to set it up once ("setup adbertiser istayle"), or run it yourself:

```bash
node <plugin-folder>/skills/adbertiser-istayle/scripts/setup.mjs
```

Needs **Node.js 18+**. **ffmpeg** is recommended (SFX kit + loudness master). Setup installs Remotion into `~/.adbertiser-istayle/engine` (a few minutes, once).

Manual install without the plugin system: copy `skills/adbertiser-istayle` into `~/.claude/skills/`.

## Use it

Just talk to Claude:

- "Gawa ka ng 20s ad para sa milk tea shop ko, paper style. Ito yung logo at 3 photos."
- "Show me all the styles." / "Anong styles meron?"
- "C1 + G6 + H9, 9:16, CTA MESSAGE US."
- "Ikaw na bahala sa style, pang-promo ng ₱99 deal."

Claude picks styles from the catalog, writes a job file, shows you preview stills first, then renders the MP4.

Or drive it yourself:

```bash
node scripts/style.mjs --list              # the menu
node scripts/style.mjs paper               # search
node scripts/preview.mjs C1,G6,H9          # see a style
node scripts/render.mjs job.json --stills 1,4,8
node scripts/render.mjs job.json           # → out/<name>.mp4
```

A job file is plain JSON: brand, audio, captions and a list of scenes. See [`reference/job.md`](skills/adbertiser-istayle/reference/job.md), the props in [`reference/props.md`](skills/adbertiser-istayle/reference/props.md), and [`examples/demo-job.json`](skills/adbertiser-istayle/examples/demo-job.json).

## The catalog

| | Category | Examples |
| --- | --- | --- |
| A | Ad formats | talking head, POV hook, reply to comment, skit, listicle, PAS |
| B | 2D motion graphics | kinetic text, chat story, notifications, counters, newspaper, doodles |
| C | Paper and craft | paper cutout, scrapbook, sticky notes, torn paper reveal |
| D | 3D and 2.5D | parallax photo, 3D logo, floating product, device mockup |
| E | AI looks | clay, tilt-shift, watercolor, impossible product scenes (recipes) |
| F | Product showcase | product hero, price slam, bundle builder, spec callouts |
| G | Captions and text | gold active word, one big word, karaoke box, text behind subject |
| H | Transitions | slide, glitch, glare, flash, wipe, crash zoom, paper rip, whip, circle |
| I | Overlays | watermark, grain, vignette, SAMPLE tag |
| J | Hooks | bold question, number hook, product slam, price reveal |
| K | CTA and end cards | one-line CTA, offer card, brand end card |

Full list with every ID: [`catalog/STYLES.md`](skills/adbertiser-istayle/catalog/STYLES.md).

## Built-in ad rules

The skill tells Claude to keep these on every video: a hook in the first 1–3 s, a change every 3–6 s, key text inside the 9:16 safe zone, real footage first for product ads, one clear CTA, SAMPLE tags on mock numbers, real testimonials only, and no before/after or guaranteed-result claims for health, beauty and money offers.

## Licenses

- Code: [MIT](LICENSE).
- Rendering uses [Remotion](https://www.remotion.dev). It is free for individuals and companies of up to 3 people; bigger companies need a [Remotion company license](https://www.remotion.dev/license).
- Fonts: Google Fonts under the SIL Open Font License.
- SFX: synthesized by `scripts/sfx.mjs` with ffmpeg, so they are original. Swap in your own by dropping a .wav with the same name into the engine's `public/sfx`.
- Your footage, music and logos stay yours; use only media you have the rights to.

## Roadmap

Packs land one at a time: social-native (green screen, split screen, cursor demo), product (bundle builder, spec callouts, variant grid), 3D (`@remotion/three`: 3D logo, floating product, device mockup), 2.5D parallax, more transitions (film burn, ink, page turn).

---

Made by Reodel "Del" Basalan.
