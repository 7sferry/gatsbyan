/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, test } from "bun:test";
import fetchTitleByPath from "./AllPostFetcher.tsx";
import { useStaticQueryMock } from "../test/staticQuery.ts";

describe("fetchTitleByPath", () => {
  afterEach(() => {
    useStaticQueryMock.mockReset();
  });

  test("maps blog paths to titles", () => {
    useStaticQueryMock.mockReturnValue({
      allContentfulBlogPost: {
        nodes: [
          { slug: "hello-world", title: "Hello World" },
          { slug: "second-post", title: "Second Post" },
        ],
      },
    });

    expect(fetchTitleByPath()).toEqual(
      new Map([
        ["/blog/hello-world", "Hello World"],
        ["/blog/second-post", "Second Post"],
      ])
    );
  });

  test("returns an empty map when there is no data", () => {
    useStaticQueryMock.mockReturnValue(undefined);
    expect(fetchTitleByPath().size).toBe(0);
  });
});
