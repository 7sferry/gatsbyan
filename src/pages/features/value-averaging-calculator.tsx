import React from "react";
import CustomPageContainer from "../../components/CustomPageContainer.tsx";
import { graphql, Link, useStaticQuery } from "gatsby";
import Seo from "../../components/Seo";
import { CustomPostAttr } from "../../types/DataTypes";
import { ValueAveragingForm } from "../../components/value-averaging/ValueAveragingForm.tsx";

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

const ValueAveragingCalculator = () => {
  const { site } = useStaticQuery(graphql`
    query BlogPageSlug {
      site {
        siteMetadata {
          repo
        }
      }
    }
  `);

  return (
    pageContext && (
      <CustomPageContainer site={site.siteMetadata} customPost={pageContext}>
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

export function Head({ location }: any) {
  return (
    <Seo
      title={pageContext?.title}
      description={pageContext?.description}
      lang={pageContext?.lang}
      path={location?.pathname}
    />
  );
}
