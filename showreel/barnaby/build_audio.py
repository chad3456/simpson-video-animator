"""Synthesise the showreel soundtrack: an upbeat 112 bpm groove, typing ticks and a whoosh on every cut.
Usage: python3 build_audio.py  (reads cuts.json written by render.mjs; writes showreel.wav)"""
import json, wave, numpy as np
SR = 44100
meta = json.load(open('cuts.json'))
dur = meta['duration'] + 0.5
n = int(SR * dur); mix = np.zeros(n)
rng = np.random.default_rng(7)
def add(sig, t, g=1.0):
    i = int(t * SR); j = min(n, i + len(sig))
    if i < n: mix[i:j] += sig[:j - i] * g
def env(L, a=0.002, d=0.2):
    x = np.arange(int(L * SR)) / SR
    return np.minimum(1, x / a) * np.exp(-x / d)
def kick():
    x = np.arange(int(.35 * SR)) / SR; f = 50 + 120 * np.exp(-x * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 9)
def clap():
    L = .18; return rng.standard_normal(int(L * SR)) * env(L, .001, .05)
def hat():
    L = .05; s = rng.standard_normal(int(L * SR)); s = np.diff(s, prepend=0); return s * env(L, .0005, .012)
def pluck(f, L=.35, d=.12):
    x = np.arange(int(L * SR)) / SR
    return (np.sign(np.sin(2 * np.pi * f * x)) * .3 + np.sin(2 * np.pi * f * x)) * env(L, .003, d)
def bass(f, L=.25):
    x = np.arange(int(L * SR)) / SR
    return np.tanh(2.5 * np.sin(2 * np.pi * f * x)) * env(L, .004, .15)
bpm = 112; beat = 60 / bpm
note = lambda m: 440 * 2 ** ((m - 69) / 12)
prog = [[60, 64, 67, 71], [57, 60, 64, 67], [65, 69, 72, 76], [67, 71, 74, 77]]  # Cmaj7 Am7 Fmaj7 G7
roots = [36, 33, 41, 43]
nb = int(dur / beat)
for b in range(nb):
    t = b * beat; bar = b // 4; ch = prog[bar % 4]
    intro = t < 6.0          # the stacking open is lighter: no kick
    if not intro: add(kick(), t, .9)
    if b % 2 == 1 and not intro: add(clap(), t, .35)
    for h in range(2): add(hat(), t + h * beat / 2, .25 if h else .15)
    if not intro:
        add(bass(note(roots[bar % 4])), t, .35); add(bass(note(roots[bar % 4] + 12), .15), t + beat * .75, .2)
    if b % 4 in (0, 2):
        for k, m in enumerate(ch): add(pluck(note(m + 12)), t + beat * .5 + k * .01, .09)
    if b % 4 == 3: add(pluck(note(ch[(b // 4) % 4] + 24), .5, .2), t + beat * .5, .08)
# whoosh on cuts
for c in meta['cuts'][1:]:
    L = .4; w = rng.standard_normal(int(L * SR)); x = np.linspace(0, 1, len(w))
    w = np.convolve(w, np.ones(30) / 30, 'same') * np.sin(np.pi * x) ** 2
    add(w, c - .25, .5)
# typing ticks during the typed lines (approximate windows, ~15 chars/s)
for a, b, cps in [(0.3, 5.0, 1.7), (6.2, 12.4, 15), (33.7, 35.6, 18), (45.8, 48.6, 20), (63.8, 65.6, 18)]:
    t = a
    while t < b:
        L = .02; tk = rng.standard_normal(int(L * SR)) * env(L, .0003, .004); add(tk, t, .5); t += 1 / cps * rng.uniform(.8, 1.2)
# drops in the stack open
for t in [1.0, 1.5, 2.0, 2.5, 3.0, 3.8]: add(kick(), t, .6)
# fade in/out, normalise
fi = int(.05 * SR); mix[:fi] *= np.linspace(0, 1, fi); fo = int(1.5 * SR); mix[-fo:] *= np.linspace(1, 0, fo)
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.2) * .85
pcm = (mix * 32767).astype(np.int16)
with wave.open('showreel.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote showreel.wav', round(dur, 1), 's')
