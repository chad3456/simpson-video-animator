"""Download Wikimedia Commons files by exact title, with licence and author recorded in credits.json.
Usage: python3 fetch_titles.py titles.json <img_dir> <credits.json>   (titles.json maps key -> "File title.jpg")"""
import json, os, re, sys, time, urllib.parse, urllib.request
UA = {"User-Agent": "LumenExplainerBot/1.0 (educational documentary research)"}
SEL, IMG, CRED = json.load(open(sys.argv[1])), sys.argv[2], sys.argv[3]
os.makedirs(IMG, exist_ok=True)
credits = json.load(open(CRED)) if os.path.exists(CRED) else {}

def get(url, timeout=60):
    for k in range(7):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r: return r.read()
        except Exception as e:
            wait = int(getattr(e, "headers", {}).get("retry-after", 0) or 0) if hasattr(e, "headers") and e.headers else 0
            print("  retry", str(e)[:40], flush=True); time.sleep(max(wait, 30 + 30 * k))
    raise RuntimeError("failed " + url)

titles = list(SEL.values())
info = {}
for i in range(0, len(titles), 40):
    q = {"action": "query", "format": "json", "titles": "|".join("File:" + t for t in titles[i:i + 40]), "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": 1400}
    d = json.loads(get("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(q)))
    norm = {n["to"]: n["from"] for n in d["query"].get("normalized", [])}
    for p in d["query"]["pages"].values(): info[norm.get(p["title"], p["title"])] = p
for key, title in SEL.items():
    p = info.get("File:" + title)
    if not p or "imageinfo" not in p: print("MISSING", key, title); continue
    ii = p["imageinfo"][0]; md = ii.get("extmetadata", {})
    # Special:FilePath redirects to a sized thumbnail and is far less rate-limited than the upload host
    url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(title.replace(" ", "_")) + ("?width=1400" if ii["width"] > 1400 or title.lower().endswith((".svg", ".tif", ".tiff")) else "")
    ext = os.path.splitext(title)[1].lower()
    ext = ".png" if ext in (".svg", ".tif", ".tiff", ".png") else ".jpg"
    out = os.path.join(IMG, key + ext)
    if not os.path.exists(out) or os.path.getsize(out) == 0:
        try: data = get(url)
        except RuntimeError as e: print("FAILED", key, e); continue
        open(out, "wb").write(data); time.sleep(45)
    credits[key] = {"file": out, "title": title, "page": ii.get("descriptionurl"), "license": md.get("LicenseShortName", {}).get("value"),
                    "artist": re.sub("<[^>]+>", "", md.get("Artist", {}).get("value", ""))[:150].strip()}
    json.dump(credits, open(CRED, "w"), indent=1, ensure_ascii=False)
    print(key, credits[key]["license"], os.path.getsize(out), flush=True)
