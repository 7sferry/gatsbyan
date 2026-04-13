---
name: deploy-preview
description: Build with Contentful preview API to test draft content
disable-model-invocation: true
allowed-tools: Bash(bun run *) Bash(PREVIEW_TOKEN=*)
---

Build the site using Contentful's preview API to see draft/unpublished content.

## Steps

1. Verify `PREVIEW_TOKEN` is set in the environment
2. Run `bun run clean` to clear cached production content
3. Run `bun run build` (gatsby-config.ts will auto-detect PREVIEW_TOKEN and switch to preview.contentful.com)
4. Run `bun run serve` to preview at http://localhost:9000

If `PREVIEW_TOKEN` is not set, warn the user that they need to set it in `.env` or environment.
