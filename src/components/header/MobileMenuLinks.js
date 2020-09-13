import React from "react";
import { menus } from "./Menu";
import "../layout.css";

const MobileMenuLinks = () => {
  return (
    <div className="bottom-bar pb-1">
      {menus}
    </div>
  );
};

export default MobileMenuLinks;
