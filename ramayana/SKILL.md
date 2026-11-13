# Ramayana in one hundred paintings

A hundred interactive paintings that tell the Valmiki Ramayana from the first verse to the coronation, following Bibek Debroy's translation of the Critical Edition. Every painting is drawn in code as flat gouache cut-outs in the manner of Indian folk and miniature painting (lotus-eyed profile faces, patterned cloth, spirals, sunbursts, scalloped arches), then painted over in WebGL.

Open `ramayana/index.html` for the gallery and `ramayana/view.html?p=<n>` for one painting. Finished stills are in `ramayana/images/` (2400x1350 JPEG) and `ramayana/ramayana-100-paintings.zip`.

## How a painting is made

1. A scene in `paintings/*.js` calls `R.add(meta, draw)`. `meta` holds number, slug, kanda, chapter reference, title and caption. `draw(P)` pushes SVG onto four depth layers (`P.sky`, `P.bg`, `P.mid`, `P.fg`), marks water with the flow mask, and places light cues (`P.glow`, `P.fire`, `P.rays`, `P.fx.tint`).
2. `engine/shader.js` rasterises the layers to textures and composites them with parallax, then runs the shader stack: hand-cut edge wobble, line boil, flowing water, gouache mottling and dry-brush, pigment pooling at edges, gold-leaf shimmer (keyed on the reserved colour `C.gold`), god rays, lamp glow, fire with embers, drifting motes, a pointer lantern, paper grain and vignette. Each one can be switched off in the viewer's Shaders panel.
3. `R.put(P, layer, name, opts, note)` places a cast member and registers a "Who's who" pin; `P.note(x, y, name, text)` adds a pin for anything else.

## Engine

- `engine/kit.js`: palette `R.C`, seeded random, pattern fills `R.pat`, ornament primitives (spiral, burst, band, cusped arch, paisley, flame, speed lines, impact, streamers), `R.sil` silhouettes, and the `R.Painting` context.
- `engine/figures.js`: the figure kit. `R.fig` draws a paper figure from joint angles or hand targets (`POSES` has about forty), with profile, frontal, vanara and bear heads, costumes, held items (`R.item`), extra arms and heads for Ravana. `R.CAST` holds the recipes: `rama` and `ramaX` (exile), `sita`, `sitaX`, `sitaL` (Lanka), `lakshmana`, `hanuman`, `ravana` and so on. `R.crowd` fills a row with townsfolk, soldiers, vanaras or rakshasas.
- `engine/world.js`: skies by time of day, ground, peaks, water, trees and groves, arcades, palaces, cities, Lanka, huts, altars, thrones, the causeway and the colossus.
- `engine/beasts.js`: horse, elephant, deer, the great bird (Jatayu, Garuda, Sampati), swan, crane, peacock, snake, makara, lion, chariot, the Pushpaka, boat, Shiva's bow.
- `engine/sets.js`: ready-made stages `R.S.forest`, `R.S.court`, `R.S.sea`, `R.S.field`.

## Tools

```bash
node ramayana/tools/check.mjs                 # every layer parses as XML, no NaN/undefined
node ramayana/tools/export.mjs                # all stills to ramayana/images + paintings.json
node ramayana/tools/export.mjs --only 54,83 --scale 0.6 --out /tmp/x   # quick look at two
python3 ramayana/tools/package.py             # thumbnails + the zip
python3 ramayana/tools/sheet.py <dir> out.jpg 3   # contact sheet
```

## The film

`ramayana-film.mp4` (10 min, 720p) moves a slow camera through every painting with the shaders running live. `view.html?film=1` exposes `window.__film.load(n)` and `.draw(u, secs)`; `tools/film.mjs` steps it frame by frame into ffmpeg and `tools/score.py` synthesises the score (tanpura drone, a flute line in Bhupali, a frame drum for the war) in numpy.

```bash
node ramayana/tools/film.mjs --from 1 --to 25 --title --out seg1.mp4   # run slices in parallel, then concat
python3 ramayana/tools/score.py score.wav 607
```

## Fidelity notes

- Captions are our own retelling; `ref` gives kanda and sarga in the Critical Edition numbering Debroy uses.
- Things that are popular but not in Valmiki are left out or flagged: there is no line drawn by Lakshmana (50), Shabari does not taste the fruit (61), the abduction is in a mule-drawn sky-chariot rather than the Pushpaka (53), and the "ten vices" reading of Ravana's heads (46) is labelled as later tradition.
- Rama and Lakshmana wear bark from painting 25 and matted hair from the Ganga crossing (29); Sita keeps her ornaments in exile, as the text has it, and has none in Lanka.
