/************************
 * Made by [MR Ferry™]  *
 * on March 2020        *
 ************************/

import slugify from "@sindresorhus/slugify";

export const PAGE_COUNT = 5;
export const SEARCH_COUNT = 7;
export const DEFAULT_ICON_SIZE = 20;

export const kebabCase = (str: string) => {
  return slugify(str);
};

export const getPlurals = (count: number) => {
  return count > 1 ? "s" : "";
};
