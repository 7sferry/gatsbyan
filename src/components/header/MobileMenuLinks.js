import React from "react";
import { MenuLinks } from "./Menu";
import "../layout.css";

const MobileMenuLinks = () => {
  return (
    <div className="bottom-bar pb-1">
      { MenuLinks }
    </div>
  );
};

export default MobileMenuLinks;
