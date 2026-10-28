import { chromium } from 'playwright';
import fs from 'node:fs';
const dir = '/home/claude/simpson-video-animator/anime/engine/';
const js = ['sets.js','characters.js'].map(f => fs.readFileSync(dir + f, 'utf8')).join('\n');
const cfg = process.argv[2] || '[]';
const out = process.argv[3] || '/tmp/claude-0/ct/char.png';
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.setContent(`<html><body style="margin:0;background:#cfc8b8"><svg id="s" width="1280" height="720" viewBox="0 0 1280 720"></svg><script>${js}</script></body></html>`);
await page.evaluate((cfg) => {
  const items = JSON.parse(cfg); let s = '<rect x="0" y="380" width="1280" height="40" fill="#8a5f3c"/>';
  for (const it of items) s += `<g transform="translate(${it.x} ${it.y}) scale(${it.s || 1.4})">${AnimeChars.draw(it.id, Object.assign({ pose: 'sit', season: 'autumn', emo: 'neutral', tu: 0, gx: 0, gy: 0, talk: 0, blink: 0, seed: 1, lx: -0.3 }, it.st || {}), 1.0)}</g>`;
  document.getElementById('s').innerHTML = s;
}, cfg);
await page.screenshot({ path: out }); await browser.close();
