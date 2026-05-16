/************************
 * Made by [MR Ferry™]  *
 * on November 2024     *
 ************************/

import { SiteConfig } from "./src/types/DataTypes.ts";
import { formatISO, startOfYear } from "date-fns";

const now = new Date();
export const siteConfig: SiteConfig = {
  url: "https://ferry.vercel.app",
  repo: "7sferry/gatsbyan",
  title: "MR Ferry",
  tagline: `An ISTJ of MBTI, C style of DiSC, and Type 5 of Enneagram. \nInterested in software engineering, money investing, gaming, football, psychology, and sharing POV about life & experiences.`,
  description: `Blog tentang Software Engineer dari Solok. Membahas pemrograman, investasi, game, sepak bola, psikologi, dan berbagi pengalaman serta pandangan pribadi`,
  copyright: `© ${now.getFullYear()} · Ferry Suhandri`,
  publishDate: formatISO(startOfYear(now)),
  updatedAt: formatISO(now),
  author: {
    name: "Ferry S",
    realName: "Ferry Suhandri",
  },
};

export default siteConfig;
