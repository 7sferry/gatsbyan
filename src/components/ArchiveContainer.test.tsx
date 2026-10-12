/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, test } from "bun:test";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArchiveContainer from "./ArchiveContainer.tsx";
import { mockStaticQueries, useStaticQueryMock } from "../test/staticQuery.ts";

// sorted by publish date descending, like the archive query
const posts = [
  { slug: "a", title: "Post A", publishDate: "2024-03-10T05:00:00Z" },
  { slug: "b", title: "Post B", publishDate: "2024-03-02T05:00:00Z" },
  { slug: "c", title: "Post C", publishDate: "2024-01-15T05:00:00Z" },
  // already January 1st in Asia/Jakarta
  { slug: "d", title: "Post D", publishDate: "2023-12-31T20:00:00Z" },
  { slug: "e", title: "Post E", publishDate: "2023-11-05T05:00:00Z" },
];

const renderArchive = (nodes = posts) => {
  mockStaticQueries({ ArchiveQuery: { allContentfulBlogPost: { nodes } } });
  return render(<ArchiveContainer />);
};

const button = (name: string) => screen.getByRole("button", { name });

const isOpen = (name: string) => button(name).nextElementSibling!.classList.contains("visible");

const postLinks = (month: string) =>
  within(button(month).nextElementSibling as HTMLElement)
    .getAllByRole("link")
    .map((link) => [link.textContent, link.getAttribute("href")]);

describe("ArchiveContainer", () => {
  afterEach(() => {
    useStaticQueryMock.mockReset();
  });

  test("renders nothing without posts", () => {
    const { container } = renderArchive([]);

    expect(container.innerHTML).toBe("");
  });

  test("renders nothing once the posts are gone", () => {
    const { container, rerender } = renderArchive();

    mockStaticQueries({ ArchiveQuery: { allContentfulBlogPost: { nodes: [] } } });
    rerender(<ArchiveContainer />);

    expect(container.innerHTML).toBe("");
  });

  test("groups posts by year and month in Asia/Jakarta time", () => {
    renderArchive();

    expect(screen.getAllByRole("button").map((element) => element.textContent)).toEqual([
      "2024",
      "March",
      "January",
      "2023",
      "November",
    ]);
    expect(postLinks("March")).toEqual([
      ["Post A", "/blog/a"],
      ["Post B", "/blog/b"],
    ]);
    expect(postLinks("January")).toEqual([
      ["Post C", "/blog/c"],
      ["Post D", "/blog/d"],
    ]);
    expect(postLinks("November")).toEqual([["Post E", "/blog/e"]]);
  });

  test("shows the publish time as a tooltip", () => {
    renderArchive();

    expect(screen.getByText("Post D").closest("li")!.getAttribute("data-tooltip")).toBe("Mon. Jan 1st, 2024 03:00 AM");
  });

  test("opens the latest year and month", () => {
    renderArchive();

    expect([isOpen("2024"), isOpen("March"), isOpen("January"), isOpen("2023"), isOpen("November")]).toEqual([
      true,
      true,
      false,
      false,
      false,
    ]);
  });

  test("toggles a month", async () => {
    renderArchive();

    await userEvent.click(button("January"));
    expect(isOpen("January")).toBe(true);

    await userEvent.click(button("March"));
    expect(isOpen("March")).toBe(false);
  });

  test("closes the months of a closed year", async () => {
    renderArchive();

    await userEvent.click(button("2024"));
    expect(isOpen("2024")).toBe(false);

    await userEvent.click(button("2024"));
    expect([isOpen("2024"), isOpen("March")]).toEqual([true, false]);
  });

  test("opens another year", async () => {
    renderArchive();

    await userEvent.click(button("2023"));
    await userEvent.click(button("November"));

    expect([isOpen("2023"), isOpen("November"), isOpen("2024")]).toEqual([true, true, true]);
  });
});
