// Sundara Kanda (sarga 38), Sita's token to Hanuman — "Remember, when my tilak had faded, you drew one on my cheek with
// red mineral from the mountain." A tender close view at Chitrakuta.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['16-the-tilak-on-her-cheek'] = {
    title: 'The Tilak on Her Cheek', W: 1200, H: 1800, seed: 5116, layers: RP.eventLayers,
    accents: ['#ff3a1a', '#ffd23a', '#ffffff', '#3ad0a0', '#8a5aff'],
    flow: RP.flows.radial(600, 700, 0.3), turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(600, 700, 30, 1300, ['#fff6d0', '#ffd890', '#ff9a6a', '#c04a7a', '#3a1a6a']));
      K.blob(150, 300, 260, '#a0ffb0', 0.5); K.blob(1080, 1500, 300, '#3ad08a', 0.5);
      // close: Rama, on the left, has just touched the red mineral to Sita's cheek; the stone is still in his hand
      const s = K.sita({ x: 800, y: 2500, h: 1950, turn: -0.25, look: 'forest', pose: { legs: 'hidden', armL: K.poses.rest, armR: K.poses.chest }, face: { eyes: 'down', mouth: 'smile', gaze: [-0.3, 0.6] } });
      const r = K.rama({ x: 330, y: 2400, h: 2100, turn: 0.3, look: 'forest', pose: { legs: 'hidden', armL: K.poses.rest, armR: [0.5, -2.2] }, face: { gaze: [0.7, 0.3] } });
      const ch = s.headF ? s.headF.T(-0.45, 0.25) : [700, 700];
      K.overlay((pen) => { pen.dab(ch[0], ch[1], 16, '#e8241a'); pen.dab(ch[0] + 3, ch[1] + 2, 8, '#ff5a3a'); const [hx, hy] = r.handR; pen.dab(hx, hy - 10, 18, '#c81a10'); pen.dab(hx + 4, hy - 14, 8, '#ff6a3a'); });
      K.petals(70, [0, 0, W, H], ['#ff3a1a', '#ffd23a', '#ffffff']);
    },
  };
})();
