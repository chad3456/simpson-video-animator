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

Fifteen narrative scenes from the Valmiki Ramayana live in `src/events/` and render to `out-events/` (see `out-events/contact-sheet.jpg`). Each file's header comment cites its kanda and context. They share the engine, kit and `src/figures.js` (full figures, vanaras, elephant, chariot, palaces, crowds, waves).

```
node render.js --set=events            # all 15
node render.js 08-lanka-burns --set=events
```

Note on scene 14: in Valmiki, Rama enters Ayodhya on a chariot and Sugriva rides the elephant Shatrunjaya; the royal-elephant procession follows the popular retelling as requested.
