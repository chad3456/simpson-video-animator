#!/usr/bin/env python3
"""Write episodes/index.json (the gallery manifest) from every episodes/*/episode.json and explainer/episodes/*/episode.json.
Usage: python3 engine/build_gallery.py"""
import glob, json, os

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
items = []
SHOWS = [("episodes", "engine/player.html"), ("explainer/episodes", "explainer/engine/player.html")]
paths = [(p, base, player) for base, player in SHOWS for p in sorted(glob.glob(os.path.join(root, base, "*", "episode.json")))]
for path, base, player in paths:
    d = os.path.dirname(path); slug = os.path.basename(d)
    if slug.startswith("_"):
        continue  # scratch episodes
    m = json.load(open(path))["meta"]
    tl = os.path.join(d, "timeline.json")
    if not os.path.exists(tl):
        continue  # script-only drafts stay out of the gallery
    has = lambda f: os.path.exists(os.path.join(d, f))
    items.append({
        "slug": slug, "dir": f"{base}/{slug}/", "playerPage": player, "show": m.get("show"), "episode": m.get("episode"), "title": m.get("title"),
        "logline": m.get("logline"), "rating": m.get("rating", "general"), "format": m.get("format"), "note": m.get("content_note"), "category": m.get("category") or "Other",
        "source": m.get("source"),
        "duration": json.load(open(tl))["duration"] if os.path.exists(tl) else None,
        "video": "episode.mp4" if has("episode.mp4") else None,
        "poster": "poster.jpg" if has("poster.jpg") else None,
        "player": has("episode.mp3") and os.path.exists(tl),
        "script": has("script.md"), "bible": has("bible.md"),
    })
import re
nat = lambda e: [int(x) if x.isdigit() else x for x in re.split(r"(\d+)", e.get("episode") or "")]
items.sort(key=lambda e: (e["category"], e["show"] or "", nat(e), e["slug"]))
json.dump(items, open(os.path.join(root, "episodes", "index.json"), "w"), indent=2)
print(f"{len(items)} episodes in episodes/index.json")
