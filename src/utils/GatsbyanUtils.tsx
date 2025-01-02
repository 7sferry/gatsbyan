/************************
 * Made by [MR Ferry™]  *
 * on March 2020        *
 ************************/

import slugify from "@sindresorhus/slugify";

export const kebabCase = (str: string) => {
  return slugify(str);
};

export const getPlurals = (count: number) => {
  return count > 1 ? "s" : "";
};
