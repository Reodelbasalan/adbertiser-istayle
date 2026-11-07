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

## K7 Brand end card · K1 One-line CTA · K4 Offer card
K7 `{"logo": "logo.png", "headline": "Order na today", "cta": "MESSAGE US", "handle": "@yourpage"}`
K1 `{"cta": "MESSAGE US", "arrow": "👇"}`
K4 `{"title": "Starter Package", "items": ["5 video ads", "Captions + music"], "price": "₱4,999", "note": "Limited slots", "cta": "MESSAGE US"}`
`cta` defaults to `brand.cta`; `logo` to `brand.logo`.

## G1 G2 G3 G7 G8 Captions
`job.captions = {"style": "G1", "file": "words.json", "y": 0.63}`
Captions hide on templates that show their own big text (hooks, prices, chats, cards, end cards) and show on footage (U1, B11). Force per scene with `"captions": true` or `false`.
`words.json`: `[{"w": "Hello", "s": 0.12, "e": 0.40}]`, or `[{"word", "start", "end"}]`, or Whisper-style segments with `words`. `y` = 0–1 of the frame height (keep 0.25–0.75 on 9:16). Captions follow `audio.vo` timing, so transcribe the VO first.

## H1 H2 H3 H4 H6 H7 H9 H10 H12 Transitions
Put `"transition": "H9"` on the scene that comes IN. Each one has its own SFX. Mix 2–3 kinds per ad; don't use a different one on every cut.

## I1 I2 I5 I10 Overlays
`job.overlays = {"watermark": true, "grain": 0.15, "vignette": true, "sample": true}`
`watermark` uses `brand.logo`, or `brand.name` as text.
