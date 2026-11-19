"""Prepare archival images for the collage: background-removed sticker cut-outs (grayscale, white edge, baked shadow,
torn bottom) and print plates (resized, light grain). Writes <out>/<key>.(png|jpg) and <out>/manifest.json."""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter, ImageOps, ImageEnhance

SRC, OUT = sys.argv[1], sys.argv[2]
CUT = {"dost_1879", "dost_photo", "camus", "solzh"}
GRAY_PRINT = {"ambrose", "rask_1881", "nechayev", "liu1967", "shanghai1967", "petrograd", "redguards"}
# Other episodes override the sets: LUMEN_CUT="a,b" LUMEN_GRAY="c,d" python3 prep_images.py <src> <out>
if "LUMEN_CUT" in os.environ: CUT = set(filter(None, os.environ["LUMEN_CUT"].split(",")))
if "LUMEN_GRAY" in os.environ: GRAY_PRINT = set(filter(None, os.environ["LUMEN_GRAY"].split(",")))
os.makedirs(OUT, exist_ok=True)
man = json.load(open(os.path.join(OUT, "manifest.json"))) if os.path.exists(os.path.join(OUT, "manifest.json")) else {}
sess = None

def grain(im, amt=10, seed=1):
    a = np.asarray(im).astype(np.float32)
    n = np.random.default_rng(seed).normal(0, amt, a.shape[:2])[..., None]
    a[..., :3] = np.clip(a[..., :3] + n, 0, 255)
    return Image.fromarray(a.astype(np.uint8), im.mode)

for f in sorted(os.listdir(SRC)):
    key, ext = os.path.splitext(f)
    if len(sys.argv) > 3 and key not in sys.argv[3:]: continue
    im = Image.open(os.path.join(SRC, f)).convert("RGB")
    if key in CUT:
        global_sess = None
        if sess is None:
            from rembg import new_session, remove
            sess = new_session("u2net_human_seg")
        from rembg import remove
        cut = remove(im, session=sess)
        a = np.asarray(cut.getchannel("A")).astype(np.float32) / 255
        a = (np.clip((a - 0.35) / 0.3, 0, 1) * 255).astype(np.uint8)
        g = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=1)
        g = ImageEnhance.Contrast(g).enhance(1.15)
        rgb = Image.merge("RGB", [g, g, g.point(lambda v: int(v * 0.97))])
        rgba = rgb.copy(); rgba.putalpha(Image.fromarray(a))
        bbox = rgba.getchannel("A").getbbox(); rgba = rgba.crop(bbox)
        w, h = rgba.size; s = min(1.0, 900 / h); rgba = rgba.resize((int(w * s), int(h * s)), Image.LANCZOS); w, h = rgba.size
        # torn bottom edge where the bust meets the frame
        al = np.asarray(rgba.getchannel("A")).copy(); rng = np.random.default_rng(len(key))
        edge = h - 6 - np.abs(np.cumsum(rng.normal(0, 1.6, w))).clip(0, 14).astype(int)
        for x in range(w): al[edge[x]:, x] = 0
        rgba.putalpha(Image.fromarray(al))
        pad = 30; can = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
        A = Image.new("L", can.size, 0); A.paste(rgba.getchannel("A"), (pad, pad))
        border = A.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(0.8))
        shadow = border.filter(ImageFilter.GaussianBlur(6)).point(lambda v: int(v * 0.4))
        sh = Image.new("RGBA", can.size, (20, 16, 10, 0)); sh.putalpha(shadow)
        can.alpha_composite(sh, (6, 9))
        wl = Image.new("RGBA", can.size, (250, 247, 238, 0)); wl.putalpha(border); can.alpha_composite(wl)
        can.alpha_composite(rgba, (pad, pad))
        out = f"{key}.png"; can.save(os.path.join(OUT, out), optimize=True)
        man[key] = {"src": "assets/" + out, "w": can.size[0], "h": can.size[1], "mode": "cut"}
    else:
        w, h = im.size; s = min(1.0, 1400 / max(w, h)); im = im.resize((int(w * s), int(h * s)), Image.LANCZOS)
        if key in GRAY_PRINT:
            g = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=1); im = Image.merge("RGB", [g, g, g])
        im = grain(im, 7)
        out = f"{key}.jpg"; im.save(os.path.join(OUT, out), quality=86)
        man[key] = {"src": "assets/" + out, "w": im.size[0], "h": im.size[1], "mode": "print"}
    print(key, man[key])
json.dump(man, open(os.path.join(OUT, "manifest.json"), "w"), indent=1)
