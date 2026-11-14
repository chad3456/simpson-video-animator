# Homecoming

One drawing, 16:9, made only with JavaScript: the night Ayodhya lit its lamps for a flying palace coming home.
Nobody is in the picture. The city has put a lamp in every window; on the terrace the things that waited fourteen
years (a pair of sandals on a throne, a bow, a quiver, a welcome plate) are still where they were left.

There is no canvas API, SVG or image in the drawing code. `draw.js` simulates paper tooth and five dry tools, and
every mark is laid down one dab of pigment at a time:

1. **soft pastel**: broad, chalky, opaque; the sky, the river, the grounds under most shapes
2. **wax colour pencil**: thin and transparent, layered in hatches so colours mix by glazing
3. **indigo drawing pencil**: the line; it wobbles, overshoots corners and is restated
4. **white chalk pencil**: flames, stars, glints, lamp reflections
5. **paper stump / fingertip**: drags and blooms pigment that is already down

Pigment catches on the peaks of the paper first; pressure and built-up wax push it into the valleys. Every shape is
re-traced with a slightly different hand each time it is filled, so fills and outlines never quite agree.

```bash
node genstyle/homecoming/draw.js            # 3840x2160 -> genstyle/homecoming/homecoming.png (about 35 s, 400 MB RAM)
node genstyle/homecoming/draw.js 1 out.png  # 1920x1080 (about 10 s)
```

Needs only Node (the PNG is written with the built-in zlib). `index.html` shows the drawing and can redraw it in
the browser stage by stage. `scene.js` holds the sky's neighbours (palace, city, river, terrace frame) and
`foreground.js` the terrace objects and birds.

`timelapse.js` films the drawing being made, by running the same code and handing ffmpeg a frame every so many marks:

```bash
node genstyle/homecoming/timelapse.js out.mp4 46 score.wav
```
