/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React from "react";
import { HeadProps, Slice } from "gatsby";
import "./archive.css";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import { FolderIcon } from "../components/MyIcon.tsx";

const ArchivePage = () => {
  return (
    <Layout>
      <FolderIcon />
      <div className="tech-tags mb-2 mobile-only text-center">
        <Slice alias={"Tags"} />
      </div>
      <Slice alias={"ArchiveContainer"} />
    </Layout>
  );
};

export default ArchivePage;

export function Head({ location }: HeadProps) {
  return <Seo title={"Archive"} path={location?.pathname} />;
}
