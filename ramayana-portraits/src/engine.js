/*
 * Ramayana Portraits — painterly brushstroke engine (plain JavaScript, Canvas 2D).
 *
 * How a painting is made:
 *   1. A scene draws a hidden "reference" image with simple shapes and bold
 *      complementary colour fields (kit.js helpers), plus a focus map (where
 *      detail matters) and an optional flow map (which way strokes travel).
 *   2. The engine paints that reference with thousands of flat-brush strokes in
 *      coarse-to-fine layers. Each stroke follows a flow field, stops at colour
 *      edges, carries bristle streaks and a jittered multicolour hue.
 *   3. Crisp linework (eyes, brows, lips, contours, jewellery glints) is laid on
 *      top with a bristle pen.
 *   4. Every stroke also writes into a height map; a final lighting pass turns it
 *      into impasto ridges, plus a little canvas weave.
 */
(function (global) {
  'use strict';
  const RP = (global.RP = global.RP || {});

  // ---------- seeded randomness ----------
  RP.rng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  RP.perlin = function (rand) {
    const p = new Uint8Array(512);
    const perm = [];
    for (let i = 0; i < 256; i++) perm.push(i);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const grad = (h, x, y) => {
      switch (h & 7) {
        case 0: return x + y; case 1: return -x + y; case 2: return x - y; case 3: return -x - y;
        case 4: return x; case 5: return -x; case 6: return y; default: return -y;
      }
    };
    return function (x, y) {
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
      x -= Math.floor(x); y -= Math.floor(y);
      const u = fade(x), v = fade(y);
      const a = p[X] + Y, b = p[X + 1] + Y;
      const l1 = grad(p[a], x, y) + u * (grad(p[b], x - 1, y) - grad(p[a], x, y));
      const l2 = grad(p[a + 1], x, y - 1) + u * (grad(p[b + 1], x - 1, y - 1) - grad(p[a + 1], x, y - 1));
      return (l1 + v * (l2 - l1)) * 0.7;
    };
  };

  // ---------- colour ----------
  RP.hex = function (h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  RP.rgb2hsl = function (r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    let h = 0, s = 0; const l = (mx + mn) / 2;
    if (mx !== mn) {
      const d = mx - mn;
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (mx === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return [h, s, l];
  };
  RP.hsl2rgb = function (h, s, l) {
    h = ((h % 1) + 1) % 1;
    if (s === 0) return [l * 255, l * 255, l * 255];
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const f = (t) => {
      t = ((t % 1) + 1) % 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
  };
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  RP.clamp = clamp;
  const css = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a == null ? 1 : a})`;
  RP.css = css;

  // ---------- geometry ----------
  // Catmull-Rom spline through points -> dense polyline
  RP.sampleCurve = function (pts, per, closed) {
    per = per || 8;
    const n = pts.length, out = [];
    if (n < 2) return pts.slice();
    const segs = closed ? n : n - 1;
    const P = (i) => (closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)]);
    for (let i = 0; i < segs; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      for (let k = 0; k < per; k++) {
        const t = k / per, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
        ]);
      }
    }
    if (!closed) out.push(pts[n - 1].slice());
    return out;
  };

  RP.smoothPath = function (pts, closed) {
    const d = RP.sampleCurve(pts, 10, closed);
    const p = new Path2D();
    p.moveTo(d[0][0], d[0][1]);
    for (let i = 1; i < d.length; i++) p.lineTo(d[i][0], d[i][1]);
    if (closed) p.closePath();
    return p;
  };

  // ribbon polygon around a polyline with width function w(t) (t in 0..1)
  function ribbon(pts, wfn) {
    const n = pts.length, L = [], R = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(i - 1, 0)], b = pts[Math.min(i + 1, n - 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1];
      const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      const w = wfn(n > 1 ? i / (n - 1) : 0.5) / 2;
      L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]);
      R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
    }
    const p = new Path2D();
    p.moveTo(L[0][0], L[0][1]);
    for (let i = 1; i < n; i++) p.lineTo(L[i][0], L[i][1]);
    for (let i = n - 1; i >= 0; i--) p.lineTo(R[i][0], R[i][1]);
    p.closePath();
    return { path: p, L, R };
  }
  function offsetLine(pts, off, t0, t1) {
    const n = pts.length, out = [];
    const i0 = Math.floor(t0 * (n - 1)), i1 = Math.ceil(t1 * (n - 1));
    for (let i = i0; i <= i1; i++) {
      const a = pts[Math.max(i - 1, 0)], b = pts[Math.min(i + 1, n - 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1];
      const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      const o = typeof off === 'function' ? off(i / (n - 1)) : off;
      out.push([pts[i][0] - dy * o, pts[i][1] + dx * o]);
    }
    return out;
  }
  function polyline(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
  }

  // ---------- the painter ----------
  RP.paint = function (scene, opts) {
    opts = opts || {};
    const W = opts.W || scene.W || 1200, H = opts.H || scene.H || 1500;
    const quality = opts.quality == null ? 1 : opts.quality;
    const rand = RP.rng(scene.seed || 7);
    const noise = RP.perlin(rand);
    const mk = () => {
      const c = document.createElement('canvas');
      c.width = W; c.height = H; return c;
    };
    const ref = mk(), rctx = ref.getContext('2d', { willReadFrequently: true });
    const foc = mk(), fctx = foc.getContext('2d', { willReadFrequently: true });
    const flw = mk(), flctx = flw.getContext('2d', { willReadFrequently: true });
    fctx.fillStyle = '#000'; fctx.fillRect(0, 0, W, H);

    const overlays = [];
    const kit = RP.makeKit({ rctx, fctx, flctx, W, H, rand, noise, overlays });
    scene.draw(kit);

    if (opts.keepRef) RP._lastRef = ref.toDataURL('image/jpeg', 0.85);
    const refD = rctx.getImageData(0, 0, W, H).data;
    const focD = fctx.getImageData(0, 0, W, H).data;
    const flD = flctx.getImageData(0, 0, W, H).data;

    // blurred luminance + gradient for contour-following strokes
    const N = W * H;
    let lum = new Float32Array(N);
    for (let i = 0; i < N; i++) lum[i] = 0.3 * refD[i * 4] + 0.59 * refD[i * 4 + 1] + 0.11 * refD[i * 4 + 2];
    lum = boxBlur(boxBlur(lum, W, H, 4), W, H, 4);
    const gx = new Float32Array(N), gy = new Float32Array(N);
    for (let y = 1; y < H - 1; y++)
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        gx[i] = lum[i + 1] - lum[i - 1];
        gy[i] = lum[i + W] - lum[i - W];
      }

    const sceneFlow = scene.flow || (() => null);
    function angleAt(x, y) {
      x = clamp(x | 0, 0, W - 1); y = clamp(y | 0, 0, H - 1);
      const i = y * W + x, j = i * 4;
      const turb = noise(x * 0.006, y * 0.006) * (scene.turbulence == null ? 0.7 : scene.turbulence);
      if (flD[j + 3] > 100) {
        return 0.5 * Math.atan2(flD[j + 1] - 128, flD[j] - 128) + turb * 0.35;
      }
      let vx = 0, vy = 0;
      const sf = sceneFlow(x, y, noise);
      const base = sf == null ? noise(x * 0.003 + 9, y * 0.003) * Math.PI * 1.5 : sf;
      vx += Math.cos(2 * base) * 0.6; vy += Math.sin(2 * base) * 0.6;
      const g = Math.hypot(gx[i], gy[i]);
      const f = focD[j] / 255;
      if (g > 0.4) {
        const a = Math.atan2(gy[i], gx[i]) + Math.PI / 2;
        const wgt = clamp(g / 4, 0, 1) * (0.4 + f);
        vx += Math.cos(2 * a) * wgt; vy += Math.sin(2 * a) * wgt;
      }
      return 0.5 * Math.atan2(vy, vx) + turb * 0.5;
    }
    const refAt = (x, y) => {
      const j = (clamp(y | 0, 0, H - 1) * W + clamp(x | 0, 0, W - 1)) * 4;
      return [refD[j], refD[j + 1], refD[j + 2]];
    };
    const focAt = (x, y) => focD[(clamp(y | 0, 0, H - 1) * W + clamp(x | 0, 0, W - 1)) * 4] / 255;
    const gradAt = (x, y) => {
      const i = clamp(y | 0, 0, H - 1) * W + clamp(x | 0, 0, W - 1);
      return Math.hypot(gx[i], gy[i]);
    };

    // output + height canvases
    const out = mk(), octx = out.getContext('2d', { willReadFrequently: true });
    const hgt = mk(), hctx = hgt.getContext('2d', { willReadFrequently: true });
    octx.fillStyle = scene.ground || '#ece4d2'; octx.fillRect(0, 0, W, H);
    hctx.fillStyle = '#7a7a7a'; hctx.fillRect(0, 0, W, H);
    octx.lineCap = hctx.lineCap = 'round';
    octx.lineJoin = hctx.lineJoin = 'round';

    const accents = (scene.accents || []).map(RP.hex);

    function jitterColor(c, L, f) {
      let [h, s, l] = RP.rgb2hsl(c[0], c[1], c[2]);
      const hj = L.hueJ * (f > 0.6 ? 0.9 : 1);
      h += (rand() - 0.5) * hj;
      s = clamp(s + (rand() - 0.5) * L.satJ + (scene.satBoost || 0.06), 0, 1);
      l = clamp(l + (rand() - 0.5) * L.lumJ, 0.02, 0.98);
      return RP.hsl2rgb(h, s, l);
    }

    function brush(x, y, L) {
      const f = focAt(x, y);
      const c0 = refAt(x, y);
      const size = L.size * (0.75 + rand() * 0.5);
      const len = L.len * (0.6 + rand() * 0.8);
      const stepLen = Math.max(size * 0.45, 2.2);
      const nSteps = clamp(Math.round(len / stepLen), 1, 16);
      // trace both directions, stop at strong colour change
      const trace = (sign) => {
        const pts = [];
        let px = x, py = y, pdx = 0, pdy = 0;
        for (let k = 0; k < nSteps / 2; k++) {
          const a = angleAt(px, py);
          let dx = Math.cos(a), dy = Math.sin(a);
          if (k === 0) { dx *= sign; dy *= sign; }
          else if (dx * pdx + dy * pdy < 0) { dx = -dx; dy = -dy; }
          const nx = px + dx * stepLen, ny = py + dy * stepLen;
          const c = refAt(nx, ny);
          const diff = Math.abs(c[0] - c0[0]) + Math.abs(c[1] - c0[1]) + Math.abs(c[2] - c0[2]);
          if (diff > L.edge) break;
          pts.push([nx, ny]); px = nx; py = ny; pdx = dx; pdy = dy;
        }
        return pts;
      };
      const fw = trace(1), bw = trace(-1).reverse();
      const pts = bw.concat([[x, y]], fw);
      if (pts.length < 2) {
        const a = angleAt(x, y);
        pts.length = 0;
        pts.push([x - Math.cos(a) * size * 0.4, y - Math.sin(a) * size * 0.4], [x + Math.cos(a) * size * 0.4, y + Math.sin(a) * size * 0.4]);
      }
      let col;
      if (accents.length && f < 0.3 && rand() < (L.accent || 0)) {
        col = jitterColor(accents[(rand() * accents.length) | 0], L, f);
      } else col = jitterColor(c0, L, f);
      drawStroke(pts, size, col, L.alpha || 0.95);
    }

    function drawStroke(rawPts, size, col, alpha) {
      const pts = rawPts.length > 2 ? RP.sampleCurve(rawPts, 3) : rawPts;
      const wfn = (t) => size * (0.72 + 0.28 * Math.min(1, t * 5, (1 - t) * 5));
      const rb = ribbon(pts, wfn);
      octx.fillStyle = css(col, alpha);
      octx.fill(rb.path);
      hctx.fillStyle = 'rgb(128,128,128)';
      hctx.fill(rb.path);
      // bristles
      const k = clamp(Math.round(size / 2.4), 2, 12);
      const [h, s, l] = RP.rgb2hsl(col[0], col[1], col[2]);
      for (let j = 0; j < k; j++) {
        const off = ((j + 0.5) / k - 0.5) * size * 0.85;
        const t0 = rand() * 0.18, t1 = 1 - rand() * 0.18;
        const line = offsetLine(pts, off, t0, t1);
        if (line.length < 2) continue;
        const dl = (rand() - 0.5) * 0.11;
        const bc = RP.hsl2rgb(h + (rand() - 0.5) * 0.02, s, clamp(l + dl, 0, 1));
        octx.strokeStyle = css(bc, 0.35);
        octx.lineWidth = Math.max(0.6, (size / k) * (0.5 + rand() * 0.6));
        polyline(octx, line);
        const g = (128 + dl * 300 + (rand() - 0.5) * 36) | 0;
        hctx.strokeStyle = `rgb(${g},${g},${g})`;
        hctx.lineWidth = octx.lineWidth;
        polyline(hctx, line);
      }
      // raised paint ridge at the stroke edge
      hctx.strokeStyle = 'rgba(220,220,220,0.8)';
      hctx.lineWidth = Math.max(0.8, size * 0.08);
      hctx.stroke(rb.path);
    }

    // brush layers, coarse to fine
    const layers = scene.layers || RP.defaultLayers;
    for (const L of layers) {
      const sp = L.size * (L.spacing || 0.62) / Math.sqrt(quality);
      const pos = [];
      for (let y = -sp; y < H + sp; y += sp)
        for (let x = -sp; x < W + sp; x += sp) {
          const px = x + (rand() - 0.5) * sp * 1.2, py = y + (rand() - 0.5) * sp * 1.2;
          const f = focAt(px, py);
          if (L.minFocus != null && f < L.minFocus) {
            if (!(L.bgChance && rand() < L.bgChance)) continue;
          }
          if (L.minGrad != null && gradAt(px, py) < L.minGrad && rand() > (L.gradKeep || 0)) continue;
          // ragged unpainted border, like the reference's linen edges
          const edge = Math.min(px, py, W - px, H - py);
          const em = scene.edge == null ? 26 : scene.edge;
          if (edge < em && rand() > (edge / em) * 0.9 + noise(px * 0.02, py * 0.02) * 0.4) continue;
          pos.push([px, py]);
        }
      for (let i = pos.length - 1; i > 0; i--) {
        const j = (rand() * (i + 1)) | 0;
        const t = pos[i]; pos[i] = pos[j]; pos[j] = t;
      }
      for (const p of pos) brush(p[0], p[1], L);
    }

    // extra gestural strokes the scene wants (wisps, flames, sparks)
    if (scene.gestures) {
      const g = (pts, size, color, alpha) => drawStroke(pts, size, RP.hex(color), alpha == null ? 0.9 : alpha);
      scene.gestures({ stroke: g, rand, noise, W, H, angleAt, refAt });
    }

    // crisp linework overlays
    const pen = RP.makePen(octx, hctx, rand, drawStroke);
    for (const fn of overlays) fn(pen);

    // impasto lighting
    shade(octx, hctx, W, H, scene.impasto == null ? 0.75 : scene.impasto, scene, noise);
    return out;
  };

  RP.defaultLayers = [
    { size: 54, len: 220, edge: 170, hueJ: 0.11, satJ: 0.25, lumJ: 0.2, accent: 0.06 },
    { size: 30, len: 160, edge: 140, hueJ: 0.1, satJ: 0.25, lumJ: 0.2, accent: 0.05, spacing: 0.8 },
    { size: 17, len: 80, edge: 110, hueJ: 0.08, satJ: 0.2, lumJ: 0.16, minFocus: 0.35, bgChance: 0.12, accent: 0.05 },
    { size: 11, len: 40, edge: 110, hueJ: 0.08, satJ: 0.18, lumJ: 0.13, minFocus: 0.6 },
    { size: 14, len: 48, edge: 150, hueJ: 0.13, satJ: 0.22, lumJ: 0.17, minFocus: 0.95, spacing: 0.85 },
    { size: 5, len: 15, edge: 60, hueJ: 0.04, satJ: 0.12, lumJ: 0.08, minFocus: 0.85, minGrad: 3.2, gradKeep: 0 },
  ];

  function boxBlur(src, W, H, r) {
    const tmp = new Float32Array(src.length), out = new Float32Array(src.length);
    const d = 2 * r + 1;
    for (let y = 0; y < H; y++) {
      let acc = 0; const row = y * W;
      for (let x = -r; x <= r; x++) acc += src[row + clamp(x, 0, W - 1)];
      for (let x = 0; x < W; x++) {
        tmp[row + x] = acc / d;
        acc += src[row + clamp(x + r + 1, 0, W - 1)] - src[row + clamp(x - r, 0, W - 1)];
      }
    }
    for (let x = 0; x < W; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += tmp[clamp(y, 0, H - 1) * W + x];
      for (let y = 0; y < H; y++) {
        out[y * W + x] = acc / d;
        acc += tmp[clamp(y + r + 1, 0, H - 1) * W + x] - tmp[clamp(y - r, 0, H - 1) * W + x];
      }
    }
    return out;
  }
  RP.boxBlur = boxBlur;

  function shade(octx, hctx, W, H, strength, scene, noise) {
    const img = octx.getImageData(0, 0, W, H), d = img.data;
    const hd = hctx.getImageData(0, 0, W, H).data;
    const N = W * H;
    let h = new Float32Array(N);
    for (let i = 0; i < N; i++) h[i] = hd[i * 4] / 255;
    h = boxBlur(h, W, H, 1);
    const Lx = -0.55, Ly = -0.65, Lz = 0.75, ll = Math.hypot(Lx, Ly, Lz);
    const lx = Lx / ll, ly = Ly / ll, lz = Lz / ll;
    const k = 3.2 * strength;
    const cx = W / 2, cy = H / 2, maxd = Math.hypot(cx, cy);
    const vig = scene.vignette == null ? 0.18 : scene.vignette;
    for (let y = 1; y < H - 1; y++)
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        const dx = (h[i + 1] - h[i - 1]) * k, dy = (h[i + W] - h[i - W]) * k;
        const nl = Math.hypot(dx, dy, 1);
        const dot = (-dx * lx - dy * ly + lz) / nl;
        let s = (dot - lz) * 1.5;
        // specular glint on ridges
        const spec = Math.pow(Math.max(0, dot), 40) * 70 * strength;
        // canvas weave
        const weave = (Math.sin(x * 1.7) * Math.sin(y * 1.7)) * 0.018;
        const dist = Math.hypot(x - cx, y - cy) / maxd;
        const v = 1 - vig * Math.pow(dist, 2.2);
        const m = (1 + s + weave) * v;
        const j = i * 4;
        d[j] = clamp(d[j] * m + spec, 0, 255);
        d[j + 1] = clamp(d[j + 1] * m + spec, 0, 255);
        d[j + 2] = clamp(d[j + 2] * m + spec, 0, 255);
      }
    octx.putImageData(img, 0, 0);
  }

  // ---------- pen for crisp painterly linework ----------
  RP.makePen = function (octx, hctx, rand, drawStroke) {
    const pen = {};
    // tapered brush line through control points
    pen.line = function (pts, o) {
      o = o || {};
      const w = o.w || 4, col = RP.hex(o.color || '#1a1030'), a = o.alpha == null ? 0.95 : o.alpha;
      const taper = o.taper == null ? 1 : o.taper;
      const passes = o.passes || 2;
      for (let p = 0; p < passes; p++) {
        const jit = (o.jitter == null ? 0.8 : o.jitter) * (p ? 1 : 0.3);
        const jp = pts.map((q) => [q[0] + (rand() - 0.5) * jit, q[1] + (rand() - 0.5) * jit]);
        const d = RP.sampleCurve(jp, 10);
        const ww = w * (p ? 0.55 : 1);
        const wfn = (t) => ww * (1 - taper + taper * Math.pow(Math.sin(Math.PI * clamp(t * 0.92 + 0.04, 0, 1)), 0.6));
        const rb = ribbon(d, wfn);
        const [h, s, l] = RP.rgb2hsl(col[0], col[1], col[2]);
        const c = p ? RP.hsl2rgb(h, s, clamp(l + (rand() - 0.5) * 0.15, 0, 1)) : col;
        octx.fillStyle = css(c, a * (p ? 0.6 : 1));
        octx.fill(rb.path);
        hctx.fillStyle = `rgb(${150 + p * 30},${150 + p * 30},${150 + p * 30})`;
        hctx.fill(rb.path);
      }
    };
    pen.fill = function (path, color, alpha) {
      octx.fillStyle = typeof color === 'string' && color[0] === '#' ? css(RP.hex(color), alpha == null ? 1 : alpha) : color;
      octx.fill(path);
      hctx.fillStyle = 'rgb(140,140,140)';
      hctx.fill(path);
    };
    // painterly dab: a few short loaded strokes
    pen.dab = function (x, y, r, color, alpha) {
      const c = RP.hex(color);
      if (r > 6 && drawStroke) {
        const [h, s, l] = RP.rgb2hsl(c[0], c[1], c[2]);
        const n = 2 + ((r / 8) | 0);
        for (let k = 0; k < Math.min(n, 5); k++) {
          const a = rand() * Math.PI, rr = r * (0.5 + rand() * 0.5);
          const ox = (rand() - 0.5) * r * 0.6, oy = (rand() - 0.5) * r * 0.6;
          const cc = RP.hsl2rgb(h + (rand() - 0.5) * 0.03, s, clamp(l + (rand() - 0.5) * 0.14, 0, 1));
          drawStroke([[x + ox - Math.cos(a) * rr, y + oy - Math.sin(a) * rr], [x + ox + Math.cos(a) * rr, y + oy + Math.sin(a) * rr]], r * 1.1, cc, alpha == null ? 0.95 : alpha);
        }
        return;
      }
      octx.fillStyle = css(c, alpha == null ? 1 : alpha);
      octx.beginPath(); octx.ellipse(x, y, r, r * (0.7 + rand() * 0.3), rand() * 3, 0, Math.PI * 2); octx.fill();
      hctx.fillStyle = 'rgb(200,200,200)';
      hctx.beginPath(); hctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2); hctx.fill();
    };
    // a cluster of short multicolour strokes (for hair wisps, beards, fur, flames)
    pen.wisps = function (pts, o) {
      pen.line(pts, o);
    };
    pen.octx = octx; pen.hctx = hctx; pen.rand = rand;
    return pen;
  };
})(typeof window !== 'undefined' ? window : globalThis);
