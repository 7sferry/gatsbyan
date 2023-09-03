/************************
 * Author: [MR FERRY™]  *
 * August 2020          *
 ************************/

import React from "react";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { graphql, Link } from "gatsby";

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import Pagination from "../components/Pagination";
import { getPlurals, getPostTags, getPublishDate } from "../utils/GatsbyanUtils";
import "./index.css";

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
            <div id={post.id} key={post.id} className="d-block pb-3 blog-content">
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
                    <GatsbyImage image={post.heroImage.gatsbyImageData} className="index-thumbnail" alt={"ferr"} />
                  )}
                  <p>{childMarkdownRemark.excerpt}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="text-center mt-4">
          <Pagination totalPageCount={pageInfo.pageCount} url={paginationUrl} currentPage={pageInfo.currentPage} />
        </div>
      </div>
    </Layout>
  );
}

interface IndexProp {
  data: IndexData;
  pageContext: IndexContextProp;
}

interface IndexData {
  allContentfulBlogPost: {
    nodes: Array<{
      slug: string;
      body: {
        childMarkdownRemark: {
          timeToRead: number;
          excerpt: string;
        };
      };
      tags: Array<string>;
      title: string;
      publishDate: Date;
      heroImage: {
        gatsbyImageData: IGatsbyImageData;
      };
      id: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      perPage: number;
      currentPage: number;
      pageCount: number;
      itemCount: number;
    };
  };
  site: {
    siteMetadata: {
      siteUrl: string;
    };
  };
}

interface IndexContextProp {
  limit: number;
  skip: number;
  tag: string;
  kebabTag: string;
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

export function Head({ location }: any) {
  return <Seo title={"Blog"} path={location?.pathname} />;
}
