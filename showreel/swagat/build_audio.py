"""Synthesise the Swagat showreel soundtrack: a festive 100 bpm keherwa groove on a synthetic dholak,
a tanpura drone, santoor-like plucks in raga Yaman, ghungroo shakers, typing ticks, a whoosh on every
cut and fireworks in the family scene. Usage: python3 build_audio.py (reads cuts.json; writes showreel.wav)"""
import json, wave, numpy as np
SR = 44100
meta = json.load(open('cuts.json'))
dur = meta['duration'] + 0.5
n = int(SR * dur); mix = np.zeros(n)
rng = np.random.default_rng(11)
def add(sig, t, g=1.0):
    i = int(t * SR); j = min(n, i + len(sig))
    if 0 <= i < n: mix[i:j] += sig[:j - i] * g
def env(L, a=0.002, d=0.2):
    x = np.arange(int(L * SR)) / SR
    return np.minimum(1, x / a) * np.exp(-x / d)
note = lambda m: 440 * 2 ** ((m - 69) / 12)
def dha(f0=95):   # dholak bass head: pitch glides up a little after the stroke
    x = np.arange(int(.5 * SR)) / SR; f = f0 * (1 + .25 * (1 - np.exp(-x * 12)))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 6)
def na():         # treble head slap
    L = .12; x = np.arange(int(L * SR)) / SR
    return (np.sin(2 * np.pi * 520 * x) * .6 + rng.standard_normal(len(x)) * .4) * env(L, .0005, .03)
def ghungroo():
    L = .09; s = rng.standard_normal(int(L * SR)); s = np.diff(s, prepend=0); s = np.diff(s, prepend=0)
    return s * env(L, .004, .025) * .3
def santoor(f, L=1.2):
    x = np.arange(int(L * SR)) / SR
    s = sum(np.sin(2 * np.pi * f * k * x * (1 + .0008 * k)) / k ** 1.3 for k in range(1, 7))
    return s * env(L, .001, .35) * (1 + .3 * np.sin(2 * np.pi * 5 * x) * np.exp(-x * 2))
def bell(f, L=2.5):
    x = np.arange(int(L * SR)) / SR
    return (np.sin(2 * np.pi * f * x) + .5 * np.sin(2 * np.pi * f * 2.76 * x) + .3 * np.sin(2 * np.pi * f * 5.4 * x)) * env(L, .001, .7)
# tanpura drone on D: Pa Sa Sa Sa', slow plucks with a buzzy tone
SA = 50  # D3
def tanpura(f, L=3.0):
    x = np.arange(int(L * SR)) / SR
    s = sum(np.sin(2 * np.pi * f * k * x + .3 * np.sin(2 * np.pi * .7 * x)) * (.8 ** k) for k in range(1, 10))
    return s * env(L, .05, 1.6)
t = 0; seq = [SA - 5, SA + 12, SA + 12, SA]
k = 0
while t < dur:
    add(tanpura(note(seq[k % 4])), t, .045); t += 0.9; k += 1
bpm = 100; beat = 60 / bpm; nb = int(dur / beat)
# Yaman (D): D E F# G# A B C#
scale = [0, 2, 4, 6, 7, 9, 11]
melody = [7, 9, 11, 12, 11, 9, 7, 6, 4, 6, 7, 4, 2, 0, 2, 4]
for b in range(nb):
    t = b * beat
    intro = t < 6.0
    # keherwa: dha ge na ti | na ka dhi na  (as eighth notes)
    for h, (stroke, g) in enumerate([('dha', .9), ('ge', .5), ('na', .6), ('ti', .3), ('na', .5), ('ka', .3), ('dhi', .7), ('na', .5)]):
        if b % 4 not in (0, 2) or intro: break
        tt = t + h * beat / 2
        if stroke in ('dha', 'ge', 'dhi'): add(dha(95 if stroke != 'ge' else 80), tt, g * .7)
        if stroke in ('dha', 'na', 'dhi', 'ti', 'ka'): add(na(), tt, g * .35)
    add(ghungroo(), t, .5); add(ghungroo(), t + beat / 2, .3)
    if b % 2 == 0:
        m = melody[(b // 2) % len(melody)]
        add(santoor(note(SA + 24 + m)), t, .07)
        if b % 8 == 0: add(santoor(note(SA + 12 + m)), t + beat * .5, .05)
    if b % 16 == 0: add(bell(note(SA + 36)), t, .05)
# whoosh on cuts
for c in meta['cuts'][1:]:
    L = .4; w = rng.standard_normal(int(L * SR)); x = np.linspace(0, 1, len(w))
    w = np.convolve(w, np.ones(30) / 30, 'same') * np.sin(np.pi * x) ** 2
    add(w, c - .25, .45)
# typing ticks
for a, b, cps in meta.get('typing', []):
    t = a
    while t < b:
        L = .02; tk = rng.standard_normal(int(L * SR)) * env(L, .0003, .004); add(tk, t, .45); t += 1 / cps * rng.uniform(.8, 1.2)
# fireworks in the family scene (scene index 21 in cuts)
fam = meta['cuts'][-3]
for s in [2.2, 3.0, 3.6, 4.6, 5.2, 6.0, 6.8, 7.4]:
    add(dha(60) * .8, fam + s, .5)
    for i in range(40):
        L = .015; c = rng.standard_normal(int(L * SR)) * env(L, .0002, .003); add(c, fam + s + .1 + rng.uniform(0, .9), .25 * rng.uniform(.3, 1))
# a bell for the logo reveal and the sign-off
add(bell(note(SA + 24)), meta['cuts'][5] + 2.6, .25); add(bell(note(SA + 31)), meta['cuts'][-2] + 3.4, .25)
fi = int(.05 * SR); mix[:fi] *= np.linspace(0, 1, fi); fo = int(1.8 * SR); mix[-fo:] *= np.linspace(1, 0, fo)
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.3) * .85
pcm = (mix * 32767).astype(np.int16)
with wave.open('showreel.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote showreel.wav', round(dur, 1), 's')
