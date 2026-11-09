#!/usr/bin/env python3
"""Beautiful Idiot: screenplay -> voices, score, ambience, SFX, timeline.

Screenplay grammar (episodes/<slug>/screenplay.txt):
  key: value                      header (title, episode, slug, logline, next)
  == OP                           opening titles (30 s, theme)
  == TITLE                        episode title card (5 s)
  == CARD | text=LATER THAT NIGHT | sub=... | dur=3
  == SCENE id | set=room_haru time=night music=haru amb=city weather=rain
  == ED                           ending credits; lines below it are the next-time voice-over
  @ haru x=420 expr=smile look=right s=1      place / update a character for the following shots
  @ haru hide                     remove from the set
  @ prop cactus x=900 y=560 s=1   set dressing for wide/two shots
  BEAT 1.5 [shot] (sfx=pop, act=bounce) {WORD|style}
  WHO (expr, act=faint, sfx=pop, phone, memory, thought, gap=1, pause=0.5) [shot] {WORD|style}: Line.
Shots: wide, two, ext, close:<who>, mcu:<who>, insert:<prop>[:text]. Missing shot: chosen automatically.
Usage: python3 anime/beautiful-idiot/engine/build_episode.py anime/beautiful-idiot/episodes/<slug> [--models ~/models]
"""
import argparse, json, os, re, math, copy
import numpy as np
import soundfile as sf
import importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location("trailer", os.path.join(HERE, "..", "..", "trailer", "build_trailer.py"))
TR = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(TR)
A, SR = TR.A, TR.SR
lp, hp, bp, add, T = TR.lp, TR.hp, TR.bp, TR.add, TR.T

CAST = json.load(open(os.path.join(HERE, "cast.json")))
EXPRS = {"smile", "neutral", "wow", "smirk", "sad", "serious", "laugh", "angry", "swoon"}
FLAGS = {"vo", "phone", "memory", "thought"}
STRONG = {"wow", "angry", "laugh", "swoon", "sad"}
BPM = 120; BEAT = 60 / BPM
GAP = 0.42


def kv_part(part):
    out = {}
    if part.count("=") == 1 and " " in part.split("=", 1)[1]:
        k, v = part.split("=", 1); out[k.strip()] = v.strip(); return out
    for tok in part.split():
        if "=" in tok:
            k, v = tok.split("=", 1); out[k] = v
        else:
            out[tok] = True
    return out


def num(v):
    try: return float(v)
    except (TypeError, ValueError): return v


def parse_opts(s):
    o = {}
    if not s: return o
    for tok in [x.strip() for x in s.split(",") if x.strip()]:
        if "=" in tok:
            k, v = tok.split("=", 1); o[k.strip()] = num(v.strip())
        elif tok in EXPRS: o["expr"] = tok
        elif tok in FLAGS: o[tok] = True
        else: o["act"] = tok
    return o


def parse_words(s):
    if not s: return []
    out = []
    for w in s.split(";"):
        w = w.strip()
        if not w: continue
        text, _, style = w.partition("|")
        out.append({"text": text.strip(), "style": style.strip() or None})
    return out


LINE_RE = re.compile(r"^([A-Z][A-Z0-9_]*)\s*(?:\(([^)]*)\))?\s*(?:\[([^\]]*)\])?\s*(?:\{([^}]*)\})?\s*:\s*(.+)$")
BEAT_RE = re.compile(r"^BEAT\s+([\d.]+)\s*(?:\[([^\]]*)\])?\s*(?:\(([^)]*)\))?\s*(?:\{([^}]*)\})?\s*$")


def parse(path):
    meta, segs = {}, []
    seg = None
    for raw in open(path, encoding="utf-8"):
        line = raw.rstrip("\n").strip()
        if not line or line.startswith("#"): continue
        if seg is None and not line.startswith("==") and ":" in line and not LINE_RE.match(line):
            k, v = line.split(":", 1); meta[k.strip()] = v.strip(); continue
        if line.startswith("=="):
            parts = [p.strip() for p in line[2:].split("|")]
            head = parts[0].split()
            opts = {}
            for p in parts[1:]: opts.update(kv_part(p))
            seg = {"kind": head[0].lower(), "id": head[1] if len(head) > 1 else head[0].lower(), "opts": opts, "items": []}
            segs.append(seg); continue
        if line.startswith("@"):
            toks = line[1:].split()
            if toks[0] == "prop":
                o = {k: num(v) for k, v in kv_part(" ".join(toks[2:])).items()}
                seg["items"].append({"type": "prop", "name": toks[1], **o})
            else:
                o = {k: num(v) for k, v in kv_part(" ".join(toks[1:])).items()}
                seg["items"].append({"type": "place", "who": toks[0].lower(), "o": o})
            continue
        m = BEAT_RE.match(line)
        if m:
            seg["items"].append({"type": "beat", "dur": float(m.group(1)), "shot": m.group(2), "o": parse_opts(m.group(3)), "words": parse_words(m.group(4))})
            continue
        m = LINE_RE.match(line)
        if m:
            who = m.group(1).lower()
            if who not in CAST: raise SystemExit(f"unknown speaker {who}: {line}")
            seg["items"].append({"type": "line", "who": who, "o": parse_opts(m.group(2)), "shot": m.group(3), "words": parse_words(m.group(4)), "text": m.group(5).strip()})
            continue
        raise SystemExit(f"cannot parse: {line}")
    return meta, segs


def say_text(t):
    # strip stage asides in *asterisks* from what is voiced
    return re.sub(r"\*[^*]*\*", "", t).replace("  ", " ").strip()


# ---------------- ambience ----------------
def amb_bed(name, dur, seed=1):
    r = np.random.default_rng(seed); n = int(dur * SR); t = np.arange(n) / SR
    if name == "city":
        s = lp(r.standard_normal(n), 380) * 0.5 + hp(lp(r.standard_normal(n), 2500), 600) * 0.05
        for c in r.uniform(0, dur, int(dur / 9)):
            i = int(c * SR); m = min(int(0.5 * SR), n - i); tt = np.arange(m) / SR
            s[i:i + m] += np.sin(2 * np.pi * 420 * tt) * np.exp(-tt / 0.25) * 0.08 * (np.sin(2 * np.pi * 3 * tt) > 0)
        return s * 0.6
    if name == "sea":
        sw = 0.5 + 0.5 * np.sin(2 * np.pi * t / 6.5)
        return lp(r.standard_normal(n), 900) * (0.25 + 0.75 * sw) * 0.55
    if name == "night":
        s = lp(r.standard_normal(n), 300) * 0.25
        for c in np.arange(0, dur, 0.9):
            if r.random() < 0.7:
                i = int(c * SR); m = min(int(0.18 * SR), n - i); tt = np.arange(m) / SR
                s[i:i + m] += np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 40 * tt) > 0) * np.exp(-tt / 0.08) * 0.05
        return s
    if name == "rain":
        return hp(r.standard_normal(n), 1200) * 0.18 + lp(r.standard_normal(n), 500) * 0.2
    if name in ("party", "cafe"):
        s = A.sfx_murmur(); s = np.tile(s, int(math.ceil(n / len(s))) + 1)[:n]
        return lp(s, 2500) * (0.9 if name == "party" else 0.55)
    if name == "room":
        return lp(r.standard_normal(n), 200) * 0.12
    return np.zeros(n)


def fx(name):
    try: return TR.sfx(name)
    except KeyError: pass
    table = {"chime": A.sfx_chime, "tick": A.sfx_tick, "swell": A.sfx_swell, "thump": A.sfx_thump, "sparkle": A.sfx_sparkle,
             "heart": A.sfx_heart, "bell": A.sfx_bell, "paper": A.sfx_paper, "type": A.sfx_type, "sting": A.sfx_sting}
    if name in table: return table[name]()
    if name == "door":
        t = T(0.4); return TR.mixs(TR.lp(np.random.default_rng(3).standard_normal(len(t)), 300) * np.exp(-t / 0.05), TR.bell(76, 0.6, 0.5))
    if name == "phone":
        out = np.zeros(int(1.6 * SR))
        for k in range(4): add(out, TR.bell(88, 0.25, 0.8) + TR.bell(84, 0.25, 0.5), k * 0.12 + (0.6 if k > 1 else 0))
        return out
    if name == "horn":
        t = T(0.6); return np.tanh(np.sin(2 * np.pi * 440 * t) * 2 + np.sin(2 * np.pi * 554 * t) * 2) * 0.2 * np.minimum(1, (0.6 - t) / 0.05)
    if name == "ferry":
        t = T(2.2); return np.tanh(np.sin(2 * np.pi * 110 * t) * 3) * 0.3 * np.minimum(1, t / 0.2) * np.clip((2.2 - t) / 0.4, 0, 1)
    if name == "splash":
        t = T(0.8); return TR.lp(np.random.default_rng(5).standard_normal(len(t)), 2000) * np.exp(-t / 0.2)
    raise KeyError(name)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dir")
    ap.add_argument("--models", default=os.environ.get("KOKORO_MODELS", os.path.expanduser("~/models")))
    ap.add_argument("--dry", action="store_true", help="parse and estimate only")
    args = ap.parse_args()
    meta, segs = parse(os.path.join(args.dir, "screenplay.txt"))

    words = sum(len(say_text(it["text"]).split()) for s in segs for it in s["items"] if it["type"] == "line")
    beats = sum(it["dur"] for s in segs for it in s["items"] if it["type"] == "beat")
    nlines = sum(1 for s in segs for it in s["items"] if it["type"] == "line")
    print(f"{nlines} lines, {words} words, {beats:.0f}s beats, estimate {words * 0.40 + nlines * GAP + beats + 30 + 5 + 30:.0f}s")
    if args.dry: return

    from kokoro_onnx import Kokoro
    kokoro = Kokoro(os.path.join(args.models, "kokoro-v1.0.int8.onnx"), os.path.join(args.models, "voices-v1.0.bin"))
    cache = os.path.join(args.dir, ".voice-cache"); os.makedirs(cache, exist_ok=True)

    out_segs, shots, lines, sfx_list, ambs = [], [], [], [], []
    t = 0.0
    for si, sg in enumerate(segs):
        k, o = sg["kind"], sg["opts"]
        place, props = {}, []
        seg = {"kind": k, "id": sg["id"], "start": round(t, 3), "music": o.get("music"), "opts": o}
        cur = 0.0
        if k == "op":
            seg["music"] = "full"; dur = 30.0; seg["sfx_at"] = None
        elif k == "title":
            seg["music"] = "stop"; dur = 5.0; sfx_list.append({"name": "hit", "t": round(t + 0.05, 3)})
        elif k == "card":
            seg["music"] = o.get("music", "fill"); dur = float(o.get("dur", 3)); sfx_list.append({"name": "whoosh", "t": round(t + 0.05, 3)})
        else:
            cur = 0.5 if k == "scene" else 2.5
            seg["music"] = o.get("music", "soft" if k == "ed" else "haru")
        n_line = 0
        for it in sg["items"]:
            if it["type"] == "place":
                if it["o"].get("hide"): place.pop(it["who"], None)
                else: place.setdefault(it["who"], {}).update({kk: vv for kk, vv in it["o"].items()})
                continue
            if it["type"] == "prop":
                props.append({kk: vv for kk, vv in it.items() if kk != "type"}); continue
            oo = it["o"]
            if it["type"] == "beat":
                d = it["dur"]; who = None; text = None
            else:
                who = it["who"]; c = CAST[who]
                txt = say_text(it["text"])
                sig = A.speak(kokoro, txt, c["voice"], c.get("speed", 1.0), cache)
                d = len(sig) / SR
                if who in place and oo.get("expr"): place[who]["expr"] = oo["expr"]
            shot = it.get("shot")
            if not shot:
                if who is None: shot = "wide" if len(place) else "ext"
                elif who in ("narr",): shot = "wide" if place else "ext"
                elif oo.get("phone") or who not in place: shot = f"close:{who}"
                elif len(place) >= 2 and (n_line % 3 == 0) and oo.get("expr") not in STRONG: shot = "two"
                else: shot = f"close:{who}"
            if who: n_line += 1
            start = t + cur
            sh = {"seg": si, "start": round(start, 3), "dur": 0, "shot": shot, "who": who, "o": oo,
                  "words": [dict(w, t=round(d * 0.55 if who else min(0.3, d * 0.2), 3)) for w in it["words"]],
                  "place": copy.deepcopy(place), "props": copy.deepcopy(props), "text": it.get("text")}
            if who:
                lines.append({"who": who, "text": it["text"], "start": round(start, 3), "dur": round(d, 3), "env": A.envelope(sig, d),
                              "flags": [f for f in FLAGS if oo.get(f)], "sig": sig, "seg": si})
            if oo.get("sfx"):
                for nm in str(oo["sfx"]).split("+"): sfx_list.append({"name": nm, "t": round(start + (0 if it["type"] == "beat" else 0.0), 3)})
            hold = d + (oo.get("gap", GAP) if who else 0) + oo.get("pause", 0)
            sh["dur"] = round(hold, 3)
            shots.append(sh)
            cur += hold
        if k in ("scene", "ed"):
            dur = cur + (0.4 if k == "scene" else 3.0)
            if k == "ed": dur = max(dur, 26.0)
            dur = math.ceil(dur / BEAT - 1e-6) * BEAT
            # stretch the last shot to the scene end
            mine = [s for s in shots if s["seg"] == si]
            if mine: mine[-1]["dur"] = round(t + dur - mine[-1]["start"], 3)
            if not mine: shots.append({"seg": si, "start": round(t, 3), "dur": dur, "shot": "ext", "who": None, "o": {}, "words": [], "place": {}, "props": []})
        seg["dur"] = round(dur, 3)
        if o.get("amb"):
            for a_ in str(o["amb"]).split(","): ambs.append((a_, t, dur))
        out_segs.append(seg)
        t += dur
    total = t
    print(f"total {total:.1f}s ({total / 60:.1f} min), {len(shots)} shots")

    # ---- mix ----
    music = TR.music_track([{"start": s["start"], "dur": s["dur"], "music": s["music"] or "soft"} for s in out_segs], total, BPM)
    n = int((total + 0.3) * SR)
    voice = np.zeros(n); fxb = np.zeros(n); amb = np.zeros(n)
    for L in lines:
        s = hp(L["sig"], 90)
        if "phone" in L["flags"]: s = bp(s, 350, 3400) * 1.6
        if "memory" in L["flags"]: s = lp(s, 3000); s = s + np.concatenate([np.zeros(int(0.09 * SR)), s[:-int(0.09 * SR)]]) * 0.35
        if "thought" in L["flags"]: s = lp(s, 4200) * 0.85
        if L["who"] == "narr": s = np.tanh(lp(s, 9000) * 1.3) * 0.9
        add(voice, s / max(1e-6, np.abs(s).max()) * 0.78, L["start"])
    for f in sfx_list:
        s = fx(f["name"]); add(fxb, s / max(1e-6, np.abs(s).max()) * 0.5, f["t"])
    for i, (name, st, d) in enumerate(ambs):
        s = amb_bed(name, d, seed=i + 3); fade = np.minimum(1, np.minimum(np.arange(len(s)), len(s) - np.arange(len(s))) / (0.4 * SR))
        add(amb, s * fade, st)
    music = music[:n]
    env = np.convolve(np.abs(voice), np.ones(int(0.15 * SR)) / int(0.15 * SR), mode="same")
    env = np.clip(env / 0.07, 0, 1)
    mus = music / max(1e-6, np.sqrt(np.mean(music ** 2))) * 0.075
    amb = amb / max(1e-6, np.sqrt(np.mean(amb ** 2))) * 0.03 if amb.any() else amb
    mix = mus * (1 - 0.68 * env) + voice + fxb * 0.75 + amb * (1 - 0.4 * env)
    fo = int(1.5 * SR); mix[-fo:] *= np.linspace(1, 0, fo)
    mix = np.tanh(mix * 1.15) / np.tanh(1.15)
    mix *= 0.89 / max(1e-6, np.abs(mix).max())
    sf.write(os.path.join(args.dir, "episode.wav"), np.stack([mix, mix], 1), SR)

    tl = {"total": round(total, 3), "meta": meta, "segs": out_segs, "shots": shots,
          "lines": [{k2: v for k2, v in L.items() if k2 != "sig"} for L in lines], "sfx": sfx_list, "names": {k2: v["name"] for k2, v in CAST.items()}}
    json.dump(tl, open(os.path.join(args.dir, "timeline.json"), "w"))
    json.dump({"meta": {"fps": 24, **meta}}, open(os.path.join(args.dir, "episode.json"), "w"), indent=1)
    print("wrote episode.wav, timeline.json")


if __name__ == "__main__":
    main()
