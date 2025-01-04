import React from "react";
import { Link } from "gatsby";

import MobileMenuLinks from "./MobileMenuLinks";
import Menu from "./Menu";
import "./header.css";
import SiteMetadata from "../../utils/SiteMetadata.tsx";

const Header = () => {
  const { siteMetadata: metadata } = SiteMetadata();
  return (
    <header className="head-main">
      <div className="head-elements">
        <h1 className="head-logo my-emoji">
          <Link to="/" className="header-link">
            {metadata.title}
          </Link>
        </h1>
        <Menu />
      </div>
      <MobileMenuLinks />
    </header>
  );
};

export default Header;
