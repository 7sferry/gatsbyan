/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import "./ignored/blockquote.css";
import "./ignored/index-ignored.css";
import { getPlurals, getPostTags, getPublishDateTime } from "../utils/GatsbyanUtils";
import React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { Comment } from "../components/Comment";

const heroStyles = require("../components/hero.module.css");

class BlogPostTemplate extends React.Component<BlogPostProp, BlogPostState> {
  constructor(props: BlogPostProp) {
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
    const percentage = (innerHeight / clientHeight) * 100;
    if (!this.state.commentShown && percentage > 50) {
      this.showComment();
    }
  };

  render() {
    const { contentfulBlogPost: post, site: siteProp } = this.props.data;
    const site = siteProp.siteMetadata;
    const { childMarkdownRemark } = post.body;
    const timeToRead = childMarkdownRemark.timeToRead;
    const repo = site.repo;

    const heroImage = post.heroImage;
    const imageData = heroImage.gatsbyImageData;
    const imageTitle = heroImage?.title;
    let htmlWithAnchor = childMarkdownRemark.html.replace(/<h2>(.*?)<\/h2>/g, function (match, capturedSubstr1) {
      if (capturedSubstr1.startsWith("<a") && capturedSubstr1.endsWith(">")) {
        return match;
      }
      let hrefValue = capturedSubstr1
        .trim()
        .replace(/[^a-z0-9]+/gi, "-")
        .toLowerCase();
      return `<h2 id="${hrefValue}"><a class="anchor-subtitle" href="#${hrefValue}">${capturedSubstr1}</a></h2>`;
    });

    return (
      <Layout>
        <div className="post-main">
          <div className="title posted">{post.title}</div>
          <div className="title text-info mb-2">
            <span className="page-info">{getPublishDateTime(post.publishDate)}</span>
            <span className="page-info">
              {timeToRead} min{getPlurals(timeToRead)} read
            </span>
            <br />
            <span className="page-info">{getPostTags(post.tags)}</span>
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
                __html: htmlWithAnchor,
              }}
            />
          </div>
          {this.state.commentShown && repo && <Comment repo={repo} />}
        </div>
      </Layout>
    );
  }
}

interface BlogPostState {
  commentShown: boolean;
}

interface BlogPostProp {
  data: {
    contentfulBlogPost: {
      title: string;
      publishDate: Date;
      lang: string;
      body: {
        childMarkdownRemark: {
          html: string;
          timeToRead: number;
        };
      };
      description: {
        description: string;
      };
      heroImage: {
        gatsbyImageData: IGatsbyImageData;
        title: string;
        file: {
          url: string;
        };
      };
      tags: Array<string>;
      slug: string;
    };
    site: {
      siteMetadata: {
        siteUrl: string;
        repo: string;
      };
    };
  };
  location: {
    pathname: string;
  };
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
        gatsbyImageData(quality: 75, placeholder: BLURRED, layout: FULL_WIDTH)
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

export function Head({ data, location }: React.PropsWithRef<BlogPostProp>) {
  const post = data?.contentfulBlogPost;
  return (
    <Seo
      title={post?.title}
      description={post?.description?.description}
      lang={post?.lang?.[0]}
      image={post?.heroImage?.file?.url}
      path={location?.pathname}
    />
  );
}
