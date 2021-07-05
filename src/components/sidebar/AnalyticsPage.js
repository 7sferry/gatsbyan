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
          allPageViews(sort: { order: DESC, fields: totalCount }, filter: { path: { regex: "/(^/blog?)(?!.*=)/" } }) {
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
      render={(data) => {
        const { allPageViews } = data;
        const titleByPath = {};
        data?.allContentfulBlogPost?.nodes?.forEach((n) => {
          return (titleByPath["/blog/" + n.slug] = n.title);
        });

        return (
          allPageViews && (
            <>
              <div className="second-header">Most Viewed</div>
              <ul>
                {allPageViews.nodes
                  .filter((view) => titleByPath[view.path])
                  .slice(0, 5)
                  .map((view) => {
                    return (
                      <li key={view.path}>
                        <small className="title">
                          <Link className="text-link" to={`${view.path}`}>
                            {titleByPath[view.path]}
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

export default AnalyticsPage;
