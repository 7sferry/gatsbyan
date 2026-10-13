---
name: add-slice
description: Create a Gatsby Slice in this project or turn an existing component into one - component, createSlice registration, usage and tests. Use when adding a reusable layout part or when asked to make a component a slice.
argument-hint: "[SliceName] [where it is used]"
---

Add the slice described by: $ARGUMENTS

A slice is built once and shared by every page that uses it, so a change to it doesn't rebuild those pages. Use one for parts repeated across many pages (header, sidebars, comments, pagination). Don't use one for a component rendered on a single page or one that needs page data that can't be passed as props.

## 1. Component

- Put it in `src/components/`, or the matching subfolder (`header/`, `sidebar/`, `search/`).
- Function component in a `.tsx` file with a default export, like `src/components/PaginationElement.tsx`.
- Props interface in `src/types/DataTypes.ts`.
- Data the slice needs for itself comes from `useStaticQuery` (or a fetcher in `src/utils/`), never from a page query.
- Data that differs per page comes in as props. Props must be serializable: strings, numbers, booleans, arrays and plain objects. No functions or class instances.
- Plain CSS next to the component, imported from it.
- If converting an existing component, keep its file and only change how it's used.

## 2. Register

Add a `createSlice` call in `gatsby-node.ts` next to the others:

```ts
createSlice({
  id: `<SliceName>`,
  component: path.resolve(`./src/components/<path>/<SliceName>.tsx`),
});
```

The `id` is the alias used everywhere else. Without this registration the build fails with a missing slice error.

## 3. Use

Replace the direct render with the placeholder, passing per-page values as props:

```tsx
<Slice alias="<SliceName>" currentPage={pageInfo.currentPage} />
```

Import `Slice` from `gatsby`.

## 4. Test

Follow the `write-test` skill:
- Test the slice component directly with `mockStaticQueries` for its queries.
- In the parent's test, assert on the placeholder `[data-slice=<SliceName>]` and its `data-props` JSON, because the test stand-in for `Slice` doesn't render the component. See `src/components/Components.test.tsx`.

## 5. Verify

1. `bun test` and `bun run typecheck` pass.
2. Ask the user whether to run `bun run develop` or `bun run build` to check the slice renders; the stand-in in tests can't catch a wrong registration path or unserializable props.
3. `git add` new files. New source files need the MR Ferry banner exactly once (WebStorm MCP `create_new_file` adds it; otherwise copy it from a neighboring file with the current month and year).
4. Update the slice list in `CLAUDE.md` under "Gatsby Slices".
