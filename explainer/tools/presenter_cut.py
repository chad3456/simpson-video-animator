#!/usr/bin/env python3
"""Cut the lip-synced presenter into the rendered explainer, reel style: full-frame presenter shots with bold
word-chunk captions on chosen narration lines, diagrams everywhere else.
Usage: python3 compose.py <episode.mp4 (visuals+mix)> <presenter.mp4 (lip-synced)> <lines.json> <out.mp4>"""
import json, subprocess, sys, os

base, pres, lines_f, out = sys.argv[1:5]
lines = json.load(open(lines_f))
FONTS = "/home/user/simpson-video-animator/explainer/engine/fonts"

# (segment, line index) where the presenter takes the full frame: hooks, chapter intros, transitions, ending.
PICK = {("open-question", 0), ("open-question", 2), ("open-question", 3), ("p1-circle", 0), ("p1-diary", 0),
        ("p2-arith", 0), ("p2-arith", 3), ("p2-confess", 4), ("p3-palace", 0), ("p3-quotes", 1), ("p3-spite", 1),
        ("p4-shame", 0), ("p4-funnel", 4), ("p5-cell", 0), ("p5-cell", 2), ("p5-table", 1), ("p5-morson", 1),
        ("p6-ticket", 0), ("p6-ticket", 1), ("p6-map", 3), ("p7-lineup", 1), ("p7-against", 0),
        ("end-zosima", 0), ("end-zosima", 3), ("end-line", 1), ("end-line", 3)}
wins = [(l["start"] - 0.15, l["end"] + 0.25, l["text"]) for l in lines if (l["seg"], l["idx"]) in PICK and l["who"] == "narrator"]


def ts(t):
    t = max(0, t); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"


# word-chunk captions: three or four words at a time, the key word box highlighted like the reels
ass = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 1280", "PlayResY: 720", "", "[V4+ Styles]",
       "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
       "Style: Cap,Archivo Black,46,&H00FFFFFF,&H00FFFFFF,&H00191B1D,&H64000000,0,0,0,0,100,100,1,0,1,4,2,2,60,60,70,1",
       "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
for a, b, text in wins:
    words = text.replace("’", "'").replace("‘", "'").split()
    chunks, cur = [], []
    for w in words:
        cur.append(w)
        if w[-1] in ",.?!:;" or (len(cur) >= 3 and len(" ".join(cur)) > 14):
            chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    tot = sum(len(" ".join(c)) + 4 for c in chunks); t = a + 0.15; span = (b - 0.25) - t
    for c in chunks:
        d = span * (len(" ".join(c)) + 4) / tot
        txt = " ".join(c).upper().replace("{", "(").replace("}", ")")
        ass.append(f"Dialogue: 0,{ts(t)},{ts(t + d)},Cap,,0,0,0,,{{\\fad(40,40)}}{txt}")
        t += d
open("captions.ass", "w").write("\n".join(ass) + "\n")

enable = "+".join(f"between(t,{a:.2f},{b:.2f})" for a, b, _ in wins)
# presenter frame: crop the portrait to 16:9 around the face, slow breathing push-in, warm grade kept
pf = ("[1:v]crop=1402:789:0:110,scale=1280:720,setsar=1,fps=30,"
      "zoompan=z='1.03+0.025*sin(on/90)':x='iw/2-(iw/zoom/2)+6*sin(on/70)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30,"
      "eq=contrast=1.04:saturation=1.05[p]")
fc = f"{pf};[0:v][p]overlay=0:0:enable='{enable}'[v0];[v0]ass=captions.ass:fontsdir={FONTS}[v]"
cmd = ["ffmpeg", "-v", "error", "-y", "-i", base, "-i", pres, "-filter_complex", fc, "-map", "[v]", "-map", "0:a",
       "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-tune", "film", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k",
       "-movflags", "+faststart", "-shortest", out]
print(len(wins), "presenter shots,", round(sum(b - a for a, b, _ in wins)), "s on screen")
subprocess.run(cmd, check=True)
