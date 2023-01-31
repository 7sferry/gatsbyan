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
          rawMarkdownBody
          excerpt(pruneLength: 100, truncate: true)
          internal {
            contentDigest
          }
        }
      }
    }
  }
}`;

const unnestMarkdown = (node: AlgoliaNode) => {
  const { body, ...rest } = node;
  const { childMarkdownRemark } = body;
  return {
    ...childMarkdownRemark,
    ...rest,
  };
};

const handlePlainText = (node: AlgoliaChildMarkdownRemark) => {
  const { rawMarkdownBody, ...rest } = node;
  const sections = rawMarkdownBody.match(/[\s\S]{1,7000}/g) || [];
  return sections.map((section) => ({
    ...rest,
    content: section,
  }));
};

const queries = [
  {
    query: allContentfulBlogPost,
    settings: {
      attributeForDistinct: "slug",
      distinct: true,
    },
    transformer: ({ data }: AlgoliaData) =>
      data.allContentfulBlogPost.nodes
        .map(unnestMarkdown)
        .map(handlePlainText)
        .reduce((acc, cur) => [...acc, ...cur], []),
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
  rawMarkdownBody: string;
  excerpt: string;
}

module.exports = queries;
