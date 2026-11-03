# Swagat: Jaipur Diwali gifting brand showreel

**Placeholder brand.** "Swagat" (स्वागत, "welcome") is a made-up name for this mockup, picked because Ayodhya lit lamps to welcome Ram and Sita home, and Diwali is about coming home to family. The word is common in Indian business names, so a real launch would need a trademark search. Backup names: Deepmala, Aangan, Ujala & Co.

- Brief: a Jaipur brand of handcrafted Diwali gifts for corporate employees. Packaging is Pichwai-style storytelling of the Ramayana, with Ram and Sita as the key focus. Products: decorative diyas, sweet boxes and hamper boxes. Theme: festival with family, making Diwali memorable.
- Length: about 1:40, 1920x1080, 30 fps, original synthesised soundtrack
- Style reference: the same identity-reel structure as the Barnaby burger reel (from the screen recording shared in the project): typewriter lines where a word turns into an icon, a build-up open, logo construction with anchor points, photo cuts with white figures on them, a tool UI, huge type, type specimen, palette, icon grid, mockups and a one-line sign-off
- Art direction: Pichwai figures and painted sets from the project's Mahagatha engine (`lib/figures.js`, `lib/sets.js`): Ram in blue with his bow, Sita in a red lehenga and saffron odhni, fish-shaped eyes in profile, gold ornament, dotted textiles, lotus buds, cusped arches, a pearl-dotted red border
- Logo: a diya whose flame is a lotus bud, under a cusped jharokha arch; wordmark "swagat" in Rozha One with स्वागत beneath
- Tagline: "Light the way home." Supporting lines: "Every home is Ayodhya tonight.", "From our family to yours.", "Make this Diwali memorable."
- Fonts: Rozha One (display, Latin and Devanagari), Tiro Devanagari Hindi, Instrument Sans, DM Mono, all SIL Open Font Licence

## Palette

| Name | Meaning | Hex | Role |
|---|---|---|---|
| Haathi-daant | Ivory | #FBF3DF | Paper stock, light backgrounds |
| Kesar | Saffron | #F0A020 | Flames, highlights, hamper scene |
| Sona | Gold leaf | #E0A92A | Borders, ribbons, foil |
| Kamal | Lotus pink | #E7A5B8 | Sweet box, card inside |
| Sindoor | Vermilion | #C0362C | Border, lids, accents |
| Rani | Rani pink | #A3285E | Secondary accent |
| Pista | Pistachio | #A9C47C | Barfi, small accents |
| Raat | Night indigo | #1C2A5E | Primary background, box sides |

## Shot list

| Time | Section | What happens |
|---|---|---|
| 0:00 | Build-up open | A file name types (`diya_01`, `jhrk_3`, `swgt_v4`) while the diya bowl drops, the lotus petals open, the flame lights, the arch draws and a marigold toran falls in |
| 0:06 | Typewriter | "Painted by [brush] in Jaipur, so every [home] glows like [Ram and Sita chip] tonight." |
| 0:14 | Photo cuts | Hawa Mahal, lit diyas, a diya rangoli, each with white Pichwai figures standing on the photo |
| 0:17 | Logo build | Arch, bowl, petals and flame outlines draw on a grid with anchor points and handles, fill, then "swagat", स्वागत and "HANDCRAFTED DIWALI GIFTS · JAIPUR" |
| 0:24 | Photo cuts | Diwali sweets, marigold, fireworks |
| 0:28 | Story studio | A panel tool cycles through the Ramayana chapters used on each pack: Swayamvar (sweet box lid), Vanvaas (diya sleeve), Panchavati (gift card), Setu (carry bag), Homecoming (hamper front, diyas light up) |
| 0:35 | Hero | On night indigo: "Light the way [diya]." then huge "light the way home" passes behind Ram and Sita, then a giant स with shirorekha, matra and baseline guides next to Sita on a lotus-pink card |
| 0:43 | Type specimen | Rozha One A to Z on Sindoor; Devanagari set ending "शुभ दीपावली" on Kesar |
| 0:48 | Palette | Eight pigment stripes rise; Ram and Sita step in with folded hands |
| 0:53 | Icons | "Diyas, [mithai] and stories, wrapped for the whole [family]." over a 12x4 icon grid |
| 0:58 | Diyas | Three hand-painted terracotta diyas light one by one: "Lit by hand, in Jaipur." |
| 1:03 | Mithai box | 3D box with the Ram-Sita medallion lid; the lid lifts off kaju katli, motichoor laddoo and pista barfi: "Sweet, with a story on the lid." |
| 1:09 | Ayodhya hamper | 3D hamper with the Homecoming panel on the front; ribboned lid lifts to show diyas, the sweet box and a card: "One hamper. The whole family." |
| 1:15 | Bag and card | Carry bag with an arch window, a greeting card that opens: "From our family to yours. शुभ दीपावली", with a "YOUR LOGO" slot for the client company |
| 1:19 | Poster | "Every home is Ayodhya tonight." poster on a pink Jaipur arcade wall |
| 1:21 | The feeling | A Jaipur rooftop on Diwali night (no moon, it is amavasya): grandmother, parents and two children light diyas along the parapet around the open hamper while fireworks burst and Ram and Sita fly home on the Pushpak; "Diwali is better together." |
| 1:30 | Sign-off | "Make this Diwali [sparkle]." then the logo lock-up and "LIGHT THE WAY HOME." |
| 1:36 | Credits | Photo credits and licences |

## Copy

The copy makes no claims about ingredients, shelf life or materials beyond what the brief states (handcrafted, Jaipur), because those would need the real brand's facts. The religious imagery stays devotional and celebratory: Ram and Sita are shown blessing, offering a diya and returning home, never as a joke.

## Photos

See `photos/CREDITS.md`. All photos come from Wikimedia Commons under CC licences and are credited on screen at the end. CC BY-SA images require edited versions of those images to be shared under the same licence. A slot without a photo renders as a labelled "PHOTO SLOT" card.

## Rebuild

```
node render.mjs --stills 5,20,37      # review frames into stills/
node -e "global.window={Art:{C:{},IMG:{},PALETTE:[],I:{}}};global.document={};require('./reel.js');require('fs').writeFileSync('cuts.json',JSON.stringify({duration:window.Reel.duration,cuts:window.Reel.cuts,typing:window.Reel.typing}))"
python3 build_audio.py                 # showreel.wav
node render.mjs --out showreel.mp4     # full render
```

Open `reel.html` through a local web server for a live, looping preview (`?t=60` starts at 60 s).
