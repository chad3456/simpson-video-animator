// GET /api/tracker?window=7d
// Per-country volume intensity for every indicator in tracker/methodology.json, straight from GDELT.
// Scoring happens in the browser so the page can show its working.
const { METHOD, TIMESPANS, sleep, gdelt, cached, send, query } = require('./_lib');

const seriesName = s => String(s || '').replace(/\s*volume intensity\s*$/i, '').trim();

async function indicator(ind, timespan) {
  const { url, data } = await gdelt({ query: ind.query, mode: 'timelinesourcecountry', timespan });
  const countries = {};
  for (const s of data.timeline || []) {
    const name = seriesName(s.series);
    const pts = (s.data || []).map(p => ({ date: p.date, value: Number(p.value) || 0 }));
    if (!name || !pts.length) continue;
    countries[name] = { mean: pts.reduce((a, p) => a + p.value, 0) / pts.length, series: pts.map(p => p.value) };
  }
  return { id: ind.id, status: 'ok', url, countries, dates: ((data.timeline || [])[0]?.data || []).map(p => p.date) };
}

module.exports = async (req, res) => {
  const win = query(req).get('window') || '7d';
  const timespan = TIMESPANS[win];
  if (!timespan) return send(res, 400, { error: `window must be one of ${Object.keys(TIMESPANS).join(', ')}` });
  const result = await cached(`tracker:${win}`, 10 * 60e3, async () => {
    const indicators = [];
    for (const [i, ind] of METHOD.indicators.entries()) {
      if (i) await sleep(5200); // GDELT asks for at most one request every 5 seconds
      try { indicators.push(await indicator(ind, timespan)); }
      catch (e) { indicators.push({ id: ind.id, status: 'error', error: e.message, url: e.url }); }
    }
    return { generated: new Date().toISOString(), window: win, source: 'GDELT DOC 2.0', indicators };
  }, r => r.indicators.every(i => i.status === 'ok'));
  const ok = result.indicators.filter(i => i.status === 'ok').length;
  send(res, ok ? 200 : 502, result, ok === result.indicators.length ? 900 : 60);
};
