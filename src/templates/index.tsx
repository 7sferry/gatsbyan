/************************
 * Author: [MR FERRY™]  *
 * August 2020          *
 ************************/

import React from "react";
import { GatsbyImage } from "gatsby-plugin-image";
import { graphql, HeadProps, Link } from "gatsby";

import PaginationElement from "../components/PaginationElement.tsx";
import { getPlurals, getPostTags, getPublishDate } from "../utils/GatsbyanUtils";
import "./index.css";
import { IndexProp } from "../types/DataTypes";
import Seo, { Seo } from "../components/Seo.tsx";
import Layout from "../components/Layout.tsx";

function IndexPage(props: IndexProp) {
  const { pageContext, data } = props;
  const { allContentfulBlogPost: contents } = data;
  const { nodes: posts, pageInfo } = contents;
  const kebabTag = pageContext.kebabTag;
  const paginationUrl = kebabTag ? `/tags/${kebabTag}` : `/page`;

  return (
    <Layout>
      <div className="post-main">
        {kebabTag && (
          <div className="tag-title">
            All posts related to <b>{pageContext.tag}</b>
          </div>
        )}
        {posts.map((post) => {
          const tags = post.tags;
          const { childMarkdownRemark } = post.body;
          const timeToRead = childMarkdownRemark.timeToRead;
          return (
            <div id={post.id} key={post.id} className="d-block blog-content">
              <div className="post-container">
                <div className="title posted">
                  <Link to={`/blog/${post.slug}`} className="text-link">
                    {post.title}
                  </Link>
                </div>
                <div className="title text-info">
                  <span className="page-info">{getPublishDate(post.publishDate)}</span>
                  <span className="page-info">
                    {timeToRead} min{getPlurals(timeToRead)} read
                  </span>
                  <br />
                  <span className="page-info">{getPostTags(tags)}</span>
                </div>
                <div className="pt-1">
                  {post.heroImage && (
                    <GatsbyImage
                      image={post.heroImage.gatsbyImageData}
                      className="index-thumbnail"
                      alt={post.heroImage.title}
                    />
                  )}
                  <p>{childMarkdownRemark.excerpt}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="text-center">
          <PaginationElement
            totalPageCount={pageInfo.pageCount}
            url={paginationUrl}
            currentPage={pageInfo.currentPage}
            refine={() => {}}
          />
        </div>
      </div>
    </Layout>
  );
}

export const pageQuery = graphql`
  query HomeQuery($skip: Int, $limit: Int, $tag: String) {
    allContentfulBlogPost(skip: $skip, limit: $limit, sort: { publishDate: DESC }, filter: { tags: { eq: $tag } }) {
      nodes {
        slug
        body {
          childMarkdownRemark {
            timeToRead
            excerpt(pruneLength: 365)
          }
        }
        tags
        title
        publishDate
        heroImage {
          gatsbyImageData(resizingBehavior: THUMB, cropFocus: FACES, placeholder: BLURRED, layout: FIXED)
          title
        }
        id
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        perPage
        currentPage
        pageCount
        itemCount
      }
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`;

export default IndexPage;

export function Head({ location }: HeadProps) {
  return <Seo title={"Blog"} path={location?.pathname} />;
}
