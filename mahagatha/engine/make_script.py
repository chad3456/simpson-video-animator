#!/usr/bin/env python3
"""episode.json (+ timeline.json) -> script.md: the readable Hindi script of a Mahagatha episode, with timecodes.
Usage: python3 mahagatha/engine/make_script.py mahagatha/episodes/<slug>
"""
import json, os, sys

d = sys.argv[1]
ep = json.load(open(os.path.join(d, 'episode.json'), encoding='utf-8'))
tl_path = os.path.join(d, 'timeline.json')
shots = json.load(open(tl_path, encoding='utf-8'))['shots'] if os.path.exists(tl_path) else []
m, cast = ep['meta'], ep['cast']
tc = lambda t: f"{int(t // 60)}:{int(t % 60):02d}"

starts = {}
for s in shots:
    starts.setdefault((s.get('seg'), s.get('line')), s['start'])
seg_start = {}
for s in shots:
    seg_start.setdefault(s.get('seg'), s['start'])

out = [f"# महागाथा · {m.get('kicker', '')}: {m.get('title', '')}", '', f"*{m.get('sub', '')}*", '',
       m.get('logline', ''), '', f"स्रोत: {m.get('source', '')}", '']
for i, seg in enumerate(ep['sequence']):
    t0 = seg_start.get(seg['id'])
    stamp = f" `{tc(t0)}`" if t0 is not None else ''
    if seg['type'] == 'card':
        if seg['style'] in ('title', 'chapter'):
            out += [f"## {seg.get('kicker', '')}: {seg.get('title', '')}{stamp}", '']
        elif seg['style'] == 'next':
            out += [f"## {seg.get('title', 'अगले अध्याय में')}{stamp}", '', f"*{seg.get('sub', '')}*", '']
        elif seg['style'] == 'end':
            out += ['---', ''] + [f"- {c}" for c in seg.get('credits', [])] + ['']
    else:
        out += [f"### दृश्य: {seg['id']}{stamp}", '']
    for ln in seg.get('lines', []):
        if not ln.get('text'):
            continue
        who = ln.get('who', 'narrator')
        label = cast.get(who, {}).get('label', who)
        out.append(f"**{label}:** {ln['text']}" if who != 'narrator' else f"*{label}:* {ln['text']}")
        out.append('')
open(os.path.join(d, 'script.md'), 'w', encoding='utf-8').write('\n'.join(out))
print('wrote', os.path.join(d, 'script.md'))
