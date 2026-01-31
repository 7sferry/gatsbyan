import React from "react";
import CustomPageContainer from "../../components/CustomPageContainer.tsx";
import { graphql, Link, useStaticQuery } from "gatsby";
import { CustomPostAttr, LocationProp, SeoData } from "../../types/DataTypes";
import { ValueAveragingForm } from "../../components/value-averaging/ValueAveragingForm.tsx";
import Seo, { SEO_CONSTANTS, useSeo } from "../../components/Seo";

/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2022      *
 ************************/

const pageContext: CustomPostAttr = {
  title: "Value Averaging Calculator",
  description: "Monthly Value Averaging Calculator. Kalkulator untuk menghitung Value Averaging secara bulanan",
  publishDate: "2022-10-23",
  lang: "id",
};

const ValueAveragingCalculator = ({ location }: LocationProp) => {
  const { site } = useStaticQuery(graphql`
    query BlogPageSlug {
      site {
        siteMetadata {
          repo
        }
      }
    }
  `);

  const seo: SeoData = useSeo({
    title: pageContext?.title ?? "",
    description: pageContext?.description,
    path: location?.pathname,
  });

  return (
    pageContext && (
      <CustomPageContainer site={site.siteMetadata} customPost={pageContext}>
        <link rel="canonical" href={seo.metaUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seo.schemaDataJson }} />
        <title>{seo.title}</title>
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
        <p>
          Berikut ini adalah kalkulator untuk menghitung investasi secara Value Averaging per-bulan. Untuk penjelasan
          mengenai strategi ini bisa dibaca tulisan tentang{" "}
          <Link to={"/blog/pengalaman-investasi-saham-selama-4-bulan#value-averaging"}> strategi saham</Link>
        </p>
        <ValueAveragingForm key={"monthlyInvestTarget"} />
      </CustomPageContainer>
    )
  );
};

export async function config() {
  return () => {
    return {
      defer: true,
    };
  };
}

export default ValueAveragingCalculator;

export function Head() {
  return <Seo lang={pageContext?.lang} />;
}
