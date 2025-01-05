/************************
 * Author: [MR FERRY™]  *
 * September 2020       *
 ************************/

import React from "react";
import { Link } from "gatsby";
import "./header.css";
import { MenuAttr } from "../../types/DataTypes.ts";
import MySvg from "../MySvg.tsx";
import { DEFAULT_ICON_SIZE } from "../../utils/GatsbyanUtils.tsx";

const menuObjects: MenuAttr[] = [
  {
    link: "/",
    icon: (props) => (
      <MySvg
        size={props.size}
        color={props.color}
        title={props.title}
        viewBox={"0 0 576 512"}
        path={
          "M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"
        }
      />
    ),
    title: "Homepage",
    text: "Home",
  },
  {
    link: "/archive",
    icon: (props) => (
      <MySvg
        size={props.size}
        color={props.color}
        title={props.title}
        viewBox={"0 0 512 512"}
        path={
          "M32 32l448 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96L0 64C0 46.3 14.3 32 32 32zm0 128l448 0 0 256c0 35.3-28.7 64-64 64L96 480c-35.3 0-64-28.7-64-64l0-256zm128 80c0 8.8 7.2 16 16 16l160 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-160 0c-8.8 0-16 7.2-16 16z"
        }
      />
    ),
    title: "Archive page",
    text: "Archive",
  },
  {
    link: "/search",
    icon: (props) => (
      <MySvg
        size={props.size}
        color={props.color}
        title={props.title}
        viewBox={"0 0 460 512"}
        path={
          "M220.6 130.3l-67.2 28.2V43.2L98.7 233.5l54.7-24.2v130.3l67.2-209.3zm-83.2-96.7l-1.3 4.7-15.2 52.9C80.6 106.7 52 145.8 52 191.5c0 52.3 34.3 95.9 83.4 105.5v53.6C57.5 340.1 0 272.4 0 191.6c0-80.5 59.8-147.2 137.4-158zm311.4 447.2c-11.2 11.2-23.1 12.3-28.6 10.5-5.4-1.8-27.1-19.9-60.4-44.4-33.3-24.6-33.6-35.7-43-56.7-9.4-20.9-30.4-42.6-57.5-52.4l-9.7-14.7c-24.7 16.9-53 26.9-81.3 28.7l2.1-6.6 15.9-49.5c46.5-11.9 80.9-54 80.9-104.2 0-54.5-38.4-102.1-96-107.1V32.3C254.4 37.4 320 106.8 320 191.6c0 33.6-11.2 64.7-29 90.4l14.6 9.6c9.8 27.1 31.5 48 52.4 57.4s32.2 9.7 56.8 43c24.6 33.2 42.7 54.9 44.5 60.3s.7 17.3-10.5 28.5zm-9.9-17.9c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8z"
        }
      />
    ),
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
