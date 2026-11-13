# contact sheet: python3 ramayana/tools/sheet.py <dir> <out.jpg> [cols] [n1 n2 ...]
import sys, glob, os
from PIL import Image
d, out = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
want = set(sys.argv[4:])
fs = sorted(f for f in glob.glob(os.path.join(d, '*.jpg')) if not want or os.path.basename(f)[:3].lstrip('0') in want)
tw = 1800 // cols; th = tw * 9 // 16; rows = (len(fs) + cols - 1) // cols
sh = Image.new('RGB', (tw * cols, th * rows), '#14101d')
for i, f in enumerate(fs): sh.paste(Image.open(f).resize((tw, th), Image.LANCZOS), ((i % cols) * tw, (i // cols) * th))
sh.save(out, quality=85)
