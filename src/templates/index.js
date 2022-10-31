/************************
 * Author: [MR FERRY™]  *
 * August 2020          *
 ************************/

import React from "react";
import { GatsbyImage } from "gatsby-plugin-image";
import { graphql, Link } from "gatsby";

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import Pagination from "../components/Pagination";
import { getPlurals, getPublishDate, getPostTags } from "../utils/GatsbyanUtils";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

class IndexPage extends React.Component {
  render() {
    const { allContentfulBlogPost: contents } = this.props.data;
    const { nodes: posts, pageInfo } = contents;
    const kebabTag = this.props.pageContext.kebabTag;
    const paginationUrl = kebabTag ? `/tags/${kebabTag}` : `/page`;
    const title = () => {
      if (paginationUrl.startsWith("/tags")) {
        return this.props.pageContext.tag;
      }
      if (paginationUrl.startsWith("/page") && pageInfo.currentPage !== 1) {
        return "Page " + pageInfo.currentPage;
      }
      return "Blog";
    };

    const metadata = this.props.data.site.siteMetadata;
    return (
      <Layout>
        <Seo title={title()} url={metadata.siteUrl} />
        <div className="post-main">
          {kebabTag && (
            <div className="tag-title">
              All posts related to <b>{this.props.pageContext.tag}</b>
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
}

export const pageQuery = graphql`
  query HomeQuery($skip: Int, $limit: Int, $tag: String) {
    allContentfulBlogPost(
      skip: $skip
      limit: $limit
      sort: { fields: publishDate, order: DESC }
      filter: { tags: { eq: $tag } }
    ) {
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
          gatsbyImageData(resizingBehavior: THUMB, formats: WEBP, cropFocus: FACES, placeholder: BLURRED, layout: FIXED)
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
