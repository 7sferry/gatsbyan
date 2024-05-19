/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/

import { FeaturedPageData } from "../types/DataTypes.ts";
import { graphql, useStaticQuery } from "gatsby";

export function fetchFeaturedPages() {
  const data: FeaturedPageData = useStaticQuery(graphql`
    query FeaturedPageQuery {
      allContentfulBlogPost(
        filter: {
          slug: {
            in: [
              "write-skew-pada-database"
              "sql-menentukan-primary-key"
              "pessimistic-vs-optimistic-locking-mencegah-update-anomaly"
              "fakta-unik-minangkabau"
              "java-membuat-pdf-dinamis"
              "diam-itu-gemas"
              "the-gebetans"
              "perluas-pengetahuanmu-tentang-offside"
            ]
          }
        }
        sort: { createdAt: DESC }
      ) {
        nodes {
          slug
          title
        }
      }
    }
  `);

  const { allContentfulBlogPost }: FeaturedPageData = data;
  return allContentfulBlogPost.nodes;
}
