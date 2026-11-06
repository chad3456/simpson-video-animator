import sys, os, numpy as np
sys.path.insert(0, '/home/user/simpson-video-animator/mahabharata/engine'); os.chdir('/home/user/simpson-video-animator/mahabharata/engine')
import compose as C
from PIL import Image
C.FONT_FILES.update({'mukta': 'Mukta-SemiBold.ttf', 'tiro': 'TiroDevanagariHindi.ttf'})
P = '../build/series/ep08/plates/'
def ld(n): return np.asarray(Image.open(P + n + '.jpg').convert('RGB'), np.float32) / 255
def mk(n): return np.asarray(Image.open(P + n + '.mask.png').convert('L'), np.float32)[..., None] / 255
f = ld('e8_vishva1_bg')
for n in ['e8_vishva1_arms', 'e8_vishva1_form']: m = mk(n); f = f * (1 - m) + ld(n) * m
H, W = f.shape[:2]; C.W, C.H = W, H; y = np.linspace(0, 1, H)[:, None, None]
f = f * (1 - 0.9 * np.clip((y - 0.55) / 0.35, 0, 1) ** 1.3)
for lang, rows in {'en': [('MAHABHARATA', 'deco', 92, '#f6dd8a', 10, 0.845), ('A SERIES IN TEN EPISODES  ·  DHARMA ABOVE ALL BONDS', 'cinzel', 26, '#f1e6cc', 8, 0.935)],
                   'hi': [('महाभारत', 'deva', 120, '#f6dd8a', 0, 0.835), ('दस भागों की गाथा  ·  धर्म सब बंधनों से ऊपर', 'tiro', 34, '#f1e6cc', 0, 0.94)]}.items():
    g = f.copy()
    for s, fo, sz, col, tr, yy in rows: C.blit(g, C.text_img(s, fo, sz, col, tr), W / 2, H * yy, 1.0)
    out = f'/mnt/project-files/mahabharata/series/poster_{lang}.jpg'
    Image.fromarray((np.clip(g, 0, 1) * 255).astype(np.uint8)).save(out, quality=92); print(out)
