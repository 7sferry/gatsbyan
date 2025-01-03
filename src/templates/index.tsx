/************************
 * Author: [MR FERRY™]  *
 * August 2020          *
 ************************/

import React from "react";
import { GatsbyImage, withArtDirection } from "gatsby-plugin-image";
import { graphql, HeadProps, Link, Slice } from "gatsby";

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import { getPlurals } from "../utils/GatsbyanUtils";
import "./index.css";
import { IndexHeroImage, IndexProp } from "../types/DataTypes";
import CommaSeparatedLinkedPostTags from "../components/CommaSeparatedLinkedPostTags";
import { getPublishDate } from "../utils/DateUtils";
import { format } from "date-fns";
import { DateTime } from "luxon";

function IndexPage(props: IndexProp) {
  const { pageContext, data } = props;
  const { allContentfulBlogPost: contents } = data;
  const { nodes: posts, pageInfo } = contents;
  const kebabTag = pageContext.kebabTag;
  const paginationUrl = kebabTag ? `/tags/${kebabTag}` : `/page`;
  function formatToPattern(dateArgString: string, datePattern: string) {
    const date = new Date(dateArgString);
    const zonedDate = date.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    return format(new Date(zonedDate), datePattern);
  }
  return (
    <Layout>
      <span className="page-info">
        {`date = ${DateTime.fromISO("2023-04-18T03:00+07:00").setZone("Asia/Jakarta").toFormat("yyyy-MM-dd hh:mm a")}`}
      </span>
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
            resizingBehavior: THUMB
            cropFocus: FACES
            placeholder: BLURRED
            layout: FIXED
            quality: 100
          )
          phone: gatsbyImageData(
            resizingBehavior: THUMB
            cropFocus: FACES
            placeholder: BLURRED
            layout: FIXED
            outputPixelDensities: [1]
            width: 410
            quality: 100
          )
          ipad: gatsbyImageData(
            resizingBehavior: THUMB
            cropFocus: FACES
            placeholder: BLURRED
            layout: FIXED
            outputPixelDensities: [1]
            width: 360
            quality: 100
          )
          laptop: gatsbyImageData(placeholder: BLURRED, layout: FIXED, outputPixelDensities: [1], width: 250)
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

export function Head({ location }: HeadProps) {
  return (
    <Seo title={location?.pathname === "/" ? "Personal Blog [Ferry Suhandri]" : "Blog"} path={location?.pathname} />
  );
}
