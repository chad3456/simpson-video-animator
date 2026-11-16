#!/usr/bin/env python3
"""Look up, search and verify shlokas of Valmiki's Ramayana.

The corpus in reels/data/valmiki/ is the Sanskrit text of the IIT Kanpur Valmiki Ramayana project
(valmiki.iitk.ac.in), via github.com/bhavykhatri/DharmicData. Every reel quotes a verse by kanda, sarga and
shloka in that numbering, so a viewer can check it on valmiki.iitk.ac.in.

A reel shows the verse in clean, joined (sandhi) Devanagari, which we type ourselves. `verify` makes sure that
text really is the verse at that reference: it compares consonant skeletons with the corpus and fails below
0.72 similarity. Nothing gets rendered unless the verse passes, so no reel can quote an invented shloka.

Usage:
  python3 reels/tools/verse.py get ayodhya 19 33
  python3 reels/tools/verse.py search "चित्त विक्रिया" [--kanda ayodhya]
  python3 reels/tools/verse.py check ayodhya 19 33 "न वनं गन्तुकामस्य ..."
  python3 reels/tools/verse.py verify reels/days/<slug>/reel.json   (or reels/lessons.json: checks every entry)
"""
import difflib, glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data", "valmiki")
KANDAS = {"bala": (1, "balakanda", "Bala Kanda", "बालकाण्ड"),
          "ayodhya": (2, "ayodhyakanda", "Ayodhya Kanda", "अयोध्याकाण्ड"),
          "aranya": (3, "aranyakanda", "Aranya Kanda", "अरण्यकाण्ड"),
          "kishkindha": (4, "kishkindhakanda", "Kishkindha Kanda", "किष्किन्धाकाण्ड"),
          "sundara": (5, "sundarakanda", "Sundara Kanda", "सुन्दरकाण्ड"),
          "yuddha": (6, "yudhhakanda", "Yuddha Kanda", "युद्धकाण्ड"),
          "uttara": (7, "uttarakanda", "Uttara Kanda", "उत्तरकाण्ड")}
THRESHOLD = 0.72
_corpus = None


def corpus():
    global _corpus
    if _corpus is None:
        _corpus = {}
        for f in sorted(glob.glob(os.path.join(DATA, "*.json"))):
            for x in json.load(open(f, encoding="utf-8")):
                _corpus[(x["kaanda"], int(x["sarg"]), int(x["shloka"]))] = x["text"]
    return _corpus


def kanda(k):
    k = k.lower().replace("kanda", "").replace("kaanda", "").strip(" _-")
    if k.isdigit():
        k = next(n for n, v in KANDAS.items() if v[0] == int(k))
    if k not in KANDAS:
        raise SystemExit(f"unknown kanda {k!r}; use one of {', '.join(KANDAS)}")
    return k


def clean(t):
    """Corpus text with its OCR slips fixed (R for ri-matra, stray Latin) and the trailing number removed."""
    t = t.replace("Rष", "ृष").replace("R", "ृ").replace("L", "ल").replace("आ उ", "औ")
    t = re.sub(r"[|।॥]+\s*[\d०-९\-\.\s]+\s*[|।॥]*\s*$", " ॥", t)
    t = re.sub(r"\s*।\s*", " ।\n", t, count=1)
    return re.sub(r"[ \t]+", " ", t).strip()


def get(k, s, n):
    key = (KANDAS[kanda(k)][1], int(s), int(n))
    t = corpus().get(key)
    if t is None:
        raise SystemExit(f"no verse at {k} {s}.{n}")
    return t


SIGNS = re.compile(r"[़ा-्ऀ-ः॑-॔ॢॣ]")


def skeleton(t):
    t = re.sub(r"[^ऀ-ॿ]", "", t)
    t = re.sub(r"[।॥०-९]", "", t)
    t = t.replace("ं", "म").replace("ः", "")
    return SIGNS.sub("", t)


def similarity(a, b):
    return difflib.SequenceMatcher(None, skeleton(a), skeleton(b), autojunk=False).ratio()


def check(k, s, n, display):
    src = get(k, s, n)
    return similarity(src, display), src


def ref(k, s, n, lang="en"):
    v = KANDAS[kanda(k)]
    return f"{v[2]} {s}.{n}" if lang == "en" else f"{v[3]} {s}.{n}"


def verify_entry(v, label=""):
    lines = [v["sanskrit"]] if isinstance(v.get("sanskrit"), str) else v.get("sanskrit", [])
    ok = True
    for i, part in enumerate(v.get("parts") or [v]):
        sc, src = check(part["kanda"], part["sarga"], part["shloka"], part["sanskrit"])
        good = sc >= THRESHOLD
        ok &= good
        print(f"{'OK ' if good else 'BAD'} {sc:.2f}  {label} {ref(part['kanda'], part['sarga'], part['shloka'])}")
        if not good:
            print("   corpus :", clean(src).replace("\n", " "))
            print("   reel   :", part["sanskrit"].replace("\n", " "))
    return ok


def main(a):
    if not a:
        print(__doc__); return
    cmd = a[0]
    if cmd == "get":
        t = get(a[1], a[2], a[3]); print(t); print("--"); print(clean(t))
    elif cmd == "search":
        pat = a[1]; only = kanda(a[a.index("--kanda") + 1]) if "--kanda" in a else None
        sk = skeleton(pat)
        for (kk, s, n), t in corpus().items():
            if only and kk != KANDAS[only][1]:
                continue
            if pat in t or (len(sk) > 9 and sk in skeleton(t)):
                short = next(x for x, v in KANDAS.items() if v[1] == kk)
                print(f"{short} {s} {n} | {clean(t)}".replace("\n", " "))
    elif cmd == "check":
        sc, src = check(a[1], a[2], a[3], a[4]); print(f"{sc:.2f}"); print(clean(src))
        sys.exit(0 if sc >= THRESHOLD else 1)
    elif cmd == "verify":
        d = json.load(open(a[1], encoding="utf-8"))
        items = d["lessons"] if "lessons" in d else [d]
        bad = 0
        for it in items:
            v = it["verse"]
            if not verify_entry(v, it.get("slug", "")):
                bad += 1
        print(f"{len(items) - bad}/{len(items)} verified")
        sys.exit(1 if bad else 0)
    else:
        print(__doc__)


if __name__ == "__main__":
    main(sys.argv[1:])
