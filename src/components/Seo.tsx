import { graphql, useStaticQuery } from "gatsby";
import { SeoAttr, SeoData, SeoParams } from "../types/DataTypes";
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
    </>
  );
}

export function SeoTags({ seo }: { seo: SeoData }) {
  return (
    <>
      <link rel="canonical" href={seo.metaUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seo.schemaDataJson }} />
      <title id={"title"}>{seo.title}</title>
      <meta name="description" content={seo.metaDescription} />
      <meta name="og:title" content={seo.title} />
      <meta name="og:description" content={seo.metaDescription} />
      <meta name="og:type" content={SEO_CONSTANTS.OG_TYPE} />
      <meta name="og:site_name" content={SEO_CONSTANTS.OG_SITE_NAME} />
      <meta name="og:url" content={seo.metaUrl} />
      <meta name="og:image" content={seo.metaImageLarge} />
      <meta name="og:image:type" content={SEO_CONSTANTS.OG_IMAGE_TYPE} />
      <meta name="og:image:width" content={SEO_CONSTANTS.OG_IMAGE_WIDTH} />
      <meta name="og:image:height" content={SEO_CONSTANTS.OG_IMAGE_HEIGHT} />
      <meta name="twitter:card" content={SEO_CONSTANTS.TWITTER_CARD} />
      <meta name="twitter:creator" content={seo.metadata.author} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:image" content={seo.metaImage} />
      <meta name="twitter:description" content={seo.metaDescription} />
      <meta name="fb:app_id" content={SEO_CONSTANTS.FB_APP_ID} />
      <meta name="google-site-verification" content={SEO_CONSTANTS.GOOGLE_SITE_VERIFICATION} />
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
  const schemaData = {
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
