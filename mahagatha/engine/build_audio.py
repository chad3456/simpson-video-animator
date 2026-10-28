#!/usr/bin/env python3
"""Voices, Indian-instrument score, ambience and effects for the Mahagatha film.

Voices: Kokoro's Hindi voices, blended with other Kokoro styles and reshaped with pitch/formant shifts (ffmpeg
rubberband) and per-character treatments (divine hall, cave, growl, chorus, child, elder), so every character
sounds different. Score: all synthesised here from note events: tanpura drone with jawari bloom, bansuri and
sarangi phrases with meend glides, sitar/santoor plucks, shehnai, tabla thekas, dhol and nagara, ghanta, shankh,
manjira, damaru, swarmandal glissandi and a humming choir, on raga scales (Yaman, Bhairav, Malkauns, Desh,
Marwa, Bhairavi, Durga, Hamsadhwani, Darbari). Output 44.1 kHz stereo:
  <episode>/episode.wav, <episode>/timeline.json (shots with start/end and a 30 fps mouth envelope per line)
Usage: python3 mahagatha/engine/build_audio.py mahagatha/episodes/<slug>/episode.json [--models ~/models]
"""
import argparse, hashlib, json, os, subprocess, sys, tempfile
import numpy as np
import soundfile as sf
from scipy.signal import fftconvolve, butter, sosfilt, resample_poly

SR = 44100
KSR = 24000
R0 = np.random.default_rng(11)
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)
SA = 61          # tonic: C#4 (a common tabla/tanpura pitch)


# ============================================================ utilities ====
def T(dur): return np.arange(int(dur * SR)) / SR
def place(buf, at, sig, gain=1.0):
    o = int(at * SR)
    if o >= len(buf) or o + len(sig) <= 0: return
    if o < 0: sig = sig[-o:]; o = 0
    e = min(len(buf), o + len(sig)); buf[o:e] += sig[: e - o] * gain
def band(x, lo, hi, order=2): return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)
def low(x, f, order=2): return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)
def high(x, f, order=2): return sosfilt(butter(order, f, 'high', fs=SR, output='sos'), x)
def noise(n, seed=0): return np.random.default_rng(seed).standard_normal(n)
def adsr(n, a=0.01, d=0.1, s=0.7, r=0.2):
    t = np.arange(n) / SR; dur = n / SR
    env = np.where(t < a, t / max(a, 1e-4), np.where(t < a + d, 1 - (1 - s) * (t - a) / max(d, 1e-4), s))
    rel = np.clip((dur - t) / max(r, 1e-4), 0, 1)
    return env * rel
def norm(x, peak=0.9): m = np.abs(x).max(); return x * (peak / m) if m > 0 else x

def make_ir(rt=2.2, seed=3, lp=6000, pre=0.012):
    r = np.random.default_rng(seed); n = int(rt * SR); t = np.arange(n) / SR
    ir = r.standard_normal(n) * np.exp(-6.9 * t / rt)
    ir = low(ir, lp)
    ir[: int(pre * SR)] = 0
    for d, g in ((0.017, 0.6), (0.029, 0.45), (0.041, 0.35), (0.057, 0.28)): ir[int(d * SR)] += g * 4
    return ir / np.sqrt(np.sum(ir ** 2))
IR_HALL = make_ir(2.6, 3, 6500); IR_ROOM = make_ir(0.7, 5, 7000); IR_CAVE = make_ir(4.2, 7, 3500, 0.03); IR_TEMPLE = make_ir(3.4, 9, 5000)
def reverb(x, wet=0.3, ir=IR_HALL):
    w = fftconvolve(x, ir)[: len(x)]
    return x * (1 - wet) + w * wet

def stereo(x, pan=0.0):
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * l * 1.414, x * r * 1.414], axis=1)
def place2(buf, at, sig, gain=1.0, pan=0.0):
    if sig.ndim == 1: sig = stereo(sig, pan)
    o = int(at * SR)
    if o >= len(buf): return
    e = min(len(buf), o + len(sig)); buf[o:e] += sig[: e - o] * gain


# ============================================================ ragas ========
RAGAS = {
    "yaman":       [0, 2, 4, 6, 7, 9, 11],
    "bhairav":     [0, 1, 4, 5, 7, 8, 11],
    "malkauns":    [0, 3, 5, 8, 10],
    "darbari":     [0, 2, 3, 5, 7, 8, 10],
    "bhairavi":    [0, 1, 3, 5, 7, 8, 10],
    "desh":        [0, 2, 4, 5, 7, 9, 10, 11],
    "durga":       [0, 2, 5, 7, 9],
    "marwa":       [0, 1, 4, 6, 9, 11],
    "hamsadhwani": [0, 2, 4, 7, 11],
}
def deg2midi(raga, d, base=SA):
    sc = RAGAS[raga]; n = len(sc); o, i = divmod(d, n)
    return base + 12 * o + sc[i]

def phrase_gen(raga, bars, r, start=0, span=(-3, 10), rest_prob=0.18, long_end=True):
    """A melodic line as [(degree, beats)] that walks the raga by steps and small leaps and rests on Sa or Pa."""
    sc = len(RAGAS[raga]); pa = RAGAS[raga].index(7) if 7 in RAGAS[raga] else 2
    out, d = [], start
    for b in range(bars):
        beats = 0
        while beats < 4:
            step = r.choice([-1, -1, 1, 1, 1, -2, 2, 0, -1, 1])
            d = int(np.clip(d + step, span[0], span[1]))
            ln = r.choice([0.5, 0.5, 1, 1, 1, 1.5, 2])
            ln = min(ln, 4 - beats)
            out.append((None if r.random() < rest_prob * 0.4 else d, ln)); beats += ln
        if b % 2 == 1 and r.random() < 0.6:
            tgt = r.choice([0, pa, sc])
            out.append((tgt, 2.0)); d = tgt
    if long_end: out.append((r.choice([0, pa]), 3.0))
    return out


# ============================================================ instruments ==
_cache = {}
def tanpura_cycle(sa=SA - 12, pa_first=7, cyc=4.6):
    """One cycle of four tanpura strings (Pa, Sa', Sa', Sa) with the jawari bloom, ready to loop."""
    key = ('tan', sa, pa_first, cyc)
    if key in _cache: return _cache[key]
    n = int(cyc * SR) + int(6 * SR); out = np.zeros(n)
    notes = [sa + pa_first - 12 + 12, sa + 12, sa + 12, sa]
    for i, m in enumerate(notes):
        f = hz(m); t = T(6.0); s = np.zeros_like(t)
        for k in range(1, 26):
            fk = f * k
            if fk > 9000: break
            bloom = 1 - np.exp(-t / (0.04 + 0.035 * k))          # higher partials arrive later: the buzzing jawari
            sweep = 1 + 0.55 * np.sin(2 * np.pi * (0.18 + 0.021 * k) * t + k)
            s += (1 / k ** 0.75) * bloom * sweep * np.exp(-t / (2.6 + 0.2 * (k < 4))) * np.sin(2 * np.pi * fk * t + R0.uniform(0, 6))
        s *= np.minimum(1, t / 0.006)
        place(out, i * cyc / 4, s * (0.9 if i else 1.0))
    # fold the tail back so the cycle loops seamlessly
    L = int(cyc * SR); loop = out[:L].copy(); loop[: n - L] += out[L:n][: L]
    loop = low(loop, 6000) * 0.05
    _cache[key] = loop
    return loop
def tanpura(total, sa=SA - 12, pa=7):
    cyc = tanpura_cycle(sa, pa); n = int(total * SR); reps = n // len(cyc) + 2
    return np.tile(cyc, reps)[:n]

def contour_voice(events, total, kind='bansuri', bpm=60, base=SA + 12, raga='yaman', vib=0.006, gain=1.0, seed=1):
    """Continuous melodic instrument (bansuri, sarangi, shehnai) synthesised from a pitch contour with meend glides."""
    r = np.random.default_rng(seed)
    beat = 60 / bpm; n = int(total * SR); f = np.zeros(n); a = np.zeros(n)
    t = 0.0; prev = None
    for d, ln in events:
        i0, i1 = int(t * SR), int(min(total, t + ln * beat) * SR)
        if i0 >= n: break
        if d is None:
            prev = None; t += ln * beat; continue
        m = deg2midi(raga, d, base); fq = hz(m)
        seg = i1 - i0
        if seg <= 0: t += ln * beat; continue
        glide = int(min(0.09, ln * beat * 0.35) * SR) if prev is not None else 0
        fs = np.full(seg, fq)
        if glide and prev:
            g = min(glide, seg); fs[:g] = prev * (fq / prev) ** (np.linspace(0, 1, g) ** 0.7)
        f[i0:i1] = fs
        env = np.ones(seg)
        att = int(0.06 * SR) if prev is None else int(0.02 * SR)
        att = min(att, seg); env[:att] = np.linspace(0.0 if prev is None else 0.7, 1, att)
        rel = min(int(0.08 * SR), seg); env[-rel:] *= np.linspace(1, 0.75 if ln < 1.5 else 0.3, rel)
        a[i0:i1] = env * (0.85 + 0.15 * r.random())
        prev = fq; t += ln * beat
    a = low(a, 12)
    tt = np.arange(n) / SR
    vibr = 1 + vib * np.sin(2 * np.pi * 5.3 * tt + 0.4 * np.sin(2 * np.pi * 0.3 * tt)) * np.clip(np.convolve(a, np.ones(int(0.4 * SR)) / int(0.4 * SR), 'same') * 1.2, 0, 1)
    f = np.where(f > 0, f, np.maximum.accumulate(np.where(f > 0, f, 1)))
    ph = 2 * np.pi * np.cumsum(f * vibr) / SR
    if kind == 'bansuri':
        s = np.sin(ph) + 0.12 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph)
        breath = band(noise(n, seed), 600, 4500) * 0.09
        s = (s + breath * (0.5 + 0.5 * np.sin(ph))) * a
        s = low(s, 7000) * 0.28
    elif kind == 'sarangi':
        s = sum(np.sin(k * ph) / k ** 0.9 for k in range(1, 18))
        s = band(s, 220, 6000)
        s = s + 0.6 * band(s, 700, 1100) + 0.35 * band(s, 2300, 2900)   # wooden body resonances
        bow = 1 + 0.08 * band(noise(n, seed + 3), 3, 12)
        s = s * a * bow * 0.07
    elif kind == 'shehnai':
        s = sum(np.sin(k * ph) * (1 / k ** 0.5) for k in range(1, 22))
        s = band(s, 400, 7500)
        s = s + 1.2 * band(s, 1100, 1500) + 0.8 * band(s, 2600, 3200)   # nasal reed formants
        s = np.tanh(s * 0.5) * a * 0.12
    elif kind == 'choir':
        s = np.zeros(n)
        for det in (-0.004, 0, 0.0035):
            pp = ph * (1 + det)
            s += sum(np.sin(k * pp + det * 300) / k ** 1.1 for k in range(1, 14))
        s = band(s, 120, 3000); s = s + 1.0 * band(s, 300, 520) + 0.6 * band(s, 700, 950)  # an "oo/aa" vowel
        s = s * a * 0.05
    return s * gain

def pluck(m, dur=1.6, vel=0.7, kind='sitar', slide_from=None):
    key = ('pl', m, round(dur, 2), round(vel, 2), kind, slide_from)
    if key in _cache: return _cache[key]
    t = T(dur + 0.4); n = len(t); f = np.full(n, hz(m))
    if slide_from is not None:
        g = int(0.08 * SR); f[:g] = hz(slide_from) * (hz(m) / hz(slide_from)) ** np.linspace(0, 1, g)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.zeros(n)
    if kind == 'sitar':
        for k in range(1, 22):
            jaw = 1 + 0.7 * np.exp(-t / 0.25) * np.sin(2 * np.pi * (3 + k * 0.4) * t)
            s += (1 / k ** 0.65) * np.exp(-t / (1.4 / (1 + 0.12 * k))) * jaw * np.sin(k * ph * (1 + 0.0004 * k))
        s += 0.15 * band(noise(n, m), 2000, 8000) * np.exp(-t / 0.01)
        symp = sum(np.sin(2 * np.pi * hz(SA + d) * t) * 0.03 for d in (0, 7, 12, 19)) * (1 - np.exp(-t / 0.3)) * np.exp(-t / 2.5)
        s = s + symp
    elif kind == 'santoor':
        for k, a in ((1, 1), (2, 0.5), (3, 0.3), (4, 0.18), (5, 0.1)):
            s += a * np.exp(-t / (1.8 / k)) * (np.sin(k * ph) + np.sin(k * ph * 1.0012))
        s += 0.25 * band(noise(n, m + 1), 3000, 9000) * np.exp(-t / 0.006)
    elif kind == 'veena':   # deep, round rudra-veena / saraswati veena pluck
        for k in range(1, 14):
            s += (1 / k ** 0.9) * np.exp(-t / (2.4 / (1 + 0.15 * k))) * np.sin(k * ph)
        s *= 1 + 0.3 * np.exp(-t / 0.4) * np.sin(2 * np.pi * 4 * t)
    elif kind == 'harp':    # swarmandal string
        s = (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.2 * np.sin(3.01 * ph)) * np.exp(-t / 1.6)
    s *= np.minimum(1, t / 0.002) * np.clip((dur + 0.4 - t) / 0.3, 0, 1) * vel
    s = s * (0.06 if kind == 'sitar' else 0.09)
    _cache[key] = s
    return s

# --- percussion
def membrane(f0, dur, ratios, decays, amps, bend=0.0, click=0.3, seed=0):
    t = T(dur); s = np.zeros_like(t)
    fb = f0 * (1 + bend * np.exp(-t / 0.05))
    ph = 2 * np.pi * np.cumsum(fb) / SR
    for r_, d, a in zip(ratios, decays, amps): s += a * np.exp(-t / d) * np.sin(r_ * ph)
    s += click * band(noise(len(t), seed), 1500, 7000) * np.exp(-t / 0.004)
    return s * np.minimum(1, t / 0.001)
BOL = {}
def bol(name):
    if name in BOL: return BOL[name]
    dy = hz(SA)   # dayan tuned to Sa
    na = membrane(dy, 0.6, (1, 2, 3, 4, 5), (0.35, 0.25, 0.18, 0.12, 0.08), (1, 0.6, 0.45, 0.3, 0.2), click=0.4, seed=1)
    tin = membrane(dy, 0.8, (1, 2, 3), (0.5, 0.3, 0.2), (1, 0.4, 0.2), click=0.15, seed=2)
    ge = membrane(92, 0.7, (1, 2.1), (0.4, 0.15), (1, 0.3), bend=0.25, click=0.08, seed=3)
    ke = band(noise(int(0.12 * SR), 4), 80, 600) * np.exp(-np.arange(int(0.12 * SR)) / SR / 0.02)
    te = band(noise(int(0.08 * SR), 5), 1200, 6000) * np.exp(-np.arange(int(0.08 * SR)) / SR / 0.012) + membrane(dy * 1.5, 0.08, (1,), (0.02,), (0.5,), click=0.2)[: int(0.08 * SR)]
    def mix(*xs):
        n = max(len(x) for x in xs); o = np.zeros(n)
        for x in xs: o[: len(x)] += x
        return o
    BOL.update({'na': na, 'ta': na, 'tin': tin, 'ge': ge * 1.3, 'ke': ke * 0.8, 'te': te * 0.6, 'dha': mix(na, ge * 1.2), 'dhin': mix(tin, ge * 1.2),
                'dhi': mix(tin, ge), 'ti': te, 'ka': ke, '-': np.zeros(10)})
    return BOL[name]
THEKA = {
    'teentaal': 'dha dhin dhin dha dha dhin dhin dha dha tin tin ta ta dhin dhin dha'.split(),
    'keherwa': 'dha ge na ti na ka dhi na'.split(),
    'dadra': 'dha dhi na dha ti na'.split(),
    'rupak': 'tin tin na dhi na dhi na'.split(),
    'laggi': 'dha te dha ge dha te dha ge'.split(),
}
def tabla(total, theka='keherwa', bpm=80, vol=1.0, sub=1, fill_every=8, seed=1):
    r = np.random.default_rng(seed); out = np.zeros(int((total + 2) * SR)); beat = 60 / bpm / sub
    bols = THEKA[theka]; t, i, cyc = 0.0, 0, 0
    while t < total:
        b = bols[i % len(bols)]
        place(out, t + r.uniform(-0.006, 0.006), bol(b), (1.1 if i % len(bols) == 0 else 0.8) * r.uniform(0.85, 1.05))
        if fill_every and cyc % fill_every == fill_every - 1 and i % len(bols) >= len(bols) - 2:
            place(out, t + beat / 2, bol('te'), 0.6)
        i += 1; t += beat
        if i % len(bols) == 0: cyc += 1
    return out[: int(total * SR)] * vol * 0.5

def dhol_hit(kind='boom'):
    key = ('dhol', kind)
    if key in _cache: return _cache[key]
    if kind == 'boom': s = membrane(68, 1.0, (1, 1.6), (0.35, 0.12), (1, 0.3), bend=0.8, click=0.1, seed=7)
    elif kind == 'nagara': s = membrane(52, 1.8, (1, 1.5, 2.2), (0.8, 0.3, 0.15), (1, 0.4, 0.2), bend=0.5, click=0.25, seed=8) * 1.4
    else: s = membrane(420, 0.25, (1, 2.3, 3.7), (0.05, 0.03, 0.02), (1, 0.5, 0.3), click=0.8, seed=9)  # tak
    _cache[key] = s; return s
def dhol(total, bpm=120, vol=1.0, pattern='bhangra', seed=2):
    out = np.zeros(int((total + 2) * SR)); beat = 60 / bpm
    pats = {'bhangra': [('boom', 0), ('tak', 0.75), ('boom', 1.5), ('tak', 2), ('boom', 2.5), ('tak', 3.0), ('tak', 3.5)],
            'war': [('nagara', 0), ('tak', 0.5), ('boom', 1), ('tak', 1.5), ('nagara', 2), ('tak', 2.5), ('boom', 3), ('tak', 3.25), ('tak', 3.5), ('tak', 3.75)],
            'march': [('boom', 0), ('tak', 1), ('boom', 2), ('tak', 3)],
            'slow': [('nagara', 0), ('boom', 2.5)]}[pattern]
    t = 0.0
    while t < total:
        for k, b in pats: place(out, t + b * beat, dhol_hit(k), 0.9 if k != 'tak' else 0.45)
        t += 4 * beat
    return out[: int(total * SR)] * vol * 0.42

def ghanta(dur=4.0, f=880, seed=1):
    t = T(dur); s = np.zeros_like(t)
    for r_, a, d in ((1, 1, 2.6), (2.0, 0.5, 1.6), (2.76, 0.45, 1.3), (3.52, 0.3, 0.9), (4.17, 0.25, 0.7), (5.43, 0.2, 0.5), (6.8, 0.12, 0.3)):
        s += a * np.exp(-t / d) * (np.sin(2 * np.pi * f * r_ * t) + 0.6 * np.sin(2 * np.pi * f * r_ * 1.003 * t))
    s += 0.4 * band(noise(len(t), seed), 2000, 9000) * np.exp(-t / 0.01)
    return s * 0.12
def shankh(dur=3.4, f=hz(SA - 12), seed=2):
    t = T(dur); env = np.clip(t / (dur * 0.35), 0, 1) ** 1.5 * np.clip((dur - t) / 0.5, 0, 1)
    fq = f * (1 + 0.02 * np.clip((t - dur * 0.6) / (dur * 0.4), 0, 1)) * (1 + 0.004 * np.sin(2 * np.pi * 5 * t))
    ph = 2 * np.pi * np.cumsum(fq) / SR
    s = sum(np.sin(k * ph) / k ** 0.6 for k in range(1, 16))
    s = band(s, 150, 5000); s = s + 0.8 * band(s, 500, 900) + 0.4 * band(s, 1400, 1900)
    s = np.tanh(s * 0.6) + 0.15 * band(noise(len(t), seed), 300, 3000)
    return s * env * 0.16
def manjira(seed=3):
    t = T(1.4); s = sum(np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, d in ((3120, 0.9), (4410, 0.7), (5230, 0.5), (6640, 0.4), (7900, 0.3)))
    return (s + 0.5 * high(noise(len(t), seed), 5000) * np.exp(-t / 0.05)) * 0.02
def damaru_roll(dur=1.5, rate=13, seed=4):
    out = np.zeros(int((dur + 0.5) * SR)); hit = membrane(380, 0.18, (1, 2.2), (0.06, 0.03), (1, 0.4), click=0.5, seed=seed)
    for i in range(int(dur * rate)): place(out, i / rate + (0.012 if i % 2 else 0), hit, 0.5 + 0.5 * np.sin(np.pi * i / (dur * rate)))
    return out * 0.6
def swarmandal(raga='yaman', up=True, n=14, base=SA + 12, dur=1.6):
    out = np.zeros(int((dur + 2.5) * SR)); degs = list(range(n)) if up else list(range(n - 1, -1, -1))
    for i, d in enumerate(degs): place(out, i * dur / n, pluck(deg2midi(raga, d, base - 12), 2.0, 0.6, 'harp'), 0.9)
    return reverb(out, 0.35)


# ============================================================ cues =========
THEME = [(0, 1), (1, 1), (2, 1), (3, 1), (4, 2), (3, 1), (2, 1), (1, 2), (2, 1), (0, 1), (-1, 2), (0, 4),
         (2, 1), (3, 1), (4, 1), (5, 1), (6, 2), (5, 1), (4, 1), (3, 1), (2, 1), (1, 1), (2, 1), (0, 4)]   # Hamsadhwani

def cue_mix(total, parts):
    out = np.zeros((int((total + 3) * SR), 2))
    for sig, gain, pan, rv in parts:
        if rv: sig = reverb(sig, rv[0], rv[1])
        place2(out, 0, sig[: len(out)], gain, pan)
    return out[: int(total * SR)]

def cue_cosmic(total, seed=1, raga='yaman'):
    r = np.random.default_rng(seed)
    dr = tanpura(total)
    ch = contour_voice([(d, l) for d, l in phrase_gen(raga, max(2, int(total / 9)), r, span=(-3, 5), rest_prob=0.1)], total, 'choir', bpm=24, base=SA - 12, raga=raga, seed=seed)
    fl = np.zeros(int(total * SR))
    t = 4.0
    while t < total - 6:
        ev = phrase_gen(raga, 2, r, start=r.integers(0, 5), span=(0, 11), rest_prob=0.05)
        seg = contour_voice(ev, min(16, total - t), 'bansuri', bpm=46, base=SA + 12, raga=raga, seed=int(t))
        place(fl, t, seg); t += len(seg) / SR + r.uniform(3, 7)
    sw = np.zeros(int(total * SR)); t = 2.0
    while t < total - 3: place(sw, t, swarmandal(raga, r.random() < 0.6), 0.5); t += r.uniform(14, 22)
    return cue_mix(total, [(dr, 1.0, 0, None), (ch, 0.9, 0.2, (0.5, IR_HALL)), (fl, 0.75, -0.25, (0.45, IR_HALL)), (sw, 0.6, 0.4, None)])

def cue_raga_gat(total, seed=1, raga='yaman', lead='bansuri', theka='keherwa', bpm=76, pluck_kind=None, tabla_vol=0.8, manj=False):
    r = np.random.default_rng(seed)
    dr = tanpura(total)
    tb = tabla(total, theka, bpm, tabla_vol, sub=1, seed=seed)
    ld = np.zeros(int(total * SR)); t = 1.0
    while t < total - 4:
        ev = phrase_gen(raga, 4, r, start=r.integers(0, 6), span=(-2, 11), rest_prob=0.15)
        if pluck_kind:
            beat = 60 / bpm; tt = t; prev = None
            for d, ln in ev:
                if tt >= total: break
                if d is not None:
                    m = deg2midi(raga, d, SA); place(ld, tt, pluck(m, max(0.5, ln * beat * 1.4), 0.75, pluck_kind, prev if (prev and r.random() < 0.3) else None)); prev = m
                    if ln >= 1 and pluck_kind == 'santoor':
                        for k in range(1, int(ln * 4)): place(ld, tt + k * beat / 4, pluck(m, 0.4, 0.35, 'santoor'))
                tt += ln * beat
            t = tt + beat * r.integers(2, 6)
        else:
            seg = contour_voice(ev, min(30, total - t), lead, bpm=bpm, base=SA + 12, raga=raga, seed=int(t * 7))
            place(ld, t, seg); t += len(seg) / SR + r.uniform(2, 5)
    mj = np.zeros(int(total * SR))
    if manj:
        beat = 60 / bpm; t = 0
        while t < total: place(mj, t, manjira(int(t)), 0.8); t += beat * 2
    return cue_mix(total, [(dr, 0.8, 0, None), (tb, 1.0, 0.1, (0.15, IR_ROOM)), (ld, 1.0, -0.15, (0.32, IR_HALL)), (mj, 0.7, 0.35, (0.2, IR_ROOM))])

def cue_shiva(total, seed=3):
    r = np.random.default_rng(seed); raga = 'malkauns'
    dr = tanpura(total, SA - 12, 5)
    lowv = np.zeros(int(total * SR)); t = 1.0
    while t < total - 2:
        ev = phrase_gen(raga, 2, r, start=0, span=(-5, 4), rest_prob=0.2)
        beat = 60 / 40; tt = t
        for d, ln in ev:
            if d is not None and tt < total: place(lowv, tt, pluck(deg2midi(raga, d, SA - 12), ln * beat * 1.5 + 1, 0.8, 'veena'))
            tt += ln * beat
        t = tt + r.uniform(3, 6)
    ch = contour_voice(phrase_gen(raga, max(2, int(total / 10)), r, span=(-3, 3), rest_prob=0.05), total, 'choir', bpm=20, base=SA - 12, raga=raga, seed=seed)
    dm = np.zeros(int(total * SR)); t = 6.0
    while t < total - 2: place(dm, t, damaru_roll(1.2, 13, int(t)), 0.6); t += r.uniform(12, 20)
    return cue_mix(total, [(dr, 1.0, 0, None), (lowv, 1.2, -0.2, (0.5, IR_CAVE)), (ch, 0.9, 0.25, (0.5, IR_CAVE)), (dm, 0.7, 0.4, (0.3, IR_HALL))])

def cue_tension(total, seed=4, raga='marwa'):
    r = np.random.default_rng(seed)
    dr = tanpura(total, SA - 12, 6 if raga == 'marwa' else 7)
    sa = np.zeros(int(total * SR)); t = 2.0
    while t < total - 3:
        ev = phrase_gen(raga, 2, r, start=r.integers(-1, 4), span=(-3, 7), rest_prob=0.1)
        seg = contour_voice(ev, min(18, total - t), 'sarangi', bpm=44, base=SA, raga=raga, vib=0.01, seed=int(t))
        place(sa, t, seg); t += len(seg) / SR + r.uniform(2, 5)
    rumble = low(noise(int(total * SR), seed), 90) * 0.06 * (1 + 0.5 * np.sin(2 * np.pi * 0.07 * T(total)))
    dh = np.zeros(int(total * SR)); t = 0.0
    while t < total: place(dh, t, dhol_hit('nagara'), 0.5); t += r.choice([3.0, 4.5, 6.0])
    return cue_mix(total, [(dr, 0.7, 0, None), (sa, 1.0, -0.2, (0.35, IR_HALL)), (rumble, 1.0, 0, None), (dh, 0.6, 0.15, (0.4, IR_HALL))])

def cue_battle(total, seed=5, raga='darbari'):
    r = np.random.default_rng(seed)
    dh = dhol(total, 132, 1.0, 'war', seed)
    tb = tabla(total, 'laggi', 264, 0.7, seed=seed)
    sh = np.zeros(int(total * SR)); t = 1.0
    while t < total - 3:
        ev = phrase_gen(raga, 2, r, start=r.integers(2, 7), span=(0, 12), rest_prob=0.05)
        seg = contour_voice(ev, min(10, total - t), 'shehnai', bpm=132, base=SA, raga=raga, seed=int(t))
        place(sh, t, seg); t += len(seg) / SR + r.uniform(1, 3)
    mj = np.zeros(int(total * SR)); t = 0
    while t < total: place(mj, t, manjira(int(t * 3)), 0.6); t += 60 / 132
    return cue_mix(total, [(dh, 1.0, 0, (0.15, IR_HALL)), (tb, 0.7, 0.2, (0.1, IR_ROOM)), (sh, 0.9, -0.2, (0.25, IR_HALL)), (mj, 0.6, 0.4, None)])

def cue_sorrow(total, seed=6, raga='bhairavi'):
    r = np.random.default_rng(seed)
    dr = tanpura(total)
    sa = np.zeros(int(total * SR)); t = 1.0
    while t < total - 3:
        ev = phrase_gen(raga, 2, r, start=r.integers(0, 5), span=(-2, 8), rest_prob=0.08)
        seg = contour_voice(ev, min(20, total - t), 'sarangi', bpm=40, base=SA, raga=raga, vib=0.012, seed=int(t))
        place(sa, t, seg); t += len(seg) / SR + r.uniform(2, 4)
    return cue_mix(total, [(dr, 0.9, 0, None), (sa, 1.0, -0.1, (0.42, IR_HALL))])

def cue_title(total, seed=7):
    """Conch, temple bells and a dhol roll, then the Mahagatha theme on shehnai over dhol."""
    out_m = np.zeros(int((total + 3) * SR))
    place(out_m, 0.2, shankh(3.6), 1.0)
    for i in range(3): place(out_m, 0.5 + i * 1.3, ghanta(4, 880 if i % 2 == 0 else 660, i), 0.9)
    roll = np.zeros_like(out_m)
    for i in range(36): place(roll, 3.4 + i * 0.05, dhol_hit('tak'), 0.15 + i * 0.02)
    place(roll, 5.2, dhol_hit('nagara'), 1.4)
    ev = [(d, l) for d, l in THEME]
    th = contour_voice(ev, max(1, total - 5.4), 'shehnai', bpm=96, base=SA + 12, raga='hamsadhwani', seed=seed)
    th2 = contour_voice(ev, max(1, total - 5.4), 'bansuri', bpm=96, base=SA + 24, raga='hamsadhwani', seed=seed + 1)
    dh = dhol(max(1, total - 5.4), 96, 0.9, 'bhangra', seed)
    dr = tanpura(total)
    parts = [(out_m, 1.0, 0, (0.4, IR_TEMPLE)), (roll, 1.0, 0, (0.2, IR_HALL)), (dr, 0.7, 0, None)]
    pad = np.zeros(int((total + 3) * SR)); place(pad, 5.2, th, 1.0); parts.append((pad, 1.0, -0.15, (0.3, IR_HALL)))
    pad2 = np.zeros(int((total + 3) * SR)); place(pad2, 5.2, th2, 0.5); parts.append((pad2, 1.0, 0.25, (0.35, IR_HALL)))
    pad3 = np.zeros(int((total + 3) * SR)); place(pad3, 5.2, dh, 1.0); parts.append((pad3, 1.0, 0.0, (0.15, IR_HALL)))
    return cue_mix(total, parts)

def cue_wonder(total, seed=8):
    r = np.random.default_rng(seed); raga = 'yaman'
    dr = tanpura(total)
    sn = np.zeros(int(total * SR)); t = 0.5; beat = 60 / 66
    while t < total - 2:
        for d, ln in phrase_gen(raga, 2, r, start=r.integers(3, 8), span=(2, 13), rest_prob=0.1):
            if t >= total: break
            if d is not None:
                m = deg2midi(raga, d, SA)
                for k in range(int(ln * 4)): place(sn, t + k * beat / 4, pluck(m, 0.5, 0.45 if k else 0.7, 'santoor'))
            t += ln * beat
        t += beat * 2
    sw = np.zeros(int(total * SR)); t = 1.0
    while t < total - 2: place(sw, t, swarmandal(raga, True), 0.6); t += r.uniform(8, 13)
    ch = contour_voice(phrase_gen(raga, max(2, int(total / 9)), r, span=(0, 6), rest_prob=0.05), total, 'choir', bpm=24, base=SA, raga=raga, seed=seed)
    return cue_mix(total, [(dr, 0.8, 0, None), (sn, 1.0, -0.2, (0.3, IR_HALL)), (sw, 0.7, 0.3, None), (ch, 0.7, 0.15, (0.5, IR_HALL))])

def cue_curse(total, seed=9):
    r = np.random.default_rng(seed)
    ch = contour_voice([(0, 4), (1, 4), (0, 8), (-1, 4), (0, 8)] * 6, total, 'choir', bpm=30, base=SA - 12, raga='marwa', seed=seed)
    ch2 = contour_voice([(3, 4), (2, 4), (3, 8), (4, 4), (3, 8)] * 6, total, 'choir', bpm=30, base=SA - 12, raga='marwa', seed=seed + 1)
    trem = band(noise(int(total * SR), seed), 60, 200) * (0.6 + 0.4 * np.sin(2 * np.pi * 6 * T(total))) * 0.08
    dh = np.zeros(int(total * SR)); t = 0.5
    while t < total: place(dh, t, dhol_hit('nagara'), 0.8); t += r.choice([2.0, 3.0])
    return cue_mix(total, [(ch, 1.0, -0.2, (0.5, IR_CAVE)), (ch2, 0.8, 0.2, (0.5, IR_CAVE)), (trem, 1.0, 0, None), (dh, 0.8, 0, (0.4, IR_HALL))])

def cue_narad(total, seed=10):
    return cue_raga_gat(total, seed, 'desh', pluck_kind='santoor', theka='dadra', bpm=104, tabla_vol=0.7, manj=True)

def cue_devi(total, seed=11):
    r = np.random.default_rng(seed)
    base = cue_raga_gat(total, seed, 'durga', lead='shehnai', theka='keherwa', bpm=112, tabla_vol=0.6)
    dh = dhol(total, 112, 0.8, 'march', seed)
    bells = np.zeros(int(total * SR)); t = 0.0
    while t < total: place(bells, t, ghanta(3, 990, int(t)), 0.35); t += 60 / 112 * 8
    return base + cue_mix(total, [(dh, 1.0, 0.1, (0.2, IR_HALL)), (bells, 1.0, -0.3, (0.4, IR_TEMPLE))])

def cue_end(total, seed=12):
    ev = [(d, l) for d, l in THEME] * 3
    th = contour_voice(ev, total, 'bansuri', bpm=72, base=SA + 12, raga='hamsadhwani', seed=seed)
    sn = np.zeros(int(total * SR)); beat = 60 / 72; t = 0
    while t < total: place(sn, t, pluck(SA + [0, 7, 12, 7][int(t / beat) % 4], 1.2, 0.4, 'sitar')); t += beat
    return cue_mix(total, [(tanpura(total), 0.8, 0, None), (th, 1.0, -0.1, (0.4, IR_HALL)), (sn, 0.8, 0.2, (0.3, IR_HALL)), (tabla(total, 'keherwa', 72, 0.6), 0.8, 0.15, (0.15, IR_ROOM))])

CUES = {
    "cosmic": cue_cosmic, "malkauns": lambda total, seed=1: cue_cosmic(total, seed, 'malkauns'),
    "vishnu": lambda total, seed=2: cue_raga_gat(total, seed, 'yaman', 'bansuri', 'keherwa', 70),
    "brahma": lambda total, seed=3: cue_raga_gat(total, seed, 'bhairav', None, 'teentaal', 92, 'sitar'),
    "court": lambda total, seed=4: cue_raga_gat(total, seed, 'darbari', None, 'rupak', 80, 'sitar'),
    "shiva": cue_shiva, "tension": cue_tension, "battle": cue_battle, "sorrow": cue_sorrow, "title": cue_title,
    "wonder": cue_wonder, "curse": cue_curse, "narad": cue_narad, "devi": cue_devi, "end": cue_end,
    "joy": lambda total, seed=5: cue_raga_gat(total, seed, 'hamsadhwani', None, 'keherwa', 100, 'santoor', 0.8, True),
    "dawn": lambda total, seed=6: cue_raga_gat(total, seed, 'bhairav', 'bansuri', 'dadra', 66, None, 0.5),
    "drone": lambda total, seed=7: cue_mix(total, [(tanpura(total), 1.0, 0, None)]),
}


# ============================================================ ambience =====
def amb_ocean(n, seed=1):
    t = np.arange(n) / SR; out = np.zeros(n)
    for k, (per, ph) in enumerate(((7.0, 0), (9.3, 2), (11.1, 4))):
        env = np.clip(np.sin(2 * np.pi * t / per + ph), 0, 1) ** 2
        out += band(noise(n, seed + k), 200, 2500) * env * 0.05
    return out + low(noise(n, seed + 9), 200) * 0.03
def amb_wind(n, seed=2):
    t = np.arange(n) / SR
    return band(noise(n, seed), 150, 900) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * t) ** 2) * 0.06
def amb_void(n, seed=3):
    t = np.arange(n) / SR
    return low(noise(n, seed), 70) * 0.06 + np.sin(2 * np.pi * 41 * t) * 0.012 * (1 + np.sin(2 * np.pi * 0.1 * t))
def amb_birds(n, seed=4):
    r = np.random.default_rng(seed); out = np.zeros(n)
    for _ in range(int(n / SR / 1.6)):
        o = r.integers(0, max(1, n - SR)); L = int(r.uniform(0.06, 0.18) * SR); tt = np.arange(L) / SR
        f = r.uniform(2400, 4600) + 900 * np.sin(2 * np.pi * r.uniform(8, 22) * tt)
        out[o:o + L] += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.hanning(L) * 0.035
    if n > SR * 4:   # an occasional peacock / koel call
        for _ in range(int(n / SR / 25)):
            o = r.integers(0, n - SR * 2); L = int(0.9 * SR); tt = np.arange(L) / SR
            f = np.where(tt < 0.35, 900 + 600 * tt / 0.35, 1500 - 300 * (tt - 0.35))
            out[o:o + L] += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.hanning(L) * 0.03
    return out + amb_wind(n, seed) * 0.4
def amb_night(n, seed=5):
    r = np.random.default_rng(seed); t = np.arange(n) / SR; out = np.zeros(n)
    for f0, rate in ((4300, 2.8), (4700, 3.4), (3900, 2.1)):
        chirp = (np.sin(2 * np.pi * rate * t + r.uniform(0, 6)) > 0.55).astype(float)
        out += np.sin(2 * np.pi * f0 * t) * chirp * (np.sin(2 * np.pi * 38 * t) > 0) * 0.015
    return low(out, 6000) + amb_wind(n, seed) * 0.3
def amb_fire(n, seed=6):
    r = np.random.default_rng(seed); out = low(noise(n, seed), 400) * 0.05
    for _ in range(int(n / SR * 9)):
        o = r.integers(0, n - 500); out[o:o + 400] += band(noise(400, int(o)), 1000, 6000) * np.exp(-np.arange(400) / 60) * r.uniform(0.05, 0.25)
    return out
def amb_temple(n, seed=7):
    r = np.random.default_rng(seed); out = low(noise(n, seed), 300) * 0.02
    for _ in range(int(n / SR / 7)): place(out, r.uniform(0, n / SR - 4), ghanta(4, r.choice([660, 880, 990]), int(r.random() * 99)) * 0.25)
    return reverb(out, 0.4, IR_TEMPLE)
def amb_river(n, seed=8): return band(noise(n, seed), 400, 3000) * 0.03 * (1 + 0.3 * np.sin(np.arange(n) / SR * 1.3))
def amb_storm(n, seed=9):
    r = np.random.default_rng(seed); out = amb_wind(n, seed) * 2.2 + band(noise(n, seed + 1), 800, 7000) * 0.04
    for _ in range(int(n / SR / 9)): place(out, r.uniform(0, n / SR - 4), sfx_thunder() * 0.6)
    return out
def amb_court(n, seed=10): return low(noise(n, seed), 250) * 0.02 + amb_birds(n, seed) * 0.25
AMB = {"ocean": amb_ocean, "wind": amb_wind, "void": amb_void, "birds": amb_birds, "night": amb_night, "fire": amb_fire,
       "temple": amb_temple, "river": amb_river, "storm": amb_storm, "court": amb_court}


# ============================================================ sfx ==========
def sfx_thunder():
    n = int(4.5 * SR); t = np.arange(n) / SR
    return low(noise(n, 21), 240) * np.exp(-t / 1.3) * np.minimum(1, t / 0.03) * 1.4 + band(noise(n, 22), 1000, 5000) * np.exp(-t / 0.08) * 0.5
def sfx_whoosh():
    n = int(1.2 * SR); t = np.arange(n) / SR; e = np.sin(np.pi * t / 1.2) ** 2
    return band(noise(n, 23), 300, 3000) * e * 0.5
def sfx_boom():
    n = int(3 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (40 + 60 * np.exp(-t / 0.15)) * t) * np.exp(-t / 0.9) + low(noise(n, 24), 300) * np.exp(-t / 0.4) * 0.6
def sfx_clash():
    t = T(1.2); s = sum(np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, d in ((1840, 0.4), (2790, 0.3), (4120, 0.2), (5560, 0.15)))
    return s * 0.3 + band(noise(len(t), 25), 2000, 9000) * np.exp(-t / 0.03) * 0.8
def sfx_roar():
    n = int(2.2 * SR); t = np.arange(n) / SR; f = 70 + 30 * np.sin(np.pi * t / 2.2)
    s = sum(np.sin(k * 2 * np.pi * np.cumsum(f) / SR) / k for k in range(1, 20))
    s = np.tanh(s * 2) * (0.6 + 0.4 * band(noise(n, 26), 20, 60) * 5)
    return band(s, 60, 2500) * np.sin(np.pi * t / 2.2) ** 0.6 * 0.5 + band(noise(n, 27), 200, 1500) * np.sin(np.pi * t / 2.2) * 0.2
def sfx_sparkle(): return swarmandal('yaman', True, 18, SA + 12, 1.4) * 1.4
def sfx_descend(): return swarmandal('yaman', False, 18, SA + 12, 1.6) * 1.4
def sfx_om():
    n = 6.0; ev = [(0, 8)]
    s = contour_voice(ev, n, 'choir', bpm=60, base=SA - 12, raga='yaman', seed=3) + contour_voice([(4, 8)], n, 'choir', bpm=60, base=SA - 12, raga='yaman', seed=4) * 0.6
    s *= np.clip(T(n) / 1.5, 0, 1) * np.clip((n - T(n)) / 2.0, 0, 1)
    return reverb(s * 6, 0.5, IR_CAVE)
def sfx_crack():
    n = int(1.5 * SR); t = np.arange(n) / SR
    return band(noise(n, 28), 500, 6000) * np.exp(-t / 0.06) + np.sin(2 * np.pi * 60 * t) * np.exp(-t / 0.3) * 0.8
def sfx_swell():
    n = int(4 * SR); t = np.arange(n) / SR
    return reverb(band(noise(n, 29), 200, 4000) * (t / 4) ** 2 * 0.3 + sum(np.sin(2 * np.pi * hz(SA + d) * t) for d in (0, 7, 12, 19)) * (t / 4) ** 2 * 0.05, 0.4)
def sfx_veena():
    out = np.zeros(int(3 * SR))
    for i, d in enumerate((0, 2, 4, 7)): place(out, i * 0.07, pluck(SA + 12 + RAGAS['yaman'][d] if d < 7 else SA + 24, 2.2, 0.8, 'veena'))
    return reverb(out, 0.3)
def sfx_splash():
    n = int(1.6 * SR); t = np.arange(n) / SR
    return band(noise(n, 30), 300, 6000) * np.exp(-t / 0.3) * 0.6 + low(noise(n, 31), 300) * np.exp(-t / 0.15) * 0.5
def sfx_rumble():
    n = int(5 * SR); t = np.arange(n) / SR
    return low(noise(n, 32), 120) * np.sin(np.pi * t / 5) * 1.2
def sfx_fire():
    n = int(2.5 * SR); t = np.arange(n) / SR
    return (band(noise(n, 33), 200, 4000) * np.sin(np.pi * t / 2.5) * 0.4 + amb_fire(n, 34) * 3) * np.sin(np.pi * t / 2.5)
def sfx_magic():
    out = np.zeros(int(3 * SR))
    for i in range(10): place(out, i * 0.06, pluck(SA + 24 + RAGAS['hamsadhwani'][i % 5] + 12 * (i // 5), 1.2, 0.5, 'harp'))
    return reverb(out, 0.5)
def sfx_heartbeat():
    out = np.zeros(int(2 * SR))
    for b in (0, 0.25, 1.0, 1.25): place(out, b, membrane(52, 0.3, (1,), (0.06,), (1,), click=0.05) * 1.2)
    return out
def sfx_drumroll():
    out = np.zeros(int(3 * SR))
    for i in range(40): place(out, i * 0.06, dhol_hit('tak'), 0.1 + i * 0.015)
    place(out, 2.4, dhol_hit('nagara'), 1.4); return out

SFX = {"conch": lambda: shankh(3.4), "bell": lambda: ghanta(4, 880), "bells": lambda: sum_bells(), "gong": lambda: ghanta(6, 220) * 2.2,
       "thunder": sfx_thunder, "whoosh": sfx_whoosh, "boom": sfx_boom, "clash": sfx_clash, "roar": sfx_roar, "sparkle": sfx_sparkle,
       "descend": sfx_descend, "om": sfx_om, "crack": sfx_crack, "swell": sfx_swell, "veena": sfx_veena, "damaru": lambda: damaru_roll(1.8),
       "splash": sfx_splash, "rumble": sfx_rumble, "fire": sfx_fire, "magic": sfx_magic, "heartbeat": sfx_heartbeat, "drumroll": sfx_drumroll,
       "nagara": lambda: dhol_hit('nagara') * 2, "manjira": lambda: manjira() * 8}
def sfx_wind():
    n = int(3.5 * SR); t = np.arange(n) / SR
    g = band(noise(n, 41), 250, 1800) * np.sin(np.pi * t / 3.5) ** 2 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t))
    return reverb(g, 0.3)
SFX["wind"] = sfx_wind
def sum_bells():
    out = np.zeros(int(5 * SR))
    for i, f in enumerate((880, 990, 740, 1180)): place(out, i * 0.35, ghanta(4, f, i))
    return out
def sfx(name):
    if name not in SFX:
        print(f"  warning: unknown sfx {name}", file=sys.stderr); return np.zeros(SR // 10)
    s = SFX[name]()
    return s / (np.abs(s).max() + 1e-9) * 0.5


# ============================================================ voices =======
def kokoro_say(kokoro, text, voice, speed, cache_dir):
    key = hashlib.sha1(f"hi|{voice}|{speed}|{text}".encode()).hexdigest()[:16]
    path = os.path.join(cache_dir, "k_" + key + ".wav")
    if os.path.exists(path):
        return sf.read(path)[0]
    if "+" in voice or ":" in voice:
        parts = [(v.split(":") + ["1"])[:2] for v in voice.split("+")]
        tot = sum(float(w) for _, w in parts)
        style = sum(kokoro.get_voice_style(nm) * float(w) for nm, w in parts) / tot
        s, sr = kokoro.create(text, voice=style.astype(np.float32), speed=speed, lang="hi")
    else:
        s, sr = kokoro.create(text, voice=voice, speed=speed, lang="hi")
    nz = np.where(np.abs(s) > 0.01)[0]
    if len(nz): s = s[max(0, nz[0] - 600): nz[-1] + 2400]
    sf.write(path, s, sr)
    return s

def shift(sig, semis, formant, cache_dir, tag):
    """Pitch-shift a 24 kHz voice with ffmpeg rubberband (formant preserved or shifted)."""
    if not semis: return sig
    key = hashlib.sha1(f"{tag}|{semis}|{formant}".encode()).hexdigest()[:16]
    path = os.path.join(cache_dir, "p_" + key + ".wav")
    if os.path.exists(path): return sf.read(path)[0]
    with tempfile.TemporaryDirectory() as td:
        a, b = os.path.join(td, "a.wav"), os.path.join(td, "b.wav")
        sf.write(a, sig, KSR)
        ratio = 2 ** (semis / 12)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", a, "-af", f"rubberband=pitch={ratio:.5f}:formant={formant}:pitchq=quality", b], check=True)
        out = sf.read(b)[0]
    sf.write(path, out, KSR)
    return out

def treat(sig, fx, n_pad=0):
    """Character treatments, at 44.1 kHz."""
    pad = np.concatenate([sig, np.zeros(int(1.6 * SR))])
    if fx == "storyteller": return reverb(low(high(pad, 70), 9000) * 1.05, 0.12, IR_ROOM)
    if fx == "bright": return reverb(high(pad, 120), 0.1, IR_ROOM) * 1.05
    if fx == "divine": return reverb(pad + 0.25 * band(pad, 2500, 7000), 0.26, IR_HALL)
    if fx == "divine_big":
        sub = low(pad, 300) * 0.7
        return reverb(pad + sub, 0.32, IR_HALL)
    if fx == "elder": return reverb(pad * (1 + 0.06 * np.sin(2 * np.pi * 5.5 * np.arange(len(pad)) / SR)), 0.22, IR_HALL)
    if fx == "cave": return reverb(pad + 0.4 * low(pad, 250), 0.38, IR_CAVE)
    if fx in ("growl", "roar"):
        g = np.tanh(pad * 2.6) * 0.55 + pad * 0.5
        g = g + 0.35 * low(np.tanh(pad * 4), 400)
        return reverb(g, 0.2 if fx == "growl" else 0.32, IR_HALL)
    if fx == "chorus":   # four voices together, slightly apart in time and timbre
        out = pad.copy()
        for i, (d, gsh) in enumerate(((0.018, 0.9), (0.031, 0.85), (0.045, 0.8))):
            k = int(d * SR); x = np.roll(pad, k); x[:k] = 0; out += x * gsh * (1 + 0.003 * i)
        return reverb(out * 0.5, 0.25, IR_HALL)
    if fx == "child": return reverb(high(pad, 180), 0.12, IR_ROOM)
    if fx == "dream": return reverb(low(pad, 6000), 0.45, IR_HALL)
    if fx == "small": return reverb(high(pad, 250), 0.15, IR_ROOM) * 0.95
    if fx == "room": return reverb(pad, 0.1, IR_ROOM)
    return pad

def envelope(sig, dur, fps=30):
    n = int(np.ceil(dur * fps)); hop = SR / fps; out = []
    for i in range(n):
        seg = sig[int(i * hop): int((i + 1) * hop)]
        out.append(float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0)
    a = np.array(out); m = np.percentile(a, 95) if len(a) else 1
    a = np.clip(a / (m + 1e-9), 0, 1)
    a = np.where(a < 0.12, 0, a)
    return [round(float(x), 2) for x in a]

def voice_line(kokoro, ln, cast, cache):
    who = cast[ln["who"]]
    if who.get("twin") or who.get("duet"):
        ids = who.get("twin") or who.get("duet")
        sigs = [voice_line(kokoro, dict(ln, who=i), cast, cache)[0] for i in ids]
        n = max(len(s) for s in sigs); out = np.zeros(n)
        for k, s in enumerate(sigs): out[: len(s)] += s * (0.62 if who.get("twin") else 0.7)
        return out, sigs[0][: n]
    text = ln.get("say", ln["text"])
    sp = ln.get("speed", who.get("speed", 1.0))
    raw = kokoro_say(kokoro, text, who["voice"], sp, cache)
    sh = shift(raw, who.get("pitch", 0), who.get("formant", "preserved"), cache, f"{who['voice']}|{sp}|{text}")
    sig = resample_poly(sh, 147, 80)   # 24 kHz -> 44.1 kHz
    dry = sig.copy()
    sig = treat(sig, ln.get("fx", who.get("fx", "room")))
    return sig * 0.85, dry


# ============================================================ main =========
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("--models", default=os.environ.get("KOKORO_MODELS", os.path.expanduser("~/models")))
    ap.add_argument("--no-music", action="store_true")
    args = ap.parse_args()
    from kokoro_onnx import Kokoro
    model = os.path.join(args.models, "kokoro-v1.0.onnx")
    if not os.path.exists(model): model = os.path.join(args.models, "kokoro-v1.0.int8.onnx")
    kokoro = Kokoro(model, os.path.join(args.models, "voices-v1.0.bin"))

    ep_path = os.path.abspath(args.episode); out_dir = os.path.dirname(ep_path)
    cache = os.path.join(out_dir, ".voice-cache"); os.makedirs(cache, exist_ok=True)
    ep = json.load(open(ep_path, encoding="utf-8")); meta = ep["meta"]; cast = ep["cast"]
    gap = float(meta.get("gap", 0.5))

    clips, shots, regions_m, regions_a = [], [], [], []
    t = 0.2
    for seg in ep["sequence"]:
        seg_start = t
        if seg["type"] == "card" and not seg.get("lines"):
            dur = float(seg.get("dur", 4))
            if seg.get("sfx"):
                for k, nm in enumerate(str(seg["sfx"]).split(",")): clips.append((t + 0.2 + k * 0.6, sfx(nm.strip()), 0.8, 0))
            shots.append({"type": "card", "seg": seg["id"], "start": round(t, 3), "end": round(t + dur, 3)})
            t += dur
        else:
            if seg["type"] == "card":
                shots.append({"type": "card", "seg": seg["id"], "start": round(t, 3), "end": round(t + 1.0, 3)})
            t += float(seg.get("lead", 0.5))
            for i, ln in enumerate(seg["lines"]):
                if ln.get("sfx"):
                    for k, nm in enumerate(str(ln["sfx"]).split(",")):
                        clips.append((t + float(ln.get("sfxAt", 0)) + k * 0.45, sfx(nm.strip()), float(ln.get("sfxVol", 0.8)), float(ln.get("sfxPan", 0))))
                if not ln.get("text"):
                    dur = float(ln.get("dur", 2.0))
                    shots.append({"type": "line", "seg": seg["id"], "idx": i, "start": round(t, 3), "end": round(t + dur, 3), "env": [], "silent": True})
                    t += dur
                    continue
                print(f"  {ln['who']:9s} {ln['text'][:60]}", file=sys.stderr)
                sig, dry = voice_line(kokoro, ln, cast, cache)
                dur = len(dry) / SR
                clips.append((t, sig, float(ln.get("vol", 1.0)), 0))
                shots.append({"type": "line", "seg": seg["id"], "idx": i, "start": round(t, 3), "end": round(t + dur, 3), "env": envelope(dry, dur)})
                t += dur + float(ln.get("pause", gap))
            t += float(seg.get("tail", 0.6))
        cue = seg.get("music", {"open": "title", "title": "title", "end": "end", "next": "drone", "chapter": None}.get(seg.get("style")) if seg["type"] == "card" else None)
        regions_m.append([cue, seg_start, t, float(seg.get("musicVol", 1.0)), seg.get("musicCut", False)])
        regions_a.append([seg.get("amb") or [], seg_start, t, float(seg.get("ambVol", 1.0))])
    total = t + 1.5
    N = int(total * SR) + SR

    voice = np.zeros((N, 2))
    for start, sig, g, pan in clips:
        place2(voice, start, sig, g, pan)

    music = np.zeros((N, 2))
    if not args.no_music:
        merged = []
        for cue, a, b, v, cut in regions_m:
            if merged and merged[-1][0] == cue and abs(merged[-1][2] - a) < 0.5 and not cut: merged[-1][2] = b
            else: merged.append([cue, a, b, v, cut])
        for idx, (cue, a, b, v, cut) in enumerate(merged):
            if not cue: continue
            L = b - a + 2.5
            print(f"  music {cue:9s} {a:7.1f}-{b:7.1f}", file=sys.stderr)
            sig = CUES[cue](L, seed=idx + 3)
            rms = np.sqrt(np.mean(sig[: int(min(L, 40) * SR)] ** 2)) + 1e-9
            sig = sig * (0.07 / rms) if cue not in ("title",) else sig * (0.11 / rms)
            fi, fo = int(1.0 * SR), int(2.4 * SR)
            if cue not in ("title",): sig[:fi] *= np.linspace(0, 1, fi)[:, None]
            sig[-fo:] *= np.linspace(1, 0, fo)[:, None]
            place2(music, max(0, a - 0.3), sig, v)
    # duck under dialogue
    gain = np.full(N, 1.0)
    for sh in shots:
        aa, bb = int(sh["start"] * SR), int(sh["end"] * SR)
        if sh["type"] == "line" and not sh.get("silent"): gain[max(0, aa - int(0.2 * SR)): bb + int(0.3 * SR)] = 0.42
    k = int(0.5 * SR); c = np.cumsum(np.insert(gain, 0, 0)); sm = (c[k:] - c[:-k]) / k; gain[: len(sm)] = sm
    mix = music * gain[:, None] * float(meta.get("musicLevel", 0.62))

    amb = np.zeros((N, 2))
    for names, a, b, v in regions_a:
        if not names: continue
        L = int((b - a + 1.6) * SR)
        for j, nm in enumerate(names):
            s1 = AMB[nm](L, seed=int(a * 10) % 997 + j); s2 = AMB[nm](L, seed=int(a * 10) % 997 + j + 50)
            sig = np.stack([s1, s2], axis=1)
            f = int(0.8 * SR); sig[:f] *= np.linspace(0, 1, f)[:, None]; sig[-f:] *= np.linspace(1, 0, f)[:, None]
            place2(amb, max(0, a - 0.6), sig, v)
    mix += amb * float(meta.get("ambLevel", 1.0))
    mix += voice
    # gentle bus compression + limiter
    peak = np.abs(mix).max()
    if peak > 0.98: mix *= 0.98 / peak
    sf.write(os.path.join(out_dir, "episode.wav"), mix.astype(np.float32), SR)
    json.dump({"duration": round(total, 3), "envFps": 30, "shots": shots}, open(os.path.join(out_dir, "timeline.json"), "w"))
    print(f"wrote episode.wav + timeline.json ({total:.1f}s = {total / 60:.1f} min, {len(shots)} shots)", file=sys.stderr)


if __name__ == "__main__":
    main()
