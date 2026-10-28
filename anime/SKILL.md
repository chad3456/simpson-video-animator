---
name: quiet-anime-studio
description: Write, voice and render a quiet slice-of-life anime series (painted sets, cel-shaded characters, piano-and-strings score) from a screenplay, using only open-source tools. Built for "Dostoevsky at the Coin Laundry"; reusable for any two-hander series about books.
---

# Quiet Anime Studio

Turns a short screenplay into a 13 to 15 minute anime episode: painted night sets that are rasterised once, cel-shaded characters with lip-sync and blinks, slow cameras, inserts (book pages with pencilled marginalia, notebooks, manuscripts), Kokoro voices and an original procedural score. Read `SERIES.md` (story bible) and `STYLE.md` (look and sound) before writing.

Original story, characters, designs and music only. Never reproduce a studio's characters, logos or score, and quote public-domain books in your own renderings.

## 0. Toolkit

```
anime/
  SERIES.md, STYLE.md, SKILL.md
  engine/sets.js          painted sets: laundry_int, laundry_ext, bridge, street, sky, room_him, room_her, train, carehome, station, card
  engine/characters.js    character designs, 21 expressions, acts, props, the cat
  engine/anime.js         renderer (window.Toon): shots, inserts, captions, cards (OP, title, eyecatch, ED, next, text)
  engine/player.html      live player (?ep=../episodes/<slug>) and headless render target
  engine/screenplay.py    screenplay.txt -> episode.json
  engine/build_audio.py   voices (Kokoro), score, ambience, SFX -> episode.wav + timeline.json
  engine/make_script.py   episode.json + timeline.json -> script.md
  tools/char_sheet.mjs    quick character test frames
  episodes/<slug>/screenplay.txt   the only file you write per episode
../engine/render.mjs      shared: Chromium frame stepping + ffmpeg (pass --player anime/engine/player.html)
../engine/build_gallery.py  rebuilds episodes/index.json (gallery) from all shows
```

## 1. Write the screenplay

Header keys: `episode, slug, title, kanji, sub, book, season, gap (bench gap in px, shrinks over the season), linegap (pause between lines, 0.62 to 0.75), logline, quote, quoteBy`.

Segments:

```
== SCENE id | set=laundry_int season=winter weather=snow music=night musicVol=0.6 amb=washer,snow washers=1,4 clock=22.0 | caption=Thursday, January.
@ mio slot=benchL emo=soft look=other prop=book bookColor=#3a2a4a     (placement; also later changes from the next line on)
@ cat slot=cat_dryer pose=sleep                                       (slot=none removes him)
@ item basket benchR dx=95
BEAT 2.5 [wide] (sfx=bell)                                            (silent beat; tokens can change emotions: mio=teary)
MIO (tease, act=point) [close:mio]: Line of dialogue.
ITSUKI (thought) [close:itsuki] (look=down): An inner thought (italic caption, filtered voice).
INSERT book 7 | title=... | text=... | right=... | underline=2 | note=Line\nLine\n— G. | noteBy=genzo
MIO (vo) [insert]: A voice over the cutaway below.
+INSERT notebook | title=LOST & FOUND | hand=mio | typeOn=true | text=...
== OP / == TITLE / == EYECATCH / == ED / == CARD | dur=8 | title=... | sub=...
== NEXT | title=... | sub=...      (lines below are voiced over the next-time card)
```

Shots: `wide, two, ext, sky, mid:<id>, mcu:<id>, close:<id>, ecu:<id>, insert, insert:cat`. Flags: `thought, phone, memory, vo`. Acts: `hide, lean, laugh, sip, nod, shake, wave, point, chin, write, rail, cover, stretch`. Looks: `other, front, cam, down, book, away, up, left, right`.

**Length.** Duration is close to `0.373 s x spoken words + silent beats + 114 s` (OP 52, title 6.5, eyecatch 5, ED 50). For 14.5 minutes aim for about 1,700 spoken words and 100 to 130 s of beats. First drafts usually come in short; check with the parser's word count before voicing.

## 2. Build

```
python3 anime/engine/screenplay.py anime/episodes/<slug>/screenplay.txt
python3 anime/engine/build_audio.py anime/episodes/<slug>/episode.json        # ~3 min, cached per line
node engine/render.mjs anime/episodes/<slug> --player anime/engine/player.html --stills 60,300,600   # review frames
node engine/render.mjs anime/episodes/<slug> --player anime/engine/player.html                       # full mp4, ~25 fps
```

Two renders can run side by side on four cores.

## 3. Package for the gallery

```
cd anime/episodes/<slug>
ffmpeg -i episode.mp4 -c:v libx264 -preset slow -crf 30 -tune animation -c:a aac -b:a 80k -movflags +faststart web.mp4 && mv web.mp4 episode.mp4
ffmpeg -ss 20 -i episode.mp4 -frames:v 1 -q:v 4 poster.jpg
ffmpeg -i episode.wav -b:a 96k episode.mp3
python3 ../../engine/make_script.py episode.json > script.md
python3 engine/build_gallery.py      # from the repo root
```

Commit everything except `*.wav`, `.voice-cache/` and `still-*.png`. Add new episode folders only; never delete or overwrite a past episode.

## 4. Writing rules that matter

- Each episode is one book or one character, discussed honestly (plot, quotation, a criticism), and the discussion is always secretly about the two people on the bench.
- One pencilled marginal note from the late grandfather per episode. They are the third voice.
- Long silences are content. Put the important reply after a 3 to 4 second beat.
- Keep the feelings unspoken. Teasing, gifts, notebooks and timing carry them.
- When an adult and a minor share the screen, the adult keeps the line: public places, no secrets from her parents, no physical romance, ever. Restraint is part of who he is, and the story says so.
