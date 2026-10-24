# Suicidal Empathy Meter

A live world map at `/tracker/` that colours each country by how intensely its own news media covers five debates that Gad Saad groups under "suicidal empathy". It is an editorial index of coverage, not a measurement of what people believe. Indicators, weights, caveats and scoring live in `methodology.json` and are rendered on the page.

## How it works

- `api/tracker.js` runs one GDELT DOC 2.0 `timelinesourcecountry` query per indicator (5 queries, 5 seconds apart, as GDELT asks) and returns each country's volume intensity. Vercel's CDN caches the result for 15 minutes, so only the first visitor of a window waits about 30 seconds.
- `tracker/app.js` scores countries in the browser exactly as `methodology.json` describes, draws the map (d3-geo, topojson-client and Natural Earth `world-atlas`, all vendored in `vendor/`), and links every number to the GDELT article list behind it.
- `api/news.js` lists the latest matching articles from GDELT and keyword matches from the public RSS feeds of established newsrooms (BBC, Guardian, NPR, CBC, France 24, DW, Al Jazeera, The Hindu, Times of India, ABC Australia).
- `api/social.js` lists recent public posts that use the tracked terms from Bluesky and Reddit, with usernames removed.

Nothing on the page is placeholder data. If a source fails, the page says so; countries without data are hatched, never shown as zero.

## Optional credentials (Vercel project settings, Environment Variables)

| Variable | What it unlocks | How to get it (free) |
| --- | --- | --- |
| `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET` | Reddit search. Reddit often blocks unauthenticated requests from cloud servers. | reddit.com/prefs/apps, create a "script" app. Non-commercial use is free under Reddit's Data API terms. |
| `BSKY_IDENTIFIER`, `BSKY_APP_PASSWORD` | Bluesky search, if the public endpoint refuses anonymous search. | Bluesky Settings, Privacy and security, App passwords. Use a dedicated account. |

## What is not sourced, and why

- **X (Twitter):** no free read API. The paid API (Basic tier) could be added later. Scraping behind a login, fake accounts or Nitter mirrors break X's terms, so the tracker does not do it.
- **Instagram:** the only lawful route is Meta's Graph API hashtag search, which needs a Business account and an approved Meta app.

## Run locally

`npx vercel dev` from the repo root, then open `http://localhost:3000/tracker/`. A plain static server shows the map but no data, because the data comes from the `/api` functions.
