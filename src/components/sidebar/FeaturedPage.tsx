/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import "./sidebar.css";
import { customPostContextByCode } from "../../../custom-post-by-slug";

const FeaturedPage = () => {
  const data: FeaturedPageData = useStaticQuery(graphql`
    query FeaturedPageQuery {
      allContentfulBlogPost(filter: { rating: { eq: 5 } }, sort: { createdAt: DESC }) {
        nodes {
          slug
          title
        }
      }
    }
  `);

  const { allContentfulBlogPost }: FeaturedPageData = data;
  return (
    allContentfulBlogPost && (
      <>
        <div className="second-header">Featured Post</div>
        <ul>
          {allContentfulBlogPost.nodes.map((node) => {
            return (
              <li key={node.slug}>
                <Link className="text-link" to={`/blog/${node.slug}`}>
                  <small className="title">{node.title}</small>
                </Link>
              </li>
            );
          })}
          {Array.from(customPostContextByCode.values()).map((vcaContext) => {
            return (
              <li key={vcaContext.slug}>
                <Link className="text-link" to={vcaContext.slug}>
                  <small className="title">{vcaContext.title}</small>
                </Link>
              </li>
            );
          })}
        </ul>
      </>
    )
  );
};

interface FeaturedPageData {
  allContentfulBlogPost: {
    nodes: Array<{
      slug: string;
      title: string;
    }>;
  };
}

export default FeaturedPage;
