/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

import Layout from "../components/Layout";
import SEO from "../components/SEO";
import "./blog-post.css";
import Share from "../components/Share";
import { getPlurals, getPublishDateTime, getTechTags } from "../utils/GatsbyanUtils";
import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import Comment from "../components/Comment";
import heroStyles from "../components/hero.module.css";

class BlogPostTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = { commentShown: false };
    this.showComment = this.showComment.bind(this);
  }

  showComment() {
    this.setState(() => ({
      // showComment: !prevState.showComment,
      commentShown: true,
    }));
  }

  render() {
    const { contentfulBlogPost: post } = this.props.data;
    const site = this.props.data.site.siteMetadata;
    const { childMarkdownRemark } = post.body;
    const timeToRead = childMarkdownRemark.timeToRead;
    const url = `${site.siteUrl}/blog/${post.slug}`;

    const heroImage = post.heroImage;
    const imageURL = heroImage?.file?.url;
    const fluid = heroImage?.fluid;
    const imageTitle = heroImage?.title;

    return (
      <Layout>
        <SEO
          title={post.title}
          description={post.description.description}
          lang={post.lang?.[0]}
          image={imageURL}
          url={url}
        />
        <div className="post-main">
          <div className="title posted">{post.title}</div>
          <div className="title text-info mb-2">
            <span className="page-info">{getPublishDateTime(post.publishDate)}</span>
            <span className="page-info">
              {timeToRead} min{getPlurals(timeToRead)} read
            </span>
            <br />
            <span className="page-info">{getTechTags(post.tags)}</span>
          </div>
          <div>
            <div className={`${heroStyles.hero} mb-3`}>
              {fluid && <Img className={`${heroStyles.heroImage}`} alt={post.title} fluid={heroImage.fluid} />}
              {imageTitle && (
                <p>
                  <small className="text-center" style={{ fontSize: "50%" }}>{`Source: ${imageTitle}`}</small>
                </p>
              )}
            </div>
            <div
              className="post-container pt-0"
              id="content-post"
              dangerouslySetInnerHTML={{
                __html: childMarkdownRemark.html,
              }}
            />
          </div>
          <Share title={post.title} siteName={site.title} url={url} />
          <button onClick={this.showComment}>Show comment</button>
          {this.state.commentShown && <Comment href={url} />}
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
      publishDate
      lang
      body {
        childMarkdownRemark {
          html
          timeToRead
        }
      }
      description {
        description
      }
      heroImage {
        fluid(quality: 100) {
          aspectRatio
          src
          srcSet
          sizes
          tracedSVG
        }
        title
        file {
          url
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
