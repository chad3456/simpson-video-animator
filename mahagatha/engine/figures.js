/* Pichwai / miniature-painting figures for the Mahagatha film.
   Every figure is drawn in profile (facing right; the renderer mirrors for left) the way Rajasthani and Nathdwara
   painters draw them: a long straight nose, a large fish-shaped eye seen from the front, fine dark outlines,
   flat colour, gold ornament and dotted textiles. Origin is at the feet; an adult stands about 420 units tall.
   Exports window.PWFig = { figure, CAST, POSES, head, creature }. */
(function () {
  const f1 = v => Math.round(v * 10) / 10;
  const lerp = (a, b, p) => a + (b - a) * p;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const LINE = '#2a160c';
  const GOLD = '#e0a92a', GOLD_HI = '#f7d566', GOLD_LO = '#a8741a', PEARL = '#fbf4e2', RUBY = '#c8263a', EMERALD = '#2e8a57';
  const pt = (x, y) => `${f1(x)},${f1(y)}`;
  const poly = pts => 'M' + pts.map(p => pt(p[0], p[1])).join('L') + 'Z';
  // a smooth closed path through points (Catmull-Rom -> cubic Bezier)
  function smooth(pts, closed = true, k = 0.5) {
    const n = pts.length; if (n < 3) return poly(pts);
    const P = i => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    let d = 'M' + pt(...P(0));
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c1 = [p1[0] + (p2[0] - p0[0]) * k / 3, p1[1] + (p2[1] - p0[1]) * k / 3];
      const c2 = [p2[0] - (p3[0] - p1[0]) * k / 3, p2[1] - (p3[1] - p1[1]) * k / 3];
      d += 'C' + pt(...c1) + ' ' + pt(...c2) + ' ' + pt(...p2);
    }
    return d + (closed ? 'Z' : '');
  }
  const path = (d, fill, o = {}) => `<path d="${d}" fill="${fill}"${o.stroke !== false ? ` stroke="${o.stroke || LINE}" stroke-width="${o.sw || 1.6}" stroke-linejoin="round" stroke-linecap="round"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}${o.extra || ''}/>`;
  const circ = (x, y, r, fill, o = {}) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1}"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
  const line = (pts, col = LINE, w = 1.6, o = {}) => `<path d="M${pts.map(p => pt(p[0], p[1])).join('L')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${o.op != null ? ` opacity="${o.op}"` : ''}${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
  const curve = (d, col = LINE, w = 1.6, o = {}) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${o.op != null ? ` opacity="${o.op}"` : ''}${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
  function shade(hex, amt) {   // amt -1..1 darker/lighter
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    r = Math.round(r + (t - r) * p); g = Math.round(g + (t - g) * p); b = Math.round(b + (t - b) * p);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  // dotted textile: scatter small motifs inside a clip path
  let CLIPN = 0;
  function textile(d, base, motif, seed = 1, o = {}) {
    const id = 'tx' + (CLIPN++);
    const b = o.bbox || [-120, -420, 240, 440];
    let dots = '';
    const step = o.step || 13;
    let row = 0;
    for (let y = b[1]; y < b[1] + b[3]; y += step, row++) {
      for (let x = b[0] + (row % 2) * step / 2; x < b[0] + b[2]; x += step) {
        if (motif === 'dot') dots += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${o.r || 1.3}" fill="${o.mc || PEARL}"/>`;
        else if (motif === 'flower') dots += `<g transform="translate(${f1(x)} ${f1(y)})" fill="${o.mc || PEARL}"><circle r="1.1"/><circle cx="2.6" r="1"/><circle cx="-2.6" r="1"/><circle cy="2.6" r="1"/><circle cy="-2.6" r="1"/></g>`;
        else if (motif === 'star') dots += `<path transform="translate(${f1(x)} ${f1(y)})" d="M0,-3L0.8,-0.8L3,0L0.8,0.8L0,3L-0.8,0.8L-3,0L-0.8,-0.8Z" fill="${o.mc || PEARL}"/>`;
        else if (motif === 'stripe') { if ((Math.round(x / step)) % 2 === 0) dots += `<rect x="${f1(x)}" y="${f1(y)}" width="${step / 2.4}" height="${step}" fill="${o.mc || PEARL}" opacity="0.55"/>`; }
      }
    }
    return `<clipPath id="${id}"><path d="${d}"/></clipPath>${path(d, base, o)}<g clip-path="url(#${id})" opacity="${o.mo || 0.85}">${dots}</g>${path(d, 'none', o)}`;
  }

  // ---------------------------------------------------------------- HEAD ----
  // Head box: about 100 units from crown to chin, facing +x. (0,0) is the middle of the skull.
  function head(o, st) {
    const skin = o.skin, sk2 = shade(skin, -0.18);
    const LC = o.lineCol || LINE;
    const pth = (d, f, oo = {}) => path(d, f, Object.assign({ stroke: LC }, oo));
    const open = clamp(st.open || 0) * (o.female ? 4.2 : 5.2);
    const blink = clamp(st.blink || 0);
    const emo = st.emo || 'neutral';
    let s = '';
    const F = o.female;
    // --- face silhouette (forehead -> nose -> lips -> chin -> jaw -> nape)
    const nose = o.nose || (F ? 0.86 : 1);
    const nx = 34 + 16 * nose, ny = 14 + 3 * nose;
    const face = [
      'M8,-41',
      `C24,-39 32,-29 34,-17`,
      `C35,-11 36,-7 37,-5`,
      `L${f1(nx)},${f1(ny)}`,
      `C${f1(nx + 2)},${f1(ny + 3)} ${f1(nx - 1)},${f1(ny + 6)} ${f1(nx - 6)},${f1(ny + 5.5)}`,
      `C43,22 45,23 45,25`, `C45,26.5 43,27 41,27.2`,
      `L40,${f1(27.6 + open)}`,
      `C43,${f1(28 + open)} 45,${f1(30 + open)} 43,${f1(32.5 + open)}`,
      `C41,${f1(34 + open)} 40,${f1(35 + open)} 41,${f1(38 + open)}`,
      `C42,${f1(43 + open)} 39,${f1(48 + open)} ${F ? 31 : 30},${f1(49 + open)}`,
      `C20,${f1(50 + open * 0.6)} 10,46 2,38`,
      'C-6,30 -12,26 -18,22',
      'C-36,14 -44,-6 -40,-24', 'C-34,-44 -12,-52 8,-41Z'
    ].join(' ');
    s += pth(face, skin, { sw: 1.5 });
    s += hairCap(o);
    // cheek blush
    if (F || o.blush) s += `<ellipse cx="22" cy="18" rx="10" ry="6" fill="${o.blushCol || '#e46a6a'}" opacity="0.16"/>`;
    // mouth: open gap
    if (open > 0.5) s += pth(`M41,27.2 C42.5,${f1(28 + open * 0.4)} 42.5,${f1(28 + open * 0.8)} 40,${f1(27.6 + open)} C39,${f1(27.6 + open * 0.6)} 39,27.6 41,27.2Z`, '#5a1414', { sw: 0.8 });
    const lipCol = o.lips || (F ? '#c23a3a' : shade(skin, -0.32));
    s += pth(`M45,25 C44,26.8 42,27.4 39.5,27.3 C41,25.8 42.5,24.4 45,25Z`, lipCol, { sw: 0.8 });
    s += pth(`M40,${f1(27.8 + open)} C43,${f1(28 + open)} 44.5,${f1(30 + open)} 43,${f1(32 + open)} C41.5,${f1(31 + open)} 40,${f1(29.6 + open)} 40,${f1(27.8 + open)}Z`, lipCol, { sw: 0.8 });
    // smile / frown crease
    if (emo === 'smile' || emo === 'joy' || emo === 'sly') s += curve(`M37,26 C36,28.5 37,30 38.6,30.4`, LC, 1.1, { op: 0.8 });
    if (emo === 'angry' || emo === 'rage' || emo === 'sad' || emo === 'fear') s += curve(`M38,29 C36.5,28 35.8,28.5 35.4,29.6`, LC, 1.1, { op: 0.7 });
    // nostril
    s += curve(`M${f1(nx - 9)},${f1(ny + 2)} C${f1(nx - 7)},${f1(ny + 4.5)} ${f1(nx - 4)},${f1(ny + 4.6)} ${f1(nx - 3)},${f1(ny + 3.4)}`, LC, 1.1);
    // jaw shadow line
    s += curve('M30,49 C22,52 12,48 4,40', sk2, 1.2, { op: 0.5 });
    // --- eye: the fish-shaped frontal eye of miniatures
    const ex = 20, ey = -3;
    let lidUp = 0, browIn = 0, browUp = 0, pupilX = 25.5, pupilY = -3;
    if (emo === 'angry' || emo === 'rage') { browIn = 4; lidUp = 1.5; }
    if (emo === 'fear') { browUp = 3; lidUp = -1.5; }
    if (emo === 'sad') { browUp = 2; browIn = -2; }
    if (emo === 'calm' || emo === 'serene') { lidUp = 2.6; pupilY = -2; }
    if (emo === 'sly') { lidUp = 2.2; pupilX = 27; }
    if (st.look === 'down') { pupilY = -1; lidUp += 1.2; }
    if (st.look === 'up') { pupilY = -5; }
    const eh = (8.6 - lidUp) * (1 - blink * 0.95);
    if (o.eyesClosed || blink > 0.9 || emo === 'meditate') {
      s += curve(`M${ex - 15},${ey - 1} C${ex - 6},${ey + 4} ${ex + 6},${ey + 4} ${ex + 13},${ey + 1}`, LC, 2);
      s += curve(`M${ex + 12},${ey + 1} L${ex + 15},${ey}`, LC, 1.2);
    } else {
      const top = ey - eh * 0.62, bot = ey + eh * 0.38;
      const eyeD = `M${ex - 15},${ey - 1} C${ex - 8},${f1(top)} ${ex + 6},${f1(top - 0.5)} ${ex + 13},${ey + 1} C${ex + 6},${f1(bot + 2)} ${ex - 6},${f1(bot + 1.5)} ${ex - 15},${ey - 1}Z`;
      s += pth(eyeD, o.eyeWhite || '#fbf6ea', { sw: 0.9 });
      const id = 'ec' + (CLIPN++);
      s += `<clipPath id="${id}"><path d="${eyeD}"/></clipPath><g clip-path="url(#${id})"><circle cx="${f1(pupilX)}" cy="${f1(pupilY)}" r="4.2" fill="${o.iris || '#1a0f0a'}"/><circle cx="${f1(pupilX + 1.2)}" cy="${f1(pupilY - 1.4)}" r="1.1" fill="#fff" opacity="0.85"/></g>`;
      // upper lid: thick kohl line with a long tail to the temple
      s += curve(`M${ex - 15},${ey - 1} C${ex - 8},${f1(top)} ${ex + 6},${f1(top - 0.5)} ${ex + 13},${ey + 1}`, LC, 2.4);
      s += curve(`M${ex - 15},${ey - 1} L${ex - 21},${ey - 4}`, LC, 1.6);
      s += curve(`M${ex - 14},${ey} C${ex - 6},${f1(bot + 2.2)} ${ex + 5},${f1(bot + 2.2)} ${ex + 12},${ey + 1.4}`, LC, 0.9, { op: 0.8 });
    }
    // eyebrow: a long thin bow
    const b0 = [ex - 13, ey - 11 - browUp], b1 = [ex + 1, ey - 16 - browUp * 1.3 + browIn * 0.3], b2 = [ex + 14, ey - 11 + browIn];
    s += curve(`M${pt(...b0)} Q${pt(...b1)} ${pt(...b2)}`, o.browCol || LC, 2.2);
    // Gandhari's blindfold: a cloth band tied across both eyes
    if (o.blindfold) s += pth('M-10,-14 C8,-17 30,-17 47,-12 L46,4 C30,0 8,0 -10,2Z', o.blindfold === true ? '#f4efe2' : o.blindfold, { sw: 1.2 }) + curve('M-10,-6 C-18,-2 -22,8 -20,18 M-10,-2 C-16,4 -16,14 -12,22', o.blindfold === true ? '#e2d8c0' : o.blindfold, 3);
    // ear + earring
    if (!o.veilEar) s += pth('M-6,0 C-1,-4 3,2 1,9 C-1,15 -4,17 -7,14 C-4,10 -6,5 -6,0Z', shade(skin, -0.05), { sw: 1.2 });
    if (o.earring !== false) {
      if (o.earring === 'makara' || (!F && o.earring == null)) s += `<g transform="translate(-4 22)">${circ(0, 0, 6.5, GOLD, { stroke: GOLD_LO, sw: 1 })}${circ(0, 0, 3.2, RUBY)}${circ(0, 8.5, 2.4, PEARL)}</g>`;
      else s += `<g transform="translate(-4 20)">${circ(0, 0, 3.5, GOLD, { stroke: GOLD_LO, sw: 0.8 })}${circ(0, 6, 2.6, PEARL)}${circ(-3, 10, 1.8, PEARL)}${circ(3, 10, 1.8, PEARL)}</g>`;
    }
    // marks on the forehead
    if (o.tilak === 'vaishnav') s += `<path d="M27,-33 L29,-18 M33,-33 L31.5,-18" stroke="#fdf7e8" stroke-width="2" fill="none"/><path d="M30,-31 L30.5,-17" stroke="${RUBY}" stroke-width="2"/>`;
    if (o.tilak === 'tripundra') s += `<path d="M14,-28 L33,-28 M13,-23.5 L34,-23.5 M14,-19 L34.5,-19" stroke="#fdf7e8" stroke-width="2" fill="none"/>`;
    if (o.tilak === 'bindi') s += circ(33.6, -12, 2.3, RUBY);
    if (o.thirdEye) s += `<path d="M29,-33 C27,-29 27,-25 29.5,-21 C31.5,-25 31.5,-29 29,-33Z" fill="${RUBY}" stroke="${LC}" stroke-width="0.8"/>`;
    if (o.noseRing) s += `<circle cx="${f1(nx - 6)}" cy="${f1(ny + 8)}" r="6" fill="none" stroke="${GOLD}" stroke-width="1.6"/>${circ(nx - 6, ny + 14, 1.8, PEARL)}${circ(nx - 1, ny + 12, 1.4, RUBY)}`;
    // mustache and beard
    if (o.mustache) s += pth(`M44,22.5 C38,22 31,22 25,27 C22,29 19,28 18,25 C21,28 24,26 27,22 C32,19 40,19 45,21Z`, o.beardCol || LC, { sw: 0.8 });
    if (o.beard) {
      const bc = o.beardCol || LC;
      const len = o.beard === 'long' ? 40 : 18;
      s += pth(`M2,36 C8,46 18,${f1(52 + open)} 30,${f1(52 + open)} C36,${f1(51 + open)} 40,${f1(44 + open)} 41,${f1(39 + open)} C43,${f1(48 + len * 0.5)} 38,${f1(56 + len)} 22,${f1(58 + len)} C14,${f1(52 + len * 0.6)} 0,${f1(44 + len * 0.3)} 2,36Z`, bc, { sw: 1 });
      for (let i = 0; i < 5; i++) s += curve(`M${12 + i * 5},${f1(48 + i)} C${14 + i * 5},${f1(56 + len * 0.5)} ${16 + i * 4},${f1(58 + len * 0.8)} ${18 + i * 3},${f1(58 + len * 0.9)}`, shade(bc, bc === LC ? 0.25 : -0.15), 0.9, { op: 0.7 });
    }
    if (o.tongue || st.tongue) s += `<path d="M35,${f1(29 + open)} C36,${f1(40 + open)} 38,${f1(50 + open)} 42,${f1(52 + open)} C46,${f1(50 + open)} 44,${f1(38 + open)} 42,${f1(29 + open)}Z" fill="#d0182a" stroke="${LC}" stroke-width="0.8"/>`;
    if (o.fangs) s += `<path d="M40,${f1(28 + open)} L38.5,${f1(33 + open)} L37.5,${f1(28.3 + open)}Z" fill="#fff" stroke="${LC}" stroke-width="0.6"/>`;
    return s;
  }

  // hair cap and crowns are drawn over the head; long locks behind the body
  function hairCap(o) {
    const hc = o.hair || '#140c0a';
    let s = '';
    if (o.crown === 'asura') {
      // wild flame hair (gold) with dark roots: the demons of the reference plates
      const fl = o.hair || '#f2c230';
      s += path('M8,-41 C-4,-60 -30,-62 -46,-48 C-62,-36 -70,-14 -64,8 C-80,0 -88,-20 -82,-40 C-74,-66 -40,-84 -8,-76 C16,-72 30,-58 30,-40 C22,-46 14,-46 8,-41Z', fl, { sw: 1.4 });
      for (let i = 0; i < 6; i++) s += curve(`M${f1(20 - i * 14)},${f1(-58 + i * 4)} C${f1(4 - i * 14)},${f1(-74 + i * 5)} ${f1(-14 - i * 12)},${f1(-70 + i * 9)} ${f1(-30 - i * 9)},${f1(-56 + i * 13)}`, '#fff2b0', 1.4, { op: 0.8 });
      if (o.horns) s += path('M-6,-50 C0,-74 14,-92 34,-98 C22,-86 14,-70 10,-50Z', '#efe3c4', { sw: 1.4 });
      return s;
    }
    // smooth black hair over the skull down to the nape
    s += path('M10,-40 C-4,-53 -32,-52 -43,-30 C-50,-12 -46,12 -32,26 C-26,31 -18,28 -15,22 C-17,14 -14,6 -10,2 C-12,-4 -8,-10 -2,-12 C2,-20 6,-30 10,-40Z', hc, { sw: 1.3 });
    s += curve('M2,-40 C-12,-44 -26,-40 -34,-28 M-6,-32 C-20,-30 -30,-20 -36,-6', shade(hc, 0.22), 1, { op: 0.7 });
    // a side-lock curl in front of the ear (Rajput)
    if (o.sideLock !== false && !o.female) s += curve('M4,-14 C10,-4 10,6 4,12 C1,15 4,19 8,17', hc, 2.6);
    if (o.female) s += path('M8,-41 C14,-36 16,-30 14,-24 C8,-30 2,-30 -4,-26Z', hc, { sw: 1 });
    return s;
  }

  function crown(o, t) {
    const c = o.crown;
    let s = '';
    if (c === 'kirit') {          // Vishnu's tall conical crown
      s += path('M-34,-36 C-32,-60 -26,-90 -12,-118 L-4,-130 L4,-118 C18,-92 24,-62 26,-38 C8,-44 -16,-44 -34,-36Z', GOLD, { sw: 1.6 });
      s += path('M-34,-36 C-16,-44 8,-44 26,-38 L26,-30 C8,-36 -16,-36 -34,-28Z', GOLD_LO, { sw: 1.2 });
      for (let i = 0; i < 6; i++) { const yy = -50 - i * 12, w = 28 - i * 4.5; s += curve(`M${f1(-w - 2)},${yy} C${f1(-w / 2)},${yy - 5} ${f1(w / 2)},${yy - 5} ${f1(w - 4)},${yy}`, GOLD_LO, 1.2); }
      s += circ(-4, -72, 6, RUBY, { stroke: GOLD_LO, sw: 1.2 }) + circ(-4, -96, 4, EMERALD, { stroke: GOLD_LO }) + circ(-4, -136, 5, PEARL, { stroke: GOLD_LO });
      for (let i = -3; i <= 3; i++) s += circ(-4 + i * 8.5, -33, 2.4, PEARL);
      // fan of jewelled side flaps (makara)
      s += path('M-34,-36 C-50,-44 -56,-60 -50,-74 C-44,-62 -38,-54 -30,-50Z', GOLD, { sw: 1.2 });
      s += path('M26,-38 C38,-46 42,-58 40,-70 C34,-60 30,-54 24,-50Z', GOLD, { sw: 1.2 });
    } else if (c === 'mukut' || c === 'krishna') {   // the crown of the reference court scenes: a coronet of spikes
      s += path('M-38,-34 C-20,-44 10,-44 30,-36 L34,-62 L24,-54 L16,-74 L6,-56 L-4,-80 L-12,-58 L-22,-74 L-28,-54 L-40,-60Z', GOLD, { sw: 1.5 });
      s += path('M-38,-34 C-20,-44 10,-44 30,-36 L30,-28 C10,-36 -20,-36 -38,-26Z', GOLD_LO, { sw: 1.1 });
      for (const [x, y] of [[34, -62], [16, -74], [-4, -80], [-22, -74], [-40, -60]]) s += circ(x, y, 3, PEARL, { stroke: LINE, sw: 0.6 });
      s += circ(-4, -46, 5, RUBY, { stroke: GOLD_LO });
      if (c === 'krishna') {     // peacock feather
        const sw = Math.sin((t || 0) * 1.3) * 3;
        s += `<g transform="rotate(${f1(-18 + sw)} -10 -60)"><path d="M-10,-60 C-14,-90 -20,-118 -34,-140" stroke="#3d6b3a" stroke-width="2.2" fill="none"/>`;
        for (let i = 0; i < 12; i++) s += curve(`M${f1(-12 - i * 1.8)},${f1(-70 - i * 6)} l-${8 + i % 3},-${4 + i % 2}`, '#2f8a5a', 1.4);
        s += `<ellipse cx="-36" cy="-146" rx="11" ry="15" fill="#1f7a63" stroke="${LINE}" stroke-width="1"/><ellipse cx="-36" cy="-145" rx="7" ry="10" fill="#d9a62e"/><ellipse cx="-36" cy="-144" rx="4.4" ry="6" fill="#1b3f9a"/><ellipse cx="-36" cy="-143" rx="2" ry="3" fill="#0c1430"/></g>`;
      }
    } else if (c === 'jata') {     // Shiva: piled matted locks, crescent moon, rudraksha
      const hc = o.hair || '#2a1a12';
      s += path('M-40,-28 C-48,-58 -30,-84 -6,-90 C14,-94 30,-80 26,-56 C24,-44 18,-38 10,-38 C-6,-44 -24,-40 -40,-28Z', hc, { sw: 1.4 });
      for (let i = 0; i < 5; i++) s += curve(`M${-34 + i * 12},-36 C${-40 + i * 12},-56 ${-30 + i * 11},-76 ${-14 + i * 8},-86`, shade(hc, 0.25), 1.6);
      s += path('M-34,-40 C-20,-46 0,-46 18,-42 L18,-37 C0,-41 -20,-41 -34,-35Z', '#8a5a2a', { sw: 0.8 });
      for (let i = 0; i < 7; i++) s += circ(-30 + i * 7.5, -40, 2.4, '#7a2a1a', { stroke: LINE, sw: 0.5 });
      s += path('M12,-82 C26,-80 32,-64 26,-52 C30,-62 26,-74 12,-82Z', '#fffbe8', { sw: 1.2 });   // crescent
      if (o.ganga) s += curve('M-6,-90 C-10,-104 -2,-112 6,-118', '#bfe7ff', 3, { op: 0.9 }) + circ(8, -120, 3.4, '#e9f8ff');
      if (o.snakeHood) s += path('M-22,-52 C-30,-64 -26,-74 -16,-74 C-8,-74 -6,-64 -12,-56Z', '#3d6b3a', { sw: 1 });
    } else if (c === 'brahma') {   // crown for the four-headed creator
      s += path('M-34,-36 C-30,-62 -16,-84 -4,-90 C10,-84 22,-62 26,-38 C8,-44 -16,-44 -34,-36Z', GOLD, { sw: 1.5 });
      for (let i = 0; i < 4; i++) s += curve(`M${-28 + i * 4},${-46 - i * 10} C${-12},${-52 - i * 10} ${6},${-52 - i * 10} ${20 - i * 4},${-46 - i * 10}`, GOLD_LO, 1.2);
      s += circ(-4, -94, 4.4, PEARL, { stroke: GOLD_LO }) + circ(-4, -58, 4.6, RUBY, { stroke: GOLD_LO });
    } else if (c === 'topknot' || c === 'rishi') {   // sages: a knot of hair on the crown
      const hc = o.hair || '#140c0a';
      s += path('M-28,-44 C-30,-66 -10,-74 2,-66 C10,-60 8,-48 0,-44 C-8,-48 -20,-48 -28,-44Z', hc, { sw: 1.3 });
      s += path('M-26,-52 C-14,-56 -4,-56 4,-52', 'none', { sw: 1.2 });
      if (o.flower) s += circ(4, -62, 4.6, '#f7f1de', { stroke: LINE, sw: 0.7 }) + circ(4, -62, 1.8, GOLD);
    } else if (c === 'veil' || c === 'devi') {      // women: a crown band and the odhni over the head
      if (c === 'devi') {
        s += path('M-30,-40 C-14,-48 6,-48 24,-40 L28,-60 L18,-54 L10,-72 L2,-56 L-6,-76 L-14,-58 L-22,-72 L-26,-54 L-34,-60Z', GOLD, { sw: 1.4 });
        for (const [x, y] of [[28, -60], [10, -72], [-6, -76], [-22, -72]]) s += circ(x, y, 2.6, PEARL, { stroke: LINE, sw: 0.5 });
        s += circ(-4, -48, 4.2, RUBY, { stroke: GOLD_LO });
      } else {
        s += path('M-28,-40 C-12,-46 6,-46 20,-40 L20,-36 C6,-41 -12,-41 -28,-35Z', GOLD, { sw: 1 });
        s += circ(16, -36, 3, RUBY) + `<path d="M16,-33 L18,-22" stroke="${GOLD}" stroke-width="1.4"/>` + circ(18.5, -20, 2.4, PEARL);
      }
    } else if (c === 'turban') {   // a Rajput pagri for kings and men
      const tc = o.turban || '#d9542a';
      s += path('M-40,-28 C-48,-50 -30,-66 -4,-66 C20,-66 34,-56 30,-36 C14,-42 -12,-40 -40,-28Z', tc, { sw: 1.4 });
      for (let i = 0; i < 4; i++) s += curve(`M${-40 + i * 2},${-32 - i * 8} C${-20},${-44 - i * 6} ${10},${-46 - i * 5} ${30 - i * 2},${-38 - i * 6}`, shade(tc, -0.25), 1.2);
      s += circ(18, -48, 4, GOLD, { stroke: GOLD_LO }) + `<path d="M18,-52 C22,-64 30,-70 38,-72 C32,-64 26,-58 22,-50Z" fill="#fbf3df" stroke="${LINE}" stroke-width="0.8"/>`;
    } else if (c === 'indra') {    // a broad golden crown with a gem for the king of gods
      s += path('M-38,-34 C-36,-60 -22,-76 -4,-78 C14,-76 28,-60 30,-36 C10,-44 -16,-44 -38,-34Z', GOLD, { sw: 1.5 });
      s += circ(-4, -56, 7, '#2a5bd7', { stroke: GOLD_LO, sw: 1.4 }) + circ(-4, -82, 4, PEARL, { stroke: GOLD_LO });
      for (let i = -3; i <= 3; i++) s += circ(-4 + i * 9, -36, 2.3, PEARL);
    }
    return s;
  }

  // ---------------------------------------------------------------- ITEMS ----
  // drawn around the grip point (0,0), long axis pointing "up" (-y) unless noted
  function item(name, t, o = {}) {
    let s = '';
    switch (name) {
      case 'chakra': {   // Sudarshana: a spinning disc of flame, held on the fingertip
        const r = 22, sp = (t || 0) * 220;
        s += `<g transform="translate(0 -26) rotate(${f1(sp % 360)})">`;
        for (let i = 0; i < 16; i++) s += `<path transform="rotate(${i * 22.5})" d="M0,-${r} L4,-${r + 9} L-2,-${r + 3}Z" fill="#f6a524" stroke="${LINE}" stroke-width="0.6"/>`;
        s += circ(0, 0, r, GOLD, { stroke: LINE, sw: 1.4 }) + circ(0, 0, r - 6, '#f7d566', { stroke: GOLD_LO, sw: 1 });
        for (let i = 0; i < 8; i++) s += `<path transform="rotate(${i * 45})" d="M0,0 L0,-${r - 6}" stroke="${GOLD_LO}" stroke-width="1.6"/>`;
        s += circ(0, 0, 4, RUBY) + '</g>';
        s += `<circle cx="0" cy="-26" r="34" fill="url(#pwGlow)" opacity="0.5"/>`;
        break;
      }
      case 'shankh':    // conch
        s += path('M-8,4 C-16,-8 -14,-28 0,-40 C10,-32 16,-16 12,-2 C8,6 0,8 -8,4Z', '#fbf4e2', { sw: 1.4 });
        s += curve('M-6,-4 C-2,-14 4,-22 2,-32 M2,2 C6,-8 8,-16 6,-26', '#d8c8a0', 1.2);
        s += path('M-8,4 C-10,8 -6,12 -2,10 C0,8 0,6 -2,5Z', GOLD, { sw: 0.8 });
        break;
      case 'gada':      // mace
        s += `<rect x="-3" y="-70" width="6" height="84" rx="2" fill="${GOLD_LO}" stroke="${LINE}" stroke-width="1.2"/>`;
        s += path('M0,-118 C14,-112 18,-92 12,-78 C6,-70 -6,-70 -12,-78 C-18,-92 -14,-112 0,-118Z', GOLD, { sw: 1.4 });
        for (let i = 0; i < 3; i++) s += curve(`M-14,${-104 + i * 10} C-4,${-100 + i * 10} 4,${-100 + i * 10} 14,${-104 + i * 10}`, GOLD_LO, 1.2);
        s += circ(0, -122, 3, PEARL);
        break;
      case 'padma':     // lotus flower on a stem
        s += curve('M0,8 C2,-10 -2,-24 0,-36', '#3f7a3a', 2.4);
        s += lotusBud(0, -38, 1, o.open != null ? o.open : 1);
        break;
      case 'trishul':   // trident with damaru
        s += `<rect x="-2.5" y="-150" width="5" height="190" fill="${GOLD_LO}" stroke="${LINE}" stroke-width="1"/>`;
        s += path('M0,-200 L6,-170 L4,-150 L-4,-150 L-6,-170Z', '#dfe3ea', { sw: 1.2 });
        s += path('M-4,-152 C-24,-152 -30,-168 -26,-190 C-22,-176 -18,-166 -4,-164Z', '#dfe3ea', { sw: 1.2 });
        s += path('M4,-152 C24,-152 30,-168 26,-190 C22,-176 18,-166 4,-164Z', '#dfe3ea', { sw: 1.2 });
        s += `<g transform="translate(0 -128)">${path('M-12,-10 L12,-10 L-12,10 L12,10Z', '#b44a2a', { sw: 1 })}${circ(-14, 0, 2.4, LINE)}${circ(14, 0, 2.4, LINE)}</g>`;
        break;
      case 'damaru':
        s += `<g transform="translate(0 -12) rotate(${f1(Math.sin((t || 0) * 20) * 18)})">${path('M-12,-10 L12,-10 L-12,10 L12,10Z', '#b44a2a', { sw: 1 })}${curve('M-12,-1 C-20,6 -22,12 -18,16', LINE, 1)}${circ(-18, 16, 2.4, LINE)}</g>`;
        break;
      case 'kamandal':  // water pot
        s += path('M-14,-6 C-18,-20 -10,-30 0,-30 C10,-30 18,-20 14,-6 C10,2 -10,2 -14,-6Z', GOLD_LO, { sw: 1.3 });
        s += curve('M-12,-24 C-6,-44 10,-44 14,-26', LINE, 1.6) + path('M12,-20 L24,-30 L22,-24Z', GOLD_LO, { sw: 1 });
        break;
      case 'mala':      // prayer beads hanging from the hand
        for (let i = 0; i < 14; i++) { const a = i / 13 * Math.PI; s += circ(Math.sin(a) * 10, 6 + (1 - Math.cos(a)) * 14, 2.2, '#7a2a1a', { stroke: LINE, sw: 0.4 }); }
        break;
      case 'vedas':     // a palm-leaf manuscript bundle
        s += `<g transform="rotate(-10)"><rect x="-20" y="-14" width="40" height="12" rx="2" fill="#e9d29a" stroke="${LINE}" stroke-width="1.2"/>`;
        for (let i = 1; i < 6; i++) s += line([[-20, -14 + i * 2], [20, -14 + i * 2]], '#b58b3c', 0.6);
        s += `<rect x="-22" y="-16" width="5" height="16" rx="1" fill="${RUBY}"/><rect x="17" y="-16" width="5" height="16" rx="1" fill="${RUBY}"/></g>`;
        break;
      case 'veena':     // Narad's veena: long neck with two gourds
        s += `<g transform="rotate(${o.rot != null ? o.rot : -30})"><rect x="-3.5" y="-120" width="7" height="200" rx="3" fill="#8a4a1e" stroke="${LINE}" stroke-width="1.2"/>`;
        s += circ(0, 66, 22, '#c9822e', { stroke: LINE, sw: 1.4 }) + circ(0, 66, 14, '#a4621f') + circ(0, -110, 16, '#c9822e', { stroke: LINE, sw: 1.4 });
        for (let i = 0; i < 9; i++) s += line([[-3.5, -80 + i * 14], [3.5, -80 + i * 14]], GOLD, 1.4);
        s += line([[-1, -120], [-1, 66]], '#f1e3b8', 0.6) + line([[1.4, -120], [1.4, 66]], '#f1e3b8', 0.6);
        s += path('M-3,-126 C-6,-140 6,-146 8,-134 C6,-128 2,-126 -3,-126Z', GOLD, { sw: 1 }) + '</g>';
        break;
      case 'flute':
        s += `<rect x="-4" y="-2" width="110" height="7" rx="3" fill="#b4782e" stroke="${LINE}" stroke-width="1.2"/>`;
        for (let i = 0; i < 6; i++) s += circ(40 + i * 10, 1.5, 1.6, LINE);
        s += `<rect x="20" y="-3" width="4" height="9" fill="${GOLD}"/><path d="M0,5 C-6,14 -2,22 4,26" stroke="${RUBY}" stroke-width="1.6" fill="none"/>`;
        break;
      case 'bow':
        s += curve('M0,-80 C40,-50 40,50 0,80', '#8a4a1e', 4) + line([[0, -80], [0, 80]], '#f1e3b8', 1);
        break;
      case 'sword':
        s += `<rect x="-2" y="-6" width="4" height="22" fill="${GOLD_LO}"/>` + path('M-3,-6 C-4,-50 -2,-86 6,-110 C8,-80 6,-44 3,-6Z', '#dfe3ea', { sw: 1.2 }) + `<rect x="-10" y="-8" width="20" height="5" rx="2" fill="${GOLD}" stroke="${LINE}" stroke-width="0.8"/>`;
        break;
      case 'kalash':    // the golden pot of amrit
        s += path('M-14,-2 C-20,-14 -18,-26 -8,-30 L-8,-34 L8,-34 L8,-30 C18,-26 20,-14 14,-2Z', GOLD, { sw: 1.3 }) + path('M-10,-34 C-6,-42 6,-42 10,-34Z', '#f7d566', { sw: 1 }) + circ(0, -16, 3, RUBY, { stroke: false }) + curve('M-12,-24 L12,-24', GOLD_LO, 1);
        break;
      case 'chhatra': { // Vamana's parasol: a red-and-gold umbrella on a tall staff
        s += curve('M0,4 L0,-96', '#6a3a1a', 3);
        s += path('M-46,-80 C-40,-104 -16,-118 0,-120 C16,-118 40,-104 46,-80 C30,-86 16,-86 0,-80 C-16,-86 -30,-86 -46,-80Z', '#c8372d', { sw: 1.4 });
        s += curve('M-46,-80 C-30,-86 -16,-86 0,-80 C16,-86 30,-86 46,-80', GOLD, 2.4);
        for (const x of [-40, -20, 0, 20, 40]) s += circ(x, -78 + Math.abs(x) * 0.06, 2.2, GOLD_HI);
        s += circ(0, -122, 4, GOLD);
        break;
      }
      case 'parashu': { // Parashurama's axe: a long haft with a crescent blade
        s += curve('M0,8 L0,-104', '#6a3a1a', 4);
        s += path('M0,-100 C18,-112 34,-108 40,-92 C34,-80 18,-76 0,-84Z', '#dfe4ea', { sw: 1.4 }) + curve('M4,-96 C16,-102 28,-100 34,-92', '#9aa4b0', 1.2);
        s += `<rect x="-4" y="-104" width="8" height="24" fill="${GOLD}" stroke="${LINE}" stroke-width="0.8"/>`;
        break;
      }
      case 'linga': {   // the shivalinga Ravana carries: a dark stone on a yoni base, with a tripundra
        s += path('M-34,-8 L30,-8 L44,-16 L30,-24 L-34,-24 C-38,-20 -38,-12 -34,-8Z', '#3a3a4a', { sw: 1.4, stroke: '#cfc6b2' });
        s += path('M-20,-24 C-22,-60 -12,-74 0,-74 C12,-74 22,-60 20,-24Z', '#2a2a36', { sw: 1.4, stroke: '#cfc6b2' });
        for (const y of [-52, -46, -40]) s += curve(`M-12,${y} C-4,${y - 2} 4,${y - 2} 12,${y}`, '#efe6cf', 1.6);
        s += circ(0, -46, 2.4, RUBY) + `<circle cx="0" cy="-48" r="44" fill="url(#pwGlow)" opacity="0.35"/>`;
        break;
      }
      case 'kapal':     // skull bowl (Kapali)
        s += path('M-14,-2 C-16,-18 -6,-26 4,-24 C14,-22 18,-12 14,-2 C6,2 -6,2 -14,-2Z', '#efe6cf', { sw: 1.3 }) + circ(-2, -12, 3, LINE) + circ(8, -12, 3, LINE);
        break;
      case 'ketaki':    // the ketaki flower
        s += curve('M0,6 C0,-6 2,-14 0,-20', '#5c7a3a', 2) + path('M0,-20 C-10,-30 -8,-46 0,-56 C8,-46 10,-30 0,-20Z', '#f5ecc4', { sw: 1.1 }) + path('M0,-24 C-4,-30 -3,-40 0,-46 C3,-40 4,-30 0,-24Z', '#e8d27a', { sw: 0.6 });
        break;
      case 'diya':
        s += path('M-12,0 C-10,8 10,8 12,0 L16,-2 C8,-4 -8,-4 -12,0Z', '#b4562a', { sw: 1 }) + flame(13, -6, 0.6, t);
        break;
    }
    return s;
  }

  function lotusBud(x, y, sc, open = 1, col = '#f19ab0') {
    let s = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc})">`;
    const petals = [[-1, 0.9], [1, 0.9], [-0.55, 1], [0.55, 1], [0, 1.05]];
    for (const [d, h] of petals) {
      const a = d * (20 + 32 * open);
      s += `<path transform="rotate(${f1(a)})" d="M0,0 C-8,-6 -8,-20 0,${f1(-28 * h)} C8,-20 8,-6 0,0Z" fill="${d === 0 ? shade(col, 0.2) : col}" stroke="${LINE}" stroke-width="1"/>`;
      s += `<path transform="rotate(${f1(a)})" d="M0,-4 L0,${f1(-22 * h)}" stroke="${shade(col, -0.25)}" stroke-width="0.7"/>`;
    }
    return s + '</g>';
  }

  function flame(x, y, sc, t, seed = 0) {
    const w = Math.sin((t || 0) * 13 + seed) * 2.5, h = 1 + 0.12 * Math.sin((t || 0) * 17 + seed * 2);
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * 100) / 100} ${f1(sc * h * 100) / 100})"><path d="M0,0 C-10,-6 -10,-18 ${f1(w)},-34 C10,-18 10,-6 0,0Z" fill="#f29a1e" stroke="#9a3a12" stroke-width="1"/><path d="M0,-2 C-5,-6 -5,-14 ${f1(w * 0.6)},-22 C5,-14 5,-6 0,-2Z" fill="#fde27a"/></g>`;
  }

  // ---------------------------------------------------------------- ARMS ----
  // two-bone IK from shoulder to a hand target; elbows bend down and outward
  function ik(sx, sy, tx, ty, l1, l2, bendSign) {
    let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy);
    const maxd = l1 + l2 - 0.5; if (d > maxd) { tx = sx + dx / d * maxd; ty = sy + dy / d * maxd; dx = tx - sx; dy = ty - sy; d = maxd; }
    d = Math.max(d, Math.abs(l1 - l2) + 1);
    const a = Math.atan2(dy, dx);
    const c = clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1);
    // pick the elbow that hangs lower (natural for arms), optionally nudged outward by bendSign
    const b0 = Math.acos(c);
    const e1 = [sx + Math.cos(a + b0) * l1, sy + Math.sin(a + b0) * l1], e2 = [sx + Math.cos(a - b0) * l1, sy + Math.sin(a - b0) * l1];
    const [ex, ey] = (e1[1] + bendSign * 0.01 * e1[0]) >= (e2[1] + bendSign * 0.01 * e2[0]) ? e1 : e2;
    return { ex, ey, hx: tx, hy: ty };
  }
  function limb(x1, y1, x2, y2, w1, w2, fill) {
    const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a), ny = Math.cos(a);
    const p = [[x1 + nx * w1, y1 + ny * w1], [x2 + nx * w2, y2 + ny * w2], [x2 - nx * w2, y2 - ny * w2], [x1 - nx * w1, y1 - ny * w1]];
    return `<path d="M${pt(...p[0])} L${pt(...p[1])} A${f1(w2)},${f1(w2)} 0 0 1 ${pt(...p[2])} L${pt(...p[3])} A${f1(w1)},${f1(w1)} 0 0 1 ${pt(...p[0])}Z" fill="${fill}" stroke="${LINE}" stroke-width="1.5" stroke-linejoin="round"/>`;
  }
  function hand(x, y, ang, kind, skin, sc = 1) {
    // ang: direction of the forearm (radians). kinds: open (palm out, fingers up), fist, point, grip, namaste, down
    const deg = ang * 180 / Math.PI;
    let s = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(deg)}) scale(${sc})">`;
    if (kind === 'open' || kind === 'abhaya' || kind === 'bless') {
      s += `<g transform="rotate(${f1(-deg - 90 + (kind === 'bless' ? 10 : 0))})">` +
        path('M-7,4 C-9,-6 -8,-16 -6,-22 C-4,-24 -2,-22 -2,-18 L-1,-26 C0,-29 3,-28 3,-25 L4,-24 C5,-27 8,-26 8,-23 L8,-18 C9,-20 12,-19 11,-15 C10,-6 9,2 6,6 C2,9 -4,8 -7,4Z', skin, { sw: 1.2 }) +
        curve('M-1,-10 L-1,-18 M3,-10 L3.5,-19 M7,-8 L7.5,-15', LINE, 0.7, { op: 0.6 }) + circ(1, -2, 2.2, RUBY, { op: 0.7 }) + '</g>';
    } else if (kind === 'point') {
      s += path('M-2,-7 C6,-8 10,-6 22,-4 C24,-3 24,0 22,0.5 L10,1 C10,5 6,8 0,7 C-5,6 -6,-5 -2,-7Z', skin, { sw: 1.2 });
    } else if (kind === 'namaste') {
      s += `<g transform="rotate(${f1(-deg - 70)})">` + path('M-6,6 C-8,-4 -6,-18 -2,-26 C1,-30 5,-28 6,-24 C8,-14 8,-2 6,6 C2,9 -3,9 -6,6Z', skin, { sw: 1.2 }) + curve('M0,-24 L1,-6', LINE, 0.8) + '</g>';
    } else if (kind === 'down' || kind === 'varada') {
      s += `<g transform="rotate(${f1(-deg + 90)})">` + path('M-7,-4 C-9,6 -8,16 -6,22 C-4,24 -2,22 -2,18 L-1,26 C0,29 3,28 3,25 L4,24 C5,27 8,26 8,23 L8,18 C9,20 12,19 11,15 C10,6 9,-2 6,-6 C2,-9 -4,-8 -7,-4Z', skin, { sw: 1.2 }) + circ(1, 4, 2.2, RUBY, { op: 0.6 }) + '</g>';
    } else {   // fist / grip
      s += path('M-4,-8 C6,-10 12,-6 13,0 C14,6 8,10 0,9 C-6,8 -8,-5 -4,-8Z', skin, { sw: 1.2 }) + curve('M4,-7 C8,-5 9,-1 8,3 M8,-6 C11,-3 12,1 11,4', LINE, 0.7, { op: 0.6 });
    }
    return s + '</g>';
  }

  // arm poses: hand targets relative to the shoulder of each arm (+x is the facing direction)
  const POSES = {
    rest:     { near: [6, 128, 'down'], far: [-8, 126, 'down'] },
    hips:     { near: [22, 104, 'fist'], far: [-30, 100, 'fist'] },
    namaste:  { near: [52, 60, 'namaste'], far: [80, 62, 'namaste'] },
    abhaya:   { near: [54, 12, 'abhaya'], far: [4, 120, 'varada'] },
    bless:    { near: [70, -8, 'bless'], far: [4, 120, 'down'] },
    raise:    { near: [34, -110, 'fist'], far: [-24, 110, 'fist'] },
    point:    { near: [130, 6, 'point'], far: [-10, 118, 'down'] },
    hold:     { near: [70, 50, 'fist'], far: [-10, 118, 'down'] },
    offer:    { near: [86, 46, 'open'], far: [70, 56, 'open'] },
    open:     { near: [96, 30, 'open'], far: [-60, 40, 'open'] },
    shrug:    { near: [60, 70, 'open'], far: [-40, 70, 'open'] },
    fear:     { near: [56, -4, 'open'], far: [70, 6, 'open'] },
    despair:  { near: [30, -60, 'open'], far: [10, -66, 'open'] },
    cradle:   { near: [64, 72, 'open'], far: [44, 80, 'open'] },
    lap:      { near: [44, 104, 'open'], far: [28, 108, 'open'] },
    meditate: { near: [52, 112, 'open'], far: [34, 114, 'open'] },
    veena:    { near: [30, 92, 'fist'], far: [30, 20, 'fist'] },
    flute:    { near: [70, -30, 'fist'], far: [36, -26, 'fist'] },
    strike:   { near: [140, -40, 'fist'], far: [-50, 60, 'fist'] },
    reach:    { near: [140, -70, 'open'], far: [120, -50, 'open'] },
    wave:     { near: [64, -60, 'open'], far: [-10, 118, 'down'] },
    cover:    { near: [40, -36, 'open'], far: [30, -30, 'open'] },
    curse:    { near: [120, -24, 'point'], far: [-20, 110, 'fist'] },
    lift:     { near: [24, -150, 'open'], far: [4, 120, 'down'] }
  };
  // second pair of arms for four-armed gods
  const UPPER = {
    vishnu: { near: [104, -64, 'fist', 'shankh'], far: [-86, -84, 'fist', 'chakra'] },
    shiva:  { near: [100, -70, 'fist', 'damaru'], far: [-84, -70, 'fist', 'trishul'] },
    brahma: { near: [104, -50, 'fist', 'vedas'], far: [-86, -60, 'fist', 'kamandal'] },
    devi:   { near: [100, -70, 'fist', 'sword'], far: [-86, -80, 'fist', 'chakra'] }
  };

  // ---------------------------------------------------------------- BODY ----
  // st: { pose, pose2, poseMix, open, blink, emo, look, t, seat, fly, walk, lean, glow }
  function figure(o, st) {
    const t = st.t || 0;
    const F = !!o.female;
    const skin = o.skin;
    const seat = st.seat || o.seat;               // 'lotus' | 'kneel' | null
    const fly = st.fly || 0;
    const breathe = Math.sin(t * 1.6 + (o.seed || 0)) * 1.2;
    const walk = st.walk ? Math.sin(t * 6.5) : 0;
    const hipY = seat === 'lotus' ? -50 : seat === 'kneel' ? -110 : -205;
    const shY = hipY - 128 + breathe * 0.4;
    const lean = (st.lean || 0) + (st.walk ? 2 : 0);
    const W = o.build === 'large' ? 1.18 : o.build === 'slim' ? 0.9 : o.build === 'child' ? 0.82 : 1;
    const hs = o.headScale || (o.build === 'child' ? 0.78 : 0.68);
    const headY = shY - 10 - 47 * hs;   // centre of the skull
    let back = '', mid = '', front = '';

    // --- long hair falling behind the shoulders
    if (o.crown !== 'asura' && o.longHair !== false) {
      const hc = o.hair || '#140c0a', sway = Math.sin(t * 1.1 + 1) * 3;
      const hl = F ? 170 : 110;
      back += path(`M-24,${headY + 6} C-44,${headY + 30} -46,${headY + 70} ${-40 + sway},${headY + hl} C-30,${headY + hl + 10} -18,${headY + hl - 6} -12,${headY + hl - 20} C-14,${headY + 60} -6,${headY + 30} -4,${headY + 14}Z`, hc, { sw: 1.3 });
      if (!F) for (let i = 0; i < 3; i++) back += curve(`M${-30 + i * 6},${headY + 30} C${-38 + i * 6},${headY + 60} ${-36 + i * 6 + sway},${headY + 80} ${-30 + i * 5 + sway},${headY + hl - 6}`, shade(hc, 0.3), 1.1);
      if (F) back += curve(`M-28,${headY + 40} C-34,${headY + 90} ${-30 + sway},${headY + 130} ${-26 + sway},${headY + 150}`, GOLD, 2, { dash: '3 6' });
    }
    if (o.crown === 'asura') {   // mane of flame hair down the back
      const sway = Math.sin(t * 1.4) * 4;
      back += path(`M-20,${headY - 10} C-60,${headY + 10} -70,${headY + 70} ${-56 + sway},${headY + 120} C-40,${headY + 100} -30,${headY + 60} -6,${headY + 20}Z`, o.hair || '#f2c230', { sw: 1.3 });
    }

    // --- uttariya scarf flowing behind (gods), or the odhni (women)
    const scarf = 'scarf' in o ? o.scarf : (F ? null : '#e8a1c0');
    if (scarf) {
      const fl = 1 + fly * 1.6, w1 = Math.sin(t * 1.7) * 8 * fl, w2 = Math.sin(t * 1.3 + 1) * 10 * fl;
      back += path(`M-26,${shY + 6} C${-52 - 20 * fly},${shY + 26 + w1} ${-64 - 50 * fly},${shY + 90 + w2} ${-60 - 70 * fly},${shY + 170 + w2 - 60 * fly} L${-48 - 70 * fly},${shY + 176 + w2 - 60 * fly} C${-50 - 40 * fly},${shY + 100 + w2} ${-40 - 10 * fly},${shY + 44 + w1} -14,${shY + 22}Z`, scarf, { sw: 1.3 }) +
        curve(`M${-30 - 4 * fly},${shY + 18} C${-50 - 20 * fly},${shY + 40 + w1} ${-56 - 45 * fly},${shY + 100 + w2} ${-54 - 70 * fly},${shY + 168 + w2 - 60 * fly}`, GOLD, 1.4, { op: 0.8 });
      back += curve(`M${-60 - 70 * fly},${shY + 170 + w2 - 60 * fly} L${-48 - 70 * fly},${shY + 176 + w2 - 60 * fly}`, GOLD, 3);
    }
    if (F && o.odhni !== false) {
      const oc = o.odhni || '#c8372d', sway = Math.sin(t * 1.2) * 5 * (1 + fly);
      back += textile(`M-6,${headY - 46} C-40,${headY - 40} -58,${headY + 10} -60,${headY + 80} C-64,${headY + 160} ${-70 + sway},${hipY + 40} ${-58 + sway},${seat ? hipY + 30 : hipY + 120} L${-26 + sway},${seat ? hipY + 30 : hipY + 110} C-30,${hipY} -20,${headY + 80} 4,${headY + 30}Z`, oc, 'star', 3, { bbox: [-80, headY - 60, 120, 380], step: 14, mc: GOLD_HI, sw: 1.3 });
    }

    // --- far arm(s)
    const pz = POSES[st.pose || 'rest'] || POSES.rest, pz2 = st.pose2 ? (POSES[st.pose2] || pz) : null, pm = st.poseMix || 0;
    const tgt = (k, i) => pz2 ? lerp(pz[k][i], pz2[k][i], pm) : pz[k][i];
    const handKind = k => (pz2 && pm > 0.5 ? pz2 : pz)[k][2];
    const L1 = 70 * W, L2 = 66 * W, AW = 11 * W;
    const shN = [30 * W, shY + 8], shF = [-30 * W, shY + 10];
    const armCol = skin, sk2 = shade(skin, -0.12);
    function arm(sh, tx, ty, kind, col, itemName, sign, extraRot) {
      const r = ik(sh[0], sh[1], sh[0] + tx * W, sh[1] + ty * W, L1, L2, sign);
      // forearm first, then the upper arm, then a stroke-less patch that hides the joint seam
      let s = limb(r.ex, r.ey, r.hx, r.hy, AW * 0.85, AW * 0.62, col) + limb(sh[0], sh[1], r.ex, r.ey, AW, AW * 0.85, col) +
        `<circle cx="${f1(r.ex)}" cy="${f1(r.ey)}" r="${f1(AW * 0.85 - 1.2)}" fill="${col}"/>` +
        `<circle cx="${f1(sh[0])}" cy="${f1(sh[1])}" r="${f1(AW - 1.2)}" fill="${col}"/>`;
      // armlet and bangles
      const mx = lerp(sh[0], r.ex, 0.55), my = lerp(sh[1], r.ey, 0.55), a1 = Math.atan2(r.ey - sh[1], r.ex - sh[0]);
      s += `<g transform="translate(${f1(mx)} ${f1(my)}) rotate(${f1(a1 * 180 / Math.PI + 90)})"><rect x="${f1(-AW - 1)}" y="-3" width="${f1(AW * 2 + 2)}" height="6" rx="2" fill="${GOLD}" stroke="${LINE}" stroke-width="0.9"/>${circ(0, 0, 2.4, RUBY)}</g>`;
      const a2 = Math.atan2(r.hy - r.ey, r.hx - r.ex), wx = lerp(r.ex, r.hx, 0.86), wy = lerp(r.ey, r.hy, 0.86);
      s += `<g transform="translate(${f1(wx)} ${f1(wy)}) rotate(${f1(a2 * 180 / Math.PI + 90)})"><rect x="${f1(-AW * 0.7)}" y="-4" width="${f1(AW * 1.4)}" height="3" fill="${F ? RUBY : GOLD}" stroke="${LINE}" stroke-width="0.6"/><rect x="${f1(-AW * 0.7)}" y="-0.5" width="${f1(AW * 1.4)}" height="3" fill="${GOLD}" stroke="${LINE}" stroke-width="0.6"/></g>`;
      s += hand(r.hx, r.hy, a2, kind, col, W);
      if (itemName) s += `<g transform="translate(${f1(r.hx)} ${f1(r.hy)}) rotate(${f1(extraRot || 0)})">${item(itemName, t, o.itemOpts || {})}</g>`;
      return s;
    }
    const nearItem = st.item !== undefined ? st.item : o.item;
    const farItem = st.itemFar !== undefined ? st.itemFar : o.itemFar;
    back += arm(shF, tgt('far', 0), tgt('far', 1), handKind('far'), sk2, farItem, 1, 0);
    // upper (extra) arms
    const four = (o.arms === 4 || o.arms >= 8) ? UPPER[o.upper || 'vishnu'] : null;
    // ten-armed Durga: a fan of further arms, each with a god's gift
    const fan = o.arms >= 8 ? { far: [[-124, -20, 'bow'], [-128, -112, 'gada'], [-50, -136, 'shankh']], near: [[126, -16, 'padma'], [124, -118, 'damaru'], [56, -140, 'mala']] } : null;
    if (fan) fan.far.forEach(([x, y, it], i) => { back += arm([shF[0] + 2 + i * 2, shF[1] + 2 + i * 3], x, y + Math.sin(t * 1.1 + i) * 4, 'fist', sk2, it, 1); });
    if (four) {
      const wv = Math.sin(t * 1.2 + 0.4) * 4;
      back += arm([shF[0] + 4, shF[1] + 4], four.far[0], four.far[1] + wv, four.far[2], sk2, four.far[3], 1);
    }

    // --- legs and lower garment
    const garCol = o.dhoti || '#f2c230';
    if (seat === 'lotus') {
      // crossed legs under a wide drape
      mid += path(`M${-70 * W},${hipY + 44} C${-74 * W},${hipY + 10} ${-40 * W},${hipY - 10} 0,${hipY - 12} C${50 * W},${hipY - 10} ${92 * W},${hipY + 8} ${96 * W},${hipY + 36} C${70 * W},${hipY + 54} ${-40 * W},${hipY + 56} ${-70 * W},${hipY + 44}Z`, garCol, { sw: 1.5 });
      mid += textile(`M${-70 * W},${hipY + 44} C${-74 * W},${hipY + 10} ${-40 * W},${hipY - 10} 0,${hipY - 12} C${50 * W},${hipY - 10} ${92 * W},${hipY + 8} ${96 * W},${hipY + 36} C${70 * W},${hipY + 54} ${-40 * W},${hipY + 56} ${-70 * W},${hipY + 44}Z`, garCol, o.dhotiMotif || 'dot', 5, { bbox: [-100, hipY - 20, 220, 90], mc: o.dhotiDots || '#b5481e', step: 11 });
      mid += path(`M${40 * W},${hipY + 30} C${56 * W},${hipY + 22} ${76 * W},${hipY + 22} ${88 * W},${hipY + 30} C${80 * W},${hipY + 38} ${56 * W},${hipY + 40} ${40 * W},${hipY + 30}Z`, skin, { sw: 1.2 });   // sole of the upturned foot
      mid += circ(84 * W, hipY + 30, 2, RUBY, { op: 0.6 });
    } else if (seat === 'kneel') {
      mid += path(`M${-30 * W},${hipY - 6} C${-10 * W},${hipY - 10} ${30 * W},${hipY - 10} ${40 * W},${hipY + 20} C${60 * W},${hipY + 60} ${74 * W},${hipY + 90} ${70 * W},${hipY + 110} L${-56 * W},${hipY + 110} C${-50 * W},${hipY + 60} ${-40 * W},${hipY + 20} ${-30 * W},${hipY - 6}Z`, garCol, { sw: 1.5 });
      mid += path(`M${-60 * W},${hipY + 102} C${-74 * W},${hipY + 100} ${-82 * W},${hipY + 106} ${-80 * W},${hipY + 110} L${-56 * W},${hipY + 110}Z`, skin, { sw: 1.1 });
    } else if (F) {
      // ghagra skirt to the ankles with patterned bands
      const sk = o.skirt || '#c8372d', sway = Math.sin(t * 1.5) * 3 + walk * 5;
      const sd = `M${-22 * W},${hipY + 4} C${-50 * W},${hipY + 60} ${-74 * W + sway},${-60} ${-80 * W + sway},-8 C${-30 * W},6 ${40 * W},6 ${92 * W + sway},-8 C${80 * W + sway},-60 ${50 * W},${hipY + 60} ${30 * W},${hipY + 4}Z`;
      mid += textile(sd, sk, o.skirtMotif || 'flower', 7, { bbox: [-110, hipY, 220, -hipY + 20], mc: o.skirtDots || GOLD_HI, step: 15 });
      mid += curve(`M${-78 * W + sway},-14 C${-30 * W},0 ${40 * W},0 ${90 * W + sway},-14`, GOLD, 5);
      mid += curve(`M${-66 * W + sway * 0.7},-48 C${-24 * W},-36 ${36 * W},-36 ${78 * W + sway * 0.7},-48`, GOLD, 2.4, { op: 0.9 });
      for (let i = 0; i < 6; i++) mid += curve(`M${(-14 + i * 8) * W},${hipY + 20} C${(-30 + i * 22) * W},${hipY + 90} ${(-50 + i * 28) * W + sway},-80 ${(-60 + i * 28) * W + sway},-14`, shade(sk, -0.25), 1, { op: 0.6 });
      mid += path(`M${58 * W},-6 C${66 * W},-14 ${84 * W},-12 ${92 * W},-4 C${86 * W},1 ${66 * W},1 ${58 * W},-6Z`, skin, { sw: 1.1 });
    } else {
      // pitambar: dhoti to the mid-calf, shins and feet below
      const st1 = walk * 10;
      mid += limb(-6 * W - st1, -60, -14 * W - st1, -10, 9 * W, 7 * W, shade(skin, -0.1));
      mid += path(`M${-14 * W - st1},-14 C${-4 * W - st1},-12 ${12 * W - st1},-8 ${18 * W - st1},-2 C${6 * W - st1},1 ${-14 * W - st1},1 ${-20 * W - st1},-4Z`, shade(skin, -0.1), { sw: 1.2 });
      mid += limb(18 * W + st1, -60, 16 * W + st1, -10, 9.5 * W, 7.5 * W, skin);
      mid += path(`M${12 * W + st1},-14 C${26 * W + st1},-12 ${44 * W + st1},-8 ${50 * W + st1},-2 C${36 * W + st1},1 ${14 * W + st1},1 ${8 * W + st1},-4Z`, skin, { sw: 1.2 });
      mid += `<rect x="${f1(8 * W + st1)}" y="-18" width="${f1(17 * W)}" height="4" rx="2" fill="${GOLD}" stroke="${LINE}" stroke-width="0.7"/>`;
      const sway = Math.sin(t * 1.5) * 2;
      const dd = `M${-26 * W},${hipY} C${-32 * W},${hipY + 60} ${-40 * W},-110 ${-34 * W + sway},-56 C${-10 * W},-46 ${30 * W},-46 ${44 * W + sway},-58 C${48 * W},-110 ${40 * W},${hipY + 60} ${32 * W},${hipY}Z`;
      mid += textile(dd, garCol, o.dhotiMotif || 'dot', 9, { bbox: [-60, hipY - 10, 130, -hipY], mc: o.dhotiDots || '#b5481e', step: 11, mo: 0.7 });
      for (let i = 0; i < 4; i++) mid += curve(`M${(-4 + i * 10) * W},${hipY + 10} C${(-8 + i * 12) * W},${hipY + 80} ${(-14 + i * 14) * W + sway},-100 ${(-18 + i * 15) * W + sway},-54`, shade(garCol, -0.3), 1.1, { op: 0.6 });
      mid += curve(`M${-34 * W + sway},-58 C${-10 * W},-48 ${30 * W},-48 ${44 * W + sway},-60`, o.border || RUBY, 3.4);
    }

    // --- torso
    const tc = o.torso || null;   // a jama or choli colour; otherwise bare
    const tl = hipY - shY;   // torso length
    const T = F
      ? `M${-22 * W},${shY + 2} C${-30 * W},${shY + 24} ${-26 * W},${shY + tl * 0.62} ${-20 * W},${shY + tl * 0.78} C${-24 * W},${hipY - 6} ${-26 * W},${hipY + 4} ${-28 * W},${hipY + 12} L${36 * W},${hipY + 12} C${30 * W},${hipY - 4} ${26 * W},${shY + tl * 0.72} ${30 * W},${shY + tl * 0.5} C${44 * W},${shY + tl * 0.42} ${46 * W},${shY + tl * 0.22} ${38 * W},${shY + 8} C${32 * W},${shY} ${20 * W},${shY - 4} ${8 * W},${shY - 4}Z`
      : `M${-40 * W},${shY + 4} C${-46 * W},${shY + 30} ${-38 * W},${shY + tl * 0.6} ${-28 * W},${shY + tl * 0.82} C${-26 * W},${hipY - 8} ${-28 * W},${hipY} ${-28 * W},${hipY + 6} L${36 * W},${hipY + 6} C${34 * W},${hipY - 10} ${30 * W},${shY + tl * 0.7} ${38 * W},${shY + tl * 0.45} C${52 * W},${shY + tl * 0.3} ${54 * W},${shY + 14} ${44 * W},${shY + 2} C${34 * W},${shY - 6} ${10 * W},${shY - 8} ${-14 * W},${shY - 6}Z`;
    mid += path(T, tc || skin, { sw: 1.5 });
    if (!tc && !F) {   // chest and belly folds, navel
      mid += curve(`M${8 * W},${shY + tl * 0.34} C${22 * W},${shY + tl * 0.42} ${36 * W},${shY + tl * 0.42} ${46 * W},${shY + tl * 0.3}`, shade(skin, -0.22), 1.3, { op: 0.7 });
      mid += curve(`M${14 * W},${hipY - 34} C${22 * W},${hipY - 30} ${30 * W},${hipY - 30} ${34 * W},${hipY - 34}`, shade(skin, -0.2), 1.1, { op: 0.5 });
      mid += circ(22 * W, hipY - 22, 1.8, shade(skin, -0.35));
    }
    if (tc && !F) {    // a jama: gathered frock with a waist tie
      mid += curve(`M${-30 * W},${hipY - 8} C${0},${hipY - 2} ${20 * W},${hipY - 2} ${36 * W},${hipY - 8}`, GOLD, 2.4);
      mid += curve(`M${-4 * W},${shY - 4} C${10 * W},${shY + 30} ${24 * W},${shY + 50} ${30 * W},${shY + tl * 0.6}`, shade(tc, -0.3), 1.4);
    }
    if (F) {   // choli over the bust, bare midriff, the drape across the chest
      mid += path(`M${-6 * W},${shY + 8} C${14 * W},${shY + 2} ${42 * W},${shY + 12} ${44 * W},${shY + tl * 0.34} C${42 * W},${shY + tl * 0.48} ${30 * W},${shY + tl * 0.52} ${14 * W},${shY + tl * 0.5} C${4 * W},${shY + tl * 0.5} ${-10 * W},${shY + tl * 0.46} ${-12 * W},${shY + tl * 0.4} C${-14 * W},${shY + 30} ${-12 * W},${shY + 14} ${-6 * W},${shY + 8}Z`, o.choli || '#2e8a57', { sw: 1.2 });
      mid += curve(`M${-10 * W},${shY + tl * 0.44} C${6 * W},${shY + tl * 0.5} ${28 * W},${shY + tl * 0.5} ${42 * W},${shY + tl * 0.4}`, GOLD, 2);
      mid += circ(18 * W, hipY - 16, 1.6, shade(skin, -0.35));
      const oc = o.odhni || '#c8372d';
      if (o.odhni !== false) mid += textile(`M${-18 * W},${shY - 2} C${4 * W},${shY + 30} ${30 * W},${shY + tl * 0.7} ${38 * W},${hipY + 16} L${16 * W},${hipY + 18} C${12 * W},${shY + tl * 0.8} ${-4 * W},${shY + tl * 0.5} ${-26 * W},${shY + 14}Z`, oc, 'star', 4, { bbox: [-40, shY - 10, 100, tl + 40], step: 14, mc: GOLD_HI, sw: 1.3 });
    }
    // waist sash (patka) hanging in front
    if (!F && seat !== 'lotus') {
      const sway = Math.sin(t * 1.9 + 2) * 4 + walk * 4;
      mid += path(`M${-24 * W},${hipY - 4} C${0},${hipY - 10} ${20 * W},${hipY - 10} ${36 * W},${hipY - 4} L${36 * W},${hipY + 10} C${20 * W},${hipY + 4} 0,${hipY + 4} ${-24 * W},${hipY + 10}Z`, o.sash || '#c8372d', { sw: 1.2 });
      mid += path(`M${24 * W},${hipY + 6} C${30 * W},${hipY + 60} ${34 * W + sway},${hipY + 110} ${38 * W + sway},${hipY + 150} L${52 * W + sway},${hipY + 146} C${44 * W + sway},${hipY + 100} ${40 * W},${hipY + 50} ${38 * W},${hipY + 4}Z`, o.sash || '#c8372d', { sw: 1.2 });
      mid += curve(`M${38 * W + sway},${hipY + 140} L${52 * W + sway},${hipY + 136}`, GOLD, 3);
    }
    // sacred thread and necklaces
    if (o.thread) mid += curve(`M${-20 * W},${shY + 4} C${0},${shY + 60} ${20 * W},${shY + 100} ${34 * W},${hipY - 8}`, '#fbf4e2', 1.6);
    if (o.snake) mid += curve(`M${-14 * W},${shY - 2} C${-4 * W},${shY + 26} ${30 * W},${shY + 26} ${36 * W},${shY + 2}`, '#3d6b3a', 5) + circ(38 * W, shY - 2, 5, '#3d6b3a', { stroke: LINE, sw: 1 });
    const nk = shY - 34;
    const neck = `M${-4 * W},${nk} C${-4 * W},${shY - 8} ${-8 * W},${shY - 2} ${-14 * W},${shY + 2} L${28 * W},${shY + 2} C${22 * W},${shY - 4} ${20 * W},${shY - 12} ${22 * W},${nk}Z`;
    mid += path(neck, skin, { sw: 1.4 });
    if (o.necklace !== false) {
      mid += curve(`M${-10 * W},${shY + 2} C${0},${shY + 22} ${20 * W},${shY + 24} ${30 * W},${shY + 4}`, GOLD, 3.2);
      for (let i = 0; i < 9; i++) { const a = i / 8; mid += circ(lerp(-8, 30, a) * W, shY + 6 + Math.sin(a * Math.PI) * 26, 2, PEARL); }
      mid += curve(`M${-12 * W},${shY + 4} C${-4 * W},${shY + 50} ${22 * W},${shY + 52} ${34 * W},${shY + 8}`, PEARL, 1.6, { dash: '0.1 4.2' });
      mid += circ(10 * W, shY + 46, 4, RUBY, { stroke: GOLD, sw: 1.4 });
    }
    if (o.garland) {   // vaijayanti mala: a long garland of flowers to the knees
      const gc = o.garland === true ? '#f2a516' : o.garland, sway = Math.sin(t * 1.4) * 3;
      for (let i = 0; i <= 40; i++) {
        const a = i / 40, x = lerp(-20, 40, a) * W + Math.sin(a * Math.PI) * (sway + 14 * W), y = shY + 2 + Math.sin(a * Math.PI) * (hipY - shY + (seat ? 10 : 60));
        mid += circ(x, y, 3.1, ['#fbf4e2', gc, gc, '#c8263a'][i % 4], { stroke: LINE, sw: 0.5 });
      }
    }

    // a carried prop between the torso and the head (Narad's veena rests on his shoulder)
    if (st.prop !== null && (st.prop || o.prop)) {
      const pr = st.prop || o.prop;
      mid += `<g transform="translate(${f1(pr.x * W)} ${f1(shY + pr.y)}) rotate(${pr.rot || 0})">${item(pr.name, t, { rot: 0 })}</g>`;
    }
    // --- head (with optional extra heads for Brahma)
    const hx = 6 * W + lean * 0.5, hy = headY;
    let H = '';
    if (o.heads === 4) {   // two side heads peeking behind (the back one is hidden)
      const so = Object.assign({}, o, { crown: 'brahma' });
      H += `<g transform="translate(${f1(hx - 22)} ${f1(hy + 4)}) scale(${-hs * 0.94} ${hs * 0.94})">${head(so, Object.assign({}, st, { open: 0 }))}${crown(so, t)}</g>`;
      H += `<g transform="translate(${f1(hx - 10)} ${f1(hy - 2)}) scale(${hs * 0.97})" opacity="1">${head(so, Object.assign({}, st, { open: 0, emo: st.emo === 'meditate' ? 'meditate' : 'calm' }))}${crown(so, t)}</g>`;
    }
    if (o.heads === 6) {   // Kartikeya: a fan of five more faces behind the first
      for (const [dx, dy, flip, sc] of [[-30, -46, -1, 0.82], [-6, -54, 1, 0.84], [-36, -6, -1, 0.9], [-14, -18, 1, 0.92], [-24, 8, -1, 0.9]])
        H += `<g transform="translate(${f1(hx + dx * hs * 1.4)} ${f1(hy + dy * hs * 1.4)}) scale(${flip * hs * sc} ${hs * sc})">${head(o, Object.assign({}, st, { open: 0 }))}${crown(o, t)}</g>`;
    }
    if (o.heads === 10) {   // Ravana: a row of nine more crowned heads, five behind and four ahead
      const n = st.heads10 ?? 9;
      const order = [-5, 4, -4, 3, -3, 2, -2, 1, -1].slice(0, n);
      for (const i of order.sort((a, b) => Math.abs(b) - Math.abs(a)))
        H += `<g transform="translate(${f1(hx + i * 44 * hs)} ${f1(hy + 6 - Math.abs(i) * 2)}) scale(${hs * 0.86})">${head(o, Object.assign({}, st, { open: 0, emo: Math.abs(i) % 2 ? (st.emo || 'calm') : 'sly' }))}${crown(o, t)}</g>`;
    }
    if (o.heads === 5) {
      const so = Object.assign({}, o, { crown: 'brahma' });
      H += `<g transform="translate(${f1(hx - 22)} ${f1(hy + 4)}) scale(${-hs * 0.94} ${hs * 0.94})">${head(so, Object.assign({}, st, { open: 0 }))}${crown(so, t)}</g>`;
      H += `<g transform="translate(${f1(hx - 10)} ${f1(hy - 2)}) scale(${hs * 0.97})">${head(so, Object.assign({}, st, { open: 0 }))}${crown(so, t)}</g>`;
      H += `<g transform="translate(${f1(hx - 6)} ${f1(hy - 68)}) scale(${hs * 0.9})">${head(so, Object.assign({}, st, { open: 0, emo: 'sly' }))}${crown(so, t)}</g>`;
    }
    if (o.headKind === 'horse') H += horseHead(o, st, hx, hy, hs);
    else if (o.headKind === 'ram') H += ramHead(o, st, hx, hy, hs);
    else if (o.headKind === 'lion') H += lionHead(o, st, hx, hy, hs);
    else if (o.headKind === 'elephant') H += elephantHead(o, st, hx, hy, hs);
    else if (o.headKind === 'buffalo') H += buffaloHead(o, st, hx, hy, hs);
    else H += `<g transform="translate(${f1(hx)} ${f1(hy)}) scale(${hs}) rotate(${f1(lean * 0.6 + (st.nod || 0))})">${head(o, st)}${crown(o, t)}</g>`;
    // halo (prabhamandal)
    let halo = '';
    if (o.halo) {
      const hr = (o.crown === 'kirit' ? 66 : 54) * (o.heads ? 1.25 : 1), hc = o.halo === true ? '#f4cf5a' : o.halo;
      halo = `<g transform="translate(${f1(hx - 6)} ${f1(hy - 14)})"><circle r="${hr + 10}" fill="url(#pwGlow)" opacity="0.55"/><circle r="${hr}" fill="${hc}" opacity="0.95" stroke="${GOLD_LO}" stroke-width="2"/><circle r="${hr - 7}" fill="none" stroke="#fff6cf" stroke-width="1.4" stroke-dasharray="2 5"/>`;
      for (let i = 0; i < 24; i++) halo += `<path transform="rotate(${i * 15 + t * 6})" d="M0,${-hr} L3,${-hr - 7} L-3,${-hr - 7}Z" fill="${GOLD}"/>`;
      halo += '</g>';
    }

    // --- near arms
    if (four) {
      const wv = Math.sin(t * 1.2) * 4;
      back += arm([shN[0] - 6, shN[1] + 2], four.near[0], four.near[1] + wv, four.near[2], shade(skin, -0.05), four.near[3], -1);
    }
    if (fan) fan.near.forEach(([x, y, it], i) => { back += arm([shN[0] - 4 - i * 2, shN[1] + 2 + i * 3], x, y + Math.sin(t * 1.1 + i + 2) * 4, 'fist', shade(skin, -0.05), it, -1); });
    front += arm(shN, tgt('near', 0), tgt('near', 1), handKind('near'), armCol, nearItem, -1, st.itemRot || 0);
    if (o.extra) front += o.extra(st, { shY, hipY, headY, W });

    const scale = o.scale || 1;
    const g = `<g transform="scale(${scale}) rotate(${f1(lean)} 0 ${hipY})">${halo}${back}${mid}${H}${front}</g>`;
    return g;
  }

  function ramHead(o, st, hx, hy, hs) {
    // Daksha restored with a ram's head: a cream fleece head, long muzzle and heavy curled horns
    const t = st.t || 0, open = clamp(st.open || 0) * 5;
    let s = `<g transform="translate(${f1(hx - 2)} ${f1(hy + 4)}) scale(${hs * 1.1})">`;
    s += path(`M-30,-26 C-12,-50 24,-44 40,-16 L66,10 C72,18 68,28 60,${f1(30 + open)} L48,${f1(32 + open)} C40,30 30,30 22,34 C4,44 -14,42 -24,26 C-36,8 -38,-12 -30,-26Z`, '#efe3c8', { sw: 1.6 });
    for (let i = 0; i < 9; i++) s += circ(-20 + (i % 3) * 12, -30 + Math.floor(i / 3) * 12, 6, '#f7eedb', { stroke: '#c9b48a', sw: 0.8 });
    s += path(`M50,${f1(26 + open)} C56,${f1(30 + open)} 62,${f1(30 + open)} 66,${f1(24 + open)}`, 'none', { sw: 1.2 });
    s += `<ellipse cx="22" cy="-12" rx="7" ry="4.5" fill="#f6d24a" stroke="${LINE}" stroke-width="1.2"/><rect x="18" y="-13.5" width="8" height="3" fill="${LINE}"/>`;
    s += curve('M10,-20 C18,-24 28,-22 32,-16', LINE, 2);
    s += path('M-6,-34 C-30,-48 -52,-30 -46,-6 C-42,12 -22,16 -14,4 C-8,-6 -18,-16 -26,-10 C-32,-4 -28,4 -22,2', 'none', { sw: 1 }) ;
    s += `<path d="M-4,-36 C-30,-52 -56,-32 -50,-6 C-46,14 -22,20 -12,6 C-4,-6 -16,-20 -28,-12" fill="none" stroke="#8a6a3a" stroke-width="11" stroke-linecap="round"/>`;
    s += `<path d="M-4,-36 C-30,-52 -56,-32 -50,-6 C-46,14 -22,20 -12,6 C-4,-6 -16,-20 -28,-12" fill="none" stroke="#c9a46a" stroke-width="6" stroke-dasharray="3 3" stroke-linecap="round"/>`;
    s += path('M-6,10 C-2,20 4,26 10,30', 'none', { sw: 1 });
    s += `<g transform="translate(-6 -38) scale(0.8)">${crown({ crown: 'turban', turban: o.turban || '#c8372d' }, t)}</g>`;
    s += '</g>';
    return s;
  }

  function lionHead(o, st, hx, hy, hs) {
    // Narasimha: a golden lion head with a flaming mane, fangs and a crown
    const t = st.t || 0, open = clamp(st.open || 0) * 8, sway = Math.sin(t * 2) * 3;
    let s = `<g transform="translate(${f1(hx - 4)} ${f1(hy + 4)}) scale(${hs * 1.25})">`;
    for (let i = 0; i < 14; i++) {
      const a = -2.6 + i * 0.36, r1 = 46, r2 = 74 + (i % 2) * 10;
      s += path(`M${f1(Math.cos(a) * r1)},${f1(Math.sin(a) * r1)} Q${f1(Math.cos(a + 0.2) * r2 + sway)},${f1(Math.sin(a + 0.2) * r2)} ${f1(Math.cos(a + 0.36) * r1)},${f1(Math.sin(a + 0.36) * r1)}Z`, i % 2 ? '#c8641e' : '#e8913a', { sw: 1.1 });
    }
    s += `<circle r="50" fill="#b5481e" stroke="${LINE}" stroke-width="1.4"/>`;
    s += path(`M-24,-30 C-4,-46 30,-40 44,-14 L62,2 C68,10 64,20 56,22 L50,${f1(26 + open)} C40,${f1(34 + open)} 22,${f1(34 + open)} 14,${f1(26 + open)} C0,30 -20,24 -28,6 C-36,-10 -32,-22 -24,-30Z`, '#f2b84a', { sw: 1.6 });
    s += path(`M18,${f1(22)} L50,${f1(20)} L48,${f1(26 + open)} L20,${f1(26 + open)}Z`, '#8a0f1a', { sw: 1 });
    s += path('M24,22 L28,32 L32,22Z M40,22 L44,32 L48,22Z', '#fbf4e2', { sw: 0.8 });
    s += `<ellipse cx="62" cy="2" rx="6" ry="5" fill="${LINE}"/>`;
    s += `<ellipse cx="24" cy="-14" rx="8" ry="5" fill="#f6d24a" stroke="${LINE}" stroke-width="1.3"/><circle cx="27" cy="-14" r="3" fill="${LINE}"/>`;
    s += curve('M10,-24 C20,-30 32,-28 38,-20', LINE, 2.4);
    for (let i = 0; i < 4; i++) s += curve(`M${30 + i * 6},8 l10,${-2 + i}`, LINE, 0.8);
    s += `<g transform="translate(-6 -40) scale(0.85)">${crown({ crown: 'kirit' }, t)}</g>`;
    return s + '</g>';
  }

  function elephantHead(o, st, hx, hy, hs) {
    // Ganesha: a sindoor-rose elephant head, a big patterned fan ear, a trunk curling out, one broken tusk, a mukut
    const t = st.t || 0, sw = Math.sin(t * 1.6) * 4, c = o.headCol || '#e9a27a', fl = Math.sin(t * 2.1) * 3;
    let s = `<g transform="translate(${f1(hx - 2)} ${f1(hy + 2)}) scale(${hs * 1.25})">`;
    // the fan ear, behind the head
    s += path(`M-14,-34 C-50,${f1(-62 + fl)} ${f1(-86 - fl)},-30 ${f1(-80 - fl)},6 C-74,40 -46,52 -24,34 C-30,10 -26,-14 -14,-34Z`, shade(c, -0.1), { sw: 1.6 });
    s += path(`M-20,-24 C-46,-44 -70,-22 -66,4 C-62,30 -44,38 -30,28 C-34,8 -30,-10 -20,-24Z`, '#f2b6b0', { sw: 0.8, op: 0.8 });
    for (let i = 0; i < 4; i++) s += circ(-48 + i * 6, -8 + i * 10, 2.2, GOLD);
    // dome, cheek and trunk
    s += path(`M-24,-40 C-10,-60 28,-58 42,-30 C52,-12 52,6 46,18 C${f1(54 + sw)},38 ${f1(64 + sw)},56 ${f1(58 + sw)},72 C${f1(54 + sw)},84 ${f1(70 + sw)},92 ${f1(78 + sw)},80 C${f1(82 + sw)},92 ${f1(66 + sw)},100 ${f1(54 + sw)},94 C${f1(42 + sw)},86 ${f1(44 + sw)},68 ${f1(38 + sw)},52 C34,42 30,36 26,32 C10,36 -10,30 -20,14 C-30,-4 -32,-24 -24,-40Z`, c, { sw: 1.8 });
    for (let i = 0; i < 6; i++) s += curve(`M${f1(42 + i * 2.6 + sw * (i / 6))},${32 + i * 9} l7,-2`, LINE, 0.9, { op: 0.55 });
    s += path('M28,24 C40,28 48,34 46,44 C38,40 32,34 26,30Z', '#fbf4e2', { sw: 1.1 });
    s += `<ellipse cx="18" cy="-14" rx="6.5" ry="4.2" fill="#fff" stroke="${LINE}" stroke-width="1.3"/><circle cx="20" cy="-14" r="2.8" fill="${LINE}"/>`;
    s += curve('M6,-22 C14,-27 26,-25 30,-19', LINE, 2.2) + path('M8,-36 L20,-36 L14,-26Z', RUBY, { sw: 0.6 });
    s += curve('M-6,-40 C4,-46 18,-46 26,-40', '#fff', 2, { op: 0.8 }) + curve('M-4,-36 C4,-41 16,-41 24,-36', RUBY, 1.6);
    s += `<g transform="translate(0 -48) scale(0.8)">${crown({ crown: 'mukut' }, t)}</g>`;
    return s + '</g>';
  }
  function buffaloHead(o, st, hx, hy, hs) {
    // Mahishasura: a dark buffalo head with sweeping horns and red eyes
    const t = st.t || 0, open = clamp(st.open || 0) * 6;
    let s = `<g transform="translate(${f1(hx - 2)} ${f1(hy + 4)}) scale(${hs * 1.2})">`;
    s += `<path d="M-10,-30 C-40,-60 -80,-50 -96,-14 C-80,-36 -50,-40 -24,-22" fill="#e9e2cc" stroke="${LINE}" stroke-width="1.6"/>`;
    s += `<path d="M10,-34 C30,-70 70,-74 90,-50 C70,-56 40,-50 24,-26" fill="#e9e2cc" stroke="${LINE}" stroke-width="1.6"/>`;
    s += path(`M-26,-30 C-8,-48 26,-44 40,-20 L60,8 C66,18 62,28 52,${f1(30 + open)} L36,${f1(32 + open)} C26,34 10,32 0,26 C-18,16 -32,-6 -26,-30Z`, '#2a2a3a', { sw: 1.6, stroke: '#f3ead4' });
    s += `<ellipse cx="52" cy="14" rx="5" ry="4" fill="#5a4a5a"/><ellipse cx="18" cy="-14" rx="7" ry="4.5" fill="#f6d24a" stroke="#f3ead4" stroke-width="1"/><circle cx="20" cy="-14" r="2.8" fill="#c00"/>`;
    s += curve('M6,-24 C14,-30 26,-28 32,-20', '#f3ead4', 2) + circ(-30, -10, 8, '#2a2a3a', { stroke: '#f3ead4', sw: 1 }) + circ(-30, -2, 4, GOLD);
    return s + '</g>';
  }

  function horseHead(o, st, hx, hy, hs) {
    // Hayagriva: a white horse head with a flowing gold-edged mane and a crown
    const t = st.t || 0, open = clamp(st.open || 0) * 6, sway = Math.sin(t * 1.3) * 3;
    let s = `<g transform="translate(${f1(hx - 4)} ${f1(hy + 6)}) scale(${hs * 1.15})">`;
    s += path(`M-36,-20 C-60,10 ${-70 + sway},50 ${-58 + sway},80 C-40,60 -30,30 -16,10Z`, '#1d2a6a', { sw: 1.3 });
    s += path(`M-30,-30 C-10,-56 30,-46 50,-10 L84,20 C92,28 88,40 78,${f1(42 + open)} L64,${f1(44 + open)} C54,40 40,36 30,40 C10,50 -10,48 -20,30 C-34,10 -38,-10 -30,-30Z`, '#f3ead4', { sw: 1.6 });
    s += path(`M64,${f1(36 + open)} C72,${f1(40 + open)} 80,${f1(40 + open)} 84,${f1(34 + open)}`, 'none', { sw: 1.2 });
    s += `<ellipse cx="22" cy="-12" rx="8" ry="5" fill="#fff" stroke="${LINE}" stroke-width="1.2"/><circle cx="25" cy="-12" r="3" fill="${LINE}"/>`;
    s += curve('M8,-20 C18,-26 30,-22 34,-16', LINE, 2.2) + curve('M76,26 C79,24 82,25 83,28', LINE, 1.4);
    s += path('M-10,-44 L-2,-70 L8,-46Z', '#f3ead4', { sw: 1.3 });
    for (let i = 0; i < 6; i++) s += curve(`M${-24 + i * 6},${-36 + i * 2} C${-40 + i * 4},${-10 + i * 6} ${-46 + i * 4 + sway},${20 + i * 8} ${-40 + i * 4 + sway},${50 + i * 4}`, GOLD, 1.6, { op: 0.9 });
    s += `<g transform="translate(-4 -30) scale(0.9)">${crown({ crown: 'mukut' }, t)}</g>`;
    s += '</g>';
    return s;
  }

  // ---------------------------------------------------------------- CAST ----
  const BLUE = '#3b66c4', SHIVA = '#9cc6e8', GOLDSKIN = '#f0b860', FAIR = '#f2c9a0', TAN = '#d9a072', ASURA = '#26346b';
  const CAST = {
    vishnu:  { name: 'विष्णु', skin: BLUE, crown: 'kirit', arms: 4, upper: 'vishnu', dhoti: '#f2c230', scarf: '#e86a8c', garland: true, halo: true, tilak: 'vaishnav', item: 'padma', itemFar: 'gada', thread: true, seed: 1 },
    hayagriva: { name: 'हयग्रीव', skin: BLUE, headKind: 'horse', arms: 4, upper: 'vishnu', dhoti: '#f2c230', scarf: '#e86a8c', garland: true, halo: true, item: 'gada', build: 'large', seed: 2 },
    brahma:  { name: 'ब्रह्मा', skin: GOLDSKIN, crown: 'brahma', heads: 4, arms: 4, upper: 'brahma', beard: 'long', beardCol: '#f4efe2', mustache: true, dhoti: '#e9e2cc', dhotiDots: '#c8372d', scarf: '#c8372d', thread: true, halo: '#f6e7a6', item: 'mala', seed: 3, hair: '#f4efe2' },
    shiva:   { name: 'शिव', skin: SHIVA, crown: 'jata', thirdEye: true, tilak: 'tripundra', arms: 2, dhoti: '#f2c230', dhotiMotif: 'flower', dhotiDots: '#fbf4e2', scarf: '#f2c230', snake: true, necklace: false, hair: '#2a1a12', item: 'trishul', halo: '#cfe6f6', earring: 'makara', seed: 4, ganga: true },
    rudra:   { name: 'रुद्र', skin: '#c9533a', crown: 'jata', thirdEye: true, tilak: 'tripundra', dhoti: '#3a2a20', dhotiMotif: 'star', dhotiDots: '#f2a516', scarf: '#f29a1e', snake: true, necklace: false, hair: '#5a1a10', item: 'trishul', seed: 5 },
    ardha:   { name: 'अर्धनारीश्वर', split: ['shiva', 'devi'], halo: '#f6e7a6', seed: 4 },
    narad:   { name: 'नारद', skin: FAIR, crown: 'topknot', flower: true, dhoti: '#f29a1e', dhotiDots: '#fbf4e2', scarf: '#e8a13a', thread: true, tilak: 'vaishnav', item: null, itemFar: null, mustache: false, seed: 6, prop: { name: 'veena', x: 30, y: 70, rot: -38 } },
    kumara:  { name: 'कुमार', skin: FAIR, crown: 'topknot', build: 'child', dhoti: '#fbf3df', dhotiDots: '#e0a92a', scarf: null, necklace: true, seed: 7 },
    madhu:   { name: 'मधु', skin: ASURA, lineCol: '#f3ead4', crown: 'asura', horns: true, fangs: true, mustache: true, beardCol: '#f2c230', build: 'large', dhoti: '#c8372d', dhotiMotif: 'stripe', dhotiDots: '#1b1b3a', scarf: null, eyeWhite: '#f6d24a', iris: '#8a0f1a', lips: '#c2366d', item: 'gada', seed: 8 },
    kaitabh: { name: 'कैटभ', skin: '#3d2a5c', lineCol: '#f3ead4', crown: 'asura', hair: '#e8713a', fangs: true, mustache: true, beardCol: '#e8713a', build: 'large', dhoti: '#2e8a57', dhotiMotif: 'stripe', dhotiDots: '#1b1b3a', scarf: null, eyeWhite: '#f6d24a', iris: '#8a0f1a', lips: '#c2366d', item: 'sword', seed: 9 },
    devi:    { name: 'देवी', skin: '#f0b88a', female: true, crown: 'devi', arms: 4, upper: 'devi', odhni: '#c8372d', skirt: '#e0472a', choli: '#2e8a57', halo: true, noseRing: true, tilak: 'bindi', item: 'padma', seed: 10 },
    shatarupa: { name: 'शतरूपा', skin: FAIR, female: true, crown: 'veil', odhni: '#e86a8c', skirt: '#f2a516', choli: '#3d6fc4', noseRing: true, tilak: 'bindi', seed: 11 },
    manu:    { name: 'मनु', skin: TAN, crown: 'turban', turban: '#2e8a57', mustache: true, dhoti: '#fbf3df', dhotiDots: '#c8372d', torso: null, seed: 12 },
    dharma:  { name: 'धर्म', creature: 'bull' },
    daksha:  { name: 'दक्ष', skin: FAIR, crown: 'turban', turban: '#c8372d', mustache: true, beard: 'short', dhoti: '#f2a516', torso: '#7a2a5a', seed: 13 },
    rishi:   { name: 'ऋषि', skin: TAN, crown: 'rishi', beard: 'long', beardCol: '#e9e4d8', hair: '#e9e4d8', mustache: true, dhoti: '#f29a1e', scarf: null, thread: true, tilak: 'tripundra', item: 'mala', seed: 14 },
    ketaki:  { name: 'केतकी', creature: 'ketaki' },
    nidra:   { name: 'योगनिद्रा', skin: '#2a3570', female: true, crown: 'devi', lineCol: '#e9e2ff', odhni: '#141d45', skirt: '#1c2a5e', skirtDots: '#fdf6dc', skirtMotif: 'star', choli: '#5a69ab', noseRing: true, halo: '#5a69ab', eyesClosed: false, seed: 15 },
    sati:    { name: 'सती', skin: FAIR, female: true, crown: 'veil', odhni: '#c8372d', skirt: '#f2a516', choli: '#2e8a57', noseRing: true, tilak: 'bindi', seed: 16 },
    parvati: { name: 'पार्वती', skin: '#f0b88a', female: true, crown: 'devi', odhni: '#2e8a57', skirt: '#c8372d', choli: '#f2a516', noseRing: true, tilak: 'bindi', halo: true, seed: 17 },
    lakshmi: { name: 'लक्ष्मी', skin: '#f3c79a', female: true, crown: 'devi', odhni: '#c2366d', skirt: '#c8372d', skirtMotif: 'flower', choli: '#f2a516', noseRing: true, tilak: 'bindi', halo: true, item: 'padma', seed: 18 },
    indra:   { name: 'इंद्र', skin: '#f0c08a', crown: 'indra', mustache: true, dhoti: '#f2c230', torso: null, scarf: '#3d6fc4', halo: '#f6e7a6', item: 'sword', seed: 19 },
    agni:    { name: 'अग्नि', skin: '#e2582a', crown: 'asura', hair: '#f29a1e', mustache: true, beardCol: '#f6d24a', dhoti: '#c8372d', scarf: '#f29a1e', lineCol: '#fff3c0', seed: 20 },
    kama:    { name: 'कामदेव', skin: '#5a8ae0', crown: 'mukut', dhoti: '#e86a8c', scarf: '#f2c230', item: 'bow', garland: '#e8505a', seed: 21 },
    chandra: { name: 'चंद्र', skin: '#e9eef8', crown: 'mukut', dhoti: '#dfe6f4', dhotiDots: '#7d8fb8', scarf: '#bcd0ff', halo: '#dfe8f6', garland: '#f4f0e0', moonCrest: true, seed: 23 },
    rohini:  { name: 'रोहिणी', skin: '#f0b88a', female: true, crown: 'veil', odhni: '#d8402a', skirt: '#c8372d', skirtMotif: 'flower', choli: '#f2a516', noseRing: true, tilak: 'bindi', seed: 24 },
    nakshatra: { name: 'नक्षत्र', skin: '#f3c79a', female: true, crown: 'veil', odhni: '#2c3c80', skirt: '#1c2a5e', skirtDots: '#fdf6dc', skirtMotif: 'star', choli: '#5a69ab', noseRing: true, tilak: 'bindi', seed: 25 },
    prasuti: { name: 'प्रसूति', skin: FAIR, female: true, crown: 'veil', odhni: '#7a2a5a', skirt: '#c8372d', choli: '#2e8a57', noseRing: true, tilak: 'bindi', seed: 26 },
    dadhichi: { name: 'दधीचि', skin: '#c98f62', crown: 'rishi', beard: 'long', beardCol: '#f4efe2', hair: '#f4efe2', mustache: true, dhoti: '#e8641e', scarf: null, thread: true, tilak: 'tripundra', item: 'kamandal', seed: 27 },
    bhrigu:  { name: 'भृगु', skin: TAN, crown: 'rishi', beard: 'long', beardCol: '#9a9a9a', hair: '#9a9a9a', mustache: true, dhoti: '#fbf3df', scarf: null, thread: true, tilak: 'vaishnav', item: 'mala', seed: 28 },
    veerabhadra: { name: 'वीरभद्र', skin: '#34304e', lineCol: '#f6c9a0', crown: 'jata', hair: '#8a1a10', thirdEye: true, fangs: true, mustache: true, beardCol: '#8a1a10', build: 'large', arms: 4, upper: 'devi', dhoti: '#c8372d', dhotiMotif: 'stripe', dhotiDots: '#f2a516', scarf: '#e8641e', snake: true, necklace: false, eyeWhite: '#f6d24a', iris: '#c00', lips: '#8a0f1a', item: 'trishul', seed: 29 },
    daksharam: { name: 'दक्ष', skin: FAIR, headKind: 'ram', hair: '#efe3c8', turban: '#c8372d', dhoti: '#f2a516', torso: '#7a2a5a', seed: 30 },
    gana:    { name: 'गण', skin: '#5a3a6a', lineCol: '#f3ead4', crown: 'asura', hair: '#e8713a', fangs: true, build: 'large', dhoti: '#2a2a2a', dhotiMotif: 'stripe', dhotiDots: '#e8713a', scarf: null, eyeWhite: '#f6d24a', iris: '#8a0f1a', item: 'gada', seed: 31 },
    vaivasvat: { name: 'वैवस्वत मनु', skin: '#e8b07a', crown: 'mukut', mustache: true, dhoti: '#f2a516', dhotiMotif: 'flower', scarf: '#c8372d', torso: null, garland: '#e8505a', halo: '#f6c24a', seed: 32 },
    hiranyaksha: { name: 'हिरण्याक्ष', skin: '#3a2a50', lineCol: '#f3ead4', crown: 'asura', horns: true, fangs: true, mustache: true, beardCol: '#f2c230', build: 'large', dhoti: '#f2c230', dhotiMotif: 'stripe', dhotiDots: '#1b1b3a', scarf: null, eyeWhite: '#f6d24a', iris: '#f2c230', lips: '#c2366d', item: 'gada', seed: 33 },
    hiranyakashipu: { name: 'हिरण्यकशिपु', skin: '#2a3a5a', lineCol: '#f3ead4', crown: 'kirit', fangs: true, mustache: true, beardCol: '#f2c230', build: 'large', dhoti: '#f2c230', dhotiMotif: 'flower', dhotiDots: '#c8372d', torso: '#f2c230', scarf: '#c8372d', eyeWhite: '#f6d24a', iris: '#8a0f1a', lips: '#c2366d', item: 'gada', garland: '#f2c230', seed: 34 },
    prahlad: { name: 'प्रह्लाद', skin: '#e8b07a', crown: 'topknot', build: 'child', dhoti: '#f2c230', dhotiDots: '#c8372d', scarf: null, tilak: 'vaishnav', necklace: true, seed: 35 },
    holika:  { name: 'होलिका', skin: '#3d2a5c', lineCol: '#f3ead4', female: true, crown: 'veil', odhni: '#c8641e', skirt: '#2a2a4a', skirtMotif: 'star', choli: '#c8372d', fangs: true, noseRing: true, seed: 36 },
    narasimha: { name: 'नृसिंह', skin: '#e8a040', headKind: 'lion', hair: '#c8641e', arms: 4, upper: 'vishnu', dhoti: '#c8372d', dhotiMotif: 'flower', scarf: '#f2c230', garland: '#e8505a', halo: '#ffd27a', build: 'large', item: null, seed: 37 },
    asuraguard: { name: 'सैनिक', skin: '#4a3a5a', lineCol: '#f3ead4', crown: 'turban', turban: '#2a2a2a', mustache: true, fangs: true, dhoti: '#5a2a2a', scarf: null, item: 'sword', seed: 38 },
    jaya:    { name: 'जय', skin: '#4a76c8', crown: 'mukut', mustache: true, dhoti: '#f2c230', dhotiMotif: 'stripe', dhotiDots: '#c8372d', torso: null, scarf: '#e86a8c', item: 'gada', seed: 39 },
    vijaya:  { name: 'विजय', skin: '#3a64b0', crown: 'mukut', mustache: true, dhoti: '#e8713a', dhotiMotif: 'stripe', dhotiDots: '#2e8a57', torso: null, scarf: '#f2c230', item: 'gada', seed: 40 },
    diti:    { name: 'दिति', skin: '#c98f62', female: true, crown: 'veil', odhni: '#4a1a3a', skirt: '#2a1a3a', skirtMotif: 'star', choli: '#8a2a2a', noseRing: true, tilak: 'bindi', seed: 41 },
    vajranga: { name: 'वज्रांग', skin: '#5a5a7a', lineCol: '#f3ead4', crown: 'kirit', mustache: true, beardCol: '#f2c230', build: 'large', dhoti: '#8a8aa0', dhotiMotif: 'stripe', dhotiDots: '#f2c230', scarf: '#c8372d', item: 'sword', seed: 42 },
    taraka:  { name: 'तारकासुर', skin: '#1e3a3a', lineCol: '#f3ead4', crown: 'asura', hair: '#2ad0a0', horns: true, fangs: true, mustache: true, beardCol: '#2ad0a0', build: 'large', arms: 4, upper: 'devi', dhoti: '#5a1a5a', dhotiMotif: 'star', dhotiDots: '#2ad0a0', scarf: '#2a8a6a', eyeWhite: '#f6d24a', iris: '#8a0f1a', lips: '#c2366d', item: 'sword', seed: 43 },
    rati:    { name: 'रति', skin: '#f3c79a', female: true, crown: 'devi', odhni: '#e86a8c', skirt: '#f2a516', skirtMotif: 'flower', choli: '#c2366d', noseRing: true, tilak: 'bindi', seed: 44 },
    maina:   { name: 'मैना', skin: FAIR, female: true, crown: 'veil', odhni: '#e8e2cc', skirt: '#2e8a57', choli: '#c8372d', noseRing: true, tilak: 'bindi', seed: 45 },
    himavan: { name: 'हिमवान', skin: '#f0d0b0', crown: 'mukut', mustache: true, beard: 'long', beardCol: '#f4efe2', dhoti: '#dfe7f0', dhotiDots: '#3d6fc4', scarf: '#3d6fc4', seed: 46 },
    kartikeya: { name: 'कार्तिकेय', skin: '#f0b070', crown: 'mukut', heads: 6, build: 'child', dhoti: '#c8372d', dhotiMotif: 'flower', scarf: '#2e8a57', halo: '#ffd27a', necklace: true, item: 'trishul', seed: 47 },
    krittika: { name: 'कृत्तिका', skin: '#f3c79a', female: true, crown: 'veil', odhni: '#5a69ab', skirt: '#2c3c80', skirtDots: '#fdf6dc', skirtMotif: 'star', choli: '#e8a13a', noseRing: true, seed: 48 },
    durvasa: { name: 'दुर्वासा', skin: '#b5704a', crown: 'rishi', beard: 'long', beardCol: '#d9d2c0', hair: '#d9d2c0', mustache: true, dhoti: '#c8372d', scarf: null, thread: true, tilak: 'tripundra', item: 'kamandal', seed: 49 },
    bali:    { name: 'बलि', skin: '#3a4a7a', lineCol: '#f3ead4', crown: 'kirit', mustache: true, build: 'large', dhoti: '#f2a516', dhotiMotif: 'flower', dhotiDots: '#c8372d', scarf: '#2e8a57', garland: true, halo: '#c9b8ff', item: 'gada', seed: 50 },
    mohini:  { name: 'मोहिनी', skin: '#f6cfa4', female: true, crown: 'devi', odhni: '#e86a8c', skirt: '#3b66c4', skirtMotif: 'flower', skirtDots: '#f2c230', choli: '#f2c230', noseRing: true, tilak: 'bindi', halo: '#ffd0e0', item: 'kalash', seed: 51 },
    swarbhanu: { name: 'स्वरभानु', skin: '#2a2a3a', lineCol: '#f3ead4', crown: 'asura', hair: '#5a2a6a', fangs: true, mustache: true, beardCol: '#5a2a6a', dhoti: '#4a1a2a', dhotiMotif: 'stripe', dhotiDots: '#c8372d', scarf: null, eyeWhite: '#f6d24a', iris: '#8a0f1a', lips: '#c2366d', seed: 52 },
    surya:   { name: 'सूर्य', skin: '#f2a840', crown: 'kirit', mustache: true, dhoti: '#c8372d', dhotiMotif: 'flower', scarf: '#f2c230', halo: '#ff9a2a', item: 'padma', seed: 53 },
    dhanvantari: { name: 'धन्वंतरि', skin: '#4a76c8', crown: 'mukut', dhoti: '#f2c230', scarf: '#2e8a57', halo: '#bfe7a0', arms: 4, upper: 'vishnu', item: 'kalash', seed: 54 },
    bhasmasur: { name: 'भस्मासुर', skin: '#4a2a2a', lineCol: '#f3ead4', crown: 'asura', hair: '#2a2a2a', horns: true, fangs: true, mustache: true, beardCol: '#2a2a2a', build: 'large', dhoti: '#6a6a6a', dhotiMotif: 'stripe', dhotiDots: '#2a2a2a', scarf: null, eyeWhite: '#f6d24a', iris: '#8a0f1a', lips: '#c2366d', seed: 55 },
    asura2:  { name: 'असुर', skin: '#4a2a5a', lineCol: '#f3ead4', crown: 'asura', hair: '#c8372d', fangs: true, mustache: true, build: 'large', dhoti: '#2a4a2a', dhotiMotif: 'stripe', dhotiDots: '#f2c230', scarf: null, eyeWhite: '#f6d24a', iris: '#8a0f1a', item: 'sword', seed: 56 },
    ganesha: { name: 'गणेश', skin: '#e9a27a', headKind: 'elephant', build: 'child', dhoti: '#f2c230', dhotiMotif: 'flower', scarf: '#c8372d', necklace: true, thread: true, item: 'lotus', halo: true, seed: 57 },
    ganeshboy: { name: 'गणेश', skin: '#f2c070', crown: 'topknot', build: 'child', dhoti: '#f2c230', dhotiDots: '#c8372d', scarf: null, necklace: true, item: 'gada', seed: 58 },
    durga:   { name: 'दुर्गा', skin: '#f2b860', female: true, dhoti: '#c8372d', crown: 'devi', arms: 10, upper: 'devi', odhni: '#c8372d', skirt: '#c8372d', skirtMotif: 'flower', skirtDots: '#f2c230', choli: '#2e8a57', noseRing: true, tilak: 'bindi', halo: '#ffd27a', item: 'trishul', itemFar: 'chakra', seed: 59 },
    kali:    { name: 'काली', skin: '#1e2a5a', tongue: true, lineCol: '#e9e2ff', female: true, crown: 'asura', hair: '#0a0a1a', arms: 4, upper: 'devi', odhni: false, skirt: '#2a1a1a', skirtMotif: 'star', skirtDots: '#efe6cf', choli: '#8a0f1a', fangs: true, eyeWhite: '#f6d24a', iris: '#c00', lips: '#c00', thirdEye: true, item: 'sword', halo: '#8a0f1a', seed: 60 },
    mahishasura: { name: 'महिषासुर', skin: '#2a2a3a', lineCol: '#f3ead4', headKind: 'buffalo', hair: '#2a2a3a', build: 'large', dhoti: '#8a0f1a', dhotiMotif: 'stripe', dhotiDots: '#f2c230', scarf: null, item: 'sword', seed: 61 },
    shumbha: { name: 'शुंभ', skin: '#3a2a4a', lineCol: '#f3ead4', crown: 'kirit', fangs: true, mustache: true, beardCol: '#f2c230', build: 'large', dhoti: '#c8372d', dhotiMotif: 'stripe', dhotiDots: '#f2c230', scarf: '#2a2a2a', eyeWhite: '#f6d24a', iris: '#8a0f1a', item: 'sword', seed: 62 },
    nishumbha: { name: 'निशुंभ', skin: '#2a3a4a', lineCol: '#f3ead4', crown: 'kirit', fangs: true, mustache: true, beardCol: '#c8372d', build: 'large', dhoti: '#2e8a57', dhotiMotif: 'stripe', dhotiDots: '#c8372d', scarf: '#2a2a2a', eyeWhite: '#f6d24a', iris: '#8a0f1a', item: 'gada', seed: 63 },
    raktabeej: { name: 'रक्तबीज', skin: '#6a1a1a', lineCol: '#f3ead4', crown: 'asura', hair: '#2a0a0a', fangs: true, mustache: true, build: 'large', dhoti: '#2a0a0a', dhotiMotif: 'star', dhotiDots: '#c8372d', scarf: null, eyeWhite: '#f6d24a', iris: '#2a0a0a', item: 'sword', seed: 64 },
    kashyap: { name: 'कश्यप', skin: '#d9a072', crown: 'rishi', beard: 'long', beardCol: '#f4efe2', hair: '#f4efe2', mustache: true, dhoti: '#f2a516', scarf: null, thread: true, tilak: 'tripundra', item: 'mala', seed: 65 },
    aditi:   { name: 'अदिति', skin: '#f0c49a', female: true, crown: 'veil', odhni: '#f2a516', skirt: '#2e8a57', skirtMotif: 'flower', choli: '#c8372d', noseRing: true, tilak: 'bindi', halo: '#f6e7a6', seed: 66 },
    vamana:  { name: 'वामन', skin: BLUE, crown: 'topknot', build: 'child', dhoti: '#f2c230', dhotiDots: '#c8372d', scarf: '#e86a8c', thread: true, tilak: 'vaishnav', necklace: true, halo: true, item: 'chhatra', seed: 67 },
    trivikram: { name: 'त्रिविक्रम', skin: BLUE, crown: 'kirit', arms: 4, upper: 'vishnu', dhoti: '#f2c230', scarf: '#e86a8c', garland: true, halo: true, tilak: 'vaishnav', item: 'padma', itemFar: 'gada', thread: true, seed: 68 },
    shukra:  { name: 'शुक्राचार्य', skin: '#8a6a9a', lineCol: '#f3ead4', crown: 'rishi', beard: 'long', beardCol: '#f4efe2', hair: '#f4efe2', mustache: true, dhoti: '#f4efe2', dhotiDots: '#8a0f1a', scarf: '#8a0f1a', thread: true, tilak: 'tripundra', item: 'kamandal', eyeWhite: '#f6d24a', seed: 69 },
    kaushik: { name: 'कौशिक', skin: '#d99a62', crown: 'kirit', mustache: true, beard: 'short', build: 'large', dhoti: '#c8372d', dhotiMotif: 'flower', dhotiDots: '#f2c230', scarf: '#f2a516', necklace: true, item: 'sword', seed: 70 },
    vishwamitra: { name: 'विश्वामित्र', skin: '#c47a4a', crown: 'rishi', beard: 'long', beardCol: '#5a4a3a', hair: '#3a2a1a', mustache: true, dhoti: '#e8641e', scarf: null, thread: true, tilak: 'tripundra', item: 'mala', seed: 71 },
    vasishtha: { name: 'वसिष्ठ', skin: '#e0b48a', crown: 'rishi', beard: 'long', beardCol: '#fbf8f0', hair: '#fbf8f0', mustache: true, dhoti: '#f6efe0', dhotiDots: '#f29a1e', scarf: '#f29a1e', thread: true, tilak: 'vaishnav', item: 'kamandal', halo: '#fff3c0', seed: 72 },
    saraswati: { name: 'सरस्वती', skin: '#f6dcc0', female: true, crown: 'devi', odhni: '#f6f2e8', skirt: '#eef2f8', skirtMotif: 'flower', skirtDots: '#3d6fc4', choli: '#3d6fc4', noseRing: true, tilak: 'bindi', halo: '#dfe7ff', item: 'veena', seed: 73 },
    trayaruni: { name: 'त्रय्यारुणि', skin: '#e8b88a', crown: 'mukut', mustache: true, beard: 'long', beardCol: '#e9e4d8', dhoti: '#f2a516', dhotiMotif: 'flower', scarf: '#c8372d', necklace: true, garland: true, seed: 74 },
    satyavrat: { name: 'सत्यव्रत', skin: '#c48a5a', crown: 'turban', turban: '#6a5a4a', mustache: true, dhoti: '#8a7a6a', dhotiDots: '#4a3a2a', scarf: '#5a4a3a', seed: 75 },
    trishanku: { name: 'त्रिशंकु', skin: '#c48a5a', crown: 'mukut', mustache: true, beard: 'short', dhoti: '#f2c230', dhotiMotif: 'flower', scarf: '#c8372d', necklace: true, garland: true, seed: 76 },
    gramin:  { name: 'स्त्री', skin: '#b5784a', female: true, crown: 'veil', odhni: '#8a5a3a', skirt: '#5a3a2a', skirtMotif: 'dot', choli: '#8a2a1a', noseRing: true, seed: 77 },
    ganga:   { name: 'गंगा', skin: '#f2dcc8', female: true, crown: 'devi', odhni: '#9fd0e8', skirt: '#dff1f8', skirtMotif: 'flower', skirtDots: '#3d8fc4', choli: '#3d8fc4', noseRing: true, tilak: 'bindi', halo: '#d8f0ff', item: 'kalash', seed: 78 },
    subahu:  { name: 'सुबाहु', skin: '#d0a070', crown: 'mukut', mustache: true, dhoti: '#8a6a4a', dhotiDots: '#4a3a2a', scarf: '#6a4a3a', necklace: true, seed: 79 },
    yadavi:  { name: 'यादवी', skin: '#e8b88a', female: true, crown: 'veil', odhni: '#e8e2cc', skirt: '#c8372d', skirtMotif: 'flower', choli: '#f2a516', noseRing: true, tilak: 'bindi', seed: 80 },
    aurva:   { name: 'और्व', skin: '#a8683a', crown: 'rishi', beard: 'long', beardCol: '#8a7a6a', hair: '#4a3a2a', mustache: true, dhoti: '#e8641e', scarf: null, thread: true, tilak: 'tripundra', item: 'kamandal', seed: 81 },
    sagar:   { name: 'सगर', skin: '#e0a870', crown: 'kirit', mustache: true, beard: 'short', build: 'large', dhoti: '#f2c230', dhotiMotif: 'flower', dhotiDots: '#c8372d', scarf: '#c8372d', necklace: true, garland: true, halo: '#ffe08a', seed: 82 },
    anshuman: { name: 'अंशुमान', skin: '#e8b07a', crown: 'mukut', dhoti: '#2e8a57', dhotiDots: '#f2c230', scarf: '#f2a516', necklace: true, seed: 83 },
    sagarputra: { name: 'राजकुमार', skin: '#d8a070', crown: 'turban', turban: '#c8372d', mustache: true, dhoti: '#f2a516', dhotiDots: '#c8372d', scarf: '#2e8a57', necklace: true, item: 'sword', seed: 84 },
    kapil:   { name: 'कपिल', skin: '#5a7ab8', crown: 'rishi', beard: 'long', beardCol: '#f4efe2', hair: '#f4efe2', mustache: true, dhoti: '#f2c230', scarf: null, thread: true, tilak: 'vaishnav', halo: '#bcd8ff', seed: 85 },
    bhagirath: { name: 'भगीरथ', skin: '#c88a5a', crown: 'rishi', beard: 'long', beardCol: '#3a2a1a', hair: '#2a1a0a', mustache: true, dhoti: '#f2a516', dhotiDots: '#c8372d', scarf: '#c8372d', thread: true, tilak: 'tripundra', necklace: true, seed: 86 },
    jamadagni: { name: 'जमदग्नि', skin: '#b87a4a', crown: 'rishi', beard: 'long', beardCol: '#cfc6b2', hair: '#cfc6b2', mustache: true, dhoti: '#c8372d', scarf: null, thread: true, tilak: 'tripundra', item: 'kamandal', eyeWhite: '#fff', seed: 87 },
    renuka:  { name: 'रेणुका', skin: '#e0a878', female: true, crown: 'veil', odhni: '#f2a516', skirt: '#2e8a57', skirtMotif: 'flower', choli: '#c8372d', noseRing: true, tilak: 'bindi', item: 'kalash', seed: 88 },
    parashuram: { name: 'परशुराम', skin: BLUE, crown: 'jata', hair: '#2a1a0a', beard: 'short', beardCol: '#1a1a3a', mustache: true, build: 'large', dhoti: '#e8641e', dhotiMotif: 'stripe', dhotiDots: '#8a2a0a', scarf: null, thread: true, tilak: 'vaishnav', necklace: true, item: 'parashu', seed: 89 },
    rishiputra: { name: 'ऋषिपुत्र', skin: '#c8905a', crown: 'topknot', dhoti: '#f29a1e', dhotiDots: '#c8372d', scarf: null, thread: true, seed: 90 },
    kartavirya: { name: 'कार्तवीर्य', skin: '#c8905a', crown: 'kirit', mustache: true, beard: 'short', build: 'large', arms: 10, upper: 'devi', dhoti: '#5a1a3a', dhotiMotif: 'flower', dhotiDots: '#f2c230', scarf: '#f2c230', necklace: true, halo: '#ffd27a', item: 'bow', itemFar: 'chakra', seed: 91 },
    gandharva: { name: 'गंधर्व', skin: '#f2c49a', crown: 'mukut', dhoti: '#3d6fc4', dhotiDots: '#f2c230', scarf: '#e86a8c', necklace: true, garland: true, item: 'veena', seed: 92 },
    vishrava: { name: 'विश्रवा', skin: '#d8a070', crown: 'rishi', beard: 'long', beardCol: '#e9e4d8', hair: '#e9e4d8', mustache: true, dhoti: '#f29a1e', scarf: null, thread: true, tilak: 'tripundra', item: 'mala', seed: 93 },
    kaikasi: { name: 'कैकसी', skin: '#5a3a6a', lineCol: '#f3ead4', female: true, crown: 'veil', odhni: '#8a0f1a', skirt: '#2a1a3a', skirtMotif: 'star', skirtDots: '#f2c230', choli: '#c8372d', fangs: true, noseRing: true, eyeWhite: '#f6d24a', seed: 94 },
    kuber:   { name: 'कुबेर', skin: '#f2c070', crown: 'kirit', mustache: true, build: 'large', dhoti: '#f2c230', dhotiMotif: 'flower', dhotiDots: '#c8372d', scarf: '#2e8a57', necklace: true, garland: true, halo: '#ffe08a', item: 'kalash', seed: 95 },
    ravana:  { name: 'रावण', skin: '#3a5a8a', lineCol: '#f3ead4', crown: 'kirit', heads: 10, mustache: true, beard: 'short', beardCol: '#1a1a2a', build: 'large', arms: 4, upper: 'devi', dhoti: '#c8372d', dhotiMotif: 'flower', dhotiDots: '#f2c230', scarf: '#f2a516', necklace: true, garland: true, eyeWhite: '#f6d24a', iris: '#8a0f1a', item: 'sword', seed: 96 },
    kumbhakarna: { name: 'कुंभकर्ण', skin: '#4a3a5a', lineCol: '#f3ead4', crown: 'asura', hair: '#2a1a1a', fangs: true, mustache: true, build: 'large', dhoti: '#2e5a3a', dhotiMotif: 'stripe', dhotiDots: '#f2c230', scarf: null, necklace: true, eyeWhite: '#f6d24a', item: 'gada', seed: 97 },
    vibhishana: { name: 'विभीषण', skin: '#4a5a7a', lineCol: '#f3ead4', crown: 'mukut', mustache: true, dhoti: '#f6efe0', dhotiDots: '#3d6fc4', scarf: '#3d6fc4', thread: true, tilak: 'vaishnav', necklace: true, seed: 98 },
    varuna:  { name: 'वरुण', skin: '#5a8ab8', crown: 'mukut', mustache: true, dhoti: '#dff1f8', dhotiDots: '#3d6fc4', scarf: '#2e8a8a', necklace: true, halo: '#cfe6ff', item: 'shankh', seed: 99 },
    vayu:    { name: 'वायु', skin: '#cfe0e8', crown: 'mukut', mustache: true, dhoti: '#f6f2e8', dhotiDots: '#8aa0b8', scarf: '#8aa0b8', necklace: true, halo: '#eef4ff', seed: 100 },
    yamaraj: { name: 'यम', skin: '#2a3a4a', lineCol: '#f3ead4', crown: 'kirit', mustache: true, build: 'large', dhoti: '#c8372d', dhotiMotif: 'stripe', dhotiDots: '#1a1a1a', scarf: '#2a2a2a', necklace: true, item: 'gada', seed: 101 },
    rama:    { name: 'राम', skin: BLUE, crown: 'jata', hair: '#1a1a2a', dhoti: '#f2a516', dhotiDots: '#8a2a0a', scarf: null, thread: true, tilak: 'vaishnav', necklace: true, item: 'bow', seed: 102 },
    lakshmana: { name: 'लक्ष्मण', skin: '#f0c49a', crown: 'jata', hair: '#1a1a2a', dhoti: '#e8641e', dhotiDots: '#8a2a0a', scarf: null, thread: true, tilak: 'vaishnav', necklace: true, item: 'bow', seed: 103 },
    sita:    { name: 'सीता', skin: '#f3c79a', female: true, crown: 'veil', odhni: '#f2a516', skirt: '#c8372d', skirtMotif: 'flower', choli: '#2e8a57', noseRing: true, tilak: 'bindi', seed: 104 },
    mayasita: { name: 'माया सीता', skin: '#d8b8c8', female: true, crown: 'veil', odhni: '#b8a0c8', skirt: '#7a5a8a', skirtMotif: 'star', skirtDots: '#e9e2ff', choli: '#5a3a6a', noseRing: true, tilak: 'bindi', seed: 105 },
    phalgu:  { name: 'फल्गु', skin: '#e8c8a8', female: true, crown: 'devi', odhni: '#a8c8d8', skirt: '#c8d8e0', skirtMotif: 'flower', skirtDots: '#5a8ab8', choli: '#5a8ab8', noseRing: true, seed: 106 },
    vasudev: { name: 'वसुदेव', skin: '#d8a070', crown: 'turban', turban: '#f2a516', mustache: true, beard: 'short', dhoti: '#f6efe0', dhotiDots: '#c8372d', scarf: '#c8372d', necklace: true, seed: 107 },
    devaki:  { name: 'देवकी', skin: '#f0c49a', female: true, crown: 'veil', odhni: '#c8372d', skirt: '#2e5a8a', skirtMotif: 'flower', choli: '#f2a516', noseRing: true, tilak: 'bindi', seed: 108 },
    kansa:   { name: 'कंस', skin: '#b87a4a', crown: 'kirit', mustache: true, beard: 'short', beardCol: '#1a1a1a', build: 'large', dhoti: '#2a1a3a', dhotiMotif: 'stripe', dhotiDots: '#c8372d', scarf: '#8a0f1a', necklace: true, eyeWhite: '#f6d24a', iris: '#8a0f1a', item: 'sword', seed: 109 },
    yogamaya: { name: 'योगमाया', skin: '#f2b860', female: true, dhoti: '#c8372d', crown: 'devi', arms: 10, upper: 'devi', odhni: '#e8641e', skirt: '#e8641e', skirtMotif: 'flower', skirtDots: '#f2c230', choli: '#2e8a57', noseRing: true, tilak: 'bindi', halo: '#ffe08a', item: 'trishul', itemFar: 'chakra', seed: 110 },
    krishna: { name: 'कृष्ण', skin: '#2b4fa8', crown: 'krishna', build: 'child', dhoti: '#f2c230', dhotiDots: '#c8372d', scarf: '#e86a8c', garland: true, necklace: true, tilak: 'vaishnav', item: 'flute', seed: 111 },
    yashoda: { name: 'यशोदा', skin: '#e8b07a', female: true, crown: 'veil', odhni: '#f2a516', skirt: '#2e8a57', skirtMotif: 'flower', skirtDots: '#f2c230', choli: '#c8372d', noseRing: true, tilak: 'bindi', seed: 112 },
    nand:    { name: 'नंद', skin: '#d8a070', crown: 'turban', turban: '#e8641e', mustache: true, beard: 'long', beardCol: '#e9e4d8', dhoti: '#f6efe0', dhotiDots: '#e8641e', scarf: '#f2a516', necklace: true, seed: 113 },
    balaram: { name: 'बलराम', skin: '#f6e8d0', crown: 'mukut', build: 'child', dhoti: '#3d6fc4', dhotiDots: '#f2c230', scarf: '#2e8a57', necklace: true, item: 'gada', seed: 114 },
    gopa:    { name: 'ग्वाल', skin: '#c8905a', crown: 'turban', turban: '#e8641e', build: 'child', dhoti: '#f2c230', dhotiDots: '#2e8a57', scarf: null, necklace: true, seed: 115 },
    gopa2:   { name: 'ग्वाल', skin: '#b8804a', crown: 'turban', turban: '#2e8a57', build: 'child', dhoti: '#e86a8c', dhotiDots: '#f2c230', scarf: null, necklace: true, seed: 116 },
    gopi:    { name: 'गोपी', skin: '#e8b07a', female: true, crown: 'veil', odhni: '#e86a8c', skirt: '#f2a516', skirtMotif: 'flower', choli: '#2e8a57', noseRing: true, seed: 117 },
    naagin:  { name: 'नागपत्नी', skin: '#3e7c74', lineCol: '#f3ead4', female: true, crown: 'devi', odhni: '#1e3a3a', skirt: '#2a4a4a', skirtMotif: 'star', skirtDots: '#f2c230', choli: '#5a8a3a', noseRing: true, seed: 118 },
    yamuna:  { name: 'यमुना', skin: '#3a4a7a', lineCol: '#e9e2ff', female: true, crown: 'devi', odhni: '#2a3a6a', skirt: '#3a4a8a', skirtMotif: 'flower', skirtDots: '#9fd0e8', choli: '#5a8ab8', noseRing: true, tilak: 'bindi', halo: '#9fb8e8', seed: 119 },
    // E12: Sudama, the end of the Yadus, the serpent sacrifice
    sudama:  { name: 'सुदामा', skin: '#b88058', crown: 'topknot', build: 'slim', dhoti: '#e9dfc4', dhotiDots: '#8a7a5a', scarf: '#c9b98f', thread: true, tilak: 'vaishnav', necklace: false, earring: false, seed: 121 },
    sudamapatni: { name: 'सुशीला', skin: '#c88a5a', female: true, crown: 'veil', odhni: '#b5703a', skirt: '#8a5a3a', skirtDots: '#e9dfc4', choli: '#6a4a2a', tilak: 'bindi', seed: 122 },
    sudamaputra: { name: 'पुत्र', skin: '#c08a5a', crown: 'topknot', build: 'child', dhoti: '#e9dfc4', scarf: null, earring: false, seed: 123 },
    dwarpal: { name: 'द्वारपाल', skin: '#a8703a', crown: 'turban', turban: '#c8372d', mustache: true, build: 'large', dhoti: '#2e8a57', dhotiDots: '#f2c230', scarf: '#f2c230', item: 'trishul', seed: 124 },
    krishna2: { name: 'कृष्ण', skin: '#2b4fa8', crown: 'krishna', dhoti: '#f2c230', dhotiDots: '#c8372d', scarf: '#e86a8c', garland: true, necklace: true, tilak: 'vaishnav', halo: '#f6e7a6', item: 'flute', seed: 125 },
    draupadi: { name: 'द्रौपदी', skin: '#8a5a3a', female: true, crown: 'devi', odhni: '#c8372d', skirt: '#f2a516', skirtMotif: 'flower', skirtDots: '#c8372d', choli: '#2a3a8a', noseRing: true, tilak: 'bindi', seed: 126 },
    gandhari: { name: 'गांधारी', skin: '#e8b88a', female: true, crown: 'veil', odhni: '#f4efe2', skirt: '#e9e2cc', skirtDots: '#8a0f1a', choli: '#8a0f1a', blindfold: true, seed: 127 },
    samba:   { name: 'सांब', skin: '#3a5aa8', crown: 'mukut', dhoti: '#e8641e', dhotiDots: '#f2c230', scarf: '#2e8a57', necklace: true, mustache: false, seed: 128 },
    sambastri: { name: 'सांब', skin: '#3a5aa8', female: true, crown: 'veil', odhni: '#e86a8c', skirt: '#f2c230', skirtMotif: 'flower', choli: '#2e8a57', noseRing: true, mustache: true, seed: 129 },
    yadav:   { name: 'यादव', skin: '#c8905a', crown: 'turban', turban: '#f2a516', mustache: true, dhoti: '#c8372d', dhotiDots: '#f2c230', scarf: '#3d6fc4', necklace: true, seed: 130 },
    yadav2:  { name: 'यादव', skin: '#a8703a', crown: 'turban', turban: '#3d6fc4', mustache: true, beard: 'short', dhoti: '#2e8a57', dhotiDots: '#fbf4e2', scarf: '#e8641e', necklace: true, seed: 131 },
    balarama: { name: 'बलराम', skin: '#f6e8d0', crown: 'mukut', build: 'large', mustache: true, dhoti: '#3d6fc4', dhotiDots: '#f2c230', scarf: '#2e8a57', necklace: true, garland: true, item: 'gada', seed: 132 },
    jara:    { name: 'जरा', skin: '#6a3a1e', crown: 'turban', turban: '#4a6a2a', mustache: true, dhoti: '#8a5a2a', dhotiMotif: 'stripe', dhotiDots: '#3a2a1a', scarf: null, necklace: false, earring: false, item: 'bow', seed: 133 },
    parikshit: { name: 'परीक्षित', skin: '#e0a878', crown: 'kirit', mustache: true, beard: 'long', beardCol: '#f4efe2', hair: '#f4efe2', dhoti: '#f6efe0', dhotiDots: '#c8372d', scarf: '#8a0f1a', necklace: true, seed: 134 },
    janamejay: { name: 'जनमेजय', skin: '#e0a878', crown: 'kirit', mustache: true, dhoti: '#8a0f1a', dhotiMotif: 'flower', dhotiDots: '#f2c230', scarf: '#f2c230', necklace: true, item: 'sword', seed: 135 },
    mantri:  { name: 'मंत्री', skin: '#d8a070', crown: 'turban', turban: '#f4efe2', mustache: true, beard: 'short', beardCol: '#9a9a9a', dhoti: '#f4efe2', dhotiDots: '#3d6fc4', scarf: '#3d6fc4', necklace: true, seed: 136 },
    astika:  { name: 'आस्तीक', skin: '#d8a070', crown: 'topknot', build: 'child', dhoti: '#f2a516', dhotiDots: '#c8372d', scarf: '#f2c230', thread: true, tilak: 'tripundra', halo: '#fff1b8', seed: 137 },
    daksha2: { name: 'दक्ष', skin: FAIR, crown: 'turban', turban: '#c8372d', mustache: true, beard: 'short', dhoti: '#f2a516', seed: 22 }
  };

  // ------------------------------------------------------------- CREATURES ----
  function creature(kind, st, o = {}) {
    const t = st.t || 0;
    let s = '';
    if (kind === 'swan') {   // hamsa: Brahma's swan form
      const flap = Math.sin(t * (st.fly ? 9 : 2)) * (st.fly ? 26 : 4);
      s += path(`M-60,0 C-70,-20 -50,-36 -20,-34 C10,-34 30,-30 40,-50 C44,-70 36,-90 50,-100 C64,-104 72,-94 68,-84 C62,-90 54,-88 54,-78 C54,-60 50,-30 34,-10 C20,8 -30,14 -60,0Z`, '#fbf6ea', { sw: 1.6 });
      s += path('M68,-90 L86,-84 L68,-80Z', '#f29a1e', { sw: 1 }) + circ(60, -90, 2.4, LINE);
      s += `<g transform="rotate(${f1(-flap)} -10 -30)">` + path('M-10,-30 C-40,-80 -90,-96 -120,-88 C-96,-70 -70,-50 -40,-30Z', '#fbf6ea', { sw: 1.5 });
      for (let i = 0; i < 5; i++) s += curve(`M${-30 - i * 16},${-34 - i * 8} L${-50 - i * 16},${-58 - i * 6}`, '#c9c0a8', 1.2);
      s += '</g>' + curve('M-50,-10 C-20,-4 10,-6 30,-14', '#c9c0a8', 1.2);
      if (o.crowned) s += `<g transform="translate(58 -104) scale(0.4)">${crown({ crown: 'mukut' }, t)}</g>`;
    } else if (kind === 'boar') {   // Varaha
      const bob = Math.sin(t * 5) * 2;
      s += path(`M-90,-10 C-100,-50 -70,-90 -20,-94 C30,-98 70,-80 90,-50 L120,-36 C126,-30 122,-20 112,-20 L90,-16 C80,0 60,6 40,4 L-60,4 C-80,4 -90,0 -90,-10Z`, '#4a5a8a', { sw: 1.6 });
      for (let i = 0; i < 10; i++) s += curve(`M${-70 + i * 12},-86 l-6,-10`, LINE, 1.4);
      s += path('M96,-38 C104,-50 110,-58 104,-66 C112,-58 112,-46 100,-34Z', '#fbf4e2', { sw: 1 });
      s += circ(70, -62, 3, LINE) + curve('M60,-70 C66,-74 74,-72 76,-68', LINE, 1.6);
      for (const x of [-60, -30, 30, 60]) s += `<rect x="${x - 7}" y="${f1(-6 + (x > 0 ? bob : -bob))}" width="14" height="40" rx="5" fill="#3a4a76" stroke="${LINE}" stroke-width="1.3"/>`;
      s += `<g transform="translate(0 -96) scale(0.5)">${crown({ crown: 'mukut' }, t)}</g>`;
    } else if (kind === 'bull') {   // Dharma: a white bull, standing on 1-4 legs
      const legs = o.legs || 4, bob = Math.sin(t * 2) * 1;
      s += path(`M-100,-80 C-110,-120 -70,-140 -20,-136 C30,-140 70,-130 86,-110 L112,-112 C130,-112 134,-90 122,-84 L100,-74 C90,-60 60,-56 40,-56 L-60,-56 C-90,-56 -100,-66 -100,-80Z`, '#f6f0e0', { sw: 1.6 });
      s += path('M-40,-136 C-30,-160 -10,-162 0,-150 C-12,-150 -24,-146 -28,-134Z', '#f6f0e0', { sw: 1.4 });
      s += path('M96,-110 C92,-130 100,-146 112,-150 C108,-138 106,-124 106,-112Z', '#efe3c4', { sw: 1.2 });
      s += circ(112, -100, 2.6, LINE) + path('M-70,-84 C-50,-76 30,-76 60,-84 L60,-74 C30,-68 -50,-68 -70,-74Z', '#c8372d', { sw: 1 });
      for (let i = 0; i < 8; i++) s += circ(-60 + i * 16, -79, 2, GOLD);
      const lx = [-80, -56, 40, 66];
      for (let i = 0; i < 4; i++) { const on = i < legs; s += `<rect x="${lx[i] - 7}" y="${f1(-60 + bob)}" width="14" height="${on ? 60 : 22}" rx="5" fill="${on ? '#efe6d2' : '#d8cdb5'}" stroke="${LINE}" stroke-width="1.3" opacity="${on ? 1 : 0.35}"/>`; if (on) s += `<rect x="${lx[i] - 7}" y="-6" width="14" height="6" fill="${LINE}"/>`; }
      s += curve('M-100,-90 C-120,-80 -126,-50 -116,-30', LINE, 2) + circ(-116, -28, 4, '#2a1a12');
    } else if (kind === 'fish') {   // Matsya
      const sw = Math.sin(t * 4) * 10;
      s += path(`M-120,0 C-80,-50 20,-56 80,-20 C100,-8 100,8 80,20 C20,56 -80,50 -120,0Z`, '#f2a516', { sw: 1.6 });
      s += path(`M-118,0 L${-170},${f1(-40 + sw)} L${-160},0 L${-170},${f1(40 + sw)}Z`, '#e8713a', { sw: 1.4 });
      for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) s += curve(`M${-80 + i * 22},${-24 + j * 18} q8,6 0,12`, '#b5481e', 1.1);
      s += circ(64, -8, 6, '#fbf4e2', { stroke: LINE, sw: 1.2 }) + circ(66, -8, 3, LINE);
      if (o.horn) s += path('M40,-38 C46,-70 60,-96 82,-110 C72,-90 62,-66 56,-34Z', '#fbf4e2', { sw: 1.4 }) + circ(80, -108, 4, GOLD, { stroke: LINE, sw: 1 }) +
        `<g transform="translate(20 -44) scale(0.42)">${crown({ crown: 'kirit' }, t)}</g>` + curve('M-40,-40 C-20,-46 0,-46 20,-40', GOLD, 3);
    } else if (kind === 'peacock') {   // Kartikeya's mount, tail fanned
      const fan = o.fan ?? 1;
      for (let i = 0; i < 15; i++) {
        const a = -2.6 + i * (1.5 / 14), r = 70 + 90 * fan;
        s += curve(`M-20,-60 L${f1(-20 + Math.cos(a) * r)},${f1(-60 + Math.sin(a) * r)}`, '#2e6a3a', 2) +
          circ(-20 + Math.cos(a) * r, -60 + Math.sin(a) * r, 11, '#2e8a57', { stroke: LINE, sw: 0.8 }) + circ(-20 + Math.cos(a) * r, -60 + Math.sin(a) * r, 6, '#3d6fc4', { stroke: false }) + circ(-20 + Math.cos(a) * r, -60 + Math.sin(a) * r, 2.6, GOLD, { stroke: false });
      }
      s += path('M-40,-40 C-50,-70 -10,-90 20,-70 C30,-90 34,-116 46,-120 C56,-122 60,-112 54,-104 C46,-96 44,-80 40,-60 C34,-36 0,-26 -40,-40Z', '#2a5ab0', { sw: 1.5 });
      s += circ(48, -112, 2.4, LINE) + path('M56,-110 L66,-106 L56,-104Z', GOLD, { sw: 0.8 }) + curve('M46,-122 l-2,-12 M50,-122 l2,-12 M48,-122 l0,-13', '#2a5ab0', 1.2);
      s += `<rect x="-14" y="-34" width="6" height="34" fill="${GOLD_LO}"/><rect x="4" y="-34" width="6" height="34" fill="${GOLD_LO}"/>`;
    } else if (kind === 'turtle') {   // Kurma: the great tortoise under Mandara
      const bob = Math.sin(t * 1.2) * 2;
      s += path(`M-150,-10 C-150,-90 -60,-130 0,-130 C60,-130 150,-90 150,-10Z`, '#3a7a5a', { sw: 2 });
      for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) s += path(`M${-110 + i * 50},${-30 - j * 44} l22,-14 l22,14 l0,24 l-22,14 l-22,-14Z`, '#5a9a6a', { sw: 1.2 });
      s += path(`M140,-30 C170,${f1(-60 + bob)} 210,${f1(-60 + bob)} 220,${f1(-36 + bob)} C214,${f1(-16 + bob)} 180,-10 150,-14Z`, '#9ab070', { sw: 1.6 }) + circ(200, -44 + bob, 4, LINE);
      for (const x of [-110, -50, 50, 110]) s += path(`M${x - 18},-10 C${x - 22},10 ${x + 22},10 ${x + 18},-10Z`, '#9ab070', { sw: 1.3 });
      s += `<g transform="translate(196 ${f1(-66 + bob)}) scale(0.4)">${crown({ crown: 'kirit' }, t)}</g>`;
    } else if (kind === 'elephant') {   // Airavata: a white elephant with caparison
      const sw = Math.sin(t * 1.4) * 6;
      s += path('M-110,-150 C-130,-210 -60,-250 10,-246 C70,-244 110,-220 120,-170 C150,-170 170,-130 160,-90 C150,-40 ' + f1(140 + sw) + ',0 ' + f1(130 + sw) + ',30 L118,28 C126,0 130,-40 120,-70 L100,-70 C90,-60 60,-56 40,-56 L-80,-56 C-110,-60 -116,-100 -110,-150Z', '#f4f1ea', { sw: 1.8 });
      s += path('M60,-200 C40,-230 0,-226 -6,-190 C0,-150 40,-140 60,-160Z', '#e9e4d8', { sw: 1.4 }) + circ(110, -170, 4, LINE);
      s += path('M118,-120 C126,-104 128,-96 124,-86', 'none', { sw: 3, stroke: '#fbf4e2' });
      s += path('M-80,-200 C-40,-214 40,-214 70,-200 L70,-120 C40,-110 -40,-110 -80,-120Z', '#c8372d', { sw: 1.4 });
      for (let i = 0; i < 7; i++) s += circ(-70 + i * 22, -116, 4, GOLD, { stroke: LINE, sw: 0.6 });
      for (const x of [-90, -50, 30, 70]) s += `<rect x="${x - 14}" y="-60" width="28" height="60" rx="8" fill="#ece8de" stroke="${LINE}" stroke-width="1.5"/>`;
    } else if (kind === 'lion') {   // the Devi's lion, mid-roar
      const open = Math.max(0, Math.sin(t * 2)) * 8, step = Math.sin(t * 3) * 4;
      s += path('M-120,-70 C-130,-110 -80,-130 -20,-126 C30,-128 70,-120 84,-100 L84,-60 C70,-50 40,-46 20,-46 L-90,-46 C-114,-48 -120,-56 -120,-70Z', '#e8a040', { sw: 1.6 });
      for (let i = 0; i < 12; i++) { const a = -2.6 + i * 0.42; s += path(`M90,-110 Q${f1(90 + Math.cos(a) * 70)},${f1(-110 + Math.sin(a) * 70)} ${f1(90 + Math.cos(a + 0.42) * 46)},${f1(-110 + Math.sin(a + 0.42) * 46)}Z`, i % 2 ? '#b5481e' : '#c8641e', { sw: 1 }); }
      s += path(`M70,-130 C90,-150 130,-146 140,-120 L150,-100 C152,-90 146,-84 138,${f1(-82 + open)} L118,${f1(-80 + open)} C100,-80 80,-90 74,-104Z`, '#f2b84a', { sw: 1.5 });
      s += circ(116, -122, 3, LINE) + path(`M120,${f1(-86)} L146,-90 L144,${f1(-82 + open)} L120,${f1(-80 + open)}Z`, '#8a0f1a', { sw: 0.8 });
      s += path('M-120,-80 C-150,-90 -160,-120 -146,-140 C-140,-120 -130,-100 -116,-90Z', '#e8a040', { sw: 1.2 }) + circ(-146, -142, 6, '#b5481e');
      for (const [x, d] of [[-100, 1], [-70, -1], [40, 1], [70, -1]]) s += `<rect x="${x - 9}" y="${f1(-50 + d * step * 0.3)}" width="18" height="50" rx="6" fill="#e0983a" stroke="${LINE}" stroke-width="1.3"/>`;
      s += path('M-60,-120 C-20,-128 20,-128 50,-120 L50,-90 C20,-86 -20,-86 -60,-90Z', '#c8372d', { sw: 1.2 });
    } else if (kind === 'buffalo') {   // a buffalo, dark and heavy, head lowered to charge
      const bob = Math.sin(t * 1.5) * 2, tl = Math.sin(t * 2) * 6, sh = (st.charge || (o && o.charge)) ? 8 : 0;
      s += curve(`M-108,-92 C-130,-80 ${f1(-136 + tl)},-60 ${f1(-130 + tl)},-40`, '#2a2a3a', 4) + circ(-130 + tl, -38, 5, '#2a2a3a');
      for (const x of [-90, -62]) s += `<rect x="${x - 9}" y="${f1(-46 + bob)}" width="18" height="46" rx="6" fill="#1c1c28" stroke="#f3ead4" stroke-width="1"/>`;
      s += path(`M-112,-70 C-118,-108 -70,-124 -20,-128 C10,-140 40,-140 60,-122 C76,-110 84,-96 ${86 + sh},-82 L${108 + sh},-58 C${118 + sh},-46 ${112 + sh},-32 ${98 + sh},-32 L${80 + sh},-36 C70,-40 56,-44 44,-44 L-84,-44 C-104,-46 -112,-56 -112,-70Z`, '#2a2a3a', { sw: 1.6, stroke: '#f3ead4' });
      for (let i = 0; i < 18; i++) s += circ(-90 + (i % 6) * 26, -110 + Math.floor(i / 6) * 20 + (i % 2) * 6, 1.6, '#55557a', { op: 0.9 });
      s += `<path d="M${76 + sh},-92 C64,-124 30,-132 12,-118 M${86 + sh},-94 C100,-130 136,-134 150,-112" fill="none" stroke="#e9e2cc" stroke-width="7" stroke-linecap="round"/>`;
      s += path(`M${72 + sh},-84 L${62 + sh},-72 L${78 + sh},-76Z`, '#3a3a4a', { sw: 1, stroke: '#f3ead4' }) + circ(92 + sh, -72, 3.5, '#f6d24a') + circ(93 + sh, -72, 1.8, '#c00') + circ(106 + sh, -40, 2.4, '#55557a');
      for (const x of [30, 58]) s += `<rect x="${x - 9}" y="${f1(-46 - bob)}" width="18" height="46" rx="6" fill="#22222e" stroke="#f3ead4" stroke-width="1"/>`;
    } else if (kind === 'dove') {
      const fl = Math.sin(t * 10) * 14;
      s += path('M-30,0 C-20,-16 20,-18 34,-6 L46,-8 L40,0 C30,10 -10,12 -30,0Z', '#e8e8f0', { sw: 1.3 }) + path(`M-4,-8 C-14,${f1(-30 - fl)} -36,${f1(-40 - fl)} -40,${f1(-30 - fl)} C-28,-20 -16,-12 -4,-8Z`, '#d0d0e0', { sw: 1.1 }) + circ(30, -8, 2, LINE);
    } else if (kind === 'ketaki') {
      s += `<g transform="scale(2.2)">${item('ketaki', t)}</g>`;
    } else if (kind === 'horse') {   // the white sacrificial horse, caparisoned in red and gold
      const bob = Math.sin(t * 2 + (o.seed || 0)) * 1.5, c = o.color || '#f6f2e6', gal = st.walk || o.walk ? Math.sin(t * 8) * 10 : 0;
      s += curve(`M-80,-92 C-100,-86 -106,-60 -98,-40`, '#d8cfb8', 6);
      for (const [x, k] of [[-62, -1], [-44, 1], [40, -1], [58, 1]]) s += `<rect x="${x - 5}" y="${f1(-46 + bob * k)}" width="10" height="46" rx="4" fill="${shade(c, -0.06)}" stroke="${LINE}" stroke-width="1.2" transform="rotate(${f1(gal * k)} ${x} -46)"/>`;
      s += path('M-84,-70 C-90,-100 -60,-110 -10,-108 C30,-110 54,-104 62,-92 L78,-124 C84,-138 100,-142 112,-132 L126,-112 C132,-104 128,-96 120,-96 L104,-100 L86,-74 C76,-58 50,-50 30,-50 L-60,-50 C-78,-52 -84,-60 -84,-70Z', c, { sw: 1.6 });
      s += path('M74,-120 C70,-136 76,-146 84,-150 C84,-140 84,-130 82,-122Z', '#efe3c8', { sw: 1 }) + circ(110, -122, 2.4, LINE);
      s += path('M70,-112 C58,-100 50,-88 44,-80 L56,-84 C62,-96 70,-104 78,-112Z', '#c8372d', { sw: 0.8 });
      s += path('M-50,-104 C-20,-96 20,-96 50,-104 L46,-70 C20,-62 -20,-62 -46,-70Z', '#c8372d', { sw: 1.1 }) + curve('M-46,-70 C-20,-62 20,-62 46,-70', GOLD, 3);
      for (const x of [-36, -18, 0, 18, 36]) s += circ(x, -66, 2.4, GOLD_HI);
    } else if (kind === 'cow') {
      const bob = Math.sin(t * 1.5 + (o.seed || 0)) * 1.5, c = o.color || '#f6f0e0';
      s += path('M-70,-60 C-76,-86 -50,-96 -10,-94 C30,-96 52,-88 62,-74 L82,-80 C96,-80 100,-64 90,-58 L72,-50 C62,-40 40,-38 26,-38 L-46,-38 C-64,-38 -70,-46 -70,-60Z', c, { sw: 1.5 });
      s += path('M74,-80 C72,-92 78,-100 86,-102 C82,-94 82,-86 82,-80Z', '#e8d9b0', { sw: 1 }) + circ(84, -70, 2, LINE);
      if (o.spots !== false) s += `<ellipse cx="-20" cy="-70" rx="16" ry="10" fill="#b5481e" opacity="0.85"/><ellipse cx="20" cy="-62" rx="10" ry="7" fill="#b5481e" opacity="0.85"/>`;
      for (const x of [-56, -38, 20, 38]) s += `<rect x="${x - 5}" y="${f1(-42 + bob * (x > 0 ? 1 : -1))}" width="10" height="42" rx="4" fill="${c}" stroke="${LINE}" stroke-width="1.2"/>`;
      s += path('M-40,-90 C-20,-84 10,-84 30,-90 L30,-82 C10,-78 -20,-78 -40,-82Z', '#c8372d', { sw: 0.8 });
      s += curve('M-70,-70 C-84,-60 -86,-40 -80,-20', LINE, 1.6);
    }
    return s;
  }

  window.PWFig = { figure, head, crown, hairCap, item, creature, lotusBud, flame, CAST, POSES, textile, smooth, path, circ, curve, line, shade, GOLD, GOLD_HI, GOLD_LO, PEARL, RUBY, EMERALD, LINE, f1 };
})();
