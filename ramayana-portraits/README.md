# Ramayana Portraits

Fifteen painterly portraits from the Ramayana, generated procedurally with plain JavaScript (Canvas 2D), in the spirit of the expressive-brushstroke Einstein portrait: bold complementary colour fields, thick directional flat-brush strokes, impasto relief and cinematic portrait framing.

| # | Portrait | Moment |
|---|----------|--------|
| 01 | Rama | Maryada Purushottama, blue-skinned, Kodanda bow, saffron sunburst |
| 02 | Sita | Captive in the Ashoka grove, eyes lowered, a single tear |
| 03 | Lakshmana | The sleepless guardian by the night fire |
| 04 | Hanuman | Devotion, mace on shoulder, the sun behind |
| 05 | Ravana | Dashanana: ten crowned heads against burning Lanka |
| 06 | Jatayu | The vulture-king's last flight, wings torn |
| 07 | Valmiki | The first poet, the krauncha birds overhead |
| 08 | Bharata | Rama's golden padukas laid before him |
| 09 | Shabari | The tasted berries, offered with tears of joy |
| 10 | Kumbhakarna | The giant awakens (extreme close-up) |
| 11 | Surpanakha | Fierce in the Panchavati forest |
| 12 | Dasharatha | The promise: grief by lamplight |
| 13 | Kaikeyi | The chamber of anger, jewels thrown off |
| 14 | Mandodari | Queen of golden Lanka by the sea |
| 15 | Agni Pariksha | Sita in the fire, untouched |

## How it works

* `src/engine.js` — the painter. A scene first blocks in a hidden reference image, a focus map and a flow map. The engine then paints it with ~40k flat-brush strokes in coarse-to-fine layers. Strokes follow a flow field (scene flow, face-wrapping contours, luminance gradients), stop at colour edges, carry bristle streaks and jittered multicolour hues. Each stroke also writes a height map that a final lighting pass turns into impasto ridges with a light canvas weave.
* `src/kit.js` — drawing helpers: faces (split complementary lighting, lotus eyes, brows, lips, tilak), crowns, hair, beards, jewellery, bows, arrows, flames.
* `src/scenes/*.js` — one file per portrait.

## Run

* Open `index.html` in a browser to paint any portrait live.
* `node render.js` renders all 15 to `out/*.jpg` (1200×1500) with headless Chromium via Playwright. `node render.js 05-ravana --ref` also saves the hidden reference.

## Events (landscape, 1800×1200)

There are 26 scenes from the Valmiki Ramayana in `src/events/`, numbered in story order. They render to `out-events/`, and `out-events/contact-sheet.jpg` shows all of them. Each file's header comment cites its kanda and gives the context.

The run goes from the yajna of Vishvamitra (01) to the coronation (24), then the Diwali scene (25) and Maryada Purushottama (26). Four of the scenes are silhouettes: 13, 16, 19 and 26.

The scenes share the engine, the kit and `src/figures.js`. That file holds the full figures, the archer (`K.archer`), vanaras, rakshasas, the elephant, chariots, palaces and crowds. It also holds the silhouette set: `K.sil.archer`, `standing`, `sita`, `kneel`, `warrior`, `chariot` and `horse`.

```
node render.js --set=events            # all 26
node render.js 12-lanka-burns --set=events
```

A note on scene 23: in Valmiki, Rama enters Ayodhya on a chariot and Sugriva rides the elephant Shatrunjaya. The royal-elephant procession follows the popular retelling, as requested.

## Video reel

`video/ramayana-reel.mp4` (1920×1080, about 3 minutes) is set to a Shree Ram Stuti recording that the user supplied. That audio is not part of the repo. The reel shows the event paintings in story order with slow pans across each one. It then shows Happy Diwali and closes on Rama's vow of refuge (Yuddha Kanda 18.33).

```
node video/reel.js $PWD video/ramayana-reel.mp4 path/to/stuti-audio
```

The reel's length follows the audio file. `video/music.py` is the original synthesized raga Yaman instrumental used in the first cut.

The fonts are Tiro Devanagari Hindi and Cinzel Decorative, both under the SIL Open Font License.

## Rama and Sita: 30 paintings (`src/ramsita/`, rendered to `out-ramsita/`)

The love story from the first glance in Janaka's garden to the last morning at Panchavati before the golden deer. Fifteen are landscape (1800×1200) and fifteen are vertical (1200×1800). The scenes follow Valmiki, with the garden meeting, Gauri prayer and varamala from the Ramcharitmanas and the forest swing from folk song. The mood takes inspiration from animated Ramayana films, but the compositions and style are original.

Render with `node render.js --set=ramsita` (or pass ids, space separated). `out-ramsita/contact-sheet.jpg` shows all thirty.

## Lord Shiva: 15 paintings (`src/shiva/`, `src/deities.js`, rendered to `out-shiva/`)

Three close portraits (Mahadeva, Neelakantha, Rudra), five vertical scenes (the Yogi of Kailash, Nataraja, the Descent of the Ganga, the Pillar of Light, Dakshinamurti) and seven landscapes (He Drinks the Poison, Shiva and Parvati on Kailash, the Family of Kailash, Rudra Tandava, Nandi Waits, Mahashivaratri, Lord of Kashi). `src/deities.js` holds the iconography: the jata with the Ganga and crescent moon, the third eye over the tripundra, Vasuki, rudraksha, tiger skin, trishul with damaru, Nandi, the lingam, Parvati and Ganesha.

Render with `node render.js --set=shiva`.
