/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PaginationElement from "./PaginationElement.tsx";
import { getLinks } from "../test/renderUtils.ts";

const render = (currentPage: number, totalPageCount: number, url = "/page") =>
  renderToStaticMarkup(<PaginationElement currentPage={currentPage} totalPageCount={totalPageCount} url={url} />);

const linkByText = (html: string) => new Map(getLinks(html).map((link) => [link.text, link]));

describe("PaginationElement", () => {
  test("renders nothing for a single page", () => {
    expect(render(1, 1)).toBe("");
    expect(render(1, 0)).toBe("");
  });

  test("renders first five pages on the first page", () => {
    const links = linkByText(render(1, 10));

    expect(["1", "2", "3", "4", "5"].map((text) => links.get(text)?.href)).toEqual([
      "/",
      "/page/2",
      "/page/3",
      "/page/4",
      "/page/5",
    ]);
    expect(links.has("6")).toBe(false);
    expect(links.get("1")?.className).toContain("current");
    expect(links.get("1")?.disabled).toBe(true);
  });

  test("disables First and Prev on the first page", () => {
    const links = linkByText(render(1, 10));

    expect(links.get("First")).toMatchObject({ href: "/", disabled: true });
    expect(links.get("Prev")?.disabled).toBe(true);
    expect(links.get("Next")).toMatchObject({ href: "/page/2", disabled: false });
    expect(links.get("Last")).toMatchObject({ href: "/page/10", disabled: false });
  });

  test("disables Next and Last on the last page", () => {
    const links = linkByText(render(10, 10));

    expect(getLinks(render(10, 10)).map((link) => link.text)).toEqual([
      "First",
      "Prev",
      "6",
      "7",
      "8",
      "9",
      "10",
      "Next",
      "Last",
    ]);
    expect(links.get("Prev")).toMatchObject({ href: "/page/9", disabled: false });
    expect(links.get("Next")?.disabled).toBe(true);
    expect(links.get("Last")?.disabled).toBe(true);
  });

  test("links Prev from the second page back to the index", () => {
    expect(linkByText(render(2, 10)).get("Prev")?.href).toBe("/");
  });

  test("keeps tag url as the first page", () => {
    const links = linkByText(render(3, 4, "/tags/java"));

    expect(links.get("First")?.href).toBe("/tags/java");
    expect(links.get("1")?.href).toBe("/tags/java");
    expect(links.get("Prev")?.href).toBe("/tags/java/2");
    expect(links.get("4")?.href).toBe("/tags/java/4");
  });
});
