/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React from "react";
import { Slice } from "gatsby";
import "./archive.css";
import Layout from "../components/Layout";
import Seo, { SeoTags, useSeo } from "../components/Seo";
import { LocationProp, SeoData } from "../types/DataTypes";
import { NoClientSide } from "../components/NoClientSide.tsx";

const ArchivePage = ({ location }: LocationProp) => {
  const seo: SeoData = useSeo({
    title: "Archives",
    path: location?.pathname,
  });

  return (
    <Layout>
      <SeoTags seo={seo} />
      <div className="tech-tags mb-2 mobile-only text-center">
        <Slice alias={"Tags"} />
      </div>
      <Slice alias={"ArchiveContainer"} />
    </Layout>
  );
};

export default ArchivePage;

export function Head({ location }: LocationProp) {
  const seo = useSeo({
    title: "Archives",
    path: location?.pathname,
  });
  return (
    <>
      <Seo />
      <NoClientSide>
        <SeoTags seo={seo} />
      </NoClientSide>
    </>
  );
}
