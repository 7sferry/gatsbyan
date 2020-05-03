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
  const { description, body, ...rest } = node;

  return {
    ...description,
    ...body.childMarkdownRemark,
    ...rest,
  };
};

const handleRawBody = node => {
  const { rawBody, ...rest } = node;
  const sections = rawBody.match(/[\s\S]{1,20000}/g) || [];
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
        .map(handleRawBody)
        .reduce((acc, cur) => [...acc, ...cur], []),
  },
];
// "Gw udah nyerah, angkat tangan mengoptimalkan website yang di blogger. Emang udah dari sananya lemot mau gimana lagi. Akhirnya sekarang gw mau pindah haluan. Mending bikin web sendiri daripada pake yg dari blogger. Semuanya bisa diatur sesuka hati sesuai kebutuhan dan lebih cepat loadingnya tentunya"
module.exports = queries;
