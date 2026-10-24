// GET /api/social
// Recent public posts that use the tracked terms, from platforms with an open or free official API.
// Authors are dropped on purpose: the feed tracks the conversation, not the people in it.
const { UA, cached, send } = require('./_lib');

const TERMS = ['suicidal empathy', 'luxury beliefs', 'red-green alliance', 'islamo-leftism'];
const env = k => process.env[k] || '';

async function json(url, opts = {}) {
  const r = await fetch(url, { ...opts, headers: { 'user-agent': UA, ...(opts.headers || {}) }, signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}${r.status === 403 || r.status === 401 ? ' (needs credentials, see tracker/README.md)' : ''}`);
  return r.json();
}

// Bluesky: public AppView, or an app password if one is configured (free, allowed by Bluesky's terms)
async function bluesky() {
  let base = 'https://public.api.bsky.app', headers = {};
  if (env('BSKY_IDENTIFIER') && env('BSKY_APP_PASSWORD')) {
    const s = await json('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ identifier: env('BSKY_IDENTIFIER'), password: env('BSKY_APP_PASSWORD') }),
    });
    base = 'https://bsky.social'; headers = { authorization: `Bearer ${s.accessJwt}` };
  }
  const lists = await Promise.all(TERMS.map(t => json(`${base}/xrpc/app.bsky.feed.searchPosts?q=${encodeURIComponent(`"${t}"`)}&sort=latest&limit=25`, { headers })
    .then(d => (d.posts || []).map(p => ({ p, term: t })))));
  const seen = new Set();
  return lists.flat().filter(({ p }) => !seen.has(p.uri) && seen.add(p.uri)).map(({ p, term }) => {
    const [did, , rkey] = String(p.uri).replace('at://', '').split('/');
    return {
      platform: 'Bluesky', term, text: String(p.record?.text || '').slice(0, 320), date: p.record?.createdAt || p.indexedAt,
      lang: (p.record?.langs || [])[0] || null, likes: p.likeCount || 0, reposts: p.repostCount || 0,
      url: did && rkey ? `https://bsky.app/profile/${did}/post/${rkey}` : null,
    };
  });
}

// Reddit: app-only OAuth if configured (free for non-commercial use), else the public JSON endpoint
async function reddit() {
  const q = encodeURIComponent(TERMS.map(t => `"${t}"`).join(' OR '));
  let url = `https://www.reddit.com/search.json?q=${q}&sort=new&t=month&limit=40&raw_json=1`, headers = {};
  if (env('REDDIT_CLIENT_ID') && env('REDDIT_CLIENT_SECRET')) {
    const tok = await json('https://www.reddit.com/api/v1/access_token', {
      method: 'POST', body: 'grant_type=client_credentials',
      headers: { 'content-type': 'application/x-www-form-urlencoded', authorization: 'Basic ' + Buffer.from(`${env('REDDIT_CLIENT_ID')}:${env('REDDIT_CLIENT_SECRET')}`).toString('base64') },
    });
    url = url.replace('https://www.reddit.com/search.json', 'https://oauth.reddit.com/search'); headers = { authorization: `Bearer ${tok.access_token}` };
  }
  const d = await json(url, { headers });
  return (d.data?.children || []).map(c => c.data).filter(p => !p.over_18).map(p => ({
    platform: 'Reddit', term: TERMS.find(t => `${p.title} ${p.selftext}`.toLowerCase().replace(/-/g, ' ').includes(t.replace(/-/g, ' '))) || null,
    text: p.title, community: `r/${p.subreddit}`, date: new Date(p.created_utc * 1000).toISOString(),
    likes: p.score || 0, comments: p.num_comments || 0, url: `https://www.reddit.com${p.permalink}`,
  }));
}

const run = async (name, fn) => { try { const posts = await fn(); return { name, status: 'ok', posts }; } catch (e) { return { name, status: 'error', error: e.message, posts: [] }; } };

module.exports = async (req, res) => {
  const body = await cached('social', 3 * 60e3, async () => {
    const platforms = await Promise.all([run('Bluesky', bluesky), run('Reddit', reddit)]);
    platforms.push({ name: 'X (Twitter)', status: 'not-connected', error: 'X has no free read API. Reading it without one means scraping behind a login or through mirrors such as Nitter, which breaks its terms, so this tracker does not.', posts: [] });
    platforms.push({ name: 'Instagram', status: 'not-connected', error: "Instagram's only lawful route is Meta's Graph API hashtag search, which needs a Business account and an approved Meta app. Not connected.", posts: [] });
    const posts = platforms.flatMap(p => p.posts).sort((a, b) => String(b.date).localeCompare(String(a.date)));
    return { generated: new Date().toISOString(), terms: TERMS, platforms: platforms.map(({ posts, ...p }) => ({ ...p, count: posts.length })), posts };
  }, b => b.posts.length > 0);
  send(res, 200, body, body.posts.length ? 300 : 60);
};
