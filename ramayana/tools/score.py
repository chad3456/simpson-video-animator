# Original score for the film: tanpura drone, a bansuri-like line in raga Bhupali, a frame drum for the war. numpy only.
# usage: python3 ramayana/tools/score.py out.wav [seconds]
import sys, wave, numpy as np
out = sys.argv[1]; T = float(sys.argv[2]) if len(sys.argv) > 2 else 607.0; sr = 44100; N = int(T * sr)
rng = np.random.default_rng(108); L = np.zeros(N); Rr = np.zeros(N)
SA = 146.83
def add(buf, start, sig, gain=1.0):
    i = int(start * sr); j = min(N, i + len(sig))
    if i < N: buf[i:j] += sig[: j - i] * gain
# tanpura: Pa, Sa', Sa', Sa plucked in a slow cycle, rich in harmonics with the characteristic slow bloom
def pluck(f, dur=5.5):
    t = np.arange(int(dur * sr)) / sr; s = np.zeros_like(t)
    for h in range(1, 14): s += np.sin(2 * np.pi * f * h * t + rng.uniform(0, 6.28)) * (1 / h ** 0.9) * np.exp(-t * (0.25 + 0.05 * h)) * (0.6 + 0.4 * np.sin(2 * np.pi * (0.35 + 0.03 * h) * t + h))
    return s * np.minimum(1, t / 0.03)
cyc = [SA * 1.5, SA * 2, SA * 2, SA]; plucks = {f: pluck(f) for f in set(cyc)}
t0 = 0.0; k = 0
while t0 < T:
    f = cyc[k % 4]; add(L, t0, plucks[f], 0.05 * (1.1 if k % 2 else 0.9)); add(Rr, t0 + 0.012, plucks[f], 0.05 * (0.9 if k % 2 else 1.1)); t0 += 1.35 if k % 4 != 3 else 1.6; k += 1
# flute: phrases wander over the five notes, gliding and breathing; quieter, longer notes in the grief chapters
scale = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3]; notes = [SA * 2 * r * o for o in (0.5, 1, 2) for r in scale]
def flute(f0, f1, dur, vol):
    n = int(dur * sr); t = np.arange(n) / sr; g = np.minimum(1, t / 0.12); f = f0 + (f1 - f0) * np.minimum(1, t / 0.09) ** 0.5
    f = f * (1 + 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / 0.5)); ph = 2 * np.pi * np.cumsum(f) / sr
    env = g * np.minimum(1, (dur - t) / 0.25); noise = rng.normal(0, 1, n); noise = np.convolve(noise, np.ones(30) / 30, 'same') * 0.5
    return (np.sin(ph) + 0.28 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph) + noise * 0.25) * env * vol
t0 = 5.0; idx = 6; prev = notes[idx]
while t0 < T - 8:
    war = t0 > 540; dark = 150 < t0 < 215 or 300 < t0 < 380
    for _ in range(rng.integers(3, 8)):
        idx = int(np.clip(idx + rng.choice([-2, -1, -1, 1, 1, 2]), 2, 12)); f = notes[idx]; d = rng.choice([0.5, 0.75, 1.0, 1.5, 2.2]) * (1.4 if dark else 0.8 if war else 1)
        s = flute(prev, f, d, 0.11 if not dark else 0.085); pan = 0.5 + 0.2 * np.sin(t0 * 0.2); add(L, t0, s, 1 - pan); add(Rr, t0, s, pan); prev = f; t0 += d * 0.96
        if t0 > T - 8: break
    t0 += rng.uniform(1.5, 4.5) * (1.5 if dark else 0.6 if war else 1)
# frame drum from the first battle onward
def drum(f=62, dur=0.7):
    t = np.arange(int(dur * sr)) / sr; return np.sin(2 * np.pi * (f + 40 * np.exp(-t * 30)) * t) * np.exp(-t * 7)
dm = drum(); dm2 = drum(96, 0.3); t0 = 541.0
while t0 < 595:
    add(L, t0, dm, 0.3); add(Rr, t0, dm, 0.3); add(L, t0 + 0.5, dm2, 0.12); add(Rr, t0 + 0.75, dm2, 0.12); t0 += 1.5
# room: a few feedback echoes
for buf in (L, Rr):
    for d, gn in ((0.19, 0.3), (0.31, 0.22), (0.47, 0.15)):
        k = int(d * sr); buf[k:] += buf[:-k] * gn
m = np.stack([L, Rr], 1); fade = np.minimum(1, np.arange(N) / (2 * sr)) * np.minimum(1, (N - np.arange(N)) / (5 * sr)); m *= fade[:, None]; m = np.tanh(m * 1.6) / np.max(np.abs(np.tanh(m * 1.6))) * 0.9
w = wave.open(out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((m * 32767).astype('<i2').tobytes()); w.close(); print('wrote', out, T)
