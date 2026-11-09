# Beautiful Idiot

*A five-episode romantic-comedy anime, about ten minutes an episode, in a loud retro pop-art collage look. Loosely adapted from Dostoevsky's* The Idiot. *Original story, characters, designs and music. The trailer lives in `anime/trailer/beautiful-idiot/`.*

## Logline
Haru Mishima is thirty, jobless, has never had a girlfriend, and is the happiest man in Tokyo. Nana Kurosaki is twenty-five, a hotel heiress with two million followers, four best friends and nobody to call at three in the morning. One Wednesday they crash into each other on a zebra crossing. He faints, because she is beautiful. Everybody calls him an idiot. He doesn't mind. It means nobody expects him to lie.

## How it follows the novel (loosely)
| *The Idiot* | *Beautiful Idiot* |
|---|---|
| Prince Myshkin returns from a Swiss sanatorium, epileptic, penniless, good | Haru returns from his grandmother's lighthouse; he faints at anything too beautiful |
| Nastasya Filippovna, kept by Totsky, proud and wounded | Nana, ward of Mr. Togashi, who runs her life like a portfolio |
| Rogozhin and the 100,000 roubles | Ryuji Gozen, crypto king, and ¥100,000,000 in a briefcase |
| The money thrown into the fire | Nana burns the briefcase at her 25th birthday party |
| Myshkin and Rogozhin exchange crosses, "brothers" | Haru and Ryuji swap a lighthouse keychain and a gold medallion |
| Aglaya Yepanchina, who mocks the prince because she loves him | Aya Ishida, who runs a used bookshop and mocks Haru because she likes him |
| Lebedev the gossip, Kolya the boy | Mr. Kobayashi the landlord, Kenta the eleven-year-old neighbour |
| The confrontation of the two women | Aya and Nana at Café Pochi (episode 4) |
| The wedding, the flight, the tragedy | The wedding, the flight, and a sunset at the lighthouse instead |

## Cast
- **Haru Mishima, 30.** Cocoa hair with one antenna curl, round eyes, a sticking plaster, an olive cardigan with a mended elbow. Raised by Grandma Fumi in a lighthouse with 3,000 donated books and a very handsome goat called Professor. Faints at beauty. Has failed 41 job interviews by answering honestly. Owns a window, a library card and Lev, his cactus. Asks if it's Tuesday.
- **Nana Kurosaki, 25.** Platinum hair dipped pink, heart sunglasses, winged liner, red leather jacket. Raised in the Hotel Kurosaki penthouse by 42 staff and zero parents; her father sends money instead of birthdays. Sassy, spoilt, quick, and lonely at 3 a.m. Has never ridden a bus.
- **Ryuji Gozen, 31.** Crypto king: silver slick, black shades, gold tooth, a ¥ medallion, a white suit. Grew up poor across the street from Nana's hotel and watched her window for years. Wants someone to stay.
- **Aya Ishida, 24.** Runs Ishida Books, her late father's used bookshop. Black ponytail, round glasses, a teal turtleneck. Sharp, proud, funny, and secretly reads every book Haru mentions.
- **Mr. Kobayashi, 68.** Haru's landlord. Bald, moustache, glasses, a brown cardigan. Grows tomatoes on the roof, knows everyone's business, and reads other people's mail "by accident".
- **Kenta, 11.** Haru's neighbour and best friend. Spiky hair, blue T-shirt. Sells "information" for candy.
- **Mr. Togashi, 58.** Nana's guardian and chairman of the hotel group. Grey side parting, moustache, dark suit. Has never once raised his voice or his eyebrows.
- **The Glitter Four.** Mika (blue bob, influencer), Rin (pink buns, giggles), Taku (lime mohawk, DJ) and Sora (violet hair, cynic).
- **Grandma Fumi.** The lighthouse keeper. Grey bun, round glasses. Phones every Sunday.
- **Lev.** A cactus with a tiny face and a pink flower.

## Episodes
1. **Is It Tuesday?** Haru leaves the lighthouse and arrives in Tokyo, moves into Mr. Kobayashi's building, meets Kenta and fails three interviews. Mr. Togashi tells Nana he will announce her engagement at her birthday party. The crash on the crossing: he faints, and he ends up with her phone. When he returns it at the hotel, he says the one true thing nobody has said to her, and she hires him as her "assistant" for a week as a joke for her friends.
2. **The ¥100 Umbrella.** Assistant week. Haru does everything wrong and shows her ordinary life: a bus, a konbini, a park bench. The Glitter Four bet he'll cry by Friday, and Taku's prank backfires. Haru meets Aya, who mocks him while helping him pick Nana's present. In the rain, with a ¥100 umbrella, Nana laughs for real. Across the street, Ryuji watches.
3. **A Hundred Million Yen.** Nana's 25th birthday party. Kenta sneaks Haru past the doorman, and Nana makes everyone confess their worst deed. Ryuji arrives with ¥100,000,000. Haru offers her something else: company at 3 a.m. Nana throws the money in the fire, then leaves with Ryuji anyway: "An idiot deserves better than me."
4. **Brothers.** Haru visits Ryuji's den; two lonely men swap a keychain and a medallion. Aya takes Haru to a festival; Nana sees them. At Café Pochi the two women collide, and Haru can't lie: he loves them both, differently. Both walk out. Grandma: "Kindness isn't a plan. Sometimes you have to choose."
5. **Beautiful Idiot.** Mr. Togashi arranges Nana's wedding to Ryuji, a merger. Ryuji asks Haru to be his best man. At the altar Nana runs, and Ryuji lets her go: "I wanted someone to stay. That's not the same as love." Aya tells Haru where Nana went. On the ferry to the lighthouse, Grandma waits. At sunset Haru faints, and Nana catches him. "Is it Tuesday?" "It's whatever day you want."

## Episode shape (about 10 minutes)
Cold open, opening titles (30 s), title card (5 s), five to seven scenes with cards between, ending credits with a next-time voice-over from Haru.

## Build
```
python3 anime/beautiful-idiot/engine/build_episode.py anime/beautiful-idiot/episodes/<slug> --dry   # length estimate
python3 anime/beautiful-idiot/engine/build_episode.py anime/beautiful-idiot/episodes/<slug>
node engine/render.mjs anime/beautiful-idiot/episodes/<slug> --player anime/beautiful-idiot/engine/player.html
```
The screenplay grammar is documented at the top of `engine/build_episode.py`. Sets: room_haru, penthouse, crossing, street, office, bus, konbini, park, party, bookshop, rooftop, cafe, den, lighthouse, station, chapel, ferry, lobby, blank.
