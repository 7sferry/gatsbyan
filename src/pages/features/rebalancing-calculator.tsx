import React from "react";
import CustomPageContainer from "../../components/CustomPageContainer.tsx";
import { graphql, useStaticQuery } from "gatsby";
import Seo from "../../components/Seo";
import { CustomPostAttr } from "../../types/DataTypes";
import { RebalancingForm } from "../../components/rebalancing/RebalancingForm.tsx";

/************************
 * Made by [MR Ferry™]  *
 * on April 2026        *
 ************************/

const pageContext: CustomPostAttr = {
  title: "Portfolio Rebalancing Calculator",
  description:
    "Portfolio Rebalancing Calculator. Kalkulator untuk menghitung rebalancing portfolio investasi sesuai target alokasi",
  publishDate: "2026-04-14",
  lang: "id",
};

const RebalancingCalculator = () => {
  const { site } = useStaticQuery(graphql`
    query RebalancingPageSlug {
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
          Berikut ini adalah kalkulator untuk menghitung rebalancing portfolio investasi. Masukkan nama aset, nilai saat
          ini, dan target alokasi (%) untuk setiap aset. Total target alokasi harus 100%.
        </p>
        <RebalancingForm />
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

export default RebalancingCalculator;

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
