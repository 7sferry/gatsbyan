/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import "./ignored/blockquote.css";
import "./ignored/index-ignored.css";
import { getPlurals, getPublishDateTime, getTechTags } from "../utils/GatsbyanUtils";
import React from "react";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import * as heroStyles from "../components/hero.module.css";
import { Utterances } from "../components/Utterances";

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

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const innerHeight = window.innerHeight + document.documentElement.scrollTop;
    const clientHeight = document.body.clientHeight;
    const percentage = innerHeight / clientHeight * 100;
    if (!this.state.commentShown && percentage > 50) {
      this.showComment();
    }
  };

  render() {
    const { contentfulBlogPost: post } = this.props.data;
    const site = this.props.data.site.siteMetadata;
    const { childMarkdownRemark } = post.body;
    const timeToRead = childMarkdownRemark.timeToRead;
    const url = `${site.siteUrl}/blog/${post.slug}`;
    const repo = site.repo;

    const heroImage = post.heroImage;
    const imageURL = heroImage?.file?.url;
    const imageData = heroImage.gatsbyImageData;
    const imageTitle = heroImage?.title;

    return (
      <Layout>
        <Seo
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
            <figure className={heroStyles.hero}>
              {imageData && <GatsbyImage image={imageData} className={heroStyles.heroImage} alt={post.title} />}
              {imageTitle && (
                <figcaption className="gatsby-resp-image-figcaption">{`Source: ${imageTitle}`}</figcaption>
              )}
            </figure>
            <div
              className="post-container pt-0"
              id="content-post"
              dangerouslySetInnerHTML={{
                __html: childMarkdownRemark.html,
              }}
            />
          </div>
          {this.state.commentShown && repo && <Utterances repo={repo} />}
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
        gatsbyImageData(quality: 75, formats: JPG, placeholder: BLURRED, layout: FULL_WIDTH, jpegProgressive: true)
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
        repo
      }
    }
  }
`;
