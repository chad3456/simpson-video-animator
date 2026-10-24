// Live sources the visitor's browser reads directly. GDELT answers with CORS "*", Bluesky's Jetstream
// and Mastodon are open, so nothing here depends on a shared cloud IP that upstreams may block.
window.SEM = (() => {
  const GDELT = 'https://api.gdeltproject.org/api/v2/doc/doc';
  const SPAN = { '24h': '24h', '7d': '7d', '30d': '30d', '90d': '3months' };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const timeout = ms => (AbortSignal.timeout ? AbortSignal.timeout(ms) : undefined);

  // GDELT asks for at most one request every 5 seconds, so every call from this page queues here.
  let gate = Promise.resolve(), last = 0;
  function gdelt(params) {
    const u = new URL(GDELT);
    for (const [k, v] of Object.entries({ format: 'json', ...params })) u.searchParams.set(k, v);
    const run = async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const wait = last + 5300 - Date.now();
        if (wait > 0) await sleep(wait);
        last = Date.now();
        const r = await fetch(u, { signal: timeout(45000) });
        const text = await r.text();
        try { return { url: u.toString(), data: text.trim() ? JSON.parse(text) : {} }; } catch (_) {}
        const msg = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200) || `HTTP ${r.status}`;
        if (!/limit requests|one every/i.test(msg)) throw Object.assign(new Error(msg), { url: u.toString() });
        await sleep(6000);
      }
      throw Object.assign(new Error('GDELT is rate-limiting this browser, try again in a minute'), { url: u.toString() });
    };
    const p = gate.then(run, run);
    gate = p.catch(() => {});
    return p;
  }

  // average neighbouring points so long windows stay small enough to cache
  const shrink = (a, n) => a.length <= n ? a : Array.from({ length: n }, (_, i) => {
    const s = a.slice(Math.floor(i * a.length / n), Math.floor((i + 1) * a.length / n));
    return s.reduce((x, y) => x + y, 0) / s.length;
  });

  async function indicator(ind, win) {
    const { url, data } = await gdelt({ query: ind.query, mode: 'timelinesourcecountry', timespan: SPAN[win] });
    const countries = {};
    for (const s of data.timeline || []) {
      const name = String(s.series || '').replace(/\s*volume intensity\s*$/i, '').trim();
      const vals = (s.data || []).map(p => Number(p.value) || 0);
      if (!name || !vals.length) continue;
      countries[name] = { mean: vals.reduce((a, v) => a + v, 0) / vals.length, hits: vals.filter(v => v > 0).length, series: shrink(vals, 48) };
    }
    return { id: ind.id, status: 'ok', url, countries };
  }

  async function articles(query, win, country) {
    const q = country ? `${query} sourcecountry:${country.toLowerCase().replace(/[^a-z]/g, '')}` : query;
    const { url, data } = await gdelt({ query: q, mode: 'artlist', maxrecords: '75', sort: 'datedesc', timespan: SPAN[win] });
    return { url, articles: (data.articles || []).map(a => ({ title: a.title, url: a.url, domain: a.domain, country: a.sourcecountry, date: a.seendate })) };
  }

  // Bluesky's Jetstream: the public, no-login JSON stream of every new post. Filtered here, in the browser.
  function jetstream(match, onPost, onStat) {
    const hosts = ['jetstream2.us-east.bsky.network', 'jetstream1.us-east.bsky.network', 'jetstream1.us-west.bsky.network', 'jetstream2.us-west.bsky.network'];
    let ws, i = 0, seen = 0, hits = 0, paused = false, retry;
    const open = () => {
      if (paused) return;
      const host = hosts[i++ % hosts.length];
      ws = new WebSocket(`wss://${host}/subscribe?wantedCollections=app.bsky.feed.post`);
      ws.onmessage = e => {
        seen++;
        let m; try { m = JSON.parse(e.data); } catch (_) { return; }
        const c = m.commit, text = c?.record?.text;
        if (c?.operation !== 'create' || !text) return;
        const term = match(text);
        if (!term) return;
        hits++;
        onPost({ platform: 'Bluesky', term, text: text.slice(0, 320), date: c.record.createdAt, lang: (c.record.langs || [])[0], url: `https://bsky.app/profile/${m.did}/post/${c.rkey}` });
      };
      ws.onclose = () => { if (!paused) retry = setTimeout(open, 3000); };
    };
    open();
    setInterval(() => onStat({ state: paused ? 'paused' : ws?.readyState === 1 ? 'live' : 'connecting', seen, hits }), 1000);
    return { toggle() { paused = !paused; if (paused) { clearTimeout(retry); ws?.close(); } else open(); return paused; } };
  }

  // Mastodon public hashtag timelines (no login on mastodon.social)
  async function mastodon(tags) {
    const lists = await Promise.all(tags.map(t => fetch(`https://mastodon.social/api/v1/timelines/tag/${encodeURIComponent(t)}?limit=20`, { signal: timeout(15000) })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(a => a.map(p => ({ p, t })))));
    const seen = new Set(), dom = new DOMParser();
    return lists.flat().filter(({ p }) => !p.sensitive && !seen.has(p.url) && seen.add(p.url)).map(({ p, t }) => ({
      platform: 'Mastodon', term: `#${t}`, text: (dom.parseFromString(p.content || '', 'text/html').body.textContent || '').slice(0, 320),
      date: p.created_at, lang: p.language, likes: p.favourites_count || 0, url: p.url,
    }));
  }

  // Reddit's public search JSON, straight from the browser
  async function reddit(terms) {
    const q = encodeURIComponent(terms.map(t => `"${t}"`).join(' OR '));
    const r = await fetch(`https://www.reddit.com/search.json?q=${q}&sort=new&t=month&limit=40&raw_json=1`, { signal: timeout(15000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    return (d.data?.children || []).map(c => c.data).filter(p => !p.over_18).map(p => ({
      platform: 'Reddit', text: p.title, community: `r/${p.subreddit}`, date: new Date(p.created_utc * 1000).toISOString(),
      likes: p.score || 0, url: `https://www.reddit.com${p.permalink}`,
    }));
  }

  return { SPAN, gdelt, indicator, articles, jetstream, mastodon, reddit };
})();
