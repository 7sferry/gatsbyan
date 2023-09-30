import React from "react";
import { Link } from "gatsby";

import MobileMenuLinks from "./MobileMenuLinks";
import Menu from "./Menu";
import "./header.css";
import { HeaderAttr } from "../../types/DataTypes";

const Header = ({ siteTitle }: HeaderAttr) => {
  return (
    <header className="head-main">
      <div className="head-elements">
        <h1 className="head-logo my-emoji">
          <Link to="/" className="header-link">
            {siteTitle}
          </Link>
        </h1>
        <Menu />
      </div>
      <MobileMenuLinks />
    </header>
  );
};

export default Header;
