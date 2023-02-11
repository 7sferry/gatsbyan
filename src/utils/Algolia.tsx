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

const flatNode = (node: AlgoliaNode): FlattenAlgoliaNode => {
  const { body, ...rest } = node;
  const { childMarkdownRemark } = body;
  return {
    ...childMarkdownRemark,
    ...rest,
  };
};

function constructSubContents(rawMarkdownBody: string): string[] {
  const contents = rawMarkdownBody.match(/[\s\S]{1,8500}/g) || [];
  let lastWord = "";
  const resultContents = [];
  for (let i = 0; i < contents.length; i++) {
    let content = contents[i];
    content = lastWord + content;
    const number = content.lastIndexOf(" ");
    lastWord = content.substr(number + 1, content.length);
    resultContents[i] = content.substr(0, number);
  }
  return resultContents;
}

const splitNode = (node: FlattenAlgoliaNode): Array<FlattenAlgoliaNode> => {
  const { rawMarkdownBody, ...rest } = node;
  const subContents = constructSubContents(rawMarkdownBody);
  return subContents.map((content, index) => ({
    ...rest,
    rawMarkdownBody: content,
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
