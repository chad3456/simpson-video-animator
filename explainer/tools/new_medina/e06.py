"""Episode 6: "The Other Medina" (book chapter 5: Ulama at the Forefront of Politics: Three Critiques of Pakistan)."""
from common import *

SLUG = "new-medina-e06-the-other-medina"
seq = []

# ---------------- cold open ----------------
seq.append({"type": "card", "id": "open", "style": "intertitle", "lines": ["Kanpur.", "Spring 1941."], "sub": "A POLICE REPORT", "dur": 5.0, "sfx": "type"})

seq.append(scene("kanpur", {"kind": "room", "pal": "archive"}, [
    slate("KANPUR · UNITED PROVINCES · 1941"),
    doc("p", 640, 330, "U.P. POLICE ABSTRACT OF INTELLIGENCE", "week ending 4 April 1941 (excerpt)",
        ["Jinnah spoke on the usual lines and", "stated that he was willing to allow", "the 2 crores of Muslims who would fall", "in minority provinces ... to be smashed", "in order to liberate 7 crores of Muslims", "in the majority provinces."],
        0, 0.8, w=560, rot=-1.2, cps=28, sfx="type", vol=0.4, hl=3, hlOn=0, keys={"1": {"hlOn": 1, "d": 0.5, "t": 0.4}}),
    cite("U.P. Police Abstract of Intelligence, 4 April 1941; via Dhulipala, ch. 5", 0, 0.8),
], [
    L("In the spring of 1941 Jinnah spoke to Muslim students in Kanpur, in the heart of U.P. A police officer took notes, as police officers did at every political meeting."),
    L("According to that report, Jinnah said he was willing to let the two crore Muslims of the minority provinces be smashed, if that was the price of freeing the seven crore in the majority provinces."),
    L("It is a police summary, not a transcript. But it was the kind of line that the League's fiercest Muslim critics heard, repeated and could not forgive. They were not secular politicians. They were men of religion."),
    beat(1.6, "heart"),
], cam={"zoom": [1.1, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append({"type": "card", "id": "title", "style": "titlex", "kicker": "A LUMEN DOCUMENTARY IN TEN PARTS", "title": SERIES,
            "sub": "Episode 6 · The Other Medina", "by": "after the book by Venkat Dhulipala (2015)", "dur": 7.0, "sfx": "boom"})

# ---------------- chapter 1 ----------------
seq.append(chapter("ch1", 1, "The Other Medina", "Deoband and Delhi · 1938 – 1942", color=JADE))

seq.append(scene("congress", "void", [
    label("c0", 640, 170, "CONGRESS ANSWERS LAHORE", 0, 0.4, color=GOLD, size=22, font="bebas", ls=3),
    label("c1", 640, 230, "Rajagopalachari: a 'diseased mentality'", 0, 1.8, color="#cfe0f0", size=19),
    label("c2", 640, 275, "Nehru: 'it would not last 24 hours'", 0, 3.6, color="#cfe0f0", size=19),
    label("c3", 640, 320, "Gandhi: 'vivisection', and a 'sin'", 0, 5.4, color="#cfe0f0", size=19),
    quote("q", 640, 480, "a pact between the Prophet\nand the Jews in Medina", "Madani's precedent for one Indian nation, as Dhulipala summarises it", 1, 0.6, size=26, w=640),
    cite("Indian Annual Register 1940; Tendulkar, Mahatma, vol. 6; Barbara Metcalf, Husain Ahmad Madani (2009); via Dhulipala, chs 2 and 5", 0, 0.6),
], [
    L("Congress answered the Lahore Resolution with fury. Rajagopalachari blamed a diseased mentality. Nehru said Pakistan would not last twenty-four hours. Gandhi called it the vivisection of India, and a sin."),
    L("But the hard work of arguing with Muslims fell to Congress's oldest Muslim allies: the Deobandi scholars of the Jamiat Ulama-i-Hind. Their leader, Maulana Husain Ahmad Madani, had argued since 1938 that Hindus and Muslims could form one nation. His precedent was the Prophet's own compact with the Jews of Medina. Two communities, two faiths, one city."),
    L("If the League promised a new Medina, the ulama pointed to another one, and said India could be it."),
], pal="ink"))

seq.append(scene("smith", "void", [
    quote("mq", 640, 230, "If it means ... an Islamic state ...\nit is a very noble cause ...\nnobody can imagine the possibility", "Husain Ahmad Madani on the Pakistan movement", 0, 0.4, size=24, w=720),
    quote("sq", 640, 470, "no substantial organized group of Muslims\nopposed to the League's policy of separatism", "W. C. Smith, The Muslim League 1942-45 (1945)", 1, 0.6, size=22, w=720),
    cite("Z. H. Faruqi, The Deoband School and the Demand for Pakistan (1963); W. C. Smith (1945); via Dhulipala, ch. 5", 0, 0.6),
], [
    L("Madani did not say an Islamic state was wrong. If Pakistan meant a state built on the Prophet's traditions and the punishments of Islamic law, he said, it would be a noble cause. His point was that under the conditions of the day, nobody could seriously imagine it happening."),
    L("By the end of 1942, the Canadian scholar Wilfred Cantwell Smith wrote that there was no substantial organised group of Muslims left opposing the League. Dhulipala disagrees. The ulama kept arguing, and some of their predictions turned out to be uncannily accurate. Here are three of them."),
], pal="smoke"))

# ---------------- chapter 2 ----------------
seq.append(chapter("ch2", 2, "The Riddle of Pakistan", "Patna · 14 April 1940", color=GOLD))

seq.append(scene("sajjad", "void", [
    dossier("s", 280, 350, "Maulana Muhammad Sajjad", "founder, Imarat-i-Shariah, Bihar", "1880 – 1940", 0, 0.4, hat="turban", tag="FIRST CRITIC", tagColor="#8a5a2a"),
    label("s1", 870, 200, "weeks after Lahore, in the weekly Naqeeb", 0, 3.0, color="#e8cfa0", size=18),
    label("s2", 870, 290, "an Islamic state? only by expelling", 1, 0.4, color="#ffd8a8", size=18),
    label("s3", 870, 325, "half the population, and shutting", 1, 1.6, color="#ffd8a8", size=18),
    label("s4", 870, 360, "non-Muslims out of government", 1, 2.8, color="#ffd8a8", size=18),
    label("s5", 870, 420, "Jinnah promised neither", 1, 5.0, color=GOLD, size=20),
    label("s6", 870, 520, "so 'Islamic Pakistan' was a fraud", 2, 0.4, color="#e8cfa0", size=19),
    cite("Sajjad, 'Muslim India aur Hindu India par ek Aham Tabsira', Naqeeb, 14 April 1940; via Dhulipala, ch. 5", 0, 0.6),
], [
    L("The first critique appeared within weeks of Lahore, before even Ambedkar's book. Its author, Maulana Muhammad Sajjad of Bihar, had been a runaway boy who fled to a madrasa in Kanpur, was expelled from Deoband after a fight, and grew up to found the Imarat-i-Shariah, a network of Islamic courts that still exists in Bihar."),
    L("His first argument was simple arithmetic. Nearly half the people in the proposed Pakistan were not Muslims. An Islamic state could be built there only by expelling them, and by shutting non-Muslims out of government."),
    L("Jinnah had ruled out large transfers of population, and promised non-Muslims a share in power. So, Sajjad concluded, calling Pakistan Islamic was a fraud."),
], pal="ink"))

seq.append(scene("turkey", "void", [
    label("t0", 640, 170, "THE HOSTAGE THEORY, TESTED AGAINST HISTORY", 0, 0.4, color=GOLD, size=22, font="bebas", ls=3),
    label("t1", 360, 250, "against the Shariah:", 0, 2.4, color="#cfe0f0", size=19),
    label("t2", 360, 290, "no punishing your own citizens", 0, 3.6, color="#cfe0f0", size=18),
    label("t3", 920, 250, "against the record:", 1, 0.4, color="#cfe0f0", size=19),
    label("t4", 920, 290, "Turkey in 1857 · Albania in 1939 · Palestine", 1, 2.2, color="#cfe0f0", size=18),
    {"id": "a", "type": "stat", "x": 360, "y": 460, "value": 0, "size": 80, "color": AMBER, "label": "million sacrificed for 60 million", "in": 2, "d": 0.6, "anim": "fade", "keys": {"2": {"value": 20, "d": 1.0, "t": 1.0}}},
    {"id": "b", "type": "stat", "x": 920, "y": 460, "value": 0, "size": 80, "color": JADE, "label": "million for 250 million worldwide", "in": 2, "d": 8.6, "anim": "fade", "keys": {"2": {"value": 80, "d": 1.0, "t": 9.0}}},
    cite("Sajjad (1940), reissued by the Jamiat as Pakistan ki Cheestan (1942, 1945); via Dhulipala, ch. 5", 0, 0.6),
], [
    L("Then he took apart the hostage theory. Punishing your own peaceful Hindu citizens for what happened to Muslims elsewhere, he wrote, was against the Shariah itself."),
    L("And it had never worked. Turkey had not lifted a finger for India's Muslims in 1857. The Muslim world had watched Italy swallow Albania, and ignored the pleas of the Palestinians. Anyone who believed such protection would come, he wrote, was the worst kind of fool."),
    L("Finally he turned the League's language of sacrifice back on itself. Jinnah asked twenty million Muslims to be sacrificed for sixty million. Better, said Sajjad, for all eighty million to join Congress, overthrow the British Empire, and free two hundred and fifty million Muslims across the world. Pan-Islam, it turned out, could argue against Pakistan too."),
], pal="ink"))

# ---------------- chapter 3 ----------------
seq.append(chapter("ch3", 3, "The Wicketkeeper from Aligarh", "Badayun · 1941 – 1942", color=SKY))

seq.append(scene("manglori", "void", [
    dossier("m", 280, 350, "Tufail Ahmad Manglori", "Aligarh old boy; Azad Muslim Conference", "born 1868", 0, 0.4, hat="fez", glasses=True, tag="NOT A CLERIC", tagColor="#3a6ea5"),
    label("m1", 870, 200, "Hindus in the Muslim zones: 40 and 43 per cent", 0, 2.6, color="#cfe0f0", size=18),
    label("m2", 870, 245, "Muslims in the Hindu zone: about 10 per cent", 0, 4.6, color="#cfe0f0", size=18),
    {"id": "st", "type": "stat", "x": 870, "y": 380, "value": 0, "size": 90, "color": AMBER, "label": "million Muslims left behind", "in": 1, "d": 0.6, "anim": "fade", "keys": {"1": {"value": 28, "d": 1.2, "t": 1.0}}},
    quote("q", 870, 540, "martyrdom, yes; suicide, no", "Manglori's answer to the language of sacrifice (paraphrase)", 2, 0.6, size=24, w=480),
    cite("Manglori in Zulqarnain (Badayun), 1941-42; Teen Karod Musalmanon ki Hifazat (1941); via Dhulipala, ch. 5", 0, 0.6),
], [
    L("The second critic was no cleric at all. Tufail Ahmad Manglori was one of the first students at Sir Syed's college in Aligarh, its cricket team's wicketkeeper, nicknamed Maulvi for his neat dress and regular prayers. In old age, half blind, he wrote a stream of articles for a weekly in Badayun."),
    L("He did the sums that League speakers avoided. Hindus would be forty per cent of the north-western zone and forty-three per cent of the eastern one. Muslims in the rest of India would be about one in ten. That was some twenty-eight million people, poor and scattered, nearly half as many as Pakistan's own Muslims."),
    L("Minority-province Muslims would gladly die as martyrs in open battle, he wrote. But the Qaid was not offering them martyrdom. He was asking them to commit suicide, and Islam forbade suicide."),
], pal="ink"))

seq.append(scene("joint", "void", [
    tome("t", 300, 330, "Musalmanon ka Raushan Mustaqbil", "Tufail Ahmad Manglori · 5 editions, 1937–45", "#2f4f6f", 0, 0.4, w=190, h=250),
    label("j0", 880, 200, "HIS REMEDY: JOINT ELECTORATES", 0, 2.0, color=GOLD, size=21, font="bebas", ls=3),
    label("j1", 880, 250, "make Hindu politicians need Muslim votes", 0, 3.6, color="#e8cfa0", size=17),
    label("j2", 880, 330, "Badayun riot, 1929: the town pays a police tax;", 1, 0.4, color="#e8cfa0", size=17),
    label("j3", 880, 365, "the civil lines, where the elites live, do not", 1, 2.2, color="#e8cfa0", size=17),
    quote("g", 880, 490, "though your argument is good I am afraid\nno good will come out of publishing it", "Gandhi to Manglori, 24 May 1942", 2, 0.6, size=20, w=500),
    cite("Manglori, 'Muslim Aqalliyat ki Hifazat', Zulqarnain, 14 Feb 1942; CWMG vol. 76, 144; via Dhulipala, ch. 5", 0, 0.6),
], [
    L("His remedy flew in the face of thirty years of Muslim politics. Scrap separate electorates, he said. Under a joint vote, a Hindu candidate had to knock on Muslim doors, and would never lead a band past a mosque at prayer time. Separate electorates suited only the Muslim elite, who no longer had to court anyone."),
    L("He had a story to prove it. After a riot in Badayun in 1929, the town had to pay for extra police. The civil lines, where the well-to-do of both faiths played cards and tennis together, were exempt. There had been no riot there."),
    L("He sent his essay to Gandhi for publication. Gandhi replied that the argument was good, but no good would come of publishing it now."),
], pal="ink"))

# ---------------- chapter 4 ----------------
seq.append(chapter("ch4", 4, "A Revelation from Buckingham", "Delhi · 1945", color=RED))

seq.append(scene("seoharvi", "void", [
    dossier("h", 280, 350, "Hifzur Rahman Seoharvi", "Nazim, Jamiat Ulama-i-Hind", "1901 – 1962", 0, 0.4, hat="turban", tag="1945 ELECTION", tagColor="#8a2a2a"),
    {"id": "p", "type": "paper", "x": 870, "y": 330, "w": 380, "h": 400, "mast": "MADINA", "date": "Bijnor · 1945", "head": "A Look at the\nPakistan Movement", "headSize": 30,
     "sub": "by Hifzur Rahman Seoharvi", "cols": 3, "rot": 1.5, "anim": "rise"},
    label("x1", 870, 580, "reprinted as Congress election propaganda", 1, 0.6, color="#ffd8a8", size=17),
    cite("Seoharvi, Tehrik-i-Pakistan par ek Nazar (Delhi, 1945); via Dhulipala, ch. 5", 0, 0.6),
], [
    L("The third critique came on the eve of the 1945 election, the vote that would decide Pakistan. Its author, Maulana Hifzur Rahman Seoharvi, was the Jamiat's chief organiser, a Deoband-trained scholar from Bijnor who had once sat on the League's own election board."),
    L("His essay ran in the Bijnor newspaper Madina and was reprinted by Congress as campaign literature. Where Sajjad and Manglori spoke for the Muslims left behind, Seoharvi asked what Pakistan would do to all of India's Muslims."),
], pal="ink"))

seq.append(scene("geography", "void", [
    typer("t", 640, 200, "a Muslim will be someone who lives in Pakistan", 0, 0.8, size=28, font="serif", italic=True, color="#e8cfa0", cursor=False),
    label("g0", 640, 255, "Seoharvi's warning, paraphrased", 0, 4.4, color="#b8a888", size=16),
    label("g1", 360, 350, "Islam shrunk from a faith", 1, 0.4, color="#cfe0f0", size=19),
    label("g2", 360, 385, "to a 'geographical programme'", 1, 2.0, color="#cfe0f0", size=19),
    label("g3", 920, 350, "Urdu in India would become", 2, 0.4, color="#ffd8a8", size=19),
    label("g4", 920, 385, "a 'holy' language, like Arabic", 2, 2.0, color="#ffd8a8", size=19),
    label("g5", 640, 500, "and Pakistan itself, he said, was a revelation", 3, 0.4, color=GOLD, size=19),
    label("g6", 640, 535, "'from the Kaiser of Buckingham'", 3, 2.4, color=GOLD, size=21),
    cite("Seoharvi, Tehrik-i-Pakistan par ek Nazar (1945); via Dhulipala, ch. 5", 0, 0.6),
], [
    L("His sharpest point was about identity. A German is someone who lives in Germany, he wrote. After partition, a Muslim would come to mean someone who lives in Pakistan. Inviting a Hindu to embrace Islam would sound like inviting him to change countries. Islam would shrink from a faith into a geographical programme."),
    L("He predicted that if Pakistan made Urdu its language, India would choose Hindi in the Devanagari script, and Urdu would become a holy language among Indian Muslims, like Arabic, read only by scholars."),
    L("He predicted a Pakistan short of capital, dependent on foreign money, a quarter the size of its neighbour. And he was not above a cheap shot or two, including sectarian jabs at Shia and Ahmadi League leaders."),
    L("Pakistan, he said, was no revelation granted to Iqbal or Jinnah. It was a revelation from the Kaiser of Buckingham: a British plot to divide and rule."),
], pal="ink"))

# ---------------- chapter 5 ----------------
seq.append(chapter("ch5", 5, "The Ulama's Alternative", "Saharanpur · 1945", color=AMBER))

seq.append(scene("formula", "void", [
    {"id": "h", "type": "hemicycle", "x": 640, "y": 380, "r": 220, "rows": 6, "reveal": 0, "anim": "fade", "title": "A FEDERAL ASSEMBLY · PARITY AT THE CENTRE", "legendGap": 260,
     "groups": [{"n": 45, "color": JADE, "label": "Muslims"}, {"n": 10, "color": "#8a7e68", "label": "Others"}, {"n": 45, "color": AMBER, "label": "Hindus"}],
     "keys": {"0": {"reveal": 1, "d": 2.0, "t": 6.0}}},
    label("f4", 640, 500, "a veto for two-thirds of Muslim members", 1, 0.4, color="#e8cfa0", size=18),
    label("f5", 640, 540, "a Supreme Court half Muslim, half non-Muslim", 1, 2.4, color="#e8cfa0", size=18),
    label("f6", 640, 595, "'better protection than the Pakistan resolution'", 2, 0.4, color=GOLD, size=19),
    cite("Jamiat Ulama-i-Hind resolutions, Lahore 1942 and Saharanpur 1945; Seoharvi (1945); via Dhulipala, ch. 5", 0, 0.6),
], [
    L("The ulama did not only say no. In 1945, at Saharanpur, the Jamiat proposed a united India with weak central powers and strong provinces, and at the centre, parity: forty-five per cent of seats for Muslims, forty-five for Hindus, ten for everyone else."),
    L("Any bill opposed by two-thirds of the Muslim members could not pass. The Supreme Court would have equal numbers of Muslim and non-Muslim judges."),
    L("According to Seoharvi, one well-known U.P. League leader admitted privately that this protected Muslims better than the Pakistan resolution did. Jinnah would not discuss it."),
], pal="ink"))

# ---------------- chapter 6 ----------------
seq.append(chapter("ch6", 6, "What the Historians Say", "Testing the chapter", color=AMBER))

seq.append(scene("tests", "void", [
    verdict("v1", 340, 220, "Influential ulama argued against\nPakistan until the end.", "strong", "Tracts by Sajjad, Manglori, Seoharvi; the Jamiat's 1945 campaign", 0, 0.4, w=560),
    verdict("v2", 940, 220, "By 1942 organised Muslim\nopposition had collapsed.", "contested", "W. C. Smith said so; Dhulipala shows the debate went on", 1, 0.4, w=560),
    verdict("v3", 340, 470, "Partition would weaken Urdu\nin India.", "partial", "Hindi became India's official language; Urdu survives, diminished", 2, 0.4, w=560),
    verdict("v4", 940, 470, "Pakistan was a British plot\nto divide and rule.", "weak", "Few historians accept a simple plot; British policy is still argued over", 3, 0.4, w=560),
], [
    L("So what holds up? That influential ulama argued against Pakistan until the very end: well supported. Their tracts survive, and they campaigned in the 1945 election."),
    L("That organised Muslim opposition had collapsed by 1942: contested. Smith said so at the time. Dhulipala shows the argument went on, though the League would win the vote."),
    L("That partition would weaken Urdu in India: partly borne out. Hindi in Devanagari became India's official language in 1950. Urdu survives, in literature, film and some state governments, but it lost much of its old place in north India."),
    L("And that Pakistan was simply a British plot: weak. British policy is still argued over, but few historians today accept so simple an account. The ulama themselves, as Dhulipala notes, also never discussed the one thing that would come true: the partition of Punjab and Bengal."),
], pal="smoke", cam={"zoom": [1.0, 1.02], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("now", "void", [
    typer("h1", 640, 210, "Who speaks for those left behind?", 0, 0.4, size=38, font="serif", italic=True, cursor=False, cps=20),
    {"id": "st", "type": "stat", "x": 640, "y": 370, "value": 0, "size": 96, "color": AMBER, "label": "million Muslims in India, 2011 census (14.2%)", "in": 1, "d": 0.6, "anim": "fade", "keys": {"1": {"value": 172, "d": 1.6, "t": 1.0}}},
    label("h3", 640, 545, "the minority the 1940s debate was about", 2, 0.6, color="#b8a888", size=17),
    cite("Census of India 2011, religion data", 1, 0.6),
], [
    L("The minority-province Muslims these men worried about did not disappear. Most of them stayed."),
    L("Their descendants are counted in modern India's census: about a hundred and seventy-two million people in 2011, more Muslims than live in almost any other country on earth."),
    L("Manglori's question still runs through Indian politics: are minorities safer when politicians must compete for their votes, or when they vote apart? And the ulama's other Medina, a city of many faiths under one compact, is still the idea that India's constitution was built to test. Those last observations are ours."),
    beat(1.6, "heart"),
], pal="blood"))

seq.append(next_card(7, "Letters to Madina", "Bijnor · 1942 – 1943",
                     "Next time: a small-town newspaper opens its pages to its readers, and letters arrive from Bombay to Chittagong to Raichur. What ordinary Muslims thought Pakistan would be, in their own words."))

seq.append({"type": "card", "id": "end", "style": "endx", "title": SERIES, "dur": 26, "credits": credits_block(
    ["Maulana Muhammad Sajjad, in Naqeeb (Patna, 1940) · Pakistan ki Cheestan (Jamiat, 1942, 1945)",
     "Tufail Ahmad Manglori, Zulqarnain (Badayun, 1941-42) · Musalmanon ka Raushan Mustaqbil",
     "Hifzur Rahman Seoharvi, Tehrik-i-Pakistan par ek Nazar (Delhi, 1945)", "U.P. Police Abstracts of Intelligence (British Library) · Collected Works of Mahatma Gandhi, vol. 76"],
    ["Barbara Metcalf, Husain Ahmad Madani: The Jihad for Islam and India's Freedom (2009)", "Z. H. Faruqi, The Deoband School and the Demand for Pakistan (1963)",
     "W. C. Smith, The Muslim League 1942-45 (1945)", "Census of India 2011"])})

ep = {"meta": meta(6, "The Other Medina",
                   "Some of Pakistan's most determined Muslim opponents were men of religion. Episode 6 follows three critiques from the Deobandi camp and its allies: Sajjad's 'fraud of Islamic Pakistan', Manglori's sums for the Muslims left behind, and Seoharvi's warning that Islam would shrink into geography, plus the ulama's own plan for a united India.",
                   BOOK + ", chapter 5; the Urdu tracts and articles quoted there; Metcalf (2009) on Madani."),
      "cast": CAST, "sequence": seq}

if __name__ == "__main__":
    write(SLUG, ep)
