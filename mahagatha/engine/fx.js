/* Live effects and set pieces for the Mahagatha film, drawn every frame around the element's origin.
   Signature: FX[name](p, t, age, seed) -> svg, where p are the element's current (tweened) props,
   t is episode time, age is seconds since the element appeared. Exports window.PWFx. */
(function () {
  const { f1, path, circ, curve, line, shade, lotusBud, flame, item, GOLD, GOLD_HI, GOLD_LO, PEARL, RUBY, LINE } = window.PWFig;
  const { curl, rng, lotusLeaf, tree } = window.PWSets;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const ease = p => p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

  const FX = {};

  // soft radial light
  FX.glow = (p, t) => {
    const r = p.r || 200, c = p.color || '#fff1b8', pulse = 1 + (p.pulse ?? 0.05) * Math.sin(t * 2.2);
    return `<radialGradient id="g${p._uid}"><stop offset="0" stop-color="${c}" stop-opacity="${p.core ?? 0.95}"/><stop offset="0.35" stop-color="${c}" stop-opacity="${(p.core ?? 0.95) * 0.45}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient><circle r="${f1(r * pulse)}" fill="url(#g${p._uid})"/>`;
  };
  // rays of divine light
  FX.rays = (p, t) => {
    const n = p.n || 24, r = p.r || 600, c = p.color || '#fff0b0', rot = (p.spin ?? 4) * t;
    let s = `<g transform="rotate(${f1(rot)})" opacity="${p.op ?? 0.35}">`;
    for (let i = 0; i < n; i++) s += `<path transform="rotate(${f1(i * 360 / n)})" d="M0,0 L${f1(-r * 0.06)},${-r} L${f1(r * 0.06)},${-r}Z" fill="${c}"/>`;
    return s + '</g>';
  };
  // the sacred syllable
  FX.om = (p, t, age) => {
    const sz = p.size || 160, c = p.color || GOLD_HI;
    let s = '';
    for (let i = 0; i < 4; i++) { const ph = ((age * 0.45 + i / 4) % 1); s += `<circle r="${f1(sz * 0.5 + ph * sz * 2.2)}" fill="none" stroke="${c}" stroke-width="${f1(3 * (1 - ph))}" opacity="${f1((1 - ph) * 0.8 * 100) / 100}"/>`; }
    s += `<circle r="${f1(sz * 0.95)}" fill="url(#pwGlow)" opacity="0.65"/>`;
    s += `<text y="${f1(sz * 0.36)}" text-anchor="middle" font-family="Tiro, serif" font-size="${sz}" fill="${c}" stroke="#7a4a10" stroke-width="2" paint-order="stroke">ॐ</text>`;
    return s;
  };
  // the golden cosmic egg (Hiranyagarbha); crack 0..1 splits it into heaven and earth
  FX.egg = (p, t, age) => {
    const r = p.r || 120, cr = clamp(p.crack || 0), sh = Math.sin(t * 1.3) * 3;
    let s = `<circle r="${f1(r * 2.4)}" fill="url(#pwGlow)" opacity="${f1(0.7 + 0.15 * Math.sin(t * 2))}"/>`;
    const egg = (half) => {
      const d = half === 0 ? `M${-r * 0.82},0 C${-r * 0.82},${-r * 0.75} ${-r * 0.45},${-r * 1.2} 0,${-r * 1.2} C${r * 0.45},${-r * 1.2} ${r * 0.82},${-r * 0.75} ${r * 0.82},0 L${r * 0.5},-6 L${r * 0.2},6 L${-r * 0.1},-6 L${-r * 0.4},6 Z`
        : `M${-r * 0.82},0 C${-r * 0.82},${r * 0.62} ${-r * 0.45},${r * 0.95} 0,${r * 0.95} C${r * 0.45},${r * 0.95} ${r * 0.82},${r * 0.62} ${r * 0.82},0 L${r * 0.5},-6 L${r * 0.2},6 L${-r * 0.1},-6 L${-r * 0.4},6 Z`;
      return path(d, half === 0 ? '#f2c94a' : '#e8a62a', { stroke: GOLD_LO, sw: 2.4 });
    };
    const off = ease(cr) * r * 1.6;
    s += `<g transform="translate(0 ${f1(-off + sh)})">${egg(0)}` + (cr < 0.05 ? '' : '') + `</g><g transform="translate(0 ${f1(off * 0.6 + sh)})">${egg(1)}</g>`;
    if (cr < 0.2) for (let i = 0; i < 7; i++) s += `<path transform="translate(0 ${f1(sh)}) rotate(${i * 51 + t * 8})" d="M0,${-r * 0.3} C${r * 0.1},${-r * 0.5} ${r * 0.05},${-r * 0.7} 0,${-r * 0.8}" stroke="#fff6cf" stroke-width="2" fill="none" opacity="0.5"/>`;
    if (cr > 0 && cr < 1) s += `<circle r="${f1(r * (0.4 + cr))}" fill="#fffbe0" opacity="${f1((1 - cr) * 0.9 * 100) / 100}"/>`;
    return s;
  };
  // three gunas: white, red, dark orbs circling
  FX.gunas = (p, t) => {
    const r = p.r || 120; let s = '';
    const cols = [['#fbf6ea', 'सत्त्व'], ['#d23a2a', 'रजस्'], ['#1a1430', 'तमस्']];
    cols.forEach(([c, label], i) => {
      const a = t * 0.7 + i * 2.094, x = Math.cos(a) * r, y = Math.sin(a) * r * 0.5;
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="46" fill="url(#pwGlow)" opacity="0.5"/>` + circ(x, y, 26, c, { stroke: GOLD, sw: 2.4 });
      if (p.labels) s += `<text x="${f1(x)}" y="${f1(y + 62)}" text-anchor="middle" font-family="Tiro, serif" font-size="26" fill="${GOLD_HI}">${label}</text>`;
    });
    return s;
  };
  // the five elements as painted roundels
  FX.elements = (p, t, age) => {
    const n = 5, r = p.r || 220; let s = '';
    const E = [['वायु', '#9fc3d8'], ['जल', '#3d6fc4'], ['पृथ्वी', '#7a5a2a'], ['अग्नि', '#e8582a'], ['आकाश', '#2a2a6a']];
    E.forEach(([name, c], i) => {
      const show = clamp((age - i * 0.6) / 0.6); if (show <= 0) return;
      const a = -Math.PI / 2 + i * 2 * Math.PI / n + t * 0.05, x = Math.cos(a) * r, y = Math.sin(a) * r * 0.62;
      s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(ease(show) * 100) / 100})">` + circ(0, 0, 44, c, { stroke: GOLD, sw: 3 }) + circ(0, 0, 36, 'none', { stroke: '#fff6cf', sw: 1 });
      if (i === 0) s += curl(-8, 0, 12, '#fff', 2.4) + curl(10, 10, 8, '#fff', 2);
      if (i === 1) s += path('M0,-20 C10,-6 14,4 14,10 C14,18 8,24 0,24 C-8,24 -14,18 -14,10 C-14,4 -10,-6 0,-20Z', '#bfe7ff', { sw: 1.4 });
      if (i === 2) s += path('M-24,14 L-8,-14 L4,2 L12,-8 L26,14Z', '#c99a4a', { sw: 1.4 });
      if (i === 3) s += flame(0, 18, 1.1, t, i);
      if (i === 4) s += circ(-10, -8, 3, '#fff') + circ(12, -4, 2, '#fff') + circ(0, 12, 2.4, '#fff') + circ(-16, 10, 1.6, '#fff');
      s += `<text y="70" text-anchor="middle" font-family="Tiro, serif" font-size="24" fill="${GOLD_HI}" stroke="#2a160c" stroke-width="3" paint-order="stroke">${name}</text></g>`;
    });
    return s;
  };
  // Shesha, the many-hooded serpent: coils as a bed and a canopy of hoods over the god
  FX.shesha = (p, t) => {
    const w = p.w || 520, sw = Math.sin(t * 1.1) * 4; let s = '';
    const body = '#3e7c74', belly = '#e9dca8';
    // coils: three stacked rounded bands
    for (let i = 2; i >= 0; i--) {
      const y = -i * 30, ww = w * (1 - i * 0.08);
      s += path(`M${-ww / 2},${y} C${-ww / 2 - 40},${y - 34} ${-ww / 2 + 20},${y - 52} ${-ww / 2 + 60},${y - 40} L${ww / 2 - 40},${y - 40} C${ww / 2},${y - 50} ${ww / 2 + 36},${y - 20} ${ww / 2},${y}Z`, i % 2 ? shade(body, 0.08) : body, { sw: 2 });
      for (let k = 0; k < 18; k++) s += curve(`M${f1(-ww / 2 + 50 + k * (ww - 100) / 18)},${y - 36} q8,10 16,0`, shade(body, -0.25), 1.2, { op: 0.8 });
      s += curve(`M${-ww / 2 + 30},${y - 6} L${ww / 2 - 30},${y - 6}`, belly, 4, { op: 0.8 });
    }
    // neck rising at the head end and the hoods
    const hx = -w / 2 - 10;
    s += path(`M${hx + 40},-60 C${hx - 10},-120 ${hx - 10},-200 ${hx + 30},-260 L${hx + 70},-250 C${hx + 40},-200 ${hx + 40},-130 ${hx + 80},-70Z`, body, { sw: 2 });
    const n = p.hoods || 7;
    for (let i = 0; i < n; i++) {
      const a = (i - (n - 1) / 2) * 0.26, x = hx + 50 + Math.sin(a) * 120, y = -270 - Math.cos(a) * 60 + sw * (i % 2 ? 1 : -1) * 0.5;
      s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a * 57)})">` + path('M0,-34 C22,-34 30,-12 26,6 C22,20 10,30 0,34 C-10,30 -22,20 -26,6 C-30,-12 -22,-34 0,-34Z', shade(body, 0.1), { sw: 1.8 }) +
        path('M0,-20 C10,-18 14,-6 12,6 C10,14 4,20 0,22 C-4,20 -10,14 -12,6 C-14,-6 -10,-18 0,-20Z', belly, { sw: 1 }) + circ(-7, -22, 2.6, '#f6d24a', { stroke: LINE, sw: 0.6 }) + circ(7, -22, 2.6, '#f6d24a', { stroke: LINE, sw: 0.6 }) + `<path d="M0,-30 l-2,-8 l4,0Z" fill="${RUBY}"/></g>`;
    }
    return s;
  };
  // a growing lotus stalk from (0,0) to (dx,dy); grow 0..1
  FX.stem = (p, t) => {
    const g = clamp(p.grow ?? 1), dx = p.dx || 0, dy = p.dy || -300, sway = Math.sin(t * 1.2) * (p.sway ?? 10);
    const ex = dx * g + sway * g, ey = dy * g;
    const c1x = dx * 0.1 + 40 * g, c1y = dy * 0.4 * g, c2x = dx * 0.7 * g - 30, c2y = dy * 0.7 * g;
    let s = curve(`M0,0 C${f1(c1x)},${f1(c1y)} ${f1(c2x)},${f1(c2y)} ${f1(ex)},${f1(ey)}`, LINE, (p.w || 12) + 3);
    s += curve(`M0,0 C${f1(c1x)},${f1(c1y)} ${f1(c2x)},${f1(c2y)} ${f1(ex)},${f1(ey)}`, '#4f8a3a', p.w || 12);
    s += curve(`M0,0 C${f1(c1x)},${f1(c1y)} ${f1(c2x)},${f1(c2y)} ${f1(ex)},${f1(ey)}`, '#86b85a', 2, { dash: '2 10' });
    if (p.shake) s = `<g transform="rotate(${f1(Math.sin(t * 24) * p.shake)})">${s}</g>`;
    return s;
  };
  // a giant lotus seat; open 0..1
  FX.lotus = (p, t) => {
    const sc = p.size || 1, op = clamp(p.open ?? 1), col = p.color || '#f19ab0';
    let s = `<g transform="scale(${sc})">`;
    s += `<ellipse cx="0" cy="6" rx="${f1(150 * (0.5 + op * 0.5))}" ry="22" fill="#3f7a3a" stroke="${LINE}" stroke-width="2"/>`;
    const rows = [[11, 120, 46, shade(col, -0.1)], [9, 96, 54, col], [7, 70, 58, shade(col, 0.18)]];
    for (const [n, R, h, c] of rows) {
      for (let i = 0; i < n; i++) {
        const a = -90 + (i - (n - 1) / 2) * (150 / n) * (0.4 + op * 0.6);
        s += `<g transform="rotate(${f1(a + 90)}) translate(0 -6)"><path d="M0,0 C${-h * 0.4},${-R * 0.3} ${-h * 0.3},${-R * 0.8} 0,${-R} C${h * 0.3},${-R * 0.8} ${h * 0.4},${-R * 0.3} 0,0Z" fill="${c}" stroke="${LINE}" stroke-width="1.8"/><path d="M0,-8 L0,${-R * 0.85}" stroke="${shade(c, -0.22)}" stroke-width="1.2"/></g>`;
      }
    }
    s += `<ellipse cx="0" cy="-4" rx="${f1(56 * op + 10)}" ry="14" fill="${GOLD}" stroke="${LINE}" stroke-width="1.6"/>`;
    for (let i = 0; i < 14; i++) s += circ(-46 * op + i * 7 * op, -8, 2, '#f7d566');
    return s + '</g>';
  };
  // floating Veda manuscripts circling, or falling (fall 0..1 sends them down into the water)
  FX.vedas = (p, t) => {
    let s = ''; const fall = clamp(p.fall || 0);
    for (let i = 0; i < 4; i++) {
      const a = t * 0.8 + i * Math.PI / 2, r = p.r || 110;
      let x = Math.cos(a) * r, y = Math.sin(a) * r * 0.35 - 20;
      x = lerp(x, (i - 1.5) * 60, ease(fall)); y = lerp(y, 260 + i * 30, ease(clamp(fall * 1.2 - i * 0.05)));
      s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(Math.sin(t + i) * 10 + fall * (i * 70 - 100))}) scale(1.6)">${circ(0, -8, 30, 'url(#pwGlow)', { op: 0.6 * (1 - fall) })}${item('vedas', t)}</g>`;
    }
    return s;
  };
  // drifting flower petals (a shower of blessings)
  FX.petals = (p, t, age) => {
    const n = p.n || 40, w = p.w || 1280, h = p.h || 720; const R = rng(p.seed || 3); let s = '';
    const cols = (typeof p.colors === 'string' ? p.colors.split(',') : p.colors) || ['#f29a1e', '#e8505a', '#fbf3df', '#f2c230'];
    for (let i = 0; i < n; i++) {
      const sp = 40 + R() * 50, x0 = R() * w - w / 2, ph = R() * h;
      const y = ((ph + age * sp) % (h + 40)) - h / 2 - 20, x = x0 + Math.sin(age * 1.2 + i) * 20;
      s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="5" ry="3" transform="rotate(${f1(age * 90 + i * 40)} ${f1(x)} ${f1(y)})" fill="${cols[i % cols.length]}" stroke="${LINE}" stroke-width="0.6"/>`;
    }
    return s;
  };
  // twinkling sparks / divine motes
  FX.sparkle = (p, t, age) => {
    const n = p.n || 30, w = p.w || 400, h = p.h || 300, R = rng(p.seed || 7); let s = '';
    for (let i = 0; i < n; i++) {
      const x = (R() - 0.5) * w, y = (R() - 0.5) * h - (p.rise ? (age * 30 + R() * h) % h - h / 2 : 0), tw = 0.5 + 0.5 * Math.sin(t * (2 + R() * 4) + i);
      s += `<path transform="translate(${f1(x)} ${f1(y)}) scale(${f1(tw * 1.4 * 100) / 100})" d="M0,-6 L1.4,-1.4 L6,0 L1.4,1.4 L0,6 L-1.4,1.4 L-6,0 L-1.4,-1.4Z" fill="${p.color || '#fff6cf'}"/>`;
    }
    return s;
  };
  // a column of fire with no top and no bottom (the jyotirlinga)
  FX.pillar = (p, t, age) => {
    const w = p.w || 120, h = p.h || 2000, crack = clamp(p.crack || 0);
    let s = `<rect x="${-w * 2}" y="${-h / 2}" width="${w * 4}" height="${h}" fill="url(#pwPillarGlow)" opacity="0.8"/>`;
    s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#f6b52a" stroke="#b5481e" stroke-width="3"/>`;
    for (let i = 0; i < 26; i++) {
      const y = ((i * 80 - age * 120) % h + h) % h - h / 2;
      s += `<path d="M${-w / 2},${f1(y)} C${-w / 4},${f1(y - 30)} ${w / 4},${f1(y + 20)} ${w / 2},${f1(y - 10)}" stroke="#fde27a" stroke-width="5" fill="none" opacity="0.8"/>`;
    }
    for (let i = 0; i < 40; i++) {
      const y = ((i * 50 - age * 160) % h + h) % h - h / 2, side = i % 2 ? 1 : -1;
      s += `<g transform="translate(${side * w / 2} ${f1(y)}) rotate(${side * 70})">${flame(0, 0, 0.9 + (i % 3) * 0.3, t, i)}</g>`;
    }
    if (crack > 0) s += `<path d="M0,${-140 * crack} L${-w * 0.2},${-70 * crack} L${w * 0.15},0 L${-w * 0.1},${70 * crack} L0,${140 * crack}" stroke="#fffbe0" stroke-width="${f1(4 + crack * 26)}" fill="none"/><circle r="${f1(crack * 160)}" fill="#fff6cf" opacity="${f1(crack * 0.8 * 100) / 100}"/>`;
    return s;
  };
  // fire burst (from Brahma's brow, the yajna altar)
  FX.fire = (p, t, age) => {
    const n = p.n || 7, sc = p.size || 1; let s = `<circle r="${f1(70 * sc)}" fill="url(#pwFireGlow)" opacity="0.8"/>`;
    for (let i = 0; i < n; i++) s += flame((i - (n - 1) / 2) * 16 * sc, 10 * sc, sc * (1.2 + (i % 3) * 0.5 - Math.abs(i - (n - 1) / 2) * 0.12), t, i);
    return s;
  };
  // an expanding shock ring (impacts, births, curses)
  FX.ring = (p, t, age) => {
    const dur = p.dur || 1.4, ph = clamp(age / dur); if (ph >= 1) return '';
    return `<circle r="${f1((p.r || 300) * ease(ph))}" fill="none" stroke="${p.color || '#fff6cf'}" stroke-width="${f1(14 * (1 - ph))}" opacity="${f1((1 - ph) * 100) / 100}"/>`;
  };
  // lightning bolt from the sky
  FX.bolt = (p, t, age) => {
    const R = rng(Math.floor(age * 12) + (p.seed || 1)), h = p.h || 500; let d = 'M0,0', x = 0;
    for (let y = 0; y < h; y += 40) { x += (R() - 0.5) * 60; d += ` L${f1(x)},${y + 40}`; }
    const fl = (Math.floor(age * 10) % 3 !== 2) ? 1 : 0.2;
    return `<path d="${d}" stroke="#fffbe0" stroke-width="7" fill="none" opacity="${fl}"/><path d="${d}" stroke="#bfe7ff" stroke-width="2.4" fill="none" opacity="${fl}"/>`;
  };
  // big painted text (counts, names)
  FX.text = (p, t, age) => {
    const sz = p.size || 64, a = clamp(age / 0.6);
    return `<text text-anchor="middle" font-family="${p.font || 'Yatra, Tiro, serif'}" font-size="${sz}" fill="${p.color || GOLD_HI}" stroke="${p.stroke || '#2a160c'}" stroke-width="${p.sw || 6}" paint-order="stroke" opacity="${f1(a * 100) / 100}" letter-spacing="${p.ls || 0}">${String(p.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`;
  };
  // battle sparks / weapon clash
  FX.clash = (p, t, age) => {
    const period = p.period || 0.9, ph = (age % period) / period, R = rng(Math.floor(age / period) + 5); let s = '';
    const sc = 1 - ph;
    for (let i = 0; i < 14; i++) { const a = R() * 6.28, r = 20 + ph * (60 + R() * 120); s += `<line x1="${f1(Math.cos(a) * r * 0.5)}" y1="${f1(Math.sin(a) * r * 0.5)}" x2="${f1(Math.cos(a) * r)}" y2="${f1(Math.sin(a) * r)}" stroke="${i % 2 ? '#fde27a' : '#fffbe0'}" stroke-width="${f1(3 * sc + 0.5)}" opacity="${f1(sc)}"/>`; }
    return s + `<circle r="${f1(40 * sc)}" fill="#fffbe0" opacity="${f1(sc * 0.8)}"/>`;
  };
  // stylised smoke/dust cloud
  FX.smoke = (p, t, age) => {
    const R = rng(p.seed || 2); let s = '';
    for (let i = 0; i < (p.n || 8); i++) {
      const ph = ((age * 0.3 + R()) % 1), x = (R() - 0.5) * (p.w || 300), y = -ph * (p.h || 200);
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(20 + ph * 50)}" fill="${p.color || '#5a4a6a'}" opacity="${f1((1 - ph) * 0.5 * 100) / 100}"/>` + curl(x, y, 10 + ph * 20, '#8a7a9a', 1.4);
    }
    return s;
  };
  // flock of birds/cranes crossing
  FX.birds = (p, t, age) => {
    let s = ''; const n = p.n || 5, sp = p.speed || 60;
    for (let i = 0; i < n; i++) {
      const x = ((age * sp + i * 70) % 1600) - 800, y = -i * 14 + Math.sin(age * 2 + i) * 6, fl = Math.sin(age * 8 + i) * 8;
      s += `<path d="M${f1(x - 14)},${f1(y - fl)} Q${f1(x - 6)},${f1(y - 6)} ${f1(x)},${f1(y)} Q${f1(x + 6)},${f1(y - 6)} ${f1(x + 14)},${f1(y - fl)}" stroke="${p.color || '#fbf8f0'}" stroke-width="2.4" fill="none"/>`;
    }
    return s;
  };
  // fireflies / glowing motes floating
  FX.motes = (p, t) => {
    const R = rng(p.seed || 11); let s = '';
    for (let i = 0; i < (p.n || 24); i++) { const x = (R() - 0.5) * (p.w || 1200) + Math.sin(t * 0.5 + i) * 20, y = (R() - 0.5) * (p.h || 500) + Math.cos(t * 0.4 + i * 2) * 14, tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + i)); s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(6 * tw)}" fill="url(#pwGlow)"/>` + circ(x, y, 1.6, '#fffbe0', { op: tw }); }
    return s;
  };
  // the lamp of the opening (one live flame on a brass diya)
  FX.diya = (p, t) => `<g transform="scale(${p.size || 1})"><circle cy="-30" r="70" fill="url(#pwFireGlow)" opacity="0.7"/>${path('M-30,0 C-26,18 26,18 30,0 L40,-4 C20,-8 -20,-8 -30,0Z', '#c98a2a', { sw: 1.6 })}${flame(32, -8, 1.4, t, p._uid || 0)}</g>`;
  // a temple bell
  FX.bell = (p, t, age) => {
    const sw = Math.sin(age * 5) * 12 * Math.exp(-age * 0.5);
    return `<g transform="rotate(${f1(sw)})">${line([[0, -200], [0, -40]], GOLD_LO, 3)}${path('M-26,0 C-26,-30 -16,-44 0,-44 C16,-44 26,-30 26,0 L32,8 L-32,8Z', GOLD, { sw: 1.6 })}${circ(0, 14, 6, GOLD_LO, { stroke: LINE, sw: 1 })}</g>`;
  };
  // a coloured wash over the frame (grading)
  FX.tint = (p) => `<rect x="-2000" y="-2000" width="4000" height="4000" fill="${p.color || '#000'}" opacity="${p.op ?? 0.3}"/>`;
  // earth forming from plates
  FX.earth = (p, t, age) => {
    const r = p.r || 160, form = clamp(p.form ?? 1); let s = `<circle r="${f1(r * 1.6)}" fill="url(#pwGlow)" opacity="0.35"/>`;
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6, off = (1 - ease(form)) * 260;
      s += `<path transform="translate(${f1(Math.cos(a + 0.26) * off)} ${f1(Math.sin(a + 0.26) * off)})" d="M0,0 L${f1(Math.cos(a) * r)},${f1(Math.sin(a) * r)} A${r},${r} 0 0 1 ${f1(Math.cos(a + Math.PI / 6) * r)},${f1(Math.sin(a + Math.PI / 6) * r)}Z" fill="${i % 3 === 0 ? '#5c8a4a' : i % 3 === 1 ? '#8a6a3a' : '#3d6fc4'}" stroke="${LINE}" stroke-width="2"/>`;
    }
    return s;
  };
  // yuga colour wheel: four segments, white, red, yellow, black
  FX.yugas = (p, t) => {
    const r = p.r || 120, act = p.active ?? -1; let s = '';
    const Y = [['सत्', '#fbf6ea'], ['त्रेता', '#d23a2a'], ['द्वापर', '#f2c230'], ['कलि', '#1a1430']];
    Y.forEach(([n, c], i) => {
      const a0 = -Math.PI / 2 + i * Math.PI / 2, a1 = a0 + Math.PI / 2, on = act < 0 || i === act;
      s += `<path d="M0,0 L${f1(Math.cos(a0) * r)},${f1(Math.sin(a0) * r)} A${r},${r} 0 0 1 ${f1(Math.cos(a1) * r)},${f1(Math.sin(a1) * r)}Z" fill="${c}" stroke="${GOLD}" stroke-width="3" opacity="${on ? 1 : 0.3}"/>`;
      const am = (a0 + a1) / 2; s += `<text x="${f1(Math.cos(am) * r * 1.32)}" y="${f1(Math.sin(am) * r * 1.32 + 8)}" text-anchor="middle" font-family="Tiro, serif" font-size="24" fill="${GOLD_HI}" stroke="#2a160c" stroke-width="4" paint-order="stroke" opacity="${on ? 1 : 0.4}">${n}</text>`;
    });
    return `<g transform="rotate(${f1(t * 6)})">${s}</g>`;
  };
  // a painted mandala rosette (used for the wipe and as a backdrop)
  FX.mandala = (p, t) => {
    const r = p.r || 300; let s = '';
    const cols = p.colors || ['#8e1f22', GOLD, '#1c2a5e', '#c2366d', GOLD, '#2e8a57'];
    for (let ring = 5; ring >= 0; ring--) {
      const rr = r * (ring + 1) / 6, n = 8 + ring * 4, c = cols[ring % cols.length];
      s += `<circle r="${f1(rr)}" fill="${c}" stroke="${LINE}" stroke-width="2"/>`;
      for (let i = 0; i < n; i++) s += `<path transform="rotate(${f1(i * 360 / n + (ring % 2 ? t * 10 : -t * 10))})" d="M0,${f1(-rr)} C${f1(rr * 0.12)},${f1(-rr * 0.9)} ${f1(rr * 0.08)},${f1(-rr * 0.8)} 0,${f1(-rr * 0.76)} C${f1(-rr * 0.08)},${f1(-rr * 0.8)} ${f1(-rr * 0.12)},${f1(-rr * 0.9)} 0,${f1(-rr)}Z" fill="${shade(c, 0.3)}" stroke="${LINE}" stroke-width="1"/>`;
    }
    return s + circ(0, 0, r * 0.1, RUBY, { stroke: GOLD, sw: 3 });
  };
  // drifting cloud scrolls in front of the camera
  FX.clouds = (p, t, age) => {
    const { cloudBank } = window.PWSets; let s = ''; const R = rng(p.seed || 4);
    for (let i = 0; i < (p.n || 3); i++) { const x = ((R() * 1600 + age * (p.speed || 12) * (1 + i * 0.3)) % 1900) - 950, y = (R() - 0.5) * (p.h || 300); s += cloudBank(x, y, 260 + R() * 160, p.color || '#fbf3df', p.edge || '#c9b9a0', i + 3); }
    return s;
  };
  // the Sudarshana chakra flying free: a big spinning disc of flame with a light trail
  FX.chakra = (p, t, age) => {
    const r = p.r || 60, sp = age * (p.spin || 720);
    let s = `<circle r="${f1(r * 2.2)}" fill="url(#pwFireGlow)" opacity="0.6"/><g transform="rotate(${f1(sp % 360)})">`;
    for (let i = 0; i < 24; i++) s += `<path transform="rotate(${i * 15})" d="M0,-${r} L${f1(r * 0.14)},-${f1(r * 1.35)} L-${f1(r * 0.06)},-${f1(r * 1.08)}Z" fill="#f6a524" stroke="${LINE}" stroke-width="0.8"/>`;
    s += circ(0, 0, r, GOLD, { stroke: LINE, sw: 2 }) + circ(0, 0, r * 0.74, '#f7d566', { stroke: GOLD_LO, sw: 1.4 });
    for (let i = 0; i < 12; i++) s += `<path transform="rotate(${i * 30})" d="M0,0 L0,-${f1(r * 0.74)}" stroke="${GOLD_LO}" stroke-width="2.4"/>`;
    return s + circ(0, 0, r * 0.14, RUBY, { stroke: LINE, sw: 1 }) + '</g>';
  };
  // the moon in the sky, waxing and waning: phase 0 = new (dark), 1 = full
  FX.moonphase = (p, t) => {
    const r = p.r || 70, ph = clamp(p.phase ?? 1), k = Math.cos(ph * Math.PI);
    let s = `<circle r="${f1(r * 2)}" fill="url(#pwGlow)" opacity="${f1(0.15 + 0.5 * ph)}"/><circle r="${r}" fill="#26305a" stroke="#5a69ab" stroke-width="2"/>`;
    s += `<path d="M0,${-r} A${r},${r} 0 0 1 0,${r} A${f1(Math.abs(k) * r)},${r} 0 0 ${k > 0 ? 0 : 1} 0,${-r}Z" fill="#f4f0e0" stroke="#d9d2b8" stroke-width="1.5"/>`;
    return s;
  };
  // slanting monsoon rain over the frame
  FX.rain = (p, t, age) => {
    const R = rng(p.seed || 9), n = p.n || 120, w = p.w || 1500, h = p.h || 800, sp = p.speed || 900; let s = '';
    for (let i = 0; i < n; i++) {
      const x = (R() - 0.5) * w, y0 = R() * h, y = ((y0 + age * sp) % h) - h / 2;
      s += `<line x1="${f1(x + y * 0.18)}" y1="${f1(y)}" x2="${f1(x + y * 0.18 + 6)}" y2="${f1(y + 30)}" stroke="${p.color || '#cfe0ff'}" stroke-width="1.6" opacity="${p.op ?? 0.6}"/>`;
    }
    return s;
  };
  // Ganga falling from heaven: a widening torrent of white water with foam and spray
  FX.falls = (p, t, age) => {
    const h = p.h || 700, w0 = p.w0 || 40, w1 = p.w || 260, R = rng(p.seed || 4); let s = '';
    const fl = clamp(p.flow ?? 1), top = -h, bot = -h + h * fl;
    s += `<path d="M${-w0 / 2},${top} L${w0 / 2},${top} L${f1(w0 / 2 + (w1 - w0) / 2 * fl)},${f1(bot)} L${f1(-w0 / 2 - (w1 - w0) / 2 * fl)},${f1(bot)}Z" fill="${p.color || '#e8f4fb'}" opacity="${p.op ?? 0.9}"/>`;
    for (let i = 0; i < 14; i++) {
      const u = (i / 14 - 0.5), x0 = u * w0, x1 = u * w1, ph = (age * 1.6 + i * 0.37) % 1;
      s += curve(`M${f1(x0)},${top} C${f1(x0)},${f1(top + h * 0.4 * fl)} ${f1(x1)},${f1(top + h * 0.6 * fl)} ${f1(x1 * fl + x0 * (1 - fl))},${f1(bot)}`, p.crest || '#7fb6d8', 1.4, { op: 0.5 + 0.4 * Math.sin(i + t * 3) });
      const yy = top + (bot - top) * ph; s += circ(f1(x0 + (x1 - x0) * ph * fl), f1(yy), 3, '#fff', { op: 0.8 });
    }
    if (fl > 0.95) for (let i = 0; i < 24; i++) { const a = R() * Math.PI, r = 40 + ((age * 120 + R() * 200) % 160); s += circ(f1(Math.cos(a) * r * 1.4), f1(-Math.sin(a) * r * 0.6), 2 + R() * 3, '#fff', { op: 0.7 }); }
    return s;
  };
  // Manu's great boat: a painted hull with a canopy, rocking on the water
  FX.boat = (p, t) => {
    const rock = Math.sin(t * 1.2) * 3;
    let s = `<g transform="rotate(${f1(rock)})">`;
    s += path('M-170,-30 C-120,30 120,30 170,-30 L190,-60 C150,-40 -150,-40 -190,-60Z', '#8a4a20', { sw: 2 });
    s += path('M-160,-38 C-110,0 110,0 160,-38', 'none', { sw: 1.2 }) + curve('M-150,-20 C-100,8 100,8 150,-20', GOLD, 3);
    s += path('M-90,-44 L-90,-120 L90,-120 L90,-44Z', '#c8372d', { sw: 1.6 }) + path('M-110,-118 C-60,-160 60,-160 110,-118Z', '#f2a516', { sw: 1.6 });
    for (let i = 0; i < 5; i++) s += path(`M${-70 + i * 35},-50 L${-70 + i * 35},-100 L${-50 + i * 35},-100 L${-50 + i * 35},-50Z`, '#fbe7b0', { sw: 1 });
    s += line([[0, -150], [0, -260]], '#5a3a1a', 4) + path('M0,-250 L70,-230 L0,-200Z', '#f2c230', { sw: 1.2 });
    if (p.rope) s += curve(`M180,-56 C${260},-120 ${f1(p.rope * 0.6)},-160 ${f1(p.rope)},-120`, '#d9b26a', 3);
    return s + '</g>';
  };
  // a stone palace pillar that can split open (Narasimha)
  FX.column = (p, t, age) => {
    const w = p.w || 70, h = p.h || 420, crack = clamp(p.crack || 0), sp = crack * 60;
    const half = (dx, side) => `<g transform="translate(${f1(dx)} 0) rotate(${f1(side * crack * 8)} 0 0)">` +
      path(side < 0 ? `M${-w / 2},0 L${-w / 2},${-h} L0,${-h} L${w * 0.08},${-h * 0.7} L${-w * 0.06},${-h * 0.45} L${w * 0.05},${-h * 0.2} L0,0Z` : `M${w / 2},0 L${w / 2},${-h} L0,${-h} L${w * 0.08},${-h * 0.7} L${-w * 0.06},${-h * 0.45} L${w * 0.05},${-h * 0.2} L0,0Z`, '#d9cdb0', { sw: 2 }) +
      line([[side * w * 0.3, -h * 0.05], [side * w * 0.3, -h * 0.95]], '#b5a888', 2) + '</g>';
    let s = '';
    if (crack > 0) s += `<rect x="${f1(-sp)}" y="${-h}" width="${f1(sp * 2)}" height="${h}" fill="#fff4c4" opacity="${f1(crack)}"/><circle cy="${-h / 2}" r="${f1(crack * 260)}" fill="url(#pwGlow)" opacity="${f1(crack)}"/>`;
    s += half(-sp, -1) + half(sp, 1);
    s += path(`M${-w * 0.8},${-h} L${w * 0.8},${-h} L${w * 0.65},${-h - 24} L${-w * 0.65},${-h - 24}Z`, '#c9b98e', { sw: 1.6, op: 1 - crack });
    s += path(`M${-w * 0.8},0 L${w * 0.8},0 L${w * 0.65},-20 L${-w * 0.65},-20Z`, '#c9b98e', { sw: 1.6 });
    return s;
  };
  // the churning: Mandara mountain wound by Vasuki, spinning (spin=1 runs it)
  FX.churn = (p, t, age) => {
    const sp = (p.spin ?? 1), ph = t * 2.2 * sp, h = p.h || 420;
    let s = path(`M-120,0 C-110,${-h * 0.4} -60,${-h * 0.9} 0,${-h} C60,${-h * 0.9} 110,${-h * 0.4} 120,0Z`, '#7a6a5a', { sw: 2 });
    for (let i = 0; i < 8; i++) s += curve(`M${-90 + i * 24},-10 C${-70 + i * 18},${-h * 0.4} ${-40 + i * 10},${-h * 0.7} ${-10 + i * 3},${-h * 0.95}`, '#5a4a3a', 1.6, { op: 0.6 });
    for (let k = 0; k < 9; k++) s += tree(-80 + (k * 37 + Math.round(ph * 20)) % 160, -h * 0.3 - (k % 3) * h * 0.18, 0.2);
    for (let i = 0; i < 4; i++) {   // the serpent coils, scrolling with the spin
      const y = -h * 0.15 - i * h * 0.2, o = Math.sin(ph + i) * 10;
      s += `<path d="M${-150},${f1(y + 20 + o)} C-60,${f1(y - 20 + o)} 60,${f1(y + 40 - o)} 150,${f1(y + o)}" stroke="#2e6a8a" stroke-width="22" fill="none" stroke-linecap="round"/>`;
      s += `<path d="M${-150},${f1(y + 20 + o)} C-60,${f1(y - 20 + o)} 60,${f1(y + 40 - o)} 150,${f1(y + o)}" stroke="#7ac0d8" stroke-width="6" fill="none" stroke-dasharray="10 12" stroke-dashoffset="${f1(-ph * 40)}"/>`;
    }
    return s;
  };
  // the poison Halahala: a dark green fog spreading from the sea
  FX.poison = (p, t, age) => {
    const R = rng(13); let s = '';
    for (let i = 0; i < (p.n || 16); i++) {
      const a = R() * 6.28, r = (p.r || 400) * (0.3 + R() * 0.7) * Math.min(1, age / 3), x = Math.cos(a + t * 0.1) * r, y = Math.sin(a) * r * 0.4;
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(50 + R() * 70)}" fill="${i % 2 ? '#1e3a1a' : '#2a4a1e'}" opacity="0.55"/>` + curl(x, y, 18, '#5a8a3a', 1.6);
    }
    return s;
  };
  // the sun eaten by a dark disc (Rahu)
  FX.eclipse = (p, t) => {
    const r = p.r || 70, cov = clamp(p.cover ?? 0);
    let s = `<circle r="${f1(r * 1.9)}" fill="url(#pwFireGlow)" opacity="0.7"/>`;
    for (let i = 0; i < 16; i++) s += `<path transform="rotate(${i * 22.5 + t * 8})" d="M0,${-r} L8,${-r - 26} L-8,${-r - 26}Z" fill="#f6a524" stroke="${LINE}" stroke-width="0.8"/>`;
    s += circ(0, 0, r, '#f6c24a', { stroke: LINE, sw: 2 });
    s += circ(r * 2 * (1 - cov), 0, r * 1.02, '#14102a', { stroke: '#3a2a5a', sw: 2 });
    return s;
  };
  // painted water band that moves (for scenes on the ocean)
  FX.water = (p, t) => {
    const w = p.w || 1600, h = p.h || 120, base = p.color || '#cfd8ea', crest = p.crest || '#4a5f9e'; let s = `<rect x="${-w / 2}" y="0" width="${w}" height="${h}" fill="${base}" opacity="${p.op ?? 1}"/>`;
    for (let r = 0; r < 4; r++) {
      const yy = 10 + r * h / 4, sz = 18 + r * 6, off = (t * (14 + r * 6)) % (sz * 2);
      let d = `M${-w / 2 - sz * 2 + off},${f1(yy + sz * 0.6)}`;
      for (let x = -w / 2 - sz * 2 + off; x < w / 2 + sz * 2; x += sz * 2) d += ` C${f1(x + sz * 0.2)},${f1(yy - sz * 0.2)} ${f1(x + sz * 1.4)},${f1(yy - sz * 0.4)} ${f1(x + sz * 1.6)},${f1(yy + sz * 0.3)} C${f1(x + sz * 1.3)},${f1(yy + sz * 0.1)} ${f1(x + sz * 1.0)},${f1(yy + sz * 0.3)} ${f1(x + sz * 2)},${f1(yy + sz * 0.6)}`;
      s += curve(d, crest, 2.2, { op: 0.9 });
    }
    return s;
  };
  // the dark goddess of sleep leaving the god: a veil of indigo stars
  FX.veil = (p, t, age) => {
    const R = rng(5); let s = `<path d="M-120,0 C-140,-120 -60,-260 0,-300 C60,-260 140,-120 120,0 C60,30 -60,30 -120,0Z" fill="#141d45" opacity="${p.op ?? 0.85}" stroke="#5a69ab" stroke-width="2"/>`;
    for (let i = 0; i < 40; i++) s += circ((R() - 0.5) * 200, -R() * 280, 1.2 + R() * 1.6, '#fdf6dc', { op: 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i)) });
    return s;
  };

  window.PWFx = FX;
})();
