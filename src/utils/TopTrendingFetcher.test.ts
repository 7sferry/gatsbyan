/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, Mock, spyOn, test } from "bun:test";
import { act, renderHook, waitFor } from "@testing-library/react";
import { clearTopTrendingCache, fetchTopTrending } from "./TopTrendingFetcher.tsx";
import { mockTrendingApi, trendingApi } from "../test/fixtures.ts";

const titleByPath = new Map([
  ["/blog/a", "Post A"],
  ["/blog/b", "Post B"],
]);

describe("fetchTopTrending", () => {
  let fetchMock: Mock<typeof fetch>;

  afterEach(() => {
    fetchMock.mockRestore();
    clearTopTrendingCache();
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

  test("reuses the reports after a page change without fetching again", async () => {
    fetchMock = mockTrendingApi([{ path: "/blog/a", value: 1 }]);
    const first = renderHook(() => fetchTopTrending(titleByPath));
    await waitFor(() => expect(first.result.current.length === 1).toBe(true));
    first.unmount();

    const { result } = renderHook(() => fetchTopTrending(titleByPath));

    expect(result.current).toEqual([{ path: "/blog/a", title: "Post A" }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("shares one request between sidebars mounted at the same time", async () => {
    fetchMock = mockTrendingApi([{ path: "/blog/a", value: 1 }]);

    const first = renderHook(() => fetchTopTrending(titleByPath));
    const second = renderHook(() => fetchTopTrending(titleByPath));
    await waitFor(() => expect(second.result.current.length === 1).toBe(true));

    expect(first.result.current).toEqual(second.result.current);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("fetches again after a reload", async () => {
    fetchMock = mockTrendingApi([{ path: "/blog/a", value: 1 }]);
    const first = renderHook(() => fetchTopTrending(titleByPath));
    await waitFor(() => expect(first.result.current.length === 1).toBe(true));
    first.unmount();
    clearTopTrendingCache();

    const { result } = renderHook(() => fetchTopTrending(titleByPath));
    await waitFor(() => expect(result.current.length === 1).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test("retries on the next page after a failure", async () => {
    fetchMock = mockTrendingApi([{ path: "/blog/a", value: 1 }], 500);
    const first = renderHook(() => fetchTopTrending(titleByPath));
    await waitFor(() => expect(fetchMock.mock.calls.length === 1).toBe(true));
    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));
    first.unmount();
    fetchMock.mockImplementation(trendingApi([{ path: "/blog/a", value: 1 }]));

    const { result } = renderHook(() => fetchTopTrending(titleByPath));
    await waitFor(() => expect(result.current.length === 1).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test("returns nothing when the api fails", async () => {
    fetchMock = mockTrendingApi([{ path: "/blog/a", value: 1 }], 500);

    const { result } = renderHook(() => fetchTopTrending(titleByPath));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));

    expect(result.current).toEqual([]);
  });

  test("returns nothing when the request fails", async () => {
    fetchMock = spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));

    const { result } = renderHook(() => fetchTopTrending(titleByPath));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));

    expect(result.current).toEqual([]);
  });

  test("returns nothing when the api answers with something other than a report", async () => {
    fetchMock = spyOn(globalThis, "fetch").mockResolvedValue(new Response("<html>Gateway Timeout</html>"));

    const { result } = renderHook(() => fetchTopTrending(titleByPath));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));

    expect(result.current).toEqual([]);
  });
});
