import Layout from "../components/Layout";
import SEO from "../components/SEO";
import "./blog-post.css";
import Share from "../components/Share";
import { getPlurals, getTechTags, getPublishDateTime } from "../utils/GatsbyanUtils";
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
    const post = this.props.data.contentfulBlogPost;
    const site = this.props.data.site.siteMetadata;
    const timeToRead = post.body.childMarkdownRemark.timeToRead;
    const url = `${site.siteUrl}/blog/${post.slug}`;

    const imageURL = post.heroImage?.file?.url;

    const hasImage = post.heroImage?.fluid;
    return (
      <Layout>
        <SEO
          title={post.title}
          description={post.description.description}
          lang={post.lang}
          image={imageURL}
          url={url}
        />
        <div className="post-main">
          <div className="blog-content">
            <h3 className="title mt-4">{post.title}</h3>
            <div className="title text-info mb-2">
              <span className="page-info">{getPublishDateTime(post.publishDate)}</span>
              <span className="page-info">
                {timeToRead} min{getPlurals(timeToRead)} read
              </span>
              <br />
              <span className="page-info">{getTechTags(post.tags)}</span>
            </div>
            <div>
              <div className={heroStyles.hero}>
                {hasImage && (
                  <Img className={`${heroStyles.heroImage} mb-3`} alt={post.title} fluid={post.heroImage.fluid} />
                )}
              </div>
              <div
                className="post-container pt-3"
                dangerouslySetInnerHTML={{
                  __html: post.body.childMarkdownRemark.html,
                }}
              />
            </div>
            <Share title={post.title} siteName={site.title} url={url} />
            <button onClick={this.showComment}>Show comment</button>
            {this.state.commentShown && <Comment href={url} />}
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
      publishDate
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
        fluid {
          aspectRatio
          src
          srcSet
          sizes
          tracedSVG
        }
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
