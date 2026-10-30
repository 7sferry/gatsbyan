/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, test } from "bun:test";
import { ExternalLinks, openExternalLinkInNewTab } from "./ExternalLinks.ts";

const addLink = (html: string) => {
  document.body.innerHTML = html;
  return document.querySelector("a")!;
};

const clickOn = (target: EventTarget) => openExternalLinkInNewTab({ target } as unknown as Event);

afterEach(() => {
  document.body.innerHTML = "";
});

describe("openExternalLinkInNewTab", () => {
  test("opens an external link in a new tab", () => {
    const anchor = addLink(`<a href="https://github.com/mrferry">GitHub</a>`);
    clickOn(anchor);
    expect(anchor.getAttribute("target")).toBe("_blank");
    expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
  });

  test("handles a click on an element inside the link", () => {
    const anchor = addLink(`<a href="https://example.com"><span>Example</span></a>`);
    clickOn(anchor.querySelector("span")!);
    expect(anchor.getAttribute("target")).toBe("_blank");
  });

  test("keeps the existing rel values", () => {
    const anchor = addLink(`<a href="https://example.com" rel="nofollow">Example</a>`);
    clickOn(anchor);
    expect(anchor.getAttribute("rel")).toBe("nofollow noopener noreferrer");
  });

  test.each([
    ["a relative path", "/blog/hello"],
    ["an absolute url on the same origin", "http://localhost/blog/hello"],
    ["a hash", "#comments"],
    ["mailto", "mailto:someone@example.com"],
    ["tel", "tel:+6281234567890"],
  ])("leaves %s in the same tab", (_, href) => {
    const anchor = addLink(`<a href="${href}">Link</a>`);
    clickOn(anchor);
    expect(anchor.hasAttribute("target")).toBe(false);
    expect(anchor.hasAttribute("rel")).toBe(false);
  });

  test("respects a target set by the link", () => {
    const anchor = addLink(`<a href="https://example.com" target="_self">Example</a>`);
    clickOn(anchor);
    expect(anchor.getAttribute("target")).toBe("_self");
  });

  test("ignores clicks outside links", () => {
    document.body.innerHTML = `<p>Text</p>`;
    expect(() => clickOn(document.querySelector("p")!)).not.toThrow();
    expect(() => clickOn(document)).not.toThrow();
  });
});

describe("ExternalLinks", () => {
  test("handles clicks on the document", () => {
    ExternalLinks();
    const anchor = addLink(`<a href="https://example.com">Example</a>`);
    anchor.addEventListener("click", (event) => event.preventDefault());
    anchor.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(anchor.getAttribute("target")).toBe("_blank");
    document.removeEventListener("click", openExternalLinkInNewTab);
  });
});
