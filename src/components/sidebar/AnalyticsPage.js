/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React from "react";
import { graphql, Link, StaticQuery } from "gatsby";
import "./sidebar.css";
import { capital as startCase } from "case";

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
            }
          }
        }
      `}
      render={(data) => {
        const { allPageViews } = data;
        const { nodes } = data?.allContentfulBlogPost;
        const slugs = nodes?.map((n) => "/blog/" + n.slug);
        return (
          allPageViews &&
          slugs && (
            <>
              <div className="second-header">Most Viewed</div>
              <ul>
                {allPageViews.nodes
                  .filter((view) => slugs.includes(view.path))
                  .slice(0, 5)
                  .map((node) => {
                    return (
                      <li key={node.path}>
                        <small className="title">
                          <Link className="text-link" to={`${node.path}`}>
                            {startCase(node.path.replace(/^\/blog\/+/i, ""))}
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
