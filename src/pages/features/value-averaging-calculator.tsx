import React from "react";
import CustomPageContainer from "../../components/CustomPageContainer.tsx";
import { graphql, Link, useStaticQuery } from "gatsby";
import { CustomPostAttr, LocationProp, SeoData } from "../../types/DataTypes";
import { ValueAveragingForm } from "../../components/value-averaging/ValueAveragingForm.tsx";
import Seo, { SeoTags, useSeo } from "../../components/Seo";
import { NoClientSide } from "../../components/NoClientSide.tsx";

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
        <SeoTags seo={seo} />
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
  const seo = useSeo({
    title: pageContext?.title ?? "",
    description: pageContext?.description,
  });
  return (
    <>
      <Seo lang={pageContext?.lang} />
      <NoClientSide>
        <SeoTags seo={seo} />
      </NoClientSide>
    </>
  );
}
