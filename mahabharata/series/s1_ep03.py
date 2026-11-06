# Season 1, Episode 3: the curse of Pandu, the births of the princes, Drona, Ekalavya and the tournament.
# Imported by season1.py, which passes in its helpers.

def build(EP, S, ln, bg, face, figs, fig, piece, fx, name, push, pan, hold, sh, CAVE, CAVE_V, CAVE_G, CAVE_CAM, RIM_GOLD, RIM_FIRE, RIM_COOL, RIM_LAMP):
  RIM_SUN = ['#ffe08a', -3, -2, 0.8]
  EP(3, 'The Princes and the Archer', 'राजकुमार और धनुर्धर', 'A cursed king, a hundred and five princes, and a teacher who asked too much.', 'एक शापित राजा, एक सौ पाँच राजकुमार, और एक गुरु जिसने बहुत अधिक माँगा।', [
  S('a_cave', 'mystery', [
      ln('VYASA', 'The third night. Snow had closed the passes below the cave, and the lamps burned low. Ganesha had filled a whole basket with leaves.',
                  'तीसरी रात। गुफा के नीचे के दर्रे बर्फ़ से बंद हो गए थे, और दीये मंद जल रहे थे। गणेश ने पत्तों से पूरी एक टोकरी भर दी थी।', at=5.0)],
    CAVE('night') + [fx('snow', n=60)], cam=[[800, 520, 1.3], [800, 470, 1.05]], amb='night', min=12, eptitle=1, tin='fade'),
  S('a_ask', 'krishna', [
      ln('GANESHA', 'Pandu was crowned, and the blind brother stood aside. A king with two queens and a full treasury. Where is the sorrow in that, Muni?',
                    'पांडु का राज्याभिषेक हुआ, और अंधे भाई एक ओर खड़े रहे। दो रानियों और भरे कोष वाला राजा। इसमें दुःख कहाँ है, मुनिवर?'),
      ln('VYASAC', 'Wait. It is coming on four hooves, through a forest.', 'रुको। वह चार खुरों पर आ रहा है, एक वन से होकर।', gap=0.8)],
    CAVE_G(), cam=push(820, 430, 1.0, 1.08), amb='night'),

  # ---------- Pandu the conqueror ----------
  S('b_march', 'march', [
      ln('VYASA', 'Pandu was a great archer. He rode out with the army of the Kurus and conquered the kingdoms of the east and the south, one after another.',
                  'पांडु एक महान धनुर्धर थे। वे कुरुओं की सेना लेकर निकले और पूर्व और दक्षिण के राज्यों को एक के बाद एक जीत लिया।', at=1.0)],
    [sh(bg(set='valley', tod='dawn', hz=470, city=[1200, 260], seed=0.0), 'valley_dawn'), piece('army', 'riders', k='anim', every=2, x=120, y=830, s=110, cnt=9, speed=70), fx('dust', col='#e0b070', n=60)],
    cam=pan(560, 1040, 470, 1.15), amb='wind', sfx=[dict(n='hooves', at=0.3, v=0.7), dict(n='conch', at=2.0, v=0.5)], min=10),
  S('b_wealth', 'heroic', [
      ln('VYASA', 'He came home with elephants and gold and the crowns of a dozen kings, and laid them at the feet of Bhishma and his blind brother.',
                  'वे हाथियों, सोने और दर्जन भर राजाओं के मुकुटों के साथ लौटे, और उन्हें भीष्म और अपने अंधे भाई के चरणों में रख दिया।')],
    [sh(bg(set='city', tod='gold', ghats=1), 'city_gold'), piece('proc', 'procession', k='anim', every=3, y=820, s=110, x0=-300, cnt=11, speed=40), fx('petals', every=2, n=60)],
    cam=pan(600, 1000, 450, 1.12), amb='crowd', sfx=[dict(n='nagara', at=0.4, v=0.5), dict(n='cheer', at=2.5, v=0.5)]),
  S('b_pandu', 'court', [
      ln('VYASA', 'And then, at the height of his glory, he did a strange thing. He handed the kingdom to Dhritarashtra to rule in his name, and went to live in the forest with his two queens.',
                  'और फिर, अपने यश के शिखर पर, उन्होंने एक विचित्र काम किया। उन्होंने राज्य धृतराष्ट्र को सौंप दिया कि वे उनके नाम से शासन करें, और अपनी दोनों रानियों के साथ वन में रहने चले गए।')],
    [sh(bg(set='court', tone='#4a1612', throne=[800, 660, 240], canopy=1), 'court_red2'), face('pandu', 1040, 440, 190, -1, 'calm', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.0, 1.12), amb='court', hero=1, name=name('PANDU', 'पांडु', 'the pale king', 'पांडु राजा', -1)),
  S('b_forest', 'forest', [
      ln('VYASA', 'He loved the hunt. He loved the deep sal forests on the slopes of the Himalaya, where the deer ran in herds and no one called him king.',
                  'उन्हें आखेट प्रिय था। उन्हें हिमालय की ढलानों के घने साल वन प्रिय थे, जहाँ हिरण झुंडों में दौड़ते थे और कोई उन्हें राजा नहीं कहता था।')],
    [sh(bg(set='forest', tod='day'), 'forest_day'), piece('herd', 'deer', at=[[480, 870, 240, 1], [720, 890, 270, 1], [960, 860, 210, -1], [1200, 880, 250, 1]]), fx('leaves', n=40)],
    cam=pan(1000, 640, 470, 1.15), amb='birds', min=10),
  S('b_himal', 'river', [], [sh(bg(set='himalaya'), 'himal_peaks'), fx('snow', n=40)],
    cam=[[800, 520, 1.25], [800, 460, 1.0]], amb='wind', min=6),

  # ---------- the curse of Kindama ----------
  S('c_deer', 'tension', [
      ln('VYASA', 'One evening he saw two deer in a clearing, a stag and his mate, lost in each other. He drew his bow, and shot.',
                  'एक संध्या उन्होंने एक खुले स्थान में दो हिरण देखे, एक मृग और उसकी संगिनी, एक दूसरे में खोए हुए। उन्होंने धनुष खींचा, और बाण चलाया।')],
    [sh(bg(set='forest', tod='dusk'), 'forest_dusk'), piece('pair', 'deer', at=[[900, 890, 320, 1], [1130, 900, 290, -1]]), figs('hunter', [fig('pandu', 320, 900, 520, 1, 'draw', weapon='bowDrawn')], rim=RIM_FIRE),
     piece('shot', 'arrowStreak', k='anim', every=1, add=True, t0=7.5, x0=520, y0=600, x1=900, y1=760)],
    cam=[[620, 480, 1.15], [880, 520, 1.3]], amb='birds', sfx=[dict(n='whoosh', at=7.5), dict(n='gasp', at=8.0, v=0.4)]),
  S('c_fallen', 'sorrow', [
      ln('VYASA', 'The stag fell. And as it lay dying, it changed. It was not a deer. It was the sage Kindama, who had taken that form to be with his wife in the forest.',
                  'मृग गिर पड़ा। और मरते हुए, वह बदल गया। वह हिरण नहीं था। वह ऋषि किंदम थे, जिन्होंने वन में अपनी पत्नी के साथ रहने के लिए वह रूप लिया था।')],
    [sh(bg(set='forest', tod='dusk'), 'forest_dusk'), piece('fallen', 'deer', at=[[820, 900, 420, 1, 1]], arrow=[830, 805]), fx('glow', x=860, y=820, r=200, col='#ffd080')],
    cam=push(860, 600, 1.2, 1.35), amb='wind', sfx=[dict(n='magic', at=3.0, v=0.5)]),
  S('c_kindama', 'lament', [
      ln('KINDAMA', 'Even a hunter does not strike creatures in love. You are a king of the Kurus, and you did not wait. Then hear me. The day you take your wife in your arms, you will die.',
                    'शिकारी भी प्रेम में डूबे जीवों पर प्रहार नहीं करता। तुम कुरुओं के राजा हो, और तुमने प्रतीक्षा नहीं की। तो सुनो। जिस दिन तुम अपनी पत्नी को बाँहों में लोगे, उसी दिन तुम्हारी मृत्यु होगी।')],
    [sh(bg(set='forest', tod='dusk'), 'forest_dusk'), face('kindama', 560, 450, 190, 1, 'sorrow', rim=RIM_FIRE)],
    cam=push(580, 450, 1.04, 1.16), amb='wind', hero=1, name=name('KINDAMA', 'किंदम', 'the sage in the deer', 'मृग रूपी ऋषि', 1)),
  S('c_pandu', 'sorrow', [
      ln('PANDU', 'What have I done? A king without sons is a tree without roots. My line ends here, in the dust of this clearing.',
                  'यह मैंने क्या किया? पुत्रहीन राजा जड़ों के बिना एक पेड़ है। मेरा वंश यहीं समाप्त होता है, इस वन की धूल में।')],
    [sh(bg(set='forest', tod='dusk'), 'forest_dusk'), face('pandu', 1040, 450, 190, -1, 'sorrow', rim=RIM_FIRE)],
    cam=push(1020, 450, 1.04, 1.14), amb='wind'),
  S('c_renounce', 'sorrow', [
      ln('VYASA', 'Pandu gave away his jewels, his silk, his chariot. He sent his servants back to Hastinapura with a message: the king would not return. He would live as an ascetic, with the sages of the mountain.',
                  'पांडु ने अपने आभूषण, अपना रेशम, अपना रथ दान कर दिया। उन्होंने सेवकों को संदेश के साथ हस्तिनापुर लौटा दिया: राजा नहीं लौटेंगे। वे पर्वत के ऋषियों के साथ तपस्वी बनकर रहेंगे।')],
    [sh(bg(set='valley', tod='dusk', hz=450, seed=2.1), 'valley_dusk'), piece('cart', 'riders', k='anim', every=2, x=300, y=820, s=110, cnt=3, speed=50)],
    cam=pan(1000, 640, 470, 1.15), amb='wind', sfx=[dict(n='hooves', at=0.5, v=0.4)]),
  S('c_queens', 'love', [
      ln('VYASA', 'Kunti and Madri would not go back. They took off their own ornaments and followed him up the mountain, to the hundred peaks of Shatashringa.',
                  'कुंती और माद्री वापस नहीं गईं। उन्होंने अपने आभूषण उतार दिए और उनके पीछे पर्वत पर चल पड़ीं, शतशृंग की सौ चोटियों तक।')],
    [sh(bg(set='himalaya'), 'himal_peaks'), figs('three', [fig('pandu', 620, 880, 340, 1, 'stand', style=dict(dhoti='#e8dcc0', crown='bun')), dict(who='kuntiY', x=820, y=880, S=320, f=1, sari='#e8dcc0'), dict(who='madri', x=980, y=880, S=310, f=1, sari='#e8dcc0')]), fx('snow', n=40)],
    cam=[[800, 520, 1.2], [800, 480, 1.05]], amb='wind'),
  S('c_cave', 'mystery', [
      ln('GANESHA', 'A whole kingdom given up for one arrow.', 'एक बाण के लिए पूरा राज्य त्याग दिया।'),
      ln('VYASAC', 'Not for the arrow, scribe. For the moment before it, when he did not stop to look.', 'बाण के लिए नहीं, लेखक। उससे पहले के उस क्षण के लिए, जब वे देखने को नहीं रुके।', gap=0.8)],
    CAVE(), cam=CAVE_CAM['two'], amb='night'),

  # ---------- the births ----------
  S('d_ashram', 'forest', [
      ln('VYASA', 'On Shatashringa the sages talked of heaven, and of the debt every man owes his ancestors. Pandu listened and grew quiet. One night he spoke to Kunti.',
                  'शतशृंग पर ऋषि स्वर्ग की बातें करते, और उस ऋण की जो हर मनुष्य पर अपने पूर्वजों का होता है। पांडु सुनते और चुप हो जाते। एक रात उन्होंने कुंती से बात की।')],
    [sh(bg(set='ashram', tod='dusk', huts=[[420, 1], [1180, 0.8]], fire=1), 'ashram_fire'), fx('embers', n=40)],
    cam=pan(560, 1000, 470, 1.15), amb='night', min=10),
  S('d_ask', 'sorrow', [
      ln('PANDU', 'Kunti, there are other ways for a man to have sons. A great soul may give a child to a woman whose husband cannot. I am asking you.',
                  'कुंती, पुत्र पाने के और भी मार्ग हैं। कोई महान आत्मा उस स्त्री को संतान दे सकती है जिसका पति ऐसा न कर सके। मैं तुमसे विनती करता हूँ।')],
    [sh(bg(set='ashram', tod='dusk', huts=[[420, 1], [1180, 0.8]], fire=1), 'ashram_fire'), face('pandu', 560, 450, 180, 1, 'sorrow', rim=RIM_FIRE)],
    cam=push(580, 450, 1.04, 1.14), amb='night'),
  S('d_mantra', 'mystery', [
      ln('KUNTI', 'My lord, when I was a girl I served the sage Durvasa, and he gave me a mantra. With it I can call any god I choose, and he must come.',
                  'स्वामी, बचपन में मैंने ऋषि दुर्वासा की सेवा की थी, और उन्होंने मुझे एक मंत्र दिया। उससे मैं जिस देवता को चाहूँ बुला सकती हूँ, और उन्हें आना ही होगा।'),
      ln('VYASA', 'She did not tell him that she had used it once already, and set the child adrift on a river.', 'उन्होंने यह नहीं बताया कि वे उसे एक बार पहले ही प्रयोग कर चुकी थीं, और उस संतान को नदी में बहा चुकी थीं।', gap=0.6)],
    [sh(bg(set='ashram', tod='dusk', huts=[[420, 1], [1180, 0.8]], fire=1), 'ashram_fire'), face('kuntiY', 1040, 440, 190, -1, 'calm', rim=RIM_FIRE)],
    cam=push(1020, 450, 1.04, 1.16), amb='night'),
  S('d_dharma', 'divine', [
      ln('PANDU', 'Then call Dharma, the god of righteousness. Let our first son be the most just man on earth.', 'तो धर्मराज को बुलाओ, धर्म के देवता को। हमारा पहला पुत्र पृथ्वी का सबसे न्यायप्रिय मनुष्य हो।'),
      ln('VYASA', 'And so Yudhishthira was born, steady in battle, and steadier in truth.', 'और इस प्रकार युधिष्ठिर का जन्म हुआ, युद्ध में स्थिर, और सत्य में उससे भी अधिक स्थिर।', gap=0.6)],
    [sh(bg(set='void', base='#0a1030', mandala=300, my=420), 'void_mandala'), fx('rays', x=800, y=420, r0=80, r1=900, col='#fff0c0'), face('yudhi', 800, 450, 180, 1, 'calm', rim=RIM_GOLD, glow=['#ffe0a0', 30, 0.3], style=dict(stache=None, beard=None))],
    cam=push(800, 450, 1.0, 1.12), amb='temple', sfx=[dict(n='bell', at=0.5), dict(n='om', at=1.5, v=0.5)], hero=1, name=name('YUDHISHTHIRA', 'युधिष्ठिर', 'son of Dharma', 'धर्मपुत्र', 1)),
  S('d_vayu', 'storm', [
      ln('VYASA', 'The next year Kunti called Vayu, the wind. Her second son was so heavy that when he slipped from her lap onto a mountain rock, the rock broke into a hundred pieces, and the baby laughed.',
                  'अगले वर्ष कुंती ने वायु को बुलाया, पवनदेव को। उनका दूसरा पुत्र इतना भारी था कि जब वह उनकी गोद से पर्वत की एक चट्टान पर गिरा, तो चट्टान सौ टुकड़ों में टूट गई, और शिशु हँस पड़ा।')],
    [sh(bg(set='himalaya'), 'himal_peaks'), fx('snow', n=120), fx('flash', every=1, at=[9.0], bolt=900), face('bhima', 800, 460, 180, 1, 'smile', style=dict(stache=None))],
    cam=push(800, 460, 1.0, 1.1), amb='storm', sfx=[dict(n='wind', at=0.5), dict(n='crack', at=9.0, v=0.7), dict(n='rumble', at=9.3, v=0.5)], shake=[[9.0, 9.8]],
    hero=1, name=name('BHIMA', 'भीम', 'son of the Wind', 'पवनपुत्र', 1)),
  S('d_indra', 'divine', [
      ln('VYASA', 'For the third son, Pandu and Kunti fasted for a year. Then she called Indra, king of the gods. When the child was born, a voice spoke out of the clear sky.',
                  'तीसरे पुत्र के लिए पांडु और कुंती ने एक वर्ष तक व्रत किया। फिर उन्होंने देवराज इंद्र को बुलाया। जब शिशु का जन्म हुआ, तो निर्मल आकाश से एक वाणी गूँजी।'),
      ln('GODS', 'This child will be the equal of Indra. No archer will stand before him.', 'यह बालक इंद्र के समान होगा। कोई धनुर्धर इसके सामने टिक नहीं पाएगा।', gap=0.6)],
    [sh(bg(set='sky', tod='gold', hz=740, hills=1), 'sky_gold'), fx('rays', x=800, y=140, r0=60, r1=1000, col='#fff0c0'), fx('petals', every=2, n=90), face('arjuna', 800, 470, 180, 1, 'calm', rim=RIM_GOLD, glow=['#ffe0a0', 30, 0.3], style=dict(stache=None))],
    cam=push(800, 450, 1.0, 1.12), amb='temple', sfx=[dict(n='thunder', at=0.6, v=0.4), dict(n='sparkle', at=11.0)], hero=1, name=name('ARJUNA', 'अर्जुन', 'son of Indra', 'इंद्रपुत्र', 1)),
  S('d_madri', 'love', [
      ln('MADRI', 'Sister, you have three sons. I have none. Will you share your mantra with me, just once?', 'दीदी, आपके तीन पुत्र हैं। मेरा एक भी नहीं। क्या आप अपना मंत्र एक बार मुझे देंगी?'),
      ln('VYASA', 'Madri was clever. With one call she summoned the Ashvins, the twin physicians of heaven, and bore twins: Nakula, the most beautiful of men, and Sahadeva, the wisest.',
                  'माद्री चतुर थीं। एक ही आह्वान से उन्होंने अश्विनी कुमारों को बुलाया, स्वर्ग के जुड़वाँ वैद्य, और जुड़वाँ पुत्रों को जन्म दिया: नकुल, पुरुषों में सबसे सुंदर, और सहदेव, सबसे ज्ञानी।', gap=0.6)],
    [sh(bg(set='ashram', tod='dawn', huts=[[420, 1], [1180, 0.8]], cow=1), 'ashram_dawn'), face('madri', 560, 440, 180, 1, 'smile', rim=RIM_GOLD)],
    cam=push(580, 450, 1.04, 1.14), amb='birds'),
  S('d_twins', 'joy', [], [sh(bg(set='void', base='#0a1030', mandala=300, my=420), 'void_mandala'), face('nakula', 560, 450, 160, 1, 'smile', n='nak', style=dict(stache=None)), face('sahadeva', 1040, 450, 160, -1, 'calm', n='sah', style=dict(stache=None)), fx('sparkle', n=60)],
    cam=hold(800, 450, 1.0, 0.06), amb='temple', sfx=[dict(n='bells', at=0.5)], min=6),
  S('d_five', 'joy', [
      ln('VYASA', 'Five sons of the gods, growing up wild among the deer and the hermits. Pandu taught them the bow. The sages taught them the Vedas. They were happy.',
                  'देवताओं के पाँच पुत्र, हिरणों और तपस्वियों के बीच उन्मुक्त बढ़ते हुए। पांडु ने उन्हें धनुष सिखाया। ऋषियों ने उन्हें वेद सिखाए। वे प्रसन्न थे।')],
    [sh(bg(set='forest', tod='day'), 'forest_day'), figs('boys', [fig('boy', 420, 880, 260, 1, 'draw', weapon='bowDrawn'), fig('boy', 600, 880, 300, 1, 'mace', weapon='mace', style=dict(dhoti='#7a2f8a', skin='#7e4c2e')), fig('boy', 780, 880, 250, 1, 'stand', style=dict(dhoti='#efe7d0')), fig('boy', 960, 880, 220, -1, 'stand', style=dict(dhoti='#2f7a6a')), fig('boy', 1100, 880, 220, -1, 'stand', style=dict(dhoti='#c9a54a'))]),
     figs('papa', [fig('pandu', 1300, 880, 400, -1, 'bless', style=dict(dhoti='#e8dcc0', crown='bun'))]), fx('leaves', n=40)],
    cam=pan(600, 1000, 470, 1.12), amb='birds', sfx=[dict(n='whoosh', at=4.0, v=0.4)]),

  # ---------- Gandhari and the hundred ----------
  S('e_gandhari', 'tension', [
      ln('VYASA', 'In Hastinapura, Gandhari had been carrying her child for two whole years. When she heard that Kunti had borne a son first, the son who would be heir, something broke in her.',
                  'हस्तिनापुर में गांधारी दो पूरे वर्षों से गर्भवती थीं। जब उन्होंने सुना कि कुंती ने पहले पुत्र को जन्म दिया है, वह पुत्र जो उत्तराधिकारी होगा, तो उनके भीतर कुछ टूट गया।')],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), face('gandhari', 760, 450, 190, 1, 'anger', rim=RIM_LAMP)],
    cam=push(760, 460, 1.02, 1.14), amb='night', sfx=[dict(n='heartbeat', at=6.0, v=0.5)]),
  S('e_lump', 'kala', [
      ln('VYASA', 'In her grief she struck her own womb. And what came out was not a child. It was a hard grey mass of flesh, cold as iron.',
                  'शोक में उन्होंने अपने ही गर्भ पर प्रहार किया। और जो निकला वह शिशु नहीं था। वह माँस का एक कठोर धूसर पिंड था, लोहे जैसा ठंडा।')],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), fx('glow', x=800, y=640, r=160, col='#8a8aa0'), fx('embers', n=30)],
    cam=push(800, 560, 1.1, 1.3), amb='night', sfx=[dict(n='boom', at=2.5, v=0.4), dict(n='gasp', at=3.0, v=0.4)]),
  S('e_vyasa', 'mystery', [
      ln('VYASA', 'She called for me.', 'उन्होंने मुझे बुलाया।'),
      ln('GANESHA', 'You were there?', 'आप वहाँ थे?'),
      ln('VYASAC', 'I am in this story more often than you think, scribe. I had promised her a hundred sons.', 'मैं इस कथा में तुम्हारे विचार से कहीं अधिक हूँ, लेखक। मैंने उन्हें सौ पुत्रों का वरदान दिया था।', gap=0.6)],
    CAVE_V('calm'), cam=push(700, 430, 1.0, 1.1), amb='night'),
  S('e_jars', 'mystery', [
      ln('VYASA', 'I sprinkled the flesh with cold water, and it divided into a hundred and one pieces, each no bigger than a thumb. We set each one in a jar of ghee, sealed it, and waited two more years.',
                  'मैंने उस पिंड पर ठंडा जल छिड़का, और वह एक सौ एक टुकड़ों में बँट गया, हर एक अँगूठे से बड़ा नहीं। हमने हर टुकड़े को घी के एक घड़े में रखा, उसे बंद किया, और दो वर्ष और प्रतीक्षा की।')],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), piece('jars', 'jars', d=0.85), figs('sage', [fig('vyasa', 560, 880, 520, 1, 'bless')], rim=RIM_LAMP), fx('glow', x=1250, y=700, r=360, col='#ffb060')],
    cam=pan(700, 1000, 520, 1.15), amb='temple', sfx=[dict(n='splash', at=1.5, v=0.3), dict(n='magic', at=3.0, v=0.4)]),
  S('e_omens', 'kala', [
      ln('VYASA', 'The first jar opened, and Duryodhana was born. At that moment jackals howled in the city, donkeys brayed, and fires broke out in the sky.',
                  'पहला घड़ा खुला, और दुर्योधन का जन्म हुआ। उसी क्षण नगर में सियार हुआँ हुआँ करने लगे, गधे रेंकने लगे, और आकाश में अग्नि भड़क उठी।')],
    [sh(bg(set='city', tod='crimson', hz=600), 'city_crimson'), fx('embers', n=110), fx('flash', every=1, at=[3.0, 7.0], bolt=1100)],
    cam=pan(1000, 600, 460, 1.15), amb='storm', sfx=[dict(n='wind', at=0.5), dict(n='thunder', at=3.0, v=0.6), dict(n='rumble', at=7.0, v=0.6)], shake=[[3.0, 3.6]]),
  S('e_vidura', 'tension', [
      ln('VIDURA', 'Brother, these signs are not to be ignored. This child will bring ruin on our house. Give him up, and keep the other ninety-nine.',
                   'भ्राता, इन संकेतों को अनदेखा नहीं करना चाहिए। यह बालक हमारे कुल का विनाश करेगा। इसे त्याग दीजिए, और बाकी निन्यानवे को रखिए।')],
    [sh(bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), 'court_dark'), face('vidura', 560, 440, 180, 1, 'stern', rim=RIM_GOLD)],
    cam=push(580, 450, 1.04, 1.14), amb='court'),
  S('e_dhrita', 'sorrow', [
      ln('DHRITA', 'My first son. My eyes in this dark world. No, Vidura. Never.', 'मेरा पहला पुत्र। इस अंधेरी दुनिया में मेरी आँखें। नहीं, विदुर। कभी नहीं।'),
      ln('VYASA', 'The rest were born one by one: Dushasana, Vikarna, and the others, a hundred brothers, and one sister, Dushala.', 'बाकी एक एक कर जन्मे: दुःशासन, विकर्ण, और अन्य, सौ भाई, और एक बहन, दुःशला।', gap=0.6)],
    [sh(bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), 'court_dark'), face('dhritaY', 1040, 440, 190, -1, 'sorrow', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.04, 1.14), amb='court'),

  # ---------- the death of Pandu ----------
  S('f_spring', 'love', [
      ln('VYASA', 'Fifteen years passed on the mountain. Then came a spring, when the forest was in flower and the koel sang all day.',
                  'पर्वत पर पंद्रह वर्ष बीत गए। फिर एक वसंत आया, जब वन फूलों से भरा था और कोयल दिन भर गाती थी।')],
    [sh(bg(set='forest', tod='gold'), 'forest_gold'), fx('petals', every=2, n=110)],
    cam=pan(640, 1000, 460, 1.15), amb='birds', sfx=[dict(n='flute', at=1.0, v=0.4)], min=9),
  S('f_madri', 'love', [
      ln('VYASA', 'Pandu saw Madri bathing in a stream, in a thin wet garment, and he forgot the curse, and the years, and everything but her.',
                  'पांडु ने माद्री को एक धारा में स्नान करते देखा, एक पतले भीगे वस्त्र में, और वे शाप को भूल गए, वर्षों को भूल गए, उनके सिवा सब कुछ भूल गए।')],
    [sh(bg(set='lake', tod='gold'), 'lake_gold'), figs('madri', [dict(who='madri', x=900, y=880, S=380, f=-1)]), fx('ripples', x=900, y=860), fx('petals', every=2, n=50)],
    cam=push(880, 520, 1.1, 1.22), amb='river', sfx=[dict(n='splash', at=2.0, v=0.3)]),
  S('f_cry', 'kala', [
      ln('MADRI', 'No, my lord! The curse! Remember the curse!', 'नहीं, स्वामी! शाप! शाप याद कीजिए!'),
      ln('VYASA', 'He held her, and the curse of Kindama came true. The king of the Kurus died in his wife\'s arms.', 'उन्होंने उन्हें बाँहों में लिया, और किंदम का शाप सत्य हो गया। कुरुओं के राजा ने अपनी पत्नी की बाँहों में प्राण त्याग दिए।', gap=0.6)],
    [sh(bg(set='lake', tod='gold'), 'lake_gold'), face('madri', 1040, 440, 190, -1, 'fear', rim=RIM_FIRE)],
    cam=push(1020, 450, 1.04, 1.18), amb='wind', sfx=[dict(n='gasp', at=0.5, v=0.5), dict(n='gong', at=4.5, v=0.5)]),
  S('f_kunti', 'lament', [
      ln('VYASA', 'Kunti came running with the children. She saw, and she understood.', 'कुंती बच्चों के साथ दौड़ती आईं। उन्होंने देखा, और समझ गईं।'),
      ln('MADRI', 'Sister, he died for love of me. Let me follow him. You are stronger than I am. Raise my sons as your own.', 'दीदी, वे मेरे प्रेम के कारण गए। मुझे उनके पीछे जाने दीजिए। आप मुझसे अधिक बलवान हैं। मेरे पुत्रों को अपना समझकर पालिए।', gap=0.6)],
    [sh(bg(set='lake', tod='dusk'), 'lake_dusk'), figs('two', [dict(who='kuntiY', x=640, y=880, S=460, f=1, sari='#e8dcc0'), dict(who='madri', x=940, y=880, S=440, f=-1, sari='#e8dcc0')], rim=RIM_FIRE)],
    cam=push(790, 470, 1.04, 1.12), amb='wind'),
  S('f_pyre', 'lament', [
      ln('VYASA', 'Madri climbed onto her husband\'s pyre. The sages of the mountain chanted, and the smoke rose over the hundred peaks.',
                  'माद्री अपने पति की चिता पर चढ़ गईं। पर्वत के ऋषियों ने मंत्र पढ़े, और धुआँ सौ चोटियों के ऊपर उठा।')],
    [sh(bg(set='himalaya'), 'himal_peaks'), fx('fire', at=[[800, 820, 200, 300]]), fx('embers', n=110)],
    cam=[[800, 600, 1.4], [800, 460, 1.0]], amb='fire', sfx=[dict(n='fire', at=0.5, v=0.6), dict(n='om', at=3.0, v=0.4)]),
  S('f_return', 'sorrow', [
      ln('VYASA', 'Then the sages walked down from the mountain with a widow and five boys, all the way to the gates of Hastinapura.',
                  'फिर ऋषि एक विधवा और पाँच बालकों के साथ पर्वत से उतरे, और पैदल हस्तिनापुर के द्वार तक आए।')],
    [sh(bg(set='valley', tod='day', hz=430, seed=1.2, groves=18), 'valley_day'), piece('walk', 'procession', k='anim', every=3, y=840, s=80, x0=-200, cnt=8, speed=30)],
    cam=pan(560, 1040, 460, 1.15), amb='wind', min=10),
  S('f_gate', 'court', [
      ln('VYASA', 'The whole city came out to see them. Bhishma wept to hold Pandu\'s sons. And Dhritarashtra\'s hundred sons stared at their five cousins, the sons of the gods.',
                  'पूरा नगर उन्हें देखने निकल आया। पांडु के पुत्रों को गले लगाकर भीष्म रो पड़े। और धृतराष्ट्र के सौ पुत्र अपने पाँच चचेरे भाइयों को घूरते रहे, देवताओं के पुत्रों को।')],
    [sh(bg(set='city', tod='gold', ghats=1), 'city_gold'), figs('bh', [fig('bhishma', 640, 880, 520, 1, 'bless')], rim=RIM_GOLD), figs('kids', [fig('boy', 900, 880, 300, -1, 'stand', style=dict(dhoti='#efe7d0')), fig('boy', 1020, 880, 320, -1, 'stand', style=dict(dhoti='#7a2f8a', skin='#7e4c2e')), fig('boy', 1130, 880, 280, -1, 'stand', style=dict(dhoti='#c7362b'))])],
    cam=push(840, 470, 1.04, 1.14), amb='crowd', sfx=[dict(n='bells', at=0.5, v=0.4)]),

  # ---------- Bhima and the poison ----------
  S('g_play', 'joy', [
      ln('VYASA', 'The boys grew up together, a hundred and five princes in one palace. And in every game, Bhima won. He held the Kauravas under the water until they gasped. He shook the trees they climbed until they fell like fruit.',
                  'बालक साथ साथ बड़े हुए, एक महल में एक सौ पाँच राजकुमार। और हर खेल में भीम जीतते। वे कौरवों को पानी में तब तक दबाए रखते जब तक उनकी साँस न फूल जाती। वे उन पेड़ों को हिलाते जिन पर कौरव चढ़े होते, जब तक वे फलों की तरह न गिर पड़ते।')],
    [sh(bg(set='river', tod='day', hz=560), 'river_day'), fx('ripples', x=800, y=820), fx('leaves', n=40), figs('bhimaboy', [fig('boy', 760, 880, 360, 1, 'maceUp', style=dict(dhoti='#7a2f8a', skin='#7e4c2e'))])],
    cam=pan(600, 1000, 470, 1.12), amb='river', sfx=[dict(n='splash', at=3.0, v=0.5), dict(n='splash', at=8.0, v=0.4)]),
  S('g_duryo', 'tension', [
      ln('DURYO', 'He laughs at us. Every day, he laughs. One day the crown will go to his brother, and we will bow to them. Not while I live.',
                  'वह हम पर हँसता है। हर दिन, हँसता है। एक दिन मुकुट उसके भाई को जाएगा, और हम उनके आगे झुकेंगे। मेरे जीते जी नहीं।', fx='growl')],
    [sh(bg(set='river', tod='dusk', hz=560), 'river_dusk'), face('duryo', 560, 440, 190, 1, 'cruel', rim=RIM_FIRE, style=dict(stache=None))],
    cam=push(580, 450, 1.04, 1.14), amb='river', hero=1, name=name('DURYODHANA', 'दुर्योधन', 'eldest of the hundred', 'सौ में सबसे बड़ा', 1)),
  S('g_feast', 'tension', [
      ln('VYASA', 'He built a pleasure house on the river at Pramanakoti and held a feast for all the princes. Into Bhima\'s sweets he mixed the poison of serpents.',
                  'उसने प्रमाणकोटि में नदी के किनारे एक क्रीड़ा भवन बनवाया और सब राजकुमारों के लिए भोज रखा। भीम की मिठाइयों में उसने सर्पों का विष मिला दिया।')],
    [sh(bg(set='river', tod='dusk', hz=560, palace=1), 'river_palace'), piece('lamps', 'floatLamps', k='anim', every=2, add=True)],
    cam=pan(1000, 600, 470, 1.15), amb='river', sfx=[dict(n='bells', at=1.0, v=0.3)]),
  S('g_drown', 'kala', [
      ln('VYASA', 'Bhima ate everything, as he always did, and fell into a heavy sleep. Duryodhana bound him with vines and rolled him into the Ganga.',
                  'भीम ने सब कुछ खा लिया, जैसा वे हमेशा करते थे, और गहरी नींद में गिर पड़े। दुर्योधन ने उन्हें लताओं से बाँधा और गंगा में लुढ़का दिया।')],
    [sh(bg(set='river', tod='night', hz=560), 'river_night'), fx('ripples', x=800, y=760), fx('stars', n=60)],
    cam=push(800, 640, 1.1, 1.4), amb='river', sfx=[dict(n='splash', at=6.5, v=0.7), dict(n='heartbeat', at=7.5, v=0.5)]),
  S('g_naga', 'mystery', [
      ln('VYASA', 'He sank into the kingdom of the Nagas, the serpent people under the river. They bit him, again and again, and their venom fought the poison in his blood, and killed it.',
                  'वे नदी के नीचे नागों के लोक में डूब गए। नागों ने उन्हें बार बार डसा, और उनके विष ने भीम के रक्त में घुले विष से युद्ध किया, और उसे नष्ट कर दिया।')],
    [bg(set='void', base='#04202a', mandala=260, my=420, col='#8af0d0'), fx('ripples', x=800, y=500), fx('sparkle', n=70), face('bhima', 800, 460, 170, 1, 'calm', rim=RIM_COOL, glow=['#8af0d0', 26, 0.3], style=dict(stache=None))],
    cam=push(800, 460, 1.0, 1.12), amb='void', sfx=[dict(n='magic', at=1.0, v=0.5), dict(n='swell', at=6.0, v=0.4)]),
  S('g_vasuki', 'divine', [
      ln('VYASA', 'Vasuki, king of the serpents, knew him as the grandson of a friend. He gave Bhima eight bowls of the nectar of the Nagas, and with each bowl came the strength of a thousand elephants.',
                  'नागराज वासुकी ने उन्हें एक मित्र के वंशज के रूप में पहचाना। उन्होंने भीम को नागों के अमृत के आठ कटोरे दिए, और हर कटोरे के साथ आया एक हज़ार हाथियों का बल।')],
    [bg(set='void', base='#04202a', mandala=360, my=420, col='#8af0d0'), fx('wheel', x=800, y=420, r=320, col='#8af0d0'), fx('sparkle', n=60)],
    cam=push(800, 440, 1.0, 1.15), amb='void', sfx=[dict(n='om', at=1.0, v=0.4), dict(n='magic', at=8.0, v=0.4)]),
  S('g_back', 'heroic', [
      ln('VYASA', 'Eight days later, Bhima walked back into Hastinapura, smiling, stronger than ever. Duryodhana smiled back at him. And began to think of fire.',
                  'आठ दिन बाद भीम मुस्कुराते हुए हस्तिनापुर लौट आए, पहले से कहीं अधिक बलवान। दुर्योधन ने भी मुस्कुराकर उन्हें देखा। और अग्नि के बारे में सोचने लगा।')],
    [sh(bg(set='city', tod='gold', ghats=1), 'city_gold'), face('bhima', 560, 450, 180, 1, 'smile', n='bh', rim=RIM_GOLD), face('duryo', 1060, 440, 180, -1, 'cruel', n='du', rim=RIM_FIRE, style=dict(stache=None))],
    cam=[[620, 450, 1.1], [980, 450, 1.05]], amb='crowd'),

  # ---------- Drona ----------
  S('h_kripa', 'forest', [
      ln('VYASA', 'Bhishma gave the princes a teacher, the gentle Kripacharya. But he wanted more for them. He wanted a master.',
                  'भीष्म ने राजकुमारों को एक गुरु दिए, सौम्य कृपाचार्य। पर वे उनके लिए और चाहते थे। वे एक महागुरु चाहते थे।')],
    [sh(bg(set='ashram', tod='day', huts=[[400, 1], [1200, 0.8]]), 'ashram_day'), face('kripa', 1040, 440, 180, -1, 'calm', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.0, 1.12), amb='birds', hero=1, name=name('KRIPA', 'कृप', 'first teacher of the princes', 'राजकुमारों के प्रथम गुरु', -1)),
  S('h_well', 'mystery', [
      ln('VYASA', 'One day the princes were playing with a wooden ball, and it fell into a dry well. They stood around it, helpless, a hundred and five princes and not one idea.',
                  'एक दिन राजकुमार लकड़ी की गेंद से खेल रहे थे, और वह एक सूखे कुएँ में गिर गई। वे उसके चारों ओर असहाय खड़े रहे, एक सौ पाँच राजकुमार और एक भी उपाय नहीं।')],
    [sh(bg(set='valley', tod='day', hz=430, seed=1.2, groves=18), 'valley_day'), figs('kids2', [fig('boy', 520, 880, 300, 1, 'stand', style=dict(dhoti='#c7362b')), fig('boy', 680, 880, 280, 1, 'stand', style=dict(dhoti='#7a2f8a', skin='#7e4c2e')), fig('boy', 1000, 880, 300, -1, 'stand', style=dict(dhoti='#3a2a5a')), fig('boy', 1150, 880, 290, -1, 'stand', style=dict(dhoti='#1a3a2a'))])],
    cam=push(820, 520, 1.05, 1.18), amb='birds'),
  S('h_brahmin', 'mystery', [
      ln('VYASA', 'A thin, dark brahmin was watching them. He laughed, picked up a blade of grass, and threw it like a spear.',
                  'एक दुबला, साँवला ब्राह्मण उन्हें देख रहा था। वह हँसा, घास का एक तिनका उठाया, और उसे भाले की तरह फेंका।'),
      ln('DRONA', 'Princes of the Kurus, and you cannot fetch a ball? Watch.', 'कुरुओं के राजकुमार, और तुम एक गेंद नहीं निकाल सकते? देखो।', fx='elder', gap=0.6)],
    [sh(bg(set='valley', tod='day', hz=430, seed=1.2, groves=18), 'valley_day'), face('drona', 1040, 440, 190, -1, 'smile', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.0, 1.12), amb='birds', hero=1, name=name('DRONA', 'द्रोण', 'the master of arms', 'शस्त्रों के आचार्य', -1)),
  S('h_grass', 'wonder', [
      ln('VYASA', 'The first blade pierced the ball. The second pierced the first. Blade by blade he made a chain, and drew the ball up out of the dark.',
                  'पहला तिनका गेंद में धँस गया। दूसरा पहले में। तिनके दर तिनके उसने एक श्रृंखला बनाई, और गेंद को अंधेरे से ऊपर खींच लिया।')],
    [sh(bg(set='valley', tod='day', hz=430, seed=1.2, groves=18), 'valley_day'), piece('g1', 'arrowStreak', k='anim', every=1, add=True, t0=0.8, x0=500, y0=500, x1=800, y1=820), piece('g2', 'arrowStreak', k='anim', every=1, add=True, t0=3.0, x0=520, y0=480, x1=800, y1=760), piece('g3', 'arrowStreak', k='anim', every=1, add=True, t0=5.0, x0=540, y0=460, x1=800, y1=700)],
    cam=push(760, 640, 1.2, 1.4), amb='birds', sfx=[dict(n='whoosh', at=0.8, v=0.4), dict(n='whoosh', at=3.0, v=0.4), dict(n='whoosh', at=5.0, v=0.4), dict(n='cheer', at=9.0, v=0.3)]),
  S('h_tell', 'sorrow', [
      ln('VYASA', 'Bhishma knew at once who it was. Drona, son of the sage Bharadvaja, a brahmin who had learned every weapon from Parashurama himself. And a poor man with a wound in his heart.',
                  'भीष्म तुरंत समझ गए कि वह कौन था। द्रोण, ऋषि भरद्वाज के पुत्र, एक ब्राह्मण जिसने स्वयं परशुराम से हर अस्त्र सीखा था। और एक निर्धन, जिसके हृदय में एक घाव था।')],
    [sh(bg(set='court', tone='#4a1612', throne=[800, 660, 240], canopy=1), 'court_red2'), figs('meet', [fig('bhishma', 600, 880, 520, 1, 'bless'), fig('drona', 1000, 880, 520, -1, 'stand')], rim=RIM_GOLD)],
    cam=push(800, 470, 1.04, 1.12), amb='court'),
  S('h_boys', 'love', [
      ln('VYASA', 'Drona told his story. As boys, he and Prince Drupada of Panchala had studied in the same hermitage. They shared everything.',
                  'द्रोण ने अपनी कथा सुनाई। बचपन में वे और पांचाल के राजकुमार द्रुपद एक ही आश्रम में पढ़े थे। वे सब कुछ बाँटते थे।'),
      ln('DRUPADA', 'When I am king, Drona, half of my kingdom is yours. I swear it.', 'जब मैं राजा बनूँगा, द्रोण, मेरा आधा राज्य तुम्हारा होगा। मैं शपथ लेता हूँ।', gap=0.6)],
    [sh(bg(set='ashram', tod='gold', huts=[[400, 1], [1200, 0.8]]), 'ashram_gold'), figs('friends', [fig('boy', 680, 880, 380, 1, 'stand', style=dict(dhoti='#f0e8d0', skin='#8a5a3a')), fig('boy', 920, 880, 380, -1, 'bless', style=dict(dhoti='#2a4a7a'))], rim=RIM_GOLD), fx('dust', col='#f0c070', n=40)],
    cam=push(800, 480, 1.04, 1.12), amb='birds'),
  S('h_milk', 'sorrow', [
      ln('VYASA', 'Years later Drona married, and had a son, Ashwatthama. They were so poor that when the boy cried for milk, his mother mixed flour in water and he drank it, and danced, thinking it was milk.',
                  'वर्षों बाद द्रोण का विवाह हुआ, और एक पुत्र हुआ, अश्वत्थामा। वे इतने निर्धन थे कि जब बालक दूध के लिए रोया, तो उसकी माँ ने पानी में आटा घोल दिया, और वह उसे पीकर नाचने लगा, यह सोचकर कि वह दूध है।')],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), face('drona', 600, 450, 180, 1, 'sorrow', rim=RIM_LAMP)],
    cam=push(620, 460, 1.04, 1.16), amb='night'),
  S('h_court', 'tension', [
      ln('VYASA', 'So Drona went to Panchala, to his old friend, now king.', 'तो द्रोण पांचाल गए, अपने पुराने मित्र के पास, जो अब राजा था।'),
      ln('DRONA', 'Drupada, my friend! It is me, Drona. Do you remember?', 'द्रुपद, मेरे मित्र! मैं हूँ, द्रोण। याद है?', gap=0.5)],
    [bg(set='court', tone='#1a2a4a', throne=[800, 660, 240], canopy=1), figs('pan', [fig('drupada', 800, 700, 300, 1, 'stand'), fig('drona', 380, 880, 520, 1, 'bless')], rim=RIM_GOLD)],
    cam=push(600, 470, 1.04, 1.12), amb='court'),
  S('h_insult', 'kala', [
      ln('DRUPADA', 'Friend? Friendship is between equals, brahmin. A king is not the friend of a beggar. Take a meal from my kitchen, if you are hungry, and go.',
                    'मित्र? मित्रता बराबर वालों में होती है, ब्राह्मण। राजा भिखारी का मित्र नहीं होता। भूखे हो तो मेरी रसोई से भोजन ले लो, और जाओ।')],
    [bg(set='court', tone='#1a2a4a', throne=[800, 660, 240], canopy=1), face('drupada', 1040, 440, 190, -1, 'cruel', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.04, 1.16), amb='court', sfx=[dict(n='crowdlaugh', at=6.0, v=0.4)], hero=1, name=name('DRUPADA', 'द्रुपद', 'king of Panchala', 'पांचाल नरेश', -1)),
  S('h_vow', 'fire', [
      ln('DRONA', 'Then one day, king, I will make you my equal again. I will take half your kingdom, and give it back to you as a gift.',
                  'तो एक दिन, राजन, मैं तुम्हें फिर से अपने बराबर बनाऊँगा। मैं तुम्हारा आधा राज्य लूँगा, और उसे तुम्हें दान में लौटा दूँगा।', fx='elder')],
    [bg(set='court', tone='#1a2a4a', throne=[800, 660, 240], canopy=1), face('drona', 560, 440, 190, 1, 'anger', rim=RIM_FIRE), fx('embers', n=50)],
    cam=push(580, 450, 1.04, 1.16), amb='court', sfx=[dict(n='gong', at=0.5, v=0.4)]),
  S('h_hired', 'heroic', [
      ln('BHISHMA', 'Stay in Hastinapura, Acharya. Teach the princes of the Kurus, and they will pay your debt.', 'हस्तिनापुर में रहिए, आचार्य। कुरुओं के राजकुमारों को शिक्षा दीजिए, और वे आपका ऋण चुकाएँगे।', fx='elder')],
    [sh(bg(set='court', tone='#4a1612', throne=[800, 660, 240], canopy=1), 'court_red2'), face('bhishma', 1040, 440, 190, -1, 'calm', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.0, 1.12), amb='court'),

  # ---------- the school ----------
  S('i_school', 'march', [
      ln('VYASA', 'So began the school of Drona. Every morning, before dawn, a hundred and five princes ran to the field with bows and maces and swords, and the sons of other kings came to learn beside them.',
                  'इस प्रकार द्रोण का गुरुकुल आरंभ हुआ। हर सुबह, भोर से पहले, एक सौ पाँच राजकुमार धनुष, गदा और तलवार लेकर मैदान की ओर दौड़ते, और दूसरे राजाओं के पुत्र भी उनके साथ सीखने आते।')],
    [sh(bg(set='field', sunX=1100, sunY=520, armies=0), 'field_empty'), piece('kids', 'folk', cnt=40, y=800, dy=80, s=50, seed=4), fx('dust', col='#e0b070', n=70)],
    cam=[[800, 600, 1.4], [800, 460, 1.0]], amb='wind', sfx=[dict(n='whoosh', at=3.0, v=0.4), dict(n='clash', at=6.0, v=0.3)], min=10),
  S('i_mace', 'battle', [
      ln('VYASA', 'Bhima and Duryodhana took to the mace, and each became the other\'s shadow. Nakula learned the sword, Yudhishthira the spear. But one boy wanted everything Drona knew.',
                  'भीम और दुर्योधन ने गदा अपनाई, और हर एक दूसरे की छाया बन गया। नकुल ने तलवार सीखी, युधिष्ठिर ने भाला। पर एक बालक द्रोण का सब कुछ जानना चाहता था।')],
    [sh(bg(set='field', sunX=1100, sunY=520, armies=0), 'field_empty'), figs('maces', [fig('bhima', 520, 880, 520, 1, 'maceUp', weapon='mace'), fig('duryo', 1080, 880, 520, -1, 'mace', weapon='mace')], rim=RIM_FIRE), fx('dust', col='#c07a4a', n=60)],
    cam=push(800, 470, 1.04, 1.12), amb='battle', sfx=[dict(n='clash', at=2.0, v=0.6), dict(n='clash', at=4.5, v=0.6)]),
  S('i_dark', 'mystery', [
      ln('VYASA', 'One night the wind blew out the lamp while Arjuna was eating. His hand still found his mouth in the dark. And he thought: if a hand can learn the dark, so can a bow.',
                  'एक रात अर्जुन भोजन कर रहे थे जब हवा ने दीया बुझा दिया। अंधेरे में भी उनका हाथ मुँह तक पहुँचता रहा। और उन्होंने सोचा: यदि हाथ अंधेरा सीख सकता है, तो धनुष भी।')],
    [sh(bg(set='forest', tod='night'), 'forest_night'), fx('fireflies', n=60), figs('night', [fig('arjuna', 760, 880, 560, 1, 'draw', weapon='bowDrawn')], rim=RIM_COOL)],
    cam=push(780, 480, 1.04, 1.14), amb='night', sfx=[dict(n='whoosh', at=8.0, v=0.4), dict(n='crack', at=8.3, v=0.3)]),
  S('i_bird', 'tension', [
      ln('VYASA', 'Then came the test. Drona set a wooden bird high in a tree and called his pupils one by one.', 'फिर परीक्षा आई। द्रोण ने एक लकड़ी की चिड़िया पेड़ पर ऊँचे रखी और अपने शिष्यों को एक एक कर बुलाया।'),
      ln('DRONA', 'Aim at the bird. Tell me what you see.', 'चिड़िया पर निशाना साधो। बताओ, तुम्हें क्या दिखता है।', fx='elder', gap=0.6)],
    [sh(bg(set='forest', tod='day'), 'forest_day'), face('drona', 1060, 440, 190, -1, 'stern', rim=RIM_GOLD), piece('bird', 'woodBird', d=0.8, x=380, y=330)],
    cam=push(900, 450, 1.0, 1.1), amb='birds'),
  S('i_yudhi', 'tension', [
      ln('YUDHI', 'I see the tree, the branches, the leaves, the bird, my brothers, and you, Acharya.', 'मुझे पेड़ दिखता है, डालियाँ, पत्ते, चिड़िया, मेरे भाई, और आप, आचार्य।'),
      ln('DRONA', 'Step aside.', 'हट जाओ।', fx='elder', gap=0.5)],
    [sh(bg(set='forest', tod='day'), 'forest_day'), face('yudhi', 560, 450, 180, 1, 'calm', rim=RIM_GOLD, style=dict(beard=None))],
    cam=push(580, 450, 1.04, 1.14), amb='birds'),
  S('i_eye', 'tension', [
      ln('ARJUNA', 'I see only the bird. Now only its head. Now only its eye.', 'मुझे केवल चिड़िया दिखती है। अब केवल उसका सिर। अब केवल उसकी आँख।'),
      ln('DRONA', 'Then shoot.', 'तो बाण चलाओ।', fx='elder', gap=0.5)],
    [sh(bg(set='forest', tod='day'), 'forest_day'), figs('archer', [fig('arjuna', 560, 900, 660, 1, 'draw', weapon='bowDrawn')], rim=RIM_GOLD), piece('bird', 'woodBird', d=1.0, x=1300, y=320, s=1.5),
     piece('shot', 'arrowStreak', k='anim', every=1, add=True, t0=7.5, x0=820, y0=520, x1=1300, y1=330)],
    cam=[[700, 470, 1.15], [1200, 360, 1.5]], amb='birds', sfx=[dict(n='whoosh', at=7.5), dict(n='crack', at=7.8, v=0.5)]),
  S('i_promise', 'heroic', [
      ln('DRONA', 'Arjuna, I promise you this. No archer in the world will ever be your equal.', 'अर्जुन, मैं तुम्हें वचन देता हूँ। संसार का कोई धनुर्धर कभी तुम्हारे बराबर नहीं होगा।', fx='elder')],
    [sh(bg(set='forest', tod='gold'), 'forest_gold'), figs('gs', [fig('drona', 620, 880, 560, 1, 'bless'), fig('arjuna', 960, 880, 520, -1, 'bowLow', weapon='bowRest')], rim=RIM_GOLD), fx('dust', col='#f0c070', n=40)],
    cam=push(790, 470, 1.04, 1.12), amb='birds'),

  # ---------- Ekalavya ----------
  S('j_eka', 'forest', [
      ln('VYASA', 'A boy came out of the forest one day, a Nishada, son of the hunter-chief Hiranyadhanu. He bowed at Drona\'s feet.',
                  'एक दिन वन से एक बालक आया, एक निषाद, शिकारियों के मुखिया हिरण्यधनु का पुत्र। उसने द्रोण के चरणों में प्रणाम किया।'),
      ln('EKALAVYA', 'Acharya, teach me the bow. I will serve you all my life.', 'आचार्य, मुझे धनुर्विद्या सिखाइए। मैं जीवन भर आपकी सेवा करूँगा।', gap=0.5)],
    [sh(bg(set='forest', tod='day'), 'forest_day'), face('ekalavya', 560, 450, 180, 1, 'calm', rim=RIM_GOLD)],
    cam=push(580, 450, 1.0, 1.12), amb='birds', hero=1, name=name('EKALAVYA', 'एकलव्य', 'the Nishada prince', 'निषाद राजकुमार', 1)),
  S('j_refuse', 'sorrow', [
      ln('DRONA', 'I teach the princes of the Kurus, and only them. Go home, child.', 'मैं केवल कुरुओं के राजकुमारों को सिखाता हूँ। घर जाओ, बालक।', fx='elder')],
    [sh(bg(set='forest', tod='day'), 'forest_day'), face('drona', 1040, 440, 190, -1, 'stern', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.04, 1.12), amb='birds'),
  S('j_clay', 'forest', [
      ln('VYASA', 'Ekalavya went deep into the forest. He made an image of Drona out of clay, bowed to it every morning as his teacher, and practised. Alone. For years.',
                  'एकलव्य वन में भीतर चला गया। उसने मिट्टी से द्रोण की एक प्रतिमा बनाई, हर सुबह उसे गुरु मानकर प्रणाम किया, और अभ्यास करता रहा। अकेले। वर्षों तक।')],
    [sh(bg(set='forest', tod='dawn'), 'forest_dawn'), figs('statue', [fig('clay', 1040, 880, 480, -1, 'bless')]), figs('archer2', [fig('ekalavya', 560, 880, 520, 1, 'draw', weapon='bowDrawn')], rim=RIM_GOLD), fx('leaves', n=40)],
    cam=pan(640, 960, 480, 1.12), amb='birds', sfx=[dict(n='whoosh', at=5.0, v=0.4), dict(n='whoosh', at=9.0, v=0.4)]),
  S('j_dog', 'mystery', [
      ln('VYASA', 'One day the princes went hunting, and their dog ran ahead, barking at a dark young man in the trees. Seven arrows flew. The dog came back with its mouth filled with arrows, so that it could not bark. And it was not even scratched.',
                  'एक दिन राजकुमार आखेट पर गए, और उनका कुत्ता आगे दौड़ता हुआ पेड़ों में एक साँवले युवक पर भौंकने लगा। सात बाण चले। कुत्ता लौटा तो उसका मुँह बाणों से भरा था, कि वह भौंक न सके। और उसे एक खरोंच तक नहीं आई थी।')],
    [sh(bg(set='forest', tod='day'), 'forest_day'), piece('dog', 'dogSealed', x=760, y=880, s=1.8)],
    cam=push(840, 720, 1.2, 1.45), amb='birds', sfx=[dict(n='whoosh', at=6.0, v=0.4), dict(n='whoosh', at=6.4, v=0.4), dict(n='gasp', at=12.0, v=0.4)]),
  S('j_arjuna', 'tension', [
      ln('ARJUNA', 'Acharya, you promised that no archer would ever be my equal. There is one in the forest who is better.', 'आचार्य, आपने वचन दिया था कि कोई धनुर्धर कभी मेरे बराबर नहीं होगा। वन में एक है जो मुझसे श्रेष्ठ है।')],
    [sh(bg(set='forest', tod='day'), 'forest_day'), face('arjuna', 560, 450, 180, 1, 'stern', rim=RIM_GOLD, style=dict(stache=None))],
    cam=push(580, 450, 1.04, 1.14), amb='birds'),
  S('j_who', 'tension', [
      ln('EKALAVYA', 'I am Ekalavya, the pupil of Drona.', 'मैं एकलव्य हूँ, द्रोण का शिष्य।'),
      ln('DRONA', 'If I am your teacher, then you owe me a teacher\'s fee.', 'यदि मैं तुम्हारा गुरु हूँ, तो तुम पर गुरु दक्षिणा का ऋण है।', fx='elder', gap=0.6),
      ln('EKALAVYA', 'Ask anything.', 'जो चाहें माँगिए।', gap=0.5)],
    [sh(bg(set='forest', tod='dawn'), 'forest_dawn'), figs('meet2', [fig('drona', 1040, 880, 540, -1, 'stand'), fig('ekalavya', 600, 880, 520, 1, 'bowLow')], rim=RIM_GOLD)],
    cam=push(820, 470, 1.04, 1.12), amb='birds'),
  S('j_thumb', 'lament', [
      ln('DRONA', 'Give me the thumb of your right hand.', 'मुझे अपने दाहिने हाथ का अँगूठा दे दो।', fx='elder'),
      ln('VYASA', 'The boy did not hesitate. He smiled, took his knife, and cut off his thumb, and laid it at his teacher\'s feet. He never drew a bow the same way again.',
                  'बालक ने संकोच नहीं किया। वह मुस्कुराया, अपना चाकू लिया, और अँगूठा काटकर गुरु के चरणों में रख दिया। फिर वह कभी पहले जैसा धनुष नहीं खींच सका।', gap=0.8)],
    [sh(bg(set='forest', tod='dawn'), 'forest_dawn'), face('ekalavya', 800, 450, 200, 1, 'sorrow', rim=RIM_FIRE)],
    cam=push(800, 450, 1.04, 1.2), amb='wind', sfx=[dict(n='heartbeat', at=1.0, v=0.4), dict(n='gong', at=6.0, v=0.4)]),
  S('j_cave', 'mystery', [
      ln('GANESHA', 'Muni, was that dharma? A teacher who never taught him took the one thing he had.', 'मुनिवर, क्या यह धर्म था? जिस गुरु ने उसे कभी सिखाया नहीं, उसने उसकी एकमात्र संपत्ति ले ली।'),
      ln('VYASAC', 'Write it down exactly as it happened, scribe. Let those who read it judge Drona. And let them remember Ekalavya.', 'इसे ठीक वैसे ही लिखो जैसा हुआ, लेखक। जो पढ़ें, वे द्रोण का न्याय करें। और एकलव्य को याद रखें।', gap=0.8)],
    CAVE(), cam=CAVE_CAM['ga'], amb='night'),

  # ---------- the tournament ----------
  S('k_arena', 'heroic', [
      ln('VYASA', 'When their training was done, Drona held a great tournament, so the city could see what its princes had become. A whole arena was built for it, with stands for the king and the queens.',
                  'जब उनकी शिक्षा पूरी हुई, तो द्रोण ने एक महान प्रतियोगिता रखी, कि नगर देख सके कि उसके राजकुमार क्या बन गए हैं। उसके लिए एक पूरी रंगभूमि बनी, राजा और रानियों के लिए आसनों के साथ।')],
    [sh(bg(set='arena', tod='day'), 'arena_day'), piece('crowd', 'folk', cnt=60, y=720, dy=60, s=40, seed=7), fx('dust', col='#f0c070', n=60)],
    cam=[[800, 600, 1.4], [800, 460, 1.0]], amb='crowd', sfx=[dict(n='nagara', at=0.4, v=0.6), dict(n='cheer', at=2.0, v=0.5)], min=10),
  S('k_show', 'heroic', [
      ln('VYASA', 'Arjuna made fire with one arrow and rain with the next. He made himself vanish and appear. He shot twenty-one arrows into the hollow of a swinging horn. The city roared.',
                  'अर्जुन ने एक बाण से अग्नि उत्पन्न की और अगले से वर्षा। वे अदृश्य हुए और प्रकट हुए। उन्होंने झूलते हुए सींग के खोखल में इक्कीस बाण मारे। पूरा नगर गरज उठा।')],
    [sh(bg(set='arena', tod='day'), 'arena_day'), figs('arj', [fig('arjuna', 620, 880, 600, 1, 'release', weapon='bow')], rim=RIM_GOLD), fx('fire', at=[[1200, 780, 120, 200]]), fx('rain', n=80)],
    cam=push(800, 470, 1.04, 1.14), amb='crowd', sfx=[dict(n='whoosh', at=1.0), dict(n='fire', at=1.5, v=0.4), dict(n='whoosh', at=5.0), dict(n='cheer', at=10.0, v=0.7)]),
  S('k_karna', 'heroic', [
      ln('VYASA', 'Then a sound like thunder came from the gate. A young man walked into the arena, in golden armour that grew from his own skin, with golden earrings shining like two small suns.',
                  'तभी द्वार से बादल के गरजने जैसी ध्वनि आई। एक युवक रंगभूमि में आया, ऐसे स्वर्ण कवच में जो उसकी अपनी त्वचा से उगा था, और दो छोटे सूर्यों जैसे चमकते स्वर्ण कुंडलों के साथ।')],
    [sh(bg(set='arena', tod='day'), 'arena_day'), figs('karna', [fig('karna', 1100, 880, 600, -1, 'stand', weapon='bowRest')], rim=RIM_SUN, glow=['#ffd060', 20, 0.35]), fx('rays', x=1100, y=420, r0=100, r1=900, col='#ffe0a0', spin=2)],
    cam=[[700, 470, 1.1], [1060, 460, 1.15]], amb='crowd', sfx=[dict(n='thunder', at=0.4, v=0.6), dict(n='gasp', at=2.0, v=0.5)]),
  S('k_challenge', 'heroic', [
      ln('KARNA', 'Arjuna, everything you have done today, I can do. And then I will fight you, bow to bow.', 'अर्जुन, आज तुमने जो कुछ किया, वह सब मैं कर सकता हूँ। और फिर मैं तुमसे युद्ध करूँगा, धनुष से धनुष।')],
    [sh(bg(set='sky', tod='gold', sun=[800, 380, 220], sunCol='#f6b030', hills=1, ground='#8a5a3a'), 'sky_sun'), fx('rays', x=800, y=380, r0=200, r1=1000, col='#ffe0a0', spin=2), face('karna', 800, 440, 200, 1, 'stern', rim=RIM_GOLD)],
    cam=push(800, 450, 1.0, 1.12), amb='crowd', hero=1, name=name('KARNA', 'कर्ण', 'son of the Sun', 'सूर्यपुत्र', 1)),
  S('k_equal', 'battle', [
      ln('VYASA', 'And he did. Every feat, arrow for arrow. Duryodhana leapt from his seat and embraced him.', 'और उसने कर दिखाया। हर करतब, बाण के बदले बाण। दुर्योधन अपने आसन से उछला और उसे गले लगा लिया।')],
    [sh(bg(set='arena', tod='day'), 'arena_day'), figs('kshoot', [fig('karna', 800, 880, 600, 1, 'release', weapon='bow')], rim=RIM_SUN, glow=['#ffd060', 20, 0.35]), piece('kr', 'arrowRain', k='anim', every=2, add=True)],
    cam=push(800, 470, 1.04, 1.12), amb='crowd', sfx=[dict(n='whoosh', at=0.5), dict(n='whoosh', at=2.0), dict(n='cheer', at=5.0, v=0.6)]),
  S('k_kripa', 'tension', [
      ln('KRIPA', 'Young man, Arjuna is a prince of the Kurus. Tell us your father\'s name and your house, so he may know whether he can fight you. A prince does not duel with just anyone.',
                  'युवक, अर्जुन कुरुओं के राजकुमार हैं। अपने पिता का नाम और अपना कुल बताओ, कि वे जान सकें कि तुमसे युद्ध कर सकते हैं या नहीं। राजकुमार हर किसी से द्वंद्व नहीं करता।')],
    [sh(bg(set='arena', tod='day'), 'arena_day'), face('kripa', 1040, 440, 180, -1, 'stern', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.04, 1.12), amb='crowd'),
  S('k_shame', 'sorrow', [
      ln('VYASA', 'Karna bowed his head, and said nothing. His face flushed like a lotus in the rain.', 'कर्ण ने सिर झुका लिया, और कुछ नहीं कहा। उसका मुख वर्षा में भीगे कमल की तरह लाल हो गया।')],
    [sh(bg(set='arena', tod='day'), 'arena_day'), face('karna', 560, 470, 190, 1, 'sorrow', rim=RIM_GOLD)],
    cam=push(580, 470, 1.06, 1.2), amb='crowd', sfx=[dict(n='crowdlaugh', at=2.0, v=0.4)]),
  S('k_anga', 'heroic', [
      ln('DURYO', 'If Arjuna will fight only a king, then let Karna be a king! I give him the kingdom of Anga, here and now.', 'यदि अर्जुन केवल राजा से लड़ेंगे, तो कर्ण राजा बनें! मैं उन्हें अभी, यहीं अंग देश का राज्य देता हूँ।', fx='growl'),
      ln('VYASA', 'Brahmins were called, water poured, a crown set on Karna\'s head, in the middle of the arena.', 'ब्राह्मण बुलाए गए, जल डाला गया, रंगभूमि के बीच ही कर्ण के सिर पर मुकुट रखा गया।', gap=0.6)],
    [sh(bg(set='arena', tod='dusk'), 'arena_dusk'), figs('two', [fig('karna', 900, 880, 620, -1, 'bowLow'), fig('duryo', 620, 880, 640, 1, 'bless')], rim=RIM_GOLD), fx('petals', n=60)],
    cam=push(780, 450, 1.0, 1.12), amb='crowd', sfx=[dict(n='conch', at=0.3, v=0.5), dict(n='cheer', at=7.0, v=0.6)]),
  S('k_friend', 'love', [
      ln('KARNA', 'What can I give you in return, prince?', 'बदले में मैं आपको क्या दे सकता हूँ, राजकुमार?'),
      ln('DURYO', 'Only your friendship. Forever.', 'केवल तुम्हारी मित्रता। सदा के लिए।', gap=0.6),
      ln('KARNA', 'Then it is yours, for as long as I breathe.', 'तो वह आपकी है, जब तक मेरी साँस है।', gap=0.6)],
    [sh(bg(set='arena', tod='dusk'), 'arena_dusk'), face('karna', 560, 450, 180, 1, 'calm', n='ka', rim=RIM_GOLD), face('duryo', 1060, 450, 180, -1, 'smile', n='du', rim=RIM_GOLD)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='crowd'),
  S('k_father', 'sorrow', [
      ln('VYASA', 'Then an old man came stumbling into the arena, sweating, his cloth slipping. Adhiratha, the charioteer. And the new king of Anga bowed down and touched his feet. My son, the old man said. My son.',
                  'तभी एक वृद्ध लड़खड़ाता हुआ रंगभूमि में आया, पसीने में, उसका वस्त्र खिसकता हुआ। अधिरथ, सारथी। और अंग के नए राजा ने झुककर उसके चरण छुए। मेरा पुत्र, वृद्ध ने कहा। मेरा पुत्र।')],
    [sh(bg(set='arena', tod='dusk'), 'arena_dusk'), figs('fa', [fig('charioteer', 640, 880, 500, 1, 'bless', style=dict(hair='#d8d4cc')), fig('karna', 940, 880, 560, -1, 'bowLow')], rim=RIM_GOLD)],
    cam=push(790, 470, 1.04, 1.14), amb='crowd'),
  S('k_bhima', 'tension', [
      ln('BHIMA', 'A charioteer\'s son! You are not fit to die by Arjuna\'s hand. Pick up a whip and go back to your horses!', 'सारथी का बेटा! तुम अर्जुन के हाथों मरने योग्य भी नहीं। चाबुक उठाओ और अपने घोड़ों के पास लौट जाओ!', fx='growl')],
    [sh(bg(set='arena', tod='dusk'), 'arena_dusk'), face('bhima', 1060, 450, 180, -1, 'cruel', rim=RIM_FIRE)],
    cam=push(1040, 450, 1.04, 1.14), amb='crowd', sfx=[dict(n='crowdlaugh', at=4.0, v=0.6)]),
  S('k_kunti', 'lament', [
      ln('VYASA', 'In the royal stand, Kunti saw the earrings, and the armour, and knew her firstborn. She fainted. Vidura sprinkled water on her face. When she woke, she said nothing at all.',
                  'राजकीय आसनों में कुंती ने कुंडल देखे, और कवच, और अपने पहले पुत्र को पहचान लिया। वे मूर्छित हो गईं। विदुर ने उनके मुख पर जल छिड़का। जब वे जागीं, तो उन्होंने कुछ भी नहीं कहा।')],
    [sh(bg(set='arena', tod='dusk'), 'arena_dusk'), face('kunti', 800, 450, 200, 1, 'sorrow', rim=RIM_GOLD)],
    cam=push(800, 450, 1.05, 1.18), amb='wind', sfx=[dict(n='heartbeat', at=2.0, v=0.4)]),
  S('k_sunset', 'lament', [], [sh(bg(set='sky', tod='dusk', sun=[900, 560, 160], sunCol='#e05a2a', hills=1, ground='#3a2014'), 'sky_dusk'), fx('dust', col='#e08050', n=50)],
    cam=[[800, 470, 1.15], [800, 500, 1.0]], amb='wind', min=6),

  # ---------- the teacher's fee ----------
  S('l_fee', 'fire', [
      ln('DRONA', 'Your training is finished. Now pay my fee. Bring me Drupada, king of Panchala, bound in chains.', 'तुम्हारी शिक्षा पूर्ण हुई। अब मेरी दक्षिणा चुकाओ। मेरे सामने पांचाल के राजा द्रुपद को बंदी बनाकर लाओ।', fx='elder')],
    [sh(bg(set='field', sunX=1100, sunY=520, armies=0), 'field_empty'), face('drona', 800, 440, 200, 1, 'anger', rim=RIM_FIRE)],
    cam=push(800, 450, 1.0, 1.14), amb='wind', sfx=[dict(n='nagara', at=5.0, v=0.5)]),
  S('l_kauravas', 'battle', [
      ln('VYASA', 'The Kauravas rode first, shouting, racing each other for the glory. Drupada\'s archers cut them to pieces and they came back in disorder.',
                  'कौरव पहले गए, चिल्लाते हुए, यश के लिए एक दूसरे से होड़ करते हुए। द्रुपद के धनुर्धरों ने उन्हें छिन्न भिन्न कर दिया और वे अस्त व्यस्त होकर लौटे।')],
    [sh(bg(set='valley', tod='crimson', hz=450, seed=3.3, groves=8), 'valley_crimson'), piece('charge', 'riders', k='anim', every=2, x=200, y=830, s=110, cnt=7, speed=80), piece('rain', 'arrowRain', k='anim', every=2, add=True)],
    cam=pan(560, 1040, 470, 1.15), amb='battle', sfx=[dict(n='hooves', at=0.3), dict(n='clash', at=3.0), dict(n='roar', at=6.0, v=0.5)]),
  S('l_arjuna', 'battle', [
      ln('VYASA', 'Then the five Pandavas went in. Bhima with his mace cleared a road through the elephants. Arjuna drove straight to the king\'s chariot, broke his bow, and leapt aboard.',
                  'फिर पाँचों पांडव गए। भीम ने गदा से हाथियों के बीच मार्ग बनाया। अर्जुन सीधे राजा के रथ तक पहुँचे, उनका धनुष तोड़ा, और उस पर कूद गए।')],
    [sh(bg(set='field', sunX=1100, sunY=520, armies=0), 'field_empty'), piece('ch', 'warChariot', k='anim', every=2, x=700, y=880, s=0.85, rider='arjuna'), fx('dust', col='#c07a4a', n=90)],
    cam=push(800, 480, 1.0, 1.1), amb='battle', sfx=[dict(n='clash', at=1.0), dict(n='whoosh', at=3.0), dict(n='crack', at=7.0, v=0.6), dict(n='roar', at=9.0, v=0.5)], shake=[[7.0, 7.6]]),
  S('l_bound', 'tension', [
      ln('DRONA', 'Do you remember me now, king? You said a king cannot be the friend of a beggar. So now I am a king. I keep half your kingdom, north of the Ganga. The south I give back to you. Now we are equals. Now we can be friends.',
                  'अब याद आया, राजन? तुमने कहा था कि राजा भिखारी का मित्र नहीं हो सकता। तो अब मैं राजा हूँ। गंगा के उत्तर का आधा राज्य मैं रखता हूँ। दक्षिण का तुम्हें लौटाता हूँ। अब हम बराबर हैं। अब हम मित्र हो सकते हैं।', fx='elder')],
    [sh(bg(set='field', sunX=1100, sunY=520, armies=0), 'field_empty'), figs('capt', [fig('drona', 620, 880, 560, 1, 'stand'), fig('drupada', 980, 880, 480, -1, 'despair')], rim=RIM_FIRE)],
    cam=push(800, 470, 1.04, 1.14), amb='wind'),
  S('l_drupada', 'kala', [
      ln('VYASA', 'Drupada smiled, and bowed, and went home. And there he lit a sacrificial fire, and prayed for two things: a son who would kill Drona, and a daughter who would bring down the house of the Kurus.',
                  'द्रुपद मुस्कुराए, झुके, और घर चले गए। और वहाँ उन्होंने एक यज्ञ की अग्नि जलाई, और दो चीज़ों की प्रार्थना की: एक पुत्र जो द्रोण का वध करे, और एक पुत्री जो कुरुओं के कुल का पतन करे।')],
    [sh(bg(set='void', base='#2a0608', mandala=300, my=440, col='#ffb060'), 'void_fire'), fx('fire', at=[[800, 820, 260, 360]]), fx('embers', n=120), face('drupada', 800, 400, 160, 1, 'anger', rim=RIM_FIRE)],
    cam=push(800, 500, 1.0, 1.14), amb='fire', sfx=[dict(n='fire', at=0.5, v=0.6), dict(n='om', at=4.0, v=0.4), dict(n='boom', at=11.0, v=0.4)]),

  # ---------- the heir, and the plot ----------
  S('m_heir', 'court', [
      ln('VYASA', 'A year later, Dhritarashtra named Yudhishthira crown prince of Hastinapura. The people rejoiced. They said the son of Pandu would be a king like his father.',
                  'एक वर्ष बाद धृतराष्ट्र ने युधिष्ठिर को हस्तिनापुर का युवराज घोषित किया। प्रजा ने उत्सव मनाया। लोग कहते थे कि पांडु का पुत्र अपने पिता जैसा राजा होगा।')],
    [sh(bg(set='court', tone='#4a1612', throne=[800, 660, 240], canopy=1), 'court_red2'), figs('crown', [fig('yudhi', 800, 880, 560, 1, 'bless', style=dict(beard=None))], rim=RIM_GOLD), fx('petals', every=2, n=60)],
    cam=push(800, 470, 1.04, 1.14), amb='court', sfx=[dict(n='conch', at=0.5, v=0.5), dict(n='cheer', at=2.0, v=0.4)]),
  S('m_shakuni', 'tension', [
      ln('VYASA', 'And Duryodhana sat in the dark with his uncle Shakuni, and with his new friend Karna, and spoke very softly about a house in Varanavata, made of lac and pitch and dry hemp. A house that would burn.',
                  'और दुर्योधन अपने मामा शकुनि, और अपने नए मित्र कर्ण के साथ अंधेरे में बैठा, और बहुत धीमे स्वर में वारणावत के एक भवन की बातें करता रहा, लाख, राल और सूखे सन से बना। एक भवन जो जलेगा।')],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), face('shakuni', 560, 450, 180, 1, 'cruel', n='sh', rim=RIM_LAMP), face('duryo', 1060, 450, 180, -1, 'cruel', n='du', rim=RIM_FIRE, style=dict(stache=None)), fx('embers', n=40)],
    cam=[[640, 460, 1.1], [960, 460, 1.1]], amb='night', sfx=[dict(n='heartbeat', at=6.0, v=0.4)]),
  S('m_cave', 'mystery', [
      ln('GANESHA', 'A house that would burn, with five brothers and their mother inside.', 'एक भवन जो जलेगा, भीतर पाँच भाइयों और उनकी माँ के साथ।'),
      ln('VYASAC', 'Tomorrow, scribe. Rest your hand. Tomorrow there is fire, a forest, a demon, and a bride.', 'कल, लेखक। अपने हाथ को विश्राम दो। कल अग्नि है, एक वन है, एक राक्षस है, और एक दुल्हन।', gap=0.8)],
    CAVE(), cam=[[800, 470, 1.05], [800, 520, 1.3]], amb='night', tout='fade', min=12),
  ])
