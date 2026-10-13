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

const highlightsOf = (title: string) =>
  Array.from(excerptOf(title).querySelectorAll("ais-highlight-0000000000"), (element) => element.textContent);

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
    expect(highlightsOf("Post")).toEqual(["java"]);
  });

  test("keeps the highlight markup intact when the query is part of the highlight tag", async () => {
    await renderHits(createSearchClient([createHit("a", "Post", "high availability itu penting")]), "high");
    await screen.findByRole("link", { name: "Post" });

    expect(excerptOf("Post").textContent).toBe("high availability itu penting");
    expect(highlightsOf("Post")).toEqual(["high"]);
  });

  test("highlights the query in an excerpt that Algolia did not highlight, ignoring case", async () => {
    // the fake client highlights case sensitively, so "Java" comes back without highlight
    await renderHits(createSearchClient([createHit("a", "Post", "Belajar Java itu seru")]));
    await screen.findByRole("link", { name: "Post" });

    expect(excerptOf("Post").textContent).toBe("Belajar Java itu seru");
    expect(highlightsOf("Post")).toEqual(["Java"]);
  });

  test("highlights the typos that Algolia highlighted in other hits", async () => {
    const tagged = (word: string) => `<ais-highlight-0000000000>${word}</ais-highlight-0000000000>`;
    await renderHits(
      createSearchClient([
        createHit("a", "Post A", `kata ${tagged("fery")} dan ${tagged("Feli")}`),
        createHit("b", "Post B", "kata fery dan feli dan FERI"),
        createHit("c", "Fery menulis", "tanpa kata"),
      ]),
      "feri"
    );
    await screen.findByRole("link", { name: "Post A" });

    expect(highlightsOf("Post A")).toEqual(["fery", "Feli"]);
    expect(excerptOf("Post B").textContent).toBe("kata fery dan feli dan FERI");
    expect(highlightsOf("Post B")).toEqual(["fery", "feli", "FERI"]);
    expect(
      screen.getByRole("link", { name: "Fery menulis" }).querySelector("h3 ais-highlight-0000000000")?.textContent
    ).toBe("Fery");
  });

  test("highlights the typos of the query in a hit that Algolia did not highlight", async () => {
    await renderHits(
      createSearchClient([
        createHit("a", "Seputar film", "kartun seperti Tom &amp; Jerry dan Woody"),
        createHit("b", "Piala dunia", "Untungnya Ferran Torres mencetak gol"),
        createHit("c", "Berry", "buah berry"),
      ]),
      "ferry"
    );
    await screen.findByRole("link", { name: "Seputar film" });

    expect(highlightsOf("Seputar film")).toEqual(["Jerry"]);
    expect(highlightsOf("Piala dunia")).toEqual(["Ferran"]);
    expect(highlightsOf("Berry")).toEqual(["berry"]);
    expect(screen.getByRole("link", { name: "Berry" }).querySelector("h3 ais-highlight-0000000000")?.textContent).toBe(
      "Berry"
    );
  });

  test("allows one typo in a query word of four to seven letters", async () => {
    await renderHits(
      createSearchClient([createHit("a", "Post A", "jawa jaav jav jaw jwa kopi"), createHit("b", "Post B", "kucing")]),
      "java"
    );
    await screen.findByRole("link", { name: "Post A" });

    expect(highlightsOf("Post A")).toEqual(["jawa", "jaav", "jav"]);
    expect(highlightsOf("Post B")).toEqual([]);
  });

  test("allows two typos in a query word of eight letters or more", async () => {
    await renderHits(createSearchClient([createHit("a", "Post", "pemrogaman pemogaman pemogamn")]), "pemrograman");
    await screen.findByRole("link", { name: "Post" });

    expect(highlightsOf("Post")).toEqual(["pemrogaman", "pemogaman"]);
  });

  test("allows no typo in a query word of three letters or less", async () => {
    await renderHits(createSearchClient([createHit("a", "Post", "jaw jaa")]), "jav");
    await screen.findByRole("link", { name: "Post" });

    expect(highlightsOf("Post")).toEqual([]);
  });

  test("highlights typos of every query word", async () => {
    await renderHits(createSearchClient([createHit("a", "Post", "belajr jawa dasar")]), "belajar java");
    await screen.findByRole("link", { name: "Post" });

    expect(highlightsOf("Post")).toEqual(["belajr", "jawa"]);
  });

  test("does not add typo highlights to a hit that Algolia highlighted", async () => {
    await renderHits(createSearchClient([createHit("a", "Post", "ferry dan Jerry")]), "ferry");
    await screen.findByRole("link", { name: "Post" });

    expect(highlightsOf("Post")).toEqual(["ferry"]);
  });

  test("does not highlight inside HTML entities or existing highlights", async () => {
    await renderHits(
      createSearchClient([
        createHit("a", "Post A", "<ais-highlight-0000000000>quot</ais-highlight-0000000000> java"),
        createHit("b", "Post B", "quot &quot;java&quot;"),
      ]),
      "java"
    );
    await screen.findByRole("link", { name: "Post B" });

    expect(excerptOf("Post B").textContent).toBe('quot "java"');
    expect(highlightsOf("Post B")).toEqual(["quot", "java"]);
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
