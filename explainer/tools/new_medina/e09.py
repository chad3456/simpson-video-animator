"""Episode 9: "The Referendum" (book chapter 8: The Referendum on Pakistan)."""
from common import *

SLUG = "new-medina-e09-the-referendum"
seq = []

# ---------------- cold open ----------------
seq.append({"type": "card", "id": "open", "style": "intertitle", "lines": ["Bareilly.", "20 November 1945."], "sub": "AN ELECTION MEETING", "dur": 5.0, "sfx": "type"})

seq.append(scene("bareilly", {"kind": "room", "pal": "archive"}, [
    doc("d", 420, 320, "WHAT I SAW", "Manzoor Numani, eyewitness, Bareilly 1945 (substance)",
        ["Shoes waved, hockey sticks raised.", "Men in sherwanis, college-educated,", "howling like a mob.", "The gas lamps smashed.", "Then stones, from the road-builders' piles."],
        0, 0.4, w=500, rot=-1.2, cps=26, sfx="type", vol=0.4, hl=4, hlOn=0, keys={"1": {"hlOn": 1, "d": 1.0, "t": 0.6}}),
    label("l1", 930, 300, "the speaker:", 1, 3.0, color="#e8cfa0", size=18),
    label("l2", 930, 340, "Husain Ahmad Madani", 1, 4.2, color=GOLD, size=24),
    label("l3", 930, 380, "fifteen years a teacher of hadith in Medina", 2, 0.6, color="#e8cfa0", size=17),
    cite("Numani, Ilekshani Jihad aur Uske Hathyar (Delhi, n.d.); via Dhulipala, ch. 8", 0, 0.6),
], [
    L("On a November evening in 1945, a Deobandi scholar named Manzoor Numani stood at the edge of an election meeting in Bareilly and watched it being destroyed. Shoes were waved in the air, hockey sticks raised. Young men in fine sherwanis, plainly educated, howled like a mob."),
    L("Then someone smashed the gas lamps. In the darkness, men climbed onto piles of stones left for road-building, and the stones began to rain down on the stage."),
    L("The man on that stage had taught the Prophet's sayings in Medina for fifteen years. His name was Husain Ahmad Madani. The crowd stoning him was shouting for a new Medina."),
    beat(1.6, "heart"),
], cam={"zoom": [1.08, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append({"type": "card", "id": "title", "style": "titlex", "kicker": "A LUMEN DOCUMENTARY IN TEN PARTS", "title": SERIES,
            "sub": "Episode 9 · The Referendum", "by": "after the book by Venkat Dhulipala (2015)", "dur": 7.0, "sfx": "boom"})

# ---------------- chapter 1 ----------------
seq.append(chapter("ch1", 1, "A House Divided", "Lucknow · 1944 – 1945", color=AMBER))

seq.append(scene("wavell", "void", [
    typer("t", 640, 190, "a referendum on Pakistan", 0, 0.6, size=40, font="serif", italic=True, cursor=False, cps=22),
    label("w1", 640, 270, "21 August 1945: Lord Wavell calls elections", 0, 3.0, color="#e8cfa0", size=18),
    {"id": "st", "type": "stat", "x": 640, "y": 420, "value": 0, "size": 90, "color": JADE, "label": "League members in U.P., 1944", "in": 1, "d": 0.6, "anim": "fade", "keys": {"1": {"value": 304586, "d": 1.0, "t": 2.0}}},
    label("w2", 640, 530, "in 1937, Congress had won none of the U.P. Muslim seats it contested", 2, 0.6, color="#b8a888", size=17),
    cite("QA Papers; The Pioneer (1945); via Dhulipala, ch. 8", 0, 0.6),
], [
    L("In August 1945 the Viceroy announced elections, to choose the men who would write India's next constitution. The League answered at once: these elections would be a referendum on Pakistan."),
    L("It had to win that referendum everywhere, even in provinces that would never be part of Pakistan. And in U.P. its membership had exploded, to more than three hundred thousand."),
    L("Congress was confident too. In 1937 it had contested nine Muslim seats in the province and lost every one. This time it meant to break the League's claim to speak for all Muslims."),
], pal="ink"))

seq.append(scene("split", "void", [
    dossier("r", 300, 340, "S. M. Rizwanullah", "the new man, Kanpur money", "League secretary", 0, 0.4, hat="topi", tag="NEW GROUP", tagColor="#8a5a2a", w=200, h=270),
    dossier("i", 640, 340, "Nawab Ismail Khan", "the old guard", "League president", 1, 0.4, hat="karakul", tag="OLD GUARD", tagColor="#2f4f6f", w=200, h=270),
    label("s1", 1000, 250, "Rs 20,000 unexplained", 0, 3.0, color="#ffb8a8", size=19),
    label("s2", 1000, 290, "a forged ledger", 0, 5.0, color="#ffb8a8", size=19),
    label("s3", 1000, 380, "Mahmudabad House v. Bhopal House", 1, 6.0, color="#e8cfa0", size=17),
    label("s4", 1000, 470, "resigned, re-elected, twice in one day", 2, 1.0, color=GOLD, size=17),
    label("s5", 1000, 510, "general secretary: 257 votes to 178", 2, 4.0, color="#c8f0dd", size=17),
    cite("Mahmudabad to Jinnah, 11 August 1944, QA Papers; U.P. Fortnightly Reports; via Dhulipala, ch. 8", 0, 0.6),
], [
    L("But the U.P. League was tearing itself apart. Its secretary, Rizwanullah, backed by Kanpur industrialists, could not explain twenty thousand rupees in his bank account. When he finally produced his books, the papers turned out to be forged. The party buried the scandal anyway, because the old guard wanted his votes."),
    L("It was a fatal mistake. Rizwanullah's men captured the party's machinery, and by July 1944 there were two Leagues in Lucknow, one working from the Mahmudabad mansion, the other from Bhopal House, each claiming to be the real thing. Jinnah refused to take sides."),
    L("In September 1945, with elections weeks away, the president Ismail Khan resigned and was re-elected twice in a single afternoon, amid a scramble for the microphone. The old guard took the secretary's post by two hundred and fifty-seven votes to a hundred and seventy-eight. The truce that followed was thin."),
], pal="ink"))

# ---------------- chapter 2 ----------------
seq.append(chapter("ch2", 2, "The Arsenal", "Aligarh · 1945", color=JADE))

seq.append(scene("pamphlets", "void", [
    tome("b1", 230, 330, "National States and National Minorities", "Kheiri · No. 1", "#2f4f6f", 0, 0.4),
    tome("b2", 430, 330, "Is India Geographically One?", "K. S. Ahmad · No. 6", "#5a4a2a", 1, 0.4),
    tome("b3", 630, 330, "The Future Development of Islamic Polity", "I. H. Qureshi · No. 8", "#2f6f5a", 2, 0.4),
    label("p1", 1000, 230, "minority treaties in Europe failed", 0, 2.0, color="#cfe0f0", size=17),
    label("p2", 1000, 330, "five states for South Asia:", 1, 2.0, color="#e8cfa0", size=17),
    label("p3", 1000, 365, "Pakistan · Hindustan · Bengalistan", 1, 3.4, color=GOLD, size=17),
    label("p4", 1000, 400, "Dravidastan · Rajasthan", 1, 4.6, color=GOLD, size=17),
    label("p5", 1000, 480, "sovereignty only in Islamic law,", 2, 2.0, color="#c8f0dd", size=17),
    label("p6", 1000, 515, "unchangeable, policed by a supreme court", 2, 3.6, color="#c8f0dd", size=17),
    cite("Pakistan Literature Series (Lahore, 1945–47), Nos. 1, 2, 4, 6, 8; via Dhulipala, ch. 8", 0, 0.6),
], [
    L("If the League's politicians were a mess, the Muslim University at Aligarh was a factory. A committee of writers produced the Pakistan Literature Series, cheap pamphlets for anyone who wanted the case in print. A professor argued that Europe's minority treaties had failed everywhere, and that Muslims must never accept being a minority."),
    L("A young geographer insisted that India was no more one country than Scandinavia or Iberia, and redrew the subcontinent into five states: Pakistan, Hindustan, Bengalistan, Dravidastan and Rajasthan."),
    L("And the historian Ishtiaq Husain Qureshi argued that in a Muslim state, sovereignty could rest only in Islamic law, unchangeable, guarded by a court like America's Supreme Court. He also wrote approvingly of a line of Hitler's tying democracy to Jewish finance. Dhulipala quotes it, and so must we."),
], pal="ink"))

seq.append(scene("students", "void", [
    {"id": "f", "type": "figures", "x": 640, "y": 640, "n": 14, "cols": 14, "w": 980, "rowh": 70, "size": 0.9, "color": "#1a140e", "anim": "rise", "banner": "ALIGARH STUDENT WORKERS", "bannerColor": "#c8f0dd"},
    label("a1", 640, 150, "aged 17 or more · good speakers · local contacts", 0, 2.0, color="#e8cfa0", size=18),
    label("a2", 640, 190, "five minutes of public speaking each, every day", 0, 5.0, color="#e8cfa0", size=17),
    {"id": "st", "type": "stat", "x": 400, "y": 340, "value": 0, "size": 84, "color": JADE, "label": "students in Meerut division", "in": 1, "d": 0.6, "anim": "fade", "keys": {"1": {"value": 500, "d": 1.0, "t": 1.0}}},
    {"id": "st2", "type": "stat", "x": 880, "y": 340, "value": 0, "size": 84, "color": AMBER, "label": "miles a day, mostly on foot", "in": 1, "d": 4.0, "anim": "fade", "keys": {"1": {"value": 30, "d": 1.0, "t": 4.4}}},
    cite("MUML circular; Jamiluddin Ahmad's report; via Dhulipala, ch. 8", 0, 0.6),
], [
    L("Then the students went out. Aligarh's League branch drew up rules for its volunteers: at least seventeen, alert, good talkers, with contacts in the districts. They were trained in the history of the League, the answers to its critics, and public speaking, five minutes each, every day."),
    L("In Meerut division, where Congress threw everything at defeating Liaquat Ali Khan, more than five hundred students spread through the villages, covering thirty miles a day, mostly on foot. In some mosques the prayer leaders stepped aside and asked the Aligarh boys to lead the prayers."),
], pal="ink"))

seq.append(scene("village", "void", [
    quote("q", 640, 250, "Within an hour our quiet village\nhad been turned into Pakistan village", "Kalim Siddiqui, recalling 1945–46", 0, 0.6, size=26, w=760),
    label("v1", 640, 400, "every scrap of green cloth became a League flag", 1, 0.4, color="#c8f0dd", size=18),
    label("v2", 640, 440, "a four-mile walk, barefoot, to the polling booth", 1, 3.4, color="#e8cfa0", size=18),
    label("v3", 640, 520, "Mushirul Hasan: the 'Aligarh boys tilted the balance' in several seats", 2, 0.6, color="#b8a888", size=16),
    cite("Kalim Siddiqui, Conflict, Crisis and War in Pakistan (1972), via Mushirul Hasan (2012); via Dhulipala, ch. 8", 0, 0.6),
], [
    L("One writer remembered three Aligarh students arriving in his family's village, planting the green flag in the square, and gathering the little boys around them. Within an hour, he wrote, the quiet village had become Pakistan village."),
    L("His mother turned every scrap of green cloth she could find into flags. Months later his parents walked barefoot four miles to the polling booth, some carrying their sick parents on their backs, to vote for the League."),
    L("The historian Mushirul Hasan agrees that the Aligarh boys tilted the balance in several constituencies."),
], pal="ink"))

# ---------------- chapter 3 ----------------
seq.append(chapter("ch3", 3, "Songs for a Country", "Bombay and Banaras · 1944 – 1945", color=GOLD))

seq.append(scene("songs", "void", [
    {"id": "p", "type": "paper", "x": 380, "y": 350, "w": 380, "h": 440, "mast": "TARAANE", "date": "Bombay · 25 December 1945 · 4 annas", "head": "Songs of the\nNational Guards", "headSize": 30,
     "sub": "39 poems by 'Ramzi Illahabadi'", "cols": 2, "rot": -1.5, "anim": "rise"},
    typer("r1", 890, 220, "Pakistan hum le ke rahenge", 0, 3.0, size=30, font="serif", italic=True, color=GOLD, cursor=False, cps=18),
    label("r2", 890, 270, "'we will take Pakistan'", 0, 6.0, color="#e8cfa0", size=17),
    label("r3", 890, 360, "the refrain: Congress rule, 1937 to 1939", 1, 0.6, color="#ffd8a8", size=17),
    label("r4", 890, 395, "curfews, Hindi for Urdu, the Eid sacrifice stopped", 1, 2.6, color="#ffd8a8", size=16),
    cite("Ramzi Illahabadi, Muslim League National Guards ke Taraane (Bombay, 1945); via Dhulipala, ch. 8", 0, 0.6),
], [
    L("How did college boys speak to villagers? The same way the Khilafat campaign had, a generation earlier: with poetry. Most of it was burned after Partition by Muslims afraid of being called seditious. A few booklets survive, like a four-anna songbook printed in Bombay on Jinnah's birthday in 1945."),
    L("Its songs are plain and catchy. One lists the grievances of Congress rule in U.P., the curfews, the newspapers fined, Urdu pushed aside for Hindi, the riots, and ends every verse with the same line: we will take Pakistan."),
], pal="ink"))

seq.append(scene("kaif", "void", [
    typer("k1", 640, 190, "Le ke rahenge Pakistan", 0, 0.6, size=40, font="serif", italic=True, color=GOLD, cursor=False, cps=18),
    typer("k2", 640, 250, "bat ke rahega Hindustan", 0, 3.4, size=40, font="serif", italic=True, color="#ff9a8a", cursor=False, cps=18),
    label("k3", 640, 320, "'we will take Pakistan · Hindustan will be divided'", 0, 6.0, color="#e8cfa0", size=17),
    quote("q", 640, 440, "a body of converts and their descendants\nclaiming to be a nation apart", "Gandhi to Jinnah, 1944; the line that angered the poet", 1, 0.6, size=22, w=700),
    cite("Kaif Banarsi, Dil ki Dhadkan Pakistan (Karachi, 1990); Gandhi-Jinnah correspondence (1944); via Dhulipala, ch. 8", 0, 0.6),
], [
    L("One refrain went much further. A student poet from Banaras, Kaif Banarsi, wrote the lines that would be chanted across north India: we will take Pakistan, and Hindustan will be divided."),
    L("He said he wrote it in anger, after Gandhi told Jinnah in 1944 that history knew no case of converts and their descendants claiming to be a nation apart from the parent stock. And even the Communists joined in. The poet Majaz wrote an anthem imagining a Pakistan that would light a red spark in the dead forest of capitalism."),
], pal="ink"))

# ---------------- chapter 4 ----------------
seq.append(chapter("ch4", 4, "One Issue", "The League's campaign · winter 1945", color=RED))

seq.append(scene("machine", "void", [
    doc("d", 380, 320, "LEAGUE MANIFESTO, U.P.", "September 1945",
        ["Item 1: Pakistan.", "Item 2: the League alone speaks", "for India's Muslims.", "", "Land reform, banks, zamindari: dropped."],
        0, 0.4, w=440, rot=-1.0, cps=26, sfx="type", vol=0.4, hl=4, hlOn=0, keys={"0": {"hlOn": 1, "d": 10.0, "t": 0.6}}),
    label("m1", 900, 220, "80% of candidates expected to be zamindars", 0, 8.0, color="#ffb8a8", size=17),
    {"id": "st", "type": "stat", "x": 900, "y": 350, "value": 0, "size": 80, "color": AMBER, "label": "polling stations, a booth leader each", "in": 1, "d": 0.6, "anim": "fade", "keys": {"1": {"value": 1372, "d": 1.0, "t": 1.0}}},
    label("m2", 900, 450, "50,000 workers · loudspeaker vans · one-anna badges", 1, 4.0, color="#e8cfa0", size=16),
    cite("The Pioneer, 4 September 1945; Deccan Times (1945); via Dhulipala, ch. 8", 0, 0.6),
], [
    L("The League settled its manifesto in a single meeting. A left-winger, Z. H. Lari, proposed nationalising banks and abolishing the great estates. The landlords pointed out that about eighty per cent of the party's candidates would be zamindars, who were not going to sign their own death warrants. The manifesto shrank to two items: Pakistan, and the League as the only voice of India's Muslims."),
    L("Then came the machine: a booth leader for every one of the province's thirteen hundred and seventy-two polling stations, a target of fifty thousand workers, publicity vans with loudspeakers, and a badge for one anna."),
], pal="ink"))

seq.append(scene("cap", "void", [
    label("c0", 360, 230, "JAMAL MIAN'S CAP", 0, 0.4, color=GOLD, size=24, font="bebas", ls=3),
    {"id": "a", "type": "stat", "x": 360, "y": 360, "value": 0, "prefix": "Rs ", "size": 84, "color": "#e8cfa0", "label": "in the cap, mostly in annas", "in": 0, "d": 4.0, "anim": "fade", "keys": {"0": {"value": 123, "d": 1.0, "t": 4.4}}},
    {"id": "b", "type": "stat", "x": 900, "y": 360, "value": 0, "prefix": "Rs ", "size": 84, "color": JADE, "label": "after auctioning the cap, again and again", "in": 1, "d": 0.6, "anim": "fade", "keys": {"1": {"value": 16302, "d": 1.4, "t": 1.0}}},
    label("c1", 640, 520, "Jinnah: vote for the League even if its candidate is a lamp-post", 2, 0.6, color="#ffd08a", size=18),
    cite("Jamal Mian at Lucknow, 1945; Jinnah at Allahabad, 1946; via Dhulipala, ch. 8", 0, 0.6),
], [
    L("Money came the same way. At a rally in Lucknow, Jamal Mian said the League had no Birlas or Tatas, and valued a poor man's gift above a millionaire's. He sent his cap round the crowd. It came back with a hundred and twenty-three rupees, mostly in small coins."),
    L("Then he auctioned the cap itself. Each buyer's name was read out, and the cap went back on the block, again and again. By the end of the night, sixteen thousand three hundred and two rupees."),
    L("And Jinnah told voters in Allahabad not to vote for personalities at all. Vote for the League's candidate, he said, even if he is a lamp-post, because he stands for Pakistan."),
], pal="ink"))

seq.append(scene("rhetoric", "void", [
    quote("q1", 640, 200, "Muslims are past masters\nat shedding their blood", "Liaquat Ali Khan, election meeting, 1945", 0, 0.6, size=24, w=640),
    label("r1", 640, 330, "Khaliquzzaman: win the 4th and 5th battles of Panipat", 1, 0.6, color="#ffb8a8", size=18),
    label("r2", 640, 400, "the promise: a treaty to protect Muslims left in Hindustan", 2, 0.6, color="#c8f0dd", size=18),
    label("r3", 640, 440, "and if it was broken? 'diplomatic pressure'", 2, 4.0, color="#e8cfa0", size=17),
    label("r4", 640, 520, "Muharram 1945: Pakistan maps lead the processions", 2, 9.0, color=GOLD, size=17),
    cite("Deccan Times (1945); Jamal Mian at Sitapur; via Dhulipala, ch. 8", 0, 0.6),
], [
    L("The speeches grew hot. When Hindus warned that blood would flow if Pakistan came, Liaquat replied that Muslims were past masters at shedding their blood. Khaliquzzaman called the two rounds of voting the fourth and fifth battles of Panipat."),
    L("What of the Muslims of U.P., who would stay behind? A treaty between Pakistan and Hindustan would protect them, said Jamal Mian. And if Hindustan broke it, a free Pakistan would apply diplomatic pressure."),
    L("Even the Shia processions of Muharram that year carried maps of Pakistan at their head, with League flags on elephants. The old cry of Ya Ali gave way to the new one."),
], pal="ink"))

# ---------------- chapter 5 ----------------
seq.append(chapter("ch5", 5, "What Kind of Stan?", "The opposition · winter 1945", color=SKY))

seq.append(scene("madani", "void", [
    dossier("m", 280, 350, "Husain Ahmad Madani", "head of the Darul Uloom, Deoband", "born Unnao, 1879", 0, 0.4, hat="turban", tag="AGAINST", tagColor="#8a2a2a"),
    quote("q", 850, 250, "Who is not with the Hindus?", "Madani, letter to a critic in Rawalpindi", 0, 6.0, size=28, w=560),
    label("m1", 850, 380, "Punjab and Bengal would be cut in two", 1, 0.6, color="#cfe0f0", size=18),
    label("m2", 850, 420, "Assam would never be Pakistan", 1, 3.0, color="#cfe0f0", size=18),
    label("m3", 850, 500, "his allies' name for Jinnah: Kafir-i-Azam", 2, 0.6, color="#ffb8a8", size=17),
    cite("Madani, Muslim League Kya Hai (1945); Metcalf, Husain Ahmad Madani (2009); via Dhulipala, ch. 8", 0, 0.6),
], [
    L("Madani was the League's most formidable opponent. Born in U.P. in 1879, he had taught in Medina and spent the First World War in a British prison on Malta. Told that he had joined the Hindus, he answered: Muslims meet Hindus in every bazaar, train, court and council in India. You trade with them, you rent land to them. Who is not with the Hindus?"),
    L("His sharpest argument was arithmetic. By the League's own logic of majorities, he said, eastern Punjab, western Bengal and Assam would never go to Pakistan. On that point, history would prove him right."),
    L("But his camp could be as rough as its rivals. His allies called Jinnah Kafir-i-Azam, the great unbeliever."),
], pal="ink"))

seq.append(scene("numani", "void", [
    typer("t", 640, 230, "Is this jihad?", 0, 0.6, size=48, font="serif", italic=True, cursor=False, cps=16),
    label("n1", 640, 320, "not in the path of God, but of idols, wrote Numani", 0, 3.4, color="#e8cfa0", size=18),
    label("n2", 640, 400, "a student's tale: Jinnah seated beside the Prophet in a dream", 1, 0.6, color="#ffd8a8", size=17),
    label("n3", 640, 440, "Numani: a lie, dragging the Prophet into an election", 1, 5.0, color="#ffb8a8", size=17),
    cite("Numani, Ilekshani Jihad aur Uske Hathyar; via Dhulipala, ch. 8", 0, 0.6),
], [
    L("Numani, the witness at Bareilly, wrote a furious pamphlet. The League's men called their campaign a jihad. Is this jihad, he asked? It was jihad, he said, in the path of idols, not of God."),
    L("He had heard an Aligarh student tell a crowd that a revered scholar had dreamed of Jinnah seated beside the Prophet himself, honoured for saving the sinking ship of the community. Numani called it a lie, one that dragged the Prophet into an election."),
], pal="ink"))

seq.append(scene("nehru", "void", [
    dossier("n", 280, 350, "Jawaharlal Nehru", "Congress", "1889 – 1964", 0, 0.4, hat="topi", tag="CONGRESS", tagColor="#2f4f6f"),
    quote("q", 850, 230, "What kind of stan do you want?", "Nehru to the Muslims of U.P., Lucknow, 1945", 0, 6.0, size=28, w=560),
    label("n1", 850, 350, "would the Nawabs carry their estates to Pakistan?", 1, 0.6, color="#cfe0f0", size=17),
    quote("q2", 850, 445, "we Muslims living in these provinces\nwill become aliens", "Rafi Ahmad Kidwai, campaign speech", 2, 0.6, size=22, w=560),
    label("n2", 850, 565, "Nehru's forecast: the League would win 25% of Punjab", 3, 0.6, color="#ffb8a8", size=16),
    cite("The Pioneer (1945); Dawn, 'Lucknow Hysterics'; via Dhulipala, ch. 8", 0, 0.6),
], [
    L("Congress fought too. Nehru argued that the atom bomb had finished the age of small states, and that India should federate with its neighbours, not split. In Lucknow he put it bluntly to the province's Muslims: U.P. will not be in Pakistan. What kind of stan do you want?"),
    L("Would the Nawabs move to Pakistan, he asked, and leave their estates behind? They could hardly carry them there. The League's paper, Dawn, called it Lucknow hysterics, and a threat."),
    L("His lieutenant Rafi Ahmad Kidwai warned that the Muslims of U.P. would become aliens in their own land, with no more rights than visitors from Kabul. He promised land reform and work instead."),
    L("Nehru expected the League to win perhaps a quarter of the seats in Punjab. It was a spectacular misjudgment."),
], pal="ink"))

# ---------------- chapter 6 ----------------
seq.append(chapter("ch6", 6, "The Verdict", "Results · 1946", color=JADE))

seq.append(scene("results", "void", [
    label("r0", 640, 150, "CENTRAL ASSEMBLY · U.P. MUSLIM SEATS", 0, 0.4, color=GOLD, size=22, font="bebas", ls=3),
    {"id": "c", "type": "stat", "x": 640, "y": 240, "value": 0, "suffix": " of 6", "size": 80, "color": JADE, "label": "won by the League", "in": 0, "d": 1.4, "anim": "fade", "keys": {"0": {"value": 6, "d": 1.0, "t": 1.6}}},
    {"id": "a", "type": "stat", "x": 300, "y": 450, "value": 0, "suffix": "%", "size": 90, "color": JADE, "label": "League", "in": 1, "d": 2.0, "anim": "fade", "keys": {"1": {"value": 65, "d": 1.2, "t": 2.4}}},
    {"id": "b", "type": "stat", "x": 640, "y": 450, "value": 0, "suffix": "%", "size": 90, "color": SKY, "label": "Congress", "in": 1, "d": 6.0, "anim": "fade", "keys": {"1": {"value": 14, "d": 1.0, "t": 6.4}}},
    {"id": "d", "type": "stat", "x": 980, "y": 450, "value": 0, "suffix": "%", "size": 90, "color": AMBER, "label": "Nationalist Muslims", "in": 1, "d": 8.0, "anim": "fade", "keys": {"1": {"value": 14, "d": 1.0, "t": 8.4}}},
    label("r1", 640, 560, "U.P. Muslim vote, provincial assembly · on a limited franchise", 1, 10.0, color="#b8a888", size=16),
    cite("OIR Report No. 4162.1, 1 August 1946; via Dhulipala, ch. 8", 1, 0.6),
], [
    L("The first round, for the central assembly, was a clean sweep: the League won all six Muslim seats in U.P. Congress said the franchise was too narrow to mean much, and pinned its hopes on the provincial round."),
    L("The American intelligence service, the OSS, counted the provincial result. The League took sixty-five per cent of the U.P. Muslim vote. Congress took fourteen, its Nationalist Muslim allies another fourteen. The Americans called it a relatively poor showing, and blamed religious orthodoxy, Sunni-Shia rivalry and the League's own feuds."),
], pal="ink"))

seq.append(scene("butla", "void", [
    quote("q", 640, 280, "though their province is not in Pakistan\nyet they are solidly behind the Muslim League", "Abdus Sattar Butla, letter to Dawn", 0, 0.6, size=26, w=780),
    label("b1", 640, 430, "a 'relatively poor' showing, by U.P. standards, was still two to one", 1, 0.6, color="#e8cfa0", size=18),
    cite("Dawn (1946); via Dhulipala, ch. 8", 0, 0.6),
], [
    L("A League supporter put the result in one line in a letter to Dawn. The Muslims of U.P., he wrote, had proved that though their province would not be in Pakistan, they stood solidly behind the League."),
    L("A poor showing by the League's standards still meant that two out of three Muslim voters had chosen a country they would never live in."),
    beat(1.4, "heart"),
], pal="ink"))

# ---------------- chapter 7 ----------------
seq.append(chapter("ch7", 7, "What the Historians Say", "Testing the chapter", color=AMBER))

seq.append(scene("tests", "void", [
    verdict("v1", 340, 220, "Most U.P. Muslim voters\nbacked the League in 1946.", "strong", "OSS figures; but only a minority of adults could vote", 0, 0.4, w=560),
    verdict("v2", 940, 220, "The vote was a mandate for an\nIslamic state, as the book argues.", "debated", "Voters backed Pakistan; what they pictured is disputed", 1, 0.4, w=560),
    verdict("v3", 340, 470, "Aligarh students tilted the\nbalance in many seats.", "partial", "Mushirul Hasan agrees; evidence is mostly memoir", 2, 0.4, w=560),
    verdict("v4", 940, 470, "A treaty would protect\nMuslims left in India.", "weak", "No such treaty was ever signed", 3, 0.4, w=560),
], [
    L("So what holds up? That most Muslim voters in U.P. backed the League: strong, with one caveat. The franchise was limited by property and education, so most adults, Muslim or not, had no vote at all."),
    L("That the vote was a mandate for Pakistan as an Islamic state, as Dhulipala argues: debated. The League ran on Pakistan alone and left its details vague. Historians like Ayesha Jalal argue that many voters, and perhaps Jinnah himself, pictured something looser than the state that emerged."),
    L("That the Aligarh students tilted the balance: partly supported. Serious historians agree, but much of the evidence is memoir."),
    L("And the promise of a treaty to protect the Muslims left behind: weak. No such treaty was ever signed."),
], pal="smoke", cam={"zoom": [1.0, 1.02], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("now", "void", [
    typer("h1", 640, 200, "Vote for the lamp-post.", 0, 0.4, size=42, font="serif", italic=True, cursor=False, cps=20),
    label("h2", 640, 300, "one issue · no programme · the candidate doesn't matter", 0, 3.6, color="#e8cfa0", size=18),
    label("h3", 640, 400, "an election as a referendum on who 'we' are", 1, 0.6, color="#ffd8a8", size=18),
    label("h4", 640, 480, "an observation, ours, not the book's", 2, 0.6, color="#b8a888", size=16),
], [
    L("The League's campaign is worth remembering for its method as much as its result. One issue. No programme that might divide the coalition. And a candidate who did not matter, so long as he carried the flag."),
    L("Elections fought as referendums on identity, rather than on what a government will actually do, are not a thing of the past, in South Asia or anywhere else."),
    L("That observation is ours. The book's lesson is narrower and sharper: the voters of 1946 were promised a state, and the details were left for later."),
    beat(1.6, "heart"),
], pal="blood"))

seq.append(next_card(10, "Rivers of Blood, and After", "1947 – today",
                     "Next time, the final episode: Partition, the Muslims who left U.P. and the Muslims who stayed, and what Pakistan became for both."))

seq.append({"type": "card", "id": "end", "style": "endx", "title": SERIES, "dur": 26, "credits": credits_block(
    ["Pakistan Literature Series (Lahore, 1945–47) · Ramzi Illahabadi, Taraane (1945) · Kaif Banarsi, Dil ki Dhadkan Pakistan",
     "Husain Ahmad Madani, Muslim League Kya Hai (1945) · Manzoor Numani, Ilekshani Jihad aur Uske Hathyar",
     "Quaid-i-Azam Papers, ed. Zaidi · U.P. Fortnightly Reports · The Pioneer, Dawn, Deccan Times (1945–46)",
     "OSS / OIR Report No. 4162.1, The All India Muslim League (1 August 1946)"],
    ["Barbara Metcalf, Husain Ahmad Madani (2009)", "Mushirul Hasan, 'Local Roots of the Pakistan Movement' (2012)",
     "Ayesha Jalal, The Sole Spokesman (1985)", "Ian Talbot, review in the Journal of Asian Studies 74:4 (2015)"])})

ep = {"meta": meta(9, "The Referendum",
                   "The elections of 1945 and 1946 become a referendum on Pakistan. Episode 9 follows a divided League, Aligarh's pamphlets and student foot soldiers, the songs, the cap auctioned for sixteen thousand rupees, Madani and Nehru's counter-campaign, and the result: two in three U.P. Muslim voters back a country they will never live in.",
                   BOOK + ", chapter 8; party papers, pamphlets, poems and the 1946 OSS report as quoted there."),
      "cast": CAST, "sequence": seq}

if __name__ == "__main__":
    write(SLUG, ep)
