# Learning from Rama: a daily vertical reel from Valmiki's Ramayana

One 45 to 60 second, 1080x1920 reel a day. Each reel teaches one lesson from Rama, grounded in a real shloka of
Valmiki's Ramayana (quoted in Devanagari with kanda, sarga and verse), told for kids and adults in a fast, Gen Z
register: hooks, plot twists, stickers, kinetic captions, zoom punches on the beat, a desi-trap score. The pictures
are centuries-old public-domain Ramayana paintings (Mewar, Pahari, Orchha, Kangra, Raja Ravi Varma) given one
shared paint-and-ink treatment.

## Make a reel

```bash
pip install kokoro-onnx soundfile numpy scipy pillow
mkdir -p ~/models && cd ~/models && \
  curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx && \
  curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin; cd -
# Playwright + Chromium and ffmpeg must be installed
reels/tools/make_reel.sh reels/days/<slug>        # verify, art, paint, audio, stills, render, caption, deliver
```

Outputs in `reels/days/<slug>/`: `reel.mp4` (with the original score), `reel_nomusic.mp4` (voice and effects only,
for adding a track from Instagram's music library), `poster.jpg`, `caption.txt` (caption, hashtags, verse
reference, art credits, music suggestions), `still-*.jpg`. `make_reel.sh` copies the four deliverables to
`/mnt/project-files/ramayana-reels/<slug>/` when that folder exists.

## The daily routine

1. Read `reels/lessons.json`; take the first lesson whose `used` is empty. If fewer than five are left, add new
   ones first: find the verse with `python3 reels/tools/verse.py search "<Devanagari words>"`, type it in clean
   joined Devanagari, and confirm with `verse.py check`. Only verses that pass go in the bank.
2. Pick the format: rotate through the formats below so no two days in a row look the same.
3. Write `reels/days/dNNN-<slug>/reel.json` (copy the closest earlier day). Day number = highest existing + 1.
4. Pick art from `reels/library/library.json` (`{"lib": key}`, cached, no network). Only if nothing fits, search
   Commons with `fetch_art.py search` and add the file to the library; Wikimedia throttles bursts, so the
   library is the default.
5. `reels/tools/make_reel.sh reels/days/<slug>`; look at the stills before the full render.
6. Mark the lesson `used` with the slug, commit, push, and post the reel in the project thread.

## Accuracy rules (non-negotiable)

- Every shloka is checked against the full Sanskrit text in `reels/data/valmiki/` (IIT Kanpur's Valmiki
  Ramayana, via DharmicData) by `verse.py verify`; `make_reel.sh` stops if it fails. Never quote from memory.
- Story beats must be things Valmiki actually says. Note the sarga in `context`. No later retellings presented
  as Valmiki (no squirrel, no Lakshman rekha, no "api svarnamayi Lanka").
- The English rendering is ours and says so in `caption.txt`; keep it close to the Sanskrit.
- Family-safe: violence happens in a cut or a sticker, never lingered on. Respectful of Rama, Sita and the
  text: the Gen Z voice jokes about *us*, not about the gods.

## Formats (rotate)

| format | shape | example |
|---|---|---|
| POV storytime | "POV:" hook, PLOT TWIST, story, verse, lesson, modern flex, CTA | d001 Lost a kingdom, kept the vibe |
| green flag / red flag | ✅ badges for what Rama does, 🚩 self-roast for what we do | d002 Green flags, Valmiki edition |
| numbered listicle | "3 life hacks", #1 #2 #3 badges each with its verse reference | d003 Rama's 3 life hacks |
| Hinglish storytime | Hindi voice (`lines` with `hi` for the voice, `cap` for Roman captions) | d004 Round 1 |
| villain's side admits it | an enemy's own words about Rama (Maricha, Aranya 37.13) | |
| "Rama would never" | a modern bad habit, then the verse that shows the opposite | |

## reel.json

- `verse`: `kanda` (bala, ayodhya, aranya, kishkindha, sundara, yuddha, uttara), `sarga`, `shloka`, `sanskrit`
  (two lines, `\n`), `iast`, `translation`.
- `art`: key → `{"lib": "<library key>"}`.
- `beats[]`: `kind` (hook, twist, story, verse, lesson, flex, cta; this sets the music energy), `art`, `cam`
  (`[[x, y, zoom], [x, y, zoom]]`: focus point in the image and zoom at the start and end), `vo` (English
  narration) or `lines` (Hindi), `top` + `title` (big text, `hl` regex picks gold words), `badge`
  (`text`, `emoji`, `color` green|red|gold|saffron, `ref`), `pops` (`at` word → `sticker` emoji, optional `sfx`),
  `sfx` (boom, riser, scratch, bell, shankh, sparkle, thunder, pop), `fx` (flash, embers, rays, moon, glitch,
  shake, desat, ink), `min` (minimum seconds).
- `voice` (Kokoro, default af_heart), `speed`, `bpm`, `raga` (bhairavi, yaman, desh, darbari, ...), `seed`,
  `tag` / `cta_sub` (header and CTA text overrides), `caption`, `hashtags`, `music_suggestions`.

## Engine

- `tools/verse.py`: lookup, search, check, verify against the Sanskrit corpus.
- `tools/fetch_art.py`: Commons search with a licence filter (PD, CC0, CC BY, CC BY-SA only), the shared
  library cache, credits.
- `tools/prep_art.py`: the paint-and-ink look (flattened colour, ink outlines from the image's own edges, paper).
- `engine/build_audio.py`: Kokoro narration (phrase timing exact, word timing estimated), Sanskrit recitation in
  a temple reverb, the desi-trap score (808, claps, hat rolls, tabla, tanpura, sitar, choir, from the Mahagatha
  sound engine), ducking, SFX; writes `reel.wav`, `reel_nomusic.wav`, `timeline.json`.
- `engine/reel.js` + `player.html`: the canvas renderer. Instagram safe zones respected (no text in the bottom
  380px or the right 140px).
- `engine/render.mjs`: headless Chromium to ffmpeg, both MP4s and the poster.

## Music

The baked-in score is original, so reels are never muted or claimed. Bollywood songs ripped from YouTube would be
copyright-claimed or muted on Instagram; instead each reel lists suggested tracks to add from Instagram's own
licensed music library at posting time, on top of `reel_nomusic.mp4`.
