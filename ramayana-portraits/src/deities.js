/*
 * Deity kit for the Shiva series: Shiva's iconography (jata with the Ganga and the crescent moon, the third eye over the
 * tripundra, Vasuki at the throat, rudraksha, tiger skin), trishul and damaru, Nandi, the lingam, Parvati and Ganesha.
 */
(function (global) {
  'use strict';
  const RP = global.RP;
  const baseMakeKit = RP.makeKit;

  RP.makeKit = function (env) {
    const K = baseMakeKit(env);

    const SH = K.SH = {
      // karpura-gauram: camphor-white, ash-smeared, cool blue in the shadows
      skin: ['#d4ecff', '#80aee6', '#3e5cb8', '#151a5c'],
      blue: ['#c8f0ff', '#5ab0f0', '#2a5ad0', '#14106a'],
      hair: ['#6a5a8a', '#3a2a5a', '#1a1030', '#0a0614'],
      strands: ['#a08ad0', '#2a1a40', '#c8b0e0', '#5a3a7a'],
      tiger: ['#ffe08a', '#f0a030', '#b0581a', '#3a160a'],
      throat: '#2a3ad8',
      snake: '#2a8a6a',
      parvati: ['#ff5a3a', '#e0182a', '#9a0a3a', '#4a0a2a'],
      parvatiSkin: ['#ffe8c0', '#f8b07a', '#c06a6a', '#4a1a3a'],
    };

    // crescent moon: a bright disc bitten by a second disc of the backdrop colour
    K.crescent = (pen, x, y, r, a) => {
      // a = direction the horns point to
      const p = new Path2D();
      p.arc(x, y, r, a + 0.35, a - 0.35 + Math.PI * 2, false);
      const cx = x + Math.cos(a) * r * 0.5, cy = y + Math.sin(a) * r * 0.5;
      p.arc(cx, cy, r * 0.82, a - 0.62 + Math.PI * 2, a + 0.62, true);
      p.closePath();
      pen.fill(p, '#fffbe8');
      pen.line([[x - Math.cos(a) * r * 0.85 - Math.sin(a) * r * 0.3, y - Math.sin(a) * r * 0.85 + Math.cos(a) * r * 0.3], [x - Math.cos(a) * r * 0.85 + Math.sin(a) * r * 0.3, y - Math.sin(a) * r * 0.85 - Math.cos(a) * r * 0.3]], { w: r * 0.08, color: '#ffffff', alpha: 0.8 });
    };
    K.bead = (pen, x, y, r, c) => { pen.fill(K.ell(x, y, r, r), c || '#6a2010'); pen.fill(K.ell(x - r * 0.3, y - r * 0.3, r * 0.35, r * 0.35), '#d08a5a', 0.8); };

    // a serpent drawn along a path, with an optional raised hood at the end
    K.serpent = (pen, pts, w, o) => {
      o = o || {};
      const col = o.color || SH.snake;
      pen.line(pts, { w, color: '#0a2a2a', taper: 0.6 });
      pen.line(pts, { w: w * 0.8, color: col, taper: 0.6 });
      pen.line(pts.map(([x, y]) => [x - w * 0.15, y - w * 0.15]), { w: w * 0.25, color: '#a0ffd0', alpha: 0.6, taper: 0.7 });
      const d = RP.sampleCurve(pts, 5);
      for (let i = 1; i < d.length - 1; i += 3) pen.fill(K.ell(d[i][0], d[i][1], w * 0.12, w * 0.12), '#e8d890', 0.8);
      if (o.hood) {
        const [hx, hy] = pts[pts.length - 1], a = o.hoodAng == null ? -Math.PI / 2 : o.hoodAng;
        const c = [hx + Math.cos(a) * w * 1.2, hy + Math.sin(a) * w * 1.2];
        // cobra hood: broad, flaring, the head bowed forward at its top
        const ca = Math.cos(a + Math.PI / 2), sa = Math.sin(a + Math.PI / 2);
        const Q = (u, v) => [c[0] + u * w * ca - v * w * sa, c[1] + u * w * sa + v * w * ca];
        const hood = K.path([Q(0, 1.6), Q(-0.7, 1.0), Q(-1.35, 0.1), Q(-1.1, -0.9), Q(-0.4, -1.5), Q(0.4, -1.5), Q(1.1, -0.9), Q(1.35, 0.1), Q(0.7, 1.0)]);
        pen.fill(hood, '#0a2a2a');
        const hood2 = K.path([Q(0, 1.4), Q(-0.6, 0.9), Q(-1.2, 0.1), Q(-1.0, -0.8), Q(-0.35, -1.35), Q(0.35, -1.35), Q(1.0, -0.8), Q(1.2, 0.1), Q(0.6, 0.9)]);
        pen.fill(hood2, col);
        pen.fill(K.path([Q(0, 1.2), Q(-0.4, 0.6), Q(-0.55, -0.4), Q(0, -0.8), Q(0.55, -0.4), Q(0.4, 0.6)]), '#e8d890', 0.85);
        for (let k = 0; k < 4; k++) pen.line([Q(-0.4, 0.5 - k * 0.3), Q(0.4, 0.5 - k * 0.3)], { w: w * 0.05, color: '#8a7a40', alpha: 0.6 });
        const hd = K.ell(...Q(0, -1.55), w * 0.5, w * 0.42, a + Math.PI / 2); pen.fill(hd, col);
        for (const sd of [-1, 1]) pen.fill(K.ell(...Q(sd * 0.25, -1.6), w * 0.09, w * 0.09), '#ffd23a');
        pen.line([Q(0, -1.95), Q(0.05, -2.3)], { w: w * 0.06, color: '#e01020', taper: 0 });
      }
    };

    // decorate a Shiva head frame F (from K.head or a figure's headF)
    K.shivaHead = (F, o) => {
      o = o || {};
      const T = F.T, s = F.s;
      K.overlay((pen) => {
        // the Ganga springing from the crown of the jata
        if (o.ganga !== false) {
          const g = o.gangaDir || -1;
          for (let k = 0; k < 6; k++) {
            const off = (k - 2.5) * 0.04;
            const gv = (o.gangaV || -1.7) + 1.7;
            pen.line([T(0.05 * g + off, -1.7 + gv), T(0.35 * g + off, -2.15 - k * 0.03 + gv), T(0.9 * g + off, -2.3 - k * 0.02 + gv), T(1.35 * g + off * 2, -2.0 + gv)], { w: s * 0.05, color: K.pick(['#e8fbff', '#9ae0ff', '#5ac0f0', '#ffffff']), alpha: 0.85, taper: 0.8 });
          }
          for (let k = 0; k < 14; k++) pen.dab(...T((0.3 + K.rand() * 1.1) * g, -2.0 - K.rand() * 0.45 + (o.gangaV || -1.7) + 1.7), s * 0.025, '#ffffff', 0.9);
        }
        // crescent moon in the jata
        if (o.moon !== false) { const m = T(o.moonU == null ? 0.45 : o.moonU, o.moonV || -1.3); K.crescent(pen, m[0], m[1], s * 0.22, -2.0); }
        // rudraksha beads wound through the jata
        for (let k = 0; k < 9; k++) { const t = k / 8; K.bead(pen, ...T(-0.55 + t * 1.1, -1.0 - Math.sin(t * Math.PI) * 0.12), s * 0.035); }
        // tripundra: three broad bands of vibhuti across the brow
        if (o.tripundra !== false) for (let k = 0; k < 3; k++) {
          const v = -0.57 + k * 0.075;
          pen.line([T(-0.5, v + 0.03), T(-0.2, v), T(0.2, v), T(0.5, v + 0.03)], { w: s * 0.045, color: '#3a3a7a', alpha: 0.35, taper: 0.5 });
          pen.line([T(-0.5, v + 0.02), T(-0.2, v - 0.01), T(0.2, v - 0.01), T(0.5, v + 0.02)], { w: s * 0.038, color: '#fbfbff', alpha: 0.95, taper: 0.5 });
        }
        // the third eye, set vertically over the tripundra
        const e = T(0, -0.47);
        const a = F.tilt || 0;
        if (o.thirdEye === 'open' || o.thirdEye === 'fire') {
          pen.fill(K.ell(e[0], e[1], s * 0.045, s * 0.1, a), '#fff6e0');
          pen.fill(K.ell(e[0], e[1], s * 0.03, s * 0.045, a), o.thirdEye === 'fire' ? '#ff4a10' : '#3a1a10');
          pen.dab(e[0], e[1], s * 0.015, '#fff6a0');
          pen.line([T(0, -0.58), T(0.035, -0.47), T(0, -0.36)], { w: s * 0.015, color: '#160a24', taper: 0.5 });
          pen.line([T(0, -0.58), T(-0.035, -0.47), T(0, -0.36)], { w: s * 0.015, color: '#160a24', taper: 0.5 });
        } else {
          pen.line([T(0, -0.56), T(0.012, -0.47), T(0, -0.38)], { w: s * 0.022, color: '#c0101a', taper: 0.6 });
        }
        // serpent kundala
        if (o.earrings !== false) for (const sd of [-1, 1]) { const p = T(sd * 0.93, 0.1); pen.line([p, [p[0], p[1] + s * 0.25]], { w: s * 0.05, color: SH.snake, taper: 0.4 }); pen.dab(p[0], p[1] + s * 0.28, s * 0.05, '#fff6c0'); }
      });
    };

    // Shiva's own jata for close portraits: a tall coil of matted locks with strands falling to the shoulders
    K.shivaJata = (F, o) => {
      o = o || {};
      const T = F.T, s = F.s, c = o.colors || SH.hair;
      const pile = K.path([T(-0.78, -0.3), T(-0.8, -0.9), T(-0.6, -1.25), T(-0.55, -1.75), T(-0.3, -2.1), T(0.1, -2.2), T(0.45, -2.0), T(0.6, -1.6), T(0.62, -1.25), T(0.8, -0.9), T(0.78, -0.3), T(0.5, -0.66), T(0, -0.76), T(-0.5, -0.66)]);
      K.fill(pile, K.skinGrad ? K.skinGrad(F, c, -1.1, 1.1) : c[1]); K.focus(pile, 0.75);
      K.overlay((pen) => {
        // coiled bands of the bun
        for (let k = 0; k < 6; k++) { const v = -1.25 - k * 0.15, w = 0.6 - k * 0.04; pen.line([T(-w, v + 0.05), T(-w * 0.3, v - 0.06), T(w * 0.4, v - 0.04), T(w, v + 0.06)], { w: s * 0.05, color: K.pick(o.strands || SH.strands), alpha: 0.7, taper: 0.8 }); }
        // locks swept up from the brow
        for (let k = 0; k < 12; k++) { const a = -0.7 + k * 0.127; pen.line([T(a, -0.7), T(a * 0.85, -1.0), T(a * 0.6, -1.25)], { w: s * 0.03, color: K.pick(o.strands || SH.strands), alpha: 0.65, taper: 1 }); }
        // a few loose locks falling beside the face
        for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) pen.line([T(sd * (0.78 + k * 0.05), -0.4), T(sd * (0.95 + k * 0.08), 0.4), T(sd * (1.0 + k * 0.1), 1.3), T(sd * (1.1 + k * 0.12), 2.0)], { w: s * 0.06, color: k % 2 ? c[2] : c[1], taper: 0.8 });
      });
    };

    // Shiva as a full figure: K.figure plus his marks. o.look: 'yogi' (default) | 'nataraja' | 'rudra'
    K.shiva = (o) => {
      const base = {
        skin: o.blue ? SH.blue : SH.skin, head: 'jata', ascetic: true, earrings: false, hairColors: SH.hair, strands: SH.strands,
        cloth: SH.tiger, border: '#3a160a', turn: 0,
        face: Object.assign({ eyes: 'half', mouth: 'calm', brow: 'calm', tilak: 'none', gaze: [0, 0.4], contourColor: '#1a0a4a', contourLight: '#ffffff', lips: '#7a2a5a', lips2: '#b04a7a' }, o.face || {}),
      };
      const r = K.figure(Object.assign(base, o, { face: base.face }));
      const T = r.T, h = o.h;
      if (o.pose && o.pose.legs === 'lotus') {
        // padmasana: shins crossed in front, soles turned up
        const sk = o.skin || base.skin;
        for (const sd of [-1, 1]) { const p = K.limbPath(T(sd * 0.25, -0.44), T(-sd * 0.1, -0.49), 0.07 * h, 0.05 * h); K.fill(p, K.split(...T(-0.3, -0.45), ...T(0.3, -0.45), sk)); K.focus(p, 0.75); const f = K.ell(...T(-sd * 0.13, -0.5), 0.045 * h, 0.022 * h); K.fill(f, '#e8a0b0'); K.focus(f, 0.8); }
      }
      K.overlay((pen) => {
        // tiger stripes on the skin
        for (let k = 0; k < 9; k++) { const u = -0.08 + k * 0.02, v = -0.5 + (k % 3) * 0.06; pen.line([T(u, v), T(u + 0.012, v + 0.03), T(u - 0.004, v + 0.06)], { w: h * 0.006, color: '#2a0a04', alpha: 0.85, taper: 1 }); }
        // blue throat of Neelakantha
        pen.dab(...T(0, -0.86), h * 0.016, o.throat || SH.throat, o.neelkantha ? 0.95 : 0.55);
        // rudraksha mala
        const mala = RP.sampleCurve([T(-0.075, -0.825), T(-0.04, -0.72), T(0, -0.69), T(0.04, -0.72), T(0.075, -0.825)], 5);
        for (let i = 0; i < mala.length; i += 2) K.bead(pen, mala[i][0], mala[i][1], h * 0.006);
        // Vasuki around the neck, hood raised by the right shoulder
        if (o.vasuki !== false && h > 250) K.serpent(pen, [T(-0.07, -0.82), T(-0.03, -0.79), T(0.03, -0.795), T(0.08, -0.83), T(0.11, -0.88)], h * 0.013, { hood: true, hoodAng: -1.4 });
        // ash bands on the arms
        if (o.ash !== false) for (const hd of [r.handL, r.handR]) pen.dab(hd[0], hd[1], h * 0.006, '#ffffff', 0.4);
      });
      if (r.headF) K.shivaHead(r.headF, Object.assign({ earrings: true }, o.head2 || {}));
      return r;
    };

    // trishul from base (x,y), length L, tilted by ang (0 = straight up); damaru tied below the prongs
    K.trishul = (x, y, L, ang, o) => {
      o = o || {};
      const ux = Math.sin(ang), uy = -Math.cos(ang), px = -uy, py = ux;
      const P = (t, n) => [x + ux * L * t + px * L * n, y + uy * L * t + py * L * n];
      K.strokeRef([P(0, 0), P(1, 0)], L * 0.02, '#c8c8d8');
      if (o.glow) K.blob(...P(0.92, 0), L * 0.16, o.glow, 0.6);
      K.overlay((pen) => {
        pen.line([P(0, 0), P(0.86, 0)], { w: L * 0.018, color: '#3a2a3a', taper: 0 });
        pen.line([P(0, -0.004), P(0.86, -0.004)], { w: L * 0.007, color: '#e8e0ff', alpha: 0.8, taper: 0 });
        const blade = (pts, w) => { pen.line(pts, { w, color: '#2a2a3a', taper: 0.9 }); pen.line(pts.map(([a, b]) => [a - 2, b - 2]), { w: w * 0.45, color: o.glow || '#f0f4ff', taper: 0.9 }); };
        pen.line([P(0.84, -0.07), P(0.85, 0), P(0.84, 0.07)], { w: L * 0.025, color: '#3a2a3a', taper: 0 });
        blade([P(0.85, 0), P(1.0, 0)], L * 0.03);
        blade([P(0.84, -0.065), P(0.9, -0.075), P(0.97, -0.06)], L * 0.022);
        blade([P(0.84, 0.065), P(0.9, 0.075), P(0.97, 0.06)], L * 0.022);
        if (o.damaru !== false) {
          const c = P(0.74, 0.05);
          pen.line([P(0.76, 0), c], { w: 3, color: '#ffe0a0', taper: 0 });
          K.damaruPen(pen, c[0], c[1], L * 0.05, ang + 1.4);
        }
      });
    };
    K.damaruPen = (pen, x, y, s, a) => {
      const ca = Math.cos(a), sa = Math.sin(a);
      const P = (u, v) => [x + u * s * ca - v * s * sa, y + u * s * sa + v * s * ca];
      pen.fill(K.poly([P(-1, -0.7), P(-1, 0.7), P(0, 0.12), P(1, 0.7), P(1, -0.7), P(0, -0.12)]), '#c08a4a');
      pen.line([P(-1, -0.7), P(-1, 0.7)], { w: s * 0.18, color: '#fff0c0', taper: 0 });
      pen.line([P(1, -0.7), P(1, 0.7)], { w: s * 0.18, color: '#fff0c0', taper: 0 });
      pen.line([P(0, 0), P(0.2, 1.1)], { w: s * 0.06, color: '#e01020', taper: 0 }); pen.dab(...P(0.2, 1.15), s * 0.12, '#ffd23a');
      pen.line([P(0, 0), P(-0.2, -1.1)], { w: s * 0.06, color: '#e01020', taper: 0 }); pen.dab(...P(-0.2, -1.15), s * 0.12, '#ffd23a');
    };
    K.damaru = (x, y, s, a) => K.overlay((pen) => K.damaruPen(pen, x, y, s, a || 0));

    // Nandi, seated and gazing, s = body length
    K.nandi = (x, y, s, o) => {
      o = o || {};
      const d = o.dir || 1;
      const P = (u, v) => [x + u * s * d, y + v * s];
      const c = o.colors || ['#fbfaf4', '#d8d4e0', '#8a88a8', '#2a2a48'];
      const F2 = (p, fill, foc) => { K.fill(p, fill); K.focus(p, foc); };
      // folded hind leg (haunch) and the body
      F2(K.ell(...P(-0.32, -0.26), s * 0.22, s * 0.2), K.split(x - s * 0.5 * d, y, x, y, c), 0.75);
      F2(K.ell(...P(0, -0.3), s * 0.48, s * 0.22), K.split(x - s * 0.5 * d, y, x + s * 0.5 * d, y, c), 0.8);
      // folded foreleg with hoof
      F2(K.limbPath(P(0.28, -0.14), P(0.52, -0.06), s * 0.09, s * 0.065), c[1], 0.75);
      F2(K.ell(...P(0.56, -0.05), s * 0.04, s * 0.03), '#4a3a3a', 0.8);
      // hump, dewlap, neck and the head held up, muzzle forward
      F2(K.ell(...P(0.2, -0.5), s * 0.15, s * 0.11), c[0], 0.8);
      F2(K.limbPath(P(0.28, -0.38), P(0.5, -0.5), s * 0.26, s * 0.17), K.split(...P(0.28, -0.4), ...P(0.5, -0.4), c), 0.8);
      F2(K.path([P(0.3, -0.26), P(0.42, -0.3), P(0.5, -0.42), P(0.36, -0.4)]), c[1], 0.75);
      F2(K.limbPath(P(0.5, -0.56), P(0.66, -0.44), s * 0.15, s * 0.1), K.split(...P(0.5, -0.5), ...P(0.68, -0.5), c), 0.9);
      F2(K.ell(...P(0.68, -0.43), s * 0.055, s * 0.045), '#c8a0a8', 0.9);
      K.overlay((pen) => {
        // horns curving up, ear, eye, garland of bells
        pen.line([P(0.5, -0.6), P(0.46, -0.7), P(0.5, -0.78)], { w: s * 0.03, color: '#e8d8a8', taper: 0.7 });
        pen.line([P(0.55, -0.6), P(0.56, -0.71), P(0.62, -0.78)], { w: s * 0.03, color: '#d8c898', taper: 0.7 });
        pen.fill(K.ell(...P(0.44, -0.58), s * 0.06, s * 0.025, -0.4 * d), c[2]);
        pen.fill(K.ell(...P(0.58, -0.52), s * 0.016, s * 0.016), '#14081a');
        pen.line([P(0.34, -0.48), P(0.44, -0.36), P(0.52, -0.38)], { w: s * 0.025, color: '#e01020', taper: 0 });
        for (let k = 0; k < 3; k++) pen.fill(K.ell(...P(0.38 + k * 0.05, -0.39 + k * 0.01), s * 0.02, s * 0.02), '#ffd23a');
        // outline so the white bull reads against snow or sky
        pen.line(RP.sampleCurve([P(-0.52, -0.16), P(-0.5, -0.38), P(-0.25, -0.5), P(0.06, -0.52), P(0.16, -0.6), P(0.3, -0.6)], 4), { w: s * 0.012, color: c[3], alpha: 0.6, taper: 0.3 });
        pen.line([P(-0.5, -0.12), P(0, -0.05), P(0.5, -0.06)], { w: s * 0.014, color: c[3], alpha: 0.5, taper: 0.3 });
        const cloth = K.path([P(-0.1, -0.5), P(0.08, -0.52), P(0.1, -0.32), P(-0.12, -0.3)]);
        pen.fill(cloth, '#c0102a', 0.9);
        pen.line([P(-0.12, -0.3), P(0.1, -0.32)], { w: s * 0.02, color: '#ffd23a', taper: 0 });
        pen.line([P(-0.5, -0.35), P(-0.62, -0.15), P(-0.6, -0.05)], { w: s * 0.025, color: c[2], taper: 0.4 });
        for (let k = 0; k < 3; k++) pen.line([P(0.52, -0.57 + k * 0.02), P(0.57, -0.55 + k * 0.02)], { w: s * 0.008, color: '#ffffff' });
      });
    };

    // Shiva lingam on its yoni pitha: s = width of the base
    K.lingam = (x, y, s, o) => {
      o = o || {};
      const base = K.path([[x - s * 0.5, y - s * 0.12], [x + s * 0.5, y - s * 0.12], [x + s * 0.85, y - s * 0.2], [x + s * 0.9, y - s * 0.12], [x + s * 0.5, y], [x - s * 0.5, y]]);
      K.fill(base, K.split(x - s * 0.5, 0, x + s * 0.9, 0, o.colors || ['#8a8ab0', '#4a4a7a', '#2a2a4a', '#0a0a1a'])); K.focus(base, 0.7);
      const top = K.ell(x, y - s * 0.14, s * 0.5, s * 0.1); K.fill(top, '#5a5a8a'); K.focus(top, 0.7);
      const shaft = K.path([[x - s * 0.22, y - s * 0.14], [x - s * 0.22, y - s * 0.6], [x - s * 0.15, y - s * 0.76], [x, y - s * 0.8], [x + s * 0.15, y - s * 0.76], [x + s * 0.22, y - s * 0.6], [x + s * 0.22, y - s * 0.14]]);
      K.fill(shaft, K.split(x - s * 0.22, 0, x + s * 0.22, 0, o.colors || ['#9a9ac8', '#4a4a7a', '#2a2a4a', '#0a0a1a'])); K.focus(shaft, 0.8);
      K.overlay((pen) => {
        for (let k = 0; k < 3; k++) pen.line([[x - s * 0.19, y - s * (0.56 - k * 0.05)], [x, y - s * (0.54 - k * 0.05)], [x + s * 0.19, y - s * (0.56 - k * 0.05)]], { w: s * 0.02, color: '#f4efe6' });
        pen.dab(x, y - s * 0.5, s * 0.03, '#e01020');
        pen.line([[x - s * 0.16, y - s * 0.74], [x, y - s * 0.79], [x + s * 0.16, y - s * 0.74]], { w: s * 0.02, color: '#ffffff', alpha: 0.5 });
        if (o.bilva !== false) for (const dx of [-0.08, 0, 0.08]) pen.fill(K.ell(x + dx * s, y - s * 0.78 + Math.abs(dx) * s * 0.3, s * 0.035, s * 0.07, dx * 8), '#2aa05a');
        if (o.flowers !== false) for (let k = 0; k < 10; k++) pen.dab(x + K.R(-0.45, 0.45) * s, y - s * K.R(0.13, 0.17), s * 0.025, K.pick(['#ffffff', '#ff8a1a', '#ffd23a']));
        if (o.serpent) K.serpent(pen, [[x + s * 0.3, y - s * 0.16], [x + s * 0.28, y - s * 0.5], [x + s * 0.12, y - s * 0.86], [x, y - s * 0.95]], s * 0.05, { hood: true, hoodAng: -1.7 });
      });
    };

    K.parvati = (o) => {
      const base = { female: true, skin: SH.parvatiSkin, head: 'veil', veil: o.saree || SH.parvati, veilBorder: '#ffd23a', top: o.saree || SH.parvati, cloth: o.saree || SH.parvati, long: true, hairColors: ['#2a1a3a', '#1a0a2a', '#0a0414', '#000000'] };
      const face = Object.assign({ eyes: 'soft', mouth: 'smile', tilak: 'bindi', lashes: true, gaze: [o.turn > 0 ? 0.6 : -0.6, 0.1] }, o.face || {});
      const r = K.figure(Object.assign(base, o, { face }));
      if (r.headF) { const T = r.T; K.necklace([T(-0.06, -0.83), T(-0.03, -0.79), T(0, -0.775), T(0.03, -0.79), T(0.06, -0.83)], { w: o.h * 0.008 }); }
      return r;
    };

    // Ganesha as a child: a small figure whose head is replaced by the elephant head
    K.ganesha = (o) => {
      const sk = ['#ffd0a0', '#ff8a5a', '#c04a4a', '#4a1a2a'];
      const r = K.figure(Object.assign({ skin: sk, head: 'none', cloth: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'], earrings: false, ascetic: false }, o, { h: o.h }));
      const [x, y] = r.hc, s = r.s * 1.35;
      const ears = K.ell(x, y + s * 0.1, s * 1.55, s * 0.95); K.fill(ears, K.split(x - s * 1.5, 0, x + s * 1.5, 0, ['#ffc8a0', '#f08a6a', '#b04a5a', '#4a1a3a'])); K.focus(ears, 0.7);
      const head = K.ell(x, y, s * 0.85, s * 0.95); K.fill(head, K.split(x - s, 0, x + s, 0, sk)); K.focus(head, 0.85);
      const trunk = K.path([[x - s * 0.3, y + s * 0.2], [x + s * 0.3, y + s * 0.2], [x + s * 0.2, y + s * 1.1], [x + s * 0.55, y + s * 1.5], [x + s * 0.4, y + s * 1.6], [x - s * 0.05, y + s * 1.15], [x - s * 0.15, y + s * 0.6]]);
      K.fill(trunk, K.split(x - s * 0.3, 0, x + s * 0.5, 0, sk)); K.focus(trunk, 0.85);
      K.overlay((pen) => {
        for (const sd of [-1, 1]) { pen.fill(K.ell(x + sd * s * 0.38, y - s * 0.05, s * 0.13, s * 0.08), '#fff6e0'); pen.dab(x + sd * s * 0.38, y - s * 0.05, s * 0.06, '#1a0a14'); }
        pen.line([[x + s * 0.3, y + s * 0.5], [x + s * 0.55, y + s * 0.75]], { w: s * 0.1, color: '#fff6e0', taper: 0.6 });
        for (let k = 0; k < 4; k++) pen.line([[x - s * 0.15, y + s * (0.5 + k * 0.2)], [x + s * 0.15, y + s * (0.55 + k * 0.2)]], { w: s * 0.03, color: '#a04a4a', alpha: 0.6 });
        for (let k = 0; k < 3; k++) pen.line([[x - s * 0.3, y - s * (0.55 - k * 0.1)], [x + s * 0.3, y - s * (0.55 - k * 0.1)]], { w: s * 0.04, color: '#ffffff' });
        pen.dab(x, y - s * 0.6, s * 0.07, '#e01020');
        const cr = K.poly([[x - s * 0.55, y - s * 0.75], [x - s * 0.4, y - s * 1.45], [x, y - s * 1.75], [x + s * 0.4, y - s * 1.45], [x + s * 0.55, y - s * 0.75]]);
        pen.fill(cr, '#ffc22a'); pen.line([[x - s * 0.55, y - s * 0.8], [x + s * 0.55, y - s * 0.8]], { w: s * 0.1, color: '#ffe68a' });
        pen.dab(x, y - s * 1.2, s * 0.12, '#e01020');
      });
      return r;
    };

    return K;
  };
})(typeof window !== 'undefined' ? window : globalThis);
