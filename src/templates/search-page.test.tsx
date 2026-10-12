/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeadProps } from "gatsby";
import { createHit, createSearchClient, lastQuery } from "../test/searchClient.ts";
import { mockStaticQueries, siteMetadata, useStaticQueryMock } from "../test/staticQuery.ts";
import { renderHead } from "../test/renderHead.ts";

let algoliaClient = createSearchClient();
const algoliasearch = mock(() => algoliaClient);
mock.module("algoliasearch", () => ({ algoliasearch }));

// Imported lazily so Algolia is mocked before the page loads it
const loadSearchPage = () => import("./search-page.tsx");

const renderSearchPage = async () => {
  const { default: SearchPage } = await loadSearchPage();
  const view = render(<SearchPage />);
  // let the first, empty search settle
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  return view;
};

describe("search page", () => {
  beforeEach(() => {
    process.env.GATSBY_ALGOLIA_APP_ID = "app-id";
    process.env.GATSBY_ALGOLIA_SEARCH_KEY = "search-key";
    process.env.GATSBY_ALGOLIA_INDEX_NAME = "blog";
    algoliaClient = createSearchClient([createHit("belajar-java", "Belajar java", "isi java")]);
    algoliasearch.mockClear();
    mockStaticQueries({ SiteMetadata: { site: { siteMetadata } }, anonymous: { site: { siteMetadata } } });
  });

  afterEach(() => {
    useStaticQueryMock.mockReset();
  });

  test("connects to Algolia with the search key", async () => {
    await renderSearchPage();

    expect(algoliasearch).toHaveBeenCalledWith("app-id", "search-key");
  });

  test("puts the voice search inside the search box", async () => {
    const { container } = await renderSearchPage();

    const wrapper = container.querySelector(".search-box-wrapper")!;
    expect(Array.from(wrapper.children, (child) => child.className || child.getAttribute("data-slice"))).toEqual([
      "ais-SearchBox search-box",
      "VoiceSearchElement",
    ]);
    expect(wrapper.querySelector("[data-slice=VoiceSearchElement]")!.getAttribute("data-props")).toBe(
      JSON.stringify({ searchAsYouSpeak: false })
    );
  });

  test("renders hits and pagination slices after the search box", async () => {
    const { container } = await renderSearchPage();

    expect(
      Array.from(container.querySelectorAll(".post-main > [data-slice]"), (slice) => slice.getAttribute("data-slice"))
    ).toEqual(["SearchHitsResult", "PaginationSearchResult"]);
  });

  test("does not ask Algolia without a query", async () => {
    await renderSearchPage();
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)));

    expect(algoliaClient.search).not.toHaveBeenCalled();
  });

  test("asks Algolia once the query is submitted", async () => {
    await renderSearchPage();

    await userEvent.type(screen.getByRole("searchbox"), "java");
    expect(algoliaClient.search).not.toHaveBeenCalled();
    await userEvent.type(screen.getByRole("searchbox"), "{Enter}");

    await waitFor(() => expect(lastQuery(algoliaClient)).toMatchObject({ query: "java", hitsPerPage: 7 }));
    expect(algoliaClient.search.mock.lastCall![0][0].indexName).toBe("blog");
  });

  test("titles the page", async () => {
    const { Head } = await loadSearchPage();

    const head = renderHead(<Head {...({ location: { pathname: "/search" } } as HeadProps)} />);

    expect(head.title?.trim()).toBe("Search");
    expect(head.canonical).toBe(`${siteMetadata.siteUrl}/search`);
  });
});
