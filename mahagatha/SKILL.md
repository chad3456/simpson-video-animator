# Mahagatha: pichwai-style Hindi mythology films

A twelve-episode Hindi series adapted from *Mahagatha: 100 Tales from the Puranas* (Satyarth Nayak, Hindi translation by Ashutosh Garg). Every frame is drawn live as SVG in the visual language of Nathdwara pichwai and Rajput miniatures: flat jewel colours, fish-shaped frontal eyes, gold halos, patterned textiles, painted borders.

## Episodes

| # | slug | title | stories |
|---|------|-------|---------|
| 1 | e01-aadi | आदि | creation, Madhu-Kaitabh, Rudra, Brahma cursed |
| 2 | e02-ardhanarishvara | अर्धनारीश्वर | Hari-Hara, Ardhanarishvara, Manu, the fifth head, the pillar of fire |
| 3 | e03-sati | सती | Chandra, Daksha, Sati, Veerabhadra |
| 4 | e04-avatar | अवतार | Matsya, Varaha, Narasimha |
| 5 | e05-tarakasur | तारकासुर | Parvati, Kama, Kartikeya |
| 6 | e06-amrit-manthan | अमृत-मंथन | the churning, Mohini, Rahu, Bhasmasura |
| 7 | e07-shakti | शक्ति | Ganesha, Durga and Mahishasura, Raktabeej and Kali |
| 8 | e08-teen-pag | तीन पग | Vishwamitra, Trishanku, Vamana |
| 9 | e09-gangavataran | गंगावतरण | Sagar, Bhagirath, Parashuram |
| 10 | e10-lanka | लंका | Kuber, Ravana and the linga, Sita's curses, Maya Sita |
| 11 | e11-kanha | कान्हा | Krishna's birth, Kaliya, Govardhan |
| 12 | e12-rin | ऋण | Sudama, the end of the Yadus, Janamejaya's serpent sacrifice |

## Make an episode

```bash
python3 mahagatha/engine/screenplay.py mahagatha/episodes/<slug>/screenplay.txt   # -> episode.json
python3 mahagatha/engine/build_audio.py mahagatha/episodes/<slug>/episode.json     # -> episode.wav + timeline.json
node engine/render.mjs mahagatha/episodes/<slug> --player mahagatha/engine/player.html --stills 60,300
node engine/render.mjs mahagatha/episodes/<slug> --player mahagatha/engine/player.html   # full MP4
python3 mahagatha/engine/make_script.py mahagatha/episodes/<slug>                  # readable script.md
```

Long episodes can be rendered in pieces with `--from`, `--to` and `--out`, then joined with ffmpeg's concat demuxer and muxed with `episode.wav`.

## Engine

- `engine/figures.js`: the figure kit. `CAST` holds every character as a recipe (skin, crown, heads, arms, textiles, ornaments, held items); `POSES` gives the arm poses; `creature()` draws lions, bulls, horses, swans, fish and more.
- `engine/sets.js`: painted backdrops (`temple`, `court`, `glade`, `pond`, `ocean`, `kailash`, `lotusSky`, `pillarSky`, `cosmos`, `void`, `yajna`, `card`), with `time=day|dawn|dusk|night`.
- `engine/fx.js`: live set pieces, e.g. `shesha`, `churn`, `falls`, `hill`, `vat`, `reeds`, `city`, `serpent`, `snakerain`, `ouroboros`, `throne`, `kite`, `arrow`, `fire`, `rays`, `mandala`, `water`, `rain`.
- `engine/pichwai.js` + `player.html`: scene graph, tweening, camera, captions and cards.
- `engine/build_audio.py`: Kokoro voices with per-character blend, pitch, formant and effect (`divine`, `growl`, `child`, `cave`, `storyteller`...), plus procedural raga cues, ambience and SFX.
- `cast.json`: speaker → voice and figure.

## Screenplay format

```
== SCENE id | set=court time=night music=curse amb=night trans=mandala tint=#0a0a1a,0.35
@ krishna2 x=760 y=660 s=0.95 face=-1 pose=flute emo=serene seat=lotus item=flute   # a character
@ c1 kind=creature creature=cow x=620 y=690 s=0.7                                  # a creature
+ vat kind=vat x=760 y=700 s=1.2 z=-3                                              # an FX element
> krishna2 pose=bless emo=serene t=0.6                                             # tween props
- vat od=2                                                                         # remove (fade)
BEAT 1.2 [wide] (sfx=om, shake=4)                                                  # silent hold
KRISHNA2 (calm, pose=bless) [~close:krishna2] (sfx=bell): डरो मत।                  # a spoken line
NARRATOR [~at:640,330,1.15]: ...
```

Shots: `wide`, `mid:X`, `close:X`, `ecu:X`, `full:X`, `two:A,B`, `at:x,y,zoom`; a leading `~` makes the camera drift. Cards: `== OPEN`, `== TITLE`, `== CHAPTER`, `== NEXT`, `== END`. Point `close:` shots at characters; for FX elements use `at:`.

## Style rules

- Spectacle first: every story gets at least one set piece built for it.
- Each character keeps one voice for the whole series; divine beings get reverb, demons growl, children are pitched up.
- Violence happens offscreen: darkness, flashes, sound and the narrator carry it.
- Narad is the storyteller who opens and closes each episode and links it to the next.
