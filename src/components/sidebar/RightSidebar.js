/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React from "react";
import { graphql, Link, StaticQuery } from "gatsby";
import "./sidebar.css";
import { capital as startCase } from "case";

const RightSidebar = () => {
  return (
    <StaticQuery
      query={graphql`
        query RightSidebarQuery {
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
              <div className="second-header">Most Viewed</div>
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

              <div className="second-header">Featured Post</div>
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
