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

const unnestMarkdown = (node: AlgoliaNode): FlattenAlgoliaNode => {
  const { body, ...rest } = node;
  const { childMarkdownRemark } = body;
  return {
    ...childMarkdownRemark,
    ...rest,
  };
};

const handlePlainText = (node: FlattenAlgoliaNode): Array<FlattenAlgoliaNode> => {
  const { rawMarkdownBody, ...rest } = node;
  const sections = rawMarkdownBody.match(/[\s\S]{1,8500}/g) || [];
  return sections.map((section, index) => ({
    ...rest,
    rawMarkdownBody: section,
    id: rest.id + "_" + index,
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
      data.allContentfulBlogPost.nodes.map(unnestMarkdown).map(handlePlainText).flat(1),
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

interface FlattenAlgoliaNode {
  id: string;
  title: string;
  slug: string;
  rawMarkdownBody: string;
  excerpt: string;
}

module.exports = queries;
