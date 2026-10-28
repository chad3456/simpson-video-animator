"""Episode 3: "Four-Anna Members" (book chapter 2: Muslim Mass Contacts and the Rise of the Muslim League)."""
from common import *

SLUG = "new-medina-e03-four-anna-members"
seq = []

# U.P. close-up: zoom 3 on the 'sa' view, centred so the province sits left of frame.
def upmap(cities, lit=0, keys=None, x=386, y=609, **kw):
    e = {"id": "m", "type": "samap", "x": x, "y": y, "k": 3.0, "split": 0, "und": 0, "nb": 0.8, "up": 0.55, "upLabel": False, "anim": "fade",
         "cities": cities, "lit": lit}
    if keys:
        e["keys"] = keys
    e.update(kw)
    return e

JHANSI, BIJNOR, MORAD, SAHAR, BULAND, BADAYUN, BAHRAICH = [78.57, 25.45], [78.13, 29.37], [78.78, 28.84], [77.55, 29.97], [77.85, 28.40], [79.12, 28.04], [81.6, 27.57]
THANA = [77.42, 29.59]

# ---------------- cold open ----------------
seq.append({"type": "card", "id": "open", "style": "intertitle", "lines": ["Thana Bhawan, United Provinces.", "July 1937."], "sub": "A TELEGRAM FROM A SUFI LODGE", "dur": 5.0, "sfx": "type"})

seq.append(scene("wire", {"kind": "room", "pal": "archive"}, [
    slate("THANA BHAWAN · JULY 1937"),
    doc("w", 640, 330, "TELEGRAM", "From Thana Bhawan to the voters of Bundelkhand (substance)",
        ["DO NOT VOTE", "FOR THE CONGRESS."], 0, 0.8, w=460, rot=-1.5, cps=14, sfx="type", vol=0.5, hl=1, hlOn=0, keys={"1": {"hlOn": 1, "d": 0.4, "t": 0.6}}),
    cite("Ahmad Saeed, Maulana Ashraf Ali Thanawi aur Tehrik-i-Azadi (1972); via Dhulipala, ch. 2", 0, 0.8),
], [
    L("In July 1937 voters in Bundelkhand wrote to the most revered Deobandi scholar of his day, Maulana Ashraf Ali Thanawi, and asked him whom they should vote for in a by-election."),
    L("Thanawi did not trust the Muslim League. He was not sure it would stand by Islam if it ever came to power. So a disciple suggested a way out. Do not tell them whom to vote for. Tell them whom not to vote for."),
    L("The wire that went out from his lodge said only this: do not vote for the Congress."),
    beat(1.6, "heart"),
], cam={"zoom": [1.1, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("hook", "void", [
    {"id": "a", "type": "stat", "x": 400, "y": 300, "value": 180, "size": 110, "color": "#8a7e68", "label": "League votes, January 1937", "anim": "fade"},
    {"id": "b", "type": "stat", "x": 880, "y": 300, "value": 0, "size": 110, "color": JADE, "label": "League votes, July 1937", "in": 1, "d": 0.3, "anim": "fade",
     "keys": {"1": {"value": 2652, "d": 0.6, "t": 2.6}}},
    label("c", 640, 500, "same seat · six months apart · 60 per cent of the vote", 1, 3.6, color="#e8cfa0", size=19),
    cite("Reeves, Graham and Goodman, Handbook to Elections in U.P. (1975); via Dhulipala, ch. 2", 0, 0.6),
], [
    L("Six months earlier, the League's man had stood in a seat here and finished last, with a hundred and eighty votes."),
    L("Now the League won it with two thousand six hundred and fifty-two, sixty percent of the poll. Something had changed in the United Provinces, and it had changed fast."),
], pal="ink"))

seq.append({"type": "card", "id": "title", "style": "titlex", "kicker": "A LUMEN DOCUMENTARY IN TEN PARTS", "title": SERIES,
            "sub": "Episode 3 · Four-Anna Members", "by": "after the book by Venkat Dhulipala (2015)", "dur": 7.0, "sfx": "boom"})

# ---------------- chapter 1 ----------------
seq.append(chapter("ch1", 1, "Mass Contact", "Allahabad · 1937", color=SKY))

seq.append(scene("nehru", "void", [
    dossier("n", 330, 360, "Jawaharlal Nehru", "Congress campaigner", "1889 – 1964", 0, 0.6, hat="topi", tag="9 OF 9 LOST", tagColor="#8a3a3a"),
    quote("nq", 880, 260, "My appeal will not be to the top leaders\nbut to the masses, with whom the\neconomic reality is bound to prevail.", "Nehru, 1937", 1, 0.4, size=23, w=560),
    label("n1", 880, 470, "poverty, not religion · bread, not pacts", 2, 1.0, color="#cfe0f0", size=18),
    cite("S. Gopal (ed.), Selected Works of Jawaharlal Nehru, vols 7-8; via Dhulipala, ch. 2", 1, 0.6),
], [
    L("Congress had swept the province in 1937. But every one of its nine candidates for Muslim seats in the United Provinces had lost."),
    L("Nehru was undaunted. Muslims, he said, had simply not been asked. He would go over the heads of their 'reactionary' leaders, straight to the masses, with whom, he said, the economic reality was bound to prevail."),
    L("The communal problem, as Nehru saw it, was a quarrel among the middle classes over jobs and seats. The peasant cared about hunger. Give him bread, land and freedom, and religion would take care of itself."),
], pal="ink"))

seq.append(scene("ashraf", {"kind": "room", "pal": "sepia"}, [
    dossier("k", 330, 350, "Kunwar Mohammad Ashraf", "runs the Muslim Mass\nContact Programme", "1903 – 1962", 0, 0.6, hat="none", tag="COMMUNIST", tagColor="#8a2a2a"),
    typer("k1", 880, 200, "a Meo from Alwar", 0, 2.0, size=20, color="#e8cfa0", cursor=False),
    typer("k2", 880, 260, "once a devout Sufi novice", 1, 0.4, size=20, color="#e8cfa0", cursor=False),
    typer("k3", 880, 320, "then a PhD in London, and Marx", 1, 6.0, size=20, color="#e8cfa0", cursor=False),
    quote("kq", 880, 480, "politics is essentially dictated\nby class interests", "K. M. Ashraf, letter, 15 July 1938", 2, 0.8, size=24, w=520),
    cite("Horst Kruger (ed.), Kunwar Mohammad Ashraf (1969); AICC Papers G-68/1937-38; via Dhulipala, ch. 2", 0, 0.6),
], [
    L("To run the campaign Nehru picked K. M. Ashraf, a communist, and set him up at Anand Bhavan, the Nehru family home in Allahabad."),
    L("Ashraf had been a pious young man. As a student he began a forty-day Sufi ordeal of fasting and prayer. On the thirteenth night he dreamt he was drinking cheap wine with a Hindu friend. His teacher told him that spiritual progress was not his destiny. Years later, in London, he found Marx."),
    L("He did not believe Muslims were a political unit at all. Politics, he wrote, is essentially dictated by class interests. A Muslim peasant and a Muslim landlord were enemies, whatever they prayed."),
], cam={"zoom": [1.05, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("hindustan", "void", [
    {"id": "p", "type": "paper", "x": 420, "y": 350, "w": 420, "h": 460, "mast": "HINDUSTAN", "date": "Allahabad · weekly · 1937", "head": "Join the Congress,\nfour annas a year", "headSize": 34,
     "sub": "Muslim backwardness, explained in the language of Marx", "cols": 3, "rot": -1.5, "anim": "rise"},
    typer("f", 930, 240, "4 annas", 1, 0.4, size=78, font="bebas", color=AMBER, cursor=False, cps=10),
    label("f1", 930, 310, "a year's Congress membership", 1, 1.4, color="#e8cfa0", size=18),
    label("f2", 930, 420, "Muslim culture? only the culture", 2, 0.6, color="#ffd8a8", size=18),
    label("f3", 930, 455, "of a tiny feudal elite, said Ashraf", 2, 1.6, color="#ffd8a8", size=18),
    cite("Hindustan (Allahabad), 1937-38, AICC Papers; via Dhulipala, ch. 2", 0, 0.6),
], [
    L("The campaign launched an Urdu weekly, Hindustan. Its writers explained Muslim backwardness in the language of Marx: feudal lords, a missing bourgeoisie, the betrayal of Sir Syed."),
    L("Its practical aim was to sign Muslims up as four-anna members of Congress, a quarter of a rupee a year."),
    L("Ashraf even denied there was any such thing as a single Muslim culture. What passed for it, he wrote, was the culture of a tiny feudal elite, and the masses had nothing to do with it. It was a bold argument. It would prove to be a gift to his opponents."),
], pal="ink"))

# ---------------- chapter 2 ----------------
seq.append(chapter("ch2", 2, "Massacre Contact", "The League answers · 1937", color=JADE))

seq.append(scene("iqbal", {"kind": "room", "pal": "archive"}, [
    doc("i", 420, 330, "SIR MUHAMMAD IQBAL TO M. A. JINNAH", "1937 (excerpt)",
        ["It is absolutely necessary to tell", "the world ... that the economic", "problem is not the only problem", "in the country."], 0, 0.6, w=470, rot=-1, cps=26, sfx="type", vol=0.4, hl=2, hlOn=0, keys={"0": {"hlOn": 1, "d": 6.0, "t": 0.6}}),
    quote("jq", 930, 300, "Do not be led away\nby the cries of dal-bhat.", "M. A. Jinnah, 1937", 1, 0.6, size=28, w=460),
    label("j2", 930, 470, "Congress mass contact = 'massacre contact'", 1, 4.2, color="#ff9a8a", size=18),
    cite("Iqbal to Jinnah, in Towards Freedom 1937, vol. 1; Jinnah's speeches; via Dhulipala, ch. 2", 0, 0.6),
], [
    L("The League saw the threat at once. The poet-philosopher Muhammad Iqbal wrote to Jinnah: the world must be told that the economic problem is not the only problem in the country. For Muslims, the cultural problem mattered more."),
    L("Jinnah went further. He called the Congress campaign 'massacre contact', and told Muslims not to be led away by the cries of dal-bhat, rice and lentils. Bread was being offered in exchange for identity, he implied, and Muslims should refuse the trade."),
], cam={"zoom": [1.06, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("twoanna", "void", [
    typer("c4", 380, 250, "4 annas", 0, 0.4, size=72, font="bebas", color="#8a7e68", cursor=False, cps=10),
    label("c4l", 380, 315, "Congress", 0, 1.2, color="#b8a888", size=18),
    typer("c2", 900, 250, "2 annas", 0, 2.6, size=72, font="bebas", color=JADE, cursor=False, cps=10),
    label("c2l", 900, 315, "Muslim League", 0, 3.4, color="#c8f0dd", size=18),
    label("g1", 640, 420, "goal: 'a free and independent' India, 'with a democratic form of government'", 1, 0.6, color="#e8cfa0", size=18),
    label("g2", 640, 465, "town and tehsil branches elect district, then provincial Leagues", 1, 3.6, color="#cfe0f0", size=17),
    label("g3", 640, 540, "target: a quarter of U.P.'s adult Muslims, in three months", 2, 0.8, color="#ffd08a", size=18),
    cite("AIML constitution, 1937; AICC Papers 16/1937; Towards Freedom 1937; via Dhulipala, ch. 2", 0, 0.6),
], [
    L("Then the League copied its rival, and undercut it. Congress charged four annas a year. The League charged two."),
    L("It rewrote its constitution with elected branches from the tehsil up, and adopted a new goal: a free and independent India with a democratic form of government. On paper it now sounded as radical as Congress."),
    L("Its U.P. branch set itself a target of enrolling a quarter of the province's adult Muslims within three months."),
], pal="ink"))

seq.append(scene("mahmudabad", "void", [
    dossier("r", 330, 350, "Raja of Mahmudabad", "League treasurer,\nfinancier, organiser", "1914 – 1973", 0, 0.6, hat="karakul", tag="KHADDAR-CLAD", tagColor="#2f6f5a"),
    label("r1", 880, 190, "Islamic socialism: 'the oldest socialist creed'", 1, 0.6, color="#c8f0dd", size=18),
    label("r2", 880, 235, "minimum wages · fair rents · no usury", 1, 3.6, color="#c8f0dd", size=17),
    quote("rq", 880, 420, "When the slogan 'Workers of the World Unite'\nis raised, nobody has a problem. When the\nslogan 'Muslims of the World Unite' is raised,\neverybody has a problem!", "An unnamed League supporter, 1938", 2, 0.6, size=21, w=600),
    cite("Khutbat-i-Raja Sahab Mahmudabad (1997); Zulqarnain, 28 July 1938; via Dhulipala, ch. 2", 0, 0.6),
], [
    L("The League's answer to socialism was not to ignore it. It was to claim it. Its chief organiser in the province was the young Raja of Mahmudabad: a great landlord who wore homespun khaddar, a pious Shia, and one of the few men close to Jinnah."),
    L("Islam, the Raja told audiences, was the oldest socialist creed in the world. The Prophet had been an orphan and knew poverty. The League's programme promised minimum wages, fair rents and an end to usury."),
    L("One supporter put the League's case in a single line: when the slogan is 'Workers of the World Unite', nobody has a problem. When it is 'Muslims of the World Unite', everybody has a problem!"),
], pal="jade"))

seq.append(scene("lucknow37", "void", [
    {"id": "m", "type": "samap", "x": 470, "y": 372, "k": 1.05, "split": 0, "und": 0.5, "nb": 0.6, "up": 1, "anim": "fade",
     "cities": [{"name": "Lucknow", "note": "League session, October 1937", "pin": True, "color": JADE}, {"name": "Lahore", "note": "Sikandar Hayat Khan", "left": True, "color": "#7fb2d9"},
                {"name": "Calcutta", "note": "Fazlul Haq", "color": "#7fb2d9"}], "upLabel": False, "lit": 0, "keys": {"0": {"lit": 1, "d": 0.8, "t": 1.2}, "1": {"lit": 3, "d": 0.4, "t": 2.4}}},
    label("l1", 1010, 250, "the suit gives way", 2, 0.4, color="#e8cfa0", size=19),
    label("l2", 1010, 290, "to sherwani and fur cap", 2, 1.4, color="#e8cfa0", size=19),
    quote("lq", 1010, 450, "a very strong and definite\ncommunal lead", "Governor Haig on Jinnah at Lucknow", 1, 4.4, size=22, w=440),
    cite("Haig to Linlithgow, October 1937, in Towards Freedom 1937; via Dhulipala, ch. 2", 0, 0.6),
], [
    L("In October 1937 the League met in Lucknow, and the leaders of the Muslim-majority provinces came: Sir Sikandar Hayat Khan of Punjab and Fazlul Haq of Bengal."),
    L("The Governor reported that Jinnah had given Muslims a very strong and definite communal lead, and that it had inspired great enthusiasm. Sikandar told his own Governor that a Congressman at that session would have been lynched."),
    L("Jinnah, the immaculate barrister in Savile Row suits, now appeared in public in a sherwani and a fur cap."),
], pal="ink"))

# ---------------- chapter 3 ----------------
seq.append(chapter("ch3", 3, "A War of Symbols", "Congress Raj · 1937 – 1939", color=AMBER))

seq.append(scene("wardha", "void", [
    doc("wd", 360, 300, "THE WARDHA SCHEME", "Basic national education, 1937-38 (summary)",
        ["Seven years of schooling through a", "craft such as spinning. Mother-tongue", "teaching. No religious instruction.", "Committee chair: Dr Zakir Husain."], 0, 0.4, w=480, rot=-1),
    doc("pp", 920, 330, "THE PIRPUR REPORT", "All-India Muslim League, 1938 (excerpts)",
        ["'Gandhian totalitarianism'", "", "'there are many essentials of Islam", "which are exclusively Islamic'"], 1, 0.4, w=460, rot=1.5, hl=0, hlOn=0, keys={"1": {"hlOn": 1, "d": 3.0, "t": 0.6}}),
    cite("K. K. Aziz, Muslims under Congress Rule (1978); CWMG vol. 66; via Dhulipala, ch. 2", 0, 0.6),
], [
    L("Out of the legislatures, the League found its sharpest weapon in the symbols of the new Congress governments. First came Gandhi's Wardha scheme: seven years of village schooling built around a craft like spinning, taught in the mother tongue, without religious instruction. Its syllabus was drafted by a committee under a Muslim educationist, Dr Zakir Husain."),
    L("A League committee under the Raja of Pirpur tore it apart. It called the scheme Gandhian totalitarianism, likened its teaching of non-violence to the race doctrines of fascist states, and rejected the idea that all religions teach the same truths. Muslims, it said, needed their own education boards, run by Muslims."),
], pal="ink"))

seq.append(scene("symbols", "void", [
    {"id": "c1", "type": "card", "x": 240, "y": 230, "w": 250, "h": 170, "glyph": "book", "title": "Hindustani", "color": "#5a4a3a", "anim": "pop", "sfx": "pop", "vol": 0.4},
    {"id": "c2", "type": "card", "x": 640, "y": 230, "w": 250, "h": 170, "glyph": "mic", "title": "Bande Mataram", "color": "#5a4a3a", "in": 0, "d": 2.5, "anim": "pop", "sfx": "pop", "vol": 0.4},
    {"id": "c3", "type": "card", "x": 1040, "y": 230, "w": 250, "h": 170, "glyph": "flag", "title": "The tricolour", "color": "#5a4a3a", "in": 0, "d": 4.5, "anim": "pop", "sfx": "pop", "vol": 0.4},
    label("s1", 640, 400, "Congress: the song names thirty crore Indians; the flag stands for all communities", 1, 0.6, color="#cfe0f0", size=17),
    label("s2", 640, 440, "March 1937: Khaliquzzaman had invited G. B. Pant to raise the tricolour in Lucknow", 1, 4.0, color="#cfe0f0", size=17),
    label("s3", 640, 530, "1938: a League flag · a League anthem · 'Qaid-i-Azam'", 2, 0.6, color="#c8f0dd", size=20),
    cite("CWC statement on Bande Mataram, 28 October 1937; Nehru to Jinnah, 6 April 1938; via Dhulipala, ch. 2", 0, 0.6),
], [
    L("Then came language, song and flag. The League attacked Hindustani as a disguise for Sanskritised Hindi, and the singing of Bande Mataram and the flying of the tricolour in schools as Hindu impositions."),
    L("Congress was incredulous. The song spoke of thirty crore Indians, all of them. The flag stood for every community. Only months earlier Khaliquzzaman himself had invited a Congress leader to raise that tricolour over Lucknow's municipal building."),
    L("But the League had found its theme. In 1938 it unfurled a flag of its own, adopted an anthem of its own, and at Patna it gave Jinnah a title to set beside the Mahatma's: Qaid-i-Azam, the Great Leader."),
], pal="smoke"))

seq.append(scene("symverdict", "void", [
    verdict("v1", 640, 230, "The fight over symbols laid the ground\nfor a claim of separate nationhood.", "strong", "Dhulipala, ch. 2; widely shared by historians of the period", 0, 0.4, w=620),
    verdict("v2", 640, 440, "Congress governments oppressed\nU.P. Muslims, 1937-39.", "debated", "League reports alleged it; the Governor doubted it; local Congressmen defended Hindu rioters (Kesavan)", 1, 0.4, w=620),
    cite("AIML Pirpur Report (1938); Mukul Kesavan, NMML occasional papers; via Dhulipala, ch. 2", 1, 0.6),
], [
    L("Dhulipala's point is that this war of symbols did more than score points. By refusing the nation's song and flag, the League was laying the ground for a claim that Muslims were a nation of their own. On that, most historians agree."),
    L("The League's charge of Congress tyranny is a different matter. Its reports alleged atrocities. The Governor did not believe Congress had abetted them. But the historian Mukul Kesavan has shown that well-known local Congressmen did organise the legal defence of Hindus arrested in riots. The truth sits uncomfortably in between."),
], pal="ink", cam={"zoom": [1.0, 1.02], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 4 ----------------
seq.append(chapter("ch4", 4, "Six By-Elections", "1937 – 1938", color=RED))

seq.append(scene("jhansi", "void", [
    upmap([{"name": "Jhansi", "at": JHANSI, "note": "July 1937", "pin": True, "color": JADE, "left": True}], 0, {"0": {"lit": 1, "d": 1.0, "t": 1.0}}, nb=0.35),
    {"id": "pn", "type": "panel", "x": 930, "y": 480, "w": 470, "h": 200, "in": 1, "d": 0.3, "anim": "fade"},
    doc("fs", 930, 260, "FIDA SHERWANI TO NEHRU", "30 June 1937 (excerpt)", ["'heartless neglect of us by the", "so-called socialist party in power'"], 0, 2.0, w=470, rot=1.5),
    label("j1", 930, 420, "Rs 700, borrowed on Nehru's own surety", 1, 0.6, color="#e8cfa0", size=18),
    label("j2", 930, 460, "'bicycles are good enough'", 1, 3.0, color="#e8cfa0", size=18),
    label("j3", 930, 540, "Nehru's car is stoned", 2, 3.6, color="#ff9a8a", size=19),
    cite("AICC Papers, File G-61/1937; via Dhulipala, ch. 2", 0, 0.6),
], [
    L("The test came at the ballot box. In Jhansi the Congress candidate, Nisar Sherwani, was an outsider and broke. His brother wrote to Nehru from a sickbed about the heartless neglect of the so-called socialist party in power. The party's star Muslim orators would not come."),
    L("Nehru took charge himself. He raised seven hundred rupees on his own surety, told the candidate that bicycles were good enough and motor cars a waste, and arranged loudspeakers and workers for all eighty polling booths."),
    L("The League ran on a single cry: Islam in danger. Shaukat Ali, the old Khilafat hero, spoke of a coming civil war and of making a 'Spain of India'. When Nehru came to campaign, League supporters stoned his car."),
], pal="ink"))

seq.append(scene("letter", {"kind": "room", "pal": "archive"}, [
    doc("nl", 640, 330, "NEHRU TO RAFI AHMAD KIDWAI", "July 1937 · delivered to the wrong Rafi",
        ["... arrangements for the", "maulanas' expenses ..."], 0, 0.6, w=480, rot=-1, cps=20, sfx="type", vol=0.4, stamp="MISDELIVERED", stampOn=0, keys={"1": {"stampOn": 1, "d": 0.6, "t": 0.3}}),
    cite("Nehru to Gandhi, 13 July 1937; Hindustan, September 1937, 'Did the Congress bribe the Jamiat?'; via Dhulipala, ch. 2", 0, 0.6),
], [
    L("Then fate took a hand. A letter from Nehru to the Congress manager, Rafi Ahmad Kidwai, was delivered by mistake to the League candidate, Rafiuddin Ahmad."),
    L("Pro-League papers printed a version of it which, they claimed, showed Congress paying the clerics who campaigned for it. Congress later published the real text to refute the charge. It made no difference. Those clerics were branded as men who had sold their community for money, a charge that followed them for the rest of British rule."),
], cam={"zoom": [1.08, 1.0], "pan": [[0, 0], [0, 0]]}))

rows = [("Bahraich", BAHRAICH, "Mar 1937", "Congress, unopposed", "#e3a857", False), ("Jhansi", JHANSI, "Jul 1937", "League · 60%", JADE, True),
        ("Bijnor", BIJNOR, "Oct 1937", "Congress · 70%", "#e3a857", False), ("Moradabad", MORAD, "Dec 1937", "League", JADE, False),
        ("Saharanpur", SAHAR, "Dec 1937", "League · ~60%", JADE, True), ("Bulandshahr", BULAND, "Dec 1937", "League", JADE, True),
        ("Badayun", BADAYUN, "Sep 1938", "League · 75%", JADE, False)]
els = [upmap([{"name": n, "at": at, "color": c, "left": lf} for n, at, _, _, c, lf in rows], 0, {"0": {"lit": 3, "d": 0.6, "t": 6}, "1": {"lit": 7, "d": 0.6, "t": 4}}, nb=0.35)]
els.append({"id": "pn", "type": "panel", "x": 1015, "y": 380, "w": 450, "h": 480, "anim": "fade"})
for i, (n, at, d, r, c, lf) in enumerate(rows):
    ln, dl = (0, 0.6 + i * 2.0) if i < 3 else (1, 0.6 + (i - 3) * 1.0)
    els.append(label(f"r{i}", 820, 170 + i * 44, f"{d}   {n}", ln, dl, color="#e8cfa0", size=17, anchor="start"))
    els.append(label(f"q{i}", 1210, 170 + i * 44, r, ln, dl + 0.3, color=c, size=17, anchor="end"))
els += [label("t1", 1010, 520, "Congress 1 · League 5", 1, 5.2, font="bebas", color=BONE, size=46, ls=3),
        label("t2", 1010, 570, "contested by-elections, March 1937 to September 1938", 1, 6.0, color="#b8a888", size=15),
        cite("Reeves, Graham and Goodman (1975); Hindustan, 1937-38; via Dhulipala, ch. 2", 0, 0.6)]
seq.append(scene("tally", "void", els, [
    L("Bijnor, in October, went the other way. The League told voters that a vote for Congress was a vote for unbelief, and accused the Congress candidate of apostasy. He won anyway, with seventy percent. One League orator who claimed the pro-Congress clerics had been bribed was taken to court by the local paper, Madina, and had to apologise."),
    L("But in December the League took Moradabad, Saharanpur and Bulandshahr, all rural seats where poorer Muslims had been expected to back Congress. In 1938 it took Badayun with three quarters of the vote. Of the contested by-elections, Congress won one. The League won five."),
], pal="ink"))

seq.append(scene("bier", "void", [
    {"id": "f", "type": "figures", "x": 640, "y": 640, "n": 10, "cols": 10, "w": 760, "rowh": 70, "size": 1.0, "color": "#1a140e", "anim": "rise", "banner": "A LEAGUE CARTOON, MORADABAD", "bannerColor": "#d8c8a8"},
    label("b1", 640, 170, "a Congress Muslim carried on a Hindu bier to the burning ghat", 0, 1.0, color="#ff9a8a", size=19),
    label("b2", 640, 220, "'contrast the beginning to the end'", 0, 4.4, color="#e8cfa0", size=19),
    label("b3", 640, 320, "Congress analysis: upper-class votes, dependent tenants, and money", 1, 0.8, color="#cfe0f0", size=17),
    cite("AICC Papers G-32/1938; Hindustan, 16 January 1938; via Dhulipala, ch. 2", 0, 0.6),
], [
    L("League posters in Moradabad showed the Congress Muslim candidate carried on a Hindu bier to the cremation ground, with the caption: contrast the beginning to the end. Join Congress, it meant, and you would die an unbeliever."),
    L("Congress blamed landlords who herded their tenants to the polls, and money. Some of that was surely true. But it could not explain why the gap kept widening."),
], pal="smoke"))

# ---------------- chapter 5 ----------------
seq.append(chapter("ch5", 5, "The Hakim al-Ummat", "Thana Bhawan · 1937 – 1939", color=GOLD))

seq.append(scene("thanawi", "void", [
    dossier("t", 330, 360, "Ashraf Ali Thanawi", "Deobandi scholar,\n'Physician of the Community'", "1863 – 1943", 0, 0.6, hat="turban", beard=True, tag="FOR THE LEAGUE", tagColor="#2f6f5a"),
    quote("tq", 880, 230, "the League is a one-eyed man;\nthe Congress is a blind one", "Thanawi to his circle (paraphrase)", 0, 4.0, size=24, w=520),
    label("t1", 880, 400, "questionnaire to the Jamiat: no reply", 1, 0.6, color="#ff9a8a", size=18),
    label("t2", 880, 445, "questionnaire to the League: answers to every question", 1, 2.6, color="#c8f0dd", size=18),
    label("t3", 880, 520, "1 Muslim in 21 on Congress's Working Committee", 2, 0.6, color="#e8cfa0", size=17),
    cite("Mufti Muhammad Shafi (ed.), Ifadat-i-Ashrafiya (1945); via Dhulipala, ch. 2", 0, 0.6),
], [
    L("The man behind that telegram, Ashraf Ali Thanawi, was perhaps the most influential Islamic scholar in South Asia. His guide to women's conduct, Bihishti Zewar, was part of almost every bride's dowry in north India. He despised Gandhi. But at first he thought little better of the League. It was, he told his circle, a one-eyed man. Congress was a blind one."),
    L("He sent long questionnaires to both sides. The Congress-allied Jamiat ignored his. The League's provincial president answered every question in detail."),
    L("Muslims inside Congress, the League argued, would always be outvoted: one Muslim on a Working Committee of twenty-one. Only standing apart, as a nation of their own, would make the world listen."),
], pal="ink"))

seq.append(scene("patna", {"kind": "room", "pal": "archive"}, [
    slate("PATNA · LEAGUE SESSION"),
    typer("p1", 640, 200, "'religion and politics should be kept apart'", 0, 0.6, size=24, font="serif", italic=True, color="#b8a888", cursor=False),
    typer("p2", 640, 260, "'Islam is not just a religion but a total way of life'", 1, 0.6, size=26, font="serif", italic=True, color=GOLD, cursor=False),
    {"id": "f", "type": "figures", "x": 640, "y": 640, "n": 12, "cols": 12, "w": 900, "rowh": 70, "size": 0.9, "color": "#1a140e", "in": 2, "d": 0.4, "anim": "rise"},
    verdict("v", 640, 420, "Thanawi's circle changed Jinnah's language.", "debated", "Rests on Zafar Ahmad Usmani's own later account", 2, 3.0, w=600),
    cite("Zafar Ahmad Usmani's recollection, in Ahmad Saeed (1972); via Dhulipala, ch. 2", 0, 0.6),
], [
    L("Thanawi's fatwa backing the League was read out at its session in Patna by his disciple Zafar Ahmad Usmani. Usmani later left an account of what happened there. The clerics met Jinnah the night before, he said, and told him that Muslims were a religious community. Jinnah answered that religion and politics should be kept apart. That, the clerics replied, was a European idea."),
    L("The next day, Usmani recalled, Jinnah told the session that Islam was not just a religion but a total way of life."),
    L("At one o'clock the session stopped for prayers. Jinnah, worried about whether a Sunni or a Shia should lead, stood behind the town's qazi, and the whole gathering stood behind him. It is a memorable scene, but it comes from one partisan memoir, written years later."),
], cam={"zoom": [1.06, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("parrot", "void", [
    dossier("md", 250, 350, "Husain Ahmad Madani", "Principal, Deoband;\ncomposite nationalism", "1879 – 1957", 0, 0.4, hat="turban", beard=True, tag="FOR THE CONGRESS", tagColor="#8a5a2a", w=200, h=270),
    {"id": "mm", "type": "samap", "view": "wide", "x": 780, "y": 400, "k": 1.25, "split": 0, "nb": 0.6, "anim": "fade", "in": 0, "d": 2.0,
     "cities": [{"name": "Medina", "note": "the Prophet's covenant", "pin": True, "color": GOLD}]},
    typer("pr", 820, 180, "The grocer's parrot", 1, 1.0, size=30, font="serif", italic=True, color=GOLD, cursor=False),
    label("pr1", 820, 230, "Rumi, Masnavi, Book One", 1, 2.0, color="#b8a888", size=16),
    cite("Ifadat-i-Ashrafiya (1945); Rumi, The Masnavi, Book One, trans. Jawid Mojaddedi (2004); Barbara Metcalf, Husain Ahmad Madani (2009); via Dhulipala, ch. 2", 0, 0.6),
], [
    L("Thanawi's real target was a fellow Deobandi, Husain Ahmad Madani. Madani taught that Hindus and Muslims of India were one nation, and found a precedent in the covenant the Prophet made with the Jews of Medina. Thanawi answered that in that covenant Muslims led and the Jews followed, and the Prophet judged their disputes. No such terms bound Congress."),
    L("Then he mocked his rival with a story from Rumi. A grocer strikes his parrot and leaves it bald. Later a bald monk walks past, and the parrot cries out: did you spill the oil too? The bird took a stranger for its equal. So, Thanawi implied, did clerics who thought themselves fit to reinterpret the tradition like the great scholars of the past. When Deoband welcomed a Hindu Congress leader at its station, Thanawi resigned as its patron, and had his resignation posted on the seminary's gates."),
], pal="smoke"))

# ---------------- chapter 6 ----------------
seq.append(chapter("ch6", 6, "Deliverance", "22 December 1939", color=RED))

seq.append(scene("members", "void", [
    {"id": "dc", "type": "dots", "x": 380, "y": 240, "n": 10, "cols": 10, "size": 12, "gap": 30, "color": "#e3a857", "anim": "fade"},
    label("dcl", 380, 300, "Congress: 100,000 Muslim members (its own claim)", 0, 1.2, color="#ffd8a8", size=17),
    {"id": "dl", "type": "dots", "x": 900, "y": 225, "n": 30, "cols": 10, "size": 12, "gap": 30, "color": JADE, "in": 0, "d": 3.2, "anim": "fade"},
    label("dll", 900, 330, "League: 300,000 members (its own claim)", 0, 4.4, color="#c8f0dd", size=17),
    quote("aq", 640, 500, "I feel like a parasite.", "K. M. Ashraf to Nehru, 2 September 1938 (paraphrase)", 1, 0.6, size=28, w=520),
    cite("Towards Freedom 1938, part 1; via Dhulipala, ch. 2", 0, 0.6),
], [
    L("By early 1938, Congress said it had enrolled a hundred thousand Muslims. The League claimed three hundred thousand. Both were party figures, but the direction was clear."),
    L("Riots tore through the province. By the middle of 1938 the mass contact programme had quietly been shut down. Ashraf wrote to Nehru that he was left doing routine office work, and felt like a parasite."),
], pal="ink"))

seq.append(scene("deliver", {"kind": "room", "pal": "archive"}, [
    doc("dd", 380, 300, "DAY OF DELIVERANCE", "M. A. Jinnah, call to Muslims, December 1939 (substance)",
        ["Give thanks for deliverance from", "Congress rule, after Friday prayers.", "Observe humility; give no offence."], 0, 0.6, w=470, rot=-1),
    quote("mq", 920, 230, "not one but several\nnations in India", "Raja of Mahmudabad to Jinnah", 1, 0.6, size=24, w=440),
    quote("hq", 920, 450, "meetings were smaller\nthan expected", "Governor Hallett to the Viceroy, 1 January 1940", 2, 0.6, size=22, w=440),
    cite("Liaquat to Jinnah, 27 November 1939; Mahmudabad to Jinnah, 29 November 1939; Hallett Papers; via Dhulipala, ch. 2", 0, 0.6),
], [
    L("Then, in November 1939, the Congress ministries resigned in protest at India being taken into the war without its consent. Jinnah called on Muslims to celebrate a Day of Deliverance, with prayers of thanks after Friday worship."),
    L("The Raja of Mahmudabad told Jinnah it showed, without ambiguity, that there were not one but several nations in India."),
    L("Others saw less. Some League men refused to take part. Nehru called it a failure, and the new Governor reported that meetings were smaller than expected. The League had won the argument against Congress. Now it had to say what it was for. Three months later, at Lahore, it tried."),
], cam={"zoom": [1.06, 1.0], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 7 ----------------
seq.append(chapter("ch7", 7, "What the Historians Say", "Testing the chapter", color=AMBER))

seq.append(scene("tests", "void", [
    verdict("v1", 340, 220, "The League out-mobilised Congress\namong U.P. Muslims, 1937-39.", "strong", "By-election results; membership figures are party claims", 0, 0.4, w=560),
    verdict("v2", 940, 220, "Thanawi's Deobandis were a critical,\nneglected factor in the League's rise.", "partial", "Fatwas and posters documented; their effect on votes is hard to measure", 1, 0.4, w=560),
    verdict("v3", 340, 470, "Mass contact failed because it\nignored religion and culture.", "debated", "Also: party neglect, riots, landlord pressure, money", 2, 0.4, w=560),
    verdict("v4", 940, 470, "Congress's refusal to share power\nin 1937 made Pakistan.", "contested", "Azad and Khaliquzzaman said so; Dhulipala looks past it", 3, 0.4, w=560),
], [
    L("So what holds up? That the League out-mobilised Congress among U.P. Muslims between 1937 and 1939: well supported, by the by-election results. The membership numbers are claims, so set them aside."),
    L("That the Deobandi scholars around Thanawi were a critical and neglected factor: supported, with caveats. The fatwas and posters are on record. How many votes they moved, no one can say."),
    L("That mass contact failed because it spoke only of bread and ignored faith: debated. Congress's own letters show neglect, money troubles and quarrels, and the riots did their own damage."),
    L("And the old claim that Congress's refusal to share power in 1937 created Pakistan: contested. It was made by men on both sides. Dhulipala's point is that what the League built after that refusal mattered more."),
], pal="smoke", cam={"zoom": [1.0, 1.02], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("now", "void", [
    typer("h1", 640, 240, "Bread, or belonging?", 0, 0.4, size=44, font="serif", italic=True, cursor=False, cps=20),
    label("h2", 640, 340, "class appeals against identity appeals: still the argument, everywhere", 1, 0.6, color="#b8a888", size=18),
    label("h3", 640, 380, "(our observation, not the book's)", 1, 2.6, color="#8a7e68", size=15),
], [
    L("Strip away the names and this chapter describes an argument that has never ended. One side says people vote their interests: wages, land, prices. The other says people vote who they are."),
    L("In 1937 Nehru bet on bread. The League bet on belonging, and won. Politicians from India to Europe to America are still placing the same bet today. That last thought is ours, not the book's."),
    beat(1.6, "heart"),
], pal="blood"))

seq.append(next_card(4, "Two Lawyers from Bombay", "Ambedkar · Jinnah · 1940 – 1944",
                     "Next time: the League demands Pakistan, and a book by Dr B. R. Ambedkar becomes the guide everyone argues over. Maps, money, armies and the question no one could answer: what would Pakistan actually be?"))

seq.append({"type": "card", "id": "end", "style": "endx", "title": SERIES, "dur": 26, "credits": credits_block(
    ["AICC Papers (Nehru, Ashraf, Sherwani correspondence), NMML", "Hindustan (Allahabad), 1937-38 · Zulqarnain · Madina (Bijnor)", "Linlithgow, Haig and Hallett Papers",
     "AIML, Pirpur Report (1938) · Ifadat-i-Ashrafiya, ed. Mufti Muhammad Shafi (1945)", "Selected Works of Jawaharlal Nehru · Towards Freedom, 1937-38"],
    ["Muhammad Qasim Zaman, Ashraf Ali Thanawi (2008) · Barbara Metcalf, Husain Ahmad Madani (2009)", "Salil Misra, A Narrative of Communal Politics (2001) · Mukul Kesavan, NMML papers",
     "Horst Kruger (ed.), Kunwar Mohammad Ashraf (1969) · K. K. Aziz, Muslims under Congress Rule (1978)", "Rumi, The Masnavi, Book One, trans. Jawid Mojaddedi (2004)"])})

ep = {"meta": meta(3, "Four-Anna Members",
                   "Shut out of power in 1937, the Muslim League took on Nehru's campaign to win Muslims with economics. Episode 3 follows the by-elections, the war over flags, songs and schools, a Sufi scholar's telegram and a bald parrot from Rumi, as a party 'neither dead nor alive' became a mass movement.",
                   BOOK + ", chapter 2; AICC Papers, the Hindustan weekly, Thanawi's collected opinions and governors' letters as quoted there."),
      "cast": CAST, "sequence": seq}

if __name__ == "__main__":
    write(SLUG, ep)
