// Yuddha Kanda (sargas 102–108) — the duel that shook the three worlds. Rama on Indra's chariot driven by Matali,
// Ravana on his own, the two exchanging weapons from dawn until the gods themselves fell silent.
(function () {
  RP.events['19-rama-and-ravana'] = {
    title: 'The Duel of Rama and Ravana',
    W: 1800, H: 1200, seed: 2525,
    layers: RP.eventLayers,
    accents: ['#ffffff', '#ffd23a', '#3ad0ff', '#ff3a1a', '#8a3aff'],
    flow: RP.flows.radial(900, 520, 0.2),
    turbulence: 0.8,
    draw(K) {
      const { W, H } = K;
      const ink = '#0c0618';
      K.bg(K.lin(0, 0, W, 0, ['#bff0ff', '#3a8aff', '#5a2ab0', '#e0301a', '#ff9a2a']));
      K.fill(K.ell(900, 520, 240, 240), K.rad(900, 520, 10, 240, ['#ffffff', '#fffbe0', '#ffe48a', 'rgba(255,180,80,0)']));
      K.blob(300, 200, 300, '#e8f8ff', 0.6); K.blob(1550, 220, 300, '#ffd23a', 0.5);
      K.fill(K.poly([[0, 940], [W, 940], [W, H], [0, H]]), ink);
      // Rama's chariot and horses from the left
      K.sil.horse(560, 950, 200, { ink, dir: 1 }); K.sil.horse(500, 975, 200, { ink, dir: 1 });
      K.sil.chariot(300, 970, 230, { ink, dir: 1, rim: '#bff0ff' });
      const r = K.sil.archer(300, 800, 420, { ink, rim: '#e8f8ff' });
      // Ravana's chariot from the right, ten heads and many arms
      K.sil.horse(1240, 950, 200, { ink, dir: -1 }); K.sil.horse(1300, 975, 200, { ink, dir: -1 });
      K.sil.chariot(1500, 970, 250, { ink, dir: -1, rim: '#ffd23a' });
      const rv = K.sil.archer(1500, 790, 460, { ink, dir: -1, rim: '#ffd23a', string: '#ffd890' });
      const f = (p) => { K.fill(p, ink); K.focus(p, 0.95); };
      const [hx, hy] = rv.head;
      for (let k = 1; k <= 4; k++) for (const sd of [-1, 1]) { if (sd < 0 && k === 4) continue; const x = hx + sd * k * 46, y = hy + k * 6; f(K.ell(x, y, 21, 25)); f(K.path([[x - 14, y - 16], [x, y - 52], [x + 14, y - 16]])); }
      for (let k = 0; k < 4; k++) { const sh = [1500 + 10, 790 - 460 * 0.76], a = -0.9 + k * 0.25, L = 150; const hd = [sh[0] + Math.cos(a) * L, sh[1] + Math.sin(a) * L]; f(K.limbPath(sh, hd, 13, 9)); f(K.limbPath(hd, [hd[0] + 20, hd[1] - 70], 5, 5)); }
      const R = (u, v) => [1500 - u * 460, 790 - v * 460];
      K.overlay((pen) => {
        // the clash of weapons in the middle of the sky
        const c = [900, 600];
        pen.line([r.tip, c], { w: 30, color: '#bff0ff', alpha: 0.4, taper: 0.3 }); pen.line([r.tip, c], { w: 8, color: '#ffffff', taper: 0.1 });
        pen.line([rv.tip, c], { w: 26, color: '#ff8a1a', alpha: 0.45, taper: 0.3 }); pen.line([rv.tip, c], { w: 7, color: '#ffd23a', taper: 0.1 });
        for (let k = 0; k < 36; k++) { const a = k / 36 * 6.283, L = K.R(80, 220); pen.line([c, [c[0] + Math.cos(a) * L, c[1] + Math.sin(a) * L]], { w: K.R(3, 8), color: K.pick(['#ffffff', '#fff3a0', '#bff0ff', '#ffb02a']), taper: 1 }); }
        pen.dab(c[0], c[1], 40, '#ffffff');
      });
      K.sparks(80, [500, 300, 1300, 900], ['#ffffff', '#fff3a0', '#bff0ff']);
    },
  };
})();
