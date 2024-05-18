/************************
 * Author: [MR FERRY™]  *
 * September 2022       *
 ************************/

import Layout from "./Layout";
import React from "react";
import { getPublishDateTime } from "../utils/GatsbyanUtils";
import { CustomPageProp } from "../types/DataTypes";
import { Slice } from "gatsby";

const CustomPageContainer = ({ children, site, customPost }: React.PropsWithChildren<CustomPageProp>) => {
  const repo = site.repo;
  return (
    <Layout>
      <div>
        <div className="post-main">
          <div className="title posted">{customPost.title}</div>
          <div className="title text-info mb-2">
            <span className="page-info">{getPublishDateTime(customPost.publishDate)}</span>
          </div>
          <div className="post-container pt-0 content-post">{children}</div>
          <Slice alias="Comment" repo={repo} />
        </div>
      </div>
    </Layout>
  );
};

export default CustomPageContainer;
