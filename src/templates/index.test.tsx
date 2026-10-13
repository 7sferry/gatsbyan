/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { HeadProps } from "gatsby";
import IndexPage, { Head } from "./index.tsx";
import { IndexProp } from "../types/DataTypes.ts";
import { mockStaticQueries, siteMetadata, useStaticQueryMock } from "../test/staticQuery.ts";
import { ART_DIRECTION_MEDIA, createImages } from "../test/fixtures.ts";
import { renderHead } from "../test/renderHead.ts";

const createPost = (id: string, overrides: Record<string, unknown> = {}) => ({
  id,
  slug: `post-${id}`,
  title: `Post ${id}`,
  publishDate: "2024-01-15T20:00:00Z",
  tags: ["Java"],
  body: { childMarkdownRemark: { timeToRead: 3, excerpt: `Excerpt ${id}` } },
  heroImage: { ...createImages(id), title: `Hero ${id}` },
  ...overrides,
});

const createProps = (pageContext: Record<string, unknown> = {}, posts = [createPost("a"), createPost("b")]) =>
  ({
    data: {
      allContentfulBlogPost: {
        nodes: posts,
        pageInfo: { currentPage: 2, pageCount: 4, hasNextPage: true, hasPreviousPage: true, perPage: 10, itemCount: 2 },
      },
    },
    pageContext,
  }) as unknown as IndexProp;

const paginationProps = (container: HTMLElement) =>
  JSON.parse(container.querySelector("[data-slice=PaginationElement]")!.getAttribute("data-props")!);

describe("index template", () => {
  beforeEach(() => {
    mockStaticQueries({ SiteMetadata: { site: { siteMetadata } }, anonymous: { site: { siteMetadata } } });
  });

  afterEach(() => {
    useStaticQueryMock.mockReset();
  });

  test("lists every post with its details", () => {
    const { container } = render(<IndexPage {...createProps()} />);

    const post = within(container.querySelector<HTMLElement>("#a")!);
    expect(post.getByRole("link", { name: "Post a" }).getAttribute("href")).toBe("/blog/post-a");
    expect(post.getByText("January 16th, 2024")).toBeTruthy();
    expect(post.getByText("3 mins read")).toBeTruthy();
    expect(post.getByRole("link", { name: "Java" }).getAttribute("href")).toBe("/tags/java");
    expect(post.getByText("Excerpt a")).toBeTruthy();
    expect(container.querySelector("#b")).toBeTruthy();
  });

  test("shows art directed thumbnails only for posts with a hero image", () => {
    render(<IndexPage {...createProps({}, [createPost("a"), createPost("b", { heroImage: null })])} />);

    const thumbnails = screen.getAllByRole("img");
    expect(thumbnails.map((image) => image.getAttribute("alt"))).toEqual(["Hero a"]);
    expect(thumbnails[0].getAttribute("data-media")).toBe(ART_DIRECTION_MEDIA.join(","));
  });

  test("paginates the home page", () => {
    const { container } = render(<IndexPage {...createProps()} />);

    expect(container.querySelector(".tag-title")).toBeNull();
    expect(paginationProps(container)).toEqual({ totalPageCount: 4, url: "/page", currentPage: 2 });
  });

  test("titles and paginates a tag page", () => {
    const { container } = render(<IndexPage {...createProps({ tag: "Design Pattern", kebabTag: "design-pattern" })} />);

    expect(container.querySelector(".tag-title")!.textContent).toBe("All posts related to Design Pattern");
    expect(paginationProps(container).url).toBe("/tags/design-pattern");
  });

  test("titles the home page with the author", () => {
    const head = renderHead(<Head {...({ location: { pathname: "/" } } as HeadProps)} />);

    expect(head.title?.trim()).toBe("Personal Blog [Ferry Suhandri]");
    expect(head.schema["@type"]).toBe("ProfilePage");
  });

  test("titles other pages as blog", () => {
    const head = renderHead(<Head {...({ location: { pathname: "/page/2" } } as HeadProps)} />);

    expect(head.title?.trim()).toBe("Blog");
    expect(head.canonical).toBe(`${siteMetadata.siteUrl}/page/2`);
  });
});
