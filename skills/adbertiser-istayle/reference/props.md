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

## G1 G2 G3 G7 G8 G13 Captions
`job.captions = {"style": "G1", "file": "words.json", "y": 0.63}`
Captions hide on templates that show their own big text (hooks, prices, chats, cards, end cards) and show on footage (U1, B11). Force per scene with `"captions": true` or `false`.
`words.json`: `[{"w": "Hello", "s": 0.12, "e": 0.40}]`, or `[{"word", "start", "end"}]`, or Whisper-style segments with `words`. `y` = 0–1 of the frame height (keep 0.25–0.75 on 9:16). Captions follow `audio.vo` timing, so transcribe the VO first.

## H1 H2 H3 H4 H6 H7 H9 H10 H12 H14 H17 Transitions
Put `"transition": "H9"` on the scene that comes IN. Each one has its own SFX. Mix 2–3 kinds per ad; don't use a different one on every cut.

## I1 I2 I5 I10 Overlays
`job.overlays = {"watermark": true, "grain": 0.15, "vignette": true, "sample": true}`
`watermark` uses `brand.logo`, or `brand.name` as text.
