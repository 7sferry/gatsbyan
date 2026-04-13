/************************
 * Author: [MR FERRY™]  *
 * September 2022       *
 ************************/

import Layout from "./Layout";
import React from "react";
import { CustomPageProp } from "../types/DataTypes";
import { Slice } from "gatsby";

const CustomPageContainer = ({ children, site, customPost }: React.PropsWithChildren<CustomPageProp>) => {
  const repo = site.repo;
  return (
    <Layout>
      <div className="title posted">{customPost.title}</div>
      <div className="post-container pt-1 content-post">{children}</div>
      <Slice alias="Comment" repo={repo} />
    </Layout>
  );
};

export default CustomPageContainer;
