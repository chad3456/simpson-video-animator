# Dune: a triptych

Three philosophical paintings after Frank Herbert's first Dune trilogy, painted procedurally in plain JavaScript (Canvas 2D, rendered headless with Playwright). The look is smooth, atmospheric digital painting: large simple shapes, layered haze, soft glows, directional brush texture, bloom and film grain. Tiny figures stand against vast forms.

- `1-dune`: The Sleeper Must Awaken. A worm rises at dawn before a lone figure on the crest.
- `2-dune-messiah`: The Blind Emperor. Paul walks out of the citadel and into the desert at dusk.
- `3-children-of-dune`: The Golden Path. Leto II, skinned in sandtrout, sees the road of gold across a greening Arrakis.

Render: `node render.js` (writes `out/*.jpg`), then `python3 triptych.py` for the titled poster `out/dune-triptych.jpg`.

## Oil version (realistic)

`oil/` repaints the trilogy as realistic oil paintings. Each scene is first rendered as a lit 3D desert
(raymarched dunes with wind ripples, soft shadows, sky, clouds and fog; the worm, robed figures, Arrakeen and the
Golden Path as distance fields) in `oil/common.glsl` + `oil/scenes/*.js`. `oil/oil.js` then repaints that reference
with layered, contour-following brushstrokes from coarse to fine, bristle streaks, lit impasto and canvas weave.

    node oil/render.js [ids] [--scale=0.5] [--ref-only]   # writes out-oil/{id}.ref.jpg and out-oil/{id}.jpg (~90s each)
    python3 triptych.py out-oil                           # writes out-oil/dune-oil-triptych.jpg
