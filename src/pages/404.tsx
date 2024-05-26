import React from "react";

import Layout from "../components/Layout";
import robot from "../templates/robot404";
import Seo from "../components/Seo";

const NotFoundPage = () => (
  <Layout>
    <div
      dangerouslySetInnerHTML={{
        __html: robot,
      }}
    />
  </Layout>
);

export async function config() {
  return () => {
    return {
      defer: true,
    };
  };
}

export default NotFoundPage;

export function Head() {
  return <Seo title={"Lost Pages"} />;
}
