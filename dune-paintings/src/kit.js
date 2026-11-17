/*
 * Dune paintings: a small kit for smooth, atmospheric digital painting on Canvas 2D.
 * Big simple value shapes, layered haze, soft glows, directional brush texture inside shapes,
 * blowing sand, bloom and film grain. Everything is seeded so a painting renders the same each time.
 */
(function (global) {
  'use strict';
  const D = (global.D = global.D || {});

  D.rng = (seed) => {
    let s = seed >>> 0 || 1;
    return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  };

  // value noise and fbm
  D.noise = (seed) => {
    const r = D.rng(seed), P = new Float32Array(512);
    for (let i = 0; i < 512; i++) P[i] = r();
    const h = (x, y) => P[((x * 73856093) ^ (y * 19349663)) & 511];
    const sm = (t) => t * t * (3 - 2 * t);
    const n = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
      const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
      return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
    };
    n.fbm = (x, y, o) => { let v = 0, a = 0.5, f = 1; for (let i = 0; i < (o || 4); i++) { v += a * n(x * f, y * f); f *= 2; a *= 0.5; } return v; };
    return n;
  };

  D.hex = (c) => { const v = parseInt(c.slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; };
  D.rgba = (c, a) => { const [r, g, b] = D.hex(c); return `rgba(${r},${g},${b},${a})`; };
  D.mix = (c1, c2, t) => { const a = D.hex(c1), b = D.hex(c2); return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join(''); };

  D.makeKit = (canvas, seed) => {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const rand = D.rng(seed), noise = D.noise(seed + 7);
    const K = { ctx, W, H, rand, noise };
    K.R = (a, b) => a + rand() * (b - a);
    K.pick = (a) => a[(rand() * a.length) | 0];

    K.lin = (x0, y0, x1, y1, stops) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      stops.forEach((s, i) => Array.isArray(s) ? g.addColorStop(s[0], s[1]) : g.addColorStop(i / (stops.length - 1), s));
      return g;
    };
    K.rad = (x, y, r0, r1, stops) => {
      const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
      stops.forEach((s, i) => Array.isArray(s) ? g.addColorStop(s[0], s[1]) : g.addColorStop(i / (stops.length - 1), s));
      return g;
    };
    K.path = (pts, closed = true) => {
      const p = new Path2D();
      if (pts.length < 3) { p.moveTo(...pts[0]); pts.slice(1).forEach((q) => p.lineTo(...q)); return p; }
      const n = pts.length;
      const P = (i) => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
      p.moveTo(...P(0));
      for (let i = 0; i < (closed ? n : n - 1); i++) {
        const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
        p.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
      }
      if (closed) p.closePath();
      return p;
    };
    K.poly = (pts) => { const p = new Path2D(); p.moveTo(...pts[0]); pts.slice(1).forEach((q) => p.lineTo(...q)); p.closePath(); return p; };
    K.ell = (x, y, rx, ry, rot) => { const p = new Path2D(); p.ellipse(x, y, Math.max(rx, 0.1), Math.max(ry, 0.1), rot || 0, 0, Math.PI * 2); return p; };
    K.fill = (p, style, alpha, comp) => { ctx.save(); if (alpha != null) ctx.globalAlpha = alpha; if (comp) ctx.globalCompositeOperation = comp; ctx.fillStyle = style; ctx.fill(p); ctx.restore(); };
    K.bg = (style) => K.fill(K.poly([[0, 0], [W, 0], [W, H], [0, H]]), style);
    K.glow = (x, y, r, color, alpha, comp) => K.fill(K.ell(x, y, r, r), K.rad(x, y, 0, r, [D.rgba(color, 1), D.rgba(color, 0.35), D.rgba(color, 0)]), alpha == null ? 1 : alpha, comp || 'lighter');
    K.blur = (fn, px) => { ctx.save(); ctx.filter = `blur(${px}px)`; fn(); ctx.restore(); };

    // a single tapered brush stroke along points
    K.stroke = (pts, w, color, alpha, taper) => {
      ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const n = pts.length, t = taper == null ? 0.6 : taper;
      for (let i = 0; i < n - 1; i++) {
        const u = i / Math.max(1, n - 2), k = 1 - t * Math.abs(u * 2 - 1);
        ctx.lineWidth = Math.max(0.5, w * k);
        ctx.beginPath(); ctx.moveTo(...pts[i]); ctx.lineTo(...pts[i + 1]); ctx.stroke();
      }
      ctx.restore();
    };

    // painterly texture clipped to a shape: many soft strokes following an angle field
    K.brush = (p, o) => {
      o = o || {};
      const n = o.n || 400, [x0, y0, x1, y1] = o.box || [0, 0, W, H];
      ctx.save(); ctx.clip(p);
      for (let i = 0; i < n; i++) {
        const x = K.R(x0, x1), y = K.R(y0, y1);
        const a = (o.angle ? o.angle(x, y) : 0) + K.R(-0.12, 0.12);
        const L = K.R(o.len ? o.len[0] : 30, o.len ? o.len[1] : 120), w = K.R(o.w ? o.w[0] : 2, o.w ? o.w[1] : 8);
        const col = typeof o.color === 'function' ? o.color(x, y) : K.pick(o.colors || ['#ffffff']);
        const bend = K.R(-0.2, 0.2);
        const pts = [];
        for (let k = 0; k <= 4; k++) { const t = k / 4 - 0.5; pts.push([x + Math.cos(a + bend * t) * L * t, y + Math.sin(a + bend * t) * L * t]); }
        K.stroke(pts, w, col, K.R(o.alpha ? o.alpha[0] : 0.05, o.alpha ? o.alpha[1] : 0.2), 0.8);
      }
      ctx.restore();
    };

    // a dune: ridge along `ridge` (left to right), a sharp crest line splitting lit face and shadow face
    K.dune = (ridge, base, o) => {
      o = o || {};
      const poly = ridge.concat([[ridge[ridge.length - 1][0], base], [ridge[0][0], base]]);
      const body = K.path(poly.map((p, i) => p), true);
      const top = Math.min(...ridge.map((p) => p[1]));
      K.fill(body, K.lin(0, top, 0, base, o.colors || ['#e8a060', '#b0603a', '#5a2a2a']));
      // shadow face: the region below the slip-face line
      if (o.shadow) {
        const sh = [];
        for (let i = 0; i < ridge.length; i++) { const [x, y] = ridge[i]; sh.push([x, y]); }
        const back = ridge.slice().reverse().map(([x, y], i) => [x + (o.shadowDX || 0), y + (o.shadowDepth || 120) * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.7 + x * 0.002)))]);
        K.fill(K.path(sh.concat(back), true), o.shadow, o.shadowAlpha == null ? 0.85 : o.shadowAlpha);
      }
      K.brush(body, { n: o.strokes || 260, box: [ridge[0][0], top, ridge[ridge.length - 1][0], base], angle: () => (o.angle || 0.05), len: [60, 260], w: [1, 4], colors: o.texture || ['#ffe0b0', '#f0a070', '#8a3a2a'], alpha: [0.04, 0.16] });
      // crest highlight
      K.stroke(ridge, o.crestW || 3, o.crest || '#ffe8c0', o.crestAlpha == null ? 0.7 : o.crestAlpha, 0.9);
      return body;
    };
    // a ridge line generator
    K.ridge = (x0, x1, y, amp, freq, seed) => {
      const pts = [];
      for (let x = x0; x <= x1 + 1; x += (x1 - x0) / 40) pts.push([x, y - amp * (0.5 + 0.5 * Math.sin(x * freq + seed)) - amp * 0.6 * noise.fbm(x * freq * 0.7 + seed, seed, 3)]);
      return pts;
    };

    // a dune field: humps with a gentle windward slope and a steep lee slip-face; the crests meet sharply
    // o: y (base line of the crests), humps [[c, w, h], ...] or n for random, lightDir (+1 light from left), colors, shadow
    K.duneField = (o) => {
      const y0 = o.y, x0 = o.x0 == null ? -100 : o.x0, x1 = o.x1 == null ? W + 100 : o.x1;
      let humps = o.humps;
      if (!humps) { humps = []; const n = o.n || 6; for (let i = 0; i < n; i++) humps.push([x0 + (x1 - x0) * (i + K.R(0.1, 0.9)) / n, K.R(o.w ? o.w[0] : 150, o.w ? o.w[1] : 400), K.R(o.h ? o.h[0] : 30, o.h ? o.h[1] : 120)]); }
      const ld = o.lightDir || 1;
      const shape = (u) => (u * ld < 0 ? Math.exp(-u * u * 0.9) : Math.exp(-u * u * 5));
      const Y = (x) => { let m = 0; for (const [c, w, h] of humps) m = Math.max(m, h * shape((x - c) / w)); return y0 - m - (o.swell || 0) * noise.fbm(x * 0.002, y0 * 0.01, 3); };
      const step = 6, ridge = [];
      for (let x = x0; x <= x1; x += step) ridge.push([x, Y(x)]);
      const base = o.base || H + 10;
      const body = new Path2D(); body.moveTo(x0, base); ridge.forEach((p) => body.lineTo(...p)); body.lineTo(x1, base); body.closePath();
      const top = Math.min(...ridge.map((p) => p[1]));
      K.fill(body, K.lin(0, top, 0, Math.min(base, top + (o.gradH || 500)), o.colors));
      // lee slip-faces in shadow
      if (o.shadow) for (const [c, w, h] of humps) {
        // lee face: from the crest down to the trough, bounded on the lit side by a curving slip-face edge
        const xs = []; let prev = Y(c);
        for (let x = c; Math.abs(x - c) <= w * 2.5; x += step * ld) { const y = Y(x); if (y < prev - 0.5 && xs.length > 2) break; xs.push(x); prev = y; }
        if (xs.length < 3) continue;
        const xt = xs[xs.length - 1], depth = Math.max(h * (o.shadowDepth || 1.2), 40);
        const sp = new Path2D(); sp.moveTo(c, Y(c));
        xs.forEach((x) => sp.lineTo(x, Y(x)));
        sp.lineTo(c + (xt - c) * 0.75, Y(xt) + depth);
        for (let k = 10; k >= 0; k--) { const t = k / 10; sp.lineTo(c + (xt - c) * 0.35 * t * t - ld * w * 0.05 * Math.sin(t * Math.PI), Y(c) + depth * t); }
        sp.closePath();
        ctx.save(); ctx.clip(body); K.blur(() => K.fill(sp, K.lin(c, Y(c), c + (xt - c) * 0.6, Y(c) + depth, [D.rgba(o.shadow, o.shadowAlpha || 0.75), D.rgba(o.shadow, (o.shadowAlpha || 0.75) * 0.5), D.rgba(o.shadow, 0)])), 4); ctx.restore();
        K.stroke(xs.slice(0, Math.max(3, (xs.length * 0.35) | 0)).map((x) => [x, Y(x)]).reverse().concat([[c - ld * w * 0.4, Y(c - ld * w * 0.4)]]).reverse(), o.crestW || 2.5, o.crest || '#ffe8c0', o.crestAlpha == null ? 0.6 : o.crestAlpha, 0.9);
      }
      // wind ripples and texture
      K.brush(body, { n: o.strokes || 200, box: [x0, top, x1, base], angle: () => (o.angle || 0.03), len: [80, 300], w: [1, 3], colors: o.texture || ['#ffe0b0', '#f0a070', '#8a3a2a'], alpha: [0.04, 0.14] });
      if (o.ripples) for (let i = 0; i < o.ripples; i++) { const x = K.R(x0, x1), yy = K.R(Y(x) + 20, base); const L = K.R(60, 220), pts = []; for (let k = 0; k <= 6; k++) pts.push([x + L * k / 6, yy + Math.sin(k * 0.9) * 4]); K.stroke(pts, K.R(1, 2.2), K.pick(o.texture || ['#ffe0b0']), K.R(0.08, 0.2), 0.8); }
      K.Y = Y;
      return { body, Y, ridge };
    };

    // blowing sand: long faint streaks plus fine grains
    K.sand = (n, region, colors, angle) => {
      const [x0, y0, x1, y1] = region, a = angle || -0.05;
      for (let i = 0; i < n; i++) {
        const x = K.R(x0, x1), y = K.R(y0, y1), L = K.R(40, 400);
        K.stroke([[x, y], [x + Math.cos(a) * L, y + Math.sin(a) * L]], K.R(0.6, 2.2), K.pick(colors), K.R(0.03, 0.18), 1);
      }
    };
    K.stars = (n, region, colors) => { const [x0, y0, x1, y1] = region; for (let i = 0; i < n; i++) { const r = Math.pow(rand(), 3) * 2.4 + 0.4; K.fill(K.ell(K.R(x0, x1), K.R(y0, y1), r, r), K.pick(colors || ['#ffffff']), K.R(0.3, 1)); } };

    // god rays from a point
    K.rays = (x, y, n, len, color, alpha, spread, dir, r0) => {
      r0 = r0 || 30;
      K.blur(() => { for (let i = 0; i < n; i++) {
        const a = (dir || Math.PI / 2) + K.R(-spread, spread), w = K.R(0.01, 0.035);
        const sx = x + Math.cos(a) * r0, sy = y + Math.sin(a) * r0;
        K.fill(K.poly([[sx + Math.cos(a - w) * -r0 * 0.2, sy], [x + Math.cos(a - w) * len, y + Math.sin(a - w) * len], [x + Math.cos(a + w) * len, y + Math.sin(a + w) * len], [sx, sy + 1]]), K.lin(sx, sy, x + Math.cos(a) * len, y + Math.sin(a) * len, [D.rgba(color, alpha), D.rgba(color, 0)]), 1, 'lighter');
      } }, 6);
    };

    // a robed human figure in a stillsuit with a long cloak streaming downwind; feet at (x,y), height h.
    // o.dir: facing (+1 right), o.wind: cloak length downwind (+ to the right), o.rim: rim light colour, o.rimSide
    K.figure = (x, y, h, o) => {
      o = o || {};
      const ink = o.ink || '#120a10', rim = o.rim || '#ffd8a0', wd = o.wind == null ? -0.5 : o.wind;
      const P = (u, v) => [x + u * h, y - v * h];
      // legs, slightly apart
      K.fill(K.poly([P(-0.05, 0.47), P(-0.005, 0.47), P(-0.03, 0.0), P(-0.07, 0.0)]), ink);
      K.fill(K.poly([P(0.005, 0.47), P(0.05, 0.47), P(0.07, 0.0), P(0.03, 0.0)]), ink);
      // torso and shoulders
      K.fill(K.path([P(-0.085, 0.8), P(-0.1, 0.72), P(-0.07, 0.45), P(0.07, 0.45), P(0.1, 0.72), P(0.085, 0.8), P(0.03, 0.84), P(-0.03, 0.84)]), ink);
      // arms
      K.fill(K.poly([P(-0.1, 0.78), P(-0.075, 0.78), P(-0.085, 0.5), P(-0.11, 0.5)]), ink);
      K.fill(K.poly([P(0.075, 0.78), P(0.1, 0.78), P(0.11, 0.5), P(0.085, 0.5)]), ink);
      // head and hood
      K.fill(K.ell(...P(0, 0.9), h * 0.048, h * 0.06), ink);
      if (o.hood) K.fill(K.path([P(-0.07, 0.8), P(-0.065, 0.95), P(0.0, 1.0), P(0.065, 0.95), P(0.07, 0.8)]), ink);
      // cloak from the shoulders, streaming downwind and rippling
      const cl = [P(-0.09, 0.82), P(wd * 0.25 - 0.05, 0.8), P(wd * 0.6, 0.66), P(wd * 0.95, 0.5 + 0.04 * Math.sin(1)), P(wd * 1.15, 0.3), P(wd * 0.9, 0.2), P(wd * 0.5, 0.18), P(wd * 0.2 + 0.05, 0.08), P(0.09, 0.45), P(0.09, 0.82)];
      K.fill(K.path(cl), ink, o.cloakAlpha == null ? 1 : o.cloakAlpha);
      if (o.staff) { K.stroke([P(0.14, 0.82), P(0.17, 0.0)], Math.max(2, h * 0.016), ink, 1, 0); }
      // rim light
      const s = o.rimSide || -1;
      K.stroke([P(0.06 * s, 0.98), P(0.075 * s, 0.84), P(0.1 * s, 0.74), P(0.1 * s, 0.5)], Math.max(1.2, h * 0.012), rim, 0.9, 0.4);
      K.stroke([P(0.06 * s, 0.46), P(0.06 * s, 0.05)], Math.max(1, h * 0.009), rim, 0.6, 0.4);
      if (o.eyes) K.glow(...P(0.015, 0.905), h * 0.05, o.eyes, 0.9);
      return P;
    };

    // a sandworm rising: body spine as points from deep (start) to mouth (end), radius r at the mouth
    K.worm = (spine, r, o) => {
      o = o || {};
      const n = spine.length, c = o.colors || ['#e0a070', '#a05a3a', '#4a2020', '#1a0a0a'];
      // body as one smooth tube, lit from one side, with soft segment rings
      const L = [], Rr = [];
      for (let i = 0; i < n; i++) {
        const p0 = spine[Math.max(0, i - 1)], p1 = spine[Math.min(n - 1, i + 1)];
        const a = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), nx = -Math.sin(a), ny = Math.cos(a);
        const rr = r * (0.75 + 0.25 * (i / (n - 1)));
        L.push([spine[i][0] + nx * rr, spine[i][1] + ny * rr]); Rr.push([spine[i][0] - nx * rr, spine[i][1] - ny * rr]);
      }
      const bodyP = K.path(L.concat(Rr.slice().reverse()), true);
      const mid = spine[(n / 2) | 0], a0 = Math.atan2(spine[n - 1][1] - spine[0][1], spine[n - 1][0] - spine[0][0]);
      const gx = Math.sin(a0) * r, gy = -Math.cos(a0) * r;
      const cols = o.lit === 'right' ? [c[3], c[2], c[1], c[0]] : [c[0], c[1], c[2], c[3]];
      K.fill(bodyP, K.lin(mid[0] - gx, mid[1] - gy, mid[0] + gx, mid[1] + gy, [[0, cols[1]], [0.18, cols[0]], [0.45, cols[1]], [0.8, cols[2]], [1, cols[3]]]));
      for (let i = 2; i < n - 1; i += 2) {
        const [x0, y0] = spine[i], p1 = spine[i + 1], a = Math.atan2(p1[1] - y0, p1[0] - x0), rr = r * (0.75 + 0.25 * (i / (n - 1)));
        ctx.save(); ctx.clip(bodyP);
        ctx.strokeStyle = D.rgba(c[3], 0.16); ctx.lineWidth = rr * 0.04; ctx.beginPath(); ctx.ellipse(x0, y0, rr * 0.16, rr * 1.02, a, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        ctx.strokeStyle = D.rgba(c[0], 0.12); ctx.lineWidth = rr * 0.025; ctx.beginPath(); ctx.ellipse(x0 - Math.cos(a) * rr * 0.07, y0 - Math.sin(a) * rr * 0.07, rr * 0.16, rr * 1.02, a, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        ctx.restore();
      }
      K.brush(bodyP, { n: 500, angle: () => a0 + Math.PI / 2, len: [20, 90], w: [1, 4], colors: [c[0], c[1], c[3], '#ffe8c8'], alpha: [0.05, 0.2] });
      // the maw, seen head-on as an ellipse with rings of crystal teeth
      const [hx, hy] = spine[n - 1], [px, py] = spine[n - 2];
      const a = Math.atan2(hy - py, hx - px);
      const mx = o.mawRX || r * 0.95, my = o.mawRY || r * 0.95, rot = o.mawRot == null ? a + Math.PI / 2 : o.mawRot;
      // three fleshy lips peeled back around the opening
      for (let j = 0; j < 3; j++) {
        const th = rot + j * Math.PI * 2 / 3 + 0.5, cr = Math.cos(rot), sr = Math.sin(rot);
        const E = (u, v) => { const ex = u * mx * Math.cos(th - rot), ey = v * my * Math.sin(th - rot); return [hx + ex * cr - ey * sr, hy + ex * sr + ey * cr]; };
        const tip = E(1.3, 1.3), l = (d) => { const t2 = th + d, ex = 1.02 * mx * Math.cos(t2 - rot), ey = 1.02 * my * Math.sin(t2 - rot); return [hx + ex * cr - ey * sr, hy + ex * sr + ey * cr]; };
        const pet = K.path([l(-0.95), l(-0.5), tip, l(0.5), l(0.95)], true);
        K.fill(pet, K.lin(hx, hy, tip[0], tip[1], [c[1], c[0], c[2]]));
        K.brush(pet, { n: 60, angle: () => th, len: [20, 60], w: [1, 3], colors: [c[0], c[3]], alpha: [0.1, 0.25] });
      }
      K.fill(K.ell(hx, hy, mx * 1.08, my * 1.08, rot), c[1]);
      K.fill(K.ell(hx, hy, mx, my, rot), K.rad(hx, hy, 0, Math.max(mx, my), [o.throat || '#ffb060', '#6a1a10', '#1a0406', '#2a0a08']));
      for (let ring = 0; ring < 2; ring++) {
        const k = 0.94 - ring * 0.16, m = 40 - ring * 10;
        for (let j = 0; j < m; j++) {
          const th = (j / m) * Math.PI * 2, ca = Math.cos(th), sa = Math.sin(th), cr = Math.cos(rot), sr = Math.sin(rot);
          const ex = (u, v) => [hx + (u * mx * ca) * cr - (v * my * sa) * sr, hy + (u * mx * ca) * sr + (v * my * sa) * cr];
          const b = ex(k, k), tip = ex(k - 0.09, k - 0.09), b2 = ex(k + 0.0, k + 0.0);
          const side = [-(b[1] - hy), b[0] - hx], sl = Math.hypot(...side) || 1, wv = r * 0.018;
          K.fill(K.poly([[b2[0] + side[0] / sl * wv, b2[1] + side[1] / sl * wv], tip, [b2[0] - side[0] / sl * wv, b2[1] - side[1] / sl * wv]]), ring === 0 ? (o.teeth || '#fff0d8') : D.mix(o.teeth || '#fff0d8', '#ffb060', ring * 0.25), 0.9 - ring * 0.15);
        }
      }
      K.glow(hx, hy, Math.max(mx, my) * 0.5, o.throat || '#ffb060', 0.35);
      return [hx, hy];
    };

    // final pass: bloom, vignette, grain
    K.finish = (o) => {
      o = o || {};
      // bloom: blur a copy of the bright parts and screen it back
      const c2 = document.createElement('canvas'); c2.width = W; c2.height = H;
      const x2 = c2.getContext('2d'); x2.filter = `blur(${o.bloom || 30}px)`; x2.drawImage(canvas, 0, 0);
      ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = o.bloomAlpha == null ? 0.35 : o.bloomAlpha; ctx.drawImage(c2, 0, 0); ctx.restore();
      // vignette
      K.fill(K.poly([[0, 0], [W, 0], [W, H], [0, H]]), K.rad(W / 2, H * 0.55, Math.min(W, H) * 0.35, Math.max(W, H) * 0.8, ['rgba(0,0,0,0)', D.rgba(o.vignette || '#0a0408', o.vignetteAlpha == null ? 0.55 : o.vignetteAlpha)]));
      // grain
      const img = ctx.getImageData(0, 0, W, H), d = img.data, g = o.grain == null ? 14 : o.grain;
      for (let i = 0; i < d.length; i += 4) { const v = (rand() - 0.5) * g; d[i] += v; d[i + 1] += v; d[i + 2] += v; }
      ctx.putImageData(img, 0, 0);
    };
    return K;
  };
})(typeof window !== 'undefined' ? window : globalThis);
