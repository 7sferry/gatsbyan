/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, setSystemTime, test } from "bun:test";
import React from "react";
import { render, screen } from "@testing-library/react";
import BlogPostTemplate, { Head } from "./blog-post.tsx";
import { BlogPostProp } from "../types/DataTypes.ts";
import { mockStaticQueries, siteMetadata, useStaticQueryMock } from "../test/staticQuery.ts";
import { ART_DIRECTION_MEDIA, createImages } from "../test/fixtures.ts";
import { renderHead } from "../test/renderHead.ts";

const createProps = (post: Record<string, unknown> = {}) =>
  ({
    data: {
      contentfulBlogPost: {
        title: "Belajar Spring",
        slug: "belajar-spring",
        publishDate: "2024-01-15T05:00:00Z",
        updatedAt: "2024-01-15T05:00:00Z",
        sys: { revision: 1 },
        lang: ["id"],
        body: { childMarkdownRemark: { html: "<p>Isi tulisan</p>", timeToRead: 5 } },
        description: { description: "Tulisan tentang Spring" },
        heroImage: {
          ...createImages("hero"),
          title: "Unsplash",
          file: { url: "//images.ctfassets.net/hero.jpg" },
        },
        tags: ["Spring", "Java"],
        ...post,
      },
      site: {
        siteMetadata: { siteUrl: siteMetadata.siteUrl, repo: siteMetadata.repo, realName: siteMetadata.realName },
      },
    },
    location: { pathname: "/blog/belajar-spring" },
  }) as unknown as BlogPostProp;

describe("blog post template", () => {
  beforeEach(() => {
    mockStaticQueries({ SiteMetadata: { site: { siteMetadata } }, anonymous: { site: { siteMetadata } } });
    setSystemTime(new Date("2024-06-15T00:00:00Z"));
  });

  afterEach(() => {
    useStaticQueryMock.mockReset();
    setSystemTime();
  });

  test("shows the title, publish time, reading time and tags", () => {
    render(<BlogPostTemplate {...createProps()} />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Belajar Spring");
    expect(screen.getByText("Mon. Jan 15th, 2024 12:00 PM")).toBeTruthy();
    expect(screen.getByText("5 mins read")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Spring" }).getAttribute("href")).toBe("/tags/spring");
    expect(screen.getByRole("link", { name: "Java" }).getAttribute("href")).toBe("/tags/java");
  });

  test("uses singular reading time for one minute", () => {
    render(<BlogPostTemplate {...createProps({ body: { childMarkdownRemark: { html: "", timeToRead: 1 } } })} />);

    expect(screen.getByText("1 min read")).toBeTruthy();
  });

  test("renders the post body and comments", () => {
    const { container } = render(<BlogPostTemplate {...createProps()} />);

    expect(container.querySelector(".post-container")!.innerHTML).toBe("<p>Isi tulisan</p>");
    expect(container.querySelector("[data-slice=Comment]")!.getAttribute("data-props")).toBe(
      JSON.stringify({ repo: siteMetadata.repo })
    );
  });

  test("shows the art directed hero image with its source", () => {
    render(<BlogPostTemplate {...createProps()} />);

    const hero = screen.getByRole("img", { name: "Belajar Spring" });
    expect(hero.getAttribute("src")).toBe("/hero-original.jpg");
    expect(hero.getAttribute("data-media")).toBe(ART_DIRECTION_MEDIA.join(","));
    expect(screen.getByText("Source: Unsplash")).toBeTruthy();
  });

  test("leaves out the hero image when there is none", () => {
    const { container } = render(<BlogPostTemplate {...createProps({ heroImage: null })} />);

    expect(container.querySelector(".hero")!.innerHTML).toBe("");
  });

  test("shows when a heavily revised post was updated long after publishing", () => {
    render(<BlogPostTemplate {...createProps({ sys: { revision: 6 }, updatedAt: "2024-04-15T00:00:00Z" })} />);

    const updated = screen.getByText("updated 2 months ago");
    expect(updated.getAttribute("data-tooltip")).toBe("Mon. Apr 15th, 2024 07:00 AM");
  });

  test("hides the update for few revisions or recent updates", () => {
    const { container, rerender } = render(
      <BlogPostTemplate {...createProps({ sys: { revision: 5 }, updatedAt: "2024-04-15T00:00:00Z" })} />
    );
    expect(container.querySelector(".updated-time")).toBeNull();

    rerender(<BlogPostTemplate {...createProps({ sys: { revision: 6 }, updatedAt: "2024-02-10T00:00:00Z" })} />);
    expect(container.querySelector(".updated-time")).toBeNull();
  });

  test("describes the post in the head", () => {
    const head = renderHead(<Head {...createProps()} />);

    expect(head.title).toBe(`Belajar Spring`);
    expect(head.canonical).toBe(`${siteMetadata.siteUrl}/blog/belajar-spring`);
    expect(head.meta("description")).toBe("Tulisan tentang Spring");
    expect(head.meta("og:image")).toBe("https://images.ctfassets.net/hero.jpg");
    expect(head.meta("twitter:data1")).toBe("5 mins read");
    expect(head.schema["@type"]).toBe("TechArticle");
  });
});
