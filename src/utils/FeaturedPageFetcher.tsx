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
              "fakta-unik-minangkabau"
              "pilihan-investasi"
              "mengelola-token-api-authorization-di-web"
              "dosa-besar-selama-menjadi-software-engineer"
            ]
          }
        }
        sort: { updatedAt: DESC }
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
