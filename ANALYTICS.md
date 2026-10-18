# Analytics

How the site counts visits: what is sent, when, and what GA4 makes of it. The code lives in
`src/utils/Analytics.tsx` (browser), `src/api/ituang.ts` (Gatsby Function), `src/utils/AnalyticsConfig.ts` and
`src/utils/TrackingExclude.ts` (shared settings).

## Overview

```
browser                         Vercel                              Google
───────                         ──────                              ──────
Analytics.tsx ──POST JSON──▶  /api/ituang ──Measurement Protocol──▶ GA4 property
 (page_view, scroll,           validates, adds location               │
  user_engagement)             and device, drops IP / UA / cookies    │
                                                                      ▼
gatsby build ◀──────────── GA4 Data API (scrolledUsers) ──────── most viewed sidebar
/api/trending ◀─────────── GA4 Data API (Search Console clicks) ─ trending sidebar
```

- No gtag, no Google script on the page, no cookies. The browser only talks to the site's own `/api/ituang`.
- Ad blockers (Brave Shields, uBlock Origin, Firefox strict mode) don't block it: the endpoint name avoids the words
  block lists match (`collect`, `track`, `analytics`, `hit`, `beacon`).
- Tracking runs only on the production origin (`siteConfig.url` in `config.ts`). On `localhost`, Vercel previews and
  the extra `gatsbyan-git-….vercel.app` URLs the client does nothing and the function answers 403.
- Without `ANALYTICS_MEASUREMENT_ID` / `ANALYTICS_API_SECRET` the function accepts events but doesn't forward them.

## Definitions

| Term | Meaning |
|---|---|
| **Client id** | Identifies one browser. `<random>.<unix seconds>`, the same format as gtag's `_ga` cookie. Stored in `localStorage` under `ituang`. GA4 counts **Users** as distinct client ids. |
| **Session id** | Unix seconds when the session started. A new one starts after 30 minutes without any event (`SESSION_TIMEOUT_MS`), like GA4's default session timeout. |
| **Engagement time** | Milliseconds the page was **visible** (tab in front, window not minimized). Hidden time never counts. Sent as `engagement_time_msec` on every event. |
| **Tracked page** | Any path not in `trackingExclude` (tag pages, `/page/n`, `/search`, `/archive`, `/404`). Excluded pages send nothing at all. |
| **Post** | A path starting with `/blog/`. Only posts send `scroll`. |
| **Leaving a page** | Navigating to another page on the site, or the tab becoming hidden: switching tabs, minimizing, locking the phone, closing the tab, reloading, following an external link. |

## Events

| Event | Sent when | Engagement time it carries | Feeds in GA4 |
|---|---|---|---|
| `page_view` | every route update to a tracked page | always 1 ms | Views, Users, Active users, page path and title, page referrer, country, device |
| `scroll` | once per post, on a scroll event, when the end of the article is within 300 px of the bottom of the screen | visible time since the page's last event | Scrolled users → most viewed sidebar |
| `user_engagement` | leaving a page, if at least 1 s of visible time has built up since the page's last event | that visible time | Average engagement time, User engagement |

GA4 credits engagement time to the page in the event's `page_location`. That is why the time spent on a page is sent
with that page's own `scroll` or `user_engagement`, and never with the next page's `page_view`.

### `page_view`

- Sent two animation frames after the route update, so `document.title` is already the new page's title.
- Referrer: the previous page on the site after client-side navigation, `document.referrer` on a full page load.
- Carries 1 ms of engagement. GA4 counts a user as active only with an engaged session, a first visit, or an event with
  `engagement_time_msec` above 0. Neither of the first two exists without gtag, so the 1 ms is what makes a one-page
  visitor count in **Active users**, the default "Users" in most reports.

### `scroll`: "finished the article"

```js
article.getBoundingClientRect().bottom <= window.innerHeight + ARTICLE_END_TOLERANCE_PX
```

- `getBoundingClientRect().bottom` is the distance from the top of the screen to the bottom edge of `.content-post`
  (the article body). It shrinks as the reader scrolls down and turns negative once the end has scrolled off the top.
- `window.innerHeight` is the screen height, so the bottom of the screen in the same coordinates.
- With `ARTICLE_END_TOLERANCE_PX = 300`, the event fires when the end of the article is at most 300 px below the
  screen, roughly the last paragraph or two. Readers who skip the closing lines still count.
- Measured fresh on every check, so lazy images that load and push the end down are handled. The comments below the
  article don't change `.content-post`, so they never move the threshold.
- Checked at most once per animation frame, only on posts, and the listener stops checking once the event was sent.
- Only from a scroll event: a post that fits on the screen without scrolling sends no `scroll`.
- Keeps the name `scroll` and `percent_scrolled: 90`, so `scrolledUsers` and the most viewed history continue. Before
  this change gtag sent it at 90% of the whole page including comments; from the deploy on it means the end of the
  article.

### `user_engagement`

gtag sends a `user_engagement` every time a reader leaves a page, with the time spent there. This client does the
same, with one difference: **it skips anything under 1 s** (`MIN_ENGAGEMENT_MS`).

The minimum is mainly a noise filter. It drops the events that carry almost nothing: bounces under a second, a quick
alt-tab back and forth, a tab switch right after `scroll`, clicking straight through a page. Real reading time is
usually tens of seconds, so almost every leave still sends its `user_engagement`, and the minimum saves only a few
function calls. A higher value wouldn't save much more but would lose real data: short visits would drop out of
average engagement time and inflate it, and time under the minimum is lost on navigation or when a hidden tab is
closed.

What happens to time under 1 s:

- **Tab hidden:** nothing is sent and the time is kept. If the reader comes back, the next visible time is added to
  it, and it goes out once the total reaches 1 s.
- **Navigation to another page:** nothing is sent and the time is dropped, because the next time belongs to the new
  page. At most just under a second is lost per page.

No title or referrer: GA4 only needs the page path to credit the time.

### Engagement time cap

One event carries at most 1 hour of engagement time (`MAX_ENGAGEMENT_MS`). It does two jobs:

- **Function: spam guard.** `/api/ituang` is public. Without a cap, one forged event with an engagement time of
  years would wreck Average engagement time for a page. The function answers anything over 1 hour with 400, so a
  forged event adds at most an hour.
- **Client: abandoned tabs.** The client counts visible time, not active time: there is no idle detection. A post
  left open in a front tab with the screen on keeps counting while nobody reads it. The client clamps such a value to
  1 hour, drops the rest, and still sends a valid event.

The cap is rarely reached. The counter resets on every event, so one event covers a single uninterrupted visible
stretch on one page, and real reading rarely gets near an hour. Hitting it almost always means an abandoned tab.

1 hour is a judgment call, not a GA4 limit. A higher value is pointless. A lower one, such as 30 minutes, clips
abandoned tabs harder and only shortchanges someone working through a long tutorial in one stretch. If Average
engagement time in GA4 looks implausibly high after rollout, lower the cap, or add idle detection: stop counting
after 1–2 minutes without scroll, key or pointer input.

## Ids and privacy

- **Normal visitors:** client id and session id live in `localStorage` under `ituang`. Nothing else is stored, no
  cookies are set.
- **Global Privacy Control** (Brave's default): ids are kept in memory only, so they are new on every full page load
  (client-side navigation keeps them). GA4 can't link these visits; a reader who finishes the same post on two visits
  counts twice.
- **Storage blocked or broken:** same as GPC, ids in memory per page load.
- **Returning gtag visitors:** when nothing is stored yet and GPC is off, the id from an old `_ga` cookie
  (`GA1.1.<client id>`) is reused, so they stay one user. The `_ga` and `_ga_*` cookies are then expired. A malformed
  cookie gets a new id.
- **The function** never forwards the IP address, cookies or user agent:
  - country, region and city come from Vercel's `x-vercel-ip-*` headers (Vercel looks up the IP at its edge);
  - device category (mobile, tablet, desktop) is derived from the user agent on the server;
  - language and screen size are sent by the client.

## Validation in the function

An event is forwarded only when all of these hold, otherwise the function answers with an error and sends nothing:

| Check | Limit |
|---|---|
| Method | `POST` (405 otherwise) |
| `Origin` header | exactly the production site (403 otherwise) |
| Body size | 1 KB (`MAX_BODY_BYTES`, 413 otherwise) |
| Event name | `page_view`, `scroll` or `user_engagement` (`ANALYTICS_EVENTS`) |
| Path | starts with `/`, no query, hash or whitespace, at most 200 characters, not in `trackingExclude` |
| Title, referrer, city | at most 100 characters; referrer must be an `http(s)` URL |
| Client id, session id | the formats above |
| Engagement time | whole number from 1 ms to 1 hour (`MAX_ENGAGEMENT_MS`) |
| Language, screen | e.g. `id-ID`, `390x844` |

No rate limiting: functions are stateless, and it would need Vercel KV.

## Examples

### Reading one post, then another

| Time | Reader does | Sent |
|---|---|---|
| 0 s | opens `/blog/a` from Google | `page_view /blog/a`, 1 ms, referrer `https://www.google.com/` |
| 40 s | scrolls near the end of the article | `scroll /blog/a`, 40 000 ms |
| 55 s | switches to another tab | `user_engagement /blog/a`, 15 000 ms |
| 5 min | comes back | nothing, the 4 min 5 s hidden don't count |
| 5 min 20 s | clicks a link to `/blog/b` | `user_engagement /blog/a`, 20 000 ms, then `page_view /blog/b`, 1 ms, referrer `https://ferry.vercel.app/blog/a` |
| 5 min 20.5 s | closes the tab | nothing, only 0.5 s on `/blog/b` |

GA4 adds up 40 + 15 + 20 = 75 s of engagement for `/blog/a`, one view each for `/blog/a` and `/blog/b`, and one
scrolled user for `/blog/a`.

### Quick tab switches

| Time | Reader does | Sent |
|---|---|---|
| 0 s | opens `/blog/a` | `page_view`, 1 ms |
| 0.6 s | switches tab | nothing, 0.6 s is under 1 s and is kept |
| 3 min | comes back | nothing |
| 3 min 0.6 s | clicks to `/blog/b` | `user_engagement /blog/a`, 1 200 ms (0.6 + 0.6), then `page_view /blog/b` |

### Bouncing off a post

| Time | Reader does | Sent |
|---|---|---|
| 0 s | opens `/blog/a` | `page_view`, 1 ms |
| 0.8 s | clicks to `/` | nothing for `/blog/a`, then `page_view /` |

The view and the user still count; only the 0.8 s are dropped.

### Short post that fits on the screen

The reader opens it, reads it without scrolling and leaves after 30 s: `page_view`, then `user_engagement` with
30 000 ms. No `scroll`, so it doesn't count toward most viewed.

### Through a tag page

`/blog/a` (10 s) → `/tags/java` (5 s) → `/blog/b`:

- leaving `/blog/a`: `user_engagement /blog/a`, 10 000 ms
- `/tags/java` is excluded: no `page_view`, no engagement, its 5 s are dropped
- `page_view /blog/b`, referrer `https://ferry.vercel.app/tags/java`

### Brave with Global Privacy Control

Opens `/blog/a`, clicks to `/blog/b`, reloads: the first two page views share one client id, the reload gets a new
one. GA4 sees two users. `localStorage` stays empty.

### Returning gtag visitor

The browser still has `_ga=GA1.1.123456789.1792277505` from before gtag was removed. On the first event the client
reuses `123456789.1792277505`, stores it under `ituang` and expires `_ga` and `_ga_*`. GA4 keeps counting them as the
same user.

## What GA4 shows

| Works | Unreliable or gone |
|---|---|
| Views, Total users, Active users, Views per user | Sessions, New users, Engaged sessions, Engagement rate (no `session_start` / `first_visit`) |
| Scrolled users, Event count, Realtime | Session source / medium, Acquisition reports (GA4 attributes source from gtag's session start) |
| Average engagement time, User engagement | Browser and OS (would need a user agent parser) |
| Page path, page title, page referrer | Demographics (need Google Signals cookies) |
| Country, region, city, device category, language, screen resolution | Outbound clicks, file downloads, site search, form interactions (gtag enhanced measurement) |

GA4's own engagement settings (Admin → Data streams → Configure tag settings) are the engaged-session timer (default
10 s) and the session timeout (default 30 min). The first doesn't apply without `session_start`; the second matches
`SESSION_TIMEOUT_MS`. Enhanced measurement in the same place only affects gtag and has no effect here.

`/api/trending` reads Search Console data through the GA4 link and doesn't depend on these events.

## Cost

Per page view, in function calls:

- 1 for `page_view`
- 1 for `scroll`, posts only, if the reader reaches the end
- 1 for `user_engagement` on leaving, if 1 s or more was spent
- 1 more for each tab hide of 1 s or more of new visible time

So about 2 to 4 calls per post read, 1 to 2 for a bounce.

`MIN_ENGAGEMENT_MS` barely changes these numbers. If cost ever matters, the bigger saving is batching: a route change
sends `user_engagement` for the old page and `page_view` for the new one as two requests, while the Measurement
Protocol accepts up to 25 events per request. Sending both in one POST would save about one call per navigation
without losing data, at the price of the function accepting a list of events.

## Settings

| Constant | File | Value | Effect |
|---|---|---|---|
| `ARTICLE_END_TOLERANCE_PX` | `Analytics.tsx` | 300 | how far before the end of the article `scroll` fires |
| `MIN_ENGAGEMENT_MS` | `Analytics.tsx` | 1000 | smallest `user_engagement` sent; filters sub-second noise, a higher value loses short visits for few saved calls |
| `SESSION_TIMEOUT_MS` | `Analytics.tsx` | 30 min | idle time before a new session id |
| `MAX_ENGAGEMENT_MS` | `AnalyticsConfig.ts` | 1 h | largest engagement time per event |
| `trackingExclude` | `AnalyticsConfig.ts` | globs | paths that send nothing; also the sitemap's excludes |
| `ANALYTICS_EVENTS` | `AnalyticsConfig.ts` | 3 names | events the function accepts; a new event also needs client code |
