/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

import Layout from "../components/Layout";
import "./ignored/blockquote.css";
import "./ignored/index-ignored.css";
import "./ignored/prism.css";
import { getPlurals } from "../utils/GatsbyanUtils";
import React from "react";
import { graphql, Slice } from "gatsby";
import { GatsbyImage, withArtDirection } from "gatsby-plugin-image";
import { BlogPostHeroImage, BlogPostProp, SeoData } from "../types/DataTypes";
import { ClientSide } from "../components/ClientSide.tsx";
import CommaSeparatedLinkedPostTags from "../components/CommaSeparatedLinkedPostTags.tsx";
import { getDateYear, getPublishDateTime, isAfterDate, plusDays, toNow } from "../utils/DateUtils";
import Seo, { SEO_CONSTANTS, useSeo } from "../components/Seo";

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

  const seo: SeoData = useSeo({
    title: post?.title ?? "",
    description: post?.description?.description,
    path: props.location?.pathname,
    image: post?.heroImage?.file?.url,
    date: getDateYear(post?.publishDate) ?? "2024-11-29",
  });

  return (
    <Layout>
      <link rel="canonical" href={seo.metaUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seo.schemaDataJson }} />
      <title>{seo.title}</title>
      <meta name="og:title" content={seo.title} />
      <meta name="og:description" content={seo.metaDescription} />
      <meta name="og:type" content={SEO_CONSTANTS.OG_TYPE} />
      <meta name="og:site_name" content={SEO_CONSTANTS.OG_SITE_NAME} />
      <meta name="og:url" content={seo.metaUrl} />
      <meta name="og:image" content={seo.metaImageLarge} />
      <meta name="og:image:type" content={SEO_CONSTANTS.OG_IMAGE_TYPE} />
      <meta name="og:image:width" content={SEO_CONSTANTS.OG_IMAGE_WIDTH} />
      <meta name="og:image:height" content={SEO_CONSTANTS.OG_IMAGE_HEIGHT} />
      <meta name="twitter:card" content={SEO_CONSTANTS.TWITTER_CARD} />
      <meta name="twitter:creator" content={seo.metadata.author} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:image" content={seo.metaImage} />
      <meta name="twitter:description" content={seo.metaDescription} />
      <meta name="fb:app_id" content={SEO_CONSTANTS.FB_APP_ID} />
      <meta name="google-site-verification" content={SEO_CONSTANTS.GOOGLE_SITE_VERIFICATION} />
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
          formats: [NO_CHANGE, AVIF]
          quality: 75
          placeholder: BLURRED
          layout: FULL_WIDTH
          resizingBehavior: THUMB
          cropFocus: FACES
        )
        phone: gatsbyImageData(
          formats: [NO_CHANGE, AVIF]
          quality: 30
          placeholder: BLURRED
          layout: FULL_WIDTH
          breakpoints: [600]
          sizes: "(max-width: 414px) 410px"
        )
        ipad: gatsbyImageData(
          formats: [NO_CHANGE, AVIF]
          quality: 75
          placeholder: BLURRED
          layout: FULL_WIDTH
          breakpoints: [1000]
          sizes: "(max-width: 1024px) 1000px"
        )
        laptop: gatsbyImageData(
          formats: [NO_CHANGE, AVIF]
          quality: 75
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

export function Head({ data }: BlogPostProp) {
  const post = data?.contentfulBlogPost;
  return <Seo lang={post?.lang?.[0]} />;
}
