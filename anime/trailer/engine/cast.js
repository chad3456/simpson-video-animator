// Original cast for "Beautiful Idiot", drawn in a cut-paper pop-art manner: thin ink line, flat paper skin,
// pink hatch shading on one side, halftone hair shading. Each draw call: (ctx, x, y, s, st) with (x, y) the head centre.
// st: { mouth 0..1, blink, expr, look:[dx,dy], tilt, pal } — expr: smile | neutral | wow | smirk | sad | serious | laugh | angry | swoon
(function () {
  const { P, dots, lines, hash, card } = Pop;
  const INK = '#1b1515';

  function stroke(ctx, w = 3) { ctx.lineWidth = w; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }

  function headPath(ctx, w, h, chin = 0.35) {
    ctx.beginPath();
    ctx.moveTo(-w, -12);
    ctx.bezierCurveTo(-w, -h * 1.12, w, -h * 1.12, w, -12);
    ctx.bezierCurveTo(w, h * 0.5, w * chin, h, 0, h);
    ctx.bezierCurveTo(-w * chin, h, -w, h * 0.5, -w, -12);
    ctx.closePath();
  }

  // skin with pink hatch shading on the right (light from the left)
  function skin(ctx, pal, w, h, chin) {
    headPath(ctx, w, h, chin); ctx.fillStyle = pal.skin; ctx.fill();
    ctx.save(); headPath(ctx, w, h, chin); ctx.clip();
    ctx.fillStyle = lines(ctx, pal.shade, 2.2, 6); ctx.beginPath(); ctx.ellipse(w * 0.95, 10, w * 0.42, h * 1.2, 0, 0, 7); ctx.fill();
    ctx.fillStyle = pal.shade; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(w * 1.12, 10, w * 0.3, h * 1.2, 0, 0, 7); ctx.fill();
    ctx.restore();
    headPath(ctx, w, h, chin); stroke(ctx, 3);
  }

  function ear(ctx, pal, x, y, s = 1) {
    ctx.beginPath(); ctx.ellipse(x, y, 11 * s, 18 * s, 0, 0, 7); ctx.fillStyle = pal.skin; ctx.fill(); stroke(ctx, 2.5);
  }

  // eyes. kind: 'round' (Haru), 'cat' (Nana), 'sly' (Ryuji, under glasses), 'plain'
  function eyes(ctx, o) {
    const { kind = 'round', x = 30, y = 4, r = 17, iris = '#4a2c1c', blink = false, look = [0, 0], expr = 'neutral', lid = 0 } = o;
    for (const sd of [-1, 1]) {
      const ex = sd * x;
      ctx.save(); ctx.translate(ex, y);
      if (expr === 'swoon') {           // heart eyes
        ctx.beginPath(); ctx.moveTo(0, r * 0.7); ctx.bezierCurveTo(-r * 1.6, -r * 0.3, -r * 0.7, -r * 1.5, 0, -r * 0.5); ctx.bezierCurveTo(r * 0.7, -r * 1.5, r * 1.6, -r * 0.3, 0, r * 0.7);
        ctx.fillStyle = P.hot; ctx.fill(); stroke(ctx, 2.5); ctx.restore(); continue;
      }
      if (expr === 'laugh' || blink) {
        ctx.beginPath();
        if (expr === 'laugh') ctx.arc(0, r * 0.4, r * 0.8, Math.PI * 1.15, Math.PI * 1.85);
        else { ctx.moveTo(-r, 2); ctx.quadraticCurveTo(0, r * 0.5, r, 2); }
        stroke(ctx, 4);
        if (kind === 'cat') { ctx.beginPath(); ctx.moveTo(sd * r, 2); ctx.lineTo(sd * (r + 10), -6); stroke(ctx, 4); }
        ctx.restore(); continue;
      }
      const ry = kind === 'cat' ? r * 0.78 : r * 1.05, rx = kind === 'cat' ? r * 1.15 : r;
      const wow = expr === 'wow' ? 1.18 : 1;
      // white
      ctx.beginPath(); ctx.ellipse(0, 0, rx * wow, ry * wow, 0, 0, 7); ctx.fillStyle = '#fffdf6'; ctx.fill();
      ctx.save(); ctx.clip();
      const ix = look[0] * rx * 0.35, iy = look[1] * ry * 0.3;
      ctx.beginPath(); ctx.arc(ix, iy, ry * 0.82 * (expr === 'wow' ? 0.8 : 1), 0, 7); ctx.fillStyle = iris; ctx.fill();
      ctx.fillStyle = dots(ctx, 'rgba(0,0,0,0.35)', 1.2, 4); ctx.fill();
      ctx.beginPath(); ctx.arc(ix, iy, ry * 0.42 * (expr === 'wow' ? 0.6 : 1), 0, 7); ctx.fillStyle = '#120c0c'; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ix - ry * 0.3, iy - ry * 0.32, ry * 0.24, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(ix + ry * 0.3, iy + ry * 0.28, ry * 0.1, 0, 7); ctx.fill();
      // heavy lid (smirk / serious / sad)
      const lidK = lid || (expr === 'smirk' ? 0.38 : expr === 'serious' ? 0.25 : expr === 'sad' ? 0.12 : 0);
      if (lidK) { ctx.fillStyle = o.lidCol || '#f3c9b4'; ctx.fillRect(-rx * 1.5, -ry * 1.5, rx * 3, ry * (0.5 + lidK * 2)); }
      ctx.restore();
      // upper lash line
      ctx.beginPath();
      const top = -ry * wow + (lid || (expr === 'smirk' ? 0.38 : expr === 'serious' ? 0.25 : expr === 'sad' ? 0.12 : 0)) * ry * 2;
      ctx.moveTo(-rx * 1.05 * wow, 2); ctx.quadraticCurveTo(0, top * 1.35 - 2, rx * 1.05 * wow, 2);
      stroke(ctx, kind === 'cat' ? 5.5 : 4.5);
      if (kind === 'cat') { // wing + lashes
        ctx.beginPath(); ctx.moveTo(sd * rx * 0.95, 0); ctx.quadraticCurveTo(sd * (rx + 8), -2, sd * (rx + 17), -11); stroke(ctx, 4.5);
        for (let k = 0; k < 3; k++) { ctx.beginPath(); const a = sd * (0.25 + k * 0.3); ctx.moveTo(sd * rx * (0.2 + k * 0.3), top * 0.95); ctx.lineTo(sd * rx * (0.32 + k * 0.33) + sd * 4, top * 0.95 - 8); stroke(ctx, 2); }
      }
      if (expr === 'sad') { ctx.beginPath(); ctx.moveTo(sd * rx * 0.5, ry * 0.9); ctx.quadraticCurveTo(sd * rx * 0.5 + 7, ry * 1.6, sd * rx * 0.5, ry * 1.8); ctx.quadraticCurveTo(sd * rx * 0.5 - 7, ry * 1.6, sd * rx * 0.5, ry * 0.9); ctx.fillStyle = '#9fd8ff'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = INK; ctx.stroke(); }
      // lower line
      ctx.beginPath(); ctx.moveTo(-rx * 0.7, ry * 0.85); ctx.quadraticCurveTo(0, ry * 1.1, rx * 0.7, ry * 0.85); ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(27,21,21,0.6)'; ctx.stroke();
      ctx.restore();
    }
  }

  function brows(ctx, expr, x = 30, y = -26, col = INK, w = 4) {
    for (const sd of [-1, 1]) {
      ctx.save(); ctx.translate(sd * x, y);
      let a = 0, lift = 0;
      if (expr === 'wow') lift = -8; if (expr === 'sad') a = 0.28 * sd; if (expr === 'angry') a = -0.32 * sd;
      if (expr === 'smirk') { a = sd < 0 ? 0.0 : -0.18; lift = sd < 0 ? 2 : -6; }
      if (expr === 'serious') a = -0.12 * sd;
      ctx.translate(0, lift); ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(-16, 3); ctx.quadraticCurveTo(0, -6, 16, 2); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke();
      ctx.restore();
    }
  }

  function mouth(ctx, o) {
    const { y = 50, m = 0, expr = 'neutral', lip = null, w = 20 } = o;
    ctx.save(); ctx.translate(0, y);
    const open = Math.max(m, expr === 'wow' ? 0.55 : expr === 'laugh' ? 0.7 : 0);
    if (open > 0.08) {
      const h = 4 + open * 20, ww = w * (expr === 'wow' ? 0.65 : 0.85);
      ctx.beginPath(); ctx.moveTo(-ww, 0);
      if (expr === 'smile' || expr === 'laugh' || expr === 'smirk') { ctx.quadraticCurveTo(0, 6, ww, -2); ctx.quadraticCurveTo(ww * 0.6, h + 6, 0, h + 6); ctx.quadraticCurveTo(-ww * 0.7, h + 4, -ww, 0); }
      else { ctx.quadraticCurveTo(0, -3, ww, 0); ctx.quadraticCurveTo(ww * 0.8, h, 0, h + 2); ctx.quadraticCurveTo(-ww * 0.8, h, -ww, 0); }
      ctx.closePath(); ctx.fillStyle = '#5a1620'; ctx.fill();
      ctx.save(); ctx.clip(); ctx.fillStyle = '#ef7d86'; ctx.beginPath(); ctx.ellipse(0, h + 6, ww * 0.6, h * 0.45, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillRect(-ww, -4, ww * 2, 5); ctx.restore();
      if (lip) { ctx.strokeStyle = lip; ctx.lineWidth = 4; ctx.stroke(); }
      stroke(ctx, 2.2);
    } else {
      ctx.beginPath();
      if (expr === 'smile') { ctx.moveTo(-w, -3); ctx.quadraticCurveTo(0, 12, w, -3); }
      else if (expr === 'smirk') { ctx.moveTo(-w * 0.8, 2); ctx.quadraticCurveTo(w * 0.2, 6, w, -6); }
      else if (expr === 'sad') { ctx.moveTo(-w * 0.7, 5); ctx.quadraticCurveTo(0, -3, w * 0.7, 5); }
      else if (expr === 'angry') { ctx.moveTo(-w * 0.8, 4); ctx.quadraticCurveTo(0, -1, w * 0.8, 4); }
      else { ctx.moveTo(-w * 0.6, 1); ctx.quadraticCurveTo(0, 4, w * 0.6, 1); }
      if (lip) { ctx.lineWidth = 9; ctx.strokeStyle = lip; ctx.stroke(); }
      stroke(ctx, 3);
    }
    ctx.restore();
  }

  function blush(ctx, x = 44, y = 30, col = 'rgba(255,90,120,0.45)') {
    ctx.save(); ctx.fillStyle = dots(ctx, col, 2.4, 6); for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * x, y, 17, 9, 0, 0, 7); ctx.fill(); } ctx.restore();
  }

  function nose(ctx, y = 26) { ctx.beginPath(); ctx.moveTo(-3, y); ctx.quadraticCurveTo(3, y + 6, 6, y + 2); stroke(ctx, 2.4); }

  function shoulders(ctx, col, w = 175, top = 112, bottom = 380) {
    ctx.beginPath(); ctx.moveTo(-w, bottom); ctx.lineTo(-w + 8, top + 70); ctx.quadraticCurveTo(-w + 20, top + 6, -40, top); ctx.lineTo(40, top);
    ctx.quadraticCurveTo(w - 20, top + 6, w - 8, top + 70); ctx.lineTo(w, bottom); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); stroke(ctx, 3);
  }
  function neck(ctx, pal, w = 24) {
    ctx.beginPath(); ctx.moveTo(-w, 60); ctx.lineTo(-w + 2, 125); ctx.lineTo(w - 2, 125); ctx.lineTo(w, 60); ctx.closePath(); ctx.fillStyle = pal.skin; ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = lines(ctx, pal.shade, 2, 5); ctx.fillRect(-w, 60, w * 2, 30); ctx.restore(); stroke(ctx, 2.5);
  }

  function hairShade(ctx, col) { ctx.save(); ctx.clip(); ctx.fillStyle = dots(ctx, col, 2.6, 7); ctx.fillRect(0, -300, 300, 700); ctx.restore(); }

  const blinkAt = (t, seed) => ((t + seed * 1.37) % 3.9) < 0.11;

  // ================= HARU MISHIMA =================
  // 30, gentle and unbothered: messy cocoa hair with a single antenna curl, huge round eyes, olive cardigan with a mended
  // elbow patch over a white collar, a little sticking plaster on his cheek, and usually his pocket cactus, Lev.
  const HARU = { skin: '#fbe2cc', shade: '#ee9f93', hair: '#4a2f22', hairHi: '#7a5038', cardigan: '#7f9a3a', shirt: '#fffaf0', iris: '#5a3a22' };
  function haru(ctx, x, y, s, st = {}) {
    const pal = Object.assign({}, HARU, st.pal || {});
    const expr = st.expr || 'smile', t = st.t || 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(st.tilt || 0);
    // back hair
    ctx.beginPath(); ctx.ellipse(0, -40, 98, 88, 0, Math.PI * 0.9, Math.PI * 2.1); ctx.fillStyle = pal.hair; ctx.fill(); stroke(ctx, 3);
    if (!st.noBody) {
      // body
      shoulders(ctx, pal.cardigan, 178, 108);
      ctx.save(); ctx.beginPath(); ctx.moveTo(-178, 380); ctx.lineTo(-170, 178); ctx.lineTo(-90, 120); ctx.lineTo(90, 120); ctx.lineTo(170, 178); ctx.lineTo(178, 380); ctx.closePath(); ctx.clip();
      ctx.fillStyle = dots(ctx, 'rgba(30,40,10,0.35)', 2, 7); ctx.fillRect(40, 100, 200, 300);
      // knit ribs
      ctx.strokeStyle = 'rgba(30,40,10,0.25)'; ctx.lineWidth = 2; for (let i = -160; i < 170; i += 14) { ctx.beginPath(); ctx.moveTo(i, 200); ctx.lineTo(i + 4, 380); ctx.stroke(); }
      ctx.restore();
      // shirt V
      ctx.beginPath(); ctx.moveTo(-42, 108); ctx.lineTo(0, 210); ctx.lineTo(42, 108); ctx.closePath(); ctx.fillStyle = pal.shirt; ctx.fill(); stroke(ctx, 3);
      // collar points
      for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 6, 124); ctx.lineTo(sd * 40, 112); ctx.lineTo(sd * 30, 148); ctx.closePath(); ctx.fillStyle = pal.shirt; ctx.fill(); stroke(ctx, 2.5); }
      // cardigan edges + buttons
      for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 44, 108); ctx.lineTo(sd * 4, 212); ctx.lineTo(sd * 4, 380); stroke(ctx, 3); }
      ctx.fillStyle = '#c99a4b'; for (const yy of [240, 290, 340]) { ctx.beginPath(); ctx.arc(-14, yy, 7, 0, 7); ctx.fill(); stroke(ctx, 2); }
      // elbow patch (mended)
      ctx.save(); ctx.translate(-150, 300); ctx.rotate(-0.2); ctx.fillStyle = '#d9a441'; ctx.fillRect(-22, -30, 44, 60); stroke(ctx, 2);
      ctx.setLineDash([5, 5]); ctx.strokeRect(-17, -25, 34, 50); ctx.setLineDash([]); ctx.restore();
      if (st.badge) { // the IDIOT button he wears with pride
        ctx.save(); ctx.translate(95, 250); ctx.rotate(0.15); ctx.scale(st.badge, st.badge);
        ctx.beginPath(); ctx.arc(0, 0, 46, 0, 7); ctx.fillStyle = P.yellow; ctx.fill(); stroke(ctx, 4);
        ctx.beginPath(); ctx.arc(0, 0, 38, 0, 7); ctx.strokeStyle = P.red; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = P.red; ctx.font = '30px Bangers'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('IDIOT', 0, 2);
        ctx.restore();
      }
      neck(ctx, pal, 24);
    }
    ear(ctx, pal, -76, 8); ear(ctx, pal, 76, 8);
    skin(ctx, pal, 78, 92, 0.42);
    eyes(ctx, { kind: 'round', x: 31, y: 8, r: 19, iris: pal.iris, blink: st.blink ?? blinkAt(t, 1), look: st.look || [0, 0], expr, lidCol: pal.skin });
    brows(ctx, expr, 31, -24, pal.hair, 4.5);
    nose(ctx, 30);
    blush(ctx, 48, 40, expr === 'swoon' ? 'rgba(255,40,90,0.8)' : 'rgba(255,90,120,0.45)');
    mouth(ctx, { y: 56, m: st.mouth || 0, expr, w: 18 });
    // sticking plaster
    ctx.save(); ctx.translate(-50, 52); ctx.rotate(-0.5); ctx.fillStyle = '#f2c48d'; ctx.fillRect(-15, -6, 30, 12); stroke(ctx, 1.8);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (const dx of [-6, 0, 6]) { ctx.beginPath(); ctx.arc(dx, 0, 1.2, 0, 7); ctx.fill(); } ctx.restore();
    // front hair: messy fringe
    ctx.beginPath();
    ctx.moveTo(-88, 0);
    ctx.quadraticCurveTo(-96, -96, -10, -112); ctx.quadraticCurveTo(80, -118, 92, -20);
    const tips = [[78, -2], [60, -40], [44, -10], [26, -52], [10, -18], [-12, -55], [-28, -20], [-46, -50], [-62, -12], [-78, -40], [-86, 4]];
    for (const [a, b] of tips) ctx.lineTo(a, b);
    ctx.closePath(); ctx.fillStyle = pal.hair; ctx.fill(); hairShade(ctx, 'rgba(0,0,0,0.35)'); stroke(ctx, 3);
    ctx.strokeStyle = pal.hairHi; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-40, -95); ctx.quadraticCurveTo(-20, -104, 10, -100); ctx.stroke();
    // antenna curl
    const sway = Math.sin(t * 5) * 0.12 + (st.curl || 0);
    ctx.save(); ctx.translate(-4, -108); ctx.rotate(sway);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-8, -40, 30, -60, 34, -36); ctx.bezierCurveTo(36, -22, 18, -22, 20, -34);
    ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = pal.hair; ctx.stroke(); ctx.restore();
    if (st.sweat) { ctx.fillStyle = '#9fd8ff'; ctx.beginPath(); ctx.moveTo(84, -40); ctx.quadraticCurveTo(96, -18, 84, -12); ctx.quadraticCurveTo(72, -18, 84, -40); ctx.fill(); stroke(ctx, 2); }
    ctx.restore();
  }

  // ================= NANA KUROSAKI =================
  // 25, heiress of a hotel family: long platinum hair dipped hot pink, blunt fringe, heart sunglasses parked on her head,
  // winged liner, violet eyes, a beauty mark, gold hoops, pearl choker and a cropped red leather jacket.
  const NANA = { skin: '#fde3d4', shade: '#f19aa6', hair: '#f6e4a0', hairSh: '#e0b85c', tip: '#ff3e8f', jacket: '#d9262c', top: '#fffaf0', iris: '#7a4fd8', lip: '#e0262f' };
  function nana(ctx, x, y, s, st = {}) {
    const pal = Object.assign({}, NANA, st.pal || {});
    const expr = st.expr || 'smirk', t = st.t || 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(st.tilt || 0);
    // long back hair with pink tips (gradient)
    const g = ctx.createLinearGradient(0, -100, 0, 300); g.addColorStop(0, pal.hair); g.addColorStop(0.62, pal.hair); g.addColorStop(0.8, pal.tip); g.addColorStop(1, pal.tip);
    ctx.beginPath(); ctx.moveTo(-96, -40); ctx.bezierCurveTo(-120, 80, -140, 200, -150 + Math.sin(t * 2) * 4, 300); ctx.lineTo(150 + Math.sin(t * 2 + 1) * 4, 300); ctx.bezierCurveTo(140, 200, 120, 80, 96, -40);
    ctx.bezierCurveTo(96, -140, -96, -140, -96, -40); ctx.closePath(); ctx.fillStyle = g; ctx.fill(); stroke(ctx, 3);
    if (!st.noBody) {
      shoulders(ctx, pal.top, 165, 112);
      // jacket
      for (const sd of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(sd * 165, 380); ctx.lineTo(sd * 158, 180); ctx.quadraticCurveTo(sd * 150, 122, sd * 64, 112); ctx.lineTo(sd * 70, 160); ctx.lineTo(sd * 46, 210); ctx.lineTo(sd * 70, 380); ctx.closePath();
        ctx.fillStyle = pal.jacket; ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = dots(ctx, 'rgba(60,0,0,0.35)', 2, 7); if (sd > 0) ctx.fillRect(60, 100, 120, 300); ctx.restore(); stroke(ctx, 3);
        // lapel
        ctx.beginPath(); ctx.moveTo(sd * 64, 112); ctx.lineTo(sd * 96, 150); ctx.lineTo(sd * 70, 160); ctx.closePath(); ctx.fillStyle = '#b01a20'; ctx.fill(); stroke(ctx, 2.5);
        // zip shine
        ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sd * 130, 200); ctx.lineTo(sd * 128, 260); ctx.stroke();
      }
      neck(ctx, pal, 21);
      // pearl choker
      for (let i = -5; i <= 5; i++) { ctx.beginPath(); ctx.arc(i * 4.2, 100 + Math.abs(i) * -0.6, 4.2, 0, 7); ctx.fillStyle = '#fffaf2'; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = INK; ctx.stroke(); }
    }
    // hoops
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * 74, 52, 17, 0, 7); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = P.gold; ctx.stroke(); }
    skin(ctx, pal, 72, 92, 0.3);
    eyes(ctx, { kind: 'cat', x: 30, y: 8, r: 18, iris: pal.iris, blink: st.blink ?? blinkAt(t, 2), look: st.look || [0, 0], expr, lidCol: pal.skin });
    brows(ctx, expr, 31, -24, '#8a6a3a', 3.5);
    nose(ctx, 30);
    if (expr !== 'neutral' && expr !== 'serious') blush(ctx, 46, 38, 'rgba(255,70,110,0.4)');
    // beauty mark
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(48, 30, 2.6, 0, 7); ctx.fill();
    mouth(ctx, { y: 58, m: st.mouth || 0, expr, lip: pal.lip, w: 17 });
    // fringe: blunt with side locks
    ctx.beginPath(); ctx.moveTo(-86, 70); ctx.quadraticCurveTo(-96, -20, -78, -70); ctx.quadraticCurveTo(-30, -128, 30, -120); ctx.quadraticCurveTo(90, -105, 86, -40); ctx.quadraticCurveTo(90, 20, 84, 70);
    ctx.lineTo(70, 70); ctx.quadraticCurveTo(74, 0, 66, -30); ctx.lineTo(-64, -30); ctx.quadraticCurveTo(-74, 0, -70, 70); ctx.closePath();
    ctx.fillStyle = pal.hair; ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = dots(ctx, pal.hairSh, 2.6, 7); ctx.fillRect(10, -140, 120, 240); ctx.restore(); stroke(ctx, 3);
    ctx.strokeStyle = 'rgba(27,21,21,0.55)'; ctx.lineWidth = 2; for (const xx of [-40, -14, 14, 40]) { ctx.beginPath(); ctx.moveTo(xx * 0.7, -100); ctx.lineTo(xx, -32); ctx.stroke(); }
    // heart sunglasses parked on her head (or worn)
    if (st.glasses !== false) {
      const worn = st.glasses === 'on'; ctx.save(); ctx.translate(0, worn ? 6 : -98); ctx.rotate(worn ? 0 : -0.06);
      for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * 32, 0); ctx.scale(0.62, 0.62);
        ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -10, -30, -55, 0, -25); ctx.bezierCurveTo(30, -55, 60, -10, 0, 30); ctx.closePath();
        ctx.fillStyle = worn ? '#ff4f9a' : 'rgba(255,79,154,0.9)'; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = '#c4122f'; ctx.stroke(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(-18, -18, 8, 14); ctx.restore(); }
      ctx.beginPath(); ctx.moveTo(-8, -6); ctx.quadraticCurveTo(0, -12, 8, -6); ctx.lineWidth = 5; ctx.strokeStyle = '#c4122f'; ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  // ================= RYUJI GOZEN =================
  // "crypto king": slicked silver hair, black shades, gold chain and a gold tooth, white suit over a leopard shirt.
  function ryuji(ctx, x, y, s, st = {}) {
    const pal = Object.assign({ skin: '#f3d0b0', shade: '#d98a7a', hair: '#d8dde3', suit: '#fbf8f0' }, st.pal || {});
    const expr = st.expr || 'smirk';
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    shoulders(ctx, pal.suit, 190, 112);
    ctx.save(); ctx.beginPath(); ctx.moveTo(-50, 112); ctx.lineTo(0, 260); ctx.lineTo(50, 112); ctx.closePath(); ctx.fillStyle = '#f2b33d'; ctx.fill(); ctx.clip();
    const r = Pop.rng(5); ctx.fillStyle = INK; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.ellipse(-50 + r() * 100, 110 + r() * 150, 5, 3.5, r() * 3, 0, 7); ctx.fill(); }
    ctx.restore(); ctx.beginPath(); ctx.moveTo(-50, 112); ctx.lineTo(0, 260); ctx.lineTo(50, 112); stroke(ctx, 3);
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 50, 112); ctx.lineTo(sd * 90, 170); ctx.lineTo(sd * 30, 210); stroke(ctx, 3); }
    neck(ctx, pal, 28);
    // gold chain
    ctx.beginPath(); ctx.moveTo(-34, 110); ctx.quadraticCurveTo(0, 190, 34, 110); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = P.gold; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 152, 13, 0, 7); ctx.fillStyle = P.gold; ctx.fill(); stroke(ctx, 2.5);
    ctx.fillStyle = INK; ctx.font = '16px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('¥', 0, 153);
    ear(ctx, pal, -78, 8); ear(ctx, pal, 78, 8);
    skin(ctx, pal, 80, 94, 0.55);
    // shades
    ctx.beginPath(); ctx.moveTo(-74, -6); ctx.lineTo(74, -6); ctx.lineTo(70, 18); ctx.quadraticCurveTo(40, 34, 8, 16); ctx.lineTo(-8, 16); ctx.quadraticCurveTo(-40, 34, -70, 18); ctx.closePath();
    ctx.fillStyle = '#101018'; ctx.fill(); stroke(ctx, 3);
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-58, 0); ctx.lineTo(-40, 0); ctx.moveTo(26, 0); ctx.lineTo(44, 0); ctx.stroke();
    brows(ctx, 'angry', 34, -24, '#7a7f86', 6);
    nose(ctx, 34);
    // grin with gold tooth
    const m = st.mouth || 0;
    ctx.save(); ctx.translate(0, 60);
    ctx.beginPath(); ctx.moveTo(-30, -4); ctx.quadraticCurveTo(0, 18 + m * 14, 34, -10); ctx.quadraticCurveTo(0, 6, -30, -4); ctx.closePath(); ctx.fillStyle = '#fffaf0'; ctx.fill(); stroke(ctx, 2.6);
    ctx.fillStyle = P.gold; ctx.fillRect(8, -2, 9, 9 + m * 4); ctx.restore();
    // slicked hair
    ctx.beginPath(); ctx.moveTo(-82, -6); ctx.quadraticCurveTo(-96, -120, 0, -126); ctx.quadraticCurveTo(100, -124, 84, -6); ctx.quadraticCurveTo(70, -70, 0, -78); ctx.quadraticCurveTo(-60, -76, -82, -6);
    ctx.fillStyle = pal.hair; ctx.fill(); hairShade(ctx, 'rgba(60,70,80,0.4)'); stroke(ctx, 3);
    ctx.strokeStyle = 'rgba(27,21,21,0.5)'; ctx.lineWidth = 2; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * 18, -80); ctx.quadraticCurveTo(i * 22, -110, i * 8 + 10, -124); ctx.stroke(); }
    ctx.restore();
  }

  // ================= extras =================
  // generic pop-art face for friends, grandma etc.
  function extra(ctx, x, y, s, o = {}) {
    const pal = Object.assign({ skin: '#fde3d4', shade: '#f19aa6', hair: '#ff6fb5', top: P.ink, iris: '#3a2a6a', lip: null }, o.pal || {});
    const expr = o.expr || 'smile', style = o.style || 'bob', t = o.t || 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (style === 'long' || style === 'bob') { ctx.beginPath(); ctx.ellipse(0, style === 'long' ? 40 : 0, 100, style === 'long' ? 150 : 100, 0, 0, 7); ctx.fillStyle = pal.hair; ctx.fill(); stroke(ctx, 3); }
    if (style === 'buns') for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * 70, -92, 34, 0, 7); ctx.fillStyle = pal.hair; ctx.fill(); stroke(ctx, 3); }
    if (style === 'bun') { ctx.beginPath(); ctx.arc(0, -112, 36, 0, 7); ctx.fillStyle = pal.hair; ctx.fill(); stroke(ctx, 3); }
    if (!o.noBody) { shoulders(ctx, pal.top, 165, 112); neck(ctx, pal, 22); }
    skin(ctx, pal, 72, 90, 0.35);
    eyes(ctx, { kind: o.eye || 'cat', x: 30, y: 8, r: 16, iris: pal.iris, blink: blinkAt(t, o.seed || 3), look: o.look || [0, 0], expr, lidCol: pal.skin });
    brows(ctx, expr, 30, -24, INK, 3);
    nose(ctx, 30);
    mouth(ctx, { y: 56, m: o.mouth || 0, expr, lip: pal.lip, w: 16 });
    if (o.glasses) { ctx.lineWidth = 4; ctx.strokeStyle = INK; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * 30, 8, 24, 0, 7); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-6, 6); ctx.lineTo(6, 6); ctx.stroke(); }
    // fringe
    ctx.beginPath();
    if (style === 'bob' || style === 'long') { ctx.moveTo(-84, 60); ctx.quadraticCurveTo(-92, -110, 0, -112); ctx.quadraticCurveTo(92, -110, 84, 60); ctx.lineTo(72, 60); ctx.lineTo(70, -30); ctx.lineTo(-70, -30); ctx.lineTo(-72, 60); }
    else if (style === 'mohawk') { ctx.moveTo(-74, -20); ctx.quadraticCurveTo(-80, -90, -20, -100); ctx.lineTo(-30, -150); ctx.lineTo(0, -110); ctx.lineTo(10, -160); ctx.lineTo(28, -108); ctx.lineTo(54, -140); ctx.lineTo(50, -96); ctx.quadraticCurveTo(84, -80, 76, -20); ctx.quadraticCurveTo(40, -60, -74, -20); }
    else { ctx.moveTo(-78, 0); ctx.quadraticCurveTo(-84, -104, 0, -106); ctx.quadraticCurveTo(84, -104, 78, 0); ctx.quadraticCurveTo(60, -50, 10, -56); ctx.quadraticCurveTo(-40, -40, -78, 0); }
    ctx.closePath(); ctx.fillStyle = pal.hair; ctx.fill(); hairShade(ctx, 'rgba(0,0,0,0.25)'); stroke(ctx, 3);
    ctx.restore();
  }
  const FRIENDS = [
    { style: 'bob', pal: { hair: '#5ad1ff', top: '#ff3e8f', lip: '#e0262f' } },
    { style: 'buns', pal: { hair: '#ff6fb5', top: '#ffd21c', lip: '#c81e5a' } },
    { style: 'mohawk', pal: { hair: '#a8e330', top: '#141010', skin: '#f1c7a5' }, eye: 'round' },
    { style: 'long', pal: { hair: '#7a4fd8', top: '#19b3a6', lip: '#e0262f' } }
  ];
  function friend(ctx, i, x, y, s, o = {}) { extra(ctx, x, y, s, Object.assign({ seed: i + 4 }, FRIENDS[i], o)); }
  function grandma(ctx, x, y, s, o = {}) { extra(ctx, x, y, s, Object.assign({ style: 'bun', glasses: true, eye: 'round', expr: 'smile', pal: { hair: '#d7d3cc', top: '#4a6fa5', skin: '#f6dcc6' } }, o)); }
  // interviewer: a faceless ink silhouette with glinting glasses
  function boss(ctx, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    shoulders(ctx, '#2a2a33', 185, 112);
    ctx.beginPath(); ctx.moveTo(-30, 112); ctx.lineTo(0, 150); ctx.lineTo(30, 112); ctx.closePath(); ctx.fillStyle = '#fff'; ctx.fill(); stroke(ctx, 2);
    ctx.beginPath(); ctx.moveTo(-10, 130); ctx.lineTo(10, 130); ctx.lineTo(16, 260); ctx.lineTo(0, 280); ctx.lineTo(-16, 260); ctx.closePath(); ctx.fillStyle = P.red; ctx.fill(); stroke(ctx, 2);
    headPath(ctx, 74, 92, 0.5); ctx.fillStyle = '#2a2a33'; ctx.fill(); stroke(ctx, 3);
    ctx.fillStyle = '#fffaf0'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.rect(sd * 32 - 24, -6, 48, 26); ctx.fill(); stroke(ctx, 2); }
    ctx.strokeStyle = 'rgba(80,140,255,0.8)'; ctx.lineWidth = 4; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 32 - 16, 14); ctx.lineTo(sd * 32 + 4, -4); ctx.stroke(); }
    const m = o.mouth || 0; ctx.fillStyle = '#5a1620'; ctx.beginPath(); ctx.ellipse(0, 56, 14, 2 + m * 10, 0, 0, 7); ctx.fill();
    ctx.restore();
  }

  // ---------- props ----------
  function cactus(ctx, x, y, s, o = {}) {      // Lev, Haru's pocket cactus
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(40, 0); ctx.lineTo(30, 60); ctx.lineTo(-30, 60); ctx.closePath(); ctx.fillStyle = '#d4683a'; ctx.fill(); stroke(ctx, 3);
    ctx.fillStyle = '#b8532a'; ctx.fillRect(-44, -8, 88, 16); ctx.strokeRect(-44, -8, 88, 16);
    if (o.label !== false) { ctx.fillStyle = P.paper; ctx.fillRect(-22, 18, 44, 24); ctx.fillStyle = INK; ctx.font = '18px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('LEV', 0, 31); }
    ctx.beginPath(); ctx.moveTo(-22, -8); ctx.bezierCurveTo(-26, -90, 26, -90, 22, -8); ctx.closePath(); ctx.fillStyle = '#4fa34a'; ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = dots(ctx, 'rgba(0,50,0,0.4)', 2, 6); ctx.fillRect(0, -90, 30, 90); ctx.restore(); stroke(ctx, 3);
    ctx.beginPath(); ctx.moveTo(22, -40); ctx.quadraticCurveTo(44, -40, 42, -62); ctx.quadraticCurveTo(32, -64, 30, -52); ctx.lineTo(22, -52); ctx.fillStyle = '#4fa34a'; ctx.fill(); stroke(ctx, 2.5);
    ctx.strokeStyle = INK; ctx.lineWidth = 1.5; for (let i = 0; i < 9; i++) { const a = -20 + i * 5, b = -70 + (i % 3) * 20; ctx.beginPath(); ctx.moveTo(a * 0.8, b); ctx.lineTo(a * 0.8 - 5, b - 4); ctx.stroke(); }
    // tiny face and flower
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-7, -40, 2.5, 0, 7); ctx.arc(7, -40, 2.5, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -34, 4, 0.2, Math.PI - 0.2); ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = P.hot; for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28; ctx.beginPath(); ctx.ellipse(Math.cos(a) * 7, -80 + Math.sin(a) * 7, 6, 4, a, 0, 7); ctx.fill(); }
    ctx.fillStyle = P.yellow; ctx.beginPath(); ctx.arc(0, -80, 4, 0, 7); ctx.fill();
    ctx.restore();
  }
  function lighthouse(ctx, x, y, s, t = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    // beam
    ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = P.yellow; ctx.rotate(Math.sin(t * 1.5) * 0.4);
    ctx.beginPath(); ctx.moveTo(0, -250); ctx.lineTo(-400, -330); ctx.lineTo(-400, -170); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -250); ctx.lineTo(400, -330); ctx.lineTo(400, -170); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-32, -220); ctx.lineTo(32, -220); ctx.lineTo(50, 0); ctx.closePath(); ctx.fillStyle = '#fffaf0'; ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = P.red; for (let i = 0; i < 4; i++) ctx.fillRect(-60, -200 + i * 55, 120, 28); ctx.restore(); ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-32, -220); ctx.lineTo(32, -220); ctx.lineTo(50, 0); ctx.closePath(); stroke(ctx, 3);
    ctx.fillStyle = P.yellow; ctx.fillRect(-26, -270, 52, 50); ctx.strokeRect(-26, -270, 52, 50);
    ctx.beginPath(); ctx.moveTo(-36, -270); ctx.lineTo(0, -305); ctx.lineTo(36, -270); ctx.closePath(); ctx.fillStyle = P.red; ctx.fill(); stroke(ctx, 3);
    ctx.fillStyle = '#5a6b7a'; ctx.beginPath(); ctx.ellipse(0, 6, 120, 20, 0, 0, 7); ctx.fill(); stroke(ctx, 3);
    ctx.restore();
  }
  function books(ctx, x, y, s, n = 8, seed = 1) {
    const r = Pop.rng(seed), cols = [P.red, P.blue, P.yellow, P.teal, P.pink, P.orange, P.lime, P.purple];
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); let yy = 0;
    for (let i = 0; i < n; i++) { const w = 150 + r() * 60, h = 26 + r() * 12, dx = (r() - 0.5) * 30; ctx.save(); ctx.translate(dx, yy - h / 2); ctx.rotate((r() - 0.5) * 0.08);
      ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = P.paper; ctx.fillRect(-w / 2 + 14, -h / 2 + 6, 10, h - 12); ctx.fillRect(w / 2 - 24, -h / 2 + 6, 10, h - 12); ctx.restore(); yy -= h + 2; }
    ctx.restore();
  }
  function goat(ctx, x, y, s, t = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#fffaf0';
    ctx.beginPath(); ctx.ellipse(0, 0, 90, 55, 0, 0, 7); ctx.fill(); stroke(ctx, 3);
    for (const lx of [-55, -30, 35, 60]) { ctx.fillStyle = '#fffaf0'; ctx.fillRect(lx - 8, 35, 16, 60); ctx.strokeRect(lx - 8, 35, 16, 60); ctx.fillStyle = INK; ctx.fillRect(lx - 8, 85, 16, 10); }
    ctx.save(); ctx.translate(85, -50); ctx.rotate(Math.sin(t * 3) * 0.08);
    ctx.beginPath(); ctx.ellipse(0, 0, 34, 44, 0.3, 0, 7); ctx.fillStyle = '#fffaf0'; ctx.fill(); stroke(ctx, 3);
    ctx.beginPath(); ctx.moveTo(-10, -36); ctx.quadraticCurveTo(-40, -80, -60, -50); stroke(ctx, 7); ctx.beginPath(); ctx.moveTo(8, -38); ctx.quadraticCurveTo(-10, -90, -32, -66); stroke(ctx, 7);
    ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(-6, 72); ctx.lineTo(10, 44); ctx.fillStyle = '#d9d0c0'; ctx.fill(); stroke(ctx, 2);
    ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(10, -6, 7, 4, 0, 0, 7); ctx.fill(); ctx.fillStyle = P.yellow; ctx.fillRect(7, -8, 6, 2);
    // bow tie: he is very handsome
    ctx.translate(-6, 54); ctx.fillStyle = P.red; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-16, -10); ctx.lineTo(-16, 10); ctx.closePath(); ctx.moveTo(0, 0); ctx.lineTo(16, -10); ctx.lineTo(16, 10); ctx.closePath(); ctx.fill(); stroke(ctx, 2);
    ctx.restore();
    ctx.restore();
  }
  function phone(ctx, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    ctx.beginPath(); ctx.roundRect(-60, -110, 120, 220, 18); ctx.fillStyle = '#ff7fb6'; ctx.fill(); stroke(ctx, 4);
    ctx.beginPath(); ctx.roundRect(-50, -96, 100, 192, 8); ctx.fillStyle = o.screen || '#1d2b4a'; ctx.fill(); stroke(ctx, 2);
    if (o.cracked) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(10, -20); for (const [a, b] of [[-40, -80], [10, -20], [45, -60], [10, -20], [30, 90], [10, -20], [-45, 40]]) ctx.lineTo(a, b); ctx.stroke(); }
    if (o.text) { ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = (o.textSize || 34) + 'px Anton'; o.text.split('\n').forEach((l, i, a) => ctx.fillText(l, 0, (i - (a.length - 1) / 2) * (o.textSize || 34) * 1.15)); }
    ctx.restore();
  }
  function briefcase(ctx, x, y, s, open = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#2b2b33'; ctx.beginPath(); ctx.roundRect(-140, -10, 280, 120, 10); ctx.fill(); stroke(ctx, 4);
    // money stacks
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { ctx.fillStyle = '#9fd28a'; ctx.fillRect(-124 + i * 64, 4 + j * 50, 58, 44); ctx.strokeRect(-124 + i * 64, 4 + j * 50, 58, 44); ctx.fillStyle = '#e9e1c8'; ctx.fillRect(-104 + i * 64, 4 + j * 50, 18, 44); }
    // lid
    ctx.save(); ctx.translate(0, -10); ctx.scale(1, -Math.cos(open * 1.4) * 0.9 - 0.1);
    ctx.fillStyle = '#3a3a44'; ctx.beginPath(); ctx.roundRect(-140, -110, 280, 110, 10); ctx.fill(); stroke(ctx, 4);
    ctx.fillStyle = P.gold; ctx.fillRect(-70, -16, 26, 14); ctx.fillRect(44, -16, 26, 14); ctx.restore();
    ctx.restore();
  }
  function banknote(ctx, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.fillStyle = '#b9e0a3'; ctx.fillRect(-50, -24, 100, 48); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.strokeRect(-50, -24, 100, 48);
    ctx.beginPath(); ctx.arc(14, 0, 14, 0, 7); ctx.fillStyle = '#e9e1c8'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = INK; ctx.font = '22px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('¥', -26, 1);
    ctx.restore();
  }
  function flames(ctx, x, y, s, t, n = 7) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const cols = [P.red, P.orange, P.yellow];
    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath(); ctx.moveTo(-200 + layer * 30, 0);
      for (let i = 0; i <= n; i++) {
        const xx = -200 + layer * 30 + i * (400 - layer * 60) / n, h = (180 - layer * 50) * (0.6 + 0.4 * Pop.hash(i * 3 + layer + Math.floor(t * 12)));
        ctx.quadraticCurveTo(xx - 20, -h * 0.5, xx, -h); ctx.quadraticCurveTo(xx + 10, -h * 0.4, xx + (400 - layer * 60) / n * 0.5, -h * 0.25);
      }
      ctx.lineTo(200 - layer * 30, 0); ctx.closePath(); ctx.fillStyle = cols[layer]; ctx.fill(); if (layer === 0) stroke(ctx, 4);
    }
    ctx.restore();
  }
  function umbrella(ctx, x, y, s, rot = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, 170); ctx.quadraticCurveTo(0, 200, -24, 196); stroke(ctx, 6);
    ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(-150, -120, 0, -126); ctx.quadraticCurveTo(150, -120, 150, 0);
    for (let i = 5; i >= 0; i--) ctx.quadraticCurveTo(-150 + i * 50 + 25, -22, -150 + i * 50, 0);
    ctx.closePath(); ctx.fillStyle = 'rgba(200,235,255,0.65)'; ctx.fill(); stroke(ctx, 3.5);
    ctx.strokeStyle = 'rgba(27,21,21,0.45)'; ctx.lineWidth = 2; for (const xx of [-100, -50, 0, 50, 100]) { ctx.beginPath(); ctx.moveTo(0, -124); ctx.quadraticCurveTo(xx * 0.8, -60, xx, -4); ctx.stroke(); }
    ctx.fillStyle = P.yellow; ctx.fillRect(-36, -76, 72, 30); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.strokeRect(-36, -76, 72, 30);
    ctx.fillStyle = INK; ctx.font = '22px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('¥100', 0, -60);
    ctx.restore();
  }
  function gauge(ctx, x, y, s, k, label = 'HAPPINESS') {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.arc(0, 0, 150, Math.PI, 0); ctx.lineTo(0, 0); ctx.closePath(); ctx.fillStyle = P.paper; ctx.fill(); stroke(ctx, 5);
    const segs = [P.red, P.orange, P.yellow, P.lime];
    segs.forEach((c, i) => { ctx.beginPath(); ctx.arc(0, 0, 130, Math.PI + i * Math.PI / 4, Math.PI + (i + 1) * Math.PI / 4); ctx.lineWidth = 26; ctx.strokeStyle = c; ctx.stroke(); });
    ctx.fillStyle = INK; ctx.font = '26px Anton'; ctx.textAlign = 'center'; ctx.fillText(label, 0, -50);
    ctx.save(); ctx.rotate(Math.PI * (k - 0.5)); ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(0, -128); ctx.lineTo(8, 0); ctx.closePath(); ctx.fillStyle = INK; ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, 7); ctx.fillStyle = P.red; ctx.fill(); stroke(ctx, 3);
    ctx.restore();
  }
  function stamp(ctx, text, x, y, s, rot, col = P.red) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.font = '54px Anton'; const w = ctx.measureText(text).width + 40;
    ctx.globalAlpha *= 0.88; ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.strokeRect(-w / 2, -40, w, 80); ctx.lineWidth = 2.5; ctx.strokeRect(-w / 2 + 8, -32, w - 16, 64);
    ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 3);
    // ink speckle knock-out
    ctx.globalCompositeOperation = 'destination-out'; const r = Pop.rng(Math.floor(x + y));
    for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc((r() - 0.5) * w, (r() - 0.5) * 80, r() * 3, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  // tiny full-figure versions for wide shots (head scale s, walking phase w)
  function figure(ctx, who, x, y, s, o = {}) {
    const w = o.walk || 0, legA = Math.sin(w) * 0.45;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const trous = who === 'haru' ? '#6b4a2e' : '#1b1515', shoe = who === 'haru' ? '#fffaf0' : '#1b1515';
    for (const [sd, a] of [[-1, legA], [1, -legA]]) { ctx.save(); ctx.translate(sd * 40, 330); ctx.rotate(a);
      ctx.fillStyle = who === 'nana' ? '#fde3d4' : trous; ctx.fillRect(-24, 0, 48, 260); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.strokeRect(-24, 0, 48, 260);
      if (who === 'nana') { ctx.fillStyle = INK; ctx.fillRect(-26, 150, 52, 110); }
      ctx.fillStyle = shoe; ctx.beginPath(); ctx.ellipse(sd * 10, 268, 40, 18, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
    if (who === 'nana') { ctx.beginPath(); ctx.moveTo(-100, 300); ctx.lineTo(100, 300); ctx.lineTo(120, 400); ctx.lineTo(-120, 400); ctx.closePath(); ctx.fillStyle = INK; ctx.fill(); stroke(ctx, 3); }
    ctx.restore();
    const st = Object.assign({ t: o.t }, o.st || {});
    if (who === 'haru') haru(ctx, x, y, s, st); else nana(ctx, x, y, s, st);
  }

  window.Cast = { haru, nana, ryuji, extra, friend, grandma, boss, cactus, lighthouse, books, goat, phone, briefcase, banknote, flames, umbrella, gauge, stamp, figure, FRIENDS, HARU, NANA };
})();
