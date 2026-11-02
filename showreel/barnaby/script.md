# Barnaby Plant Burgers: brand identity showreel

**Placeholder brand.** "Barnaby" is a made-up name for this mockup. A quick search found no burger or plant-based brand by that name, but there is a pending US trademark "BARNABY" for candy (Barnaby Candy Company), so a real launch would need trademark clearance. Backup names: Bunsworth, Pattington, Sir Stackley.

- Length: 1:09, 1920x1080, 30 fps, original synthesised soundtrack
- Style reference: the screen recording of an identity reel shared in the project (white type pages with typewriter lines where a word turns into an icon, a balancing stack, logo construction with anchor points, photo cuts with a white brand mark standing on them, a tool UI, huge cropped type, type specimen, mockups and a one-line sign-off)
- Mascot: Barnaby, a burger butler in a bowler hat with a moustache and bow tie. Poses: stand, wave, serve (lifts the cloche), bow (hat in hand), ta-da
- Logo: bowler hat over a moustache, with a lowercase Bricolage Grotesque wordmark
- Fonts: Bricolage Grotesque Bold (display), Instrument Sans (text), DM Mono (labels), all SIL Open Font Licence

## Palette

| Name | Hex | Role |
|---|---|---|
| Tomato | #FF4A2E | Primary, hero background |
| Mustard | #FFC21A | Secondary, hat band, highlights |
| Lettuce | #5FCB3C | Fresh accent, anchor points, UI |
| Beet | #C2185B | Deep magenta, specimen, merch |
| Radish | #FF8FB8 | Soft pop, cheeks, social |
| Bun | #FFF1DC | Light neutral, paper stock |
| Peppercorn | #1F1420 | Dark anchor, type and outlines |

## Shot list

| Time | Section | What happens |
|---|---|---|
| 0:00 | Stack open | A file name types (`brgr_01`, `stck_3`, `brnby_v4`) while bun, patty, tomato, lettuce, bun and hat drop and balance; the face and bow tie appear |
| 0:06 | Typewriter | "We serve [burger] from the ground up, to [Barnaby chip] the whole neighbourhood." |
| 0:13 | Photo cuts | Veggie burger, fresh vegetables, green field, each with a white Barnaby standing on the photo |
| 0:17 | Logo build | Hat and moustache outlines draw on a grid with green anchor points and handles, fill, then the "barnaby" wordmark and "PLANT BURGERS · EST. 2026" |
| 0:24 | Photo cuts | Street or storefront (Barnaby serves), hands with a burger (waves), friends at a table (bows) |
| 0:28 | Mascot studio | A pose-library tool: preview panel, canvas, sliders for hat tilt, bow depth and moustache, swatches; cycles through all five poses |
| 0:34 | Hero | On Tomato: "Plants, at your [cloche]." then huge "at your service" slides past Barnaby, then a giant "b" with ascender, x-height and baseline guides next to a Beet card |
| 0:41 | Type specimen | A to Z, a to z, figures on Beet; extended glyph set on Lettuce |
| 0:46 | Palette | Seven ingredient stripes rise in turn; Barnaby waves in front |
| 0:50 | Icons | "Tipping our [hat] to plants, stacked high with [tomato] and manners." over a 12x4 icon grid with moving highlights |
| 0:55 | Packaging | Clamshell, cup and bag on Mustard: "Made from peas, beets & good manners." |
| 0:59 | Merch | Peppercorn tee "Your burger is ready, sir." on Radish |
| 1:02 | Billboard | "Ring the bell for seconds." poster on a wall photo |
| 1:04 | Sign-off | "Dinner is [cloche]. Kindly." then the logo lock-up and "PLANTS, AT YOUR SERVICE." |

## Copy

Hero line "Plants, at your service." and the typewriter lines were written in a polite butler voice. The copy makes no health, nutrition or sustainability claims, because those would need evidence.

## Photos

Photo scenes read `photos/credits.json` (fields: `key`, `file`, `title`, `author`, `license`, `license_url`, `source_page_url`). Slots used: `burger`, `ingredients`, `field`, `street`, `hands`, `friends`, `wall`. A slot without a photo renders as a labelled "PHOTO SLOT" card, so the preview never passes off a stand-in as a real photo.

## Rebuild

```
node render.mjs --stills 5,20,37      # review frames into stills/
node -e "global.window={};global.document={};require('./reel.js');require('fs').writeFileSync('cuts.json',JSON.stringify({duration:window.Reel.duration,cuts:window.Reel.cuts}))"
python3 build_audio.py                 # showreel.wav
node render.mjs --out showreel.mp4     # full render
```

Open `reel.html` in a browser for a live, looping preview.
