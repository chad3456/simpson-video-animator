#!/usr/bin/env python3
"""Writes episode.json for the LUMEN explainer "Love Humanity, Hate People: Dostoevsky's field guide to rebels,
saviours and moral gatekeepers". Paper collage look plus the diagram kit in engine/vox.js (tables, philosophy maps,
trait bars, an ink-blue grid ground). Every quotation on screen or in narration is verbatim from the cited source;
see bible.md for the quote ledger. Usage: python3 explainer/episodes/love-humanity-hate-people/build.py"""
import json, os

RED, YEL, INK, CREAM, BLUE, PAPER = "#d23a2e", "#ffd23f", "#1d1b19", "#f4ecdc", "#2443c9", "#fbf7ee"

# Invented procedural faces (not likenesses). Keys are passed to the collage `cut` element as face overrides.
FACE = {
    "raskolnikov": {"hair": "shaggy", "hairC": "dark", "beard": "none", "brow": -0.4, "eyes": "deep", "coat": "#3d3a35", "tie": "none", "face": 0.95, "gaunt": 1, "young": 1, "mouth": -0.2},
    "underground": {"hair": "flat", "hairC": "dark", "beard": "short", "beardC": "dark", "brow": -0.6, "eyes": "narrow", "coat": "#4a463e", "tie": "scarf", "scarfC": "#6b5a48", "face": 0.96, "mouth": 0.3, "smirk": 1, "gaunt": 1},
    "ivan": {"hair": "parted", "hairC": "brown", "beard": "none", "brow": -0.2, "eyes": "calm", "coat": "#2a2c33", "tie": "cravat", "face": 1.0, "mouth": -0.1},
    "inquisitor": {"hair": "bald", "hairC": "white", "beard": "none", "brow": -0.5, "eyes": "deep", "coat": "#3a1414", "tie": "none", "face": 1.06, "long": 1.12, "gaunt": 1, "mouth": -0.4},
    "smerdyakov": {"hair": "swept", "hairC": "black", "beard": "none", "brow": -0.1, "eyes": "narrow", "coat": "#3a3a33", "tie": "none", "face": 0.92, "mouth": 0.2, "smirk": 1},
    "sonia": {"hair": "scarf", "hairC": "brown", "scarfC": "#5d7a6a", "female": 1, "brow": 0.4, "eyes": "soft", "coat": "#56604f", "tie": "none", "face": 0.9, "mouth": 0.2, "young": 1},
    "lizaveta": {"hair": "scarf", "hairC": "dark", "scarfC": "#8a7a5a", "female": 1, "brow": 0.6, "eyes": "soft", "coat": "#6a5f50", "tie": "none", "face": 1.0, "mouth": 0.1},
    "doctor": {"hair": "short", "hairC": "grey", "beard": "none", "mous": 1, "brow": 0.3, "eyes": "calm", "coat": "#2c2f36", "tie": "bow", "face": 1.02, "glasses": 1, "mouth": 0},
    "pyotr": {}, "shigalyov": {}, "dostoevsky": {}, "tikhon": {}, "student": {},
}
COL = {"raskolnikov": "#c9a27a", "underground": "#a9b4a0", "ivan": "#9fb0c8", "inquisitor": "#c47a6a", "smerdyakov": "#b5b09a",
       "sonia": "#b8c9a0", "lizaveta": "#d8c39a", "doctor": "#b0a8c8", "pyotr": "#d9a441", "shigalyov": "#d4b0a4",
       "dostoevsky": "#c98f7a", "tikhon": "#c9b893", "student": "#b5b09a"}
PRESET = {"zosima": "tikhon"}


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


GAR_BK = "The Brothers Karamazov (1880), trans. Constance Garnett (1912)"
GAR_CP = "Crime and Punishment (1866), trans. Constance Garnett (1914)"
GAR_NU = "Notes from Underground (1864), trans. Constance Garnett (1918)"
GAR_DE = "The Possessed / Demons (1871-72), trans. Constance Garnett (1916)"

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

# =============================== cold open ===============================
seq.append(scene("open-doctor", "cream", [
    ph("bk", "bk_cover", 300, 330, 300, 420, rot=-4, name="The Brothers Karamazov", role="first edition", nameY=200,
       alt=[("ambrose", {"w": 380, "h": 270, "name": "Elder Ambrose of Optina", "role": "a model for Father Zosima", "nameY": 140})]),
    quote("q", "‘I love humanity,’ he said, ‘but I wonder at myself.\nThe more I love [[humanity in general]],\nthe less I love [[man in particular]].’", 830, 300, "Brothers Karamazov, Book II, ch. 4", size=28, i=1),
    head("t", "TWO DAYS", 870, 560, size=44, i=2, bg=RED),
    cite(GAR_BK + ", Book II, ch. 4, 'A Lady of Little Faith'"),

], [
    L("In The Brothers Karamazov, an old monk named Zosima tells a story about a doctor who once confessed something strange to him."),
    L("‘I love humanity,’ he said, ‘but I wonder at myself. The more I love humanity in general, the less I love man in particular.’", who="zosima"),
    L("He dreamed of serving mankind. Yet he could not share a room with anyone for two days without starting to hate them."),
], dash=True, punch={1: [1.12, 170, -40], 2: [1.06, 120, 60]}))

seq.append(scene("open-question", "ink", [
    ph("fd", "dost_1879", 1060, 470, 330, i=0, d=0.4, anim="right", out=2, name="Fyodor Dostoevsky", role="1821-1881", nameY=150),
    head("q1", "WHY DO PEOPLE WHO SET OUT\nTO FREE HUMANITY", 470, 210, size=36, i=1, bg=None, color=CREAM, sfx="whoosh"),
    head("q2", "END UP DESPISING HUMANS?", 470, 330, size=44, i=1, d=2.4, bg=YEL, color=INK),
    head("q3", "WHY DO THE LOUDEST MORALISTS\nSO OFTEN BELIEVE IN NOTHING?", 470, 490, size=30, i=1, d=5.6, bg=CREAM, color=INK),
    ph("yd", "dost_young", 1040, 360, 300, 400, i=2, d=0.5, rot=4, name="Dostoevsky at 26", role="drawn by K. Trutovsky, 1847", nameY=200,
       ring={"x": 0, "y": -60, "rx": 120, "ry": 140, "delay": 1.6}),
    {"id": "five", "type": "stampc", "x": 470, "y": 630, "text": "5 TYPES OF REBEL", "size": 34, "rot": -4, "in": 3, "d": 1.2, "anim": "none", "sfx": "thump", "vol": 0.6},

], [
    L("Dostoevsky wrote that almost a hundred and fifty years ago. You have probably met this person."),
    L("Why do so many people who set out to free humanity end up despising actual humans? Why do the loudest guardians of morality so often turn out to believe in nothing?"),
    L("Dostoevsky spent his whole career on that question, and he had a reason. He had once been one of them."),
    L("Across his books he built a kind of field guide: five types of rebel, five ways a good cause goes bad. Let's take them apart."),
], dash=True, scraps=0, zoom=(1.0, 1.04), punch={2: [1.05, 60, 0], 3: [1.04, -40, 60]}))

seq.append({"type": "card", "id": "title", "style": "ctitle", "kicker": "A LUMEN explainer", "title": "LOVE HUMANITY,\nHATE PEOPLE", "size": 92,
            "sub": "Dostoevsky's field guide to rebels, saviours and moral gatekeepers", "by": "Crime and Punishment · Notes from Underground · Demons · The Brothers Karamazov · A Writer's Diary", "dur": 6.0, "sfx": "swell"})

# =============================== part 1: the insider ===============================
seq.append(chapter(1, "Part one", "The man who\nhad been there", "St Petersburg, 1849. The Diary, 1873.", "dostoevsky", photo="dost_young"))

seq.append(scene("p1-circle", "news", [
    el("tl", "ptl", 640, 520, s=1.0, w=900, shown=0, events=[{"year": "1846", "text": "Poor Folk: a star at 24"}, {"year": "1847", "text": "joins a socialist circle"}, {"year": "1848", "text": "a secret inner group"}, {"year": "1849", "text": "arrest, mock execution"}, {"year": "1850-54", "text": "Siberian prison camp"}],
       keys={"0": {"shown": 2, "d": 0.6, "t": 1.4}, "1": {"shown": 3, "d": 0.2, "t": 0.6}, "2": {"shown": 5, "d": 0.2, "t": 1.4}}, anim="fade"),
    ph("d", "dost_young", 270, 200, 210, 270, rot=-3, name="Dostoevsky", role="the year he joined, 1847", nameY=125),
    hl("s", "Kept secret all his life.\nRevealed only in [[1922]].", 860, 200, size=30, i=1, card="#fff3b0", rot=1, out=2),
    note("n", "22 Dec 1849, Semyonovsky Square:\nsentenced to be shot.\nPardon read out at the last moment.", 880, 250, i=2, d=0.2, w=520, size=23, rot=-2),
    cite("Joseph Frank, 'Inflamed', London Review of Books, vol. 15 no. 23, 2 December 1993", i=1),

], [
    L("In 1849, Dostoevsky was a rising young novelist in a St Petersburg socialist circle, and in a secret group inside it that planned to print illegal propaganda."),
    L("His biographer Joseph Frank calls it a genuine underground conspiracy. That fact stayed hidden until 1922."),
    L("He was arrested, put through a mock execution, and sent to a Siberian prison camp for four years."),
], punch={2: [1.06, 140, -60]}))

seq.append(scene("p1-diary", "cream", [
    {"id": "sh", "type": "sheet", "x": 330, "y": 360, "w": 420, "h": 520, "kind": "page", "kicker": "THE CITIZEN, 1873", "head": "A WRITER'S\nDIARY", "text": "‘perhaps I could have become’\na Nechaevist ‘in the days\nof my [[youth]].’", "size": 21, "fill": 6, "rot": -2, "tape": True,
     "in": 0, "d": 0.3, "anim": "rise", "sfx": "paper", "vol": 0.7, "out": 2},
    ph("ne", "nechayev", 900, 380, 300, i=1, d=0.2, anim="right", out=2, name="Sergey Nechayev", role="revolutionary, 1847-1882", nameY=200, h=400,
       alt=[("dost_1872", {"w": 300, "h": 380, "name": "Dostoevsky, 1872", "role": "the year Demons came out", "nameY": 190, "i": 0, "rot": 3})]),
    quote("q", "the possibility of considering oneself –\nand sometimes even being, in fact –\nan [[honorable person]] while committing\n[[obvious and undeniable villainy]] –\nthat is our whole affliction today!", 560, 320, "Dostoevsky, A Writer's Diary (1873), trans. Kenneth Lantz", size=30, i=2, d=0.4),
    ph("dp", "dost_photo", 1120, 400, 230, i=2, d=0.6, anim="right", rot=4),
    hl("n", "Not monsters. [[Good people]], doing\nmonstrous things, [[feeling good]] about it.", 560, 620, size=26, i=3, card="#fff3b0"),
    cite("Dostoevsky, A Writer's Diary (1873), trans. Lantz (1993), as quoted by Joseph Frank, LRB 1993"),

], [
    L("Twenty-four years later, in A Writer's Diary, he looked back."),
    L("He could probably never have been Nechayev, the ruthless revolutionary of his day. But a follower? Perhaps, he wrote, in the days of his youth."),
    L("Then he named the disease he had seen from the inside: the possibility of considering oneself, and sometimes even being, in fact, an honorable person while committing obvious and undeniable villainy. That is our whole affliction today."),
    L("Not monsters. Good people doing monstrous things, and feeling good about it. Every type in this field guide is a variation on that sentence."),
], punch={3: [1.05, -40, 90]}))

# =============================== part 2: the formula ===============================
seq.append(chapter(2, "Type one", "The man with\na formula", "Crime and Punishment, 1866", "raskolnikov", color="#c9772e", photo="boklevsky"))

seq.append(scene("p2-arith", "cream", [
    full("hay", "sennaya", i=0, dim=0.25, out=1, kb=0.12),
    tag("ht", "St Petersburg's Haymarket, where the novel is set  (A. Brullov)", 640, 640, i=0, d=0.8, out=1),
    ph("r", "klodt", 250, 330, 300, 380, i=0, d=1.2, rot=-3, name="Raskolnikov", role="illustration by M. P. Klodt", nameY=200),
    el("eq", "veq", 800, 250, i=1, d=0.4, size=50, shown=0, parts=[{"text": "1 DEATH"}, {"text": "="}, {"text": "100 LIVES", "bg": YEL}], keys={"2": {"shown": 3, "d": 0.2, "t": 1.4}, "3": {"strikeDraw": 1, "d": 0.4, "t": 0.6}}, strike=0, strikeDraw=0),
    quote("q", "One death, and a hundred lives in exchange\n– it's [[simple arithmetic]]!", 800, 470, "a student in a tavern, Part I, ch. 6", size=28, i=2),
    hl("n", "who counts as the ‘one’?", 820, 640, size=28, i=3, card=False, font="mark", color=RED, weight=400),
    cite(GAR_CP + ", Part I, ch. 6"),

], [
    L("Type one is the man with a formula. Rodion Raskolnikov is a poor ex-student in St Petersburg: proud, hungry, and brilliant."),
    L("In a tavern he overhears a student make the case for killing a cruel old pawnbroker and spending her money on the poor."),
    L("One death, and a hundred lives in exchange. It's simple arithmetic!", who="student"),
    L("It sounds almost noble. The question the arithmetic never asks is who gets to decide which life counts as the one."),
], dash=True, punch={2: [1.1, 160, -40], 3: [1.06, 120, 60]}))

seq.append(scene("p2-table", "cream", [
    ph("nb", "notebook", 1090, 120, 280, 180, i=0, d=0.0, rot=4, name="Dostoevsky's notebook", role="‘The idea of the novel’", nameY=110, out=1),
    el("tb", "vtable", 640, 330, w=980, size=24, shown=0, title="RASKOLNIKOV'S TWO KINDS OF PEOPLE", titleSize=24,
       cols=["", "Ordinary", "Extraordinary"], colW=[200, 360, 420],
       rows=[["Role", "obey the law", "make new law"], ["Morality", "handed down", "decided ‘in conscience’"], ["Blood", "forbidden", "permitted ‘if essential’"], ["Examples", "everyone else", "Lycurgus, Solon, Napoleon"]],
       keys={"0": {"shown": 1.0, "d": 0.6, "t": 0.8}, "1": {"shown": 3, "d": 0.3, "t": 2.0}, "2": {"shown": 4, "d": 0.3, "t": 0.6}}, anim="rise", sfx="paper"),
    ph("np", "napoleon", 1150, 560, 190, 230, i=2, d=0.9, rot=6, name="Napoleon", role="J.-L. David, 1801", nameY=115, out=3),
    hl("f", "The theory doesn't just permit the crime.\nIt [[flatters the man]] who commits it.", 640, 600, size=28, i=3, card="#fff3b0"),

], [
    L("Raskolnikov already has a theory. In a magazine article, he split humanity into two kinds: the ordinary, who must obey, and the extraordinary, who make new laws."),
    L("An extraordinary man, he argues, has an inner right to decide in his own conscience to overstep certain obstacles, if his idea requires it."),
    L("Lycurgus, Solon, Napoleon: by the old law, he says, they were all criminals."),
    L("Notice the trick. The theory doesn't just permit the crime. It flatters the man who commits it."),
], dash=True, zoom=(1.0, 1.03), punch={1: [1.05, 0, 30], 3: [1.06, 0, 160]}))

seq.append(scene("p2-confess", "night", [
    ph("rk", "rask_1881", 250, 330, 280, 360, rot=-3, name="Raskolnikov", role="illustration, 1881", nameY=180, out=1),
    ph("cp", "cp_cover", 290, 330, 270, 380, i=1, rot=3, name="Crime and Punishment", role="first book edition, 1867", nameY=190),
    quote("q1", "I wanted to become a [[Napoleon]],\nthat is why I killed her....", 800, 220, "Raskolnikov to Sonia, Part V, ch. 4", size=34, i=2, dark=True),
    quote("q2", "Did I murder the old woman?\n[[I murdered myself]], not her!", 800, 450, "Part V, ch. 4", size=34, i=3, dark=True),
    hl("m", "MODERN MIRROR: any cause that sorts people into\nthose who [[may]] break the rules and those who [[must]] obey", 640, 645, size=22, i=4, card="#fbf7ee"),
    cite(GAR_CP + ", Part V, ch. 4"),

], [
    L("He kills the pawnbroker with an axe, and then her gentle sister Lizaveta, who walks in at the wrong moment. The formula had no column for her."),
    L("Later, confessing to Sonia, he drops the arithmetic altogether."),
    L("I wanted to become a Napoleon, that is why I killed her.", who="raskolnikov"),
    L("Did I murder the old woman? I murdered myself, not her!", who="raskolnikov"),
    L("It was never about the hundred lives. It was about proving he was the kind of man allowed to take one."),
], zoom=(1.02, 1.0), punch={2: [1.12, 160, -110], 3: [1.12, 160, 80], 4: [1.0, 0, 0]}))

# =============================== part 3: the spite ===============================
seq.append(chapter(3, "Type two", "The rebel\nagainst the plan", "Notes from Underground, 1864", "underground", color="#5b7a5a", photo="crystal", pw=280, ph_=190))

seq.append(scene("p3-palace", "sage", [
    full("cpl", "crystal_in", i=2, dim=0.35, kb=0.12),
    head("nu", "NOTES FROM UNDERGROUND", 780, 340, size=40, bg=INK, color=CREAM, out=1),
    hl("um", "No name. A retired clerk, aged forty.\nHe writes from [[underground]].", 250, 200, size=24, card="#fff3b0", rot=-2, out=1),
    ph("ch", "chern", 230, 360, 270, i=1, d=0.2, name="Nikolay Chernyshevsky", role="What Is to Be Done?, 1863", nameY=170),
    el("mp", "vmap", 0, 0, i=1, d=0.2, size=22, draw=0, keys={"1": {"draw": 0.62, "d": 0.2, "t": 3.0}, "2": {"draw": 1, "d": 2.0, "t": 1.4}},
       nodes=[{"id": "a", "x": 560, "y": 170, "text": "Reason"}, {"id": "b", "x": 900, "y": 170, "text": "your true\ninterest"}, {"id": "c", "x": 1110, "y": 330, "text": "you behave\nwell"},
              {"id": "d", "x": 840, "y": 480, "text": "THE CRYSTAL PALACE", "color": "#cfe6f0", "shape": "box", "size": 26},
              {"id": "e", "x": 520, "y": 590, "text": "human will", "color": RED, "fg": CREAM}],
       edges=[["a", "b"], ["b", "c"], ["c", "d", "", 0.15], ["e", "d", "smash it", -0.15, RED, True]], lsize=26),
    tag("ct", "The Crystal Palace, London, 1851", 1080, 660, i=2, d=0.8),
    cite("Chernyshevsky, What Is to Be Done? (1863); Joseph Frank, Dostoevsky: The Stir of Liberation (1986)", i=1),

], [
    L("Type two is the rebel against the planners. He has no name. He is a bitter retired clerk of forty, and he narrates Notes from Underground."),
    L("Dostoevsky wrote it as an answer to a hugely popular radical novel, Chernyshevsky's What Is to Be Done?, which promised that people who understood their true interest would simply behave well."),
    L("The symbol of that perfectly calculated society was a building of glass and iron, the Crystal Palace. The Underground Man wants to stick his tongue out at it."),
], dash=True, punch={1: [1.04, 60, -40], 2: [1.06, 120, 60]}))

seq.append(scene("p3-quotes", "night", [
    full("pal", "crystal", i=0, dim=0.72, kb=0.08, sfx=None),
    quote("q1", "what do I care for the laws of nature and arithmetic,\nwhen, for some reason I dislike those laws\nand the fact that [[twice two makes four]]?", 640, 190, "Part I, section III", size=28, dark=True),
    quote("q2", "man is a frivolous and incongruous creature,\nand perhaps, like a chess player, loves\nthe [[process of the game]], not the end of it.", 640, 420, "Part I, section IX", size=28, i=1, dark=True),
    hl("p", "people are not [[piano-keys]]", 640, 610, size=32, i=1, d=1.5, card="#fbf7ee", rot=-1),
    cite(GAR_NU + ", Part I, sections III, VII and IX"),

], [
    L("Merciful Heavens! but what do I care for the laws of nature and arithmetic, when, for some reason I dislike those laws and the fact that twice two makes four?", who="underground"),
    L("He is right about the planners. Treat people like piano keys, he says, and they will play a wrong note just to prove they are people."),
], punch={0: [1.1, 0, -150, 0.6], 1: [1.04, 0, 90]}))

seq.append(scene("p3-spite", "cream", [
    el("bars", "vbars", 620, 330, w=420, size=24, shown=0, title="THE UNDERGROUND MAN, MEASURED",
       items=[{"label": "sees through utopias", "v": 0.92, "color": "#5b7a5a"}, {"label": "defends free will", "v": 0.88, "color": "#5b7a5a"}, {"label": "envy and resentment", "v": 0.95, "color": RED}, {"label": "kindness to Liza", "v": 0.06, "color": RED, "note": "he humiliates her"}],
       keys={"0": {"shown": 2, "d": 0.3, "t": 1.4}, "1": {"shown": 4, "d": 0.3, "t": 1.6}}, anim="rise"),
    hl("m", "MODERN MIRROR: the [[utopia]] that forgets freedom,\nand the [[freedom]] that curdles into spite", 640, 620, size=24, i=1, card="#fbf7ee"),
    cite(GAR_NU + ", Part II"),

], [
    L("But look closely at him. The same man is bitter, envious, and cruel to the one person who is kind to him, a young woman named Liza."),
    L("Dostoevsky shows both halves: the utopia that forgets freedom, and the freedom that has curdled into spite. Any modern comment section has plenty of both."),
], dash=True, punch={1: [1.08, 60, 60]}))

# =============================== part 4: the shame machine ===============================
seq.append(chapter(4, "Type three", "The moral\ngatekeepers", "Demons, 1871-72", "pyotr", color="#b0892a", photo="nechayev"))

seq.append(scene("p4-shame", "cream", [
    ph("p", "nechayev", 250, 330, 280, 380, rot=-2, name="Sergey Nechayev", role="the real model for Pyotr", nameY=190,
       alt=[("cut", cut("p", "pyotr", 250, 320, "Pyotr Verkhovensky", "the organiser", w=250, h=300, rot=-2))]),
    el("crowd", "crowdp", 820, 450, n=9, w=620, s=0.8, anim="fade", i=1),
    hl("a", "Recruit with [[shame]], not argument.", 820, 160, size=32, i=1),
    hl("b", "Nobody wants to look [[backward]]\nin front of the others.", 820, 280, size=26, i=1, d=2.4, card="#fff3b0"),
    head("dis", "‘THE RIGHT TO DISHONOUR’", 820, 600, size=36, i=2, bg=RED),
    cite(GAR_DE + ", Part II, chs. 6-7. Full story: LUMEN, 'Demons: The Revolution That Ate Its Own'"),

], [
    L("Type three is what most people mean by moral gatekeepers. Our Demons episode tells the full story; here is just the mechanism."),
    L("Pyotr Verkhovensky builds a revolutionary cell out of provincial idealists, and he recruits them with shame rather than argument."),
    L("Behind the fine words about justice he offers his recruits something more tempting: in a phrase from the novel, the right to dishonour."),
], punch={1: [1.06, 160, -60], 2: [1.1, 170, 150]}))

seq.append(scene("p4-funnel", "ink", [
    el("mp", "vmap", 0, 0, size=23, draw=0, keys={"1": {"draw": 1, "d": 0.2, "t": 5.0}}, arrow=YEL, lcolor=CREAM, out=4,
       nodes=[{"id": "a", "x": 220, "y": 200, "text": "unlimited\nfreedom", "color": CREAM}, {"id": "b", "x": 560, "y": 160, "text": "perfect\nequality", "color": CREAM},
              {"id": "c", "x": 920, "y": 210, "text": "no one may\nstand out", "color": CREAM}, {"id": "dd", "x": 1060, "y": 420, "text": "everyone spies\non everyone", "color": CREAM},
              {"id": "e", "x": 660, "y": 470, "text": "UNLIMITED DESPOTISM", "color": RED, "fg": CREAM, "shape": "box", "size": 30}],
       edges=[["a", "b"], ["b", "c"], ["c", "dd"], ["dd", "e"]]),
    note("sn", "Shigalyov's plan:\none-tenth get unlimited power,\nnine-tenths become a herd", 240, 470, w=400, size=21, rot=3, out=1),
    quote("q", "Starting from [[unlimited freedom]], I arrive at [[unlimited despotism]].", 720, 590, "Shigalyov, Part II, ch. 7", size=24, i=1, card=PAPER, out=4),
    ph("m1", "robespierre", 250, 330, 330, 240, i=4, d=2.0, rot=-4, name="the purge", role="Paris, 1794", nameY=130),
    ph("m2", "liu1967", 640, 360, 330, 250, i=4, d=2.9, rot=2, name="the struggle session", role="Beijing, 1967", nameY=135,
       alt=[("cut", head("m2", "THE STRUGGLE SESSION\nChina, 1966-76", 640, 360, size=26, i=4, d=2.9, bg=CREAM, color=INK, rot=2))]),
    hl("m3", "@everyone: [[look what\nthis person said]]", 1030, 330, size=26, i=4, d=3.9, card="#fbf7ee", rot=-3, font="mark", weight=400),
    head("m3h", "THE ONLINE PILE-ON", 1030, 460, size=24, i=4, d=4.1, bg=YEL, color=INK),
    cite(GAR_DE + ", Part II, chs. 7-8", i=0),

], [
    L("Then there is the theorist, Shigalyov, who reads out his plan for the perfect society and admits the problem himself."),
    L("Starting from unlimited freedom, I arrive at unlimited despotism.", who="shigalyov"),
    L("Pyotr loves it, and explains how it works in practice:"),
    L("Every member of the society spies on the others, and it's his duty to inform against them.", who="pyotr"),
    L("That is the gatekeeper's machine: a group that polices its own members harder than its enemies. Every century since has had its version: the purge, the struggle session, the online pile-on."),
], dash=True, scraps=0, punch={1: [1.06, 60, 120], 3: [1.08, 160, 60], 4: [1.0, 0, 0]}))

# =============================== part 5: the inquisitor ===============================
seq.append(chapter(5, "Type four", "The benevolent\nmaster", "The Brothers Karamazov, 1880", "inquisitor", color="#8a2a2a", photo="inquisitor"))

seq.append(scene("p5-cell", "night", [
    full("ad", "autodafe", i=1, dim=0.55, kb=0.1, out=2) or full("ad", "berruguete", i=1, dim=0.5, kb=0.1, out=2, fy=0.3),
    tag("adt", "An auto-da-fé in Madrid, 1680, painted by Francisco Rizi" if "autodafe" in MAN else "Pedro Berruguete, Saint Dominic presiding over an auto-da-fé, c. 1495", 640, 650, i=1, d=0.8, out=2),
    ph("gi", "inquisitor", 280, 330, 300, 420, rot=-2, name="The Grand Inquisitor", role="El Greco's portrait of Spain's Inquisitor General, c. 1600", nameY=210, roleSize=13, out=1),
    ph("gi2", "inquisitor", 260, 330, 300, 420, i=2, rot=-2, fy=0.25, kb=0.12, sfx=None, anim="fade"),
    quote("q1", "In the end they will lay their freedom\nat our feet, and say to us,\n“[[Make us your slaves, but feed us.]]”", 830, 210, "Book V, ch. 5", size=30, i=3, dark=True),
    quote("q2", "We have corrected Thy work and have founded it\nupon [[miracle, mystery and authority]].", 830, 470, "Book V, ch. 5", size=27, i=4, dark=True),
    cite(GAR_BK + ", Book V, ch. 5, 'The Grand Inquisitor'"),

], [
    L("Type four is the most dangerous, because he is not cynical at all. He is the Grand Inquisitor."),
    L("In The Brothers Karamazov, Ivan invents a story. Christ returns to sixteenth-century Seville, and a cardinal, almost ninety, has Him arrested."),
    L("That night the old man explains. People cannot bear freedom, so the church has quietly taken it from them, for their own good."),
    L("In the end they will lay their freedom at our feet, and say to us, Make us your slaves, but feed us.", who="inquisitor"),
    L("We have corrected Thy work and have founded it upon miracle, mystery and authority.", who="inquisitor"),
], punch={0: [1.08, -280, 0, 0.3], 1: [1.0, 0, 0], 3: [1.1, 180, -110], 4: [1.1, 180, 90]}))

seq.append(scene("p5-table", "cream", [
    el("tb", "vtable", 640, 330, w=1060, size=23, shown=0, title="THE INQUISITOR'S BARGAIN", titleSize=26,
       cols=["He offers", "What you get", "What you give up", "Modern costume"], colW=[200, 270, 260, 330],
       rows=[["Bread", "security", "freedom", "‘obey and you'll be provided for’"], ["Miracle", "proof that it works", "judgement", "spectacle and results"], ["Mystery", "an answer for everything", "questions", "doctrine you may not doubt"], ["Authority", "someone to keep\nyour conscience", "responsibility", "the leader, the party,\nthe consensus"]],
       keys={"0": {"shown": 1, "d": 0.4, "t": 0.8}, "1": {"shown": 4, "d": 0.2, "t": 3.2}}, anim="rise", sfx="paper"),
    hl("m", "Offered by [[every side]], left and right, sacred and secular.", 640, 650, size=26, i=1, card="#fff3b0"),
    cite(GAR_BK + ", Book V, ch. 5"),

], [
    L("Lay out the Inquisitor's offer and it is a trade. You get bread, proof, answers and someone to carry your conscience. You give up freedom, judgement, questions and responsibility."),
    L("Every side of politics offers some version of this bargain, and the people who offer it often mean it."),
], dash=True, zoom=(1.0, 1.03), punch={0: [1.08, -120, -40, 3.5], 1: [1.04, 0, 60]}))

seq.append(scene("p5-morson", "news", [
    quote("q", "The revolutionaries in The Possessed are despicable,\nbut the Inquisitor, on the contrary,\nis [[entirely selfless]].", 640, 250, "Gary Saul Morson, 'Fyodor Dostoevsky: philosopher of freedom', The New Criterion, January 2021", size=34),
    hl("c", "His love has [[contempt]] in it:\nhe believes people are too weak to be free.", 640, 520, size=30, i=1, card="#fff3b0", rot=-1),
    cite("Gary Saul Morson, The New Criterion, vol. 39 no. 5, January 2021"),

], [
    L("The scholar Gary Saul Morson puts it sharply: the revolutionaries in The Possessed are despicable, but the Inquisitor, on the contrary, is entirely selfless."),
    L("He takes our freedom out of love, but his love hides contempt: he believes people are too weak to be free."),
], dash=True, punch={0: [1.08, 0, -80, 1.0], 1: [1.06, 0, 120]}))

# =============================== part 6: the theorist ===============================
seq.append(chapter(6, "Type five", "The theorist\nwho never acts", "The Brothers Karamazov, 1880", "ivan", color="#2443c9", photo="bk_cover"))

seq.append(scene("p6-ticket", "cream", [
    ph("bp", "bk_page", 270, 330, 360, 260, rot=-3, name="The Brothers Karamazov", role="first edition, 1881", nameY=130,
       alt=[("bk_cover", {"w": 260, "h": 360, "nameY": 180}), ("dost_perov", {"w": 280, "h": 350, "name": "Dostoevsky", "role": "painted by Vasily Perov, 1872", "nameY": 175})]),
    hl("iv", "IVAN KARAMAZOV:\nthe brilliant brother", 270, 625, size=24, card="#fff3b0", rot=2, d=1.0),
    quote("q", "It's not God that I don't accept, Alyosha,\nonly I most respectfully\n[[return Him the ticket]].", 820, 270, "Ivan, Book V, ch. 4, 'Rebellion'", size=32, i=2),
    hl("n", "The strongest argument in the novel.\nDostoevsky [[never refutes it]] in debate.", 820, 560, size=26, i=2, d=2.5, card="#fff3b0"),
    cite(GAR_BK + ", Book V, ch. 4, 'Rebellion'"),

], [
    L("Type five never lifts a finger. Ivan Karamazov is the brilliant brother, and his rebellion is the strongest argument in the book."),
    L("He collects newspaper stories of children tortured by adults, and he refuses any heaven that would be built on their suffering."),
    L("It's not God that I don't accept, Alyosha, only I most respectfully return Him the ticket.", who="ivan"),
], dash=True, punch={1: [1.06, -200, 40], 2: [1.12, 180, -60]}))

seq.append(scene("p6-myth", "ink", [
    head("myth", "“IF THERE IS NO GOD,\nEVERYTHING IS PERMITTED”", 640, 220, size=40, bg=None, color=CREAM, sfx="whoosh"),
    {"id": "st", "type": "stampc", "x": 640, "y": 335, "text": "NOT IN THE BOOK", "size": 40, "rot": -6, "in": 1, "d": 0.3, "anim": "none", "sfx": "thump", "vol": 0.6},
    quote("q", "nothing then would be immoral,\n[[everything would be lawful]], even cannibalism.", 640, 480, "Ivan's argument, as reported by Miüsov, Book II, ch. 6", size=32, i=2, card=PAPER),
    cite(GAR_BK + ", Book II, ch. 6"),
], [
    L("But Ivan also has a slogan, and you have probably heard it: If there is no God, everything is permitted."),
    L("Those exact words are not in the novel."),
    L("What the book has is Ivan's argument, reported in a monastery: without belief in immortality, nothing then would be immoral, everything would be lawful, even cannibalism. After that, it travels as a slogan."),
], dash=True, scraps=0))

seq.append(scene("p6-map", "cream", [
    el("mp", "vmap", 0, 0, size=22, draw=0, keys={"0": {"draw": 0.45, "d": 0.3, "t": 2.6}, "1": {"draw": 0.8, "d": 0.2, "t": 2.0}, "3": {"draw": 1, "d": 0.2, "t": 1.0}},
       nodes=[{"id": "a", "x": 200, "y": 170, "text": "no God"}, {"id": "b", "x": 470, "y": 170, "text": "no immortality"}, {"id": "c", "x": 780, "y": 170, "text": "‘all things\nare lawful’", "color": YEL},
              {"id": "iv", "x": 520, "y": 380, "text": "IVAN talks", "color": "#9fb0c8", "shape": "box"}, {"id": "sm", "x": 960, "y": 380, "text": "SMERDYAKOV acts", "color": RED, "fg": CREAM, "shape": "box"},
              {"id": "f", "x": 960, "y": 560, "text": "their father,\nmurdered", "color": INK, "fg": CREAM}],
       edges=[["a", "b"], ["b", "c"], ["c", "iv", "", 0.1], ["iv", "sm", "listens", -0.35], ["sm", "f"]], lsize=24),
    quote("q", "‘all things are lawful.’ That was quite right\nwhat you taught me", 330, 590, "Smerdyakov to Ivan, Book XI, ch. 8", size=24, i=2, card=PAPER),
    cite(GAR_BK + ", Book XI, ch. 8"),
], [
    L("Follow the arrows: no God, no immortality, all things are lawful. Ivan says it to provoke."),
    L("His half-brother Smerdyakov, the family's sullen servant, takes it literally, and murders their father."),
    L("I did dream of it, chiefly because all things are lawful. That was quite right what you taught me, for you talked a lot to me about that.", who="smerdyakov"),
    L("The theorist talks. Someone else acts. And Ivan, appalled, discovers he is not innocent, and breaks down."),
], dash=True, zoom=(1.0, 1.03)))

seq.append(scene("p6-history", "night", [
    full("bas", "bastille", i=0, dim=0.6, kb=0.1),
    el("tb", "vtable", 400, 340, w=520, size=24, shown=0, cols=["Revolution", "Brings"], colW=[220, 300], paper="#f4ecdc",
       rows=[["1789", "Napoleon"], ["1848", "Napoleon III"], ["1917", "Stalin"], ["1920s Italy", "Mussolini"], ["Weimar", "Hitler"]],
       keys={"0": {"shown": 5, "d": 0.6, "t": 3.0}}, anim="rise", sfx="paper"),
    ph("cam", "camus", 1110, 500, 250, i=0, d=0.3, anim="right", out=1, name="Albert Camus", role="The Rebel, 1951", nameY=140),
    quote("q1", "All modern revolutions have ended\nin a [[reinforcement of the power\nof the State]].", 870, 190, "Camus, The Rebel (1951)", size=26, i=0, d=0.4, dark=True, out=1),
    ph("sol", "solzh", 1110, 500, 250, i=1, d=0.2, anim="right", name="Aleksandr Solzhenitsyn", role="survived the Soviet camps", nameY=140),
    quote("q2", "Ideology—that is what gives evildoing\nits [[long-sought justification]] and gives\nthe evildoer the necessary steadfastness\nand determination.", 860, 200, "Solzhenitsyn, The Gulag Archipelago, vol. 1 (1973)", size=23, i=1, d=0.3, dark=True),
    tag("bt", "The storming of the Bastille, 1789", 400, 640, i=0, d=1.0, out=1),
    cite("Camus, The Rebel, trans. Bower; Solzhenitsyn, The Gulag Archipelago 1918-1956, vol. 1, trans. Thomas P. Whitney (1974)"),

], [
    L("In the twentieth century, two writers saw Dostoevsky's pattern in the wreckage. Camus wrote that all modern revolutions have ended in a reinforcement of the power of the State."),
    L("And Aleksandr Solzhenitsyn, who survived the Soviet camps, explained why: ideology, that is what gives evildoing its long-sought justification and gives the evildoer the necessary steadfastness and determination."),
], zoom=(1.02, 1.0), punch={1: [1.06, 200, -40]}))

# =============================== part 7: the lineup and the case against ===============================
seq.append(chapter(7, "Part seven", "The line-up,\nand the case against", "What the five have in common, and where Dostoevsky goes wrong", "dostoevsky", photo="dost_perov"))

seq.append(scene("p7-lineup", "cream", [
    el("tb", "vtable", 640, 320, w=1180, size=21, shown=0, title="THE FIELD GUIDE", titleSize=26,
       cols=["Type", "Loves", "Despises", "Licence", "Who pays"], colW=[250, 200, 210, 280, 240],
       rows=[["The formula\nRaskolnikov", "humanity, in theory", "the ‘ordinary’", "simple arithmetic", "Lizaveta"],
             ["The spite\nUnderground Man", "his own freedom", "everyone", "spite beats reason", "Liza"],
             ["The gatekeepers\nPyotr, Shigalyov", "the cause", "doubters", "equality by spying", "Shatov"],
             ["The master\nGrand Inquisitor", "mankind", "human weakness", "bread for freedom", "everyone's conscience"],
             ["The theorist\nIvan", "justice", "God's world", "all things are lawful", "his father"]],
       keys={"0": {"shown": 5, "d": 0.3, "t": 4.5}, "1": {"hi": 0, "hiDraw": 1, "d": 0.2, "t": 0.1}}, hi=-1, anim="rise", sfx="paper"),
    cite("Summary by LUMEN of the works cited"),
], [
    L("Put the five side by side and the common thread jumps out. Each one loves something large and abstract: humanity, freedom, the cause, mankind, justice."),
    L("Each one holds real, particular people in some contempt. Each has an idea that gives him permission. And in every case, someone else pays."),
], dash=True, zoom=(1.0, 1.02), punch={1: [1.06, 0, -40]}))

seq.append(scene("p7-against", "oxblood", [
    head("h", "THE CASE AGAINST DOSTOEVSKY", 640, 80, size=40, bg=CREAM, color=INK),
    ph("dd", "dost_1879", 1130, 560, 190, i=2, d=0.4, out=3, anim="right", rot=4, name="Dostoevsky", role="monarchist, nationalist", nameY=95, nameSize=17),
    hl("a", "1  [[Caricature.]] Many radicals were brave,\nself-sacrificing, and right about serfdom and censorship.", 640, 200, size=23, i=1),
    hl("b", "2  [[His own politics.]] Monarchist, nationalist, and at times\nantisemitic in A Writer's Diary. His cure was a program too.", 640, 320, size=23, i=2),
    hl("c", "3  [[Rebellion is not the disease.]] Camus:\n‘I rebel – therefore we exist.’", 640, 440, size=23, i=3),
    hl("d", "4  [[He gave the rebels the best lines.]] Bakhtin: ‘a plurality\nof independent and unmerged voices and consciousnesses’", 640, 565, size=21, i=4),
    cite("Morson, 'Why Dostoevsky loved humanity and hated the Jews', Mosaic (2023); Camus, The Rebel, part 1; Bakhtin, Problems of Dostoevsky's Poetics, trans. Caryl Emerson (1984), p. 6"),
], [
    L("Now, the case against Dostoevsky."),
    L("One: caricature. Many radicals of his time were brave and self-sacrificing, and right that serfdom and censorship were worth fighting."),
    L("Two: his own politics. He was a monarchist and a nationalist, and A Writer's Diary contains ugly antisemitic passages. His cure for Russia was a political program too."),
    L("Three: rebellion itself is not the disease. Camus argued that saying no to injustice is how we discover what we share: I rebel, therefore we exist."),
    L("And four: he argued against himself. The critic Mikhail Bakhtin described his novels as a plurality of independent and unmerged voices and consciousnesses. The rebels speak at full strength."),
], scraps=1, punch={1: [1.06, 0, -140], 2: [1.06, 0, -40], 3: [1.06, 0, 80], 4: [1.06, 0, 200]}))

seq.append(scene("p7-shared", "cream", [
    el("bal", "balance", 640, 420, tilt=0, left="wanting justice", right="permission to\nstop seeing people", s=1.0, keys={"0": {"tilt": 0.7, "d": 0.3, "t": 1.4}}, anim="fade"),
    hl("s", "SHARED GROUND", 640, 120, size=30, card=YEL),
    cite("LUMEN"),
], [
    L("Shared ground: the problem was never wanting justice. It's when a cause lets you stop seeing the person in front of you."),
], dash=True))

# =============================== ending ===============================
seq.append(scene("end-plague", "night", [
    full("pg", "petrograd", i=2, dim=0.55, kb=0.12, out=3),
    tag("pgt", "Street violence in Petrograd, July 1917", 640, 650, i=2, d=0.8, out=3),
    el("crowd", "crowdp", 640, 520, n=14, s=0.9, riot=0, keys={"1": {"riot": 1, "d": 0.3, "t": 2.0}}, anim="fade"),
    quote("q", "never had men considered themselves\nso intellectual and so completely\nin [[possession of the truth]]", 640, 190, "Crime and Punishment, Epilogue, ch. 2", size=30, i=1, dark=True, out=3),
    hl("e", "Each thought that [[he alone had the truth]].", 640, 380, size=26, i=2, card="#fbf7ee", out=3),
    cut("so", "sonia", 640, 330, "Sonia", "outside the prison gate", w=230, h=270, i=3, rot=2),
    cite(GAR_CP + ", Epilogue, ch. 2"),
], [
    L("Crime and Punishment ends in Siberia. In the prison hospital, Raskolnikov dreams that a strange plague has swept the world."),
    L("Its victims go mad, yet never had men considered themselves so intellectual and so completely in possession of the truth as these sufferers."),
    L("Each thought that he alone had the truth, and whole towns turn on each other. When Raskolnikov wakes, what saves him is not a better theory."),
    L("It is a person: Sonia, who has followed him to Siberia and waits for him outside the prison gate."),
], zoom=(1.0, 1.06), punch={1: [1.08, 0, -150], 3: [1.1, 0, -10]}))

seq.append(scene("end-zosima", "cream", [
    ph("z", "ambrose", 290, 300, 400, 290, rot=-2, name="Elder Ambrose of Optina", role="a model for Zosima; Dostoevsky visited him in 1878", nameY=150, roleSize=13),
    quote("q", "love in action is a [[harsh and dreadful thing]]\ncompared with love in dreams.", 830, 230, "Zosima, Book II, ch. 4", size=30, i=1),
    hl("d", "Love in dreams: quick, in [[the sight of all]],\napplauded [[as though on the stage]].", 830, 430, size=26, i=2, card="#fff3b0"),
    hl("a", "Active love: [[labor and fortitude]].", 830, 590, size=30, i=3),
    cite(GAR_BK + ", Book II, ch. 4"),

], [
    L("Remember the doctor who loved humanity and hated people? Zosima has advice for exactly that person."),
    L("love in action is a harsh and dreadful thing compared with love in dreams.", who="zosima"),
    L("Love in dreams, he says, wants something quick, in the sight of all, applauded as though on the stage. Sound like anything you scrolled past today?"),
    L("Active love, he says, is labor and fortitude. Unglamorous, one person at a time."),
], dash=True, punch={1: [1.1, 190, -80], 2: [1.08, 190, 70], 3: [1.08, 190, 200]}))

seq.append(scene("end-line", "news", [
    ph("so", "solzh", 220, 330, 300, out=2, name="Solzhenitsyn", role="The Gulag Archipelago", nameY=160),
    quote("q", "the line dividing good and evil cuts through\nthe [[heart of every human being]].", 770, 250, "Aleksandr Solzhenitsyn, The Gulag Archipelago, vol. 1 (1973), trans. Thomas P. Whitney", size=32, out=2),
    note("t", "Do I love the person in front of me,\nor only humanity?\nWho pays for my arithmetic?\nWould my rules still be fair\nif I were the one outside the gate?", 640, 350, i=2, d=0.4, w=760, size=34, speed=7.5, colors=["#1f2d6b", "#1f2d6b", RED, "#1f2d6b", "#1f2d6b"], out=4),
    full("pv", "dost_perov", i=4, dim=0.15, kb=0.08, fy=0.2),
    cite("Solzhenitsyn, The Gulag Archipelago 1918-1956, vol. 1, part I, ch. 4"),

], [
    L("A century later, Solzhenitsyn put Dostoevsky's lesson in one line: the line dividing good and evil cuts through the heart of every human being."),
    L("That is the real warning in these books. Not 'beware of rebels'. Beware the moment you are certain that the line runs between you and them."),
    L("So fold the field guide into three questions. Do I love the person in front of me, or only humanity? Who pays for my arithmetic? Would my rules still be fair if I were the one outside the gate?"),
    L("Ask them of your opponents if you like. Dostoevsky's advice is to ask them of yourself first."),
    beat(2.6, "swell"),
], dash=True, zoom=(1.0, 1.05), punch={1: [1.08, 120, -60], 2: [1.0, 0, 0]}))

CRED = json.load(open(os.path.join(HERE, "assets", "credits.json"))) if os.path.exists(os.path.join(HERE, "assets", "credits.json")) else {}
IMG_CREDITS = []
for k in dict.fromkeys(USED):
    c = CRED.get(k)
    if c:
        IMG_CREDITS.append((c["title"].rsplit(".", 1)[0][:80] + f" ({c['license']})").replace("  ", " "))
seq.append({"type": "card", "id": "end", "style": "cend", "title": "LOVE HUMANITY, HATE PEOPLE", "dur": 24, "credits": [
    "# Dostoevsky (quoted from Constance Garnett's public-domain translations)",
    "The Brothers Karamazov (1880), trans. 1912: Book II ch. 4; Book V chs. 4-5; Book XI chs. 4, 8",
    "Crime and Punishment (1866), trans. 1914: Part I ch. 6; Part III ch. 5; Part V ch. 4; Epilogue ch. 2",
    "Notes from Underground (1864), trans. 1918: Part I sections III, VII, IX",
    "The Possessed / Demons (1871-72), trans. 1916: Part II chs. 6-8",
    "A Writer's Diary (1873), trans. Kenneth Lantz (Northwestern, 1993)",
    "# Scholars and writers",
    "Joseph Frank, 'Inflamed', London Review of Books 15:23 (1993)",
    "Gary Saul Morson, 'Fyodor Dostoevsky: philosopher of freedom', The New Criterion (Jan 2021)",
    "Gary Saul Morson, 'Why Dostoevsky loved humanity and hated the Jews', Mosaic (Dec 2023)",
    "Albert Camus, The Rebel (1951), trans. Anthony Bower",
    "Aleksandr Solzhenitsyn, The Gulag Archipelago, vol. 1 (1973), trans. Thomas P. Whitney",
    "Mikhail Bakhtin, Problems of Dostoevsky's Poetics, trans. Caryl Emerson (1984)",
    "Sean Illing, 'The Logic of Political Murder', Substack (Aug 2025)",
    "N. G. Chernyshevsky, What Is to Be Done? (1863)",
    "# Archival images (Wikimedia Commons)",
    *IMG_CREDITS,
    "# Made with",
    "Kokoro open-weight voices, an original numpy score,",
    "hand-coded SVG collage and diagrams, headless Chromium and ffmpeg",
    "",
    "Real people are shown in archival images; fictional characters are drawn.",
    "Not affiliated with any publisher, channel or estate.",
]})

ep = {
    "meta": {
        "show": "LUMEN", "episode": "Explainer", "title": "Love Humanity, Hate People", "format": "explainer", "look": "collage",
        "category": "Literature: Dostoevsky", "rating": "teen",
        "content_note": "Discusses murder, political violence and terror from the novels and from history. Nothing graphic is shown.",
        "music": "pulse", "trans": "cut", "narrator": "narrator", "fps": 30, "gap": 0.26, "captions": False,
        "logline": "Why do people who set out to free humanity end up despising humans? A diagram-driven explainer on Dostoevsky's five types of rebel (the formula, the spite, the gatekeepers, the benevolent master and the theorist), the modern versions of each, the case against him, and his answer.",
        "source": "Dostoevsky (Garnett translations; A Writer's Diary, trans. Lantz); Joseph Frank; Gary Saul Morson; Albert Camus; Aleksandr Solzhenitsyn; Mikhail Bakhtin; Sean Illing.",
        "disclaimer": "Real people appear in public-domain archival images. Fictional characters are drawn. Not affiliated with any publisher, channel or estate.",
        "width": 1280, "height": 720,
    },
    "cast": {
        "narrator": {"name": "Narrator", "voice": "am_michael:0.6+bm_george:0.4", "speed": 1.14},
        "zosima": {"name": "Zosima", "voice": "bm_lewis", "speed": 0.92},
        "student": {"name": "Student", "voice": "am_puck:0.7+bm_fable:0.3", "speed": 1.05},
        "raskolnikov": {"name": "Raskolnikov", "voice": "bm_daniel", "speed": 0.98},
        "underground": {"name": "Underground Man", "voice": "am_fenrir:0.6+bm_fable:0.4", "speed": 1.02},
        "shigalyov": {"name": "Shigalyov", "voice": "am_onyx", "speed": 0.9},
        "pyotr": {"name": "Pyotr", "voice": "am_puck:0.7+bm_fable:0.3", "speed": 1.08},
        "inquisitor": {"name": "Inquisitor", "voice": "bm_george:0.6+am_onyx:0.4", "speed": 0.88},
        "ivan": {"name": "Ivan", "voice": "bm_fable:0.6+am_michael:0.4", "speed": 0.98},
        "smerdyakov": {"name": "Smerdyakov", "voice": "am_echo", "speed": 0.95},
    },
    "sequence": seq,
}

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "episode.json")
json.dump(ep, open(out, "w"), indent=1, ensure_ascii=False)
words = sum(len(l.get("text", "").split()) for s in seq if s["type"] == "scene" for l in s["lines"])
print(f"wrote {out}: {len(seq)} segments, {words} words of narration")
