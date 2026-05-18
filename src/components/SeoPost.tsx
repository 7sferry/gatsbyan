import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { SeoPostAttr, SeoPostSchemaData } from "../types/DataTypes";
import { getDateYear } from "../utils/DateUtils.tsx";

/************************
 * Made by [MR Ferry™]  *
 * on Januari 2023      *
 ************************/

export default function SeoPost({
  description,
  lang = "id",
  title = "",
  image,
  path = "",
  publishDate,
  timeToRead,
  tags,
}: SeoPostAttr) {
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
          tagline
        }
      }
    }
  `);

  const metadata = site.siteMetadata;
  const metaImage = `https:${image}`;
  const metaUrl = metadata.siteUrl + path;
  const updatedDateTime = getDateYear(metadata.updatedAt);
  const techTags = new Set(["Spring", "Database", "Design Pattern", "Java", "JavaScript", "Programming Principle"]);
  const keywords = [...tags].join(", ");

  const schemaData: SeoPostSchemaData = {
    "@context": "https://schema.org",
    "@type": tags.find((tag) => techTags.has(tag)) ? "TechArticle" : "BlogPosting",
    "@id": metaUrl,
    mainEntityOfPage: metaUrl,
    headline: title,
    name: title,
    description: description,
    datePublished: publishDate,
    dateModified: updatedDateTime,
    author: {
      "@type": "Person",
      "@id": metadata.siteUrl + "#",
      name: metadata.realName,
      url: metadata.siteUrl,
      description: metadata.tagline,
      jobTitle: "Software Engineer",
      knowsAbout: [
        "Java",
        "JavaScript",
        "Spring Boot",
        "Programming Principle",
        "Programming",
        "Web Developer",
        "Software Architecture",
        "Design Patterns",
        "Hibernate",
        "Unit Test",
        "Object Oriented Programming",
        "Backend Engineering",
        "Clean Architecture",
        "Hexagonal Architecture",
        "System Design",
        "Database",
        "MySQL",
        "SQL",
        "Message Broker",
        "PostgreSql",
        "Redis",
        "Investment",
        "Football",
      ],
      image: {
        "@type": "ImageObject",
        width: 540,
        height: 403,
        url: `${metadata.siteUrl}/ferry-suhandri-large.jpg`,
        "@id": `${metadata.siteUrl}/ferry-suhandri-large.jpg`,
      },
      sameAs: [
        "https://github.com/7sferry",
        "https://www.linkedin.com/in/7sferry/",
        "https://ferry.netlify.app/",
        "https://instagram.com/7sferry",
        "https://facebook.com/7sferry",
        "https://x.com/ferrys37",
      ],
    },
    publisher: {
      "@type": "Organization",
      "@id": metadata.siteUrl,
      name: metadata.author,
      url: metadata.siteUrl,
      logo: {
        "@type": "ImageObject",
        width: 600,
        height: 600,
        url: `${metadata.siteUrl}/ferry-suhandri.jpg`,
        "@id": `${metadata.siteUrl}/ferry-suhandri.jpg`,
      },
    },
    articleSection: tags,
    about: tags.map((tag) => {
      return { "@type": "Thing", name: tag };
    }),
    keywords: keywords,
    image: [metaImage],
    url: metaUrl,
  };

  return (
    <>
      <html lang={lang} />
      <link rel="canonical" href={metaUrl} />
      <link rel="author" href={metadata.realName} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <title>{`${title} [${metadata.realName}]`}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta name="title" content={title} />
      <meta name="application-name" content={metadata.realName} />
      <meta property="og:type" content={`article`} />
      <meta property="article:author" content={metadata.realName} />
      <meta property="article:published_time" content={publishDate} />
      <meta property="article:modified_time" content={updatedDateTime} />
      <meta name="robots" content="index,follow,max-image-preview:large" />
      <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={"Blog " + metadata.realName} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaImage} />
      <meta name="author" content={metadata.realName} />
      <meta name="publisher" content={metadata.realName} />
      <meta name="creator" content={metadata.realName} />
      <meta name="referrer" content="origin-when-cross-origin" />
      <meta property="og:image:type" content={`image/jpeg`} />
      <meta property="og:image:width" content={`338`} />
      <meta property="og:image:height" content={`463`} />
      <meta name="content-language" content={lang} />
      <meta name="keywords" content={keywords} />
      <meta name="twitter:card" content={`summary`} />
      <meta name="twitter:creator" content={metadata.author} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:label1" content="Reading time" />
      <meta name="twitter:data1" content={timeToRead} />
      <meta property="fb:app_id" content={`1365740643629290`} />
      <meta name="google-site-verification" content={`zMJIuAagxg8apsDkd_7UPSzDGi7NIo6mwCx_GUcNXNw`} />
    </>
  );
}
