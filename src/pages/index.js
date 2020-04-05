import React from "react";
import Img from "gatsby-image";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import Sidebar from "../components/sidebar/Sidebar";
import { getPlurals, getTechTags } from "../components/Constant";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

class IndexPage extends React.Component {
  render() {
    const contents = this.props.data.allContentfulBlogPost;
    const posts = contents.edges;
    const pageInfo = contents.pageInfo;
    const tag = this.props.pageContext.tag;
    const uri = tag ? `/tags/${tag}` : ``;

    return (
      <Layout>
        <SEO title="Home" keywords={[`gatsby`, `javascript`, `react`, `web development`, `blog`, `graphql`]} />
        <div className="index-main">
          <div className="sidebar border-right px-4 py-2">
            <Sidebar />
          </div>
          <div className="post-list-main">
            {posts.map(post => {
              const tags = post.node.tags;
              const timeToRead = post.node.body.childMarkdownRemark.timeToRead;
              return (
                <div id={post.node.id} key={post.node.id} className="container">
                  <h3 className="title">
                    <Link to={`/blog/${post.node.slug}`} className="text-link">
                      {post.node.title}
                    </Link>
                  </h3>
                  <div className="title text-info">
                    <span className="page-info">{post.node.publishDate}</span>
                    <span className="page-info">
                      {timeToRead} min{getPlurals(timeToRead)} read
                    </span>
                    <br />
                    <span className="page-info">{getTechTags(tags)}</span>
                  </div>
                  <div className="d-inline-block text-justify pt-1">
                    <Img className="index-thumbnail" fixed={post.node.heroImage.fixed} />
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
              {pageInfo.hasPreviousPage && (
                <Link
                  to={`${uri}/${pageInfo.currentPage === 2 ? `` : pageInfo.currentPage - 1}`}
                  rel="prev"
                  style={{ textDecoration: `none` }}
                >
                  <span className="text-link">← Previous Page</span>
                </Link>
              )}
              {pageInfo.hasNextPage && (
                <Link to={`${uri}/${pageInfo.currentPage + 1}`} rel="next" style={{ textDecoration: `none` }}>
                  <span className="text-link ml-5">Next Page →</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query HomeQuery($skip: Int, $limit: Int = 2, $tag: String) {
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
              excerpt(pruneLength: 600)
            }
          }
          tags
          title
          publishDate(formatString: "MMMM Do, YYYY")
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
      }
    }
  }
`;

export default IndexPage;
