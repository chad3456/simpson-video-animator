// Barnaby Plant Burgers: brand identity showreel.
// Every frame is a pure function of time: Reel.renderAt(t) rebuilds the stage.
// Layout and pacing follow the reference identity reel: typewriter lines where a word
// turns into an icon, a balancing stack, logo construction with anchor points,
// photo cuts with a white mascot overlay, a tool UI, huge cropped type, a type
// specimen, palette, icon grid, mockups and a one-line sign-off.
(function () {
  const W = 1920, H = 1080;
  const C = {
    tomato: '#FF4A2E', mustard: '#FFC21A', lettuce: '#5FCB3C', beet: '#C2185B',
    radish: '#FF8FB8', bun: '#FFF1DC', pep: '#1F1420', crust: '#F4A340', patty: '#8E2A3A', white: '#FFFFFF',
  };
  const BRAND = 'barnaby';

  // ---------- math ----------
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const eOut = k => 1 - Math.pow(1 - k, 3);
  const eInOut = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const eBack = k => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
  const bounce = k => {
    const n = 7.5625, d = 2.75;
    if (k < 1 / d) return n * k * k;
    if (k < 2 / d) return n * (k -= 1.5 / d) * k + 0.75;
    if (k < 2.5 / d) return n * (k -= 2.25 / d) * k + 0.9375;
    return n * (k -= 2.625 / d) * k + 0.984375;
  };
  const blinkAt = t => { const p = t % 3.1; return p > 2.95 ? 0.12 : 1; };

  // ---------- photos ----------
  // photos/credits.json lists the curated open-licensed photos. A slot without a file
  // renders as a clearly labelled placeholder card, never a fake photo.
  let PHOTOS = {};
  function photo(key, label, x, y, w, h, extra = '') {
    const p = PHOTOS[key];
    if (p) return `<div class="ph" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}"><img src="photos/${p.file}"></div>`;
    return `<div class="ph slot" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}"><span>PHOTO SLOT · ${label}</span></div>`;
  }

  // ---------- icons (viewBox 0 0 48 48, drawn in currentColor) ----------
  const I = {
    burger: '<path d="M6 22c0-9 8-14 18-14s18 5 18 14z"/><path d="M5 26h38v4H5z" opacity=".75"/><path d="M5 26c3 3 5 3 8 0s5 3 8 0 5 3 8 0 5 3 8 0 5 3 6 0" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="6" y="32" width="36" height="8" rx="4"/>',
    hat: '<ellipse cx="24" cy="34" rx="21" ry="5"/><path d="M11 33c0-16 4-22 13-22s13 6 13 22z"/>',
    tomato: '<circle cx="24" cy="27" r="15"/><path d="M24 12l-6-4 4 6-7 1 7 2 2 4 2-4 7-2-7-1 4-6z" opacity=".7"/>',
    leaf: '<path d="M10 38C8 20 20 8 40 8c0 20-12 32-30 30z"/><path d="M10 38L30 18" stroke="#fff" stroke-width="2" opacity=".6"/>',
    cloche: '<path d="M6 34a18 17 0 0 1 36 0z"/><circle cx="24" cy="14" r="3"/><rect x="3" y="35" width="42" height="4" rx="2"/>',
    bowtie: '<path d="M24 24L6 14v20zM24 24l18-10v20z"/><circle cx="24" cy="24" r="4"/>',
    fries: '<path d="M13 22h22l-3 20H16z"/><path d="M15 22l-2-14h3l2 14zM21 22V6h3v16zM27 22l1-15h3l-1 15zM32 22l3-12h3l-3 12z" opacity=".7"/>',
    cup: '<path d="M13 14h22l-3 28H16z"/><rect x="11" y="10" width="26" height="5" rx="2"/><path d="M26 10l4-7" stroke="currentColor" stroke-width="2.5"/>',
    bell: '<path d="M8 34a16 16 0 0 1 32 0z"/><rect x="5" y="35" width="38" height="4" rx="2"/><circle cx="24" cy="16" r="3"/>',
    stache: '<path d="M24 22c-3-5-10-6-15-2-4 3-6 2-7-1 0 6 6 11 13 9 5-1 7-4 9-4s4 3 9 4c7 2 13-3 13-9-1 3-3 4-7 1-5-4-12-3-15 2z"/>',
    pea: '<path d="M6 30C14 14 30 8 42 10 38 26 22 36 6 30z"/><circle cx="17" cy="25" r="4" fill="#fff" opacity=".5"/><circle cx="25" cy="21" r="4" fill="#fff" opacity=".5"/><circle cx="33" cy="17" r="4" fill="#fff" opacity=".5"/>',
    beet: '<path d="M24 16c10 0 15 8 13 16-2 7-8 11-13 14-5-3-11-7-13-14-2-8 3-16 13-16z"/><path d="M24 16L18 4M24 16l1-12M24 16l7-10" stroke="currentColor" stroke-width="3"/>',
    mushroom: '<path d="M6 24c0-10 8-16 18-16s18 6 18 16z"/><path d="M19 24h10l2 16H17z" opacity=".7"/>',
    chili: '<path d="M12 12c8 2 14 10 16 18s8 12 14 12c-12 4-26-6-30-16-2-5-2-10 0-14z"/><path d="M12 12c-2-4 0-8 4-8" fill="none" stroke="currentColor" stroke-width="3"/>',
    grill: '<path d="M6 18h36a18 18 0 0 1-36 0z"/><path d="M14 34l-4 10M34 34l4 10M24 36v8" stroke="currentColor" stroke-width="3"/><path d="M16 6c-2 3 2 5 0 8M24 4c-2 3 2 5 0 8M32 6c-2 3 2 5 0 8" fill="none" stroke="currentColor" stroke-width="2.5"/>',
    heart: '<path d="M24 41S6 30 6 18c0-6 5-10 10-10 4 0 7 2 8 5 1-3 4-5 8-5 5 0 10 4 10 10 0 12-18 23-18 23z"/>',
    star: '<path d="M24 4l6 13 14 2-10 10 3 14-13-7-13 7 3-14L4 19l14-2z"/>',
    bag: '<path d="M8 16h32l-3 28H11z"/><path d="M17 18v-6a7 7 0 0 1 14 0v6" fill="none" stroke="currentColor" stroke-width="3"/>',
    truck: '<rect x="3" y="12" width="28" height="20" rx="2"/><path d="M31 18h8l6 7v7H31z"/><circle cx="12" cy="36" r="5"/><circle cx="37" cy="36" r="5"/>',
    sprout: '<path d="M24 44V22" stroke="currentColor" stroke-width="3"/><path d="M24 24C24 14 16 8 6 8c0 10 8 16 18 16zM24 20c0-8 7-14 18-14 0 9-7 14-18 14z"/>',
    sun: '<circle cx="24" cy="24" r="9"/><path d="M24 3v8M24 37v8M3 24h8M37 24h8M9 9l6 6M33 33l6 6M9 39l6-6M33 15l6-6" stroke="currentColor" stroke-width="3"/>',
    sauce: '<path d="M18 14h12l4 30H14z"/><path d="M21 4h6v10h-6z" opacity=".7"/>',
    plate: '<circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="24" r="11"/>',
    glove: '<path d="M14 44V22c0-3 4-3 4 0V10c0-3 4-3 4 0v-2c0-3 4-3 4 0v2c0-3 4-3 4 0v6c0-3 4-3 4 0v16c0 7-5 12-11 12z"/>',
    onion: '<path d="M24 6c8 8 16 14 16 24a16 14 0 0 1-32 0C8 20 16 14 24 6z"/><path d="M24 14c-5 6-8 10-8 16M24 14c5 6 8 10 8 16" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>',
  };
  const icon = (n, size, color, extra = '') =>
    `<svg class="ic" viewBox="0 0 48 48" width="${size}" height="${size}" style="color:${color};fill:${color};${extra}">${I[n]}</svg>`;

  // ---------- mascot ----------
  // Box: viewBox -80 -40 560 580, feet at y~510, centre x=200.
  function mascot(o = {}) {
    const t = o.t || 0, pose = o.pose || 'stand', mono = o.mono, k = o.parts; // parts: object of 0..1 per layer drop
    const fill = c => (mono ? '#fff' : c);
    const ink = mono ? 'rgba(31,20,32,.55)' : C.pep;
    const bl = o.blink === false ? 1 : blinkAt(t + (o.seed || 0));
    const show = n => (k ? k[n] : 1);
    const dy = n => (k ? -900 * (1 - bounce(clamp(k[n]))) : 0);
    const tilt = n => (k ? Math.sin(t * 2.2 + n) * 3 * (1 - clamp(k.settle || 0)) : 0);
    const L = (n, inner) => show(n) > 0 ? `<g transform="translate(0 ${dy(n)}) rotate(${tilt(n.length)} 200 400)">${inner}</g>` : '';
    const sway = Math.sin(t * 6) * 18;
    const arms = {
      stand: [[30, 440], [370, 440]],
      wave: [[30, 440], [410 + sway * 0.4, 230 + sway * 0.2]],
      serve: [[30, 440], [400, 300]],
      bow: [[-10, 360], [370, 440]],
      tada: [[-20, 240], [420, 240]],
    }[pose];
    const face = show('face') > 0 ? `
      <ellipse cx="160" cy="225" rx="24" ry="${30 * bl}" fill="#fff" stroke="${ink}" stroke-width="5"/>
      <ellipse cx="240" cy="225" rx="24" ry="${30 * bl}" fill="#fff" stroke="${ink}" stroke-width="5"/>
      ${bl > 0.5 ? `<circle cx="${165 + Math.sin(t) * 4}" cy="232" r="11" fill="${ink}"/><circle cx="${245 + Math.sin(t) * 4}" cy="232" r="11" fill="${ink}"/>` : ''}
      ${mono ? '' : `<circle cx="118" cy="272" r="18" fill="${C.radish}" opacity=".9"/><circle cx="282" cy="272" r="18" fill="${C.radish}" opacity=".9"/>`}
      <path transform="translate(200 284) scale(1.25)" d="M0 0C-10-14-30-16-45-6-58 3-66 4-74-6-70 10-52 22-34 16-18 11-6 4 0 4 6 4 18 11 34 16 52 22 70 10 74-6 66 4 58 3 45-6 30-16 10-14 0 0Z" fill="${ink}"/>` : '';
    const seeds = mono ? '' : [[120, 190], [150, 160], [200, 150], [255, 165], [285, 195], [180, 180]].map(([x, y], i) =>
      `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" transform="rotate(${i * 37} ${x} ${y})" fill="${C.bun}"/>`).join('');
    // hat position by pose
    let hat = { x: 200, y: 140, r: -8 };
    if (pose === 'wave') hat = { x: 200, y: 136, r: -14 + sway * 0.2 };
    if (pose === 'bow') hat = { x: -20, y: 330, r: -70 };
    if (pose === 'tada') hat = { x: 200, y: 70, r: 6 };
    const hatDrop = k ? -900 * (1 - bounce(clamp(k.hat))) : 0;
    const hatSvg = show('hat') > 0 ? `<g transform="translate(${hat.x - 200} ${hat.y - 140 + hatDrop}) rotate(${hat.r} 200 140)">
        <ellipse cx="200" cy="146" rx="122" ry="22" fill="${fill(C.pep)}"/>
        <path d="M112 144C110 58 140 34 200 34S290 58 288 144Z" fill="${fill(C.pep)}"/>
        <rect x="112" y="112" width="176" height="22" fill="${mono ? 'rgba(31,20,32,.25)' : C.mustard}"/></g>` : '';
    const armLine = ([x, y], sx) => `<path d="M${sx} 380 Q${(sx + x) / 2} ${y + 30} ${x} ${y}" fill="none" stroke="${mono ? '#fff' : C.pep}" stroke-width="12" stroke-linecap="round"/>
        <circle cx="${x}" cy="${y}" r="22" fill="#fff" stroke="${ink}" stroke-width="5"/>`;
    const armsSvg = show('arms') > 0 ? armLine(arms[0], 60) + armLine(arms[1], 340) +
      (pose === 'serve' ? `<g transform="translate(${arms[1][0]} ${arms[1][1] - 26})">
        <rect x="-100" y="0" width="200" height="12" rx="6" fill="${fill('#c9c3c8')}" stroke="${ink}" stroke-width="4"/>
        <path d="M-82 0A82 76 0 0 1 82 0Z" fill="${fill('#E9E4E8')}" stroke="${ink}" stroke-width="5" transform="translate(0 ${-Math.max(0, Math.sin(t * 2)) * 40})"/>
        <circle cx="0" cy="${-84 - Math.max(0, Math.sin(t * 2)) * 40}" r="11" fill="${fill(C.pep)}"/></g>` : '') : '';
    const legs = show('bottom') > 0 && !k ? `<path d="M150 468v38M250 468v38" stroke="${mono ? '#fff' : C.pep}" stroke-width="12" stroke-linecap="round"/>
        <ellipse cx="138" cy="510" rx="26" ry="11" fill="${fill(C.pep)}"/><ellipse cx="262" cy="510" rx="26" ry="11" fill="${fill(C.pep)}"/>` : '';
    const body = `${legs}
      ${L('bottom', `<rect x="58" y="402" width="284" height="70" rx="32" fill="${fill(C.crust)}" stroke="${ink}" stroke-width="${mono ? 0 : 5}"/>`)}
      ${L('patty', `<rect x="46" y="350" width="308" height="58" rx="28" fill="${fill(C.patty)}" stroke="${ink}" stroke-width="${mono ? 0 : 5}"/>`)}
      ${L('tomato', `<rect x="66" y="330" width="268" height="28" rx="12" fill="${fill(C.tomato)}" stroke="${ink}" stroke-width="${mono ? 0 : 5}"/>`)}
      ${L('lettuce', `<path d="M40 322c20 30 40 30 60 6s40 30 60 6 40 30 60 6 40 30 60 6 40 30 60-6v24H40z" fill="${fill(C.lettuce)}" stroke="${ink}" stroke-width="${mono ? 0 : 5}"/>`)}
      ${L('top', `<path d="M54 326C54 186 128 132 200 132S346 186 346 326Z" fill="${fill(C.crust)}" stroke="${ink}" stroke-width="${mono ? 0 : 5}"/>${seeds}`)}
      ${face}
      ${show('tie') > 0 ? `<g transform="translate(200 354)"><path d="M0 0L-38-20v40zM0 0l38-20v40z" fill="${fill(C.pep)}"/><circle r="9" fill="${mono ? '#fff' : C.mustard}"/></g>` : ''}
      ${armsSvg}`;
    const bowRot = pose === 'bow' ? 14 * eInOut(clamp((Math.sin(t * 2.4) + 1) / 2)) : 0;
    const hop = pose === 'tada' ? -Math.abs(Math.sin(t * 5)) * 24 : 0;
    const s = o.s || 1;
    return `<svg class="mascot" viewBox="-120 -60 640 600" width="${640 * s}" height="${600 * s}" style="left:${o.x - 320 * s}px;top:${o.y - 570 * s}px;${o.style || ''}">
      <g transform="translate(0 ${hop}) rotate(${(o.rot || 0) + bowRot} 200 510)">${body}${hatSvg}</g></svg>`;
  }

  // logo mark: hat over a moustache
  const markPath = 'M60 150C60 130 104 126 112 126C112 44 288 44 288 126C296 126 340 130 340 150C340 172 60 172 60 150Z';
  const stachePath = 'M0 0C-10-14-30-16-45-6-58 3-66 4-74-6-70 10-52 22-34 16-18 11-6 4 0 4 6 4 18 11 34 16 52 22 70 10 74-6 66 4 58 3 45-6 30-16 10-14 0 0Z';
  function mark(color, band = C.mustard) {
    return `<path d="${markPath}" fill="${color}"/><rect x="112" y="108" width="176" height="20" fill="${band}"/>
      <path transform="translate(200 214) scale(1.7)" d="${stachePath}" fill="${color}"/>`;
  }
  const wordmark = (size, color, hatColor = color) => `<div class="wm" style="font-size:${size}px;color:${color}">
      <svg viewBox="40 30 320 220" style="width:${size * 0.62}px;position:absolute;left:${size * -0.04}px;top:${size * -0.46}px;transform:rotate(-10deg)">${mark(hatColor)}</svg>${BRAND}</div>`;

  // ---------- typewriter ----------
  // segs: strings or {w:'word', icon:'name', color}. The word types, holds, then pops into its icon.
  function typer(segs, t, o = {}) {
    const cps = o.cps || 16, hold = 0.35;
    let clock = 0, html = '', done = true;
    for (const sg of segs) {
      const s = typeof sg === 'string' ? { w: sg } : sg;
      if (s.br) { html += '<br>'; continue; }
      const dur = s.w.length / cps;
      const n = Math.floor(clamp((t - clock) / dur) * s.w.length);
      if (t < clock) { done = false; break; }
      if (s.icon) {
        const k = prog(t, clock + dur + hold, clock + dur + hold + 0.25);
        if (k > 0) html += `<span class="icw" style="transform:scale(${eBack(k)})">${s.img ? s.img : icon(s.icon, o.size * 0.95, s.color || C.pep)}</span>`;
        else html += escape(s.w.slice(0, n));
        clock += dur + hold + 0.25;
      } else { html += escape(s.w.slice(0, n)); clock += dur; }
      if (t < clock) { done = false; break; }
    }
    const cur = (!done || Math.floor(t * 2.2) % 2 === 0) && !o.noCursor ? `<span class="cur" style="background:${o.color || C.pep}"></span>` : '';
    return `<div class="type" style="font-size:${o.size}px;color:${o.color || C.pep};left:${o.x}px;top:${o.y}px;width:${o.w || 1600}px;text-align:${o.align || 'center'};${o.style || ''}">${html}${cur}</div>`;
  }
  const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const mono = (txt, x, y, size = 30, color = C.pep, extra = '') => `<div class="mono" style="left:${x}px;top:${y}px;font-size:${size}px;color:${color};${extra}">${txt}</div>`;
  const bg = c => `<div class="bg" style="background:${c}"></div>`;
  // the little green dash rows at the edges of the reference frames
  const ticks = (color, t) => mono('-----'.repeat(2).slice(0, 6 + (Math.floor(t * 6) % 5)), 40, 520, 22, color, 'letter-spacing:2px') +
    mono('------'.slice(0, 3 + (Math.floor(t * 5) % 4)) + '- -- -', 1720, 520, 22, color, 'letter-spacing:2px');

  // ---------- scenes ----------
  const S = [];
  const scene = (dur, fn) => S.push({ dur, fn });

  // 1. Balancing stack, typed as a file name
  scene(6.0, t => {
    const k = { bottom: prog(t, 0.6, 1.3), patty: prog(t, 1.1, 1.8), tomato: prog(t, 1.6, 2.3), lettuce: prog(t, 2.1, 2.8),
      top: prog(t, 2.6, 3.3), hat: prog(t, 3.3, 4.1), face: t > 4.4 ? 1 : 0, tie: t > 4.7 ? 1 : 0, arms: 0, settle: prog(t, 4.2, 5.2) };
    const names = ['b', 'brg', 'brgr_', 'brgr_01', 'brgr_0', 'brgr_', 'stck_2', 'stck_3', 'brnby_', 'brnby_v4'];
    const nm = names[Math.min(names.length - 1, Math.floor(t * 1.7))];
    const pos = [[640, 560], [760, 300], [820, 250], [860, 220], [880, 200]][Math.min(4, Math.floor(t / 1.25))];
    return bg(C.white) + ticks(C.lettuce, t) + mono(nm + '<span class="cur" style="background:' + C.pep + '"></span>', pos[0], pos[1], 52) +
      mascot({ t, x: 960, y: 1000, s: 1.25, parts: k, rot: Math.sin(t * 1.7) * 2 * (1 - k.settle) });
  });

  // 2. Typewriter line with an inline icon and an inline mascot chip
  scene(7.5, t => {
    const chip = `<span class="chip" style="background:${C.radish}">${mascot({ t, x: 60, y: 108, s: 0.19, blink: true })}</span>`;
    return bg(C.white) + typer(['We serve ', { w: 'burger', icon: 'burger', color: C.tomato }, ' ', { br: 1 }, 'from the ground up, ', { br: 1 }, 'to ', { w: 'delight', icon: 'x', img: chip }, ' the whole', { br: 1 }, 'neighbourhood.'], t - 0.2,
      { size: 120, x: 160, y: 200, w: 1600, cps: 15 });
  });

  // 3. Quick photo cuts with a white mascot standing on them
  const photoCut = (key, label, pose, mx, my, ms) => t => photo(key, label, 0, 0, W, H, `transform:scale(${1.04 + t * 0.03})`) +
    mascot({ t, x: mx, y: my, s: ms, mono: true, pose, style: 'filter:drop-shadow(0 10px 30px rgba(0,0,0,.25))' });
  scene(1.1, photoCut('burger', 'plant-based burger close-up', 'stand', 330, 1010, 0.8));
  scene(1.0, photoCut('ingredients', 'fresh vegetables', 'wave', 520, 960, 0.75));
  scene(1.2, photoCut('field', 'green field / crops', 'tada', 1300, 930, 0.6));

  // 4. Logo construction: outline with anchor points, fill, wordmark
  scene(7.0, t => {
    const draw = eInOut(prog(t, 0.2, 2.2)), fillK = prog(t, 2.6, 3.0), wm = prog(t, 4.2, 4.9);
    const pts = [[60, 150], [112, 126], [112, 44], [200, 44], [288, 44], [288, 126], [340, 150], [200, 172], [60, 172]];
    const anchors = pts.map(([x, y], i) => draw > i / pts.length ? `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" fill="none" stroke="${C.lettuce}" stroke-width="3"/>` : '').join('');
    const handles = draw > 0.5 && fillK < 1 ? `<path d="M112 126L60 130M288 126L340 130M112 44L160 44M288 44L240 44" stroke="${C.lettuce}" stroke-width="2"/>` : '';
    const scale = lerp(1, 0.55, eInOut(wm)), ty = lerp(0, -170, eInOut(wm));
    const logoSvg = `<svg viewBox="0 0 400 260" width="1000" height="650" style="position:absolute;left:460px;top:180px;transform:translateY(${ty}px) scale(${scale}) rotate(${wm * -10}deg)">
      ${fillK < 1 ? `<path d="${markPath}" fill="none" stroke="${C.pep}" stroke-width="2.5" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - draw}"/>
      <path transform="translate(200 214) scale(1.7)" d="${stachePath}" fill="none" stroke="${C.pep}" stroke-width="1.5" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - prog(t, 1.2, 2.4)}"/>${anchors}${handles}` : ''}
      <g opacity="${fillK}">${mark(C.pep)}</g></svg>`;
    const grid = fillK < 1 ? `<div class="grid" style="opacity:${0.5 * (1 - fillK)}"></div>` : '';
    const word = wm > 0 ? `<div class="wm2" style="opacity:${wm};transform:translateY(${(1 - eOut(wm)) * 60}px)">${BRAND}</div>` : '';
    const lock = t > 5.6 ? mono('PLANT BURGERS · EST. 2026', 0, 900, 30, C.tomato, `opacity:${prog(t, 5.6, 6)};width:${W}px;text-align:center`) : '';
    return bg(C.white) + grid + logoSvg + word + lock + (t < 4 ? mono(`mark_v${Math.min(9, Math.floor(t * 2))}.svg`, 80, 980, 24, C.lettuce) : '');
  });

  // 5. More photo cuts with the white mascot
  scene(1.3, photoCut('street', 'city street / storefront', 'serve', 330, 1010, 0.8));
  scene(1.2, photoCut('hands', 'burger held in hands', 'wave', 960, 1040, 0.6));
  scene(1.4, photoCut('friends', 'friends at a table', 'bow', 1500, 990, 0.75));

  // 6. Mascot studio UI (like the 3D tool in the reference)
  scene(6.0, t => {
    const poses = ['stand', 'wave', 'serve', 'bow', 'tada'];
    const pi = Math.min(poses.length - 1, Math.floor(t / 1.2)), pose = poses[pi];
    const slider = (label, x, y, v) => `<div class="sl" style="left:${x}px;top:${y}px"><div class="sll">${label}</div><div class="slt"><div class="slk" style="left:${v * 100}%"></div></div></div>`;
    const sw = [C.tomato, C.mustard, C.lettuce, C.beet, C.radish].map((c, i) => `<div class="sw" style="left:${520 + i * 64}px;background:${c};${i === pi % 5 ? 'outline:4px solid ' + C.pep : ''}"></div>`).join('');
    const corners = [[540, 70], [1820, 70], [540, 700], [1820, 700]].map(([x, y]) => `<div class="plus" style="left:${x}px;top:${y}px">+</div>`).join('');
    return bg('#F3EFEA') +
      `<div class="panel" style="background:${C.pep}"></div>` +
      mono('BARNABY STUDIO<br>POSE LIBRARY v2.1<br><br>rig: butler_01<br>pose: ' + pose + '<br>frame: ' + String(Math.floor(t * 30)).padStart(4, '0'), 40, 40, 20, '#cfc7cf', 'line-height:1.6') +
      `<div style="position:absolute;left:0;top:0;width:480px;height:760px;overflow:hidden">${mascot({ t, x: 240, y: 620, s: 0.62, pose, rot: 0 })}</div>` +
      mono('barnaby', 330, 700, 32, '#fff', 'font-family:Brico;font-weight:700;letter-spacing:-1px') +
      `<div class="canvas"></div>` + corners +
      mascot({ t, x: 1180, y: 690, s: 1.0, pose, mono: false, style: `filter:saturate(${pi % 2 ? 1 : 1.15})` }) +
      `<div class="tools"></div>` + slider('HAT TILT', 540, 800, 0.3 + 0.3 * Math.sin(t * 1.3)) + slider('BOW DEPTH', 900, 800, 0.5 + 0.4 * Math.sin(t * 0.9 + 1)) +
      slider('MOUSTACHE', 1260, 800, 0.6 + 0.2 * Math.sin(t * 2)) + sw.replace(/class="sw" style="/g, 'class="sw" style="top:920px;') +
      `<div class="btn" style="background:${C.lettuce}">Export</div>` +
      poses.map((p, i) => `<div class="pp" style="left:${40 + i * 86}px;${i === pi ? 'background:' + C.mustard + ';color:' + C.pep : ''}">${p}</div>`).join('');
  });

  // 7. Hero tagline on Tomato, then huge cropped type around a white mascot
  scene(7.5, t => {
    let h = bg(C.tomato);
    if (t < 2.2) {
      h += typer(['Plants, at your ', { w: 'service', icon: 'cloche', color: '#fff' }, '.'], t, { size: 130, x: 0, y: 420, w: W, color: '#fff', cps: 18 });
    } else if (t < 5.2) {
      const k = t - 2.2, x = lerp(200, -1700, eInOut(clamp(k / 3)));
      h += `<div class="huge" style="left:${x}px;top:150px;color:#fff">at your service</div>` +
        mascot({ t, x: 960, y: 960, s: 1.15, pose: 'serve', style: 'filter:drop-shadow(0 20px 40px rgba(31,20,32,.35))' }) +
        mono('BARNABY / HERO', 60, 980, 22, '#fff') + mono('01 — TAGLINE', 1640, 980, 22, '#fff');
    } else {
      const k = t - 5.2;
      const guides = [['ascender', 150], ['x-height', 470], ['baseline', 905]];
      h += `<div class="huge" style="left:${120 - k * 20}px;top:60px;color:#fff;font-size:1100px">b</div>` +
        guides.map(([n, y], i) => `<div style="position:absolute;left:0;top:${y}px;width:${1060 * eOut(prog(k, i * 0.15, i * 0.15 + 0.6))}px;height:3px;background:${C.mustard}"></div>` +
          mono(n.toUpperCase(), 40, y - 34, 20, C.pep)).join('') +
        `<div style="position:absolute;left:1100px;top:140px;width:700px;height:780px;background:${C.beet};overflow:hidden;border-radius:6px">${mascot({ t, x: 350, y: 720, s: 1.0, pose: 'tada' })}</div>`;
    }
    return h;
  });

  // 8. Type specimen
  scene(4.6, t => {
    const a = t < 2.3;
    const txt = a ? 'ABCDEFGHIJKLM<br>NOPQRSTUVWXYZ<br>abcdefghijklm<br>nopqrstuvwxyz<br>0123456789 !?&amp;'
      : 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜ àáâãäåæçèéêëìíîïðñòóôõöø ŒœŠšŸŽž ƒ ß þ ¿¡ «»‹› “”‘’ †‡•… €£¥¢ #%‰ +−×÷=≠≈ &amp;@§¶©®™ ½¼¾ ¹²³ ():;,.!?';
    const c = a ? C.beet : C.lettuce, ink = a ? '#fff' : C.pep;
    return bg(c) + `<div class="spec" style="color:${ink};font-size:${a ? 150 : 92}px;line-height:${a ? 1.02 : 1.08};${a ? '' : 'text-align:left;letter-spacing:4px'}">${txt}</div>` +
      mono('BRICOLAGE GROTESQUE BOLD — DISPLAY', 60, 40, 22, ink) + mono('INSTRUMENT SANS — TEXT', 1480, 40, 22, ink);
  });

  // 9. Palette: layers stacked like a burger
  scene(4.4, t => {
    const pal = [['Bun', C.bun, C.pep], ['Mustard', C.mustard, C.pep], ['Lettuce', C.lettuce, C.pep], ['Tomato', C.tomato, '#fff'], ['Radish', C.radish, C.pep], ['Beet', C.beet, '#fff'], ['Peppercorn', C.pep, C.bun]];
    const hex = { Bun: '#FFF1DC', Mustard: '#FFC21A', Lettuce: '#5FCB3C', Tomato: '#FF4A2E', Radish: '#FF8FB8', Beet: '#C2185B', Peppercorn: '#1F1420' };
    const bw = W / pal.length;
    return bg(C.white) + pal.map(([n, c, ink], i) => {
      const k = eOut(prog(t, 0.15 + i * 0.16, 0.6 + i * 0.16));
      return `<div class="stripe" style="left:${i * bw}px;width:${bw + 1}px;background:${c};transform:translateY(${(1 - k) * 1100}px)">
        <div class="sn" style="color:${ink}">${n}</div><div class="sh" style="color:${ink}">${hex[n]}</div></div>`;
    }).join('') + (t > 2.6 ? `<div style="position:absolute;left:0;top:0;width:${W}px;height:${H}px;opacity:${prog(t, 2.6, 3.0)}">${mascot({ t, x: 960, y: 760, s: 0.9, pose: 'wave' })}</div>` : '');
  });

  // 10. Icon grid with a typed line
  scene(5.0, t => {
    const names = Object.keys(I);
    let cells = '';
    const cols = 12, rows = 4, cw = 140, ch = 120, x0 = (W - cols * cw) / 2, y0 = 440;
    const hi = Math.floor(t * 3) % (cols * rows);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c, on = i === hi || i === (hi * 7 + 11) % 48;
      const k = prog(t, 0.05 * (r + c) * 0.5, 0.05 * (r + c) * 0.5 + 0.3);
      cells += `<div class="cell" style="left:${x0 + c * cw}px;top:${y0 + r * ch}px;background:${on ? C.lettuce : '#fff'};opacity:${k}">${icon(names[(i * 7) % names.length], 64, on ? '#fff' : C.pep)}</div>`;
    }
    return bg(C.white) + typer(['Tipping our ', { w: 'hat', icon: 'hat', color: C.pep }, ' to plants,', { br: 1 }, 'stacked high with ', { w: 'tomato', icon: 'tomato', color: C.tomato }, ' and manners.'], t, { size: 72, x: 120, y: 90, w: 1700, align: 'left', cps: 20 }) + cells;
  });

  // 11. Packaging and merch, drawn in the brand system
  const box = (x, y, s, r, c1, c2) => `<svg viewBox="0 0 400 300" width="${400 * s}" height="${300 * s}" style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${r}deg);filter:drop-shadow(0 30px 30px rgba(31,20,32,.25))">
      <path d="M20 140L60 60H340L380 140Z" fill="${c2}"/><path d="M20 140H380L360 280H40Z" fill="${c1}"/>
      <path d="M20 140H380" stroke="${C.pep}" stroke-width="6"/>
      <g transform="translate(140 150) scale(.3)">${mark(C.pep, C.mustard)}</g>
      <text x="200" y="262" text-anchor="middle" font-family="Brico" font-weight="700" font-size="46" fill="${C.pep}">${BRAND}</text></svg>`;
  const cupSvg = (x, y, s, r, c) => `<svg viewBox="0 0 200 320" width="${200 * s}" height="${320 * s}" style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${r}deg);filter:drop-shadow(0 30px 30px rgba(31,20,32,.25))">
      <rect x="20" y="20" width="160" height="26" rx="10" fill="#fff"/><path d="M120 20l20-20" stroke="${C.pep}" stroke-width="10"/>
      <path d="M30 46H170L152 310H48Z" fill="${c}"/>
      <path d="M38 150H162L158 200H42Z" fill="${C.pep}"/><text x="100" y="186" text-anchor="middle" font-family="Brico" font-weight="700" font-size="32" fill="${C.bun}">${BRAND}</text>
      <g transform="translate(55 70) scale(.22)">${mark(C.pep, '#fff')}</g></svg>`;
  const bagSvg = (x, y, s, r) => `<svg viewBox="0 0 300 380" width="${300 * s}" height="${380 * s}" style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${r}deg);filter:drop-shadow(0 30px 30px rgba(31,20,32,.25))">
      <path d="M20 40H280V370H20Z" fill="${C.bun}"/><path d="M20 40l20-30h220l20 30" fill="#eadcc5"/>
      <rect x="20" y="300" width="260" height="70" fill="${C.tomato}"/>
      <g transform="translate(60 80) scale(.45)">${mark(C.pep, C.mustard)}</g>
      <text x="150" y="270" text-anchor="middle" font-family="Brico" font-weight="700" font-size="54" fill="${C.pep}">${BRAND}</text>
      <text x="150" y="345" text-anchor="middle" font-family="Insta" font-size="20" fill="#fff">PLANTS, AT YOUR SERVICE.</text></svg>`;
  scene(4.0, t => {
    const f = Math.sin(t * 1.4) * 6;
    return bg(C.mustard) + box(220, 380 + f, 1.5, -6, C.tomato, '#E03A21') + cupSvg(900, 230 - f, 1.55, 4, C.lettuce) + bagSvg(1300, 260 + f * 0.6, 1.45, 3) +
      mono('PACKAGING · CLAMSHELL / CUP / BAG', 60, 40, 22, C.pep) +
      `<div class="type" style="left:0;top:${940}px;width:${W}px;font-size:56px;color:${C.pep}">Made from peas, beets &amp; good manners.</div>`;
  });
  const tee = (x, y, s, c, ink) => `<svg viewBox="0 0 600 600" width="${600 * s}" height="${600 * s}" style="position:absolute;left:${x}px;top:${y}px;filter:drop-shadow(0 30px 40px rgba(31,20,32,.3))">
      <path d="M200 40C230 70 370 70 400 40L560 120 510 230 450 200V570H150V200L90 230 40 120Z" fill="${c}"/>
      <path d="M200 40C230 90 370 90 400 40" fill="none" stroke="rgba(0,0,0,.15)" stroke-width="10"/>
      <g transform="translate(225 190) scale(.38)">${mark(ink, C.mustard)}</g>
      <text x="300" y="400" text-anchor="middle" font-family="Brico" font-weight="700" font-size="58" fill="${ink}">Your burger</text>
      <text x="300" y="460" text-anchor="middle" font-family="Brico" font-weight="700" font-size="58" fill="${ink}">is ready, sir.</text></svg>`;
  scene(2.4, t => bg(C.radish) + tee(560 + Math.sin(t) * 10, 120, 1.4, C.pep, C.bun) +
    `<div style="position:absolute;left:1360px;top:640px;width:380px;height:300px;background:#fff;border-radius:10px;box-shadow:0 20px 40px rgba(0,0,0,.2);overflow:hidden">
      <div class="mono" style="position:absolute;left:20px;top:16px;font-size:16px;color:${C.pep}">MERCH · TEE / TOTE</div>
      ${typer(['Your ', { w: 'burger', icon: 'burger', color: C.tomato }, ' is ready, sir.'], t, { size: 34, x: 20, y: 120, w: 340, align: 'left', cps: 22 })}</div>`);
  scene(2.2, t => photo('wall', 'billboard / blank wall', 0, 0, W, H) +
    `<div style="position:absolute;left:560px;top:250px;width:800px;height:520px;background:${C.tomato};transform:scale(${1 + t * 0.01});box-shadow:0 14px 30px rgba(0,0,0,.3);overflow:hidden">
      ${mascot({ t, x: 600, y: 520, s: 0.82, pose: 'wave' })}<div class="type" style="left:40px;top:60px;width:440px;text-align:left;font-size:72px;color:#fff;line-height:.95">Ring the bell for seconds.</div></div>`);

  // 12. Sign-off
  scene(5.6, t => {
    let h = bg(C.white);
    if (t < 3.4) h += typer(['Dinner is ', { w: 'served', icon: 'cloche', color: C.tomato }, '. Kindly.'], t, { size: 96, x: 0, y: 480, w: W, cps: 18 });
    else {
      const k = eOut(prog(t, 3.4, 4.0));
      h += `<div style="position:absolute;left:0;top:0;width:${W}px;height:${H}px;opacity:${k};transform:scale(${0.94 + 0.06 * k})">
        <div class="wm2" style="top:330px">${BRAND}</div>
        <svg viewBox="0 0 400 260" width="330" height="214" style="position:absolute;left:300px;top:170px;transform:rotate(-14deg)">${mark(C.pep)}</svg>
        ${mono('PLANTS, AT YOUR SERVICE.', 0, 700, 34, C.tomato, `width:${W}px;text-align:center`)}</div>`;
      h += mono('placeholder brand · mockup only', 0, 1010, 18, '#9a8f99', `width:${W}px;text-align:center`);
    }
    return h;
  });

  // 13. Photo credits (CC BY and CC BY-SA photos must be credited)
  scene(3.2, t => {
    const list = Object.values(PHOTOS);
    const rows = list.map(p => `<div style="margin:6px 0">${escape(p.title || p.key)} — ${escape(p.author)} — ${escape(p.license)}</div>`).join('');
    return bg(C.pep) + mono('PHOTOS', 160, 150, 26, C.mustard) +
      `<div class="mono" style="left:160px;top:210px;font-size:24px;color:${C.bun};line-height:1.5;white-space:normal;width:1600px;opacity:${prog(t, 0, .4)}">${rows || 'Photo slots: no photos added yet.'}</div>` +
      mono('Photos via Wikimedia Commons. Barnaby is a placeholder brand; mockup only.', 160, 920, 22, '#9a8f99');
  });

  let total = 0; const starts = S.map(s => { const a = total; total += s.dur; return a; });
  function renderAt(t) {
    let i = 0; while (i < S.length - 1 && t >= starts[i + 1]) i++;
    document.getElementById('stage').innerHTML = S[i].fn(t - starts[i]);
  }
  window.Reel = { renderAt, duration: total, cuts: starts, setPhotos: p => { PHOTOS = p; } };
})();
