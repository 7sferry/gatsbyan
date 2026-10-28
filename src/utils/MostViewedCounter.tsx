/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/

import { AnalyticsData, MostViewedNode } from "../types/DataTypes.ts";
import { graphql, useStaticQuery } from "gatsby";

const MOST_VIEWED_COUNT = 5;
const MIN_CUT_PATH_LENGTH = 60;

function postPathOf(path: string, titleByPath: Map<string, string>, postPaths: string[]) {
  if (titleByPath.has(path)) {
    return path;
  }
  if (path.length < MIN_CUT_PATH_LENGTH) {
    return undefined;
  }
  const matches = postPaths.filter((postPath) => postPath.startsWith(path));
  return matches.length === 1 ? matches[0] : undefined;
}

export function fetchMostViewed(titleByPath: Map<string, string>): MostViewedNode[] | undefined {
  const analyticsData: AnalyticsData = useStaticQuery(graphql`
    query AnalyticsPageQuery {
      allPageViews(sort: { totalCount: DESC }) {
        nodes {
          path
          totalCount
        }
      }
    }
  `);

  const nodes = analyticsData?.allPageViews?.nodes;
  if (!nodes) {
    return undefined;
  }
  const postPaths = [...titleByPath.keys()];
  const countByPath = new Map<string, number>();
  for (const node of nodes) {
    const path = node && postPathOf(node.path, titleByPath, postPaths);
    if (path) {
      countByPath.set(path, (countByPath.get(path) ?? 0) + node.totalCount);
    }
  }
  return [...countByPath]
    .sort(([, first], [, second]) => second - first)
    .slice(0, MOST_VIEWED_COUNT)
    .map(([path]) => ({ path, title: titleByPath.get(path) || "" }));
}
