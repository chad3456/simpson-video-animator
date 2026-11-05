#!/usr/bin/env python3
"""series/script.md: the full ten-episode screenplay, English and Hindi side by side."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WHO = {'NAR': 'Narrator', 'KTIME': 'Krishna as Time', 'YUDHI': 'Yudhishthira', 'DURYO': 'Duryodhana', 'DEVA': 'Devavrata', 'DHRITA': 'Dhritarashtra', 'ABHI': 'Abhimanyu', 'FISHER': 'The fisherman'}
def ts(t): return f"{int(t // 60)}:{t % 60:04.1f}"
out = ['# Mahabharata: Dharma Above All Bonds', '', 'A ten-episode series. Every frame is painted in code with p5.js and p5.brush, then animated and composited in code. Each episode exists in English and in Hindi, with its own voices, cards and subtitles over one shared picture.', '']
for n in range(1, 11):
    e = f'ep{n:02d}'; ep = json.load(open(os.path.join(ROOT, 'series', e + '.json'), encoding='utf-8'))
    tlp = os.path.join(ROOT, 'build', 'series', e, 'timeline.json'); tl = json.load(open(tlp)) if os.path.exists(tlp) else None
    dur = f" ({ts(tl['duration'])})" if tl else ''
    out += [f"## Episode {n}: {ep['title']['en']} / {ep['title']['hi']}{dur}", '', f"*{ep['tag']['en']}* / *{ep['tag']['hi']}*", '']
    for s in ep['shots']:
        head = f"**{ts(tl['shots'][s['id']]['start'])}**" if tl else f"**{s['id']}**"
        if s.get('name'): head += f" · {s['name']['en']} ({s['name']['hi']}), *{s['name']['ep_en']}*"
        out += [head + f" · music: {s['music']}" + (f", ambience: {s['amb']}" if s.get('amb') else ''), '']
        for ln in s['lines']:
            who = WHO.get(ln['who'], ln['who'].capitalize())
            out += [f"- **{who}:** {ln['en']}", f"  {ln['hi']}"]
        out += ['']
out += ['---', '', 'Voices: Kokoro TTS (English and Hindi voices, blended per character). Score: synthesised tanpura, bansuri, shehnai, sarangi, sitar, santoor, choir, dhol, tabla, conch and temple bells. Fonts: Cinzel, Cinzel Decorative, Cormorant Garamond, Rozha One, Tiro Devanagari Hindi, Mukta (all OFL).', '']
open(os.path.join(ROOT, 'series', 'script.md'), 'w', encoding='utf-8').write('\n'.join(out)); print('wrote series/script.md')
