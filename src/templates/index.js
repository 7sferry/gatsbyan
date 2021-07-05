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
import "../components/pagination.css";

class IndexPage extends React.Component {
  render() {
    const { allContentfulBlogPost: contents } = this.props.data;
    const { edges: posts, pageInfo } = contents;
    const kebabTag = this.props.pageContext.kebabTag;
    const paginationUrl = kebabTag ? `/tags/${kebabTag}` : `/page`;

    const metadata = this.props.data.site.siteMetadata;
    return (
      <Layout>
        <Seo title="Ferry Suhandri" url={metadata.siteUrl} />
        <div className="post-main">
          {kebabTag && (
            <div className="tag-title">
              All posts related to <b>{this.props.pageContext.tag}</b>
            </div>
          )}
          {posts.map((post) => {
            const node = post.node;
            const tags = node.tags;
            const { childMarkdownRemark } = node.body;
            const timeToRead = childMarkdownRemark.timeToRead;
            return (
              <div id={node.id} key={node.id} className="d-block pb-3 blog-content">
                <div className="post-container">
                  <div className="title posted">
                    <Link to={`/blog/${node.slug}`} className="text-link">
                      {node.title}
                    </Link>
                  </div>
                  <div className="title text-info">
                    <span className="page-info">{getPublishDate(node.publishDate)}</span>
                    <span className="page-info">
                      {timeToRead} min{getPlurals(timeToRead)} read
                    </span>
                    <br />
                    <span className="page-info">{getPostTags(tags)}</span>
                  </div>
                  <div className="pt-1">
                    {node.heroImage && (
                      <GatsbyImage image={node.heroImage.gatsbyImageData} className="index-thumbnail" alt={"ferr"} />
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
      edges {
        node {
          slug
          body {
            childMarkdownRemark {
              timeToRead
              excerpt(pruneLength: 300)
            }
          }
          tags
          title
          publishDate
          heroImage {
            gatsbyImageData(
              resizingBehavior: THUMB
              formats: WEBP
              cropFocus: FACES
              placeholder: BLURRED
              layout: FIXED
            )
          }
          id
        }
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
