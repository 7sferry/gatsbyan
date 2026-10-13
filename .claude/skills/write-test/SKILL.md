---
name: write-test
description: Write or extend bun:test unit tests for a file in this project using its test helpers and Gatsby stand-ins. Use when asked to test a component, template, util or Gatsby Function, or when a change needs test coverage.
argument-hint: "[path/to/file]"
---

Write tests for `$ARGUMENTS`. If no path is given, test the files changed on the current branch (`git diff --name-only master...HEAD`).

## Where the test goes

- Next to the source as `<Name>.test.ts` (pure logic) or `<Name>.test.tsx` (anything rendering JSX).
- Never in `src/pages/` or `src/api/`, because Gatsby turns every file there into a page or a function:
  - Pages in `src/pages/` → test in `src/templates/Pages.test.tsx` (or a new file in `src/templates/`).
  - Functions in `src/api/<name>.ts` → test in `src/test/api/<name>.test.ts`.
- If a test file already exists for the source, add to it instead of creating a new one.

## Before writing

1. Read the source file and the closest existing test (same folder, or a similar kind of file) and copy its structure.
2. Read `src/test/setup.ts` if the file imports from `gatsby` or `gatsby-plugin-image`.
3. Find every `useStaticQuery` in the file and in the components it renders, and note each query's name (`query SiteMetadata { ... }` → `SiteMetadata`).

## What the environment gives you

`bunfig.toml` preloads `src/test/happydom.ts` and `src/test/setup.ts`. Tests run in UTC.

`setup.ts` replaces:
- `gatsby`: `Link` renders `<a href>`, `graphql` returns the query text, `useStaticQuery` is a mock, and `Slice` renders `<div data-slice="<alias>" data-props="<json>">` instead of the slice component.
- `gatsby-plugin-image`: `GatsbyImage` renders `<img>` with `data-media` listing art-direction media queries.

So a slice is never rendered inside its parent. Test the slice component directly, and in the parent assert on the placeholder:

```ts
const slice = container.querySelector("[data-slice=PaginationElement]")!;
expect(JSON.parse(slice.getAttribute("data-props")!)).toEqual({ totalPageCount: 3, url: "/page", currentPage: 1 });
```

## Helpers in `src/test/`

| Need | Helper |
|---|---|
| Answer `useStaticQuery` | `mockStaticQueries({ QueryName: data, anonymous: data })` from `staticQuery.ts`; reset with `useStaticQueryMock.mockReset()` in `afterEach`. `siteMetadata` there is a ready-made fixture |
| Algolia search | `createSearchClient(hits, nbPages)`, `createHit`, `highlight`, `lastQuery` from `searchClient.ts`; `renderWithSearch(ui, client, query)` from `renderWithSearch.tsx` |
| `/api/trending` | `mockTrendingApi(nodes, status)` from `fixtures.ts`; call `.mockRestore()` on the returned mock in `afterEach` |
| Images | `createImages(name)`, `expectedArtDirection(name)`, `ART_DIRECTION_MEDIA` from `fixtures.ts` |
| Value averaging calculator | `createStock(overrides)` from `stockFixture.ts` |
| Gatsby `Head` export | `renderHead(<Head ... />)` from `renderHead.ts`, returns `title`, `canonical`, `schema`, `meta(name)` |
| Parsing an HTML string | `getLinks`, `getText`, `getParagraphs` from `renderUtils.ts` |
| User interaction | `const user = setupUser()` from `user.ts`. Never call `userEvent` directly |
| Time | `setSystemTime(new Date(...))` from `bun:test`, reset with `setSystemTime()` in `afterEach` |
| Module mocks for a Gatsby Function | `mock.module(...)` at the top, then `await import(...)` the handler inside the test (see `src/test/api/trending.test.ts`) |

## Rules

- Import from `bun:test` (`describe`, `test`, `expect`, `mock`, `spyOn`, `beforeEach`, `afterEach`, `setSystemTime`). Not jest, not vitest.
- Query by role or text through Testing Library; fall back to class selectors only for markup without a role.
- Inside `waitFor`, assert on plain values, never on elements: `await waitFor(() => expect(overlay() === null).toBe(true))`. A failing `expect(element)` prints the whole happy-dom tree (megabytes, hundreds of ms per retry).
- Test names describe behavior in plain lowercase English: `test("hides the previous link on the first page", ...)`.
- One behavior per test. Cover edge cases the code handles explicitly (empty lists, missing optional data, first/last page, zero, time zones).
- No explanatory comments in test code.
- New files need the MR Ferry banner exactly once. Creating the file with WebStorm MCP `create_new_file` adds it; with the Write tool, copy the banner from a neighboring test and use the current month and year. Run `git add` on new files.

## Finish

1. `bun test <path of the new or changed test>` until it passes.
2. If the test was written for a bug fix, confirm it fails without the fix.
3. `bun run typecheck`.
4. Report which behaviors are covered and anything left untested.
