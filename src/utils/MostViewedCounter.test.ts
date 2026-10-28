/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, test } from "bun:test";
import { fetchMostViewed } from "./MostViewedCounter.tsx";
import { useStaticQueryMock } from "../test/staticQuery.ts";

const longPath = "/blog/tutorial-menggunakan-twin-gamepad-joystik-terdeteksi-sebagai-xbox-controller";
const cutLongPath = "/blog/tutorial-menggunakan-twin-gamepad-joystik-terdeteksi-sebagai-xbox-cont";

const mockPageViews = (nodes: unknown[]) => useStaticQueryMock.mockReturnValue({ allPageViews: { nodes } });

describe("fetchMostViewed", () => {
  afterEach(() => {
    useStaticQueryMock.mockReset();
  });

  test("keeps only known blog paths in view order", () => {
    mockPageViews([
      { path: "/blog/b", totalCount: 40 },
      { path: "/", totalCount: 30 },
      null,
      { path: "/blog/a", totalCount: 20 },
      { path: "/blog/deleted", totalCount: 10 },
    ]);
    const titleByPath = new Map([
      ["/blog/a", "Post A"],
      ["/blog/b", "Post B"],
    ]);

    expect(fetchMostViewed(titleByPath)).toEqual([
      { path: "/blog/b", title: "Post B" },
      { path: "/blog/a", title: "Post A" },
    ]);
  });

  test("merges a path cut by GA4 into its post and ranks by the sum", () => {
    mockPageViews([
      { path: "/blog/a", totalCount: 50 },
      { path: longPath, totalCount: 30 },
      { path: cutLongPath, totalCount: 25 },
    ]);
    const titleByPath = new Map([
      ["/blog/a", "Post A"],
      [longPath, "Long Post"],
    ]);

    expect(fetchMostViewed(titleByPath)).toEqual([
      { path: longPath, title: "Long Post" },
      { path: "/blog/a", title: "Post A" },
    ]);
  });

  test("drops a cut path that starts two post paths but keeps their exact paths", () => {
    const otherLongPath = `${cutLongPath}roller-wireless`;
    mockPageViews([
      { path: cutLongPath, totalCount: 90 },
      { path: longPath, totalCount: 20 },
      { path: otherLongPath, totalCount: 10 },
    ]);
    const titleByPath = new Map([
      [longPath, "Long Post"],
      [otherLongPath, "Other Long Post"],
    ]);

    expect(fetchMostViewed(titleByPath)).toEqual([
      { path: longPath, title: "Long Post" },
      { path: otherLongPath, title: "Other Long Post" },
    ]);
  });

  test("matches cut paths of posts that differ after the first 60 characters", () => {
    const sharedStart = "/blog/".padEnd(70, "x");
    const firstPath = `${sharedStart}a-first-post-with-a-long-tail`;
    const secondPath = `${sharedStart}b-second-post-with-a-long-tail`;
    mockPageViews([
      { path: firstPath.slice(0, 76), totalCount: 20 },
      { path: secondPath.slice(0, 76), totalCount: 10 },
    ]);
    const titleByPath = new Map([
      [firstPath, "First Post"],
      [secondPath, "Second Post"],
    ]);

    expect(fetchMostViewed(titleByPath)).toEqual([
      { path: firstPath, title: "First Post" },
      { path: secondPath, title: "Second Post" },
    ]);
  });

  test("drops a path shorter than 60 characters that starts a post path", () => {
    mockPageViews([
      { path: longPath.slice(0, 59), totalCount: 20 },
      { path: "/blog/a", totalCount: 10 },
    ]);
    const titleByPath = new Map([
      [longPath, "Long Post"],
      ["/blog/abc", "Post ABC"],
    ]);

    expect(fetchMostViewed(titleByPath)).toEqual([]);
  });

  test("returns at most five posts", () => {
    const paths = ["a", "b", "c", "d", "e", "f"].map((slug) => `/blog/${slug}`);
    mockPageViews(paths.map((path, index) => ({ path, totalCount: 60 - index })));
    const titleByPath = new Map(paths.map((path) => [path, path]));

    expect(fetchMostViewed(titleByPath)?.map((node) => node.path)).toEqual(paths.slice(0, 5));
  });

  test("returns undefined when there is no analytics data", () => {
    useStaticQueryMock.mockReturnValue({});
    expect(fetchMostViewed(new Map())).toBeUndefined();
  });
});
