# LUMEN style guide

LUMEN is an original homage to the flat-design science explainer, the genre that channels like *Kurzgesagt – In a Nutshell* made famous. This page says what makes that genre work and how LUMEN does it with its own creatures, palette, voice and music. Nothing here copies another studio's characters, logo, name, frames or soundtrack.

## 1. What defines the genre

These points come from public descriptions of how such studios work (for example the "Our video process" page on kurzgesagt.org and their Skillshare animation classes) and from general viewing. You can measure your own reference set with `tools/style_study.py` (section 7).

| Layer | What viewers notice | Why it works |
|---|---|---|
| Research | A sources document behind every claim; experts consulted; about a dozen script drafts | Calm authority comes from being careful, not loud |
| Script | One question in the hook, then chapters; "but" turns; ends on an optimistic, human note | Viewers learn without noticing they are being taught |
| Narration | One warm, steady voice that is rational and optimistic; it records first and sets the timing | The picture follows the voice, so pacing feels effortless |
| Illustration | Flat vector shapes made of circles and rounded rectangles, no outlines, simple cute creatures as stand-ins for "us" | Viewers read the idea, not the drawing |
| Colour | Dark, saturated backgrounds (navy, teal, plum) with a few vivid accents; coloured shadows; glows | High contrast keeps a long, dense video easy on the eye |
| Depth | Two or three tones per object (shadow crescent, base, highlight); parallax layers; soft radial light | Flat art that still feels lit and dimensional |
| Motion | Puppet-style rigs; overshoot pops; everything breathes; a slow camera drift; infinite zooms between scales | The frame is never fully still |
| Sound | A dedicated score (ambient pads, bells, swells), soft UI sounds on every reveal | Music carries the mood, so the narrator can stay calm |
| Structure | Title card, chapter cards with an icon, a summary of the stakes, and credits with sources | Easy to follow and to come back to |

## 2. LUMEN's own identity

- **Show name:** LUMEN (light on an idea). Never use another channel's name, wordmark or bird mascot.
- **Creatures: "pebbles".** Soft egg bodies with a leaf sprout on top, two dot eyes with a catch-light, a tiny mouth, nub feet and a small arm only when holding something. Moods: `happy calm neutral deadpan sad worried shocked smug`. Variants: `spiky` (a thorny pebble, for a threat or a free-rider), `hold: "heart"`. Pebbles are LUMEN's everyman. Keep them abstract: they stand in for "people", never for a real group.
- **Voice:** a blended Kokoro voice (`am_michael:0.6+bm_george:0.4`), an original timbre that is calm, warm and slightly mid-Atlantic. It is not a clone of any real narrator. Speed 1.0 with 0.4 s between lines.
- **Score:** `music: "ambient"` writes an original track in numpy: Dm9, B♭maj7, Fmaj7, C at 7.5 s per chord, detuned warm pads, a sparse bell arpeggio, a sub and an echo tail. It sits low under narration and swells on cards and silent beats.
- **Type:** Nunito 800 to 900 (rounded, OFL). Titles are sentence case. Key terms appear as rounded pill labels.

## 3. Palette tokens (`PAL` in `engine/explainer.js`)

| Token | Top → bottom | Glow | Use |
|---|---|---|---|
| `midnight` | `#070b26` → `#1a2766` | `#4a64e0` | default, space, systems |
| `teal` | `#082a38` → `#0f6b6d` | `#3fd6c2` | science, diagrams, solutions |
| `plum` | `#170929` → `#55206b` | `#c266ff` | psychology, feelings, social |
| `ember` | `#220812` → `#76212f` | `#ff7a59` | danger, conflict, the critics |
| `dusk` | `#24154a` → `#ff8a65` | `#ffd08a` | deep history, landscapes |
| `day` | `#2f8fe0` → `#c4ecff` | `#fff4c8` | light moments, playful games |

Accents: heart `#ff5a7a`, amber `#ffb347`, gold `#f2c14e`, sky `#5ec8e5`, mint `#7bdc8c`, lilac `#c792ea`, pink `#ff8fab`. Rules: one background palette per scene; at most three accents per scene; shadows mix toward `#0b1030` (never grey); highlights mix toward warm white `#fff6e6`.

## 4. Shading recipe

Every solid object uses `solid(path, colour)`: the shape filled with its shadow tone, the base colour shifted up and left and clipped to the shape (leaving a crescent of shade bottom-right), and an optional soft highlight ellipse top-left. Add `glow()` behind anything important (hearts, icons, the active dot on a chart). Ground contact is a soft dark ellipse. There are no outlines.

## 5. Motion rules

- Entrances: `pop` (overshoot scale, the default), `rise`, `drop`, `left`/`right`, `fade`, `grow`. Stagger groups by about 70 ms per item.
- Idle: pebbles breathe (squash ±3%), blink every 3 to 4 s, and their sprouts sway; hearts beat; icons can `float`; dust and stars drift; the camera always moves (`cam.zoom`, `cam.pan`) with parallax on background layers.
- Changes happen on narration beats through `keys`, eased over about 0.8 s.
- Cuts: a quick dip through near-black plus a small zoom settle; chapter cards draw a ring around their icon.
- Something new appears at least every 4 to 6 seconds. One idea per scene, about 3 to 6 elements on screen at a time.

## 6. Writing rules

- **Hook (first 20 s):** an image and a question. Then frame the source and the stakes.
- **Chapters:** 4 to 8 parts, each with a card, 2 to 4 scenes and one takeaway.
- **Lines:** under about 35 words; plain words; a concrete image in every line; numbers rounded.
- **Fairness:** credit the author by name; paraphrase rather than quote; use at most a few short attributed phrases; give the strongest critics a full chapter; name hot-button topics on screen without dramatizing them through stand-ins for real groups.
- **Ending:** what both sides can keep, then a short human line. Sources go on the end card.

## 7. Studying references (private)

```bash
pip install yt-dlp pillow numpy    # plus ffmpeg
python3 explainer/tools/style_study.py <video URL or file> [...] --every 4 --max-minutes 6
open .style-study/report.md         # shot length, palette, saturation and brightness per video, plus contact sheets
```

Use what you learn (average shot length, how dark the backgrounds are, accent share) to tune the tokens above. The `.style-study/` folder is gitignored. Never commit, publish or trace other people's frames.
