#!/usr/bin/env python3
"""Pop-collage trailer: voices, beat-locked score, SFX and timing.

Reads <dir>/trailer.json (cast + shot list), voices every line with Kokoro (shared helper in engine/build_audio.py),
lays the shots on a 120 bpm grid (each shot is rounded up to whole beats so cuts land on the beat), writes an
original retro-pop score shot by shot (modes: intro, haru, nana, soft, riser, stop, fill, montage, drama, full,
title), drops SFX, ducks the music under dialogue and writes:
  <dir>/episode.wav, <dir>/timeline.json, <dir>/episode.json (meta for engine/render.mjs)
Usage: python3 anime/trailer/build_trailer.py anime/trailer/beautiful-idiot [--models ~/models]
"""
import argparse, json, os, math
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt
import importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location("toon_audio", os.path.join(HERE, "..", "..", "engine", "build_audio.py"))
A = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(A)
SR = A.SR
rng = np.random.default_rng(11)
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)

def hp(x, f, order=2):
    return sosfilt(butter(order, f, 'high', fs=SR, output='sos'), x)

def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)

def add(buf, sig, t, g=1.0):
    i = int(round(t * SR))
    if i >= len(buf) or i + len(sig) <= 0: return
    if i < 0: sig, i = sig[-i:], 0
    n = min(len(sig), len(buf) - i)
    buf[i:i + n] += sig[:n] * g

def mixs(*parts):
    n = max(len(p) for p in parts); o = np.zeros(n)
    for p in parts: o[:len(p)] += p
    return o

def T(d):
    return np.arange(int(d * SR)) / SR


# ---------------- drums ----------------
def kick():
    t = T(0.35); f = 48 + 110 * np.exp(-t / 0.035)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16)
    s[:120] += rng.standard_normal(120) * 0.3
    return np.tanh(s * 1.6) * 0.75

def snare():
    t = T(0.25); n = hp(rng.standard_normal(len(t)), 1500) * np.exp(-t / 0.07)
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05)
    return (n * 0.55 + body * 0.4) * 0.8

def clap():
    t = T(0.22); n = bp(rng.standard_normal(len(t)), 900, 5000)
    env = np.exp(-t / 0.06)
    for d in (0.0, 0.011, 0.022):
        env += (t >= d) * np.exp(-np.maximum(t - d, 0) / 0.008) * 0.8
    return n * env * 0.35

def hat(open_=False):
    t = T(0.3 if open_ else 0.06); n = hp(rng.standard_normal(len(t)), 7000)
    return n * np.exp(-t / (0.09 if open_ else 0.018)) * 0.22

def tamb():
    t = T(0.1); n = bp(rng.standard_normal(len(t)), 5000, 11000)
    return n * np.exp(-t / 0.03) * 0.16

def crash_cym():
    t = T(1.8); n = hp(rng.standard_normal(len(t)), 4000)
    return n * np.exp(-t / 0.6) * 0.18

def taiko():
    t = T(0.8); f = 70 + 40 * np.exp(-t / 0.05)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.3)
    s += lp(rng.standard_normal(len(t)), 600) * np.exp(-t / 0.04) * 0.5
    return np.tanh(s * 1.4) * 0.8

DR = {"k": kick(), "s": snare(), "c": clap(), "h": hat(), "o": hat(True), "t": tamb(), "x": crash_cym(), "T": taiko()}


# ---------------- tonal ----------------
def bass(m, d, vel=0.5):
    t = T(d + 0.05); f = hz(m)
    s = sum(np.sin(2 * np.pi * f * k * t) / k ** 1.3 for k in range(1, 7))
    env = np.minimum(1, t / 0.005) * np.exp(-t / 0.5) * np.clip((d + 0.05 - t) / 0.05, 0, 1)
    return lp(s * env, 900) * vel * 0.55

def organ(notes, d, vel=0.5, vib=True):
    t = T(d + 0.08)
    v = 1 + (0.004 * np.sin(2 * np.pi * 6 * t) if vib else 0)
    out = np.zeros(len(t))
    for m in notes:
        ph = 2 * np.pi * hz(m) * np.cumsum(v) / SR
        sq = np.tanh(np.sin(ph) * 3)
        out += sq * 0.6 + np.sin(2 * ph) * 0.3
    env = np.minimum(1, t / 0.01) * np.clip((d + 0.08 - t) / 0.08, 0, 1)
    return lp(out * env, 3000) * vel * 0.09 / max(1, len(notes) ** 0.5)

def pluck(m, d=0.6, vel=0.5, bright=0.6):
    t = T(d); f = hz(m)
    s = sum(np.sin(2 * np.pi * f * k * t) * (bright ** (k - 1)) * np.exp(-t * (3 + k * 2.2)) for k in range(1, 8))
    return s * np.minimum(1, t / 0.002) * vel * 0.2

def bell(m, d=1.6, vel=0.5):
    t = T(d); f = hz(m)
    s = sum(np.sin(2 * np.pi * f * h * t) * a * np.exp(-t / dd) for h, a, dd in ((1, 1, 1.0), (2.76, 0.3, 0.3), (5.4, 0.15, 0.12)))
    return s * np.minimum(1, t / 0.002) * vel * 0.16

def pad(notes, d, vel=0.5):
    t = T(d + 0.6); out = np.zeros(len(t))
    for m in notes:
        for det in (-0.005, 0, 0.005):
            ph = 2 * np.pi * hz(m) * (1 + det) * t
            out += np.sin(ph) + 0.3 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)
    env = np.minimum(1, t / 0.4) * np.clip((d + 0.6 - t) / 0.6, 0, 1)
    return lp(out * env, 2500) * vel * 0.03 / max(1, len(notes) ** 0.5)

def stab(notes, vel=0.6):
    t = T(0.9); out = np.zeros(len(t))
    for m in notes:
        for det in (-0.006, 0.006):
            ph = 2 * np.pi * hz(m) * (1 + det) * t
            out += sum(np.sin(k * ph) / k for k in range(1, 9))
    env = np.minimum(1, t / 0.006) * np.exp(-t / 0.28)
    return lp(out * env, 4500) * vel * 0.05 / max(1, len(notes) ** 0.5)


# chord tables (MIDI roots and triads)
D, Bm, G, Am_, Em, Fs, Gm = 50, 47, 43, 45, 52, 54, 43
def triad(root, minor=False, base=62):
    ns = [root, root + (3 if minor else 4), root + 7]
    return [n + 12 * math.ceil((base - n) / 12) for n in ns]
PROG = {
    "haru":    [(50, 0), (47, 1), (43, 0), (45, 0)],          # D Bm G A
    "montage": [(50, 0), (43, 0), (45, 0), (50, 0)],          # D G A D
    "full":    [(50, 0), (47, 1), (43, 0), (45, 0)],
    "title":   [(50, 0), (47, 1), (43, 0), (45, 0)],
    "nana":    [(47, 1), (43, 0), (52, 1), (54, 0)],          # Bm G Em F#
    "soft":    [(47, 1), (43, 0), (50, 0), (45, 0)],
    "intro":   [(50, 0), (43, 0), (50, 0), (43, 0)],
    "drama":   [(47, 1), (47, 1), (43, 0), (54, 0)],
    "riser":   [(45, 0)], "fill": [(45, 0)], "stop": [(50, 0)],
}


def music_track(shots, total, bpm):
    beat = 60 / bpm; bar = 4 * beat
    out = np.zeros(int((total + 3) * SR))
    nbeats = int(math.ceil(total / beat))
    shot_at = lambda t: next((s for s in shots if s["start"] <= t + 1e-6 < s["start"] + s["dur"]), shots[-1])
    for b in range(nbeats):
        t0 = b * beat
        sh = shot_at(t0); mode = sh["music"]
        bi = b % 4; barn = b // 4
        prog = PROG.get(mode, PROG["haru"])
        root, minor = prog[barn % len(prog)]
        ch = triad(root, minor)
        first_beat_of_shot = abs(t0 - sh["start"]) < 1e-6
        last_beat_of_shot = abs(t0 + beat - (sh["start"] + sh["dur"])) < 1e-6
        if mode in ("haru", "montage", "full", "title"):
            drop_title = mode == "title" and t0 - sh["start"] >= 4 * beat
            if drop_title:
                if abs(t0 - sh["start"] - 4 * beat) < 1e-6:
                    add(out, stab(triad(50) + [38, 74], 0.9), t0); add(out, DR["x"], t0, 1.4); add(out, DR["k"], t0)
                    add(out, pad(triad(50, base=57) + [38], 6.0, 0.9), t0)
                continue
            add(out, DR["k"], t0, 0.9 if bi in (0, 2) else (0.0 if mode == "haru" else 0.6))
            if bi in (1, 3): add(out, DR["s"] if mode != "haru" else DR["c"], t0, 0.8)
            add(out, DR["h"], t0, 0.6); add(out, DR["h"], t0 + beat / 2, 0.9)
            if mode in ("montage", "full", "title"):
                for q in range(4): add(out, DR["t"], t0 + q * beat / 4, 0.7 if q % 2 else 0.4)
            if (mode in ("full", "title")) and bi == 0: add(out, DR["x"], t0, 0.7)
            # bass: root on beat, fifth on the and
            add(out, bass(root - 12 if root > 45 else root, beat * 0.45, 0.6), t0)
            add(out, bass(root - 5 if root > 45 else root + 7, beat * 0.3, 0.45), t0 + beat / 2)
            # chords: uke pluck on the off-beats
            for n in ch: add(out, pluck(n, 0.35, 0.33, 0.5), t0 + beat / 2 + 0.008 * ch.index(n))
            if mode in ("montage", "full", "title"):
                add(out, organ(ch, beat * 0.9, 0.5), t0)
                # lead: a bouncy motif on chord tones
                motif = [ch[2] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 12 + 12 * (bi == 3)]
                add(out, bell(motif[bi], 0.5, 0.45), t0)
                add(out, bell(motif[(bi + 2) % 4], 0.3, 0.25), t0 + beat * 0.75)
            else:
                mot = [ch[0] + 12, ch[2] + 12, ch[1] + 12, ch[2] + 12]
                if bi in (0, 2): add(out, bell(mot[bi], 0.6, 0.35), t0)
                if bi == 3: add(out, bell(mot[1] + 2, 0.3, 0.25), t0 + beat / 2)
        elif mode == "nana":
            add(out, DR["k"], t0, 1.0)
            if bi in (1, 3): add(out, DR["c"], t0, 1.0); add(out, DR["s"], t0, 0.4)
            add(out, DR["o"] if bi == 3 else DR["h"], t0 + beat / 2, 0.8)
            for e in (0, 0.5): add(out, bass(root - 12 + (12 if e else 0), beat * 0.4, 0.6), t0 + e * beat)
            if bi in (0, 2): add(out, organ(ch, beat * 0.35, 0.8), t0)
            if bi == 1: add(out, organ(ch, beat * 0.25, 0.6), t0 + beat * 0.5)
            if bi == 3: add(out, organ([ch[2] + 12], beat * 0.25, 0.7), t0 + beat * 0.75)
        elif mode == "soft":
            if bi == 0: add(out, pad(triad(root, minor, 57), bar, 0.8), t0)
            arp = [ch[0], ch[1], ch[2], ch[1] + 12 if False else ch[0] + 12]
            add(out, bell(arp[bi] + 12, 1.2, 0.28), t0)
            add(out, pluck(arp[(bi + 2) % 4], 0.8, 0.25, 0.4), t0 + beat / 2)
            if bi == 0: add(out, bass(root - 12, bar * 0.9, 0.35), t0)
        elif mode == "intro":
            if bi == 0: add(out, pad(triad(root, minor, 57), bar, 0.7), t0); add(out, DR["k"], t0, 0.6)
            add(out, bell([ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12][bi], 1.0, 0.3), t0)
            add(out, DR["h"], t0 + beat / 2, 0.35)
        elif mode == "drama":
            if bi == 0: add(out, pad(triad(root, minor, 50) + [root - 12], bar, 1.0), t0); add(out, DR["T"], t0, 1.0)
            if bi == 1: add(out, DR["T"], t0 + beat / 2, 0.7)
            if bi == 2: add(out, DR["T"], t0, 0.8); add(out, stab(ch, 0.6), t0)
            if bi == 3: add(out, DR["s"], t0, 0.5); add(out, DR["s"], t0 + beat / 2, 0.7)
            add(out, bass(root - 12, beat * 0.9, 0.5), t0)
        elif mode == "riser":
            # snare roll accelerating + pad
            if first_beat_of_shot:
                add(out, pad(triad(45, False, 57), sh["dur"], 0.7), t0)
            k = (t0 - sh["start"]) / max(sh["dur"], 0.5)
            div = 2 if k < 0.34 else (4 if k < 0.67 else 8)
            for q in range(div): add(out, DR["s"], t0 + q * beat / div, 0.3 + 0.6 * k)
        elif mode == "fill":
            for q in range(4): add(out, DR["s"], t0 + q * beat / 4, 0.5 + 0.12 * q)
            if first_beat_of_shot: add(out, DR["k"], t0)
        elif mode == "stop":
            if first_beat_of_shot: add(out, pad([50, 57, 62], sh["dur"], 0.35), t0)
    return out


# ---------------- SFX ----------------
def sfx(name):
    if name == "stamp":
        t = T(0.3); s = lp(rng.standard_normal(len(t)), 400) * np.exp(-t / 0.05) + np.sin(2 * np.pi * 70 * t) * np.exp(-t / 0.08)
        return s * 0.6
    if name == "pop": return A.sfx_pop() * 0.9
    if name == "ding":
        return bell(88, 1.4, 1.0) + bell(84, 1.4, 0.6)
    if name == "riser": return A.sfx_riser() * 0.6
    if name == "faint":
        t = T(1.1); f = 1400 * np.exp(-t * 1.6) + 200
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * (1 + 0.3 * np.sin(2 * np.pi * 7 * t)) * np.exp(-t / 1.4) * 0.22
        thud = np.zeros(len(t)); k = kick() * 0.9; thud[int(0.85 * SR):int(0.85 * SR) + len(k)] += k[:len(t) - int(0.85 * SR)]
        return s + thud
    if name == "boom": return A.sfx_boom() * 0.9
    if name == "whoosh": return A.sfx_whoosh() * 0.8
    if name == "hit":
        return mixs(stab([50, 57, 62, 66, 74], 1.0) * 2.2, kick() * 0.8, crash_cym() * 0.6)
    if name == "shutter": return A.sfx_shutter() * 0.8
    if name == "crash":
        return mixs(A.sfx_crash() * 0.8, kick() * 0.7, hat(True) * 1.5)
    if name == "fire":
        t = T(2.6); n = lp(rng.standard_normal(len(t)), 1800) * 0.25
        cr = np.zeros(len(t))
        for c in rng.uniform(0, 2.5, 60):
            i = int(c * SR); m = min(200, len(t) - i); cr[i:i + m] += rng.standard_normal(m) * np.exp(-np.arange(m) / 30)
        env = np.minimum(1, t / 0.15) * np.clip((2.6 - t) / 0.8, 0, 1)
        w = A.sfx_whoosh(); w = np.pad(w, (0, max(0, len(t) - len(w))))[:len(t)]
        return (n + cr * 0.4) * env + w * 0.7
    raise KeyError(name)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dir")
    ap.add_argument("--models", default=os.environ.get("KOKORO_MODELS", os.path.expanduser("~/models")))
    args = ap.parse_args()
    spec = json.load(open(os.path.join(args.dir, "trailer.json")))
    meta, cast = spec["meta"], spec["cast"]
    beat = 60 / meta["bpm"]

    from kokoro_onnx import Kokoro
    kokoro = Kokoro(os.path.join(args.models, "kokoro-v1.0.int8.onnx"), os.path.join(args.models, "voices-v1.0.bin"))
    cache = os.path.join(args.dir, ".voice-cache"); os.makedirs(cache, exist_ok=True)

    shots, lines, sfx_list = [], [], []
    t = 0.0
    for si, sh in enumerate(spec["shots"]):
        cur = meta["lead"]; local = []
        for li, ln in enumerate(sh["lines"]):
            who = cast[ln["who"]]
            sig = A.speak(kokoro, ln["text"], who["voice"], who["speed"], cache)
            d = len(sig) / SR
            if "at" in ln: cur = ln["at"]
            elif li: cur += ln.get("gap", meta["gap"])
            local.append({"shot": si, "li": li, "who": ln["who"], "text": ln["text"], "t0": cur, "dur": round(d, 3), "sig": sig})
            cur += d
        need = (cur + meta["tail"] + sh.get("pad", 0)) if local else 0
        dur = max(sh.get("min", 2), need)
        dur = math.ceil(dur / beat - 1e-6) * beat
        shots.append({"id": sh["id"], "start": round(t, 3), "dur": round(dur, 3), "music": sh.get("music", "haru")})
        for L in local:
            L["start"] = round(t + L["t0"], 3); lines.append(L)
        for fx in sh.get("sfx", []):
            if "line" in fx:
                L = local[fx["line"]]; at = L["t0"] + L["dur"] * fx.get("frac", 0) + fx.get("off", 0)
            else:
                at = fx["at"]
            sfx_list.append({"name": fx["name"], "t": round(t + at, 3), "shot": si})
        t += dur
    total = t
    print(f"total {total:.1f}s over {len(shots)} shots")
    for s in shots: print(f"  {s['start']:6.1f} {s['dur']:5.1f} {s['music']:8s} {s['id']}")

    mus = music_track(shots, total, meta["bpm"])
    n = int((total + 0.2) * SR)
    voice = np.zeros(n); fxb = np.zeros(n)
    for L in lines:
        sig = L["sig"]; sig = hp(sig, 90)
        if L["who"] == "narr": sig = np.tanh(lp(sig, 9000) * 1.3) * 0.9
        add(voice, sig / max(1e-6, np.abs(sig).max()) * 0.8, L["start"])
    for fx in sfx_list:
        s = sfx(fx["name"]); add(fxb, s / max(1e-6, np.abs(s).max()) * 0.55, fx["t"])
    mus = mus[:n]
    # ducking: smoothed voice envelope
    env = np.abs(voice); k = int(0.12 * SR)
    env = np.convolve(env, np.ones(k) / k, mode="same")
    env = np.clip(env / 0.08, 0, 1)
    mus_norm = mus / max(1e-6, np.sqrt(np.mean(mus ** 2))) * 0.09
    mix = mus_norm * (1 - 0.6 * env) + voice + fxb * 0.8
    # fade out the last second
    fo = int(1.0 * SR); mix[-fo:] *= np.linspace(1, 0, fo)
    mix = np.tanh(mix * 1.15) / np.tanh(1.15)
    mix *= 0.89 / max(1e-6, np.abs(mix).max())
    sf.write(os.path.join(args.dir, "episode.wav"), np.stack([mix, mix], 1), SR)

    tl = {"total": round(total, 3), "bpm": meta["bpm"], "shots": shots,
          "lines": [{k: v for k, v in L.items() if k not in ("sig", "t0")} | {"env": A.envelope(L["sig"], L["dur"])} for L in lines],
          "sfx": sfx_list, "cast": {k: v["name"] for k, v in cast.items()}}
    json.dump(tl, open(os.path.join(args.dir, "timeline.json"), "w"))
    json.dump({"meta": {"fps": meta["fps"], "title": meta["title"], "slug": meta["slug"], "sub": meta["sub"]}},
              open(os.path.join(args.dir, "episode.json"), "w"), indent=1)
    print("wrote episode.wav, timeline.json, episode.json")


if __name__ == "__main__":
    main()
