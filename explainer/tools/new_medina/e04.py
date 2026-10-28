"""Episode 4: "Two Lawyers from Bombay" (book chapter 3: Two Constitutional Lawyers from Bombay and the Debate over Pakistan in the Public Sphere)."""
from common import *

SLUG = "new-medina-e04-two-lawyers-from-bombay"
seq = []

# ---------------- cold open ----------------
seq.append({"type": "card", "id": "open", "style": "intertitle", "lines": ["Bombay.", "17 September 1944."], "sub": "A READING LIST", "dur": 5.0, "sfx": "type"})

seq.append(scene("letters", {"kind": "room", "pal": "archive"}, [
    slate("BOMBAY · SEPTEMBER 1944"),
    doc("j", 400, 320, "M. A. JINNAH TO M. K. GANDHI", "17 September 1944 (excerpt)",
        ["For the moment I would refer you to", "two publications ... Dr. Ambedkar's book", "and MRT's Nationalism in Conflict in India."],
        0, 0.6, w=480, rot=-1.5, cps=26, sfx="type", vol=0.4, hl=1, hlOn=0, keys={"0": {"hlOn": 1, "d": 7.0, "t": 0.6}}),
    doc("g", 900, 360, "M. K. GANDHI TO M. A. JINNAH", "19 September 1944 (excerpt)",
        ["Dr. Ambedkar's thesis, while it is", "ably written, has carried no", "conviction to me."], 1, 0.4, w=440, rot=1.5, cps=26, sfx="type", vol=0.4),
    cite("Gandhi-Jinnah Talks: Text of Correspondence (Hindustan Times, 1944); via Dhulipala, ch. 3", 0, 0.6),
], [
    L("In September 1944 the two most powerful men in Indian politics were meeting, day after day, at Jinnah's house on Malabar Hill. Gandhi asked how Muslims, most of them descended from converts, could be a separate nation. Jinnah replied with a reading list."),
    L("Gandhi read the first book within two days. Ably written, he wrote back, but it had carried no conviction to him."),
    L("That book was not by a Muslim, and not by a Leaguer. It was by the man who would one day draft India's constitution: Dr Bhimrao Ramji Ambedkar."),
    beat(1.6, "heart"),
], cam={"zoom": [1.1, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append({"type": "card", "id": "title", "style": "titlex", "kicker": "A LUMEN DOCUMENTARY IN TEN PARTS", "title": SERIES,
            "sub": "Episode 4 · Two Lawyers from Bombay", "by": "after the book by Venkat Dhulipala (2015)", "dur": 7.0, "sfx": "boom"})

# ---------------- chapter 1 ----------------
seq.append(chapter("ch1", 1, "A Vague Idea?", "Lahore · March 1940", color=SKY))

seq.append(scene("vague", "void", [
    tome("t1", 330, 330, "The Sole Spokesman", "Ayesha Jalal · 1985", "#3a4a5a", 0, 0.4),
    quote("jq", 860, 230, "a host of shapes and forms,\nmost of them vague", "Jalal on what Pakistan meant to its supporters", 0, 3.6, size=24, w=520),
    label("j1", 860, 400, "the bargaining-counter thesis", 1, 0.6, color="#cfe0f0", size=19),
    label("j2", 860, 445, "Pakistan as leverage for parity in a united India", 1, 2.2, color="#cfe0f0", size=17),
    label("j3", 860, 530, "Dhulipala: in public, it was argued over in detail", 2, 0.8, color=GOLD, size=19),
    cite("Ayesha Jalal, The Sole Spokesman (1985); Asim Roy, Modern Asian Studies (1990); via Dhulipala, ch. 3", 0, 0.6),
], [
    L("In March 1940, at Lahore, the Muslim League resolved that the Muslim-majority areas of the north-west and east should be grouped into independent states. That much historians agree on. Almost nothing after it."),
    L("For forty years after independence, the story was simple: Jinnah wanted Pakistan, and Jinnah got it. Then, in 1985, the historian Ayesha Jalal turned it upside down. Pakistan, she argued, was a bargaining counter: a deliberately vague demand that Jinnah used to win Muslims equality in a united India. Its followers imagined it in a host of shapes and forms, most of them vague."),
    L("Dhulipala's reply in this chapter is simple. Whatever happened at the negotiating table, out in public, from 1940 on, Pakistan was argued over in remarkable detail. And no one did more to give that argument shape than a second constitutional lawyer from Bombay."),
], pal="ink"))

# ---------------- chapter 2 ----------------
seq.append(chapter("ch2", 2, "Thoughts on Pakistan", "Bombay · 1940", color=GOLD))

seq.append(scene("amb", "void", [
    dossier("a", 330, 360, "B. R. Ambedkar", "Independent Labour Party;\nlater, constitution-maker", "1891 – 1956", 0, 0.6, hat="none", glasses=True, tag="NOT A LEAGUER", tagColor="#3a6ea5"),
    tome("bk", 860, 300, "Thoughts on Pakistan", "B. R. Ambedkar · 1941", "#2f4f6f", 1, 0.4, w=190, h=250),
    label("b1", 860, 480, "400 pages · 14 appendices · 3 maps", 1, 2.0, color="#e8cfa0", size=18),
    label("b2", 860, 520, "written in about four months", 1, 3.6, color="#e8cfa0", size=18),
    cite("B. R. Ambedkar, Thoughts on Pakistan (Bombay, 1941), preface; via Dhulipala, ch. 3", 0, 0.6),
], [
    L("Ambedkar was no friend of Congress, and no friend of Gandhi. He was the leader of India's untouchables, and he trusted neither caste Hindus nor the League to speak for his people."),
    L("While Congress answered Lahore with outrage, Ambedkar sat down and wrote. Within about four months he had a four-hundred-page study, with fourteen appendices of figures and three coloured maps showing where the new borders could run."),
    L("Those who fought Pakistan with similes and metaphors, he wrote, should remember that nonsense is no less nonsense because it rhymes. His own aim was to explain, not to convert. He had, he said, an open mind, though not an empty mind."),
], pal="ink"))

seq.append(scene("nation", "void", [
    typer("n1", 640, 220, "What makes a nation?", 0, 0.4, size=40, font="serif", italic=True, cursor=False, cps=22),
    label("n2", 640, 320, "not race · not language · not territory", 0, 3.4, color="#b8a888", size=20),
    quote("nq", 640, 470, "a longing to belong to one's own group\nand a longing not to belong to any other group", "B. R. Ambedkar, Thoughts on Pakistan (1941)", 1, 0.6, size=25, w=780),
    cite("Ambedkar, Thoughts on Pakistan, after Ernest Renan; via Dhulipala, ch. 3", 0, 0.6),
], [
    L("His first question was the only one, he said, that really mattered: were India's Muslims a nation? Following the French thinker Ernest Renan, he dismissed race, language and territory. Nationality was a feeling."),
    L("A longing to belong to one's own group, he wrote, and a longing not to belong to any other. By that test, he concluded, Muslims had become a nation, and the map had handed them a homeland. The case for Pakistan took him only a few pages. The rest of the book was addressed to Hindus."),
], pal="smoke"))

# ---------------- chapter 3 ----------------
seq.append(chapter("ch3", 3, "A Safe Army, Not a Safe Border", "The case made to Hindus", color=RED))

seq.append(scene("money", "void", [
    {"id": "a", "type": "stat", "x": 360, "y": 270, "value": 0, "size": 100, "color": AMBER, "label": "crore a year: Hindustan (his estimate)", "anim": "fade", "keys": {"0": {"value": 120, "d": 1.6, "t": 2.2}}},
    {"id": "b", "type": "stat", "x": 920, "y": 270, "value": 0, "size": 100, "color": JADE, "label": "crore a year: the two Pakistans", "anim": "fade", "keys": {"0": {"value": 36, "d": 3.8, "t": 2.2}}},
    quote("aq", 640, 490, "a safe army was better than a safe border", "B. R. Ambedkar, Thoughts on Pakistan", 1, 0.6, size=28, w=720),
    cite("Ambedkar, Thoughts on Pakistan (1941), from government revenue figures; via Dhulipala, ch. 3", 0, 0.6),
], [
    L("Ambedkar told Hindus they would lose nothing they needed. By his figures, Hindustan would keep about a hundred and twenty crore rupees of revenue. The two Pakistan states would have about thirty-six."),
    L("Then came his most notorious argument. The Indian army, he pointed out, recruited heavily from the Muslims of Punjab and the Frontier. In a war with a Muslim neighbour, he doubted, in language that is hard to read today, that such an army could be relied upon. Better, he concluded, a safe army than a safe border. Years later he admitted these fears might be imaginary."),
], pal="ink"))

seq.append(scene("ambmap", "void", [
    {"id": "m", "type": "samap", "x": 470, "y": 372, "k": 1.05, "split": 0, "und": 0.4, "nb": 0.6, "anim": "fade",
     "labels": [{"text": "PUNJAB, DIVIDED", "at": [74.2, 31.9], "size": 16}, {"text": "BENGAL, DIVIDED", "at": [89.2, 25.4], "size": 16}], "labelsOn": 0, "keys": {"0": {"split": 1, "d": 1.0, "t": 4.0, "labelsOn": 1}}},
    label("l1", 1010, 200, "exclude 13 Hindu-majority districts of Punjab", 0, 1.4, color="#ffd8a8", size=17),
    label("l2", 1010, 240, "and 15 of Bengal", 0, 3.0, color="#ffd8a8", size=17),
    quote("hq", 1010, 410, "a scheme of communal peace\nthrough a system of\ncommunal hostages", "Ambedkar on the 'hostage population' theory", 1, 0.6, size=23, w=440),
    label("l3", 1010, 580, "modern borders shown, for orientation", 0, 5.0, color="#8a7e68", size=14),
    cite("Ambedkar, Thoughts on Pakistan (1941), appendices and maps; via Dhulipala, ch. 3", 0, 0.6),
], [
    L("His maps did something no politician had yet dared. Pakistan on the existing provincial borders, he warned, would trap millions of Hindus and Sikhs inside a Muslim state. So Punjab and Bengal should themselves be divided, leaving their Hindu-majority districts in India. Seven years before it happened, he drew partition close to how it would fall."),
    L("He also named the logic behind the League's provinces: Muslim majorities in some provinces would hold their Hindu minorities as a guarantee for Muslim minorities elsewhere. He called it, with contempt, a scheme of communal peace through a system of communal hostages."),
], pal="ink"))

seq.append(scene("transfer", "void", [
    typer("t1", 640, 210, "'the population involved is inconsiderable'", 0, 0.6, size=28, font="serif", italic=True, color="#e8cfa0", cursor=False),
    label("t2", 640, 270, "Ambedkar, 1941, on exchanging minorities, after Greece, Turkey and Bulgaria", 0, 3.6, color="#b8a888", size=16),
    verdict("v1", 360, 460, "Punjab and Bengal would have\nto be divided.", "strong", "Ambedkar, 1941. It happened in 1947.", 1, 0.4, w=520),
    verdict("v2", 920, 460, "Any population transfer would be\nsmall, voluntary and orderly.", "weak", "1947: perhaps 15 million uprooted; deaths estimated from 200,000 to 2 million", 2, 0.4, w=560),
    cite("Ambedkar, Thoughts on Pakistan (1941) and Pakistan or the Partition of India (1945); via Dhulipala, ch. 3", 0, 0.6),
], [
    L("What of the people on the wrong side of the new lines? Greece, Turkey and Bulgaria had exchanged their minorities, Ambedkar noted. India could do the same, voluntarily and over an agreed period. The numbers, he wrote, were inconsiderable."),
    L("On the borders, he was right. Punjab and Bengal were divided in 1947, much as he had sketched."),
    L("On the people, he was catastrophically wrong. The transfer was neither small nor orderly. Perhaps fifteen million people were uprooted, and estimates of the dead run from two hundred thousand to two million. As Dhulipala notes, what Ambedkar did not foresee was the complete collapse of law and order."),
], pal="smoke"))

# ---------------- chapter 4 ----------------
seq.append(chapter("ch4", 4, "The League Answers", "Delhi and Bombay · 1942", color=JADE))

seq.append(scene("press", "void", [
    {"id": "p", "type": "paper", "x": 400, "y": 350, "w": 420, "h": 460, "mast": "DAWN", "date": "Delhi · 1942", "head": "The case for\nPakistan", "headSize": 36,
     "sub": "edited by Pothan Joseph", "cols": 3, "rot": -1.5, "anim": "rise"},
    tome("mrt", 900, 310, "Pakistan and Muslim India", "MRT · Home Study Circle · 1942", "#2f6f5a", 1, 0.4, w=180, h=240),
    label("m1", 900, 490, "foreword by M. A. Jinnah, 24 December 1942", 1, 2.4, color="#c8f0dd", size=17),
    label("m2", 900, 530, "published from Jinnah's own Bombay address", 1, 4.0, color="#c8f0dd", size=17),
    cite("Pothan Joseph, Looking Back (1950); M. S. Toosy, My Reminiscences of Quaid-i-Azam (1976); QA Papers; via Dhulipala, ch. 3", 0, 0.6),
], [
    L("Ambedkar's book set off a demand that Jinnah explain what he meant. So the League built a propaganda machine. Jinnah founded the English daily Dawn, and hired as its editor the legendary journalist Pothan Joseph, who said his new employer, though exacting, always inspired confidence."),
    L("Then came the League's direct answer to Ambedkar: two volumes of essays by a Punjabi journalist, M. S. Toosy, writing as MRT. Jinnah chose their titles, wrote their foreword, and had them published from his own house in Bombay."),
], pal="ink"))

seq.append(scene("geobody", "void", [
    {"id": "m", "type": "samap", "view": "wide", "x": 700, "y": 400, "k": 1.25, "split": 1, "nb": 0.7, "anim": "fade", "pkColor": "#2f6f5a",
     "cities": [{"name": "Karachi", "color": JADE}, {"name": "Istanbul", "note": "the lost Caliphate", "color": GOLD, "left": True}],
     "lit": 0, "keys": {"1": {"lit": 2, "d": 0.6, "t": 2.5}}},
    {"id": "pn", "type": "panel", "x": 250, "y": 520, "w": 420, "h": 230, "anim": "fade"},
    label("g1", 250, 440, "twice the size of France", 0, 1.0, color="#c8f0dd", size=19),
    label("g2", 250, 485, "as populous as Italy", 0, 2.4, color="#c8f0dd", size=19),
    label("g3", 250, 530, "richer than Turkey, Egypt, Iran", 0, 3.8, color="#c8f0dd", size=19),
    label("g4", 250, 595, "heir to the Ottoman role?", 1, 1.0, color=GOLD, size=20),
    cite("MRT, Pakistan and Muslim India (1942); Nationalism in Conflict in India (1942); via Dhulipala, ch. 3", 0, 0.6),
], [
    L("Where Ambedkar had hinted that Pakistan would be poor and weak, MRT insisted it would be strong: twice the size of France, as populous as Italy, with revenues greater than Turkey's or Egypt's, and the soldiers of the so-called martial races."),
    L("And something larger crept in. After the First World War, India's Muslims had campaigned to save the Ottoman Caliphate. Now League writers began to picture Pakistan as its successor: the leading power of the Islamic world. Jinnah publicly denied any pan-Islamic design. Yet one journalist recalled him at Iqbal's grave in 1942, saying that Pakistan held the key to the liberation of the entire Islamic world."),
], pal="ink"))

seq.append(scene("minority", {"kind": "room", "pal": "archive"}, [
    doc("jd", 400, 300, "M. A. JINNAH, JALANDHAR", "15 November 1942 (excerpt)",
        ["Muslims in the United Provinces are", "not a national group; they are scattered...", "a sub-national group who cannot expect", "anything more than what is due from any", "civilized government to a minority."],
        0, 0.6, w=500, rot=-1, cps=28, sfx="type", vol=0.4, hl=2, hlOn=0, keys={"0": {"hlOn": 1, "d": 9.0, "t": 0.6}}),
    quote("gq", 920, 300, "if Britain in Gladstone's time\ncould intervene in Armenia ...\nwhy should it not be right for us?", "M. A. Jinnah on Muslims left in Hindustan", 1, 0.6, size=22, w=460),
    label("k1", 920, 500, "'not a counter for bargaining'", 2, 0.6, color=GOLD, size=20),
    cite("Jamiluddin Ahmad (ed.), Speeches and Writings of Mr. Jinnah, vols 1-2; Pirzada, Foundations of Pakistan; via Dhulipala, ch. 3", 0, 0.6),
], [
    L("Here the chapter lands its hardest blow on the idea of a bargaining counter. That idea assumes Jinnah would never abandon the Muslims of provinces like U.P. But in public he said, in effect, that they were not a nation at all. They were scattered, a sub-national group, entitled only to what any civilised government owed a minority."),
    L("Their protection would come from outside. If Muslims in Hindustan were oppressed, Jinnah asked, why should Pakistan not intervene, as Gladstone's Britain had for the Armenians? It was the hostage theory, now from the League's own side."),
    L("And again and again, he denied that Pakistan was a bargaining counter. It was, he said, a matter of life and death."),
], cam={"zoom": [1.06, 1.0], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 5 ----------------
seq.append(chapter("ch5", 5, "Malabar Hill", "September 1944", color=AMBER))

seq.append(scene("talks", "void", [
    dossier("g", 220, 330, "M. K. Gandhi", "for the C. R. formula", "1869 – 1948", 0, 0.4, hat="none", glasses=True, tag="ONE NATION", tagColor="#8a5a2a", w=200, h=270),
    dossier("j", 1060, 330, "M. A. Jinnah", "for the Lahore Resolution", "1876 – 1948", 0, 0.4, hat="karakul", tag="TWO NATIONS", tagColor="#2f6f5a", w=200, h=270),
    label("c1", 640, 200, "plebiscite of all inhabitants", 1, 0.6, color="#ffd8a8", size=18),
    label("c2", 640, 240, "district by district", 1, 1.8, color="#ffd8a8", size=18),
    label("c3", 640, 280, "defence and foreign affairs in common", 1, 3.0, color="#ffd8a8", size=18),
    label("c4", 640, 400, "'maimed and mutilated'", 2, 0.6, color="#c8f0dd", size=20),
    label("c5", 640, 440, "a vote for Muslims only, on whole provinces", 2, 2.4, color="#c8f0dd", size=17),
    cite("Gandhi-Jinnah Talks (1944); Jinnah-Gandhi Talks, foreword by Liaquat Ali Khan (1944); via Dhulipala, ch. 3", 0, 0.6),
], [
    L("The September talks turned on a formula drafted by the Congress leader C. Rajagopalachari. Muslim-majority districts would be marked out. All their inhabitants would vote on separation. And defence, foreign affairs and trade would stay common."),
    L("Gandhi wrote that he could find no parallel in history for a body of converts and their descendants claiming to be a nation apart from the parent stock."),
    L("Jinnah wanted whole provinces, and a vote of Muslims alone. The formula, he said, would leave Pakistan maimed and mutilated, the husk without the grain. Rajagopalachari answered that a new state should not begin by keeping people from the ballot box because of their religion."),
], pal="ink"))

seq.append(scene("third", "void", [
    quote("aq", 640, 250, "did not meet each other with empty minds,\nbut ... neither had an open mind", "Ambedkar on Gandhi and Jinnah, October 1944", 0, 0.4, size=27, w=760),
    label("s1", 640, 420, "and a third party nobody asked:", 1, 0.6, color="#b8a888", size=19),
    label("s2", 640, 465, "the Scheduled Castes, who must consent in a referendum of their own", 1, 2.6, color=GOLD, size=19),
    cite("Times of India, 4 October 1944; via Dhulipala, ch. 3", 0, 0.6),
], [
    L("The talks collapsed. Ambedkar turned his own phrase on the two men. They had not met with empty minds, he said, but neither had an open mind."),
    L("And he reminded both that there was a third party. Neither Gandhi nor Jinnah could carry India's untouchables into Hindustan or Pakistan without their consent, freely given, in a referendum of their own."),
], pal="smoke"))

# ---------------- chapter 6 ----------------
seq.append(chapter("ch6", 6, "The Philosopher of Pakistan", "1945 · 1955", color=GOLD))

seq.append(scene("philosopher", {"kind": "room", "pal": "sepia"}, [
    tome("b2", 330, 320, "Pakistan or the Partition of India", "B. R. Ambedkar · 1945", "#4a3a2a", 0, 0.4, w=180, h=240),
    label("p1", 880, 210, "1945: Pakistan 'unnecessary' for majority-province Muslims", 0, 2.0, color="#e8cfa0", size=17),
    label("p2", 880, 250, "'worse than useless' for the rest", 0, 4.4, color="#e8cfa0", size=17),
    label("p3", 880, 290, "yet, if Muslims insist, it must be conceded", 0, 6.4, color="#ffd08a", size=17),
    quote("pq", 880, 460, "I was the philosopher,\nso to say, of Pakistan.", "B. R. Ambedkar, Thoughts on Linguistic States (1955)", 1, 0.6, size=28, w=520),
    cite("Ambedkar, Pakistan or the Partition of India (1945); Thoughts on Linguistic States (1955); via Dhulipala, ch. 3", 0, 0.6),
], [
    L("By the 1945 edition, Ambedkar sounded more doubtful. Pakistan, he now wrote, was unnecessary for Muslims of the majority provinces, and worse than useless for those left outside it. A mixed party of Hindus and Muslims would do more good. And yet, if Muslims insisted on Pakistan, it must be conceded."),
    L("Ten years later, after partition, he left no doubt. I was the philosopher, so to say, of Pakistan, he wrote, and he said he was glad India had been divided."),
], cam={"zoom": [1.05, 1.0], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 7 ----------------
seq.append(chapter("ch7", 7, "What the Historians Say", "Testing the chapter", color=AMBER))

seq.append(scene("tests", "void", [
    verdict("v1", 340, 220, "Ambedkar's book shaped the public\ndebate on Pakistan.", "strong", "Cited by Jinnah and read by Gandhi in their 1944 letters", 0, 0.4, w=560),
    verdict("v2", 940, 220, "In public, Pakistan was argued over\nin detail from 1940.", "partial", "Books, maps, figures; Jalal stresses vagueness at the negotiating table", 1, 0.4, w=560),
    verdict("v3", 340, 470, "Jinnah wanted a sovereign state,\nnot a bargaining counter.", "debated", "His public words say so; Jalal reads his private moves differently", 2, 0.4, w=560),
    verdict("v4", 940, 470, "League propaganda reflected\nJinnah's real aims.", "contested", "He wrote the foreword; critics call it a public face, not policy", 3, 0.4, w=560),
], [
    L("So what holds up? That Ambedkar's book shaped the debate: well supported. Jinnah cited it, and Gandhi read it within two days."),
    L("That Pakistan was argued over in public, in detail, from 1940: supported, with caveats. The books, the maps and the figures exist. Jalal's point concerns the negotiating table, and the two claims can both be true."),
    L("That Jinnah wanted a sovereign state and never a bargaining counter: debated. His public words support Dhulipala. Jalal reads his private moves, above all his acceptance of the Cabinet Mission plan in 1946, quite differently."),
    L("And that League propaganda reveals Jinnah's real aims: contested. He wrote its foreword. But propaganda is what a party says in public, and critics say that is not the same thing as policy."),
], pal="smoke", cam={"zoom": [1.0, 1.02], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("now", "void", [
    typer("h1", 640, 220, "Minorities as hostages", 0, 0.4, size=42, font="serif", italic=True, cursor=False, cps=20),
    quote("tq", 640, 380, "you think the fourteen crore Muslims\nof Pakistan will sit like cowards\nand do nothing?", "Salman Taseer to Shekhar Gupta, 1993, as Gupta recalled it in 2011", 1, 0.6, size=23, w=720),
    label("h3", 640, 560, "an idea from 1940 that outlived partition", 2, 0.6, color="#b8a888", size=17),
    cite("Shekhar Gupta, 'This Death in Pakistan', Indian Express, 8 January 2011; cited in Dhulipala, ch. 3", 1, 0.6),
], [
    L("The hostage theory did not die in 1947. In a footnote, Dhulipala recalls a story told by the Indian editor Shekhar Gupta. In 1993 the liberal Pakistani politician Salman Taseer asked him what would happen if Kashmir voted for Pakistan. Gupta said Indian Muslims might be victimised."),
    L("Taseer rolled up his sleeve, in mock anger, and asked whether Gupta thought Pakistan's Muslims would sit like cowards and do nothing. In 2011, Taseer was shot dead by his own bodyguard for opposing Pakistan's blasphemy law."),
    L("Minorities treated as hostages to a neighbour's behaviour: Ambedkar named the idea in 1940. Today it still shapes politics wherever a border divides kin. That last observation is ours."),
    beat(1.6, "heart"),
], pal="blood"))

seq.append(next_card(5, "The Ideal Goal", "U.P. · 1940 – 1945",
                     "Next time: back to the United Provinces, where the League's leaders and local workers had to explain Pakistan to Muslims who would never live in it. Speeches, pamphlets, students, and the promise of a new Medina."))

seq.append({"type": "card", "id": "end", "style": "endx", "title": SERIES, "dur": 26, "credits": credits_block(
    ["B. R. Ambedkar, Thoughts on Pakistan (1941) · Pakistan or the Partition of India (1945)", "MRT (M. S. Toosy), Pakistan and Muslim India · Nationalism in Conflict in India (1942)",
     "Gandhi-Jinnah Talks: Text of Correspondence (1944)", "Speeches and Writings of Mr. Jinnah, ed. Jamiluddin Ahmad · QA Papers, ed. Z. H. Zaidi",
     "Pothan Joseph, Looking Back (1950) · Frank Moraes, Witness to an Era (1973)"],
    ["Ayesha Jalal, The Sole Spokesman (1985) · Asim Roy, Modern Asian Studies (1990)", "Dhananjay Keer, Dr Ambedkar: Life and Mission (1971)",
     "Shekhar Gupta, 'This Death in Pakistan', Indian Express (2011)", "Partition displacement and death estimates: standard ranges in the historical literature"])})

ep = {"meta": meta(4, "Two Lawyers from Bombay",
                   "In 1944 Jinnah told Gandhi to read a book on Pakistan written by Dr B. R. Ambedkar. Episode 4 follows the public argument that gave the Pakistan demand its maps, numbers and hostages, the League's answer, the failed talks on Malabar Hill, and the case against the idea that Pakistan was only a bargaining counter.",
                   BOOK + ", chapter 3; Ambedkar's Thoughts on Pakistan, MRT's volumes, the Gandhi-Jinnah correspondence and Jinnah's speeches as quoted there; Jalal (1985)."),
      "cast": CAST, "sequence": seq}

if __name__ == "__main__":
    write(SLUG, ep)
