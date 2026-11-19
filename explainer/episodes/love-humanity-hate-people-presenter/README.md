# Presenter cut

Same script as `love-humanity-hate-people`, voiced by an original female blend (`af_heart:0.6+bf_isabella:0.4`, speed 1.08) and fronted by an AI-generated presenter photo (supplied by the requester; not a real person).

Pipeline (CPU only):
1. `python3 engine/build_audio.py explainer/episodes/love-humanity-hate-people-presenter/episode.json --models ~/models`
2. Narration-only track from the voice cache and `timeline.json` (character reads left out, so her mouth only moves on her own lines) plus `lines.json`.
3. Wav2Lip (GAN checkpoint, `--static True --pads 0 15 0 0`) on the photo with that track.
4. `node engine/render.mjs explainer/episodes/love-humanity-hate-people-presenter --player explainer/engine/player.html`
5. `python3 explainer/tools/presenter_cut.py episode.mp4 presenter.mp4 lines.json out.mp4`: full-frame presenter with word-chunk captions on 26 hook, intro and transition lines; diagrams elsewhere.

The rendered video lives in the project files (`lumen-explainer/love-humanity-hate-people/presenter/`), not in git.
