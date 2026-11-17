// Render the Dune paintings to JPEG with headless Chromium.
// Usage: node render.js [ids...]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const ids0 = process.argv.slice(2);
  const src = path.join(__dirname, 'src');
  const out = path.join(__dirname, 'out');
  fs.mkdirSync(out, { recursive: true });
  const files = fs.readdirSync(path.join(src, 'scenes')).filter((f) => f.endsWith('.js')).sort();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('[pageerror]', e));
  page.on('console', (m) => console.log('[page]', m.text()));
  await page.setContent('<html><body></body></html>');
  await page.addScriptTag({ path: path.join(src, 'kit.js') });
  for (const f of files) await page.addScriptTag({ path: path.join(src, 'scenes', f) });
  const ids = ids0.length ? ids0 : await page.evaluate(() => Object.keys(D.scenes).sort());
  for (const id of ids) {
    const t0 = Date.now();
    const data = await page.evaluate((id) => {
      const sc = D.scenes[id];
      const c = document.createElement('canvas'); c.width = sc.W; c.height = sc.H;
      const K = D.makeKit(c, sc.seed);
      sc.draw(K);
      return c.toDataURL('image/jpeg', 0.92);
    }, id);
    fs.writeFileSync(path.join(out, id + '.jpg'), Buffer.from(data.split(',')[1], 'base64'));
    console.log(id, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  }
  await browser.close();
})();
