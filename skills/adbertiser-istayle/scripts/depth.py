"""Depth map + foreground cut for the 2.5D look (D2, D11, K14).

Model: Depth Anything V2 Small (Apache 2.0), downloaded once (~100 MB) from Hugging Face.
usage:  python depth.py photo.jpg [--fg 0.6]
writes: photo_depth.png  (white = near)   photo_fg.png  (photo with only the near part kept, for text-behind effects)
needs:  pip install transformers torch pillow numpy   (a GPU is optional; CPU takes ~5-20 s per photo)
"""
import sys

import numpy as np
from PIL import Image, ImageFilter
from transformers import pipeline


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    src = sys.argv[1]
    cut = float(sys.argv[sys.argv.index("--fg") + 1]) if "--fg" in sys.argv else 0.6
    base = src.rsplit(".", 1)[0]
    img = Image.open(src).convert("RGB")
    pipe = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf")
    depth = pipe(img)["depth"].resize(img.size, Image.BICUBIC).convert("L")
    d = np.asarray(depth).astype(np.float32)
    d = (d - d.min()) / max(1e-6, d.max() - d.min())
    depth = Image.fromarray((d * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))
    depth.save(f"{base}_depth.png")
    # foreground: the nearest part (depth above the cut), soft edge
    mask = Image.fromarray(((d > cut) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))
    fg = img.copy()
    fg.putalpha(mask)
    fg.save(f"{base}_fg.png")
    print(f"{base}_depth.png\n{base}_fg.png")


if __name__ == "__main__":
    main()
