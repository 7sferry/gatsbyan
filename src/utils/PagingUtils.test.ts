/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { describe, expect, test } from "bun:test";
import { getPagingCalculator } from "./PagingUtils.tsx";

describe("getPagingCalculator", () => {
  test("returns previous and next page around the current page", () => {
    const paging = getPagingCalculator(4, 10);
    expect(paging.previousPage).toBe(3);
    expect(paging.nextPage).toBe(5);
  });

  test("starts from the first page near the beginning", () => {
    expect(getPagingCalculator(1, 10)).toEqual({ previousPage: 0, nextPage: 2, pageStart: 1, pageLimit: 5 });
    expect(getPagingCalculator(3, 10).pageStart).toBe(1);
  });

  test("centers the current page in the middle", () => {
    expect(getPagingCalculator(5, 10).pageStart).toBe(3);
    expect(getPagingCalculator(8, 10).pageStart).toBe(6);
  });

  test("shows the last pages near the end", () => {
    expect(getPagingCalculator(9, 10).pageStart).toBe(6);
    expect(getPagingCalculator(10, 10).pageStart).toBe(6);
  });

  test("shows every page when there are fewer pages than the page count", () => {
    expect(getPagingCalculator(3, 3)).toEqual({ previousPage: 2, nextPage: 4, pageStart: 1, pageLimit: 3 });
    expect(getPagingCalculator(5, 5).pageStart).toBe(1);
  });
});
