/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import type { AlgoliaData, AlgoliaNode, FlattenAlgoliaNode } from "../types/DataTypes";
import crypto from "crypto";

export const MAX_CONTENT_LENGTH = 8500;

const allContentfulBlogPost = `{
  allContentfulBlogPost {
    nodes {
      id
      title
      slug
      body {
        childMarkdownRemark {
          excerpt(pruneLength: 50000)
          internal {
            contentDigest
          }
        }
      }
    }
  }
}`;

const flatNode = (node: AlgoliaNode): FlattenAlgoliaNode => {
  const { body, ...rest } = node;
  const { childMarkdownRemark } = body;
  return {
    ...childMarkdownRemark,
    ...rest,
  };
};

function constructSubContents(excerpt: string): string[] {
  const subContents: string[] = [];
  let remaining = excerpt;
  while (remaining.length > MAX_CONTENT_LENGTH) {
    const splitIndex = getSplitIndex(remaining);
    subContents.push(remaining.substring(0, splitIndex));
    remaining = remaining.substring(splitIndex);
  }
  if (remaining) {
    subContents.push(remaining);
  }
  return subContents;
}

function getSplitIndex(content: string) {
  const lastSpace = content.lastIndexOf(" ", MAX_CONTENT_LENGTH);
  const lastNewLine = content.lastIndexOf("\n", MAX_CONTENT_LENGTH);
  const splitIndex = Math.max(lastSpace, lastNewLine);
  return splitIndex > 0 ? splitIndex : MAX_CONTENT_LENGTH;
}

const splitNode = (node: FlattenAlgoliaNode): Array<FlattenAlgoliaNode> => {
  const { excerpt, ...rest } = node;
  const subContents = constructSubContents(excerpt);
  let subContentsLength = subContents.length;
  return subContents.map((content) => ({
    ...rest,
    excerpt: content,
    id: rest.id + "_" + subContentsLength--,
    internal: {
      contentDigest: crypto
        .createHash(`md5`)
        .update(JSON.stringify({ content: content, slug: rest.slug, title: rest.title }))
        .digest(`hex`),
    },
  }));
};

export const queries = [
  {
    query: allContentfulBlogPost,
    settings: {
      attributeForDistinct: "slug",
      distinct: true,
    },
    transformer: ({ data }: AlgoliaData) => data.allContentfulBlogPost.nodes.map(flatNode).map(splitNode).flat(1),
  },
];

export default queries;
