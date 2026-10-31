#!/usr/bin/env python3
"""screenplay.txt -> episode.json (English) and hi/episode.json (Hindi dub) for the Shiva Purana comic.

Every spoken line carries both languages:  WHO (mods) [cam]: English text || हिंदी पाठ
Card and scene text takes a _hi twin: title=... title_hi=..., caption=... caption_hi=..., credits_hi=a;b
Sound-effect lettering: (bang=BOOM|धड़ाम, bangPos=900,200). Same staging syntax as Mahagatha:

Header:   key: value   (title, episode, slug, kicker, sub, logline, source ...)
Segments:
  == OPEN | dur=16
  == TITLE | dur=7 | kicker=... | title=... | sub=...
  == CHAPTER | dur=4.5 | kicker=कथा १ | title=...
  == END | dur=12 | title=... | sub=... | credits=line one;line two
  == NEXT | dur=9 | title=... | sub=...       (lines that follow are voiced over the card)
  == SCENE id | set=ocean time=night music=cosmic amb=ocean trans=mandala cam=wide tint=#000,0.3 caption=...
Inside a scene:
  @ id key=val ...          a character or creature (cast id; fig=other cast look)   appears at the next line
  + id kind=om key=val ...  an effect element                                         appears at the next line
  - id [od=0.5]             removes an element at the next line
  > id key=val ... [t=1.2 d=0.3]   a keyframe that starts with the next line
  WHO (emo, pose=x, sfx=a,b, shake=6, flash) [cam]: Hindi text      [~cam] moves the camera instead of cutting
  BEAT 2.5 [cam] (sfx=conch, shake=4, flash)
Lines starting with # are comments. Values: numbers, true/false, or text; a value in quotes may contain spaces.
Usage: python3 shiva-purana/engine/screenplay.py shiva-purana/episodes/<slug>/screenplay.txt
"""
import copy, json, os, re, shlex, sys

HERE = os.path.dirname(os.path.abspath(__file__))
EMOS = {"smile", "joy", "angry", "rage", "fear", "sad", "calm", "serene", "sly", "meditate", "neutral", "shock"}


def val(v):
    if v in ("true", "false"): return v == "true"
    try:
        return int(v) if re.fullmatch(r"-?\d+", v) else float(v)
    except ValueError:
        return v


def rejoin(tokens):
    """Mods are comma separated, so a value like bangPos=640,200 or tint=#000,0.3 arrives split; glue the pieces back."""
    out = []
    for tok in tokens:
        if out and "=" in out[-1] and re.fullmatch(r"-?[\d.]+", tok.strip()):
            out[-1] += "," + tok.strip()
        else:
            out.append(tok)
    return out


def kv(tokens):
    out = {}
    for tok in tokens:
        if "=" in tok:
            k, v = tok.split("=", 1)
            out[k.strip()] = val(v.strip())
        elif tok.strip():
            out[tok.strip()] = True
    return out


def split_args(s):
    try:
        return shlex.split(s)
    except ValueError:
        return s.split()


def parse(path):
    cast = json.load(open(os.path.join(HERE, "..", "cast.json"), encoding="utf-8"))
    meta, seq = {}, []
    scene = None
    pending_keys, pending_in, pending_out = [], [], []

    def flush_scene():
        nonlocal scene
        if scene is not None:
            seq.append(scene)
        scene = None

    def attach_pending(line_idx):
        nonlocal pending_keys, pending_in, pending_out
        for el in pending_in:
            if line_idx > 0 or el.get("in") is None:
                el["in"] = line_idx
            scene["els"].append(el)
        for (eid, extra) in pending_out:
            for el in scene["els"]:
                if el["id"] == eid:
                    el["out"] = line_idx
                    el.update(extra)
        for (eid, k) in pending_keys:
            for el in scene["els"]:
                if el["id"] == eid:
                    el.setdefault("keys", {}).setdefault(str(line_idx), []).append(k)
                    break
            else:
                print(f"warning: key for unknown element {eid} in scene {scene['id']}", file=sys.stderr)
        pending_keys, pending_in, pending_out = [], [], []

    lines = open(path, encoding="utf-8").read().split("\n")
    in_header = True
    for raw in lines:
        line = raw.rstrip()
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if in_header and not line.startswith("==") and re.match(r"^[a-zA-Z_]+\s*:", line):
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
            continue
        in_header = False
        if line.startswith("=="):
            if scene is not None and (pending_in or pending_keys):
                attach_pending(len(scene["lines"]))
            flush_scene()
            body = line[2:].strip()
            parts = [p.strip() for p in body.split("|")]
            head = parts[0].split()
            kind = head[0].upper()
            opts = {}
            for p in parts[1:]:
                if "=" in p and not re.search(r"\s\w+=", p):
                    k, v = p.split("=", 1); opts[k.strip()] = val(v.strip())
                else:
                    opts.update(kv(split_args(p)))
            if kind == "SCENE":
                sid = head[1] if len(head) > 1 else f"s{len(seq)}"
                scene = {"type": "scene", "id": sid, "set": opts.pop("set", "void"), "ctx": {}, "els": [], "lines": []}
                for k in ("time", "wall", "col"):
                    if k in opts: scene["ctx"][k] = opts.pop(k)
                if "amb" in opts: opts["amb"] = [a for a in str(opts["amb"]).split(",") if a]
                if "tint" in opts:
                    c, a = str(opts.pop("tint")).split(","); scene["tint"] = [c, float(a)]
                scene.update(opts)
            else:
                style = {"OPEN": "open", "TITLE": "title", "CHAPTER": "chapter", "END": "end", "NEXT": "next", "TEXT": "text"}[kind]
                seg = {"type": "card", "id": f"{style}{len(seq)}", "style": style, "lines": []}
                for ck in ("credits", "credits_hi"):
                    if ck in opts: opts[ck] = [c.strip() for c in str(opts[ck]).split(";")]
                seg.update(opts)
                seg.setdefault("dur", {"open": 16, "title": 7, "chapter": 4.6, "end": 12, "next": 6, "text": 5}[style])
                if style in ("next",):
                    scene = seg   # voiced lines may follow
                    scene["els"] = []
                    continue
                seq.append(seg)
            continue
        if scene is None:
            raise SystemExit(f"line outside a scene: {line}")
        s = line.strip()
        if s[0] in "@+":
            toks = split_args(s[1:].strip())
            el = {"id": toks[0]}
            el.update(kv(toks[1:]))
            if s[0] == "@":
                pass
            else:
                el.setdefault("kind", "glow")
                el["kind"] = el["kind"]
            if s[0] == "+":
                el["kind_fx"] = True
            if "in" in el:   # explicit line index
                scene["els"].append(el)
            else:
                pending_in.append(el)
            continue
        if s[0] == "-":
            toks = split_args(s[1:].strip())
            pending_out.append((toks[0], kv(toks[1:])))
            continue
        if s[0] == ">":
            toks = split_args(s[1:].strip())
            pending_keys.append((toks[0], kv(toks[1:])))
            continue
        m = re.match(r"^BEAT\s+([\d.]+)\s*(.*)$", s)
        if m:
            rest = m.group(2)
            ln = {"text": "", "dur": float(m.group(1))}
            cm = re.search(r"\[([^\]]*)\]", rest)
            if cm:
                c = cm.group(1).strip()
                if c.startswith("~"): ln["camMove"] = True; c = c[1:]
                ln["cam"] = c
            mm = re.search(r"\(([^)]*)\)", rest)
            if mm: ln.update(kv(rejoin([x.strip() for x in mm.group(1).split(",")])))
            attach_pending(len(scene["lines"]))
            scene["lines"].append(ln)
            continue
        m = re.match(r"^([A-Z_0-9]+)\s*(\([^)]*\))?\s*(\[[^\]]*\])?\s*(\([^)]*\))?\s*:\s*(.+)$", s)
        if not m:
            raise SystemExit(f"cannot parse: {line}")
        who = m.group(1).lower()
        if who not in cast:
            raise SystemExit(f"unknown speaker {who}: {line}")
        en, _, hi = m.group(5).partition("||")
        ln = {"who": who, "text": en.strip(), "text_hi": hi.strip() or en.strip()}
        if not hi.strip(): print(f"warning: no Hindi for: {line}", file=sys.stderr)
        mods = (m.group(2) or m.group(4) or "")[1:-1]
        if m.group(3):
            c = m.group(3)[1:-1].strip()
            if c.startswith("~"): ln["camMove"] = True; c = c[1:]
            if c: ln["cam"] = c
        key = {}
        for tok in rejoin([x.strip() for x in mods.split(",") if x.strip()]):
            if tok in EMOS: key["emo"] = tok
            elif "=" in tok:
                k, v = tok.split("=", 1)
                if k in ("pose", "gaze", "item", "seat", "fly", "lean", "walk"): key[k] = val(v)
                else: ln[k] = val(v)
            else: ln[tok] = True
        idx = len(scene["lines"])
        attach_pending(idx)
        if key:
            key.setdefault("t", 0.45)
            for el in scene["els"]:
                if el["id"] == who:
                    el.setdefault("keys", {}).setdefault(str(idx), []).append(key); break
        scene["lines"].append(ln)
    if scene is not None:
        if pending_in or pending_keys: attach_pending(len(scene["lines"]))
        flush_scene()
    # tidy: fx elements keep their kind name; drop helper flag
    for seg in seq:
        for el in seg.get("els", []):
            if el.pop("kind_fx", False):
                pass
    used = {ln.get("who") for seg in seq for ln in seg.get("lines", []) if ln.get("who")}
    for w in list(used):   # twins and duets are voiced by their members
        used.update((cast.get(w) or {}).get("twin") or (cast.get(w) or {}).get("duet") or [])
    if "episode" in meta: meta.setdefault("num", meta["episode"])
    ep = {"meta": {"series": "Shiva Purana", "series_hi": "शिव पुराण", "seriesSub": "Tales of Mahadeva", "seriesSub_hi": "महादेव की कथाएँ", "fps": 24, "captions": True, "lang": "en", **meta},
          "cast": {k: v for k, v in cast.items() if k in used or k == "narrator"},
          "sequence": seq}
    return ep


def hindi(ep):
    """The dub: Hindi text drives the voices, and each character takes their Hindi voice settings."""
    hi = copy.deepcopy(ep); hi["meta"]["lang"] = "hi"
    for k in list(hi["meta"]):
        if k.endswith("_hi"): hi["meta"][k[:-3]] = hi["meta"][k]
    for c in hi["cast"].values():
        for k in [k for k in c if k.endswith("_hi") and k != "label_hi"]: c[k[:-3]] = c.pop(k)
    for seg in hi["sequence"]:
        for ln in seg.get("lines", []):
            if ln.get("text_hi"): ln["text"] = ln["text_hi"]
            if "say_hi" in ln: ln["say"] = ln.pop("say_hi")
            elif "say" in ln: del ln["say"]
    return hi


def main():
    path = sys.argv[1]
    ep = parse(path)
    d = os.path.dirname(os.path.abspath(path))
    out = os.path.join(d, "episode.json")
    en = copy.deepcopy(ep)
    for c in en["cast"].values():
        for k in [k for k in c if k.endswith("_hi") and k != "label_hi"]: del c[k]
    json.dump(en, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    os.makedirs(os.path.join(d, "hi"), exist_ok=True)
    json.dump(hindi(ep), open(os.path.join(d, "hi", "episode.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    words = sum(len(ln.get("text", "").split()) for s in ep["sequence"] for ln in s.get("lines", []))
    beats = sum(ln.get("dur", 0) for s in ep["sequence"] for ln in s.get("lines", []) if not ln.get("text"))
    cards = sum(s.get("dur", 0) for s in ep["sequence"] if s["type"] == "card")
    nlines = sum(1 for s in ep["sequence"] for ln in s.get("lines", []) if ln.get("text"))
    est = words * 0.40 + beats + cards + nlines * 0.5
    print(f"wrote {out}: {len(ep['sequence'])} segments, {nlines} lines, {words} words, beats {beats:.0f}s, cards {cards:.0f}s, est {est / 60:.1f} min", file=sys.stderr)


if __name__ == "__main__":
    main()
