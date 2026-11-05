#!/usr/bin/env python3
"""Readable screenplay (script.md) from film.json + build/timeline.json."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
film = json.load(open(os.path.join(ROOT, 'film.json'), encoding='utf-8'))
tl = json.load(open(os.path.join(ROOT, 'build', 'timeline.json')))
SCENES = {
    's01_ink': 'Black. A drop of red ink blooms into a blood-red sun.',
    's02_field': 'Kurukshetra at dawn. Two vast armies, spears like reeds, banners in the wind. A conch sounds.',
    's03_title': 'A gold mandala turns on indigo. A brush stroke of red paint sweeps behind the title.',
    'h_bhishma': 'A storm over the Ganga. Bhishma rises from the river, one hand raised to the sky as lightning seals his vow.',
    'h_yudhi': 'A calm golden dawn. The wheel of dharma turns behind Yudhishthira, spear in hand.',
    'h_bhima': 'Boulders under a violet storm. Bhima lifts his mace overhead; the wind howls past him.',
    'h_arjuna': 'Teal dusk. Arjuna draws the Gandiva. A wooden bird sits on a far pole. He looses, and the arrow of light strikes its eye.',
    'h_draupadi': 'Darkness and a sacrificial altar. Draupadi rises out of the flames, embers flying.',
    'h_karna': 'A colossal sun. Karna stands before it in his golden armour, bow in hand.',
    'h_duryo': 'A crimson storm, a serpent banner, a dark palace. Duryodhana, mace on his shoulder.',
    'h_krishna': 'Moonlit Vrindavan, fireflies over the Yamuna. Krishna plays the flute.',
    'e_dice': 'The court of Hastinapura. Shakuni and Yudhishthira kneel over the board; the dice tumble again and again.',
    'e_sari': 'The court. Draupadi raises her arm to the sky while she is dragged by her sari; the elders bow their heads. Golden light falls, and the sari spirals up without end.',
    'e_exile': 'An autumn forest. Five brothers and Draupadi walk into exile as leaves fall.',
    'e_refuse': 'Krishna stands before Duryodhana\'s throne as envoy of peace.',
    'e_armies': 'Kurukshetra. The two hosts and their chariots fill the plain; Arjuna\'s monkey banner flies.',
    'g_chariot': 'Krishna drives the white horses between the armies, Arjuna standing behind him.',
    'g_despair': 'Arjuna sees Bhishma and Drona across the field. His bow slips from his hand.',
    'g_krishna': 'Krishna turns, a halo behind him, and speaks.',
    'g_vishva1': 'The sky tears open into the cosmos. Krishna\'s universal form: many heads, many arms holding the chakra, conch, mace and lotus, galaxies turning around him. Arjuna, tiny, bows.',
    'g_vishva2': 'The cosmic faces blaze; streams of warriors pour into the fire of Time.',
    'g_rise': 'Dawn. Arjuna lifts the Gandiva and draws.',
    'w_bhishma': 'Sunset. Bhishma lies on a bed of arrows.',
    'w_abhi': 'The chakravyuha: rings of soldiers wheel around young Abhimanyu, who holds up a chariot wheel.',
    'w_karna': 'Karna strains to lift his sinking chariot wheel. An arrow of light streaks in.',
    'w_mace': 'Dusk by the lake. Bhima and Duryodhana clash with maces; Duryodhana falls.',
    'f_dawn': 'A silent dawn over the field. Broken wheels and spears. Krishna and Arjuna stand together; the flute plays.',
    'f_end': 'The gold mandala again, and the closing verse.',
}
def ts(t): return f"{int(t // 60)}:{t % 60:04.1f}"
out = [f"# {film['title']}", '',
       'A short cinematic retelling of the Mahabharata. Every frame is painted in code with p5.js and p5.brush (watercolour skies, shadow-puppet heroes with gold accents) and animated in code: camera moves, parallax, rim light, live brush effects.', '',
       f"Length: {ts(tl['duration'])}. Theme: truth and dharma above personal bonds.", '']
lines = {}
for ln in tl['lines']: lines.setdefault(ln['shot'], []).append(ln)
acts = {'s01_ink': 'Prologue', 'h_bhishma': 'The heroes', 'e_dice': 'The fall', 'g_chariot': 'The Gita', 'w_bhishma': 'The war', 'f_dawn': 'Dawn'}
for s in film['shots']:
    st = tl['shots'][s['id']]
    if s['id'] in acts: out += [f"## {acts[s['id']]}", '']
    head = f"**{ts(st['start'])}**"
    if s.get('name'): head += f" · **{s['name']['en']}** ({s['name']['hi']}), *{s['name']['ep']}*"
    out += [head, '', f"*{SCENES.get(s['id'], '')}*", '']
    for tx in s.get('text', []):
        if tx['f'] in ('deva', 'ital'): out += [f"> {tx['s']}", '']
    for ln in lines.get(s['id'], []):
        who = {'KRISHNA_TIME': 'KRISHNA (as Time)'}.get(ln['who'], ln['who'])
        out += [f"**{who}:** {ln['text']}", '']
out += ['---', '', 'Made with p5.js 1.11 and p5.brush 1.1.4 (MIT), Kokoro TTS voices, and a synthesised Indian score (tanpura, shehnai, bansuri, dhol, conch, temple bells). Fonts: Cinzel, Cinzel Decorative, Cormorant Garamond (OFL), Rozha One (OFL).', '']
open(os.path.join(ROOT, 'script.md'), 'w', encoding='utf-8').write('\n'.join(out))
print('wrote script.md')
