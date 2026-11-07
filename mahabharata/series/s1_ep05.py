# Season 1, Episode 5: Khandava, Indraprastha, Jarasandha, the Rajasuya, Shishupala, and the dice.

def build(EP, S, ln, bg, face, figs, fig, piece, fx, name, push, pan, hold, sh, CAVE, CAVE_V, CAVE_G, CAVE_CAM, RIM_GOLD, RIM_FIRE, RIM_COOL, RIM_LAMP):
  RIM_MOON = ['#cfe4ff', -3, -2, 0.55]
  KGLOW = ['#7ab0ff', 26, 0.35]
  POOR = dict(dhoti='#e8dcc0', crown='bun', scarf='#d9c9a0')
  MAYA = lambda: [sh(bg(set='court', tone='#1a3a4a', lamps=1), 'maya_bg'), sh(piece('hall', 'mayaHall', d=0.8), 'maya_hall')]
  DICE_HALL = lambda: sh(bg(set='court', tone='#3a0e0c', lamps=1), 'dice_hall')
  EP(5, 'The Hall of Illusions and the Game of Dice', 'माया सभा और द्यूत', 'A city from the ashes, a king of kings, and a game that could not be refused.', 'राख से उठा नगर, राजाओं का राजा, और एक खेल जिसे ठुकराया न जा सका।', [
  S('a_cave', 'mystery', [
      ln('VYASA', 'The fifth night. The storm had passed, and the stars over the peaks were so bright that Ganesha could have written without the lamps.',
                  'पाँचवीं रात। तूफ़ान बीत चुका था, और चोटियों के ऊपर तारे इतने उज्ज्वल थे कि गणेश बिना दीयों के भी लिख सकते थे।', at=5.0)],
    CAVE('night') + [fx('stars', n=80)], cam=[[800, 520, 1.3], [800, 470, 1.05]], amb='night', min=12, eptitle=1, tin='fade'),
  S('a_ask', 'krishna', [
      ln('GANESHA', 'A forest of thorns, you said. And a hall that will ruin them all. Which comes first?', 'काँटों का वन, आपने कहा था। और एक सभा जो सबका विनाश करेगी। पहले क्या आता है?'),
      ln('VYASAC', 'The fire comes first. It always does.', 'पहले अग्नि आती है। हमेशा वही आती है।', gap=0.8)],
    CAVE_G(), cam=push(820, 430, 1.0, 1.08), amb='night'),

  # ---------- Khandava ----------
  S('b_yamuna', 'river', [
      ln('VYASA', 'Krishna and Arjuna went down to the Yamuna one summer to escape the heat, with Draupadi and Krishna\'s sister Subhadra, whom Arjuna had by then married. A tall brahmin with copper hair came to them, burning with hunger.',
                  'एक गर्मी में कृष्ण और अर्जुन ताप से बचने यमुना तट पर गए, द्रौपदी और कृष्ण की बहन सुभद्रा के साथ, जिनसे तब तक अर्जुन का विवाह हो चुका था। ताम्र केशों वाला एक लंबा ब्राह्मण उनके पास आया, भूख से जलता हुआ।')],
    [sh(bg(set='river', tod='day', hz=560), 'river_day5'), fx('ripples', x=800, y=820), fx('sparkle', y0=650, y1=900, n=40)],
    cam=pan(560, 1040, 460, 1.15), amb='river', min=11),
  S('b_friends', 'krishna', [
      ln('VYASA', 'They were more than cousins, those two. They had the same age and the same laugh. People said that Arjuna was Krishna\'s shadow, and Krishna was Arjuna\'s mind. They swam, and wrestled, and lay in the shade talking until the sun went down.',
                  'वे दोनों भाइयों से बढ़कर थे। उनकी आयु एक थी और हँसी भी एक। लोग कहते थे कि अर्जुन कृष्ण की छाया हैं, और कृष्ण अर्जुन का मन। वे तैरते, कुश्ती लड़ते, और छाँव में लेटे बातें करते रहते जब तक सूरज न ढल जाता।')],
    [sh(bg(set='river', tod='day', hz=560), 'river_day5'), face('krishna', 560, 450, 180, 1, 'smile', n='kr', rim=RIM_GOLD, glow=KGLOW), face('arjuna', 1060, 450, 180, -1, 'smile', n='ar', rim=RIM_GOLD)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='river', sfx=[dict(n='flute', at=1.0, v=0.3)]),
  S('b_agni', 'fire', [
      ln('AGNI', 'I am Agni, the fire. I am sick from too many sacrifices, too much ghee. Only one thing will cure me: to eat the whole forest of Khandava. But Indra guards it, and every time I try, he sends rain.',
                 'मैं अग्नि हूँ। बहुत अधिक यज्ञों से, बहुत अधिक घी से, मैं रोगी हूँ। केवल एक चीज़ मुझे ठीक करेगी: पूरे खांडव वन को खा जाना। पर इंद्र उसकी रक्षा करते हैं, और जब भी मैं प्रयास करता हूँ, वे वर्षा भेज देते हैं।')],
    [sh(bg(set='river', tod='day', hz=560), 'river_day5'), face('agni', 800, 440, 200, 1, 'divine', rim=RIM_FIRE, glow=['#ff9040', 30, 0.35]), fx('embers', n=60)],
    cam=push(800, 450, 1.0, 1.14), amb='fire', sfx=[dict(n='fire', at=0.5, v=0.5)], hero=1, name=name('AGNI', 'अग्नि', 'god of fire', 'अग्निदेव', 1)),
  S('b_gandiva', 'divine', [
      ln('VYASA', 'Arjuna said he would hold back the rain, if he had a bow strong enough. So Agni brought from the god Varuna the bow Gandiva, two quivers that would never empty, and a chariot with a monkey on its banner. And to Krishna he gave the discus, Sudarshana.',
                  'अर्जुन ने कहा कि वे वर्षा रोक लेंगे, यदि उनके पास पर्याप्त शक्तिशाली धनुष हो। तो अग्नि वरुणदेव से गांडीव धनुष लाए, दो कभी न खाली होने वाले तरकश, और एक रथ जिसकी ध्वजा पर वानर था। और कृष्ण को उन्होंने सुदर्शन चक्र दिया।')],
    [sh(bg(set='void', base='#0a1030', mandala=300, my=420), 'void_mandala'), fx('wheel', x=1120, y=380, r=180, col='#ffe08a'), figs('gand', [fig('arjuna', 620, 900, 620, 1, 'bowLow', weapon='bowRest')], rim=RIM_GOLD, glow=['#ffe0a0', 20, 0.3])],
    cam=push(800, 470, 1.0, 1.12), amb='temple', sfx=[dict(n='magic', at=1.0), dict(n='om', at=8.0, v=0.4), dict(n='sparkle', at=14.0)]),
  S('b_burn', 'fire', [
      ln('VYASA', 'Then Agni fell on the forest of Khandava. The trees went up in a single breath. The sky turned black with smoke.',
                  'तब अग्नि खांडव वन पर टूट पड़े। एक ही साँस में पेड़ जल उठे। आकाश धुएँ से काला हो गया।')],
    [sh(bg(set='forest', tod='dusk', season='autumn'), 'forest_autumn'), fx('fire', every=2, at=[[300, 760, 300, 480], [700, 740, 360, 560], [1100, 760, 340, 520], [1450, 760, 260, 420]], n=140), fx('glow', x=800, y=600, r=700, col='#ff6020', rate=4)],
    cam=[[800, 600, 1.35], [800, 460, 1.0]], amb='fire', sfx=[dict(n='fire', at=0.3, v=0.8), dict(n='roar', at=3.0, v=0.5), dict(n='boom', at=6.0, v=0.5)], g=dict(tint='#ff9060', k=0.12), shake=[[6.0, 6.6]]),
  S('b_flee', 'fire', [
      ln('VYASA', 'The birds rose in clouds and fell back burning. Deer ran in circles. Elephants trumpeted and turned and turned again. And around the whole forest, Krishna and Arjuna drove their chariots, round and round, and let nothing out.',
                  'पक्षी झुंडों में उड़े और जलते हुए गिर पड़े। हिरण चक्कर काटते रहे। हाथी चिंघाड़ते, मुड़ते और फिर मुड़ते। और पूरे वन के चारों ओर कृष्ण और अर्जुन अपने रथ दौड़ाते रहे, गोल गोल, और किसी को बाहर नहीं जाने दिया।')],
    [sh(bg(set='forest', tod='dusk', season='autumn'), 'forest_autumn'), fx('fire', every=2, at=[[200, 780, 260, 420], [1400, 780, 260, 420]], n=100), piece('ch', 'warChariot', k='anim', every=2, x=300, y=880, s=0.55, rider='arjuna', driver='krishna'), fx('embers', n=80), fx('glow', x=800, y=600, r=700, col='#ff6020', rate=4)],
    cam=pan(560, 1040, 480, 1.1), amb='fire', g=dict(tint='#ff9060', k=0.1), sfx=[dict(n='hooves', at=0.5, v=0.5), dict(n='fire', at=1.0, v=0.6)]),
  S('b_indra', 'storm', [
      ln('VYASA', 'Indra sent his clouds. Arjuna raised a roof of arrows over the whole forest, so thick that not a drop of rain fell through. Indra hurled his thunderbolt. Krishna\'s discus turned it aside.',
                  'इंद्र ने अपने बादल भेजे। अर्जुन ने पूरे वन के ऊपर बाणों की छत बना दी, इतनी घनी कि वर्षा की एक बूँद भी नीचे न गिरी। इंद्र ने अपना वज्र फेंका। कृष्ण के चक्र ने उसे मोड़ दिया।')],
    [sh(bg(set='sky', tod='storm', hz=720, ground='#1a2030'), 'storm_sky5'), piece('roof', 'arrowRain', k='anim', every=2, add=True), fx('flash', every=1, at=[2.0, 9.0], bolt=1100), fx('rain', n=150), fx('wheel', x=800, y=360, r=160, col='#ffe08a')],
    cam=push(800, 460, 1.0, 1.12), amb='storm', sfx=[dict(n='thunder', at=2.0), dict(n='whoosh', at=4.0), dict(n='thunder', at=9.0), dict(n='clash', at=9.5, v=0.6)], shake=[[9.0, 9.6]]),
  S('b_ash', 'lament', [
      ln('VYASA', 'For fifteen days the forest burned. Every creature that fled was driven back into the flames. When it was over, Agni was cured, and the land by the Yamuna was bare and black and silent.',
                  'पंद्रह दिनों तक वन जलता रहा। भागने वाला हर जीव वापस लपटों में धकेल दिया गया। जब यह समाप्त हुआ, तो अग्नि स्वस्थ हो गए, और यमुना किनारे की भूमि नंगी, काली और मौन थी।')],
    [bg(set='valley', tod='dusk', hz=450, seed=6.1, groves=0, col='#3a2a24'), fx('dust', col='#6a6a6a', n=100), fx('embers', n=40)],
    cam=pan(1000, 600, 470, 1.15), amb='wind', min=10),
  S('b_takshaka', 'mystery', [
      ln('VYASA', 'Takshaka, king of the serpents, had been away that day. When he came home, the forest was ash and his family was gone. He went down into the earth, and waited. Generations later, he would bite Arjuna\'s grandson, King Parikshit, and the serpent sacrifice at which this whole story was first told would begin.',
                  'नागराज तक्षक उस दिन दूर थे। जब वे लौटे, वन राख था और उनका परिवार जा चुका था। वे धरती में उतर गए, और प्रतीक्षा करने लगे। पीढ़ियों बाद वे अर्जुन के पौत्र राजा परीक्षित को डसेंगे, और वह सर्प यज्ञ आरंभ होगा जिसमें यह पूरी कथा पहली बार सुनाई गई।')],
    [bg(set='valley', tod='dusk', hz=450, seed=6.1, groves=0, col='#3a2a24'), fx('dust', col='#6a6a6a', n=60), fx('embers', n=20)],
    cam=[[800, 520, 1.15], [800, 470, 1.0]], amb='wind', min=10),
  S('b_cave', 'mystery', [
      ln('GANESHA', 'Every creature, Muni? The birds, the deer, the serpents in their holes?', 'हर जीव, मुनिवर? पक्षी, हिरण, बिलों में छिपे साँप?'),
      ln('VYASAC', 'Write it. A great city rose on that ground. Its foundations are made of that fire. And one serpent, Takshaka\'s son, escaped. He did not forget.',
                   'लिखो। उस भूमि पर एक महान नगर उठा। उसकी नींव उसी अग्नि से बनी है। और एक सर्प, तक्षक का पुत्र, बच निकला। वह नहीं भूला।', gap=0.8)],
    CAVE(), cam=CAVE_CAM['two'], amb='night'),

  # ---------- Maya and Indraprastha ----------
  S('c_maya', 'mystery', [
      ln('VYASA', 'One other life was spared. Maya, the architect of the asuras, ran from the flames and fell at Arjuna\'s feet. Arjuna lowered his bow.',
                  'एक और जीवन बचा। असुरों के वास्तुकार मय लपटों से भागकर अर्जुन के चरणों में गिर पड़े। अर्जुन ने धनुष नीचे कर लिया।'),
      ln('MAYA', 'You have given me my life. Let me give you something in return. I will build you a hall such as the world has never seen.', 'आपने मुझे जीवन दिया है। बदले में मुझे कुछ देने दीजिए। मैं आपके लिए ऐसी सभा बनाऊँगा जैसी संसार ने कभी नहीं देखी।', gap=0.6)],
    [bg(set='valley', tod='dusk', hz=450, seed=6.1, groves=0, col='#3a2a24'), face('maya', 1040, 440, 190, -1, 'awe', rim=RIM_FIRE)],
    cam=push(1020, 450, 1.0, 1.14), amb='wind', hero=1, name=name('MAYA', 'मय', 'architect of the asuras', 'असुरों के शिल्पी', -1)),
  S('c_city', 'joy', [
      ln('VYASA', 'And so, out of the ashes of Khandava, rose Indraprastha. White walls and wide streets, moats like the sea, gardens full of birds, and a palace that shone like the moon.',
                  'और इस प्रकार खांडव की राख से इंद्रप्रस्थ उठा। श्वेत प्राचीरें और चौड़ी गलियाँ, सागर जैसी खाइयाँ, पक्षियों से भरे उद्यान, और चंद्रमा जैसा चमकता महल।')],
    [sh(bg(set='city', tod='gold', ghats=1, col='#f0e6d0'), 'indra_city'), piece('folk', 'folk', cnt=18, y=660, dy=40, s=40, seed=21), fx('petals', every=2, n=40)],
    cam=[[800, 600, 1.4], [800, 450, 1.0]], amb='crowd', sfx=[dict(n='bells', at=1.0, v=0.4), dict(n='cheer', at=4.0, v=0.4)], min=11),
  S('c_life', 'joy', [
      ln('VYASA', 'Merchants came from every country. Scholars came to debate in its halls, and craftsmen to build its temples. Yudhishthira ruled with such justice that, it was said, the rain came on time, and no child died before his father.',
                  'हर देश से व्यापारी आए। विद्वान उसकी सभाओं में शास्त्रार्थ करने आए, और शिल्पी उसके मंदिर बनाने। युधिष्ठिर ने ऐसे न्याय से राज किया कि, कहते हैं, वर्षा समय पर होती थी, और कोई बालक अपने पिता से पहले नहीं मरता था।')],
    [sh(bg(set='city', tod='gold', ghats=1, col='#f0e6d0'), 'indra_city'), piece('trib', 'procession', k='anim', every=3, y=820, s=90, x0=-300, cnt=9, speed=30), fx('petals', every=2, n=30)],
    cam=[[800, 470, 1.0], [800, 520, 1.12]], amb='crowd', sfx=[dict(n='bells', at=2.0, v=0.3)], min=10),
  S('c_hall', 'wonder', [
      ln('VYASA', 'And Maya built the hall. Floors of crystal that looked like water. Pools of water so still they looked like floors. Pillars of gem and gold, doors that were walls, and walls that were doors.',
                  'और मय ने सभा बनाई। स्फटिक के फ़र्श जो पानी जैसे दिखते थे। पानी के कुंड इतने स्थिर कि फ़र्श जैसे दिखते। रत्नों और सोने के स्तंभ, द्वार जो दीवारें थे, और दीवारें जो द्वार थीं।')],
    [*MAYA(), fx('sparkle', n=80)],
    cam=pan(560, 1040, 470, 1.15), amb='temple', sfx=[dict(n='sparkle', at=1.0), dict(n='bells', at=6.0, v=0.3)], min=11),

  # ---------- the rule, Arjuna's wandering and Subhadra ----------
  S('c_rule', 'mystery', [
      ln('VYASA', 'Narada had warned the brothers early: two asura brothers, Sunda and Upasunda, had once loved each other more than life, and killed each other over a single woman. So the Pandavas made a rule. Draupadi would live with each brother in turn for a year. Whoever disturbed them would go into exile for twelve years.',
                  'नारद ने भाइयों को पहले ही चेताया था: सुंद और उपसुंद नाम के दो असुर भाई कभी एक दूसरे से प्राणों से भी अधिक प्रेम करते थे, और एक ही स्त्री के लिए एक दूसरे को मार बैठे। तो पांडवों ने एक नियम बनाया। द्रौपदी बारी बारी से एक वर्ष हर भाई के साथ रहेंगी। जो उनके एकांत में विघ्न डालेगा, वह बारह वर्ष के लिए वनवास जाएगा।')],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), face('narada', 800, 440, 190, 1, 'calm', rim=RIM_LAMP, glow=['#fff0c0', 20, 0.25])],
    cam=push(800, 450, 1.0, 1.14), amb='night'),
  S('c_brahmin', 'tension', [
      ln('VYASA', 'One night a brahmin came running to the palace. Thieves had stolen his cows. Arjuna\'s bow was in the room where Yudhishthira sat with Draupadi. He went in, took the bow, caught the thieves, and then went to his brother and asked for his punishment.',
                  'एक रात एक ब्राह्मण दौड़ता हुआ महल आया। चोरों ने उसकी गायें चुरा ली थीं। अर्जुन का धनुष उस कक्ष में था जहाँ युधिष्ठिर द्रौपदी के साथ बैठे थे। वे भीतर गए, धनुष लिया, चोरों को पकड़ा, और फिर भाई के पास जाकर अपना दंड माँगा।')],
    [sh(bg(set='forest', tod='night'), 'forest_night5'), figs('chase', [fig('arjuna', 620, 900, 600, 1, 'draw', weapon='bowDrawn')], rim=RIM_MOON), piece('cows', 'cow', x=1180, y=880, s=260, f=-1), fx('fireflies', n=40)],
    cam=push(840, 480, 1.04, 1.14), amb='night', sfx=[dict(n='hooves', at=1.0, v=0.4), dict(n='whoosh', at=10.0)]),
  S('c_wander', 'river', [
      ln('VYASA', 'Yudhishthira forgave him. Arjuna would not be forgiven. He left on a pilgrimage, to the source of the Ganga, to the eastern hills, to the southern sea. He married Ulupi, a princess of the Nagas, and Chitrangada, the warrior princess of Manipur.',
                  'युधिष्ठिर ने उन्हें क्षमा कर दिया। अर्जुन ने क्षमा स्वीकार नहीं की। वे तीर्थयात्रा पर निकल पड़े, गंगा के उद्गम तक, पूर्वी पहाड़ियों तक, दक्षिणी सागर तक। उन्होंने नागकन्या उलूपी से विवाह किया, और मणिपुर की योद्धा राजकुमारी चित्रांगदा से।')],
    [sh(bg(set='himalaya'), 'himal_peaks'), figs('pilgrim', [fig('arjuna', 800, 880, 300, 1, 'stand', style=POOR)]), fx('snow', n=40)],
    cam=[[800, 520, 1.25], [800, 470, 1.0]], amb='wind', min=10),
  S('c_sea', 'love', [
      ln('VYASA', 'He bathed in the sacred rivers and slept under strange stars. In the land of the Nagas, Ulupi pulled him down into the river and asked him to love her, and he did. In Manipur, Chitrangada met him with a sword in her hand, and he fell in love with her for it.',
                  'उन्होंने पवित्र नदियों में स्नान किया और अनजाने तारों के नीचे सोए। नागों के देश में उलूपी उन्हें नदी में खींच ले गईं और प्रेम माँगा, और उन्होंने दिया। मणिपुर में चित्रांगदा हाथ में तलवार लिए उनसे मिलीं, और इसी कारण वे उनसे प्रेम कर बैठे।')],
    [sh(bg(set='lake', tod='dusk'), 'lake_dusk5'), fx('ripples', x=800, y=780), fx('fireflies', n=40)],
    cam=[[800, 520, 1.0], [800, 600, 1.15]], amb='river', min=10),
  S('c_subhadra', 'love', [
      ln('VYASA', 'At last he came to Dwaraka, Krishna\'s city by the sea, and saw Krishna\'s sister Subhadra at a festival on the hill of Raivataka. Krishna saw his face, and laughed.',
                  'अंत में वे समुद्र किनारे कृष्ण की नगरी द्वारका पहुँचे, और रैवतक पर्वत के एक उत्सव में कृष्ण की बहन सुभद्रा को देखा। कृष्ण ने उनका चेहरा देखा, और हँस पड़े।'),
      ln('KRISHNA', 'My brother Balarama means to give her to Duryodhana. If you want her, cousin, do not ask. Take her in your chariot. I will deal with my brother.', 'मेरे भाई बलराम उसे दुर्योधन को देना चाहते हैं। यदि तुम उसे चाहते हो, भाई, तो माँगो मत। उसे अपने रथ में ले जाओ। अपने भाई को मैं सँभाल लूँगा।', gap=0.6)],
    [bg(set='river', tod='gold', hz=520), face('krishna', 1040, 440, 190, -1, 'smile', rim=RIM_GOLD, glow=KGLOW), fx('sparkle', y0=600, y1=900, n=40)],
    cam=push(1020, 450, 1.0, 1.14), amb='river', sfx=[dict(n='flute', at=0.5, v=0.4)]),
  S('c_elope', 'joy', [
      ln('VYASA', 'And so Arjuna carried off Subhadra, and she drove the chariot herself, faster than any charioteer in Dwaraka. Balarama raged, and then forgave them. Their son would be Abhimanyu.',
                  'और इस प्रकार अर्जुन सुभद्रा को ले गए, और रथ स्वयं सुभद्रा ने हाँका, द्वारका के किसी भी सारथी से तेज़। बलराम क्रोधित हुए, और फिर उन्हें क्षमा कर दिया। उनका पुत्र अभिमन्यु होगा।')],
    [sh(bg(set='valley', tod='gold', hz=480, city=[1250, 300], seed=0.6), 'valley_gold5'), piece('ch', 'warChariot', k='anim', every=2, x=300, y=860, s=0.6, rider='arjuna'), fx('dust', col='#f0c070', n=60)],
    cam=pan(560, 1040, 470, 1.15), amb='wind', sfx=[dict(n='hooves', at=0.3, v=0.7), dict(n='cheer', at=8.0, v=0.3)]),
  S('c_narada', 'divine', [
      ln('VYASA', 'The sage Narada came to the new hall, walking out of the sky with his veena. He told Yudhishthira that his father Pandu, in the world of the ancestors, wished one thing for his son.',
                  'ऋषि नारद अपनी वीणा लिए आकाश से उतरकर नई सभा में आए। उन्होंने युधिष्ठिर को बताया कि पितृलोक में उनके पिता पांडु अपने पुत्र के लिए एक ही चीज़ चाहते हैं।'),
      ln('NARADA', 'Perform the Rajasuya, son of Pandu. Become the king of kings.', 'राजसूय यज्ञ करो, पांडुपुत्र। राजाओं के राजा बनो।', gap=0.6)],
    [*MAYA(), face('narada', 800, 440, 190, 1, 'smile', rim=RIM_GOLD, glow=['#fff0c0', 26, 0.3])],
    cam=push(800, 450, 1.0, 1.14), amb='temple', sfx=[dict(n='flute', at=0.5, v=0.3)], hero=1, name=name('NARADA', 'नारद', 'wanderer of the worlds', 'त्रिलोक के यात्री', 1)),

  # ---------- Jarasandha ----------
  S('d_krishna', 'tension', [
      ln('KRISHNA', 'You cannot be king of kings while Jarasandha lives. He holds eighty-six kings in his dungeons, and means to sacrifice a hundred to Shiva. Seventeen times he attacked my city. I had to move my people to the sea.',
                    'जब तक जरासंध जीवित है, आप राजाओं के राजा नहीं बन सकते। उसने छियासी राजाओं को अपने कारागार में बंद कर रखा है, और सौ की शिव को बलि देना चाहता है। सत्रह बार उसने मेरे नगर पर आक्रमण किया। मुझे अपने लोगों को समुद्र किनारे ले जाना पड़ा।')],
    [*MAYA(), face('krishna', 1040, 440, 190, -1, 'stern', rim=RIM_MOON, glow=KGLOW)],
    cam=push(1020, 450, 1.0, 1.14), amb='court'),
  S('d_magadha', 'tension', [
      ln('VYASA', 'So Krishna, Bhima and Arjuna went to Magadha disguised as brahmins, and climbed in over the walls. Jarasandha received them with honour, until he saw the bowstring scars on their arms.',
                  'तो कृष्ण, भीम और अर्जुन ब्राह्मणों के वेश में मगध गए, और दीवारें लाँघकर भीतर पहुँचे। जरासंध ने उनका सम्मान से स्वागत किया, जब तक उसने उनकी बाँहों पर प्रत्यंचा के निशान नहीं देखे।')],
    [bg(set='city', tod='dusk', hz=600, col='#a07a6a'), figs('three', [fig('krishna', 520, 880, 440, 1, 'stand', style=POOR), fig('bhima', 760, 880, 480, 1, 'stand', style=POOR), fig('arjuna', 980, 880, 440, 1, 'stand', style=POOR)], rim=RIM_FIRE)],
    cam=pan(640, 960, 480, 1.12), amb='wind'),
  S('d_jara', 'kala', [
      ln('JARASANDHA', 'You are no brahmins. Name yourselves, or die.', 'तुम ब्राह्मण नहीं हो। अपना नाम बताओ, या मरो।', fx='growl'),
      ln('KRISHNA', 'I am Krishna, your old enemy. These are Bhima and Arjuna. Free the kings, or fight one of us, man to man.', 'मैं कृष्ण हूँ, तुम्हारा पुराना शत्रु। ये भीम और अर्जुन हैं। राजाओं को मुक्त करो, या हममें से एक से, आमने सामने लड़ो।', gap=0.6)],
    [bg(set='court', tone='#2a0a1a', throne=[800, 660, 240], canopy=1), face('jarasandha', 800, 440, 210, 1, 'cruel', rim=RIM_FIRE)],
    cam=push(800, 450, 1.0, 1.14), amb='court', hero=1, name=name('JARASANDHA', 'जरासंध', 'emperor of Magadha', 'मगध सम्राट', 1)),
  S('d_wrestle', 'battle', [
      ln('VYASA', 'He chose Bhima. They wrestled for fourteen days and nights without rest, without food. On the fourteenth night Jarasandha began to tire.',
                  'उसने भीम को चुना। वे चौदह दिन और रात बिना विश्राम, बिना भोजन के कुश्ती लड़ते रहे। चौदहवीं रात जरासंध थकने लगा।')],
    [bg(set='arena', tod='dusk'), figs('wr', [fig('bhima', 640, 900, 620, 1, 'charge'), fig('jarasandha', 960, 900, 640, -1, 'charge')], rim=RIM_FIRE), fx('dust', col='#c08a5a', n=100)],
    cam=push(800, 480, 1.04, 1.14), amb='battle', sfx=[dict(n='boom', at=2.0, v=0.5), dict(n='roar', at=5.0, v=0.5), dict(n='boom', at=8.0, v=0.5)], shake=[[2.0, 2.4], [8.0, 8.4]]),
  S('d_secret', 'mystery', [
      ln('VYASA', 'Jarasandha had been born in two halves, from two mothers, and joined together by a demoness named Jara. Every time Bhima tore him apart, the halves joined again. Then Krishna picked up a blade of grass, split it in two, and threw the halves in opposite directions.',
                  'जरासंध दो आधे भागों में, दो माताओं से जन्मा था, और जरा नाम की एक राक्षसी ने उसे जोड़ा था। हर बार जब भीम उसे चीरते, आधे भाग फिर जुड़ जाते। तब कृष्ण ने घास का एक तिनका उठाया, उसे दो भागों में चीरा, और दोनों भाग विपरीत दिशाओं में फेंक दिए।')],
    [bg(set='arena', tod='night'), face('krishna', 800, 450, 200, 1, 'smile', rim=RIM_MOON, glow=KGLOW), fx('stars', n=50)],
    cam=push(800, 460, 1.04, 1.2), amb='night', sfx=[dict(n='heartbeat', at=1.0, v=0.4), dict(n='crack', at=16.0, v=0.4)]),
  S('d_free', 'joy', [
      ln('VYASA', 'Bhima understood. And that was the end of Jarasandha. The eighty-six kings walked out of the dungeons into the sunlight, and bowed to Yudhishthira as their emperor.',
                  'भीम समझ गए। और वह जरासंध का अंत था। छियासी राजा कारागार से निकलकर धूप में आए, और युधिष्ठिर को अपना सम्राट मानकर प्रणाम किया।')],
    [sh(bg(set='valley', tod='dawn', hz=470, city=[1200, 260], seed=0.0), 'valley_dawn'), piece('kings', 'procession', k='anim', every=3, y=820, s=100, x0=-300, cnt=10, speed=35), fx('rays', x=1200, y=200, r0=60, r1=1000, col='#fff0c0')],
    cam=pan(560, 1040, 460, 1.15), amb='birds', sfx=[dict(n='conch', at=1.0, v=0.5), dict(n='cheer', at=4.0, v=0.4)]),

  # ---------- the conquest of the four directions ----------
  S('e_four', 'march', [
      ln('VYASA', 'Then the four brothers rode out in four directions. Arjuna went north, past the Himalaya, to the land of the Uttara Kurus. Bhima went east. Sahadeva went south, to the sea. Nakula went west. Every king paid tribute, or fought and lost.',
                  'फिर चारों भाई चारों दिशाओं में निकले। अर्जुन उत्तर गए, हिमालय के पार, उत्तर कुरुओं के देश तक। भीम पूर्व गए। सहदेव दक्षिण, समुद्र तक। नकुल पश्चिम। हर राजा ने कर दिया, या लड़कर हारा।')],
    [sh(bg(set='himalaya'), 'himal_peaks'), piece('r1', 'riders', k='anim', every=2, x=200, y=830, s=110, cnt=6, speed=70), fx('snow', n=60)],
    cam=[[800, 520, 1.25], [800, 460, 1.0]], amb='wind', sfx=[dict(n='hooves', at=0.3, v=0.6), dict(n='conch', at=6.0, v=0.4)], min=10),
  S('e_south', 'march', [], [bg(set='river', tod='gold', hz=520), piece('r2', 'riders', k='anim', every=2, x=200, y=840, s=110, cnt=5, speed=70), fx('sparkle', y0=600, y1=900, n=40)],
    cam=pan(560, 1040, 470, 1.12), amb='river', sfx=[dict(n='hooves', at=0.3, v=0.6)], min=6),
  S('e_tribute', 'joy', [
      ln('VYASA', 'Tribute poured into Indraprastha. Horses from the north, elephants from the east, pearls from the southern sea, and gold dust carried by ants, some said, from the mountains beyond the world.',
                  'इंद्रप्रस्थ में कर की बाढ़ आ गई। उत्तर से घोड़े, पूर्व से हाथी, दक्षिणी सागर से मोती, और कुछ कहते थे, संसार के पार के पर्वतों से चींटियों द्वारा लाया गया सोने का चूर्ण।')],
    [sh(bg(set='city', tod='gold', ghats=1, col='#f0e6d0'), 'indra_city'), piece('trib', 'procession', k='anim', every=3, y=820, s=110, x0=-300, cnt=11, speed=40)],
    cam=pan(600, 1000, 450, 1.12), amb='crowd', sfx=[dict(n='nagara', at=0.4, v=0.5), dict(n='bells', at=3.0, v=0.4)]),
  S('e_karna', 'tension', [
      ln('VYASA', 'In Hastinapura, Karna listened to the news of each new conquest, and said nothing. Then he too rode out, alone, and made his own conquest of the world for Duryodhana, as if to say: there are two emperors in Bharata, and the other one is mine.',
                  'हस्तिनापुर में कर्ण हर नई विजय का समाचार सुनते रहे, और कुछ नहीं बोले। फिर वे भी अकेले निकल पड़े, और दुर्योधन के लिए अपनी दिग्विजय की, जैसे कहना चाहते हों: भारत में दो सम्राट हैं, और दूसरा मेरा है।')],
    [sh(bg(set='valley', tod='dusk', hz=450, seed=2.1), 'valley_dusk5'), face('karna', 800, 450, 200, 1, 'stern', rim=RIM_FIRE, glow=['#ffd080', 22, 0.25])],
    cam=push(800, 450, 1.0, 1.14), amb='wind'),

  # ---------- the Rajasuya ----------
  S('f_yajna', 'divine', [
      ln('VYASA', 'The Rajasuya began. Every king of Bharata came to Indraprastha. Bhishma and Drona came, and Duryodhana and his brothers, and Karna. Even I came, to sit among the priests.',
                  'राजसूय यज्ञ आरंभ हुआ। भारत का हर राजा इंद्रप्रस्थ आया। भीष्म और द्रोण आए, और दुर्योधन और उसके भाई, और कर्ण। मैं भी आया, पुरोहितों के बीच बैठने।')],
    [sh(bg(set='void', base='#2a0608', mandala=300, my=440, col='#ffb060'), 'void_fire'), fx('fire', at=[[800, 860, 300, 360]], n=60), fx('embers', n=60)],
    cam=push(800, 500, 1.0, 1.14), amb='temple', sfx=[dict(n='om', at=0.5, v=0.5), dict(n='bell', at=4.0), dict(n='conch', at=8.0, v=0.4)]),
  S('f_duryo', 'tension', [
      ln('VYASA', 'Yudhishthira gave Duryodhana the duty of receiving the gifts. All day he stood and watched the wealth of the world pour into his cousin\'s treasury. He smiled, and thanked every king. And something in him curdled.',
                  'युधिष्ठिर ने दुर्योधन को उपहार ग्रहण करने का कार्य दिया। पूरे दिन वह खड़ा रहा और संसार का धन अपने भाई के कोष में बहते देखता रहा। वह मुस्कुराया, और हर राजा को धन्यवाद दिया। और उसके भीतर कुछ खट्टा हो गया।')],
    [*MAYA(), face('duryo', 560, 440, 190, 1, 'sorrow', rim=RIM_GOLD)],
    cam=push(580, 450, 1.04, 1.16), amb='court'),
  S('f_gifts', 'wonder', [
      ln('VYASA', 'They brought blankets woven from the hair of mountain goats, and cloth so fine it could be drawn through a ring. Swords from the west, horses from the north as swift as thought, sandalwood, saffron, and cups of gold so many that the servants stopped counting.',
                  'वे पहाड़ी बकरियों के बालों से बुने कंबल लाए, और ऐसा महीन वस्त्र जो अँगूठी में से निकल जाए। पश्चिम से तलवारें, उत्तर से विचार जितने तेज़ घोड़े, चंदन, केसर, और इतने सोने के प्याले कि सेवकों ने गिनना छोड़ दिया।')],
    [*MAYA(), piece('trib', 'procession', k='anim', every=3, y=840, s=90, x0=-300, cnt=9, speed=35), fx('sparkle', n=60)],
    cam=pan(560, 1040, 470, 1.1), amb='crowd', sfx=[dict(n='bells', at=1.0, v=0.3)]),
  S('f_honour', 'krishna', [
      ln('VYASA', 'Then came the moment of the first honour, the agra-puja, given to the greatest guest. Yudhishthira asked Bhishma who it should be.',
                  'फिर प्रथम पूजा, अग्रपूजा का क्षण आया, जो सबसे श्रेष्ठ अतिथि को दी जाती है। युधिष्ठिर ने भीष्म से पूछा कि वह किसे मिले।'),
      ln('BHISHMA', 'Krishna. As the sun is among the lights of the sky, so is he among all who are gathered here.', 'कृष्ण। जैसे आकाश के प्रकाशों में सूर्य है, वैसे ही यहाँ एकत्र सबमें वे हैं।', fx='elder', gap=0.6)],
    [*MAYA(), figs('puja', [fig('yudhi', 620, 880, 540, 1, 'bless'), fig('krishna', 980, 880, 540, -1, 'stand')], rim=RIM_GOLD), fx('petals', every=2, n=60)],
    cam=push(800, 470, 1.04, 1.12), amb='temple', sfx=[dict(n='bell', at=0.5), dict(n='conch', at=12.0, v=0.4)]),

  # ---------- Shishupala ----------
  S('g_shishu', 'kala', [
      ln('SHISHUPALA', 'Krishna? A cowherd! A man who never sat on a throne, who ran from Jarasandha, who stole butter as a boy and other men\'s brides as a man. Is this your king of guests, Yudhishthira? Then this whole sacrifice is a farce!',
                       'कृष्ण? एक ग्वाला! जो कभी सिंहासन पर नहीं बैठा, जो जरासंध से भागा, जो बचपन में मक्खन और जवानी में दूसरों की दुल्हनें चुराता रहा। क्या यही तुम्हारा अतिथि श्रेष्ठ है, युधिष्ठिर? तो यह पूरा यज्ञ एक तमाशा है!', fx='growl')],
    [*MAYA(), face('shishupala', 560, 440, 190, 1, 'anger', rim=RIM_FIRE)],
    cam=push(580, 450, 1.04, 1.18), amb='court', sfx=[dict(n='gasp', at=2.0, v=0.4)], hero=1, name=name('SHISHUPALA', 'शिशुपाल', 'king of Chedi', 'चेदि नरेश', 1)),
  S('g_vow', 'mystery', [
      ln('VYASA', 'Krishna said nothing. Long before, he had promised Shishupala\'s mother, his own aunt, that he would forgive her son a hundred insults. He was counting.',
                  'कृष्ण कुछ नहीं बोले। बहुत पहले उन्होंने शिशुपाल की माँ, अपनी बुआ, को वचन दिया था कि वे उसके पुत्र के सौ अपमान क्षमा करेंगे। वे गिन रहे थे।')],
    [*MAYA(), face('krishna', 1040, 440, 190, -1, 'calm', rim=RIM_MOON, glow=KGLOW)],
    cam=push(1020, 450, 1.04, 1.18), amb='court', sfx=[dict(n='heartbeat', at=1.0, v=0.4)]),
  S('g_insults', 'kala', [
      ln('SHISHUPALA', 'Coward! Cowherd! Thief! Liar!', 'कायर! ग्वाला! चोर! झूठा!', fx='growl'),
      ln('VYASA', 'Ninety-eight. Ninety-nine. A hundred.', 'अट्ठानवे। निन्यानवे। सौ।', gap=0.5),
      ln('SHISHUPALA', 'And a fool!', 'और मूर्ख!', fx='growl', gap=0.3)],
    [*MAYA(), face('shishupala', 800, 440, 210, 1, 'anger', rim=RIM_FIRE), fx('embers', n=50)],
    cam=push(800, 450, 1.1, 1.3), amb='court', sfx=[dict(n='drumroll', at=2.0)]),
  S('g_chakra', 'vishva', [
      ln('VYASA', 'The discus rose from Krishna\'s finger, spinning, singing, blazing like a second sun. And the head of Shishupala fell to the crystal floor. A light rose from his body, and entered Krishna, and was gone.',
                  'कृष्ण की उँगली से चक्र उठा, घूमता हुआ, गाता हुआ, दूसरे सूर्य की तरह धधकता हुआ। और शिशुपाल का सिर स्फटिक के फ़र्श पर गिरा। उसके शरीर से एक ज्योति उठी, और कृष्ण में समा गई, और लुप्त हो गई।')],
    [*MAYA(), fx('wheel', x=800, y=420, r=240, col='#ffe08a'), fx('rays', x=800, y=420, r0=120, r1=900, col='#fff0c0', spin=4), fx('flash', every=1, at=[5.0])],
    cam=push(800, 440, 1.0, 1.2), amb='temple', sfx=[dict(n='whoosh', at=1.0), dict(n='crack', at=5.0, v=0.7), dict(n='om', at=8.0, v=0.5)], shake=[[5.0, 5.5]]),
  S('g_finger', 'love', [
      ln('VYASA', 'The discus had cut Krishna\'s finger as it returned. Some who tell this story say that Draupadi tore a strip from the edge of her own sari and bound his finger with it. And Krishna looked at the cloth, and said he would repay every thread.',
                  'लौटते समय चक्र ने कृष्ण की उँगली काट दी थी। इस कथा को कहने वाले कुछ लोग कहते हैं कि द्रौपदी ने अपनी साड़ी के किनारे से एक पट्टी फाड़ी और उनकी उँगली पर बाँध दी। और कृष्ण ने उस कपड़े को देखा, और कहा कि वे उसके हर धागे का ऋण चुकाएँगे।')],
    [*MAYA(), face('draupadi', 560, 440, 180, 1, 'calm', n='dr', rim=RIM_GOLD), face('krishna', 1060, 440, 180, -1, 'smile', n='kr', rim=RIM_MOON, glow=KGLOW)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='temple', sfx=[dict(n='flute', at=12.0, v=0.4)]),
  S('g_cave', 'mystery', [
      ln('GANESHA', 'He killed a guest, at a sacrifice.', 'उन्होंने एक यज्ञ में एक अतिथि का वध कर दिया।'),
      ln('VYASAC', 'He kept a promise for a hundred insults, scribe. Then he kept another one, older than that. Shishupala was a gatekeeper of Vishnu, cursed to be born three times as his enemy. That was his last birth. Now he is free.',
                   'उन्होंने सौ अपमानों तक एक वचन निभाया, लेखक। फिर उससे भी पुराना एक और। शिशुपाल विष्णु का एक द्वारपाल था, जिसे तीन बार उनके शत्रु के रूप में जन्म लेने का शाप था। वह उसका अंतिम जन्म था। अब वह मुक्त है।', gap=0.8)],
    CAVE(), cam=CAVE_CAM['vy'], amb='night'),

  # ---------- the fall in the hall ----------
  S('g_prophecy', 'kala', [
      ln('VYASA', 'When the guests had gone, I stayed behind with Yudhishthira. I told him what I had seen. In thirteen years, I said, because of you, and because of Duryodhana, the warriors of this earth will be destroyed. Bhima and Arjuna will be the instruments.',
                  'जब अतिथि चले गए, मैं युधिष्ठिर के साथ रुका। मैंने उन्हें बताया कि मैंने क्या देखा था। तेरह वर्षों में, मैंने कहा, तुम्हारे कारण, और दुर्योधन के कारण, इस पृथ्वी के योद्धा नष्ट हो जाएँगे। भीम और अर्जुन उसके साधन होंगे।')],
    [*MAYA(), figs('vy', [fig('vyasa', 620, 880, 540, 1, 'bless'), fig('yudhi', 980, 880, 540, -1, 'stand')], rim=RIM_LAMP)],
    cam=push(800, 470, 1.04, 1.12), amb='night', sfx=[dict(n='gong', at=14.0, v=0.4)]),
  S('g_yvow', 'sorrow', [
      ln('YUDHI', 'Then I make a vow, grandfather. For thirteen years I will never speak a harsh word to anyone. I will never refuse my elders. I will never give anyone a reason to quarrel with me.',
                  'तो मैं एक प्रतिज्ञा करता हूँ, पितामह। तेरह वर्षों तक मैं किसी से कठोर शब्द नहीं कहूँगा। मैं अपने बड़ों को कभी मना नहीं करूँगा। मैं किसी को मुझसे झगड़ने का कारण नहीं दूँगा।'),
      ln('VYASAC', 'He thought that vow would save them, scribe. It was the very thing that would deliver him to the dice.', 'उन्होंने सोचा था कि वह प्रतिज्ञा उन्हें बचाएगी, लेखक। वही उन्हें पासों तक ले गई।', gap=0.8)],
    [*MAYA(), face('yudhi', 800, 450, 200, 1, 'sorrow', rim=RIM_LAMP)],
    cam=push(800, 450, 1.04, 1.16), amb='night'),
  S('h_walk', 'mystery', [
      ln('VYASA', 'After the sacrifice, Duryodhana stayed on, to see the wonders of Maya\'s hall. He came to a crystal floor, thought it was water, and lifted his robe to wade. People smiled.',
                  'यज्ञ के बाद दुर्योधन मय की सभा के चमत्कार देखने रुका रहा। वह एक स्फटिक के फ़र्श पर पहुँचा, उसे पानी समझा, और पार करने के लिए अपना वस्त्र उठा लिया। लोग मुस्कुराए।')],
    [*MAYA(), figs('dw', [fig('duryo', 800, 900, 560, 1, 'stand')], rim=RIM_GOLD)],
    cam=push(800, 500, 1.04, 1.14), amb='temple'),
  S('h_splash', 'tension', [
      ln('VYASA', 'Then he came to a pool, thought it was a floor, and walked straight into it.', 'फिर वह एक कुंड पर पहुँचा, उसे फ़र्श समझा, और सीधे उसमें चला गया।')],
    [*MAYA(), fx('ripples', x=800, y=780, r=500, n=8), fx('sparkle', y0=650, y1=900, n=60)],
    cam=push(800, 700, 1.2, 1.4), amb='temple', sfx=[dict(n='splash', at=4.2, v=0.8), dict(n='crowdlaugh', at=5.0, v=0.7)]),
  S('h_laugh', 'kala', [
      ln('VYASA', 'Bhima laughed. The servants laughed. Arjuna and the twins laughed. And some who tell this story say that a voice from the balcony laughed too, and said that the son of a blind man is blind.',
                  'भीम हँसे। सेवक हँसे। अर्जुन और जुड़वाँ भाई हँसे। और इस कथा को कहने वाले कुछ लोग कहते हैं कि झरोखे से एक स्वर भी हँसा, और कहा कि अंधे का पुत्र अंधा ही होता है।')],
    [*MAYA(), face('bhima', 560, 450, 180, 1, 'smile', n='bh', rim=RIM_GOLD), face('draupadi', 1080, 430, 170, -1, 'smile', n='dr', rim=RIM_GOLD)],
    cam=[[640, 450, 1.1], [960, 440, 1.12]], amb='temple', sfx=[dict(n='crowdlaugh', at=0.5, v=0.6)]),
  S('h_wound', 'kala', [
      ln('DURYO', 'They laughed at me. In their hall, built with the gold of my kingdom, they laughed at me, dripping, in front of their servants. I will never forget it. Never.',
                  'वे मुझ पर हँसे। अपनी सभा में, मेरे राज्य के सोने से बनी सभा में, वे मुझ पर हँसे, जब मैं भीगा हुआ था, अपने सेवकों के सामने। मैं इसे कभी नहीं भूलूँगा। कभी नहीं।', fx='growl')],
    [bg(set='dark', base='#140608', glow='#4a1010'), face('duryo', 800, 440, 210, 1, 'anger', rim=RIM_FIRE), fx('embers', n=60)],
    cam=push(800, 450, 1.04, 1.22), amb='night', sfx=[dict(n='heartbeat', at=0.5, v=0.5), dict(n='rumble', at=8.0, v=0.4)]),

  # ---------- the plot of the dice ----------
  S('h_ride', 'sorrow', [
      ln('VYASA', 'Duryodhana rode home to Hastinapura with his uncle Shakuni beside him. For the whole journey he did not say a word. He only stared at the road, and saw the gold of Indraprastha, and heard the laughter.',
                  'दुर्योधन अपने मामा शकुनि के साथ हस्तिनापुर लौटा। पूरी यात्रा में उसने एक शब्द नहीं कहा। वह बस मार्ग को घूरता रहा, और इंद्रप्रस्थ का सोना देखता रहा, और वह हँसी सुनता रहा।')],
    [sh(bg(set='valley', tod='dusk', hz=450, seed=2.1), 'valley_dusk5'), piece('ch', 'warChariot', k='anim', every=2, x=300, y=860, s=0.55, rider='duryo'), fx('dust', col='#e08050', n=50)],
    cam=pan(560, 1000, 470, 1.15), amb='wind', sfx=[dict(n='hooves', at=0.3, v=0.5)], min=9),
  S('i_shakuni', 'tension', [
      ln('SHAKUNI', 'Why fight them, nephew, when you can simply take it all? Yudhishthira loves dice, and plays badly. I never lose. Invite him to a friendly game. A king cannot refuse a challenge.',
                    'उनसे लड़ना क्यों, भांजे, जब तुम सब कुछ बस ले सकते हो? युधिष्ठिर को पासे प्रिय हैं, और वह बुरा खेलता है। मैं कभी नहीं हारता। उसे एक मित्रतापूर्ण खेल का निमंत्रण दो। राजा चुनौती ठुकरा नहीं सकता।')],
    [sh(bg(set='chamber', tone='#2a1a10'), 'chamber_dark'), face('shakuni', 800, 450, 200, 1, 'cruel', rim=RIM_LAMP), piece('dice', 'diceFloat', k='anim', every=2, x=1180, y=600)],
    cam=push(800, 450, 1.0, 1.14), amb='night', sfx=[dict(n='dice', at=3.0, v=0.5)], hero=1, name=name('SHAKUNI', 'शकुनि', 'prince of Gandhara', 'गांधार के राजकुमार', 1)),
  S('i_dhrita', 'tension', [
      ln('VYASA', 'Dhritarashtra hesitated. Vidura begged him not to. Bhishma warned him. But Duryodhana stopped eating, and stopped sleeping, and grew thin and pale, and the blind king could not bear it.',
                  'धृतराष्ट्र हिचकिचाए। विदुर ने उनसे विनती की कि ऐसा न करें। भीष्म ने चेतावनी दी। पर दुर्योधन ने खाना छोड़ दिया, सोना छोड़ दिया, और दुबला और पीला पड़ गया, और अंधे राजा से यह सहा न गया।')],
    [sh(bg(set='court', tone='#3a1210', throne=[800, 660, 260], canopy=1), 'court_dark'), face('dhrita', 1040, 450, 190, -1, 'sorrow', rim=RIM_GOLD)],
    cam=push(1020, 450, 1.04, 1.14), amb='court'),
  S('i_hall', 'court', [
      ln('VYASA', 'He built a new hall in Hastinapura, a hall of a thousand pillars, and sent Vidura himself to invite his nephew to a game.', 'उन्होंने हस्तिनापुर में एक नई सभा बनवाई, हज़ार स्तंभों वाली सभा, और स्वयं विदुर को अपने भतीजे को खेल का निमंत्रण देने भेजा।')],
    [DICE_HALL(), piece('board', 'diceBoard', d=1.0)],
    cam=[[800, 600, 1.3], [800, 460, 1.0]], amb='court', min=10),
  S('i_road', 'sorrow', [
      ln('VYASA', 'Vidura drove the road from Hastinapura to Indraprastha with a heavy heart. The fields were green and the river was full, and all the way he thought: this is the last time I will see this land at peace.',
                  'विदुर भारी मन से हस्तिनापुर से इंद्रप्रस्थ का मार्ग चले। खेत हरे थे और नदी भरी थी, और पूरे रास्ते वे सोचते रहे: यह अंतिम बार है जब मैं इस भूमि को शांत देख रहा हूँ।')],
    [sh(bg(set='valley', tod='gold', hz=480, city=[1250, 300], seed=0.6), 'valley_gold5'), piece('ch', 'warChariot', k='anim', every=2, x=300, y=860, s=0.5, rider='vidura'), fx('dust', col='#f0c070', n=40)],
    cam=pan(560, 1040, 470, 1.12), amb='birds', sfx=[dict(n='hooves', at=0.3, v=0.4)], min=10),
  S('i_yudhi', 'sorrow', [
      ln('VIDURA', 'I bring an invitation, and a warning. They have set a trap, and Shakuni is the bait.', 'मैं एक निमंत्रण लाया हूँ, और एक चेतावनी। उन्होंने एक जाल बिछाया है, और शकुनि उसका चारा है।', fx='elder'),
      ln('YUDHI', 'I know, uncle. But my uncle the king has asked. A kshatriya does not refuse a challenge to battle, or to dice. I will go.', 'मैं जानता हूँ, काका। पर मेरे ज्येष्ठ पिता राजा ने बुलाया है। क्षत्रिय युद्ध या द्यूत की चुनौती ठुकराता नहीं। मैं जाऊँगा।', gap=0.6)],
    [*MAYA(), face('vidura', 560, 450, 180, 1, 'stern', n='vi', rim=RIM_GOLD), face('yudhi', 1080, 450, 180, -1, 'sorrow', n='yu', rim=RIM_GOLD)],
    cam=[[680, 450, 1.1], [920, 450, 1.05]], amb='court'),
  S('i_arrive', 'court', [
      ln('VYASA', 'So the Pandavas came to Hastinapura with Draupadi and their mother. Dhritarashtra embraced them. Gandhari held Draupadi\'s hands in her own and blessed her. They slept that night in the palace where they had been children. In the morning, they went to the hall.',
                  'तो पांडव द्रौपदी और अपनी माता के साथ हस्तिनापुर आए। धृतराष्ट्र ने उन्हें गले लगाया। गांधारी ने द्रौपदी के हाथ अपने हाथों में लेकर आशीर्वाद दिया। उस रात वे उसी महल में सोए जहाँ वे बच्चे थे। सुबह वे सभा में गए।')],
    [sh(bg(set='palace', tod='dusk', x=300, w=1000, h=600), 'hastina_dusk5'), figs('arrive', [fig('yudhi', 560, 880, 420, 1, 'stand'), fig('bhima', 740, 880, 460, 1, 'stand'), fig('arjuna', 920, 880, 420, 1, 'stand')], rim=RIM_FIRE), fx('fireflies', n=30)],
    cam=[[800, 520, 1.15], [800, 470, 1.0]], amb='night', min=10),

  # ---------- the game ----------
  S('j_begin', 'dice', [
      ln('VYASA', 'The hall was full. Bhishma, Drona, Kripa, Vidura, the blind king, and all the Kauravas. Shakuni sat down across the board with his ivory dice, and smiled.',
                  'सभा भरी थी। भीष्म, द्रोण, कृप, विदुर, अंधे राजा, और सारे कौरव। शकुनि अपने हाथीदाँत के पासों के साथ बिसात के उस पार बैठा, और मुस्कुराया।')],
    [DICE_HALL(), piece('board', 'diceBoard', d=1.0), figs('players', [fig('shakuni', 360, 880, 560, 1, 'dice'), fig('yudhi', 1240, 880, 560, -1, 'dice')], rim=RIM_LAMP)],
    cam=push(800, 500, 1.0, 1.1), amb='court', sfx=[dict(n='dice', at=6.0)]),
  S('j_stakes', 'dice', [
      ln('YUDHI', 'I stake this necklace of pearls.', 'मैं यह मोतियों का हार दाँव पर लगाता हूँ।'),
      ln('SHAKUNI', 'Won!', 'जीता!', gap=1.6),
      ln('YUDHI', 'A thousand jars of gold.', 'सोने के हज़ार घड़े।', gap=0.6),
      ln('SHAKUNI', 'Won!', 'जीता!', gap=1.6),
      ln('YUDHI', 'My chariots. My horses. My elephants.', 'मेरे रथ। मेरे घोड़े। मेरे हाथी।', gap=0.6),
      ln('SHAKUNI', 'Won!', 'जीता!', gap=1.6)],
    [DICE_HALL(), piece('board', 'diceBoard', d=1.0), piece('dice', 'diceRoll', k='anim', every=1, times=[1.0, 5.0, 9.0, 13.0])],
    cam=push(800, 640, 1.2, 1.35), amb='court', sfx=[dict(n='dice', at=1.0), dict(n='dice', at=5.0), dict(n='dice', at=9.0), dict(n='dice', at=13.0)]),
  S('j_kingdom', 'kala', [
      ln('VYASA', 'He staked his treasury, and lost it. His army, and lost it. His kingdom, Indraprastha itself, every city and village and field. Lost.',
                  'उन्होंने अपना कोष दाँव पर लगाया, और हार गए। अपनी सेना, और हार गए। अपना राज्य, स्वयं इंद्रप्रस्थ, हर नगर और गाँव और खेत। हार गए।')],
    [sh(bg(set='city', tod='gold', ghats=1, col='#f0e6d0'), 'indra_city'), fx('dust', col='#6a6a6a', n=60)],
    cam=[[800, 460, 1.0], [800, 600, 1.4]], amb='wind', sfx=[dict(n='gong', at=10.0, v=0.5)]),
  S('j_vidura', 'tension', [
      ln('VIDURA', 'King, stop this! Your son is a jackal in the house. This game is the door through which death will enter the Kurus. Stop it now, while there is something left!',
                   'राजन, इसे रोकिए! आपका पुत्र घर में एक सियार है। यह खेल वह द्वार है जिससे कुरुओं में मृत्यु प्रवेश करेगी। अभी रोकिए, जब तक कुछ बचा है!', fx='elder'),
      ln('DURYO', 'Uncle Vidura always praises our enemies. Be quiet, slave-born.', 'काका विदुर सदा हमारे शत्रुओं की प्रशंसा करते हैं। चुप रहो, दासीपुत्र।', fx='growl', gap=0.6)],
    [DICE_HALL(), face('vidura', 560, 450, 190, 1, 'anger', n='vi', rim=RIM_LAMP), face('duryo', 1080, 440, 180, -1, 'cruel', n='du', rim=RIM_FIRE)],
    cam=[[640, 450, 1.1], [960, 450, 1.1]], amb='court'),
  S('j_brothers', 'kala', [
      ln('VYASA', 'And Yudhishthira, who had nothing left, staked his brothers. Nakula first, the youngest. Then Sahadeva. Then Arjuna. Then Bhima. One by one, each roll of the dice, the sons of the gods became slaves.',
                  'और युधिष्ठिर ने, जिनके पास कुछ नहीं बचा था, अपने भाइयों को दाँव पर लगाया। पहले नकुल, सबसे छोटे। फिर सहदेव। फिर अर्जुन। फिर भीम। एक एक कर, हर पासे के साथ, देवताओं के पुत्र दास बन गए।')],
    [DICE_HALL(), piece('board', 'diceBoard', d=1.0), piece('dice2', 'diceRoll', k='anim', every=1, times=[3.0, 7.0, 11.0, 15.0]), fx('embers', n=40)],
    cam=push(800, 640, 1.2, 1.45), amb='court', sfx=[dict(n='dice', at=3.0), dict(n='dice', at=7.0), dict(n='dice', at=11.0), dict(n='dice', at=15.0), dict(n='gong', at=17.0, v=0.5)]),
  S('j_himself', 'kala', [
      ln('YUDHI', 'I stake myself.', 'मैं स्वयं को दाँव पर लगाता हूँ।'),
      ln('SHAKUNI', 'Won!', 'जीता!', gap=2.0),
      ln('VYASA', 'The hall was silent. And then Shakuni leaned forward, very gently.', 'सभा में सन्नाटा था। और तब शकुनि बहुत धीरे से आगे झुका।', gap=1.0)],
    [DICE_HALL(), face('yudhi', 800, 450, 200, 1, 'sorrow', rim=RIM_LAMP)],
    cam=push(800, 450, 1.05, 1.25), amb='court', sfx=[dict(n='dice', at=2.5), dict(n='heartbeat', at=5.0, v=0.5)]),
  S('j_draupadi', 'kala', [
      ln('SHAKUNI', 'You still have one jewel left, king. The princess of Panchala. Stake Draupadi, and win everything back.', 'आपके पास अभी एक रत्न बचा है, राजन। पांचाल की राजकुमारी। द्रौपदी को दाँव पर लगाइए, और सब कुछ वापस जीत लीजिए।')],
    [DICE_HALL(), face('shakuni', 800, 450, 210, 1, 'cruel', rim=RIM_LAMP), piece('dice', 'diceFloat', k='anim', every=2, x=1180, y=600)],
    cam=push(800, 450, 1.1, 1.3), amb='court', sfx=[dict(n='heartbeat', at=0.5, v=0.5)]),
  S('j_staked', 'kala', [
      ln('YUDHI', 'I stake Draupadi.', 'मैं द्रौपदी को दाँव पर लगाता हूँ।'),
      ln('VYASA', 'The old men of the Kurus covered their faces. Bhishma, Drona, Vidura. And the dice fell.', 'कुरुओं के वृद्धों ने अपने मुख ढँक लिए। भीष्म, द्रोण, विदुर। और पासे गिरे।', gap=1.2)],
    [DICE_HALL(), piece('diceFall', 'diceFall', k='anim', every=1, add=False)],
    cam=push(800, 640, 1.3, 1.5), amb='court', sfx=[dict(n='gasp', at=2.0, v=0.6), dict(n='dice', at=9.0), dict(n='gong', at=10.0, v=0.8)], shake=[[10.0, 10.6]]),
  S('j_cave', 'mystery', [
      ln('GANESHA', 'Muni, my hand is shaking.', 'मुनिवर, मेरा हाथ काँप रहा है।'),
      ln('VYASAC', 'So did mine, when I first saw it. Rest now. Tomorrow you will write the darkest day of the Kurus, and a question that no one in that hall could answer.',
                   'मेरा भी काँपा था, जब मैंने इसे पहली बार देखा। अब विश्राम करो। कल तुम कुरुओं का सबसे अंधकारमय दिन लिखोगे, और एक प्रश्न जिसका उत्तर उस सभा में कोई नहीं दे सका।', gap=0.8)],
    CAVE(), cam=[[800, 470, 1.05], [800, 520, 1.3]], amb='night', tout='fade', min=12),
  ])
