# Season 1, Episode 7: the forest years, Hanuman, Karna's armour, the Yaksha, and the year in disguise at Virata.

def build(EP, S, ln, bg, face, figs, fig, piece, fx, name, push, pan, hold, sh, CAVE, CAVE_V, CAVE_G, CAVE_CAM, RIM_GOLD, RIM_FIRE, RIM_COOL, RIM_LAMP):
  RIM_MOON = ['#cfe4ff', -3, -2, 0.55]
  RIM_SUN = ['#ffe08a', -3, -2, 0.8]
  KGLOW = ['#7ab0ff', 26, 0.35]
  BARK = dict(dhoti='#8a6a3a', crown='bun', scarf='#7a5a2a', jewel='#8a7a5a')
  VCOURT = lambda: sh(bg(set='court', tone='#1a3a2a', throne=[800, 660, 240], canopy=1), 'virata_court')
  EP(7, 'The Lake of Questions and the Year in Disguise', 'यक्ष प्रश्न और अज्ञातवास', 'Twelve years in the forest, a lake that asks, and the mightiest men on earth hidden as servants.', 'बारह वर्ष वन में, एक झील जो प्रश्न पूछती है, और सेवक बनकर छिपे पृथ्वी के सबसे शक्तिशाली पुरुष।', [
  S('a_cave', 'mystery', [
      ln('VYASA', 'The seventh night. Spring had come to the mountain. A bird had built its nest above the mouth of the cave, and the leaves in Ganesha\'s basket were piled higher than his crown.',
                  'सातवीं रात। पर्वत पर वसंत आ गया था। एक पक्षी ने गुफा के मुहाने के ऊपर घोंसला बना लिया था, और गणेश की टोकरी में पत्ते उनके मुकुट से भी ऊँचे हो गए थे।', at=5.0)],
    CAVE('dawn'), cam=[[800, 520, 1.3], [800, 470, 1.05]], amb='birds', min=12, eptitle=1, tin='fade'),
  S('a_ask', 'krishna', [
      ln('GANESHA', 'Twelve years in the forest. What happens in twelve years, Muni, to men who were kings?', 'वन में बारह वर्ष। बारह वर्षों में क्या होता है, मुनिवर, उन पुरुषों का जो राजा थे?'),
      ln('VYASAC', 'They are tested. By hunger, by demons, by gods in disguise. And by their own anger, most of all.', 'उनकी परीक्षा होती है। भूख से, राक्षसों से, वेश बदले देवताओं से। और सबसे अधिक, अपने ही क्रोध से।', gap=0.8)],
    CAVE_G(), cam=push(820, 430, 1.0, 1.08), amb='night'),
  S('a_hermitage', 'forest', [
      ln('VYASA', 'In the Dvaita forest they lived like hermits. Before dawn the brahmins chanted by the lake. Bhima hunted, the twins gathered roots and fruit, Arjuna practised with his bow until his arms ached, and Yudhishthira listened to the sages tell the old stories, of Nala, of Savitri, of Rama.',
                  'द्वैत वन में वे तपस्वियों की तरह रहे। भोर से पहले ब्राह्मण झील किनारे वेद पढ़ते। भीम आखेट करते, जुड़वाँ भाई कंद मूल फल बटोरते, अर्जुन तब तक धनुष का अभ्यास करते जब तक भुजाएँ दुखने न लगें, और युधिष्ठिर ऋषियों से पुरानी कथाएँ सुनते, नल की, सावित्री की, राम की।')],
    [sh(bg(set='lake', tod='dawn'), 'lake_dawn'), piece('leaves', 'lotusLeaf', at=[[500, 820, 90], [1100, 830, 100]]), fx('ripples', x=800, y=840), fx('fireflies', n=20)],
    cam=[[800, 520, 1.2], [800, 460, 1.0]], amb='birds', sfx=[dict(n='om', at=2.0, v=0.3), dict(n='bell', at=10.0, v=0.3)], min=12),

  # ---------- Durvasa and the grain of rice ----------
  S('b_durvasa', 'tension', [
      ln('VYASA', 'Duryodhana sent the sage Durvasa to visit them, with ten thousand disciples, timed to arrive after Draupadi had eaten, when the Sun\'s vessel was empty for the day. The sage went to bathe in the river, and said he would come back hungry.',
                  'दुर्योधन ने ऋषि दुर्वासा को दस हज़ार शिष्यों के साथ उनके पास भेजा, ठीक उस समय जब द्रौपदी भोजन कर चुकी हों, और सूर्य का पात्र उस दिन के लिए खाली हो। ऋषि नदी में स्नान करने गए, और कहा कि वे भूखे लौटेंगे।')],
    [sh(bg(set='lake', tod='day'), 'lake_day'), face('durvasa', 800, 440, 200, 1, 'anger', rim=RIM_GOLD)],
    cam=push(800, 450, 1.0, 1.14), amb='birds', sfx=[dict(n='gasp', at=12.0, v=0.3)]),
  S('b_pray', 'krishna', [
      ln('VYASA', 'Draupadi knew Durvasa\'s curses. She prayed. And Krishna was standing in front of her, smiling, saying he was hungry. She showed him the empty vessel. He found one grain of rice and one leaf of green stuck to its rim, and ate it.',
                  'द्रौपदी दुर्वासा के शापों को जानती थीं। उन्होंने प्रार्थना की। और कृष्ण उनके सामने खड़े थे, मुस्कुराते हुए, कहते हुए कि उन्हें भूख लगी है। उन्होंने खाली पात्र दिखाया। कृष्ण ने उसके किनारे चिपका चावल का एक दाना और साग का एक पत्ता ढूँढा, और खा लिया।'),
      ln('KRISHNA', 'May the soul of the whole world be satisfied.', 'संपूर्ण विश्व की आत्मा तृप्त हो।', gap=0.6)],
    [sh(bg(set='lake', tod='day'), 'lake_day'), face('krishna', 1040, 440, 200, -1, 'smile', rim=RIM_MOON, glow=KGLOW)],
    cam=push(1020, 450, 1.0, 1.14), amb='birds', sfx=[dict(n='flute', at=0.5, v=0.5), dict(n='sparkle', at=17.0)]),
  S('b_full', 'joy', [
      ln('VYASA', 'In the river, Durvasa and his ten thousand disciples felt suddenly as full as if they had feasted for a week. Ashamed to face a host they could not eat with, they crept away through the trees.',
                  'नदी में दुर्वासा और उनके दस हज़ार शिष्यों को अचानक ऐसा लगा जैसे उन्होंने सप्ताह भर भोज किया हो। जिस आतिथेय के साथ वे खा न सकें, उसका सामना करने में लज्जित होकर, वे पेड़ों के बीच से चुपचाप खिसक गए।')],
    [sh(bg(set='river', tod='day', hz=560), 'river_day7'), piece('folk', 'folk', cnt=24, y=780, dy=50, s=36, seed=31, speed=30), fx('ripples', x=800, y=820)],
    cam=pan(560, 1040, 470, 1.12), amb='river', sfx=[dict(n='splash', at=1.0, v=0.3), dict(n='crowdlaugh', at=8.0, v=0.2)]),

  # ---------- Jayadratha ----------
  S('c_jaya', 'tension', [
      ln('VYASA', 'One day, while the brothers were out hunting, King Jayadratha of Sindhu passed by the hermitage. He was the husband of Dushala, the only sister of the Kauravas. He saw Draupadi alone, and dragged her into his chariot.',
                  'एक दिन, जब भाई आखेट पर गए थे, सिंधु के राजा जयद्रथ आश्रम के पास से गुज़रे। वे दुःशला के पति थे, कौरवों की एकमात्र बहन के। उन्होंने द्रौपदी को अकेला देखा, और उन्हें घसीटकर अपने रथ में बिठा लिया।')],
    [sh(bg(set='forest', tod='day'), 'forest_day'), face('jayadratha', 800, 440, 200, 1, 'cruel', rim=RIM_FIRE)],
    cam=push(800, 450, 1.0, 1.14), amb='birds', sfx=[dict(n='gasp', at=10.0, v=0.5)], hero=1, name=name('JAYADRATHA', 'जयद्रथ', 'king of Sindhu', 'सिंधु नरेश', 1)),
  S('c_chase', 'battle', [
      ln('VYASA', 'The brothers came back and gave chase. Jayadratha\'s army was scattered like chaff. Bhima caught the king, threw him down, and shaved his head, leaving five tufts of hair, one for each brother.',
                  'भाई लौटे और पीछा किया। जयद्रथ की सेना भूसे की तरह बिखर गई। भीम ने राजा को पकड़ा, पटक दिया, और उसका सिर मूँड़ दिया, पाँच चोटियाँ छोड़कर, हर भाई के लिए एक।')],
    [sh(bg(set='valley', tod='day', hz=430, seed=1.2, groves=18), 'valley_day'), piece('ch', 'warChariot', k='anim', every=2, x=300, y=860, s=0.6, rider='bhima'), piece('ar', 'arrowRain', k='anim', every=2, add=True), fx('dust', col='#e0b070', n=60)],
    cam=pan(560, 1040, 470, 1.15), amb='battle', sfx=[dict(n='hooves', at=0.3), dict(n='whoosh', at=3.0), dict(n='clash', at=6.0), dict(n='crowdlaugh', at=12.0, v=0.4)]),
  S('c_vow', 'kala', [
      ln('VYASA', 'Yudhishthira let him go, for Dushala\'s sake. Jayadratha went to the Himalaya and prayed to Shiva, and asked for one thing: to stop all five Pandavas in battle for a single day. Shiva granted it, all except Arjuna. One day, that would be enough.',
                  'दुःशला के कारण युधिष्ठिर ने उसे छोड़ दिया। जयद्रथ हिमालय गया और शिव की प्रार्थना की, और एक ही चीज़ माँगी: एक दिन के लिए युद्ध में पाँचों पांडवों को रोक सकूँ। शिव ने यह दिया, अर्जुन को छोड़कर। एक दिन, वह पर्याप्त होगा।')],
    [sh(bg(set='himalaya'), 'himal_peaks'), face('jayadratha', 560, 450, 180, 1, 'anger', rim=RIM_COOL), fx('snow', n=60)],
    cam=push(580, 450, 1.04, 1.14), amb='wind', sfx=[dict(n='damaru', at=8.0, v=0.4)]),
  S('c_lake', 'forest', [
      ln('VYASA', 'The seasons kept turning. The brothers grew lean and brown and quiet. Their beards grew long. Draupadi learned the names of every bird in the forest. And every evening Yudhishthira counted: so many years gone, so many left.',
                  'ऋतुएँ बदलती रहीं। भाई दुबले, साँवले और शांत होते गए। उनकी दाढ़ियाँ लंबी हो गईं। द्रौपदी ने वन के हर पक्षी का नाम सीख लिया। और हर साँझ युधिष्ठिर गिनते: इतने वर्ष बीते, इतने बचे।')],
    [sh(bg(set='lake', tod='dusk'), 'lake_dusk7'), fx('fireflies', n=40), fx('ripples', x=800, y=840)],
    cam=[[800, 470, 0.98], [800, 540, 1.15]], amb='night', min=12),

  # ---------- Bhima and Hanuman ----------
  S('d_lotus', 'river', [
      ln('VYASA', 'In the mountains near Badari, the wind blew a golden lotus with a thousand petals to Draupadi\'s feet. Its scent was like nothing on earth. She asked Bhima to find more. He went at once, up the mountain, smashing through the forest like an elephant.',
                  'बदरी के निकट पर्वतों में, हवा ने हज़ार पंखुड़ियों वाला एक सुनहरा कमल द्रौपदी के चरणों में ला डाला। उसकी सुगंध पृथ्वी की किसी चीज़ जैसी नहीं थी। उन्होंने भीम से और ढूँढने को कहा। वे तुरंत चल पड़े, पर्वत पर, हाथी की तरह वन को चीरते हुए।')],
    [bg(set='valley', tod='dawn', hz=420, seed=7.2, groves=6, mist=1), piece('lotus', 'lotusLeaf', at=[[800, 860, 120]]), fx('petals', every=2, n=60), fx('sparkle', n=40)],
    cam=pan(560, 1040, 470, 1.15), amb='wind', min=11),
  S('d_climb', 'wonder', [
      ln('VYASA', 'He climbed through forests of deodar and fields of snow, past waterfalls that fell from the clouds. Lions fled from him. Elephants stepped aside. He roared for the joy of it, and the mountain roared back.',
                  'वे देवदार के वनों और हिम के मैदानों से होकर चढ़े, बादलों से गिरते झरनों के पास से। सिंह उनसे भागे। हाथी रास्ते से हट गए। वे आनंद में गरजे, और पर्वत ने भी गर्जना की।')],
    [sh(bg(set='himalaya'), 'himal_peaks'), figs('tiny', [fig('bhima', 760, 820, 130, 1, 'stand', style=BARK)]), fx('snow', n=40)],
    cam=[[800, 470, 0.98], [800, 540, 1.15]], amb='wind', sfx=[dict(n='roar', at=12.0, v=0.4)], min=10),
  S('d_tail', 'mystery', [
      ln('VYASA', 'On a narrow path through a banana grove, an old monkey lay asleep, and his tail lay across the path.', 'केलों के एक उपवन से होकर जाते संकरे मार्ग पर एक बूढ़ा वानर सो रहा था, और उसकी पूँछ मार्ग पर फैली थी।'),
      ln('BHIMA', 'Move your tail, old one. I am in a hurry.', 'अपनी पूँछ हटाओ, बूढ़े। मुझे जल्दी है।', fx='growl', gap=0.6),
      ln('HANUMAN', 'I am too old and weak to move it, child. You move it.', 'मैं इसे हटाने के लिए बहुत बूढ़ा और दुर्बल हूँ, बालक। तुम हटा दो।', gap=0.6)],
    [sh(bg(set='forest', tod='gold'), 'forest_gold'), piece('tail', 'monkeyTail', y=880)],
    cam=push(800, 700, 1.1, 1.3), amb='birds'),
  S('d_lift', 'tension', [
      ln('VYASA', 'Bhima took the tail in one hand and pulled. It did not move. He used both hands, and the veins stood out on his neck, and his face streamed with sweat. It did not move an inch.',
                  'भीम ने एक हाथ से पूँछ पकड़कर खींची। वह नहीं हिली। उन्होंने दोनों हाथ लगाए, और उनकी गर्दन की नसें उभर आईं, और चेहरे से पसीना बहने लगा। वह एक इंच भी नहीं हिली।')],
    [sh(bg(set='forest', tod='gold'), 'forest_gold'), piece('tail', 'monkeyTail', y=880), figs('bh', [fig('bhima', 600, 900, 620, 1, 'maceUp', style=BARK)], rim=RIM_GOLD)],
    cam=push(700, 520, 1.04, 1.16), amb='birds', sfx=[dict(n='heartbeat', at=6.0, v=0.5)]),
  S('d_hanuman', 'divine', [
      ln('VYASA', 'Then the old monkey smiled, and grew. He grew until he was taller than the mountain, blazing gold against the sky. It was Hanuman, son of the Wind, Bhima\'s own elder brother.',
                  'तब बूढ़ा वानर मुस्कुराया, और बढ़ने लगा। वह बढ़ता गया जब तक पर्वत से भी ऊँचा न हो गया, आकाश में सुनहरा धधकता हुआ। वे हनुमान थे, पवनपुत्र, भीम के अपने बड़े भाई।'),
      ln('HANUMAN', 'Strength without humility is a blind elephant, little brother. In the war that is coming, I will sit on Arjuna\'s banner, and roar with you.', 'विनम्रता के बिना बल अंधा हाथी है, छोटे भाई। आने वाले युद्ध में मैं अर्जुन की ध्वजा पर बैठूँगा, और तुम्हारे साथ गर्जना करूँगा।', gap=0.6)],
    [sh(bg(set='sky', tod='gold', hz=740, hills=1), 'sky_gold'), fx('rays', x=800, y=300, r0=120, r1=1000, col='#ffe0a0', spin=2), fx('glow', x=800, y=360, r=420, col='#ffb040'), fx('sparkle', n=60)],
    cam=[[800, 700, 1.3], [800, 380, 1.0]], amb='temple', sfx=[dict(n='swell', at=2.0, v=0.5), dict(n='roar', at=6.0, v=0.4), dict(n='om', at=10.0, v=0.4)], shake=[[6.0, 6.8]]),
  S('d_cave', 'mystery', [
      ln('GANESHA', 'The two sons of the Wind, on one mountain.', 'पवन के दो पुत्र, एक ही पर्वत पर।'),
      ln('VYASAC', 'And the stronger one was the one who lay down in the path, scribe. Remember that.', 'और अधिक बलवान वह था जो मार्ग में लेटा था, लेखक। यह याद रखना।', gap=0.8)],
    CAVE(), cam=CAVE_CAM['ga'], amb='night'),

  # ---------- Arjuna returns; the gandharvas ----------
  S('e_return', 'heroic', [
      ln('VYASA', 'In the fifth year Arjuna came down from heaven in Indra\'s chariot, shining like the sun, with every weapon of the gods. His brothers ran to him. Draupadi wept.',
                  'पाँचवें वर्ष अर्जुन इंद्र के रथ में स्वर्ग से उतरे, सूर्य की तरह चमकते हुए, देवताओं के हर अस्त्र के साथ। भाई उनकी ओर दौड़े। द्रौपदी रो पड़ीं।')],
    [sh(bg(set='himalaya'), 'himal_peaks'), piece('ch', 'warChariot', k='anim', every=2, x=500, y=600, s=0.7, rider='arjuna'), fx('rays', x=800, y=200, r0=60, r1=1000, col='#fff0c0'), fx('sparkle', n=60)],
    cam=[[800, 400, 1.2], [800, 470, 1.0]], amb='temple', sfx=[dict(n='conch', at=1.0, v=0.6), dict(n='cheer', at=6.0, v=0.4)]),
  S('e_ghosha', 'march', [
      ln('VYASA', 'Duryodhana could not resist coming to the forest in all his splendour, with Karna and his brothers and his queens, to let the Pandavas see him. On the way, he quarrelled with a band of gandharvas over a lake, and they took him prisoner.',
                  'दुर्योधन अपने पूरे वैभव में, कर्ण और भाइयों और रानियों के साथ, वन आने का लोभ न रोक सका, कि पांडव उसे देखें। मार्ग में एक झील को लेकर उसका गंधर्वों के एक दल से झगड़ा हुआ, और उन्होंने उसे बंदी बना लिया।')],
    [sh(bg(set='valley', tod='gold', hz=480, city=[1250, 300], seed=0.6), 'valley_gold4'), piece('proc', 'procession', k='anim', every=3, y=820, s=110, x0=-300, cnt=11, speed=40)],
    cam=pan(560, 1040, 460, 1.15), amb='crowd', sfx=[dict(n='nagara', at=0.4, v=0.5)]),
  S('e_rescue', 'sorrow', [
      ln('YUDHI', 'He is our cousin. In a quarrel among ourselves we are five against a hundred. Against outsiders, we are a hundred and five. Go, Arjuna, Bhima. Free him.',
                  'वह हमारा भाई है। आपस के झगड़े में हम सौ के विरुद्ध पाँच हैं। बाहर वालों के विरुद्ध हम एक सौ पाँच हैं। जाओ, अर्जुन, भीम। उसे मुक्त करो।')],
    [sh(bg(set='lake', tod='day'), 'lake_day'), face('yudhi', 800, 450, 200, 1, 'calm', rim=RIM_GOLD)],
    cam=push(800, 450, 1.0, 1.14), amb='birds'),
  S('e_shame', 'kala', [
      ln('VYASA', 'Arjuna freed him. And there was no humiliation in Duryodhana\'s life worse than that one: to owe his freedom to the men he hated. He sat down by the river and decided to starve himself to death. Karna talked him out of it.',
                  'अर्जुन ने उसे मुक्त कराया। और दुर्योधन के जीवन में इससे बड़ा अपमान कोई नहीं था: उन्हीं का ऋणी होना जिनसे वह घृणा करता था। वह नदी किनारे बैठ गया और भूखे मरने का निश्चय किया। कर्ण ने उसे मना लिया।'),
      ln('KARNA', 'I swear to you, I will kill Arjuna. Until that day I will not wash my feet, nor eat meat, nor refuse anyone who asks me for anything.', 'मैं तुमसे शपथ लेता हूँ, मैं अर्जुन का वध करूँगा। उस दिन तक मैं न अपने पैर धोऊँगा, न माँस खाऊँगा, न किसी माँगने वाले को मना करूँगा।', gap=0.6)],
    [sh(bg(set='river', tod='dusk', hz=560), 'river_dusk'), face('karna', 1040, 440, 200, -1, 'stern', rim=RIM_FIRE)],
    cam=push(1020, 450, 1.0, 1.16), amb='river', sfx=[dict(n='gong', at=20.0, v=0.5)]),

  # ---------- Karna's armour ----------
  S('f_surya', 'divine', [
      ln('VYASA', 'The Sun came to his son in a dream. He warned Karna that Indra would come to him in disguise, begging for his armour and earrings, the armour he was born with, that made him impossible to kill.',
                  'सूर्य स्वप्न में अपने पुत्र के पास आए। उन्होंने कर्ण को चेताया कि इंद्र वेश बदलकर उसके पास आएँगे, उसका कवच और कुंडल माँगने, वह कवच जिसके साथ वह जन्मा था, जो उसे अवध्य बनाता था।'),
      ln('SURYA', 'Refuse him, my son. Whatever your vow.', 'उन्हें मना कर देना, पुत्र। तुम्हारी प्रतिज्ञा जो भी हो।', gap=0.6)],
    [sh(bg(set='sky', tod='gold', sun=[800, 380, 220], sunCol='#f6b030', hills=1, ground='#8a5a3a'), 'sky_sun'), fx('rays', x=800, y=380, r0=200, r1=1000, col='#ffe0a0', spin=2), face('surya', 800, 420, 190, 1, 'divine', rim=RIM_SUN, glow=['#ffd060', 30, 0.4])],
    cam=push(800, 430, 1.0, 1.12), amb='temple', sfx=[dict(n='om', at=0.5, v=0.4)]),
  S('f_indra', 'sorrow', [
      ln('VYASA', 'At noon, when Karna stood in the river worshipping the Sun, an old brahmin came to him and held out his hand.', 'दोपहर को, जब कर्ण नदी में खड़े सूर्य की उपासना कर रहे थे, एक वृद्ध ब्राह्मण उनके पास आया और हाथ फैलाया।'),
      ln('INDRA', 'Generous Karna. I ask for your armour, and your earrings.', 'दानवीर कर्ण। मैं तुम्हारा कवच, और तुम्हारे कुंडल माँगता हूँ।', gap=0.6),
      ln('KARNA', 'I know who you are, lord of heaven. And I have never refused anyone. Take them.', 'मैं जानता हूँ आप कौन हैं, स्वर्ग के स्वामी। और मैंने कभी किसी को मना नहीं किया। ले लीजिए।', gap=0.6)],
    [bg(set='river', tod='gold', hz=520), figs('gift', [fig('brahmin', 560, 900, 520, 1, 'bless'), fig('karna', 960, 900, 600, -1, 'bowLow')], rim=RIM_SUN, glow=['#ffd060', 20, 0.3]), fx('sparkle', y0=600, y1=900, n=40)],
    cam=push(760, 480, 1.04, 1.14), amb='river'),
  S('f_cut', 'lament', [
      ln('VYASA', 'He took a knife and cut the armour from his own body, and the earrings from his ears, and handed them over, bleeding, smiling. Indra was so ashamed that he gave him a gift in return: the Shakti, a spear that never misses, which could be used once, to kill one man.',
                  'उन्होंने एक छुरी ली और अपने ही शरीर से कवच काट दिया, और कानों से कुंडल, और रक्त बहाते, मुस्कुराते हुए दे दिए। इंद्र इतने लज्जित हुए कि बदले में उन्हें एक उपहार दिया: शक्ति, एक भाला जो कभी चूकता नहीं, जिसे एक बार, एक व्यक्ति को मारने के लिए चलाया जा सकता था।')],
    [bg(set='river', tod='gold', hz=520), face('karna', 800, 450, 210, 1, 'sorrow', rim=RIM_SUN), fx('embers', n=40, col='#ffb060')],
    cam=push(800, 450, 1.04, 1.2), amb='river', sfx=[dict(n='heartbeat', at=1.0, v=0.4), dict(n='thunder', at=14.0, v=0.4)], hero=1, name=name('KARNA', 'कर्ण', 'the giver', 'दानवीर', 1)),

  # ---------- the Yaksha ----------
  S('g_thirst', 'mystery', [
      ln('VYASA', 'In the last year of the forest, the brothers chased a deer that had stolen a brahmin\'s fire-sticks, and lost it, and were dying of thirst. Nakula climbed a tree and saw a lake. He went to fetch water.',
                  'वन के अंतिम वर्ष में भाइयों ने एक हिरण का पीछा किया जो एक ब्राह्मण की अरणि लेकर भाग गया था, और वह खो गया, और वे प्यास से मर रहे थे। नकुल ने एक पेड़ पर चढ़कर एक झील देखी। वे पानी लेने गए।')],
    [sh(bg(set='forest', tod='day'), 'forest_day'), piece('runner', 'deer', at=[[1100, 880, 260, 1]]), fx('dust', col='#e0c080', n=50)],
    cam=pan(600, 1000, 470, 1.15), amb='wind'),
  S('g_lake', 'mystery', [
      ln('YAKSHA', 'Stop! This lake is mine. Answer my questions first, and then drink.', 'रुको! यह झील मेरी है। पहले मेरे प्रश्नों का उत्तर दो, फिर पियो।', fx='divine'),
      ln('VYASA', 'It was only a crane, standing in the water. Nakula was too thirsty to listen. He drank, and fell dead on the bank. Sahadeva came, and drank, and died. Then Arjuna. Then Bhima.',
                  'वह बस एक बगुला था, पानी में खड़ा। नकुल प्यास से इतने व्याकुल थे कि सुना नहीं। उन्होंने पानी पिया, और किनारे पर मृत होकर गिर पड़े। सहदेव आए, पिया, और मर गए। फिर अर्जुन। फिर भीम।', gap=0.8)],
    [sh(bg(set='lake', tod='mist'), 'lake_mist'), piece('crane', 'crane', x=1100, y=820, s=1.4), fx('ripples', x=1100, y=820)],
    cam=push(980, 620, 1.1, 1.25), amb='wind', sfx=[dict(n='splash', at=11.0, v=0.4), dict(n='gong', at=14.0, v=0.4), dict(n='gong', at=17.0, v=0.4)]),
  S('g_yudhi', 'lament', [
      ln('VYASA', 'Yudhishthira came last, and found his four brothers lying by the water, as if asleep. He did not drink. He wept, and then he listened.', 'युधिष्ठिर सबसे अंत में आए, और अपने चारों भाइयों को पानी के पास पड़ा पाया, जैसे सो रहे हों। उन्होंने पानी नहीं पिया। वे रोए, और फिर उन्होंने सुना।')],
    [sh(bg(set='lake', tod='mist'), 'lake_mist'), face('yudhi', 600, 450, 200, 1, 'sorrow', rim=RIM_COOL)],
    cam=push(620, 450, 1.04, 1.16), amb='wind'),
  S('g_q1', 'cosmic', [
      ln('YAKSHA', 'What is faster than the wind?', 'वायु से भी तेज़ क्या है?', fx='divine'),
      ln('YUDHI', 'The mind.', 'मन।', gap=0.6),
      ln('YAKSHA', 'What is more numerous than the grass?', 'घास से भी अधिक असंख्य क्या है?', fx='divine', gap=0.8),
      ln('YUDHI', 'Thoughts.', 'विचार।', gap=0.6),
      ln('YAKSHA', 'What is the greatest wonder in the world?', 'संसार का सबसे बड़ा आश्चर्य क्या है?', fx='divine', gap=0.8),
      ln('YUDHI', 'Every day, creatures go to the house of death. Yet those who remain believe they will live forever. What could be more wonderful than that?', 'हर दिन प्राणी यमलोक जाते हैं। फिर भी जो बचे हैं, वे मानते हैं कि वे सदा जीवित रहेंगे। इससे बड़ा आश्चर्य क्या हो सकता है?', gap=0.6)],
    [sh(bg(set='lake', tod='mist'), 'lake_mist'), piece('form', 'yakshaForm', k='plate', x=1050, y=430), fx('ripples', x=1050, y=800)],
    cam=push(900, 450, 1.0, 1.14), amb='void', sfx=[dict(n='om', at=0.5, v=0.4)], hero=1, name=name('THE YAKSHA', 'यक्ष', 'guardian of the lake', 'झील के रक्षक', -1)),
  S('g_q2', 'cosmic', [
      ln('YAKSHA', 'What is the path?', 'मार्ग क्या है?', fx='divine'),
      ln('YUDHI', 'Arguments lead nowhere. Scriptures disagree. There is no sage whose word is final. The truth of dharma is hidden in a cave. The path is the one the great have walked.',
                  'तर्क कहीं नहीं ले जाते। शास्त्र भिन्न भिन्न कहते हैं। कोई ऐसा ऋषि नहीं जिसका वचन अंतिम हो। धर्म का सत्य गुफा में छिपा है। मार्ग वही है जिस पर महापुरुष चले हैं।', gap=0.6)],
    [sh(bg(set='lake', tod='mist'), 'lake_mist'), face('yudhi', 800, 450, 200, 1, 'calm', rim=RIM_COOL, glow=['#e0f0ff', 20, 0.2])],
    cam=push(800, 450, 1.04, 1.16), amb='void'),
  S('g_q3', 'cosmic', [
      ln('YAKSHA', 'What is heavier than the earth? What is higher than the sky?', 'पृथ्वी से भारी क्या है? आकाश से ऊँचा क्या है?', fx='divine'),
      ln('YUDHI', 'A mother is heavier than the earth. A father is higher than the sky.', 'माता पृथ्वी से भारी है। पिता आकाश से ऊँचा है।', gap=0.6),
      ln('YAKSHA', 'What is the enemy that cannot be conquered? What is the disease that never ends?', 'वह कौन सा शत्रु है जिसे जीता नहीं जा सकता? वह कौन सा रोग है जो कभी समाप्त नहीं होता?', fx='divine', gap=0.8),
      ln('YUDHI', 'Anger is the enemy that cannot be conquered. Greed is the disease that never ends.', 'क्रोध वह शत्रु है जिसे जीता नहीं जा सकता। लोभ वह रोग है जो कभी समाप्त नहीं होता।', gap=0.6),
      ln('YAKSHA', 'Who is truly happy?', 'सच में सुखी कौन है?', fx='divine', gap=0.8),
      ln('YUDHI', 'The one who owes nothing, who is not in exile, and who cooks a few vegetables in his own home at the end of the day.', 'वह जिस पर कोई ऋण नहीं, जो प्रवास में नहीं, और जो दिन ढले अपने घर में थोड़ा सा साग पकाता है।', gap=0.6)],
    [sh(bg(set='lake', tod='mist'), 'lake_mist'), piece('form', 'yakshaForm', k='plate', x=1050, y=430), fx('ripples', x=1050, y=800)],
    cam=push(900, 450, 1.0, 1.14), amb='void'),
  S('g_choice', 'sorrow', [
      ln('YAKSHA', 'You have answered well. I will give you back one of your brothers. Choose.', 'तुमने अच्छे उत्तर दिए। मैं तुम्हें तुम्हारे भाइयों में से एक लौटाऊँगा। चुनो।', fx='divine'),
      ln('YUDHI', 'Nakula.', 'नकुल।', gap=0.8),
      ln('YAKSHA', 'Not Bhima, who is your strength? Not Arjuna, who will win your war?', 'भीम नहीं, जो तुम्हारा बल है? अर्जुन नहीं, जो तुम्हारा युद्ध जीतेगा?', fx='divine', gap=0.6),
      ln('YUDHI', 'My father had two wives. I am alive, a son of Kunti. Let a son of Madri live too.', 'मेरे पिता की दो पत्नियाँ थीं। मैं जीवित हूँ, कुंती का पुत्र। माद्री का भी एक पुत्र जीवित रहे।', gap=0.6)],
    [sh(bg(set='lake', tod='mist'), 'lake_mist'), piece('form', 'yakshaForm', k='plate', x=1050, y=430), fx('sparkle', n=40)],
    cam=push(900, 450, 1.04, 1.12), amb='void'),
  S('g_dharma', 'divine', [
      ln('VYASA', 'The Yaksha laughed, and became Dharma himself, Yudhishthira\'s own father. He brought all four brothers back to life, and gave them a blessing: in the year that was coming, no one would recognise them.',
                  'यक्ष हँसा, और स्वयं धर्म बन गया, युधिष्ठिर के अपने पिता। उन्होंने चारों भाइयों को फिर से जीवित किया, और उन्हें आशीर्वाद दिया: आने वाले वर्ष में कोई उन्हें पहचान नहीं पाएगा।')],
    [sh(bg(set='lake', tod='dawn'), 'lake_dawn'), face('dharma', 800, 440, 210, 1, 'smile', rim=RIM_GOLD, glow=['#fff0c0', 30, 0.35]), fx('rays', x=800, y=200, r0=60, r1=900, col='#fff0c0')],
    cam=push(800, 450, 1.0, 1.14), amb='temple', sfx=[dict(n='bells', at=0.5), dict(n='om', at=4.0, v=0.4)]),
  S('g_wake', 'joy', [
      ln('VYASA', 'The four brothers sat up by the water, as if from sleep, and could not understand why Yudhishthira was weeping and laughing at once. And the brahmin\'s fire-sticks lay on the grass beside them, returned.',
                  'चारों भाई पानी के पास ऐसे उठ बैठे जैसे नींद से, और समझ नहीं पाए कि युधिष्ठिर एक साथ रो और हँस क्यों रहे हैं। और ब्राह्मण की अरणि उनके पास घास पर पड़ी थी, लौटाई हुई।')],
    [sh(bg(set='lake', tod='dawn'), 'lake_dawn'), figs('wake', [fig('nakula', 480, 880, 400, 1, 'stand', style=BARK), fig('sahadeva', 680, 880, 400, 1, 'stand', style=BARK), fig('arjuna', 900, 880, 420, -1, 'stand', style=BARK), fig('bhima', 1130, 880, 460, -1, 'stand', style=BARK)], rim=RIM_GOLD), fx('sparkle', n=30)],
    cam=[[800, 480, 1.0], [800, 500, 1.1]], amb='birds'),
  S('g_shami', 'mystery', [
      ln('VYASA', 'Before they entered the city of Virata, they wrapped their weapons in hides, Gandiva and Bhima\'s mace and the swords of the twins, and tied the bundle high in a shami tree near the burning ground, and hung a corpse beside it, so no one would go near.',
                  'विराट नगर में प्रवेश करने से पहले उन्होंने अपने अस्त्र खालों में लपेटे, गांडीव और भीम की गदा और जुड़वाँ भाइयों की तलवारें, और गठरी को श्मशान के पास एक शमी के पेड़ पर ऊँचा बाँध दिया, और उसके पास एक शव लटका दिया, कि कोई पास न जाए।')],
    [sh(bg(set='forest', tod='dusk', season='autumn'), 'forest_autumn7'), fx('leaves', n=40), fx('dust', col='#806050', n=20)],
    cam=[[800, 520, 1.15], [800, 470, 1.0]], amb='wind', sfx=[dict(n='wind', at=1.0, v=0.4)], min=10),

  # ---------- Virata ----------
  S('h_virata', 'court', [
      ln('VYASA', 'For the thirteenth year they went to the kingdom of Matsya, ruled by old King Virata, and entered his service one by one, under false names.', 'तेरहवें वर्ष के लिए वे मत्स्य देश गए, जहाँ वृद्ध राजा विराट का राज्य था, और एक एक कर झूठे नामों से उनकी सेवा में लग गए।')],
    [sh(bg(set='city', tod='gold', hz=600, col='#c8b08a'), 'virata_city'), piece('folk', 'folk', cnt=16, y=660, dy=40, s=40, seed=41)],
    cam=[[800, 600, 1.35], [800, 460, 1.0]], amb='crowd', min=10),
  S('h_disguise', 'mystery', [
      ln('VYASA', 'Yudhishthira became Kanka, a brahmin who played dice with the king. Bhima became Ballava, the cook. The twins became a keeper of horses and a keeper of cows. Draupadi became Sairandhri, maid to the queen.',
                  'युधिष्ठिर कंक बने, एक ब्राह्मण जो राजा के साथ पासे खेलता था। भीम बल्लव बने, रसोइया। जुड़वाँ भाई अश्वपाल और गोपाल बने। द्रौपदी सैरंध्री बनीं, रानी की दासी।')],
    [VCOURT(), figs('servants', [fig('yudhi', 360, 880, 400, 1, 'stand', style=dict(dhoti='#f0e8d0', crown='bun')), fig('bhima', 560, 880, 440, 1, 'stand', style=dict(dhoti='#e8dcc0', crown='band', scarf=None)), fig('nakula', 760, 880, 380, 1, 'stand', style=dict(dhoti='#6a5a3a', crown='turban')), fig('sahadeva', 940, 880, 380, 1, 'stand', style=dict(dhoti='#5a6a3a', crown='turban')), dict(who='sairandhri', x=1160, y=880, S=380, f=-1)])],
    cam=pan(560, 1040, 480, 1.12), amb='court'),
  S('h_brihan', 'mystery', [
      ln('VYASA', 'And Arjuna, the greatest archer on earth, chose this year for Urvashi\'s curse. He became Brihannala, in a woman\'s clothes and bangles, the dancing teacher of the princess Uttara.',
                  'और अर्जुन, पृथ्वी के सबसे महान धनुर्धर, ने उर्वशी के शाप के लिए यही वर्ष चुना। वे बृहन्नला बने, स्त्री के वस्त्रों और कंगनों में, राजकुमारी उत्तरा के नृत्य शिक्षक।')],
    [VCOURT(), figs('dance', [fig('brihannala', 640, 880, 560, 1, 'flute'), dict(who='uttaraW', x=980, y=880, S=440, f=-1)], rim=RIM_GOLD), fx('petals', every=2, n=40)],
    cam=push(800, 470, 1.04, 1.12), amb='court', sfx=[dict(n='bells', at=1.0, v=0.4)], hero=1, name=name('BRIHANNALA', 'बृहन्नला', 'the dancing teacher', 'नृत्य शिक्षक', 1)),
  S('h_wrestle', 'battle', [
      ln('VYASA', 'At the great festival of Brahma, a wrestler named Jimuta came to Matsya and challenged every man in the kingdom. No one would face him. Then the cook, Ballava, rolled up his sleeves, and lifted Jimuta over his head, and whirled him round a hundred times, and threw him down.',
                  'ब्रह्मा के महोत्सव में जीमूत नाम का एक पहलवान मत्स्य आया और राज्य के हर पुरुष को ललकारा। कोई उसके सामने नहीं आया। तब रसोइये बल्लव ने आस्तीनें चढ़ाईं, और जीमूत को सिर के ऊपर उठाकर सौ बार घुमाया, और पटक दिया।')],
    [bg(set='arena', tod='day'), figs('wr', [fig('bhima', 640, 900, 620, 1, 'charge', style=dict(dhoti='#e8dcc0', crown='band')), fig('soldier', 960, 900, 600, -1, 'charge')], rim=RIM_GOLD), piece('folk', 'folk', cnt=20, y=640, dy=30, s=34, seed=44), fx('dust', col='#c08a5a', n=80)],
    cam=push(800, 480, 1.0, 1.14), amb='crowd', sfx=[dict(n='cheer', at=1.0, v=0.4), dict(n='boom', at=16.0, v=0.6), dict(n='cheer', at=17.0, v=0.6)], shake=[[16.0, 16.5]]),
  S('h_kichaka', 'kala', [
      ln('VYASA', 'The queen\'s brother, Kichaka, commander of Virata\'s army, saw Sairandhri, and wanted her. When she refused him, he kicked her in front of the court. Kanka, the king\'s dice-player, looked at the floor.',
                  'रानी के भाई कीचक, विराट की सेना के सेनापति, ने सैरंध्री को देखा, और उसे चाहा। जब उन्होंने मना किया, तो उसने भरी सभा में उन्हें लात मारी। कंक, राजा का पासे खेलने वाला, फ़र्श की ओर देखता रहा।')],
    [VCOURT(), face('kichaka', 800, 440, 210, 1, 'cruel', rim=RIM_FIRE)],
    cam=push(800, 450, 1.0, 1.16), amb='court', sfx=[dict(n='gasp', at=9.0, v=0.5)], hero=1, name=name('KICHAKA', 'कीचक', 'commander of Matsya', 'मत्स्य के सेनापति', 1)),
  S('h_kitchen', 'tension', [
      ln('DRAUPADI', 'Ballava. Wake up. Kichaka kicked me in front of the court today, and my husbands sat and watched. If you do not kill him, I will drink poison tomorrow.',
                     'बल्लव। जागो। आज कीचक ने भरी सभा में मुझे लात मारी, और मेरे पति बैठे देखते रहे। यदि तुमने उसे नहीं मारा, तो कल मैं विष पी लूँगी।'),
      ln('BHIMA', 'Tell him to meet you tonight, in the dancing hall. Alone.', 'उससे कहो आज रात तुमसे नृत्यशाला में मिले। अकेले।', fx='growl', gap=0.6)],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), face('draupadi', 560, 450, 180, 1, 'anger', n='dr', rim=RIM_LAMP), face('bhima', 1080, 450, 180, -1, 'anger', n='bh', rim=RIM_LAMP)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='night'),
  S('h_kill', 'battle', [
      ln('VYASA', 'Kichaka came to the dark hall, scented and garlanded, and reached for the figure on the couch. It was Bhima. They fought in the dark like two bulls. In the morning, Kichaka was found, crushed into a ball of flesh, his arms and legs pushed into his body.',
                  'कीचक सुगंधित और माला पहने अंधेरी शाला में आया, और पलंग पर लेटी आकृति की ओर हाथ बढ़ाया। वे भीम थे। वे अंधेरे में दो साँडों की तरह लड़े। सुबह कीचक मिला, माँस के एक गोले में कुचला हुआ, उसके हाथ पैर उसके शरीर में धँसे हुए।')],
    [bg(set='dark', base='#140608', glow='#3a1010'), figs('kfight', [fig('bhima', 620, 900, 620, 1, 'charge', style=dict(dhoti='#e8dcc0', crown='band')), fig('kichaka', 960, 900, 600, -1, 'charge')], rim=RIM_LAMP), fx('dust', col='#6a4a3a', n=60)],
    cam=push(800, 480, 1.04, 1.16), amb='night', sfx=[dict(n='roar', at=6.0, v=0.4), dict(n='boom', at=8.0, v=0.6), dict(n='crack', at=11.0, v=0.6), dict(n='gong', at=15.0, v=0.5)], shake=[[8.0, 8.6]]),
  S('h_pyre', 'fire', [
      ln('VYASA', 'Kichaka\'s hundred brothers blamed Sairandhri. They tied her to his funeral bier, to burn her with him. But a giant came over the city wall in the dark, with a whole tree torn up by the roots, and the hundred brothers did not live to light the fire.',
                  'कीचक के सौ भाइयों ने सैरंध्री को दोषी ठहराया। उन्होंने उन्हें उसकी अर्थी से बाँध दिया, कि उन्हें उसके साथ जला दें। पर अँधेरे में एक दैत्याकार पुरुष नगर की दीवार लाँघकर आया, जड़ से उखाड़ा हुआ पूरा पेड़ लिए, और सौ भाई आग लगाने तक जीवित नहीं रहे।')],
    [bg(set='dark', base='#140608', glow='#5a1a10'), fx('fire', at=[[800, 860, 260, 300]], n=80), fx('embers', n=80), figs('bh', [fig('bhima', 800, 900, 640, 1, 'maceUp', sil=True)])],
    cam=[[800, 520, 1.15], [800, 470, 1.0]], amb='fire', sfx=[dict(n='fire', at=0.5, v=0.5), dict(n='roar', at=12.0, v=0.5), dict(n='boom', at=14.0, v=0.5)], shake=[[14.0, 14.5]]),

  # ---------- the cattle raid ----------
  S('i_raid', 'battle', [
      ln('VYASA', 'News of Kichaka\'s death reached Hastinapura. Only Bhima, or Balarama, or Shalya, could kill a man like that, said Duryodhana. The Pandavas must be in Matsya. And the thirteenth year was almost over. So the Kauravas raided Virata\'s cattle, to draw them out.',
                  'कीचक की मृत्यु का समाचार हस्तिनापुर पहुँचा। दुर्योधन ने कहा, केवल भीम, या बलराम, या शल्य ही ऐसे व्यक्ति को मार सकते हैं। पांडव मत्स्य में ही होंगे। और तेरहवाँ वर्ष लगभग समाप्त था। तो कौरवों ने उन्हें बाहर निकालने के लिए विराट की गायें लूटीं।')],
    [sh(bg(set='valley', tod='day', hz=430, seed=1.2, groves=18), 'valley_day'), piece('herd', 'cattle', k='anim', every=2, speed=40, at=[[300, 860, 140, 1], [480, 880, 160, 1], [660, 860, 130, 1], [820, 875, 150, 1]]), piece('rd', 'riders', k='anim', every=2, x=-200, y=830, s=110, cnt=6, speed=60), fx('dust', col='#e0b070', n=80)],
    cam=pan(560, 1040, 470, 1.15), amb='battle', sfx=[dict(n='hooves', at=0.3, v=0.7), dict(n='roar', at=6.0, v=0.4)]),
  S('i_uttar', 'tension', [
      ln('VYASA', 'The king and his army were away in the south. Only the young prince Uttar was left, and he boasted to the women that he would beat the whole Kuru army alone, if only he had a charioteer.',
                  'राजा और उनकी सेना दक्षिण में थी। केवल युवा राजकुमार उत्तर बचे थे, और उन्होंने स्त्रियों के सामने डींग मारी कि वे अकेले पूरी कुरु सेना को हरा देंगे, बस कोई सारथी मिल जाए।'),
      ln('DRAUPADI', 'Brihannala once drove Arjuna\'s chariot, prince. Take her.', 'बृहन्नला ने कभी अर्जुन का रथ हाँका था, राजकुमार। उन्हें ले जाइए।', gap=0.6)],
    [VCOURT(), face('uttar', 1040, 450, 190, -1, 'smile', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.0, 1.14), amb='court', hero=1, name=name('UTTAR', 'उत्तर', 'prince of Matsya', 'मत्स्य के राजकुमार', -1)),
  S('i_army', 'battle', [
      ln('VYASA', 'When Uttar saw the Kuru army, Bhishma, Drona, Kripa, Karna, Ashwatthama, Duryodhana, spread across the plain like an ocean, he jumped from the chariot and ran. Brihannala ran after him, bangles jingling, and dragged him back by the hair.',
                  'जब उत्तर ने कुरु सेना देखी, भीष्म, द्रोण, कृप, कर्ण, अश्वत्थामा, दुर्योधन, सागर की तरह मैदान में फैले, तो वे रथ से कूदकर भागे। बृहन्नला कंगन खनकाती उनके पीछे दौड़ीं, और उन्हें केशों से पकड़कर वापस ले आईं।')],
    [bg(set='field', sunX=1100, sunY=520, armies=1, density=0.8), fx('dust', col='#c07a4a', n=80)],
    cam=[[800, 600, 1.35], [800, 460, 1.0]], amb='battle', sfx=[dict(n='conch', at=0.5, v=0.6), dict(n='nagara', at=2.0, v=0.5), dict(n='crowdlaugh', at=14.0, v=0.3)]),
  S('i_shami', 'heroic', [
      ln('VYASA', 'At a shami tree near a cremation ground, Brihannala made the prince climb up and bring down a bundle wrapped like a corpse. Inside were the weapons of the Pandavas. And Gandiva.',
                  'श्मशान के पास एक शमी के पेड़ पर बृहन्नला ने राजकुमार को चढ़ाकर एक गठरी उतरवाई जो शव की तरह लिपटी थी। उसके भीतर पांडवों के अस्त्र थे। और गांडीव।'),
      ln('ARJUNA', 'I am Arjuna, prince. Now you drive, and I will fight.', 'मैं अर्जुन हूँ, राजकुमार। अब तुम रथ हाँको, और मैं युद्ध करूँगा।', gap=0.6)],
    [bg(set='forest', tod='dusk', season='autumn'), figs('reveal', [fig('arjuna', 800, 900, 640, 1, 'bowLow', weapon='bowRest', style=dict(dhoti='#e86aa0'))], rim=RIM_GOLD, glow=['#ffe0a0', 20, 0.3]), fx('leaves', n=50)],
    cam=push(800, 470, 1.04, 1.16), amb='wind', sfx=[dict(n='sparkle', at=10.0), dict(n='conch', at=13.0, v=0.6)]),
  S('i_gandiva', 'heroic', [
      ln('VYASA', 'He unwrapped Gandiva and strung it, and plucked the string once. The sound rolled across the plain like thunder, and the horses of the Kuru army reared, and far away, Bhishma lifted his head and listened.',
                  'उन्होंने गांडीव खोला और उस पर प्रत्यंचा चढ़ाई, और एक बार डोरी खींची। वह ध्वनि मैदान में बादलों की गड़गड़ाहट की तरह लुढ़की, और कुरु सेना के घोड़े पिछले पैरों पर खड़े हो गए, और दूर, भीष्म ने सिर उठाकर सुना।')],
    [sh(bg(set='sky', tod='gold', hz=740, hills=1), 'sky_gold'), figs('bow', [fig('arjuna', 800, 900, 640, 1, 'draw', weapon='bowDrawn', style=dict(dhoti='#e86aa0'))], rim=RIM_GOLD), fx('rays', x=800, y=300, r0=100, r1=900, col='#fff0c0')],
    cam=push(800, 480, 1.0, 1.14), amb='wind', sfx=[dict(n='thunder', at=5.0, v=0.6), dict(n='hooves', at=7.0, v=0.4)], shake=[[5.0, 5.6]]),
  S('i_devadatta', 'battle', [
      ln('VYASA', 'He blew his conch, Devadatta, and the Kuru army knew that sound. Drona smiled. Karna gripped his bow. Duryodhana laughed: we have found them, and the year is not over!',
                  'उन्होंने अपना शंख, देवदत्त, फूँका, और कुरु सेना वह ध्वनि पहचानती थी। द्रोण मुस्कुराए। कर्ण ने अपना धनुष कसकर पकड़ा। दुर्योधन हँसा: हमने उन्हें खोज लिया, और वर्ष अभी पूरा नहीं हुआ!')],
    [bg(set='field', sunX=1100, sunY=520, armies=1, density=0.8), piece('ch', 'warChariot', k='anim', every=2, x=600, y=880, s=0.85, rider='arjuna', driver='uttar')],
    cam=push(800, 480, 1.0, 1.12), amb='battle', sfx=[dict(n='conch', at=0.3, v=0.9), dict(n='roar', at=3.0, v=0.4)]),
  S('i_bhishma', 'court', [
      ln('BHISHMA', 'You are wrong, Duryodhana. By the reckoning of the moon and the sun together, the thirteen years ended yesterday. They have kept their word, to the day.',
                    'तुम गलत हो, दुर्योधन। चंद्र और सूर्य दोनों की गणना से, तेरह वर्ष कल ही पूरे हो गए। उन्होंने अपना वचन निभाया है, दिन तक।', fx='elder')],
    [bg(set='field', sunX=1100, sunY=520, armies=1, density=0.8), face('bhishma', 1040, 440, 190, -1, 'calm', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.0, 1.14), amb='battle'),
  S('i_drona', 'court', [
      ln('VYASA', 'Drona looked at the single chariot coming towards the whole Kuru army, and smiled like a proud father. Karna boasted that he would kill Arjuna alone. Kripa told him he talked too much. Ashwatthama told him he would run. And they argued among themselves while Arjuna came on.',
                  'द्रोण ने पूरी कुरु सेना की ओर आते उस एक रथ को देखा, और एक गर्वित पिता की तरह मुस्कुराए। कर्ण ने डींग मारी कि वह अकेला अर्जुन को मार देगा। कृप ने कहा कि वह बहुत बोलता है। अश्वत्थामा ने कहा कि वह भाग जाएगा। और वे आपस में झगड़ते रहे जबकि अर्जुन बढ़ते आए।')],
    [bg(set='field', sunX=1100, sunY=520, armies=1, density=0.8), face('drona', 800, 450, 190, 1, 'smile', rim=RIM_GOLD)],
    cam=push(800, 450, 1.0, 1.14), amb='battle'),
  S('i_fight', 'battle', [
      ln('VYASA', 'Then Arjuna fought all of them, alone. He broke Karna\'s bow and drove him from the field. He bowed to Drona with two arrows at his feet, and fought him. And at the end he released the weapon of sleep, and the whole Kuru army fell unconscious where it stood.',
                  'फिर अर्जुन ने उन सबसे अकेले युद्ध किया। उन्होंने कर्ण का धनुष तोड़ा और उसे मैदान से खदेड़ दिया। उन्होंने द्रोण के चरणों में दो बाण चलाकर प्रणाम किया, और उनसे लड़े। और अंत में उन्होंने सम्मोहन अस्त्र छोड़ा, और पूरी कुरु सेना जहाँ खड़ी थी वहीं अचेत होकर गिर पड़ी।')],
    [bg(set='field', sunX=1100, sunY=520, armies=1, density=0.8), piece('ch2', 'warChariot', k='anim', every=2, x=700, y=880, s=0.85, rider='arjuna', driver='uttar'), piece('ar', 'arrowRain', k='anim', every=2, add=True), fx('dust', col='#c07a4a', n=90)],
    cam=push(800, 480, 1.0, 1.1), amb='battle', sfx=[dict(n='whoosh', at=1.0), dict(n='clash', at=4.0), dict(n='crack', at=6.0, v=0.6), dict(n='whoosh', at=10.0), dict(n='magic', at=16.0, v=0.6), dict(n='swell', at=17.0, v=0.5)], shake=[[6.0, 6.5]]),
  S('i_cloths', 'joy', [
      ln('VYASA', 'Uttara had asked Brihannala to bring her dolls. So Arjuna told Uttar to take the upper cloths of the sleeping warriors, Drona\'s white, Karna\'s yellow, Duryodhana\'s blue. Only Bhishma was not asleep. He had seen it all, and he smiled.',
                  'उत्तरा ने बृहन्नला से अपनी गुड़ियों के लिए कुछ लाने को कहा था। तो अर्जुन ने उत्तर से सोते योद्धाओं के उत्तरीय ले आने को कहा, द्रोण का श्वेत, कर्ण का पीला, दुर्योधन का नीला। केवल भीष्म नहीं सोए थे। उन्होंने सब देखा था, और वे मुस्कुराए।')],
    [bg(set='field', sunX=1100, sunY=520, armies=1, density=0.8), face('bhishma', 800, 450, 200, 1, 'smile', rim=RIM_GOLD), fx('dust', col='#f0c070', n=40)],
    cam=push(800, 450, 1.04, 1.16), amb='wind'),

  # ---------- revealed ----------
  S('j_reveal', 'joy', [
      ln('VYASA', 'Three days later, the Pandavas walked into Virata\'s court in their own clothes, and sat down on the royal seats. The old king did not know whether to be angry or afraid. Then Uttar told him who had saved his kingdom.',
                  'तीन दिन बाद पांडव अपने वस्त्रों में विराट की सभा में आए, और राजसिंहासनों पर बैठ गए। वृद्ध राजा समझ नहीं पाए कि क्रोध करें या डरें। तब उत्तर ने उन्हें बताया कि उनके राज्य को किसने बचाया था।')],
    [VCOURT(), face('virata', 800, 440, 200, 1, 'awe', rim=RIM_GOLD)],
    cam=push(800, 450, 1.0, 1.14), amb='court', sfx=[dict(n='gasp', at=8.0, v=0.4), dict(n='conch', at=14.0, v=0.4)], hero=1, name=name('VIRATA', 'विराट', 'king of Matsya', 'मत्स्य नरेश', 1)),
  S('j_wedding', 'joy', [
      ln('VYASA', 'Virata offered his daughter Uttara to Arjuna. Arjuna refused: he had been her teacher, a father to her for a year. But he took her as a daughter, for his son Abhimanyu. Krishna came to the wedding, and Drupada, and the armies of all their friends.',
                  'विराट ने अपनी पुत्री उत्तरा अर्जुन को देनी चाही। अर्जुन ने मना किया: वे एक वर्ष उसके गुरु, पिता समान रहे थे। पर उन्होंने उसे अपने पुत्र अभिमन्यु के लिए पुत्रवधू के रूप में स्वीकार किया। विवाह में कृष्ण आए, और द्रुपद, और उनके सब मित्रों की सेनाएँ।')],
    [sh(bg(set='city', tod='gold', hz=600, col='#c8b08a'), 'virata_city'), fx('petals', every=2, n=100), piece('lamps', 'floatLamps', k='anim', every=2, add=True)],
    cam=pan(560, 1040, 450, 1.15), amb='crowd', sfx=[dict(n='nagara', at=0.4, v=0.6), dict(n='conch', at=2.0, v=0.5), dict(n='cheer', at=4.0, v=0.5)], min=10),
  S('j_cave', 'mystery', [
      ln('GANESHA', 'Thirteen years, kept to the day. Now they will get their kingdom back.', 'तेरह वर्ष, दिन तक निभाए। अब उन्हें उनका राज्य वापस मिलेगा।'),
      ln('VYASAC', 'Will they, scribe? Tomorrow, Krishna goes to Hastinapura to ask for it. Write slowly. It is the last chance for peace.', 'क्या मिलेगा, लेखक? कल कृष्ण उसे माँगने हस्तिनापुर जाएँगे। धीरे लिखना। यह शांति का अंतिम अवसर है।', gap=0.8)],
    CAVE(), cam=[[800, 470, 1.05], [800, 520, 1.3]], amb='night', tout='fade', min=12),
  ])
