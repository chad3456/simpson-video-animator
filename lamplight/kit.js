/* Lamplight: puppet kit.
   Every puppet is drawn in profile, facing right, in the style of Tholu Bommalata
   leather puppets: translucent coloured hide, heavy black cut lines, and rows of
   punched holes that let the lamp shine through. Origin is at the feet. */
(function (root) {
  const LL = root.LL || (root.LL = {});
  const K = (LL.K = {});
  const INK = (K.INK = '#1c0d05');
  const HOLE = '#fff4d8';
  const GOLD = (K.GOLD = '#efb431');
  const GEM = '#c41f2a';

  const cen = (pts) => {
    let x = 0, y = 0;
    for (const p of pts) { x += p[0]; y += p[1]; }
    return [x / pts.length, y / pts.length];
  };

  K.path = function (g, pts, closed = true, smooth = true) {
    g.beginPath();
    const n = pts.length;
    if (!smooth) {
      g.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < n; i++) g.lineTo(pts[i][0], pts[i][1]);
      if (closed) g.closePath();
      return;
    }
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    if (closed) {
      const s = mid(pts[n - 1], pts[0]);
      g.moveTo(s[0], s[1]);
      for (let i = 0; i < n; i++) {
        const p = pts[i], e = mid(p, pts[(i + 1) % n]);
        g.quadraticCurveTo(p[0], p[1], e[0], e[1]);
      }
      g.closePath();
    } else {
      g.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < n - 1; i++) {
        const e = mid(pts[i], pts[i + 1]);
        g.quadraticCurveTo(pts[i][0], pts[i][1], e[0], e[1]);
      }
      g.lineTo(pts[n - 1][0], pts[n - 1][1]);
    }
  };

  // dots along a polyline: the punched holes
  K.dots = function (g, pts, sp, r, closed) {
    const seg = pts.slice();
    if (closed) seg.push(pts[0]);
    g.fillStyle = HOLE;
    let carry = sp / 2;
    for (let i = 0; i < seg.length - 1; i++) {
      const a = seg[i], b = seg[i + 1];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      let d = carry;
      while (d < L) {
        const f = d / L;
        g.beginPath();
        g.arc(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, r, 0, 6.2832);
        g.fill();
        d += sp;
      }
      carry = d - L;
    }
  };

  K.shape = function (g, pts, fill, o = {}) {
    K.path(g, pts, true, o.smooth !== false);
    g.fillStyle = fill;
    g.fill();
    if (o.lw !== 0) {
      g.lineWidth = o.lw || 3.2;
      g.strokeStyle = INK;
      g.lineJoin = 'round';
      g.stroke();
    }
    if (o.perf) {
      const c = cen(pts), k = o.inset || 0.78;
      K.dots(g, pts.map((p) => [c[0] + (p[0] - c[0]) * k, c[1] + (p[1] - c[1]) * k]), o.perf, o.pr || 1.7, true);
    }
  };

  K.limb = function (g, pts, w, fill) {
    g.lineCap = 'round';
    g.lineJoin = 'round';
    K.path(g, pts, false, pts.length > 2);
    g.strokeStyle = INK;
    g.lineWidth = w + 6;
    g.stroke();
    g.strokeStyle = fill;
    g.lineWidth = w;
    g.stroke();
  };

  K.line = function (g, pts, w, col, smooth) {
    g.lineCap = 'round';
    g.lineJoin = 'round';
    K.path(g, pts, false, !!smooth);
    g.strokeStyle = col || INK;
    g.lineWidth = w;
    g.stroke();
  };

  K.circle = function (g, x, y, r, fill, lw) {
    g.beginPath();
    g.arc(x, y, r, 0, 6.2832);
    if (fill) { g.fillStyle = fill; g.fill(); }
    if (lw !== 0) { g.lineWidth = lw || 2.5; g.strokeStyle = INK; g.stroke(); }
  };

  K.band = function (g, x1, y1, x2, y2, w, col) {
    // jewelled band: gold stroke with gem dots
    K.line(g, [[x1, y1], [x2, y2]], w + 4, INK);
    K.line(g, [[x1, y1], [x2, y2]], w, col || GOLD);
    const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / 9));
    g.fillStyle = HOLE;
    for (let i = 0; i <= n; i++) {
      g.beginPath();
      g.arc(x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n, w * 0.22, 0, 6.2832);
      g.fill();
    }
  };

  // ---------------- heads ----------------
  // head centred at (0,0), about 64 units tall, facing right
  K.head = function (g, o = {}) {
    const skin = o.skin || '#f0b483';
    // hair behind
    if (o.female) {
      K.shape(g, [[-30, -18], [-24, -32], [-4, -36], [12, -32], [-6, -22], [-14, 4], [-26, 22], [-38, 12]], '#2a1408', { lw: 2.5 });
    }
    if (o.long) {
      K.shape(g, [[-22, -10], [-34, 10], [-40, 46], [-30, 60], [-18, 30], [-12, 12]], '#2a1408', { lw: 2.5 });
    }
    // ear (drawn before face so face overlaps a little)
    g.beginPath();
    if (o.monkey) {
      K.path(g, [[-14, -10], [-4, -14], [2, -2], [-6, 8], [-16, 4]]);
    } else {
      K.path(g, [[-12, -12], [-2, -12], [0, 0], [-4, 10], [-12, 6]]);
    }
    g.fillStyle = skin; g.fill(); g.lineWidth = 2.2; g.strokeStyle = INK; g.stroke();
    g.beginPath();
    if (o.monkey) {
      g.moveTo(-6, -32);
      g.quadraticCurveTo(10, -38, 20, -24);
      g.quadraticCurveTo(26, -16, 30, -14);
      g.quadraticCurveTo(44, -10, 42, 4);
      g.quadraticCurveTo(40, 14, 28, 14);
      g.quadraticCurveTo(32, 20, 22, 26);
      g.quadraticCurveTo(8, 30, -4, 30);
      g.lineTo(-16, 28);
      g.quadraticCurveTo(-32, 6, -26, -14);
      g.quadraticCurveTo(-20, -32, -6, -32);
    } else {
      g.moveTo(-6, -31);
      g.quadraticCurveTo(14, -35, 22, -22);
      g.lineTo(25, -12);
      g.lineTo(34, 0);
      g.lineTo(25, 3);
      g.quadraticCurveTo(29, 6, 26, 9);
      g.quadraticCurveTo(30, 12, 25, 15);
      g.quadraticCurveTo(26, 23, 15, 25);
      g.quadraticCurveTo(4, 27, -2, 31);
      g.lineTo(-15, 31);
      g.quadraticCurveTo(-31, 8, -26, -13);
      g.quadraticCurveTo(-22, -31, -6, -31);
    }
    g.closePath();
    g.fillStyle = skin; g.fill();
    g.lineWidth = 3; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke();
    if (o.monkey) {
      // muzzle seam and mouth
      K.line(g, [[20, -10], [24, 6], [40, 6]], 2, INK);
      K.line(g, [[18, 18], [30, 15]], 2, INK);
      K.dots(g, [[-18, -20], [-22, 0], [-14, 22]], 7, 1.5);
    }
    // eye
    const ex = o.monkey ? 10 : 12, ey = o.monkey ? -16 : -8, er = o.demon ? 1.35 : 1;
    g.beginPath();
    g.moveTo(ex - 9 * er, ey);
    g.quadraticCurveTo(ex, ey - 7 * er, ex + 9 * er, ey);
    g.quadraticCurveTo(ex, ey + 6 * er, ex - 9 * er, ey);
    g.fillStyle = HOLE; g.fill(); g.lineWidth = 2; g.strokeStyle = INK; g.stroke();
    K.circle(g, ex + 2, ey, 3 * er, INK, 0);
    K.line(g, [[ex - 9 * er, ey], [ex - 15 * er, ey + 2]], 2, INK);
    // brow
    K.line(g, [[ex - 8, ey - 8 * er], [ex, ey - 12 * er], [ex + 10, ey - 8 * er]], o.demon ? 3.5 : 2.2, INK, true);
    if (o.tilak) {
      K.line(g, [[17, -28], [16, -18], [19, -15], [21, -18], [20, -28]], 2.2, HOLE);
      K.line(g, [[18.5, -27], [18.5, -17]], 1.6, GEM);
    }
    if (o.bindi) K.circle(g, 19, -20, 2.4, GEM, 0);
    if (o.moustache) {
      K.line(g, [[27, 5], [18, 6], [12, 2], [8, -2]], 3, INK, true);
    }
    if (o.demon) {
      g.fillStyle = HOLE;
      g.beginPath(); g.moveTo(24, 10); g.lineTo(28, 10); g.lineTo(26, 17); g.closePath(); g.fill();
    }
    if (o.beard) {
      K.shape(g, [[-6, 24], [24, 20], [30, 34], [20, 58], [6, 66], [-2, 46]], o.beard, { lw: 2.5, perf: 7, inset: 0.6 });
    }
    // earring
    if (!o.monkey) {
      K.circle(g, -7, 14, 6, GOLD, 2);
      K.circle(g, -7, 14, 2.2, HOLE, 0);
    }
    // headgear
    if (o.crown === 'kirita') K.kirita(g, o.crownCol);
    else if (o.crown === 'small') K.kirita(g, o.crownCol, 0.62);
    else if (o.crown === 'jata') K.jata(g);
    else if (o.crown === 'bun') K.bun(g);
    else if (o.crown === 'fur') K.shape(g, [[-26, -14], [-20, -34], [0, -40], [20, -30], [6, -26], [-10, -24]], '#7a3a14', { lw: 2.5, perf: 6 });
  };

  // tall tiered crown
  K.kirita = function (g, col, sc = 1) {
    g.save();
    g.translate(-2, -28);
    g.scale(sc, sc);
    col = col || GOLD;
    // halo fan behind
    K.shape(g, [[-26, 0], [-30, -20], [-22, -36], [-26, -50], [-12, -48], [-4, -60], [6, -48], [16, -50], [16, -36], [24, -20], [22, 0]], col, { lw: 2.6, perf: 6.5, inset: 0.72 });
    for (let i = 0; i < 4; i++) {
      const y = -8 - i * 20, w = 22 - i * 4;
      K.shape(g, [[-w, y], [w, y], [w - 3, y - 20], [-w + 3, y - 20]], i % 2 ? '#e48a24' : col, { smooth: false, lw: 2.4 });
      K.dots(g, [[-w + 4, y - 10], [w - 4, y - 10]], 6, 1.6);
      K.circle(g, 0, y - 10, 3, GEM, 1.5);
    }
    K.shape(g, [[-8, -88], [8, -88], [0, -112]], col, { smooth: false, lw: 2.4 });
    K.circle(g, 0, -114, 4, GEM, 1.5);
    // brow band
    K.shape(g, [[-26, 4], [24, 2], [24, -8], [-26, -6]], col, { smooth: false, lw: 2.4 });
    K.dots(g, [[-22, -2], [22, -3]], 6, 1.7);
    g.restore();
  };

  // rishi's matted hair
  K.jata = function (g) {
    K.shape(g, [[-22, -24], [-16, -40], [-10, -60], [4, -66], [14, -56], [12, -36], [18, -26], [-4, -30]], '#3a2410', { lw: 2.6 });
    K.band(g, -14, -44, 12, -46, 5, '#8a5a2a');
  };

  K.bun = function (g) {
    K.circle(g, -24, -20, 13, '#2a1408', 2.5);
    K.band(g, -20, -30, 20, -33, 5);
    K.circle(g, -24, -20, 4, GOLD, 1.5);
    K.dots(g, [[-34, -14], [-30, -6], [-20, -6]], 5, 1.3);
  };

  // ---------------- people ----------------
  // pose: { arms:[[upper, fore],[upper, fore]] back then front (radians from straight down, + forward),
  //         stride (-1..1), sit, bow (torso lean), head:{...}, hold(g,x,y,ang) for front hand }
  const ARM1 = 74, ARM2 = 68;
  function armPts(sx, sy, a1, a2) {
    const ex = sx + ARM1 * Math.sin(a1), ey = sy + ARM1 * Math.cos(a1);
    const hx = ex + ARM2 * Math.sin(a1 + a2), hy = ey + ARM2 * Math.cos(a1 + a2);
    return [[sx, sy], [ex, ey], [hx, hy]];
  }
  K.armPts = armPts;

  function arm(g, pts, skin, o) {
    K.limb(g, [pts[0], pts[1]], 17, skin);
    K.limb(g, [pts[1], pts[2]], 14, skin);
    K.circle(g, pts[2][0], pts[2][1], 9, skin, 2.5);
    // armlet and bangles
    const mx = (pts[0][0] + pts[1][0]) / 2, my = (pts[0][1] + pts[1][1]) / 2;
    K.circle(g, mx, my, 5, GOLD, 2);
    const bx = pts[1][0] + (pts[2][0] - pts[1][0]) * 0.8, by = pts[1][1] + (pts[2][1] - pts[1][1]) * 0.8;
    K.circle(g, bx, by, 5, o && o.bangle ? o.bangle : GOLD, 2);
  }

  K.person = function (g, o = {}) {
    const skin = o.skin || '#f0b483';
    const c1 = o.cloth || '#f2c230', c2 = o.cloth2 || '#d8442c';
    const arms = o.arms || [[-0.2, 0.3], [0.25, 0.35]];
    const s = o.stride || 0;
    const lean = o.lean || 0;
    g.save();
    if (o.sit) {
      g.translate(0, 90);
    } else if (o.kneel) {
      g.translate(0, 74);
    }
    // ---- legs
    const hipB = [-2, -176], hipF = [16, -176];
    let backLeg, frontLeg;
    if (o.sit) {
      backLeg = [hipB, [56, -150], [26, -96]];
      frontLeg = [hipF, [70, -140], [44, -92]];
    } else if (o.kneel) {
      backLeg = [hipB, [-16, -86], [-74, -80]];
      frontLeg = [hipF, [70, -150], [66, -80]];
    } else {
      backLeg = [hipB, [-8 - 16 * s, -92], [-16 - 34 * s, -12]];
      frontLeg = [hipF, [30 + 16 * s, -92], [36 + 34 * s, -12]];
    }
    // ---- torso transform (lean around hips)
    const torso = () => { g.translate(6, -176); g.rotate(lean); g.translate(-6, 176); };
    const legsHidden = o.female && !o.sit;
    if (!legsHidden) {
      K.limb(g, backLeg, 18, skin);
      foot(g, backLeg[2], skin);
    }
    // back arm (behind torso)
    g.save(); torso();
    const sh = [10, -282];
    const ab = armPts(sh[0] - 8, sh[1], arms[0][0], arms[0][1]);
    arm(g, ab, skin, o);
    if (o.holdBack) { g.save(); o.holdBack(g, ab[2][0], ab[2][1], arms[0][0] + arms[0][1]); g.restore(); }
    g.restore();
    if (!legsHidden) {
      K.limb(g, frontLeg, 19, skin);
      foot(g, frontLeg[2], skin);
      K.circle(g, frontLeg[2][0], frontLeg[2][1] - 6, 4, GOLD, 1.5);
    }
    // ---- lower garment
    if (o.female && !o.sit) {
      K.shape(g, [[-28, -212], [36, -212], [52, -120], [74, -8], [30, -2], [-12, -2], [-40, -8], [-34, -120]], c2, { lw: 3, perf: 9, inset: 0.86 });
      K.line(g, [[-38, -14], [70, -14]], 7, c1);
      for (let i = 0; i < 4; i++) K.line(g, [[10 + i * 9, -150], [18 + i * 14, -20]], 1.6, INK);
      // feet peeking
      K.shape(g, [[34, -8], [62, -6], [64, 2], [30, 2]], skin, { lw: 2.2 });
    } else if (o.sit) {
      K.shape(g, [[-28, -212], [36, -212], [44, -176], [84, -150], [70, -124], [-20, -120], [-38, -160]], c1, { lw: 3, perf: 8, inset: 0.8 });
    } else if (o.robe) {
      K.shape(g, [[-30, -214], [38, -214], [50, -130], [60, -40], [-30, -40], [-44, -130]], c1, { lw: 3, perf: 9 });
    } else {
      K.shape(g, [[-30, -212], [38, -212], [54, -160], [66, -112], [34, -122], [10, -108], [-24, -114], [-40, -150]], c1, { lw: 3, perf: 8, inset: 0.82 });
      K.line(g, [[-26, -128], [8, -116], [36, -128], [60, -118]], 5, c2, true);
      for (let i = 0; i < 3; i++) K.line(g, [[4 + i * 9, -200], [8 + i * 12, -122]], 1.6, INK);
    }
    // ---- torso
    g.save(); torso();
    K.shape(g, [[-28, -206], [38, -206], [42, -236], [46, -268], [32, -290], [-4, -294], [-28, -280], [-34, -240]], o.top || skin, { lw: 3 });
    // waist sash
    K.shape(g, [[-31, -214], [40, -214], [40, -200], [-31, -200]], c2, { smooth: false, lw: 2.5 });
    K.dots(g, [[-26, -207], [36, -207]], 6, 1.6);
    if (o.female) {
      K.shape(g, [[-26, -250], [40, -252], [44, -276], [26, -290], [-20, -282]], c2, { lw: 2.5, perf: 6, inset: 0.7 });
      // pallu sweeping over the shoulder and behind
      K.shape(g, [[30, -284], [44, -250], [20, -210], [-30, -250], [-60, -230], [-74, -260], [-30, -296], [10, -300]], c1, { lw: 2.6, perf: 8, inset: 0.75 });
    } else {
      // sacred thread / uttariya
      K.line(g, [[30, -288], [-2, -232], [-26, -206]], 4, o.sash || HOLE);
    }
    // necklaces
    K.line(g, [[-12, -292], [6, -270], [30, -284]], 5, INK, true);
    K.line(g, [[-12, -292], [6, -270], [30, -284]], 3, GOLD, true);
    K.line(g, [[-16, -290], [4, -254], [34, -276]], 3.5, INK, true);
    K.line(g, [[-16, -290], [4, -254], [34, -276]], 2, GOLD, true);
    K.circle(g, 4, -254, 4, GEM, 1.5);
    // neck
    K.shape(g, [[-2, -288], [22, -288], [20, -308], [0, -306]], skin, { smooth: false, lw: 2.5 });
    // head
    g.save();
    g.translate(8, o.monkey ? -330 : -334);
    g.rotate(o.headTilt || 0);
    if (o.headScale) g.scale(o.headScale, o.headScale);
    K.head(g, Object.assign({ skin: o.face || skin, female: o.female, monkey: o.monkey }, o.head || {}));
    g.restore();
    if (o.drawExtra) o.drawExtra(g);
    // front arm
    const af = armPts(sh[0] + 8, sh[1], arms[1][0], arms[1][1]);
    arm(g, af, skin, o);
    if (o.hold) { g.save(); o.hold(g, af[2][0], af[2][1], arms[1][0] + arms[1][1]); g.restore(); }
    g.restore();
    g.restore();
  };

  function foot(g, a, skin) {
    K.shape(g, [[a[0] - 8, a[1] - 6], [a[0] + 24, a[1] + 2], [a[0] + 26, a[1] + 10], [a[0] - 10, a[1] + 10]], skin, { lw: 2.4 });
  }

  // monkey tail, drawn behind a vanara
  K.tail = function (g, t, col) {
    const w = Math.sin(t * 1.3) * 12;
    K.limb(g, [[-24, -180], [-70, -170], [-96, -220 + w], [-84, -270 + w], [-58, -262]], 9, col || '#c8692a');
  };

  // ---------------- weapons and objects ----------------
  K.bow = function (g, len, bend, col) {
    // vertical bow centred at 0, string on the left; bend 0..1
    const L = len / 2, b = 14 + bend * 60;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(0, -L);
    g.bezierCurveTo(b + 10, -L * 0.6, b + 10, L * 0.6, 0, L);
    g.lineWidth = 15; g.strokeStyle = INK; g.stroke();
    g.lineWidth = 9; g.strokeStyle = col || '#b06a2a'; g.stroke();
    g.beginPath();
    g.moveTo(0, -L); g.lineTo(-bend * 46, 0); g.lineTo(0, L);
    g.lineWidth = 2; g.strokeStyle = INK; g.stroke();
    K.circle(g, b * 0.75 + 7, 0, 6, GOLD, 2);
  };

  K.arrow = function (g, len, col) {
    K.line(g, [[-len, 0], [0, 0]], 5, INK);
    K.line(g, [[-len, 0], [0, 0]], 2.5, col || '#d9a24a');
    K.shape(g, [[0, -6], [16, 0], [0, 6]], col || '#d9d9d9', { smooth: false, lw: 2 });
    K.shape(g, [[-len, 0], [-len + 14, -9], [-len + 20, 0], [-len + 14, 9]], '#c8402a', { smooth: false, lw: 2 });
  };

  K.mace = function (g) {
    K.line(g, [[0, 0], [0, -120]], 8, INK);
    K.line(g, [[0, 0], [0, -120]], 4, '#b06a2a');
    K.circle(g, 0, -136, 22, GOLD, 3);
    K.dots(g, [[-12, -136], [0, -150], [12, -136], [0, -122]], 8, 2, true);
  };

  K.garland = function (g, r, col) {
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      K.circle(g, Math.cos(a) * r, Math.sin(a) * r * 1.4, 6, i % 2 ? (col || '#f08a24') : '#f6d040', 1.5);
    }
  };

  K.sandals = function (g) {
    for (let i = 0; i < 2; i++) {
      g.save(); g.translate(i * 34, 0);
      K.shape(g, [[-10, -4], [10, -6], [14, 40], [-12, 42]], '#c98a3a', { lw: 2.5 });
      K.circle(g, 2, 6, 5, GOLD, 2);
      g.restore();
    }
  };

  K.diya = function (g, lit, t, i) {
    K.shape(g, [[-22, -6], [22, -6], [14, 10], [-14, 10]], '#c4602a', { lw: 2.5 });
    K.dots(g, [[-14, 2], [14, 2]], 7, 1.6);
    if (lit > 0) K.flame(g, 0, -8, 12 * lit, t + (i || 0) * 1.7);
  };

  K.flame = function (g, x, y, s, t) {
    const w = Math.sin(t * 9) * 0.12 + Math.sin(t * 13.7) * 0.08;
    g.save(); g.translate(x, y); g.scale(s / 12, s / 12);
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(-9, -6, -6, -18, (w * 30), -32);
    g.bezierCurveTo(6, -18, 9, -6, 0, 0);
    g.fillStyle = '#ffd36a'; g.fill();
    g.beginPath(); g.ellipse(0, -7, 3, 6, 0, 0, 6.28); g.fillStyle = '#fff8e0'; g.fill();
    g.restore();
  };

  // ---------------- animals ----------------
  K.deer = function (g, t, gait, o = {}) {
    const body = o.col || '#efbe3a';
    const lg = (ph) => Math.sin(t * gait + ph) * 0.45 * (gait > 0 ? 1 : 0);
    const leg = (x, ph, w) => {
      const a = lg(ph);
      K.limb(g, [[x, -110], [x + 30 * Math.sin(a), -60], [x + 40 * Math.sin(a) - 4, -6]], w, body);
    };
    leg(-50, 0, 9); leg(40, Math.PI, 9);
    K.shape(g, [[-80, -150], [-20, -168], [50, -160], [80, -136], [66, -104], [10, -96], [-60, -100], [-86, -120]], body, { lw: 3, perf: 0 });
    // spots: holes
    g.fillStyle = HOLE;
    for (let i = 0; i < 16; i++) {
      const x = -66 + (i % 8) * 18 + (i > 7 ? 9 : 0), y = -140 + (i > 7 ? 22 : 0);
      g.beginPath(); g.arc(x, y, 3.2, 0, 6.28); g.fill();
    }
    K.limb(g, [[-80, -126], [-96, -136], [-102, -128]], 6, body);
    leg(-30, Math.PI, 10); leg(60, 0, 10);
    // neck & head
    K.shape(g, [[52, -150], [78, -222], [96, -230], [88, -150], [74, -132]], body, { lw: 3 });
    K.shape(g, [[80, -236], [100, -246], [132, -226], [128, -214], [96, -212]], body, { lw: 3 });
    K.circle(g, 104, -230, 3.5, INK, 0);
    // antlers
    g.save(); g.translate(92, -244);
    const ant = (sx) => {
      K.line(g, [[0, 0], [sx * 6, -40], [sx * 2, -70]], 4, INK, true);
      K.line(g, [[sx * 5, -30], [sx * 24, -50]], 3.5, INK);
      K.line(g, [[sx * 3, -52], [sx * 20, -78]], 3.5, INK);
      K.line(g, [[sx * 4, -20], [sx * -12, -40]], 3, INK);
    };
    ant(1); ant(-0.7);
    g.restore();
    K.dots(g, [[90, -150], [82, -210]], 7, 1.6);
  };

  // the rakshasa hiding in the deer: a huge horned demon, drawn only as shadow
  K.demonShade = function (g, t) {
    g.save();
    K.person(g, {
      skin: INK, cloth: INK, cloth2: INK, stride: 0.6, lean: 0.12,
      arms: [[-1.4, -0.6], [1.9, 0.5]],
      head: { demon: true, crown: 'none' },
      drawExtra(g) {
        // horns and wild hair
        g.save(); g.translate(8, -334);
        K.shape(g, [[-10, -26], [-30, -70], [-6, -40]], INK, { smooth: false });
        K.shape(g, [[8, -28], [10, -78], [22, -36]], INK, { smooth: false });
        K.shape(g, [[-26, -20], [-60, -10], [-46, 10], [-70, 30], [-30, 20]], INK, { smooth: false });
        g.restore();
      },
      hold(g, x, y, a) { g.translate(x, y); g.rotate(-a + 1.4); K.shape(g, [[0, -6], [70, -14], [86, 0], [70, 10], [0, 6]], INK, { smooth: false }); }
    });
    g.restore();
  };

  K.vulture = function (g, t, flap, o = {}) {
    const body = o.col || '#9a6a3a';
    const w = Math.sin(t * flap) * 0.6;
    const wing = (side, col) => {
      g.save(); g.translate(-10, -20); g.rotate(-0.4 + w * side);
      const pts = [[0, 0], [-40, -60], [-110, -96], [-170, -100], [-150, -80], [-180, -66], [-140, -50], [-170, -30], [-110, -20], [-60, 6]];
      K.shape(g, pts, col, { lw: 3, perf: 10, inset: 0.74 });
      for (let i = 0; i < 5; i++) K.line(g, [[-50 - i * 22, -10 - i * 10], [-80 - i * 22, -50 - i * 12]], 2, INK);
      g.restore();
    };
    wing(1, '#7a4a24');
    K.shape(g, [[-60, -10], [-20, -36], [40, -30], [60, -10], [20, 10], [-40, 10], [-80, 22]], body, { lw: 3 });
    // neck and bald head
    K.limb(g, [[40, -24], [64, -40], [78, -44]], 10, '#e8a070');
    K.shape(g, [[70, -54], [92, -52], [104, -40], [96, -36], [88, -40], [72, -34]], '#e8a070', { lw: 2.5 });
    K.shape(g, [[96, -44], [110, -40], [104, -30], [98, -36]], '#d8d0a0', { smooth: false, lw: 2 });
    K.circle(g, 84, -46, 2.5, INK, 0);
    // ruff
    K.shape(g, [[30, -30], [44, -40], [52, -26], [44, -14]], HOLE, { lw: 2 });
    K.limb(g, [[0, 6], [10, 30], [20, 34]], 5, '#d8b070');
    wing(-0.6, body);
    if (o.crown) { g.save(); g.translate(84, -60); g.scale(0.4, 0.4); K.kirita(g); g.restore(); }
  };

  K.crane = function (g, t, ph) {
    const b = Math.sin(t * 2 + ph) * 6;
    K.limb(g, [[0, -80], [-4, -40], [-2, 0]], 4, '#d8d0b8');
    K.limb(g, [[10, -80], [16, -40], [18, 0]], 4, '#d8d0b8');
    K.shape(g, [[-50, -110], [-10, -124], [30, -110], [20, -84], [-30, -86], [-64, -96]], '#e8e2cc', { lw: 2.5, perf: 7 });
    K.limb(g, [[20, -110], [34, -150 + b], [30, -186 + b]], 7, '#e8e2cc');
    K.shape(g, [[22, -196 + b], [40, -196 + b], [78, -184 + b], [38, -180 + b]], '#e8e2cc', { smooth: false, lw: 2 });
    K.circle(g, 32, -192 + b, 5, '#c8202a', 1.5);
    K.circle(g, 34, -190 + b, 1.8, INK, 0);
  };

  K.squirrel = function (g, t, run, stripes) {
    const b = run ? Math.abs(Math.sin(t * 14)) * 6 : 0;
    const fur = '#b8885a';
    g.save(); g.translate(0, -b);
    // bushy tail curling up over the back
    const w = run ? Math.sin(t * 14) * 4 : Math.sin(t * 2) * 3;
    K.shape(g, [[-30, -16], [-58, -30], [-74, -62], [-70, -100 + w], [-48, -118 + w], [-30, -108 + w], [-46, -92 + w], [-50, -66], [-36, -40], [-16, -26]], '#a87a4a', { lw: 2.5, perf: 6, inset: 0.7 });
    // body
    K.shape(g, [[-34, -8], [-30, -30], [-6, -40], [20, -36], [34, -20], [26, -4], [-6, 0]], fur, { lw: 2.5 });
    // head with ear and nose
    K.shape(g, [[22, -34], [30, -48], [42, -50], [56, -40], [62, -32], [48, -26], [30, -24]], fur, { lw: 2.2 });
    K.shape(g, [[30, -46], [34, -60], [40, -48]], fur, { smooth: false, lw: 2 });
    K.circle(g, 46, -40, 2.4, INK, 0);
    K.circle(g, 62, -33, 2, INK, 0);
    K.limb(g, [[20, -10], [28, 2]], 4, fur);
    K.limb(g, [[-18, -8], [-24, 2]], 5, fur);
    K.limb(g, [[30, -24], [40, -14]], 3.5, fur);
    if (stripes > 0) {
      g.globalAlpha = stripes;
      for (let i = 0; i < 3; i++) K.line(g, [[-26, -16 - i * 7], [-4, -30 - i * 4], [24, -28 - i * 4]], 2.6, '#fff4d8', true);
      g.globalAlpha = 1;
    }
    g.restore();
  };

  // ---------------- sets ----------------
  K.tree = function (g, h, col, t, seed) {
    seed = seed || 1;
    K.limb(g, [[0, 0], [6, -h * 0.4], [-4, -h * 0.7]], 16, '#7a4a24');
    K.limb(g, [[4, -h * 0.45], [50, -h * 0.7]], 8, '#7a4a24');
    K.limb(g, [[0, -h * 0.55], [-46, -h * 0.75]], 8, '#7a4a24');
    const sw = Math.sin(t * 0.8 + seed) * 4;
    const blobs = [[-50, -0.78, 46], [50, -0.76, 50], [0, -0.92, 60], [-20, -1.05, 44], [30, -1.04, 40]];
    for (const [x, fy, r] of blobs) {
      const cx = x + sw, cy = h * fy;
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * 6.283, rr = r * (i % 2 ? 0.78 : 1);
        pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.8]);
      }
      K.shape(g, pts, col || '#4c9a4a', { lw: 2.6, perf: 9, inset: 0.6 });
    }
  };

  K.palm = function (g, h, t, seed) {
    K.limb(g, [[0, 0], [10, -h * 0.5], [4, -h]], 12, '#8a5a2a');
    const sw = Math.sin(t + (seed || 0)) * 0.06;
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.5 + sw;
      g.save(); g.translate(4, -h); g.rotate(a);
      K.shape(g, [[0, 0], [40, -14], [90, -4], [110, 16], [60, 4], [20, 8]], '#5aa04a', { lw: 2.2 });
      g.restore();
    }
  };

  K.hut = function (g) {
    K.shape(g, [[-110, 0], [-100, -130], [100, -130], [110, 0]], '#b08048', { smooth: false, lw: 3, perf: 12 });
    K.shape(g, [[-150, -120], [0, -230], [150, -120]], '#c89a4a', { smooth: false, lw: 3 });
    for (let i = 0; i < 8; i++) K.line(g, [[-130 + i * 37, -120], [0, -226]], 1.5, INK);
    K.shape(g, [[-30, 0], [-30, -80], [30, -80], [30, 0]], '#2a1408', { smooth: false, lw: 3 });
  };

  K.throne = function (g) {
    K.shape(g, [[-70, 0], [-70, -90], [-90, -90], [-90, -230], [-60, -260], [-40, -220], [-40, -110], [70, -110], [80, -90], [70, -60], [70, 0]], '#d89a2a', { smooth: false, lw: 3, perf: 10, inset: 0.84 });
    K.shape(g, [[-50, -110], [80, -110], [80, -90], [-50, -90]], GEM, { smooth: false, lw: 2.5 });
    K.circle(g, -66, -250, 12, GOLD, 2.5);
  };

  K.palace = function (g, w, t) {
    // a wall of Ayodhya with domed towers; returns niche positions for lamps
    const towers = [];
    const n = Math.round(w / 260);
    K.shape(g, [[-w / 2, 0], [-w / 2, -160], [w / 2, -160], [w / 2, 0]], '#c88a3a', { smooth: false, lw: 3 });
    for (let i = 0; i < w / 40; i++) K.shape(g, [[-w / 2 + i * 40, -160], [-w / 2 + i * 40 + 20, -186], [-w / 2 + i * 40 + 40, -160]], '#c88a3a', { smooth: false, lw: 2.5 });
    for (let i = 0; i <= n; i++) {
      const x = -w / 2 + (i * w) / n;
      K.shape(g, [[x - 46, -150], [x - 46, -300], [x + 46, -300], [x + 46, -150]], '#d8a040', { smooth: false, lw: 3, perf: 11 });
      K.shape(g, [[x - 56, -300], [x - 40, -350], [x, -380], [x + 40, -350], [x + 56, -300]], '#e8b84a', { lw: 3, perf: 9, inset: 0.7 });
      K.line(g, [[x, -380], [x, -414]], 3, INK);
      K.shape(g, [[x, -414], [x + 30, -404], [x, -394]], GEM, { smooth: false, lw: 2 });
      K.shape(g, [[x - 18, -160], [x - 18, -230], [x, -250], [x + 18, -230], [x + 18, -160]], '#2a1408', { lw: 2.5 });
      towers.push(x);
    }
    // arched gateway band
    for (let i = 0; i < n; i++) {
      const x = -w / 2 + ((i + 0.5) * w) / n;
      K.shape(g, [[x - 34, 0], [x - 34, -80], [x, -116], [x + 34, -80], [x + 34, 0]], '#3a1a08', { lw: 2.5 });
    }
    return towers;
  };

  K.waves = function (g, w, t, col, amp) {
    amp = amp || 1;
    for (let r = 0; r < 3; r++) {
      const y0 = r * 30, pts = [[-w / 2, 80]];
      for (let x = -w / 2; x <= w / 2; x += 20) {
        pts.push([x, y0 + Math.sin(x * 0.02 + t * (1.2 + r * 0.3) + r) * 10 * amp - 10]);
      }
      pts.push([w / 2, 80]);
      K.path(g, pts, true, true);
      g.fillStyle = ['#2f8fb0', '#2a7aa0', '#226a90'][r] || col;
      g.fill(); g.lineWidth = 2.5; g.strokeStyle = INK; g.stroke();
      // curls
      g.fillStyle = HOLE;
      for (let x = -w / 2 + 30 + r * 23; x < w / 2; x += 70) {
        const yy = y0 + Math.sin(x * 0.02 + t * (1.2 + r * 0.3) + r) * 10 * amp - 2;
        g.beginPath(); g.arc(x, yy + 6, 2.2, 0, 6.28); g.fill();
      }
    }
  };

  K.hills = function (g, w) {
    K.shape(g, [[-w / 2, 0], [-w / 2, -120], [-w / 3, -220], [-w / 8, -150], [w / 10, -260], [w / 3, -170], [w / 2, -230], [w / 2, 0]], '#7a8a3a', { lw: 3, perf: 14, inset: 0.82 });
  };

  K.cloud = function (g, w) {
    const pts = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * 6.283;
      pts.push([Math.cos(a) * w * (i % 2 ? 0.86 : 1), Math.sin(a) * w * 0.32 * (i % 2 ? 0.8 : 1)]);
    }
    K.shape(g, pts, '#dfe8f0', { lw: 2.5, perf: 10, inset: 0.6 });
  };

  K.chariot = function (g, t, broken) {
    // Ravana's flying chariot with a makara prow; broken 0..1 scatters it
    const off = (i) => broken ? [Math.sin(i * 3.1) * 140 * broken, broken * broken * 260 * (0.6 + (i % 3) * 0.3)] : [0, 0];
    const piece = (i, fn) => { const o = off(i); g.save(); g.translate(o[0], o[1]); g.rotate(broken * (i % 2 ? 1.2 : -1.4)); fn(); g.restore(); };
    piece(0, () => K.shape(g, [[-150, 0], [140, 0], [190, -40], [230, -60], [210, -20], [170, 20], [-140, 30]], '#c8902a', { lw: 3, perf: 10, inset: 0.8 }));
    piece(1, () => { K.shape(g, [[200, -50], [236, -86], [262, -76], [250, -50], [226, -40]], '#d84a2a', { lw: 2.6 }); K.circle(g, 240, -70, 3, INK, 0); });
    piece(2, () => { K.line(g, [[-120, 0], [-120, -170]], 6, INK); K.line(g, [[-120, 0], [-120, -170]], 3, GOLD); });
    piece(3, () => { K.line(g, [[110, 0], [110, -170]], 6, INK); K.line(g, [[110, 0], [110, -170]], 3, GOLD); });
    piece(4, () => K.shape(g, [[-150, -160], [140, -160], [60, -230], [0, -250], [-70, -230]], '#d84a2a', { lw: 3, perf: 10, inset: 0.75 }));
    for (let i = 0; i < 5; i++) {
      piece(5 + i, () => { const x = -110 + i * 50; K.line(g, [[x, -160], [x, -140 + Math.sin(t * 3 + i) * 3]], 1.5, INK); K.circle(g, x, -136 + Math.sin(t * 3 + i) * 3, 5, GOLD, 1.5); });
    }
  };

  K.pushpaka = function (g, t) {
    K.shape(g, [[-200, 0], [170, 0], [220, -30], [240, -90], [270, -110], [262, -84], [250, -40], [210, 24], [-180, 30], [-230, 10], [-260, -40], [-220, -20]], '#e8b84a', { lw: 3, perf: 11, inset: 0.84 });
    K.shape(g, [[248, -100], [270, -116], [286, -106], [266, -96]], '#f2c230', { lw: 2 });
    K.shape(g, [[-150, -150], [130, -150], [60, -220], [-10, -250], [-80, -220]], '#d84a2a', { lw: 3, perf: 9, inset: 0.75 });
    for (const x of [-140, -40, 60, 120]) { K.line(g, [[x, 0], [x, -150]], 6, INK); K.line(g, [[x, 0], [x, -150]], 3, GOLD); }
    K.circle(g, -10, -258, 9, GEM, 2);
  };

  K.lanka = function (g) {
    // golden city on its hill, seen far off across the water
    K.shape(g, [[-230, 10], [-200, -40], [-100, -70], [60, -80], [180, -50], [240, 10]], '#9a7a4a', { lw: 2.5, perf: 12 });
    const xs = [-150, -95, -40, 15, 70, 125, 175];
    xs.forEach((x, i) => {
      const h = 90 + ((i * 47) % 80);
      const b = -60;
      K.shape(g, [[x - 20, b], [x - 20, b - h], [x + 20, b - h], [x + 20, b]], '#e8b84a', { smooth: false, lw: 2.5, perf: 9 });
      K.shape(g, [[x - 26, b - h], [x - 18, b - h - 26], [x, b - h - 40], [x + 18, b - h - 26], [x + 26, b - h]], '#f2c84a', { lw: 2.5 });
      K.line(g, [[x, b - h - 40], [x, b - h - 62]], 2.5, INK);
      K.shape(g, [[x, b - h - 62], [x + 16, b - h - 56], [x, b - h - 50]], '#c41f2a', { smooth: false, lw: 1.8 });
    });
  };

  K.stone = function (g, label) {
    K.shape(g, [[-34, -4], [-24, -26], [8, -32], [34, -18], [30, 6], [-10, 10]], '#a89a8a', { lw: 2.6 });
    if (label) {
      g.fillStyle = HOLE;
      g.font = '22px "Tiro Devanagari Sanskrit", serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('राम', 0, -10);
    }
  };

  K.ring = function (g, glow) {
    K.circle(g, 0, 0, 9, K.GOLD, 2.5);
    K.circle(g, 0, 0, 4.5, '#fff4d8', 0);
    K.circle(g, 0, -10, 4, GEM, 1.5);
  };


  // Ravana: nine more heads fanned behind the main one. heads[i] in 0..1 is how far head i has (re)grown.
  K.ravana = function (g, o) {
    const heads = o.heads || [1, 1, 1, 1, 1, 1, 1, 1, 1];
    const base = Object.assign({}, LL.cast.ravana, o, {
      drawExtra(g) {
        for (let i = 0; i < 9; i++) {
          const h = heads[i];
          if (h <= 0.02) continue;
          const a = Math.PI * (0.96 - (i / 8) * 0.82);
          const x = 2 + Math.cos(a) * 108, y = -350 - Math.sin(a) * 86;
          g.save(); g.translate(x, y); g.scale(0.7 * h, 0.7 * h);
          K.head(g, { skin: '#b8342a', demon: true, moustache: true, crown: 'small' });
          g.restore();
        }
        if (o.extraArms) {
          for (let i = 0; i < 4; i++) {
            const pts = K.armPts(4, -276, -1.2 - i * 0.32, -0.3);
            K.limb(g, [pts[0], pts[1]], 12, '#a8302a'); K.limb(g, [pts[1], pts[2]], 10, '#a8302a');
            g.save(); g.translate(pts[2][0], pts[2][1]); g.rotate(-1.2 - i * 0.32 + Math.PI);
            K.shape(g, [[-3, 0], [3, 0], [2, -60], [0, -70], [-2, -60]], '#d8d8d8', { smooth: false, lw: 2 });
            g.restore();
          }
        }
      }
    });
    K.person(g, base);
  };

  // ---------------- cast ----------------
  const C = (LL.cast = {});
  C.rama = { skin: '#3f9fd0', cloth: '#f2c230', cloth2: '#d8442c', head: { crown: 'kirita', tilak: true } };
  C.ramaForest = { skin: '#3f9fd0', cloth: '#d89a3a', cloth2: '#8a5a2a', head: { crown: 'jata', tilak: true } };
  C.lakshmana = { skin: '#efb070', cloth: '#5aa84a', cloth2: '#e0702a', head: { crown: 'small', tilak: true } };
  C.lakshmanaForest = { skin: '#efb070', cloth: '#b88a4a', cloth2: '#5aa84a', head: { crown: 'jata', tilak: true } };
  C.bharata = { skin: '#4f9ab0', cloth: '#e88a2a', cloth2: '#7a3aa0', head: { crown: 'small', tilak: true } };
  C.sita = { female: true, skin: '#f2b88a', cloth: '#f2c230', cloth2: '#d8402f', head: { crown: 'bun', bindi: true } };
  C.sitaForest = { female: true, skin: '#f2b88a', cloth: '#e8b860', cloth2: '#b8502a', head: { crown: 'bun', bindi: true } };
  C.dasharatha = { skin: '#e8a070', cloth: '#9a5ad0', cloth2: '#f2c230', head: { crown: 'kirita', moustache: true, beard: '#f0ece0' } };
  C.kaikeyi = { female: true, skin: '#eaa070', cloth: '#f2c230', cloth2: '#2f9a6a', head: { crown: 'bun', bindi: true } };
  C.valmiki = { skin: '#c9905a', cloth: '#e8801f', cloth2: '#b8501f', sash: '#c8902a', head: { crown: 'jata', beard: '#e8e2d0' } };
  C.ravana = { skin: '#c43a2a', cloth: '#3a2a6a', cloth2: '#f2c230', head: { crown: 'kirita', demon: true, moustache: true } };
  C.hanuman = { skin: '#c8692a', face: '#e04a35', cloth: '#e8b030', cloth2: '#d8402f', monkey: true, head: { crown: 'small' } };
  C.vanara = { skin: '#a8682a', face: '#d0603a', cloth: '#7a8a3a', cloth2: '#c8502a', monkey: true, head: { crown: 'fur' } };
  C.king = { skin: '#d89060', cloth: '#7a6aa0', cloth2: '#c8402a', head: { crown: 'small', moustache: true } };
})(typeof window !== 'undefined' ? window : globalThis);
