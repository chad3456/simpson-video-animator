import os
import numpy as np, wave
SR = 44100
DUR = 93.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
SA = 146.83  # D
def f(semi): return SA * 2 ** (semi / 12)

def add(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if i >= N: return
    s = sig[: j - i] * gain
    L[i:j] += s * np.sqrt(0.5 * (1 - pan)); R[i:j] += s * np.sqrt(0.5 * (1 + pan))

def tanpura(freq, dur=4.0):
    t = np.arange(int(dur * SR)) / SR
    s = np.zeros_like(t)
    for k in range(1, 18):
        # jawari: upper partials swell slightly then decay
        amp = (1 / k ** 0.9) * (1 + 0.6 * np.sin(np.pi * np.minimum(t / (0.6 + k * 0.08), 1)) * (k > 3))
        s += amp * np.sin(2 * np.pi * freq * k * t * (1 + 0.0004 * k) + rng.uniform(0, 6))
    env = (1 - np.exp(-t * 40)) * np.exp(-t * 0.55)
    return s * env * 0.06

def flute(freq_path, durs, t0, gain=0.22, vib=5.2):
    """freq_path: list of semitones; durs: list of seconds. portamento between notes."""
    total = sum(durs); n = int(total * SR); t = np.arange(n) / SR
    fr = np.zeros(n); edges = np.cumsum([0] + durs)
    for i, (sm, d) in enumerate(zip(freq_path, durs)):
        a, b = int(edges[i] * SR), int(edges[i + 1] * SR)
        fr[a:b] = f(sm)
    # glide: smooth frequency with ~60ms window
    w = int(0.06 * SR); k = np.ones(w) / w
    fr = np.convolve(np.pad(fr, (w, w), mode='edge'), k, mode='same')[w:-w]
    vibd = 0.006 * np.minimum(1, t / 0.8) * np.sin(2 * np.pi * vib * t)
    ph = 2 * np.cumsum(np.pi * fr * (1 + vibd)) / SR
    s = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    breath = rng.standard_normal(n); breath = np.convolve(breath, np.ones(8) / 8, 'same') * 0.05
    env = np.ones(n)
    for i in range(len(durs)):  # gentle articulation at each new (non-tied) note
        a = int(edges[i] * SR); m = min(n - a, int(0.05 * SR))
        if i == 0 or freq_path[i] != freq_path[i - 1]: env[a:a + m] *= np.linspace(0.55, 1, m)
    fade = int(0.25 * SR); env[:fade] *= np.linspace(0, 1, fade); env[-int(0.6 * SR):] *= np.linspace(1, 0, int(0.6 * SR))
    add((s + breath * (1 + s * 0)) * env, t0, pan=0.15, gain=gain)

def santoor(semi, t0, gain=0.12, pan=-0.3):
    t = np.arange(int(2.5 * SR)) / SR; fr = f(semi)
    s = sum((1 / k) * np.sin(2 * np.pi * fr * k * t * (1 + 0.0015 * k)) * np.exp(-t * (2 + k)) for k in range(1, 7))
    s += 0.5 * np.sin(2 * np.pi * fr * 1.003 * t) * np.exp(-t * 2.5)
    add(s * (1 - np.exp(-t * 300)), t0, pan, gain)

def bell(t0, base=880, gain=0.25, pan=0.0):
    t = np.arange(int(6 * SR)) / SR
    parts = [(0.5, 1.0, 0.9), (1.0, 0.8, 1.3), (1.19, 0.5, 1.8), (1.56, 0.4, 2.2), (2.0, 0.35, 2.6), (2.74, 0.25, 3.5), (3.4, 0.2, 4.5)]
    s = sum(a * np.sin(2 * np.pi * base * r * t) * np.exp(-t * d) for r, a, d in parts)
    add(s * (1 - np.exp(-t * 500)), t0, pan, gain)

def manjira(t0, gain=0.08):
    t = np.arange(int(1.2 * SR)) / SR
    s = sum(np.sin(2 * np.pi * fr * t) for fr in (3150, 4270, 5530, 6980)) * np.exp(-t * 3.5)
    add(s * (1 - np.exp(-t * 800)), t0, rng.uniform(-0.5, 0.5), gain)

def tabla(kind, t0, gain=0.3):
    t = np.arange(int(0.8 * SR)) / SR
    if kind == 'ge':   # bayan: low, pitch bending down
        fr = 95 * (1 + 0.35 * np.exp(-t * 12)); s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 5)
    elif kind == 'na':  # dayan ring on Sa
        fr = f(12); s = (np.sin(2 * np.pi * fr * t) + 0.5 * np.sin(2 * np.pi * fr * 2.01 * t) + 0.3 * np.sin(2 * np.pi * fr * 3.02 * t)) * np.exp(-t * 9)
    elif kind == 'ti':
        s = rng.standard_normal(len(t)) * np.exp(-t * 60) * 0.6 + np.sin(2 * np.pi * f(12) * t) * np.exp(-t * 30) * 0.4
    else:  # dha = ge + na
        tabla('ge', t0, gain); tabla('na', t0, gain * 0.8); return
    add(s * (1 - np.exp(-t * 900)), t0, 0.05, gain)

# ---- tanpura drone throughout: Pa(low) Sa Sa Sa(low)
t = 0.0; step = 0.62
while t < DUR - 3:
    for semi in (-5, 0, 0, -12):
        add(tanpura(f(semi)), t, pan=-0.2 if semi < 0 else 0.25, gain=1.0)
        t += step
    t += 0.4

bell(0.3, 740, 0.22); bell(0.9, 988, 0.12, 0.4)

# ---- alap (Yaman: ni. re ga re sa)
alap = [(-1, 1.2), (2, 0.8), (4, 1.6), (2, 0.6), (0, 1.8)]
flute([a for a, _ in alap], [d for _, d in alap], 1.0, gain=0.2)

# ---- bhajan theme, Yaman, keherwa at 84 bpm
BEAT = 60 / 84
theme = [
    [4, 4, 4, 2, 4, 6, 7, 7], [7, 6, 4, 2, 4, 4, 2, 0],
    [-1, 2, 4, 6, 7, 7, 9, 7], [6, 4, 2, 4, 2, 2, 0, 0],
    [7, 7, 9, 11, 12, 12, 12, 12], [11, 14, 12, 11, 9, 9, 7, 7],
    [6, 7, 9, 7, 6, 4, 2, 4], [2, 4, 2, -1, 0, 0, 0, 0],
]
def play_theme(t0, octave=0, gain=0.22, stop=1e9):
    notes = [n + octave for bar in theme for n in bar]
    ds = [BEAT] * len(notes)
    # merge repeats into ties so the melody breathes
    path, durs = [], []
    for n, d in zip(notes, ds):
        if path and path[-1] == n: durs[-1] += d
        else: path.append(n); durs.append(d)
    # cut at stop
    tt, p2, d2 = t0, [], []
    for n, d in zip(path, durs):
        if tt + d > stop: break
        p2.append(n); d2.append(d); tt += d
    # phrase by bar pairs so breath gaps appear
    flute(p2, d2, t0, gain=gain)
    return t0 + sum(d2)

T1 = 7.0
end1 = play_theme(T1)
end2 = play_theme(end1 + BEAT, octave=0, gain=0.2, stop=81.0)

# santoor arpeggios on beats 1 and 5 of each bar, through the theme
bars = int((81 - T1) / (8 * BEAT))
chords = [[0, 4, 7], [-1, 2, 7], [0, 4, 9], [-1, 2, 6]]
for b in range(bars):
    tb = T1 + b * 8 * BEAT
    ch = chords[b % 4]
    for k, semi in enumerate(ch): santoor(semi + 12, tb + k * BEAT / 3, 0.08)
    for k, semi in enumerate(ch): santoor(semi + 12, tb + 4 * BEAT + k * BEAT / 3, 0.06, 0.3)

# tabla keherwa from the 2nd bar to 80s
pattern = ['dha', 'ge', 'na', 'ti', 'na', 'ka', 'dhi', 'na']
tb = T1 + 8 * BEAT
while tb < 80.5:
    for k, bol in enumerate(pattern):
        kind = {'dha': 'dha', 'dhi': 'dha', 'ge': 'ge', 'na': 'na', 'ti': 'ti', 'ka': 'ti'}[bol]
        tabla(kind, tb + k * BEAT, 0.22 if k in (0, 6) else 0.16)
    tb += 8 * BEAT

# ---- Diwali finale: bells, manjira, cadence to Sa
for k in range(16): manjira(81 + k * BEAT, 0.07)
bell(81.0, 740, 0.25); bell(82.4, 988, 0.15, -0.4); bell(84.5, 1175, 0.12, 0.4); bell(87.0, 740, 0.2)
flute([7, 9, 11, 12, 11, 14, 12], [0.6, 0.6, 0.6, 1.4, 0.5, 0.7, 6.0], 81.2, gain=0.2)

# ---- reverb (FFT convolution with a decaying-noise impulse)
irn = int(2.2 * SR); ti = np.arange(irn) / SR
def reverb(x, seed):
    ir = np.random.default_rng(seed).standard_normal(irn) * np.exp(-ti * 3.2); ir[0] = 0
    nfft = 1 << int(np.ceil(np.log2(len(x) + irn)))
    y = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]
    return y / np.max(np.abs(ir)) * 0.02
Lw = L + reverb(L, 1) * 1.0; Rw = R + reverb(R, 2) * 1.0
out = np.stack([Lw, Rw], 1)
fo = int(4 * SR); out[-fo:] *= np.linspace(1, 0, fo)[:, None]
out /= np.max(np.abs(out)) / 0.89
w = wave.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'music.wav'), 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out * 32767).astype('<i2').tobytes()); w.close()
print('ok', end1, end2)
