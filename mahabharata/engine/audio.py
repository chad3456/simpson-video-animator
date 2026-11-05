#!/usr/bin/env python3
"""Narration, voices, score and effects for the Mahabharata film -> build/film.wav + build/timeline.json.

Voices are Kokoro (English) blends, pitch-shifted and treated (storyteller room, divine hall, growl).
The score and effects reuse the Mahagatha synthesiser (tanpura, shehnai, bansuri, dhol, conch, bells ...).
Shot lengths come from the narration: each shot lasts max(min, last line end + tail).
Usage: python3 mahabharata/engine/audio.py [--models ~/models] [--no-music]
"""
import argparse, hashlib, json, os, sys
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(os.path.dirname(ROOT), 'mahagatha', 'engine'))
import build_audio as BA  # noqa: E402
from build_audio import SR, KSR, place2, place, shift, treat, cue_cosmic, cue_tension, cue_sorrow, cue_battle, cue_title, cue_end, cue_raga_gat, CUES, sfx, AMB, low, noise, dhol_hit, shankh, ghanta  # noqa: E402

def cue_heroes(total, seed=1):
    base = CUES['devi'](total, seed)
    return base

MUSIC = {
    'open': lambda L, s: cue_cosmic(L, s, 'malkauns'),
    'title': lambda L, s: cue_title(L, s),
    'heroes': lambda L, s: cue_heroes(L, s),
    'villain': lambda L, s: cue_tension(L, s, 'marwa'),
    'krishna': lambda L, s: CUES['vishnu'](L, s),
    'tension': lambda L, s: cue_tension(L, s, 'marwa'),
    'sorrow': lambda L, s: cue_sorrow(L, s, 'bhairavi'),
    'exile': lambda L, s: cue_raga_gat(L, s, 'bhairavi', 'bansuri', 'dadra', 60, None, 0.45),
    'march': lambda L, s: CUES['devi'](L, s),
    'dawn': lambda L, s: CUES['dawn'](L, s),
    'gita': lambda L, s: cue_cosmic(L, s, 'yaman'),
    'cosmic': lambda L, s: cue_cosmic(L, s, 'malkauns'),
    'battle': lambda L, s: cue_battle(L, s, 'darbari'),
    'end': lambda L, s: cue_end(L, s),
}
LOUD = {'title': 0.12, 'heroes': 0.085, 'battle': 0.09, 'march': 0.085, 'cosmic': 0.08}

def say(kokoro, text, voice, speed, cache):
    key = hashlib.sha1(f"en|{voice}|{speed}|{text}".encode()).hexdigest()[:16]
    path = os.path.join(cache, 'k_' + key + '.wav')
    if os.path.exists(path): return sf.read(path)[0]
    first = voice.split('+')[0].split(':')[0]
    lang = 'en-gb' if first.startswith('b') else 'en-us'
    if '+' in voice or ':' in voice:
        parts = [(v.split(':') + ['1'])[:2] for v in voice.split('+')]
        tot = sum(float(w) for _, w in parts)
        style = sum(kokoro.get_voice_style(nm) * float(w) for nm, w in parts) / tot
        s, sr = kokoro.create(text, voice=style.astype(np.float32), speed=speed, lang=lang)
    else:
        s, sr = kokoro.create(text, voice=voice, speed=speed, lang=lang)
    nz = np.where(np.abs(s) > 0.01)[0]
    if len(nz): s = s[max(0, nz[0] - 600): nz[-1] + 2400]
    sf.write(path, s, sr)
    return s

def voice_line(kokoro, ln, cast, cache):
    who = cast[ln['who']]
    text = ln.get('say', ln['text'])
    sp = ln.get('speed', who.get('speed', 1.0))
    raw = say(kokoro, text, who['voice'], sp, cache)
    sh = shift(raw, who.get('pitch', 0), who.get('formant', 'preserved'), cache, f"{who['voice']}|{sp}|{text}")
    sig = resample_poly(sh, 147, 80)
    dry = sig.copy()
    return treat(sig, ln.get('fx', who.get('fx', 'room'))) * 0.9, dry

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--models', default=os.environ.get('KOKORO_MODELS', os.path.expanduser('~/models')))
    ap.add_argument('--no-music', action='store_true')
    args = ap.parse_args()
    from kokoro_onnx import Kokoro
    kokoro = Kokoro(os.path.join(args.models, 'kokoro-v1.0.onnx'), os.path.join(args.models, 'voices-v1.0.bin'))
    film = json.load(open(os.path.join(ROOT, 'film.json'), encoding='utf-8'))
    build = os.path.join(ROOT, 'build'); cache = os.path.join(build, '.voice-cache'); os.makedirs(cache, exist_ok=True)
    cast = film['cast']
    clips, tl, regions, lines_out = [], {}, [], []
    t = 0.0
    for s in film['shots']:
        st = t; end_need = 0.0; cur = None
        for i, ln in enumerate(s.get('lines', [])):
            at = st + float(ln['at']) if 'at' in ln else (cur + float(ln.get('gap', 0.35)))
            sig, dry = voice_line(kokoro, ln, cast, cache)
            d = len(dry) / SR
            clips.append((at, sig, float(ln.get('vol', 1.0)), 0.0))
            lines_out.append({'shot': s['id'], 'who': ln['who'], 'text': ln['text'], 'start': round(at, 3), 'end': round(at + d, 3)})
            cur = at + d; end_need = cur - st
            print(f"  {s['id']:11s} {ln['who']:12s} {d:5.2f}s  {ln['text'][:56]}", file=sys.stderr)
        dur = max(float(s.get('min', 5)), end_need + float(s.get('tail', 0.9)))
        for fx in s.get('sfx', []):
            clips.append((st + float(fx['at']), sfx(fx['n']), float(fx.get('v', 0.7)), float(fx.get('pan', 0))))
        if s.get('hero'):
            clips.append((st + 1.0, dhol_hit('nagara') * 2.2, 0.8, 0.0))
            clips.append((st + 0.0, sfx('whoosh'), 0.5, 0.0))
        tl[s['id']] = {'start': round(st, 3), 'dur': round(dur, 3)}
        regions.append([s.get('music'), st, st + dur])
        t += dur
    total = t + 0.5
    N = int((total + 4) * SR)
    voice = np.zeros((N, 2))
    for at, sig, g, pan in clips: place2(voice, at, sig, g, pan)
    music = np.zeros((N, 2))
    if not args.no_music:
        merged = []
        for cue, a, b in regions:
            if merged and merged[-1][0] == cue: merged[-1][2] = b
            else: merged.append([cue, a, b])
        for idx, (cue, a, b) in enumerate(merged):
            if not cue: continue
            L = b - a + 2.0
            print(f"  music {cue:9s} {a:7.1f}-{b:7.1f}", file=sys.stderr)
            sig = MUSIC[cue](L, idx + 5)
            rms = np.sqrt(np.mean(sig[: int(min(L, 40) * SR)] ** 2)) + 1e-9
            sig = sig * (LOUD.get(cue, 0.07) / rms)
            fi, fo = int(0.6 * SR), int(1.8 * SR)
            if cue != 'title': sig[:fi] *= np.linspace(0, 1, fi)[:, None]
            sig[-fo:] *= np.linspace(1, 0, fo)[:, None]
            place2(music, max(0, a - 0.2), sig, 1.0)
    gain = np.full(N, 1.0)
    for ln in lines_out:
        aa, bb = int(ln['start'] * SR), int(ln['end'] * SR)
        gain[max(0, aa - int(0.2 * SR)): bb + int(0.3 * SR)] = 0.45
    k = int(0.5 * SR); c = np.cumsum(np.insert(gain, 0, 0)); sm = (c[k:] - c[:-k]) / k; gain[: len(sm)] = sm
    mix = music * gain[:, None] * 0.7 + voice
    # soft knee limiter
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)
    peak = np.abs(mix).max()
    if peak > 0.97: mix *= 0.97 / peak
    mix = mix[: int(total * SR)]
    sf.write(os.path.join(build, 'film.wav'), mix.astype(np.float32), SR)
    json.dump({'duration': round(total, 3), 'shots': tl, 'lines': lines_out}, open(os.path.join(build, 'timeline.json'), 'w'), indent=1)
    print(f"wrote film.wav + timeline.json ({total:.1f}s)", file=sys.stderr)

if __name__ == '__main__':
    main()
