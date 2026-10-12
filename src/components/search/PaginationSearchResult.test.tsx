/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { describe, expect, test } from "bun:test";
import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaginationSearchResult from "./PaginationSearchResult.tsx";
import { createHit, createSearchClient, lastQuery } from "../../test/searchClient.ts";
import { renderWithSearch } from "../../test/renderWithSearch.tsx";

const hits = [createHit("a", "Post A", "java")];

const pageLink = (name: string) => screen.getByRole("link", { name });

describe("PaginationSearchResult", () => {
  test("renders nothing for a single page", async () => {
    const client = createSearchClient(hits, 1);
    const { container } = renderWithSearch(<PaginationSearchResult />, client);
    await waitFor(() => expect(client.search).toHaveBeenCalled());

    expect(container.innerHTML).toBe("");
  });

  test("links every page of the search results", async () => {
    renderWithSearch(<PaginationSearchResult />, createSearchClient(hits, 3));
    await screen.findByRole("link", { name: "Next" });

    expect(
      screen.getAllByRole("link").map((link) => [link.textContent, link.getAttribute("href"), link.className])
    ).toEqual([
      ["First", "/search", "page-number text-second-link"],
      ["Prev", "/search/0", "page-number text-second-link"],
      ["1", "/search", "text-second-link page-number current"],
      ["2", "/search/2", "text-second-link page-number "],
      ["3", "/search/3", "text-second-link page-number "],
      ["Next", "/search/2", "page-number text-second-link"],
      ["Last", "/search/3", "page-number text-second-link"],
    ]);
  });

  test("searches the clicked page without leaving the page", async () => {
    const client = createSearchClient(hits, 3);
    renderWithSearch(<PaginationSearchResult />, client);
    await screen.findByRole("link", { name: "2" });

    await userEvent.click(pageLink("2"));

    await waitFor(() => expect(lastQuery(client)?.page).toBe(1));
    await waitFor(() => expect(pageLink("2").className).toContain("current"));
    expect(window.location.pathname).toBe("/");
  });

  test("moves with Next, Prev, Last and First", async () => {
    const client = createSearchClient(hits, 3);
    renderWithSearch(<PaginationSearchResult />, client);
    await screen.findByRole("link", { name: "Next" });

    await userEvent.click(pageLink("Next"));
    await waitFor(() => expect(lastQuery(client)?.page).toBe(1));

    await userEvent.click(pageLink("Last"));
    await waitFor(() => expect(lastQuery(client)?.page).toBe(2));

    await userEvent.click(pageLink("Prev"));
    await waitFor(() => expect(lastQuery(client)?.page).toBe(1));

    await userEvent.click(pageLink("First"));
    await waitFor(() => expect(pageLink("1").className).toContain("current"));
  });
});
