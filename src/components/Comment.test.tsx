/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import React from "react";
import { act, render } from "@testing-library/react";
import Comment from "./Comment.tsx";

// window.innerHeight is 768, so the comment loads once more than half of a 2000px page was seen
const scrollTo = (scrollTop: number) => {
  document.documentElement.scrollTop = scrollTop;
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
};

const utterancesScript = (container: HTMLElement) => container.querySelector(".utterances script");

describe("Comment", () => {
  beforeEach(() => {
    Object.defineProperty(document.body, "clientHeight", { configurable: true, value: 2000 });
  });

  afterEach(() => {
    delete (document.body as { clientHeight?: number }).clientHeight;
    document.documentElement.scrollTop = 0;
  });

  test("waits until the reader scrolls past half of the page", () => {
    const { container } = render(<Comment repo="7sferry/gatsbyan" />);
    expect(utterancesScript(container)).toBeNull();

    scrollTo(100);

    expect(utterancesScript(container)).toBeNull();
  });

  test("loads utterances for the repo after scrolling past half of the page", () => {
    const { container } = render(<Comment repo="7sferry/gatsbyan" />);

    scrollTo(600);

    const script = utterancesScript(container)!;
    expect(Object.fromEntries(Array.from(script.attributes, (attribute) => [attribute.name, attribute.value]))).toEqual(
      {
        src: "https://utteranc.es/client.js",
        repo: "7sferry/gatsbyan",
        theme: "github-dark-orange",
        label: "komentar",
        async: "true",
        "issue-term": "pathname",
        crossorigin: "anonymous",
      }
    );
  });

  test("loads utterances only once", () => {
    const { container } = render(<Comment repo="7sferry/gatsbyan" />);

    scrollTo(600);
    scrollTo(1200);

    expect(container.querySelectorAll(".utterances script")).toHaveLength(1);
  });
});
