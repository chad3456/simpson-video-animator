/* Shiva Purana: live comic effects, drawn every frame. Each is fn(p, T, age, uid) -> SVG around (0,0).
   Exports window.CBFx. */
(function () {
  const { f1, shade, INK, GOLD, GOLD_L, GOLD_D, ITEMS, figure, CAST } = window.CBFig;
  const { rng } = window.CBSets;
  const P = (d, fill, o = {}) => `<path d="${d}" fill="${fill}"${o.ink === false ? '' : ` stroke="${o.col || INK}" stroke-width="${o.w || 2.6}" stroke-linejoin="round"`}${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
  const L = (d, w = 2, col = INK, op) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${op != null ? ` opacity="${op}"` : ''}/>`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  // a flame tongue rooted at (x,y), height h, width w, flicker phase
  function tongue(x, y, w, h, ph, col, ink = true) {
    const k = Math.sin(ph) * w * 0.35, k2 = Math.cos(ph * 1.3) * w * 0.25;
    const d = `M${f1(x - w)},${f1(y)}C${f1(x - w * 1.1 + k2)},${f1(y - h * 0.4)} ${f1(x - w * 0.3 + k)},${f1(y - h * 0.6)} ${f1(x + k * 1.6)},${f1(y - h)}C${f1(x + w * 0.4 + k)},${f1(y - h * 0.55)} ${f1(x + w * 1.1 + k2)},${f1(y - h * 0.4)} ${f1(x + w)},${f1(y)}Z`;
    return P(d, col, { ink, w: 2.4 });
  }
  function flames(T, n, w, h, seed, cols = ['#d21f1e', '#f2731e', '#ffc93a', '#fff3b0']) {
    const r = rng(seed); let s = '';
    cols.forEach((c, li) => {
      const sc = 1 - li * 0.22;
      for (let i = 0; i < n; i++) {
        const x = (r() - 0.5) * w * sc, hh = h * sc * (0.6 + r() * 0.5) * (0.85 + 0.15 * Math.sin(T * (7 + r() * 5) + i)), ww = w / n * (1.2 + r()) * sc;
        s += tongue(x, 0, ww, hh, T * (6 + r() * 4) + i * 1.7, c, li < 2);
      }
    });
    return s;
  }
  const FX = {
    // the infinite column of fire (Jyotirlinga): it runs past the top and bottom of the frame
    pillar(p, T, age) {
      const w = p.w || 120, grow = clamp(age / (p.growT || 2.5));
      const top = -1400 * grow, bot = 1400 * grow;
      let s = `<rect x="${-w * 3}" y="${top}" width="${w * 6}" height="${bot - top}" fill="url(#cbPillarGlow)" opacity="0.8"/>`;
      s += `<rect x="${-w / 2 - 14}" y="${top}" width="${w + 28}" height="${bot - top}" fill="#f2731e" stroke="${INK}" stroke-width="3"/>`;
      // flames licking up both edges
      for (let y = Math.floor(top / 60) * 60; y < bot; y += 60) {
        const ph = T * 6 + y * 0.05;
        for (const side of [-1, 1]) {
          const x = side * (w / 2 + 10), k = Math.sin(ph + side) * 10;
          s += P(`M${x},${y + 40}C${f1(x + side * (26 + k))},${y + 20} ${f1(x + side * (34 + k))},${y - 10} ${f1(x + side * (18 + k * 2))},${y - 34}C${f1(x + side * 10)},${y - 10} ${f1(x + side * 4)},${y + 6} ${x},${y + 4}Z`, '#ffb02e', { w: 2.2 });
        }
      }
      s += `<rect x="${-w / 2 + 6}" y="${top}" width="${w - 12}" height="${bot - top}" fill="#ffd25a"/>`;
      s += `<rect x="${-w / 4}" y="${top}" width="${w / 2}" height="${bot - top}" fill="#fff6d0"/>`;
      // rising sparks inside the column
      const r = rng(5);
      for (let i = 0; i < 40; i++) { const x = (r() - 0.5) * w * 0.8, y = ((r() * 2800 - T * (200 + r() * 200)) % 2800 + 2800) % 2800 - 1400; if (y > top && y < bot) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(2 + r() * 3)}" fill="#ffffff" opacity="0.8"/>`; }
      s += `<rect x="${-w / 2 + 6}" y="${top}" width="${w - 12}" height="${bot - top}" fill="url(#cbDots)" opacity="0.18"/>`;
      return s;
    },
    fire(p, T, age) {   // a sacrificial or hearth fire
      const s0 = p.size || 1;
      return `<circle cx="0" cy="${-40 * s0}" r="${150 * s0}" fill="url(#cbFireGlow)" opacity="0.9"/><g transform="scale(${s0})">${flames(T, p.n || 6, 90, 130, p.seed || 3)}</g>`;
    },
    yogafire(p, T, age) {   // Sati's yogic fire rising around her
      const g = clamp(age / (p.growT || 2.2));
      return `<circle cx="0" cy="-220" r="${f1(320 * g)}" fill="url(#cbFireGlow)" opacity="${f1(0.9 * g)}"/><g transform="scale(${f1(0.4 + 0.9 * g)} ${f1(0.2 + 1.2 * g)})">${flames(T, 12, 260, 440, 9, ['#d21f1e', '#f2731e', '#ffc93a', '#fff3b0'])}</g>`;
    },
    glow(p, T) { const r = p.r || 200, pulse = 1 + 0.05 * Math.sin(T * (p.speed || 2)); return `<circle r="${f1(r * pulse)}" fill="url(#${p.warm ? 'cbFireGlow' : 'cbGlow'})" opacity="${p.op ?? 0.9}"/>`; },
    burst(p, T, age) {   // comic starburst
      const n = p.n || 18, r1 = p.r || 260, r0 = r1 * 0.6, pop = clamp(age / 0.25), sp = (p.spin || 0) * T;
      let d = '';
      for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2 + sp, r = (i % 2 ? r0 : r1) * (0.9 + 0.1 * Math.sin(i * 3.1)) * pop; d += `${i ? 'L' : 'M'}${f1(Math.cos(a) * r)},${f1(Math.sin(a) * r)}`; }
      return P(d + 'Z', p.col || '#ffd22e', { w: 4 }) + (p.col2 ? P(d.replace(/(-?[\d.]+),(-?[\d.]+)/g, (m, a, b) => `${f1(a * 0.7)},${f1(b * 0.7)}`) + 'Z', p.col2, { w: 3 }) : '');
    },
    rays(p, T) {   // divine light rays turning slowly
      const n = p.n || 16, r = p.r || 600; let s = `<g opacity="${p.op ?? 0.5}">`;
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + T * (p.speed ?? 0.08), w = Math.PI / n * 0.5; s += `<path d="M0,0L${f1(Math.cos(a - w) * r)},${f1(Math.sin(a - w) * r)}L${f1(Math.cos(a + w) * r)},${f1(Math.sin(a + w) * r)}Z" fill="${p.col || '#fff3b0'}"/>`; }
      return s + `</g><circle r="${f1(r * 0.35)}" fill="url(#cbGlow)" opacity="0.9"/>`;
    },
    speedlines(p, T) {
      const r = rng(p.seed || 3), n = p.n || 60; let s = `<g opacity="${p.op ?? 0.35}">`;
      for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, rr = (p.r0 || 200) + ((r() * 300 + T * 900) % 300), w = 0.004 + r() * 0.01; s += `<path d="M${f1(Math.cos(a) * rr)},${f1(Math.sin(a) * rr)}L${f1(Math.cos(a - w) * 1500)},${f1(Math.sin(a - w) * 1500)}L${f1(Math.cos(a + w) * 1500)},${f1(Math.sin(a + w) * 1500)}Z" fill="${p.col || INK}"/>`; }
      return s + '</g>';
    },
    sparkle(p, T) {
      const r = rng(p.seed || 7), n = p.n || 30, w = p.w || 600, h = p.h || 400; let s = '';
      for (let i = 0; i < n; i++) { const x = (r() - 0.5) * w, y = (r() - 0.5) * h, ph = T * (2 + r() * 3) + r() * 6, k = Math.max(0, Math.sin(ph)); if (k < 0.2) continue; const z = 3 + k * 7; s += `<path d="M${f1(x)},${f1(y - z)}L${f1(x + z * 0.25)},${f1(y - z * 0.25)}L${f1(x + z)},${f1(y)}L${f1(x + z * 0.25)},${f1(y + z * 0.25)}L${f1(x)},${f1(y + z)}L${f1(x - z * 0.25)},${f1(y + z * 0.25)}L${f1(x - z)},${f1(y)}L${f1(x - z * 0.25)},${f1(y - z * 0.25)}Z" fill="${p.col || '#fff6c0'}" opacity="${f1(k)}"/>`; }
      return s;
    },
    petals(p, T, age) {   // flowers showered from the sky
      const r = rng(p.seed || 9), n = p.n || 50, w = p.w || 1400, h = p.h || 900; let s = '';
      for (let i = 0; i < n; i++) {
        const x0 = (r() - 0.5) * w, sp = 60 + r() * 80, y = ((r() * h + age * sp) % h) - h / 2, x = x0 + Math.sin(age * 1.5 + i) * 30, rot = age * 90 * (r() - 0.5) * 2 + i * 40;
        s += `<path transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})" d="M0,0C-6,-6 -6,-14 0,-18C6,-14 6,-6 0,0Z" fill="${['#f59ab8', '#f6d24a', '#f27a2a', '#ffffff'][i % 4]}" stroke="${INK}" stroke-width="1.2"/>`;
      }
      return s;
    },
    snow(p, T, age) { const r = rng(p.seed || 4), n = p.n || 70; let s = ''; for (let i = 0; i < n; i++) { const x = (r() - 0.5) * 1400 + Math.sin(age + i) * 20, y = ((r() * 900 + age * (30 + r() * 40)) % 900) - 450; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.5 + r() * 2.5)}" fill="#ffffff" opacity="0.85"/>`; } return s; },
    ketaki(p, T, age) {   // the ketaki (screwpine) blossom, drifting down
      const sw = Math.sin(T * 1.6) * 12;
      let s = `<g transform="rotate(${f1(sw)})"><circle r="70" fill="url(#cbGlow)" opacity="0.5"/>`;
      s += P('M0,-50C22,-40 26,10 6,52C2,40 -2,40 -6,52C-26,10 -22,-40 0,-50Z', '#f6f0c8', { w: 2.6 });
      s += P('M0,-30C10,-20 10,14 0,36C-10,14 -10,-20 0,-30Z', '#f2c230', { w: 1.8 });
      for (let i = 0; i < 6; i++) s += `<circle cx="${f1((i % 2 ? 3 : -3))}" cy="${f1(-18 + i * 8)}" r="1.8" fill="#c8822e"/>`;
      s += L('M0,52L0,70', 3, '#5a8a3a');
      if (p.face) s += `<circle cx="-6" cy="-6" r="2" fill="${INK}"/><circle cx="6" cy="-6" r="2" fill="${INK}"/>` + L(p.face === 'sad' ? 'M-6,8C-2,4 2,4 6,8' : 'M-6,4C-2,9 2,9 6,4', 2);
      return s + '</g>';
    },
    lingam(p, T) {   // a Shiva lingam on its pitha, with tripundra and flowers
      let s = `<circle cx="0" cy="-60" r="${p.glow ? 180 : 0}" fill="url(#cbGlow)" opacity="0.6"/>`;
      s += P('M-110,0L110,0L96,-26L-96,-26Z', '#3a3a44', { w: 3 });
      s += P('M-96,-26C-96,-40 -60,-46 0,-46C60,-46 96,-40 96,-26Z', '#4a4a56', { w: 3 });
      s += P('M96,-34L150,-30L150,-20L96,-24Z', '#3a3a44', { w: 2.6 });   // spout
      s += P('M-40,-42L-40,-120C-40,-160 40,-160 40,-120L40,-42Z', '#2a2a32', { w: 3 });
      s += `<path d="M10,-42L10,-150C30,-146 40,-136 40,-120L40,-42Z" fill="#1a1a20"/>` + `<path d="M-30,-130C-28,-146 -14,-152 -4,-152C-14,-146 -22,-138 -24,-120Z" fill="#ffffff" opacity="0.35"/>`;
      for (const y of [-118, -108, -98]) s += L(`M-32,${y}L32,${y}`, 3.4, '#f4f1ea');
      s += `<circle cx="0" cy="-108" r="4" fill="#d21f3c"/>`;
      for (const [x, c] of [[-50, '#f6d24a'], [-24, '#f27a2a'], [22, '#f6d24a'], [48, '#ffffff']]) s += `<circle cx="${x}" cy="-48" r="7" fill="${c}" stroke="${INK}" stroke-width="1.4"/>`;
      s += P('M-12,-152C-20,-164 -8,-176 0,-168C8,-176 20,-164 12,-152Z', '#3f8a3a', { w: 1.8 });   // bilva leaves
      return s;
    },
    lamp(p, T) {   // a standing lamp with a living flame
      const fl = Math.sin(T * 13) * 1.5, h = p.dim ? 10 : 20;
      let s = `<circle cx="0" cy="-${86 + h}" r="${p.dim ? 50 : 110}" fill="url(#cbFireGlow)" opacity="${p.dim ? 0.5 : 0.85}"/>`;
      s += P('M-6,0L6,0L4,-70L-4,-70Z', GOLD_D, { w: 2 }) + P('M-24,0L24,0L18,-10L-18,-10Z', GOLD, { w: 2 });
      s += P('M-22,-70C-20,-80 20,-80 22,-70C18,-62 -18,-62 -22,-70Z', GOLD, { w: 2 });
      s += P(`M0,-78C${f1(-8 + fl)},-86 ${f1(-5 + fl)},-${f1(92 + h)} ${f1(fl)},-${f1(96 + h)}C${f1(5 + fl)},-${f1(92 + h)} ${f1(8 + fl)},-86 0,-78Z`, '#ffcf3a', { w: 1.8 });
      s += `<path d="M0,-80C-3,-84 -2,-88 0,-${f1(90 + h * 0.6)}C2,-88 3,-84 0,-80Z" fill="#fff8d8"/>`;
      if (p.cloth) s += P('M-4,-78L4,-78L3,-74L-3,-74Z', '#f4f1ea', { w: 0.8 });
      return s;
    },
    smoke(p, T, age) { const r = rng(p.seed || 3), n = p.n || 10; let s = ''; for (let i = 0; i < n; i++) { const k = ((age * 0.3 + i / n) % 1), x = Math.sin(i * 2.3 + age) * 30 * k + (r() - 0.5) * 30, y = -k * (p.h || 400), rr = 20 + k * 60; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${p.col || '#6a6a72'}" stroke="${INK}" stroke-width="2" opacity="${f1((1 - k) * 0.7)}"/>`; } return s; },
    dust(p, T, age) { const r = rng(p.seed || 8), n = p.n || 14; let s = ''; for (let i = 0; i < n; i++) { const x = (r() - 0.5) * (p.w || 1200) + Math.sin(age + i) * 20, y = (r() - 0.5) * 120, rr = 40 + r() * 70 + Math.sin(age * 2 + i) * 8; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${p.col || '#b8a07a'}" stroke="${INK}" stroke-width="2.4" opacity="0.85"/>`; } return s; },
    beam(p, T, age) {   // an energy weapon or the fire from Shiva's third eye: from (0,0) to (dx,dy)
      const g = clamp(age / (p.t || 0.5)), dx = (p.dx || 400) * g, dy = (p.dy || 0) * g, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len, w = p.w || 26;
      let d = 'M0,0'; const n = 14;
      for (let i = 1; i <= n; i++) { const k = i / n, j = (i % 2 ? 1 : -1) * w * (0.5 + 0.5 * Math.sin(T * 30 + i)); d += `L${f1(dx * k + nx * j)},${f1(dy * k + ny * j)}`; }
      for (let i = n; i >= 0; i--) { const k = i / n, j = (i % 2 ? -1 : 1) * w * 0.3; d += `L${f1(dx * k + nx * j)},${f1(dy * k + ny * j)}`; }
      return `<circle cx="${f1(dx)}" cy="${f1(dy)}" r="${f1(w * 4)}" fill="url(#${p.cold ? 'cbGlow' : 'cbFireGlow'})"/>` + P(d + 'Z', p.col || '#ff8a1e', { w: 3 }) + L(`M0,0L${f1(dx)},${f1(dy)}`, w * 0.35, p.core || '#fff6c0');
    },
    clash(p, T, age) {   // two weapons meeting: a ring of jagged lightning
      const r = rng(11); let s = `<circle r="${f1(160 + Math.sin(T * 20) * 10)}" fill="url(#cbFireGlow)"/>`;
      for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + T * 3; let d = 'M0,0'; for (let k = 1; k <= 5; k++) d += `L${f1(Math.cos(a) * k * 40 + (r() - 0.5) * 30)},${f1(Math.sin(a) * k * 40 + (r() - 0.5) * 30)}`; s += L(d, 4, i % 2 ? '#fff6c0' : '#8ad8ff'); }
      return s + FX.burst({ r: 90, n: 12, col: '#ffffff', spin: 2 }, T, age + 1);
    },
    ash(p, T, age) {   // a pile of ash, with grey flakes drifting up
      let s = P('M-90,0C-60,-30 -20,-46 0,-46C20,-46 60,-30 90,0Z', '#8a8a8a', { w: 2.6 }) + `<path d="M-90,0C-60,-30 -20,-46 0,-46C20,-46 60,-30 90,0Z" fill="url(#cbDots)" opacity="0.5"/>`;
      const r = rng(13); for (let i = 0; i < 20; i++) { const k = ((age * 0.2 + r()) % 1), x = (r() - 0.5) * 160 + Math.sin(age + i) * 20, y = -20 - k * 300; s += `<rect x="${f1(x)}" y="${f1(y)}" width="5" height="3" fill="#bdbdbd" opacity="${f1(1 - k)}" transform="rotate(${f1(age * 90 + i * 20)} ${f1(x)} ${f1(y)})"/>`; }
      return s;
    },
    vimana(p, T) {   // a celestial chariot
      const b = Math.sin(T * 1.6) * 6;
      let s = `<g transform="translate(0 ${f1(b)})"><circle cy="-60" r="180" fill="url(#cbGlow)" opacity="0.6"/>`;
      s += P('M-150,0C-140,30 140,30 150,0L130,-20L-130,-20Z', GOLD, { w: 3 }) + `<path d="M-150,0C-140,30 140,30 150,0Z" fill="${GOLD_D}"/>`;
      s += P('M-100,-20L-100,-110L100,-110L100,-20Z', '#f2e2b0', { w: 3 });
      for (const x of [-100, 100]) s += P(`M${x - 8},-20L${x + 8},-20L${x + 8},-120L${x - 8},-120Z`, GOLD, { w: 2.4 });
      s += P('M-120,-110L0,-200L120,-110Z', '#d21f3c', { w: 3 }) + P('M-4,-200L0,-230L4,-200Z', GOLD, { w: 2 });
      for (const x of [-170, 170]) s += P(`M${x},-6C${x + Math.sign(x) * 60},-60 ${x + Math.sign(x) * 110},-30 ${x + Math.sign(x) * 140},${f1(-20 + b)}C${x + Math.sign(x) * 90},-4 ${x + Math.sign(x) * 40},6 ${x},6Z`, '#fbfaf4', { w: 2.4 });
      return s + '</g>';
    },
    crowd(p, T) {   // a row of onlookers in silhouette with a few coloured heads
      const r = rng(p.seed || 17), n = p.n || 14, w = p.w || 1200; let s = '';
      const cols = p.cols || ['#f2b632', '#d21f3c', '#3d6fc4', '#2e8a57', '#f27a2a'];
      for (let i = 0; i < n; i++) {
        const x = -w / 2 + (i + 0.5) * w / n + (r() - 0.5) * 20, h = 140 + r() * 40, bob = Math.sin(T * 2 + i) * 3, c = p.col || '#2a2440';
        s += P(`M${f1(x - 32)},0L${f1(x - 28)},${f1(-h + 50 + bob)}C${f1(x - 20)},${f1(-h + 34 + bob)} ${f1(x + 20)},${f1(-h + 34 + bob)} ${f1(x + 28)},${f1(-h + 50 + bob)}L${f1(x + 32)},0Z`, c, { w: 2.4 });
        s += `<circle cx="${f1(x)}" cy="${f1(-h + 20 + bob)}" r="20" fill="${c}" stroke="${INK}" stroke-width="2.4"/>`;
        if (p.crowns) s += P(`M${f1(x - 14)},${f1(-h + 6 + bob)}L${f1(x - 10)},${f1(-h - 12 + bob)}L${f1(x)},${f1(-h + bob)}L${f1(x + 10)},${f1(-h - 12 + bob)}L${f1(x + 14)},${f1(-h + 6 + bob)}Z`, cols[i % cols.length], { w: 1.8 });
        if (p.weapons && i % 2) s += L(`M${f1(x + 26)},${f1(-h + 60)}L${f1(x + 40)},${f1(-h - 60 + bob)}`, 4, INK);
      }
      return s;
    },
    figurehead(p, T) {   // a single cast figure drawn as an effect (for reflections, crowds of a kind, cameo panels)
      const o = CAST[p.fig]; if (!o) return '';
      return `<g transform="scale(${p.s || 1})">${figure(o, { t: T, pose: p.pose || o.pose, emo: p.emo })}</g>`;
    },
    item(p, T) { const f = ITEMS[p.name]; return f ? `<g transform="scale(${p.k || 1})">${f({ t: T })}</g>` : ''; },
    mirror(p, T) {   // an ornate hand mirror frame (the face inside is a cast figure placed behind it)
      return P('M0,-130C80,-130 110,-60 110,0C110,60 80,130 0,130C-80,130 -110,60 -110,0C-110,-60 -80,-130 0,-130ZM0,-110C66,-110 92,-56 92,0C92,56 66,110 0,110C-66,110 -92,56 -92,0C-92,-56 -66,-110 0,-110Z', GOLD, { w: 3 }) + P('M-16,130L16,130L12,240L-12,240Z', GOLD_D, { w: 3 });
    },
    dice(p, T, age) {   // a gambler's board with cowries and dice
      let s = P('M-120,0L120,0L100,-30L-100,-30Z', '#8a5a2a', { w: 2.6 });
      for (const [x, y] of [[-40, -16], [30, -12], [70, -20]]) s += P(`M${x - 9},${y - 9}L${x + 9},${y - 9}L${x + 9},${y + 9}L${x - 9},${y + 9}Z`, '#f4efe2', { w: 2 }) + `<circle cx="${x}" cy="${y}" r="2" fill="${INK}"/>`;
      for (let i = 0; i < 5; i++) s += `<ellipse cx="${-90 + i * 12}" cy="-14" rx="5" ry="3.4" fill="#fbf6e8" stroke="${INK}" stroke-width="1.2"/>`;
      return s;
    },
    coins(p, T, age) { const r = rng(p.seed || 21), n = p.n || 30; let s = ''; for (let i = 0; i < n; i++) { const x = (r() - 0.5) * (p.w || 300), y = ((r() * 500 + age * (120 + r() * 80)) % 500) - 250; s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(6 + Math.abs(Math.sin(age * 4 + i)) * 4)}" ry="10" fill="${GOLD}" stroke="${INK}" stroke-width="1.6"/>`; } return s; },
    platter(p, T) {   // offerings: food, flowers, a lamp
      let s = P('M-70,0C-60,12 60,12 70,0L60,-8L-60,-8Z', GOLD, { w: 2.4 });
      s += P('M-40,-8C-38,-30 -10,-34 -4,-8Z', '#fbf6e8', { w: 2 }) + P('M4,-8C8,-26 30,-28 36,-8Z', '#f2a516', { w: 2 });
      for (const x of [-56, 50]) s += `<circle cx="${x}" cy="-12" r="6" fill="#f27a2a" stroke="${INK}" stroke-width="1.4"/>`;
      return s;
    },
    om(p, T) {   // the syllable AUM glowing in the dark
      const k = 1 + 0.04 * Math.sin(T * 2);
      return `<circle r="${f1((p.r || 160) * 1.3)}" fill="url(#cbGlow)" opacity="0.8"/><text x="0" y="${f1((p.r || 160) * 0.38)}" font-family="Rozha, Tiro, serif" font-size="${f1((p.r || 160) * k)}" text-anchor="middle" fill="${p.col || '#ffd25a'}" stroke="${INK}" stroke-width="6" paint-order="stroke">ॐ</text>`;
    },
    lock(p, T, age) {   // a lock of matted hair, flung down onto the mountain
      const k = clamp(age / 0.8);
      return `<g transform="rotate(${f1(k * 280)})">` + P('M-60,0C-40,-20 -10,-10 0,0C10,10 40,20 60,0C40,30 10,20 0,10C-10,0 -40,-10 -60,0Z', '#2a1a14', { w: 2.4 }) + '</g>';
    },
    noose(p, T, age) { return L(`M0,0C${f1(60 + Math.sin(T * 3) * 10)},40 120,120 80,180C40,240 -20,200 0,160C20,120 80,160 60,200`, 5, '#c8a25a') + L('M0,0C60,40 120,120 80,180', 2, INK, 0.4); },
    waves(p, T) { let s = ''; for (let k = 0; k < 4; k++) { const y = k * 22; s += L(`M-700,${y}C-500,${f1(y - 14 + Math.sin(T + k) * 6)} -300,${f1(y + 14)} -100,${y}S300,${f1(y - 14 + Math.sin(T * 1.2 + k) * 6)} 500,${y}S700,${y + 10} 900,${y}`, 3, k % 2 ? '#ffffff' : '#a8d8f0'); } return s; },
    shesha(p, T) {   // the serpent couch (coils and a canopy of hoods)
      const c = '#3f7a8a';
      let s = '';
      for (let i = 0; i < 3; i++) s += `<ellipse cx="0" cy="${-i * 26}" rx="${220 - i * 30}" ry="34" fill="${c}" stroke="${INK}" stroke-width="3"/><ellipse cx="0" cy="${-i * 26 - 6}" rx="${200 - i * 30}" ry="18" fill="${shade(c, 0.2)}" opacity="0.7"/>`;
      s += P('M160,-60C200,-140 200,-240 170,-300', 'none', { w: 30, col: c }) + L('M160,-60C200,-140 200,-240 170,-300', 3);
      for (let i = -3; i <= 3; i++) { const a = i * 0.32 - Math.PI / 2, x = 170 + Math.cos(a) * 70, y = -300 + Math.sin(a) * 60; s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a * 180 / Math.PI + 90)})">${P('M-16,10C-22,-14 -10,-30 0,-30C10,-30 22,-14 16,10Z', c, { w: 2.4 })}<circle cx="-5" cy="-14" r="2" fill="#f2c230"/><circle cx="5" cy="-14" r="2" fill="#f2c230"/></g>`; }
      return s;
    },
    tigerskin(p) { let s = P('M-120,0C-130,-20 -100,-40 -60,-36C-20,-44 20,-44 60,-36C100,-40 130,-20 120,0C80,10 -80,10 -120,0Z', '#e8902a', { w: 2.6 }); for (const x of [-80, -40, 0, 40, 80]) s += `<path d="M${x},-34c4,10 2,20 8,30c-6,-6 -8,-18 -8,-30Z" fill="#1a120c"/>`; return s; },
  };
  window.CBFx = FX;
})();
