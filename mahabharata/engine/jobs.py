#!/usr/bin/env python3
"""Build paint job lists from film.json (+ timeline.json for animation lengths).
  python3 engine/jobs.py plates  > build/plates.json
  python3 engine/jobs.py anim    > build/anim.json      (needs build/timeline.json)
  options: --only shot1,shot2
"""
import json, sys, os, zlib
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
film = json.load(open(os.path.join(root, 'film.json')))
build = os.path.join(root, 'build')
mode = sys.argv[1]
only = None
if '--only' in sys.argv: only = set(sys.argv[sys.argv.index('--only') + 1].split(','))
seed = lambda *a: zlib.crc32('|'.join(map(str, a)).encode()) % 100000 + 1
jobs = []
tl = json.load(open(os.path.join(build, 'timeline.json'))) if mode == 'anim' else None
fps = film['fps']
for s in film['shots']:
    if only and s['id'] not in only: continue
    for L in s['layers']:
        if mode == 'plates' and L['k'] == 'plate':
            jobs.append(dict(shot=s['id'], layer=L['n'], seed=seed(s['id'], L['n']), t=0, mask=True, out=f"{build}/plates/{s['id']}_{L['n']}"))
        if mode == 'anim' and L['k'] == 'anim':
            dur = tl['shots'][s['id']]['dur'] + 0.3          # a little extra for crossfades
            ev = L.get('every', 2); n = int(dur * fps / ev) + 1
            add = L.get('b') == 'add'
            for i in range(n):
                t = i * ev / fps
                jobs.append(dict(shot=s['id'], layer=L['n'], seed=seed(s['id'], L['n']), t=round(t, 4), mask=not add, out=f"{build}/anim/{s['id']}_{L['n']}/{i:05d}"))
json.dump(jobs, sys.stdout)
