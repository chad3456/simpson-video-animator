/*
 * Ramayana Portraits — drawing kit.
 * Helpers that scenes use to block in the hidden reference image (bold colour
 * fields, faces, crowns, hair, garments, props) and to queue crisp overlay
 * linework that is painted after the brushstrokes.
 */
(function (global) {
  'use strict';
  const RP = global.RP;
  const clamp = RP.clamp;
  const TAU = Math.PI * 2;

  RP.flows = {
    radial: (cx, cy, twist) => (x, y) => Math.atan2(y - cy, x - cx) + (twist || 0),
    swirl: (cx, cy) => (x, y) => Math.atan2(y - cy, x - cx) + Math.PI / 2,
    angle: (a) => () => a,
    rising: (amp) => (x, y, n) => -Math.PI / 2 + n(x * 0.004, y * 0.004) * (amp || 1),
  };

  RP.makeKit = function (env) {
    const { rctx: ctx, fctx, flctx, W, H, rand, noise, overlays } = env;
    const K = { ctx, W, H, rand, noise };
    K.R = (a, b) => a + rand() * (b - a);
    K.pick = (arr) => arr[(rand() * arr.length) | 0];
    K.overlay = (fn) => overlays.push(fn);
    K.path = (pts, closed = true) => RP.smoothPath(pts, closed);
    K.poly = (pts) => {
      const p = new Path2D();
      p.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]);
      p.closePath();
      return p;
    };
    K.ell = (x, y, rx, ry, rot) => {
      const p = new Path2D();
      p.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot || 0, 0, TAU);
      return p;
    };
    K.lin = (x0, y0, x1, y1, stops) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      stops.forEach((s, i) => (Array.isArray(s) ? g.addColorStop(s[0], s[1]) : g.addColorStop(i / (stops.length - 1), s)));
      return g;
    };
    K.rad = (x, y, r0, r1, stops) => {
      const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
      stops.forEach((s, i) => (Array.isArray(s) ? g.addColorStop(s[0], s[1]) : g.addColorStop(i / (stops.length - 1), s)));
      return g;
    };
    K.fill = (path, style, alpha) => {
      ctx.save();
      if (alpha != null) ctx.globalAlpha = alpha;
      ctx.fillStyle = style;
      ctx.fill(path);
      ctx.restore();
    };
    K.strokeRef = (pts, w, style, alpha) => {
      ctx.save();
      if (alpha != null) ctx.globalAlpha = alpha;
      ctx.strokeStyle = style; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.stroke(RP.smoothPath(pts, false));
      ctx.restore();
    };
    // soft colour blob
    K.blob = (x, y, r, color, alpha) => {
      const c = RP.hex(color);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, RP.css(c, alpha == null ? 1 : alpha));
      g.addColorStop(0.5, RP.css(c, (alpha == null ? 1 : alpha) * 0.8));
      g.addColorStop(1, RP.css(c, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    };
    // irregular hard-edged colour patch
    K.patch = (x, y, rx, ry, rot) => {
      const pts = [], n = 9, ph = rand() * 10;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * TAU, r = 1 + 0.28 * noise(ph + Math.cos(a), ph + Math.sin(a)) + K.R(-0.12, 0.12);
        const u = Math.cos(a) * rx * r, v = Math.sin(a) * ry * r;
        pts.push([x + u * Math.cos(rot || 0) - v * Math.sin(rot || 0), y + u * Math.sin(rot || 0) + v * Math.cos(rot || 0)]);
      }
      return K.path(pts);
    };
    K.bg = (style) => {
      ctx.fillStyle = style;
      ctx.fillRect(0, 0, W, H);
    };
    K.focus = (path, level) => {
      const v = Math.round(clamp(level, 0, 1) * 255);
      fctx.fillStyle = `rgb(${v},${v},${v})`;
      fctx.fill(path);
    };
    K.flow = (path, angle) => {
      const r = Math.round(Math.cos(2 * angle) * 127 + 128), g = Math.round(Math.sin(2 * angle) * 127 + 128);
      flctx.fillStyle = `rgb(${r},${g},255)`;
      flctx.fill(path);
    };
    K.flowStroke = (pts, w, angleFn) => {
      // stamps the flow field along a curve with the tangent direction
      const d = RP.sampleCurve(pts, 12);
      for (let i = 0; i < d.length - 1; i++) {
        const a = angleFn ? angleFn(i / d.length) : Math.atan2(d[i + 1][1] - d[i][1], d[i + 1][0] - d[i][0]);
        const r = Math.round(Math.cos(2 * a) * 127 + 128), g = Math.round(Math.sin(2 * a) * 127 + 128);
        flctx.strokeStyle = `rgb(${r},${g},255)`;
        flctx.lineWidth = w; flctx.lineCap = 'round';
        flctx.beginPath(); flctx.moveTo(d[i][0], d[i][1]); flctx.lineTo(d[i + 1][0], d[i + 1][1]); flctx.stroke();
      }
    };

    // ---------------- head frame ----------------
    K.head = (o) => {
      const s = o.s, tilt = o.tilt || 0, turn = o.turn || 0;
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      const T = (u, v) => [o.x + s * (u * ct - v * st), o.y + s * (u * st + v * ct)];
      const F = { T, s, x: o.x, y: o.y, tilt, turn, female: !!o.female, o };
      // shadow side: +1 = right side of the face is in shadow (light from the left)
      F.shadowSide = o.shadowSide || 1;
      F.outline = () => {
        const pts = [];
        const taper = o.female ? 1.12 : o.jaw || 0.5;
        const wid = o.width || (o.female ? 0.68 : 0.72);
        for (let k = 0; k < 36; k++) {
          const t = (k / 36) * TAU, c = Math.cos(t), sn = Math.sin(t);
          let v = sn * (sn > 0 ? 1.0 : 1.08);
          let u = wid * c * (sn > 0 ? 1 - 0.36 * sn * sn * sn * taper : 1 + 0.03 * sn);
          if (u * turn > 0) u *= 1 - 0.14 * Math.abs(turn);
          else u *= 1 + 0.06 * Math.abs(turn);
          if (sn < 0) v -= 0.0;
          pts.push(T(u + turn * 0.05, v));
        }
        return pts;
      };
      return F;
    };

    const skinGrad = (F, sk, u0, u1, hard) => {
      const a = F.T(F.shadowSide > 0 ? u0 : u1, 0), b = F.T(F.shadowSide > 0 ? u1 : u0, 0);
      return K.lin(a[0], a[1], b[0], b[1], hard ? [[0, sk[0]], [0.33, sk[0]], [0.38, sk[1]], [0.5, sk[1]], [0.56, sk[2]], [0.78, sk[2]], [0.86, sk[3]], [1, sk[3]]] : [[0, sk[0]], [0.38, sk[0]], [0.5, sk[1]], [0.6, sk[2]], [0.86, sk[3]], [1, sk[3]]]);
    };
    K.skinGrad = skinGrad;

    // ---------------- face ----------------
    K.face = (F, o) => {
      const T = F.T, s = F.s, turn = F.turn, sk = o.skin;
      const fx = turn * 0.2; // feature centre shift
      // neck
      if (o.neck !== false) {
        const nw = o.neckW || (F.female ? 0.3 : 0.38);
        const neck = K.path([T(-nw + fx * 0.3, 0.3), T(nw + fx * 0.3, 0.3), T(nw * 1.08 + fx * 0.3, 1.6), T(-nw * 1.08 + fx * 0.3, 1.6)]);
        K.fill(neck, skinGrad(F, sk, -0.45, 0.45));
        K.fill(neck, K.lin(...T(0, 0.7), ...T(0, 1.15), [RP.css(RP.hex(sk[3]), 0.75), RP.css(RP.hex(sk[3]), 0)]));
        K.focus(neck, 0.6);
      }
      // ears
      if (o.ears !== false) {
        for (const side of [-1, 1]) {
          const eu = side * (0.7 - (side * turn > 0 ? 0.1 : 0)) + turn * 0.05;
          const ear = K.ell(...T(eu, 0.08), s * 0.12, s * 0.22, F.tilt);
          K.fill(ear, side === F.shadowSide ? sk[2] : sk[1]);
          K.focus(ear, 0.8);
        }
      }
      const outline = F.outline();
      const head = K.path(outline);
      F.headPath = head;
      K.fill(head, skinGrad(F, sk, -0.75, 0.75, true));
      K.focus(head, 1);
      // strokes wrap around the form: gently bowed horizontals across the face
      if (o.faceFlow !== false) {
        for (let v = -1.1; v <= 1.15; v += 0.1) {
          const bow = 0.06 + (v > 0.2 ? 0.05 : 0);
          K.flowStroke([T(-0.85, v - bow), T(-0.4, v), T(0, v + bow * 0.4), T(0.4, v), T(0.85, v - bow)], s * 0.12);
        }
      }
      ctx.save();
      ctx.clip(head);
      const blobT = (u, v, r, c, a) => { const p = T(u, v); K.blob(p[0], p[1], r * s, c, a); };
      const ss = F.shadowSide;
      // forehead light, cheekbone light, warm cheek, eye sockets, jaw shade
      blobT(-ss * 0.25 + fx, -0.55, 0.45, o.glow || sk[0], 0.55);
      blobT(-ss * 0.42 + fx, 0.15, 0.25, o.cheek || '#ff6a3d', 0.35);
      blobT(ss * 0.4 + fx, 0.2, 0.28, o.cheek2 || sk[2], 0.4);
      for (const side of [-1, 1]) blobT(side * 0.3 + fx, -0.05, 0.22, sk[3], o.socket == null ? 0.35 : o.socket);
      blobT(fx, 1.05, 0.55, sk[3], 0.5);
      if (o.patches) for (const pt of o.patches) K.fill(K.patch(...T(pt[0] + fx, pt[1]), pt[2] * s, pt[2] * s * 0.75, F.tilt + K.R(-0.5, 0.5)), pt[3], pt[4] == null ? 0.55 : pt[4]);
      // nose shadow side plane
      const nx = fx * 1.1;
      K.fill(K.path([T(nx + ss * 0.03, -0.12), T(nx + ss * 0.12, 0.3), T(nx + ss * 0.02, 0.4), T(nx - ss * 0.02, 0.1)]), sk[2], 0.6);
      blobT(nx - ss * 0.02, 0.3, 0.09, sk[0], 0.7);
      ctx.restore();

      // lips (reference)
      const mx = fx * 0.9, my = o.mouthY || 0.58, mw = o.mouthW || (F.female ? 0.19 : 0.21);
      const lipC = o.lips || '#c8283c';
      K.fill(K.path([T(mx - mw, my), T(mx, my - 0.06), T(mx + mw, my), T(mx, my + 0.11)]), lipC, 0.9);

      // eyes / brows in the reference (rough, so strokes keep the darks)
      const ey = o.eyeY || -0.04, esep = o.eyeSep || 0.3;
      for (const side of [-1, 1]) {
        const ex = side * esep + fx * (side * turn > 0 ? 1.15 : 0.9);
        K.fill(K.ell(...T(ex, ey), s * 0.16, s * 0.07, F.tilt), o.eyeRef || '#2a1430', 0.55);
      }

      // ---- overlay: crisp features ----
      K.overlay((pen) => {
        const expr = o.expr || {};
        const ink = o.ink || '#1b1033';
        // contour on the shadow side (and a warm one on the light side)
        if (o.contour !== false) {
          const cpts = outline.filter((_, i) => { const t = (i / 36) * TAU; return Math.cos(t) * ss > 0.15 && Math.sin(t) > -0.35; });
          if (cpts.length > 2) pen.line(cpts.sort((a, b) => a[1] - b[1]), { w: s * 0.022, color: o.contourColor || '#22207a', alpha: 0.75 });
          const lpts = outline.filter((_, i) => { const t = (i / 36) * TAU; return Math.cos(t) * ss < -0.2 && Math.sin(t) > 0.25; });
          if (lpts.length > 2) pen.line(lpts.sort((a, b) => a[1] - b[1]), { w: s * 0.016, color: o.contourLight || '#b8381f', alpha: 0.55 });
        }
        // eyes
        for (const side of [-1, 1]) {
          const ex = side * esep + fx * (side * turn > 0 ? 1.15 : 0.9);
          K.eye(pen, F, ex, ey, side, o);
          K.brow(pen, F, ex, ey, side, o);
        }
        // nose
        const nx = fx * 1.1;
        if (o.nose !== false) {
          pen.line([T(nx + ss * 0.07, -0.12), T(nx + ss * 0.1, 0.12), T(nx + ss * 0.11, 0.3)], { w: s * 0.02, color: o.noseInk || '#3a1d5e', alpha: 0.6 });
          pen.line([T(nx - 0.12, 0.33), T(nx - 0.09, 0.41), T(nx - 0.03, 0.42)], { w: s * 0.022, color: ink, alpha: 0.75 });
          pen.line([T(nx + 0.12, 0.33), T(nx + 0.09, 0.41), T(nx + 0.03, 0.42)], { w: s * 0.022, color: ink, alpha: 0.75 });
          pen.dab(...T(nx - ss * 0.03, 0.31), s * 0.03, o.noseLight || '#fff1c8', 0.8);
        }
        // mouth
        K.mouth(pen, F, mx, my, mw, o);
        // marks
        if (o.tilak) K.tilak(pen, F, fx, o.tilak);
        if (o.tears) {
          for (const side of o.tears === 'both' ? [-1, 1] : [ss]) {
            const ex = side * esep + fx;
            pen.line([T(ex + side * 0.02, ey + 0.08), T(ex + side * 0.04, ey + 0.25), T(ex + side * 0.03, ey + 0.42)], { w: s * 0.03, color: '#bfe8ff', alpha: 0.85 });
            pen.dab(...T(ex + side * 0.03, ey + 0.44), s * 0.025, '#ffffff', 0.9);
          }
        }
        if (o.extraOverlay) o.extraOverlay(pen, F);
      });
      return F;
    };

    K.eye = (pen, F, ex, ey, side, o) => {
      const T = F.T, s = F.s;
      const st = o.eyes || 'open';
      const ew = (o.eyeW || 0.135) * (side * F.turn > 0 ? 0.9 : 1);
      const open = st === 'down' ? 0.55 : st === 'wide' ? 1.15 : st === 'half' ? 0.45 : st === 'fierce' ? 0.8 : st === 'soft' ? 0.78 : 0.92;
      const lift = o.eyeLift == null ? 0.025 : o.eyeLift; // lotus-eye upward tilt at outer corner
      const outerU = ex + side * ew, innerU = ex - side * ew;
      const outer = T(outerU, ey - lift), inner = T(innerU, ey + 0.005);
      const L = side < 0 ? outer : inner, Rr = side < 0 ? inner : outer;
      const lu = side < 0 ? outerU : innerU, ru = side < 0 ? innerU : outerU;
      const ink = o.lidInk || '#160a24';
      if (st === 'closed') {
        pen.line([L, T(ex, ey + 0.04), Rr], { w: s * 0.03, color: ink });
        for (let k = 0; k < 5; k++) {
          const uu = ex + (k - 2) * ew * 0.35;
          pen.line([T(uu, ey + 0.035), T(uu + side * 0.015 + (k - 2) * 0.01, ey + 0.075)], { w: s * 0.012, color: ink, taper: 0.5 });
        }
        pen.line([T(lu + 0.02, ey - 0.06), T(ex, ey - 0.075), T(ru - 0.02, ey - 0.06)], { w: s * 0.012, color: o.creaseInk || '#5a2a5a', alpha: 0.6 });
        pen.line([Rr === outer ? Rr : L, T(outerU + side * 0.06, ey - lift - 0.035)], { w: s * 0.02, color: ink, taper: 1 });
        return;
      }
      const up = 0.1 * open, dn = 0.05;
      const upperPts = [L, T(lu + (ru - lu) * 0.3, ey - up), T(lu + (ru - lu) * 0.68, ey - up * 0.95), Rr];
      const lowerPts = [Rr, T(lu + (ru - lu) * 0.65, ey + dn), T(lu + (ru - lu) * 0.3, ey + dn * 0.9), L];
      const almond = RP.smoothPath(upperPts.concat(lowerPts.slice(1, 3)), true);
      const oc = pen.octx;
      pen.fill(almond, o.white || '#f3ece0');
      // iris
      const g = o.gaze || [0, 0];
      const ir = (o.irisR || 0.058) * (st === 'wide' ? 0.85 : 1);
      const ix = ex + g[0] * ew * 0.45, iy = ey - 0.012 + g[1] * 0.03 + (st === 'down' ? 0.025 : 0);
      oc.save();
      oc.clip(almond);
      pen.hctx.save(); pen.hctx.clip(almond);
      const ic = T(ix, iy);
      pen.fill(K.ell(ic[0], ic[1], ir * s, ir * s), o.iris || '#4a2414');
      pen.fill(K.ell(ic[0] + ir * s * 0.15, ic[1] + ir * s * 0.2, ir * s * 0.6, ir * s * 0.55), o.iris2 || '#8a4a1c', 0.6);
      pen.fill(K.ell(ic[0], ic[1], ir * s * 0.45, ir * s * 0.45), '#0a0508');
      // lid shadow on the eyeball
      const ls = T(ex, ey - up);
      pen.fill(K.ell(ls[0], ls[1], ew * s * 1.2, up * s * 0.6, F.tilt), '#3a2050', 0.45);
      oc.restore(); pen.hctx.restore();
      pen.dab(ic[0] - ir * s * 0.35, ic[1] - ir * s * 0.35, ir * s * 0.28, '#ffffff', 0.95);
      // upper lid with kajal tail
      const tail = T(outerU + side * 0.075, ey - lift - 0.045);
      const up2 = side < 0 ? [tail].concat(upperPts) : upperPts.concat([tail]);
      pen.line(up2, { w: s * (st === 'fierce' ? 0.042 : 0.034), color: ink, taper: 0.7 });
      pen.line(lowerPts.concat(side < 0 ? [T(outerU + side * 0.05, ey - lift - 0.01)] : []), { w: s * 0.013, color: o.lowerInk || '#3b1840', alpha: 0.8, taper: 0.9 });
      // crease
      pen.line([T(lu + (ru - lu) * 0.12, ey - up - 0.03), T(ex, ey - up - 0.06 * open - 0.01), T(lu + (ru - lu) * 0.9, ey - up - 0.035)], { w: s * 0.011, color: o.creaseInk || '#5a2a5a', alpha: 0.6 });
      if (o.lashes) {
        for (let k = 0; k < 4; k++) {
          const t = 0.55 + k * 0.13;
          const uu = lu + (ru - lu) * (side < 0 ? 1 - t : t);
          pen.line([T(uu, ey - up * 0.9), T(uu + side * 0.03, ey - up - 0.04)], { w: s * 0.01, color: ink, taper: 1 });
        }
      }
    };

    K.brow = (pen, F, ex, ey, side, o) => {
      const T = F.T, s = F.s, b = o.brow || 'calm', ew = 0.15;
      const by = ey - (o.browGap || 0.2);
      const inner = ex - side * ew * 0.95, outer = ex + side * ew * 1.3, peak = ex + side * ew * 0.35;
      let iy = 0, py = -0.045, oy = 0.02;
      if (b === 'angry') { iy = 0.07; py = -0.02; oy = -0.03; }
      if (b === 'sad') { iy = -0.06; py = -0.04; oy = 0.05; }
      if (b === 'raised') { iy = -0.05; py = -0.09; oy = -0.02; }
      if (b === 'furrow') { iy = 0.05; py = -0.04; oy = 0.0; }
      const col = o.browInk || '#1a0f24';
      const pts = [T(inner, by + iy), T(peak, by + py), T(outer, by + oy)];
      pen.line(pts, { w: s * (o.browW || 0.045), color: col, taper: 0.8 });
      if (o.browHair) {
        for (let k = 0; k < 7; k++) {
          const t = k / 6, uu = inner + (outer - inner) * t;
          const vv = by + (t < 0.4 ? iy + (py - iy) * (t / 0.4) : py + (oy - py) * ((t - 0.4) / 0.6));
          pen.line([T(uu, vv + 0.02), T(uu + side * 0.04, vv - 0.025)], { w: s * 0.012, color: o.browHair, taper: 1, alpha: 0.85 });
        }
      }
      if (b === 'angry' || b === 'furrow') {
        pen.line([T(F.turn * 0.2 + side * 0.04, by + 0.02), T(F.turn * 0.2 + side * 0.03, by - 0.12)], { w: s * 0.012, color: '#40206a', alpha: 0.6 });
      }
    };

    K.mouth = (pen, F, mx, my, mw, o) => {
      const T = F.T, s = F.s, m = o.mouth || 'calm';
      const lipC = o.lips || '#a82a40', lip2 = o.lips2 || '#d8505e';
      const ink = o.mouthInk || '#3a0a1e';
      let cu = 0; // corner lift
      if (m === 'smile') cu = -0.05;
      if (m === 'grim') cu = 0.014;
      if (m === 'sad') cu = 0.006;
      if (m === 'open' || m === 'roar' || m === 'fangs') {
        const op = m === 'open' ? 0.09 : 0.16;
        const inside = RP.smoothPath([T(mx - mw * 1.05, my - 0.01), T(mx, my - 0.05), T(mx + mw * 1.05, my - 0.01), T(mx, my + op + 0.03)], true);
        pen.fill(inside, '#2a0612');
        // teeth
        pen.fill(RP.smoothPath([T(mx - mw * 0.75, my - 0.025), T(mx, my - 0.045), T(mx + mw * 0.75, my - 0.025), T(mx, my + 0.01)], true), '#f2ead8', 0.95);
        if (m === 'fangs' || m === 'roar') {
          for (const side of [-1, 1]) pen.fill(K.poly([T(mx + side * mw * 0.55, my - 0.02), T(mx + side * mw * 0.35, my - 0.02), T(mx + side * mw * 0.47, my + 0.09)]), '#fbf6ea');
        }
        pen.line([T(mx - mw * 1.05, my - 0.01), T(mx - mw * 0.4, my - 0.06), T(mx, my - 0.045), T(mx + mw * 0.4, my - 0.06), T(mx + mw * 1.05, my - 0.01)], { w: s * 0.03, color: lipC });
        pen.line([T(mx - mw, my), T(mx, my + op + 0.045), T(mx + mw, my)], { w: s * 0.04, color: lip2, taper: 0.8 });
        return;
      }
      const upper = RP.smoothPath([T(mx - mw, my + cu), T(mx - mw * 0.45, my - 0.03), T(mx, my - 0.02), T(mx + mw * 0.45, my - 0.03), T(mx + mw, my + cu), T(mx, my + 0.015)], true);
      const lower = RP.smoothPath([T(mx - mw * 0.92, my + cu * 0.8), T(mx, my + 0.005), T(mx + mw * 0.92, my + cu * 0.8), T(mx + mw * 0.4, my + 0.085), T(mx - mw * 0.4, my + 0.085)], true);
      pen.fill(upper, lipC, 0.92);
      pen.fill(lower, lip2, 0.9);
      pen.dab(...T(mx - mw * 0.2, my + 0.05), s * 0.018, '#ffd0c0', 0.5);
      pen.line([T(mx - mw * 1.05, my + cu * 1.2 - 0.005), T(mx - mw * 0.4, my + 0.016), T(mx, my + 0.02), T(mx + mw * 0.4, my + 0.016), T(mx + mw * 1.05, my + cu * 1.2 - 0.005)], { w: s * 0.016, color: ink, taper: 0.9 });
      // philtrum + chin hint
      pen.line([T(mx - 0.035, my - 0.05), T(mx - 0.03, my - 0.13)], { w: s * 0.01, color: '#6a2a3a', alpha: 0.35 });
      if (m === 'smile') {
        pen.line([T(mx + mw * 1.15, my - 0.11), T(mx + mw * 1.3, my - 0.02), T(mx + mw * 1.2, my + 0.04)], { w: s * 0.012, color: '#6a2a4a', alpha: 0.5 });
        pen.line([T(mx - mw * 1.15, my - 0.11), T(mx - mw * 1.3, my - 0.02), T(mx - mw * 1.2, my + 0.04)], { w: s * 0.012, color: '#6a2a4a', alpha: 0.5 });
      }
    };

    K.tilak = (pen, F, fx, type) => {
      const T = F.T, s = F.s;
      if (type === 'vaishnava') {
        for (const side of [-1, 1]) pen.line([T(fx + side * 0.02, -0.24), T(fx + side * 0.07, -0.4), T(fx + side * 0.075, -0.62)], { w: s * 0.03, color: '#fff6e0', taper: 0.4 });
        pen.line([T(fx, -0.3), T(fx, -0.6)], { w: s * 0.03, color: '#e0141e', taper: 0.4 });
      } else if (type === 'tripundra') {
        for (let k = 0; k < 3; k++) pen.line([T(fx - 0.38, -0.5 + k * 0.07), T(fx, -0.52 + k * 0.07), T(fx + 0.38, -0.5 + k * 0.07)], { w: s * 0.028, color: '#f4efe6', alpha: 0.9 });
        pen.dab(...T(fx, -0.46), s * 0.035, '#e01020');
      } else if (type === 'bindi') {
        pen.dab(...T(fx, -0.27), s * 0.04, '#d50f2a');
        pen.dab(...T(fx - 0.01, -0.285), s * 0.012, '#ffd0d0', 0.8);
      } else if (type === 'line') {
        pen.line([T(fx, -0.28), T(fx, -0.58)], { w: s * 0.028, color: '#e0141e', taper: 0.5 });
      } else if (type === 'ash') {
        for (let k = 0; k < 3; k++) pen.line([T(fx - 0.35, -0.48 + k * 0.07), T(fx + 0.35, -0.48 + k * 0.07)], { w: s * 0.026, color: '#ece6dc', alpha: 0.85 });
      }
    };

    // ---------------- hair ----------------
    K.hairBack = (F, o) => {
      const T = F.T, s = F.s;
      const len = o.len || 2.2, w = o.w || 1.05;
      const pts = [T(-0.55, -0.95), T(0, -1.12), T(0.55, -0.95), T(w, -0.2), T(w * 1.05, len * 0.6), T(w * 0.9 + 0.1, len), T(0.4, len * 0.9), T(-0.4, len * 0.9), T(-w * 0.9 - 0.1, len), T(-w * 1.05, len * 0.6), T(-w, -0.2)];
      const p = K.path(pts);
      K.fill(p, skinGradH(F, o.colors || ['#3a2a7a', '#241a5a', '#140c38', '#0c0820']));
      K.focus(p, o.focus == null ? 0.45 : o.focus);
      // strands flow downward
      K.flow(p, Math.PI / 2 + F.tilt);
      return p;
    };
    const skinGradH = (F, c) => skinGrad(F, c, -1.1, 1.1);
    K.hairFront = (F, o) => {
      const T = F.T, s = F.s;
      const part = o.part == null ? 0 : o.part;
      const pts = [T(-0.74, -0.1), T(-0.72, -0.6), T(-0.4, -1.02), T(part, -1.1), T(0.4, -1.02), T(0.72, -0.6), T(0.74, -0.1), T(0.6, -0.45), T(0.35, -0.68), T(part, -0.72), T(-0.35, -0.68), T(-0.6, -0.45)];
      const p = K.path(pts);
      K.fill(p, skinGradH(F, o.colors || ['#4a3a9a', '#2a1c64', '#160c3a', '#0c0820']));
      K.focus(p, 0.75);
      K.overlay((pen) => {
        for (let k = 0; k < 10; k++) {
          const side = k % 2 ? 1 : -1, t = (k >> 1) / 5;
          pen.line([T(part + side * 0.02, -0.72 - t * 0.05), T(side * (0.35 + t * 0.15), -0.66 + t * 0.06), T(side * (0.62 + t * 0.06), -0.35 + t * 0.15)], { w: s * 0.012, color: K.pick(o.strands || ['#6a5ad0', '#2a1a60', '#8a6ae0']), alpha: 0.6, taper: 1 });
        }
      });
      return p;
    };
    // matted ascetic hair piled into a bun
    K.jata = (F, o) => {
      const T = F.T, s = F.s;
      const pts = [T(-0.72, -0.35), T(-0.7, -0.85), T(-0.45, -1.15), T(-0.35, -1.6), T(0, -1.82), T(0.35, -1.6), T(0.45, -1.15), T(0.7, -0.85), T(0.72, -0.35), T(0.5, -0.62), T(0, -0.72), T(-0.5, -0.62)];
      const p = K.path(pts);
      K.fill(p, skinGradH(F, o.colors || ['#7a5a3a', '#5a3a28', '#3a2418', '#1a100c']));
      K.focus(p, 0.7);
      K.overlay((pen) => {
        for (let k = 0; k < 9; k++) {
          const a = -0.6 + k * 0.15;
          pen.line([T(a * 0.9, -0.7), T(a * 0.7, -1.15), T(a * 0.35, -1.55), T(0, -1.75)], { w: s * 0.02, color: K.pick(o.strands || ['#c08a50', '#4a2a18', '#e0b070']), alpha: 0.6, taper: 1 });
        }
        if (o.rudraksha) {
          for (let k = 0; k < 9; k++) {
            const t = k / 8;
            pen.dab(...T(-0.5 + t, -1.12 - Math.sin(t * Math.PI) * 0.08), s * 0.035, '#7a2a10');
          }
        }
      });
      return p;
    };

    // ---------------- crown (kirita mukuta) ----------------
    K.crown = (F, o) => {
      o = o || {};
      const T = F.T, s = F.s;
      const h = o.h || 1.0, bw = o.bw || 0.8;
      const gold = o.gold || ['#fff3a0', '#ffc22a', '#e0701a', '#7a2a12'];
      const by = -0.58;
      const band = K.path([T(-bw, by + 0.04), T(-bw * 0.5, by - 0.06), T(0, by - 0.08), T(bw * 0.5, by - 0.06), T(bw, by + 0.04), T(bw * 0.96, by - 0.16), T(0, by - 0.24), T(-bw * 0.96, by - 0.16)]);
      const body = K.path([T(-bw * 0.85, by - 0.14), T(-bw * 0.7, by - 0.5 * h), T(-bw * 0.42, by - 0.85 * h), T(-0.14, by - 1.2 * h), T(0, by - 1.38 * h), T(0.14, by - 1.2 * h), T(bw * 0.42, by - 0.85 * h), T(bw * 0.7, by - 0.5 * h), T(bw * 0.85, by - 0.14)]);
      const g = skinGrad(F, gold, -0.9, 0.9);
      K.fill(body, g); K.fill(band, g);
      K.focus(body, 0.82); K.focus(band, 0.9);
      // side flares (makara kundala wings)
      if (o.wings) for (const side of [-1, 1]) {
        const wing = K.path([T(side * bw * 0.9, by - 0.02), T(side * (bw + 0.16), by - 0.2), T(side * (bw + 0.1), by - 0.42), T(side * bw * 0.8, by - 0.3)]);
        K.fill(wing, g); K.focus(wing, 0.8);
      }
      const jewels = o.jewels || ['#e0102a', '#14a05a', '#1a50e0'];
      K.overlay((pen) => {
        // tiers
        for (let k = 1; k <= 3; k++) {
          const v = by - 0.12 - k * 0.3 * h, ww = bw * (0.88 - k * 0.2);
          pen.line([T(-ww, v + 0.04), T(-ww / 2, v - 0.04), T(0, v - 0.06), T(ww / 2, v - 0.04), T(ww, v + 0.04)], { w: s * 0.03, color: '#8a3a10', alpha: 0.8 });
          pen.line([T(-ww * 0.9, v), T(0, v - 0.09), T(ww * 0.9, v)], { w: s * 0.014, color: '#fff7c0', alpha: 0.8 });
          for (let j = -2; j <= 2; j++) pen.dab(...T(j * ww * 0.4, v - 0.12 + Math.abs(j) * 0.03), s * 0.028, jewels[(j + k + 9) % jewels.length]);
        }
        pen.line([T(-bw, by + 0.03), T(0, by - 0.08), T(bw, by + 0.03)], { w: s * 0.03, color: '#6a2008', alpha: 0.85 });
        pen.line([T(-bw * 0.9, by - 0.12), T(0, by - 0.2), T(bw * 0.9, by - 0.12)], { w: s * 0.02, color: '#fff5b0', alpha: 0.9 });
        // central jewel
        const cj = T(0, by - 0.14);
        pen.fill(K.ell(cj[0], cj[1], s * 0.07, s * 0.09, F.tilt), o.centre || '#d8102a');
        pen.dab(cj[0] - s * 0.02, cj[1] - s * 0.03, s * 0.022, '#ffe0e0', 0.9);
        // finial
        pen.dab(...T(0, by - 1.4 * h), s * 0.06, '#fff1a0');
        pen.line([T(0, by - 1.38 * h), T(0, by - 1.55 * h)], { w: s * 0.03, color: '#ffd84a' });
        // glints
        for (let k = 0; k < 14; k++) pen.dab(...T(K.R(-bw * 0.7, bw * 0.7), by - K.R(0.1, 1.1 * h)), s * K.R(0.008, 0.02), '#fffbe0', 0.9);
      });
    };

    // ---------------- beards, moustaches, wrinkles, ornaments ----------------
    K.beard = (F, o) => {
      const T = F.T, s = F.s, len = o.len || 0.9, fx = F.turn * 0.2;
      const pts = [T(-0.7, -0.05), T(-0.7, 0.45), T(-0.55, 0.95), T(-0.3, 1.05 + len * 0.6), T(fx, 1.0 + len), T(0.3, 1.05 + len * 0.6), T(0.55, 0.95), T(0.7, 0.45), T(0.7, -0.05), T(0.5, 0.5), T(fx, 0.82), T(-0.5, 0.5)];
      const p = K.path(pts);
      K.fill(p, K.skinGrad(F, o.colors || ['#ffffff', '#e8e4ff', '#a8b0e0', '#5a5aa0'], -0.8, 0.8));
      K.focus(p, 0.8);
      K.flow(p, Math.PI / 2 + F.tilt);
      K.overlay((pen) => {
        const cols = o.strands || ['#ffffff', '#f4f0ff', '#cfd8ff', '#ffe8c0', '#b8c0f0', '#ffd0e0'];
        for (let k = 0; k < (o.n || 70); k++) {
          const u = K.R(-0.62, 0.62), v0 = 0.25 + Math.abs(u) * 0.2 + K.R(0, 0.5);
          const v1 = Math.min(v0 + K.R(0.25, 0.6), 1.0 + len * (1 - Math.abs(u) * 0.9));
          const sway = K.R(-0.1, 0.1);
          if (v1 <= v0 + 0.05) continue;
          pen.line([T(u, v0), T(u * 0.92 + sway, (v0 + v1) / 2), T(u * 0.8 + sway * 1.5, v1)], { w: s * K.R(0.012, 0.03), color: K.pick(cols), alpha: 0.85, taper: 1 });
        }
      });
    };
    K.mustache = (F, o) => {
      o = o || {};
      const T = F.T, s = F.s, fx = F.turn * 0.18, my = 0.5;
      const curl = o.curl || 0;
      K.overlay((pen) => {
        const cols = o.strands || [o.color || '#1a1020'];
        for (let k = 0; k < (o.n || 26); k++) {
          const side = k % 2 ? 1 : -1, j = K.R(0, 1);
          const pts = [T(fx + side * 0.03, my - 0.02 + j * 0.03), T(fx + side * (0.16 + j * 0.05), my + 0.0), T(fx + side * (0.3 + j * 0.05), my + 0.06 - curl * 0.1), T(fx + side * (0.4 + curl * 0.05), my + 0.12 - curl * 0.28)];
          if (curl) pts.push(T(fx + side * (0.36 + curl * 0.02), my - curl * 0.32));
          pen.line(pts, { w: s * (o.w || 0.035) * K.R(0.6, 1.1), color: K.pick(cols), alpha: 0.9, taper: 0.9 });
        }
      });
    };
    K.wrinkles = (F, o) => {
      o = o || {};
      const T = F.T, s = F.s, fx = F.turn * 0.2, c = o.color || '#5a2a5a';
      K.overlay((pen) => {
        for (let k = 0; k < 3; k++) pen.line([T(fx - 0.35, -0.5 - k * 0.09), T(fx, -0.53 - k * 0.09), T(fx + 0.35, -0.5 - k * 0.09)], { w: s * 0.012, color: c, alpha: 0.5 });
        for (const side of [-1, 1]) {
          const ex = side * 0.3 + fx;
          for (let k = 0; k < 3; k++) pen.line([T(ex + side * 0.17, -0.06 + k * 0.04), T(ex + side * 0.25, -0.1 + k * 0.07)], { w: s * 0.01, color: c, alpha: 0.5 });
          pen.line([T(fx + side * 0.15, 0.32), T(fx + side * 0.26, 0.52), T(fx + side * 0.28, 0.7)], { w: s * 0.016, color: c, alpha: 0.55 });
          pen.line([T(ex - side * 0.06, 0.1), T(ex, 0.14), T(ex + side * 0.1, 0.1)], { w: s * 0.01, color: c, alpha: 0.45 });
        }
      });
    };
    K.noseRing = (F, o) => {
      o = o || {};
      const T = F.T, s = F.s, fx = F.turn * 0.22;
      K.overlay((pen) => {
        const c = T(fx - 0.1, 0.43), r = s * (o.r || 0.13);
        const pts = [];
        for (let k = 0; k <= 14; k++) { const a = -1.2 + (k / 14) * 5.2; pts.push([c[0] - r * 0.4 + Math.cos(a) * r, c[1] + r * 0.5 + Math.sin(a) * r]); }
        pen.line(pts, { w: s * 0.018, color: '#ffd040', taper: 0.2 });
        pen.dab(c[0] - r * 0.4, c[1] + r * 1.5, s * 0.03, '#ffffff');
        pen.dab(c[0] - r * 0.4 + r * 0.6, c[1] + r * 1.3, s * 0.025, '#e0102a');
      });
    };

    // ---------------- earrings, necklaces ----------------
    K.earrings = (F, o) => {
      o = o || {};
      K.overlay((pen) => {
        for (const side of [-1, 1]) {
          const eu = side * (0.7 - (side * F.turn > 0 ? 0.1 : 0)) + F.turn * 0.05;
          const p = F.T(eu, 0.32);
          const r = F.s * (o.r || 0.09);
          pen.line([[p[0] - r, p[1]], [p[0], p[1] + r * 1.2], [p[0] + r, p[1]]], { w: r * 0.45, color: o.color || '#ffc22a', taper: 0.3 });
          pen.dab(p[0], p[1] + r * 1.3, r * 0.5, o.gem || '#e0102a');
          pen.dab(p[0] - r * 0.2, p[1] + r * 1.15, r * 0.18, '#ffffff', 0.9);
        }
      });
    };
    K.necklace = (pts, o) => {
      o = o || {};
      K.strokeRef(pts, o.w || 14, o.color || '#ffc22a', 0.9);
      K.overlay((pen) => {
        pen.line(pts, { w: o.w || 12, color: o.color || '#ffc22a', taper: 0.2 });
        pen.line(pts.map((p) => [p[0], p[1] - (o.w || 12) * 0.25]), { w: (o.w || 12) * 0.3, color: '#fff6c0', alpha: 0.85, taper: 0.4 });
        const d = RP.sampleCurve(pts, 6);
        const step = o.step || 5;
        for (let i = 2; i < d.length - 2; i += step) pen.dab(d[i][0], d[i][1] + (o.w || 12) * 0.4, (o.gemR || 7), K.pick(o.gems || ['#e0102a', '#13a05a', '#ffffff']));
      });
    };

    // ---------------- bust / torso ----------------
    K.bust = (F, o) => {
      const T = F.T;
      const sw = o.sw || 1.75, top = o.top || 1.25;
      const pts = [T(-0.38, top - 0.05), T(-sw * 0.45, top + 0.28), T(-sw * 0.8, top + 0.42), T(-sw * 1.02, top + 0.7), T(-sw * 1.12, top + 1.5), T(-sw * 1.2, 4.4), T(sw * 1.2, 4.4), T(sw * 1.12, top + 1.5), T(sw * 1.02, top + 0.7), T(sw * 0.8, top + 0.42), T(sw * 0.45, top + 0.28), T(0.38, top - 0.05)];
      const p = K.path(pts);
      K.fill(p, skinGrad(F, o.colors, -sw, sw));
      K.focus(p, o.focus == null ? 0.5 : o.focus);
      if (o.flow != null) K.flow(p, o.flow);
      return p;
    };

    // ---------------- props ----------------
    K.bow = (cx, cy, r, a0, a1, o) => {
      o = o || {};
      const pts = [];
      for (let k = 0; k <= 16; k++) {
        const a = a0 + (a1 - a0) * (k / 16);
        const rr = r * (1 + 0.06 * Math.sin((k / 16) * Math.PI * 2));
        pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
      }
      K.strokeRef(pts, o.w || 26, o.color || '#6a2a10');
      const sp = new Path2D();
      K.focus((() => { const p = new Path2D(); p.addPath(RP.smoothPath(pts, false)); return p; })(), 0);
      K.overlay((pen) => {
        pen.line(pts, { w: o.w || 24, color: o.color || '#7a3212', taper: 0.6 });
        pen.line(pts.map((p) => [p[0] - 4, p[1] - 4]), { w: (o.w || 24) * 0.3, color: o.light || '#ffcf6a', alpha: 0.8, taper: 0.6 });
        // gold bands
        for (const t of [0.25, 0.5, 0.75]) {
          const p = pts[Math.round(t * 16)];
          pen.dab(p[0], p[1], (o.w || 24) * 0.75, '#ffd040');
        }
        if (o.string !== false) pen.line([pts[0], o.pull || pts[16]].concat(o.pull ? [pts[16]] : []), { w: 3, color: o.stringColor || '#fff4d8', alpha: 0.9, taper: 0 });
      });
      return pts;
    };
    K.arrow = (x0, y0, x1, y1, o) => {
      o = o || {};
      K.overlay((pen) => {
        pen.line([[x0, y0], [x1, y1]], { w: o.w || 7, color: o.color || '#f4d9a0', taper: 0.1 });
        const a = Math.atan2(y1 - y0, x1 - x0), L = o.head || 34;
        pen.fill(K.poly([[x1 + Math.cos(a) * L, y1 + Math.sin(a) * L], [x1 + Math.cos(a + 2.2) * L * 0.45, y1 + Math.sin(a + 2.2) * L * 0.45], [x1 + Math.cos(a - 2.2) * L * 0.45, y1 + Math.sin(a - 2.2) * L * 0.45]]), o.tip || '#e8eef8');
        for (const sd of [-1, 1]) pen.line([[x0, y0], [x0 - Math.cos(a + sd * 0.4) * 40, y0 - Math.sin(a + sd * 0.4) * 40]], { w: 9, color: o.fletch || '#e0302a', taper: 0.5 });
      });
    };
    K.flame = (x, y, w, h, colors, lean) => {
      lean = lean || 0;
      const p = K.path([[x - w / 2, y], [x - w * 0.42, y - h * 0.35], [x - w * 0.12 + lean * 0.5, y - h * 0.7], [x + lean, y - h], [x + w * 0.18 + lean * 0.4, y - h * 0.62], [x + w * 0.45, y - h * 0.3], [x + w / 2, y]]);
      K.fill(p, K.lin(x, y, x + lean, y - h, colors || ['#fff7c0', '#ffd23a', '#ff7a1a', '#e0201a', 'rgba(120,10,40,0.6)']));
      return p;
    };

    return K;
  };
})(typeof window !== 'undefined' ? window : globalThis);
