const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = path.resolve(__dirname, '../out-events');
  const files = fs.readdirSync(dir).filter(f => /^\d\d-.*\.jpg$/.test(f)).sort();
  const imgs = files.map(f => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dir, f)).toString('base64'));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2400, height: 2000 } });
  await p.setContent(`<body style="margin:0;background:#1a1020;display:grid;grid-template-columns:repeat(4,580px);gap:20px;padding:20px">${imgs.map((s,i)=>`<div style="color:#f4e6c8;font:22px Georgia"><img src="${s}" style="width:580px;display:block">${files[i].replace('.jpg','').replace(/-/g,' ')}</div>`).join('')}</body>`);
  const h = await p.evaluate(() => document.body.scrollHeight);
  await p.setViewportSize({ width: 2400, height: h });
  await p.screenshot({ path: path.join(dir, 'contact-sheet.jpg'), type: 'jpeg', quality: 82, fullPage: true });
  await b.close();
})();
