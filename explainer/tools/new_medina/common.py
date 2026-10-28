"""Shared helpers for the "Creating a New Medina" documentary series (LUMEN, cinema look).
Each eNN.py builds explainer/episodes/<slug>/episode.json; run it with python3, then follow explainer/SKILL.md section 5."""
import json, os, zlib

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "episodes")
SERIES = "Creating a New Medina"
CATEGORY = "Creating a New Medina (book)"
BOOK = "Venkat Dhulipala, Creating a New Medina: State Power, Islam, and the Quest for Pakistan in Late Colonial North India (Cambridge University Press, 2015)"
DISCLAIMER = ("Original animation and music. Narration paraphrases the book; short quotations are attributed. "
              "Maps use modern outlines from Natural Earth (public domain) and are approximate for the 1940s. "
              "Not affiliated with the author or publisher.")
CAST = {"narrator": {"name": "Narrator", "role": "Measured, grave documentary voice",
                     "voice": "bm_george:0.55+am_onyx:0.45", "speed": 0.93}}

RED, GOLD, JADE, SKY, AMBER, BONE = "#d7263d", "#d9b26a", "#5fbf9a", "#7fb2d9", "#e3a857", "#f4ecdc"

# Pronunciations for the voice; the script keeps the correct spelling.
SAY = {
    "Dhulipala": "Doo-lee-paa-la", "Qaid-i-Azam": "Kaa-id-ee-Aa-zam", "ulama": "oo-la-maa", "Deobandi": "Day-oh-bun-dee",
    "Deoband": "Day-oh-bund", "Madani": "Ma-da-nee", "Usmani": "Oos-maa-nee", "Thanawi": "Tha-naa-vee",
    "Khaliquzzaman": "Kha-leek-uz-za-maan", "Mawdudi": "Mow-doo-dee", "Jamiatul Ulama-i-Hind": "Jam-ee-at ul Oo-la-maa ee Hind",
    "Jamiatul Ulama-i-Islam": "Jam-ee-at ul Oo-la-maa ee Islam", "Muttahida Qaumiyat": "Mut-ta-hee-da Kow-mee-yut",
    "Jaffrelot": "Zhaf-ruh-low", "Riyasat-e-Madina": "Ree-yaa-sut ay Madeena", "Shaikhul Islam": "Shaikh ul Islam",
    "Gyanendra Pandey": "Gyaa-nen-dra Paan-day", "qasbahs": "kus-bahs", "Sulaiman Nadwi": "Su-lay-maan Nud-vee",
    "Shabbir Ahmad": "Shub-beer Ah-mud", "Husain Ahmad": "Hu-sain Ah-mud", "Ashraf Ali": "Ush-ruf Ali",
    "Abdullah Haroon": "Ab-dul-la Haa-roon", "Liaquat": "Lee-aa-kut", "Ambedkar": "Um-bayd-kar", "Rajagopalachari": "Raa-ja-go-paa-la-chaa-ree",
    "Harijan": "Ha-ree-jun", "Kurzgesagt": "Kurts-geh-zahgt", "Mahatma": "Ma-haat-ma", "Medina": "Madeena", "Seoharvi": "Say-oh-haar-vee",
    "Manglori": "Mung-lo-ree", "Bijnor": "Bij-nor", "Aligarh": "Ali-gur", "Lucknow": "Luck-now", "Tehrik": "Teh-reek", "Altaf Husain": "Al-taaf Hu-sain",
    "Mohajir": "Mo-haa-jir", "muhajir": "mo-haa-jir", "Sajjad": "Saj-jaad", "Sindh": "Sind", "Iqbal": "Ik-baal",
}

def say(text):
    out = text
    for k in sorted(SAY, key=len, reverse=True):
        out = out.replace(k, SAY[k])
    return out

def L(text, **kw):
    """A narration line; adds a phonetic 'say' only when needed."""
    d = {"text": text}
    s = say(text)
    if s != text:
        d["say"] = s
    d.update(kw)
    return d

def beat(dur=1.6, sfx=None):
    d = {"text": "", "dur": dur}
    if sfx:
        d["sfx"] = sfx
    return d

def scene(id, bg, els, lines, cam=None, pal="ink"):
    if isinstance(bg, str):
        bg = {"kind": bg, "pal": pal}
    return {"type": "scene", "id": id, "bg": bg, "cam": cam or {"zoom": [1.0, 1.05], "pan": [[0, 0], [12, -4]]}, "els": els, "lines": lines}

def chapter(id, n, title, year=None, color=RED, dur=4.2):
    words = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"]
    c = {"type": "card", "id": id, "style": "chapterx", "kicker": f"Chapter {words[n - 1]}", "title": title, "color": color, "dur": dur, "sfx": "boom"}
    if year:
        c["year"] = year
    return c

def cite(text, line=0, d=0.4, prefix="Source: "):
    return {"id": "src" + str(zlib.crc32(text.encode()) % 100000), "type": "cite", "x": 640, "y": 700, "text": text, "in": line, "d": d, "anim": "fade", "prefix": prefix}

def slate(text, line=0, d=0.2):
    return {"id": "slate", "type": "slate", "x": 0, "y": 0, "text": text, "in": line, "d": d, "anim": "none"}

def write(slug, ep):
    d = os.path.join(ROOT, slug)
    os.makedirs(d, exist_ok=True)
    seen = set()
    for seg in ep["sequence"]:
        assert seg["id"] not in seen, seg["id"]
        seen.add(seg["id"])
        if seg["type"] == "scene":
            ids = [e["id"] for e in seg["els"]]
            assert len(ids) == len(set(ids)), (seg["id"], ids)
            for e in seg["els"]:
                for k in ("in", "out"):
                    if k in e:
                        assert e[k] <= len(seg["lines"]), (seg["id"], e["id"], k)
    with open(os.path.join(d, "episode.json"), "w") as f:
        json.dump(ep, f, ensure_ascii=False, indent=1)
    words = sum(len(l.get("text", "").split()) for s in ep["sequence"] if s["type"] == "scene" for l in s["lines"])
    print(f"wrote {slug}/episode.json: {len(ep['sequence'])} segments, {words} narrated words (~{words / 2.3 / 60:.1f} min of speech)")


# ---------- element shorthands ----------
def tome(id, x, y, title, author, color, line=0, d=0.3, w=170, h=230, **kw):
    e = {"id": id, "type": "tome", "x": x, "y": y, "w": w, "h": h, "title": title, "author": author, "color": color, "in": line, "d": d, "anim": "rise"}
    e.update(kw)
    return e

def typer(id, x, y, text, line=0, d=0.3, size=30, font="type", color=BONE, **kw):
    e = {"id": id, "type": "typer", "x": x, "y": y, "text": text, "in": line, "d": d, "size": size, "font": font, "color": color, "anim": "none"}
    e.update(kw)
    return e

def verdict(id, x, y, claim, level, by=None, line=0, d=0.4, w=580, **kw):
    e = {"id": id, "type": "verdict", "x": x, "y": y, "w": w, "claim": claim, "level": level, "in": line, "d": d, "anim": "rise", "on": 0,
         "keys": {str(line): {"on": 1, "d": d + 0.9, "t": 0.8}}}
    if by:
        e["by"] = by
    e.update(kw)
    return e

def dossier(id, x, y, name, role, years, line=0, d=0.3, **kw):
    e = {"id": id, "type": "dossier", "x": x, "y": y, "name": name, "role": role, "years": years, "in": line, "d": d, "anim": "drop", "sfx": "shutter", "vol": 0.5}
    e.update(kw)
    return e

def label(id, x, y, text, line=0, d=0.3, color=GOLD, **kw):
    e = {"id": id, "type": "typer", "x": x, "y": y, "text": text, "in": line, "d": d, "size": 20, "font": "type", "color": color, "anim": "fade", "cursor": False, "cps": 40}
    e.update(kw)
    return e

def doc(id, x, y, title, meta, lines, line=0, d=0.3, w=440, h=None, **kw):
    e = {"id": id, "type": "doc", "x": x, "y": y, "w": w, "h": h or (150 + 26 * len(lines)), "title": title, "meta": meta, "lines": lines, "in": line, "d": d,
         "anim": "rise", "cps": 30}
    e.update(kw)
    return e

def quote(id, x, y, text, by, line=0, d=0.3, size=28, w=640, **kw):
    e = {"id": id, "type": "cquote", "x": x, "y": y, "w": w, "size": size, "text": text, "by": by, "in": line, "d": d, "anim": "fade"}
    e.update(kw)
    return e

def credits_block(extra_sources, extra_scholars):
    return ["# Based on", "Creating a New Medina: State Power, Islam, and the Quest for Pakistan", "in Late Colonial North India",
            "by Venkat Dhulipala (Cambridge University Press, 2015)", "Narration paraphrases the book. Short quotations are attributed.", "",
            "# Archival sources as cited in the book"] + extra_sources + ["", "# Scholarship and reviews"] + extra_scholars + [
            "", "# Maps", "Natural Earth 1:50m (public domain), modern outlines, approximate for the 1940s", "",
            "# Images", "All imagery is original vector illustration.", "Portraits are generic silhouettes, not likenesses.",
            "Newspapers and documents are reconstructions, not facsimiles.", "",
            "# Voice and music", "Kokoro open-weight TTS (Apache-2.0), blended original voice", "Original score synthesised in numpy: tanpura drone, low strings", "",
            "# Type", "Playfair Display, Bebas Neue (SIL OFL) · Special Elite (Apache-2.0) · Nunito (SIL OFL)", "",
            "LUMEN · original animation · not affiliated with the author or publisher"]

def meta(ep_no, title, logline, source, extra=None):
    m = {"show": "LUMEN", "episode": f"E{ep_no}", "title": title, "series": SERIES, "format": "documentary", "look": "cinema", "category": CATEGORY,
         "rating": "mature", "content_note": "Discusses the partition of India, communal politics and historical rhetoric about minorities. No graphic imagery.",
         "music": "cinema", "narrator": "narrator", "fps": 30, "gap": 0.5, "captions": False, "width": 1280, "height": 720,
         "logline": logline, "source": source, "disclaimer": DISCLAIMER}
    m.update(extra or {})
    return m

def next_card(n, title, sub, line_text):
    return scene("next", "void", [
        typer("nx", 640, 260, "NEXT", 0, 0.2, size=28, font="bebas", color=RED, ls=12, cursor=False, cps=8),
        typer("nt", 640, 340, f"Episode {n} · {title}", 0, 0.8, size=38, font="serif", weight=700, color=BONE, cursor=False, cps=24),
        typer("ny", 640, 410, sub, 0, 2.4, size=20, color="#b8a888", cursor=False),
    ], [L(line_text)], pal="ink")
