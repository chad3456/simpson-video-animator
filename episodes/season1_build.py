#!/usr/bin/env python3
"""Writes episodes/<slug>/episode.json for Kindleton Season 1, episodes 2 to 8.
Lines are compact tuples here so the writers' room can edit dialogue fast; episode.json stays the render contract.
Usage: python3 episodes/season1_build.py"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = "Ideas from 'Suicidal Empathy: Dying to Be Kind' by Gad Saad (2026), plus published criticism of the book (The Bulwark, Quillette)."

CAST = {
    "ken":    {"name": "Ken Brightside", "role": "News anchor whose contractual grin hides a seething void", "voice": "am_michael", "speed": 1.1,
               "look": {"hair": "helmet", "hairColor": "#3b2a1a", "shirt": "#1f3c88", "pants": "#1f3c88", "tie": "#c62828", "smile": True}},
    "mayor":  {"name": "Mayor Marigold Hart", "role": "Feelings-first mayor; if it feels good, it's law", "voice": "af_sarah", "speed": 1.08,
               "look": {"hair": "bouffant", "hairColor": "#e8711c", "shirt": "#d81b60", "pants": "#d81b60", "skirt": True, "sash": "MAYOR", "pearls": True, "lipstick": "#c2185b"}},
    "dale":   {"name": "Dale Doormat", "role": "Dad who physically cannot say no", "voice": "am_puck", "speed": 1.1,
               "look": {"hair": "flop", "hairColor": "#6d4c2f", "shirt": "#7cb342", "vest": "#f9a825", "pants": "#5d4037", "mustache": True, "stubble": True, "height": 1.05}},
    "penny":  {"name": "Penny Doormat", "role": "12-year-old skeptic and the only adult in the house", "voice": "af_nova", "speed": 1.1,
               "look": {"hair": "pigtails", "hairColor": "#8d3b1f", "bow": "#29b6f6", "shirt": "#ab47bc", "pants": "#ab47bc", "skirt": True, "height": 0.74}},
    "bounds": {"name": "Dr. Hal Bounds", "role": "Divorced evolutionary behavioral scientist; carries the book's thesis", "voice": "bm_george", "speed": 1.07,
               "look": {"hair": "bald", "hairColor": "#bdbdbd", "glasses": True, "beard": "#9e9e9e", "shirt": "#8d6e63", "pants": "#4e342e", "bowtie": "#1565c0"}},
    "kindt":  {"name": "Dr. Iris Kindt", "role": "Compassion researcher; carries the critics' counterpoint", "voice": "bf_emma", "speed": 1.08,
               "look": {"hair": "curly", "hairColor": "#2b1b17", "glasses": True, "shirt": "#2e7d32", "pants": "#263238", "skirt": True, "lipstick": "#ad1457", "height": 0.95}},
    "rocco":  {"name": "Rocco", "role": "A raccoon who has never once heard the word no", "kind": "raccoon", "sfx": "chitter"},
    "pam":    {"name": "Principal Pam Pliant", "role": "Principal who has never met a feeling she wouldn't protect from a fact", "voice": "af_jessica", "speed": 1.08,
               "look": {"hair": "ponytail", "hairColor": "#7e57c2", "shirt": "#26c6da", "pants": "#26c6da", "skirt": True, "glasses": True, "lipstick": "#e91e63"}},
    "judge":  {"name": "Judge Rosalind Softheart", "role": "Judge who has never met a criminal she couldn't hug", "voice": "af_nicole", "speed": 1.06,
               "look": {"hair": "bouffant", "hairColor": "#cfd8dc", "shirt": "#212121", "pants": "#212121", "robe": "#212121", "glasses": True, "lipstick": "#b71c1c"}},
    "vinnie": {"name": "Slick Vinnie", "role": "Kindleton's 41-time bike thief", "voice": "am_liam", "speed": 1.1,
               "look": {"hair": "slick", "hairColor": "#212121", "mask": True, "shirt": "#fafafa", "stripes": "#212121", "pants": "#37474f"}},
    "brick":  {"name": "Coach Brick", "role": "Grimsby Grinders coach; plays to win", "voice": "am_onyx", "speed": 1.04,
               "look": {"hair": "cap", "capColor": "#2e3b4e", "capText": "G", "hairColor": "#333", "shirt": "#2e3b4e", "pants": "#9e9e9e", "stubble": True, "height": 1.1}},
    "tiffany":{"name": "Tiffany Virtue", "role": "CEO of Brightside MegaCorp, seller of Guilt Offsets", "voice": "af_bella", "speed": 1.08,
               "look": {"hair": "slick", "hairColor": "#fdd835", "shirt": "#6a1b9a", "pants": "#6a1b9a", "skirt": True, "pearls": True, "lipstick": "#8e24aa"}},
    "chet":   {"name": "Councilman Chet Gatesworth", "role": "Snob Hill councilman with a gate for every belief", "voice": "am_eric", "speed": 1.06,
               "look": {"hair": "slick", "hairColor": "#8d6e63", "shirt": "#263238", "pants": "#263238", "tie": "#ffd600", "smile": True}},
}


def L(who, text, emote="neutral", **kw):
    d = {"who": who, "text": text}
    if emote != "neutral":
        d["emote"] = emote
    d.update(kw)
    return d


def R(text, sfx="chitter", dur=1.4, **kw):  # Rocco
    return dict({"who": "rocco", "text": text, "sfx": sfx, "dur": dur}, **kw)


def scene(sid, bg, chars, lines, **kw):
    return dict({"type": "scene", "id": sid, "bg": bg, "chars": chars, "lines": lines}, **kw)


def card(cid, title, sub="", dur=2.4, sfx="sting"):
    return {"type": "card", "id": cid, "title": title, "sub": sub, "dur": dur, "sfx": sfx}


def title(n, name):
    return card("title", "KINDLETON", f"Episode {n}: “{name}”", 4.2, "theme")


def end(sub="Inspired by ideas in “Suicidal Empathy” by Gad Saad, and by his critics. Parody and commentary for adults. Original characters."):
    return card("end", "Kindness, with a brain.", sub, 6.0, "theme")


# standard blocking
NEWS = {"ken": {"x": 640, "s": 1.05}}
LECTURE = {"bounds": {"x": 760, "s": 1.0, "facing": -1}, "penny": {"x": 1080, "s": 1.0, "facing": -1}}
DEBATE = {"bounds": {"x": 330, "s": 1.0}, "ken": {"x": 640, "s": 0.95}, "kindt": {"x": 950, "s": 1.0, "facing": -1}}
HOME = {"dale": {"x": 520, "s": 1.0}, "penny": {"x": 820, "s": 1.0, "facing": -1}, "rocco": {"x": 300, "s": 1.0}}
COURT_JUDGE = {"x": 640, "y": -40, "s": 0.95}


def news(sid, lines, ticker=None):
    return scene(sid, "newsroom", NEWS, lines, **({"ticker": ticker} if ticker else {}))


def lecture(sid, lines):
    return scene(sid, "chalkboard", LECTURE, lines)


def debate(sid, lines):
    return scene(sid, "tvstudio", DEBATE, lines)


EPISODES = {}

# ---------------------------------------------------------------- E2: Chapter 2, truth suppression
EPISODES["s1e2-justice-involved-raccoon"] = ("S1E2", "Justice-Involved Raccoon",
    "When Kindleton bans hurtful facts and renames every crime, Penny's science fair project gets cancelled for being true, and Dale gets convicted by the internet for a crime nobody can name.",
    "Book chapter 2: epistemological empathy, faulty consequentialism, euphemism treadmills, external attribution.", [
    news("cold-open", [
        L("ken", "Good evening, Kindleton. Tonight's top story has been removed because it was true, and some viewers found that hurtful.", "happy", graphic="[REDACTED]"),
        L("ken", "In its place, here is a picture of a kitten. Please clap. Clap, you animals.", "deadpan", graphic="♥ KITTEN ♥"),
    ], ticker="TRUTH TEMPORARILY SUSPENDED FOR YOUR SAFETY • FACTS NOW SOLD BEHIND THE COUNTER WITH ID • WEATHER: WHATEVER YOU FEEL IT IS"),
    scene("cold-open-square", "townsquare", {"mayor": {"x": 600, "s": 1.0, "enter": "left"}, "penny": {"x": 1050, "s": 0.95, "facing": -1}, "rocco": {"x": 880, "s": 0.9, "facing": -1, "hold": "keys"}}, [
        L("mayor", "Citizens! Words wound. So as of today, Kindleton's new dictionary is mandatory.", "happy", act="armsup", react={"penny": "deadpan"}),
        L("mayor", "Burglars are now surprise house guests. Liars are narrative entrepreneurs. And Rocco is no longer a garbage thief. He is a justice-involved raccoon.", "happy", act="point", cam="wide"),
        R("*proud chitter* (jingles stolen keys)", react={"mayor": "happy", "penny": "angry"}),
        L("penny", "He stole the bike I was sitting on. While I was sitting on it.", "deadpan", act="point"),
        L("mayor", "Penny! That's victim blaming. Of the bike.", "angry", act="point", react={"penny": "shocked"}),
    ], crowd=True, sign="LANGUAGE IS VIOLENCE (SOMETIMES)"),
    title(2, "Justice-Involved Raccoon"),
    scene("act1-fair", "sciencefair", {"pam": {"x": 520, "s": 1.0, "enter": "right"}, "penny": {"x": 820, "s": 1.0, "facing": -1}}, [
        L("pam", "Welcome to the science fair, where every hypothesis is valid and every volcano is a safe space.", "happy", act="armsup", react={"penny": "deadpan"}),
        L("penny", "My project tested the new no-grades policy. Reading scores fell eighty percent. Little Timmy thinks a book is a hat.", "neutral", act="point"),
        L("pam", "Penny, data like that could hurt feelings. So the committee has decided your results are... problematic.", "worried", act="shrug", react={"penny": "shocked"}),
        L("penny", "They're numbers. Numbers can't be problematic.", "angry"),
        L("pam", "That is exactly what a problematic number would say. Your project is being replaced with a poster about kindness.", "smug", act="point", react={"penny": "angry"}),
        L("penny", "You're cancelling arithmetic. You absolute walnut.", "angry", act="facepalm"),
    ], sign="KINDLETON ELEMENTARY SCIENCE FAIR"),
    lecture("act1-lecture", [
        L("bounds", "Epistemological empathy. When protecting feelings matters more than protecting the truth.", "neutral", act="point", board=["EPISTEMOLOGICAL", "EMPATHY", "feelings > facts"]),
        L("bounds", "Saad's big example is Roland Fryer, the youngest Black economist ever tenured at Harvard. In the book's telling, his findings on schools and policing upset the wrong people, and the institution went after the man instead of the data.", "worried", act="shrug", board=["CASE STUDY", "good data", "wrong conclusion", "-> punish the scientist"]),
        L("bounds", "The trick is faulty consequentialism. Free speech, due process, honest journalism. All sacred, right up until they produce an answer you don't like.", "angry", act="point", board=["FAULTY CONSEQUENTIALISM", "principles: sacred*", "*until inconvenient"]),
        L("penny", "So principles are like Dad's diet. Strict, until there's cake.", "deadpan", react={"bounds": "happy"}),
        L("bounds", "And Saad has a name for the place this all leads. Unicornia. The enchanted land of no risks, where every fact is gentle and nobody's bike ever gets nicked.", "happy", act="point", board=["UNICORNIA", "no risks", "no hard facts", "no bikes, oddly"]),
    ]),
    card("act2", "MEANWHILE, IN THE COMMENTS..."),
    news("act2-news", [
        L("ken", "Breaking news. Local man Dale Doormat has been accused online of saying no to a raccoon. Evidence: none. Verdict: guilty. Sentencing is in the comments.", "happy", graphic="GUILTY (PROBABLY)"),
    ]),
    scene("act2-home", "livingroom", HOME, [
        L("dale", "Penny, the internet says I'm a monster! I've never said no to anything! I am the yes-iest man alive!", "shocked", act="armsup", react={"penny": "deadpan"}),
        L("penny", "Dad, in this town presumption of innocence got cancelled in twenty twenty. For being too presumptuous.", "deadpan"),
        L("dale", "Maybe I should apologize.", "worried"),
        L("penny", "For what?", "angry", act="shrug"),
        L("dale", "I don't know! But if I apologize hard enough, eventually they'll tell me.", "sad", act="facepalm"),
        R("*chomp chomp* (eats Dad's apology letter)", "chomp", 1.6, react={"dale": "sad", "penny": "deadpan"}),
    ]),
    scene("act2-mayor", "townsquare", {"mayor": {"x": 640, "s": 1.05}, "chet": {"x": 1000, "s": 1.0, "facing": -1}}, [
        L("mayor", "We have found the true cause of Rocco's garbage addiction. Landlords!", "angry", act="point"),
        L("chet", "Madam Mayor, I own every rental in town.", "worried"),
        L("mayor", "Then you're under arrest, Chet. You and the entire concept of rent.", "angry", act="point", react={"chet": "shocked"}),
        L("chet", "Fine. I'll be at my other mansion. The one with no locks, for some reason.", "smug", act="shrug"),
    ], crowd=True, sign="IT'S NEVER YOUR FAULT"),
    lecture("act2-lecture", [
        L("bounds", "External attribution. Blame the landlord. Never the addiction, the mental illness, or, God forbid, the raccoon. Lovely for your conscience. Useless for the raccoon.", "smug", act="point", board=["EXTERNAL ATTRIBUTION", "addiction? no", "illness? no", "LANDLORD!!"]),
        L("bounds", "Same with the word games. Saad mocks swapping criminal offender for justice-involved individual. The burglar doesn't care what you call him. He's in your kitchen either way.", "angry", act="shrug", board=["EUPHEMISM TREADMILL", "offender", "-> justice-involved", "-> still in your kitchen"]),
        L("bounds", "Saad's favourite fable is the scorpion and the frog. Halfway across the river, the scorpion stings him. Sorry, mate, it's my nature. Kindleton's response is to buy the scorpion arm floaties.", "smug", act="point", board=["SCORPION + FROG", "sting = nature", "Kindleton: floaties"]),
        L("penny", "Rocco is the scorpion, isn't he.", "deadpan", react={"bounds": "worried"}),
    ]),
    card("act3", "HEART vs HEAD", "Tonight: is the truth too dangerous for Kindleton?", 2.6),
    debate("act3-debate", [
        L("ken", "Tonight on Heart versus Head: is the truth too dangerous for Kindleton? Doctors, please keep your hands where I can see them.", "happy", act="armsup", cam="wide"),
        L("kindt", "Hal, research has been weaponized before. Eugenics was just data too. Being careful with findings isn't cowardice, it's history class.", "neutral", act="point", react={"bounds": "worried"}),
        L("bounds", "Agreed, bad science does real damage. The cure is better science, not hiding the results in a drawer and calling the drawer kindness.", "neutral", act="shrug"),
        L("kindt", "And some language changes genuinely help. Call someone a person with an addiction instead of a junkie, and more of them walk into treatment.", "smug", act="point"),
        L("bounds", "Fine. Change the label when it helps the patient. Not when it hides the problem. A surprise house guest still has my telly.", "angry", react={"kindt": "happy"}),
        L("kindt", "So. Say true things, carefully. Don't say false things, kindly.", "happy", act="point"),
        L("bounds", "Bloody hell. Put that on a mug.", "shocked", react={"kindt": "smug"}),
        L("ken", "We're out of time, because the truth ran long. Folks, that has literally never happened on this network.", "shocked", act="armsup", cam="wide"),
    ]),
    scene("act3-fair", "sciencefair", {"pam": {"x": 440, "s": 1.0}, "penny": {"x": 760, "s": 1.0, "facing": -1}}, [
        L("penny", "I'm presenting my real results anyway. Reading scores are down eighty percent. I know it stings. But you can't fix what you won't look at.", "neutral", act="point", react={"pam": "worried"}),
        L("pam", "Penny, that's... actually, could you help Timmy? He's wearing a dictionary.", "worried", act="shrug"),
        L("penny", "Truth is the highest form of empathy. Also, Timmy, it goes in your hands. Not on your head. Hands.", "happy", act="armsup"),
    ], sign="THE TRUTH FAIR (REINSTATED)"),
    news("tag", [
        L("ken", "And finally, the town dictionary has been updated again. The word truth is now officially classified as a controversial opinion. Goodnight, and good luck with that.", "deadpan", graphic="TRUTH*", sub="*opinion"),
    ]),
    end(),
])

# ---------------------------------------------------------------- E3: Chapter 3, cultural theory of mind, the wood cricket
EPISODES["s1e3-hairworm-season"] = ("S1E3", "Hairworm Season",
    "Kindleton assumes its brutal softball rivals secretly want participation trophies too, and Dale starts cheering for the other team so hard he jumps in the town fountain.",
    "Book chapter 3: cultural theory of mind, false equality bias, the wood cricket parasite. Allegory is a sports rivalry; the book's real-world targets are named and argued, not acted out.", [
    news("cold-open", [
        L("ken", "Tonight, Kindleton plays its annual softball game against the Grimsby Grinders. Grimsby has won forty years straight, mostly because we bring orange slices and they bring bats.", "happy", graphic="KINDLETON vs GRIMSBY"),
        L("ken", "Last year's score was eighty-four to nothing, and one of our outfielders is still missing.", "deadpan", graphic="MISSING: GARY"),
    ], ticker="GRIMSBY GRINDERS ARRIVE BY TANK • KINDLETON TEAM ARRIVES BY GROUP HUG • ORANGE SLICES: SLICED"),
    scene("cold-open-square", "townsquare", {"mayor": {"x": 520, "s": 1.0}, "brick": {"x": 900, "s": 1.0, "facing": -1, "enter": "right"}, "penny": {"x": 1140, "s": 0.9, "facing": -1}}, [
        L("mayor", "Grimsby friends! In Kindleton nobody keeps score, everybody gets a trophy, and the losers get a hug!", "happy", act="armsup", react={"brick": "deadpan"}),
        L("brick", "Cute. In Grimsby, the losers get buried under the bleachers.", "smug", react={"penny": "shocked"}),
        L("mayor", "Ha! Such a kidder. Deep down, everybody wants the same things!", "happy", act="point"),
        L("brick", "I want your trophy, your field, and your car.", "deadpan", act="point"),
        L("mayor", "See? Sharing!", "happy", act="bounce", fx="hearts", sfx="sparkle", react={"brick": "smug", "penny": "deadpan"}),
    ], crowd=True, sign="WELCOME GRIMSBY! YOU'RE JUST LIKE US!"),
    title(3, "Hairworm Season"),
    lecture("act1-lecture", [
        L("bounds", "Theory of mind is knowing your mum wants something different than you do. Saad's cultural theory of mind is knowing a whole other group might too.", "neutral", act="point", board=["CULTURAL", "THEORY OF MIND", "they != you"]),
        L("bounds", "Kindleton's error is false equality bias. Assume everyone shares your values, then act shocked when they steal your car.", "smug", act="shrug", board=["FALSE EQUALITY BIAS", "assume: same values", "result: no car"]),
        L("bounds", "Now, the book aims this at immigration and Islam. It cites the British grooming gang scandal, where Saad says officials froze for fear of being called bigots, and the rise in antisemitism after October seventh.", "worried", act="point", board=["THE BOOK'S TARGETS", "immigration", "grooming gangs", "Oct 7"]),
        L("bounds", "That's the chapter his critics hit hardest. We'll let them swing in a minute.", "neutral", act="shrug"),
        L("penny", "And meanwhile, our team is warming up by journaling.", "deadpan", react={"bounds": "worried"}),
    ]),
    card("act2", "PLAY BALL. GENTLY."),
    news("act2-news", [
        L("ken", "Live from the game. Grimsby leads one hundred and twelve to zero. Kindleton's pitcher has paused to ask the batter about his childhood.", "happy", graphic="112 - 0"),
        L("ken", "Correction. The batter has taken the pitcher's lunch money, and his childhood.", "deadpan", graphic="112 - 0"),
    ]),
    scene("act2-home", "livingroom", {"dale": {"x": 520, "s": 1.0}, "penny": {"x": 820, "s": 1.0, "facing": -1}, "rocco": {"x": 300, "s": 1.0}}, [
        L("penny", "Dad. Why are you wearing a Grimsby jersey?", "deadpan", act="point"),
        L("dale", "Cheering for my own town is so problematic, Penny. If I hate us loudly enough, maybe Grimsby will finally like me.", "happy", act="armsup"),
        L("penny", "They tried to bury you under the bleachers.", "angry"),
        L("dale", "And I respect their culture of burying.", "smug", react={"penny": "shocked"}),
        L("penny", "Dad. Grimsby's rulebook says fans like you get fed to the mascot.", "angry", act="point"),
        L("dale", "Then that's the way I was meant to go.", "happy", act="armsup", react={"penny": "shocked"}),
    ]),
    lecture("act2-lecture", [
        L("bounds", "Ah. The wood cricket. A parasitic hairworm takes over the cricket's brain and drives it to leap into water and drown, so the worm can swim off and breed.", "happy", act="point", board=["THE WOOD CRICKET", "worm in brain", "-> jumps in water", "-> worm wins"]),
        L("bounds", "Saad uses it for people who turn on their own group to win applause from the very people who despise it.", "neutral", act="shrug", board=["THE WOOD CRICKET", "self-sabotage", "for applause"]),
        L("bounds", "He quotes a street interview where someone admits the cause she's cheering would put her in danger, and shrugs. Then that's the way I was meant to go. Saad's reaction: that's the hairworm talking.", "worried", act="point", board=["HUMAN WOOD CRICKETS", "\"that's the way", "I was meant to go\""]),
        L("penny", "So my dad's brain has a worm in it.", "worried"),
        L("bounds", "Metaphorically. Possibly literally. Has he been eating out of the bins with Rocco?", "worried", act="shrug", react={"penny": "shocked"}),
    ]),
    news("act2-news2", [
        L("ken", "Breaking. Local man Dale Doormat has jumped into the town fountain to prove how open-minded he is. He's fine. The fountain is traumatized.", "happy", graphic="SPLASH", sfx="crash", fx="shake"),
    ]),
    card("act3", "HEART vs HEAD", "Tonight: are they just like us?", 2.6),
    debate("act3-debate", [
        L("ken", "Tonight on Heart versus Head: are other people just like us? I hope not. Have you met us?", "happy", act="armsup", cam="wide"),
        L("kindt", "Hal, the book takes the worst extremists and paints whole faiths with them. Most immigrants assimilate just fine. Half of them run the shops on your high street.", "angry", act="point", react={"bounds": "worried"}),
        L("bounds", "Most do, absolutely. The point is to notice the ones who don't share your values, instead of pretending nobody like that could exist.", "neutral", act="shrug"),
        L("kindt", "And theory of mind cuts both ways. If you only ever imagine the worst version of the other side, that's not insight. That's a horror movie.", "smug", act="point"),
        L("bounds", "Fair. So judge people by what they actually do, not by your fantasy of them. Good or bad.", "neutral", act="point", react={"kindt": "happy"}),
        L("kindt", "Tit for tat. Not tat for imaginary tit.", "happy"),
        L("ken", "Please do not say that on my network.", "shocked", act="armsup", cam="wide", react={"bounds": "happy", "kindt": "smug"}),
    ]),
    scene("act3-square", "townsquare", {"penny": {"x": 600, "s": 1.0}, "mayor": {"x": 900, "s": 1.0, "facing": -1}}, [
        L("penny", "Team, new rule. We play Grimsby the way Grimsby plays. Hard, fair, and we keep score.", "angry", act="armsup", react={"mayor": "worried"}),
        L("mayor", "But what if they're sad when they lose?", "worried"),
        L("penny", "Then we bring them orange slices. After we win.", "smug", act="point"),
    ], crowd=True, sign="KINDLETON vs GRIMSBY (WE KEEP SCORE NOW)"),
    news("act3-news", [
        L("ken", "Final score. Kindleton three, Grimsby two. Grimsby has demanded a recount and a hug. Kindleton has agreed to the recount.", "happy", graphic="3 - 2 !!!"),
    ]),
    scene("tag", "livingroom", HOME, [
        L("dale", "Penny. I think the worm's gone.", "sad", act="facepalm"),
        R("*smug chitter* (wearing a Grimsby cap)", react={"penny": "shocked", "dale": "shocked"}),
        L("penny", "Oh no. It jumped.", "shocked"),
    ]),
    end(),
])

# ---------------------------------------------------------------- E4: Chapter 4, crime, victims, heroism
EPISODES["s1e4-repeat-offender"] = ("S1E4", "Blank Slate Felons",
    "Kindleton's bike thief walks free for the forty-first time, while Dale stops a robbery and gets sentenced to Masculinity Unlearning.",
    "Book chapter 4: criminals recast as victims, recidivism, pathologizing heroic masculinity.", [
    news("cold-open", [
        L("ken", "Kindleton's beloved bike thief, Slick Vinnie, was arrested today for the forty-first time. He was released for the forty-first time ten minutes later.", "happy", graphic="41 ARRESTS"),
        L("ken", "He has already stolen the judge's bike. And mine. I walked here, folks. In these shoes.", "angry", graphic="41 ARRESTS", cam="close"),
    ], ticker="BIKE THEFTS UP 900% • BIKE THIEF SELF-ESTEEM ALSO UP • BICYCLE OWNERS TOLD TO REFLECT ON THEIR PRIVILEGE"),
    scene("cold-open-court", "courtroom", {"judge": COURT_JUDGE, "vinnie": {"x": 1020, "s": 1.0, "facing": -1}, "penny": {"x": 230, "s": 1.0}}, [
        L("judge", "Mister Vinnie, you've stolen four hundred bicycles.", "worried", react={"vinnie": "sad"}),
        L("vinnie", "Your honor, I had a very difficult childhood. My dad never let me ride his bike.", "sad", act="shrug"),
        L("judge", "Oh, you poor thing. Case dismissed! Here, take my bike.", "happy", act="armsup", react={"penny": "shocked"}),
        L("vinnie", "Thanks, judge. I'll take the bailiff's too.", "smug", act="point"),
        L("penny", "This is the dumbest courtroom on Earth.", "deadpan", act="facepalm"),
        L("judge", "Penny! That's very punitive language. Mister Vinnie is a justice-involved cyclist.", "angry", act="point"),
    ]),
    title(4, "Blank Slate Felons"),
    lecture("act1-lecture", [
        L("bounds", "Saad quotes a grim number. Nearly a third of American male prisoners had been locked up five or more times before.", "worried", act="point", board=["REPEAT OFFENDERS", "1 in 3", "5+ prior stints"]),
        L("bounds", "Treat the offender only as a victim of society, and the actual victims become a footnote. Usually a footnote without a bike.", "angry", act="shrug", board=["REPEAT OFFENDERS", "offender = victim?", "victim = footnote"]),
        L("penny", "Vinnie has a punch card. Steal nine bikes, the tenth is free.", "deadpan", react={"bounds": "shocked"}),
    ]),
    card("act2", "MEANWHILE, A HERO RISES. BRIEFLY."),
    scene("act2-square", "townsquare", {"vinnie": {"x": 520, "s": 1.0, "enter": "left"}, "dale": {"x": 820, "s": 1.0, "facing": -1}}, [
        L("vinnie", "Nice wheelchair, grandpa. I'll take it. With you in it, for resale.", "smug", act="point"),
        L("dale", "Hey! Not today, you slippery little creep!", "angry", act="bounce", sfx="crash", fx="shake", react={"vinnie": "shocked"}),
        L("vinnie", "Ow! He touched me! Somebody call my therapist!", "shocked", act="armsup"),
    ], crowd=True, sign="KINDLETON SAFE STREETS WEEK"),
    news("act2-news", [
        L("ken", "Local hero Dale Doormat, who stopped a robbery today, has been charged with toxic masculinity in the first degree.", "happy", graphic="HERO? ARREST HIM"),
    ]),
    scene("act2-court", "courtroom", {"judge": COURT_JUDGE, "dale": {"x": 1020, "s": 1.0, "facing": -1}}, [
        L("judge", "Mister Doormat, you used your body to stop a crime. That's very aggressive.", "angry", act="point", react={"dale": "shocked"}),
        L("dale", "He was stealing a wheelchair. With a guy in it!", "shocked", act="armsup"),
        L("judge", "I sentence you to six weeks of Masculinity Unlearning. You will cry on cue, apologize to furniture, stop holding doors, because that's benevolent sexism, and never, ever open a jar.", "smug", act="point", react={"dale": "sad"}),
        L("dale", "Not the jars!", "shocked", act="facepalm"),
    ]),
    scene("act2-bar", "bar", {"dale": {"x": 560, "s": 1.0, "hold": "beer"}, "rocco": {"x": 800, "y": -170, "s": 0.95, "facing": -1, "hold": "martini"}}, [
        L("dale", "Three weeks of unlearning, Rocco. I cried at a parking ticket. I apologized to a hedge. The hedge did not accept.", "sad", act="shrug"),
        R("*sympathetic chitter* (steals Dale's wallet)", react={"dale": "sad"}),
    ]),
    lecture("act2-lecture", [
        L("bounds", "Saad's complaint: we used to cheer the man who ran toward danger. Now we pathologize him, and applaud the bloke tweeting a sad face from a safe distance.", "angry", act="point", board=["HEROIC MASCULINITY", "runs toward danger", "-> charged", "tweets sad face", "-> praised"]),
        L("bounds", "His evidence is romance novels. Goodreads has a list called All Time Dominant-Alpha Romance Heroes. There is no list for sensitive betas who cry at Sleepless in Seattle.", "smug", act="shrug", board=["ROMANCE NOVELS", "alpha heroes: 1000s", "crying betas: 0"]),
        L("bounds", "And zoology has a term for the alternative. Kleptogamy. Colloquially, the sneaky fucker. A male who mimics a female to slip past the big fellow and get at the ladies. Saad's point: performing harmlessness is a strategy, not a virtue.", "happy", act="point", board=["KLEPTOGAMY", "a.k.a. the", "SNEAKY F*CKER"]),
        L("penny", "I'm eleven.", "deadpan", react={"bounds": "worried"}),
        L("bounds", "He leans on a real New York subway case, where a Marine restrained a man who was threatening passengers, the man died, and the Marine was charged. It's still argued about bitterly.", "worried", act="shrug", board=["THE SUBWAY CASE", "contested", "argued both ways"]),
    ]),
    card("act3", "HEART vs HEAD", "Tonight: villains, victims and very tired juries", 2.6),
    debate("act3-debate", [
        L("ken", "Tonight on Heart versus Head: who deserves our sympathy, the criminal or the victim? I'm going to say the guy whose bike got stolen. Me. I'm the victim.", "angry", act="armsup", cam="wide"),
        L("kindt", "Hal, the heroic vigilante story has a dark side. Sometimes the hero misjudges the situation, and somebody dies. That subway case is not a cartoon.", "worried", act="point", react={"bounds": "worried"}),
        L("bounds", "True, and courts should look hard at cases like it. But there's a difference between investigate the man who stepped in, and assume he's the villain.", "neutral", act="shrug"),
        L("kindt", "And rehabilitation isn't fluff. Education and job programs inside prison really do cut reoffending.", "smug", act="point"),
        L("bounds", "Agreed! Rehab for people who want it. Consequences for bike number forty-one.", "happy", act="point", react={"kindt": "happy"}),
        L("kindt", "Compassion for offenders. But victims first.", "happy"),
        L("ken", "Programming note: the courthouse sign has just been stolen by Slick Vinnie.", "deadpan", cam="wide", react={"bounds": "shocked", "kindt": "shocked"}),
    ]),
    scene("act3-court", "courtroom", {"judge": COURT_JUDGE, "penny": {"x": 260, "s": 1.0}, "vinnie": {"x": 1020, "s": 1.0, "facing": -1}}, [
        L("penny", "Your honor, my motion is simple. Some empathy for the victims. All four hundred of them.", "neutral", act="point"),
        L("judge", "Hmm. I never considered the bikes' feelings.", "worried"),
        L("penny", "The people, Judge. The people who own the bikes.", "deadpan", act="facepalm"),
        L("judge", "Mister Vinnie, you will repair every bike you stole. And there's a job at the bike shop, if you show up on time.", "neutral", act="point", react={"vinnie": "shocked"}),
        L("vinnie", "A job? Like, with mornings?", "shocked", act="armsup"),
        L("judge", "Tit for tat, sweetie.", "smug", react={"penny": "happy"}),
    ], sign="KINDLETON COURT OF FEELINGS (AND FACTS)"),
    scene("tag", "livingroom", HOME, [
        L("dale", "Penny, look! I opened a jar! I am a man again!", "happy", act="armsup", hold={"dale": "beer"}),
        R("*chomp chomp* (eats the entire jar)", "chomp", 1.6, react={"dale": "sad", "penny": "deadpan"}),
        L("penny", "Rehab is going great.", "deadpan"),
    ]),
    end(),
])

# ---------------------------------------------------------------- E5: Chapter 5, settled science, single-objective optimization
EPISODES["s1e5-settled-science-fair"] = ("S1E5", "The Settled Science Fair",
    "Kindleton declares all science settled, locks itself indoors over one sneeze and bans exhaling, until Penny builds a booth with a big red button that says Prove Me Wrong.",
    "Book chapter 5: Popper and falsifiability, 'settled science', single-objective optimization in pandemic and climate policy.", [
    news("cold-open", [
        L("ken", "Scientists at Kindleton University announced today that all science is now settled. Asking further questions is punishable by a fine and a disappointed look.", "happy", graphic="SCIENCE: DONE"),
        L("ken", "In related news, the university has fired its scientists, since they're no longer needed. One was seen asking why. He has been fined.", "deadpan", graphic="SCIENCE: DONE"),
    ], ticker="ALL QUESTIONS ANSWERED • REMAINING QUESTIONS CONFISCATED • CURIOSITY NOW A CONTROLLED SUBSTANCE"),
    scene("cold-open-fair", "sciencefair", {"pam": {"x": 480, "s": 1.0}, "penny": {"x": 800, "s": 1.0, "facing": -1}}, [
        L("pam", "Welcome to the Settled Science Fair! This year hypotheses are banned. The answers are already on the wall, and you will love them.", "happy", act="armsup", react={"penny": "deadpan"}),
        L("penny", "My hypothesis is that hypotheses should be allowed.", "smug", act="point"),
        L("pam", "Ooh. That's a denier talking. Somebody get the fire extinguisher, she's thinking.", "shocked", act="point", react={"penny": "angry"}),
    ], sign="THE SETTLED SCIENCE FAIR"),
    title(5, "The Settled Science Fair"),
    lecture("act1-lecture", [
        L("bounds", "Karl Popper, philosopher, magnificent eyebrows, said a scientific claim has to be falsifiable. It must be possible to prove it wrong.", "happy", act="point", board=["POPPER", "science = can be", "proven wrong"]),
        L("bounds", "So, says Saad, settled science is anti-science. Science is never settled. It's just currently winning.", "smug", act="shrug", board=["SETTLED SCIENCE?", "never settled", "just winning (for now)"]),
        L("penny", "Like a boxing champ.", "neutral"),
        L("bounds", "A champ who has to let anyone climb into the ring. Including that weirdo with the clipboard.", "happy", act="point"),
    ]),
    card("act2", "OPERATION ZERO SNEEZES"),
    news("act2-news", [
        L("ken", "Mayor Hart has declared Operation Zero Sneezes after a man sneezed near the library. Kindleton is now locked down until germs apologize.", "happy", graphic="STAY INSIDE (FOREVER)"),
    ]),
    scene("act2-home", "livingroom", HOME, [
        L("dale", "Day three hundred. I've named all the furniture. The couch and I are engaged.", "sad", act="shrug", react={"penny": "deadpan"}),
        L("penny", "Dad, the sneeze guy had hay fever.", "deadpan"),
        L("dale", "Doesn't matter. If it saves just one life...", "worried", act="point"),
        L("penny", "Grandpa died of boredom. The dog has a podcast. I learned long division from Rocco.", "angry", act="armsup"),
        R("*professorial chitter* (holds up a sponge like chalk)", hold={"rocco": "sponge"}, react={"dale": "happy"}),
    ]),
    scene("act2-square", "townsquare", {"mayor": {"x": 640, "s": 1.05}}, [
        L("mayor", "And to save the planet, cows are banned, cars are banned, and breathing out is strongly discouraged.", "happy", act="armsup"),
        L("mayor", "We will hit net zero by twenty thirty. Net zero emissions, net zero jobs, net zero fun!", "happy", act="bounce", fx="hearts", sfx="sparkle"),
    ], sign="NET ZERO EVERYTHING"),
    lecture("act2-lecture", [
        L("bounds", "Single-objective optimization. Saad's point about pandemic lockdowns and climate extremism: minimize one number at any cost, and the cost is everything else.", "angry", act="point", board=["ONE NUMBER", "germs: down", "school, jobs, sanity:", "also down"]),
        L("bounds", "The chapter also wades into gender identity law and women's sport. That's a whole fight of its own. Possibly with helmets.", "worried", act="shrug"),
    ]),
    card("act3", "HEART vs HEAD", "Tonight: trust the science, or test it?", 2.6),
    debate("act3-debate", [
        L("ken", "Tonight on Heart versus Head: should we trust the science, or test it? I trust whatever gets me off air by nine.", "happy", act="armsup", cam="wide"),
        L("kindt", "Hal, consensus isn't a conspiracy. When ninety-seven doctors say stop smoking, the three who disagree aren't Galileo. They're usually on a tobacco company's payroll.", "smug", act="point", react={"bounds": "worried"}),
        L("bounds", "Absolutely. Consensus is evidence. It's just not a commandment.", "neutral", act="shrug"),
        L("kindt", "And lockdowns weren't pure madness. Early on nobody knew anything, and some measures saved lives.", "neutral", act="point"),
        L("bounds", "Fair. My complaint is pretending there were no trade-offs. Kids' schooling, livelihoods, mental health. Weigh them out loud.", "neutral", act="point", react={"kindt": "happy"}),
        L("kindt", "And the do your own research crowd? My cousin did his own research. Now he gargles bleach and owns a horse dewormer subscription.", "angry", act="facepalm"),
        L("bounds", "So. Question everything. Including the bloke questioning everything.", "smug", act="point", react={"kindt": "happy"}),
        L("ken", "Science, folks. It's complicated. Unlike me. I'm extremely simple.", "happy", act="armsup", cam="wide"),
    ]),
    scene("act3-fair", "sciencefair", {"pam": {"x": 420, "s": 1.0}, "penny": {"x": 760, "s": 1.0, "facing": -1}, "mayor": {"x": 1020, "s": 1.0, "facing": -1}}, [
        L("penny", "My project. Here's my claim, here's my data, and here's a big red button that says prove me wrong.", "happy", act="point", react={"pam": "shocked"}),
        L("pam", "But what if somebody does?", "worried"),
        L("penny", "Then I win too. I learn something.", "smug", act="armsup"),
        L("mayor", "Fine! The lockdown is lifted! But everyone must sneeze into a raccoon.", "happy", act="point", react={"penny": "deadpan", "pam": "happy"}),
    ], sign="THE UNSETTLED SCIENCE FAIR"),
    news("tag", [
        L("ken", "And finally, Kindleton University has rehired its scientists. Their first finding: the phrase settled science is not settled. Goodnight.", "happy", graphic="SCIENCE: BACK"),
    ]),
    end(),
])

# ---------------------------------------------------------------- E6: Chapter 6, institutions, DIE as indulgences, woke capitalism
EPISODES["s1e6-indulgence-inc"] = ("S1E6", "Indulgence Inc.",
    "Brightside MegaCorp starts selling Guilt Offsets, the hospital hires a surgeon for his energy, and Dale loses three organs to good vibes.",
    "Book chapter 6: diversity programs as secular indulgences, merit in hiring and admissions, woke capitalism.", [
    news("cold-open", [
        L("ken", "Brightside MegaCorp, owner of this network and of my soul, has a new product: Guilt Offsets. Feel bad about anything? Buy a certificate. Feel better. Repeat.", "happy", graphic="GUILT OFFSETS $99"),
        L("ken", "I've bought eleven today. Mostly for things I've said off air.", "deadpan", graphic="GUILT OFFSETS $99", cam="close"),
    ], ticker="GUILT OFFSETS NOW IN FAMILY SIZE • BUY TWO SINS GET ONE FREE • SHAME FUTURES UP 40%"),
    scene("cold-open-office", "office", {"tiffany": {"x": 460, "s": 1.0}, "chet": {"x": 840, "s": 1.0, "facing": -1}}, [
        L("tiffany", "Guilt Offsets are flying off the shelves. Eat a steak? Offset. Own a boat? Offset. Ignore your mother? Offset, offset, offset.", "happy", act="armsup", react={"chet": "happy"}),
        L("chet", "And profits?", "worried"),
        L("tiffany", "Down ninety percent, Chet. But we've never felt cleaner.", "smug", act="shrug"),
        L("chet", "I bought one for the mansion. Now my mansion is humble. It told me.", "happy", act="point"),
        L("tiffany", "Plus mandatory training! Module nine: how to speak to a woman. You've only been doing it for sixty years, Chet.", "smug", act="point", react={"chet": "worried"}),
        L("chet", "Sixty years in utter darkness. Thank God for HR.", "sad", act="facepalm"),
    ], sign="BRIGHTSIDE MEGACORP"),
    title(6, "Indulgence Inc."),
    lecture("act1-lecture", [
        L("bounds", "In the Middle Ages, the church sold indulgences. Pay up, and your time in purgatory got shorter.", "happy", act="point", board=["INDULGENCES", "pay $$$", "-> sins shrink"]),
        L("bounds", "Saad argues diversity, inclusion and equity programs, which he pointedly spells D I E, work the same way. Buy the training, and the guilt goes away.", "smug", act="shrug", board=["SECULAR INDULGENCES", "buy training", "-> guilt shrinks", "(D.I.E.)"]),
        L("bounds", "He points to diversity statements in academic hiring, dropping entrance exams, and a Canadian medical training framework that told doctors to centre social justice rather than medical expertise.", "worried", act="point", board=["EXHIBIT C", "\"rather than", "medical expertise\""]),
        L("penny", "Wait. Rather than medical expertise?", "shocked"),
        L("bounds", "That's the quote he picks, yes. Do keep your organs on the inside.", "deadpan", react={"penny": "worried"}),
        L("bounds", "Saad also describes his own university's mandatory trainings, taken in his fifties, on how to behave like a civilised human being. He says he's very grateful. He is lying.", "smug", act="shrug", board=["MANDATORY TRAINING", "age: 50-something", "lesson: be a person"]),
    ]),
    card("act2", "MEANWHILE, AT KINDLETON GENERAL"),
    news("act2-news", [
        L("ken", "Kindleton General has hired a new chief surgeon, Doctor Chip Vibes, chosen for his excellent energy. He skipped the Hippocratic Oath for the Woke Oath. First, do no harm to anyone's feelings. He has never seen the inside of a human.", "happy", graphic="DR. VIBES, M.D.*", sub="*maybe"),
    ]),
    scene("act2-home", "livingroom", HOME, [
        L("dale", "Doctor Vibes took out my appendix. And my spleen. And my left kidney, because it seemed lonely.", "sad", act="shrug", react={"penny": "shocked"}),
        L("penny", "Dad, you went in for a splinter.", "angry", act="point"),
        L("dale", "And he got it! Eventually. It was in my other kidney.", "happy", act="armsup", react={"penny": "deadpan"}),
        R("*worried chitter* (offers Dale a raccoon kidney)", react={"dale": "happy", "penny": "shocked"}),
    ]),
    scene("act2-office", "office", {"tiffany": {"x": 640, "s": 1.05}}, [
        L("tiffany", "Our new ad campaign: Brightside Beer. The beer for people who hate beer, and the people who drink it!", "happy", act="armsup"),
    ], sign="BRIGHTSIDE BEER: NOT FOR YOU"),
    news("act2-news2", [
        L("ken", "Brightside Beer sales are down one hundred and four percent. Analysts are unsure how that's mathematically possible.", "happy", graphic="-104%"),
    ]),
    lecture("act2-lecture", [
        L("bounds", "Woke capitalism. Signal to people who will never buy your product, while insulting the ones who do. Then act shocked at the quarterly report.", "angry", act="point", board=["WOKE CAPITALISM", "fans: insulted", "critics: still not buying", "Q3: oops"]),
    ]),
    card("act3", "HEART vs HEAD", "Sponsored by Guilt Offsets", 2.6),
    debate("act3-debate", [
        L("ken", "Tonight on Heart versus Head: is diversity training a cure or a con? This segment is sponsored by Guilt Offsets, so please feel bad responsibly.", "happy", act="armsup", cam="wide"),
        L("kindt", "Hal, discrimination wasn't invented by HR. For decades talented people were shut out for who they were. A lot of these programs exist because of that.", "angry", act="point", react={"bounds": "worried"}),
        L("bounds", "Agreed, and I'll hire the best person whatever they look like. My problem is when the training replaces the merit, not when it widens the search.", "neutral", act="shrug"),
        L("kindt", "And merit isn't as neutral as you think. Standardized tests also measure who could afford a tutor.", "smug", act="point"),
        L("bounds", "Then fix the tutoring. Don't smash the thermometer because the patient has a fever.", "angry", act="point", react={"kindt": "happy"}),
        L("kindt", "Fine. Wider doors. Same bar.", "happy"),
        L("bounds", "Wider doors, same bar. Bloody good, actually.", "happy", act="armsup", react={"kindt": "smug"}),
        L("ken", "Brightside MegaCorp reminds viewers that agreeing is a premium feature. Please purchase a Consensus Offset.", "deadpan", cam="wide"),
    ]),
    scene("act3-office", "office", {"tiffany": {"x": 420, "s": 1.0}, "penny": {"x": 860, "s": 1.0, "facing": -1}}, [
        L("penny", "Here's a radical business plan. Make a good product. Hire people who can actually do the job. Be decent to everyone.", "neutral", act="point", react={"tiffany": "shocked"}),
        L("tiffany", "That's insane. Where does the guilt go?", "shocked", act="armsup"),
        L("penny", "You can keep the guilt. Just give my dad his kidney back.", "deadpan", act="shrug"),
    ], sign="BRIGHTSIDE MEGACORP (UNDER NEW MANAGEMENT?)"),
    news("tag", [
        L("ken", "And finally, Doctor Chip Vibes has been promoted to Chief of Everything. In his speech, he thanked the universe, his crystals, and a spleen he found in the break room.", "happy", graphic="PROMOTED"),
    ]),
    end(),
])

# ---------------------------------------------------------------- E7: Chapter 7, economics and the state
EPISODES["s1e7-free-lunch"] = ("S1E7", "Govern Me Harder, Daddy!",
    "Mayor Hart makes everything in Kindleton free and taxes everyone at one hundred and ten percent, and Penny's lemonade stand goes bankrupt in one afternoon.",
    "Book chapter 7: the welfare and nanny state as suicidal empathy, punishing taxes, 'nominally free' healthcare.", [
    news("cold-open", [
        L("ken", "Mayor Hart has made everything in Kindleton free. Free food, free housing, free healthcare.", "happy", graphic="EVERYTHING FREE*", sub="*terms apply"),
        L("ken", "To pay for it, taxes are now one hundred and ten percent. Yes, folks. You now owe money for earning money.", "deadpan", graphic="TAX: 110%"),
    ], ticker="FREE LUNCH NOW MANDATORY • LUNCH TAX ALSO MANDATORY • ACCOUNTANTS SEEN WEEPING IN PUBLIC"),
    scene("cold-open-square", "townsquare", {"mayor": {"x": 600, "s": 1.0}, "penny": {"x": 1040, "s": 0.95, "facing": -1}}, [
        L("mayor", "Citizens! Nobody in Kindleton should ever have to pay for anything!", "happy", act="armsup", fx="hearts", sfx="sparkle"),
        L("penny", "Someone always pays. Usually the person who didn't vote for it.", "deadpan", act="point"),
        L("mayor", "That's capitalist talk, Penny. Have a free lollipop. That'll be forty dollars in tax.", "smug", act="point", react={"penny": "angry"}),
    ], crowd=True, sign="EVERYTHING IS FREE (TERMS APPLY)"),
    title(7, "Govern Me Harder, Daddy!"),
    scene("act1-home", "livingroom", HOME, [
        L("dale", "Great news, Penny! Your lemonade stand made twelve dollars today!", "happy", act="armsup"),
        L("penny", "And?", "deadpan"),
        L("dale", "The town took fourteen.", "sad", act="shrug", react={"penny": "shocked"}),
        L("penny", "I have been taxed into debt by a lemon.", "angry", act="facepalm"),
        R("*sympathetic chitter* (hands Penny an invoice)", react={"penny": "shocked"}),
    ]),
    news("act1-news", [
        L("ken", "Kindleton General announced free healthcare for all. The waiting list for a broken leg is now fourteen years. Doctors recommend growing a new leg in the meantime.", "happy", graphic="WAIT: 14 YEARS"),
    ]),
    lecture("act1-lecture", [
        L("bounds", "Saad describes tax day. Two boxes on his bank page, two very large numbers, press send, and a career's savings vanish. Then he waits months to see a specialist. Nominally free, he calls it.", "angry", act="point", board=["NOMINALLY FREE", "you pay: 50%+", "you wait: forever"]),
        L("bounds", "His broader claim: the welfare state and the nanny state are suicidal empathy turned into policy. Compassion on the brochure. Bill on the doormat. Sorry, Dale.", "smug", act="shrug", board=["THE NANNY STATE", "brochure: ♥", "invoice: $$$"]),
        L("penny", "And the people who build stuff just leave.", "worried"),
        L("bounds", "Then there's his home province, Quebec, with an actual language police that measures shop signs, so the French is bigger than the English. Funded by you, naturally.", "angry", act="point", board=["THE LANGUAGE POLICE", "French: BIG", "English: small", "bill: yours"]),
    ]),
    news("act1-news2", [
        L("ken", "Kindleton's new Office of Kind Language has fined Penny's lemonade stand, because the word LEMONADE was bigger than the word KINDNESS. The fine is also free. Plus tax.", "happy", graphic="FINED: LEMONADE"),
    ]),
    news("act2-news", [
        L("ken", "Kindleton's richest inventor has moved to Grimsby, along with his factory, his jobs, and his taxes. He left a note. It says, L O L.", "happy", graphic="BYE", ticker="INVENTOR MOVES TO GRIMSBY • TAKES FACTORY, JOBS, AND THE GOOD BAGELS"),
    ], ticker="INVENTOR MOVES TO GRIMSBY • TAKES FACTORY, JOBS, AND THE GOOD BAGELS"),
    scene("act2-bar", "bar", {"dale": {"x": 560, "s": 1.0, "hold": "beer"}, "rocco": {"x": 800, "y": -170, "s": 0.95, "facing": -1, "hold": "martini"}}, [
        L("dale", "Everything's free, Rocco, and I've never been this broke. My beer is free. The beer tax is nine dollars.", "sad", act="shrug"),
        R("*knowing chitter* (orders two more on Dale's tab)", react={"dale": "sad"}),
    ]),
    card("act3", "HEART vs HEAD", "Tonight: who pays for kindness?", 2.6),
    debate("act3-debate", [
        L("ken", "Tonight on Heart versus Head: who pays for kindness? Spoiler, it's you. It's always you.", "happy", act="armsup", cam="wide"),
        L("kindt", "Hal, safety nets aren't suicide. Nobody in Canada goes bankrupt because they got cancer. In plenty of places, people do.", "angry", act="point", react={"bounds": "worried"}),
        L("bounds", "A safety net, yes. A hammock that strangles the people holding it up, no.", "neutral", act="shrug"),
        L("kindt", "And the rich will leave is the oldest threat in the book. Some do. Most stay where the customers are.", "smug", act="point"),
        L("bounds", "Fair. Then let's argue about the rate, not pretend the rate doesn't matter.", "neutral", act="point", react={"kindt": "happy"}),
        L("kindt", "Help people. And count the cost.", "happy"),
        L("bounds", "Compassion, with a calculator.", "happy", act="armsup"),
        L("ken", "Both guests' appearance fees have been taxed at one hundred and ten percent. They now owe us money. Thank you for coming.", "deadpan", cam="wide", react={"bounds": "shocked", "kindt": "shocked"}),
    ]),
    scene("act3-square", "townsquare", {"penny": {"x": 600, "s": 1.0}, "mayor": {"x": 920, "s": 1.0, "facing": -1}}, [
        L("penny", "New budget. A safety net for people who fall. Not a hammock for the mayor's friends. And taxes low enough that people still bother to make lemonade.", "neutral", act="point", react={"mayor": "worried"}),
        L("mayor", "But then how will people know I care?", "sad"),
        L("penny", "By whether things work.", "deadpan"),
        L("mayor", "Ugh. That's so much harder.", "sad", act="facepalm"),
    ], crowd=True, sign="EVERYTHING COSTS SOMETHING"),
    scene("tag", "livingroom", HOME, [
        R("*officious chitter* (presents Dale with a bill for emotional support)", react={"dale": "shocked", "penny": "deadpan"}),
        L("dale", "Rocco. Did you just tax me?", "shocked", act="point"),
        L("penny", "He's been on your payroll for six episodes, Dad.", "deadpan"),
    ]),
    end(),
])

# ---------------------------------------------------------------- E8: Conclusion, the finale
EPISODES["s1e8-dial-m-for-moderation"] = ("S1E8", "Dial M for Moderation",
    "Season finale. The Empathy Dial goes on trial for crimes against common sense, with Penny prosecuting, the Mayor defending, and Rocco as the key witness.",
    "Book conclusion: the dopamine hit, empathy agnosia, Axelrod's tit for tat, truth as the highest empathy, the 'dormant virus' warning.", [
    news("cold-open", [
        L("ken", "Tonight, a Kindleton first. The Empathy Dial itself is on trial, charged with crimes against common sense.", "happy", graphic="THE PEOPLE v. THE DIAL"),
        L("ken", "It is also charged with eating a man's car. That was Rocco, but the dial is taking the fall. It has a very good lawyer. That's a lie, it has the Mayor.", "deadpan", graphic="THE PEOPLE v. THE DIAL"),
    ], ticker="TRIAL OF THE CENTURY • OR AT LEAST OF THE WEEK • RACCOON REFUSES TO TESTIFY WITHOUT SNACKS"),
    scene("cold-open-court", "courtroom", {"judge": COURT_JUDGE, "penny": {"x": 230, "s": 1.0}, "mayor": {"x": 1040, "s": 1.0, "facing": -1}}, [
        L("judge", "Order! The People versus the Municipal Empathy Dial. How does the defendant plead?", "neutral", act="point"),
        L("mayor", "The dial pleads... sensitive.", "sad", react={"penny": "deadpan"}),
        L("judge", "Aww. Accepted.", "happy", react={"penny": "angry"}),
        L("penny", "Your honor, the prosecution calls Dale Doormat.", "neutral", act="point"),
    ], sign="THE PEOPLE v. THE EMPATHY DIAL"),
    title(8, "Dial M for Moderation"),
    scene("act1-court", "courtroom", {"judge": COURT_JUDGE, "penny": {"x": 230, "s": 1.0}, "dale": {"x": 1040, "s": 1.0, "facing": -1}}, [
        L("dale", "Every time I said yes to something dumb, I got this warm tingle. Like a hug from a hot tub.", "happy", act="armsup"),
        L("penny", "That's the dopamine hit. The reward for looking kind. Was the raccoon better off?", "neutral", act="point"),
        L("dale", "He has a Lexus now.", "happy"),
        L("penny", "Were you better off?", "deadpan"),
        L("dale", "I live in his Lexus.", "sad", act="shrug", react={"judge": "worried"}),
    ], sign="THE PEOPLE v. THE EMPATHY DIAL"),
    scene("act1-expert", "courtroom", {"judge": COURT_JUDGE, "penny": {"x": 230, "s": 1.0}, "bounds": {"x": 1040, "s": 1.0, "facing": -1}}, [
        L("bounds", "Delighted. In the nineteen eighties a political scientist named Robert Axelrod ran a tournament. Computer programs played cooperate or betray, over and over.", "happy", act="point"),
        L("bounds", "The winner was the simplest program in the room. Tit for tat. Be nice first. Then do whatever the other fellow did last.", "smug", act="shrug"),
        L("bounds", "Kind, but nobody's doormat. Sorry, Dale.", "neutral", act="point"),
        L("bounds", "Saad's last chapter is called Inoculation. A small dose of hard truth now, so the full infection doesn't kill you later. Like a vaccine. Sorry, like a hug with a needle in it.", "smug", act="shrug"),
        L("bounds", "And Saad has a phrase for the town's real illness. Empathy agnosia. Not being able to tell who deserves your empathy. The arsonist or the family. The bike thief or the kid with no bike.", "worried", act="point"),
    ], sign="THE PEOPLE v. THE EMPATHY DIAL"),
    card("act2", "THE DEFENSE RESTS. UNEASILY."),
    scene("act2-defense", "courtroom", {"judge": COURT_JUDGE, "mayor": {"x": 230, "s": 1.0}, "kindt": {"x": 1040, "s": 0.95, "facing": -1}}, [
        L("mayor", "The defense calls Doctor Iris Kindt!", "happy", act="armsup"),
        L("kindt", "I'll say this. Turn empathy down too far and you don't get wisdom. You get cruelty with a spreadsheet. Every ditch has a body in it.", "neutral", act="point"),
        L("mayor", "Ha! You see?", "happy", act="bounce"),
        L("kindt", "But eleven was stupid, Marigold.", "deadpan", react={"mayor": "shocked"}),
        L("mayor", "No further questions.", "sad", act="facepalm"),
    ], sign="THE PEOPLE v. THE EMPATHY DIAL"),
    scene("act2-witness", "courtroom", {"judge": COURT_JUDGE, "penny": {"x": 230, "s": 1.0}, "rocco": {"x": 1040, "s": 1.0, "facing": -1, "hold": "keys"}}, [
        L("penny", "And finally, the prosecution calls Rocco. Rocco, did the town's kindness ever make you a better raccoon?", "neutral", act="point"),
        R("*long, thoughtful chitter* (jingles stolen keys)", dur=2.0, react={"judge": "worried", "penny": "deadpan"}),
        L("judge", "Let the record show the witness has stolen the court stenographer's car.", "deadpan", act="facepalm"),
    ], sign="THE PEOPLE v. THE EMPATHY DIAL"),
    scene("act3-closing", "courtroom", {"judge": COURT_JUDGE, "penny": {"x": 230, "s": 1.0}, "mayor": {"x": 1040, "s": 1.0, "facing": -1}}, [
        L("penny", "Your honor, nobody is asking Kindleton to stop caring. Just to care with its eyes open.", "neutral", act="point", react={"mayor": "worried"}),
        L("penny", "Is it true? Who pays? What happens next year? Are they playing tit for tat, or just eating our lasagna? And no fence-sitting. Pick the kid with no bike over the guy with four hundred.", "angry", act="armsup"),
        L("penny", "Saad says truth is the highest form of empathy. His critics say don't let that become an excuse to stop caring. I say, why not both.", "smug", act="shrug"),
        L("judge", "The court finds the dial guilty of being turned up way too high, by a mayor who liked the tingle.", "angry", act="point", react={"mayor": "sad"}),
        L("judge", "Sentence: the dial is set to five. And checked every year, by someone with a calculator and a heart.", "happy", act="armsup", sfx="sting", react={"penny": "happy", "mayor": "sad"}),
    ], sign="THE PEOPLE v. THE EMPATHY DIAL"),
    news("act3-news", [
        L("ken", "And with that, Kindleton returns to normal. Tune in next season, when we find out what else is broken. Spoiler: everything. Goodnight!", "happy", graphic="SEASON 1: FIN"),
    ]),
    scene("tag", "townsquare", {"mayor": {"x": 600, "s": 1.0}, "penny": {"x": 1060, "s": 0.95, "facing": -1}}, [
        L("mayor", "Five. Five is fine. Five is... so boring.", "sad", cam="wide"),
        L("mayor", "Maybe just a teensy six.", "smug", act="point", dial=6, sfx="sparkle", cam="wide"),
        L("penny", "Hands off the dial, Marigold.", "angry", act="point", react={"mayor": "shocked"}),
        L("mayor", "It was the wind!", "shocked", act="armsup"),
    ], props={"dial": {"x": 300, "value": 5, "label": "11: OH SH*T"}}),
    end("End of Season One. Inspired by ideas in “Suicidal Empathy” by Gad Saad, and by his critics. Parody and commentary for adults. Original characters."),
])


def main():
    for slug, (code, name, logline, fmt, seq) in EPISODES.items():
        used = {l["who"] for s in seq if s["type"] == "scene" for l in s["lines"]} | {c for s in seq if s["type"] == "scene" for c in s["chars"]}
        ep = {
            "meta": {"show": "KINDLETON", "episode": code, "title": name, "rating": "adult", "format": "drama-skit with explainer cutaways",
                     "logline": logline, "focus": fmt, "source": SRC,
                     "disclaimer": "Parody and commentary for adults. Strong language. Original characters. Not affiliated with any author, network or show.",
                     "width": 1280, "height": 720, "fps": 24, "gap": 0.26, "music": True},
            "cast": {k: v for k, v in CAST.items() if k in used},
            "sequence": seq,
        }
        d = os.path.join(HERE, slug); os.makedirs(d, exist_ok=True)
        json.dump(ep, open(os.path.join(d, "episode.json"), "w"), indent=1, ensure_ascii=False)
        n = sum(len(s["lines"]) for s in seq if s["type"] == "scene")
        print(f"{slug}: {n} lines")


if __name__ == "__main__":
    main()
