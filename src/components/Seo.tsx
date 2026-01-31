import { graphql, useStaticQuery } from "gatsby";
import { SeoAttr, SeoData, SeoParams, SeoSchemaData } from "../types/DataTypes";
import React from "react";

/************************
 * Made by [MR Ferry™]  *
 * on Januari 2023      *
 ************************/

export const SEO_CONSTANTS = {
  OG_TYPE: "website",
  OG_SITE_NAME: "Ferry Suhandri",
  OG_IMAGE_TYPE: "image/jpeg",
  OG_IMAGE_WIDTH: "338",
  OG_IMAGE_HEIGHT: "463",
  TWITTER_CARD: "summary",
  FB_APP_ID: "1365740643629290",
  GOOGLE_SITE_VERIFICATION: "zMJIuAagxg8apsDkd_7UPSzDGi7NIo6mwCx_GUcNXNw",
} as const;

export default function Seo({ lang = "id" }: SeoAttr) {
  return (
    <>
      <html lang={lang} />
      <title>ferry</title>
    </>
  );
}

export function useSeo({ title, description, path = "", image, date = "2024-11-29" }: SeoParams): SeoData {
  const { site } = useStaticQuery(graphql`
    query SeoQuery {
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
  `);

  const metadata = site.siteMetadata;
  const metaDescription = description || (path === "/" ? metadata.description : title);
  const metaImage = image ? `https:${image}` : `${metadata.siteUrl}/ferry-suhandri.jpg`;
  const metaImageLarge = image ? `https:${image}` : `${metadata.siteUrl}/ferry-suhandri-large.jpg`;
  const metaUrl = metadata.siteUrl + path;
  const schemaData: SeoSchemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    author: {
      "@type": "Person",
      name: metadata.realName,
    },
    publisher: {
      "@type": "Organization",
      name: metadata.author,
      logo: {
        "@type": "ImageObject",
        url: `${metadata.siteUrl}/ferry-suhandri-large.jpg`,
      },
    },
    datePublished: date,
    dateModified: date,
    image: metaImageLarge,
    description: metaDescription,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": metaUrl,
    },
  };

  const name = path?.startsWith("/blog") || path?.startsWith("/features") ? `| [${metadata.realName}]` : "";
  return {
    title: `${title} ${name}`,
    metadata: metadata,
    metaDescription: metaDescription,
    metaImage: metaImage,
    metaImageLarge: metaImageLarge,
    metaUrl: metaUrl,
    name: name,
    schemaDataJson: JSON.stringify(schemaData),
  };
}
