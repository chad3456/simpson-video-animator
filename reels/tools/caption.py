#!/usr/bin/env python3
"""Write caption.txt for a reel: the Instagram caption, hashtags, art credits and the music note.
Usage: python3 reels/tools/caption.py reels/days/<slug>"""
import json, os, sys
d = sys.argv[1]
r = json.load(open(os.path.join(d, "reel.json"), encoding="utf-8"))
cr = json.load(open(os.path.join(d, "credits.json"), encoding="utf-8")) if os.path.exists(os.path.join(d, "credits.json")) else []
seen, art = set(), []
for c in cr:
    if c["file"] in seen:
        continue
    seen.add(c["file"])
    who = c.get("artist") or "unknown artist"
    art.append(f"• {c['file'][5:].rsplit('.', 1)[0]} ({who}; {c.get('license', '')}, Wikimedia Commons)")
v = r["verse"]
out = [r["caption"], "", " ".join(r.get("hashtags", [])), "",
       f"Verse: Valmiki Ramayana, {v['kanda'].title()} Kanda {v['sarga']}.{v['shloka']} (check it at valmiki.iitk.ac.in). English rendering ours: {v['translation']}",
       "", "Art (public domain / open licence, given a paint-and-ink treatment):", *art, "",
       "Music: original score made for this reel (no copyright claims). The file reel_nomusic.mp4 has voice only,",
       "if you'd rather add a track from Instagram's music library when posting. Suggestions:",
       *[f"• {m}" for m in r.get("music_suggestions", [])]]
open(os.path.join(d, "caption.txt"), "w", encoding="utf-8").write("\n".join(out) + "\n")
print("\n".join(out))
