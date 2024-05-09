/************************
 * Made by [MR Ferry™]  *
 * on January 2021      *
 ************************/

import type { GatsbyConfig } from "gatsby";
import siteConfig from "./config";
import { config } from "dotenv";

config();

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
const exclude = [
  "/tags/**",
  "/search",
  "/archive",
  "/404",
  "/404.html",
  "/page/**",
  "^[^?]+(\\?.*)",
  ".json$",
  "[?]",
  "[#]",
  "[%]",
];

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
    contacts: {
      linkedin: siteConfig.author.contacts.linkedin,
      github: siteConfig.author.contacts.github,
      crystal: siteConfig.author.contacts.crystal,
      stackOverFlow: siteConfig.author.contacts.stackOverFlow,
      resume: siteConfig.author.contacts.resume,
      facebook: siteConfig.author.contacts.facebook,
    },
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
        excludes: exclude,
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
        metric: `activeUsers`,
        startDate: `2020-01-01`,
        endDate: `today`,
      },
    },
    // {
    //   resolve: `gatsby-plugin-google-gtag`,
    //   options: {
    //     // You can add multiple tracking ids and a pageview event will be fired for all of them.
    //     trackingIds: [
    //       // process.env.ANALYTICS_GA4, // Google Analytics / GA
    //       process.env.ANALYTICS_MEASUREMENT_ID, // Google Analytics / GA
    //       // "AW-CONVERSION_ID", // Google Ads / Adwords / AW
    //       // "DC-FLOODIGHT_ID", // Marketing Platform advertising products (Display & Video 360, Search Ads 360, and Campaign Manager)
    //     ],
    //     // This object gets passed directly to the gtag config command
    //     // This config will be shared across all trackingIds
    //     gtagConfig: {
    //       // optimize_id: process.env.ANALYTICS_OPTIMIZE_ID,
    //       anonymize_ip: true,
    //       // cookie_expires: 0,
    //     },
    //     // This object is used for configuration specific to this plugin
    //     pluginConfig: {
    //       // Puts tracking script in the head instead of the body
    //       head: false,
    //       // Setting this parameter is also optional
    //       // respectDNT: true,
    //       // Avoids sending pageview hits from custom paths
    //       exclude: exclude,
    //       delayOnRouteUpdate: 0,
    //       // Defaults to https://www.googletagmanager.com
    //       // origin: "https://www.googletagmanager.com",
    //     },
    //   },
    // },
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
    //     queries: require("./src/utils/Algolia"),
    //     chunkSize: 10000,
    //   },
    // },
  ],
  partytownProxiedURLs: [`https://www.googletagmanager.com/gtag/js?id=${process.env.ANALYTICS_MEASUREMENT_ID}`],
};

export default gatsbyConfig;
