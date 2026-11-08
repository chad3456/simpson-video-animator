// Render Ramayana portraits to JPEG with headless Chromium (Playwright).
// Usage: node render.js [sceneId ...] [--ref] [--quality=0.5]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const args = process.argv.slice(2);
  const wantRef = args.includes('--ref');
  const q = parseFloat((args.find((a) => a.startsWith('--quality=')) || '--quality=1').split('=')[1]);
  const outDir = path.join(__dirname, 'out');
  fs.mkdirSync(outDir, { recursive: true });
  const src = path.join(__dirname, 'src');
  const sceneFiles = fs.readdirSync(path.join(src, 'scenes')).filter((f) => f.endsWith('.js')).sort();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', (m) => console.log('[page]', m.text()));
  page.on('pageerror', (e) => console.error('[pageerror]', e));
  await page.setContent('<html><body></body></html>');
  for (const f of ['engine.js', 'kit.js']) await page.addScriptTag({ path: path.join(src, f) });
  for (const f of sceneFiles) await page.addScriptTag({ path: path.join(src, 'scenes', f) });
  let ids = args.filter((a) => !a.startsWith('--'));
  if (!ids.length) ids = await page.evaluate(() => Object.keys(RP.scenes).sort());
  for (const id of ids) {
    const t0 = Date.now();
    const res = await page.evaluate(([id, q, wantRef]) => {
      const sc = RP.scenes[id];
      const canvas = RP.paint(sc, { quality: q, keepRef: wantRef });
      return { img: canvas.toDataURL('image/jpeg', 0.9), ref: wantRef ? RP._lastRef : null };
    }, [id, q, wantRef]);
    fs.writeFileSync(path.join(outDir, `${id}.jpg`), Buffer.from(res.img.split(',')[1], 'base64'));
    if (res.ref) fs.writeFileSync(path.join(outDir, `${id}.ref.jpg`), Buffer.from(res.ref.split(',')[1], 'base64'));
    console.log(id, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  }
  await browser.close();
})();
