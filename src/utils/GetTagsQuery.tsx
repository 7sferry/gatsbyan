/************************
 * Made by [MR Ferry™]  *
 * on November 2024     *
 ************************/
import { TagsData } from "../types/DataTypes.ts";
import { graphql, useStaticQuery } from "gatsby";

export function getTagsQuery(): TagsData {
  return useStaticQuery(graphql`
    query Tags {
      allContentfulBlogPost {
        tags: distinct(field: { tags: SELECT })
      }
    }
  `);
}
