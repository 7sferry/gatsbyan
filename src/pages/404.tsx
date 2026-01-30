import React from "react";

import Layout from "../components/Layout";
import robot from "../templates/robot404";
import Seo, { SeoTags, useSeo } from "../components/Seo";
import { SeoData } from "../types/DataTypes";
import { NoClientSide } from "../components/NoClientSide.tsx";

const NotFoundPage = () => {
  const seo: SeoData = useSeo({
    title: "Lost Pages",
  });

  return (
    <Layout>
      <SeoTags seo={seo} />
      <div
        dangerouslySetInnerHTML={{
          __html: robot,
        }}
      />
    </Layout>
  );
};

export default NotFoundPage;

export function Head() {
  const seo = useSeo({
    title: "Lost Pages",
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
