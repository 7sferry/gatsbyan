---
name: dev
description: Start the Gatsby development server with TypeScript checking
disable-model-invocation: true
allowed-tools: Bash(bun run *)
---

Start the development server for this Gatsby blog.

1. Run `bun run develop` to start the dev server (includes TypeScript check)
2. The server will be available at http://localhost:8000
3. GraphQL explorer at http://localhost:8000/___graphql

If the user requests a clean start, run `bun run clean-develop` instead to clear the Gatsby cache first.

Required environment variables must be set (see `.env.EXAMPLE`):

- `SPACEID`, `TOKEN` — Contentful CMS credentials
- Set `PREVIEW_TOKEN` to use Contentful preview API instead of production CDN
