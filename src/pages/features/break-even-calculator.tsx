import React from "react";
import CustomPageContainer from "../../components/CustomPageContainer.tsx";
import { graphql, useStaticQuery } from "gatsby";
import Seo from "../../components/Seo";
import { CustomPostAttr } from "../../types/DataTypes";
import { BreakEvenForm } from "../../components/break-even/BreakEvenForm.tsx";

/************************
 * Made by [MR Ferry™]  *
 * on April 2026        *
 ************************/

const pageContext: CustomPostAttr = {
  title: "Break-Even Price Calculator",
  description:
    "Break-Even Price Calculator. Kalkulator untuk menghitung harga rata-rata (break-even) dari beberapa kali pembelian saham",
  publishDate: "2026-04-14",
  lang: "id",
};

const BreakEvenCalculator = () => {
  const { site } = useStaticQuery(graphql`
    query BreakEvenPageSlug {
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
          Berikut ini adalah kalkulator untuk menghitung harga rata-rata (break-even price) dari beberapa kali pembelian
          saham. Masukkan harga per unit dan jumlah lot untuk setiap pembelian.
        </p>
        <BreakEvenForm />
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

export default BreakEvenCalculator;

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
