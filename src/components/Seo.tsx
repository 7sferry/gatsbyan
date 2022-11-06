import React from "react";
import Helmet from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

function Seo({ description, lang, title, image, url }: SeoAttr) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            realName
            siteUrl
          }
        }
      }
    `
  );

  let meta: any = [];
  const metadata = site.siteMetadata;
  const metaDescription = description ? description : metadata.description;
  const metaImage = image ? `https:${image}` : `${metadata.siteUrl}/ferry-suhandri.jpg`;
  const metaUrl = url || metadata.siteUrl;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${metadata.realName}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:url`,
          content: metaUrl,
        },
        {
          property: `og:image`,
          content: metaImage,
        },
        {
          property: `og:image:type`,
          content: "metaImage/jpg",
        },
        {
          property: `og:image:width`,
          content: "338",
        },
        {
          property: `og:image:height`,
          content: "463",
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: metadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:image`,
          content: metaImage,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          property: `fb:app_id`,
          content: `1365740643629290`,
        },
        {
          name: `google-site-verification`,
          content: `zMJIuAagxg8apsDkd_7UPSzDGi7NIo6mwCx_GUcNXNw`,
        },
      ].concat(meta)}
    />
  );
}

interface SeoAttr {
  description?: string;
  lang: string;
  title: string;
  image?: string | null;
  url?: string;
}

export default Seo;
