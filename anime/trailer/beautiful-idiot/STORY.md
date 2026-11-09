# Beautiful Idiot

*A two-minute trailer for an imagined romantic-comedy anime, drawn in a loud retro pop-art collage look: sunbursts, spirals, halftone dots, checkerboard floors, cut-paper ransom letters. Loosely adapted from Dostoevsky's* The Idiot. *Original characters, designs and music.*

## Logline

A thirty-year-old man with no job, no money and no girlfriend, ever, is the happiest person in Tokyo. A twenty-five-year-old heiress with two million followers and four best friends has nobody to call at three in the morning. One fine day they crash into each other on a zebra crossing, and he faints, because she is beautiful.

## The cast

### Haru Mishima, 30 (the "Prince")
- **Look:** soft round face, messy cocoa hair with one antenna curl that sways when he's thinking, huge round brown eyes, a sticking plaster on his cheek, an olive cardigan with a mended elbow patch over a white collar.
- **Backstory:** a childhood illness made him faint at anything too beautiful (sunsets, mostly). His grandmother took him to live in the lighthouse she kept on a small island, where he grew up with the sea, a very handsome goat, and the 3,000 books donated to the lighthouse library. At 30 he has come back to the city with one suitcase and Lev, his pocket cactus.
- **Now:** has failed 41 job interviews by answering every question honestly ("Where do you see yourself in five years?" "Alive, I hope!"). He owns a window, a library card (3,112 books borrowed) and Lev. He is completely content.
- **Voice:** cheerful, literal, unhurried; asks whether it's Tuesday. He says the true thing at the wrong moment, and it turns out to be the right thing.
- **Dostoevsky:** Prince Myshkin, the "positively good man" back from his Swiss sanatorium, whom society calls an idiot.

### Nana Kurosaki, 25
- **Look:** long platinum hair dipped hot pink, a blunt fringe, heart-shaped sunglasses parked on her head, winged liner, violet eyes, a beauty mark, gold hoops, a pearl choker and a cropped red leather jacket.
- **Backstory:** heiress of a hotel family, raised in a hotel penthouse by forty-two staff and zero parents: her father sends money instead of birthdays. She has 2,000,000 followers and the Glitter Four, best friends who love her for her card.
- **Now:** sassy, spoilt, quick with a line ("Darling, I'm not lonely. I'm exclusive."), and alone at 3 a.m. She has never ridden a bus.
- **Dostoevsky:** Nastasya Filippovna, the proud, wounded beauty everyone wants to buy, who throws a fortune into the fire.

### Ryuji Gozen, the crypto king
Slicked silver hair, black shades, a gold tooth, a gold ¥ medallion, a white suit over a leopard shirt. Brings a briefcase with ¥100,000,000 to Nana's birthday to "buy" her. She throws it into the fireplace. *(Rogozhin.)*

### The Glitter Four
Nana's best friends, always in pop-art tiles: blue bob, pink buns, a lime mohawk and violet hair. They call Haru "that idiot". He makes it a badge, and wears it. *(The society chorus and the Yepanchin set.)*

### Lev
Haru's potted cactus, with a tiny face and a pink flower. Named after Prince Lev Myshkin.

## The trailer, beat by beat (125 s)

| Time | Beat |
|---|---|
| 0:00 | "This city has fourteen million people." A cut-paper skyline rises. |
| 0:04 | "And exactly one idiot." The word IDIOT slams onto a black-and-yellow sunburst. |
| 0:07 | Haru: "Oh! Hello! Lovely weather. Is it Tuesday?" Name card, AGE 30, Lev. |
| 0:12 | "No job. No girlfriend. Ever. No money." Three red crosses; the happiness gauge swings to 100%. |
| 0:18 | The lighthouse, Grandma, 3,000 books, *faints*. "Sunsets, mostly. And one very handsome goat." |
| 0:28 | Job interview #41: "Alive, I hope! Is that too ambitious?" REJECTED x41. |
| 0:35 | "I have a window, a library card, and Lev. What else does a person need?" |
| 0:40 | MEANWHILE... |
| 0:42 | Nana Kurosaki: penthouse, 42 staff, 0 parents; 2,000,000 followers; the Glitter Four. |
| 0:53 | 3:00 a.m. No new messages. "Darling, I'm not lonely. I'm exclusive." |
| 1:01 | ONE FINE DAY... the zebra crossing. CRASH! Her phone flies. |
| 1:07 | "Do you have any idea who I am?" "No. Do you?" |
| 1:11 | "Oh no. You're beautiful." THUD. "Did he just... faint?" |
| 1:16 | Montage: the ¥100 umbrella; her first bus ride at 25; the IDIOT badge ("Nobody expects me to lie"). |
| 1:29 | Nana: "He's nobody. So why can't I stop thinking about nobody?" |
| 1:34 | Ryuji: "A hundred million yen says she's mine." Nana: "Watch your price burn." BURN. |
| 1:42 | Haru: "You don't have to prove anything. Not to them. Not to me." |
| 1:47 | He has nothing. She has everything. Together, they might finally have... enough. |
| 1:53 | "You're an idiot. You know that?" "I know! Isn't it wonderful?" |
| 1:57 | BEAUTIFUL IDIOT. Coming soon-ish. "Is it Tuesday?" |

## Look and sound
- **Picture:** 1280x720, 24 fps, Canvas 2D. Flat paper-cut characters with thin ink lines, pink hatch shading, halftone hair; every background is a pop-art pattern (sunburst, lightning burst, spiral, rings, stripes, perspective checkerboard). Words arrive as comic lettering with stepped extrudes, torn-paper labels and ransom-note letters; cut-outs "boil" on twos. Paper grain, creases and a warm vignette over everything. Subtitles on a torn black strip.
- **Sound:** Kokoro voices (narrator: deep blended male; Haru: light and bright; Nana: a sassy blend; Ryuji: British drawl). An original 120 bpm retro-pop score written in code, with each shot rounded to whole beats so every cut lands on the beat: a bouncy ukulele-and-claps theme for Haru, a four-on-the-floor organ strut for Nana, a soft celesta for the lonely beats, a snare-roll riser into the crash, taiko and stabs for Ryuji, and a full band for the finale. SFX: stamps, a slide-whistle faint, the crash, camera shutters, fire.

## Rebuild
```
python3 anime/trailer/build_trailer.py anime/trailer/beautiful-idiot           # voices, score, timeline (~2.5 min)
node engine/render.mjs anime/trailer/beautiful-idiot --player anime/trailer/engine/player.html
```
Edit `trailer.json` for lines and timing, `engine/scenes.js` for staging, `engine/cast.js` for the characters.
