# Thumbnails + downloadable zip from ramayana/images. usage: python3 ramayana/tools/package.py
import os, json, glob, zipfile
from PIL import Image
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
imgs = sorted(glob.glob(os.path.join(root, 'images', '*.jpg')))
os.makedirs(os.path.join(root, 'thumbs'), exist_ok=True)
for f in imgs:
    Image.open(f).resize((640, 360), Image.LANCZOS).save(os.path.join(root, 'thumbs', os.path.basename(f)[:3] + '.jpg'), quality=82)
meta = json.load(open(os.path.join(root, 'paintings.json')))
lines = ['RAMAYANA IN ONE HUNDRED PAINTINGS', 'Scenes and chapter references follow The Valmiki Ramayana, translated by Bibek Debroy (Critical Edition).', '']
for m in meta:
    lines += [f"{m['n']:03d}  {m['title']}", f"     {m['kanda']} | {m['ref']}" + (f" | {m['aside']}" if m.get('aside') else ''), '     ' + m['text'], '']
z = os.path.join(root, 'ramayana-100-paintings.zip')
with zipfile.ZipFile(z, 'w', zipfile.ZIP_STORED) as zf:
    for f in imgs: zf.write(f, 'ramayana-100-paintings/' + os.path.basename(f))
    zf.writestr('ramayana-100-paintings/CAPTIONS.txt', '\n'.join(lines))
print(len(imgs), 'images;', round(os.path.getsize(z) / 1e6, 1), 'MB zip')
