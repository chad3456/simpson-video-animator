# Assemble the three paintings into a titled triptych poster.
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, sys
OUT = sys.argv[1] if len(sys.argv) > 1 else 'out'
NAME = 'dune-oil-triptych.jpg' if OUT == 'out-oil' else 'dune-triptych.jpg'
here = os.path.dirname(os.path.abspath(__file__))
F = os.path.join(here, '..', 'ramayana-portraits', 'video', 'fonts', 'cinzel.ttf')
G = os.path.join(here, '..', 'anime', 'engine', 'fonts', 'EBGaramond-Italic.ttf')
panels = [
    ('1-dune', 'I · DUNE', 'The Sleeper Must Awaken', '"I must not fear. Fear is the mind-killer."'),
    ('2-dune-messiah', 'II · DUNE MESSIAH', 'The Blind Emperor', 'A prophet walks out of his own prophecy.'),
    ('3-children-of-dune', 'III · CHILDREN OF DUNE', 'The Golden Path', 'One life given, so that all may have a future.'),
]
pw, ph, gap, mx = 1400, 788, 60, 90
W = mx * 2 + pw * 3 + gap * 2
H = 300 + ph + 260
S = Image.new('RGB', (W, H), '#0c0809')
d = ImageDraw.Draw(S)
big = ImageFont.truetype(F, 92); mid = ImageFont.truetype(F, 40); sub = ImageFont.truetype(G, 40); small = ImageFont.truetype(G, 30)
def ctext(x, y, t, f, fill):
    w = d.textlength(t, font=f); d.text((x - w / 2, y), t, font=f, fill=fill)
ctext(W / 2, 90, 'D U N E', big, '#f0d8b0')
ctext(W / 2, 205, 'a triptych after Frank Herbert', sub, '#b89a80')
for i, (fn, t1, t2, q) in enumerate(panels):
    im = Image.open(os.path.join(here, OUT, fn + '.jpg')).resize((pw, ph), Image.LANCZOS)
    x = mx + i * (pw + gap); y = 300
    S.paste(im, (x, y))
    d.rectangle([x - 2, y - 2, x + pw + 1, y + ph + 1], outline='#3a2a24', width=2)
    ctext(x + pw / 2, y + ph + 40, t1, mid, '#e8c8a0')
    ctext(x + pw / 2, y + ph + 100, t2, sub, '#d0b090')
    ctext(x + pw / 2, y + ph + 160, q, small, '#8a7466')
S.save(os.path.join(here, OUT, NAME), quality=90)
print(S.size)
