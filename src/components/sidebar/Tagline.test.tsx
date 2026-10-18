/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe } from "bun:test";

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
});
