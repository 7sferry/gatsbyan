/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import "./ignored/blockquote.css";
import "./ignored/index-ignored.css";
import { getPlurals, getPostTags, getPublishDateTime, isAfterDate, plusDays, toNow } from "../utils/GatsbyanUtils";
import React from "react";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import { Comment } from "../components/Comment";
import { BlogPostProp } from "../types/DataTypes";

const BlogPostTemplate = (props: BlogPostProp) => {
  const { contentfulBlogPost: post, site: siteProp } = props.data;
  const site = siteProp.siteMetadata;
  const { childMarkdownRemark } = post.body;
  const timeToRead = childMarkdownRemark.timeToRead;
  const repo = site.repo;

  const heroImage = post.heroImage;
  const imageData = heroImage?.gatsbyImageData;
  const imageTitle = heroImage?.title;
  const htmlWithAnchor = extractHtmlWithAnchor(childMarkdownRemark.html);
  const publishDate = new Date(post.publishDate);
  return (
    <Layout>
      <div className="post-main">
        <div className="title posted">{post.title}</div>
        <div className="title text-info mb-2">
          <span className="page-info">{getPublishDateTime(publishDate)}</span>
          <span className="page-info" style={{ display: "inline-block" }}>
            {timeToRead} min{getPlurals(timeToRead)} read
          </span>
          {isAfterDate(post.updatedAt, plusDays(publishDate, 30)) && (
            <span className="page-info">{`updated ${toNow(post.updatedAt)} ago`}</span>
          )}
          <div className="page-info">{getPostTags(post.tags)}</div>
        </div>
        <div>
          <figure className="hero">
            {imageData && <GatsbyImage image={imageData} className="heroImage" alt={post.title} />}
            {imageTitle && <figcaption className="gatsby-resp-image-figcaption">{`Source: ${imageTitle}`}</figcaption>}
          </figure>
          <div
            className="post-container pt-0 content-post"
            dangerouslySetInnerHTML={{
              __html: htmlWithAnchor,
            }}
          />
        </div>
        <Comment repo={repo} />
      </div>
    </Layout>
  );
};

function extractHtmlWithAnchor(html: string): string {
  return html
    .replace(/<h2>(.*?)<\/h2>/g, function (match: string, capturedSubstr1: string) {
      if (capturedSubstr1.startsWith("<a ")) {
        return match;
      }
      const hrefValue = getHrefValue(capturedSubstr1);
      return `<div class="anchor-tag"><h2 id="${hrefValue}"><a class="anchor-subtitle" href="#${hrefValue}">${capturedSubstr1}</a></h2></div>`;
    })
    .replace(/<h3>(.*?)<\/h3>/g, function (match: string, capturedSubstr1: string) {
      if (capturedSubstr1.startsWith("<a ")) {
        return match;
      }
      const hrefValue = getHrefValue(capturedSubstr1);
      return `<div class="anchor-tag"><h3 id="${hrefValue}"><a class="anchor-subtitle" href="#${hrefValue}">${capturedSubstr1}</a></h3></div>`;
    });
}

function getHrefValue(capturedSubstr1: string): string {
  let hrefValue = capturedSubstr1
    .trim()
    .replace(/<code(.*?)>/g, "")
    .replace("</code>", "")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase();
  if (hrefValue.startsWith("-")) {
    hrefValue = hrefValue.substring(1);
  }
  if (hrefValue.endsWith("-")) {
    hrefValue = hrefValue.substring(0, hrefValue.length - 1);
  }
  return hrefValue;
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      publishDate
      updatedAt
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
        gatsbyImageData(
          quality: 100
          placeholder: BLURRED
          layout: FULL_WIDTH
          resizingBehavior: THUMB
          cropFocus: FACES
        )
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
