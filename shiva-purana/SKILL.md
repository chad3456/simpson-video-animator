# Shiva Purana: a moving comic book, in English with a Hindi dub

Ten tales of Mahadeva from the Shiva Purana, told as cinematic 2D comic-book animation: inked, cel-shaded figures
with halftone shadows, painted sets, comic panels and camera moves, yellow narration captions, speech, thought,
shout and divine balloons, and big SFX lettering. Every episode is built twice: in English and dubbed into Hindi,
with the balloons, captions, cards and sound-effect words lettered in the episode's language.

Source: *Shiva Purana*, Volume 1, translated by Bibek Debroy (Shiva Purana Mahatmya, Vidyeshvara Samhita, Rudra
Samhita Srishti, Sati and Parvati Khandas). Suta tells each tale to the sages of Naimisha forest.

## Episodes

| # | slug | Title | हिंदी | Source |
|---|------|-------|-------|--------|
| 1 | e01-pillar-of-fire | The Pillar of Fire | अग्नि-स्तंभ | Vidyeshvara Samhita 6 to 9: Brahma and Vishnu's war, the column of fire, the ketaki's lie, Bhairava, Shivaratri |
| 2 | e02-naradas-pride | Narada's Pride | नारद का अभिमान | Srishti Khanda 2 to 4: Kama fails, Narada boasts, the maya city, the monkey face, the curse on Vishnu |
| 3 | e03-thief-and-lamp | The Thief and the Lamp | चोर और दीपक | Srishti Khanda 17 to 19: Gunanidhi, the lamp on Shivaratri, Yama's men and Shiva's, King Dama, Kubera |
| 4 | e04-chanchula | Chanchula | चंचुला | Mahatmya 3 to 5: Chanchula at Gokarna, Binduga the pishacha, Tumburu's recital |
| 5 | e05-dakshas-daughter | Daksha's Daughter | दक्ष की पुत्री | Sati Khanda 14 to 25: Sati's vow and wedding, Rama's test, the silent vow |
| 6 | e06-the-uninvited | The Uninvited | बिन बुलाए | Sati Khanda 26 to 31: the insult at Prayaga, Daksha's sacrifice, Dadhichi, Sati's yogic fire, the Ribhus |
| 7 | e07-virabhadra | Virabhadra | वीरभद्र | Sati Khanda 32 to 43: the lock of hair, Virabhadra and Mahakali, the battle, Daksha's goat head |
| 8 | e08-burning-of-kama | The Burning of Kama | कामदेव का दहन | Parvati Khanda 6 to 19: Parvati's birth, Narada's prophecy, Taraka, the third eye, Rati |
| 9 | e09-parvatis-penance | Parvati's Penance | पार्वती की तपस्या | Parvati Khanda 22 to 30: Uma, Aparna, the seven sages, the young ascetic |
| 10 | e10-wedding-of-shiva | The Wedding of Shiva | शिव विवाह | Parvati Khanda 43 to 55: Mena on the roof, the ganas, Shiva's beautiful form, Kama revived |

Each episode folder holds the English version (`episode.json`, `episode.wav`, `timeline.json`, `episode.mp4`,
`poster.jpg`, `script.md`) and the Hindi dub in `hi/` with the same files. The gallery streams them from the
`videos` release as `shiva-purana_episodes_<slug>.mp4` and `shiva-purana_episodes_<slug>_hi.mp4`, and the watch page
has an English / हिंदी switch.

## Make an episode

```bash
python3 shiva-purana/engine/screenplay.py shiva-purana/episodes/<slug>/screenplay.txt   # -> episode.json + hi/episode.json
node shiva-purana/tools/check.mjs shiva-purana/episodes/<slug>/episode.json            # unknown poses, figures, sets, fx, cameras
python3 shiva-purana/engine/build_audio.py shiva-purana/episodes/<slug>/episode.json     # English: episode.wav + timeline.json
python3 shiva-purana/engine/build_audio.py shiva-purana/episodes/<slug>/hi/episode.json  # Hindi dub
node engine/render.mjs shiva-purana/episodes/<slug> --player shiva-purana/engine/player.html --stills 60,200
node engine/render.mjs shiva-purana/episodes/<slug>[/hi] --player shiva-purana/engine/player.html --crf 27
python3 shiva-purana/engine/make_script.py shiva-purana/episodes/<slug>[/hi]          # script.md
python3 shiva-purana/tools/gallery.py                                                    # refresh the gallery entries
```

`shiva-purana/tools/lane.sh audio|render en|hi <slug> ...` runs a language through a list of episodes (render also
makes the poster from the issue cover and the script). Run one lane per language side by side. `--crf 27` keeps an
8-minute episode well under GitHub's 100 MB file limit.

## Engine

- `engine/figures.js` (`CBFig`): the comic figure kit. Inked outlines, flat cel colour, halftone shadow (`#cbDots`),
  a 3/4 head turn, one-piece arms solved by two-bone IK. `CAST` (about 70 looks) holds the iconography:
  Shiva (ash-blue, jata with crescent and Ganga, third eye and tripundra, serpent, rudraksha, blue throat, tiger
  skin, trishul with damaru in the left hand, right hand in abhaya); Vishnu (blue, kirita, four arms with chakra
  upper right, shankha upper left, padma lower right, gada lower left, pitambara, vanamala, Kaustubha); Brahma (four
  faces, frontal plus two profiles and one behind; `brahma5` adds the fifth head before Bhairava humbles him; sruva,
  Vedas, mala, kamandalu). Slot convention: R is the character's right hand, which is screen-left.
  `POSES`, `ITEMS`, and `creature()` for Nandi, the swan, the boar, parrot and deer.
- `engine/sets.js` (`CBSets`): painted backdrops `cosmos`, `vaikuntha`, `brahmaloka`, `kailash`, `himalaya`, `court`
  (`col=`), `yajna`, `temple`, `city`, `forest`, `kashi`, `hell`, `vindhya`, `sky`, `void`, `pond`, `card`;
  most take `time=day|dawn|dusk|night`.
- `engine/fx.js` (`CBFx`): `pillar`, `fire`, `yogafire`, `glow`, `burst`, `rays`, `speedlines`, `sparkle`, `petals`,
  `snow`, `ketaki`, `lingam`, `lamp`, `smoke`, `dust`, `beam`, `clash`, `ash`, `vimana`, `crowd`, `mirror`, `dice`,
  `coins`, `platter`, `om`, `lock`, `noose`, `waves`, `shesha`, `item` (`name=chakra`) and more.
- `engine/comic.js` (`Toon`): the page. The world is drawn once and shown through one to three panels (`panel=split`
  or two cameras `[a|b]`, `triple`, `inset`), each with its own camera, a pop-in on every cut, push-in drift, `dutch`,
  `shake`, `speed` lines and `tint`. Lettering is language-aware (`meta.lang`), with Kalam for balloons and captions
  and Bangers (English) or Rozha (Hindi) for titles and SFX. Transitions: `wipe` (default), `fade`, `flash`, `ink`, `cut`.
- `engine/build_audio.py`: wraps the Mahagatha sound engine (raga score, ambience, SFX, voice treatments) with a
  language-aware Kokoro call (`en-us`/`en-gb` or `hi`).
- `cast.json`: speaker → label/label_hi, figure, English `voice` and Hindi `voice_hi` blends, speed, pitch, formant, fx.

## Screenplay format

Same staging as Mahagatha, with both languages on every line:

```
title: The Pillar of Fire
title_hi: अग्नि-स्तंभ
== TITLE | dur=7 | kicker=Issue One | kicker_hi=पहला अंक | title=The Pillar of Fire | title_hi=अग्नि-स्तंभ | figs=brahma5,vishnu
== SCENE war | set=cosmos music=battle amb=storm trans=ink | caption=Before time began | caption_hi=समय के आरंभ से पहले
@ brahma fig=brahma5 x=300 y=660 s=0.9 face=1 pose=strike emo=rage
+ c1 kind=clash x=640 y=330 s=1.4 z=60
> brahma pose=fear emo=shock t=0.4 d=0.5
BEAT 1.8 [wide] (sfx=boom, shake=10, flash, bang=KRA-KOOM!|धड़ाम!, bangPos=640,180)
VISHNU (rage, pose=raise) [low:vishnu] (shout): Then face the Maheshvara weapon! || तो अब माहेश्वर अस्त्र का सामना करो!
NARRATOR [mid:brahma|mid:vishnu] (capPos=bottom): ... || ...
```

- Narrator lines become yellow caption boxes (`capPos=top|bottom|right`); other speakers get balloons pointing at
  their head. `(think)` makes a thought balloon, `(shout)` or `rage` a jagged one, `(sky)` or a `divine` cast entry a
  gold-framed divine balloon. A speaker with no figure on screen gets a name tag.
- Cameras: `wide`, `mid:X`, `close:X`, `ecu:X`, `full:X`, `low:X`, `two:A,B`, `at:x,y,zoom`; a bare id means `mid:`.
  Two cameras separated by `|` split the page into two slanted panels.
- Card text, captions and credits take `_hi` twins; put each `key=value with spaces` in its own `|` part.
- Element ids that speak should match the speaker id (lip-sync); use `fig=` for another look (`fig=naradmonkey`).

## Style rules

- Faithful to Debroy's text, told plainly for a general audience; adult material (Chanchula, Brahma's desire) is
  handled with tact.
- Violence happens offscreen or in silhouette: flashes, SFX lettering and the narrator carry it.
- Each character keeps one look and one voice per language for the whole series.
- Suta opens and closes each issue in Naimisha forest and teases the next one.
