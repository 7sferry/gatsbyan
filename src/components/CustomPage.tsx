/************************
 * Author: [MR FERRY™]  *
 * September 2022       *
 ************************/

import React from "react";
import { getPostTags, getPublishDateTime } from "../utils/GatsbyanUtils";
import { CustomPageProp } from "../types/DataTypes";
import { Slice } from "gatsby";
import Layout from "./Layout.tsx";

const CustomPage = ({ children, site, customPost }: React.PropsWithChildren<CustomPageProp>) => {
  const repo = site.repo;
  return (
    <Layout>
      <div>
        <div className="post-main">
          <div className="title posted">{customPost.title}</div>
          <div className="title text-info mb-2">
            <span className="page-info">{getPublishDateTime(customPost.publishDate)}</span>
            <span className="page-info">{getPostTags(null)}</span>
          </div>
          <div className="post-container pt-0 content-post">{children}</div>
          {/*<Comment repo={repo} />*/}
          <Slice alias="Comment" repo={repo} />
        </div>
      </div>
    </Layout>
  );
};

export default CustomPage;
