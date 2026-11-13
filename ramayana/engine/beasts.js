/* Ramayana paintings: animals, birds, monsters and vehicles. All face +x; origin on the ground unless noted. */
(function () {
  const R = window.R, C = R.C, n = R.n;
  const { path, line, circ, ell, g, rect, pat } = R;
  const ol = (c, w = 1.4) => ({ stroke: R.dark(c, 0.4), 'stroke-width': w, 'stroke-linejoin': 'round' });
  const lotusEye = (x, y, k = 1, mood) => g(path('M-12,0 Q0,-11 13,-1 Q0,6 -12,0 Z', C.white) + circ(1, -1.5, 4.2, C.ink) + line('M-14,1 Q0,-13 15,-2', C.ink, 2.4) + (mood === 'angry' ? line('M-14,-12 L14,-6', C.ink, 3) : ''), `translate(${x},${y}) scale(${k})`);
  const petal = (L, w, fill, o) => path(`M0,0 C${n(w)},${n(-L * 0.3)} ${n(w)},${n(-L * 0.8)} 0,${n(-L)} C${n(-w)},${n(-L * 0.8)} ${n(-w)},${n(-L * 0.3)} 0,0 Z`, fill, o);

  R.horse = function (x, y, s, o = {}) {
    const c = o.col || C.white, m = o.mane || C.umber, gal = o.gallop, dk = R.dark(c, 0.38); let t = '';
    const leg = (x0, a1, a2, far) => { const k = [x0 + Math.sin(a1) * 44, -58 + Math.cos(a1) * 44], f = [k[0] + Math.sin(a2) * 46, k[1] + Math.cos(a2) * 46]; return line(`M${x0},-62 L${n(k[0])},${n(k[1])} L${n(f[0])},${n(f[1])}`, dk, 13) + line(`M${x0},-62 L${n(k[0])},${n(k[1])} L${n(f[0])},${n(f[1])}`, far ? R.dark(c, 0.12) : c, 10.5) + circ(f[0], f[1] + 2, 6.5, C.ink); };
    t += line(R.smooth([[-64, -92], [-96, -84], [-112, -40], [-98, -8], [-110, 0]]), m, 9);
    t += gal ? leg(-50, -0.9, -0.2, 1) + leg(44, 1.1, 0.5, 1) : leg(-52, -0.1, 0.12, 1) + leg(40, 0.12, -0.08, 1);
    t += path('M-62,-96 C-40,-114 30,-114 52,-100 C68,-88 66,-62 50,-54 C20,-46 -30,-46 -58,-56 C-76,-66 -74,-88 -62,-96 Z', c, ol(c));
    t += gal ? leg(-40, -0.6, 0.3) + leg(50, 0.8, 1.2) : leg(-42, 0.06, -0.06) + leg(50, -0.04, 0.1);
    t += path('M30,-98 C40,-132 56,-156 78,-164 L82,-180 L92,-164 C108,-154 120,-134 122,-122 C124,-112 114,-108 106,-114 L92,-126 C80,-120 74,-102 68,-80 Z', c, ol(c));
    t += line(R.smooth([[76, -166], [54, -150], [40, -124], [32, -98]]), m, 9, { 'stroke-dasharray': '10 5', 'stroke-linecap': 'butt' });
    t += lotusEye(94, -146, 0.62, o.mood) + circ(116, -121, 2, C.ink) + line('M106,-114 Q112,-112 118,-116', C.ink, 1.4);
    if (o.long) t += path('M80,-176 L78,-214 L92,-180 Z', c, ol(c)); // long ears: Ravana's mules
    if (o.cloth !== false) t += path('M-36,-106 Q0,-116 34,-104 L30,-66 Q0,-56 -34,-66 Z', pat('flower', o.cloth || C.red, C.gold, 0.8), ol(o.cloth || C.red)) + line('M-34,-66 Q0,-56 30,-66', C.gold, 4, { 'stroke-dasharray': '2 6' }) + line('M70,-150 L96,-128 M58,-104 Q70,-70 50,-58', C.gold, 3);
    return g(t, R.tf(x, y, s, o.rot || 0, o.flip || 1));
  };
  R.elephant = function (x, y, s, o = {}) {
    const c = o.col || C.grey, dk = R.dark(c, 0.3); let t = '';
    [[-92, 1], [26, 1], [-50, 0], [68, 0]].forEach((q) => (t += rect(q[0] - 19, -76, 38, 76, q[1] ? dk : c, ol(c)) + line(`M${q[0] - 12},-4 h7 M${q[0] + 2},-4 h7`, C.cream, 4)));
    t += path('M-116,-156 C-104,-224 40,-232 82,-196 C102,-178 106,-150 100,-118 L98,-64 L-110,-64 Z', c, ol(c)) + line('M-112,-140 q-20,30 -12,70', dk, 5) + circ(-124, -66, 6, C.ink);
    t += path('M-70,-206 Q-10,-230 44,-204 L50,-112 Q-10,-96 -76,-112 Z', pat('flower', o.cloth || C.red, C.gold, 1), ol(o.cloth || C.red)) + line('M-76,-112 Q-10,-96 50,-112', C.gold, 6, { 'stroke-dasharray': '2 9' });
    t += circ(96, -170, 54, c, ol(c)) + path('M130,-150 C152,-110 148,-58 128,-36 C118,-26 104,-34 110,-44 C124,-62 120,-104 100,-126 Z', c, ol(c)) + path('M110,-132 C132,-118 150,-116 164,-126 C150,-108 128,-104 108,-116 Z', C.white, ol(C.bone));
    t += path('M70,-214 C30,-220 24,-150 60,-124 C78,-140 84,-180 70,-214 Z', R.light(c, 0.12), ol(c)) + lotusEye(110, -180, 0.7) + path('M84,-222 Q104,-236 126,-214 Q106,-216 84,-222 Z', C.gold, ol(C.gold)) + circ(106, -220, 4, C.red);
    if (o.howdah) t += rect(-60, -262, 96, 58, pat('zig', C.gold, C.amber), ol(C.gold)) + path('M-70,-262 Q-12,-322 46,-262 Z', o.cloth || C.red, ol(C.red)) + circ(-12, -298, 7, C.gold);
    return g(t, R.tf(x, y, s, 0, o.flip || 1));
  };
  R.deer = function (x, y, s, o = {}) {
    const c = o.col || C.tan, sp = o.spots || C.cream, back = o.look === -1; let t = '';
    const leg = (x0, dx) => line(`M${x0},-56 L${x0 + dx * 0.4},-28 L${x0 + dx},0`, R.dark(c, 0.35), 7.5) + line(`M${x0},-56 L${x0 + dx * 0.4},-28 L${x0 + dx},0`, c, 5.5) + circ(x0 + dx, 1, 3.4, C.ink);
    t += o.run ? leg(-34, -34) + leg(30, 40) : leg(-34, -4) + leg(30, 4);
    t += path('M-48,-78 C-30,-92 26,-92 42,-80 C54,-70 50,-52 38,-48 C10,-42 -26,-42 -44,-50 C-56,-58 -56,-70 -48,-78 Z', c, ol(c));
    t += o.run ? leg(-26, -22) + leg(36, 26) : leg(-26, 4) + leg(36, -4);
    t += path('M-50,-72 q-14,-10 -10,-22 q8,8 16,14 Z', sp);
    for (let i = 0; i < 9; i++) t += circ(-36 + i * 9 + (i % 2) * 3, -74 + (i % 3) * 9, 3.2, sp);
    const head = path('M0,0 C4,-30 6,-54 0,-70 L-6,-88 L6,-78 C22,-78 40,-66 46,-54 C48,-48 42,-46 36,-50 L22,-54 C20,-36 22,-16 26,6 Z', c, ol(c)) + lotusEye(18, -66, 0.5) + circ(43, -54, 2, C.ink) + line('M4,-80 q-8,-22 -24,-30 M-6,-96 q2,-12 -4,-20 M-14,-106 q-10,0 -16,-8 M8,-80 q6,-22 0,-40 M9,-104 q10,-6 12,-16', o.horn || C.umber, 3.2) + (o.jewel ? circ(-20, -110, 3.4, o.jewel) + circ(8, -120, 3.4, o.jewel) + circ(21, -120, 3.4, o.jewel) : '');
    t += g(head, back ? 'translate(26,-72) scale(-1,1) rotate(-14)' : 'translate(26,-72)');
    return g(t, R.tf(x, y, s, 0, o.flip || 1));
  };
  // great bird (Jatayu, Sampati, Garuda): origin at the breast; wings: [angleNear, angleFar] in degrees (0 = straight up)
  R.bird = function (x, y, s, o = {}) {
    const c = o.col || C.clay, c2 = o.col2 || C.gold, c3 = o.col3 || C.cream, f = R.rng(o.seed || 8); let t = '';
    const wing = (ang, far, cut) => { let w = ''; const N = cut ? 4 : 9; for (let i = 0; i < N; i++) { const a = -62 + i * 15.5, L = (cut ? 120 : 250) * (1 - Math.abs(i - 3) * 0.055); w += g(petal(L, 26, i % 2 ? c2 : far ? R.dark(c, 0.15) : c, ol(c)) + line(`M0,-10 L0,${-L + 12}`, R.dark(c, 0.3), 1.6), `rotate(${a})`); } for (let i = 0; i < (cut ? 3 : 7); i++) w += g(petal(120, 24, i % 2 ? c3 : c2, ol(c2)), `rotate(${-52 + i * 17})`); w += circ(0, 0, 44, pat('scale', c, c2, 0.8), ol(c)); if (cut) w += path('M-70,-110 L-40,-150 L-10,-116 L24,-150 L50,-108 Z', C.red) + circ(-30, -160, 7, C.red) + circ(30, -170, 5, C.red); return g(w, `translate(${far ? 16 : -10},${far ? -30 : -24}) rotate(${ang})`); };
    const wg = o.wings || [-50, 40];
    t += wing(wg[1], true, o.cut === 'far' || o.cut === 'both');
    for (let i = 0; i < 7; i++) t += g(petal(150, 24, i % 2 ? c2 : c, ol(c)), `translate(-70,24) rotate(${-128 + i * 12})`);
    t += line('M-10,50 L-2,100 M24,50 L40,96', C.amber, 9) + path('M-2,100 l-16,16 M-2,100 l2,22 M-2,100 l18,14 M40,96 l-12,20 M40,96 l6,22 M40,96 l22,10', 'none', { stroke: C.amber, 'stroke-width': 6, 'stroke-linecap': 'round' });
    t += path('M-86,10 C-70,-40 20,-60 70,-30 C100,-10 96,34 60,54 C10,76 -60,62 -86,10 Z', pat('feather', c, c2, 0.9), ol(c)) + ell(34, 20, 44, 34, c3, { opacity: 0.9 }) + line('M8,10 q26,14 56,2 M10,28 q24,12 48,2', c2, 3);
    t += path('M60,-24 C80,-70 96,-104 124,-112 C150,-116 168,-100 166,-80 C150,-86 136,-80 128,-62 C118,-40 106,-14 88,6 Z', c, ol(c));
    t += circ(134, -96, 32, o.head || c3, ol(c)) + path('M158,-110 C190,-110 204,-92 198,-70 C192,-82 180,-86 160,-84 Z', C.gold, ol(C.amber)) + line('M160,-96 Q178,-98 190,-88', C.amber, 2);
    t += lotusEye(140, -100, 0.82, o.mood) + path('M112,-122 L100,-156 L124,-130 L128,-164 L140,-128 Z', c2, ol(c2));
    if (o.crown) t += path('M108,-122 L104,-150 L120,-138 L132,-160 L142,-136 L158,-146 L154,-118 Z', C.gold, ol(C.gold)) + circ(132, -150, 4, C.red);
    t += wing(wg[0], false, o.cut === 'near' || o.cut === 'both');
    return g(t, R.tf(x, y, s, o.rot || 0, o.flip || 1));
  };
  R.swan = function (x, y, s, o = {}) { const c = o.col || C.white; return g(path('M-50,0 C-60,-30 -10,-44 24,-30 C40,-22 40,-6 26,0 Z', c, ol(C.ash)) + path('M-50,-4 L-78,-26 L-60,-22 L-74,-40 L-44,-22 Z', c, ol(C.ash)) + path('M20,-26 C30,-50 22,-76 40,-86 C56,-92 66,-78 58,-68 L74,-62 L56,-58 C44,-56 44,-40 36,-16 Z', c, ol(C.ash)) + circ(52, -76, 2.4, C.ink) + path('M58,-68 L76,-62 L58,-60 Z', C.saffron) + line('M-30,-22 q20,-10 40,2 M-34,-12 q20,-8 44,2', C.ash, 2), R.tf(x, y, s, 0, o.flip || 1)); };
  R.crane = function (x, y, s, o = {}) { const c = o.col || C.white; return g(line('M-6,0 L-4,-70 M10,0 L8,-70', C.umber, 4) + path('M-44,-80 C-30,-112 30,-112 44,-86 C30,-66 -20,-62 -44,-80 Z', c, ol(C.ash)) + path('M-40,-84 L-76,-70 L-52,-74 L-70,-58 L-36,-72 Z', C.slate) + path('M34,-92 C50,-120 40,-150 56,-166 C70,-176 82,-164 76,-152 L104,-146 L76,-142 C62,-138 62,-116 46,-84 Z', c, ol(C.ash)) + circ(66, -162, 9, C.red) + circ(70, -158, 2.4, C.ink) + path('M76,-152 L108,-146 L76,-142 Z', C.amber) + (o.wing ? path('M-20,-100 C-40,-150 -10,-190 30,-200 C20,-160 20,-130 20,-100 Z', c, ol(C.ash)) + line('M-6,-110 Q-6,-160 22,-190 M6,-106 Q4,-150 24,-176', C.slate, 2) : ''), R.tf(x, y, s, o.rot || 0, o.flip || 1)); };
  R.peacock = function (x, y, s, o = {}) { let t = ''; for (let i = 0; i < 9; i++) t += g(petal(170, 26, i % 2 ? C.green : C.teal, ol(C.forest)) + circ(0, -138, 12, C.gold) + circ(0, -138, 6.5, C.blue), `translate(-20,-60) rotate(${-150 + i * 14})`); t += line('M0,0 V-40 M14,0 V-40', C.amber, 4) + path('M-36,-50 C-20,-80 30,-80 40,-56 C30,-34 -16,-34 -36,-50 Z', C.blue, ol(C.navy)) + path('M28,-62 C40,-90 34,-120 48,-134 C60,-142 70,-132 64,-122 L80,-118 L64,-112 C54,-108 54,-86 42,-54 Z', C.blue, ol(C.navy)) + circ(57, -128, 2.4, C.white) + line('M52,-138 l-4,-18 M56,-140 l2,-18 M60,-138 l8,-16', C.teal, 2) + circ(48, -158, 3, C.gold) + circ(58, -160, 3, C.gold) + circ(68, -156, 3, C.gold); return g(t, R.tf(x, y, s, 0, o.flip || 1)); };
  R.parrots = function (seed, box, cnt, col = C.leaf) { const f = R.rng(seed); let s = ''; for (let i = 0; i < cnt; i++) { const x = f.r(box[0], box[2]), y = f.r(box[1], box[3]), k = f.r(0.5, 1), fl = f() < 0.5 ? 1 : -1; s += g(path('M-20,0 C-8,-12 12,-12 22,-2 L30,0 L22,3 C10,10 -8,10 -20,0 Z', col) + path('M-4,-6 C-12,-30 4,-36 12,-34 C6,-24 6,-14 6,-6 Z', R.dark(col, 0.2)) + path('M-18,0 L-40,8 L-18,4 Z', C.red) + path('M22,-3 L32,0 L22,3 Z', C.red) + circ(16, -2, 1.8, C.ink), `translate(${n(x)},${n(y)}) scale(${n(k * fl)},${n(k)}) rotate(${n(f.r(-20, 20))})`); } return s; };
  R.snake = function (x, y, s, o = {}) { const c = o.col || C.green, c2 = o.col2 || C.lime, L = o.len || 5; const pts = []; for (let i = 0; i <= L * 4; i++) pts.push([-i * 22, Math.sin(i * 0.9) * 20]); const d = R.smooth(pts); return g(line(d, R.dark(c, 0.4), 16) + line(d, c, 13) + line(d, c2, 13, { 'stroke-dasharray': '4 16', 'stroke-linecap': 'butt' }) + path('M-6,-8 C4,-32 40,-34 52,-10 C56,0 50,12 40,14 C20,18 2,12 -6,-8 Z', c, ol(c)) + lotusEye(28, -8, 0.5, 'angry') + line('M52,-2 l18,-6 M52,-2 l18,6', C.red, 2.4) + path('M10,-20 q14,-14 30,-4', 'none', { stroke: c2, 'stroke-width': 3 }), R.tf(x, y, s, o.rot || 0, o.flip || 1)); };
  // makara / sea-dragon head rising from the edge of the sheet
  R.makara = function (x, y, s, o = {}) { const c = o.col || C.mustard, c2 = o.col2 || C.amber; return g(path('M-200,60 C-180,-60 -80,-110 20,-96 C80,-90 150,-70 196,-40 C204,-30 196,-20 184,-22 L150,-26 L160,-6 L130,-22 L128,0 L104,-20 L96,4 L74,-18 L60,10 C10,40 -80,60 -200,60 Z', pat('scale', c, c2, 1.1), ol(c)) + path('M-190,-10 L-170,-80 L-150,-44 L-130,-110 L-104,-66 L-80,-128 L-56,-84 L-30,-126 L-14,-92 C-80,-100 -150,-60 -190,-10 Z', C.gold, ol(C.amber)) + path('M-60,-64 Q10,-96 70,-58 Q0,-30 -60,-64 Z', C.white) + path('M-60,-64 Q10,-70 70,-58 Q0,-44 -60,-64 Z', C.maroon) + path('M-10,-66 Q10,-72 30,-62 Q10,-54 -10,-66 Z', C.azure) + line('M-66,-62 Q10,-100 78,-56', C.ink, 4) + path('M60,10 L74,-18 L96,4 L104,-20 L128,0 L130,-22 L160,-6', 'none', { stroke: C.white, 'stroke-width': 5, 'stroke-linejoin': 'round' }), R.tf(x, y, s, o.rot || 0, o.flip || 1)); };
  R.lion = function (x, y, s, o = {}) { const c = o.col || C.ochre; return g(line('M-70,-70 Q-110,-90 -104,-30', c, 7) + circ(-104, -28, 8, C.umber) + rect(-62, -60, 16, 60, c, ol(c)) + rect(34, -60, 16, 60, c, ol(c)) + path('M-74,-90 C-50,-106 30,-106 54,-92 C64,-80 60,-60 50,-54 C10,-46 -40,-46 -68,-56 C-82,-66 -82,-82 -74,-90 Z', c, ol(c)) + circ(58, -104, 46, C.umber, ol(C.umber)) + circ(62, -102, 30, c, ol(c)) + lotusEye(66, -108, 0.6, 'angry') + path('M76,-94 l14,4 l-10,8 Z', C.umber) + line('M70,-84 q10,6 20,-2', C.umber, 2), R.tf(x, y, s, 0, o.flip || 1)); };

  // ---------------- vehicles ----------------
  R.wheel = function (x, y, r, col = C.gold, col2 = C.red) { let s = R.ring(x, y, r, C.amber, r * 0.2) + R.ring(x, y, r, col, r * 0.13); for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; s += line(`M${n(x + Math.cos(a) * r * 0.2)},${n(y + Math.sin(a) * r * 0.2)} L${n(x + Math.cos(a) * r * 0.92)},${n(y + Math.sin(a) * r * 0.92)}`, col, r * 0.09); } return s + circ(x, y, r * 0.24, col2, ol(col2)) + circ(x, y, r * 0.09, col); };
  // war / royal chariot; o.riders = svg drawn standing on the floor (y = -78) behind the rail
  R.chariot = function (x, y, s, o = {}) {
    const c = o.col || C.red, gd = C.gold; let t = '';
    const team = o.team != null ? o.team : 2, beast = o.beast || 'horse';
    if (team) for (let i = team - 1; i >= 0; i--) t += R.horse(300 + i * 34, i * -7, 0.9, Object.assign({ gallop: o.gallop, col: i % 2 ? o.hcol2 || C.cream : o.hcol || C.white }, o.horse || {}, beast === 'mule' ? { long: 1, col: i % 2 ? C.ash : C.grey, mane: C.ink, mood: 'angry', cloth: false } : {}));
    if (team) t += line('M96,-84 L250,-96', gd, 6) + line('M250,-96 L330,-128', C.umber, 2.5);
    if (o.canopy !== false) t += line('M-70,-140 V-290 M70,-140 V-290', gd, 6) + path('M-104,-286 C-80,-330 80,-330 104,-286 Q0,-300 -104,-286 Z', pat('diag', c, R.dark(c, 0.2)), ol(c)) + path('M-104,-286 q13,18 26,0 q13,18 26,0 q13,18 26,0 q13,18 26,0 q13,18 26,0 q13,18 26,0 q13,18 26,0 q13,18 26,0', 'none', { stroke: gd, 'stroke-width': 4 }) + path('M-30,-318 Q0,-372 30,-318 Z', gd, ol(gd)) + line('M0,-346 V-400', gd, 4) + path('M0,-400 L44,-390 L22,-380 L44,-368 L0,-366 Z', o.flag || C.saffron);
    t += o.riders || '';
    t += path('M-84,-66 L-92,-130 Q-92,-144 -78,-144 L56,-144 Q76,-142 90,-112 L104,-66 Z', pat('flower', c, gd, 0.9), ol(c)) + line('M-92,-136 L-78,-144 L56,-144 Q76,-142 90,-112', gd, 7) + line('M-84,-70 H104', gd, 8) + R.squig(-76, -104, 80, -104, 7, 30, gd, 3);
    t += R.wheel(0, -56, 56, gd, c) + (o.wheels === 2 ? R.wheel(-96, -50, 50, gd, c) : '');
    return g(t, R.tf(x, y, s, o.rot || 0, o.flip || 1));
  };
  // Pushpaka: the flying palace, yoked with swans. o.riders drawn inside the central pavilion (floor y = -60)
  R.vimana = function (x, y, s, o = {}) {
    const gd = C.gold, c = o.col || C.red; let t = '';
    for (let i = 0; i < 5; i++) t += R.spiral(-250 + i * 125, 30 + (i % 2) * 14, 34, o.cloud || C.white, 9, 1.7, i % 2 ? 1 : -1, 2) ;
    t += R.swan(330, -20, 1.1) + R.swan(390, -70, 0.95) + line('M250,-50 L320,-40 M250,-50 L378,-88', gd, 3);
    t += rect(-270, -40, 540, 44, pat('zig', C.amber, gd, 1.6), ol(C.amber)) + path('M-270,4 Q0,70 270,4 Z', pat('scale', gd, C.amber, 1.2), ol(C.amber));
    t += rect(-230, -230, 460, 190, o.wall || C.cream, ol(C.bone));
    [-170, -86, 86, 170].forEach((ax) => (t += path(R.archD(ax - 28, -44, 56, 120, 5), o.win || C.navy) + path(R.archD(ax - 28, -44, 56, 120, 5), 'none', { stroke: c, 'stroke-width': 5 })));
    t += path(R.archD(-48, -44, 96, 170, 7), o.inner || C.rose) + (o.riders || '') + path(R.archD(-48, -44, 96, 170, 7), 'none', { stroke: c, 'stroke-width': 9 }) + path(R.archD(-48, -44, 96, 170, 7), 'none', { stroke: gd, 'stroke-width': 3, 'stroke-dasharray': '2 8' });
    t += rect(-250, -246, 500, 20, c) + rect(-170, -330, 340, 86, R.dark(o.wall || C.cream, 0.06), ol(C.bone)) + rect(-186, -344, 372, 18, c);
    [-110, 0, 110].forEach((ax) => (t += path(R.archD(ax - 22, -250, 44, 62, 5), o.win || C.navy)));
    t += R.dome(0, -344, 1.2, gd, c) + R.dome(-140, -344, 0.7, gd, c) + R.dome(140, -344, 0.7, gd, c) + R.dome(-220, -246, 0.6, gd, c) + R.dome(220, -246, 0.6, gd, c);
    for (let i = 0; i < 9; i++) t += line(`M${-240 + i * 60},-40 v22`, gd, 2) + path(`M${-246 + i * 60},-18 q6,-10 12,0 q-6,10 -12,0 Z`, gd);
    return g(t, R.tf(x, y, s, o.rot || 0, o.flip || 1));
  };
  R.boat = function (x, y, s, o = {}) { const c = o.col || C.brown; return g((o.riders || '') + path('M-190,-30 C-150,30 150,30 190,-30 L230,-70 C180,-50 -180,-50 -230,-70 Z', pat('hstripes', c, R.dark(c, 0.25), 1.6), ol(c)) + line('M-226,-66 C-180,-48 180,-48 226,-66', C.gold, 5) + path('M190,-30 L230,-70 L240,-110 C214,-96 196,-70 190,-30 Z', C.red, ol(C.red)) + lotusEye(150, -24, 0.9), R.tf(x, y, s, 0, o.flip || 1)); };
  // the eight-wheeled iron casket of Shiva's bow
  R.casket = function (x, y, s, open) { let t = rect(-330, -110, 660, 76, pat('zig', C.slate, C.ash, 1.6), ol(C.slate)) + rect(-340, -118, 680, 14, C.gold) + rect(-340, -44, 680, 12, C.gold); for (let i = 0; i < 8; i++) t += R.wheel(-294 + i * 84, -22, 24, C.gold, C.red); if (!open) t += path('M-336,-118 Q0,-170 336,-118 Z', pat('scale', C.slate, C.ash), ol(C.slate)); return g(t, R.tf(x, y, s)); };
  // Shiva's bow: vast, serpent-wound. Drawn lying (rot) or upright; `snap` breaks it in two at the grip.
  R.greatBow = function (x, y, s, o = {}) {
    const half = (sgn) => { let t = line(`M0,0 C${80},${-sgn * 60} ${90},${-sgn * 220} 0,${-sgn * 330}`, C.amber, 26) + line(`M0,0 C${80},${-sgn * 60} ${90},${-sgn * 220} 0,${-sgn * 330}`, C.gold, 19) + line(`M0,0 C${80},${-sgn * 60} ${90},${-sgn * 220} 0,${-sgn * 330}`, C.red, 19, { 'stroke-dasharray': '10 46', 'stroke-linecap': 'butt' }) + line(`M0,${-sgn * 330} q-26,${-sgn * 8} -22,${-sgn * 38}`, C.gold, 12) + circ(-22, -sgn * 372, 9, C.red); return t; };
    let t = '';
    if (o.snap) t += g(half(1) + line('M0,-330 C-90,-260 -30,-160 -110,-90', C.white, 3), `translate(46,-44) rotate(${o.snap})`) + g(half(-1) + line('M0,330 C-110,250 -20,170 -120,110', C.white, 3), `translate(46,44) rotate(${-o.snap})`) + R.impact(58, 0, 84, [C.gold, C.white, C.red, C.white], 3, 13);
    else t += half(1) + half(-1) + rect(46, -26, 24, 52, C.red, { rx: 6 }) + (o.string === false ? '' : line('M0,-330 L0,330', C.white, 3));
    return g(t, R.tf(x, y, s, o.rot || 0, o.flip || 1));
  };
  // a mountain carried on a palm (the hill of healing herbs)
  R.herbHill = function (x, y, s) { let t = R.peak(0, 0, 260, 170, C.green, { c2: C.lime }) + R.peak(-70, 0, 150, 100, C.forest, { c2: C.leaf }) + R.peak(80, 0, 160, 110, C.moss, { c2: C.lime }); for (let i = 0; i < 9; i++) t += g(R.item('flower', { col: i % 2 ? C.gold : C.white }), `translate(${-90 + i * 22},${-30 - (i % 3) * 30}) scale(.8)`); t += path('M-130,0 Q0,40 130,0 Z', C.brown); return g(t, R.tf(x, y, s)); };
})();
