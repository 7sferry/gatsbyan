/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, Mock, test } from "bun:test";
import React from "react";
import { act, render, screen, within } from "@testing-library/react";
import Bio from "./Bio.tsx";
import FeaturedPage from "./FeaturedPage.tsx";
import LeftSidebar from "./LeftSidebar.tsx";
import MostViewedPage from "./MostViewedPage.tsx";
import RightSidebar from "./RightSidebar.tsx";
import Tags from "./Tags.tsx";
import TopTrendingPage from "./TopTrendingPage.tsx";
import { mockStaticQueries, siteMetadata, useStaticQueryMock } from "../../test/staticQuery.ts";
import { createImages, mockTrendingApi, trendingApi } from "../../test/fixtures.ts";

const posts = [
  { slug: "a", title: "Post A" },
  { slug: "b", title: "Post B" },
  { slug: "c", title: "Post C" },
];

const staticQueries = {
  SiteMetadata: { site: { siteMetadata } },
  PhotoBio: { file: { childImageSharp: createImages("ferry") } },
  AllPosts: { allContentfulBlogPost: { nodes: posts } },
  AnalyticsPageQuery: { allPageViews: { nodes: [{ path: "/blog/c" }, { path: "/" }, { path: "/blog/a" }] } },
  FeaturedPageQuery: { allContentfulBlogPost: { nodes: [{ slug: "b", title: "Post B" }] } },
  Tags: { allContentfulBlogPost: { tags: ["Java", "Design Pattern"] } },
};

const linksIn = (element: HTMLElement) =>
  within(element)
    .getAllByRole("link")
    .map((link) => [link.textContent, link.getAttribute("href")]);

const section = (heading: string) => screen.getByText(heading).parentElement!;

describe("sidebar", () => {
  let fetchMock: Mock<typeof fetch>;

  beforeEach(() => {
    mockStaticQueries(staticQueries);
    fetchMock = mockTrendingApi([
      { path: "/blog/b", value: 10 },
      { path: "/blog/unknown", value: 5 },
    ]);
  });

  afterEach(() => {
    useStaticQueryMock.mockReset();
    fetchMock.mockRestore();
  });

  describe("Bio", () => {
    test("shows the photo, author and tagline", () => {
      render(<Bio />);

      const photo = screen.getByRole("img", { name: "Ferry" });
      expect(photo.getAttribute("src")).toBe("/ferry-original.jpg");
      expect(photo.className).toBe("bio-picture");
      expect(screen.getByRole("link", { name: "Ferry" }).getAttribute("href")).toBe(
        "/blog/berkenalan-dengan-ferry-suhandri"
      );
      expect(screen.getByText(siteMetadata.tagline)).toBeTruthy();
    });
  });

  describe("FeaturedPage", () => {
    test("links featured posts and the value averaging calculator", () => {
      render(<FeaturedPage />);

      expect(linksIn(section("Featured Post"))).toEqual([
        ["Post B", "/blog/b"],
        ["Value Averaging Calculator", "/features/value-averaging-calculator"],
      ]);
    });
  });

  describe("MostViewedPage", () => {
    test("links the most read posts", () => {
      render(<MostViewedPage />);

      expect(linksIn(section("Most Read"))).toEqual([
        ["Post C", "/blog/c"],
        ["Post A", "/blog/a"],
      ]);
    });

    test("renders nothing without analytics data", () => {
      mockStaticQueries({ ...staticQueries, AnalyticsPageQuery: {} });

      const { container } = render(<MostViewedPage />);

      expect(container.innerHTML).toBe("");
    });
  });

  describe("TopTrendingPage", () => {
    test("links the top searched posts once loaded", async () => {
      const { container } = render(<TopTrendingPage />);
      expect(container.innerHTML).toBe("");

      await screen.findByText("Top Searched");

      expect(linksIn(section("Top Searched"))).toEqual([["Post B", "/blog/b"]]);
    });

    test("stays empty when the api fails", async () => {
      fetchMock.mockImplementation(trendingApi([], 500));

      const { container } = render(<TopTrendingPage />);
      await act(() => new Promise((resolve) => setTimeout(resolve, 10)));

      expect(container.innerHTML).toBe("");
    });
  });

  describe("Tags", () => {
    test("links every tag to its tag page", () => {
      render(<Tags />);

      expect(linksIn(section("Tags"))).toEqual([
        ["Java", "/tags/java"],
        ["Design Pattern", "/tags/design-pattern"],
      ]);
    });
  });

  describe("LeftSidebar", () => {
    test("renders bio, socials and tags slices", () => {
      const { container } = render(<LeftSidebar />);

      expect(
        Array.from(container.querySelectorAll("[data-slice]"), (slice) => slice.getAttribute("data-slice"))
      ).toEqual(["Bio", "Socials", "Tags"]);
    });
  });

  describe("RightSidebar", () => {
    test("shows featured, most read and top searched posts", async () => {
      render(<RightSidebar />);

      expect(screen.getByText("Featured Post")).toBeTruthy();
      expect(screen.getByText("Most Read")).toBeTruthy();
      expect(await screen.findByText("Top Searched")).toBeTruthy();
    });
  });
});
