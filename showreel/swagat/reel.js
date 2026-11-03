// Swagat: brand identity showreel for a Jaipur Diwali gifting brand (placeholder name).
// Every frame is a pure function of time: Reel.renderAt(t) rebuilds the stage.
// Pacing and layout follow the reference identity reel (as in the Barnaby reel): typewriter lines
// where a word turns into an icon, a build-up open, logo construction with anchor points,
// photo cuts with a white brand figure on them, a tool UI, huge type, specimen, palette, icon grid,
// product mockups and a one-line sign-off. The art is Pichwai: Ram and Sita from the Mahagatha engine.
(function () {
  const W = 1920, H = 1080;
  const A = window.Art, C = A.C, IMG = A.IMG;
  const BRAND = 'swagat', BRAND_HI = 'स्वागत';

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

  // ---------- photos ----------
  let PHOTOS = {};
  function photo(key, label, x, y, w, h, extra = '') {
    const p = PHOTOS[key];
    if (p) return `<div class="ph" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}"><img src="photos/${p.file}"></div>`;
    return `<div class="ph slot" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}"><span>PHOTO SLOT · ${label}</span></div>`;
  }

  // ---------- painted world: a 1280x720 Pichwai panel placed on the stage ----------
  const world = (x, y, w, h, inner, extra = '', vb = '0 0 1280 720') =>
    `<svg class="wd" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}">${A.DEFS}${inner}</svg>`;
  const img = (k, x = 0, y = 0, w = 1280, h = 720, o = '') => `<image href="${IMG[k]}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none"${o}/>`;
  const WHITE = 'filter:brightness(0) invert(1) drop-shadow(0 12px 30px rgba(0,0,0,.35))';

  // ---------- typewriter ----------
  const TYPING = []; let sceneStart = 0;
  function typer(segs, t, o = {}) {
    const cps = o.cps || 16, hold = 0.35;
    let clock = 0, html = '', done = true;
    for (const sg of segs) {
      const s = typeof sg === 'string' ? { w: sg } : sg;
      if (s.br) { html += '<br>'; continue; }
      const dur = s.w.length / cps;
      const n = Math.floor(clamp((t - clock) / dur) * s.w.length);
      if (t < clock) { done = false; break; }
      if (s.icon || s.img) {
        const k = prog(t, clock + dur + hold, clock + dur + hold + 0.25);
        if (k > 0) html += `<span class="icw" style="transform:scale(${eBack(k)})">${s.img ? s.img : A.icon(s.icon, o.size * 0.95, s.color || C.kajal)}</span>`;
        else html += escape(s.w.slice(0, n));
        clock += dur + hold + 0.25;
      } else { html += escape(s.w.slice(0, n)); clock += dur; }
      if (t < clock) { done = false; break; }
    }
    const cur = (!done || Math.floor(t * 2.2) % 2 === 0) && !o.noCursor ? `<span class="cur" style="background:${o.color || C.kajal}"></span>` : '';
    return `<div class="type" style="font-size:${o.size}px;color:${o.color || C.kajal};left:${o.x}px;top:${o.y}px;width:${o.w || 1600}px;text-align:${o.align || 'center'};${o.style || ''}">${html}${cur}</div>`;
  }
  const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const mono = (txt, x, y, size = 30, color = C.kajal, extra = '') => `<div class="mono" style="left:${x}px;top:${y}px;font-size:${size}px;color:${color};${extra}">${txt}</div>`;
  const bg = c => `<div class="bg" style="background:${c}"></div>`;
  const ticks = (color, t) => mono('-----'.repeat(2).slice(0, 6 + (Math.floor(t * 6) % 5)), 40, 520, 22, color, 'letter-spacing:2px') +
    mono('------'.slice(0, 3 + (Math.floor(t * 5) % 4)) + '- -- -', 1720, 520, 22, color, 'letter-spacing:2px');
  const label = (n, txt, color = C.kajal) => mono(`${n} · ${txt}`, 60, 44, 22, color);

  // ---------- 3D packaging (CSS 3D boxes with painted faces) ----------
  const face = (w, h, tf, fill, shade = 0, inner = '') => `<div class="face" style="width:${w}px;height:${h}px;margin:${-h / 2}px 0 0 ${-w / 2}px;transform:${tf};${fill}">${inner}${shade ? `<div class="shade" style="background:rgba(20,10,4,${shade})"></div>` : ''}</div>`;
  const bgImg = (k, size = 'cover') => `background:url(${IMG[k]}) center/${size} no-repeat`;
  // a box centred at the origin: f = {front, back, left, right, top} css backgrounds (+ inner html)
  function cuboid(w, h, d, f) {
    const g = (k) => f[k] || f.side;
    return face(w, h, `translateZ(${d / 2}px)`, g('front'), 0, f.frontInner || '') +
      face(w, h, `rotateY(180deg) translateZ(${d / 2}px)`, g('back'), 0.3) +
      face(d, h, `rotateY(90deg) translateZ(${w / 2}px)`, g('right'), 0.28, f.sideInner || '') +
      face(d, h, `rotateY(-90deg) translateZ(${w / 2}px)`, g('left'), 0.28, f.sideInner || '') +
      face(w, d, `rotateX(90deg) translateZ(${h / 2}px)`, g('top'), 0, f.topInner || '') +
      face(w, d, `rotateX(-90deg) translateZ(${h / 2}px)`, g('bottom') || g('side'), 0.5);
  }
  function scene3d(x, y, rx, ry, inner, persp = 2600) {
    return `<div class="p3" style="left:${x}px;top:${y}px;perspective:${persp}px"><div class="r3" style="transform:rotateX(${rx}deg) rotateY(${ry}deg)">${inner}</div></div>`;
  }
  const at = (x, y, z, inner, extra = '') => `<div class="r3" style="transform:translate3d(${x}px,${y}px,${z}px) ${extra}">${inner}</div>`;
  const atT = (tf, inner) => `<div class="r3" style="transform:${tf}">${inner}</div>`;
  const ribbon = (w, h, vertical) => `<div style="position:absolute;${vertical ? `left:${w / 2 - 22}px;top:0;width:44px;height:${h}px` : `top:${h / 2 - 22}px;left:0;height:44px;width:${w}px`};background:linear-gradient(${vertical ? 90 : 180}deg,#a8741a,#f7d566 50%,#a8741a)"></div>`;

  // ---------- the brand mark ----------
  const markSvg = (size, ink, o = {}) => `<svg viewBox="40 20 340 360" width="${size}" height="${size * 360 / 340}" style="position:absolute;left:${o.x}px;top:${o.y}px;overflow:visible;${o.style || ''}">${A.mark(ink, o.flame || C.kesar, o)}</svg>`;

  // ---------- scenes ----------
  const S = [];
  const scene = (dur, fn, typing) => { S.push({ dur, fn, typing }); };

  // 1. Build-up open: the diya and its jharokha arch assemble, typed as a file name
  scene(6.0, t => {
    const bowl = bounce(prog(t, 0.5, 1.3)), petals = eBack(prog(t, 1.4, 1.9)), fl = prog(t, 2.0, 2.5), arch = eInOut(prog(t, 2.6, 3.9)), dots = prog(t, 4.0, 4.4), toran = bounce(prog(t, 4.3, 5.1));
    const names = ['d', 'diy', 'diya_', 'diya_01', 'diya_0', 'jhrk_2', 'jhrk_3', 'swgt_', 'swgt_v4', 'swgt_v4'];
    const nm = names[Math.min(names.length - 1, Math.floor(t * 1.7))];
    const pos = [[600, 560], [700, 300], [760, 250], [820, 220], [860, 200]][Math.min(4, Math.floor(t / 1.25))];
    const fk = 1 + 0.06 * Math.sin(t * 17) * fl;
    const svg = `<svg viewBox="40 20 340 360" width="640" height="678" style="position:absolute;left:640px;top:300px;overflow:visible">
      ${A.DEFS}
      ${fl > 0 ? `<circle cx="200" cy="200" r="${170 * fl}" fill="url(#swGlow)"/>` : ''}
      <path d="${A.ARCH}" fill="none" stroke="${C.kajal}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - arch}"/>
      <g transform="translate(0 ${-700 * (1 - bowl)})"><path d="${A.BOWL}" fill="${C.kajal}"/>
        ${[150, 200, 250].map((x, i) => `<circle cx="${x}" cy="${i === 1 ? 330 : 322}" r="${6 * clamp(dots * 3 - i)}" fill="${C.ivory}"/>`).join('')}</g>
      <g transform="translate(200 262) scale(${petals}) translate(-200 -262)"><path d="${A.PETALS}" fill="${C.kajal}"/></g>
      <g transform="translate(200 250) scale(${fl * fk} ${fl * fk * (1 + 0.05 * Math.sin(t * 23))}) translate(-200 -250)"><path d="${A.FLAME}" fill="${C.kesar}"/></g>
    </svg>`;
    const tor = toran > 0 ? `<svg viewBox="0 0 1920 200" width="1920" height="200" style="position:absolute;left:0;top:${-200 + 200 * toran}px">${A.marigoldString(-20, 1940, 30, 60, 46)}</svg>` : '';
    return bg(C.ivory) + ticks(C.kesar, t) + tor + mono(nm + `<span class="cur" style="background:${C.kajal}"></span>`, pos[0], pos[1], 52) + svg;
  }, [[0.3, 5.0, 1.7]]);

  // 2. Typewriter line: a word becomes an icon, another becomes a painted Ram-Sita chip
  scene(8.0, t => {
    const chip = `<span class="chip"><img src="${IMG.chip}"></span>`;
    return bg(C.ivory) + typer(['Painted by ', { w: 'hand', icon: 'brush', color: C.sindoor }, ' in Jaipur,', { br: 1 }, 'so every ', { w: 'home', icon: 'home', color: C.kesar }, ' glows', { br: 1 },
      'like ', { w: 'Ayodhya', img: chip }, ' tonight.'], t - 0.2, { size: 124, x: 160, y: 200, w: 1600, cps: 15 });
  }, [[0.2, 6.6, 15]]);

  // 3. Photo cuts with white Pichwai figures standing on them
  const photoCut = (key, lbl, figs) => t => photo(key, lbl, 0, 0, W, H, `transform:scale(${1.04 + t * 0.03})`) + world(0, 0, W, H, figs(t), WHITE);
  scene(1.2, photoCut('hawa', 'Hawa Mahal, Jaipur', t => A.pair(240, 690, 0.8, t)));
  scene(1.0, photoCut('diyas', 'lit diyas', t => A.fig('sita', 1080, 700, 0.85, { t, pose: 'offer', item: 'diya' }, true)));
  scene(1.2, photoCut('rangoli', 'rangoli', t => A.fig('beti', 200, 700, 0.95, { t, pose: 'wave' }) + A.fig('dadi', 330, 700, 0.75, { t, pose: 'bless' }, true)));

  // 4. Logo construction
  scene(7.0, t => {
    const draw = eInOut(prog(t, 0.2, 2.2)), fillK = prog(t, 2.6, 3.0), wm = prog(t, 4.0, 4.7);
    const pts = [[92, 292], [92, 196], [152, 104], [200, 40], [248, 104], [308, 196], [308, 292], [70, 296], [330, 296], [366, 282], [200, 358], [200, 150]];
    const anchors = pts.map(([x, y], i) => draw > i / pts.length ? `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" fill="${C.ivory}" stroke="${C.sindoor}" stroke-width="3"/>` : '').join('');
    const handles = draw > 0.5 && fillK < 1 ? `<path d="M92 196L92 150M92 196L120 118M308 196L280 118M200 40L176 60M200 40L224 60M200 150L226 186M200 150L174 186" stroke="${C.sindoor}" stroke-width="2"/>` +
      [[92, 150], [120, 118], [280, 118], [176, 60], [224, 60], [226, 186], [174, 186]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${C.sindoor}"/>`).join('') : '';
    const scale = lerp(1, 0.5, eInOut(wm)), ty = lerp(0, -200, eInOut(wm));
    const line = (d, k, sw = 3) => `<path d="${d}" fill="none" stroke="${C.kajal}" stroke-width="${sw}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - k}"/>`;
    const logoSvg = `<svg viewBox="40 20 340 360" width="760" height="805" style="position:absolute;left:580px;top:150px;overflow:visible;transform:translateY(${ty}px) scale(${scale})">
      ${fillK < 1 ? line(A.ARCH, draw) + line(A.BOWL, prog(t, 0.8, 2.2)) + line(A.FLAME, prog(t, 1.2, 2.4)) + line(A.PETALS, prog(t, 1.4, 2.4), 2) + anchors + handles : ''}
      <g opacity="${fillK}">${A.mark(C.kajal)}</g></svg>`;
    const grid = fillK < 1 ? `<div class="grid" style="opacity:${0.6 * (1 - fillK)}"></div>` : '';
    const word = wm > 0 ? `<div class="wm2" style="opacity:${wm};transform:translateY(${(1 - eOut(wm)) * 60}px)">${BRAND}</div>` +
      `<div class="hi" style="left:0;top:880px;width:${W}px;font-size:64px;color:${C.sindoor};opacity:${prog(t, 4.6, 5.2)}">${BRAND_HI}</div>` : '';
    const lock = t > 5.6 ? mono('HANDCRAFTED DIWALI GIFTS · JAIPUR · EST. 2026', 0, 990, 28, C.kajal, `opacity:${prog(t, 5.6, 6)};width:${W}px;text-align:center`) : '';
    return bg(C.ivory) + grid + logoSvg + word + lock + (t < 4 ? mono(`mark_v${Math.min(9, Math.floor(t * 2))}.svg`, 80, 980, 24, C.sindoor) : '');
  });

  // 5. More photo cuts
  scene(1.2, photoCut('sweets', 'Indian sweets / mithai', t => A.fig('papa', 1100, 700, 0.85, { t, pose: 'offer' }, true)));
  scene(1.1, photoCut('marigold', 'marigold garlands', t => A.fig('maa', 300, 700, 0.85, { t, pose: 'namaste' })));
  scene(1.3, photoCut('night', 'Diwali lights at night', t => A.fig('beta', 1160, 700, 1, { t, pose: 'point' }, true) + A.fig('beti', 1040, 700, 1, { t, pose: 'offer', item: 'diya' }, true)));

  // 6. Story studio UI: choosing the Ramayana chapter for each pack
  scene(7.4, t => {
    const ch = [['swayamvar', 'Swayamvar', 'sweet box lid'], ['vanvaas', 'Vanvaas', 'diya sleeve'], ['panchavati', 'Panchavati', 'gift card'], ['setu', 'Setu', 'carry bag'], ['home', 'Homecoming', 'hamper front']];
    const ci = Math.min(ch.length - 1, Math.floor(t / 1.35)), c = ch[ci], k = t - ci * 1.35;
    const slider = (lbl, x, y, v) => `<div class="sl" style="left:${x}px;top:${y}px"><div class="sll">${lbl}</div><div class="slt"><div class="slk" style="left:${v * 100}%"></div></div></div>`;
    const sw = A.PALETTE.slice(1, 8).map(([, , col], i) => `<div class="sw" style="left:${540 + i * 64}px;top:920px;background:${col};${i === ci % 7 ? 'outline:4px solid ' + C.kajal : ''}"></div>`).join('');
    const corners = [[540, 70], [1820, 70], [540, 730], [1820, 730]].map(([x, y]) => `<div class="plus" style="left:${x}px;top:${y}px">+</div>`).join('');
    const z = 1 + k * 0.015;
    const panelArt = c[0] === 'home' ? img('courtBack') + A.pair(640, 640, 1.05, t, {}) + Array.from({ length: 9 }, (_, i) => A.diyaSmall(150 + i * 122, 690, 1.1, t, i, clamp((k - 0.1) * 6 - i * 0.5))).join('') + img('border')
      : img(c[0]);
    return bg('#F3EBDD') + `<div class="panel" style="background:${C.indigo2}"></div>` +
      mono('SWAGAT STORY STUDIO<br>PICHWAI PANELS v3<br><br>chapter: ' + c[1].toLowerCase() + '<br>applies to: ' + c[2] + '<br>frame: ' + String(Math.floor(t * 30)).padStart(4, '0'), 40, 40, 20, '#c9c3dc', 'line-height:1.6') +
      `<img src="${IMG.medallion}" style="position:absolute;left:60px;top:300px;width:360px;height:360px;border-radius:6px">` +
      ch.map((p, i) => `<div class="pp" style="left:${40 + (i % 3) * 140}px;top:${720 + Math.floor(i / 3) * 52}px;${i === ci ? 'background:' + C.kesar + ';color:' + C.kajal : ''}">${p[1]}</div>`).join('') +
      `<div class="canvas" style="overflow:hidden">${world(0, 0, 1340, 680, panelArt, `transform:scale(${z})`, '0 0 1280 720')}</div>` + corners +
      `<div class="tools"></div>` + slider('GOLD LEAF', 540, 800, 0.4 + 0.3 * Math.sin(t * 1.3)) + slider('LOTUS DENSITY', 900, 800, 0.5 + 0.4 * Math.sin(t * 0.9 + 1)) +
      slider('LAMP GLOW', 1260, 800, 0.6 + 0.3 * Math.sin(t * 2)) + sw + `<div class="btn" style="background:${C.kesar}">Apply to pack</div>`;
  });

  // 7. Hero: tagline on night indigo, huge type behind Ram and Sita, a giant Devanagari letter with its guides
  scene(7.6, t => {
    let h = bg(C.indigo) + world(0, 0, W, H, A.stars(0, 0, 1280, 720, 120, 5), 'opacity:.8');
    if (t < 2.4) {
      h += typer(['Light the way ', { w: 'home', icon: 'diya', color: C.kesar }, '.'], t, { size: 140, x: 0, y: 420, w: W, color: C.ivory, cps: 18 });
    } else if (t < 5.2) {
      const k = t - 2.4, x = lerp(200, -2400, eInOut(clamp(k / 2.8)));
      h += `<div class="huge" style="left:${x}px;top:120px;color:${C.kesar}">light the way home</div>` +
        world(0, 0, W, H, `<circle cx="640" cy="420" r="320" fill="url(#swGlow)" opacity=".6"/>` + A.pair(640, 700, 1.1, t, { spose: 'offer' }), '') +
        mono('SWAGAT / HERO', 60, 980, 22, C.ivory) + mono('01 — TAGLINE', 1640, 980, 22, C.ivory);
    } else {
      const k = t - 5.2;
      const guides = [['shirorekha (headline)', 250], ['matra zone', 520], ['baseline', 900]];
      h += `<div class="hi" style="left:${80 - k * 20}px;top:120px;color:${C.ivory};font-size:900px;line-height:1">स</div>` +
        guides.map(([n, y], i) => `<div style="position:absolute;left:0;top:${y}px;width:${1060 * eOut(prog(k, i * 0.15, i * 0.15 + 0.6))}px;height:3px;background:${C.kesar}"></div>` +
          mono(n.toUpperCase(), 40, y - 34, 20, C.kesar)).join('') +
        `<div style="position:absolute;left:1100px;top:140px;width:700px;height:780px;background:${C.kamal};overflow:hidden;border-radius:6px">${world(0, 0, 700, 780, A.fig('sita', 330, 690, 1.35, { t, pose: 'offer', item: 'diya' }, true), '', '0 0 640 713')}</div>`;
    }
    return h;
  }, [[0, 2.0, 18]]);

  // 8. Type specimen: Latin display, then Devanagari
  scene(4.8, t => {
    const a = t < 2.4;
    const txt = a ? 'ABCDEFGHIJKLM<br>NOPQRSTUVWXYZ<br>abcdefghijklm<br>nopqrstuvwxyz<br>0123456789 ₹&amp;?!'
      : 'अ आ इ ई उ ऊ ए ऐ ओ औ<br>क ख ग घ च छ ज झ ट ठ<br>ड ढ त थ द ध न प फ ब<br>भ म य र ल व श स ह ॐ<br>शुभ दीपावली ०१२३४५';
    const c = a ? C.sindoor : C.kesar, ink = a ? C.ivory : C.kajal;
    return bg(c) + `<div class="spec" style="color:${ink};font-family:${a ? 'Rozha' : 'Rozha, Tiro'};font-size:${a ? 150 : 124}px;line-height:${a ? 1.0 : 1.12}">${txt}</div>` +
      mono(a ? 'ROZHA ONE — DISPLAY' : 'ROZHA ONE + TIRO DEVANAGARI — HINDI', 60, 40, 22, ink) + mono('INSTRUMENT SANS — TEXT', 1480, 40, 22, ink);
  });

  // 9. Palette: eight Pichwai pigments, then Ram and Sita step in front
  scene(4.8, t => {
    const bw = W / A.PALETTE.length;
    return bg(C.ivory) + A.PALETTE.map(([n, en, c, ink], i) => {
      const k = eOut(prog(t, 0.15 + i * 0.14, 0.6 + i * 0.14));
      return `<div class="stripe" style="left:${i * bw}px;width:${bw + 1}px;background:${c};transform:translateY(${(1 - k) * 1100}px)">
        <div class="sn" style="color:${ink}">${n}</div><div class="sh" style="color:${ink}">${en.toUpperCase()}<br>${c}</div></div>`;
    }).join('') + (t > 2.6 ? world(0, 0, W, H, A.pair(640, 560, 0.85, t, { rpose: 'namaste', spose: 'namaste', sitem: 'none' }), `opacity:${prog(t, 2.6, 3.0)};filter:drop-shadow(0 20px 30px rgba(0,0,0,.3))`) : '');
  });

  // 10. Icon grid
  scene(5.2, t => {
    const names = Object.keys(A.I);
    let cells = '';
    const cols = 12, rows = 4, cw = 140, ch = 120, x0 = (W - cols * cw) / 2, y0 = 440;
    const hi = Math.floor(t * 3) % (cols * rows);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c, on = i === hi || i === (hi * 7 + 11) % 48;
      const k = prog(t, 0.05 * (r + c) * 0.5, 0.05 * (r + c) * 0.5 + 0.3);
      cells += `<div class="cell" style="left:${x0 + c * cw}px;top:${y0 + r * ch}px;background:${on ? C.kesar : '#fff'};opacity:${k}">${A.icon(names[(i * 5 + r) % names.length], 64, on ? C.kajal : C.indigo)}</div>`;
    }
    return bg(C.ivory) + typer(['Diyas, ', { w: 'mithai', icon: 'laddoo', color: C.kesar }, ' and stories,', { br: 1 }, 'wrapped for the whole ', { w: 'family', icon: 'family', color: C.sindoor }, '.'], t, { size: 76, x: 120, y: 90, w: 1700, align: 'left', cps: 20 }) + cells;
  }, [[0, 3.4, 20]]);

  // 11. Product: decorative diyas
  scene(5.2, t => {
    const lit = i => eOut(prog(t, 0.6 + i * 0.5, 1.1 + i * 0.5));
    let d = '';
    [[300, 0], [640, 1], [980, 2]].forEach(([x, v], i) => { const f = Math.sin(t * 1.3 + i) * 6; d += A.diyaPainted(x, 470 + f, 1.25, v, t, lit(i)); });
    const refl = `<g transform="translate(0 1040) scale(1 -1)" opacity=".18">${[[300, 0], [640, 1], [980, 2]].map(([x, v]) => A.diyaPainted(x, 470, 1.25, v, t, 0)).join('')}</g>`;
    return bg(C.indigo) + world(0, 0, W, H, A.swirls(0, 0, 1280, 720, 40, '#263670', 13, { rmin: 10, rvar: 20 }) + refl + d) +
      label('01', 'DECORATIVE DIYAS — HAND-PAINTED TERRACOTTA, SET OF 6', C.ivory) +
      `<div class="type" style="left:0;top:880px;width:${W}px;font-size:84px;color:${C.ivory}">Lit by hand, in Jaipur.</div>`;
  });

  // 12. Product: the mithai box, lid lifts to show the sweets
  scene(5.8, t => {
    const ry = lerp(-38, -18, eInOut(prog(t, 0, 5.8))), lift = eInOut(prog(t, 1.8, 3.0)), w = 520, h = 150, d = 520, lh = 70;
    const box = cuboid(w, h, d, { side: bgImg('patIndigo'), top: bgImg('sweets'),
      frontInner: `<div class="pk" style="font-size:60px;color:${C.ivory};top:36px">${BRAND}</div>` });
    const lid = cuboid(w + 16, lh, d + 16, { side: bgImg('patRed'), top: bgImg('medallion'), frontInner: ribbon(w + 16, lh, true) });
    const lidT = `translate3d(0px,${-(h / 2 + lh / 2) - lift * 230}px,${-lift * 160}px) rotateX(${lift * 22}deg)`;
    return bg(C.kamal) + world(0, 0, W, H, A.swirls(0, 0, 1280, 720, 30, '#efbccb', 7, { rmin: 10, rvar: 20 })) +
      `<div class="shadow" style="left:${960 - 380}px;top:800px;width:760px;height:120px"></div>` +
      scene3d(960, 600, -24, ry, at(0, 0, 0, box) + atT(lidT, lid)) +
      label('02', 'MITHAI BOX — KAJU KATLI, MOTICHOOR LADDOO, PISTA BARFI') +
      `<div class="type" style="left:0;top:930px;width:${W}px;font-size:72px;color:${C.kajal}">Sweet, with a story on the lid.</div>`;
  });

  // 13. Product: the Ayodhya hamper (corporate edition)
  scene(6.2, t => {
    const ry = lerp(24, 8, eInOut(prog(t, 0, 6.2))), lift = eInOut(prog(t, 2.2, 3.4)), w = 900, h = 420, d = 560, lh = 80;
    const box = cuboid(w, h, d, { side: bgImg('patIndigo'), front: bgImg('homecoming'), top: bgImg('hamperTop') });
    const lid = cuboid(w + 20, lh, d + 20, { side: `background:${C.sindoor}`, top: bgImg('patRed'),
      topInner: `<img src="${IMG.medallion}" style="position:absolute;left:${(w + 20) / 2 - 220}px;top:${(d + 20) / 2 - 220}px;width:440px;height:440px">` + ribbon(w + 20, d + 20, true) + ribbon(w + 20, d + 20, false),
      frontInner: ribbon(w + 20, lh, true) + `<div class="pk" style="font-size:40px;color:${C.ivory};top:14px;left:60px;text-align:left">${BRAND}</div>` });
    const lidT = `translate3d(0px,${-(h / 2 + lh / 2) - lift * 150}px,${-lift * 380}px) rotateX(${lift * -12}deg)`;
    return bg(C.kesar) + world(0, 0, W, H, A.swirls(0, 0, 1280, 720, 30, '#f4b440', 9, { rmin: 10, rvar: 20 })) +
      `<div class="shadow" style="left:${960 - 560}px;top:850px;width:1120px;height:140px"></div>` +
      scene3d(960, 620, -20, ry, `<div class="r3" style="transform:scale(.82)">` + at(0, 0, 0, box) + atT(lidT, lid) + '</div>') +
      label('03', 'THE AYODHYA HAMPER — CORPORATE EDITION') +
      `<div class="type" style="left:0;top:950px;width:${W}px;font-size:72px;color:${C.kajal}">One hamper. The whole family.</div>`;
  });

  // 14. Product: carry bag and co-branded greeting card
  const bagSvg = (x, y, s, r) => `<svg viewBox="0 0 400 520" width="${400 * s}" height="${520 * s}" style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${r}deg);filter:drop-shadow(0 30px 30px rgba(42,22,12,.3))">
      <path d="M120 90V60a80 70 0 0 1 160 0v30" fill="none" stroke="${C.gold}" stroke-width="12"/>
      <rect x="20" y="80" width="360" height="430" fill="${C.indigo}"/><image href="${IMG.patIndigo}" x="20" y="80" width="360" height="430" preserveAspectRatio="xMidYMid slice"/>
      <clipPath id="bagArch"><path d="M70 420V230C70 180 110 150 140 140C140 116 170 96 200 80C230 96 260 116 260 140C290 150 330 180 330 230V420Z"/></clipPath>
      <image href="${IMG.medallion}" x="40" y="70" width="320" height="360" preserveAspectRatio="xMidYMid slice" clip-path="url(#bagArch)"/>
      <path d="M70 420V230C70 180 110 150 140 140C140 116 170 96 200 80C230 96 260 116 260 140C290 150 330 180 330 230V420Z" fill="none" stroke="${C.gold}" stroke-width="6"/>
      <text x="200" y="476" text-anchor="middle" font-family="Rozha" font-size="46" fill="${C.ivory}">${BRAND}</text></svg>`;
  scene(4.0, t => {
    const open = eInOut(prog(t, 0.6, 1.6)), f = Math.sin(t * 1.4) * 6;
    const card = `<div class="p3" style="left:1330px;top:520px;perspective:2200px"><div class="r3" style="transform:rotateX(14deg) rotateY(-14deg)">
        <div class="face" style="width:440px;height:600px;margin:-300px 0 0 0;background:${C.ivory};border:10px solid ${C.gold}">
          <div class="pk" style="top:90px;font-size:52px;color:${C.sindoor};line-height:1.05">From our family<br>to yours.</div>
          <div class="hi" style="left:0;top:250px;width:420px;font-size:46px;color:${C.indigo}">शुभ दीपावली</div>
          <div class="mono" style="left:0;top:350px;width:420px;text-align:center;font-size:18px;color:${C.kajal}">WITH WARM WISHES FROM</div>
          <div class="mono" style="left:110px;top:390px;width:200px;height:90px;border:2px dashed ${C.kajal};display:flex;align-items:center;justify-content:center;font-size:18px;color:${C.kajal}">YOUR LOGO</div></div>
        <div class="r3" style="transform-origin:0 0;transform:translateZ(1px) rotateY(${-178 * open}deg)">
          <div class="face" style="width:440px;height:600px;margin:-300px 0 0 0;background:url(${IMG.medallion}) center/cover;border:10px solid ${C.gold};backface-visibility:hidden"></div>
          <div class="face" style="width:440px;height:600px;margin:-300px 0 0 0;transform:rotateY(180deg) translateX(-440px);transform-origin:0 50%;background:${C.kamal};border:10px solid ${C.gold};backface-visibility:hidden"><img src="${IMG.chip}" style="position:absolute;left:60px;top:180px;width:300px;opacity:.9"></div></div>
      </div></div>`;
    return bg(C.ivory) + world(0, 0, W, H, A.swirls(0, 0, 1280, 720, 30, '#f1e4c4', 3, { rmin: 10, rvar: 20 })) + bagSvg(300, 170 + f, 1.42, -3) + card +
      label('04', 'CARRY BAG & GREETING CARD — CO-BRANDED FOR YOUR TEAM');
  });

  // 15. Poster on a real wall
  scene(2.4, t => photo('wall', 'Jaipur wall / bazaar', 0, 0, W, H, `transform:scale(${1.02 + t * 0.01})`) +
    `<div style="position:absolute;left:600px;top:200px;width:720px;height:620px;background:${C.indigo};box-shadow:0 14px 30px rgba(0,0,0,.35);overflow:hidden;border:10px solid ${C.gold}">
      <img src="${IMG.homecoming}" style="position:absolute;left:0;top:0;width:700px;height:394px;object-fit:cover">
      <div class="type" style="left:30px;top:410px;width:640px;font-size:64px;color:${C.ivory};line-height:1">Every home is Ayodhya tonight.</div>
      ${markSvg(56, C.ivory, { x: 610, y: 525, dot: C.indigo })}</div>`);

  // 16. The feeling: a Jaipur rooftop on Diwali night, a family lighting diyas as Ram and Sita fly home on the Pushpak
  scene(8.6, t => {
    const lit = i => clamp(t * 1.6 - i * 0.35);
    let w = img('terrace');
    const fw = [[2.2, 300, 160, C.kesar], [3.0, 980, 120, C.kamal], [3.6, 640, 90, C.pista], [4.6, 200, 110, C.ivory], [5.2, 1080, 170, C.kesar], [6.0, 520, 140, C.kamal], [6.8, 860, 80, C.pista], [7.4, 360, 120, C.kesar]];
    fw.forEach(([s, x, y, c], i) => { w += A.firework(x, y, 110, (t - s) / 1.6, c, i + 1); });
    // the Pushpak crosses the sky from right to left
    const pk = prog(t, 0.6, 7.6), px = lerp(1500, -260, pk), py = 230 + Math.sin(pk * Math.PI * 2) * 14;
    w += `<g opacity="${clamp(Math.min(pk * 8, (1 - pk) * 8))}">` + A.cloud(px - 220, py + 40, 140) + A.cloud(px + 80, py + 46, 140) +
      A.pair(px, py, 0.36, t, { rpose: 'bless', spose: 'namaste', sitem: 'none' }) +
      A.pushpak(px, py + 10, 0.42) + '</g>';
    // diyas along the parapet
    for (let i = 0; i < 16; i++) w += A.diyaSmall(40 + i * 80, 496, 0.9, t, i, lit(i));
    // the family
    w += A.fig('dadi', 200, 690, 0.95, { t, pose: 'bless' });
    w += A.fig('papa', 380, 690, 0.95, { t: t + 1, pose: 'offer', item: 'diya' });
    w += A.fig('beta', 520, 690, 1.0, { t: t + 2, pose: 'point' });
    w += A.fig('beti', 820, 690, 1.0, { t: t + 3, pose: 'offer', item: 'diya' }, true);
    w += A.fig('maa', 980, 690, 0.95, { t: t + 4, pose: 'namaste' }, true);
    // the open hamper on the floor
    w += `<g transform="translate(560 600)"><rect x="0" y="0" width="160" height="90" fill="${C.indigo}" stroke="${A.LINE}" stroke-width="2"/><image href="${IMG.homecoming}" x="6" y="6" width="148" height="78" preserveAspectRatio="xMidYMid slice"/>
      <rect x="-4" y="-16" width="168" height="18" fill="${C.sindoor}" stroke="${A.LINE}" stroke-width="2"/>${A.diyaSmall(40, -22, 0.8, t, 3, 1)}${A.diyaSmall(110, -22, 0.8, t, 5, 1)}</g>`;
    w += img('grain', 0, 0, 1280, 720, ' opacity=".5"') + img('border');
    const cam = 1.08 - 0.08 * eInOut(prog(t, 0, 8.6));
    return bg(C.indigo2) + world(0, 0, W, H, w, `transform:scale(${cam});transform-origin:50% 60%`) +
      (t > 5.4 ? `<div class="type" style="left:0;top:60px;width:${W}px;font-size:86px;color:${C.ivory};opacity:${prog(t, 5.4, 6)};text-shadow:0 4px 20px rgba(0,0,0,.5)">Diwali is better together.</div>` : '') +
      (t < 5 ? label('05', 'THE FEELING — FESTIVAL WITH FAMILY', C.ivory).replace('top:44px', 'top:56px;left:80px') : '');
  });

  // 17. Sign-off
  scene(5.8, t => {
    let h = bg(C.ivory);
    if (t < 3.4) h += typer(['Make this Diwali ', { w: 'memorable', icon: 'sparkle', color: C.kesar }, '.'], t, { size: 104, x: 0, y: 470, w: W, cps: 18 });
    else {
      const k = eOut(prog(t, 3.4, 4.0));
      h += `<div style="position:absolute;left:0;top:0;width:${W}px;height:${H}px;opacity:${k};transform:scale(${0.94 + 0.06 * k})">
        ${markSvg(250, C.kajal, { x: 835, y: 110 })}
        <div class="wm2" style="top:380px">${BRAND}</div>
        <div class="hi" style="left:0;top:690px;width:${W}px;font-size:56px;color:${C.sindoor}">${BRAND_HI}</div>
        ${mono('LIGHT THE WAY HOME.', 0, 800, 34, C.kajal, `width:${W}px;text-align:center`)}
        ${mono('Handcrafted Diwali gifts · Jaipur', 0, 856, 24, C.sindoor, `width:${W}px;text-align:center`)}</div>`;
      h += mono('placeholder brand · mockup only', 0, 1010, 18, '#9a8a7a', `width:${W}px;text-align:center`);
    }
    return h;
  }, [[0, 1.9, 18]]);

  // 18. Credits
  scene(3.6, t => {
    const list = Object.values(PHOTOS);
    const rows = list.map(p => `<div style="margin:6px 0">${escape(p.title || p.key)} — ${escape(p.author)} — ${escape(p.license)}</div>`).join('');
    return bg(C.indigo2) + mono('PHOTOS', 160, 130, 26, C.kesar) +
      `<div class="mono" style="left:160px;top:190px;font-size:22px;color:${C.ivory};line-height:1.45;white-space:normal;width:1600px;opacity:${prog(t, 0, .4)}">${rows || 'Photo slots: no photos added yet.'}</div>` +
      mono('Pichwai figures and sets: Mahagatha engine (this project). Fonts: Rozha One, Tiro Devanagari, Instrument Sans, DM Mono (SIL OFL).', 160, 890, 20, '#b8b0d0') +
      mono('Photos via Wikimedia Commons. Swagat is a placeholder brand; mockup only.', 160, 930, 20, '#b8b0d0');
  });

  let total = 0; const starts = S.map(s => { const a = total; total += s.dur; return a; });
  S.forEach((s, i) => (s.typing || []).forEach(([a, b, c]) => TYPING.push([starts[i] + a, starts[i] + b, c])));
  function renderAt(t) {
    let i = 0; while (i < S.length - 1 && t >= starts[i + 1]) i++;
    document.getElementById('stage').innerHTML = S[i].fn(t - starts[i]);
  }
  window.Reel = { renderAt, duration: total, cuts: starts, typing: TYPING, setPhotos: p => { PHOTOS = p; } };
})();
