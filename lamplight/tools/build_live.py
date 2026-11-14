#!/usr/bin/env python3
"""Inline the engine and the narration into one self-contained page: dist/lamplight.html"""
import base64, glob, json, os, re
H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
page = open(os.path.join(H, 'index.html')).read()
js = '\n'.join(open(os.path.join(H, f)).read() for f in ('kit.js', 'engine.js', 'story.js'))
page = re.sub(r'<!--SCRIPTS-->.*?<!--/SCRIPTS-->', lambda m: '<script>\n' + js + '\n</script>', page, flags=re.S)
aud = {os.path.basename(f)[:-4]: base64.b64encode(open(f, 'rb').read()).decode() for f in sorted(glob.glob(os.path.join(H, 'audio/*.mp3')))}
page = re.sub(r'<!--AUDIO-->.*?<!--/AUDIO-->', lambda m: '<script>window.LAMP_AUDIO=' + json.dumps(aud) + ';</script>', page, flags=re.S)
os.makedirs(os.path.join(H, 'dist'), exist_ok=True)
out = os.path.join(H, 'dist/lamplight.html')
open(out, 'w').write(page)
print(out, round(len(page) / 1e6, 2), 'MB')
