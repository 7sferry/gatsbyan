import Layout from "../components/layout";
import SEO from "../components/seo";
import "./blog-post.css";
import Sidebar from "../components/sidebar/Sidebar";
import CustomShareBlock from "../components/CustomShareBlock";
import { getPlurals, getTechTags } from "../components/constant";
import React from "react";
import { graphql } from "gatsby";
import get from "lodash/get";

class BlogPostTemplate extends React.Component {
  render() {
    const post = get(this.props, "data.contentfulBlogPost");
    const site = get(this.props, "data.site.siteMetadata");
    const timeToRead = post.body.childMarkdownRemark.timeToRead;
    const url = `${site.url}/blog/${post.slug}`;
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
              <CustomShareBlock
                title={post.title}
                siteName={site.title}
                url={url}
              />
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
        url
      }
    }
  }
`;
