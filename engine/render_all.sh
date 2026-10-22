#!/usr/bin/env bash
# Render, web-encode and package every listed episode (waits for each soundtrack to exist first).
# Usage: engine/render_all.sh <slug> [<slug> ...]
set -euo pipefail
cd "$(dirname "$0")/.."
for slug in "$@"; do
  d="episodes/$slug"
  until [ -f "$d/timeline.json" ] && [ -f "$d/episode.wav" ]; do sleep 5; done
  echo "== $slug"
  node engine/render.mjs "$d" | tail -1
  ffmpeg -loglevel error -y -i "$d/episode.mp4" -c:v libx264 -preset slow -crf 30 -tune animation -pix_fmt yuv420p \
    -c:a aac -b:a 80k -movflags +faststart "$d/web.mp4" && mv "$d/web.mp4" "$d/episode.mp4"
  ffmpeg -loglevel error -y -ss 20 -i "$d/episode.mp4" -frames:v 1 -q:v 4 "$d/poster.jpg"
  ffmpeg -loglevel error -y -i "$d/episode.wav" -b:a 96k "$d/episode.mp3"
  python3 engine/make_script.py "$d/episode.json" > "$d/script.md"
done
python3 engine/build_gallery.py
