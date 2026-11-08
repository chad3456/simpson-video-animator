// Yuddha Kanda (sarga 67) — the giant Kumbhakarna wades through the vanara army devouring warriors. Rama meets him alone,
// severs with his arrows first one arm, then the other, and with the weapon of Indra strikes off the giant's head.
(function () {
  RP.events['17-rama-fells-kumbhakarna'] = {
    title: 'Rama Fells the Giant Kumbhakarna',
    W: 1800, H: 1200, seed: 2222,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff3a1a', '#ffffff', '#3ad0ff', '#8a3aff'],
    flow: (x, y, n) => -0.2 + n(x * 0.002, y * 0.002) * 1.4,
    turbulence: 0.9,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, 0, ['#3a6ae0', '#8a5ad0', '#e0503a', '#8a0a2a', '#2a0a2a']));
      K.blob(250, 250, 300, '#c8e8ff', 0.7);
      K.fill(K.poly([[0, 1020], [W, 980], [W, H], [0, H]]), K.lin(0, 980, 0, H, ['#c86a3a', '#6a2a2a', '#2a0a1a']));
      // Kumbhakarna towering over the field
      const kb = K.figure({ x: 1300, y: 1160, h: 1060, skin: ['#b8a090', '#7a5a5a', '#3a2238', '#120812'], head: 'crown', crown: { h: 0.8 }, turn: -0.35,
        mustache: '#100816', curl: 0.6, cloth: ['#3a5a3a', '#2a3a2a', '#141e14', '#050805'], scarf: ['#c03a3a', '#8a1a2a', '#4a0a1a', '#1a0408'],
        pose: { legs: 'walk', armL: [1.7, 0.5], armR: [2.2, 0.6] }, face: { eyes: 'wide', brow: 'angry', mouth: 'roar', gaze: [-1, 0.3] } });
      // vanaras scattering at his feet
      for (let k = 0; k < 7; k++) K.vanara({ x: 560 + k * 105, y: 1150 + K.R(-20, 30), h: 190, turn: K.R(-0.5, 0.5), gaze: -1, fur: K.pick([['#ffc85a', '#f07a1a', '#b0301a', '#4a1020'], ['#d8a06a', '#a0603a', '#5a2a2a', '#2a0a14']]), pose: { legs: 'walk', armL: [2.6, 0.2], armR: [2.4, 0.3] } });
      const r = K.archer({ x: 280, y: 1150, h: 600 });
      K.overlay((pen) => {
        const [bx, by] = r.bow;
        // arrows striking the giant's arms with bursts of light
        for (const t of [kb.handL, kb.handR]) {
          pen.line([[bx + 120, by], t], { w: 6, color: '#fff6c0', alpha: 0.9, taper: 0.1 });
          for (let k = 0; k < 14; k++) { const a = k / 14 * 6.283; pen.line([t, [t[0] + Math.cos(a) * K.R(40, 100), t[1] + Math.sin(a) * K.R(40, 100)]], { w: 6, color: K.pick(['#ffffff', '#ffd23a', '#ff7a1a']), taper: 1 }); }
        }
        // the Aindra weapon in flight towards the head
        const hc = kb.hc;
        pen.line([[bx + 120, by - 20], [900, 500], [hc[0] - 80, hc[1] + 40]], { w: 30, color: '#bff0ff', alpha: 0.4, taper: 0.4 });
        pen.line([[bx + 120, by - 20], [900, 500], [hc[0] - 80, hc[1] + 40]], { w: 9, color: '#ffffff', taper: 0.1 });
      });
      K.sparks(80, [600, 300, 1700, 1100]);
    },
  };
})();
