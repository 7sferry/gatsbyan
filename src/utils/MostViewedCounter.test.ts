/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, Mock, test } from "bun:test";
import { useStaticQuery } from "gatsby";
import { fetchMostViewed } from "./MostViewedCounter.tsx";

const useStaticQueryMock = useStaticQuery as unknown as Mock<() => unknown>;

describe("fetchMostViewed", () => {
  afterEach(() => {
    useStaticQueryMock.mockReset();
  });

  test("keeps only known blog paths in view order", () => {
    useStaticQueryMock.mockReturnValue({
      allPageViews: {
        nodes: [{ path: "/blog/b" }, { path: "/" }, null, { path: "/blog/a" }, { path: "/blog/deleted" }],
      },
    });
    const titleByPath = new Map([
      ["/blog/a", "Post A"],
      ["/blog/b", "Post B"],
    ]);

    expect(fetchMostViewed(titleByPath)).toEqual([
      { path: "/blog/b", title: "Post B" },
      { path: "/blog/a", title: "Post A" },
    ]);
  });

  test("returns undefined when there is no analytics data", () => {
    useStaticQueryMock.mockReturnValue({});
    expect(fetchMostViewed(new Map())).toBeUndefined();
  });
});
