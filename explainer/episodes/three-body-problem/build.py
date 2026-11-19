#!/usr/bin/env python3
"""Writes episode.json for the LUMEN explainer "The Dark Forest: the philosophy of Liu Cixin's Three-Body trilogy".
Paper collage look with the diagram kit in engine/vox.js (tables, philosophy maps, trait bars, star fields, orbit
trails) and real public-domain or openly licensed archival images (NASA, Wikimedia Commons). No film or TV stills.
Quotations from the novels are short, attributed and checked against the uploaded English editions; the rest is
paraphrase. See bible.md for the quote ledger. Usage: python3 explainer/episodes/three-body-problem/build.py"""
import json, math, os

RED, YEL, INK, CREAM, BLUE, PAPER = "#d23a2e", "#ffd23f", "#1d1b19", "#f4ecdc", "#2443c9", "#fbf7ee"

# Invented procedural faces for the fictional characters (not likenesses of any actor).
FACE = {
    "ye": {"hair": "scarf", "hairC": "dark", "scarfC": "#5d6a4a", "female": 1, "brow": -0.3, "eyes": "down", "coat": "#4a5340", "tie": "collar", "face": 0.94, "gaunt": 1, "mouth": -0.3},
    "yeold": {"hair": "curls", "hairC": "grey", "female": 1, "brow": 0.1, "eyes": "down", "coat": "#5a5650", "tie": "collar", "face": 0.96, "mouth": 0},
    "luoji": {"hair": "parted", "hairC": "dark", "beard": "none", "brow": -0.1, "eyes": "calm", "coat": "#2a2c33", "tie": "collar", "face": 1.0, "mouth": 0.1},
    "luojiold": {"hair": "parted", "hairC": "white", "beard": "short", "beardC": "white", "brow": -0.4, "eyes": "deep", "coat": "#2a2c33", "tie": "collar", "face": 1.0, "gaunt": 1, "mouth": -0.2},
    "wade": {"hair": "short", "hairC": "dark", "beard": "none", "brow": -0.7, "eyes": "narrow", "coat": "#1f2024", "tie": "collar", "face": 1.02, "long": 1.06, "mouth": -0.3, "smirk": 1},
    "chengxin": {"hair": "curls", "hairC": "dark", "female": 1, "brow": 0.5, "eyes": "soft", "coat": "#e6e0d2", "tie": "none", "face": 0.9, "young": 1, "mouth": 0.2},
    "beihai": {"hair": "brush", "hairC": "dark", "beard": "none", "brow": -0.3, "eyes": "calm", "coat": "#2d3b4f", "tie": "uniform", "face": 1.0, "mouth": -0.1},
    "student": {},
}
COL = {"ye": "#b8c9a0", "yeold": "#c9b893", "luoji": "#9fb0c8", "luojiold": "#9fb0c8", "wade": "#c47a6a", "chengxin": "#f0d6c8", "beihai": "#a9b4c8", "student": "#b5b09a"}
PRESET = {}


def cut(id, who, x, y, name=None, role=None, i=0, d=0.3, out=None, w=240, h=290, rot=0, **kw):
    base = PRESET.get(who, who)
    e = {"id": id, "type": "cut", "who": base if base in ("pyotr", "shigalyov", "dostoevsky", "tikhon", "student") else "student",
         "x": x, "y": y, "w": w, "h": h, "rot": rot, "color": kw.pop("color", COL.get(who, COL.get(base, "#c9b893"))),
         "in": i, "d": d, "anim": kw.pop("anim", "drop"), "sfx": kw.pop("sfx", "paper"), "vol": 0.7, **kw}
    if FACE.get(who): e["face"] = FACE[who]
    if name: e["name"] = name
    if role: e["role"] = role
    if out is not None: e["out"] = out
    return e


def hl(id, text, x, y, size=30, i=0, d=0.3, out=None, card=True, **kw):
    e = {"id": id, "type": "hl", "x": x, "y": y, "text": text, "size": size, "card": card, "in": i, "d": d, "anim": kw.pop("anim", "rise"), **kw}
    if out is not None: e["out"] = out
    return e


def quote(id, text, x, y, by, size=34, i=0, d=0.4, out=None, dark=False, **kw):
    """A verbatim quotation in serif italics with highlighted phrases and a source line."""
    return hl(id, text, x, y, size=size, i=i, d=d, out=out, card=kw.pop("card", False if dark else PAPER), font="serif", italic=True, weight=700,
              color=CREAM if dark else INK, hcolor=kw.pop("hcolor", "#b8302a" if dark else YEL), by=by, byColor="#c9bca6" if dark else "#6b6255", **kw)


def head(id, text, x, y, size=56, i=0, d=0.3, out=None, bg=INK, color=CREAM, **kw):
    e = {"id": id, "type": "headline", "x": x, "y": y, "text": text, "size": size, "bg": bg, "color": color, "in": i, "d": d, "anim": kw.pop("anim", "pop"), "sfx": kw.pop("sfx", "thump"), "vol": 0.3, **kw}
    if out is not None: e["out"] = out
    return e


def scr(id, kind, x, y, w=200, h=80, i=0, d=0.8, out=None, **kw):
    e = {"id": id, "type": "scrib", "kind": kind, "x": x, "y": y, "w": w, "h": h, "in": i, "d": d, "anim": "none", "sfx": "marker", "vol": 0.8, **kw}
    if out is not None: e["out"] = out
    return e


def el(id, type, x, y, i=0, d=0.3, out=None, **kw):
    e = {"id": id, "type": type, "x": x, "y": y, "in": i, "d": d, **kw}
    if out is not None: e["out"] = out
    return e


def cite(text, i=0, d=0.8):
    return {"id": "src" + str(i), "type": "cite", "x": 0, "y": 0, "text": text, "in": i, "d": d, "anim": "none"}


def scene(id, pal, els, lines, dash=False, zoom=(1.0, 1.05), pan=((0, 0), (16, -6)), punch=None, **bg):
    cam = {"zoom": list(zoom), "pan": [list(pan[0]), list(pan[1])]}
    if punch:   # keep punch-ins gentle so nothing important leaves the frame
        cam["punch"] = {str(k): [round(1 + (v[0] - 1) * 0.6, 3), round(v[1] * 0.45), round(v[2] * 0.45), *v[3:]] for k, v in punch.items()}
    return {"type": "scene", "id": id, "bg": {"kind": "paperc", "pal": pal, "grid": False, "dash": dash, **bg},
            "cam": cam, "els": [e for e in els if e], "lines": lines}


def chapter(n, kicker, title, sub, who, color=RED, photo=None, pw=180, ph_=230):
    base = PRESET.get(who, who)
    c = {"type": "card", "id": f"ch{n}", "style": "cchapter", "num": n, "kicker": kicker, "title": title, "sub": sub,
         "who": base if base in ("pyotr", "shigalyov", "dostoevsky", "tikhon") else "student", "whoColor": COL.get(who), "color": color, "dur": 3.6, "sfx": "chime", "whoFace": FACE.get(who)}
    m = MAN.get(photo) if photo else None
    if m:
        USED.append(photo)
        c["photo"] = {"mode": m["mode"], "src": m["src"], "iw": m["w"], "ih": m["h"], "w": pw, "h": ph_ if m["mode"] != "cut" else round(pw * m["h"] / m["w"]), "kb": 0.08}
    return c


def L(text, who=None, **kw):
    d = {"text": text, **kw}
    if who: d["who"] = who
    return d


def beat(dur=1.4, sfx="whoosh"):
    return {"text": "", "dur": dur, "sfx": sfx}


HERE = os.path.dirname(os.path.abspath(__file__))
MAN = json.load(open(os.path.join(HERE, "assets", "manifest.json")))
USED = []


def ph(id, key, x, y, w=None, h=None, i=0, d=0.3, out=None, **kw):
    """A real archival image: a background-removed cut-out (sticker edge) or a torn print. Returns None if missing."""
    m = MAN.get(key)
    alt = kw.pop("alt", [])
    if not m:
        for k2, over in alt:   # fall back to another real image, with its own caption
            if k2 in MAN:
                print("  (missing image, using", k2, "for", key + ")")
                kw2 = {**kw, **over}
                w2, h2, i2, d2, o2 = kw2.pop("w", w), kw2.pop("h", h), kw2.pop("i", i), kw2.pop("d", d), kw2.pop("out", out)
                return ph(id, k2, x, y, w2, h2, i=i2, d=d2, out=o2, **kw2)
            if k2 == "cut":
                return over
        print("  (missing image, skipped)", key); return None
    USED.append(key)
    e = {"id": id, "type": "photo", "mode": m["mode"], "src": m["src"], "x": x, "y": y, "in": i, "d": d,
         "anim": kw.pop("anim", "drop" if m["mode"] == "cut" else "pop"), "sfx": kw.pop("sfx", "paper" if m["mode"] == "cut" else "shutter"), "vol": 0.55}
    if m["mode"] == "cut":
        w = w or 300; e.update(w=w, h=round(w * m["h"] / m["w"]))
    else:
        e.update(w=w or 320, h=h or 400, iw=m["w"], ih=m["h"])
    if out is not None: e["out"] = out
    e.update(kw)
    return e


def full(id, key, i=0, d=0, out=None, dim=0.45, **kw):
    """A full-bleed archival plate behind the scene, slowly pushing in."""
    m = MAN.get(key)
    alt = kw.pop("alt", [])
    if not m:
        for k2, over in alt:   # fall back to another real image, with its own caption
            if k2 in MAN:
                print("  (missing image, using", k2, "for", key + ")")
                kw2 = {**kw, **over}
                w2, h2, i2, d2, o2 = kw2.pop("w", w), kw2.pop("h", h), kw2.pop("i", i), kw2.pop("d", d), kw2.pop("out", out)
                return ph(id, k2, x, y, w2, h2, i=i2, d=d2, out=o2, **kw2)
            if k2 == "cut":
                return over
        print("  (missing image, skipped)", key); return None
    USED.append(key)
    e = {"id": id, "type": "photo", "mode": "full", "src": m["src"], "iw": m["w"], "ih": m["h"], "x": 640, "y": 360, "in": i, "d": d,
         "dim": dim, "kb": kw.pop("kb", 0.1), "anim": kw.pop("anim", "fade"), "sfx": kw.pop("sfx", "whoosh"), "vol": 0.35, **kw}
    if out is not None: e["out"] = out
    return e


def fx(id, name, i, d=0.0, vol=0.5):
    """A sound-only cue (no drawing) on a line."""
    return {"id": id, "type": "sfx", "x": 0, "y": 0, "in": i, "d": d, "sfx": name, "vol": vol, "anim": "none"}


def note(id, text, x, y, i=0, d=0.3, out=None, **kw):
    """A handwritten note on lined paper, written out line by line."""
    e = {"id": id, "type": "note", "x": x, "y": y, "text": text, "in": i, "d": d, "anim": kw.pop("anim", "rise"), "sfx": kw.pop("sfx", "marker"), "vol": 0.7, **kw}
    if out is not None: e["out"] = out
    return e


def tag(id, text, x, y, i=0, d=0.5, out=None, rot=-2, size=17, **kw):
    """A small typed caption strip naming an archival image."""
    return hl(id, text, x, y, size=size, i=i, d=d, out=out, card="#f6f1e6", rot=rot, weight=650, anim="fade", **kw)



seq = []
TBP = "The Three-Body Problem (2006), trans. Ken Liu (Tor, 2014)"
DF = "The Dark Forest (2008), trans. Joel Martinsen (Tor, 2015)"
DE = "Death's End (2010), trans. Ken Liu (Tor, 2016)"


def orbits(n=900, dt=0.004, scale=150):
    """A chaotic three-body dance (softened Newtonian gravity), returned as three trails in canvas units."""
    p = [[-1.0, 0.0], [1.0, 0.0], [0.0, 0.3]]
    v = [[0.35, 0.52], [0.35, 0.52], [-0.7, -1.04]]
    m = [1.0, 1.0, 1.0]
    out = [[], [], []]
    for step in range(n * 8):
        a = [[0.0, 0.0] for _ in range(3)]
        for i in range(3):
            for j in range(3):
                if i == j: continue
                dx, dy = p[j][0] - p[i][0], p[j][1] - p[i][1]
                r3 = (dx * dx + dy * dy + 0.02) ** 1.5
                a[i][0] += m[j] * dx / r3; a[i][1] += m[j] * dy / r3
        for i in range(3):
            v[i][0] += a[i][0] * dt; v[i][1] += a[i][1] * dt
            p[i][0] += v[i][0] * dt; p[i][1] += v[i][1] * dt
        if step % 8 == 0:
            cx = sum(q[0] for q in p) / 3; cy = sum(q[1] for q in p) / 3
            for i in range(3): out[i].append([round((p[i][0] - cx) * scale, 1), round((p[i][1] - cy) * scale, 1)])
    lim = 300
    return [[[max(-lim * 1.6, min(lim * 1.6, x)), max(-lim, min(lim, y))] for x, y in tr] for tr in out]


ORB = orbits()

# =============================== cold open ===============================
seq.append(scene("open-arecibo", "night", [
    full("ar", "arecibo", i=0, dim=0.35, kb=0.12, fy=0.5),
    tag("art", "Arecibo Observatory, Puerto Rico", 240, 660, i=0, d=0.8, out=2),
    head("dt", "16 NOV 1974", 300, 140, size=46, i=0, d=0.6, bg=YEL, color=INK),
    ph("msg", "arecibo_msg", 1010, 360, 260, 440, i=1, d=0.2, rot=3, paper="#111", tape=True, name="The Arecibo message", role="1,679 bits, aimed at star cluster M13", nameY=230, fx=0.5, fy=0.5, kb=0.02),
    hl("bits", "our numbers · our DNA · [[a human figure]]\n· a map of [[where we live]]", 420, 380, size=28, i=1, d=0.6, card=PAPER, rot=-2, out=2),
    head("q", "NOBODY ASKED IF THIS\nWAS A GOOD IDEA", 420, 380, size=40, i=2, d=0.3, bg=RED, color=CREAM),
    cite("Arecibo message, transmitted 16 November 1974 (Cornell University / NAIC)"),
], [
    L("On the sixteenth of November, 1974, the giant radio telescope at Arecibo in Puerto Rico pointed at a star cluster twenty-five thousand light-years away, and shouted."),
    L("Three minutes of radio pulses: our numbers, our DNA, a little stick figure of a human being, and a map of where we live."),
    L("Nobody really asked whether that was a good idea. Liu Cixin's Three-Body trilogy spends three whole novels asking it."),
], dash=False, punch={1: [1.08, -220, 0], 2: [1.04, -150, 0]}))

seq.append(scene("open-question", "inknight", [
    full("hd", "hudf", i=0, dim=0.3, kb=0.14),
    tag("hdt", "Hubble Ultra Deep Field: nearly 10,000 galaxies in one tiny patch of sky", 640, 660, i=0, d=0.8, out=1),
    head("w", "SO WHERE IS EVERYBODY?", 640, 330, size=60, i=0, d=2.6, bg=YEL, color=INK, out=1),
    el("st", "stars", 640, 360, i=1, n=220, w=1300, h=740, anim="fade", sfx=None, dark=0, keys={"1": {"dark": 0.0}, "2": {"dark": 1, "d": 1.2, "t": 1.6}}),
    head("h1", "THEY'RE HIDING.", 640, 300, size=64, i=1, d=2.2, bg=None, color=CREAM, out=2),
    head("h2", "THE ONES WHO DON'T HIDE, DIE.", 640, 400, size=40, i=1, d=4.6, bg=RED, color=CREAM, out=2),
    head("m", "WHAT HAPPENS TO MORALITY\nWHEN SURVIVAL IS AT STAKE?", 640, 340, size=46, i=2, d=0.4, bg=PAPER, color=INK),
    {"id": "six", "type": "stampc", "x": 640, "y": 560, "text": "6 BIG IDEAS + THE CASE AGAINST", "size": 30, "rot": -3, "in": 3, "d": 0.6, "anim": "none", "sfx": "thump", "vol": 0.6},
    cite("Fermi's question, 1950; NASA/ESA Hubble Ultra Deep Field (2004)"),
], [
    L("Here's the puzzle. The universe is old and enormous, with billions of planets where life could start. So where is everybody? Why is the sky so quiet?"),
    L("Liu's answer is the most frightening idea in modern science fiction. The sky is quiet because everyone out there is hiding. And the ones who don't hide, die."),
    L("But the trilogy isn't really about aliens. It's about a very old question: what happens to morality when survival is on the line?"),
    L("Six big ideas, and then the case against them. Let's go."),
], punch={0: [1.06, 0, 0], 2: [1.05, 0, -40]}))

seq.append({"type": "card", "id": "title", "style": "ctitle", "kicker": "A LUMEN explainer", "title": "THE DARK\nFOREST", "size": 104,
            "sub": "The philosophy of Liu Cixin's Three-Body trilogy", "by": "The Three-Body Problem · The Dark Forest · Death's End", "dur": 5.5, "sfx": "swell"})

# =============================== part 1: the woman who answered ===============================
seq.append(chapter(1, "Idea one", "The woman\nwho answered", "Beijing, 1967. The Three-Body Problem.", "ye", color="#8a3a2e", photo="carson", pw=200, ph_=250))

seq.append(scene("p1-struggle", "news", [
    ph("l67", "liu1967", 360, 300, 520, 360, i=0, d=0.2, rot=-2, name="A mass struggle meeting", role="Beijing, July 1967 (real photograph)", nameY=180),
    (head("bj", "BEIJING, 1967", 360, 300, size=60, i=0, d=0.2, bg=RED, color=CREAM, out=2) if "liu1967" not in MAN else None),
    hl("cr", "THE CULTURAL REVOLUTION\n1966-1976", 950, 160, size=30, card=YEL, weight=800, rot=2, out=2),
    el("tl", "ptl", 640, 590, s=1.0, w=1000, shown=0, anim="fade", events=[{"year": "1966", "text": "Red Guards mobilised"}, {"year": "1967", "text": "struggle sessions everywhere"}, {"year": "1968", "text": "youth sent to the countryside"}],
       keys={"0": {"shown": 3, "d": 0.6, "t": 2.4}}, out=1),
    cut("zt", "yeold", 960, 410, name="Ye Zhetai", role="fictional physicist", i=1, d=0.3, w=230, h=280, face={**FACE["luojiold"], "hairC": "grey", "beard": "none"}, color="#c9b893"),
    note("n", "His crime: teaching\nrelativity and the Big Bang.", 960, 170, i=1, d=1.4, w=470, size=28, rot=2),
    ph("s67", "shanghai1967", 330, 330, 440, 300, i=2, d=0.2, rot=3, name="Shanghai, November 1967", role="real photograph", nameY=150),
    cut("yw", "ye", 640, 470, name="Ye Wenjie", role="his daughter, watching", i=2, d=1.6, w=240, h=290),
    cite(TBP + ", chapter 1 (paraphrased)", i=0),
], [
    L("The story doesn't begin in space. It begins in Beijing in 1967, in the middle of the Cultural Revolution."),
    L("A physics professor, Ye Zhetai, is dragged onto a stage at a mass struggle session. His crime is teaching relativity and the Big Bang, ideas the Red Guards call reactionary."),
    L("He refuses to recant, and he is beaten to death in front of the crowd. His daughter, Ye Wenjie, is in the audience."),
], dash=True, punch={1: [1.08, 220, -60], 2: [1.06, 0, 80]}))

seq.append(scene("p1-forest", "sage", [
    full("kh", "khingan", i=0, dim=0.35, kb=0.12, out=1),
    cut("yw2", "ye", 260, 420, name="Ye Wenjie", role="exiled to a logging unit", i=0, d=0.8, w=240, h=290, out=1),
    ph("rc", "carson", 250, 330, 280, 360, i=1, d=0.2, rot=-3, name="Rachel Carson", role="Silent Spring, 1962", nameY=180),
    hl("ss", "Humans poison the world\nwhile believing they're [[improving it]].", 800, 170, size=28, i=1, d=1.2, card=PAPER, rot=1, out=2),
    el("mp", "vmap", 0, 0, i=2, d=0.2, size=24, draw=0, keys={"2": {"draw": 1, "d": 0.2, "t": 4.0}},
       nodes=[{"id": "a", "x": 640, "y": 160, "text": "human cruelty"}, {"id": "b", "x": 960, "y": 300, "text": "humans can't see\ntheir own evil"},
              {"id": "c", "x": 700, "y": 460, "text": "they will never\nfix themselves"}, {"id": "d", "x": 1010, "y": 600, "text": "SAVE THEM FROM OUTSIDE", "color": RED, "fg": CREAM, "shape": "box", "size": 26}],
       edges=[["a", "b"], ["b", "c"], ["c", "d"]]),
    cite(TBP + ", Part I (paraphrased); Rachel Carson, Silent Spring (1962)"),
], [
    L("Exiled to a logging unit in the forests of Inner Mongolia, she watches whole hillsides cut down. Then someone lends her a book that was hard to get in China: Rachel Carson's Silent Spring."),
    L("Carson showed how people poisoned nature while believing they were improving it. For Ye, it confirms something terrible."),
    L("If humanity can't even see its own evil, she decides, it will never correct itself. It has to be saved from outside."),
], punch={1: [1.06, -160, 0], 2: [1.05, 120, 40]}))

seq.append(scene("p1-answer", "inknight", [
    ph("pk", "greenbank", 330, 300, 500, 340, i=0, d=0.2, rot=-2, name="A big radio dish", role="Green Bank, USA (illustrative, not the book's base)", nameY=170, roleSize=14, out=2),
    el("st", "stars", 640, 360, n=160, w=1300, h=740, anim="fade", sfx=None, lit=[{"i": 7, "x": 1000, "y": 200, "color": YEL, "label": "4 light-years away", "ly": -36}]),
    note("w", "DO NOT ANSWER!\nDO NOT ANSWER!!\nDO NOT ANSWER!!!", 900, 420, i=1, d=0.3, w=460, size=34, color=RED, rot=2, out=2),
    cut("yw3", "ye", 320, 430, name="Ye Wenjie", role="Red Coast Base", i=2, d=0.2, w=250, h=300),
    hl("rep", "‘Come here.\nOur civilization can no longer\nsolve its own problems.’", 860, 380, size=32, i=2, d=0.8, card=PAPER, font="serif", italic=True, weight=700, rot=-1, out=3),
    head("b", "NOT A VILLAIN.\nA WOUNDED IDEALIST.", 860, 360, size=44, i=3, d=0.4, bg=YEL, color=INK),
    cite(TBP + ", Part II (paraphrased)"),
], [
    L("Recruited to a secret military radio base called Red Coast, she finds a way to use the Sun to amplify a signal. Years later, an answer comes back."),
    L("It's a warning from a lone pacifist on an alien world four light-years away. Do not answer. If you answer, we will come, and your world will be conquered."),
    L("Ye Wenjie answers anyway. Come here, she replies. Our civilization can no longer solve its own problems."),
    L("That's the first philosophical bomb in the trilogy. Not an evil scientist, but a person so wounded by human cruelty that she gives up on humanity itself."),
], dash=True, punch={1: [1.1, 260, 60], 3: [1.04, 220, 0]}))

# =============================== part 2: cosmic sociology ===============================
seq.append(chapter(2, "Idea two", "Cosmic\nsociology", "The Dark Forest, 2008", "yeold", color=BLUE, photo="alphacen", pw=240, ph_=200))

seq.append(scene("p2-axioms", "cream", [
    cut("yo", "yeold", 230, 420, name="Ye Wenjie", role="decades later", i=0, d=0.2, w=230, h=280),
    cut("lj", "luoji", 1060, 420, name="Luo Ji", role="a lazy young sociologist", i=0, d=1.6, w=230, h=280),
    head("cs", "COSMIC SOCIOLOGY", 640, 120, size=48, i=0, d=3.2, bg=INK, color=CREAM),
    quote("ax", "First: [[Survival is the primary need of civilization.]]\nSecond: Civilization continuously grows and expands,\nbut [[the total matter in the universe remains constant.]]", 640, 340, "Ye Wenjie to Luo Ji, The Dark Forest", size=26, i=1, d=0.3),
    hl("eco", "Sounds like economics.\nAdd two ideas and it becomes [[deadly]].", 640, 590, size=28, i=2, d=0.4, card=YEL, rot=-1),
    cite(DF + ", Prologue"),
], [
    L("In the second book, Ye Wenjie, now an old woman, gives a young sociologist named Luo Ji a strange assignment: found a brand-new science. Cosmic sociology."),
    L("She gives him just two axioms. First: survival is the primary need of civilization. Second: civilization continuously grows and expands, but the total matter in the universe remains constant."),
    L("That's it. Two lines that sound almost like an economics textbook. Then she adds two concepts that make them deadly."),
], dash=True, punch={1: [1.08, 0, 30], 2: [1.04, 0, 200]}))

seq.append(scene("p2-suspicion", "inknight", [
    el("st", "stars", 640, 360, n=150, w=1300, h=740, anim="fade", sfx=None, lit=[{"i": 3, "x": 260, "y": 330, "color": YEL, "label": "US", "ly": -40, "size": 26}, {"i": 5, "x": 1020, "y": 330, "color": "#7fc8ff", "label": "THEM", "ly": -40, "size": 26}]),
    el("ar", "vmap", 0, 0, i=0, d=0.6, size=22, draw=0, keys={"0": {"draw": 1, "d": 0.6, "t": 2.4}},
       nodes=[{"id": "a", "x": 450, "y": 330, "text": "message", "color": PAPER}, {"id": "b", "x": 830, "y": 330, "text": "centuries later", "color": PAPER}],
       edges=[["a", "b", "light-years", 0.0, YEL]], lcolor=YEL),
    head("cs1", "1. THE CHAIN OF SUSPICION", 640, 120, size=40, i=0, d=0.2, bg=YEL, color=INK),
    quote("q", "They don't know what we're thinking\nabout what they're thinking\nabout what we're thinking...", 640, 560, "Luo Ji, The Dark Forest", size=28, i=1, d=0.2, dark=True, out=2),
    head("cs2", "2. THE TECHNOLOGICAL EXPLOSION", 640, 120, size=40, i=2, d=0.2, bg=RED, color=CREAM),
    el("bars", "vbars", 640, 540, i=2, d=0.6, size=22, w=420, shown=0, labelColor=CREAM, noteColor=YEL, track="rgba(255,255,255,0.15)",
       items=[{"label": "steam engine", "v": 0.12, "color": "#c9b893", "note": "1780s"}, {"label": "radio", "v": 0.45, "color": "#c9b893", "note": "1890s"}, {"label": "spaceflight", "v": 0.95, "color": RED, "note": "1957"}],
       keys={"2": {"shown": 3, "d": 1.0, "t": 2.4}}),
    cite(DF + ", Part III"),
], [
    L("The first is the chain of suspicion. Two civilizations light-years apart can't talk the way neighbours do. Messages take centuries, and they share no biology, no culture, nothing."),
    L("So even if you're friendly, I can't know that you know I'm friendly. As Luo Ji puts it: they don't know what we're thinking about what they're thinking about what we're thinking."),
    L("The second is the technological explosion. Humans went from steam engines to spaceflight in under two hundred years. A civilization that looks primitive today could overtake you before your fleet arrives."),
], punch={1: [1.06, 0, 120], 2: [1.04, 0, 80]}))

seq.append(scene("p2-forest", "night", [
    full("fo", "forest", i=0, dim=0.55, kb=0.16),
    quote("q", "The universe is a [[dark forest]].\nEvery civilization is an [[armed hunter]]\nstalking through the trees like a ghost.", 640, 230, "Luo Ji, The Dark Forest", size=34, i=0, d=0.8, dark=True, out=2),
    el("st", "stars", 640, 380, n=60, w=1200, h=520, anim="fade", sfx=None, i=1, flash=11, flashT=0, keys={"3": {"flashT": 1, "d": 0.6, "t": 1.6}},
       lit=[{"i": 2, "x": 300, "y": 470, "color": YEL, "r": 4}, {"i": 4, "x": 980, "y": 430, "color": YEL, "r": 4}]),
    el("mp", "vmap", 0, 0, i=1, d=0.2, size=24, draw=0, keys={"1": {"draw": 1, "d": 0.2, "t": 3.5}},
       nodes=[{"id": "a", "x": 300, "y": 560, "text": "can't trust them", "color": PAPER}, {"id": "b", "x": 640, "y": 470, "text": "can't wait for them", "color": PAPER}, {"id": "c", "x": 980, "y": 560, "text": "SHOOT FIRST", "color": RED, "fg": CREAM, "shape": "box", "size": 28}],
       edges=[["a", "b"], ["b", "c"]], out=3),
    head("fire", "NEVER LIGHT A FIRE\nAND SHOUT ‘HERE I AM’", 640, 300, size=44, i=3, d=0.3, bg=YEL, color=INK),
    cite(DF + ", Part III"),
], [
    L("Put those together, and Luo Ji finally understands the silent sky."),
    L("The universe is a dark forest. Every civilization is an armed hunter, stalking through the trees like a ghost. If a hunter finds another life, there's only one safe move: shoot first."),
    L("Not out of hatred. Out of arithmetic. You can't trust them, and you can't afford to wait for them to grow."),
    L("And the one fatal mistake is to light a fire and shout, here I am. Which is exactly what Ye Wenjie did, and exactly what Arecibo did."),
], punch={1: [1.08, 0, -90], 2: [1.04, 0, 100], 3: [1.06, 0, 0]}))

seq.append(scene("p2-real", "cream", [
    ph("sh", "hawking", 260, 320, 300, 380, i=0, d=0.2, rot=-3, name="Stephen Hawking", role="2010: aliens might treat us as Columbus treated the Americas", nameY=190, roleSize=14),
    ph("co", "columbus", 820, 290, 520, 330, i=0, d=2.2, rot=2, name="Landing of Columbus", role="John Vanderlyn, 1847", nameY=165),
    ph("pp", "pioneer", 800, 300, 460, 300, i=1, d=0.4, rot=-2, name="Pioneer plaque, 1972", role="a picture of us and a map home", nameY=150),
    ph("gr", "golden", 1080, 470, 240, 240, i=1, d=1.6, rot=5, name="Voyager Golden Record", role="1977", nameY=120),
    note("lp", "Liu's postscript: people who conquered\neach other on Earth turn sentimental\nwhen they look up at the stars.", 640, 600, i=2, d=0.2, w=700, size=26, rot=-1),
    cite("Stephen Hawking, Into the Universe (Discovery, 2010); Liu Cixin, author's postscript to The Three-Body Problem (Tor, 2014), paraphrased", i=0),
], [
    L("This isn't only fiction. In 2010, Stephen Hawking warned that meeting a more advanced civilization might go for us the way Columbus's arrival went for the people of the Americas."),
    L("Scientists still argue about whether we should send messages at all. Meanwhile Pioneer's plaque and Voyager's golden record are already out there, carrying our picture and directions home."),
    L("Liu put his own view bluntly in a postscript: people who conquered each other on Earth turn strangely sentimental when they look up at the stars."),
], dash=True, punch={0: [1.06, -380, 0], 1: [1.05, 160, 0], 2: [1.06, 0, 240]}))

# =============================== part 3: the war inside your head ===============================
seq.append(chapter(3, "Idea three", "The war inside\nyour head", "The Wallfacers, The Dark Forest", "luoji", color="#3d6b6a", photo="sun", pw=220, ph_=220))

seq.append(scene("p3-sophon", "slate", [
    el("orb", "trails", 640, 330, i=0, d=0.2, paths=ORB, draw=0, tail=160, hr=12, sw=3, anim="fade", sfx="whoosh", keys={"0": {"draw": 1, "d": 0.2, "t": 9.0}}, out=1),
    hl("tri", "TRISOLARIS: three suns, chaotic seasons.\nThey think in the open. [[Lying is alien to them.]]", 640, 630, size=24, card=PAPER, rot=-1, out=1),
    el("eye", "vmap", 0, 0, i=1, d=0.2, size=24, draw=0, keys={"1": {"draw": 1, "d": 0.2, "t": 3.5}},
       nodes=[{"id": "a", "x": 330, "y": 200, "text": "SOPHONS", "color": RED, "fg": CREAM, "shape": "box", "size": 30}, {"id": "b", "x": 870, "y": 170, "text": "every room"},
              {"id": "c", "x": 960, "y": 330, "text": "every document"}, {"id": "d", "x": 860, "y": 490, "text": "our physics, jammed"}, {"id": "e", "x": 380, "y": 520, "text": "a human mind", "color": YEL}],
       edges=[["a", "b"], ["a", "c"], ["a", "d"], ["a", "e", "can't see in", 0.1, "#7fc8ff", True]], lcolor="#cfe6ff", out=2),
    el("tb", "vtable", 640, 380, i=2, d=0.2, w=1000, size=22, shown=0, title="THE FOUR WALLFACERS", titleSize=26, titleColor=CREAM, cols=["Wallfacer", "Secret plan", "Result"], colW=[240, 520, 240],
       rows=[["Frederick Tyler", "a swarm of tiny suicide ships", "exposed"], ["Manuel Rey Diaz", "bombs to knock Mercury into the Sun", "exposed"], ["Bill Hines", "a machine that stamps belief into brains", "exposed"], ["Luo Ji", "a ‘spell’ cast on a distant star", "it works"]],
       keys={"2": {"shown": 4, "d": 2.5, "t": 4.0}}, hi=3, hiDraw=0, anim="rise", sfx="paper"),
    cite(DF + ", Part I"),
], [
    L("Now the aliens. The Trisolarans live with three suns and chaotic seasons, and they think in the open: their thoughts are visible to each other. Deception is almost unknown to them."),
    L("They send sophons to Earth: protons unfolded into supercomputers, which watch every room, read every document, and jam our physics so we can't catch up. The only place a sophon can't see is inside a human mind."),
    L("So the United Nations does something absurd and brilliant. It picks four people, the Wallfacers, gives them enormous resources, and allows them to lie to everyone. Their real plans exist only in their heads."),
], punch={1: [1.05, 120, 40], 2: [1.03, 0, 30]}))

seq.append(scene("p3-belief", "cream", [
    note("ms", "THE MENTAL SEAL:\none conviction, stamped\ninto the brain for life.", 330, 220, i=0, d=0.2, w=520, size=28, rot=-2, out=1),
    el("bars", "vbars", 360, 500, i=0, d=1.0, size=22, w=300, shown=0, title="ENLISTED IN THE SPACE FORCE", items=[{"label": "faith in victory", "v": 0.9, "color": BLUE}, {"label": "doubt", "v": 0.1, "color": "#9c958a"}], keys={"0": {"shown": 2, "d": 1.4, "t": 1.4}}, out=1),
    cut("bh", "beihai", 920, 420, name="Zhang Beihai", role="navy political commissar", i=1, d=0.2, w=250, h=300),
    hl("pub", "PUBLICLY: [[keep the faith]]", 920, 140, size=28, i=1, d=0.8, card=PAPER, rot=2),
    hl("pri", "PRIVATELY: [[we will lose. Run.]]", 920, 210, size=28, i=1, d=2.6, card=YEL, rot=-2),
    ph("dw", "darwin", 330, 380, 300, 380, i=2, d=0.2, rot=-3, name="Natural Selection", role="the warship he hijacks is named for Darwin's idea", nameY=190, roleSize=14),
    head("tq", "TRAITOR\nOR REALIST?", 640, 380, size=52, i=3, d=0.2, bg=RED, color=CREAM, rot=-3),
    cite(DF + ", Parts I-III"),
], [
    L("The trilogy is obsessed with belief. One Wallfacer builds the mental seal, a machine that can stamp a single conviction into a brain for life. Volunteers line up to have faith in victory installed."),
    L("Then there's Zhang Beihai, a navy political commissar. In public, he preaches confidence. In private, he has concluded that humanity will lose, and that the only way to save anyone is to run."),
    L("Two centuries later, he hijacks a warship named Natural Selection and flees into deep space."),
    L("Traitor, or the only man who saw clearly? The book won't let you settle it."),
], dash=True, punch={1: [1.05, 280, 0], 3: [1.0, 0, 0]}))

seq.append(scene("p3-droplet", "night", [
    full("sn", "sun", i=0, dim=0.45, kb=0.1),
    el("ships", "vbars", 640, 330, i=0, d=0.6, size=24, w=560, shown=0, labelColor=CREAM, track="rgba(255,255,255,0.15)", title="THE DOOMSDAY BATTLE", titleColor=CREAM,
       items=[{"label": "human warships", "v": 1.0, "color": BLUE, "note": "~2,000"}, {"label": "alien probes", "v": 0.02, "color": RED, "note": "1"}],
       keys={"0": {"shown": 2, "d": 0.8, "t": 1.4}, "1": {"items": [{"label": "human warships", "v": 0.01, "color": BLUE, "note": "almost none left"}, {"label": "alien probes", "v": 0.02, "color": RED, "note": "1"}], "d": 0.6, "t": 2.0}}, out=2),
    quote("q", "Weakness and ignorance are not barriers\nto survival, but [[arrogance is]].", 640, 330, "Death's End", size=40, i=2, d=0.2, dark=True),
    cite(DF + ", Part III; " + DE + ", Part II"),
], [
    L("His pessimism looks wise when the first alien probe arrives. Humanity has gathered about two thousand warships in a proud parade formation."),
    L("A single probe, a flawless teardrop of matter, tears through almost all of them in minutes."),
    L("One line from Death's End sums up the lesson the books keep hammering: weakness and ignorance are not barriers to survival, but arrogance is."),
], punch={1: [1.08, 0, 0], 2: [1.06, 0, 0]}))

# =============================== part 4: space makes a new morality ===============================
seq.append(chapter(4, "Idea four", "Space makes\na new morality", "The dark battle, The Dark Forest", "beihai", color="#55306b", photo="leviathan", pw=200, ph_=260))

seq.append(scene("p4-battle", "inknight", [
    el("st", "stars", 640, 360, n=140, w=1300, h=740, anim="fade", sfx=None, lit=[{"i": 1, "x": 280, "y": 200, "color": "#7fc8ff"}, {"i": 2, "x": 520, "y": 160, "color": "#7fc8ff"}, {"i": 3, "x": 760, "y": 210, "color": "#7fc8ff"}, {"i": 4, "x": 1000, "y": 170, "color": "#7fc8ff"}, {"i": 5, "x": 640, "y": 300, "color": YEL, "label": "NATURAL SELECTION", "ly": -30, "size": 18}]),
    el("eq", "veq", 640, 480, i=1, d=0.2, size=44, shown=0, parts=[{"text": "5 SHIPS"}, {"text": "+"}, {"text": "FUEL FOR 1", "bg": YEL}], keys={"1": {"shown": 3, "d": 0.3, "t": 1.4}}, out=2),
    quote("q", "The birth of a new civilization\nis the formation of a [[new morality]].", 640, 490, "Zhang Beihai, The Dark Forest", size=34, i=2, d=0.2, dark=True, out=3),
    head("sec", "SOMEONE ELSE FIRES FIRST", 640, 500, size=46, i=3, d=0.3, bg=RED, color=CREAM),
    cite(DF + ", Part III"),
], [
    L("Then comes one of the darkest chapters in the series. A handful of ships escaped the battle, Natural Selection among them. They're drifting toward the stars with nowhere to go."),
    L("There isn't enough fuel or spare parts for everyone. One ship can make it, if it takes what the others have. And whoever hesitates becomes the spare parts."),
    L("Zhang Beihai readies his missiles first, and says something chilling: the birth of a new civilization is the formation of a new morality."),
    L("But another ship fires a moment sooner. In seconds, a tiny dark forest plays out among humans themselves."),
], punch={1: [1.05, 0, 80], 3: [1.06, 0, 100]}))

seq.append(scene("p4-hobbes", "cream", [
    ph("lv", "leviathan", 280, 340, 320, 460, i=0, d=0.2, rot=-3, name="Leviathan", role="Thomas Hobbes, 1651", nameY=230),
    hl("nb", "Without a power above us, life is\n‘[[nasty, brutish, and short]]’", 830, 200, size=30, i=0, d=1.2, card=PAPER, rot=1),
    head("sn", "SPACE = THE ULTIMATE\nSTATE OF NATURE", 830, 400, size=44, i=1, d=0.3, bg=INK, color=CREAM),
    hl("np", "no police · no court · no shared future", 830, 520, size=26, i=1, d=1.8, card=YEL, rot=-1),
    quote("q", "Space itself is a kind of\n[[mental seal]].", 830, 380, "a Bronze Age crewman on trial, Death's End", size=40, i=2, d=0.2),
    cite("Thomas Hobbes, Leviathan (1651), ch. 13; " + DE + ", Part I"),
], [
    L("Philosophers have a name for this. In 1651, Thomas Hobbes imagined life with no power above us, no state, no law, and called it nasty, brutish, and short."),
    L("Liu's insight is that space is the ultimate state of nature: no police, no court, no shared future. Put perfectly decent people in it, and the rules change."),
    L("In Death's End, a crewman from another ship that did the same thing is put on trial back on Earth. He tries to explain. Space itself is a kind of mental seal: once the ship became his whole world, he simply changed."),
], dash=True, punch={1: [1.05, 110, 40], 2: [1.08, 110, 20]}))

seq.append(scene("p4-lifeboat", "news", [
    ph("mg", "mignonette", 320, 330, 420, 320, i=0, d=0.2, rot=-2, name="R v Dudley and Stephens", role="the 1884 lifeboat case", nameY=165),
    note("lb", "1884: four men adrift.\nThe cabin boy is killed\nand eaten to survive.", 640 if "mignonette" not in MAN else 900, 230, i=0, d=0.8, w=520, size=28, rot=2),
    head("v", "VERDICT: NECESSITY IS\nNO EXCUSE FOR MURDER", 640 if "mignonette" not in MAN else 900, 470, size=36, i=1, d=0.2, bg=RED, color=CREAM),
    hl("qq", "Should a court on Earth judge\nwhat happened [[out there]]?", 640, 630, size=28, i=2, d=0.2, card=YEL, rot=-1),
    cite("R v Dudley and Stephens (1884) 14 QBD 273"),
], [
    L("Real courts have faced this. In 1884, four men from the yacht Mignonette were adrift in a lifeboat. Two of them killed the cabin boy and ate him to stay alive."),
    L("An English court ruled that necessity is no excuse for murder. The judges held the sailors to the morality of the land, not the sea."),
    L("The trilogy asks whether Earth has any right to do the same to people who were living in a different universe of rules."),
], punch={1: [1.06, 0 if "mignonette" not in MAN else 260, 60]}))

# =============================== part 5: the mother and the wolf ===============================
seq.append(chapter(5, "Idea five", "The Madonna\nand the wolf", "Cheng Xin versus Thomas Wade, Death's End", "chengxin", color=RED, photo="jfk_nk", pw=260, ph_=190))

seq.append(scene("p5-sword", "night", [
    cut("lj2", "luojiold", 260, 430, name="Luo Ji", role="the Swordholder", i=0, d=0.2, w=250, h=300),
    el("st", "stars", 820, 300, n=90, w=900, h=480, anim="fade", sfx=None, lit=[{"i": 4, "x": -200, "y": 0, "color": "#7fc8ff", "label": "EARTH", "ly": -30, "size": 20}, {"i": 6, "x": 220, "y": -40, "color": YEL, "label": "TRISOLARIS", "ly": -30, "size": 20}], out=1),
    hl("thr", "Attack us, and I tell the whole universe\nwhere [[both]] our worlds are.", 820, 560, size=28, card=PAPER, rot=-1, out=1),
    ph("jk", "jfk_nk", 790, 300, 460, 320, i=1, d=0.2, rot=2, name="Kennedy and Khrushchev", role="Vienna, 1961", nameY=160),
    ph("cb", "castle_bravo", 1080, 470, 280, 280, i=1, d=1.8, rot=-4, name="Castle Bravo", role="US H-bomb test, 1954", nameY=140),
    head("mad", "MUTUALLY ASSURED DESTRUCTION", 640, 120, size=36, i=1, d=0.8, bg=YEL, color=INK, out=2),
    el("bar", "vbars", 760, 560, i=2, d=0.4, size=24, w=360, shown=0, labelColor=CREAM, noteColor=YEL, track="rgba(255,255,255,0.15)", items=[{"label": "Luo Ji's deterrence", "v": 0.9, "color": RED, "note": "~90%"}], keys={"2": {"shown": 1, "d": 1.0, "t": 1.2}}),
    cite(DF + ", Part III; " + DE + ", Part II"),
], [
    L("Back to Luo Ji. He works out how to turn the dark forest into a weapon. Attack us, he tells the aliens, and I'll broadcast where both our worlds are to the entire universe. It works."),
    L("This is mutually assured destruction, the logic of the Cold War, scaled up to the stars. The book even names its precursors: NATO, the Warsaw Pact, and the Soviet Dead Hand."),
    L("For fifty-four years Luo Ji sits with his hand on the switch, the Swordholder. The aliens' own studies rate his deterrence at around ninety percent. They believe he'd do it."),
], dash=True, punch={1: [1.04, 60, 40], 2: [1.06, 120, 200]}))

seq.append(scene("p5-election", "cream", [
    cut("cx", "chengxin", 300, 430, name="Cheng Xin", role="an aerospace engineer", i=0, d=0.2, w=250, h=300),
    hl("md", "‘Oh, beautiful, kind [[Madonna]],\nprotect this world!’", 880, 180, size=30, i=0, d=2.4, card=PAPER, font="serif", italic=True, weight=700, rot=1),
    el("bar", "vbars", 860, 380, i=1, d=0.4, size=24, w=360, shown=0, title="DETERRENCE, AS THE ALIENS RATED IT", items=[{"label": "Luo Ji", "v": 0.9, "color": "#6b6255", "note": "~90%"}, {"label": "Cheng Xin", "v": 0.1, "color": RED, "note": "~10%"}],
       keys={"1": {"shown": 2, "d": 0.8, "t": 1.8}}),
    {"id": "fif", "type": "stampc", "x": 860, "y": 580, "text": "15 MINUTES", "size": 46, "rot": -6, "in": 2, "d": 0.4, "anim": "none", "sfx": "thump", "vol": 0.7},
    cite(DE + ", Part II"),
], [
    L("Then humanity, now peaceful and comfortable, picks a successor. Not a cold strategist, but Cheng Xin, a gentle engineer the crowds adore. One young mother calls her a Madonna."),
    L("The aliens' studies put her deterrence at around ten percent."),
    L("Her career as Swordholder lasts fifteen minutes. The aliens attack, and she cannot bring herself to destroy two worlds. Deterrence collapses, and humanity is herded onto a single continent."),
], dash=True, punch={1: [1.06, 220, 20], 2: [1.05, 220, 200]}))

seq.append(scene("p5-wade", "oxblood", [
    cut("tw", "wade", 270, 430, name="Thomas Wade", role="intelligence chief", i=0, d=0.2, w=250, h=300),
    head("adv", "‘ADVANCE! WE STOP AT\nNOTHING TO ADVANCE!’", 830, 160, size=40, i=0, d=1.4, bg=INK, color=CREAM, rot=-2),
    quote("q", "If we lose our [[human nature]], we lose much,\nbut if we lose our [[bestial nature]],\nwe lose everything.", 820, 380, "Thomas Wade, Death's End", size=32, i=1, d=0.2, dark=True),
    note("ls", "lightspeed ships = the only way out\nCheng Xin: stop.\nWade: obeys. Executed.", 820, 590, i=2, d=0.2, w=560, size=26, rot=1, colors=["#1f2d6b", RED, "#1f2d6b"]),
    cite(DE + ", Parts I and IV"),
], [
    L("Her opposite is Thomas Wade, an intelligence chief who will do anything. His motto: advance, we stop at nothing to advance."),
    L("His philosophy is one sentence. If we lose our human nature, we lose much, but if we lose our bestial nature, we lose everything."),
    L("Decades later Wade is secretly building lightspeed ships, the one technology that could let humans flee. Cheng Xin, who holds authority over the project, orders him to stop rather than risk a war. He keeps his promise to obey her, and he is executed."),
], punch={1: [1.06, 180, 0], 2: [1.05, 180, 220]}))

seq.append(scene("p5-flat", "night", [
    full("sty", "starry", i=0, dim=0.15, kb=0.1),
    el("st", "stars", 640, 360, n=220, w=1300, h=740, anim="fade", sfx=None, dark=0, keys={"1": {"dark": 0.9, "d": 0.2, "t": 2.5}}),
    head("2d", "THE SOLAR SYSTEM,\nFLATTENED INTO TWO DIMENSIONS", 640, 330, size=44, i=1, d=0.2, bg=INK, color=CREAM),
    cite(DE + ", Part V"),
], [
    L("Not long after, a far older civilization casually flattens the entire Solar System into two dimensions, like a painting."),
    L("Lightspeed ships were the only way out. Wade's ruthlessness would have saved people. Cheng Xin's conscience did not."),
], punch={0: [1.06, 0, 0]}))

seq.append(scene("p5-weber", "cream", [
    ph("mw", "weber", 180, 290, 220, 290, i=0, d=0.2, rot=-3, name="Max Weber", role="Politics as a Vocation, 1919", nameY=150),
    el("tb", "vtable", 760, 330, i=0, d=0.6, w=820, size=22, shown=0, cols=["", "Cheng Xin", "Thomas Wade"], colW=[220, 300, 300],
       rows=[["Weber's term", "ethic of conviction", "ethic of responsibility"], ["Rule", "never do wrong", "answer for results"], ["Strength", "keeps her humanity", "keeps us alive"], ["Cost", "humanity pays, twice", "his soul, and his life"]],
       keys={"0": {"shown": 1, "d": 1.0, "t": 0.8}, "1": {"shown": 4, "d": 0.3, "t": 3.0}}, anim="rise", sfx="paper"),
    ph("kt", "kant", 180, 560, 180, 220, i=1, d=0.6, rot=4, name="Kant", nameY=110),
    ph("mc", "machiavelli", 1150, 580, 180, 220, i=1, d=1.4, rot=-4, name="Machiavelli", nameY=110),
    head("both", "WEBER: YOU NEED BOTH.", 760, 620, size=40, i=2, d=0.4, bg=YEL, color=INK),
    cite("Max Weber, 'Politics as a Vocation' (1919)"),
], [
    L("This is the trilogy's central argument. In 1919 the sociologist Max Weber described two ethics. The ethic of conviction: do what is right, and let the results fall where they may. The ethic of responsibility: answer for the consequences of your choices."),
    L("Cheng Xin keeps her conscience clean, and twice humanity pays for it. Wade gets his hands dirty for a survival that never comes."),
    L("Weber's point was that a serious person needs both. Liu splits them into two people and makes them fight."),
    L("Plenty of readers walk away certain the book is telling them Wade was right. That reading is where the critics come in."),
], dash=True, punch={1: [1.04, 0, 0], 2: [1.06, 0, 260]}))

# =============================== part 6: the case against ===============================
seq.append(chapter(6, "Idea six", "The case against\nthe forest", "Economists, game theorists, critics", "luoji", color="#5b7a5a", photo="paleblue", pw=200, ph_=260))

seq.append(scene("p6-critics", "news", [
    note("ns", "Noah Smith, 2024:\n‘the dark forest hypothesis is absurd’\n· space is transparent; hiding fails\n· if the killers existed, we'd be gone", 360, 220, i=0, d=0.2, w=620, size=24, rot=-1, colors=["#1f2d6b", RED, "#1f2d6b", "#1f2d6b"]),
    ph("db", "brin", 1000, 260, 260, 320, i=1, d=0.2, rot=3, name="David Brin", role="‘The Great Silence’, 1983", nameY=160),
    hl("gs", "Deadly hunters: [[one]] explanation\nfor the quiet sky among many.", 960, 520, size=24, i=1, d=1.0, card=PAPER, rot=-1),
    ph("ax", "axelrod", 300, 520, 220, 260, i=2, d=0.2, rot=-3, name="Robert Axelrod", role="The Evolution of Cooperation, 1984", nameY=130),
    el("tb", "vtable", 760, 440, i=2, d=0.8, w=700, size=22, shown=0, cols=["Strategy", "In repeated games"], colW=[280, 420],
       rows=[["always betray", "wins once, then loses"], ["tit for tat", "nice first, then mirror: wins"]], keys={"2": {"shown": 2, "d": 1.2, "t": 2.0}}, hi=1, anim="rise", sfx="paper"),
    cite("Noah Smith, Noahpinion (Jan 2024); David Brin, QJRAS 24 (1983); Robert Axelrod, The Evolution of Cooperation (1984)"),
], [
    L("The economist Noah Smith called the dark forest hypothesis absurd. Space is transparent: a really advanced civilization could spot us with telescopes, so hiding wouldn't work. And if the hunters existed, we'd probably be dead already."),
    L("The physicist and novelist David Brin, whose 1983 paper on the 'Great Silence' surveyed explanations for the quiet sky, treated deadly hunters as just one possibility among many."),
    L("And game theory cuts both ways. In Robert Axelrod's famous tournaments, strategies that opened nicely and then mirrored their partner, like tit for tat, beat the ruthless ones, as long as the game kept going."),
], dash=True, punch={0: [1.06, -280, -140], 1: [1.04, 300, 0], 2: [1.04, 100, 80]}))

seq.append(scene("p6-zhang", "cream", [
    el("sc", "balance", 760, 330, i=0, d=0.2, s=1.0, tilt=0, anim="pop", sfx="pop", out=2, left="morality", right="survival"),
    hl("fz", "Chenchen Zhang, 2023: the books stage\na [[false choice]] between them.", 800, 600, size=28, i=0, d=1.2, card=PAPER, rot=-1, out=2),
    cut("cx2", "chengxin", 220, 420, name="Cheng Xin", role="turned into a symbol by some fans", i=1, d=0.2, w=250, h=300, out=2),
    note("mz", "‘Feminine’ compassion\ndoomed the world?\nZhang: misogyny posing\nas realism.", 880, 330, i=1, d=0.8, w=520, size=28, rot=2, colors=["#1f2d6b", "#1f2d6b", RED, RED], out=2),
    head("st", "THE BOOK IS SMARTER\nTHAN ITS LOUDEST FANS", 640, 340, size=48, i=2, d=0.3, bg=INK, color=CREAM),
    cite("Chenchen Zhang, 'The Three-Body Problem, the Imperative of Survival, and the Misogyny of Reactionary Rhetoric', Made in China Journal (Dec 2023)"),
], [
    L("The political scientist Chenchen Zhang, writing in 2023, argued the books stage a false choice: morality and democracy on one side, reason and survival on the other, as if you must pick one."),
    L("She also noticed how some readers turned Cheng Xin into a symbol, blaming so-called feminine compassion for the end of the world. That, she argued, is misogyny dressed up as realism."),
    L("But here's the twist. The strongest case against the dark forest may be inside Death's End itself."),
], dash=True, punch={1: [1.04, 0, 0]}))

seq.append(scene("p6-ruins", "inknight", [
    el("st", "stars", 640, 360, n=220, w=1300, h=740, anim="fade", sfx=None, dark=0, keys={"1": {"dark": 0.85, "d": 0.4, "t": 3.0}, "3": {"dark": 0.2, "d": 0.6, "t": 3.0}}),
    el("mp", "vmap", 0, 0, i=0, d=0.4, size=24, draw=0, keys={"0": {"draw": 1, "d": 0.6, "t": 4.0}},
       nodes=[{"id": "a", "x": 300, "y": 200, "text": "everyone hunts"}, {"id": "b", "x": 700, "y": 160, "text": "physics becomes\na weapon"},
              {"id": "c", "x": 1010, "y": 300, "text": "dimensions\ncollapse"}, {"id": "d", "x": 700, "y": 420, "text": "light slows down"}, {"id": "e", "x": 330, "y": 470, "text": "THE FOREST BURNS", "color": RED, "fg": CREAM, "shape": "box", "size": 28}],
       edges=[["a", "b"], ["b", "c"], ["c", "d"], ["d", "e"]], out=2),
    quote("q", "Please [[return the mass]] you have taken away", 640, 330, "The Returners, Death's End", size=38, i=2, d=0.2, dark=True, out=3),
    note("eco", "Cheng Xin gives hers back.\nShe keeps only 5 kilograms:\na sealed world, a little sun,\na fish, and a message.", 640, 360, i=3, d=0.4, w=620, size=30, rot=-1),
    cite(DE + ", Part VI"),
], [
    L("Near the end we learn the universe is a ruin. Wars between the oldest civilizations turned the laws of physics into weapons. Dimensions collapsed. The speed of light was slowed down."),
    L("Everyone followed the logic of the hunter, and the forest burned down."),
    L("The last message in the trilogy is a plea from a group called the Returners: please return the mass you have taken away, or the whole universe dies. It can only be saved if strangers who will never meet all cooperate."),
    L("And Cheng Xin, the woman who failed twice, answers. She gives back her little universe, keeping only five kilograms: a sealed world with a tiny sun, a fish, and a message."),
], punch={1: [1.06, 0, 0], 3: [1.05, 0, 0]}))

# =============================== ending ===============================
seq.append(scene("outro", "night", [
    full("er", "alphacen", i=0, dim=0.3, kb=0.1, out=2),
    ph("lc", "liucixin", 1060, 300, 280, 340, i=0, d=0.6, rot=3, name="Liu Cixin", role="grew up during the Cultural Revolution", nameY=170, out=1),
    note("qs", "Would you answer the message?\nCould you press the button?\nWhat would you refuse to give up,\neven to survive?", 640, 330, i=1, d=0.3, w=760, size=34, speed=6.0, colors=["#1f2d6b", "#1f2d6b", RED, RED], out=3),
    full("pb", "paleblue", i=3, dim=0.1, kb=0.12),
    quote("q", "Make time for civilization,\nfor civilization won't make time.", 640, 330, "Death's End", size=40, i=4, d=0.3, dark=True),
    cite("NASA/ESA Hubble, Alpha Centauri A and B; NASA/JPL, Pale Blue Dot Revisited (2020); " + DE),
], [
    L("Liu Cixin grew up during the Cultural Revolution, and the trilogy carries that memory: of how quickly people turn on each other when they're afraid."),
    L("But it doesn't hand you an answer. It hands you three questions. Would you answer the message? Could you press the button? And what would you refuse to give up, even to survive?"),
    L("Ye Wenjie answered the stars because she had stopped believing in people. Cheng Xin couldn't press the button because she still did."),
    L("Somewhere between those two women is the whole problem of being human in a dangerous universe."),
    L("Make time for civilization, the book says, for civilization won't make time."),
    beat(2.8, "swell"),
], zoom=(1.0, 1.05), punch={1: [1.04, 0, 0], 4: [1.0, 0, 0]}))

CRED = json.load(open(os.path.join(HERE, "assets", "credits.json"))) if os.path.exists(os.path.join(HERE, "assets", "credits.json")) else {}
IMG_CREDITS = []
for k in dict.fromkeys(USED):
    c = CRED.get(k)
    if c:
        who = (" by " + c["artist"][:40]) if c.get("artist") and "CC" in (c.get("license") or "") else ""
        IMG_CREDITS.append((c["title"].rsplit(".", 1)[0][:70] + who + f" ({c['license']})").replace("  ", " "))
seq.append({"type": "card", "id": "end", "style": "cend", "title": "THE DARK FOREST", "dur": 24, "credits": [
    "# Liu Cixin's Remembrance of Earth's Past trilogy (quoted briefly, with attribution)",
    "The Three-Body Problem (2006), trans. Ken Liu (Tor, 2014): paraphrased",
    "The Dark Forest (2008), trans. Joel Martinsen (Tor, 2015)",
    "Death's End (2010), trans. Ken Liu (Tor, 2016)",
    "# Thinkers and critics",
    "Thomas Hobbes, Leviathan (1651)",
    "Max Weber, 'Politics as a Vocation' (1919)",
    "David Brin, 'The Great Silence', Quarterly Journal of the Royal Astronomical Society 24 (1983)",
    "Robert Axelrod, The Evolution of Cooperation (1984)",
    "Noah Smith, 'The dark forest hypothesis is absurd', Noahpinion (Jan 2024)",
    "Chenchen Zhang, Made in China Journal (Dec 2023)",
    "Stephen Hawking, Into the Universe (Discovery Channel, 2010)",
    "R v Dudley and Stephens (1884) 14 QBD 273",
    "# Archival images (Wikimedia Commons, NASA)",
    *IMG_CREDITS,
    "# Made with",
    "Kokoro open-weight voices, an original numpy score,",
    "hand-coded SVG collage and diagrams, headless Chromium and ffmpeg",
    "",
    "Real people and places appear in archival images; fictional characters are drawn.",
    "Not affiliated with Liu Cixin, his publishers, or any film or TV adaptation.",
]})

ep = {
    "meta": {
        "show": "LUMEN", "episode": "Explainer", "title": "The Dark Forest", "format": "explainer", "look": "collage",
        "category": "Literature: Liu Cixin", "rating": "teen",
        "content_note": "Discusses political violence during the Cultural Revolution, war and a historical case of cannibalism at sea. Nothing graphic is shown.",
        "music": "pulse", "trans": "cut", "narrator": "narrator", "fps": 30, "gap": 0.24, "captions": False,
        "logline": "Why is the universe so quiet? A Vox-style explainer on the philosophy of Liu Cixin's Three-Body trilogy: Ye Wenjie's despair, cosmic sociology and the dark forest, the Wallfacers, the new morality of space, Cheng Xin versus Wade, and the case against the forest.",
        "source": "Liu Cixin, The Three-Body Problem, The Dark Forest, Death's End; Hobbes; Weber; Brin; Axelrod; Noah Smith; Chenchen Zhang.",
        "disclaimer": "Real people and places appear in archival images. Fictional characters are drawn. Not affiliated with Liu Cixin, his publishers or any adaptation.",
        "width": 1280, "height": 720,
    },
    "cast": {"narrator": {"name": "Narrator", "voice": "am_michael:0.6+bm_george:0.4", "speed": 1.14}},
    "sequence": seq,
}

out = os.path.join(HERE, "episode.json")
json.dump(ep, open(out, "w"), indent=1, ensure_ascii=False)
words = sum(len(l.get("text", "").split()) for s in seq if s["type"] == "scene" for l in s["lines"])
print(f"wrote {out}: {len(seq)} segments, {words} words of narration")
