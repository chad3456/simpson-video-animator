// 10 — Shiva-parivara: the family of Kailash. Shiva and Parvati with Ganesha, remover of obstacles, and Kartikeya,
// the young general of the gods, with his peacock; Nandi at their side and the snow peak behind.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['10-the-family-of-kailash'] = {
    title: 'The Family of Kailash', W: 1800, H: 1200, seed: 6110, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff6a8a', '#3ad0a0', '#ffffff', '#8ad0ff'],
    flow: RP.flows.radial(900, 520, 0.3), turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(900, 480, 40, 1200, ['#fffbe0', '#ffd8a0', '#ff9a8a', '#8a6ad0', '#2a2a6a']));
      K.mountain([[380, 780], [900, 120], [1420, 780]], ['#ffffff', '#ffe8d0', '#c0a0d0', '#5a4a8a'], 0.35);
      K.fill(K.path([[0, 1200], [0, 840], [600, 800], [1200, 800], [1800, 840], [1800, 1200]]), K.lin(0, 800, 0, H, ['#ffffff', '#d0d8f0', '#8a90c0', '#3a3a6a']));
      for (const [x, h] of [[90, 760], [1720, 820]]) K.tree(x, 860, h, { leaves: ['#a0ffb0', '#3ad07a', '#0a8a5a', '#0a4a3a'], flowers: ['#ffffff', '#ff8ac0'], n: 7 });
      K.fill(K.ell(860, 1000, 360, 55), K.lin(500, 0, 1220, 0, ['#ffe08a', '#f0a030', '#b0581a', '#ffe08a']));
      K.shiva({ x: 760, y: 995 + 0.44 * 760, h: 760, turn: 0.15, pose: { legs: 'lotus', armL: [0.5, -1.9], armR: [0.6, -0.5] }, face: { eyes: 'soft', mouth: 'smile', gaze: [0.4, 0.2] }, head2: { thirdEye: 'closed' } });
      K.parvati({ x: 1000, y: 1000 + 0.44 * 680, h: 680, turn: -0.15, pose: { legs: 'lotus', armL: [0.6, -0.5], armR: K.poses.chest }, face: { eyes: 'soft', mouth: 'smile', gaze: [-0.4, 0.2] } });
      K.trishul(520, 1020, 660, -0.06, { glow: '#fff6c0' });
      // Ganesha, seated in front with his modak
      const g = K.ganesha({ x: 1210, y: 1130 + 0.44 * 360, h: 360, turn: -0.2, pose: { legs: 'lotus', armL: [0.6, -1.2], armR: [0.7, -0.8] } });
      K.overlay((pen) => { const [x, y] = g.handR; pen.fill(K.ell(x, y - 8, 16, 14), '#fff0c0'); });
      // Kartikeya with his spear and peacock
      const k = K.figure({ x: 420, y: 1140, h: 470, turn: 0.35, skin: ['#ffe0b0', '#f0a870', '#b0605a', '#4a1a3a'], head: 'crown', cloth: ['#ff6a3a', '#e0301a', '#9a0a2a', '#4a0a1a'], pose: { armL: [0.5, -1.6], armR: [0.3, 0.1] }, face: { eyes: 'open', mouth: 'smile', gaze: [0.7, 0] } });
      K.overlay((pen) => { const [x, y] = k.handL; pen.line([[x, y + 220], [x, y - 260]], { w: 7, color: '#c08a4a', taper: 0 }); pen.fill(K.path([[x, y - 330], [x - 22, y - 260], [x + 22, y - 260]]), '#ffd23a'); });
      K.peacock(240, 1150, 260, { dir: 1, fan: true });
      K.nandi(1510, 1150, 300, { dir: -1 });
    },
  };
})();
