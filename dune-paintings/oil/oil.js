/*
 * Oil-paint pass: repaints a reference image with layered brushstrokes, coarse to fine.
 * Strokes are curved and follow the image's contours (perpendicular to the colour gradient), and stop where the
 * colour changes (Hertzmann's painterly rendering). Each stroke carries bristle streaks, and a height map of the
 * paint is lit at the end so the strokes stand up as impasto. Finally a faint canvas weave.
 */
(function (global) {
  'use strict';
  const O = (global.OIL = {});

  const boxBlur = (src, W, H, r) => {
    if (r < 1) return Float32Array.from(src);
    const tmp = new Float32Array(src.length), out = new Float32Array(src.length);
    const pass = (a, b, horiz) => {
      const n = horiz ? W : H, m = horiz ? H : W, k = 1 / (2 * r + 1);
      for (let j = 0; j < m; j++) {
        let acc = 0;
        const idx = (i) => (horiz ? j * W + Math.min(n - 1, Math.max(0, i)) : Math.min(n - 1, Math.max(0, i)) * W + j);
        for (let i = -r; i <= r; i++) acc += a[idx(i)];
        for (let i = 0; i < n; i++) { b[idx(i)] = acc * k; acc += a[idx(i + r + 1)] - a[idx(i - r)]; }
      }
    };
    pass(src, tmp, true); pass(tmp, out, false);
    pass(out, tmp, true); pass(tmp, out, false);
    return out;
  };

  O.paint = (ref, out, opt) => {
    opt = opt || {};
    const W = ref.width, H = ref.height;
    const rctx = ref.getContext('2d');
    const rd = rctx.getImageData(0, 0, W, H).data;
    const R0 = new Float32Array(W * H), G0 = new Float32Array(W * H), B0 = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) { R0[i] = rd[i * 4]; G0[i] = rd[i * 4 + 1]; B0[i] = rd[i * 4 + 2]; }
    let seed = opt.seed || 7; const rand = () => { seed ^= seed << 13; seed >>>= 0; seed ^= seed >>> 17; seed ^= seed << 5; seed >>>= 0; return seed / 4294967296; };

    const ctx = out.getContext('2d');
    const hc = document.createElement('canvas'); hc.width = W; hc.height = H;
    const hctx = hc.getContext('2d');
    hctx.fillStyle = '#000'; hctx.fillRect(0, 0, W, H);
    // toned ground
    ctx.fillStyle = opt.ground || '#5a3a2a'; ctx.fillRect(0, 0, W, H);

    const sizes = opt.sizes || [36, 20, 11, 6, 3.5];
    const T = opt.threshold || 22;
    for (let li = 0; li < sizes.length; li++) {
      const Rb = sizes[li];
      const br = Math.max(1, Math.round(Rb * 0.45));
      const BR = boxBlur(R0, W, H, br), BG = boxBlur(G0, W, H, br), BB = boxBlur(B0, W, H, br);
      const L = new Float32Array(W * H); for (let i = 0; i < W * H; i++) L[i] = 0.3 * BR[i] + 0.59 * BG[i] + 0.11 * BB[i];
      const Ls = boxBlur(L, W, H, Math.max(2, Math.round(Rb * 0.8)));
      const cd = ctx.getImageData(0, 0, W, H).data; // current paint, for the error test
      const at = (x, y) => Math.min(H - 1, Math.max(0, y | 0)) * W + Math.min(W - 1, Math.max(0, x | 0));
      const diffC = (i) => Math.abs(cd[i * 4] - BR[i]) + Math.abs(cd[i * 4 + 1] - BG[i]) + Math.abs(cd[i * 4 + 2] - BB[i]);
      const grad = (x, y) => { const gx = Ls[at(x + 2, y)] - Ls[at(x - 2, y)], gy = Ls[at(x, y + 2)] - Ls[at(x, y - 2)]; return [gx, gy]; };
      const strokes = [];
      const step = Math.max(2, Math.round(Rb * (li === 0 ? 0.9 : 1.0)));
      for (let gy = 0; gy < H; gy += step) for (let gx = 0; gx < W; gx += step) {
        // area error in this cell, and the worst point
        let err = 0, worst = -1, wx = gx, wy = gy, n = 0;
        for (let k = 0; k < 6; k++) { const x = gx + rand() * step, y = gy + rand() * step; const i = at(x, y); const e = diffC(i) / 3; err += e; n++; if (e > worst) { worst = e; wx = x; wy = y; } }
        err /= n;
        if (li > 0 && err < T * (opt.focus ? opt.focus(gx, gy, li) : 1)) continue;
        const i0 = at(wx, wy);
        const c = [BR[i0], BG[i0], BB[i0]];
        const pts = [[wx, wy]];
        let x = wx, y = wy, dx0 = 0, dy0 = 0;
        const maxLen = opt.maxLen || Math.round(Math.min(14, 5 + Rb * 0.35));
        for (let k = 0; k < maxLen; k++) {
          const i = at(x, y);
          if (k > 1 && (Math.abs(BR[i] - c[0]) + Math.abs(BG[i] - c[1]) + Math.abs(BB[i] - c[2])) > diffC(i) + 4) break;
          let [gxx, gyy] = grad(x, y);
          const gm = Math.hypot(gxx, gyy);
          let dx, dy;
          if (gm < (opt.gmin || 2.5)) { if (k === 0) { const a = (opt.angle ? opt.angle(x, y) : 0) + (rand() - 0.5) * 0.5; dx = Math.cos(a); dy = Math.sin(a); } else { dx = dx0; dy = dy0; } }
          else { dx = -gyy / gm; dy = gxx / gm; }
          if (k > 0 && dx * dx0 + dy * dy0 < 0) { dx = -dx; dy = -dy; }
          if (k > 0) { dx = dx * 0.6 + dx0 * 0.4; dy = dy * 0.6 + dy0 * 0.4; const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m; }
          x += dx * Rb * 0.9; y += dy * Rb * 0.9; dx0 = dx; dy0 = dy;
          if (x < -Rb || y < -Rb || x > W + Rb || y > H + Rb) break;
          pts.push([x, y]);
        }
        strokes.push({ pts, c, r: Rb * (0.85 + rand() * 0.3) });
      }
      // shuffle so strokes interleave
      for (let i = strokes.length - 1; i > 0; i--) { const j = (rand() * (i + 1)) | 0; const t = strokes[i]; strokes[i] = strokes[j]; strokes[j] = t; }
      const bristles = Rb >= 5;
      for (const s of strokes) {
        const jit = (v, a) => Math.max(0, Math.min(255, v + (rand() - 0.5) * a));
        const lj = (rand() - 0.5) * (opt.valueJitter || 10);
        const c = [jit(s.c[0] + lj, 8), jit(s.c[1] + lj, 8), jit(s.c[2] + lj, 8)];
        const path = new Path2D();
        const P = s.pts;
        path.moveTo(P[0][0], P[0][1]);
        if (P.length === 1) path.lineTo(P[0][0] + 0.5, P[0][1] + 0.5);
        for (let k = 1; k < P.length; k++) { const mx = (P[k - 1][0] + P[k][0]) / 2, my = (P[k - 1][1] + P[k][1]) / 2; path.quadraticCurveTo(P[k - 1][0], P[k - 1][1], mx, my); }
        if (P.length > 1) path.lineTo(P[P.length - 1][0], P[P.length - 1][1]);
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`; ctx.lineWidth = s.r; ctx.globalAlpha = 0.92; ctx.stroke(path);
        hctx.lineCap = 'round'; hctx.lineJoin = 'round';
        hctx.globalCompositeOperation = 'source-over'; hctx.globalAlpha = 0.5; hctx.strokeStyle = `rgb(${90 + rand() * 50 | 0},0,0)`; hctx.lineWidth = s.r * 0.95; hctx.stroke(path);
        if (bristles && P.length > 1) {
          // bristle streaks: thin parallel lines slightly lighter and darker than the stroke
          const nb = 4;
          for (let b = 0; b < nb; b++) {
            const off = (b / (nb - 1) - 0.5) * s.r * 0.75;
            const bp = new Path2D();
            for (let k = 0; k < P.length; k++) {
              const a = P[Math.min(P.length - 1, k + 1)], z = P[Math.max(0, k - 1)];
              const tx = a[0] - z[0], ty = a[1] - z[1], tm = Math.hypot(tx, ty) || 1;
              const px = P[k][0] - ty / tm * off, py = P[k][1] + tx / tm * off;
              k ? bp.lineTo(px, py) : bp.moveTo(px, py);
            }
            const sh = (rand() - 0.5) * 50;
            ctx.globalAlpha = 0.22; ctx.lineWidth = Math.max(0.8, s.r * 0.12);
            ctx.strokeStyle = `rgb(${jit(c[0] + sh, 6) | 0},${jit(c[1] + sh, 6) | 0},${jit(c[2] + sh, 6) | 0})`; ctx.stroke(bp);
            hctx.globalAlpha = 0.3; hctx.strokeStyle = `rgb(${140 + rand() * 60 | 0},0,0)`; hctx.lineWidth = Math.max(0.8, s.r * 0.1); hctx.stroke(bp);
          }
        }
      }
      ctx.globalAlpha = 1; hctx.globalAlpha = 1;
    }
    // impasto: light the paint height field from the upper left
    const img = ctx.getImageData(0, 0, W, H), d = img.data;
    const hd = hctx.getImageData(0, 0, W, H).data;
    const hgt = new Float32Array(W * H); for (let i = 0; i < W * H; i++) hgt[i] = hd[i * 4] / 255;
    const hs = boxBlur(hgt, W, H, 1);
    const k = opt.impasto == null ? 1.0 : opt.impasto, sat = opt.sat || 1, con = opt.contrast || 1;
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const nx = (hs[i - 1] - hs[i + 1]) * 3.0, ny = (hs[i - W] - hs[i + W]) * 3.0;
      const l = (nx * -0.6 + ny * -0.6) * k;             // light from upper left
      const spec = Math.max(0, l) * Math.max(0, l) * 40 * k;
      // canvas weave
      const weave = ((x % 4 < 2) !== (y % 4 < 2) ? 1 : -1) * 1.0;
      let r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
      const lum = 0.3 * r + 0.59 * g + 0.11 * b;
      r = lum + (r - lum) * sat; g = lum + (g - lum) * sat; b = lum + (b - lum) * sat;
      const cf = (v) => { const t = v / 255; return 255 / (1 + Math.exp(-17 * (con - 1) * (t - 0.5))); };
      const c0 = cf(0), c1 = cf(255), norm = (v) => (cf(v) - c0) / (c1 - c0) * 255;
      r = con !== 1 ? norm(r) : r; g = con !== 1 ? norm(g) : g; b = con !== 1 ? norm(b) : b;
      const px = [r, g, b];
      for (let ch = 0; ch < 3; ch++) d[i * 4 + ch] = Math.max(0, Math.min(255, px[ch] * (1 + l * 0.9) + spec + weave));
    }
    ctx.putImageData(img, 0, 0);
  };
})(typeof window !== 'undefined' ? window : globalThis);
