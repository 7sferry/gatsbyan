/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import { AlgoliaData, AlgoliaNode, FlattenAlgoliaNode } from "../types/DataTypes";
import crypto from "crypto";

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
  const contents = excerpt.match(/[\s\S]{1,8500}/g) || [];
  if (contents.length === 1) {
    return contents;
  }
  let lastWord = "";
  const resultContents: string[] = [];
  for (let content of contents) {
    const lastWordPlusContent = lastWord + content;
    if (content.length < 8500) {
      resultContents.push(lastWordPlusContent);
      return resultContents;
    }
    const lastSpace = lastWordPlusContent.lastIndexOf(" ");
    const lastNewLine = lastWordPlusContent.lastIndexOf("\n");
    const splitIndex = Math.max(lastSpace, lastNewLine);
    if (splitIndex > 0) {
      lastWord = lastWordPlusContent.substring(splitIndex, lastWordPlusContent.length);
      resultContents.push(lastWordPlusContent.substring(0, splitIndex));
    } else {
      lastWord = "";
      handleUnSplittedContent(lastWordPlusContent, resultContents);
    }
  }
  return resultContents;
}

function handleUnSplittedContent(lastWordPlusContent: string, resultContents: string[]) {
  if (lastWordPlusContent.length > 9000) {
    const subContents = constructSubContents(lastWordPlusContent);
    resultContents.push(...subContents);
  } else {
    resultContents.push(lastWordPlusContent);
  }
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

const queries = [
  {
    query: allContentfulBlogPost,
    settings: {
      attributeForDistinct: "slug",
      distinct: true,
    },
    transformer: ({ data }: AlgoliaData) => data.allContentfulBlogPost.nodes.map(flatNode).map(splitNode).flat(1),
  },
];

module.exports = queries;
