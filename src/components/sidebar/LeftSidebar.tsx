import React from "react";
import Bio from "./Bio";
import "./sidebar.css";

import Socials from "../Socials";
import Tags from "./Tags";
import SiteMetadata from "../SiteMetadata";

const LeftSidebar = () => {
  const { siteMetadata: metadata } = SiteMetadata();
  return (
    <>
      <div className="sidebar-main ">
        <Bio author={metadata.author} tagline={metadata.tagline} />
        <Socials mobile={false} contacts={metadata.contacts} />
        <div className="tech-tags mt-4">
          <Tags />
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
