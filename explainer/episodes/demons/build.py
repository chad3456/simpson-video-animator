#!/usr/bin/env python3
"""Writes episode.json for the LUMEN documentary "Demons: The Revolution That Ate Its Own", in the paper collage look.
Edit here, then rerun.  Usage: python3 explainer/episodes/demons/build.py"""
import json, os

RED, YEL, INK, CREAM = "#d23a2e", "#ffd23f", "#1d1b19", "#f4ecdc"
COL = {
    "stavrogin": "#6f8fae", "pyotr": "#d9a441", "stepan": "#9fb59a", "dostoevsky": "#c98f7a", "shatov": "#c9b893",
    "kirillov": "#b5c4cf", "shigalyov": "#d4b0a4", "liputin": "#c9c08a", "varvara": "#bfa3c4", "marya": "#a9bcd0",
    "lebyadkin": "#d9b48a", "fedka": "#a0a08a", "nechayev": "#c47a6a", "ivanov": "#b8c9a0", "tikhon": "#c9b893",
    "sofya": "#d8c39a", "yulia": "#d9a3b5", "karmazinov": "#b0a8c8", "lembke": "#9fb0c8", "erkel": "#c8d0a0",
    "student": "#b5b09a", "lisa": "#a3b8c9", "marie": "#c4b0d0", "gorky": "#c4a88a", "camus": "#a9b8c0",
    "berdyaev": "#b9a6a0", "bakunin": "#a8b0a0",
}


def cut(id, who, x, y, name=None, role=None, i=0, d=0.3, out=None, w=250, h=300, rot=0, **kw):
    e = {"id": id, "type": "cut", "who": who, "x": x, "y": y, "w": w, "h": h, "rot": rot, "color": kw.pop("color", COL.get(who, "#c9b893")),
         "in": i, "d": d, "anim": kw.pop("anim", "drop"), "sfx": kw.pop("sfx", "paper"), "vol": 0.7, **kw}
    if name: e["name"] = name
    if role: e["role"] = role
    if out is not None: e["out"] = out
    return e


def hl(id, text, x, y, size=34, i=0, d=0.3, out=None, card=True, **kw):
    e = {"id": id, "type": "hl", "x": x, "y": y, "text": text, "size": size, "card": card, "in": i, "d": d, "anim": kw.pop("anim", "rise"), **kw}
    if out is not None: e["out"] = out
    return e


def head(id, text, x, y, size=60, i=0, d=0.3, out=None, bg=INK, color=CREAM, **kw):
    e = {"id": id, "type": "headline", "x": x, "y": y, "text": text, "size": size, "bg": bg, "color": color, "in": i, "d": d, "anim": kw.pop("anim", "pop"), "sfx": kw.pop("sfx", "thump"), "vol": 0.3, **kw}
    if out is not None: e["out"] = out
    return e


def scr(id, kind, x, y, w=200, h=80, i=0, d=0.8, out=None, **kw):
    e = {"id": id, "type": "scrib", "kind": kind, "x": x, "y": y, "w": w, "h": h, "in": i, "d": d, "anim": "none", "sfx": "marker", "vol": 0.8, **kw}
    if out is not None: e["out"] = out
    return e


def sheet(id, x, y, i=0, d=0.3, out=None, **kw):
    e = {"id": id, "type": "sheet", "x": x, "y": y, "in": i, "d": d, "anim": kw.pop("anim", "rise"), "sfx": "paper", "vol": 0.7, **kw}
    if out is not None: e["out"] = out
    return e


def el(id, type, x, y, i=0, d=0.3, out=None, **kw):
    e = {"id": id, "type": type, "x": x, "y": y, "in": i, "d": d, **kw}
    if out is not None: e["out"] = out
    return e


def cite(text, i=0, d=0.8):
    return {"id": "src", "type": "cite", "x": 0, "y": 0, "text": text, "in": i, "d": d, "anim": "none"}


def scene(id, pal, els, lines, grid=False, zoom=(1.0, 1.05), pan=((0, 0), (16, -6)), **bg):
    return {"type": "scene", "id": id, "bg": {"kind": "paperc", "pal": pal, "grid": grid, **bg}, "cam": {"zoom": list(zoom), "pan": [list(pan[0]), list(pan[1])]}, "els": els, "lines": lines}


def chapter(n, kicker, title, sub, who, color=RED):
    return {"type": "card", "id": f"ch{n}", "style": "cchapter", "num": n, "kicker": kicker, "title": title, "sub": sub, "who": who, "whoColor": COL.get(who), "color": color, "dur": 4.2, "sfx": "chime"}


def L(text, who=None, **kw):
    d = {"text": text, **kw}
    if who: d["who"] = who
    return d


def beat(dur=1.4, sfx="whoosh"):
    return {"text": "", "dur": dur, "sfx": sfx}


seq = []

# ======================= cold open =======================
seq.append(scene("open-swine", "sage", [
    el("pg", "pigs", 560, 470, run=0, n=11, anim="fade", keys={"2": {"run": 1, "d": 0.2, "t": 6.5}}),
    el("bk", "openbook", 640, 175, s=0.55, anim="drop", sfx="paper", headL="LUKE 8", left="And they besought him\nthat he would suffer them\nto [[enter into the swine]].", right="Then the herd ran\nviolently down a steep place\ninto the lake, [[and were choked]].", size=22),
    cite("Luke 8:32-33 (King James Version)", i=0, d=1.0),
], [
    L("There is a strange story in the Gospel of Luke. A man is possessed by so many demons that they give their name as Legion."),
    L("They are cast out, and they beg to be allowed into a herd of pigs grazing on a hillside."),
    L("The pigs rush down the steep bank into the lake, and drown."),
    L("In 1871, Fyodor Dostoevsky put that story at the front of a novel about young people who wanted to liberate humanity."),
], zoom=(1.04, 1.0), scraps=0))

seq.append(scene("open-pond", "night", [
    el("pk", "park", 640, 430, ripple=0, lantern=[-260, 30], anim="fade", keys={"1": {"ripple": 1, "d": 2.5, "t": 2.0}}),
    head("q", "HOW DOES A CRUSADE FOR FREEDOM\nEND IN A FROZEN POND?", 640, 140, size=40, i=2, bg=YEL, color=INK),
    {"id": "slate", "type": "hl", "x": 640, "y": 650, "text": "Moscow, 21 November 1869", "size": 22, "card": "#f6f1e6", "in": 0, "d": 0.6, "anim": "fade", "out": 2},
], [
    L("Two years earlier, on a November night in Moscow, five young men led a sixth into a park, to a grotto beside a frozen pond."),
    L("They killed him and pushed his body under the ice. And they believed they had done it for the good of mankind."),
    L("How do people who sincerely want to free everyone end up murdering one of their own? That is the question at the heart of Demons."),
], zoom=(1.0, 1.08), scraps=0))

seq.append(scene("open-cast", "cream", [
    cut("c1", "stavrogin", 200, 330, "Stavrogin", "the empty centre", i=1, rot=-3),
    cut("c2", "pyotr", 490, 340, "Pyotr", "the fixer", i=1, d=2.4, rot=2),
    cut("c3", "stepan", 780, 330, "Stepan", "the father", i=1, d=4.6, rot=-2),
    cut("c4", "kirillov", 1070, 340, "Kirillov", "the free man", i=1, d=7.0, rot=3),
    head("h", "A PAMPHLET?  A PROPHECY?  A SLANDER?", 640, 640, size=34, i=2),
    scr("u", "underline", 640, 672, w=700, i=3, d=0.4),
], [
    L("It is a novel crowded with people who talk, constantly, about freedom, justice and the people."),
    L("A magnetic aristocrat with nothing inside. A fixer who turns idealists into accomplices. A sentimental old liberal who started it all. And a man who will kill himself to prove that he is free."),
    L("Dostoevsky called it, half proudly, a pamphlet. Admirers call it a prophecy. Its enemies called it a slander."),
    L("This is what Demons actually says about rage, rebellion and freedom, and about the people who cry loudest for morality."),
], zoom=(1.0, 1.04)))

seq.append({"type": "card", "id": "title", "style": "ctitle", "kicker": "A LUMEN documentary", "title": "DEMONS", "sub": "The revolution that ate its own", "by": "Fyodor Dostoevsky's novel, 1871-72, and the murder that inspired it", "dur": 6.0, "sfx": "swell"})

# ======================= part 1: the murder in the park =======================
seq.append(chapter(1, "Part one", "A murder\nin the park", "Moscow, 1869. Siberia, 1849.", "nechayev"))

seq.append(scene("p1-nechayev", "cream", [
    cut("n", "nechayev", 300, 330, "Sergei Nechayev", "1847-1882", w=280, h=330, rot=-2),
    hl("a", "Claimed to speak for a vast\n[[secret committee]].", 850, 200, size=32, i=1),
    scr("x", "cross", 1010, 200, w=170, h=60, i=1, d=3.4, label="there was none", ly=58),
    hl("b", "Cells of [[five]]. Each knows\nonly its own members.", 850, 400, size=32, i=2),
    head("c", "THE PEOPLE'S REPRISAL", 850, 570, size=36, i=3, bg=RED),
    cite("Philip Pomper, Sergei Nechaev (1979)"),
], [
    L("Start with the real story. Sergei Nechayev was twenty-two, a young schoolteacher from a poor family in the textile town of Ivanovo."),
    L("In 1869 he arrived in Moscow claiming to speak for a vast secret committee that would soon raise all of Russia. There was no committee."),
    L("He organised students into small cells of five. Each member knew only his own cell, and obeyed orders that came, supposedly, from above."),
    L("His little organisation called itself the People's Reprisal."),
]))

seq.append(scene("p1-catechism", "news", [
    sheet("s", 330, 360, w=400, h=540, kind="manifesto", kicker="1869", head="CATECHISM OF\nA REVOLUTIONARY", text="The revolutionary is\na [[doomed man]].", fill=9, rot=-2, tape=True),
    hl("q1", "No personal interests, no feelings,\nno attachments, [[not even a name]].", 860, 200, size=28, i=1),
    hl("q2", "Everything that helps the revolution\nis [[moral]]. Everything in its way is\n[[immoral and criminal]].", 860, 420, size=30, i=2, by="Catechism of a Revolutionary, 1869"),
    scr("c", "box", 860, 420, w=560, h=190, i=3, d=0.4),
    cite("Catechism of a Revolutionary (1869), published at the Nechayevist trial, 1871"),
], [
    L("Around the same time, a short text began to circulate: the Catechism of a Revolutionary. Historians still argue over whether Nechayev wrote it alone, or with the anarchist Mikhail Bakunin."),
    L("It opens: the revolutionary is a doomed man. He has no personal interests, no feelings, no attachments, not even a name."),
    L("And it states the rule plainly. Everything that helps the revolution is moral. Everything that stands in its way is immoral and criminal."),
    L("Hold on to that sentence. The whole novel is a long, hard look at what happens to people who believe it."),
], grid=True))

seq.append(scene("p1-ivanov", "cream", [
    el("pk", "park", 640, 540, s=0.6, i=2, anim="fade", o=0.9),
    cut("iv", "ivanov", 640, 270, "Ivan Ivanov", "the student who asked questions", w=260, h=310, cross=0, keys={"3": {"cross": 1, "d": 0.2, "t": 0.8}}),
    {"id": "st", "type": "stampc", "x": 830, "y": 150, "text": "TRAITOR?", "size": 40, "in": 1, "d": 1.0, "anim": "none", "sfx": "thump", "vol": 0.5},
    hl("g", "Kill a doubter.\nBind the rest with [[shared guilt]].", 1040, 560, size=28, i=3, rot=2),
    cite("Pomper (1979); trial reports of 1871"),
], [
    L("One cell member, a student named Ivan Ivanov, began asking questions. He doubted the committee existed, and he refused an order."),
    L("Nechayev told the others that Ivanov was about to betray them."),
    L("On the twenty-first of November, they lured him to a grotto in the park of the Petrovsky Agricultural Academy. Nechayev strangled him and then shot him, while the others held him down."),
    L("The killing was meant to remove a doubter. It was also meant to bind the survivors to their leader with shared guilt."),
    L("The body was found within days. Nechayev fled to Switzerland. Dozens of young people were arrested, and in 1871 their trial became a public sensation."),
]))

seq.append(scene("p1-dresden", "news", [
    cut("d", "dostoevsky", 330, 340, "Fyodor Dostoevsky", "in Dresden, 1869-71", w=280, h=330, rot=-2),
    sheet("np", 880, 330, w=470, h=470, kind="clip", head="THE NECHAYEV AFFAIR", text="A student found\n[[under the ice]] at the\nPetrovsky Academy.", fill=8, i=0, d=1.5, rot=2),
    head("h", "NOW THE NOVEL HAD ITS SPINE", 880, 640, size=28, i=2, bg=YEL, color=INK),
    cite("Joseph Frank, Dostoevsky: The Miraculous Years (1995)"),
], [
    L("Dostoevsky was living in Dresden, broke, homesick and gambling, and he followed the case in the Russian papers."),
    L("He had a personal link. His wife Anna's brother was a student at that very academy, and had visited them with stories about the mood among the young."),
    L("Dostoevsky was already planning a novel. Now it had its spine."),
]))

seq.append(scene("p1-1849", "cream", [
    el("sk", "stakes", 640, 380, aim=0, anim="fade", keys={"2": {"aim": 1, "d": 1.5, "t": 1.2}}),
    head("t", "SEMYONOVSKY SQUARE, 22 DECEMBER 1849", 640, 90, size=30, i=1),
    {"id": "pd", "type": "stampc", "x": 900, "y": 220, "text": "PARDONED", "size": 40, "in": 3, "d": 0.6, "anim": "none", "sfx": "thump", "vol": 0.6},
    hl("om", "Four years of hard labour in Omsk.\nThe only book allowed: [[the Gospels]].", 640, 640, size=26, i=4),
    cite("Frank, Dostoevsky: The Years of Ordeal (1983)"),
], [
    L("But here is what makes Demons more than an attack. Dostoevsky had once been one of them."),
    L("In the 1840s he belonged to a circle of young socialists in St Petersburg. In 1849 he was arrested, partly for reading a forbidden letter aloud."),
    L("On a December morning he was led onto a city square. Prisoners in white shrouds were tied to posts in threes, and the soldiers raised their rifles."),
    L("At the last moment, a pardon from the Tsar was read out. The whole execution had been staged."),
    L("He spent four years in a Siberian prison camp, among murderers and thieves, with the New Testament as his only book."),
], zoom=(1.06, 1.0)))

seq.append(scene("p1-insider", "cream", [
    cut("d", "dostoevsky", 260, 350, "Dostoevsky", "1873", w=250, h=300, rot=-3),
    hl("q", "A Nechayev? Never.\nBut [[a Nechayevist]]? I won't vouch for it.\n[[Perhaps I could have been]], in my youth.", 780, 280, size=30, i=0, d=1.0, by="Dostoevsky, A Writer's Diary (1873), paraphrased"),
    hl("p", "Not monsters. [[Decent young people]],\nled one step at a time.", 780, 560, size=30, i=1, card="#fff3b0"),
    cite("A Writer's Diary, 1873: 'One of the Contemporary Falsehoods'"),
], [
    L("Years later he wrote that he could never have been a Nechayev. But a Nechayevist, a follower? He would not swear to it. Perhaps, in his youth, he could have been."),
    L("So Demons is not a book about monsters. It is about decent young people, and how an idea can lead them, one reasonable step at a time, to a grotto beside a frozen pond."),
]))

# ======================= part 2: the fathers =======================
seq.append(chapter(2, "Part two", "The fathers", "Where the sons got their ideas", "stepan", color="#5f8a5a"))

seq.append(scene("p2-stepan", "sage", [
    cut("s", "stepan", 320, 340, "Stepan Trofimovich", "liberal of the 1840s", w=290, h=340, rot=-2),
    hl("a", "A few brilliant lectures.\n[[Twenty years]] living on the memory.", 880, 180, size=28, i=1),
    hl("b", "Believes he is [[watched by the government]].\nMostly, nobody is watching.", 880, 360, size=28, i=2),
    cut("v", "varvara", 880, 530, "Varvara Petrovna", "his patron", w=190, h=210, i=3, rot=3),
    cite("Demons, Part 1, ch. 1"),
], [
    L("Dostoevsky does not begin with the revolutionaries. He begins with their parents."),
    L("Meet Stepan Trofimovich Verkhovensky, a handsome, ageing liberal of the 1840s. He once gave a few brilliant university lectures, and has been living on the memory ever since."),
    L("He believes he is a persecuted man, under watch by the government. Mostly, nobody is watching."),
    L("He lives on the estate of a rich widow, Varvara Petrovna, who pays his debts, chooses his clothes, and loves him in a way neither of them can admit."),
], scraps=1))

seq.append(scene("p2-bill", "cream", [
    hl("h", "[[Humanity]]. [[Beauty]]. [[Progress]].", 640, 110, size=40, card=False),
    scr("ck", "check", 1000, 105, w=70, h=50, i=0, d=2.5),
    cut("f", "fedka", 260, 400, "Fedka", "lost at cards", w=230, h=270, i=1, rot=-3),
    sheet("debt", 400, 560, w=200, h=120, kind="note", head="IOU: one serf", fill=1, pre=0, i=1, d=1.2, rot=8, s=0.8, anim="pop"),
    cut("p", "pyotr", 640, 400, "Pyotr", "the son he sent away", w=230, h=270, i=3, rot=2),
    hl("q", "He loved [[humanity]].\nThe humans in his care,\n[[less so]].", 1020, 420, size=30, i=4),
    cite("Demons, Part 1, ch. 1 and Part 2, ch. 2"),
], [
    L("Stepan speaks beautifully about humanity, beauty and progress, usually in French, often with tears in his eyes, generally with a glass of champagne. He is lovable, and Dostoevsky clearly likes him."),
    L("And then the novel quietly shows you the bill. Years ago, Stepan lost a card game and paid the debt with a human being: his serf Fedka, handed over to the army as a recruit."),
    L("Fedka deserted, and became a convict and a killer. He is in town now, and he will be back."),
    L("Stepan also had a son, Pyotr. He sent the boy away as a baby to be raised by relatives, barely saw him for twenty years, and lived off the income from the boy's small estate."),
    L("He loved humanity. The specific humans in his care, rather less."),
]))

seq.append(scene("p2-thesis", "news", [
    cut("s", "stepan", 250, 300, "The fathers", "1840s idealism", w=230, h=270, rot=-3),
    scr("ar", "arrow", 400, 300, w=0, x2=360, y2=0, bend=-0.25, i=0, d=2.5, label="ideas", ly=-50),
    cut("p", "pyotr", 1030, 300, "The sons", "1860s nihilism", w=230, h=270, rot=3, i=0, d=2.0),
    hl("q", "Our Belinskys and Granovskys would never believe it,\nbut they are [[the direct fathers of Nechayev]].", 640, 560, size=26, i=1, by="Dostoevsky, letter to the heir to the throne, 1873 (paraphrased)"),
    head("c", "CONTESTED", 1080, 130, size=24, i=3, bg=RED, rot=-6),
    cite("Letter to the Tsarevich Alexander Alexandrovich, February 1873"),
], [
    L("That is Dostoevsky's first, and most provocative, thesis. The nihilist sons are not a rebellion against their liberal fathers. They are the fathers' ideas, with the manners removed."),
    L("In a letter to the heir to the throne, he wrote that the gentle idealists of the 1840s would never believe it, but they were the direct fathers of the Nechayevs."),
    L("The fathers cut morality loose from God and tradition, and put eloquence in its place. The sons kept the conclusion, and threw away the eloquence."),
    L("It is a contested claim, and we will come back to it. But it gives the novel its shape: a comedy about the fathers that turns, chapter by chapter, into a tragedy about the sons."),
], grid=True))

# ======================= part 3: the son =======================
seq.append(chapter(3, "Part three", "The fixer", "How to build a cell out of shame", "pyotr", color="#c58a1f"))

seq.append(scene("p3-pyotr", "mustard", [
    cut("p", "pyotr", 330, 350, "Pyotr Stepanovich", "back from abroad", w=290, h=340, rot=-2),
    hl("a", "Talks fast. Fawns. [[Flatters]].\nAlways busy. Always [[lying]].", 860, 220, size=30, i=1),
    hl("b", "\"I speak for the [[central committee]].\"", 860, 420, size=30, i=2, card="#fbf7ee"),
    {"id": "bl", "type": "stampc", "x": 1060, "y": 470, "text": "BLUFF", "size": 30, "in": 2, "d": 3.5, "anim": "none", "sfx": "thump", "vol": 0.5},
    cite("Demons, Part 2, ch. 1"),
], [
    L("Enter Pyotr Stepanovich, the abandoned son, now in his late twenties and back from abroad."),
    L("He talks fast, fawns, lies, flatters and is always busy. He is charming in the way that makes you check your wallet."),
    L("Pyotr is Dostoevsky's Nechayev. He tells the local radicals that he represents a central committee and a vast network of cells. Like Nechayev, he is bluffing."),
], scraps=1, scrapColors=["#e9c46a", "#c58a1f"]))

seq.append(scene("p3-cell", "cream", [
    el("cl", "cell", 640, 380, R=230, links=0, members=[
        {"who": "liputin", "name": "Liputin", "color": COL["liputin"]},
        {"who": "student", "name": "Virginsky", "color": COL["student"]},
        {"who": "shigalyov", "name": "Shigalyov", "color": COL["shigalyov"]},
        {"who": "karmazinov", "name": "Lyamshin", "color": "#b8c4a8"},
        {"who": "lembke", "name": "Tolkachenko", "color": "#c9a88a"}],
       centre={"who": "pyotr", "name": "Pyotr", "color": COL["pyotr"]}, anim="fade", sfx="paper",
       keys={"0": {"links": 1, "d": 1.0, "t": 2.5}}),
    hl("n", "Bored. Vain. Lonely.\nAfraid of [[looking backward]].", 1080, 620, size=24, i=1, rot=2),
    cite("Demons, Part 2, ch. 7"),
], [
    L("His cell of five is not a band of supermen. It is a provincial gossip, a mild-mannered clerk, a gloomy theorist, a post-office clerk who plays the piano, and a self-appointed expert on the common people."),
    L("None of them is a monster. They are bored, vain, a little lonely, and terrified of looking backward."),
], grid=True))

seq.append(scene("p3-meeting", "news", [
    sheet("ag", 330, 360, w=380, h=480, kind="letter", head="Agenda", text="1. Is this [[a meeting]]?\n2. A vote on the vote.\n3. Marriage is slavery.\n4. Who is most radical?", font="type", fill=3, rot=-3, tape=True),
    el("cr", "crowdp", 860, 560, n=14, rows=2, w=620, riot=0, anim="fade", keys={"2": {"riot": 0.5, "d": 0.5, "t": 1.0}}),
    head("h", "A NAME-DAY PARTY", 860, 170, size=40, i=0, d=1.0, bg=RED),
    cite("Demons, Part 2, ch. 7, 'A Meeting'"),
], [
    L("Their big gathering takes place at Virginsky's name-day party, disguised as a celebration."),
    L("The progressives spend the first half hour voting on whether they are, in fact, having a meeting. Someone proposes a vote on the vote."),
    L("A schoolboy lectures his elders. A young woman declares that marriage is slavery. Everyone is competing to be the most radical person in the room."),
], grid=True))

seq.append(scene("p3-test", "cream", [
    hl("q", "If you knew a [[political murder]] was planned,\nwould you [[go to the police]]?", 640, 200, size=36, i=0, d=1.0),
    el("cr", "crowdp", 640, 560, n=18, rows=2, w=760, anim="fade", o=0.8),
    hl("s", "Saying yes = looking like\na [[coward]], or a [[reactionary]].", 640, 380, size=28, i=1, card="#fff3b0", rot=-1),
    cut("sh", "shatov", 1100, 330, "Shatov", "walks out", w=200, h=240, i=2, rot=4),
    scr("c", "circle", 1100, 330, w=250, h=300, i=2, d=2.0),
    cite("Demons, Part 2, ch. 7"),
], [
    L("Then Pyotr springs a test. Suppose, he asks, each of you knew that a political murder was being planned. Would you go to the police?"),
    L("Nobody wants to be the one who says yes. To say yes would be to look like a coward, or worse, a reactionary."),
    L("Only Shatov, a former member who has broken with the movement, walks out in disgust. And with that, Pyotr has found his victim, and his glue."),
]))

seq.append(scene("p3-glue", "cream", [
    cut("st", "stavrogin", 260, 340, "Stavrogin", None, w=230, h=270, rot=-3),
    hl("a", "Get four members to kill a fifth,\nand [[the blood will tie them together]].", 790, 200, size=30, i=0, d=1.5, by="Stavrogin, mocking, to Pyotr"),
    hl("b", "Offer them [[the right to dishonour]],\nand they will all come running.", 790, 420, size=30, i=1, by="Pyotr, Part 2, ch. 8 (paraphrased)"),
    head("c", "RECRUITMENT BY SHAME", 790, 600, size=34, i=2, bg=RED),
    cite("Demons, Part 2, ch. 6 and ch. 8"),
], [
    L("Stavrogin, half in mockery, has already handed Pyotr the method. Persuade four members of a circle to kill a fifth, and the blood they share will bind them for good. Pyotr loves the idea."),
    L("He has a second tool, even simpler. Russians, he says, can be won over most easily by offering them the right to be dishonourable. Offer that, and they will all come running."),
    L("This is the novel's sharpest observation about moral movements. Pyotr does not recruit through belief. He recruits through shame, the fear of not being progressive enough."),
    L("Watch how often, in Demons, decent people go along with something terrible, because objecting would make them look old-fashioned."),
]))

# ======================= part 4: the system =======================
seq.append(chapter(4, "Part four", "One tenth", "Shigalyov's paradise", "shigalyov", color="#7a4a8a"))

seq.append(scene("p4-shig", "cream", [
    cut("s", "shigalyov", 320, 350, "Shigalyov", "the theorist", w=280, h=330, rot=-2),
    sheet("nb", 880, 330, w=420, h=470, kind="page", kicker="CHAPTERS 1 TO 10", head="The Organisation\nof Future Society", fill=11, rot=2),
    scr("u", "bracket", 1100, 380, h=300, i=1, d=0.4),
    cite("Demons, Part 2, ch. 7"),
], [
    L("Every movement needs a theorist. Pyotr's is Shigalyov, a gloomy man with enormous ears and a thick notebook, who has worked out the entire future organisation of society."),
    L("He presents it at the meeting, and he is honest enough to admit there is a problem."),
], grid=True))

seq.append(scene("p4-quote", "night", [
    hl("q", "I am perplexed by my own data.\nStarting from [[unlimited freedom]],\nI arrive at [[unlimited despotism]].", 640, 300, size=42, i=0, d=0.5, color=CREAM, card=False, hcolor="#b8302a", font="serif", italic=True, weight=700),
    cut("s", "shigalyov", 1130, 560, w=160, h=190, rot=5, i=0, d=0.2, anim="fade", sfx=None),
    hl("n", "Not a joke about hypocrisy.\nHe [[followed the logic]] all the way down.", 560, 590, size=24, i=1, card="#f6f1e6"),
    cite("Demons, Part 2, ch. 7 (trans. Constance Garnett, 1916, adapted)"),
], [
    L("I am perplexed by my own data. Starting from unlimited freedom, I arrive at unlimited despotism.", who="shigalyov"),
    L("That is the line everyone remembers, and it is not a joke about hypocrisy. Shigalyov is sincere. He followed the logic all the way down, and that is where it led."),
], scraps=0))

seq.append(scene("p4-tenth", "cream", [
    el("hr", "herd", 640, 420, n=100, cols=25, gap=36, elite=10, split=0, lift=160, anim="fade",
       keys={"0": {"split": 0.15, "d": 2.0, "t": 1.0}, "1": {"split": 1, "d": 0.5, "t": 2.5}}),
    head("a", "1/10: ABSOLUTE FREEDOM", 300, 110, size=28, i=0, d=2.0, bg=RED),
    head("b", "9/10: THE HERD", 980, 110, size=28, i=1, d=1.0, bg="#6f6a60"),
    hl("c", "'Paradise' with [[ninety per cent]] as livestock.", 640, 650, size=28, i=2),
    cite("Demons, Part 2, ch. 7"),
], [
    L("His solution is to divide humanity into two unequal parts. One tenth receives absolute freedom, and unlimited power over the other nine tenths."),
    L("The nine tenths lose their individuality and become something like a herd. After generations of re-education, they reach a kind of primeval innocence: an earthly paradise."),
    L("Paradise, with ninety per cent of the people as livestock. Some of the listeners are appalled. Others think it sounds rather practical."),
], grid=True))

seq.append(scene("p4-shigalyovism", "mustard", [
    cut("p", "pyotr", 260, 350, "Pyotr", "to Stavrogin", w=250, h=300, rot=-3),
    hl("q", "[[Cicero]] will have his tongue cut out,\n[[Copernicus]] will have his eyes put out,\n[[Shakespeare]] will be stoned.\nSlaves are bound to be equal.", 800, 250, size=30, i=1, d=0.3),
    hl("b", "Talent creates inequality, so talent is suspect.\nEveryone [[spies]] on everyone.", 800, 520, size=24, i=2, card="#fbf7ee"),
    cite("Demons, Part 2, ch. 8 (trans. Constance Garnett, 1916)"),
], [
    L("Later, alone with Stavrogin, Pyotr gives his own version of the theory, and drops the philosophy."),
    L("Cicero will have his tongue cut out, Copernicus will have his eyes put out, Shakespeare will be stoned. That's Shigalyovism. Slaves are bound to be equal.", who="pyotr"),
    L("Talent is suspect, because talent creates inequality. Everyone spies on everyone else and reports. Equality is reached by bringing everyone down."),
], scraps=1, scrapColors=["#e9c46a"]))

seq.append(scene("p4-destroy", "oxblood", [
    head("a", "WE SHALL PROCLAIM DESTRUCTION", 640, 200, size=48, i=0, d=0.5, bg=CREAM, color=INK, rot=-2),
    head("b", "WE'LL SET FIRES GOING", 470, 340, size=40, i=0, d=3.0, bg=YEL, color=INK, rot=2),
    head("c", "WE'LL SET LEGENDS GOING", 820, 450, size=40, i=0, d=5.0, bg=CREAM, color=INK, rot=-1),
    hl("n", "Not a plan for justice.\nA plan for [[upheaval]].", 640, 610, size=26, i=1, card="#f6f1e6"),
    cite("Demons, Part 2, ch. 8 (trans. Constance Garnett, 1916)"),
], [
    L("We shall proclaim destruction. We'll set fires going. We'll set legends going. There's going to be an upheaval such as the world has never seen.", who="pyotr"),
    L("That is the real goal, and it slips out in his own words. Not a plan for justice. A plan for upheaval."),
], scraps=0))

seq.append(scene("p4-pretender", "slate", [
    cut("s", "stavrogin", 640, 330, "Ivan the Tsarevich", "the hidden prince", w=300, h=350, mask=0, keys={"1": {"mask": 0.9, "d": 1.0, "t": 2.0}}),
    hl("a", "\"I'm a [[scoundrel]], not a socialist.\"", 640, 610, size=30, i=1, by="Pyotr, laughing"),
    cut("p", "pyotr", 1110, 450, w=170, h=200, rot=6, i=1, anim="right"),
    cite("Demons, Part 2, ch. 8"),
], [
    L("After the chaos, Pyotr needs a face. He wants Stavrogin, handsome, aristocratic and mysterious, presented to the people as a hidden prince, Ivan the Tsarevich."),
    L("The revolution for equality ends with a pretender on a throne. Pyotr even admits he is not a socialist at all. He is a scoundrel, he says, laughing."),
    L("That is Dostoevsky's charge in its sharpest form. Strip away the language of equality and justice, and some revolutionaries want one thing: power, and the thrill of tearing things down."),
], scraps=0))

seq.append(scene("p4-two", "cream", [
    cut("s", "shigalyov", 330, 320, "The sincere idealist", "whose logic leads to slavery", color=COL["shigalyov"], w=260, h=300, rot=-3),
    cut("p", "pyotr", 950, 320, "The cynic", "who uses idealists", w=260, h=300, rot=3, i=0, d=2.5),
    scr("ar", "arrow", 470, 300, x2=330, y2=0, bend=0.25, i=1, d=0.5, label="uses", ly=-40),
    hl("n", "Dostoevsky wants you to see [[both]].", 640, 640, size=30, i=1),
], [
    L("But notice that Shigalyov and Pyotr are different people. One is a sincere idealist whose logic leads to slavery. The other is a cynic who knows how to use idealists."),
    L("Dostoevsky thinks you need to recognise both, because a movement needs both, and each makes the other possible."),
], grid=True))

# ======================= part 5: rebellion as fashion =======================
seq.append(chapter(5, "Part five", "Rebellion\nin fashion", "Those who flatter the radicals", "yulia", color="#b0476a"))

seq.append(scene("p5-salon", "cream", [
    cut("y", "yulia", 240, 330, "Yulia Mikhailovna", "the governor's wife", w=230, h=280, rot=-3),
    cut("l", "lembke", 520, 330, "Von Lembke", "the governor", w=230, h=280, rot=2, i=2),
    cut("k", "karmazinov", 800, 330, "Karmazinov", "the great writer", w=230, h=280, rot=-2, i=3),
    cut("p", "pyotr", 1080, 330, "Pyotr", "pulling the strings", w=200, h=240, rot=4, i=1),
    el("st", "strings", 0, 0, pts=[[1080, 200], [240, 190], [520, 190], [800, 190]], links=[[0, 1], [0, 2], [0, 3]], i=1, d=2.5, anim="none"),
    hl("t", "Readers saw [[Ivan Turgenev]] in this portrait.", 640, 620, size=26, i=4),
    cite("Demons, Part 2, ch. 4 and ch. 6"),
], [
    L("The radicals are not the only target. Dostoevsky saves some of his sharpest satire for the respectable people who flatter them."),
    L("Yulia Mikhailovna, the governor's wife, wants to be the patron of the young. She thinks she can steer the radicals by being nice to them, and Pyotr runs her like a puppet."),
    L("Her husband, Governor von Lembke, is a decent, anxious bureaucrat who writes a novel in secret, and slowly loses his grip."),
    L("And there is Karmazinov, the famous writer. A celebrated liberal, he grovels before the young nihilists so as not to seem out of date, while quietly preparing to leave Russia for good."),
    L("Readers recognised Ivan Turgenev, Dostoevsky's great rival, in this portrait. It was cruel, and Turgenev was hurt."),
], grid=True))

seq.append(scene("p5-fete", "news", [
    head("h", "THE FÊTE, FOR THE BENEFIT OF POOR GOVERNESSES", 640, 90, size=26, i=0),
    cut("k", "karmazinov", 260, 320, None, None, w=200, h=230, rot=-4, i=1, out=2),
    hl("m", "Reading: [[Merci]]. Length: [[endless]].", 640, 320, size=26, i=1, out=2),
    cut("s", "stepan", 260, 290, "Stepan", "on stage", w=220, h=260, rot=-3, i=2),
    el("cr", "crowdp", 640, 650, n=20, rows=2, w=1100, riot=0, s=0.85, anim="fade", keys={"4": {"riot": 1, "d": 0.3, "t": 1.0}}),
    cite("Demons, Part 3, ch. 1"),
], [
    L("It all comes together at Yulia's grand fête: a literary matinée followed by a ball, for the benefit of poor governesses."),
    L("Karmazinov reads a very long farewell to literature, called Merci. The audience is bored stiff."),
    L("Then Stepan Trofimovich takes the stage and, to his great credit, says the unfashionable thing."),
    L("Shakespeare and Raphael are higher than the emancipation of the serfs, higher than socialism, higher than the young generation, higher almost than humanity itself!", who="stepan"),
    L("The radicals of the 1860s liked to say a pair of boots was worth more than Shakespeare. Stepan is booed off the stage, and scandal follows scandal."),
], grid=True))

seq.append(scene("p5-boots", "cream", [
    el("bl", "balance", 640, 380, tilt=0, left="BOOTS", right="SHAKESPEARE", anim="fade", keys={"0": {"tilt": -1, "d": 1.0, "t": 1.4}, "1": {"tilt": 1, "d": 0.5, "t": 1.4}}),
    hl("a", "The 1860s slogan", 400, 130, size=24, card=False, i=0),
    hl("b", "Stepan's reply", 880, 130, size=24, card=False, i=1),
], [
    L("It sounds like a joke. But it is the oldest question in the book: is a person, or a poem, worth anything that cannot be measured by its use to the cause?"),
    L("Stepan, the vain old liberal, gets this one right. And the crowd hates him for it."),
], grid=True))

seq.append(scene("p5-fire", "night", [
    el("tw", "town", 640, 560, burn=0, river="#1d2a36", anim="fade", keys={"0": {"burn": 1, "d": 1.0, "t": 4.0}}),
    {"id": "st", "type": "stampc", "x": 980, "y": 160, "text": "ZARECHYE", "size": 34, "in": 0, "d": 2.0, "anim": "none", "sfx": "thump", "vol": 0.5},
    cut("m", "marya", 210, 210, "Marya", None, w=150, h=180, rot=-5, i=1, cross=0, keys={"2": {"cross": 1, "d": 0.2}}),
    cut("lb", "lebyadkin", 380, 210, "Lebyadkin", None, w=150, h=180, rot=4, i=1, d=0.5, cross=0, keys={"2": {"cross": 1, "d": 0.5}}),
    cut("f", "fedka", 560, 210, "Fedka", None, w=150, h=180, rot=-2, i=2, d=1.5),
    cut("li", "lisa", 1100, 330, "Lisa", None, w=150, h=180, rot=3, i=3, cross=0, keys={"3": {"cross": 1, "d": 3.0}}),
    head("h", "NOBODY WANTED IT.  EVERYONE HELPED.", 640, 660, size=30, i=4, bg=YEL, color=INK),
    cite("Demons, Part 3, ch. 2 and ch. 3"),
], [
    L("That night, across the river, the district of Zarechye catches fire."),
    L("In one of its houses, Captain Lebyadkin and his sister Marya, the lame, simple woman secretly married to Stavrogin, are found murdered."),
    L("The killer is Fedka, the convict Stepan once lost at cards, paid with money that leads back to Pyotr."),
    L("The governor goes to the fire and loses his mind. The crowd turns into a mob. Lisa, a young woman who loved Stavrogin, is beaten to death in the street."),
    L("Nobody in this town wanted any of it. Almost everyone helped."),
], zoom=(1.0, 1.06), scraps=0))

# ======================= part 6: three kinds of freedom =======================
seq.append(chapter(6, "Part six", "Three kinds\nof freedom", "Kirillov, Shatov, Stavrogin", "kirillov", color="#3d6f8f"))

seq.append(scene("p6-three", "cream", [
    cut("k", "kirillov", 260, 330, "Kirillov", "freedom as self-will", w=250, h=300, rot=-3),
    cut("sh", "shatov", 640, 330, "Shatov", "freedom as return", w=250, h=300, rot=2, i=0, d=2.5),
    cut("st", "stavrogin", 1020, 330, "Stavrogin", "freedom as emptiness", w=250, h=300, rot=-2, i=0, d=5.0),
    el("str", "strings", 640, 140, pts=[[0, -60], [-380, 0], [0, 0], [380, 0]], links=[[0, 1], [0, 2], [0, 3]], i=1, d=0.5),
    hl("n", "Each was once [[Stavrogin's disciple]].", 640, 630, size=28, i=1),
], [
    L("Beneath the satire, Demons is a serious argument about freedom. Dostoevsky makes it through three of the most remarkable characters he ever wrote."),
    L("Each was once a disciple of Stavrogin. Each took one of his ideas, and lived it out to the end."),
], grid=True))

seq.append(scene("p6-kirillov", "sage", [
    cut("k", "kirillov", 300, 350, "Kirillov", "engineer", w=280, h=330, rot=-2),
    hl("a", "Plays ball with a child.\nLoves [[the leaves on the trees]].", 860, 170, size=28, i=0, d=2.0),
    hl("b", "God = [[the fear of death]].\nKill yourself for no reason\nand you abolish the fear.", 860, 380, size=28, i=1),
    head("c", "THE MAN-GOD", 860, 560, size=40, i=2, bg=INK),
    cite("Demons, Part 1, ch. 3 and Part 2, ch. 1"),
], [
    L("Kirillov is an engineer: quiet, kind, a little strange. He plays ball with his landlady's child, and loves the leaves on the trees."),
    L("His idea is this. People cling to life because they fear pain, and fear what comes after. God, for him, is the name of that fear."),
    L("Anyone who kills himself for no reason except to prove that he is free will abolish the fear, and become a god himself."),
], scraps=1))

seq.append(scene("p6-kirillov2", "night", [
    hl("q", "If there is no God,\nthen [[I am God]].", 640, 280, size=56, color=CREAM, card=False, hcolor="#b8302a", font="serif", italic=True, weight=700),
    hl("n", "Freedom as [[self-will]], with nothing above it.", 640, 470, size=28, i=1, card="#f6f1e6"),
    sheet("note", 1060, 560, w=240, h=170, kind="note", head="I take the blame", fill=2, pre=0, i=2, rot=6, font="type"),
    cite("Demons, Part 3, ch. 6"),
], [
    L("If there is no God, then I am God.", who="kirillov"),
    L("It is rebellion pushed to the absolute: freedom understood as self-will, with nothing above it. And it ends, logically, with a pistol."),
    L("Pyotr, being Pyotr, has made a deal with him. Since Kirillov plans to die anyway, he will first write a note taking the blame for whatever the cell needs."),
], scraps=0))

seq.append(scene("p6-shatov", "cream", [
    cut("sh", "shatov", 300, 350, "Ivan Shatov", "son of a serf, ex-radical", w=280, h=330, rot=-2),
    cut("st", "stavrogin", 1100, 200, None, None, w=160, h=190, rot=5, i=1),
    hl("q", "I believe in Russia. I believe in her Orthodoxy.\nI believe in the body of Christ...\n[[I will believe]] in God.", 820, 400, size=28, i=2, d=0.5),
    scr("u", "underline", 690, 452, w=180, i=3, d=0.3),
    cite("Demons, Part 2, ch. 1 (trans. Constance Garnett, 1916, adapted)"),
], [
    L("Shatov is Kirillov's opposite. The son of a serf, clumsy and passionate, he has broken with the radicals and now preaches that Russia has a special, God-bearing mission."),
    L("Stavrogin asks him the one question he cannot dodge. But do you yourself believe in God?"),
    L("I believe in Russia. I believe in her Orthodoxy. I believe in the body of Christ. I will believe in God.", who="shatov"),
    L("I will believe. Not I do. Dostoevsky gives something close to his own convictions to a man who is not sure of them. That honesty is part of why the book still works."),
]))

seq.append(scene("p6-stavrogin", "slate", [
    cut("s", "stavrogin", 330, 350, "Nikolai Stavrogin", None, w=300, h=350, rot=-2, mask=0, keys={"3": {"mask": 0.85, "d": 0.5, "t": 2.0}}),
    sheet("ls", 900, 330, w=440, h=430, kind="letter", head="Things he did, out of boredom", text="Pulled an old man [[by the nose]].\nBit the governor's [[ear]].\nMarried a disabled woman\n[[as a joke on himself]].", font="type", size=22, fill=2, i=1, rot=2),
    hl("n", "Pyotr sees a prince. Shatov, a prophet.\nKirillov, a teacher. [[He believes nothing.]]", 640, 640, size=24, i=2, card="#f6f1e6"),
    cite("Demons, Part 1, ch. 2"),
], [
    L("And at the centre is Nikolai Stavrogin: handsome, strong, rich, fearless, and completely empty."),
    L("In his youth, out of boredom, he pulled a respectable old man by the nose, bit the governor's ear, and secretly married a disabled woman, as a kind of joke on himself."),
    L("Everyone projects their dreams onto him. Pyotr sees a prince, Shatov a prophet, Kirillov a teacher. Stavrogin believes nothing at all."),
    L("He is what absolute freedom looks like when it has nowhere to go. He can do anything, and so nothing matters."),
], scraps=0))

seq.append(scene("p6-tikhon", "cream", [
    cut("t", "tikhon", 280, 340, "Bishop Tikhon", "the monk who reads it", w=260, h=310, rot=-3),
    sheet("ch", 820, 330, w=400, h=480, kind="page", kicker="CHAPTER NINE", head="At Tikhon's", fill=12, i=0, d=1.0, rot=2, stamp="CUT BY THE EDITOR", stampAt=7.0, stampColor=RED),
    hl("n", "A confession that is also [[a performance]].", 820, 640, size=26, i=2),
    cite("Joseph Frank, The Miraculous Years (1995); the chapter was first published in 1922"),
], [
    L("In a chapter called At Tikhon's, Stavrogin visits a retired bishop and hands him a printed confession. It includes a crime against a young girl, which we will not describe."),
    L("The magazine's editor, Mikhail Katkov, refused to print it. The novel appeared without it, and the chapter was not published until 1922."),
    L("Tikhon reads it and sees straight through it. Even the confession is a performance. Stavrogin wants to shock people, not to repent."),
]))

seq.append(scene("p6-letter", "night", [
    sheet("lt", 640, 330, w=640, h=420, kind="letter", head="To Darya Pavlovna", text="I can still wish to do something good,\nand feel pleasure in it.\nAt the same time I wish to do evil,\nand [[feel pleasure in that too]].", font="type", size=24, fill=2, pre=0, rot=-1),
    hl("n", "Rage with no object. Rebellion with [[no content]].", 640, 640, size=26, i=2, card="#f6f1e6"),
    cite("Demons, Part 3, ch. 8 (paraphrased)"),
], [
    L("Near the end, Stavrogin writes a letter that may be the most chilling thing in the book."),
    L("I can still wish to do something good, and feel pleasure in it. At the same time I wish to do evil, and feel pleasure in that too.", who="stavrogin"),
    L("His rage has no object, and his rebellion has no content. That, Dostoevsky suggests, is exactly the void that men like Pyotr rush in to fill."),
], scraps=0))

# ======================= part 7: the night in the park =======================
seq.append(chapter(7, "Part seven", "The night\nin the park", "Shatov, Kirillov, and the end of the cell", "shatov", color="#3a3a3a"))

seq.append(scene("p7-marie", "cream", [
    cut("sh", "shatov", 300, 340, "Shatov", None, w=250, h=300, rot=-3, mood="calm", face={"mouth": 0.6, "brow": 0.5}),
    cut("m", "marie", 600, 340, "Marie", "returns, in labour", w=250, h=300, rot=2, i=0, d=3.0),
    el("cd", "candle", 900, 520, i=1, anim="fade"),
    hl("q", "There were two of us,\nand now there is [[a third]]:\na new spirit, [[whole and complete]].", 960, 260, size=28, i=3, d=0.4, by="Shatov"),
    cite("Demons, Part 3, ch. 5"),
], [
    L("And now the novel returns to that grotto by the pond."),
    L("On the night before the murder, Shatov's wife Marie, who left him years ago, turns up unexpectedly, and goes into labour. The child is Stavrogin's."),
    L("Shatov does not care. He runs for the midwife, borrows tea and a samovar from Kirillov, and is happier than he has ever been in his life."),
    L("There were two of us, and now suddenly there is a third human being: a new spirit, whole and complete.", who="shatov"),
]))

seq.append(scene("p7-park", "night", [
    el("pk", "park", 640, 430, ripple=0, anim="fade", keys={"1": {"ripple": 1, "d": 3.0, "t": 2.0}}),
    head("t", "SKVORESHNIKI, THE STAVROGIN ESTATE", 640, 90, size=26, i=0, d=0.5),
    hl("a", "Virginsky: [[\"This isn't right!\"]]\nLyamshin screams.\nErkel obeys.", 1040, 600, size=22, i=2, card="#f6f1e6", anchor="middle"),
    cite("Demons, Part 3, ch. 6"),
], [
    L("The next evening the cell lures Shatov to Stavrogin's park, on the pretext that he must hand over a hidden printing press."),
    L("Pyotr shoots him in the forehead. They weigh the body down with stones and drop it into the pond."),
    L("Virginsky keeps crying out that this is not right. Lyamshin screams. Erkel, the youngest and most idealistic, calmly does exactly as he is told."),
], zoom=(1.08, 1.0), scraps=0))

seq.append(scene("p7-kirillov", "night", [
    el("er", "emptyroom", 640, 440, anim="fade"),
    sheet("nt", 1000, 250, w=280, h=220, kind="note", head="I killed Shatov.", fill=2, pre=0, rot=7, font="type", i=0, d=4.0, anim="pop"),
    {"id": "fk", "type": "stampc", "x": 1000, "y": 290, "text": "FALSE", "size": 32, "in": 1, "d": 0.5, "anim": "none", "sfx": "thump", "vol": 0.5},
    cite("Demons, Part 3, ch. 6"),
], [
    L("Then Pyotr goes to collect his alibi. Kirillov, horrified to learn that Shatov is dead, writes the note anyway, claiming the murder as his own."),
    L("And then he shoots himself. Dostoevsky stages it as a nightmare, one of the most frightening scenes in literature. We will leave it there."),
], scraps=0))

seq.append(scene("p7-collapse", "cream", [
    el("cl", "cell", 640, 330, R=220, links=1, s=0.85, members=[
        {"who": "liputin", "name": "Liputin", "color": COL["liputin"], "cross": 1},
        {"who": "student", "name": "Virginsky", "color": COL["student"], "cross": 1},
        {"who": "shigalyov", "name": "Shigalyov", "color": COL["shigalyov"], "cross": 1},
        {"who": "karmazinov", "name": "Lyamshin", "color": "#b8c4a8", "cross": 1},
        {"who": "lembke", "name": "Tolkachenko", "color": "#c9a88a", "cross": 1}],
       centre={"who": "pyotr", "name": "Pyotr", "color": COL["pyotr"]}, anim="fade", out=1),
    el("tr", "train", 640, 600, go=0, s=0.8, i=1, anim="fade", keys={"1": {"go": 1, "d": 1.0, "t": 7.0}}),
    head("h", "THE ORGANISER WALKS AWAY", 640, 200, size=40, i=1, d=2.0, bg=RED),
    cite("Demons, Part 3, ch. 7"),
], [
    L("The group falls apart within days. Lyamshin breaks down and confesses everything to the police, and the others are arrested."),
    L("And Pyotr? He takes the train to St Petersburg, and slips abroad. The organiser is the only one who walks away."),
], grid=True))

seq.append(scene("p7-uri", "slate", [
    sheet("lt", 640, 300, w=560, h=360, kind="letter", head="P.S.", text="I have become a citizen\nof [[the canton of Uri]].\nPerhaps I will live there quietly.", font="type", size=24, fill=1, pre=0, rot=1),
    hl("n", "He never went.", 640, 560, size=34, i=1, card="#f6f1e6", hcolor=RED),
    cite("Demons, Part 3, ch. 8"),
], [
    L("Stavrogin goes home to his estate, climbs up to the attic, and hangs himself with a silk cord that he has carefully soaped."),
    L("His last letter mentioned that he had become a citizen of a quiet Swiss canton, Uri, and might go and live there. He never went."),
], scraps=0))

# ======================= part 8: the swine =======================
seq.append(chapter(8, "Part eight", "Into the swine", "Stepan's last journey", "sofya", color="#7d6a4a"))

seq.append(scene("p8-road", "sage", [
    cut("s", "stepan", 330, 340, "Stepan", "leaves home, in the rain", w=270, h=320, rot=-3, mood="sad"),
    cut("sf", "sofya", 900, 340, "Sofya Matveyevna", "sells the Gospels", w=250, h=300, rot=3, i=1),
    hl("n", "Off to find [[the real Russia]],\nwith a bag and an umbrella.", 640, 600, size=24, i=0, d=3.0),
    cite("Demons, Part 3, ch. 7"),
], [
    L("And Stepan Trofimovich? The old liberal who started it all walks out of his comfortable life in the rain, with a bag and an umbrella, to go and find the real Russia."),
    L("He gets about as far as the next village, falls ill, and meets a woman who sells copies of the Gospels from door to door, Sofya Matveyevna."),
], scraps=1))

seq.append(scene("p8-reading", "night", [
    el("cd", "candle", 230, 560, anim="fade"),
    el("bk", "openbook", 700, 320, s=0.95, headL="LUKE 8", left="Then went the devils out\nof the man, and [[entered\ninto the swine]]: and\nthe herd ran violently\ndown a steep place\ninto the lake.", right="Then they went out to see\nwhat was done; and found\nthe man [[sitting, clothed,\nand in his right mind]].", size=21, delay=1.0),
    cite("Luke 8:33-35 (King James Version)"),
], [
    L("He asks her to read to him, and she reads the passage about the demons and the swine."),
    L("And Stepan finally understands. The demons that went out of the sick man, he says, are all the sores, all the poisons, that have gathered in our great, sick Russia over the centuries."),
    L("That's us. Us, and them, and my Petrusha, and I, perhaps, at the head of them all.", who="stepan"),
    L("It is the only moment in the novel when someone accuses himself first."),
], scraps=0))

seq.append(scene("p8-swine", "sage", [
    el("pg", "pigs", 560, 470, run=0, n=13, anim="fade", keys={"0": {"run": 1, "d": 0.5, "t": 7.0}}),
    hl("q", "Sick. Possessed.\nAnd one day, [[healed]].", 640, 150, size=36, i=1, d=0.5),
    cite("Dostoevsky, letter to Apollon Maikov, October 1870 (paraphrased)"),
], [
    L("The demons rush into the swine, and the swine run off the cliff. But that is not the end of the passage."),
    L("The healed man sits at Jesus's feet, clothed and in his right mind. Dostoevsky wrote to a friend that this was his hope for Russia: sick, possessed, and one day healed."),
    L("Stepan dies a few days later. His last words are about love, and about the need to bow down before something infinitely greater than yourself."),
], scraps=0))

# ======================= part 9: prophecy, and the case against =======================
seq.append(chapter(9, "Part nine", "Prophecy, and\nthe case against", "Was Dostoevsky right?", "gorky", color="#5a5a8a"))

seq.append(scene("p9-history", "cream", [
    el("tl", "ptl", 640, 360, w=940, shown=0, events=[
        {"year": "1869", "text": "Ivanov\nmurdered"}, {"year": "1871", "text": "Demons\nbegins"}, {"year": "1881", "text": "Tsar killed by\nthe People's Will"},
        {"year": "1917", "text": "Bolsheviks\ntake power"}, {"year": "1936", "text": "Show trials:\nrevolutionaries confess"}],
       anim="fade", keys={"0": {"shown": 3, "d": 0.5, "t": 3.0}, "1": {"shown": 4, "d": 0.5, "t": 1.0}, "2": {"shown": 5, "d": 0.5, "t": 1.0}}),
    cite("Richard Pipes, The Russian Revolution (1990); Robert Conquest, The Great Terror (1968)"),
], [
    L("Within a decade, Russian revolutionaries really were using terror. In 1881 a group called the People's Will assassinated Tsar Alexander the Second."),
    L("In 1917 the Bolsheviks took power: a disciplined party of professional revolutionaries, with a secret police, and a doctrine in which the cause decided what was moral."),
    L("Within twenty years, old revolutionaries were standing up at show trials, confessing to crimes they had not committed, as the revolution devoured its own."),
], grid=True))

seq.append(scene("p9-readers", "news", [
    cut("b", "berdyaev", 260, 330, "Nikolai Berdyaev", "1918", w=230, h=280, rot=-3),
    hl("bq", "Dostoevsky, [[prophet]] of\nthe Russian revolution.", 260, 590, size=22, i=0, d=1.5),
    cut("c", "camus", 640, 330, "Albert Camus", "1959", w=230, h=280, rot=2, i=1),
    hl("cq", "Among the [[four or five]] books\nhe valued above all others.", 640, 590, size=22, i=1, d=1.0),
    cut("g", "gorky", 1020, 330, "Maxim Gorky", "1913", w=230, h=280, rot=-2, i=2),
    hl("gq", "A stage version is\n[[harmful to society]].", 1020, 590, size=22, i=2, d=1.0),
    cite("Berdyaev, 'Spirits of the Russian Revolution' (1918); Camus, preface to Les Possédés (1959); Gorky, 'On Karamazovism' (1913)"),
], [
    L("Readers saw Shigalyov everywhere. The philosopher Nikolai Berdyaev, writing in 1918, called Dostoevsky the prophet of the Russian revolution."),
    L("Albert Camus, who adapted Demons for the stage in 1959, counted it among the handful of books he valued above all others."),
    L("On the other side, in 1913 the writer Maxim Gorky protested that a Moscow stage version was harmful to society. Under Soviet rule the novel was treated for decades as reactionary slander."),
], grid=True))

seq.append(scene("p9-lenin", "cream", [
    hl("q", "Lenin is said to have admired\nNechayev's talent [[as an organiser]].", 640, 250, size=32, by="Vladimir Bonch-Bruevich, memoir (1934)"),
    {"id": "st", "type": "stampc", "x": 1010, "y": 380, "text": "USE WITH CARE", "size": 26, "in": 0, "d": 4.0, "anim": "none", "sfx": "thump", "vol": 0.4},
    hl("n", "One source. But [[the echo]] is hard to miss.", 640, 520, size=28, i=1, card="#fff3b0"),
], [
    L("A memoir by Lenin's associate Vladimir Bonch-Bruevich claims that Lenin admired Nechayev's talent as an organiser. Historians treat that single source with some caution."),
    L("But the echo is hard to miss: the party of the few, the cause above every rule, and the comrade who doubts becoming the enemy."),
], grid=True))

seq.append(scene("p9-against", "news", [
    head("h", "THE CASE AGAINST DOSTOEVSKY", 640, 90, size=36, bg=RED),
    sheet("a", 230, 380, w=330, h=420, kind="page", kicker="ONE", head="Caricature", text="Most radicals were\n[[not Nechayevs]].", font="body", size=20, fill=5, i=1, rot=-3),
    sheet("b", 640, 380, w=330, h=420, kind="page", kicker="TWO", head="Family tree", text="Liberal fathers raised\n[[doctors, not killers]].", font="body", size=20, fill=5, i=3, rot=1),
    sheet("c", 1050, 380, w=330, h=420, kind="page", kicker="THREE", head="His own politics", text="Monarchist, nationalist,\n[[at times antisemitic]].", font="body", size=20, fill=5, i=4, rot=3),
    cite("Franco Venturi, Roots of Revolution (1960); Frank (1995); Gary Saul Morson on the Diary"),
], [
    L("So, was Dostoevsky right? Here is the strongest case against him."),
    L("First, the caricature. Most Russian radicals of his day were not Nechayevs. Many were idealists who went to the villages to teach and to heal, and paid for it with prison and exile."),
    L("Even inside the movement, Nechayev was condemned. Bakunin broke with him in 1870 over his lies and his blackmail, and a new circle, the Chaikovtsy, formed partly to prove that radicals could be honest."),
    L("Second, the family tree. Plenty of liberals of the 1840s raised sons who became doctors and reformers, not murderers. The line from Stepan to Pyotr is a novelist's argument, not a historian's proof."),
    L("Third, Dostoevsky's own politics. He published Demons in a conservative journal, revered the monarchy, and in his later journalism wrote in a nationalist and at times antisemitic way. His cure, an Orthodox Russian revival, was a political program too."),
    L("And the book is a satire. It is unfair on purpose, as good satire usually is."),
], grid=True))

seq.append(scene("p9-yet", "cream", [
    cut("d", "dostoevsky", 280, 350, "Dostoevsky", "an insider's warning", w=270, h=320, rot=-3),
    hl("a", "Not: wanting justice is wrong.", 840, 180, size=30, card=False),
    scr("x", "underline", 840, 182, w=470, i=0, d=4.0, width=4),
    hl("b", "But: a cause that decides what is moral\ncan [[justify anything]].", 840, 340, size=28, i=1),
    hl("c", "And the loudest moralists are often\n[[the least examined]].", 840, 500, size=28, i=1, d=3.5, card="#fff3b0"),
    cite("Frank (1995); Joseph Frank, 'The Masks of Stavrogin' (1969)"),
], [
    L("And yet. What makes Demons last is not that Dostoevsky hated the left. It is that he understood a movement from the inside, because he had once been inside one."),
    L("His argument is not that wanting justice is wrong. It is that a cause which decides for itself what is moral can justify anything, and that the loudest moralists are often the least examined."),
    L("That warning applies to any movement, left or right, religious or secular. But he aimed it first at the revolutionary left of his own time, and the century that followed gave him some terrible confirmations."),
]))

# ======================= outro: the Demons test =======================
seq.append(scene("out-test", "cream", [
    head("h", "THE DEMONS TEST", 640, 90, size=44, bg=INK),
    hl("t1", "1  How do they treat [[the person in front of them]]?\n    The serf, the son, the wife, the doubter.", 640, 240, size=26, anchor="middle", i=1),
    hl("t2", "2  What happens to [[the member who asks a question]]?", 640, 400, size=26, i=2),
    hl("t3", "3  Does it grow by conviction, or by [[shame and shared guilt]]?", 640, 540, size=26, i=3),
    scr("c", "check", 1150, 620, w=80, h=60, i=3, d=4.0),
], [
    L("So if you take one thing from the novel, take Dostoevsky's test. Three questions to ask of any movement that speaks in the name of morality and freedom."),
    L("One. How do its champions treat the actual people in front of them: the serf, the son, the wife, the doubter?"),
    L("Two. What happens to the member who asks a question? In Demons, the doubter is the first one into the pond."),
    L("Three. Does it grow by conviction, or by shame: the fear of looking backward, and the bond of shared guilt?"),
], grid=True))

seq.append(scene("out-end", "sage", [
    cut("s", "stepan", 640, 320, None, None, w=260, h=300, rot=-2, mood="calm", face={"mouth": 0.4, "brow": 0.4}),
    hl("a", "Freedom is not the right to do anything.\nIt is the ability to [[love something more than yourself]].", 640, 580, size=28, i=1),
], [
    L("Dostoevsky did not think the answer was to stop wanting a better world. His hope was the second half of that Gospel story: the man sitting quietly, healed, in his right mind."),
    L("Freedom, for him, was not the right to do anything at all. It was the ability to love something more than yourself, and to stay human while you work for it."),
    L("A hundred and fifty years later, that is still the hardest part."),
    beat(2.4, "swell"),
], zoom=(1.0, 1.08), scraps=1))

seq.append({"type": "card", "id": "end", "style": "cend", "title": "DEMONS", "dur": 24, "credits": [
    "# Based on",
    "Demons (Besy), by Fyodor Dostoevsky, serialised in The Russian Messenger, 1871-72",
    "Quotations adapted from Constance Garnett's translation, The Possessed (1916), and paraphrased",
    "# Sources",
    "Joseph Frank, Dostoevsky: The Years of Ordeal (1983) and The Miraculous Years (1995)",
    "Philip Pomper, Sergei Nechaev (1979)",
    "Franco Venturi, Roots of Revolution (1960)",
    "Catechism of a Revolutionary (1869)",
    "Dostoevsky, A Writer's Diary (1873); letters to A. Maikov (1870) and the Tsarevich (1873)",
    "Nikolai Berdyaev, 'Spirits of the Russian Revolution' (1918)",
    "Albert Camus, Les Possédés (1959)",
    "Maxim Gorky, 'On Karamazovism' (1913)",
    "Richard Pipes, The Russian Revolution (1990)",
    "Luke 8:26-39 (King James Version)",
    "# Made with",
    "Kokoro open-weight voices, an original numpy score,",
    "hand-coded SVG collage, headless Chromium and ffmpeg",
    "# Fonts",
    "Archivo Black, Libre Franklin, Playfair Display (SIL OFL); Permanent Marker, Special Elite (Apache 2.0)",
    "",
    "Original animation. All portraits are invented drawings, not likenesses.",
    "Not affiliated with any publisher, channel or estate.",
]})

ep = {
    "meta": {
        "show": "LUMEN", "episode": "Documentary", "title": "Demons: The Revolution That Ate Its Own", "format": "explainer", "look": "collage",
        "category": "Literature: Dostoevsky", "rating": "mature",
        "content_note": "Describes murders, a suicide and political violence from the novel and from history. A crime against a child is named but not described. Stylised paper-collage imagery, nothing graphic.",
        "music": "collage", "narrator": "narrator", "fps": 30, "gap": 0.42, "captions": False,
        "logline": "A paper-collage video essay on Dostoevsky's Demons: the real 1869 murder behind it, the liberal fathers and nihilist sons, Shigalyov's paradise for one tenth, the fashionable people who flattered the radicals, three kinds of freedom, and the strongest case against Dostoevsky's verdict on the revolutionary left.",
        "source": "Fyodor Dostoevsky, Demons (1871-72), Garnett translation (1916); Joseph Frank; Philip Pomper; Franco Venturi; Catechism of a Revolutionary (1869); Berdyaev (1918); Camus (1959); Gorky (1913).",
        "disclaimer": "Original animation. Portraits are invented drawings. Not affiliated with any publisher, channel or estate.",
        "width": 1280, "height": 720,
    },
    "cast": {
        "narrator": {"name": "Narrator", "voice": "am_michael:0.6+bm_george:0.4", "speed": 1.0},
        "pyotr": {"name": "Pyotr", "voice": "am_puck:0.7+bm_fable:0.3", "speed": 1.08},
        "stepan": {"name": "Stepan", "voice": "bm_lewis", "speed": 0.95},
        "shigalyov": {"name": "Shigalyov", "voice": "am_onyx", "speed": 0.9},
        "kirillov": {"name": "Kirillov", "voice": "bm_daniel", "speed": 0.92},
        "shatov": {"name": "Shatov", "voice": "am_fenrir:0.6+bm_george:0.4", "speed": 0.98},
        "stavrogin": {"name": "Stavrogin", "voice": "bm_fable:0.6+am_onyx:0.4", "speed": 0.9},
    },
    "sequence": seq,
}

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "episode.json")
json.dump(ep, open(out, "w"), indent=1, ensure_ascii=False)
words = sum(len(l.get("text", "").split()) for s in seq if s["type"] == "scene" for l in s["lines"])
print(f"wrote {out}: {len(seq)} segments, {words} words of narration")
