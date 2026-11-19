import json, time, urllib.request, urllib.parse, os, sys
UA = {"User-Agent": "LumenExplainerBot/1.0 (educational documentary research; contact via project owner)"}
SEL = {
 "dost_perov": "Vasily Perov - Портрет Ф.М.Достоевского - Google Art Project.jpg",
 "dost_1879": "Dostoevsky 1879.jpg",
 "dost_1872": "Dostoevsky 1872.jpg",
 "dost_young": "Trutovsky 004.jpg",
 "dost_photo": "Dostoevsky.jpg",
 "notebook": "Page of notebook Dostoevsky.jpg",
 "chern": "AnnenskyNF Chernyshevsky.jpg",
 "crystal": "The Crystal Palace in Hyde Park for Grand International Exhibition of 1851.jpg",
 "crystal_in": "Crystal Palace - interior.jpg",
 "inquisitor": "Cardinal Fernando Niño de Guevara (1541–1609) MET DT854.jpg",
 "ambrose": "Russischer Photograph - Vater Ambrosij, persönlicher Ratgeber prominenter Schriftsteller des späten 19 Jh",
 "camus": "Albert Camus, gagnant de prix Nobel, portrait en buste, posé au bureau, faisant face à gauche, cigarette",
 "solzh": "Aleksandr Solzhenitsyn 1974crop.jpg",
 "napoleon": "Jacques-Louis David - Napoleon Crossing the Alps - Kunsthistorisches Museum.jpg",
 "sennaya": "Alexander Brullov - Sennaya Square - WGA03670.jpg",
 "cp_cover": "Cover of the first edition of Crime and Punishment.jpg",
 "bk_cover": "The Brothers Karamazov first edition cover page.JPG",
 "bk_page": "The Brothers Karamazov page.JPG",
 "nechayev": "Нечаев в 1860-е.png",
 "bastille": "Prise de la Bastille.jpg",
 "petrograd": "19170704 Riot on Nevsky prosp Petrograd.jpg",
 "redguards": "First Red Guards in Petrograd, fall 1917 cropped.jpg",
 "holbein": "Hans Holbein- The Body of the Dead Christ in the Tomb.JPG",
 "klodt": "Klodt Michail Petrovich - Raskolnikov and Marmeladov.jpg",
 "rask_1881": "Raskolnikov i meshanin 1881.jpg",
 "boklevsky": "Raskolnikov by Boklevsky.jpg",
 "autodafe": "Francisco rizi-auto de fe.jpg",
 "berruguete": "Pedro Berruguete Saint Dominic Presiding over an Auto-da-fe 1495.jpg",
 "robespierre": "Execution robespierre, saint just....jpg",
 "liu1967": "1967-07 1967年 批评刘少奇的群众会议.jpg",
 "shanghai1967": "1967-11 1967年 上海海港批斗大会.jpg",
}
# resolve prefixes from search results
allr = {}
for f in ["search1.json", "search2.json", "search3.json", "search4.json"]:
    for v in json.load(open(f)).values():
        for r in v: allr[r["title"][5:]] = r
def api(params):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({**params, "format": "json"})
    for k in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r: return json.load(r)
        except Exception as e: print("retry", e); time.sleep(6 + 5 * k)

import re
credits = json.load(open("credits.json")) if os.path.exists("credits.json") else {}
fulls = {key: next((n for n in allr if n.startswith(t)), t) for key, t in SEL.items()}
d = api({"action": "query", "titles": "|".join("File:" + f for f in fulls.values()), "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": 1280})
norm = {n["to"]: n["from"] for n in d["query"].get("normalized", [])}
info = {}
for p in d["query"]["pages"].values():
    info[norm.get(p["title"], p["title"])] = p
for key, full in fulls.items():
    p = info.get("File:" + full) or next((v for k, v in info.items() if k.startswith("File:" + full[:40])), None)
    if not p or "imageinfo" not in p: print("MISSING", key, full); continue
    ii = p["imageinfo"][0]; md = ii.get("extmetadata", {})
    o = ii["url"].split("?")[0]; parts = o.split("/commons/"); name = o.rsplit("/", 1)[1]
    suf = ".png" if name.lower().endswith((".gif", ".tif", ".tiff")) else ""
    cands = [parts[0] + "/commons/thumb/" + parts[1] + f"/{sw}px-" + name + suf for sw in (1280, 960, 500, 330, 250) if sw < ii["width"]] + [o]
    ext = os.path.splitext(cands[0])[1].lower() or ".jpg"
    out = f"img/{key}{ext}"
    if not any(f.startswith(key + ".") for f in os.listdir("img")):
        got = None
        for url in cands:
            try:
                with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r: open(out, "wb").write(r.read()); got = url; break
            except Exception as e: print("  miss", key, str(e)[:20], url.rsplit("/", 1)[1][:30]); time.sleep(4)
        if not got: print("FAILED", key); continue
        time.sleep(3)
    else:
        out = "img/" + next(f for f in os.listdir("img") if f.startswith(key + "."))
    credits[key] = {"file": out, "title": full, "page": ii.get("descriptionurl"), "license": md.get("LicenseShortName", {}).get("value"),
                    "artist": re.sub("<[^>]+>", "", md.get("Artist", {}).get("value", ""))[:150].strip(), "date": re.sub("<[^>]+>", "", md.get("DateTimeOriginal", {}).get("value", ""))[:60].strip()}
    json.dump(credits, open("credits.json", "w"), indent=1, ensure_ascii=False)
    print(key, credits[key]["license"], os.path.getsize(out) if os.path.exists(out) else 0, flush=True)
