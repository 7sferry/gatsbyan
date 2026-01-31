/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React from "react";
import { Slice } from "gatsby";
import "./archive.css";
import Layout from "../components/Layout";
import Seo, { SEO_CONSTANTS, useSeo } from "../components/Seo";
import { LocationProp, SeoData } from "../types/DataTypes";

const ArchivePage = ({ location }: LocationProp) => {
  const seo: SeoData = useSeo({
    title: "Archives",
    path: location?.pathname,
  });

  return (
    <Layout>
      <link rel="canonical" href={seo.metaUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seo.schemaDataJson }} />
      <title>{`${seo.title} `}</title>
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
      <div className="tech-tags mb-2 mobile-only text-center">
        <Slice alias={"Tags"} />
      </div>
      <Slice alias={"ArchiveContainer"} />
    </Layout>
  );
};

export default ArchivePage;

export function Head() {
  return <Seo />;
}
