#!/usr/bin/env python3
"""Give every image in a reel the same 2D paint-and-ink look, so a 1605 Orchha folio, a Kangra miniature and a
Ravi Varma oleograph sit together in one reel.

art/<key>.jpg -> art/<key>.paint.jpg : smoothed into flat painted areas, warm saturated grade, inked outlines
pulled from the image's own edges, and a paper grain multiplied over the top.
Usage: python3 reels/tools/prep_art.py reels/days/<slug>
"""
import glob, os, sys
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
from scipy import ndimage

Image.MAX_IMAGE_PIXELS = None


def paper(h, w, seed=3):
    r = np.random.default_rng(seed)
    lo = ndimage.gaussian_filter(r.standard_normal((h // 8 + 1, w // 8 + 1)), 3)
    lo = np.kron(lo, np.ones((8, 8)))[:h, :w]
    fine = ndimage.gaussian_filter(r.standard_normal((h, w)), 0.8)
    p = 1 - 0.05 * (lo - lo.min()) / (np.ptp(lo) + 1e-9) - 0.025 * np.clip(fine, -2, 2)
    return p[..., None]


def paint(src, dst, max_side=2200):
    im = Image.open(src).convert("RGB")
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    if max(im.size) < 1400:  # small sources: upscale before painting so strokes stay crisp at 1080x1920
        f = 1400 / max(im.size); im = im.resize((int(im.width * f), int(im.height * f)), Image.LANCZOS)
    flat = im.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.ModeFilter(5))
    flat = ImageEnhance.Color(flat).enhance(1.25)
    flat = ImageEnhance.Contrast(flat).enhance(1.08)
    a = np.asarray(flat).astype(np.float32) / 255
    g = np.asarray(im.convert("L")).astype(np.float32) / 255
    g = ndimage.gaussian_filter(g, 1.2)
    mag = np.hypot(ndimage.sobel(g, 0), ndimage.sobel(g, 1))
    ink = np.clip((mag - 0.12) / 0.25, 0, 1)
    ink = ndimage.gaussian_filter(ink, 0.7)
    a = a * (1 - 0.55 * ink[..., None])
    warm = np.array([1.04, 1.0, 0.92], np.float32)
    a = np.clip(a * warm * paper(*a.shape[:2]), 0, 1)
    Image.fromarray((a * 255).astype(np.uint8)).save(dst, quality=91)


if __name__ == "__main__":
    d = sys.argv[1]
    for f in sorted(glob.glob(os.path.join(d, "art", "*.jpg"))):
        if f.endswith(".paint.jpg"):
            continue
        out = f[:-4] + ".paint.jpg"
        if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(f):
            paint(f, out); print("painted", os.path.basename(out))
