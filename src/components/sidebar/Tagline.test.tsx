/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import React from "react";
import { act, render, screen } from "@testing-library/react";
import { setupUser } from "../../test/user.ts";
import Tagline from "./Tagline.tsx";

const TAGLINE = "Software engineer who writes about Java, Spring and investing";

describe("Tagline", () => {
  let scrollHeight = 0;
  let lineHeightStyle: HTMLStyleElement;

  beforeEach(() => {
    // shadows the DOM's own scrollHeight, which is always 0 without layout
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", { configurable: true, get: () => scrollHeight });
    lineHeightStyle = document.createElement("style");
    lineHeightStyle.textContent = "small { line-height: 20px; }";
    document.head.appendChild(lineHeightStyle);
  });

  afterEach(() => {
    delete (HTMLElement.prototype as { scrollHeight?: number }).scrollHeight;
    lineHeightStyle.remove();
  });

  test("hides the toggle when the tagline fits in five lines", () => {
    scrollHeight = 100;

    render(<Tagline tagline={TAGLINE} />);

    expect(screen.getByText(TAGLINE).className).toBe("truncated");
    expect(screen.queryByRole("link")).toBeNull();
  });

  test("shows the toggle for a tagline longer than five lines", () => {
    scrollHeight = 120;

    render(<Tagline tagline={TAGLINE} />);

    expect(screen.getByRole("link", { name: "Read more" })).toBeTruthy();
  });

  test("expands and collapses a long tagline", async () => {
    const user = setupUser();
    scrollHeight = 200;
    render(<Tagline tagline={TAGLINE} />);

    await user.click(screen.getByRole("link", { name: "Read more" }));
    expect(screen.getByText(TAGLINE).className).toBe("expanded");

    await user.click(screen.getByRole("link", { name: "Read less" }));
    expect(screen.getByText(TAGLINE).className).toBe("truncated");
  });

  test("checks the height again when the window is resized", () => {
    scrollHeight = 10;
    render(<Tagline tagline={TAGLINE} />);

    scrollHeight = 200;
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(screen.getByRole("link", { name: "Read more" })).toBeTruthy();
  });
});
