/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, test } from "bun:test";
import React from "react";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { ClientSide } from "./ClientSide.tsx";
import CustomPageContainer from "./CustomPageContainer.tsx";
import { Footer } from "./Footer.tsx";
import Layout from "./Layout.tsx";
import MySvg from "./MySvg.tsx";
import { NoClientSide } from "./NoClientSide.tsx";
import Socials from "./Socials.tsx";
import { mockStaticQueries, siteMetadata, useStaticQueryMock } from "../test/staticQuery.ts";

const slices = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("[data-slice]"), (slice) => [
    slice.getAttribute("data-slice"),
    JSON.parse(slice.getAttribute("data-props")!),
  ]);

describe("ClientSide", () => {
  test("renders children only in the browser", () => {
    expect(renderToStaticMarkup(<ClientSide>client</ClientSide>)).toBe("");

    render(<ClientSide>client</ClientSide>);

    expect(screen.getByText("client")).toBeTruthy();
  });
});

describe("NoClientSide", () => {
  test("renders children only on the server", () => {
    expect(renderToStaticMarkup(<NoClientSide>server</NoClientSide>)).toBe("server");

    render(<NoClientSide>server</NoClientSide>);

    expect(screen.queryByText("server")).toBeNull();
  });
});

describe("MySvg", () => {
  test("defaults to the text size and color", () => {
    const { container } = render(<MySvg viewBox="0 0 10 10" path="M0 0" />);
    const svg = container.querySelector("svg")!;

    expect(svg.getAttribute("width")).toBe("1em");
    expect(svg.getAttribute("height")).toBe("1em");
    expect(svg.getAttribute("viewBox")).toBe("0 0 10 10");
    expect(svg.querySelector("path")!.getAttribute("fill")).toBe("currentColor");
    expect(svg.querySelector("path")!.getAttribute("d")).toBe("M0 0");
    expect(svg.querySelector("title")).toBeNull();
  });

  test("uses the given size, color and title", () => {
    const { container } = render(<MySvg viewBox="0 0 10 10" path="M0 0" size={26} color="#fff" title="Icon" />);
    const svg = container.querySelector("svg")!;

    expect(svg.getAttribute("width")).toBe("26");
    expect(svg.querySelector("path")!.getAttribute("fill")).toBe("#fff");
    expect(svg.querySelector("title")!.textContent).toBe("Icon");
  });
});

describe("Socials", () => {
  test("links every profile in a new tab", () => {
    render(<Socials />);

    const links = screen.getAllByRole("link");
    expect(links.map((link) => [link.querySelector("span")!.title, link.getAttribute("href")])).toEqual([
      ["LinkedIn", "https://www.linkedin.com/in/7sferry"],
      ["GitHub", "https://github.com/7sferry"],
      ["Instagram", "https://www.instagram.com/7sferry/"],
      ["StackOverFlow", "https://stackoverflow.com/users/14286378/ferry"],
      ["Resume", "https://ferry.netlify.app"],
      ["CrystalKnow", "https://www.crystalknows.com/p/ferry"],
    ]);
    links.forEach((link) => {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });
  });
});

describe("with site metadata", () => {
  afterEach(() => {
    useStaticQueryMock.mockReset();
  });

  test("Footer shows the copyright", () => {
    mockStaticQueries({ SiteMetadata: { site: { siteMetadata } } });

    render(<Footer />);

    expect(screen.getByText(siteMetadata.copyright).closest("footer")).toBeTruthy();
  });

  test("Layout places the content between both sidebars", () => {
    mockStaticQueries({ SiteMetadata: { site: { siteMetadata } } });

    const { container } = render(
      <Layout>
        <p>content</p>
      </Layout>
    );

    expect(slices(container).map(([alias]) => alias)).toEqual(["Header", "Bio", "Socials", "Tags", "RightSidebar"]);
    expect(container.querySelector(".post-main")!.innerHTML).toBe("<p>content</p>");
    expect(container.querySelector(".right-sidebar [data-slice=RightSidebar]")).toBeTruthy();
    expect(screen.getByText(siteMetadata.copyright)).toBeTruthy();
  });

  test("CustomPageContainer shows the title, content and comments", () => {
    mockStaticQueries({ SiteMetadata: { site: { siteMetadata } } });

    const { container } = render(
      <CustomPageContainer
        site={{ url: siteMetadata.siteUrl, repo: siteMetadata.repo }}
        customPost={{ title: "Calculator", description: "", publishDate: "2022-10-23", lang: "id" }}
      >
        <p>body</p>
      </CustomPageContainer>
    );

    expect(container.querySelector(".title")!.textContent).toBe("Calculator");
    expect(container.querySelector(".post-container")!.innerHTML).toBe("<p>body</p>");
    expect(slices(container.querySelector(".post-main")!).at(-1)).toEqual(["Comment", { repo: siteMetadata.repo }]);
  });
});
