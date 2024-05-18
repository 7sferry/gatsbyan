/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React from "react";
import "./sidebar.css";
import { RightSidebarAttr } from "../../types/DataTypes.ts";
import { Slice } from "gatsby";

const RightSidebar = ({ analyticNodePaths, titleByPath, featuredPages }: RightSidebarAttr) => {
  return (
    <div className="sidebar-main ">
      <Slice alias={"MostViewedPage"} analyticNodePaths={analyticNodePaths} titleByPath={titleByPath} />
      <Slice alias={"FeaturedPage"} featuredPages={featuredPages} />
    </div>
  );
};

export default RightSidebar;
