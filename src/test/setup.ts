/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { mock } from "bun:test";
import React from "react";

// The real "gatsby" package needs the Gatsby runtime, so tests use a lightweight stand-in.
mock.module("gatsby", () => ({
  Link: ({ to, children, ...rest }: React.PropsWithChildren<{ to: string }>) =>
    React.createElement("a", { href: to, ...rest }, children),
  graphql: (query: TemplateStringsArray) => query.join(""),
  useStaticQuery: mock(() => ({})),
}));
