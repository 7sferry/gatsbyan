/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/

import { AnalyticsData } from "../types/DataTypes.ts";
import { graphql, useStaticQuery } from "gatsby";

function fetchTitleByPath(): Map<string, string> {
  const analyticsData: AnalyticsData = useStaticQuery(graphql`
    query AllPosts {
      allContentfulBlogPost {
        nodes {
          slug
          title
        }
      }
    }
  `);

  const titleByPath = new Map<string, string>();
  analyticsData?.allContentfulBlogPost?.nodes?.forEach((n) => {
    titleByPath.set("/blog/" + n.slug, n.title);
  });

  return titleByPath;
}

export default fetchTitleByPath;
