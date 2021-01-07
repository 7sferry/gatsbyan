import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

import MobileMenuLinks from "./MobileMenuLinks";
import Menu from "./Menu";
import "./header.css";

const Header = ({ siteTitle }) => {
  return (
    <header className="head-main">
      <div
        className="head-elements"
      >
        <h1 className="head-logo my-emoji">
          <Link
            to="/"
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
        </h1>
        <Menu />
      </div>
      <MobileMenuLinks />
    </header>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
