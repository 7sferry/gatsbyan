/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { describe, expect, test } from "bun:test";
import React from "react";
import { screen, waitFor } from "@testing-library/react";
import SearchHitsResult from "./SearchHitsResult.tsx";
import { createHit, createSearchClient } from "../../test/searchClient.ts";
import { renderWithSearch } from "../../test/renderWithSearch.tsx";

// "w000 w001 ..." where word n starts at index 5n
const numberedWords = (count: number) =>
  Array.from({ length: count }, (_, i) => "w" + String(i).padStart(3, "0") + " ").join("");

const renderHits = async (client: ReturnType<typeof createSearchClient>, query = "java") => {
  const view = renderWithSearch(<SearchHitsResult />, client, query);
  await waitFor(() => expect(client.search).toHaveBeenCalled());
  return view;
};

const excerptOf = (title: string) =>
  screen.getByRole("link", { name: title }).closest(".search-result-container")!.querySelector(".ellipsis p")!;

describe("SearchHitsResult", () => {
  test("renders nothing without a query", async () => {
    const { container } = await renderHits(createSearchClient([createHit("a", "Java", "java")]), "");

    expect(container.innerHTML).toBe("");
  });

  test("tells when nothing matches", async () => {
    await renderHits(createSearchClient([]));

    expect(await screen.findByText("There were no results yet.")).toBeTruthy();
  });

  test("links every hit to its post with the highlighted title", async () => {
    await renderHits(
      createSearchClient([
        createHit("belajar-java", "Belajar java", "isi java"),
        createHit("spring-boot", "Spring Boot dengan java", "isi"),
      ])
    );

    const link = await screen.findByRole("link", { name: "Belajar java" });
    expect(link.getAttribute("href")).toBe("/blog/belajar-java");
    expect(link.querySelector("h3 ais-highlight-0000000000")?.textContent).toBe("java");
    expect(screen.getByRole("link", { name: "Spring Boot dengan java" }).getAttribute("href")).toBe(
      "/blog/spring-boot"
    );
  });

  test("shows the whole excerpt when the match is near the start", async () => {
    await renderHits(createSearchClient([createHit("a", "Post", "belajar java itu seru")]));
    await screen.findByRole("link", { name: "Post" });

    expect(excerptOf("Post").textContent).toBe("belajar java itu seru");
    expect(excerptOf("Post").querySelector("ais-highlight-0000000000")?.textContent).toBe("java");
  });

  test("starts the excerpt about a hundred characters before a match in the middle", async () => {
    const excerpt = (numberedWords(100) + "java " + numberedWords(100)).trimEnd();
    await renderHits(createSearchClient([createHit("a", "Post", excerpt)]));
    await screen.findByRole("link", { name: "Post" });

    // the match is at index 500, so the excerpt starts at the first word after index 400
    expect(excerptOf("Post").textContent).toBe(excerpt.substring(405));
  });

  test("starts the excerpt about three hundred characters before a match near the end", async () => {
    const excerpt = numberedWords(180) + "java end";
    await renderHits(createSearchClient([createHit("a", "Post", excerpt)]));
    await screen.findByRole("link", { name: "Post" });

    // the match is at index 900 with little text after it, so the excerpt starts after index 600
    expect(excerptOf("Post").textContent).toBe(excerpt.substring(605));
  });
});
