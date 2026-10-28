#!/usr/bin/env python3
"""Print a narration script (script.md) from an explainer episode.json, with timings if timeline.json exists.
Usage: python3 explainer/engine/make_script.py explainer/episodes/<slug>/episode.json > explainer/episodes/<slug>/script.md"""
import json, os, sys

ep_path = sys.argv[1]
ep = json.load(open(ep_path))
tl_path = os.path.join(os.path.dirname(ep_path), "timeline.json")
times = {}
if os.path.exists(tl_path):
    for s in json.load(open(tl_path))["shots"]:
        times[(s["seg"], s.get("idx"))] = s["start"]

fmt = lambda t: f"{int(t // 60)}:{int(t % 60):02d}" if t is not None else "-"
m = ep["meta"]
print(f"# {m['show']} {m['episode']}: \"{m['title']}\"\n")
print(f"*{m['logline']}*\n\nSource: {m['source']}\n\n{m['disclaimer']}\n")
voice = ep["cast"].get(m.get("narrator", "narrator"), {})
print(f"Narrator voice: `{voice.get('voice')}` at speed {voice.get('speed', 1.0)}. Score: original ambient ({m.get('music')}).\n")
for seg in ep["sequence"]:
    if seg["type"] == "card":
        if seg.get("style") in ("end", "endx"):
            print(f"\n**[{fmt(times.get((seg['id'], None)))}] END CARD**\n")
            for c in seg.get("credits", []):
                print(f"- {c}")
            continue
        label = f"{seg.get('kicker', '')}: " if seg.get("kicker") else ""
        title = seg.get("title") or " ".join(seg.get("lines", []))
        if seg.get("sub"):
            title += f" ({seg['sub']})"
        print(f"\n## [{fmt(times.get((seg['id'], None)))}] {label}{title}\n")
        continue
    bg = seg.get("bg", {})
    if isinstance(bg, str):
        bg = {"kind": bg}
    els = ", ".join(sorted({e["type"] for e in seg.get("els", [])}))
    print(f"\n_[{fmt(times.get((seg['id'], 0)))}] Scene `{seg['id']}`: {bg.get('kind', 'studio')} / {bg.get('pal', 'midnight')}; on screen: {els}._\n")
    for i, line in enumerate(seg["lines"]):
        if line.get("text"):
            print(f"- `{fmt(times.get((seg['id'], i)))}` {line['text']}")
        else:
            print(f"- `{fmt(times.get((seg['id'], i)))}` *(music beat, {line.get('dur', 1.5)}s)*")
