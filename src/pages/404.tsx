import React from "react";

import Layout from "../components/Layout";
import robot from "../templates/robot404";

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
