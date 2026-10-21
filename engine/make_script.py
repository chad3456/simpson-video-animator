#!/usr/bin/env python3
"""Print a screenplay-style script.md from episode.json (+ timeline.json timings if present).
Usage: python3 make_script.py episodes/<slug>/episode.json > episodes/<slug>/script.md"""
import json, os, sys

ep_path = sys.argv[1]
ep = json.load(open(ep_path))
tl_path = os.path.join(os.path.dirname(ep_path), "timeline.json")
times = {}
if os.path.exists(tl_path):
    for s in json.load(open(tl_path))["shots"]:
        times[(s["seg"], s.get("idx"))] = s["start"]

fmt = lambda t: f"{int(t // 60)}:{int(t % 60):02d}" if t is not None else ""
m, cast = ep["meta"], ep["cast"]
print(f"# {m['show']} {m['episode']}: \"{m['title']}\"\n")
print(f"*{m['logline']}*\n\nFormat: {m['format']}. Source: {m['source']}\n\n{m['disclaimer']}\n")
print("## Cast\n")
for k, c in cast.items():
    print(f"- **{c['name']}**: {c.get('role', '')}" + (f" (voice: `{c['voice']}`)" if c.get("voice") else " (sound effects only)"))
print("\n## Script\n")
LOC = {"newsroom": "KNN NEWSROOM", "townsquare": "TOWN SQUARE", "livingroom": "DOORMAT HOUSE, LIVING ROOM",
       "chalkboard": "KINDLETON U. LECTURE HALL", "tvstudio": "KNN STUDIO B, 'HEART VS HEAD'", "bar": "THE MORAL HAZARD (DIVE BAR)"}
for seg in ep["sequence"]:
    if seg["type"] == "card":
        print(f"**[{fmt(times.get((seg['id'], None)))}] CARD: {seg['title']}**" + (f" / {seg['sub']}" if seg.get("sub") else "") + "\n")
        continue
    print(f"### [{fmt(times.get((seg['id'], 0)))}] INT/EXT. {LOC.get(seg['bg'], seg['bg'].upper())}\n")
    who_here = ", ".join(cast[c]["name"] for c in seg["chars"])
    extras = []
    if seg.get("props", {}).get("dial"): extras.append("the giant EMPATHY-O-MATIC dial")
    if seg.get("props", {}).get("phone"): extras.append("a giant phone")
    print(f"_{who_here}" + (f", with {' and '.join(extras)}" if extras else "") + "._\n")
    for line in seg["lines"]:
        notes = []
        if line.get("board"): notes.append("BOARD: " + " / ".join(line["board"]))
        if line.get("graphic"): notes.append("GRAPHIC: " + line["graphic"] + (" " + line["sub"] if line.get("sub") else ""))
        if line.get("dial") is not None: notes.append(f"DIAL swings to {line['dial']}")
        if line.get("fx"): notes.append("FX: " + line["fx"])
        if line.get("act"): notes.append("ACTION: " + line["act"])
        if line.get("cam"): notes.append("CAM: " + line["cam"])
        n = cast[line["who"]]["name"].upper()
        emote = f" ({line['emote']})" if line.get("emote") and line["emote"] != "neutral" else ""
        print(f"**{n}**{emote}: {line['text']}" + (f"  \n<sub>{'; '.join(notes)}</sub>" if notes else "") + "\n")
