# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gatsbyan is a Gatsby 5 blog site powered by Contentful CMS, React 19, and TypeScript. Deployed on Vercel at https://ferry.vercel.app.

## Common Commands

```bash
# Development
bun run develop          # TypeScript check + Gatsby dev server (0.0.0.0)
bun run clean-develop    # Clear cache + dev

# Build & Serve
bun run build            # Production build
bun run serve            # Serve built site (0.0.0.0)
bun run clean-build-serve # Full clean build + serve

# Code Quality
bun run typecheck        # tsc --noEmit
bun run format           # Prettier on src/**/*.{js,jsx,ts,tsx}
```

Package manager is **bun** (not npm/yarn).

## Architecture

### Content Pipeline

Contentful CMS → gatsby-source-contentful → GraphQL → Templates/Pages → Static HTML

- **gatsby-config.ts**: Plugin configuration, Contentful connection (switches between production/preview based on `PREVIEW_TOKEN` env var)
- **gatsby-node.ts**: Dynamic page creation — blog posts at `/blog/{slug}`, paginated index (10/page), tag pages at `/tags/{kebabTag}`, plus `/search` and `/archive`
- **config.ts**: Site metadata (title, author, URLs, tagline)

### Page Generation

Templates in `src/templates/` receive context from gatsby-node (skip, limit, tag, slug) and use page-level GraphQL queries. Components use `useStaticQuery` for component-level data.

### Gatsby Slices

The Layout component (`src/components/Layout.tsx`) uses Gatsby Slices for reusable parts: Header, Socials, Bio, Tags, RightSidebar, Comment, PaginationElement, etc. Slices are defined in gatsby-node.ts.

### Data Fetching Utilities

`src/utils/` contains GraphQL query wrappers:
- **AllPostFetcher.tsx** — all posts query
- **FeaturedPageFetcher.tsx** — featured posts
- **TopTrendingFetcher.tsx** — trending posts from GA analytics
- **MostViewedCounter.tsx** — page view data

### Analytics Integration

`src/api/trending.ts` is a Gatsby Function (serverless) that calls Google Analytics Data Reporting API for organic search trending data with cache headers.

### Styling

Bootstrap 5 base with custom CSS files co-located in `src/components/`. No CSS modules or CSS-in-JS — plain CSS with class names.

### TypeScript

All types are centralized in `src/types/DataTypes.ts`. Config files (gatsby-config, gatsby-node, gatsby-browser, gatsby-ssr) are all TypeScript.

## Environment Variables

Required for full functionality (see `.env.EXAMPLE`):
- **CMS**: `SPACEID`, `TOKEN`, `PREVIEW_TOKEN`
- **Analytics**: `ANALYTICS_EMAIL`, `ANALYTICS_PRIVATE_KEY`, `ANALYTICS_GA4`, `ANALYTICS_MEASUREMENT_ID`
- **Search** (optional): `GATSBY_ALGOLIA_APP_ID`, `GATSBY_ALGOLIA_INDEX_NAME`, `GATSBY_ALGOLIA_SEARCH_KEY`, `ALGOLIA_ADMIN_KEY`

## Agent Rules

- Always run `git add` after writing a new file to ensure it is staged immediately.

## Key Conventions

- Trailing slashes disabled (`trailingSlash: "never"` in gatsby-config)
- Tag URLs use kebab-case transformation (`GatsbyanUtils.tsx`)
- Blog post URLs follow pattern `/blog/{contentful-slug}`
- Responsive images use art direction with phone/ipad/laptop breakpoints
- Markdown content processed via gatsby-transformer-remark with Prism.js syntax highlighting