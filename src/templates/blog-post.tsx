/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import "./ignored/blockquote.css";
import "./ignored/index-ignored.css";
import "./ignored/prism.css";
import { getPlurals } from "../utils/GatsbyanUtils";
import React from "react";
import { graphql, Slice } from "gatsby";
import { GatsbyImage, withArtDirection } from "gatsby-plugin-image";
import { BlogPostHeroImage, BlogPostProp } from "../types/DataTypes";
import { ClientSide } from "../components/ClientSide.tsx";
import CommaSeparatedLinkedPostTags from "../components/CommaSeparatedLinkedPostTags.tsx";
import { getDateYear, getPublishDateTime, isAfterDate, plusDays, toNow } from "../utils/DateUtils";

const BlogPostTemplate = (props: BlogPostProp) => {
  const { contentfulBlogPost: post, site: siteProp } = props.data;
  const site = siteProp.siteMetadata;
  const { childMarkdownRemark } = post.body;
  const timeToRead = childMarkdownRemark.timeToRead;
  const repo = site.repo;

  const heroImage = post.heroImage;
  const imageData = getHeroImage(heroImage);
  const imageTitle = heroImage?.title;
  const htmlWithAnchor = childMarkdownRemark.html;
  const publishDate = post.publishDate;
  const updatedAt = post.updatedAt;

  const showUpdatedText = () => {
    return post.sys?.revision > 5 && isAfterDate(updatedAt, plusDays(publishDate, 30));
  };

  return (
    <Layout>
      <div className="title posted">{post.title}</div>
      <div className="title text-info mb-2">
        <span className="page-info">{getPublishDateTime(publishDate)}</span>
        <span className="page-info" style={{ display: "inline-block" }}>
          {timeToRead} min{getPlurals(timeToRead)} read
        </span>
        <ClientSide>
          {showUpdatedText() && <span className="page-info updated-time">{`updated ${toNow(updatedAt)}`}</span>}
        </ClientSide>
        <div className="page-info">
          <CommaSeparatedLinkedPostTags tags={post.tags} />
        </div>
      </div>
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
      <Slice alias="Comment" repo={repo} />
    </Layout>
  );
};

function getHeroImage(heroImage: BlogPostHeroImage) {
  if (!heroImage) {
    return null;
  }
  return withArtDirection(heroImage.original, [
    {
      media: "(max-width: 416px)",
      image: heroImage.phone,
    },
    {
      media: "(max-width: 1024px)",
      image: heroImage.ipad,
    },
    {
      media: "(max-width: 1360px)",
      image: heroImage.laptop,
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
          breakpoints: [410]
          sizes: "(max-width: 414px) 410px"
        )
        ipad: gatsbyImageData(
          quality: 100
          placeholder: BLURRED
          layout: FULL_WIDTH
          breakpoints: [1000]
          sizes: "(max-width: 1024px) 1000px"
        )
        laptop: gatsbyImageData(
          quality: 100
          placeholder: BLURRED
          layout: FULL_WIDTH
          resizingBehavior: THUMB
          cropFocus: FACES
          breakpoints: [575]
          sizes: "(max-width: 1360px) 575px"
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
      date={getDateYear(post?.publishDate)}
    />
  );
}
