#!/usr/bin/env python3
"""Write a readable script.md for an anime episode from episode.json (+ timeline.json timings if present).
Usage: python3 anime/engine/make_script.py anime/episodes/<slug>/episode.json > anime/episodes/<slug>/script.md"""
import json, os, sys

ep_path = sys.argv[1]
ep = json.load(open(ep_path))
tl_path = os.path.join(os.path.dirname(ep_path), "timeline.json")
times = {}
if os.path.exists(tl_path):
    for s in json.load(open(tl_path))["shots"]:
        times.setdefault((s["seg"], s.get("idx")), s["start"])

fmt = lambda t: f"{int(t // 60)}:{int(t % 60):02d}" if t is not None else "--:--"
m, cast = ep["meta"], ep["cast"]
PLACE = {"laundry_int": "COIN LAUNDRY HOSHIZORA, INSIDE", "laundry_ext": "COIN LAUNDRY HOSHIZORA, OUTSIDE", "bridge": "FUJIMI BRIDGE OVER THE CANAL",
         "street": "A STREET IN KAWABE", "sky": "THE NIGHT SKY", "room_him": "ITSUKI'S FLAT", "room_her": "MIO'S ROOM", "train": "LOCAL TRAIN",
         "carehome": "HIKARI CARE HOME, TSUGAWA", "station": "TOKYO STATION", "card": "TITLE CARD"}
CARD = {"op": "OPENING TITLES", "title": "TITLE", "eyecatch": "EYECATCH", "ed": "ENDING TITLES"}
INS = {"book": "the book", "notebook": "the notebook", "manuscript": "the manuscript", "cover": "the magazine", "photo": "a photograph",
       "cat": "Fyodor the cat", "phone": "the phone", "sign": "the dryer sign", "text": "a note", "window": "the rain on the window"}
SPEAKER = {"hoshino": "MRS. HOSHINO", "salaryman": "THE SALARYMAN"}
name = lambda c: SPEAKER.get(c) or (cast[c]["name"].split()[0].upper() if c in cast else c.upper())

print(f"# {m['show']} {m['episode']}: \"{m['title']}\"\n")
print(f"*{m['logline']}*\n")
print(f"Book: {m.get('book', '')}. Format: anime, about 15 minutes. {m['source']}\n\n{m['disclaimer']}\n")
print("## Cast\n")
for k, c in cast.items():
    print(f"- **{c['name']}**: {c.get('role', '')} (voice: `{c['voice']}`)")
print("- **Fyodor**, the laundry cat (no lines)\n\n## Script\n")


def insert_text(ins):
    k = ins.get("kind")
    bits = [INS.get(k, k)]
    if ins.get("title") and k in ("book", "notebook", "manuscript", "cover"):
        bits.append(f"\"{str(ins['title']).replace(chr(10), ' ')}\"")
    out = f"*INSERT: {' '.join(bits)}.*"
    body = [str(ins.get(x)) for x in ("text", "right") if ins.get(x)]
    if body:
        out += "\n\n" + "\n".join("> " + line for b in body for line in b.split("\n"))
    if ins.get("note"):
        who = {"genzo": "Grandfather's pencil", "mio": "Mio's blue pencil"}.get(ins.get("noteBy"), "Pencil")
        out += f"\n>\n> *{who}:* " + " / ".join(ins["note"].split("\n"))
    return out + "\n"


for seg in ep["sequence"]:
    if seg["type"] == "card":
        st = seg.get("style")
        label = CARD.get(st) or seg.get("title", "")
        extra = f": {seg['title']}" + (f" ({seg['sub']})" if seg.get("sub") else "") if st == "title" else ""
        if st == "ed":
            extra = f'. Over the credits: "{m.get("quote", "")}" ({m.get("quoteBy", "")})'
        if st == "text" and seg.get("sub"):
            extra = f" / {seg['sub']}"
        print(f"**[{fmt(times.get((seg['id'], None)))}] {label}{extra}**\n")
        continue
    if seg.get("style") == "next":
        print(f"### [{fmt(times.get((seg['id'], 0)))}] NEXT TIME: \"{seg.get('nextTitle', '')}\" {seg.get('nextSub', '')}\n")
    else:
        when = "DAY" if seg.get("time") == "day" else "NIGHT"
        wx = {"rain": ", RAIN", "storm": ", TYPHOON", "snow": ", SNOW"}.get(seg.get("weather"), "")
        print(f"### [{fmt(times.get((seg['id'], 0)))}] {PLACE.get(seg['set'], seg['set'].upper())}, {when}{wx}\n")
        if seg.get("caption"):
            print(f"*{seg['caption']}*\n")
        if seg.get("memory"):
            print("*(A memory.)*\n")
    for i, ln in enumerate(seg.get("lines", [])):
        if ln.get("insert") and not ln.get("text"):
            print(insert_text(ln["insert"]))
            continue
        if not ln.get("text"):
            continue
        how = [x for x in ("thought", "phone", "memory", "vo") if ln.get(x)]
        tag = {"thought": "thinking", "phone": "on the phone", "memory": "remembered", "vo": "voice over"}
        paren = f" ({', '.join(tag[h] for h in how)})" if how else ""
        print(f"**{name(ln['who'])}**{paren}: {ln['text']}\n")
        if ln.get("insert"):
            print(insert_text(ln["insert"]))
