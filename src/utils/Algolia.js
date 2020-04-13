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
              excerpt(pruneLength: 300, truncate: true)
            }
          }
        }
    }
  }
}`;

const unnestMarkdown = node => {
  const { description, body, ...rest } = node;

  return {
    ...description,
    ...body.childMarkdownRemark,
    ...rest,
  };
};

const queries = [
  {
    query: allContentfulBlogPost,
    transformer: ({ data }) => data.allContentfulBlogPost.edges.map(edge => edge.node).map(unnestMarkdown),
  },
];

module.exports = queries;
