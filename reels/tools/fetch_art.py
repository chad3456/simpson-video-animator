#!/usr/bin/env python3
"""Find and download openly licensed Ramayana art from Wikimedia Commons, with credits.

Only public-domain, CC0, CC BY and CC BY-SA files are accepted (no NC/ND, no fair use), so every image can be
used in a reel that is posted publicly. Most of what this finds is centuries-old Indian painting: the Mewar
Ramayana (1649-53), Pahari and Kangra folios, Raja Ravi Varma (d. 1906) oleographs, temple murals.

Usage:
  python3 reels/tools/fetch_art.py search "Rama exile forest painting" [--n 20]
  python3 reels/tools/fetch_art.py get reels/days/<slug>/reel.json   # downloads every reel.art entry, writes credits.json
  python3 reels/tools/fetch_art.py library [key ...]                 # fill the shared cache in reels/library/img
Each art entry is {"lib": "<library key>"} (preferred: cached, no network) or {"file": "File:....jpg"}.
Each art entry is {"file": "File:....jpg"}; optional "crop": [x0,y0,x1,y1] in 0..1 to cut a detail from a folio.
"""
import json, os, re, sys, time, urllib.error, urllib.parse, urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = "RamayanaReels/1.0 (open-source reel generator; contact via repository)"
OK = re.compile(r"^(public domain|pd\b|pd-|cc0|cc[- ]by(-sa)?( |-|$)|cc[- ]by(-sa)? ?\d)", re.I)
BAD = re.compile(r"\b(nc|nd|fair use|non-free)\b", re.I)


def api(**params):
    params.update(format="json", formatversion="2")
    url = API + "?" + urllib.parse.urlencode(params)
    for attempt in range(7):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            return json.load(urllib.request.urlopen(req, timeout=60))
        except Exception as e:  # rate limit or network blip: back off politely
            time.sleep(15 + attempt * 45)
            err = e
    raise err


def strip(html):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html or "")).strip()


def fix_url(u):
    """thumb.wikimedia.org is not always reachable; the same thumbnails are served from upload.wikimedia.org."""
    return u.split("?")[0].replace("https://thumb.wikimedia.org/", "https://upload.wikimedia.org/")


def info(titles, width=1920):  # 1920 is one of the standard thumbnail widths Wikimedia asks bots to use
    d = api(action="query", titles="|".join(titles), prop="imageinfo",
            iiprop="url|extmetadata|size|mime", iiurlwidth=width)
    out = []
    for p in d["query"]["pages"]:
        if "imageinfo" not in p:
            continue
        ii = p["imageinfo"][0]; m = ii.get("extmetadata", {})
        lic = strip(m.get("LicenseShortName", {}).get("value", ""))
        out.append({"file": p["title"], "license": lic,
                    "ok": bool(OK.search(lic)) and not BAD.search(lic),
                    "artist": strip(m.get("Artist", {}).get("value", ""))[:160],
                    "date": strip(m.get("DateTimeOriginal", {}).get("value", ""))[:60],
                    "desc": strip(m.get("ImageDescription", {}).get("value", ""))[:220],
                    "page": ii.get("descriptionurl"), "url": fix_url(ii.get("thumburl") or ii["url"]), "orig": ii["url"],
                    "w": ii.get("width"), "h": ii.get("height"), "mime": ii.get("mime")})
    return out


def thumb_php(file_title, w=1920):
    """Commons' own thumb.php serves standard-size thumbnails from commons.wikimedia.org, which keeps working
    when upload.wikimedia.org throttles this network."""
    name = file_title.split(":", 1)[1].replace(" ", "_")
    return "https://commons.wikimedia.org/w/thumb.php?" + urllib.parse.urlencode({"f": name, "w": w})


def download(url, dst, max_side=2600):
    """Fetch a standard-width (1920px) thumbnail, retry politely on 429, and keep the day's art to a few MB."""
    import io
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    for attempt in range(8):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            data = urllib.request.urlopen(req, timeout=180).read()
            break
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 7:
                raise
            print(f"  Wikimedia asked us to slow down; waiting {60 * (attempt + 1)}s", file=sys.stderr)
            time.sleep(60 * (attempt + 1))
    im = Image.open(io.BytesIO(data)).convert("RGB")
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    im.save(dst, quality=90)
    time.sleep(8)


def search(q, n=20):
    d = api(action="query", list="search", srsearch=q + " filetype:bitmap", srnamespace=6, srlimit=n)
    titles = [s["title"] for s in d["query"]["search"]]
    res = []
    for i in range(0, len(titles), 20):
        res += info(titles[i:i + 20], 500)
    return res


LIB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "library")


def library(only=None):
    """Download every image in reels/library/library.json that is not cached yet, slowly (Wikimedia throttles
    bursts). Daily reels pick from this cache first, so a day's build rarely touches the network."""
    lib = json.load(open(os.path.join(LIB, "library.json"), encoding="utf-8"))
    os.makedirs(os.path.join(LIB, "img"), exist_ok=True)
    changed = False
    for key, e in lib.items():
        if only and key not in only:
            continue
        dst = os.path.join(LIB, "img", key + ".jpg")
        if os.path.exists(dst) and e.get("license"):
            continue
        m = info([e["file"]])
        if not m or not m[0]["ok"]:
            print("skip", key, m[0]["license"] if m else "missing"); continue
        m = m[0]
        if not os.path.exists(dst):
            download(thumb_php(e["file"]), dst)
        e.update({k: m[k] for k in ("artist", "date", "license", "page")}); changed = True
        print("lib", key, m["license"], flush=True)
        json.dump(lib, open(os.path.join(LIB, "library.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return lib


def get(reel_path):
    reel = json.load(open(reel_path, encoding="utf-8"))
    d = os.path.join(os.path.dirname(reel_path), "art")
    os.makedirs(d, exist_ok=True)
    credits = []
    for key, a in reel["art"].items():
        if a.get("kind") == "generated":
            continue
        if a.get("lib"):
            import shutil
            lib = library([a["lib"]]); e = lib[a["lib"]]
            dst = os.path.join(d, key + ".jpg")
            shutil.copy(os.path.join(LIB, "img", a["lib"] + ".jpg"), dst)
            a["path"] = os.path.relpath(dst, os.path.dirname(reel_path))
            credits.append({"key": key, "file": e["file"], "artist": e.get("artist", ""), "date": e.get("date", ""),
                            "license": e.get("license", ""), "page": e.get("page", "")})
            print(f"{key:12s} {e.get('license',''):18s} {e['file']} (library)")
            continue
        meta = info([a["file"]])
        if not meta:
            raise SystemExit(f"not found on Commons: {a['file']}")
        m = meta[0]
        if not m["ok"]:
            raise SystemExit(f"licence not usable for {a['file']}: {m['license']!r}")
        ext = ".jpg"
        dst = os.path.join(d, key + ext)
        if not os.path.exists(dst):
            download(thumb_php(m["file"]), dst)
        a["path"] = os.path.relpath(dst, os.path.dirname(reel_path))
        credits.append({"key": key, "file": m["file"], "artist": m["artist"], "date": m["date"],
                        "license": m["license"], "page": m["page"]})
        print(f"{key:12s} {m['license']:18s} {m['file']}")
    json.dump(credits, open(os.path.join(os.path.dirname(reel_path), "credits.json"), "w"), ensure_ascii=False, indent=1)
    json.dump(reel, open(reel_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    a = sys.argv[1:]
    if not a:
        print(__doc__)
    elif a[0] == "search":
        n = int(a[a.index("--n") + 1]) if "--n" in a else 20
        for r in search(a[1], n):
            print(("OK " if r["ok"] else "-- ") + f"{r['license'][:14]:14s} {r['w']}x{r['h']}  {r['file']}\n      {r['desc'][:150]}")
    elif a[0] == "get":
        get(a[1])
    elif a[0] == "library":
        library(a[1:] or None)
