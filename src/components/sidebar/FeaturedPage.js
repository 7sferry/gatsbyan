/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React from "react";
import { graphql, Link, StaticQuery } from "gatsby";
import "./sidebar.css";

const FeaturedPage = () => {
  return (
    <StaticQuery
      query={graphql`
        query FeaturedPageQuery {
          allContentfulBlogPost(filter: { rating: { eq: 5 } }, sort: { order: DESC, fields: createdAt }) {
            nodes {
              slug
              title
            }
          }
        }
      `}
      render={data => {
        const { allContentfulBlogPost } = data;
        return (
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
        );
      }}
    />
  );
};

export default FeaturedPage;
