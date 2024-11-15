import React from "react";
import "./sidebar.css";

import { LeftSidebarAttr } from "../../types/DataTypes.ts";
import { Slice } from "gatsby";

const LeftSidebar = ({ photo, author, tagline, contacts }: LeftSidebarAttr) => {
  return (
    <>
      <div className="sidebar-main ">
        <Slice alias={"Bio"} author={author} tagline={tagline} photo={photo} />
        <Slice alias={"Socials"} contacts={contacts} />
        <div className="tech-tags mt-3 non-mobile-only">
          <Slice alias={"Tags"} />
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
