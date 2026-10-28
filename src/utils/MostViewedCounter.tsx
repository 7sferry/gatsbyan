/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/

import { AnalyticsData, MostViewedNode } from "../types/DataTypes.ts";
import { graphql, useStaticQuery } from "gatsby";

const MOST_VIEWED_COUNT = 5;
const CUT_PATH_LENGTH = 60;

const cutPath = (path: string) => path.slice(0, CUT_PATH_LENGTH);

function postPathByCutPath(titleByPath: Map<string, string>) {
  const postPaths = new Map<string, string | undefined>();
  for (const path of titleByPath.keys()) {
    const cut = cutPath(path);
    postPaths.set(cut, postPaths.has(cut) ? undefined : path);
  }
  return postPaths;
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
  const postPaths = postPathByCutPath(titleByPath);
  const countByPath = new Map<string, number>();
  for (const node of nodes) {
    const path = node && (titleByPath.has(node.path) ? node.path : postPaths.get(cutPath(node.path)));
    if (path) {
      countByPath.set(path, (countByPath.get(path) ?? 0) + node.totalCount);
    }
  }
  return [...countByPath]
    .sort(([, first], [, second]) => second - first)
    .slice(0, MOST_VIEWED_COUNT)
    .map(([path]) => ({ path, title: titleByPath.get(path) || "" }));
}
