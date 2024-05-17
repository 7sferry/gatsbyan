/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React from "react";
import AnalyticsPage from "./AnalyticsPage";
import FeaturedPage from "./FeaturedPage";

const RightSidebar = () => {
  return (
    <div className="sidebar-main ">
      <AnalyticsPage />
      <FeaturedPage />
    </div>
  );
};

export default RightSidebar;
