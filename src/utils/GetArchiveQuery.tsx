/************************
 * Made by [MR Ferry™]  *
 * on Juni 2024         *
 ************************/

import { ArchiveAttr } from "../types/DataTypes.ts";
import { graphql, useStaticQuery } from "gatsby";

export function getArchiveQuery(): ArchiveAttr {
  return useStaticQuery(graphql`
    query ArchiveQuery {
      allContentfulBlogPost(sort: { publishDate: DESC }) {
        nodes {
          slug
          title
          publishDate
        }
      }
    }
  `);
}
