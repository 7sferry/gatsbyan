/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

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
  const resultContents = [];
  for (let content of contents) {
    const lastWordPlusContent = lastWord + content;
    if (content.length < 8500) {
      resultContents.push(lastWordPlusContent);
      return resultContents;
    }
    const lastSpace = lastWordPlusContent.lastIndexOf(" ");
    const lastNewLine = lastWordPlusContent.lastIndexOf("\n");
    const number = Math.max(lastSpace, lastNewLine);
    if (number <= 0) {
      lastWord = "";
      if (lastWordPlusContent.length > 9000) {
        const subContents = constructSubContents(lastWordPlusContent);
        resultContents.push(...subContents);
        continue;
      }
      resultContents.push(lastWordPlusContent);
      continue;
    }
    lastWord = lastWordPlusContent.substring(number, lastWordPlusContent.length);
    resultContents.push(lastWordPlusContent.substring(0, number));
  }
  return resultContents;
}

const splitNode = (node: FlattenAlgoliaNode): Array<FlattenAlgoliaNode> => {
  const { excerpt, ...rest } = node;
  const subContents = constructSubContents(excerpt);
  let subContentsLength = subContents.length;
  return subContents.map((content) => ({
    ...rest,
    excerpt: content,
    id: rest.id + "_" + subContentsLength--,
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

interface AlgoliaData {
  data: {
    allContentfulBlogPost: {
      nodes: Array<AlgoliaNode>;
    };
  };
}

interface AlgoliaNode {
  id: string;
  title: string;
  slug: string;
  body: {
    childMarkdownRemark: AlgoliaChildMarkdownRemark;
  };
}

interface AlgoliaChildMarkdownRemark {
  excerpt: string;
}

interface FlattenAlgoliaNode {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
}

module.exports = queries;
