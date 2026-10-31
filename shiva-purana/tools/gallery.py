#!/usr/bin/env python3
"""Add or refresh the Shiva Purana entries in episodes/index.json (the gallery manifest), leaving every other entry as it is.
Each episode lists its English version and, under "dub", the Hindi version in hi/ (own video, poster, script, duration).
Usage: python3 shiva-purana/tools/gallery.py"""
import glob, json, os

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
BASE, PLAYER = "shiva-purana/episodes", "shiva-purana/engine/player.html"
SHOW, CATEGORY = "Shiva Purana", "Shiva Purana (mythology comic series)"
items = []
for path in sorted(glob.glob(os.path.join(root, BASE, "*", "episode.json"))):
    d = os.path.dirname(path); slug = os.path.basename(d)
    tl = os.path.join(d, "timeline.json")
    if slug.startswith("_") or not os.path.exists(tl) or not os.path.exists(os.path.join(d, "script.md")):   # finished renders only (script.md is written last)
        continue
    m = json.load(open(path, encoding="utf-8"))["meta"]
    has = lambda f: os.path.exists(os.path.join(d, f))
    e = {
        "slug": f"sp-{slug}", "dir": f"{BASE}/{slug}/", "playerPage": PLAYER, "show": SHOW, "episode": f"E{m.get('episode')}",
        "title": m.get("title"), "logline": m.get("logline"), "rating": "general", "format": "comic", "note": None,
        "category": CATEGORY, "source": m.get("source"), "duration": json.load(open(tl))["duration"],
        "video": "episode.mp4", "poster": "poster.jpg" if has("poster.jpg") else None,
        "player": False, "script": has("script.md"), "bible": False,
    }
    if has("hi/timeline.json") and has("hi/script.md"):
        e["dub"] = {"hi": {"dir": "hi/", "label": "हिंदी", "title": m.get("title_hi"), "logline": m.get("logline_hi"),
                           "video": "episode.mp4", "poster": "poster.jpg" if has("hi/poster.jpg") else None,
                           "script": has("hi/script.md"), "duration": json.load(open(os.path.join(d, "hi", "timeline.json")))["duration"]}}
    items.append(e)
man = os.path.join(root, "episodes", "index.json")
old = json.load(open(man, encoding="utf-8"))
keep = [e for e in old if not e.get("dir", "").startswith(BASE + "/")]
open(man, "w", encoding="utf-8").write(json.dumps(keep + items, indent=2, ensure_ascii=False) + "\n")
print(f"{len(items)} Shiva Purana episodes; {len(keep) + len(items)} in episodes/index.json")
