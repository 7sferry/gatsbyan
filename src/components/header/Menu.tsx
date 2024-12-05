/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

import React from "react";
import { Link } from "gatsby";
import "./header.css";
import siteConfig from "../../config.ts";
import { DEFAULT_ICON_SIZE } from "../../utils/GatsbyanUtils";

const Menu = () => {
  return (
    <div className="social-links">
      <MenuLinks />
    </div>
  );
};

export const MenuLinks = () => (
  <>
    {siteConfig.menuObjects.map((menu) => {
      return (
        <Link key={menu.link} to={menu.link}>
          <span className="menu-button">
            <menu.icon title={menu.title} size={DEFAULT_ICON_SIZE} />
            <span>{menu.text}</span>
          </span>
        </Link>
      );
    })}
  </>
);

export default Menu;
