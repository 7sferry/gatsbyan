# gatsbyan [![Website](https://img.shields.io/website?down_color=lightgrey&down_message=offline&style=plastic&up_color=green&up_message=online&url=https%3A%2F%2Fferry.vercel.app%2F)](https://ferry.vercel.app/) ![GitHub top language](https://img.shields.io/github/languages/top/7sferry/gatsbyan?style=plastic) ![GitHub](https://img.shields.io/github/license/7sferry/gatsbyan?style=plastic) [![Test](https://github.com/7sferry/gatsbyan/actions/workflows/test.yml/badge.svg)](https://github.com/7sferry/gatsbyan/actions/workflows/test.yml)

The Gatsby template I use in production for my personal blog at https://ferry.vercel.app

![](https://github.com/7sferry/Gatsbyan1.0/blob/master/static/example.png?raw=true)

## Features

- Blog posts written in Markdown on Contentful CMS, with Prism syntax highlighting, code titles, copy buttons, table captions, heading anchors and click-to-zoom images
- Paginated home page (10 posts per page) and paginated tag pages at `/tags/{tag}`
- Archive by date at `/archive`
- Full-text search at `/search` with Algolia, including voice search and highlighted typo matches
- Comments with [utterances](https://utteranc.es) (GitHub issues)
- Sidebar with featured posts, most viewed posts and top searched posts from Google Analytics
- Value averaging calculator at `/features/value-averaging-calculator`
- SEO through the Gatsby Head API, sitemap and structured metadata
- PWA with offline support and a web manifest
- Unused CSS removed at build time with PurgeCSS

## Tech Stack

- [Gatsby 5](https://www.gatsbyjs.com) with Gatsby Slices and Gatsby Functions
- React 19 and TypeScript
- Contentful CMS
- Bootstrap 5
- Algolia with React InstantSearch
- Google Analytics 4 and the GA4 Data API
- Bun as package manager and test runner, with Testing Library and happy-dom
- Vercel for hosting

See `package.json` for the full list.

## Requirements

- [Bun](https://bun.sh) 1.3 or newer
- Node.js 20 or newer (Gatsby runs on Node)
- Git
- A Contentful account
- A Google Analytics 4 property and service account (optional, for the analytics sidebar)
- An Algolia account (optional, for search)

## Installation

1. Run `bun install`.
2. Copy `.env.EXAMPLE` to `.env`.
3. Set `SPACEID` and `TOKEN` from Contentful in `.env` ([how to get them](#getting-the-space-id-and-token)).
4. Edit the site metadata (title, author, URL, tagline) in `config.ts`.
5. Change the utterances repository and theme in `src/components/Comment.tsx`, or remove the `Comment` slice if you don't want comments.
6. Run `bun run develop`.
7. Open http://localhost:8000.

### Environment Variables

| Variable | Used for |
|---|---|
| `SPACEID`, `TOKEN` | Contentful Delivery API |
| `PREVIEW_TOKEN` | Contentful Preview API. When set, `gatsby develop` shows draft content; `gatsby build` always uses published content |
| `ANALYTICS_EMAIL`, `ANALYTICS_PRIVATE_KEY`, `ANALYTICS_GA4` | GA4 Data API service account and property ID, for the most viewed posts (build time) and `/api/trending` (runtime) |
| `ANALYTICS_MEASUREMENT_ID` | GA4 measurement ID for gtag page tracking |
| `GATSBY_ALGOLIA_APP_ID`, `GATSBY_ALGOLIA_INDEX_NAME`, `GATSBY_ALGOLIA_SEARCH_KEY` | Algolia search from the browser |
| `ALGOLIA_ADMIN_KEY` | Pushing posts to the Algolia index at build time |

### Optional Integrations

- **Algolia indexing**: the `gatsby-plugin-algolia` entry in `gatsby-config.ts` is commented out, so builds don't update the index. Uncomment it to push posts, using the queries in `src/utils/Algolia.tsx`. If you don't use search, remove `src/templates/search-page.tsx`, the `/search` page and the search slices in `gatsby-node.ts`.
- **Google Analytics**: if you don't use it, remove `gatsby-plugin-google-analytics-data-reporting-api` and `gatsby-plugin-google-gtag` from `gatsby-config.ts`, and `MostViewedPage` and `TopTrendingPage` from `src/components/sidebar/RightSidebar.tsx`.
- **Featured posts**: the featured slugs are hardcoded in `src/utils/FeaturedPageFetcher.tsx`.

## Scripts

| Command | Description |
|---|---|
| `bun run develop` | Type check, then start the dev server on `0.0.0.0:8000` |
| `bun run clean-develop` | Clear the Gatsby cache, then `develop` |
| `bun run build` | Production build |
| `bun run serve` | Serve the built site on `0.0.0.0:9000` |
| `bun run build-serve` | Type check, build and serve |
| `bun run clean-build-serve` | Clear the cache, type check, build and serve |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run format` | Prettier on `src/` |
| `bun test` | Unit tests |

## Testing

Tests use `bun:test` with Testing Library on a happy-dom DOM and sit next to the code as `*.test.ts(x)`. GitHub Actions runs the type check and the tests on every push and pull request to `master`.

## Getting the Space ID and Token

- After logging in and opening the home page, click the burger menu at the top left.

![](https://github.com/7sferry/Gatsbyan1.0/blob/master/static/click%20burger%20menu.jpg?raw=true)

- Create a new space.

![](https://github.com/7sferry/Gatsbyan1.0/blob/master/static/2.%20create%20space.jpg?raw=true)

- Choose a space type.

![](https://github.com/7sferry/Gatsbyan1.0/blob/master/static/3.%20choose%20space%20type.jpg?raw=true)

- Write your space name, choose 'create an example', choose the blog tab and click proceed.

![](https://github.com/7sferry/Gatsbyan1.0/blob/master/static/4.%20write%20down%20your%20space%20name%20and%20choose%20create%20an%20example%20and%20choose%20blog.jpg?raw=true)

- Once it's set up, go to the content tab and you'll see 4 default entries.

![](https://github.com/7sferry/Gatsbyan1.0/blob/master/static/5.%20go%20to%20content%20tab%20and%20there%20shoulde%20be%204%20default%20contents.png?raw=true)

- Go to the media tab and publish all draft images. `heroImage` is required, and the site won't build with unpublished images.

![](https://github.com/7sferry/Gatsbyan1.0/blob/master/static/6.%20go%20to%20media%20tab%20and%20publish%20all%20images.png?raw=true)

- Open the settings tab and choose 'API keys'. Click 'Add api key' at the top right, then copy the space ID and token into your `.env`.

![](https://github.com/7sferry/Gatsbyan1.0/blob/master/static/7.%20open%20setting%20and%20add%20api%20key%20copy-paste%20spaceid%20and%20token%20to%20env.jpg?raw=true)

- Run `bun run develop` and open http://localhost:8000 to see your content.

## Docker

Build and run the image:

```bash
docker build -t gatsbyan .
docker run -p 9000:9000 --rm -m 1g --cpus 2 --name gatsbyan gatsbyan
```

Or with Docker Compose:

```bash
docker compose -f compose.yaml up -d
```

## Deployment

The site is a static build, so it can be hosted anywhere. Production runs on Vercel, which also hosts the `/api/trending` Gatsby Function and the redirects in `vercel.json`. Point a Contentful webhook at your host's build hook to rebuild whenever you publish content.

[Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) scores for mobile and desktop:

![](https://github.com/7sferry/Gatsbyan1.0/blob/master/static/mobile.png?raw=true)

![](https://github.com/7sferry/Gatsbyan1.0/blob/master/static/desktop.png?raw=true)

If you have trouble setting this up, don't hesitate to contact me 😎
