---
name: new-template
description: Scaffold a new Gatsby page template with GraphQL query
argument-hint: "[template-name]"
---

Create a new Gatsby page template named `$ARGUMENTS`.

## Project Conventions

1. **File header**: Every file starts with:
   ```
   /************************
    * Author: [MR FERRY™]  *
    * <Month Year>         *
    ************************/
   ```

2. **Location**: Templates go in `src/templates/`

3. **Structure**: Each template typically:
    - Imports `Layout` from `../components/Layout`
    - Imports `Seo` from `../components/Seo`
    - Exports a default component that wraps content in `<Layout>`
    - Exports a `Head` component using `<Seo>` for SEO
    - Exports a `pageQuery` GraphQL query at the bottom

4. **Page context**: Templates receive context from `gatsby-node.ts` via `pageContext` prop. Define the context
   interface in `src/types/DataTypes.ts`.

5. **Data flow**: Page-level data comes from exported `graphql` queries, not `useStaticQuery`.

## Steps

1. Create `src/templates/$ARGUMENTS.tsx` with Layout wrapper and page query
2. Add TypeScript interfaces to `src/types/DataTypes.ts`
3. Register the page in `gatsby-node.ts` using `createPage()`
4. If it should be a Slice, register it with `createSlice()` in gatsby-node.ts
5. Run `git add` on new files
6. Run `bun run typecheck` to verify
