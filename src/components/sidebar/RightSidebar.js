/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React from "react";
import { graphql, Link, StaticQuery } from "gatsby";
import "./sidebar.css";
import { startCase } from "lodash";

const RightSidebar = () => {
  return (
    <StaticQuery
      query={graphql`
        query RigthSidebarQuery {
          allPageViews(
            sort: { order: DESC, fields: totalCount }
            filter: { path: { regex: "/.*(?<!/)$/" }, id: { regex: "/^/blog?/" } }
            limit: 5
          ) {
            nodes {
              path
            }
          }
          allContentfulBlogPost(filter: { rating: { eq: 5 } }, sort: { order: DESC, fields: createdAt }, limit: 5) {
            nodes {
              slug
              title
            }
          }
        }
      `}
      render={data => {
        const { allPageViews } = data;
        const { allContentfulBlogPost } = data;
        return (
          <>
            <div className="sidebar-main ">
              <h3>Most Viewed</h3>
              <ul>
                {allPageViews.nodes.map(node => {
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

              <h3>Top Rated</h3>
              <ul>
                {allContentfulBlogPost.nodes.map(node => {
                  return (
                    <li key={node.slug}>
                      <Link className="text-link" to={`/blog/${node.slug}`}>
                        <small className="title">{node.title}</small>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        );
      }}
    />
  );
};

export default RightSidebar;
