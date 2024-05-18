/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

import path from "path";
import { kebabCase } from "./src/utils/GatsbyanUtils";
import { AllContentfulBlogPost } from "./src/types/DataTypes";
import { CreatePagesArgs, GatsbyNode } from "gatsby";
import { Sign } from "./src/components/Sign";

export const onPostBootstrap = () => {
  Sign();
};

export const createPages: GatsbyNode["createPages"] = ({ graphql, actions, reporter }: CreatePagesArgs) => {
  const { createPage, createRedirect, createSlice } = actions;

  return new Promise((resolve, reject) => {
    resolve(
      graphql<AllContentfulBlogPost>(`
        {
          allContentfulBlogPost {
            nodes {
              tags
              slug
            }
          }
        }
      `).then(({ errors, data }) => {
        if (errors) {
          console.log("errors: " + errors);
          reject(errors);
          reporter.panicOnBuild(`There was an error loading your Contentful posts`, errors);
          return;
        }

        createSlice({
          id: `Header`,
          component: path.resolve(`./src/components/header/Header.tsx`),
        });

        createSlice({
          id: `MobileBio`,
          component: path.resolve(`./src/components/header/MobileBio.tsx`),
        });

        createSlice({
          id: `Socials`,
          component: path.resolve(`./src/components/Socials.tsx`),
        });

        createSlice({
          id: `Bio`,
          component: path.resolve(`./src/components/sidebar/Bio.tsx`),
        });

        createSlice({
          id: `Tags`,
          component: path.resolve(`./src/components/sidebar/Tags.tsx`),
        });

        createSlice({
          id: `RightSidebar`,
          component: path.resolve(`./src/components/sidebar/RightSidebar.tsx`),
        });

        createSlice({
          id: `Comment`,
          component: path.resolve(`./src/components/Comment.tsx`),
        });

        createSlice({
          id: `PaginationSearchResult`,
          component: path.resolve(`./src/components/search/PaginationSearchResult.tsx`),
        });

        createSlice({
          id: `VoiceSearchElement`,
          component: path.resolve(`./src/components/search/VoiceSearchElement.tsx`),
        });

        const postSizeByTag = new Map<string, number>();
        const posts = data?.allContentfulBlogPost?.nodes ?? [];

        posts.forEach((node) => {
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
          component: path.resolve("./src/templates/search-page.tsx"),
          defer: true,
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
          fromPath: `/blog/t-e-r-c-o-l-o-n-g`,
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

        createRedirect({
          fromPath: `/blog/normalisasi-database`,
          toPath: `/blog/contoh-normalisasi-database`,
          redirectInBrowser: true,
          isPermanent: true,
        });

        createRedirect({
          fromPath: `/blog/value-averaging-calculator`,
          toPath: `/features/value-averaging-calculator`,
          redirectInBrowser: true,
          isPermanent: true,
        });

        createRedirect({
          fromPath: `/blog/fakta-unik-minangkabau-part-ii`,
          toPath: `/blog/fakta-unik-tentang-minangkabau-part-ii`,
          redirectInBrowser: true,
          isPermanent: true,
        });
      })
    );
  });
};
