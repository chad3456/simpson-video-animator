# Mahabharata: Dharma Above All Bonds

A four-minute cinematic short. Every frame is painted in code with [p5.js](https://p5js.org) and [p5.brush](https://github.com/acamposuribe/p5.brush), then animated in code and rendered to MP4.

The look: watercolour skies and sets washed in with p5.brush fills, heroes as shadow-puppet silhouettes with gold crowns, jewels and coloured cloth, painted ink lines, a rim light taken from each figure's mask, paper grain and a 2.2:1 letterbox. Krishna is the only figure painted in full colour until the Vishvarupa.

## Story

1. Prologue: Kurukshetra, the title.
2. The heroes, each with a name card and a set built for them: Bhishma (storm over the Ganga), Yudhishthira (the wheel of dharma), Bhima (wind and boulders), Arjuna (the bird's eye), Draupadi (born of fire), Karna (son of the Sun), Duryodhana (the serpent banner), Krishna (moonlit Vrindavan).
3. The fall: the dice game, Draupadi's endless sari, exile, the refused needle-point of land, the armies gather.
4. The Gita: Arjuna's despair, Krishna's answer, the Vishvarupa ("I am Time").
5. The war: Bhishma's bed of arrows, Abhimanyu in the chakravyuha, Karna's wheel, the mace duel.
6. Dawn: "Yato dharmas tato jayah. Where there is dharma, there is victory."

## Make it

```bash
pip install kokoro-onnx soundfile scipy opencv-python-headless   # models in ~/models (kokoro-v1.0.onnx, voices-v1.0.bin)
python3 mahabharata/engine/audio.py                               # voices + score -> build/film.wav, build/timeline.json
python3 mahabharata/engine/jobs.py plates > mahabharata/build/plates.json
(cd mahabharata/engine && node paint.mjs ../build/plates.json --workers 3)    # paint every plate (p5.brush, headless Chromium)
python3 mahabharata/engine/jobs.py anim > mahabharata/build/anim.json
(cd mahabharata/engine && node paint.mjs ../build/anim.json --workers 3)      # paint every animation frame
python3 mahabharata/engine/compose.py --stills 30,60                # review frames -> build/stills/
python3 mahabharata/engine/compose.py                               # the film -> build/mahabharata.mp4
python3 mahabharata/engine/make_script.py                           # script.md
```

`paint.mjs` needs Playwright (`engine/node_modules` can be a symlink to any install). Painting skips files that already exist, so delete a plate to repaint it.

## Files

- `film.json`: the shot list. Each shot has narration lines, music cue, sound effects, a camera move (`cam: [[x, y, zoom], [x, y, zoom]]` in 1600 x 900 plate space), and layers. A layer is a `plate` (painted once) or `anim` (painted every `every` frames); `b: "add"` layers are painted on black and added as light; `d` is parallax depth; `mv` moves a layer; `rim` and `glow` light it from its mask; `t` shows it only in a time window (pose changes).
- `engine/kit.js`: the painter (washes, ink, hatching, mask recording), the figure kit (skeleton poses, profile heads with fish eyes, crowns, beards, dhoti, scarves, bow, mace, spear, flute, wheel), Draupadi's figure, and sets (skies, clouds, sun, hills, armies, rivers, palace with shikharas, fire, stars, galaxies, pillars, chariot, horse).
- `engine/shots.js`: every layer of every shot, as p5.brush drawing code.
- `engine/paint.html` + `engine/paint.mjs`: the headless painter; writes `build/plates/*.jpg|.mask.png` and `build/anim/<shot>_<layer>/*.jpg`.
- `engine/compose.py`: camera, parallax, motion, rim light, glow, grade, grain, letterbox, name cards, titles, transitions, encode.
- `engine/audio.py`: Kokoro voices (narrator, Krishna, Krishna as Time, Arjuna, Duryodhana) and the score, reusing the Mahagatha synthesiser in `mahagatha/engine/build_audio.py`.
- `engine/lib/`: p5.js 1.11.13 and p5.brush 1.1.4 (MIT).
- `engine/fonts/`: Cinzel, Cinzel Decorative, Cormorant Garamond, Rozha One (all OFL).
