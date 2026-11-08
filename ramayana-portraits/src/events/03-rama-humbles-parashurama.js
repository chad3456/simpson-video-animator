// Bala Kanda (sargas 74–76) — on the road home from Mithila, Parashurama blocks the way, axe on his shoulder, and
// challenges Rama to string the bow of Vishnu. Rama takes it from his hands, strings and draws it in a moment, and with
// the arrow destroys the worlds Parashurama had won by penance; humbled, the sage salutes him.
(function () {
  RP.events['03-rama-humbles-parashurama'] = {
    title: 'Rama Draws the Bow of Vishnu before Parashurama',
    W: 1800, H: 1200, seed: 1818,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#3ad0ff', '#ffffff', '#ff4a1a', '#8a5aff'],
    flow: RP.flows.radial(820, 520, 0.15),
    turbulence: 0.7,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(820, 520, 40, 1100, ['#ffffff', '#c8f0ff', '#5ab0ff', '#3a3ad0', '#2a0a6a', '#0a0420']));
      K.blob(1500, 200, 380, '#1a0a4a', 0.7);
      K.blob(200, 180, 300, '#3a1a8a', 0.6);
      K.mountain([[-50, 1200], [-50, 900], [400, 820], [800, 880], [1300, 800], [1850, 860], [1850, 1200]], ['#8a7ad0', '#4a3a8a', '#2a1a5a', '#0a0620'], 0.25);
      K.fill(K.poly([[0, 1000], [W, 980], [W, H], [0, H]]), K.lin(0, 980, 0, H, ['#c08a6a', '#7a4a4a', '#2a1a2a']));
      // Rama drawing Vishnu's great bow, which blazes with blue light
      const r = K.archer({ x: 560, y: 1140, h: 860, bowColor: '#1a3a8a', tip: '#e8f4ff', glow: '#bff0ff' });
      // Parashurama, axe lowered, palms joined in salute
      K.figure({ x: 1380, y: 1140, h: 820, skin: ['#ffd8a0', '#e8904a', '#9a4a5a', '#3a1a3a'], head: 'jata', ascetic: true, beard: 1.5, turn: -0.45,
        hairColors: ['#ffffff', '#e0d8f0', '#9a8ac8', '#3a2a5a'], cloth: ['#ffb04a', '#f07a1a', '#a03a1a', '#3a0a1a'], scarf: ['#ff8a3a', '#e0501a', '#8a2a1a', '#2a0a0a'],
        pose: { legs: 'stand', armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'soft', brow: 'calm', mouth: 'calm', tilak: 'tripundra', gaze: [-1, 0] } });
      // the battle-axe set down against his legs
      K.overlay((pen) => {
        pen.line([[1530, 1150], [1600, 760]], { w: 16, color: '#6a3a1a', taper: 0 });
        pen.fill(K.path([[1590, 820], [1700, 760], [1730, 860], [1600, 880]]), '#d8e8f8');
        pen.line([[1700, 760], [1730, 860]], { w: 6, color: '#ffffff', taper: 0 });
        // rays from the drawn bow
        const [bx, by] = r.bow;
        for (let k = 0; k < 30; k++) { const a = K.R(-1.2, 1.2), L = K.R(200, 520); pen.line([[bx + 120, by], [bx + 120 + Math.cos(a) * L, by + Math.sin(a) * L]], { w: K.R(2, 6), color: K.pick(['#ffffff', '#bff0ff', '#ffd23a']), alpha: 0.7, taper: 1 }); }
      });
      K.sparks(60, [700, 200, 1300, 800], ['#ffffff', '#bff0ff', '#ffd23a']);
    },
  };
})();
