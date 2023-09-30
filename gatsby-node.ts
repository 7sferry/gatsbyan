/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

import path from "path";
import { kebabCase } from "./src/utils/GatsbyanUtils";
import { AllContentfulBlogPost } from "./src/types/DataTypes";

exports.createPages = ({ graphql, actions }: any) => {
  const { createPage, createRedirect } = actions;

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
      ).then((result: { errors: any; data: AllContentfulBlogPost }) => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
          throw "error!";
        }

        const postSizeByTag = new Map();
        const {
          allContentfulBlogPost: { edges: posts },
        } = result.data;

        posts.forEach((post) => {
          const node = post.node;
          node.tags &&
            node.tags.forEach((tag) => {
              let tagCount = postSizeByTag.get(tag);
              postSizeByTag.set(tag, tagCount ? tagCount + 1 : 1);
            });

          createPage({
            path: `/blog/${node.slug}`,
            component: path.resolve("./src/templates/blog-post.tsx"),
            context: {
              slug: node.slug,
            },
          });
        });

        const postsPerPage = 10;
        const numPages = Math.ceil(posts.length / postsPerPage);
        Array.from({ length: numPages }).forEach((_value, i) => {
          createPage({
            path: `/${i === 0 ? "" : "page/" + (i + 1)}`,
            component: path.resolve("./src/templates/index.tsx"),
            context: {
              limit: postsPerPage,
              skip: i * postsPerPage,
            },
          });
        });

        postSizeByTag.forEach((size, tag) => {
          const kebabTag = kebabCase(tag);
          const numTags = Math.ceil(size / postsPerPage);
          Array.from({ length: numTags }).forEach((value, i) => {
            createPage({
              path: `/tags/${kebabTag}${i === 0 ? `` : `/${i + 1}`}`,
              component: path.resolve("./src/templates/index.tsx"),
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
          path: `/search`,
          component: path.resolve("./src/templates/search/search-page.tsx"),
        });

        createPage({
          path: `/archive`,
          component: path.resolve("./src/templates/archive.tsx"),
        });

        createRedirect({
          fromPath: `/blog/download-gatsby-blog-starters-and-contentful-cms-template`,
          toPath: `/blog/migrasi-blog-ke-gatsby`,
          redirectInBrowser: true,
          isPermanent: true,
        });

        createRedirect({
          fromPath: `/blog/orang-padang-vs-orang-minangkabau`,
          toPath: `/blog/fakta-unik-minangkabau`,
          redirectInBrowser: true,
          statusCode: 301,
        });

        createRedirect({
          fromPath: `/blog/t-e-r-c-o-l-o-n-g/`,
          toPath: `/blog/tercolong`,
          redirectInBrowser: true,
          isPermanent: true,
        });

        createRedirect({
          fromPath: `/blog/acid-pada-database-consistency`,
          toPath: `/blog/acid-pada-database#consistency`,
          redirectInBrowser: true,
          isPermanent: true,
        });

        createRedirect({
          fromPath: `/blog/acid-pada-database-atomicity`,
          toPath: `/blog/acid-pada-database#atomicity`,
          redirectInBrowser: true,
          isPermanent: true,
        });

        createRedirect({
          fromPath: `/blog/acid-pada-database-durability`,
          toPath: `/blog/acid-pada-database#durability`,
          redirectInBrowser: true,
          isPermanent: true,
        });
      })
    );
  });
};
