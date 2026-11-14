/* HOMECOMING: the terrace. The things that were left waiting, and the creatures who are the only ones awake to see. */
'use strict';
(function (root) {
  root.__scene2 = function (A, B) {
    const { steps, K, T, S, Z, rr, ri, pick, rnd, mixc, jit, clamp, TAU, stroke, line, smudge, glow, MA, MB, claim, ell, rect, smooth, tf, closeP, arch, onion, hatch, scumble } = A;
    const { strip, pfill, hfill, out, flame, diya, marigold, leaf } = B;
    const PI = Math.PI, OB = Z.obj, FL = Z.floor;
    const mir = (pts, ax) => pts.map((p) => [2 * ax - p[0], p[1]]).reverse();

    // ---------- geometry first, so everything behind knows to leave room ----------
    // the low throne, its cushion, the parasol over it, and the pair of sandals that ruled for fourteen years
    const TH = { ax: 335 };
    TH.staff = rect(331, 566, 8, 290);
    TH.back = [[206, 932], [206, 856], [224, 824], [278, 804], [335, 792], [392, 804], [446, 824], [464, 856], [464, 932]];
    TH.panel = [[226, 928], [226, 862], [240, 840], [284, 824], [335, 814], [386, 824], [430, 840], [444, 862], [444, 928]];
    TH.seat = [[196, 930], [474, 930], [502, 964], [168, 964]];
    TH.apron = [[168, 964], [502, 964], [498, 994], [172, 994]];
    TH.legL = smooth([[176, 994], [214, 994], [208, 1014], [218, 1040], [202, 1056], [178, 1056], [170, 1040], [182, 1014]], true, 4); TH.legR = mir(TH.legL, TH.ax);
    TH.cushion = smooth([[212, 924], [335, 918], [458, 924], [482, 946], [472, 960], [335, 964], [198, 960], [188, 946]], true, 5);
    const sole = (x, y, a) => tf(smooth([[-9, -20], [0, -24], [9, -20], [13, -6], [15, 8], [11, 18], [0, 22], [-11, 18], [-15, 8], [-13, -6]], true, 4), x, y, 1.3, a);
    TH.pad = [[296, 934, -0.16], [374, 934, 0.16]].map((p) => ({ sole: sole(p[0], p[1], p[2]), stem: rect(p[0] - 3.5, p[1] - 2, 7, 14), knob: ell(p[0], p[1] - 4, 9.5, 7.5, 16), x: p[0], y: p[1], a: p[2] }));
    { const top = smooth([[176, 652], [196, 612], [244, 580], [335, 562], [426, 580], [474, 612], [494, 652]], false, 6), bot = []; for (let k = 0; k < 8; k++) { const xa = 494 - k * 39.75, xb = xa - 39.75; for (let i = 1; i <= 6; i++) { const t = i / 6; bot.push([xa + (xb - xa) * t, 652 + Math.sin(t * PI) * 13]); } } TH.canopy = top.concat(bot); TH.joints = Array.from({ length: 9 }, (_, k) => [176 + k * 39.75, 652]); }
    TH.finial = [ell(335, 552, 10, 11, 14), [[331, 544], [335, 520], [339, 544]]];
    claim(TH.staff, OB - 2); [TH.back, TH.seat, TH.apron, TH.legL, TH.legR].forEach((p) => claim(p, OB)); claim(TH.cushion, OB + 1); TH.pad.forEach((p) => [p.sole, p.stem, p.knob].forEach((q) => claim(q, OB + 2))); claim(TH.canopy, OB + 3); TH.finial.forEach((p) => claim(p, OB + 3));
    // the tall brass lamp
    const LX = 610, LP = { base: ell(LX, 1022, 42, 11, 26), dish: ell(LX, 724, 44, 11, 26) };
    { const prof = [[11, 1016], [17, 994], [7, 972], [11, 930], [5.5, 880], [10, 826], [5.5, 776], [15, 744], [6, 728]]; LP.stem = prof.map((p) => [LX + p[0], p[1]]).concat(prof.slice().reverse().map((p) => [LX - p[0], p[1]])); LP.top = onion(LX, 716, 10, 1.3); }
    [LP.base, LP.dish, LP.stem, LP.top].forEach((p) => claim(p, OB));
    // the welcome plate and the conch
    const PL = { x: 760, y: 1040, rim: ell(760, 1040, 66, 17, 30), inner: ell(760, 1039, 56, 13, 30), conch: tf(smooth([[-34, 2], [-20, -15], [4, -20], [26, -12], [38, 2], [22, 13], [0, 15], [-22, 11]], true, 5), 868, 1050, 1, -0.12) };
    claim(PL.rim, OB); claim(PL.conch, OB);
    // rangoli: coloured powder on the floor, a lotus opening
    const RG = { cx: 1070, cy: 978, rx: 236, ry: 54 }; const E = (rho, th) => [RG.cx + rho * Math.cos(th) * RG.rx, RG.cy + rho * Math.sin(th) * RG.ry];
    const petalP = (r0, r1, th, dw) => smooth([E(r0, th - dw), E(r0 + (r1 - r0) * 0.5, th - dw * 0.92), E(r1, th), E(r0 + (r1 - r0) * 0.5, th + dw * 0.92), E(r0, th + dw)], false, 4);
    RG.outer = Array.from({ length: 16 }, (_, k) => petalP(0.6, 1, (k / 16) * TAU, 0.185)); RG.mid = Array.from({ length: 8 }, (_, k) => petalP(0.27, 0.66, ((k + 0.5) / 8) * TAU, 0.34)); RG.core = ell(RG.cx, RG.cy, RG.rx * 0.27, RG.ry * 0.27, 26);
    RG.outer.concat(RG.mid, [RG.core]).forEach((p) => claim(p, FL + 1));
    // the great bow, unstrung of its work, and the quiver
    const BW = { c: smooth([[1700, 1040], [1712, 1012], [1730, 930], [1758, 836], [1776, 736], [1778, 640], [1762, 552], [1740, 492], [1752, 462]], false, 8) };
    BW.limb = strip(BW.c, 15, 15); BW.qv = [[1556, 1040], [1620, 1040], [1664, 816], [1608, 804]]; BW.rim = tf(ell(0, 0, 30, 10, 22), 1636, 810, 1, 0.2);
    BW.arrows = Array.from({ length: 7 }, (_, k) => { const x0 = 1614 + k * 7.5, y0 = 812 + (k % 2) * 3, L = 100 + ((k * 37) % 46), a = -1.36 + (k - 3) * 0.075; return { a: [x0, y0], b: [x0 + Math.cos(a) * L, y0 + Math.sin(a) * L], ang: a }; });
    claim(BW.limb, OB); claim(BW.qv, OB); claim(BW.rim, OB);
    BW.arrows.forEach((ar) => { const n = [-Math.sin(ar.ang), Math.cos(ar.ang)], d = [Math.cos(ar.ang), Math.sin(ar.ang)], at = (f, w) => [ar.b[0] - d[0] * f + n[0] * w, ar.b[1] - d[1] * f + n[1] * w]; ar.fl = [-1, 1].map((sd) => [at(42, 0), at(34, 7.5 * sd), at(8, 7.5 * sd), at(12, 0)]); ar.fl.forEach((p) => claim(p, OB - 1)); });
    // the peacock on the rail, its train spilling down to the floor
    const PK = {};
    PK.body = smooth([[1208, 772], [1224, 742], [1262, 728], [1302, 738], [1326, 762], [1312, 788], [1268, 794], [1230, 792]], true, 5);
    PK.neck = strip(smooth([[1230, 764], [1210, 734], [1200, 700], [1208, 670], [1202, 648]], false, 6), 28, 13); PK.head = ell(1198, 641, 15, 12, 18); PK.beak = [[1187, 635], [1160, 643], [1187, 649]];
    PK.cen = smooth([[1304, 762], [1352, 790], [1402, 846], [1438, 930], [1454, 1010], [1444, 1052]], false, 10); PK.w = (u) => 8 + 50 * Math.pow(u, 0.7);
    PK.at = (u, v) => { const n = PK.cen.length - 1, f = clamp(u, 0, 1) * n, i = Math.min(n - 1, Math.floor(f)), t = f - i, a = PK.cen[i], b = PK.cen[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = PK.w(u) * v; return [a[0] + dx * t - (dy / l) * w, a[1] + dy * t + (dx / l) * w, Math.atan2(dy, dx)]; };
    { const L = [], Rr = []; for (let i = 0; i <= 30; i++) { const u = i / 30; L.push(PK.at(u, 1)); Rr.push(PK.at(u, -1)); } const endc = [], dd = PK.at(1, 0)[2]; PK.tips = []; for (let k = 0; k < 7; k++) { const v = 1 - (k + 0.5) * (2 / 7), p = PK.at(1, v), len = 16 + ((k * 53) % 30), tip = [p[0] + Math.cos(dd) * len, p[1] + Math.sin(dd) * len]; endc.push(tip); PK.tips.push([tip[0] - Math.cos(dd) * 12, tip[1] - Math.sin(dd) * 12, dd]); const q = PK.at(1, 1 - (k + 1) * (2 / 7)); endc.push([q[0], q[1]]); } PK.train = L.concat(endc, Rr.reverse()).map((p) => [p[0], p[1]]); }
    PK.wing = smooth([[1244, 748], [1288, 740], [1316, 762], [1294, 784], [1252, 780]], true, 4);
    claim(PK.train, Z.bird - 1); [PK.body, PK.neck, PK.head, PK.beak].forEach((p) => claim(p, Z.bird));
    // two parrots on the garland
    const parrot = (x, y, fx, s) => { const q = (pts) => tf(pts, x, y, s, 0, fx); return { body: q(smooth([[-8, -4], [0, 2], [10, -6], [15, -22], [8, -34], [-5, -32], [-11, -18]], true, 4)), head: q(ell(5, -36, 9, 8.5, 14)), beak: q([[11, -40], [21, -36], [12, -31]]), tail: q([[-6, -4], [3, -1], [-5, 44], [-13, 42]]), wing: q(smooth([[-6, -26], [6, -24], [5, -6], [-7, -6]], true, 3)), eye: q([[7, -38]])[0], q }; };
    const PR = [parrot(540, 122, 1, 1.25), parrot(1383, 114, -1, 1.25), parrot(1408, 118, 1, 1.05)];
    PR.forEach((p) => [p.body, p.head, p.beak, p.tail].forEach((q) => claim(q, Z.bird)));

    // ---------- shadows and pools of lamplight on the floor ----------
    steps.push(['lamplight', () => {
      const sh = (x, y, rx, ry) => { MA.set(ell(x, y, rx, ry, 26)); hatch(MA, T.blunt, K.night, { ang: 0.04, sp: 2.2, p: 0.62, len: [20, 70], z: FL, clip: 1 }); hatch(MA, T.pencil, K.indigo, { ang: -0.5, sp: 3, p: 0.5, len: [8, 24], z: FL, clip: 1 }); };
      sh(335, 1058, 200, 16); sh(LX + 30, 1026, 60, 9); sh(1600, 1046, 70, 9); sh(1700, 1048, 50, 8); sh(1450, 1060, 80, 12); sh(790, 1058, 120, 9);
      [[LX, 1000, 230, K.apricot, 0.3], [LX, 1010, 110, K.lemon, 0.3], [RG.cx, RG.cy, 330, K.apricot, 0.16], [335, 980, 200, K.apricot, 0.16], [PL.x, PL.y, 110, K.lemon, 0.22]].forEach((g) => glow(g[0], g[1], g[2], g[3], g[4], FL + 1));
      for (let k = 0; k < 260; k++) { const x = rr(120, 1800), y = rr(884, 1076), a = rr(0, TAU), L = rr(2, 5); stroke([[x, y], [x + Math.cos(a) * L, y + Math.sin(a) * L * 0.5]], T.chalk, pick([K.marigold, K.marigold, K.lemon, K.rose, K.cream]), { p: rr(0.6, 1), r: rr(0.9, 1.8), z: FL, wob: 0 }); }
    }]);

    // ---------- rangoli ----------
    steps.push(['rangoli', () => {
      const z = FL + 1, powder = (polys, c, c2) => { MA.set(...polys); scumble(MA, c, { p: 1, r: 0.3, d: 4, z, cj: 0.03 }); scumble(MA, c, { p: 0.9, r: 0.16, d: 3, z }); hatch(MA, T.pencil, c2, { ang: rr(0, PI), sp: 3, p: 0.4, len: [4, 12], z, clip: 1 }); };
      RG.outer.forEach((p, k) => powder([p], k % 2 ? K.rose : K.marigold, k % 2 ? K.crimson : K.flame));
      RG.mid.forEach((p, k) => powder([p], k % 2 ? K.aqua : K.lemon, k % 2 ? K.teal : K.amber)); powder([RG.core], K.magenta, K.wine);
      const dots = (rho, n, c, r) => { for (let k = 0; k < n; k++) { const p = E(rho, (k / n) * TAU); stroke([p], T.chalk, c, { p: 1, r, z }); } };
      dots(1.06, 96, K.white, 1.3); dots(0.6, 64, K.white, 1.1); dots(0.27, 36, K.cream, 1.1); dots(0.14, 12, K.lemon, 1.6); stroke([[RG.cx, RG.cy]], T.chalk, K.lemon, { p: 1, r: 3, z });
      RG.outer.concat(RG.mid).forEach((p) => { for (let i = 0; i < p.length; i += 2) stroke([p[i]], T.chalk, K.white, { p: 0.9, r: 0.8, z }); });
      RG.outer.forEach((p, k) => { const tip = E(0.86, (k / 16) * TAU); stroke([tip], T.chalk, K.white, { p: 1, r: 1.5, z }); });
      for (let k = 0; k < 8; k++) { const p = E(1.2, ((k + 0.5) / 8) * TAU); diya(p[0], p[1], 0.75 + 0.45 * ((p[1] - 920) / 110), 255); }
    }]);

    // ---------- the throne ----------
    steps.push(['throne and sandals', () => {
      const z = OB;
      pfill([TH.staff], K.gold, { z: OB - 2 }); hfill([TH.staff], K.amber, { z: OB - 2, ang: 1.5, sp: 2, p: 0.6, len: [20, 80] }); line([[331, 566], [331, 856]], K.sienna, { z: OB - 2, p: 0.5 }); line([[339, 566], [339, 856]], K.sienna, { z: OB - 2, p: 0.5 });
      // carved back with a velvet panel
      pfill([TH.back], K.gold, { z, cut: [TH.panel] }); MA.set(TH.back).sub(TH.panel); hatch(MA, T.blunt, K.amber, { ang: 0.8, sp: 2.2, p: 0.6, len: [8, 26], z, clip: 1 }); hatch(MA, T.pencil, K.flame, { ang: -0.6, sp: 3.4, p: 0.42, len: [6, 18], z, clip: 1 });
      pfill([TH.panel], K.red, { z }); hfill([TH.panel], K.crimson, { z, ang: 1.2, sp: 2.2, p: 0.6 }); hfill([TH.panel], K.wine, { z, ang: -0.5, sp: 3.6, p: 0.45 });
      for (let k = 0; k < 9; k++) for (let r = 0; r < 4; r++) { const x = 246 + k * 22 + (r % 2) * 11, y = 850 + r * 20; if (y < 838 + Math.abs(x - 335) * 0.22) continue; stroke([[x, y]], T.chalk, K.gold, { p: 0.9, r: 1.3, z }); stroke([[x - 3, y], [x + 3, y]], T.chalk, K.gold, { p: 0.5, r: 0.5, z, wob: 0 }); stroke([[x, y - 3], [x, y + 3]], T.chalk, K.gold, { p: 0.5, r: 0.5, z, wob: 0 }); }
      out([TH.back, TH.panel], K.wine, { z, p: 0.6 }); for (let k = 0; k < 15; k++) { const t = k / 14, x = 214 + t * 242, y = 846 - Math.sin(t * PI) * 44; stroke([[x, y]], T.chalk, K.cream, { p: 1, r: 1.7, z }); }
      // seat, apron and lion-paw legs
      [TH.seat, TH.apron, TH.legL, TH.legR].forEach((p, i) => { pfill([p], K.gold, { z }); hfill([p], K.amber, { z, ang: i < 2 ? 0.05 : 1.4, sp: 2.2, p: 0.6 }); hfill([p], i === 0 ? K.marigold : K.sienna, { z, ang: -0.7, sp: 3.2, p: i === 0 ? 0.3 : 0.5, len: [6, 20] }); line(closeP(p), K.umber, { z, p: 0.6 }); });
      for (let x = 184; x < 492; x += 22) { line(smooth([[x, 990], [x + 5, 972], [x + 11, 968], [x + 17, 972], [x + 22, 990]], false, 4), K.crimson, { z, p: 0.5, re: 0.4 }); stroke([[x + 11, 982]], T.chalk, K.red, { p: 1, r: 1.8, z }); }
      [TH.legL, TH.legR].forEach((l, i) => { const x = i ? 475 : 195; [1048, 1050, 1049].forEach((y, k) => stroke([[x - 9 + k * 9, y]], T.liner, K.umber, { p: 0.8, r: 1.6, z })); line(ell(x, 1022, 9, 8, 12, 0, TAU * 1.2), K.sienna, { z, p: 0.5 }); });
      // cushion of red silk
      pfill([TH.cushion], K.red, { z: OB + 1 }); hfill([TH.cushion], K.crimson, { z: OB + 1, ang: 0.1, sp: 2.2, p: 0.6, len: [20, 70], curve: 0.004 }); hfill([TH.cushion], K.magenta, { z: OB + 1, ang: -0.9, sp: 4, p: 0.4 }); out([TH.cushion], K.wine, { z: OB + 1, p: 0.6 });
      stroke(smooth([[214, 932], [335, 925], [456, 932]], false, 6), T.chalk, K.pink, { p: 0.6, r: 1.6, z: OB + 1 }); [[190, 948], [480, 948]].forEach((p) => { for (let k = 0; k < 5; k++) line([[p[0], p[1]], [p[0] + (k - 2) * 3, p[1] + 16]], K.gold, { z: 255, p: 0.8, tool: T.chalk, r: 0.6, twice: false }); stroke([p], T.chalk, K.lemon, { p: 1, r: 2.4 }); });
      // the sandals. Everything else in the picture bows a little toward them.
      glow(335, 926, 130, K.lemon, 0.5, OB + 1); glow(335, 926, 70, K.white, 0.4, OB + 1);
      TH.pad.forEach((p) => { pfill([p.sole], K.lemon, { z: OB + 2 }); hfill([p.sole], K.gold, { z: OB + 2, ang: 1.2, sp: 1.8, p: 0.55, len: [5, 16] }); hfill([p.sole], K.amber, { z: OB + 2, ang: -0.4, sp: 3, p: 0.4, len: [4, 12] }); out([p.sole], K.sienna, { z: OB + 2, p: 0.65 }); line(closeP(tf(smooth([[-6, -15], [0, -18], [6, -15], [9, -4], [10, 7], [7, 14], [0, 17], [-7, 14], [-10, 7], [-9, -4]], true, 3), p.x, p.y, 1.3, p.a)), K.amber, { z: OB + 2, p: 0.5, re: 0.2 }); line(tf([[-12, 20], [12, 20]], p.x, p.y, 1.3, p.a), K.sienna, { z: OB + 2, p: 0.4, re: 0 }); pfill([p.stem, p.knob], K.gold, { z: OB + 2 }); hfill([p.knob], K.amber, { z: OB + 2, ang: 0.6, sp: 1.8, p: 0.5, len: [3, 8] }); out([p.stem, p.knob], K.sienna, { z: OB + 2, p: 0.6 }); stroke([[p.x - 3, p.y - 6.5]], T.chalk, K.white, { p: 1, r: 1.8 }); stroke([[p.x, p.y - 22]], T.chalk, K.red, { p: 1, r: 2.2 }); stroke(tf([[-13, 2], [-10, 12]], p.x, p.y, 1.3, p.a), T.chalk, K.white, { p: 0.9, r: 0.9 }); });
      // parasol of white silk
      const zc = OB + 3; pfill([TH.canopy], K.white, { z: zc });
      TH.joints.forEach((j, k) => { if (k === 8) return; const a = [335, 564], b = TH.joints[k + 1], gore = smooth([a, [(a[0] + j[0]) / 2 - (335 - j[0]) * 0.06, (a[1] + j[1]) / 2 - 14], j], false, 4).concat(smooth([b, [(a[0] + b[0]) / 2 - (335 - b[0]) * 0.06, (a[1] + b[1]) / 2 - 14], a], false, 4)); MA.set(gore); hatch(MA, T.blunt, k % 2 ? K.lilac : K.blush, { ang: 1.2 + (k - 4) * 0.16, sp: 2.4, p: k < 3 ? 0.62 : 0.4, len: [10, 36], z: zc, clip: 1 }); if (k < 3) hatch(MA, T.pencil, K.lav, { ang: -0.4, sp: 3.4, p: 0.5, len: [8, 22], z: zc, clip: 1 }); line(smooth([a, [(a[0] + j[0]) / 2 - (335 - j[0]) * 0.06, (a[1] + j[1]) / 2 - 14], j], false, 5), K.grape, { z: zc, p: 0.45, re: 0.4 }); });
      stroke(smooth([[180, 640], [200, 608], [246, 578], [335, 561], [424, 578], [470, 608], [490, 640]], false, 8), T.chalk, K.white, { p: 0.5, r: 2.2, z: zc });
      for (let x = 182; x < 492; x += 6.6) { stroke([[x, 644 + Math.abs(Math.sin(((x - 176) / 39.75) * PI)) * 9]], T.chalk, K.gold, { p: 1, r: 1.5, z: zc }); }
      out([TH.canopy], K.violet, { z: zc, p: 0.55 });
      TH.joints.forEach((j, k) => { const L = 16 + (k % 2) * 8; for (let i = 1; i <= 5; i++) stroke([[j[0], j[1] + (i * L) / 5]], T.chalk, K.cream, { p: 1, r: 1.2 }); stroke([[j[0], j[1] + L + 5]], T.chalk, K.rose, { p: 1, r: 2.2 }); });
      pfill(TH.finial, K.gold, { z: zc }); out(TH.finial, K.sienna, { z: zc }); stroke([[332, 549]], T.chalk, K.white, { p: 1, r: 1.4 });
      // a garland laid across the front
      for (let k = 0; k <= 14; k++) { const t = k / 14; marigold(176 + t * 318, 968 + Math.sin(t * PI) * 26, 8.5, 255); }
    }]);

    // ---------- the brass lamp, the plate, the conch ----------
    steps.push(['lamp and offerings', () => {
      const z = OB;
      [LP.base, LP.stem, LP.dish, LP.top].forEach((p, i) => { pfill([p], K.gold, { z }); hfill([p], K.amber, { z, ang: i % 2 ? 1.5 : 0.1, sp: 2, p: 0.62, len: [10, 40] }); MA.set(p); hatch(MA, T.pencil, K.sienna, { ang: -0.8, sp: 3.2, p: 0.5, len: [5, 14], z, clip: 1 }); line(closeP(p), K.umber, { z, p: 0.6 }); });
      stroke([[LX - 4, 1010], [LX - 3, 740]], T.chalk, K.cream, { p: 0.7, r: 1.2, z, wob: 1.2 }); [994, 930, 826, 744].forEach((y) => line([[LX - 13, y], [LX + 13, y]], K.umber, { z, p: 0.5 }));
      glow(LX, 700, 150, K.apricot, 0.2); glow(LX, 708, 70, K.lemon, 0.34);
      [-40, -21, 0, 21, 40].forEach((dx, i) => flame(LX + dx, 720 + (i % 2 ? 4 : 0) - Math.abs(dx) * 0.06, 2.3, 255));
      // plate
      pfill([PL.rim], K.gold, { z }); hfill([PL.rim], K.amber, { z, ang: 0.05, sp: 2, p: 0.55, len: [20, 60] }); pfill([PL.inner], K.lemon, { z }); hfill([PL.inner], K.gold, { z, ang: 0.4, sp: 3, p: 0.4 }); out([PL.rim, PL.inner], K.umber, { z, p: 0.55 });
      const heap = (x, y, r, c, c2) => { const P = smooth([[x - r, y], [x - r * 0.5, y - r * 0.8], [x, y - r * 1.2], [x + r * 0.5, y - r * 0.8], [x + r, y]], false, 4).concat([[x + r, y + 2], [x - r, y + 2]]); MA.set(P); scumble(MA, c, { p: 1, r: 0.14, d: 5 }); hatch(MA, T.pencil, c2, { ang: 1.1, sp: 2, p: 0.5, len: [3, 8], clip: 1 }); line(P, c2, { p: 0.45 }); };
      heap(PL.x - 36, PL.y + 2, 10, K.red, K.crimson); heap(PL.x - 16, PL.y + 7, 9, K.lemon, K.amber);
      [[20, -2], [34, 4], [16, 8], [30, -8]].forEach((q) => { const x = PL.x + q[0], y = PL.y + q[1]; MA.set(ell(x, y, 7.5, 7, 12)); scumble(MA, K.marigold, { p: 1, r: 0.14, d: 5 }); hatch(MA, T.pencil, K.sienna, { ang: 0.8, sp: 2, p: 0.5, len: [3, 8], clip: 1 }); line(ell(x, y, 7.5, 7, 12).concat([[x + 7.5, y]]), K.sienna, { p: 0.5 }); stroke([[x - 2, y - 3]], T.chalk, K.cream, { p: 1, r: 1.2 }); });
      for (let k = 0; k < 16; k++) stroke([[PL.x + rr(-52, 52), PL.y + rr(-9, 9)]], T.chalk, pick([K.white, K.white, K.pink]), { p: 1, r: rr(1, 1.8) });
      diya(PL.x - 2, PL.y - 6, 1.1, 255);
      pfill([PL.conch], K.white, { z }); hfill([PL.conch], K.blush, { z, ang: 0.3, sp: 2.4, p: 0.5, len: [6, 20] }); hfill([PL.conch], K.lav, { z, ang: -0.8, sp: 4, p: 0.4, len: [5, 14] }); out([PL.conch], K.violet, { z, p: 0.55 });
      line(smooth([[846, 1046], [858, 1040], [870, 1044], [866, 1052], [856, 1050]], false, 5), K.grape, { z, p: 0.5 }); [[880, 1040], [890, 1046], [884, 1056]].forEach((p, i) => line([[866, 1046], p], K.rose, { z, p: 0.4, re: 0.2 }));
    }]);

    // ---------- bow and quiver ----------
    steps.push(['bow and quiver', () => {
      const z = OB;
      // arrows first: they stand inside the quiver
      BW.arrows.forEach((ar, k) => { line([ar.a, ar.b], K.sand, { z: 255, p: 1, tool: T.chalk, r: 1.3, twice: false, wob: 0.2 }); line([[ar.a[0] + 1.2, ar.a[1]], [ar.b[0] + 1.2, ar.b[1]]], K.umber, { z: 255, p: 0.7, re: 0, wob: 0.2 }); stroke([ar.b], T.chalk, K.cream, { p: 1, r: 1.6 }); ar.fl.forEach((f, i) => { const c = [K.red, K.white, K.aqua, K.lemon][k % 4]; MA.set(f); scumble(MA, c, { p: 1, r: 0.12, d: 5, z: OB - 1 }); hatch(MA, T.pencil, [K.crimson, K.lav, K.teal, K.amber][k % 4], { ang: ar.ang + (i ? 0.9 : -0.9), sp: 1.7, p: 0.5, len: [3, 9], z: OB - 1, clip: 1 }); line(closeP(f), K.indigo, { z: OB - 1, p: 0.4, re: 0.2 }); }); });
      pfill([BW.qv], K.teal, { z }); hfill([BW.qv], K.sea, { z, ang: -1.36, sp: 2.2, p: 0.62, len: [20, 70] }); hfill([BW.qv], K.cobalt, { z, ang: 0.3, sp: 3.4, p: 0.45, len: [8, 24] });
      const qa = (t, s) => [1556 + (1608 - 1556) * t + (1620 - 1556 + (1664 - 1620 - (1608 - 1556)) * t) * s, 1040 + (804 - 1040) * t + (816 - 804) * t * s];
      [0.12, 0.2, 0.5, 0.58, 0.86].forEach((t, i) => { const a = qa(t, 0), b = qa(t, 1), band = [a, b, qa(t + 0.05, 1), qa(t + 0.05, 0)]; MA.set(band); scumble(MA, i % 2 ? K.gold : K.red, { p: 1, r: 0.14, d: 5, z }); line(closeP(band), K.wine, { z, p: 0.45, re: 0.2 }); });
      for (let k = 0; k < 5; k++) { const a = qa(0.27 + k * 0.045, 0.1), b = qa(0.3 + k * 0.045, 0.5), c = qa(0.27 + k * 0.045, 0.9); line([a, b, c], K.gold, { z, p: 0.8, tool: T.chalk, r: 0.6, twice: false }); }
      for (let k = 0; k < 5; k++) { const a = qa(0.64 + k * 0.04, 0.1), b = qa(0.67 + k * 0.04, 0.5), c = qa(0.64 + k * 0.04, 0.9); line([a, b, c], K.lemon, { z, p: 0.8, tool: T.chalk, r: 0.6, twice: false }); }
      out([BW.qv], K.indigo, { z, p: 0.6 }); pfill([BW.rim], K.gold, { z }); out([BW.rim], K.umber, { z, p: 0.6 });
      line(smooth([[1606, 840], [1570, 900], [1566, 980], [1576, 1030]], false, 6), K.crimson, { z: 255, p: 0.7, r: 1.6 });
      // the bow
      pfill([BW.limb], K.gold, { z }); hfill([BW.limb], K.amber, { z, ang: -1.3, sp: 1.8, p: 0.62, len: [10, 40] }); MA.set(BW.limb); hatch(MA, T.pencil, K.sienna, { ang: 0.2, sp: 3, p: 0.45, len: [4, 10], z, clip: 1 }); out([BW.limb], K.umber, { z, p: 0.62 });
      const n = BW.c.length; const seg = (i0, i1, c) => { const s = strip(BW.c.slice(i0, i1), 17, 17); MA.set(s); scumble(MA, c, { p: 1, r: 0.14, d: 5, z }); line(closeP(s), K.wine, { z, p: 0.45, re: 0.2 }); };
      seg(Math.floor(n * 0.44), Math.floor(n * 0.58), K.red); [0.16, 0.3, 0.7, 0.84].forEach((t, i) => seg(Math.floor(n * t), Math.floor(n * t) + 3, i % 2 ? K.cobalt : K.aqua));
      for (let i = Math.floor(n * 0.44); i < Math.floor(n * 0.58); i += 2) line([[BW.c[i][0] - 7, BW.c[i][1] + 2], [BW.c[i][0] + 7, BW.c[i][1] - 2]], K.wine, { z, p: 0.5, twice: false });
      stroke(BW.c.slice(4, n - 4).map((p) => [p[0] - 2.5, p[1]]), T.chalk, K.cream, { p: 0.6, r: 0.9, z, wob: 0.4 });
      line([BW.c[n - 1], BW.c[0]], K.cream, { z: OB - 2, p: 0.8, tool: T.chalk, r: 0.6, wob: 0.3 });
      // a garland hung over its upper horn
      for (let k = 0; k < 9; k++) { marigold(1742 - k * 1.6, 486 + k * 15, 7.6 - k * 0.2, 255); if (k < 7) marigold(1760 + k * 0.8, 494 + k * 15, 7.4 - k * 0.2, 255); }
    }]);

    // ---------- the peacock ----------
    steps.push(['peacock', () => {
      const z = Z.bird, zt = Z.bird - 1;
      // train: a ground of green, then long barbs drawn with the flow of the feathers
      pfill([PK.train], K.emerald, { z: zt, r: 0.5 }); MA.set(PK.train);
      for (let v = -0.96; v <= 0.96; v += 0.045) { const pts = []; for (let i = 0; i <= 24; i++) { const p = PK.at(i / 24, v + Math.sin(i * 0.5 + v * 9) * 0.02); pts.push([p[0], p[1]]); } stroke(pts, T.blunt, pick([K.teal, K.emerald, K.sea, K.leaf]), { p: rr(0.5, 0.8), z: zt, clip: MA.m, wob: 1.2 }); }
      for (let v = -0.9; v <= 0.9; v += 0.1) { const pts = []; for (let i = 0; i <= 24; i++) { const p = PK.at(i / 24, v); pts.push([p[0], p[1]]); } stroke(pts, T.pencil, K.cobalt, { p: 0.55, z: zt, clip: MA.m, wob: 1 }); stroke(pts.map((p) => [p[0] + 1.5, p[1]]), T.chalk, K.lime, { p: 0.45, r: 0.55, z: zt, clip: MA.m, wob: 1 }); }
      line(closeP(PK.train), K.sea, { z: zt, p: 0.5 });
      // the eyes of the feathers
      const eyes = []; let row = 0; for (let u = 0.2; u <= 0.97; u += 0.085, row++) { const cnt = Math.max(2, Math.round(2 + u * 5)); for (let k = 0; k < cnt; k++) { const v = -0.8 + (1.6 * (k + (row % 2 ? 0.5 : 0))) / cnt; if (v > 0.86) continue; const p = PK.at(Math.min(1, u + rr(-0.015, 0.015)), v); eyes.push([p[0], p[1], p[2], 0.7 + u * 0.6]); } } PK.tips.forEach((t) => eyes.push([t[0], t[1], t[2], 1.25]));
      { eyes.forEach((ey) => { const p = ey, s = ey[3], a = p[2], dx = Math.cos(a), dy = Math.sin(a);
        MB.set(tf(ell(0, 0, 11 * s, 8 * s, 16), p[0], p[1], 1, a)); scumble(MB, K.lime, { p: 1, r: 0.16 * s, d: 5, z: zt }); hatch(MB, T.pencil, K.gold, { ang: a + 1.2, sp: 1.8, p: 0.5, len: [3, 9], z: zt, clip: 1 });
        MB.set(tf(ell(1, 0, 7.6 * s, 5.6 * s, 14), p[0], p[1], 1, a)); scumble(MB, K.amber, { p: 1, r: 0.12 * s, d: 5, z: zt });
        MB.set(tf(ell(2, 0, 5.4 * s, 4.2 * s, 12), p[0], p[1], 1, a)); scumble(MB, K.aqua, { p: 1, r: 0.1 * s, d: 6, z: zt });
        MB.set(tf(ell(3.2, 0, 3.4 * s, 3 * s, 10), p[0], p[1], 1, a)); scumble(MB, K.ultra, { p: 1, r: 0.08 * s, d: 7, z: zt }); stroke([[p[0] + dx * 4.4 * s, p[1] + dy * 4.4 * s]], T.liner, K.indigo, { p: 1, r: 1.5 * s, z: zt }); stroke([[p[0] + dx * 1.5 * s - dy * 1.6 * s, p[1] + dy * 1.5 * s + dx * 1.6 * s]], T.chalk, K.white, { p: 1, r: 0.7 * s, z: zt });
        line(tf(ell(0, 0, 11 * s, 8 * s, 14), p[0], p[1], 1, a).concat([[p[0] + dx * 11 * s, p[1] + dy * 11 * s]]), K.moss, { z: zt, p: 0.4, re: 0.3 }); }); }
      // body, neck and head in cobalt
      pfill([PK.body, PK.neck, PK.head], K.cobalt, { z }); hfill([PK.body], K.ultra, { z, ang: 0.5, sp: 2, p: 0.65, len: [8, 26] }); hfill([PK.neck, PK.head], K.ultra, { z, ang: 1.3, sp: 2, p: 0.6, len: [6, 20] }); hfill([PK.body, PK.neck], K.teal, { z, ang: -0.6, sp: 3.4, p: 0.45, len: [5, 14] });
      MA.set(PK.neck); for (let k = 0; k < 60; k++) { const x = rr(1190, 1246), y = rr(652, 770); if (MA.m[(Math.round(y * S)) * A.W + Math.round(x * S)]) stroke(ell(x, y, 3, 2.4, 6, 0.3, PI - 0.3), T.chalk, K.aqua, { p: 0.6, r: 0.6, z, wob: 0.2 }); }
      for (let k = 0; k < 26; k++) { const x = rr(1216, 1250), y = rr(752, 790); stroke(ell(x, y, 4, 3, 6, 0.3, PI - 0.3), T.chalk, K.aqua, { p: 0.55, r: 0.6, z, wob: 0.2 }); } stroke(smooth([[1214, 716], [1206, 690], [1212, 664]], false, 5), T.chalk, K.aqua, { p: 0.5, r: 1.3, z });
      out([PK.body, PK.neck, PK.head], K.indigo, { z, p: 0.6 });
      pfill([PK.wing], K.sand, { z }); hfill([PK.wing], K.sienna, { z, ang: 0.3, sp: 2.2, p: 0.55, len: [5, 16] }); out([PK.wing], K.umber, { z, p: 0.5 }); for (let k = 0; k < 5; k++) line(ell(1258 + k * 11, 762 + (k % 2) * 5, 8, 7, 8, 0.2, PI - 0.2), K.umber, { z, p: 0.45, re: 0.2 });
      pfill([PK.beak], K.sand, { z }); out([PK.beak], K.umber, { z, p: 0.55 });
      MA.set(tf(ell(0, 0, 8, 5, 10), 1195, 640, 1, -0.3)); scumble(MA, K.white, { p: 1, r: 0.08, d: 8 }); stroke([[1194, 640]], T.liner, K.black, { p: 1, r: 2.1 }); stroke([[1193.2, 639]], T.chalk, K.white, { p: 1, r: 0.7 });
      [[1178, 596], [1190, 588], [1202, 585], [1214, 588], [1225, 596]].forEach((q) => { line([[1201, 630], q], K.indigo, { p: 0.6, re: 0.3 }); stroke([q], T.chalk, K.aqua, { p: 1, r: 2.2 }); stroke([q], T.liner, K.ultra, { p: 1, r: 1 }); });
      
    }]);

    // ---------- parrots ----------
    steps.push(['parrots', () => {
      const z = Z.bird;
      PR.forEach((p) => { pfill([p.tail], K.emerald, { z }); hfill([p.tail], K.teal, { z, ang: 1.4, sp: 1.8, p: 0.55, len: [8, 30] }); pfill([p.body, p.head], K.leaf, { z }); hfill([p.body, p.head], K.emerald, { z, ang: 1.1, sp: 2, p: 0.55, len: [5, 16] }); MA.set(p.wing); hatch(MA, T.blunt, K.moss, { ang: 1.3, sp: 1.8, p: 0.6, len: [5, 14], z, clip: 1 }); hatch(MA, T.pencil, K.cobalt, { ang: -0.3, sp: 3, p: 0.4, len: [4, 10], z, clip: 1 }); pfill([p.beak], K.red, { z }); out([p.body, p.head, p.tail, p.beak], K.moss, { z, p: 0.55 }); line(p.q(ell(4, -30, 9, 3, 8, 0.2, PI - 0.2)), K.rose, { z, p: 0.7, twice: false }); stroke([p.eye], T.liner, K.black, { p: 1, r: 1.4 }); stroke([[p.eye[0] - 0.6, p.eye[1] - 0.6]], T.chalk, K.white, { p: 1, r: 0.5 }); stroke(p.q([[2, -44], [8, -41]]), T.chalk, K.lime, { p: 0.7, r: 0.8 }); });
    }]);

    // ---------- last: a lamp every few hands along the rail, and the glints that make metal metal ----------
    steps.push(['lamps on the rail', () => {
      for (let x = 150; x < 1790; x += 58) { if ([520, 960, 1400].some((q) => Math.abs(x - q) < 28) || (x > 1196 && x < 1340) || (x > 160 && x < 500 && false)) continue; diya(x, 789, 1.15, 255); }
      [[610, 1022], [1700, 1040]].forEach((p) => diya(p[0] + 70, p[1] + 26, 1.2, 255)); diya(240, 1066, 1.3, 255); diya(430, 1066, 1.3, 255); diya(1500, 1070, 1.25, 255); diya(980, 1068, 1.3, 255); diya(1200, 1066, 1.25, 255);
      const glint = (x, y, L) => { stroke([[x - L, y], [x + L, y]], T.chalk, K.white, { p: 0.8, r: 0.6, tin: 0.5, tout: 0.5, wob: 0 }); stroke([[x, y - L], [x, y + L]], T.chalk, K.white, { p: 0.8, r: 0.6, tin: 0.5, tout: 0.5, wob: 0 }); stroke([[x, y]], T.chalk, K.white, { p: 1, r: 1.2 }); };
      glint(335, 545, 9); glint(292, 926, 8); glint(370, 926, 8); glint(LX, 696, 10); glint(1776, 640, 8); glint(1636, 806, 7); glint(PL.x + 50, PL.y - 6, 6);
    }]);
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
