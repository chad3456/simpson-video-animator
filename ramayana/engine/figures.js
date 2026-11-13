/* Ramayana paintings: the figure kit. Flat-torso, profile-head paper figures with long lotus eyes,
   posed by joint angles or hand targets. Local space: origin at the ground, facing +x, about 300 units tall. */
(function () {
  const R = window.R, C = R.C, n = R.n, rad = R.rad;
  const { path, line, circ, ell, g, rect } = R;
  const ol = (c) => ({ stroke: R.dark(c, 0.38), 'stroke-width': 1.3, 'stroke-linejoin': 'round' });

  // ---------------- heads ----------------
  function eyeP(e, o) { // profile eye, drawn full like a lotus petal
    const ink = C.ink, wh = o.sclera || C.white; let s = '';
    if (e === 'closed' || e === 'bliss') {
      s += line('M4,-7 Q15,1 29,-8', ink, 2.4) + line('M9,-3 l-2,4 M15,-2 l0,5 M21,-3 l2,4', ink, 1.3);
      s += line('M3,-15 Q15,-23 31,-15', ink, 2);
      return s;
    }
    const wide = e === 'wide' || e === 'fear', soft = e === 'soft' || e === 'sad';
    const top = wide ? -18 : soft ? -13 : -15.5;
    s += path(`M3,-6 Q14,${top} 29,-8 Q15,${wide ? 3 : 0} 3,-6 Z`, wh);
    s += circ(wide ? 16 : 16.5, soft ? -6.2 : -7.4, wide ? 3.6 : 4.5, ink) + circ(18, -9, 1.1, C.white);
    s += line(`M1,-5 Q13,${top - 1.5} 32,-8.5`, ink, 2.7) + line(`M3,-6 Q15,${wide ? 3 : 0} 29,-8`, ink, 1);
    if (soft) s += path('M3,-6 Q14,-13 29,-8 Q15,-11 3,-6 Z', R.dark(o.skin, 0.12));
    const brow = e === 'angry' ? 'M1,-21 Q14,-21 31,-11' : e === 'sad' || e === 'fear' ? 'M2,-13 Q12,-22 31,-22' : e === 'soft' ? 'M2,-15 Q16,-24 32,-16' : 'M2,-16 Q16,-26 32,-16';
    return s + line(brow, ink, e === 'angry' ? 3 : 2.1);
  }
  function mouthP(m, o) {
    const lip = o.lip || R.mix(o.skin, C.crimson, 0.6);
    if (m === 'smile') return line('M25,16 Q29,20 33,15.5', lip, 2.2);
    if (m === 'open' || m === 'shout') return path('M25,14 L33,13 L31,23 Q26,23 25,14 Z', C.maroon) + (o.fang ? path('M27,14 l1.6,5 l1.6,-5 Z', C.white) : '');
    if (m === 'frown') return line('M25,18.5 Q29,15.5 33,17.5', lip, 2.2);
    if (m === 'fang') return line('M24,17 L33,16', C.maroon, 2.4) + path('M26,16.5 l1.6,6 l1.8,-6 Z M30,16.3 l1.2,4 l1.2,-4 Z', C.white);
    return line('M26,17 L32.5,16.4', lip, 2.4);
  }
  const FACE_P = 'M-4,-34 C14,-36 25,-27 26,-13 L27,-8 L40,5 Q41,9 36,9 L30,9 L32.5,14 L28,17 L31.5,21 Q31,27 25,30 C18,35 8,35 0,31 C-8,28 -13,22 -15,14 C-30,8 -36,-24 -4,-34 Z';

  function crownP(o) { // tiered mukut on a profile head
    const gd = C.gold, dk = C.amber, rd = o.gem || C.red; let s = '';
    s += path('M-30,-23 L-27,-41 L24,-41 L26,-23 Q-2,-30 -30,-23 Z', gd, ol(gd)) + path('M-23,-41 L-19,-59 L15,-59 L19,-41 Z', gd, ol(gd)) + path('M-15,-59 L-11,-74 L7,-74 L11,-59 Z', gd, ol(gd));
    s += path('M-8,-74 Q-2,-84 -2,-96 Q-1,-84 4,-74 Z', gd, ol(gd)) + circ(-2, -80, 5.5, rd);
    s += line('M-26,-32 H23 M-20,-50 H16 M-12,-66 H8', dk, 1.6);
    [[-14, -32], [-2, -32], [10, -32], [-8, -50], [4, -50], [-2, -66]].forEach((p, i) => (s += circ(p[0], p[1], i % 2 ? 2.6 : 3.3, i % 2 ? C.white : rd)));
    s += path('M-22,-24 C-34,-22 -34,-4 -22,2 C-26,-6 -24,-16 -16,-22 Z', gd, ol(gd)) + circ(-25, -10, 2.6, rd); // ear guard
    return s;
  }
  function smallCrown(col) { return path('M-27,-24 L-30,-46 L-18,-36 L-10,-52 L-1,-36 L9,-52 L15,-36 L26,-46 L25,-24 Q-2,-31 -27,-24 Z', C.gold, ol(C.gold)) + circ(-10, -48, 3, col || C.red) + circ(9, -48, 3, col || C.red) + circ(-1, -31, 3, col || C.red); }
  function turban(col, col2, kn) {
    let s = path('M-33,-10 C-44,-40 -14,-58 14,-47 C29,-41 32,-27 28,-15 C10,-27 -12,-25 -33,-10 Z', col, ol(col));
    s += line('M-30,-20 C-14,-36 8,-38 26,-24 M-32,-30 C-14,-46 10,-48 28,-32 M-24,-42 C-10,-52 8,-52 20,-44', col2, 2.4);
    if (kn !== false) s += path('M-16,-50 C-22,-66 -2,-70 2,-54 Z', col, ol(col));
    return s;
  }

  R.headP = function (h) { // h: skin, eye, mouth, hair, gear, beard, must, tilak, earring, haircol, old
    const sk = h.skin, hc = h.haircol || C.black; let back = '', s = '';
    const hair = h.hair || 'cap';
    // --- behind the head ---
    if (h.halo) back += circ(-4, -8, h.halo === true ? 58 : h.halo, C.gold, { opacity: 0.96 }) + R.ring(-4, -8, (h.halo === true ? 58 : h.halo) - 8, C.saffron, 2.5) + Array.from({ length: 16 }, (_, i) => circ(-4 + Math.cos(i * 0.3927) * ((h.halo === true ? 58 : h.halo) - 16), -8 + Math.sin(i * 0.3927) * ((h.halo === true ? 58 : h.halo) - 16), 2.6, i % 2 ? C.red : C.white)).join('');
    if (hair === 'long' || hair === 'wild') back += path('M-10,-30 C-46,-22 -50,30 -42,92 C-34,104 -16,100 -10,84 C-16,44 -8,12 -2,-6 Z', hc);
    if (hair === 'wild') back += path('M-20,-30 L-52,-44 L-38,-18 L-62,-12 L-42,4 L-64,18 L-42,26 L-56,48 L-30,40 Z', hc);
    if (hair === 'braid') back += Array.from({ length: 7 }, (_, i) => ell(-30 - i * 2.2, 14 + i * 15, 8 - i * 0.6, 9, hc)).join('') + circ(-45, 120, 5, h.tie || C.red);
    if (h.gear === 'veil') back += path('M-6,-38 C-40,-40 -48,0 -44,40 C-42,74 -50,104 -54,128 L-18,128 C-16,90 -12,50 -6,10 Z', h.veil || C.red);
    // --- face ---
    s += path(FACE_P, sk, ol(sk));
    if (h.old) s += line('M6,-24 Q14,-27 22,-24 M20,10 Q24,14 22,20', R.dark(sk, 0.3), 1.2);
    s += ell(-8, 3, 4.4, 6.5, sk, ol(sk));
    if (h.muzzle) s += h.muzzle;
    s += eyeP(h.eye || 'open', h) + mouthP(h.mouth || 'neutral', h);
    s += line('M36,9 q-3,1 -4,-1', R.dark(sk, 0.4), 1.4);
    // --- hair ---
    if (hair === 'cap' || hair === 'long' || hair === 'bun' || hair === 'braid' || hair === 'knot' || hair === 'wild')
      s += path('M-2,-36 C12,-38 24,-30 26,-16 C18,-23 8,-22 0,-17 C-5,-8 -5,2 -9,12 L-16,15 C-32,8 -38,-26 -2,-36 Z', hc);
    if (hair === 'bun') s += circ(-31, -4, 13, hc) + line('M-26,-12 q-8,6 -4,16', h.tie || C.gold, 2.5);
    if (hair === 'knot') s += ell(-6, -45, 17, 13, hc) + line('M-20,-37 Q-6,-32 8,-38', h.tie || C.ochre, 3.2) + line('M-14,-50 q8,-6 16,0', R.light(hc, 0.25), 1.5);
    if (hair === 'jata') { const c = h.haircol || C.umber; s += path('M-2,-36 C12,-38 24,-30 26,-17 C16,-24 6,-22 0,-17 C-5,-8 -5,2 -9,12 L-16,15 C-32,8 -38,-26 -2,-36 Z', c) + ell(-8, -48, 18, 15, c) + line('M-24,-38 Q-8,-32 8,-40 M-22,-50 q14,-8 28,0 M-18,-58 q10,-6 20,0', R.light(c, 0.3), 2); back += path('M-14,-28 C-40,-18 -42,20 -36,56 C-28,62 -20,58 -16,50 C-18,24 -12,6 -6,-6 Z', c); }
    if (hair === 'tuft') s += path('M-20,-30 C-34,-34 -40,-20 -34,-12 C-32,-22 -26,-24 -20,-24 Z', hc);
    if (hair === 'bald' && h.fringe) s += path('M-9,12 L-16,15 C-28,10 -32,-4 -28,-12 C-22,-4 -14,0 -8,-4 Z', hc);
    // facial hair
    if (h.must) s += path('M31,11 C24,9 15,13 9,21 C12,21 15,19 17,18 C22,17 28,17 32,14.5 Z', h.mustcol || hc);
    if (h.beard === 'long') s += path('M31,19 C37,44 26,74 8,86 C2,64 -10,42 -15,16 C-4,30 14,34 31,19 Z', h.beardcol || hc) + line('M12,40 q4,18 0,32 M22,36 q2,14 -4,28', R.dark(h.beardcol || hc, 0.25), 1.3);
    if (h.beard === 'short') s += path('M31,20 C33,34 22,42 8,40 C-2,36 -11,26 -15,16 C-4,28 14,31 31,20 Z', h.beardcol || hc);
    // marks & jewels
    if (h.tilak === 'urdhva') s += path('M19,-28 l3,10 l3,-10 Z', C.red) ;
    else if (h.tilak === 'tri') s += line('M8,-29 L23,-27 M7,-24.5 L24,-22.5 M8,-20 L24,-18', C.white, 2) + circ(17, -23.5, 2, C.red);
    else if (h.tilak === 'dot') s += circ(20, -21, 3, C.red);
    if (h.earring !== false) s += circ(-8, 12, h.earring === 'big' ? 7 : 4.2, C.gold, ol(C.gold)) + (h.earring === 'big' ? circ(-8, 12, 2.6, C.red) : '');
    if (h.nosering) s += R.ring(36, 9, 4, C.gold, 1.6);
    // --- gear over hair ---
    if (h.gear === 'mukut') s += crownP(h);
    if (h.gear === 'crown') s += smallCrown(h.gem);
    if (h.gear === 'turban') s += turban(h.tcol || C.saffron, h.tcol2 || C.red, h.tknot);
    if (h.gear === 'band') s += line('M-28,-16 Q0,-30 26,-18', h.tcol || C.gold, 4.5) + circ(22, -20, 3.4, C.red);
    if (h.gear === 'veil') { const v = h.veil || C.red; s += path('M14,-37 C-18,-46 -42,-24 -38,8 L-12,16 C-20,2 -14,-22 16,-28 Z', v) + line('M16,-29 C-14,-22 -20,2 -12,16', h.vborder || C.gold, 3.2) + line('M14,-33 C-18,-28 -26,0 -17,17', h.vborder || C.gold, 1.2, { 'stroke-dasharray': '1.5 5' }); }
    if (h.gear === 'tiara') s += path('M0,-36 L4,-48 L10,-36 L17,-45 L20,-31 Z', C.gold, ol(C.gold)) + line('M-28,-14 Q-4,-34 24,-24', C.gold, 3.5) + circ(10, -33, 2.5, C.red) + path('M22,-26 q6,3 3,9', 'none', { stroke: C.gold, 'stroke-width': 2 }) + circ(25, -15, 2.4, C.red);
    if (h.horns) s += path('M-22,-28 C-36,-44 -34,-62 -20,-70 C-26,-56 -20,-44 -10,-34 Z', C.bone, ol(C.bone)) + path('M8,-34 C6,-52 16,-66 30,-68 C20,-58 20,-46 22,-32 Z', C.bone, ol(C.bone));
    return { back, front: s };
  };

  // frontal head (deities in darshan, Ravana's row of heads)
  R.headF = function (h) {
    const sk = h.skin, hc = h.haircol || C.black, ink = C.ink; let back = '', s = '';
    if (h.halo) { const r = h.halo === true ? 60 : h.halo; back += circ(0, -6, r, C.gold) + R.ring(0, -6, r - 8, C.saffron, 2.5) + Array.from({ length: 20 }, (_, i) => circ(Math.cos(i * 0.314) * (r - 16), -6 + Math.sin(i * 0.314) * (r - 16), 2.8, i % 2 ? C.red : C.white)).join(''); }
    if (h.hair !== 'none') back += path('M-30,-14 C-44,10 -44,60 -38,92 L-20,86 C-24,50 -24,20 -22,0 Z M30,-14 C44,10 44,60 38,92 L20,86 C24,50 24,20 22,0 Z', hc);
    s += path('M0,-35 C22,-35 31,-19 30,0 C29,21 14,37 0,37 C-14,37 -29,21 -30,0 C-31,-19 -22,-35 0,-35 Z', sk, ol(sk));
    s += path('M-30,-6 C-32,-30 -16,-38 0,-38 C16,-38 32,-30 30,-6 C22,-22 10,-27 0,-27 C-10,-27 -22,-22 -30,-6 Z', hc);
    const e = h.eye || 'open';
    [-1, 1].forEach((sd) => {
      let q = '';
      if (e === 'closed') q = line('M-10,0 Q0,6 11,-1', ink, 2.3) + line('M-11,-9 Q0,-16 12,-9', ink, 2);
      else {
        const top = e === 'wide' ? -11 : -8.5;
        q = path(`M-11,0 Q0,${top} 12,-1 Q0,${e === 'wide' ? 8 : 5.5} -11,0 Z`, h.sclera || C.white) + circ(0.5, -1, e === 'wide' ? 3.4 : 4.3, ink) + circ(1.8, -2.4, 1, C.white) + line(`M-13,1 Q0,${top - 1.5} 14,-2`, ink, 2.6) + line(`M-11,0 Q0,${e === 'wide' ? 8 : 5.5} 12,-1`, ink, 0.9);
        q += line(e === 'angry' ? 'M-12,-8 Q0,-15 13,-17' : e === 'sad' ? 'M-12,-15 Q0,-16 13,-9' : 'M-12,-10 Q0,-18 13,-10', ink, e === 'angry' ? 3 : 2.1);
      }
      s += g(q, `translate(${sd * 13.5},-4) scale(${-sd},1)`);
    });
    s += line('M-1,-3 L-4,12 Q-1,15 4,12.5', R.dark(sk, 0.42), 1.7);
    const m = h.mouth || 'neutral', lip = h.lip || R.mix(sk, C.crimson, 0.6);
    if (m === 'smile') s += line('M-8,21 Q0,27 8,21', lip, 2.6);
    else if (m === 'fang' || m === 'open') s += path('M-9,20 Q0,17 9,20 Q6,30 0,30 Q-6,30 -9,20 Z', C.maroon) + path('M-6,20 l1.8,6 l1.8,-6 Z M2.4,20 l1.8,6 l1.8,-6 Z', C.white);
    else if (m === 'frown') s += line('M-8,24 Q0,19 8,24', lip, 2.6);
    else s += path('M-7,21 Q-3,19 0,21 Q3,19 7,21 Q0,26 -7,21 Z', lip);
    if (h.must) s += path('M0,17 C-8,13 -18,17 -23,25 C-16,22 -8,22 0,20 C8,22 16,22 23,25 C18,17 8,13 0,17 Z', h.mustcol || hc);
    if (h.beard) s += path('M-24,16 C-22,44 -8,58 0,58 C8,58 22,44 24,16 C14,34 -14,34 -24,16 Z', h.beardcol || hc);
    if (h.tilak === 'tri') s += line('M-9,-25 H9 M-10,-21 H10 M-9,-17 H9', C.white, 1.8) + circ(0, -21, 2, C.red);
    else if (h.tilak !== false) s += path('M-2.6,-27 L0,-15 L2.6,-27 Z', C.red);
    s += circ(-31, 8, 5, C.gold, ol(C.gold)) + circ(31, 8, 5, C.gold, ol(C.gold));
    if (h.gear === 'mukut') {
      const gd = C.gold;
      s += path('M-31,-22 L-28,-42 L28,-42 L31,-22 Q0,-32 -31,-22 Z', gd, ol(gd)) + path('M-23,-42 L-19,-60 L19,-60 L23,-42 Z', gd, ol(gd)) + path('M-14,-60 L-10,-76 L10,-76 L14,-60 Z', gd, ol(gd)) + path('M-7,-76 Q0,-86 0,-100 Q0,-86 7,-76 Z', gd, ol(gd)) + circ(0, -82, 5.5, C.red);
      [[-16, -32], [0, -33], [16, -32], [-9, -51], [9, -51], [0, -68]].forEach((p, i) => (s += circ(p[0], p[1], 3.2, i % 2 ? C.white : C.red)));
      s += path('M-31,-22 C-44,-18 -42,2 -33,4 Z M31,-22 C44,-18 42,2 33,4 Z', gd, ol(gd));
    }
    if (h.gear === 'crown') s += path('M-28,-22 L-32,-48 L-18,-37 L-9,-54 L0,-38 L9,-54 L18,-37 L32,-48 L28,-22 Q0,-31 -28,-22 Z', C.gold, ol(C.gold)) + circ(-9, -49, 3, h.gem || C.red) + circ(9, -49, 3, h.gem || C.red) + circ(0, -30, 3.4, h.gem || C.red);
    if (h.horns) s += path('M-24,-26 C-44,-34 -50,-56 -40,-70 C-40,-52 -30,-42 -14,-34 Z M24,-26 C44,-34 50,-56 40,-70 C40,-52 30,-42 14,-34 Z', C.bone, ol(C.bone));
    return { back, front: s };
  };

  // vanara (monkey) and bear heads in profile
  R.headMonkey = function (h) {
    const fur = h.fur, fc = h.facecol || R.light(fur, 0.55); let s = '', back = '';
    s += circ(-4, -4, 31, fur, ol(fur));
    s += path('M2,-24 C18,-27 27,-16 25,-6 C40,-5 46,8 40,18 C33,30 14,31 5,24 C-6,15 -8,-13 2,-24 Z', fc, ol(fc));
    s += R.spiral(-17, 0, 10, fc, 3.2, 1.5, 1, 0);
    const e = h.eye || 'open';
    if (e === 'closed') s += line('M7,-9 Q14,-4 22,-10', C.ink, 2.3);
    else s += path('M6,-10 Q14,-18 23,-11 Q14,-5 6,-10 Z', C.white) + circ(15, -11, 3.6, C.ink) + line('M4,-9 Q14,-20 25,-11', C.ink, 2.4) + line(e === 'angry' ? 'M4,-22 L26,-15' : 'M5,-19 Q15,-25 26,-18', C.ink, e === 'angry' ? 3 : 1.8);
    s += circ(38, 5, 1.8, C.ink) + (h.mouth === 'open' ? path('M24,14 Q34,12 40,15 Q34,25 26,22 Z', C.maroon) + path('M30,14 l1.5,4 l1.5,-4 Z', C.white) : line(h.mouth === 'smile' ? 'M22,17 Q32,23 41,15' : 'M23,18 Q32,19 41,16', C.umber, 2));
    if (h.gear === 'mukut') s += g(crownP(h), 'translate(-2,4) scale(.92)');
    if (h.gear === 'crown') s += g(smallCrown(h.gem), 'translate(-2,2)');
    if (h.gear === 'band') s += line('M-30,-20 Q-4,-36 22,-25', C.gold, 4.5) + circ(18, -27, 3.4, C.red);
    if (h.earring !== false) s += circ(-19, 13, 4, C.gold);
    return { back, front: s };
  };
  R.headBear = function (h) {
    const fur = h.fur; let s = circ(-4, -4, 32, fur, ol(fur)) + circ(-22, -30, 10, fur, ol(fur)) + circ(-22, -30, 4.5, R.light(fur, 0.3));
    s += path('M10,-8 C30,-10 46,2 44,12 C42,24 24,26 12,20 Z', R.light(fur, 0.35), ol(fur)) + circ(42, 6, 4, C.ink) + line('M20,17 Q30,20 40,15', C.ink, 1.8);
    s += path('M6,-12 Q13,-19 21,-13 Q13,-8 6,-12 Z', C.white) + circ(14, -13, 3.2, C.ink) + line('M4,-21 Q14,-26 24,-19', C.ink, 2);
    if (h.gear === 'band') s += line('M-30,-20 Q-4,-38 22,-27', C.gold, 4.5);
    return { back: '', front: s };
  };

  // ---------------- hand-held things (origin at grip, long axis up) ----------------
  R.item = function (k, o = {}) {
    const gd = C.gold;
    switch (k) {
      case 'bow': { const L = o.len || 100, pull = o.pull; // pull = [x,y] string point in item space
        let s = line(`M0,${-L} C${L * 0.55},${-L * 0.55} ${L * 0.55},${L * 0.55} 0,${L}`, C.amber, 8.5) + line(`M0,${-L} C${L * 0.55},${-L * 0.55} ${L * 0.55},${L * 0.55} 0,${L}`, gd, 5.5);
        s += line(`M0,${-L} q-9,-4 -8,-14 M0,${L} q-9,4 -8,14`, gd, 4.5) + line(`M${L * 0.39},-13 L${L * 0.39},13`, C.red, 9);
        s += pull ? line(`M0,${-L} L${n(pull[0])},${n(pull[1])} L0,${L}`, C.white, 1.8) : line(`M0,${-L} L0,${L}`, C.white, 1.8);
        return g(s, `translate(${-L * 0.39},0)`); }
      case 'arrow': { const L = o.len || 130; return line(`M0,20 L0,${-L}`, C.cream, 3) + path(`M-6,${-L + 6} L0,${-L - 14} L6,${-L + 6} Z`, o.tip || C.ash) + path('M0,20 l-7,10 v-10 Z M0,20 l7,10 v-10 Z M0,10 l-7,10 v-10 Z M0,10 l7,10 v-10 Z', o.fl || C.red); }
      case 'sword': return path('M-6,-10 L-7,-96 Q-4,-118 8,-128 Q10,-100 6,-10 Z', C.ice, ol(C.slate)) + line('M0,-14 L1,-110', C.white, 1.5) + rect(-14, -12, 28, 7, gd, { rx: 3 }) + rect(-4.5, -6, 9, 24, C.crimson, { rx: 3 }) + circ(0, 20, 5, gd);
      case 'gada': return line('M0,24 L0,-84', C.amber, 8) + line('M0,24 L0,-84', gd, 5) + path('M0,-150 C30,-150 38,-118 26,-98 C18,-86 -18,-86 -26,-98 C-38,-118 -30,-150 0,-150 Z', gd, ol(gd)) + line('M-24,-128 Q0,-120 24,-128 M-27,-112 Q0,-104 27,-112 M0,-150 V-90', C.amber, 2) + circ(0, -154, 6, C.red) + circ(0, 26, 5, C.red);
      case 'staff': return line('M0,60 L0,-150', C.umber, 6) + line('M0,60 L0,-150', C.brown, 3.4);
      case 'trident': return line('M0,60 L0,-130', C.amber, 6) + path('M0,-180 L6,-140 L18,-146 C24,-160 22,-172 18,-180 C30,-166 30,-144 22,-130 L-22,-130 C-30,-144 -30,-166 -18,-180 C-22,-172 -24,-160 -18,-146 L-6,-140 Z', C.ice, ol(C.slate));
      case 'spear': return line('M0,80 L0,-150', C.brown, 5) + path('M-9,-146 L0,-190 L9,-146 Z', C.ice, ol(C.slate)) + line('M-8,-146 H8', C.red, 5);
      case 'axe': return line('M0,60 L0,-120', C.brown, 6.5) + path('M0,-134 C30,-156 74,-144 82,-104 C62,-118 42,-114 32,-100 C42,-86 62,-82 82,-96 C74,-56 30,-44 0,-66 Z', C.ice, ol(C.slate)) + line('M10,-128 Q24,-100 10,-72', C.white, 2);
      case 'pot': return path('M-13,6 C-22,18 -18,38 0,38 C18,38 22,18 13,6 Z', o.col || C.clay, ol(C.clay)) + rect(-10, 0, 20, 7, o.col || C.clay) + line('M-9,2 Q0,-14 9,2', C.umber, 2.2);
      case 'bowl': return path('M-24,-10 Q-22,16 0,16 Q22,16 24,-10 Z', gd, ol(gd)) + ell(0, -10, 24, 6, C.white) + rect(-8, 16, 16, 5, gd) + line('M-16,2 Q0,8 16,2', C.amber, 1.8);
      case 'lotus': return line('M0,30 Q-6,6 0,-14', C.green, 3) + path('M0,-14 C-22,-22 -22,-44 -12,-50 C-10,-38 -4,-30 0,-28 C4,-30 10,-38 12,-50 C22,-44 22,-22 0,-14 Z', C.pink) + path('M0,-16 C-9,-28 -6,-46 0,-56 C6,-46 9,-28 0,-16 Z', C.rose);
      case 'flower': return circ(0, -6, 5, gd) + [0, 72, 144, 216, 288].map((a) => g(ell(0, -11, 4.5, 7, o.col || C.white), `translate(0,-6) rotate(${a})`)).join('');
      case 'chamara': return line('M0,30 L0,-40', gd, 4.5) + path('M0,-40 C-26,-50 -30,-90 -18,-118 C-10,-100 -4,-96 0,-124 C4,-96 10,-100 18,-118 C30,-90 26,-50 0,-40 Z', C.white, ol(C.ash)) + line('M-8,-60 q-4,-24 -2,-40 M8,-60 q4,-24 2,-40', C.ash, 1.5);
      case 'umbrella': return line('M0,40 L0,-220', gd, 5) + path('M-110,-218 C-90,-290 90,-290 110,-218 Q0,-236 -110,-218 Z', o.col || C.white, ol(C.ash)) + path('M-110,-218 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0', 'none', { stroke: C.red, 'stroke-width': 4 }) + circ(0, -276, 8, gd);
      case 'veena': return line('M0,40 L0,-120', C.brown, 7) + circ(0, 44, 22, C.amber, ol(C.amber)) + circ(0, -110, 14, C.amber, ol(C.amber)) + line('M-2,40 L-2,-118 M2,40 L2,-118', C.cream, 1);
      case 'torch': return line('M0,50 L0,-20', C.umber, 6) + R.flame(0, -18, 0.36, o.seed || 2);
      case 'ring': return R.ring(0, -6, 6.5, gd, 3.4) + circ(0, -13, 3.6, C.red);
      case 'jewel': return path('M0,-22 L10,-8 L0,6 L-10,-8 Z', C.aqua, ol(C.teal)) + R.ring(0, -8, 14, gd, 3) + circ(0, -8, 3, C.white);
      case 'sandals': return ell(-9, -6, 7, 17, gd, ol(gd)) + ell(9, -6, 7, 17, gd, ol(gd)) + circ(-9, -16, 3, C.red) + circ(9, -16, 3, C.red);
      case 'rock': return path('M-34,0 L-40,-30 L-18,-56 L16,-60 L40,-34 L36,0 Z', R.pat('stone', C.slate, C.ash, 0.5), ol(C.slate));
      case 'tree': return line('M0,40 L0,-150', C.umber, 12) + circ(0, -170, 46, R.pat('leafs', C.green, C.lime), ol(C.forest)) + line('M0,40 l-14,18 M0,40 l12,20 M0,40 l0,22', C.umber, 4);
      case 'garland': return Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return circ(Math.cos(a) * 22, 26 + Math.sin(a) * 30, 5.6, i % 2 ? C.white : o.col || C.vermilion); }).join('');
      case 'flag': return line('M0,60 L0,-200', C.umber, 5) + path('M0,-200 L70,-186 L40,-170 L72,-150 L0,-146 Z', o.col || C.red) + circ(30, -174, 6, gd);
      case 'shield': return circ(0, 0, 34, o.col || C.crimson, ol(C.maroon)) + R.ring(0, 0, 26, gd, 3) + circ(0, 0, 7, gd);
      case 'grass': return line('M0,10 Q-2,-14 3,-34', C.lime, 2.6);
      case 'letter': return rect(-10, -16, 20, 26, C.cream, { rx: 2 });
      case 'conch': return path('M-10,10 C-22,-4 -10,-28 8,-26 C22,-22 22,0 6,12 Z', C.white, ol(C.ash)) + R.spiral(2, -8, 9, C.ash, 1.6, 1.6);
    }
    return '';
  };

  // ---------------- poses ----------------
  // arms: [upperAngle, foreAngle] (0 = down, 90 = forward) or {t:[x,y]} hand target in torso space (hip = 0,0; shoulders at y=-88)
  const POSES = (R.POSES = {
    stand: { aL: [-10, -4], aR: [10, 16], lL: [-5, -3], lR: [5, 3] },
    walk: { aL: [-26, -8], aR: [28, 46], lL: [-24, -38], lR: [24, 6], lean: 4 },
    run: { aL: [-58, 30], aR: [60, 118], lL: [-44, -92], lR: [56, 14], lean: 15 },
    stride: { aL: [-20, -10], aR: [30, 50], lL: [-34, -44], lR: [38, 6], lean: 6 },
    archer: { aR: [90, 90], aL: [-104, 97], lL: [-32, -46], lR: [38, 4], lean: -3, draw: 1, both: 1 },
    archerUp: { aR: [128, 128], aL: [-70, 132], lL: [-30, -44], lR: [36, 6], lean: -10, draw: 1, both: 1 },
    kneelArcher: { aR: [92, 92], aL: [-104, 97], lL: [8, -92], lR: [86, 0], lean: 0, draw: 1, both: 1 },
    namaste: { aR: { t: [36, -70] }, aL: { t: [36, -70] }, lL: [-5, -3], lR: [5, 3], hands: 'fold', both: 1 },
    bow: { aR: { t: [44, -66] }, aL: { t: [44, -66] }, lL: [-6, -4], lR: [8, 2], hands: 'fold', both: 1, lean: 32, head: 14 },
    kneel: { aL: [-8, 10], aR: [20, 60], lL: [12, -90], lR: [18, -90] },
    kneelNamaste: { aR: { t: [38, -66] }, aL: { t: [38, -66] }, lL: [12, -90], lR: [18, -90], hands: 'fold', both: 1, lean: 8 },
    kneelOne: { aL: [-10, 10], aR: [40, 80], lL: [8, -92], lR: [84, 0], lean: 6 },
    prostrate: { aR: { t: [70, -92] }, aL: { t: [70, -92] }, lL: [14, -90], lR: [20, -90], hands: 'fold', both: 1, lean: 62, head: 10 },
    sit: { aL: [-14, 30], aR: [24, 62], lL: [-76, 78], lR: [78, -78] },
    sitNamaste: { aR: { t: [34, -62] }, aL: { t: [34, -62] }, lL: [-76, 78], lR: [78, -78], hands: 'fold', both: 1 },
    sitBless: { aL: [-16, 34], aR: [60, 168], lL: [-76, 78], lR: [78, -78], handR: 'palm' },
    throne: { aL: [-24, 40], aR: [36, 70], lL: [70, 4], lR: [84, 0] },
    bless: { aL: [-10, -2], aR: [62, 170], lL: [-5, -3], lR: [5, 3], handR: 'palm' },
    point: { aL: [-12, -4], aR: [84, 82], lL: [-8, -6], lR: [12, 4], lean: 4 },
    reach: { aR: [80, 70], aL: [64, 78], lL: [-20, -34], lR: [26, 6], lean: 12, both: 1 },
    plead: { aR: [70, 110], aL: [50, 104], lL: [-6, -4], lR: [8, 4], lean: 8, both: 1, head: -6 },
    armsUp: { aR: [150, 172], aL: [-150, -172], lL: [-8, -6], lR: [10, 4] },
    lift: { aR: [150, 196], aL: [-150, -196], lL: [-18, -8], lR: [22, 4] },
    cheer: { aR: [140, 176], aL: [-120, -168], lL: [-8, -6], lR: [12, 4], lean: -4 },
    dance: { aR: [110, 190], aL: [-70, -150], lL: [-10, -60], lR: [34, -12], lean: -8, head: -6 },
    strike: { aR: [150, 210], aL: [-30, 40], lL: [-34, -44], lR: [40, 4], lean: 8 },
    slash: { aR: [100, 60], aL: [-50, -10], lL: [-34, -46], lR: [42, 4], lean: 14 },
    guard: { aR: [70, 150], aL: [40, 120], lL: [-26, -30], lR: [26, 8], lean: -8, both: 1 },
    throw: { aR: [-140, -190], aL: [80, 70], lL: [-36, -50], lR: [42, 2], lean: 10 },
    grief: { aR: { t: [26, -112] }, aL: [-10, 20], lL: [-5, -3], lR: [5, 3], lean: 12, head: 16 },
    sitGrief: { aR: { t: [30, -100] }, aL: [-14, 40], lL: [-76, 78], lR: [78, -78], lean: 14, head: 16 },
    kneelGrief: { aR: { t: [26, -104] }, aL: [-10, 30], lL: [12, -90], lR: [18, -90], lean: 16, head: 18 },
    hug: { aR: [78, 40], aL: [66, 96], lL: [-6, -4], lR: [8, 4], lean: 6, both: 1 },
    carry: { aR: [40, 110], aL: [30, 104], lL: [-22, -34], lR: [24, 6], both: 1 },
    fly: { aR: [150, 160], aL: [118, 132], lL: [-32, -64], lR: [-8, -22], both: 1 },
    leap: { aR: [140, 170], aL: [-70, -20], lL: [-50, -110], lR: [70, 0], lean: 10 },
    fall: { aR: [160, 200], aL: [-140, -170], lL: [-40, -80], lR: [30, 70], head: -20 },
    lie: { aR: [20, 30], aL: [-10, -4], lL: [-4, -2], lR: [6, 12] },
    recoil: { aR: [-40, 120], aL: [-70, 100], lL: [-30, -20], lR: [14, 30], lean: -18, head: -8, both: 1 },
    offer: { aR: [58, 96], aL: [44, 92], lL: [-5, -3], lR: [5, 3], lean: 6, both: 1 },
    drag: { aR: [96, 70], aL: [-40, -70], lL: [-38, -52], lR: [44, 0], lean: 18 },
    tiptoe: { aR: [30, 100], aL: [-40, 30], lL: [-12, -50], lR: [30, 16], lean: 16, head: 6 },
    climb: { aR: [150, 130], aL: [110, 150], lL: [-10, -80], lR: [70, -20], lean: 6, both: 1 },
  });
  const BASE = { hipW: 9, sh: 22, shY: -88, up: 50, fo: 48, th: 68, shn: 68 };

  function ik(S, T, a, b, bend) {
    const dx = T[0] - S[0], dy = T[1] - S[1]; let d = Math.hypot(dx, dy); d = Math.max(Math.abs(a - b) + 1, Math.min(a + b - 0.5, d));
    const base = Math.atan2(dy, dx), A = Math.acos((a * a + d * d - b * b) / (2 * a * d)), ea = base + bend * A;
    return [[S[0] + Math.cos(ea) * a, S[1] + Math.sin(ea) * a], [S[0] + Math.cos(base) * d, S[1] + Math.sin(base) * d]];
  }
  const dir = (a) => [Math.sin(rad(a)), Math.cos(rad(a))];

  // ---------------- the figure ----------------
  R.fig = function (o) {
    const pz = Object.assign({}, POSES.stand, typeof o.pose === 'string' ? POSES[o.pose] : Array.isArray(o.pose) ? Object.assign({}, POSES[o.pose[0]], o.pose[1]) : o.pose || {});
    const sk = o.skin || C.sTan, b = Object.assign({}, BASE, o.build || {}), lean = pz.lean || 0, cl = o.cloth || {}, fur = o.fur;
    const limbCol = fur || sk;
    // legs (hip at origin)
    const hips = [[-b.hipW, 0], [b.hipW, 0]], legs = [pz.lL, pz.lR].map((a, i) => { const d1 = dir(a[0]), d2 = dir(a[1]); const K = [hips[i][0] + d1[0] * b.th, d1[1] * b.th], F = [K[0] + d2[0] * b.shn, K[1] + d2[1] * b.shn]; return { H: hips[i], K, F, a }; });
    let low = 18; legs.forEach((l) => { low = Math.max(low, l.K[1] + 11, l.F[1] + 9); });
    const hipY = -low;
    const lw = cl.lw || (cl.lower === 'sari' || cl.lower === 'robe' ? 33 : 21), lc = cl.lc || C.mustard, cover = cl.lower === 'sari' || cl.lower === 'robe' ? 1 : cl.lower === 'short' ? 0 : cl.lower === 'none' ? -1 : 0.62;
    const drawLeg = (l, li) => {
      let s = '';
      const seg = (A, B, col, w) => line(`M${n(A[0])},${n(A[1])} L${n(B[0])},${n(B[1])}`, col, w);
      // bare limb
      s += seg(l.H, l.K, R.dark(limbCol, 0.38), 19.5) + seg(l.K, l.F, R.dark(limbCol, 0.38), 15.5) + seg(l.H, l.K, limbCol, 17) + seg(l.K, l.F, limbCol, 13);
      // foot
      const fa = Math.abs(l.a[1]) > 60 ? (l.a[1] > 0 ? 90 : -90) : 0; // shin lying flat: foot points along it
      s += g(path('M-6,-5 L10,-3 Q20,2 19,6 Q18,9 12,9 L-6,9 Q-9,2 -6,-5 Z', limbCol, ol(limbCol)) + (o.anklet !== false && !fur ? line('M-6,-4 L7,-3', C.gold, 3.6) : ''), `translate(${n(l.F[0])},${n(l.F[1])}) rotate(${fa === 0 ? 0 : fa > 0 ? -70 : 110})${o.front && li === 0 ? ' scale(-1,1)' : ''}`);
      if (cover >= 0) {
        const M = [l.K[0] + (l.F[0] - l.K[0]) * cover, l.K[1] + (l.F[1] - l.K[1]) * cover];
        s += seg(l.H, l.K, R.dark(typeof lc === 'string' && lc[0] === '#' ? lc : C.umber, 0.36), lw + 2.6) + (cover > 0 ? seg(l.K, M, R.dark(typeof lc === 'string' && lc[0] === '#' ? lc : C.umber, 0.36), lw - 1.4) : '');
        s += seg(l.H, l.K, cl.lpat || lc, lw) + (cover > 0 ? seg(l.K, M, cl.lpat || lc, lw - 4) : '');
        if (cover > 0 && cl.hem) { const N = [l.K[0] + (l.F[0] - l.K[0]) * (cover - 0.14), l.K[1] + (l.F[1] - l.K[1]) * (cover - 0.14)]; s += line(`M${n(N[0])},${n(N[1])} L${n(M[0])},${n(M[1])}`, cl.hem, lw - 4, { 'stroke-linecap': 'butt' }); }
      }
      return s;
    };
    // arms in torso space
    const SH = [[-b.sh, b.shY + 4], [b.sh, b.shY + 4]];
    const arm = (spec, i) => {
      let E, W;
      if (spec && spec.t) { const r = ik(SH[i], spec.t, b.up, b.fo, spec.bend != null ? spec.bend : 1); E = r[0]; W = r[1]; }
      else { const d1 = dir(spec[0] + lean), d2 = dir(spec[1] + lean); E = [SH[i][0] + d1[0] * b.up, SH[i][1] + d1[1] * b.up]; W = [E[0] + d2[0] * b.fo, E[1] + d2[1] * b.fo]; }
      return { S: SH[i], E, W, ang: (Math.atan2(W[1] - E[1], W[0] - E[0]) * 180) / Math.PI };
    };
    const A = [arm(pz.aL, 0), arm(pz.aR, 1)];
    const sleeve = cl.sleeve;
    const drawArm = (a, i, withItem) => {
      let s = '';
      const seg = (P, Q, col, w) => line(`M${n(P[0])},${n(P[1])} L${n(Q[0])},${n(Q[1])}`, col, w);
      s += seg(a.S, a.E, R.dark(limbCol, 0.38), 17) + seg(a.E, a.W, R.dark(limbCol, 0.38), 14) + seg(a.S, a.E, limbCol, 14.5) + seg(a.E, a.W, limbCol, 11.5);
      if (sleeve) { const M = [a.S[0] + (a.E[0] - a.S[0]) * 0.8, a.S[1] + (a.E[1] - a.S[1]) * 0.8]; s += seg(a.S, M, R.dark(sleeve, 0.36), 20) + seg(a.S, M, cl.spat || sleeve, 17.5); }
      else if (o.armlet !== false && !fur) { const M = [a.S[0] + (a.E[0] - a.S[0]) * 0.5, a.S[1] + (a.E[1] - a.S[1]) * 0.5], N = [a.S[0] + (a.E[0] - a.S[0]) * 0.64, a.S[1] + (a.E[1] - a.S[1]) * 0.64]; s += line(`M${n(M[0])},${n(M[1])} L${n(N[0])},${n(N[1])}`, C.gold, 16.5, { 'stroke-linecap': 'butt' }); }
      if (o.bangle !== false) { const M = [a.E[0] + (a.W[0] - a.E[0]) * 0.8, a.E[1] + (a.W[1] - a.E[1]) * 0.8], N = [a.E[0] + (a.W[0] - a.E[0]) * 0.93, a.E[1] + (a.W[1] - a.E[1]) * 0.93]; s += line(`M${n(M[0])},${n(M[1])} L${n(N[0])},${n(N[1])}`, o.banglecol || C.gold, 13.5, { 'stroke-linecap': 'butt' }); }
      const hk = (i ? pz.handR : pz.handL) || pz.hands || 'open';
      const it = withItem && o.hold && (i ? o.hold.R : o.hold.L);
      let hand = '';
      if (hk === 'fold') { if (i) hand = g(path('M-4,6 C-10,-6 -4,-24 2,-34 C8,-24 12,-6 6,6 Z', limbCol, ol(limbCol)) + line('M1,4 L2,-30', R.dark(limbCol, 0.35), 1.2), `translate(${n(a.W[0])},${n(a.W[1])}) rotate(${n(18 + (pz.lean || 0) * 0)})`); }
      else if (hk === 'palm') hand = g(path('M-7,4 L-8,-12 Q-8,-22 -3,-23 L5,-23 Q9,-22 9,-12 L8,4 Z', limbCol, ol(limbCol)) + line('M-3,-22 V-10 M1,-23 V-10 M5,-22 V-10', R.dark(limbCol, 0.3), 1) + path('M8,-2 q8,-4 8,-12', 'none', { stroke: limbCol, 'stroke-width': 5, 'stroke-linecap': 'round' }) + circ(0, -6, 2.6, C.red), `translate(${n(a.W[0])},${n(a.W[1])}) rotate(${-lean})`);
      else hand = g(ell(6, 0, 9.5, 6.8, limbCol, ol(limbCol)) + (it ? '' : line('M8,-5 q5,-3 8,0', limbCol, 4)), `translate(${n(a.W[0])},${n(a.W[1])}) rotate(${n(a.ang)})`);
      let item = '';
      if (it) {
        const spec = typeof it === 'string' ? { k: it } : it; let io = Object.assign({}, spec);
        // rot: 0 = item upright in the world. A drawn bow squares itself to the bow arm; `along` continues the forearm.
        let rot = spec.rot != null ? spec.rot - lean : spec.k === 'bow' && pz.draw && i === 1 ? a.ang : (spec.along ? a.ang + 90 : -lean) + (spec.tilt || 0);
        if (spec.k === 'bow' && pz.draw && i === 1 && !spec.nodraw) {
          // string hand = other arm's wrist, expressed in bow space
          const ox = A[0].W[0] - a.W[0], oy = A[0].W[1] - a.W[1], r0 = rad(-rot), px = ox * Math.cos(r0) - oy * Math.sin(r0), py = ox * Math.sin(r0) + oy * Math.cos(r0);
          io.pull = [px + (io.len || 100) * 0.39, py];
          const aa = (Math.atan2(a.W[1] - A[0].W[1], a.W[0] - A[0].W[0]) * 180) / Math.PI;
          item += g(R.item('arrow', { len: Math.hypot(ox, oy) + 34, tip: spec.tip, fl: spec.fl }), `translate(${n(A[0].W[0])},${n(A[0].W[1])}) rotate(${n(aa + 90)})`);
        }
        item = g(R.item(spec.k, io), `translate(${n(a.W[0])},${n(a.W[1])}) rotate(${n(rot)}) scale(${spec.s || 1})`) + item;
        if (spec.under) return item + s + hand;
      }
      return s + item + hand;
    };

    // torso
    const fem = o.fem, tw = fem ? 21 : 26, ww = fem ? 15 : 19;
    const torsoD = `M${-tw},${b.shY + 2} Q${-tw - 2},${b.shY - 8} ${-tw + 10},${b.shY - 9} L${tw - 10},${b.shY - 9} Q${tw + 2},${b.shY - 8} ${tw},${b.shY + 2} L${ww},-6 Q0,2 ${-ww},-6 Z`;
    const tcol = fur || sk; let torso = path(torsoD, tcol, ol(tcol));
    const up = cl.upper;
    if (up === 'tunic' || up === 'armor' || up === 'robe') torso = path(torsoD, cl.upat || cl.uc || C.mustard, ol(cl.uc || C.mustard));
    if (up === 'robe1') torso += path(`M${-tw},${b.shY + 2} Q${-tw - 2},${b.shY - 8} ${-tw + 10},${b.shY - 9} L${-2},${b.shY - 9} L${ww},-40 L${ww},-6 Q0,2 ${-ww},-6 Z`, cl.upat || cl.uc || C.saffron, ol(cl.uc || C.saffron));
    if (up === 'blouse') torso += path(`M${-tw},${b.shY + 2} Q${-tw - 2},${b.shY - 8} ${-tw + 10},${b.shY - 9} L${tw - 10},${b.shY - 9} Q${tw + 2},${b.shY - 8} ${tw},${b.shY + 2} L${tw - 3},${b.shY + 40} Q0,${b.shY + 48} ${-tw + 3},${b.shY + 40} Z`, cl.upat || cl.uc || C.red, ol(cl.uc || C.red));
    if (fur && o.chest) torso += ell(2, b.shY + 34, 15, 26, o.chest);
    if (up === 'armor') torso += line(`M${-tw + 4},${b.shY + 26} Q0,${b.shY + 36} ${tw - 4},${b.shY + 26} M${-ww - 2},${b.shY + 52} Q0,${b.shY + 62} ${ww + 2},${b.shY + 52}`, C.gold, 3);
    if (cl.sash) torso += path(`M${-tw + 2},${b.shY - 6} L${-tw + 16},${b.shY - 9} L${ww + 1},-20 L${ww - 3},-2 Z`, cl.spatt || cl.sash, ol(typeof cl.sash === 'string' ? cl.sash : C.mustard));
    if (cl.pallu) torso += path(`M${tw - 4},${b.shY - 9} L${tw - 18},${b.shY - 9} L${-ww - 1},-22 L${-ww + 2},-2 L${ww},-6 L${ww + 2},-34 Z`, cl.ppat || cl.pallu, ol(typeof cl.pallu === 'string' ? cl.pallu : C.red)) + line(`M${tw - 18},${b.shY - 9} L${-ww - 1},-22`, cl.pborder || C.gold, 3);
    if (cl.thread) torso += line(`M${-tw + 12},${b.shY - 8} Q${ww + 6},${b.shY + 40} ${ww - 4},-8`, C.white, 1.8);
    // necklaces
    const nk = o.neck != null ? o.neck : fur ? 0 : 2;
    if (nk >= 1) torso += line(`M-13,${b.shY - 8} Q0,${b.shY + 14} 13,${b.shY - 8}`, C.gold, 4.2) + circ(0, b.shY + 4, 3.6, C.red);
    if (nk >= 2) torso += line(`M-17,${b.shY - 6} Q0,${b.shY + 40} 17,${b.shY - 6}`, C.white, 2.6, { 'stroke-dasharray': '0.5 5.5' }) + line(`M-15,${b.shY - 7} Q0,${b.shY + 27} 15,${b.shY - 7}`, C.gold, 2.4);
    if (nk >= 3) torso += path(`M-5,${b.shY + 33} L0,${b.shY + 44} L5,${b.shY + 33} Z`, C.gold) + circ(0, b.shY + 36, 3, C.red);
    if (cl.mala) torso += line(`M-15,${b.shY - 7} Q0,${b.shY + 52} 15,${b.shY - 7}`, C.umber, 4, { 'stroke-dasharray': '0.5 6.5' });
    if (cl.garland) torso += line(`M-17,${b.shY - 6} Q0,${b.shY + 76} 17,${b.shY - 6}`, C.white, 8, { 'stroke-dasharray': '0.5 9' }) + line(`M-17,${b.shY - 6} Q0,${b.shY + 76} 17,${b.shY - 6}`, cl.garland, 8, { 'stroke-dasharray': '0.5 9', 'stroke-dashoffset': 4.7 });
    // belt + front pleat
    let belt = '';
    if (cl.belt !== false && cover >= 0) belt += path(`M${-ww - 3},-12 Q0,-4 ${ww + 3},-12 L${ww + 3},2 Q0,10 ${-ww - 3},2 Z`, cl.belt || C.red, ol(cl.belt || C.red)) + (cl.buckle !== false ? circ(0, -1, 5.5, C.gold) + circ(0, -1, 2.2, C.red) : '');
    let pleat = '';
    if (cover > 0 && cover < 1 && Math.abs(pz.lL[0]) < 30 && Math.abs(pz.lR[0]) < 45 && cl.pleat !== false) pleat = path('M-7,0 L7,0 L15,78 Q4,84 -6,80 Z', cl.pc || R.light(typeof lc === 'string' && lc[0] === '#' ? lc : C.mustard, 0.25), ol(C.mustard)) + line('M-2,4 L1,78 M3,4 L9,78', R.dark(typeof lc === 'string' && lc[0] === '#' ? lc : C.mustard, 0.2), 1.2);
    if (cover === 1 && cl.pleatc && Math.abs(pz.lL[0]) < 30 && Math.abs(pz.lR[0]) < 30) pleat = path('M-6,0 L8,0 L20,128 Q6,134 -8,128 Z', cl.pleatc) + line('M0,6 L4,126 M5,6 L13,126', R.dark(cl.pleatc, 0.22), 1.3);

    // head
    const hd = Object.assign({ skin: sk }, o.head || {});
    if (pz.eye && !(o.head && o.head.eye)) hd.eye = pz.eye;
    const H = o.kind === 'monkey' ? R.headMonkey(Object.assign({ fur }, hd)) : o.kind === 'bear' ? R.headBear(Object.assign({ fur }, hd)) : o.front ? R.headF(hd) : R.headP(hd);
    const hs = o.hs || 1, hx = o.front ? 0 : 3, hy = b.shY - 38 * hs, htf = `translate(${hx},${n(hy)}) rotate(${n(pz.head || 0)} ${-2},${30}) scale(${hs})`;
    const neck = rect(-7.5, b.shY - 22, 15, 20, tcol, ol(tcol));

    // tail (vanaras)
    let tail = '';
    if (o.tail) { const tp = o.tail === true ? [[-12, -4], [-52, 6], [-86, -30], [-80, -86], [-48, -112], [-30, -92], [-44, -76]] : o.tail; tail = line(R.smooth(tp), R.dark(fur, 0.38), 14) + line(R.smooth(tp), fur, 11.5); }

    // extra arms (Ravana's twenty)
    let xarms = '';
    if (o.arms) {
      const NA = o.arms, wp = o.armWeapons || ['sword', 'gada', 'trident', 'spear', 'axe', 'arrow'];
      for (let k = 0; k < NA; k++) {
        [-1, 1].forEach((sd) => {
          const t = (k + 0.5) / NA, a1 = sd * (28 + t * 128), a2 = a1 + sd * (26 + 18 * Math.sin(k * 2.1));
          const d1 = dir(a1), d2 = dir(a2), S = [sd * (b.sh - 4), b.shY + 6], E = [S[0] + d1[0] * (b.up + 8), S[1] + d1[1] * (b.up + 8)], W = [E[0] + d2[0] * (b.fo + 6), E[1] + d2[1] * (b.fo + 6)];
          const seg = (P, Q, col, w) => line(`M${n(P[0])},${n(P[1])} L${n(Q[0])},${n(Q[1])}`, col, w);
          const wk = wp[(k * 2 + (sd > 0 ? 1 : 0)) % wp.length];
          xarms += (o.armItems !== false && k % 1 === 0 ? g(R.item(wk), `translate(${n(W[0])},${n(W[1])}) rotate(${n(-a2 + 180 + sd * 8)}) scale(.62)`) : '') + seg(S, E, R.dark(sk, 0.4), 15.5) + seg(E, W, R.dark(sk, 0.4), 12.5) + seg(S, E, R.dark(sk, 0.1), 13) + seg(E, W, R.dark(sk, 0.1), 10) + line(`M${n(E[0] + (W[0] - E[0]) * 0.78)},${n(E[1] + (W[1] - E[1]) * 0.78)} L${n(E[0] + (W[0] - E[0]) * 0.92)},${n(E[1] + (W[1] - E[1]) * 0.92)}`, C.gold, 12, { 'stroke-linecap': 'butt' }) + circ(W[0], W[1], 7.5, R.dark(sk, 0.1));
        });
      }
    }
    // extra heads (Ravana): fan of nine around the central head
    let xheads = '';
    if (o.heads) {
      const mk = (hh, tf) => { const X = (o.front ? R.headF : R.headP)(Object.assign({}, hd, hh)); return g(X.back + X.front, tf); };
      const moods = o.headMoods || [];
      if (o.front) { for (let k = 4; k >= 0; k--) [-1, 1].forEach((sd) => { if (sd > 0 && k === 4 && o.heads < 10) return; const idx = sd < 0 ? k : 5 + k; if (sd > 0 && k > 3) return; const dx = sd * (46 + k * 44) * hs, dy = (k * k * 2.2 + 4) * hs, sc = hs * (0.93 - k * 0.045); xheads += mk(Object.assign({ halo: 0 }, moods[idx] || {}), `translate(${n(hx + dx)},${n(hy + dy)}) rotate(${sd * (k + 1) * 4.5}) scale(${n(sc)})`); }); }
      else { for (let k = 0; k < 9; k++) { const t = k / 8, a = -150 + t * 150, r = 58 + 10 * Math.sin(t * 3.14); const idx = k; xheads += mk(Object.assign({ halo: 0 }, moods[idx] || {}), `translate(${n(hx - 6 + Math.cos(rad(a)) * r * hs)},${n(hy + 6 + Math.sin(rad(a)) * r * hs)}) rotate(${n((a + 20) * 0.38)}) scale(${n(hs * 0.8)})`); } }
    }

    // assemble
    const both = pz.both || o.armsFront;
    let upper = '';
    upper += (o.cape ? path(`M${-tw},${b.shY} C${-tw - 40},${b.shY + 40} ${-tw - 50},40 ${-tw - 30},110 L${-ww + 4},90 Z`, o.cape, ol(o.cape)) : '');
    upper += xarms;
    upper += g(H.back, htf);
    if (!both) upper += drawArm(A[0], 0, true);
    upper += torso + neck + xheads + g(H.front, htf);
    if (both) upper += drawArm(A[0], 0, true);
    upper += drawArm(A[1], 1, true);
    let hull = '';
    if (cover === 1 && Math.abs(pz.lL[0]) < 50 && Math.abs(pz.lR[0]) < 50 && Math.abs(pz.lL[1]) < 62 && Math.abs(pz.lR[1]) < 62) {
      const a = legs[0], c = legs[1], q = lw / 2 - 1, lf = a.F[0] < c.F[0] ? [a, c] : [c, a];
      hull = path(`M${n(-b.hipW - q)},0 L${n(lf[0].K[0] - q)},${n(lf[0].K[1])} L${n(lf[0].F[0] - q - 3)},${n(lf[0].F[1] - 2)} L${n(lf[1].F[0] + q + 3)},${n(lf[1].F[1] - 2)} L${n(lf[1].K[0] + q)},${n(lf[1].K[1])} L${n(b.hipW + q)},0 Z`, cl.lpat || lc, ol(typeof lc === 'string' && lc[0] === '#' ? lc : C.umber));
      if (cl.hem) hull += line(`M${n(lf[0].F[0] - q - 2)},${n(lf[0].F[1] - 7)} L${n(lf[1].F[0] + q + 2)},${n(lf[1].F[1] - 7)}`, cl.hem, 9, { 'stroke-linecap': 'butt' });
    }
    const lower = tail + drawLeg(legs[0], 0) + drawLeg(legs[1], 1) + hull + pleat;
    const body = g(lower + g(upper, `rotate(${n(lean)})`) + g(belt, `rotate(${n(lean * 0.4)})`), `translate(0,${n(hipY)})`);
    const f = o.face === -1 ? -1 : 1;
    return g(body, R.tf(o.x || 0, o.y || 0, o.s || 1, o.rot || 0, f), o.op != null ? { opacity: o.op } : null);
  };
  R.headTop = (o) => { const s = o.s || 1; return [(o.x || 0), (o.y || 0) - s * 290]; };

  // ---------------- cast ----------------
  const P = R.pat;
  const jewel = { neck: 3 };
  const CAST = (R.CAST = {
    // Rama: dark as a blue lotus. Prince (crowned) and exile (bark, matted hair) looks.
    rama: () => ({ label: 'Rama', skin: C.sBlue, neck: 3, head: { gear: 'mukut', hair: 'long', tilak: 'urdhva', earring: 'big' }, cloth: { lc: C.mustard, lpat: P('swirl', C.mustard, C.straw, 0.7), sash: C.straw, spatt: P('dots', C.straw, C.vermilion, 0.8), belt: C.red } }),
    ramaX: () => ({ label: 'Rama', skin: C.sBlue, neck: 1, armlet: false, head: { hair: 'jata', tilak: 'urdhva', earring: false }, cloth: { lc: C.ochre, lpat: P('bark', C.ochre, C.brown, 0.8), sash: C.clay, spatt: P('bark', C.clay, C.umber, 0.8), belt: C.umber, buckle: false, thread: 1 }, bangle: false, anklet: false }),
    lakshmana: () => ({ label: 'Lakshmana', skin: C.sWheat, neck: 2, head: { gear: 'mukut', hair: 'long', tilak: 'urdhva', earring: 'big' }, cloth: { lc: C.azure, lpat: P('dots', C.azure, C.pale, 0.8), sash: C.cream, spatt: P('stripes', C.cream, C.azure, 0.7), belt: C.gold } }),
    lakshmanaX: () => ({ label: 'Lakshmana', skin: C.sWheat, neck: 1, armlet: false, head: { hair: 'jata', tilak: 'urdhva', earring: false }, cloth: { lc: C.clay, lpat: P('bark', C.clay, C.umber, 0.8), sash: C.ochre, spatt: P('bark', C.ochre, C.brown, 0.8), belt: C.umber, buckle: false, thread: 1 }, bangle: false, anklet: false }),
    bharata: () => ({ label: 'Bharata', skin: C.sBlue, neck: 2, head: { gear: 'mukut', hair: 'long', tilak: 'urdhva', earring: 'big' }, cloth: { lc: C.vermilion, lpat: P('dots', C.vermilion, C.gold, 0.8), sash: C.cream, belt: C.gold } }),
    bharataX: () => ({ label: 'Bharata', skin: C.sBlue, neck: 1, armlet: false, head: { hair: 'jata', tilak: 'urdhva', earring: false }, cloth: { lc: C.ochre, lpat: P('bark', C.ochre, C.brown, 0.8), sash: C.clay, belt: C.umber, buckle: false }, bangle: false }),
    shatrughna: () => ({ label: 'Shatrughna', skin: C.sWheat, neck: 2, head: { gear: 'mukut', hair: 'long', tilak: 'urdhva' }, cloth: { lc: C.green, lpat: P('dots', C.green, C.lime, 0.8), sash: C.cream, belt: C.gold } }),
    sita: () => ({ label: 'Sita', fem: 1, skin: C.sFair, neck: 3, head: { hair: 'bun', gear: 'veil', veil: C.red, tilak: 'dot', earring: 'big', nosering: 1, lip: C.red }, cloth: { lower: 'sari', lc: C.red, lpat: P('flower', C.red, C.gold, 0.8), hem: C.gold, upper: 'blouse', uc: C.mustard, pallu: C.vermilion, ppat: P('dots', C.vermilion, C.gold, 0.8), belt: C.gold, pleatc: C.vermilion } }),
    sitaX: () => ({ label: 'Sita', fem: 1, skin: C.sFair, neck: 2, head: { hair: 'braid', gear: 'veil', veil: C.mustard, vborder: C.red, tilak: 'dot', earring: 'big', lip: C.red }, cloth: { lower: 'sari', lc: C.mustard, lpat: P('flower', C.mustard, C.red, 0.8), hem: C.red, upper: 'blouse', uc: C.red, pallu: C.straw, ppat: P('dots', C.straw, C.red, 0.8), belt: C.red, buckle: false, pleatc: C.straw } }),
    sitaL: () => ({ label: 'Sita', fem: 1, skin: C.sFair, neck: 0, armlet: false, bangle: false, head: { hair: 'braid', tilak: 'dot', earring: false, eye: 'sad', lip: C.red }, cloth: { lower: 'sari', lc: C.ochre, lpat: P('hstripes', C.ochre, C.mustard, 1.2), hem: C.umber, upper: 'blouse', uc: C.clay, pallu: C.mustard, belt: C.umber, buckle: false } }),
    dasharatha: () => ({ label: 'Dasharatha', skin: C.sWheat, neck: 3, head: { gear: 'mukut', hair: 'long', haircol: C.ash, must: 1, mustcol: C.ash, beard: 'short', beardcol: C.ash, old: 1, tilak: 'urdhva', earring: 'big' }, cloth: { upper: 'tunic', uc: C.crimson, upat: P('flower', C.crimson, C.gold, 0.8), sleeve: C.crimson, lc: C.cream, lpat: P('stripes', C.cream, C.gold, 0.8), belt: C.gold } }),
    kausalya: () => ({ label: 'Kousalya', fem: 1, skin: C.sWheat, neck: 3, head: { hair: 'bun', gear: 'veil', veil: C.cream, vborder: C.red, tilak: 'dot', earring: 'big', old: 1 }, cloth: { lower: 'sari', lc: C.cream, lpat: P('dots', C.cream, C.red, 0.8), hem: C.red, upper: 'blouse', uc: C.red, pallu: C.cream, pborder: C.red, belt: C.gold } }),
    kaikeyi: () => ({ label: 'Kaikeyi', fem: 1, skin: C.sFair, neck: 3, head: { hair: 'bun', gear: 'veil', veil: C.magenta, tilak: 'dot', earring: 'big', nosering: 1, lip: C.red }, cloth: { lower: 'sari', lc: C.magenta, lpat: P('rings', C.magenta, C.gold, 0.7), hem: C.gold, upper: 'blouse', uc: C.plum, pallu: C.pink, ppat: P('plus', C.pink, C.plum, 0.7), belt: C.gold } }),
    sumitra: () => ({ label: 'Sumitra', fem: 1, skin: C.sTan, neck: 3, head: { hair: 'bun', gear: 'veil', veil: C.green, tilak: 'dot', earring: 'big' }, cloth: { lower: 'sari', lc: C.green, lpat: P('plus', C.green, C.lime, 0.7), hem: C.gold, upper: 'blouse', uc: C.mustard, pallu: C.leaf, belt: C.gold } }),
    manthara: () => ({ label: 'Manthara', fem: 1, skin: C.sBrown, neck: 1, build: { shY: -74 }, head: { hair: 'bun', haircol: C.ash, old: 1, eye: 'angry', earring: 'big', mouth: 'smile' }, cloth: { lower: 'sari', lc: C.olive, lpat: P('check', C.olive, C.moss, 0.6), hem: C.umber, upper: 'blouse', uc: C.umber, pallu: C.olive, belt: C.umber, buckle: false } }),
    vishvamitra: () => ({ label: 'Vishvamitra', skin: C.sTan, neck: 0, armlet: false, bangle: false, head: { hair: 'jata', haircol: C.slate, beard: 'long', beardcol: C.slate, must: 1, mustcol: C.slate, tilak: 'tri', old: 1, earring: false }, cloth: { upper: 'robe1', uc: C.saffron, lower: 'robe', lc: C.saffron, mala: 1, belt: false } }),
    vasishtha: () => ({ label: 'Vasishtha', skin: C.sFair, neck: 0, armlet: false, bangle: false, head: { hair: 'jata', haircol: C.white, beard: 'long', beardcol: C.white, must: 1, mustcol: C.white, tilak: 'tri', old: 1, earring: false }, cloth: { upper: 'robe1', uc: C.orange, lower: 'robe', lc: C.orange, mala: 1, belt: false } }),
    sage: () => ({ skin: C.sTan, neck: 0, armlet: false, bangle: false, head: { hair: 'jata', haircol: C.umber, beard: 'long', must: 1, tilak: 'tri', earring: false }, cloth: { upper: 'robe1', uc: C.orange, lower: 'robe', lc: C.orange, mala: 1, belt: false } }),
    sageBald: () => ({ skin: C.sTan, neck: 0, armlet: false, bangle: false, head: { hair: 'tuft', tilak: 'tri', old: 1, earring: false }, cloth: { upper: 'robe1', uc: C.saffron, lower: 'robe', lc: C.saffron, mala: 1, belt: false } }),
    valmiki: () => ({ label: 'Valmiki', skin: C.sBrown, neck: 0, armlet: false, bangle: false, head: { hair: 'jata', haircol: C.ash, beard: 'long', beardcol: C.ash, must: 1, mustcol: C.ash, tilak: 'tri', old: 1, earring: false }, cloth: { upper: 'robe1', uc: C.clay, upat: P('bark', C.clay, C.umber, 0.8), lower: 'robe', lc: C.clay, lpat: P('bark', C.clay, C.umber, 0.8), mala: 1, belt: false } }),
    narada: () => ({ label: 'Narada', skin: C.sFair, neck: 1, head: { hair: 'knot', tilak: 'urdhva' }, cloth: { lc: C.cream, lpat: P('stripes', C.cream, C.saffron, 0.8), sash: C.saffron, belt: C.saffron, garland: C.vermilion } }),
    agastya: () => ({ label: 'Agastya', skin: C.sBrown, build: { th: 50, shn: 50, up: 42, fo: 40 }, neck: 0, armlet: false, bangle: false, head: { hair: 'jata', haircol: C.ash, beard: 'long', beardcol: C.ash, must: 1, mustcol: C.ash, tilak: 'tri', old: 1, earring: false }, cloth: { upper: 'robe1', uc: C.saffron, lower: 'robe', lc: C.saffron, mala: 1, belt: false } }),
    janaka: () => ({ label: 'Janaka', skin: C.sTan, neck: 3, head: { gear: 'mukut', hair: 'long', must: 1, beard: 'short', tilak: 'urdhva', earring: 'big' }, cloth: { upper: 'tunic', uc: C.teal, upat: P('rings', C.teal, C.gold, 0.7), sleeve: C.teal, lc: C.cream, lpat: P('dots', C.cream, C.teal, 0.8), belt: C.gold } }),
    parashurama: () => ({ label: 'Parashurama', skin: C.sRed, neck: 0, armlet: false, head: { hair: 'jata', haircol: C.umber, beard: 'short', must: 1, tilak: 'tri', eye: 'angry', earring: false }, cloth: { lc: C.umber, lpat: P('fur', C.clay, C.umber, 1), sash: C.umber, belt: C.umber, buckle: false, mala: 1, thread: 1 } }),
    sumantra: () => ({ label: 'Sumantra', skin: C.sTan, neck: 1, head: { gear: 'turban', tcol: C.cream, tcol2: C.red, must: 1, old: 1 }, cloth: { upper: 'tunic', uc: C.teal, sleeve: C.teal, lc: C.cream, belt: C.red } }),
    guha: () => ({ label: 'Guha', skin: C.sDark, neck: 1, head: { hair: 'knot', gear: 'band', tcol: C.red, must: 1 }, cloth: { lower: 'short', lc: C.leaf, lpat: P('leafs', C.forest, C.lime, 0.6), belt: C.red, buckle: false, mala: 1 } }),
    man: (c1 = C.mustard, t1 = C.saffron, sk = C.sTan) => ({ skin: sk, neck: 1, head: { gear: 'turban', tcol: t1, tcol2: R.light(t1, 0.5), must: 1 }, cloth: { upper: 'tunic', uc: c1, upat: P('swirl', c1, R.light(c1, 0.35), 0.6), sleeve: c1, lc: C.cream, belt: C.red, buckle: false } }),
    woman: (c1 = C.pink, c2 = C.red, sk = C.sTan) => ({ fem: 1, skin: sk, neck: 2, head: { hair: 'bun', gear: 'veil', veil: c1, vborder: c2, tilak: 'dot', nosering: 1, earring: 'big' }, cloth: { lower: 'sari', lc: c1, lpat: P('dots', c1, c2, 0.8), hem: c2, upper: 'blouse', uc: c2, pallu: c1, pborder: c2, belt: c2, buckle: false } }),
    girl: (c1 = C.orange, c2 = C.green, sk = C.sBrown) => ({ fem: 1, skin: sk, neck: 2, head: { hair: 'braid', tilak: 'dot', nosering: 1, earring: 'big' }, cloth: { lower: 'sari', lc: c2, lpat: P('plus', c2, R.light(c2, 0.5), 0.7), hem: C.gold, upper: 'blouse', uc: c1, pallu: c1, belt: C.gold, buckle: false } }),
    guard: (sk = C.sBrown) => ({ skin: sk, neck: 1, head: { gear: 'turban', tcol: C.orange, tcol2: C.red, must: 1, beard: 'short' }, cloth: { lc: C.green, lpat: P('stripes', C.green, C.forest, 0.8), sash: C.orange, belt: C.gold } }),
    soldier: (c1 = C.crimson) => ({ skin: C.sTan, neck: 0, head: { gear: 'turban', tcol: c1, tcol2: C.gold, must: 1, tknot: false }, cloth: { upper: 'armor', uc: c1, upat: P('scale', c1, C.gold, 0.6), sleeve: c1, lc: C.cream, belt: C.gold } }),
    // Lanka
    ravana: () => ({ label: 'Ravana', skin: C.sRak, neck: 3, build: { sh: 27 }, head: { gear: 'crown', hair: 'long', must: 1, eye: 'angry', earring: 'big', sclera: C.straw, tilak: 'tri' }, cloth: { upper: 'armor', uc: C.crimson, upat: P('scale', C.crimson, C.gold, 0.7), lc: C.plum, lpat: P('rings', C.plum, C.gold, 0.7), sash: C.gold, belt: C.gold }, cape: C.maroon }),
    ravanaMonk: () => ({ label: 'Ravana, as a wandering ascetic', skin: C.sRak, neck: 0, armlet: false, bangle: false, head: { hair: 'knot', must: 1, beard: 'short', eye: 'angry', tilak: 'tri', earring: false }, cloth: { upper: 'robe1', uc: C.saffron, lower: 'robe', lc: C.saffron, belt: false, mala: 1 } }),
    rakshasa: (sk = C.sGreen, c1 = C.crimson) => ({ skin: sk, neck: 1, head: { hair: 'wild', horns: 1, eye: 'angry', mouth: 'fang', must: 1, sclera: C.straw, earring: 'big' }, cloth: { lower: 'short', lc: c1, lpat: P('zig', c1, C.gold, 0.8), belt: C.gold, sash: C.umber } }),
    rakshasi: (sk = C.sPurple, c1 = C.olive) => ({ fem: 1, skin: sk, neck: 1, head: { hair: 'wild', eye: 'angry', mouth: 'fang', sclera: C.straw, earring: 'big', horns: 0 }, cloth: { lower: 'sari', lc: c1, lpat: P('zig', c1, C.ink, 0.8), hem: C.ink, upper: 'blouse', uc: C.maroon, belt: C.umber, buckle: false } }),
    shurpanakha: () => ({ label: 'Shurpanakha', fem: 1, skin: C.sGreen, neck: 2, build: { sh: 26 }, head: { hair: 'wild', haircol: C.clay, eye: 'wide', mouth: 'fang', sclera: C.straw, earring: 'big', nosering: 1 }, cloth: { lower: 'sari', lc: C.plum, lpat: P('bigdots', C.plum, C.magenta, 0.7), hem: C.gold, upper: 'blouse', uc: C.magenta, belt: C.gold, pallu: C.magenta } }),
    tataka: () => ({ label: 'Tataka', fem: 1, skin: C.sPurple, neck: 1, build: { sh: 28 }, head: { hair: 'wild', horns: 1, eye: 'angry', mouth: 'open', fang: 1, sclera: C.straw, earring: 'big' }, cloth: { lower: 'sari', lc: C.maroon, lpat: P('zig', C.maroon, C.ink, 1), hem: C.ink, upper: 'blouse', uc: C.ink, belt: C.bone, mala: 1 } }),
    maricha: () => ({ label: 'Maricha', skin: C.sGreen, neck: 1, head: { hair: 'wild', horns: 1, eye: 'wide', mouth: 'fang', sclera: C.straw, must: 1 }, cloth: { lower: 'short', lc: C.umber, belt: C.bone, sash: C.clay } }),
    marichaMonk: () => ({ label: 'Maricha, turned ascetic', skin: C.sGreen, neck: 0, armlet: false, bangle: false, head: { hair: 'jata', horns: 1, eye: 'fear', sclera: C.straw, must: 1, earring: false }, cloth: { upper: 'robe1', uc: C.clay, upat: P('bark', C.clay, C.umber, 0.8), lower: 'robe', lc: C.clay, lpat: P('bark', C.clay, C.umber, 0.8), belt: false, mala: 1 } }),
    khara: () => ({ label: 'Khara', skin: C.sRed, neck: 2, head: { gear: 'crown', hair: 'wild', must: 1, eye: 'angry', mouth: 'fang', sclera: C.straw }, cloth: { upper: 'armor', uc: C.ink, upat: P('scale', C.ink, C.gold, 0.7), lc: C.maroon, belt: C.gold } }),
    vibhishana: () => ({ label: 'Vibhishana', skin: C.sRak, neck: 2, head: { gear: 'crown', hair: 'long', must: 1, tilak: 'urdhva', earring: 'big' }, cloth: { lc: C.cream, lpat: P('dots', C.cream, C.teal, 0.8), sash: C.teal, belt: C.gold } }),
    indrajit: () => ({ label: 'Indrajit', skin: C.sRak, neck: 2, head: { gear: 'crown', gem: C.aqua, hair: 'long', eye: 'angry', must: 1, sclera: C.straw }, cloth: { upper: 'armor', uc: C.ink, upat: P('scale', C.ink, C.aqua, 0.7), lc: C.violet, belt: C.gold } }),
    kumbhakarna: () => ({ label: 'Kumbhakarna', skin: C.sRak, neck: 2, build: { sh: 34 }, head: { gear: 'crown', hair: 'wild', must: 1, beard: 'short', eye: 'angry', mouth: 'open', fang: 1, sclera: C.straw, earring: 'big', horns: 1 }, cloth: { lc: C.maroon, lpat: P('bigdots', C.maroon, C.gold, 0.8), sash: C.gold, belt: C.gold } }),
    mandodari: () => ({ label: 'Mandodari', fem: 1, skin: C.sWheat, neck: 3, head: { hair: 'bun', gear: 'tiara', tilak: 'dot', earring: 'big', nosering: 1, lip: C.red }, cloth: { lower: 'sari', lc: C.teal, lpat: P('rings', C.teal, C.gold, 0.7), hem: C.gold, upper: 'blouse', uc: C.gold, pallu: C.aqua, belt: C.gold } }),
    trijata: () => ({ label: 'Trijata', fem: 1, skin: C.sPurple, neck: 1, head: { hair: 'bun', haircol: C.ash, old: 1, eye: 'soft', earring: 'big' }, cloth: { lower: 'sari', lc: C.slate, lpat: P('dots', C.slate, C.ash, 0.8), hem: C.ash, upper: 'blouse', uc: C.ink, pallu: C.slate, belt: C.umber, buckle: false } }),
    // vanaras and others
    hanuman: () => ({ label: 'Hanuman', kind: 'monkey', fur: C.orange, chest: C.peach, tail: true, neck: 1, head: { gear: 'band', facecol: C.rose, earring: true }, cloth: { lower: 'short', lc: C.red, lpat: P('dots', C.red, C.gold, 0.8), belt: C.gold }, bangle: true }),
    hanumanMonk: () => ({ label: 'Hanuman, in a mendicant’s guise', skin: C.sWheat, neck: 0, armlet: false, bangle: false, head: { hair: 'knot', tilak: 'tri', earring: false }, cloth: { upper: 'robe1', uc: C.saffron, lower: 'robe', lc: C.saffron, belt: false, mala: 1, thread: 1 } }),
    sugriva: () => ({ label: 'Sugriva', kind: 'monkey', fur: C.ochre, chest: C.straw, tail: true, neck: 2, head: { gear: 'crown', facecol: C.rose }, cloth: { lower: 'short', lc: C.teal, lpat: P('dots', C.teal, C.gold, 0.8), belt: C.gold }, bangle: true }),
    vali: () => ({ label: 'Vali', kind: 'monkey', fur: C.amber, chest: C.straw, tail: true, neck: 3, build: { sh: 26 }, head: { gear: 'mukut', facecol: C.rose, eye: 'angry' }, cloth: { lower: 'short', lc: C.crimson, lpat: P('rings', C.crimson, C.gold, 0.7), belt: C.gold, garland: C.gold }, bangle: true }),
    angada: () => ({ label: 'Angada', kind: 'monkey', fur: C.saffron, chest: C.straw, tail: true, neck: 2, head: { gear: 'band', facecol: C.rose }, cloth: { lower: 'short', lc: C.green, belt: C.gold }, bangle: true }),
    vanara: (fur = C.brown) => ({ kind: 'monkey', fur, chest: R.light(fur, 0.35), tail: true, neck: 0, bangle: false, head: { earring: false }, cloth: { lower: 'none' } }),
    tara: () => ({ label: 'Tara', kind: 'monkey', fem: 1, fur: C.sand, tail: false, neck: 2, head: { gear: 'band', facecol: C.rose }, cloth: { lower: 'sari', lc: C.teal, lpat: P('dots', C.teal, C.gold, 0.8), hem: C.gold, upper: 'blouse', uc: C.pink, belt: C.gold }, bangle: true }),
    jambavan: () => ({ label: 'Jambavan', kind: 'bear', fur: C.umber, neck: 1, bangle: false, head: { gear: 'band' }, cloth: { lower: 'short', lc: C.ochre, belt: C.gold } }),
    // gods
    brahma: () => ({ label: 'Brahma', skin: C.sFair, neck: 3, head: { gear: 'mukut', hair: 'long', haircol: C.white, beard: 'long', beardcol: C.white, must: 1, mustcol: C.white, halo: 52 }, cloth: { lc: C.red, sash: C.gold, belt: C.gold } }),
    indra: () => ({ label: 'Indra', skin: C.sWheat, neck: 3, head: { gear: 'mukut', hair: 'long', must: 1, halo: 50 }, cloth: { lc: C.green, lpat: P('rings', C.green, C.gold, 0.7), sash: C.gold, belt: C.gold } }),
    agni: () => ({ label: 'Agni', skin: C.sRed, neck: 3, head: { gear: 'mukut', hair: 'long', haircol: C.vermilion, must: 1, mustcol: C.vermilion, halo: 54 }, cloth: { lc: C.saffron, sash: C.gold, belt: C.gold } }),
    shiva: () => ({ label: 'Shiva', skin: C.ice, neck: 0, armlet: false, head: { hair: 'jata', haircol: C.umber, tilak: 'tri', earring: 'big' }, cloth: { lower: 'short', lc: C.ochre, lpat: P('bigdots', C.ochre, C.umber, 0.6), belt: C.umber, buckle: false, mala: 1 } }),
    matali: () => ({ label: 'Matali', skin: C.sWheat, neck: 2, head: { gear: 'crown', hair: 'long', must: 1 }, cloth: { lc: C.green, sash: C.gold, belt: C.gold } }),
    hunter: () => ({ label: 'The Nishada hunter', skin: C.sDark, neck: 0, armlet: false, bangle: false, head: { hair: 'knot', must: 1, earring: false }, cloth: { lower: 'short', lc: C.moss, lpat: P('leafs', C.moss, C.lime, 0.6), belt: C.umber, buckle: false } }),
  });
  function merge(a, b) { const o = Object.assign({}, a, b); ['head', 'cloth', 'build', 'hold'].forEach((k) => { if (a[k] || b[k]) o[k] = Object.assign({}, a[k] || {}, b[k] || {}); }); return o; }
  R.F = function (name, o = {}, ...args) { const base = CAST[name](...(o.args || args)); return R.fig(merge(base, o)); };
  // place a cast member on a layer and register a guide note above the head
  R.put = function (P, layer, name, o = {}, text) {
    const base = CAST[name](...(o.args || []));
    P[layer](R.fig(merge(base, o)));
    const lab = o.label || base.label;
    if (lab && o.note !== false) { const s = o.s || 1; const up = o.rot ? 150 : 250; P.note((o.x || 0) + (o.nx || 0), (o.y || 0) - s * up + (o.ny || 0), lab, text || '', layer); }
    return P;
  };
  // a crowd row of townsfolk / soldiers / vanaras / rakshasas
  R.crowd = function (o) {
    const f = R.rng(o.seed || 11), nn = o.n || 12; let s = ''; const cols = o.cols || [C.mustard, C.orange, C.teal, C.pink, C.green, C.azure, C.red, C.magenta], sks = [C.sTan, C.sBrown, C.sWheat, C.sDark, C.sFair];
    const order = Array.from({ length: nn }, (_, i) => i);
    order.forEach((i) => {
      const t = nn === 1 ? 0.5 : i / (nn - 1), x = o.x0 + (o.x1 - o.x0) * t + f.r(-1, 1) * (o.jx || 8), y = o.y + f.r(-1, 1) * (o.jy || 6) + (o.arc ? Math.sin(t * Math.PI) * -o.arc : 0);
      const kind = f.pick(o.kinds || ['man', 'woman', 'man', 'girl']), pose = typeof o.pose === 'function' ? o.pose(i, f) : f.pick(o.poses || ['namaste']);
      const face = o.face != null ? (typeof o.face === 'function' ? o.face(x, i) : o.face) : x < (o.cx != null ? o.cx : 800) ? 1 : -1;
      let args = [];
      if (kind === 'man') args = [f.pick(cols), f.pick([C.saffron, C.red, C.cream, C.orange, C.magenta, C.teal]), f.pick(sks)];
      else if (kind === 'woman' || kind === 'girl') { const c1 = f.pick(cols); args = [c1, f.pick(cols.filter((c) => c !== c1)), f.pick(sks)]; }
      else if (kind === 'vanara') args = [f.pick([C.brown, C.clay, C.ochre, C.umber, C.tan, C.amber])];
      else if (kind === 'rakshasa') args = [f.pick([C.sGreen, C.sRak, C.sPurple, C.sRed, C.slate]), f.pick([C.crimson, C.plum, C.ink, C.olive])];
      else if (kind === 'rakshasi') args = [f.pick([C.sGreen, C.sRak, C.sPurple, C.sRed]), f.pick([C.olive, C.plum, C.maroon, C.slate])];
      else if (kind === 'soldier') args = [f.pick(o.cols || [C.crimson, C.teal, C.mustard])];
      else if (kind === 'guard') args = [f.pick(sks)];
      const extra = typeof o.each === 'function' ? o.each(i, f, kind) || {} : o.each || {};
      const hd = Object.assign({}, o.eye ? { eye: o.eye } : {}, extra.head || {});
      s += R.F(kind, Object.assign({ x, y, s: (o.s || 0.5) * f.r(0.94, 1.06), face, pose, args }, extra, { head: hd }));
    });
    return s;
  };
})();
