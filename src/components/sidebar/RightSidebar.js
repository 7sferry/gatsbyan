/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { Link } from "gatsby";
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
      render={data => (
        <>
          <div className="sidebar-main ">
            <ul>
              <h3>Most Viewed</h3>
              {data.allPageViews.nodes.map(node => {
                return (
                  <li key={node.path}>
                    <Link className="text-link" to={`${node.path}`}>
                      <small className="title">{startCase(node.path.replace(/^\/blog\/+/i, ""))}</small>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul>
              <h3>Top Rated</h3>
              {data.allContentfulBlogPost.nodes.map(node => {
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
      )}
    />
  );
};

export default RightSidebar;
