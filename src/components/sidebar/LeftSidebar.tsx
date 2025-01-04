import React from "react";
import "./sidebar.css";
import { Slice } from "gatsby";

const LeftSidebar = () => {
  return (
    <>
      <div className="sidebar-main ">
        <Slice alias={"Bio"} />
        <Slice alias={"Socials"} />
        <div className="tech-tags mt-3 non-mobile-only">
          <Slice alias={"Tags"} />
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
