"""Episode 1: "The Séance" (the book's Introduction). Run: python3 explainer/tools/new_medina/e01.py"""
from common import *

SLUG = "new-medina-e01-the-seance"

def book(id, x, y, title, author, color, line=0, d=0.3, w=170, h=230, **kw):
    e = {"id": id, "type": "tome", "x": x, "y": y, "w": w, "h": h, "title": title, "author": author, "color": color, "in": line, "d": d, "anim": "rise"}
    e.update(kw)
    return e

def typer(id, x, y, text, line=0, d=0.3, size=30, font="type", color=BONE, **kw):
    e = {"id": id, "type": "typer", "x": x, "y": y, "text": text, "in": line, "d": d, "size": size, "font": font, "color": color, "anim": "none"}
    e.update(kw)
    return e

def verdict(id, x, y, claim, level, by=None, line=0, d=0.4, w=580, **kw):
    e = {"id": id, "type": "verdict", "x": x, "y": y, "w": w, "claim": claim, "level": level, "in": line, "d": d, "anim": "rise", "on": 0,
         "keys": {str(line): {"on": 1, "d": d + 0.9, "t": 0.8}}}
    if by:
        e["by"] = by
    e.update(kw)
    return e

def dossier(id, x, y, name, role, years, line=0, d=0.3, **kw):
    e = {"id": id, "type": "dossier", "x": x, "y": y, "name": name, "role": role, "years": years, "in": line, "d": d, "anim": "drop", "sfx": "shutter", "vol": 0.5}
    e.update(kw)
    return e

def label(id, x, y, text, line=0, d=0.3, color=GOLD, **kw):
    e = {"id": id, "type": "typer", "x": x, "y": y, "text": text, "in": line, "d": d, "size": 20, "font": "type", "color": color, "anim": "fade", "cursor": False, "cps": 40}
    e.update(kw)
    return e

seq = []

# ---------------- cold open ----------------
seq.append({"type": "card", "id": "open", "style": "intertitle", "lines": ["The British Library, London.", "India Office Records."], "sub": "THE PRIVATE PAPERS OF MOHAMMAD ALI JINNAH", "dur": 5.2, "sfx": "type"})

seq.append(scene("archive", {"kind": "corridor", "pal": "sepia", "speed": 0.08}, [
    slate("LONDON · INDIA OFFICE RECORDS"),
    {"id": "reel", "type": "doc", "x": 640, "y": 380, "w": 380, "h": 470, "rot": -2, "title": "QAID-I-AZAM PAPERS", "meta": "Microfilm Neg. 10811 · File 1067",
     "lines": ["Handwritten record.", "13 March 1955, 6 p.m.", "", "A seance."], "cps": 16, "in": 1, "d": 0.2, "anim": "rise", "sfx": "type", "vol": 0.5,
     "stamp": "FILE 1067", "stampOn": 0, "keys": {"2": {"stampOn": 1, "d": 0.1, "t": 0.3}}},
    cite("Qaid-i-Azam Papers, Neg. 10811, File 1067, British Library; as described in Dhulipala, Introduction", 1),
], [
    L("Late one evening, a historian working through microfilm of Jinnah's private papers came across a document that had no business being there."),
    L("Handwritten. The ink fading. It was the record of a séance."),
    beat(1.6, "heart"),
], cam={"zoom": [1.0, 1.08], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("seance", {"kind": "room", "pal": "archive"}, [
    slate("13 MARCH 1955 · 6 P.M."),
    {"id": "table", "type": "seance", "x": 640, "y": 600, "size": 0.95, "anim": "fade", "smoke": 0, "keys": {"3": {"smoke": 1, "d": 2.5, "t": 3}}},
    typer("who", 640, 110, "Present: a spiritualist. A Mr Ibrahim, government officer.", 1, 0.5, size=20, color="#d9c49a"),
    cite("Seance transcript in the Qaid-i-Azam Papers, quoted in Dhulipala, Introduction", 0, 1.0),
], [
    L("Six in the evening, the thirteenth of March, 1955. Pakistan is eight years old. Its founder, Mohammad Ali Jinnah, has been dead for nearly seven."),
    L("A government officer, a certain Mr Ibrahim, has hired a spiritualist to call him back."),
    L("The spiritualist politely offers the guest a seat. The spirit answers, rather tartly, that it is already seated."),
    L("In life, the Qaid-i-Azam was a heavy smoker. So a cigarette is lit and fixed on a wire stand, for the spirit to smoke while it answers."),
    beat(2.4),
], cam={"zoom": [1.12, 1.0], "pan": [[0, 30], [0, 0]]}))

seq.append(scene("transcript", "void", [
    {"id": "tx", "type": "doc", "x": 430, "y": 362, "w": 470, "h": 560, "rot": 1.5, "title": "SEANCE, 13.3.1955", "meta": "Excerpts, condensed. Quoted phrases verbatim.",
     "lines": ["Q. Sir, won't you guide the destiny", "   of the nation now?", "A. Not my place any more. I see", "   'flashes of evil pictures", "    about Pakistan'.",
               "Q. A prosperous future?", "A. 'I don't think so.'", "Q. Your advice to its rulers?", "A. 'Selflessness, selflessness.'"],
     "cps": 24, "anim": "rise", "sfx": "type", "vol": 0.5, "hl": 3, "hlOn": 0, "keys": {"0": {"hlOn": 1, "d": 4.5, "t": 0.8}}},
    {"id": "q", "type": "cquote", "x": 930, "y": 330, "w": 520, "size": 28, "text": "It is easier to acquire\na country, but it is\nextremely difficult\nto retain it.", "by": "the 'spirit', 1955", "in": 3, "d": 0.3, "anim": "fade"},
    cite("Qaid-i-Azam Papers, File 1067, quoted in Dhulipala, Introduction", 0, 0.6),
], [
    L("Mr Ibrahim asks the father of the nation to guide its destiny. The spirit refuses. That is no longer its place, it says, though it often sees 'flashes of evil pictures about Pakistan'."),
    L("Is there a prosperous future? 'I don't think so,' comes the reply. Its only advice to Pakistan's rulers is selflessness."),
    L("And then a line that historians keep coming back to."),
    L("'It is easier to acquire a country,' says the spirit, 'but it is extremely difficult to retain it.'"),
    beat(2.0, "bell"),
], pal="ink", cam={"zoom": [1.0, 1.06], "pan": [[0, 0], [20, 0]]}))

seq.append(scene("crisis", "void", [
    {"id": "yr", "type": "year", "x": 380, "y": 330, "value": 1948, "size": 150, "anim": "fade", "glowColor": RED,
     "keys": {"1": {"value": 1951, "d": 2.5, "t": 1.5}, "2": {"value": 1958, "d": 3.0, "t": 1.5}}},
    label("e1", 880, 170, "Sept 1948 · Jinnah dies", 1, 0.2, color="#e8cfa0"),
    label("e2", 880, 230, "1947-48 · war over Kashmir", 1, 1.8, color="#e8cfa0"),
    label("e3", 880, 290, "1951 · Liaquat Ali Khan assassinated", 1, 3.6, color="#ff9a8a"),
    label("e4", 880, 350, "1950s · no agreed constitution", 2, 0.4, color="#e8cfa0"),
    label("e5", 880, 410, "1958 · first martial law", 2, 3.2, color="#ff9a8a"),
    label("e6", 880, 490, "and after: coups, insurgencies,\nsectarian killing, leaders killed or exiled", 3, 0.3, color="#b8a888", size=17),
    {"id": "r", "type": "rule", "x": 880, "y": 455, "w": 420, "draw": 0, "in": 3, "anim": "none", "keys": {"3": {"draw": 1, "d": 0, "t": 0.8}}},
    cite("Dhulipala, Introduction; standard chronology of Pakistan, 1947-58", 1),
], [
    L("Whatever one makes of talking to the dead, the document records something real: a sense of crisis, almost from the start."),
    L("Jinnah died in September 1948, barely a year after independence. There was war with India over Kashmir. In 1951 the prime minister, Liaquat Ali Khan, was shot dead."),
    L("Secularists, clerics, Islamists and regional parties could not agree on a constitution. Governments came and went. In 1958 came the first martial law."),
    L("Coups, insurgencies, sectarian killing, and leaders assassinated or driven into exile have followed ever since."),
], pal="blood", cam={"zoom": [1.0, 1.05], "pan": [[0, 0], [10, 0]]}))

seq.append(scene("question", "void", [
    typer("why", 640, 200, "Why so soon?", 0, 0.5, size=56, font="serif", color=BONE, weight=700, italic=True),
    typer("acc", 640, 300, "a slogan · a bargaining chip · an accident", 1, 0.3, size=24, color="#b8a888", cursor=False),
    book("bk", 640, 500, "Creating a New Medina", "Venkat Dhulipala", "#5a1a1a", 2, 0.8, w=190, h=250),
], [
    L("Why was the new country in trouble so soon? For decades, one answer has dominated the history books."),
    L("Pakistan, it says, was never really imagined. It was a slogan, a bargaining chip, a country that came about almost by accident."),
    L("This series follows a historian who went into the archives and came back with the opposite answer."),
    L("His name is Venkat Dhulipala. His book is called Creating a New Medina."),
], pal="ink"))

seq.append({"type": "card", "id": "title", "style": "titlex", "kicker": "A LUMEN DOCUMENTARY IN TEN PARTS", "title": SERIES,
            "sub": "Episode 1 · The Séance", "by": "after the book by Venkat Dhulipala (2015)", "dur": 7.5, "sfx": "boom"})

# ---------------- chapter 1 ----------------
seq.append(chapter("ch1", 1, "The Accidental Country", "1940 – 1947"))

seq.append(scene("partition", "void", [
    {"id": "m", "type": "samap", "x": 560, "y": 372, "k": 1.05, "draw": 0, "split": 0, "nb": 0.8, "anim": "fade",
     "labels": [{"text": "INDIA", "at": [78.5, 21.5]}, {"text": "PAKISTAN", "at": [69.5, 28.6], "size": 18}, {"text": "EAST PAKISTAN", "at": [92.6, 26.9], "size": 12}],
     "labelsOn": 0, "keys": {"0": {"draw": 1, "d": 0, "t": 4}, "1": {"split": 1, "labelsOn": 1, "d": 0.2, "t": 1.6}}},
    label("d1", 1010, 250, "Deaths: est. 200,000 to 2 million", 2, 0.6, color="#ff9a8a", size=19),
    label("d2", 1010, 300, "Uprooted: est. 10 to 20 million", 2, 2.4, color="#e8cfa0", size=19),
    cite("Commonly cited scholarly ranges, e.g. Yasmin Khan, The Great Partition (2007)", 2),
], [
    L("In August 1947 the British left, and their Indian empire was cut in two."),
    L("India. And Pakistan, in two wings a thousand miles apart."),
    L("The new borders ran through Punjab and Bengal. Millions crossed them in both directions. Historians estimate that between two hundred thousand and two million people were killed."),
    L("How did something so vast happen so fast? Here the historians divide."),
], pal="ink", cam={"zoom": [1.0, 1.06], "pan": [[0, 0], [0, -6]]}))

seq.append(scene("jalal", "void", [
    book("sole", 330, 380, "The Sole Spokesman", "Ayesha Jalal · 1985", "#2f4a6a", 0, 0.3),
    typer("bc", 840, 180, "THE BARGAINING COUNTER", 1, 0.2, size=34, font="bebas", color=AMBER, ls=4, cursor=False),
    {"id": "sc", "type": "scale", "x": 840, "y": 360, "s": 0.9, "tilt": 0, "left": "people", "right": "building", "in": 1, "d": 0.8, "anim": "pop",
     "keys": {"2": {"tilt": -0.6, "d": 1.0, "t": 1.2}}},
    label("cm", 840, 500, "1946 · Cabinet Mission plan rejected", 2, 1.2, color="#e8cfa0"),
    {"id": "q", "type": "cquote", "x": 840, "y": 330, "w": 560, "size": 26, "text": "little more than a catch-all,\nan undefined slogan", "by": "Ayesha Jalal, The Sole Spokesman (1985)", "in": 3, "d": 0.3, "anim": "fade"},
    cite("Ayesha Jalal, The Sole Spokesman (Cambridge, 1985), as summarised by Dhulipala", 0, 0.8),
], [
    L("In 1985 Ayesha Jalal published The Sole Spokesman, and changed the field."),
    L("Jinnah, she argued, did not really want a separate sovereign state. Pakistan was a bargaining counter, a demand meant to win Muslims an equal share of power in a loose, undivided India."),
    L("When Congress turned down the 1946 Cabinet Mission plan, with its weak centre, the bargain fell apart. Partition was what was left."),
    L("And the Muslims who cheered for Pakistan? In her account, it remained 'little more than a catch-all, an undefined slogan'."),
], pal="ink"))
seq[-1]["els"][2]["out"] = 3
seq[-1]["els"][1]["out"] = 3
seq[-1]["els"][3]["out"] = 3

seq.append(scene("consensus", "void", [
    book("b1", 200, 300, "Origins of the Partition", "A. I. Singh · 1987", "#4a3a5a", 0, 0.2, w=150, h=200),
    book("b2", 420, 300, "Routine Violence", "G. Pandey · 2006", "#3a4a3a", 1, 0.2, w=150, h=200),
    book("b3", 640, 300, "Partition, Pakistan and South Asian History", "D. Gilmartin · 1998", "#5a4a2a", 1, 3.5, w=150, h=200),
    book("b4", 860, 300, "Nationalism without a Nation", "C. Jaffrelot · 2002", "#2a3a5a", 2, 0.2, w=150, h=200),
    book("b5", 1080, 300, "Making Sense of Pakistan", "F. Shaikh · 2009", "#5a2a3a", 2, 2.0, w=150, h=200),
    typer("slog", 640, 500, "Pakistan ka matlab kya?  La ilaha illallah.", 3, 0.2, size=28, font="serif", italic=True, color=GOLD, cps=20),
    typer("slog2", 640, 548, "What is the meaning of Pakistan? There is no god but God.", 3, 2.4, size=18, color="#b8a888", cursor=False, cps=40),
    cite("Works as summarised in Dhulipala, Introduction; 'insufficiently imagined' is Salman Rushdie's phrase", 0, 0.6),
], [
    L("Others disagreed with Jalal about Jinnah. Anita Inder Singh argued he wanted a sovereign Pakistan all along. But even she agreed that for ordinary Muslims, it 'meant all things to all Muslims'."),
    L("Gyanendra Pandey, a historian of ordinary lives, wrote that few Muslims had clear ideas of what the goal meant. David Gilmartin saw Pakistan as a symbol of solidarity more than a place on a map."),
    L("Christophe Jaffrelot called it a nationalism without a nation. Farzana Shaikh blamed Pakistan's later troubles on that missing content. Salman Rushdie's phrase stuck: insufficiently imagined."),
    L("At rallies, crowds chanted: what is the meaning of Pakistan? There is no god but God. Beyond that, the consensus says, there was little content at all."),
], pal="ink", cam={"zoom": [1.0, 1.04], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("standard", "void", [
    verdict("v", 640, 300, "Pakistan was a vague idea that became\na state almost by accident.", "debated", "The standard account, which this book sets out to overturn", 0, 0.4, w=760),
    typer("but", 640, 520, "One province does not fit.", 1, 0.6, size=34, font="serif", italic=True, color=BONE),
], [
    L("So the standard story runs like this. A vague dream below, a high-stakes bargain above, and a country nobody quite planned."),
    L("But there is one place that story struggles to explain."),
], pal="smoke"))

# ---------------- chapter 2 ----------------
seq.append(chapter("ch2", 2, "The Province Left Behind", "United Provinces · 1940"))

seq.append(scene("upmap", "void", [
    {"id": "m", "type": "samap", "x": 600, "y": 372, "k": 1.05, "split": 0, "up": 0, "und": 0.4, "lit": 0, "anim": "fade",
     "cities": [{"name": "Lucknow", "pin": True}, {"name": "Aligarh", "left": True}, {"name": "Deoband", "left": True}, {"name": "Lahore", "note": "23 March 1940", "left": True}],
     "labels": [{"text": "PAKISTAN", "at": [69.5, 28.0], "size": 18}, {"text": "PAKISTAN", "at": [90.3, 25.9], "size": 13}, {"text": "HINDUSTAN", "at": [78.0, 20.5]}], "labelsOn": 0,
     "keys": {"0": {"up": 1, "lit": 3, "d": 0.5, "t": 3}, "2": {"lit": 4, "split": 0.75, "d": 0.6, "t": 1.8}, "3": {"labelsOn": 1, "d": 0.6, "t": 1}}},
    label("pct", 1040, 180, "Muslims: about 14% of the province", 1, 0.3, color="#ffd08a", size=19),
    {"id": "lr", "type": "doc", "x": 1050, "y": 420, "w": 330, "h": 300, "rot": 2, "title": "LAHORE RESOLUTION", "meta": "All-India Muslim League, March 1940",
     "lines": ["Muslim-majority areas of the", "north-west and the east to be", "'autonomous and sovereign'."], "cps": 30, "in": 2, "d": 0.3, "anim": "rise", "hl": 2, "hlOn": 0,
     "keys": {"2": {"hlOn": 1, "d": 3.4, "t": 0.6}}},
    cite("Dhulipala, Introduction; the 14% figure is the one cited by contemporaries in the book", 1),
], [
    L("The United Provinces of Agra and Oudh. Today, Uttar Pradesh. The old heartland of Muslim north India: Lucknow, Aligarh, Deoband."),
    L("Muslims here were a minority, about fourteen percent of the province. Yet this is where the idea of Pakistan found its earliest, loudest and most sustained support."),
    L("In March 1940, at Lahore, the Muslim League demanded that the Muslim-majority areas of the north-west and the east become 'autonomous and sovereign'."),
    L("Look at the map. The United Provinces were not in it. Whatever Pakistan became, these Muslims would stay behind, in Hindustan."),
], pal="ink", cam={"zoom": [1.0, 1.07], "pan": [[0, 0], [20, -10]]}))

seq.append(scene("paradox", "void", [
    typer("q", 640, 160, "Why fight for a country\nyou will never live in?", 0, 0.3, size=40, font="serif", italic=True, cursor=False, cps=30),
    {"id": "st", "type": "stat", "x": 390, "y": 400, "value": 0, "suffix": "%", "size": 110, "color": JADE, "label": "of U.P. Muslim votes for the League, 1946", "in": 1, "d": 0.6, "anim": "fade",
     "keys": {"1": {"value": 65, "d": 1.0, "t": 2}}},
    label("six", 930, 360, "all 6 U.P. Muslim seats in the Central Assembly", 1, 3.0, color="#c8f0dd", size=18),
    label("oss", 930, 430, "U.S. report: a 'relatively poor' showing", 2, 0.4, color="#e8cfa0", size=18),
    label("why", 930, 480, "blamed orthodoxy, Sunni-Shia splits, infighting", 2, 2.4, color="#b8a888", size=16),
    cite("OIR Report No. 4162.1 (1 August 1946), quoted in Dhulipala, ch. 8", 1, 0.6),
], [
    L("So why would they fight for a country they would never live in?"),
    L("In the winter of 1945 and 1946, elections became a referendum on Pakistan. In the United Provinces the League swept every Muslim seat for the central assembly, and won about two thirds of the Muslim vote for the province."),
    L("An American intelligence report still called that a relatively poor showing, and blamed religious orthodoxy, Sunni-Shia splits and League infighting. The bar was that high."),
], pal="blood"))

# ---------------- chapter 3 ----------------
seq.append(chapter("ch3", 3, "A Symbol With Substance", "1940 – 1946", color=GOLD))

seq.append(scene("argue", "paper", [
    {"id": "n1", "type": "paper", "x": 250, "y": 370, "w": 330, "h": 450, "rot": -4, "mast": "MADINA", "date": "BIJNOR · BI-WEEKLY · 1942", "head": "What will\nPakistan be?", "headSize": 26, "anim": "drop", "sfx": "thump", "vol": 0.3},
    {"id": "n2", "type": "paper", "x": 640, "y": 360, "w": 330, "h": 450, "rot": 2, "mast": "DAWN", "date": "DELHI · 1945", "head": "The case for\nPakistan", "headSize": 26, "in": 1, "d": 0.2, "anim": "drop", "sfx": "thump", "vol": 0.3},
    {"id": "n3", "type": "doc", "x": 1030, "y": 370, "w": 320, "h": 430, "rot": -3, "title": "PAMPHLET", "meta": "Urdu, 1940s (generic)", "lines": ["Is Pakistan possible?", "Its revenues.", "Its borders.", "Its army.", "Its minorities.", "Its place in the world."], "cps": 30, "in": 1, "d": 1.6, "anim": "drop", "sfx": "thump", "vol": 0.3},
    cite("Newspapers named in the book; layouts are generic reconstructions, not facsimiles", 0, 0.6),
], [
    L("Dhulipala starts from a simple observation. India was, in Amartya Sen's word, argumentative. Pakistan did not escape the argument."),
    L("From the moment the Lahore Resolution passed, it was argued over in Urdu newspapers, in pamphlets and books, at meetings in cities, bazaars and small market towns across north India."),
    L("Through those arguments, he says, Pakistan stopped being vague. It gained a shape, a substance and a following."),
], cam={"zoom": [1.04, 1.0], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("medina", "void", [
    {"id": "w", "type": "samap", "view": "wide", "x": 700, "y": 380, "k": 1.45, "split": 0.8, "nb": 1, "anim": "fade",
     "arcs": [{"from": "Medina", "to": "Lahore", "label": "a new Medina", "bend": 0.25}, {"from": "Istanbul", "to": "Delhi", "color": "#c97a6a", "bend": 0.2, "label": "after the Caliphate"}],
     "arcDraw": [0, 0], "cities": [{"name": "Medina", "pin": True, "left": True}, {"name": "Lahore"}, {"name": "Istanbul", "left": True}, {"name": "Delhi"}], "lit": 1,
     "keys": {"0": {"arcDraw": [1, 0], "d": 2.0, "t": 2.5}, "1": {"lit": 2, "d": 0.4, "t": 1}, "3": {"lit": 4, "arcDraw": [1, 1], "d": 0.2, "t": 2.2}}},
    typer("nm", 640, 110, "A NEW MEDINA", 0, 2.0, size=44, font="bebas", color=GOLD, ls=10, cursor=False, cps=12),
    label("ca", 300, 600, "Ottoman Caliphate abolished, 1924", 3, 0.5, color="#e8cfa0"),
    cite("Dhulipala, Introduction and Conclusion", 0, 1.0),
], [
    L("The shape it took in the United Provinces was this: a sovereign Islamic state. Some of its champions had a name for it. A new Medina."),
    L("Medina was the city where the Prophet Muhammad built the first Muslim community and state, in the seventh century. To invoke it was to promise a fresh beginning."),
    L("Pakistan would be a refuge for India's Muslims. But more than a refuge: the base for a renewal of Islam in the modern world."),
    L("And the heir to the Ottoman Caliphate, abolished in 1924, as the leading power and protector of the world's Muslims."),
], pal="jade", cam={"zoom": [1.0, 1.06], "pan": [[0, 0], [-10, 0]]}))

seq.append(scene("geobody", "void", [
    {"id": "m", "type": "samap", "x": 470, "y": 372, "k": 1.05, "split": 1, "nb": 0.7, "anim": "fade",
     "cities": [{"name": "Karachi", "note": "port", "left": True}, {"name": "Lahore", "note": "railways"}, {"name": "Peshawar", "note": "frontier", "left": True}, {"name": "Chittagong", "note": "port"}, {"name": "Dacca", "note": "jute"}], "lit": 0,
     "keys": {"0": {"lit": 5, "d": 0.8, "t": 5}}},
    {"id": "i1", "type": "icon", "x": 900, "y": 160, "r": 34, "glyph": "globe", "color": "#4a7a6a", "in": 0, "d": 1.0},
    label("l1", 1080, 160, "maps · rivers · ports · railways", 0, 1.2, color="#c8f0dd", size=17),
    {"id": "i2", "type": "icon", "x": 900, "y": 260, "r": 34, "glyph": "medal", "color": "#8a6a2a", "in": 1, "d": 0.4},
    label("l2", 1080, 260, "'a first-class power'", 1, 0.6, color="#ffd08a", size=19),
    label("l2b", 1080, 300, "'Islamistan' (Khaliquzzaman)", 1, 5.5, color="#e8cfa0", size=16),
    {"id": "i3", "type": "icon", "x": 900, "y": 380, "r": 34, "glyph": "shield", "color": "#7a3a3a", "in": 2, "d": 0.4},
    label("l3", 1080, 380, "a bulwark for the Middle East", 2, 0.6, color="#ffb3a8", size=17),
    {"id": "i4", "type": "icon", "x": 900, "y": 500, "r": 34, "glyph": "flask", "color": "#3a5a7a", "in": 3, "d": 0.4},
    label("l4", 1080, 500, "'laboratory of Islam'", 3, 0.6, color="#cfe0f0", size=19),
    cite("Dhulipala, Introduction; Khaliquzzaman quoted via H. Haqqani (2005); Jinnah, US Embassy Cairo memo, 21 Dec 1946", 0, 1.0),
], [
    L("League propagandists sold the country's body as well as its soul. They printed its maps, listed its rivers, ports, railways and resources, and praised its place beside the Muslim Middle East."),
    L("Bigger than most European states, they said, and potentially a first-class power, stronger than Turkey. One senior leader, Chaudhry Khaliquzzaman, imagined it gathering the Muslim nations into an 'Islamistan'."),
    L("In Cairo in 1946, Jinnah told an American diplomat that without Pakistan the Middle East itself would be threatened by what he called Hindu imperialism."),
    L("Pakistan would even be a laboratory, where Islam and modern learning would find answers to the problems of the modern world."),
], pal="ink"))

seq.append(scene("hostages", "void", [
    typer("t", 640, 120, "THE HOSTAGE POPULATION THEORY", 0, 1.5, size=34, font="bebas", color="#ff9a8a", ls=6, cursor=False, cps=20),
    {"id": "sc", "type": "scale", "x": 640, "y": 290, "s": 0.82, "tilt": 0, "left": "people", "right": "people", "in": 1, "d": 0.2, "anim": "pop",
     "keys": {"1": {"tilt": 0.5, "d": 2.0, "t": 1}, "2": {"tilt": -0.5, "d": 0.5, "t": 1}, "3": {"tilt": 0, "d": 0.5, "t": 1}}},
    label("lp", 480, 420, "Hindus and Sikhs in Pakistan", 1, 0.6, color="#e8cfa0", size=17),
    label("rp", 800, 420, "Muslims in Hindustan", 1, 1.4, color="#e8cfa0", size=17),
    verdict("v", 640, 585, "League leaders used 'hostage' logic to reassure minority-province Muslims.", "strong", None, 3, 1.5, w=760),
    cite("Indian Annual Register 1940, vols 1-2; B. R. Ambedkar, Thoughts on Pakistan; quoted in Dhulipala, Introduction", 1, 0.6),
], [
    L("And the Muslims left behind? Here the propaganda turned cold. It was called the hostage population theory."),
    L("Hindus and Sikhs inside Pakistan would be hostages. If Hindu India mistreated its Muslims, Pakistan could answer in kind. Each minority would guarantee the other's safety."),
    L("Some went further. In 1940 the Sindh League leader Abdullah Haroon compared India's Muslims with the Sudeten Germans, and referred admiringly to Hitler's move to 'liberate' them."),
    L("Jinnah asked why, if Gladstone's Britain could intervene in Armenia to protect a minority, Pakistan should not do the same for its minorities in Hindustan."),
], pal="blood"))

seq.append(scene("mosque", "void", [
    {"id": "d1", "type": "doc", "x": 330, "y": 330, "w": 420, "h": 300, "rot": -2, "title": "STAR OF INDIA", "meta": "4 January 1941",
     "lines": ["Jinnah: it would be 'a great", "mistake' to believe the demand", "is only a counter for bargaining."], "cps": 32, "anim": "rise", "hl": 0, "hlOn": 0, "keys": {"0": {"hlOn": 1, "d": 4, "t": 0.6}}},
    verdict("v1", 870, 200, "Jinnah publicly denied that Pakistan\nwas a bargaining counter.", "strong", "Newspaper reports, January 1941", 0, 2.0, w=560),
    verdict("v2", 870, 420, "Jinnah: secure the land for the mosque\nfirst, then decide how to build it.", "debated", "One visitor's recollection, quoted in S. V. R. Nasr (1994)", 1, 1.0, w=560),
    cite("The Leader and Star of India, 4 Jan 1941; S. V. R. Nasr, The Vanguard of the Islamic Revolution (1994); via Dhulipala", 0, 0.6),
], [
    L("Was it all a bargaining chip, then? Jinnah himself warned his followers in 1941 that it would be 'a great mistake' to believe Congress claims that Pakistan was only a counter for bargaining."),
    L("On an Islamic state, he kept his public words vague. A visitor from the Jamaat-i-Islami later recalled Jinnah's answer: first secure the land for the mosque; then decide how to build the mosque."),
], pal="ink"))

seq.append(scene("constitution", "archive", [
    {"id": "d", "type": "doc", "x": 640, "y": 360, "w": 520, "h": 500, "rot": 1, "title": "DRAFT: AN ISLAMIC CONSTITUTION", "meta": "U.P. Muslim League committee, chair S. Sulaiman Nadwi",
     "lines": ["Committee of League men and ulama,", "set up soon after Lahore, 1940.", "", "Report circulated internally.", "Published only in 1957.", "", "1949: Nadwi invited to advise", "Pakistan's Constituent Assembly."],
     "cps": 26, "anim": "rise", "sfx": "type", "vol": 0.4, "stamp": "UNPUBLISHED", "stampOn": 0, "keys": {"1": {"stampOn": 1, "d": 0.4, "t": 0.3}}},
    cite("M. I. Sandelvi, Islam Ka Siyasi Nizam (1957); L. Binder (1961); via Dhulipala, Introduction", 0, 0.6),
], [
    L("Soon after Lahore, the United Provinces League set up a committee of politicians and religious scholars to draft an Islamic constitution for Pakistan. For reasons never fully explained, its report stayed unpublished until 1957."),
    L("Its chairman, Sulaiman Nadwi, was invited in 1949 to lead the experts advising Pakistan's Constituent Assembly. His recommendations drew on that report."),
], cam={"zoom": [1.08, 1.0], "pan": [[0, 0], [0, 0]]}, pal="archive"))
seq[-1]["bg"] = {"kind": "room", "pal": "archive"}

# ---------------- chapter 4 ----------------
seq.append(chapter("ch4", 4, "Two Medinas", "Deoband · 1938 – 1945", color=JADE))

seq.append(scene("madani", "void", [
    dossier("dm", 330, 360, "Husain Ahmad Madani", "Deoband; led the\nJamiatul Ulama-i-Hind", "1879 – 1957", 0, 1.0, hat="turban", beard=True, tag="UNITED INDIA", tagColor="#3a6ea5"),
    typer("mq", 830, 170, "Muttahida Qaumiyat", 2, 0.3, size=40, font="serif", italic=True, color=SKY, cursor=False, cps=18),
    label("mq2", 830, 220, "composite nationalism", 2, 1.6, color="#cfe0f0"),
    label("cov", 830, 300, "the Covenant of Medina: one community, many faiths", 2, 3.0, color="#e8cfa0", size=17),
    dossier("dt", 700, 470, "Ashraf Ali Thanawi", "Deobandi scholar", "1863 – 1943", 3, 0.3, hat="topi", beard=True, w=200, h=280),
    dossier("di", 920, 470, "Muhammad Iqbal", "poet, philosopher", "1877 – 1938", 3, 1.6, hat="karakul", w=200, h=280),
    dossier("dw", 1140, 470, "Abul Ala Mawdudi", "Islamist thinker", "1903 – 1979", 3, 2.9, hat="karakul", beard=True, w=200, h=280),
    cite("H. A. Madani, Composite Nationalism and Islam (tr. 2005); B. Metcalf (2009); Dhulipala, Introduction and ch. 5", 0, 0.6),
], [
    L("Now the twist at the heart of the book. The first man to hold up Medina as a model for modern India was an opponent of Pakistan."),
    L("Maulana Husain Ahmad Madani of Deoband had taught the Prophet's traditions in Medina itself for over a decade. He led the Jamiatul Ulama-i-Hind, the main body of India's religious scholars."),
    L("In Medina, he argued, the Prophet had made a covenant with the city's Jews: one people of many faiths. Hindus and Muslims could likewise be one nation. He called it Muttahida Qaumiyat, composite nationalism."),
    L("His critics pounced. The scholar Ashraf Ali Thanawi, the poet Muhammad Iqbal and the Islamist Abul Ala Mawdudi all attacked his reading. Muslims, they insisted, were a nation apart."),
], pal="ink"))
for e in seq[-1]["els"]:
    if e["id"] in ("mq", "mq2", "cov"):
        e["out"] = 3

seq.append(scene("usmani", "void", [
    dossier("du", 330, 360, "Shabbir Ahmad Usmani", "Thanawi's disciple; founded\nthe Jamiatul Ulama-i-Islam", "1886 – 1949", 0, 0.6, hat="turban", beard=True, tag="PAKISTAN", tagColor="#2f6f5a"),
    {"id": "w", "type": "samap", "view": "wide", "x": 850, "y": 380, "k": 1.05, "split": 1, "nb": 1, "anim": "fade", "in": 1, "d": 0.2,
     "arcs": [{"from": "Medina", "to": "Mecca", "bend": -0.6, "draw": 1}, {"from": "Medina", "to": "Cairo", "bend": 0.3}, {"from": "Lahore", "to": "Istanbul", "bend": 0.3, "color": JADE}, {"from": "Lahore", "to": "Cairo", "bend": 0.25, "color": JADE}],
     "cities": [{"name": "Medina", "left": True}, {"name": "Lahore"}], "lit": 2},
    label("shk", 330, 600, "later hailed as Pakistan's Shaikhul Islam", 2, 0.4, color="#c8f0dd", size=16),
    cite("Dhulipala, Introduction and ch. 7", 0, 0.6),
], [
    L("Then Thanawi's disciple, Maulana Shabbir Ahmad Usmani, turned Medina around. Pakistan, he declared, would be the new Medina."),
    L("As the Prophet's Medina had been the base from which Islam spread across Arabia and beyond, Pakistan would unite the world's Muslims and carry them back onto the world stage as a great power."),
    L("In 1945 Usmani founded the Jamiatul Ulama-i-Islam and campaigned for the League. India's religious scholars split down the middle."),
    L("One city, two futures. A Medina of many faiths sharing one homeland. Or a Medina as the capital of a rising Islamic power."),
    beat(1.6, "heart"),
], pal="jade"))

seq.append(scene("ulamav", "void", [
    verdict("v1", 640, 230, "Leading Deobandi scholars campaigned for Pakistan,\nnot only against it.", "strong", "Well documented: Usmani, the JUI, the 1945-46 campaign", 0, 0.4, w=820),
    verdict("v2", 640, 460, "Their support was decisive in winning\nover Muslim voters.", "debated", "Dhulipala's argument; historians weigh it differently", 1, 0.4, w=820),
], [
    L("That some leading clerics backed Pakistan is well documented. That they bridged the gap between League politicians and ordinary believers, and so helped win the vote, is Dhulipala's argument."),
    L("Other historians weigh it differently. We will put it to the test in episode eight."),
], pal="smoke"))

# ---------------- chapter 5 ----------------
seq.append(chapter("ch5", 5, "The Great Argument", "Bombay · 1940 – 1946", color=SKY))

seq.append(scene("ambedkar", "void", [
    dossier("da", 330, 360, "B. R. Ambedkar", "constitutional lawyer,\nBombay", "1891 – 1956", 0, 0.6, glasses=True, tag="NEITHER SIDE", tagColor="#6a5a8a"),
    book("tp", 760, 360, "Thoughts on Pakistan", "B. R. Ambedkar", "#3a3a5a", 1, 0.3, w=190, h=250),
    dossier("dj", 1060, 360, "M. A. Jinnah", "constitutional lawyer,\nBombay", "1876 – 1948", 2, 0.6, hat="karakul", tag="PAKISTAN", tagColor="#2f6f5a"),
    cite("Dhulipala, ch. 3; Gandhi-Jinnah talks, Bombay, September 1944", 0, 0.6),
], [
    L("Who set the terms of the debate? Dhulipala's surprising answer is a lawyer from Bombay who belonged neither to the League nor to Congress: B. R. Ambedkar."),
    L("His book, Thoughts on Pakistan, weighed the case for and against with cold precision. When Gandhi and Jinnah met in Bombay in 1944, both cited it as the authority."),
    L("Two constitutional lawyers from Bombay, as the book calls them. Jinnah, who wanted Pakistan. And Ambedkar, who showed India how to argue about it."),
], pal="ink"))

qs = [("scales", "Islamic state or\nliberal democracy?"), ("coin", "Can it pay\nits way?"), ("globe", "Where are\nthe borders?"), ("shield", "Can it defend\nitself?"),
      ("people", "Its Hindu and\nSikh minorities?"), ("home", "Muslims left\nbehind?"), ("plane", "Exchange of\npopulations?"), ("star", "Its place in\nthe world?")]
cards = []
for i, (g, t) in enumerate(qs):
    row, col = divmod(i, 4)
    cards.append({"id": f"q{i}", "type": "card", "x": 205 + col * 290, "y": 220 + row * 250, "w": 250, "h": 200, "glyph": g, "title": t.replace("\n", " "), "color": ["#7a5a3a", "#6a6a3a", "#3a5a6a", "#6a3a3a", "#5a4a6a", "#3a6a5a", "#4a5a6a", "#6a5a2a"][i],
                  "in": 1 if i < 3 else 2, "d": 0.3 + (i if i < 3 else i - 3) * 1.1, "anim": "pop", "sfx": "tick", "vol": 0.5})
seq.append(scene("questions", "void", cards + [cite("Questions as set out in Dhulipala, Introduction", 0, 0.6)], [
    L("Put Ambedkar together with the religious scholars who opposed Pakistan, and you get the questions that filled the newspapers for six years."),
    L("Would Pakistan be an Islamic state, or a Western-style democracy? Could it pay for its government and army? Where exactly would its borders run?"),
    L("Could it defend itself against a far larger India? What of its Hindu and Sikh minorities, and the Muslims left behind? Would populations be exchanged? What would it count for in the world?"),
    L("Questions like these, Dhulipala argues, are what turned a slogan into a programme."),
], pal="ink", cam={"zoom": [1.0, 1.03], "pan": [[0, 0], [0, 0]]}))

seq.append(scene("gandhi", "void", [
    {"id": "h", "type": "doc", "x": 340, "y": 340, "w": 440, "h": 420, "rot": -2, "title": "HARIJAN", "meta": "12 July 1942 · M. K. Gandhi",
     "lines": ["There can be no comparison between", "Pakistan and Andhra separation...", "Pakistan... is a demand for carving", "out of India a portion to be treated", "as a wholly independent", "sovereign State."],
     "cps": 34, "anim": "rise", "sfx": "type", "vol": 0.4, "hl": 5, "hlOn": 0, "keys": {"0": {"hlOn": 1, "d": 6, "t": 0.6}}},
    {"id": "q1", "type": "cquote", "x": 900, "y": 220, "w": 460, "size": 30, "text": "in a nutshell", "by": "Jinnah on Gandhi's description, 1942", "in": 1, "d": 0.3, "anim": "fade"},
    {"id": "q2", "type": "cquote", "x": 900, "y": 450, "w": 460, "size": 26, "text": "mutilated, truncated,\nand moth-eaten", "by": "Jinnah on the Rajagopalachari formula, 1944", "in": 2, "d": 1.4, "anim": "fade"},
    cite("Collected Works of Mahatma Gandhi, vol. 83, p. 78 and p. 120 n. 2; via Dhulipala, Introduction", 0, 0.6),
], [
    L("Even Gandhi sharpened it. In July 1942 he wrote in his paper Harijan that Pakistan was nothing like a new linguistic province. It meant carving out of India a wholly independent, sovereign state."),
    L("Jinnah replied that Gandhi had put the Muslim demand 'in a nutshell'."),
    L("In 1944 the two men argued over maps. Gandhi held to a formula drawn up by C. Rajagopalachari. Jinnah dismissed it as offering a 'mutilated, truncated, and moth-eaten' Pakistan."),
    L("Whatever else Pakistan was by then, it was not vague. The battle lines were being drawn on paper."),
], pal="ink"))

seq.append(scene("cinema", {"kind": "room", "pal": "smoke"}, [
    slate("BOMBAY · 14 APRIL 1946 · 4 P.M. SHOW"),
    {"id": "scr", "type": "shape", "shape": "rect", "x": 640, "y": 270, "w": 640, "h": 330, "round": 2, "color": "#cfc6b0", "anim": "fade"},
    {"id": "map", "type": "samap", "x": 640, "y": 275, "k": 0.55, "nb": 0, "und": 1, "land": "#6a5e48", "anim": "fade", "in": 1, "d": 0.2},
    typer("ttl", 640, 140, "FORTY CRORES", 0, 1.0, size=30, font="bebas", color="#2a241c", ls=8, cursor=False, cps=14),
    {"id": "aud", "type": "figures", "x": 640, "y": 690, "n": 22, "cols": 11, "w": 1100, "rowh": 70, "size": 1.0, "color": "#0e0c09", "anim": "none"},
    {"id": "fx", "type": "particles", "kind": "sparkle", "x": 360, "y": 520, "n": 18, "w": 160, "h": 80, "in": 2, "d": 0.4, "anim": "pop", "sfx": "pop", "out": 3},
    {"id": "cut", "type": "slash", "x": 430, "y": 140, "x2": 850, "y2": 410, "gap": 10, "draw": 0, "in": 2, "d": 5.2, "anim": "none",
     "keys": {"2": {"draw": 1, "d": 5.2, "t": 0.25}}, "sfx": "boom", "vol": 0.8},
    cite("Film India, vol. XII, no. 5, May 1946, quoted in Dhulipala, Introduction", 0, 0.6),
], [
    L("Bombay, the fourteenth of April, 1946. The four o'clock show of a film called Forty Crores: a plea for the unity of India's four hundred million people."),
    L("On screen, Hindu and Muslim heroes gather around a map of India and vow to defend its unity."),
    L("In the audience, League supporters set off firecrackers and stand up shouting. One of them runs to the screen and slashes it across with a six-inch blade."),
    beat(2.6),
], cam={"zoom": [1.0, 1.1], "pan": [[0, 0], [0, -20]]}))

# ---------------- chapter 6 ----------------
seq.append(chapter("ch6", 6, "The Case Against", "Reviews · 2015 – 2018", color=AMBER))

seq.append(scene("critics1", "void", [
    {"id": "q1", "type": "cquote", "x": 640, "y": 190, "w": 700, "size": 30, "text": "a travesty of her argument", "by": "Faisal Devji, 'Young Fogeys', The Wire, 4 October 2015", "in": 1, "d": 0.4, "anim": "fade", "out": 3},
    label("d2", 640, 340, "neglects the League's modernist, Aligarh-shaped politics", 2, 0.3, color="#e8cfa0", size=18),
    label("d3", 640, 390, "and its international context", 2, 2.6, color="#e8cfa0", size=18),
    {"id": "q2", "type": "cquote", "x": 640, "y": 470, "w": 760, "size": 26, "text": "density of its archival knowledge", "by": "Sohaib I. Khan, The Marginalia Review", "in": 3, "d": 0.4, "anim": "fade"},
    cite("F. Devji, The Wire (2015); S. I. Khan, Marginalia Review of Books", 1, 0.6),
], [
    L("A book that overturns a consensus collects critics, and this one did. Here are their strongest points."),
    L("Faisal Devji, an Oxford historian, wrote that the book was so intent on refuting Ayesha Jalal that it produced 'a travesty of her argument'. Jalal, he said, treated partition as one option among several, not as impossible."),
    L("He also argued that reading the movement mainly as religion flattens the League's modernist politics, shaped at Aligarh, and ignores its wider international setting."),
    L("Sohaib Khan, writing in the Marginalia Review, praised the 'density of its archival knowledge', but found its idea of what counts as religious too loose, and its readings of sources too seamless."),
], pal="ember"))
for e in seq[-1]["els"]:
    if e["id"] in ("d2", "d3"):
        e["out"] = 3

seq.append(scene("critics2", "void", [
    label("k1", 640, 150, "Khan: linking the 1940s to today's crises risks making the present look fixed at birth", 0, 0.4, color="#ffb3a8", size=17),
    label("m1", 640, 250, "Mehta: 'among the most important studies' of Pakistan's ideological origins", 1, 0.3, color="#c8f0dd", size=17),
    label("m2", 640, 295, "but missing: Maulana Azad, and Iqbal's Reconstruction of Religious Thought", 1, 4.0, color="#e8cfa0", size=17),
    label("t1", 640, 395, "Talbot, Gilmartin, Minault: a major intervention", 2, 0.3, color="#c8f0dd", size=17),
    label("t2", 640, 440, "the author's own caveat: Punjab and Bengal still need the same study", 2, 4.5, color="#e8cfa0", size=17),
    cite("P. B. Mehta, Indian Express (2015); I. Talbot, JAS (2015); D. Gilmartin, JAS (2015); G. Minault, H-Asia (2015); Dhulipala, Conclusion", 1, 0.6),
], [
    L("Above all, Khan objected to the leap from the 1940s to Pakistan's present. Tying today's crises to the founding vision, he argued, risks making the future look settled at birth."),
    L("Pratap Bhanu Mehta, in the Indian Express, called it among the most important studies of Pakistan's ideological origins, while noting striking absences: Maulana Azad, Congress's leading Muslim, and Iqbal's great work of religious thought."),
    L("Ian Talbot, David Gilmartin and Gail Minault welcomed it as a major intervention. And Dhulipala names his own limit: his evidence comes from a minority province. Punjab and Bengal, where Pakistan was actually built, need the same study."),
], pal="ember"))

seq.append(scene("scorecard", "void", [
    verdict("v1", 340, 220, "Pakistan was argued over loudly\nand in detail in the 1940s.", "strong", "Urdu and English press, pamphlets, meetings", 1, 0.4, w=560),
    verdict("v2", 940, 220, "League leaders and leading clerics\nsold it as an Islamic state.", "partial", "Caveat: Jinnah's public words stayed ambiguous", 2, 0.4, w=560),
    verdict("v3", 340, 470, "Ordinary voters shared the vision;\nit was never a bargaining chip.", "debated", "Jalal, Devji and others disagree", 3, 0.4, w=560),
    verdict("v4", 940, 470, "Pakistan's later crises grow from\nthis founding vision.", "contested", "The book's boldest claim", 4, 0.4, w=560),
], [
    L("So where does the evidence stand? In this series, every big claim gets a label."),
    L("That Pakistan was argued over loudly and in detail in the 1940s, in print and in public meetings: well supported. The newspapers survive."),
    L("That many League leaders and leading clerics sold it as an Islamic state, a new Medina: supported, with the caveat that Jinnah kept his public words ambiguous."),
    L("That ordinary voters shared that vision, and that Jinnah never meant it as a bargaining chip: debated by historians."),
    L("And that Pakistan's later troubles grow from this founding vision: contested. It is the book's boldest claim, and the series will keep testing it."),
], pal="smoke", cam={"zoom": [1.0, 1.02], "pan": [[0, 0], [0, 0]]}))

# ---------------- chapter 7 ----------------
seq.append(chapter("ch7", 7, "Why It Matters Now", "1949 – today", color=RED))

seq.append(scene("now-pk", "void", [
    {"id": "m", "type": "samap", "x": 470, "y": 372, "k": 1.05, "split": 1, "nb": 0.6, "anim": "fade", "pkColor": "#2f6f5a",
     "labels": [{"text": "PAKISTAN", "at": [69.5, 28.6], "size": 18}, {"text": "BANGLADESH", "at": [92.6, 26.9], "size": 12, "o": 0.8}]},
    label("y1", 1000, 200, "1949 · Objectives Resolution", 1, 0.3, color="#ffd08a", size=19),
    label("y1b", 1000, 240, "sovereignty belongs to God", 1, 2.6, color="#e8cfa0", size=16),
    label("y2", 1000, 330, "1971 · the eastern wing becomes Bangladesh", 1, 5.4, color="#ff9a8a", size=17),
    typer("rm", 1000, 450, "Riyasat-e-Madina", 2, 1.4, size=40, font="serif", italic=True, color=GOLD, cursor=False, cps=14),
    label("rm2", 1000, 500, "'a state of Medina': Imran Khan, 2018", 2, 3.2, color="#e8cfa0", size=17),
    cite("Objectives Resolution, Constituent Assembly of Pakistan, 12 March 1949; Imran Khan's speeches from 2018, widely reported", 1, 0.6),
], [
    L("Why tell this story now?"),
    L("Because the argument never ended. In 1949 Pakistan's Constituent Assembly declared that sovereignty belongs to God. In 1971 the eastern wing broke away as Bangladesh. The fight over what Pakistan is for has never stopped."),
    L("In 2018 a prime minister, Imran Khan, came to power promising Riyasat-e-Madina: a state modelled on Medina. The idea from the 1940s had come back, almost word for word."),
], pal="ink"))

seq.append(scene("now-in", "void", [
    typer("pd", 640, 170, "14 AUGUST", 0, 0.5, size=60, font="bebas", color="#ff9a8a", ls=10, cursor=False, cps=10),
    label("pd2", 640, 240, "Partition Horrors Remembrance Day, India, since 2021", 0, 2.0, color="#e8cfa0", size=18),
    label("tn", 640, 340, "the two-nation theory, still argued over", 0, 6.0, color="#b8a888", size=18),
    {"id": "bk", "type": "tome", "x": 640, "y": 490, "w": 150, "h": 200, "title": "Creating a New Medina", "author": "V. Dhulipala", "color": "#5a1a1a", "in": 1, "d": 0.4, "anim": "rise"},
    cite("Government of India notification, August 2021", 0, 0.6),
], [
    L("In India, partition is not history either. Since 2021 the government has marked the fourteenth of August as Partition Horrors Remembrance Day, and the two-nation theory is still invoked in arguments over citizenship and belonging."),
    L("The book was drawn into those arguments too. Some read it as proof that Pakistan was a religious project from the start. Others saw an old quarrel in new clothes."),
    L("And the Muslims of the United Provinces? Some left for Pakistan. Most stayed. Their story, on both sides of the border, is our final episode."),
], pal="smoke"))

seq.append(scene("now-world", "void", [
    {"id": "w", "type": "samap", "view": "wide", "x": 640, "y": 400, "k": 1.25, "split": 1, "nb": 1, "anim": "fade", "lit": 0,
     "cities": [{"name": "Jerusalem", "note": "1948", "left": True}, {"name": "Tehran", "note": "1979"}, {"name": "Baghdad", "note": "2014", "left": True}, {"name": "Lahore", "note": "1947"}],
     "keys": {"1": {"lit": 1, "d": 1.0, "t": 0.8}, "2": {"lit": 4, "d": 2.0, "t": 4}}},
    typer("q", 640, 110, "A refuge, a utopia and a great power, all at once?", 0, 0.8, size=26, font="serif", italic=True, cursor=False, cps=30),
    label("ours", 640, 600, "the comparison with 1979 and 2014 is ours, not the book's", 2, 6.0, color="#b8a888", size=15),
    cite("F. Devji, Muslim Zion: Pakistan as a Political Idea (2013)", 1, 0.6),
], [
    L("Beyond South Asia, the book raises a universal question. What happens when a nation is founded on a promise of faith, and asked to be a refuge, a utopia and a great power all at once?"),
    L("The historian Faisal Devji has compared Pakistan with Israel, another state born at almost the same moment as a homeland for a religious community."),
    L("Others since, from Iran's revolution in 1979 to the self-declared caliphate of 2014, have promised to restore a lost golden polity. That comparison is ours, not the book's. But the 1940s show how such promises are made, and how hard they are to keep."),
], pal="blood"))

seq.append(scene("close", {"kind": "room", "pal": "archive"}, [
    {"id": "table", "type": "seance", "x": 640, "y": 600, "size": 0.95, "anim": "fade", "chair": 1, "keys": {"2": {"smoke": 0.15, "chair": 0.3, "d": 2, "t": 5}}},
    {"id": "q", "type": "cquote", "x": 640, "y": 170, "w": 760, "size": 30, "text": "not insufficiently imagined,\nbut plentifully and with ambition", "by": "Venkat Dhulipala, Creating a New Medina", "anim": "fade", "out": 2},
    cite("Dhulipala, Conclusion", 0, 0.6),
], [
    L("Pakistan, Dhulipala concludes, was 'not insufficiently imagined, but plentifully and with ambition'."),
    L("If he is right, its troubles came not from too little vision, but from the distance between that vision and what any state could deliver."),
    L("In a dark room in 1955, a cigarette burned down on its wire stand. 'It is easier to acquire a country,' the spirit had said. 'It is extremely difficult to retain it.'"),
    beat(3.4, "bell"),
], cam={"zoom": [1.0, 1.1], "pan": [[0, 0], [0, 10]]}))

seq.append(scene("next", "void", [
    typer("nx", 640, 260, "NEXT", 0, 0.2, size=28, font="bebas", color=RED, ls=12, cursor=False, cps=8),
    typer("nt", 640, 340, "Episode 2 · The Broken Coalition", 0, 0.8, size=38, font="serif", weight=700, color=BONE, cursor=False, cps=24),
    typer("ny", 640, 410, "United Provinces · 1937", 0, 2.4, size=20, color="#b8a888", cursor=False),
], [
    L("Next time: 1937. A new constitution, an election in the United Provinces, a Muslim leadership divided, and a partnership with Congress that never came to be."),
], pal="ink"))

credits = [
    "# Based on", "Creating a New Medina: State Power, Islam, and the Quest for Pakistan", "in Late Colonial North India", "by Venkat Dhulipala (Cambridge University Press, 2015)",
    "Narration paraphrases the book. Short quotations are attributed.", "",
    "# Archival sources as cited in the book", "Qaid-i-Azam Papers, British Library (seance record, File 1067)", "Collected Works of Mahatma Gandhi, vol. 83",
    "Indian Annual Register, 1940 · Star of India and The Leader, January 1941", "Film India, May 1946 · U.S. OIR Report 4162.1, August 1946", "",
    "# Scholarship and reviews", "Ayesha Jalal, The Sole Spokesman (1985) · Anita Inder Singh (1987)", "Gyanendra Pandey (2006) · David Gilmartin (1998, 2015)",
    "Christophe Jaffrelot (2002) · Farzana Shaikh (2009) · S. V. R. Nasr (1994)", "Faisal Devji, 'Young Fogeys', The Wire (2015); Muslim Zion (2013)",
    "Sohaib I. Khan, The Marginalia Review · Pratap Bhanu Mehta, Indian Express (2015)", "Ian Talbot, Journal of Asian Studies (2015) · Gail Minault, H-Asia (2015)",
    "Yasmin Khan, The Great Partition (2007)", "",
    "# Maps", "Natural Earth 1:50m (public domain), modern outlines, approximate for the 1940s", "",
    "# Images", "All imagery is original vector illustration.", "Portraits are generic silhouettes, not likenesses.", "Newspapers and documents are reconstructions, not facsimiles.", "",
    "# Voice and music", "Kokoro open-weight TTS (Apache-2.0), blended original voice", "Original score synthesised in numpy: tanpura drone, low strings", "",
    "# Type", "Playfair Display, Bebas Neue (SIL OFL) · Special Elite (Apache-2.0) · Nunito (SIL OFL)", "",
    "LUMEN · original animation · not affiliated with the author or publisher",
]
seq.append({"type": "card", "id": "end", "style": "endx", "title": SERIES, "credits": credits, "dur": 30})

ep = {
    "meta": {"show": "LUMEN", "episode": "E1", "title": "The Séance", "series": SERIES, "format": "documentary", "look": "cinema", "category": CATEGORY,
             "rating": "mature", "content_note": "Discusses the partition of India and its mass violence, and historical rhetoric about minorities. No graphic imagery.",
             "music": "cinema", "narrator": "narrator", "fps": 30, "gap": 0.5, "captions": False, "width": 1280, "height": 720,
             "logline": "Seven years after his death, a seance summons the founder of Pakistan, and he sees 'flashes of evil pictures'. Episode 1 of a ten-part documentary on Venkat Dhulipala's Creating a New Medina: the claim that Pakistan was not a vague accident but a plentifully imagined Islamic state, a new Medina, argued over in the towns of north India, and the critics who disagree.",
             "source": BOOK + "; reviews by F. Devji (The Wire, 2015), S. I. Khan (Marginalia Review), P. B. Mehta (Indian Express, 2015), I. Talbot (JAS, 2015); A. Jalal, The Sole Spokesman (1985).",
             "disclaimer": DISCLAIMER},
    "cast": CAST,
    "sequence": seq,
}

if __name__ == "__main__":
    write(SLUG, ep)
