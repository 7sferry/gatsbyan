/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React from "react";
import { graphql, Link, StaticQuery } from "gatsby";
import "./sidebar.css";

const AnalyticsPage = () => {
  return (
    <StaticQuery
      query={graphql`
        query AnalyticsPageQuery {
          allPageViews(sort: { totalCount: DESC }, filter: { path: { regex: "/(^/blog?)(?!.*=)/" } }) {
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
      `}
      render={(data: AnalyticsData) => {
        const { allPageViews } = data;
        const titleByPath = new Map<string, string>();
        data?.allContentfulBlogPost?.nodes?.forEach((n) => {
          titleByPath.set("/blog/" + n.slug, n.title);
        });

        return (
          allPageViews && (
            <>
              <div className="second-header">Most Viewed</div>
              <ul>
                {allPageViews.nodes
                  .filter((view) => titleByPath.get(view.path))
                  .slice(0, 5)
                  .map((view) => {
                    return (
                      <li key={view.path}>
                        <small className="title">
                          <Link className="text-link" to={`${view.path}`}>
                            {titleByPath.get(view.path)}
                          </Link>
                        </small>
                      </li>
                    );
                  })}
              </ul>
            </>
          )
        );
      }}
    />
  );
};

interface AnalyticsData {
  allPageViews: {
    nodes: Array<{
      path: string;
    }>;
  };
  allContentfulBlogPost: {
    nodes: Array<{
      slug: string;
      title: string;
    }>;
  };
}

export default AnalyticsPage;
