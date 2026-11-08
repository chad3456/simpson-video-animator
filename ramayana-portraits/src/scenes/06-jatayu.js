// 06 — Jatayu: the old vulture-king who flew at Ravana's chariot to save Sita, wings torn, eye still burning.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['06-jatayu'] = {
    title: 'Jatayu — the Last Flight',
    seed: 606,
    accents: ['#ffd23a', '#ff3a6a', '#ffffff', '#3ad0ff', '#8a3aff'],
    flow: RP.flows.swirl(600, 700),
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#2a1a7a', '#8a1a8a', '#ff3a5a', '#ff8a2a', '#ffd23a']));
      K.blob(950, 1150, 300, '#fff2a0', 0.9); // setting sun
      K.blob(150, 200, 400, '#1a1a6a', 0.8);
      const F = K.head({ x: 640, y: 640, s: 250 });
      const T = F.T;
      // wings
      // wings: feathers grow from an arm (shoulder -> wrist); one raised, one broken and drooping
      const wing = (sx, sy, wx, wy, a0, a1, n, len, broken) => {
        for (let k = n - 1; k >= 0; k--) {
          const t = k / (n - 1);
          const bx = sx + (wx - sx) * t, by = sy + (wy - sy) * t;
          const a = a0 + (a1 - a0) * t + (broken && k % 3 === 0 ? K.R(0.2, 0.5) : 0);
          const L = len * (0.55 + 0.45 * t);
          const tipx = bx + Math.cos(a) * L, tipy = by + Math.sin(a) * L;
          const nx = -Math.sin(a) * 48, ny = Math.cos(a) * 48;
          const f = K.path([[bx + nx * 0.5, by + ny * 0.5], [bx + Math.cos(a) * L * 0.55 + nx, by + Math.sin(a) * L * 0.55 + ny], [tipx, tipy], [bx + Math.cos(a) * L * 0.55 - nx, by + Math.sin(a) * L * 0.55 - ny], [bx - nx * 0.5, by - ny * 0.5]]);
          K.fill(f, K.lin(bx, by, tipx, tipy, [[0, '#3a1420'], [0.45, K.pick(['#8a4a22', '#a8602a', '#6a2a1a'])], [0.7, '#e8c08a'], [1, K.pick(['#ffffff', '#fff0d0', '#d8c8ff'])]]));
          K.focus(f, 0.72);
          K.flowStroke([[bx, by], [tipx, tipy]], 50);
        }
        // covert feathers along the arm
        const cov = K.path([[sx, sy - 40], [sx + (wx - sx) * 0.5, sy + (wy - sy) * 0.5 - 40], [wx, wy], [sx + (wx - sx) * 0.55, sy + (wy - sy) * 0.55 + 70], [sx, sy + 90]]);
        K.fill(cov, K.lin(sx, sy, wx, wy, ['#4a1a2a', '#8a4a2a', '#c8905a']));
        K.focus(cov, 0.6);
      };
      wing(500, 920, 70, 260, -3.05, -2.05, 18, 560, false);
      wing(790, 920, 1150, 380, -0.1, -1.05, 18, 520, true);
      // body and neck ruff
      const body = K.path([T(-0.55, 0.3), T(0.55, 0.3), T(0.9, 1.3), T(0.8, 3.8), T(-0.8, 3.8), T(-0.9, 1.3)]);
      K.fill(body, K.skinGrad(F, ['#c8804a', '#7a3a2a', '#3a1430', '#14061a'], -1.4, 1.4));
      K.focus(body, 0.5);
      K.flow(body, Math.PI / 2);
      const ruff = K.path([T(-0.75, 0.2), T(-0.9, 0.8), T(-0.5, 1.4), T(0, 1.55), T(0.5, 1.4), T(0.9, 0.8), T(0.75, 0.2)]);
      K.fill(ruff, K.skinGrad(F, ['#ffffff', '#f4e8d0', '#b8a8d0', '#6a5aa0'], -0.9, 0.9));
      K.focus(ruff, 0.7);
      // head (facing left), hooked beak
      const head = K.path([T(-0.45, -0.55), T(0.1, -0.75), T(0.6, -0.5), T(0.75, 0.1), T(0.55, 0.55), T(0, 0.65), T(-0.5, 0.35)]);
      K.fill(head, K.skinGrad(F, ['#ffe0a8', '#e8903a', '#8a3a4a', '#2a0a3a'], -0.7, 0.7, true));
      K.focus(head, 1);
      const beak = K.path([T(-0.45, -0.3), T(-0.9, -0.32), T(-1.3, -0.1), T(-1.42, 0.2), T(-1.3, 0.38), T(-1.22, 0.18), T(-0.9, 0.2), T(-0.5, 0.3)]);
      K.fill(beak, K.lin(...T(-0.5, -0.3), ...T(-1.4, 0.3), ['#fff07a', '#ffc21a', '#e0701a', '#6a2a10']));
      K.focus(beak, 1);
      K.flowStroke([T(-0.5, 0), T(-1.3, 0.05)], F.s * 0.5);
      K.crown(F, { h: 0.55, bw: 0.42, wings: false });
      K.overlay((pen) => {
        const s = F.s;
        // beak outlines and nostril
        pen.line([T(-0.48, -0.32), T(-0.9, -0.33), T(-1.28, -0.12), T(-1.42, 0.2), T(-1.3, 0.38)], { w: s * 0.025, color: '#4a1a0a' });
        pen.line([T(-0.5, 0.12), T(-0.95, 0.12), T(-1.22, 0.2)], { w: s * 0.02, color: '#3a0a0a' });
        pen.fill(K.ell(...T(-0.7, -0.15), s * 0.05, s * 0.025, -0.2), '#3a1a0a');
        // the burning eye under a heavy brow ridge
        const e = T(-0.12, -0.18);
        pen.fill(K.ell(e[0], e[1], s * 0.13, s * 0.11, 0), '#2a0a1a');
        pen.fill(K.ell(e[0], e[1], s * 0.1, s * 0.09, 0), '#ffd21a');
        pen.fill(K.ell(e[0] - s * 0.01, e[1], s * 0.05, s * 0.05, 0), '#0a0408');
        pen.dab(e[0] - s * 0.04, e[1] - s * 0.04, s * 0.02, '#ffffff');
        pen.line([T(-0.35, -0.38), T(-0.1, -0.36), T(0.15, -0.26)], { w: s * 0.06, color: '#3a0a2a', taper: 0.7 });
        // a few crisp feather edges on the ruff
        for (let k = 0; k < 40; k++) {
          const u = K.R(-0.8, 0.8), v = K.R(0.5, 1.35);
          pen.line([T(u, v), T(u * 1.05, v + K.R(0.1, 0.2))], { w: s * 0.025, color: K.pick(['#ffffff', '#e8e0ff', '#c8b8f0']), alpha: 0.8, taper: 1 });
        }
        // drops of blood on the broken wing
        for (let k = 0; k < 6; k++) pen.dab(K.R(900, 1150), K.R(500, 800), K.R(6, 11), '#c0102a');
        // falling feathers
        for (let k = 0; k < 7; k++) {
          const x = K.R(100, 1100), y = K.R(1000, 1420), a = K.R(0, 3);
          pen.line([[x, y], [x + Math.cos(a) * 50, y + Math.sin(a) * 50]], { w: 12, color: K.pick(['#fff4e0', '#e8c08a']), taper: 1 });
        }
      });
    },
  };
})();
