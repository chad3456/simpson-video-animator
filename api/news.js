// GET /api/news
// Keyword matches from the public RSS feeds of established newsrooms. Feeds do not send CORS headers,
// so they are read here; GDELT is read by the browser directly (tracker/sources.js).
const { METHOD, getText, cached, send } = require('./_lib');

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

module.exports = async (req, res) => {
  const body = await cached('news', 5 * 60e3, async () => ({ generated: new Date().toISOString(), outlets: await Promise.all(OUTLETS.map(outlet)) }),
    b => b.outlets.some(o => o.status === 'ok'));
  send(res, 200, body, body.outlets.some(o => o.status === 'ok') ? 600 : 60);
};

module.exports.parseFeed = parseFeed;
module.exports.tag = tag;
