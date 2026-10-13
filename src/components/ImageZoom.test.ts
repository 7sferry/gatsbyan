/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeAll, describe, expect, test } from "bun:test";
import { waitFor } from "@testing-library/react";
import { ImageZoom } from "./ImageZoom.tsx";

const overlay = () => document.querySelector(".gatsby-image-fullwidth-overlay");

// a boolean, because a failing expect on an element makes bun print the whole happy-dom tree, which takes ~350ms
const isClosed = () => overlay() === null;

const addImage = (html: string) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);
  return wrapper.querySelector("img")!;
};

const pressEscape = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

const openBlogImage = async () => {
  addImage(
    `<img class="gatsby-resp-image-image" src="http://localhost/diagram.png" alt="Diagram" title="Flow">`
  ).click();
  await waitFor(() => expect(overlay()?.classList.contains("is-open")).toBe(true));
};

describe("ImageZoom", () => {
  beforeAll(() => {
    ImageZoom();
  });

  afterEach(async () => {
    pressEscape();
    await waitFor(() => expect(isClosed()).toBe(true));
    document.body.innerHTML = "";
    window.scrollTo(0, 0);
  });

  test("adds its styles once", () => {
    ImageZoom();
    ImageZoom();

    expect(document.querySelectorAll("#gatsby-image-fullwidth-zoom-styles")).toHaveLength(1);
  });

  test("opens a blog image in full width", async () => {
    await openBlogImage();

    const zoomed = overlay()!.querySelector<HTMLImageElement>(".gatsby-image-fullwidth-viewer img")!;
    expect([zoomed.src, zoomed.alt, zoomed.title]).toEqual(["http://localhost/diagram.png", "Diagram", "Flow"]);
    expect(zoomed.classList.contains("is-open")).toBe(true);
    expect(document.body.classList.contains("gatsby-image-fullwidth-lock")).toBe(true);
  });

  test("zooms hero and thumbnail images too", async () => {
    addImage(`<div class="heroImage"><img src="http://localhost/hero.png" alt=""></div>`).click();
    await waitFor(() => expect(overlay()).not.toBeNull());
    pressEscape();
    await waitFor(() => expect(isClosed()).toBe(true));

    addImage(`<div class="index-thumbnail"><img src="http://localhost/thumb.png" alt=""></div>`).click();

    await waitFor(() => expect(overlay()?.querySelector("img")?.src).toBe("http://localhost/thumb.png"));
  });

  test("ignores other images", () => {
    addImage(`<img class="avatar" src="http://localhost/avatar.png" alt="">`).click();

    expect(overlay()).toBeNull();
  });

  test("opens only one zoom at a time", async () => {
    await openBlogImage();

    addImage(`<img class="gatsby-resp-image-image" src="http://localhost/other.png" alt="">`).click();

    expect(document.querySelectorAll(".gatsby-image-fullwidth-overlay")).toHaveLength(1);
  });

  test("closes with Escape", async () => {
    await openBlogImage();

    pressEscape();

    expect(overlay()!.classList.contains("is-open")).toBe(false);
    expect(document.body.classList.contains("gatsby-image-fullwidth-lock")).toBe(false);
    await waitFor(() => expect(isClosed()).toBe(true));
  });

  test("closes when the zoomed image is clicked", async () => {
    await openBlogImage();

    (overlay() as HTMLElement).click();

    await waitFor(() => expect(isClosed()).toBe(true));
  });

  test("closes after scrolling more than 300px", async () => {
    await openBlogImage();

    window.scrollTo(0, 200);
    window.dispatchEvent(new Event("scroll"));
    expect(overlay()!.classList.contains("is-open")).toBe(true);

    window.scrollTo(0, 400);
    window.dispatchEvent(new Event("scroll"));
    await waitFor(() => expect(isClosed()).toBe(true));
  });
});
