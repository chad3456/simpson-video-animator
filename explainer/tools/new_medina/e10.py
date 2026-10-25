"""Episode 10: "Rivers of Blood, and After" (book epilogue: The Aftermath of the Partition, and the conclusion)."""
from common import *

SLUG = "new-medina-e10-rivers-of-blood-and-after"
seq = []

# ---------------- cold open ----------------
seq.append({"type": "card", "id": "open", "style": "intertitle", "lines": ["The Arabian Sea.", "1948."], "sub": "A SHIP NEARS KARACHI", "dur": 5.0, "sfx": "type"})

seq.append(scene("ship", "void", [
    slate("OFF THE COAST OF PAKISTAN"),
    typer("t1", 640, 220, "the green flag on the shore", 0, 3.0, size=34, font="serif", italic=True, color="#c8f0dd", cursor=False, cps=20),
    quote("q", 640, 380, "as if the caravan of those performing hijrat\nfrom Mecca had reached Medina", "K. M. Ashraf, on arriving in Pakistan", 1, 0.6, size=24, w=760),
    label("l1", 640, 520, "'I had no option but to keep quiet and observe'", 2, 3.0, color="#e8cfa0", size=18),
    cite("K. M. Ashraf's recollection, quoted in Dhulipala, Epilogue", 0, 0.6),
], [
    L("A ship full of migrants is nearing the coast of Pakistan. As the shoreline comes into view, so does a flag: green, with a white crescent and star. The deck erupts. Verses of the Quran, cries of God is great. Grown men are weeping."),
    L("One passenger, a Marxist historian from U.P. named K. M. Ashraf, later wrote that it felt as if the caravan from Mecca had reached Medina, where the helpers waited and wealth would at last be shared by need."),
    L("He had his doubts about Pakistan's new leaders. But in that sea of believers, he wrote, saying so would have been dangerous. He kept quiet, and watched."),
    beat(1.6, "heart"),
], pal="ink", cam={"zoom": [1.08, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append({"type": "card", "id": "title", "style": "titlex", "kicker": "A LUMEN DOCUMENTARY IN TEN PARTS", "title": SERIES,
            "sub": "Episode 10 · Rivers of Blood, and After", "by": "after the book by Venkat Dhulipala (2015)", "dur": 7.0, "sfx": "boom"})

# ---------------- chapter 1 ----------------
seq.append(chapter("ch1", 1, "Brave Last Words", "U.P. · June – August 1947", color=AMBER))

seq.append(scene("column", "void", [
    {"id": "p", "type": "paper", "x": 380, "y": 350, "w": 400, "h": 440, "mast": "DAWN", "date": "Delhi · June 1947", "head": "The second\nbattle for freedom", "headSize": 32,
     "sub": "Qamaruddin Khan, Aligarh, on the Muslims left behind", "cols": 2, "rot": -1.5, "anim": "rise"},
    {"id": "st", "type": "stat", "x": 900, "y": 240, "value": 0, "size": 84, "color": AMBER, "label": "million Muslims to remain in India, he wrote", "in": 0, "d": 4.0, "anim": "fade", "keys": {"0": {"value": 50, "d": 1.0, "t": 4.4}}},
    label("c1", 900, 360, "Pakistan next door: 'moral pressure'", 1, 0.6, color="#cfe0f0", size=18),
    label("c2", 900, 400, "and the 'bar of world opinion'", 1, 3.0, color="#cfe0f0", size=18),
    label("c3", 900, 480, "the advice: live 'like Parsis and Christians'", 2, 0.6, color="#e8cfa0", size=17),
    cite("Qamaruddin Khan in Dawn, June 1947; via Dhulipala, Epilogue", 0, 0.6),
], [
    L("Ten days after the British announced Partition, in June 1947, an Aligarh lecturer named Qamaruddin Khan wrote in Dawn about the fifty million Muslims who would stay behind in India. They would have to fight a second battle for freedom, he said."),
    L("But they would not fight alone. Pakistan, on India's eastern and western borders, would exert great moral pressure on the Hindus. And as a member of the United Nations, it could put their case before the world."),
    L("Meanwhile, he advised, they should give up politics, stop asking for seats or jobs, and live quietly like the Parsis and Christians, building businesses and schools."),
], pal="ink"))

seq.append(scene("riots", "void", [
    label("r0", 640, 140, "U.P. · JUNE 1947 · RIOT DEATHS", 0, 0.4, color=GOLD, size=22, font="bebas", ls=3),
    {"id": "dt", "type": "dots", "x": 440, "y": 240, "n": 149, "cols": 25, "size": 8, "gap": 16, "color": "#8a7e68", "alt": 145, "altColor": "#e0393e", "in": 0, "d": 2.0, "anim": "fade"},
    label("r1", 640, 330, "145 of the 149 dead were Muslims", 0, 5.0, color="#ff9a8a", size=19),
    label("r2", 640, 420, "volunteer bodies in U.P., mid-1947:", 1, 0.6, color="#e8cfa0", size=17),
    label("r3", 640, 460, "RSS 36,649 · Congress Seva Dal 29,203 · League National Guards 24,134", 1, 2.4, color="#cfe0f0", size=17),
    label("r4", 640, 540, "Governor Wylie: the Leaguers 'begun to coo like doves'", 2, 0.6, color="#b8a888", size=16),
    cite("U.P. Governor's Fortnightly Reports, June–August 1947; via Dhulipala, Epilogue", 0, 0.6),
], [
    L("They were brave words, written just before the catastrophe. In June 1947 alone, a hundred and forty-nine people died in riots in U.P. A hundred and forty-five of them were Muslims."),
    L("Armed volunteer bodies were growing on every side. The biggest in the province was the Hindu nationalist RSS, with more than thirty-six thousand men. Officials noted a brisk trade in axes, choppers and swords."),
    L("The Governor watched the province's League politicians, who had talked of fighting to the death for Pakistan, and reported that they had begun to coo like doves."),
], pal="ink"))

# ---------------- chapter 2 ----------------
seq.append(chapter("ch2", 2, "The Leaving", "Delhi, Lucknow, Karachi · 1947", color=RED))

seq.append(scene("naim", "void", [
    quote("q", 640, 230, "The sons and sons-in-law were moving away;\nthe men, more than the women, were moving away", "C. M. Naim, memoir of Barabanki", 0, 0.6, size=24, w=820),
    {"id": "st", "type": "stat", "x": 400, "y": 420, "value": 0, "size": 80, "color": JADE, "label": "officials and families flown out by Pakistan", "in": 1, "d": 0.6, "anim": "fade", "keys": {"1": {"value": 7000, "d": 1.0, "t": 1.0}}},
    {"id": "st2", "type": "stat", "x": 880, "y": 420, "value": 0, "suffix": " lakh", "prefix": "Rs ", "size": 80, "color": AMBER, "label": "the bill", "in": 1, "d": 4.0, "anim": "fade", "keys": {"1": {"value": 55, "d": 1.0, "t": 4.4}}},
    cite("C. M. Naim, Ambiguities of Heritage (1999); via Dhulipala, Epilogue", 0, 0.6),
], [
    L("Then the leaving began. The writer C. M. Naim remembered it happening in every respectable family his own family knew: the sons and sons-in-law were going, the young more than the old, the men more than the women."),
    L("The new state wanted them. Pakistan spent fifty-five lakh rupees flying some seven thousand officials and their families out of India."),
], pal="ink"))

seq.append(scene("khaliq", "void", [
    dossier("k", 280, 350, "Chaudhry Khaliquzzaman", "pledged loyalty to India, then left", "1889 – 1973", 0, 0.4, hat="topi", tag="TO KARACHI", tagColor="#2f6f5a"),
    label("k1", 870, 220, "two chartered planes", 0, 5.0, color="#e8cfa0", size=19),
    quote("q", 870, 330, "I cannot reconcile myself\nto learning Hindi", "Khaliquzzaman's telegram, 1947", 1, 0.6, size=24, w=560),
    quote("q2", 870, 490, "she herself would prefer to beg in Pakistan\nthan to live in Hindustan in comfort", "Begum Raana Liaquat, to the U.S. ambassador", 2, 0.6, size=20, w=600),
    cite("Telegram to Suhrawardy; Grady to Secretary of State, 14 July 1947; via Dhulipala, Epilogue", 0, 0.6),
], [
    L("The leaders went first. Khaliquzzaman, who had led the League in U.P., joined India's Constituent Assembly, pledged his loyalty to the Indian Union, and then left for Pakistan, his family and belongings in two chartered planes."),
    L("He gave as one reason that he could not bring himself to learn Hindi, now the official language."),
    L("Liaquat Ali Khan's wife told the American ambassador she would rather beg in Pakistan than live comfortably in India. People like them could choose. The poorer Muslims who had cheered them often could not."),
], pal="ink"))

seq.append(scene("jamal", {"kind": "room", "pal": "archive"}, [
    slate("KARACHI · DECEMBER 1947"),
    quote("q", 640, 250, "Pakistan which you have built\nby sacrificing us", "Jamal Mian to Jinnah, the League's last all-India council", 0, 4.0, size=28, w=760),
    label("j1", 640, 400, "Liaquat's government: no migration wanted from U.P.", 1, 0.6, color="#ffd8a8", size=18),
    label("j2", 640, 450, "the next day, Jamal Mian withdrew his protest", 2, 0.6, color="#b8a888", size=17),
    cite("Report of the AIML Council, Karachi, December 1947; via Dhulipala, Epilogue", 0, 0.6),
], [
    L("In December 1947 the All-India Muslim League met for the last time, in Karachi. Jamal Mian, the young man who once auctioned his cap for the cause, stood up and turned on Jinnah. We put you on the highest pedestal, he said. Then you bade us farewell and left our ship without a rudder, in a Pakistan you built by sacrificing us."),
    L("It stung all the more because Liaquat's government had just said it did not want Muslims from U.P. to migrate. The new country could not absorb them."),
    L("The hall cheered him. The next day he dropped his protest. The League split in two, one party for each country, and in U.P. it soon folded up."),
], cam={"zoom": [1.05, 1.0], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 3 ----------------
seq.append(chapter("ch3", 3, "Those Who Stayed", "U.P. · 1947 – 1948", color=SKY))

seq.append(scene("loyalty", "void", [
    quote("q", 640, 200, "those who grudged loyalty to the state\nshould better leave for Pakistan", "G. B. Pant, Premier of U.P., touring western U.P.", 0, 0.6, size=24, w=760),
    label("l1", 640, 330, "Gorakhpur: three Muslim teachers told to salute the flag before their pupils", 1, 0.6, color="#e8cfa0", size=17),
    label("l2", 640, 410, "a councillor's letter: 'my blunder in supporting the demand for Pakistan'", 2, 0.6, color="#ffd8a8", size=17),
    label("l3", 640, 490, "Congressman P. D. Tandon urges rifle clubs and armed Hindu youth", 3, 0.6, color="#ff9a8a", size=17),
    cite("The Leader; The Pioneer (1947); via Dhulipala, Epilogue", 0, 0.6),
], [
    L("For those who stayed, loyalty was now on trial. The province's premier, Govind Ballabh Pant, said India would not tolerate a single fifth columnist, and that anyone who grudged loyalty had better leave for Pakistan."),
    L("In Gorakhpur, three Muslim schoolteachers who had failed to salute the flag on Independence Day were told to do it again, in front of their staff and students."),
    L("A town councillor in Barabanki wrote to the newspapers confessing his blunder in supporting Pakistan, and begged forgiveness."),
    L("And communal feeling ran inside Congress too. A senior Congressman, Purushottam Das Tandon, called for rifle clubs and thousands of armed young Hindu men in every district."),
], pal="ink"))

seq.append(scene("habib", "void", [
    dossier("h", 280, 350, "Muhammad Habib", "historian, Aligarh", "1895 – 1971", 0, 0.4, hat="none", tag="STAYED", tagColor="#2f4f6f"),
    quote("q", 870, 260, "no power on earth can make us\nPunjabis or Pakistanis", "Muhammad Habib, 1947", 0, 5.0, size=26, w=580),
    label("h1", 870, 400, "within a generation, as distinct as Persians and Turks", 1, 0.6, color="#cfe0f0", size=17),
    label("h2", 870, 480, "Madani and Seoharvi: relief and rehabilitation", 2, 0.6, color="#c8f0dd", size=17),
    cite("Muhammad Habib, statement of 1947; via Dhulipala, Epilogue", 0, 0.6),
], [
    L("Some answered with pride. Muhammad Habib, a historian at Aligarh, said U.P.'s Muslims stood aghast at the consequences of their League vote. And when a Sikh leader suggested moving western U.P.'s Muslim peasants to Pakistani Punjab, he replied that no power on earth could make them Punjabis or Pakistanis."),
    L("Within a generation, he predicted, the Muslims of India and of Pakistan would be as different as Persians and Turks."),
    L("And the scholars who had fought Pakistan hardest, Madani and Seoharvi, spent those years on relief work, trying to keep India's Muslims safe in the country they had chosen."),
], pal="ink"))

# ---------------- chapter 4 ----------------
seq.append(chapter("ch4", 4, "The New Medina", "Karachi · 1947 – 1949", color=JADE))

seq.append(scene("karachi", "void", [
    label("k0", 640, 140, "JINNAH TO MARGARET BOURKE-WHITE, 1947", 0, 0.4, color=GOLD, size=20, font="bebas", ls=3),
    typer("k1", 640, 210, "the largest Islamic nation,\nthe fifth largest nation in the world", 0, 2.0, size=30, font="serif", italic=True, cursor=False, cps=24),
    label("k2", 640, 330, "11 August 1947: religion 'nothing to do with the business of the state'", 1, 0.6, color="#cfe0f0", size=17),
    label("k3", 640, 370, "January 1948: Shariat as the basis of the constitution", 1, 4.0, color="#e8cfa0", size=17),
    quote("q", 640, 500, "Do you want to be ruled by the\nIndian Penal Code or the Quran?", "League speakers, as heard by India's first envoy, Sri Prakasa", 2, 0.6, size=22, w=680),
    cite("Bourke-White, Halfway to Freedom (1949); Sri Prakasa, Pakistan: Birth and Early Days (1965); via Dhulipala, Epilogue", 0, 0.6),
], [
    L("In Karachi, Jinnah was exultant. He told the photographer Margaret Bourke-White that Pakistan was not just the largest Islamic nation, but the fifth largest nation on earth."),
    L("On the eleventh of August 1947 he told the new assembly that religion had nothing to do with the business of the state. Some heard a secular founder. Months later, speaking to lawyers in Karachi, he called it mischief to suggest that Shariat law would not be the basis of the constitution."),
    L("His colleagues from U.P. were less ambiguous. India's first envoy to Pakistan was taken to meetings where speakers asked the crowd: do you want to be ruled by the Indian Penal Code, or the Quran? The Quran, the crowd replied."),
], pal="ink"))

seq.append(scene("funeral", {"kind": "room", "pal": "archive"}, [
    slate("KARACHI · SEPTEMBER 1948"),
    doc("d", 420, 320, "FUNERAL ORATION", "Shabbir Ahmad Usmani, on Jinnah (substance)",
        ["The greatest Muslim since Aurangzeb.", "As Abu Bakr told the believers", "when the Prophet died:", "the message lives. Carry it on.", "A bloc of Muslim states, Karachi to Morocco."],
        0, 0.4, w=500, rot=-1.2, cps=26, sfx="type", vol=0.4),
    label("f1", 930, 300, "India's Governor-General", 1, 0.6, color="#e8cfa0", size=18),
    label("f2", 930, 340, "sent his condolences to Usmani", 1, 2.4, color=GOLD, size=19),
    label("f3", 930, 380, "not to the prime minister", 1, 4.0, color="#b8a888", size=17),
    cite("Dawn, 13 September 1948; Jamiluddin Ahmad (1966); via Dhulipala, Epilogue", 0, 0.6),
], [
    L("When Jinnah died in September 1948, the man who led the prayers was Shabbir Ahmad Usmani, the scholar we met in episode eight. In his oration he called Jinnah the greatest Muslim since the emperor Aurangzeb, and compared the nation's grief to the moment the Prophet died. Carry on the message, he told Pakistan: build a bloc of Muslim states from Karachi to Morocco."),
    L("India's Governor-General, the shrewd C. Rajagopalachari, sent his official condolences not to the prime minister, but to Usmani. He understood who now spoke for Pakistan's soul. Within six months Usmani had steered through the Objectives Resolution."),
], cam={"zoom": [1.05, 1.0], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 5 ----------------
seq.append(chapter("ch5", 5, "The Wanderer", "Mahmudabad · 1947 – 1973", color=GOLD))

seq.append(scene("raja", "void", [
    {"id": "m", "type": "samap", "view": "wide", "x": 640, "y": 380, "k": 1.25, "split": 1, "nb": 0.7, "anim": "fade",
     "cities": [{"name": "Lucknow", "color": GOLD}, {"name": "Tehran", "left": True}, {"name": "Karbala", "at": [44.03, 32.62], "left": True}, {"name": "Karachi", "color": JADE}],
     "arcs": [{"from": "Lucknow", "to": "Tehran", "bend": 0.4}],
     "arcDraw": [0], "keys": {"0": {"arcDraw": [1], "d": 2.0, "t": 4.0}}},
    {"id": "pn", "type": "panel", "x": 1040, "y": 560, "w": 420, "h": 150, "anim": "fade", "in": 1, "d": 0.6},
    label("r1", 1040, 530, "1957: a Pakistani passport", 1, 1.0, color="#c8f0dd", size=18),
    label("r2", 1040, 570, "then London, and a mosque", 1, 4.0, color="#e8cfa0", size=18),
    label("r3", 1040, 610, "1965: his estates seized as enemy property", 2, 0.6, color="#ff9a8a", size=16),
    cite("J. D. Latham (1974); V. S. Naipaul, India: A Million Mutinies Now (1990); via Dhulipala, Epilogue", 0, 0.6),
], [
    L("And the Raja of Mahmudabad, the League's young idealist, who had dreamed of an Islamic state? The violence of Partition sickened him. As the two countries celebrated independence, he crossed into Iran and went on to Karbala, the holiest place of his Shia faith. He stayed in Iraq for ten years, on an Indian passport."),
    L("In 1957 he finally became a Pakistani. But in Pakistan he was a refugee, and a Shia in a mostly Sunni country. He settled in London instead, and helped build the great mosque at Regent's Park."),
    L("In 1965, during the war, India seized his estates as enemy property. His son later told the writer V. S. Naipaul that his father's wandering had been a kind of penance."),
], pal="ink"))

seq.append(scene("y1971", "void", [
    {"id": "yr", "type": "year", "x": 640, "y": 300, "value": 1971, "size": 150, "anim": "fade", "glowColor": RED},
    label("y1", 640, 440, "Bangladesh is born", 0, 2.0, color="#e8cfa0", size=22),
    label("y2", 640, 500, "the Raja dies two years later, aged 58, and is buried at Mashhad", 1, 0.6, color="#b8a888", size=17),
], [
    L("Then came 1971. East Pakistan broke away and became Bangladesh. For the Raja, it struck at the heart of the idea that Muslims were one nation."),
    L("He never recovered. He died two years later, at fifty-eight, and was buried far from Lucknow, beside the shrine at Mashhad in Iran."),
    beat(1.4, "heart"),
], pal="blood"))

# ---------------- chapter 6 ----------------
seq.append(chapter("ch6", 6, "Full Circle", "Karachi, 1949 · New Delhi, 2004", color=RED))

seq.append(scene("inverse", {"kind": "room", "pal": "archive"}, [
    doc("d", 420, 320, "U.S. EMBASSY, KARACHI", "Report on the refugees, 9 November 1949 (substance)",
        ["A fixed pattern of thinking:", "what is good for Pakistan is bad for India,", "and what is bad for India is good for Pakistan.", "It will take a generation", "before the traces are effaced."],
        0, 0.4, w=520, rot=-1.0, cps=26, sfx="type", vol=0.4, hl=1, hlOn=0, keys={"0": {"hlOn": 1, "d": 7.0, "t": 0.6}}),
    label("i1", 940, 320, "the Urdu press of West Pakistan:", 1, 0.6, color="#e8cfa0", size=17),
    label("i2", 940, 360, "almost all refugee-staffed", 1, 2.6, color=GOLD, size=18),
    cite("Franklin W. Wolf, 'Status of Refugee Problem in West Pakistan', US State Department Papers; via Dhulipala, Epilogue", 0, 0.6),
], [
    L("The migrants from U.P., the mohajirs, rebuilt their lives in Karachi and became a political force. An American diplomat there described their outlook in 1949: a fixed pattern of thinking in which India and Pakistan were always inversely related. What was good for one had to be bad for the other."),
    L("That pattern, he noted, ran through all of Pakistan, carried by an Urdu press staffed almost entirely by refugees. It would take a generation, he guessed, to fade. On both sides of the border, it has lasted far longer."),
], cam={"zoom": [1.05, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("altaf", "void", [
    slate("NEW DELHI · NOVEMBER 2004"),
    dossier("a", 280, 350, "Altaf Husain", "leader of the MQM, in exile", "born Karachi, 1953", 0, 0.4, hat="none", tag="MOHAJIR", tagColor="#8a5a2a"),
    quote("q", 870, 240, "the greatest, greatest blunder\nin the history of mankind", "Altaf Husain on Partition, Hindustan Times summit", 0, 6.0, size=26, w=580),
    label("a1", 870, 380, "'the division of the blood'", 1, 0.6, color="#ff9a8a", size=19),
    label("a2", 870, 450, "he asked India to give mohajirs refuge if needed", 1, 3.6, color="#e8cfa0", size=17),
    label("a3", 870, 520, "in Pakistan, Imran Khan sought treason charges", 2, 0.6, color="#b8a888", size=17),
    cite("The Hindu, 7 November 2004; via Dhulipala, Epilogue", 0, 0.6),
], [
    L("Nearly fifty years after the séance in which Jinnah's spirit warned that a country is hard to keep, the exiled leader of Pakistan's mohajirs, Altaf Husain, stood up at a conference in New Delhi. The partition of India, he said, was the greatest blunder in the history of mankind: not a division of land, but a division of blood."),
    L("The grandchildren of U.P.'s emigrants, he said, were persecuted in Pakistan. He asked India to forgive them, and to give them refuge if it came to that."),
    L("In Pakistan, Imran Khan went to court to have him charged with treason. The wheel, Dhulipala writes, had turned full circle."),
], pal="ink"))

# ---------------- chapter 7 ----------------
seq.append(chapter("ch7", 7, "The Verdict", "The book, and its critics", color=AMBER))

seq.append(scene("smith", "void", [
    dossier("w", 280, 350, "Wilfred Cantwell Smith", "scholar of Islam, Lahore 1940–46", "1916 – 2000", 0, 0.4, hat="none", tag="WITNESS", tagColor="#2f4f6f"),
    quote("q", 870, 240, "an Islamic State not because its form\nis ideal, but because its dynamic is idealist", "W. C. Smith, Pakistan as an Islamic State (1951)", 0, 6.0, size=22, w=600),
    label("s1", 870, 380, "an 'impossible state', never fully realised", 1, 0.6, color="#cfe0f0", size=18),
    label("s2", 870, 420, "yet Pakistan would not survive without the ideal", 1, 3.4, color="#cfe0f0", size=18),
    quote("q2", 870, 530, "that it shall not become\nan extension of Afghanistan", "a Pakistani modernist, to Smith", 2, 0.6, size=20, w=560),
    cite("W. C. Smith, Pakistan as an Islamic State (Lahore, 1951); via Dhulipala, Conclusion", 0, 0.6),
], [
    L("One witness saw this early. The Canadian scholar Wilfred Cantwell Smith taught in Lahore through the Pakistan years, and at first he too treated the movement as mostly economic and social. Afterwards, he admitted he had been wrong. Pakistan, he wrote in 1951, was an Islamic state not because its form was ideal, but because its drive was idealist."),
    L("Such a state could never be fully achieved, he thought. But Pakistan would not survive without trying."),
    L("He also recorded a modernist's fear: the nightmare that Pakistan might go back, become rigid and narrow, an extension of Afghanistan."),
], pal="ink"))

seq.append(scene("tests", "void", [
    verdict("v1", 340, 220, "Pakistan was argued over in public,\nin detail, long before 1947.", "strong", "Urdu press, pamphlets, speeches across the series", 0, 0.4, w=560),
    verdict("v2", 940, 220, "Pakistan was more than a\nbargaining counter.", "debated", "The book's main target: Ayesha Jalal's thesis", 1, 0.4, w=560),
    verdict("v3", 340, 420, "The Islamic state was central to\nPakistan's popularity in U.P.", "debated", "Strong in U.P.; critics doubt it holds everywhere", 2, 0.4, w=560),
    verdict("v4", 940, 420, "The 'ideological state' was rooted\nin pre-1947 ideas, not only later fears.", "debated", "Dhulipala's central claim", 3, 0.4, w=560),
    verdict("v5", 640, 620, "The 'hostage' theory protected minorities.", "weak", "Partition's violence answered it", 4, 0.4, w=560),
], [
    L("So, at the end of the series, what holds up? That Pakistan was debated in public, in detail, by ordinary people as well as leaders, long before 1947: strongly supported. That is the book's great contribution."),
    L("That Pakistan was a real goal, not a bargaining counter: debated. This is the book's main target, the influential thesis of Ayesha Jalal. Dhulipala makes a powerful case, but the argument continues."),
    L("That the dream of an Islamic state was central to Pakistan's popularity: debated. The evidence from U.P. is rich. Reviewers have asked whether a study of one Muslim-minority province can explain Punjab and Bengal, where Pakistan was actually built. Dhulipala himself calls that unfinished work."),
    L("That Pakistan's later ideological state grew from ideas already present before 1947, and not only from its post-independence insecurities: debated, and it is the book's boldest claim."),
    L("And the hostage theory, the promise that minorities on each side would guarantee each other's safety: weak. Partition's killings answered it."),
], pal="smoke", cam={"zoom": [1.0, 1.02], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 8 ----------------
seq.append(chapter("ch8", 8, "Why It Matters Now", "India · Pakistan · the world", color=SKY))

seq.append(scene("now", "void", [
    {"id": "a", "type": "stat", "x": 330, "y": 230, "value": 0, "size": 80, "color": JADE, "label": "million Muslims in India, 2011 census", "in": 0, "d": 2.0, "anim": "fade", "keys": {"0": {"value": 172, "d": 1.2, "t": 2.4}}},
    {"id": "b", "type": "stat", "x": 950, "y": 230, "value": 0, "size": 80, "color": AMBER, "label": "million in Uttar Pradesh alone", "in": 0, "d": 7.0, "anim": "fade", "keys": {"0": {"value": 38, "d": 1.0, "t": 7.4}}},
    label("n1", 640, 380, "India: loyalty, citizenship, and the minority 'left behind'", 1, 0.6, color="#cfe0f0", size=18),
    label("n2", 640, 430, "Pakistan: the Objectives Resolution, still in its constitution", 2, 0.6, color="#c8f0dd", size=18),
    label("n3", 640, 480, "the world: states promised as homelands for a faith", 3, 0.6, color="#ffd8a8", size=18),
    label("n4", 640, 560, "these connections are ours, not the book's", 3, 6.0, color="#b8a888", size=16),
    cite("Census of India 2011; Constitution of Pakistan, Article 2A", 0, 0.6),
], [
    L("Why does this book matter now? Start with numbers. India's 2011 census counted about a hundred and seventy-two million Muslims, more than in any other country except Indonesia and Pakistan. Some thirty-eight million live in Uttar Pradesh, the province where this story played out."),
    L("For India, the questions of 1947 have not gone away: who counts as loyal, who belongs, whether a minority is a citizen or a hostage to events across a border. Every one of those arguments was rehearsed in U.P.'s newspapers eighty years ago."),
    L("For Pakistan, the Objectives Resolution that Usmani steered through became part of its constitution. The argument between the captain and the pilot, between Jinnah's August speech and Usmani's lighthouse, is still unsettled."),
    L("And for the world, the book is a warning about promised lands: states imagined as a homeland for one faith or people, sold with confidence to those who will never live in them, and leaving minorities stranded on both sides. These connections are ours, not Dhulipala's. But his book is the best account we have of how one such promise was made."),
], pal="ink"))

seq.append(scene("close", {"kind": "room", "pal": "archive"}, [
    {"id": "table", "type": "seance", "x": 640, "y": 600, "size": 0.95, "anim": "fade", "chair": 1, "keys": {"1": {"smoke": 0.2, "chair": 0.3, "d": 2, "t": 5}}},
    {"id": "q", "type": "cquote", "x": 640, "y": 170, "w": 760, "size": 30, "text": "It is easier to acquire a country,\nbut it is extremely difficult to retain it.", "by": "the 'spirit' of Jinnah, Karachi, 1955", "in": 1, "d": 0.6, "anim": "fade"},
    cite("Qaid-i-Azam Papers, File 1067; quoted in Dhulipala, Introduction", 1, 0.6),
], [
    L("We began this series in a dark room in Karachi in 1955, with a cigarette burning on a wire stand and a government officer asking a dead man about his country."),
    L("Whatever we make of séances, the officer recorded one line worth keeping. It is easier to acquire a country, the spirit said, than to keep it."),
    L("A new Medina was promised to the Muslims of U.P. Most of them never lived in it. The ones who did found that a state is harder to build than a dream. And the ones who stayed have been asked, ever since, to prove which side they are on."),
    beat(3.4, "bell"),
], cam={"zoom": [1.0, 1.1], "pan": [[0, 0], [0, 10]]}))

seq.append({"type": "card", "id": "end", "style": "endx", "title": SERIES, "dur": 30, "credits": credits_block(
    ["U.P. Governor's Fortnightly Reports (1947) · US State Department Papers (1947–49) · Dawn, The Pioneer, The Leader (1947–48)",
     "C. M. Naim, Ambiguities of Heritage (1999) · Sri Prakasa, Pakistan: Birth and Early Days (1965)",
     "Margaret Bourke-White, Halfway to Freedom (1949) · W. C. Smith, Pakistan as an Islamic State (1951)",
     "The Hindu, 7 November 2004 · Census of India 2011 · Constitution of Pakistan (1973), Art. 2A"],
    ["Ayesha Jalal, The Sole Spokesman (1985)", "Farzana Shaikh, Making Sense of Pakistan (2009)",
     "Wael Hallaq, The Impossible State (2012)", "V. S. Naipaul, India: A Million Mutinies Now (1990)",
     "Ian Talbot, review in the Journal of Asian Studies 74:4 (2015)"])})

ep = {"meta": meta(10, "Rivers of Blood, and After",
                   "The final episode. Partition comes to U.P.: the leaders leave, the Muslims who stay are asked to prove their loyalty, and Pakistan's founders argue over what their new Medina should be. From a Karachi funeral to a Raja's exile to a mohajir leader's apology in Delhi in 2004, and the series' verdict on the book.",
                   BOOK + ", epilogue and conclusion; official reports, memoirs and newspapers as quoted there."),
      "cast": CAST, "sequence": seq}

if __name__ == "__main__":
    write(SLUG, ep)
