/* Collage look for LUMEN documentaries (meta.look: "collage").
   An original paper-and-marker documentary style: textured paper grounds, torn cut-out portraits with halftone shading
   and masking tape, highlighter sweeps over quoted text, red marker scribbles, pins and red string, bold condensed
   headlines and a newsprint grain over everything. Characters are drawn procedurally from a few face parameters
   (hair, beard, brows, mood), so no photographs or other artists' images are used.
   Loaded after explainer.js (and cinema.js); registers itself through Toon.ext. */
(function () {
  const X = window.Toon.ext;
  const { W, H, clamp, lerp, ease, easeOut, back, f1, rng, mix, esc, rrect, glow, nid } = X;
  const HEAD = "'Archivo Black', Impact, sans-serif", BODY = "'Libre Franklin', Arial, sans-serif", MARK = "'Permanent Marker', cursive";
  const SERIF = "'Playfair Display', Georgia, serif", TYPE = "'Special Elite', 'Courier New', monospace";
  const FONTS = { head: HEAD, body: BODY, mark: MARK, serif: SERIF, type: TYPE };
  const PAPER = '#efe7d6', INK = '#1d1b19', RED = '#d23a2e', YEL = '#ffd23f', GREY = '#8c877e';
  const collage = () => (X.EP && X.EP.meta && X.EP.meta.look) === 'collage';

  function T(s, x, y, size, o = {}) {
    const lines = String(s).split('\n'), lh = size * (o.lh || 1.2), y0 = y - (lines.length - 1) * lh / 2;
    const font = FONTS[o.font] || o.font || BODY;
    return lines.map((l, i) => `<text x="${f1(x)}" y="${f1(y0 + i * lh)}" font-family="${font}" font-size="${size}" font-weight="${o.weight || 500}"${o.italic ? ' font-style="italic"' : ''} fill="${o.fill || INK}" text-anchor="${o.anchor || 'middle'}" dominant-baseline="central"${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}>${esc(l)}</text>`).join('');
  }
  const TW = (s, size, weight, font) => X.textW(s, size, weight || 500, FONTS[font] || font || BODY);

  // ---------- paper helpers ----------
  /* A rectangle with torn, slightly irregular edges. */
  function torn(w, h, seed, jag = 4, step = 9) {
    const r = rng('torn' + seed), pts = [];
    const side = (x0, y0, x1, y1) => { const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / step)); for (let i = 0; i < n; i++) { const q = i / n; pts.push([lerp(x0, x1, q) + (r() - 0.5) * jag, lerp(y0, y1, q) + (r() - 0.5) * jag]); } };
    side(-w / 2, -h / 2, w / 2, -h / 2); side(w / 2, -h / 2, w / 2, h / 2); side(w / 2, h / 2, -w / 2, h / 2); side(-w / 2, h / 2, -w / 2, -h / 2);
    return 'M' + pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join('L') + 'Z';
  }
  const drop = (d, o = 0.28, dx = 5, dy = 7) => `<path d="${d}" transform="translate(${dx} ${dy})" fill="#2a2015" opacity="${o}"/>`;
  function tape(x, y, rot, w = 70, seed = 't') {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><path d="${torn(w, 22, seed, 3, 6)}" fill="#e9dcae" opacity="0.82"/><path d="${torn(w, 22, seed, 3, 6)}" fill="none" stroke="#c9b67e" stroke-width="0.8" opacity="0.6"/></g>`;
  }
  function halftone(color, size = 7, r = 1.6, op = 1) {
    const id = nid('ht');
    return [id, `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="${color}" opacity="${op}"/></pattern>`];
  }
  /* A wobbly hand-drawn stroke along points, drawn up to fraction d. */
  function wob(pts, seed, amp = 2) {
    const r = rng('wob' + seed);
    return pts.map(([x, y]) => [x + (r() - 0.5) * amp, y + (r() - 0.5) * amp]);
  }
  function polyD(pts, d = 1) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    let left = L * clamp(d), s = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
    for (let i = 1; i < pts.length && left > 0; i++) {
      const l = seg[i - 1], q = Math.min(1, left / l);
      s += `L${f1(lerp(pts[i - 1][0], pts[i][0], q))} ${f1(lerp(pts[i - 1][1], pts[i][1], q))}`; left -= l;
    }
    return s;
  }

  // ---------- palettes and backgrounds ----------
  Object.assign(X.PAL, {
    cream: { top: '#efe7d6', bot: '#e3d8c1', glow: '#fff6dc', fx: '#c8b892', line: '#d6c9ab' },
    news: { top: '#e9e6dd', bot: '#dcd8cc', glow: '#ffffff', fx: '#b9b4a6', line: '#cfcabd' },
    night: { top: '#1b1c22', bot: '#26262c', glow: '#3d3a3a', fx: '#5a5650', line: '#2f3036' },
    oxblood: { top: '#5a1a17', bot: '#3e100f', glow: '#a83a2c', fx: '#c9776a', line: '#6a2420' },
    mustard: { top: '#e2b347', bot: '#d39f31', glow: '#ffe08a', fx: '#a7771c', line: '#cf9f3c' },
    slate: { top: '#2c3a44', bot: '#1f2a32', glow: '#4f6878', fx: '#7e95a3', line: '#364651' },
    sage: { top: '#c9d1bd', bot: '#b7c0a9', glow: '#eef3e2', fx: '#8f9a80', line: '#bcc5ae' },
  });
  /* Flat textured paper: fibres, a faint grid or ruled lines, a few torn scraps of a second tone, parallax drift. */
  X.BG.paperc = (bg, t, cam, P) => {
    let s = `<rect x="-40" y="-40" width="${W + 80}" height="${H + 80}" fill="${P.top}"/>`;
    const r = rng('pc' + (bg.seed || bg.pal));
    for (let i = 0; i < 7; i++) s += `<ellipse cx="${f1(r() * W - cam.px * 0.05)}" cy="${f1(r() * H)}" rx="${f1(160 + r() * 260)}" ry="${f1(100 + r() * 180)}" fill="${P.bot}" opacity="${f1(0.15 + r() * 0.2)}"/>`;
    if (bg.grid) for (let x = -40; x < W + 40; x += 40) s += `<path d="M${f1(x - (cam.px * 0.15) % 40)} -40V${H + 40}" stroke="${P.line}" stroke-width="1"/>`;
    if (bg.grid) for (let y = -40; y < H + 40; y += 40) s += `<path d="M-40 ${f1(y - (cam.py * 0.15) % 40)}H${W + 40}" stroke="${P.line}" stroke-width="1"/>`;
    if (bg.ruled) for (let y = 60; y < H; y += 34) s += `<path d="M-40 ${y}H${W + 40}" stroke="${P.line}" stroke-width="1.2"/>`;
    const scraps = bg.scraps == null ? 2 : bg.scraps, cols = bg.scrapColors || [P.bot, P.fx];
    for (let i = 0; i < scraps; i++) {
      const w = 260 + r() * 360, h = 120 + r() * 220, x = (i % 2 ? W - 120 : 120) + (r() - 0.5) * 200 - cam.px * 0.25, y = 120 + r() * (H - 240) - cam.py * 0.25;
      s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1((r() - 0.5) * 16)})"><path d="${torn(w, h, 'sc' + i + bg.pal, 6, 12)}" fill="${cols[i % cols.length]}" opacity="${f1(0.25 + r() * 0.2)}"/></g>`;
    }
    for (let i = 0; i < 24; i++) {   // fibres
      const x = r() * W, y = r() * H, a = r() * 6.28, l = 10 + r() * 30;
      s += `<path d="M${f1(x)} ${f1(y)}l${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)}" stroke="${P.fx}" stroke-width="0.8" opacity="0.35"/>`;
    }
    if (bg.light) s += glow(640 - cam.px * 0.1, 300, 600, P.glow, bg.light);
    return s;
  };

  // ---------- faces ----------
  const SKIN = '#ddd3c4', SKIN2 = '#a99f91', HAIRC = { black: '#1f1d1c', dark: '#3a332d', brown: '#5b4636', fair: '#b59a6a', grey: '#9a958c', white: '#d9d5cc', red: '#7a4a2e' };
  const PRESET = {
    dostoevsky: { hair: 'bald', hairC: 'brown', beard: 'long', beardC: 'brown', mous: 1, brow: 0.3, eyes: 'deep', coat: '#2b2a2c', tie: 'bow', face: 1.04, mouth: -0.2 },
    stavrogin: { hair: 'parted', hairC: 'black', beard: 'none', brow: 0, eyes: 'calm', coat: '#232326', tie: 'cravat', face: 0.98, mouth: 0, jaw: 0.9, handsome: 1 },
    pyotr: { hair: 'swept', hairC: 'fair', beard: 'none', brow: -0.3, eyes: 'narrow', coat: '#4a4740', tie: 'loose', face: 0.92, mouth: 0.5, smirk: 1, tilt: -6 },
    stepan: { hair: 'long', hairC: 'white', beard: 'none', brow: 0.6, eyes: 'soft', coat: '#5a5048', tie: 'scarf', scarfC: '#b0473a', face: 1.0, mouth: 0.15, lorgnette: 1 },
    shatov: { hair: 'shaggy', hairC: 'fair', beard: 'full', beardC: 'fair', brow: -0.5, eyes: 'deep', coat: '#3c3a36', tie: 'none', face: 1.06, mouth: -0.3, jaw: 1.15 },
    kirillov: { hair: 'cropped', hairC: 'black', beard: 'none', brow: 0.1, eyes: 'wide', coat: '#2a2a2c', tie: 'none', face: 0.94, mouth: 0, gaunt: 1 },
    shigalyov: { hair: 'flat', hairC: 'dark', beard: 'none', brow: 0.5, eyes: 'down', coat: '#3a3a3a', tie: 'none', face: 1.1, mouth: -0.5, ears: 1.9, long: 1.15 },
    liputin: { hair: 'bald', hairC: 'grey', beard: 'none', mous: 1, brow: -0.2, eyes: 'narrow', coat: '#4c463c', tie: 'cravat', face: 0.95, mouth: 0.35, smirk: 1 },
    varvara: { hair: 'bun', hairC: 'grey', female: 1, brow: -0.3, eyes: 'calm', coat: '#2c2630', tie: 'collar', face: 1.0, mouth: -0.1 },
    yulia: { hair: 'curls', hairC: 'brown', female: 1, brow: 0.2, eyes: 'soft', coat: '#7a3d55', tie: 'collar', face: 0.96, mouth: 0.4, earring: 1 },
    marya: { hair: 'scarf', hairC: 'dark', scarfC: '#6a7f9a', female: 1, brow: 0.6, eyes: 'wide', coat: '#5d6470', tie: 'none', face: 0.9, mouth: 0.5, gaunt: 1 },
    lebyadkin: { hair: 'short', hairC: 'red', beard: 'none', mous: 1.4, brow: 0.2, eyes: 'wide', coat: '#5b3a2c', tie: 'none', face: 1.14, mouth: 0.2, jaw: 1.2 },
    karmazinov: { hair: 'curly', hairC: 'grey', beard: 'none', brow: 0.2, eyes: 'narrow', coat: '#3d3d46', tie: 'bow', face: 0.86, mouth: 0.25, smirk: 1 },
    lembke: { hair: 'short', hairC: 'fair', beard: 'none', mous: 1.2, brow: 0.6, eyes: 'wide', coat: '#2f3a52', tie: 'uniform', face: 1.0, mouth: -0.3 },
    erkel: { hair: 'short', hairC: 'fair', beard: 'none', brow: 0.1, eyes: 'wide', coat: '#4a4a42', tie: 'none', face: 0.86, mouth: 0, young: 1 },
    fedka: { hair: 'convict', hairC: 'dark', beard: 'short', beardC: 'dark', brow: -0.7, eyes: 'narrow', coat: '#4d4438', tie: 'none', face: 1.08, mouth: 0.4, smirk: 1 },
    nechayev: { hair: 'short', hairC: 'dark', beard: 'short', beardC: 'dark', mous: 0.8, brow: -0.6, eyes: 'wide', coat: '#222', tie: 'none', face: 0.92, mouth: -0.2 },
    ivanov: { hair: 'short', hairC: 'brown', beard: 'none', brow: 0.3, eyes: 'soft', coat: '#3f3b35', tie: 'none', face: 0.98, mouth: 0, glasses: 1, young: 1 },
    tikhon: { hair: 'monk', hairC: 'white', beard: 'long', beardC: 'white', brow: 0.5, eyes: 'soft', coat: '#151515', tie: 'none', face: 1.0, mouth: 0.1 },
    sofya: { hair: 'scarf', hairC: 'brown', scarfC: '#7d6a4a', female: 1, brow: 0.4, eyes: 'soft', coat: '#5c5246', tie: 'none', face: 0.95, mouth: 0.3 },
    lisa: { hair: 'curls', hairC: 'dark', female: 1, brow: -0.1, eyes: 'wide', coat: '#3c4a5a', tie: 'collar', face: 0.94, mouth: -0.1 },
    marie: { hair: 'bun', hairC: 'dark', female: 1, brow: 0.3, eyes: 'soft', coat: '#4a4258', tie: 'none', face: 0.94, mouth: 0.1, gaunt: 1 },
    gorky: { hair: 'brush', hairC: 'brown', beard: 'none', mous: 1.6, brow: -0.2, eyes: 'deep', coat: '#3a3530', tie: 'none', face: 1.08, mouth: -0.2, long: 1.08 },
    camus: { hair: 'swept', hairC: 'black', beard: 'none', brow: 0.1, eyes: 'calm', coat: '#3d3f45', tie: 'cravat', face: 0.98, mouth: 0.1 },
    berdyaev: { hair: 'curly', hairC: 'dark', beard: 'short', beardC: 'dark', mous: 1, brow: 0.2, eyes: 'deep', coat: '#2e2b29', tie: 'bow', face: 1.0, mouth: 0 },
    bakunin: { hair: 'curly', hairC: 'grey', beard: 'full', beardC: 'grey', brow: 0.1, eyes: 'wide', coat: '#2d2d2d', tie: 'none', face: 1.2, mouth: 0, jaw: 1.25 },
    student: { hair: 'short', hairC: 'dark', beard: 'none', brow: 0, eyes: 'calm', coat: '#3a3833', tie: 'none', face: 0.95, mouth: 0, young: 1 },
  };
  /* A head-and-shoulders bust centred on the head; r is the head radius. */
  function bust(q, t, seed, r = 60) {
    const fa = q.face || 1, hw = r * 0.8 * fa * (q.gaunt ? 0.9 : 1), hh = r * (q.long || 1), hc = HAIRC[q.hairC] || q.hairC || HAIRC.dark;
    const bc = HAIRC[q.beardC] || hc, look = q.look || [0, 0], blinkP = (t * 0.31 + (rng('bl' + seed)() * 3)) % 3.6, blink = blinkP < 0.12 ? 1 - Math.abs(blinkP - 0.06) / 0.06 : 0;
    let s = '';
    // shoulders and coat
    const sw = r * 2.3, sy = hh * 0.95;
    s += `<path d="M${f1(-sw)} ${f1(sy + r * 2.2)}C${f1(-sw)} ${f1(sy + r * 0.6)} ${f1(-sw * 0.62)} ${f1(sy + r * 0.25)} ${f1(-r * 0.4)} ${f1(sy)}H${f1(r * 0.4)}C${f1(sw * 0.62)} ${f1(sy + r * 0.25)} ${f1(sw)} ${f1(sy + r * 0.6)} ${f1(sw)} ${f1(sy + r * 2.2)}Z" fill="${q.coat || '#333'}"/>`;
    s += `<path d="M${f1(sw * 0.15)} ${f1(sy + r * 0.2)}C${f1(sw * 0.6)} ${f1(sy + r * 0.4)} ${f1(sw * 0.9)} ${f1(sy + r * 0.9)} ${f1(sw)} ${f1(sy + r * 2.2)}H${f1(sw * 0.3)}Z" fill="#000" opacity="0.22"/>`;
    // neck
    s += `<path d="M${f1(-r * 0.3)} ${f1(hh * 0.55)}V${f1(sy + r * 0.25)}H${f1(r * 0.3)}V${f1(hh * 0.55)}Z" fill="${SKIN2}"/>`;
    // collar / tie
    const tie = q.tie || 'none';
    if (tie !== 'none') s += `<path d="M${f1(-r * 0.42)} ${f1(sy - 4)}L0 ${f1(sy + r * 0.62)}L${f1(r * 0.42)} ${f1(sy - 4)}L${f1(r * 0.2)} ${f1(sy + r * 0.9)}H${f1(-r * 0.2)}Z" fill="${tie === 'uniform' ? '#2f3a52' : '#f2eee6'}"/>`;
    if (tie === 'bow') s += `<path d="M0 ${f1(sy + r * 0.3)}l${f1(-r * 0.3)} ${f1(-r * 0.16)}v${f1(r * 0.32)}Z M0 ${f1(sy + r * 0.3)}l${f1(r * 0.3)} ${f1(-r * 0.16)}v${f1(r * 0.32)}Z" fill="#141414"/>`;
    if (tie === 'cravat') s += `<path d="M${f1(-r * 0.18)} ${f1(sy + r * 0.1)}Q0 ${f1(sy + r * 0.25)} ${f1(r * 0.18)} ${f1(sy + r * 0.1)}L${f1(r * 0.12)} ${f1(sy + r * 0.8)}L0 ${f1(sy + r * 0.95)}L${f1(-r * 0.12)} ${f1(sy + r * 0.8)}Z" fill="#1a1a1c"/>`;
    if (tie === 'scarf') s += `<path d="M${f1(-r * 0.6)} ${f1(sy - 2)}Q0 ${f1(sy + r * 0.45)} ${f1(r * 0.6)} ${f1(sy - 2)}Q${f1(r * 0.5)} ${f1(sy + r * 0.5)} ${f1(r * 0.15)} ${f1(sy + r * 0.5)}L${f1(r * 0.35)} ${f1(sy + r * 1.6)}H${f1(-r * 0.05)}L${f1(-r * 0.05)} ${f1(sy + r * 0.5)}Q${f1(-r * 0.5)} ${f1(sy + r * 0.5)} ${f1(-r * 0.6)} ${f1(sy - 2)}Z" fill="${q.scarfC || RED}"/>`;
    if (tie === 'collar') s += `<path d="M${f1(-r * 0.5)} ${f1(sy - 2)}Q0 ${f1(sy + r * 0.35)} ${f1(r * 0.5)} ${f1(sy - 2)}L${f1(r * 0.42)} ${f1(sy + r * 0.2)}Q0 ${f1(sy + r * 0.55)} ${f1(-r * 0.42)} ${f1(sy + r * 0.2)}Z" fill="#efe9de"/>`;
    if (tie === 'uniform') s += `<path d="M${f1(-r * 0.5)} ${f1(sy + r * 0.05)}H${f1(r * 0.5)}V${f1(sy + r * 0.25)}H${f1(-r * 0.5)}Z" fill="#c9a24a"/><circle cx="0" cy="${f1(sy + r * 0.9)}" r="${f1(r * 0.06)}" fill="#c9a24a"/><circle cx="0" cy="${f1(sy + r * 1.3)}" r="${f1(r * 0.06)}" fill="#c9a24a"/><path d="M${f1(-sw * 0.85)} ${f1(sy + r * 0.55)}h${f1(r * 0.7)}" stroke="#c9a24a" stroke-width="${f1(r * 0.1)}"/><path d="M${f1(sw * 0.85)} ${f1(sy + r * 0.55)}h${f1(-r * 0.7)}" stroke="#c9a24a" stroke-width="${f1(r * 0.1)}"/>`;
    // hair behind the head
    const hb = { long: `M${f1(-hw * 1.08)} ${f1(-hh * 0.4)}Q${f1(-hw * 1.3)} ${f1(hh * 0.9)} ${f1(-hw * 0.9)} ${f1(hh * 1.15)}H${f1(hw * 0.9)}Q${f1(hw * 1.3)} ${f1(hh * 0.9)} ${f1(hw * 1.08)} ${f1(-hh * 0.4)}Z`,
      bun: `M${f1(-r * 0.36)} ${f1(-hh * 0.95)}a${f1(r * 0.36)} ${f1(r * 0.3)} 0 1 0 ${f1(r * 0.72)} 0a${f1(r * 0.36)} ${f1(r * 0.3)} 0 1 0 ${f1(-r * 0.72)} 0Z`,
      curls: `M${f1(-hw * 1.2)} ${f1(-hh * 0.3)}Q${f1(-hw * 1.35)} ${f1(hh * 0.6)} ${f1(-hw * 0.8)} ${f1(hh * 0.7)}H${f1(hw * 0.8)}Q${f1(hw * 1.35)} ${f1(hh * 0.6)} ${f1(hw * 1.2)} ${f1(-hh * 0.3)}Z` }[q.hair];
    if (hb) s += `<path d="${hb}" fill="${hc}"/>`;
    if (q.hair === 'scarf') s += `<path d="M${f1(-hw * 1.15)} ${f1(-hh * 0.2)}Q${f1(-hw * 1.2)} ${f1(hh * 0.9)} ${f1(-hw * 1.5)} ${f1(hh * 1.3)}H${f1(hw * 1.5)}Q${f1(hw * 1.2)} ${f1(hh * 0.9)} ${f1(hw * 1.15)} ${f1(-hh * 0.2)}Z" fill="${mix(q.scarfC || '#666', '#000', 0.2)}"/>`;
    // ears
    const ek = q.ears || 1;
    for (const sx of [-1, 1]) s += `<ellipse cx="${f1(sx * hw * 0.98)}" cy="${f1(hh * 0.05)}" rx="${f1(r * 0.13 * ek)}" ry="${f1(r * 0.22 * ek)}" fill="${sx > 0 ? SKIN2 : SKIN}"/>`;
    // head with a jaw
    const jaw = q.jaw || 1, chin = hh * (q.female ? 0.95 : 1.0);
    const headD = `M0 ${f1(-hh)}C${f1(hw * 0.62)} ${f1(-hh)} ${f1(hw)} ${f1(-hh * 0.6)} ${f1(hw)} ${f1(-hh * 0.05)}C${f1(hw)} ${f1(hh * 0.45)} ${f1(hw * 0.55 * jaw)} ${f1(chin)} 0 ${f1(chin)}C${f1(-hw * 0.55 * jaw)} ${f1(chin)} ${f1(-hw)} ${f1(hh * 0.45)} ${f1(-hw)} ${f1(-hh * 0.05)}C${f1(-hw)} ${f1(-hh * 0.6)} ${f1(-hw * 0.62)} ${f1(-hh)} 0 ${f1(-hh)}Z`;
    const cl = nid('hd'), [ht, htDef] = halftone('#6e665b', 6, 1.5);
    s += htDef + `<clipPath id="${cl}"><path d="${headD}"/></clipPath><path d="${headD}" fill="${SKIN}"/>`;
    s += `<g clip-path="url(#${cl})"><ellipse cx="${f1(hw * 0.95)}" cy="${f1(hh * 0.2)}" rx="${f1(hw * 0.6)}" ry="${f1(hh * 1.2)}" fill="${SKIN2}" opacity="0.7"/><ellipse cx="${f1(hw * 0.75)}" cy="${f1(hh * 0.2)}" rx="${f1(hw * 0.55)}" ry="${f1(hh * 1.2)}" fill="url(#${ht})"/>`;
    if (q.gaunt) s += `<path d="M${f1(-hw * 0.7)} ${f1(hh * 0.25)}q${f1(hw * 0.15)} ${f1(hh * 0.3)} ${f1(hw * 0.25)} ${f1(hh * 0.35)}M${f1(hw * 0.7)} ${f1(hh * 0.25)}q${f1(-hw * 0.15)} ${f1(hh * 0.3)} ${f1(-hw * 0.25)} ${f1(hh * 0.35)}" stroke="${SKIN2}" stroke-width="${f1(r * 0.05)}" fill="none"/>`;
    s += `</g>`;
    // eyes and brows
    const ey = -hh * 0.08, ex = hw * 0.4, eyes = q.eyes || 'calm', brow = q.brow || 0;
    const ew = r * 0.17, ehBase = { calm: 0.07, narrow: 0.045, wide: 0.1, deep: 0.075, soft: 0.075, down: 0.06 }[eyes] || 0.07, eh = r * ehBase * (1 - blink * 0.95);
    for (const sx of [-1, 1]) {
      const cx = sx * ex;
      if (eyes === 'deep') s += `<ellipse cx="${f1(cx)}" cy="${f1(ey - r * 0.02)}" rx="${f1(ew * 1.3)}" ry="${f1(r * 0.13)}" fill="${SKIN2}" opacity="0.8"/>`;
      s += `<ellipse cx="${f1(cx)}" cy="${f1(ey)}" rx="${f1(ew)}" ry="${f1(Math.max(0.6, eh))}" fill="#f4f0e8"/>`;
      if (blink < 0.6) s += `<circle cx="${f1(cx + look[0] * ew * 0.5 + (eyes === 'down' ? 0 : 0))}" cy="${f1(ey + (eyes === 'down' ? eh * 0.4 : 0) + look[1] * eh * 0.4)}" r="${f1(Math.min(eh, r * 0.065))}" fill="#181614"/>`;
      if (eyes === 'narrow' || eyes === 'down') s += `<path d="M${f1(cx - ew * 1.1)} ${f1(ey - eh * 0.5)}Q${f1(cx)} ${f1(ey - eh * 1.4)} ${f1(cx + ew * 1.1)} ${f1(ey - eh * 0.5)}" stroke="#3a332c" stroke-width="${f1(r * 0.035)}" fill="none"/>`;
      const by = ey - r * 0.2 - (eyes === 'wide' ? r * 0.04 : 0), inner = by + brow * r * 0.08 * -1, outer = by + brow * r * 0.08;
      s += `<path d="M${f1(cx - sx * ew * 1.2)} ${f1(sx > 0 ? inner : inner)}L${f1(cx + sx * ew * 1.3)} ${f1(outer)}" stroke="${q.hair === 'bald' || q.hair === 'monk' ? '#5a5048' : hc}" stroke-width="${f1(r * 0.07)}" stroke-linecap="round"/>`;
    }
    if (q.glasses) for (const sx of [-1, 1]) s += `<circle cx="${f1(sx * ex)}" cy="${f1(ey)}" r="${f1(ew * 1.45)}" fill="none" stroke="#2a2522" stroke-width="${f1(r * 0.035)}"/>` + (sx > 0 ? `<path d="M${f1(-ex + ew * 1.45)} ${f1(ey)}H${f1(ex - ew * 1.45)}" stroke="#2a2522" stroke-width="${f1(r * 0.03)}"/>` : '');
    if (q.lorgnette) s += `<circle cx="${f1(ex)}" cy="${f1(ey)}" r="${f1(ew * 1.5)}" fill="none" stroke="#b08a3c" stroke-width="${f1(r * 0.03)}"/><path d="M${f1(ex + ew * 1.3)} ${f1(ey + ew)}Q${f1(hw * 1.1)} ${f1(hh * 0.9)} ${f1(hw * 0.5)} ${f1(hh * 1.5)}" stroke="#b08a3c" stroke-width="1.2" fill="none"/>`;
    // nose and mouth
    s += `<path d="M${f1(-r * 0.02)} ${f1(ey + r * 0.05)}Q${f1(r * 0.08)} ${f1(hh * 0.28)} ${f1(r * 0.1)} ${f1(hh * 0.33)}Q${f1(r * 0.02)} ${f1(hh * 0.38)} ${f1(-r * 0.08)} ${f1(hh * 0.34)}" stroke="${SKIN2}" stroke-width="${f1(r * 0.04)}" fill="none" stroke-linecap="round"/>`;
    const my = hh * 0.56, mw = r * (q.female ? 0.2 : 0.24), cu = (q.mouth || 0) * r * 0.1, sm = q.smirk ? r * 0.06 : 0;
    if (q.female) s += `<path d="M${f1(-mw)} ${f1(my)}Q0 ${f1(my + cu + r * 0.12)} ${f1(mw)} ${f1(my)}Q0 ${f1(my - r * 0.03)} ${f1(-mw)} ${f1(my)}Z" fill="#9a5a52"/>`;
    else s += `<path d="M${f1(-mw)} ${f1(my - cu * 0.5)}Q0 ${f1(my + cu)} ${f1(mw)} ${f1(my - cu * 0.5 - sm)}" stroke="#5a3f36" stroke-width="${f1(r * 0.045)}" fill="none" stroke-linecap="round"/>`;
    // beard and moustache
    const bd = q.beard || 'none';
    if (bd !== 'none') {
      const len = { full: 0.55, long: 1.05, short: 0.3, goatee: 0.35 }[bd] || 0.4, wid = bd === 'goatee' ? 0.35 : 1;
      s += `<path d="M${f1(-hw * 0.98 * wid)} ${f1(hh * 0.05)}C${f1(-hw * wid)} ${f1(hh * (0.7 + len))} ${f1(-hw * 0.3)} ${f1(hh * (1.0 + len))} 0 ${f1(hh * (1.05 + len))}C${f1(hw * 0.3)} ${f1(hh * (1.0 + len))} ${f1(hw * wid)} ${f1(hh * (0.7 + len))} ${f1(hw * 0.98 * wid)} ${f1(hh * 0.05)}C${f1(hw * 0.8 * wid)} ${f1(hh * 0.5)} ${f1(hw * 0.4)} ${f1(hh * 0.62)} 0 ${f1(hh * 0.72)}C${f1(-hw * 0.4)} ${f1(hh * 0.62)} ${f1(-hw * 0.8 * wid)} ${f1(hh * 0.5)} ${f1(-hw * 0.98 * wid)} ${f1(hh * 0.05)}Z" fill="${bc}"/>`;
      s += `<path d="M${f1(-mw * 0.8)} ${f1(my + r * 0.02)}Q0 ${f1(my + r * 0.1)} ${f1(mw * 0.8)} ${f1(my + r * 0.02)}" stroke="#5a3f36" stroke-width="${f1(r * 0.05)}" fill="none"/>`;
    }
    if (q.mous || bd !== 'none') {
      const mk = q.mous || 1;
      s += `<path d="M0 ${f1(my - r * 0.1)}C${f1(-r * 0.15 * mk)} ${f1(my - r * 0.18)} ${f1(-r * 0.36 * mk)} ${f1(my - r * 0.06)} ${f1(-r * 0.42 * mk)} ${f1(my + r * 0.06 * mk)}C${f1(-r * 0.3 * mk)} ${f1(my - r * 0.02)} ${f1(-r * 0.1)} ${f1(my - r * 0.02)} 0 ${f1(my - r * 0.05)}C${f1(r * 0.1)} ${f1(my - r * 0.02)} ${f1(r * 0.3 * mk)} ${f1(my - r * 0.02)} ${f1(r * 0.42 * mk)} ${f1(my + r * 0.06 * mk)}C${f1(r * 0.36 * mk)} ${f1(my - r * 0.06)} ${f1(r * 0.15 * mk)} ${f1(my - r * 0.18)} 0 ${f1(my - r * 0.1)}Z" fill="${bc}"/>`;
    }
    // hair on top
    const ht2 = {
      bald: `M${f1(-hw * 1.02)} ${f1(-hh * 0.05)}Q${f1(-hw * 1.08)} ${f1(-hh * 0.6)} ${f1(-hw * 0.7)} ${f1(-hh * 0.62)}Q${f1(-hw * 0.9)} ${f1(-hh * 0.35)} ${f1(-hw * 0.88)} ${f1(-hh * 0.02)}Z M${f1(hw * 1.02)} ${f1(-hh * 0.05)}Q${f1(hw * 1.08)} ${f1(-hh * 0.6)} ${f1(hw * 0.7)} ${f1(-hh * 0.62)}Q${f1(hw * 0.9)} ${f1(-hh * 0.35)} ${f1(hw * 0.88)} ${f1(-hh * 0.02)}Z`,
      parted: `M${f1(-hw * 1.04)} ${f1(-hh * 0.1)}C${f1(-hw * 1.15)} ${f1(-hh * 1.2)} ${f1(hw * 0.6)} ${f1(-hh * 1.35)} ${f1(hw * 1.04)} ${f1(-hh * 0.35)}L${f1(hw * 1.0)} ${f1(-hh * 0.05)}C${f1(hw * 0.9)} ${f1(-hh * 0.55)} ${f1(hw * 0.2)} ${f1(-hh * 0.8)} ${f1(-hw * 0.35)} ${f1(-hh * 0.75)}C${f1(-hw * 0.7)} ${f1(-hh * 0.6)} ${f1(-hw * 0.85)} ${f1(-hh * 0.4)} ${f1(-hw * 0.9)} ${f1(-hh * 0.05)}Z`,
      swept: `M${f1(-hw * 1.04)} ${f1(-hh * 0.15)}C${f1(-hw * 1.2)} ${f1(-hh * 1.25)} ${f1(hw * 0.9)} ${f1(-hh * 1.4)} ${f1(hw * 1.1)} ${f1(-hh * 0.6)}C${f1(hw * 0.7)} ${f1(-hh * 0.95)} ${f1(-hw * 0.2)} ${f1(-hh * 0.75)} ${f1(-hw * 0.9)} ${f1(-hh * 0.1)}Z`,
      long: `M${f1(-hw * 1.08)} ${f1(-hh * 0.0)}C${f1(-hw * 1.2)} ${f1(-hh * 1.2)} ${f1(hw * 1.2)} ${f1(-hh * 1.2)} ${f1(hw * 1.08)} ${f1(-hh * 0.0)}C${f1(hw * 0.95)} ${f1(-hh * 0.55)} ${f1(hw * 0.5)} ${f1(-hh * 0.72)} 0 ${f1(-hh * 0.74)}C${f1(-hw * 0.5)} ${f1(-hh * 0.72)} ${f1(-hw * 0.95)} ${f1(-hh * 0.55)} ${f1(-hw * 1.08)} 0Z`,
      shaggy: '', curly: '', curls: '', brush: '',
      short: `M${f1(-hw * 1.02)} ${f1(-hh * 0.2)}C${f1(-hw * 1.1)} ${f1(-hh * 1.15)} ${f1(hw * 1.1)} ${f1(-hh * 1.15)} ${f1(hw * 1.02)} ${f1(-hh * 0.2)}C${f1(hw * 0.8)} ${f1(-hh * 0.62)} ${f1(-hw * 0.8)} ${f1(-hh * 0.62)} ${f1(-hw * 1.02)} ${f1(-hh * 0.2)}Z`,
      cropped: `M${f1(-hw * 1.0)} ${f1(-hh * 0.25)}C${f1(-hw * 1.05)} ${f1(-hh * 1.1)} ${f1(hw * 1.05)} ${f1(-hh * 1.1)} ${f1(hw * 1.0)} ${f1(-hh * 0.25)}C${f1(hw * 0.7)} ${f1(-hh * 0.75)} ${f1(-hw * 0.7)} ${f1(-hh * 0.75)} ${f1(-hw * 1.0)} ${f1(-hh * 0.25)}Z`,
      flat: `M${f1(-hw * 1.02)} ${f1(-hh * 0.3)}C${f1(-hw * 1.0)} ${f1(-hh * 1.08)} ${f1(hw * 1.0)} ${f1(-hh * 1.08)} ${f1(hw * 1.02)} ${f1(-hh * 0.3)}L${f1(hw * 0.9)} ${f1(-hh * 0.6)}H${f1(-hw * 0.9)}Z`,
      bun: `M${f1(-hw * 1.03)} ${f1(-hh * 0.1)}C${f1(-hw * 1.1)} ${f1(-hh * 1.15)} ${f1(hw * 1.1)} ${f1(-hh * 1.15)} ${f1(hw * 1.03)} ${f1(-hh * 0.1)}C${f1(hw * 0.8)} ${f1(-hh * 0.6)} ${f1(hw * 0.1)} ${f1(-hh * 0.72)} 0 ${f1(-hh * 0.6)}C${f1(-hw * 0.1)} ${f1(-hh * 0.72)} ${f1(-hw * 0.8)} ${f1(-hh * 0.6)} ${f1(-hw * 1.03)} ${f1(-hh * 0.1)}Z`,
      convict: `M${f1(-hw * 1.02)} ${f1(-hh * 0.2)}C${f1(-hw * 1.1)} ${f1(-hh * 1.15)} 0 ${f1(-hh * 1.12)} 0 ${f1(-hh * 1.0)}V${f1(-hh * 0.66)}C${f1(-hw * 0.5)} ${f1(-hh * 0.66)} ${f1(-hw * 0.9)} ${f1(-hh * 0.5)} ${f1(-hw * 1.02)} ${f1(-hh * 0.2)}Z`,
      monk: `M${f1(-hw * 1.15)} ${f1(-hh * 0.45)}V${f1(-hh * 1.55)}H${f1(hw * 1.15)}V${f1(-hh * 0.45)}Z`,
      scarf: `M${f1(-hw * 1.2)} ${f1(hh * 0.2)}C${f1(-hw * 1.35)} ${f1(-hh * 1.4)} ${f1(hw * 1.35)} ${f1(-hh * 1.4)} ${f1(hw * 1.2)} ${f1(hh * 0.2)}C${f1(hw * 1.0)} ${f1(-hh * 0.5)} ${f1(hw * 0.6)} ${f1(-hh * 0.75)} 0 ${f1(-hh * 0.75)}C${f1(-hw * 0.6)} ${f1(-hh * 0.75)} ${f1(-hw * 1.0)} ${f1(-hh * 0.5)} ${f1(-hw * 1.2)} ${f1(hh * 0.2)}Z`,
    };
    const hd = ht2[q.hair];
    if (hd) s += `<path d="${hd}" fill="${q.hair === 'scarf' ? (q.scarfC || '#666') : q.hair === 'monk' ? '#111' : hc}"/>`;
    if (q.hair === 'convict') s += `<path d="M0 ${f1(-hh * 1.0)}C${f1(hw * 0.6)} ${f1(-hh)} ${f1(hw)} ${f1(-hh * 0.6)} ${f1(hw)} ${f1(-hh * 0.2)}" stroke="${hc}" stroke-opacity="0.35" stroke-width="${f1(r * 0.25)}" fill="none"/>`;
    if (['shaggy', 'curly', 'curls', 'brush'].includes(q.hair)) {   // clumps around the crown
      const rr = rng('hair' + seed), n = q.hair === 'brush' ? 9 : 13, sz = q.hair === 'curly' || q.hair === 'curls' ? 0.27 : 0.3;
      for (let i = 0; i < n; i++) {
        const a = Math.PI * (1.05 + i / (n - 1) * 0.9), rx = hw * (q.hair === 'brush' ? 0.95 : 1.02), ry = hh * (q.hair === 'brush' ? 1.05 : 0.98);
        s += `<circle cx="${f1(Math.cos(a) * rx)}" cy="${f1(Math.sin(a) * ry - (q.hair === 'brush' ? r * 0.12 : 0))}" r="${f1(r * (sz + rr() * 0.12))}" fill="${hc}"/>`;
      }
      if (q.hair !== 'brush') s += `<path d="M${f1(-hw * 0.9)} ${f1(-hh * 0.5)}Q0 ${f1(-hh * 0.95)} ${f1(hw * 0.9)} ${f1(-hh * 0.5)}V${f1(-hh * 0.9)}H${f1(-hw * 0.9)}Z" fill="${hc}"/>`;
      else s += `<path d="M${f1(-hw * 0.95)} ${f1(-hh * 0.55)}Q0 ${f1(-hh * 0.75)} ${f1(hw * 0.95)} ${f1(-hh * 0.55)}V${f1(-hh * 1.1)}H${f1(-hw * 0.95)}Z" fill="${hc}"/>`;
    }
    if (q.earring) for (const sx of [-1, 1]) s += `<circle cx="${f1(sx * hw * 0.98)}" cy="${f1(hh * 0.3)}" r="${f1(r * 0.06)}" fill="#d9b04a"/>`;
    if (q.mask) s += `<g opacity="${f1(q.mask)}"><path d="${headD}" fill="#f3efe6" transform="scale(0.96) translate(0 -2)"/><ellipse cx="${f1(-ex)}" cy="${f1(ey)}" rx="${f1(ew * 1.2)}" ry="${f1(r * 0.06)}" fill="#141414"/><ellipse cx="${f1(ex)}" cy="${f1(ey)}" rx="${f1(ew * 1.2)}" ry="${f1(r * 0.06)}" fill="#141414"/><path d="M${f1(-mw)} ${f1(my)}H${f1(mw)}" stroke="#a89f92" stroke-width="2"/></g>`;
    return s;
  }

  // ---------- elements ----------
  /* A torn paper cut-out portrait: who (preset) plus overrides, a coloured backing with halftone, tape and a name strip. */
  function cut(p, t, seed, age) {
    const w = p.w || 250, h = p.h || 300, q = { ...(PRESET[p.who] || {}), ...(p.face || {}) }, col = p.color || '#c8b48a';
    if (p.mood) Object.assign(q, { angry: { brow: -0.8, mouth: -0.5 }, sad: { brow: 0.8, mouth: -0.4 }, smug: { brow: -0.2, mouth: 0.5, smirk: 1 }, shock: { brow: 0.8, eyes: 'wide', mouth: -0.6 }, calm: { brow: 0, mouth: 0 } }[p.mood] || {});
    if (p.mask != null) q.mask = p.mask;
    if (p.look) q.look = p.look;
    const edge = torn(w, h, seed, 5, 10), inner = torn(w - 16, h - 16, seed + 'i', 3, 10), cl = nid('cut'), [ht, htDef] = halftone(mix(col, '#000', 0.25), 8, 2.2);
    let s = drop(edge) + `<path d="${edge}" fill="#f6f1e6"/>` + htDef + `<clipPath id="${cl}"><path d="${inner}"/></clipPath><g clip-path="url(#${cl})">`;
    s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${col}"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="url(#${ht})" opacity="0.55"/>`;
    const r = (p.r || 0.24) * Math.min(w, h * 0.85), br = Math.sin(t * 1.1 + w) * 0.6;
    s += `<g transform="translate(0 ${f1(-h * 0.08 + br)}) rotate(${f1(q.tilt || 0)})">${bust(q, t, seed, r)}</g>`;
    if (p.gray) s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#777" style="mix-blend-mode:saturation"/>`;
    s += `</g>`;
    if (p.cross != null) { const d = clamp(p.cross); s += `<path d="${polyD(wob([[-w * 0.42, -h * 0.4], [w * 0.42, h * 0.38]], seed + 'x1', 6), d * 2)}" stroke="${RED}" stroke-width="10" stroke-linecap="round" fill="none"/><path d="${polyD(wob([[w * 0.42, -h * 0.4], [-w * 0.42, h * 0.38]], seed + 'x2', 6), clamp(d * 2 - 1))}" stroke="${RED}" stroke-width="10" stroke-linecap="round" fill="none"/>`; }
    if (p.tape !== false) s += tape(-w * 0.32, -h / 2 + 4, -24, 64, seed + 'a') + tape(w * 0.32, -h / 2 + 4, 22, 64, seed + 'b');
    if (p.name) {
      const fs = p.nameSize || 22, nw = TW(p.name.toUpperCase(), fs, 400, 'head') + 28, ny = h / 2 - 8;
      s += `<g transform="translate(${f1(p.nameX || 0)} ${f1(ny)}) rotate(${f1(p.nameRot == null ? -2 : p.nameRot)})"><path d="${torn(nw, fs * 1.7, seed + 'n', 2, 8)}" fill="${INK}"/>${T(p.name.toUpperCase(), 0, 1, fs, { font: 'head', fill: '#f6f1e6', weight: 400 })}</g>`;
      if (p.role) { const rs = p.roleSize || 16, rw = TW(p.role, rs, 600) + 22; s += `<g transform="translate(${f1(p.nameX || 0)} ${f1(ny + fs * 1.55)}) rotate(1)"><path d="${torn(rw, rs * 1.75, seed + 'r', 2, 8)}" fill="${p.roleColor || YEL}"/>${T(p.role, 0, 1, rs, { weight: 650, fill: INK })}</g>`; }
    }
    return s;
  }
  /* Text with highlighter sweeps. Wrap phrases to highlight in [[double brackets]]. draw 0..1 (default: timed by age). */
  function hl(p, t, seed, age) {
    const size = p.size || 34, font = p.font || 'body', weight = p.weight || 600, lh = size * (p.lh || 1.32), hc = p.hcolor || YEL;
    const lines = String(p.text).split('\n'), anchor = p.anchor || 'middle';
    const spans = []; let total = 0;
    let inHL = false;
    const parsed = lines.map(l => { const parts = []; let rest = l; while (rest.length) { const k = rest.indexOf(inHL ? ']]' : '[['); const chunk = k < 0 ? rest : rest.slice(0, k); parts.push([chunk, inHL]); if (k < 0) break; rest = rest.slice(k + 2); inHL = !inHL; } return parts; });
    const widths = parsed.map(ps => ps.reduce((a, [c]) => a + TW(c, size, weight, font), 0));
    const y0 = -(lines.length - 1) * lh / 2;
    parsed.forEach((ps, i) => { let x = anchor === 'start' ? 0 : anchor === 'end' ? -widths[i] : -widths[i] / 2; for (const [c, on] of ps) { const cw = TW(c, size, weight, font); if (on && c.trim()) { spans.push({ x, y: y0 + i * lh, w: cw }); total += cw; } x += cw; } });
    const d = p.draw != null ? p.draw : clamp(((age || 0) - (p.delay || 0.5)) / (p.speed || Math.max(0.6, total / 700)));
    let s = '';
    if (p.card) {
      const cw = Math.max(...widths) + size * 1.6 + (p.padX || 0), chh = lines.length * lh + size * 1.2 + (p.by ? size * 1.2 : 0), ox = anchor === 'start' ? cw / 2 - size * 0.8 : anchor === 'end' ? -cw / 2 + size * 0.8 : 0;
      const e = torn(cw, chh, seed + 'card', 4, 10);
      s += `<g transform="translate(${f1(ox)} ${f1(p.by ? size * 0.6 : 0)})">` + drop(e, 0.22) + `<path d="${e}" fill="${p.card === true ? '#fbf7ee' : p.card}"/>` + (p.tape ? tape(0, -chh / 2, -3, 90, seed + 'ct') : '') + `</g>`;
    }
    let left = d * total;
    for (const sp of spans) {
      const ww = Math.max(0, Math.min(sp.w, left)); left -= sp.w;
      if (ww > 0) s += `<path d="M${f1(sp.x - 4)} ${f1(sp.y - size * 0.42)}L${f1(sp.x + ww + 4)} ${f1(sp.y - size * 0.47)}L${f1(sp.x + ww + 2)} ${f1(sp.y + size * 0.5)}L${f1(sp.x - 2)} ${f1(sp.y + size * 0.46)}Z" fill="${hc}" opacity="0.85"/>`;
    }
    parsed.forEach((ps, i) => { s += T(ps.map(x => x[0]).join(''), anchor === 'start' ? 0 : anchor === 'end' ? 0 : 0, y0 + i * lh, size, { font, weight, anchor, fill: p.color || INK, italic: p.italic }); });
    if (p.by) s += T(p.by, anchor === 'start' ? 0 : 0, y0 + lines.length * lh + size * 0.15, Math.max(15, size * 0.5), { weight: 700, anchor, fill: p.byColor || '#6b6255' });
    return s;
  }
  /* A bold headline, optionally on a torn strip. */
  function headline(p, t, seed, age) {
    const size = p.size || 64, font = p.font || 'head', weight = p.weight || 400, lines = String(p.text).split('\n'), lh = size * (p.lh || 1.05);
    let s = '';
    if (p.bg) {
      const w = Math.max(...lines.map(l => TW(l, size, weight, font))) + size * 0.8, h = lines.length * lh + size * 0.45, e = torn(w, h, seed + 'hb', 3, 9);
      s += drop(e, 0.2, 4, 5) + `<path d="${e}" fill="${p.bg}"/>`;
    }
    const n = p.type ? Math.floor((age || 0) * (p.cps || 22)) : 1e9;
    let used = 0;
    const y0 = -(lines.length - 1) * lh / 2;
    lines.forEach((l, i) => { const shown = l.slice(0, Math.max(0, n - used)); used += l.length; s += T(shown, 0, y0 + i * lh + size * 0.04, size, { font, weight, fill: p.color || INK, ls: p.ls, anchor: p.anchor || 'middle' }); });
    return s;
  }
  /* Marker annotations that draw themselves on: circle, underline, arrow, cross, box, check, bracket. */
  function scrib(p, t, seed, age) {
    const d = p.draw != null ? p.draw : clamp(((age || 0) - (p.delay || 0)) / (p.dur || 0.7)), c = p.color || RED, sw = p.width || 6, w = p.w || 200, h = p.h || 80;
    let pts = [];
    if (p.kind === 'circle') { for (let i = 0; i <= 44; i++) { const a = -2.2 + i / 44 * 7.0; pts.push([Math.cos(a) * w / 2 * (1 + i * 0.002), Math.sin(a) * h / 2 * (1 - i * 0.002) + i * 0.15]); } }
    else if (p.kind === 'underline') pts = [[-w / 2, 0], [-w / 6, 3], [w / 6, -1], [w / 2, 2]];
    else if (p.kind === 'box') pts = [[-w / 2, -h / 2], [w / 2, -h / 2 - 3], [w / 2 + 2, h / 2], [-w / 2, h / 2 + 2], [-w / 2 + 3, -h / 2 - 6]];
    else if (p.kind === 'check') pts = [[-w / 2, 0], [-w / 6, h / 2], [w / 2, -h / 2]];
    else if (p.kind === 'cross') { const a = wob([[-w / 2, -h / 2], [w / 2, h / 2]], seed + 'c1', 4), b = wob([[w / 2, -h / 2], [-w / 2, h / 2]], seed + 'c2', 4); return `<path d="${polyD(a, d * 2)}" stroke="${c}" stroke-width="${sw}" fill="none" stroke-linecap="round"/><path d="${polyD(b, clamp(d * 2 - 1))}" stroke="${c}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`; }
    else if (p.kind === 'arrow') {
      const x2 = p.x2 || w, y2 = p.y2 || 0, bend = p.bend == null ? -0.2 : p.bend, mx = x2 / 2 - y2 * bend, my = y2 / 2 + x2 * bend;
      for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push([2 * (1 - u) * u * mx + u * u * x2, 2 * (1 - u) * u * my + u * u * y2]); }
      let s = `<path d="${polyD(wob(pts, seed, 2), d)}" stroke="${c}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
      if (d > 0.92) { const a = Math.atan2(y2 - my, x2 - mx), L = 22; s += `<path d="M${f1(x2 - L * Math.cos(a - 0.5))} ${f1(y2 - L * Math.sin(a - 0.5))}L${f1(x2)} ${f1(y2)}L${f1(x2 - L * Math.cos(a + 0.5))} ${f1(y2 - L * Math.sin(a + 0.5))}" stroke="${c}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
      if (p.label) s += T(p.label, x2 + (p.lx || 0), y2 + (p.ly || -30), p.lsize || 26, { font: 'mark', fill: c, weight: 400 });
      return s;
    }
    else if (p.kind === 'bracket') pts = [[-10, -h / 2], [0, -h / 2], [0, h / 2], [-10, h / 2]];
    let s = `<path d="${polyD(wob(pts, seed, 2.5), d)}" stroke="${c}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.92"/>`;
    if (p.label) s += T(p.label, p.lx || 0, p.ly == null ? h / 2 + 30 : p.ly, p.lsize || 26, { font: 'mark', fill: c, weight: 400, op: f1(clamp(d * 2 - 1)) });
    return s;
  }
  /* Red string between pins: pts [[x,y]...], links [[i,j]...] (default a chain), draw 0..1. Coordinates are relative. */
  function strings(p, t, seed, age) {
    const pts = p.pts || [], links = p.links || pts.slice(1).map((_, i) => [i, i + 1]), d = p.draw != null ? p.draw : clamp(((age || 0) - 0.2) / 1.6), c = p.color || '#c4262b';
    let s = '';
    links.forEach(([a, b], k) => {
      const q = clamp(d * links.length - k), A = pts[a], B = pts[b]; if (!A || !B || q <= 0) return;
      const sag = Math.hypot(B[0] - A[0], B[1] - A[1]) * 0.06, mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2 + sag;
      const P2 = []; for (let i = 0; i <= 16; i++) { const u = i / 16; P2.push([(1 - u) * (1 - u) * A[0] + 2 * (1 - u) * u * mx + u * u * B[0], (1 - u) * (1 - u) * A[1] + 2 * (1 - u) * u * my + u * u * B[1]]); }
      s += `<path d="${polyD(P2, q)}" stroke="#000" stroke-opacity="0.18" stroke-width="3" fill="none" transform="translate(2 4)"/><path d="${polyD(P2, q)}" stroke="${c}" stroke-width="${p.width || 2.6}" fill="none"/>`;
    });
    if (p.pins !== false) for (const [x, y] of pts) s += `<circle cx="${f1(x + 1)}" cy="${f1(y + 3)}" r="7" fill="#000" opacity="0.2"/><circle cx="${f1(x)}" cy="${f1(y)}" r="7" fill="${p.pinColor || '#c4262b'}"/><circle cx="${f1(x - 2)}" cy="${f1(y - 2)}" r="2.4" fill="#fff" opacity="0.6"/>`;
    return s;
  }
  /* A paper sheet: kind page | letter | clip | manifesto | note. head, lines (real text, may use [[highlights]]), filler bars. */
  function sheet(p, t, seed, age) {
    const w = p.w || 420, h = p.h || 520, kind = p.kind || 'page', bgc = p.paper || (kind === 'clip' ? '#e7e2d3' : kind === 'note' ? '#f7e9a3' : '#f8f3e8');
    const e = torn(w, h, seed, kind === 'clip' ? 7 : 3, kind === 'clip' ? 8 : 12);
    let s = drop(e, 0.25) + `<path d="${e}" fill="${bgc}"/>`;
    if (kind === 'letter' || kind === 'note') for (let y = -h / 2 + 70; y < h / 2 - 20; y += 30) s += `<path d="M${-w / 2 + 24} ${y}H${w / 2 - 24}" stroke="#b9c7d6" stroke-width="1"/>`;
    let y = -h / 2 + 46;
    if (p.kicker) { s += T(p.kicker, 0, y - 12, 14, { font: 'body', weight: 700, ls: 3, fill: '#7a6f60' }); y += 26; }
    if (p.head) { const hs = p.headSize || (kind === 'clip' ? 30 : 26); s += T(p.head, 0, y + hs * 0.3 * (String(p.head).split('\n').length - 1), hs, { font: kind === 'clip' ? 'serif' : kind === 'letter' ? 'type' : 'head', weight: kind === 'clip' ? 900 : 400, fill: INK }); y += hs * 1.2 * String(p.head).split('\n').length + 10; if (kind !== 'letter') s += `<path d="M${-w / 2 + 30} ${f1(y - 12)}H${w / 2 - 30}" stroke="${INK}" stroke-width="${kind === 'clip' ? 2 : 1}"/>`; }
    const r = rng('sh' + seed), fillN = p.fill == null ? 6 : p.fill;
    const bars = (n) => { for (let i = 0; i < n && y < h / 2 - 30; i++) { const ww = (w - 70) * (0.6 + r() * 0.4); s += `<rect x="${-w / 2 + 35}" y="${f1(y)}" width="${f1(ww)}" height="7" rx="3" fill="#b5ab9b" opacity="0.7"/>`; y += 19; } };
    bars(p.pre == null ? 2 : p.pre);
    if (p.text) { const ls = p.size || 21; s += `<g transform="translate(${-w / 2 + 35} ${f1(y + ls * 0.6 + (String(p.text).split('\n').length - 1) * ls * 0.66)})">` + hl({ text: p.text, size: ls, anchor: 'start', font: p.font || (kind === 'letter' ? 'type' : 'serif'), weight: p.font === 'body' ? 600 : 400, italic: p.italic, draw: p.draw, delay: p.delay || 0.6, hcolor: p.hcolor }, t, seed + 'hl', age) + `</g>`; y += String(p.text).split('\n').length * ls * 1.32 + 16; }
    bars(fillN);
    if (p.sign) s += T(p.sign, w / 2 - 40, h / 2 - 36, 22, { font: 'mark', anchor: 'end', fill: '#2c3e66', weight: 400 });
    if (p.stamp) s += stampc({ text: p.stamp, color: p.stampColor, rot: -12, size: 26 }, t, seed + 'st', (age || 0) - (p.stampAt || 1.5)) .replace(/^/, `<g transform="translate(${f1(w * 0.18)} ${f1(h * 0.28)})">`) + `</g>`;
    if (p.tape) s += tape(0, -h / 2 + 2, 3, 100, seed + 'tp');
    return s;
  }
  /* A rubber stamp that thumps on. */
  function stampc(p, t, seed, age) {
    if (age < 0) return '';
    const size = p.size || 34, str = p.text || 'STAMP', c = p.color || RED, w = TW(str, size, 400, 'head') + size * 1.2, h = size * 1.8, a = clamp(age / 0.18), sc = 1.5 - 0.5 * easeOut(a);
    const r = rng('stp' + seed); let holes = '';
    for (let i = 0; i < 26; i++) holes += `<circle cx="${f1((r() - 0.5) * w)}" cy="${f1((r() - 0.5) * h)}" r="${f1(1 + r() * 3)}" fill="#fff"/>`;
    const m = nid('sm');
    return `<mask id="${m}"><rect x="${-w}" y="${-h}" width="${w * 2}" height="${h * 2}" fill="#fff"/>${holes.replace(/#fff/g, '#000')}</mask><g transform="rotate(${p.rot == null ? -10 : p.rot}) scale(${f1(sc * 100) / 100})" opacity="${f1(a * 0.9)}" mask="url(#${m})"><path d="${rrect(-w / 2, -h / 2, w, h, 6)}" fill="none" stroke="${c}" stroke-width="5"/><path d="${rrect(-w / 2 + 7, -h / 2 + 7, w - 14, h - 14, 4)}" fill="none" stroke="${c}" stroke-width="1.5"/>${T(str, 0, 2, size, { font: 'head', fill: c, weight: 400, ls: 2 })}</g>`;
  }
  /* An open book: left and right pages; lines may include [[highlights]]. */
  function openbook(p, t, seed, age) {
    const w = p.w || 760, h = p.h || 440, pg = w / 2;
    let s = `<path d="M${-w / 2 - 14} ${-h / 2 + 10}H${w / 2 + 14}V${h / 2 + 14}H${-w / 2 - 14}Z" fill="${p.cover || '#5a2a22'}"/>` + drop(`M${-w / 2} ${-h / 2}H${w / 2}V${h / 2}H${-w / 2}Z`, 0.25);
    s += `<path d="M${-w / 2} ${-h / 2}Q${-pg / 2} ${-h / 2 - 10} 0 ${-h / 2 + 6}V${h / 2}Q${-pg / 2} ${h / 2 - 12} ${-w / 2} ${h / 2}Z" fill="#f6efdf"/><path d="M${w / 2} ${-h / 2}Q${pg / 2} ${-h / 2 - 10} 0 ${-h / 2 + 6}V${h / 2}Q${pg / 2} ${h / 2 - 12} ${w / 2} ${h / 2}Z" fill="#f2ead8"/>`;
    s += `<path d="M-30 ${-h / 2 + 6}H30V${h / 2}H-30Z" fill="url(#${nid('x')})" opacity="0"/><path d="M0 ${-h / 2 + 6}V${h / 2}" stroke="#b9ab8e" stroke-width="2"/>`;
    const page = (txt, cx, sd) => {
      if (!txt) { let b = ''; const r = rng('ob' + sd); for (let y = -h / 2 + 50; y < h / 2 - 40; y += 22) b += `<rect x="${f1(cx - pg / 2 + 40)}" y="${y}" width="${f1((pg - 80) * (0.7 + r() * 0.3))}" height="6" rx="3" fill="#c3b8a2"/>`; return b; }
      return `<g transform="translate(${f1(cx - pg / 2 + 40)} ${p.ty || 0})">` + hl({ text: txt, size: p.size || 20, anchor: 'start', font: 'serif', weight: 400, lh: 1.45, draw: p.draw, delay: p.delay || 0.8 }, t, seed + sd, age) + `</g>`;
    };
    s += page(p.left, -pg / 2, 'l') + page(p.right, pg / 2, 'r');
    if (p.headL) s += T(p.headL, -pg / 2, -h / 2 + 34, 14, { font: 'body', weight: 700, ls: 3, fill: '#8a7e66' });
    if (p.headR) s += T(p.headR, pg / 2, -h / 2 + 34, 14, { font: 'body', weight: 700, ls: 3, fill: '#8a7e66' });
    return s;
  }
  /* A paper timeline: events [{year, text, color}], shown = how many are revealed, now = index to ring. */
  function ptl(p, t, seed, age) {
    const ev = p.events || [], w = p.w || 1080, n = ev.length, shown = p.shown == null ? n : p.shown;
    let s = `<path d="${polyD(wob([[-w / 2, 0], [w / 2, 0]], seed, 2), 1)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    ev.forEach((e, i) => {
      const x = -w / 2 + (n === 1 ? w / 2 : i * w / (n - 1)), q = clamp(shown - i), up = i % 2 === 0, c = e.color || RED;
      if (q <= 0) return;
      s += `<g opacity="${f1(q)}"><circle cx="${f1(x)}" cy="0" r="${f1(9 + 3 * q)}" fill="${c}"/><circle cx="${f1(x)}" cy="0" r="4" fill="#f6f1e6"/>`;
      s += T(e.year, x, up ? -40 : 40, 30, { font: 'head', weight: 400, fill: c });
      s += T(e.text, x, up ? -96 : 100, p.size || 17, { weight: 650, lh: 1.25 });
      if (p.now === i) s += scrib({ kind: 'circle', w: 110, h: 60, draw: 1, width: 4 }, t, seed + 'n' + i, 1).replace(/^/, `<g transform="translate(${f1(x)} ${up ? -40 : 40})">`) + '</g>';
      s += `</g>`;
    });
    return s;
  }
  /* Herd: a grid of small paper people. elite = how many stand apart (first ones), split 0..1 lifts them and greys the rest. */
  function herd(p, t, seed, age) {
    const n = p.n || 100, cols = p.cols || 20, gap = p.gap || 34, elite = p.elite || 10, sp = p.split || 0, c = p.color || '#3d5a80', ec = p.eliteColor || RED;
    const rows = Math.ceil(n / cols); let s = '';
    for (let i = 0; i < n; i++) {
      const col = i % cols, row = Math.floor(i / cols), isE = i < elite;
      let x = (col - (cols - 1) / 2) * gap, y = (row - (rows - 1) / 2) * gap * 1.25;
      const cc = isE ? mix(c, ec, sp) : mix(c, '#9b958a', sp), k = isE ? 1 + 0.25 * sp : 1 - 0.18 * sp;
      if (isE) { y -= sp * (p.lift || 120); x = lerp(x, (i - (elite - 1) / 2) * gap * 1.3, sp); }
      const bow = isE ? 0 : sp * 0.35;
      s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * 100) / 100})"><circle cx="${f1(bow * 8)}" cy="${f1(-17 + bow * 6)}" r="6.5" fill="${cc}"/><path d="M-8 9V-4Q-8 -10 0 -10Q8 -10 8 -4V9Z" fill="${cc}"/></g>`;
    }
    return s;
  }
  /* A circle of members bound to a centre: members [{who, name}], centre {who, name}, links draw, ring 0..1 (the blood bond). */
  function cell(p, t, seed, age) {
    const R = p.R || 210, mem = p.members || [], d = p.links == null ? 1 : p.links, ring = p.ring || 0;
    let s = '';
    const pos = mem.map((m, i) => { const a = -Math.PI / 2 + i / mem.length * Math.PI * 2; return [Math.cos(a) * R, Math.sin(a) * R * 0.78]; });
    if (ring > 0) { const pts = pos.concat([pos[0]]); s += `<path d="${polyD(wob(pts, seed + 'ring', 6), ring)}" stroke="#9e1b1b" stroke-width="${f1(10 + 6 * ring)}" fill="none" stroke-linejoin="round" opacity="0.85"/>`; }
    s += strings({ pts: [[0, 0]].concat(pos), links: pos.map((_, i) => [0, i + 1]), draw: d, pins: false }, t, seed + 's', age);
    pos.forEach(([x, y], i) => { const m = mem[i]; s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1((i % 2 ? 1 : -1) * 3)}) scale(0.5)">` + cut({ who: m.who, w: 200, h: 220, color: m.color || '#c9b893', name: m.name, nameSize: 30, tape: false, mood: m.mood, cross: m.cross }, t, seed + 'm' + i, age) + `</g>`; });
    if (p.centre) s += `<g transform="scale(0.62)">` + cut({ ...p.centre, w: 220, h: 250, nameSize: 30, tape: false }, t, seed + 'c', age) + `</g>`;
    return s;
  }
  /* A plain paper silhouette crowd; riot 0..1 raises arms and jostles. */
  function crowdp(p, t, seed, age) {
    const n = p.n || 24, w = p.w || 1100, rows = p.rows || 3, riot = p.riot || 0, r = rng('cp' + seed), cols = Math.ceil(n / rows);
    let s = '';
    for (let row = rows - 1; row >= 0; row--) for (let i = 0; i < cols; i++) {
      const x = -w / 2 + (i + 0.5 + (row % 2) * 0.5) * w / cols + (r() - 0.5) * 20, y = row * 40, sc = 1 - row * 0.12, c = mix(p.color || INK, p.back || '#7a7266', row / Math.max(1, rows - 1) * 0.7);
      const j = riot * Math.sin(t * (6 + r() * 4) + i) * 6, arm = riot > 0.2 && r() < 0.6;
      s += `<g transform="translate(${f1(x)} ${f1(y + j * 0.4)}) scale(${f1(sc * 100) / 100})"><circle cx="0" cy="-96" r="18" fill="${c}"/><path d="M-30 0V-52Q-30 -76 0 -76Q30 -76 30 -52V0Z" fill="${c}"/>`;
      if (arm) s += `<path d="M18 -66L${f1(30 + j)} ${f1(-120 - 20 * riot)}" stroke="${c}" stroke-width="11" stroke-linecap="round"/><circle cx="${f1(30 + j)}" cy="${f1(-124 - 20 * riot)}" r="9" fill="${c}"/>`;
      s += `</g>`;
    }
    return s;
  }
  /* A provincial town in paper silhouette: houses, an onion-domed church; burn 0..1 sets the right side alight. */
  function town(p, t, seed, age) {
    const w = p.w || 1280, burn = p.burn || 0, c = p.color || '#26242a', r = rng('town' + seed);
    let s = '';
    if (burn > 0) s += glow(w * 0.18, -60, 420 * burn, '#ff7a2f', 0.55 * burn) + glow(w * 0.3, -20, 300 * burn, '#ffcc4a', 0.4 * burn);
    // smoke
    if (burn > 0) for (let i = 0; i < 7; i++) { const yy = -120 - ((t * 30 + i * 60) % 420), xx = w * 0.1 + i * 50 + Math.sin(t + i) * 30; s += `<circle cx="${f1(xx)}" cy="${f1(yy)}" r="${f1(50 + i * 8)}" fill="#3a3436" opacity="${f1(0.35 * burn * (1 + yy / 540))}"/>`; }
    let x = -w / 2; let k = 0;
    while (x < w / 2) {
      const bw = 70 + r() * 80, bh = 80 + r() * 90;
      if (k === 4) {   // church
        s += `<path d="M${f1(x)} 0V-150H${f1(x + 120)}V0Z" fill="${c}"/><path d="M${f1(x + 35)} -150V-230H${f1(x + 85)}V-150Z" fill="${c}"/><path d="M${f1(x + 60)} -300C${f1(x + 20)} -270 ${f1(x + 25)} -235 ${f1(x + 60)} -228C${f1(x + 95)} -235 ${f1(x + 100)} -270 ${f1(x + 60)} -300Z" fill="${c}"/><path d="M${f1(x + 60)} -300V-340M${f1(x + 48)} -325H${f1(x + 72)}" stroke="${c}" stroke-width="4"/>`;
        x += 130; k++; continue;
      }
      s += `<path d="M${f1(x)} 0V${f1(-bh)}L${f1(x + bw / 2)} ${f1(-bh - 40)}L${f1(x + bw)} ${f1(-bh)}V0Z" fill="${c}"/>`;
      for (let wy = -bh + 24; wy < -20; wy += 34) s += `<rect x="${f1(x + bw * 0.3)}" y="${f1(wy)}" width="${f1(bw * 0.16)}" height="16" fill="${p.lit ? '#e9b94e' : mix(c, '#fff', 0.08)}" opacity="${p.lit ? 0.85 : 1}"/><rect x="${f1(x + bw * 0.58)}" y="${f1(wy)}" width="${f1(bw * 0.16)}" height="16" fill="${p.lit ? '#e9b94e' : mix(c, '#fff', 0.08)}" opacity="${p.lit ? 0.6 : 1}"/>`;
      if (burn > 0 && x < w * (-0.5 + burn * 0.9) && x > -w * 0.1) {   // flames on this roof
        for (let f = 0; f < 3; f++) { const fx = x + bw * (0.2 + f * 0.3), fh = (50 + 40 * Math.sin(t * 7 + f + x)) * burn, fy = -bh - 10; s += `<path d="M${f1(fx - 22)} ${f1(fy + 30)}Q${f1(fx - 18)} ${f1(fy - fh * 0.5)} ${f1(fx + Math.sin(t * 5 + f) * 8)} ${f1(fy - fh)}Q${f1(fx + 18)} ${f1(fy - fh * 0.4)} ${f1(fx + 22)} ${f1(fy + 30)}Z" fill="#ff6a2a"/><path d="M${f1(fx - 10)} ${f1(fy + 30)}Q${f1(fx - 8)} ${f1(fy - fh * 0.2)} ${f1(fx + Math.sin(t * 6 + f) * 4)} ${f1(fy - fh * 0.6)}Q${f1(fx + 8)} ${f1(fy - fh * 0.2)} ${f1(fx + 10)} ${f1(fy + 30)}Z" fill="#ffd34a"/>`; }
      }
      x += bw + 8 + r() * 20; k++;
    }
    s += `<rect x="${-w / 2 - 20}" y="0" width="${w + 40}" height="200" fill="${c}"/>`;
    if (p.river) s += `<rect x="${-w / 2 - 20}" y="30" width="${w + 40}" height="60" fill="${p.river}"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${f1(-w / 2 + ((i * 230 + t * 20) % (w + 100)))} ${50 + (i % 2) * 18}h60" stroke="#fff" stroke-opacity="0.18" stroke-width="3"/>`).join('');
    return s;
  }
  /* A herd of pigs running to a cliff edge on the right; run 0..1. */
  function pigs(p, t, seed, age) {
    const n = p.n || 9, run = p.run || 0, cliff = p.cliff == null ? 300 : p.cliff, c = p.color || '#d99a8f', r = rng('pig' + seed);
    let s = `<path d="M-700 0H${cliff}L${cliff + 20} 40L${cliff - 10} 120L${cliff + 30} 260H-700Z" fill="${p.land || '#5c6b3c'}"/>`;
    s += `<rect x="${cliff + 10}" y="200" width="800" height="200" fill="${p.sea || '#2d4a5c'}"/>` + [0, 1, 2, 3].map(i => `<path d="M${f1(cliff + 60 + ((i * 140 + t * 30) % 420))} ${220 + i * 12}h50" stroke="#fff" stroke-opacity="0.3" stroke-width="3"/>`).join('');
    for (let i = 0; i < n; i++) {
      const lag = r() * 0.5, spd = 0.8 + r() * 0.4, row = r(), x0 = -620 + r() * 300;
      const u = clamp((run - lag * 0.6) * spd * 1.4);
      let x = lerp(x0, cliff + 150, u), y = -4 - row * 30, rot = 0, sc = 0.7 + row * 0.15;
      if (x > cliff) { const fall = (x - cliff) / 150; y += fall * fall * 260; rot = fall * 70; }
      if (y > 240) continue;
      const leg = Math.sin(t * 16 + i * 2) * 8 * (u > 0 && u < 1 ? 1 : 0.2);
      s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(sc * 100) / 100})">`;
      s += `<path d="M-30 -6l${f1(-4 + leg)} 20M-14 -4l${f1(4 - leg)} 20M14 -4l${f1(-4 + leg)} 20M28 -6l${f1(4 - leg)} 20" stroke="${mix(c, '#000', 0.35)}" stroke-width="7" stroke-linecap="round"/>`;
      s += `<ellipse cx="0" cy="-22" rx="44" ry="26" fill="${c}"/><ellipse cx="6" cy="-14" rx="34" ry="14" fill="${mix(c, '#000', 0.15)}" opacity="0.5"/><circle cx="44" cy="-28" r="18" fill="${c}"/><ellipse cx="60" cy="-26" rx="8" ry="9" fill="${mix(c, '#000', 0.2)}"/><circle cx="62" cy="-29" r="1.6" fill="#3a2020"/><circle cx="62" cy="-23" r="1.6" fill="#3a2020"/><path d="M36 -44l8 -12l6 14Z" fill="${mix(c, '#000', 0.2)}"/><circle cx="48" cy="-33" r="2.4" fill="#1a1010"/><path d="M-44 -26q-10 -8 -6 -16" stroke="${c}" stroke-width="3" fill="none"/>`;
      s += `</g>`;
    }
    return s;
  }
  /* A night park: bare trees, a pond with ripples, a grotto mouth, an optional lantern. */
  function park(p, t, seed, age) {
    const c = p.color || '#101114', rip = p.ripple || 0;
    let s = `<ellipse cx="0" cy="120" rx="420" ry="70" fill="#1a2a33"/><ellipse cx="0" cy="120" rx="420" ry="70" fill="none" stroke="#2c4250" stroke-width="3"/>`;
    for (let i = 0; i < 3; i++) { const k = ((t * 0.4 + i / 3) % 1) * rip; if (rip > 0) s += `<ellipse cx="60" cy="125" rx="${f1(30 + 200 * k)}" ry="${f1(6 + 34 * k)}" fill="none" stroke="#7f9fb0" stroke-opacity="${f1(0.5 * (1 - k))}" stroke-width="2"/>`; }
    s += `<path d="M-640 260V60Q-500 30 -380 70Q-300 20 -240 60V260Z" fill="${c}"/><path d="M640 260V40Q520 10 420 60V260Z" fill="${c}"/>`;
    s += `<path d="M330 70Q330 -30 400 -40Q470 -30 470 70Z" fill="#050507"/><path d="M320 72Q320 -50 400 -62Q480 -50 480 72" stroke="${c}" stroke-width="22" fill="none"/>`;
    const r = rng('trees' + seed);
    for (let i = 0; i < 7; i++) {
      const x = -600 + i * 190 + r() * 60, hgt = 260 + r() * 140, base = 60 + r() * 30;
      s += `<path d="M${f1(x)} ${f1(base)}V${f1(base - hgt)}" stroke="${c}" stroke-width="${f1(10 + r() * 6)}"/>`;
      for (let b = 0; b < 5; b++) { const by = base - hgt * (0.4 + b * 0.12), dir = b % 2 ? 1 : -1, l = 50 + r() * 70; s += `<path d="M${f1(x)} ${f1(by)}q${f1(dir * l * 0.5)} ${f1(-l * 0.3)} ${f1(dir * l)} ${f1(-l * 0.7)}" stroke="${c}" stroke-width="${f1(4 + r() * 3)}" fill="none"/>`; }
    }
    if (p.lantern) { const lx = p.lantern[0], ly = p.lantern[1]; s += glow(lx, ly, 160, '#ffcf6a', 0.5) + `<rect x="${lx - 9}" y="${ly - 14}" width="18" height="26" rx="3" fill="#ffd77a"/><path d="M${lx - 12} ${ly - 14}h24M${lx} ${ly - 14}v-12" stroke="#333" stroke-width="3"/>`; }
    return s;
  }
  /* Semyonovsky Square, 1849: three posts with hooded prisoners, a line of soldiers; aim 0..1 raises the rifles. */
  function stakes(p, t, seed, age) {
    const c = p.color || INK, aim = p.aim || 0;
    let s = `<rect x="-640" y="40" width="1280" height="200" fill="#d8ccb2"/>`;
    for (let i = 0; i < 3; i++) { const x = -160 + i * 160; s += `<rect x="${x - 7}" y="-170" width="14" height="210" fill="${c}"/><g transform="translate(${x} -60)"><path d="M-26 90V-20Q-26 -60 0 -62Q26 -60 26 -20V90Z" fill="#f2efe8" stroke="${c}" stroke-width="2"/><path d="M-22 -40Q0 -76 22 -40Q22 -10 0 -6Q-22 -10 -22 -40Z" fill="#f2efe8" stroke="${c}" stroke-width="2"/></g>`; }
    for (let i = 0; i < 8; i++) {
      const x = -420 + i * 120, y = 210;
      s += `<g transform="translate(${x} ${y})"><circle cx="0" cy="-104" r="14" fill="${c}"/><path d="M-12 -118h24v-10h-24Z" fill="${c}"/><path d="M-22 0V-60Q-22 -86 0 -86Q22 -86 22 -60V0Z" fill="${c}"/><path d="M8 -70L${f1(30 + 40 * aim)} ${f1(-60 - 70 * aim)}" stroke="${c}" stroke-width="6" stroke-linecap="round"/></g>`;
    }
    return s;
  }
  /* A steam train leaving to the right; go 0..1. */
  function train(p, t, seed, age) {
    const go = p.go || 0, x = lerp(-300, 900, ease(go)), c = p.color || INK;
    let s = `<path d="M-700 40H700" stroke="${c}" stroke-width="4"/>` + Array.from({ length: 30 }, (_, i) => `<path d="M${-700 + i * 48} 40v10" stroke="${c}" stroke-width="4"/>`).join('');
    s += `<g transform="translate(${f1(x)} 0)">`;
    for (let k = 0; k < 3; k++) s += `<rect x="${-260 - k * 150}" y="-70" width="140" height="80" rx="6" fill="${c}"/>` + [0, 1, 2].map(j => `<rect x="${-246 - k * 150 + j * 42}" y="-56" width="28" height="22" fill="#e9b94e" opacity="0.8"/>`).join('') + `<circle cx="${-230 - k * 150}" cy="22" r="14" fill="${c}"/><circle cx="${-150 - k * 150}" cy="22" r="14" fill="${c}"/>`;
    s += `<path d="M-110 10V-60H-30V-110H0V-60H40L70 10Z" fill="${c}"/><circle cx="-70" cy="22" r="20" fill="${c}"/><circle cx="20" cy="22" r="20" fill="${c}"/>`;
    for (let i = 0; i < 6; i++) { const k = (t * 0.8 + i / 6) % 1; s += `<circle cx="${f1(-15 - k * 220)}" cy="${f1(-120 - k * 80)}" r="${f1(14 + k * 40)}" fill="#bdb6a8" opacity="${f1(0.6 * (1 - k))}"/>`; }
    return s + `</g>`;
  }
  /* A torn scrap of coloured paper, for layering. */
  function scrap(p, t, seed) { const e = torn(p.w || 300, p.h || 200, seed, p.jag || 5, 10); return (p.shadow === false ? '' : drop(e, 0.18)) + `<path d="${e}" fill="${p.color || YEL}"/>`; }
  /* A two-pan balance in marker style; tilt -1..1, left/right labels. */
  function balance(p, t, seed) {
    const tl = (p.tilt || 0) * 0.35, c = p.color || INK, L = 230;
    let s = `<path d="M0 -150V160M-80 160H80" stroke="${c}" stroke-width="8" stroke-linecap="round"/><circle cx="0" cy="-150" r="12" fill="${c}"/>`;
    const lx = -L * Math.cos(tl), lyy = -150 - L * Math.sin(tl), rx = L * Math.cos(tl), ry = -150 + L * Math.sin(tl);
    s += `<path d="M${f1(lx)} ${f1(lyy)}L${f1(rx)} ${f1(ry)}" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`;
    for (const [x, y, lab] of [[lx, lyy, p.left], [rx, ry, p.right]]) s += `<path d="M${f1(x)} ${f1(y)}L${f1(x - 70)} ${f1(y + 110)}M${f1(x)} ${f1(y)}L${f1(x + 70)} ${f1(y + 110)}" stroke="${c}" stroke-width="2"/><path d="M${f1(x - 90)} ${f1(y + 110)}Q${f1(x)} ${f1(y + 160)} ${f1(x + 90)} ${f1(y + 110)}Z" fill="${c}"/>` + (lab ? T(lab, x, y + 190, 24, { font: 'head', weight: 400 }) : '');
    return s;
  }
  /* A candle on a table (the reading in the hut). */
  function candle(p, t, seed) {
    const fl = Math.sin(t * 9) * 2 + Math.sin(t * 13) * 1.5;
    return glow(0, -110, 260, '#ffcf6a', 0.55) + `<rect x="-14" y="-90" width="28" height="100" rx="3" fill="#f1e6cc"/><path d="M0 -90V-100" stroke="#222" stroke-width="2"/><path d="M0 ${f1(-140 + fl)}Q12 -110 0 -98Q-12 -110 0 ${f1(-140 + fl)}Z" fill="#ffcf5a"/><path d="M0 ${f1(-124 + fl * 0.5)}Q5 -108 0 -101Q-5 -108 0 ${f1(-124 + fl * 0.5)}Z" fill="#fff6d0"/><path d="M-60 10H60V22H-60Z" fill="#6b4a32"/>`;
  }
  /* A simple hanging-lamp-lit bare table with an overturned chair; used for absence (no figures). */
  function emptyroom(p, t, seed) {
    const c = p.color || '#141418';
    return glow(0, -200, 300, '#e8c27a', 0.35) + `<path d="M0 -360V-230" stroke="${c}" stroke-width="3"/><path d="M-30 -200L-14 -232H14L30 -200Z" fill="${c}"/><ellipse cx="0" cy="-198" rx="12" ry="4" fill="#ffe2a0"/><path d="M-160 40H160M-140 40V140M140 40V140" stroke="${c}" stroke-width="10"/><g transform="translate(240 120) rotate(${p.tip == null ? 75 : p.tip})"><path d="M-40 0H40M-36 0V60M36 0V60M-36 0V-70" stroke="${c}" stroke-width="8"/></g>`;
  }
  // collage-aware source line: a small typed tag in the bottom left
  const baseCite = X.DRAW.cite;
  function cite(p, t, seed, age) {
    if (!collage()) return baseCite(p, t, seed, age);
    X.frame.cites.push({ text: (p.prefix == null ? 'Source: ' : p.prefix) + p.text, op: clamp((age || 0) / 0.6) });
    return '';
  }
  Object.assign(X.DRAW, { cut, hl, headline, scrib, strings, sheet, stampc, openbook, ptl, herd, cell, crowdp, town, pigs, park, stakes, train, scrap, balance, candle, emptyroom, cite });

  // ---------- cards ----------
  const paperBG = (t, pal = 'cream') => X.BG.paperc({ pal, scraps: 0 }, t, { px: t * 3, py: 0 }, X.PAL[pal]);
  X.CARDS.ctitle = (c, t, age, dur) => {
    let s = `<rect width="${W}" height="${H}" fill="${c.bg || '#b8302a'}"/>` + X.BG.paperc({ pal: 'oxblood', scraps: 0 }, t, { px: t * 2, py: 0 }, X.PAL.oxblood).replace(/^<rect[^>]*>/, '');
    const k = easeOut(clamp(age / 0.8)), ti = clamp((age - 0.5) / 0.6);
    s += `<g transform="translate(640 ${f1(300 - 30 * (1 - k))})" opacity="${f1(k)}"><g transform="rotate(-2)">` + drop(torn(860, 200, 'tt', 6, 12), 0.35, 8, 10) + `<path d="${torn(860, 200, 'tt', 6, 12)}" fill="${INK}"/>` + T(c.title, 0, 6, c.size || 150, { font: 'head', fill: '#f4ecdc', weight: 400, ls: 6 }) + `</g></g>`;
    if (c.sub) { const sw = TW(c.sub, 30, 650) + 50; s += `<g transform="translate(640 448) rotate(1.5)" opacity="${f1(ti)}"><path d="${torn(sw, 56, 'ts', 3, 9)}" fill="${YEL}"/>${T(c.sub, 0, 2, 30, { weight: 700 })}</g>`; }
    if (c.kicker) s += T(c.kicker.toUpperCase(), 640, 150, 20, { weight: 700, ls: 8, fill: '#f4d9c8', op: f1(clamp((age - 0.2) / 0.6)) });
    if (c.by) s += T(c.by, 640, 560, 18, { weight: 600, fill: '#f0d6c8', op: f1(clamp((age - 1.2) / 0.8)) });
    return s;
  };
  X.CARDS.cchapter = (c, t, age, dur) => {
    const col = c.color || RED;
    let s = paperBG(t, c.pal || 'cream');
    const a = back(clamp(age / 0.5)), ti = clamp((age - 0.3) / 0.5);
    s += `<g transform="translate(330 360) rotate(-4) scale(${f1(a * 100) / 100})">` + drop(torn(300, 300, 'cn' + c.id, 6, 12), 0.3) + `<path d="${torn(300, 300, 'cn' + c.id, 6, 12)}" fill="${col}"/>` + T(String(c.num || ''), 0, 10, 210, { font: 'head', weight: 400, fill: '#f6f1e6' }) + `</g>`;
    s += `<g opacity="${f1(ti)}" transform="translate(${f1(540 + 20 * (1 - easeOut(ti)))} 0)">` + T((c.kicker || '').toUpperCase(), 0, 270, 22, { anchor: 'start', weight: 700, ls: 6, fill: mix(col, '#000', 0.2) }) + T(c.title, 0, 350 + (String(c.title).split('\n').length - 1) * 30, c.size || 62, { font: 'head', weight: 400, anchor: 'start', lh: 1.05 }) + `</g>`;
    if (c.sub) s += `<g opacity="${f1(clamp((age - 0.8) / 0.6))}">` + T(c.sub, 540, 470 + (String(c.title).split('\n').length - 1) * 50, 24, { anchor: 'start', weight: 500, italic: true, fill: '#4c443a' }) + `</g>`;
    if (c.who) s += `<g transform="translate(1110 560) rotate(5) scale(0.6)" opacity="${f1(clamp((age - 0.6) / 0.5))}">` + cut({ who: c.who, w: 240, h: 280, color: c.whoColor || '#c9b893' }, t, 'chw' + c.id, age) + `</g>`;
    return s;
  };
  X.CARDS.cquote = (c, t, age, dur) => {
    let s = `<rect width="${W}" height="${H}" fill="${c.bg || '#1d1b19'}"/>`;
    s += `<g transform="translate(640 ${c.by ? 330 : 360})">` + hl({ text: c.text, size: c.size || 44, font: c.font || 'serif', weight: 700, italic: c.italic !== false, color: '#f4ecdc', hcolor: c.hcolor || '#b8302a', delay: 0.8, speed: c.speed || 1.6 }, t, 'cq' + c.id, age) + `</g>`;
    if (c.by) s += T(c.by, 640, 330 + String(c.text).split('\n').length * (c.size || 44) * 0.75 + 40, 20, { weight: 600, fill: '#b8ab95', op: f1(clamp((age - 1.4) / 0.8)) });
    return s;
  };
  X.CARDS.cend = (c, t, age, dur) => {
    let s = paperBG(t, 'cream');
    const lines = c.credits || [], lh = 30, total = lines.length * lh + 300, y0 = H + 40 - (total + H * 0.2) * clamp(age / Math.max(1, dur - 1.5));
    lines.forEach((l, i) => {
      const y = y0 + i * lh + (c.title ? 170 : 0); if (y < -40 || y > H + 40) return;
      const head = l.startsWith('#');
      s += head ? T(l.replace(/^#\s*/, '').toUpperCase(), 640, y, 22, { font: 'head', weight: 400, fill: RED, ls: 3 }) : T(l, 640, y, 18, { weight: 550, fill: '#3d372f' });
    });
    if (c.title) s += `<g transform="translate(640 ${f1(y0 + 60)})">` + headline({ text: c.title, size: 56, bg: INK, color: '#f4ecdc' }, t, 'endt', age) + `</g>`;
    return s;
  };

  // ---------- post: newsprint grain, source tags ----------
  X.post.push((T0) => {
    if (!collage()) return '';
    const fr = Math.floor(T0 * 12);
    let s = `<defs><filter id="paperF" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${fr % 5}" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 1.4 -0.6"/></filter></defs>`;
    s += `<rect width="${W}" height="${H}" filter="url(#paperF)" opacity="0.25"/>`;
    const g = nid('cv');
    s += `<radialGradient id="${g}" cx="0.5" cy="0.5" r="0.78"><stop offset="0.6" stop-color="#3a2a16" stop-opacity="0"/><stop offset="1" stop-color="#2a1d0e" stop-opacity="0.32"/></radialGradient><rect width="${W}" height="${H}" fill="url(#${g})"/>`;
    const cs = X.frame.cites;
    cs.forEach((c, i) => {
      const w = TW(c.text, 14, 600) + 26, y = H - 30 - (cs.length - 1 - i) * 30;
      s += `<g transform="translate(${f1(28 + w / 2)} ${y})" opacity="${f1(c.op)}"><path d="${torn(w, 24, 'cite' + i, 2, 8)}" fill="#f6f1e6" opacity="0.92"/>${T(c.text, 0, 1, 14, { weight: 600, fill: '#4a4238' })}</g>`;
    });
    return s;
  });

  X.fonts = (X.fonts || []).concat(["400 30px 'Archivo Black'", "500 30px 'Libre Franklin'", "600 30px 'Libre Franklin'", "700 30px 'Libre Franklin'", "italic 500 30px 'Libre Franklin'", "400 30px 'Permanent Marker'"]);
  X.dip = () => collage() ? '#1d1b19' : null;
})();
