/* HOMECOMING: everything in the picture below and in front of the sky. See draw.js for the paper and the tools.
   Nobody is in it. A flying palace is coming down out of a 1990s-cel sunset toward a city that has put a lamp in
   every window; on the terrace in front, the things that waited fourteen years are still where they were left. */
'use strict';
(function (root) {
  root.__scene = function (A) {
    const { steps, K, T, S, Z, rr, ri, pick, rnd, hex, mixc, jit, grad, clamp, TAU, n1, stroke, line, smudge, glow, MA, MB, claim, ell, rect, smooth, tf, closeP, arch, onion, hatch, scumble, colour, HORIZON } = A;
    const PI = Math.PI;
    // a ribbon polygon along a centre line, tapering from w0 to w1
    const strip = (pts, w0, w1) => { const L = [], R = []; for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * (i / (pts.length - 1))) / 2; L.push([pts[i][0] - (dy / l) * w, pts[i][1] + (dx / l) * w]); R.push([pts[i][0] + (dy / l) * w, pts[i][1] - (dx / l) * w]); } return L.concat(R.reverse()); };
    const size = (polys) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; polys.forEach((p) => p.forEach((q) => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); })); return Math.sqrt(Math.max(1, (x1 - x0) * (y1 - y0))); };
    // opaque pastel laid into a shape, sized to the shape
    const pfill = (polys, col, o) => { o = o || {}; MA.set(...polys); if (o.cut) o.cut.forEach((c) => MA.sub(c)); const r = o.r || clamp(size(polys) / 75, 0.1, 1); scumble(MA, col, { p: o.p || 0.95, r, d: o.d || 3, z: o.z, cj: o.cj == null ? 0.02 : o.cj, ang: o.ang }); if (o.twice !== false) scumble(MA, col, { p: 0.85, r: r * 0.6, d: 2.2, z: o.z, cj: 0.02 }); };
    const hfill = (polys, col, o) => { o = o || {}; MA.set(...polys); if (o.cut) o.cut.forEach((c) => MA.sub(c)); hatch(MA, o.tool || T.pencil, col, { ang: o.ang == null ? -0.8 : o.ang, sp: o.sp || 2.2, p: o.p || 0.55, len: o.len || [14, 44], z: o.z, cj: 0.02, clip: o.clip, curve: o.curve }); };
    const out = (polys, col, o) => polys.forEach((p) => line(closeP(p), col || K.indigo, Object.assign({ p: 0.55 }, o)));
    // a little flame: fingertip glow, an orange tear, a lemon core, a white prick of chalk
    const flame = (x, y, s, z) => { glow(x, y - 3 * s, 20 * s, K.apricot, 0.34); glow(x, y - 3 * s, 9 * s, K.lemon, 0.5); stroke([[x, y], [x + rr(-0.6, 0.6) * s, y - 4.5 * s], [x + rr(-1, 1) * s, y - 9 * s]], T.chalk, K.marigold, { p: 1, r: 1.5 * s, tin: 0.05, tout: 0.6, wob: 0.2, z }); stroke([[x, y - 0.5 * s], [x, y - 5 * s]], T.chalk, K.lemon, { p: 1, r: 0.95 * s, tin: 0.05, tout: 0.6, wob: 0, z }); stroke([[x, y - 1.2 * s]], T.chalk, K.white, { p: 1, r: 0.6 * s, z }); };
    const diya = (x, y, s, z) => { const bowl = [[x - 6 * s, y - 2.5 * s], [x + 6 * s, y - 2.5 * s], [x + 4 * s, y + 1.5 * s], [x, y + 2.6 * s], [x - 4 * s, y + 1.5 * s]]; MA.set(bowl); scumble(MA, K.sienna, { p: 1, r: 0.14 * s, d: 5, z }); stroke([[x - 6 * s, y - 2.5 * s], [x + 6 * s, y - 2.5 * s]], T.liner, K.umber, { p: 0.6, z, wob: 0.2 }); stroke([[x - 4 * s, y + 0.5 * s], [x + 3 * s, y + 1.2 * s]], T.chalk, K.amber, { p: 0.5, r: 0.6, z, wob: 0.2 }); flame(x, y - 3 * s, s * 0.9, z); };
    const marigold = (x, y, r, z) => { const c = pick([K.marigold, K.marigold, K.gold, K.amber]); MA.set(ell(x, y, r, r, 16)); scumble(MA, c, { p: 1, r: clamp(r / 26, 0.1, 0.6), d: 4, z }); hatch(MA, T.pencil, K.flame, { ang: rr(0, PI), sp: 1.8, p: 0.5, len: [3, 8], z, clip: 1 }); for (let k = 0; k < 7; k++) { const a = rr(0, TAU), q = rr(0.2, 0.85) * r; stroke(ell(x + Math.cos(a) * q, y + Math.sin(a) * q, r * 0.3, r * 0.22, 6, a - 1, a + 1), T.pencil, K.red, { p: 0.6, z, wob: 0.2 }); } stroke([[x - r * 0.3, y - r * 0.4]], T.chalk, K.lemon, { p: 0.9, r: clamp(r / 5, 0.6, 2), z }); line(ell(x, y, r, r, 14).concat([[x + r, y]]), K.crimson, { p: 0.4, z, re: 0.3 }); };
    const leaf = (x, y, len, ang, z) => { const w = len * 0.24, P = tf([[0, 0], [w, len * 0.3], [w * 0.8, len * 0.7], [0, len], [-w * 0.8, len * 0.7], [-w, len * 0.3]], x, y, 1, ang); MA.set(P); scumble(MA, K.leaf, { p: 0.95, r: 0.16, d: 4, z }); hatch(MA, T.pencil, K.emerald, { ang: ang + 1.2, sp: 1.6, p: 0.6, len: [4, 12], z, clip: 1 }); hatch(MA, T.pencil, K.sea, { ang: ang + 1.9, sp: 3, p: 0.4, len: [4, 10], z, clip: 1 }); line(closeP(P), K.moss, { p: 0.5, z, re: 0.3 }); line(tf([[0, 1], [0, len - 1]], x, y, 1, ang), K.lime, { p: 0.5, z, twice: false, tool: T.chalk, r: 0.5 }); return P; };

    // ================= the trail: light and petals poured out behind the palace, and the road of light ahead of it =================
    const VX = 1310, VY = 392, VS = 1.12, VR = 0.07;   // where the palace hangs in the sky
    const behind = smooth([[1960, -30], [1820, 60], [1700, 150], [1600, 262], [1500, 372]], false, 10), ahead = smooth([[1090, 352], [1020, 380], [940, 392], [868, 384], [826, 362]], false, 10);
    steps.push(['trail', () => {
      behind.forEach((p, i) => { const t = i / behind.length; glow(p[0], p[1], 70 - t * 30, K.rose, 0.07, Z.trail); glow(p[0], p[1], 34 - t * 12, K.lemon, 0.16, Z.trail); });
      ahead.forEach((p, i) => { const t = i / ahead.length; glow(p[0], p[1], 30 - t * 14, K.lemon, 0.2, Z.trail); });
      for (let k = 0; k < 5; k++) stroke(behind.map((p) => [p[0] + rr(-6, 6), p[1] + rr(-6, 6) + k * 5 - 10]), T.pastel, pick([K.cream, K.lemon, K.blush]), { p: 0.5, r: rr(0.1, 0.22), z: Z.trail, wob: 3 });
      stroke(ahead, T.pastel, K.cream, { p: 0.55, r: 0.14, z: Z.trail, wob: 2 });
      // petals: each one a single short press of a soft pencil
      const petal = (x, y, c) => { const a = rr(0, TAU), L = rr(1.6, 4.2); stroke([[x, y], [x + Math.cos(a) * L, y + Math.sin(a) * L]], T.chalk, c, { p: rr(0.7, 1), r: rr(0.8, 1.7), z: Z.trail, wob: 0, tin: 0.3, tout: 0.3 }); };
      for (let k = 0; k < 2600; k++) { const t = Math.pow(rnd(), 0.8), p = behind[Math.min(behind.length - 1, Math.floor(t * behind.length))], spread = 18 + (1 - t) * 120; const gx = (rnd() + rnd() + rnd() - 1.5) * spread, gy = (rnd() + rnd() + rnd() - 1.5) * spread * 0.7 + rr(0, 60) * (1 - t); petal(p[0] + gx, p[1] + gy, pick([K.marigold, K.marigold, K.lemon, K.pink, K.cream, K.flame, K.blush])); }
      for (let k = 0; k < 700; k++) { const t = rnd(), p = ahead[Math.min(ahead.length - 1, Math.floor(t * ahead.length))]; petal(p[0] + (rnd() + rnd() - 1) * 26, p[1] + (rnd() + rnd() - 1) * 18, pick([K.lemon, K.cream, K.marigold, K.blush])); }
      // flowers let fall from higher up, all over the sky
      for (let k = 0; k < 520; k++) petal(rr(120, 1800), Math.pow(rnd(), 0.7) * 560, pick([K.pink, K.cream, K.marigold, K.blush, K.lilac]));
      for (let k = 0; k < 40; k++) { const p = pick(behind), x = p[0] + rr(-60, 60), y = p[1] + rr(-50, 50), L = rr(4, 10); stroke([[x - L, y], [x + L, y]], T.chalk, K.white, { p: 0.6, r: 0.6, z: Z.trail, tin: 0.5, tout: 0.5, wob: 0 }); stroke([[x, y - L], [x, y + L]], T.chalk, K.white, { p: 0.6, r: 0.6, z: Z.trail, tin: 0.5, tout: 0.5, wob: 0 }); }
    }]);

    // ================= the flying palace =================
    const V = (pts) => tf(pts, VX, VY, VS, VR);
    const vim = {};
    vim.hull = V(smooth([[-156, 14], [-130, 40], [-70, 60], [0, 68], [70, 60], [130, 40], [156, 14], [110, 12], [0, 9], [-110, 12]], true, 6));
    vim.neck = V(strip(smooth([[-140, 26], [-176, 8], [-192, -24], [-182, -54], [-164, -64]], false, 6), 20, 9));
    vim.head = V(ell(-164, -66, 11, 9, 14)); vim.beak = V([[-172, -71], [-198, -63], [-172, -60]]);
    vim.tail = [0, 1, 2, 3, 4].map((i) => V(tf([[0, 0], [9, -22], [5, -58], [0, -74], [-5, -58], [-9, -22]], 142 + i * 6, 16 + i * 2, 1 - i * 0.07, 0.5 + i * 0.24)));
    vim.deck = V(rect(-132, 0, 264, 13));
    const px = [-116, -70, -24, 22, 68, 114];
    vim.pillars = px.map((x) => V(rect(x - 4, -64, 8, 66)));
    vim.arches = px.slice(0, 5).map((x) => V(arch(x + 5, 1, 36, 60)));
    vim.wall = V(rect(-118, -64, 236, 66));
    vim.cornice = V([[-138, -66], [138, -66], [132, -80], [-132, -80]]);
    vim.upper = V(rect(-66, -124, 132, 46)); vim.uarches = [-50, -14, 22].map((x) => V(arch(x, -81, 28, 36)));
    vim.cornice2 = V([[-78, -124], [78, -124], [72, -136], [-72, -136]]);
    vim.dome = V(onion(0, -136, 40)); vim.sd = [-104, 104].map((x) => V(onion(x, -100, 20))); vim.sdp = [-104, 104].map((x) => [V(rect(x - 15, -100, 3.5, 20)), V(rect(x + 11.5, -100, 3.5, 20))]);
    vim.flags = [[0, -212, 1], [-104, -138, 0.6], [104, -138, 0.6]].map((f) => V(tf(smooth([[0, 0], [20, -4], [46, 3], [70, -3], [50, 9], [24, 7], [0, 15]], true, 4), f[0], f[1], f[2])));
    const vimAll = [vim.hull, vim.neck, vim.head, vim.beak, vim.deck, vim.wall, vim.cornice, vim.upper, vim.cornice2, vim.dome].concat(vim.tail, vim.sd, vim.flags, vim.sdp[0], vim.sdp[1]);
    vimAll.forEach((p) => claim(p, Z.vimana));
    const swans = [[-262, -8, 1], [-318, -44, 0.9], [-376, -84, 0.82], [-306, 34, 0.9], [-366, 70, 0.82], [-432, -128, 0.72], [-428, 104, 0.72]].map((s) => { const q = (pts) => V(tf(pts, s[0], s[1], s[2])); return { body: q(smooth([[-16, 0], [-6, -7], [10, -6], [22, 0], [10, 6], [-6, 6]], true, 4)), neck: q(strip(smooth([[-12, -2], [-26, -6], [-34, -14], [-42, -12]], false, 4), 6, 3.5)), w1: q([[-4, -3], [4, -34], [22, -42], [14, -18], [16, -3]]), w2: q([[2, -3], [16, -26], [34, -28], [22, -10], [20, -2]]), at: q([[-44, -12]])[0], tie: q([[14, 2]])[0] }; });
    swans.forEach((s) => [s.body, s.neck, s.w1, s.w2].forEach((p) => claim(p, Z.vimana)));
    steps.push(['flying palace', () => {
      const z = Z.vimana;
      glow(VX, VY - 20, 300, K.lemon, 0.16, Z.cloud); glow(VX, VY, 200, K.apricot, 0.16, Z.cloud);
      // cloud that the palace rides on, drawn as curls
      for (let k = 0; k < 16; k++) { const c = V([[rr(-150, 190), rr(58, 92)]])[0], r = rr(10, 26), sp = []; for (let i = 0; i <= 26; i++) { const a = (i / 26) * TAU * 1.6, q = r * (0.15 + 0.85 * (i / 26)); sp.push([c[0] + Math.cos(a) * q * 1.5, c[1] + Math.sin(a) * q * 0.7]); } stroke(sp, T.pastel, pick([K.blush, K.cream, K.pink, K.lilac]), { p: 0.8, r: rr(0.2, 0.36), z: Z.cloud, wob: 1 }); line(sp, K.magenta, { p: 0.3, z: Z.cloud, re: 0.2 }); }
      // reins of gold thread to the swans that draw it
      const prow = V([[-190, -40]])[0]; swans.forEach((s) => line(smooth([prow, [(prow[0] + s.tie[0]) / 2, (prow[1] + s.tie[1]) / 2 + 9], s.tie], false, 6), K.gold, { p: 0.5, z: Z.cloud, re: 0.2, tool: T.chalk, r: 0.5 }));
      swans.forEach((s) => { pfill([s.w2], K.lilac, { z }); pfill([s.body, s.neck, s.w1], K.white, { z }); hfill([s.body, s.w1], K.lav, { z, ang: 0.9, sp: 2.6, p: 0.45, len: [4, 12] }); out([s.body, s.w1, s.w2, s.neck], K.violet, { z, p: 0.5 }); stroke([s.at, [s.at[0] - 5, s.at[1] + 1.5]], T.chalk, K.marigold, { p: 1, r: 1, z, wob: 0 }); });
      // hull: gold, with a row of lotus petals along its side
      pfill([vim.hull], K.gold, { z }); hfill([vim.hull], K.amber, { z, ang: 0.3, sp: 2.2, p: 0.55 }); hfill([vim.hull], K.flame, { z, ang: -0.5, sp: 3.6, p: 0.4 });
      MA.set(vim.hull); for (let k = 0; k < 13; k++) { const x = -140 + k * 23.3, pp = V(smooth([[x - 12, 16], [x - 9, 34], [x, 50 - Math.abs(k - 6) * 2.2], [x + 9, 34], [x + 12, 16]], false, 5)); line(pp, K.crimson, { p: 0.5, z, re: 0.5 }); stroke(V([[x, 22], [x, 40 - Math.abs(k - 6) * 2]]), T.chalk, K.lemon, { p: 0.8, r: 1, z }); }
      out([vim.hull], K.wine, { z, p: 0.62 });
      // swan prow and feathered stern
      pfill([vim.neck, vim.head], K.white, { z }); hfill([vim.neck], K.lav, { z, ang: 1.2, sp: 2.4, p: 0.45, len: [4, 10] }); pfill([vim.beak], K.marigold, { z }); out([vim.neck, vim.head, vim.beak], K.violet, { z, p: 0.55 }); stroke(V([[-167, -68]]), T.liner, K.black, { p: 1, r: 1.2, z });
      vim.tail.forEach((f, i) => { pfill([f], i % 2 ? K.rose : K.lemon, { z }); hfill([f], i % 2 ? K.magenta : K.amber, { z, ang: 0.4 + i * 0.3, sp: 2.2, p: 0.5, len: [5, 16] }); out([f], K.wine, { z, p: 0.5 }); });
      // the pavilion: every arch full of lamplight
      pfill([vim.wall], K.lemon, { z }); vim.arches.forEach((a) => { hfill([a], K.marigold, { z, ang: 1.57, sp: 2.4, p: 0.4, len: [6, 20], clip: 1 }); const c = V([[0, 0]]); });
      MA.set(vim.wall); vim.arches.forEach((a) => MA.sub(a)); hatch(MA, T.blunt, K.rose, { ang: -0.7, sp: 2, p: 0.62, len: [5, 16], z, clip: 1 }); hatch(MA, T.pencil, K.magenta, { ang: 0.6, sp: 2.6, p: 0.5, len: [5, 14], z, clip: 1 });
      vim.arches.forEach((a, i) => { out([a], K.wine, { z, p: 0.5 }); const b = V([[px[i] + 23, -18]])[0]; glow(b[0], b[1], 22, K.white, 0.5, z); });
      vim.pillars.forEach((p) => { pfill([p], K.cream, { z }); hfill([p], K.gold, { z, ang: 1.5, sp: 2.4, p: 0.5, len: [8, 30] }); out([p], K.sienna, { z, p: 0.5 }); });
      pfill([vim.deck], K.rose, { z }); hfill([vim.deck], K.crimson, { z, ang: 0.2, sp: 2.2, p: 0.5 }); out([vim.deck], K.wine, { z });
      pfill([vim.cornice, vim.cornice2], K.aqua, { z }); hfill([vim.cornice, vim.cornice2], K.teal, { z, ang: 0.5, sp: 2, p: 0.55, len: [5, 14] }); out([vim.cornice, vim.cornice2], K.sea, { z });
      pfill([vim.upper], K.apricot, { z }); MA.set(vim.upper); vim.uarches.forEach((a) => MA.sub(a)); hatch(MA, T.pencil, K.rose, { ang: -0.7, sp: 2.2, p: 0.55, len: [5, 14], z, clip: 1 });
      vim.uarches.forEach((a) => { pfill([a], K.lemon, { z }); out([a], K.wine, { z, p: 0.45 }); }); out([vim.upper], K.wine, { z, p: 0.5 });
      // domes of turquoise enamel
      [vim.dome].concat(vim.sd).forEach((d, i) => { pfill([d], K.aqua, { z }); hfill([d], K.teal, { z, ang: 1.1, sp: 2.1, p: 0.6, len: [6, 22], curve: 0.01 }); hfill([d], K.cobalt, { z, ang: -0.9, sp: 3.4, p: 0.45, len: [6, 18] }); out([d], K.sea, { z, p: 0.6 }); });
      const hi = V([[12, -168]])[0]; stroke(V(smooth([[14, -150], [20, -166], [12, -182]], false, 4)), T.chalk, K.white, { p: 0.9, r: 1.3, z });
      vim.sdp.forEach((pp) => pp.forEach((p) => { pfill([p], K.gold, { z }); out([p], K.sienna, { z, p: 0.4 }); }));
      [[0, -194, -214], [-104, -129, -140], [104, -129, -140]].forEach((f) => { line(V([[f[0], f[1]], [f[0], f[2]]]), K.gold, { z: Z.cloud, p: 0.9, tool: T.chalk, r: 1 }); stroke(V([[f[0], f[1] + 2]]), T.chalk, K.lemon, { p: 1, r: 2, z: Z.cloud }); });
      vim.flags.forEach((f, i) => { pfill([f], i ? K.lemon : K.rose, { z }); hfill([f], i ? K.marigold : K.crimson, { z, ang: 0.1, sp: 2.2, p: 0.5, len: [5, 16] }); out([f], K.wine, { z, p: 0.5 }); });
      // bells and tassels hung beneath, swinging back with the speed
      for (let k = 0; k < 9; k++) { const x = -112 + k * 28, y0 = 42 + 22 * Math.sin(((k + 0.5) / 9) * PI), L = rr(14, 26), a = V([[x, y0]])[0], b = V([[x + 8, y0 + L]])[0]; line([a, b], K.gold, { z: Z.cloud, p: 0.7, tool: T.chalk, r: 0.5, twice: false }); stroke([b, [b[0] + 1, b[1] + 4]], T.chalk, k % 2 ? K.lemon : K.rose, { p: 1, r: 2, z: Z.cloud, wob: 0 }); }
    }]);

    // ================= the city: three ranks of rooftops, a lamp on every ledge =================
    const layers = [{ z: Z.far, base: 646, polys: [], wins: [], lamps: [], tone: [K.rose, K.magenta, K.violet] }, { z: Z.mid, base: 652, polys: [], wins: [], lamps: [], tone: [K.grape, K.violet, K.ultra] }, { z: Z.near, base: 660, polys: [], wins: [], lamps: [], tone: [K.violet, K.night, K.indigo] }];
    function building(L, x, w, h, kind, o) {
      o = o || {}; const b = o.base == null ? L.base : o.base, top = b - h; L.polys.push(rect(x, top, w, h));
      const cx = x + w / 2; let ledge = [[x, top], [x + w, top]];
      if (kind === 'dome') { const r = w * (o.dr || 0.34); L.polys.push(rect(cx - r * 0.86, top - r * 0.3, r * 1.72, r * 0.32), onion(cx, top - r * 0.28, r, 1.2), rect(cx - 0.8, top - r * 2.4, 1.6, r * 0.9)); L.lamps.push([cx, top - r * 2.4]); if (o.flag !== false) L.polys.push([[cx, top - r * 2.4], [cx + r * 0.6, top - r * 2.28], [cx, top - r * 2.14]]); }
      else if (kind === 'spire') { const bw = w * 0.74, hh = w * (o.sh || 1.9), P = []; for (let i = 0; i <= 10; i++) { const t = i / 10; P.push([cx - (bw / 2) * Math.pow(1 - t, 0.62), top - hh * t]); } for (let i = 10; i >= 0; i--) { const t = i / 10; P.push([cx + (bw / 2) * Math.pow(1 - t, 0.62), top - hh * t]); } L.polys.push(P, ell(cx, top - hh, bw * 0.16, bw * 0.08, 10), rect(cx - 0.8, top - hh - bw * 0.32, 1.6, bw * 0.3)); L.lamps.push([cx, top - hh - bw * 0.34]); for (let i = 1; i < 5; i++) L.lamps.push([cx - (bw / 2) * Math.pow(1 - i / 5, 0.62), top - (hh * i) / 5], [cx + (bw / 2) * Math.pow(1 - i / 5, 0.62), top - (hh * i) / 5]); }
      else if (kind === 'chhatri') { const r = Math.min(w * 0.3, 12); [x + r, x + w - r].forEach((c) => { L.polys.push(rect(c - r * 0.8, top - r * 1.1, 1.4, r * 1.1), rect(c + r * 0.8 - 1.4, top - r * 1.1, 1.4, r * 1.1), onion(c, top - r * 1.05, r, 1.15)); L.lamps.push([c, top - r * 2.5]); }); }
      else if (kind === 'step') { for (let i = 1; i <= 3; i++) { const ww = w * (1 - i * 0.24), hh = h * 0.2; L.polys.push(rect(cx - ww / 2, top - hh * i, ww, hh)); ledge.push([cx - ww / 2, top - hh * i], [cx + ww / 2, top - hh * i]); } }
      else { for (let k = 0; k < w / 7; k++) if (k % 2 === 0) L.polys.push(rect(x + k * 7, top - 3.5, 3.6, 3.6)); }
      for (let i = 0; i < ledge.length; i += 2) for (let lx = ledge[i][0] + 2; lx < ledge[i + 1][0] - 1; lx += o.ld || 6.5) L.lamps.push([lx + rr(-0.8, 0.8), ledge[i][1] - 1.6]);
      const ww = o.ww || 5.2, wh = ww * 1.7, cols = Math.max(1, Math.floor((w - 6) / (ww * 2.1))), rows = Math.max(1, Math.floor((h - 8) / (wh * 1.75)));
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (rnd() < (o.lit == null ? 0.8 : o.lit)) L.wins.push([x + (w - cols * ww * 2.1) / 2 + c * ww * 2.1 + ww * 0.55, top + 7 + r * wh * 1.75 + wh, ww, wh]);
      if (o.gate) L.wins.push([cx - o.gate / 2, b, o.gate, o.gate * 1.5]);
    }
    { // far rank: tall temple spires in the haze
      let x = 100; while (x < 1830) { const w = rr(26, 60), k = pick(['spire', 'spire', 'dome', 'step', 'flat', 'chhatri']); building(layers[0], x, w, rr(46, 120), k, { ww: 3.6, ld: 5 }); x += w + rr(-6, 10); }
      // middle rank with the palace at its heart
      const M = layers[1];
      x = 110; while (x < 1830) { if (x > 540 && x < 1090) { x = 1090; continue; } const w = rr(38, 84), k = pick(['dome', 'flat', 'step', 'chhatri', 'spire', 'dome']); building(M, x, w, rr(40, 104), k, { ww: 4.6 }); x += w + rr(-4, 8); }
      const m0 = M.polys.length; building(M, 568, 500, 62, 'flat', { gate: 30, ww: 6 }); building(M, 628, 380, 62, 'flat', { base: 590, ww: 6.4 }); building(M, 690, 256, 58, 'chhatri', { base: 528, ww: 6.4 }); building(M, 744, 148, 52, 'dome', { base: 470, dr: 0.4, ww: 6.4 });
      building(M, 556, 46, 150, 'dome', { dr: 0.46, ww: 5 }); building(M, 1036, 46, 150, 'dome', { dr: 0.46, ww: 5 }); building(M, 616, 34, 190, 'dome', { dr: 0.46, ww: 5 }); building(M, 986, 34, 190, 'dome', { dr: 0.46, ww: 5 }); M.pal = M.polys.slice(m0);
      // near rank, low, kept clear of the palace
      const Nn = layers[2];
      x = 96; while (x < 1840) { if (x > 500 && x < 1130) { x += 30; const w = rr(30, 60); building(Nn, x, w, rr(14, 30), pick(['flat', 'step']), { ww: 4.4, lit: 0.9 }); x += w; continue; } const w = rr(44, 96), k = pick(['flat', 'dome', 'step', 'chhatri', 'flat']); building(Nn, x, w, rr(34, 92), k, { ww: 5.4 }); x += w + rr(-4, 6); }
      layers.forEach((L) => L.polys.forEach((p) => claim(p, L.z)));
    }
    steps.push(['city', () => {
      for (let x = 60; x < 1900; x += 80) glow(x, 630, rr(110, 170), K.apricot, 0.2, Z.cloud);
      glow(820, 520, 260, K.lemon, 0.2, Z.cloud);
      layers.forEach((L, li) => {
        MA.set(...L.polys);
        scumble(MA, L.tone[0], { p: 0.95, r: 0.5, d: 2.4, z: L.z, cj: 0.03 }); scumble(MA, L.tone[0], { p: 0.9, r: 0.24, d: 2.6, z: L.z });
        hatch(MA, T.blunt, L.tone[1], { ang: -0.9, sp: 1.9, p: 0.75, len: [10, 34], z: L.z, cj: 0.03 }); hatch(MA, T.pencil, L.tone[2], { ang: 0.45, sp: 2.4, p: 0.62, len: [8, 26], z: L.z });
        if (li) hatch(MA, T.pencil, L.tone[2], { ang: 1.5, sp: 3, p: 0.5, len: [8, 30], z: L.z });
        if (li === 1) { /* the palace catches more light than the town: rose rubbed over the violet, and its domes are gilded */ MA.set(...L.pal); scumble(MA, K.rose, { p: 0.75, r: 0.4, d: 2.2, z: L.z }); hatch(MA, T.pencil, K.magenta, { ang: -0.8, sp: 2.6, p: 0.5, len: [8, 26], z: L.z }); hatch(MA, T.pencil, K.violet, { ang: 0.5, sp: 3.6, p: 0.45, len: [8, 22], z: L.z }); MA.set(...L.pal.filter((p) => p.length > 20)); scumble(MA, K.gold, { p: 1, r: 0.26, d: 3.4, z: L.z }); hatch(MA, T.pencil, K.flame, { ang: 1.1, sp: 2.4, p: 0.5, len: [6, 20], z: L.z, clip: 1 }); hatch(MA, T.pencil, K.crimson, { ang: -0.7, sp: 4.4, p: 0.4, len: [5, 14], z: L.z, clip: 1 }); L.pal.filter((p) => p.length > 20).forEach((p) => { line(closeP(p), K.wine, { z: L.z, p: 0.5 }); let x0 = 1e9, x1 = -1e9, y0 = 1e9; p.forEach((q) => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); }); stroke(smooth([[x0 + (x1 - x0) * 0.32, y0 + (x1 - x0) * 0.75], [x0 + (x1 - x0) * 0.28, y0 + (x1 - x0) * 0.55], [x0 + (x1 - x0) * 0.36, y0 + (x1 - x0) * 0.4]], false, 4), T.chalk, K.cream, { p: 0.8, r: 1.1, z: L.z }); }); }
        L.polys.forEach((p) => { if (p.length > 3 && size([p]) > 9) line(closeP(p), li === 0 ? K.magenta : K.indigo, { z: L.z, p: li === 0 ? 0.3 : 0.45, re: 0.4 }); });
        // lit windows: lemon chalk, an orange edge, a breath of glow
        L.wins.forEach((w) => { const a = arch(w[0], w[1], w[2], w[3]); MA.set(a); scumble(MA, rnd() < 0.25 ? K.apricot : K.lemon, { p: 1, r: clamp(w[2] / 34, 0.08, 0.5), d: 6, z: L.z }); if (w[2] > 4.4) line(closeP(a), K.flame, { z: L.z, p: 0.4, re: 0.2, tool: T.pencil }); if (w[2] > 12) { glow(w[0] + w[2] / 2, w[1] - w[3] / 2, w[2] * 1.6, K.lemon, 0.5); } else if (rnd() < 0.3) glow(w[0] + w[2] / 2, w[1] - w[3] / 2, w[2] * 2.2, K.apricot, 0.16); });
        // the lamps
        L.lamps.forEach((q) => { glow(q[0], q[1], li === 0 ? 6 : 9, K.marigold, li === 0 ? 0.24 : 0.36, L.z + 0); stroke([[q[0], q[1]]], T.chalk, li === 0 ? K.apricot : K.lemon, { p: 1, r: li === 0 ? 0.9 : 1.25, z: L.z }); if (li && rnd() < 0.3) stroke([[q[0], q[1] - 0.6]], T.chalk, K.white, { p: 1, r: 0.5, z: L.z }); });
      });
      // pennants on the palace
      [].forEach((f) => { const P = smooth([[f[0], f[1]], [f[0] + 16, f[1] - 3], [f[0] + 34, f[1] + 3], [f[0] + 18, f[1] + 7], [f[0], f[1] + 10]], true, 4); MA.set(P); scumble(MA, K.marigold, { p: 1, r: 0.12, d: 5 }); line(closeP(P), K.crimson, { p: 0.4 }); });
      // strings of lamps swung between the towers
      [[[579, 452], [633, 414]], [[633, 414], [744, 470]], [[892, 470], [1003, 414]], [[1003, 414], [1059, 452]], [[556, 500], [470, 570]], [[1082, 500], [1170, 566]], [[818, 372], [690, 470]], [[818, 372], [946, 470]]].forEach((sg) => { const a = sg[0], b = sg[1]; for (let i = 1; i < 14; i++) { const t = i / 14, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t + Math.sin(t * PI) * 14; glow(x, y, 6, K.marigold, 0.3, Z.mid); stroke([[x, y]], T.chalk, pick([K.lemon, K.cream, K.apricot]), { p: 1, r: 1, z: Z.mid }); } });
      // ghats: steps of lamps down to the water
      for (let r = 0; r < 3; r++) for (let x = 124; x < 1800; x += rr(6, 9)) { const y = 662 + r * 4.5; glow(x, y, 6, K.marigold, 0.28, Z.river); stroke([[x, y]], T.chalk, K.lemon, { p: 1, r: 0.9, z: Z.river }); }
    }]);

    // ================= the river: the sky upside down, with every lamp drawn out into a ladder of light =================
    const RIV = [[0, hex('#2c226e')], [0.12, hex('#5a2f8e')], [0.26, hex('#c0528f')], [0.4, hex('#f58a7e')], [0.54, hex('#a653ac')], [0.74, hex('#3a3a9c')], [1, hex('#17246c')]];
    steps.push(['river', () => {
      const y0 = 664, y1 = 876;
      for (let pass = 0; pass < 3; pass++) for (let y = y0; y < y1; y += 5) { const n = 5 + ri(0, 3); for (let k = 0; k < n; k++) { const x0 = rr(-100, 1750), len = rr(160, 620), yy = y + rr(-4, 4), t = (yy - y0) / (y1 - y0), mid = 1 - Math.min(1, Math.abs(x0 + len / 2 - 960) / 900); let c = grad(RIV, clamp(t + rr(-0.05, 0.05), 0, 1)); c = mixc(c, K.apricot, 0.16 * mid * (t < 0.6 ? 1 : 0)); stroke([[x0, yy], [x0 + len / 2, yy + rr(-1.5, 1.5)], [x0 + len, yy]], T.pastel, jit(c, 0.03), { p: rr(0.55, 0.95), r: rr(0.3, 0.6), z: Z.river, wob: 1.2, step: 0.3 }); } }
      for (let k = 0; k < 90; k++) { const y = rr(y0, y1), x = rr(0, 1700); smudge([[x, y], [x + rr(120, 340), y]], rr(6, 12), 0.3, Z.river); }
      MA.set(rect(0, y0, 1920, y1 - y0)); hatch(MA, T.pencil, K.ultra, { ang: 0.02, sp: 4, p: 0.42, len: [30, 120], z: Z.river, aj: 0.01, sj: 0.02 }); hatch(MA, T.pencil, K.teal, { ang: -0.04, sp: 6, p: 0.38, len: [20, 80], z: Z.river, aj: 0.01, sj: 0.02 });
      // reflections: short sideways dashes stacked downward, wider and fainter as they go
      const ladder = (x, y, len, c, w) => { for (let d = 0; d < len; d += rr(2.4, 4.2)) { const t = d / len, ww = w * (0.6 + t * 1.6) * rr(0.6, 1.3); stroke([[x - ww + rr(-2, 2), y + d], [x + ww + rr(-2, 2), y + d]], T.chalk, c, { p: (1 - t) * 0.9 + 0.1, r: rr(0.6, 1), z: Z.river, wob: 0.2, tin: 0.3, tout: 0.3 }); } };
      layers.forEach((L, li) => { L.lamps.forEach((q) => { if (rnd() < (li ? 0.5 : 0.2)) ladder(q[0] + rr(-2, 2), 668 + rr(0, 6), rr(14, 70), pick([K.lemon, K.apricot, K.marigold, K.cream]), rr(1.4, 3)); }); L.wins.forEach((w) => { if (rnd() < 0.1) ladder(w[0], 670, rr(20, 60), K.apricot, 2.4); }); });
      for (let k = 0; k < 9; k++) ladder(820 + rr(-70, 70), 668, rr(80, 170), pick([K.lemon, K.cream]), rr(3, 7));
      ladder(VX - 20, 690, 150, K.cream, 6); ladder(VX + 30, 700, 110, K.blush, 5);
      // ripples
      for (let k = 0; k < 260; k++) { const y = rr(y0 + 6, y1), t = (y - y0) / (y1 - y0), x = rr(0, 1920), L = rr(8, 40) * (0.5 + t); stroke([[x, y], [x + L / 2, y + rr(-0.8, 0.8)], [x + L, y]], T.chalk, pick([K.lilac, K.white, K.blush, K.aqua]), { p: rr(0.3, 0.75), r: 0.55, z: Z.river, wob: 0.3, tin: 0.4, tout: 0.4 }); }
      // lamps set afloat in leaf cups, hundreds of them, drifting toward the far bank
      for (let k = 0; k < 170; k++) { const t = Math.pow(rnd(), 0.75), y = y0 + 8 + t * (y1 - y0 - 44), s = 0.5 + t * 1.25, x = rr(110, 1810); const cup = [[x - 6 * s, y - 2 * s], [x + 6 * s, y - 2 * s], [x + 3.4 * s, y + 2 * s], [x - 3.4 * s, y + 2 * s]]; MA.set(cup); scumble(MA, K.emerald, { p: 1, r: 0.12 * s, d: 5, z: Z.river }); line(closeP(cup), K.moss, { p: 0.4, z: Z.river, re: 0 }); flame(x, y - 2.5 * s, s * 0.8, Z.river); ladder(x, y + 3 * s, 10 + 22 * s, K.lemon, 1.6 * s); }
    }]);

    // ================= the terrace floor =================
    const VP = [960, 700], rows = [876, 892, 912, 938, 972, 1016, 1090], tiles = [];
    for (let r = 0; r < rows.length - 1; r++) for (let c = -8; c < 22; c++) { const xa = -700 + c * 160, xb = xa + 160, f = (y) => (y - VP[1]) / (1090 - VP[1]), X = (x, y) => VP[0] + (x - VP[0]) * f(y); tiles.push({ p: [[X(xa, rows[r]), rows[r]], [X(xb, rows[r]), rows[r]], [X(xb, rows[r + 1]), rows[r + 1]], [X(xa, rows[r + 1]), rows[r + 1]]], k: (r + c + 100) % 2 }); }
    claim(rect(0, 872, 1920, 210), Z.floor);
    steps.push(['floor', () => {
      tiles.forEach((t) => { const cx = (t.p[0][0] + t.p[1][0]) / 2; if (cx < -80 || cx > 2000) return; MA.set(t.p); scumble(MA, t.k ? K.lav : K.stone, { p: 0.95, r: 0.5, d: 3, z: Z.floor, cj: 0.03 }); scumble(MA, t.k ? K.lav : K.stone, { p: 0.9, r: 0.3, d: 2.4, z: Z.floor, cj: 0.03 }); hatch(MA, T.blunt, t.k ? K.grape : K.magenta, { ang: t.k ? -0.7 : 0.5 + rr(-0.3, 0.3), sp: 2.2, p: 0.6, len: [12, 44], z: Z.floor, cj: 0.03 }); hatch(MA, T.pencil, t.k ? K.ultra : K.violet, { ang: t.k ? 0.4 : -0.9, sp: 3, p: 0.5, len: [10, 36], z: Z.floor }); line(closeP(t.p), K.violet, { z: Z.floor, p: 0.38, re: 0.5 }); });
      // the floor falls into shadow toward the front edge and the corners
      MA.set(rect(0, 872, 1920, 210)); hatch(MA, T.pencil, K.ultra, { ang: 0.03, sp: 3.2, p: 0.45, len: [30, 120], z: Z.floor }); MA.set(rect(0, 980, 1920, 110)); hatch(MA, T.blunt, K.night, { ang: 0.05, sp: 2.6, p: 0.5, len: [30, 110], z: Z.floor });
      MA.set(rect(0, 872, 300, 210)); hatch(MA, T.pencil, K.indigo, { ang: 1.2, sp: 4, p: 0.36, len: [20, 60], z: Z.floor }); MA.set(rect(1620, 872, 300, 210)); hatch(MA, T.pencil, K.indigo, { ang: -1.2, sp: 4, p: 0.36, len: [20, 60], z: Z.floor });
    }]);

    // ================= the balustrade =================
    const rail = { top: rect(118, 792, 1684, 15), bot: rect(118, 858, 1684, 16), bal: [], posts: [] };
    for (let x = 150; x < 1790; x += 31) rail.bal.push(smooth([[x - 4, 807], [x - 9, 822], [x - 4.5, 836], [x - 10, 849], [x - 6, 858], [x + 6, 858], [x + 10, 849], [x + 4.5, 836], [x + 9, 822], [x + 4, 807]], true, 3));
    [520, 960, 1400].forEach((x) => rail.posts.push(rect(x - 17, 778, 34, 96), ell(x, 768, 13, 12, 16)));
    [rail.top, rail.bot].concat(rail.bal, rail.posts).forEach((p) => claim(p, Z.rail));
    steps.push(['balustrade', () => {
      const z = Z.rail;
      pfill(rail.bal, K.blush, { z, r: 0.2 }); hfill(rail.bal, K.rose, { z, ang: 1.45, sp: 2.2, p: 0.55, len: [8, 30] }); hfill(rail.bal, K.grape, { z, ang: -0.6, sp: 2.6, p: 0.55, len: [5, 14] }); hfill(rail.bal, K.violet, { z, ang: 0.7, sp: 3.6, p: 0.45, len: [5, 14] });
      rail.bal.forEach((b) => { line(closeP(b), K.violet, { z, p: 0.42, re: 0.3 }); stroke([[b[0][0] + 2, 812], [b[0][0] + 1, 850]], T.chalk, K.cream, { p: 0.5, r: 0.7, z, wob: 0.6 }); });
      [rail.top, rail.bot].forEach((r, i) => { pfill([r], i ? K.stone : K.apricot, { z, r: 0.3 }); hfill([r], K.rose, { z, ang: 0.03, sp: 2.4, p: 0.55, len: [30, 120] }); hfill([r], i ? K.violet : K.magenta, { z, ang: -0.5, sp: 4, p: i ? 0.5 : 0.3, len: [6, 16] }); line(closeP(r), K.violet, { z, p: 0.5 }); });
      for (let x = 130; x < 1790; x += 14) stroke(ell(x, 866, 4, 4, 8, PI, TAU), T.pencil, K.grape, { p: 0.5, z, wob: 0.2 });
      pfill(rail.posts, K.stone, { z, r: 0.3 }); hfill(rail.posts, K.rose, { z, ang: 1.5, sp: 2.2, p: 0.55 }); hfill(rail.posts, K.violet, { z, ang: -0.7, sp: 3.2, p: 0.5, len: [6, 18] }); out(rail.posts, K.indigo, { z, p: 0.5 });
      [520, 960, 1400].forEach((x) => { line(closeP(arch(x - 9, 866, 18, 60)), K.grape, { z, p: 0.45 });  });
    }]);

    // ================= pillars and beam: the doorway we are looking out of =================
    const pil = [0, 1].map((i) => { const x = i ? 1802 : 0; return { x, shaft: rect(x + 14, 150, 90, 800), cap: [[x - 4, 150], [x + 122, 150], [x + 108, 96], [x + 122, 60], [x - 4, 60], [x + 10, 96]], base: [[x - 4, 950], [x + 122, 950], [x + 122, 1090], [x - 4, 1090]], neck: rect(x - 4, 34, 126, 28) }; });
    const beam = rect(0, 0, 1920, 36);
    pil.forEach((p) => [p.shaft, p.cap, p.base, p.neck].forEach((q) => claim(q, Z.pillar))); claim(beam, Z.pillar);
    steps.push(['pillars', () => {
      const z = Z.pillar;
      pil.forEach((p, i) => {
        const lit = i ? p.x + 14 : p.x + 104, dir = i ? 1 : -1;
        pfill([p.shaft], K.stone, { z, r: 0.6 }); hfill([p.shaft], K.rose, { z, ang: 1.52, sp: 2.4, p: 0.6, len: [30, 120] }); hfill([p.shaft], K.magenta, { z, ang: 1.2, sp: 4, p: 0.4, len: [20, 70] });
        // shadow side away from the lamps, and the cool of the upper air
        MA.set(rect(i ? p.x + 54 : p.x + 14, 150, 50, 800)); hatch(MA, T.blunt, K.violet, { ang: 1.5, sp: 2.4, p: 0.6, len: [30, 110], z }); hatch(MA, T.pencil, K.ultra, { ang: -0.8, sp: 3.4, p: 0.45, len: [10, 30], z });
        MA.set(rect(p.x + 14, 150, 90, 300)); hatch(MA, T.pencil, K.ultra, { ang: 0.8, sp: 3.8, p: 0.4, len: [10, 40], z });
        MA.set(rect(i ? p.x + 14 : p.x + 78, 560, 26, 390)); hatch(MA, T.pencil, K.marigold, { ang: 1.5, sp: 3, p: 0.5, len: [20, 80], z });
        for (let k = 0; k < 6; k++) { const x = p.x + 22 + k * 15; line([[x, 156], [x + rr(-1, 1), 944]], K.grape, { z, p: 0.4, re: 0.6, wob: 1 }); }
        // carved bands: lotus petals, a zigzag, beads
        [330, 640].forEach((y) => { MA.set(rect(p.x + 14, y, 90, 44)); scumble(MA, K.apricot, { p: 0.9, r: 0.3, d: 3, z }); hatch(MA, T.pencil, K.amber, { ang: 0.3, sp: 2.6, p: 0.5, len: [8, 26], z, clip: 1 }); line([[p.x + 14, y], [p.x + 104, y]], K.wine, { z, p: 0.5 }); line([[p.x + 14, y + 44], [p.x + 104, y + 44]], K.wine, { z, p: 0.5 }); for (let k = 0; k < 6; k++) { const x = p.x + 21.5 + k * 15; line(smooth([[x - 7, y + 40], [x - 6, y + 18], [x, y + 5], [x + 6, y + 18], [x + 7, y + 40]], false, 4), K.crimson, { z, p: 0.5, re: 0.4 }); stroke([[x, y + 14], [x, y + 34]], T.pencil, K.rose, { p: 0.6, z }); } for (let k = 0; k < 12; k++) stroke([[p.x + 18 + k * 7.6, y + 52]], T.chalk, K.cream, { p: 0.9, r: 1.6, z }); const zz = []; for (let k = 0; k <= 12; k++) zz.push([p.x + 14 + k * 7.5, y - 6 - (k % 2) * 8]); line(zz, K.wine, { z, p: 0.45 }); });
        // capital and base
        [p.cap, p.neck, p.base].forEach((q, k) => { pfill([q], k === 2 ? K.stone : K.apricot, { z, r: 0.5 }); hfill([q], K.rose, { z, ang: k === 2 ? 0.1 : 0.9, sp: 2.4, p: 0.6 }); hfill([q], k === 2 ? K.violet : K.magenta, { z, ang: -0.7, sp: 3.2, p: 0.5 }); line(closeP(q), K.indigo, { z, p: 0.55 }); });
        for (let k = 0; k < 8; k++) { const x = p.x + 3 + k * 16; line(smooth([[x, 148], [x + 2, 120], [x + 8, 100], [x + 14, 120], [x + 16, 148]], false, 4), K.crimson, { z, p: 0.45, re: 0.4 }); }
        [980, 1012, 1046].forEach((y) => line([[p.x - 4, y], [p.x + 122, y + rr(-1, 1)]], K.violet, { z, p: 0.5 }));
        MA.set(p.base); hatch(MA, T.blunt, K.night, { ang: 0.2, sp: 3, p: 0.45, len: [20, 70], z });
      });
      // the beam: dark wood, a running pattern picked out in gold chalk
      pfill([beam], K.wine, { z, r: 0.5 }); hfill([beam], K.crimson, { z, ang: 0.02, sp: 2.2, p: 0.6, len: [40, 160] }); hfill([beam], K.indigo, { z, ang: -0.6, sp: 3, p: 0.5, len: [8, 24] }); line([[0, 36], [1920, 36]], K.black, { z, p: 0.6 });
      for (let x = 10; x < 1920; x += 26) { stroke(ell(x, 18, 8, 8, 14, 0, TAU * 1.3), T.chalk, K.gold, { p: 0.7, r: 0.7, z, wob: 0.4 }); stroke([[x + 13, 18]], T.chalk, K.lemon, { p: 0.9, r: 1.3, z }); }
      line([[0, 5], [1920, 5]], K.gold, { z, p: 0.7, tool: T.chalk, r: 0.6 }); line([[0, 31], [1920, 31]], K.gold, { z, p: 0.7, tool: T.chalk, r: 0.6 });
    }]);

    // ================= the toran: marigolds and mango leaves strung across the doorway =================
    const hooks = [118, 399, 680, 961, 1242, 1523, 1802], beads = [];
    for (let h = 0; h < hooks.length - 1; h++) { const a = hooks[h], b = hooks[h + 1], n = 15; for (let i = 0; i <= n; i++) { const t = i / n, x = a + (b - a) * t, y = 40 + 78 * 4 * t * (1 - t) + (h % 2 ? 8 : 0) * 4 * t * (1 - t); beads.push({ x, y, leaf: i % 2 === 1, r: rr(8.5, 11.5) }); } }
    hooks.forEach((x, k) => { if (k === 0 || k === hooks.length - 1) return; const n = 5 + (k % 2) * 3; for (let i = 0; i < n; i++) beads.push({ x: x + Math.sin(i * 1.3 + k) * 1.5, y: 52 + i * 19, leaf: false, r: 10.5 - i * 0.5, drop: 1, last: i === n - 1 }); });
    beads.forEach((b) => { if (!b.leaf) claim(ell(b.x, b.y, b.r, b.r, 14), Z.toran); else [-0.5, 0.5].forEach((a) => claim(tf([[0, 0], [7, 9], [5.6, 21], [0, 30], [-5.6, 21], [-7, 9]], b.x, b.y, 1, a), Z.toran)); });
    steps.push(['toran', () => {
      const z = Z.toran;
      for (let h = 0; h < hooks.length - 1; h++) { const pts = beads.filter((b) => !b.drop).slice(h * 16, h * 16 + 16).map((b) => [b.x, b.y]); line(pts, K.umber, { z: Z.pillar, p: 0.5 }); }
      beads.forEach((b) => { if (b.leaf) { leaf(b.x, b.y, 30, -0.5, z); leaf(b.x, b.y, 30, 0.5, z); } });
      beads.forEach((b) => { if (!b.leaf) { marigold(b.x, b.y, b.r, z); if (b.last) { line([[b.x, b.y + b.r], [b.x, b.y + b.r + 16]], K.gold, { p: 0.8, tool: T.chalk, r: 0.6 }); const bell = [[b.x - 5, b.y + b.r + 16], [b.x + 5, b.y + b.r + 16], [b.x + 8, b.y + b.r + 30], [b.x - 8, b.y + b.r + 30]]; MA.set(bell); scumble(MA, K.gold, { p: 1, r: 0.14, d: 5 }); line(closeP(bell), K.sienna, { p: 0.5 }); stroke([[b.x - 2, b.y + b.r + 20], [b.x - 3, b.y + b.r + 27]], T.chalk, K.cream, { p: 0.9, r: 0.7 }); stroke([[b.x, b.y + b.r + 33]], T.chalk, K.red, { p: 1, r: 1.8 }); } } });
    }]);

    root.__scene2 && root.__scene2(Object.assign({ W: Math.round(1920 * S) }, A), { strip, size, pfill, hfill, out, flame, diya, marigold, leaf, layers, VX, VY });
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
