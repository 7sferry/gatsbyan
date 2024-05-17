import React from "react";

import robot from "../templates/robot404";
import Seo, { Seo } from "../components/Seo.tsx";
import Layout from "../components/Layout.tsx";

const NotFoundPage = () => (
  <Layout>
    <div
      dangerouslySetInnerHTML={{
        __html: robot,
      }}
    />
  </Layout>
);

export default NotFoundPage;

export function Head() {
  return <Seo title={"Lost Pages"} />;
}
