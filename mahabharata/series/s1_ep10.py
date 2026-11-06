# Season 1, Episode 10: the last eight days. Abhimanyu, Jayadratha, Ghatotkacha, Drona, Karna,
# Duryodhana, the night of fire, Gandhari's curse, the crowning, and the scribe lays down his pen.

def build(EP, S, ln, bg, face, figs, fig, piece, fx, name, push, pan, hold, sh, CAVE, CAVE_V, CAVE_G, CAVE_CAM, RIM_GOLD, RIM_FIRE, RIM_COOL, RIM_LAMP):
  RIM_MOON = ['#cfe4ff', -3, -2, 0.55]
  KGLOW = ['#7ab0ff', 26, 0.3]
  DUSK = lambda: sh(bg(set='sky', tod='dusk', sun=[1200, 560, 140], sunCol='#e05a2a', hills=1, ground='#3a2014'), 'war_dusk')
  CRIMSON = lambda: sh(bg(set='sky', tod='crimson', hills=0, ground='#5a2a1e', hz=0), 'war_crimson')
  FIELD = lambda: sh(bg(set='field', sunX=1200, sunY=560, dead=1), 'field_dead')
  NIGHTCAMP = lambda: sh(bg(set='camp'), 'war_camp')
  ASHES = lambda: sh(bg(set='field', sunX=900, sunY=560, armies=0, dead=1), 'field_ashes')
  EP(10, 'The Victory of Dharma', 'धर्म की विजय', 'Eight more days. Then the scribe lays down his pen.', 'आठ दिन और। फिर लेखक अपनी लेखनी रख देता है।', [
  S('a_cave', 'mystery', [
      ln('VYASA', 'The last night. The lamps were low, and neither of them had slept. Ganesha cut a fresh leaf and waited. Vyasa said: now write quickly, scribe, for I do not want to stay long in these days.',
                  'अंतिम रात। दीपक मंद थे, और दोनों में से कोई नहीं सोया था। गणेश ने एक नया पत्ता काटा और प्रतीक्षा की। व्यास बोले: अब शीघ्र लिखो, लेखक, क्योंकि मैं इन दिनों में अधिक देर नहीं रुकना चाहता।', at=5.0)],
    CAVE('night') + [fx('stars', n=80)], cam=[[800, 520, 1.3], [800, 470, 1.05]], amb='night', min=12, eptitle=1, tin='fade'),
  S('a_ganesha', 'mystery', [
      ln('GANESHA', 'My pen is ready, Muni. It has not stopped once. It will not stop now.', 'मेरी लेखनी तैयार है, मुनिवर। यह एक बार भी नहीं रुकी। अब भी नहीं रुकेगी।')],
    CAVE_G(), cam=push(820, 430, 1.0, 1.08), amb='night'),

  # ---------- the wheel ----------
  S('b_drona', 'tension', [
      ln('VYASA', 'Drona now led the Kauravas. On the thirteenth day he drew up his army in the chakravyuha, a wheel of warriors that turns and closes, ring inside ring. And the Kauravas lured Arjuna away to the far south of the field.',
                  'अब द्रोण कौरवों का नेतृत्व कर रहे थे। तेरहवें दिन उन्होंने अपनी सेना चक्रव्यूह में सजाई, योद्धाओं का एक पहिया जो घूमता है और बंद होता है, घेरे के भीतर घेरा। और कौरवों ने अर्जुन को रणभूमि के सुदूर दक्षिण में भटका दिया।')],
    [sh(bg(set='sky', tod='dawn', hills=0, ground='#8a5a3e', hz=0), 'vyuha_dawn'), piece('ring', 'vyuhaRing', k='anim', every=2, add=False, x=800, y=450), fx('dust', n=60, col='#e0b070')],
    cam=[[800, 450, 1.25], [800, 450, 0.95]], amb='battle', min=10, sfx=[dict(n='drumroll', at=2), dict(n='conch', at=7)]),
  S('b_abhi', 'heroic', [
      ln('YUDHI', 'No one but Arjuna knows how to break it. And Arjuna is gone.', 'अर्जुन के सिवा कोई इसे तोड़ना नहीं जानता। और अर्जुन यहाँ नहीं हैं।'),
      ln('ABHI', 'I know, uncle. I heard my father tell it to my mother, when I was still in her womb. I know the way in. She fell asleep before he told the way out. But open the gap behind me, and I will go.',
                 'मैं जानता हूँ, तात। जब मैं माँ के गर्भ में था, तब मैंने पिता को माँ से यह कहते सुना था। मैं भीतर जाने का मार्ग जानता हूँ। बाहर निकलने का मार्ग बताने से पहले माँ सो गईं। पर मेरे पीछे रास्ता खोलिए, और मैं जाऊँगा।', gap=0.6)],
    [bg(set='field', sunX=820, sunY=500), face('abhi', 800, 450, 205, 1, 'stern', rim=RIM_GOLD), fx('dust', n=80)],
    cam=push(800, 450, 1.0, 1.14), amb='battle', hero=1, name=name('ABHIMANYU', 'अभिमन्यु', 'son of Arjuna, sixteen years old', 'अर्जुनपुत्र, सोलह वर्ष का', 1)),
  S('b_in', 'battle', [
      ln('VYASA', 'He broke in like fire into dry grass. But behind him Jayadratha, king of Sindhu, held the gap, and threw back every Pandava who tried to follow. The wheel closed. The boy was alone inside.',
                  'वह ऐसे घुसा जैसे सूखी घास में आग। पर उसके पीछे सिंधु के राजा जयद्रथ ने दरार रोक ली, और उसके पीछे आने वाले हर पांडव को लौटा दिया। चक्र बंद हो गया। बालक भीतर अकेला था।')],
    [bg(set='field', sunX=820, sunY=500), piece('chariot', 'warChariot', k='anim', every=2, d=1.0, x=800, y=860, s=0.9, rider='abhi', driver='soldier'), fx('dust', n=90, col='#e0b070'), fx('embers', n=40)],
    cam=pan(560, 1040, 480, 1.1, 480, 1.1), amb='battle', sfx=[dict(n='hooves', at=0.5), dict(n='clash', at=4), dict(n='clash', at=6)]),
  S('b_jaya', 'tension', [
      ln('VYASA', 'Jayadratha had once tried to carry off Draupadi in the forest, and Bhima had shaved his head in five tufts and let him go. He had prayed to Shiva for revenge, and Shiva had given him one day: one day on which he could hold back four of the Pandavas. This was that day.',
                  'जयद्रथ ने एक बार वन में द्रौपदी का हरण करने का प्रयास किया था, और भीम ने उसका सिर पाँच चोटियों में मूँडकर उसे छोड़ दिया था। उसने प्रतिशोध के लिए शिव की प्रार्थना की थी, और शिव ने उसे एक दिन दिया था: एक दिन जब वह चार पांडवों को रोक सके। यह वही दिन था।')],
    [FIELD(), face('jayadratha', 800, 450, 200, 1, 'cruel', rim=RIM_FIRE)],
    cam=push(800, 450, 1.04, 1.18), amb='battle', name=name('JAYADRATHA', 'जयद्रथ', 'king of Sindhu', 'सिंधु नरेश', 1)),
  S('b_seven', 'battle', [
      ln('VYASA', 'Seven great warriors surrounded him: Drona, Kripa, Karna, Ashwatthama, Duryodhana, Shakuni, Dushasana\'s son. Karna cut his bowstring from behind. They killed his horses and his charioteer. His sword broke. And still he fought, with a chariot wheel raised over his head.',
                  'सात महारथियों ने उसे घेर लिया: द्रोण, कृप, कर्ण, अश्वत्थामा, दुर्योधन, शकुनि, दुःशासन का पुत्र। कर्ण ने पीछे से उसकी प्रत्यंचा काट दी। उन्होंने उसके घोड़े और सारथी मार डाले। उसकी तलवार टूट गई। और फिर भी वह लड़ता रहा, सिर पर रथ का पहिया उठाए।')],
    [CRIMSON(), piece('ring', 'vyuhaRing', k='anim', every=2, add=False, x=800, y=450, close=1), figs('abhi', [fig('abhi', 800, 640, 360, 1, 'maceUp', weapon='wheel')], rim=RIM_GOLD), fx('dust', n=80, col='#c05a3a')],
    cam=push(800, 450, 1.1, 1.32), amb='battle', g=dict(tint='#ff6040', k=0.08), sfx=[dict(n='clash', at=2), dict(n='clash', at=4), dict(n='clash', at=6.5), dict(n='clash', at=9), dict(n='crack', at=12)]),
  S('b_fall', 'lament', [
      ln('VYASA', 'And when the wheel too was broken, Dushasana\'s son struck him with a mace as he rose from the ground. Abhimanyu fell, and the sun went down on the thirteenth day.',
                  'और जब पहिया भी टूट गया, तो जैसे ही वह भूमि से उठा, दुःशासन के पुत्र ने उस पर गदा से प्रहार किया। अभिमन्यु गिर पड़ा, और तेरहवें दिन का सूर्य डूब गया।')],
    [sh(bg(set='sky', tod='crimson', sun=[800, 640, 160], sunCol='#e04a20', hills=1, ground='#2a1010'), 'sky_crimson_sun'), piece('sunset', 'sinkingSun', k='anim', every=3, add=True, x=800, y=640), figs('fallen', [fig('abhi', 800, 880, 300, 1, 'despair', sil=True)])],
    cam=push(800, 560, 1.0, 1.14), amb='wind', min=10, sfx=[dict(n='boom', at=3.0, v=0.6), dict(n='gong', at=4.0, v=0.6)]),
  S('b_cave', 'lament', [
      ln('GANESHA', 'Seven against one. And a boy.', 'एक के विरुद्ध सात। और वह भी एक बालक।'),
      ln('VYASAC', 'Write it, scribe. From that evening, no one on that field kept the rules again.', 'लिखो, लेखक। उस साँझ से, उस रणभूमि पर किसी ने फिर कोई नियम नहीं माना।', gap=0.8)],
    CAVE(), cam=CAVE_CAM['two'], amb='night'),

  # ---------- Jayadratha ----------
  S('c_vow', 'tension', [
      ln('ARJUNA', 'Jayadratha held the gate while they killed my son. Hear me, all of you! If I do not kill him before the sun sets tomorrow, I will walk into the fire myself!', 'जब उन्होंने मेरे पुत्र को मारा, जयद्रथ ने द्वार रोक रखा था। सब सुनो! यदि कल सूर्यास्त से पहले मैंने उसे नहीं मारा, तो मैं स्वयं अग्नि में प्रवेश करूँगा!')],
    [NIGHTCAMP(), fx('embers', n=60), face('arjuna', 800, 450, 210, 1, 'anger', rim=RIM_FIRE)],
    cam=push(800, 450, 1.02, 1.2), amb='night', sfx=[dict(n='thunder', at=8, v=0.5), dict(n='conch', at=10, v=0.5)]),
  S('c_hide', 'battle', [
      ln('VYASA', 'The whole Kaurava army formed a wall around Jayadratha. All day Arjuna cut his way through it, mile after mile, until his horses were too tired to run, and Krishna unyoked them and let them drink in the middle of the battle, while Arjuna held off the army alone.',
                  'पूरी कौरव सेना ने जयद्रथ के चारों ओर दीवार बना ली। दिन भर अर्जुन उसे काटते हुए आगे बढ़े, कोस दर कोस, जब तक उनके घोड़े दौड़ने से थक नहीं गए, और कृष्ण ने युद्ध के बीचों बीच उन्हें खोलकर पानी पिलाया, जबकि अर्जुन ने अकेले सेना को रोके रखा।')],
    [sh(bg(set='field', sunX=900, sunY=420), 'field_noon'), piece('chariot', 'warChariot', k='anim', every=2, d=1.0, x=800, y=860, s=0.9, rider='arjuna', driver='krishna'), piece('volley', 'arrowRain', k='anim', every=2, add=True), fx('dust', n=100, col='#e0b070')],
    cam=[[800, 460, 0.98], [800, 520, 1.12]], amb='battle', min=10, sfx=[dict(n='whoosh', at=2), dict(n='whoosh', at=3), dict(n='clash', at=6)]),
  S('c_sunset', 'krishna', [
      ln('VYASA', 'The sun touched the hills, and Jayadratha was still far away. Then Krishna raised his discus and hid the sun behind it. The field went dark. The Kauravas cheered. Jayadratha came out from behind the wall to see Arjuna walk into the fire.',
                  'सूर्य पहाड़ियों को छूने लगा, और जयद्रथ अब भी बहुत दूर था। तब कृष्ण ने अपना चक्र उठाया और सूर्य को उसके पीछे छिपा दिया। रणभूमि अँधेरी हो गई। कौरवों ने जयकार की। जयद्रथ दीवार के पीछे से निकल आया, अर्जुन को अग्नि में प्रवेश करते देखने।'),
      ln('KRISHNA', 'Now, Arjuna. The sun has not set. Look.', 'अब, अर्जुन। सूर्य अस्त नहीं हुआ। देखो।', fx='divine', gap=0.4)],
    [DUSK(), piece('eclipse', 'eclipse', k='anim', every=2, add=False, x=1000, y=380), piece('shot', 'arrowStreak', k='anim', every=1, add=True, t0=19.0, x0=200, y0=700, x1=1300, y1=640)],
    cam=push(900, 430, 1.0, 1.12), amb='battle', min=22, sfx=[dict(n='swell', at=6), dict(n='cheer', at=11, v=0.4), dict(n='sparkle', at=18.5), dict(n='whoosh', at=19.0), dict(n='crack', at=19.4)]),
  S('c_head', 'mystery', [
      ln('VYASA', 'Jayadratha\'s father had laid a curse: whoever made his son\'s head fall to the ground, his own head would burst. So Arjuna\'s arrow carried the head through the sky, and dropped it in the lap of the old king, praying at sunset. He stood up, startled, and the head rolled to the earth.',
                  'जयद्रथ के पिता ने शाप दिया था: जो कोई उसके पुत्र का सिर भूमि पर गिराएगा, उसका अपना सिर फट जाएगा। इसलिए अर्जुन का बाण सिर को आकाश में ले गया, और उसे संध्या वंदन करते वृद्ध राजा की गोद में गिरा दिया। वे चौंककर उठे, और सिर धरती पर लुढ़क गया।')],
    [sh(bg(set='sky', tod='dusk', sun=[1300, 620, 100], sunCol='#e05a2a', hills=1, ground='#2a1a14'), 'dusk_far'), piece('shot', 'arrowStreak', k='anim', every=1, add=True, t0=4.0, x0=100, y0=600, x1=1500, y1=300), fx('dust', n=30, col='#e08050')],
    cam=[[700, 480, 1.0], [900, 420, 1.1]], amb='wind', sfx=[dict(n='whoosh', at=4.0), dict(n='crack', at=17.0, v=0.5)]),

  # ---------- Ghatotkacha ----------
  S('d_night', 'storm', [
      ln('VYASA', 'That night the war did not stop at dusk. They fought by torchlight. And out of the dark came Ghatotkacha, son of Bhima and Hidimbi, half rakshasa, tall as a palm tree, and the night was his.',
                  'उस रात युद्ध साँझ को नहीं रुका। वे मशालों के प्रकाश में लड़े। और अँधेरे से घटोत्कच निकला, भीम और हिडिंबी का पुत्र, आधा राक्षस, ताड़ के पेड़ जितना ऊँचा, और रात उसकी थी।')],
    [NIGHTCAMP(), figs('ghat', [fig('ghatotkacha', 800, 900, 760, 1, 'maceUp', weapon='mace')], rim=RIM_FIRE), fx('fire', at=[[200, 860, 120, 160], [1400, 860, 120, 160]]), fx('embers', n=80)],
    cam=[[800, 560, 1.25], [800, 460, 1.0]], amb='battle', min=10, sfx=[dict(n='roar', at=3.0), dict(n='thunder', at=4.0, v=0.6)], name=name('GHATOTKACHA', 'घटोत्कच', 'son of Bhima', 'भीमपुत्र', 1)),
  S('d_roar', 'battle', [
      ln('GHATOT', 'Kauravas! Did you think the night would hide you? I am the night! Run, or be crushed!', 'कौरवो! क्या तुमने सोचा था रात तुम्हें छिपा लेगी? मैं ही रात हूँ! भागो, या कुचले जाओ!')],
    [NIGHTCAMP(), face('ghatotkacha', 800, 440, 220, 1, 'roar', rim=RIM_FIRE), fx('embers', n=60)],
    cam=push(800, 440, 1.04, 1.2), amb='battle', shake=[[0.5, 2.0]], sfx=[dict(n='roar', at=0.3)]),
  S('d_shakti', 'kala', [
      ln('VYASA', 'He rained rocks and trees and fire on them, and the Kaurava army broke and ran. Duryodhana begged Karna: use it, or none of us will see the morning. And Karna took out the Shakti, Indra\'s spear that never misses, the one weapon he had kept all these years for Arjuna. And he threw it at Ghatotkacha.',
                  'उसने उन पर पत्थर, पेड़ और आग बरसाई, और कौरव सेना टूटकर भागी। दुर्योधन ने कर्ण से विनती की: उसका प्रयोग करो, वरना हममें से कोई सुबह नहीं देखेगा। और कर्ण ने शक्ति निकाली, इंद्र का वह भाला जो कभी नहीं चूकता, वह एक अस्त्र जो उन्होंने इतने वर्षों से अर्जुन के लिए रखा था। और उसे घटोत्कच पर चला दिया।')],
    [NIGHTCAMP(), figs('karna', [fig('karna', 800, 880, 620, 1, 'spear', weapon='spear')], rim=RIM_FIRE), fx('flash', at=[20.0]), fx('embers', n=60)],
    cam=push(800, 470, 1.02, 1.16), amb='battle', sfx=[dict(n='magic', at=17.0), dict(n='whoosh', at=20.0), dict(n='thunder', at=20.4)]),
  S('d_fall', 'lament', [
      ln('VYASA', 'The spear struck his heart. And as he died, Ghatotkacha made himself larger, as large as a mountain, and fell on the Kaurava army, and crushed a whole division beneath him. That was his last gift to his father.',
                  'भाला उसके हृदय में लगा। और मरते हुए घटोत्कच ने स्वयं को और बड़ा कर लिया, पर्वत जितना बड़ा, और कौरव सेना पर गिर पड़ा, और एक पूरी अक्षौहिणी को अपने नीचे कुचल दिया। वह अपने पिता को उसका अंतिम उपहार था।')],
    [NIGHTCAMP(), figs('ghat', [fig('ghatotkacha', 800, 980, 1100, 1, 'despair', sil=True)], mv=dict(r=[0, 24], dy=[0, 80], t=[4, 10], ax=800, ay=980, ease='in')), fx('fire', at=[[300, 860, 140, 180], [1300, 860, 140, 180]]), fx('dust', n=80, col='#806040')],
    cam=[[800, 460, 0.95], [800, 520, 1.05]], amb='battle', shake=[[9.5, 11.0]], sfx=[dict(n='rumble', at=8.0), dict(n='boom', at=9.6)]),
  S('d_krishna', 'krishna', [
      ln('BHIMA', 'My son is dead, and Krishna is smiling? Krishna, how can you smile?', 'मेरा पुत्र मर गया, और कृष्ण मुस्कुरा रहे हैं? कृष्ण, आप मुस्कुरा कैसे सकते हैं?', fx='roar'),
      ln('KRISHNA', 'Because Arjuna is alive, Bhima. Karna has thrown away the only weapon that could have killed him. Ghatotkacha has given his life for his uncle. Weep for him, and honour him. He was the bravest of your sons.',
                    'क्योंकि अर्जुन जीवित हैं, भीम। कर्ण ने वह एकमात्र अस्त्र गँवा दिया जो उन्हें मार सकता था। घटोत्कच ने अपने चाचा के लिए प्राण दिए हैं। उसके लिए रोओ, और उसका सम्मान करो। वह तुम्हारे पुत्रों में सबसे वीर था।', fx='divine', gap=0.6)],
    [NIGHTCAMP(), face('bhima', 540, 460, 180, 1, 'sorrow', n='bh', rim=RIM_FIRE), face('krishna', 1100, 450, 180, -1, 'calm', n='kr', rim=RIM_MOON, glow=KGLOW)],
    cam=[[620, 460, 1.1], [1040, 450, 1.1]], amb='night'),

  # ---------- Drona ----------
  S('e_drona', 'tension', [
      ln('VYASA', 'On the fifteenth day Drona was unstoppable. Thousands fell before the teacher. Krishna said: he will not be defeated while he holds his bow. But if he hears that his son is dead, he will lay it down.',
                  'पंद्रहवें दिन द्रोण अजेय थे। गुरु के सामने हज़ारों गिरे। कृष्ण ने कहा: जब तक वे धनुष धारण करेंगे, उन्हें हराया नहीं जा सकता। पर यदि वे सुनें कि उनका पुत्र मर गया, तो वे उसे रख देंगे।')],
    [FIELD(), figs('drona', [fig('drona', 800, 880, 620, 1, 'draw', weapon='bowDrawn')], rim=RIM_FIRE), fx('dust', n=80, col='#e0b070')],
    cam=push(800, 470, 1.0, 1.14), amb='battle', sfx=[dict(n='whoosh', at=2), dict(n='whoosh', at=3.2)]),
  S('e_lie', 'sorrow', [
      ln('VYASA', 'Bhima killed an elephant named Ashwatthama, and shouted that Ashwatthama was dead. Drona did not believe him. He turned to the one man who had never lied.', 'भीम ने अश्वत्थामा नाम के एक हाथी को मारा, और चिल्लाए कि अश्वत्थामा मारा गया। द्रोण ने विश्वास नहीं किया। वे उस एक मनुष्य की ओर मुड़े जिसने कभी असत्य नहीं बोला था।'),
      ln('YUDHI', 'Ashwatthama is dead...', 'अश्वत्थामा मारा गया...', gap=0.6),
      ln('YUDHI', '...the elephant.', '...हाथी।', vol=0.35, gap=0.15),
      ln('VYASA', 'Krishna\'s conch drowned the last words. And Yudhishthira\'s chariot, which had always run four fingers above the earth, sank down and touched the ground.', 'अंतिम शब्द कृष्ण के शंख में डूब गए। और युधिष्ठिर का रथ, जो सदा धरती से चार उँगली ऊपर चलता था, नीचे उतरकर भूमि से छू गया।', gap=0.4)],
    [FIELD(), face('drona', 560, 460, 180, 1, 'sorrow', n='drona'), face('yudhi', 1150, 460, 170, -1, 'sorrow', n='yudhi')],
    cam=[[1050, 460, 1.1], [620, 460, 1.1]], amb='battle', sfx=[dict(n='conch', at=10.5, v=1.0), dict(n='rumble', at=17.0, v=0.4)]),
  S('e_down', 'lament', [
      ln('VYASA', 'Drona put down his bow and sat in his chariot, and closed his eyes, and his mind went out of his body. And Dhrishtadyumna, born from the fire to kill him, cut off the head of a man already gone.',
                  'द्रोण ने धनुष रख दिया और अपने रथ में बैठ गए, और आँखें बंद कर लीं, और उनका मन शरीर से बाहर चला गया। और धृष्टद्युम्न, जो उन्हें मारने के लिए अग्नि से जन्मा था, ने उस मनुष्य का सिर काट दिया जो पहले ही जा चुका था।')],
    [FIELD(), figs('drona', [fig('drona', 800, 880, 560, 1, 'despair')], rim=RIM_GOLD), fx('rays', x=800, y=300, r0=60, r1=700, col='#fff0c0'), fx('sparkle', y0=200, y1=600, n=40)],
    cam=push(800, 500, 1.04, 1.2), amb='wind', sfx=[dict(n='om', at=4.0, v=0.4), dict(n='gong', at=14.0, v=0.5)]),

  # ---------- Karna ----------
  S('f_bhima', 'storm', [
      ln('VYASA', 'On the sixteenth day Bhima found Dushasana, and threw him down, and tore open his chest, and drank his blood, as he had sworn in the dice hall. And Draupadi washed her hair in it, and tied it up at last, after thirteen years.',
                  'सोलहवें दिन भीम ने दुःशासन को पाया, और उसे गिरा दिया, और उसकी छाती चीर दी, और उसका रक्त पिया, जैसी उन्होंने द्यूत सभा में प्रतिज्ञा की थी। और द्रौपदी ने उससे अपने केश धोए, और तेरह वर्ष बाद आखिरकार उन्हें बाँधा।')],
    [CRIMSON(), face('bhima', 560, 450, 190, 1, 'roar', n='bh', rim=RIM_FIRE), face('draupadi', 1100, 450, 170, -1, 'stern', n='dr', rim=RIM_FIRE, wind=1)],
    cam=[[620, 450, 1.1], [1040, 450, 1.1]], amb='battle', g=dict(tint='#ff4030', k=0.1), sfx=[dict(n='roar', at=1.0), dict(n='drumroll', at=10.0)]),
  S('f_kunti', 'lament', [
      ln('VYASA', 'On the seventeenth day Karna rode out with Shalya, king of Madra, as his charioteer. Before the war, Kunti had come to him by the river and told him: you are my first son. He had promised her only this: you will still have five sons when it is over. Either Arjuna, or me.',
                  'सत्रहवें दिन कर्ण मद्र नरेश शल्य को सारथी बनाकर निकले। युद्ध से पहले कुंती नदी किनारे उनके पास आई थीं और कहा था: तुम मेरे पहले पुत्र हो। उन्होंने उन्हें केवल यह वचन दिया था: अंत में भी तुम्हारे पाँच पुत्र रहेंगे। या तो अर्जुन, या मैं।')],
    [sh(bg(set='river', tod='dawn'), 'river_dawn'), face('karna', 800, 450, 200, 1, 'sorrow', rim=RIM_GOLD, glow=['#ffd080', 26, 0.3])],
    cam=push(800, 450, 1.0, 1.16), amb='river'),
  S('f_duel', 'battle', [
      ln('VYASA', 'The son of the Sun and the son of Indra met at last. Their arrows covered the sky. Shalya mocked Karna at every turn. Karna fought on. Then his chariot wheel sank into the earth, as a Brahmin\'s curse had foretold, and the mantra for his greatest weapon left his mind, as Parashurama had cursed.',
                  'सूर्यपुत्र और इंद्रपुत्र आखिरकार आमने सामने थे। उनके बाणों ने आकाश ढक दिया। शल्य हर मोड़ पर कर्ण का उपहास करते रहे। कर्ण लड़ते रहे। फिर उनके रथ का पहिया धरती में धँस गया, जैसा एक ब्राह्मण के शाप ने कहा था, और उनके सबसे बड़े अस्त्र का मंत्र उनके मन से चला गया, जैसा परशुराम ने शाप दिया था।')],
    [DUSK(), piece('volley', 'arrowRain', k='anim', every=2, add=True), figs('karna', [fig('karna', 800, 880, 640, 1, 'dice', weapon='wheel', poseOver=dict(seat=0, lean=30))], rim=RIM_FIRE), fx('dust', n=100)],
    cam=[[800, 440, 0.98], [800, 520, 1.14]], amb='battle', min=10, sfx=[dict(n='whoosh', at=2), dict(n='whoosh', at=3), dict(n='crack', at=14.0), dict(n='rumble', at=14.2)]),
  S('f_plead', 'tension', [
      ln('KARNA', 'Arjuna, wait! Let me free my wheel. Dharma forbids you to strike a man who is unarmed!', 'अर्जुन, रुको! मुझे अपना पहिया निकालने दो। धर्म निहत्थे पर वार करने से रोकता है!'),
      ln('KRISHNA', 'Dharma, Karna? Where was your dharma when Draupadi was dragged into the court and you called her a whore? Where was it when Abhimanyu stood alone against seven, and you cut his bow from behind?',
                    'धर्म, कर्ण? तब तुम्हारा धर्म कहाँ था जब द्रौपदी को सभा में घसीटा गया और तुमने उसे वेश्या कहा? तब कहाँ था जब अभिमन्यु अकेला सात के सामने खड़ा था, और तुमने पीछे से उसका धनुष काटा?', fx='divine', gap=0.6)],
    [DUSK(), face('karna', 540, 470, 180, 1, 'fear', n='karna', rim=RIM_FIRE), face('krishna', 1140, 450, 180, -1, 'stern', n='krishna', glow=KGLOW)],
    cam=[[620, 470, 1.1], [1060, 455, 1.1]], amb='wind'),
  S('f_fall', 'lament', [
      ln('VYASA', 'Karna had no answer. Arjuna loosed, and the son of the Sun fell, as the sun went down. And a light went out of his body and rose into the sun.', 'कर्ण के पास कोई उत्तर न था। अर्जुन ने बाण छोड़ा, और सूर्यपुत्र गिर पड़ा, जैसे सूर्य अस्त हुआ। और उनके शरीर से एक प्रकाश निकला और सूर्य में समा गया।')],
    [sh(bg(set='sky', tod='crimson', sun=[800, 640, 160], sunCol='#e04a20', hills=1, ground='#2a1010'), 'sky_crimson_sun'), piece('shot', 'arrowStreak', k='anim', every=1, add=True, t0=2.4, x0=100, y0=520, x1=820, y1=560), piece('sunset', 'sinkingSun', k='anim', every=3, add=True, x=800, y=640), fx('sparkle', y0=400, y1=700, n=50, col='#ffd080')],
    cam=push(800, 520, 1.0, 1.12), amb='wind', min=12, sfx=[dict(n='whoosh', at=2.4), dict(n='crack', at=2.8), dict(n='gong', at=3.4, v=0.6), dict(n='swell', at=8.0)]),
  S('f_kunti2', 'lament', [
      ln('VYASA', 'That night Kunti went to the field and sat by Karna\'s body, and wept as she had not wept for any of them. And the Pandavas learned, too late, whom they had killed: their eldest brother.',
                  'उस रात कुंती रणभूमि में गईं और कर्ण के शव के पास बैठीं, और ऐसे रोईं जैसे वे किसी के लिए नहीं रोई थीं। और पांडवों को बहुत देर से पता चला कि उन्होंने किसे मारा था: अपने सबसे बड़े भाई को।')],
    [ASHES(), figs('kunti', [fig('kunti', 800, 880, 520, 1, 'despair', sil=True)]), fx('stars', n=60), fx('fireflies', n=30)],
    cam=push(800, 560, 1.06, 1.2), amb='night'),

  # ---------- Duryodhana ----------
  S('g_lake', 'mystery', [
      ln('VYASA', 'On the eighteenth day Shalya fell, and Shakuni fell, and the last of the brothers fell. Duryodhana fled alone, and hid at the bottom of a lake, holding the waters still with a spell.',
                  'अठारहवें दिन शल्य गिरे, और शकुनि गिरे, और अंतिम भाई भी गिर गए। दुर्योधन अकेले भागे, और एक सरोवर की तली में छिप गए, एक मंत्र से जल को स्थिर रखते हुए।')],
    [sh(bg(set='lake', tod='dusk', lotus=4), 'lake_dusk'), fx('ripples', x=800, y=760), fx('fireflies', n=30)],
    cam=[[800, 520, 1.0], [800, 640, 1.2]], amb='river', min=9),
  S('g_mace', 'battle', [
      ln('BHIMA', 'Come out, Duryodhana! Remember the dice! Remember Draupadi! Remember the thigh you showed her!', 'बाहर आओ, दुर्योधन! द्यूत याद करो! द्रौपदी को याद करो! वह जंघा याद करो जो तुमने उसे दिखाई थी!', fx='roar'),
      ln('VYASA', 'He came out, mace on his shoulder. And they fought by the lake, while Balarama, who had taught them both, watched.', 'वे गदा कंधे पर लेकर बाहर आए। और वे सरोवर के किनारे लड़े, जबकि बलराम, जिन्होंने दोनों को सिखाया था, देखते रहे।', gap=0.6)],
    [sh(bg(set='lake', tod='dusk', lotus=4), 'lake_dusk'), figs('duel', [fig('bhima', 520, 880, 660, 1, 'maceUp', weapon='mace'), fig('duryo', 1100, 880, 640, -1, 'mace', weapon='mace')], rim=RIM_FIRE), fx('dust', n=80)],
    cam=pan(560, 1040, 470, 1.05, 470, 1.05), amb='battle', sfx=[dict(n='clash', at=7), dict(n='clash', at=9.5), dict(n='clash', at=12)]),
  S('g_thigh', 'battle', [
      ln('VYASA', 'Duryodhana was the better with the mace. Krishna caught Bhima\'s eye, and struck his own thigh. And Bhima swung low, below the waist, against every rule, and broke Duryodhana\'s thigh, as he had sworn thirteen years before. The war was over.',
                  'गदा में दुर्योधन श्रेष्ठ थे। कृष्ण ने भीम की आँख में देखा, और अपनी जंघा पर हाथ मारा। और भीम ने नीचे वार किया, कमर के नीचे, हर नियम के विरुद्ध, और दुर्योधन की जंघा तोड़ दी, जैसी उन्होंने तेरह वर्ष पहले प्रतिज्ञा की थी। युद्ध समाप्त हो गया।')],
    [sh(bg(set='lake', tod='crimson', lotus=0), 'lake_crimson'), figs('fallen', [fig('duryo', 1000, 880, 600, -1, 'despair')], mv=dict(dy=[0, 60], r=[0, 14], t=[11.0, 12.4], ax=1000, ay=880, ease='in'), rim=RIM_FIRE), figs('bhima', [fig('bhima', 520, 880, 680, 1, 'maceUp', weapon='mace')], rim=RIM_FIRE)],
    cam=push(800, 480, 1.0, 1.12), amb='wind', sfx=[dict(n='clash', at=11.0), dict(n='boom', at=11.2), dict(n='gong', at=16)], shake=[[11.0, 12.5]]),
  S('g_duryo', 'lament', [
      ln('DURYO', 'Who are you to talk of rules, cowherd? I ruled the earth. I lived as a king, I enjoyed what kings enjoy, and I die facing my enemies. Who of you can say as much? I go to heaven with my brothers. You stay behind, among the ashes.',
                  'तुम नियमों की बात करने वाले कौन हो, ग्वाले? मैंने पृथ्वी पर राज किया। मैं राजा की तरह जिया, मैंने वह सब भोगा जो राजा भोगते हैं, और मैं शत्रुओं का सामना करते हुए मरता हूँ। तुममें से कौन यह कह सकता है? मैं अपने भाइयों के साथ स्वर्ग जाता हूँ। तुम पीछे रहो, राख के बीच।')],
    [sh(bg(set='lake', tod='crimson', lotus=0), 'lake_crimson'), face('duryo', 800, 460, 200, 1, 'anger', rim=RIM_FIRE)],
    cam=push(800, 460, 1.04, 1.18), amb='wind', sfx=[dict(n='swell', at=16.0, v=0.4)]),

  # ---------- the night of fire ----------
  S('h_owl', 'mystery', [
      ln('VYASA', 'That night, Ashwatthama sat under a banyan tree, unable to sleep. He watched an owl come down in the dark and kill a whole nest of sleeping crows. And he got up.',
                  'उस रात अश्वत्थामा एक बरगद के नीचे बैठे थे, सो नहीं पा रहे थे। उन्होंने देखा एक उल्लू अँधेरे में उतरा और सोते हुए कौओं का पूरा घोंसला मार डाला। और वे उठ खड़े हुए।')],
    [sh(bg(set='forest', tod='night'), 'forest_night'), face('ashwa', 800, 460, 190, 1, 'cruel', rim=RIM_MOON), fx('fireflies', n=30)],
    cam=push(800, 460, 1.04, 1.2), amb='night', sfx=[dict(n='wind', at=1.0, v=0.4)], name=name('ASHWATTHAMA', 'अश्वत्थामा', 'son of Drona', 'द्रोणपुत्र', 1)),
  S('h_raid', 'storm', [
      ln('VYASA', 'He went into the Pandava camp while it slept. He killed Dhrishtadyumna, who had killed his father, in his bed. He killed the five sons of Draupadi, mistaking them for the Pandavas. He set the camp on fire. The five brothers and Krishna were away that night. No one else survived.',
                  'वे पांडव शिविर में घुसे जब सब सो रहे थे। उन्होंने धृष्टद्युम्न को, जिसने उनके पिता को मारा था, उसके बिस्तर में मार डाला। उन्होंने द्रौपदी के पाँचों पुत्रों को मार डाला, उन्हें पांडव समझकर। उन्होंने शिविर में आग लगा दी। उस रात पाँचों भाई और कृष्ण दूर थे। और कोई नहीं बचा।')],
    [NIGHTCAMP(), fx('fire', at=[[200, 820, 260, 300], [800, 860, 320, 340], [1400, 820, 260, 300]]), fx('embers', n=140), fx('dust', n=60, col='#402010')],
    cam=[[800, 460, 0.95], [800, 520, 1.12]], amb='fire', min=14, g=dict(tint='#ff5020', k=0.1), sfx=[dict(n='fire', at=0.5), dict(n='crack', at=6.0), dict(n='gasp', at=12.0, v=0.4)]),
  S('h_draupadi', 'lament', [
      ln('DRAUPADI', 'All five of them. My sons. They never even woke.', 'पाँचों। मेरे पुत्र। वे जागे तक नहीं।')],
    [ASHES(), face('draupadi', 800, 460, 200, 1, 'sorrow', rim=RIM_FIRE, wind=1), fx('embers', n=40)],
    cam=push(800, 460, 1.04, 1.18), amb='wind'),
  S('h_gem', 'kala', [
      ln('VYASA', 'They caught him by the Ganga. He loosed the Brahmastra at the womb of Uttara, Abhimanyu\'s widow, so the Pandava line would end. Krishna shielded the unborn child. Then Krishna took the jewel from Ashwatthama\'s forehead, and cursed him.',
                  'उन्होंने उन्हें गंगा के किनारे पकड़ा। उन्होंने उत्तरा के गर्भ पर ब्रह्मास्त्र छोड़ा, अभिमन्यु की विधवा, ताकि पांडवों का वंश समाप्त हो जाए। कृष्ण ने अजन्मे शिशु की रक्षा की। फिर कृष्ण ने अश्वत्थामा के माथे से मणि निकाल ली, और उन्हें शाप दिया।'),
      ln('KRISHNA', 'You will not die, Ashwatthama. You will wander the earth for three thousand years, alone, your wound never healing, and no one will give you shelter.', 'तुम मरोगे नहीं, अश्वत्थामा। तुम तीन हज़ार वर्ष तक पृथ्वी पर भटकोगे, अकेले, तुम्हारा घाव कभी नहीं भरेगा, और कोई तुम्हें आश्रय नहीं देगा।', fx='divine', gap=0.6)],
    [sh(bg(set='river', tod='dusk'), 'river_dusk'), face('ashwa', 560, 460, 180, 1, 'fear', n='as', rim=RIM_FIRE), face('krishna', 1120, 450, 180, -1, 'stern', n='kr', glow=KGLOW, halo=1), fx('flash', at=[2.0])],
    cam=[[620, 460, 1.1], [1060, 450, 1.1]], amb='river', sfx=[dict(n='thunder', at=2.0), dict(n='magic', at=18.0), dict(n='gong', at=22.0, v=0.5)]),

  # ---------- the women ----------
  S('i_field', 'lament', [
      ln('VYASA', 'Then the women came to Kurukshetra. Mothers, wives, daughters, walking among the dead, looking for faces. The field was silent except for the crows, and the weeping.',
                  'फिर स्त्रियाँ कुरुक्षेत्र आईं। माताएँ, पत्नियाँ, बेटियाँ, मृतकों के बीच चलती हुई, चेहरे खोजती हुई। कौओं और रुदन के सिवा रणभूमि मौन थी।')],
    [ASHES(), fx('dust', n=60, col='#806050'), figs('women', [fig('gandhari', 560, 880, 420, 1, 'despair', sil=True), fig('kunti', 860, 880, 400, 1, 'despair', sil=True), fig('draupadi', 1120, 880, 400, -1, 'despair', sil=True)])],
    cam=[[800, 440, 0.95], [800, 500, 1.08]], amb='wind', min=10),
  S('i_curse', 'lament', [
      ln('GANDHARI', 'A hundred sons, Krishna. A hundred. You could have stopped this, and you did not. As my family was destroyed, so will yours be. Thirty six years from now, your Yadavas will kill each other, and you will die alone in a forest.',
                     'सौ पुत्र, कृष्ण। सौ। तुम यह रोक सकते थे, पर तुमने नहीं रोका। जैसे मेरा कुल नष्ट हुआ, वैसे ही तुम्हारा भी होगा। आज से छत्तीस वर्ष बाद तुम्हारे यादव एक दूसरे को मार डालेंगे, और तुम एक वन में अकेले मरोगे।', fx='elder'),
      ln('KRISHNA', 'So be it, mother.', 'तथास्तु, माता।', fx='divine', gap=0.8)],
    [ASHES(), face('gandhari', 560, 460, 180, 1, 'anger', n='gandhari'), face('krishna', 1130, 450, 175, -1, 'sorrow', n='krishna', t=[18.0, 99])],
    cam=[[620, 460, 1.1], [1050, 450, 1.1]], amb='wind', sfx=[dict(n='thunder', at=17.0, v=0.5)]),

  # ---------- the crowning, and the grandsire's last day ----------
  S('j_crown', 'sorrow', [
      ln('VYASA', 'Yudhishthira was crowned in Hastinapura. Dhritarashtra placed the crown on his head with his own blind hands. The conches sounded. And the new king could not stop weeping.',
                  'हस्तिनापुर में युधिष्ठिर का राज्याभिषेक हुआ। धृतराष्ट्र ने अपने अंधे हाथों से उनके सिर पर मुकुट रखा। शंख बजे। और नए राजा का रोना रुक नहीं रहा था।')],
    [sh(bg(set='court', tone='#4a1612', throne=[800, 660, 240], canopy=1), 'court_crown'), face('yudhi', 800, 450, 200, 1, 'sorrow', rim=RIM_GOLD, style=dict(crown='royal')), fx('petals', n=50)],
    cam=push(800, 450, 1.0, 1.12), amb='court', sfx=[dict(n='conch', at=0.5, v=0.5), dict(n='bells', at=1)]),
  S('j_city', 'sorrow', [
      ln('VYASA', 'Eighteen armies had gone onto that field. Ten men came back. The city was full of widows, and the fields had no one to plough them.', 'उस रणभूमि में अठारह अक्षौहिणी सेनाएँ गई थीं। दस पुरुष लौटे। नगर विधवाओं से भरा था, और खेतों को जोतने वाला कोई न था।')],
    [sh(bg(set='city', tod='dusk'), 'city_dusk'), fx('dust', n=40, col='#c0a080')],
    cam=[[800, 470, 1.0], [800, 470, 1.08]], amb='wind', min=9),
  S('j_teach', 'gita', [
      ln('VYASA', 'Krishna took Yudhishthira to the bed of arrows, where the grandsire still lay waiting for the sun to turn. And for many days Bhishma taught him: how to rule, how to be just, how to live, how to die.',
                  'कृष्ण युधिष्ठिर को बाणों की शय्या के पास ले गए, जहाँ पितामह अब भी सूर्य के मुड़ने की प्रतीक्षा में लेटे थे। और कई दिनों तक भीष्म ने उन्हें सिखाया: कैसे राज करें, कैसे न्यायी हों, कैसे जियें, कैसे मरें।'),
      ln('BHISHMA', 'A king lives for his people, never for himself. Dharma is whatever protects all beings. Anger is the enemy within. Forgive, son. Forgive, and rule.', 'राजा अपनी प्रजा के लिए जीता है, कभी अपने लिए नहीं। धर्म वही है जो सभी प्राणियों की रक्षा करे। क्रोध भीतर का शत्रु है। क्षमा करो, पुत्र। क्षमा करो, और राज करो।', fx='elder', gap=0.6)],
    [sh(bg(set='sky', tod='dawn', sun=[1200, 600, 110], hills=1, ground='#3a2416'), 'sky_dawn_bed'), piece('bed', 'arrowBed', d=1.0, x=800, y=760, s=1.0), fx('rays', x=1200, y=600, r0=100, r1=900, col='#ffe0a0', spin=1)],
    cam=push(800, 600, 1.0, 1.14), amb='birds', min=12),
  S('j_die', 'divine', [
      ln('VYASA', 'And when the sun turned north, Bhishma folded his hands, looked at Krishna, and chose to die. The arrows fell out of his body one by one, and his soul rose through the crown of his head like a star, and went home to the sky. And the Ganga, his mother, wept.',
                  'और जब सूर्य उत्तरायण हुआ, भीष्म ने हाथ जोड़े, कृष्ण की ओर देखा, और स्वेच्छा से प्राण त्याग दिए। बाण एक एक करके उनके शरीर से गिर गए, और उनकी आत्मा एक तारे की तरह उनके सिर से निकलकर आकाश में अपने घर लौट गई। और गंगा, उनकी माता, रोईं।')],
    [sh(bg(set='sky', tod='dawn', sun=[1200, 600, 110], hills=1, ground='#3a2416'), 'sky_dawn_bed'), face('bhishma', 800, 450, 200, 1, 'smile', rim=RIM_GOLD, glow=['#ffe0a0', 30, 0.4], halo=1), fx('sparkle', y0=0, y1=500, n=60, col='#fff0c0')],
    cam=push(800, 440, 1.04, 1.2), amb='temple', sfx=[dict(n='om', at=6.0, v=0.5), dict(n='bells', at=10.0), dict(n='splash', at=20.0, v=0.3)]),
  S('j_ganga', 'river', [
      ln('VYASA', 'The river that had taken him as a child, and given him back as a man, took him again.', 'वह नदी जिसने उन्हें बालक के रूप में लिया था, और युवक के रूप में लौटाया था, उसने उन्हें फिर से ले लिया।')],
    [sh(bg(set='river', tod='dawn'), 'river_dawn'), fx('ripples', x=800, y=760), fx('sparkle', y0=600, y1=900, n=40)],
    cam=[[800, 470, 0.98], [800, 560, 1.12]], amb='river', min=9),

  # ---------- the scribe lays down his pen ----------
  S('k_cave', 'mystery', [
      ln('GANESHA', 'Is it finished, Muni?', 'क्या यह समाप्त हुआ, मुनिवर?'),
      ln('VYASAC', 'The war is finished. The story is not. There is a horse sacrifice, and the end of the Yadavas, and a long walk into the mountains, and a dog at the gate of heaven. But that is for another night.',
                   'युद्ध समाप्त हुआ। कथा नहीं। एक अश्वमेध है, और यादवों का अंत, और पर्वतों की ओर एक लंबी यात्रा, और स्वर्ग के द्वार पर एक कुत्ता। पर वह किसी और रात के लिए है।', gap=0.8)],
    CAVE(), cam=CAVE_CAM['two'], amb='night'),
  S('k_ask', 'mystery', [
      ln('GANESHA', 'Then tell me one thing tonight. Who won?', 'तो आज रात मुझे एक बात बताइए। कौन जीता?'),
      ln('VYASA', 'Vyasa was quiet for a long time. Then he said: write this, and then rest your pen.', 'व्यास बहुत देर तक मौन रहे। फिर बोले: यह लिखो, और फिर अपनी लेखनी को विश्राम दो।', gap=0.8)],
    CAVE_G(), cam=CAVE_CAM['hand'], amb='night'),
  S('k_verse', 'end', [
      ln('VYASAC', 'I raise my arms and I cry out, and no one listens. From dharma come wealth and pleasure both. Why then do people not follow dharma? Do not give it up, for desire, or fear, or greed, not even to save your life. Dharma is eternal. Pleasure and pain are not.',
                   'मैं भुजाएँ उठाकर पुकारता हूँ, और कोई नहीं सुनता। धर्म से ही अर्थ और काम दोनों आते हैं। फिर लोग धर्म का पालन क्यों नहीं करते? उसे मत छोड़ो, न कामना से, न भय से, न लोभ से, प्राण बचाने के लिए भी नहीं। धर्म नित्य है। सुख और दुःख नहीं।')],
    CAVE_V('calm'), cam=push(700, 430, 1.0, 1.12), amb='night', text=[dict(t0=1.0, t1=10.0, en='ūrdhva-bāhur viraumy eṣa na ca kaścic chṛṇoti me', hi='ऊर्ध्वबाहुर्विरौम्येष न च कश्चिच्छृणोति मे', f='verse', y=0.86)]),
  S('k_pen', 'divine', [
      ln('VYASA', 'And Ganesha wrote the last line, and laid down his broken tusk, and for the first time in all those nights, the pen stopped. The lamps had burned down. Outside, it was nearly dawn.',
                  'और गणेश ने अंतिम पंक्ति लिखी, और अपना टूटा दाँत रख दिया, और उन सारी रातों में पहली बार लेखनी रुकी। दीपक बुझने को थे। बाहर लगभग भोर हो चुकी थी।')],
    CAVE('dawn') + [fx('rays', x=800, y=200, r0=80, r1=900, col='#fff0c0'), fx('dust', n=40, col='#ffe0a0')], cam=CAVE_CAM['wide'], amb='birds', min=12, sfx=[dict(n='bell', at=4.0, v=0.4)]),
  S('k_end', 'end', [
      ln('NAR', 'Where there is Krishna, there is dharma. Where there is dharma, there is victory. Here ends the first book of the Mahabharata.', 'जहाँ कृष्ण हैं, वहाँ धर्म है। जहाँ धर्म है, वहाँ विजय है। यहाँ महाभारत का प्रथम खंड समाप्त होता है।')],
    [sh(bg(set='void', base='#0a1030', mandala=330, my=420, mcol='#d9a536'), 'end_void'), fx('wheel', x=800, y=420, r=330, spin=8, col='#f6dd8a'), fx('stars', n=120)],
    cam=push(800, 450, 1.0, 1.06), amb='temple', tout='fade', min=16,
    text=[dict(t0=8.0, t1=16, en='yato dharmas tato jayaḥ', hi='यतो धर्मस्ततो जयः', f='deva', sz=70, y=0.47, c='#f6dd8a'), dict(t0=9.0, t1=16, en='where there is dharma, there is victory', hi='जहाँ धर्म है, वहाँ विजय है', f='sub', sz=34, y=0.6, c='#f1e6cc')]),
  ])
