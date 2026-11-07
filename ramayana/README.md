# Ramayana pop-up book

A short (about 3 minute) narrated retelling of the Ramayana in a flat, cut-paper pop-up book style: an open book
lies in a pastel room drawn in faint line art; at each page turn a bright diagonal colour band sweeps in the next
page's palette and a diorama of flat figures, trees and palaces pops up off the pages. Short story beats appear as
white label tags.

Eleven pages: Ayodhya and the four princes, Shiva's bow, the exile, the golden deer, Ravana and Jatayu, Hanuman and
Sugriva, the leap to Lanka, the bridge of stones, the battle, the return and the festival of lamps, and the title.

```bash
python3 ramayana/engine/build_audio.py ramayana/episode/episode.json --models ~/models   # Kokoro voice + raga score -> episode.wav, timeline.json
node engine/render.mjs ramayana/episode --player ramayana/engine/player.html --stills 10,40     # review frames
node engine/render.mjs ramayana/episode --player ramayana/engine/player.html --fps 30 --crf 20  # episode.mp4
```

- `engine/popup.js`: the whole look: book projection, page turn, colour-band wipe, room line art, the figure kit
  (Rama, Sita, Lakshmana, Hanuman, ten-headed Ravana, vanaras, deer, Jatayu) and the eleven scene compositions.
- `engine/build_audio.py`: lays out the timeline, speaks each line with Kokoro, and scores each page with the
  Mahagatha raga cues, plus page-flip and pop-up sounds.
- `episode/episode.json`: the narration, labels, music cue and effects for each page.
