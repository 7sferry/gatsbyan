/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

const path = require(`path`);
const { kebab: kebabCase } = require("case");
const customPosts = require("./custom-posts").customPosts;

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  customPosts.forEach(post =>
    createNode({
      ...post,
      id: createNodeId(`customPost-${post.slug}`),
      parent: null,
      children: [],
      internal: {
        type: "customPost",
        contentDigest: createContentDigest(post),
      },
    })
  )
}

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

        customPosts.forEach(customPost => {
          createPage({
            path: customPost.slug,
            component: path.resolve("./src/templates/custom-post.js"),
            context: {
              title: customPost.title,
              description: customPost.description,
              slug: customPost.slug,
              publishDate: customPost.publishDate,
            },
          });
        });

        createPage({
          path: `/archive/`,
          component: path.resolve("./src/templates/archive.js"),
        });
      })
    );
  });
};
