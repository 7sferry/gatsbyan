const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const _ = require("lodash");

// exports.onCreateNode = ({ node, getNode, actions }) => {
//   const { createNodeField } = actions;
//   if (node.internal.type === `MarkdownRemark`) {
//     const slug = createFilePath({ node, getNode, basePath: `pages` });
//     createNodeField({
//       node,
//       name: `slug`,
//       value: slug,
//     });
//   }
// };

// exports.createPages = ({ graphql, actions }) => {
//   const { createPage } = actions;
//   return graphql(`
//     {
//       allMarkdownRemark {
//         edges {
//           node {
//             frontmatter {
//               tags
//             }
//             fields {
//               slug
//             }
//           }
//         }
//       }
//     }
//   `).then(result => {
//     const posts = result.data.allMarkdownRemark.edges;
//     posts.forEach(({ node }) => {
//       createPage({
//         path: node.fields.slug,
//         component: path.resolve(`./src/templates/blog-post.js`),
//         context: {
//           // Data passed to context is available
//           // in page queries as GraphQL variables.
//           slug: node.fields.slug,
//         },
//       });
//     });
//
//     // Tag pages:
//     let tags = [];
//     // Iterate through each post, putting all found tags into `tags`
//     _.each(posts, edge => {
//       if (_.get(edge, "node.frontmatter.tags")) {
//         tags = tags.concat(edge.node.frontmatter.tags);
//       }
//     });
//
//     // Eliminate duplicate tags
//     tags = _.uniq(tags);
//
//     // Make tag pages
//     tags.forEach(tag => {
//       createPage({
//         path: `/tags/${_.kebabCase(tag)}/`,
//         component: path.resolve("src/templates/tag.js"),
//         context: {
//           tag,
//         },
//       });
//     });
//
//     const postsPerPage = 5;
//     const numPages = Math.ceil(posts.length / postsPerPage);
//
//     Array.from({ length: numPages }).forEach((_, i) => {
//       createPage({
//         path: i === 0 ? `/` : `/${i + 1}`,
//         component: path.resolve("./src/templates/post-list.js"),
//         context: {
//           limit: postsPerPage,
//           skip: i * postsPerPage,
//           numPages,
//           currentPage: i + 1,
//         },
//       });
//     });
//   });
// };

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve("./src/templates/blog-post.js");
    resolve(
      graphql(
        `
          {
            allContentfulBlogPost {
              edges {
                node {
                  tags
                  title
                  slug
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        const posts = result.data.allContentfulBlogPost.edges;
        posts.forEach(post => {
          createPage({
            path: `/blog/${post.node.slug}/`,
            component: blogPost,
            context: {
              slug: post.node.slug,
            },
          });
        });

        const postsPerPage = 2;
        const numPages = Math.ceil(posts.length / postsPerPage);
        Array.from({ length: numPages }).forEach((_, i) => {
          createPage({
            path: i === 0 ? `/` : `/${i + 1}`,
            component: path.resolve("./src/pages/index.js"),
            context: {
              limit: postsPerPage,
              skip: i * postsPerPage,
            },
          });
        });
//     // Tag pages:
    let tags = new Set();
    // Iterate through each post, putting all found tags into `tags`
    _.each(posts, edge => {
      if (_.get(edge, "node.tags")) {
        edge.node.tags.forEach(tag => {
          tags.add(tag);
        })
      }
    });
    // Make tag pages
    tags.forEach(tag => {
      createPage({
        path: `/tags/${_.kebabCase(tag)}/`,
        component: path.resolve("src/pages/index.js"),
        context: {
          tag,
        },
      });
    });
      })
    );
  });
};
