/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, test } from "bun:test";
import { fetchFeaturedPages } from "./FeaturedPageFetcher.tsx";
import { getArchiveQuery } from "./GetArchiveQuery.tsx";
import { getTagsQuery } from "./GetTagsQuery.tsx";
import useSiteMetadata from "./SiteMetadata.tsx";
import { mockStaticQueries, siteMetadata, useStaticQueryMock } from "../test/staticQuery.ts";

describe("static query wrappers", () => {
  afterEach(() => {
    useStaticQueryMock.mockReset();
  });

  test("fetchFeaturedPages returns the featured posts", () => {
    const nodes = [{ slug: "pilihan-investasi", title: "Pilihan Investasi" }];
    mockStaticQueries({ FeaturedPageQuery: { allContentfulBlogPost: { nodes } } });

    expect(fetchFeaturedPages()).toEqual(nodes);
  });

  test("getArchiveQuery returns posts sorted by the query", () => {
    const data = { allContentfulBlogPost: { nodes: [{ slug: "a", title: "A", publishDate: "2024-01-01" }] } };
    mockStaticQueries({ ArchiveQuery: data });

    expect(getArchiveQuery()).toEqual(data);
    expect(useStaticQueryMock.mock.lastCall?.[0]).toContain("sort: { publishDate: DESC }");
  });

  test("getTagsQuery returns distinct tags", () => {
    const data = { allContentfulBlogPost: { tags: ["Java", "Spring"] } };
    mockStaticQueries({ Tags: data });

    expect(getTagsQuery()).toEqual(data);
  });

  test("useSiteMetadata returns the site", () => {
    mockStaticQueries({ SiteMetadata: { site: { siteMetadata } } });

    expect(useSiteMetadata()).toEqual({ siteMetadata });
  });
});
