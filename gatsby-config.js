"use strict";
require("dotenv").config();
const siteConfig = require("./config");
const contentfulConfig = {
  spaceId: process.env.SPACEID,
  accessToken: process.env.TOKEN,
};
const queries = require("./src/utils/Algolia");

module.exports = {
  siteMetadata: {
    siteUrl: siteConfig.url,
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
      blogger: siteConfig.author.contacts.blogger,
      resume: siteConfig.author.contacts.resume,
      facebook: siteConfig.author.contacts.facebook,
    },
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-remark-plaintext`,
    `gatsby-transformer-sqip`,
    `gatsby-plugin-minify`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        sitemapSize: 5000,
      },
    },
    // {
    //   resolve: "gatsby-plugin-algolia",
    //   options: {
    //     appId: process.env.GATSBY_ALGOLIA_APP_ID,
    //     apiKey: process.env.GATSBY_ALGOLIA_ADMIN_KEY,
    //     indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
    //     queries,
    //     chunkSize: 10000,
    //   },
    // },
    {
      resolve: "gatsby-source-contentful",
      options: contentfulConfig,
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/posts`,
        name: `blog`,
      },
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
          `gatsby-remark-responsive-iframe`,
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
            resolve: `gatsby-remark-images-zoom`,
            options: {
              margin: 26,
              scrollOffset: 30,
              background: "transparent",
              zIndex: 0,
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
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Raleway`,
          `source sans pro\:300,400,400i,700`, // you can also specify font weights and styles
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: siteConfig.author.realName,
        short_name: siteConfig.author.name,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#3948DF`,
        display: `minimal-ui`,
        icon: `src/images/avatar.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics-reporter`,
      options: {
        email: 'ferry-now-sh@gatsbyan-1585301142869.iam.gserviceaccount.com',
        privateKey: '-----BEGIN PRIVATE KEY-----\\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDaWzEx1lgM2+vM\\nawnpeWsRXx5Hu35VtZ/wFVym4LFwfAp//LmpK1JpgLo6MRdpW/Kh6TlrkydiD8r4\\nBDivUpeXUMqPwFOde9WXUAnf4JMxcIoHVUm4vERE3DsGwenxbQEiDICyKH+LSlkm\\n4zRJVSwtCm57VkKwzj2qtVyBDgLRTbUe4i0JplEM0AfSlSDAAlL+25H0AJZsEd1U\\nLCGj015EBK1hADbW3M+ooF5GnRGFnpf+velnbXExSsM3mQTYpq9NN+VmH25ywzMi\\nU7i0JC++mkBZ5vDRvztlnxruffbi3It+L0y/bTgTDj3jOvw6eJk0eVwBv/XMQMjJ\\nkyisALfpAgMBAAECggEAGBuq6A16DbtnQpvLzZ0D+vhFQ9a52VUy+iMlpmAW/ywW\\nzbA1wG2BzRezF/MtGksWVBWHqy6lUcCcIHt41bSY+5ImNy5dHP1b5Peni3IEVlhO\\nSQZ72/tfTzoAg1u8DFWEY0G9oM3zXQnho3dA4drXRIbLEW+B7/rpWJRrCO2m1nxZ\\nbJQZLxp5PKx+CIqSyDI46ocSGxc3FNN/XDuU8+23GkNIPZlOU7wUc6bq5nRuOH/v\\n+ug8UBbQzbtIHctsJ0KrLsCqmxw4wJWI+WcRJyIkD+JwulTsrLAz6vVDvR0oSqoz\\nFqY+t2p/p2E0crY3OSzGwqscyyIzNlxfftv/vxuGAQKBgQDwdPla4dtHHjWQBuAu\\nb9Gq3HWbSPkCkDtbwLLM6UmVCOo9w9csBQfRBxZPrXzqlMdQa0/fcGP7SyNWlRc+\\nOxlsqRI6xr22u+dHGeChJQZpzmLOGjn9biSBr2TWYLpBn3isem4mwsoYXlluYOMD\\nYR2tG/h5s3Mm2aJiO81lLJdxAQKBgQDoeIAqsf/Crjr87dX2VALM66zHz4D1uhUs\\nznsVpV3DdvhY7AL3n+fK3vIZO/w1cvHiz4YW5wyvFIHp7hFyUP77bJ1qKxgY0j3l\\nS5uk7hMJjqgOdYAtYa43S77SBkfoiPTE9DF3cX+JvmM/k/B4c1HQcH9qxmo7cmPj\\nKZFqVize6QKBgBM29boadEBRnKwesIllbBbAOTGoeiWHSwcA9gjD15puNPGslaQx\\n3rcIXvMNBP9l1iuJ977+Jy8siO1hSpMxe82gERHbUcupZkjbO4UFBWctE94uYFXt\\nGEO4tVEgN6II0UbPHcBBLo8V8wWL/ngFqa5snsVy3o/LMluxNa+RCaUBAoGALUMI\\n8Ucm3Oi/Y2+LMSK6SNu6EE0+dpl8dfTd0iEYWG5ZfDa3fS8NGlq+GFuth1qR7e8p\\n1Fu4BH6hrMJFc1SB0MIdBAbP8kU899/4tewEmN/FqMsH4c4a9Xkx9gJzDbtcrNw+\\npVrb0h3XhRFwyILrcwH0TP3EwT5MZHY7cdDFe8ECgYBm6H8WxTbHHsnrLZIqf3og\\niVbgeHzaNmaM2oldC4Mp9YtkvnsYeCUgD/OrdM6b0YorM8z2sz6swqJ7qjdHKa0p\\nCQPG2eWU8A8KQcyvFAkJW/DtevQKwZSPLoY8K46Js4LxtwlKLnT+Ufdsv4hf7IGt\\nMxOHQqGN+/5gHVk3PdDHxA==\\n-----END PRIVATE KEY-----\\n',
        viewId: '217339696',
        // startDate: `30daysAgo`,
        endDate: `today`
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "UA-165368793-1",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: true,
        // Enables Google Optimize using your container Id
        // optimizeId: "OPT-P5SQMN6",
        // Enables Google Optimize Experiment ID
        // experimentId: "xgp72D0ZQaKYe3dWfy0L0Q",
        // Set Variation ID. 0 for original 1,2,3....
        // variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
        // Defers execution of google analytics script after page load
        defer: false,
        // Any additional optional fields
        // sampleRate: 5,
        // siteSpeedSampleRate: 10,
        // cookieDomain: "example.com",
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
    `gatsby-plugin-offline`,
  ],
};
