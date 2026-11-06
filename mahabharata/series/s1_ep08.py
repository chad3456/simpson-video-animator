# Season 1, Episode 8: the last embassy. The choice at Dwaraka, five villages, Krishna in the Kuru court, Karna's secret, and the armies gather.

def build(EP, S, ln, bg, face, figs, fig, piece, fx, name, push, pan, hold, sh, CAVE, CAVE_V, CAVE_G, CAVE_CAM, RIM_GOLD, RIM_FIRE, RIM_COOL, RIM_LAMP):
  RIM_MOON = ['#cfe4ff', -3, -2, 0.55]
  RIM_SUN = ['#ffe08a', -3, -2, 0.8]
  KGLOW = ['#7ab0ff', 26, 0.35]
  VCOURT = lambda: sh(bg(set='court', tone='#1a3a2a', throne=[800, 660, 240], canopy=1), 'virata_court')
  KURU = lambda: sh(bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), 'court_dark')
  DWARAKA = lambda: sh(bg(set='palace', tod='day', x=300, w=1000, h=600, col='#f0e6d0'), 'dwaraka')
  EP(8, 'Five Villages', 'पाँच गाँव', 'Krishna asks for peace. The answer is not even the point of a needle.', 'कृष्ण शांति माँगते हैं। उत्तर है, सुई की नोक भर भी नहीं।', [
  S('a_cave', 'mystery', [
      ln('VYASA', 'The eighth night. Ganesha had counted the leaves, and asked how many were left. Vyasa said: fewer than you have written, and heavier.',
                  'आठवीं रात। गणेश ने पत्ते गिने थे, और पूछा था कि कितने बचे हैं। व्यास ने कहा: जितने तुम लिख चुके हो उससे कम, और उससे भारी।', at=5.0)],
    CAVE('night'), cam=[[800, 520, 1.3], [800, 470, 1.05]], amb='night', min=12, eptitle=1, tin='fade'),
  S('a_ask', 'krishna', [
      ln('GANESHA', 'They kept their word. Surely now the blind king will give back what was taken?', 'उन्होंने अपना वचन निभाया। अब तो अंधे राजा जो लिया था वह लौटा देंगे?'),
      ln('VYASAC', 'Surely, you say. Write this down, scribe: nothing in this story is sure, except what was promised.', 'अवश्य, तुम कहते हो। यह लिखो, लेखक: इस कथा में कुछ भी निश्चित नहीं, सिवाय उसके जिसका वचन दिया गया।', gap=0.8)],
    CAVE_G(), cam=push(820, 430, 1.0, 1.08), amb='night'),

  # ---------- the council at Upaplavya ----------
  S('b_council', 'court', [
      ln('VYASA', 'The kings who loved the Pandavas met in Virata\'s hall. Krishna spoke first, quietly. Let us send an envoy, he said. Let us ask only for what is theirs by right. If Duryodhana gives it, there will be peace.',
                  'पांडवों से प्रेम करने वाले राजा विराट की सभा में मिले। कृष्ण पहले बोले, धीरे से। एक दूत भेजें, उन्होंने कहा। केवल वही माँगें जो इनका अधिकार है। यदि दुर्योधन दे दे, तो शांति होगी।')],
    [VCOURT(), figs('kings', [fig('virata', 360, 880, 440, 1, 'stand'), fig('drupada', 560, 880, 460, 1, 'stand'), fig('krishna', 800, 880, 480, 1, 'bless'), fig('yudhi', 1040, 880, 460, -1, 'stand'), fig('bhima', 1240, 880, 500, -1, 'stand')], rim=RIM_GOLD)],
    cam=pan(560, 1040, 470, 1.1), amb='court', min=11),
  S('b_balarama', 'tension', [
      ln('BALARAMA', 'And remember who lost it. No one forced Yudhishthira to play. He knew Shakuni\'s skill, and he played anyway. Ask humbly, I say. Do not threaten.', 'और याद रखो किसने खोया। युधिष्ठिर को खेलने के लिए किसी ने विवश नहीं किया। वे शकुनि की कुशलता जानते थे, फिर भी खेले। विनम्रता से माँगो, मैं कहता हूँ। धमकी मत दो।')],
    [VCOURT(), face('balarama', 560, 440, 190, 1, 'stern', rim=RIM_GOLD)],
    cam=push(580, 450, 1.04, 1.14), amb='court', hero=1, name=name('BALARAMA', 'बलराम', 'elder brother of Krishna', 'कृष्ण के बड़े भाई', 1)),
  S('b_satyaki', 'fire', [
      ln('SATYAKI', 'Humbly? They were cheated, and their queen was dragged by the hair! If Duryodhana will not give back the kingdom, we will take it, and his head with it!', 'विनम्रता से? उनके साथ छल हुआ, और उनकी रानी को केशों से घसीटा गया! यदि दुर्योधन राज्य नहीं लौटाएगा, तो हम ले लेंगे, और उसका सिर भी!')],
    [VCOURT(), face('satyaki', 1040, 440, 190, -1, 'anger', rim=RIM_FIRE)],
    cam=push(1020, 450, 1.04, 1.16), amb='court', sfx=[dict(n='clash', at=6.0, v=0.3)], hero=1, name=name('SATYAKI', 'सात्यकि', 'Krishna\'s kinsman', 'कृष्ण के बंधु', -1)),

  # ---------- the choice at Dwaraka ----------
  S('c_dwaraka', 'river', [
      ln('VYASA', 'Both sides began to gather allies. And both Arjuna and Duryodhana rode to Dwaraka on the same day, to ask for Krishna\'s help.', 'दोनों पक्ष मित्र जुटाने लगे। और अर्जुन और दुर्योधन दोनों एक ही दिन कृष्ण की सहायता माँगने द्वारका पहुँचे।')],
    [DWARAKA(), fx('sparkle', y0=650, y1=900, n=50), fx('ripples', x=800, y=860)],
    cam=[[800, 600, 1.35], [800, 460, 1.0]], amb='river', sfx=[dict(n='bells', at=2.0, v=0.3)], min=10),
  S('c_sleep', 'krishna', [
      ln('VYASA', 'Krishna was asleep. Duryodhana came in first, and sat on a fine seat at the head of the bed. Arjuna came in after him, and stood at Krishna\'s feet, with his hands joined.',
                  'कृष्ण सो रहे थे। दुर्योधन पहले आया, और पलंग के सिरहाने एक सुंदर आसन पर बैठ गया। अर्जुन उसके बाद आए, और हाथ जोड़कर कृष्ण के चरणों के पास खड़े हो गए।')],
    [sh(bg(set='chamber', tone='#1a2a4a', moon=1), 'krishna_room'), figs('two', [fig('duryo', 1100, 880, 520, -1, 'stand'), fig('arjuna', 420, 880, 520, 1, 'bless')], rim=RIM_MOON)],
    cam=push(760, 480, 1.04, 1.12), amb='night', sfx=[dict(n='flute', at=12.0, v=0.3)]),
  S('c_wake', 'krishna', [
      ln('KRISHNA', 'Arjuna! And Duryodhana too. You came first, cousin, but I saw Arjuna first. So here is the choice, and the younger chooses first. On one side, my whole army, the Narayanis, ten thousand times ten thousand warriors. On the other side, me. Alone. And I will not lift a weapon.',
                    'अर्जुन! और दुर्योधन भी। भाई, तुम पहले आए, पर मैंने अर्जुन को पहले देखा। तो यह रहा विकल्प, और छोटा पहले चुनेगा। एक ओर मेरी पूरी सेना, नारायणी सेना, असंख्य योद्धा। दूसरी ओर मैं। अकेला। और मैं कोई अस्त्र नहीं उठाऊँगा।')],
    [sh(bg(set='chamber', tone='#1a2a4a', moon=1), 'krishna_room'), face('krishna', 800, 440, 200, 1, 'smile', rim=RIM_MOON, glow=KGLOW)],
    cam=push(800, 450, 1.0, 1.14), amb='night'),
  S('c_choose', 'krishna', [
      ln('ARJUNA', 'You, Keshava. Only you.', 'आप, केशव। केवल आप।'),
      ln('VYASA', 'Duryodhana nearly laughed out loud. He had the army. What use was a cowherd who would not fight? He rode home rejoicing.', 'दुर्योधन लगभग ज़ोर से हँस पड़ा। उसे सेना मिल गई थी। एक ग्वाला जो लड़ेगा ही नहीं, किस काम का? वह प्रसन्न होकर लौटा।', gap=0.6),
      ln('KRISHNA', 'Why me, Partha? I will not fight.', 'मुझे क्यों, पार्थ? मैं लड़ूँगा नहीं।', gap=0.6),
      ln('ARJUNA', 'Then drive my chariot.', 'तो मेरा रथ हाँकिए।', gap=0.5)],
    [sh(bg(set='chamber', tone='#1a2a4a', moon=1), 'krishna_room'), face('arjuna', 560, 450, 180, 1, 'calm', n='ar', rim=RIM_MOON), face('krishna', 1080, 450, 180, -1, 'smile', n='kr', rim=RIM_MOON, glow=KGLOW)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='night', sfx=[dict(n='flute', at=14.0, v=0.4)]),
  S('c_shalya', 'tension', [
      ln('VYASA', 'King Shalya of Madra, the twins\' own uncle, set out with his army to join the Pandavas. All along the road he found pavilions waiting, with food and wine and music. Delighted, he asked who his generous host was, and promised him anything. It was Duryodhana.',
                  'मद्र के राजा शल्य, जुड़वाँ भाइयों के अपने मामा, अपनी सेना लेकर पांडवों से मिलने निकले। पूरे मार्ग में उन्हें भोजन, मदिरा और संगीत से भरे मंडप मिले। प्रसन्न होकर उन्होंने पूछा कि उनका उदार आतिथेय कौन है, और उसे कुछ भी देने का वचन दिया। वह दुर्योधन था।')],
    [sh(bg(set='valley', tod='gold', hz=480, city=[1250, 300], seed=0.6), 'valley_gold4'), face('shalya', 1040, 440, 190, -1, 'awe', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.0, 1.14), amb='wind', sfx=[dict(n='bells', at=1.0, v=0.3)], hero=1, name=name('SHALYA', 'शल्य', 'king of Madra', 'मद्र नरेश', -1)),
  S('c_shalya2', 'sorrow', [
      ln('YUDHI', 'Keep your word to him, uncle. But if you are ever made Karna\'s charioteer, do one thing for us. Talk. Tell him he cannot win. Break his heart while he fights.',
                  'उन्हें दिया वचन निभाइए, मामा। पर यदि आप कभी कर्ण के सारथी बनाए जाएँ, तो हमारे लिए एक काम कीजिए। बोलते रहिए। उससे कहिए कि वह जीत नहीं सकता। लड़ते समय उसका मनोबल तोड़ दीजिए।')],
    [VCOURT(), face('yudhi', 560, 450, 180, 1, 'sorrow', rim=RIM_GOLD)],
    cam=push(580, 450, 1.04, 1.14), amb='court'),

  # ---------- Sanjaya's embassy ----------
  S('c_balarama', 'sorrow', [
      ln('VYASA', 'Balarama would not fight against his pupil Duryodhana, nor against his brother Krishna. He took his plough and went on a pilgrimage along the Saraswati, saying he would come back when it was over.',
                  'बलराम न अपने शिष्य दुर्योधन के विरुद्ध लड़ना चाहते थे, न अपने भाई कृष्ण के विरुद्ध। वे अपना हल लेकर सरस्वती के किनारे तीर्थयात्रा पर चले गए, यह कहकर कि जब यह सब समाप्त होगा तब लौटेंगे।')],
    [bg(set='river', tod='dawn', hz=560), figs('bal', [fig('balarama', 820, 860, 300, 1, 'stand')]), fx('ripples', x=800, y=820)],
    cam=pan(1000, 640, 470, 1.15), amb='river', min=9),
  S('d_sanjaya', 'court', [
      ln('VYASA', 'The blind king sent Sanjaya to the Pandavas. He brought sweet words, and no kingdom. Peace is better than war, he said. It would be a sin for you to kill your own kin.',
                  'अंधे राजा ने संजय को पांडवों के पास भेजा। वह मीठे शब्द लाया, और कोई राज्य नहीं। युद्ध से शांति अच्छी है, उसने कहा। अपने ही बंधुओं को मारना आपके लिए पाप होगा।')],
    [VCOURT(), face('courtier', 1040, 450, 180, -1, 'calm', rim=RIM_GOLD, style=dict(cloth='#e8dcc0'))],
    cam=push(1020, 450, 1.0, 1.14), amb='court'),
  S('d_five', 'sorrow', [
      ln('YUDHI', 'Then tell my uncle this, Sanjaya. I do not ask for Indraprastha. Give us five villages. Kushasthala, Vrikasthala, Makandi, Varanavata, and one more, any one he likes. Five villages for five brothers. And there will be peace.',
                  'तो मेरे ज्येष्ठ पिता से यह कहना, संजय। मैं इंद्रप्रस्थ नहीं माँगता। हमें पाँच गाँव दे दें। कुशस्थल, वृकस्थल, माकंदी, वारणावत, और एक और, जो भी वे चाहें। पाँच भाइयों के लिए पाँच गाँव। और शांति होगी।')],
    [VCOURT(), face('yudhi', 800, 450, 210, 1, 'calm', rim=RIM_GOLD)],
    cam=push(800, 450, 1.04, 1.18), amb='court', sfx=[dict(n='bell', at=16.0, v=0.4)]),
  S('d_villages', 'river', [], [bg(set='valley', tod='gold', hz=440, seed=8.8, groves=14), sh(piece('folk', 'folk', cnt=8, y=780, s=50, seed=3), 'valley_folk8'), fx('dust', col='#f0c070', n=30)],
    cam=[[800, 520, 1.3], [800, 460, 1.0]], amb='birds', min=7),

  # ---------- Krishna goes to Hastinapura ----------
  S('d_bhishma', 'court', [
      ln('BHISHMA', 'Grandson, listen to an old man one last time. Where Krishna is, there is dharma. And where dharma is, there is victory. You cannot win this war.',
                    'पौत्र, एक वृद्ध की बात अंतिम बार सुन लो। जहाँ कृष्ण हैं, वहाँ धर्म है। और जहाँ धर्म है, वहाँ विजय है। तुम यह युद्ध नहीं जीत सकते।', fx='elder'),
      ln('DURYO', 'Then why do you stand with me, grandfather?', 'तो आप मेरे साथ क्यों खड़े हैं, पितामह?', fx='growl', gap=0.6),
      ln('BHISHMA', 'Because I ate the salt of this throne, and I swore to protect it. A man must keep his vow, even when it carries him to the wrong side.', 'क्योंकि मैंने इस सिंहासन का नमक खाया है, और इसकी रक्षा की शपथ ली है। मनुष्य को अपनी प्रतिज्ञा निभानी पड़ती है, चाहे वह उसे गलत पक्ष में ले जाए।', fx='elder', gap=0.6)],
    [KURU(), face('bhishma', 800, 440, 210, 1, 'sorrow', rim=RIM_GOLD)],
    cam=push(800, 450, 1.04, 1.18), amb='court'),
  S('e_hair', 'fire', [
      ln('VYASA', 'Krishna offered to go himself, the last envoy. Before he left, Draupadi came to him holding her long, unbound hair in her hand.', 'कृष्ण ने स्वयं जाने का प्रस्ताव रखा, अंतिम दूत बनकर। जाने से पहले द्रौपदी अपने लंबे, खुले केश हाथ में लिए उनके पास आईं।'),
      ln('DRAUPADI', 'Keshava, when you talk of peace, remember this hair. Dushasana\'s hand was in it. If my husbands will not fight, my old father will fight, and my five sons, with Abhimanyu leading them.',
                     'केशव, जब आप शांति की बात करें, तो इन केशों को याद रखिए। दुःशासन का हाथ इनमें था। यदि मेरे पति नहीं लड़ेंगे, तो मेरे वृद्ध पिता लड़ेंगे, और मेरे पाँचों पुत्र, अभिमन्यु के नेतृत्व में।', gap=0.6)],
    [VCOURT(), face('draupadi', 800, 450, 210, 1, 'anger', rim=RIM_FIRE, glow=['#ff5020', 26, 0.3], wind=1.4)],
    cam=push(800, 450, 1.04, 1.2), amb='court', sfx=[dict(n='heartbeat', at=6.0, v=0.4)]),
  S('e_road', 'march', [
      ln('VYASA', 'Krishna set out at dawn, in his chariot with the eagle banner, under a clear autumn sky. Sages lined the road to see him pass.', 'कृष्ण गरुड़ध्वज वाले अपने रथ में भोर को निकले, शरद के निर्मल आकाश के नीचे। उन्हें गुज़रते देखने के लिए ऋषि मार्ग के किनारे खड़े थे।')],
    [sh(bg(set='valley', tod='dawn', hz=470, city=[1200, 260], seed=0.0), 'valley_dawn'), piece('ch', 'warChariot', k='anim', every=2, x=300, y=860, s=0.6, rider='krishna'), fx('rays', x=1200, y=200, r0=60, r1=1000, col='#fff0c0')],
    cam=pan(560, 1040, 470, 1.15), amb='wind', sfx=[dict(n='hooves', at=0.3, v=0.6), dict(n='conch', at=6.0, v=0.4)], min=10),
  S('e_vidura', 'krishna', [
      ln('VYASA', 'In Hastinapura, Duryodhana had prepared a feast fit for a god. Krishna would not eat it. Food is eaten out of love, or out of need, he said. You have no love for me, and I am not in need. He went to Vidura\'s house, and ate plain rice, and was happy.',
                  'हस्तिनापुर में दुर्योधन ने देवताओं जैसा भोज तैयार किया था। कृष्ण ने उसे नहीं खाया। भोजन प्रेम से खाया जाता है, या आवश्यकता से, उन्होंने कहा। तुम्हें मुझसे प्रेम नहीं, और मुझे आवश्यकता नहीं। वे विदुर के घर गए, और सादा भात खाया, और प्रसन्न रहे।')],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), figs('vk', [fig('vidura', 620, 880, 500, 1, 'bless'), fig('krishna', 980, 880, 500, -1, 'stand')], rim=RIM_LAMP)],
    cam=push(800, 470, 1.04, 1.12), amb='night'),
  S('e_kunti', 'sorrow', [
      ln('VYASA', 'Kunti was there, in Vidura\'s house, where she had lived for thirteen years. She asked about each of her sons, one by one, and about Draupadi. Then she gave Krishna a message for Yudhishthira.',
                  'कुंती वहीं थीं, विदुर के घर में, जहाँ वे तेरह वर्षों से रह रही थीं। उन्होंने अपने हर पुत्र के बारे में एक एक कर पूछा, और द्रौपदी के बारे में। फिर उन्होंने कृष्ण को युधिष्ठिर के लिए एक संदेश दिया।'),
      ln('KUNTI', 'Tell him: the time has come for which a kshatriya mother bears a son.', 'उससे कहना: वह समय आ गया है जिसके लिए क्षत्रिय माता पुत्र को जन्म देती है।', gap=0.6)],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), face('kunti', 800, 450, 200, 1, 'stern', rim=RIM_LAMP)],
    cam=push(800, 450, 1.04, 1.16), amb='night'),

  # ---------- the court ----------
  S('f_court', 'court', [
      ln('VYASA', 'The next morning Krishna walked into the hall of the Kurus. Every king rose to his feet. Even Bhishma. Even Drona. Even, for a moment, Duryodhana.', 'अगली सुबह कृष्ण कुरुओं की सभा में आए। हर राजा उठ खड़ा हुआ। भीष्म भी। द्रोण भी। एक क्षण के लिए, दुर्योधन भी।')],
    [KURU(), figs('kenter', [fig('krishna', 800, 900, 600, 1, 'bless')], rim=RIM_GOLD, glow=KGLOW)],
    cam=[[800, 600, 1.3], [800, 470, 1.04]], amb='court', sfx=[dict(n='conch', at=0.5, v=0.5)], min=10),
  S('f_speech', 'krishna', [
      ln('KRISHNA', 'King, I have come to make peace between the Kurus and the Pandavas, without the death of a single warrior. Give your nephews what is theirs. Make them your sons again, and you will rule the whole earth with them at your side. Refuse, and you will see your hundred sons die, and the earth emptied of kings.',
                    'राजन, मैं कुरुओं और पांडवों के बीच शांति कराने आया हूँ, बिना किसी एक भी योद्धा की मृत्यु के। अपने भतीजों को उनका भाग दीजिए। उन्हें फिर से अपना पुत्र बनाइए, और उन्हें साथ लेकर आप पूरी पृथ्वी पर राज करेंगे। मना करेंगे, तो अपने सौ पुत्रों को मरते देखेंगे, और पृथ्वी को राजाओं से खाली।')],
    [KURU(), face('krishna', 800, 440, 210, 1, 'stern', rim=RIM_GOLD, glow=KGLOW)],
    cam=push(800, 450, 1.0, 1.16), amb='court'),
  S('f_elders', 'sorrow', [
      ln('VYASA', 'Bhishma begged Duryodhana to listen. Drona begged him. Vidura begged him. Gandhari was brought into the hall, and begged her son with her eyes covered.', 'भीष्म ने दुर्योधन से सुनने की विनती की। द्रोण ने विनती की। विदुर ने विनती की। गांधारी को सभा में लाया गया, और उन्होंने आँखों पर पट्टी बाँधे अपने पुत्र से विनती की।'),
      ln('GANDHARI', 'My son, a man who cannot rule his own anger cannot rule a kingdom. Make peace.', 'पुत्र, जो अपने ही क्रोध पर शासन नहीं कर सकता, वह राज्य पर शासन नहीं कर सकता। शांति कर लो।', gap=0.6)],
    [KURU(), face('gandhari', 800, 450, 200, 1, 'sorrow', rim=RIM_GOLD)],
    cam=push(800, 450, 1.04, 1.16), amb='court'),
  S('f_needle', 'kala', [
      ln('DURYO', 'Five villages? I will not give them as much land as could be covered by the point of a needle. Let them come and take it, if they can.', 'पाँच गाँव? मैं उन्हें उतनी भूमि भी नहीं दूँगा जितनी सुई की नोक पर टिक सके। आएँ और ले लें, यदि ले सकें।', fx='growl')],
    [KURU(), face('duryo', 800, 440, 210, 1, 'cruel', rim=RIM_FIRE), fx('embers', n=50)],
    cam=push(800, 450, 1.04, 1.22), amb='court', sfx=[dict(n='gong', at=7.0, v=0.7)]),
  S('f_arrest', 'tension', [
      ln('VYASA', 'And Duryodhana whispered to Dushasana and Karna: Krishna is alone. Seize him, bind him. Without Krishna, the Pandavas are nothing.', 'और दुर्योधन ने दुःशासन और कर्ण से फुसफुसाकर कहा: कृष्ण अकेले हैं। उन्हें पकड़ लो, बाँध दो। कृष्ण के बिना पांडव कुछ नहीं।')],
    [KURU(), face('dushasana', 560, 450, 180, 1, 'cruel', n='du', rim=RIM_FIRE), face('karna', 1080, 450, 180, -1, 'stern', n='ka', rim=RIM_GOLD)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='court', sfx=[dict(n='heartbeat', at=1.0, v=0.5)]),
  S('f_vishva', 'vishva', [
      ln('VYASA', 'Krishna laughed. And as he laughed, he grew. From his body blazed out the gods, Brahma on his brow, Shiva on his breast, the Adityas, the Rudras, the Vasus. Arjuna and Bhima at his arms, the Yadavas before him, weapons in a thousand hands, fire from his eyes and ears and mouth.',
                  'कृष्ण हँसे। और हँसते हुए वे बढ़ने लगे। उनके शरीर से देवता प्रकट हुए, ललाट पर ब्रह्मा, वक्ष पर शिव, आदित्य, रुद्र, वसु। भुजाओं पर अर्जुन और भीम, सामने यादव, हज़ार हाथों में अस्त्र, आँखों, कानों और मुख से अग्नि।')],
    [bg(set='cosmos', galaxies=4), piece('suns', 'thousandSuns', k='anim', every=2, add=True), piece('arms', 'vishvaArms', d=1.0, mv=dict(s=[0.6, 1.0], t=[0, 5], ax=800, ay=480, ease='out')), piece('form', 'vishvarupa', d=1.0, stage=1), fx('rays', x=800, y=420, r0=120, r1=1000, col='#fff0c0', spin=2)],
    cam=[[800, 700, 1.6], [800, 440, 1.0]], amb='void', sfx=[dict(n='boom', at=0.2), dict(n='swell', at=0.4), dict(n='om', at=2.0), dict(n='thunder', at=12.0, v=0.5)], tin='flash', shake=[[0.2, 1.2]], min=14),
  S('f_blind', 'divine', [
      ln('VYASA', 'The kings shut their eyes. Only Bhishma, Drona, Vidura, Sanjaya and the sages could look. And the blind king begged for sight, just for that moment, and was given it. He saw. Then he asked to be blind again, so that he would never see anything less.',
                  'राजाओं ने आँखें बंद कर लीं। केवल भीष्म, द्रोण, विदुर, संजय और ऋषि देख सके। और अंधे राजा ने उस एक क्षण के लिए दृष्टि माँगी, और उन्हें मिली। उन्होंने देखा। फिर उन्होंने फिर से अंधा होना माँगा, कि वे इससे कम कुछ भी कभी न देखें।')],
    [KURU(), face('dhrita', 800, 440, 210, 1, 'awe', rim=RIM_GOLD, glow=['#fff0c0', 30, 0.4]), fx('rays', x=800, y=420, r0=120, r1=900, col='#fff0c0')],
    cam=push(800, 450, 1.0, 1.16), amb='temple', sfx=[dict(n='bells', at=1.0), dict(n='om', at=10.0, v=0.4)]),
  S('f_leave', 'krishna', [
      ln('VYASA', 'Then Krishna was himself again, a dark young man in yellow silk, and he walked out of the hall, holding Satyaki and Kritavarma by the hand. Nobody tried to stop him.',
                  'फिर कृष्ण फिर से वही थे, पीले रेशम में एक साँवले युवक, और वे सात्यकि और कृतवर्मा का हाथ पकड़े सभा से बाहर चले गए। किसी ने उन्हें रोकने का प्रयास नहीं किया।')],
    [KURU(), figs('kout', [fig('krishna', 800, 900, 520, -1, 'stand'), fig('satyaki', 600, 900, 460, -1, 'stand')], rim=RIM_GOLD, glow=KGLOW), fx('dust', col='#f0c070', n=40)],
    cam=push(800, 480, 1.04, 0.98), amb='court'),
  S('f_cave', 'mystery', [
      ln('GANESHA', 'He showed them God, Muni. And they still chose war.', 'उन्होंने उन्हें भगवान दिखाए, मुनिवर। और उन्होंने फिर भी युद्ध चुना।'),
      ln('VYASAC', 'Seeing is not the same as surrendering, scribe. Duryodhana called it a conjurer\'s trick. Pride is a blindness no miracle can cure.', 'देखना समर्पण के समान नहीं है, लेखक। दुर्योधन ने इसे एक जादूगर की चाल कहा। अहंकार ऐसा अंधापन है जिसे कोई चमत्कार ठीक नहीं कर सकता।', gap=0.8)],
    CAVE(), cam=CAVE_CAM['two'], amb='night'),

  # ---------- Krishna and Karna ----------
  S('g_karna', 'krishna', [
      ln('VYASA', 'On his way out of the city, Krishna stopped his chariot, and invited Karna to ride with him a little way. And on the road, alone, he told him.', 'नगर से निकलते समय कृष्ण ने अपना रथ रोका, और कर्ण को थोड़ी दूर साथ चलने को बुलाया। और मार्ग में, एकांत में, उन्होंने उसे बताया।')],
    [sh(bg(set='valley', tod='dusk', hz=450, seed=2.1), 'valley_dusk'), piece('ch', 'warChariot', k='anim', every=2, x=400, y=860, s=0.6, rider='karna', driver='krishna')],
    cam=pan(600, 1000, 470, 1.15), amb='wind', sfx=[dict(n='hooves', at=0.3, v=0.5)]),
  S('g_reveal', 'krishna', [
      ln('KRISHNA', 'Karna, you are the son of Kunti, born before her marriage, by the Sun. You are the eldest of the Pandavas. Come with me. Yudhishthira will hold the umbrella over you. Bhima will fan you. Arjuna will drive your chariot. You will be king of the whole earth, and Draupadi will come to you too.',
                    'कर्ण, तुम कुंती के पुत्र हो, विवाह से पहले सूर्य से जन्मे। तुम पांडवों में सबसे बड़े हो। मेरे साथ चलो। युधिष्ठिर तुम्हारे ऊपर छत्र धरेंगे। भीम चँवर डुलाएँगे। अर्जुन तुम्हारा रथ हाँकेंगे। तुम पूरी पृथ्वी के राजा होगे, और द्रौपदी भी तुम्हारी होंगी।')],
    [sh(bg(set='sky', tod='dusk', sun=[900, 560, 160], sunCol='#e05a2a', hills=1, ground='#3a2014'), 'sky_dusk'), face('krishna', 1040, 440, 200, -1, 'calm', rim=RIM_FIRE, glow=KGLOW)],
    cam=push(1020, 450, 1.0, 1.14), amb='wind'),
  S('g_refuse', 'lament', [
      ln('KARNA', 'I know, Keshava. I have known for a long time. But Kunti threw me away on the day I was born. Radha took me in, and Adhiratha. I have performed their rites. And Duryodhana gave me a kingdom when the whole world laughed at me. I will not betray him now. Not for the earth. Not for gold.',
                  'मैं जानता हूँ, केशव। बहुत समय से जानता हूँ। पर कुंती ने मुझे जन्म के दिन ही त्याग दिया था। राधा ने मुझे अपनाया, और अधिरथ ने। मैंने उनके संस्कार किए हैं। और दुर्योधन ने मुझे तब राज्य दिया जब सारा संसार मुझ पर हँस रहा था। मैं अब उसे धोखा नहीं दूँगा। पृथ्वी के लिए नहीं। सोने के लिए नहीं।')],
    [sh(bg(set='sky', tod='dusk', sun=[900, 560, 160], sunCol='#e05a2a', hills=1, ground='#3a2014'), 'sky_dusk'), face('karna', 560, 450, 200, 1, 'sorrow', rim=RIM_SUN)],
    cam=push(580, 450, 1.04, 1.16), amb='wind'),
  S('g_secret', 'lament', [
      ln('KARNA', 'And one thing more. Do not tell Yudhishthira. If he knew I was his elder brother, he would give the kingdom to me, and I would give it to Duryodhana. Let him be king. I have seen the war, Krishna. I have dreamed it. The earth is an altar, and we are all the offering.',
                  'और एक बात। युधिष्ठिर को मत बताना। यदि उन्हें पता चला कि मैं उनका बड़ा भाई हूँ, तो वे राज्य मुझे दे देंगे, और मैं दुर्योधन को दे दूँगा। उन्हें राजा रहने दो। मैंने युद्ध देखा है, कृष्ण। मैंने उसका स्वप्न देखा है। पृथ्वी एक वेदी है, और हम सब आहुति हैं।')],
    [sh(bg(set='sky', tod='dusk', sun=[900, 560, 160], sunCol='#e05a2a', hills=1, ground='#3a2014'), 'sky_dusk'), piece('sunset', 'sinkingSun', k='anim', every=3, add=True, x=800, y=640)],
    cam=[[800, 470, 1.15], [800, 520, 1.0]], amb='wind', sfx=[dict(n='gong', at=20.0, v=0.4)]),

  # ---------- Kunti and Karna ----------
  S('h_ganga', 'river', [
      ln('VYASA', 'Kunti went to the Ganga at noon, where Karna stood every day in the water, praying to the Sun. She waited behind him in his shadow until he turned.', 'कुंती दोपहर को गंगा पर गईं, जहाँ कर्ण हर दिन पानी में खड़े होकर सूर्य की प्रार्थना करते थे। वे उनके पीछे उनकी छाया में प्रतीक्षा करती रहीं, जब तक वे मुड़े नहीं।')],
    [bg(set='river', tod='gold', hz=520), figs('kk', [fig('karna', 960, 900, 600, -1, 'vow'), dict(who='kunti', x=560, y=900, S=480, f=1)], rim=RIM_SUN, glow=['#ffd060', 20, 0.3]), fx('sparkle', y0=600, y1=900, n=40)],
    cam=push(760, 480, 1.04, 1.12), amb='river'),
  S('h_kunti', 'lament', [
      ln('KUNTI', 'You are my son, Karna. Mine. Do not fight your brothers.', 'तुम मेरे पुत्र हो, कर्ण। मेरे। अपने भाइयों से मत लड़ो।'),
      ln('KARNA', 'Where were you, mother, on the day they laughed at me in the arena? Where were you when I needed a name? You come now, the day before the war, for their sake, not mine.',
                  'आप कहाँ थीं, माँ, जिस दिन रंगभूमि में वे मुझ पर हँसे? आप कहाँ थीं जब मुझे एक नाम चाहिए था? आप अब आई हैं, युद्ध से एक दिन पहले, उनके लिए, मेरे लिए नहीं।', gap=0.6)],
    [bg(set='river', tod='gold', hz=520), face('kunti', 560, 450, 180, 1, 'sorrow', n='ku', rim=RIM_SUN), face('karna', 1080, 450, 190, -1, 'sorrow', n='ka', rim=RIM_SUN)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='river'),
  S('h_promise', 'lament', [
      ln('KARNA', 'But I will give you something, because no one has ever left me empty-handed. I will not kill Yudhishthira, Bhima, Nakula or Sahadeva, even if I have them in my power. Only Arjuna. One of us will die. Either way, mother, you will still have five sons.',
                  'पर मैं आपको कुछ दूँगा, क्योंकि मेरे पास से कभी कोई खाली हाथ नहीं गया। मैं युधिष्ठिर, भीम, नकुल या सहदेव को नहीं मारूँगा, चाहे वे मेरे वश में हों। केवल अर्जुन। हम दोनों में से एक मरेगा। जो भी हो, माँ, आपके पाँच पुत्र रहेंगे।')],
    [bg(set='river', tod='gold', hz=520), face('karna', 800, 450, 210, 1, 'sorrow', rim=RIM_SUN, glow=['#ffd060', 20, 0.3])],
    cam=push(800, 450, 1.04, 1.2), amb='river', sfx=[dict(n='gong', at=16.0, v=0.4)]),

  # ---------- the armies ----------
  S('i_march', 'march', [
      ln('VYASA', 'And so the armies marched to Kurukshetra, the field of the Kurus, a sacred plain where gods had once performed sacrifices. Seven armies for the Pandavas. Eleven for the Kauravas. Elephants, chariots, horses and foot soldiers beyond counting, stretching to the horizon.',
                  'और इस प्रकार सेनाएँ कुरुक्षेत्र की ओर चलीं, कुरुओं का क्षेत्र, एक पवित्र मैदान जहाँ कभी देवताओं ने यज्ञ किए थे। पांडवों की सात अक्षौहिणी सेनाएँ। कौरवों की ग्यारह। हाथी, रथ, घोड़े और पैदल सैनिक, अनगिनत, क्षितिज तक फैले।')],
    [bg(set='field', sunX=1100, sunY=520, armies=1, density=1.0), piece('streams', 'warriorStreams', k='anim', every=2, add=False), fx('dust', col='#c07a4a', n=90)],
    cam=[[800, 600, 1.4], [800, 450, 1.0]], amb='battle', sfx=[dict(n='nagara', at=0.4, v=0.7), dict(n='conch', at=4.0, v=0.6), dict(n='hooves', at=6.0, v=0.5)], min=12),
  S('i_dhrishta', 'heroic', [
      ln('VYASA', 'The Pandavas chose Dhrishtadyumna, born from the fire to kill Drona, as their commander. Abhimanyu, Arjuna\'s son, sixteen years old, rode beside his father. Draupadi\'s five sons rode behind. And Ghatotkacha came out of the forest with his rakshasas, as he had promised long ago.',
                  'पांडवों ने धृष्टद्युम्न को, जो द्रोण के वध के लिए अग्नि से जन्मे थे, अपना सेनापति चुना। अर्जुन का पुत्र अभिमन्यु, सोलह वर्ष का, अपने पिता के साथ था। द्रौपदी के पाँचों पुत्र पीछे थे। और घटोत्कच अपने राक्षसों के साथ वन से निकल आया, जैसा उसने बहुत पहले वचन दिया था।')],
    [bg(set='camp'), face('dhrishta', 560, 440, 180, 1, 'stern', n='dh', rim=RIM_FIRE), face('abhi', 1080, 450, 180, -1, 'smile', n='ab', rim=RIM_GOLD)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='night', sfx=[dict(n='conch', at=1.0, v=0.4), dict(n='roar', at=16.0, v=0.4)], hero=1, name=name('ABHIMANYU', 'अभिमन्यु', 'son of Arjuna', 'अर्जुनपुत्र', -1)),
  S('i_night', 'mystery', [], [bg(set='camp'), fx('fireflies', n=60), fx('stars', n=80)],
    cam=[[800, 500, 1.3], [800, 460, 1.0]], amb='night', min=7),
  S('i_bhishma', 'heroic', [
      ln('VYASA', 'Duryodhana made Bhishma his commander. The old man agreed, on two conditions. He would kill ten thousand warriors every day, but he would not kill a single son of Pandu. And he would not fight Shikhandi, who had been born a woman.',
                  'दुर्योधन ने भीष्म को अपना सेनापति बनाया। वृद्ध ने दो शर्तों पर स्वीकार किया। वे हर दिन दस हज़ार योद्धाओं को मारेंगे, पर पांडु के एक भी पुत्र को नहीं मारेंगे। और वे शिखंडी से नहीं लड़ेंगे, जो स्त्री के रूप में जन्मा था।')],
    [bg(set='camp'), face('bhishma', 800, 440, 210, 1, 'stern', rim=RIM_GOLD)],
    cam=push(800, 450, 1.0, 1.14), amb='night', sfx=[dict(n='conch', at=0.5, v=0.4)]),
  S('i_karna', 'fire', [
      ln('BHISHMA', 'And Karna is only half a warrior. He boasts too much, and he lost his armour. I count him as a half-chariot.', 'और कर्ण केवल आधा योद्धा है। वह बहुत डींगें मारता है, और उसने अपना कवच खो दिया। मैं उसे अर्धरथी गिनता हूँ।', fx='elder'),
      ln('KARNA', 'Then while you command, old man, I will not fight. When you fall, I will take the field.', 'तो जब तक आप सेनापति हैं, वृद्ध, मैं नहीं लड़ूँगा। जब आप गिरेंगे, मैं मैदान में उतरूँगा।', gap=0.6)],
    [bg(set='camp'), face('bhishma', 560, 450, 180, 1, 'stern', n='bh', rim=RIM_FIRE), face('karna', 1080, 450, 190, -1, 'anger', n='ka', rim=RIM_FIRE)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='night', sfx=[dict(n='gong', at=12.0, v=0.4)]),
  S('i_shikhandi', 'mystery', [
      ln('VYASA', 'Shikhandi stood in the Pandava ranks, son of Drupada. Bhishma knew who it was. The princess Amba, who had burned herself on a pyre for his death, had been born again.', 'शिखंडी पांडवों की पंक्तियों में खड़े थे, द्रुपद के पुत्र। भीष्म जानते थे कि वह कौन है। राजकुमारी अंबा, जिसने उनकी मृत्यु के लिए स्वयं को चिता पर जला दिया था, फिर से जन्मी थी।')],
    [bg(set='camp'), face('shikhandi', 800, 440, 210, 1, 'stern', rim=RIM_FIRE, glow=['#ff8040', 20, 0.3])],
    cam=push(800, 450, 1.04, 1.18), amb='night', sfx=[dict(n='heartbeat', at=1.0, v=0.4)], hero=1, name=name('SHIKHANDI', 'शिखंडी', 'Amba, born again', 'अंबा का पुनर्जन्म', 1)),
  S('i_vyasa', 'mystery', [
      ln('VYASA', 'On the night before the battle I went to my son, the blind king, one last time. I offered him sight, so he could watch the war. He would not take it. He could not bear to see his sons die. So I gave the sight to Sanjaya instead: to see everything on that field, every thought in every heart, and tell it to the king.',
                  'युद्ध से पहले की रात मैं अंतिम बार अपने पुत्र, अंधे राजा के पास गया। मैंने उन्हें दृष्टि देनी चाही, कि वे युद्ध देख सकें। उन्होंने नहीं ली। वे अपने पुत्रों को मरते देखना सह नहीं सकते थे। तो मैंने वह दृष्टि संजय को दी: उस क्षेत्र की हर चीज़, हर हृदय का हर विचार देखने की, और राजा को सुनाने की।')],
    CAVE_V('sorrow'), cam=push(700, 430, 1.0, 1.1), amb='night'),
  S('i_dawn', 'title', [
      ln('VYASA', 'And at dawn, the two armies stood facing each other on the field of Kurukshetra. The conches sounded. Bhishma\'s first, roaring like a lion. Then Krishna\'s, Panchajanya. Then Arjuna\'s, Devadatta.',
                  'और भोर में दोनों सेनाएँ कुरुक्षेत्र के मैदान में आमने सामने खड़ी थीं। शंख बजे। पहले भीष्म का, सिंह की तरह गरजता। फिर कृष्ण का, पांचजन्य। फिर अर्जुन का, देवदत्त।')],
    [bg(set='field', sunX=1000, sunY=480), fx('rays', x=1000, y=480, r0=60, r1=1000, col='#ffe0a0'), fx('dust', col='#e0b070', n=80)],
    cam=[[800, 600, 1.4], [800, 460, 1.0]], amb='battle', sfx=[dict(n='conch', at=4.0, v=0.9), dict(n='conch', at=8.0, v=0.9), dict(n='conch', at=11.0, v=0.9), dict(n='nagara', at=12.0, v=0.7)], min=14),
  S('i_between', 'krishna', [
      ln('ARJUNA', 'Achyuta, drive my chariot between the two armies. I want to see who I must fight.', 'अच्युत, मेरा रथ दोनों सेनाओं के बीच ले चलिए। मैं देखना चाहता हूँ कि मुझे किससे लड़ना है।'),
      ln('VYASA', 'And Krishna smiled, and drove.', 'और कृष्ण मुस्कुराए, और रथ ले चले।', gap=0.8)],
    [bg(set='field', sunX=1000, sunY=480), piece('ch', 'warChariot', k='anim', every=2, x=500, y=880, s=0.85, rider='arjuna', driver='krishna'), fx('dust', col='#e0b070', n=60)],
    cam=push(800, 480, 1.0, 1.14), amb='battle', sfx=[dict(n='hooves', at=0.5, v=0.5)]),
  S('i_cave', 'mystery', [
      ln('GANESHA', 'Between the two armies.', 'दोनों सेनाओं के बीच।'),
      ln('VYASAC', 'Tomorrow, scribe, time will stop there. And God will speak. Sharpen your tusk. You will need every word.', 'कल, लेखक, वहाँ समय थम जाएगा। और भगवान बोलेंगे। अपना दाँत तीखा कर लो। तुम्हें हर शब्द की आवश्यकता होगी।', gap=0.8)],
    CAVE(), cam=[[800, 470, 1.05], [800, 520, 1.3]], amb='night', tout='fade', min=12),
  ])
