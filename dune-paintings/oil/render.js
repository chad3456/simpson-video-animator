// Realistic oil Dune paintings: raymarch a lit 3D reference in WebGL2, then repaint it in oil strokes.
// Usage: node oil/render.js [id ...] [--scale=0.5] [--ref-only]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const args = process.argv.slice(2);
  const scale = parseFloat((args.find((a) => a.startsWith('--scale=')) || '--scale=1').split('=')[1]);
  const refOnly = args.includes('--ref-only');
  const here = __dirname, out = path.join(here, '..', 'out-oil');
  fs.mkdirSync(out, { recursive: true });
  const common = fs.readFileSync(path.join(here, 'common.glsl'), 'utf8');
  const files = fs.readdirSync(path.join(here, 'scenes')).filter((f) => f.endsWith('.js')).sort();
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  page.on('console', (m) => console.log('[page]', m.text()));
  await page.setContent('<html><body></body></html>');
  await page.addScriptTag({ path: path.join(here, 'oil.js') });
  await page.addScriptTag({ content: 'window.SC = {};' });
  for (const f of files) await page.addScriptTag({ path: path.join(here, 'scenes', f) });
  const ids = args.filter((a) => !a.startsWith('--'));
  const list = ids.length ? ids : await page.evaluate(() => Object.keys(SC).sort());
  for (const id of list) {
    const t0 = Date.now();
    const res = await page.evaluate(async ([id, common, scale, refOnly]) => {
      const sc = SC[id];
      const W = Math.round(sc.W * scale), H = Math.round(sc.H * scale);
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const gl = c.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
      const vs = '#version 300 es\nin vec2 a; void main(){ gl_Position = vec4(a,0,1); }';
      const fsrc = '#version 300 es\n' + common.replace('SCENE_CODE', sc.code);
      const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      const pr = gl.createProgram(); gl.attachShader(pr, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, fsrc)); gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
      gl.useProgram(pr);
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const U = sc.uniforms;
      const set = (n, v) => { const l = gl.getUniformLocation(pr, n); if (!l) return; if (typeof v === 'number') gl.uniform1f(l, v); else if (v.length === 2) gl.uniform2fv(l, v); else gl.uniform3fv(l, v); };
      set('uRes', [W, H]);
      for (const k in U) set(k, U[k]);
      gl.enable(gl.SCISSOR_TEST);
      const ts = 160;
      for (let y = 0; y < H; y += ts) for (let x = 0; x < W; x += ts) { gl.scissor(x, y, ts, ts); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.finish(); }
      const px = new Uint8Array(W * H * 4); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, px);
      const ref = document.createElement('canvas'); ref.width = W; ref.height = H;
      const rc = ref.getContext('2d'); const im = rc.createImageData(W, H);
      for (let y = 0; y < H; y++) im.data.set(px.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4);
      rc.putImageData(im, 0, 0);
      if (sc.post) sc.post(rc, W, H, scale);
      const refURL = ref.toDataURL('image/jpeg', 0.92);
      if (refOnly) return { ref: refURL };
      const o = document.createElement('canvas'); o.width = W; o.height = H;
      const po = Object.assign({}, sc.oil || {}); if (po.sizes) po.sizes = po.sizes.map((s) => Math.max(2, s * scale));
      OIL.paint(ref, o, po);
      if (sc.finish) sc.finish(o.getContext('2d'), W, H, scale);
      return { ref: refURL, img: o.toDataURL('image/jpeg', 0.93) };
    }, [id, common, scale, refOnly]);
    fs.writeFileSync(path.join(out, id + '.ref.jpg'), Buffer.from(res.ref.split(',')[1], 'base64'));
    if (res.img) fs.writeFileSync(path.join(out, id + '.jpg'), Buffer.from(res.img.split(',')[1], 'base64'));
    console.log(id, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  }
  await browser.close();
})();
