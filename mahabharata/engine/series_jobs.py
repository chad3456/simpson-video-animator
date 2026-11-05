#!/usr/bin/env python3
"""Paint jobs for series episodes.  python3 engine/series_jobs.py plates|anim ep01 [ep02 ...] [--only shot,shot] > jobs.json"""
import json, os, sys, zlib
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
mode = sys.argv[1]; eps = [a for a in sys.argv[2:] if a.startswith('ep')]
only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
seed = lambda *a: zlib.crc32('|'.join(map(str, a)).encode()) % 100000 + 1
jobs = []
for e in eps:
    ep = json.load(open(os.path.join(ROOT, 'series', e + '.json'), encoding='utf-8'))
    b = os.path.join(ROOT, 'build', 'series', e)
    tl = json.load(open(os.path.join(b, 'timeline.json'))) if mode == 'anim' else None
    for s in ep['shots']:
        if only and s['id'] not in only: continue
        for L in s['layers']:
            spec = {k: v for k, v in L.items() if k not in ('mv', 'rim', 'glow', 't', 'd', 'breath')}
            if mode == 'plates' and L['k'] == 'plate':
                jobs.append(dict(shot=s['id'], layer=L['n'], seed=seed(s['id'], L['n']), t=0, mask=True, spec=spec, out=f"{b}/plates/{s['id']}_{L['n']}"))
            if mode == 'anim' and L['k'] == 'anim':
                dur = tl['shots'][s['id']]['dur'] + 0.3; ev = L.get('every', 2); n = int(dur * ep['fps'] / ev) + 1
                for i in range(n):
                    jobs.append(dict(shot=s['id'], layer=L['n'], seed=seed(s['id'], L['n']), t=round(i * ev / ep['fps'], 4), mask=L.get('b') != 'add', spec=spec, out=f"{b}/anim/{s['id']}_{L['n']}/{i:05d}"))
json.dump(jobs, sys.stdout)
print(f"{len(jobs)} jobs", file=sys.stderr)
