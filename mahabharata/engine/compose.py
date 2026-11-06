#!/usr/bin/env python3
"""Composite the painted plates and animation frames into the finished film.

Camera moves, parallax by layer depth, layer motion, rim light and glow from each layer's mask, colour grade,
paper grain, letterbox, name cards and titles, transitions; frames are piped to ffmpeg and muxed with film.wav.
Usage:
  python3 mahabharata/engine/compose.py                      # full film -> build/mahabharata.mp4
  python3 mahabharata/engine/compose.py --stills 12.5,40     # review frames -> build/stills/
  python3 mahabharata/engine/compose.py --only h_arjuna      # one shot (silent) -> build/shot_<id>.mp4
"""
import argparse, json, os, subprocess, sys, math
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); BUILD = os.path.join(ROOT, 'build')
FONTS = os.path.join(HERE, 'fonts')
film = json.load(open(os.path.join(ROOT, 'film.json'), encoding='utf-8'))
FPS, W, H = film['fps'], film['w'], film['h']
PW, PH = 1600, 900
BAR = int((H - W / 2.2) / 2)

def hex2rgb(h): h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255.0
def smooth(x): x = min(1.0, max(0.0, x)); return x * x * (3 - 2 * x)
def ease_fn(name):
    if name == 'in': return lambda x: min(1, max(0, x)) ** 2.2
    if name == 'out': return lambda x: 1 - (1 - min(1, max(0, x))) ** 2.6
    return smooth
def lerp(a, b, k): return a + (b - a) * k

# ---------------------------------------------------------------- loading ---
_cache = {}
def load_rgb(path):
    if path in _cache: return _cache[path]
    im = cv2.imread(path, cv2.IMREAD_COLOR)
    if im is None: raise FileNotFoundError(path)
    a = cv2.cvtColor(im, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    _cache[path] = a; return a
def load_mask(path, soft=1.2):
    key = path + f'@{soft}'
    if key in _cache: return _cache[key]
    m = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if m is None: return None
    m = cv2.erode(m, np.ones((3, 3), np.uint8), iterations=2).astype(np.float32) / 255.0
    if soft: m = cv2.GaussianBlur(m, (0, 0), soft)
    _cache[key] = m; return m

def prep_plate(shot, L):
    """Plate RGB + alpha with rim light / glow baked in. Returns dict."""
    key = ('plate', shot['id'], L['n'])
    if key in _cache: return _cache[key]
    base = os.path.join(BUILD, 'plates', L.get('src') or f"{shot['id']}_{L['n']}")
    rgb = load_rgb(base + '.jpg').copy()
    is_bg = L['n'] == 'bg' or L.get('opaque')
    a = None if is_bg else load_mask(base + '.mask.png', 1.0)
    glow = None
    if a is not None:
        if 'rim' in L:
            col, dx, dy, k = L['rim']; col = hex2rgb(col)
            sh = np.roll(np.roll(a, int(dy), 0), int(dx), 1)
            rim = np.clip(a - sh, 0, 1); rim = cv2.GaussianBlur(rim, (0, 0), 1.6) * a
            rgb = np.clip(rgb + rim[..., None] * col * k * 0.75, 0, 1)
        if 'glow' in L:
            col, rad, k = L['glow']
            g = cv2.GaussianBlur(a, (0, 0), rad) * k
            glow = g[..., None] * hex2rgb(col)
    out = {'rgb': rgb, 'a': a, 'glow': glow}
    _cache[key] = out; return out

def anim_frame(shot, L, t):
    ev = L.get('every', 2); i = int(t * FPS / ev + 1e-6)
    d = os.path.join(BUILD, 'anim', L.get('src') or f"{shot['id']}_{L['n']}")
    if L.get('src'):   # a borrowed animation loops over the frames its own shot painted
        key = ('nfr', d)
        if key not in _cache: _cache[key] = len([f for f in os.listdir(d) if f.endswith('.jpg')]) if os.path.isdir(d) else 0
        if _cache[key]: i = i % _cache[key]
    while i >= 0:
        p = os.path.join(d, f'{i:05d}.jpg')
        if os.path.exists(p): break
        i -= 1
    if i < 0: return None
    p = os.path.join(d, f'{i:05d}.jpg')
    rgb = cv2.cvtColor(cv2.imread(p), cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    a = None
    if L.get('b') != 'add':
        m = cv2.imread(p[:-4] + '.mask.png', cv2.IMREAD_GRAYSCALE)
        a = cv2.GaussianBlur(cv2.erode(m, np.ones((3, 3), np.uint8), iterations=1).astype(np.float32) / 255.0, (0, 0), 1.0) if m is not None else None
    return {'rgb': rgb, 'a': a, 'glow': None}

# ---------------------------------------------------------------- text ------
FONT_FILES = {'deco': 'CinzelDecorative-Bold.ttf', 'cinzel': 'Cinzel.ttf', 'deva': 'Rozha.ttf', 'ital': 'CormorantGaramond-Italic.ttf'}
def font(f, sz):
    key = ('font', f, sz)
    if key not in _cache:
        ft = ImageFont.truetype(os.path.join(FONTS, FONT_FILES[f]), sz, layout_engine=ImageFont.Layout.RAQM)
        if f == 'cinzel':
            try: ft.set_variation_by_axes([700])
            except Exception: pass
        if f == 'ital':
            try: ft.set_variation_by_axes([500])
            except Exception: pass
        _cache[key] = ft
    return _cache[key]
def text_img(s, f, sz, col, track=0, shadow=True):
    key = ('txt', s, f, sz, col, track)
    if key in _cache: return _cache[key]
    ft = font(f, sz); pad = int(sz * 0.6)
    if track:
        widths = [ft.getlength(ch) for ch in s]
        tw = int(sum(widths) + track * (len(s) - 1)); bb = ft.getbbox(s); th = bb[3] - bb[1]
    else:
        bb = ft.getbbox(s); tw, th = bb[2] - bb[0], bb[3] - bb[1]
    img = Image.new('RGBA', (tw + pad * 2, int(th + pad * 2.2)), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    def draw_at(dd, ox, oy, fill):
        if track:
            x = ox
            for ch, wch in zip(s, widths):
                dd.text((x, oy), ch, font=ft, fill=fill); x += wch + track
        else: dd.text((ox - bb[0], oy), s, font=ft, fill=fill)
    oy = pad - (bb[1] if not track else ft.getbbox(s)[1])
    if shadow:
        sh = Image.new('RGBA', img.size, (0, 0, 0, 0)); draw_at(ImageDraw.Draw(sh), pad, oy + max(2, sz // 24), (8, 4, 2, 220))
        sha = np.array(sh).astype(np.float32); sha[..., 3] = cv2.GaussianBlur(sha[..., 3], (0, 0), max(2, sz / 14)); img = Image.fromarray(np.clip(sha, 0, 255).astype(np.uint8))
        d = ImageDraw.Draw(img)
    c = tuple(int(v * 255) for v in hex2rgb(col))
    draw_at(d, pad, oy, c + (255,))
    arr = np.array(img).astype(np.float32) / 255.0
    if f == 'deco':   # gilt gradient
        g = np.linspace(1.15, 0.78, arr.shape[0])[:, None, None]; arr[..., :3] = np.clip(arr[..., :3] * g, 0, 1)
    _cache[key] = arr; return arr
def blit(frame, img, cx, cy, alpha=1.0, scale=1.0):
    if alpha <= 0.003: return
    if abs(scale - 1) > 0.002: img = cv2.resize(img, (max(1, int(img.shape[1] * scale)), max(1, int(img.shape[0] * scale))), interpolation=cv2.INTER_AREA if scale < 1 else cv2.INTER_LINEAR)
    h, w = img.shape[:2]; x0, y0 = int(cx - w / 2), int(cy - h / 2)
    xa, ya, xb, yb = max(0, x0), max(0, y0), min(W, x0 + w), min(H, y0 + h)
    if xa >= xb or ya >= yb: return
    sub = img[ya - y0: yb - y0, xa - x0: xb - x0]; a = sub[..., 3:4] * alpha
    frame[ya:yb, xa:xb] = frame[ya:yb, xa:xb] * (1 - a) + sub[..., :3] * a

# ---------------------------------------------------------------- frame -----
def cam_at(shot, t, dur):
    (x0, y0, z0), (x1, y1, z1) = shot['cam']
    k = smooth(t / max(0.01, dur)) * 0.85 + (t / max(0.01, dur)) * 0.15
    cx, cy, z = lerp(x0, x1, k), lerp(y0, y1, k), lerp(z0, z1, k)
    for tt, amp in shot.get('shake', []):
        dt = t - tt
        if 0 <= dt < 1.2:
            e = amp * math.exp(-dt * 4.5)
            cx += e * math.sin(dt * 61); cy += e * math.cos(dt * 47)
    return cx, cy, z

def layer_matrix(shot, L, t, cam):
    cx, cy, z = cam; d = L.get('d', 1.0)
    lcx, lcy, lz = 800 + (cx - 800) * d, 450 + (cy - 450) * d, 1 + (z - 1) * d
    S = (W / PW) * lz
    # layer motion (about its anchor)
    mv = L.get('mv'); dx = dy = 0.0; s = 1.0; r = 0.0; al = 1.0
    if mv:
        t0, t1 = mv.get('t', [0, 1]); k = ease_fn(mv.get('ease', 'smooth'))((t - t0) / max(0.01, t1 - t0))
        if 'dx' in mv: dx = lerp(*mv['dx'], k)
        if 'dy' in mv: dy = lerp(*mv['dy'], k)
        if 's' in mv: s = lerp(*mv['s'], k)
        if 'r' in mv: r = lerp(*mv['r'], k)
        if 'a' in mv: al = lerp(*mv['a'], k)
    ax, ay = (mv or {}).get('ax', 800), (mv or {}).get('ay', 450)
    if L.get('breath') or (L['k'] == 'plate' and L['n'] != 'bg' and not mv):
        s *= 1 + 0.006 * math.sin(t * 1.3)
    c, si = math.cos(math.radians(r)) * s, math.sin(math.radians(r)) * s
    # plate p -> moved: A(p - anchor) + anchor + (dx,dy)
    M1 = np.array([[c, -si, ax - c * ax + si * ay + dx], [si, c, ay - si * ax - c * ay + dy], [0, 0, 1]])
    M2 = np.array([[S, 0, W / 2 - S * lcx], [0, S, H / 2 - S * lcy], [0, 0, 1]])
    return (M2 @ M1)[:2], al

def window_alpha(L, t):
    if 't' not in L: return 1.0
    t0, t1 = L['t']; f = 0.1
    return smooth((t - t0) / f + 1) * (1 - smooth((t - t1) / f)) if t0 > 0 else (1 - smooth((t - t1) / f))

def render_shot_frame(shot, t, dur):
    frame = np.zeros((H, W, 3), np.float32)
    cam = cam_at(shot, t, dur)
    for L in shot['layers']:
        wa = window_alpha(L, t)
        if wa <= 0.002: continue
        src = prep_plate(shot, L) if L['k'] == 'plate' else anim_frame(shot, L, t)
        if src is None: continue
        M, al = layer_matrix(shot, L, t, cam)
        al *= wa * L.get('a', 1.0)
        if al <= 0.002: continue
        flags = cv2.INTER_LINEAR
        rgb = cv2.warpAffine(src['rgb'], M, (W, H), flags=flags, borderMode=cv2.BORDER_REFLECT if L['n'] == 'bg' else cv2.BORDER_CONSTANT)
        if src.get('glow') is not None:
            frame += cv2.warpAffine(src['glow'], M, (W, H), flags=flags) * al * (0.85 + 0.15 * math.sin(t * 2.1))
        if L.get('b') == 'add':
            frame += rgb * al
            continue
        if src['a'] is None and 'wipe' not in L:
            frame = frame * (1 - al) + rgb * al if al < 0.999 else rgb
            continue
        a = cv2.warpAffine(src['a'] if src['a'] is not None else np.ones((PH, PW), np.float32), M, (W, H), flags=flags)
        if 'wipe' in L:
            w0, w1 = L['wipe']; k = smooth((t - w0) / max(0.01, w1 - w0))
            ramp = np.clip((np.linspace(0, 1, W)[None, :] - (k * 1.2 - 0.1)) / -0.1, 0, 1); a = a * ramp
        a = (a * al)[..., None]
        frame = frame * (1 - a) + rgb * a
    return frame

# grain + vignette + paper
rng = np.random.default_rng(3)
GRAIN = [cv2.GaussianBlur(rng.standard_normal((H, W)).astype(np.float32), (0, 0), 0.7) for _ in range(6)]
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
VIG = 1 - 0.42 * np.clip(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H / 2) / (H * 0.7)) ** 2, 0, 1.4)
PAPER = cv2.GaussianBlur(rng.standard_normal((H // 2, W // 2)).astype(np.float32), (0, 0), 1.6)
PAPER = cv2.resize(PAPER, (W, H)); PAPER = 1 + 0.03 * PAPER / (np.abs(PAPER).max() + 1e-6)

def grade(frame, shot, fi):
    g = shot.get('g')
    if g:
        tint = hex2rgb(g['tint']); k = g.get('k', 0.1)
        frame = frame * (1 - k) + frame * tint * 2.2 * k
    frame = frame * VIG[..., None] * PAPER[..., None]
    frame = frame + GRAIN[fi % len(GRAIN)][..., None] * 0.018
    # gentle filmic curve
    frame = np.clip(frame, 0, 1.6); frame = frame / (1 + 0.12 * frame) * 1.12
    return frame

# ---------------------------------------------------------------- titles ----
SWIPE = None
def name_card(frame, shot, t, dur):
    nm = shot.get('name')
    if not nm: return
    side = nm.get('side', 1); cx = W * (0.72 if side > 0 else 0.29)
    t0 = 1.0; tout = dur - 0.45
    if t < t0 - 0.2 or t > dur: return
    fade = 1 - smooth((t - tout) / 0.4)
    # brush swipe banner behind the name
    global SWIPE
    if SWIPE is None:
        rgb = load_rgb(os.path.join(BUILD, 'plates', 's03_title_swipe.jpg')); a = load_mask(os.path.join(BUILD, 'plates', 's03_title_swipe.mask.png'), 2.0)
        ys, xs = np.where(a > 0.05); y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
        SWIPE = np.dstack([rgb[y0:y1, x0:x1], a[y0:y1, x0:x1]])
    k = smooth((t - t0 + 0.15) / 0.5)
    sw = cv2.resize(SWIPE, (int(W * 0.5), int(W * 0.5 * SWIPE.shape[0] / SWIPE.shape[1] * 1.15)))
    ramp = np.clip((np.linspace(0, 1, sw.shape[1])[None, :] - (k * 1.25 - 0.1)) / -0.12, 0, 1) if side > 0 else np.clip((np.linspace(1, 0, sw.shape[1])[None, :] - (k * 1.25 - 0.1)) / -0.12, 0, 1)
    sw = sw.copy(); sw[..., 3] *= ramp * 0.92
    blit(frame, sw, cx, H * 0.575, fade)
    # names
    en = nm['en']; size = 80 if len(en) < 8 else 62 if len(en) < 11 else 54
    kt = smooth((t - t0) / 0.9)
    track = int(lerp(22, 6, kt))
    im = text_img(en, 'deco', size, '#f6dd8a', track)
    blit(frame, im, cx, H * 0.575, kt * fade, lerp(1.08, 1.0, kt))
    blit(frame, text_img(nm['hi'], 'deva', 46, '#f3cf6a'), cx, H * 0.455, smooth((t - t0 - 0.3) / 0.6) * fade)
    blit(frame, text_img(nm['ep'], 'ital', 34, '#f1e6cc'), cx, H * 0.675, smooth((t - t0 - 0.6) / 0.6) * fade)
    # gold rule
    kr = smooth((t - t0 - 0.2) / 0.7) * fade
    if kr > 0:
        half = int(170 * kr); y = int(H * 0.632)
        frame[y:y + 2, int(cx - half):int(cx + half)] = frame[y:y + 2, int(cx - half):int(cx + half)] * (1 - kr) + hex2rgb('#d9a536') * kr

def texts(frame, shot, t, dur):
    for tx in shot.get('text', []):
        if t < tx['t0'] - 0.1 or t > tx['t1'] + 0.6: continue
        a = smooth((t - tx['t0']) / 0.7) * (1 - smooth((t - tx['t1']) / 0.6))
        track = 0; sc = 1.0
        if tx.get('fx') == 'track': kk = smooth((t - tx['t0']) / 2.2); track = int(lerp(26, 8, kk)); sc = lerp(1.06, 1.0, kk)
        im = text_img(tx['s'], tx['f'], tx['sz'], tx['c'], track)
        blit(frame, im, W * tx['x'], H * tx['y'] - (1 - a) * 8, a, sc)

def transitions(frame, shot, t, dur):
    tin = shot.get('tin', 'cut')
    if tin == 'fade' and t < 0.7: frame *= smooth(t / 0.7)
    if tin == 'flash' and t < 0.4: frame += (1 - t / 0.4) ** 2 * 0.9
    if shot.get('tout') == 'fade' and t > dur - 1.6: frame *= 1 - smooth((t - (dur - 1.6)) / 1.6)
    return frame

def full_frame(shot, t, dur, fi):
    f = render_shot_frame(shot, t, dur)
    f = grade(f, shot, fi)
    name_card(f, shot, t, dur); texts(f, shot, t, dur)
    f = transitions(f, shot, t, dur)
    f[:BAR] = 0; f[H - BAR:] = 0
    return (np.clip(f, 0, 1) * 255 + 0.5).astype(np.uint8)

# ---------------------------------------------------------------- main ------
def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--stills'); ap.add_argument('--only'); ap.add_argument('--crf', default='17')
    args = ap.parse_args()
    tl = json.load(open(os.path.join(BUILD, 'timeline.json')))
    shots = film['shots']
    if args.stills:
        os.makedirs(os.path.join(BUILD, 'stills'), exist_ok=True)
        for tt in args.stills.split(','):
            tt = float(tt)
            for s in shots:
                st, du = tl['shots'][s['id']]['start'], tl['shots'][s['id']]['dur']
                if st <= tt < st + du:
                    fr = full_frame(s, tt - st, du, int(tt * FPS))
                    p = os.path.join(BUILD, 'stills', f'{tt:07.2f}_{s["id"]}.jpg'); Image.fromarray(fr).save(p, quality=92); print(p)
        return
    sel = [s for s in shots if not args.only or s['id'] in args.only.split(',')]
    out = os.path.join(BUILD, f"shot_{args.only.replace(',', '_')}.mp4" if args.only else 'mahabharata.mp4')
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-']
    if not args.only: cmd += ['-i', os.path.join(BUILD, 'film.wav'), '-c:a', 'aac', '-b:a', '192k', '-shortest']
    cmd += ['-c:v', 'libx264', '-preset', 'slow', '-crf', args.crf, '-pix_fmt', 'yuv420p', '-tune', 'film', '-movflags', '+faststart', out]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    fi = 0
    for s in sel:
        st, du = tl['shots'][s['id']]['start'], tl['shots'][s['id']]['dur']
        n0, n1 = int(round(st * FPS)), int(round((st + du) * FPS))
        for n in range(n0, n1):
            ff.stdin.write(full_frame(s, n / FPS - st, du, n).tobytes()); fi += 1
        _cache.clear()
        print(f'  {s["id"]:12s} {n1 - n0:5d} frames', file=sys.stderr, flush=True)
    if not args.only:   # pad to the audio length
        total = int(tl['duration'] * FPS)
        black = np.zeros((H, W, 3), np.uint8).tobytes()
        while fi < total: ff.stdin.write(black); fi += 1
    ff.stdin.close(); ff.wait(); print('wrote', out)

if __name__ == '__main__':
    main()
