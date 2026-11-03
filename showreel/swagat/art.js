// Swagat: Pichwai artwork, brand mark, icons and product mockups for the showreel.
// Figures and painted sets come from the Mahagatha engine (lib/figures.js, lib/sets.js).
// Static artwork is rasterised once at load (Art.init) and reused as images on packaging faces.
(function () {
  const { figure, CAST, flame, lotusBud, shade, GOLD, GOLD_HI, GOLD_LO, PEARL, RUBY, LINE } = window.PWFig;
  const { SETS, border, grain, swirls, stars, rng, cuspArch, moon } = window.PWSets;

  // ---------- palette ----------
  const C = {
    indigo: '#1C2A5E', indigo2: '#121C44', kesar: '#F0A020', sindoor: '#C0362C', kamal: '#E7A5B8',
    gold: '#E0A92A', pista: '#A9C47C', ivory: '#FBF3DF', kajal: '#2A160C', rani: '#A3285E', clay: '#B5562A', white: '#FFFFFF',
  };
  const PALETTE = [
    ['Haathi-daant', 'Ivory', C.ivory, C.kajal], ['Kesar', 'Saffron', C.kesar, C.kajal], ['Sona', 'Gold leaf', C.gold, C.kajal],
    ['Kamal', 'Lotus pink', C.kamal, C.kajal], ['Sindoor', 'Vermilion', C.sindoor, C.ivory], ['Rani', 'Rani pink', C.rani, C.ivory],
    ['Pista', 'Pistachio', C.pista, C.kajal], ['Raat', 'Night indigo', C.indigo, C.ivory],
  ];

  // ---------- cast (the Mahagatha Ram and Sita, plus a family drawn in the same hand) ----------
  const FAM = {
    rama: CAST.rama, sita: CAST.sita, lakshmana: CAST.lakshmana,
    papa: { skin: '#c8905a', crown: 'turban', turban: '#c8372d', mustache: true, dhoti: '#fbf3df', dhotiDots: '#e0a92a', scarf: '#f2a516', seed: 201, earring: false },
    maa: { skin: '#d8a070', female: true, crown: 'veil', odhni: '#e86a8c', skirt: '#2e8a57', skirtMotif: 'flower', choli: '#f2a516', noseRing: true, tilak: 'bindi', seed: 202 },
    dadi: { skin: '#c89070', female: true, crown: 'veil', odhni: '#fbf3df', skirt: '#a3285e', skirtMotif: 'dot', choli: '#a3285e', seed: 203, hair: '#d8d0c8' },
    beta: { skin: '#c8905a', crown: 'topknot', dhoti: '#f2c230', dhotiDots: '#c8372d', scarf: null, seed: 204 },
    beti: { skin: '#d8a070', female: true, crown: 'veil', odhni: '#f2c230', skirt: '#e8641e', skirtMotif: 'flower', choli: '#3d6fc4', seed: 205 },
  };
  const KID = { beta: 0.7, beti: 0.66 };
  // one figure at (x, y feet) in a 1280x720 world; flip faces left
  function fig(name, x, y, s = 1, st = {}, flip = false) {
    const k = (KID[name] || 1) * s;
    return `<g transform="translate(${x} ${y}) scale(${flip ? -k : k} ${k})">${figure(FAM[name], Object.assign({ t: 0 }, st))}</g>`;
  }
  // Ram facing right, Sita facing left: the pair that sits on every pack
  const pair = (cx, y, s, t, o = {}) =>
    fig('rama', cx - 92 * s, y, s, { t, pose: o.rpose || 'bless', item: o.ritem }) +
    fig('sita', cx + 92 * s, y, s, { t: t + 0.7, pose: o.spose || 'offer', item: o.sitem || 'diya' }, true);

  // ---------- small painted motifs ----------
  const f1 = v => Math.round(v * 10) / 10;
  function diyaSmall(x, y, s, t, seed = 0, lit = 1) {
    let g = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-24,0 C-20,14 20,14 24,0 L34,-4 C28,4 26,6 22,6 C14,16 -14,16 -22,8Z" fill="${C.clay}" stroke="${LINE}" stroke-width="1.4"/>
      <path d="M-24,0 C-10,-5 14,-5 30,-3" fill="none" stroke="#6a2a10" stroke-width="2"/>
      <circle cx="-10" cy="6" r="1.8" fill="${C.ivory}"/><circle cx="0" cy="8" r="1.8" fill="${C.ivory}"/><circle cx="10" cy="6" r="1.8" fill="${C.ivory}"/>`;
    if (lit > 0) g += `<circle cx="28" cy="-14" r="${26 * lit}" fill="url(#swGlow)"/>` + flame(28, -4, 0.6 * lit, t, seed);
    return g + '</g>';
  }
  function marigoldString(x0, x1, y, sag, n) {
    let s = `<path d="M${x0},${y} Q${(x0 + x1) / 2},${y + sag * 2} ${x1},${y}" fill="none" stroke="#e8941e" stroke-width="4"/>`;
    for (let k = 0; k <= n; k++) { const u = k / n, xx = (1 - u) * (1 - u) * x0 + 2 * u * (1 - u) * (x0 + x1) / 2 + u * u * x1, yy = (1 - u) * (1 - u) * y + 2 * u * (1 - u) * (y + sag * 2) + u * u * y;
      s += `<circle cx="${f1(xx)}" cy="${f1(yy)}" r="7" fill="${k % 2 ? '#f2b21e' : '#e8641e'}" stroke="${LINE}" stroke-width="0.8"/>`; }
    return s;
  }
  function firework(x, y, r, k, col, seed = 1) {
    if (k <= 0 || k >= 1) return '';
    const R = rng(seed); let s = ''; const n = 18, rr = r * (1 - Math.pow(1 - k, 3)), op = k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4;
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + R() * 0.2; for (let j = 1; j <= 3; j++) {
      const d = rr * j / 3; s += `<circle cx="${f1(x + Math.cos(a) * d)}" cy="${f1(y + Math.sin(a) * d + k * k * 30)}" r="${f1(1.2 + j * 1.1)}" fill="${j === 3 ? col : C.ivory}" opacity="${f1(op * 100) / 100}"/>`; } }
    return s;
  }
  // Pushpak: the flying lotus chariot that brings Ram and Sita home
  function pushpak(x, y, s) {
    let p = `<g transform="translate(${x} ${y}) scale(${s})">`;
    for (let i = -4; i <= 4; i++) p += `<path transform="rotate(${i * 13} 0 40)" d="M0,40 C-26,20 -22,-22 0,-40 C22,-22 26,20 0,40Z" fill="${i % 2 ? C.kamal : '#f4c4d2'}" stroke="${LINE}" stroke-width="1.5" />`;
    p += `<path d="M-230,0 C-180,60 180,60 230,0 L210,-10 C140,30 -140,30 -210,-10Z" fill="${C.gold}" stroke="${LINE}" stroke-width="2"/>`;
    for (let i = -9; i <= 9; i++) p += `<circle cx="${i * 22}" cy="${f1(22 + Math.cos(i / 9 * 1.4) * 8)}" r="3.4" fill="${i % 3 ? PEARL : RUBY}"/>`;
    return p + '</g>';
  }
  const cloud = (x, y, w, col = '#fbf3df') => { let d = `M${x},${y}`; const n = Math.round(w / 50); for (let i = 0; i < n; i++) d += ` a${w / n / 2},${w / n / 2.4} 0 0 1 ${w / n},0`; return `<path d="${d} Z" fill="${col}" stroke="${GOLD_LO}" stroke-width="1.5"/>`; };

  const DEFS = `<defs><radialGradient id="swGlow"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".9"/><stop offset=".45" stop-color="#ffc24a" stop-opacity=".35"/><stop offset="1" stop-color="#ffb43a" stop-opacity="0"/></radialGradient>
    <radialGradient id="pwAura"><stop offset="0" stop-color="#fff6cf" stop-opacity="0.85"/><stop offset="1" stop-color="#fff6cf" stop-opacity="0"/></radialGradient>
    <radialGradient id="pwGlowSoft"><stop offset="0" stop-color="#fff3b0" stop-opacity="0.7"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></radialGradient></defs>`;

  // ---------- painted panels (1280x720 world) ----------
  function homecoming(t = 0, o = {}) {
    const S = SETS.court({ wall: o.wall || C.indigo });
    let s = S.back;
    s += pair(640, 640, 1.05, t, { rpose: 'bless', spose: 'offer' });
    for (let i = 0; i < 9; i++) s += diyaSmall(150 + i * 122, 690, 1.1, t, i, o.lit == null ? 1 : Math.max(0, Math.min(1, o.lit * 9 - i)));
    for (const x of [300, 980]) s += lotusBud(x, 600, 1.6, 0.8, C.kamal);
    return s;
  }
  function vanvaas(t = 0) {
    let s = SETS.glade({}).back;
    s += fig('rama', 520, 650, 0.95, { t, pose: 'rest', item: 'bow', walk: 1 }) + fig('sita', 680, 650, 0.95, { t: t + 0.4, pose: 'rest', walk: 1 }) + fig('lakshmana', 360, 650, 0.95, { t: t + 0.9, pose: 'rest', item: 'bow', walk: 1 });
    return s;
  }
  function panchavati(t = 0) {
    let s = SETS.pond({}).back;
    s += fig('sita', 760, 560, 1, { t, pose: 'offer', item: 'padma' }, true) + fig('rama', 560, 560, 1, { t, pose: 'abhaya' });
    return s;
  }
  function swayamvar(t = 0) {
    let s = SETS.court({ wall: C.sindoor }).back;
    s += fig('rama', 520, 640, 1.05, { t, pose: 'hold', item: 'bow' }) + fig('sita', 760, 640, 1.05, { t, pose: 'offer', item: 'mala' }, true);
    return s;
  }
  function setu(t = 0) {
    let s = SETS.ocean ? SETS.ocean({}).back : SETS.pond({}).back;
    s += fig('rama', 560, 600, 1, { t, pose: 'point' }) + fig('lakshmana', 400, 600, 1, { t, pose: 'namaste' });
    return s;
  }

  // a Jaipur rooftop on Diwali night (amavasya: no moon, only stars), for the family scene
  function terrace() {
    const W = 1280, H = 720;
    let s = `<defs><linearGradient id="swSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1533"/><stop offset=".7" stop-color="${C.indigo}"/><stop offset="1" stop-color="#3a2a6a"/></linearGradient></defs>`;
    s += `<rect width="${W}" height="${H}" fill="url(#swSky)"/>` + swirls(0, 0, W, 380, 40, '#24346e', 21, { rmin: 10, rvar: 20 }) + stars(0, 0, W, 360, 170, 17);
    // distant pink-city skyline: havelis with chhatri domes, windows lit with diyas
    const R = rng(31);
    for (const [col, base, hmin, hvar, win] of [['#2a3a7a', 470, 60, 70, 0.5], ['#3a2a5e', 500, 40, 60, 0.8]]) {
      let x = -20;
      while (x < W) {
        const w = 60 + R() * 90, h = hmin + R() * hvar;
        s += `<rect x="${f1(x)}" y="${f1(base - h)}" width="${f1(w)}" height="${f1(h + 60)}" fill="${col}"/>`;
        if (R() < 0.55) { const cx = x + w / 2, r = 12 + R() * 14; s += `<path d="M${f1(cx - r)},${f1(base - h)} C${f1(cx - r)},${f1(base - h - r * 1.4)} ${f1(cx + r)},${f1(base - h - r * 1.4)} ${f1(cx + r)},${f1(base - h)}Z" fill="${col}"/><path d="M${f1(cx)},${f1(base - h - r * 1.05)}v-${f1(r * .6)}" stroke="${col}" stroke-width="3"/>`; }
        for (let wx = x + 10; wx < x + w - 10; wx += 22) for (let wy = base - h + 14; wy < base; wy += 26) if (R() < win) s += `<circle cx="${f1(wx)}" cy="${f1(wy)}" r="2.6" fill="#ffc24a" opacity="${f1(.5 + R() * .5)}"/>`;
        x += w + 4;
      }
    }
    // parapet with little jharokha arches, then the terrace floor
    s += `<rect x="0" y="500" width="${W}" height="70" fill="#e9cf8e" stroke="${LINE}" stroke-width="2"/>`;
    for (let x = 20; x < W; x += 64) s += `<path d="M${x},566 V536 C${x},520 ${x + 22},514 ${x + 22},514 C${x + 22},514 ${x + 44},520 ${x + 44},536 V566Z" fill="#c9a860" stroke="${LINE}" stroke-width="1.2"/>`;
    s += `<rect x="0" y="494" width="${W}" height="10" fill="${C.sindoor}" stroke="${LINE}" stroke-width="1.5"/>`;
    s += `<rect x="0" y="570" width="${W}" height="150" fill="#f4ead2"/><path d="M0,570H${W}" stroke="${LINE}" stroke-width="2"/>`;
    for (let i = 0; i < 80; i++) s += `<circle cx="${f1(R() * W)}" cy="${f1(585 + R() * 130)}" r="${f1(2 + R() * 2.5)}" fill="${R() > .5 ? '#e8641e' : '#f2b21e'}" opacity=".85"/>`;
    // a rangoli in the middle of the floor
    s += `<g transform="translate(640 655) scale(1 .32)">`;
    for (let r = 4; r >= 1; r--) s += `<circle r="${r * 46}" fill="${[C.kesar, C.rani, C.pista, C.sindoor][r - 1]}" stroke="${C.ivory}" stroke-width="4"/>`;
    for (let i = 0; i < 12; i++) s += `<path transform="rotate(${i * 30})" d="M0,-60 C20,-110 0,-170 0,-180 C0,-170 -20,-110 0,-60Z" fill="${C.ivory}" opacity=".8"/>`;
    return s + '</g>';
  }

  // a square medallion for lids: Ram and Sita under a cusped arch on lotus pink
  function medallion(t = 0, bgc = C.kamal) {
    let s = `<rect width="800" height="800" fill="${bgc}"/>` + swirls(0, 0, 800, 800, 30, shade(bgc, 0.18), 5, { rmin: 10, rvar: 18 });
    s += `<path d="${cuspArch(400, 690, 560, 600)}" fill="${C.indigo}" stroke="${GOLD}" stroke-width="6"/>` + stars(140, 110, 520, 300, 50, 7);
    s += `<path d="${cuspArch(400, 690, 600, 630)}" fill="none" stroke="${GOLD_LO}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`;
    s += `<rect x="0" y="690" width="800" height="110" fill="${C.ivory}"/><path d="M0,690H800" stroke="${GOLD}" stroke-width="5"/>`;
    s += `<g transform="translate(-240 120) scale(1)">${pair(640, 620, 0.98, t)}</g>`;
    for (let i = 0; i < 5; i++) s += lotusBud(120 + i * 140, 780, 1.4, 0.9, i % 2 ? C.kamal : '#f4c4d2');
    s += sqBorder(800, 800, 22);
    return s;
  }
  function sqBorder(w, h, b, col = C.sindoor) {
    let s = `<path d="M0,0H${w}V${h}H0Z M${b},${b}V${h - b}H${w - b}V${b}Z" fill="${col}" fill-rule="evenodd"/><rect x="${b - 3}" y="${b - 3}" width="${w - 2 * b + 6}" height="${h - 2 * b + 6}" fill="none" stroke="${GOLD}" stroke-width="3"/>`;
    for (let x = 20; x < w - 10; x += 24) s += `<circle cx="${x}" cy="${b / 2}" r="2.6" fill="${PEARL}"/><circle cx="${x}" cy="${h - b / 2}" r="2.6" fill="${PEARL}"/>`;
    for (let y = 20; y < h - 10; y += 24) s += `<circle cx="${b / 2}" cy="${y}" r="2.6" fill="${PEARL}"/><circle cx="${w - b / 2}" cy="${y}" r="2.6" fill="${PEARL}"/>`;
    return s;
  }
  // repeat pattern for box sides: lotus buds and gold dots on indigo
  function pattern(w, h, bgc = C.indigo, seed = 3) {
    let s = `<rect width="${w}" height="${h}" fill="${bgc}"/>` + swirls(0, 0, w, h, Math.round(w * h / 9000), shade(bgc, 0.14), seed, { rmin: 8, rvar: 12 });
    for (let y = 40, r = 0; y < h; y += 70, r++) for (let x = 40 + (r % 2) * 50; x < w; x += 100) s += lotusBud(x, y + 14, 0.9, 0.8, r % 2 ? C.kamal : C.kesar) + `<circle cx="${x + 50}" cy="${y - 8}" r="3" fill="${GOLD}"/>`;
    return s + sqBorder(w, h, 14, C.gold).replace(new RegExp(PEARL, 'g'), C.sindoor);
  }
  // sweets seen from above in a gold-foil tray
  function sweetsTray(w, h) {
    let s = `<rect width="${w}" height="${h}" fill="#7a2a14"/>`;
    const cols = 4, rows = 4, cw = (w - 40) / cols, ch = (h - 40) / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = 20 + c * cw, y = 20 + r * ch, cx = x + cw / 2, cy = y + ch / 2, k = (r + c) % 3;
      s += `<rect x="${x + 4}" y="${y + 4}" width="${cw - 8}" height="${ch - 8}" rx="8" fill="${GOLD}" stroke="${GOLD_LO}" stroke-width="2"/>`;
      if (k === 0) { s += `<circle cx="${cx}" cy="${cy}" r="${cw * 0.33}" fill="#f2a516" stroke="#b86a10" stroke-width="2"/>`; const R = rng(r * 9 + c); for (let i = 0; i < 26; i++) s += `<circle cx="${f1(cx + (R() - .5) * cw * .5)}" cy="${f1(cy + (R() - .5) * cw * .5)}" r="2.4" fill="#ffd27a"/>`; }
      else if (k === 1) s += `<path d="M${cx},${cy - ch * .34} L${cx + cw * .36},${cy} L${cx},${cy + ch * .34} L${cx - cw * .36},${cy}Z" fill="#efe6d6" stroke="#b8a888" stroke-width="2"/><path d="M${cx},${cy - ch * .34} L${cx + cw * .36},${cy} L${cx},${cy + ch * .34} L${cx - cw * .36},${cy}Z" fill="none" stroke="#fff" stroke-width="5" opacity=".5" transform="translate(-3 -3)"/>`;
      else s += `<rect x="${cx - cw * .3}" y="${cy - ch * .3}" width="${cw * .6}" height="${ch * .6}" rx="6" fill="#a9c47c" stroke="#5c8a4a" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${cw * .1}" fill="#c8372d"/>`;
    }
    return s;
  }
  // the hamper seen from above: diyas, a sweet box, a card, marigolds
  function hamperTop(w, h, imgs) {
    let s = `<rect width="${w}" height="${h}" fill="#e9d8b0"/>`;
    const R = rng(8); for (let i = 0; i < 400; i++) s += `<path d="M${f1(R() * w)},${f1(R() * h)} l${f1((R() - .5) * 30)},${f1((R() - .5) * 8)}" stroke="#c9a870" stroke-width="2"/>`;
    s += `<image href="${imgs.medallion}" x="${w * .06}" y="${h * .1}" width="${h * .8}" height="${h * .8}"/>`;
    for (let i = 0; i < 3; i++) s += `<g transform="translate(${w * .62 + i * w * .11} ${h * .32})">${diyaPainted(0, 0, 0.9, i)}</g>`;
    s += `<rect x="${w * .56}" y="${h * .56}" width="${w * .36}" height="${h * .3}" rx="6" fill="${C.ivory}" stroke="${GOLD}" stroke-width="4" transform="rotate(-4 ${w * .74} ${h * .7})"/>`;
    for (let i = 0; i < 6; i++) s += `<circle cx="${f1(w * (.08 + R() * .84))}" cy="${f1(h * (R() > .5 ? .05 : .95))}" r="16" fill="${i % 2 ? '#f2b21e' : '#e8641e'}" stroke="${LINE}"/>`;
    return s;
  }
  // a hand-painted terracotta diya, three-quarter view, centre of the rim at (x, y)
  function diyaPainted(x, y, s, v = 0, t = 0, lit = 0) {
    const body = [C.clay, C.indigo, C.sindoor][v % 3], band = [C.kesar, C.gold, C.kamal][v % 3];
    let g = `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-110,0 C-100,70 100,70 110,0 L150,-14 C138,18 120,30 104,32 C70,90 -70,90 -102,40 C-108,28 -110,14 -110,0Z" fill="${body}" stroke="${LINE}" stroke-width="3"/>
      <path d="M-96,34 C-60,64 60,64 96,34" fill="none" stroke="${band}" stroke-width="10"/>`;
    for (let i = 0; i < 9; i++) { const a = -0.9 + i * 0.225, px = Math.sin(a) * 92, py = 20 + Math.cos(a) * 30;
      g += `<path transform="translate(${f1(px)} ${f1(py)})" d="M0,0 C-6,-6 -6,-14 0,-20 C6,-14 6,-6 0,0Z" fill="${v % 3 === 1 ? C.kamal : C.ivory}" stroke="${LINE}" stroke-width="1"/>`; }
    for (let i = 0; i < 11; i++) g += `<circle cx="${-80 + i * 16}" cy="${f1(56 + Math.sin(i / 10 * Math.PI) * 10)}" r="3" fill="${C.ivory}"/>`;
    g += `<ellipse cx="0" cy="0" rx="110" ry="24" fill="${shade(body, -0.3)}" stroke="${LINE}" stroke-width="3"/><ellipse cx="6" cy="2" rx="92" ry="16" fill="#5a2e0c"/><ellipse cx="-10" cy="-2" rx="50" ry="6" fill="#d9a860" opacity=".5"/>`;
    g += `<path d="M110,0 L150,-14" stroke="${GOLD}" stroke-width="4"/>`;
    if (lit > 0) g += `<circle cx="138" cy="-60" r="${110 * lit}" fill="url(#swGlow)"/>` + flame(138, -10, 1.9 * lit, t, v * 3);
    return g + '</g>';
  }

  // ---------- brand mark: a diya whose flame is a lotus bud, under a cusped jharokha arch ----------
  const ARCH = 'M92 292V196C92 150 120 118 152 104C150 80 176 60 200 40C224 60 250 80 248 104C280 118 308 150 308 196V292';
  const BOWL = 'M70 296H330C326 334 280 358 200 358S74 334 70 296ZM330 296L366 282C358 304 344 314 326 316Z';
  const FLAME = 'M200 150C226 186 234 222 220 250C212 264 188 264 180 250C166 222 174 186 200 150Z';
  const PETALS = 'M200 262C178 252 160 232 156 206C176 214 192 232 200 262ZM200 262C222 252 240 232 244 206C224 214 208 232 200 262Z';
  function mark(ink, flameC = C.kesar, o = {}) {
    return `<path d="${ARCH}" fill="none" stroke="${ink}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${BOWL}" fill="${ink}"/><path d="${PETALS}" fill="${o.petal || ink}"/><path d="${FLAME}" fill="${flameC}"/>
      <circle cx="150" cy="322" r="6" fill="${o.dot || C.ivory}"/><circle cx="200" cy="330" r="6" fill="${o.dot || C.ivory}"/><circle cx="250" cy="322" r="6" fill="${o.dot || C.ivory}"/>`;
  }

  // ---------- icons (viewBox 0 0 48 48, currentColor) ----------
  const I = {
    diya: '<path d="M6 28h30l8-3c-1 5-4 7-7 7-4 6-22 6-26 0-3-1-5-2-5-4z"/><path d="M38 23c-3-3-3-8 1-13 3 5 3 10-1 13z" opacity=".8"/>',
    lotus: '<path d="M24 40c-4-6-4-16 0-26 4 10 4 20 0 26z"/><path d="M24 40C16 38 10 30 10 20c8 4 12 12 14 20zM24 40c8-2 14-10 14-20-8 4-12 12-14 20z" opacity=".8"/><path d="M24 40C14 42 6 36 3 28c8 0 15 4 21 12zM24 40c10 2 18-4 21-12-8 0-15 4-21 12z" opacity=".6"/>',
    laddoo: '<circle cx="14" cy="34" r="8"/><circle cx="34" cy="34" r="8"/><circle cx="24" cy="20" r="8"/><path d="M4 44h40" stroke="currentColor" stroke-width="3"/>',
    gift: '<rect x="6" y="18" width="36" height="24" rx="2"/><rect x="4" y="12" width="40" height="8" rx="2" opacity=".75"/><path d="M24 12c-4-8-14-8-12-2 1 3 8 2 12 2zM24 12c4-8 14-8 12-2-1 3-8 2-12 2z" opacity=".8"/>',
    home: '<path d="M6 22L24 8l18 14v20H6z"/><path d="M19 42V30a5 5 0 0 1 10 0v12z" fill="#fff" opacity=".6"/>',
    arch: '<path d="M8 44V22c0-6 4-10 8-11 0-4 4-7 8-9 4 2 8 5 8 9 4 1 8 5 8 11v22h-8V24a8 8 0 0 0-16 0v20z"/>',
    bow: '<path d="M12 4c18 8 18 32 0 40" fill="none" stroke="currentColor" stroke-width="4"/><path d="M12 4v40" stroke="currentColor" stroke-width="1.5"/><path d="M6 24h36l-6-4M42 24l-6 4" fill="none" stroke="currentColor" stroke-width="2.5"/>',
    kalash: '<path d="M14 18h20c6 6 8 12 4 18-3 5-25 5-28 0-4-6-2-12 4-18z"/><path d="M16 18c-2-4 2-6 8-6s10 2 8 6" opacity=".7"/><path d="M24 12c-4-6 0-10 0-10s4 4 0 10z"/>',
    marigold: '<circle cx="24" cy="24" r="8"/><g opacity=".75"><circle cx="24" cy="10" r="6"/><circle cx="24" cy="38" r="6"/><circle cx="10" cy="24" r="6"/><circle cx="38" cy="24" r="6"/><circle cx="14" cy="14" r="6"/><circle cx="34" cy="34" r="6"/><circle cx="34" cy="14" r="6"/><circle cx="14" cy="34" r="6"/></g>',
    peacock: '<path d="M24 46c-2-10-2-20 0-30" stroke="currentColor" stroke-width="2" fill="none"/><ellipse cx="24" cy="14" rx="10" ry="13"/><ellipse cx="24" cy="14" rx="5" ry="7" fill="#fff" opacity=".6"/><circle cx="24" cy="14" r="3"/>',
    rangoli: '<g><path d="M24 4l5 15 15 5-15 5-5 15-5-15-15-5 15-5z"/><circle cx="24" cy="24" r="5" fill="#fff" opacity=".6"/></g><circle cx="8" cy="8" r="3"/><circle cx="40" cy="8" r="3"/><circle cx="8" cy="40" r="3"/><circle cx="40" cy="40" r="3"/>',
    sparkle: '<path d="M24 2l4 18 18 4-18 4-4 18-4-18L2 24l18-4z"/>',
    moon: '<path d="M30 6a18 18 0 1 0 12 30A16 16 0 0 1 30 6z"/>',
    sun: '<circle cx="24" cy="24" r="9"/><path d="M24 3v8M24 37v8M3 24h8M37 24h8M9 9l6 6M33 33l6 6M9 39l6-6M33 15l6-6" stroke="currentColor" stroke-width="3"/>',
    elephant: '<path d="M10 38V24c0-8 6-14 16-14 8 0 14 6 14 12v6c0 4 2 6 4 6v4c-4 0-8-2-8-6v-2h-2v10h-6v-8h-8v8h-6v-8c-2 0-4 0-4 0z"/><circle cx="30" cy="20" r="2" fill="#fff"/>',
    toran: '<path d="M2 8h44" stroke="currentColor" stroke-width="3"/><path d="M6 8c0 10 4 14 4 14s4-4 4-14M18 8c0 10 4 14 4 14s4-4 4-14M30 8c0 10 4 14 4 14s4-4 4-14" /><circle cx="12" cy="32" r="4"/><circle cx="24" cy="36" r="4"/><circle cx="36" cy="32" r="4"/>',
    family: '<circle cx="14" cy="12" r="5"/><circle cx="34" cy="12" r="5"/><circle cx="24" cy="24" r="4"/><path d="M6 44V24c0-4 4-6 8-6s8 2 8 6v20zM26 44V24c0-4 4-6 8-6s8 2 8 6v20z" opacity=".85"/><path d="M19 44V34c0-3 2-4 5-4s5 1 5 4v10z"/>',
    heart: '<path d="M24 41S6 30 6 18c0-6 5-10 10-10 4 0 7 2 8 5 1-3 4-5 8-5 5 0 10 4 10 10 0 12-18 23-18 23z"/>',
    brush: '<path d="M30 4l14 14-16 12-10-10z"/><path d="M16 22l10 10c-2 8-10 12-20 12 2-4 0-10 4-16 2-3 4-5 6-6z" opacity=".8"/>',
    paisley: '<path d="M30 6c10 2 14 12 10 22-4 12-18 18-30 14 10-2 14-8 12-14-2-4-8-4-8-10 0-8 8-14 16-12z"/><circle cx="30" cy="18" r="4" fill="#fff" opacity=".6"/>',
    card: '<rect x="4" y="10" width="40" height="28" rx="3"/><path d="M4 12l20 14 20-14" fill="none" stroke="#fff" stroke-width="2.5" opacity=".7"/>',
    truck: '<rect x="3" y="12" width="28" height="20" rx="2"/><path d="M31 18h8l6 7v7H31z"/><circle cx="12" cy="36" r="5"/><circle cx="37" cy="36" r="5"/>',
    bag: '<path d="M8 16h32l-3 28H11z"/><path d="M17 18v-6a7 7 0 0 1 14 0v6" fill="none" stroke="currentColor" stroke-width="3"/>',
    swan: '<path d="M10 34c6 8 24 8 32-2-6 0-10-2-12-6l-2-12c0-6-8-8-10-2 4-2 6 0 6 4v12c-6-2-12 0-14 6z"/>',
    bell: '<path d="M8 34a16 16 0 0 1 32 0z"/><rect x="5" y="35" width="38" height="4" rx="2"/><circle cx="24" cy="16" r="3"/><path d="M24 40v5" stroke="currentColor" stroke-width="3"/>',
    star: '<path d="M24 4l6 13 14 2-10 10 3 14-13-7-13 7 3-14L4 19l14-2z"/>',
    mango: '<path d="M26 10c12 0 18 10 16 20s-14 14-24 12S4 30 10 20c3-6 8-10 16-10z"/><path d="M26 10c0-4 2-6 6-8" stroke="currentColor" stroke-width="3" fill="none"/>',
    leaf: '<path d="M10 38C8 20 20 8 40 8c0 20-12 32-30 30z"/><path d="M10 38L30 18" stroke="#fff" stroke-width="2" opacity=".6"/>',
  };
  const icon = (n, size, color, extra = '') => `<svg class="ic" viewBox="0 0 48 48" width="${size}" height="${size}" style="color:${color};fill:${color};${extra}">${I[n]}</svg>`;

  // ---------- rasterise ----------
  async function raster(body, w, h, scale = 1.5) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w * scale}" height="${h * scale}" viewBox="0 0 ${w} ${h}">${DEFS}${body}</svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const img = new Image(); img.src = url; await img.decode();
    const cv = document.createElement('canvas'); cv.width = w * scale; cv.height = h * scale;
    cv.getContext('2d').drawImage(img, 0, 0); URL.revokeObjectURL(url);
    return URL.createObjectURL(await new Promise(r => cv.toBlob(r, 'image/png')));
  }
  const IMG = {};
  async function init() {
    const B = (s, wall) => s + border({ col: wall || '#8e1f22' });
    IMG.courtBack = await raster(SETS.court({ wall: C.indigo }).back, 1280, 720, 1.5);
    IMG.courtRed = await raster(SETS.court({ wall: C.sindoor }).back, 1280, 720, 1.5);
    IMG.glade = await raster(SETS.glade({}).back, 1280, 720, 1.5);
    IMG.pond = await raster(SETS.pond({}).back, 1280, 720, 1.5);
    IMG.ocean = await raster((SETS.ocean ? SETS.ocean({}) : SETS.pond({})).back, 1280, 720, 1.5);
    IMG.border = await raster(border({ col: C.sindoor }), 1280, 720, 1.5);
    IMG.grain = await raster(grain(4), 1280, 720, 1);
    IMG.homecoming = await raster(B(homecoming(0.5)), 1280, 720, 1.2);
    IMG.medallion = await raster(medallion(0.5), 800, 800, 1);
    IMG.medallionBlue = await raster(medallion(0.5, C.pista), 800, 800, 1);
    IMG.patIndigo = await raster(pattern(800, 400, C.indigo, 3), 800, 400, 1);
    IMG.patRed = await raster(pattern(800, 400, C.sindoor, 5), 800, 400, 1);
    IMG.patPink = await raster(pattern(800, 400, C.kamal, 9), 800, 400, 1);
    IMG.sweets = await raster(sweetsTray(600, 600), 600, 600, 1);
    const toData = u => fetch(u).then(r => r.blob()).then(b => new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(b); }));
    IMG.hamperTop = await raster(hamperTop(900, 560, { medallion: await toData(IMG.medallion) }), 900, 560, 1);
    IMG.vanvaas = await raster(B(vanvaas(0.3)), 1280, 720, 1);
    IMG.swayamvar = await raster(B(swayamvar(0.3)), 1280, 720, 1);
    IMG.panchavati = await raster(B(panchavati(0.3)), 1280, 720, 1);
    IMG.setu = await raster(B(setu(0.3)), 1280, 720, 1);
    IMG.terrace = await raster(terrace(), 1280, 720, 1.5);
    IMG.chip = await raster(`<rect width="400" height="300" fill="${C.kamal}"/><g transform="translate(-440 -260) scale(1)">${pair(640, 520, 0.62, 0.4)}</g>`, 400, 300, 1);
  }

  window.Art = { C, PALETTE, FAM, fig, pair, diyaSmall, diyaPainted, marigoldString, firework, pushpak, cloud, homecoming, terrace, vanvaas, panchavati, swayamvar, setu, medallion,
    mark, ARCH, BOWL, FLAME, PETALS, I, icon, IMG, init, DEFS, lotusBud, flame, stars, moon, swirls, shade, GOLD, LINE };
})();
