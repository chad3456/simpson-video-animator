// Shared helpers for the tracker's serverless functions. Files starting with _ are not routes on Vercel.
const METHOD = require('../tracker/methodology.json');

const UA = 'KindletonTracker/1.0 (+https://github.com/chad3456/simpson-video-animator)';
const GDELT = 'https://api.gdeltproject.org/api/v2/doc/doc';
const TIMESPANS = { '24h': '24h', '7d': '7d', '30d': '30d', '90d': '3months' };
const sleep = ms => new Promise(r => setTimeout(r, ms));

function gdeltUrl(params) {
  const u = new URL(GDELT);
  for (const [k, v] of Object.entries({ format: 'json', ...params })) u.searchParams.set(k, v);
  return u.toString();
}

// GDELT answers errors (bad query, rate limit) as plain text with status 200, so check the body.
async function gdelt(params, { retries = 1 } = {}) {
  const url = gdeltUrl(params);
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(15000) });
    const text = await r.text();
    try { return { url, data: text.trim() ? JSON.parse(text) : {} }; } catch (_) {}
    const msg = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200) || `HTTP ${r.status}`;
    if (attempt < retries && /limit requests|one every/i.test(msg)) { await sleep(5500); continue; }
    throw Object.assign(new Error(msg), { url });
  }
}

async function getText(url, headers = {}) {
  const r = await fetch(url, { headers: { 'user-agent': UA, ...headers }, signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

// tiny per-instance memo so warm functions do not re-hit upstreams inside the CDN cache window
const memo = new Map();
async function cached(key, ttlMs, fn, keep = () => true) {
  const hit = memo.get(key);
  if (hit && Date.now() - hit.t < ttlMs) return hit.v;
  const v = await fn();
  if (keep(v)) memo.set(key, { t: Date.now(), v });
  return v;
}

function send(res, status, body, cdnSeconds) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', cdnSeconds ? `public, s-maxage=${cdnSeconds}, stale-while-revalidate=3600` : 'no-store');
  res.end(JSON.stringify(body));
}

const query = req => new URL(req.url, 'http://x').searchParams;

module.exports = { METHOD, UA, TIMESPANS, sleep, gdelt, gdeltUrl, getText, cached, send, query };
