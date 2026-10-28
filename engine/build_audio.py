#!/usr/bin/env python3
"""Voice + sound pass for a parody episode.

Reads episode.json, speaks every line with Kokoro (open-weight TTS, runs on CPU),
synthesizes the sound effects and theme stings, and writes:
  <out>/episode.wav     the full mixed soundtrack
  <out>/timeline.json   every shot with start/end times and a mouth envelope for lip-sync

Usage: python3 build_audio.py episodes/<slug>/episode.json [--models /path/to/models]
"""
import argparse, hashlib, json, os, sys
import numpy as np
import soundfile as sf

SR = 24000
ENV_FPS = 30  # mouth envelope samples per second


# ---------- sound effects (pure numpy, no assets needed) ----------

def _env(n, a=0.01, r=0.3):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
    return e

def _tone(f, dur, kind="sine", vib=0.0):
    t = np.arange(int(dur * SR)) / SR
    ph = 2 * np.pi * f * t + vib * np.sin(2 * np.pi * 5.5 * t)
    if kind == "square":
        return np.sign(np.sin(ph)) * 0.5 + 0.5 * np.sin(ph)
    if kind == "saw":
        return 2 * ((f * t) % 1) - 1
    return np.sin(ph)

def _note(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)

def sfx_theme():
    # bouncy original jingle: I - vi - IV - V turnaround, then a big finish
    beat = 0.18
    melody = [72, 76, 79, 84, 81, 79, 76, 77, 79, 81, 79, 76, 74, 76, 72, 72]
    bass = [48, 48, 45, 45, 41, 41, 43, 43]
    out = np.zeros(int(SR * (len(melody) * beat + 1.4)))
    for i, m in enumerate(melody):
        d = beat * (3 if i == len(melody) - 1 else 1)
        s = _tone(_note(m), d + 0.05, "square") * _env(int((d + 0.05) * SR), 0.005, 0.25) * 0.22
        o = int(i * beat * SR); out[o:o + len(s)] += s
    for i, m in enumerate(bass):
        d = beat * 2
        s = _tone(_note(m), d, "saw") * _env(int(d * SR), 0.005, 0.3) * 0.18
        o = int(i * d * SR); out[o:o + len(s)] += s
    # final chord
    o = int(len(melody) * beat * SR)
    for m in (60, 64, 67, 72):
        s = _tone(_note(m), 1.3, "square", vib=0.3) * _env(int(1.3 * SR), 0.01, 0.6) * 0.12
        out[o:o + len(s)] += s
    return out

def sfx_sting():
    out = np.zeros(int(SR * 1.6))
    for i, chord in enumerate([(55, 59, 62), (57, 60, 64), (60, 64, 67, 72)]):
        d = 0.16 if i < 2 else 1.1
        o = int(i * 0.16 * SR)
        for m in chord:
            s = _tone(_note(m), d, "saw") * _env(int(d * SR), 0.005, 0.35 if i == 2 else 0.1) * 0.12
            out[o:o + len(s)] += s
    return out

def sfx_sparkle():
    out = np.zeros(int(SR * 1.4))
    for i, m in enumerate([84, 88, 91, 96, 100, 103]):
        s = _tone(_note(m), 0.5) * _env(int(0.5 * SR), 0.002, 0.15) * 0.18
        o = int(i * 0.07 * SR); out[o:o + len(s)] += s
    return out

def sfx_chitter():
    rng = np.random.default_rng(3)
    out = np.zeros(int(SR * 1.1))
    for i in range(7):
        d = rng.uniform(0.05, 0.1)
        f0 = rng.uniform(1400, 2400)
        t = np.arange(int(d * SR)) / SR
        f = f0 * (1 + 0.6 * np.sin(2 * np.pi * 40 * t))
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.hanning(len(t)) * 0.3
        o = int(i * 0.14 * SR); out[o:o + len(s)] += s
    return out

def sfx_chomp():
    rng = np.random.default_rng(5)
    out = np.zeros(int(SR * 1.4))
    for i in range(5):
        n = int(0.12 * SR)
        s = rng.standard_normal(n) * _env(n, 0.002, 0.03)
        s = np.convolve(s, np.ones(12) / 12, "same") * 0.9
        o = int(i * 0.24 * SR); out[o:o + n] += s
    return out + np.pad(sfx_chitter(), (0, max(0, len(out) - len(sfx_chitter()))))[:len(out)] * 0.6

def sfx_crash():
    rng = np.random.default_rng(9)
    n = int(SR * 1.8)
    t = np.arange(n) / SR
    vroom = np.sin(2 * np.pi * np.cumsum(80 + 160 * np.minimum(t, 0.6)) / SR) * (t < 0.7) * 0.25
    noise = rng.standard_normal(n) * np.exp(-np.maximum(t - 0.7, 0) / 0.35) * (t >= 0.7) * 0.5
    thud = np.sin(2 * np.pi * 55 * t) * np.exp(-np.maximum(t - 0.7, 0) / 0.2) * (t >= 0.7) * 0.6
    clank = sum(np.sin(2 * np.pi * f * t) * np.exp(-np.maximum(t - d, 0) / 0.12) * (t >= d) * 0.12
                for f, d in ((1870, 0.85), (2630, 1.0), (1410, 1.15)))
    return vroom + noise + thud + clank

def _pluck(freq, dur, bright=0.5):
    """Karplus-Strong plucked string: cheap, warm, very sitcom."""
    n = int(dur * SR); period = max(2, int(SR / freq))
    buf = np.random.default_rng(int(freq)).uniform(-1, 1, period)
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % period]
        buf[i % period] = 0.996 * (bright * buf[i % period] + (1 - bright) * buf[(i + 1) % period])
    return out

def music_bed(total):
    """Bouncy original loop (I-vi-IV-V, 112 bpm): plucked arpeggios + walking bass."""
    beat = 60 / 112; eighth = beat / 2
    chords = [(60, 64, 67), (57, 60, 64), (53, 57, 60), (55, 59, 62)]
    bar = int(4 * beat * SR)
    loop = np.zeros(bar * 4)
    cache = {}
    def note(m, d, b):
        k = (m, d, b)
        if k not in cache: cache[k] = _pluck(_note(m), d, b)
        return cache[k]
    for ci, ch in enumerate(chords):
        base = ci * bar
        pattern = [ch[0], ch[1], ch[2], ch[1] + 12, ch[2], ch[1], ch[0] + 12, ch[2]]
        for j, m in enumerate(pattern):
            s = note(m + 12, eighth * 1.5, 0.5) * 0.18
            o = base + int(j * eighth * SR); loop[o:o + len(s)] += s[: len(loop) - o]
        for j, m in enumerate([ch[0] - 24, ch[0] - 17, ch[0] - 24 + 2, ch[0] - 17]):
            s = note(m, beat, 0.6) * 0.32
            o = base + int(j * beat * SR); loop[o:o + len(s)] += s[: len(loop) - o]
    reps = int(np.ceil(total * SR / len(loop))) + 1
    return np.tile(loop, reps)[: int(total * SR) + SR]

# ---------- explainer palette: soft, airy, cinematic ----------

def _bell(f, dur=2.5, amp=0.2):
    t = np.arange(int(dur * SR)) / SR
    parts = ((1, 1.0, 1.2), (2.76, 0.35, 0.5), (5.4, 0.15, 0.25), (8.93, 0.06, 0.12))
    return sum(np.sin(2 * np.pi * f * m * t) * a * np.exp(-t / d) for m, a, d in parts) * amp * np.minimum(1, t / 0.004)

def _filtered_noise(n, width, seed):
    k = np.hanning(width); k /= k.sum()
    return np.convolve(np.random.default_rng(seed).standard_normal(n), k, "same")

def sfx_whoosh():
    n = int(SR * 0.9); t = np.arange(n) / SR
    env = np.sin(np.pi * np.clip(t / 0.9, 0, 1)) ** 2
    lo, hi = _filtered_noise(n, 40, 1), _filtered_noise(n, 6, 2)
    mix = np.clip(t / 0.45, 0, 1)
    return (lo * (1 - mix) * 3 + hi * mix) * env * 0.35

def sfx_pop():
    n = int(SR * 0.14); t = np.arange(n) / SR
    f = 900 * np.exp(-t / 0.03) + 260
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035) * 0.35

def sfx_chime():
    out = np.zeros(int(SR * 3))
    for i, m in enumerate((79, 83, 86, 91)):
        s = _bell(_note(m), 2.6, 0.12); o = int(i * 0.09 * SR); out[o:o + len(s)] += s[: len(out) - o]
    return out

def sfx_tick():
    n = int(SR * 0.05); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2200 * t) * np.exp(-t / 0.006) * 0.3

def sfx_swell():
    n = int(SR * 3.2); t = np.arange(n) / SR
    env = (t / 3.2) ** 2.5 * np.exp(-np.maximum(t - 2.9, 0) / 0.08)
    pad = sum(np.sin(2 * np.pi * _note(m) * t * (1 + d)) for m in (50, 57, 62, 69) for d in (-0.002, 0.002)) / 8
    return (pad * 0.5 + _filtered_noise(n, 4, 7) * 0.4) * env * 0.5

def sfx_thump():
    n = int(SR * 0.7); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (45 + 60 * np.exp(-t / 0.05)) * t) * np.exp(-t / 0.18) * 0.7

def ambient_bed(total, seed=11):
    """Original slow ambient score: warm detuned pads, a soft bell arpeggio and a sub, with a cheap echo for space."""
    rng = np.random.default_rng(seed)
    chord_len = 7.5
    prog = [(50, 57, 62, 65, 69), (46, 53, 58, 62, 65), (41, 48, 53, 57, 64), (48, 55, 60, 64, 67)]  # Dm9 Bbmaj7 Fmaj7 C
    n = int((total + 2) * SR)
    out = np.zeros(n)
    t_ch = np.arange(int((chord_len + 2.5) * SR)) / SR
    att = np.minimum(1, t_ch / 2.0) * np.minimum(1, np.maximum(0, (chord_len + 2.5 - t_ch)) / 2.5)
    pads = {}
    for ch in prog:
        sig = np.zeros(len(t_ch))
        for m in ch:
            f = _note(m)
            for det in (-0.0035, 0.0035):
                for h, a in ((1, 1.0), (2, 0.3), (3, 0.12), (4, 0.05)):
                    sig += np.sin(2 * np.pi * f * h * (1 + det) * t_ch + rng.uniform(0, 6.28)) * a
        sig += np.sin(2 * np.pi * _note(ch[0] - 12) * t_ch) * 1.5   # sub
        pads[ch] = sig * att / 30
    i = 0
    while i * chord_len < total + 2:
        ch = prog[i % len(prog)]; o = int(i * chord_len * SR); s = pads[ch]
        out[o:o + len(s)] += s[: n - o]
        # bell arpeggio: sparse, gentle
        for k in range(8):
            if rng.random() < 0.55:
                m = ch[rng.integers(1, len(ch))] + 12 * rng.integers(1, 3)
                b = _bell(_note(m), 2.2, 0.05 * rng.uniform(0.6, 1.0)); ob = o + int(k * chord_len / 8 * SR)
                out[ob:ob + len(b)] += b[: max(0, n - ob)]
        i += 1
    for d, g in ((0.33, 0.35), (0.71, 0.22), (1.13, 0.12)):   # echo tail
        k = int(d * SR); out[k:] += out[:-k] * g
    return out

# ---------- cinema palette: documentary drama (tanpura drone, low strings, heartbeat hits) ----------

def _tanpura_pluck(f, dur=4.5, amp=0.1, seed=0):
    """A drone string with a jawari-like bloom: upper partials swell after the attack, then everything decays."""
    t = np.arange(int(dur * SR)) / SR
    rng = np.random.default_rng(seed)
    sig = np.zeros(len(t))
    for h in range(1, 17):
        peak = 0.05 + 0.09 * h                       # higher partials bloom later
        env = (t / peak) * np.exp(1 - t / peak) if h > 1 else np.exp(-t / 2.4)
        sig += np.sin(2 * np.pi * f * h * t * (1 + 0.0006 * np.sin(2 * np.pi * 0.3 * t)) + rng.uniform(0, 6.28)) * env / h ** 0.85
    return sig * np.exp(-t / 2.8) * np.minimum(1, t / 0.01) * amp

def _string_pad(notes, dur, amp=0.05, seed=0):
    t = np.arange(int(dur * SR)) / SR
    rng = np.random.default_rng(seed)
    att = np.minimum(1, t / 3.0) * np.minimum(1, np.maximum(0, dur - t) / 3.0)
    sig = np.zeros(len(t))
    for m in notes:
        f = _note(m)
        for det in (-0.003, 0, 0.003):
            vib = 1 + 0.002 * np.sin(2 * np.pi * (4.8 + rng.uniform(-0.4, 0.4)) * t + rng.uniform(0, 6))
            for h in range(1, 8):
                sig += np.sin(2 * np.pi * f * h * (1 + det) * t * vib + rng.uniform(0, 6.28)) / h ** 1.3
    return sig * att * amp / len(notes)

def cinema_bed(total, seed=7):
    """Original score for documentaries: a D tanpura drone, slow low strings (Dm, Bb, Gm, A), a distant heartbeat and a high
    solo line that enters now and then."""
    rng = np.random.default_rng(seed)
    n = int((total + 3) * SR); out = np.zeros(n)
    sa = _note(50)                                   # D3
    cycle = [_note(45), sa, sa, _note(38)]           # Pa, Sa, Sa, low Sa
    plucks = [_tanpura_pluck(f, 4.5, 0.05, i) for i, f in enumerate(cycle)]
    step = 1.25; i = 0
    while i * step < total + 2:
        o = int(i * step * SR); p = plucks[i % 4]
        out[o:o + len(p)] += p[: n - o]
        i += 1
    prog = [(38, 45, 53, 57), (34, 41, 50, 53), (31, 43, 46, 50), (33, 40, 49, 52)]   # Dm, Bb, Gm, A
    sec = 10.0; k = 0
    while k * sec < total + 2:
        pad = _string_pad(prog[k % 4], sec + 4, 0.09, k)
        o = int(k * sec * SR); out[o:o + len(pad)] += pad[: n - o]
        if k % 3 != 2:                                # heartbeat: two low thumps every 2.5 s
            for b in range(4):
                for dd, g in ((0, 1.0), (0.32, 0.7)):
                    ob = o + int((b * 2.5 + dd) * SR); th = sfx_thump() * 0.22 * g
                    out[ob:ob + len(th)] += th[: max(0, n - ob)]
        if rng.random() < 0.4:                       # a high solo line, long notes with vibrato
            m = [69, 74, 72, 70, 69][k % 5]
            tt = np.arange(int(6 * SR)) / SR
            env = np.sin(np.pi * np.clip(tt / 6, 0, 1)) ** 2
            line = np.sin(2 * np.pi * _note(m) * tt * (1 + 0.004 * np.sin(2 * np.pi * 5.2 * tt))) * env * 0.035
            ob = o + int(2 * SR); out[ob:ob + len(line)] += line[: max(0, n - ob)]
        k += 1
    for d, g in ((0.29, 0.3), (0.67, 0.2), (1.21, 0.12), (1.9, 0.07)):   # room
        kk = int(d * SR); out[kk:] += out[:-kk] * g
    return out

def sfx_boom():
    n = int(SR * 3.5); t = np.arange(n) / SR
    body = np.sin(2 * np.pi * (32 + 50 * np.exp(-t / 0.12)) * t) * np.exp(-t / 0.9)
    return (body * 0.9 + _filtered_noise(n, 60, 3) * np.exp(-t / 0.6) * 2.5) * 0.5

def sfx_type():
    out = np.zeros(int(SR * 1.6)); rng = np.random.default_rng(5); t = 0.0
    while t < 1.25:
        n = int(SR * 0.03); tt = np.arange(n) / SR
        click = (np.sin(2 * np.pi * rng.uniform(1800, 2600) * tt) * 0.5 + _filtered_noise(n, 3, int(t * 100))) * np.exp(-tt / 0.006) * 0.22
        o = int(t * SR); out[o:o + n] += click; t += rng.uniform(0.06, 0.13)
    return out

def sfx_riser():
    n = int(SR * 3.0); t = np.arange(n) / SR
    env = (t / 3.0) ** 2 * np.exp(-np.maximum(t - 2.9, 0) / 0.05)
    tone = np.sin(2 * np.pi * np.cumsum(110 + 330 * (t / 3.0) ** 2) / SR)
    return (tone * 0.3 + _filtered_noise(n, 4, 9) * 0.6) * env * 0.5

def sfx_heart():
    out = np.zeros(int(SR * 1.0))
    for d, g in ((0, 1.0), (0.3, 0.7)):
        th = sfx_thump() * g; o = int(d * SR); out[o:o + len(th)] += th[: len(out) - o]
    return out * 0.8

def sfx_shutter():
    n = int(SR * 0.12); t = np.arange(n) / SR
    return _filtered_noise(n, 3, 4) * 0.6 * (np.exp(-t / 0.01) + 0.6 * np.exp(-np.maximum(t - 0.06, 0) / 0.01) * (t > 0.06)) * 0.8

def sfx_bell():
    a = _bell(_note(38), 6.0, 0.35); b = _bell(_note(50), 6.0, 0.12)
    return a + b

def sfx_murmur():
    n = int(SR * 4.0); t = np.arange(n) / SR
    env = np.sin(np.pi * np.clip(t / 4.0, 0, 1)) ** 1.5
    voc = sum(np.sin(2 * np.pi * f * t + np.sin(2 * np.pi * r * t) * 3) for f, r in ((180, 3.1), (240, 4.3), (310, 2.6), (420, 5.1))) / 4
    return (_filtered_noise(n, 12, 11) * 1.6 + voc * 0.05) * env * 0.35

SFX = {"theme": sfx_theme, "sting": sfx_sting, "sparkle": sfx_sparkle,
       "chitter": sfx_chitter, "chomp": sfx_chomp, "crash": sfx_crash,
       "whoosh": sfx_whoosh, "pop": sfx_pop, "chime": sfx_chime, "tick": sfx_tick,
       "swell": sfx_swell, "thump": sfx_thump, "boom": sfx_boom, "type": sfx_type, "riser": sfx_riser,
       "heart": sfx_heart, "shutter": sfx_shutter, "bell": sfx_bell, "murmur": sfx_murmur}


# ---------- helpers ----------

def envelope(sig, dur):
    """RMS per 1/ENV_FPS second, normalised to 0..1 for mouth opening."""
    hop = SR // ENV_FPS
    n = max(1, int(np.ceil(dur * ENV_FPS)))
    vals = []
    for i in range(n):
        seg = sig[i * hop:(i + 1) * hop]
        vals.append(float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0)
    v = np.array(vals)
    if v.max() > 0:
        v = v / np.percentile(v, 95).clip(1e-6)
    return [round(float(x), 2) for x in np.clip(v, 0, 1)]

def speak(kokoro, text, voice, speed, cache_dir):
    key = hashlib.sha1(f"{voice}|{speed}|{text}".encode()).hexdigest()[:16]
    path = os.path.join(cache_dir, key + ".wav")
    if os.path.exists(path):
        s, _ = sf.read(path)
        return s
    if "+" in voice or ":" in voice:   # blended voice, e.g. "am_michael:0.65+bm_george:0.35"
        parts = [(v.split(":") + ["1"])[:2] for v in voice.split("+")]
        style = sum(kokoro.get_voice_style(name) * float(w) for name, w in parts)
        s, sr = kokoro.create(text, voice=style.astype(np.float32), speed=speed, lang="en-us")
    else:
        s, sr = kokoro.create(text, voice=voice, speed=speed, lang="en-gb" if voice[0] == "b" else "en-us")
    assert sr == SR
    # trim leading/trailing silence so shots feel snappy
    nz = np.where(np.abs(s) > 0.01)[0]
    if len(nz):
        s = s[max(0, nz[0] - 600): nz[-1] + 1800]
    sf.write(path, s, SR)
    return s


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("--models", default=os.environ.get("KOKORO_MODELS", os.path.expanduser("~/models")))
    args = ap.parse_args()

    from kokoro_onnx import Kokoro
    model = os.path.join(args.models, "kokoro-v1.0.int8.onnx")
    if not os.path.exists(model):
        model = os.path.join(args.models, "kokoro-v1.0.onnx")
    kokoro = Kokoro(model, os.path.join(args.models, "voices-v1.0.bin"))

    ep_path = os.path.abspath(args.episode)
    out_dir = os.path.dirname(ep_path)
    cache = os.path.join(out_dir, ".voice-cache"); os.makedirs(cache, exist_ok=True)
    ep = json.load(open(ep_path))
    gap = ep["meta"].get("gap", 0.3)
    cast = ep["cast"]

    clips = []   # (start_sec, signal)
    shots = []
    t = 0.4
    for seg in ep["sequence"]:
        if seg["type"] == "card":
            dur = seg.get("dur", 3)
            if seg.get("sfx"):
                clips.append((t, SFX[seg["sfx"]]()))
            shots.append({"type": "card", "seg": seg["id"], "start": round(t, 3), "end": round(t + dur, 3)})
            t += dur + gap
            continue
        line_starts = []
        for i, line in enumerate(seg["lines"]):
            line_starts.append(t)
            who = cast[line.get("who") or ep["meta"].get("narrator", "narrator")]
            if not line.get("text") and not who.get("kind"):   # silent visual beat
                dur = line.get("dur", 1.5)
                if line.get("sfx"):
                    clips.append((t, SFX[line["sfx"]]() * 0.8))
                shots.append({"type": "line", "seg": seg["id"], "idx": i, "start": round(t, 3),
                              "end": round(t + dur, 3), "env": [], "silent": True})
                t += dur + line.get("pause", gap)
                continue
            if who.get("kind"):  # non-speaking critter: sound effect drives the mouth
                sig = SFX[line.get("sfx") or who.get("sfx", "chitter")]()
                dur = max(line.get("dur", len(sig) / SR), len(sig) / SR)
            else:
                print(f"  {line.get('who', 'narr'):7s} {line['text'][:60]}", file=sys.stderr)
                sig = speak(kokoro, line.get("say", line["text"]), who["voice"], who.get("speed", 1.0), cache)
                dur = len(sig) / SR
                if line.get("sfx"):
                    clips.append((t, SFX[line["sfx"]]() * 0.8))
            clips.append((t, sig))
            shots.append({"type": "line", "seg": seg["id"], "idx": i, "start": round(t, 3),
                          "end": round(t + dur, 3), "env": envelope(sig, dur)})
            t += dur + line.get("pause", gap)
        for el in seg.get("els", []):   # explainer elements can carry their own entrance sound
            if el.get("sfx"):
                at = line_starts[min(el.get("in", 0), len(line_starts) - 1)] + el.get("d", 0)
                clips.append((at, SFX[el["sfx"]]() * el.get("vol", 0.6)))
    total = t + 0.6

    mix = np.zeros(int(total * SR) + SR)
    for start, sig in clips:
        o = int(start * SR)
        mix[o:o + len(sig)] += sig[: len(mix) - o]
    music = ep["meta"].get("music")
    if music:
        ambient = music in ("ambient", "cinema")
        bed = (cinema_bed(total) if music == "cinema" else ambient_bed(total) if ambient else music_bed(total))[: len(mix)]
        gain = np.full(len(mix), 0.75 if ambient else 0.55)
        for sh in shots:
            a, b = int(sh["start"] * SR), int(sh["end"] * SR)
            if ambient:   # the score breathes up on cards and silent beats, sits low under narration
                gain[a:b] = 1.1 if sh["type"] == "card" or sh.get("silent") else 0.42
            else:
                gain[a:b] = 0.0 if sh["type"] == "card" else 0.3   # duck under dialogue, rest under cards
        k = int((0.8 if ambient else 0.15) * SR); c = np.cumsum(np.insert(gain, 0, 0))
        smooth = (c[k:] - c[:-k]) / k
        gain[: len(smooth)] = smooth
        mix += bed * gain * 0.5
    peak = np.abs(mix).max()
    if peak > 0.98:
        mix *= 0.98 / peak
    sf.write(os.path.join(out_dir, "episode.wav"), mix.astype(np.float32), SR)
    json.dump({"duration": round(total, 3), "envFps": ENV_FPS, "shots": shots},
              open(os.path.join(out_dir, "timeline.json"), "w"))
    print(f"wrote episode.wav + timeline.json ({total:.1f}s, {len(shots)} shots)", file=sys.stderr)


if __name__ == "__main__":
    main()
