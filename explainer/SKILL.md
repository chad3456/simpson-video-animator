---
name: lumen-explainer-studio
description: Turn any topic, article, PDF or book into a calm, flat-vector animated explainer video in the style of science-explainer channels (original homage) with narration, ambient score and chapter cards, using only open-source tools.
---

# LUMEN Explainer Studio

Turns source material into a 5 to 10 minute illustrated explainer: dark saturated palettes, rounded creatures ("pebbles"), glows, parallax and particles, a calm narrator, an ambient score and chapter cards. It is an original homage to the flat-design explainer genre. Read `STYLE.md` before writing; it is the look and sound contract.

Never use another channel's name, logo, characters (no bird mascots), frames, music or narrator's voice. You can study references privately with `tools/style_study.py`, but you only keep the numbers from them, never the pixels.

## 0. Toolkit

```
explainer/
  SKILL.md, STYLE.md
  engine/explainer.js     renderer: backgrounds, pebbles, icons, charts, cards, camera (window.Toon API)
  engine/player.html      live player (?ep=../episodes/<slug>) and headless render target (?render=1)
  engine/make_script.py   narration script.md from episode.json + timeline.json
  tools/style_study.py    private reference study: frames, contact sheets, shot length, palette
  episodes/<slug>/episode.json   the only file you write per episode
../engine/build_audio.py  shared with the toon studio: Kokoro voice, ambient score, SFX, timeline.json
../engine/render.mjs      shared: Chromium frame stepping + ffmpeg (pass --player explainer/engine/player.html)
```

## 1. Ingest and study

Same as the toon studio: WebFetch for URLs, `pdftotext` for PDFs, and for EPUBs unzip and strip `*.xhtml` in spine order. Then write a short study before any script:

1. **One-sentence thesis** a 12-year-old gets.
2. **The question the video asks** (the hook), framed so a viewer who disagrees still wants the answer.
3. **5 to 8 concepts**, each with a plain definition, the author's best example and a *visual metaphor* built from the element list in section 4 (a dial, a curve, rings, dominoes, a dot grid, a scale, a contagion crowd).
4. **The strongest criticism** (2 to 4 points, attributed) and what both sides agree on.
5. **Hot-button zones**, which you name on screen (case-file cards) rather than act out.

For a whole book, plan one episode per big idea or a single overview episode with 6 to 8 parts.

## 2. Structure (default 6 to 9 minutes)

1. **Cold open (about 30 s):** an image, a wonder line, an uncomfortable question, then the source and stakes.
2. **Title card** (`style: "title"`, `sfx: "swell"`).
3. **Parts 1 to N:** a chapter card each (`style: "chapter"`, a glyph, a colour, `sfx: "chime"`), then 1 to 4 scenes.
   Typical order: what it is and where it comes from, the sweet spot, how it fails, why we fall for it, the big claims (case files), the case against, the toolkit.
4. **Outro:** the shared ground, three takeaway questions, a short human line, a silent music beat.
5. **End card** (`style: "end"`, credits with sources).

Pacing: a new visual every 4 to 6 seconds; one idea per scene; each key term appears on screen as a label the moment it is spoken.

## 3. Fairness rules

- Credit the author by name. Paraphrase in your own words; use at most a few short, attributed phrases and never long passages.
- Give critics a full part with their strongest points, and name where they published.
- Satirize nothing. The tone is curious and calm. Name hot-button chapters on cards; do not dramatize them with creatures that stand in for real groups.
- Pebbles are "people in general". A `spiky` pebble may stand for a threat or a free-rider in the abstract, never for a nationality, religion or other group.
- **News episodes** (a real event, like the riots special): every figure gets a `cite` chip on screen and a row in the bible's fact sheet. Where sources disagree, show both. Draw participants as roles (hooded rioters, capped police, bright residents), never by religion, skin or nationality. Show damage and cruelty plainly but stylised: flames, burnt cars, labels and counts, no gore. Attribute a framing author's claims to them, test any claim about a group against data, and keep a full part for critics.

## 4. episode.json

```json
{
  "meta": {"show": "LUMEN", "episode": "E1", "title": "...", "format": "explainer", "rating": "general",
           "music": "ambient", "narrator": "narrator", "fps": 30, "gap": 0.42, "captions": false,
           "logline": "...", "source": "...", "disclaimer": "Original animation ... Not affiliated with ..."},
  "cast": {"narrator": {"name": "Narrator", "voice": "am_michael:0.6+bm_george:0.4", "speed": 1.0}},
  "sequence": [
    {"type": "card", "id": "title", "style": "title", "title": "...", "sub": "...", "glyph": "lock", "color": "#5ec8e5", "dur": 5.5, "sfx": "swell"},
    {"type": "card", "id": "ch1", "style": "chapter", "kicker": "Part 1", "title": "...", "glyph": "heart", "color": "#ff5a7a", "dur": 3.4, "sfx": "chime"},
    {"type": "scene", "id": "unique", "bg": {"kind": "space|land|city|deep|studio", "pal": "midnight|teal|plum|ember|dusk|day"},
     "cam": {"zoom": [1.0, 1.06], "pan": [[0, 0], [30, -10]]},
     "els": [
       {"id": "dial", "type": "meter", "x": 640, "y": 470, "r": 200, "value": 0.2, "label": "EMPATHY",
        "in": 0, "d": 0.5, "anim": "pop", "sfx": "pop", "out": 3, "float": 6,
        "keys": {"1": {"value": 1, "d": 1.0, "t": 1.5}}}
     ],
     "lines": [{"text": "Narration line."}, {"text": "", "dur": 1.6, "sfx": "whoosh"}]},
    {"type": "card", "id": "end", "style": "end", "title": "LUMEN", "dur": 7, "credits": ["Based on ...", "..."]}
  ]
}
```

The title card shows a big glowing heart, or the badge named by `glyph` in `color` if set, so each episode of a series gets its own emblem. `meta.rating` is `general`, `mature` or `adult`; add `meta.content_note` when a chapter needs it.

**Timing.** `in` is the line index where an element appears (plus `d` seconds); `out` is the line where it leaves; `keys` maps a line index to new prop values, tweened from that line's start plus `d` over `t` seconds (default 0.8). Numbers, colours and `[x, y]` arrays tween; strings such as `mood` switch. A line can carry `say` with a phonetic spelling for the voice (names, French words) while `text` stays correct in the script. A line with empty `text` is a silent beat of `dur` seconds where the score swells. `sfx` on an element plays when it appears (`vol` scales it).

**Common props:** `x y` (canvas 1280×720), `s` scale, `rot` degrees, `o` opacity, `anim` (`pop rise drop left right fade grow none`), `float` (idle bob in px).

**Elements:**

| type | props |
|---|---|
| `pebble` | `size color mood look:[dx,dy] tilt hold:"heart" spiky hood cap` (origin at its feet; `hood` = an anonymous dark hood, `cap` = a peaked uniform cap; both take `true` or a colour) |
| `crowd` | `n cols w rowh size colors[] mood skip infect:0..1 infectColor from:"center"/"left" hood cap` |
| `heart` | `size color heat:0..1 crack:0..1` (beats; embers and shake when hot) |
| `brain` | `size color` |
| `book` | `title author color w h` (a generic cover, never the publisher's art) |
| `rings` | `labels[] colors[] r` (inner to outer, with a pebble in the middle) |
| `curve` | `w h draw:0..1 dot:0..1 labels:{x,y,left,mid,right}` (inverted U with zones) |
| `meter` | `r value:0..1 label` |
| `label` / `text` | `text color fg size` / `text size color weight` (`\n` for new lines) |
| `icon` | `glyph r color label`; glyphs: heart cross dna fruit gift target alarm fear fire calc spark folder lock globe gavel flask people building scales shield coin chain x eye bowling glove brain star syringe clock cap plane receipt mic leaf medal ballot book home hash camera car phone quote |
| `card` | `glyph title color w h` (a case-file tile; long titles shrink to fit) |
| `quote` | `text by color size w` (a short attributed quote card; keep quotes short) |
| `bars` | `values[] labels[] colors[] max unit dp fmt:"int" title w h grow` (bars grow in one by one with counting labels) |
| `critter` | `kind:ant/frog/scorpion/cricket/hummingbird/cassowary/snake/worm color size flip` (original animals for fables and zoology asides) |
| `phone` | `likes` (counts up when keyed) |
| `arrow` | `x2 y2 bend color draw:0..1 width` |
| `mirror`, `house` (`gate`), `planet` (`r color land`) | |
| `dominoes` | `n gap color fall:0..1` |
| `dots` | `n cols size gap color alt altColor` |
| `scale` | `tilt:-1..1 left right` (glyph names) |
| `particles` | `kind:"hearts"/"alerts"/"sparkle" n w h dir` |
| `shape` | `shape:"circle"/"rect" r w h color glow` |
| `flames` | `size w n` (stylised tongues, sparks and smoke; origin at the base) |
| `car`, `van` | `color size fire:0..1 burnt:0..1` (`van` has a flashing blue light until burnt) |
| `townhall` | `size color sign fire:0..1 burnt:0..1` (a generic French mairie with a tricolour) |
| `stat` | `value prefix suffix label src size color` (a big number; key `value` to count up) |
| `cite` | `text prefix` (a small source chip; `prefix` defaults to "Source: ") |
| `gbars` | `groups:[{label, vals[]}] series:[{name, color}] max unit w h grow:0..1` (grouped bars; key `grow` to reveal) |
| `feed` | `posts:[{tag, text, color, stamp}] app w ph shown stamps:0..1` (a generic social feed, no platform logos; `stamps` reveals FALSE/OLD stamps) |
| `hexmap` | `r spread:0..1 n city pin color` (France as a soft hexagon; towns light up from Paris outwards) |

To add a visual, write a function `(props, t, seed, age) => svgString` drawn around the origin, use `solid()` and `glow()` for the house look, and register it in `DRAW`.

**Voice.** Any Kokoro voice name, or a blend written `voiceA:weight+voiceB:weight`. Blends make an original narrator. Never clone a real person's voice.

**SFX:** `whoosh pop chime tick swell thump` (explainer set) plus the toon set.

## 5. Production

```bash
# one-time: pip install kokoro-onnx soundfile numpy; Kokoro model files in ~/models (see the repo README); ffmpeg; npm i playwright
python3 engine/build_audio.py explainer/episodes/<slug>/episode.json --models ~/models
node engine/render.mjs explainer/episodes/<slug> --player explainer/engine/player.html --stills 10,40,90   # look first
node engine/render.mjs explainer/episodes/<slug> --player explainer/engine/player.html                     # 30 fps MP4
d=explainer/episodes/<slug>
ffmpeg -i $d/episode.mp4 -c:v libx264 -preset slow -crf 28 -tune animation -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart $d/web.mp4 && mv $d/web.mp4 $d/episode.mp4
ffmpeg -ss 30 -i $d/episode.mp4 -frames:v 1 -q:v 4 $d/poster.jpg
ffmpeg -i $d/episode.wav -b:a 96k $d/episode.mp3
python3 explainer/engine/make_script.py $d/episode.json > $d/script.md
python3 engine/build_gallery.py      # adds the episode to the Vercel gallery under LUMEN
```

Review stills for: text clipped at the edges, labels on top of objects, creatures floating above the ground, an empty frame longer than 6 s, and more than three accent colours. Commit everything except `*.wav`, `.voice-cache/` and `.style-study/`.

## 6. Deliverables

1. `bible.md`: thesis, concepts with metaphors, critics, part plan.
2. `episode.json`, `timeline.json`, `episode.mp4`, `episode.mp3`, `poster.jpg`, `script.md`.
3. A gallery entry (automatic) and a PR.

## 7. Quality checklist

- Could a viewer state the thesis in one sentence, and one serious criticism?
- Is every term on screen when it is spoken? Is there motion in every frame?
- Is the author credited and paraphrased, with only short attributed phrases?
- Are all characters, music, voice and logos original?
