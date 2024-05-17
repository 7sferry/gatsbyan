import React from "react";
import Bio from "./Bio";
import "./sidebar.css";

import Socials from "../Socials";
import Tags from "./Tags";
import { LeftSidebarAttr } from "../../types/DataTypes.ts";

const LeftSidebar = ({ photo, author, tagline, contacts }: LeftSidebarAttr) => {
  return (
    <>
      <div className="sidebar-main ">
        <Bio author={author} tagline={tagline} photo={photo} />
        <Socials mobile={false} contacts={contacts} />
        <div className="tech-tags mt-3">
          <Tags />
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
