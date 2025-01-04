/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React from "react";
import { HeadProps, Slice } from "gatsby";
import "./archive.css";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import { getArchiveQuery } from "../utils/GetArchiveQuery";
import ArchiveContainer from "../components/ArchiveContainer.tsx";

const ArchivePage = () => {
  let archiveQuery = getArchiveQuery();
  const { allContentfulBlogPost } = archiveQuery;
  const posts = allContentfulBlogPost.nodes;
  if (posts.length === 0) {
    return (
      <Layout>
        <></>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="tech-tags mb-2 mobile-only text-center">
        <Slice alias={"Tags"} />
      </div>
      <ArchiveContainer posts={posts} />
    </Layout>
  );
};

export default ArchivePage;

export function Head({ location }: HeadProps) {
  return <Seo title={"Archive"} path={location?.pathname} />;
}
