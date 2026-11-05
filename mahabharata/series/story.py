#!/usr/bin/env python3
"""The Mahabharata series: ten episodes, every shot written once in English and Hindi.

Running this writes series/epNN.json. Each shot has narration and dialogue lines (who, English, Hindi), a music cue,
an ambience bed, sound effects, a camera move and painted layers (data for engine/eps/lib.js).
"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- helpers ---
def bg(d=0.6, **spec): return dict(n='bg', k='plate', d=d, **spec)
def plate(n, d=1.0, **spec): return dict(n=n, k='plate', d=d, **spec)
def anim(n, every=2, add=True, d=1.0, **spec):
    L = dict(n=n, k='anim', every=every, d=d, **spec)
    if add: L['b'] = 'add'
    return L
def fx(kind, every=3, d=1.0, n=None, **o):
    return anim(n or ('fx_' + kind), every, kind not in ('petals', 'leaves'), d, fx=dict(kind=kind, **o))
def face(who, x=800, y=430, R=190, f=1, expr=None, rim=None, glow=None, n='face', d=1.0, **o):
    p = dict(who=who, x=x, y=y, R=R, f=f, **o)
    if expr: p['expr'] = expr
    L = plate(n, d, portrait=p)
    if rim: L['rim'] = rim
    if glow: L['glow'] = glow
    L['breath'] = 1
    return L
def figs(n, items, d=1.0, **kw): return plate(n, d, figs=items, **kw)
def fig(who, x, y, S, f=1, pose='stand', **kw): return dict(who=who, x=x, y=y, S=S, f=f, pose=pose, **kw)
def piece(n, draw, k='plate', d=1.0, every=2, add=False, **args):
    L = dict(n=n, k=k, d=d, draw=draw, args=args)
    if k == 'anim': L['every'] = every
    if add: L['b'] = 'add'
    return L
def ln(who, en, hi, **kw): return dict(who=who, en=en, hi=hi, **kw)
def name(en, hi, ep_en, ep_hi, side=1): return dict(en=en, hi=hi, ep_en=ep_en, ep_hi=ep_hi, side=side)
def S(id, music, lines, layers, cam=None, amb=None, sfx=None, **kw):
    s = dict(id=id, music=music, lines=lines, layers=layers, cam=cam or [[800, 450, 1.0], [800, 440, 1.08]], **kw)
    if amb: s['amb'] = amb
    if sfx: s['sfx'] = sfx
    return s
def push(x, y, z0=1.0, z1=1.14, dx=0, dy=-10): return [[x, y, z0], [x + dx, y + dy, z1]]
RIM_GOLD = ['#ffd890', -3, -2, 0.55]; RIM_COOL = ['#bfe0ff', -3, -2, 0.5]; RIM_FIRE = ['#ff9050', 3, -2, 0.6]

EPISODES = []
def EP(n, en, hi, tag_en, tag_hi, shots):
    EPISODES.append(dict(n=n, id=f'ep{n:02d}', title=dict(en=en, hi=hi), tag=dict(en=tag_en, hi=tag_hi), shots=shots))

# =============================================================== EPISODE 1 ===
EP(1, 'The Terrible Vow', 'भीष्म प्रतिज्ञा', 'A son gives up everything for his father.', 'एक पुत्र ने पिता के लिए सब कुछ त्याग दिया।', [
  S('e1_open', 'river', [
      ln('NAR', 'Long before the war of Kurukshetra, there was a river, a king, and a promise.',
                'कुरुक्षेत्र के युद्ध से बहुत पहले, एक नदी थी, एक राजा था, और एक वचन था।', at=4.6)],
    [bg(set='river', tod='dawn', hz=560, palace=[1040, 360, 230], sun=[560, 420, 90], lotus=8, reeds=1), fx('sparkle', y0=600, y1=900, n=90)],
    cam=push(800, 470, 1.0, 1.1), amb='river', min=11, eptitle=1, tin='fade'),
  S('e1_ganga', 'love', [
      ln('NAR', 'King Shantanu of Hastinapura fell in love with a woman he met by the Ganga. She agreed to be his queen, on one condition.',
                'हस्तिनापुर के राजा शांतनु को गंगा के तट पर एक स्त्री से प्रेम हो गया। वह रानी बनने को तैयार हुई, पर एक शर्त पर।'),
      ln('GANGA', 'Never question anything I do. The day you ask, I will leave you.',
                  'मैं जो भी करूँ, कभी प्रश्न मत करना। जिस दिन पूछोगे, मैं तुम्हें छोड़ जाऊँगी।')],
    [bg(set='river', tod='dusk', hz=600, reeds=1), figs('king', [fig('shantanu', 330, 860, 560, 1, 'bless')], d=0.85),
     face('ganga', 1080, 420, 180, -1, 'calm', rim=RIM_COOL, glow=['#9fd8ff', 30, 0.35]), fx('sparkle', y0=620, y1=900, n=70, col='#dff4ff')],
    cam=push(880, 450, 1.0, 1.12), amb='river', sfx=[dict(n='sparkle', at=0.5, v=0.4)]),
  S('e1_sons', 'sorrow', [
      ln('NAR', 'Seven sons were born. Seven times, at dawn, she carried the child into the river. The king kept his word, and his silence.',
                'सात पुत्र जन्मे। सात बार, भोर में, वह बालक को नदी में ले गई। राजा ने अपना वचन निभाया, और अपना मौन भी।'),
      ln('NAR', 'At the eighth, he could bear it no more.', 'आठवें पर उनसे रहा न गया।')],
    [bg(set='river', tod='night', hz=560, moon=[1200, 200, 60]), figs('ganga', [dict(who='ganga', x=820, y=900, S=520, f=1, arm=[70, 110])], d=0.9, rim=RIM_COOL),
     piece('lamps', 'floatLamps', k='anim', every=3, add=True)],
    cam=push(800, 470, 1.04, 1.12), amb='river', sfx=[dict(n='splash', at=3.0, v=0.5)]),
  S('e1_stop', 'tension', [
      ln('SHANTANU', 'Stop! Who are you, that you drown your own children?', 'रुको! तुम कौन हो, जो अपने ही बच्चों को डुबो देती हो?'),
      ln('GANGA', 'I am Ganga. Your sons were cursed to be born as men; I set them free. This one will live. His name is Devavrata.',
                  'मैं गंगा हूँ। तुम्हारे पुत्र शापवश मनुष्य बने थे; मैंने उन्हें मुक्त किया। यह जीवित रहेगा। इसका नाम देवव्रत है।', fx='divine')],
    [bg(set='river', tod='night', hz=560, moon=[1250, 180, 55]), face('shantanu', 470, 440, 170, 1, 'fear', n='king', rim=RIM_COOL),
     face('ganga', 1130, 430, 170, -1, 'sorrow', rim=RIM_COOL, glow=['#9fd8ff', 30, 0.4]), fx('sparkle', y0=620, y1=900, n=60, col='#dff4ff')],
    cam=[[700, 450, 1.08], [920, 445, 1.1]], amb='river'),
  S('e1_deva', 'heroic', [
      ln('NAR', 'Devavrata grew into a prince without equal: a scholar, a warrior, the heir of Hastinapura.',
                'देवव्रत एक अद्वितीय राजकुमार बना: विद्वान भी, योद्धा भी, हस्तिनापुर का उत्तराधिकारी।')],
    [bg(set='palace', tod='gold', x=360, w=880, h=560), face('devavrata', 1020, 430, 200, -1, 'stern', rim=RIM_GOLD), fx('dust', col='#f0c070', n=60)],
    cam=push(980, 450, 1.0, 1.12), amb='wind', hero=1, name=name('DEVAVRATA', 'देवव्रत', 'son of Ganga', 'गंगापुत्र', -1)),
  S('e1_satya', 'love', [
      ln('NAR', 'Years later, by the Yamuna, the king met Satyavati, a fisherman\'s daughter, and his heart was lost again.',
                'बरसों बाद, यमुना के किनारे, राजा ने मछुआरे की बेटी सत्यवती को देखा, और उनका मन फिर हार गया।'),
      ln('FISHER', 'She will marry you, king, but only if her son becomes king after you.',
                   'वह आपसे विवाह करेगी, राजन, पर तभी जब आपके बाद उसका पुत्र राजा बने।')],
    [bg(set='river', tod='mist', hz=520, lotus=10, reeds=1), piece('boat', 'boat', d=0.9, x=760, y=700, s=1.0),
     face('satyavati', 1120, 430, 165, -1, 'calm'), fx('sparkle', y0=560, y1=900, n=50)],
    cam=push(900, 460, 1.0, 1.1), amb='river'),
  S('e1_grief', 'sorrow', [
      ln('NAR', 'The king would not take the throne from his son. He said nothing, and wasted away with grief.',
                'राजा अपने पुत्र से सिंहासन नहीं छीन सकते थे। वे कुछ न बोले, और शोक में घुलते चले गए।')],
    [bg(set='chamber', tone='#20101a', moon=1), face('shantanu', 700, 450, 190, 1, 'sorrow', rim=['#ffb060', 3, -2, 0.5])],
    cam=push(720, 460, 1.04, 1.16), amb='night'),
  S('e1_vow', 'storm', [
      ln('NAR', 'Devavrata learned the truth, and went to the fisherman himself.', 'देवव्रत को सच पता चला, और वे स्वयं मछुआरे के पास गए।'),
      ln('DEVA', 'Hear me, earth and sky! I give up the throne. And I will never marry, so that no child of mine will ever claim it.',
                 'सुनो, धरती और आकाश! मैं सिंहासन का त्याग करता हूँ। और मैं आजीवन विवाह नहीं करूँगा, ताकि मेरी कोई संतान कभी इस पर दावा न करे।', fx='elder')],
    [bg(set='sky', tod='storm', hz=720, ground='#1a2030'), figs('hero', [fig('devavrata', 800, 900, 620, 1, 'vow')], rim=['#dfefff', -3, -2, 0.8], glow=['#a0c0ff', 18, 0.25]),
     fx('flash', every=1, at=[1.2, 6.5, 9.0], bolt=1100), fx('rain', n=180)],
    cam=[[800, 500, 1.1], [800, 440, 1.0]], amb='storm', sfx=[dict(n='thunder', at=1.2), dict(n='thunder', at=6.5, v=0.9)], shake=[[6.5, 8]]),
  S('e1_bhishma', 'divine', [
      ln('NAR', 'The heavens rained flowers. The gods called him Bhishma: he of the terrible vow. And his father gave him a boon: death would come to him only when he chose it.',
                'आकाश से पुष्प बरसे। देवताओं ने उन्हें भीष्म कहा: भीषण प्रतिज्ञा करने वाला। और पिता ने वरदान दिया: मृत्यु उनके पास तभी आएगी जब वे स्वयं चाहेंगे।')],
    [bg(set='sky', tod='gold', hz=740, hills=1), fx('rays', x=800, y=120, r0=60, r1=1000, col='#fff0c0'), face('bhishma', 800, 450, 200, 1, 'stern', rim=RIM_GOLD, glow=['#ffe0a0', 30, 0.3]),
     fx('petals', every=2, n=110)],
    cam=push(800, 450, 1.0, 1.12), amb='temple', sfx=[dict(n='bells', at=0.4), dict(n='sparkle', at=1.0)], hero=1,
    name=name('BHISHMA', 'भीष्म', 'he of the terrible vow', 'भीषण प्रतिज्ञा वाले', 1)),
  S('e1_end', 'title', [
      ln('NAR', 'Love for his father had bound him to a throne he would never sit on. One day, that same vow would make him stand against dharma itself.',
                'पिता के प्रेम ने उन्हें उस सिंहासन से बाँध दिया, जिस पर वे कभी नहीं बैठे। एक दिन यही वचन उन्हें धर्म के ही विरुद्ध खड़ा कर देगा।')],
    [bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), figs('guard', [fig('bhishma', 1220, 880, 600, -1, 'spear', weapon='spear')], d=0.9, rim=RIM_GOLD), fx('dust', col='#f0b060', n=50)],
    cam=push(800, 450, 1.1, 1.0), amb='court', tout='fade', min=9),
])

# =============================================================== EPISODE 2 ===
EP(2, 'The Princes', 'राजकुमार', 'Envy is born, and a friendship that will cost everything.', 'ईर्ष्या का जन्म, और एक मित्रता जिसकी कीमत सब कुछ होगी।', [
  S('e2_open', 'court', [
      ln('NAR', 'Hastinapura had two princes. Dhritarashtra, the elder, was born blind, so the crown went to his brother Pandu.',
                'हस्तिनापुर के दो राजकुमार थे। बड़े धृतराष्ट्र जन्म से अंधे थे, इसलिए मुकुट उनके भाई पांडु को मिला।', at=4.6)],
    [bg(set='court', tone='#4a1612', throne=[800, 660, 240], canopy=1), face('dhrita', 1060, 440, 180, -1, 'sorrow', rim=RIM_GOLD)],
    cam=push(940, 450, 1.0, 1.1), amb='court', min=11, eptitle=1, tin='fade'),
  S('e2_births', 'divine', [
      ln('NAR', 'Pandu\'s queens, Kunti and Madri, called on the gods and were given five sons: the Pandavas. Yudhishthira from Dharma, Bhima from the Wind, Arjuna from Indra, and the twins from the Ashvins.',
                'पांडु की रानियों, कुंती और माद्री ने देवताओं का आह्वान किया और उन्हें पाँच पुत्र मिले: पांडव। धर्म से युधिष्ठिर, वायु से भीम, इंद्र से अर्जुन, और अश्विनीकुमारों से जुड़वाँ भाई।')],
    [bg(set='void', base='#0a1030', mandala=300, my=420), piece('lights', 'fiveLights', k='anim', every=2, add=True), face('kunti', 800, 470, 170, 1, 'awe', rim=RIM_GOLD, glow=['#ffe0a0', 30, 0.3])],
    cam=push(800, 450, 1.0, 1.1), amb='temple', sfx=[dict(n='sparkle', at=1), dict(n='magic', at=6), dict(n='bell', at=10)]),
  S('e2_gandhari', 'sorrow', [
      ln('NAR', 'Gandhari, wife of the blind king, bound her own eyes so she would never see what her husband could not. She bore a hundred sons: the Kauravas.',
                'अंधे राजा की पत्नी गांधारी ने अपनी आँखों पर पट्टी बाँध ली, ताकि वह कभी वह न देखे जो उसका पति नहीं देख सकता। उसने सौ पुत्रों को जन्म दिया: कौरव।')],
    [bg(set='chamber', tone='#2a1a10'), face('gandhari', 760, 450, 190, 1, 'calm', rim=['#ffb060', 3, -2, 0.5]), piece('jars', 'jars', d=0.85)],
    cam=push(760, 460, 1.02, 1.14), amb='night'),
  S('e2_envy', 'tension', [
      ln('NAR', 'The eldest Kaurava, Duryodhana, watched the Pandavas with burning envy. He fed Bhima poison and threw him into the river.',
                'सबसे बड़े कौरव दुर्योधन पांडवों को जलन से देखते रहे। उसने भीम को विष खिलाकर नदी में फेंक दिया।'),
      ln('NAR', 'But Bhima came back, stronger than ever.', 'पर भीम लौट आए, पहले से भी अधिक बलवान।')],
    [bg(set='river', tod='dusk', hz=560), face('duryo', 560, 440, 190, 1, 'cruel', rim=RIM_FIRE, n='duryo'), face('bhima', 1150, 470, 170, -1, 'smile', n='bhima', t=[7.0, 99])],
    cam=[[620, 450, 1.1], [900, 450, 1.0]], amb='river', sfx=[dict(n='splash', at=4.5)]),
  S('e2_drona', 'forest', [
      ln('NAR', 'The princes learned the arts of war from the great master Drona.', 'राजकुमारों ने महान आचार्य द्रोण से युद्धकला सीखी।'),
      ln('DRONA', 'Look at the bird on that tree. Tell me what you see.', 'उस पेड़ पर बैठी चिड़िया को देखो। बताओ, तुम्हें क्या दिखता है?', fx='elder')],
    [bg(set='forest', tod='day'), face('drona', 1060, 440, 190, -1, 'stern', rim=RIM_GOLD), piece('bird', 'woodBird', d=0.8, x=380, y=330)],
    cam=push(900, 450, 1.0, 1.1), amb='birds', hero=1, name=name('DRONA', 'द्रोण', 'the master', 'आचार्य', -1)),
  S('e2_eye', 'tension', [
      ln('YUDHI', 'I see the tree, the branches, the leaves, the bird, my brothers...', 'मुझे पेड़ दिखता है, डालियाँ, पत्ते, चिड़िया, मेरे भाई...'),
      ln('ARJUNA', 'I see only the eye of the bird, master.', 'मुझे केवल चिड़िया की आँख दिखती है, गुरुदेव।'),
      ln('DRONA', 'Then shoot.', 'तो बाण चलाओ।', fx='elder')],
    [bg(set='forest', tod='day'), figs('archer', [fig('arjuna', 560, 900, 720, 1, 'draw', weapon='bowDrawn')], rim=RIM_GOLD), piece('bird', 'woodBird', d=1.0, x=1300, y=320, s=1.5),
     piece('shot', 'arrowStreak', k='anim', every=1, add=True, t0=9.0, x0=820, y0=520, x1=1300, y1=330)],
    cam=[[700, 470, 1.15], [1200, 360, 1.5]], amb='birds', sfx=[dict(n='whoosh', at=9.0), dict(n='crack', at=9.3, v=0.5)]),
  S('e2_arena', 'heroic', [
      ln('NAR', 'At the great tournament, Arjuna dazzled the city. Then a stranger in golden armour stepped into the arena.',
                'महान प्रतियोगिता में अर्जुन ने पूरे नगर को चकित कर दिया। तभी स्वर्ण कवच पहने एक अजनबी रंगभूमि में उतरा।')],
    [bg(set='arena', tod='day'), figs('arjuna', [fig('arjuna', 420, 880, 560, 1, 'release', weapon='bow')], rim=RIM_GOLD), figs('karna', [fig('karna', 1200, 880, 600, -1, 'stand', weapon='bowRest')], rim=['#ffe08a', -3, -2, 0.8], glow=['#ffd060', 20, 0.35]),
     fx('dust', col='#f0c070', n=80)],
    cam=[[600, 470, 1.1], [1050, 460, 1.05]], amb='crowd', sfx=[dict(n='drumroll', at=3.0)]),
  S('e2_karna', 'heroic', [
      ln('KARNA', 'Everything Arjuna has done, I can do. Fight me.', 'अर्जुन ने जो कुछ किया, वह मैं भी कर सकता हूँ। मुझसे युद्ध करो।')],
    [bg(set='sky', tod='gold', sun=[800, 380, 220], sunCol='#f6b030', hills=1, ground='#8a5a3a'), fx('rays', x=800, y=380, r0=200, r1=1000, col='#ffe0a0', spin=2),
     face('karna', 800, 440, 200, 1, 'stern', rim=RIM_GOLD)],
    cam=push(800, 450, 1.0, 1.12), amb='crowd', hero=1, name=name('KARNA', 'कर्ण', 'son of the Sun', 'सूर्यपुत्र', 1)),
  S('e2_insult', 'sorrow', [
      ln('NAR', 'But they asked his lineage. He had been raised by a charioteer, and the princes laughed.', 'पर उसका कुल पूछा गया। वह एक सारथी के घर पला था, और राजकुमार हँस पड़े।'),
      ln('BHIMA', 'A charioteer\'s son? Go back and hold the horses\' reins!', 'सारथी का बेटा? जाओ, घोड़ों की लगाम पकड़ो!', fx='growl')],
    [bg(set='arena', tod='day'), face('karna', 560, 470, 180, 1, 'sorrow', n='karna'), face('bhima', 1150, 450, 180, -1, 'cruel', n='bhima')],
    cam=[[620, 460, 1.12], [1000, 450, 1.05]], amb='crowd', sfx=[dict(n='crowdlaugh', at=1.5, v=0.6)]),
  S('e2_anga', 'heroic', [
      ln('DURYO', 'Valour has no caste! I crown you king of Anga. From today, you are my friend.', 'वीरता की कोई जाति नहीं होती! मैं तुम्हें अंग देश का राजा बनाता हूँ। आज से तुम मेरे मित्र हो।', fx='growl'),
      ln('KARNA', 'Then my life is yours, for as long as I breathe.', 'तो यह जीवन तुम्हारा है, जब तक मेरी साँस है।')],
    [bg(set='arena', tod='dusk'), figs('two', [fig('karna', 900, 880, 620, -1, 'bowLow'), fig('duryo', 620, 880, 640, 1, 'bless')], rim=RIM_GOLD), fx('petals', n=60)],
    cam=push(780, 450, 1.0, 1.12), amb='crowd', sfx=[dict(n='conch', at=0.3, v=0.5), dict(n='cheer', at=1.0, v=0.6)]),
  S('e2_end', 'lament', [
      ln('NAR', 'In the crowd, Kunti saw his golden earrings and knew him: her firstborn, the child she had set adrift on a river. She said nothing.',
                'भीड़ में कुंती ने उसके स्वर्ण कुंडल देखे और उसे पहचान लिया: उसका पहला पुत्र, जिसे उसने नदी में बहा दिया था। वह कुछ न बोली।'),
      ln('NAR', 'A bond of gratitude had been forged, and it would hold Karna to the wrong side until the end.',
                'कृतज्ञता का एक बंधन बन चुका था, जो अंत तक कर्ण को गलत पक्ष से बाँधे रखेगा।')],
    [bg(set='arena', tod='dusk'), face('kunti', 800, 450, 200, 1, 'sorrow', rim=RIM_GOLD)],
    cam=push(800, 450, 1.05, 1.18), amb='wind', tout='fade', min=10),
])

# =============================================================== EPISODE 3 ===
EP(3, 'Fire and the Swayamvar', 'लाक्षागृह और स्वयंवर', 'A palace built to burn, and a bride won by one arrow.', 'जलने के लिए बना महल, और एक बाण से जीती दुल्हन।', [
  S('e3_open', 'tension', [
      ln('NAR', 'Duryodhana built a beautiful palace for the Pandavas at Varanavata. It was made of lac, wax and oil. It was built to burn.',
                'दुर्योधन ने वारणावत में पांडवों के लिए एक सुंदर महल बनवाया। वह लाख, मोम और तेल से बना था। वह जलने के लिए बना था।', at=4.6)],
    [bg(set='palace', tod='dusk', x=340, w=920, h=560, col='#c89a6a'), fx('dust', col='#f0b060', n=40)],
    cam=push(800, 460, 1.0, 1.1), amb='wind', min=11, eptitle=1, tin='fade'),
  S('e3_vidura', 'tension', [
      ln('VIDURA', 'A fire cannot burn one who has dug a way out beneath it. Remember, Yudhishthira.', 'जिसने नीचे से रास्ता खोद रखा हो, उसे आग नहीं जला सकती। याद रखना, युधिष्ठिर।', fx='elder')],
    [bg(set='chamber', tone='#2a1810'), face('vidura', 560, 450, 180, 1, 'stern', n='vidura', rim=['#ffb060', 3, -2, 0.5]), face('yudhi', 1120, 450, 170, -1, 'calm', n='yudhi')],
    cam=[[680, 450, 1.1], [920, 450, 1.05]], amb='night', hero=1, name=name('VIDURA', 'विदुर', 'the wise', 'नीतिज्ञ', 1)),
  S('e3_fire', 'fire', [
      ln('NAR', 'On a moonless night the palace went up in flames. All the world thought the Pandavas were dead.', 'एक अमावस की रात महल धू-धू कर जल उठा। सारे संसार ने समझा कि पांडव मर गए।'),
      ln('NAR', 'But they had slipped away through a tunnel, with their mother.', 'पर वे अपनी माता के साथ सुरंग से निकल चुके थे।')],
    [bg(set='palace', tod='night', x=340, w=920, h=560, col='#4a3028', ground='#100808'), fx('fire', every=2, at=[[500, 640, 300, 420], [800, 600, 380, 520], [1120, 640, 300, 420]], n=120), fx('glow', x=800, y=500, r=600, col='#ff7030', rate=5)],
    cam=push(800, 470, 1.0, 1.12), amb='fire', sfx=[dict(n='fire', at=0.5), dict(n='boom', at=3.0, v=0.6), dict(n='crack', at=5)], g=dict(tint='#ff9060', k=0.12)),
  S('e3_forest', 'forest', [
      ln('NAR', 'They lived in the forest as poor brahmins, hidden from the world, waiting.', 'वे निर्धन ब्राह्मणों के वेश में वन में रहने लगे, संसार से छिपकर, प्रतीक्षा करते हुए।')],
    [bg(set='forest', tod='dawn'), figs('walk', [fig('brahmin', 300, 860, 420, 1, 'stand'), fig('bhima', 520, 870, 470, 1, 'stand', style=dict(dhoti='#e8dcc0', crown='bun', scarf='#d9c9a0')), dict(who='kunti', x=700, y=860, S=400, f=1), fig('arjuna', 880, 860, 430, 1, 'stand', style=dict(dhoti='#e8dcc0', crown='bun', scarf='#d9c9a0')), fig('nakula', 1040, 860, 400, 1, 'stand', style=dict(dhoti='#e8dcc0', crown='bun')), fig('sahadeva', 1190, 860, 400, 1, 'stand', style=dict(dhoti='#e8dcc0', crown='bun'))], mv=dict(dx=[-120, 120], t=[0, 12])),
     fx('dust', col='#f0e0b0', n=50)],
    cam=push(800, 470, 1.04, 1.0), amb='birds'),
  S('e3_hall', 'court', [
      ln('NAR', 'Then came news from Panchala. King Drupada\'s daughter would marry the man who could pierce the eye of a spinning fish, looking only at its reflection in a pool of oil.',
                'तभी पांचाल से समाचार आया। राजा द्रुपद की पुत्री उससे विवाह करेगी, जो तेल के कुंड में केवल परछाई देखकर घूमती मछली की आँख भेद सके।')],
    [bg(set='court', tone='#5a1a30', canopy=1), piece('wheel', 'fishWheel', k='anim', every=2, x=800, y=230, s=1.0), piece('pool', 'oilPool', d=1.0, x=800, y=780)],
    cam=[[800, 700, 1.25], [800, 330, 1.05]], amb='court', sfx=[dict(n='drumroll', at=6)]),
  S('e3_draupadi', 'love', [
      ln('NAR', 'She was Draupadi, born from the sacred fire, and she would choose no ordinary man.', 'वह द्रौपदी थी, यज्ञ की अग्नि से जन्मी, और वह किसी साधारण पुरुष को नहीं चुनती।')],
    [bg(set='court', tone='#5a1a30'), fx('embers', n=60, col='#ffb060'), face('draupadi', 800, 450, 200, 1, 'calm', rim=RIM_FIRE, glow=['#ff9040', 26, 0.3])],
    cam=push(800, 450, 1.0, 1.14), amb='court', hero=1, name=name('DRAUPADI', 'द्रौपदी', 'born of fire', 'अग्नि से जन्मी', 1)),
  S('e3_karna', 'sorrow', [
      ln('NAR', 'King after king failed to even lift the bow. Then Karna stepped forward.', 'एक के बाद एक राजा धनुष तक न उठा सके। तब कर्ण आगे बढ़ा।'),
      ln('DRAUPADI', 'I will not marry a charioteer\'s son.', 'मैं सारथी के पुत्र से विवाह नहीं करूँगी।'),
      ln('NAR', 'Karna laid down the bow in silence, and the wound stayed with him.', 'कर्ण ने चुपचाप धनुष रख दिया, और वह घाव उसके साथ रह गया।')],
    [bg(set='court', tone='#5a1a30'), face('karna', 560, 470, 180, 1, 'sorrow', n='karna'), face('draupadi', 1150, 440, 170, -1, 'stern', n='draupadi')],
    cam=[[1000, 450, 1.08], [620, 460, 1.12]], amb='court'),
  S('e3_arrow', 'heroic', [
      ln('NAR', 'A young brahmin rose from the crowd. He strung the great bow, looked down into the oil, and let fly.', 'भीड़ से एक युवा ब्राह्मण उठा। उसने विशाल धनुष पर प्रत्यंचा चढ़ाई, तेल में देखा, और बाण छोड़ दिया।')],
    [bg(set='court', tone='#5a1a30', canopy=1), piece('wheel', 'fishWheel', k='anim', every=2, x=800, y=230, s=1.0, hit=7.2), figs('archer', [fig('arjuna', 800, 900, 640, 1, 'draw', weapon='bowDrawn', rot=-62, style=dict(crown='bun', dhoti='#e8dcc0', scarf='#d9c9a0'))], rim=RIM_GOLD),
     piece('shot', 'arrowStreak', k='anim', every=1, add=True, t0=7.0, x0=860, y0=520, x1=800, y1=240), fx('petals', n=80, t0=7.6)],
    cam=[[800, 600, 1.15], [800, 360, 1.05]], amb='court', sfx=[dict(n='whoosh', at=7.0), dict(n='crack', at=7.2, v=0.6), dict(n='cheer', at=7.6), dict(n='conch', at=8.0, v=0.5)]),
  S('e3_share', 'joy', [
      ln('ARJUNA', 'Mother! Come and see what we have brought home today!', 'माँ! आकर देखो, आज हम क्या लाए हैं!'),
      ln('KUNTI', 'Whatever it is, share it equally among yourselves.', 'जो भी है, आपस में बराबर बाँट लो।'),
      ln('NAR', 'A mother\'s word could not be taken back. Draupadi became the wife of all five brothers.', 'माँ का वचन लौटाया नहीं जा सकता था। द्रौपदी पाँचों भाइयों की पत्नी बनीं।')],
    [bg(set='forest', tod='dusk', hut=1150), figs('family', [fig('arjuna', 420, 880, 560, 1, 'bless'), dict(who='draupadi', x=640, y=880, S=520, f=1), fig('bhima', 250, 880, 580, 1, 'stand')], rim=RIM_GOLD), fx('fireflies', n=40)],
    cam=push(700, 460, 1.0, 1.1), amb='birds'),
  S('e3_krishna', 'krishna', [
      ln('NAR', 'And among the guests, a dark prince of the Yadavas smiled. He had seen through every disguise. Krishna had come into their lives.',
                'और अतिथियों में यादवों का एक साँवला राजकुमार मुस्कुराया। उसने हर वेश के पार देख लिया था। कृष्ण उनके जीवन में आ चुके थे।')],
    [bg(set='river', tod='night', hz=600, moon=[380, 220, 70]), fx('fireflies', n=70), face('krishna', 1000, 440, 200, -1, 'smile', rim=['#cfe4ff', -3, -2, 0.55], glow=['#7ab0ff', 26, 0.35])],
    cam=push(940, 450, 1.0, 1.14), amb='night', sfx=[dict(n='flute', at=1.0, v=0.6)], hero=1, tout='fade', name=name('KRISHNA', 'कृष्ण', 'the dark one', 'श्यामसुंदर', -1)),
])

# =============================================================== EPISODE 4 ===
EP(4, 'The Game of Dice', 'द्यूत क्रीड़ा', 'A king who could not refuse a challenge.', 'एक राजा जो चुनौती ठुकरा न सका।', [
  S('e4_open', 'joy', [
      ln('NAR', 'Given a wild forest as their share of the kingdom, the Pandavas built a shining city: Indraprastha.', 'राज्य के हिस्से में उन्हें एक जंगली वन मिला, और पांडवों ने वहाँ एक चमकता नगर बसाया: इन्द्रप्रस्थ।', at=4.6)],
    [bg(set='palace', tod='gold', x=300, w=1000, h=640, col='#e0b070'), fx('rays', x=800, y=150, r0=60, r1=900, col='#fff0c0', spin=1), fx('dust', col='#ffe0a0', n=50)],
    cam=push(800, 470, 1.0, 1.1), amb='birds', min=11, eptitle=1, tin='fade'),
  S('e4_maya', 'court', [
      ln('NAR', 'Its hall was built by Maya, the great architect. Floors shone like water, and water lay still as stone.', 'उसकी सभा महान शिल्पी मय ने बनाई थी। फर्श जल की तरह चमकते थे, और जल पत्थर जैसा स्थिर था।'),
      ln('NAR', 'Visiting, Duryodhana stepped into a pool, and laughter rang through the hall.', 'वहाँ आए दुर्योधन एक कुंड में गिर पड़े, और सभा में हँसी गूँज उठी।')],
    [bg(set='court', tone='#1a3a4a', lamps=1), piece('pool', 'oilPool', x=800, y=760, col='#4a8aa8', w=1.6), figs('duryo', [fig('duryo', 800, 820, 560, 1, 'despair')], mv=dict(dy=[-60, 40], t=[6, 7.2], ease='in'), rim=RIM_COOL)],
    cam=push(800, 480, 1.0, 1.1), amb='court', sfx=[dict(n='splash', at=7.0), dict(n='crowdlaugh', at=7.4, v=0.7)]),
  S('e4_vow', 'tension', [
      ln('DURYO', 'They laughed at me. I will not rest until they have lost everything they own.', 'वे मुझ पर हँसे। जब तक वे अपना सब कुछ न हार जाएँ, मुझे चैन नहीं मिलेगा।', fx='growl')],
    [bg(set='dark', base='#140608', glow='#4a1010'), face('duryo', 800, 450, 210, 1, 'anger', rim=RIM_FIRE, glow=['#ff4020', 30, 0.25])],
    cam=push(800, 450, 1.02, 1.2), amb='void', sfx=[dict(n='heartbeat', at=0.5)]),
  S('e4_shakuni', 'dice', [
      ln('SHAKUNI', 'No war is needed, nephew. Invite Yudhishthira to a game of dice. My dice obey only me.', 'युद्ध की आवश्यकता नहीं, भांजे। युधिष्ठिर को द्यूत के लिए बुलाओ। मेरे पासे केवल मेरी बात मानते हैं।')],
    [bg(set='dark', base='#0c140c', glow='#2a3a1a'), face('shakuni', 800, 450, 200, 1, 'cruel', rim=['#c0e080', 3, -2, 0.45]), piece('dice', 'diceFloat', k='anim', every=2, x=1180, y=600)],
    cam=push(820, 460, 1.0, 1.14), amb='void', sfx=[dict(n='dice', at=4.0)], hero=1, name=name('SHAKUNI', 'शकुनि', 'master of the dice', 'पासों का स्वामी', -1)),
  S('e4_yudhi', 'court', [
      ln('NAR', 'Yudhishthira, who believed a king must never refuse a challenge, accepted.', 'युधिष्ठिर, जो मानते थे कि राजा को कभी चुनौती नहीं ठुकरानी चाहिए, ने निमंत्रण स्वीकार कर लिया।')],
    [bg(set='sky', tod='gold', hz=700, hills=1, ground='#8a6a3a'), fx('wheel', x=820, y=430, r=360, spin=6, col='#fff0b0'), face('yudhi', 820, 450, 200, 1, 'calm', rim=RIM_GOLD)],
    cam=push(820, 450, 1.0, 1.12), amb='temple', hero=1, name=name('YUDHISHTHIRA', 'युधिष्ठिर', 'son of Dharma', 'धर्मराज', 1)),
  S('e4_game', 'dice', [
      ln('NAR', 'He staked his jewels, and lost. His gold. His army. His kingdom.', 'उन्होंने अपने रत्न दाँव पर लगाए, और हार गए। अपना सोना। अपनी सेना। अपना राज्य।'),
      ln('SHAKUNI', 'Won!', 'जीत गया!', gap=0.6), ln('SHAKUNI', 'Won again!', 'फिर जीत गया!', gap=1.4)],
    [bg(set='court', tone='#4a1210'), piece('board', 'diceBoard', d=1.0), figs('players', [fig('shakuni', 420, 880, 640, 1, 'dice'), fig('yudhi', 1180, 880, 640, -1, 'dice', poseOver=dict(aF=[60, 40], lean=16, head=20))], rim=RIM_GOLD),
     piece('dice', 'diceRoll', k='anim', every=1, times=[1.0, 4.0, 7.0, 10.0])],
    cam=push(800, 520, 1.1, 1.2), amb='court', sfx=[dict(n='dice', at=1.0), dict(n='dice', at=4.0), dict(n='dice', at=7.0), dict(n='dice', at=10.0)]),
  S('e4_brothers', 'tension', [
      ln('NAR', 'Then he staked his brothers, one by one: Nakula, Sahadeva, Arjuna, Bhima. And then he staked himself.', 'फिर उन्होंने एक-एक कर अपने भाइयों को दाँव पर लगाया: नकुल, सहदेव, अर्जुन, भीम। और फिर स्वयं को।')],
    [bg(set='court', tone='#3a0e0c'), face('nakula', 200, 470, 120, 1, 'sorrow', n='nakula'), face('sahadeva', 520, 480, 120, 1, 'sorrow', n='sahadeva'), face('arjuna', 860, 470, 125, 1, 'sorrow', n='arjuna'), face('bhima', 1230, 470, 135, 1, 'anger', n='bhima')],
    cam=[[300, 480, 1.25], [1150, 470, 1.25]], amb='court', sfx=[dict(n='dice', at=2.0), dict(n='dice', at=4.0), dict(n='dice', at=6.0), dict(n='dice', at=8.0)]),
  S('e4_stake', 'dice', [
      ln('SHAKUNI', 'You still have one jewel left, Yudhishthira. Draupadi.', 'अभी एक रत्न बाकी है, युधिष्ठिर। द्रौपदी।'),
      ln('YUDHI', 'I stake Draupadi.', 'मैं द्रौपदी को दाँव पर लगाता हूँ।', gap=1.0),
      ln('VIDURA', 'Stop this! This is adharma!', 'रोको यह! यह अधर्म है!', fx='elder')],
    [bg(set='dark', base='#140608', glow='#3a1010'), face('shakuni', 560, 460, 180, 1, 'cruel', n='shakuni'), face('yudhi', 1150, 460, 175, -1, 'sorrow', n='yudhi')],
    cam=[[620, 460, 1.12], [1080, 460, 1.12]], amb='void', sfx=[dict(n='heartbeat', at=3.5)]),
  S('e4_lost', 'sorrow', [
      ln('SHAKUNI', 'Won!', 'जीत गया!'),
      ln('NAR', 'The court fell silent. Bhishma, bound by his vow to the throne, did not move.', 'सभा में सन्नाटा छा गया। सिंहासन के प्रति अपने वचन से बँधे भीष्म हिले तक नहीं।')],
    [bg(set='court', tone='#2a0a0a', throne=[800, 660, 230]), piece('diceFall', 'diceFall', k='anim', every=1, add=False), face('bhishma', 1080, 450, 170, -1, 'sorrow', rim=RIM_GOLD)],
    cam=push(900, 460, 1.0, 1.14), amb='court', sfx=[dict(n='dice', at=0.3), dict(n='gong', at=1.4, v=0.6)], tout='fade', min=9),
])

# =============================================================== EPISODE 5 ===
EP(5, 'The Disrobing', 'चीरहरण', 'A question no one in the court dared to answer.', 'एक प्रश्न जिसका उत्तर देने का साहस सभा में किसी को न था।', [
  S('e5_open', 'tension', [
      ln('NAR', 'Dushasana was sent to bring Draupadi before the court. She refused.', 'दुःशासन को द्रौपदी को सभा में लाने भेजा गया। उन्होंने आने से मना कर दिया।', at=4.6)],
    [bg(set='chamber', tone='#2a0e12', moon=1), face('dushasana', 800, 450, 200, 1, 'cruel', rim=RIM_FIRE)],
    cam=push(800, 450, 1.0, 1.12), amb='night', min=11, eptitle=1, tin='fade', hero=1, name=name('DUSHASANA', 'दुःशासन', 'the second Kaurava', 'दूसरा कौरव', 1)),
  S('e5_drag', 'battle', [
      ln('NAR', 'He dragged her by her hair into the hall of the Kurus, before her husbands and her elders.', 'वह उन्हें बालों से घसीटते हुए कुरुओं की सभा में ले आया, उनके पतियों और बड़ों के सामने।')],
    [bg(set='court', tone='#4a1210'), figs('pull', [fig('dushasana', 520, 880, 660, 1, 'charge', poseOver=dict(aB=[-80, -100])), dict(who='draupadi', x=1000, y=880, S=600, f=-1, arm=[150, 170])], rim=RIM_FIRE, mv=dict(dx=[60, -60], t=[0, 8]))],
    cam=push(780, 470, 1.04, 1.12), amb='court', sfx=[dict(n='whoosh', at=0.5), dict(n='gasp', at=1.5)]),
  S('e5_question', 'tension', [
      ln('DRAUPADI', 'I ask this court one question. Did my husband lose himself first, or me? If he had already lost himself, what right had he to stake me?',
                     'मैं इस सभा से एक प्रश्न पूछती हूँ। मेरे पति ने पहले स्वयं को हारा, या मुझे? यदि वे स्वयं को हार चुके थे, तो उन्हें मुझे दाँव पर लगाने का क्या अधिकार था?')],
    [bg(set='court', tone='#3a0e0c'), fx('embers', n=50, col='#ff8040'), face('draupadi', 800, 450, 210, 1, 'anger', rim=RIM_FIRE, glow=['#ff5020', 30, 0.3], wind=1.4)],
    cam=push(800, 450, 1.0, 1.18), amb='court'),
  S('e5_silence', 'sorrow', [
      ln('BHISHMA', 'The ways of dharma are subtle, daughter. I cannot answer you.', 'धर्म की गति सूक्ष्म है, पुत्री। मैं तुम्हें उत्तर नहीं दे सकता।', fx='elder'),
      ln('NAR', 'The greatest men of the age stared at the floor.', 'युग के महानतम पुरुष धरती की ओर देखते रहे।')],
    [bg(set='court', tone='#2a0a0a'), face('bhishma', 520, 450, 170, 1, 'sorrow', n='bhishma'), face('drona', 900, 460, 150, 1, 'sorrow', n='drona'), face('dhrita', 1260, 460, 150, -1, 'sorrow', n='dhrita')],
    cam=[[520, 450, 1.15], [1100, 460, 1.08]], amb='court'),
  S('e5_karna', 'tension', [
      ln('NAR', 'And Karna remembered the swayamvar, and spoke the worst words of his life.', 'और कर्ण को स्वयंवर याद आया, और उसने अपने जीवन के सबसे बुरे शब्द कहे।'),
      ln('KARNA', 'A woman with five husbands has no honour to protect. Strip her.', 'पाँच पतियों वाली स्त्री का कैसा सम्मान? उसके वस्त्र उतार लो।')],
    [bg(set='dark', base='#140608', glow='#3a1010'), face('karna', 800, 450, 200, 1, 'cruel', rim=RIM_FIRE)],
    cam=push(800, 450, 1.0, 1.14), amb='void', sfx=[dict(n='gasp', at=7.5, v=0.6)]),
  S('e5_pray', 'divine', [
      ln('NAR', 'Dushasana seized her sari. With no one left to turn to, Draupadi let go, raised both hands to the sky, and called on Krishna.',
                'दुःशासन ने उनकी साड़ी पकड़ ली। जब कोई सहारा न बचा, द्रौपदी ने साड़ी छोड़ दी, दोनों हाथ आकाश की ओर उठाए, और कृष्ण को पुकारा।'),
      ln('DRAUPADI', 'Govinda!', 'हे गोविंद!', fx='divine', gap=0.6)],
    [bg(set='court', tone='#3a0e0c'), fx('rays', x=800, y=-50, r0=40, r1=1100, col='#fff0c0', spin=1.5), figs('prayer', [dict(who='draupadi', x=800, y=880, S=660, f=1, arm=[175, 180])], rim=RIM_GOLD, glow=['#ffe0a0', 24, 0.35])],
    cam=[[800, 560, 1.15], [800, 420, 1.0]], amb='temple', sfx=[dict(n='bell', at=9.0), dict(n='om', at=9.4, v=0.8)]),
  S('e5_sari', 'wonder', [
      ln('NAR', 'And the sari had no end. He pulled, and pulled, and pulled, until he fell, exhausted, on a mountain of cloth.', 'और साड़ी का कोई अंत ही नहीं था। वह खींचता रहा, खींचता रहा, खींचता रहा, और थककर कपड़े के पहाड़ पर गिर पड़ा।')],
    [bg(set='court', tone='#3a0e0c'), piece('sari', 'endlessSari', k='anim', every=2, x=900, y=520), figs('drau', [dict(who='draupadi', x=900, y=880, S=600, f=-1, arm=[175, 180])], rim=RIM_GOLD, glow=['#ffe0a0', 20, 0.3]),
     figs('dush', [fig('dushasana', 380, 880, 620, 1, 'charge', poseOver=dict(aB=[-80, -100]))], mv=dict(dy=[0, 120], r=[0, -8], t=[9, 11], ax=380, ay=880, ease='in')), fx('rays', x=900, y=-100, r0=30, r1=1000, col='#fff0c0', spin=2)],
    cam=push(700, 460, 1.05, 1.0), amb='temple', sfx=[dict(n='swell', at=1.0), dict(n='magic', at=3), dict(n='magic', at=7)]),
  S('e5_bhima', 'battle', [
      ln('BHIMA', 'Hear my vow! I will break Duryodhana\'s thigh, and on the battlefield I will drink Dushasana\'s blood!', 'मेरी प्रतिज्ञा सुनो! मैं दुर्योधन की जंघा तोड़ूँगा, और रणभूमि में दुःशासन का रक्त पियूँगा!', fx='roar'),
      ln('DRAUPADI', 'And I will not tie my hair again until it is washed in that blood.', 'और जब तक मेरे केश उस रक्त से धुल न जाएँ, मैं इन्हें फिर नहीं बाँधूँगी।')],
    [bg(set='dark', base='#140608', glow='#4a1010'), face('bhima', 560, 450, 200, 1, 'roar', n='bhima', rim=RIM_FIRE), face('draupadi', 1170, 460, 170, -1, 'anger', n='draupadi', rim=RIM_FIRE, t=[8.0, 99]), fx('embers', n=70)],
    cam=[[620, 450, 1.1], [1050, 455, 1.05]], amb='void', sfx=[dict(n='roar', at=0.3, v=0.5), dict(n='thunder', at=1.0, v=0.6)], shake=[[1.0, 6]]),
  S('e5_exile', 'lament', [
      ln('NAR', 'Shaken, the blind king gave everything back. But Shakuni called one last game, and the Pandavas lost again.', 'भयभीत होकर अंधे राजा ने सब लौटा दिया। पर शकुनि ने एक अंतिम खेल बुलाया, और पांडव फिर हार गए।'),
      ln('NAR', 'The price: twelve years in the forest, and a thirteenth in hiding. If they were found, it would begin again.', 'शर्त थी: बारह वर्ष वनवास, और तेरहवाँ वर्ष अज्ञातवास। पकड़े गए, तो फिर से वही सब।')],
    [bg(set='forest', tod='dusk', season='autumn'), figs('walk', [fig('yudhi', 1100, 860, 380, -1), fig('bhima', 980, 870, 420, -1), fig('arjuna', 860, 860, 390, -1, 'stand', weapon='bowRest'), dict(who='draupadi', x=740, y=860, S=370, f=-1), fig('nakula', 630, 860, 370, -1), fig('sahadeva', 520, 860, 370, -1)], mv=dict(dx=[200, -300], t=[0, 16])),
     fx('leaves', every=2, n=40)],
    cam=push(800, 470, 1.0, 1.08), amb='wind', tout='fade', min=12),
])

# =============================================================== EPISODE 6 ===
EP(6, 'The Forest Years', 'वनवास', 'Tested by gods, the brothers keep to dharma.', 'देवताओं की परीक्षा में भी भाई धर्म पर अडिग रहे।', [
  S('e6_open', 'forest', [
      ln('NAR', 'Twelve years in the forest. They lived on roots and fruit, but they never left the path of dharma.', 'वन में बारह वर्ष। वे कंद-मूल पर जीते रहे, पर धर्म का मार्ग कभी नहीं छोड़ा।', at=4.6)],
    [bg(set='forest', tod='dawn', hut=1100), fx('dust', col='#fff0c0', n=60), fx('rays', x=1300, y=-100, r0=50, r1=1200, col='#fff0c0', spin=0.5)],
    cam=push(900, 460, 1.0, 1.1), amb='birds', min=11, eptitle=1, tin='fade'),
  S('e6_kirata', 'shiva', [
      ln('NAR', 'Arjuna climbed into the Himalayas to win divine weapons. A wild hunter challenged him over a boar they had both shot. They fought, and the hunter could not be beaten.',
                'अर्जुन दिव्य अस्त्र पाने हिमालय गए। एक जंगली शिकारी ने उस सूअर को लेकर ललकारा, जिसे दोनों ने बाण मारा था। वे लड़े, और वह शिकारी हारा ही नहीं।')],
    [bg(set='himalaya'), figs('duel', [fig('arjuna', 520, 880, 600, 1, 'release', weapon='bow'), fig('shiva', 1100, 880, 640, -1, 'charge', weapon='bow')], rim=RIM_COOL), fx('snow', n=150)],
    cam=push(800, 470, 1.0, 1.08), amb='wind', sfx=[dict(n='clash', at=5), dict(n='whoosh', at=7), dict(n='clash', at=9)]),
  S('e6_shiva', 'shiva', [
      ln('SHIVA', 'Your courage pleases me, Arjuna. Take the Pashupata, my own weapon.', 'तुम्हारे साहस से मैं प्रसन्न हूँ, अर्जुन। पाशुपत लो, मेरा अपना अस्त्र।', fx='divine_big')],
    [bg(set='himalaya', sky=['#1a2040', '#4a5a8a', '#c8d0e8']), fx('glow', x=800, y=420, r=500, col='#a0c0ff'), face('shiva', 800, 450, 210, 1, 'divine', rim=RIM_COOL, glow=['#a0c0ff', 30, 0.4]), fx('snow', n=120)],
    cam=push(800, 450, 1.0, 1.14), amb='wind', sfx=[dict(n='damaru', at=0.2), dict(n='om', at=1.0)], hero=1, name=name('SHIVA', 'शिव', 'the hunter of the mountains', 'किरात', 1)),
  S('e6_lake', 'mystery', [
      ln('NAR', 'One day, parched with thirst, the brothers came to a still lake. A voice warned: answer my questions before you drink.', 'एक दिन प्यास से व्याकुल भाई एक शांत सरोवर पर पहुँचे। एक आवाज़ ने चेताया: पहले मेरे प्रश्नों का उत्तर दो, फिर जल पियो।'),
      ln('NAR', 'One by one, they drank, and fell.', 'एक-एक कर उन्होंने जल पिया, और गिर पड़े।')],
    [bg(set='lake', tod='mist'), figs('fallen', [fig('bhima', 450, 860, 420, 1, 'stand', rot=-90), fig('arjuna', 900, 880, 380, 1, 'stand', rot=-88), fig('nakula', 1250, 860, 360, -1, 'stand', rot=90)], d=1.0), fx('ripples', x=800, y=640, r=500, n=4)],
    cam=push(800, 460, 1.0, 1.1), amb='river', sfx=[dict(n='splash', at=8.0, v=0.4)]),
  S('e6_yaksha', 'mystery', [
      ln('YAKSHA', 'What is the greatest wonder in the world?', 'संसार का सबसे बड़ा आश्चर्य क्या है?', fx='divine_big'),
      ln('YUDHI', 'Every day, people die. And yet the living go on as if they will live forever. That is the greatest wonder.', 'हर दिन लोग मरते हैं। फिर भी जीवित लोग ऐसे जीते हैं जैसे वे सदा रहेंगे। यही सबसे बड़ा आश्चर्य है।')],
    [bg(set='lake', tod='mist', lotus=6), piece('yaksha', 'yakshaForm', d=0.9, x=1050, y=430), face('yudhi', 520, 470, 170, 1, 'calm', rim=RIM_COOL)],
    cam=[[620, 470, 1.1], [900, 440, 1.05]], amb='river', sfx=[dict(n='swell', at=0.2)]),
  S('e6_choose', 'mystery', [
      ln('YAKSHA', 'You have answered well. One of your brothers may live. Choose.', 'तुमने ठीक उत्तर दिया। तुम्हारा एक भाई जीवित हो सकता है। चुनो।', fx='divine_big'),
      ln('YUDHI', 'Nakula. My father had two wives. A son of Kunti lives, in me. Let a son of Madri live too.', 'नकुल। मेरे पिता की दो पत्नियाँ थीं। कुंती का एक पुत्र जीवित है, मैं। माद्री का भी एक पुत्र जीवित रहे।')],
    [bg(set='lake', tod='mist', lotus=6), face('yudhi', 800, 450, 200, 1, 'calm', rim=RIM_COOL)],
    cam=push(800, 450, 1.02, 1.16), amb='river'),
  S('e6_dharma', 'divine', [
      ln('NAR', 'He had chosen fairness over his own blood. The Yaksha revealed himself as Dharma, his own father, and gave all four brothers back their lives.',
                'उन्होंने अपने रक्त से ऊपर न्याय को चुना था। यक्ष ने स्वयं को धर्मराज, उनके पिता, के रूप में प्रकट किया, और चारों भाइयों को जीवन लौटा दिया।')],
    [bg(set='lake', tod='gold', lotus=12), fx('rays', x=800, y=300, r0=80, r1=1000, col='#fff0c0'), face('dharma', 800, 440, 200, 1, 'divine', rim=RIM_GOLD, glow=['#ffe0a0', 30, 0.45])],
    cam=push(800, 450, 1.0, 1.12), amb='temple', sfx=[dict(n='bells', at=0.5), dict(n='sparkle', at=2)], hero=1, name=name('DHARMA', 'धर्मराज', 'the Yaksha revealed', 'यक्ष का सत्य रूप', 1)),
  S('e6_virata', 'joy', [
      ln('NAR', 'In the thirteenth year they hid in the court of King Virata: a king as a master of dice, mighty Bhima as a cook, Arjuna as a teacher of dance, and the queen Draupadi as a maid.',
                'तेरहवें वर्ष वे राजा विराट की सभा में छिप गए: एक राजा पासों का सलाहकार बना, बलशाली भीम रसोइया, अर्जुन नृत्य-शिक्षक, और महारानी द्रौपदी एक दासी।')],
    [bg(set='court', tone='#2a3a5a'), figs('disguise', [fig('yudhi', 300, 880, 480, 1, 'dice', style=dict(crown='bun', dhoti='#e8dcc0')), fig('bhima', 620, 880, 520, 1, 'stand', style=dict(crown='band', dhoti='#e8dcc0')), dict(who='draupadi', x=1000, y=880, S=480, f=-1, sari='#6a5a4a'), fig('arjuna', 1300, 880, 500, -1, 'flute', style=dict(crown='bun', dhoti='#d870a0', scarf='#f0c040'))], rim=RIM_GOLD)],
    cam=[[500, 470, 1.15], [1100, 470, 1.15]], amb='court'),
  S('e6_end', 'heroic', [
      ln('NAR', 'When the year was over, Arjuna took down the Gandiva from its hiding place in a tree. The exile had ended. Now they asked only for what was theirs.',
                'वर्ष पूरा होते ही अर्जुन ने पेड़ में छिपाया गांडीव नीचे उतारा। वनवास समाप्त हुआ। अब वे केवल अपना अधिकार माँग रहे थे।')],
    [bg(set='forest', tod='dawn'), fx('rays', x=800, y=-100, r0=40, r1=1100, col='#fff0c0', spin=1), figs('arjuna', [fig('arjuna', 800, 900, 760, 1, 'vow', weapon='bow')], rim=RIM_GOLD, glow=['#ffe0a0', 20, 0.3])],
    cam=[[800, 560, 1.15], [800, 430, 1.0]], amb='birds', sfx=[dict(n='conch', at=6.5)], tout='fade', min=10),
])

# =============================================================== EPISODE 7 ===
EP(7, 'Peace Refused', 'शांति का अंतिम प्रयास', 'Krishna asks for five villages. Karna is offered a throne.', 'कृष्ण ने पाँच गाँव माँगे। कर्ण को सिंहासन का प्रस्ताव मिला।', [
  S('e7_choice', 'krishna', [
      ln('NAR', 'Both sides came to Krishna for help. He offered a choice: his whole army, or himself alone, who would carry no weapon.', 'दोनों पक्ष सहायता माँगने कृष्ण के पास आए। उन्होंने एक विकल्प दिया: उनकी पूरी सेना, या केवल वे स्वयं, जो कोई शस्त्र नहीं उठाएँगे।', at=4.6),
      ln('DURYO', 'I take the army!', 'मुझे सेना चाहिए!', fx='growl'),
      ln('ARJUNA', 'I want only you, Keshava.', 'मुझे केवल आप चाहिए, केशव।')],
    [bg(set='chamber', tone='#14203a', moon=1), face('krishna', 800, 450, 190, 1, 'smile', n='krishna', glow=['#7ab0ff', 26, 0.3]), face('duryo', 300, 480, 140, 1, 'cruel', n='duryo', t=[8, 99]), face('arjuna', 1320, 480, 140, -1, 'calm', n='arjuna', t=[10, 99])],
    cam=push(800, 460, 1.0, 1.06), amb='night', min=11, eptitle=1, tin='fade'),
  S('e7_envoy', 'court', [
      ln('NAR', 'Then Krishna himself went to Hastinapura, as a messenger of peace.', 'तब कृष्ण स्वयं शांतिदूत बनकर हस्तिनापुर गए।'),
      ln('KRISHNA', 'Give them just five villages, and there will be no war.', 'उन्हें केवल पाँच गाँव दे दो, और युद्ध नहीं होगा।', fx='divine')],
    [bg(set='court', tone='#4a1612', throne=[1180, 660, 220], canopy=1), figs('envoy', [fig('krishna', 520, 880, 680, 1, 'bless')], rim=['#cfe4ff', -3, -2, 0.6]), figs('duryo', [fig('duryo', 1180, 880, 600, -1, 'mace', weapon='mace')], d=0.9)],
    cam=push(800, 460, 1.0, 1.08), amb='court'),
  S('e7_needle', 'tension', [
      ln('DURYO', 'Not even as much land as the point of a needle. Guards! Seize him!', 'सुई की नोक जितनी भूमि भी नहीं। सैनिको! इसे बंदी बना लो!', fx='growl')],
    [bg(set='dark', base='#140608', glow='#4a1010'), face('duryo', 800, 450, 210, 1, 'anger', rim=RIM_FIRE)],
    cam=push(800, 450, 1.02, 1.2), amb='void', sfx=[dict(n='clash', at=4.5, v=0.5)]),
  S('e7_form', 'cosmic', [
      ln('NAR', 'Krishna laughed, and blazed with light. For one moment the court saw gods and worlds within him. Even the blind king saw.', 'कृष्ण हँसे, और प्रकाश से जगमगा उठे। एक क्षण के लिए सभा ने उनमें देवता और लोक देखे। अंधे राजा ने भी देखा।'),
      ln('DHRITA', 'I see... at last, I see.', 'मैं देख रहा हूँ... आखिरकार, मैं देख रहा हूँ।', fx='elder')],
    [bg(set='cosmos'), fx('wheel', x=800, y=380, r=420, spin=10, col='#ffe0a0'), fx('rays', x=800, y=380, r0=100, r1=1000, col='#fff0c0', spin=4), face('krishna', 800, 440, 210, 1, 'divine', rim=RIM_GOLD, glow=['#a0c8ff', 40, 0.6], halo=1)],
    cam=push(800, 440, 1.0, 1.14), amb='void', sfx=[dict(n='om', at=0.2), dict(n='swell', at=1), dict(n='gong', at=4)], tin='flash'),
  S('e7_karna', 'krishna', [
      ln('KRISHNA', 'Karna, you are Kunti\'s firstborn, the eldest of the Pandavas. Come with us, and the throne of Hastinapura is yours. Draupadi too.', 'कर्ण, तुम कुंती के पहले पुत्र हो, पांडवों में सबसे बड़े। हमारे साथ आओ, और हस्तिनापुर का सिंहासन तुम्हारा है।', fx='divine')],
    [bg(set='river', tod='dusk', hz=580), face('krishna', 520, 450, 175, 1, 'calm', n='krishna'), face('karna', 1140, 460, 180, -1, 'awe', n='karna', rim=RIM_GOLD)],
    cam=[[620, 450, 1.1], [1050, 455, 1.08]], amb='river'),
  S('e7_refuse', 'lament', [
      ln('KARNA', 'When the whole world mocked me, Duryodhana stood by me. I cannot betray him now. Not for a kingdom. Not even for my mother.', 'जब सारे संसार ने मेरा उपहास किया, तब दुर्योधन मेरे साथ खड़ा था। अब मैं उसे धोखा नहीं दे सकता। राज्य के लिए भी नहीं। अपनी माँ के लिए भी नहीं।')],
    [bg(set='sky', tod='dusk', sun=[900, 560, 160], sunCol='#e05a2a', hills=1, ground='#3a2014'), face('karna', 800, 450, 210, 1, 'sorrow', rim=RIM_FIRE)],
    cam=push(800, 450, 1.02, 1.16), amb='wind'),
  S('e7_kunti', 'lament', [
      ln('KUNTI', 'My son...', 'मेरे पुत्र...'),
      ln('KARNA', 'Where were you, mother, when I floated down the river? ...I will not kill four of your sons. Whatever happens, you will still have five: with Arjuna, or with me.', 'माँ, जब मैं नदी में बह रहा था, तब तुम कहाँ थीं? ...मैं तुम्हारे चार पुत्रों को नहीं मारूँगा। जो भी हो, तुम्हारे पाँच पुत्र रहेंगे: अर्जुन के साथ, या मेरे साथ।')],
    [bg(set='river', tod='dawn', hz=560, sun=[800, 500, 120]), face('kunti', 520, 470, 165, 1, 'sorrow', n='kunti'), face('karna', 1130, 450, 180, -1, 'sorrow', n='karna', rim=RIM_GOLD)],
    cam=[[620, 470, 1.12], [1050, 455, 1.1]], amb='river'),
  S('e7_kavacha', 'divine', [
      ln('NAR', 'And when Indra came disguised as a beggar and asked for his golden armour, Karna cut it from his own body and gave it away. He never refused a gift.', 'और जब इंद्र भिखारी बनकर उनका स्वर्ण कवच माँगने आए, तो कर्ण ने उसे अपने ही शरीर से काटकर दान कर दिया। उन्होंने कभी किसी को दान से मना नहीं किया।')],
    [bg(set='sky', tod='gold', sun=[800, 380, 200], sunCol='#f6b030', hills=1), fx('rays', x=800, y=380, r0=180, r1=1000, col='#ffe0a0', spin=2), figs('give', [fig('karna', 640, 880, 660, 1, 'bless'), fig('brahmin', 1060, 880, 560, -1, 'bless')], rim=RIM_GOLD), fx('sparkle', y0=300, y1=800, n=80, col='#ffe08a')],
    cam=push(820, 460, 1.0, 1.1), amb='temple', sfx=[dict(n='magic', at=6)]),
  S('e7_end', 'march', [
      ln('NAR', 'Peace was dead. Eighteen great armies marched to the field of Kurukshetra.', 'शांति मर चुकी थी। अठारह अक्षौहिणी सेनाएँ कुरुक्षेत्र के मैदान की ओर चल पड़ीं।')],
    [bg(set='field', sunX=800, sunY=520), fx('dust', n=140)],
    cam=push(800, 520, 1.0, 1.1), amb='wind', sfx=[dict(n='conch', at=1.0), dict(n='drumroll', at=3)], tout='fade', min=9),
])

# =============================================================== EPISODE 8 ===
EP(8, 'The Song of God', 'भगवद्गीता', 'Between two armies, time stops, and God speaks.', 'दो सेनाओं के बीच समय थम गया, और भगवान बोले।', [
  S('e8_conch', 'march', [
      ln('NAR', 'The first morning of the war. Krishna raised the Panchajanya to his lips, and the earth shook.', 'युद्ध की पहली सुबह। कृष्ण ने पांचजन्य शंख होंठों से लगाया, और धरती काँप उठी।', at=4.6)],
    [bg(set='field', sunX=820, sunY=520), figs('conch', [fig('krishna', 800, 900, 640, 1, 'bless', weapon='conch')], rim=RIM_GOLD), fx('dust', n=120)],
    cam=push(800, 520, 1.0, 1.12), amb='wind', min=11, eptitle=1, tin='fade', sfx=[dict(n='conch', at=6.0, v=1.0), dict(n='conch', at=7.5, v=0.6), dict(n='rumble', at=6.5)], shake=[[6.2, 5]]),
  S('e8_middle', 'tension', [
      ln('ARJUNA', 'Keshava, take my chariot between the two armies. Let me see whom I must fight.', 'केशव, मेरा रथ दोनों सेनाओं के बीच ले चलो। मैं देखूँ कि मुझे किससे लड़ना है।')],
    [bg(set='field', sunX=1100, sunY=520), piece('chariot', 'warChariot', k='anim', every=2, d=1.0, x=800, y=860, s=1.0)],
    cam=push(800, 560, 1.0, 1.1), amb='wind', sfx=[dict(n='hooves', at=0.2, v=0.6)]),
  S('e8_sees', 'sorrow', [
      ln('NAR', 'And across the field he saw his grandfather. His teacher. His cousins, his uncles, his friends.', 'और मैदान के उस पार उसने अपने पितामह को देखा। अपने गुरु को। अपने भाइयों को, चाचाओं को, मित्रों को।')],
    [bg(set='field', sunX=1200, sunY=520), face('bhishma', 520, 470, 180, 1, 'sorrow', n='bhishma'), face('drona', 1120, 470, 170, -1, 'sorrow', n='drona', t=[4.0, 99])],
    cam=[[520, 470, 1.15], [1100, 470, 1.15]], amb='wind'),
  S('e8_despair', 'lament', [
      ln('ARJUNA', 'My limbs give way, Krishna. My mouth is dry. The Gandiva slips from my hand. I will not fight. I would rather die.', 'मेरे अंग शिथिल हो रहे हैं, कृष्ण। मेरा मुख सूख रहा है। गांडीव हाथ से फिसल रहा है। मैं युद्ध नहीं करूँगा। इससे तो मर जाना अच्छा है।')],
    [bg(set='field', sunX=1200, sunY=520, armies=0), face('arjuna', 800, 460, 210, 1, 'sorrow', rim=RIM_GOLD)],
    cam=push(800, 460, 1.02, 1.18), amb='wind', sfx=[dict(n='heartbeat', at=1.0)]),
  S('e8_gita1', 'gita', [
      ln('NAR', 'And there, between two armies, time stood still, and Krishna spoke.', 'और वहीं, दो सेनाओं के बीच, समय थम गया, और कृष्ण बोले।'),
      ln('KRISHNA', 'The soul is never born, and it never dies. No weapon can cut it, no fire can burn it. Those you grieve for are eternal.', 'आत्मा न कभी जन्म लेती है, न कभी मरती है। इसे कोई शस्त्र काट नहीं सकता, कोई आग जला नहीं सकती। जिनके लिए तुम शोक करते हो, वे शाश्वत हैं।', fx='divine')],
    [bg(set='sky', tod='gold', hz=760, hills=1, ground='#8a6a3a'), fx('rays', x=800, y=300, r0=120, r1=1000, col='#fff0c0', spin=1), face('krishna', 800, 440, 210, 1, 'divine', rim=RIM_GOLD, glow=['#ffe0a0', 30, 0.4], halo=1), fx('sparkle', y0=0, y1=900, n=60, col='#fff0c0')],
    cam=push(800, 450, 1.0, 1.12), amb='temple', sfx=[dict(n='om', at=0.2, v=0.6)], text=[dict(t0=9.5, t1=15, en='na jāyate mriyate vā kadāchin', hi='न जायते म्रियते वा कदाचित्', f='verse', y=0.86)]),
  S('e8_gita2', 'gita', [
      ln('KRISHNA', 'You have a right to your action, Arjuna, but never to its fruits. Do your duty, and let go of the result.', 'तुम्हारा अधिकार केवल कर्म पर है, अर्जुन, उसके फल पर कभी नहीं। अपना कर्तव्य करो, और परिणाम को छोड़ दो।', fx='divine')],
    [bg(set='void', base='#1a1030', mandala=380, my=440, mcol='#f3cf6a'), face('krishna', 800, 440, 200, 1, 'divine', rim=RIM_GOLD, halo=1)],
    cam=push(800, 450, 1.05, 1.14), amb='temple', text=[dict(t0=1.0, t1=8, en='karmaṇy evādhikāras te mā phaleṣu kadāchana', hi='कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', f='verse', y=0.86)]),
  S('e8_gita3', 'gita', [
      ln('KRISHNA', 'Whenever dharma declines and adharma rises, I come forth. Age after age, I am born, to protect the good and restore dharma.', 'जब-जब धर्म की हानि होती है और अधर्म बढ़ता है, तब-तब मैं प्रकट होता हूँ। युग-युग में मैं जन्म लेता हूँ, सज्जनों की रक्षा और धर्म की स्थापना के लिए।', fx='divine')],
    [bg(set='cosmos', galaxies=3), fx('wheel', x=800, y=420, r=380, spin=6, col='#ffe0a0'), face('krishna', 800, 440, 205, 1, 'divine', rim=RIM_GOLD, glow=['#a0c8ff', 34, 0.45], halo=1)],
    cam=push(800, 450, 1.0, 1.1), amb='void', text=[dict(t0=1.0, t1=8, en='yadā yadā hi dharmasya glānir bhavati bhārata', hi='यदा यदा हि धर्मस्य ग्लानिर्भवति भारत', f='verse', y=0.86)]),
  S('e8_ask', 'wonder', [
      ln('ARJUNA', 'If you think me worthy, Lord, show me your true form.', 'यदि आप मुझे योग्य समझें, प्रभु, तो मुझे अपना वास्तविक रूप दिखाइए।'),
      ln('KRISHNA', 'With these eyes you cannot see me. I give you divine sight. Behold!', 'इन आँखों से तुम मुझे नहीं देख सकते। मैं तुम्हें दिव्य दृष्टि देता हूँ। देखो!', fx='divine')],
    [bg(set='field', sunX=820, sunY=480, armies=0), face('arjuna', 520, 470, 170, 1, 'awe', n='arjuna', rim=RIM_GOLD), face('krishna', 1130, 440, 185, -1, 'divine', n='krishna', glow=['#ffe0a0', 30, 0.4]), fx('glow', x=1130, y=440, r=360, col='#fff0c0', rate=3)],
    cam=[[620, 470, 1.1], [1100, 440, 1.08]], amb='wind', sfx=[dict(n='swell', at=7.0)]),
  S('e8_vishva1', 'vishva', [
      ln('NAR', 'And Arjuna saw. If a thousand suns were to rise at once in the sky, their light would not equal that light.', 'और अर्जुन ने देखा। यदि आकाश में एक साथ हज़ार सूर्य उदय हों, तो भी उनका प्रकाश उस प्रकाश के बराबर न हो।', at=3.2)],
    [bg(set='cosmos', galaxies=6), piece('suns', 'thousandSuns', k='anim', every=2, add=True), piece('arms', 'vishvaArms', d=1.0, mv=dict(s=[0.6, 1.0], t=[0, 5], ax=800, ay=480, ease='out')), piece('form', 'vishvarupa', d=1.0, stage=1), fx('rays', x=800, y=360, r0=200, r1=1100, col='#fff0c0', spin=3),
     figs('arjuna', [fig('arjuna', 800, 905, 150, 1, 'vow')], d=1.0, sil=True)],
    cam=[[800, 700, 1.6], [800, 440, 1.0]], amb='void', sfx=[dict(n='boom', at=0.2), dict(n='swell', at=0.4), dict(n='om', at=2.0)], tin='flash', min=14),
  S('e8_vishva2', 'vishva', [
      ln('NAR', 'In that one body stood the whole universe: every god and every sage, the seas and the mountains, worlds without number. Without beginning, without middle, without end.', 'उस एक शरीर में पूरा ब्रह्मांड समाया था: हर देवता और हर ऋषि, समुद्र और पर्वत, अनगिनत लोक। बिना आदि के, बिना मध्य के, बिना अंत के।')],
    [bg(set='cosmos', galaxies=8), piece('halo', 'cosmicHalo', k='anim', every=2, add=True), piece('arms', 'vishvaArms', d=1.0, mv=dict(r=[-4, 4], t=[0, 16], ax=800, ay=560)), piece('form', 'vishvarupa', d=1.0, stage=2), piece('within', 'universeWithin', k='anim', every=2, add=True)],
    cam=[[800, 420, 1.0], [800, 360, 1.25]], amb='void', sfx=[dict(n='bells', at=2), dict(n='gong', at=6), dict(n='sparkle', at=9)]),
  S('e8_time', 'kala', [
      ln('KTIME', 'I am Time, the destroyer of worlds, grown old. Even without you, none of these warriors will survive. Arise! Be only my instrument, Arjuna.', 'मैं काल हूँ, लोकों का नाश करने वाला, बढ़ा हुआ काल। तुम्हारे बिना भी, इनमें से कोई योद्धा नहीं बचेगा। उठो! केवल निमित्त बनो, अर्जुन।')],
    [bg(set='dark', base='#140404', glow='#6a1408', lr=800), piece('mouths', 'kalaFaces', d=1.0), piece('streams', 'warriorStreams', k='anim', every=2, add=False), fx('embers', n=140, col='#ff7030', vy=-70), fx('glow', x=800, y=420, r=500, col='#ff5020', rate=4)],
    cam=push(800, 430, 1.0, 1.16), amb='fire', sfx=[dict(n='roar', at=0.2), dict(n='thunder', at=0.4), dict(n='boom', at=8)], shake=[[0.4, 9]], g=dict(tint='#ff6030', k=0.1),
    text=[dict(t0=1.0, t1=7, en='kālo \'smi', hi='कालोऽस्मि', f='deva', sz=110, y=0.8, c='#ffcf6a')]),
  S('e8_bow', 'wonder', [
      ln('ARJUNA', 'Forgive me, Lord. I called you friend, I joked with you, not knowing who you were. Show me again your gentle form.', 'क्षमा करें, प्रभु। मैं आपको सखा कहता रहा, आपसे हँसी करता रहा, बिना जाने कि आप कौन हैं। मुझे फिर से अपना सौम्य रूप दिखाइए।')],
    [bg(set='cosmos', galaxies=4), piece('armsfade', 'vishvaArms', d=1.0, t=[0, 5.0]), piece('formfade', 'vishvarupa', d=1.0, stage=3, t=[0, 6.0]), face('krishna', 800, 440, 200, 1, 'smile', rim=RIM_GOLD, glow=['#a0c8ff', 30, 0.4], halo=1, t=[5.5, 99]),
     figs('arjuna', [fig('arjuna', 380, 900, 420, 1, 'despair')], rim=RIM_GOLD)],
    cam=push(700, 470, 1.0, 1.06), amb='temple', sfx=[dict(n='descend', at=5.0), dict(n='flute', at=6.0, v=0.6)]),
  S('e8_rise', 'heroic', [
      ln('ARJUNA', 'My delusion is gone. My doubts are gone. I will do as you say.', 'मेरा मोह नष्ट हो गया। मेरे संशय मिट गए। मैं वही करूँगा जो आप कहेंगे।')],
    [bg(set='field', sunX=1000, sunY=480), fx('rays', x=1000, y=480, r0=100, r1=1000, col='#fff0c0', spin=2), figs('arjuna', [fig('arjuna', 760, 900, 760, 1, 'draw', weapon='bowDrawn')], rim=RIM_GOLD, glow=['#ffd080', 20, 0.3])],
    cam=[[760, 560, 1.15], [760, 430, 1.0]], amb='wind', sfx=[dict(n='conch', at=4.0), dict(n='drumroll', at=5)], tout='fade', min=9),
])

# =============================================================== EPISODE 9 ===
EP(9, 'The Fall of the Great', 'महारथियों का पतन', 'A grandfather, a boy, and a teacher fall.', 'एक पितामह, एक बालक, और एक गुरु का पतन।', [
  S('e9_bhishma', 'battle', [
      ln('NAR', 'For nine days Bhishma could not be stopped. At last the Pandavas went to his tent at night, and asked how he could be defeated.', 'नौ दिनों तक भीष्म को कोई रोक न सका। आखिरकार पांडव रात को उनके शिविर में गए, और पूछा कि उन्हें कैसे हराया जाए।', at=4.6)],
    [bg(set='field', sunX=400, sunY=540, dead=1), figs('bhishma', [fig('bhishma', 800, 900, 720, 1, 'release', weapon='bow')], rim=RIM_GOLD), piece('volley', 'arrowRain', k='anim', every=2, add=False), fx('dust', n=120)],
    cam=push(800, 480, 1.0, 1.1), amb='battle', min=11, eptitle=1, tin='fade'),
  S('e9_secret', 'sorrow', [
      ln('BHISHMA', 'I will not raise my bow against Shikhandi, who was born a woman. Place him before Arjuna, and I will not fight back.', 'मैं शिखंडी पर धनुष नहीं उठाऊँगा, जो स्त्री के रूप में जन्मा था। उसे अर्जुन के आगे रखो, मैं प्रतिकार नहीं करूँगा।', fx='elder')],
    [bg(set='camp'), face('bhishma', 800, 450, 200, 1, 'calm', rim=['#ffb060', 3, -2, 0.5]), fx('embers', n=40)],
    cam=push(800, 450, 1.02, 1.14), amb='night'),
  S('e9_bed', 'lament', [
      ln('NAR', 'On the tenth day, with Shikhandi before him, Arjuna\'s arrows brought the grandfather down.', 'दसवें दिन, शिखंडी को आगे रखकर, अर्जुन के बाणों ने पितामह को गिरा दिया।'),
      ln('NAR', 'He lay on a bed of arrows, and chose to wait, until the sun turned north, before he would die.', 'वे बाणों की शय्या पर लेट गए, और उन्होंने प्रतीक्षा चुनी, जब तक सूर्य उत्तरायण न हो जाए।')],
    [bg(set='sky', tod='dusk', sun=[1100, 600, 120], sunCol='#e05a2a', hills=1, ground='#2a1410'), piece('bed', 'arrowBed', d=1.0, x=800, y=740, s=1.0)],
    cam=push(800, 600, 1.0, 1.12), amb='wind', sfx=[dict(n='gong', at=1.0, v=0.5)]),
  S('e9_vyuha', 'tension', [
      ln('NAR', 'Drona then set the chakravyuha, a turning wheel of soldiers. Only Arjuna knew how to break it, and Arjuna had been lured away.', 'तब द्रोण ने चक्रव्यूह रचा, सैनिकों का घूमता हुआ पहिया। केवल अर्जुन उसे तोड़ना जानते थे, और अर्जुन को दूर भटका दिया गया था।')],
    [bg(set='sky', tod='dawn', hills=0, ground='#8a5a3e', hz=0), piece('ring', 'vyuhaRing', k='anim', every=2, add=False, x=800, y=450)],
    cam=push(800, 450, 1.0, 1.2), amb='battle', sfx=[dict(n='drumroll', at=2), dict(n='conch', at=6)]),
  S('e9_abhi', 'heroic', [
      ln('ABHI', 'I know how to break into the wheel, uncle. I never learned the way out. But I will go.', 'मैं चक्रव्यूह में प्रवेश करना जानता हूँ, तात। बाहर निकलना कभी नहीं सीखा। पर मैं जाऊँगा।')],
    [bg(set='field', sunX=820, sunY=500), face('abhi', 800, 450, 205, 1, 'stern', rim=RIM_GOLD), fx('dust', n=80)],
    cam=push(800, 450, 1.0, 1.14), amb='battle', hero=1, name=name('ABHIMANYU', 'अभिमन्यु', 'son of Arjuna', 'अर्जुनपुत्र', 1)),
  S('e9_wheel', 'battle', [
      ln('NAR', 'Sixteen years old, he broke in alone. Seven great warriors fell on him at once. His bow broken, his sword shattered, he fought on with a chariot wheel, until he fell.', 'सोलह वर्ष का वह अकेला भीतर घुस गया। सात महारथियों ने एक साथ उस पर आक्रमण किया। धनुष टूटा, तलवार टूटी, वह रथ का पहिया उठाकर लड़ता रहा, जब तक गिर न गया।')],
    [bg(set='sky', tod='crimson', hills=0, ground='#5a2a1e', hz=0), piece('ring', 'vyuhaRing', k='anim', every=2, add=False, x=800, y=450, close=1), figs('abhi', [fig('abhi', 800, 640, 360, 1, 'maceUp', weapon='wheel')], rim=RIM_GOLD, mv=dict(r=[0, 0], t=[0, 1])), fx('dust', n=80, col='#c05a3a')],
    cam=push(800, 450, 1.1, 1.3), amb='battle', sfx=[dict(n='clash', at=2), dict(n='clash', at=4), dict(n='clash', at=6.5), dict(n='gong', at=12, v=0.6)], g=dict(tint='#ff6040', k=0.08)),
  S('e9_vow', 'tension', [
      ln('ARJUNA', 'Jayadratha held the gate while they killed my son. If I do not kill him before sunset tomorrow, I will walk into the fire myself!', 'जब उन्होंने मेरे पुत्र को मारा, जयद्रथ ने द्वार रोक रखा था। यदि कल सूर्यास्त से पहले मैंने उसे नहीं मारा, तो मैं स्वयं अग्नि में प्रवेश करूँगा!')],
    [bg(set='camp'), fx('embers', n=60), face('arjuna', 800, 450, 210, 1, 'anger', rim=RIM_FIRE)],
    cam=push(800, 450, 1.02, 1.2), amb='night', sfx=[dict(n='thunder', at=6, v=0.5)]),
  S('e9_sunset', 'krishna', [
      ln('NAR', 'The next day, as the sun sank, Krishna hid it behind his discus. Thinking the day was done, Jayadratha came out of hiding.', 'अगले दिन, जब सूर्य ढलने लगा, कृष्ण ने उसे अपने सुदर्शन चक्र के पीछे छिपा दिया। दिन बीता समझकर जयद्रथ छिपने की जगह से बाहर निकल आया।'),
      ln('NAR', 'Then the sun shone again, and Arjuna\'s arrow flew.', 'तभी सूर्य फिर चमका, और अर्जुन का बाण चल पड़ा।')],
    [bg(set='sky', tod='dusk', hills=1, ground='#2a1410'), piece('eclipse', 'eclipse', k='anim', every=2, add=False, x=1000, y=380), piece('shot', 'arrowStreak', k='anim', every=1, add=True, t0=11.2, x0=200, y0=700, x1=1300, y1=640)],
    cam=push(900, 430, 1.0, 1.1), amb='battle', sfx=[dict(n='swell', at=2), dict(n='sparkle', at=10.5), dict(n='whoosh', at=11.2), dict(n='crack', at=11.6)]),
  S('e9_drona', 'sorrow', [
      ln('NAR', 'Drona was next. Bhima killed an elephant named Ashwatthama, the same name as Drona\'s beloved son.', 'अब द्रोण की बारी थी। भीम ने अश्वत्थामा नाम के एक हाथी को मारा, जो द्रोण के प्रिय पुत्र का भी नाम था।'),
      ln('YUDHI', 'Ashwatthama is dead...', 'अश्वत्थामा मारा गया...'),
      ln('YUDHI', '...the elephant.', '...हाथी।', vol=0.35, gap=0.15),
      ln('NAR', 'Krishna\'s conch drowned the last words. Drona laid down his weapons. And Yudhishthira\'s chariot, which had always floated above the earth, sank to the ground.', 'अंतिम शब्द कृष्ण के शंख में डूब गए। द्रोण ने शस्त्र रख दिए। और युधिष्ठिर का रथ, जो सदा धरती से ऊपर चलता था, धरती पर आ गया।')],
    [bg(set='field', sunX=1200, sunY=560, dead=1), face('drona', 560, 460, 180, 1, 'sorrow', n='drona'), face('yudhi', 1150, 460, 170, -1, 'sorrow', n='yudhi')],
    cam=[[1050, 460, 1.1], [620, 460, 1.1]], amb='battle', sfx=[dict(n='conch', at=8.5, v=1.0)], tout='fade'),
])

# =============================================================== EPISODE 10 ===
EP(10, 'Dharma Victorious', 'धर्म की विजय', 'The war ends. The last test is a dog at heaven\'s gate.', 'युद्ध समाप्त हुआ। अंतिम परीक्षा थी स्वर्ग के द्वार पर एक कुत्ता।', [
  S('e10_karna', 'battle', [
      ln('NAR', 'On the seventeenth day, Karna faced Arjuna at last. And his chariot wheel sank into the earth, as an old curse had foretold.', 'सत्रहवें दिन, आखिरकार कर्ण का अर्जुन से सामना हुआ। और उनके रथ का पहिया धरती में धँस गया, जैसा एक पुराने शाप ने कहा था।', at=4.6)],
    [bg(set='sky', tod='dusk', sun=[1200, 560, 140], sunCol='#e05a2a', hills=1, ground='#3a2014'), figs('karna', [fig('karna', 800, 880, 640, 1, 'dice', weapon='wheel', poseOver=dict(seat=0, lean=30))], rim=RIM_FIRE), fx('dust', n=100)],
    cam=push(800, 480, 1.0, 1.12), amb='battle', min=11, eptitle=1, tin='fade', sfx=[dict(n='crack', at=8.0), dict(n='rumble', at=8.2)]),
  S('e10_plead', 'tension', [
      ln('KARNA', 'Arjuna, wait! Dharma forbids you to strike a man who is unarmed!', 'अर्जुन, रुको! धर्म निहत्थे पर वार करने से रोकता है!'),
      ln('KRISHNA', 'Dharma, Karna? Where was your dharma when Draupadi was dragged into the court? When Abhimanyu stood alone against seven?', 'धर्म, कर्ण? तब तुम्हारा धर्म कहाँ था जब द्रौपदी को सभा में घसीटा गया? जब अभिमन्यु अकेला सात के सामने खड़ा था?', fx='divine')],
    [bg(set='sky', tod='dusk', sun=[1200, 560, 140], sunCol='#e05a2a', hills=1, ground='#3a2014'), face('karna', 540, 470, 180, 1, 'fear', n='karna', rim=RIM_FIRE), face('krishna', 1140, 450, 180, -1, 'stern', n='krishna', glow=['#7ab0ff', 26, 0.3])],
    cam=[[620, 470, 1.1], [1060, 455, 1.1]], amb='wind'),
  S('e10_fall', 'lament', [
      ln('NAR', 'Karna had no answer. Arjuna loosed, and the son of the Sun fell, as the sun went down.', 'कर्ण के पास कोई उत्तर न था। अर्जुन ने बाण छोड़ा, और सूर्यपुत्र गिर पड़ा, जैसे सूर्य अस्त हुआ।')],
    [bg(set='sky', tod='crimson', sun=[800, 640, 160], sunCol='#e04a20', hills=1, ground='#2a1010'), piece('shot', 'arrowStreak', k='anim', every=1, add=True, t0=2.4, x0=100, y0=520, x1=820, y1=560), piece('sunset', 'sinkingSun', k='anim', every=3, add=True, x=800, y=640)],
    cam=push(800, 520, 1.0, 1.1), amb='wind', sfx=[dict(n='whoosh', at=2.4), dict(n='crack', at=2.8), dict(n='gong', at=3.4, v=0.6)]),
  S('e10_mace', 'battle', [
      ln('NAR', 'On the eighteenth day, only Duryodhana was left. Bhima met him by the lake, with the mace.', 'अठारहवें दिन, केवल दुर्योधन बचा था। भीम गदा लेकर सरोवर के किनारे उसके सामने आए।'),
      ln('BHIMA', 'Remember the dice, Duryodhana! Remember Draupadi!', 'द्यूत याद करो, दुर्योधन! द्रौपदी को याद करो!', fx='roar')],
    [bg(set='lake', tod='dusk', lotus=4), figs('duel', [fig('bhima', 520, 880, 660, 1, 'maceUp', weapon='mace'), fig('duryo', 1100, 880, 640, -1, 'mace', weapon='mace')], rim=RIM_FIRE), fx('dust', n=80)],
    cam=push(800, 470, 1.0, 1.1), amb='battle', sfx=[dict(n='clash', at=2), dict(n='clash', at=4.5)]),
  S('e10_thigh', 'battle', [
      ln('NAR', 'Bhima struck his thigh, as he had sworn to thirteen years before. Duryodhana fell. The war was over.', 'भीम ने उसकी जंघा पर प्रहार किया, जैसी उन्होंने तेरह वर्ष पहले प्रतिज्ञा की थी। दुर्योधन गिर पड़ा। युद्ध समाप्त हो गया।')],
    [bg(set='lake', tod='crimson', lotus=0), figs('fallen', [fig('duryo', 1000, 880, 600, -1, 'despair')], mv=dict(dy=[0, 60], r=[0, 14], t=[1.2, 2.4], ax=1000, ay=880, ease='in'), rim=RIM_FIRE), figs('bhima', [fig('bhima', 520, 880, 680, 1, 'maceUp', weapon='mace')], rim=RIM_FIRE)],
    cam=push(800, 480, 1.0, 1.12), amb='wind', sfx=[dict(n='clash', at=1.2), dict(n='boom', at=1.4), dict(n='gong', at=4)], shake=[[1.2, 10]], tin='flash'),
  S('e10_gandhari', 'lament', [
      ln('GANDHARI', 'Krishna, you could have stopped this, and you did not. As my family was destroyed, so will yours be.', 'कृष्ण, तुम यह रोक सकते थे, पर तुमने नहीं रोका। जैसे मेरा कुल नष्ट हुआ, वैसे ही तुम्हारा भी होगा।', fx='elder'),
      ln('KRISHNA', 'So be it, mother.', 'तथास्तु, माता।', fx='divine')],
    [bg(set='field', sunX=900, sunY=560, armies=0, dead=1), face('gandhari', 560, 460, 180, 1, 'anger', n='gandhari'), face('krishna', 1130, 450, 175, -1, 'sorrow', n='krishna', t=[7.5, 99])],
    cam=[[620, 460, 1.1], [1050, 450, 1.1]], amb='wind', sfx=[dict(n='thunder', at=6.5, v=0.5)]),
  S('e10_teach', 'gita', [
      ln('BHISHMA', 'A king lives for his people, never for himself. Dharma is whatever protects all beings.', 'राजा अपनी प्रजा के लिए जीता है, कभी अपने लिए नहीं। धर्म वही है जो सभी प्राणियों की रक्षा करे।', fx='elder'),
      ln('NAR', 'And when the sun turned north, Bhishma chose to die.', 'और जब सूर्य उत्तरायण हुआ, भीष्म ने स्वेच्छा से प्राण त्याग दिए।')],
    [bg(set='sky', tod='dawn', sun=[1200, 600, 110], hills=1, ground='#3a2416'), piece('bed', 'arrowBed', d=1.0, x=800, y=760, s=1.0), fx('rays', x=1200, y=600, r0=100, r1=900, col='#ffe0a0', spin=1)],
    cam=push(800, 600, 1.05, 1.14), amb='birds', sfx=[dict(n='bells', at=8)]),
  S('e10_crown', 'sorrow', [
      ln('NAR', 'Yudhishthira was crowned king. But the victory tasted of ashes. He ruled with justice for thirty-six years.', 'युधिष्ठिर का राज्याभिषेक हुआ। पर विजय राख जैसी लगी। उन्होंने छत्तीस वर्ष न्याय से राज्य किया।')],
    [bg(set='court', tone='#4a1612', throne=[800, 660, 240], canopy=1), face('yudhi', 800, 450, 200, 1, 'sorrow', rim=RIM_GOLD, style=dict(crown='royal')), fx('petals', n=50)],
    cam=push(800, 450, 1.0, 1.12), amb='court', sfx=[dict(n='conch', at=0.5, v=0.5), dict(n='bells', at=1)]),
  S('e10_climb', 'lament', [
      ln('NAR', 'At the end of their lives, the Pandavas walked into the Himalayas. One by one, they fell. Draupadi. The twins. Arjuna. Bhima.', 'जीवन के अंत में पांडव हिमालय की ओर चल पड़े। एक-एक कर वे गिरते गए। द्रौपदी। जुड़वाँ भाई। अर्जुन। भीम।'),
      ln('NAR', 'Only Yudhishthira walked on, and a dog that had followed him all the way.', 'केवल युधिष्ठिर चलते रहे, और एक कुत्ता जो पूरे रास्ते उनके पीछे आया था।')],
    [bg(set='himalaya'), figs('walker', [fig('yudhi', 900, 860, 360, 1, 'stand', style=dict(crown='bun', dhoti='#e8dcc0'))], mv=dict(dx=[-300, 200], t=[0, 16])), piece('dog', 'dog', d=1.0, x=760, y=860, s=0.9, mv=dict(dx=[-300, 200], t=[0, 16])), fx('snow', n=200)],
    cam=push(800, 480, 1.0, 1.08), amb='wind'),
  S('e10_gate', 'divine', [
      ln('INDRA', 'Come, king. Your place in heaven is waiting. But the dog cannot enter.', 'आओ, राजन। स्वर्ग में तुम्हारा स्थान प्रतीक्षा कर रहा है। पर यह कुत्ता भीतर नहीं आ सकता।', fx='divine'),
      ln('YUDHI', 'He has been faithful to me. I will not abandon one who is faithful, not even for heaven.', 'यह मेरे प्रति निष्ठावान रहा है। मैं किसी निष्ठावान को नहीं छोड़ूँगा, स्वर्ग के लिए भी नहीं।')],
    [bg(set='heaven', gate=1100), figs('yudhi', [fig('yudhi', 500, 880, 560, 1, 'bless', style=dict(crown='bun', dhoti='#e8dcc0'))], rim=RIM_GOLD), piece('dog', 'dog', d=1.0, x=330, y=880, s=1.3), face('indra', 1100, 420, 150, -1, 'calm', n='indra', glow=['#ffe0a0', 26, 0.3])],
    cam=push(800, 470, 1.0, 1.08), amb='temple'),
  S('e10_dharma', 'end', [
      ln('NAR', 'The dog began to shine, and became Dharma himself. It had been the last test, and Yudhishthira had passed.', 'कुत्ता जगमगाने लगा, और स्वयं धर्मराज बन गया। यह अंतिम परीक्षा थी, और युधिष्ठिर उसमें सफल हुए।')],
    [bg(set='heaven', gate=800), fx('rays', x=800, y=420, r0=60, r1=1000, col='#fff8d0', spin=2), face('dharma', 800, 440, 200, 1, 'divine', rim=RIM_GOLD, glow=['#ffe0a0', 34, 0.5], halo=1), fx('petals', n=90)],
    cam=push(800, 450, 1.0, 1.12), amb='temple', sfx=[dict(n='sparkle', at=0.5), dict(n='bells', at=1.5)], tin='flash'),
  S('e10_end', 'end', [
      ln('NAR', 'Bonds of blood, of friendship, of vows: every one of them was tested. In the end, only dharma remained. Where there is dharma, there is victory.', 'रक्त के बंधन, मित्रता के बंधन, वचनों के बंधन: सबकी परीक्षा हुई। अंत में केवल धर्म बचा। जहाँ धर्म है, वहीं विजय है।')],
    [bg(set='void', base='#0a1030', mandala=330, my=420, mcol='#d9a536'), fx('wheel', x=800, y=420, r=330, spin=8, col='#f6dd8a'), fx('stars', n=120)],
    cam=push(800, 450, 1.0, 1.06), amb='temple', tout='fade', min=16,
    text=[dict(t0=10.5, t1=16, en='yato dharmas tato jayaḥ', hi='यतो धर्मस्ततो जयः', f='deva', sz=70, y=0.47, c='#f6dd8a'), dict(t0=11.5, t1=16, en='where there is dharma, there is victory', hi='जहाँ धर्म है, वहाँ विजय है', f='sub', sz=34, y=0.6, c='#f1e6cc')]),
])

CAST = {
    'en': {
        'NAR': dict(voice='bm_george', speed=0.9, pitch=-1.5, fx='storyteller'),
        'KRISHNA': dict(voice='am_michael:2+bm_fable:1', speed=0.92, pitch=0, fx='divine'),
        'KTIME': dict(voice='am_onyx:2+am_michael:1', speed=0.84, pitch=-3.5, fx='divine_big'),
        'ARJUNA': dict(voice='am_liam:2+am_adam:1', speed=0.95, pitch=0),
        'BHIMA': dict(voice='am_fenrir', speed=0.95, pitch=-2.5, fx='growl'),
        'YUDHI': dict(voice='am_adam:2+bm_george:1', speed=0.9, pitch=0),
        'KARNA': dict(voice='am_eric:2+am_onyx:1', speed=0.93, pitch=-0.5),
        'DURYO': dict(voice='am_fenrir:2+am_onyx:1', speed=0.95, pitch=-1, fx='growl'),
        'BHISHMA': dict(voice='bm_daniel', speed=0.86, pitch=-2.5, fx='elder'),
        'DEVA': dict(voice='bm_daniel:2+am_liam:1', speed=0.9, pitch=-0.5),
        'DRONA': dict(voice='bm_fable', speed=0.88, pitch=-2, fx='elder'),
        'VIDURA': dict(voice='bm_lewis', speed=0.88, pitch=-1.5, fx='elder'),
        'SHAKUNI': dict(voice='bm_lewis:2+am_puck:1', speed=0.95, pitch=1.0),
        'SHANTANU': dict(voice='am_onyx:2+bm_george:1', speed=0.9, pitch=-0.5),
        'DHRITA': dict(voice='bm_daniel:2+bm_fable:1', speed=0.84, pitch=-3, fx='elder'),
        'ABHI': dict(voice='am_puck:2+am_liam:1', speed=1.0, pitch=1.5),
        'FISHER': dict(voice='am_santa', speed=0.95, pitch=0),
        'SHIVA': dict(voice='am_onyx', speed=0.85, pitch=-3, fx='divine_big'),
        'YAKSHA': dict(voice='am_onyx:2+bm_daniel:1', speed=0.82, pitch=-4, fx='divine_big'),
        'INDRA': dict(voice='am_eric:2+am_michael:1', speed=0.92, pitch=-0.5, fx='divine'),
        'GANGA': dict(voice='af_nicole:2+af_heart:1', speed=0.92, pitch=0, fx='divine'),
        'DRAUPADI': dict(voice='af_heart:2+bf_emma:1', speed=0.95, pitch=-0.5),
        'KUNTI': dict(voice='bf_isabella', speed=0.88, pitch=-1, fx='elder'),
        'GANDHARI': dict(voice='bf_alice:2+bf_isabella:1', speed=0.86, pitch=-1.5, fx='elder'),
    },
    'hi': {
        'NAR': dict(voice='hm_omega', speed=0.88, pitch=-1, fx='storyteller'),
        'KRISHNA': dict(voice='hm_psi:2+am_michael:1', speed=0.9, pitch=0, fx='divine'),
        'KTIME': dict(voice='hm_omega:2+am_onyx:1', speed=0.82, pitch=-4, fx='divine_big'),
        'ARJUNA': dict(voice='hm_psi', speed=0.95, pitch=1.0),
        'BHIMA': dict(voice='hm_omega:2+am_fenrir:1', speed=0.95, pitch=-3, fx='growl'),
        'YUDHI': dict(voice='hm_omega:2+hm_psi:1', speed=0.9, pitch=0.5),
        'KARNA': dict(voice='hm_psi:2+am_eric:1', speed=0.93, pitch=-1),
        'DURYO': dict(voice='hm_omega:2+am_fenrir:1', speed=0.95, pitch=-1.5, fx='growl'),
        'BHISHMA': dict(voice='hm_omega:2+bm_daniel:1', speed=0.85, pitch=-3, fx='elder'),
        'DEVA': dict(voice='hm_psi:2+bm_daniel:1', speed=0.9, pitch=-1),
        'DRONA': dict(voice='hm_omega:2+bm_fable:1', speed=0.86, pitch=-2.5, fx='elder'),
        'VIDURA': dict(voice='hm_psi:2+bm_lewis:1', speed=0.88, pitch=-2, fx='elder'),
        'SHAKUNI': dict(voice='hm_psi:2+bm_lewis:1', speed=0.95, pitch=1.5),
        'SHANTANU': dict(voice='hm_omega:2+am_onyx:1', speed=0.9, pitch=-0.5),
        'DHRITA': dict(voice='hm_omega:2+bm_daniel:1', speed=0.84, pitch=-3.5, fx='elder'),
        'ABHI': dict(voice='hm_psi:2+am_puck:1', speed=1.0, pitch=2.0),
        'FISHER': dict(voice='hm_omega:2+am_santa:1', speed=0.95, pitch=0.5),
        'SHIVA': dict(voice='hm_omega:2+am_onyx:1', speed=0.84, pitch=-3.5, fx='divine_big'),
        'YAKSHA': dict(voice='hm_omega:2+am_onyx:1', speed=0.8, pitch=-4.5, fx='divine_big'),
        'INDRA': dict(voice='hm_psi:2+am_eric:1', speed=0.92, pitch=-0.5, fx='divine'),
        'GANGA': dict(voice='hf_beta:2+af_nicole:1', speed=0.9, pitch=0, fx='divine'),
        'DRAUPADI': dict(voice='hf_alpha', speed=0.95, pitch=-0.5),
        'KUNTI': dict(voice='hf_beta', speed=0.86, pitch=-1.5, fx='elder'),
        'GANDHARI': dict(voice='hf_beta:2+bf_alice:1', speed=0.85, pitch=-2, fx='elder'),
    },
}

SERIES = dict(title=dict(en='Mahabharata', hi='महाभारत'), subtitle=dict(en='Dharma Above All Bonds', hi='सब बंधनों से ऊपर धर्म'), fps=24, w=1280, h=720)

def tidy(ep):
    # hero intros: keep the face clear of its name card
    for s in ep['shots']:
        nm = s.get('name'); faces = [L for L in s['layers'] if 'portrait' in L]
        if nm and faces:
            side = nm.get('side', 1)
            for L in faces[:1]:
                L['portrait']['x'] = 540 if side > 0 else 1060; L['portrait']['f'] = 1 if side > 0 else -1
            s['layers'] = [L for L in s['layers'] if L not in faces[1:]]
            (a, b) = s['cam']; s['cam'] = [[800, a[1], a[2]], [800, b[1], b[2]]]
        for L in s['layers']:
            for g in L.get('figs', []):
                if g.get('S', 0) > 660 and g.get('y', 0) >= 850 and not g.get('rot'): g['S'] = 660

if __name__ == '__main__':
    for ep in EPISODES:
        tidy(ep)
        out = dict(SERIES, **ep, cast=CAST)
        json.dump(out, open(os.path.join(HERE, ep['id'] + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        n_shots = len(ep['shots']); n_lines = sum(len(s['lines']) for s in ep['shots'])
        print(f"{ep['id']}: {n_shots} shots, {n_lines} lines  {ep['title']['en']}")
