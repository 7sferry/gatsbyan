/************************
 * Made by [MR Ferry™]  *
 * on January 2021      *
 ************************/

import type { GatsbyConfig } from "gatsby";
import siteConfig from "./config.ts";
import { trackingExclude } from "./src/utils/AnalyticsConfig.ts";
import "dotenv/config";

function isProduction() {
  return process.env.NODE_ENV === "production" || !process.env.PREVIEW_TOKEN;
}

const contentfulConfig = {
  spaceId: process.env.SPACEID,
  accessToken: isProduction() ? process.env.TOKEN : process.env.PREVIEW_TOKEN,
  host: isProduction() ? "cdn.contentful.com" : "preview.contentful.com",
  // pageLimit: 100,
  // assetDownloadWorkers: 25,
  // downloadLocal: true,
};

const gatsbyConfig: GatsbyConfig = {
  trailingSlash: "never",
  siteMetadata: {
    siteUrl: siteConfig.url,
    repo: siteConfig.repo,
    title: siteConfig.title,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    author: siteConfig.author.name,
    realName: siteConfig.author.realName,
    copyright: siteConfig.copyright,
    publishDate: siteConfig.publishDate,
    updatedAt: siteConfig.updatedAt,
  },
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        useMozJpeg: true,
        stripMetadata: true,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        entryLimit: 5000,
        excludes: trackingExclude,
      },
    },
    {
      resolve: "gatsby-source-contentful",
      options: contentfulConfig,
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-table-caption`,
          `gatsby-remark-code-titles`,
          `gatsby-remark-prismjs-copy-button`,
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
          {
            resolve: `gatsby-remark-images-contentful`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 1200,
              linkImagesToOriginal: false,
              withWebp: true,
              showCaptions: true,
              backgroundColor: "transparent",
              loading: "lazy",
            },
          },
          {
            resolve: `gatsby-remark-link-on-headers`,
            options: {
              headings: [`h2`, `h3`],
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: siteConfig.author.realName,
        short_name: siteConfig.author.name,
        description: siteConfig.description,
        lang: `id`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#3948DF`,
        display: `standalone`,
        crossOrigin: `anonymous`,
        icon_options: {
          // For all the options available, please see:
          // https://developer.mozilla.org/en-US/docs/Web/Manifest
          // https://w3c.github.io/manifest/#purpose-member
          purpose: `any maskable`,
        },
        icon: `src/images/avatar.png`, // This path is relative to the root of the site.
        cache_busting_mode: "none",
        icons: [
          {
            src: `/favicons/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/favicons/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics-data-reporting-api`,
      options: {
        serviceAccountEmail: process.env.ANALYTICS_EMAIL,
        privateKey: process.env.ANALYTICS_PRIVATE_KEY,
        property: process.env.ANALYTICS_GA4,
        metric: `scrolledUsers`,
        startDate: `2020-01-01`,
        endDate: `today`,
        regexFilter: `^/blog/`,
      },
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        // printRejected: true, // Print removed selectors and processed file names
        develop: true, // Enable while using `gatsby develop`
        ignore: ["/ignored"], // Ignore files/folders
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    "gatsby-plugin-offline",
    // {
    //   resolve: "gatsby-plugin-algolia",
    //   options: {
    //     appId: process.env.GATSBY_ALGOLIA_APP_ID,
    //     apiKey: process.env.ALGOLIA_ADMIN_KEY,
    //     indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
    //     queries: require("./src/utils/Algolia").queries,
    //     chunkSize: 10000,
    //   },
    // },
  ],
};

export default gatsbyConfig;
