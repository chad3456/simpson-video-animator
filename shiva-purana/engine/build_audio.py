#!/usr/bin/env python3
"""Voices, score, ambience and effects for the Shiva Purana comic, in English or the Hindi dub.

Reuses the Mahagatha sound engine (Indian-instrument score on ragas, ambience beds, effects, character voice
treatments and the mouth envelope) and swaps in a language-aware Kokoro call: English lines are spoken with
en-us / en-gb phonemes (British voices take en-gb), Hindi lines with hi. Character voices are blends; the Hindi
version's episode.json already carries each character's Hindi voice (see screenplay.py).
Output, next to the episode.json: episode.wav and timeline.json
Usage: python3 shiva-purana/engine/build_audio.py shiva-purana/episodes/<slug>/episode.json      (English)
       python3 shiva-purana/engine/build_audio.py shiva-purana/episodes/<slug>/hi/episode.json   (Hindi)
"""
import hashlib, json, os, sys
import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "mahagatha", "engine"))
import build_audio as mb   # noqa: E402

LANG = "en"


def kokoro_say(kokoro, text, voice, speed, cache_dir):
    first = voice.split("+")[0].split(":")[0]
    lang = "hi" if LANG == "hi" else ("en-gb" if first[:1] == "b" else "en-us")
    key = hashlib.sha1(f"{lang}|{voice}|{speed}|{text}".encode()).hexdigest()[:16]
    path = os.path.join(cache_dir, "k_" + key + ".wav")
    if os.path.exists(path):
        return sf.read(path)[0]
    if "+" in voice or ":" in voice:
        parts = [(v.split(":") + ["1"])[:2] for v in voice.split("+")]
        tot = sum(float(w) for _, w in parts)
        style = sum(kokoro.get_voice_style(nm) * float(w) for nm, w in parts) / tot
        s, sr = kokoro.create(text, voice=style.astype(np.float32), speed=speed, lang=lang)
    else:
        s, sr = kokoro.create(text, voice=voice, speed=speed, lang=lang)
    nz = np.where(np.abs(s) > 0.01)[0]
    if len(nz): s = s[max(0, nz[0] - 600): nz[-1] + 2400]
    sf.write(path, s, sr)
    return s


if __name__ == "__main__":
    ep_path = next(a for a in sys.argv[1:] if not a.startswith("-"))
    LANG = json.load(open(ep_path, encoding="utf-8"))["meta"].get("lang", "en")
    mb.kokoro_say = kokoro_say
    threads = int(os.environ.get("KOKORO_THREADS", "0"))
    if threads:   # several builds side by side: give each one ONNX thread instead of letting them all fight for every core
        import kokoro_onnx, onnxruntime as rt
        def create_session(model_path):
            so = rt.SessionOptions(); so.intra_op_num_threads = threads; so.inter_op_num_threads = 1
            return rt.InferenceSession(model_path, sess_options=so, providers=["CPUExecutionProvider"])
        kokoro_onnx.create_session = create_session
    print(f"language: {LANG}", file=sys.stderr)
    mb.main()
