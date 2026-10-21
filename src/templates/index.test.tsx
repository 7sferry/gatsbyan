/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import React from "react";
import { render, screen, within } from "@testing-library/react";
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

const createProps = (
  pageContext: Record<string, unknown> = {},
  posts = [createPost("a"), createPost("b")],
  currentPage = 2
) =>
  ({
    data: {
      allContentfulBlogPost: {
        nodes: posts,
        pageInfo: { currentPage, pageCount: 4, hasNextPage: true, hasPreviousPage: true, perPage: 10, itemCount: 2 },
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

  test("headlines the first home page with the site name", () => {
    render(<IndexPage {...createProps({}, undefined, 1)} />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Blog Ferry Suhandri");
  });

  test("leaves the headline out of later and tag pages", () => {
    render(<IndexPage {...createProps({ tag: "Java", kebabTag: "java" }, undefined, 1)} />);
    render(<IndexPage {...createProps()} />);

    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
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

  const renderIndexHead = (pathname: string, pageContext: Record<string, unknown> = {}) =>
    renderHead(<Head {...({ location: { pathname }, pageContext } as unknown as React.ComponentProps<typeof Head>)} />);

  test("titles the home page with the author", () => {
    const head = renderIndexHead("/");

    expect(head.title).toBe("Blog Ferry Suhandri");
    expect(head.schema["@type"]).toBe("ProfilePage");
  });

  test("titles other pages with their page number", () => {
    const head = renderIndexHead("/page/2", { skip: 10, limit: 10 });

    expect(head.title?.trim()).toBe("Blog - Page 2");
    expect(head.meta("description")).toBe("Blog - Page 2");
    expect(head.canonical).toBe(`${siteMetadata.siteUrl}/page/2`);
  });

  test("titles tag pages with the tag", () => {
    const head = renderIndexHead("/tags/java", { tag: "Java", skip: 0, limit: 10 });

    expect(head.title?.trim()).toBe("All posts related to Java");
    expect(head.meta("description")).toBe("All posts related to Java");
  });

  test("titles later tag pages with the tag and page number", () => {
    const head = renderIndexHead("/tags/java/3", { tag: "Java", skip: 20, limit: 10 });

    expect(head.title?.trim()).toBe("All posts related to Java - Page 3");
  });
});
