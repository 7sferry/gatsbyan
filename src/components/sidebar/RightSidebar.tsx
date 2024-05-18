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

const RightSidebar = ({ mostViewedNodes, featuredNodes, trendingNodes }: RightSidebarAttr) => {
  return (
    <div className="sidebar-main ">
      <MostViewedPage mostViewedNodes={mostViewedNodes} />
      <FeaturedPage featuredNodes={featuredNodes} />
      <TopTrendingPage trendingNodes={trendingNodes} />
    </div>
  );
};

export default RightSidebar;
