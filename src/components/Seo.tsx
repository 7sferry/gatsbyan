import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { SeoAttr } from "../types/DataTypes";

/************************
 * Made by [MR Ferry™]  *
 * on Januari 2023      *
 ************************/

export default function Seo({ description, lang = "id", title = "", image, path = "" }: SeoAttr) {
  const { site } = useStaticQuery(graphql`
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
  `);

  const metadata = site.siteMetadata;
  const metaDescription = description || (path === "/" ? metadata.description : "");
  const metaImage = image ? `https:${image}` : `${metadata.siteUrl}/ferry-suhandri.jpg`;
  const metaUrl = metadata.siteUrl + path;

  let name = path === "/" || path?.startsWith("/blog") ? `[${metadata.realName}]` : "";
  return (
    <>
      <html lang={lang} />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
        media="print"
      />
      <noscript>
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
          type="text/css"
        />
      </noscript>
      <title>{`${title} ${name}`}</title>
      <meta name="description" content={metaDescription} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={metaDescription} />
      <meta name="og:type" content={`website`} />
      <meta name="og:url" content={metaUrl} />
      <meta name="og:image" content={metaImage} />
      <meta name="og:image:type" content={`metaImage/jpg`} />
      <meta name="og:image:width" content={`338`} />
      <meta name="og:image:height" content={`463`} />
      <meta name="twitter:card" content={`summary`} />
      <meta name="twitter:creator" content={metadata.author} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="fb:app_id" content={`1365740643629290`} />
      <meta name="google-site-verification" content={`zMJIuAagxg8apsDkd_7UPSzDGi7NIo6mwCx_GUcNXNw`} />
    </>
  );
}
