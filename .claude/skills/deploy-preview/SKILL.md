---
name: deploy-preview
description: Run the dev server against the Contentful preview API to test draft content
disable-model-invocation: true
allowed-tools: Bash(bun run *) Bash(PREVIEW_TOKEN=*)
---

Run the site against Contentful's preview API to see draft/unpublished content.

`gatsby-config.ts` only uses preview.contentful.com when `NODE_ENV` is not `production`, so drafts show up in `gatsby develop` but never in `gatsby build`.

## Steps

1. Verify `PREVIEW_TOKEN` is set in `.env` or the environment
2. Run `bun run clean-develop` to clear cached production content and start the dev server
3. Open http://localhost:8000 to preview drafts

If `PREVIEW_TOKEN` is not set, warn the user that they need to set it in `.env` or environment.
