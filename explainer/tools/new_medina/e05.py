"""Episode 5: "The Ideal Goal" (book chapter 4: Muslim League and the Idea of Pakistan in the United Provinces)."""
from common import *

SLUG = "new-medina-e05-the-ideal-goal"
seq = []

AGRA, BAREILLY, AMBALA, BADAYUN = [78.01, 27.18], [79.43, 28.37], [76.78, 30.38], [79.12, 28.04]

# ---------------- cold open ----------------
seq.append({"type": "card", "id": "open", "style": "intertitle", "lines": ["Tanda, Fyzabad district.", "1940."], "sub": "A QUESTION FOR THE WEAVERS", "dur": 5.0, "sfx": "type"})

seq.append(scene("weavers", {"kind": "room", "pal": "archive"}, [
    slate("TANDA · UNITED PROVINCES · 1940"),
    doc("r", 640, 330, "P. W. RADICE, I.C.S.", "Private papers (excerpt)",
        ["Asked the weavers what they hoped", "to gain from Pakistan.", "'If the Hindus annoyed them, their", "brethren in Pakistan would be able to", "take their revenge on the Hindus there.'", "A pleasant prospect."],
        0, 0.8, w=520, rot=-1.2, cps=26, sfx="type", vol=0.4, hl=5, hlOn=0, keys={"2": {"hlOn": 1, "d": 0.5, "t": 0.4}}),
    cite("P. W. Radice Papers, MSS Eur F180/80, British Library; via Dhulipala, ch. 4", 0, 0.8),
], [
    L("In 1940 a British district officer named P. W. Radice visited the Muslim handloom weavers of Tanda, a small town in eastern U.P. He asked them a simple question. What did they hope to gain from Pakistan?"),
    L("These weavers would never live in Pakistan. Their town was hundreds of miles from any Muslim-majority province. Their answer was blunt. If the Hindus annoyed them, their brethren in Pakistan could take revenge on the Hindus there."),
    L("Radice wrote two words in his notes. A pleasant prospect."),
    beat(1.6, "heart"),
], cam={"zoom": [1.1, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append({"type": "card", "id": "title", "style": "titlex", "kicker": "A LUMEN DOCUMENTARY IN TEN PARTS", "title": SERIES,
            "sub": "Episode 5 · The Ideal Goal", "by": "after the book by Venkat Dhulipala (2015)", "dur": 7.0, "sfx": "boom"})

# ---------------- chapter 1 ----------------
seq.append(chapter("ch1", 1, "Before Lahore", "Bareilly · February 1940", color=GOLD))

seq.append(scene("rizvi", "void", [
    tome("t", 330, 330, "Pakistan", "Anis al Din Ahmad Rizvi · Bareilly · 1940", "#2f5a3a", 0, 0.4, w=180, h=240),
    label("r1", 880, 200, "a month before the Lahore Resolution", 0, 2.0, color="#c8f0dd", size=18),
    label("r2", 880, 240, "an Islamic state: 'khuda ki badshahat'", 0, 4.0, color="#c8f0dd", size=18),
    label("r3", 880, 280, "the kingdom of God", 0, 5.6, color="#8fb8a0", size=16),
    quote("rq", 880, 450, "if a thorn lodged itself in the foot\nof a black African Muslim, the Chinese\nMuslim would instantly blink his eye", "Rizvi on Pakistan's foreign policy", 1, 0.6, size=22, w=540),
    cite("Anis al Din Ahmad Rizvi, Pakistan (Bareilly, 1940); via Dhulipala, ch. 4", 0, 0.6),
], [
    L("Jinnah liked to complain that the word Pakistan appeared nowhere in the Lahore Resolution. Hindus had invented it, he said. But a month before Lahore, in the western U.P. town of Bareilly, an Aligarh graduate named Anis al Din Ahmad Rizvi had already published a treatise. Its title was one word: Pakistan."),
    L("Rizvi wanted an Islamic state, ruled by the law of God. Its foreign policy would serve the whole Muslim world, bound so tightly, he wrote, that if a thorn pricked the foot of an African Muslim, a Chinese Muslim would blink."),
], pal="ink"))

seq.append(scene("rizvimap", "void", [
    {"id": "m", "type": "samap", "x": 470, "y": 372, "k": 1.05, "split": 0, "und": 0.4, "nb": 0.6, "anim": "fade",
     "cities": [{"name": "Meerut", "color": JADE}, {"name": "Aligarh", "color": JADE}, {"name": "Agra", "at": AGRA, "color": JADE, "left": True},
                {"name": "Dacca", "color": JADE}, {"name": "Hyderabad", "color": GOLD}], "lit": 0, "keys": {"0": {"lit": 5, "d": 3.0, "t": 2.4}}},
    {"id": "pn", "type": "panel", "x": 1010, "y": 360, "w": 460, "h": 360, "anim": "fade"},
    label("l0", 1010, 220, "RIZVI'S THREE STATES", 0, 0.6, color=GOLD, size=22, font="bebas", ls=3),
    label("l1", 1010, 290, "north-west, with western U.P.:", 0, 2.4, color="#c8f0dd", size=17),
    label("l2", 1010, 320, "Meerut, Rohilkhand, Aligarh, Agra", 0, 3.4, color="#c8f0dd", size=17),
    label("l3", 1010, 380, "east: Bengal and Assam", 0, 5.2, color="#c8f0dd", size=17),
    label("l4", 1010, 440, "south: Hyderabad", 0, 6.4, color="#ffd08a", size=17),
    label("l5", 1010, 590, "modern borders shown, for orientation", 1, 0.6, color="#8a7e68", size=14),
    cite("Rizvi, Pakistan (1940), map; reproduced in Dhulipala, Map 5", 0, 0.6),
], [
    L("And he drew a map. Three Muslim states: one in the north-west that reached deep into U.P. itself, taking in Meerut, Rohilkhand, Aligarh and Agra; one in Bengal and Assam; and the princely state of Hyderabad in the south."),
    L("Those left outside would be protected the way the weavers of Tanda imagined: by Hindus living inside Pakistan. Rizvi even welcomed exchanges of population. The hostage idea had reached the mofussil before the Resolution was passed."),
], pal="ink"))

# ---------------- chapter 2 ----------------
seq.append(chapter("ch2", 2, "The Reluctant Leaders", "Allahabad and Lucknow · 1940", color=SKY))

seq.append(scene("ismail", "void", [
    dossier("i", 300, 350, "Nawab Ismail Khan", "President, U.P. Muslim League", "of Meerut", 0, 0.4, hat="karakul", tag="A MODERATE", tagColor="#3a6ea5"),
    quote("iq", 880, 240, "some kind of confederation\nwill come into being", "Ismail Khan, Allahabad, 1940", 0, 2.6, size=26, w=520),
    label("i1", 880, 380, "no exchange of populations", 1, 0.4, color="#cfe0f0", size=18),
    label("i2", 880, 420, "OSS: would settle 'even at the cost of", 1, 2.0, color="#cfe0f0", size=17),
    label("i3", 880, 450, "modifying the demand for Pakistan'", 1, 2.6, color="#cfe0f0", size=17),
    label("i4", 880, 540, "'Now the old man is talking sense'", 2, 0.6, color=GOLD, size=20),
    cite("Indian Annual Register 1940; OSS report 4162.1 (1946); K. H. Khurshid, Memories of Jinnah; via Dhulipala, ch. 4", 0, 0.6),
], [
    L("The man in charge of the League in U.P. was not so sure. Nawab Ismail Khan told Hindus not to worry. There would be no exchange of populations, he said, and the new sovereign states might well join a confederation with the rest of India."),
    L("An American intelligence report later called him a moderate, a man who would settle with Congress even at the cost of watering down Pakistan."),
    L("Jinnah's secretary recorded a joke told at a film show. What if the Qaid lost his memory, like the hero of Random Harvest, and asked his committee, what is this Pakistan nonsense? Ismail Khan, came the punchline, would say: now the old man is talking sense."),
], pal="ink"))

seq.append(scene("shia", {"kind": "room", "pal": "archive"}, [
    doc("m", 380, 320, "RAJA OF MAHMUDABAD (SENIOR)", "to M. A. Jinnah, 29 March 1940 (substance)",
        ["Shia rights need safeguards.", "Could the Viceroy step in", "if they were threatened?"], 0, 0.4, w=440, rot=-1.5, cps=26, sfx="type", vol=0.4),
    doc("j", 900, 360, "M. A. JINNAH", "reply (excerpt)",
        ["The hand of the British government", "is disappearing rapidly ...", "The one thing alone that matters", "is that we are all Musalmans."], 1, 0.4, w=460, rot=1.5, cps=26, sfx="type", vol=0.4, hl=3, hlOn=0, keys={"1": {"hlOn": 1, "d": 0.5, "t": 1.2}}),
    cite("Mahmudabad-Jinnah correspondence, QA Papers; via Dhulipala, ch. 4", 0, 0.6),
], [
    L("Even the Mahmudabads, the richest Muslim family in Awadh, hesitated. They were Shias. Days after Lahore the old Raja wrote to Jinnah asking for safeguards for his sect, and for the Viceroy to step in if Shia rights were threatened."),
    L("Jinnah's reply was cold. The British were leaving. The League alone would now do justice between Muslim and Muslim. The one thing alone that matters, he wrote, is that we are all Musalmans."),
    L("The Raja wired back that he was ill, that his brain worked like a wireless in bad weather. Within a week the family had fallen into line."),
], cam={"zoom": [1.06, 1.0], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 3 ----------------
seq.append(chapter("ch3", 3, "Islamic, Not Muslim", "Bombay · May 1940", color=JADE))

seq.append(scene("raja", "void", [
    dossier("r", 280, 350, "Raja of Mahmudabad", "chair, Pakistan delegation", "1914 – 1973", 0, 0.4, hat="none", glasses=True, tag="THE NEPHEW", tagColor="#2f6f5a"),
    typer("t", 860, 220, "I say Islamic, not Muslim.", 0, 2.4, size=36, font="serif", italic=True, cursor=False, cps=18),
    label("a1", 860, 320, "the second Islamic state, after Medina", 1, 0.4, color="#c8f0dd", size=19),
    label("a2", 860, 370, "'a laboratory wherein we may experiment'", 1, 2.4, color="#c8f0dd", size=19),
    label("a3", 860, 450, "prohibition · no usury · zakat", 2, 0.4, color="#ffd08a", size=19),
    label("a4", 860, 500, "a 'democratic-theocratic State'", 2, 2.4, color="#ffd08a", size=19),
    cite("Speech to the Bombay Provincial Muslim League, May 1940; via Dhulipala, ch. 4", 0, 0.6),
], [
    L("His son was a different matter. The young Raja of Mahmudabad, whom Jinnah called his nephew, had skipped Lahore. Jinnah made him chairman of the delegation sent out to sell Pakistan to Muslims across India."),
    L("In Bombay in May 1940 he told the provincial League what Pakistan was for. The creation of an Islamic state, he said, mark my words, gentlemen, I say Islamic, not Muslim, is our ideal. The first Islamic state had been the Prophet's Medina. Pakistan would be the second, thirteen centuries later: a laboratory, he called it."),
    L("Its laws would come from Islam, fixed for ever. There would be prohibition, no usury, and zakat. Non-Muslims would share in the blessings of what he called a democratic-theocratic state."),
], pal="ink"))

seq.append(scene("yap", {"kind": "room", "pal": "sepia"}, [
    doc("y", 400, 330, "MAHMUDABAD TO JINNAH", "after visiting Muzaffarnagar (excerpt)",
        ["Could not the same be done in other", "districts? And then at the Centre?", "We have had enough of democratic", "yap yapping. Only one man at the head", "can work and does the work."], 0, 0.6, w=500, rot=-1, cps=28, sfx="type", vol=0.4, hl=2, hlOn=0, keys={"0": {"hlOn": 1, "d": 8.0, "t": 0.6}}),
    quote("oq", 920, 260, "the outposts of Islam will go forward,\nthey will not be withdrawn", "Mahmudabad, 1941", 1, 0.6, size=22, w=460),
    quote("sq", 920, 460, "one and only one Islamic\nSultanate for all of us", "Mahmudabad at Sasaram, Bihar", 1, 5.0, size=22, w=460),
    cite("Mahmudabad to Jinnah, QA Papers; Sidq, 11 May 1941; via Dhulipala, ch. 4", 0, 0.6),
], [
    L("And who would run this state? In Muzaffarnagar the district League had been dissolved and a single man put in charge. Mahmudabad wrote to Jinnah: could not the same be done everywhere, and then at the centre? We have had enough, he wrote, of democratic yap yapping."),
    L("Nor would Pakistan mean Muslims retreating from India. The outposts of Islam, he said, will go forward. And at Sasaram, in Bihar, he went further still: the world's Muslims wanted one and only one Islamic sultanate for all of them."),
], cam={"zoom": [1.05, 1.0], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 4 ----------------
seq.append(chapter("ch4", 4, "The Jumping-Off Ground", "Lucknow · 1940 – 1942", color=AMBER))

seq.append(scene("khaliq", "void", [
    dossier("k", 280, 350, "Chaudhry Khaliquzzaman", "U.P. League leader; pan-Islamist", "1889 – 1973", 0, 0.4, hat="karakul", tag="PAN-ISLAM", tagColor="#8a5a2a"),
    quote("kq", 870, 250, "Pakistan is not the final goal ...\nPakistan is only the jumping off ground.", "Chaudhry Khaliquzzaman", 0, 3.0, size=23, w=560),
    label("h1", 870, 420, "to the Governor, February 1940: three dominions", 1, 0.4, color="#ffd8a8", size=17),
    label("h2", 870, 465, "minorities on each side guarantee the other", 1, 2.4, color="#ffd8a8", size=17),
    label("h3", 870, 540, "'there would be retaliation'", 1, 17.0, color=GOLD, size=21),
    cite("Sidq, 21 October 1940; Hallett to Linlithgow, 16 February 1940, Linlithgow Papers; via Dhulipala, ch. 4", 0, 0.6),
], [
    L("Chaudhry Khaliquzzaman, the League's strongman in Lucknow, had been a pan-Islamist since his youth, when he went to Turkey with a medical mission during the Balkan Wars. Just as the Prophet created the first Pakistan in Arabia, he told students, the League would create another in India. Pakistan, he declared, was not the final goal, only the jumping off ground."),
    L("Weeks before Lahore he laid out a plan to the Governor of U.P. Two Muslim dominions and one Hindu one. Muslims left in the Hindu dominion would be safe because Hindus in the Muslim dominions would be treated the same way. The Governor wrote down how he had put it back to him, bluntly: in other words, there would be retaliation."),
], pal="ink"))

seq.append(scene("readjust", "void", [
    {"id": "m", "type": "samap", "x": 470, "y": 372, "k": 1.05, "split": 0, "und": 0.4, "nb": 0.6, "anim": "fade",
     "cities": [{"name": "Lahore", "color": JADE, "left": True}, {"name": "Ambala", "at": AMBALA, "color": RED}, {"name": "Calcutta", "color": RED, "left": True}, {"name": "Chittagong", "color": JADE}],
     "lit": 0, "keys": {"0": {"lit": 4, "d": 2.4, "t": 3.0}}},
    {"id": "pn", "type": "panel", "x": 1010, "y": 380, "w": 470, "h": 420, "anim": "fade"},
    label("l0", 1010, 210, "'TERRITORIAL READJUSTMENTS'", 0, 0.6, color=GOLD, size=22, font="bebas", ls=3),
    label("l1", 1010, 270, "lost: Calcutta, its port, coal and iron", 0, 3.0, color="#ffd8a8", size=17),
    label("l2", 1010, 305, "lost: the Ambala division of Punjab", 0, 4.4, color="#ffd8a8", size=17),
    quote("q", 1010, 450, "a political remedy ...\nalso a psychological cure", "Khaliquzzaman to Jinnah, 7 October 1942", 1, 0.6, size=22, w=420),
    label("l3", 1010, 560, "no reply came", 1, 22.0, color="#b8a888", size=17),
    cite("Khaliquzzaman to Jinnah, 7 October 1942; Pathway to Pakistan (1961); via Dhulipala, ch. 4", 0, 0.6),
], [
    L("But Khaliq was worried about three words in the Lahore Resolution: with territorial readjustments. Reading the 1941 census, he saw what they could mean. Bengal's Hindu-majority west, with Calcutta, its port, its coal and its iron, could be cut away. So could Punjab's eastern districts. Pakistan would be left with flood plains and a sleepy port at Chittagong."),
    L("He wrote to Jinnah in October 1942, and he said the quiet part plainly. One basic principle behind Pakistan was keeping hostages in the Muslim provinces against the Muslims in Hindu provinces. Pakistan was a political remedy, and also a psychological cure. Let the Hindus of Punjab and Bengal go, and the cure would fail. Jinnah never replied."),
], pal="ink"))

seq.append(scene("liaquat", "void", [
    dossier("l", 280, 350, "Liaquat Ali Khan", "General Secretary, Muslim League", "1895 – 1951", 0, 0.4, hat="karakul", tag="TRIAL BALLOONS?", tagColor="#3a6ea5"),
    label("b0", 870, 200, "LAHORE, MARCH 1940", 0, 0.6, color=GOLD, size=20, font="bebas", ls=3),
    label("b1", 870, 240, "the phrase means claiming 'Delhi and Aligarh'", 0, 2.0, color="#cfe0f0", size=17),
    label("b2", 870, 330, "DELHI, SEPTEMBER 1942", 1, 0.4, color=GOLD, size=20, font="bebas", ls=3),
    label("b3", 870, 370, "to a US diplomat: a vote only in eastern Bengal", 1, 1.8, color="#cfe0f0", size=17),
    label("b4", 870, 405, "and, yes, without Calcutta", 1, 3.6, color="#cfe0f0", size=17),
    label("b5", 870, 500, "a week later Jinnah repudiates it", 2, 0.4, color="#ffd08a", size=19),
    cite("US State Dept 845.00/1574, 9 September 1942; S. S. Pirzada, 'The Lahore Resolution 1940' (1970); via Dhulipala, ch. 4", 0, 0.6),
], [
    L("The phrase had been defended at Lahore by Liaquat Ali Khan. It was not meant to give up any part of Punjab or Bengal, he told the drafting committee, but to claim centres of Muslim culture like Delhi and Aligarh."),
    L("Two years later he told an American diplomat something else. A plebiscite would be held only in eastern Bengal, where Muslims were a clear majority. When the diplomat said that would cost Pakistan Calcutta, Liaquat agreed."),
    L("A week later Jinnah told the same diplomat that Calcutta would be in Pakistan, and nearly all of Punjab too. Was Liaquat freelancing, or floating a trial balloon for his chief? Dhulipala's point is that a smaller Pakistan was thinkable at the top as early as 1942."),
], pal="smoke"))

# ---------------- chapter 5 ----------------
seq.append(chapter("ch5", 5, "A Constitution in a Drawer", "Lucknow · 1940 – 1957", color=GOLD))

seq.append(scene("nizam", "void", [
    tome("t", 300, 330, "Islam ka Siyasi Nizam", "M. Ishaq Sandelvi · drafted c. 1940–41", "#3a4a2a", 0, 0.4, w=190, h=250),
    label("n1", 900, 230, "commissioned by the U.P. League, with leading ulama", 0, 1.6, color="#e8cfa0", size=17),
    label("n2", 900, 265, "convenor: Syed Sulaiman Nadwi", 0, 3.4, color="#e8cfa0", size=17),
    label("n3", 900, 330, "God is sovereign; a Caliph governs", 1, 0.4, color="#ffd08a", size=18),
    label("n4", 900, 370, "majority rule called 'a rather stupid rule'", 1, 2.4, color="#ffd08a", size=18),
    label("n5", 900, 410, "council closed to non-Muslims, Shias, Ahmadis", 1, 4.4, color="#ffd08a", size=18),
    label("n6", 900, 490, "never debated · one copy lost · printed 1957", 2, 0.4, color="#b8a888", size=17),
    label("n7", 900, 530, "a source for the ulama's demands in Pakistan", 2, 2.6, color=GOLD, size=17),
    cite("Sandelvi, Islam ka Siyasi Nizam (Azamgarh, 1957), foreword by Abdul Majid Daryabadi; via Dhulipala, ch. 4", 0, 0.6),
], [
    L("Soon after Lahore, Ismail Khan called together leading scholars at the Nadwatul Ulama in Lucknow, among them Sulaiman Nadwi and Abul Ala Mawdudi, to draft a constitution for an Islamic state in Pakistan. A little-known scholar from the Nadwa, Ishaq Sandelvi, was asked for a first draft. He produced more than three hundred pages."),
    L("In his design God was sovereign and a pious Caliph governed, chosen by scholars and notables rather than the masses. Majority rule, the draft said, was a rather stupid rule. The Caliph could overrule even a unanimous council, and that council was closed to non-Muslims, Shias and Ahmadis."),
    L("The committee never met again to debate it. One copy vanished in the post. But Nadwi kept his, and it was printed in 1957. By then Nadwi had moved to Pakistan to advise its Constituent Assembly on an Islamic constitution, and, Dhulipala argues, this draft fed directly into what the ulama asked for."),
], pal="ink"))

# ---------------- chapter 6 ----------------
seq.append(chapter("ch6", 6, "A Friday in Badayun", "19 April 1940", color=RED))

seq.append(scene("badayun", "void", [
    typer("t", 640, 190, "'in a democracy, people are counted, not weighed'", 0, 0.6, size=26, font="serif", italic=True, color="#e8cfa0", cursor=False),
    label("b0", 640, 245, "Maulvi Musavvir Ali Khan, District League, Badayun", 0, 3.6, color="#b8a888", size=16),
    label("b1", 360, 340, "no earthquake, no Great Wall:", 1, 0.4, color="#cfe0f0", size=18),
    label("b2", 360, 375, "the Frontier Mail will still run", 1, 2.0, color="#cfe0f0", size=18),
    label("b3", 920, 340, "U.P. stays out of Pakistan", 2, 0.4, color="#ffd8a8", size=18),
    label("b4", 920, 375, "its Muslims make 'a necessary sacrifice'", 2, 2.0, color="#ffd8a8", size=18),
    quote("q", 640, 520, "the hand amputated\nto save the body", "his metaphor for Muslims left behind", 3, 0.6, size=25, w=560),
    cite("Musavvir Ali Khan, Musalmanan-i-Hind ka Siyasi Nasbul Ain aur Jamhuriyat-i-Hind (Badayun, 1940); via Dhulipala, ch. 4", 0, 0.6),
], [
    L("On the nineteenth of April 1940 the League held Pakistan Day across India. In Badayun, after Friday prayers, a local lawyer named Musavvir Ali Khan explained the demand in a speech so admired that the district League paid to print it. Its title promised the political ideal goal of India's Muslims."),
    L("Democracy, he said, counted people instead of weighing them. Under a single federation Muslims would be outvoted for ever."),
    L("To those who wept over a divided motherland he was scornful. No earthquake would split the land and no Great Wall would rise. The Frontier Mail would still run from U.P. to Punjab."),
    L("Unlike Rizvi, he now left all of U.P. out of Pakistan. Its Muslims, he admitted, would gain nothing. They would make a necessary sacrifice, like a hand amputated to save the body. And the balance of power, he promised, would keep them safe."),
], pal="ink"))

seq.append(scene("contest", "void", [
    {"id": "m", "type": "samap", "x": 386, "y": 609, "k": 3.0, "split": 0, "und": 0, "nb": 0.8, "up": 0.55, "upLabel": False, "anim": "fade",
                         "cities": [{"name": "Delhi", "color": SKY}, {"name": "Aligarh", "color": RED}], "lit": 0, "keys": {"0": {"lit": 1, "d": 0.6, "t": 1.0}, "2": {"lit": 2, "d": 0.6, "t": 0.6}}},
    {"id": "pn", "type": "panel", "x": 980, "y": 380, "w": 500, "h": 470, "anim": "fade"},
    label("c0", 980, 190, "AZAD MUSLIM CONFERENCE · DELHI", 0, 0.6, color=SKY, size=19, font="bebas", ls=2),
    label("c1", 980, 225, "perhaps 50,000 attend", 0, 2.4, color="#cfe0f0", size=17),
    label("c2", 980, 295, "Allah Bakhsh, Premier of Sind:", 1, 0.4, color="#cfe0f0", size=17),
    label("c3", 980, 330, "the east 'ten times more fantastic'", 1, 2.0, color="#cfe0f0", size=17),
    label("c4", 980, 410, "SIKH CONFERENCE · ALIGARH · JUNE 1940", 2, 0.4, color=RED, size=19, font="bebas", ls=2),
    label("c5", 980, 445, "'an ocean of Sikh blood' (Tara Singh)", 2, 2.0, color="#ffd8a8", size=17),
    label("c6", 980, 480, "about 23,000 converts reported", 2, 3.6, color="#ffd8a8", size=17),
    label("c7", 980, 560, "the League answers with a National Guard", 2, 12.0, color=GOLD, size=17),
    cite("Indian Annual Register 1940; U.P. Police Abstracts of Intelligence, 1940; via Dhulipala, ch. 4", 0, 0.6),
], [
    L("Pakistan was not only preached in U.P. It was fought over. A month after Lahore, Congress-minded Muslims led by the Deobandi ulama held an Azad Muslim Conference in Delhi. Observers put the crowd at fifty thousand, as large as Lahore's. The Premier of Sind called a Pakistan in the east ten times more fantastic and a hundred times more fragile than one in the west."),
    L("Hindu Sabha workers held an anti-Pakistan day. The Akali leader Master Tara Singh told a Lucknow conference that Pakistan would have to pass through an ocean of Sikh blood."),
    L("In June, at a Sikh conference in Aligarh, police reported a procession a mile long, twenty elephants, and about twenty-three thousand people converting to Sikhism, with thousands of free kirpans handed out. The League began enrolling Muslims in its National Guard. The temperature was rising."),
], pal="ink"))

# ---------------- chapter 7 ----------------
seq.append(chapter("ch7", 7, "What the Historians Say", "Testing the chapter", color=AMBER))

seq.append(scene("tests", "void", [
    verdict("v1", 340, 220, "U.P. Leaguers publicly promised\nPakistan as an Islamic state.", "strong", "Mahmudabad, Khaliquzzaman, Rizvi, Musavvir Ali Khan", 0, 0.4, w=560),
    verdict("v2", 940, 220, "That promise was the League's\nsettled policy.", "debated", "Jinnah stayed vague; rhetoric is not a programme", 1, 0.4, w=560),
    verdict("v3", 340, 470, "A smaller Pakistan was accepted\nat the top by 1942.", "partial", "Liaquat to a US diplomat; Jinnah repudiated it a week later", 2, 0.4, w=560),
    verdict("v4", 940, 470, "Hostage minorities would keep\neach other safe.", "weak", "In 1947 minorities on both sides were massacred and expelled", 3, 0.4, w=560),
], [
    L("So what holds up? That U.P.'s League leaders publicly sold Pakistan as an Islamic state: well supported. The speeches and pamphlets survive in their own words."),
    L("That this was the League's settled policy: debated. Jinnah himself rarely spoke in such terms, and critics argue that what a party says to rally its base is not the same as a programme for government."),
    L("That a smaller Pakistan was accepted at the top as early as 1942: partly supported. An American record backs Khaliquzzaman's suspicion about Liaquat. But Jinnah publicly and privately demanded far more."),
    L("And that minorities, held as hostages on each side, would keep each other safe: weak. In 1947 the hostages became the victims, in Punjab and Bengal and beyond."),
], pal="smoke", cam={"zoom": [1.0, 1.02], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("now", "void", [
    typer("h1", 640, 210, "Islamic, or Muslim?", 0, 0.4, size=42, font="serif", italic=True, cursor=False, cps=20),
    label("h2", 640, 320, "1949 · the Objectives Resolution: sovereignty belongs to God", 1, 0.4, color="#e8cfa0", size=18),
    label("h3", 640, 360, "1956 · the Islamic Republic of Pakistan", 1, 2.6, color="#e8cfa0", size=18),
    label("h4", 640, 400, "1973 · Islam the state religion", 1, 4.4, color="#e8cfa0", size=18),
    label("h5", 640, 440, "1980 · a Federal Shariat Court", 1, 6.0, color="#e8cfa0", size=18),
    label("h6", 640, 545, "a 1940 argument that has never been settled", 2, 0.6, color="#b8a888", size=17),
    cite("Constitutions of Pakistan, 1956 and 1973; Objectives Resolution, 12 March 1949", 1, 0.6),
], [
    L("Mahmudabad's distinction, Islamic, not Muslim, did not stay in 1940. A state for Muslims, or a state run by Islamic law? Pakistan has argued about it ever since."),
    L("In 1949 its Assembly declared that sovereignty belongs to God. In 1956 it became an Islamic Republic. In 1973 Islam was made the state religion, and in 1980 a Federal Shariat Court was set up to test laws against Islam."),
    L("And far beyond Pakistan, from South Asia to the Middle East, the same question keeps returning: is a state the home of a faith, or of all its citizens? That last observation is ours."),
    beat(1.6, "heart"),
], pal="blood"))

seq.append(next_card(6, "The Other Medina", "Deoband · 1940 – 1945",
                     "Next time: the ulama who said no. Husain Ahmad Madani and the Jamiat Ulama-i-Hind argued that Muslims and Hindus could share one nation, as the Prophet's Medina once had. Their critique of Pakistan, and the price they paid for it."))

seq.append({"type": "card", "id": "end", "style": "endx", "title": SERIES, "dur": 26, "credits": credits_block(
    ["Anis al Din Ahmad Rizvi, Pakistan (Bareilly, 1940) · Musavvir Ali Khan, Siyasi Nasbul Ain (Badayun, 1940)",
     "M. Ishaq Sandelvi, Islam ka Siyasi Nizam (Azamgarh, 1957) · Chaudhry Khaliquzzaman, Pathway to Pakistan (1961)",
     "Linlithgow Papers · P. W. Radice Papers · U.P. Police Abstracts of Intelligence (British Library)",
     "US State Department papers (1942) · OSS Research and Analysis reports (1943, 1946)", "K. H. Khurshid, Memories of Jinnah · Indian Annual Register (1940-42)"],
    ["S. V. R. Nasr, The Vanguard of the Islamic Revolution (1994)", "M. Qasim Zaman, 'South Asian Islam and the Idea of the Caliphate' (2013)",
     "Pakistan constitutional history: Objectives Resolution (1949), constitutions of 1956 and 1973"])})

ep = {"meta": meta(5, "The Ideal Goal",
                   "After the Lahore Resolution, the Muslim League's leaders in the United Provinces had to explain Pakistan to Muslims who would never live in it. Episode 5 follows the pamphlets, speeches and private letters: an Islamic state, a 'laboratory', a jumping-off ground for the Muslim world, a quiet readiness to accept a smaller Pakistan, and minorities held as hostages.",
                   BOOK + ", chapter 4; the pamphlets, speeches and archival letters quoted there."),
      "cast": CAST, "sequence": seq}

if __name__ == "__main__":
    write(SLUG, ep)
