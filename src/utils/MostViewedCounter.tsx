/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/

/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/
import { AnalyticsData, MostViewedAttr } from "../types/DataTypes.ts";
import { graphql, useStaticQuery } from "gatsby";

function getMostViewed(): MostViewedAttr {
  const analyticsData: AnalyticsData = useStaticQuery(graphql`
      query AnalyticsPageQuery {
          allPageViews(sort: { totalCount: DESC }, filter: { path: { regex: "/^\/blog\/(?!$)(?!.*(%|\\?|=|&)).*$/" } }, limit: 5) {
              nodes {
                  path
              }
          }
          allContentfulBlogPost {
              nodes {
                  slug
                  title
              }
          }
      }
  `);

  const titleByPath: any = {};
  analyticsData?.allContentfulBlogPost?.nodes?.forEach((n) => {
    titleByPath["/blog/" + n.slug] = n.title;
  });

  let analyticNodePaths = analyticsData?.allPageViews?.nodes?.map((node) => node?.path);
  return { analyticNodePaths, titleByPath };
}

export default getMostViewed;
