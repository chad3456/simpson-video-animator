/*
 * Ramayana Portraits — figure & landscape kit for the narrative event paintings.
 * Full-body figures (human, vanara, rakshasa), elephants, chariots, boats,
 * palaces, trees, crowds, water and sky. Everything blocks into the hidden
 * reference image and queues crisp detail (jewellery, borders, features) as
 * overlays, exactly like the portrait kit.
 */
(function (global) {
  'use strict';
  const RP = global.RP;
  const TAU = Math.PI * 2;
  const baseMakeKit = RP.makeKit;

  RP.makeKit = function (env) {
    const K = baseMakeKit(env);
    const ctx = K.ctx;

    // two-tone gradient across a span, light side first
    K.split = (x0, y0, x1, y1, c) => K.lin(x0, y0, x1, y1, [[0, c[0]], [0.42, c[1]], [0.62, c[2]], [1, c[3]]]);

    // tapered limb (capsule) from a to b
    K.limbPath = (a, b, wa, wb) => {
      const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
      const nx = -dy / d, ny = dx / d;
      const p = new Path2D();
      p.moveTo(a[0] + nx * wa / 2, a[1] + ny * wa / 2);
      p.lineTo(b[0] + nx * wb / 2, b[1] + ny * wb / 2);
      p.arc(b[0], b[1], wb / 2, Math.atan2(ny, nx), Math.atan2(ny, nx) + Math.PI, false);
      p.lineTo(a[0] - nx * wa / 2, a[1] - ny * wa / 2);
      p.arc(a[0], a[1], wa / 2, Math.atan2(-ny, -nx), Math.atan2(-ny, -nx) + Math.PI, false);
      p.closePath();
      return p;
    };

    K.poses = {
      rest: [0.12, 0.05], anjali: [0.32, -2.75], offer: [0.9, 0.9], raised: [2.7, 0.1], hip: [0.55, -1.7],
      lap: [0.25, -1.1], chest: [0.3, -2.3], blessing: [0.5, -2.2], wide: [1.4, 0.2], reach: [1.3, 0.6],
    };
    // a small head for distant figures
    K.smallHead = (x, y, s, o) => {
      o = o || {};
      const sk = o.skin || ['#ffd8a0', '#f09a5a', '#a04a6a', '#3a1a4a'];
      if (o.hair !== false) K.fill(K.ell(x + (o.turn || 0) * s * 0.1, y - s * 0.15, s * 0.78, s * 0.9), o.hairColor || '#1a1030');
      const head = K.ell(x, y, s * 0.68, s * 0.88);
      K.fill(head, K.split(x - s, y, x + s, y, sk));
      K.focus(head, o.focus == null ? 0.9 : o.focus);
      if (s >= 9) K.overlay((pen) => {
        const t = (o.turn || 0) * s * 0.18;
        for (const sd of [-1, 1]) {
          pen.line([[x + t + sd * s * 0.42, y - s * 0.05], [x + t + sd * s * 0.2, y - s * 0.08]], { w: Math.max(1.2, s * 0.11), color: '#140a20', taper: 0.4 });
        }
        if (o.mouth !== false) pen.line([[x + t - s * 0.16, y + s * 0.42], [x + t, y + s * 0.46], [x + t + s * 0.16, y + s * 0.42]], { w: Math.max(1, s * 0.08), color: '#8a1a2a', taper: 0.5 });
        if (o.tilak) pen.line([[x + t, y - s * 0.3], [x + t, y - s * 0.6]], { w: Math.max(1.2, s * 0.08), color: '#e0141e', taper: 0.3 });
      });
      return head;
    };

    /*
     * Full-body figure. Local frame: origin at the feet, -y up, unit = figure height h.
     * o: x, y, h, rot, skin[4], cloth (lower garment colours[4]), top (upper/uttariya colours[4]) or null for bare chest,
     *    pose: { armL:[shoulder, elbow], armR:[...], legs:'stand'|'walk'|'kneel'|'sit'|'fly'|'leap' },
     *    head: 'crown'|'jata'|'long'|'veil'|'bun'|'none'|'monkey', face: {...K.face opts}, turn, female, tail
     * Arm angles in radians from straight down; positive swings the arm outward from the body.
     * Returns { handL, handR, headF, T }.
     */
    K.figure = (o) => {
      const h = o.h, rot = o.rot || 0, cr = Math.cos(rot), sr = Math.sin(rot);
      const dv = (o.pose && o.pose.legs === 'kneel') ? 0.2 : 0;
      const T = (u, v) => { v += dv; return [o.x + (u * cr - v * sr) * h, o.y + (u * sr + v * cr) * h]; };
      const sk = o.skin || ['#ffd8a0', '#f09a5a', '#a04a6a', '#3a1a4a'];
      const cloth = o.cloth || ['#fff27a', '#ffc21a', '#e0601a', '#7a1a2a'];
      const pose = o.pose || {};
      const legs = pose.legs || 'stand';
      const F = o.female;
      const sh = F ? 0.105 : 0.125, wa = F ? 0.07 : 0.078, hp = F ? 0.1 : 0.09;
      const yS = -0.815, yW = -0.6, yH = -0.52;
      const L = (a, b, w0, w1, fill, foc) => { const p = K.limbPath(T(...a), T(...b), w0 * h, w1 * h); K.fill(p, fill); K.focus(p, foc == null ? 0.7 : foc); return p; };
      const gx = (u) => { const a = T(u - 0.2, -0.5), b = T(u + 0.2, -0.5); return K.split(a[0], a[1], b[0], b[1], sk); };
      const grad = K.split(...T(-0.22, -0.5), ...T(0.22, -0.5), sk);
      const cgrad = K.split(...T(-0.25, -0.3), ...T(0.25, -0.3), cloth);

      // tail (vanara) behind everything
      if (o.tail) {
        const tp = [T(0.04, yH + 0.04), T(0.26, yH + 0.1), T(0.34, yH - 0.12), T(0.24, yH - 0.36), T(0.3, yH - 0.55), T(0.42, yH - 0.62)];
        K.strokeRef(tp, 0.055 * h, o.tailColor || sk[1]);
        K.flowStroke(tp, 0.06 * h);
        K.focus((() => { const p = new Path2D(); p.addPath(K.limbPath(tp[0], tp[2], 0.06 * h, 0.06 * h)); p.addPath(K.limbPath(tp[2], tp[5], 0.06 * h, 0.05 * h)); return p; })(), 0.6);
        if (o.tailFire) K.overlay((pen) => {
          const tip = tp[tp.length - 1];
          for (let k = 0; k < 16; k++) pen.line([tip, [tip[0] + K.R(-0.12, 0.12) * h, tip[1] - K.R(0.08, 0.3) * h]], { w: h * K.R(0.02, 0.05), color: K.pick(['#fff3a0', '#ffd23a', '#ff7a1a', '#e0201a']), taper: 1 });
        });
        if (o.tailFire) { const tip = tp[tp.length - 1]; K.blob(tip[0], tip[1] - 0.1 * h, 0.3 * h, '#ffb02a', 0.9); }
      }
      // legs
      let kneeL, kneeR, footL, footR;
      if (legs === 'stand') { kneeL = [-0.05, -0.27]; footL = [-0.06, -0.02]; kneeR = [0.05, -0.27]; footR = [0.07, -0.02]; }
      else if (legs === 'walk') { kneeL = [-0.1, -0.28]; footL = [-0.16, -0.02]; kneeR = [0.08, -0.27]; footR = [0.12, -0.02]; }
      else if (legs === 'stride') { kneeL = [-0.16, -0.3]; footL = [-0.26, -0.02]; kneeR = [0.12, -0.26]; footR = [0.24, -0.02]; }
      else if (legs === 'kneel') { kneeL = [-0.05, -0.22]; footL = [0.08, -0.24]; kneeR = [0.15, -0.42]; footR = [0.17, -0.22]; }
      else if (legs === 'sit') { kneeL = [-0.12, -0.46]; footL = [-0.12, -0.02]; kneeR = [0.12, -0.46]; footR = [0.13, -0.02]; }
      else if (legs === 'lotus') { kneeL = [-0.22, -0.46]; footL = [0.06, -0.47]; kneeR = [0.22, -0.46]; footR = [-0.06, -0.47]; }
      else if (legs === 'fly' || legs === 'leap') { kneeL = [-0.02, -0.3]; footL = [-0.02, -0.06]; kneeR = [0.08, -0.36]; footR = [0.2, -0.2]; }
      const legW = F ? 0.055 : 0.065;
      if (legs !== 'hidden') {
        for (const [k, f, side] of [[kneeL, footL, -1], [kneeR, footR, 1]]) {
          const hipPt = [side * hp * 0.5, yH + 0.02];
          L(hipPt, k, legW * 1.2, legW * 0.85, gx(side * 0.05));
          L(k, f, legW * 0.85, legW * 0.5, gx(side * 0.05));
          const ft = K.ell(...T(f[0] + side * 0.015, f[1]), 0.04 * h, 0.018 * h, rot);
          K.fill(ft, sk[1]);
        }
      }
      // lower garment (dhoti / saree / bark), drawn over thighs
      const skirt = legs === 'hidden' ? yH + 0.08 : o.long ? (legs === 'lotus' ? -0.4 : legs === 'kneel' ? -0.2 : 0.0) : legs === 'sit' ? -0.38 : legs === 'lotus' ? -0.4 : legs === 'kneel' ? -0.36 : -0.25;
      const kx = legs === 'stride' || legs === 'walk' ? 0.06 : legs === 'sit' ? 0.07 : legs === 'kneel' ? 0.05 : 0;
      const garment = K.path([T(-hp, yH - 0.06), T(hp, yH - 0.06), T(hp + 0.04 + kx, (yH + skirt) / 2), T(hp + 0.03 + kx * 1.5, skirt), T(0, skirt + 0.03), T(-hp - 0.03 - kx * 1.5, skirt), T(-hp - 0.04 - kx, (yH + skirt) / 2)]);
      K.fill(garment, cgrad);
      K.focus(garment, 0.65);
      K.flow(garment, Math.PI / 2 + rot);
      // torso
      // neck
      const neck = K.limbPath(T(0, yS - 0.01), T(0, -0.885), 0.052 * h * (F ? 0.85 : 1), 0.05 * h * (F ? 0.85 : 1));
      K.fill(neck, grad); K.focus(neck, 0.8);
      K.fill(neck, K.lin(...T(0, -0.875), ...T(0, -0.84), [RP.css(RP.hex(sk[3]), 0.7), RP.css(RP.hex(sk[3]), 0)]));
      // torso with rounded shoulders, chest and waist
      const bust = F ? 0.012 : 0;
      const tpts = [[-0.035, -0.855], [-0.085, -0.838], [-sh + 0.01, -0.822], [-sh - 0.012, -0.795], [-sh + 0.005, -0.74], [-wa - 0.02 - bust, -0.69], [-wa, yW], [-hp + 0.005, yH - 0.06], [-hp, yH - 0.03],
        [hp, yH - 0.03], [hp - 0.005, yH - 0.06], [wa, yW], [wa + 0.02 + bust, -0.69], [sh - 0.005, -0.74], [sh + 0.012, -0.795], [sh - 0.01, -0.822], [0.085, -0.838], [0.035, -0.855]];
      const torso = K.path(tpts.map((p) => T(p[0], p[1])));
      K.fill(torso, o.top ? K.split(...T(-0.2, -0.7), ...T(0.2, -0.7), o.top) : grad);
      K.focus(torso, 0.72);
      if (!o.top) K.overlay((pen) => {
        // chest and navel modelling on a bare torso
        pen.line([T(-0.07, -0.73), T(-0.035, -0.705), T(0, -0.71)], { w: 0.008 * h, color: sk[3], alpha: 0.45, taper: 1 });
        pen.line([T(0.07, -0.73), T(0.035, -0.705), T(0, -0.71)], { w: 0.008 * h, color: sk[3], alpha: 0.45, taper: 1 });
        pen.dab(...T(0, yW + 0.03), 0.006 * h, sk[3], 0.7);
      });
      // arms
      const arm = (side, ang) => {
        const sA = (ang && ang[0]) || 0.12, eA = (ang && ang[1]) || 0.05;
        const shp = [side * sh * 0.92, yS + 0.015];
        const a1 = sA * side, a2 = (sA + eA) * side;
        const el = [shp[0] + Math.sin(a1) * 0.19, shp[1] + Math.cos(a1) * 0.19];
        const hd = [el[0] + Math.sin(a2) * 0.17, el[1] + Math.cos(a2) * 0.17];
        L(shp, el, 0.054, 0.04, gx(side * 0.1));
        L(el, hd, 0.04, 0.03, gx(side * 0.1));
        const ball = K.ell(...T(shp[0] + side * 0.004, shp[1] + 0.012), 0.034 * h, 0.04 * h, rot);
        K.fill(ball, gx(side * 0.1)); K.focus(ball, 0.72);
        if (o.top && o.sleeves) { const sl = K.limbPath(T(...shp), T(shp[0] + (el[0] - shp[0]) * 0.45, shp[1] + (el[1] - shp[1]) * 0.45), 0.07 * h, 0.06 * h); K.fill(sl, K.split(...T(-0.2, -0.7), ...T(0.2, -0.7), o.top)); }
        const hand = K.ell(...T(hd[0] + Math.sin(a2) * 0.02, hd[1] + Math.cos(a2) * 0.02), 0.024 * h, 0.03 * h, rot - a2);
        K.fill(hand, sk[1]); K.focus(hand, 0.85);
        if (h > 700) K.overlay((pen) => {
          const c = T(hd[0] + Math.sin(a2) * 0.02, hd[1] + Math.cos(a2) * 0.02);
          for (let f = -1.5; f <= 1.5; f += 1) {
            const dx = Math.sin(a2 + f * 0.18) * side * 0 + Math.sin(a2) , dy = Math.cos(a2);
            const ox = -dy * f * 0.011 * h, oy = dx * f * 0.011 * h;
            pen.line([[c[0] + ox, c[1] + oy], [c[0] + ox + Math.sin(a2 + rot) * 0.035 * h * (1 - Math.abs(f) * 0.12) * (side < 0 ? -1 : 1) * (side < 0 ? -1 : 1), c[1] + oy + Math.cos(a2 + rot) * 0.035 * h]], { w: 0.012 * h, color: sk[1], taper: 0.6 });
          }
        });
        K.overlay((pen) => {
          // armlet and bangle
          const band = (p, q, t, w) => {
            const c = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
            const dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy) || 1;
            const nx = -dy / d * w, ny = dx / d * w;
            pen.line([T(c[0] - nx, c[1] - ny), T(c[0] + nx, c[1] + ny)], { w: 0.011 * h, color: o.gold || '#ffc22a', taper: 0 });
          };
          if (!o.ascetic) { band(shp, el, 0.38, 0.026); band(el, hd, 0.86, 0.019); band(el, hd, 0.78, 0.02); }
        });
        return T(hd[0] + Math.sin(a2) * 0.035, hd[1] + Math.cos(a2) * 0.035);
      };
      const handL = arm(-1, pose.armL), handR = arm(1, pose.armR);
      // uttariya / scarf across the shoulder
      if (o.scarf) {
        const sc = K.path([T(-sh - 0.02, yS - 0.01), T(-sh + 0.05, yS - 0.03), T(wa + 0.02, yW + 0.02), T(hp + 0.05, yH + 0.05), T(hp, yH + 0.12), T(-wa + 0.02, yW + 0.06)]);
        K.fill(sc, K.split(...T(-0.2, -0.7), ...T(0.2, -0.6), o.scarf));
        K.focus(sc, 0.7);
      }
      // garment border and jewellery
      K.overlay((pen) => {
        // drapery folds on the lower garment
        const nf = o.long ? 7 : 4;
        for (let k = 0; k < nf; k++) {
          const t = (k + 0.5) / nf - 0.5, sw = K.R(-0.02, 0.02);
          pen.line([T(t * hp * 1.6, yH - 0.03), T(t * hp * 1.9 + sw, (yH + skirt) / 2), T(t * (hp + 0.03 + kx * 1.5) * 2 + sw * 2, skirt - 0.01)], { w: 0.009 * h, color: k % 2 ? cloth[3] : cloth[0], alpha: 0.55, taper: 1 });
        }
        // pleated fan at the front
        if (!o.long) for (let k = -1; k <= 1; k++) pen.line([T(k * 0.012, yH - 0.02), T(k * 0.02, (yH + skirt) / 2 + 0.05)], { w: 0.008 * h, color: cloth[3], alpha: 0.5, taper: 1 });
        pen.line([T(-hp - 0.03 - kx * 1.5, skirt), T(0, skirt + 0.03), T(hp + 0.03 + kx * 1.5, skirt)], { w: 0.014 * h, color: o.border || '#ffd23a', alpha: 0.9, taper: 0.2 });
        pen.line([T(-hp, yH - 0.05), T(0, yH - 0.03), T(hp, yH - 0.05)], { w: 0.018 * h, color: o.border || '#ffd23a', taper: 0.2 });
        if (!o.ascetic) {
          pen.line([T(-0.06, yS - 0.02), T(0, yS + 0.06), T(0.06, yS - 0.02)], { w: 0.012 * h, color: '#ffd23a', taper: 0.2 });
          pen.line([T(-0.08, yS - 0.015), T(0, yS + 0.11), T(0.08, yS - 0.015)], { w: 0.01 * h, color: '#ffe68a', taper: 0.2 });
          pen.dab(...T(0, yS + 0.11), 0.012 * h, '#e0102a');
        } else {
          pen.line([T(-0.07, yS - 0.015), T(0, yS + 0.13), T(0.07, yS - 0.015)], { w: 0.01 * h, color: '#6a2a10', taper: 0 });
        }
      });
      // head
      const s = 0.065 * h;
      const hc = T(0, -0.935);
      const headType = o.head || 'none';
      let headF = null;
      if (s >= 24 && headType !== 'monkey') {
        headF = K.head({ x: hc[0], y: hc[1], s, turn: o.turn || 0, tilt: rot + (o.tilt || 0), female: F, jaw: F ? undefined : 0.45 });
        if (headType === 'long' || headType === 'crown' || headType === 'veil') K.hairBack(headF, { len: F ? 2.2 : 1.6, w: 0.9, colors: o.hairColors, focus: 0.6 });
        if (headType === 'veil') {
          const vf = headF.T;
          const veil = K.path([vf(-0.95, -0.3), vf(-0.75, -1.05), vf(0, -1.3), vf(0.75, -1.05), vf(0.98, -0.3), vf(1.2, 1.2), vf(-1.2, 1.2)]);
          K.fill(veil, K.skinGrad(headF, o.veil || ['#ff4a3a', '#e0182a', '#9a0a3a', '#4a0a3a'], -1.2, 1.2));
          K.focus(veil, 0.6);
        }
        // neck in front of hair/veil
        K.fill(neck, grad); K.fill(neck, K.lin(...T(0, -0.875), ...T(0, -0.84), [RP.css(RP.hex(sk[3]), 0.7), RP.css(RP.hex(sk[3]), 0)])); K.focus(neck, 0.85);
        if (headType === 'jata') K.jata(headF, { colors: o.hairColors, strands: o.strands });
        K.face(headF, Object.assign({ skin: sk, neck: false, contourColor: '#1a0a4a', contourLight: '#ffffff', faceFlow: true }, o.face || {}));
        if (headType === 'long' || headType === 'veil') K.hairFront(headF, { part: 0, colors: o.hairColors });
        if (headType === 'veil') {
          const vf = headF.T;
          K.overlay((pen) => pen.line([vf(-1.15, 1.1), vf(-0.98, -0.3), vf(-0.78, -1.02), vf(0, -1.3), vf(0.78, -1.02), vf(0.99, -0.3), vf(1.17, 1.1)], { w: s * 0.07, color: o.veilBorder || '#ffc22a', taper: 0.2 }));
        }
        if (headType === 'crown') K.crown(headF, Object.assign({ h: 0.95, bw: 0.8 }, o.crown || {}));
        if (o.earrings !== false && headType !== 'jata') K.earrings(headF, { r: 0.1 });
        if (o.beard) K.beard(headF, { len: o.beard, n: Math.round(40 + s) });
        if (o.mustache) K.mustache(headF, { color: o.mustache, n: 16, w: 0.04, curl: o.curl || 0 });
      } else if (headType === 'monkey') {
        K.monkeyHead(hc[0], hc[1], s, o);
      } else {
        // small figure
        if (headType === 'crown') {
          const cp = K.poly([T(-0.045, -0.97), T(-0.03, -1.06), T(0, -1.1), T(0.03, -1.06), T(0.045, -0.97)]);
          K.fill(cp, '#ffc22a'); K.focus(cp, 0.9);
        }
        if (headType === 'veil') K.fill(K.ell(hc[0], hc[1] + s * 0.4, s * 1.1, s * 1.5), (o.veil || ['#e0182a'])[0]);
        if (headType === 'jata') K.fill(K.ell(hc[0], hc[1] - s * 0.9, s * 0.5, s * 0.6), '#4a2a1a');
        K.smallHead(hc[0], hc[1], s, { skin: sk, turn: o.turn, tilak: o.face && o.face.tilak && o.face.tilak !== 'bindi', hairColor: (o.hairColors || ['#1a1030'])[2] || '#1a1030' });
        if (headType === 'crown') K.overlay((pen) => pen.dab(...T(0, -1.0), 0.01 * h, '#e0102a'));
      }
      return { handL, handR, headF, T, hc, s };
    };

    // monkey (vanara) head: fur ruff, pale muzzle, round ears
    K.monkeyHead = (x, y, s, o) => {
      o = o || {};
      const fur = o.fur || ['#ffb84a', '#e8701a', '#a0301a', '#4a1020'];
      const face = o.faceSkin || ['#ffd8a8', '#f0a070', '#b0504a', '#4a1a2a'];
      const turn = o.turn || 0;
      for (const sd of [-1, 1]) K.fill(K.ell(x + sd * s * 0.95, y - s * 0.05, s * 0.28, s * 0.32), sd > 0 ? fur[2] : fur[1]);
      const ruff = K.ell(x, y - s * 0.05, s * 1.0, s * 1.08);
      K.fill(ruff, K.split(x - s, y, x + s, y, fur)); K.focus(ruff, 0.85);
      const mask = K.path([[x - s * 0.6, y - s * 0.4], [x, y - s * 0.62], [x + s * 0.6, y - s * 0.4], [x + s * 0.55, y + s * 0.3], [x + s * 0.4, y + s * 0.85], [x, y + s * 0.95], [x - s * 0.4, y + s * 0.85], [x - s * 0.55, y + s * 0.3]].map((p) => [p[0] + turn * s * 0.15, p[1]]));
      K.fill(mask, K.split(x - s, y, x + s, y, face)); K.focus(mask, 1);
      const mz = K.ell(x + turn * s * 0.2, y + s * 0.5, s * 0.42, s * 0.36);
      K.fill(mz, K.split(x - s * 0.5, y, x + s * 0.5, y, ['#fff0d8', '#ffd0a0', '#d08a6a', '#7a3a3a']));
      if (o.crownSmall) { const c = K.poly([[x - s * 0.55, y - s * 0.6], [x - s * 0.4, y - s * 1.3], [x, y - s * 1.6], [x + s * 0.4, y - s * 1.3], [x + s * 0.55, y - s * 0.6]]); K.fill(c, K.split(x - s * 0.6, y, x + s * 0.6, y, ['#fff3a0', '#ffc22a', '#d0701a', '#6a2010'])); K.focus(c, 0.9); }
      K.overlay((pen) => {
        const t = turn * s * 0.2;
        for (const sd of [-1, 1]) {
          const ex = x + t + sd * s * 0.26, ey = y - s * 0.12;
          if (s > 14) {
            pen.fill(K.ell(ex, ey, s * 0.13, s * 0.1), '#fff4e0');
            pen.fill(K.ell(ex + (o.gaze || 0) * s * 0.05, ey, s * 0.075, s * 0.075), '#2a1008');
            pen.dab(ex - s * 0.03, ey - s * 0.03, Math.max(1, s * 0.025), '#ffffff');
            pen.line([[ex - s * 0.16, ey - s * 0.12], [ex, ey - s * 0.18 - (o.brow || 0) * s * 0.05], [ex + s * 0.16, ey - s * 0.12]], { w: s * 0.06, color: '#3a0a1a', taper: 0.6 });
          } else pen.dab(ex, ey, Math.max(1.5, s * 0.1), '#1a0810');
        }
        pen.fill(K.ell(x + t, y + s * 0.36, s * 0.12, s * 0.06), '#4a1a1a');
        pen.line([[x + t - s * 0.25, y + s * 0.62], [x + t, y + s * 0.7 - (o.smile || 0) * s * 0.06], [x + t + s * 0.25, y + s * 0.62]], { w: s * 0.05, color: '#4a0a1a', taper: 0.6 });
        if (o.tilak) pen.line([[x + t, y - s * 0.35], [x + t, y - s * 0.6]], { w: s * 0.07, color: '#e0141e', taper: 0.4 });
        if (s > 20) for (let k = 0; k < 24; k++) {
          const a = K.R(-Math.PI, 0.2), r0 = s * 0.9, r1 = s * K.R(1.1, 1.3);
          pen.line([[x + Math.cos(a) * r0, y - s * 0.05 + Math.sin(a) * r0], [x + Math.cos(a + 0.1) * r1, y - s * 0.05 + Math.sin(a + 0.1) * r1]], { w: s * 0.06, color: K.pick(fur.slice(0, 3).concat(['#fff0c0'])), alpha: 0.85, taper: 1 });
        }
      });
    };

    // vanara body = figure with fur, tail and monkey head
    K.vanara = (o) => K.figure(Object.assign({ skin: o.fur || ['#ffb84a', '#e8701a', '#a0301a', '#4a1020'], cloth: o.cloth || ['#ff5a3a', '#e0182a', '#8a0a2a', '#3a0a1a'], head: 'monkey', tail: true, tailColor: (o.fur || ['', '#e8701a'])[1] }, o));

    // ---------- props & settings ----------
    K.bowAt = (hand, len, angle, o) => {
      o = o || {};
      const pts = [];
      for (let k = 0; k <= 12; k++) {
        const t = k / 12 - 0.5;
        pts.push([hand[0] + Math.cos(angle) * t * len - Math.sin(angle) * (0.18 * len) * (1 - 4 * t * t) * (o.flip ? -1 : 1), hand[1] + Math.sin(angle) * t * len + Math.cos(angle) * (0.18 * len) * (1 - 4 * t * t) * (o.flip ? -1 : 1)]);
      }
      K.strokeRef(pts, o.w || len * 0.03, o.color || '#5a1a0a');
      K.overlay((pen) => {
        pen.line(pts, { w: o.w || len * 0.03, color: o.color || '#6a240c', taper: 0.6 });
        pen.line(pts, { w: (o.w || len * 0.03) * 0.3, color: '#ffc04a', alpha: 0.7, taper: 0.6 });
        pen.line(o.pull ? [pts[0], o.pull, pts[12]] : [pts[0], pts[12]], { w: Math.max(1.5, len * 0.004), color: '#fff4d8', alpha: 0.9, taper: 0 });
        pen.dab(pts[6][0], pts[6][1], (o.w || len * 0.03) * 0.8, '#ffd040');
      });
      return pts;
    };

    K.elephant = (o) => {
      // o: x (body centre), y (ground), L (length), dir (1 faces right)
      const { x, y, L } = o, d = o.dir || 1;
      const hide = o.hide || ['#c8c8e8', '#8a8ab8', '#4a4a8a', '#1a1a4a'];
      const E = (u, v) => [x + u * L * d, y + v * L];
      const bodyC = E(0, -0.62);
      // far legs
      for (const u of [-0.3, 0.22]) { const p = K.limbPath(E(u + 0.05, -0.5), E(u + 0.06, -0.02), L * 0.17, L * 0.15); K.fill(p, hide[3]); K.focus(p, 0.5); }
      const body = K.ell(bodyC[0], bodyC[1], L * 0.5, L * 0.33);
      K.fill(body, K.split(x - L * 0.5, y, x + L * 0.5, y, d > 0 ? hide.slice().reverse() : hide)); K.focus(body, 0.6);
      // near legs
      for (const u of [-0.36, 0.16]) { const p = K.limbPath(E(u, -0.5), E(u, 0), L * 0.19, L * 0.17); K.fill(p, K.split(...E(u - 0.1, -0.3), ...E(u + 0.1, -0.3), hide)); K.focus(p, 0.6); }
      // head, ear, trunk
      const head = K.ell(...E(0.5, -0.78), L * 0.22, L * 0.25);
      K.fill(head, K.split(...E(0.3, -0.8), ...E(0.7, -0.8), hide)); K.focus(head, 0.8);
      const ear = K.path([E(0.38, -0.95), E(0.22, -0.98), E(0.15, -0.75), E(0.22, -0.52), E(0.38, -0.6)]);
      K.fill(ear, K.split(...E(0.15, -0.8), ...E(0.4, -0.8), [hide[0], hide[1], '#c06a8a', hide[2]])); K.focus(ear, 0.7);
      const trunk = [E(0.66, -0.72), E(0.76, -0.5), E(0.78, -0.25), E(0.74, -0.08), E(0.82, -0.04)];
      K.strokeRef(trunk, L * 0.1, hide[1]);
      K.flowStroke(trunk, L * 0.1);
      // caparison: royal cloth over the back
      const cap = K.path([E(-0.3, -0.93), E(0.2, -0.95), E(0.24, -0.66), E(0.1, -0.56), E(-0.1, -0.54), E(-0.3, -0.6)]);
      K.fill(cap, K.split(...E(-0.4, -0.7), ...E(0.35, -0.7), o.cloth || ['#ff4a3a', '#e0182a', '#8a0a3a', '#3a0a2a'])); K.focus(cap, 0.75);
      const headCloth = K.path([E(0.45, -0.99), E(0.6, -0.97), E(0.6, -0.84), E(0.54, -0.74), E(0.48, -0.84)]);
      K.fill(headCloth, K.split(...E(0.4, -0.8), ...E(0.65, -0.8), ['#fff3a0', '#ffc22a', '#d0701a', '#6a2010'])); K.focus(headCloth, 0.85);
      K.overlay((pen) => {
        // tusks
        pen.line([E(0.62, -0.62), E(0.72, -0.5), E(0.84, -0.48)], { w: L * 0.04, color: '#fff8ea', taper: 0.7 });
        // eye
        pen.fill(K.ell(...E(0.55, -0.82), L * 0.022, L * 0.014), '#1a0a14');
        pen.dab(...E(0.548, -0.825), Math.max(1.5, L * 0.006), '#ffffff');
        // trunk wrinkles
        for (let k = 1; k < 8; k++) { const p = RP.sampleCurve(trunk, 4)[k * 2]; if (p) pen.line([[p[0] - L * 0.04, p[1]], [p[0] + L * 0.04, p[1] + L * 0.005]], { w: Math.max(1, L * 0.006), color: hide[3], alpha: 0.5 }); }
        // caparison borders, tassels, bells
        pen.line([E(-0.3, -0.6), E(-0.1, -0.54), E(0.1, -0.56), E(0.24, -0.66)], { w: L * 0.022, color: '#ffd23a', taper: 0.1 });
        for (let k = 0; k < 7; k++) {
          const u = -0.28 + k * 0.08, v = -0.58 + Math.abs(u + 0.05) * 0.1;
          pen.line([E(u, v), E(u, v + 0.05)], { w: L * 0.012, color: '#ffd23a', taper: 0.5 });
          pen.dab(...E(u, v + 0.06), L * 0.012, K.pick(['#e0102a', '#14a05a', '#ffd23a']));
        }
        for (let k = 0; k < 5; k++) pen.dab(...E(-0.22 + k * 0.1, -0.75), L * 0.018, K.pick(['#ffd23a', '#14c08a', '#ffffff']));
        pen.line([E(0.46, -0.98), E(0.6, -0.96)], { w: L * 0.016, color: '#e0102a', taper: 0.2 });
        // anklets
        for (const u of [-0.36, 0.16]) pen.line([E(u - 0.08, -0.1), E(u + 0.08, -0.1)], { w: L * 0.02, color: '#ffd23a', taper: 0 });
      });
      return { back: E(-0.05, -0.95), E };
    };

    // golden howdah (seat) on an elephant's back; returns the seat line y
    K.howdah = (cx, by, w, o) => {
      o = o || {};
      const hh = w * 0.5;
      const base = K.path([[cx - w / 2, by], [cx + w / 2, by], [cx + w * 0.46, by - hh * 0.5], [cx - w * 0.46, by - hh * 0.5]]);
      K.fill(base, K.lin(cx - w / 2, by, cx + w / 2, by, ['#fff3a0', '#ffc22a', '#d0701a', '#6a2010'])); K.focus(base, 0.8);
      // canopy
      const top = by - hh * 1.9;
      const canopy = K.path([[cx - w * 0.55, top + hh * 0.2], [cx - w * 0.3, top - hh * 0.25], [cx, top - hh * 0.55], [cx + w * 0.3, top - hh * 0.25], [cx + w * 0.55, top + hh * 0.2]]);
      K.fill(canopy, K.lin(cx - w / 2, top, cx + w / 2, top, o.canopy || ['#ff5a3a', '#e0182a', '#9a0a3a']));
      K.focus(canopy, 0.75);
      K.overlay((pen) => {
        for (const sd of [-1, 1]) pen.line([[cx + sd * w * 0.48, by - hh * 0.45], [cx + sd * w * 0.5, top + hh * 0.2]], { w: w * 0.025, color: '#ffd23a', taper: 0 });
        pen.line([[cx - w * 0.55, top + hh * 0.2], [cx, top + hh * 0.05], [cx + w * 0.55, top + hh * 0.2]], { w: w * 0.03, color: '#ffd23a', taper: 0 });
        for (let k = 0; k < 10; k++) pen.dab(cx - w * 0.5 + k * w * 0.11, top + hh * 0.25, w * 0.015, K.pick(['#ffffff', '#ffd23a']));
        pen.dab(cx, top - hh * 0.6, w * 0.035, '#ffd23a');
        for (let k = 0; k < 6; k++) pen.dab(cx - w * 0.4 + k * w * 0.16, by - hh * 0.25, w * 0.02, K.pick(['#e0102a', '#14a05a']));
      });
      return by - hh * 0.5;
    };

    // royal umbrella (chhatra)
    K.umbrella = (x, y, r, color) => {
      const p = K.path([[x - r, y], [x - r * 0.7, y - r * 0.45], [x, y - r * 0.6], [x + r * 0.7, y - r * 0.45], [x + r, y]]);
      K.fill(p, K.lin(x - r, y, x + r, y, [color || '#ffffff', '#f0e8d8', '#b0a8c8'])); K.focus(p, 0.7);
      K.overlay((pen) => {
        pen.line([[x - r, y], [x + r, y]], { w: r * 0.06, color: '#ffd23a', taper: 0 });
        for (let k = 0; k <= 10; k++) pen.line([[x - r + k * r * 0.2, y], [x - r + k * r * 0.2, y + r * 0.12]], { w: r * 0.025, color: '#ffd23a', taper: 0.5 });
        pen.line([[x, y], [x, y + r * 1.6]], { w: r * 0.05, color: '#a06020', taper: 0 });
      });
    };

    K.palace = (x, baseY, w, h, o) => {
      o = o || {};
      const c = o.colors || ['#fff6d8', '#ffd890', '#d0905a', '#6a3a4a'];
      const body = K.poly([[x - w / 2, baseY], [x - w / 2, baseY - h], [x + w / 2, baseY - h], [x + w / 2, baseY]]);
      K.fill(body, K.split(x - w / 2, baseY, x + w / 2, baseY, c)); K.focus(body, o.focus == null ? 0.35 : o.focus);
      // roof: dome or shikhara
      const top = baseY - h;
      let roof;
      if (o.roof === 'shikhara') roof = K.path([[x - w * 0.42, top], [x - w * 0.3, top - h * 0.5], [x - w * 0.1, top - h * 0.9], [x, top - h * 1.05], [x + w * 0.1, top - h * 0.9], [x + w * 0.3, top - h * 0.5], [x + w * 0.42, top]]);
      else roof = K.path([[x - w * 0.4, top], [x - w * 0.38, top - w * 0.25], [x - w * 0.15, top - w * 0.42], [x, top - w * 0.5], [x + w * 0.15, top - w * 0.42], [x + w * 0.38, top - w * 0.25], [x + w * 0.4, top]]);
      K.fill(roof, K.split(x - w / 2, top, x + w / 2, top, o.roofColors || ['#fff3a0', '#ffc22a', '#d0701a', '#6a2010'])); K.focus(roof, o.focus == null ? 0.35 : o.focus);
      // windows, cornice, finial and flag go into the reference so nearer things can cover them
      const rows = Math.max(1, Math.round(h / (w * 0.5)));
      const cols = Math.max(1, Math.round(w / 70));
      for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
        const wx = x - w / 2 + (k + 0.5) * (w / cols), wy = baseY - h + (r + 0.3) * (h / rows);
        const aw = Math.min(w / cols, h / rows) * 0.22;
        const win = K.path([[wx - aw, wy + aw * 1.8], [wx - aw, wy], [wx, wy - aw], [wx + aw, wy], [wx + aw, wy + aw * 1.8]]);
        K.fill(win, o.lit ? '#ffd23a' : (o.window || '#3a1a4a'), 0.9);
        K.focus(win, Math.max(o.focus == null ? 0.35 : o.focus, 0.5));
      }
      K.strokeRef([[x - w / 2, top], [x + w / 2, top]], Math.max(4, w * 0.04), '#ffd23a');
      const tip = o.roof === 'shikhara' ? [x, top - h * 1.05] : [x, top - w * 0.5];
      K.strokeRef([tip, [tip[0], tip[1] - w * 0.18]], Math.max(3, w * 0.02), '#ffd23a');
      if (o.flag !== false) K.fill(K.poly([[tip[0], tip[1] - w * 0.18], [tip[0] + w * 0.18, tip[1] - w * 0.14], [tip[0], tip[1] - w * 0.1]]), o.flag || '#ff7a1a');
    };

    K.tree = (x, baseY, h, o) => {
      o = o || {};
      const trunk = K.limbPath([x, baseY], [x + K.R(-0.05, 0.05) * h, baseY - h * 0.6], h * 0.08, h * 0.05);
      K.fill(trunk, K.lin(x - h * 0.05, 0, x + h * 0.05, 0, ['#8a5a3a', '#4a2a1a', '#1a0a10'])); K.focus(trunk, 0.3);
      const leaves = o.leaves || ['#3ad07a', '#14a05a', '#0a6a4a', '#0a3a3a'];
      for (let k = 0; k < (o.n || 7); k++) {
        const bx = x + K.R(-0.35, 0.35) * h, by = baseY - h * K.R(0.55, 1.0), r = h * K.R(0.16, 0.28);
        K.fill(K.patch(bx, by, r, r * 0.8, 0), K.split(bx - r, by, bx + r, by, leaves), 0.95);
      }
      if (o.flowers) for (let k = 0; k < 14; k++) K.blob(x + K.R(-0.35, 0.35) * h, baseY - h * K.R(0.55, 1.0), h * 0.05, K.pick(o.flowers), 1);
    };
    K.palm = (x, baseY, h, o) => {
      o = o || {};
      const top = [x + (o.lean || 0.15) * h, baseY - h];
      K.strokeRef([[x, baseY], [x + (o.lean || 0.15) * h * 0.4, baseY - h * 0.5], top], h * 0.045, '#6a3a2a');
      for (let k = 0; k < 8; k++) {
        const a = -Math.PI / 2 + (k - 3.5) * 0.42;
        const pts = [top, [top[0] + Math.cos(a) * h * 0.25, top[1] + Math.sin(a) * h * 0.18], [top[0] + Math.cos(a) * h * 0.4, top[1] + Math.sin(a) * h * 0.1 + h * 0.12]];
        K.strokeRef(pts, h * 0.06, K.pick(['#2ac07a', '#14a05a', '#0a6a4a']));
        K.flowStroke(pts, h * 0.06);
      }
    };

    // a crowd of small figures, rows receding upward
    K.crowd = (x0, x1, y, rows, o) => {
      o = o || {};
      const cols = o.colors || ['#ff4a3a', '#ffd23a', '#ff8a1a', '#ffffff', '#3ad0a0', '#ff5aa0', '#6a5aff'];
      const skins = o.skins || [['#ffd8a0', '#e8904a', '#9a4a5a', '#3a1a3a'], ['#e8a868', '#b8603a', '#6a2a4a', '#2a1030']];
      for (let r = rows - 1; r >= 0; r--) {
        const sc = (o.scale || 1) * (1 - r * 0.13);
        const hh = 150 * sc, yy = y - r * hh * 0.42;
        const step = hh * 0.32;
        for (let xx = x0 + K.R(0, step); xx < x1; xx += step * K.R(0.8, 1.2)) {
          const s = hh * 0.075, bodyC = K.pick(cols);
          const body = K.path([[xx - hh * 0.13, yy], [xx - hh * 0.11, yy - hh * 0.55], [xx, yy - hh * 0.62], [xx + hh * 0.11, yy - hh * 0.55], [xx + hh * 0.13, yy]]);
          K.fill(body, K.lin(xx - hh * 0.13, 0, xx + hh * 0.13, 0, [bodyC, bodyC, '#2a1040'])); K.focus(body, 0.45);
          const female = K.rand() < 0.5;
          const head = K.smallHead(xx, yy - hh * 0.72, s, { skin: K.pick(skins), focus: 0.7, hairColor: female ? '#1a0a20' : '#2a1a2a', mouth: s > 9 });
          if (female && o.veils !== false) K.fill(K.ell(xx, yy - hh * 0.72, s * 1.1, s * 1.15), RP.css(RP.hex(K.pick(cols)), 0.0));
          if (K.rand() < (o.raised == null ? 0.45 : o.raised)) {
            const sd = K.rand() < 0.5 ? -1 : 1;
            K.overlay((pen) => {
              pen.line([[xx + sd * hh * 0.1, yy - hh * 0.52], [xx + sd * hh * 0.2, yy - hh * 0.75], [xx + sd * hh * 0.22, yy - hh * 0.95]], { w: hh * 0.05, color: K.pick(skins)[1], taper: 0.4 });
              if (o.offerings) pen.dab(xx + sd * hh * 0.22, yy - hh * 0.98, hh * 0.035, K.pick(['#ffd23a', '#ff7a1a', '#ff3a6a']));
            });
          }
          if (o.lamps && K.rand() < 0.3) K.overlay((pen) => { pen.dab(xx, yy - hh * 0.4, hh * 0.04, '#c0601a'); pen.line([[xx, yy - hh * 0.43], [xx, yy - hh * 0.52]], { w: hh * 0.03, color: '#fff3a0', taper: 1 }); });
        }
      }
    };

    K.horse = (x, y, L, o) => {
      o = o || {};
      const d = o.dir || 1, c = o.colors || ['#ffffff', '#e0e0f0', '#9a9ac8', '#3a3a6a'];
      const P = (u, v) => [x + u * L * d, y + v * L];
      const run = o.run == null ? 1 : o.run;
      for (const [u, k1, k2] of [[-0.32, -0.5, -0.25], [0.28, 0.5, 0.35]]) {
        const p = K.limbPath(P(u, -0.55), P(u + k1 * 0.25 * run, -0.28), L * 0.08, L * 0.06); K.fill(p, c[2]);
        const q = K.limbPath(P(u + k1 * 0.25 * run, -0.28), P(u + k2 * 0.3 * run, -0.02), L * 0.06, L * 0.05); K.fill(q, c[2]);
      }
      const body = K.ell(...P(0, -0.62), L * 0.42, L * 0.18);
      K.fill(body, K.split(x - L * 0.4, y, x + L * 0.4, y, d > 0 ? c.slice().reverse() : c)); K.focus(body, 0.5);
      const neck = K.limbPath(P(0.3, -0.66), P(0.5, -0.98), L * 0.17, L * 0.11); K.fill(neck, K.split(...P(0.25, -0.8), ...P(0.6, -0.8), c)); K.focus(neck, 0.6);
      const head = K.limbPath(P(0.5, -0.98), P(0.72, -0.82), L * 0.11, L * 0.07); K.fill(head, c[1]); K.focus(head, 0.7);
      for (const [u, k1, k2] of [[-0.26, -0.3, -0.5], [0.34, 0.6, 0.8]]) {
        const p = K.limbPath(P(u, -0.55), P(u + k1 * 0.2 * run, -0.3), L * 0.085, L * 0.06); K.fill(p, K.split(...P(u - 0.1, -0.4), ...P(u + 0.1, -0.4), c));
        const q = K.limbPath(P(u + k1 * 0.2 * run, -0.3), P(u + k2 * 0.25 * run, -0.04), L * 0.06, L * 0.05); K.fill(q, c[1]);
      }
      K.overlay((pen) => {
        for (let k = 0; k < 8; k++) pen.line([P(0.32 + k * 0.025, -0.7 - k * 0.035), P(0.22 + k * 0.02, -0.66 - k * 0.03)], { w: L * 0.03, color: o.mane || '#3a2a6a', taper: 1 });
        pen.line([P(-0.4, -0.65), P(-0.58, -0.55), P(-0.66, -0.35)], { w: L * 0.05, color: o.mane || '#3a2a6a', taper: 0.8 });
        pen.dab(...P(0.6, -0.92), L * 0.015, '#140a20');
        pen.line([P(0.3, -0.7), P(0.62, -0.88), P(0.7, -0.84)], { w: L * 0.02, color: '#ffd23a', taper: 0 });
        pen.dab(...P(0.52, -1.02), L * 0.03, o.plume || '#e0102a');
      });
    };
    K.chariot = (x, y, w, o) => {
      o = o || {};
      const d = o.dir || 1;
      const box = K.path([[x - w / 2, y - w * 0.35], [x + w / 2, y - w * 0.35], [x + w * 0.42, y - w * 0.85], [x + w * 0.1 * d, y - w * 0.95], [x - w * 0.42, y - w * 0.8]]);
      K.fill(box, K.split(x - w / 2, y, x + w / 2, y, o.colors || ['#fff3a0', '#ffc22a', '#d0701a', '#6a2010'])); K.focus(box, 0.6);
      const wr = w * 0.32, wc = [x - w * 0.05 * d, y - wr];
      K.fill(K.ell(wc[0], wc[1], wr, wr), K.rad(wc[0], wc[1], wr * 0.2, wr, ['#6a2a10', '#ffc22a', '#7a3a10']));
      K.focus(K.ell(wc[0], wc[1], wr, wr), 0.55);
      K.overlay((pen) => {
        for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; pen.line([wc, [wc[0] + Math.cos(a) * wr * 0.95, wc[1] + Math.sin(a) * wr * 0.95]], { w: w * 0.014, color: '#5a1a08', taper: 0 }); }
        pen.line(RP.sampleCurve([[wc[0] + wr, wc[1]], [wc[0], wc[1] + wr], [wc[0] - wr, wc[1]], [wc[0], wc[1] - wr]], 6, true).concat([[wc[0] + wr, wc[1]]]), { w: w * 0.03, color: '#ffd23a', taper: 0 });
        pen.dab(wc[0], wc[1], w * 0.03, '#ffd23a');
        pen.line([[x - w / 2, y - w * 0.36], [x + w / 2, y - w * 0.36]], { w: w * 0.025, color: '#ffe68a', taper: 0 });
        for (let k = 0; k < 6; k++) pen.dab(x - w * 0.4 + k * w * 0.16, y - w * 0.6, w * 0.02, K.pick(['#e0102a', '#14a05a', '#ffffff']));
        if (o.flag) {
          const fx = x - w * 0.42 * d;
          pen.line([[fx, y - w * 0.8], [fx, y - w * 1.9]], { w: w * 0.02, color: '#ffd23a', taper: 0 });
          pen.fill(K.poly([[fx, y - w * 1.9], [fx - w * 0.4 * d, y - w * 1.78], [fx, y - w * 1.62]]), o.flag);
        }
      });
      return { wc, top: y - w * 0.8 };
    };
    K.boat = (x, y, w, o) => {
      o = o || {};
      const hull = K.path([[x - w / 2, y - w * 0.12], [x - w * 0.3, y + w * 0.05], [x + w * 0.3, y + w * 0.05], [x + w / 2, y - w * 0.14], [x + w * 0.42, y - w * 0.05], [x - w * 0.42, y - w * 0.04]]);
      K.fill(hull, K.split(x - w / 2, y, x + w / 2, y, o.colors || ['#d08a4a', '#8a4a2a', '#4a1a1a', '#1a0a10'])); K.focus(hull, 0.6);
      K.overlay((pen) => {
        pen.line([[x - w / 2, y - w * 0.12], [x, y - w * 0.03], [x + w / 2, y - w * 0.14]], { w: w * 0.012, color: '#ffd23a', taper: 0 });
        for (let k = 0; k < 7; k++) pen.line([[x - w * 0.36 + k * w * 0.12, y - w * 0.04], [x - w * 0.34 + k * w * 0.12, y + w * 0.04]], { w: w * 0.006, color: '#2a0a0a', alpha: 0.6 });
      });
    };
    K.deer = (x, y, L, o) => {
      o = o || {};
      const d = o.dir || 1;
      const P = (u, v) => [x + u * L * d, y + v * L];
      const c = ['#fff6b0', '#ffd23a', '#e0901a', '#7a3a10'];
      for (const [a, b] of [[[-0.3, -0.55], [-0.42, 0]], [[0.25, -0.55], [0.36, 0]], [[-0.22, -0.55], [-0.15, -0.02]], [[0.3, -0.55], [0.2, -0.02]]]) { const p = K.limbPath(P(...a), P(...b), L * 0.06, L * 0.035); K.fill(p, c[2]); K.focus(p, 0.7); }
      const body = K.ell(...P(0, -0.62), L * 0.38, L * 0.15); K.fill(body, K.split(x - L * 0.4, y, x + L * 0.4, y, c)); K.focus(body, 0.85);
      const neck = K.limbPath(P(0.28, -0.66), P(0.42, -0.98), L * 0.12, L * 0.08); K.fill(neck, c[1]); K.focus(neck, 0.85);
      const head = K.limbPath(P(0.42, -1.0), P(0.6, -0.92), L * 0.1, L * 0.05); K.fill(head, c[0]); K.focus(head, 0.9);
      K.overlay((pen) => {
        for (let k = 0; k < 16; k++) pen.dab(...P(K.R(-0.3, 0.3), K.R(-0.7, -0.52)), L * 0.022, '#f4f8ff');
        for (const sd of [-1, 1]) pen.line([P(0.42, -1.03), P(0.4 + sd * 0.06, -1.18), P(0.38 + sd * 0.1, -1.3), P(0.44 + sd * 0.12, -1.38)], { w: L * 0.018, color: '#fff2c0', taper: 0.7 });
        pen.dab(...P(0.5, -0.98), L * 0.014, '#140a20');
        pen.dab(...P(0.5, -0.98), L * 0.03, '#ffffff', 0.4);
        // the shimmer of the magic deer
        for (let k = 0; k < 18; k++) { const a = K.R(0, 6.28), r = L * K.R(0.5, 0.75); const c0 = P(0.05, -0.7); pen.line([[c0[0] + Math.cos(a) * r, c0[1] + Math.sin(a) * r * 0.7], [c0[0] + Math.cos(a) * (r + L * 0.08), c0[1] + Math.sin(a) * (r + L * 0.08) * 0.7]], { w: 2.5, color: '#fff6c0', taper: 1, alpha: 0.8 }); }
      });
    };
    K.mountain = (pts, colors, foc) => {
      const p = K.path(pts);
      const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
      K.fill(p, K.split(Math.min(...xs), 0, Math.max(...xs), 0, colors)); K.focus(p, foc == null ? 0.25 : foc);
      return p;
    };
    K.waves = (y0, y1, o) => {
      o = o || {};
      K.overlay((pen) => {
        for (let k = 0; k < (o.n || 120); k++) {
          const y = K.R(y0, y1), x = K.R(0, K.W), wv = 12 + (y - y0) / (y1 - y0) * 30;
          pen.line([[x - wv, y], [x, y - wv * 0.3], [x + wv, y]], { w: 2 + (y - y0) / (y1 - y0) * 5, color: K.pick(o.colors || ['#ffffff', '#8ae0ff', '#3a9aff']), alpha: 0.75 });
        }
      });
    };

    K.petals = (n, region, cols) => {
      K.overlay((pen) => {
        for (let k = 0; k < n; k++) {
          const x = K.R(region[0], region[2]), y = K.R(region[1], region[3]);
          pen.dab(x, y, K.R(4, 8), K.pick(cols || ['#ff9a1a', '#ffd23a', '#ff3a5a', '#ffffff', '#ff6ab0']));
        }
      });
    };

    K.sparks = (n, region, cols) => {
      K.overlay((pen) => {
        for (let k = 0; k < n; k++) {
          const x = K.R(region[0], region[2]), y = K.R(region[1], region[3]);
          pen.line([[x, y], [x + K.R(-8, 8), y - K.R(12, 40)]], { w: K.R(2, 5), color: K.pick(cols || ['#fff3a0', '#ffb02a', '#ff6a1a']), taper: 1 });
        }
      });
    };

    return K;
  };

  RP.eventLayers = [
    { size: 44, len: 180, edge: 110, hueJ: 0.1, satJ: 0.25, lumJ: 0.2, accent: 0.015 },
    { size: 24, len: 120, edge: 90, hueJ: 0.1, satJ: 0.25, lumJ: 0.18, accent: 0.015, spacing: 0.8 },
    { size: 13, len: 55, edge: 75, hueJ: 0.08, satJ: 0.2, lumJ: 0.15, minFocus: 0.3, bgChance: 0.15, accent: 0.01 },
    { size: 8, len: 28, edge: 70, hueJ: 0.07, satJ: 0.18, lumJ: 0.12, minFocus: 0.55 },
    { size: 5, len: 15, edge: 60, hueJ: 0.06, satJ: 0.14, lumJ: 0.1, minFocus: 0.8 },
    { size: 3.2, len: 9, edge: 45, hueJ: 0.03, satJ: 0.1, lumJ: 0.06, minFocus: 0.85, minGrad: 2.5, gradKeep: 0 },
  ];
  RP.events = RP.events || {};
})(typeof window !== 'undefined' ? window : globalThis);
