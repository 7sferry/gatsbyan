import React from "react";
import { Link, graphql } from "gatsby";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Sidebar from "../components/sidebar/Sidebar";
import TechTag from "../components/tags/TechTag";
import Img from "gatsby-image";

const IndexPage = ({ data }) => {
  const posts = data.allMarkdownRemark.edges;
  const labels = data.site.siteMetadata.labels;
  const currentPage = 1;
  const nextPage = (currentPage + 1).toString();

  const getTechTags = tags => {
    const techTags = [];
    tags.forEach((tag, i) => {
      labels.forEach(label => {
        if (tag === label.tag) {
          techTags.push(
            <TechTag
              key={i}
              tag={label.tag}
              tech={label.tech}
              name={label.name}
              size={label.size}
              color={label.color}
            />
          );
        }
      });
    });
    return techTags;
  };

  return (
    <Layout>
      <SEO
        title="Home"
        keywords={[
          `gatsby`,
          `javascript`,
          `react`,
          `web development`,
          `blog`,
          `graphql`,
        ]}
      />
      <div className="index-main">
        <div className="sidebar border-right px-4 py-2">
          <Sidebar />
        </div>
        <div className="post-list-main">
          {posts.map(post => {
            const tags = post.node.frontmatter.tags;
            return (
              <div id={post.node.id} key={post.node.id} className="container text-justify mb-5">
                <h3 className="title">
                  <Link to={post.node.fields.slug} className="text-link">
                    {post.node.frontmatter.title}
                  </Link>
                </h3>
                <small className="d-block text-info posted">
                  <i className="d-block">Posted on {post.node.frontmatter.date} &nbsp;&nbsp;&nbsp; ({post.node.timeToRead} min read)</i>
                  {getTechTags(tags)}
                </small>
                <p className="d-inline-block">
                  <Img
                    className="index-thumbnail"
                    fixed={
                      post.node.frontmatter.featuredImage.childImageSharp.fixed
                    }
                  />
                  {post.node.excerpt}
                  <Link to={post.node.fields.slug} className="text-primary">
                    <small className="d-inline ml-1"> Read full post</small>
                  </Link>
                </p>
              </div>
            );
          })}
          <div className="mt-4 text-center">
            <Link to={nextPage} rel="next" style={{ textDecoration: `none` }}>
              <span className="text-link">Next Page →</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        author
        labels {
          tag
          tech
          name
          size
          color
        }
      }
    }
    allMarkdownRemark(
      limit: 5
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { published: { eq: true } } }
    ) {
      edges {
        node {
            timeToRead
          excerpt(pruneLength: 500)
          id
          frontmatter {
            title
            date(formatString: "DD/MM/YYYY")
            tags
            featuredImage {
              childImageSharp {
                fixed(width: 160) {
                    base64
                    width
                    height
                    srcSetWebp
                }
              }
            }
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

export default IndexPage;
