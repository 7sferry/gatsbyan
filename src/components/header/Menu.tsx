/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

import React from "react";
import { Link } from "gatsby";
import "./header.css";
import { MenuAttr } from "../../types/DataTypes.ts";
import { DEFAULT_ICON_SIZE } from "../../utils/PagingUtils.tsx";
import { ArchiveIcon, HomeIcon, SearchIcon } from "../MyIcon.tsx";

const menuObjects: MenuAttr[] = [
  {
    link: "/",
    icon: HomeIcon,
    title: "Homepage",
    text: "Home",
  },
  {
    link: "/archive",
    icon: ArchiveIcon,
    title: "Archive page",
    text: "Archive",
  },
  {
    link: "/search",
    icon: SearchIcon,
    title: "Search page",
    text: "Search",
  },
];

const Menu = () => {
  return (
    <div className="social-links">
      <MenuLinks />
    </div>
  );
};

export const MenuLinks = () => (
  <>
    {menuObjects.map((menu) => {
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
