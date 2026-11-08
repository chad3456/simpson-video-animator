# Season 1, Episode 9: the Song of God, the cosmic form, and the fall of Bhishma.

def build(EP, S, ln, bg, face, figs, fig, piece, fx, name, push, pan, hold, sh, CAVE, CAVE_V, CAVE_G, CAVE_CAM, RIM_GOLD, RIM_FIRE, RIM_COOL, RIM_LAMP):
  RIM_MOON = ['#cfe4ff', -3, -2, 0.55]
  KGLOW = ['#7ab0ff', 26, 0.35]
  GITA = lambda: sh(bg(set='void', base='#1a1030', mandala=380, my=440, mcol='#f3cf6a'), 'gita_void')
  KFACE = lambda expr='divine', n='krishna': face('krishna', 800, 440, 210, 1, expr, n=n, rim=RIM_GOLD, glow=['#ffe0a0', 30, 0.4], halo=1)
  FIELD = lambda: sh(bg(set='field', sunX=1100, sunY=520), 'kuru_field')
  V = lambda t0, t1, en, hi: [dict(t0=t0, t1=t1, en=en, hi=hi, f='verse', y=0.86)]
  EP(9, 'The Song of God', 'भगवद्गीता', 'Between two armies, time stops and God speaks. Then the grandsire falls.', 'दो सेनाओं के बीच समय थम जाता है और भगवान बोलते हैं। फिर पितामह गिरते हैं।', [
  S('a_cave', 'mystery', [
      ln('VYASA', 'The ninth night. Vyasa did not begin at once. He sat a long time with his eyes closed. Then he said: Scribe, what I tell you now is not mine. I only heard it.',
                  'नौवीं रात। व्यास ने तुरंत आरंभ नहीं किया। वे बहुत देर तक आँखें बंद किए बैठे रहे। फिर बोले: लेखक, जो मैं अब कहूँगा वह मेरा नहीं है। मैंने केवल उसे सुना है।', at=5.0)],
    CAVE('night') + [fx('stars', n=80)], cam=[[800, 520, 1.3], [800, 470, 1.05]], amb='night', min=12, eptitle=1, tin='fade'),
  S('a_chant', 'gita', [
      ln('CHANT', 'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः। मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥', 'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः। मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥'),
      ln('VYASAC', 'On the field of dharma, on the field of the Kurus, gathered to fight, what did my sons and the sons of Pandu do, Sanjaya? So asked the blind king. And Sanjaya told him.', 'धर्मक्षेत्र में, कुरुक्षेत्र में, युद्ध की इच्छा से एकत्र, मेरे पुत्रों और पांडु के पुत्रों ने क्या किया, संजय? अंधे राजा ने पूछा। और संजय ने उन्हें बताया।', gap=0.8)],
    CAVE_V('calm'), cam=push(700, 430, 1.0, 1.1), amb='night', text=V(0.5, 9.0, 'dharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ', 'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः')),
  S('a_sanjaya', 'mystery', [
      ln('VYASA', 'Before the war, I had offered my son sight, so that he could watch it. He refused. He did not want to see his sons die. So I gave the sight to Sanjaya instead, his charioteer, so that he could sit beside the king in Hastinapura and see everything on the field, even the thoughts in men\'s hearts, and tell him.',
                  'युद्ध से पहले मैंने अपने पुत्र को दृष्टि देनी चाही थी, कि वे उसे देख सकें। उन्होंने मना कर दिया। वे अपने पुत्रों को मरते नहीं देखना चाहते थे। तो मैंने वह दृष्टि संजय को दी, उनके सारथी को, कि वे हस्तिनापुर में राजा के पास बैठकर रणभूमि की हर बात देख सकें, मनुष्यों के मन के विचार तक, और उन्हें बता सकें।'),
      ln('SANJAYA', 'Listen, my king. I see the field of Kurukshetra as clearly as I see you.', 'सुनिए, महाराज। मैं कुरुक्षेत्र का मैदान उतनी ही स्पष्टता से देखता हूँ जितना आपको।', gap=0.6)],
    [sh(bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), 'court_dark'), face('courtier', 1040, 450, 180, -1, 'awe', rim=RIM_LAMP, style=dict(cloth='#e8dcc0'), glow=['#cfe4ff', 24, 0.3])],
    cam=push(1020, 450, 1.0, 1.14), amb='night', sfx=[dict(n='magic', at=12.0, v=0.4)]),

  # ---------- Arjuna's despair ----------
  S('b_middle', 'tension', [
      ln('VYASA', 'Krishna stopped the chariot between the two armies, facing Bhishma and Drona. And Arjuna looked.', 'कृष्ण ने रथ दोनों सेनाओं के बीच, भीष्म और द्रोण के सामने रोका। और अर्जुन ने देखा।')],
    [FIELD(), piece('chariot', 'warChariot', k='anim', every=2, d=1.0, x=800, y=860, s=1.0, rider='arjuna', driver='krishna'), fx('dust', col='#e0b070', n=50)],
    cam=push(800, 470, 1.0, 1.1), amb='wind', min=8),
  S('b_wide', 'tension', [
      ln('VYASA', 'On either side the armies stretched to the edge of the sky. A forest of banners. Elephants in painted armour. Chariots by the thousand, their horses stamping. And in the silence before the first arrow, a single bird crossed the field.',
                  'दोनों ओर सेनाएँ आकाश के छोर तक फैली थीं। ध्वजों का एक वन। रंगे कवचों में हाथी। हज़ारों रथ, उनके घोड़े पैर पटकते हुए। और पहले बाण से पहले के सन्नाटे में, एक अकेला पक्षी मैदान के पार उड़ा।')],
    [bg(set='field', sunX=1100, sunY=520, armies=1, density=1.0), fx('dust', col='#e0b070', n=40)],
    cam=[[800, 450, 0.96], [800, 470, 1.06]], amb='wind', sfx=[dict(n='wind', at=1.0, v=0.4)], min=12),
  S('b_sees', 'lament', [
      ln('VYASA', 'He saw fathers and grandfathers. Teachers, uncles, brothers, sons, grandsons, friends, fathers-in-law. On both sides. All of them his own.', 'उन्होंने पिता और पितामह देखे। गुरु, मामा, भाई, पुत्र, पौत्र, मित्र, ससुर। दोनों ओर। सब उनके अपने।')],
    [bg(set='field', sunX=1200, sunY=520), face('bhishma', 520, 460, 160, 1, 'calm', n='bh', rim=RIM_GOLD), face('drona', 1080, 460, 160, -1, 'calm', n='dr', rim=RIM_GOLD)],
    cam=[[520, 470, 1.15], [1100, 470, 1.15]], amb='wind'),
  S('b_despair', 'lament', [
      ln('ARJUNA', 'Krishna, my limbs give way. My mouth is dry. My body trembles and my hair stands on end. Gandiva slips from my hand. I do not want victory, nor a kingdom, nor pleasure. What use is a kingdom bought with their blood? I will not fight.',
                   'कृष्ण, मेरे अंग शिथिल हो रहे हैं। मेरा मुख सूख रहा है। मेरा शरीर काँप रहा है और रोम खड़े हो रहे हैं। गांडीव मेरे हाथ से फिसल रहा है। मुझे न विजय चाहिए, न राज्य, न सुख। उनके रक्त से खरीदा राज्य किस काम का? मैं नहीं लड़ूँगा।')],
    [bg(set='field', sunX=1200, sunY=520, armies=0), face('arjuna', 800, 460, 210, 1, 'sorrow', rim=RIM_GOLD)],
    cam=push(800, 460, 1.02, 1.18), amb='wind', sfx=[dict(n='heartbeat', at=1.0)]),
  S('b_sink', 'lament', [
      ln('VYASA', 'And he sat down on the floor of the chariot, and let fall his bow and arrows, his mind overwhelmed with grief.', 'और वे रथ के फ़र्श पर बैठ गए, और धनुष बाण गिरा दिए, उनका मन शोक में डूबा हुआ।')],
    [bg(set='field', sunX=1200, sunY=520, armies=0), figs('sit', [fig('arjuna', 800, 900, 600, 1, 'despair')], rim=RIM_GOLD)],
    cam=push(800, 500, 1.04, 1.2), amb='wind', sfx=[dict(n='crack', at=5.0, v=0.3)]),

  # ---------- the Gita ----------
  S('c_smile', 'gita', [
      ln('VYASA', 'And Krishna smiled, as if at a child, and there, between two armies, time stood still. And Krishna spoke.', 'और कृष्ण मुस्कुराए, जैसे किसी बालक पर, और वहीं, दो सेनाओं के बीच, समय थम गया। और कृष्ण बोले।')],
    [sh(bg(set='sky', tod='gold', hz=760, hills=1, ground='#8a6a3a'), 'gita_sky'), fx('rays', x=800, y=300, r0=120, r1=1000, col='#fff0c0', spin=1), KFACE('smile', 'ks'), fx('sparkle', y0=0, y1=900, n=60, col='#fff0c0')],
    cam=push(800, 450, 1.0, 1.12), amb='temple', sfx=[dict(n='om', at=0.2, v=0.6)], min=10),
  S('c_soul', 'gita', [
      ln('KRISHNA', 'You grieve for those who should not be grieved for, Arjuna, and yet you speak words of wisdom. The wise grieve neither for the living nor for the dead. There was never a time when I did not exist, nor you, nor these kings. Nor will there be a time when we cease to be.',
                    'तुम उनके लिए शोक करते हो जिनके लिए शोक नहीं करना चाहिए, अर्जुन, और फिर भी ज्ञान की बातें करते हो। ज्ञानी न जीवितों के लिए शोक करते हैं, न मृतों के लिए। ऐसा कोई समय नहीं था जब मैं न था, न तुम, न ये राजा। न ऐसा कोई समय होगा जब हम नहीं रहेंगे।')],
    [sh(bg(set='sky', tod='gold', hz=760, hills=1, ground='#8a6a3a'), 'gita_sky'), fx('rays', x=800, y=300, r0=120, r1=1000, col='#fff0c0', spin=1), KFACE()],
    cam=push(800, 450, 1.0, 1.1), amb='temple'),
  S('c_unborn', 'gita', [
      ln('KRISHNA', 'The soul is never born, and it never dies. It is unborn, eternal, ancient. It is not killed when the body is killed. Weapons cannot cut it. Fire cannot burn it. Water cannot wet it. Wind cannot dry it. As a man throws off worn-out clothes and puts on new ones, so the soul throws off worn-out bodies and enters new ones.',
                    'आत्मा न कभी जन्म लेती है, न कभी मरती है। यह अजन्मी, नित्य, सनातन है। शरीर के मारे जाने पर यह नहीं मरती। इसे शस्त्र काट नहीं सकते। अग्नि जला नहीं सकती। जल भिगो नहीं सकता। वायु सुखा नहीं सकती। जैसे मनुष्य पुराने वस्त्र उतारकर नए पहनता है, वैसे ही आत्मा पुराने शरीर छोड़कर नए में प्रवेश करती है।')],
    [GITA(), KFACE(), fx('sparkle', y0=0, y1=900, n=60, col='#fff0c0')],
    cam=push(800, 450, 1.04, 1.14), amb='temple', text=V(20.0, 28.0, 'nainaṁ chindanti śastrāṇi nainaṁ dahati pāvakaḥ', 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः')),
  S('c_duty', 'gita', [
      ln('KRISHNA', 'Look to your own dharma, Arjuna, and do not tremble. For a warrior there is nothing higher than a righteous war. Better your own dharma done badly than another\'s done well. If you turn away now, men will speak of your dishonour for ever, and for a man of honour, dishonour is worse than death.',
                    'अपने धर्म को देखो, अर्जुन, और काँपो मत। एक क्षत्रिय के लिए धर्मयुद्ध से बढ़कर कुछ नहीं। दूसरे का धर्म भली प्रकार निभाने से अपना धर्म अधूरा निभाना श्रेष्ठ है। यदि तुम अब मुँह मोड़ोगे, तो लोग सदा तुम्हारे अपयश की बात करेंगे, और सम्मानित पुरुष के लिए अपयश मृत्यु से भी बुरा है।')],
    [sh(bg(set='sky', tod='gold', hz=760, hills=1, ground='#8a6a3a'), 'gita_sky'), fx('rays', x=800, y=300, r0=120, r1=1000, col='#fff0c0', spin=1), KFACE('calm', 'kc')],
    cam=push(800, 450, 1.0, 1.12), amb='temple', text=V(10.0, 18.0, 'śreyān sva-dharmo viguṇaḥ para-dharmāt sv-anuṣṭhitāt', 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्')),
  S('c_karma', 'gita', [
      ln('KRISHNA', 'You have a right to your action, Arjuna, but never to its fruits. Let not the fruit of action be your motive, nor let your attachment be to inaction. Act, steady in yoga, giving up attachment, the same in success and failure. That evenness is yoga.',
                    'तुम्हारा अधिकार केवल कर्म पर है, अर्जुन, उसके फल पर कभी नहीं। कर्म का फल तुम्हारा उद्देश्य न हो, न अकर्म में तुम्हारी आसक्ति हो। योग में स्थिर होकर कर्म करो, आसक्ति त्यागकर, सफलता और असफलता में समान रहकर। वही समता योग है।')],
    [GITA(), KFACE(), fx('wheel', x=800, y=440, r=330, col='#f3cf6a')],
    cam=push(800, 450, 1.05, 1.14), amb='temple', text=V(1.0, 8.0, 'karmaṇy evādhikāras te mā phaleṣu kadāchana', 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन')),
  S('c_paths', 'gita', [
      ln('KRISHNA', 'Some reach me by knowledge, Arjuna, some by selfless action, some by love. All paths lead to me. The one who sees me in everything, and everything in me, is never lost to me, and I am never lost to him.',
                    'कुछ मुझे ज्ञान से पाते हैं, अर्जुन, कुछ निष्काम कर्म से, कुछ प्रेम से। सब मार्ग मुझ तक आते हैं। जो मुझे सबमें देखता है, और सबको मुझमें, वह मुझसे कभी नहीं खोता, और मैं उससे कभी नहीं खोता।')],
    [GITA(), KFACE('smile', 'ks'), fx('sparkle', y0=0, y1=900, n=60, col='#fff0c0')],
    cam=push(800, 450, 1.04, 1.14), amb='temple', text=V(14.0, 22.0, 'yo māṁ paśyati sarvatra sarvaṁ ca mayi paśyati', 'यो मां पश्यति सर्वत्र सर्वं च मयि पश्यति')),
  S('c_lamp', 'gita', [
      ln('KRISHNA', 'Like a lamp in a windless place that does not flicker: so is the mind of the yogi who has mastered himself. The mind is restless, Arjuna, as hard to hold as the wind. But by practice, and by letting go, it can be held.',
                    'जैसे वायुरहित स्थान में रखा दीपक नहीं हिलता: वैसा ही उस योगी का मन है जिसने स्वयं को जीत लिया। मन चंचल है, अर्जुन, वायु की तरह पकड़ने में कठिन। पर अभ्यास से, और वैराग्य से, उसे पकड़ा जा सकता है।')],
    [sh(bg(set='cave', view='night', lamps=[800]), 'gita_lamp'), fx('glow', x=800, y=700, r=200, col='#ffb060')],
    cam=push(800, 640, 1.2, 1.45), amb='temple', sfx=[dict(n='bell', at=0.5, v=0.4)]),
  S('c_steady', 'gita', [
      ln('KRISHNA', 'The one who is not shaken by sorrow, nor greedy for pleasure, who is free from desire, fear and anger, him I call a sage of steady mind. He moves among the things of the world, but they do not move him. As the ocean takes in all the rivers and stays full and still, so is he.',
                    'जो दुःख से विचलित नहीं होता, न सुख का लोभी है, जो कामना, भय और क्रोध से मुक्त है, उसे मैं स्थितप्रज्ञ मुनि कहता हूँ। वह संसार की वस्तुओं के बीच चलता है, पर वे उसे नहीं हिलातीं। जैसे सागर सब नदियों को समा लेता है और भरा और शांत रहता है, वैसा ही वह है।')],
    [sh(bg(set='lake', tod='gold'), 'gita_lake'), fx('ripples', x=800, y=820), fx('sparkle', y0=650, y1=900, n=40)],
    cam=[[800, 520, 1.1], [800, 600, 1.25]], amb='temple', min=12),
  S('c_avatar', 'gita', [
      ln('KRISHNA', 'Whenever dharma declines, Arjuna, and adharma rises, I bring myself forth. To protect the good, to destroy the wicked, and to establish dharma, I come into being, age after age.',
                    'जब जब धर्म की हानि होती है, अर्जुन, और अधर्म बढ़ता है, तब तब मैं स्वयं को प्रकट करता हूँ। सज्जनों की रक्षा के लिए, दुष्टों के विनाश के लिए, और धर्म की स्थापना के लिए, मैं युग युग में जन्म लेता हूँ।')],
    [sh(bg(set='cosmos', galaxies=3), 'gita_cosmos'), KFACE(), fx('rays', x=800, y=440, r0=150, r1=1000, col='#fff0c0', spin=2)],
    cam=push(800, 450, 1.0, 1.14), amb='temple', sfx=[dict(n='conch', at=12.0, v=0.4)], text=V(1.0, 10.0, 'yadā yadā hi dharmasya glānir bhavati bhārata', 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत')),
  S('c_leaf', 'gita', [
      ln('KRISHNA', 'Whoever offers me with love a leaf, a flower, a fruit, or a little water, I accept it, offered with love by a pure heart. Whatever you do, whatever you eat, whatever you give, do it as an offering to me.',
                    'जो कोई प्रेम से मुझे एक पत्ता, एक फूल, एक फल, या थोड़ा जल अर्पित करता है, मैं उसे स्वीकार करता हूँ, शुद्ध हृदय से प्रेमपूर्वक दिया हुआ। तुम जो कुछ करो, जो कुछ खाओ, जो कुछ दो, उसे मुझे अर्पण करके करो।')],
    [sh(bg(set='lake', tod='gold'), 'gita_lake'), piece('leaf', 'lotusLeaf', at=[[800, 820, 140]]), fx('petals', every=2, n=50), fx('ripples', x=800, y=820)],
    cam=push(800, 640, 1.1, 1.3), amb='temple', text=V(1.0, 9.0, 'patraṁ puṣpaṁ phalaṁ toyaṁ yo me bhaktyā prayacchati', 'पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति')),
  S('c_all', 'gita', [
      ln('KRISHNA', 'I am the taste in water, Arjuna, the light of the sun and the moon, the sacred syllable in the Vedas, the sound in the sky, the courage in men. I am the beginning, the middle and the end of all beings. Of rivers I am the Ganga. Of mountains, the Himalaya. Of warriors, Rama. Of the Pandavas, I am you.',
                    'मैं जल में रस हूँ, अर्जुन, सूर्य और चंद्रमा का प्रकाश, वेदों में ओंकार, आकाश में शब्द, मनुष्यों में पौरुष। मैं सब प्राणियों का आदि, मध्य और अंत हूँ। नदियों में मैं गंगा हूँ। पर्वतों में हिमालय। योद्धाओं में राम। पांडवों में, मैं तुम हूँ।')],
    [sh(bg(set='cosmos', galaxies=3), 'gita_cosmos'), piece('within', 'universeWithin', k='anim', every=2, add=True), fx('sparkle', n=80)],
    cam=push(800, 450, 1.0, 1.16), amb='temple', sfx=[dict(n='om', at=0.5, v=0.5), dict(n='bells', at=10.0, v=0.4)]),
  S('c_tree', 'wonder', [
      ln('KRISHNA', 'There is an eternal fig tree, Arjuna, with its roots above and its branches below. Its leaves are the hymns of the Veda. Its branches spread up and down, fed by the three qualities of nature, and its buds are the objects of the senses. Cut it down with the strong axe of detachment, and seek the place from which, once reached, no one returns.',
                    'एक सनातन अश्वत्थ वृक्ष है, अर्जुन, जिसकी जड़ें ऊपर हैं और शाखाएँ नीचे। उसके पत्ते वेदों के मंत्र हैं। उसकी शाखाएँ ऊपर नीचे फैली हैं, प्रकृति के तीन गुणों से पोषित, और उसकी कलियाँ इंद्रियों के विषय हैं। उसे वैराग्य की दृढ़ कुल्हाड़ी से काट डालो, और उस धाम को खोजो जहाँ पहुँचकर कोई नहीं लौटता।')],
    [sh(bg(set='forest', tod='gold'), 'gita_forest'), fx('leaves', n=60), fx('rays', x=800, y=200, r0=80, r1=900, col='#fff0c0')],
    cam=[[800, 600, 1.25], [800, 450, 1.0]], amb='temple', min=12, text=V(1.0, 8.0, 'ūrdhva-mūlam adhaḥ-śākham aśvatthaṁ prāhur avyayam', 'ऊर्ध्वमूलमधःशाखमश्वत्थं प्राहुरव्ययम्')),
  S('c_show', 'tension', [
      ln('ARJUNA', 'Lord, if you think I am able to bear it, show me your imperishable self. Show me your universal form.', 'प्रभु, यदि आप समझते हैं कि मैं उसे सह सकता हूँ, तो मुझे अपना अविनाशी स्वरूप दिखाइए। अपना विश्वरूप दिखाइए।'),
      ln('KRISHNA', 'You cannot see me with these eyes. I give you divine sight. Behold.', 'तुम इन आँखों से मुझे नहीं देख सकते। मैं तुम्हें दिव्य दृष्टि देता हूँ। देखो।', gap=0.8)],
    [bg(set='field', sunX=820, sunY=480, armies=0), face('arjuna', 560, 450, 180, 1, 'awe', n='ar', rim=RIM_GOLD), face('krishna', 1080, 440, 190, -1, 'divine', n='kr', rim=RIM_GOLD, glow=['#ffe0a0', 30, 0.4])],
    cam=[[640, 450, 1.1], [960, 450, 1.12]], amb='wind', sfx=[dict(n='swell', at=9.0)]),

  # ---------- the universal form ----------
  S('d_vishva1', 'vishva', [
      ln('VYASA', 'And Arjuna saw. If a thousand suns were to rise at once in the sky, their light would not equal the light of that great being.', 'और अर्जुन ने देखा। यदि आकाश में एक साथ हज़ार सूर्य उदय हों, तो उनका प्रकाश उस महात्मा के प्रकाश के बराबर न होगा।')],
    [bg(set='cosmos', galaxies=6), piece('suns', 'thousandSuns', k='anim', every=2, add=True), piece('arms', 'vishvaArms', d=1.0, mv=dict(s=[0.6, 1.0], t=[0, 5], ax=800, ay=480, ease='out')), piece('form', 'vishvarupa', d=1.0, stage=1), fx('rays', x=800, y=420, r0=120, r1=1000, col='#fff0c0', spin=2),
     figs('arjuna', [fig('arjuna', 800, 905, 150, 1, 'vow')], d=1.0, sil=True)],
    cam=[[800, 700, 1.6], [800, 440, 1.0]], amb='void', sfx=[dict(n='boom', at=0.2), dict(n='swell', at=0.4), dict(n='om', at=2.0)], tin='flash', min=14,
    text=V(4.0, 12.0, 'divi sūrya-sahasrasya bhaved yugapad utthitā', 'दिवि सूर्यसहस्रस्य भवेद्युगपदुत्थिता')),
  S('d_vishva2', 'vishva', [
      ln('VYASA', 'In that one body stood the whole universe, with all its divisions. Every god, every sage, the serpents and the seas, Brahma on his lotus, worlds without number. Arms, bellies, mouths and eyes without end. No beginning. No middle. No end.',
                  'उस एक शरीर में पूरा ब्रह्मांड खड़ा था, अपने सब विभागों के साथ। हर देवता, हर ऋषि, नाग और सागर, कमल पर ब्रह्मा, असंख्य लोक। अनंत भुजाएँ, उदर, मुख और नेत्र। न आदि। न मध्य। न अंत।')],
    [bg(set='cosmos', galaxies=8), piece('halo', 'cosmicHalo', k='anim', every=2, add=True), piece('arms', 'vishvaArms', d=1.0, mv=dict(r=[-4, 4], t=[0, 16], ax=800, ay=560)), piece('form', 'vishvarupa', d=1.0, stage=2), piece('within', 'universeWithin', k='anim', every=2, add=True)],
    cam=[[800, 420, 1.0], [800, 360, 1.25]], amb='void', sfx=[dict(n='bells', at=2), dict(n='gong', at=6), dict(n='sparkle', at=9)]),
  S('d_awe', 'vishva', [
      ln('ARJUNA', 'I see all the gods in your body, O God, and all the hosts of beings. I see you everywhere, infinite in form, and I see no end, no middle, no beginning. My heart trembles. I cannot find my steadiness, or peace. Have mercy, Lord of gods, refuge of the world!',
                   'हे देव, मैं आपके शरीर में सब देवताओं को देखता हूँ, और सब प्राणियों के समूहों को। मैं आपको सर्वत्र देखता हूँ, अनंत रूप में, और न अंत देखता हूँ, न मध्य, न आदि। मेरा हृदय काँपता है। मुझे न धैर्य मिलता है, न शांति। दया कीजिए, देवों के देव, जगत के आश्रय!')],
    [bg(set='cosmos', galaxies=8), piece('halo', 'cosmicHalo', d=1.0, add=True, mv=dict(r=[0, 10], t=[0, 25], ax=800, ay=420)), face('arjuna', 800, 460, 200, 1, 'awe', rim=['#fff0c0', -3, -2, 0.9], glow=['#ffe0a0', 30, 0.4])],
    cam=push(800, 460, 1.0, 1.16), amb='void', sfx=[dict(n='heartbeat', at=1.0, v=0.5)]),
  S('d_time', 'kala', [
      ln('KTIME', 'I am Time, the destroyer of worlds, grown old, come here to destroy these people. Even without you, none of these warriors in these armies will survive. Arise, then! Win glory. They are already slain by me. Be only my instrument, Arjuna.',
                  'मैं काल हूँ, लोकों का नाश करने वाला, बढ़ा हुआ, यहाँ इन लोगों के नाश के लिए आया हूँ। तुम्हारे बिना भी इन सेनाओं के ये योद्धा नहीं बचेंगे। इसलिए उठो! यश प्राप्त करो। ये मेरे द्वारा पहले ही मारे जा चुके हैं। तुम केवल निमित्त बनो, अर्जुन।')],
    [bg(set='dark', base='#140404', glow='#6a1408', lr=800), piece('mouths', 'kalaFaces', d=1.0), piece('streams', 'warriorStreams', k='anim', every=2, add=False), fx('embers', n=140, col='#ff7030', vy=-70), fx('glow', x=800, y=420, r=500, col='#ff5020', rate=4)],
    cam=push(800, 440, 1.0, 1.18), amb='void', sfx=[dict(n='rumble', at=0.5), dict(n='boom', at=4.0, v=0.6), dict(n='roar', at=10.0, v=0.4)], shake=[[4.0, 5.0]],
    text=V(1.0, 8.0, 'kālo \'smi loka-kṣaya-kṛt pravṛddho', 'कालोऽस्मि लोकक्षयकृत्प्रवृद्धो')),
  S('d_gentle', 'krishna', [
      ln('VYASA', 'Arjuna begged to see him again as he had been, with four arms, gentle, smiling. And Krishna took back the form of the universe, and was only a dark young man again, holding the reins.',
                  'अर्जुन ने विनती की कि वे उन्हें फिर से वैसे देखें जैसे वे थे, चार भुजाओं वाले, सौम्य, मुस्कुराते हुए। और कृष्ण ने विश्व का रूप समेट लिया, और फिर से बस एक साँवले युवक बन गए, लगाम थामे हुए।')],
    [bg(set='cosmos', galaxies=4), piece('armsfade', 'vishvaArms', d=1.0, t=[0, 5.0]), piece('formfade', 'vishvarupa', d=1.0, stage=3, t=[0, 6.0]), face('krishna', 800, 440, 200, 1, 'smile', rim=RIM_GOLD, glow=KGLOW, t=[6.0, 99])],
    cam=push(800, 450, 1.1, 1.0), amb='temple', sfx=[dict(n='swell', at=0.5), dict(n='flute', at=7.0, v=0.6)]),
  S('d_refuge', 'gita', [
      ln('KRISHNA', 'Give up all your ideas of duty, and take refuge in me alone. I will free you from every sin. Do not grieve.', 'सब धर्मों को छोड़कर केवल मेरी शरण में आओ। मैं तुम्हें सब पापों से मुक्त कर दूँगा। शोक मत करो।'),
      ln('ARJUNA', 'My delusion is gone, Achyuta. By your grace I remember who I am. My doubts are gone. I will do as you say.', 'मेरा मोह नष्ट हो गया, अच्युत। आपकी कृपा से मुझे स्मरण हो आया कि मैं कौन हूँ। मेरे संदेह मिट गए। मैं वही करूँगा जो आप कहेंगे।', gap=0.8)],
    [GITA(), KFACE('smile'), fx('petals', every=2, n=60)],
    cam=push(800, 450, 1.04, 1.12), amb='temple', text=V(0.5, 7.0, 'sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja', 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज')),
  S('d_rise', 'heroic', [
      ln('VYASA', 'And Arjuna stood up, and lifted Gandiva, and twanged its string. And the sound of it rolled across the field of Kurukshetra like thunder.', 'और अर्जुन उठ खड़े हुए, और गांडीव उठाया, और उसकी प्रत्यंचा टंकारी। और उसकी ध्वनि कुरुक्षेत्र के मैदान पर गर्जना की तरह गूँज उठी।')],
    [bg(set='field', sunX=1000, sunY=480), figs('arjuna', [fig('arjuna', 800, 900, 640, 1, 'vow', weapon='bow')], rim=RIM_GOLD, glow=['#ffe0a0', 22, 0.3]), fx('rays', x=1000, y=480, r0=60, r1=1000, col='#ffe0a0')],
    cam=push(800, 470, 1.04, 1.14), amb='battle', sfx=[dict(n='crack', at=6.0, v=0.6), dict(n='thunder', at=6.3, v=0.6), dict(n='conch', at=9.0, v=0.8)]),
  S('d_cave', 'mystery', [
      ln('GANESHA', 'Muni. I have written the words of God.', 'मुनिवर। मैंने भगवान के शब्द लिखे हैं।'),
      ln('VYASAC', 'Seven hundred verses, scribe. And people will read them for five thousand years, and still argue about what they mean. Good. Let them argue. Let them keep reading.', 'सात सौ श्लोक, लेखक। और लोग इन्हें पाँच हज़ार वर्षों तक पढ़ेंगे, और फिर भी इनके अर्थ पर तर्क करेंगे। अच्छा है। उन्हें तर्क करने दो। उन्हें पढ़ते रहने दो।', gap=0.8)],
    CAVE_G(), cam=push(820, 430, 1.0, 1.1), amb='night'),

  # ---------- blessings ----------
  S('e_walk', 'sorrow', [
      ln('VYASA', 'Then Yudhishthira did something no one expected. He took off his armour, laid down his weapons, and walked alone across the field to the enemy lines. His brothers ran after him. The Kauravas laughed: he is coming to surrender.',
                  'तब युधिष्ठिर ने वह किया जिसकी किसी ने अपेक्षा नहीं की थी। उन्होंने अपना कवच उतारा, अस्त्र रख दिए, और अकेले मैदान पार करके शत्रु की पंक्तियों की ओर चल पड़े। उनके भाई उनके पीछे दौड़े। कौरव हँसे: वह आत्मसमर्पण करने आ रहा है।')],
    [FIELD(), figs('walk', [fig('yudhi', 800, 860, 260, 1, 'stand', style=dict(dhoti='#efe7d0', crown='bun'))]), fx('dust', col='#e0b070', n=40)],
    cam=[[800, 600, 1.3], [800, 470, 1.05]], amb='wind', sfx=[dict(n='crowdlaugh', at=14.0, v=0.4)]),
  S('e_armies', 'tension', [
      ln('VYASA', 'Both armies watched him go, a king without armour walking alone across the empty ground between them. The Kauravas laughed: he has lost his nerve, he has come to beg. The Pandavas held their breath. Bhishma lowered his bow, and waited.',
                  'दोनों सेनाओं ने उन्हें जाते देखा, बिना कवच का एक राजा उनके बीच की खाली भूमि पर अकेला चलता हुआ। कौरव हँसे: इसका साहस टूट गया, यह भीख माँगने आया है। पांडवों ने साँस रोक ली। भीष्म ने धनुष नीचे किया, और प्रतीक्षा की।')],
    [bg(set='field', sunX=1100, sunY=520, armies=1, density=1.0), figs('walker', [fig('yudhi', 800, 860, 200, 1, 'stand', style=dict(dhoti='#e8dcc0', crown='bun'))]), fx('dust', col='#e0b070', n=30)],
    cam=[[800, 460, 0.98], [800, 560, 1.15]], amb='wind', min=12, sfx=[dict(n='crowdlaugh', at=8.0, v=0.3)]),
  S('e_bless', 'sorrow', [
      ln('YUDHI', 'Grandfather, give us your blessing to fight you. And tell us how you can be defeated.', 'पितामह, हमें आपसे लड़ने का आशीर्वाद दीजिए। और बताइए कि आपको कैसे हराया जा सकता है।'),
      ln('BHISHMA', 'If you had not come, child, I would have cursed you. You have my blessing: victory. As for my death, its time has not yet come. Ask me again.', 'यदि तुम न आते, बालक, तो मैं तुम्हें शाप देता। तुम्हें मेरा आशीर्वाद है: विजय। जहाँ तक मेरी मृत्यु की बात है, उसका समय अभी नहीं आया। फिर पूछना।', fx='elder', gap=0.6)],
    [FIELD(), face('bhishma', 800, 440, 210, 1, 'calm', rim=RIM_GOLD)],
    cam=push(800, 450, 1.04, 1.16), amb='wind'),
  S('e_drona', 'sorrow', [
      ln('VYASA', 'He went to Drona, to Kripa, to his uncle Shalya, and bowed to each, and each blessed him. Drona told him: I will lay down my weapons only when I hear terrible news, from a man whose word I trust.',
                  'वे द्रोण के पास गए, कृप के पास, अपने मामा शल्य के पास, और हर एक को प्रणाम किया, और हर एक ने उन्हें आशीर्वाद दिया। द्रोण ने उनसे कहा: मैं अपने अस्त्र तभी रखूँगा जब कोई भयानक समाचार सुनूँगा, उस व्यक्ति से जिसके वचन पर मुझे विश्वास हो।')],
    [FIELD(), face('drona', 800, 440, 200, 1, 'sorrow', rim=RIM_GOLD)],
    cam=push(800, 450, 1.04, 1.14), amb='wind', sfx=[dict(n='gong', at=14.0, v=0.4)]),
  S('e_yuyutsu', 'heroic', [
      ln('VYASA', 'Then Yudhishthira turned to the Kaurava ranks and called out: whoever wishes to join us, come now. And one son of Dhritarashtra, Yuyutsu, born of a maid, crossed the field and joined the Pandavas, while his brothers jeered.',
                  'फिर युधिष्ठिर ने कौरव पंक्तियों की ओर मुड़कर पुकारा: जो हमारे साथ आना चाहे, अभी आ जाए। और धृतराष्ट्र का एक पुत्र, युयुत्सु, एक दासी से जन्मा, मैदान पार करके पांडवों से आ मिला, जबकि उसके भाई उपहास करते रहे।')],
    [FIELD(), figs('yy', [fig('vikarna', 800, 880, 300, -1, 'stand', style=dict(dhoti='#5a6a3a'))]), fx('dust', col='#e0b070', n=40)],
    cam=pan(1000, 640, 480, 1.15), amb='wind', sfx=[dict(n='crowdlaugh', at=12.0, v=0.4), dict(n='conch', at=16.0, v=0.4)]),

  # ---------- the first nine days ----------
  S('f_begin', 'battle', [
      ln('VYASA', 'And the battle began. The two armies crashed together with a roar that shook the earth. Dust rose and hid the sun. Father did not know son, nor brother brother.',
                  'और युद्ध आरंभ हुआ। दोनों सेनाएँ ऐसी गर्जना के साथ टकराईं कि पृथ्वी काँप उठी। धूल उठी और सूर्य को ढँक लिया। पिता पुत्र को नहीं पहचानता था, न भाई भाई को।')],
    [bg(set='field', sunX=1100, sunY=520, armies=1, density=1.0), piece('streams', 'warriorStreams', k='anim', every=2, add=False), piece('rain', 'arrowRain', k='anim', every=2, add=True), fx('dust', col='#c07a4a', n=120)],
    cam=[[800, 600, 1.4], [800, 450, 1.0]], amb='battle', sfx=[dict(n='conch', at=0.3, v=0.8), dict(n='roar', at=1.5), dict(n='clash', at=3.0), dict(n='boom', at=5.0, v=0.6), dict(n='clash', at=7.0)], shake=[[1.5, 2.5]], min=12),
  S('f_uttar', 'lament', [
      ln('VYASA', 'On the first day, young Uttar, the prince of Matsya who had run from the Kuru army and then driven Arjuna\'s chariot, rode an elephant against Shalya, and Shalya killed him. The Pandavas lost more men than the Kauravas that day. That night, Yudhishthira did not sleep.',
                  'पहले दिन युवा उत्तर, मत्स्य के राजकुमार जो कुरु सेना से भागे थे और फिर अर्जुन का रथ हाँका था, हाथी पर शल्य के विरुद्ध गए, और शल्य ने उन्हें मार डाला। उस दिन पांडवों ने कौरवों से अधिक योद्धा खोए। उस रात युधिष्ठिर सो नहीं सके।')],
    [sh(bg(set='sky', tod='crimson', sun=[800, 640, 160], sunCol='#e04a20', hills=1, ground='#2a1010'), 'sky_crimson_sun'), face('uttar', 800, 450, 190, 1, 'stern', rim=RIM_FIRE)],
    cam=push(800, 450, 1.0, 1.14), amb='wind'),
  S('f_bhishma', 'battle', [
      ln('VYASA', 'And for nine days, Bhishma was unstoppable. He moved through the Pandava army like fire through dry grass. Every day ten thousand warriors fell to his arrows. Virata\'s sons Uttar and Shweta died on the first day.',
                  'और नौ दिनों तक भीष्म अजेय रहे। वे पांडव सेना में सूखी घास में आग की तरह फैलते गए। हर दिन दस हज़ार योद्धा उनके बाणों से गिरते। विराट के पुत्र उत्तर और श्वेत पहले ही दिन मारे गए।')],
    [bg(set='field', sunX=400, sunY=540, dead=1), figs('bh', [fig('bhishma', 800, 900, 620, 1, 'draw', weapon='bowDrawn')], rim=RIM_FIRE), piece('volley', 'arrowRain', k='anim', every=2, add=False), fx('embers', n=60)],
    cam=push(800, 470, 1.04, 1.14), amb='battle', sfx=[dict(n='whoosh', at=1.0), dict(n='whoosh', at=3.0), dict(n='clash', at=6.0), dict(n='roar', at=10.0, v=0.4)]),
  S('f_banner', 'battle', [
      ln('VYASA', 'His banner was a golden palm tree with five stars, and wherever it moved, the Pandava army broke. He was old, and white-haired, and he fought like a young man of twenty, and every night his own grandsons counted their dead.',
                  'उनका ध्वज पाँच तारों वाला एक सुनहरा ताड़ का पेड़ था, और वह जहाँ भी जाता, पांडव सेना टूट जाती। वे वृद्ध थे, श्वेत केश वाले, और वे बीस वर्ष के युवक की तरह लड़ते, और हर रात उनके अपने पौत्र अपने मृतकों को गिनते।')],
    [bg(set='field', sunX=1200, sunY=520), figs('bh', [fig('bhishma', 800, 880, 620, 1, 'draw', weapon='bowDrawn')], rim=RIM_FIRE), piece('rain', 'arrowRain', k='anim', every=2, add=True), fx('dust', col='#c07a4a', n=80)],
    cam=push(800, 470, 1.0, 1.14), amb='battle', sfx=[dict(n='whoosh', at=2.0), dict(n='whoosh', at=4.0)]),
  S('f_days', 'battle', [
      ln('VYASA', 'Bhima broke the elephants of Kalinga with his mace. Abhimanyu cut through the Kaurava ranks like his father. Ghatotkacha rose into the sky at night and rained down stones. And Iravan, Arjuna\'s son by the serpent princess Ulupi, died on the eighth day, fighting a rakshasa.',
                  'भीम ने अपनी गदा से कलिंग के हाथियों को तोड़ दिया। अभिमन्यु अपने पिता की तरह कौरव पंक्तियों को चीरते गए। घटोत्कच रात में आकाश में उठकर पत्थर बरसाता। और इरावान, नागकन्या उलूपी से अर्जुन का पुत्र, आठवें दिन एक राक्षस से लड़ते हुए मारा गया।')],
    [bg(set='field', sunX=1200, sunY=520), piece('ch', 'warChariot', k='anim', every=2, x=600, y=880, s=0.85, rider='abhi'), piece('rain', 'arrowRain', k='anim', every=2, add=True), fx('dust', col='#c07a4a', n=90)],
    cam=push(800, 480, 1.0, 1.1), amb='battle', sfx=[dict(n='roar', at=1.0), dict(n='boom', at=4.0, v=0.6), dict(n='whoosh', at=8.0), dict(n='clash', at=12.0), dict(n='gong', at=18.0, v=0.5)], shake=[[4.0, 4.6]]),
  S('f_abhi', 'heroic', [
      ln('VYASA', 'And Abhimanyu, sixteen years old, rode through the Kaurava ranks like his father, and the old warriors on the other side watched him with a strange pride, and said to one another: that boy will be the greatest of them all, if he lives.',
                  'और अभिमन्यु, सोलह वर्ष का, अपने पिता की तरह कौरव सेना के बीच से रथ दौड़ाता, और दूसरी ओर के वृद्ध योद्धा उसे एक विचित्र गर्व से देखते, और एक दूसरे से कहते: वह बालक उन सबमें सबसे महान होगा, यदि जीवित रहा।')],
    [bg(set='field', sunX=1200, sunY=520), face('abhi', 800, 450, 200, 1, 'stern', rim=RIM_GOLD), fx('dust', col='#c07a4a', n=60)],
    cam=push(800, 450, 1.0, 1.14), amb='battle', sfx=[dict(n='hooves', at=0.5, v=0.4)]),
  S('f_iravan', 'lament', [
      ln('VYASA', 'On the eighth day, Iravan fell, the son of Arjuna and Ulupi, the Naga princess Arjuna had loved in his years of wandering. He had come up out of the underworld to fight for a father he had met only once. Arjuna wept for him on the field, and then fought on.',
                  'आठवें दिन इरावान गिरे, अर्जुन और नागकन्या उलूपी के पुत्र, जिनसे अर्जुन ने अपनी यात्रा के वर्षों में प्रेम किया था। वे पाताल से एक ऐसे पिता के लिए लड़ने आए थे जिनसे वे केवल एक बार मिले थे। अर्जुन रणभूमि में उनके लिए रोए, और फिर लड़ते रहे।')],
    [sh(bg(set='field', sunX=1200, sunY=560, dead=1), 'field_dead9'), face('arjuna', 800, 450, 200, 1, 'sorrow', rim=RIM_FIRE)],
    cam=push(800, 450, 1.04, 1.18), amb='wind'),
  S('f_nights', 'lament', [
      ln('VYASA', 'And every night the fighting stopped, and the two camps lit their fires a mile apart. The wounded cried out in the dark. Women came looking for their men with torches. And sometimes, across that mile of dead ground, a man in one camp would hear his cousin singing in the other.',
                  'और हर रात युद्ध रुकता, और दोनों शिविर एक कोस की दूरी पर अपनी आग जलाते। घायल अँधेरे में कराहते। स्त्रियाँ मशालें लेकर अपने पुरुषों को खोजने आतीं। और कभी कभी, उस एक कोस की मृत भूमि के पार, एक शिविर का कोई पुरुष दूसरे शिविर में अपने भाई को गाते सुनता।')],
    [sh(bg(set='camp'), 'war_camp9'), fx('fire', at=[[200, 860, 100, 140], [600, 860, 80, 120], [1100, 860, 80, 120], [1450, 860, 100, 140]]), fx('stars', n=80), fx('fireflies', n=30)],
    cam=[[800, 520, 1.15], [800, 470, 1.0]], amb='night', min=12),
  S('f_wheel', 'fire', [
      ln('VYASA', 'On the ninth day, Bhishma\'s arrows covered Arjuna and Krishna like a cloud, and Arjuna was holding back, because he loved the old man. Krishna leapt down from the chariot, picked up a broken chariot wheel, and ran at Bhishma, the whip still in his hand.',
                  'नौवें दिन भीष्म के बाणों ने अर्जुन और कृष्ण को बादल की तरह ढँक लिया, और अर्जुन संकोच कर रहे थे, क्योंकि वे उस वृद्ध से प्रेम करते थे। कृष्ण रथ से कूदे, एक टूटा हुआ रथ का पहिया उठाया, और चाबुक हाथ में लिए भीष्म की ओर दौड़े।')],
    [bg(set='field', sunX=400, sunY=540, dead=1), figs('kw', [fig('krishna', 800, 900, 620, 1, 'charge')], rim=RIM_FIRE, glow=KGLOW), fx('wheel', x=820, y=460, r=180, col='#ffe08a'), fx('dust', col='#c07a4a', n=80)],
    cam=push(800, 480, 1.04, 1.18), amb='battle', sfx=[dict(n='roar', at=10.0, v=0.5), dict(n='drumroll', at=12.0)]),
  S('f_welcome', 'krishna', [
      ln('BHISHMA', 'Come, lord of the world! Come, lotus-eyed one! To be killed by you is the greatest honour of my life!', 'आइए, जगत के स्वामी! आइए, कमलनयन! आपके हाथों मरना मेरे जीवन का सबसे बड़ा सम्मान है!', fx='elder'),
      ln('VYASA', 'Krishna had sworn he would not lift a weapon. Arjuna caught him by the legs, and was dragged ten steps, and held on, and begged him to keep his vow. I will fight, Arjuna swore. I will fight properly. And Krishna turned back.',
                  'कृष्ण ने शपथ ली थी कि वे शस्त्र नहीं उठाएँगे। अर्जुन ने उनके पैर पकड़ लिए, और दस कदम घसीटे गए, और पकड़े रहे, और उनसे अपना वचन निभाने की विनती की। मैं लड़ूँगा, अर्जुन ने शपथ ली। मैं ठीक से लड़ूँगा। और कृष्ण लौट आए।', gap=0.8)],
    [bg(set='field', sunX=400, sunY=540, dead=1), face('bhishma', 800, 440, 210, 1, 'smile', rim=RIM_FIRE, glow=['#ffe0a0', 20, 0.3])],
    cam=push(800, 450, 1.04, 1.18), amb='battle'),

  # ---------- the secret ----------
  S('g_tent', 'sorrow', [
      ln('VYASA', 'That night the five brothers and Krishna went to Bhishma\'s tent, unarmed. The old man welcomed them like children coming home.', 'उस रात पाँचों भाई और कृष्ण निःशस्त्र भीष्म के शिविर में गए। वृद्ध ने उनका ऐसे स्वागत किया जैसे घर लौटे बच्चों का।'),
      ln('YUDHI', 'Grandfather, you told us to ask again. How can you be defeated?', 'पितामह, आपने कहा था फिर पूछना। आपको कैसे हराया जा सकता है?', gap=0.6)],
    [bg(set='camp'), figs('tent', [fig('bhishma', 600, 880, 540, 1, 'bless'), fig('yudhi', 960, 880, 500, -1, 'stand'), fig('krishna', 1180, 880, 500, -1, 'stand')], rim=RIM_LAMP)],
    cam=push(840, 470, 1.04, 1.12), amb='night'),
  S('g_secret', 'mystery', [
      ln('BHISHMA', 'I will not raise my bow against one who was born a woman. Put Shikhandi in front of Arjuna\'s chariot. When I see Shikhandi, I will lay down my bow. Then let Arjuna strike me.',
                    'मैं उसके विरुद्ध धनुष नहीं उठाऊँगा जो स्त्री के रूप में जन्मा हो। शिखंडी को अर्जुन के रथ के आगे रखो। जब मैं शिखंडी को देखूँगा, तो धनुष रख दूँगा। तब अर्जुन मुझ पर प्रहार करे।', fx='elder')],
    [bg(set='camp'), face('bhishma', 800, 450, 210, 1, 'calm', rim=RIM_LAMP)],
    cam=push(800, 450, 1.04, 1.2), amb='night', sfx=[dict(n='gong', at=14.0, v=0.4)]),
  S('g_arjuna', 'lament', [
      ln('ARJUNA', 'How can I, Krishna? As a child I climbed onto his lap with dusty feet and called him father. And he said: I am not your father, child. I am your father\'s father.',
                   'मैं कैसे कर सकता हूँ, कृष्ण? बचपन में मैं धूल भरे पैरों से उनकी गोद में चढ़ जाता था और उन्हें पिता कहता था। और वे कहते: मैं तुम्हारा पिता नहीं, बालक। मैं तुम्हारे पिता का पिता हूँ।')],
    [bg(set='camp'), face('arjuna', 800, 450, 200, 1, 'sorrow', rim=RIM_MOON)],
    cam=push(800, 450, 1.04, 1.18), amb='night'),

  # ---------- the tenth day ----------
  S('h_shikhandi', 'battle', [
      ln('VYASA', 'On the tenth day, Shikhandi rode in front of Arjuna. Bhishma saw who it was, and smiled, and lowered his bow. Shikhandi\'s arrows struck him, and he did not feel them. Behind Shikhandi, Arjuna wept, and drew.',
                  'दसवें दिन शिखंडी अर्जुन के आगे चले। भीष्म ने देखा कि वह कौन है, और मुस्कुराए, और धनुष नीचे कर लिया। शिखंडी के बाण उन्हें लगे, और उन्हें पता भी नहीं चला। शिखंडी के पीछे अर्जुन रोए, और प्रत्यंचा खींची।')],
    [bg(set='field', sunX=400, sunY=540, dead=1), face('shikhandi', 560, 450, 180, 1, 'stern', n='sh', rim=RIM_FIRE), face('bhishma', 1080, 440, 190, -1, 'smile', n='bh', rim=RIM_FIRE)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='battle', sfx=[dict(n='whoosh', at=8.0), dict(n='whoosh', at=10.0)]),
  S('h_arrows', 'kala', [
      ln('BHISHMA', 'These arrows are not Shikhandi\'s. They cut like a crab\'s claws. They are Arjuna\'s.', 'ये बाण शिखंडी के नहीं हैं। ये केकड़े के पंजों की तरह काटते हैं। ये अर्जुन के हैं।', fx='elder'),
      ln('VYASA', 'There was not two fingers\' space on his body without an arrow in it. And at sunset, Bhishma fell from his chariot.', 'उनके शरीर पर दो उँगली जितनी जगह भी बिना बाण के नहीं बची थी। और सूर्यास्त के समय भीष्म अपने रथ से गिर पड़े।', gap=0.8)],
    [bg(set='field', sunX=400, sunY=540, dead=1), piece('volley', 'arrowRain', k='anim', every=2, add=False), fx('embers', n=80)],
    cam=push(800, 460, 1.04, 1.2), amb='battle', sfx=[dict(n='whoosh', at=1.0), dict(n='whoosh', at=2.0), dict(n='whoosh', at=3.0), dict(n='boom', at=12.0, v=0.8), dict(n='gong', at=13.0, v=0.8)], shake=[[12.0, 13.0]]),
  S('h_bed', 'lament', [
      ln('VYASA', 'He did not touch the ground. The arrows in his body held him up, a bed of arrows between earth and sky. Both armies stopped fighting. Kauravas and Pandavas, they dropped their weapons and came, and stood around him.',
                  'वे भूमि पर नहीं गिरे। उनके शरीर में धँसे बाणों ने उन्हें थाम लिया, पृथ्वी और आकाश के बीच बाणों की एक शय्या। दोनों सेनाओं ने लड़ना बंद कर दिया। कौरव और पांडव, अस्त्र छोड़कर आए, और उनके चारों ओर खड़े हो गए।')],
    [bg(set='sky', tod='dusk', sun=[1100, 600, 120], sunCol='#e05a2a', hills=1, ground='#2a1410'), piece('bed', 'arrowBed', d=1.0, x=800, y=740, s=1.0), fx('dust', col='#e08050', n=40)],
    cam=push(800, 600, 1.0, 1.15), amb='wind', min=12),
  S('h_pillow', 'lament', [
      ln('BHISHMA', 'My head hangs down. Give me a pillow.', 'मेरा सिर लटक रहा है। मुझे एक तकिया दो।', fx='elder'),
      ln('VYASA', 'The Kauravas brought silk cushions. He shook his head and looked at Arjuna. Arjuna understood, and shot three arrows into the ground beneath his head, to hold it up. A warrior\'s pillow. The old man smiled.',
                  'कौरव रेशमी तकिए लाए। उन्होंने सिर हिलाया और अर्जुन की ओर देखा। अर्जुन समझ गए, और उनके सिर के नीचे भूमि में तीन बाण मारे, उसे थामने के लिए। एक योद्धा का तकिया। वृद्ध मुस्कुराए।', gap=0.6)],
    [bg(set='sky', tod='dusk', sun=[1100, 600, 120], sunCol='#e05a2a', hills=1, ground='#2a1410'), face('bhishma', 800, 460, 190, 1, 'smile', rim=RIM_FIRE)],
    cam=push(800, 460, 1.04, 1.18), amb='wind', sfx=[dict(n='whoosh', at=12.0, v=0.4)]),
  S('h_water', 'divine', [
      ln('VYASA', 'Then he asked for water. Arjuna drew his bow and shot an arrow into the earth beside him, and a spring of pure water leapt up, the Ganga herself, his mother, come to her son.',
                  'फिर उन्होंने जल माँगा। अर्जुन ने धनुष खींचा और उनके पास भूमि में एक बाण मारा, और शुद्ध जल का एक सोता फूट पड़ा, स्वयं गंगा, उनकी माता, अपने पुत्र के पास आई हुई।')],
    [bg(set='sky', tod='dusk', sun=[1100, 600, 120], sunCol='#e05a2a', hills=1, ground='#2a1410'), piece('bed', 'arrowBed', d=1.0, x=800, y=760, s=1.0), fx('ripples', x=900, y=820), fx('sparkle', y0=600, y1=900, n=60)],
    cam=push(840, 640, 1.1, 1.3), amb='river', sfx=[dict(n='whoosh', at=5.0, v=0.5), dict(n='splash', at=6.0, v=0.6), dict(n='bells', at=8.0, v=0.4)]),
  S('h_wait', 'lament', [
      ln('VYASA', 'He would not die yet. He had the boon of choosing his own death, and the sun was moving south, an unlucky time. He would lie there, on his bed of arrows, until the sun turned north again. And he asked Duryodhana, one last time, to end the war. Duryodhana would not.',
                  'वे अभी नहीं मरे। उन्हें अपनी मृत्यु स्वयं चुनने का वरदान था, और सूर्य दक्षिण की ओर जा रहा था, एक अशुभ समय। वे वहीं लेटे रहेंगे, बाणों की शय्या पर, जब तक सूर्य फिर से उत्तर की ओर न मुड़े। और उन्होंने दुर्योधन से अंतिम बार युद्ध समाप्त करने को कहा। दुर्योधन नहीं माना।')],
    [bg(set='camp'), piece('bed', 'arrowBed', d=1.0, x=800, y=760, s=0.8), fx('stars', n=80), fx('fireflies', n=40)],
    cam=[[800, 600, 1.2], [800, 520, 1.05]], amb='night'),
  S('h_karna', 'lament', [
      ln('VYASA', 'That night, when everyone had gone, Karna came alone, and fell at the old man\'s feet.', 'उस रात, जब सब चले गए, कर्ण अकेले आए, और वृद्ध के चरणों में गिर पड़े।'),
      ln('BHISHMA', 'I know who you are, son of Kunti. I spoke harshly to you only to keep you from fighting your brothers. I was wrong to insult you. You are as brave as any man alive. Make peace with them, even now.',
                    'मैं जानता हूँ तुम कौन हो, कुंतीपुत्र। मैंने तुमसे कठोर वचन केवल इसलिए कहे कि तुम अपने भाइयों से न लड़ो। तुम्हारा अपमान करना मेरी भूल थी। तुम किसी भी जीवित मनुष्य जितने वीर हो। अब भी उनसे संधि कर लो।', fx='elder', gap=0.6),
      ln('KARNA', 'I cannot, grandfather. Bless me to fight.', 'मैं नहीं कर सकता, पितामह। मुझे लड़ने का आशीर्वाद दीजिए।', gap=0.6)],
    [bg(set='camp'), face('karna', 800, 450, 200, 1, 'sorrow', rim=RIM_MOON)],
    cam=push(800, 450, 1.04, 1.18), amb='night'),
  S('h_cave', 'mystery', [
      ln('GANESHA', 'The grandsire has fallen. And Karna takes the field.', 'पितामह गिर गए। और कर्ण मैदान में उतरते हैं।'),
      ln('VYASAC', 'Tomorrow is the last night, scribe. A boy in a wheel of warriors. A sun that sets too early. A lie told by the most truthful man alive. And a night of fire. Then it will be over, and we will see what is left.',
                   'कल अंतिम रात है, लेखक। योद्धाओं के चक्र में एक बालक। एक सूर्य जो समय से पहले डूबता है। सबसे सत्यवादी मनुष्य का बोला एक असत्य। और आग की एक रात। फिर यह समाप्त होगा, और हम देखेंगे कि क्या बचा है।', gap=0.8)],
    CAVE(), cam=[[800, 470, 1.05], [800, 520, 1.3]], amb='night', tout='fade', min=12),
  ])
