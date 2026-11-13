// Validate every painting's layers as XML and report NaN / parse errors. usage: node ramayana/tools/check.mjs [--only 2,15]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import http from 'http'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const i = process.argv.indexOf('--only'), only = i > 0 ? process.argv[i + 1].split(',').map(Number) : null;
const srv = http.createServer((req, res) => { const p = path.join(root, decodeURIComponent(req.url.split('?')[0])); fs.readFile(p, (e, b) => { if (e) { res.writeHead(404); res.end(); } else { res.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : p.endsWith('.html') ? 'text/html' : 'application/octet-stream' }); res.end(b); } }); }).listen(0);
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await b.newPage(); page.on('pageerror', (e) => console.log('pageerror:', String(e).slice(0, 300)));
await page.goto(`http://localhost:${srv.address().port}/ramayana/view.html?still=1&p=none`).catch(() => {});
await page.waitForFunction('window.R && R.paintings.length');
const res = await page.evaluate((only) => { const out = []; for (const m of R.paintings.slice().sort((a, b) => a.n - b.n)) { if (only && !only.includes(m.n)) continue; let P; try { P = R.Painting(m); m.draw(P); } catch (e) { out.push(m.n + ' THROW ' + (e.stack || e).toString().slice(0, 400)); continue; } for (const k of ['sky', 'bg', 'mid', 'fg', 'mask']) { const svg = P.svg(k); const d = new DOMParser().parseFromString(svg, 'image/svg+xml'); const pe = d.querySelector('parsererror'); if (pe) { const mm = /line (\d+) at column (\d+)/.exec(pe.textContent); const col = mm ? +mm[2] : 0; out.push(m.n + ' ' + k + ' XML: ' + pe.textContent.slice(0, 160) + ' >>> ' + svg.slice(Math.max(0, col - 200), col + 60)); } const nn = svg.indexOf('NaN'); if (nn >= 0) out.push(m.n + ' ' + k + ' NaN: ' + svg.slice(Math.max(0, nn - 220), nn + 40)); const un = svg.indexOf('undefined'); if (un >= 0) out.push(m.n + ' ' + k + ' undefined: ' + svg.slice(Math.max(0, un - 220), un + 40)); } out.push(m.n + ' ok ' + ['sky', 'bg', 'mid', 'fg'].map((k) => Math.round(P.svg(k).length / 1024) + 'k').join(' ')); } return out; }, only);
console.log(res.filter((l) => !/ ok /.test(l)).join('\n') || 'all clean'); console.log(res.filter((l) => / ok /.test(l)).length, 'paintings checked');
await b.close(); srv.close();
