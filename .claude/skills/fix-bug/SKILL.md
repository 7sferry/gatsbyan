---
name: fix-bug
description: Fix a bug in this project test-first - reproduce it with a failing test, fix the code, verify, and commit on a fix branch. Use when the user reports a bug or broken behavior on the site.
argument-hint: "[bug description]"
---

Fix the bug: $ARGUMENTS

## 1. Branch

- If the current branch is `master`, create `fix/<short-kebab-description>` from `master`.
- If already on a `fix/` branch, stay on it; several fixes can share one branch as separate commits.
- Leave unrelated uncommitted changes and untracked files alone.

## 2. Locate

- Find the code behind the behavior. Remember where things live:
  - Routes, pagination, tag pages, redirects → `gatsby-node.ts` (redirects also in `vercel.json`)
  - Site-wide data → `config.ts`, `src/utils/SiteMetadata.tsx`
  - Slices → registered in `gatsby-node.ts`, components in `src/components/`
  - Trending sidebar → `src/api/trending.ts` and `src/utils/TopTrendingFetcher.tsx`
  - Styles missing only in production → PurgeCSS; styles for remark/Prism markup belong in `src/templates/ignored/`
- If the cause is in Contentful content, GA4 data, Algolia data or Vercel config rather than code, stop and tell the user instead of patching around it.

## 3. Reproduce

- Write a test that fails because of the bug, following the `write-test` skill.
- Run it and confirm it fails for the reason described, not for a setup mistake.
- If the bug can't be reproduced in a unit test (build-only, browser-only, CSS), say so and describe how you verified it instead.

## 4. Fix

- Make the smallest change that fixes the cause, not the symptom.
- Match the surrounding code style. No explanatory comments.
- Don't refactor or fix other things on the way; mention them to the user instead.

## 5. Verify

1. The new test passes.
2. `bun test` passes.
3. `bun run typecheck` passes.
4. `bunx prettier --check` on the changed files; run `bunx prettier --write` on them if needed.

## 6. Commit

- Stage only the files for this fix.
- One commit per bug, single line, no scope, body or footer: `fix: <what is now correct>`, lowercase, at most 50 characters, describing the fixed behavior (e.g. `fix: keep the 404 page out of search results`).
- Don't push or open a PR unless the user asks.

Report the cause, the fix, the test that covers it and the commit hash.
