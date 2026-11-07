#!/usr/bin/env python3
"""Narration, score and effects for the Ramayana pop-up book.

Lays out the scenes (a page turn, then each narration line with a gap), speaks every line with Kokoro, scores each
scene with a Mahagatha raga cue (crossfaded, ducked under the voice), and adds a paper page-flip and pop-up clicks
at every page turn plus the scene effects.
Output, next to episode.json: episode.wav and timeline.json
Usage: python3 ramayana/engine/build_audio.py ramayana/episode/episode.json --models ~/models
"""
import argparse, hashlib, json, os, sys
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "mahagatha", "engine"))
import build_audio as mb   # noqa: E402

SR = mb.SR


def say(kokoro, text, voice, speed, cache):
    key = hashlib.sha1(f"en-gb|{voice}|{speed}|{text}".encode()).hexdigest()[:16]
    path = os.path.join(cache, key + ".wav")
    if not os.path.exists(path):
        parts = [(v.split(":") + ["1"])[:2] for v in voice.split("+")]
        tot = sum(float(w) for _, w in parts)
        style = sum(kokoro.get_voice_style(n) * float(w) for n, w in parts) / tot
        s, sr = kokoro.create(text, voice=style.astype(np.float32), speed=speed, lang="en-gb")
        nz = np.where(np.abs(s) > 0.01)[0]
        s = s[max(0, nz[0] - 600): nz[-1] + 2400]
        sf.write(path, s, sr)
    s = sf.read(path)[0]
    return resample_poly(s, 147, 80)


def page_flip(seed=0):
    n = int(0.9 * SR); t = np.arange(n) / SR
    env = np.exp(-((t - 0.32) / 0.16) ** 2) + 0.5 * np.exp(-((t - 0.62) / 0.05) ** 2)
    x = mb.band(mb.noise(n, seed + 50), 700, 7000) * env * 0.5
    x += mb.low(mb.noise(n, seed + 51), 400) * np.exp(-((t - 0.64) / 0.03) ** 2) * 0.9   # the page landing
    return x


def pop(seed=0, f=520):
    t = mb.T(0.25)
    return (np.sin(2 * np.pi * f * t * (1 + 0.6 * np.exp(-t / 0.03))) * np.exp(-t / 0.05) * 0.35
            + mb.band(mb.noise(len(t), seed + 70), 1500, 6000) * np.exp(-t / 0.008) * 0.25)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("--models", default=os.path.expanduser("~/models"))
    a = ap.parse_args()
    from kokoro_onnx import Kokoro
    kokoro = Kokoro(os.path.join(a.models, "kokoro-v1.0.onnx"), os.path.join(a.models, "voices-v1.0.bin"))
    ep_path = os.path.abspath(a.episode); out_dir = os.path.dirname(ep_path)
    cache = os.path.join(out_dir, ".voice-cache"); os.makedirs(cache, exist_ok=True)
    ep = json.load(open(ep_path)); meta = ep["meta"]
    turn, gap = meta["turn"], meta["gap"]

    voice_clips, fx_clips, scenes = [], [], []
    t = 0.0
    for si, sc in enumerate(ep["scenes"]):
        start = t
        t += turn + (0.8 if si == 0 else 0)          # the cover opens on the first page
        lines = []
        for ln in sc["lines"]:
            sig = say(kokoro, ln["text"], meta["voice"], meta["speed"], cache)
            d = len(sig) / SR
            voice_clips.append((t, sig))
            lines.append({"start": round(t, 3), "end": round(t + d, 3), "label": ln["label"], "text": ln["text"]})
            t += d + gap
        t += sc.get("hold", 0.9)
        scenes.append({"id": sc["id"], "start": round(start, 3), "end": round(t, 3), "lines": lines, "cue": sc["cue"]})
        fx_clips.append((start + (0.7 if si == 0 else 0.15), page_flip(si), 0.9))
        for k in range(5):
            fx_clips.append((start + turn * 0.62 + (0.8 if si == 0 else 0) + k * 0.13, pop(si * 10 + k, 480 + 90 * k), 0.5))
        for li, off, name in sc.get("sfx", []):
            fx_clips.append((lines[li]["start"] + off, mb.sfx(name), 0.75))
    total = t + 0.3

    n = int((total + 1) * SR)
    music = np.zeros((n, 2))
    xf = 1.2
    for sc in scenes:
        s0 = max(0, sc["start"] - xf / 2); s1 = min(total, sc["end"] + xf / 2)
        seg = mb.CUES[sc["cue"]](s1 - s0 + 0.5)[: int((s1 - s0) * SR)]
        env = np.ones(len(seg)); k = int(xf * SR)
        if sc is not scenes[0]: env[:k] = np.linspace(0, 1, k)
        if sc is not scenes[-1]: env[-k:] = np.linspace(1, 0, k)
        else: env[-int(2.5 * SR):] = np.linspace(1, 0, int(2.5 * SR))
        mb.place2(music, s0, seg * env[:, None] / (np.abs(seg).max() + 1e-9), 1.0)

    voice = np.zeros(n)
    for at, sig in voice_clips: mb.place(voice, at, sig)
    voice = mb.reverb(voice, 0.08, mb.IR_ROOM)[:n]
    # duck the score under narration
    act = np.convolve((np.abs(voice) > 0.02).astype(float), np.ones(int(0.25 * SR)) / int(0.25 * SR), "same")
    act = np.clip(act * 6, 0, 1)
    act = np.convolve(act, np.ones(int(0.4 * SR)) / int(0.4 * SR), "same")
    duck = 0.55 - 0.33 * act
    mix = music * duck[:, None] * 0.6
    mix += np.stack([voice, voice], 1) / (np.abs(voice).max() + 1e-9) * 0.62
    fx = np.zeros((n, 2))
    for at, sig, g in fx_clips: mb.place2(fx, at, sig, g, 0.0)
    mix += fx * 0.8
    mix = mix[: int(total * SR)]
    mix = np.tanh(mix * 1.1) / np.tanh(1.1) * 0.95
    sf.write(os.path.join(out_dir, "episode.wav"), mix.astype(np.float32), SR)
    json.dump({"duration": round(total, 3), "fps": meta["fps"], "scenes": scenes},
              open(os.path.join(out_dir, "timeline.json"), "w"), indent=1)
    print(f"wrote episode.wav ({total:.1f}s) and timeline.json")


if __name__ == "__main__":
    main()
