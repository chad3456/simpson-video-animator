"""Episode 2: "The Broken Coalition" (book chapter 1: Nationalists, Communalists and the 1937 Provincial Elections)."""
from common import *

SLUG = "new-medina-e02-the-broken-coalition"
seq = []

# ---------------- cold open ----------------
seq.append({"type": "card", "id": "open", "style": "intertitle", "lines": ["Bijnor, United Provinces.", "April 1936."], "sub": "A SMALL-TOWN NEWSPAPER PASSES JUDGEMENT", "dur": 5.0, "sfx": "type"})

seq.append(scene("verdict36", {"kind": "room", "pal": "archive"}, [
    slate("BIJNOR · APRIL 1936"),
    doc("m", 640, 350, "MADINA, BIJNOR", "Notes on the Press, 25 April 1936 (excerpt)",
        ["The Muslim League ... can be said to", "be neither dead nor alive.", "", "It has no existence beyond", "the brain and mind of Mr. Jinnah."],
        0, 0.6, w=520, rot=-1.5, cps=22, sfx="type", vol=0.4, hl=1, hlOn=0, keys={"1": {"hlOn": 1, "d": 0.3, "t": 0.6}}),
    cite("Madina (Bijnor), in Notes on Newspapers, United Provinces, 25 April 1936; quoted in Dhulipala, ch. 1", 0, 0.8),
], [
    L("In the spring of 1936, a newspaper in the small town of Bijnor gave its verdict on the All-India Muslim League."),
    L("The party, it said, was 'neither dead nor alive'. Muslims did not know where its offices were, or what it stood for. It existed only in the mind of one man, Mr Jinnah."),
    L("Eleven years later, that party would divide a subcontinent."),
    beat(1.8, "heart"),
], cam={"zoom": [1.1, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("hook", "void", [
    typer("q1", 640, 250, "In 1936, who was a nationalist,", 0, 0.4, size=34, font="serif", italic=True, cursor=False, cps=26),
    typer("q2", 640, 310, "and who was a communalist?", 0, 2.4, size=34, font="serif", italic=True, cursor=False, cps=26, color=GOLD),
    label("ans", 640, 430, "In the United Provinces, nobody could yet say.", 1, 0.6, color="#e8cfa0", size=20),
], [
    L("Hindsight draws a straight line from here to partition. Dhulipala's first chapter rubs that line out. In 1936, he argues, nobody in the United Provinces could yet say who was a nationalist and who was a communalist."),
    L("In fact, this province looked like the best place in India to build a united front of Hindus and Muslims against the Raj. This is the story of how that chance was lost."),
], pal="ink"))

seq.append({"type": "card", "id": "title", "style": "titlex", "kicker": "A LUMEN DOCUMENTARY IN TEN PARTS", "title": SERIES,
            "sub": "Episode 2 · The Broken Coalition", "by": "after the book by Venkat Dhulipala (2015)", "dur": 7.0, "sfx": "boom"})

# ---------------- chapter 1 ----------------
seq.append(chapter("ch1", 1, "The Bait", "Government of India Act · 1935"))

seq.append(scene("act", "void", [
    {"id": "m", "type": "samap", "x": 470, "y": 372, "k": 1.05, "split": 0, "und": 1, "nb": 0.6, "up": 0, "anim": "fade",
     "cities": [{"name": "Delhi", "note": "the Viceroy keeps the centre", "pin": True, "left": True}], "lit": 0, "keys": {"0": {"lit": 1, "d": 3.5, "t": 0.8}, "2": {"up": 1, "d": 0.4, "t": 1.2}}},
    label("a1", 1000, 180, "provinces: elected ministers", 0, 1.2, color="#c8f0dd"),
    label("a2", 1000, 230, "centre: the Viceroy, unchanged", 0, 4.2, color="#ff9a8a"),
    quote("lq", 1000, 360, "to destroy the effectiveness\nof the Congress", "Lord Linlithgow, Viceroy, private letter, 5 March 1937", 1, 1.6, size=24, w=460),
    {"id": "st", "type": "stat", "x": 1000, "y": 545, "value": 1600000, "size": 46, "color": GOLD, "label": "U.P. voters, 1930 to 1937", "in": 2, "d": 0.6, "anim": "fade",
     "keys": {"2": {"value": 5000000, "d": 1.2, "t": 2.5}}},
    cite("Linlithgow to Zetland, MSS EUR F 125/4/12; Reeves, Graham and Goodman, Handbook of Elections in U.P. (1975); via Dhulipala, ch. 1", 1, 0.6),
], [
    L("The Government of India Act of 1935 offered Indians real power, but only in the provinces. Elected ministers would run them. In Delhi, the Viceroy kept everything that mattered."),
    L("It was not generosity. The Viceroy, Lord Linlithgow, admitted in private that he was counting on provincial autonomy to destroy the effectiveness of Congress as an all-India instrument of revolution."),
    L("Offices would be the bait. Seats were weighted towards the countryside, where the landlords, the Raj's old allies, held sway. Still, in the United Provinces the vote grew from about one and a half million people to over five million."),
], pal="ink"))

seq.append(scene("split", "void", [
    {"id": "m", "type": "samap", "x": 560, "y": 372, "k": 1.05, "split": 0, "und": 0.6, "nb": 0.5, "up": 0, "anim": "fade",
     "cities": [{"name": "Lahore", "note": "Punjab: Fazl-i-Husain", "left": True, "color": "#7fb2d9"}, {"name": "Calcutta", "note": "Bengal", "color": "#7fb2d9"}, {"name": "Lucknow", "note": "U.P.: a minority", "color": AMBER}],
     "lit": 0, "keys": {"0": {"lit": 2, "d": 0.6, "t": 3}, "1": {"lit": 3, "up": 1, "d": 0.6, "t": 1.5}}},
    quote("fq", 1020, 230, "a realist first and\na communalist next", "Bombay Chronicle on Fazl-i-Husain, 1936", 0, 3.5, size=24, w=420),
    label("u1", 1020, 430, "Unionists: Muslim-led, with Hindu Jat", 0, 6.5, color="#cfe0f0", size=17),
    label("u2", 1020, 465, "and Sikh landlords as allies", 0, 7.5, color="#cfe0f0", size=17),
    cite("Jalal and Seal, 'Alternative to Partition' (1981); Indian Annual Register 1936; via Dhulipala, ch. 1", 0, 0.6),
], [
    L("The Act also split Muslim politics. In Punjab, where Muslims were a majority, Sir Fazl-i-Husain built the Unionist Party, a Muslim-led alliance with Hindu and Sikh landlords. A newspaper called him 'a realist first and a communalist next'."),
    L("Majority-province leaders like him were happy with the Act. Muslims from the minority provinces, like the United Provinces, were not. Their priorities looked much closer to those of Congress."),
], pal="ink"))

# ---------------- chapter 2 ----------------
seq.append(chapter("ch2", 2, "The Heart of Muslim India", "Jinnah returns · 1934 – 1936", color=GOLD))

seq.append(scene("return", "void", [
    dossier("j", 330, 360, "M. A. Jinnah", "President, All-India\nMuslim League", "1876 – 1948", 0, 0.6, hat="none", tag="BACK FROM LONDON", tagColor="#6a5a8a"),
    {"id": "dt", "type": "dots", "x": 860, "y": 220, "n": 300, "cols": 25, "size": 6, "gap": 16, "color": "#8a7e68", "alt": 92, "altColor": "#e0393e", "in": 1, "d": 0.3, "anim": "fade"},
    label("dt1", 860, 340, "League council: 300 members, 92 behind on their dues", 1, 1.0, color="#e8cfa0", size=17),
    label("dt2", 860, 380, "1933: spending exceeded income", 1, 3.5, color="#b8a888", size=16),
    quote("hq", 860, 520, "the heart of Muslim India", "Jinnah on the United Provinces, 1936", 2, 1.6, size=28, w=480),
    cite("Z. H. Zaidi in Phillips and Wainwright (1970); S. S. Pirzada, Foundations of Pakistan; via Dhulipala, ch. 1", 1, 0.6),
], [
    L("In 1934 Jinnah came home after four years of self-imposed exile in London, and took over a party that barely existed."),
    L("Its council had three hundred members. Ninety-two were behind on their dues. It was spending more than it earned."),
    L("Jinnah's plan was not separation. He wanted a revived League to unite Muslims on a nationalist platform and, in his words, march together with the Hindus for the freedom of the country. It had to begin in the United Provinces, which he called the heart of Muslim India."),
], pal="ink"))

seq.append(scene("mub", "void", [
    {"id": "c1", "type": "card", "x": 320, "y": 250, "w": 300, "h": 200, "glyph": "people", "title": "Muslim Unity Board", "color": "#3a6a5a", "anim": "pop", "sfx": "pop", "vol": 0.4},
    label("m1", 320, 390, "Congress-linked Muslims", 0, 1.4, color="#c8f0dd", size=17),
    label("m2", 320, 425, "+ ulama of the Jamiatul Ulama-i-Hind", 0, 2.6, color="#c8f0dd", size=17),
    {"id": "c2", "type": "card", "x": 960, "y": 250, "w": 300, "h": 200, "glyph": "home", "title": "National Agriculturalists", "color": "#6a4a2a", "in": 1, "d": 0.3, "anim": "pop", "sfx": "pop", "vol": 0.4},
    label("n1", 960, 390, "Hindu and Muslim landlords", 1, 1.4, color="#ffd8a8", size=17),
    label("n2", 960, 425, "encouraged by the government", 1, 2.8, color="#ffd8a8", size=17),
    typer("vs", 640, 260, "?", 2, 0.2, size=60, font="serif", color=GOLD, cursor=False),
    label("jn", 640, 560, "Jinnah's sympathies: the Unity Board. His need: anyone who would join.", 2, 1.2, color="#e8cfa0", size=18),
    cite("Dhulipala, ch. 1", 0, 0.6),
], [
    L("In the United Provinces the strongest Muslim group was the Muslim Unity Board: politicians close to Congress, allied with the religious scholars of the Jamiatul Ulama-i-Hind."),
    L("Against them stood the National Agriculturalist Party, Hindu and Muslim landlords brought together with the government's quiet encouragement."),
    L("Jinnah's sympathies lay with the Unity Board. But he was a pragmatist. His League would take anyone willing to sign its programme, even for appearances' sake."),
], pal="smoke"))

# ---------------- chapter 3 ----------------
seq.append(chapter("ch3", 3, "Left and Right", "Lucknow · 1936", color=SKY))

board = [("Khaliquzzaman", "MUB · ex-Congress", "topi", True), ("Shaukat Ali", "MUB · Khilafatist", "topi", True), ("H. A. Madani", "MUB · Deoband", "turban", True),
         ("Nawab Ismail Khan", "MUB", "karakul", False), ("Nawab of Chhatari", "landlord · NAP", "karakul", False), ("Liaquat Ali Khan", "landlord · NAP", "none", False),
         ("Sir M. Yusuf", "landlord · NAP", "karakul", False), ("Raja of Mahmudabad", "Jinnah's ally", "none", False), ("Raja of Salempur", "between the camps", "karakul", False)]
els = []
for i, (n, r, hat, beard) in enumerate(board):
    col = i % 5 if i < 5 else (i - 5)
    row = 0 if i < 5 else 1
    x = 160 + col * 240 + (120 if row else 0)
    y = 228 + row * 250
    tag, tc = ("LEFT", "#3a6ea5") if i < 4 else ("RIGHT", "#8a5a2a") if i < 7 else (("ALLY", "#6a5a8a") if i == 7 else ("BOTH", "#5a6a4a"))
    els.append(dossier(f"b{i}", x, y, n, r, "", 0 if i < 4 else 1, 0.3 + (i % 4) * 0.5, hat=hat, beard=beard, w=180, h=240, tag=tag, tagColor=tc))
els.append(cite("Haig to Linlithgow, 21 May 1936, Haig Papers; via Dhulipala, ch. 1", 0, 0.6))
seq.append(scene("board", "void", els, [
    L("In April 1936 Jinnah named a nine-man board to pick the League's candidates in the United Provinces. Four came from the Unity Board, Congress men or former Congress men, Madani of Deoband among them."),
    L("Five were landlords from the agriculturalist camp. As the Governor reported, the landlords had joined to take over the party and blunt its radical edge."),
    L("It was, in Dhulipala's phrase, a ramshackle coalition. It began to tear almost at once."),
], pal="ink", cam={"zoom": [1.0, 1.03], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("tear", "void", [
    doc("d1", 330, 300, "STATEMENT · NAWAB OF CHHATARI", "The Pioneer, July 1936 (paraphrase)", ["Communal parties in the assembly", "will keep Muslims a permanent", "minority. Mixed parties are safer."], 0, 0.4, w=430, rot=-2),
    doc("d2", 930, 300, "STATEMENT · LIAQUAT ALI KHAN", "August 1936", ["Resigns from the board, attacking", "'a cabal and a clique'."], 1, 0.4, w=430, rot=2, hl=1, hlOn=0, keys={"1": {"hlOn": 1, "d": 3.0, "t": 0.6}}),
    quote("kq", 640, 540, "I broadly divide the Muslim political groups\ninto progressive and reactionary.", "Khaliquzzaman, August 1936", 2, 0.4, size=24, w=760),
    cite("The Pioneer, 28 July 1936; Zulqarnain, 21 August 1936; via Dhulipala, ch. 1", 0, 0.6),
], [
    L("The Nawab of Chhatari and Sir Muhammad Yusuf walked out first. Muslim communal parties in the assembly, Chhatari warned, would turn Muslims into a permanent minority. Mixed parties of Hindus and Muslims were safer."),
    L("Then Liaquat Ali Khan, the man who had persuaded Jinnah to come home, resigned too, denouncing 'a cabal and a clique'. In 1937 he stood for election as an independent. Fourteen years later he would be Pakistan's first prime minister."),
    L("The left wing cheered them out. Khaliquzzaman divided Muslim politics into progressives and reactionaries, and left no doubt which side the League was on."),
], pal="ink"))

seq.append(scene("manifesto", "void", [
    doc("mf", 360, 320, "MUSLIM LEAGUE ELECTION MANIFESTO", "U.P., 8 June 1936 (summary)", ["Close to the Congress manifesto.", "", "Hailed by K. M. Ashraf, Nehru's", "socialist lieutenant, as", "'progressive and liberal in spirit'."], 0, 0.4, w=480, rot=-1, hl=4, hlOn=0, keys={"0": {"hlOn": 1, "d": 5.0, "t": 0.6}}),
    verdict("v", 930, 545, "In 1936 the U.P. League looked more\n'nationalist' than many of its rivals.", "partial", "Dhulipala, ch. 1; others stress the League's elite base", 1, 0.6, w=600),
    cite("Dhulipala, ch. 1", 0, 0.6),
], [
    L("The manifesto the League issued that June was so close to Congress's own that K. M. Ashraf, a socialist and one of Nehru's trusted lieutenants, praised it as 'progressive and liberal in spirit'."),
    L("So the party later blamed for partition entered the 1937 election looking more nationalist than many of its rivals. It is one of the book's quieter surprises."),
], pal="smoke"))

# ---------------- chapter 4 ----------------
seq.append(chapter("ch4", 4, "The Landlords' Party", "Agra and Oudh · 1936", color=AMBER))

seq.append(scene("nap", {"kind": "room", "pal": "sepia"}, [
    doc("ven", 640, 330, "MEMOIRS OF C. S. VENKATACHAR, ICS", "British Library, MSS Eur 180/85 (excerpt)",
        ["In 1936 the development plan", "I was operating from Lucknow", "became a front to promote the", "electoral prospects for the", "landlords of Agra and Oudh."],
        0, 0.6, w=500, rot=1, cps=26, sfx="type", vol=0.4, hl=2, hlOn=0, keys={"1": {"hlOn": 1, "d": 0.4, "t": 0.6}}),
    label("rd", 640, 610, "270 rural development circles · 12 villages each", 1, 2.5, color="#e8cfa0", size=17),
    cite("Memoirs of C. S. Venkatachar, OIOC; via Dhulipala, ch. 1", 0, 0.6),
], [
    L("The landlords had a powerful friend: the government. A rural development scheme, funded from Delhi, set up two hundred and seventy circles of villages across the province."),
    L("A senior official, C. S. Venkatachar, later admitted what it was for. The development plan he ran from Lucknow, he wrote, became a front to promote the electoral prospects of the landlords."),
    L("Officials helped clear independents out of the landlords' way. In two seats the Congress candidates' nomination papers were simply rejected, and the landlord walked in unopposed."),
], cam={"zoom": [1.06, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("napsplit", "void", [
    {"id": "sc", "type": "scale", "x": 640, "y": 265, "s": 0.85, "tilt": 0, "left": "people", "right": "people", "anim": "pop", "keys": {"1": {"tilt": -0.7, "d": 2.5, "t": 1.2}}},
    label("l1", 480, 395, "Hindu wing: J. P. Srivastava", 0, 1.0, color="#ffd8a8", size=17),
    label("l2", 800, 395, "Muslim wing: Nawab Yusuf", 0, 2.0, color="#c8f0dd", size=17),
    quote("pq", 640, 510, "a province which was 80 per cent Hindu\ncould not have a Muslim Premier", "Hindu landlords opposing Chhatari, as reported by the Governor", 1, 1.8, size=22, w=760),
    cite("Haig to Linlithgow, 1936-37, Haig Papers; via Dhulipala, ch. 1", 0, 0.6),
], [
    L("But the landlords' party split along the very line it claimed to transcend. It ran openly as a Hindu wing and a Muslim wing."),
    L("When the Nawab of Chhatari, a former acting Governor, expected to be premier, Hindu landlords objected that a province eighty percent Hindu could not have a Muslim premier."),
], pal="ink"))

# ---------------- chapter 5 ----------------
seq.append(chapter("ch5", 5, "Strange Bedfellows", "The 1937 campaign", color=JADE))

seq.append(scene("pact", "void", [
    {"id": "st", "type": "stat", "x": 330, "y": 300, "value": 0, "size": 130, "color": JADE, "label": "head-on Congress v. League seats", "in": 0, "d": 0.6, "anim": "fade", "keys": {"0": {"value": 3, "d": 1.4, "t": 1.4}}},
    quote("nq", 900, 230, "vote for the League candidate\nwhere there is no Congress one", "Nehru on his tour of Muslim areas, 1937 (paraphrase)", 1, 0.4, size=22, w=480),
    verdict("kv", 900, 470, "The Congress leader Rafi Kidwai gave Rs 5,000\nto a League candidate to beat a landlord.", "weak", "One police intelligence report (CID), January 1937", 2, 0.4, w=560),
    cite("Oral histories, NMML; Police Abstract of Intelligence, 1937; via Dhulipala, ch. 1", 1, 0.6),
], [
    L("Congress and the League fought a common enemy: the landlords. In the whole province, they faced each other in only three seats."),
    L("Nehru, touring Muslim areas, told voters that where there was no Congress candidate, they should vote for the League's."),
    L("A police intelligence report even claimed that the Congress leader Rafi Ahmad Kidwai had slipped five thousand rupees to a League candidate in Allahabad to beat a landlord. It is a single police source, so treat it with care."),
], pal="ink"))

seq.append(scene("madani37", "void", [
    dossier("m", 330, 360, "Husain Ahmad Madani", "campaigned for the\nMuslim League, 1937", "Deoband", 0, 0.6, hat="turban", beard=True, tag="FOR THE LEAGUE", tagColor="#2f6f5a"),
    label("m1", 880, 200, "British famines, an empty treasury", 0, 2.0, color="#e8cfa0", size=18),
    label("m2", 880, 250, "Congress is not a Hindu body", 0, 4.4, color="#c8f0dd", size=18),
    label("m3", 880, 350, "Jamiat leadership: we back League candidates", 1, 0.6, color="#ffd08a", size=18),
    label("m4", 880, 450, "Aligarh students heckle their own Vice Chancellor", 2, 0.6, color="#cfe0f0", size=18),
    label("m5", 880, 520, "for backing a landlord", 2, 3.0, color="#cfe0f0", size=16),
    cite("Police Abstract of Intelligence, January-February 1937; via Dhulipala, ch. 1", 0, 0.6),
], [
    L("And here is a fact that later history would bury. In 1937 Maulana Husain Ahmad Madani, Pakistan's fiercest clerical opponent, campaigned for the Muslim League. He blamed British rule for India's famines, and assured audiences that Congress was not a Hindu party."),
    L("When a rival claimed to be the Jamiat's candidate, its leaders declared publicly that they were backing the League."),
    L("At Aligarh, students of the Muslim University heckled their own Vice Chancellor for supporting a landlord against a Congress-backed candidate."),
], pal="jade"))

seq.append(scene("sabha", "void", [
    {"id": "f", "type": "figures", "x": 640, "y": 640, "n": 16, "cols": 8, "w": 900, "rowh": 70, "size": 0.9, "color": "#1a140e", "anim": "rise", "banner": "HINDU SABHA", "bannerColor": "#d8c8a8"},
    label("s1", 640, 150, "Congress, the Sabha claimed, would wipe out Hindu religion", 0, 1.2, color="#ff9a8a", size=18),
    label("s2", 640, 200, "socialist candidates branded atheists", 0, 4.0, color="#e8cfa0", size=17),
    cite("Dhulipala, ch. 1", 0, 0.6),
], [
    L("The other enemy was the Hindu Sabha. Its candidates told voters that Congress meant to wipe out the Hindu religion, and branded its socialist candidates atheists."),
    L("So in 1937 the lines ran in strange directions: Congress and the League together, a Muslim cleric campaigning for both, and religious parties attacking the secular one from both sides."),
], pal="smoke"))

# ---------------- chapter 6 ----------------
seq.append(chapter("ch6", 6, "The Count", "February 1937", color=RED))

seq.append(scene("count", "void", [
    {"id": "h", "type": "hemicycle", "x": 640, "y": 450, "r": 300, "rows": 9, "reveal": 0, "anim": "fade", "title": "U.P. LEGISLATIVE ASSEMBLY · 228 SEATS", "legendGap": 300,
     "groups": [{"n": 133, "color": "#e3a857", "label": "Congress"}, {"n": 29, "color": JADE, "label": "Muslim League"}, {"n": 66, "color": "#6a6458", "label": "Landlords, independents, others"}],
     "keys": {"0": {"reveal": 0.6, "d": 1.0, "t": 4}, "1": {"reveal": 1, "d": 0.6, "t": 2.5}}},
    cite("Congress 133 seats; League 29 of 66 Muslim seats (Dhulipala, ch. 1); 228-seat total from the U.P. election handbook", 0, 0.6),
], [
    L("Seasoned observers expected Congress to win perhaps eighty seats, and the landlords to form a government with Muslim and independent support. Instead, Congress won a hundred and thirty-three, enough to rule alone."),
    L("The League took twenty-nine of the sixty-six Muslim seats. It was now the largest Muslim party in the province, and Congress did not need it."),
], pal="ink", cam={"zoom": [1.0, 1.04], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("haig", {"kind": "room", "pal": "archive"}, [
    doc("hg", 640, 340, "GOVERNOR SIR HARRY HAIG TO THE VICEROY", "17 February 1937 (excerpt)",
        ["Congress may try to win over the", "whole of the Muslim League group...", "", "even if they attach a fair number", "of Muslims to themselves, I doubt", "whether this attachment will last."],
        0, 0.4, w=540, rot=-1, cps=26, sfx="type", vol=0.4, hl=5, hlOn=0, keys={"1": {"hlOn": 1, "d": 0.3, "t": 0.6}}),
    cite("Haig to Linlithgow, 17 February 1937, in L. Carter (ed.), United Provinces Politics 1936-1937; via Dhulipala, ch. 1", 0, 0.6),
], [
    L("The Governor, Sir Harry Haig, wrote to the Viceroy. There were rumours, he said, that Congress would try to absorb the whole League group and leave the opposition helpless."),
    L("He doubted Congress would pass over its own handful of loyal Muslims for men who did not share its aims. And even if it did, he doubted the attachment would last. It turned out to be one of the more prescient letters of the Raj."),
], cam={"zoom": [1.08, 1.0], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 7 ----------------
seq.append(chapter("ch7", 7, "What the Historians Say", "Testing the chapter", color=AMBER))

seq.append(scene("tests", "void", [
    verdict("v1", 340, 220, "Congress and the League were\ninformal allies in 1937 U.P.", "strong", "Few head-on contests; press and police reports", 0, 0.4, w=560),
    verdict("v2", 940, 220, "Who was 'nationalist' and who\n'communalist' was still unsettled.", "partial", "Dhulipala's reading; Jalal and Seal make a related case", 1, 0.4, w=560),
    verdict("v3", 340, 470, "The government's development scheme\nwas used to help the landlords.", "partial", "An insider's memoir, backed by the Governor's letters", 2, 0.4, w=560),
    verdict("v4", 940, 470, "Separatism was inevitable after\nthe 1920s.", "contested", "The chapter argues against this", 3, 0.4, w=560),
], [
    L("So what holds up? That Congress and the League were informal allies in the 1937 campaign: well supported, from the seat counts, the press and the police reports."),
    L("That the labels nationalist and communalist were still unsettled: supported, with caveats. It is Dhulipala's reading, and it echoes an older argument by Ayesha Jalal and Anil Seal that the 1935 Act itself divided Muslim politics."),
    L("That the government's development money helped the landlords: supported, from a senior official's own memoir and the Governor's letters, though it is one insider's account."),
    L("And the old idea that separatism was inevitable after the 1920s: contested. This chapter is a sustained argument against it."),
], pal="smoke", cam={"zoom": [1.0, 1.02], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("hinge", "void", [
    typer("h1", 640, 250, "A majority of its own.", 0, 0.4, size=40, font="serif", italic=True, cursor=False, cps=22),
    typer("h2", 640, 320, "Would Congress share power?", 0, 2.6, size=40, font="serif", italic=True, cursor=False, cps=22, color=GOLD),
    label("h3", 640, 440, "Azad blamed Nehru. Khaliquzzaman blamed Congress. Historians still argue.", 1, 0.6, color="#b8a888", size=17),
    cite("M. A. K. Azad, India Wins Freedom; C. Khaliquzzaman, Pathway to Pakistan; S. Misra (2001); via Dhulipala, ch. 2", 1, 0.6),
], [
    L("Congress now had a majority of its own. The League had helped it fight the landlords, and expected a share of power. What happened next is one of the most fought-over moments in the history of partition."),
    L("Maulana Azad later blamed Nehru. Khaliquzzaman blamed Congress. Historians still argue about it. But Dhulipala's interest lies less in who broke the coalition than in what the League did once it was shut out."),
    beat(1.6, "heart"),
], pal="blood"))

seq.append(next_card(3, "Four-Anna Members", "Congress Raj · 1937 – 1939",
                     "Next time: shut out of power, the League goes to the people. A battle for Muslim members, by-elections and the support of the clerics. And Jinnah becomes the Qaid-i-Azam."))

seq.append({"type": "card", "id": "end", "style": "endx", "title": SERIES, "dur": 26, "credits": credits_block(
    ["Madina (Bijnor), Notes on Newspapers, U.P., 25 April 1936", "Linlithgow Papers and Haig Papers (letters to the Viceroy, 1936-37)", "Memoirs of C. S. Venkatachar, ICS, British Library",
     "Police Abstracts of Intelligence, U.P., 1937 · The Pioneer · Zulqarnain · Indian Annual Register"],
    ["Ayesha Jalal and Anil Seal, 'Alternative to Partition', Modern Asian Studies (1981)", "P. D. Reeves, B. D. Graham, J. M. Goodman, Handbook of Elections in U.P. (1975)",
     "Salil Misra, A Narrative of Communal Politics (2001) · Gyanendra Pandey (2004)", "M. A. K. Azad, India Wins Freedom · C. Khaliquzzaman, Pathway to Pakistan"])})

ep = {"meta": meta(2, "The Broken Coalition",
                   "In 1936 a small-town paper called the Muslim League 'neither dead nor alive'. Episode 2 goes back to the 1937 elections in the United Provinces, when Congress and the League were allies against the landlords, a Deobandi cleric campaigned for Jinnah, and nobody could yet say who was a nationalist and who a communalist.",
                   BOOK + ", chapter 1; Linlithgow and Haig papers, Venkatachar memoirs and the U.P. press as quoted there; Jalal and Seal (1981)."),
      "cast": CAST, "sequence": seq}

if __name__ == "__main__":
    write(SLUG, ep)
