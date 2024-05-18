/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React from "react";
import "./sidebar.css";
import MostViewedPage from "./MostViewedPage.tsx";
import FeaturedPage from "./FeaturedPage";
import { RightSidebarAttr } from "../../types/DataTypes.ts";
import TopTrendingPage from "./TopTrendingPage.tsx";

const RightSidebar = ({ analyticNodePaths, titleByPath, featuredPages, topTrendingReports }: RightSidebarAttr) => {
  return (
    <div className="sidebar-main ">
      <MostViewedPage analyticNodePaths={analyticNodePaths} titleByPath={titleByPath} />
      <FeaturedPage featuredPages={featuredPages} />
      <TopTrendingPage reports={topTrendingReports} titleByPath={titleByPath} />
    </div>
  );
};

export default RightSidebar;
