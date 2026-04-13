---
name: build
description: Build and optionally serve the Gatsby production site
disable-model-invocation: true
allowed-tools: Bash(bun run *) Bash(gatsby *)
---

Build the production site. Accepts optional arguments: `serve`, `clean`.

## Steps

1. If `$ARGUMENTS` contains "clean", run `bun run clean` first to clear the Gatsby cache
2. Run `bun run typecheck` to validate TypeScript
3. Run `bun run build` to create the production build
4. If `$ARGUMENTS` contains "serve", run `bun run serve` to serve the built site at http://localhost:9000

## Examples

- `/build` — typecheck + build
- `/build serve` — typecheck + build + serve
- `/build clean serve` — clean cache + typecheck + build + serve
