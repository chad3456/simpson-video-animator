#!/usr/bin/env python3
"""Voice, score and ambience pass for the anime show.

Voices every line with Kokoro (shared helper from engine/build_audio.py), writes an original piano-and-strings
score from note events (a waltz main theme, a night theme, a playful theme, a grief theme, a dream theme, a
music-box memory theme), lays room tone and weather under each scene, and mixes:
  <episode>/episode.wav, <episode>/timeline.json (same contract as the other shows, plus per-line envelopes)

Line options: thought (inner voice: softer, roomy), phone (band-limited), memory (warm, distant), vo (narration),
sfx, dur (silent beats), pause. Segment options: music (cue name or null), musicVol, amb ([names]), ambVol.
Usage: python3 anime/engine/build_audio.py anime/episodes/<slug>/episode.json [--models ~/models]
"""
import argparse, json, os, sys
import numpy as np
import soundfile as sf
from scipy.signal import fftconvolve, butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__))
import importlib.util
_spec = importlib.util.spec_from_file_location("toon_audio", os.path.join(HERE, "..", "..", "engine", "build_audio.py"))
_toon = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(_toon)
speak, envelope, SR = _toon.speak, _toon.envelope, _toon.SR

rng0 = np.random.default_rng(7)
note_hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)


# ================= instruments =================
_piano_cache = {}
def piano(m, vel=0.6, dur=1.5):
    """Additive piano: slightly inharmonic partials, two detuned strings, per-partial decay, hammer thump."""
    key = (m, round(vel, 2), round(dur, 2))
    if key in _piano_cache: return _piano_cache[key]
    f = note_hz(m); rel = 0.35
    n = int((dur + rel + 0.05) * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    base_decay = np.interp(m, [36, 60, 84, 100], [7.0, 4.2, 1.8, 0.8])
    bright = 0.5 + 0.8 * vel
    for k in range(1, 11):
        fk = f * k * np.sqrt(1 + 0.00035 * k * k)
        if fk > SR / 2.2: break
        amp = (1 / k ** (1.9 - 0.7 * bright)) * (1 if k < 4 else 0.7)
        dec = base_decay / (1 + 0.55 * (k - 1))
        for det in (-0.6, 0.6):
            out += amp * np.sin(2 * np.pi * fk * (1 + det / 1731) * t + k) * np.exp(-t / dec) * 0.5
    att = np.minimum(1, t / 0.004)
    off = np.clip((dur + rel - t) / rel, 0, 1)
    out *= att * off
    hn = int(0.012 * SR); out[:hn] += rng0.standard_normal(hn) * np.exp(-np.arange(hn) / (0.002 * SR)) * 0.08 * vel
    out *= vel * 0.22
    _piano_cache[key] = out
    return out

def strings(notes, dur, vol=0.5, att=1.4, rel=1.8, bright=0.6):
    """Ensemble pad: three detuned voices of a soft saw, gentle vibrato, slow swell."""
    n = int((dur + rel) * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    vib = 1 + 0.0025 * np.sin(2 * np.pi * 5.2 * t)
    for m in notes:
        f = note_hz(m)
        for det in (-0.004, 0, 0.0045):
            ph = 2 * np.pi * f * (1 + det) * np.cumsum(vib) / SR
            for k, a in ((1, 1.0), (2, 0.45 * bright), (3, 0.22 * bright), (4, 0.1 * bright), (5, 0.05 * bright)):
                out += np.sin(k * ph + det * 100) * a
    env = np.minimum(1, t / att) * np.clip((dur + rel - t) / rel, 0, 1)
    return out * env * vol * 0.018 / max(1, len(notes) ** 0.5)

def celesta(m, vel=0.5, dur=1.8):
    t = np.arange(int(dur * SR)) / SR; f = note_hz(m)
    s = sum(np.sin(2 * np.pi * f * h * t) * a * np.exp(-t / d) for h, a, d in ((1, 1, 1.4), (4.0, 0.25, 0.25), (2.0, 0.2, 0.6)))
    return s * np.minimum(1, t / 0.003) * vel * 0.16


# ================= reverb =================
def make_ir(rt=2.4, seed=3):
    r = np.random.default_rng(seed); n = int(rt * SR); t = np.arange(n) / SR
    ir = r.standard_normal(n) * np.exp(-6.9 * t / rt)
    sos = butter(2, 5000, 'low', fs=SR, output='sos'); ir = sosfilt(sos, ir)
    for d, g in ((0.011, 0.5), (0.019, 0.4), (0.027, 0.32), (0.041, 0.25)): ir[int(d * SR)] += g * 3
    return ir / np.sqrt(np.sum(ir ** 2))
IR = make_ir(); IR_SMALL = make_ir(0.9, 5)
def reverb(x, wet=0.3, ir=None):
    w = fftconvolve(x, IR if ir is None else ir)[: len(x)]
    return x * (1 - wet) + w * wet * 0.9


# ================= score =================
def place(buf, at, sig, gain=1.0):
    o = int(at * SR)
    if o >= len(buf): return
    e = min(len(buf), o + len(sig)); buf[o:e] += sig[: e - o] * gain

# D major waltz: the main theme (original). bars of (chord, melody [(beat, midi, beats)])
THEME = [
    ((50, 57, 62, 66), [(0, 69, 1), (1, 74, 1), (2, 78, 1)]),
    ((47, 54, 59, 62), [(0, 78, 2), (2, 76, 1)]),
    ((43, 55, 59, 62), [(0, 74, 1), (1, 76, 1), (2, 79, 1)]),
    ((45, 57, 61, 64), [(0, 76, 3)]),
    ((50, 57, 62, 66), [(0, 69, 1), (1, 74, 1), (2, 78, 1)]),
    ((42, 54, 57, 61), [(0, 81, 2), (2, 78, 1)]),
    ((43, 55, 59, 62), [(0, 79, 1), (1, 78, 1), (2, 76, 1)]),
    ((45, 57, 61, 64), [(0, 76, 2), (2, 73, 1)]),
    ((47, 54, 59, 62), [(0, 74, 1), (1, 78, 1), (2, 83, 1)]),
    ((43, 55, 59, 62), [(0, 83, 2), (2, 81, 1)]),
    ((42, 57, 62, 66), [(0, 81, 1), (1, 78, 1), (2, 74, 1)]),
    ((40, 55, 59, 64), [(0, 79, 2), (2, 78, 1)]),
    ((43, 55, 59, 62), [(0, 76, 1), (1, 74, 1), (2, 71, 1)]),
    ((45, 57, 61, 64), [(0, 73, 1), (1, 76, 1), (2, 81, 1)]),
    ((50, 57, 62, 66), [(0, 78, 3)]),
    ((50, 57, 62, 69), [(0, 74, 3)]),
]

def cue_theme(total, strings_on=True, solo=False, bpm=84, seed=1):
    beat = 60 / bpm; bar = 3 * beat
    out = np.zeros(int((total + 4) * SR)); pad = np.zeros_like(out)
    t = 0.0; rep = 0
    while t < total:
        for bi, (ch, mel) in enumerate(THEME):
            if t >= total: break
            bass, *chord = ch
            place(out, t, piano(bass - 12 if bi % 2 == 0 else bass, 0.45, bar * 0.95))
            if not solo:
                for b in (1, 2):
                    for m in chord: place(out, t + b * beat, piano(m, 0.26, beat * 0.8))
            else:
                for j, m in enumerate(chord + [chord[1] + 12]): place(out, t + j * beat * 0.75, piano(m, 0.22, bar))
            for (b, m, ln) in mel:
                v = 0.62 if rep % 2 == 0 else 0.7
                place(out, t + b * beat + (0.012 if b else 0), piano(m + (12 if (rep % 2 and not solo) else 0), v, ln * beat * 0.98))
                if rep % 2 and not solo: place(out, t + b * beat, piano(m, 0.38, ln * beat * 0.98))
            if strings_on and rep % 2 == 1:
                place(pad, t, strings([c + 12 for c in chord] + [bass], bar * 1.02, 0.7))
            t += bar
        rep += 1
    return reverb(out + pad, 0.32)

def _arp_cue(total, chords, bpm, pattern, vel, mel_pool, mel_prob, seed, pad_vol=0.35, celeste=False, bars_per=1, beats=4):
    r = np.random.default_rng(seed); beat = 60 / bpm; bar = beats * beat
    out = np.zeros(int((total + 5) * SR)); pad = np.zeros_like(out)
    t = 0.0; i = 0
    while t < total:
        ch = chords[i % len(chords)]
        for rep in range(bars_per):
            for step, idx in pattern:
                m = ch[idx % len(ch)] + 12 * (idx // len(ch))
                place(out, t + step * beat + r.uniform(0, 0.015), (celesta if celeste else piano)(m, vel * r.uniform(0.8, 1.05), beat * 1.6))
            if r.random() < mel_prob:
                for k in range(r.integers(1, 4)):
                    m = r.choice(mel_pool)
                    place(out, t + r.integers(0, beats) * beat, piano(int(m), vel * 1.35, beat * 2.2))
            t += bar
        if pad_vol: place(pad, t - bar * bars_per, strings(ch[:3], bar * bars_per * 1.02, pad_vol, att=2.5))
        i += 1
    return reverb(out + pad, 0.38)

def cue_night(total, seed=2):
    chords = [(50, 57, 61, 66, 69), (47, 54, 57, 62, 66), (43, 50, 54, 59, 62), (45, 52, 57, 61, 64)]   # Dmaj7 Bm7 Gmaj7 A
    pattern = [(0, 0), (0.5, 1), (1, 2), (1.5, 3), (2, 4), (2.5, 3), (3, 2), (3.5, 1)]
    return _arp_cue(total, chords, 64, pattern, 0.2, [74, 76, 78, 81, 83, 86], 0.45, seed, 0.25, bars_per=2)

def cue_tease(total, seed=3):
    beat = 60 / 108; bar = 4 * beat
    chords = [(43, 55, 59, 62), (40, 55, 59, 64), (36, 52, 55, 60), (38, 54, 57, 62)]   # G Em C D
    motif = [[(0, 71), (0.5, 74), (1, 79), (2, 78), (2.5, 76), (3, 74)], [(0, 76), (0.5, 79), (1.5, 83), (2, 81), (3, 79)],
             [(0, 72), (0.5, 76), (1, 79), (1.5, 84), (2.5, 83), (3, 81)], [(0, 78), (1, 74), (1.5, 76), (2, 78), (3, 81), (3.5, 79)]]
    out = np.zeros(int((total + 4) * SR)); t = 0.0; i = 0; r = np.random.default_rng(seed)
    while t < total:
        bass, *ch = chords[i % 4]
        for b in range(4): place(out, t + b * beat, piano(bass if b % 2 == 0 else bass + 7, 0.32, beat * 0.45))
        for b in (0.5, 1.5, 2.5, 3.5): [place(out, t + b * beat, piano(m, 0.16, beat * 0.25)) for m in ch]
        if i % 8 >= 4 or r.random() < 0.6:
            for (b, m) in motif[i % 4]: place(out, t + b * beat, piano(m, 0.42, beat * 0.3))
        t += bar; i += 1
    return reverb(out, 0.24, IR_SMALL)

def cue_sorrow(total, seed=4):
    beat = 60 / 58; bar = 3 * beat
    prog = [(45, 57, 60, 64), (41, 57, 60, 65), (48, 55, 60, 64), (40, 56, 59, 64), (45, 57, 60, 64), (38, 53, 57, 62), (40, 55, 59, 64), (40, 56, 59, 64)]
    mel = [[(0, 76, 2), (2, 74, 1)], [(0, 72, 3)], [(0, 71, 1), (1, 72, 1), (2, 76, 1)], [(0, 71, 3)], [(0, 76, 1), (1, 77, 1), (2, 76, 1)], [(0, 74, 3)], [(0, 72, 1), (1, 71, 1), (2, 69, 1)], [(0, 68, 3)]]
    out = np.zeros(int((total + 6) * SR)); pad = np.zeros_like(out); t = 0.0; i = 0
    while t < total:
        bass, *ch = prog[i % 8]
        place(out, t, piano(bass - 12, 0.32, bar))
        for j, m in enumerate(ch): place(out, t + (j + 1) * beat * 0.66, piano(m, 0.18, bar))
        for (b, m, ln) in mel[i % 8]: place(out, t + b * beat, piano(m, 0.4 if (i // 8) % 2 == 0 else 0.48, ln * beat))
        place(pad, t, strings([bass, bass + 12], bar * 1.02, 0.55, att=2.0, bright=0.4))
        t += bar; i += 1
    return reverb(out + pad, 0.4)

def cue_wonder(total, seed=5):
    chords = [(53, 60, 64, 67, 71), (55, 62, 66, 69, 74), (52, 59, 64, 67, 71), (50, 57, 62, 66, 69)]
    pattern = [(0, 4), (0.5, 3), (1, 2), (1.5, 4), (2, 1), (2.5, 3), (3, 2), (3.5, 4)]
    return _arp_cue(total, [tuple(m + 12 for m in c) for c in chords], 60, pattern, 0.45, [], 0, seed, 0.45, celeste=True, bars_per=2)

def cue_memory(total, seed=6):
    """The main theme on a music box: high celesta, slow, with a soft pad."""
    beat = 60 / 72; bar = 3 * beat
    out = np.zeros(int((total + 4) * SR)); pad = np.zeros_like(out); t = 0.0
    while t < total:
        for ch, mel in THEME:
            if t >= total: break
            for (b, m, ln) in mel: place(out, t + b * beat, celesta(m + 12, 0.55, ln * beat + 1.2))
            place(out, t, celesta(ch[0] + 24, 0.3, bar + 1))
            place(pad, t, strings(ch[1:], bar * 1.02, 0.25, att=2.0))
            t += bar
    return reverb(out + pad, 0.45)

def cue_unease(total, seed=7):
    r = np.random.default_rng(seed); out = np.zeros(int((total + 6) * SR)); pad = np.zeros_like(out)
    t = 0.0
    while t < total:
        place(pad, t, strings([38, 45], 8.5, 0.6, att=3, bright=0.3))
        for k in range(3):
            place(out, t + 1 + k * 2.6 + r.uniform(0, 0.4), piano(int(r.choice([50, 53, 56, 57, 49])), 0.28, 3))
        t += 8
    return reverb(out + pad, 0.45)

def cue_hope(total, seed=8):
    return cue_theme(total, strings_on=True, solo=False, bpm=92, seed=seed) * 1.0

def cue_eyecatch(total, seed=9):
    out = np.zeros(int((total + 3) * SR))
    for i, m in enumerate((74, 78, 81, 86)): place(out, i * 0.32, celesta(m, 0.7, 2.2))
    place(out, 1.3, piano(62, 0.3, 2)); place(out, 1.3, piano(69, 0.25, 2))
    return reverb(out, 0.4)

CUES = {"theme": cue_theme, "night": cue_night, "tease": cue_tease, "sorrow": cue_sorrow, "wonder": cue_wonder, "memory": cue_memory,
        "unease": cue_unease, "hope": cue_hope, "eyecatch": cue_eyecatch,
        "piano": lambda total, seed=1: cue_theme(total, strings_on=False, solo=True, bpm=76)}


# ================= ambience =================
def _noise(n, seed): return np.random.default_rng(seed).standard_normal(n)
def _band(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def _low(x, f): return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)

def amb_washer(n, seed=1):
    t = np.arange(n) / SR
    hum = np.sin(2 * np.pi * 50 * t) * 0.25 + np.sin(2 * np.pi * 100 * t) * 0.12
    rumble = _low(_noise(n, seed), 180) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.42 * t)) * 2.2
    slosh = _band(_noise(n, seed + 1), 300, 1400) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.42 * t) ** 8) * 0.4
    buzz = np.sin(2 * np.pi * 120 * t) * 0.03
    return (hum + rumble + slosh + buzz) * 0.05

def amb_crickets(n, seed=2):
    r = np.random.default_rng(seed); t = np.arange(n) / SR; out = np.zeros(n)
    for f0, rate in ((4300, 2.8), (4700, 3.4), (3900, 2.1)):
        chirp = (np.sin(2 * np.pi * rate * t + r.uniform(0, 6)) > 0.55).astype(float)
        trill = np.sin(2 * np.pi * 38 * t) > 0
        out += np.sin(2 * np.pi * f0 * t) * chirp * trill * 0.04
    return _low(out, 6000) + _band(_noise(n, seed + 5), 200, 900) * 0.01

def amb_rain(n, seed=3):
    hiss = _band(_noise(n, seed), 800, 7000) * 0.06
    r = np.random.default_rng(seed + 1); drops = np.zeros(n)
    for _ in range(int(n / SR * 30)):
        o = r.integers(0, n - 800); d = np.exp(-np.arange(800) / 90) * np.sin(np.arange(800) * r.uniform(0.2, 0.6))
        drops[o:o + 800] += d * r.uniform(0.02, 0.08)
    return hiss + drops + _low(_noise(n, seed + 2), 300) * 0.04

def amb_storm(n, seed=4):
    t = np.arange(n) / SR
    wind = _band(_noise(n, seed), 150, 900) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * t) + 0.3 * np.sin(2 * np.pi * 0.19 * t)) * 0.12
    return amb_rain(n, seed + 1) * 1.6 + wind

def amb_wind(n, seed=5):
    t = np.arange(n) / SR
    return _band(_noise(n, seed), 120, 700) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * t) ** 2) * 0.08

def amb_city(n, seed=6):
    t = np.arange(n) / SR; out = _low(_noise(n, seed), 400) * 0.05
    r = np.random.default_rng(seed)
    for _ in range(int(n / SR / 25) + 1):   # a distant car passing
        L = min(6 * SR, n); o = r.integers(0, max(1, n - L)); e = np.sin(np.pi * np.arange(L) / L) ** 2
        out[o:o + L] += _band(_noise(L, int(o)), 200, 1200) * e * 0.06
    return out

def amb_room(n, seed=7): return _low(_noise(n, seed), 250) * 0.025

def amb_train(n, seed=8):
    t = np.arange(n) / SR
    clack = np.zeros(n)
    period = 1.1
    for k in range(int(n / SR / period)):
        for d in (0, 0.13):
            o = int((k * period + d) * SR); L = int(0.08 * SR)
            if o + L < n: clack[o:o + L] += _noise(L, k)[:L] * np.exp(-np.arange(L) / 300) * 0.25
    return _low(_noise(n, seed), 160) * 0.12 + _low(clack, 2000) + np.sin(2 * np.pi * 70 * t) * 0.02

def amb_birds(n, seed=9):
    r = np.random.default_rng(seed); out = np.zeros(n)
    for _ in range(int(n / SR / 2.5)):
        o = r.integers(0, max(1, n - SR)); L = int(r.uniform(0.08, 0.2) * SR); tt = np.arange(L) / SR
        f = r.uniform(2500, 4200) + 900 * np.sin(2 * np.pi * r.uniform(8, 20) * tt)
        out[o:o + L] += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.hanning(L) * 0.05
    return out + amb_city(n, seed) * 0.6

def amb_snow(n, seed=10): return amb_wind(n, seed) * 0.5 + _low(_noise(n, seed + 3), 120) * 0.015

AMB = {"washer": amb_washer, "crickets": amb_crickets, "rain": amb_rain, "storm": amb_storm, "wind": amb_wind, "city": amb_city,
       "room": amb_room, "train": amb_train, "birds": amb_birds, "snow": amb_snow}


# ================= sound effects =================
def _env(n, a, d): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def sfx_page():
    n = int(0.5 * SR); return _band(_noise(n, 11), 1500, 7000) * np.sin(np.pi * np.arange(n) / n) ** 1.5 * 0.25
def sfx_can():
    n = int(0.6 * SR); click = _band(_noise(int(0.03 * SR), 12), 2000, 8000) * 0.6
    fizz = _band(_noise(n, 13), 3000, 9000) * _env(n, 0.005, 0.15) * 0.25
    out = fizz; out[:len(click)] += click; return out
def sfx_vending():
    n = int(0.9 * SR); t = np.arange(n) / SR
    thunk = np.sin(2 * np.pi * (90 + 40 * np.exp(-t / 0.03)) * t) * _env(n, 0.002, 0.12) * 0.7
    rattle = _band(_noise(n, 14), 400, 3000) * _env(n, 0.002, 0.06) * 0.3
    return thunk + np.roll(rattle, int(0.05 * SR))
def sfx_meow():
    n = int(0.75 * SR); t = np.arange(n) / SR
    f = 520 + 260 * np.sin(np.pi * np.clip(t / 0.75, 0, 1)) - 120 * (t / 0.75)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = sum(np.sin(k * ph) * a for k, a in ((1, 1), (2, 0.6), (3, 0.35), (4, 0.2)))
    return _band(s, 300, 4000) * np.sin(np.pi * t / 0.75) ** 0.8 * 0.22
def sfx_purr():
    n = int(2.5 * SR); t = np.arange(n) / SR
    return _low(_noise(n, 15), 300) * (0.5 + 0.5 * np.sin(2 * np.pi * 24 * t)) * np.sin(np.pi * t / 2.5) * 0.25
def sfx_bell():   # door chime of the laundry
    out = np.zeros(int(2.2 * SR)); place(out, 0, celesta(88, 0.8, 2)); place(out, 0.18, celesta(84, 0.8, 2)); return reverb(out, 0.3)
def sfx_buzzer():
    n = int(1.2 * SR); t = np.arange(n) / SR
    return np.sign(np.sin(2 * np.pi * 440 * t)) * ((t % 0.4) < 0.25) * 0.05
def sfx_steps():
    out = np.zeros(int(2.6 * SR))
    for i in range(6):
        L = int(0.07 * SR); place(out, i * 0.42, _low(_noise(L, 20 + i), 900) * _env(L, 0.002, 0.02) * 0.6)
    return out
def sfx_phone():
    n = int(1.6 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 180 * t) * (np.sin(2 * np.pi * 30 * t) > 0) * (((t % 0.8) < 0.4)) * 0.12
def sfx_thunder():
    n = int(4 * SR); t = np.arange(n) / SR
    return _low(_noise(n, 21), 220) * (np.exp(-t / 1.2) * np.minimum(1, t / 0.05)) * 1.2
def sfx_crossing():
    out = np.zeros(int(4 * SR))
    for i in range(8): place(out, i * 0.48, celesta(81, 0.5, 0.5) + celesta(84, 0.3, 0.5)[: int(0.5 * SR)])
    return reverb(out, 0.3)
def sfx_umbrella():
    n = int(0.35 * SR); return _band(_noise(n, 22), 400, 4000) * _env(n, 0.01, 0.06) * 0.5
def sfx_door():
    return sfx_bell() * 0.8
def sfx_pencil():
    n = int(1.2 * SR); t = np.arange(n) / SR
    return _band(_noise(n, 23), 2500, 8000) * (0.5 + 0.5 * np.sin(2 * np.pi * 6 * t)) * 0.05
def sfx_wind():
    return amb_wind(int(3 * SR), 30) * np.sin(np.pi * np.arange(int(3 * SR)) / (3 * SR)) * 3
def sfx_train():
    n = int(6 * SR); e = np.sin(np.pi * np.arange(n) / n) ** 2
    return amb_train(n, 31) * e * 2
def sfx_heartbeat():
    out = np.zeros(int(2 * SR))
    for b in (0, 0.25, 1.0, 1.25):
        L = int(0.15 * SR); tt = np.arange(L) / SR; place(out, b, np.sin(2 * np.pi * 55 * tt) * np.exp(-tt / 0.04) * 0.6)
    return out
def sfx_thump():
    n = int(0.5 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (60 + 50 * np.exp(-t / 0.03)) * t) * np.exp(-t / 0.09) + _low(_noise(n, 24), 1200) * np.exp(-t / 0.03) * 0.5
def sfx_chime():
    out = np.zeros(int(3 * SR))
    for i, m in enumerate((79, 83, 86, 91)): place(out, i * 0.09, celesta(m, 0.5, 2.5))
    return reverb(out, 0.4)

SFX = {"page": sfx_page, "can": sfx_can, "vending": sfx_vending, "meow": sfx_meow, "purr": sfx_purr, "bell": sfx_bell, "buzzer": sfx_buzzer,
       "steps": sfx_steps, "phone": sfx_phone, "thunder": sfx_thunder, "crossing": sfx_crossing, "umbrella": sfx_umbrella, "door": sfx_door,
       "pencil": sfx_pencil, "wind": sfx_wind, "train": sfx_train, "heartbeat": sfx_heartbeat, "chime": sfx_chime, "thump": sfx_thump}


# ================= voice treatments =================
def sfx(name):
    s = SFX[name]()
    return s / (np.abs(s).max() + 1e-9) * 0.32


def treat(sig, ln):
    if ln.get("phone"):
        return _band(sig, 350, 3200) * 1.4
    if ln.get("thought"):
        return reverb(_low(sig, 7000), 0.28, IR_SMALL) * 0.92
    if ln.get("memory"):
        return reverb(_low(sig, 4200), 0.4) * 0.85
    return sig


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("--models", default=os.environ.get("KOKORO_MODELS", os.path.expanduser("~/models")))
    args = ap.parse_args()
    from kokoro_onnx import Kokoro
    model = os.path.join(args.models, "kokoro-v1.0.onnx")
    if not os.path.exists(model): model = os.path.join(args.models, "kokoro-v1.0.int8.onnx")
    kokoro = Kokoro(model, os.path.join(args.models, "voices-v1.0.bin"))

    ep_path = os.path.abspath(args.episode); out_dir = os.path.dirname(ep_path)
    cache = os.path.join(out_dir, ".voice-cache"); os.makedirs(cache, exist_ok=True)
    ep = json.load(open(ep_path)); meta = ep["meta"]; cast = ep["cast"]
    gap = meta.get("gap", 0.55)

    clips, shots, regions_m, regions_a = [], [], [], []
    t = 0.3
    for seg in ep["sequence"]:
        seg_start = t
        if seg["type"] == "card":
            dur = seg.get("dur", 4)
            if seg.get("sfx"): clips.append((t, sfx(seg["sfx"]), 0.8))
            shots.append({"type": "card", "seg": seg["id"], "start": round(t, 3), "end": round(t + dur, 3)})
            t += dur + seg.get("pause", 0.2)
        else:
            t += seg.get("lead", 0.6)   # a breath of room tone before the first line
            for i, ln in enumerate(seg["lines"]):
                who = cast.get(ln.get("who") or "", {})
                if ln.get("sfx"):
                    for k, name in enumerate(str(ln["sfx"]).split(",")):
                        clips.append((t + ln.get("sfxAt", 0) + k * 0.5, sfx(name.strip()), ln.get("sfxVol", 0.8)))
                if not ln.get("text") or who.get("kind"):
                    dur = ln.get("dur", 2.0)
                    shots.append({"type": "line", "seg": seg["id"], "idx": i, "start": round(t, 3), "end": round(t + dur, 3), "env": [], "silent": True})
                    t += dur + ln.get("pause", 0.15)
                    continue
                print(f"  {ln.get('who', '?'):8s} {ln['text'][:70]}", file=sys.stderr)
                sig = speak(kokoro, ln.get("say", ln["text"]), who["voice"], ln.get("speed", who.get("speed", 1.0)), cache)
                dur = len(sig) / SR
                sig2 = treat(sig, ln)
                clips.append((t, sig2, ln.get("vol", 1.0)))
                shots.append({"type": "line", "seg": seg["id"], "idx": i, "start": round(t, 3), "end": round(t + dur, 3),
                              "env": [] if ln.get("thought") or ln.get("vo") else envelope(sig, dur)})
                t += dur + ln.get("pause", gap)
            t += seg.get("tail", 0.4)
        if seg.get("music", None) is not None or seg["type"] == "card":
            cue = seg.get("music", {"op": "theme", "ed": "piano", "eyecatch": "eyecatch", "title": None}.get(seg.get("style"), None))
            regions_m.append([cue, seg_start, t, seg.get("musicVol", 1.0)])
        else:
            regions_m.append([None, seg_start, t, 1.0])
        regions_a.append([seg.get("amb") or [], seg_start, t, seg.get("ambVol", 1.0)])
    total = t + 1.0
    N = int(total * SR) + SR

    mix = np.zeros(N); voice = np.zeros(N)
    for start, sig, g in clips: place(voice, start, sig, g)

    # --- music: merge consecutive regions of the same cue so the piece continues across cuts ---
    merged = []
    for cue, a, b, v in regions_m:
        if merged and merged[-1][0] == cue and abs(merged[-1][2] - a) < 0.5 and cue not in ("eyecatch",): merged[-1][2] = b
        else: merged.append([cue, a, b, v])
    music = np.zeros(N)
    for idx, (cue, a, b, v) in enumerate(merged):
        if not cue: continue
        L = b - a + 2.5
        sig = CUES[cue](L, seed=idx + 1) if cue != "eyecatch" else CUES[cue](L)
        n = min(len(sig), int(L * SR)); sig = sig[:n].copy()
        rms = np.sqrt(np.mean(sig[: int(min(L, 30) * SR)] ** 2)) + 1e-9
        sig *= 0.075 / rms if cue != "eyecatch" else 1.0   # every cue sits at the same loudness
        fi, fo = int(1.2 * SR), int(2.2 * SR)
        sig[:fi] *= np.linspace(0, 1, fi) if cue not in ("theme", "eyecatch", "piano") else 1
        sig[-fo:] *= np.linspace(1, 0, fo)
        place(music, max(0, a - 0.2), sig, v)
    # duck under dialogue, breathe up in silences and on cards
    gain = np.full(N, 0.95)
    for sh in shots:
        aa, bb = int(sh["start"] * SR), int(sh["end"] * SR)
        if sh["type"] == "card": gain[aa:bb] = 1.15
        elif not sh.get("silent"): gain[max(0, aa - int(0.15 * SR)):bb + int(0.25 * SR)] = 0.36
    k = int(0.6 * SR); c = np.cumsum(np.insert(gain, 0, 0)); sm = (c[k:] - c[:-k]) / k; gain[: len(sm)] = sm
    mix += music * gain * meta.get("musicLevel", 0.55)

    # --- ambience ---
    amb = np.zeros(N)
    for names, a, b, v in regions_a:
        if not names: continue
        L = int((b - a + 1.6) * SR)
        sig = sum(AMB[nm](L, seed=int(a * 10) % 997 + j) for j, nm in enumerate(names))
        f = int(0.8 * SR); sig[:f] *= np.linspace(0, 1, f); sig[-f:] *= np.linspace(1, 0, f)
        place(amb, max(0, a - 0.6), sig, v)
    mix += amb * meta.get("ambLevel", 1.0)

    mix += voice
    peak = np.abs(mix).max()
    if peak > 0.97: mix *= 0.97 / peak
    sf.write(os.path.join(out_dir, "episode.wav"), mix.astype(np.float32), SR)
    json.dump({"duration": round(total, 3), "envFps": 30, "shots": shots}, open(os.path.join(out_dir, "timeline.json"), "w"))
    print(f"wrote episode.wav + timeline.json ({total:.1f}s = {total / 60:.1f} min, {len(shots)} shots)", file=sys.stderr)


if __name__ == "__main__":
    main()
