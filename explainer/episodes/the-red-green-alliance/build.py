#!/usr/bin/env python3
"""Writes episode.json for LUMEN Investigation 1, "The Red-Green Alliance". Edit here, then rerun.
Usage: python3 explainer/episodes/the-red-green-alliance/build.py"""
import json, os

RED, GREEN, AMBER, SKY, MINT, PINK, GOLD, LILAC = "#ff5a5a", "#3fcf8e", "#ffb347", "#5ec8e5", "#7bdc8c", "#ff8fab", "#ffd166", "#c792ea"


def cite(text, d=0.8, i=0):
    return {"id": "src", "type": "cite", "x": 640, "y": 690, "text": text, "in": i, "d": d, "anim": "fade"}


def stamp(id, kind, x, y, i=0, d=0.4, out=None, **kw):
    e = {"id": id, "type": "stamp", "kind": kind, "x": x, "y": y, "in": i, "d": d, "anim": "none", "sfx": "thump", "vol": 0.35, **kw}
    if out is not None:
        e["out"] = out
    return e


def lab(id, text, x, y, color=GOLD, i=0, d=0.4, **kw):
    return {"id": id, "type": "label", "x": x, "y": y, "text": text, "color": color, "in": i, "d": d, **kw}


def scene(id, bg, pal, els, lines, zoom=(1.0, 1.05), pan=((0, 0), (14, -6))):
    return {"type": "scene", "id": id, "bg": {"kind": bg, "pal": pal}, "cam": {"zoom": list(zoom), "pan": [list(pan[0]), list(pan[1])]}, "els": els, "lines": lines}


def chapter(n, title, glyph, color):
    return {"type": "card", "id": f"ch{n}", "style": "chapter", "kicker": f"Part {n}", "title": title, "glyph": glyph, "color": color, "dur": 3.4, "sfx": "chime"}


def L(text, say=None, **kw):
    d = {"text": text, **kw}
    if say:
        d["say"] = say
    return d


def beat(dur=1.4, sfx="whoosh"):
    return {"text": "", "dur": dur, "sfx": sfx}


seq = []

# ---------------- cold open ----------------
seq.append(scene("open-colours", "space", "midnight", [
    {"id": "v", "type": "venn", "x": 640, "y": 360, "r": 160, "join": 0, "left": "RED", "right": "GREEN", "mid": "?", "size": 34, "anim": "fade",
     "keys": {"1": {"join": 0.9, "d": 0.6, "t": 3.0}}},
    lab("l1", "the socialist and Marxist left", 300, 130, RED, i=0, d=2.4, fg="#fff"),
    lab("l2", "Islamism: political Islam", 980, 130, GREEN, i=0, d=4.4, fg="#06251a"),
    {"id": "q", "type": "text", "x": 640, "y": 620, "text": "an alliance, or a label?", "size": 40, "in": 2, "d": 0.4, "sfx": "pop"},
], [
    L("Red is the colour of the revolutionary left. Green is the colour many Islamist movements chose for their flags."),
    L("For decades, some writers have warned that the two are merging, into what they call the Red-Green Alliance."),
    L("In October 2026, as France burned, that phrase was everywhere again. So is it a real coalition, a useful shorthand, or a conspiracy theory?"),
], zoom=(1.08, 1.0)))

seq.append(scene("open-method", "studio", "plum", [
    {"id": "bk", "type": "book", "x": 300, "y": 420, "title": "Woke Army", "author": "Asra Q. Nomani", "color": "#2a6b4f", "anim": "rise"},
    lab("yr", "2023, and Fox News Digital since", 300, 650, GOLD, i=0, d=1.6),
    stamp("s1", "fact", 880, 200, i=1, d=0.6),
    stamp("s2", "reporting", 880, 300, i=1, d=3.4),
    stamp("s3", "analysis", 880, 400, i=2, d=0.4),
    stamp("s4", "disputed", 880, 500, i=2, d=3.6),
], [
    L("The best-known champion of the idea today is the journalist Asra Nomani, author of the 2023 book Woke Army, and now an investigations editor at Fox News Digital.",
      say="The best-known champion of the idea today is the journalist Asra No-mah-nee, author of the twenty twenty-three book Woke Army, and now an investigations editor at Fox News Digital."),
    L("In this episode, every claim gets a stamp. On the record means courts, governments or data confirm it. Her reporting means documents she cites that we could not check ourselves."),
    L("Her analysis means her interpretation of those facts. And disputed means other credible evidence points the other way."),
    beat(1.2),
]))

seq.append({"type": "card", "id": "title", "style": "title", "title": "The Red-Green Alliance", "sub": "What Asra Nomani alleges, and what the record shows", "glyph": "chain", "color": "#3fcf8e", "dur": 5.5, "sfx": "swell"})

# ---------------- part 1: the reporter ----------------
seq.append(chapter(1, "The Reporter", "eye", SKY))
seq.append(scene("reporter", "city", "midnight", [
    {"id": "tl", "type": "tline", "x": 640, "y": 380, "w": 860, "shown": 0, "anim": "fade",
     "events": [{"year": "1965", "text": "born in Bombay,\nraised in West Virginia", "color": SKY},
                {"year": "2002", "text": "colleague Daniel Pearl\nkidnapped and killed", "color": PINK},
                {"year": "2005", "text": "helps organise a\nwoman-led mixed prayer", "color": MINT},
                {"year": "2016", "text": "says she voted\nfor Donald Trump", "color": AMBER},
                {"year": "2023", "text": "publishes\nWoke Army", "color": GREEN}],
     "keys": {"0": {"shown": 1, "d": 1.0, "t": 1.0}, "1": {"shown": 2, "d": 0.6, "t": 1.0}, "2": {"shown": 3, "d": 0.6, "t": 1.0}, "3": {"shown": 5, "d": 0.6, "t": 2.0}}},
    stamp("sf", "fact", 640, 140, i=1, d=1.0),
    cite("Wikipedia biography; Washington Post; CNN, 11 Nov 2016"),
], [
    L("Nomani was born in Bombay in 1965 and grew up in Morgantown, West Virginia, the daughter of a university professor.",
      say="No-mah-nee was born in Bombay in nineteen sixty-five and grew up in Morgantown, West Virginia, the daughter of a university professor."),
    L("As a Wall Street Journal reporter, she was hosting her colleague Daniel Pearl in Karachi in 2002 when Islamist militants kidnapped and murdered him."),
    L("She then fought her own mosque for women's right to pray in the main hall, and in 2005 helped organise a mixed-gender prayer led by a woman."),
    L("She is also openly political. She said on CNN in 2016 that she voted for Donald Trump, and she has campaigned against critical race theory in schools."),
]))
seq.append(scene("reporter-why", "studio", "teal", [
    {"id": "p", "type": "pebble", "x": 640, "y": 560, "size": 1.0, "color": GOLD, "mood": "calm", "anim": "rise"},
    lab("a", "a Muslim reformer", 360, 260, MINT, i=0, d=1.2),
    lab("b", "a critic of Islamism", 920, 260, SKY, i=0, d=3.2),
    lab("c", "a partisan voice", 640, 170, AMBER, i=1, d=0.6),
    lab("d", "both matter when you weigh her work", 640, 660, "#fff6e6", i=1, d=4.0),
], [
    L("So she writes as a Muslim who has spent twenty years arguing that Islamism, the political movement, is a different thing from Islam, the faith."),
    L("And she writes from the right of American politics. Both are worth keeping in mind as we look at what she claims."),
]))

# ---------------- part 2: where the words come from ----------------
seq.append(chapter(2, "Where the Words Come From", "book", AMBER))
seq.append(scene("words-iran", "land", "dusk", [
    {"id": "v", "type": "venn", "x": 640, "y": 330, "r": 140, "join": 1, "left": "Tudeh,\nFedaian", "right": "Khomeini", "mid": "vs Shah", "size": 26, "anim": "pop",
     "keys": {"2": {"join": 0, "d": 0.4, "t": 2.5}}},
    lab("y", "Iran, 1978 to 1979", 640, 90, GOLD),
    lab("ban", "1983: Tudeh party banned", 360, 560, PINK, i=2, d=2.8),
    lab("ex", "1988: thousands of prisoners executed", 920, 560, RED, i=3, d=0.4, fg="#fff"),
    stamp("s", "fact", 640, 640, i=3, d=3.0),
    cite("Amnesty International; Ervand Abrahamian, Tortured Confessions (1999)"),
], [
    L("The modern story usually starts in Iran. In 1978, the Shah's regime blamed unrest on what it called Islamo-Marxists."),
    L("And in the revolution that followed, communist and leftist parties really did march alongside Ayatollah Khomeini's followers against the Shah.",
      say="And in the revolution that followed, communist and leftist parties really did march alongside Ayatollah Ho-may-nee's followers against the Shah."),
    L("Once the Islamists held power, they turned on their allies. The communist Tudeh party was banned in 1983.", say="Once the Islamists held power, they turned on their allies. The communist Too-deh party was banned in nineteen eighty-three."),
    L("In 1988, thousands of political prisoners, many of them leftists, were executed. Critics of today's alliance point to this as the cautionary tale."),
]))
seq.append(scene("words-europe", "city", "plum", [
    {"id": "tl", "type": "tline", "x": 640, "y": 360, "w": 840, "shown": 0, "anim": "fade",
     "events": [{"year": "1994", "text": "UK socialist Chris Harman:\nwork with Islamists sometimes", "color": RED},
                {"year": "2002", "text": "France: Taguieff uses\n'islamo-gauchisme'", "color": SKY},
                {"year": "2004", "text": "UK: Respect party, socialists\nand Muslim activists", "color": GREEN},
                {"year": "2005", "text": "George Galloway wins\na London seat for Respect", "color": GOLD}],
     "keys": {"0": {"shown": 1, "d": 0.6, "t": 1.0}, "1": {"shown": 2, "d": 0.6, "t": 1.0}, "2": {"shown": 4, "d": 0.6, "t": 2.4}}},
    stamp("s", "fact", 640, 600, i=2, d=4.0),
    cite("C. Harman, The Prophet and the Proletariat (1994); P.-A. Taguieff (2002); UK election results 2005"),
], [
    L("In Britain in 1994, the socialist writer Chris Harman argued that the left should stand with Islamists sometimes, and with the state never."),
    L("In France, the philosopher Pierre-André Taguieff used the word islamo-gauchisme, Islamo-leftism, in 2002, and it spread.",
      say="In France, the philosopher Pierre-André Ta-gyeff used the word eez-lah-mo go-sheez-muh, Islamo-leftism, in two thousand and two, and it spread."),
    L("And in 2004, British socialists and Muslim activists formed a real party, Respect. A year later, George Galloway won a London seat in Parliament for it."),
]))
seq.append(scene("words-not", "studio", "midnight", [
    {"id": "c1", "type": "card", "x": 380, "y": 330, "w": 380, "h": 220, "glyph": "leaf", "title": "Denmark's Red-Green Alliance", "color": MINT, "anim": "pop"},
    lab("c1l", "socialists plus environmentalists", 380, 490, MINT, i=0, d=2.0, fg="#06251a"),
    {"id": "c2", "type": "card", "x": 900, "y": 330, "w": 380, "h": 220, "glyph": "chain", "title": "Nomani's Red-Green Alliance", "color": AMBER, "in": 1, "d": 0.4},
    lab("c2l", "the hard left plus Islamists", 900, 490, AMBER, i=1, d=1.4),
], [
    L("One warning about the name. Denmark has a real party called the Red-Green Alliance. Its green means the environment. It has nothing to do with this story."),
    L("In this episode, red-green means what Nomani means: the hard left working with Islamist organisations."),
]))

# ---------------- part 3: Nomani's case ----------------
seq.append(chapter(3, "Nomani's Case", "folder", GREEN))
NODES = [
    {"name": "CAIR", "u": -330, "v": -150, "color": GREEN},
    {"name": "Students for Justice in Palestine", "u": -420, "v": 40, "color": GREEN, "fs": 16},
    {"name": "American Muslims for Palestine", "u": -230, "v": 170, "color": GREEN, "fs": 16},
    {"name": "Black Lives Matter", "u": 260, "v": -170, "color": RED},
    {"name": "Code Pink", "u": 420, "v": 20, "color": RED},
    {"name": "People's Forum", "u": 250, "v": 170, "color": RED},
    {"name": "Open Society", "u": 0, "v": -40, "color": GOLD, "r": 30},
    {"name": "Qatar", "u": -40, "v": 200, "color": GOLD, "r": 26},
]
EDGES = [[0, 1, "dash"], [1, 2, "dash"], [0, 3, "dash"], [3, 4, "dash"], [4, 5, "solid"], [6, 0, "solid"], [6, 3, "dash"], [7, 2, "dash"], [2, 5, "dash"], [1, 5, "dash"]]
seq.append(scene("case-thesis", "deep", "midnight", [
    {"id": "w", "type": "web", "x": 640, "y": 360, "nodes": NODES, "edges": EDGES, "shown": 0, "draw": 0, "anim": "none",
     "keys": {"0": {"shown": 3, "d": 0.8, "t": 2.0}, "1": {"shown": 6, "d": 0.4, "t": 2.0}, "2": {"shown": 8, "d": 0.4, "t": 1.4}, "3": {"draw": 1, "d": 0.4, "t": 4.0}}},
    stamp("s", "analysis", 1080, 650, i=3, d=1.0),
    cite("A. Nomani, Woke Army (2023); Middle East Forum talk, March 2023"),
], [
    L("Here is her argument, in her own framing. On one side are Islamist-leaning groups she names, like CAIR, the Council on American-Islamic Relations, and campus groups for Palestine.",
      say="Here is her argument, in her own framing. On one side are Islamist-leaning groups she names, like Care, the Council on American-Islamic Relations, and campus groups for Palestine."),
    L("On the other are groups of the hard left: parts of Black Lives Matter, the anti-war group Code Pink, and a Marxist hub in New York, the People's Forum."),
    L("Behind them, she says, is money: from progressive foundations like Open Society, and from abroad, especially the state of Qatar.", say="Behind them, she says, is money: from progressive foundations like Open Society, and from abroad, especially the state of Kah-tar."),
    L("She argues they act as one army: using the language of civil rights to shield Islamism from criticism, to smear critics, and to push anti-Israel and anti-American politics."),
]))
seq.append(scene("case-personal", "studio", "plum", [
    {"id": "ph", "type": "card", "x": 300, "y": 360, "w": 300, "h": 220, "glyph": "gavel", "title": "a defamation suit", "color": SKY, "anim": "rise"},
    lab("lw", "an anonymous blog calls her an 'Islamophobe'", 820, 210, PINK, i=0, d=0.6),
    lab("sub", "she sues; a subpoena traces the account", 820, 290, SKY, i=1, d=0.4),
    lab("cair", "to a staffer at CAIR's Chicago office, she says", 820, 370, AMBER, i=1, d=3.4),
    stamp("s", "reporting", 820, 480, i=1, d=5.0),
    lab("no", "we found no court ruling on it", 820, 580, "#e6ebff", i=2, d=1.0),
    cite("Nomani, Middle East Forum talk (March 2023); Woke Army, ch. on LoonWatch"),
], [
    L("Part of her case is personal. An anonymous website branded her an Islamophobe and falsely claimed Israel funded her."),
    L("She sued for defamation, and says a subpoena to the web host traced the site to a researcher at CAIR's Chicago chapter."),
    L("Those records are in her book. We could not find a court ruling that tested them, so they carry the reporting stamp, not the record stamp."),
]))
seq.append(scene("case-money", "city", "ember", [
    {"id": "st", "type": "stat", "x": 400, "y": 250, "value": 0, "prefix": "$", "suffix": " million", "size": 72, "color": GOLD, "label": "2008 campaign by Open Society and Atlantic Philanthropies",
     "anim": "pop", "keys": {"0": {"value": 20, "d": 1.4, "t": 1.6}}},
    stamp("s1", "reporting", 400, 420, i=0, d=4.0),
    lab("goal", "aim: challenge post-9/11 counter-terror policies", 400, 560, SKY, i=1, d=0.6),
    {"id": "dm", "type": "icon", "x": 960, "y": 300, "r": 70, "glyph": "ballot", "color": GREEN, "label": "a 20-year 'takeover'", "in": 2, "d": 0.4},
    lab("mam", "ending with Mayor Zohran Mamdani, she argues", 960, 470, AMBER, i=2, d=3.6),
    stamp("s2", "analysis", 960, 560, i=3, d=0.6),
    cite("Nomani, Fox News Opinion, 29 June 2025; Open Society grant records as cited there"),
], [
    L("In a long Fox News piece in June 2025, she traced grant records back to 2008, when Open Society and another foundation pledged at least twenty million dollars."),
    L("It was called the National Security and Human Rights Campaign, and, as she reports, it backed challenges to post-9/11 counter-terror policies the funders saw as violating civil liberties."),
    L("She argues that this money built a twenty-year campaign that captured the Democratic Party, ending with Zohran Mamdani's run for mayor of New York.",
      say="She argues that this money built a twenty-year campaign that captured the Democratic Party, ending with Zohran Mam-dah-nee's run for mayor of New York."),
    L("The grants are documented. Calling them a takeover is her interpretation. Funding civil liberties work is legal, and Mamdani won his primary, and later the mayoralty, at the ballot box."),
]))
seq.append(scene("case-france", "city", "ember", [
    {"id": "map", "type": "hexmap", "x": 340, "y": 380, "r": 200, "n": 60, "spread": 0, "anim": "pop", "keys": {"0": {"spread": 1, "d": 0.6, "t": 3}}},
    {"id": "n50", "type": "stat", "x": 900, "y": 220, "value": 0, "size": 80, "color": AMBER, "label": "groups mapped in 'Chaos Inc.'", "anim": "pop", "keys": {"0": {"value": 50, "d": 1.2, "t": 1.4}}},
    lab("how", "built from likes, shares and statements", 900, 400, SKY, i=1, d=0.4),
    lab("no", "no money traced to the French groups", 900, 470, PINK, i=1, d=3.4),
    stamp("s", "disputed", 900, 580, i=2, d=0.6),
    cite("Nomani, Fox News Digital, 9 Oct 2026; see LUMEN: Who Burned France?"),
], [
    L("This October she applied the frame to France's riots, mapping fifty groups, from French unions to an American outlet funded by the tech millionaire Neville Roy Singham."),
    L("Her map was built largely from social media likes, shares and public statements. The article did not trace any money to the French groups themselves."),
    L("French officials blamed the ultra-left. They did not describe an Islamist alliance. Our episode Who Burned France covers that evidence in detail."),
]))

# ---------------- part 4: what the record shows ----------------
seq.append(chapter(4, "What the Record Shows", "gavel", MINT))
seq.append(scene("record-cair", "studio", "midnight", [
    {"id": "tl", "type": "tline", "x": 640, "y": 330, "w": 880, "shown": 0, "anim": "fade",
     "events": [{"year": "2007", "text": "named an unindicted\nco-conspirator", "color": AMBER},
                {"year": "2008", "text": "Hamas-funding charity\nleaders convicted", "color": RED},
                {"year": "2009", "text": "judge: 'ample evidence'\nof association", "color": GOLD},
                {"year": "2010", "text": "appeals court: naming\nthem publicly was wrong", "color": SKY},
                {"year": "never", "text": "CAIR itself\ncharged", "color": MINT}],
     "keys": {"0": {"shown": 2, "d": 0.6, "t": 2.0}, "1": {"shown": 4, "d": 0.6, "t": 2.0}, "2": {"shown": 5, "d": 0.6, "t": 1.0}}},
    stamp("s", "fact", 640, 590, i=2, d=3.0),
    cite("US v. Holy Land Foundation (N.D. Tex.); Judge J. Solis order (2009, unsealed 2010); JTA"),
], [
    L("Now the record. In 2007, prosecutors in the trial of the Holy Land Foundation, a charity later convicted of funding Hamas, listed CAIR as an unindicted co-conspirator."),
    L("In 2009 the judge found ample evidence linking CAIR to the charity and to Hamas. But the appeals court agreed that naming the groups publicly, without charges, had been wrong."),
    L("CAIR has never been charged with a crime. The FBI ended its formal outreach with the group in 2008."),
]))
seq.append(scene("record-designations", "city", "midnight", [
    {"id": "k1", "type": "card", "x": 250, "y": 260, "w": 300, "h": 190, "glyph": "globe", "title": "UAE terror list, 2014", "color": AMBER, "anim": "pop", "sfx": "pop"},
    {"id": "k2", "type": "card", "x": 640, "y": 260, "w": 300, "h": 190, "glyph": "gavel", "title": "Texas, Nov 2025", "color": RED, "in": 1, "d": 0.4, "sfx": "pop"},
    lab("k2l", "CAIR sued; unresolved", 640, 400, PINK, i=1, d=3.6),
    {"id": "k3", "type": "card", "x": 1030, "y": 260, "w": 300, "h": 190, "glyph": "shield", "title": "US, 13 Jan 2026", "color": SKY, "in": 2, "d": 0.4, "sfx": "pop"},
    lab("k3l", "three Brotherhood branches listed", 1030, 400, SKY, i=2, d=3.0),
    lab("nf", "CAIR: not federally designated", 640, 520, MINT, i=3, d=0.4, fg="#06251a"),
    stamp("s", "fact", 640, 610, i=3, d=2.0),
    cite("UAE cabinet list (2014); Gov. Abbott proclamation; W.D. Tex. order, May 2026; US State and Treasury, 13 Jan 2026"),
], [
    L("Governments have since gone further. The United Arab Emirates put CAIR on a terrorism list in 2014. CAIR rejected the listing."),
    L("In November 2025, Texas Governor Greg Abbott designated CAIR and the Muslim Brotherhood as terrorist organisations under state law. CAIR sued. At the last ruling we found, in May 2026, the case was still unresolved."),
    L("In January 2026, the U.S. government designated three national branches of the Muslim Brotherhood, in Egypt, Jordan and Lebanon, citing support for Hamas."),
    L("But as of today, CAIR has not been designated by the federal government. It describes itself as a civil rights group and calls the Texas label defamatory."),
]))
seq.append(scene("record-qatar", "studio", "dusk", [
    {"id": "b", "type": "bars", "x": 640, "y": 380, "w": 820, "h": 300, "max": 7, "dp": 1, "unit": "bn", "title": "Foreign gifts and contracts to U.S. universities, $ billions",
     "values": [6.6, 4.4, 4.3, 4.1], "labels": ["Qatar", "Germany", "England", "China"], "colors": [GOLD, SKY, LILAC, PINK], "anim": "fade"},
    lab("bc", "much of it pays for branch campuses in Doha", 640, 120, AMBER, i=2, d=0.4),
    stamp("s1", "fact", 400, 630, i=1, d=0.6),
    stamp("s2", "analysis", 880, 630, i=3, d=0.8, text="EFFECT: CONTESTED", color=PINK),
    cite("US Education Department foreign-gift portal, via Algemeiner, 8 Jan 2026"),
], [
    L("The money claims are partly on the record too. Qatar is the largest foreign funder of American universities in the Education Department's own disclosure database.", say="The money claims are partly on the record too. Kah-tar is the largest foreign funder of American universities in the Education Department's own disclosure database."),
    L("About six point six billion dollars, ahead of Germany, England and China."),
    L("But much of that pays for branch campuses that Cornell, Carnegie Mellon, Texas A and M and Georgetown run in Doha."),
    L("Whether Qatari money shapes what is taught or protested in America is argued, but not proven. Studies claiming a link come mostly from advocacy groups."),
]))
seq.append(scene("record-singham", "city", "plum", [
    {"id": "st", "type": "stat", "x": 400, "y": 260, "value": 0, "prefix": "$", "suffix": "M+", "size": 88, "color": GOLD, "label": "to the People's Forum, say lawmakers",
     "anim": "pop", "keys": {"1": {"value": 20, "d": 0.6, "t": 1.6}}},
    lab("nyt", "New York Times investigation, 2023", 400, 120, SKY),
    lab("hr", "House hearing, 10 Feb 2026", 400, 430, LILAC, i=1, d=0.4),
    {"id": "ic", "type": "icon", "x": 940, "y": 300, "r": 80, "glyph": "globe", "color": RED, "label": "echoes Beijing's line", "in": 0, "d": 4.0},
    stamp("s1", "fact", 940, 470, i=2, d=0.4, text="FUNDING: ON THE RECORD", color=MINT),
    stamp("s2", "analysis", 940, 550, i=2, d=2.6, text="ISLAMIST LINK: HER FRAME", color=AMBER),
    cite("New York Times (Aug 2023); House Ways and Means hearing, 10 Feb 2026, via Fox News"),
], [
    L("On the red side, one funder is well documented. In 2023 the New York Times reported that Neville Roy Singham, an American tech millionaire living in Shanghai, funds a web of left-wing groups that echo Chinese government talking points."),
    L("At a House hearing in February 2026, lawmakers said more than twenty million dollars had reached the People's Forum. Singham did not respond to questions."),
    L("That money is real. But it is a story about the communist left and China. Tying it to Islamist groups is Nomani's framing, not something the funding records show."),
]))
seq.append(scene("record-together", "city", "ember", [
    {"id": "cr", "type": "crowd", "x": 640, "y": 600, "n": 24, "cols": 12, "w": 900, "rowh": 60, "size": 0.45, "colors": [RED, GREEN, GOLD, SKY, PINK, LILAC], "mood": "neutral", "anim": "rise"},
    lab("a", "post-7 October marches: left and Muslim groups together", 640, 130, GOLD),
    lab("b", "SJP chapters suspended at several universities, 2023", 640, 210, PINK, i=1, d=0.4),
    stamp("s", "fact", 640, 320, i=1, d=3.4),
], [
    L("And the cooperation itself is real. After the Hamas attack of the seventh of October 2023, socialist groups, Muslim groups and Jewish anti-Zionist groups marched together across America."),
    L("Several universities suspended Students for Justice in Palestine chapters that year, citing rule breaches or support for Hamas. Coalitions on the street are on the record."),
]))

# ---------------- part 5: the case against ----------------
seq.append(chapter(5, "The Case Against", "scales", PINK))
seq.append(scene("against-bloc", "studio", "teal", [
    {"id": "g", "type": "gbars", "x": 640, "y": 380, "w": 760, "h": 300, "max": 100,
     "groups": [{"label": "Muslim Americans", "vals": [55]}, {"label": "Republicans", "vals": [47]}, {"label": "Democrats", "vals": [13]}],
     "series": [{"name": "say homosexuality should be discouraged", "color": PINK}], "grow": 0, "anim": "fade", "keys": {"1": {"grow": 1, "d": 0.4, "t": 2.0}}},
    lab("pid", "Muslims: 53% lean Democrat, 42% Republican", 640, 110, SKY),
    stamp("s", "fact", 1090, 220, i=2, d=0.4),
    cite("Pew Research Center, Religious Landscape Study 2023-24 (273 Muslim respondents, margin +/- 8.3 pts)"),
], [
    L("The first objection: Muslims are not a political bloc. Pew's latest survey finds 53 percent of Muslim Americans lean Democrat, and 42 percent lean Republican."),
    L("On social issues they are often to the right of both parties. Fifty-five percent say society should discourage homosexuality, compared with thirteen percent of Democrats."),
    L("That is a small sample, so treat the exact numbers with care. But it is hard to merge with a movement that disagrees with you on that much."),
]))
seq.append(scene("against-michigan", "studio", "teal", [
    {"id": "b", "type": "bars", "x": 420, "y": 400, "w": 520, "h": 260, "max": 50, "unit": "%", "title": "Dearborn, Michigan, 2024", "values": [42, 36, 18],
     "labels": ["Trump", "Harris", "Stein"], "colors": [RED, SKY, MINT], "anim": "fade"},
    {"id": "ic", "type": "icon", "x": 990, "y": 300, "r": 74, "glyph": "building", "color": LILAC, "label": "Hamtramck, June 2023", "in": 1, "d": 0.4},
    lab("pf", "all-Muslim council bans Pride flags", 990, 470, PINK, i=1, d=2.4),
    stamp("s", "fact", 640, 640, i=2, d=0.4),
    cite("Dearborn unofficial results via WDET, 6 Nov 2024; Michigan Advance, 14 June 2023", d=0.8),
], [
    L("In 2024, Dearborn, Michigan, the most Arab-American city in the country, voted for Donald Trump. Harris came second."),
    L("Next door in Hamtramck, the first all-Muslim city council in America voted to ban Pride flags from city property. That is not how an alliance with the progressive left behaves.",
      say="Next door in Ham-tram-ick, the first all-Muslim city council in America voted to ban Pride flags from city property. That is not how an alliance with the progressive left behaves."),
    L("Nomani herself admits the limits. In June 2026 she noted that Islamist rallies draw a few hundred people, out of millions of American Muslims."),
]))
seq.append(scene("against-france", "space", "plum", [
    {"id": "q", "type": "quote", "x": 640, "y": 230, "text": "does not correspond to\nany scientific reality", "by": "CNRS, France's national research centre, Feb 2021", "color": PINK, "anim": "pop"},
    lab("cp", "university presidents: a 'pseudo-notion'", 640, 420, SKY, i=1, d=0.4),
    lab("tw", "online, used mostly by far-right accounts", 640, 500, AMBER, i=2, d=0.4),
    stamp("s", "fact", 640, 610, i=2, d=3.0, text="THE CRITIQUE: ON THE RECORD", color=MINT),
    cite("CNRS statement, 17 Feb 2021; Conference des presidents d'universite; D. Chavalarias et al., CNRS"),
], [
    L("The second objection is about the label itself. When France's government ordered an inquiry into Islamo-leftism in universities in 2021, its own national research centre refused the premise."),
    L("It said the term does not correspond to any scientific reality. University presidents called it a pseudo-notion."),
    L("A study of French political tweets found the word was used mostly by far-right accounts, against the mainstream left. Critics compare it to older smears that cast an enemy as a hidden fusion."),
]))
seq.append(scene("against-method", "deep", "midnight", [
    {"id": "w", "type": "web", "x": 640, "y": 330, "nodes": NODES, "edges": EDGES, "draw": 1, "anim": "fade"},
    lab("k1", "solid line: money or partnership on paper", 330, 600, "#e6ebff", i=0, d=1.0),
    lab("k2", "dashed line: shared causes, likes, events", 950, 600, AMBER, i=0, d=3.0),
    lab("q", "a link is not a command", 640, 80, PINK, i=1, d=0.6),
    stamp("s", "disputed", 640, 160, i=2, d=0.4, text="'ONE ARMY': DISPUTED"),
], [
    L("The third objection is about method. Look again at her map. Only a few links are money or formal partnerships on paper. Most are shared causes, joint events and social media activity."),
    L("Networks like this show who agrees with whom. They do not show who gives orders. Her October article, for example, did not quote the named groups responding."),
    L("Groups can march together on Gaza and still split on almost everything else. That makes the idea of one coordinated army the most disputed part of her case."),
]))

# ---------------- part 6: the verdict ----------------
seq.append(chapter(6, "Weighing It", "scales", GOLD))
rows = [
    ("Islamist and far-left groups cooperate on some causes", "fact"),
    ("CAIR was tied to a Hamas-funding case in court records", "fact"),
    ("Foreign money flows into U.S. campuses and activism", "fact"),
    ("That money steers protests and politics", "analysis"),
    ("A coordinated alliance captured the Democrats", "analysis"),
    ("It was behind France's 2026 riots", "disputed"),
    ("Muslims as a group are part of it", "unsupported"),
]
els = []
for i, (txt, kind) in enumerate(rows):
    y = 110 + i * 78
    li = i // 2
    els.append({"id": f"r{i}", "type": "text", "x": 470, "y": y, "text": txt, "size": 24, "weight": 800, "in": li, "d": 0.3 + (i % 2) * 2.6, "anim": "left"})
    els.append(stamp(f"s{i}", kind, 1060, y, i=li, d=1.0 + (i % 2) * 2.6, size=18))
seq.append(scene("verdict", "studio", "midnight", els, [
    L("So where does that leave the Red-Green Alliance? Cooperation between Islamist groups and the far left is real. So are CAIR's documented ties in the Holy Land case."),
    L("Foreign money into American campuses and activism is real. Whether it steers what happens there, and whether there is one coordinated takeover, is Nomani's analysis."),
    L("Her claim that the alliance drove France's riots is disputed by French officials' own account."),
    L("And the idea that Muslims as a group belong to it is not supported. Nomani herself, a Muslim, rejects it."),
], zoom=(1.0, 1.02)))

# ---------------- outro ----------------
seq.append(scene("toolkit", "space", "teal", [
    {"id": "i1", "type": "icon", "x": 280, "y": 300, "r": 70, "glyph": "coin", "color": GOLD, "label": "Who paid, on paper?", "anim": "pop"},
    {"id": "i2", "type": "icon", "x": 640, "y": 300, "r": 70, "glyph": "chain", "color": SKY, "label": "Payment, partner, or a like?", "in": 1, "d": 0.4},
    {"id": "i3", "type": "icon", "x": 1000, "y": 300, "r": 70, "glyph": "people", "color": MINT, "label": "A group, or a whole faith?", "in": 2, "d": 0.4},
], [
    L("Next time you meet the phrase, three questions help. Who paid whom, and is it on paper?"),
    L("Is the link a payment, a formal partnership, or just a shared hashtag?"),
    L("And is the label describing specific organisations, or quietly widening to a whole religion?"),
]))
seq.append(scene("outro", "land", "dusk", [
    {"id": "v", "type": "venn", "x": 640, "y": 330, "r": 150, "join": 0.9, "left": "Islam", "right": "Islamism", "mid": "", "lc": "#5ec8e5", "rc": "#3fcf8e", "size": 30, "anim": "fade",
     "keys": {"0": {"join": 0.0, "d": 1.0, "t": 3.0}}},
    {"id": "p", "type": "pebble", "x": 640, "y": 600, "size": 0.7, "color": GOLD, "mood": "calm", "in": 1, "d": 0.4, "anim": "rise"},
], [
    L("Asra Nomani has spent two decades insisting that Islamism is not the same thing as Islam. Whatever you make of her alliance, that distinction is worth keeping."),
    L("It is the line that lets us criticise a movement without blaming millions of neighbours for it."),
    beat(2.4, "swell"),
]))
seq.append({"type": "card", "id": "end", "style": "end", "title": "LUMEN", "dur": 9, "credits": [
    "Asra Q. Nomani, Woke Army (2023); Fox News (29 June 2025; 9 Oct 2026); Middle East Forum (2023; June 2026)",
    "US v. Holy Land Foundation records (2009-10) · UAE (2014) · Texas (2025-26) · US State and Treasury (Jan 2026)",
    "US Education Dept foreign-gift portal · New York Times (2023) · House Ways and Means (Feb 2026)",
    "Pew Research Center (2023-24) · WDET · Michigan Advance · CNRS (2021) · Amnesty International",
    "Figures as of 23 October 2026 · Written, animated, voiced and scored with open-source tools",
]})

ep = {
    "meta": {
        "show": "LUMEN", "episode": "Investigation 1", "title": "The Red-Green Alliance", "format": "explainer", "category": "Investigations",
        "rating": "general",
        "content_note": "Discusses terrorism financing cases, political violence in Iran and contested political labels, factually and without graphic imagery.",
        "music": "ambient", "narrator": "narrator",
        "logline": "Is there a 'Red-Green Alliance' of the hard left and Islamists? A sourced investigation of Asra Nomani's case, stamping every claim as on the record, her reporting, her analysis, or disputed.",
        "source": "Asra Q. Nomani, Woke Army (2023) and Fox News (2025-26); US v. Holy Land Foundation; UAE, Texas and US designations; US Education Dept; New York Times; House Ways and Means; Pew Research Center; CNRS. Figures as of 23 October 2026.",
        "disclaimer": "Original animation. Figures as of 23 October 2026. Not affiliated with any channel, outlet or author.",
        "width": 1280, "height": 720, "fps": 30, "gap": 0.42, "captions": False,
    },
    "cast": {"narrator": {"name": "Narrator", "role": "Calm, careful, unflinching guide", "voice": "am_michael:0.6+bm_george:0.4", "speed": 1.0}},
    "sequence": seq,
}
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "episode.json")
json.dump(ep, open(out, "w"), indent=1, ensure_ascii=False)
n = sum(len(s.get("lines", [])) for s in seq)
w = sum(len(l["text"].split()) for s in seq for l in s.get("lines", []))
print(f"wrote {out}: {len(seq)} segments, {n} lines, {w} words")
