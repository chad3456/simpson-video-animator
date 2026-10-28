"""Episode 8: "The Shaikhul Islam" (book chapter 7: Fusing Islam and State Power: Shabbir Ahmad Usmani and Pakistan as the New Medina)."""
from common import *

SLUG = "new-medina-e08-the-shaikhul-islam"
seq = []

# ---------------- cold open ----------------
seq.append({"type": "card", "id": "open", "style": "intertitle", "lines": ["Deoband.", "7 December 1945."], "sub": "THREE AND A HALF HOURS", "dur": 5.0, "sfx": "type"})

seq.append(scene("visit", "void", [
    slate("DEOBAND · 7 DECEMBER 1945"),
    dossier("u", 300, 340, "Shabbir Ahmad Usmani", "the host", "1887 – 1949", 0, 0.4, hat="turban", glasses=True, tag="FOR PAKISTAN", tagColor="#2f6f5a", w=200, h=270),
    dossier("m", 640, 340, "Husain Ahmad Madani", "the guest", "1879 – 1957", 0, 6.0, hat="turban", tag="AGAINST", tagColor="#8a2a2a", w=200, h=270),
    dossier("s", 980, 340, "Hifzur Rahman Seoharvi", "his former student", "1901 – 1962", 0, 13.0, hat="turban", tag="AGAINST", tagColor="#8a2a2a", w=200, h=270),
    cite("Account of the meeting in Usmani's papers, via Dhulipala, ch. 7", 0, 0.6),
], [
    L("On the seventh of December 1945, in the town of Deoband, a delegation called at the house of an elderly scholar. Among the guests were the most powerful clerics in Muslim India: Maulana Husain Ahmad Madani, Mufti Kifayatullah, and the host's own former student, Hifzur Rahman Seoharvi."),
    L("They had come to ask their old colleague one thing: to take back his support for Pakistan. They argued for three and a half hours. As they left, they pleaded with him at least to stay silent."),
    L("He told them he could not. His name was Shabbir Ahmad Usmani, and he was about to become the most important religious voice for Pakistan."),
    beat(1.6, "heart"),
], cam={"zoom": [1.08, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append({"type": "card", "id": "title", "style": "titlex", "kicker": "A LUMEN DOCUMENTARY IN TEN PARTS", "title": SERIES,
            "sub": "Episode 8 · The Shaikhul Islam", "by": "after the book by Venkat Dhulipala (2015)", "dur": 7.0, "sfx": "boom"})

# ---------------- chapter 1 ----------------
seq.append(chapter("ch1", 1, "A Split in Deoband", "Calcutta · October 1945", color=JADE))

seq.append(scene("usmani", "void", [
    dossier("u", 280, 350, "Shabbir Ahmad Usmani", "scholar of hadith, Deoband", "born Bijnor, 1887", 0, 0.4, hat="turban", glasses=True, tag="SHAIKHUL ISLAM", tagColor="#2f6f5a"),
    label("u1", 870, 200, "son of a Deoband founding family", 0, 2.0, color="#c8f0dd", size=18),
    label("u2", 870, 240, "a famed commentary on Sahih Muslim", 0, 3.8, color="#c8f0dd", size=18),
    label("u3", 870, 280, "finished his teacher's Quran translation", 0, 5.6, color="#c8f0dd", size=18),
    label("u4", 870, 380, "JAMIATUL ULAMA-I-ISLAM", 1, 0.4, color=GOLD, size=22, font="bebas", ls=3),
    label("u5", 870, 420, "Calcutta, October 1945 · some 5,000 ulama", 1, 2.0, color="#e8cfa0", size=18),
    label("u6", 870, 460, "against 'Gandhism, Communism' and secularism", 1, 4.0, color="#e8cfa0", size=17),
    cite("Rizvi, History of the Dar al Uloom Deoband (1981); JUI resolutions, Calcutta 1945; via Dhulipala, ch. 7", 0, 0.6),
], [
    L("Usmani was Deoband royalty. Born in Bijnor in 1887, his father had helped found the great seminary, one brother ran it and another led its fatwa department. He wrote a celebrated commentary on the hadith, and finished his revered teacher's translation of the Quran. His supporters liked to point out that the family had chosen him for that task, and not Madani."),
    L("In October 1945, as elections were called, his followers broke away from the Congress-allied Jamiat and founded a rival: the Jamiatul Ulama-i-Islam. Some five thousand scholars gathered in Calcutta. They declared against Gandhism, Communism and the godless secularism of Kemal Ataturk's Turkey, and pledged their love and sympathy to Jinnah."),
], pal="ink"))

seq.append(scene("demands", {"kind": "room", "pal": "archive"}, [
    doc("d", 400, 320, "JAMIATUL ULAMA-I-ISLAM", "Political resolutions, Calcutta 1945 (substance)",
        ["Restore the office of Shaikhul Islam.", "A Grand Mufti over Islamic Qazi courts.", "A Baitul Mal to administer zakat.", "A Diwan us Shariat: no bill touching", "the Shariah to pass without its approval."],
        0, 0.4, w=500, rot=-1.2, cps=28, sfx="type", vol=0.4, hl=4, hlOn=0, keys={"0": {"hlOn": 1, "d": 9.0, "t": 0.6}}),
    cite("JUI resolutions (1945); The Pioneer, 21 September 1945; via Dhulipala, ch. 7", 0, 0.6),
], [
    L("They also said what they wanted in return. Since Pakistan would be an Islamic state, the scholars demanded an official Shaikhul Islam to head the community, a Grand Mufti over Islamic courts, a treasury for zakat, and a council of religious experts. No law touching the Shariah could pass without that council's approval."),
], cam={"zoom": [1.05, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("tour", "void", [
    {"id": "m", "type": "samap", "x": 706, "y": 679, "k": 3.0, "split": 0, "und": 0, "nb": 0.8, "up": 0.55, "upLabel": False, "anim": "fade",
     "cities": [{"name": "Azamgarh"}, {"name": "Bijnor"}, {"name": "Lucknow"}, {"name": "Kanpur"}, {"at": [78.57, 25.45], "name": "Jhansi"}], "lit": 0, "keys": {"0": {"lit": 5, "d": 4.0, "t": 3.0}}},
    label("t1", 960, 230, "24 maulanas · 5 touring groups", 0, 1.0, color="#ffd08a", size=18),
    cite("The Pioneer, 21 September 1945; via Dhulipala, ch. 7", 0, 0.6),
], [
    L("Even before the new party existed, the League had organised twenty-four maulanas from U.P. into five touring groups, each assigned its districts, from Azamgarh in the east to Jhansi in the south. Their only instruction: preach Pakistan as Muslims' birthright, and leave local quarrels alone."),
], cam={"zoom": [1.05, 1.0], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 2 ----------------
seq.append(chapter("ch2", 2, "The New Medina", "Election speeches · 1945 – 1946", color=GOLD))

seq.append(scene("medina", "void", [
    {"id": "m", "type": "samap", "view": "wide", "x": 640, "y": 380, "k": 1.25, "split": 1, "nb": 0.7, "anim": "fade", "pkColor": "#2f6f5a",
     "cities": [{"name": "Mecca", "color": "#e8cfa0", "left": True}, {"name": "Medina", "color": JADE, "left": True, "note": "622: the Hijra"}, {"name": "Lahore", "color": JADE, "left": True}, {"name": "Lucknow", "color": GOLD}],
     "arcs": [{"from": "Mecca", "to": "Medina", "bend": 0.6}, {"from": "Lucknow", "to": "Lahore", "bend": 0.5}],
     "arcDraw": [0, 0], "keys": {"0": {"arcDraw": [1, 0], "d": 3.0, "t": 3.0}, "1": {"arcDraw": [1, 1], "d": 3.0, "t": 2.0}}},
    {"id": "pn", "type": "panel", "x": 1040, "y": 540, "w": 420, "h": 170, "anim": "fade", "in": 1, "d": 6.0},
    label("q1", 1040, 510, "muhajirin from U.P.", 1, 6.4, color="#e8cfa0", size=19),
    label("q2", 1040, 550, "ansar of the Pakistan provinces", 1, 7.6, color="#c8f0dd", size=19),
    cite("Usmani, Hamara Pakistan (Lahore, 1946) and Khutbat-i-Usmani; via Dhulipala, ch. 7", 0, 0.6),
], [
    L("In speech after speech Usmani used Pakistan and Medina almost as one word. The Prophet, he said, had not built the first Pakistan in his native Mecca, where he was persecuted. He migrated to Medina, where Muslims could live their faith freely. In an undivided India, where Hindus would always rule the centre, no Medina was possible."),
    L("In Medina the migrants from Mecca, the muhajirin, built the new state with the local helpers, the ansar. Now, he said, the Muslims of U.P. were the muhajirin, working with the Muslims of Punjab and Bengal, though they knew their own homes would lie outside."),
    L("And just as Medina became the base from which Islam won all of Arabia, Pakistan, he told his listeners, would one day turn the whole of Hindustan into Pakistan."),
], pal="ink"))

# ---------------- chapter 3 ----------------
seq.append(chapter("ch3", 3, "Captain and Pilot", "Lucknow · June 1946", color=SKY))

seq.append(scene("gama", "void", [
    label("g0", 360, 190, "THE WRESTLER", 0, 0.4, color=GOLD, size=22, font="bebas", ls=3),
    label("g1", 360, 240, "Zbyszko came to India.", 0, 2.0, color="#cfe0f0", size=18),
    label("g2", 360, 275, "India sent Gama, not Gandhi,", 0, 3.6, color="#cfe0f0", size=18),
    label("g3", 360, 310, "not Madani, not me.", 0, 5.0, color="#cfe0f0", size=18),
    label("g4", 360, 370, "Jinnah: the expert in his field", 0, 7.0, color="#ffd08a", size=19),
    label("p0", 920, 190, "THE PILOT", 1, 0.4, color=GOLD, size=22, font="bebas", ls=3),
    label("p1", 920, 240, "An English captain sails the Haj ship", 1, 2.0, color="#cfe0f0", size=18),
    label("p2", 920, 275, "but stops short of Jeddah's reefs.", 1, 3.6, color="#cfe0f0", size=18),
    label("p3", 920, 310, "An Arab pilot takes her in.", 1, 5.0, color="#cfe0f0", size=18),
    label("p4", 920, 370, "the ulama: the pilots of Pakistan", 1, 7.0, color="#ffd08a", size=19),
    quote("q", 640, 520, "the League made us ek (one);\nnow we must become nek (virtuous)", "Usmani, as Dhulipala paraphrases him", 2, 0.6, size=23, w=620),
    cite("Usmani, speech in Lucknow, Sidq, 5 June 1946; via Dhulipala, ch. 7", 0, 0.6),
], [
    L("But why should a pious scholar follow a westernised lawyer? Usmani answered with two images. When the European wrestler Zbyszko came to India, nobody sent Gandhi or Madani, or Usmani, to fight him. They sent the great Gama, an expert. In constitutional battles, Jinnah was the Gama of Muslim India."),
    L("The second image showed where Jinnah's role ended. Haj ships sailed from India under English captains. But near Jeddah, with its reefs and shoals, an Arab pilot came aboard to bring the ship to port. Jinnah was the English captain. When it came to building an Islamic state, the ulama would be the pilots."),
    L("And the people had a part too. The League had made Muslims one, ek, he said, with a pun in Urdu. Now they had to become nek: virtuous."),
], pal="ink"))

seq.append(scene("sinner", "void", [
    typer("t", 640, 210, "a sinner, but incorruptible", 0, 0.6, size=36, font="serif", italic=True, cursor=False, cps=18),
    label("s1", 640, 300, "Usmani on Jinnah, paraphrased", 0, 3.6, color="#b8a888", size=16),
    label("s2", 640, 390, "the Islamic state would come 'gradually'", 1, 0.4, color="#e8cfa0", size=19),
    label("s3", 640, 430, "'like the night withdraws slowly'", 1, 2.6, color="#e8cfa0", size=19),
    label("s4", 640, 530, "Dhulipala: no fundamentalist, but a pragmatist", 2, 0.6, color=GOLD, size=18),
    cite("Usmani, Khutbat-i-Usmani; Hamara Pakistan (1946); via Dhulipala, ch. 7", 0, 0.6),
], [
    L("Usmani did not pretend the League's leaders were saints. He called Jinnah a fasiq, a sinner, and admitted that many League men were far from pious. He said it was a medieval jurist's ruling that settled his mind: even Muslims you condemn deserve your support when they fight unbelievers. But Jinnah, he insisted, was incorruptible. He could not be bought."),
    L("Nor would the Islamic state arrive overnight. It would come gradually, he said, just as night withdraws slowly and the daylight spreads."),
    L("Dhulipala reads this as the key to the alliance. Usmani was no literalist. He was a pragmatist, and his gradualism left room for the League's modernists and the ulama to share one cause, and argue later."),
], pal="smoke"))

# ---------------- chapter 4 ----------------
seq.append(chapter("ch4", 4, "The Caliph's White Horses", "Promises to the minority provinces", color=RED))

seq.append(scene("horses", "void", [
    label("h0", 640, 170, "A LEGEND USMANI TOLD", 0, 0.4, color=GOLD, size=22, font="bebas", ls=3),
    label("h1", 640, 220, "A Byzantine soldier strikes an old Muslim woman.", 0, 2.0, color="#cfe0f0", size=18),
    label("h2", 640, 255, "'Will your Caliph come on a white horse?'", 0, 4.0, color="#cfe0f0", size=18),
    label("h3", 640, 290, "The Caliph al-Mu'tasim buys every white horse, and comes.", 0, 6.0, color="#cfe0f0", size=18),
    quote("q", 640, 450, "don't you think the Hindus are worried\nabout their 3 crore Hindu minority in Pakistan?", "Usmani, Hamara Pakistan (1946)", 1, 0.6, size=22, w=720),
    label("h4", 640, 580, "the hostage theory, now with a legend attached", 2, 0.6, color="#b8a888", size=17),
    cite("Usmani, Hamara Pakistan (1946); via Dhulipala, ch. 7", 0, 0.6),
], [
    L("To Muslims who would stay in Hindustan, Usmani told an old legend. When a Christian soldier in Byzantium slapped an elderly Muslim woman, he mocked her: would her Caliph come riding on a white horse to avenge her? Word reached Baghdad. The Caliph al-Mu'tasim bought up every white horse he could find, raised an army, won his war, and delivered the soldier to the old woman's feet."),
    L("A powerful Pakistan, Usmani promised, would do the same. Nobody would dare molest Muslims in Hindustan. Don't you think, he asked, that the Hindus are worried about their own three crore minority in Pakistan?"),
    L("It was the hostage theory again, now dressed in the robes of Islamic history."),
], pal="ink"))

seq.append(scene("boast", "void", [
    label("b1", 640, 190, "rivers diverted, as at Panama", 0, 1.0, color="#ffd08a", size=19),
    label("b2", 640, 230, "Calcutta's trade, Karachi's oil routes", 0, 3.0, color="#ffd08a", size=19),
    quote("q", 640, 360, "What will then happen to the Hindu!", "Usmani on Pakistan's trade, 1946", 0, 6.0, size=30, w=640),
    label("b3", 640, 500, "and if Russia invades? point it to the railway line to India", 1, 0.6, color="#cfe0f0", size=18),
    cite("Usmani, Hamara Pakistan (1946); speech at Peshawar, 1947; via Dhulipala, ch. 7", 0, 0.6),
], [
    L("He also made the worldly case, and he made it big. Punjab could become the greatest wheat producer on earth. The Ganga and Yamuna could be diverted into Pakistan's rivers, as American engineers had moved rivers to build the Panama Canal. Calcutta, which he expected Pakistan to get, would carry the trade of Asia. What, he asked, will then happen to the Hindu!"),
    L("And when a Congress-minded friend asked how a poor Pakistan would resist a Russian invasion, Usmani said he would tell the Russians that Pakistan was poor, and point them down the railway line to India, where the money was."),
], pal="ink"))

# ---------------- chapter 5 ----------------
seq.append(chapter("ch5", 5, "Three and a Half Hours", "Deoband · 7 December 1945", color=AMBER))

seq.append(scene("debate", "void", [
    {"id": "a", "type": "stat", "x": 360, "y": 260, "value": 0, "suffix": "%", "size": 100, "color": JADE, "label": "Muslims in one Pakistan, by Usmani's sums", "in": 0, "d": 0.6, "anim": "fade", "keys": {"0": {"value": 70, "d": 1.4, "t": 6.0}}},
    {"id": "b", "type": "stat", "x": 920, "y": 260, "value": 0, "suffix": "%", "size": 100, "color": AMBER, "label": "Muslim seats under the Jamiat plan", "in": 0, "d": 8.0, "anim": "fade", "keys": {"0": {"value": 45, "d": 1.4, "t": 8.4}}},
    label("d1", 640, 420, "'Why do Hindus oppose Pakistan, if it only hurts Muslims?'", 1, 0.4, color="#e8cfa0", size=18),
    label("d2", 640, 470, "Madani reads an Englishman's essay: Pakistan is a British idea", 2, 0.4, color="#cfe0f0", size=18),
    label("d3", 640, 510, "Usmani: Britain divides, or unites, as it suits Britain", 2, 3.0, color="#cfe0f0", size=18),
    cite("Account of the meeting of 7 December 1945, via Dhulipala, ch. 7", 0, 0.6),
], [
    L("Back to that afternoon in Deoband. Seoharvi argued that Hindus in Punjab and Bengal were too strong for a Muslim government. Usmani asked: would there be six Pakistans, or one? One, Seoharvi agreed. Then count it as one, said Usmani: about seventy per cent Muslim. Was that not better than the forty-five per cent of seats the Jamiat's own plan offered Muslims in a united India?"),
    L("Then he asked the question that, by his own account, left his guests without an answer. If Pakistan was so bad for Muslims and so good for Hindus, why were Hindus so bitterly against it?"),
    L("Madani, silent until then, took out an essay by an Englishman recommending partition, and read it aloud. Pakistan was a British idea. Usmani replied that Britain divided countries or stitched them together as it suited Britain. It had broken up the Ottoman lands, and was now assembling the Arab League."),
], pal="ink"))

seq.append(scene("posters", {"kind": "room", "pal": "archive"}, [
    doc("p", 420, 310, "ON THE WALLS OF THE DARUL ULOOM", "as Usmani described it",
        ["Posters comparing him to Abu Jahal,", "the Prophet's arch-enemy.", "Threats to kill him.", "Filthy letters left at his door."], 0, 0.4, w=480, rot=-1.5, cps=26, sfx="type", vol=0.4),
    quote("q", 920, 290, "none of us ever softened\nwhile arguing theology", "Usmani, as the meeting ended; everyone laughed", 1, 0.6, size=22, w=440),
    label("l1", 920, 460, "'stay silent' · 'I cannot'", 2, 0.6, color=GOLD, size=20),
    cite("Account of the meeting of 7 December 1945, via Dhulipala, ch. 7", 0, 0.6),
], [
    L("It turned personal. Usmani's guests complained of Aligarh students who had insulted Madani. Usmani said he had condemned that. But at Deoband itself, he said, students taught by his own former pupils had put up posters comparing him to Abu Jahal, the Prophet's arch-enemy, sent him death threats, and left obscene letters at his door. None of his visitors had said a word."),
    L("Still, the old scholars had known each other for decades. When one complained that Usmani's statements left no room for anyone else, he replied that none of them had ever softened while arguing theology. Everyone laughed."),
    L("Then came the plea to stay silent, and the refusal. Within weeks Usmani was president of the new party, campaigning across India."),
], cam={"zoom": [1.05, 1.0], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 6 ----------------
seq.append(chapter("ch6", 6, "What the Historians Say", "Testing the chapter", color=AMBER))

seq.append(scene("tests", "void", [
    verdict("v1", 340, 220, "A major group of Deobandi ulama\ncampaigned for Pakistan.", "strong", "The JUI, Usmani's speeches, the League's touring maulanas", 0, 0.4, w=560),
    verdict("v2", 940, 220, "The ulama were decisive in the\nLeague's 1946 victory.", "debated", "Dhulipala stresses them; others stress landlords, students, organisation", 1, 0.4, w=560),
    verdict("v3", 340, 470, "Usmani's 'pilot' foreshadowed\nKhomeini's rule of the jurist.", "contested", "Dhulipala floats the parallel; no evidence of direct influence", 2, 0.4, w=560),
    verdict("v4", 940, 470, "Pakistan would win Calcutta\nand Asia's trade.", "weak", "Calcutta went to India in 1947", 3, 0.4, w=560),
], [
    L("So what holds up? That a major group of Deobandi scholars campaigned for Pakistan, against the image of the ulama as Congress's natural allies: well supported."),
    L("That the ulama were decisive in the League's 1946 victory, the claim we met in episode one: debated. Dhulipala gives them real weight. Other historians put more stress on landlords, students and the League's own machine. Our next episode looks at the vote itself."),
    L("That Usmani's captain and pilot foreshadowed the rule of the jurist in Khomeini's Iran: contested. Dhulipala floats the parallel as a question for future research, not a finding."),
    L("And that Pakistan would win Calcutta and the trade of Asia: weak. Calcutta went to India."),
], pal="smoke", cam={"zoom": [1.0, 1.02], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("now", "void", [
    typer("h1", 640, 200, "Who steers the ship?", 0, 0.4, size=42, font="serif", italic=True, cursor=False, cps=20),
    quote("q", 640, 340, "Pakistan wants to become the lighthouse\nshowing a beacon of light", "Usmani in Pakistan's Constituent Assembly, March 1949", 1, 0.6, size=22, w=680),
    label("h2", 640, 470, "September 1948: he leads the prayers at Jinnah's funeral", 2, 0.4, color="#e8cfa0", size=18),
    label("h3", 640, 510, "March 1949: the Objectives Resolution passes", 2, 2.6, color="#e8cfa0", size=18),
    label("h4", 640, 550, "December 1949: Usmani dies", 2, 4.6, color="#b8a888", size=17),
    cite("Usmani, Roshni ka Minar (Multan, 1950); via Dhulipala, ch. 7", 1, 0.6),
], [
    L("The English captain did not live long enough to be relieved. When Jinnah died in September 1948, it was Usmani who led the prayers at his funeral."),
    L("Six months later Pakistan's Assembly passed the Objectives Resolution, declaring that sovereignty belongs to God. Usmani hailed it as the moment Pakistan became a lighthouse for a world lost in materialism. He died at the end of that year."),
    L("His question outlived him: once the politicians have won the state, who steers it, the captain or the pilot? Pakistan has argued about it ever since, and so, in their own ways, have Iran, Egypt, Turkey and many others. That observation is ours."),
    beat(1.6, "heart"),
], pal="blood"))

seq.append(next_card(9, "The Referendum", "U.P. · 1945 – 1946",
                     "Next time: the vote. The elections of 1945 and 1946 become a referendum on Pakistan, and the Muslims of U.P., who would never live in it, give the League their answer."))

seq.append({"type": "card", "id": "end", "style": "endx", "title": SERIES, "dur": 26, "credits": credits_block(
    ["Shabbir Ahmad Usmani, Hamara Pakistan (1946) · Khutbat-i-Usmani, ed. Sherkoti (1972) · Roshni ka Minar (1950)",
     "Jamiatul Ulama-i-Islam resolutions, Calcutta (1945) · The Pioneer (1945) · Sidq (1946)",
     "Sayyid Mahboob Rizvi, History of the Dar al Uloom Deoband (1981)"],
    ["M. Qasim Zaman, Modern Islamic Thought in a Radical Age (2012)", "Majid Khadduri, The Islamic Law of Nations: Shaybani's Siyar (1966)",
     "Euben and Zaman (eds), Princeton Readings in Islamist Thought (2009)"])})

ep = {"meta": meta(8, "The Shaikhul Islam",
                   "Not all the Deobandi ulama stood with Congress. Episode 8 follows Shabbir Ahmad Usmani, who broke with his colleagues, founded a pro-League party of scholars, and sold Pakistan to voters as the new Medina, with Jinnah as the ship's English captain and the ulama as its pilots.",
                   BOOK + ", chapter 7; Usmani's speeches and the account of the 1945 Deoband meeting as quoted there."),
      "cast": CAST, "sequence": seq}

if __name__ == "__main__":
    write(SLUG, ep)
