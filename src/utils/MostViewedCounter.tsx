/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/

import { AnalyticsData } from "../types/DataTypes.ts";
import { graphql, useStaticQuery } from "gatsby";

export function fetchMostViewed(titleByPath: Map<string, string>) {
  const analyticsData: AnalyticsData = useStaticQuery(graphql`
    query AnalyticsPageQuery {
      allPageViews(sort: { totalCount: DESC }, limit: 5) {
        nodes {
          path
        }
      }
    }
  `);

  return analyticsData?.allPageViews?.nodes?.map((node) => ({
    path: node?.path,
    title: titleByPath.get(node?.path),
  }));
}
