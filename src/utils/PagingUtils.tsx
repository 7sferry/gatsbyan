/************************
 * Made by [MR Ferry™]  *
 * on Januari 2025      *
 ************************/

import { PaginationProp } from "../types/DataTypes.ts";

export const PAGE_COUNT = 5;
export const SEARCH_COUNT = 7;
export const DEFAULT_ICON_SIZE = 20;
export const getPagingCalculator = (currentPage: number, totalPage: number): PaginationProp => {
  const range = Math.floor(PAGE_COUNT / 2);
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;
  let minRange = currentPage - range;
  let maxRange = currentPage + range;

  function getStartRange() {
    if (minRange <= 0 || totalPage <= PAGE_COUNT) {
      return 1;
    }
    if (maxRange > totalPage) {
      return totalPage - PAGE_COUNT + 1;
    }
    return minRange;
  }

  let pageStart = getStartRange();
  return {
    nextPage: nextPage,
    previousPage: previousPage,
    pageStart: pageStart,
    pageLimit: Math.min(totalPage, PAGE_COUNT),
  };
};
