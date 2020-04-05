import Layout from "../components/Layout";
import SEO from "../components/SEO";
import "./blog-post.css";
import Sidebar from "../components/sidebar/Sidebar";
import Share from "../components/Share";
import { getPlurals, getTechTags } from "../components/Constant";
import React from "react";
import { graphql } from "gatsby";

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.contentfulBlogPost;
    const site = this.props.data.site.siteMetadata;
    const timeToRead = post.body.childMarkdownRemark.timeToRead;
    const url = `${site.siteUrl}/blog/${post.slug}`;

    return (
      <Layout>
        <SEO title={post.title} />
        <div className="post-page-main">
          <div className="sidebar border-right px-4 py-2">
            <Sidebar />
          </div>

          <div className="post-main">
            <SEO title={post.title} description={post.title} />
            <div>
              <h3 className="title">{post.title}</h3>
              <div className="title text-info">
                <span className="page-info">{post.publishDate}</span>
                <span className="page-info">
                  {timeToRead} min{getPlurals(timeToRead)} read
                </span>
                <br />
                <span className="page-info">{getTechTags(post.tags)}</span>
              </div>
              <div className="d-inline-block">
                <p
                  className="pt-3"
                  dangerouslySetInnerHTML={{
                    __html: post.body.childMarkdownRemark.html,
                  }}
                />
              </div>
              <Share title={post.title} siteName={site.title} url={url} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      publishDate(formatString: "MMMM Do, YYYY")
      body {
        childMarkdownRemark {
          html
          timeToRead
        }
      }
      tags
      slug
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`;
