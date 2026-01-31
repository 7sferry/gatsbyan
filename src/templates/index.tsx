/************************
 * Author: [MR FERRY™]  *
 * August 2020          *
 ************************/

import React from "react";
import { GatsbyImage, withArtDirection } from "gatsby-plugin-image";
import { graphql, Link, Slice } from "gatsby";

import Layout from "../components/Layout";
import { getPlurals } from "../utils/GatsbyanUtils";
import "./index.css";
import { IndexHeroImage, IndexProp, LocationProp, SeoData } from "../types/DataTypes";
import CommaSeparatedLinkedPostTags from "../components/CommaSeparatedLinkedPostTags";
import { getPublishDate } from "../utils/DateUtils";
import Seo, { SEO_CONSTANTS, useSeo } from "../components/Seo";

function IndexPage(props: IndexProp & LocationProp) {
  const { pageContext, data, location } = props;
  const { allContentfulBlogPost: contents } = data;
  const { nodes: posts, pageInfo } = contents;
  const kebabTag = pageContext.kebabTag;
  const paginationUrl = kebabTag ? `/tags/${kebabTag}` : `/page`;

  const seo: SeoData = useSeo({
    title: location?.pathname === "/" ? "Personal Blog [Ferry Suhandri]" : "Blog",
    path: location?.pathname,
  });

  return (
    <Layout>
      <link rel="canonical" href={seo.metaUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seo.schemaDataJson }} />
      <title>{`${seo.title} `}</title>
      <meta name="description" content={seo.metaDescription} />
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
      {kebabTag && (
        <div className="tag-title">
          All posts related to <b>{pageContext.tag}</b>
        </div>
      )}
      {posts.map((post) => {
        const tags = post.tags;
        const { childMarkdownRemark } = post.body;
        const timeToRead = childMarkdownRemark.timeToRead;
        let heroImage = post.heroImage;
        let imageData = getImageData(heroImage);
        return (
          <div id={post.id} key={post.id} className="d-block blog-content">
            <div className="post-container">
              <div className="title posted">
                <Link to={`/blog/${post.slug}`} className="text-link">
                  {post.title}
                </Link>
              </div>
              <div className="title text-info">
                <span className="page-info">{getPublishDate(post.publishDate)}</span>
                <span className="page-info">
                  {timeToRead} min{getPlurals(timeToRead)} read
                </span>
                <br />
                <span className="page-info">
                  <CommaSeparatedLinkedPostTags tags={tags} />
                </span>
              </div>
              <div className="pt-1">
                {imageData && <GatsbyImage image={imageData} className="index-thumbnail" alt={heroImage.title} />}
                <p>{childMarkdownRemark.excerpt}</p>
              </div>
            </div>
          </div>
        );
      })}
      <div className="text-center">
        <Slice
          alias={"PaginationElement"}
          totalPageCount={pageInfo.pageCount}
          url={paginationUrl}
          currentPage={pageInfo.currentPage}
        />
      </div>
    </Layout>
  );
}

function getImageData(heroImage: IndexHeroImage) {
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
  query HomeQuery($skip: Int, $limit: Int, $tag: String) {
    allContentfulBlogPost(skip: $skip, limit: $limit, sort: { publishDate: DESC }, filter: { tags: { eq: $tag } }) {
      nodes {
        slug
        body {
          childMarkdownRemark {
            timeToRead
            excerpt(pruneLength: 365)
          }
        }
        tags
        title
        publishDate
        heroImage {
          original: gatsbyImageData(
            formats: [NO_CHANGE, AVIF]
            resizingBehavior: THUMB
            cropFocus: FACES
            placeholder: BLURRED
            layout: FIXED
            quality: 75
          )
          phone: gatsbyImageData(
            formats: [NO_CHANGE, AVIF]
            resizingBehavior: THUMB
            cropFocus: FACES
            placeholder: BLURRED
            layout: FIXED
            outputPixelDensities: [1, 1.5]
            width: 410
            quality: 50
          )
          ipad: gatsbyImageData(
            formats: [NO_CHANGE, AVIF]
            resizingBehavior: THUMB
            cropFocus: FACES
            placeholder: BLURRED
            layout: FIXED
            outputPixelDensities: [1, 1.5]
            width: 360
            quality: 50
          )
          laptop: gatsbyImageData(
            formats: [NO_CHANGE, AVIF]
            placeholder: BLURRED
            layout: FIXED
            outputPixelDensities: [1, 2]
            width: 250
            quality: 30
          )
          title
        }
        id
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        perPage
        currentPage
        pageCount
        itemCount
      }
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`;

export default IndexPage;

export function Head() {
  return <Seo />;
}
