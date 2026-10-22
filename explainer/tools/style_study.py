#!/usr/bin/env python3
"""Private style study: sample frames from reference videos and measure their look.

For each video (a YouTube/Vimeo URL via yt-dlp, or a local file) this writes, under --out (default .style-study/):
  frames/<name>/*.jpg     one frame every --every seconds (320 px wide)
  sheets/<name>.jpg       a contact sheet of those frames
  report.md               shot length (scene-cut detection), palette (k-means), brightness and saturation stats
  palette.json            the merged palette, ready to compare with the PAL tokens in explainer/engine/explainer.js

Everything it downloads or extracts is for private analysis only. .style-study/ is gitignored: never commit,
publish or reuse frames, audio, characters or logos from someone else's videos. Use the numbers, not the pixels.

Usage:
  pip install yt-dlp pillow numpy          # plus ffmpeg on PATH
  python3 explainer/tools/style_study.py URL_OR_FILE [...] [--every 4] [--max-minutes 6] [--out .style-study]
"""
import argparse, json, os, re, subprocess, sys
import numpy as np
from PIL import Image


def fetch(src, raw_dir, max_minutes):
    if os.path.exists(src):
        return src, os.path.splitext(os.path.basename(src))[0]
    import yt_dlp   # only needed for URLs
    opts = {"format": "bv*[height<=360][ext=mp4]/bv*[height<=360]/b[height<=360]", "outtmpl": os.path.join(raw_dir, "%(id)s.%(ext)s"),
            "quiet": True, "noplaylist": True, "download_ranges": yt_dlp.utils.download_range_func(None, [(0, max_minutes * 60)])}
    with yt_dlp.YoutubeDL(opts) as y:
        info = y.extract_info(src, download=True)
        return y.prepare_filename(info), info["id"]


def frames(video, out_dir, every):
    os.makedirs(out_dir, exist_ok=True)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", video, "-vf", f"fps=1/{every},scale=320:-2", os.path.join(out_dir, "%04d.jpg")], check=True)
    return sorted(os.path.join(out_dir, f) for f in os.listdir(out_dir) if f.endswith(".jpg"))


def shot_stats(video, threshold=0.3):
    r = subprocess.run(["ffmpeg", "-i", video, "-vf", f"select='gt(scene,{threshold})',showinfo", "-an", "-f", "null", "-"], capture_output=True, text=True)
    cuts = [float(m) for m in re.findall(r"pts_time:([\d.]+)", r.stderr)]
    dur = None
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", r.stderr)
    if m:
        dur = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])
    return cuts, dur


def contact_sheet(paths, dest, cols=6):
    if not paths:
        return
    ims = [Image.open(p).convert("RGB") for p in paths]
    w, h = ims[0].size
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * w, rows * h), (10, 10, 20))
    for i, im in enumerate(ims):
        sheet.paste(im.resize((w, h)), ((i % cols) * w, (i // cols) * h))
    sheet.save(dest, quality=82)


def palette(paths, k=10):
    px = np.concatenate([np.asarray(Image.open(p).convert("RGB").resize((80, 45))).reshape(-1, 3) for p in paths])
    img = Image.fromarray(px.reshape(1, -1, 3).astype(np.uint8))
    q = img.quantize(colors=k, method=Image.Quantize.MEDIANCUT)
    pal = np.array(q.getpalette()[: k * 3]).reshape(-1, 3)
    counts = np.bincount(np.asarray(q).ravel(), minlength=k)
    order = np.argsort(-counts)
    hsv = np.asarray(Image.fromarray(px.reshape(1, -1, 3).astype(np.uint8)).convert("HSV")).reshape(-1, 3) / 255.0
    return ([("#%02x%02x%02x" % tuple(pal[i]), round(float(counts[i] / counts.sum()), 3)) for i in order],
            {"mean_saturation": round(float(hsv[:, 1].mean()), 3), "mean_brightness": round(float(hsv[:, 2].mean()), 3),
             "dark_share": round(float((hsv[:, 2] < 0.3).mean()), 3), "vivid_share": round(float(((hsv[:, 1] > 0.55) & (hsv[:, 2] > 0.55)).mean()), 3)})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("sources", nargs="+")
    ap.add_argument("--every", type=float, default=4)
    ap.add_argument("--max-minutes", type=float, default=6)
    ap.add_argument("--out", default=".style-study")
    a = ap.parse_args()
    raw = os.path.join(a.out, "raw"); os.makedirs(raw, exist_ok=True); os.makedirs(os.path.join(a.out, "sheets"), exist_ok=True)
    report, merged = ["# Style study (private, do not commit)\n"], []
    for src in a.sources:
        video, name = fetch(src, raw, a.max_minutes)
        paths = frames(video, os.path.join(a.out, "frames", name), a.every)
        contact_sheet(paths, os.path.join(a.out, "sheets", name + ".jpg"))
        cuts, dur = shot_stats(video)
        pal, stats = palette(paths)
        merged += pal
        asl = (dur / (len(cuts) + 1)) if dur else None
        report.append(f"## {name}\n\n- frames sampled: {len(paths)}; duration {dur:.0f}s; cuts {len(cuts)}; average shot length "
                      f"{asl:.1f}s\n- saturation {stats['mean_saturation']}, brightness {stats['mean_brightness']}, dark share {stats['dark_share']}, "
                      f"vivid share {stats['vivid_share']}\n- palette: " + " ".join(f"`{c}` {int(s * 100)}%" for c, s in pal) + "\n")
        print(f"{name}: {len(paths)} frames, {len(cuts)} cuts", file=sys.stderr)
    agg = {}
    for c, s in merged:
        agg[c] = agg.get(c, 0) + s
    json.dump(sorted(agg.items(), key=lambda x: -x[1])[:24], open(os.path.join(a.out, "palette.json"), "w"), indent=1)
    open(os.path.join(a.out, "report.md"), "w").write("\n".join(report))
    print(f"wrote {a.out}/report.md, palette.json and contact sheets", file=sys.stderr)


if __name__ == "__main__":
    main()
