/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React from "react";
import "./sidebar.css";
import AnalyticsPage from "./AnalyticsPage";
import FeaturedPage from "./FeaturedPage";
import { RightSidebarAttr } from "../../types/DataTypes.ts";

const RightSidebar = ({ analyticNodePaths, titleByPath, featuredPages }: RightSidebarAttr) => {
  return (
    <div className="sidebar-main ">
      <AnalyticsPage analyticNodePaths={analyticNodePaths} titleByPath={titleByPath} />
      <FeaturedPage featuredPages={featuredPages} />
    </div>
  );
};

export default RightSidebar;
