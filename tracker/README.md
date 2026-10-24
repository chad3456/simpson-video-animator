# Suicidal Empathy Meter

A live world map at `/tracker/` that colours each country by how intensely its own news media covers five debates that Gad Saad groups under "suicidal empathy". It is an editorial index of coverage, not a measurement of what people believe. Indicators, weights, caveats and scoring live in `methodology.json` and are rendered on the page.

## How it works

- `tracker/sources.js` runs in the visitor's browser. It reads GDELT DOC 2.0 directly (GDELT sends `Access-Control-Allow-Origin: *`), one `timelinesourcecountry` query per indicator, 5 seconds apart as GDELT asks. The map fills in as each indicator arrives and is cached in the browser for 15 minutes. Reading GDELT from the browser avoids the shared cloud IPs that GDELT, Bluesky and Reddit often block.
- `tracker/app.js` scores countries exactly as `methodology.json` describes, draws the map (d3-geo, topojson-client and Natural Earth `world-atlas`, all vendored in `vendor/`), and links every number to the GDELT article list behind it.
- Live public posts, all without logins: Bluesky's open Jetstream feed of every new post (filtered in the browser for the tracked phrases), Mastodon public hashtag timelines, and Reddit's public search.
- `api/news.js` reads the public RSS feeds of established newsrooms (BBC, Guardian, NPR, CBC, France 24, DW, Al Jazeera, The Hindu, Times of India, ABC Australia), which do not allow browser reads.
- `api/social.js` is a Reddit backup that only works once free Reddit API keys are added.

Nothing on the page is placeholder data. If a source fails, the page says so; countries without data are hatched, never shown as zero.

## Optional: Reddit keys (only if the page says Reddit is unavailable)

Reddit sometimes refuses browser requests. To use Reddit's free API instead:

1. Sign in to Reddit, open https://www.reddit.com/prefs/apps and click "create another app".
2. Pick "script", give it any name, and set the redirect URI to `http://localhost`. Create it.
3. Copy the code under the app name (the client ID) and the "secret".
4. In Vercel, open the project, then Settings, Environment Variables. Add `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` with those values, then redeploy.

Everything else needs no keys.

## What is not sourced, and why

- **X (Twitter):** no free read API. The paid API (Basic tier) could be added later. Scraping behind a login, fake accounts or Nitter mirrors break X's terms, so the tracker does not do it.
- **Instagram:** the only lawful route is Meta's Graph API hashtag search, which needs a Business account and an approved Meta app.

## Run locally

`npx vercel dev` from the repo root, then open `http://localhost:3000/tracker/`. A plain static server shows the map but no data, because the data comes from the `/api` functions.
