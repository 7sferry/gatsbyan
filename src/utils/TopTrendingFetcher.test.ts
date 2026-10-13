/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, Mock, test } from "bun:test";
import { act, renderHook, waitFor } from "@testing-library/react";
import { fetchTopTrending } from "./TopTrendingFetcher.tsx";
import { mockTrendingApi } from "../test/fixtures.ts";

const titleByPath = new Map([
  ["/blog/a", "Post A"],
  ["/blog/b", "Post B"],
]);

describe("fetchTopTrending", () => {
  let fetchMock: Mock<typeof fetch>;

  afterEach(() => {
    fetchMock.mockRestore();
  });

  test("returns trending posts with their titles in report order", async () => {
    fetchMock = mockTrendingApi([
      { path: "/blog/b", value: 9 },
      { path: "/about", value: 7 },
      { path: "/blog/a", value: 3 },
    ]);

    const { result } = renderHook(() => fetchTopTrending(titleByPath));

    expect(result.current).toEqual([]);
    await waitFor(() =>
      expect(result.current).toEqual([
        { path: "/blog/b", title: "Post B" },
        { path: "/blog/a", title: "Post A" },
      ])
    );
    expect(fetchMock).toHaveBeenCalledWith("/api/trending");
  });

  test("fetches only once across renders", async () => {
    fetchMock = mockTrendingApi([{ path: "/blog/a", value: 1 }]);

    const { result, rerender } = renderHook(() => fetchTopTrending(titleByPath));
    await waitFor(() => expect(result.current).toHaveLength(1));
    rerender();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("returns nothing when the api fails", async () => {
    fetchMock = mockTrendingApi([{ path: "/blog/a", value: 1 }], 500);

    const { result } = renderHook(() => fetchTopTrending(titleByPath));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));

    expect(result.current).toEqual([]);
  });
});
