#!/usr/bin/env python3
"""episode.json (+ timeline.json) -> script.md: the readable script of a Shiva Purana episode, with timecodes, in the
folder's language (the English folder, or hi/ for the Hindi dub).
Usage: python3 shiva-purana/engine/make_script.py shiva-purana/episodes/<slug>[/hi]
"""
import json, os, sys

d = sys.argv[1]
ep = json.load(open(os.path.join(d, 'episode.json'), encoding='utf-8'))
tl_path = os.path.join(d, 'timeline.json')
shots = json.load(open(tl_path, encoding='utf-8'))['shots'] if os.path.exists(tl_path) else []
m, cast = ep['meta'], ep['cast']
hi = m.get('lang') == 'hi'
T = lambda o, k: (o.get(k + '_hi') or o.get(k, '')) if hi else o.get(k, '')
tc = lambda t: f"{int(t // 60)}:{int(t % 60):02d}"
seg_start = {}
for s in shots:
    seg_start.setdefault(s.get('seg'), s['start'])
L = {'series': 'शिव पुराण' if hi else 'Shiva Purana', 'source': 'स्रोत' if hi else 'Source', 'scene': 'दृश्य' if hi else 'Scene', 'next': 'अगले अंक में' if hi else 'Next issue'}
out = [f"# {L['series']} · {T(m, 'kicker')}: {T(m, 'title')}", '', f"*{T(m, 'sub')}*", '', T(m, 'logline'), '', f"{L['source']}: {m.get('source', '')}", '']
for seg in ep['sequence']:
    t0 = seg_start.get(seg['id'])
    stamp = f" `{tc(t0)}`" if t0 is not None else ''
    if seg['type'] == 'card':
        if seg['style'] in ('title', 'chapter'):
            out += [f"## {T(seg, 'kicker')}: {T(seg, 'title')}{stamp}", '']
        elif seg['style'] == 'next':
            out += [f"## {L['next']}: {T(seg, 'title')}{stamp}", '', f"*{T(seg, 'sub')}*", '']
        elif seg['style'] == 'end':
            out += ['---', ''] + [f"- {c}" for c in (seg.get('credits_hi') if hi and seg.get('credits_hi') else seg.get('credits', []))] + ['']
    else:
        cap = T(seg, 'caption')
        out += [f"### {L['scene']}: {cap or seg['id']}{stamp}", '']
    for ln in seg.get('lines', []):
        if not ln.get('text'):
            continue
        who = ln.get('who', 'narrator')
        c = cast.get(who, {})
        label = (c.get('label_hi') if hi else None) or c.get('label', who)
        out.append(f"*{label}:* {ln['text']}" if c.get('narrator') else f"**{label}:** {ln['text']}")
        out.append('')
open(os.path.join(d, 'script.md'), 'w', encoding='utf-8').write('\n'.join(out))
print('wrote', os.path.join(d, 'script.md'))
