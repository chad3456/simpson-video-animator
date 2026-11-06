# Season 1, Episode 6: the disrobing, Bhima's vows, the exile, and Arjuna's quest for the weapons of the gods.

def build(EP, S, ln, bg, face, figs, fig, piece, fx, name, push, pan, hold, sh, CAVE, CAVE_V, CAVE_G, CAVE_CAM, RIM_GOLD, RIM_FIRE, RIM_COOL, RIM_LAMP):
  RIM_MOON = ['#cfe4ff', -3, -2, 0.55]
  KGLOW = ['#7ab0ff', 26, 0.35]
  POOR = dict(dhoti='#e8dcc0', crown='bun', scarf='#d9c9a0')
  BARK = dict(dhoti='#8a6a3a', crown='bun', scarf='#7a5a2a', jewel='#8a7a5a')
  HALL = lambda: sh(bg(set='court', tone='#3a0e0c', lamps=1), 'dice_hall')
  DARK = lambda: sh(bg(set='court', tone='#2a0a0a'), 'dark_hall')
  EP(6, 'The Question in the Hall', 'सभा में प्रश्न', 'A queen dragged before the court, a vow of blood, and thirteen years in the wilderness.', 'सभा में घसीटी गई एक रानी, रक्त की एक प्रतिज्ञा, और तेरह वर्षों का वनवास।', [
  S('a_cave', 'mystery', [
      ln('VYASA', 'The sixth night. Ganesha had not touched his modaks. He sat with the stylus in his hand and the leaf on his knee, and did not look up.',
                  'छठी रात। गणेश ने अपने मोदकों को छुआ तक नहीं था। वे लेखनी हाथ में और पत्ता घुटने पर लिए बैठे थे, और ऊपर नहीं देखा।', at=5.0)],
    CAVE('night'), cam=[[800, 520, 1.3], [800, 470, 1.05]], amb='night', min=12, eptitle=1, tin='fade'),
  S('a_ask', 'sorrow', [
      ln('GANESHA', 'Tell it, Muni. All of it. I will not look away.', 'कहिए, मुनिवर। सब कुछ। मैं दृष्टि नहीं फेरूँगा।'),
      ln('VYASAC', 'Good. This is the day the story turns. Everything after it grows from this hall.', 'अच्छा। यह वह दिन है जब कथा मुड़ती है। इसके बाद का सब कुछ इसी सभा से उगता है।', gap=0.8)],
    CAVE_G(), cam=push(820, 430, 1.0, 1.08), amb='night'),

  # ---------- the summons ----------
  S('b_won', 'kala', [
      ln('DURYO', 'Won! Draupadi is ours! Go, fetch her, the new servant of the Kurus. Let her come and sweep this hall with the other slave-girls.',
                  'जीत लिया! द्रौपदी हमारी है! जाओ, उसे ले आओ, कुरुओं की नई दासी। उसे आकर दूसरी दासियों के साथ यह सभा बुहारने दो।', fx='growl')],
    [DARK(), face('duryo', 800, 440, 210, 1, 'cruel', rim=RIM_FIRE), fx('embers', n=50)],
    cam=push(800, 450, 1.0, 1.16), amb='court', sfx=[dict(n='crowdlaugh', at=6.0, v=0.4)]),
  S('b_chamber', 'tension', [
      ln('VYASA', 'A servant went to the women\'s quarters. Draupadi was alone, in a single garment, as women were during the days of their monthly impurity. She listened to him, and did not move.',
                  'एक सेवक अंतःपुर गया। द्रौपदी अकेली थीं, एक ही वस्त्र में, जैसे स्त्रियाँ अपने मासिक धर्म के दिनों में रहती थीं। उन्होंने उसकी बात सुनी, और हिलीं नहीं।')],
    [sh(bg(set='chamber', tone='#2a0e12', moon=1), 'dr_chamber'), face('draupadi', 1040, 440, 200, -1, 'stern', rim=RIM_LAMP)],
    cam=push(1020, 450, 1.0, 1.14), amb='night'),
  S('b_question', 'tension', [
      ln('DRAUPADI', 'Go back and ask the gambler this. Did he lose himself first, or me? If he had already lost himself, what right did a slave have to stake his wife? Ask the elders of the Kurus. I will wait for their answer.',
                     'जाओ और उस जुआरी से यह पूछो। उसने पहले स्वयं को हारा, या मुझे? यदि वह पहले ही स्वयं को हार चुका था, तो एक दास को अपनी पत्नी को दाँव पर लगाने का क्या अधिकार था? कुरुओं के वृद्धों से पूछो। मैं उनके उत्तर की प्रतीक्षा करूँगी।')],
    [sh(bg(set='chamber', tone='#2a0e12', moon=1), 'dr_chamber'), face('draupadi', 800, 450, 210, 1, 'anger', rim=RIM_LAMP)],
    cam=push(800, 450, 1.04, 1.2), amb='night', hero=1, name=name('DRAUPADI', 'द्रौपदी', 'queen of Indraprastha', 'इंद्रप्रस्थ की महारानी', 1)),
  S('b_silence', 'kala', [
      ln('VYASA', 'The servant carried the question back to the hall. Yudhishthira did not answer. No one answered. Duryodhana laughed, and turned to his brother.',
                  'सेवक वह प्रश्न सभा में ले आया। युधिष्ठिर ने उत्तर नहीं दिया। किसी ने उत्तर नहीं दिया। दुर्योधन हँसा, और अपने भाई की ओर मुड़ा।'),
      ln('DURYO', 'Dushasana. Bring her. If she will not walk, drag her.', 'दुःशासन। उसे ले आओ। यदि वह चलकर न आए, तो घसीटकर लाओ।', fx='growl', gap=0.6)],
    [HALL(), piece('board', 'diceBoard', d=1.0), fx('embers', n=30)],
    cam=[[800, 600, 1.3], [800, 460, 1.0]], amb='court'),
  S('b_dushasana', 'kala', [
      ln('VYASA', 'Dushasana ran to the women\'s quarters. Draupadi fled towards the queen Gandhari\'s rooms. He caught her by her long hair, the hair that had been sprinkled with sacred water at the Rajasuya, and dragged her through the corridors into the hall.',
                  'दुःशासन अंतःपुर की ओर दौड़ा। द्रौपदी रानी गांधारी के कक्ष की ओर भागीं। उसने उन्हें उनके लंबे केशों से पकड़ लिया, वे केश जिन पर राजसूय में पवित्र जल छिड़का गया था, और गलियारों से घसीटता हुआ सभा में ले आया।')],
    [sh(bg(set='chamber', tone='#2a0e12', moon=1), 'dr_chamber'), face('dushasana', 800, 450, 200, 1, 'cruel', rim=RIM_FIRE)],
    cam=push(800, 450, 1.0, 1.16), amb='night', sfx=[dict(n='gasp', at=5.0, v=0.5), dict(n='heartbeat', at=6.0, v=0.5)], hero=1, name=name('DUSHASANA', 'दुःशासन', 'the second Kaurava', 'दूसरा कौरव', 1)),

  # ---------- the hall ----------
  S('c_hall', 'kala', [
      ln('DRAUPADI', 'Is there no one here? Bhishma, grandfather, you who know dharma. Drona, Kripa, Vidura. Is this the custom of the Kurus, to drag a queen by her hair into a hall of men? Answer my question. Was I won, or not?',
                     'क्या यहाँ कोई नहीं है? पितामह भीष्म, आप जो धर्म जानते हैं। द्रोण, कृप, विदुर। क्या यह कुरुओं की रीति है, एक रानी को केशों से घसीटकर पुरुषों की सभा में लाना? मेरे प्रश्न का उत्तर दीजिए। मैं जीती गई, या नहीं?')],
    [HALL(), face('draupadi', 800, 450, 210, 1, 'anger', rim=RIM_FIRE, glow=['#ff5020', 30, 0.3], wind=1.4)],
    cam=push(800, 450, 1.0, 1.18), amb='court', sfx=[dict(n='gong', at=0.5, v=0.4)]),
  S('c_bhishma', 'sorrow', [
      ln('BHISHMA', 'Dharma is subtle, daughter. A man who has lost himself cannot stake another. And yet a wife belongs to her husband. I cannot answer you. Ask Yudhishthira.',
                    'धर्म सूक्ष्म है, पुत्री। जिसने स्वयं को हार दिया, वह दूसरे को दाँव पर नहीं लगा सकता। और फिर भी पत्नी पति की होती है। मैं तुम्हें उत्तर नहीं दे सकता। युधिष्ठिर से पूछो।', fx='elder')],
    [HALL(), face('bhishma', 560, 450, 190, 1, 'sorrow', rim=RIM_LAMP)],
    cam=push(580, 450, 1.04, 1.14), amb='court'),
  S('c_elders', 'lament', [
      ln('VYASA', 'Drona looked at the floor. Kripa looked at the floor. The blind king said nothing at all. Yudhishthira sat like a dead man.', 'द्रोण ने फ़र्श की ओर देखा। कृप ने फ़र्श की ओर देखा। अंधे राजा ने कुछ भी नहीं कहा। युधिष्ठिर मृत व्यक्ति की तरह बैठे रहे।')],
    [HALL(), face('drona', 500, 460, 160, 1, 'sorrow', n='dr'), face('dhrita', 1100, 460, 160, -1, 'sorrow', n='dh'), fx('dust', col='#c08a5a', n=30)],
    cam=[[600, 460, 1.1], [1000, 460, 1.1]], amb='court'),
  S('c_vikarna', 'heroic', [
      ln('VIKARNA', 'Then I will answer, since my elders will not! She was staked by a man who had already lost himself. She was not his to stake. She was not won. This is adharma, and I will not be silent.',
                    'तो मैं उत्तर दूँगा, क्योंकि मेरे बड़े नहीं देंगे! उन्हें उस व्यक्ति ने दाँव पर लगाया जो पहले ही स्वयं को हार चुका था। वे उसकी नहीं थीं जो दाँव पर लगतीं। वे जीती नहीं गईं। यह अधर्म है, और मैं चुप नहीं रहूँगा।')],
    [HALL(), face('vikarna', 1040, 440, 190, -1, 'anger', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.0, 1.14), amb='court', sfx=[dict(n='gasp', at=1.0, v=0.4)], hero=1, name=name('VIKARNA', 'विकर्ण', 'a son of Dhritarashtra', 'धृतराष्ट्र का एक पुत्र', -1)),
  S('c_karna', 'kala', [
      ln('VYASA', 'Of all the hundred sons of the blind king, only one spoke for her. And it was Karna who shouted him down.', 'अंधे राजा के सौ पुत्रों में केवल एक उनके पक्ष में बोला। और कर्ण ने उसे चिल्लाकर चुप करा दिया।'),
      ln('KARNA', 'Be quiet, boy! The scriptures give a woman one husband. This one has five. A woman with five husbands is no better than a harlot. It makes no difference whether she is clothed or naked. Dushasana, take the clothes of the Pandavas. And hers.',
                  'चुप रहो, बालक! शास्त्र स्त्री को एक पति देते हैं। इसके पाँच हैं। पाँच पतियों वाली स्त्री वेश्या से बढ़कर नहीं। इससे कोई अंतर नहीं पड़ता कि वह वस्त्र में है या निर्वस्त्र। दुःशासन, पांडवों के वस्त्र ले लो। और इसके भी।', gap=0.6)],
    [HALL(), face('karna', 800, 450, 200, 1, 'cruel', rim=RIM_FIRE)],
    cam=push(800, 450, 1.04, 1.18), amb='court', sfx=[dict(n='crowdlaugh', at=14.0, v=0.4)]),
  S('c_cave', 'mystery', [
      ln('GANESHA', 'Karna? The man who was refused, refusing her?', 'कर्ण? जिसे ठुकराया गया, वही उन्हें ठुकरा रहा है?'),
      ln('VYASAC', 'A wound that is never tended turns to poison, scribe. He would regret those words until the day he died. Write that too.', 'जिस घाव का कभी उपचार न हो, वह विष बन जाता है, लेखक। वे उन शब्दों पर मृत्यु के दिन तक पछताए। वह भी लिखो।', gap=0.8)],
    CAVE(), cam=CAVE_CAM['two'], amb='night'),

  # ---------- the disrobing ----------
  S('d_strip', 'kala', [
      ln('VYASA', 'The Pandavas took off their upper cloths and sat bare-chested. Then Dushasana took hold of the end of Draupadi\'s sari, and began to pull.',
                  'पांडवों ने अपने उत्तरीय उतार दिए और नंगे वक्ष बैठ गए। फिर दुःशासन ने द्रौपदी की साड़ी का छोर पकड़ा, और खींचने लगा।')],
    [HALL(), face('dushasana', 800, 450, 200, 1, 'cruel', rim=RIM_FIRE)],
    cam=push(800, 450, 1.04, 1.2), amb='court', sfx=[dict(n='heartbeat', at=1.0, v=0.6)]),
  S('d_pray', 'krishna', [
      ln('VYASA', 'Draupadi let go. Of the cloth, of her husbands, of the elders, of the hall. She raised both hands above her head and called on the only one left.',
                  'द्रौपदी ने सब छोड़ दिया। वस्त्र को, अपने पतियों को, वृद्धों को, सभा को। उन्होंने दोनों हाथ सिर के ऊपर उठाए और उस एक को पुकारा जो बचा था।'),
      ln('DRAUPADI', 'Govinda! Keshava! Lord of Dwaraka, protector of the helpless, I have no one but you!', 'गोविंद! केशव! द्वारकाधीश, असहायों के रक्षक, आपके सिवा मेरा कोई नहीं!', gap=0.6)],
    [HALL(), figs('dr', [dict(who='draupadi', x=800, y=900, S=600, f=1, pose='vow')], rim=RIM_FIRE), fx('rays', x=800, y=140, r0=60, r1=900, col='#cfe4ff')],
    cam=push(800, 460, 1.04, 1.16), amb='court', sfx=[dict(n='flute', at=10.0, v=0.5)]),
  S('d_sari', 'vishva', [
      ln('VYASA', 'And Dushasana pulled, and pulled, and the sari did not end. Yard after yard of cloth poured from his hands, red and gold and blue, piling up on the floor like a mountain, and under every layer was another.',
                  'और दुःशासन खींचता रहा, खींचता रहा, और साड़ी समाप्त नहीं हुई। उसके हाथों से गज़ दर गज़ वस्त्र बहता रहा, लाल और सुनहरा और नीला, फ़र्श पर पर्वत की तरह ढेर होता हुआ, और हर परत के नीचे एक और परत।')],
    [HALL(), piece('sari', 'endlessSari', k='anim', every=2, x=900, y=520), fx('sparkle', n=80)],
    cam=push(800, 460, 1.0, 1.12), amb='temple', sfx=[dict(n='magic', at=1.0), dict(n='flute', at=3.0, v=0.6), dict(n='swell', at=12.0, v=0.5)]),
  S('d_krishna', 'krishna', [
      ln('VYASA', 'Some say it was Dharma himself who clothed her. Others say it was Krishna, a thousand miles away, repaying a strip of cloth torn from a sari, thread by thread.',
                  'कुछ कहते हैं कि स्वयं धर्म ने उन्हें वस्त्र दिया। दूसरे कहते हैं कि वे कृष्ण थे, हज़ार कोस दूर से, साड़ी से फाड़ी गई एक पट्टी का ऋण चुकाते हुए, धागे दर धागा।')],
    [sh(bg(set='void', base='#0a1030', mandala=300, my=420), 'void_mandala'), face('krishna', 800, 440, 210, 1, 'calm', rim=RIM_MOON, glow=KGLOW), fx('sparkle', n=60)],
    cam=push(800, 450, 1.0, 1.14), amb='temple', sfx=[dict(n='flute', at=1.0, v=0.6)]),
  S('d_fall', 'heroic', [
      ln('VYASA', 'At last Dushasana fell back, exhausted, sweating, ashamed, onto the heap of cloth. Draupadi stood in the middle of the hall, untouched.', 'अंत में दुःशासन थककर, पसीने में, लज्जित होकर, वस्त्रों के ढेर पर पीछे गिर पड़ा। द्रौपदी सभा के बीच अछूती खड़ी थीं।')],
    [HALL(), figs('stand', [dict(who='draupadi', x=800, y=900, S=620, f=1)], rim=RIM_GOLD, glow=['#ffe0a0', 26, 0.3]), fx('petals', every=2, n=60)],
    cam=push(800, 470, 1.04, 1.14), amb='court', sfx=[dict(n='gasp', at=1.0, v=0.6), dict(n='conch', at=6.0, v=0.4)]),

  # ---------- Bhima's vows ----------
  S('e_vow1', 'fire', [
      ln('BHIMA', 'Hear me, kings of the earth! If I do not tear open the chest of this Dushasana in battle and drink his blood, may I never see the world of my ancestors!',
                  'सुनो, पृथ्वी के राजाओं! यदि मैंने युद्ध में इस दुःशासन की छाती चीरकर उसका रक्त न पिया, तो मुझे अपने पूर्वजों का लोक कभी न मिले!', fx='growl')],
    [HALL(), face('bhima', 560, 450, 200, 1, 'roar', rim=RIM_FIRE), fx('embers', n=80)],
    cam=push(580, 450, 1.0, 1.2), amb='court', sfx=[dict(n='thunder', at=0.5, v=0.5), dict(n='rumble', at=9.0, v=0.5)], shake=[[9.0, 9.6]]),
  S('e_thigh', 'kala', [
      ln('VYASA', 'Duryodhana laughed, and pulled aside his robe, and showed Draupadi his bare left thigh, and patted it, inviting her to sit.', 'दुर्योधन हँसा, और अपना वस्त्र हटाकर द्रौपदी को अपनी नंगी बाईं जंघा दिखाई, और उसे थपथपाया, उन्हें बैठने का संकेत करते हुए।'),
      ln('BHIMA', 'And that thigh, Duryodhana, I will break with my mace. I swear it.', 'और वह जंघा, दुर्योधन, मैं अपनी गदा से तोड़ूँगा। मैं शपथ लेता हूँ।', fx='growl', gap=0.6)],
    [HALL(), face('duryo', 560, 440, 180, 1, 'cruel', n='du', rim=RIM_FIRE), face('bhima', 1080, 450, 190, -1, 'roar', n='bh', rim=RIM_FIRE)],
    cam=[[640, 450, 1.1], [960, 450, 1.12]], amb='court', sfx=[dict(n='drumroll', at=9.0), dict(n='thunder', at=11.0, v=0.5)]),
  S('e_hair', 'fire', [
      ln('DRAUPADI', 'And I will not tie up this hair again until it is washed in the blood of Dushasana.', 'और मैं ये केश तब तक नहीं बाँधूँगी जब तक वे दुःशासन के रक्त से न धुलें।')],
    [HALL(), face('draupadi', 800, 450, 210, 1, 'anger', rim=RIM_FIRE, glow=['#ff5020', 30, 0.3], wind=1.6)],
    cam=push(800, 450, 1.04, 1.22), amb='court', sfx=[dict(n='gong', at=5.0, v=0.6)]),
  S('e_omens', 'storm', [
      ln('VYASA', 'At that moment a jackal howled in the king\'s sacrificial chamber. Donkeys brayed. Birds of prey screamed over the palace. The blind king heard them, and was afraid at last.',
                  'उसी क्षण राजा के यज्ञशाला में एक सियार हुआँ हुआँ करने लगा। गधे रेंकने लगे। महल के ऊपर शिकारी पक्षी चीखने लगे। अंधे राजा ने उन्हें सुना, और आख़िरकार डर गए।')],
    [sh(bg(set='city', tod='crimson', hz=600), 'city_crimson'), fx('embers', n=110), fx('flash', every=1, at=[4.0], bolt=1100)],
    cam=pan(1000, 600, 460, 1.15), amb='storm', sfx=[dict(n='wind', at=0.5), dict(n='thunder', at=4.0, v=0.6), dict(n='roar', at=6.0, v=0.4)], shake=[[4.0, 4.6]]),
  S('e_boons', 'sorrow', [
      ln('DHRITA', 'Daughter-in-law, you are the most virtuous of my family. Ask me for a boon. Anything.', 'पुत्रवधू, तुम मेरे परिवार में सबसे धर्मपरायण हो। मुझसे वरदान माँगो। कुछ भी।'),
      ln('DRAUPADI', 'Then free Yudhishthira, so his son will not be called the son of a slave.', 'तो युधिष्ठिर को मुक्त कर दीजिए, कि उनका पुत्र दास का पुत्र न कहलाए।', gap=0.6),
      ln('DHRITA', 'Ask another.', 'एक और माँगो।', gap=0.5),
      ln('DRAUPADI', 'Free the other four, with their weapons and their chariots.', 'बाकी चारों को मुक्त कर दीजिए, उनके अस्त्रों और रथों के साथ।', gap=0.5),
      ln('DHRITA', 'Ask a third.', 'तीसरा माँगो।', gap=0.5),
      ln('DRAUPADI', 'No. A kshatriya woman may ask two. Greed destroys dharma. My husbands are free. They will win back the rest themselves.', 'नहीं। क्षत्रिय स्त्री दो माँग सकती है। लोभ धर्म का नाश करता है। मेरे पति मुक्त हैं। बाकी वे स्वयं जीत लेंगे।', gap=0.5)],
    [sh(bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), 'court_dark'), face('dhrita', 560, 450, 180, 1, 'sorrow', n='dh', rim=RIM_GOLD), face('draupadi', 1080, 440, 180, -1, 'stern', n='dr', rim=RIM_FIRE)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='court'),

  # ---------- the second game ----------
  S('f_again', 'dice', [
      ln('VYASA', 'They left for Indraprastha. They had not gone far when a messenger caught up with them. The blind king, persuaded again by his son, invited Yudhishthira to one more game. One throw. The loser would go to the forest for twelve years, and live the thirteenth year in hiding. If they were discovered in that year, another twelve.',
                  'वे इंद्रप्रस्थ के लिए निकले। अधिक दूर नहीं गए थे कि एक दूत ने उन्हें आ पकड़ा। अंधे राजा ने, पुत्र के फिर से मनाने पर, युधिष्ठिर को एक और खेल का निमंत्रण दिया। एक दाँव। हारने वाला बारह वर्ष के लिए वन जाएगा, और तेरहवाँ वर्ष छिपकर बिताएगा। यदि उस वर्ष पहचाना गया, तो फिर बारह वर्ष।')],
    [sh(bg(set='valley', tod='dusk', hz=450, seed=2.1), 'valley_dusk'), piece('mess', 'riders', k='anim', every=2, x=200, y=830, s=110, cnt=1, speed=80)],
    cam=pan(560, 1040, 470, 1.15), amb='wind', sfx=[dict(n='hooves', at=0.3, v=0.6)]),
  S('f_throw', 'kala', [
      ln('VYASA', 'And Yudhishthira, who had vowed never to refuse his elders, turned his chariot around.', 'और युधिष्ठिर, जिन्होंने अपने बड़ों को कभी मना न करने की प्रतिज्ञा की थी, अपना रथ मोड़कर लौट आए।'),
      ln('SHAKUNI', 'Won!', 'जीता!', gap=4.0)],
    [HALL(), piece('board', 'diceBoard', d=1.0), piece('dice', 'diceRoll', k='anim', every=1, times=[6.0])],
    cam=push(800, 640, 1.2, 1.4), amb='court', sfx=[dict(n='dice', at=6.0), dict(n='gong', at=8.0, v=0.7)]),

  # ---------- departure ----------
  S('g_depart', 'lament', [
      ln('VYASA', 'They left Hastinapura in deerskins. Yudhishthira walked with his face covered, so that his angry eyes would not burn the city. Bhima walked stretching out his great arms. Arjuna scattered sand as he went, as his arrows would one day fall. The twins smeared their faces with dust. And Draupadi walked with her hair unbound, weeping.',
                  'वे मृगछाला पहनकर हस्तिनापुर से निकले। युधिष्ठिर मुख ढँककर चले, कि उनकी क्रोधित दृष्टि नगर को न जला दे। भीम अपनी विशाल भुजाएँ फैलाते हुए चले। अर्जुन चलते हुए रेत बिखेरते गए, जैसे एक दिन उनके बाण बरसेंगे। जुड़वाँ भाइयों ने मुख पर धूल मल ली। और द्रौपदी खुले केशों में, रोती हुई चलीं।')],
    [sh(bg(set='valley', tod='dusk', hz=450, seed=2.1), 'valley_dusk'), figs('exile', [fig('yudhi', 380, 880, 340, 1, 'stand', style=BARK), fig('bhima', 520, 880, 370, 1, 'stand', style=BARK), fig('arjuna', 660, 880, 340, 1, 'stand', style=BARK), fig('nakula', 790, 880, 320, 1, 'stand', style=BARK), fig('sahadeva', 910, 880, 320, 1, 'stand', style=BARK), dict(who='draupadi', x=1060, y=880, S=330, f=1)], mv=dict(dx=[-60, 160], t=[0, 20])), fx('dust', col='#e08050', n=60)],
    cam=pan(560, 1040, 470, 1.12), amb='wind', min=12),
  S('g_kunti', 'lament', [
      ln('VYASA', 'Kunti was too old for the forest. She stayed in Hastinapura, in Vidura\'s house. She held each of her sons, and then Draupadi, for a long time.',
                  'कुंती वन के लिए बहुत वृद्ध थीं। वे हस्तिनापुर में विदुर के घर रुकीं। उन्होंने अपने हर पुत्र को, और फिर द्रौपदी को, बहुत देर तक गले लगाए रखा।')],
    [sh(bg(set='city', tod='dusk', hz=600, col='#d8a07a'), 'city_dusk4'), face('kunti', 800, 450, 200, 1, 'sorrow', rim=RIM_FIRE)],
    cam=push(800, 450, 1.04, 1.16), amb='wind'),
  S('g_gandhari', 'sorrow', [
      ln('GANDHARI', 'My lord, I told you when he was born. I told you to give him up. You would not listen then, and you would not listen today. Now the sin of that hall belongs to us both.',
                     'स्वामी, मैंने आपसे उसके जन्म पर कहा था। मैंने कहा था उसे त्याग दीजिए। आपने तब नहीं सुना, और आज भी नहीं सुना। अब उस सभा का पाप हम दोनों का है।')],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), face('gandhari', 800, 450, 200, 1, 'sorrow', rim=RIM_LAMP)],
    cam=push(800, 450, 1.04, 1.16), amb='night'),
  S('g_sanjaya', 'tension', [
      ln('VYASA', 'That night the blind king could not sleep. He called for his charioteer and counsellor, Sanjaya, a quiet man who saw clearly and spoke plainly.', 'उस रात अंधे राजा सो नहीं सके। उन्होंने अपने सारथी और सलाहकार संजय को बुलाया, एक शांत व्यक्ति जो स्पष्ट देखता और सीधा बोलता था।'),
      ln('SANJAYA', 'My king, when the gods wish to destroy a man, they do not strike him with a club. They take away his judgement, so that he sees the wrong as right. You have won the earth, and you have lost the Pandavas. Was it worth it?',
                    'महाराज, जब देवता किसी का नाश चाहते हैं, तो वे उसे डंडे से नहीं मारते। वे उसकी बुद्धि हर लेते हैं, कि वह गलत को सही देखने लगे। आपने पृथ्वी जीत ली, और पांडवों को खो दिया। क्या यह उचित था?', gap=0.6)],
    [sh(bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), 'court_dark'), face('courtier', 1040, 450, 180, -1, 'calm', rim=RIM_LAMP, style=dict(cloth='#e8dcc0'))],
    cam=push(1020, 450, 1.0, 1.14), amb='night', hero=1, name=name('SANJAYA', 'संजय', 'the king\'s charioteer', 'राजा के सारथी', -1)),
  S('g_vidura', 'sorrow', [
      ln('VYASA', 'Vidura spoke even more plainly, and the king lost his temper and told him to go and join the Pandavas, since he loved them so much. Vidura went. And within days the blind king missed him so badly that he sent Sanjaya into the forest to beg him to come home.',
                  'विदुर ने और भी स्पष्ट कहा, और राजा ने क्रोध में उनसे कहा कि जाओ पांडवों के पास, जब तुम्हें उनसे इतना प्रेम है। विदुर चले गए। और कुछ ही दिनों में अंधे राजा को उनकी इतनी याद आई कि उन्होंने संजय को वन भेजकर उनसे लौट आने की विनती की।')],
    [sh(bg(set='forest', tod='dawn'), 'forest_dawn'), figs('vw', [fig('vidura', 820, 880, 420, 1, 'stand')]), fx('leaves', n=40)],
    cam=pan(1000, 640, 470, 1.12), amb='birds'),
  S('g_forest', 'forest', [], [sh(bg(set='forest', tod='dawn'), 'forest_dawn'), fx('leaves', n=50), piece('birds', 'woodBird', x=1200, y=300, s=0.6)],
    cam=[[800, 520, 1.25], [800, 460, 1.0]], amb='birds', min=7),

  # ---------- Kamyaka ----------
  S('h_kamyaka', 'forest', [
      ln('VYASA', 'They made their home in the Kamyaka forest, by a lake full of lotuses. Brahmins followed them there by the thousand, out of love. Yudhishthira prayed to the Sun, and was given a copper vessel that would feed everyone each day, until Draupadi had eaten.',
                  'उन्होंने कमलों से भरी एक झील के किनारे काम्यक वन में अपना घर बनाया। प्रेमवश हज़ारों ब्राह्मण उनके पीछे वहाँ आए। युधिष्ठिर ने सूर्य से प्रार्थना की, और उन्हें एक ताम्र पात्र मिला जो हर दिन सबको भोजन देता, जब तक द्रौपदी भोजन न कर लें।')],
    [sh(bg(set='lake', tod='day'), 'lake_day'), piece('leaves', 'lotusLeaf', at=[[500, 820, 90], [760, 860, 120], [1100, 830, 100]]), fx('sparkle', y0=700, y1=900, n=40), fx('ripples', x=800, y=840)],
    cam=pan(560, 1040, 470, 1.12), amb='birds', min=10),
  S('h_anger', 'tension', [
      ln('DRAUPADI', 'You sit here in deerskin, king, calm as a sage, while the man who dragged me by the hair sleeps on silk. Where is your anger? A kshatriya without anger is a lamp without oil.',
                     'आप यहाँ मृगछाला में बैठे हैं, राजन, ऋषि की तरह शांत, जबकि मुझे केशों से घसीटने वाला रेशम पर सोता है। आपका क्रोध कहाँ है? क्रोध के बिना क्षत्रिय तेल के बिना दीये जैसा है।')],
    [sh(bg(set='lake', tod='day'), 'lake_day'), face('draupadi', 560, 440, 190, 1, 'anger', rim=RIM_GOLD)],
    cam=push(580, 450, 1.04, 1.16), amb='birds'),
  S('h_bhima', 'tension', [
      ln('BHIMA', 'She is right, brother! Thirteen years? Count each month as a year, and we have already served our time. Let us march on Hastinapura tomorrow!', 'वे सही हैं, भ्राता! तेरह वर्ष? हर महीने को एक वर्ष गिनिए, और हम अपना समय पूरा कर चुके। कल ही हस्तिनापुर पर चढ़ाई करें!', fx='growl'),
      ln('YUDHI', 'I gave my word, Bhima. If I break it, I am no better than Shakuni. Forgiveness is the strength of the strong. We will wait.', 'मैंने वचन दिया है, भीम। यदि मैं उसे तोड़ूँ, तो मैं शकुनि से बेहतर नहीं। क्षमा बलवानों का बल है। हम प्रतीक्षा करेंगे।', gap=0.6)],
    [sh(bg(set='lake', tod='day'), 'lake_day'), face('bhima', 560, 450, 180, 1, 'anger', n='bh', rim=RIM_FIRE), face('yudhi', 1080, 450, 180, -1, 'calm', n='yu', rim=RIM_GOLD)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='birds'),
  S('h_krishna', 'krishna', [
      ln('VYASA', 'Krishna came to the forest as soon as he heard. Draupadi met him in tears.', 'कृष्ण ने जैसे ही सुना, वे वन आए। द्रौपदी आँसुओं में उनसे मिलीं।'),
      ln('KRISHNA', 'Panchali, the wives of those who insulted you will weep as you are weeping now. I promise you. The heavens may fall, the Himalaya may split, the sea may dry up, but my word will not fail.',
                    'पांचाली, जिन्होंने तुम्हारा अपमान किया, उनकी पत्नियाँ वैसे ही रोएँगी जैसे तुम अभी रो रही हो। मैं वचन देता हूँ। आकाश गिर जाए, हिमालय फट जाए, सागर सूख जाए, पर मेरा वचन नहीं टलेगा।', gap=0.6)],
    [sh(bg(set='lake', tod='day'), 'lake_day'), face('krishna', 1040, 440, 200, -1, 'stern', rim=RIM_MOON, glow=KGLOW)],
    cam=push(1020, 450, 1.0, 1.14), amb='birds', sfx=[dict(n='conch', at=14.0, v=0.4)]),
  S('h_vyasa', 'mystery', [
      ln('VYASA', 'And I came too. I told Yudhishthira that the Kauravas had Bhishma, Drona and Karna, and that only weapons from the gods could stand against them. I taught him a secret knowledge, to pass to Arjuna, who would go north to find them.',
                  'और मैं भी आया। मैंने युधिष्ठिर से कहा कि कौरवों के पास भीष्म, द्रोण और कर्ण हैं, और उनके सामने केवल देवताओं के अस्त्र टिक सकते हैं। मैंने उन्हें एक गुप्त विद्या सिखाई, अर्जुन को देने के लिए, जो उन्हें खोजने उत्तर जाएँगे।')],
    CAVE_V('calm'), cam=push(700, 430, 1.0, 1.1), amb='night'),

  # ---------- the Kirata ----------
  S('h_farewell', 'sorrow', [
      ln('DRAUPADI', 'Go, Partha. May the gods be kind to you. Come back with the weapons of heaven, and come back soon.', 'जाओ, पार्थ। देवता तुम पर कृपा करें। स्वर्ग के अस्त्र लेकर लौटना, और जल्दी लौटना।'),
      ln('VYASA', 'Arjuna put on his armour, took Gandiva and his two quivers, and walked north without looking back.', 'अर्जुन ने कवच पहना, गांडीव और दोनों तरकश लिए, और बिना पीछे देखे उत्तर की ओर चल पड़े।', gap=0.6)],
    [sh(bg(set='lake', tod='dawn'), 'lake_dawn'), figs('fw', [fig('arjuna', 1000, 880, 520, 1, 'stand', weapon='bowRest'), dict(who='draupadi', x=640, y=880, S=480, f=1)], rim=RIM_GOLD), fx('leaves', n=30)],
    cam=push(820, 470, 1.04, 1.12), amb='birds'),
  S('h_climb', 'river', [], [bg(set='valley', tod='dawn', hz=420, seed=7.2, groves=6, mist=1), figs('tiny', [fig('arjuna', 900, 820, 120, 1, 'stand', weapon='bowRest')]), fx('snow', n=30)],
    cam=[[800, 520, 1.3], [800, 460, 1.0]], amb='wind', min=7),
  S('i_north', 'march', [
      ln('VYASA', 'Arjuna went north alone, into the Himalaya, to the mountain called Indrakila. There he stood on one foot, arms raised, eating only leaves, then only air, praying to Shiva.',
                  'अर्जुन अकेले उत्तर गए, हिमालय में, इंद्रकील नामक पर्वत पर। वहाँ वे एक पैर पर खड़े रहे, भुजाएँ उठाए, केवल पत्ते खाते हुए, फिर केवल वायु पर, शिव की प्रार्थना करते हुए।')],
    [sh(bg(set='himalaya'), 'himal_peaks'), figs('tapas', [fig('arjuna', 800, 880, 420, 1, 'vow', style=BARK)], rim=RIM_COOL), fx('snow', n=80)],
    cam=[[800, 520, 1.3], [800, 470, 1.05]], amb='wind', min=11),
  S('i_boar', 'battle', [
      ln('VYASA', 'One day a great black boar came charging down the mountain at him. Arjuna shot it. At the same moment, another arrow struck it from the other side. A hunter, a Kirata, stepped out of the trees with a bow, and his wife behind him.',
                  'एक दिन एक विशाल काला सूअर पर्वत से उन पर झपटा। अर्जुन ने उसे बाण मारा। उसी क्षण दूसरी ओर से एक और बाण उसे लगा। एक शिकारी, एक किरात, धनुष लिए पेड़ों से निकला, और उसके पीछे उसकी पत्नी।')],
    [sh(bg(set='himalaya'), 'himal_peaks'), piece('boar', 'boar', x=820, y=900, s=420, down=1, arrows=[[760, 760, 200], [880, 770, -20]]), fx('dust', col='#e0e0e8', n=50)],
    cam=push(820, 640, 1.1, 1.3), amb='wind', sfx=[dict(n='roar', at=0.5, v=0.6), dict(n='whoosh', at=5.0), dict(n='whoosh', at=5.2), dict(n='boom', at=5.6, v=0.5)]),
  S('i_kirata', 'heroic', [
      ln('KIRATA', 'That boar was mine. I hit it first. You hunt in my mountains without leave, and steal my kill?', 'वह सूअर मेरा था। पहले मैंने मारा। तुम बिना अनुमति मेरे पर्वतों में आखेट करते हो, और मेरा शिकार चुराते हो?')],
    [sh(bg(set='himalaya'), 'himal_peaks'), face('kirata', 1040, 440, 200, -1, 'smile', rim=RIM_COOL)],
    cam=push(1020, 450, 1.0, 1.14), amb='wind', hero=1, name=name('THE KIRATA', 'किरात', 'a hunter of the mountains', 'पर्वतों का शिकारी', -1)),
  S('i_fight', 'battle', [
      ln('VYASA', 'They fought. Arjuna\'s endless quivers emptied for the first time in his life. The hunter swallowed his bow whole. Arjuna fought him with a sword, and the sword broke. With fists, and the hunter laughed. At last he squeezed Arjuna until he fell senseless.',
                  'वे लड़े। अर्जुन के अक्षय तरकश जीवन में पहली बार खाली हो गए। शिकारी ने उनका धनुष समूचा निगल लिया। अर्जुन तलवार से लड़े, और तलवार टूट गई। मुट्ठियों से, और शिकारी हँसा। अंत में उसने अर्जुन को ऐसे भींचा कि वे अचेत होकर गिर पड़े।')],
    [sh(bg(set='himalaya'), 'himal_peaks'), figs('kfight', [fig('arjuna', 560, 900, 600, 1, 'draw', weapon='bowDrawn', style=BARK), fig('kirata', 1060, 900, 640, -1, 'stand', weapon='bowRest')], rim=RIM_COOL), piece('ar', 'arrowRain', k='anim', every=2, add=True), fx('snow', n=60)],
    cam=push(800, 480, 1.04, 1.14), amb='battle', sfx=[dict(n='whoosh', at=1.0), dict(n='whoosh', at=3.0), dict(n='crack', at=7.0, v=0.6), dict(n='boom', at=11.0, v=0.5), dict(n='roar', at=13.0, v=0.4)], shake=[[11.0, 11.6]]),
  S('i_shiva', 'shiva', [
      ln('VYASA', 'When he woke, he made a little linga of clay and offered it a garland. And the garland appeared on the hunter\'s head. Arjuna fell at his feet. The hunter was Shiva, and the woman was Parvati.',
                  'जब वे जागे, तो उन्होंने मिट्टी का एक छोटा लिंग बनाया और उस पर माला चढ़ाई। और वह माला शिकारी के सिर पर दिखाई दी। अर्जुन उनके चरणों में गिर पड़े। शिकारी शिव थे, और वह स्त्री पार्वती।')],
    [sh(bg(set='himalaya'), 'himal_peaks'), face('shiva', 800, 440, 210, 1, 'calm', rim=RIM_COOL, glow=['#a0c8ff', 30, 0.35]), fx('snow', n=60), fx('rays', x=800, y=420, r0=120, r1=900, col='#dfefff')],
    cam=push(800, 450, 1.0, 1.14), amb='temple', sfx=[dict(n='damaru', at=1.0, v=0.6), dict(n='om', at=10.0, v=0.5)]),
  S('i_pashupata', 'shiva', [
      ln('SHIVA', 'I am pleased with you, son of Kunti. No one has ever fought me so long. Take the Pashupata, my own weapon. It can destroy the three worlds. Never use it against a lesser enemy.',
                  'मैं तुमसे प्रसन्न हूँ, कुंतीपुत्र। किसी ने मुझसे इतनी देर युद्ध नहीं किया। पाशुपत लो, मेरा अपना अस्त्र। यह तीनों लोकों का नाश कर सकता है। इसे कभी किसी छोटे शत्रु पर मत चलाना।')],
    [sh(bg(set='void', base='#0a1030', mandala=300, my=420), 'void_mandala'), fx('wheel', x=800, y=420, r=300, col='#dfefff'), fx('flash', every=1, at=[12.0], col='#dfefff'), figs('ar2', [fig('arjuna', 800, 900, 600, 1, 'vow', style=BARK)], rim=RIM_COOL, glow=['#a0c8ff', 20, 0.3])],
    cam=push(800, 470, 1.0, 1.14), amb='temple', sfx=[dict(n='damaru', at=0.5, v=0.5), dict(n='thunder', at=12.0, v=0.6)], shake=[[12.0, 12.6]]),

  # ---------- Amaravati ----------
  S('j_indra', 'divine', [
      ln('VYASA', 'Then the guardians of the world came down, one by one, and gave him their weapons. And Indra\'s chariot came for him, driven by Matali, and carried Arjuna up into Amaravati, the city of the gods, to learn from his own father.',
                  'फिर लोकपाल एक एक कर उतरे, और उन्हें अपने अस्त्र दिए। और इंद्र का रथ मातलि के सारथ्य में उन्हें लेने आया, और अर्जुन को देवताओं की नगरी अमरावती ले गया, अपने ही पिता से सीखने।')],
    [bg(set='heaven', gate=1), fx('rays', x=800, y=200, r0=60, r1=1000, col='#fff0c0'), fx('petals', every=2, n=80), fx('sparkle', n=60)],
    cam=[[800, 600, 1.35], [800, 450, 1.0]], amb='temple', sfx=[dict(n='conch', at=1.0, v=0.5), dict(n='bells', at=4.0, v=0.4), dict(n='swell', at=8.0, v=0.4)], min=12),
  S('j_urvashi', 'love', [
      ln('VYASA', 'In Indra\'s hall the apsara Urvashi danced, and her eyes were on Arjuna. That night she came to his rooms.', 'इंद्र की सभा में अप्सरा उर्वशी नाचीं, और उनकी आँखें अर्जुन पर थीं। उस रात वे उनके कक्ष में आईं।'),
      ln('ARJUNA', 'Lady, you were the wife of Pururavas, the father of my line. You are a mother to me. I bow to you.', 'देवी, आप पुरूरवा की पत्नी थीं, मेरे वंश के आदिपुरुष की। आप मेरे लिए माता समान हैं। मैं आपको प्रणाम करता हूँ।', gap=0.6)],
    [bg(set='heaven', gate=1), face('urvashi', 560, 440, 190, 1, 'smile', n='ur', rim=RIM_GOLD), face('arjuna', 1080, 450, 180, -1, 'calm', n='ar', rim=RIM_GOLD)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='temple', sfx=[dict(n='bells', at=0.5, v=0.3)], hero=1, name=name('URVASHI', 'उर्वशी', 'dancer of heaven', 'स्वर्ग की अप्सरा', 1)),
  S('j_curse', 'kala', [
      ln('URVASHI', 'You refuse me? Then live as a eunuch among women, without honour, a dancer and a singer!', 'तुम मुझे ठुकराते हो? तो स्त्रियों के बीच नपुंसक बनकर रहो, बिना सम्मान के, एक नर्तक और गायक!'),
      ln('VYASA', 'Indra softened the curse. It would last only one year, whichever year Arjuna chose. And Arjuna would choose very carefully.', 'इंद्र ने शाप को कोमल कर दिया। वह केवल एक वर्ष रहेगा, जो वर्ष अर्जुन चुनें। और अर्जुन बहुत सोच समझकर चुनेंगे।', gap=0.8)],
    [bg(set='heaven', gate=1), face('urvashi', 800, 440, 210, 1, 'anger', rim=RIM_FIRE, glow=['#ff8080', 26, 0.3])],
    cam=push(800, 450, 1.04, 1.2), amb='temple', sfx=[dict(n='thunder', at=1.0, v=0.4), dict(n='gong', at=6.0, v=0.5)]),
  S('j_asuras', 'battle', [
      ln('VYASA', 'For five years Arjuna lived in heaven. He learned to dance and to sing from the gandharva Chitrasena, and every weapon of the gods from his father. Then, as his teacher\'s fee, Indra asked him to destroy the Nivatakavachas, demons in armour under the sea, whom even the gods could not defeat. He did.',
                  'पाँच वर्ष अर्जुन स्वर्ग में रहे। उन्होंने गंधर्व चित्रसेन से नृत्य और गायन सीखा, और अपने पिता से देवताओं का हर अस्त्र। फिर गुरु दक्षिणा के रूप में इंद्र ने उनसे निवातकवचों का नाश करने को कहा, समुद्र के नीचे कवचधारी दानव, जिन्हें देवता भी नहीं हरा सके थे। उन्होंने कर दिखाया।')],
    [bg(set='void', base='#04202a', mandala=360, my=420, col='#8af0d0'), piece('ch', 'warChariot', k='anim', every=2, x=700, y=880, s=0.85, rider='arjuna'), piece('ar', 'arrowRain', k='anim', every=2, add=True), fx('flash', every=1, at=[8.0, 14.0], col='#8af0d0')],
    cam=push(800, 480, 1.0, 1.12), amb='battle', sfx=[dict(n='conch', at=0.5), dict(n='whoosh', at=3.0), dict(n='thunder', at=8.0, v=0.6), dict(n='roar', at=14.0, v=0.5)], shake=[[8.0, 8.6], [14.0, 14.6]]),
  S('j_cave', 'mystery', [
      ln('GANESHA', 'A curse that will become a hiding place.', 'एक शाप जो छिपने का स्थान बन जाएगा।'),
      ln('VYASAC', 'You are learning how this story works, scribe. Tomorrow: the long years in the forest, a lake that asks questions, and a king\'s court where the mightiest men on earth will hide as servants.',
                   'तुम समझने लगे हो कि यह कथा कैसे चलती है, लेखक। कल: वन के लंबे वर्ष, एक झील जो प्रश्न पूछती है, और एक राजा का दरबार जहाँ पृथ्वी के सबसे शक्तिशाली पुरुष सेवक बनकर छिपेंगे।', gap=0.8)],
    CAVE(), cam=[[800, 470, 1.05], [800, 520, 1.3]], amb='night', tout='fade', min=12),
  ])
