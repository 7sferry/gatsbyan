/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/
import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";
import siteConfig from "../../config.ts";
import { AnalyticsEvent, AnalyticsEventName } from "../types/DataTypes.ts";
import {
  ANALYTICS_EVENTS,
  CLIENT_ID_PATTERN,
  isSiteOrigin,
  LANGUAGE_PATTERN,
  MAX_ENGAGEMENT_MS,
  MAX_PATH_LENGTH,
  MAX_TEXT_LENGTH,
  PATH_PATTERN,
  SCREEN_PATTERN,
  SESSION_ID_PATTERN,
  URL_PATTERN,
} from "../utils/AnalyticsConfig.ts";
import { isExcludedPath } from "../utils/TrackingExclude.ts";

const MEASUREMENT_PROTOCOL_URL = "https://www.google-analytics.com/mp/collect";
const MAX_BODY_BYTES = 1024;
const SCROLL_PERCENT = 90;

type Header = string | string[] | undefined;

const headerValue = (header: Header) => (Array.isArray(header) ? header[0] : header);

const rawBody = (body: unknown) => {
  if (typeof body === "string") {
    return body;
  }
  if (Buffer.isBuffer(body)) {
    return body.toString("utf8");
  }
  return JSON.stringify(body ?? null);
};

const bodySize = (req: GatsbyFunctionRequest) => {
  const declared = Number(headerValue(req.headers["content-length"])) || 0;
  return Math.max(declared, Buffer.byteLength(rawBody(req.body)));
};

const parseBody = (body: unknown): unknown => {
  if (typeof body === "object" && body !== null && !Buffer.isBuffer(body)) {
    return body;
  }
  try {
    return JSON.parse(rawBody(body));
  } catch {
    return null;
  }
};

const isText = (value: unknown, maxLength: number, pattern?: RegExp): value is string =>
  typeof value === "string" && value.length <= maxLength && (!pattern || pattern.test(value));

const isOptionalText = (value: unknown, maxLength: number, pattern?: RegExp): value is string | undefined =>
  value === undefined || isText(value, maxLength, pattern);

const isTrackedPath = (path: unknown): path is string =>
  isText(path, MAX_PATH_LENGTH, PATH_PATTERN) && !isExcludedPath(path);

const isEngagement = (value: unknown): value is number =>
  Number.isInteger(value) && (value as number) >= 1 && (value as number) <= MAX_ENGAGEMENT_MS;

function parseEvent(body: unknown): AnalyticsEvent | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }
  const { name, path, title, referrer, clientId, sessionId, engagementMs, language, screen } = body as Record<
    string,
    unknown
  >;
  if (
    !ANALYTICS_EVENTS.includes(name as AnalyticsEventName) ||
    !isTrackedPath(path) ||
    !isOptionalText(title, MAX_TEXT_LENGTH) ||
    !isOptionalText(referrer, MAX_TEXT_LENGTH, URL_PATTERN) ||
    !isText(clientId, 21, CLIENT_ID_PATTERN) ||
    !isText(sessionId, 10, SESSION_ID_PATTERN) ||
    !isEngagement(engagementMs) ||
    !isOptionalText(language, 35, LANGUAGE_PATTERN) ||
    !isOptionalText(screen, 11, SCREEN_PATTERN)
  ) {
    return null;
  }
  return {
    name: name as AnalyticsEventName,
    path,
    title,
    referrer,
    clientId,
    sessionId,
    engagementMs,
    language,
    screen,
  };
}

const decodeHeader = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
};

const userLocation = (req: GatsbyFunctionRequest) => {
  const country = headerValue(req.headers["x-vercel-ip-country"]);
  if (!country || !/^[A-Z]{2}$/.test(country)) {
    return undefined;
  }
  const region = headerValue(req.headers["x-vercel-ip-country-region"]);
  const encodedCity = headerValue(req.headers["x-vercel-ip-city"]);
  const city = encodedCity ? decodeHeader(encodedCity) : undefined;
  return {
    country_id: country,
    ...(region && /^[A-Z0-9]{1,3}$/.test(region) ? { region_id: `${country}-${region}` } : {}),
    ...(city && city.length <= MAX_TEXT_LENGTH ? { city } : {}),
  };
};

const deviceCategory = (req: GatsbyFunctionRequest) => {
  if (headerValue(req.headers["sec-ch-ua-mobile"]) === "?1") {
    return "mobile";
  }
  const userAgent = headerValue(req.headers["user-agent"]) ?? "";
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent)) {
    return "tablet";
  }
  return /Mobi|iPhone|Android/i.test(userAgent) ? "mobile" : "desktop";
};

function buildPayload(event: AnalyticsEvent, req: GatsbyFunctionRequest) {
  const location = userLocation(req);
  return {
    client_id: event.clientId,
    ...(location ? { user_location: location } : {}),
    device: {
      category: deviceCategory(req),
      ...(event.language ? { language: event.language } : {}),
      ...(event.screen ? { screen_resolution: event.screen } : {}),
    },
    events: [
      {
        name: event.name,
        params: {
          page_location: `${siteConfig.url}${event.path}`,
          ...(event.title ? { page_title: event.title } : {}),
          ...(event.referrer ? { page_referrer: event.referrer } : {}),
          session_id: event.sessionId,
          engagement_time_msec: event.engagementMs,
          ...(event.name === "scroll" ? { percent_scrolled: SCROLL_PERCENT } : {}),
        },
      },
    ],
  };
}

async function forward(payload: ReturnType<typeof buildPayload>, measurementId: string, apiSecret: string) {
  const url = `${MEASUREMENT_PROTOCOL_URL}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error("failed to forward analytics event", response.status, JSON.stringify(payload));
    }
  } catch (error) {
    console.error("failed to forward analytics event", error, JSON.stringify(payload));
  }
}

export default async function handler(req: GatsbyFunctionRequest, res: GatsbyFunctionResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end();
    return;
  }
  if (!isSiteOrigin(headerValue(req.headers.origin))) {
    res.status(403).end();
    return;
  }
  if (bodySize(req) > MAX_BODY_BYTES) {
    res.status(413).end();
    return;
  }
  const event = parseEvent(parseBody(req.body));
  if (!event) {
    res.status(400).end();
    return;
  }
  const measurementId = process.env.ANALYTICS_MEASUREMENT_ID;
  const apiSecret = process.env.ANALYTICS_API_SECRET;
  if (measurementId && apiSecret) {
    await forward(buildPayload(event, req), measurementId, apiSecret);
  }
  res.status(204).end();
}
