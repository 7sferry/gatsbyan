/************************
 * Author: [MR FERRY™]  *
 * August 2020          *
 ************************/

import React from "react";
import { GatsbyImage, withArtDirection } from "gatsby-plugin-image";
import { graphql, HeadProps, Link } from "gatsby";

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import PaginationElement from "../components/PaginationElement.tsx";
import { getPlurals, getPublishDate } from "../utils/GatsbyanUtils";
import "./index.css";
import { IndexProp } from "../types/DataTypes";
import CommaSeparatedLinkedPostTags from "../components/CommaSeparatedLinkedPostTags.tsx";

function IndexPage(props: IndexProp) {
  const { pageContext, data } = props;
  const { allContentfulBlogPost: contents } = data;
  const { nodes: posts, pageInfo } = contents;
  const kebabTag = pageContext.kebabTag;
  const paginationUrl = kebabTag ? `/tags/${kebabTag}` : `/page`;

  return (
    <Layout>
      <div className="post-main">
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
          let imageData = withArtDirection(heroImage?.original, [
            {
              media: "(max-width: 416px)",
              image: heroImage?.phone,
            },
          ]);
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
                  {heroImage && <GatsbyImage image={imageData} className="index-thumbnail" alt={heroImage.title} />}
                  <p>{childMarkdownRemark.excerpt}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="text-center">
          <PaginationElement
            totalPageCount={pageInfo.pageCount}
            url={paginationUrl}
            currentPage={pageInfo.currentPage}
            refine={() => {}}
          />
        </div>
      </div>
    </Layout>
  );
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
          original: gatsbyImageData(resizingBehavior: THUMB, cropFocus: FACES, placeholder: BLURRED, layout: FIXED)
          phone: gatsbyImageData(
            resizingBehavior: THUMB
            cropFocus: FACES
            placeholder: BLURRED
            layout: FIXED
            width: 400
          )
          laptop: gatsbyImageData(
            resizingBehavior: THUMB
            cropFocus: FACES
            placeholder: BLURRED
            layout: FIXED
            width: 250
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

export function Head({ location }: HeadProps) {
  return <Seo title={"Blog"} path={location?.pathname} />;
}
