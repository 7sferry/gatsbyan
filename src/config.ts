/************************
 * Made by [MR Ferry™]  *
 * on November 2024     *
 ************************/

import {
  FaArchive,
  FaGithubSquare,
  FaHome,
  FaInstagram,
  FaLinkedin,
  FaSearchengin,
  FaStackOverflow,
  FaUserGraduate,
} from "react-icons/fa";
import { GiCrystalBall } from "react-icons/gi";
import { SiteConfig } from "./types/DataTypes.ts";

export const siteConfig: SiteConfig = {
  url: "https://ferry.vercel.app",
  repo: "7sferry/gatsbyan",
  title: "MR Ferry",
  tagline:
    "An ISTJ of MBTI, C style of DiSC, and Type 5 of Enneagram. \nInterested in software engineering, money investing, gaming, football, and sharing POV about life & experiences",
  description: `Software Engineer dari Solok. Membahas pemrograman, pengalaman hidup, dan pandangan pribadi`,
  copyright: `© ${new Date().getFullYear()} · Ferry Suhandri`,
  author: {
    name: "Ferry S",
    realName: "Ferry Suhandri",
    contacts: [
      {
        name: "LinkedIn",
        icon: FaLinkedin,
        url: "https://www.linkedin.com/in/7sferry",
        color: "#0a66c2",
      },
      {
        name: "GitHub",
        icon: FaGithubSquare,
        url: "https://github.com/7sferry",
        color: "white",
      },
      {
        name: "Instagram",
        icon: FaInstagram,
        url: "https://www.instagram.com/7sferry/",
        color: "#e1306c",
      },
      {
        name: "StackOverFlow",
        icon: FaStackOverflow,
        url: "https://stackoverflow.com/users/14286378/ferry",
        color: "#ef8236",
      },
      {
        name: "Resume",
        icon: FaUserGraduate,
        url: "https://ferry.netlify.app",
        color: "#34A210FF",
      },
      {
        name: "CrystalKnow",
        icon: GiCrystalBall,
        url: "https://www.crystalknows.com/p/ferry",
        color: "#2ca7e4",
      },
    ],
  },
  menuObjects: [
    {
      link: "/",
      icon: FaHome,
      title: "Homepage",
      text: "Home",
    },
    {
      link: "/archive",
      icon: FaArchive,
      title: "Archive page",
      text: "Archive",
    },
    {
      link: "/search",
      icon: FaSearchengin,
      title: "Search page",
      text: "Search",
    },
  ],
};

export default siteConfig;
