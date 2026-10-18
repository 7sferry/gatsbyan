/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import siteConfig from "../../config.ts";
import { AnalyticsEventName } from "../types/DataTypes.ts";

export const ANALYTICS_ENDPOINT = "/api/ituang";
export const ANALYTICS_EVENTS: readonly AnalyticsEventName[] = ["page_view", "scroll", "user_engagement"];

export const MAX_PATH_LENGTH = 200;
export const MAX_TEXT_LENGTH = 100;
export const MAX_ENGAGEMENT_MS = 60 * 60 * 1000;

export const PATH_PATTERN = /^\/[^\s?#]*$/;
export const URL_PATTERN = /^https?:\/\/\S+$/;
export const CLIENT_ID_PATTERN = /^\d{1,10}\.\d{10}$/;
export const SESSION_ID_PATTERN = /^\d{10}$/;
export const LANGUAGE_PATTERN = /^[A-Za-z]{2,3}(-[A-Za-z0-9]{1,8}){0,3}$/;
export const SCREEN_PATTERN = /^\d{1,5}x\d{1,5}$/;

export const trackingExclude = [
  "/tags/**",
  "/search",
  "/archive",
  "/404",
  "/404.html",
  "/page/**",
  "^[^?]+(\\?.*)",
  ".json$",
  "[?]",
  "[#]",
  "[%]",
];

export const isSiteOrigin = (origin?: string | null) => origin === siteConfig.url;
