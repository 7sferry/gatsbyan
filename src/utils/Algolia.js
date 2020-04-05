/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

const allContentfulBlogPost = `{
  allContentfulBlogPost {
    edges {
        node {
          slug
          body {
            childMarkdownRemark {
              plainText
            }
          }
          title
          description {
            description
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
