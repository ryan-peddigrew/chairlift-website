"""Make light WebP copies of the site's photos (run once after adding or replacing a photo).

For every JPG/PNG in images/ (top level and retro/, wastemind-*, posters) it writes
  name-800.webp   (800 px wide, for phones)
  name-1200.webp  (up to 1200 px wide, for laptops)
next to the original. The originals stay untouched as the fallback.
tools/common.py then points <img> tags (srcset) and video posters at these copies automatically.
"""
import os, sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SKIP = ("email-", "signature", "patrol/", "paper-comic.png", "paper-comic-strip.png", "sample-morning-paper")

def sources():
    for d in ("images", "images/retro"):
        for f in sorted(os.listdir(os.path.join(ROOT, d))):
            p = f"{d}/{f}"
            if f.lower().endswith((".jpg", ".jpeg", ".png")) and not any(s in p for s in SKIP):
                yield p

def out_name(p, w):
    return os.path.splitext(p)[0] + f"-{w}.webp"

def main(force=False):
    for p in sources():
        src = os.path.join(ROOT, p)
        im = Image.open(src)
        im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") and "transparency" in im.info or im.mode == "RGBA" else "RGB")
        for w in (800, 1200):
            dst = os.path.join(ROOT, out_name(p, w))
            if not force and os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
                continue
            if w == 1200 and im.width <= 800:
                continue          # small image: the 800 copy is the only one needed
            tw = min(w, im.width)
            th = round(im.height * tw / im.width)
            r = im.resize((tw, th), Image.LANCZOS) if tw != im.width else im
            r.save(dst, "WEBP", quality=74, method=6)
            print(f"{p} -> {os.path.relpath(dst, ROOT)}  {os.path.getsize(src)//1024} KB -> {os.path.getsize(dst)//1024} KB")

if __name__ == "__main__":
    main("--force" in sys.argv)
