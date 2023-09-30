/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import "./sidebar.css";
import { FeaturedPageData } from "../../types/DataTypes";

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
          <li>
            <Link className="text-link" to={"/blog/value-averaging-calculator"}>
              <small className="title">{"Value Averaging Calculator"}</small>
            </Link>
          </li>
        </ul>
      </>
    )
  );
};

export default FeaturedPage;
