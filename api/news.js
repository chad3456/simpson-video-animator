// GET /api/news?window=7d&country=United%20Kingdom
// Latest matching articles from GDELT (optionally one source country) plus keyword matches
// from the public RSS feeds of established newsrooms.
const { METHOD, TIMESPANS, gdelt, getText, cached, send, query } = require('./_lib');

const OUTLETS = [
  { name: 'BBC News (World)', country: 'United Kingdom', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
  { name: 'BBC News (UK)', country: 'United Kingdom', url: 'https://feeds.bbci.co.uk/news/uk/rss.xml' },
  { name: 'The Guardian (World)', country: 'United Kingdom', url: 'https://www.theguardian.com/world/rss' },
  { name: 'NPR News', country: 'United States', url: 'https://feeds.npr.org/1001/rss.xml' },
  { name: 'CBC News (World)', country: 'Canada', url: 'https://www.cbc.ca/webfeed/rss/rss-world' },
  { name: 'France 24 (English)', country: 'France', url: 'https://www.france24.com/en/rss' },
  { name: 'DW (English)', country: 'Germany', url: 'https://rss.dw.com/rdf/rss-en-all' },
  { name: 'Al Jazeera English', country: 'Qatar', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
  { name: 'The Hindu (National)', country: 'India', url: 'https://www.thehindu.com/news/national/feeder/default.rss' },
  { name: 'Times of India (Top stories)', country: 'India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms' },
  { name: 'ABC News Australia', country: 'Australia', url: 'https://www.abc.net.au/news/feed/51120/rss.xml' },
];

// every quoted phrase in the methodology, tagged with its indicator
const PHRASES = METHOD.indicators.flatMap(ind => [...ind.query.matchAll(/"([^"]+)"/g)].map(m => ({ id: ind.id, re: new RegExp(`\\b${m[1].replace(/[-]/g, '[- ]?')}`, 'i'), phrase: m[1] })));
const tag = text => [...new Set(PHRASES.filter(p => p.re.test(text)).map(p => p.id))];
const ALL = `(${PHRASES.map(p => `"${p.phrase}"`).join(' OR ')})`;

const decode = s => String(s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ')
  .replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (_, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ' }[e]))
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/\s+/g, ' ').trim();
const field = (xml, name) => decode((xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i')) || [])[1]);

function parseFeed(xml) {
  return [...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)].map(([it]) => ({
    title: field(it, 'title'), url: field(it, 'link') || field(it, 'guid'),
    date: field(it, 'pubDate') || field(it, 'dc:date'), summary: field(it, 'description').slice(0, 280),
  }));
}

async function outlet(o) {
  try {
    const items = parseFeed(await getText(o.url));
    const hits = items.map(it => ({ ...it, indicators: tag(`${it.title} ${it.summary}`) })).filter(it => it.indicators.length);
    return { ...o, status: 'ok', scanned: items.length, items: hits };
  } catch (e) { return { ...o, status: 'error', error: e.message, scanned: 0, items: [] }; }
}

const slug = c => c.toLowerCase().replace(/[^a-z]/g, '');

module.exports = async (req, res) => {
  const q = query(req), win = q.get('window') || '7d', country = (q.get('country') || '').slice(0, 60);
  if (!TIMESPANS[win]) return send(res, 400, { error: 'bad window' });
  const body = await cached(`news:${win}:${country}`, 5 * 60e3, async () => {
    const gq = country ? `${ALL} sourcecountry:${slug(country)}` : ALL;
    const [g, outlets] = await Promise.all([
      gdelt({ query: gq, mode: 'artlist', maxrecords: '75', sort: 'datedesc', timespan: TIMESPANS[win] })
        .then(({ url, data }) => ({ status: 'ok', url, articles: (data.articles || []).map(a => ({
          title: a.title, url: a.url, domain: a.domain, country: a.sourcecountry, language: a.language, date: a.seendate, indicators: tag(a.title),
        })) }))
        .catch(e => ({ status: 'error', error: e.message, url: e.url, articles: [] })),
      country ? Promise.resolve([]) : Promise.all(OUTLETS.map(outlet)),
    ]);
    return { generated: new Date().toISOString(), window: win, country: country || null, gdelt: g, outlets };
  }, b => b.gdelt.status === 'ok');
  send(res, 200, body, body.gdelt.status === 'ok' ? 600 : 60);
};

module.exports.parseFeed = parseFeed;
module.exports.tag = tag;
