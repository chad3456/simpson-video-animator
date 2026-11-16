#!/usr/bin/env python3
"""Voice-over, desi-trap score and SFX for a vertical reel, plus the timing the renderer needs.

Reads reels/days/<slug>/reel.json and writes, next to it:
  reel.wav          the full mix (voice, score, effects), 44.1 kHz stereo
  reel_nomusic.wav  voice and effects only, for posting with a track from Instagram's own music library
  timeline.json     beat start/end, word-level caption timing, the chant, kick/snare hits for zoom pulses

Voice: Kokoro (open-weight, Apache-2.0). The narrator speaks every beat's "vo" phrase by phrase, so phrase
timings are exact; word timings inside a phrase are spread by syllable weight, close enough for kinetic captions.
The verse beat opens with the shloka itself, recited in Sanskrit by a Hindi Kokoro voice in a temple reverb.

Score: all original and synthesised here, so there is nothing to clear and no reel gets muted. A half-time desi
trap groove (808 kick and sub on raga roots, claps, hi-hat rolls) under Indian colour from the Mahagatha engine
(tanpura, tabla, sitar, bansuri, choir, ghanta, shankh). Sections follow the beats: the hook drops hard, the
story rides lighter, the verse strips to drone and bell, the lesson drops again.

Usage: python3 reels/engine/build_audio.py reels/days/<slug>/reel.json [--models ~/models]
"""
import argparse, hashlib, json, os, re, sys
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "mahagatha", "engine"))
import build_audio as mb  # noqa: E402  (raga score, instruments, sfx, reverbs)

SR = mb.SR
place, band, low, high, noise, reverb, T = mb.place, mb.band, mb.low, mb.high, mb.noise, mb.reverb, mb.T

NARRATOR = "af_heart"
CHANTER = "hm_omega"
GAP_PHRASE, GAP_SENTENCE, GAP_BEAT = 0.10, 0.22, 0.30


# ------------------------------------------------------------------ voice ----
def kokoro_say(k, text, voice, speed, lang, cache):
    key = hashlib.sha1(f"{lang}|{voice}|{speed}|{text}".encode()).hexdigest()[:16]
    p = os.path.join(cache, f"v_{key}.wav")
    if os.path.exists(p):
        return sf.read(p)[0]
    if "+" in voice:
        parts = [(v.split(":") + ["1"])[:2] for v in voice.split("+")]
        tot = sum(float(w) for _, w in parts)
        style = sum(k.get_voice_style(n) * float(w) for n, w in parts) / tot
        s, sr = k.create(text, voice=style.astype(np.float32), speed=speed, lang=lang)
    else:
        s, sr = k.create(text, voice=voice, speed=speed, lang=lang)
    nz = np.where(np.abs(s) > 0.01)[0]
    if len(nz):
        s = s[max(0, nz[0] - 300): nz[-1] + 1200]
    s = resample_poly(s, 147, 80)  # 24 kHz -> 44.1 kHz
    sf.write(p, s, SR)
    return s


def phrases(text):
    """Split a line into speakable phrases, keeping the punctuation that decides the pause after each."""
    out = []
    for m in re.finditer(r"[^.!?;:,—…]+[.!?;:,—…]*", text):
        p = m.group(0).strip()
        if p and re.search(r"\w", p):
            out.append(p)
    return out


def syl(w):
    return max(1, len(re.findall(r"[aeiouy]+", w.lower())) + 0.4)


def speakable(t):
    """What the TTS reads: drop emoji and caption markup, spell out a few Gen Z tokens."""
    t = re.sub(r"\*([^*]+)\*", r"\1", t)
    t = re.sub(r"[\U0001F000-\U0001FAFF☀-➿️]", "", t)
    for a, b in ((r"\bPOV\b", "P.O.V."), (r"\bGOAT\b", "goat"), (r"\bW\b", "dub"), (r"\bL\b", "L"), (r"\bfr\b", "for real"),
                 (r"\bngl\b", "not gonna lie"), (r"\bIYKYK\b", "if you know, you know"), (r"\b14\b", "fourteen")):
        t = re.sub(a, b, t)
    return t


# ------------------------------------------------------------------ score ----
def kick808(dur=0.9):
    t = T(dur); f = 42 + 110 * np.exp(-t / 0.035)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.45)
    s += band(noise(len(t), 3), 1500, 6000) * np.exp(-t / 0.004) * 0.3
    return np.tanh(s * 2.2) * 0.8


def sub808(midi, dur):
    t = T(dur + 0.05); f = mb.hz(midi)
    f = f * (1 + 0.25 * np.exp(-t / 0.02))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    env = np.minimum(1, t / 0.004) * np.clip((dur + 0.05 - t) / 0.05, 0, 1) * (0.6 + 0.4 * np.exp(-t / 0.5))
    return np.tanh(s * 1.6) * env * 0.55


def clap():
    n = int(0.35 * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for d in (0, 0.011, 0.022):
        o = int(d * SR); s[o:] += band(noise(n - o, int(d * 1000) + 5), 900, 5000) * np.exp(-t[: n - o] / 0.012)
    s += band(noise(n, 9), 800, 4000) * np.exp(-t / 0.12) * 0.4
    return s * 0.35


def hat(open_=False):
    n = int((0.25 if open_ else 0.06) * SR); t = np.arange(n) / SR
    return high(noise(n, 11), 7000) * np.exp(-t / (0.08 if open_ else 0.012)) * 0.16


def trap(total, bpm, roots, intensity, r):
    """Half-time trap: kick and 808 on the bar's roots, clap on 3, hats with rolls; intensity(t) in 0..1 gates parts."""
    beat = 60 / bpm; bar = 4 * beat
    out = np.zeros(int((total + 2) * SR)); kicks, snares = [], []
    K = kick808(); C = clap(); H = hat(); HO = hat(True)
    b = 0
    while b * bar < total:
        t0 = b * bar; lvl = intensity(t0 + 0.01)
        root = roots[b % len(roots)]
        if lvl >= 0.66:
            for x in ([0, 1.75, 2.5] if b % 2 == 0 else [0, 0.75, 2.5, 3.5]):
                place(out, t0 + x * beat, K, 1.0); kicks.append(round(t0 + x * beat, 3))
            for x, ln in ((0, 1.6), (1.75, 0.7), (2.5, 1.4)):
                place(out, t0 + x * beat, sub808(root, ln * beat), 1.0)
            place(out, t0 + 2 * beat, C, 1.0); snares.append(round(t0 + 2 * beat, 3))
        if lvl >= 0.33:
            x = 0.0
            while x < 4:
                roll = lvl >= 0.66 and r.random() < 0.18
                if roll:
                    n = r.choice([3, 4, 6])
                    for i in range(n):
                        place(out, t0 + (x + i * 0.5 / n) * beat, H, 0.6 + 0.4 * i / n)
                else:
                    place(out, t0 + x * beat, H, 1.0 if x % 1 == 0 else 0.6)
                x += 0.5
            if lvl >= 0.66 and b % 2 == 1:
                place(out, t0 + 3.5 * beat, HO, 0.8)
        b += 1
    return out[: int(total * SR)], kicks, snares


def lead_line(total, bpm, raga, r, intensity, kind="sitar"):
    beat = 60 / bpm; out = np.zeros(int((total + 3) * SR)); t = beat * 2
    while t < total - 2:
        lvl = intensity(t)
        if lvl < 0.33:
            t += beat * 2; continue
        ev = mb.phrase_gen(raga, 2, r, start=int(r.integers(0, 5)), span=(-2, 9), rest_prob=0.2, long_end=False)
        tt = t
        for d, ln in ev:
            if d is not None and tt < total:
                place(out, tt, mb.pluck(mb.deg2midi(raga, d, mb.SA), max(0.4, ln * beat * 0.5 * 1.3), 0.8, kind), 1.0)
            tt += ln * beat * 0.5
        t = tt + beat * int(r.integers(2, 5))
    return out[: int(total * SR)]


def score(total, beats, bpm, raga, seed):
    r = np.random.default_rng(seed)
    level = {"hook": 1.0, "story": 0.5, "twist": 1.0, "verse": 0.0, "lesson": 1.0, "flex": 0.7, "cta": 1.0}

    def intensity(t):
        for b in beats:
            if b["start"] - 0.05 <= t < b["end"]:
                return b.get("music", level.get(b["kind"], 0.6))
        return 0.6

    scale = mb.RAGAS[raga]
    ni = [x for x in scale if x >= 8]
    roots = [mb.SA - 24, mb.SA - 24 + (ni[0] - 12 if ni else -4), mb.SA - 24 + (ni[-1] - 12 if ni else -2), mb.SA - 24]
    drums, kicks, snares = trap(total, bpm, roots, intensity, r)
    drone = mb.tanpura(total)
    tab = mb.tabla(total, "keherwa", bpm / 2, 0.55, seed=seed)
    lead = lead_line(total, bpm, raga, r, intensity)
    choir = np.zeros(int(total * SR))
    for b in beats:
        if b["kind"] == "verse":
            seg = mb.contour_voice([(0, 6), (2, 4), (1, 4), (0, 8)], b["end"] - b["start"], "choir", bpm=40, base=mb.SA - 12, raga=raga, seed=seed)
            place(choir, b["start"], seg, 1.0)
    # gate tabla and drone by section
    env = np.array([intensity(i / 50) for i in range(int(total * 50) + 1)])
    env = np.interp(np.arange(int(total * SR)) / SR, np.arange(len(env)) / 50, env)
    tab_g = np.clip((env - 0.2) * 3, 0, 1)
    drone_g = 0.7 + 0.3 * (env < 0.2)
    mix = np.zeros((int(total * SR), 2))
    mb.place2(mix, 0, drums * 0.9, 1.0, 0.0)
    mb.place2(mix, 0, reverb(tab * tab_g, 0.12, mb.IR_ROOM), 0.8, 0.15)
    mb.place2(mix, 0, drone * drone_g, 1.1, -0.05)
    mb.place2(mix, 0, reverb(lead, 0.3, mb.IR_HALL), 1.4, -0.2)
    mb.place2(mix, 0, reverb(choir * 4, 0.45, mb.IR_TEMPLE), 1.0, 0.15)
    return mix, kicks, snares


# ------------------------------------------------------------------ sfx ------
def riser(d=1.6):
    t = T(d); f = 200 * (12 ** (t / d))
    s = band(noise(len(t), 41), 300, 9000) * (t / d) ** 2 * 0.35 + np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / d) ** 2 * 0.06
    return s


def pop():
    t = T(0.18); f = 900 * np.exp(-t / 0.05) + 500
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.05) * 0.3


def bass_drop():
    t = T(1.6); f = 30 + 80 * np.exp(-t / 0.3)
    return np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * 2) * np.exp(-t / 0.6) * 0.8


def record_scratch():
    t = T(0.45); f = 600 + 1800 * np.sin(np.pi * t / 0.45) ** 2
    return band(noise(len(t), 77), 400, 4000) * np.sin(2 * np.pi * np.cumsum(f) / SR / 40) ** 2 * np.exp(-t / 0.25) * 0.6


SFX = {"whoosh": lambda: mb.sfx_whoosh() * 0.8, "boom": lambda: bass_drop(), "riser": riser, "pop": pop,
       "bell": lambda: mb.ghanta(4.0, 880) * 3, "shankh": lambda: mb.shankh(3.0) * 2.4, "scratch": record_scratch,
       "sparkle": lambda: mb.sfx_sparkle() * 0.7, "thunder": lambda: mb.sfx_thunder() * 0.5}


# ------------------------------------------------------------------ main -----
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("reel")
    ap.add_argument("--models", default=os.path.expanduser("~/models"))
    a = ap.parse_args()
    reel_dir = os.path.dirname(os.path.abspath(a.reel))
    reel = json.load(open(a.reel, encoding="utf-8"))
    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(a.models, "kokoro-v1.0.int8.onnx"), os.path.join(a.models, "voices-v1.0.bin"))
    cache = os.path.join(reel_dir, ".cache"); os.makedirs(cache, exist_ok=True)
    narrator = reel.get("voice", NARRATOR); speed = reel.get("speed", 1.1)

    vo = np.zeros(int(120 * SR)); words, beats = [], []
    t = 0.35
    for bi, b in enumerate(reel["beats"]):
        start = t; chant = None
        if b["kind"] == "verse":
            v = reel["verse"]
            text = b.get("chant", v["sanskrit"]).replace("\n", " ")
            text = re.sub(r"[।॥|]", ",", text).strip(" ,")
            c = kokoro_say(k, text, b.get("chant_voice", CHANTER), b.get("chant_speed", 0.82), "hi", cache)
            c = reverb(c, 0.35, mb.IR_TEMPLE)[: len(c) + int(1.2 * SR)]
            place(vo, t + 0.5, c, 0.9)
            chant = {"start": round(t + 0.5, 3), "end": round(t + 0.5 + len(c) / SR, 3)}
            t += 0.5 + len(c) / SR + 0.25
        voice = b.get("voice", narrator)
        for ln in b.get("lines", []):   # Hindi / Hinglish: speak the Devanagari, caption the Roman text
            hv = b.get("voice_hi", reel.get("voice_hi", "hm_psi"))
            s = kokoro_say(k, ln["hi"], hv, b.get("speed", reel.get("speed_hi", 1.0)), "hi", cache)
            place(vo, t, s, 1.0); dur = len(s) / SR
            ws = ln["cap"].split(); weights = np.array([syl(w) for w in ws]); edges = np.concatenate([[0], np.cumsum(weights)]) / weights.sum()
            for i, w in enumerate(ws):
                words.append({"w": w, "s": round(t + edges[i] * dur, 3), "e": round(t + edges[i + 1] * dur, 3), "b": bi})
            t += dur + GAP_SENTENCE
        for p in phrases(b.get("vo", "")):
            s = kokoro_say(k, speakable(p), voice, b.get("speed", speed), "en-gb" if voice[:1] == "b" else "en-us", cache)
            place(vo, t, s, 1.0)
            dur = len(s) / SR
            ws = p.split(); weights = np.array([syl(w) for w in ws]); edges = np.concatenate([[0], np.cumsum(weights)]) / weights.sum()
            lead_in = min(0.06, dur * 0.05)
            for i, w in enumerate(ws):
                words.append({"w": w, "s": round(t + lead_in + edges[i] * (dur - lead_in * 2), 3),
                              "e": round(t + lead_in + edges[i + 1] * (dur - lead_in * 2), 3), "b": bi})
            t += dur + (GAP_SENTENCE if p[-1] in ".!?…" else GAP_PHRASE)
        end = max(t + GAP_BEAT, start + b.get("min", 0))
        beats.append({"kind": b["kind"], "start": round(start, 3), "end": round(end, 3), "chant": chant})
        t = end
    total = round(t + reel.get("tail", 0.6), 3)
    vo = vo[: int(total * SR)]

    music, kicks, snares = score(total, beats, reel.get("bpm", 140), reel.get("raga", "bhairavi"), reel.get("seed", 7))
    # duck the score under the voice
    env = np.abs(vo); win = int(0.08 * SR)
    env = np.convolve(env, np.ones(win) / win, mode="same"); env = np.clip(env / (env.max() + 1e-9) * 3, 0, 1)
    music *= (1 - 0.7 * env)[:, None]

    fx = np.zeros((int(total * SR), 2)); events = []
    for bi, b in enumerate(reel["beats"]):
        bt = beats[bi]
        for name in b.get("sfx", []):
            at = bt["start"]
            if name.startswith("riser"):  # riser lands on the next beat
                at = bt["end"] - 1.6
            mb.place2(fx, max(0, at), SFX[name.split("@")[0]](), 1.0, 0.0)
            events.append({"sfx": name, "t": round(at, 3)})
        if bi > 0 and "nowhoosh" not in b.get("flags", []):
            mb.place2(fx, max(0, bt["start"] - 0.25), SFX["whoosh"](), 0.7, 0.0)
        for p in b.get("pops", []):  # sticker pops are timed to a word
            w = next((w for w in words if w["b"] == bi and p["at"].lower() in w["w"].lower()), None)
            if w:
                mb.place2(fx, w["s"], SFX[p.get("sfx", "pop")](), 0.9, 0.0)

    voice2 = np.stack([vo, vo], 1)
    full = voice2 + music * 0.45 + fx * 0.8
    dry = voice2 + fx * 0.8
    for name, mix in (("reel.wav", full), ("reel_nomusic.wav", dry)):
        mix = mix / (np.abs(mix).max() + 1e-9) * 0.93
        sf.write(os.path.join(reel_dir, name), mix.astype(np.float32), SR)
    tl = {"duration": total, "beats": beats, "words": words, "kicks": kicks, "snares": snares, "sfx": events}
    json.dump(tl, open(os.path.join(reel_dir, "timeline.json"), "w"), ensure_ascii=False, indent=0)
    print(f"reel {total:.1f}s, {len(words)} words, {len(kicks)} kicks")


if __name__ == "__main__":
    main()
