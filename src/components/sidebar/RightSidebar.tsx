/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React from "react";
import "./sidebar.css";
import MostViewedPage from "./MostViewedPage.tsx";
import FeaturedPage from "./FeaturedPage";
import TopTrendingPage from "./TopTrendingPage.tsx";

const RightSidebar = () => {
  return (
    <div className="sidebar-main ">
      <FeaturedPage />
      <MostViewedPage />
      <TopTrendingPage />
    </div>
  );
};

export default RightSidebar;
