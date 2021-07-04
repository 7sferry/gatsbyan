/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

const allContentfulBlogPost = `{
  allContentfulBlogPost {
    edges {
        node {
          id
          publishDate(formatString: "DD MMMM YYYY")
          title
          slug
          body {
            childMarkdownRemark {
              rawMarkdownBody
              excerpt(pruneLength: 100, truncate: true)
            }
          }
        }
    }
  }
}`;

const unnestMarkdown = (node) => {
  const { body, ...rest } = node;
  const { childMarkdownRemark } = body;
  return {
    ...childMarkdownRemark,
    ...rest,
  };
};

const handlePlainText = (node) => {
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
    transformer: ({ data }) =>
      data["allContentfulBlogPost"].edges
        .map((edge) => edge.node)
        .map(unnestMarkdown)
        .map(handlePlainText)
        .reduce((acc, cur) => [...acc, ...cur], []),
  },
];

module.exports = queries;
