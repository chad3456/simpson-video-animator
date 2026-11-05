#!/usr/bin/env python3
"""Composite one series episode into an English and a Hindi film in a single pass.

The picture (layers, camera, light, grade) is rendered once per frame; titles, name cards, verses and subtitles are
then drawn twice, once per language, and piped to two encoders.
  python3 mahabharata/engine/compose_series.py ep01 [--stills 5,30] [--crf 20] [--only shot,shot]
"""
import argparse, json, os, subprocess, sys
import numpy as np
import cv2
from PIL import Image
import compose as C
from compose import smooth, lerp, text_img, blit, hex2rgb, W, H, FPS, BAR

ROOT = C.ROOT
C.FONT_FILES.update({'mukta': 'Mukta-SemiBold.ttf', 'tiro': 'TiroDevanagariHindi.ttf'})
MAIN_BUILD = C.BUILD
# the brush-swipe banner behind name cards comes from the original short's title plate
_rgb = C.load_rgb(os.path.join(MAIN_BUILD, 'plates', 's03_title_swipe.jpg')); _a = C.load_mask(os.path.join(MAIN_BUILD, 'plates', 's03_title_swipe.mask.png'), 2.0)
ys, xs = np.where(_a > 0.05); SWIPE = np.dstack([_rgb[ys.min():ys.max(), xs.min():xs.max()], _a[ys.min():ys.max(), xs.min():xs.max()]])

def F(lang, kind):
    """font for a role in a language"""
    if lang == 'hi': return {'big': 'deva', 'small': 'deva', 'ital': 'tiro', 'sub': 'mukta', 'verse': 'tiro'}[kind]
    return {'big': 'deco', 'small': 'deva', 'ital': 'ital', 'sub': 'mukta', 'verse': 'ital'}[kind]

def name_card(frame, shot, t, dur, lang):
    nm = shot.get('name')
    if not nm: return
    side = nm.get('side', 1); cx = W * (0.72 if side > 0 else 0.29)
    t0 = 1.0; tout = dur - 0.45
    if t < t0 - 0.2 or t > dur: return
    fade = 1 - smooth((t - tout) / 0.4)
    k = smooth((t - t0 + 0.15) / 0.5)
    sw = cv2.resize(SWIPE, (int(W * 0.5), int(W * 0.5 * SWIPE.shape[0] / SWIPE.shape[1] * 1.15)))
    lin = np.linspace(0, 1, sw.shape[1]) if side > 0 else np.linspace(1, 0, sw.shape[1])
    sw = sw.copy(); sw[..., 3] *= np.clip((lin[None, :] - (k * 1.25 - 0.1)) / -0.12, 0, 1) * 0.92
    blit(frame, sw, cx, H * 0.575, fade)
    kt = smooth((t - t0) / 0.9)
    if lang == 'en':
        en = nm['en']; size = 80 if len(en) < 8 else 62 if len(en) < 11 else 50
        blit(frame, text_img(en, 'deco', size, '#f6dd8a', int(lerp(22, 6, kt))), cx, H * 0.575, kt * fade, lerp(1.08, 1.0, kt))
        blit(frame, text_img(nm['hi'], 'deva', 44, '#f3cf6a'), cx, H * 0.455, smooth((t - t0 - 0.3) / 0.6) * fade)
        blit(frame, text_img(nm['ep_en'], 'ital', 34, '#f1e6cc'), cx, H * 0.675, smooth((t - t0 - 0.6) / 0.6) * fade)
    else:
        blit(frame, text_img(nm['hi'], 'deva', 84, '#f6dd8a'), cx, H * 0.565, kt * fade, lerp(1.08, 1.0, kt))
        blit(frame, text_img(nm['en'], 'cinzel', 28, '#f3cf6a', 6), cx, H * 0.445, smooth((t - t0 - 0.3) / 0.6) * fade)
        blit(frame, text_img(nm['ep_hi'], 'tiro', 34, '#f1e6cc'), cx, H * 0.68, smooth((t - t0 - 0.6) / 0.6) * fade)
    kr = smooth((t - t0 - 0.2) / 0.7) * fade
    if kr > 0:
        half = int(170 * kr); y = int(H * 0.632)
        frame[y:y + 2, int(cx - half):int(cx + half)] = frame[y:y + 2, int(cx - half):int(cx + half)] * (1 - kr) + hex2rgb('#d9a536') * kr

def ep_title(frame, ep, shot, t, dur, lang):
    if not shot.get('eptitle'): return
    t0, t1 = 0.6, 4.4
    if t < t0 - 0.1 or t > t1 + 0.8: return
    a = smooth((t - t0) / 0.8) * (1 - smooth((t - t1) / 0.7))
    frame *= 1 - 0.45 * a
    if lang == 'en':
        blit(frame, text_img('MAHABHARATA', 'cinzel', 30, '#d9a536', 14), W / 2, H * 0.33, a)
        blit(frame, text_img(f"EPISODE {ep['n']}", 'cinzel', 24, '#f1e6cc', 10), W / 2, H * 0.41, a)
        blit(frame, text_img(ep['title']['en'], 'deco', 64, '#f6dd8a', int(lerp(16, 4, smooth((t - t0) / 2.5)))), W / 2, H * 0.52, a)
        blit(frame, text_img(ep['tag']['en'], 'ital', 32, '#f1e6cc'), W / 2, H * 0.63, a * smooth((t - t0 - 0.6) / 0.6))
    else:
        blit(frame, text_img('महाभारत', 'deva', 40, '#d9a536'), W / 2, H * 0.32, a)
        blit(frame, text_img(f"भाग {ep['n']}", 'tiro', 30, '#f1e6cc'), W / 2, H * 0.41, a)
        blit(frame, text_img(ep['title']['hi'], 'deva', 76, '#f6dd8a'), W / 2, H * 0.52, a)
        blit(frame, text_img(ep['tag']['hi'], 'tiro', 32, '#f1e6cc'), W / 2, H * 0.64, a * smooth((t - t0 - 0.6) / 0.6))
    kr = smooth((t - t0 - 0.3) / 0.8) * a
    if kr > 0:
        half = int(220 * kr); y = int(H * 0.585)
        frame[y:y + 2, int(W / 2 - half):int(W / 2 + half)] = frame[y:y + 2, int(W / 2 - half):int(W / 2 + half)] * (1 - kr) + hex2rgb('#d9a536') * kr

def texts(frame, shot, t, lang):
    for tx in shot.get('text', []):
        if t < tx['t0'] - 0.1 or t > tx['t1'] + 0.6: continue
        a = smooth((t - tx['t0']) / 0.7) * (1 - smooth((t - tx['t1']) / 0.6))
        s = tx[lang]; f = tx.get('f', 'verse')
        font = F(lang, 'verse') if f == 'verse' else F(lang, 'sub') if f == 'sub' else ('deva' if lang == 'hi' or f == 'deva' else f)
        if f == 'deva' and lang == 'en': font = 'ital'
        sz = tx.get('sz', 40 if f == 'verse' else 36)
        if font == 'ital' and f == 'deva': sz = int(sz * 0.8)
        blit(frame, text_img(s, font, sz, tx.get('c', '#f6dd8a')), W * tx.get('x', 0.5), H * tx.get('y', 0.85) - (1 - a) * 8, a)

def subtitles(frame, lines, t):
    for x in lines:
        if x['start'] - 0.1 <= t <= x['end'] + 0.35:
            a = smooth((t - x['start'] + 0.1) / 0.25) * (1 - smooth((t - x['end'] - 0.1) / 0.25))
            s = x['text']; ft = C.font('mukta', 24)
            # wrap to two lines inside the bottom bar
            words = s.split(); rows = [s]
            if ft.getlength(s) > W * 0.86:
                best = None
                for i in range(1, len(words)):
                    l1, l2 = ' '.join(words[:i]), ' '.join(words[i:]); m = max(ft.getlength(l1), ft.getlength(l2))
                    if best is None or m < best[0]: best = (m, [l1, l2])
                rows = best[1]
            sz = 24 if len(rows) == 1 else 21
            for i, r in enumerate(rows):
                y = H - BAR / 2 + (i - (len(rows) - 1) / 2) * (sz + 6)
                blit(frame, text_img(r, 'mukta', sz, '#efe6cf', 0, shadow=False), W / 2, y, a * 0.95)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('ep'); ap.add_argument('--stills'); ap.add_argument('--crf', default='20'); ap.add_argument('--only'); ap.add_argument('--langs', default='en,hi'); ap.add_argument('--nosubs', action='store_true')
    args = ap.parse_args()
    ep = json.load(open(os.path.join(ROOT, 'series', args.ep + '.json'), encoding='utf-8'))
    B = os.path.join(ROOT, 'build', 'series', args.ep); C.BUILD = B
    tl = json.load(open(os.path.join(B, 'timeline.json'), encoding='utf-8'))
    langs = args.langs.split(',')
    def frame_for(s, t, du, n):
        base = C.render_shot_frame(s, t, du); base = C.grade(base, s, n)
        outs = {}
        for L in langs:
            f = base.copy()
            ep_title(f, ep, s, t, du, L); name_card(f, s, t, du, L); texts(f, s, t, L)
            f = C.transitions(f, s, t, du); f[:C.BAR] = 0; f[H - C.BAR:] = 0
            if not args.nosubs: subtitles(f, tl['lines'][L], n / FPS)
            outs[L] = (np.clip(f, 0, 1) * 255 + 0.5).astype(np.uint8)
        return outs
    shots = ep['shots']
    if args.stills:
        d = os.path.join(B, 'stills'); os.makedirs(d, exist_ok=True)
        for tt in map(float, args.stills.split(',')):
            for s in shots:
                st, du = tl['shots'][s['id']]['start'], tl['shots'][s['id']]['dur']
                if st <= tt < st + du:
                    for L, fr in frame_for(s, tt - st, du, int(tt * FPS)).items():
                        p = os.path.join(d, f'{tt:07.2f}_{s["id"]}_{L}.jpg'); Image.fromarray(fr).save(p, quality=90); print(p)
        return
    sel = [s for s in shots if not args.only or s['id'] in args.only.split(',')]
    procs = {}
    for L in langs:
        out = os.path.join(B, f"{args.ep}_{L}.mp4" if not args.only else f"shots_{L}.mp4")
        cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-']
        if not args.only: cmd += ['-i', os.path.join(B, f'{L}.wav'), '-c:a', 'aac', '-b:a', '192k', '-shortest']
        cmd += ['-c:v', 'libx264', '-preset', 'medium', '-crf', args.crf, '-pix_fmt', 'yuv420p', '-tune', 'film', '-movflags', '+faststart', out]
        procs[L] = (subprocess.Popen(cmd, stdin=subprocess.PIPE), out)
    fi = 0
    for s in sel:
        st, du = tl['shots'][s['id']]['start'], tl['shots'][s['id']]['dur']
        n0, n1 = int(round(st * FPS)), int(round((st + du) * FPS))
        for n in range(n0, n1):
            for L, fr in frame_for(s, n / FPS - st, du, n).items(): procs[L][0].stdin.write(fr.tobytes())
            fi += 1
        C._cache.clear()
        print(f'  {s["id"]:14s} {n1 - n0:5d} frames', file=sys.stderr, flush=True)
    if not args.only:
        black = np.zeros((H, W, 3), np.uint8).tobytes()
        while fi < int(tl['duration'] * FPS):
            for L in langs: procs[L][0].stdin.write(black)
            fi += 1
    for L, (p, out) in procs.items(): p.stdin.close(); p.wait(); print('wrote', out)

if __name__ == '__main__':
    main()
