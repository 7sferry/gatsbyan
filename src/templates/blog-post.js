import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import "./blog-post.css";

import Sidebar from "../components/sidebar/Sidebar";
import TechTag from "../components/tags/TechTag";
import CustomShareBlock from "../components/CustomShareBlock";

const BlogPost = props => {
  const post = props.data.markdownRemark;
  const labels = props.data.site.siteMetadata.labels;
  const siteName = props.data.site.siteMetadata.title;
  const siteUrl = props.data.site.siteMetadata.url;
  const url = `${siteUrl}${props.pageContext.slug}`;
  const tags = post.frontmatter.tags;

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
      <SEO title={post.frontmatter.title} />
      <div className="post-page-main">
        <div className="sidebar px-4 py-2">
          <Sidebar />
        </div>

        <div className="post-main">
          <SEO
            title={post.frontmatter.title}
            description={post.frontmatter.title}
          />
          <div className="mt-3">
            <h2 className="title">{post.frontmatter.title}</h2>
            <small className="d-block text-info posted">
              <i className="d-block">
                Posted on {post.frontmatter.date} &nbsp;&nbsp;&nbsp; (
                {post.timeToRead} min read)
              </i>
              {getTechTags(tags)}
            </small>
            <div className="pt-3" dangerouslySetInnerHTML={{ __html: post.html }} />
            <CustomShareBlock
              title={post.frontmatter.title}
              siteName={siteName}
              url={url}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        url
        title
        labels {
          tag
          tech
          name
          size
          color
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "DD/MM/YYYY")
        tags
      }
    }
  }
`;

export default BlogPost;
