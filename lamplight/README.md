# Lamplight: a Ramayana in shadow

An immersive Ramayana told as a leather shadow-puppet play, in two forms that share one engine:

* **Live** (`index.html`, built into `dist/lamplight.html`): you hold the lamp. The pointer moves the flame behind the cloth, and the shadows move with it. Nine acts, about 12 minutes, each with one moment that waits for you: light the wick, bend Shiva's bow, lead Rama into the forest, pull the light aside to see the demon in the golden deer's shadow, tap to help Jatayu, follow Sita's falling jewels, bring the lamp close so Hanuman's shadow grows into the clouds, throw the floating stones, sweep Ravana's heads, hold the light on his heart, and carry your flame from lamp to lamp in Ayodhya until nothing casts a shadow. "Behind the screen" (key B) turns the theatre round to show the puppets, sticks and lamp from the player's side. "Let the puppeteer play it" runs it hands-free.
* **Film** (`build/lamplight.mp4`, 7:19): the same performance with the puppeteer holding the lamp, narration, score, burned-in captions and cutaways behind the screen.

The look follows Tholu Bommalata, the translucent coloured leather puppets of Andhra Pradesh: heavy black cut lines, punched holes that let the light through, and one oil lamp. The text follows Valmiki's Ramayana, plus the squirrel at the bridge from the folk tellings.

## How the light works

The cloth is 1600 x 900 units. A puppet held at depth `d` behind the cloth, lit by a lamp at distance `z`, throws a shadow scaled by `z / (z - d)` around the lamp's position and blurred by the flame's size. Puppets pressed on the cloth (`d = 0`) show their colours by multiplying with the lit cloth; puppets held back show as soft dark shadows. Bringing the lamp closer (smaller `z`) makes held-back shadows grow, which is how Hanuman grows.

## Files

| File | What it is |
|---|---|
| `kit.js` | Puppet kit: people, Ravana's ten heads, Hanuman, deer, vulture, squirrel, chariots, palaces, waves, diyas |
| `engine.js` | Theatre renderer (front and backstage views), film scheduling, and the sound engine (tanpura, flute, mridangam, wooden clappers, effects) used by both the page and the film |
| `story.js` | The nine acts: narration lines, interaction steps, effects and the drawing for each act, all driven by one progress value `p` |
| `index.html` | Live page (loads the three scripts and `audio/*.mp3`) |
| `film.html` | Headless render target for the film |
| `tools/voice.py` | Kokoro narration, one clip per line, plus `build/durations.json` |
| `tools/render.mjs` | Renders the soundtrack (OfflineAudioContext) and frames (Playwright) into `build/lamplight.mp4` |
| `tools/build_live.py` | Inlines scripts and narration into the single-file `dist/lamplight.html` |
| `tools/make_script.js` | Writes `script.md` with timecodes |

## Rebuild

```
pip install kokoro-onnx soundfile         # models in ~/models: kokoro-v1.0.int8.onnx, voices-v1.0.bin
python3 tools/voice.py                     # narration
NODE_PATH=$(npm root -g) node tools/render.mjs --workers 4   # film
python3 tools/build_live.py               # live page
node tools/make_script.js                 # script
```

`node tools/stills.mjs out 3:0.5 5:0.55` renders review stills at act:progress.
