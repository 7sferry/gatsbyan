/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, mock } from "bun:test";
import { cleanup } from "@testing-library/react";
import React from "react";

// The real "gatsby" package needs the Gatsby runtime, so tests use a lightweight stand-in.
// Slices render a placeholder carrying their alias and props, so templates can be tested on their own.
mock.module("gatsby", () => ({
  Link: ({ to, children, ...rest }: React.PropsWithChildren<{ to: string }>) =>
    React.createElement("a", { href: to, ...rest }, children),
  Slice: ({ alias, ...props }: { alias: string }) =>
    React.createElement("div", { "data-slice": alias, "data-props": JSON.stringify(props) }),
  graphql: (query: TemplateStringsArray) => query.join(""),
  useStaticQuery: mock(() => ({})),
}));

interface GatsbyImageStandIn {
  readonly src?: string;
  readonly artDirected?: Array<{ media: string }>;
}

mock.module("gatsby-plugin-image", () => ({
  GatsbyImage: ({ image, alt, className }: { image: GatsbyImageStandIn; alt: string; className?: string }) =>
    React.createElement("img", {
      src: image?.src,
      alt,
      className,
      "data-media": image?.artDirected?.map((direction) => direction.media).join(","),
    }),
  withArtDirection: (image: object, artDirected: Array<{ media: string; image: object }>) => ({
    ...image,
    artDirected,
  }),
}));

afterEach(() => {
  cleanup();
});
