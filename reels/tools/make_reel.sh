#!/usr/bin/env bash
# One reel, start to finish: verify the shloka, fetch and paint the art, voice and score, render, write the caption,
# and copy the deliverables to the project's shared folder.
# Usage: reels/tools/make_reel.sh reels/days/<slug> [--out /mnt/project-files/ramayana-reels]
set -euo pipefail
D=${1%/}; OUT=${3:-/mnt/project-files/ramayana-reels}
cd "$(dirname "$0")/../.."
python3 reels/tools/verse.py verify "$D/reel.json"          # stops here if the shloka does not match Valmiki's text
python3 reels/tools/fetch_art.py get "$D/reel.json"
python3 reels/tools/prep_art.py "$D"
python3 reels/engine/build_audio.py "$D/reel.json"
node reels/engine/render.mjs "$D" --stills 1.5,10,25
node reels/engine/render.mjs "$D"
python3 reels/tools/caption.py "$D" > /dev/null
if [ -d "$(dirname "$OUT")" ]; then
  S=$(basename "$D"); mkdir -p "$OUT/$S"
  cp "$D"/reel.mp4 "$D"/reel_nomusic.mp4 "$D"/poster.jpg "$D"/caption.txt "$OUT/$S/"
  echo "delivered to $OUT/$S"
fi
