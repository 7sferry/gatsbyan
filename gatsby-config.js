/************************
 * Made by [MR Ferry™]  *
 * on January 2021      *
 ************************/

"use strict";
require("dotenv").config();
const siteConfig = require("./config");
const contentfulConfig = {
  spaceId: process.env.SPACEID,
  accessToken: process.env.TOKEN,
  // pageLimit: 100,
  // assetDownloadWorkers: 25,
  // downloadLocal: true,
};
const exclude = ["/tags/**", "/search", "/archive", "/404", "/404.html", "/page/**", "^[^?]+(\\?.*)", ".json$"];

module.exports = {
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
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        useMozJpeg: true,
        stripMetadata: true,
      },
      defaults: {
        placeholder: `dominantColor`,
        backgroundColor: `transparent`,
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
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     path: `${__dirname}/posts`,
    //     name: `blog`,
    //   },
    // },
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
        cache_busting_mode: 'none',
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
      resolve: `gatsby-plugin-google-analytics-reporter`,
      options: {
        email: process.env.ANALYTICS_EMAIL,
        privateKey: process.env.ANALYTICS_PRIVATE_KEY,
        viewId: process.env.ANALYTICS_VIEW_ID,
        // startDate: `30daysAgo`,
        endDate: `today`,
      },
    },
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     // The property ID; the tracking code won't be generated without it
    //     trackingId: process.env.ANALYTICS_TRACKING_ID,
    //     // Defines where to place the tracking script - `true` in the head and `false` in the body
    //     // head: false,
    //     pageTransitionDelay: 250,
    //     exclude: exclude,
    //     // Enables Google Optimize using your container Id
    //     // optimizeId: "ANALYTICS_OPTIMIZE_ID",
    //     // Enables Google Optimize Experiment ID
    //     // experimentId: "xgp72D0ZQaKYe3dWfy0L0Q",
    //     // Set Variation ID. 0 for original 1,2,3....
    //     // variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
    //     // Defers execution of google analytics script after page load
    //     defer: true,
    //     // Any additional optional fields
    //     // sampleRate: 5,
    //     // siteSpeedSampleRate: 10,
    //     // cookieDomain: "example.com",
    //   },
    // },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          process.env.ANALYTICS_GA4, // Google Analytics / GA
          // "AW-CONVERSION_ID", // Google Ads / Adwords / AW
          // "DC-FLOODIGHT_ID", // Marketing Platform advertising products (Display & Video 360, Search Ads 360, and Campaign Manager)
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {
          optimize_id: process.env.ANALYTICS_OPTIMIZE_ID,
          anonymize_ip: true,
          cookie_expires: 0,
        },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          // head: false,
          // Setting this parameter is also optional
          // respectDNT: true,
          // Avoids sending pageview hits from custom paths
          exclude: exclude,
          pageTransitionDelay: 250,
          defer: true,
          // Defaults to https://www.googletagmanager.com
          // origin: "YOUR_SELF_HOSTED_ORIGIN",
        },
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
    // {
    //   resolve: "gatsby-plugin-google-tagmanager",
    //   options: {
    //     id: "GTM-TXJJ82Z",
    //
    //     // Include GTM in development.
    //     // Defaults to false meaning GTM will only be loaded in production.
    //     includeInDevelopment: false,
    //
    //     // datalayer to be set before GTM is loaded
    //     // should be an object or a function that is executed in the browser
    //     // Defaults to null
    //     defaultDataLayer: { platform: "gatsby" },
    //
    //     // Specify optional GTM environment details.
    //     // gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
    //     // gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
    //     // dataLayerName: "YOUR_DATA_LAYER_NAME",
    //   },
    // },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    'gatsby-plugin-offline',
    // {
    //   resolve: "gatsby-plugin-algolia",
    //   options: {
    //     appId: process.env.GATSBY_ALGOLIA_APP_ID,
    //     apiKey: process.env.GATSBY_ALGOLIA_ADMIN_KEY,
    //     indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
    //     queries: require("./src/utils/Algolia"),
    //     enablePartialUpdates: true,
    //     chunkSize: 10000,
    //     matchFields: ['content'],
    //   },
    // },
  ],
};
