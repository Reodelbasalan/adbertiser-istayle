# Job file

One JSON file = one video. Paths are relative to the job file. Example: `examples/demo-job.json`.

```json
{
  "name": "milktea-promo",
  "size": "9:16",
  "fps": 30,
  "brand": {
    "name": "BOBA HAUS",
    "primary": "#FFD23F",
    "secondary": "#7C5CFF",
    "bg": "#0E0E12",
    "text": "#FFFFFF",
    "paper": "#F2EADB",
    "headingFont": "Anton",
    "font": "Poppins",
    "handFont": "Permanent Marker",
    "logo": "assets/logo.png",
    "cta": "MESSAGE US",
    "handle": "@bobahaus"
  },
  "audio": {"vo": "assets/vo.mp3", "music": "assets/music.mp3", "musicVolume": 0.12},
  "captions": {"style": "G1", "file": "assets/words.json"},
  "overlays": {"watermark": true, "grain": 0.12},
  "sfx": true,
  "sfxVolume": 0.5,
  "scenes": [
    {"style": "J1", "dur": 2.2, "props": {"text": "Bitin ka ba sa boba?", "highlight": "boba"}},
    {"style": "U1", "dur": 3, "transition": "H7", "props": {"media": "assets/pour.mp4", "punchAt": 1.4}},
    {"style": "F6", "dur": 2.8, "transition": "H2", "props": {"product": "assets/cup.png", "price": "₱99"}},
    {"style": "K7", "dur": 2.5, "transition": "H12", "props": {"headline": "Order na today"}}
  ]
}
```

| Field | Notes |
| --- | --- |
| `size` | `9:16` (1080×1920) · `16:9` (1920×1080) · `1:1` · `4:5` (1080×1350) |
| `brand` | Every field optional. Bundled fonts: Anton, Poppins, Permanent Marker, Special Elite, Playfair Display, Montserrat, Bebas Neue, Inter. Any other name is used as a font installed on the machine. |
| `audio.vo` | Voice-over. Scene durations should add up to the VO length; set them from the VO transcript. |
| `audio.music` | The user's own licensed track. Default volume 0.12 under a VO, 0.35 without. |
| `captions` | See G1 in `props.md`. Needs word timings of the VO. |
| `scenes[].dur` | Seconds. Total length = sum of `dur`. Transitions overlap 0.4 s into the previous scene. |
| `sfx` | `false` turns off all automatic SFX. `sfxVolume` scales them (default 0.5). |

Output: `out/<name>.mp4` next to the job file (stills: `out/<name>_<t>s.jpg` + `out/<name>_sheet.jpg`).
