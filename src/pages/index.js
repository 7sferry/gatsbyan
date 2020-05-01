import React from "react";
import Img from "gatsby-image";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import Sidebar from "../components/sidebar/Sidebar";
import Pagination from "../components/Pagination";
import { getPlurals, getTechTags, getDate } from "../utils/GatsbyanUtils";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import "../components/pagination.css";

class IndexPage extends React.Component {
  render() {
    const contents = this.props.data.allContentfulBlogPost;
    const posts = contents.edges;
    const pageInfo = contents.pageInfo;
    const tag = this.props.pageContext.tag;
    const url = tag ? `/tags/${tag}` : ``;

    const metadata = this.props.data.site.siteMetadata;
    return (
      <Layout>
        <SEO title="Home" url={metadata.siteUrl} />
        <div className="index-main">
          <div className="sidebar border-right px-4 py-2">
            <Sidebar />
          </div>
          <div className="post-main">
            {posts.map(post => {
              const tags = post.node.tags;
              const timeToRead = post.node.body.childMarkdownRemark.timeToRead;
              return (
                <div id={post.node.id} key={post.node.id} className="container d-block pb-3">
                  <h3 className="title">
                    <Link to={`/blog/${post.node.slug}/`} className="text-link">
                      {post.node.title}
                    </Link>
                  </h3>
                  <div className="title text-info">
                    <span className="page-info">{getDate(post.node.publishDate)}</span>
                    <span className="page-info">
                      {timeToRead} min{getPlurals(timeToRead)} read
                    </span>
                    <br />
                    <span className="page-info">{getTechTags(tags)}</span>
                  </div>
                  <div className="d-inline-block text-justify pt-1">
                    {post.node.heroImage ? <Img style={{ maxHeight: "160px", maxWidth: "160px" }} className="index-thumbnail" fixed={post.node.heroImage.fixed} /> : <></>}
                    <p>
                      {post.node.body.childMarkdownRemark.excerpt}
                      <Link to={`/blog/${post.node.slug}`} className="text-primary">
                        <small className="d-inline ml-1"> Read full post</small>
                      </Link>
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="text-center mt-4">
              <Pagination totalPageCount={pageInfo.pageCount} url={url} currentPage={pageInfo.currentPage} />
            </div>
          </div>
          <div className="sidebar px-4 py-2">{/*<Sidebar />*/}</div>
        </div>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query HomeQuery($skip: Int, $limit: Int = 10, $tag: String) {
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
            fixed(width: 160) {
              base64
              width
              height
              src
              srcSet
              srcSetWebp
              srcWebp
              tracedSVG
            }
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
