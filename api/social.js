// GET /api/social
// Reddit search through Reddit's free app-only OAuth, for when Reddit blocks the visitor's browser.
// Only active once REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET are set in Vercel (see tracker/README.md).
// Authors are dropped on purpose: the feed tracks the conversation, not the people in it.
const { METHOD, UA, cached, send } = require('./_lib');

async function json(url, opts = {}) {
  const r = await fetch(url, { ...opts, headers: { 'user-agent': UA, ...(opts.headers || {}) }, signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function reddit(id, secret) {
  const tok = await json('https://www.reddit.com/api/v1/access_token', {
    method: 'POST', body: 'grant_type=client_credentials',
    headers: { 'content-type': 'application/x-www-form-urlencoded', authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64') },
  });
  const q = encodeURIComponent(METHOD.social.redditTerms.map(t => `"${t}"`).join(' OR '));
  const d = await json(`https://oauth.reddit.com/search?q=${q}&sort=new&t=month&limit=40&raw_json=1`, { headers: { authorization: `Bearer ${tok.access_token}` } });
  return (d.data?.children || []).map(c => c.data).filter(p => !p.over_18).map(p => ({
    platform: 'Reddit', text: p.title, community: `r/${p.subreddit}`, date: new Date(p.created_utc * 1000).toISOString(),
    likes: p.score || 0, url: `https://www.reddit.com${p.permalink}`,
  }));
}

module.exports = async (req, res) => {
  const id = process.env.REDDIT_CLIENT_ID, secret = process.env.REDDIT_CLIENT_SECRET;
  if (!id || !secret) return send(res, 200, { status: 'not-configured', error: 'no Reddit API keys on the server', posts: [] }, 300);
  const body = await cached('reddit', 3 * 60e3, () => reddit(id, secret).then(posts => ({ status: 'ok', posts }), e => ({ status: 'error', error: e.message, posts: [] })), b => b.status === 'ok');
  send(res, 200, body, body.status === 'ok' ? 300 : 60);
};
