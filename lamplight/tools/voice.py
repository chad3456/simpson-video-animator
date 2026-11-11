#!/usr/bin/env python3
"""Narration for Lamplight: one Kokoro clip per line.
Writes build/voice/<key>.wav (24 kHz), audio/<key>.mp3 for the live page, and build/durations.json."""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE = os.environ.get('LAMP_VOICE', 'bm_george')
SPEED = float(os.environ.get('LAMP_SPEED', '0.9'))
SAY = {  # gentle respellings so the narrator says the names the way they are said at home
    'Kaikeyi': 'Kaikayee', 'Jatayu': 'Jataayu', 'Maricha': 'Maareecha', 'Kishkindha': 'Kishkinda',
    'Sugriva': 'Sugreeva', 'Jambavan': 'Jaambavan', 'Valmiki': 'Vaalmeeki', 'vanaras': 'vaanaras',
    'Matali': 'Maatali', 'Tamasa': 'Tamasaa', 'Kumbhakarna': 'Kumbha karna', 'Pushpaka': 'Pushpak',
    'yojanas': 'yojanaas', 'Mithila': 'Mithilaa', 'Dasharatha': 'Dasharath', 'Lakshmana': 'Lakshman',
}
lines = json.loads(subprocess.check_output(['node', os.path.join(HERE, 'tools/dump_lines.js')]))
os.makedirs(os.path.join(HERE, 'build/voice'), exist_ok=True)
os.makedirs(os.path.join(HERE, 'audio'), exist_ok=True)
k = Kokoro(os.path.expanduser('~/models/kokoro-v1.0.int8.onnx'), os.path.expanduser('~/models/voices-v1.0.bin'))
durs = {}
dpath = os.path.join(HERE, 'build/durations.json')
cache = json.load(open(dpath)) if os.path.exists(dpath) else {}
for ln in lines:
    text = ln['text']
    for a, b in SAY.items():
        text = re.sub(r'\b%s\b' % a, b, text)
    wav = os.path.join(HERE, f"build/voice/{ln['key']}.wav")
    sig_key = f"{VOICE}|{SPEED}|{text}"
    if os.path.exists(wav) and cache.get('_sig', {}).get(ln['key']) == sig_key:
        durs[ln['key']] = cache[ln['key']]; continue
    s, sr = k.create(text, voice=VOICE, speed=SPEED, lang='en-gb' if VOICE.startswith('b') else 'en-us')
    s = np.asarray(s, dtype=np.float32)
    nz = np.where(np.abs(s) > 0.01)[0]
    if len(nz): s = s[max(0, nz[0] - 600): nz[-1] + 2400]
    s = s / max(1e-6, np.abs(s).max()) * 0.9
    sf.write(wav, s, sr)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '24000', '-b:a', '40k', os.path.join(HERE, f"audio/{ln['key']}.mp3")], check=True)
    durs[ln['key']] = round(len(s) / sr, 3)
    cache.setdefault('_sig', {})[ln['key']] = sig_key
    print(ln['key'], durs[ln['key']], flush=True)
durs['_sig'] = cache.get('_sig', {})
json.dump(durs, open(dpath, 'w'), indent=1)
print('total narration', round(sum(v for kk, v in durs.items() if kk != '_sig'), 1), 's')
