// Shared helpers for the tracker's serverless functions. Files starting with _ are not routes on Vercel.
const METHOD = require('../tracker/methodology.json');

const UA = 'KindletonTracker/1.0 (+https://github.com/chad3456/simpson-video-animator)';

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

module.exports = { METHOD, UA, getText, cached, send };
