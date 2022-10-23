/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

const path = require(`path`);
const { kebab: kebabCase } = require("case");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allContentfulBlogPost {
              edges {
                node {
                  tags
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
          throw "error!";
        }

        const postSizeByTag = new Map();
        const {
          allContentfulBlogPost: { edges: posts },
        } = result.data;

        posts.forEach(post => {
          const node = post.node;
          node.tags &&
            node.tags.forEach(tag => {
              let tagCount = postSizeByTag.get(tag);
              postSizeByTag.set(tag, tagCount ? tagCount + 1 : 1);
            });

          createPage({
            path: `/blog/${node.slug}`,
            component: path.resolve("./src/templates/blog-post.js"),
            context: {
              slug: node.slug,
            },
          });
        });

        const postsPerPage = 10;
        const numPages = Math.ceil(posts.length / postsPerPage);
        Array.from({ length: numPages }).forEach((value, i) => {
          createPage({
            path: `/${i === 0 ? "" : "page/" + (i + 1)}`,
            component: path.resolve("./src/templates/index.js"),
            context: {
              limit: postsPerPage,
              skip: i * postsPerPage,
            },
          });
        });

        postSizeByTag.forEach((size, tag) => {
          const kebabTag = kebabCase(tag)
          const numTags = Math.ceil(size / postsPerPage);
          Array.from({ length: numTags }).forEach((value, i) => {
            createPage({
              path: `/tags/${kebabTag}${(i === 0 ? `` : `/${i + 1}`)}/`,
              component: path.resolve("./src/templates/index.js"),
              context: {
                tag: tag,
                kebabTag: kebabTag,
                limit: postsPerPage,
                skip: i * postsPerPage,
              },
            });
          });
        });

        createPage({
          path: `/search/`,
          component: path.resolve("./src/templates/search/search-page.js"),
        });

        createPage({
          path: `/blog/value-averaging-calculator`,
          component: path.resolve("./src/templates/custom-post.js"),
          context: {
            title: "Value Cost Averaging Calculator",
            description: "Value Averaging Calculator",
            slug: "/blog/value-averaging-calculator",
            publishDate: "2022-10-23",
          },
        });

        createPage({
          path: `/archive/`,
          component: path.resolve("./src/templates/archive.js"),
        });
      })
    );
  });
};
