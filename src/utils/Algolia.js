/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

const allContentfulBlogPost = `{
  allContentfulBlogPost {
    edges {
        node {
          publishDate(formatString: "DD MMMM YYYY")
          title
          slug
          body {
            childMarkdownRemark {
              plainText
              excerpt(pruneLength: 100, truncate: true)
            }
          }
        }
    }
  }
}`;

const unnestMarkdown = node => {
  const { body, ...rest } = node;

  return {
    ...body.childMarkdownRemark,
    ...rest,
  };
};

const handlePlainText = node => {
  const { plainText, ...rest } = node;
  const sections = plainText.match(/[\s\S]{1,7000}/g) || [];
  return sections.map(section => ({
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
      data.allContentfulBlogPost.edges
        .map(edge => edge.node)
        .map(unnestMarkdown)
        .map(handlePlainText)
        .reduce((acc, cur) => [...acc, ...cur], []),
  },
];

module.exports = queries;
