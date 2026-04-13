---
name: new-component
description: Scaffold a new React component following project conventions
argument-hint: "[ComponentName]"
---

Create a new React component named `$ARGUMENTS` following this project's conventions.

## Project Conventions

1. **File header**: Every file starts with:
   ```
   /************************
    * Author: [MR FERRY™]  *
    * <Month Year>         *
    ************************/
   ```
   Use the current month and year.

2. **TypeScript**: All components use `.tsx` extension with typed props.

3. **Props interfaces**: Define props interfaces in `src/types/DataTypes.ts` if they will be shared, or inline if
   component-specific.

4. **Imports**: Use named imports. Import React explicitly.

5. **Component style**: Use function components (arrow functions), not class components. Export as default.

6. **Styling**: Use plain CSS with class names (Bootstrap 5 available). Place CSS in `src/components/` alongside the
   component.

7. **Gatsby features**: Use `<Slice>` for reusable layout parts, `useStaticQuery` + `graphql` for component-level data,
   `gatsby-plugin-image` for responsive images.

## Steps

1. Create the component file in `src/components/$ARGUMENTS.tsx`
2. Add TypeScript interface to `src/types/DataTypes.ts` if props are shared
3. Add CSS file if needed
4. Run `git add` on all new files
5. Run `bun run typecheck` to verify
