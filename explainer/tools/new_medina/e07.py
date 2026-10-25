"""Episode 7: "Letters to Madina" (book chapter 6: Urdu Press, Public Opinion and Controversies over Pakistan)."""
from common import *

SLUG = "new-medina-e07-letters-to-madina"
seq = []

# ---------------- cold open ----------------
seq.append({"type": "card", "id": "open", "style": "intertitle", "lines": ["Amroha, United Provinces.", "25 May 1944."], "sub": "A LETTER FROM A SON", "dur": 5.0, "sfx": "type"})

seq.append(scene("son", {"kind": "room", "pal": "archive"}, [
    slate("AMROHA · MAY 1944"),
    doc("l", 640, 330, "MY DEAREST QUAID E AZAM,", "Athar Hasan to M. A. Jinnah (excerpt)",
        ["My father is a Congressman ...", "He would like to see me a Congressman.", "I don't even know what is Pakistan ...", "I ask you to answer them as I shall be", "able to make him a League admirer."],
        0, 0.8, w=540, rot=-1.2, cps=24, sfx="type", vol=0.4, hl=2, hlOn=0, keys={"1": {"hlOn": 1, "d": 0.5, "t": 0.4}}),
    cite("Quaid-i-Azam Papers, IOR Neg 10814, Reel 55, File 1102; via Dhulipala, ch. 6", 0, 0.8),
], [
    L("In May 1944 a schoolboy in the small town of Amroha sat down to write to the most famous Muslim in India. Jinnah had written to him once, and he wanted to write again."),
    L("His problem was at home. His father was a Congressman, a keen one, who mocked the League at the dinner table. And the boy admitted something remarkable: he did not even know what Pakistan was. Would the Qaid please answer his father's objections, so that he could win him over?"),
    L("Four years after Lahore, that was the question in a thousand homes. What, exactly, is Pakistan? One newspaper decided to let its readers argue it out."),
    beat(1.6, "heart"),
], cam={"zoom": [1.1, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append({"type": "card", "id": "title", "style": "titlex", "kicker": "A LUMEN DOCUMENTARY IN TEN PARTS", "title": SERIES,
            "sub": "Episode 7 · Letters to Madina", "by": "after the book by Venkat Dhulipala (2015)", "dur": 7.0, "sfx": "boom"})

# ---------------- chapter 1 ----------------
seq.append(chapter("ch1", 1, "A Paper Called Madina", "Bijnor · 1913 – 1942", color=GOLD))

seq.append(scene("paper", "void", [
    {"id": "p", "type": "paper", "x": 380, "y": 340, "w": 420, "h": 460, "mast": "MADINA", "date": "Bijnor · twice weekly", "head": "What do you\nunderstand by\nPakistan?", "headSize": 34,
     "sub": "readers are invited to write", "cols": 3, "rot": -1.5, "anim": "rise"},
    label("a1", 900, 200, "founded 1913 · twice weekly from 1917", 0, 2.4, color="#e8cfa0", size=18),
    label("a2", 900, 240, "Iqbal · Akbar Ilahabadi · Hasrat Mohani", 0, 4.4, color="#e8cfa0", size=18),
    label("a3", 900, 280, "banned in Punjab after Amritsar, 1919", 0, 6.6, color="#e8cfa0", size=18),
    label("a4", 900, 380, "autumn 1942: the columns open", 1, 0.4, color=GOLD, size=20),
    label("a5", 900, 420, "on wartime newsprint quotas", 1, 2.4, color="#b8a888", size=17),
    cite("Dhulipala, ch. 6, on the Madina (Bijnor) and its 1942-43 debate", 0, 0.6),
], [
    L("The Madina was printed in Bijnor, a quiet district town in western U.P. Founded in 1913, it had carried verse by Iqbal and Akbar Ilahabadi, been banned in Punjab after the massacre at Amritsar, and stood for three decades as the most prominent pro-Congress Urdu paper in north India."),
    L("In the autumn of 1942, with Congress leaders in jail after Quit India and the argument over Pakistan at its height, the editor did something unusual. He asked readers what they understood by Pakistan, and whether it would help or harm India's Muslims. Then, despite wartime paper rationing, he printed their answers."),
], pal="ink"))

seq.append(scene("letters", "void", [
    {"id": "m", "type": "samap", "x": 560, "y": 372, "k": 1.05, "split": 0, "und": 0.4, "nb": 0.6, "anim": "fade",
     "arcs": [{"from": "Bombay", "to": "Bijnor"}, {"from": "Chittagong", "to": "Bijnor"}, {"from": "Raichur", "to": "Bijnor", "bend": 0.2}],
     "arcDraw": [0, 0, 0], "cities": [{"name": "Bijnor", "color": GOLD, "pin": True}, {"name": "Bombay", "color": "#e8cfa0", "left": True}, {"name": "Chittagong", "label": "Chatgaon", "color": "#e8cfa0"}, {"name": "Raichur", "color": "#e8cfa0"}], "keys": {"0": {"arcDraw": [1, 1, 1], "d": 4.0, "t": 2.0}}},
    {"id": "pn", "type": "panel", "x": 1060, "y": 380, "w": 340, "h": 260, "anim": "fade"},
    label("l1", 1060, 320, "letters from across India", 0, 1.0, color="#e8cfa0", size=18),
    label("l2", 1060, 380, "one long essay against", 1, 0.4, color="#ffd8a8", size=18),
    label("l3", 1060, 420, "one long essay for", 1, 2.0, color="#c8f0dd", size=18),
    label("l4", 1060, 480, "serialised for months", 1, 3.6, color="#b8a888", size=16),
    cite("Dhulipala, ch. 6; modern borders shown for orientation", 0, 0.6),
], [
    L("Letters came from all over U.P., and from far beyond it: from Bombay on the west coast, from Chatgaon, that is Chittagong, in eastern Bengal, and from Raichur in the Deccan."),
    L("The debate settled into two long essays, one against Pakistan and one for it, printed in instalments over several months, with readers' replies in between. Dhulipala argues that they show us something rare: not the leaders' strategies, but what educated small-town Muslims actually thought."),
], pal="ink"))

# ---------------- chapter 2 ----------------
seq.append(chapter("ch2", 2, "The Critic", "Maulana Abu Syed Bazmi", color=RED))

seq.append(scene("bazmi", "void", [
    dossier("b", 280, 350, "Abu Syed Bazmi", "Urdu writer and critic", "1940s", 0, 0.4, hat="topi", glasses=True, tag="AGAINST", tagColor="#8a2a2a"),
    label("b1", 870, 200, "'Pakistan, and only Pakistan'", 0, 2.4, color="#e8cfa0", size=20),
    label("b2", 870, 245, "but hasn't Congress already conceded it?", 0, 4.4, color="#e8cfa0", size=18),
    label("b3", 870, 330, "Azad: any province may leave the Union", 1, 0.4, color="#cfe0f0", size=18),
    label("b4", 870, 370, "including Bengal, which Cripps left out", 1, 2.4, color="#cfe0f0", size=18),
    label("b5", 870, 460, "wars are now won by coal, steel and science", 2, 0.4, color="#ffd8a8", size=18),
    label("b6", 870, 500, "not by strong arms", 2, 2.4, color="#ffd8a8", size=18),
    cite("Bazmi, serial essay in Madina (Bijnor), 1942; via Dhulipala, ch. 6", 0, 0.6),
], [
    L("The case against was made by a writer named Abu Syed Bazmi, freshly released from a jail in one of the princely states. League workers were marching through U.P. shouting Pakistan, and only Pakistan. Bazmi asked a sly question: hadn't Congress already given it to them?"),
    L("The Congress president, Maulana Azad, had written that no province would be forced to stay in the Indian Union. Any province could leave, Bengal included, which was more than the British Cripps offer allowed. So why was the League still shouting?"),
    L("Then he turned to money. Lose the eastern districts of Punjab, and Calcutta with the coal and iron around it, and Pakistan would be poor. Modern wars, he wrote, were fought with coal, steel, rubber and factories. The strong men of Punjab could not win them with their arms alone."),
], pal="ink"))

seq.append(scene("rocks", "void", [
    typer("t", 640, 200, "Hindus are not rocks and wood, to be sorted at will", 0, 0.8, size=28, font="serif", italic=True, color="#e8cfa0", cursor=False),
    label("r0", 640, 255, "Bazmi on population transfer, paraphrased", 0, 4.4, color="#b8a888", size=16),
    {"id": "a", "type": "stat", "x": 360, "y": 400, "value": 0, "size": 90, "color": AMBER, "label": "million Greeks: 'a miracle'", "in": 1, "d": 0.6, "anim": "fade", "keys": {"1": {"value": 1, "d": 0.6, "t": 1.0}}},
    {"id": "b", "type": "stat", "x": 920, "y": 400, "value": 0, "size": 90, "color": RED, "label": "million each way, by his sums", "in": 1, "d": 4.0, "anim": "fade", "keys": {"1": {"value": 30, "d": 1.4, "t": 4.4}}},
    label("r1", 640, 550, "and the Hijrat of 1920, when migrants to Afghanistan were turned back", 2, 0.6, color="#cfe0f0", size=17),
    cite("Bazmi in Madina, 1942; via Dhulipala, ch. 6", 0, 0.6),
], [
    L("He saved his fiercest words for the idea of moving people. To create safe Muslim majorities, he calculated, perhaps thirty million Muslims would have to move in and as many Hindus move out. The greatest migration the world had seen, Greeks leaving Turkey, involved about a million people, and that was called a miracle. Who would pay? Who would buy the land? And Hindus, he wrote, were not rocks and wood to be sorted and slotted at will."),
    L("The Ganga and the Jamuna were as holy to Hindus as the Hijaz to Muslims. They would not give up those lands."),
    L("He reminded readers of 1920, when thousands of Indian Muslims had migrated to Afghanistan in religious fervour, only to be driven back across the border in misery. Five years later, the partition that Bazmi called impossible would uproot millions."),
], pal="ink"))

# ---------------- chapter 3 ----------------
seq.append(chapter("ch3", 3, "Letters to the Editor", "Bombay · Raichur · Aligarh", color=SKY))

seq.append(scene("replies", {"kind": "room", "pal": "archive"}, [
    doc("a", 230, 300, "HAKIM MOHAMMAD ANWAR", "Bombay", ["The very word jihad would do", "the work of an entire army.", "Chittagong can rival Calcutta.", "Buy coal and iron from Hindustan."], 0, 0.4, w=380, rot=-2, cps=30, sfx="type", vol=0.35, size=15),
    doc("s", 640, 330, "MOHAMMAD ABID SHARIF", "Raichur", ["Co-education has Muslim girls", "singing and dancing on stage.", "If minorities are mistreated,", "retaliation will certainly work."], 1, 0.4, w=380, rot=1, cps=30, sfx="type", vol=0.35, size=15),
    doc("m", 1050, 300, "ADIL MIRZA, B.A., B.COM.", "Aligarh", ["Not whether an Islamic government", "is good, but whether it is possible.", "'Let them eat cake.'", "Shaikh Chilli's paradise."], 2, 0.4, w=380, rot=-1, cps=30, sfx="type", vol=0.35, size=15),
    cite("Readers' letters in Madina, 1942; via Dhulipala, ch. 6", 0, 0.6),
], [
    L("The replies were vivid. From Bombay, a Hakim named Mohammad Anwar insisted Pakistan would be rich. Chittagong could be built into a port to rival Calcutta. Coal and iron could simply be bought from Hindustan. And the frontier? The very word jihad, he wrote, would do the work of an entire army."),
    L("From Raichur, Mohammad Abid Sharif worried about something else. Congress schools were teaching boys and girls together, and Muslim girls were singing and dancing on stage. Did U.P.'s Muslims want to drag the Muslims of Punjab and Bengal down with them? As for those left behind, retaliation would protect them."),
    L("From Aligarh, a student named Adil Mirza, with a B.A. and a B.Com., was scathing. Ports cost crores, he wrote. Buy coal from Hindustan? That was Marie Antoinette: let them eat cake. Nobody doubted an Islamic government was good. The question was whether it was possible. The League's Pakistan, he said, was Shaikh Chilli's paradise, the daydreamer's heaven that everyone loves and no one can find the road to."),
], cam={"zoom": [1.05, 1.0], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 4 ----------------
seq.append(chapter("ch4", 4, "The Defence", "Maulana Abul Nazar Rizvi Amrohvi", color=JADE))

seq.append(scene("amrohvi", "void", [
    dossier("a", 280, 350, "Abul Nazar Rizvi Amrohvi", "Urdu writer, of Amroha", "1940s", 0, 0.4, hat="karakul", glasses=True, tag="FOR", tagColor="#2f6f5a"),
    label("c1", 870, 190, "Azad's offer is a trap:", 0, 2.4, color="#c8f0dd", size=19),
    label("c2", 870, 228, "Hindus and Sikhs would vote too", 0, 4.0, color="#c8f0dd", size=18),
    label("c3", 870, 266, "the right to leave must belong to Muslims", 0, 5.6, color="#c8f0dd", size=18),
    label("c4", 870, 350, "'England was once the Baluchistan of Europe'", 1, 0.4, color="#ffd08a", size=18),
    label("c5", 870, 390, "China did not surrender to Japan's machines", 1, 2.6, color="#ffd08a", size=18),
    label("c6", 870, 470, "an 'Islamic' state: any state whose ruler", 2, 0.4, color="#cfe0f0", size=17),
    label("c7", 870, 505, "or majority is Muslim. Turkey counts.", 2, 2.0, color="#cfe0f0", size=17),
    cite("Amrohvi, serial essay in Madina, 1942-43; via Dhulipala, ch. 6", 0, 0.6),
], [
    L("Five weeks later the paper began the reply, by a writer from Amroha who signed himself Abul Nazar Rizvi Amrohvi. Azad's offer, he argued, was a trap. In a provincial vote, Hindus and Sikhs, organised and united, would vote too, and Punjab and Bengal would never leave. The right to secede had to belong to Muslims as a community, not to provinces."),
    L("Pakistan would be poor? England, he answered, was once the Baluchistan of Europe. Machines decide wars? China had not surrendered to Japan. Freedom, he wrote, rests on the passion for it."),
    L("And Pakistan would be Islamic, by his definition, if its ruler or its majority was Muslim. Turkey counted, though it had abolished Islamic law. Dhulipala calls him a modernist, who did not picture an Islamic state at all."),
], pal="ink"))

seq.append(scene("fate", "void", [
    quote("q", 640, 230, "neither you nor anyone else\ncan change their fate", "Amrohvi on Muslims left in the minority provinces", 0, 2.0, size=28, w=640),
    label("f1", 640, 380, "their subjection would be matched", 1, 0.4, color="#ffd8a8", size=19),
    label("f2", 640, 420, "by the subjection of crores of Hindus in Pakistan", 1, 2.0, color="#ffd8a8", size=19),
    label("f3", 640, 520, "the hostage theory, one more time", 2, 0.6, color="#b8a888", size=17),
    cite("Amrohvi in Madina, 1943; via Dhulipala, ch. 6", 0, 0.6),
], [
    L("On the hardest question, the Muslims of U.P., he was frank. Under Pakistan they would certainly live under Hindu rule. Neither you nor anyone else, he wrote, can change their fate. Punjabis and Bengalis might not always come to their aid."),
    L("They should make the sacrifice, as they had for the Caliphate and for Turkey. And they would not suffer alone. Their subjection, he promised, would be matched by the subjection of crores of Hindus in Pakistan."),
    L("Even Pakistan's most modern-minded defender ended up in the same place as the weavers of Tanda."),
], pal="smoke"))

# ---------------- chapter 5 ----------------
seq.append(chapter("ch5", 5, "Dear Qaid-e-Azam", "Lucknow and Amroha · 1944", color=AMBER))

seq.append(scene("qaid", {"kind": "room", "pal": "archive"}, [
    doc("s", 400, 320, "ASHIQUE RAZA SIDDIQUI", "Secretary, Lucknow Muslim League, 25 July 1944",
        ["So far no one has been able to give", "a definite conception of Pakistan.", "Hindus will be enjoying all civic rights", "but they will have no political rights ...", "They will be regarded as aliens."], 0, 0.4, w=500, rot=-1.5, cps=26, sfx="type", vol=0.4, hl=1, hlOn=0, keys={"0": {"hlOn": 1, "d": 6.0, "t": 0.6}}),
    doc("h", 930, 360, "ATHAR HASAN", "Amroha, 25 May 1944",
        ["As here are 86% Hindus, they can ...", "easily crush 14% Muslims ...", "under what rules we can save", "us from crushing?"], 1, 0.4, w=440, rot=1.5, cps=26, sfx="type", vol=0.4, hl=3, hlOn=0, keys={"1": {"hlOn": 1, "d": 0.5, "t": 6.0}}),
    cite("Quaid-i-Azam Papers, IOR Neg 10814, Reel 55, File 1102; via Dhulipala, ch. 6", 0, 0.6),
], [
    L("Even the League's own officials were unsure. In July 1944 the secretary of the Lucknow district League wrote to Jinnah: so far, no one has been able to give a definite conception of Pakistan. So he offered his own. Hindus in Pakistan would have civic rights but no political rights. They would be treated as aliens, and Muslims outside would be treated the same way, until, over time, everyone migrated home."),
    L("And the boy from Amroha set down his father's sharpest objection. U.P. was eighty-six per cent Hindu. The League's answer was retaliation, but it was far harder to crush the Hindus of Punjab and Bengal than the Muslims of U.P. Under what rules, he asked Jinnah, can we be saved from crushing?"),
    L("There is no reply in the file."),
], cam={"zoom": [1.05, 1.0], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 6 ----------------
seq.append(chapter("ch6", 6, "What the Historians Say", "Testing the chapter", color=AMBER))

seq.append(scene("tests", "void", [
    verdict("v1", 340, 220, "Ordinary Muslims argued over\nPakistan in detail.", "strong", "Madina's serial debate, 1942-43; letters to Jinnah", 0, 0.4, w=560),
    verdict("v2", 940, 220, "Supporters shared one clear\npicture of Pakistan.", "weak", "Anwar, Amrohvi and the Lucknow secretary each imagined a different state", 1, 0.4, w=560),
    verdict("v3", 340, 470, "A transfer of tens of millions\ncould never happen.", "weak", "In 1947 it did, at a terrible cost", 2, 0.4, w=560),
    verdict("v4", 940, 470, "Losing Calcutta would leave the\neast poor and resentful.", "partial", "East Pakistan built up Chittagong; economic grievances fed 1971", 3, 0.4, w=560),
], [
    L("So what holds up? That ordinary Muslims argued over Pakistan in detail: well supported. The Madina's pages are the evidence."),
    L("That Pakistan's supporters shared one clear picture of it: weak. Here Dhulipala's own sources partly support his critics. A Hakim in Bombay, a modernist in Amroha and a League secretary in Lucknow each imagined a different country."),
    L("That moving tens of millions of people could never happen: wrong, tragically. In 1947 it happened, without plan or protection."),
    L("And that losing Calcutta, its port and its coal would leave the east poor and resentful: partly borne out. East Pakistan built up Chittagong, but economic grievances against the west fed the war of 1971 that created Bangladesh."),
], pal="smoke", cam={"zoom": [1.0, 1.02], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("now", "void", [
    typer("h1", 640, 220, "Both sides, on the same page", 0, 0.4, size=40, font="serif", italic=True, cursor=False, cps=20),
    label("h2", 640, 330, "a pro-Congress paper printed the case for Pakistan", 1, 0.4, color="#e8cfa0", size=19),
    label("h3", 640, 370, "a father and son argued it at one table", 1, 2.6, color="#e8cfa0", size=19),
    label("h4", 640, 500, "1942, under wartime rationing", 2, 0.6, color="#b8a888", size=17),
], [
    L("Look again at what the Madina did. A paper that opposed Pakistan, short of newsprint in the middle of a world war, gave months of space to the best case for it, and let readers on both sides answer."),
    L("And look at the Amroha letter: a father and son who disagreed about the biggest question of their lives, and kept talking. Whatever we think of the answers, that is how a public argument is supposed to work."),
    L("Today, when much of our political argument happens in feeds that show each of us only our own side, a small-town paper in wartime Bijnor sets a high bar. That observation is ours."),
    beat(1.6, "heart"),
], pal="blood"))

seq.append(next_card(8, "The Shaikhul Islam", "Deoband · 1945 – 1946",
                     "Next time: the Deobandi scholar who broke with his own teachers and called Pakistan the new Medina. Shabbir Ahmad Usmani, the Jamiat Ulama-i-Islam, and the campaign that brought religion into the decisive election."))

seq.append({"type": "card", "id": "end", "style": "endx", "title": SERIES, "dur": 26, "credits": credits_block(
    ["Madina (Bijnor), serial debate on Pakistan, 1942-43: Abu Syed Bazmi, Abul Nazar Rizvi Amrohvi, and readers' letters",
     "Quaid-i-Azam Papers, IOR Neg 10814 (letters from Lucknow and Amroha, 1944)", "Rafiq Zakaria, The Price of Partition (1997)"],
    ["C. A. Bayly, Empire and Information (1996)", "Milton Israel, Communications and Power (1994)",
     "Partition and 1971: standard accounts in the historical literature"])})

ep = {"meta": meta(7, "Letters to Madina",
                   "In 1942 a pro-Congress Urdu paper in the small town of Bijnor asked its readers what they understood by Pakistan, and printed the answers. Episode 7 follows that debate: a critic who said mass migration was impossible, a defender who promised hostages on both sides, readers from Bombay to Raichur, and letters to Jinnah asking what Pakistan would mean for those left behind.",
                   BOOK + ", chapter 6; the Madina debate and letters in the Quaid-i-Azam Papers as quoted there."),
      "cast": CAST, "sequence": seq}

if __name__ == "__main__":
    write(SLUG, ep)
