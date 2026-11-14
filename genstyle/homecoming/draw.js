/* HOMECOMING — the night Ayodhya lit its lamps.
   One drawing, made only with JavaScript. No canvas API, no SVG, no images: every mark is a simulated dry tool
   dragged across simulated paper tooth, one dab of pigment at a time.

   Tools on the table:
     1. soft pastel        broad, chalky, opaque; laid on its side for the sky and smudged with a finger
     2. wax colour pencil  thin, transparent, layered in hatches; colours mix by glazing over each other
     3. indigo pencil      the drawing line: wobbly, restated, heavier where the hand slows
     4. white chalk pencil highlights, lamp flames, stars
     5. paper stump        drags pigment that is already down

   node genstyle/homecoming/draw.js [scale] [out.png]     scale 1 = 1920x1080, 2 = 3840x2160 (default 2) */
'use strict';
(function (root) {
  function makeArt(S, log) {
    const W = Math.round(1920 * S), H = Math.round(1080 * S), N = W * H;
    const C = new Float32Array(N * 3), tooth = new Float32Array(N), wax = new Float32Array(N), reserve = new Uint8Array(N);
    log = log || function () {};

    // ---------- randomness & noise ----------
    let seed = 20261114;
    const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const rr = (a, b) => a + (b - a) * rnd(), ri = (a, b) => Math.floor(rr(a, b + 1)), pick = (a) => a[Math.floor(rnd() * a.length)];
    const hash = (x, y, s) => { let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 2147483647); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
    const vn = (x, y, s) => { const xi = Math.floor(x), yi = Math.floor(y); let fx = x - xi, fy = y - yi; fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s); return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy; };
    const n1 = (t, s) => vn(t, s * 17.3, s) * 2 - 1;
    const clamp = (v, a, b) => (v < a ? a : v > b ? b : v), lerp = (a, b, t) => a + (b - a) * t;
    const TAU = Math.PI * 2;

    // ---------- colour ----------
    const hex = (h) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
    const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    const jit = (c, k) => [clamp(c[0] + rr(-k, k), 0, 1), clamp(c[1] + rr(-k, k), 0, 1), clamp(c[2] + rr(-k, k), 0, 1)];
    const grad = (stops, t) => { if (t <= stops[0][0]) return stops[0][1]; for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) return mixc(stops[i - 1][1], stops[i][1], (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0])); return stops[stops.length - 1][1]; };
    const K = {}; // the pencil box
    Object.entries({
      paper: '#f6efdc', indigo: '#1a1848', night: '#221f66', ultra: '#2f36a8', cobalt: '#2b55d4', violet: '#5b3fae', grape: '#7a4fc4', lav: '#a593e0', lilac: '#cbb8f0',
      magenta: '#c43a98', rose: '#ee5a8e', pink: '#ff8fb0', blush: '#ffc2cf', peach: '#ffb07c', apricot: '#ffcf96', lemon: '#ffe680', cream: '#fff4c8', white: '#fffdf2',
      gold: '#f2b327', amber: '#f08a1c', marigold: '#ff9a10', flame: '#ff5a1e', red: '#d6242e', crimson: '#a3163a', wine: '#6a1440',
      teal: '#0f8f95', aqua: '#3fc8c0', mint: '#9be3c8', sea: '#16607e', emerald: '#12915a', leaf: '#3bb24a', lime: '#b4d94a', moss: '#3d6b3c',
      umber: '#5a3524', sienna: '#a2542c', sand: '#e6c08c', stone: '#d98fa0', slate: '#4a4f7a', grey: '#9a96aa', black: '#15122e',
    }).forEach(([k, v]) => (K[k] = hex(v)));

    // ---------- paper ----------
    function paper() {
      const g = Math.max(1, S / 2);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const t = 0.46 * vn(x / (1.25 * g), y / (1.25 * g), 1) + 0.3 * vn(x / (2.9 * g), y / (2.9 * g), 2) + 0.16 * vn(x / (7.5 * g), y / (7.5 * g), 3) + 0.08 * vn(x / (40 * g), y / (5 * g), 4);
        tooth[i] = clamp((t - 0.5) * 1.9 + 0.5, 0, 1);
        const v = 1 + (vn(x / (220 * g), y / (220 * g), 5) - 0.5) * 0.035 + (vn(x / (2 * g), y / (60 * g), 6) - 0.5) * 0.012 - (1 - tooth[i]) * 0.03;
        C[i * 3] = K.paper[0] * v; C[i * 3 + 1] = K.paper[1] * v; C[i * 3 + 2] = K.paper[2] * v * 0.995;
      }
    }

    // ---------- the tools ----------
    const T = {
      pencil: { r: 0.9, flow: 0.5, op: 0.1, thresh: 0.8, bite: 0.66, sharp: 3.2, fill: 0.55, wax: 0.3, hard: 1.6 },
      blunt: { r: 1.7, flow: 0.42, op: 0.12, thresh: 0.8, bite: 0.62, sharp: 2.8, fill: 0.55, wax: 0.3, hard: 1.2 },
      liner: { r: 0.72, flow: 0.8, op: 0.5, thresh: 0.66, bite: 0.6, sharp: 3.4, fill: 0.4, wax: 0.2, hard: 1.8 },
      pastel: { r: 14, flow: 0.36, op: 0.9, thresh: 0.43, bite: 0.6, sharp: 2.3, fill: 0.5, wax: 0.4, hard: 0.55 },
      chalk: { r: 1.0, flow: 0.9, op: 0.94, thresh: 0.62, bite: 0.62, sharp: 3, fill: 0.3, wax: 0.2, hard: 1.5 },
    };
    // one touch of a tool on the paper. Pigment catches on the peaks of the tooth first; pressure and built-up wax push it into the valleys.
    function dab(cx, cy, r, col, press, tool, z, clip) {
      const x0 = Math.max(0, Math.floor(cx - r)), x1 = Math.min(W - 1, Math.ceil(cx + r)), y0 = Math.max(0, Math.floor(cy - r)), y1 = Math.min(H - 1, Math.ceil(cy + r));
      const r2 = r * r, ir = 1 / Math.max(r, 0.5), op = tool.op, c0 = col[0], c1 = col[1], c2 = col[2], zz = z == null ? 255 : z;
      const base = press * tool.bite - tool.thresh, fl = press * tool.flow;
      for (let y = y0; y <= y1; y++) {
        const dy = y + 0.5 - cy; let i = y * W + x0;
        for (let x = x0; x <= x1; x++, i++) {
          const dx = x + 0.5 - cx, d2 = dx * dx + dy * dy; if (d2 > r2) continue;
          if (reserve[i] > zz || (clip && !clip[i])) continue;
          let k = (tooth[i] + base + wax[i] * tool.fill) * tool.sharp; if (k <= 0) continue; if (k > 1) k = 1;
          let f = (1 - Math.sqrt(d2) * ir) * tool.hard; if (f > 1) f = 1;
          const a = fl * f * k; if (a < 0.004) continue;
          const j = i * 3, p0 = C[j], p1 = C[j + 1], p2 = C[j + 2];
          C[j] = p0 + (op * c0 + (1 - op) * p0 * c0 - p0) * a; C[j + 1] = p1 + (op * c1 + (1 - op) * p1 * c1 - p1) * a; C[j + 2] = p2 + (op * c2 + (1 - op) * p2 * c2 - p2) * a;
          wax[i] = Math.min(1, wax[i] + a * tool.wax);
        }
      }
    }
    // a stroke through points (drawing units). The hand trembles, presses unevenly, and lifts at the ends.
    function stroke(pts, tool, col, o) {
      o = o || {}; const r = tool.r * S * (o.r || 1), step = Math.max(0.6, r * (o.step || 0.4)), wob = (o.wob == null ? 0.5 : o.wob) * S, sd = rnd() * 1000, p = o.p == null ? 0.6 : o.p;
      let total = 0; const L = [0]; for (let i = 1; i < pts.length; i++) { total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) * S; L.push(total); }
      if (total < 0.01) { dab(pts[0][0] * S, pts[0][1] * S, r, col, p, tool, o.z, o.clip); return; }
      const tin = o.tin == null ? 0.12 : o.tin, tout = o.tout == null ? 0.18 : o.tout;
      let seg = 1;
      for (let s = 0; s <= total; s += step) {
        while (seg < pts.length - 1 && L[seg] < s) seg++;
        const a = pts[seg - 1], b = pts[seg], u = (s - L[seg - 1]) / Math.max(1e-6, L[seg] - L[seg - 1]);
        let x = (a[0] + (b[0] - a[0]) * u) * S, y = (a[1] + (b[1] - a[1]) * u) * S;
        const tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1, w = n1(s / (26 * S), sd) * wob;
        x += (-ty / tl) * w; y += (tx / tl) * w;
        const t = s / total, env = Math.min(1, t / tin + 0.25, (1 - t) / tout + 0.2);
        dab(x, y, r * (o.rv ? 1 + n1(s / (40 * S), sd + 5) * o.rv : 1), col, p * env * (1 + n1(s / (14 * S), sd + 9) * (o.pj == null ? 0.25 : o.pj)), tool, o.z, o.clip);
      }
    }
    // the drawing line: struck once firmly, then lightly restated a hair off, the way a hand finds an edge
    function line(pts, col, o) {
      o = o || {}; const tool = o.tool || T.liner, c = col || K.indigo, n = pts.length, runs = []; let cur = [pts[0]];
      for (let i = 1; i < n; i++) { cur.push(pts[i]); if (i < n - 1) { const ax = pts[i][0] - pts[i - 1][0], ay = pts[i][1] - pts[i - 1][1], bx = pts[i + 1][0] - pts[i][0], by = pts[i + 1][1] - pts[i][1]; let d = Math.abs(Math.atan2(ax * by - ay * bx, ax * bx + ay * by)); if (d > 0.75) { runs.push(cur); cur = [pts[i]]; } } }
      runs.push(cur);
      runs.forEach((run) => {
        if (run.length < 2) return; let q = run;
        if (runs.length > 1) { // at a corner the pencil runs on a little past the turn, and each side is its own stroke
          const ext = (a, b, e) => { const dx = a[0] - b[0], dy = a[1] - b[1], l = Math.hypot(dx, dy) || 1; return [a[0] + (dx / l) * e, a[1] + (dy / l) * e]; }, jx = rr(-0.45, 0.45), jy = rr(-0.45, 0.45), L = run.length;
          q = run.map((p) => [p[0] + jx, p[1] + jy]); q[0] = ext(q[0], q[1], rr(-0.5, 2.4)); q[L - 1] = ext(q[L - 1], q[L - 2], rr(-0.5, 2.4));
        }
        stroke(q, tool, c, Object.assign({ p: 0.62, wob: 0.9 }, o));
        if (o.twice !== false && rnd() < (o.re == null ? 0.7 : o.re)) { const dx = rr(-0.8, 0.8), dy = rr(-0.8, 0.8); stroke(q.map((p) => [p[0] + dx, p[1] + dy]), tool, c, Object.assign({ wob: 1.1 }, o, { p: (o.p || 0.62) * 0.45 })); }
      });
    }
    // finger / stump: drags what is already there along the path
    function smudge(pts, r, strength, z, clip) {
      r *= S; let carry = null; const step = Math.max(1, r * 0.3);
      for (let k = 1; k < pts.length; k++) {
        const ax = pts[k - 1][0] * S, ay = pts[k - 1][1] * S, bx = pts[k][0] * S, by = pts[k][1] * S, len = Math.hypot(bx - ax, by - ay);
        for (let s = 0; s < len; s += step) {
          const cx = ax + ((bx - ax) * s) / len, cy = ay + ((by - ay) * s) / len;
          const x0 = Math.max(0, Math.floor(cx - r)), x1 = Math.min(W - 1, Math.ceil(cx + r)), y0 = Math.max(0, Math.floor(cy - r)), y1 = Math.min(H - 1, Math.ceil(cy + r));
          let s0 = 0, s1 = 0, s2 = 0, cnt = 0; const st = Math.max(1, Math.floor(r / 3));
          for (let y = y0; y <= y1; y += st) for (let x = x0; x <= x1; x += st) { const i = (y * W + x); if (reserve[i] > z || (clip && !clip[i])) continue; s0 += C[i * 3]; s1 += C[i * 3 + 1]; s2 += C[i * 3 + 2]; cnt++; }
          if (!cnt) continue; const avg = [s0 / cnt, s1 / cnt, s2 / cnt];
          carry = carry ? mixc(carry, avg, 0.22) : avg;
          const r2 = r * r;
          for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
            const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d2 = dx * dx + dy * dy; if (d2 > r2) continue; const i = y * W + x; if (reserve[i] > z || (clip && !clip[i])) continue;
            const f = 1 - d2 / r2, a = strength * f * f * (0.55 + 0.45 * tooth[i]), j = i * 3;
            C[j] += (carry[0] - C[j]) * a; C[j + 1] += (carry[1] - C[j + 1]) * a; C[j + 2] += (carry[2] - C[j + 2]) * a;
          }
        }
      }
    }
    // pastel dust rubbed in with a fingertip: a soft bloom of light
    function glow(x, y, r, col, a, z) {
      x *= S; y *= S; r *= S; const x0 = Math.max(0, Math.floor(x - r)), x1 = Math.min(W - 1, Math.ceil(x + r)), y0 = Math.max(0, Math.floor(y - r)), y1 = Math.min(H - 1, Math.ceil(y + r)), r2 = r * r, zz = z == null ? 255 : z;
      for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) {
        const dx = xx + 0.5 - x, dy = yy + 0.5 - y, d2 = dx * dx + dy * dy; if (d2 > r2) continue; const i = yy * W + xx; if (reserve[i] > zz) continue;
        let f = 1 - d2 / r2; f = f * f * a * (0.5 + 0.5 * tooth[i]); const j = i * 3;
        C[j] += (col[0] - C[j]) * f; C[j + 1] += (col[1] - C[j + 1]) * f; C[j + 2] += (col[2] - C[j + 2]) * f;
      }
    }

    // ---------- shapes: the pencil plan under the picture ----------
    function Mask() { this.m = new Uint8Array(N); this.x0 = W; this.y0 = H; this.x1 = -1; this.y1 = -1; }
    Mask.prototype.clear = function () { if (this.x1 >= this.x0) for (let y = this.y0; y <= this.y1; y++) this.m.fill(0, y * W + this.x0, y * W + this.x1 + 1); this.x0 = W; this.y0 = H; this.x1 = -1; this.y1 = -1; return this; };
    function spans(pts, cb) {
      let ymin = 1e9, ymax = -1e9; const n = pts.length; for (let i = 0; i < n; i++) { const y = pts[i][1] * S; if (y < ymin) ymin = y; if (y > ymax) ymax = y; }
      const ya = Math.max(0, Math.floor(ymin)), yb = Math.min(H - 1, Math.ceil(ymax)), xs = [];
      for (let y = ya; y <= yb; y++) {
        const yc = y + 0.5; xs.length = 0;
        for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], y0 = a[1] * S, y1 = b[1] * S; if ((y0 <= yc && y1 > yc) || (y1 <= yc && y0 > yc)) xs.push(a[0] * S + ((yc - y0) / (y1 - y0)) * (b[0] - a[0]) * S); }
        xs.sort((p, q) => p - q);
        for (let k = 0; k + 1 < xs.length; k += 2) { const xa = Math.max(0, Math.ceil(xs[k] - 0.5)), xb = Math.min(W - 1, Math.floor(xs[k + 1] - 0.5)); if (xb >= xa) cb(y, xa, xb); }
      }
    }
    // no edge is ever followed exactly: the plan is redrawn a little differently each time a shape is filled
    function wobP(pts, amp) { const o = [], n = pts.length, sd = rnd() * 1000; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let i = 0; i < n; i++) { x0 = Math.min(x0, pts[i][0]); x1 = Math.max(x1, pts[i][0]); y0 = Math.min(y0, pts[i][1]); y1 = Math.max(y1, pts[i][1]); } amp = Math.min(amp, Math.min(x1 - x0, y1 - y0) * 0.06); if (amp < 0.08) return pts; let acc = 0; for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); if (L < 1e-6) continue; const st = Math.max(1, Math.ceil(L / 9)); for (let k = 0; k < st; k++) { const t = k / st, w = n1((acc + L * t) / 24, sd) * amp; o.push([a[0] + dx * t - (dy / L) * w, a[1] + dy * t + (dx / L) * w]); } acc += L; } return o; }
    Mask.prototype.add = function (pts) { const me = this; pts = wobP(pts, 0.75); spans(pts, (y, a, b) => { me.m.fill(1, y * W + a, y * W + b + 1); if (a < me.x0) me.x0 = a; if (b > me.x1) me.x1 = b; if (y < me.y0) me.y0 = y; if (y > me.y1) me.y1 = y; }); return this; };
    Mask.prototype.sub = function (pts) { const me = this; pts = wobP(pts, 0.75); spans(pts, (y, a, b) => me.m.fill(0, y * W + a, y * W + b + 1)); return this; };
    Mask.prototype.set = function (...polys) { this.clear(); polys.forEach((p) => this.add(p)); return this; };
    const MA = new Mask(), MB = new Mask();
    const claim = (pts, z) => spans(pts, (y, a, b) => { for (let i = y * W + a, e = y * W + b; i <= e; i++) if (reserve[i] < z) reserve[i] = z; });

    const ell = (cx, cy, rx, ry, n, a0, a1) => { const o = []; n = n || 40; a0 = a0 || 0; a1 = a1 == null ? TAU : a1; for (let i = 0; i < n; i++) { const a = a0 + ((a1 - a0) * i) / (a1 - a0 >= TAU - 1e-6 ? n : n - 1); o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };
    const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    const smooth = (P, closed, sub) => { const o = [], L = P.length, g = (i) => (closed ? P[(i + L) % L] : P[clamp(i, 0, L - 1)]); sub = sub || 8; for (let i = 0; i < (closed ? L : L - 1); i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); for (let k = 0; k < sub; k++) { const t = k / sub, t2 = t * t, t3 = t2 * t; o.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3), 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]); } } if (!closed) o.push(P[L - 1]); return o; };
    const tf = (pts, x, y, s, rot, fx) => { const c = Math.cos(rot || 0), sn = Math.sin(rot || 0); s = s == null ? 1 : s; return pts.map((p) => { const px = p[0] * s * (fx || 1), py = p[1] * s; return [x + px * c - py * sn, y + px * sn + py * c]; }); };
    const closeP = (p) => p.concat([p[0]]);
    // pointed arch
    const arch = (x, y, w, h) => { const o = [[x, y]], sh = Math.min(h * 0.5, w * 0.7); o.push([x, y - h + sh]); for (let i = 0; i <= 8; i++) { const t = i / 8, a = Math.PI * (1 - t); o.push([x + w / 2 + (Math.cos(a) * w) / 2, y - h + sh - Math.sin(a) * sh * (0.8 + 0.2 * Math.sin(a))]); } o.push([x + w, y]); return o; };
    const onion = (cx, cy, r, tall) => { const k = ((tall || 1.25) + 0.45) / 1.85, prof = [[0.66, 0], [0.96, -0.24], [1.02, -0.56], [0.84, -0.9], [0.5, -1.16], [0.2, -1.36], [0.07, -1.6], [0, -1.85]], R = prof.map((p) => [cx + p[0] * r, cy + p[1] * r * k]), Lf = prof.slice(0, -1).reverse().map((p) => [cx - p[0] * r, cy + p[1] * r * k]); return smooth(R.concat(Lf), true, 3); };

    // ---------- ways of filling a shape by hand ----------
    // parallel hatching: short strokes, each a little different, breaking and restarting across the shape
    function hatch(M, tool, col, o) {
      if (M.x1 < M.x0) return; o = o || {};
      const ang = (o.ang || 0) + rr(-1, 1) * (o.aj == null ? 0.05 : o.aj), dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx;
      const cx = (M.x0 + M.x1) / 2, cy = (M.y0 + M.y1) / 2, D = Math.hypot(M.x1 - M.x0, M.y1 - M.y0) / 2 + 2;
      const sp = (o.sp || 2) * S, la = (o.len ? o.len[0] : 26) * S, lb = (o.len ? o.len[1] : 70) * S, r = tool.r * S * (o.r || 1), step = Math.max(0.7, r * 0.45), m = M.m, spill = (o.spill == null ? 0.7 : o.spill) * S, p = o.p == null ? 0.5 : o.p, clip = o.clip ? m : null;
      for (let off = -D; off < D; off += sp * rr(0.5, 1.5)) {
        let t = -D + rr(0, step * 3);
        while (t < D) {
          const x = cx + nx * off + dx * t, y = cy + ny * off + dy * t, ix = x | 0, iy = y | 0;
          if (ix < M.x0 || ix > M.x1 || iy < M.y0 || iy > M.y1 || !m[iy * W + ix]) { t += step * 1.6; continue; }
          const Ls = rr(la, lb), cv = (rr(-1, 1) * (o.curve == null ? 0.0016 : o.curve)) / S, da = rr(-1, 1) * (o.sj == null ? 0.045 : o.sj), sdx = Math.cos(ang + da), sdy = Math.sin(ang + da), p0 = p * rr(0.7, 1.25), c2 = o.cj ? jit(col, o.cj) : col;
          let s = 0, out = 0;
          while (s < Ls) {
            const u = s / Ls, env = Math.min(1, u * 7 + 0.3, (1 - u) * 5 + 0.2), px = x + sdx * s - sdy * cv * s * s, py = y + sdy * s + sdx * cv * s * s, jx = px | 0, jy = py | 0;
            if (jx < 0 || jy < 0 || jx >= W || jy >= H) break;
            if (!m[jy * W + jx]) { out += step; if (out > spill) break; } else out = 0;
            dab(px, py, r, c2, p0 * env, tool, o.z, clip); s += step;
          }
          t += Math.max(step, s * rr(0.8, 1.02));
        }
      }
    }
    // loose rubbing with the side of a pastel inside a shape
    function scumble(M, col, o) {
      if (M.x1 < M.x0) return; o = o || {}; const tool = o.tool || T.pastel, r = tool.r * (o.r || 1), area = (M.x1 - M.x0) * (M.y1 - M.y0) / (S * S), cnt = Math.ceil((area / (r * r)) * (o.d || 1.4));
      for (let k = 0; k < cnt; k++) {
        const x = rr(M.x0, M.x1), y = rr(M.y0, M.y1); if (!M.m[(y | 0) * W + (x | 0)]) continue;
        const a = (o.ang == null ? rr(0, TAU) : o.ang + rr(-0.5, 0.5)), L = r * rr(1.5, 4) * (o.len || 1);
        stroke([[x / S, y / S], [x / S + Math.cos(a) * L, y / S + Math.sin(a) * L]], tool, o.cj ? jit(col, o.cj) : col, { p: (o.p || 0.6) * rr(0.7, 1.2), r: (o.r || 1) * rr(0.7, 1.2), z: o.z, clip: M.m, wob: 1.2, step: 0.3 });
      }
    }
    // colour a shape the way a careful hand does: a soft ground, two or three hatch layers in different colours and directions, then the line
    function colour(polys, layers, o) {
      o = o || {}; MA.set(...polys); if (o.cut) o.cut.forEach((c) => MA.sub(c));
      layers.forEach((L) => { if (L.pastel) scumble(MA, L.c, { p: L.p, r: L.r, z: o.z, d: L.d, ang: L.ang, cj: L.cj }); else hatch(MA, L.tool || T.pencil, L.c, { ang: L.ang, sp: L.sp, p: L.p, len: L.len, z: o.z, cj: L.cj == null ? 0.02 : L.cj, r: L.r, curve: L.curve }); });
      if (o.line !== false) polys.forEach((p) => line(closeP(p), o.lc || K.indigo, { z: o.z, p: o.lp || 0.55, wob: o.wob }));
    }

    // ============================================================ THE PICTURE ============================================================
    const Z = { sky: 1, trail: 2, cloud: 3, vimana: 6, far: 8, mid: 9, near: 10, river: 7, rail: 20, floor: 18, obj: 24, pillar: 30, toran: 34, bird: 36 };
    const steps = [];
    const HORIZON = 652;

    // ---- sky: pastel laid in long sideways strokes, rubbed, then pencilled over ----
    const SKY = [[0, hex('#15133f')], [110, hex('#1f1d6e')], [230, hex('#3a2f9c')], [330, hex('#6a3bb0')], [420, hex('#b03fa4')], [500, hex('#ee5f93')], [565, hex('#ff9a78')], [615, hex('#ffcf82')], [660, hex('#fff0b8')]];
    steps.push(['sky', () => {
      for (let pass = 0; pass < 3; pass++) for (let y = -10; y < HORIZON + 16; y += 7) {
        const nS = 5 + ri(0, 3);
        for (let k = 0; k < nS; k++) {
          const x0 = rr(-200, 1700), len = rr(380, 1100), yy = y + rr(-9, 9), tilt = rr(-0.035, 0.02), pts = [];
          for (let i = 0; i <= 8; i++) pts.push([x0 + (len * i) / 8, yy + tilt * ((len * i) / 8) + Math.sin(i * 0.9 + k) * 3]);
          stroke(pts, T.pastel, jit(grad(SKY, yy + rr(-22, 22)), 0.035), { p: rr(0.5, 0.95), r: rr(0.8, 1.5), z: Z.sky, wob: 3, step: 0.3 });
        }
      }
      for (let k = 0; k < 150; k++) { const y = rr(0, HORIZON), x = rr(-100, 1700); smudge([[x, y], [x + rr(200, 520), y + rr(-12, 12)]], rr(16, 34), 0.35, Z.sky); }
      // pencil worked over the pastel: ultramarine high up, magenta in the middle, a little orange low down
      MA.set(rect(0, 0, 1920, 300)); hatch(MA, T.blunt, K.ultra, { ang: -0.5, sp: 3.2, p: 0.5, len: [40, 120], z: Z.sky }); hatch(MA, T.pencil, K.indigo, { ang: 0.35, sp: 4.5, p: 0.45, len: [30, 90], z: Z.sky });
      MA.set(rect(0, 250, 1920, 240)); hatch(MA, T.blunt, K.magenta, { ang: -0.42, sp: 4.2, p: 0.36, len: [40, 110], z: Z.sky }); hatch(MA, T.pencil, K.violet, { ang: 0.5, sp: 5, p: 0.34, len: [30, 80], z: Z.sky });
      MA.set(rect(0, 470, 1920, 190)); hatch(MA, T.blunt, K.flame, { ang: -0.2, sp: 5.5, p: 0.26, len: [40, 120], z: Z.sky }); hatch(MA, T.pencil, K.rose, { ang: 0.3, sp: 6, p: 0.3, len: [30, 90], z: Z.sky });
      // stars: chalk dots, the big ones with a four-point flare
      for (let k = 0; k < 420; k++) { const y = Math.pow(rnd(), 1.8) * 400, x = rr(0, 1920), b = rnd(); stroke([[x, y]], T.chalk, b > 0.8 ? K.cream : K.lilac, { p: rr(0.5, 1), r: b > 0.93 ? 1.7 : rr(0.6, 1.1), z: Z.sky }); if (b > 0.955) { const L = rr(5, 11); stroke([[x - L, y], [x + L, y]], T.chalk, K.white, { p: 0.55, r: 0.6, z: Z.sky, tin: 0.5, tout: 0.5, wob: 0 }); stroke([[x, y - L], [x, y + L]], T.chalk, K.white, { p: 0.55, r: 0.6, z: Z.sky, tin: 0.5, tout: 0.5, wob: 0 }); glow(x, y, 9, K.lilac, 0.35, Z.sky); } }
    }]);

    // ---- clouds: masses of lobes, shaded as if they were round, then drawn in four flat tones the way a cel painter would ----
    const scr = new Float32Array(N), scr2 = new Float32Array(N);
    function relief(lobes, lx, ly, lz) {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; lobes.forEach((c) => { const q = c[3] || 1; x0 = Math.min(x0, c[0] - c[2]); x1 = Math.max(x1, c[0] + c[2]); y0 = Math.min(y0, c[1] - c[2] * q); y1 = Math.max(y1, c[1] + c[2] * q); });
      const bb = [Math.max(1, Math.floor(x0 * S)), Math.max(1, Math.floor(y0 * S)), Math.min(W - 2, Math.ceil(x1 * S)), Math.min(H - 2, Math.ceil(y1 * S))], kk = 0.07;
      // a soft union of the lobes makes one continuous surface, so the light models the whole mass and not each ball
      for (let y = bb[1] - 1; y <= bb[3] + 1; y++) for (let x = bb[0] - 1; x <= bb[2] + 1; x++) {
        let sum = 0, inside = false; const ux = (x + 0.5) / S, uy = (y + 0.5) / S;
        for (let k = 0; k < lobes.length; k++) { const c = lobes[k], q = c[3] || 1, ex = (ux - c[0]) / c[2], ey = (uy - c[1]) / (c[2] * q), d = ex * ex + ey * ey; if (d < 1) { inside = true; sum += Math.exp(kk * ((1 - d) * c[2] * (0.55 + 0.45 * q) + (c[4] || 0) * (1 - d))) - 1; } }
        scr2[y * W + x] = inside ? Math.log(1 + sum) / kk : -1;
      }
      for (let y = bb[1]; y <= bb[3]; y++) for (let x = bb[0]; x <= bb[2]; x++) {
        const i = y * W + x, h = scr2[i]; if (h < 0) { scr[i] = -99; continue; }
        const hl = Math.max(0, scr2[i - 1]), hr = Math.max(0, scr2[i + 1]), hu = Math.max(0, scr2[i - W]), hd = Math.max(0, scr2[i + W]);
        const gx = -(hr - hl) * S * 0.31, gy = -(hd - hu) * S * 0.31, il = 1 / Math.sqrt(gx * gx + gy * gy + 1);
        scr[i] = (gx * lx + gy * ly + lz) * il;
      }
      return bb;
    }
    function band(M, bb, lo, hi) { M.clear(); let any = false; for (let y = bb[1]; y <= bb[3]; y++) for (let x = bb[0]; x <= bb[2]; x++) { const v = scr[y * W + x]; if (v >= lo && v < hi) { M.m[y * W + x] = 1; any = true; } } if (any) { M.x0 = bb[0]; M.y0 = bb[1]; M.x1 = bb[2]; M.y1 = bb[3]; } return M; }
    const clouds = [];
    function cloud(lobes, tone) { clouds.push({ lobes, tone }); lobes.forEach((c) => claim(ell(c[0], c[1], c[2], c[2] * (c[3] || 1), 36), Z.cloud)); }
    { // the great thunderhead on the left: a few big masses, then cauliflower detail budded along them
      const L = [];
      const big = [[470, 500, 150, 0.5], [330, 512, 120, 0.46], [620, 520, 110, 0.42], [230, 530, 80, 0.4], [720, 534, 70, 0.36], [450, 410, 130, 0.8], [350, 440, 96, 0.8], [560, 445, 96, 0.78], [470, 310, 104, 0.9], [395, 345, 78, 0.9], [545, 350, 72, 0.9], [490, 225, 78, 0.95], [432, 262, 56, 0.95], [540, 268, 50, 0.95], [505, 160, 50, 1], [468, 190, 40, 1]];
      big.forEach((c) => L.push(c));
      big.forEach((c, i) => { const n = 3 + (i % 3); for (let k = 0; k < n; k++) { const a = rr(Math.PI * 0.9, Math.PI * 2.1), r = c[2] * rr(0.28, 0.5); L.push([c[0] + Math.cos(a) * c[2] * 0.82, c[1] + Math.sin(a) * c[2] * c[3] * 0.82, r, Math.min(1, c[3] * 1.15), 8]); } });
      cloud(L, 'tower');
      const puff = (x, y, s, tone) => { const P = [[x, y, 50 * s, 0.55], [x - 58 * s, y + 8 * s, 38 * s, 0.5], [x + 60 * s, y + 6 * s, 42 * s, 0.5], [x - 14 * s, y - 24 * s, 34 * s, 0.85], [x + 26 * s, y - 20 * s, 28 * s, 0.85], [x - 96 * s, y + 14 * s, 22 * s, 0.5], [x + 104 * s, y + 12 * s, 24 * s, 0.5]]; cloud(P, tone); };
      puff(1640, 150, 1.25, 'puff'); puff(210, 190, 0.9, 'puff'); puff(1130, 108, 0.62, 'puff'); puff(1560, 440, 1.5, 'bank2'); puff(840, 150, 0.4, 'puff');
    }
    steps.push(['clouds', () => {
      const TONES = { tower: [K.grape, K.lav, K.lilac, K.pink, K.apricot, K.cream], bank2: [K.violet, K.magenta, K.rose, K.pink, K.apricot, K.cream], puff: [K.grape, K.lav, K.lilac, K.pink, K.blush, K.cream] };
      clouds.forEach((cl) => {
        const tn = TONES[cl.tone], bb = relief(cl.lobes, 0.46, 0.66, 0.6), big = cl.tone === 'tower';
        const lv = [[-9, 0.2], [0.2, 0.46], [0.46, 0.68], [0.68, 0.82], [0.82, 0.93], [0.93, 9]];
        lv.forEach((b, i) => { band(MB, bb, b[0], b[1]); scumble(MB, tn[i], { p: 0.95, r: big ? 0.5 : 0.34, z: Z.cloud, d: 3.2, cj: 0.02 }); scumble(MB, tn[i], { p: 0.8, r: 0.26, z: Z.cloud, d: 2.2 }); });
        band(MB, bb, -9, 0.46); hatch(MB, T.blunt, K.ultra, { ang: -0.95, sp: 3.6, p: 0.42, len: [10, 34], z: Z.cloud, clip: 1 }); hatch(MB, T.pencil, K.magenta, { ang: 0.3, sp: 4.5, p: 0.36, len: [8, 26], z: Z.cloud, clip: 1 });
        band(MB, bb, 0.46, 0.82); hatch(MB, T.pencil, K.rose, { ang: -0.6, sp: 4.2, p: 0.34, len: [10, 30], z: Z.cloud, clip: 1 });
        band(MB, bb, 0.62, 9); hatch(MB, T.pencil, K.amber, { ang: 0.5, sp: 5, p: 0.3, len: [8, 26], z: Z.cloud, clip: 1 });
        // the outline, only where a lobe is the outer edge
        cl.lobes.forEach((c, ci) => { const q = c[3] || 1; let run = []; const flush = () => { if (run.length > 2) line(run, run[0][1] > c[1] ? K.magenta : tn[0], { z: Z.cloud, p: 0.44, re: 0.45 }); run = []; }; for (let i = 0; i <= 44; i++) { const a = (i / 44) * TAU, px = c[0] + Math.cos(a) * c[2], py = c[1] + Math.sin(a) * c[2] * q; let inside = false; for (let k = 0; k < cl.lobes.length && !inside; k++) { if (k === ci) continue; const d = cl.lobes[k], dq = d[3] || 1, ex = (px - d[0]) / (d[2] * 0.99), ey = (py - d[1]) / (d[2] * dq * 0.99); if (ex * ex + ey * ey < 1) inside = true; } if (!inside) run.push([px, py]); else flush(); } flush(); });
      });
      // high wisps, dragged out with a finger
      for (let k = 0; k < 16; k++) { const x = rr(100, 1700), y = rr(380, 600), L = rr(160, 420), pts = []; for (let i = 0; i <= 6; i++) pts.push([x + (L * i) / 6, y + Math.sin(i * 1.1 + k) * 5 - i * 1.2]); stroke(pts, T.pastel, pick([K.rose, K.pink, K.apricot, K.magenta, K.lemon]), { p: 0.6, r: rr(0.14, 0.34), z: Z.sky, wob: 2 }); smudge(pts, 9, 0.3, Z.sky); }
    }]);

    root.__parts = { W, H, C, steps, K, T, S, Z, rr, ri, pick, rnd, hex, mixc, jit, grad, clamp, lerp, TAU, vn, n1, dab, stroke, line, smudge, glow, Mask, MA, MB, claim, relief, band, scr, ell, rect, smooth, tf, closeP, arch, onion, hatch, scumble, colour, HORIZON, paper, reserve, spans };
    if (root.__scene) root.__scene(root.__parts);

    return {
      W, H, steps,
      run() { const t0 = Date.now(); paper(); log('paper'); steps.forEach((s) => { s[1](); log(s[0] + ' ' + ((Date.now() - t0) / 1000).toFixed(1) + 's'); }); return this.pixels(); },
      paper,
      pixels() { const out = new Uint8Array(N * 4); for (let i = 0; i < N; i++) { out[i * 4] = clamp(C[i * 3], 0, 1) * 255 + 0.5; out[i * 4 + 1] = clamp(C[i * 3 + 1], 0, 1) * 255 + 0.5; out[i * 4 + 2] = clamp(C[i * 3 + 2], 0, 1) * 255 + 0.5; out[i * 4 + 3] = 255; } return out; },
    };
  }
  root.makeArt = makeArt;

  // ---------- running under node: write a PNG with nothing but zlib ----------
  if (typeof module !== 'undefined' && typeof require === 'function' && require.main === module) {
    const fs = require('fs'), zlib = require('zlib'), path = require('path');
    require('./scene.js'); require('./foreground.js');
    const S = parseFloat(process.argv[2] || '2'), out = process.argv[3] || path.join(__dirname, 'homecoming.png');
    const art = makeArt(S, (m) => console.log('  ' + m)), px = art.run(), W = art.W, H = art.H;
    const raw = Buffer.alloc((W * 3 + 1) * H); for (let y = 0; y < H; y++) { raw[y * (W * 3 + 1)] = 0; for (let x = 0; x < W; x++) { const i = (y * W + x) * 4, o = y * (W * 3 + 1) + 1 + x * 3; raw[o] = px[i]; raw[o + 1] = px[i + 1]; raw[o + 2] = px[i + 2]; } }
    const crcT = new Int32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c; }
    const crc = (b) => { let c = -1; for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
    const chunk = (t, d) => { const len = Buffer.alloc(4); len.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
    const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
    fs.writeFileSync(out, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 6 })), chunk('IEND', Buffer.alloc(0))]));
    console.log('wrote', out, W + 'x' + H);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
