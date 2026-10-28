# Parody Studio

Turn any source into a yellow-toon parody episode, or a calm flat-vector explainer, with free, open-source tools only.

Two shows share one pipeline (Kokoro voices, numpy score and SFX, headless Chromium + ffmpeg):

- **KINDLETON** (root `SKILL.md`, `engine/`, `episodes/`): Simpsons-inspired parody sitcom.
- **LUMEN** (`explainer/`): science-explainer homage with rounded "pebble" creatures, glows, parallax, chapter cards, a calm blended narrator and an ambient score. See `explainer/SKILL.md` and `explainer/STYLE.md`; season 1 covers *Suicidal Empathy* in seven episodes: an overview (`too-kind-to-survive`) and one episode per case-file chapter (`the-things-we-wont-say`, `same-species-different-rules`, `second-chances`, `settled`, `buying-absolution`, `the-kindest-government`). A special, `eight-nights-of-fire`, covers the 2023 French riots through the same lens.

- **MAHAGATHA** (`mahagatha/`): a twelve-episode Hindi mythology series in the style of Indian pichwai and miniature painting, adapted from *Mahagatha: 100 Tales from the Puranas* (Satyarth Nayak, Hindi translation by Ashutosh Garg). Hand-drawn SVG gods, sets and set pieces, a Hindi screenplay format, and distinct character voices blended from Kokoro. See `mahagatha/SKILL.md`.

- `SKILL.md`: the full workflow (ingest, study, brainstorm, script, fairness guardrails, production).
- `engine/`: the renderer and pipeline.
- `index.html`: the episode gallery (static, deploys to Vercel with zero config).
- `episodes/suicidal-empathy/`: the pilot, "Dying to Be Kind", adult cut (bible, script, episode.json, timeline, MP3, MP4).
- `episodes/suicidal-empathy-family/`: the original all-ages script of the same episode.

## Make an episode

```bash
pip install kokoro-onnx soundfile numpy           # open-weight TTS (Apache-2.0), CPU is fine
mkdir -p ~/models && cd ~/models
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
cd -
npm i playwright && npx playwright install chromium   # skip install if you already have Chromium; set CHROMIUM_PATH
# also needs ffmpeg

python3 engine/build_audio.py episodes/<slug>/episode.json --models ~/models
python3 engine/make_script.py episodes/<slug>/episode.json > episodes/<slug>/script.md
node engine/render.mjs episodes/<slug> --stills 5,30,60     # check frames
node engine/render.mjs episodes/<slug>                      # full MP4
```

Watch locally: `npx serve .` then open `/` for the gallery or `/engine/player.html?ep=../episodes/<slug>` for the live player (needs `episode.mp3`: `ffmpeg -i episode.wav -b:a 96k episode.mp3`). After adding an episode run `python3 engine/build_gallery.py`.

## Deploy

Import this repo in Vercel (free Hobby plan), framework preset "Other", no build command, output directory `.`. Every push to `main` redeploys.

## How it works

1. `episode.json` is the whole show: cast looks and voices, scenes, lines, emotions, gestures, camera hints, chalkboard text, news graphics, props and effects.
2. `build_audio.py` voices every line with Kokoro, synthesizes the theme, stings and SFX in numpy, mixes `episode.wav`, and records each shot's timing plus a 30 fps mouth envelope in `timeline.json`.
3. `engine.js` draws any moment `t` as SVG: procedural characters (hair, clothes, glasses, beards, lipstick, kid proportions), blinking, eye-rolls and smirks, listener reactions, walk-on entrances, hand props, head bob, gestures, envelope-driven lip-sync, six sets, a cheering crowd, the Empathy dial, comic bursts, hearts, screen shake, desaturation, iris wipes, auto camera cuts and push-ins, and captions. The soundtrack gets an original plucked-guitar music bed that ducks under dialogue.
4. `render.mjs` steps headless Chromium frame by frame and pipes JPEGs into ffmpeg with the soundtrack.

Everything is original art and music. Fonts: Bangers and Nunito (SIL Open Font License).
