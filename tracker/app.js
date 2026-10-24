// Suicidal Empathy Meter: reads GDELT from the browser (sources.js), scores countries per methodology.json and draws the map.
(() => {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const W = 960, H = 520, REFRESH_MS = 15 * 60e3; // GDELT updates every 15 minutes
  const REGIONS = { World: [[-170, -58], [180, 80]], Europe: [[-25, 34], [45, 71]], 'N. America': [[-170, 12], [-50, 72]], 'South Asia': [[60, 5], [98, 38]], 'Middle East': [[24, 12], [63, 42]] };
  // GDELT source-country names that differ from Natural Earth's short names
  const ALIAS = {
    'united states': 'United States of America', 'usa': 'United States of America', 'czech republic': 'Czechia',
    'bosnia and herzegovina': 'Bosnia and Herz.', 'bosnia-herzegovina': 'Bosnia and Herz.', 'democratic republic of the congo': 'Dem. Rep. Congo',
    'congo, democratic republic of the': 'Dem. Rep. Congo', 'democratic republic of congo': 'Dem. Rep. Congo', 'zaire': 'Dem. Rep. Congo',
    'republic of the congo': 'Congo', 'congo, republic of the': 'Congo', 'congo-brazzaville': 'Congo', 'ivory coast': "Côte d'Ivoire",
    "cote d'ivoire": "Côte d'Ivoire", 'dominican republic': 'Dominican Rep.', 'central african republic': 'Central African Rep.',
    'south sudan': 'S. Sudan', 'western sahara': 'W. Sahara', 'equatorial guinea': 'Eq. Guinea', 'solomon islands': 'Solomon Is.',
    'falkland islands': 'Falkland Is.', 'falkland islands (islas malvinas)': 'Falkland Is.', 'north macedonia': 'Macedonia',
    'macedonia, the former yugoslav republic of': 'Macedonia', 'swaziland': 'eSwatini', 'eswatini': 'eSwatini', 'burma': 'Myanmar',
    'east timor': 'Timor-Leste', 'bahamas, the': 'Bahamas', 'the bahamas': 'Bahamas', 'gambia, the': 'Gambia', 'the gambia': 'Gambia',
    'korea, south': 'South Korea', 'republic of korea': 'South Korea', 'korea, north': 'North Korea', "democratic people's republic of korea": 'North Korea',
    'russian federation': 'Russia', 'syrian arab republic': 'Syria', 'iran, islamic republic of': 'Iran', 'viet nam': 'Vietnam',
    'lao people\'s democratic republic': 'Laos', 'turkiye': 'Turkey', 'türkiye': 'Turkey', 'occupied palestinian territory': 'Palestine',
    'west bank': 'Palestine', 'gaza strip': 'Palestine', 'palestinian territories': 'Palestine', 'great britain': 'United Kingdom', 'uk': 'United Kingdom',
    'french southern and antarctic lands': 'Fr. S. Antarctic Lands', 'trinidad & tobago': 'Trinidad and Tobago',
  };
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

  let METHOD, FEATURES, path, projection, DATA, SCORES = {}, THIN = [], selected = null, region = 'World', timer;
  const state = { win: '7d', layer: 'score', sort: ['score', -1] };
  try { Object.assign(state, JSON.parse(localStorage.getItem('sem-state') || '{}')); } catch (_) {}
  const save = () => { try { localStorage.setItem('sem-state', JSON.stringify({ win: state.win, layer: state.layer })); } catch (_) {} };

  const setStatus = (kind, text) => { $('status').innerHTML = `<span class="dot ${kind}"></span><span>${text}</span>`; };
  const pct = v => v == null ? '–' : v === 0 ? '0' : v < 0.001 ? '<0.001%' : `${v.toPrecision(2)}%`;
  const ago = d => { const s = (Date.now() - new Date(d)) / 1000; return !isFinite(s) ? '' : s < 90 ? 'just now' : s < 5400 ? `${Math.round(s / 60)} min ago` : s < 129600 ? `${Math.round(s / 3600)} h ago` : `${Math.round(s / 86400)} d ago`; };
  const gdeltDate = d => /^\d{8}T\d{6}Z$/.test(d || '') ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${d.slice(9, 11)}:${d.slice(11, 13)}:${d.slice(13, 15)}Z` : d;
  const binOf = s => s == null ? null : METHOD.bins.find(b => s >= b.min && s < b.max);
  const colorOf = s => binOf(s)?.color || METHOD.noDataColor;
  const IND = id => METHOD.indicators.find(i => i.id === id);
  const slug = c => c.toLowerCase().replace(/[^a-z]/g, '');
  const gdeltList = (q, country) => `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(country ? `${q} sourcecountry:${slug(country)}` : q)}&mode=artlist&format=html&sort=datedesc&maxrecords=75&timespan=${({ '24h': '24h', '7d': '7d', '30d': '30d', '90d': '3months' })[state.win]}`;
  const gdeltChart = q => `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(q)}&mode=timelinesourcecountry&timespan=${({ '24h': '24h', '7d': '7d', '30d': '30d', '90d': '3months' })[state.win]}`;

  // ---------- scoring (mirrors methodology.json "scoring") ----------
  function score(data) {
    const ok = data.indicators.filter(i => i.status === 'ok');
    const all = new Set(ok.flatMap(i => Object.keys(i.countries)));
    // a few stray articles from a tiny media market can read as a huge percentage, so require minimum evidence
    const hits = n => ok.reduce((a, i) => a + (i.countries[n]?.hits || 0), 0);
    const names = new Set([...all].filter(n => hits(n) >= METHOD.minHits));
    THIN = [...all].filter(n => !names.has(n));
    const p95 = {}, out = {};
    for (const ind of ok) {
      const vals = [...names].map(n => ind.countries[n]?.mean || 0).sort((a, b) => a - b);
      p95[ind.id] = vals[Math.min(vals.length - 1, Math.floor(0.95 * (vals.length - 1)))] || Math.max(...vals) || 1;
    }
    const wsum = ok.reduce((a, i) => a + IND(i.id).weight, 0) || 1; // re-weight if an indicator failed
    const third = (arr, k) => { const n = Math.max(1, Math.floor(arr.length / 3)); const s = k ? arr.slice(-n) : arr.slice(0, n); return s.reduce((a, v) => a + v, 0) / s.length; };
    for (const name of names) {
      const parts = {}; let s = 0, s0 = 0, s1 = 0;
      for (const ind of ok) {
        const c = ind.countries[name], w = IND(ind.id).weight / wsum;
        const mean = c?.mean || 0, n = Math.min(1, mean / p95[ind.id]);
        const series = c?.series || [];
        const t0 = series.length ? third(series, 0) : 0, t1 = series.length ? third(series, 1) : 0;
        parts[ind.id] = { mean, norm: n, contrib: 100 * w * n, series, t0, t1 };
        s += 100 * w * n; s0 += 100 * w * Math.min(1, t0 / p95[ind.id]); s1 += 100 * w * Math.min(1, t1 / p95[ind.id]);
      }
      out[name] = { name, score: s, trend: s1 - s0, parts };
    }
    return { scores: out, p95, partial: ok.length < data.indicators.length };
  }
  const valueFor = c => !c ? null : state.layer === 'score' ? c.score : 100 * (c.parts[state.layer]?.norm ?? 0);

  // ---------- map ----------
  function matchFeature(gname) {
    const n = norm(gname), a = ALIAS[n];
    return FEATURES.find(f => f.properties.name === a) || FEATURES.find(f => norm(f.properties.name) === n);
  }
  function fit() {
    const [[x0, y0], [x1, y1]] = REGIONS[region];
    projection.fitExtent([[8, 8], [W - 8, H - 8]], { type: 'MultiPoint', coordinates: [[x0, y0], [x1, y1], [x0, y1], [x1, y0], [(x0 + x1) / 2, y0], [(x0 + x1) / 2, y1]] });
    $('countries').querySelectorAll('path').forEach(p => p.setAttribute('d', path(p.__f)));
    drawPulses();
  }
  function drawMap() {
    const g = $('countries'); g.innerHTML = '';
    for (const f of FEATURES) {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.__f = f; p.setAttribute('class', 'c'); p.setAttribute('d', path(f));
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'title'); p.appendChild(t);
      g.appendChild(p);
    }
    paint();
  }
  function paint() {
    $('countries').querySelectorAll('path').forEach(p => {
      const c = p.__f.__c, v = valueFor(c);
      p.style.fill = c ? colorOf(v) : '';
      p.classList.toggle('nodata', !c);
      p.classList.toggle('sel', !!selected && c?.name === selected);
      p.firstChild.textContent = c ? `${p.__f.properties.name}: ${v.toFixed(0)} (${binOf(v).label})` : `${p.__f.properties.name}: no data`;
    });
    $('legend').innerHTML = `<b style="color:var(--fg)">${esc(state.layer === 'score' ? 'Composite score' : IND(state.layer).label)}</b>` +
      METHOD.bins.map(b => `<span><i class="sw" style="background:${b.color}"></i>${b.min}–${Math.min(b.max, 100)} ${b.label}</span>`).join('') +
      `<span><i class="sw hatch"></i>No data</span>`;
  }
  const tip = $('tip');
  $('map').addEventListener('mousemove', e => {
    const p = e.target.closest('path.c'); if (!p) { tip.style.display = 'none'; return; }
    const c = p.__f.__c, v = valueFor(c), r = $('map').parentElement.getBoundingClientRect();
    tip.innerHTML = `<b>${esc(p.__f.properties.name)}</b> · ${c ? `${v.toFixed(0)} ${esc(binOf(v).label)}` : 'no data'}`;
    tip.style.display = 'block'; tip.style.left = `${Math.min(e.clientX - r.left + 12, r.width - 180)}px`; tip.style.top = `${e.clientY - r.top + 12}px`;
  });
  $('map').addEventListener('mouseleave', () => { tip.style.display = 'none'; });
  $('map').addEventListener('click', e => { const p = e.target.closest('path.c'); if (p) select(p.__f.__c?.name || null, p.__f.properties.name); });

  // recent articles pulse on their outlet's country
  let PULSE = [];
  function drawPulses() {
    const g = $('pulses'); g.innerHTML = '';
    const by = new Map();
    for (const a of PULSE) { const f = a.country && matchFeature(a.country); if (f) by.set(f, (by.get(f) || 0) + 1); }
    for (const [f, n] of by) {
      const [x, y] = path.centroid(f); if (!isFinite(x)) continue;
      const r = Math.min(7, 2 + Math.sqrt(n));
      g.insertAdjacentHTML('beforeend', `<circle class="pulse" cx="${x}" cy="${y}" r="${r / 1.6}"/><circle class="pulse ring" cx="${x}" cy="${y}" r="${r}"/>`);
    }
  }

  // ---------- side panel ----------
  const spark = (series, color) => {
    if (!series.length) return '';
    const max = Math.max(...series) || 1, w = 120, h = 26;
    const pts = series.map((v, i) => `${(i / Math.max(1, series.length - 1) * w).toFixed(1)},${(h - 2 - v / max * (h - 4)).toFixed(1)}`).join(' ');
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5"/></svg>`;
  };
  const trendTxt = (a, b) => { if (!a && !b) return '<span class="muted">flat</span>'; const d = a ? (b - a) / a * 100 : 100; return Math.abs(d) < 5 ? '<span class="muted">steady</span>' : `<span class="trend ${d > 0 ? 'up' : 'down'}">${d > 0 ? '▲' : '▼'} ${Math.abs(d).toFixed(0)}%</span>`; };

  function panelOverview() {
    const list = Object.values(SCORES).sort((a, b) => b.score - a.score);
    const rising = Object.values(SCORES).filter(c => c.parts.redgreen && c.parts.redgreen.t1 > c.parts.redgreen.t0 && c.parts.redgreen.mean > 0).sort((a, b) => (b.parts.redgreen.t1 - b.parts.redgreen.t0) - (a.parts.redgreen.t1 - a.parts.redgreen.t0)).slice(0, 5);
    const watch = ['United Kingdom', 'United States', 'France', 'Germany', 'Sweden', 'India'].map(n => SCORES[n] || Object.values(SCORES).find(c => matchFeature(c.name)?.properties.name === matchFeature(n)?.properties.name)).filter(Boolean);
    $('panel').innerHTML = `<h3>World</h3>
      <p class="muted" style="margin:0;font-size:14px">${list.length} countries with GDELT coverage in this window. Click any country for its breakdown and source links.</p>
      <div><h2 style="margin-bottom:6px">Highest score</h2>${list.slice(0, 6).map(c => row(c)).join('')}</div>
      ${watch.length ? `<div><h2 style="margin-bottom:6px">Watch list</h2>${watch.map(c => row(c)).join('')}</div>` : ''}
      <div><h2 style="margin-bottom:6px">Red-green coverage rising</h2>${rising.length ? rising.map(c => row(c, `${trendTxt(c.parts.redgreen.t0, c.parts.redgreen.t1)}`)).join('') : '<p class="muted" style="margin:0;font-size:14px">No country shows a rise in this window.</p>'}</div>`;
    $('panel').querySelectorAll('[data-c]').forEach(b => b.onclick = () => select(b.dataset.c));
  }
  function row(c, extra) {
    const v = valueFor(c);
    return `<button data-c="${esc(c.name)}" style="all:unset;cursor:pointer;display:grid;grid-template-columns:1fr auto;gap:2px 10px;width:100%;padding:6px 0;border-top:1px solid var(--line)">
      <span>${esc(c.name)}</span><b>${extra || v.toFixed(0)}</b><span class="bar" style="grid-column:1/-1"><i style="width:${v}%;background:${colorOf(v)}"></i></span></button>`;
  }

  async function select(name, mapName) {
    selected = name; paint();
    if (!name) {
      $('panel').innerHTML = `<h3>${esc(mapName)}</h3><p class="muted" style="margin:0">${THIN.some(n => matchFeature(n)?.properties.name === mapName) ? `Too little coverage to score: fewer than ${METHOD.minHits} time slots with matching articles in this window. Try a longer window.` : 'No data. GDELT returned no articles from outlets in this country for any indicator in this window, or does not monitor its media.'} That is not a score of zero.</p><button class="seg" style="padding:8px 12px;background:none;color:inherit;cursor:pointer" id="back">← World view</button>`;
      $('back').onclick = () => { selected = null; paint(); panelOverview(); }; return;
    }
    const c = SCORES[name], b = binOf(c.score);
    const okIds = new Set(DATA.indicators.filter(i => i.status === 'ok').map(i => i.id));
    $('panel').innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h3>${esc(name)}</h3><button id="back" style="all:unset;cursor:pointer;color:var(--toon);font-size:14px">World ×</button></div>
      <div class="gauge"><div class="num" style="color:${b.color}">${c.score.toFixed(0)}</div><div><b>${esc(b.label)}</b> on the composite index<div class="bar" style="margin-top:6px"><i style="width:${c.score}%;background:${b.color}"></i></div><small class="muted">Trend over the window: ${c.trend >= 0 ? '+' : ''}${c.trend.toFixed(0)} points</small></div></div>
      ${METHOD.indicators.map(ind => {
        const p = c.parts[ind.id];
        const st = DATA.indicators.find(i => i.id === ind.id)?.status;
        if (!okIds.has(ind.id)) return `<div class="ind"><div class="row"><b>${esc(ind.label)}</b><small>${st === 'pending' ? 'loading…' : 'unavailable'}</small></div><small>${st === 'pending' ? 'Still loading from GDELT.' : 'This indicator failed to load'}, so the score is re-weighted over the others for now.</small></div>`;
        return `<div class="ind"><div class="row"><b>${esc(ind.label)}</b><small>weight ${ind.weight}</small></div>
          <div class="row"><span>${pct(p.mean)} of articles · adds <b>${p.contrib.toFixed(1)}</b></span>${trendTxt(p.t0, p.t1)}</div>
          <div class="row"><span class="bar" style="flex:1"><i style="width:${p.norm * 100}%;background:var(--toon)"></i></span>${spark(p.series, '#ffd43b')}</div>
          <small><a href="${esc(gdeltList(ind.query, name))}" target="_blank" rel="noopener">Articles behind this number</a> · <a href="${esc(gdeltChart(ind.query))}" target="_blank" rel="noopener">GDELT data</a></small></div>`;
      }).join('')}
      <div><h2 style="margin:6px 0 8px">Latest from ${esc(name)}'s press</h2><ul class="list" id="cnews" style="max-height:320px"><li class="muted">Loading…</li></ul></div>`;
    $('back').onclick = () => { selected = null; paint(); panelOverview(); };
    try {
      const r = await SEM.articles(ALLQ, state.win, name);
      if (selected !== name) return;
      $('cnews').innerHTML = r.articles.length ? r.articles.slice(0, 15).map(a => newsItem({ ...a, indicators: tag(a.title) })).join('') : '<li class="muted">No matching articles in this window.</li>';
    } catch (e) { if (selected === name) $('cnews').innerHTML = `<li class="muted">GDELT did not answer (${esc(e.message)}). <a href="${esc(gdeltList(ALLQ, name))}" target="_blank" rel="noopener">Open the search on GDELT</a>.</li>`; }
  }

  // ---------- ranking table ----------
  function table() {
    const okIds = DATA.indicators.filter(i => i.status === 'ok').map(i => i.id);
    const cols = [['rank', '#'], ['name', 'Country'], ['score', 'Score'], ...okIds.map(id => [id, IND(id).short]), ['trend', 'Trend']];
    const val = (c, k) => k === 'name' ? c.name : k === 'score' ? c.score : k === 'trend' ? c.trend : c.parts[k]?.mean ?? 0;
    const ranked = Object.values(SCORES).sort((a, b) => b.score - a.score); ranked.forEach((c, i) => c.rank = i + 1);
    const [k, dir] = state.sort;
    const rows = [...ranked].sort((a, b) => { const x = k === 'rank' ? a.rank : val(a, k), y = k === 'rank' ? b.rank : val(b, k); return (x > y ? 1 : x < y ? -1 : 0) * dir; });
    $('rank').innerHTML = `<thead><tr>${cols.map(([id, l]) => `<th data-k="${id}" class="${id === 'name' ? '' : 'n'}">${esc(l)}${id === k ? (dir > 0 ? ' ▲' : ' ▼') : ''}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(c => `<tr data-c="${esc(c.name)}"><td class="n">${c.rank}</td><td><i class="sw" style="background:${colorOf(c.score)}"></i>${esc(c.name)}</td><td class="n"><b>${c.score.toFixed(0)}</b></td>${okIds.map(id => `<td class="n">${pct(c.parts[id].mean)}</td>`).join('')}<td class="n">${c.trend >= 0 ? '+' : ''}${c.trend.toFixed(0)}</td></tr>`).join('')}</tbody>`;
    $('rank').querySelectorAll('th').forEach(th => th.onclick = () => { const id = th.dataset.k; state.sort = [id, state.sort[0] === id ? -state.sort[1] : (id === 'name' || id === 'rank' ? 1 : -1)]; table(); });
    $('rank').querySelectorAll('tbody tr').forEach(tr => tr.onclick = () => { select(tr.dataset.c); $('panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
    const unm = Object.keys(SCORES).filter(n => !matchFeature(n));
    $('unmapped').textContent = (unm.length ? `Scored but too small to draw at this map scale: ${unm.join(', ')}. ` : '') +
      (THIN.length ? `Too little coverage to score in this window (fewer than ${METHOD.minHits} time slots with matching articles): ${THIN.join(', ')}.` : '');
  }

  // ---------- feeds ----------
  const chips = ids => (ids || []).map(id => IND(id) ? `<span class="chip">${esc(IND(id).short)}</span>` : '').join('');
  const newsItem = a => `<li><a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.title)}</a><div class="meta"><span>${esc(a.domain || a.outlet || '')}</span>${a.country ? `<span>${esc(a.country)}</span>` : ''}${a.date ? `<span>${esc(ago(gdeltDate(a.date)))}</span>` : ''}${chips(a.indicators)}</div></li>`;
  const srcLine = (ok, name, text) => `<div><span class="dot ${ok === true ? 'live' : ok === 'off' ? '' : 'err'}"></span><span><b>${esc(name)}</b> ${text}</span></div>`;

  // phrase matcher shared by the news tags and the live post filter
  let PHRASES = [], ALLQ = '';
  const tag = text => [...new Set(PHRASES.filter(p => p.id && p.re.test(text || '')).map(p => p.id))];
  const matchTerm = text => { const p = PHRASES.find(p => p.re.test(text)); return p && p.phrase; };

  async function loadNews() {
    const [g, rss] = await Promise.all([
      SEM.articles(ALLQ, state.win).then(r => ({ ok: true, ...r }), e => ({ ok: false, error: e.message, articles: [] })),
      fetch('/api/news').then(r => r.json()).catch(e => ({ error: e.message, outlets: [] })),
    ]);
    const outlets = rss.outlets || [], okOut = outlets.filter(o => o.status === 'ok');
    $('news-src').innerHTML = srcLine(g.ok, 'GDELT', g.ok ? `${g.articles.length} latest matching articles worldwide · <a href="${esc(gdeltList(ALLQ))}" target="_blank" rel="noopener">query</a>` : `unavailable: ${esc(g.error)}`) +
      srcLine(okOut.length > 0, 'Newsroom RSS', outlets.length ? `${okOut.length}/${outlets.length} feeds read, ${okOut.reduce((a, o) => a + o.scanned, 0)} stories scanned for the tracked phrases <details style="display:inline"><summary style="display:inline;cursor:pointer;color:var(--toon)">feeds</summary>${outlets.map(o => `<div class="meta"><span class="dot ${o.status === 'ok' ? 'live' : 'err'}"></span><a href="${esc(o.url)}" target="_blank" rel="noopener">${esc(o.name)}</a> ${o.status === 'ok' ? `${o.items.length} match${o.items.length === 1 ? '' : 'es'}` : esc(o.error)}</div>`).join('')}</details>` : `unavailable: ${esc(rss.error || 'no feeds')}`);
    const items = [...okOut.flatMap(o => o.items.map(it => ({ ...it, outlet: o.name, country: o.country, sortDate: new Date(it.date).getTime() || 0 }))),
      ...g.articles.map(a => ({ ...a, indicators: tag(a.title), sortDate: new Date(gdeltDate(a.date)).getTime() || 0 }))].sort((a, b) => b.sortDate - a.sortDate);
    $('news').innerHTML = items.length ? items.slice(0, 80).map(newsItem).join('') : '<li class="muted">No matching stories right now.</li>';
    PULSE = g.articles.filter(a => Date.now() - new Date(gdeltDate(a.date)) < 48 * 3600e3);
    drawPulses();
  }

  // ---------- public posts ----------
  const POSTS = [], SOC = {};
  const postItem = p => `<li>${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.text)}</a>` : esc(p.text)}<div class="meta"><span>${esc(p.platform)}${p.community ? ` · ${esc(p.community)}` : ''}</span><span>${esc(ago(p.date))}</span>${p.term ? `<span class="chip">${esc(p.term)}</span>` : ''}${p.likes != null ? `<span>♥ ${p.likes}</span>` : ''}</div></li>`;
  function renderSocialSrc() {
    const line = (k, name) => { const s = SOC[k] || { ok: 'wait', text: 'loading…' }; return srcLine(s.ok, name, s.text); };
    $('social-src').innerHTML = line('bsky', 'Bluesky') + line('mastodon', 'Mastodon') + line('reddit', 'Reddit') +
      srcLine('off', 'X (Twitter)', 'not connected. X has no free read API, and scraping behind its login or through Nitter mirrors breaks its terms.') +
      srcLine('off', 'Instagram', "not connected. The only lawful route is Meta's Graph API, which needs a Business account and an approved Meta app.") +
      `<div class="muted" style="font-size:12px">Matching the tracked phrases (${PHRASES.map(p => `“${esc(p.phrase)}”`).join(', ')}). Usernames are left out on purpose; this feed tracks the conversation, not the people in it.</div>`;
  }
  function renderSocial() {
    renderSocialSrc();
    POSTS.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    POSTS.length = Math.min(POSTS.length, 150);
    $('social').innerHTML = POSTS.length ? POSTS.slice(0, 80).map(postItem).join('') : '<li class="muted">Waiting for matching posts…</li>';
  }
  const addPosts = list => { const have = new Set(POSTS.map(p => p.url)); for (const p of list) if (!have.has(p.url)) POSTS.push(p); renderSocial(); };
  async function loadSocial() {
    SEM.mastodon(METHOD.social.mastodonTags).then(list => { SOC.mastodon = { ok: true, text: `${list.length} recent posts from public hashtags (${METHOD.social.mastodonTags.map(t => '#' + esc(t)).join(' ')})` }; addPosts(list); },
      e => { SOC.mastodon = { ok: false, text: `unavailable: ${esc(e.message)}` }; renderSocial(); });
    // Reddit from the browser first; the server route only helps if the site owner added free Reddit API keys
    SEM.reddit(METHOD.social.redditTerms).catch(be => fetch('/api/social').then(r => r.json()).then(d => { if (d.status !== 'ok') throw new Error(d.status === 'not-configured' ? `Reddit refused this browser (${be.message}) and no free Reddit API keys are set up` : d.error); return d.posts; }))
      .then(list => { SOC.reddit = { ok: true, text: `${list.length} recent posts` }; addPosts(list); },
        e => { SOC.reddit = { ok: false, text: `unavailable: ${esc(e.message)}. See tracker/README.md to add the keys.` }; renderSocial(); });
  }
  let stream, statTick = 0;
  function startStream() {
    stream = SEM.jetstream(matchTerm, p => { addPosts([p]); }, st => {
      SOC.bsky = { ok: st.state === 'live' ? true : st.state === 'paused' ? 'off' : 'wait', text: `${st.state === 'live' ? 'live stream' : st.state} · ${st.seen.toLocaleString()} new posts scanned, ${st.hits} matched · <a href="#" id="bsky-toggle">${st.state === 'paused' ? 'resume' : 'pause'}</a>` };
      if (++statTick % 2 === 0 || st.state !== 'live') renderSocialSrc();
    });
    $('social-src').addEventListener('click', e => { if (e.target.id === 'bsky-toggle') { e.preventDefault(); stream.toggle(); } });
  }
  // ---------- methodology ----------
  function method() {
    $('lede').textContent = METHOD.summary;
    $('method').innerHTML = `<h2>Methodology · ${esc(METHOD.kind)} v${esc(METHOD.version)}</h2>
      <p style="margin:0">${esc(METHOD.summary)}</p>
      <p style="margin:0"><b>Source.</b> <a href="${esc(METHOD.source.url)}" target="_blank" rel="noopener">${esc(METHOD.source.name)}</a>, mode <code>${esc(METHOD.source.mode)}</code>. ${esc(METHOD.source.note)}</p>
      <div class="scroll" style="max-height:none"><table><thead><tr><th>Indicator</th><th class="n">Weight</th><th>GDELT query</th><th>Why it is here</th><th>Known bias</th></tr></thead><tbody>
      ${METHOD.indicators.map(i => { const st = DATA?.indicators.find(x => x.id === i.id); return `<tr><td><b>${esc(i.label)}</b>${st ? `<div class="meta"><span class="dot ${st.status === 'ok' ? 'live' : 'err'}"></span>${st.status === 'ok' ? `${Object.keys(st.countries).length} countries` : esc(st.error)}</div>` : ''}</td><td class="n">${i.weight}</td><td><code>${esc(i.query)}</code><div><a href="${esc(gdeltList(i.query))}" target="_blank" rel="noopener">articles</a> · <a href="${esc(gdeltChart(i.query))}" target="_blank" rel="noopener">by country</a></div></td><td>${esc(i.why)}</td><td>${esc(i.caveat)}</td></tr>`; }).join('')}
      </tbody></table></div>
      <p style="margin:0"><b>Scoring.</b></p><ol>${METHOD.scoring.map(s => `<li>${esc(s.replace(/^\d+\.\s*/, ''))}</li>`).join('')}</ol>
      <p style="margin:0"><b>Bands.</b> ${METHOD.bins.map(b => `${b.min}–${Math.min(100, b.max)} ${esc(b.label)}`).join(' · ')}. Countries with no data are hatched.</p>
      <p style="margin:0"><b>Limits.</b></p><ul>${METHOD.limits.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
      <p style="margin:0"><b>What is not tracked.</b> X and Instagram posts: neither has a free, lawful read API, and this site will not scrape them behind logins or through mirrors such as Nitter. Private individuals are never scored or named; the post feed drops usernames.</p>
      <p style="margin:0">Your browser reads GDELT directly; the "by country" links above return the exact data this page scores. Definitions: <a href="methodology.json"><code>methodology.json</code></a>.</p>`;
  }

  // ---------- load ----------
  const CACHE_MS = 15 * 60e3; // GDELT updates every 15 minutes
  const readCache = win => { try { const c = JSON.parse(localStorage.getItem(`sem-data-${win}`)); return c && Date.now() - new Date(c.generated) < CACHE_MS ? c : null; } catch (_) { return null; } };
  const writeCache = d => { try { localStorage.setItem(`sem-data-${d.window}`, JSON.stringify(d)); } catch (_) {} };

  function apply(data) {
    DATA = data;
    const { scores } = score(data);
    SCORES = scores;
    for (const f of FEATURES) f.__c = null;
    for (const c of Object.values(SCORES)) { const f = matchFeature(c.name); if (f) f.__c = c; }
    paint(); table(); method();
    selected && SCORES[selected] ? null : (!selected && panelOverview());
  }

  let loadId = 0;
  async function load() {
    clearTimeout(timer);
    const id = ++loadId, win = state.win;
    const cached = readCache(win);
    if (cached) {
      apply(cached);
      setStatus('live', `Live · GDELT data from ${esc(ago(cached.generated))} · refreshes every 15 min`);
      timer = setTimeout(load, CACHE_MS - (Date.now() - new Date(cached.generated)) + 1000);
      return;
    }
    const data = { generated: new Date().toISOString(), window: win, indicators: METHOD.indicators.map(i => ({ id: i.id, status: 'pending', countries: {} })) };
    for (const [n, ind] of METHOD.indicators.entries()) {
      setStatus('wait', `Reading GDELT live: indicator ${n + 1} of ${METHOD.indicators.length} (${esc(ind.short)}). GDELT allows one query every 5 seconds, so the map fills in over about 30 seconds.`);
      try { data.indicators[n] = await SEM.indicator(ind, win); }
      catch (e) { data.indicators[n] = { id: ind.id, status: 'error', error: e.message, url: e.url, countries: {} }; }
      if (id !== loadId) return; // window changed mid-load
      if (data.indicators.some(i => i.status === 'ok')) apply(data);
    }
    const ok = data.indicators.filter(i => i.status === 'ok').length;
    if (ok === data.indicators.length) writeCache(data);
    if (!ok) $('panel').innerHTML = '<h3>No data yet</h3><p class="muted">GDELT did not answer. Nothing is drawn until real data arrives; this page never shows placeholder numbers.</p>';
    setStatus(ok === data.indicators.length ? 'live' : ok ? 'wait' : 'err', ok ? `Live · GDELT data from just now · ${ok}/${data.indicators.length} indicators${ok < data.indicators.length ? ' (score re-weighted, retrying soon)' : ''} · refreshes every 15 min`
      : `GDELT is not answering right now (${esc(data.indicators[0].error)}). Retrying in 2 minutes.`);
    timer = setTimeout(load, ok === data.indicators.length ? CACHE_MS : 120e3);
  }

  async function init() {
    const [m, topo] = await Promise.all([fetch('methodology.json').then(r => r.json()), fetch('vendor/countries-110m.json').then(r => r.json())]);
    METHOD = m;
    FEATURES = topojson.feature(topo, topo.objects.countries).features.filter(f => f.properties.name !== 'Antarctica');
    projection = d3.geoNaturalEarth1(); path = d3.geoPath(projection);
    $('layer').innerHTML = '<option value="score">Composite score</option>' + METHOD.indicators.map(i => `<option value="${i.id}">${esc(i.label)}</option>`).join('');
    $('layer').value = state.layer in { score: 1 } || IND(state.layer) ? state.layer : 'score';
    $('win').value = state.win;
    $('regions').innerHTML = Object.keys(REGIONS).map(r => `<button aria-pressed="${r === region}">${esc(r)}</button>`).join('');
    $('regions').onclick = e => { const b = e.target.closest('button'); if (!b) return; region = b.textContent; $('regions').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); fit(); };
    $('layer').onchange = () => { state.layer = $('layer').value; save(); paint(); if (!selected && DATA) panelOverview(); };
    // every GDELT call queues in sources.js, so news simply runs after the map's queries
    $('win').onchange = () => { state.win = $('win').value; save(); selected = null; load().then(loadNews); };
    PHRASES = [...METHOD.indicators.flatMap(ind => [...ind.query.matchAll(/"([^"]+)"/g)].map(m => ({ id: ind.id, phrase: m[1] }))), ...METHOD.social.extraPhrases.map(p => ({ id: null, phrase: p }))]
      .filter((p, i, a) => a.findIndex(q => q.phrase === p.phrase) === i)
      .map(p => ({ ...p, re: new RegExp(`\\b${p.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[- ]/g, '[-\\s]?')}\\b`, 'i') }));
    ALLQ = `(${PHRASES.filter(p => p.id).map(p => `"${p.phrase}"`).join(' OR ')})`;
    method(); drawMap(); fit(); renderSocial();
    startStream(); loadSocial(); load().then(loadNews);
    setInterval(() => { loadNews(); loadSocial(); }, 10 * 60e3);
  }
  init().catch(e => setStatus('err', `Failed to start: ${esc(e.message)}`));
})();
