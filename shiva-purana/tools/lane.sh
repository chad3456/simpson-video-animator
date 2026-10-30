#!/bin/bash
# Build one language of several episodes, in order. Run from the repo root.
#   shiva-purana/tools/lane.sh audio en e01-pillar-of-fire e02-naradas-pride ...
#   shiva-purana/tools/lane.sh render hi e01-pillar-of-fire ...
# audio: screenplay -> episode.wav + timeline.json.  render: episode.mp4 + poster.jpg (from the issue cover).
step=$1; lang=$2; shift 2
export KOKORO_THREADS=${KOKORO_THREADS:-1} OMP_NUM_THREADS=1 OPENBLAS_NUM_THREADS=1   # lanes run side by side
for ep in "$@"; do
  d=shiva-purana/episodes/$ep; [ "$lang" = hi ] && d=$d/hi
  echo "=== $step $lang $ep $(date +%H:%M)"
  if [ "$step" = audio ]; then
    python3 shiva-purana/engine/build_audio.py $d/episode.json 2>&1 | grep -v "^  [a-z]" || exit 1
  else
    node engine/render.mjs $d --player shiva-purana/engine/player.html --crf 27 | tail -n 1 || exit 1
    t=$(python3 -c "import json;s=[x for x in json.load(open('$d/timeline.json'))['shots'] if x['seg'].startswith('title')][0];print(round(s['start']+4.2,2))")
    node engine/render.mjs $d --player shiva-purana/engine/player.html --stills $t >/dev/null && \
      ffmpeg -y -loglevel error -i $d/still-$t.png -vf scale=960:-1 -q:v 3 $d/poster.jpg && rm -f $d/still-$t.png
    python3 shiva-purana/engine/make_script.py $d
  fi
done
echo "=== lane done $(date +%H:%M)"
