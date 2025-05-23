/************************
 * Author: [MR FERRY™]  *
 * September 2022       *
 ************************/

import Layout from "./Layout";
import React from "react";
import { CustomPageProp } from "../types/DataTypes";
import { Slice } from "gatsby";
import { getPublishDateTime } from "../utils/DateUtils";

const CustomPageContainer = ({ children, site, customPost }: React.PropsWithChildren<CustomPageProp>) => {
  const repo = site.repo;
  return (
    <Layout>
      <div className="title posted">{customPost.title}</div>
      <div className="title text-info mb-2">
        <span className="page-info">{getPublishDateTime(customPost.publishDate)}</span>
      </div>
      <div className="post-container pt-0 content-post">{children}</div>
      <Slice alias="Comment" repo={repo} />
    </Layout>
  );
};

export default CustomPageContainer;
