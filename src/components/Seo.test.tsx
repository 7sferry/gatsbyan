/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import React from "react";
import Seo from "./Seo.tsx";
import SeoPost from "./SeoPost.tsx";
import { renderHead } from "../test/renderHead.ts";
import { mockStaticQueries, siteMetadata, useStaticQueryMock } from "../test/staticQuery.ts";

const { siteUrl, realName, author, description: siteDescription } = siteMetadata;

describe("Seo", () => {
  beforeEach(() => {
    mockStaticQueries({ anonymous: { site: { siteMetadata } } });
  });

  afterEach(() => {
    useStaticQueryMock.mockReset();
  });

  test("describes the home page as the author's profile", () => {
    const head = renderHead(<Seo title="Personal Blog" path="/" />);

    expect(head.markup).toContain('<html lang="id">');
    expect(head.canonical).toBe(`${siteUrl}/`);
    expect(head.meta("description")).toBe(siteDescription);
    expect(head.schema["@type"]).toBe("ProfilePage");
    expect(head.schema.mainEntity).toMatchObject({ "@type": "Person", name: realName, url: siteUrl });
  });

  test("describes other pages with their title", () => {
    const head = renderHead(<Seo title="Archive" path="/archive" />);

    expect(head.title).toBe("Archive");
    expect(head.canonical).toBe(`${siteUrl}/archive`);
    expect(head.meta("description")).toBe("Archive");
    expect(head.meta("og:description")).toBe("Archive");
    expect(head.schema).toMatchObject({ "@type": "WebPage", "@id": `${siteUrl}/archive`, name: "Archive" });
  });

  test("names the site on the home page", () => {
    const head = renderHead(<Seo title="Personal Blog" path="/" />);

    expect(head.schemas[1]).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: `Blog ${realName}`,
      alternateName: [realName],
      url: `${siteUrl}/`,
    });
    expect(head.meta("og:site_name")).toBe(`Blog ${realName}`);
    expect(head.meta("application-name")).toBe(`Blog ${realName}`);
  });

  test("names the site only on the home page", () => {
    const head = renderHead(<Seo title="Archive" path="/archive" />);

    expect(head.schemas.map((schema) => schema["@type"])).toEqual(["WebPage"]);
  });

  test("links the author to the about page", () => {
    const head = renderHead(<Seo title="Archive" path="/archive" />);

    expect(head.markup).toContain(`<link rel="author" href="${siteUrl}/blog/berkenalan-dengan-ferry-suhandri"/>`);
  });

  test("prefers the given description", () => {
    const head = renderHead(<Seo title="Search" path="/search" description="Cari tulisan" />);

    expect(head.meta("description")).toBe("Cari tulisan");
    expect(head.meta("twitter:description")).toBe("Cari tulisan");
  });

  test("adds the author to feature page titles", () => {
    const head = renderHead(<Seo title="Value Averaging Calculator" path="/features/value-averaging-calculator" />);

    expect(head.title).toBe(`Value Averaging Calculator`);
  });

  test("shares the site photo on social media", () => {
    const head = renderHead(<Seo title="Archive" path="/archive" />);

    expect(head.meta("og:image")).toBe(`${siteUrl}/ferry-suhandri-large.jpg`);
    expect(head.meta("twitter:image")).toBe(`${siteUrl}/ferry-suhandri.jpg`);
    expect(head.meta("og:site_name")).toBe(`Blog ${realName}`);
    expect(head.meta("twitter:creator")).toBe(author);
  });
});

describe("SeoPost", () => {
  const renderPost = (props: Partial<React.ComponentProps<typeof SeoPost>> = {}) =>
    renderHead(
      <SeoPost
        title="Belajar Spring"
        description="Tulisan tentang Spring"
        lang="id"
        image="//images.ctfassets.net/hero.jpg"
        path="/blog/belajar-spring"
        publishDate="2024-01-15T05:00:00Z"
        tags={["Spring", "Football"]}
        timeToRead="5 mins read"
        {...props}
      />
    );

  beforeEach(() => {
    mockStaticQueries({ anonymous: { site: { siteMetadata } } });
  });

  afterEach(() => {
    useStaticQueryMock.mockReset();
  });

  test("describes the post as an article", () => {
    const head = renderPost();

    expect(head.title).toBe(`Belajar Spring`);
    expect(head.canonical).toBe(`${siteUrl}/blog/belajar-spring`);
    expect(head.meta("description")).toBe("Tulisan tentang Spring");
    expect(head.meta("og:type")).toBe("article");
    expect(head.meta("application-name")).toBe(`Blog ${realName}`);
    expect(head.meta("og:image")).toBe("https://images.ctfassets.net/hero.jpg");
    expect(head.meta("twitter:data1")).toBe("5 mins read");
    expect(head.schema).toMatchObject({
      headline: "Belajar Spring",
      url: `${siteUrl}/blog/belajar-spring`,
      image: ["https://images.ctfassets.net/hero.jpg"],
      articleSection: ["Spring", "Football"],
      about: [
        { "@type": "Thing", name: "Spring" },
        { "@type": "Thing", name: "Football" },
      ],
    });
  });

  test("links the author to the about page", () => {
    expect(renderPost().markup).toContain(
      `<link rel="author" href="${siteUrl}/blog/berkenalan-dengan-ferry-suhandri"/>`
    );
  });

  test("uses the post language", () => {
    const head = renderPost({ lang: "en" });

    expect(head.markup).toContain('<html lang="en">');
    expect(head.meta("content-language")).toBe("en");
  });

  test("marks posts with a tech tag as tech articles", () => {
    expect(renderPost({ tags: ["Java"] }).schema["@type"]).toBe("TechArticle");
    expect(renderPost({ tags: ["Football"] }).schema["@type"]).toBe("BlogPosting");
  });

  test("uses the site update time for older posts", () => {
    const head = renderPost({ publishDate: "2023-01-15T05:00:00Z" });

    expect(head.schema.dateModified).toBe(siteMetadata.updatedAt);
    expect(head.meta("article:modified_time")).toBe(siteMetadata.updatedAt);
  });

  test("uses the publish time for posts newer than the site update", () => {
    const head = renderPost({ publishDate: "2025-01-15T05:00:00Z" });

    expect(head.schema.dateModified).toBe(head.schema.datePublished);
    expect(head.meta("article:published_time")).toBe(head.schema.datePublished);
  });
});
