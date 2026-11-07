# Template props

Every scene: `{"style": "C1", "dur": 4, "transition": "H9", "props": {...}, "sfx": [{"at": 1.2, "name": "ding"}]}`.
`dur` is seconds. `transition` is how this scene comes IN (none = hard cut). `sfx` adds sounds on top of the template's own (`at` = seconds from the scene start).
Media fields take a file path (relative to the job file), a URL, or a placeholder `"demo:<emoji>:<hue>"`.
Every prop is optional; a missing one shows sample content, so always fill the text props.

## J1 Bold question hook · J8 Number hook
`{"text": "Bakit walang bumibili?", "highlight": ["bumibili"], "sub": "optional second line", "bg": "optional photo or clip", "big": "3"}`
`big` is for J8 (giant number above). Keep `text` to 6 words or fewer.

## B1 Kinetic typography
`{"lines": ["Stop scrolling", "Ito na", "ang sagot"], "accent": [2]}`
Each line gets `dur / lines`. `accent` = line indexes shown on a brand-color background (default: the last line). ~0.8–1.2 s per line.

## A4 POV text hook
`{"text": "POV: 3 orders na habang tulog ka", "media": "clip.mp4"}`

## B3 Chat story
`{"name": "Customer", "messages": [{"from": "them", "text": "Available pa po?"}, {"from": "me", "text": "Yes po!"}]}`
Messages spread evenly over the scene; allow ~1 s per message. Generic chat look (no real app branding).

## B4 Notification stack · J12 Notification ping hook
`{"app": "Shop", "items": [{"title": "New order", "text": "Juan ordered 2x Classic", "time": "now"}], "bg": "photo.jpg", "sample": true}`
Keep `sample: true` unless the notifications are real screenshots of real orders.

## A6 Reply to comment · J7 Comment reply hook
`{"name": "Maria S.", "comment": "Magkano shipping pa-Mindanao?", "reply": "FREE po sa 3 boxes!", "media": "optional background"}`
Use real comments (ask the user), or clearly generic FAQ wording.

## B5 Infographic counters
`{"title": "This month", "stats": [{"value": 1200, "suffix": "+", "label": "Orders"}, {"value": 4.9, "suffix": "★", "label": "Rating"}], "sample": true}`
Numbers count up. `sample: false` only for real, verifiable numbers.

## B7 Services grid
`{"title": "What you get", "items": [{"icon": "🎬", "label": "Video Ads"}, {"icon": "📸", "label": "Photos"}]}`
4–8 items; 2 columns on 9:16, up to 4 on 16:9.

## B10 Newspaper headline
`{"paper": "THE DAILY NEWS", "headline": "Local brand sold out in 3 days", "sub": "optional", "image": "photo.jpg", "date": "SPECIAL EDITION", "banner": "BREAKING"}`
Never use a real newspaper's name or logo. The headline must be true or clearly a joke.

## B11 Doodle on footage
`{"media": "clip.mp4", "marks": [{"type": "circle", "x": 0.5, "y": 0.42, "w": 0.6, "h": 0.18, "at": 0.4, "label": "ITO!", "color": "#FF3B30"}]}`
`type`: circle · arrow (tip at x,y) · underline · x · check. `x y w h` are 0–1 of the frame; `at` in seconds.

## C1 Paper cutout stop-motion
`{"title": "Crispy Daily", "sub": "Gawa sa totoong saging", "items": [{"emoji": "🍌", "label": "Real banana"}, {"image": "chip.png", "label": "Crispy"}], "colors": ["#FFD23F", "#FFFFFF", "#7C5CFF", "#2B2B2B"], "paperColor": "#F2EADB"}`
Title words up to ~10 letters each; 1–4 items (images work best as transparent PNGs).

## C2 Scrapbook collage
`{"title": "Our favorites", "photos": ["a.jpg", "b.jpg", "c.jpg"], "notes": ["best seller!", "new flavor", "sulit"], "paperColor": "#F6F2E8"}`
1–4 photos; `notes` sit under each photo.

## C3 Sticky notes
`{"title": "4 rules", "notes": ["Hook first", "Captions lagi", "SFX bawat pop", "CTA sa dulo"], "check": true, "boardColor": "#C9A27A"}`
2–6 short notes; `check: false` skips the check marks.

## C4 Torn paper reveal · J10 Paper rip open
`{"top": "Ano kaya ang bago?", "media": "reveal.jpg", "title": "NEW FLAVOR", "tearAt": 1.0}`
`top` is written on the paper; `media` + `title` are revealed.

## F1 Product hero · J3 Product slam hook
`{"product": "product.png", "title": "Classic", "sub": "₱35 lang", "drop": false}`
`product` should be a transparent PNG. J3 = the same with `drop: true`.

## F6 Price tag slam · J4 Price reveal hook
`{"product": "product.png", "name": "3 packs", "price": "₱100", "oldPrice": "₱120", "badge": "PROMO", "slamAt": 0.5}`
`badge: false` hides the badge. Real prices only; confirm them with the user.

## G6 Text behind subject · J9 Text behind subject hook
`{"bg": "background.jpg", "subject": "person.png", "title": "GLOW UP", "sub": "optional", "titleColor": "#FFD23F"}`
`subject` = transparent cut-out (person or product) from the same photo as `bg`, so the title sits between them.

## U1 Footage / photo shot
`{"media": "clip.mp4", "zoom": "in", "punchAt": 1.2, "title": "Same-day delivery", "titleAt": 0.3}`
`zoom`: in · out · none. `punchAt` (seconds) = quick punch-in on a key word.

## A5 Green screen reaction
`{"bg": "post.png", "subject": "me_cutout.png", "title": "Totoo ba 'to?", "side": "left", "frame": "card", "scroll": true}`
`bg` = a screenshot of a post, website or article (or a clip); a tall screenshot scrolls slowly (`scroll: false` stops it). `subject` = a transparent PNG of the person (rembg). `frame: "full"` fills the screen instead of a card. `side`: left · right. Captions stay on here. Only react to posts you may show; blur names you don't own.

## A8 Split-screen dialogue
`{"a": "customer.mp4", "b": "owner.mp4", "names": ["Customer", "Owner"], "lines": [{"who": 0, "text": "Magkano po?"}, {"who": 1, "text": "₱499 lang po!"}]}`
Stacked on 9:16, side by side on 16:9. Each line gets `dur / lines` unless it has its own `at` (seconds into the scene, e.g. when its words are spoken); the listener's half dims.

## A17 Myth vs fact
`{"myth": "Kailangan ng mahal na camera", "fact": "Phone lang + tamang hook", "labels": ["MYTH", "FACT"], "media": "optional bg", "flipAt": 1.9}`
Red X lands on the myth, the card flips to the fact (default flip at 48% of `dur`). Keep each line under ~50 characters.

## A18 Us vs them
`{"title": "Bakit kami?", "us": "Brand", "them": "OTHERS", "rows": ["Same-day reply", {"label": "Price", "them": "₱₱₱", "us": "₱999"}]}`
A row string = others ✗, us ✓; or set `them`/`us` to true, false or short text, and `at` (seconds) to time a row to the VO. 3–5 rows. Keep "them" generic: never name or show a real competitor.

## A20 Slots / deadline counter
Slots `{"label": "SLOTS LEFT", "from": 10, "to": 3, "total": 10, "title": "November batch", "note": "Message us to reserve"}` · Timer `{"mode": "timer", "time": "02:00:00", "label": "PROMO ENDS IN"}`
`to` is the real number left; it counts down from `from` with a tick each. Only use true numbers and real deadlines (fake scarcity breaks ad policies).

## J11 Old way vs new way
`{"oldMedia": "slow.mp4", "oldText": "3 hours per video", "newMedia": "fast.mp4", "newText": "15 minutes with AI", "labels": ["OLD WAY", "NEW WAY"]}`
Old half is grey with ✗; the new half wipes in at ~1 s (or `newAt` seconds) with ✓. Good as a 2.5–3 s hook.

## K2 Comment keyword CTA
`{"keyword": "GUIDE", "text": "Comment", "sub": "at isesend namin ang free guide", "media": "optional bg"}`
The keyword slams in, then gets typed into a generic comment box and posted. Use a keyword your page really replies to.

## K3 Button press CTA
`{"button": "MESSAGE US", "title": "Ready ka na?", "sub": "Reply within 5 minutes", "icon": "💬", "after": "SENT ✓", "pressAt": 1.0, "hand": true}`
`button` defaults to `brand.cta`. `after` (optional) swaps the label after the tap. `hand: false` hides the finger.

## 3D look: D1 3D UI cards · D3 3D text · D4 Product spin · D5 3D phone · D6 Coins rain · D7 3D bar chart · D9 Photo fly-through · G11 3D title · H14 Cube spin · K8 3D logo
D3 `{"text": "Ads na|Bumebenta", "sub": "optional line", "color": "#FFD23F"}` · `|` splits lines (1–3 short lines). Extruded text flies in from depth and lands at ~0.55 s.
D5 `{"media": "my_ad.mp4", "title": "Ganito dapat ang ad mo", "sub": "Hook · Product · Captions", "side": "right"}` · a 9:16 clip or image plays on the phone screen (it is cover-fitted).
D6 `{"title": "₱999", "sub": "Starter package", "symbol": "₱", "count": 36}` · gold coins rain behind the headline; keep the headline short (price, SALE, -50%).
K8 `{"logo": "logo.png", "name": "Brand", "cta": "MESSAGE US", "handle": "@page"}` · without a logo the brand name becomes 3D text.
D1 `{"title": "Sample results", "cards": [{"icon": "📈", "value": "+120%", "label": "Reach"}, {"image": "post.png"}], "bg": "optional"}` · 1–4 glass cards at different depths; stats or screenshots. Mock numbers need the SAMPLE overlay.
D4 `{"product": "bottle.png", "title": "optional", "sub": "optional"}` · a transparent PNG sways on a glowing podium.
D7 `{"title": "Messages per week", "bars": [{"label": "Week 1", "value": 12}, {"label": "Week 4", "value": 68}], "prefix": "₱", "suffix": "K"}` · 2–6 bars; the last bar is highlighted. Real numbers only, or keep the SAMPLE overlay.
D9 `{"photos": ["a.jpg", "b.jpg", "c.jpg"], "labels": ["Product video", "UGC", "Explainer"], "title": "optional"}` · the camera flies through the photos; the last one lands.
G11 `{"media": "clip.mp4", "title": "Ad na|Panalo", "sub": "optional", "position": "middle", "titleAt": 0.2}` · thick 3D title flips up over footage.
H14 cube spin: put `"transition": "H14"` on the entering scene; both scenes turn like a cube.
D5 and D6 use WebGL (three.js); the engine renders with `--gl=angle`. On a machine with no GPU, set `Config.setChromiumOpenGlRenderer('swangle')` in `engine/remotion.config.ts`.

## Bold brutalist look: B16 Brutalist title · B48 Marquee bands · B49 Brutalist grid · B50 Photo block · K17 Brutalist CTA
Huge condensed type, hard black borders, flat accent (`color`, else brand primary), mono labels.
B16 `{"text": "Stop|Boring|Ads", "label": "AD NO. 001", "sub": "optional"}` · B48 `{"text": "BAGONG ADS", "text2": "LIMITED SLOTS", "media": "optional"}`
B49 `{"title": "The deal", "cells": [{"label": "Price", "value": "₱999"}, {"label": "Videos", "value": "3"}], "highlight": 0}` · B50 `{"media": "a.jpg", "label": "Real footage", "number": "01"}` · K17 `{"cta": "MESSAGE US NOW", "handle": "@page"}`

## Isometric look: B6 Isometric blocks · B51 Isometric path · B52 Isometric towers · K18 Isometric CTA
B6 `{"title": "Daloy ng benta", "blocks": [{"icon": "📱", "label": "Ads"}, {"icon": "💬", "label": "Messages"}], "at": [0.3, 1.2]}` · B51 `{"steps": ["Script", "Shoot", "Edit", "Post"], "title": "optional"}`
B52 `{"title": "Messages per week", "bars": [{"label": "W1", "value": 12}, {"label": "W4", "value": 68}]}` · K18 `{"title": "Brand", "cta": "MESSAGE US", "handle": "@page"}`

## Map look: B8 Map pins · B53 Map route · B54 Coverage radius · K19 Map CTA
A made-up stylized street map (no map tiles). Positions are 0–1 of the frame. `dark: true` for a night map, `seed` for a different layout.
B8 `{"title": "Malapit lang kami", "pins": [{"x": 0.3, "y": 0.4, "label": "Branch 1"}], "at": [0.4]}` · B53 `{"from": {"x": 0.2, "y": 0.3, "label": "Shop"}, "to": {"x": 0.75, "y": 0.65, "label": "Ikaw"}, "eta": "30 mins", "icon": "🛵"}`
B54 `{"x": 0.5, "y": 0.5, "radius": 0.36, "label": "Within 5 km"}` · K19 `{"name": "Brand", "address": "Open daily · 9AM–9PM", "cta": "MESSAGE US"}`

## Pixel / 8-bit look: B55 Pixel title · B56 Game HUD · B57 Pixel loading bar · K20 Press start CTA
Press Start 2P (OFL), stepped motion. B55 `{"text": "LEVEL UP|YOUR ADS", "sub": "optional"}` · B56 `{"media": "optional clip", "score": 2400, "label": "LEVEL UP!"}` · B57 `{"label": "LOADING ADS...", "done": "READY!"}` · K20 `{"title": "PRESS START", "cta": "MESSAGE US"}`

## Crayon look: C8 Crayon title · C10 Crayon doodles · C11 Crayon list · K21 Crayon CTA
Gaegu handwriting (OFL), crayon colors, wobbly stop-motion on lined paper. Doodle icons = the whiteboard icon set.
C8 `{"text": "Simple lang|ang ads!"}` · C10 `{"doodles": [{"icon": "heart", "label": "Gusto ng tao"}], "at": [0.4]}` · C11 `{"title": "Steps ko", "items": ["Kuha sa phone", "Lagyan ng hook"], "at": [0.4, 1.2]}` · K21 `{"cta": "MESSAGE US", "title": "Tara na!"}`

## Data-viz look: B58 Big number · B59 Donut · B60 Ranking bars · B61 Annotated line · K22 Data CTA
Dark slate, one brand-color series, numbers count up. Use real numbers or keep the SAMPLE overlay.
B58 `{"value": 1240, "label": "messages this month", "delta": "+212%"}` · B59 `{"value": 72, "label": "nanood hanggang dulo"}`
B60 `{"title": "Saan galing ang benta?", "bars": [{"label": "Video ads", "value": 64}], "suffix": "%"}` · B61 `{"title": "Messages per day", "series": [8, 9, 7, 18, 26, 42], "mark": 3, "note": "Bagong ad dito"}` · K22 `{"title": "Gusto mo ng ganitong numbers?", "cta": "MESSAGE US"}`

## Retro VHS / Y2K look: B13 VHS title · B42 VHS footage · B43 Y2K chrome · B44 CRT TV · K15 VHS CTA · G18 VHS captions · H22 Channel switch
Scanlines, rolling tracking band, RGB split, camcorder display (`mode`: "PLAY ▶" or "REC", `date`: "NOV 07 2026").
B13 `{"text": "Throwback|Pero Bago", "sub": "optional", "bg": "optional clip"}` · B42 `{"media": "clip.mp4", "title": "optional", "mode": "REC"}`
B43 `{"text": "Bagong|Drop", "sub": "optional"}` · B44 `{"media": "clip.mp4", "title": "As seen on TV", "channel": "CH 03"}` · K15 `{"cta": "MESSAGE US", "title": "PRESS PLAY", "handle": "@page"}`
G18 captions: `job.captions.style = "G18"`. H22: `"transition": "H22"`.

## Minimal luxury look: B15 Minimal title · B45 Minimal product · B46 Minimal features · B47 Editorial split · K16 Minimal CTA · G19 Minimal captions · H23 Ivory fade
Ivory background (or `"dark": true` for black), spaced small caps, serif headings, hairlines, slow fades.
B15 `{"label": "Brand", "title": "Less noise.|More sales.", "sub": "optional"}` · B45 `{"product": "bottle.png", "name": "The Essential", "line": "Made for every day", "price": "₱1,299"}`
B46 `{"title": "The details", "items": ["Malinis na script", "Tamang ilaw"], "at": [0.4, 1.4]}` · B47 `{"photo": "a.jpg", "kicker": "Issue 01", "title": "Ang ad na tahimik pero mabenta", "text": "optional"}`
K16 `{"logo": "logo.png", "name": "Brand", "cta": "MESSAGE US", "handle": "@page"}` · G19 captions: `job.captions.style = "G19"`. H23: `"transition": "H23"`.

## 2.5D look: D2 Parallax photo · D11 Title between depth layers · K14 Depth CTA · H21 Depth push
Make the depth files once per photo: `python scripts/depth.py photo.jpg` → `photo_depth.png` (white = near) and `photo_fg.png` (only the near part). Model: Depth Anything V2 Small (Apache 2.0, ~100 MB download; needs `pip install transformers torch pillow numpy`). Without a depth file D2 uses a soft center-near depth.
D2 `{"photo": "photo.jpg", "depth": "photo_depth.png", "motion": "dolly", "amount": 0.55, "title": "optional", "sub": "optional"}` · motion: dolly · orbit · rise. WebGL (three.js).
D11 `{"photo": "photo.jpg", "fg": "photo_fg.png", "title": "Ganda ng shot", "sub": "optional", "y": 0.5}` · the title sits between the background and the subject; `y` (0–1) moves it onto the subject.
K14 `{"photo": "photo.jpg", "fg": "photo_fg.png", "title": "Brand", "cta": "MESSAGE US", "handle": "@page"}`
H21: `"transition": "H21"` on the entering scene.

## Cinematic film look: B38 Cinematic title · B39 Graded shot · B40 Trailer statement · B41 Trailer word flash · K13 Cinematic end card · G17 Film subtitles · H5 Film burn
Letterbox bars, film grade (`grade`: warm · teal · mono · none), grain, dust and light leaks; serif titles (`Playfair Display`).
B38 `{"title": "Isang ad.|Isang kwento.", "sub": "optional", "media": "clip.mp4", "grade": "warm"}`
B39 `{"media": "clip.mp4", "line": "optional subtitle", "grade": "teal", "zoom": "in", "leak": true}` · captions stay on here.
B40 `{"text": "Isang ad lang ang kailangan"}` · words fade in one by one.
B41 `{"words": ["Mas malinaw.", "Mas mabilis.", "Mas mabenta."], "media": "optional"}` · each word gets `dur / words` with a flash and a hit.
K13 `{"name": "Brand", "cta": "MESSAGE US", "line": "Ngayon na."}`
G17 captions: `job.captions.style = "G17"`. H5: `"transition": "H5"` on the entering scene.

## Comic look: B35 Comic title burst · B19 Comic panels · B36 Speech bubble on footage · B37 Comic price · K12 Comic CTA · G16 Comic captions · H20 Panel slam
Comic lettering (Bangers, OFL), ink outlines, halftone dots, speed lines and starbursts.
B35 `{"text": "Bagsak|Ang Ads?", "caption": "Meanwhile...", "color": "#FFD60A"}`
B19 `{"panels": [{"media": "a.jpg", "caption": "Dati...", "say": "Walang nagme-message!"}, {"media": "b.mp4", "caption": "Ngayon!", "say": "Sunod-sunod na!"}], "at": [0.1, 1.5]}` · 1–4 panels; stacked on 9:16, side by side on 16:9.
B36 `{"media": "clip.mp4", "say": "Ito na ang ad mo!", "caption": "Optional box", "side": "left"}`
B37 `{"word": "WOW!", "price": "₱999", "oldPrice": "₱1,499", "note": "This week only"}`
K12 `{"cta": "MESSAGE US", "title": "Ano pang hinihintay mo?", "handle": "@page"}`
G16 captions: `job.captions.style = "G16"`. H20: `"transition": "H20"` on the entering scene.

## Whiteboard look: B31 Marker title · B25 Line icons · B32 Flow · B33 Marker list · B34 Sketch chart · K11 Marker CTA · G15 Marker captions · H19 Eraser wipe
White board, everything is written or drawn live (hand font = `brand.handFont`). Accent marker = `color`, else the brand primary (a light primary falls back to blue so it reads on white).
B31 `{"text": "Bakit walang|nag-me-message?", "sub": "optional"}`
B25 `{"title": "optional", "icons": [{"icon": "phone", "label": "Phone lang"}, {"icon": "chart", "label": "Benta"}], "at": [0.2, 1.2]}` · icons: phone chart megaphone cart chat bulb check money camera target user clock heart star.
B32 `{"title": "optional", "nodes": ["Problema", "Solusyon", "Resulta"], "at": [0.2, 1.4, 2.6]}`
B33 `{"title": "Checklist bago mag-boost", "items": ["Hook sa 3 segundo", "Malinaw na presyo"], "highlight": 1, "at": [0.6, 1.8]}`
B34 `{"title": "Messages per week", "from": "5", "to": "60", "xLabel": "Bago", "xLabel2": "Pagkatapos"}` · real numbers only (or the SAMPLE overlay).
K11 `{"cta": "MESSAGE US", "title": "Tara, usap tayo", "handle": "@page"}`
G15 captions: `job.captions.style = "G15"`. H19: `"transition": "H19"` on the entering scene.

## Glass UI look: B17 Glass title · B2 Dashboard · B22 Cursor demo · B23 Workflow steps · B30 Glass pricing · K10 Glass CTA · G14 Glass captions · H18 Frosted blur
Frosted glass over moving brand-color blobs; every part takes an optional `bg` photo or clip (blurred underneath).
B17 `{"title": "Ads na mukhang premium", "sub": "Kahit phone lang", "tag": "NEW"}`
B2 `{"title": "Ads Dashboard", "kpis": [{"label": "Reach", "value": 48200, "delta": "+32%"}, {"label": "Cost / msg", "value": 42, "prefix": "₱", "delta": "-21%"}], "series": [12, 18, 26, 31, 44]}` · mock numbers need the SAMPLE overlay.
B22 `{"title": "Ad Maker", "buttons": ["Isulat ang hook", "Piliin ang style", "I-render"], "result": "Ad ready ✓", "at": [0.8, 1.6, 2.4]}` · `at` (seconds) times each click to the VO.
B23 `{"title": "Ganito ang proseso", "steps": [{"icon": "📝", "label": "Script"}, {"icon": "✂️", "label": "Edit"}], "at": [0.3, 1.1]}` · 2–5 steps.
B30 `{"title": "Pili ka ng package", "tiers": [{"name": "Starter", "price": "₱999", "items": ["1 video ad"]}, {"name": "Growth", "price": "₱2,499", "items": ["3 video ads"], "best": true}], "bestLabel": "BEST VALUE"}`
K10 `{"logo": "logo.png", "name": "Brand", "headline": "Simulan na natin", "cta": "MESSAGE US", "handle": "@page"}`
G14 captions: `job.captions.style = "G14"`. H18: `"transition": "H18"` on the entering scene.

## Neon look: B12 Neon sign · B26 Hologram HUD · B27 Neon price · B28 Hologram product · B29 Neon checklist · K9 Neon CTA · G13 Neon captions · H17 Neon flicker
Neon colors come from the brand (`primary` = neon 1, `secondary` = neon 2); override per scene with `color` / `color2`. Every part takes an optional `bg` photo or clip (shown dark).
B12 `{"text": "Bukas na|Ads mo?", "sub": "optional", "script": true}` · `|` splits lines; line 1 uses the hand font (`script: false` for block letters). Lines flicker on one by one.
B26 `{"value": "98%", "label": "AD SCORE", "items": ["Hook sa 3 sec", "Malinaw na offer"], "title": "optional"}` · rings spin around the value; items type in.
B27 `{"label": "PROMO", "price": "₱999", "oldPrice": "₱1,499", "note": "This week only"}` · neon frame, price buzzes on, neon strike on the old price.
B28 `{"product": "bottle.png", "title": "Bagong launch", "sub": "optional"}` · transparent PNG shown as a projected hologram.
B29 `{"title": "Kasama na", "items": ["Script", "Edit + captions", "Music + SFX"], "at": [0.4, 1.2, 2.0]}` · `at` (seconds) times each line to the VO.
K9 `{"cta": "MESSAGE US", "title": "Ready ka na?", "handle": "@page", "arrow": true}`
G13 captions: `job.captions.style = "G13"`. H17: `"transition": "H17"` on the entering scene.

## K7 Brand end card · K1 One-line CTA · K4 Offer card
K7 `{"logo": "logo.png", "headline": "Order na today", "cta": "MESSAGE US", "handle": "@yourpage"}`
K1 `{"cta": "MESSAGE US", "arrow": "👇"}`
K4 `{"title": "Starter Package", "items": ["5 video ads", "Captions + music"], "price": "₱4,999", "note": "Limited slots", "cta": "MESSAGE US"}`
`cta` defaults to `brand.cta`; `logo` to `brand.logo`.

## G1 G2 G3 G7 G8 G13 G14 G15 G16 G17 G18 G19 Captions
`job.captions = {"style": "G1", "file": "words.json", "y": 0.63}`
Captions hide on templates that show their own big text (hooks, prices, chats, cards, end cards) and show on footage (U1, B11). Force per scene with `"captions": true` or `false`.
`words.json`: `[{"w": "Hello", "s": 0.12, "e": 0.40}]`, or `[{"word", "start", "end"}]`, or Whisper-style segments with `words`. `y` = 0–1 of the frame height (keep 0.25–0.75 on 9:16). Captions follow `audio.vo` timing, so transcribe the VO first.

## H1 H2 H3 H4 H5 H6 H7 H9 H10 H12 H14 H17 H18 H19 H20 H21 H22 H23 Transitions
Put `"transition": "H9"` on the scene that comes IN. Each one has its own SFX. Mix 2–3 kinds per ad; don't use a different one on every cut.

## I1 I2 I5 I10 Overlays
`job.overlays = {"watermark": true, "grain": 0.15, "vignette": true, "sample": true}`
`watermark` uses `brand.logo`, or `brand.name` as text.
