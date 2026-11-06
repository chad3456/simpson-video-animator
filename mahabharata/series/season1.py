#!/usr/bin/env python3
"""Mahabharata, Season 1: ten long episodes (20 to 25 minutes), told by Vyasa to Ganesha, who writes them down.

Every line is written in English and Hindi. Wide landscapes carry the story between close-ups. A layer marked
share='key' is painted once (in the first shot that uses it) and reused by every later shot with the same key.
Running this writes series/s1eNN.json.
"""
import copy, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from story import bg, plate, anim, fx, face, figs, fig, piece, ln, name, S, push, CAST as BASE_CAST, RIM_GOLD, RIM_COOL, RIM_FIRE  # noqa: E402

def sh(L, key): L['share'] = key; return L
def pan(x0, x1, y=450, z=1.15, y1=None, z1=None): return [[x0, y, z], [x1, y if y1 is None else y1, z if z1 is None else z1]]
def hold(x=800, y=450, z=1.0, dz=0.04): return [[x, y, z], [x, y - 4, z + dz]]
RIM_LAMP = ['#ffb060', 3, -2, 0.55]

# ---------------------------------------------------------------- the cave: Vyasa recites, Ganesha writes ---
def CAVE(view='night'):
    return [sh(bg(set='cave', view=view, lamps=[520, 1100]), 'cave_bg_' + view),
            sh(piece('vyasa', 'vyasa', x=470, y=800, S=500, f=1), 'cave_vyasa'),
            sh(piece('ganesha', 'ganesha', x=1060, y=800, S=500, hand=0), 'cave_ganesha'),
            sh(piece('hand', 'ganeshaHand', k='anim', every=3, x=1060, y=800, S=500), 'cave_hand'),
            sh(piece('flick', 'lampFlicker', k='anim', every=3, add=True, at=[[520, 742, 1.1], [1100, 742, 1.1]]), 'cave_flick')]
def CAVE_V(expr='calm'):   # Vyasa close: portrait against the dark cave
    return [sh(bg(set='cave', view='night', lamps=[520, 1100]), 'cave_bg_night'),
            sh(face('vyasa', 700, 420, 190, 1, expr, rim=RIM_LAMP, n='vy_' + expr), 'vyasa_face_' + expr),
            sh(piece('flick', 'lampFlicker', k='anim', every=3, add=True, at=[[520, 742, 1.1], [1100, 742, 1.1]]), 'cave_flick')]
def CAVE_G():              # Ganesha close: the scribe and his leaf
    return [sh(bg(set='cave', view='night', lamps=[520, 1100]), 'cave_bg_night'),
            sh(piece('gclose', 'ganesha', x=820, y=1420, S=1300, hand=0), 'ganesha_close'),
            sh(piece('ghand', 'ganeshaHand', k='anim', every=3, x=820, y=1420, S=1300), 'ganesha_close_hand'),
            sh(piece('flick', 'lampFlicker', k='anim', every=3, add=True, at=[[520, 742, 1.1], [1100, 742, 1.1]]), 'cave_flick')]
CAVE_CAM = dict(wide=[[800, 470, 1.0], [800, 470, 1.06]], two=[[780, 560, 1.35], [780, 560, 1.42]], vy=[[520, 520, 1.7], [520, 510, 1.8]],
                ga=[[1050, 500, 1.6], [1050, 490, 1.7]], hand=[[980, 650, 2.4], [1000, 650, 2.6]])

EPISODES = []
def EP(n, en, hi, tag_en, tag_hi, shots):
    EPISODES.append(dict(n=n, id=f's1e{n:02d}', title=dict(en=en, hi=hi), tag=dict(en=tag_en, hi=tag_hi), shots=shots))

# =============================================================== EPISODE 1 ===
EP(1, 'The Scribe and the Vow', 'लेखक और प्रतिज्ञा', 'Vyasa begins the greatest story ever told.', 'व्यास आरंभ करते हैं संसार की सबसे महान कथा।', [
  # ---------- PROLOGUE: the pact ----------
  S('a_invoke', 'gita', [
      ln('CHANT', 'Narayanam namaskritya, Naram chaiva narottamam. Devim Sarasvatim Vyasam, tato jayam udirayet.',
                  'नारायणं नमस्कृत्य नरं चैव नरोत्तमम्। देवीं सरस्वतीं व्यासं ततो जयमुदीरयेत्॥', at=2.0, speed=0.82)],
    [sh(bg(set='void', base='#0a0a20', mandala=330, mcol='#d9a536'), 'void_mandala'), fx('wheel', x=800, y=450, r=300, col='#f6d890', n='fx_wheel'), fx('stars', n=120)],
    cam=push(800, 450, 1.0, 1.08), amb='temple', sfx=[dict(n='om', at=0.2, v=0.7), dict(n='bell', at=9.0, v=0.4)], min=14,
    text=[dict(t0=1.5, t1=12.0, en='Bowing to Narayana, to Nara, best of men, to the goddess Sarasvati and to Vyasa, let the story of victory be told.', hi='नारायण, नरोत्तम नर, देवी सरस्वती और व्यास को नमन करके, जय की कथा कही जाए।', y=0.84, sz=30)]),
  S('a_himal', 'title', [
      ln('VYASA', 'Listen. High in the Himalaya, where the Ganga is born from the ice, there is a cave.',
                  'सुनो। ऊँचे हिमालय में, जहाँ बर्फ़ से गंगा जन्म लेती है, वहाँ एक गुफ़ा है।', at=5.0)],
    [sh(bg(set='himalaya', tod='dawn', sun=[1180, 360, 80]), 'himal_dawn'), fx('snow', n=90, sz=2.0)],
    cam=pan(640, 960, 440, 1.2, 430, 1.12), amb='wind', min=12, eptitle=1, tin='fade'),
  S('a_peaks', 'divine', [
      ln('VYASA', 'In that cave an old sage sat with a story too large for any one man to carry.',
                  'उस गुफ़ा में एक वृद्ध ऋषि बैठे थे, एक ऐसी कथा लिए जो किसी एक मनुष्य के उठाए न उठे।')],
    [sh(bg(set='himalaya', tod='dawn', sun=[1180, 360, 80]), 'himal_dawn'), fx('snow', n=90, sz=2.0, n_='s')],
    cam=[[1000, 380, 1.6], [900, 420, 1.3]], amb='wind', min=8),
  S('a_cave_out', 'divine', [
      ln('VYASA', 'His name was Krishna Dvaipayana. The world calls him Vyasa, the one who divided the Vedas.',
                  'उनका नाम था कृष्ण द्वैपायन। संसार उन्हें व्यास कहता है, जिन्होंने वेदों का विभाजन किया।')],
    [sh(bg(set='cave', view='night', lamps=[520, 1100], leaves=0), 'cave_empty'), sh(piece('vyasa', 'vyasa', x=800, y=800, S=430, f=1), 'cave_vyasa_alone'),
     sh(piece('flick', 'lampFlicker', k='anim', every=3, add=True, at=[[520, 742, 1.1], [1100, 742, 1.1]]), 'cave_flick')],
    cam=[[800, 450, 1.0], [800, 520, 1.25]], amb='night', min=9),
  S('a_vyasa', 'divine', [
      ln('VYASAC', 'I have seen it all. A family, a war, and the dharma that outlives them both. If it is not written down, it will be lost.',
                   'मैंने सब देखा है। एक परिवार, एक युद्ध, और वह धर्म जो दोनों से बड़ा है। यदि यह लिखा न गया, तो यह खो जाएगा।')],
    CAVE_V('calm'), cam=push(720, 450, 1.0, 1.08), amb='night', hero=1,
    name=name('VYASA', 'व्यास', 'the poet of the epic', 'महाकाव्य के रचयिता', 1)),
  S('a_brahma', 'mystery', [
      ln('VYASA', 'He prayed to Brahma, the creator. And Brahma answered: only one being can write as fast as you can speak. Call upon Ganesha.',
                  'उन्होंने सृष्टिकर्ता ब्रह्मा से प्रार्थना की। ब्रह्मा ने कहा: केवल एक ही है जो तुम्हारे बोलने जितना तेज़ लिख सके। गणेश का आवाहन करो।')],
    [sh(bg(set='cosmos', galaxies=4), 'cosmos'), fx('glow', x=800, y=430, r=260, col='#ffd890'), fx('wheel', x=800, y=430, r=230, col='#f6d890', n='fx_wheel')],
    cam=push(800, 440, 1.0, 1.12), amb='temple', sfx=[dict(n='om', at=0.5, v=0.6)]),
  S('a_arrive', 'krishna', [
      ln('VYASA', 'And Ganesha came, the remover of obstacles, the lord of beginnings.',
                  'और गणेश आए, विघ्नहर्ता, हर आरंभ के स्वामी।')],
    CAVE() + [fx('glow', x=1060, y=520, r=300, col='#ffd890', t=[0, 4])], cam=CAVE_CAM['wide'], amb='temple',
    sfx=[dict(n='bells', at=0.3), dict(n='sparkle', at=0.8)], tin='flash', hero=1,
    name=name('GANESHA', 'गणेश', 'the divine scribe', 'दिव्य लेखक', -1)),
  S('a_cond1', 'krishna', [
      ln('GANESHA', 'I will be your scribe, Muni. But hear my condition. My pen must never stop. If you pause even once, I will rise and leave.',
                    'मैं आपका लेखक बनूँगा, मुनिवर। पर मेरी शर्त सुनिए। मेरी लेखनी कभी रुकनी नहीं चाहिए। आप एक बार भी रुके, तो मैं उठकर चला जाऊँगा।')],
    CAVE_G(), cam=push(820, 430, 1.0, 1.08), amb='night'),
  S('a_cond2', 'krishna', [
      ln('VYASAC', 'Then hear mine. You will not write a single verse until you have understood its meaning.',
                   'तो मेरी शर्त भी सुनो। कोई भी श्लोक तब तक मत लिखना, जब तक उसका अर्थ न समझ लो।')],
    CAVE_V('calm'), cam=push(700, 440, 1.04, 1.12), amb='night'),
  S('a_agree', 'krishna', [
      ln('GANESHA', 'Agreed.', 'स्वीकार है।'),
      ln('VYASA', 'And so, whenever Vyasa needed time to think, he spoke a verse so knotted with meaning that even Ganesha had to stop and ponder.',
                  'और इस तरह, जब भी व्यास को सोचने का समय चाहिए होता, वे ऐसा गूढ़ श्लोक बोलते कि गणेश को भी रुककर विचार करना पड़ता।', gap=1.2)],
    CAVE(), cam=CAVE_CAM['two'], amb='night'),
  S('a_riddle', 'mystery', [
      ln('VYASA', 'That is why the Mahabharata holds riddles inside riddles. What is here is found elsewhere. What is not here is found nowhere.',
                  'इसीलिए महाभारत में पहेलियों के भीतर पहेलियाँ हैं। जो यहाँ है, वह और कहीं भी मिलेगा। जो यहाँ नहीं है, वह कहीं नहीं मिलेगा।')],
    CAVE(), cam=[[1000, 650, 2.3], [1010, 640, 2.5]], amb='night', min=9),
  S('a_tusk', 'tension', [
      ln('VYASA', 'They wrote through the night. Then the pen broke. Ganesha did not stop. He snapped off his own tusk, and wrote on with it.',
                  'वे रात भर लिखते रहे। फिर लेखनी टूट गई। गणेश रुके नहीं। उन्होंने अपना ही दाँत तोड़ा, और उसी से लिखते रहे।')],
    CAVE_G(), cam=[[820, 330, 1.5], [820, 360, 1.25]], amb='night', sfx=[dict(n='crack', at=4.4, v=0.8)], shake=[[4.4, 4.9]]),
  S('a_scope', 'cosmic', [
      ln('VYASA', 'A hundred thousand verses. Two families of cousins. A game of dice, a queen dragged into a hall by her hair, a war of eighteen days, and God himself driving a chariot.',
                  'एक लाख श्लोक। चचेरे भाइयों के दो परिवार। पासों का एक खेल, बालों से घसीटकर सभा में लाई गई एक रानी, अठारह दिनों का युद्ध, और स्वयं भगवान एक रथ हाँकते हुए।')],
    [bg(set='field', sunX=820, sunY=520), fx('dust', col='#c07a4a', n=80)],
    cam=pan(560, 1040, 470, 1.2, 450, 1.05), amb='battle', sfx=[dict(n='conch', at=8.0, v=0.5)]),
  S('a_scope2', 'krishna', [
      ln('VYASA', 'And under all of it, one question, asked again and again: when love and dharma pull in different directions, which do you follow?',
                  'और इन सबके नीचे, एक ही प्रश्न, बार बार पूछा गया: जब प्रेम और धर्म अलग अलग दिशाओं में खींचें, तो किसका अनुसरण करें?')],
    [sh(bg(set='cosmos', galaxies=4), 'cosmos'), fx('wheel', x=800, y=450, r=280, col='#f6d890', n='fx_wheel')],
    cam=push(800, 450, 1.0, 1.15), amb='temple'),
  S('a_begin', 'river', [
      ln('VYASAC', 'Write, then. It begins, as all great things do, with a river.',
                   'तो लिखो। यह आरंभ होती है, जैसे हर महान चीज़ होती है, एक नदी से।')],
    CAVE_V('smile'), cam=push(700, 440, 1.0, 1.1), amb='night', tout='fade'),

  # ---------- PART ONE: the eight Vasus ----------
  S('b_realm', 'wonder', [
      ln('VYASA', 'Long ago, above the clouds, lived the eight Vasus, gods of fire and wind, of water, earth and light.',
                  'बहुत पहले, बादलों के ऊपर, आठ वसु रहते थे: अग्नि और वायु के, जल, पृथ्वी और प्रकाश के देवता।', at=1.5)],
    [sh(bg(set='sky_realm', peak=1240), 'realm'), sh(piece('vasus', 'vasus', y=640, S=230), 'vasus_row'), fx('sparkle', y0=300, y1=900, n=80, col='#fff4d0')],
    cam=pan(650, 950, 450, 1.12), amb='wind', tin='fade', min=10),
  S('b_meru', 'forest', [
      ln('VYASA', 'One day they wandered down to the slopes of Mount Meru, to the hermitage of the great sage Vasishtha.',
                  'एक दिन वे मेरु पर्वत की ढलानों पर उतरे, महर्षि वसिष्ठ के आश्रम की ओर।')],
    [sh(bg(set='valley', tod='day', hz=430, seed=1.2, groves=18), 'valley_day'), sh(piece('folk', 'folk', cnt=8, y=780, s=50, seed=3), 'valley_folk')],
    cam=pan(560, 1040, 460, 1.18), amb='birds', min=9),
  S('b_ashram', 'forest', [
      ln('VYASA', 'There, by a sacred fire, grazed Nandini, the wish-fulfilling cow. Whoever drank her milk would stay young for ten thousand years.',
                  'वहाँ, यज्ञ की अग्नि के पास, कामधेनु नंदिनी चरती थी। जो उसका दूध पीता, वह दस हज़ार वर्षों तक युवा रहता।')],
    [sh(bg(set='ashram', tod='day', cow=[1050, 860, 260, -1]), 'ashram_day'), fx('dust', col='#fff0c0', n=40)],
    cam=push(900, 520, 1.05, 1.2), amb='birds', sfx=[dict(n='bell', at=1.0, v=0.4)]),
  S('b_wife', 'love', [
      ln('WIFE', 'My lord, steal that cow for me. I want her milk for a dear friend on earth.',
                 'स्वामी, वह गाय मेरे लिए ले आइए। मुझे पृथ्वी पर अपनी प्रिय सखी के लिए उसका दूध चाहिए।'),
      ln('VYASA', 'Prabhasa, the youngest of the Vasus, hesitated. Then love won over what was right.',
                  'वसुओं में सबसे छोटे, प्रभास, ठिठके। फिर प्रेम ने उचित पर विजय पा ली।', gap=0.8)],
    [sh(bg(set='ashram', tod='day', cow=[1050, 860, 260, -1]), 'ashram_day'), face('vasu', 620, 430, 180, 1, 'awe', rim=RIM_GOLD, glow=['#fff0b0', 26, 0.3])],
    cam=push(640, 450, 1.04, 1.12), amb='birds'),
  S('b_steal', 'tension', [
      ln('VYASA', 'The eight gods led Nandini away, while the sage was at the river.',
                  'आठों देवता नंदिनी को हाँक ले गए, जब ऋषि नदी पर थे।')],
    [sh(bg(set='valley', tod='dusk', hz=450, seed=2.1), 'valley_dusk'), piece('steal', 'vasus', y=800, S=120, x0=500, x1=1040),
     piece('cowsmall', 'cow', x=1160, y=800, s=140, f=1)],
    cam=pan(720, 900, 470, 1.2), amb='wind', min=8),
  S('b_curse', 'storm', [
      ln('VASISHTHA', 'You stole from a hermit for a whim? Then live as men live! Be born on earth, and die there!',
                      'तुमने एक तपस्वी से, केवल इच्छा के लिए, चोरी की? तो मनुष्यों की तरह जियो! पृथ्वी पर जन्म लो, और वहीं मरो!', fx='elder')],
    [sh(bg(set='sky', tod='storm', hz=720), 'storm_sky'), face('vasishtha', 800, 430, 200, 1, 'anger', rim=['#dfefff', -3, -2, 0.8]),
     fx('flash', every=1, at=[0.6, 5.5], bolt=1200)],
    cam=push(800, 440, 1.0, 1.14), amb='storm', sfx=[dict(n='thunder', at=0.6), dict(n='thunder', at=5.5, v=0.8)], shake=[[0.6, 1.2]], hero=1,
    name=name('VASISHTHA', 'वसिष्ठ', 'the sage of Meru', 'मेरु के महर्षि', -1)),
  S('b_plead', 'sorrow', [
      ln('VASU', 'Forgive us, holy one! We were foolish.', 'क्षमा कीजिए, भगवन! हमसे भूल हुई।', fx='chorus'),
      ln('VASISHTHA', 'A curse once spoken cannot be unspoken. But seven of you will be freed within moments of your birth.',
                      'एक बार दिया शाप लौटता नहीं। पर तुममें से सात, जन्म लेते ही मुक्त हो जाएँगे।', fx='elder', gap=0.6)],
    [sh(bg(set='sky_realm', peak=1240), 'realm'), sh(piece('vasus', 'vasus', y=640, S=230), 'vasus_row'), fx('rain', n=60, col='#c8d0e0')],
    cam=push(800, 500, 1.0, 1.12), amb='wind'),
  S('b_prabhasa', 'lament', [
      ln('VASISHTHA', 'But you, Prabhasa, who did the deed, will live long on earth. You will never marry. You will have no sons. You will be the greatest of men, and you will suffer for it.',
                      'पर तुम, प्रभास, जिसने यह किया, पृथ्वी पर लंबा जीवन जियोगे। तुम कभी विवाह नहीं करोगे। तुम्हारी कोई संतान न होगी। तुम मनुष्यों में सबसे महान होगे, और इसी का दुःख भोगोगे।', fx='elder')],
    [sh(bg(set='sky', tod='storm', hz=720), 'storm_sky'), face('vasu', 800, 430, 200, 1, 'sorrow', rim=RIM_COOL)],
    cam=push(800, 440, 1.04, 1.16), amb='storm', sfx=[dict(n='rumble', at=2.0, v=0.5)]),
  S('b_ganga', 'river', [
      ln('VYASA', 'The Vasus went to the river goddess Ganga, and begged her.', 'वसु नदी देवी गंगा के पास गए, और उनसे विनती की।'),
      ln('VASU', 'Be our mother on earth. And when we are born, give us back to your waters at once, so we may come home.',
                 'पृथ्वी पर हमारी माता बनिए। और जन्म लेते ही, हमें अपनी धारा को सौंप दीजिए, ताकि हम घर लौट सकें।', fx='chorus', gap=0.6)],
    [sh(bg(set='river', tod='dawn', hz=560, reeds=1, lotus=8), 'river_dawn'), face('ganga', 1000, 430, 190, -1, 'sorrow', rim=RIM_COOL, glow=['#9fd8ff', 30, 0.35]),
     fx('sparkle', y0=600, y1=900, n=70, col='#dff4ff')],
    cam=push(960, 450, 1.0, 1.12), amb='river', hero=1, name=name('GANGA', 'गंगा', 'goddess of the river', 'नदी की देवी', -1)),
  S('b_scribe', 'krishna', [
      ln('GANESHA', 'So the drownings will be a mercy.', 'तो वे डुबोना, दया होगी।'),
      ln('VYASAC', 'A mercy that looks like cruelty. Remember that, scribe. You will see it again.',
                   'ऐसी दया, जो क्रूरता दिखती है। यह याद रखना, लेखक। तुम इसे फिर देखोगे।', gap=0.7)],
    CAVE(), cam=CAVE_CAM['two'], amb='night'),

  # ---------- PART TWO: Shantanu and Ganga ----------
  S('b_brahma', 'cosmic', [
      ln('VYASA', 'But Ganga had her own reason to come down to earth. Once, in the court of Brahma, a wind lifted the goddess\'s robe. Every god lowered his eyes, except one: a king named Mahabhisha.',
                  'पर गंगा के पृथ्वी पर आने का अपना कारण भी था। एक बार, ब्रह्मा की सभा में, हवा ने देवी का वस्त्र उड़ा दिया। सब देवताओं ने आँखें झुका लीं, सिवाय एक के: महाभिष नाम के एक राजा के।', at=1.0)],
    [sh(bg(set='heaven', gate=800), 'heaven_gate'), figs('court2', [fig('shantanu', 420, 880, 420, 1, 'stand'), dict(who='ganga', x=1180, y=880, S=440, f=-1)], rim=RIM_GOLD),
     fx('petals', every=2, n=50, cols=['#fff8e8', '#f6e6b0'])],
    cam=pan(700, 900, 460, 1.1), amb='temple', tin='fade', sfx=[dict(n='wind', at=4.0, v=0.5)]),
  S('b_bcurse', 'mystery', [
      ln('BRAHMA', 'You could not lower your eyes, king. Then be born a man on earth, and she will be the one who breaks your heart.',
                   'तुम आँखें न झुका सके, राजन। तो पृथ्वी पर मनुष्य बनकर जन्म लो, और वही तुम्हारा हृदय तोड़ेगी।', fx='divine_big')],
    [sh(bg(set='heaven', gate=800), 'heaven_gate'), fx('rays', x=800, y=200, r0=80, r1=1000, col='#fff0c0', n='fx_rays'), fx('glow', x=800, y=420, r=320, col='#ffe0a0')],
    cam=push(800, 420, 1.0, 1.15), amb='temple', sfx=[dict(n='gong', at=0.5, v=0.5)]),
  S('b_pratipa', 'river', [
      ln('VYASA', 'Mahabhisha was born again as the son of King Pratipa of Hastinapura. One day, as old Pratipa prayed by the Ganga, a radiant woman rose from the river and sat upon his right thigh.',
                  'महाभिष ने हस्तिनापुर के राजा प्रतीप के पुत्र के रूप में जन्म लिया। एक दिन, जब वृद्ध प्रतीप गंगा के तट पर तप कर रहे थे, एक तेजस्वी स्त्री नदी से निकली और उनकी दाहिनी जंघा पर बैठ गई।')],
    [sh(bg(set='river', tod='dawn', hz=560, reeds=1, lotus=8), 'river_dawn'), figs('pratipa', [fig('pratipa', 620, 880, 470, 1, 'bless'), dict(who='ganga', x=860, y=880, S=470, f=-1)], rim=RIM_GOLD),
     fx('sparkle', y0=600, y1=900, n=60, col='#dff4ff')],
    cam=push(740, 460, 1.04, 1.14), amb='river'),
  S('b_thigh', 'river', [
      ln('PRATIPA', 'The left thigh is for a wife. The right is for a daughter, or a son\'s wife. Be the bride of my son, then.',
                    'बायीं जंघा पत्नी का स्थान है। दाहिनी, पुत्री या पुत्रवधू का। तो तुम मेरे पुत्र की वधू बनो।', fx='elder'),
      ln('PRATIPA', 'Son, if a beautiful woman ever comes to you from the river, marry her, and ask her nothing.',
                    'पुत्र, यदि कभी नदी से कोई सुंदर स्त्री तुम्हारे पास आए, तो उससे विवाह करना, और उससे कुछ मत पूछना।', fx='elder', gap=1.4)],
    [sh(bg(set='river', tod='dawn', hz=560, reeds=1, lotus=8), 'river_dawn'), face('pratipa', 620, 440, 180, 1, 'calm', rim=RIM_GOLD)],
    cam=push(640, 450, 1.04, 1.12), amb='river', hero=1, name=name('PRATIPA', 'प्रतीप', 'father of Shantanu', 'शांतनु के पिता', 1)),
  S('c_city', 'court', [
      ln('VYASA', 'On earth, in Hastinapura, the city of elephants, ruled King Shantanu of the Kuru line.',
                  'पृथ्वी पर, गजों की नगरी हस्तिनापुर में, कुरुवंश के राजा शांतनु राज करते थे।', at=2.0)],
    [sh(bg(set='city', tod='gold', ghats=1), 'city_gold'), fx('dust', col='#f0c070', n=50)],
    cam=pan(560, 1040, 440, 1.15), amb='court', tin='fade', min=10),
  S('c_proc', 'heroic', [
      ln('VYASA', 'He was just and generous. It was said that his touch could make the old feel young again.',
                  'वे न्यायप्रिय और उदार थे। कहते थे कि उनके स्पर्श से वृद्ध भी स्वयं को युवा अनुभव करते।')],
    [sh(bg(set='valley', tod='gold', hz=480, city=[1250, 300], seed=0.6), 'valley_gold'), piece('proc', 'procession', k='anim', every=3, y=800, s=110, x0=-300, cnt=11, speed=40)],
    cam=pan(700, 900, 470, 1.15), amb='crowd', sfx=[dict(n='nagara', at=0.5, v=0.5)], min=9),
  S('c_shantanu', 'court', [
      ln('VYASA', 'But the king was alone.', 'पर राजा अकेले थे।')],
    [bg(set='palace', tod='dusk', x=360, w=880, h=560), face('shantanu', 1000, 430, 190, -1, 'calm', rim=RIM_GOLD)],
    cam=push(980, 450, 1.0, 1.1), amb='wind', hero=1, name=name('SHANTANU', 'शांतनु', 'king of Hastinapura', 'हस्तिनापुर के राजा', -1)),
  S('c_hunt', 'forest', [
      ln('VYASA', 'One spring, hunting along the Ganga, he rode far from his men.',
                  'एक वसंत में, गंगा के किनारे शिकार करते हुए, वे अपने साथियों से बहुत दूर निकल गए।')],
    [sh(bg(set='river', tod='day', hz=520, bank=760), 'river_day'), piece('riders', 'riders', k='anim', every=2, x=120, y=830, s=170, cnt=1, speed=70)],
    cam=pan(640, 960, 450, 1.1), amb='river', sfx=[dict(n='hooves', at=0.3, v=0.6)]),
  S('c_sees', 'love', [
      ln('VYASA', 'And on the bank he saw a woman so beautiful that the river itself seemed to have taken shape.',
                  'और तट पर उन्होंने एक ऐसी स्त्री देखी, इतनी सुंदर, मानो स्वयं नदी ने रूप धर लिया हो।')],
    [sh(bg(set='river', tod='day', hz=520, bank=760), 'river_day'), figs('gangafig', [dict(who='ganga', x=1080, y=880, S=520, f=-1)], rim=RIM_COOL),
     fx('sparkle', y0=600, y1=900, n=60, col='#dff4ff')],
    cam=[[900, 470, 1.0], [1020, 450, 1.25]], amb='river', sfx=[dict(n='sparkle', at=1.0, v=0.4)]),
  S('c_ask', 'love', [
      ln('SHANTANU', 'Whoever you are, goddess or woman, be my queen. Everything I have is yours.',
                     'तुम जो भी हो, देवी या स्त्री, मेरी रानी बनो। मेरा सब कुछ तुम्हारा है।')],
    [sh(bg(set='river', tod='day', hz=520, bank=760), 'river_day'), face('shantanu', 560, 440, 180, 1, 'awe', n='king', rim=RIM_GOLD)],
    cam=push(600, 450, 1.04, 1.12), amb='river'),
  S('c_cond', 'mystery', [
      ln('GANGA', 'I will be your queen, on one condition. Whatever I do, you must never question me. The day you ask why, I will leave you.',
                  'मैं तुम्हारी रानी बनूँगी, एक शर्त पर। मैं जो भी करूँ, तुम मुझसे कभी प्रश्न नहीं करोगे। जिस दिन पूछोगे क्यों, उसी दिन मैं चली जाऊँगी।', fx='divine')],
    [sh(bg(set='river', tod='day', hz=520, bank=760), 'river_day'), face('ganga', 1040, 430, 180, -1, 'calm', rim=RIM_COOL, glow=['#9fd8ff', 30, 0.35])],
    cam=push(1020, 450, 1.04, 1.12), amb='river'),
  S('c_swear', 'love', [
      ln('SHANTANU', 'I swear it.', 'मैं वचन देता हूँ।'),
      ln('VYASA', 'And so they were married, and for a time Hastinapura knew nothing but joy.', 'और उनका विवाह हुआ, और कुछ समय तक हस्तिनापुर ने केवल आनंद जाना।', gap=1.0)],
    [sh(bg(set='court', tone='#5a1a16', throne=[800, 660, 240], canopy=1), 'court_red'),
     figs('couple', [fig('shantanu', 640, 880, 520, 1, 'bless'), dict(who='ganga', x=960, y=880, S=500, f=-1)], rim=RIM_GOLD), fx('petals', every=2, n=90)],
    cam=[[800, 430, 1.25], [800, 450, 1.05]], amb='court', sfx=[dict(n='bells', at=2.5, v=0.6), dict(n='conch', at=3.0, v=0.4)]),
  S('c_years', 'joy', [
      ln('VYASA', 'The queen gave no name and no family, and the king asked for none. The city loved her, and the king could not take his eyes from her.',
                  'रानी ने न अपना नाम बताया, न अपना कुल, और राजा ने कुछ न पूछा। नगर उन्हें चाहता था, और राजा उनसे आँखें नहीं हटा पाते थे।')],
    [sh(bg(set='city', tod='gold', ghats=1), 'city_gold'), piece('folkghat', 'folk', cnt=16, y=640, dy=40, s=40, seed=9), fx('petals', every=2, n=40)],
    cam=[[1000, 560, 1.6], [800, 520, 1.4]], amb='crowd'),
  S('c_first', 'sorrow', [
      ln('VYASA', 'Then their first son was born. At dawn the queen carried him to the river, and gave him to the water.',
                  'फिर उनका पहला पुत्र जन्मा। भोर में रानी उसे नदी पर ले गईं, और जल को सौंप दिया।')],
    [sh(bg(set='river', tod='night', hz=560, moon=[1200, 200, 60]), 'river_night'), sh(figs('gwalk', [dict(who='ganga', x=820, y=900, S=520, f=1, arm=[70, 110])], d=0.9, rim=RIM_COOL), 'ganga_walk'),
     sh(piece('lamps', 'floatLamps', k='anim', every=3, add=True), 'river_lamps')],
    cam=push(800, 470, 1.04, 1.12), amb='river', sfx=[dict(n='splash', at=5.0, v=0.5)]),
  S('c_silent', 'sorrow', [
      ln('VYASA', 'The king stood on the bank and said nothing. He had given his word.', 'राजा तट पर खड़े रहे, और कुछ न बोले। उन्होंने वचन दिया था।')],
    [sh(bg(set='river', tod='night', hz=560, moon=[1200, 200, 60]), 'river_night'), face('shantanu', 700, 450, 190, 1, 'sorrow', rim=RIM_COOL)],
    cam=push(720, 460, 1.04, 1.14), amb='river'),
  S('c_seven', 'lament', [
      ln('VYASA', 'A second son. A third. Seven sons, seven dawns, seven silences.', 'दूसरा पुत्र। तीसरा। सात पुत्र, सात भोर, सात मौन।')],
    [sh(bg(set='river', tod='dawn', hz=560, reeds=1, lotus=8), 'river_dawn'), sh(piece('lamps', 'floatLamps', k='anim', every=3, add=True), 'river_lamps'), fx('ripples', x=800, y=760, n=7)],
    cam=pan(600, 1000, 480, 1.2), amb='river', sfx=[dict(n='splash', at=1.5, v=0.3), dict(n='splash', at=4.0, v=0.3), dict(n='splash', at=6.5, v=0.3)], min=10),
  S('c_fifth', 'sorrow', [
      ln('VYASA', 'With every child, the question grew heavier on his tongue. With every dawn, he swallowed it again. He loved her, and he feared to lose her.',
                  'हर बच्चे के साथ, प्रश्न उनकी जीभ पर और भारी होता गया। हर भोर, वे उसे फिर निगल जाते। वे उनसे प्रेम करते थे, और उन्हें खोने से डरते थे।')],
    [sh(bg(set='chamber', tone='#141a2a', moon=1, windowCol='#1c3358'), 'chamber_blue'), figs('pace', [fig('shantanu', 700, 880, 520, 1, 'despair')], rim=RIM_COOL)],
    cam=push(720, 470, 1.04, 1.14), amb='night'),
  S('c_eighth', 'tension', [
      ln('VYASA', 'When the eighth was born, the king followed her to the river.', 'जब आठवाँ जन्मा, राजा उनके पीछे नदी तक गए।'),
      ln('SHANTANU', 'Stop! What mother drowns her own children? I will not be silent again!',
                     'रुको! कौन माँ अपने ही बच्चों को डुबोती है? अब मैं चुप नहीं रहूँगा!', gap=0.6)],
    [sh(bg(set='river', tod='night', hz=560, moon=[1250, 180, 55]), 'river_night2'), face('shantanu', 470, 440, 170, 1, 'anger', n='king', rim=RIM_COOL),
     face('ganga', 1130, 430, 170, -1, 'sorrow', rim=RIM_COOL, glow=['#9fd8ff', 30, 0.4])],
    cam=[[700, 450, 1.08], [920, 445, 1.1]], amb='river'),
  S('c_truth', 'divine', [
      ln('GANGA', 'Then our marriage is over, king, as I warned you. Hear the truth. I am Ganga. Your sons were the Vasus, cursed to be born as men. I set them free.',
                  'तो हमारा विवाह समाप्त हुआ, राजन, जैसा मैंने कहा था। सत्य सुनो। मैं गंगा हूँ। तुम्हारे पुत्र वसु थे, शापवश मनुष्य बने। मैंने उन्हें मुक्त किया।', fx='divine')],
    [sh(bg(set='river', tod='night', hz=560, moon=[1250, 180, 55]), 'river_night2'), face('ganga', 800, 430, 200, 1, 'divine', rim=RIM_COOL, glow=['#9fd8ff', 34, 0.45]),
     fx('rays', x=800, y=300, r0=60, r1=900, col='#cfe8ff', n='fx_rays')],
    cam=push(800, 440, 1.0, 1.12), amb='river', sfx=[dict(n='swell', at=0.5, v=0.5)]),
  S('c_eighth2', 'divine', [
      ln('GANGA', 'This last one is Prabhasa. He must live, as the sage said. I will raise him, and one day I will return him to you.',
                  'यह अंतिम प्रभास है। इसे जीना होगा, जैसा ऋषि ने कहा था। मैं इसे पालूँगी, और एक दिन इसे तुम्हें लौटा दूँगी।', fx='divine')],
    [sh(bg(set='river', tod='night', hz=560, moon=[1250, 180, 55]), 'river_night2'), face('ganga', 1000, 430, 190, -1, 'calm', rim=RIM_COOL, glow=['#9fd8ff', 30, 0.4])],
    cam=push(980, 440, 1.04, 1.12), amb='river'),
  S('c_gone', 'lament', [
      ln('VYASA', 'And she walked into the river with the child in her arms, and was gone.', 'और वे बालक को गोद में लिए नदी में उतर गईं, और ओझल हो गईं।')],
    [sh(bg(set='river', tod='night', hz=560, moon=[1200, 200, 60]), 'river_night'), sh(figs('gwalk', [dict(who='ganga', x=820, y=900, S=520, f=1, arm=[70, 110])], d=0.9, rim=RIM_COOL), 'ganga_walk'),
     fx('ripples', x=820, y=820, n=5), fx('sparkle', y0=600, y1=900, n=50, col='#dff4ff')],
    cam=[[800, 520, 1.3], [800, 420, 1.0]], amb='river', sfx=[dict(n='splash', at=3.5, v=0.4)]),
  S('c_lone', 'sorrow', [], [sh(bg(set='valley', tod='night', hz=460, seed=4.0, groves=10), 'valley_night'), fx('fireflies', n=40)],
    cam=pan(900, 700, 460, 1.15), amb='night', min=6),
  S('c_scribe', 'krishna', [
      ln('GANESHA', 'He broke his promise to save a child.', 'उन्होंने एक बालक को बचाने के लिए अपना वचन तोड़ा।'),
      ln('VYASAC', 'And lost everything for it. So tell me, scribe: which was dharma? The word, or the child?',
                   'और इसके लिए सब कुछ खो दिया। तो बताओ, लेखक: धर्म क्या था? वचन, या बालक?', gap=0.7),
      ln('GANESHA', 'I am writing it down, Muni. I am not answering it.', 'मैं इसे लिख रहा हूँ, मुनिवर। इसका उत्तर नहीं दे रहा।', gap=0.8)],
    CAVE(), cam=[[880, 560, 1.3], [880, 560, 1.38]], amb='night'),

  # ---------- PART THREE: the boy who stopped a river ----------
  S('d_years', 'river', [
      ln('VYASA', 'Sixteen years passed. Shantanu ruled alone, and grew grey, and never stopped looking at the river.',
                  'सोलह वर्ष बीत गए। शांतनु अकेले राज करते रहे, बूढ़े होते गए, और नदी की ओर देखना कभी नहीं छोड़ा।', at=1.5)],
    [sh(bg(set='valley', tod='dawn', hz=470, city=[1200, 260], seed=0.0), 'valley_dawn'), fx('dust', col='#f6d8a0', n=40)],
    cam=pan(600, 1000, 460, 1.18), amb='wind', tin='fade', min=10),
  S('d_dry', 'mystery', [
      ln('VYASA', 'Then one morning, the Ganga stopped flowing.', 'फिर एक सुबह, गंगा बहना बंद हो गई।')],
    [sh(bg(set='river', tod='day', hz=470), 'river_damsky'), sh(piece('dam', 'arrowDam', y=640), 'arrow_dam')],
    cam=[[800, 700, 1.6], [800, 560, 1.2]], amb='wind', sfx=[dict(n='rumble', at=0.5, v=0.5)], min=7),
  S('d_dam', 'tension', [
      ln('VYASA', 'Her bed lay bare. Fish gasped in the mud. And upstream, the whole mighty river was held back by a wall of arrows.',
                  'उसकी तलहटी सूखी पड़ी थी। मछलियाँ कीचड़ में तड़प रही थीं। और ऊपर, पूरी विशाल नदी बाणों की एक दीवार से रुकी हुई थी।')],
    [sh(bg(set='river', tod='day', hz=470), 'river_damsky'), sh(piece('dam', 'arrowDam', y=640), 'arrow_dam'), fx('dust', col='#e8d8b0', n=50)],
    cam=pan(560, 1040, 520, 1.25, 500, 1.1), amb='wind'),
  S('d_boy', 'heroic', [
      ln('VYASA', 'On the bank stood a boy, a bow in his hands, playing with the strength of a river as other boys play with a ball.',
                  'तट पर एक बालक खड़ा था, हाथों में धनुष लिए, नदी की शक्ति से ऐसे खेलता जैसे दूसरे बच्चे गेंद से खेलते हैं।')],
    [sh(bg(set='river', tod='day', hz=470), 'river_damsky'), sh(piece('dam', 'arrowDam', y=640), 'arrow_dam'),
     figs('archer', [fig('boy', 360, 900, 420, 1, 'draw', weapon='bowDrawn')], rim=RIM_GOLD)],
    cam=[[700, 520, 1.15], [520, 560, 1.35]], amb='wind', sfx=[dict(n='whoosh', at=2.0, v=0.5)]),
  S('d_boyface', 'heroic', [
      ln('SHANTANU', 'Who are you, child, that even the Ganga obeys you?', 'तुम कौन हो, बालक, कि गंगा भी तुम्हारी बात मानती है?')],
    [sh(bg(set='river', tod='day', hz=470), 'river_damsky'), face('boy', 800, 430, 200, 1, 'stern', rim=RIM_GOLD)],
    cam=push(800, 440, 1.04, 1.14), amb='wind'),
  S('d_rise', 'divine', [
      ln('VYASA', 'The waters parted, and Ganga rose from them, holding the boy\'s hand.', 'जल फटा, और गंगा उसमें से प्रकट हुईं, बालक का हाथ थामे।')],
    [sh(bg(set='river', tod='day', hz=520, reeds=1, lotus=10), 'river_day2'),
     figs('rise', [dict(who='ganga', x=900, y=880, S=520, f=-1), fig('boy', 680, 880, 380, 1, 'stand')], rim=RIM_COOL, glow=['#bfe6ff', 24, 0.3],
          mv=dict(dy=[220, 0], t=[0, 3.2])),
     fx('sparkle', y0=600, y1=900, n=90, col='#dff4ff'), fx('ripples', x=800, y=840, n=6)],
    cam=push(800, 470, 1.0, 1.1), amb='river', sfx=[dict(n='splash', at=0.3, v=0.6), dict(n='swell', at=0.6, v=0.5)]),
  S('d_teach', 'heroic', [
      ln('GANGA', 'This is your son, Devavrata. The sage Vasishtha taught him the Vedas. Shukra and Brihaspati, the teachers of demons and gods, taught him the art of kings.',
                  'यह तुम्हारा पुत्र है, देवव्रत। महर्षि वसिष्ठ ने इसे वेद पढ़ाए। असुरों और देवताओं के गुरु, शुक्र और बृहस्पति ने इसे राजनीति सिखाई।', fx='divine')],
    [sh(bg(set='river', tod='day', hz=520, reeds=1, lotus=10), 'river_day2'), face('ganga', 1040, 430, 180, -1, 'smile', rim=RIM_COOL, glow=['#9fd8ff', 30, 0.35])],
    cam=push(1020, 450, 1.04, 1.12), amb='river'),
  S('d_vedas', 'forest', [
      ln('VYASA', 'In a forest hermitage, the boy had sat at the feet of Vasishtha, the very sage whose cow he once stole, and learned the Vedas.',
                  'वन के एक आश्रम में, वह बालक वसिष्ठ के चरणों में बैठा था, उन्हीं ऋषि के, जिनकी गाय उसने कभी चुराई थी, और उसने वेद सीखे।')],
    [sh(bg(set='ashram', tod='day', cow=[1050, 860, 260, -1]), 'ashram_day'), figs('study', [fig('vasishtha', 560, 880, 420, 1, 'bless'), fig('boy', 780, 880, 300, -1, 'dice')], rim=RIM_GOLD), fx('dust', col='#fff0c0', n=40)],
    cam=push(700, 480, 1.04, 1.18), amb='birds', sfx=[dict(n='bell', at=2.0, v=0.3)]),
  S('d_gurus', 'wonder', [
      ln('VYASA', 'In the heavens, Brihaspati, teacher of the gods, and Shukra, teacher of the demons, taught him how kingdoms are ruled, and how they fall.',
                  'स्वर्ग में, देवताओं के गुरु बृहस्पति, और असुरों के गुरु शुक्र ने उसे सिखाया कि राज्य कैसे चलते हैं, और कैसे गिरते हैं।')],
    [sh(bg(set='sky_realm', peak=1240), 'realm'), figs('gurus', [fig('vasishtha', 400, 820, 320, 1, 'bless', style=dict(dhoti='#f0c040')), fig('drona', 1200, 820, 320, -1, 'bless', style=dict(dhoti='#7a3a6a')), fig('boy', 800, 820, 240, 1, 'stand')], glow=['#fff0b0', 20, 0.25])],
    cam=pan(700, 900, 470, 1.1), amb='wind'),
  S('d_parashu', 'battle', [
      ln('GANGA', 'And Parashurama himself, who once cut down the warrior kings of the earth twenty one times, taught him the bow.',
                  'और स्वयं परशुराम ने, जिन्होंने इक्कीस बार पृथ्वी के क्षत्रियों का संहार किया था, इसे धनुर्विद्या सिखाई।', fx='divine')],
    [bg(set='sky', tod='crimson', hz=740, hills=1), face('parashurama', 800, 430, 200, 1, 'stern', rim=RIM_FIRE), fx('embers', n=70)],
    cam=push(800, 440, 1.0, 1.12), amb='wind', sfx=[dict(n='clash', at=1.0, v=0.5)], hero=1,
    name=name('PARASHURAMA', 'परशुराम', 'the warrior sage', 'योद्धा ऋषि', -1)),
  S('d_train', 'battle', [
      ln('VYASA', 'In a forest clearing, the old master and the boy had fought for days, arrow against arrow, until the student could match the teacher.',
                  'वन के एक मैदान में, वृद्ध गुरु और बालक दिनों तक लड़ते रहे, बाण पर बाण, जब तक शिष्य गुरु की बराबरी न करने लगा।')],
    [sh(bg(set='valley', tod='dusk', hz=450, seed=2.1), 'valley_dusk'), figs('duelists', [fig('parashurama', 340, 840, 300, 1, 'draw', weapon='bowDrawn'), fig('boy', 1260, 840, 260, -1, 'draw', weapon='bowDrawn')]),
     piece('arrows', 'duel', k='anim', every=2, add=True, xL=380, xR=1220, y=840, s=280)],
    cam=pan(700, 900, 500, 1.1), amb='wind', sfx=[dict(n='whoosh', at=1.0, v=0.4), dict(n='whoosh', at=3.0, v=0.4), dict(n='clash', at=4.5, v=0.4)]),
  S('d_know', 'mystery', [
      ln('VYASA', 'The king did not know him. The last time he had seen this face, it was a newborn\'s, vanishing into the river.',
                  'राजा ने उसे नहीं पहचाना। पिछली बार जब उन्होंने यह चेहरा देखा था, वह एक नवजात का था, नदी में ओझल होता हुआ।')],
    [sh(bg(set='river', tod='day', hz=520, reeds=1, lotus=10), 'river_day2'), face('shantanu', 600, 440, 180, 1, 'awe', n='king', rim=RIM_GOLD)],
    cam=push(620, 450, 1.04, 1.14), amb='river'),
  S('d_embrace', 'joy', [
      ln('VYASA', 'Ganga gave the boy to his father, and returned to her waters. For the first time in sixteen years, Shantanu wept for joy.',
                  'गंगा ने बालक को उसके पिता को सौंपा, और अपनी धारा में लौट गईं। सोलह वर्षों में पहली बार, शांतनु आनंद से रोए।')],
    [sh(bg(set='river', tod='gold', hz=520, reeds=1), 'river_gold'), figs('embrace', [fig('shantanu', 700, 880, 520, 1, 'bless'), fig('boy', 900, 880, 380, -1, 'stand')], rim=RIM_GOLD),
     fx('sparkle', y0=600, y1=900, n=50)],
    cam=push(800, 470, 1.04, 1.14), amb='river'),
  S('d_home', 'heroic', [
      ln('VYASA', 'He brought his son home to Hastinapura, and the whole city came out to greet the prince.',
                  'वे अपने पुत्र को हस्तिनापुर ले आए, और पूरा नगर राजकुमार के स्वागत को उमड़ पड़ा।')],
    [sh(bg(set='city', tod='gold', ghats=1), 'city_gold'), piece('proc2', 'procession', k='anim', every=3, y=850, s=120, x0=-400, cnt=13, speed=45), fx('petals', every=2, n=80)],
    cam=pan(700, 900, 480, 1.1), amb='crowd', sfx=[dict(n='conch', at=0.5, v=0.5), dict(n='cheer', at=2.0, v=0.6), dict(n='nagara', at=1.0, v=0.5)]),
  S('d_heir', 'heroic', [
      ln('VYASA', 'He was crowned heir to the throne. A scholar, a warrior, and a prince without equal.',
                  'उन्हें युवराज घोषित किया गया। विद्वान भी, योद्धा भी, एक अद्वितीय राजकुमार।')],
    [bg(set='palace', tod='gold', x=360, w=880, h=560), face('devavrata', 1020, 430, 200, -1, 'stern', rim=RIM_GOLD), fx('dust', col='#f0c070', n=60)],
    cam=push(980, 450, 1.0, 1.12), amb='wind', hero=1, name=name('DEVAVRATA', 'देवव्रत', 'son of Ganga', 'गंगापुत्र', -1)),
  S('d_cave', 'krishna', [
      ln('GANESHA', 'A boy who can stop the Ganga. What could stand against such a man?', 'एक बालक जो गंगा को रोक सके। ऐसे मनुष्य के सामने क्या टिक सकता है?'),
      ln('VYASAC', 'Nothing outside him, scribe. Only what is inside. Strength is the easy part. Wait until you see what he does with it.',
                   'बाहर कुछ नहीं, लेखक। केवल जो उसके भीतर है। शक्ति तो आसान है। देखना, वह उसका क्या करता है।', gap=0.7)],
    CAVE(), cam=CAVE_CAM['two'], amb='night'),
  S('d_court', 'court', [
      ln('VYASA', 'For four years the kingdom had never been safer, nor its king happier.', 'चार वर्षों तक राज्य कभी इतना सुरक्षित नहीं रहा, न ही उसका राजा इतना प्रसन्न।')],
    [sh(bg(set='court', tone='#5a1a16', throne=[800, 660, 240], canopy=1), 'court_red'),
     figs('courtfig', [fig('shantanu', 800, 820, 360, 1, 'bless'), fig('devavrata', 1100, 880, 440, -1, 'spear', weapon='spear'), fig('courtier', 420, 880, 400, 1, 'stand'), fig('courtier', 280, 880, 380, 1, 'stand', style=dict(dhoti='#2f6f9a'))])],
    cam=[[800, 450, 1.0], [800, 470, 1.08]], amb='court'),

  # ---------- PART FOUR: Satyavati and the terrible vow ----------
  S('e_yamuna', 'love', [
      ln('VYASA', 'Then one evening, by the Yamuna, a fragrance drifted across the water, sweet as a thousand flowers.',
                  'फिर एक संध्या, यमुना के किनारे, जल के पार एक सुगंध तैर आई, हज़ार फूलों जैसी मधुर।', at=1.5)],
    [sh(bg(set='lake', tod='dusk', lotus=14), 'yamuna_dusk'), piece('ferry', 'farBoat', k='anim', every=3, x=520, y=700, s=90, speed=20), fx('fireflies', n=50)],
    cam=pan(600, 900, 480, 1.15), amb='river', tin='fade', min=10),
  S('e_satya', 'love', [
      ln('VYASA', 'It came from a ferry girl named Satyavati. They called her Yojanagandha: her scent could be felt from miles away.',
                  'वह सत्यवती नाम की एक नाविक कन्या से आ रही थी। लोग उसे योजनगंधा कहते थे: उसकी सुगंध कोसों दूर तक आती थी।')],
    [sh(bg(set='lake', tod='dusk', lotus=14), 'yamuna_dusk'), piece('boat', 'boat', d=0.9, x=760, y=700, s=1.0), face('satyavati', 1120, 430, 165, -1, 'calm'),
     fx('petals', every=2, n=40)],
    cam=push(900, 460, 1.0, 1.1), amb='river', hero=1, name=name('SATYAVATI', 'सत्यवती', 'the ferry girl', 'नाविक कन्या', -1)),
  S('e_fish', 'mystery', [
      ln('VYASA', 'They said she had been found as a baby inside a great fish, and raised by the chief of the fishermen as his own. She ferried travellers across the river.',
                  'कहते हैं वह एक विशाल मछली के भीतर शिशु रूप में मिली थी, और निषादों के मुखिया ने उसे अपनी बेटी की तरह पाला। वह यात्रियों को नदी पार कराती थी।')],
    [sh(bg(set='lake', tod='dusk', lotus=14), 'yamuna_dusk'), piece('ferry2', 'farBoat', k='anim', every=3, x=900, y=720, s=110, speed=-15), fx('ripples', x=900, y=760, n=5)],
    cam=pan(1000, 800, 500, 1.3), amb='river'),
  S('e_reveal', 'mystery', [
      ln('GANESHA', 'Muni, your hand is trembling. Satyavati, the ferry girl... you knew her?', 'मुनिवर, आपका हाथ काँप रहा है। सत्यवती, वह नाविक कन्या... आप उसे जानते थे?'),
      ln('VYASAC', 'She was my mother, scribe. Before she was a queen, a sage named Parashara crossed the river in her boat. I was born on an island in the Yamuna. That is why they call me Dvaipayana, the island-born. I too am in this story.',
                   'वह मेरी माँ थीं, लेखक। रानी बनने से पहले, पराशर नाम के एक ऋषि ने उनकी नाव में नदी पार की थी। मेरा जन्म यमुना के एक द्वीप पर हुआ। इसीलिए मुझे द्वैपायन कहते हैं, द्वीप में जन्मा। मैं भी इस कथा में हूँ।', gap=0.8)],
    CAVE_V('sorrow'), cam=push(700, 440, 1.0, 1.12), amb='night'),
  S('e_island', 'river', [], [sh(bg(set='valley', tod='dusk', hz=450, seed=2.1), 'valley_dusk'), fx('fireflies', n=40)],
    cam=[[900, 520, 1.6], [900, 480, 1.3]], amb='river', min=6),
  S('e_satyaspeak', 'love', [
      ln('SATYAVATI', 'I am the daughter of the fisher chief, king. If you want my hand, you must ask my father.',
                      'मैं निषादराज की बेटी हूँ, राजन। यदि मेरा हाथ चाहते हैं, तो मेरे पिता से माँगिए।')],
    [sh(bg(set='lake', tod='dusk', lotus=14), 'yamuna_dusk'), face('satyavati', 1040, 430, 180, -1, 'smile')],
    cam=push(1020, 450, 1.04, 1.12), amb='river'),
  S('e_king', 'love', [
      ln('VYASA', 'And the old king lost his heart a second time.', 'और वृद्ध राजा ने दूसरी बार अपना हृदय हार दिया।')],
    [sh(bg(set='lake', tod='dusk', lotus=14), 'yamuna_dusk'), face('shantanu', 600, 440, 180, 1, 'awe', n='king', rim=RIM_GOLD)],
    cam=push(620, 450, 1.04, 1.12), amb='river'),
  S('e_chief', 'tension', [
      ln('DASHRAJ', 'My daughter will marry you, king, gladly. But only if her son becomes king after you.',
                    'मेरी बेटी आपसे विवाह करेगी, राजन, प्रसन्नता से। पर तभी, जब उसका पुत्र आपके बाद राजा बने।')],
    [bg(set='forest', tod='dusk', hut=1150), face('dashraj', 600, 440, 180, 1, 'calm', rim=RIM_FIRE)],
    cam=push(620, 450, 1.0, 1.1), amb='river', hero=1, name=name('DASHRAJ', 'दाशराज', 'chief of the fishermen', 'निषादों के मुखिया', 1)),
  S('e_cannot', 'sorrow', [
      ln('SHANTANU', 'I cannot. The throne belongs to Devavrata. I will not take it from my son.',
                     'यह नहीं हो सकता। सिंहासन देवव्रत का है। मैं उसे अपने पुत्र से नहीं छीनूँगा।')],
    [bg(set='forest', tod='dusk', hut=1150), face('shantanu', 1000, 440, 180, -1, 'sorrow', rim=RIM_FIRE)],
    cam=push(980, 450, 1.04, 1.12), amb='river'),
  S('e_grief', 'sorrow', [
      ln('VYASA', 'He went home and spoke of it to no one. He stopped eating. He stopped sleeping. The king was wasting away, and no one knew why.',
                  'वे घर लौटे और किसी से कुछ न कहा। उन्होंने खाना छोड़ दिया। सोना छोड़ दिया। राजा घुलते जा रहे थे, और कोई नहीं जानता था क्यों।')],
    [bg(set='chamber', tone='#20101a', moon=1), face('shantanu', 700, 450, 190, 1, 'sorrow', rim=['#ffb060', 3, -2, 0.5])],
    cam=push(720, 460, 1.04, 1.16), amb='night'),
  S('e_asks', 'tension', [
      ln('DEVA', 'Tell me the truth. What grief is killing my father?', 'सच बताओ। कौन सा दुःख मेरे पिता को खा रहा है?'),
      ln('CHARIOT', 'Prince, by the Yamuna he met a fisherman\'s daughter. Her father asked a price the king would not pay. Your crown.',
                    'राजकुमार, यमुना के किनारे वे एक मछुआरे की बेटी से मिले। उसके पिता ने ऐसा मूल्य माँगा जो राजा नहीं चुकाएँगे। आपका मुकुट।', gap=0.6)],
    [sh(bg(set='palace', tod='night', x=360, w=880, h=560), 'palace_night'), figs('ask', [fig('devavrata', 520, 880, 520, 1, 'stand'), fig('charioteer', 1100, 880, 480, -1, 'bowLow')], rim=['#ffb060', 3, -2, 0.5])],
    cam=[[800, 470, 1.1], [800, 460, 1.18]], amb='night'),
  S('e_ride', 'march', [
      ln('VYASA', 'Devavrata did not ask his father. He called the elders of the court, and rode to the Yamuna himself.',
                  'देवव्रत ने पिता से कुछ नहीं पूछा। उन्होंने दरबार के वृद्धजनों को बुलाया, और स्वयं यमुना की ओर चल पड़े।')],
    [sh(bg(set='valley', tod='dusk', hz=450, seed=2.1), 'valley_dusk'), piece('riders2', 'riders', k='anim', every=2, x=-100, y=820, s=150, cnt=3, speed=90)],
    cam=pan(600, 1000, 470, 1.15), amb='wind', sfx=[dict(n='hooves', at=0.2, v=0.7), dict(n='hooves', at=3.0, v=0.6)]),
  S('e_offer', 'tension', [
      ln('DEVA', 'Give your daughter to my father. I give up my claim to the throne. Her son will be king.',
                 'अपनी बेटी मेरे पिता को दे दो। मैं सिंहासन पर अपना अधिकार छोड़ता हूँ। उसका पुत्र राजा बनेगा।')],
    [bg(set='forest', tod='dusk', hut=1150), face('devavrata', 540, 440, 180, 1, 'stern', rim=RIM_FIRE)],
    cam=push(560, 450, 1.04, 1.12), amb='river'),
  S('e_doubt', 'tension', [
      ln('DASHRAJ', 'You are noble, prince. But you will have sons one day. Will they give it up too? Sons fight for thrones.',
                    'आप महान हैं, राजकुमार। पर एक दिन आपके भी पुत्र होंगे। क्या वे भी त्याग देंगे? पुत्र सिंहासनों के लिए लड़ते हैं।')],
    [bg(set='forest', tod='dusk', hut=1150), face('dashraj', 1040, 440, 180, -1, 'calm', rim=RIM_FIRE)],
    cam=push(1020, 450, 1.04, 1.12), amb='river'),
  S('e_elders', 'tension', [
      ln('VYASA', 'The elders of Hastinapura held their breath. The prince had already given up a crown. What more could he give?',
                  'हस्तिनापुर के वृद्धजनों की साँस थम गई। राजकुमार एक मुकुट तो त्याग ही चुके थे। अब और क्या दे सकते थे?')],
    [bg(set='forest', tod='dusk', hut=1150), figs('elders', [fig('vidura', 300, 880, 420, 1, 'stand', style=dict(dhoti='#e8dcc0')), fig('drona', 520, 880, 440, 1, 'stand'), fig('fisher', 1220, 880, 440, -1, 'stand')], rim=RIM_FIRE)],
    cam=pan(650, 950, 470, 1.15), amb='wind', sfx=[dict(n='heartbeat', at=1.0, v=0.4)]),
  S('e_silence', 'storm', [], [bg(set='sky', tod='storm', hz=720, ground='#1a2030'), face('devavrata', 800, 430, 210, 1, 'stern', rim=['#dfefff', -3, -2, 0.7]),
     fx('flash', every=1, at=[3.2], bolt=1100)],
    cam=[[800, 440, 1.3], [800, 430, 1.1]], amb='storm', sfx=[dict(n='heartbeat', at=0.2, v=0.6), dict(n='thunder', at=3.2, v=0.7)], min=5),
  S('e_vow', 'storm', [
      ln('DEVA', 'Hear me, earth and sky, and all the gods! I give up the throne. And I will never marry. I will never have a son. So long as I live, I will serve whoever sits on the throne of Hastinapura.',
                 'सुनो, धरती और आकाश, और सब देवता! मैं सिंहासन का त्याग करता हूँ। और मैं आजीवन विवाह नहीं करूँगा। मेरी कोई संतान नहीं होगी। जब तक मैं जीवित हूँ, हस्तिनापुर के सिंहासन पर जो भी बैठे, मैं उसकी सेवा करूँगा।', fx='elder')],
    [sh(bg(set='sky', tod='storm', hz=720, ground='#1a2030'), 'storm_sky2'), figs('hero', [fig('devavrata', 800, 900, 620, 1, 'vow')], rim=['#dfefff', -3, -2, 0.8], glow=['#a0c0ff', 18, 0.25]),
     fx('flash', every=1, at=[1.2, 7.0, 12.0], bolt=1100), fx('rain', n=180)],
    cam=[[800, 500, 1.1], [800, 440, 1.0]], amb='storm', sfx=[dict(n='thunder', at=1.2), dict(n='thunder', at=7.0, v=0.9), dict(n='thunder', at=12.0, v=0.9)], shake=[[7.0, 8.5]]),
  S('e_wide', 'storm', [], [sh(bg(set='sky', tod='storm', hz=720, ground='#1a2030'), 'storm_sky2'),
     figs('herosmall', [fig('devavrata', 800, 860, 200, 1, 'vow')], rim=['#dfefff', -3, -2, 0.8]), fx('flash', every=1, at=[0.8], bolt=900), fx('rain', n=180)],
    cam=[[800, 600, 1.4], [800, 450, 1.0]], amb='storm', sfx=[dict(n='thunder', at=0.8)], min=6),
  S('e_flowers', 'divine', [
      ln('VYASA', 'The storm broke. The heavens rained flowers. And the gods cried out with one voice:', 'आँधी थम गई। आकाश से पुष्प बरसे। और देवताओं ने एक स्वर में कहा:'),
      ln('GODS', 'Bhishma! Bhishma! He of the terrible vow!', 'भीष्म! भीष्म! भीषण प्रतिज्ञा करने वाला!', fx='chorus', gap=0.5)],
    [sh(bg(set='sky', tod='gold', hz=740, hills=1), 'gold_sky'), fx('rays', x=800, y=120, r0=60, r1=1000, col='#fff0c0', n='fx_rays'), fx('petals', every=2, n=130)],
    cam=[[800, 300, 1.3], [800, 420, 1.0]], amb='temple', sfx=[dict(n='bells', at=0.3), dict(n='conch', at=5.0, v=0.6)]),
  S('e_bhishma', 'divine', [
      ln('VYASA', 'From that day, Devavrata was known by a new name. Bhishma.', 'उस दिन से, देवव्रत एक नए नाम से जाने गए। भीष्म।')],
    [sh(bg(set='sky', tod='gold', hz=740, hills=1), 'gold_sky'), fx('rays', x=800, y=120, r0=60, r1=1000, col='#fff0c0', n='fx_rays'), face('bhishma', 800, 450, 200, 1, 'stern', rim=RIM_GOLD, glow=['#ffe0a0', 30, 0.3]),
     fx('petals', every=2, n=110)],
    cam=push(800, 450, 1.0, 1.12), amb='temple', sfx=[dict(n='bells', at=0.4), dict(n='sparkle', at=1.0)], hero=1,
    name=name('BHISHMA', 'भीष्म', 'he of the terrible vow', 'भीषण प्रतिज्ञा वाले', 1)),
  S('e_stopped', 'krishna', [
      ln('VYASA', 'And in the cave, for the first time that night, the pen stopped.', 'और गुफ़ा में, उस रात पहली बार, लेखनी रुक गई।'),
      ln('GANESHA', 'Forgive me, Muni. I stopped. I broke my own condition.', 'क्षमा करें, मुनिवर। मैं रुक गया। मैंने अपनी ही शर्त तोड़ दी।', gap=1.4),
      ln('VYASAC', 'Even a god must stop for a vow like that, scribe. Write on.', 'ऐसी प्रतिज्ञा पर देवता को भी रुकना पड़ता है, लेखक। लिखते रहो।', gap=0.8)],
    CAVE_G(), cam=[[820, 330, 1.4], [820, 360, 1.2]], amb='night', min=14),
  S('e_mother', 'love', [
      ln('DEVA', 'Come, mother. Your chariot is waiting. Hastinapura is waiting for its queen.', 'चलिए, माता। आपका रथ प्रतीक्षा कर रहा है। हस्तिनापुर अपनी रानी की प्रतीक्षा कर रहा है।'),
      ln('VYASA', 'He called her mother. She was younger than he was.', 'उन्होंने उन्हें माता कहा। वे उनसे आयु में छोटी थीं।', gap=0.8)],
    [sh(bg(set='lake', tod='dusk', lotus=14), 'yamuna_dusk'), figs('escort', [fig('bhishma', 560, 880, 520, 1, 'bowLow'), dict(who='satyavati', x=980, y=880, S=500, f=-1)], rim=RIM_GOLD)],
    cam=push(780, 470, 1.04, 1.12), amb='river'),
  S('e_bride', 'joy', [
      ln('VYASA', 'He carried Satyavati home to his father on his own chariot.', 'वे स्वयं अपने रथ पर सत्यवती को पिता के पास ले आए।')],
    [sh(bg(set='valley', tod='gold', hz=480, city=[1250, 300], seed=0.6), 'valley_gold'), piece('proc3', 'procession', k='anim', every=3, y=800, s=110, x0=-300, cnt=9, speed=40)],
    cam=pan(800, 1000, 470, 1.15), amb='crowd', sfx=[dict(n='nagara', at=0.5, v=0.5)]),
  S('e_father', 'sorrow', [
      ln('SHANTANU', 'My son, what have you done? You gave away your whole life for my happiness.',
                     'मेरे पुत्र, यह तुमने क्या किया? मेरी प्रसन्नता के लिए तुमने अपना पूरा जीवन दे दिया।')],
    [sh(bg(set='court', tone='#5a1a16', throne=[800, 660, 240], canopy=1), 'court_red'), face('shantanu', 560, 440, 180, 1, 'sorrow', n='king', rim=RIM_GOLD)],
    cam=push(580, 450, 1.04, 1.12), amb='court'),
  S('e_boon', 'divine', [
      ln('SHANTANU', 'Then take this from me. Death itself will not touch you, until the day you choose it.',
                     'तो मुझसे यह वरदान लो। मृत्यु भी तुम्हें तब तक नहीं छुएगी, जब तक तुम स्वयं उसे न चुनो।', fx='elder')],
    [sh(bg(set='court', tone='#5a1a16', throne=[800, 660, 240], canopy=1), 'court_red'), figs('bow', [fig('shantanu', 620, 880, 520, 1, 'bless'), fig('bhishma', 1000, 880, 500, -1, 'bowLow')], rim=RIM_GOLD),
     fx('glow', x=1000, y=520, r=260, col='#ffe0a0')],
    cam=push(800, 460, 1.0, 1.1), amb='court', sfx=[dict(n='swell', at=1.0, v=0.4), dict(n='bell', at=4.0, v=0.4)]),
  S('e_wedding', 'joy', [
      ln('VYASA', 'Shantanu married Satyavati. She bore him two sons, Chitrangada and Vichitravirya, and for a while the old king was young again.',
                  'शांतनु ने सत्यवती से विवाह किया। उन्होंने दो पुत्रों को जन्म दिया, चित्रांगद और विचित्रवीर्य, और कुछ समय तक वृद्ध राजा फिर से युवा हो गए।')],
    [sh(bg(set='court', tone='#5a1a16', throne=[800, 660, 240], canopy=1), 'court_red'),
     figs('family', [fig('shantanu', 560, 880, 480, 1, 'bless'), dict(who='satyavati', x=820, y=880, S=460, f=-1), fig('boy', 1030, 880, 280, -1, 'stand'), fig('boy', 1180, 880, 240, -1, 'stand', style=dict(dhoti='#c7362b'))], rim=RIM_GOLD),
     fx('petals', every=2, n=60)],
    cam=push(800, 470, 1.04, 1.12), amb='court', sfx=[dict(n='bells', at=0.5, v=0.5)]),
  S('e_pyre', 'lament', [
      ln('VYASA', 'But time takes every king. Shantanu died, and his sons were still children. On the bank of the Ganga, where it had all begun, Bhishma lit his father\'s pyre.',
                  'पर समय हर राजा को ले जाता है। शांतनु चल बसे, और उनके पुत्र अभी बालक ही थे। गंगा के उसी तट पर, जहाँ सब शुरू हुआ था, भीष्म ने पिता की चिता को अग्नि दी।')],
    [sh(bg(set='river', tod='dusk', hz=560, reeds=1), 'river_dusk'), fx('fire', at=[[900, 820, 260, 300]]), figs('mourn', [fig('bhishma', 560, 880, 460, 1, 'despair')], rim=RIM_FIRE), fx('embers', n=60)],
    cam=push(760, 480, 1.04, 1.14), amb='river', sfx=[dict(n='fire', at=0.5, v=0.6)]),
  S('e_regent', 'march', [
      ln('VYASA', 'He would not take the crown, even now. He placed the boy Chitrangada on the throne, stood behind it, and kept his word.',
                  'उन्होंने अब भी मुकुट नहीं लिया। उन्होंने बालक चित्रांगद को सिंहासन पर बिठाया, उसके पीछे खड़े हुए, और अपना वचन निभाया।')],
    [sh(bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), 'court_dark'), figs('guard', [fig('boy', 800, 700, 260, 1, 'stand'), fig('bhishma', 1220, 880, 600, -1, 'spear', weapon='spear')], rim=RIM_GOLD),
     fx('dust', col='#f0b060', n=50)],
    cam=push(800, 450, 1.1, 1.0), amb='court'),
  S('e_end_city', 'title', [], [sh(bg(set='city', tod='dusk', ghats=1), 'city_dusk'), fx('fireflies', n=40)],
    cam=pan(1000, 700, 450, 1.15), amb='river', min=7),
  S('e_ask', 'krishna', [
      ln('GANESHA', 'He gave up a throne, a wife, sons, all for his father\'s happiness. Surely that is dharma.',
                    'उन्होंने सिंहासन, पत्नी, पुत्र, सब कुछ पिता की प्रसन्नता के लिए त्याग दिया। निश्चय ही यह धर्म है।')],
    CAVE_G(), cam=push(820, 430, 1.0, 1.08), amb='night'),
  S('e_answer', 'mystery', [
      ln('VYASAC', 'It is love, scribe. Whether it is dharma, this story will take eighteen books to answer. That vow will bind him to a throne he can never sit on. And one day, it will bind him to the wrong side of a war.',
                   'यह प्रेम है, लेखक। यह धर्म है या नहीं, इसका उत्तर देने में इस कथा को अठारह पर्व लगेंगे। यह प्रतिज्ञा उन्हें उस सिंहासन से बाँध देगी जिस पर वे कभी नहीं बैठ सकते। और एक दिन, यही उन्हें एक युद्ध के ग़लत पक्ष से बाँध देगी।')],
    CAVE_V('sorrow'), cam=push(700, 440, 1.0, 1.12), amb='night'),
  S('e_teaser', 'tension', [
      ln('VYASA', 'Chitrangada would die young, in a duel with a gandharva. The second son would be too weak to win a bride. And so one day Bhishma would ride to a swayamvar in Kashi, and carry off three princesses by force.',
                  'चित्रांगद युवावस्था में ही एक गंधर्व से युद्ध में मारे जाएँगे। दूसरा पुत्र इतना दुर्बल होगा कि वधू न जीत सके। और इसलिए एक दिन भीष्म काशी के स्वयंवर में जाएँगे, और तीन राजकुमारियों को बलपूर्वक हर लाएँगे।')],
    [sh(bg(set='valley', tod='dusk', hz=450, seed=2.1), 'valley_dusk'), piece('riders3', 'riders', k='anim', every=2, x=1500, y=820, s=150, cnt=1, speed=-80, f=-1)],
    cam=pan(1000, 600, 470, 1.15), amb='wind', sfx=[dict(n='hooves', at=0.5, v=0.6)]),
  S('e_next', 'river', [
      ln('VYASAC', 'Rest your hand. Tomorrow, a princess who swears revenge on Bhishma, and a king born blind.',
                   'अब हाथ को विश्राम दो। कल, एक राजकुमारी जो भीष्म से प्रतिशोध की शपथ लेती है, और एक राजा जो जन्म से अंधा है।'),
      ln('GANESHA', 'My pen is ready, Muni.', 'मेरी लेखनी तैयार है, मुनिवर।', gap=0.8)],
    CAVE('night'), cam=[[800, 520, 1.3], [800, 450, 1.0]], amb='night', tout='fade', min=12),
])

# ---------------------------------------------------------------- voices ---
CAST = copy.deepcopy(BASE_CAST)
CAST['en'].update({
    'VYASA': dict(voice='bm_george:2+bm_fable:1', speed=0.88, pitch=-2.5, fx='storyteller'),
    'CHANT': dict(voice='hm_omega', speed=0.82, pitch=-2.5, fx='cave', text_lang='hi'),
    'BRAHMA': dict(voice='am_onyx:2+bm_george:1', speed=0.84, pitch=-3.5, fx='divine_big'),
    'PRATIPA': dict(voice='bm_daniel:2+bm_fable:1', speed=0.86, pitch=-2.5, fx='elder'),
    'SATYAVATI': dict(voice='af_heart:2+af_sky:1', speed=0.95, pitch=0),
    'VYASAC': dict(voice='bm_george:2+bm_fable:1', speed=0.88, pitch=-2.5, fx='cave'),
    'GANESHA': dict(voice='am_michael:2+am_puck:1', speed=0.94, pitch=-1.5, fx='cave'),
    'VASISHTHA': dict(voice='bm_fable:2+bm_daniel:1', speed=0.86, pitch=-3),
    'VASU': dict(voice='am_liam:2+am_eric:1', speed=0.95, pitch=0.5),
    'WIFE': dict(voice='af_bella:2+af_nicole:1', speed=0.95, pitch=0, fx='divine'),
    'DASHRAJ': dict(voice='am_santa:2+bm_lewis:1', speed=0.92, pitch=-1),
    'CHARIOT': dict(voice='bm_lewis', speed=0.95, pitch=0),
    'GODS': dict(voice='am_onyx:2+bm_george:1', speed=0.86, pitch=-2, fx='chorus'),
    'PARASHU': dict(voice='am_fenrir:2+bm_daniel:1', speed=0.88, pitch=-2, fx='growl'),
})
CAST['hi'].update({
    'VYASA': dict(voice='hm_omega', speed=0.86, pitch=-2.0, fx='storyteller'),
    'CHANT': dict(voice='hm_omega', speed=0.82, pitch=-2.5, fx='cave'),
    'BRAHMA': dict(voice='hm_omega:2+am_onyx:1', speed=0.82, pitch=-4, fx='divine_big'),
    'PRATIPA': dict(voice='hm_omega:2+bm_daniel:1', speed=0.84, pitch=-3, fx='elder'),
    'SATYAVATI': dict(voice='hf_alpha:2+af_heart:1', speed=0.95, pitch=0),
    'VYASAC': dict(voice='hm_omega', speed=0.86, pitch=-2.0, fx='cave'),
    'GANESHA': dict(voice='hm_psi:2+am_puck:1', speed=0.92, pitch=-1.5, fx='cave'),
    'VASISHTHA': dict(voice='hm_omega:2+bm_fable:1', speed=0.84, pitch=-3.5),
    'VASU': dict(voice='hm_psi:2+am_liam:1', speed=0.95, pitch=1.0),
    'WIFE': dict(voice='hf_alpha:2+af_bella:1', speed=0.95, pitch=0, fx='divine'),
    'DASHRAJ': dict(voice='hm_omega:2+am_santa:1', speed=0.92, pitch=-0.5),
    'CHARIOT': dict(voice='hm_psi:2+bm_lewis:1', speed=0.95, pitch=0),
    'GODS': dict(voice='hm_omega:2+am_onyx:1', speed=0.84, pitch=-2.5, fx='chorus'),
    'PARASHU': dict(voice='hm_omega:2+am_fenrir:1', speed=0.88, pitch=-2.5, fx='growl'),
})

SERIES = dict(title=dict(en='Mahabharata', hi='महाभारत'), subtitle=dict(en='Season 1', hi='पहला अध्याय'), fps=24, w=1280, h=720)

def tidy(ep):
    # hero intros: keep the face clear of its name card
    for s in ep['shots']:
        nm = s.get('name'); faces = [L for L in s['layers'] if 'portrait' in L]
        if nm and faces:
            side = nm.get('side', 1)
            for L in faces[:1]:
                L['portrait']['x'] = 540 if side > 0 else 1060; L['portrait']['f'] = 1 if side > 0 else -1
                L.pop('share', None)
            (a, b) = s['cam']; s['cam'] = [[800, a[1], a[2]], [800, b[1], b[2]]]
        for L in s['layers']:
            for g in L.get('figs', []):
                if g.get('S', 0) > 660 and g.get('y', 0) >= 850 and not g.get('rot'): g['S'] = 660
            # the 'n_' trick lets two fx layers of the same kind live in one shot
            if 'fx' in L and 'n_' in L['fx']: L['n'] = L['n'] + '_' + L['fx'].pop('n_')
    # shared layers: the first shot paints, the rest borrow
    first = {}
    for s in ep['shots']:
        for L in s['layers']:
            k = L.pop('share', None)
            if not k: continue
            if k in first: L['src'] = first[k]
            else: first[k] = f"{s['id']}_{L['n']}"
    # shot ids carry the episode, so plates of different episodes never collide
    for s in ep['shots']: s['id'] = f"{ep['id']}_{s['id']}"; s.setdefault('tail', 1.8)
    for s in ep['shots']:
        for L in s['layers']:
            if 'src' in L and not L['src'].startswith(ep['id']): L['src'] = f"{ep['id']}_{L['src']}"

if __name__ == '__main__':
    for ep in EPISODES:
        tidy(ep)
        out = dict(SERIES, **ep, cast=CAST)
        json.dump(out, open(os.path.join(HERE, ep['id'] + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        n_shots = len(ep['shots']); n_lines = sum(len(s['lines']) for s in ep['shots'])
        words = sum(len(l['en'].split()) for s in ep['shots'] for l in s['lines'])
        n_plates = sum(1 for s in ep['shots'] for L in s['layers'] if L['k'] == 'plate' and 'src' not in L)
        n_anim = sum(1 for s in ep['shots'] for L in s['layers'] if L['k'] == 'anim' and 'src' not in L)
        print(f"{ep['id']}: {n_shots} shots, {n_lines} lines, {words} words, {n_plates} plates, {n_anim} anim layers  {ep['title']['en']}")
