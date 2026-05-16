import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { SeoAttr, SeoSchemaData } from "../types/DataTypes";

/************************
 * Made by [MR Ferry™]  *
 * on Januari 2023      *
 ************************/

export default function Seo({
  description,
  lang = "id",
  title = "",
  image,
  path = "",
  date,
  updatedAt,
  rating = 5,
  timeToRead,
}: SeoAttr) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          realName
          siteUrl
          publishDate
          updatedAt
        }
      }
    }
  `);

  const metadata = site.siteMetadata;
  const metaDescription = description || (path === "/" ? metadata.description : title);
  const metaImage = image ? `https:${image}` : `${metadata.siteUrl}/ferry-suhandri.jpg`;
  const metaImageLarge = image ? `https:${image}` : `${metadata.siteUrl}/ferry-suhandri-large.jpg`;
  const metaUrl = metadata.siteUrl + path;
  const publishedDateTime = date || metadata.publishDate;
  const updatedDateTime = updatedAt || metadata.updatedAt;
  const schemaData: SeoSchemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    name: title,
    identifier: metadata.realName,
    author: {
      "@id": metadata.siteUrl,
      "@type": "Person",
      identifier: metadata.realName,
      name: metadata.realName,
      url: metadata.siteUrl,
      sameAs: [
        "https://github.com/7sferry",
        "https://www.linkedin.com/in/7sferry/",
        "https://ferry.netlify.app/",
        "https://instagram.com/7sferry",
        "https://facebook.com/7sferry",
        "https://x.com/ferrys37",
        "https://www.crystalknows.com/p/ferry",
      ],
    },
    creator: {
      "@id": metadata.siteUrl,
      "@type": "Person",
      identifier: metadata.realName,
      name: metadata.realName,
      url: metadata.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: metadata.author,
      "@id": metadata.siteUrl,
      url: metadata.siteUrl,
      logo: {
        "@type": "ImageObject",
        width: 540,
        height: 403,
        url: `${metadata.siteUrl}/ferry-suhandri-large.jpg`,
      },
    },
    dateCreated: publishedDateTime,
    datePublished: publishedDateTime,
    dateModified: updatedDateTime,
    image: [metaImageLarge],
    url: metaUrl,
    "@id": metaUrl,
    description: metaDescription,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": metaUrl,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: `${rating}`,
      bestRating: "5",
      worstRating: "1",
      ratingCount: `${metaDescription?.length}`,
    },
    isAccessibleForFree: true,
  };

  let name = path?.startsWith("/blog") || path?.startsWith("/features") ? `[${metadata.realName}]` : "";
  return (
    <>
      <html lang={lang} />
      <link rel="canonical" href={metaUrl} />
      <link rel="author" href={metadata.siteUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <title>{`${title} ${name}`}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta name="title" content={title} />
      <meta name="application-name" content={metadata.realName} />
      <meta property="og:type" content={`article`} />
      <meta property="article:author" content={metadata.siteUrl} />
      <meta property="article:published_time" content={publishedDateTime} />
      <meta property="article:modified_time" content={updatedDateTime} />
      <meta name="robots" content="index,follow,max-image-preview:large" />
      <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:site_name" content={metadata.realName} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaImageLarge} />
      <meta name="author" content={metadata.realName} />
      <meta name="publisher" content={metadata.realName} />
      <meta name="creator" content={metadata.realName} />
      <meta name="referrer" content="origin-when-cross-origin" />
      <meta property="og:image:type" content={`image/jpeg`} />
      <meta property="og:image:width" content={`338`} />
      <meta property="og:image:height" content={`463`} />
      <meta name="content-language" content={lang} />
      <meta name="twitter:card" content={`summary`} />
      <meta name="twitter:creator" content={metadata.author} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:description" content={metaDescription} />
      {timeToRead && <meta name="twitter:label1" content="Reading time" />}
      {timeToRead && <meta name="twitter:data1" content={timeToRead} />}
      <meta property="fb:app_id" content={`1365740643629290`} />
      <meta name="google-site-verification" content={`zMJIuAagxg8apsDkd_7UPSzDGi7NIo6mwCx_GUcNXNw`} />
    </>
  );
}
