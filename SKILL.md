---
name: toon-parody-studio
description: Turn any source (blog URL, PDF, EPUB, notes, a topic) into a yellow-toon parody animated episode, explainer or drama skit, with script, cast, voices and a rendered MP4.
---

# Toon Parody Studio

Turns source material into a Simpsons-*inspired* parody episode: original yellow-skinned characters, a small town, a sitcom structure, and jokes that carry real ideas. The output is a full episode package plus a rendered video made only with free, open-source tools.

Always use original characters, town, logos and music. "Simpsons-style" means the look and rhythm (yellow skin, overbites, big round eyes, family sitcom, cold open, couch-gag-like title card, sight gags, a news anchor for exposition), never actual characters, names, catchphrases or assets.

## 0. Toolkit location

The working engine (renderer, voice builder, player) lives in the project folder `/mnt/project-files/parody-studio/` (or the user's GitHub repo, if they made one). Copy it to a local working dir before running:

```
parody-studio/
  engine/engine.js        procedural SVG characters, backgrounds, props, camera, captions
  engine/player.html      interactive player (?ep=../episodes/<slug>) and headless render target (?render=1)
  engine/build_audio.py   Kokoro TTS for every line + synthesized theme/SFX -> episode.wav + timeline.json
  engine/make_script.py   screenplay-style script.md from episode.json
  engine/render.mjs       Playwright + ffmpeg -> episode.mp4 (or --stills t1,t2 for review frames)
  engine/fonts/           Bangers + Nunito (OFL)
  episodes/<slug>/episode.json   the only file you write per episode
```

If the toolkit is missing, rebuild it from sections 6 and 7 (the schema and pipeline are the contract).

## 1. Ingest the source

| Input | How |
|---|---|
| Blog / article URL | WebFetch the page; for paywalled or thin pages, search for summaries and reviews |
| PDF | `pdftotext -layout file.pdf -` (or the pdf skill); keep page numbers for citations |
| EPUB | `unzip -o book.epub -d epub/` then strip tags from `epub/**/*.xhtml` in spine order (`content.opf`) |
| Plain text / notes / topic only | Research it: 2 to 4 web searches covering the core claim, the best summary, and the best criticism |

For books, also find at least one serious critical review. The counterpoint is part of the product, not an afterthought.

## 2. Study: build a thesis map (write it down before any jokes)

1. **One-sentence thesis** in plain words a 12-year-old gets.
2. **5 to 8 key concepts**, each with: the author's term, a plain definition, the author's strongest example, and a *visual metaphor* candidate.
3. **Strongest counterarguments** (2 to 4), steelmanned, with who makes them.
4. **What both sides agree on.** This becomes the resolution of Act 3.
5. **Hot-button zones** the source touches. Decide which you will dramatize and which you will only *name* (see section 4).

## 3. Brainstorm the comedy engine

Generate three premises, pick one, and note why. A good premise has:

- **One central device** that makes the abstract idea physical and escalatable (pilot: a municipal "Empathy Dial" that goes to 11). Machines, laws, apps, contests, and magic objects all work.
- **A home plot** that mirrors the big idea at family scale (pilot: dad who can't say no to a raccoon).
- **A town plot** that shows the idea at policy scale through absurd headlines.
- **A reversal tag** that overcorrects to the opposite extreme, so the episode never lands on "the other side is simply right".

Joke toolkit: literalize the metaphor; rule of three with a twist on the third; the anchor reading insane headlines in a cheerful voice; the kid as the only sane person; signage gags (banners, desk plates, phone screens, chalkboards); callbacks to the cold open in the ending; a mascot critter that never speaks but drives the plot.

## 4. Rating, tone and guardrails

Ask for (or infer) a rating and set `meta.rating`:

- `general`: no profanity, gentle sitcom jokes.
- `adult` (18+, the default for this user's series): swearing, crude and sexual innuendo between adult characters, dark jokes, drunk dads, bitter anchors, insult comedy between characters. Write it like a late-night adult cartoon: commit to the joke, put the profanity on the punchline word, and let characters roast each other. The renderer adds a "TV-MA L" bug and the gallery shows an 18+ badge and an age check.

Adult comedy craft: escalate a polite situation into an obscene one (the anchor whose grin cracks into "go fuck yourself"); undercut a lofty idea with something base (Aristotle "in between orgies"); give each character one recurring vice or wound (divorce, dead marriage, a raccoon who married your sister); let the kid be the most cynical voice, but never put kids in sexual jokes.

Hard limits at every rating:

- No slurs, and no sexual content involving minors.
- Satirize **ideas, policies, institutions, incentives and public arguments**. Never mock a group for who they are (sex, race, religion, nationality, orientation, disability). When a source makes claims about a group, dramatize the *argument* through an allegory that does not stand in for the group (the pilot uses a raccoon freeloader, not a stand-in for migrants).
- Public figures can be named and quoted for their arguments, but do not put their likeness or invented words in a cartoon body; use an original "expert" character who presents the idea and credits the author out loud.
- **Every episode includes a counterpoint character** who gets real, strong lines, and an Act 3 where the two find a usable test or principle. Credibility makes the satire land.
- If a requested topic is framed as an attack on a group (for example "chaos of left-wing feminist women"), reframe it to the ideas and arguments involved (for example "debates over modern feminism in Europe"), and tell the user how you reframed it in one line.
- No real logos, show names, theme tunes or character designs. End card: "Parody and commentary. Original characters." plus a source credit.

## 5. Formats

**Drama skit (default, 4 to 6 min):** cold open (30 s, device introduced, first big gag) → title card → Act 1 home plot shows the problem → expert explainer on a chalkboard defines it → card → Act 2 escalation montage: anchor headline + expert/kid naming the concept, 3 to 4 times → card → Act 3 debate (thesis vs counterpoint, ends in a shared test) → home resolution using the test → tag (overcorrection) → end card with credits.

**Explainer (2 to 4 min):** host character + chalkboard, one concept per 30 to 45 s, each concept = cutaway gag → plain definition on the board → one-line takeaway; ends with "the case against" segment and a 3-point summary card.

**Shorts (45 to 60 s, vertical):** one concept, one gag, one punchline; reuse the series cast.

Writing rules: lines under about 30 words; a gag or visual change at least every 10 seconds; every concept appears on screen as text (board, graphic, phone, banner) the moment it is named; the kid asks the audience's question; the expert never gets the last word alone.

## 6. The episode file (`episodes/<slug>/episode.json`)

```json
{
  "meta": {"show": "KINDLETON", "episode": "S1E2", "title": "...", "rating": "adult|general", "music": true, "format": "drama-skit", "logline": "...",
           "source": "...", "disclaimer": "Parody and commentary. Original characters.", "width": 1280, "height": 720, "fps": 24, "gap": 0.28},
  "cast": {
    "<id>": {"name": "Display Name", "role": "...", "voice": "am_michael", "speed": 1.05,
             "look": {"hair": "helmet|bouffant|flop|pigtails|bald|curly|ponytail|slick|cap", "capColor": "#hex", "capText": "G", "hairColor": "#hex", "shirt": "#hex", "pants": "#hex",
                      "skirt": false, "vest": "#hex", "tie": "#hex", "bowtie": "#hex", "sash": "TEXT", "pearls": false,
                      "glasses": false, "mustache": false, "beard": "#hex", "smile": false, "height": 1.0,
                      "stubble": false, "lipstick": "#hex", "mask": false, "badge": false, "stripes": "#hex", "robe": "#hex"}},
    "<critter>": {"name": "Rocco", "kind": "raccoon", "sfx": "chitter"}
  },
  "sequence": [
    {"type": "card", "id": "title", "title": "SHOW NAME", "sub": "Episode 1: ...", "dur": 4, "sfx": "theme|sting"},
    {"type": "scene", "id": "unique-id", "bg": "newsroom|townsquare|livingroom|chalkboard|tvstudio|bar|sciencefair|courtroom|office", "crowd": false,
     "sign": "banner / sign text for the set", "ticker": "newsroom crawl text",
     "chars": {"<id>": {"x": 640, "y": 0, "s": 1.0, "facing": 1, "enter": "left|right", "hold": "beer"}},
     "props": {"dial": {"x": 300, "value": 3, "label": "11: OH SH*T"}, "phone": {"likes": "1,000,000"}},
     "lines": [
       {"who": "<id>", "text": "Spoken line.", "emote": "neutral|happy|angry|worried|sad|shocked|deadpan|smug",
        "act": "point|armsup|shrug|facepalm|bounce", "cam": "wide|close",
        "board": ["HEADING", "line", "line"], "graphic": "NEWS BOX TEXT", "sub": "small print",
        "dial": 11, "fx": "hearts|shake|drain", "sfx": "sparkle|crash|chomp|chitter", "dur": 1.5, "pause": 0.3,
        "react": {"<listener id>": "deadpan"}, "hold": {"<id>": "beer|keys|sponge|martini"}}
     ]}
  ]
}
```

Rules: listeners default to a neutral face, so use `react` on most lines to give them eye-rolls (`deadpan`), shock and smirks; reactions sell the joke. `enter` walks a character on during the scene's first line. `crowd: true` fills public scenes with cheering townsfolk. Scenes open and close with an iris wipe automatically. `pause` is the silence after a line (default `meta.gap`); `music: true` adds a ducked, original plucked-guitar bed. `x` is 0 to 1280 (feet on the ground line); `y` lifts a character off the ground (in the bar set, `y: -170` sits a short character on the counter, which otherwise hides them); `facing: -1` flips a character to face left; height under 0.85 renders a kid with a big head. Critter lines (`kind` set) use `sfx` + `dur` instead of a voice. `board` (chalkboard) and `graphic` (newsroom box) persist for the rest of the scene. Cameras auto-cut between wide and speaker close-ups; force `"cam": "wide"` for group gags.

Kokoro voices (all free, Apache-2.0): American female `af_heart af_bella af_sarah af_nova af_sky af_nicole af_jessica af_river`; American male `am_michael am_puck am_adam am_eric am_liam am_onyx am_fenrir am_echo`; British `bf_emma bf_isabella bf_alice bm_george bm_lewis bm_daniel bm_fable`. Give each character a distinct voice and a speed of 1.0 to 1.1 for sitcom pace.

New backgrounds, props or critters: add a function to `BG` (returns `[behind, infront]` SVG strings at 1280x720, ground at y=640) or a prop renderer in `engine.js`. Keep the flat style: thick #1d1d1d outlines, flat fills, skin `#FFD43B`.

## 7. Production pipeline

```bash
# one-time setup (free; about 120 MB)
pip install kokoro-onnx soundfile numpy
mkdir -p ~/models && cd ~/models
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
# needs ffmpeg + Node with playwright and a Chromium (set CHROMIUM_PATH if Playwright's own browser isn't installed)

cd parody-studio
python3 engine/build_audio.py episodes/<slug>/episode.json --models ~/models   # voices, SFX, timeline
python3 engine/make_script.py episodes/<slug>/episode.json > episodes/<slug>/script.md
node engine/render.mjs episodes/<slug> --stills 5,30,60,120                     # review frames first
node engine/render.mjs episodes/<slug>                                            # full MP4 (~1 to 2x realtime per minute)
ffmpeg -i episodes/<slug>/episode.wav -b:a 96k episodes/<slug>/episode.mp3      # audio for the web player
ffmpeg -i episodes/<slug>/episode.mp4 -c:v libx264 -crf 30 -tune animation -c:a aac -b:a 80k -movflags +faststart web.mp4 && mv web.mp4 episodes/<slug>/episode.mp4   # keep the repo light
ffmpeg -ss 20 -i episodes/<slug>/episode.mp4 -frames:v 1 -q:v 4 episodes/<slug>/poster.jpg
python3 engine/build_gallery.py                                                   # refresh episodes/index.json for the site
```

**Gallery rules.** The gallery only grows: always add new episodes as new folders and never delete or overwrite a past episode's folder (make a new slug for a remake). Set `meta.category` (for example `"Suicidal Empathy (book)"` or `"Current events"`); the site groups episodes by category, then by show, with filter chips. `build_gallery.py` regenerates `episodes/index.json` from every folder, so merging branches never drops an episode.


The repo root `index.html` is a static episode gallery (no build step), so Vercel deploys it as-is. Commit everything except `*.wav` and `.voice-cache/`, then open a PR.

Always render stills and look at them before the full render. Check: captions readable, nobody's face hidden by a prop, board text fits (5 lines max, about 22 characters each), close-ups not cutting heads.

## 8. Seasons from a whole book

For a book, plan a season before writing any episode: one episode per chapter, plus a finale built on the conclusion. Keep a fixed cast, add one or two recurring characters per chapter's world (a judge, a principal, a CEO), and track running arcs across episodes (a device that escalates and then goes on trial, a critter whose crimes keep growing, the kid's test that becomes the closing argument). Write `episodes/SEASON1.md` with the arc table, then generate the episode files from a compact builder script (`episodes/season1_build.py` is the template), so dialogue edits stay fast. Render the whole batch with `engine/render_all.sh <slug> ...`.

## 9. Deliverables per episode

1. `bible.md`: thesis map, counterpoints, premise choice, cast with roles and voices, beat sheet with timings.
2. `script.md`: screenplay view generated from episode.json (scene headings, character cues, action lines).
3. `episode.json`, `timeline.json`, `episode.wav`, `episode.mp4`.
4. Optional: a published Artifact page with the video (re-encode to under 15 MB: `-crf 30 -b:a 80k`) and the episode guide, and 3 to 5 vertical shorts cut from the strongest gags (`ffmpeg -ss A -to B -vf "crop=405:720:X:0,scale=1080:1920"`).

## 10. Quality checklist before delivering

- Could a viewer explain the source's thesis in one sentence after watching? Could they name one serious criticism?
- Is there a joke or visual change at least every 10 seconds? Does the cold open land a gag inside 20 seconds?
- Does every named concept appear on screen as text?
- Is every target an idea, policy or incentive rather than a group of people?
- Original names, designs, music and logos only; source credited on the end card.

## 11. Upgrade paths (all have free tiers)

- **Rive**: build rigged characters with state machines (idle, talk, point) in the Rive editor, export `.riv`, drive the `talk` input from `timeline.json` mouth envelopes with `@rive-app/canvas`. Best upgrade for smoother motion.
- **Spline**: 3D sets and camera moves; export a scene URL and layer the 2D cast on top.
- **Figma MCP**: design character turnarounds and expression sheets, export SVG, then port shapes into `engine.js` look options.
- **Voices**: Kokoro full-precision model (`kokoro-v1.0.onnx`) for slightly better quality; Piper for more accents. Only clone a real person's voice with their documented consent.
- **Web app**: the series lives in `github.com/chad3456/simpson-video-animator`; the root gallery deploys on a free Vercel project with no build settings. Ask the user before creating any new repo, project or account.
