/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CommaSeparatedLinkedPostTags from "./CommaSeparatedLinkedPostTags.tsx";
import { getLinks, getText } from "../test/renderUtils.ts";

describe("CommaSeparatedLinkedPostTags", () => {
  test("links each tag to its kebab case tag page", () => {
    const html = renderToStaticMarkup(<CommaSeparatedLinkedPostTags tags={["Java", "Design Pattern", "JavaScript"]} />);

    expect(getLinks(html).map(({ text, href }) => [text, href])).toEqual([
      ["Java", "/tags/java"],
      ["Design Pattern", "/tags/design-pattern"],
      ["JavaScript", "/tags/java-script"],
    ]);
  });

  test("separates tags with commas", () => {
    const html = renderToStaticMarkup(<CommaSeparatedLinkedPostTags tags={["Java", "Spring"]} />);

    expect(getText(html)).toBe("Java, Spring");
  });

  test("renders nothing without tags", () => {
    expect(renderToStaticMarkup(<CommaSeparatedLinkedPostTags tags={[]} />)).toBe("");
  });
});
