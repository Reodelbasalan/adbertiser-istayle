# Adbertiser Istayle catalog

Kinds: **template** = renders now · **planned** = template coming; use the hint meanwhile · **recipe** = needs your footage or an outside AI tool; follow the steps.
Look up one style with `node scripts/style.mjs <ID or words>`; props are in `reference/props.md`.

| ID | Style | Kind | Aliases | Looks like | Best for | How / props |
| --- | --- | --- | --- | --- | --- | --- |
| A1 | Talking-head UGC | recipe | talking head, ugc, face cam, selfie video | Face to camera, punch zooms, big captions | Trust, any offer | 9:16 selfie clip → U1 scenes (punchAt on key words) + G1 captions from a transcript + K1 |
| A2 | AI clone talking head | recipe | ai clone, digital twin, clone ad | Your own AI clone says the script | Owners who won't film | Make the clip in a lipsync/clone tool, only with the person's consent → U1 + G1 |
| A3 | AI avatar spokesperson | recipe | ai avatar, ai presenter, spokesperson | A generic AI presenter | Brands with no face to use | Avatar tool (paid) → U1 + G1; label AI where the platform asks |
| A4 | POV text hook | template | pov, pov hook, relatable | "POV: ..." typed over b-roll | Relatable pain points | text, media |
| A5 | Green screen reaction | template | green screen, reaction, react | Person cut out over a post or website | News, reviews, offers | bg (post/site screenshot or clip), subject (cut-out PNG), title, side, frame, scroll |
| A6 | Reply to comment | template | comment reply, reply to comment, faq | Comment card pops, then the answer | Objections, FAQs | name, comment, reply, media |
| A7 | Skit / mini drama | recipe | skit, drama, story ad | 2 characters, problem → solution | Local biz, services | 3–6 short scenes (shot or AI video) → U1 each, H1/H7 between, G1 captions |
| A8 | Split-screen dialogue | template | split screen, two people, side by side | Two people side by side | Customer vs owner | a, b (clips/photos), names, lines [{who, text}] |
| A9 | Street interview | recipe | street interview, vox pop | Mic in frame, quick answers | Awareness | Real shoot only → U1 per answer + G8 captions |
| A10 | Screen-recording tutorial | recipe | tutorial, screen recording, how to | Screen + zooms + callouts | Software, online services | Screen capture → U1 with punchAt on clicks + B11 circles/arrows + G1 |
| A11 | Hands-only demo / unboxing | recipe | unboxing, hands only, faceless, asmr | Faceless hands open and use the product | E-commerce | Top-down phone clips → U1 1–2 s each + F6 + K1 |
| A12 | Behind the scenes | recipe | bts, behind the scenes, process | Making the product, team at work | Trust, local biz | U1 clips ~1.5 s + B1 lines + G1 |
| A13 | Founder story | recipe | founder, owner story, origin story | Owner on why they started | Premium brands | A1 recipe + C2 old photos + K7 |
| A14 | Podcast clip | planned | podcast, interview clip | 2 mics, waveform, big captions | Authority content | Meanwhile: U1 + G2 captions |
| A15 | Real testimonial | recipe | testimonial, review, feedback | Real customer quote, with consent | Social proof | Real customers only, never stock people. U1 clip + G1; screenshot reviews via A6 |
| A16 | Listicle | recipe | listicle, 3 reasons, 5 mistakes, top 5 | Numbered parts | Edu ads | J8 → per item B1 + U1 → K1 |
| A17 | Myth vs fact | template | myth vs fact, myth, fact check | Red X, then green check | Objections | myth, fact, labels, media, flipAt |
| A18 | Us vs them | template | comparison, us vs them, versus | Generic "others vs us" table | Services | title, us, them, rows (strings or {label, them, us}), media |
| A19 | Price reveal ad | recipe | price reveal ad | Price lands early, story after | Promos | J4 opener → U1 shots → F6 → K1 |
| A20 | Slots / deadline counter | template | countdown, slots, deadline, urgency | Slots left, timer (only when true) | Urgency | mode slots/timer, label, from, to, total, time, title, note (true numbers only) |
| A21 | Motion-graphics explainer | recipe | explainer, motion graphics explainer | Motion graphics + VO | Services, offers | VO + J1 → B7 → B5 → B3 → K4, G1 captions from the VO |
| A22 | Push-in slides | planned | slides, presentation, deck video | Slides with slow push-in + VO | Webinars, B2B | Meanwhile: U1 with slide images, zoom in |
| A23 | Cinematic commercial | recipe | cinematic, commercial, tvc | 16:9 premium shots, music-led | Premium brands | Real or AI video → U1 per shot, H3/H4, I2 + I5, size 16:9 |
| A24 | Concept ad | recipe | concept ad, spec ad, portfolio ad | A 30 s ad for a made-up brand | Portfolio samples | Any chain; overlays.sample with "CONCEPT AD" text |
| A25 | Day in the life | recipe | day in the life, ditl, routine | Quick cuts through a day | Lifestyle, services | U1 clips ~1 s, times as titles |
| A26 | Problem, agitate, solve | recipe | pas, problem agitate solve | Pain, worse, fix | Any direct-response ad | J1 → B1 → F1/U1 → F6 → K1 |
| B1 | Kinetic typography | template | kinetic, kinetic text, typography, text animation | Big words slammed in, one line at a time | Offers, hooks | lines[], accent[] |
| B2 | Dashboard | template | ui mockup, dashboard, app screen, saas | Glass app: KPIs count up, line chart draws | Software, services | kpis [{label, value, prefix, suffix, delta}], series, title, bg (mock data = SAMPLE) |
| B3 | Chat story | template | chat, messenger, sms, conversation, dm | A customer chat plays out | Service businesses | name, messages[{from,text}] |
| B4 | Notification stack | template | notifications, lock screen, orders, ping | Phone pings stack up (SAMPLE label) | Results-style hooks | app, items[{title,text,time}], bg, sample |
| B5 | Infographic counters | template | infographic, stats, counter, numbers, data | Numbers count up, bars grow | Stats, pricing | title, stats[{value,label,prefix,suffix}], sample |
| B6 | Isometric blocks | template | isometric, flat illustration | Isometric cubes rise with icons on top | How it works | blocks [{icon, label, color}], title, at |
| B7 | Services grid | template | services, features, grid, menu, icons | Icon tiles pop in | Service menus | title, items[{icon,label}] |
| B8 | Map pins | template | map, location, branches, pins, delivery area | Stylized city map, pins drop with labels | Multi-branch biz | pins [{x, y, label, icon}] (0-1), title, at, dark, seed |
| B9 | Timeline / roadmap | planned | timeline, roadmap, steps, process | Steps along a line | Courses, process | Meanwhile: C3 notes |
| B10 | Newspaper headline | template | newspaper, news, breaking, headline, balita | Page spins in, BREAKING slams | News-style hooks | paper, headline, sub, image, date, banner |
| B11 | Doodle on footage | template | doodle, scribble, marker, circle, arrow, annotate | Marker circles, arrows, underlines | Tutorials, edu | media, marks[{type,x,y,w,h,at,label,color}] |
| B12 | Neon sign | template | neon, neon sign, glow sign, hologram | Neon tube text flickers on | Night vibe, tech, promos | text ("line 1|line 2"), sub, color, color2, script, bg |
| B13 | VHS title | template | glitch scene, vhs, y2k, retro tv | Blue VHS screen, RGB-split title, OSD | Pattern interrupts | text ("line 1|line 2"), sub, mode, date, bg, color |
| B14 | Premium punch-zoom | recipe | premium, punch zoom, light streak | Punch zooms, light sweeps | Short-form content | U1 with punchAt + H7/H3 + G1 |
| B15 | Minimal title | template | minimal, clean, corporate, elegant | Ivory space, small caps, thin serif, hairline | Clinics, real estate | label, title ("line 1|line 2"), sub, dark |
| B16 | Brutalist title | template | brutalist, bold blocks, loud | Giant condensed words slam in, hard grid, mono label | Scroll stoppers | text ("w1|w2|w3"), label, sub, color |
| B17 | Glass title | template | glass, frosted, glassmorphism | Frosted glass card over color blobs | Tech, software | title, sub, tag, bg |
| B18 | Retro poster | planned | retro, 70s, 80s, vintage poster | Grain, warm palette | Food, nostalgia | Meanwhile: J1 + I2 grain + warm brand colors |
| B19 | Comic panels | template | comic, manga, speech bubble, panels | Comic page: panels slam in with captions + bubbles | Stories, skits | panels [{media, caption, say}] (1–4), at |
| B20 | Cartoon host | planned | cartoon, mascot, character host | A drawn host character | Explainers | — |
| B21 | Sticker pop | planned | stickers, emoji pop, sticker | Stickers pop on beats | UGC energy | — |
| B22 | Cursor demo | template | cursor, click demo, walkthrough | Cursor clicks through steps in a glass app | Tutorials | buttons, result, title, at (seconds per click), bg |
| B23 | Workflow steps | template | workflow, 3 steps, how it works | Glass step cards joined by a glowing line | Services | steps [{icon, label}], title, at, bg |
| B24 | Sample montage | planned | montage, portfolio grid, samples | Grid of output samples | Portfolio proof | Meanwhile: C2 with photos |
| B25 | Line icons draw-on | template | line art, icon draw, outline animation | Outline icons draw themselves | Features | icons [{icon, label}] (phone chart megaphone cart chat bulb check money camera target user clock heart star), title, at |
| B26 | Hologram HUD | template | hud, hologram, futuristic ui | Spinning rings, value, typed items | Tech, AI, results | value, label, items, title, color, bg |
| B27 | Neon price | template | neon price, neon promo | Neon frame, price buzzes on | Promos | label, price, oldPrice, note, color, color2 |
| B28 | Hologram product | template | hologram product, projected product | Product as a flickering hologram | Tech, launches | product (PNG), title, sub, color2 |
| B29 | Neon checklist | template | neon list, neon checklist | Neon lines light up with checks | Inclusions, steps | title, items, at (seconds per line) |
| B30 | Glass pricing | template | pricing, packages, price tiers | 1–3 glass tiers, best one glows | Offers, services | tiers [{name, price, items, best}], title, bestLabel, bg |
| B31 | Marker title | template | whiteboard, marker, handwritten title | Title written live by a marker, scribbled underline | Hooks, explainers | text ("line 1|line 2"), sub, color |
| B32 | Whiteboard flow | template | flow, problem solution result, diagram | Boxes and arrows drawn by hand | Explainers | nodes (2–4), title, at, color |
| B33 | Marker list | template | whiteboard list, checklist, handwritten list | Handwritten list, drawn checks, red circle | Tips, checklists | title, items, highlight (index), at |
| B34 | Sketch chart | template | sketch chart, hand-drawn graph | Hand-drawn axes and a rising arrow | Results (true numbers) | title, from, to, xLabel, xLabel2, color |
| B35 | Comic title burst | template | pow, comic title, boom | Title slams on a starburst, speed lines | Hooks | text ("line 1|line 2"), caption, color |
| B36 | Comic speech bubble | template | speech bubble, comic footage | Footage in an inked frame + bubble | Talking points | media, say, caption, side |
| B37 | Comic price | template | comic price, wow price | WOW! then the price slams on a burst | Promos | price, oldPrice, word, note, color |
| B38 | Cinematic title | template | cinematic, movie title, film title | Letterbox closes, serif title settles with tracking | Premium hooks | title ("line 1|line 2"), sub, media, grade (warm/teal/mono) |
| B39 | Graded film shot | template | film look, color grade, letterbox | Footage graded + letterboxed, subtitle line | B-roll with mood | media, line, grade, zoom, leak |
| B40 | Trailer statement | template | trailer text, statement | Words fade in on black like a trailer | Big claims (true) | text |
| B41 | Trailer word flash | template | trailer flash, impact words | Hard cuts of big serif words with flashes | Rhythm hooks | words (2–5), media, grade |
| B42 | VHS footage | template | camcorder, vhs footage, rec | Clip as a camcorder tape: chroma, REC, scanlines | Throwback, UGC | media, title, mode, date |
| B43 | Y2K chrome text | template | y2k, chrome text, bubble | Chrome lettering, pastel bubbles, sparkles | Gen Z drops | text ("line 1|line 2"), sub |
| B44 | CRT TV | template | old tv, crt, retro tv | Clip plays in an old TV after static | Throwback, "as seen on TV" | media, title, channel |
| B45 | Minimal product | template | minimal product, luxury product | Product on an empty stage, thin corners | Premium products | product, name, line, price, dark |
| B46 | Minimal features | template | minimal list, 01 02 03 | Numbered features with hairlines | Premium details | title, items, at, dark |
| B47 | Editorial split | template | editorial, magazine layout | Tall photo + magazine text block | Premium stories | photo, kicker, title, text, dark |
| B48 | Marquee bands | template | marquee, ticker, scrolling text | Two crossing bands scroll a phrase | Drops, sales | text, text2, media, color |
| B49 | Brutalist grid | template | brutalist grid, deal grid | Hard-bordered grid, values slam in | Offers, specs | title, cells [{label, value}], highlight, color |
| B50 | Photo block | template | brutalist photo, framed photo | Photo in a thick frame, giant number, sticker | Proof, steps | media, label, number, color |
| B51 | Isometric path | template | iso path, isometric steps | Ball hops along isometric tiles | Process | steps, title |
| B52 | Isometric towers | template | iso chart, 3d towers | Isometric towers grow like bars | Results (true numbers) | bars [{label, value}], title |
| B53 | Map route | template | route, delivery route, directions | Route draws A to B, vehicle rides it, ETA | Delivery, service visits | from {x, y, label}, to, eta, icon, title, color |
| B54 | Coverage radius | template | coverage, delivery area, radius | Pulsing radius around a pin + label | Delivery areas | x, y, radius, label, title, color |
| B55 | Pixel title | template | 8-bit title, pixel text, game title | 8-bit text types in over a starfield | Gamified hooks | text ("line 1|line 2"), sub, color |
| B56 | Game HUD | template | game hud, score, level up | Hearts, score counter, coins, LEVEL UP | Gamified results | media, score, label |
| B57 | Pixel loading bar | template | loading bar, progress | Blocky bar fills, flips to READY | "We are working on it" | label, done, color |
| B58 | Big number | template | big number, kpi, stat | One giant number counts up + delta chip | Results (true numbers) | value, prefix, suffix, decimals, label, delta |
| B59 | Donut chart | template | donut, percentage, pie | Donut draws to a percentage | Rates, shares | value (0-100), label, title, color |
| B60 | Ranking bars | template | ranking, horizontal bars, bar race | Horizontal bars grow in order | Comparisons | bars [{label, value}], title, suffix, color |
| B61 | Annotated line | template | line chart, annotation, turning point | Line draws, callout at the turning point | Change over time (true data) | series, mark (index), note, title, color |
| C1 | Paper cutout stop-motion | template | paper, paper cutout, cutout, craft, stop motion, handmade | Torn-paper letters, cut-out items, choppy motion | Food, local biz, explainers | title, sub, items[{emoji or image,label}], colors[], paperColor |
| C2 | Scrapbook collage | template | scrapbook, collage, polaroid, tape | Polaroids drop in with tape and notes | Product features, stories | title, photos[], notes[], paperColor |
| C3 | Sticky notes | template | sticky notes, post-it, notes, checklist | Notes slap on a board, checks drawn | Tips, plans, steps | title, notes[], check, boardColor |
| C4 | Torn paper reveal | template | torn paper, paper reveal, tear reveal | Paper sheet rips to show what's under | Reveals | top, media, title, tearAt |
| C5 | Kraft / cardboard | planned | kraft, cardboard, brown paper, packaging | Brown box textures, stamps | Packaging, eco | Meanwhile: C1 with paperColor "#C8A777" |
| C6 | Ransom-note letters | planned | ransom note, magazine letters, cut letters | Mixed magazine letters | Hooks | Meanwhile: C1 title only |
| C7 | Polaroid stack | planned | polaroid stack, photo pile | Photos drop and pile up | Results, events | Meanwhile: C2 |
| C8 | Crayon title | template | crayon, kids drawing, marker drawing | Kid handwriting in crayon colors, doodled sun and stars | Family products | text ("line 1|line 2") |
| C9 | Pop-up book | planned | pop-up book, fold, paper fold | Pages fold up into scenes | Storytelling | — |
| C10 | Crayon doodles | template | crayon doodles, kid drawing | Crayon icons scribble in with labels | Friendly explainers | doodles [{icon, label}], title, at |
| C11 | Crayon list | template | crayon list, kid list | Kid-style numbered list, crayon ticks | Simple steps | title, items, at |
| D1 | 3D UI cards | template | 3d cards, tilt, perspective | Tilted panels with depth | Software | cards [{icon, value, label} or {image}], title, bg |
| D2 | 2.5D parallax photo | template | parallax, 2.5d, depth, photo motion | A still photo moves with depth | Product and place photos | photo, depth (from scripts/depth.py), motion dolly/orbit/rise, amount, title, sub |
| D3 | 3D text / logo reveal | template | 3d text, 3d logo, logo reveal, metallic | Metallic text spins in | Intros | text ("line 1|line 2"), sub, color, gridColor |
| D4 | Floating product spin | template | 3d product, product spin, floating product | Product floats and turns | E-commerce | product (transparent PNG), title, sub |
| D5 | 3D phone / laptop mockup | template | phone mockup, laptop mockup, device | Device turns, your ad on its screen | Agencies, apps | media (9:16 clip or image on the screen), title, sub, side, phoneColor |
| D6 | 3D icons / coins rain | template | coins, money rain, 3d icons | Coins fall and bounce | Money topics | title (price / SALE), sub, symbol, count, color |
| D7 | 3D bar chart | template | 3d chart, growth chart | Bars rise in 3D | Growth (label SAMPLE) | bars [{label, value}], title, prefix, suffix, color (real numbers or SAMPLE) |
| D8 | Photo to 3D model | recipe | image to 3d, 3d model, glb | A product photo becomes a model | Product spins | Make a .glb with an open image-to-3D model (e.g. TripoSR, MIT); D4 will load it |
| D9 | Photo layer fly-through | template | fly-through, layered photo, camera fly | Camera flies into a layered photo | Hooks, places | photos (2–6 photos/clips), labels, title |
| D10 | Isometric 3D store | recipe | diorama, isometric store, miniature store | A small 3D diorama of the business | Local biz | Generate a still with an image model → U1 zoom in |
| D11 | Title between depth layers | template | text behind, depth title, 2.5d title | Big title sits behind the subject, layers drift | Hooks on photos | photo, fg (from depth.py), title, sub, color |
| E1 | 3D cartoon render look | recipe | 3d cartoon, animated film look, cgi cartoon | Soft 3D render look | B-roll, objects, places | Image/video model, people-free scenes → U1 |
| E2 | Claymation | recipe | clay, claymation, plasticine | Clay textures | Food, kids, fun brands | Image/video model → U1 |
| E3 | Miniature tilt-shift | recipe | tilt shift, miniature | Tiny diorama world | Places | Image/video model → U1 |
| E4 | Watercolor / illustration | recipe | watercolor, illustration, painted | Painted look | Wellness, soft brands | Image model → U1 zoom in |
| E5 | Anime-style | recipe | anime, 2d anime | 2D anime look | Youth content | Image model; never copy a named studio's look |
| E6 | Impossible product scene | recipe | giant product, surreal, cgi ad | Giant product in a city, splash worlds | Scroll stoppers | AI video (paid) → U1 as the first 2 s |
| E7 | Person in a new scene | recipe | photo edit, new outfit, virtual try-on | Real face kept, new place or clothes | Personal brands | Image-edit model with the person's consent → U1 |
| E8 | Product in hand | recipe | product in hand, holding product | A person holds the product | E-commerce | Image-edit model with product photo → U1 |
| E9 | Morph transition | recipe | morph, transform, ai morph | One object turns into another | Reveals | AI video (paid) → U1 |
| E10 | Animated still | recipe | image to video, animate photo | A still made to move | B-roll | Image-to-video model → U1 |
| E11 | Lipsync clip | recipe | lipsync, talking photo | A face speaks a new VO | Clone ads | Lipsync model, consent only → U1 + G1 |
| E12 | Upscale + 60 fps | recipe | upscale, 60fps, enhance | Sharper, smoother AI clips | Any AI shot | Real-ESRGAN (BSD) + RIFE (MIT) before U1 |
| F1 | Product hero | template | product hero, product shot, light sweep, hero | Product floats, glow, light sweep | E-commerce intros | product (PNG), title, sub |
| F2 | Macro + slow-mo | recipe | macro, slow motion, close up | Close textures, slow pours | Food, beauty | Real or AI footage → U1 zoom in |
| F3 | Exploded view / ingredients | planned | ingredients, exploded view, floating ingredients | Parts float around the product | Food, supplements | — |
| F4 | Splash / pour | recipe | splash, pour, liquid | Liquid hits the product | Drinks, beauty | AI video (paid) → U1 |
| F5 | Flat-lay stop-motion | recipe | flat lay, top down stop motion | Top-down items move frame by frame | Food, kits | Photos taken step by step → U1 0.2 s each, zoom none |
| F6 | Price tag slam | template | price, price slam, promo, sale, discount, price tag | Price stamp slams with a starburst | Promos | product, name, price, oldPrice, badge, slamAt |
| F7 | Bundle builder | planned | bundle, box, stack, package | Items stack into a box | Bundles | — |
| F8 | Catalog flip | planned | catalog, variants, carousel | Variants flip past | Variant lines | Meanwhile: C2 |
| F9 | Variant album grid | planned | flavor grid, album, all variants | All variants in one grid | Variety | Meanwhile: B7 with emoji or C2 |
| F10 | Spec callouts | planned | callouts, specs, feature lines, labels | Lines point to features | Gadgets, equipment | Meanwhile: B11 arrows + labels |
| F11 | 360 turntable | recipe | 360, turntable, rotate product | Product turns a full circle | E-commerce | Real turntable clip → U1 |
| F12 | Size comparison | planned | size, scale, actual size | Product next to a hand or coin | Size questions | Meanwhile: U1 photo + B11 |
| G1 | Gold active word | template | captions, subtitles, active word | Word by word, active word in brand color | Default for every edit | job.captions {style:"G1", file} |
| G2 | One big word | template | one word, big captions, single word | One huge word at a time | Talking heads | job.captions {style:"G2"} |
| G3 | Karaoke box | template | karaoke, highlight box, box captions | A box behind the active word | UGC | job.captions {style:"G3"} |
| G4 | Handwritten captions | planned | handwritten, marker captions | Marker-style words | Paper styles | — |
| G5 | Typewriter | planned | typewriter, typing text | Letters type in | Quotes, prompts | Meanwhile: A4 |
| G6 | Text behind subject | template | text behind, behind subject, depth text | Person stands in front of a huge title | Hooks, covers | bg, subject (cut-out PNG), title, sub, titleColor |
| G7 | Highlighter keywords | template | highlighter, marker highlight | Marker swipe behind spoken words | Edu | job.captions {style:"G7"} |
| G8 | Native outline | template | tiktok captions, native captions, white outline | White bold, black outline | Native-looking ads | job.captions {style:"G8"} |
| G9 | Emoji captions | planned | emoji captions | Emojis pop at key words | Casual content | — |
| G10 | Lower-third name tag | planned | lower third, name tag, title bar | Name + title bar | Founders, experts | Meanwhile: U1 title |
| G11 | 3D extruded title | template | 3d title, extruded text | Thick 3D letters | Hooks | media, title ("line 1|line 2"), sub, position top/middle/bottom, titleAt, color |
| G12 | Split color words | recipe | color word, key word color | Key word in brand color | Offers | J1 highlight, or B1 accent |
| G13 | Neon captions | template | neon captions, glow captions | Glowing words, active word in brand color | Neon look | `captions.style: "G13"` |
| G14 | Glass captions | template | glass captions, pill captions | Words on a frosted pill | Glass look | `captions.style: "G14"` |
| G15 | Marker captions | template | handwritten captions, marker captions | Captions in the hand font, active word in brand color | Whiteboard look | `captions.style: "G15"` |
| G16 | Comic captions | template | comic captions, bangers | Comic lettering, active word yellow | Comic look | `captions.style: "G16"` |
| G17 | Film subtitles | template | movie subtitles, serif captions | Italic serif subtitles | Cinematic look | `captions.style: "G17"` |
| G18 | VHS captions | template | vhs captions, camcorder text | Mono OSD text with RGB split | Retro look | `captions.style: "G18"` |
| G19 | Minimal captions | template | minimal captions, clean captions | Light words, active word underlined | Minimal look | `captions.style: "G19"` |
| H1 | Slide | template | slide, push | Next scene slides in | Any cut | scene.transition "H1" |
| H2 | Glitch | template | glitch, rgb split, digital | Jitter + color bars | Tech, energy | scene.transition "H2" |
| H3 | Glare / light sweep | template | glare, light sweep, shine | A shine passes as it fades in | Beauty, premium | scene.transition "H3" |
| H4 | Camera flash | template | flash, shutter, camera | White flash | Photos, reveals | scene.transition "H4" |
| H5 | Film burn | template | film burn, burn | Orange burn through | Cinematic | `"transition": "H5"` |
| H6 | Brand color wipe | template | wipe, color wipe, bar wipe | A diagonal brand-color bar wipes | Brand moments | scene.transition "H6" |
| H7 | Crash zoom | template | zoom, crash zoom, punch | Zooms in from big + blur | Hooks, hits | scene.transition "H7" |
| H8 | Light leak flash | planned | light leak | Warm leak flash | Lifestyle | — |
| H9 | Paper rip | template | paper rip, tear, rip | Torn edge sweeps across | Paper styles | scene.transition "H9" |
| H10 | Whip pan | template | whip, whip pan, motion blur | Fast blurred slide | Fast edits | scene.transition "H10" |
| H11 | Ink / liquid wipe | planned | ink, liquid, fluid | Ink spreads to reveal | Soft brands | — |
| H12 | Circle reveal | template | circle, iris, shape reveal, mask | Circle opens from the center | Reveals, end cards | scene.transition "H12" |
| H13 | Page turn | planned | page turn, page flip | Page curls over | Stories | — |
| H14 | 3D cube spin | template | cube, 3d spin | Scenes on a turning cube | Lists | "transition": "H14" on the entering scene |
| H15 | Pixel / mosaic | planned | pixel, mosaic, pixelate | Pixels resolve | Tech | — |
| H16 | Match cut | recipe | match cut | Cut on matching shape or motion | Story edits | Plan two U1 shots that match; no effect needed |
| H17 | Neon flicker | template | neon flicker, flicker transition | New scene buzzes on like a tube | Neon look | `"transition": "H17"` |
| H18 | Frosted blur | template | blur transition, frosted, glass wipe | New scene comes out of a frosted blur | Glass look | `"transition": "H18"` |
| H19 | Eraser wipe | template | eraser, whiteboard wipe | Soft white band wipes to the next scene | Whiteboard look | `"transition": "H19"` |
| H20 | Comic panel slam | template | comic transition, panel slam | New scene lands as a tilted inked panel | Comic look | `"transition": "H20"` |
| H21 | Depth push | template | depth push, dolly transition | New scene comes forward out of the distance | 2.5D look | `"transition": "H21"` |
| H22 | Channel switch | template | static, channel switch, vhs transition | Static burst, picture rolls in | Retro look | `"transition": "H22"` |
| H23 | Ivory fade | template | soft fade, fade through white | Fades through ivory with a settle | Minimal look | `"transition": "H23"` |
| I1 | Watermark | template | watermark, logo bug | Logo or brand name, top right | Every edit | job.overlays.watermark |
| I2 | Film grain | template | grain, film grain, texture | Moving grain | Retro, paper, cinematic | job.overlays.grain (0–0.4) |
| I3 | Light leaks | planned | light leaks | Warm color leaks | Lifestyle | — |
| I4 | VHS lines | planned | vhs, scanlines | Scanlines, tracking | Y2K | — |
| I5 | Vignette | template | vignette, dark edges | Darker edges | Cinematic | job.overlays.vignette |
| I6 | Paper texture overlay | planned | paper texture | Paper grain on top | Paper styles | Meanwhile: I2 |
| I7 | Lens flare | planned | lens flare | Flare streak | Product hero | — |
| I8 | Particles / sparkle | planned | particles, sparkle, confetti | Floating sparkles | Beauty, celebrations | — |
| I9 | Ducked music + SFX on pops | recipe | music, sfx, sound design | SFX on every pop, music under the VO | Every edit | Built in: auto SFX per template, audio.music + audio.musicVolume |
| I10 | SAMPLE tag | template | sample label, concept tag, mock label | "SAMPLE" chip | Mock stats, concept ads | job.overlays.sample |
| J1 | Bold question hook | template | hook, question hook, bold question | A short question fills the screen | First 1–3 s | text, highlight, sub, bg |
| J2 | Crash zoom interrupt | recipe | crash zoom hook, pattern interrupt | Hard zoom on frame 1 | Hooks | First U1 shot + impact SFX at 0 |
| J3 | Product slam hook | template | product drop, product slam | Product drops in with an impact | E-commerce hooks | product, title, sub |
| J4 | Price reveal hook | template | price reveal, price first | Price hits first | Promos | same props as F6 |
| J5 | Cold open mid-action | recipe | cold open, mid action | Start inside the strongest moment | Story ads | Best U1 moment at 0 s + J1 text over it (bg) |
| J6 | Impossible visual | recipe | surreal hook | Giant or surreal product shot | Scroll stoppers | E6 recipe as the first 2 s |
| J7 | Comment reply hook | template | comment hook | A viewer's question opens the ad | Objections | same props as A6 |
| J8 | Number hook | template | number hook, 3 mistakes, numbered hook | Giant number + line | Listicles | big, text, highlight |
| J9 | Text behind subject hook | template | text behind hook | Person in front of a big title | Covers | same props as G6 |
| J10 | Paper rip open | template | paper rip hook, rip open | First frame rips open | Paper styles | top, media, title |
| J11 | Old way vs new way | template | old vs new, split hook | Two ways of working side by side | Services | oldMedia, oldText, newMedia, newText, labels |
| J12 | Notification ping hook | template | notification hook, ping hook | Phone lights up (SAMPLE) | Results-style hooks | same props as B4 |
| K1 | One-line CTA | template | cta, call to action, message us, order now | One bold line + bouncing arrow | Last 2 s | cta, arrow |
| K2 | Comment keyword CTA | template | comment keyword, comment to get | "Comment WORD" + arrow | Lead magnets | keyword, text, sub, media |
| K3 | Button press CTA | template | button press, tap button | A button gets tapped | Messaging CTAs | button, title, sub, icon, after, pressAt, hand, media |
| K4 | Offer card | template | offer, package, inclusions, pricing card | Title, checklist, price, button | Packages | title, items[], price, note, cta |
| K5 | Loop ending | recipe | loop, seamless loop | Last frame flows into the first | Reels, TikTok | Repeat scene 1's style/props as the last scene; skip end cards |
| K6 | Logo animation outro | planned | logo outro, logo animation | Logo reveal | Brand outros | Meanwhile: K7 |
| K7 | Brand end card | template | end card, outro, brand card | Logo, headline, pulsing CTA button | Every ad | logo, headline, cta, handle |
| K8 | 3D logo end card | template | 3d logo end | Spinning metallic logo | Premium outros | logo (PNG) or name, cta, handle |
| K9 | Neon CTA | template | neon cta, neon button | Neon button + chasing arrows | Neon look outros | cta, title, handle, arrow, color, color2 |
| K10 | Glass CTA | template | glass cta, glass end card | Glass card, glowing button, shine | Glass look outros | logo or name, headline, cta, handle, bg |
| K11 | Marker CTA | template | marker cta, whiteboard cta | CTA written by marker, boxed, arrow + star | Whiteboard look outros | cta, title, handle, color |
| K12 | Comic CTA | template | comic cta | CTA in an inked box, pointing hand | Comic look outros | cta, title, handle |
| K13 | Cinematic end card | template | film end card, movie outro | Wide serif name, rule, CTA, light sweep | Premium outros | name, cta, line |
| K14 | Depth CTA | template | parallax cta, photo cta | Photo drifts in depth behind a CTA band | 2.5D look outros | photo, fg, title, cta, handle |
| K15 | VHS CTA | template | vhs cta, press play | Blinking "▶ CTA" on a VHS menu | Retro outros | cta, title, handle, date |
| K16 | Minimal CTA | template | minimal cta, luxury end card | Spaced wordmark, outlined button | Premium outros | logo or name, cta, handle, dark |
| K17 | Brutalist CTA | template | brutalist cta | CTA words fill the frame, colors flip | Bold outros | cta, handle, color |
| K18 | Isometric CTA | template | iso cta | Isometric phone with chat icon + CTA pill | Iso look outros | cta, title, handle |
| K19 | Map CTA | template | map cta, visit us | Map zooms to a pin, card with name + CTA | Local business outros | name, address, cta |
| K20 | Press start CTA | template | press start, pixel cta | PRESS START blinks, pixel CTA button | Pixel look outros | cta, title, handle, color |
| K21 | Crayon CTA | template | crayon cta | CTA scribbled in a crayon cloud | Crayon look outros | cta, title |
| K22 | Data CTA | template | data cta | Question line + sparkline + CTA | Data look outros | title, cta, handle |
| U1 | Footage / photo shot | template | footage, broll, b-roll, photo, video clip, shot | Your clip or photo with zoom | The base of every ad | media, zoom (in/out/none), punchAt, title, titleAt |
