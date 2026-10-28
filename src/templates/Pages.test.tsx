/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import React from "react";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { HeadProps } from "gatsby";
import ArchivePage, { Head as ArchiveHead } from "./archive.tsx";
import robot from "./robot404.tsx";
import NotFoundPage, { Head as NotFoundHead } from "../pages/404.tsx";
import ValueAveragingCalculator, {
  config,
  Head as ValueAveragingHead,
} from "../pages/features/value-averaging-calculator.tsx";
import { mockStaticQueries, siteMetadata, useStaticQueryMock } from "../test/staticQuery.ts";
import { renderHead } from "../test/renderHead.ts";

const location = (pathname: string) => ({ location: { pathname } }) as HeadProps;

describe("pages", () => {
  beforeEach(() => {
    mockStaticQueries({
      SiteMetadata: { site: { siteMetadata } },
      BlogPageSlug: { site: { siteMetadata: { repo: siteMetadata.repo } } },
      anonymous: { site: { siteMetadata } },
    });
  });

  afterEach(() => {
    useStaticQueryMock.mockReset();
  });

  describe("archive", () => {
    test("shows the archive with tags for mobile", () => {
      const { container } = render(<ArchivePage />);

      expect(container.querySelector(".mobile-only [data-slice=Tags]")).toBeTruthy();
      expect(container.querySelector(".post-main > [data-slice=ArchiveContainer]")).toBeTruthy();
    });

    test("titles the page", () => {
      expect(renderHead(<ArchiveHead {...location("/archive")} />).title?.trim()).toBe("Archive");
    });
  });

  describe("404", () => {
    // checked on the server markup, because happy-dom cannot parse the robot svg
    test("shows the lost robot", () => {
      const markup = renderToStaticMarkup(<NotFoundPage />);

      expect(markup).toContain(`<section class="post-main"><div>${robot}</div></section>`);
      expect(robot).toContain("<h1>Oops, You're Lost!</h1>");
    });

    test("titles the page", () => {
      expect(renderHead(<NotFoundHead />).title?.trim()).toBe("Lost Pages");
    });

    test("keeps search engines from indexing the page", () => {
      const head = renderHead(<NotFoundHead />);

      expect(head.canonical).toBeNull();
      expect(head.meta("robots")).toBe("noindex,follow");
      expect(head.meta("googlebot")).toBeNull();
    });

    test("robot explains the page does not exist", () => {
      expect(robot).toContain("Looks like page you entered does not exist.");
    });
  });

  describe("value averaging calculator", () => {
    test("explains the calculator and links the strategy post", () => {
      const { container } = render(<ValueAveragingCalculator />);

      expect(container.querySelector(".title")!.textContent).toBe("Value Averaging Calculator");
      expect(screen.getByRole("link", { name: "strategi saham" }).getAttribute("href")).toBe(
        "/blog/pengalaman-investasi-saham-selama-4-bulan#value-averaging"
      );
      expect(screen.getByRole("button", { name: "Calculate" })).toBeTruthy();
      expect(container.querySelector("[data-slice=Comment]")!.getAttribute("data-props")).toBe(
        JSON.stringify({ repo: siteMetadata.repo })
      );
    });

    test("is deferred", async () => {
      const getConfig = await config();

      expect(getConfig()).toEqual({ defer: true });
    });

    test("describes the calculator in the head", () => {
      const head = renderHead(<ValueAveragingHead {...location("/features/value-averaging-calculator")} />);

      expect(head.title).toBe(`Value Averaging Calculator`);
      expect(head.meta("description")).toBe(
        "Monthly Value Averaging Calculator. Kalkulator untuk menghitung Value Averaging secara bulanan"
      );
    });
  });
});
