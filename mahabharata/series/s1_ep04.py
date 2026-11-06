# Season 1, Episode 4: the house of lac, the forest years in hiding, Hidimba, Bakasura and Draupadi's swayamvar.

def build(EP, S, ln, bg, face, figs, fig, piece, fx, name, push, pan, hold, sh, CAVE, CAVE_V, CAVE_G, CAVE_CAM, RIM_GOLD, RIM_FIRE, RIM_COOL, RIM_LAMP):
  RIM_SUN = ['#ffe08a', -3, -2, 0.8]
  RIM_MOON = ['#cfe4ff', -3, -2, 0.55]
  POOR = dict(dhoti='#e8dcc0', crown='bun', scarf='#d9c9a0')
  BROS = lambda x0, y=880, S=420, dx=150, f=1: [fig('yudhi', x0, y, S, f, 'stand', style=POOR), fig('bhima', x0 + dx, y, S * 1.08, f, 'stand', style=POOR), fig('arjuna', x0 + 2 * dx, y, S, f, 'stand', style=POOR),
                                               fig('nakula', x0 + 3 * dx, y, S * 0.95, f, 'stand', style=POOR), fig('sahadeva', x0 + 4 * dx, y, S * 0.95, f, 'stand', style=POOR)]
  EP(4, 'The House of Lac and the Swayamvar', 'लाक्षागृह और स्वयंवर', 'A palace built to burn, a demon in the forest, and a bride won by one arrow.', 'जलने के लिए बना महल, वन का एक राक्षस, और एक बाण से जीती दुल्हन।', [
  S('a_cave', 'mystery', [
      ln('VYASA', 'The fourth night. A storm had come up the valley, and the wind howled at the mouth of the cave. Ganesha pulled his shawl around his shoulders and waited.',
                  'चौथी रात। घाटी से एक तूफ़ान उठा था, और गुफा के मुहाने पर हवा गरज रही थी। गणेश ने अपना उत्तरीय कंधों पर लपेटा और प्रतीक्षा करने लगे।', at=5.0)],
    CAVE('night') + [fx('snow', n=120)], cam=[[800, 520, 1.3], [800, 470, 1.05]], amb='storm', min=12, eptitle=1, tin='fade'),
  S('a_ask', 'krishna', [
      ln('GANESHA', 'You promised me fire tonight, Muni.', 'आपने आज रात अग्नि का वचन दिया था, मुनिवर।'),
      ln('VYASAC', 'Fire, and the dark under it. Write carefully. Five lives hang on a riddle.', 'अग्नि, और उसके नीचे का अंधेरा। ध्यान से लिखो। पाँच जीवन एक पहेली पर टिके हैं।', gap=0.8)],
    CAVE_G(), cam=push(820, 430, 1.0, 1.08), amb='night'),

  # ---------- Varanavata ----------
  S('b_blind', 'tension', [
      ln('VYASA', 'The people of Hastinapura loved Yudhishthira, and said so in the streets. Every word of it reached the blind king. And every word was poured into his ear again by his son.',
                  'हस्तिनापुर की प्रजा युधिष्ठिर से प्रेम करती थी, और गलियों में यह कहती थी। हर शब्द अंधे राजा तक पहुँचता था। और हर शब्द उनका पुत्र फिर से उनके कानों में उँडेल देता था।')],
    [sh(bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), 'court_dark'), face('dhrita', 800, 450, 200, 1, 'sorrow', rim=RIM_GOLD)],
    cam=push(800, 450, 1.0, 1.12), amb='court', min=10),
  S('b_duryo', 'tension', [
      ln('DURYO', 'Father, if Yudhishthira is king, his sons will be kings after him, and mine will beg at their doors. Send them away. To Varanavata, for the festival of Shiva. Only for a while.',
                  'पिताजी, यदि युधिष्ठिर राजा बने, तो उनके पुत्र उनके बाद राजा होंगे, और मेरे पुत्र उनके द्वार पर भीख माँगेंगे। उन्हें दूर भेज दीजिए। वारणावत, शिव के उत्सव के लिए। बस कुछ समय के लिए।', fx='growl')],
    [sh(bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), 'court_dark'), face('duryo', 560, 440, 190, 1, 'cruel', rim=RIM_FIRE)],
    cam=push(580, 450, 1.04, 1.14), amb='court'),
  S('b_purochana', 'tension', [
      ln('VYASA', 'And to Varanavata, ahead of them, Duryodhana sent his minister Purochana, with gold, and a plan.', 'और उनसे पहले, दुर्योधन ने अपने मंत्री पुरोचन को वारणावत भेजा, सोने के साथ, और एक योजना के साथ।'),
      ln('PUROCHANA', 'Lac and resin, ghee and hemp, and plaster on top so it looks like stone. When it burns, my prince, it will burn like a torch.', 'लाख और राल, घी और सन, और ऊपर से पलस्तर कि पत्थर जैसा दिखे। जब यह जलेगा, राजकुमार, तो मशाल की तरह जलेगा।', gap=0.6)],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), face('purochana', 1040, 450, 180, -1, 'cruel', rim=RIM_LAMP)],
    cam=push(1020, 450, 1.04, 1.14), amb='night', hero=1, name=name('PUROCHANA', 'पुरोचन', 'the builder', 'निर्माता', -1)),
  S('b_build', 'tension', [], [bg(set='palace', tod='dusk', x=340, w=920, h=560, col='#c89a6a'), piece('workers', 'folk', cnt=14, y=820, dy=40, s=40, seed=11), fx('dust', col='#f0b060', n=60)],
    cam=pan(600, 1000, 470, 1.12), amb='wind', sfx=[dict(n='crack', at=1.0, v=0.3), dict(n='crack', at=3.0, v=0.3)], min=6),
  S('b_leave', 'sorrow', [
      ln('VYASA', 'The Pandavas left the city with their mother. Half of Hastinapura walked behind their chariots weeping, as far as the edge of the fields.',
                  'पांडव अपनी माँ के साथ नगर से चले। आधा हस्तिनापुर रोता हुआ उनके रथों के पीछे पीछे चला, खेतों की सीमा तक।')],
    [sh(bg(set='valley', tod='day', hz=430, seed=1.2, groves=18), 'valley_day'), piece('leave', 'procession', k='anim', every=3, y=820, s=100, x0=-300, cnt=9, speed=35)],
    cam=pan(560, 1040, 460, 1.15), amb='crowd', sfx=[dict(n='hooves', at=0.5, v=0.5)], min=10),
  S('b_vidura', 'tension', [
      ln('VYASA', 'At the edge of the fields Vidura took Yudhishthira aside, and spoke to him in the language of the mountain tribes, which no one else around them understood.',
                  'खेतों की सीमा पर विदुर ने युधिष्ठिर को एक ओर ले जाकर पहाड़ी जनजातियों की भाषा में बात की, जो वहाँ और कोई नहीं समझता था।'),
      ln('VIDURA', 'A weapon not made of iron can kill. The fire that burns the forest does not burn the rat in its hole, or the jackal in its burrow. Remember the stars, and find your way by them.',
                   'जो शस्त्र लोहे का न हो, वह भी मार सकता है। वन को जलाने वाली आग बिल में छिपे चूहे को नहीं जलाती, न माँद में छिपे सियार को। तारों को याद रखो, और उनसे मार्ग खोजो।', fx='elder', gap=0.6)],
    [sh(bg(set='valley', tod='day', hz=430, seed=1.2, groves=18), 'valley_day'), face('vidura', 560, 450, 180, 1, 'stern', n='vi', rim=RIM_GOLD), face('yudhi', 1080, 450, 170, -1, 'calm', n='yu')],
    cam=[[680, 450, 1.1], [920, 450, 1.05]], amb='wind', hero=1, name=name('VIDURA', 'विदुर', 'the wise', 'नीतिज्ञ', 1)),
  S('b_yudhi', 'mystery', [
      ln('YUDHI', 'I have understood.', 'मैं समझ गया।'),
      ln('VYASA', 'Kunti asked him later what Vidura had said. He told her. She did not sleep that night.', 'बाद में कुंती ने पूछा कि विदुर ने क्या कहा था। उन्होंने बताया। उस रात वे सो नहीं पाईं।', gap=0.6)],
    [sh(bg(set='forest', tod='night'), 'forest_night'), face('kunti', 800, 450, 190, 1, 'fear', rim=RIM_MOON), fx('fireflies', n=40)],
    cam=push(800, 450, 1.04, 1.14), amb='night'),
  S('b_house', 'tension', [
      ln('VYASA', 'The house at Varanavata was beautiful, and new, and it smelled of ghee and resin. Bhima touched the wall and his fingers came away sticky.',
                  'वारणावत का भवन सुंदर था, नया था, और उसमें घी और राल की गंध आती थी। भीम ने दीवार छुई और उनकी उँगलियाँ चिपचिपी हो गईं।'),
      ln('BHIMA', 'Brother, this house is made to burn. Let us leave tonight.', 'भ्राता, यह भवन जलने के लिए बना है। आज ही रात निकल चलें।', gap=0.6)],
    [sh(bg(set='palace', tod='dusk', x=340, w=920, h=560, col='#c89a6a'), 'lac_dusk'), figs('bros', BROS(380, S=380))],
    cam=push(800, 480, 1.04, 1.12), amb='wind'),
  S('b_wait', 'tension', [
      ln('YUDHI', 'If we run, Duryodhana will hunt us down in the open, with an army. Let him think we suspect nothing. We will wait, and dig.',
                  'यदि हम भागे, तो दुर्योधन खुले में सेना लेकर हमें खोज निकालेगा। उसे लगने दो कि हमें कोई संदेह नहीं। हम प्रतीक्षा करेंगे, और खोदेंगे।')],
    [sh(bg(set='palace', tod='dusk', x=340, w=920, h=560, col='#c89a6a'), 'lac_dusk'), face('yudhi', 1040, 450, 180, -1, 'stern', rim=RIM_FIRE)],
    cam=push(1020, 450, 1.04, 1.14), amb='wind'),
  S('b_miner', 'mystery', [
      ln('VYASA', 'A miner came to them, sent secretly by Vidura. Night after night, for a whole year, he dug a tunnel from the floor of the house, under the walls, out into the forest.',
                  'विदुर का भेजा हुआ एक खनिक गुप्त रूप से उनके पास आया। रात दर रात, पूरे एक वर्ष तक, उसने भवन के फ़र्श से, दीवारों के नीचे, वन तक एक सुरंग खोदी।')],
    [piece('tun', 'tunnel', k='anim', every=3)],
    cam=push(800, 600, 1.0, 1.15), amb='night', sfx=[dict(n='crack', at=2.0, v=0.2), dict(n='crack', at=5.0, v=0.2), dict(n='crack', at=8.0, v=0.2)]),
  S('b_cave', 'mystery', [
      ln('GANESHA', 'A whole year, living in their own pyre, smiling at the man who built it.', 'पूरा एक वर्ष, अपनी ही चिता में रहते हुए, उसे बनाने वाले को देखकर मुस्कुराते हुए।'),
      ln('VYASAC', 'That is what patience costs, scribe. Few can pay it.', 'धैर्य की यही कीमत है, लेखक। बहुत कम लोग इसे चुका पाते हैं।', gap=0.8)],
    CAVE(), cam=CAVE_CAM['two'], amb='night'),

  # ---------- the fire ----------
  S('c_feast', 'tension', [
      ln('VYASA', 'On the night of the new moon, Kunti gave a great feast for the poor of the town. A Nishada woman came with her five sons. They drank, and fell asleep in the hall.',
                  'अमावस की रात कुंती ने नगर के निर्धनों के लिए एक बड़ा भोज दिया। एक निषाद स्त्री अपने पाँच पुत्रों के साथ आई। उन्होंने मदिरा पी, और सभागार में ही सो गए।')],
    [sh(bg(set='palace', tod='night', x=340, w=920, h=560, col='#4a3028', ground='#100808'), 'lac_night'), piece('lamps', 'floatLamps', k='anim', every=2, add=True), fx('stars', n=60)],
    cam=pan(1000, 600, 470, 1.15), amb='night'),
  S('c_light', 'fire', [
      ln('VYASA', 'At midnight Bhima took a torch and set fire to Purochana\'s door first, and then to every corner of the house.', 'आधी रात को भीम ने एक मशाल ली और पहले पुरोचन के द्वार पर आग लगाई, और फिर भवन के हर कोने में।')],
    [sh(bg(set='palace', tod='night', x=340, w=920, h=560, col='#4a3028', ground='#100808'), 'lac_night'), figs('torch', [fig('bhima', 800, 900, 600, 1, 'vow', style=POOR)], rim=RIM_FIRE), fx('fire', at=[[1080, 700, 160, 220]], n=40)],
    cam=push(800, 480, 1.04, 1.14), amb='fire', sfx=[dict(n='fire', at=2.0, v=0.6)]),
  S('c_burn', 'fire', [
      ln('VYASA', 'The house went up like a torch, just as Purochana had promised. The whole town woke to the roar of it.', 'भवन मशाल की तरह जल उठा, ठीक जैसा पुरोचन ने वचन दिया था। उसकी गर्जना से पूरा नगर जाग उठा।')],
    [sh(bg(set='palace', tod='night', x=340, w=920, h=560, col='#4a3028', ground='#100808'), 'lac_night'), fx('fire', every=2, at=[[500, 640, 300, 420], [800, 600, 380, 520], [1120, 640, 300, 420]], n=120), fx('glow', x=800, y=500, r=600, col='#ff7030', rate=5)],
    cam=[[800, 600, 1.35], [800, 470, 1.0]], amb='fire', sfx=[dict(n='fire', at=0.5), dict(n='boom', at=3.0, v=0.6), dict(n='crack', at=5)], g=dict(tint='#ff9060', k=0.12), shake=[[3.0, 3.6]]),
  S('c_escape', 'tension', [
      ln('VYASA', 'Under the burning floor, five brothers and their mother crawled through the dark, Bhima carrying his mother on his back.', 'जलते फ़र्श के नीचे, पाँच भाई और उनकी माँ अंधेरे में रेंगते हुए आगे बढ़े, भीम अपनी माँ को पीठ पर उठाए हुए।')],
    [piece('tun2', 'tunnel', k='anim', every=3), fx('embers', n=40)],
    cam=push(700, 620, 1.05, 1.2), amb='fire', sfx=[dict(n='heartbeat', at=1.0, v=0.5), dict(n='rumble', at=4.0, v=0.5)]),
  S('c_ashes', 'lament', [
      ln('VYASA', 'In the morning the townspeople raked the ashes. They found Purochana. They found a woman and five young men. And they wept, and sent word to Hastinapura: the Pandavas are dead.',
                  'सुबह नगरवासियों ने राख कुरेदी। उन्हें पुरोचन मिला। उन्हें एक स्त्री और पाँच युवक मिले। और वे रोए, और हस्तिनापुर संदेश भेजा: पांडव नहीं रहे।')],
    [bg(set='palace', tod='dawn', x=340, w=920, h=560, col='#3a2a24', ground='#2a1a14'), fx('dust', col='#8a8a8a', n=90), fx('embers', n=30)],
    cam=[[800, 470, 1.0], [800, 520, 1.15]], amb='wind', sfx=[dict(n='wind', at=0.5)]),
  S('c_mourn', 'lament', [
      ln('VYASA', 'Bhishma wept for his grandsons. Dhritarashtra wept loudly, and ordered the funeral rites. Vidura wept too, but only a little. He knew.',
                  'भीष्म अपने पौत्रों के लिए रोए। धृतराष्ट्र ज़ोर से रोए, और अंतिम संस्कार की आज्ञा दी। विदुर भी रोए, पर थोड़ा सा। वे जानते थे।')],
    [sh(bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), 'court_dark'), face('bhishma', 800, 450, 200, 1, 'sorrow', rim=RIM_GOLD)],
    cam=push(800, 450, 1.04, 1.16), amb='court'),

  # ---------- the river and the forest ----------
  S('d_ganga', 'river', [
      ln('VYASA', 'Vidura\'s boatman was waiting at the Ganga in the dark, as promised. He ferried them across, and they vanished into the forests of the south.',
                  'विदुर का नाविक अंधेरे में गंगा पर प्रतीक्षा कर रहा था, जैसा वचन था। उसने उन्हें पार उतारा, और वे दक्षिण के वनों में खो गए।')],
    [sh(bg(set='river', tod='night', hz=600), 'river_night4'), piece('boat', 'farBoat', k='anim', every=2, x=500, y=680, s=1.4), fx('stars', n=80), fx('ripples', x=800, y=740)],
    cam=pan(560, 1000, 480, 1.15), amb='river', sfx=[dict(n='splash', at=2.0, v=0.3)], min=10),
  S('d_carry', 'forest', [
      ln('VYASA', 'They walked all night. When the others could walk no more, Bhima carried them: his mother on his shoulders, the twins on his hips, and his two elder brothers in his arms.',
                  'वे पूरी रात चलते रहे। जब बाकी और नहीं चल सके, तो भीम ने उन्हें उठा लिया: माँ को कंधों पर, जुड़वाँ भाइयों को कमर पर, और दोनों बड़े भाइयों को बाँहों में।')],
    [sh(bg(set='forest', tod='night'), 'forest_night'), figs('bhimacarry', [fig('bhima', 800, 900, 640, 1, 'stand', style=POOR)], rim=RIM_MOON), fx('fireflies', n=60)],
    cam=push(800, 480, 1.04, 1.14), amb='night'),
  S('d_sleep', 'forest', [], [sh(bg(set='forest', tod='night'), 'forest_night'), fx('fireflies', n=80), fx('stars', n=40)],
    cam=[[800, 520, 1.3], [800, 470, 1.0]], amb='night', min=6),

  # ---------- Hidimba ----------
  S('e_demon', 'kala', [
      ln('VYASA', 'That forest belonged to the rakshasa Hidimba, an eater of men. He smelled human flesh on the wind, and sent his sister to lure them to him.',
                  'वह वन नरभक्षी राक्षस हिडिंब का था। उसने हवा में मनुष्य के माँस की गंध सूँघी, और अपनी बहन को उन्हें फुसलाकर लाने भेजा।')],
    [sh(bg(set='forest', tod='night'), 'forest_night'), face('hidimba', 800, 440, 210, 1, 'cruel', rim=RIM_FIRE), fx('embers', n=30)],
    cam=push(800, 450, 1.0, 1.14), amb='night', sfx=[dict(n='roar', at=1.0, v=0.5)], hero=1, name=name('HIDIMBA', 'हिडिंब', 'lord of the forest', 'वन का स्वामी', 1)),
  S('e_hidimbi', 'love', [
      ln('VYASA', 'But when Hidimbi saw Bhima keeping watch over his sleeping family, she forgot her brother\'s hunger. She took the form of a beautiful woman and came to him.',
                  'पर जब हिडिंबा ने भीम को अपने सोते परिवार की रखवाली करते देखा, तो वह अपने भाई की भूख भूल गई। उसने एक सुंदर स्त्री का रूप लिया और उनके पास आई।'),
      ln('HIDIMBI', 'Warrior, run. My brother is coming to eat you all. Come with me, and I will carry you through the sky to safety.', 'वीर, भागो। मेरा भाई तुम सबको खाने आ रहा है। मेरे साथ चलो, मैं तुम्हें आकाश से उड़ाकर सुरक्षित ले जाऊँगी।', gap=0.6)],
    [sh(bg(set='forest', tod='night'), 'forest_night'), face('hidimbi', 1040, 440, 190, -1, 'smile', rim=RIM_MOON), fx('fireflies', n=50)],
    cam=push(1020, 450, 1.0, 1.14), amb='night', hero=1, name=name('HIDIMBI', 'हिडिंबा', 'the rakshasi', 'राक्षसी', -1)),
  S('e_bhima', 'heroic', [
      ln('BHIMA', 'Run, and leave my mother and my brothers asleep in the forest? Let your brother come.', 'भागूँ, और अपनी माँ और भाइयों को वन में सोता छोड़ दूँ? आने दो अपने भाई को।', fx='growl')],
    [sh(bg(set='forest', tod='night'), 'forest_night'), face('bhima', 560, 450, 190, 1, 'smile', rim=RIM_MOON)],
    cam=push(580, 450, 1.04, 1.14), amb='night'),
  S('e_fight', 'battle', [
      ln('VYASA', 'Hidimba came crashing through the trees. They fought like two mountains colliding. Trees were torn up by the roots and used as clubs. Then Bhima lifted the demon over his head, whirled him round a hundred times, and broke him like an animal.',
                  'हिडिंब पेड़ों को तोड़ता हुआ आया। वे ऐसे लड़े जैसे दो पर्वत टकरा रहे हों। पेड़ जड़ से उखाड़कर गदा की तरह चलाए गए। फिर भीम ने राक्षस को सिर के ऊपर उठाया, सौ बार घुमाया, और पशु की तरह तोड़ दिया।')],
    [sh(bg(set='forest', tod='night'), 'forest_night'), figs('duel', [fig('bhima', 560, 900, 600, 1, 'maceUp', style=POOR), fig('hidimba', 1060, 900, 620, -1, 'charge')], rim=RIM_FIRE), fx('dust', col='#8a6a4a', n=80), fx('leaves', n=60)],
    cam=push(800, 480, 1.04, 1.14), amb='battle', sfx=[dict(n='roar', at=1.0), dict(n='crack', at=4.0), dict(n='boom', at=8.0), dict(n='roar', at=12.0, v=0.6), dict(n='boom', at=15.0, v=0.7)], shake=[[8.0, 8.6], [15.0, 15.8]]),
  S('e_marry', 'love', [
      ln('VYASA', 'Hidimbi begged Kunti to let her marry Bhima. Kunti looked at her a long time, and agreed, on one condition: that when a son was born, Bhima would come back to his brothers.',
                  'हिडिंबा ने कुंती से विनती की कि वह भीम से विवाह करने दें। कुंती ने उसे बहुत देर तक देखा, और मान गईं, एक शर्त पर: कि पुत्र के जन्म के बाद भीम अपने भाइयों के पास लौट आएँगे।')],
    [sh(bg(set='forest', tod='dawn'), 'forest_dawn'), figs('wed', [dict(who='kunti', x=520, y=880, S=460, f=1), fig('bhima', 820, 880, 560, -1, 'stand', style=POOR), dict(who='hidimbi', x=1060, y=880, S=460, f=-1)], rim=RIM_GOLD), fx('petals', every=2, n=50)],
    cam=push(790, 470, 1.04, 1.12), amb='birds'),
  S('e_ghatot', 'divine', [
      ln('VYASA', 'Their son was born bald as a pot, and grew to full height in a single day. They named him Ghatotkacha. He bowed to his father and his uncles, and promised to come whenever they called. One day, on a battlefield, they would call.',
                  'उनका पुत्र घड़े जैसे गंजे सिर के साथ जन्मा, और एक ही दिन में पूरा बड़ा हो गया। उन्होंने उसका नाम घटोत्कच रखा। उसने अपने पिता और चाचाओं को प्रणाम किया, और वचन दिया कि जब भी वे बुलाएँगे, वह आएगा। एक दिन, एक युद्धभूमि पर, वे बुलाएँगे।')],
    [sh(bg(set='forest', tod='gold'), 'forest_gold'), figs('ghat', [fig('hidimba', 800, 900, 560, 1, 'bless', style=dict(skin='#5a6a4a', dhoti='#3a6a3a', hair='#1a1008', crown='band', beard=None))], rim=RIM_GOLD), fx('rays', x=800, y=200, r0=60, r1=900, col='#fff0c0')],
    cam=push(800, 470, 1.04, 1.14), amb='birds', sfx=[dict(n='drumroll', at=10.0, v=0.4)], hero=1, name=name('GHATOTKACHA', 'घटोत्कच', 'son of Bhima', 'भीमपुत्र', 1)),

  # ---------- Vyasa, Ekachakra and Bakasura ----------
  S('f_vyasa', 'krishna', [
      ln('VYASA', 'And then, on the road, they met an old sage with matted hair, who seemed to know exactly who they were.', 'और फिर, मार्ग में, उन्हें जटाधारी एक वृद्ध ऋषि मिले, जो ठीक ठीक जानते थे कि वे कौन हैं।'),
      ln('GANESHA', 'You again.', 'फिर आप।', gap=0.6),
      ln('VYASAC', 'They were my grandsons, scribe. Was I to let them wander?', 'वे मेरे पौत्र थे, लेखक। क्या मैं उन्हें भटकने देता?', gap=0.6)],
    CAVE_V('smile'), cam=push(700, 430, 1.0, 1.1), amb='night'),
  S('f_road', 'forest', [
      ln('VYASA', 'I sent them to the town of Ekachakra, dressed as brahmins, to live on alms and wait. They lodged in the house of a poor brahmin and his family.',
                  'मैंने उन्हें ब्राह्मणों के वेश में एकचक्रा नगर भेजा, भिक्षा पर जीने और प्रतीक्षा करने। वे एक निर्धन ब्राह्मण और उसके परिवार के घर ठहरे।')],
    [sh(bg(set='valley', tod='gold', hz=480, city=[1250, 300], seed=0.6), 'valley_gold4'), figs('walk', BROS(300, y=880, S=300, dx=110), mv=dict(dx=[-80, 120], t=[0, 12])), fx('dust', col='#f0e0b0', n=40)],
    cam=pan(560, 1000, 480, 1.12), amb='wind', min=10),
  S('f_weep', 'lament', [
      ln('VYASA', 'One evening Kunti heard weeping in the house. The brahmin, his wife, his daughter, even his little son were all weeping, each one begging to be the one to die.',
                  'एक संध्या कुंती ने घर में रोने की आवाज़ सुनी। ब्राह्मण, उसकी पत्नी, उसकी पुत्री, यहाँ तक कि उसका छोटा पुत्र भी, सब रो रहे थे, हर कोई विनती कर रहा था कि मरने वह जाए।')],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), face('brahminW', 800, 450, 190, 1, 'sorrow', rim=RIM_LAMP)],
    cam=push(800, 460, 1.04, 1.16), amb='night'),
  S('f_baka', 'kala', [
      ln('VYASA', 'Outside the town lived the demon Baka. Every week the town had to send him a cart of rice, two buffaloes, and one human being. This week it was the brahmin\'s turn.',
                  'नगर के बाहर बक नाम का राक्षस रहता था। हर सप्ताह नगर को उसे एक गाड़ी चावल, दो भैंसे, और एक मनुष्य भेजना पड़ता था। इस सप्ताह ब्राह्मण की बारी थी।')],
    [bg(set='valley', tod='crimson', hz=450, seed=4.4, groves=4), face('baka', 800, 440, 210, 1, 'cruel', rim=RIM_FIRE), fx('embers', n=40)],
    cam=push(800, 450, 1.0, 1.14), amb='wind', sfx=[dict(n='roar', at=2.0, v=0.6)], hero=1, name=name('BAKA', 'बकासुर', 'the demon of Ekachakra', 'एकचक्रा का राक्षस', 1)),
  S('f_kunti', 'heroic', [
      ln('KUNTI', 'You have sheltered us, and you have one son. I have five. Let one of mine go instead. Do not be afraid. My son is stronger than any demon.',
                  'आपने हमें आश्रय दिया है, और आपका एक ही पुत्र है। मेरे पाँच हैं। मेरे एक पुत्र को जाने दीजिए। डरिए मत। मेरा पुत्र किसी भी राक्षस से अधिक बलवान है।')],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), face('kunti', 1040, 450, 190, -1, 'stern', rim=RIM_LAMP)],
    cam=push(1020, 450, 1.04, 1.14), amb='night'),
  S('f_cart', 'march', [
      ln('VYASA', 'Bhima drove the cart to the demon\'s grove. And since he had not eaten properly in months, he sat down and began to eat the demon\'s dinner.',
                  'भीम गाड़ी हाँककर राक्षस के उपवन तक ले गए। और क्योंकि महीनों से उन्होंने ठीक से खाया नहीं था, वे बैठ गए और राक्षस का भोजन खाने लगे।')],
    [bg(set='valley', tod='crimson', hz=450, seed=4.4, groves=4), piece('cart', 'foodCart', x=820, y=880, s=1.4), figs('eater', [fig('bhima', 480, 900, 560, 1, 'stand', style=POOR)], rim=RIM_FIRE)],
    cam=push(680, 520, 1.04, 1.16), amb='wind', sfx=[dict(n='crowdlaugh', at=8.0, v=0.2)]),
  S('f_rage', 'battle', [
      ln('VYASA', 'Baka came roaring out of the trees, and found a man eating his food with his back turned. He beat Bhima with both fists. Bhima kept eating. Then he wiped his hands, and stood up.',
                  'बक गरजता हुआ पेड़ों से निकला, और उसने देखा कि एक मनुष्य पीठ फेरकर उसका भोजन खा रहा है। उसने दोनों मुट्ठियों से भीम को पीटा। भीम खाते रहे। फिर उन्होंने हाथ पोंछे, और उठ खड़े हुए।')],
    [bg(set='valley', tod='crimson', hz=450, seed=4.4, groves=4), figs('bduel', [fig('bhima', 560, 900, 600, 1, 'maceUp', style=POOR), fig('baka', 1060, 900, 640, -1, 'charge')], rim=RIM_FIRE), fx('dust', col='#8a5a3a', n=90)],
    cam=push(800, 480, 1.04, 1.14), amb='battle', sfx=[dict(n='roar', at=0.5), dict(n='boom', at=4.0, v=0.4), dict(n='clash', at=10.0), dict(n='boom', at=13.0, v=0.7), dict(n='crack', at=14.0, v=0.7)], shake=[[13.0, 13.8]]),
  S('f_free', 'joy', [
      ln('VYASA', 'In the morning, the town of Ekachakra found the body of Baka at its gate, and danced in the streets. No one ever learned which brahmin had done it.',
                  'सुबह एकचक्रा नगर ने अपने द्वार पर बक का शव पाया, और गलियों में नाच उठा। कोई कभी नहीं जान पाया कि यह किस ब्राह्मण ने किया था।')],
    [sh(bg(set='city', tod='dawn', hz=600, col='#d8a07a'), 'town_dawn'), piece('dance', 'folk', cnt=20, y=780, dy=60, s=40, seed=12), fx('petals', every=2, n=70)],
    cam=pan(600, 1000, 470, 1.12), amb='crowd', sfx=[dict(n='cheer', at=1.0, v=0.5), dict(n='bells', at=3.0, v=0.4)]),

  # ---------- Draupadi's birth ----------
  S('g_news', 'mystery', [
      ln('VYASA', 'Then a traveller came through Ekachakra with news. Drupada, king of Panchala, was holding a swayamvar for his daughter. And he told them how that daughter had been born.',
                  'तभी एकचक्रा से होकर एक यात्री समाचार लेकर आया। पांचाल के राजा द्रुपद अपनी पुत्री का स्वयंवर कर रहे थे। और उसने बताया कि उस पुत्री का जन्म कैसे हुआ था।')],
    [sh(bg(set='ashram', tod='dusk', huts=[[420, 1], [1180, 0.8]], fire=1), 'ashram_fire'), fx('embers', n=40)],
    cam=pan(1000, 600, 470, 1.15), amb='night'),
  S('g_fire', 'cosmic', [
      ln('VYASA', 'Drupada\'s great sacrifice, the one he lit after Drona humbled him, burned for days. And out of the flames walked a young man in armour, holding a sword and a bow: Dhrishtadyumna, born to kill Drona.',
                  'द्रुपद का महान यज्ञ, जो उन्होंने द्रोण से अपमानित होने के बाद आरंभ किया था, कई दिनों तक जलता रहा। और ज्वालाओं से कवच पहने एक युवक निकला, हाथ में तलवार और धनुष: धृष्टद्युम्न, द्रोण के वध के लिए जन्मा।')],
    [sh(bg(set='void', base='#2a0608', mandala=300, my=440, col='#ffb060'), 'void_fire'), fx('fire', at=[[800, 860, 300, 400]], n=60), face('dhrishta', 800, 400, 180, 1, 'stern', rim=RIM_FIRE, glow=['#ff9040', 26, 0.3])],
    cam=push(800, 450, 1.0, 1.14), amb='fire', sfx=[dict(n='fire', at=0.5, v=0.6), dict(n='boom', at=6.0, v=0.5)], hero=1, name=name('DHRISHTADYUMNA', 'धृष्टद्युम्न', 'born of the fire', 'अग्नि से जन्मा', 1)),
  S('g_draupadi', 'divine', [
      ln('VYASA', 'And after him, from the altar itself, rose a young woman, dark as a blue lotus, with eyes like lotus petals, and a fragrance that carried for miles. A voice spoke from the sky.',
                  'और उसके बाद, स्वयं वेदी से, एक युवती उठी, नील कमल जैसी साँवली, कमल की पंखुड़ियों जैसी आँखों वाली, और ऐसी सुगंध वाली जो कोसों तक फैलती थी। आकाश से एक वाणी आई।'),
      ln('GODS', 'This woman will bring the warrior class to its end, and fulfil the purpose of the gods.', 'यह स्त्री क्षत्रियों का अंत करेगी, और देवताओं का प्रयोजन पूरा करेगी।', gap=0.6)],
    [sh(bg(set='void', base='#2a0608', mandala=300, my=440, col='#ffb060'), 'void_fire'), fx('embers', n=80, col='#ffb060'), face('draupadi', 800, 450, 200, 1, 'calm', rim=RIM_FIRE, glow=['#ff9040', 26, 0.3])],
    cam=push(800, 450, 1.0, 1.14), amb='temple', sfx=[dict(n='om', at=1.0, v=0.4), dict(n='thunder', at=12.0, v=0.4)], hero=1, name=name('DRAUPADI', 'द्रौपदी', 'born of fire', 'अग्नि से जन्मी', 1)),
  S('g_go', 'march', [
      ln('VYASA', 'The five brothers looked at each other. Then they took their mother, and set out for Panchala.', 'पाँचों भाइयों ने एक दूसरे को देखा। फिर वे अपनी माँ को लेकर पांचाल की ओर चल पड़े।')],
    [sh(bg(set='valley', tod='dawn', hz=470, city=[1200, 260], seed=0.0), 'valley_dawn'), figs('walk2', BROS(260, y=880, S=280, dx=100), mv=dict(dx=[-60, 160], t=[0, 10]))],
    cam=pan(600, 1000, 480, 1.12), amb='wind', min=8),

  # ---------- the swayamvar ----------
  S('g_gandharva', 'tension', [
      ln('VYASA', 'They reached the Ganga at midnight. A gandharva king, Angaraparna, was bathing there with his wives, and he did not like to be disturbed by men.',
                  'वे आधी रात को गंगा पहुँचे। गंधर्वराज अंगारपर्ण वहाँ अपनी पत्नियों के साथ स्नान कर रहे थे, और उन्हें मनुष्यों का विघ्न पसंद नहीं था।'),
      ln('VYASA', 'He loosed his arrows at them. Arjuna answered with a single torch, charged with the fire weapon, and the gandharva\'s chariot burned like straw.',
                  'उन्होंने उन पर बाण चलाए। अर्जुन ने अग्नि अस्त्र से अभिमंत्रित एक मशाल से उत्तर दिया, और गंधर्व का रथ तिनके की तरह जल गया।', gap=0.6)],
    [sh(bg(set='river', tod='night', hz=600), 'river_night4'), figs('ar', [fig('arjuna', 620, 900, 600, 1, 'release', weapon='bow', style=POOR)], rim=RIM_FIRE), fx('fire', at=[[1150, 700, 200, 260]], n=50), fx('stars', n=60)],
    cam=push(820, 480, 1.04, 1.14), amb='river', sfx=[dict(n='whoosh', at=10.0), dict(n='fire', at=10.5, v=0.6), dict(n='boom', at=11.0, v=0.4)]),
  S('g_friend', 'river', [
      ln('VYASA', 'Arjuna spared his life, and the gandharva became his friend. He gave them horses of the sky, and some advice: a king in exile needs a priest. So they found Dhaumya, who would stay with them for the rest of their lives.',
                  'अर्जुन ने उनके प्राण बख़्श दिए, और गंधर्व उनके मित्र बन गए। उन्होंने उन्हें आकाश के घोड़े दिए, और एक सलाह: वनवासी राजा को एक पुरोहित चाहिए। तो उन्हें धौम्य मिले, जो जीवन भर उनके साथ रहे।')],
    [sh(bg(set='river', tod='dawn', hz=560), 'river_dawn4'), fx('ripples', x=800, y=760), fx('sparkle', y0=650, y1=900, n=50)],
    cam=pan(1000, 600, 470, 1.15), amb='river', min=9),
  S('h_city', 'court', [
      ln('VYASA', 'Kampilya, the capital of Panchala, was full of kings. Duryodhana and his brothers were there, and Karna, and Shalya, and Jarasandha, and Shishupala. And Krishna of Dwaraka, with his brother Balarama.',
                  'पांचाल की राजधानी कांपिल्य राजाओं से भरी थी। दुर्योधन और उसके भाई वहाँ थे, और कर्ण, और शल्य, और जरासंध, और शिशुपाल। और द्वारका के कृष्ण, अपने भाई बलराम के साथ।')],
    [sh(bg(set='city', tod='gold', ghats=1), 'city_gold'), piece('folkghat', 'folk', cnt=16, y=640, dy=40, s=40, seed=9), fx('petals', every=2, n=40)],
    cam=[[800, 600, 1.4], [800, 450, 1.0]], amb='crowd', sfx=[dict(n='nagara', at=0.5, v=0.5)], min=10),
  S('h_test', 'court', [
      ln('DHRISHTA', 'Hear me, kings! Above you turns a fish. Below you is a pool of oil. Whoever strings this bow, and looking only at the reflection, sends five arrows through the fish\'s eye, will marry my sister.',
                     'सुनो, राजाओं! तुम्हारे ऊपर एक मछली घूम रही है। नीचे तेल का कुंड है। जो इस धनुष पर प्रत्यंचा चढ़ाए, और केवल परछाई देखकर मछली की आँख में पाँच बाण मारे, वही मेरी बहन से विवाह करेगा।')],
    [sh(bg(set='court', tone='#5a1a30', canopy=1), 'sway_hall'), piece('wheel', 'fishWheel', k='anim', every=2, x=800, y=230, s=1.0), piece('pool', 'oilPool', d=1.0, x=800, y=780)],
    cam=[[800, 700, 1.25], [800, 330, 1.05]], amb='court', sfx=[dict(n='drumroll', at=10.0)]),
  S('h_bride', 'love', [
      ln('VYASA', 'Draupadi walked into the hall holding the garland, and every king forgot to breathe.', 'द्रौपदी वरमाला लिए सभा में आईं, और हर राजा साँस लेना भूल गया।')],
    [sh(bg(set='court', tone='#5a1a30', canopy=1), 'sway_hall'), figs('bride', [dict(who='draupadi', x=800, y=880, S=560, f=1)], rim=RIM_GOLD), fx('petals', every=2, n=60)],
    cam=push(800, 470, 1.04, 1.14), amb='court', sfx=[dict(n='bells', at=0.5, v=0.4)]),
  S('h_fail', 'tension', [
      ln('VYASA', 'King after king stepped up to the bow. Some could not lift it. Some lifted it and could not bend it. Some were flung down by it as it sprang back. Jarasandha fell to his knees. Shishupala fell on his back. The hall laughed at every one.',
                  'एक के बाद एक राजा धनुष के पास आए। कुछ उसे उठा न सके। कुछ ने उठाया पर झुका न सके। कुछ को वह पलटकर गिरा गया। जरासंध घुटनों पर गिरे। शिशुपाल पीठ के बल। सभा हर एक पर हँसी।')],
    [sh(bg(set='court', tone='#5a1a30', canopy=1), 'sway_hall'), figs('kings', [fig('king', 520, 900, 520, 1, 'despair'), fig('shalva', 1080, 900, 520, -1, 'stand')]), fx('dust', col='#f0c070', n=40)],
    cam=push(800, 470, 1.04, 1.12), amb='crowd', sfx=[dict(n='crowdlaugh', at=4.0, v=0.5), dict(n='crowdlaugh', at=10.0, v=0.5)]),
  S('h_karna', 'heroic', [
      ln('VYASA', 'Then Karna rose. He lifted the bow as if it were a reed, strung it in one movement, and fitted an arrow. The hall went silent.', 'तब कर्ण उठे। उन्होंने धनुष ऐसे उठाया जैसे वह सरकंडा हो, एक ही बार में प्रत्यंचा चढ़ाई, और बाण चढ़ाया। सभा में सन्नाटा छा गया।')],
    [sh(bg(set='court', tone='#5a1a30', canopy=1), 'sway_hall'), figs('kb', [fig('karna', 800, 900, 640, 1, 'draw', weapon='bowDrawn')], rim=RIM_SUN, glow=['#ffd060', 20, 0.35])],
    cam=push(800, 480, 1.04, 1.16), amb='court', sfx=[dict(n='drumroll', at=4.0)]),
  S('h_refuse', 'sorrow', [
      ln('DRAUPADI', 'I will not marry a charioteer\'s son.', 'मैं सारथी के पुत्र से विवाह नहीं करूँगी।'),
      ln('VYASA', 'Karna looked up at the sun, laughed once, bitterly, and laid down the bow. He said nothing. He would remember it for the rest of his life.', 'कर्ण ने सूर्य की ओर देखा, एक बार कड़वाहट से हँसे, और धनुष रख दिया। वे कुछ नहीं बोले। उन्हें यह जीवन भर याद रहा।', gap=0.8)],
    [sh(bg(set='court', tone='#5a1a30', canopy=1), 'sway_hall'), face('karna', 560, 470, 180, 1, 'sorrow', n='karna'), face('draupadi', 1150, 440, 170, -1, 'stern', n='draupadi')],
    cam=[[1000, 450, 1.08], [620, 460, 1.12]], amb='court', sfx=[dict(n='gasp', at=0.5, v=0.5)]),
  S('h_brahmin', 'heroic', [
      ln('VYASA', 'Then, from among the brahmins, a young man stood up, with dust on his feet and a deerskin on his shoulder. The kings jeered. Krishna leaned over to his brother and whispered, That is Arjuna.',
                  'तभी ब्राह्मणों के बीच से एक युवक उठा, पैरों पर धूल और कंधे पर मृगछाला। राजाओं ने ठिठोली की। कृष्ण ने अपने भाई की ओर झुककर फुसफुसाया, वह अर्जुन है।')],
    [sh(bg(set='court', tone='#5a1a30', canopy=1), 'sway_hall'), face('krishna', 1040, 440, 190, -1, 'smile', rim=RIM_MOON, glow=['#7ab0ff', 26, 0.3])],
    cam=push(1020, 450, 1.0, 1.14), amb='crowd', sfx=[dict(n='crowdlaugh', at=4.0, v=0.4), dict(n='flute', at=9.0, v=0.4)], hero=1, name=name('KRISHNA', 'कृष्ण', 'prince of Dwaraka', 'द्वारकाधीश', -1)),
  S('h_arrow', 'heroic', [
      ln('VYASA', 'He walked round the bow once, bowed to it, strung it, looked down into the oil, and let fly five arrows. The fish fell from the sky.', 'उन्होंने धनुष की एक परिक्रमा की, उसे प्रणाम किया, प्रत्यंचा चढ़ाई, तेल में नीचे देखा, और पाँच बाण छोड़े। मछली आकाश से गिर पड़ी।')],
    [sh(bg(set='court', tone='#5a1a30', canopy=1), 'sway_hall'), piece('wheel2', 'fishWheel', k='anim', every=2, x=800, y=230, s=1.0, hit=8.2), figs('archer', [fig('arjuna', 800, 900, 640, 1, 'draw', weapon='bowDrawn', rot=-62, style=POOR)], rim=RIM_GOLD),
     piece('shot', 'arrowStreak', k='anim', every=1, add=True, t0=8.0, x0=860, y0=520, x1=800, y1=240), fx('petals', n=80, t0=8.6)],
    cam=[[800, 600, 1.15], [800, 360, 1.05]], amb='court', sfx=[dict(n='whoosh', at=8.0), dict(n='crack', at=8.2, v=0.6), dict(n='cheer', at=8.6), dict(n='conch', at=9.0, v=0.5)]),
  S('h_garland', 'love', [
      ln('VYASA', 'Draupadi walked across the hall, and put the garland around the neck of a poor brahmin.', 'द्रौपदी सभा के पार गईं, और एक निर्धन ब्राह्मण के गले में वरमाला डाल दी।')],
    [sh(bg(set='court', tone='#5a1a30', canopy=1), 'sway_hall'), figs('wed', [fig('arjuna', 620, 880, 600, 1, 'bless', style=POOR), dict(who='draupadi', x=940, y=880, S=540, f=-1)], rim=RIM_GOLD), fx('petals', every=2, n=90)],
    cam=push(780, 470, 1.04, 1.12), amb='court', sfx=[dict(n='bells', at=0.5), dict(n='cheer', at=1.5, v=0.5)]),
  S('h_riot', 'battle', [
      ln('VYASA', 'The kings were outraged. A beggar, winning a princess? They drew their swords. Bhima pulled up a tree by its roots and stood beside his brother. And in the confusion, Krishna calmed the kings, and the brahmin and his bride slipped away.',
                  'राजा क्रोधित हो उठे। एक भिखारी, राजकुमारी जीत ले? उन्होंने तलवारें खींच लीं। भीम ने एक पेड़ जड़ से उखाड़ा और भाई के पास खड़े हो गए। और उस कोलाहल में, कृष्ण ने राजाओं को शांत किया, और ब्राह्मण अपनी दुल्हन के साथ निकल गया।')],
    [sh(bg(set='city', tod='dusk', hz=600, col='#d8a07a'), 'city_dusk4'), figs('riot', [fig('bhima', 700, 900, 620, 1, 'maceUp', style=POOR), fig('arjuna', 960, 900, 560, 1, 'draw', weapon='bowDrawn', style=POOR)], rim=RIM_FIRE), fx('dust', col='#c07a4a', n=90)],
    cam=push(800, 480, 1.04, 1.12), amb='battle', sfx=[dict(n='roar', at=0.5, v=0.6), dict(n='clash', at=3.0), dict(n='crack', at=6.0, v=0.6), dict(n='clash', at=9.0)]),

  # ---------- five husbands ----------
  S('h_karnaduel', 'battle', [
      ln('VYASA', 'In the fighting, Karna faced the brahmin archer, and for the first time in his life he could not break through.', 'उस युद्ध में कर्ण ने उस ब्राह्मण धनुर्धर का सामना किया, और जीवन में पहली बार वे भेद न सके।'),
      ln('KARNA', 'Who are you? Are you Parashurama himself, or Indra, or Vishnu in disguise?', 'तुम कौन हो? क्या तुम स्वयं परशुराम हो, या इंद्र, या वेश बदले विष्णु?', gap=0.5),
      ln('ARJUNA', 'I am only a brahmin who learned the bow from his teacher.', 'मैं केवल एक ब्राह्मण हूँ जिसने अपने गुरु से धनुष सीखा।', gap=0.5),
      ln('VYASA', 'And Karna, who would never fight a brahmin, lowered his bow and walked away. Neither of them knew who the other was.', 'और कर्ण, जो कभी ब्राह्मण से नहीं लड़ते थे, धनुष नीचे करके चले गए। दोनों में से कोई नहीं जानता था कि दूसरा कौन है।', gap=0.6)],
    [sh(bg(set='city', tod='dusk', hz=600, col='#d8a07a'), 'city_dusk4'), figs('kv', [fig('karna', 1080, 900, 600, -1, 'draw', weapon='bowDrawn')], rim=RIM_SUN), figs('av', [fig('arjuna', 520, 900, 580, 1, 'draw', weapon='bowDrawn', style=POOR)], rim=RIM_GOLD), piece('kr', 'arrowRain', k='anim', every=2, add=True)],
    cam=[[700, 470, 1.1], [900, 470, 1.1]], amb='battle', sfx=[dict(n='whoosh', at=1.0), dict(n='clash', at=3.0), dict(n='whoosh', at=5.0)]),
  S('i_home', 'joy', [
      ln('ARJUNA', 'Mother! Come and see what we have brought home today!', 'माँ! आकर देखो, आज हम क्या लाए हैं!'),
      ln('KUNTI', 'Whatever it is, share it equally among yourselves.', 'जो भी है, आपस में बराबर बाँट लो।', gap=0.6)],
    [bg(set='forest', tod='dusk', hut=1150), figs('family', [fig('arjuna', 420, 880, 560, 1, 'bless', style=POOR), dict(who='draupadi', x=640, y=880, S=520, f=1), fig('bhima', 250, 880, 580, 1, 'stand', style=POOR)], rim=RIM_GOLD), fx('fireflies', n=40)],
    cam=push(700, 460, 1.0, 1.1), amb='birds'),
  S('i_kunti', 'tension', [
      ln('VYASA', 'Then Kunti came out, and saw what they had brought home. And her face went white.', 'तब कुंती बाहर आईं, और देखा कि वे क्या लाए थे। और उनका चेहरा सफ़ेद पड़ गया।'),
      ln('KUNTI', 'What have I said? I have never spoken an untruth in my life.', 'मैंने यह क्या कह दिया? मैंने जीवन में कभी असत्य नहीं बोला।', gap=0.6)],
    [bg(set='forest', tod='dusk', hut=1150), face('kunti', 1040, 450, 190, -1, 'fear', rim=RIM_FIRE)],
    cam=push(1020, 450, 1.04, 1.16), amb='birds', sfx=[dict(n='gasp', at=0.5, v=0.4)]),
  S('i_ask', 'mystery', [
      ln('GANESHA', 'And Draupadi, Muni? Did anyone ask her?', 'और द्रौपदी, मुनिवर? क्या किसी ने उनसे पूछा?'),
      ln('VYASAC', 'Few in this story ask her anything, scribe. Remember that you noticed. One day she will ask a question of her own, in a hall full of kings, and none of them will be able to answer.',
                   'इस कथा में बहुत कम लोग उनसे कुछ पूछते हैं, लेखक। याद रखना कि तुमने यह देखा। एक दिन वे स्वयं एक प्रश्न पूछेंगी, राजाओं से भरी सभा में, और उनमें से कोई उत्तर नहीं दे पाएगा।', gap=0.8)],
    CAVE(), cam=CAVE_CAM['ga'], amb='night'),
  S('i_dhrishta', 'tension', [
      ln('VYASA', 'That night Dhrishtadyumna hid outside the potter\'s hut where they lodged, and listened. They did not talk of alms or prayers. They talked of chariots, and weapons, and war. He ran to his father.',
                  'उस रात धृष्टद्युम्न उस कुम्हार की झोपड़ी के बाहर छिपा, जहाँ वे ठहरे थे, और सुनता रहा। वे भिक्षा या प्रार्थना की बात नहीं कर रहे थे। वे रथों, और अस्त्रों, और युद्ध की बात कर रहे थे। वह अपने पिता के पास दौड़ा।'),
      ln('DHRISHTA', 'Father, those are no brahmins. Those are the sons of Pandu.', 'पिताजी, वे ब्राह्मण नहीं हैं। वे पांडु के पुत्र हैं।', gap=0.6)],
    [bg(set='forest', tod='night', hut=1150), face('dhrishta', 560, 450, 180, 1, 'smile', rim=RIM_MOON), fx('fireflies', n=50)],
    cam=push(580, 450, 1.04, 1.14), amb='night'),
  S('i_vyasa', 'mystery', [
      ln('VYASA', 'Drupada was horrified. One woman, five husbands? So I came again, and told him what I knew. In a past life Draupadi had prayed to Shiva five times for a husband with every virtue. Shiva had granted her five husbands.',
                  'द्रुपद स्तब्ध रह गए। एक स्त्री, पाँच पति? तो मैं फिर आया, और उन्हें वह बताया जो मैं जानता था। पिछले जन्म में द्रौपदी ने शिव से पाँच बार सर्वगुणसंपन्न पति माँगा था। शिव ने उन्हें पाँच पति दिए।')],
    [sh(bg(set='court', tone='#1a2a4a', throne=[800, 660, 240], canopy=1), 'pan_court'), figs('vd', [fig('vyasa', 600, 880, 540, 1, 'bless'), fig('drupada', 1000, 880, 520, -1, 'stand')], rim=RIM_GOLD)],
    cam=push(800, 470, 1.04, 1.12), amb='court'),
  S('i_wed', 'joy', [
      ln('VYASA', 'So Draupadi married the five sons of Pandu, one on each day, and Drupada\'s whole city celebrated. And Krishna came to them with gifts, and embraced his cousins, and laughed.',
                  'तो द्रौपदी ने पांडु के पाँचों पुत्रों से विवाह किया, हर दिन एक से, और द्रुपद के पूरे नगर ने उत्सव मनाया। और कृष्ण उपहार लेकर उनके पास आए, अपने भाइयों को गले लगाया, और हँसे।')],
    [sh(bg(set='city', tod='gold', ghats=1), 'city_gold'), fx('petals', every=2, n=100), piece('lamps', 'floatLamps', k='anim', every=2, add=True)],
    cam=pan(560, 1040, 450, 1.15), amb='crowd', sfx=[dict(n='nagara', at=0.4, v=0.6), dict(n='conch', at=2.0, v=0.5), dict(n='cheer', at=4.0, v=0.5)], min=10),
  S('i_krishna', 'krishna', [
      ln('KRISHNA', 'Cousin Yudhishthira, you have been dead a long time. It is time to come back to life.', 'भ्राता युधिष्ठिर, आप बहुत समय से मृत हैं। अब फिर से जीवित होने का समय है।')],
    [bg(set='river', tod='night', hz=600, moon=[380, 220, 70]), fx('fireflies', n=70), face('krishna', 1000, 440, 200, -1, 'smile', rim=RIM_MOON, glow=['#7ab0ff', 26, 0.35])],
    cam=push(940, 450, 1.0, 1.14), amb='night', sfx=[dict(n='flute', at=1.0, v=0.6)]),

  # ---------- return ----------
  S('j_news', 'tension', [
      ln('VYASA', 'The news reached Hastinapura like a slap. The Pandavas were alive. They had married the daughter of Panchala. And they had Drupada\'s army, and Krishna\'s friendship, behind them.',
                  'समाचार हस्तिनापुर पहुँचा जैसे एक थप्पड़। पांडव जीवित थे। उन्होंने पांचाल की पुत्री से विवाह किया था। और उनके पीछे द्रुपद की सेना थी, और कृष्ण की मित्रता।')],
    [sh(bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), 'court_dark'), face('duryo', 560, 440, 190, 1, 'anger', n='du', rim=RIM_FIRE), face('karna', 1060, 450, 180, -1, 'stern', n='ka', rim=RIM_GOLD)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='court', sfx=[dict(n='gong', at=0.5, v=0.5)]),
  S('j_bhishma', 'court', [
      ln('BHISHMA', 'They are my grandsons as much as yours, king. Bring them home. Give them half the kingdom. That is dharma, and it is also the only way to keep the peace.',
                    'वे जितने आपके हैं, उतने ही मेरे पौत्र हैं, राजन। उन्हें घर बुलाइए। उन्हें आधा राज्य दीजिए। यही धर्म है, और शांति बनाए रखने का एकमात्र मार्ग भी।', fx='elder')],
    [sh(bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), 'court_dark'), face('bhishma', 1040, 440, 190, -1, 'stern', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.0, 1.14), amb='court'),
  S('j_vidura', 'joy', [
      ln('VYASA', 'Vidura himself rode to Panchala to bring them home. Kunti wept when she saw him. He was the one who had saved them, and he had never said a word.',
                  'स्वयं विदुर उन्हें घर लाने पांचाल गए। उन्हें देखकर कुंती रो पड़ीं। उन्होंने ही उन्हें बचाया था, और कभी एक शब्द नहीं कहा था।')],
    [sh(bg(set='court', tone='#1a2a4a', throne=[800, 660, 240], canopy=1), 'pan_court'), figs('vk', [fig('vidura', 620, 880, 540, 1, 'bless'), dict(who='kunti', x=960, y=880, S=480, f=-1)], rim=RIM_GOLD)],
    cam=push(790, 470, 1.04, 1.12), amb='court'),
  S('j_khandava', 'mystery', [
      ln('VYASA', 'So Dhritarashtra gave them half the kingdom. But not the half with Hastinapura in it. He gave them Khandavaprastha, a wilderness of thorn and forest by the Yamuna, where no one had ever built a city.',
                  'तो धृतराष्ट्र ने उन्हें आधा राज्य दिया। पर वह आधा नहीं जिसमें हस्तिनापुर था। उन्होंने उन्हें खांडवप्रस्थ दिया, यमुना किनारे काँटों और वन का एक बीहड़, जहाँ कभी किसी ने नगर नहीं बसाया था।')],
    [bg(set='forest', tod='dusk', season='autumn'), fx('dust', col='#c08a5a', n=50), fx('leaves', n=60)],
    cam=[[800, 600, 1.35], [800, 460, 1.0]], amb='wind', min=10),
  S('j_cave', 'mystery', [
      ln('GANESHA', 'A forest of thorns, for the sons of the gods.', 'देवताओं के पुत्रों के लिए काँटों का वन।'),
      ln('VYASAC', 'Wait, scribe. Tomorrow Krishna and Arjuna will set that forest on fire, and out of its ashes will rise the most beautiful city on earth. And a hall that will be the ruin of them all.',
                   'प्रतीक्षा करो, लेखक। कल कृष्ण और अर्जुन उस वन में आग लगाएँगे, और उसकी राख से पृथ्वी का सबसे सुंदर नगर उठेगा। और एक सभा, जो उन सबका विनाश बनेगी।', gap=0.8)],
    CAVE(), cam=[[800, 470, 1.05], [800, 520, 1.3]], amb='night', tout='fade', min=12),
  ])
