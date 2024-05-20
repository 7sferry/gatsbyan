/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import "./ignored/blockquote.css";
import "./ignored/index-ignored.css";
import "./ignored/prism.css";
import { getPlurals, getPublishDateTime, isAfterDate, kebabCase, plusDays, toNow } from "../utils/GatsbyanUtils";
import React from "react";
import { graphql, Slice } from "gatsby";
import { GatsbyImage, withArtDirection } from "gatsby-plugin-image";
import { BlogPostHeroImage, BlogPostProp } from "../types/DataTypes";
import { ClientSide } from "../components/ClientSide.tsx";
import CommaSeparatedLinkedPostTags from "../components/CommaSeparatedLinkedPostTags.tsx";

const BlogPostTemplate = (props: BlogPostProp) => {
  const { contentfulBlogPost: post, site: siteProp } = props.data;
  const site = siteProp.siteMetadata;
  const { childMarkdownRemark } = post.body;
  const timeToRead = childMarkdownRemark.timeToRead;
  const repo = site.repo;

  const heroImage = post.heroImage;
  const imageData = getHeroImage(heroImage);
  const imageTitle = heroImage?.title;
  const htmlWithAnchor = extractHtmlWithAnchor(childMarkdownRemark.html);
  const publishDate = post.publishDate;
  const updatedAt = post.updatedAt;

  const showUpdatedText = () => {
    return post.sys?.revision > 5 && isAfterDate(updatedAt, plusDays(publishDate, 30));
  };

  return (
    <Layout>
      <div className="post-main">
        <div className="title posted">{post.title}</div>
        <div className="title text-info mb-2">
          <span className="page-info">{getPublishDateTime(publishDate)}</span>
          <span className="page-info" style={{ display: "inline-block" }}>
            {timeToRead} min{getPlurals(timeToRead)} read
          </span>
          <ClientSide>
            {showUpdatedText() && <span className="page-info">{`updated ${toNow(updatedAt)} ago`}</span>}
          </ClientSide>
          <div className="page-info">
            <CommaSeparatedLinkedPostTags tags={post.tags} />
          </div>
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
        <Slice alias="Comment" repo={repo} />
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
  let hrefValue = capturedSubstr1.replace(/<(.*?)>/g, "");
  return kebabCase(hrefValue);
}

function getHeroImage(heroImage: BlogPostHeroImage) {
  return withArtDirection(heroImage?.original, [
    {
      media: "(max-width: 1024px)",
      image: heroImage?.phone,
    },
    {
      media: "(max-width: 1366px)",
      image: heroImage?.laptop,
    },
  ]);
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      publishDate
      updatedAt
      sys {
        revision
      }
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
        original: gatsbyImageData(
          quality: 100
          placeholder: BLURRED
          layout: FULL_WIDTH
          resizingBehavior: THUMB
          cropFocus: FACES
        )
        phone: gatsbyImageData(
          quality: 100
          placeholder: BLURRED
          layout: FULL_WIDTH
          resizingBehavior: THUMB
          cropFocus: FACES
          breakpoints: [400, 1000]
          sizes: "(max-width: 414px) 400px, (max-width: 1024px) 1000px"
        )
        laptop: gatsbyImageData(
          quality: 100
          placeholder: BLURRED
          layout: FULL_WIDTH
          resizingBehavior: THUMB
          cropFocus: FACES
          breakpoints: [575]
          sizes: "(max-width: 1366px) 575px"
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

export default BlogPostTemplate;

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
