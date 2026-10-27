#!/usr/bin/env python3
"""Turn a plain-text screenplay into episode.json for the anime engine.

Screenplays are where the writing happens; episode.json is generated. Format (one statement per line):

  key: value                       header lines before the first "==" (episode, slug, title, kanji, book, season, gap, logline,
                                   next, quote, quoteBy, category)
  == OP | dur=46                   opening titles; also TITLE, EYECATCH, ED, CARD (time skips: title=..., sub=...)
  == SCENE id | set=laundry_int time=night season=autumn weather=rain music=night amb=washer,rain gap=180 caption=...
  == NEXT | title=... | sub=...    the "next time" card; lines below it are voiced over it
  @ mio slot=benchL prop=book emo=tease      cast placement (before the first line) or a change from the next line on
  @ cat slot=cat_dryer pose=sleep            the laundry cat (slot=none removes him)
  @ item basket benchL dx=-90                bench items (basket, can)
  MIO (tease, look=other, act=lean, itsuki=blush, itsuki.look=down, sfx=can, pause=1) [close:mio]: Spoken line.
  MIO (thought): Inner voice.      also (phone), (memory), (vo)
  BEAT 2.5 [sky] (sfx=meow, mio=smile)        a silent beat
  INSERT book 6 | title=White Nights | text=... | note=... | noteBy=genzo     a silent full-frame cutaway
  +INSERT notebook | text=...      puts the previous line's voice over a cutaway
  // comment
"""
import json, re, sys, os

EMOS = set("worried neutral smile soft grin laugh tease blush flustered shy sad teary cry surprised thinking serious annoyed pout sleepy glint warm".split())
ACTS = set("hide lean laugh sip nod shake wave point chin write rail cover stretch".split())
LOOKS = set("other front cam down book away up left right".split())
FLAGS = {"thought", "phone", "memory", "vo"}
IDS = {"MIO": "mio", "ITSUKI": "itsuki", "HOSHINO": "hoshino", "FUMIKO": "fumiko", "MAN": "salaryman", "GENZO": "genzo", "KAORI": "kaori", "SATOSHI": "satoshi", "YUKA": "yuka"}
CAST = {
    "mio": {"name": "Mio Takanashi", "role": "17, third-year high-school student; inherited her grandfather's Dostoevsky", "voice": "af_heart:0.75+af_sky:0.25", "speed": 1.04},
    "itsuki": {"name": "Itsuki Kanzaki", "role": "28, proofreader at a small printing company; once won a prize for a novella", "voice": "am_michael", "speed": 0.93},
    "hoshino": {"name": "Mrs. Hoshino", "role": "owner of Coin Laundry Hoshizora", "voice": "bf_emma", "speed": 0.9},
    "fumiko": {"name": "Fumiko Kanzaki", "role": "Itsuki's mother", "voice": "af_sarah:0.5+bf_emma:0.5", "speed": 0.86},
    "salaryman": {"name": "A salaryman", "role": "a stranger who has missed the last train", "voice": "am_adam", "speed": 0.98},
    "genzo": {"name": "Genzo Takanashi", "role": "Mio's late grandfather, a translator of Russian literature", "voice": "bm_george", "speed": 0.86},
    "kaori": {"name": "Kaori Ogawa", "role": "Mio's mother", "voice": "af_sarah", "speed": 1.0},
    "satoshi": {"name": "Satoshi Ogawa", "role": "Mio's stepfather", "voice": "am_eric", "speed": 0.98},
    "yuka": {"name": "Yuka", "role": "Mio's classmate", "voice": "af_bella", "speed": 1.08},
}
NUM = re.compile(r"^-?\d+(\.\d+)?$")
val = lambda v: (float(v) if "." in v else int(v)) if NUM.match(v) else (True if v == "true" else False if v == "false" else v)


def kv(s):
    """'|'-separated parts; a part is either several space-separated k=v tokens or one k=v whose value has spaces."""
    out = {}
    for part in [p.strip() for p in s.split("|")]:
        if not part: continue
        toks = part.split()
        if all("=" in t for t in toks):
            for t in toks: k, v = t.split("=", 1); out[k] = val(v)
        elif "=" in part:
            k, v = part.split("=", 1); out[k.strip()] = val(v.strip())
        else:
            out.setdefault("_", []).append(part)
    return out


def parse_paren(s, line):
    for tok in [t.strip() for t in s.split(",") if t.strip()]:
        if "=" in tok:
            k, v = [x.strip() for x in tok.split("=", 1)]
            if "." in k and k.split(".")[0] in CAST:
                cid, prop = k.split(".", 1); line.setdefault("react", {}).setdefault(cid, {})
                if isinstance(line["react"][cid], str): line["react"][cid] = {"emo": line["react"][cid]}
                line["react"][cid][prop] = val(v)
            elif k in CAST:
                r = line.setdefault("react", {})
                if isinstance(r.get(k), dict): r[k]["emo"] = v
                else: r[k] = v
            else: line[k] = val(v)
        elif tok in FLAGS: line[tok] = True
        elif tok in EMOS: line["emo"] = tok
        elif tok in ACTS: line["act"] = tok
        elif tok in LOOKS: line["look"] = tok
        else: raise SystemExit(f"unknown token '{tok}' in: {s}")


def main(path):
    meta, seq = {}, []
    scene = None; pending_cs = {}; pending_cat = None
    used = {"mio", "itsuki"}
    for raw in open(path, encoding="utf8"):
        ln = raw.rstrip("\n")
        s = ln.strip()
        if not s or s.startswith("//"): continue
        if not seq and scene is None and not s.startswith("==") and re.match(r"^[a-zA-Z_]+:", s) and not s.split(":")[0].isupper():
            k, v = s.split(":", 1); meta[k.strip()] = val(v.strip()); continue
        if s.startswith("=="):
            head = s[2:].strip(); kind, _, rest = head.partition("|")
            kind = kind.strip().split(); opts = kv(rest)
            typ = kind[0].upper(); sid = kind[1] if len(kind) > 1 else None
            if typ == "SCENE" or typ == "NEXT":
                scene = {"type": "scene", "id": sid or f"s{len(seq)}", "lines": [], "chars": {}}
                if typ == "NEXT":
                    scene.update({"id": "next", "set": "card", "style": "next", "music": "tease", "nextTitle": opts.pop("title", ""), "nextSub": opts.pop("sub", "")})
                for k, v in opts.items():
                    if k == "amb": v = [a for a in str(v).split(",") if a]
                    if k == "washers": v = [int(x) for x in str(v).split(",") if x != ""]
                    scene[k] = v
                seq.append(scene); pending_cs = {}; pending_cat = None
            else:
                scene = None
                card = {"type": "card", "id": (sid or typ.lower()) + (f"-{len(seq)}" if typ == "CARD" else ""), "style": {"OP": "op", "TITLE": "title", "EYECATCH": "eyecatch", "ED": "ed", "CARD": "text"}[typ]}
                card.update({k: v for k, v in opts.items() if k != "_"})
                seq.append(card)
            continue
        if scene is None: raise SystemExit(f"line outside a scene: {s}")
        if s.startswith("@"):
            body = s[1:].strip(); who, _, rest = body.partition(" ")
            if who == "item":
                parts = rest.split(); it = {"kind": parts[0], "slot": parts[1]}
                for tok in parts[2:]: k, v = tok.split("=", 1); it[k] = val(v)
                if it["kind"] == "can" and "can" not in it: it["can"] = "coffee"
                if scene["lines"]: it["from"] = len(scene["lines"])
                scene.setdefault("items", []).append(it); continue
            opts = {}
            for tok in rest.split():
                k, v = tok.split("=", 1); opts[k] = val(v)
            if who == "cat":
                if not scene["lines"]: scene["cat"] = None if opts.get("slot") == "none" else opts
                else: pending_cat = False if opts.get("slot") == "none" else opts
                continue
            cid = IDS.get(who.upper(), who); used.add(cid)
            if "look" in opts: opts["idleLook"] = opts.pop("look")
            if not scene["lines"]: scene["chars"][cid] = opts
            else: pending_cs.setdefault(cid, {}).update(opts)
            continue
        if s.startswith("+INSERT"):
            parts = [p.strip() for p in s[7:].split("|")]
            ins = {"kind": parts[0]}
            for p in parts[1:]: k, v = p.split("=", 1); ins[k.strip()] = val(v.strip().replace("\\n", "\n"))
            scene["lines"][-1]["insert"] = ins; continue
        line = {}
        if s.startswith("INSERT"):
            parts = [p.strip() for p in s[6:].split("|")]
            k0 = parts[0].split(); ins = {"kind": k0[0]}
            line["dur"] = float(k0[1]) if len(k0) > 1 else 4
            for p in parts[1:]:
                k, v = p.split("=", 1)
                if k.strip() in ("sfx", "pause", "music"): line[k.strip()] = val(v.strip())
                else: ins[k.strip()] = val(v.strip().replace("\\n", "\n"))
            line["insert"] = ins
        elif s.startswith("BEAT"):
            m = re.match(r"BEAT\s*([\d.]+)?\s*(\[[^\]]*\])?\s*(\([^)]*\))?\s*(\[[^\]]*\])?$", s)
            if not m: raise SystemExit(f"bad BEAT: {s}")
            line["dur"] = float(m.group(1) or 2)
            shot = m.group(2) or m.group(4)
            if shot: line["shot"] = shot[1:-1]
            if m.group(3): parse_paren(m.group(3)[1:-1], line)
            if "emo" in line or "act" in line or "look" in line:   # a beat's own emo/act apply via react only
                pass
        else:
            m = re.match(r"^([A-Z]+)\s*(\([^)]*\))?\s*(\[[^\]]*\])?\s*(\([^)]*\))?\s*:\s*(.+)$", s)
            if not m: raise SystemExit(f"cannot parse: {s}")
            who = IDS.get(m.group(1));
            if not who: raise SystemExit(f"unknown speaker {m.group(1)}")
            used.add(who); line["who"] = who
            for g in (m.group(2), m.group(4)):
                if g: parse_paren(g[1:-1], line)
            if m.group(3): line["shot"] = m.group(3)[1:-1]
            line["text"] = m.group(5).strip()
        if pending_cs: line["cs"] = pending_cs; pending_cs = {}
        if pending_cat is not None: line["cat"] = pending_cat or None; pending_cat = None
        scene["lines"].append(line)

    n = int(meta.get("episode", 1))
    ep_meta = {
        "show": "Dostoevsky at the Coin Laundry", "episode": f"E{n}", "title": meta.get("title", ""), "book": meta.get("book", ""),
        "rating": "general", "format": "anime", "category": "Dostoevsky at the Coin Laundry (anime series)",
        "logline": meta.get("logline", ""), "season": meta.get("season", "autumn"), "gap_bench": meta.get("gap", 200), "fps": 24, "gap": meta.get("linegap", 0.62),
        "source": f"Original story. Discusses {meta.get('book', 'the works of Fyodor Dostoevsky')}; Dostoevsky passages are our own renderings of the public-domain texts.",
        "disclaimer": "Original characters, designs and music. Not affiliated with any studio.",
        "content_note": meta.get("content_note"), "musicLevel": meta.get("musicLevel", 0.55),
    }
    credits = ["#Dostoevsky at the Coin Laundry", f"Episode {n}: {meta.get('title', '')}", "", "#Story and script", "Claude (Anthropic)", "from an idea by jasch", "",
               "#Cast", "Mio Takanashi", "Itsuki Kanzaki"] + [CAST[c]["name"] for c in sorted(used - {"mio", "itsuki"})] + ["Fyodor, the laundry cat", "",
               "#Voices", "Kokoro open-weight speech", "", "#Music", "an original piano and strings score", "", "#Backgrounds and animation", "painted and drawn in code", "",
               "#After", meta.get("book", "Fyodor Dostoevsky"), "passages in our own renderings", "of the public-domain texts", "", "#Coin Laundry Hoshizora", "open 24 hours"]
    defaults = {"op": {"dur": 52}, "title": {"dur": 6.5, "kanji": meta.get("kanji", ""), "kicker": f"EPISODE {n}", "title": meta.get("title", ""), "sub": meta.get("sub", "")},
                "eyecatch": {"dur": 5}, "ed": {"dur": 50, "credits": credits, "quote": meta.get("quote"), "quoteBy": meta.get("quoteBy")}}
    for seg in seq:
        if seg["type"] == "card":
            for k, v in defaults.get(seg["style"], {}).items(): seg.setdefault(k, v)
            seg.setdefault("season", ep_meta["season"])
        else:
            seg.setdefault("season", ep_meta["season"])
            seg.setdefault("set", "laundry_int")
    ep = {"meta": ep_meta, "cast": {c: CAST[c] for c in sorted(used)}, "sequence": seq}
    out = os.path.join(os.path.dirname(os.path.abspath(path)), "episode.json")
    json.dump(ep, open(out, "w"), indent=1, ensure_ascii=False)
    words = sum(len(l.get("text", "").split()) for s in seq if s["type"] == "scene" for l in s["lines"])
    beats = sum(l.get("dur", 0) for s in seq if s["type"] == "scene" for l in s["lines"] if not l.get("text"))
    print(f"wrote {out}: {len(seq)} segments, {words} spoken words, {beats:.0f}s of silent beats", file=sys.stderr)


if __name__ == "__main__":
    main(sys.argv[1])
