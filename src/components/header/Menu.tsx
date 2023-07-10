/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

import React from "react";
import { Link } from "gatsby";
import "./header.css";
import { FaArchive, FaHome, FaSearchengin } from "react-icons/fa";
import { DEFAULT_ICON_SIZE } from "../../utils/GatsbyanUtils";

const Menu = () => {
  return (
    <div className="social-links">
      <MenuLinks />
    </div>
  );
};

const MenuObjects: Array<MenuAttr> = [
  {
    link: "/",
    icon: <FaHome title={"Homepage"} size={DEFAULT_ICON_SIZE} />,
    text: "Home",
  },
  {
    link: "/archive",
    icon: <FaArchive title={"Archive page"} size={DEFAULT_ICON_SIZE} />,
    text: "Archive",
  },
  {
    link: "/search",
    icon: <FaSearchengin title={"Search page"} size={DEFAULT_ICON_SIZE} />,
    text: "Search",
  },
];

export const MenuLinks = () => (
  <>
    {MenuObjects.map((menu) => {
      return (
        <Link key={menu.link} to={menu.link}>
          <span className="menu-button">
            {menu.icon} {menu.text}
          </span>
        </Link>
      );
    })}
  </>
);

interface MenuAttr {
  link: string;
  icon: React.ReactNode;
  text: string;
}

export default Menu;
