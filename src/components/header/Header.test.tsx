/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, test } from "bun:test";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import Header from "./Header.tsx";
import Menu from "./Menu.tsx";
import MobileMenuLinks from "./MobileMenuLinks.tsx";
import { mockStaticQueries, siteMetadata, useStaticQueryMock } from "../../test/staticQuery.ts";

const MENU_LINKS = [
  ["Home", "/"],
  ["Archive", "/archive"],
  ["Search", "/search"],
];

const menuLinks = (element: HTMLElement) =>
  within(element)
    .getAllByRole("link")
    .map((link) => [link.querySelector(".menu-button > span")?.textContent, link.getAttribute("href")]);

describe("Menu", () => {
  test("links home, archive and search with icons", () => {
    const { container } = render(<Menu />);

    expect(menuLinks(container)).toEqual(MENU_LINKS);
    expect(Array.from(container.querySelectorAll("svg title"), (title) => title.textContent)).toEqual([
      "Homepage",
      "Archive page",
      "Search page",
    ]);
  });
});

describe("MobileMenuLinks", () => {
  test("shows the same links in the bottom bar", () => {
    const { container } = render(<MobileMenuLinks />);

    expect(container.querySelector(".bottom-bar")).toBeTruthy();
    expect(menuLinks(container)).toEqual(MENU_LINKS);
  });
});

describe("Header", () => {
  afterEach(() => {
    useStaticQueryMock.mockReset();
  });

  test("links the site title home and shows desktop and mobile menus", () => {
    mockStaticQueries({ SiteMetadata: { site: { siteMetadata } } });

    const { container } = render(<Header />);

    expect(screen.getByRole("link", { name: siteMetadata.title }).getAttribute("href")).toBe("/");
    expect(menuLinks(container.querySelector(".social-links")!)).toEqual(MENU_LINKS);
    expect(menuLinks(container.querySelector(".bottom-bar")!)).toEqual(MENU_LINKS);
  });
});
