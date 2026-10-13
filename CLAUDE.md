# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gatsbyan is a Gatsby 5 blog site powered by Contentful CMS, React 19, and TypeScript. Deployed on Vercel at https://ferry.vercel.app.

## Common Commands

```bash
# Development
bun run develop          # TypeScript check + Gatsby dev server (0.0.0.0:8000)
bun run clean-develop    # Clear cache + dev

# Build & Serve
bun run build            # Production build
bun run serve            # Serve built site (0.0.0.0:9000)
bun run build-serve      # Typecheck + build + serve
bun run clean-build-serve # Full clean build + serve

# Code Quality
bun run typecheck        # tsc --noEmit
bun run format           # Prettier on src/**/*.{js,jsx,ts,tsx}

# Tests
bun test                 # All unit tests (bun:test, config in bunfig.toml)
bun test src/utils       # Tests under a path
```

Package manager is **bun** (not npm/yarn). CI (`.github/workflows/test.yml`) runs `bun install --frozen-lockfile`, `bun run typecheck` and `bun test` on pushes and pull requests to `master`.

Project skills in `.claude/skills/`: `write-test` (tests with the helpers below), `fix-bug` (test-first fix and commit on a `fix/` branch), `add-slice` (create and register a Gatsby Slice).

## Tests

Tests sit next to the code as `*.test.ts(x)` and use Testing Library on a happy-dom DOM (`src/test/happydom.ts`). Tests run in UTC.

`src/test/setup.ts` is preloaded and replaces two modules with stand-ins:
- `gatsby`: `Link` renders an `<a>`, `Slice` renders `<div data-slice data-props>`, and `useStaticQuery` is a mock.
- `gatsby-plugin-image`: `GatsbyImage` renders an `<img>`.

Helpers in `src/test/`:
- `mockStaticQueries` (`staticQuery.ts`) answers `useStaticQuery` by query name.
- `createSearchClient` (`searchClient.ts`) is a fake Algolia client. `renderWithSearch` (`renderWithSearch.tsx`) mounts components in a real `<InstantSearch>` backed by it.
- `mockTrendingApi` (`fixtures.ts`) stubs `fetch` for `/api/trending`. The same file has art-direction image fixtures.
- `createStock` (`stockFixture.ts`) builds a `ValueAveragingStockCalculator` with overridable inputs.
- `getLinks`, `getText`, `getParagraphs` (`renderUtils.ts`) parse rendered HTML strings.
- `renderHead` (`renderHead.ts`) renders a Gatsby `Head` export.
- `setupUser` (`user.ts`) sets up user-event without a delay between actions. Use it instead of calling `userEvent` directly; its default `setTimeout(0)` after each keystroke takes ~16ms on Windows.

Inside `waitFor`, assert on plain values (`expect(overlay() === null).toBe(true)`) instead of elements. A failing `expect(element)` makes Bun print the whole happy-dom tree, which is several MB and takes hundreds of ms per retry.

Keep tests out of `src/api/` and `src/pages/`, because Gatsby turns every file there into a function or a page. Put their tests in `src/test/` or `src/templates/`.

## Architecture

### Content Pipeline

Contentful CMS → gatsby-source-contentful → GraphQL → Templates/Pages → Static HTML

- **gatsby-config.ts**: Plugin configuration and Contentful connection. The preview API (`preview.contentful.com` with `PREVIEW_TOKEN`) is used only when `NODE_ENV` isn't `production` and `PREVIEW_TOKEN` is set, so `gatsby develop` shows drafts while `gatsby build` always uses published content.
- **gatsby-node.ts**: Slices, pages and redirects (see below)
- **config.ts**: Site metadata (title, author, URLs, tagline), exposed through `useSiteMetadata` (`src/utils/SiteMetadata.tsx`)

### Page Generation

`gatsby-node.ts` creates:
- `/blog/{slug}` → `src/templates/blog-post.tsx`
- `/` and `/page/{n}` → `src/templates/index.tsx`, 10 posts per page
- `/tags/{kebabTag}` and `/tags/{kebabTag}/{n}` → `src/templates/index.tsx` with a `tag` context
- `/search` and `/archive` as deferred (DSG) pages
- Redirects for renamed posts. Vercel-level redirects live in `vercel.json`.

File-based pages in `src/pages/`: `404.tsx` and `features/value-averaging-calculator.tsx`.

Templates receive context from gatsby-node (skip, limit, tag, kebabTag, slug) and use page-level GraphQL queries. Components use `useStaticQuery` for component-level data. SEO tags are rendered through the Gatsby Head API with `Seo.tsx` / `SeoPost.tsx`.

### Gatsby Slices

`Layout.tsx` renders the `Header` and `RightSidebar` slices; `LeftSidebar` renders `Bio`, `Socials` and `Tags`. Other slices: `Comment`, `PaginationElement`, `ArchiveContainer`, `SearchHitsResult`, `PaginationSearchResult`, `VoiceSearchElement`. Every slice is registered with `createSlice` in `gatsby-node.ts`, so a new slice needs an entry there.

### Data Fetching Utilities

`src/utils/` contains `useStaticQuery` wrappers:
- **AllPostFetcher.tsx** — map of post path to title
- **FeaturedPageFetcher.tsx** — featured posts from a hardcoded slug list
- **MostViewedCounter.tsx** — most viewed posts from `allPageViews` (GA4 data, sourced at build time)
- **GetArchiveQuery.tsx**, **GetTagsQuery.tsx** — archive and tag data

**TopTrendingFetcher.tsx** is different: it fetches `/api/trending` in the browser.

Other utilities: `GatsbyanUtils.tsx` (constants, `kebabCase`, tech tags), `PagingUtils.tsx`, `DateUtils.tsx`, `Photo.tsx` (art-directed bio image), `Algolia.tsx` (index queries), `ValueAveragingStockCalculator.tsx` and `VcaUtils.tsx` (calculator logic and rupiah formatting).

### Analytics Integration

- Build time: `gatsby-plugin-google-analytics-data-reporting-api` sources page views (`scrolledUsers`) for the most viewed sidebar.
- Runtime: `src/api/trending.ts` is a Gatsby Function that queries the GA4 Data API for the top 5 posts by organic Google search clicks over the last 30 days. Responses are cached until midnight Asia/Jakarta, when GA rolls over "yesterday".
- `gatsby-plugin-google-gtag` handles page tracking with `ANALYTICS_MEASUREMENT_ID`.

### Search

`src/templates/search-page.tsx` uses `react-instantsearch` with an Algolia client that skips requests for empty queries. The `gatsby-plugin-algolia` entry in `gatsby-config.ts` is commented out, so builds don't update the index; `src/utils/Algolia.tsx` holds its queries, splitting long posts into chunks of at most 8500 characters.

### Comments

`Comment.tsx` loads utterances (GitHub issues on the site repo) once per page.

### Styling

Bootstrap 5 base with custom CSS files co-located in `src/components/` and `src/templates/`. No CSS modules or CSS-in-JS — plain CSS with class names. The site has a single dark theme. `gatsby-plugin-purgecss` strips unused selectors, including in development; CSS in `src/templates/ignored/` (Prism, blockquote, markdown body) is exempt, so put styles for markup generated outside React there.

### TypeScript

All types are centralized in `src/types/DataTypes.ts`. Config files (gatsby-config, gatsby-node, gatsby-browser, gatsby-ssr) are all TypeScript. `gatsby-browser.tsx` wires image zoom and Prism copy buttons on route updates.

## Environment Variables

Required for full functionality (see `.env.EXAMPLE`):
- **CMS**: `SPACEID`, `TOKEN`, `PREVIEW_TOKEN`
- **Analytics**: `ANALYTICS_EMAIL`, `ANALYTICS_PRIVATE_KEY`, `ANALYTICS_GA4`, `ANALYTICS_MEASUREMENT_ID`
- **Search** (optional): `GATSBY_ALGOLIA_APP_ID`, `GATSBY_ALGOLIA_INDEX_NAME`, `GATSBY_ALGOLIA_SEARCH_KEY`, `ALGOLIA_ADMIN_KEY`

Only `GATSBY_`-prefixed variables reach the browser bundle.

## Agent Rules

- Always run `git add` after writing a new file to ensure it is staged immediately.
- Use semantic commit message format: `${TYPE}(${SCOPE}): ${SUBJECT}` (scope optional).
  - Types: `feat`, `fix`, `perf`, `refactor`, `test`, `style`, `docs`, `chore`, `build`, `ci`, `revert`
  - Subject: max 50 chars, lowercase, no line breaks
  - Body (optional): max 100 chars per line
  - Footer (optional): issue references or breaking changes
  - Do not combine unrelated changes in one commit

## Key Conventions

- Trailing slashes disabled (`trailingSlash: "never"` in gatsby-config and `vercel.json`)
- Tag URLs use kebab-case transformation (`GatsbyanUtils.tsx`)
- Blog post URLs follow pattern `/blog/{contentful-slug}`
- Responsive images use art direction with phone/ipad/laptop breakpoints
- Markdown content processed via gatsby-transformer-remark with Prism.js syntax highlighting, code titles, copy buttons, table captions and header links
- Prettier: 120 columns, double quotes, semicolons, ES5 trailing commas (`.prettierrc`)
