/************************
 * Author: [MR FERRY™]  *
 * September 2022       *
 ************************/

import Layout from "./Layout";
import React from "react";
import { Comment } from "./Comment";
import { CustomPostAttr, getPostTags, getPublishDateTime, isCommentShown } from "../utils/GatsbyanUtils";

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
          {isCommentShown() && repo && <Comment repo={repo} />}
        </div>
      </div>
    </Layout>
  );
};

interface CustomPageProp {
  customPost: CustomPostAttr;
  site: CustomSiteAttr;
}

export interface CustomSiteAttr {
  url: string;
  repo: string;
}

interface CustomPageState {
  commentShown: boolean;
}

export default CustomPage;
