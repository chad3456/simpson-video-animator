// node mahagatha/tools/shot.mjs <html-relative-to-repo> <out.png> [w h]  -- screenshot a local page
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const [u, out, w = 1600, h = 900] = process.argv.slice(2);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => { const p = path.join(root, decodeURIComponent(req.url.split('?')[0])); if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res); }).listen(0);
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: +w, height: +h } });
pg.on('console', m => console.log('console:', m.text())); pg.on('pageerror', e => console.log('ERR', e.message));
await pg.goto(`http://127.0.0.1:${server.address().port}/${u}`); await pg.waitForFunction('window.__ready===true', null, { timeout: 60000 });
await pg.screenshot({ path: out }); await b.close(); server.close();
