#!/usr/bin/env python3
"""Voices, score, ambience and effects for one Mahabharata episode, in English and Hindi.

Both languages share one picture timeline: each shot lasts as long as the longer of its two soundtracks needs,
so the same painted frames serve both versions.
  python3 mahabharata/engine/series_audio.py ep01 [ep02 ...]
writes build/series/epNN/{timeline.json, en.wav, hi.wav}
"""
import hashlib, json, os, sys
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(os.path.dirname(ROOT), 'mahagatha', 'engine'))
import build_audio as BA  # noqa: E402
from build_audio import (SR, place, place2, shift, treat, cue_mix, cue_cosmic, cue_tension, cue_sorrow, cue_battle, cue_title, cue_end,  # noqa: E402
                         cue_raga_gat, cue_shiva, cue_wonder, cue_curse, cue_devi, CUES, sfx, SFX, AMB, low, high, band, noise, dhol_hit,
                         dhol, shankh, ghanta, tanpura, contour_voice, phrase_gen, swarmandal, reverb, IR_HALL, IR_TEMPLE, IR_CAVE, T, SA, pluck, tabla)

# ---------------------------------------------------------------- new cues ---
def cue_vishva(total, seed=21):
    """The universal form: drone and choir rising for the whole cue, gongs and nagara accelerating, bells and swarmandal."""
    r = np.random.default_rng(seed); n = int(total * SR); t = T(total); rise = np.clip(t / max(1, total * 0.8), 0, 1)
    base = cue_cosmic(total, seed, 'malkauns')
    ch2 = contour_voice(phrase_gen('malkauns', max(2, int(total / 7)), r, span=(2, 9), rest_prob=0.02), total, 'choir', bpm=28, base=SA, raga='malkauns', seed=seed + 3)
    swell = band(noise(n, seed), 120, 3000) * rise ** 2 * 0.08
    dr = np.zeros(n); tt = 0.6; gap = 2.4
    while tt < total - 0.5: place(dr, tt, dhol_hit('nagara'), 0.5 + 0.6 * tt / total); tt += gap; gap = max(0.45, gap * 0.9)
    gg = np.zeros(n)
    for k in range(0, int(total), 6): place(gg, k + 0.2, ghanta(6, 220 if k % 12 == 0 else 330, k) * 2.0, 0.6)
    sw = np.zeros(n); tt = 1.0
    while tt < total - 2: place(sw, tt, swarmandal('yaman', True, 18, SA + 12, 1.4), 0.7); tt += r.uniform(3, 6)
    return base * 0.8 + cue_mix(total, [(ch2 * (0.5 + rise), 0.9, 0.25, (0.5, IR_CAVE)), (swell, 1.0, 0, (0.4, IR_HALL)), (dr, 0.9, 0, (0.4, IR_HALL)), (gg, 0.8, -0.2, (0.5, IR_TEMPLE)), (sw, 0.6, 0.4, None)])

def cue_lament(total, seed=22):
    r = np.random.default_rng(seed)
    base = cue_sorrow(total, seed, 'bhairavi')
    fl = np.zeros(int(total * SR)); tt = 3.0
    while tt < total - 5:
        seg = contour_voice(phrase_gen('bhairavi', 2, r, start=r.integers(2, 6), span=(0, 10), rest_prob=0.1), min(14, total - tt), 'bansuri', bpm=38, base=SA + 12, raga='bhairavi', seed=int(tt))
        place(fl, tt, seg); tt += len(seg) / SR + r.uniform(3, 6)
    return base + cue_mix(total, [(fl, 0.6, 0.3, (0.5, IR_HALL))])

def cue_storm(total, seed=23):
    base = cue_shiva(total, seed)
    dr = np.zeros(int(total * SR)); tt = 0.5
    while tt < total: place(dr, tt, dhol_hit('nagara'), 0.9); tt += 1.5
    return base + cue_mix(total, [(dr, 0.8, 0, (0.4, IR_HALL))])

MUSIC = {
    'river': lambda L, s: cue_raga_gat(L, s, 'yaman', 'bansuri', 'dadra', 60, None, 0.3),
    'love': lambda L, s: cue_raga_gat(L, s, 'desh', None, 'dadra', 84, 'santoor', 0.45),
    'sorrow': lambda L, s: cue_sorrow(L, s, 'bhairavi'),
    'lament': cue_lament,
    'tension': lambda L, s: cue_tension(L, s, 'marwa'),
    'heroic': lambda L, s: cue_devi(L, s),
    'march': lambda L, s: cue_devi(L, s),
    'storm': cue_storm,
    'divine': lambda L, s: cue_wonder(L, s),
    'wonder': lambda L, s: cue_wonder(L, s),
    'title': lambda L, s: cue_title(L, s),
    'court': lambda L, s: CUES['court'](L, s),
    'forest': lambda L, s: CUES['dawn'](L, s),
    'fire': lambda L, s: cue_battle(L, s, 'marwa'),
    'joy': lambda L, s: CUES['joy'](L, s),
    'krishna': lambda L, s: CUES['vishnu'](L, s),
    'dice': lambda L, s: cue_raga_gat(L, s, 'marwa', None, 'teentaal', 100, 'sitar', 0.8),
    'mystery': lambda L, s: cue_cosmic(L, s, 'malkauns'),
    'shiva': lambda L, s: cue_shiva(L, s),
    'cosmic': lambda L, s: cue_cosmic(L, s, 'malkauns'),
    'gita': lambda L, s: cue_cosmic(L, s, 'yaman'),
    'vishva': cue_vishva,
    'kala': lambda L, s: cue_curse(L, s) + cue_battle(L, s, 'darbari') * 0.5,
    'battle': lambda L, s: cue_battle(L, s, 'darbari'),
    'end': lambda L, s: cue_end(L, s),
}
LOUD = {'title': 0.12, 'heroic': 0.085, 'march': 0.09, 'battle': 0.09, 'fire': 0.08, 'vishva': 0.1, 'kala': 0.1, 'cosmic': 0.08, 'storm': 0.085}

# ---------------------------------------------------------------- new sounds ---
def amb_crowd(n, seed=31):
    r = np.random.default_rng(seed); t = np.arange(n) / SR
    out = band(noise(n, seed), 250, 1800) * 0.025 * (1 + 0.4 * np.sin(2 * np.pi * 0.23 * t) * np.sin(2 * np.pi * 0.07 * t))
    for _ in range(int(n / SR * 2)):   # babble: short formant blips
        o = r.integers(0, max(1, n - SR)); L = int(r.uniform(0.08, 0.25) * SR); f = r.uniform(300, 900)
        out[o:o + L] += np.sin(2 * np.pi * f * np.arange(L) / SR) * np.hanning(L) * 0.006
    return out
def amb_battle(n, seed=32):
    r = np.random.default_rng(seed); out = low(noise(n, seed), 200) * 0.03 + AMB['wind'](n, seed) * 0.6
    for _ in range(int(n / SR / 1.2)):
        o = r.uniform(0, n / SR - 1.5); place(out, o, BA.sfx_clash() * r.uniform(0.03, 0.09))
    for _ in range(int(n / SR / 3)): place(out, r.uniform(0, n / SR - 2), dhol_hit('boom') * 0.15)
    return out
AMB['crowd'] = amb_crowd; AMB['battle'] = amb_battle

def sfx_dice():
    out = np.zeros(int(1.2 * SR)); r = np.random.default_rng(41); tt = 0.0
    for i in range(9):
        L = int(0.02 * SR); s = band(noise(L, i), 1500, 7000) * np.exp(-np.arange(L) / (0.004 * SR)) * (1 - i / 10)
        place(out, tt, s + np.sin(2 * np.pi * 2400 * np.arange(L) / SR) * np.exp(-np.arange(L) / (0.003 * SR)) * 0.4); tt += r.uniform(0.04, 0.13)
    return out
def sfx_laugh():
    out = np.zeros(int(2.6 * SR)); r = np.random.default_rng(42)
    for v in range(9):
        f0 = r.uniform(140, 300); tt = r.uniform(0, 0.4)
        for k in range(r.integers(4, 8)):
            L = int(0.12 * SR); x = np.arange(L) / SR
            s = np.sign(np.sin(2 * np.pi * f0 * x)) * 0.3 + band(noise(L, v * 10 + k), 600, 2500) * 0.6
            place(out, tt, band(s, 200, 3000) * np.hanning(L) * 0.08); tt += r.uniform(0.15, 0.22)
    return reverb(out, 0.3)
def sfx_cheer(): return reverb(band(noise(int(3 * SR), 43), 300, 3500) * np.sin(np.pi * T(3) / 3) ** 0.7 * 0.35, 0.3)
def sfx_gasp():
    out = np.zeros(int(1.5 * SR)); r = np.random.default_rng(44)
    for v in range(10): L = int(r.uniform(0.3, 0.6) * SR); place(out, r.uniform(0, 0.25), band(noise(L, v), 800 + v * 80, 3500) * np.hanning(L) * 0.12)
    return reverb(out, 0.3)
def sfx_hooves():
    out = np.zeros(int(4 * SR)); tt = 0.0; k = 0
    while tt < 3.8:
        L = int(0.05 * SR); s = low(noise(L, k), 900) * np.exp(-np.arange(L) / (0.012 * SR)); place(out, tt, s * 0.8); tt += [0.11, 0.09, 0.14, 0.2][k % 4]; k += 1
    return out
def sfx_flute():
    r = np.random.default_rng(45)
    return contour_voice(phrase_gen('yaman', 2, r, start=4, span=(2, 11), rest_prob=0.05), 6.0, 'bansuri', bpm=60, base=SA + 12, raga='yaman', seed=45) * 3
SFX.update({'dice': sfx_dice, 'crowdlaugh': sfx_laugh, 'cheer': sfx_cheer, 'gasp': sfx_gasp, 'hooves': sfx_hooves, 'flute': sfx_flute})

# ---------------------------------------------------------------- voices ---
def say(kokoro, text, voice, speed, lang, cache):
    key = hashlib.sha1(f"{lang}|{voice}|{speed}|{text}".encode()).hexdigest()[:16]
    path = os.path.join(cache, 'k_' + key + '.wav')
    if os.path.exists(path): return sf.read(path)[0]
    kl = 'hi' if lang == 'hi' else ('en-gb' if voice.split('+')[0].split(':')[0].startswith('b') else 'en-us')
    if '+' in voice or ':' in voice:
        parts = [(v.split(':') + ['1'])[:2] for v in voice.split('+')]
        tot = sum(float(w) for _, w in parts)
        style = sum(kokoro.get_voice_style(nm) * float(w) for nm, w in parts) / tot
        s, sr = kokoro.create(text, voice=style.astype(np.float32), speed=speed, lang=kl)
    else:
        s, sr = kokoro.create(text, voice=voice, speed=speed, lang=kl)
    nz = np.where(np.abs(s) > 0.01)[0]
    if len(nz): s = s[max(0, nz[0] - 600): nz[-1] + 2400]
    sf.write(path, s, sr)
    return s

def voice_line(kokoro, ln, who, lang, cache):
    text = ln[lang]
    sp = ln.get('speed', who.get('speed', 1.0))
    raw = say(kokoro, text, who['voice'], sp, lang, cache)
    sh = shift(raw, who.get('pitch', 0), who.get('formant', 'preserved'), cache, f"{lang}|{who['voice']}|{sp}|{text}")
    sig = resample_poly(sh, 147, 80)
    return treat(sig, ln.get('fx', who.get('fx', 'room'))) * 0.9, len(sig) / SR

def build(ep_id, kokoro, music=True):
    ep = json.load(open(os.path.join(ROOT, 'series', ep_id + '.json'), encoding='utf-8'))
    out_dir = os.path.join(ROOT, 'build', 'series', ep_id); os.makedirs(out_dir, exist_ok=True)
    cache = os.path.join(ROOT, 'build', '.voice-cache'); os.makedirs(cache, exist_ok=True)
    langs = ('en', 'hi')
    # 1. voice every line in both languages, place it within its shot, find the shot lengths
    voiced = {L: [] for L in langs}; tl = {}; t = 0.0
    for s in ep['shots']:
        need = {}
        for L in langs:
            cast = ep['cast'][L]; cur = None; st_rel = 0.0
            for ln in s['lines']:
                at = float(ln['at']) if 'at' in ln else (cur + float(ln.get('gap', 0.45)) if cur is not None else 0.9)
                sig, d = voice_line(kokoro, ln, cast[ln['who']], L, cache)
                voiced[L].append(dict(shot=s['id'], rel=at, sig=sig, d=d, vol=float(ln.get('vol', 1.0)), who=ln['who'], text=ln[L]))
                cur = at + d
            need[L] = (cur or 0) + float(s.get('tail', 1.1))
        dur = max(float(s.get('min', 6)), *need.values())
        tl[s['id']] = {'start': round(t, 3), 'dur': round(dur, 3)}
        print(f"  {s['id']:14s} {dur:6.2f}s  (en {need['en']:5.2f}, hi {need['hi']:5.2f})", file=sys.stderr)
        t += dur
    total = t + 0.6
    N = int((total + 4) * SR)
    # 2. score + ambience + effects (shared by both languages)
    mus = np.zeros((N, 2)); bed = np.zeros((N, 2)); fxb = np.zeros((N, 2))
    if music:
        merged = []
        for s in ep['shots']:
            a, b = tl[s['id']]['start'], tl[s['id']]['start'] + tl[s['id']]['dur']
            if merged and merged[-1][0] == s['music']: merged[-1][2] = b
            else: merged.append([s['music'], a, b])
        for idx, (cue, a, b) in enumerate(merged):
            L = b - a + 2.0
            sig = MUSIC[cue](L, idx + 7 + ep['n'] * 3)
            if sig.ndim == 1: sig = np.stack([sig, sig], 1)
            rms = np.sqrt(np.mean(sig[: int(min(L, 40) * SR)] ** 2)) + 1e-9
            sig = sig * (LOUD.get(cue, 0.07) / rms)
            fi, fo = int(0.8 * SR), int(1.8 * SR)
            if cue != 'title': sig[:fi] *= np.linspace(0, 1, fi)[:, None]
            sig[-fo:] *= np.linspace(1, 0, fo)[:, None]
            place2(mus, max(0, a - 0.3), sig, 1.0)
            print(f"  music {cue:9s} {a:7.1f}-{b:7.1f}", file=sys.stderr)
    for s in ep['shots']:
        st, du = tl[s['id']]['start'], tl[s['id']]['dur']
        if s.get('amb'):
            n = int((du + 1.2) * SR); a = AMB[s['amb']](n, 7)
            a = a / (np.sqrt(np.mean(a ** 2)) + 1e-9) * 0.02
            env = np.minimum(1, np.minimum(np.arange(n) / (0.6 * SR), (n - np.arange(n)) / (0.6 * SR)))
            place2(bed, max(0, st - 0.3), a * env, 1.0)
        for f in s.get('sfx', []): place2(fxb, st + float(f['at']), sfx(f['n']), float(f.get('v', 0.7)), float(f.get('pan', 0)))
        if s.get('hero'): place2(fxb, st + 0.95, dhol_hit('nagara') * 2.2, 0.8); place2(fxb, st, sfx('whoosh'), 0.45)
        if s.get('eptitle'): place2(fxb, st + 0.6, shankh(3.4), 0.5); place2(fxb, st + 2.6, ghanta(4, 880), 0.4)
        if s.get('tin') == 'flash': place2(fxb, st, sfx('boom'), 0.5)
    # 3. one mix per language
    lines_out = {}
    for L in langs:
        voice = np.zeros((N, 2)); lines = []
        for v in voiced[L]:
            at = tl[v['shot']]['start'] + v['rel']
            place2(voice, at, v['sig'], v['vol'], 0.0)
            lines.append({'shot': v['shot'], 'who': v['who'], 'text': v['text'], 'start': round(at, 3), 'end': round(at + v['d'], 3)})
        gain = np.full(N, 1.0)
        for x in lines: gain[max(0, int((x['start'] - 0.25) * SR)): int((x['end'] + 0.35) * SR)] = 0.42
        k = int(0.5 * SR); c = np.cumsum(np.insert(gain, 0, 0)); sm = (c[k:] - c[:-k]) / k; gain[: len(sm)] = sm
        mix = mus * gain[:, None] * 0.7 + bed * (0.5 + 0.5 * gain[:, None]) + fxb * 0.85 + voice
        mix = np.tanh(mix * 1.1) / np.tanh(1.1)
        pk = np.abs(mix).max(); mix = mix * (0.97 / pk) if pk > 0.97 else mix
        sf.write(os.path.join(out_dir, f'{L}.wav'), mix[: int(total * SR)].astype(np.float32), SR)
        lines_out[L] = lines
    json.dump({'duration': round(total, 3), 'shots': tl, 'lines': lines_out}, open(os.path.join(out_dir, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"{ep_id}: {total:.1f}s", file=sys.stderr)

if __name__ == '__main__':
    from kokoro_onnx import Kokoro
    models = os.environ.get('KOKORO_MODELS', os.path.expanduser('~/models'))
    kokoro = Kokoro(os.path.join(models, 'kokoro-v1.0.onnx'), os.path.join(models, 'voices-v1.0.bin'))
    for e in sys.argv[1:]: build(e, kokoro, '--no-music' not in sys.argv)
