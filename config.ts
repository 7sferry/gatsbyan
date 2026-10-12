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
  tagline: `An ISTJ of MBTI, C style of DiSC, Type 5 of Enneagram, 37% Openness, 81% Conscientiousness, 3% Extraversion, 3% Agreeableness, 57% Neuroticism.`,
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
