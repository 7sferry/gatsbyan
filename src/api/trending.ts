/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/
import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";
import { getReport, ReportingPluginOption, TrendingReport } from "gatsby-plugin-google-analytics-data-reporting-api";

const DAY_SECONDS = 24 * 3600;
const JAKARTA_OFFSET_SECONDS = 7 * 3600;

// Google Analytics moves "yesterday" at midnight in the property time zone, Asia/Jakarta
function constructTtlExpirationToMidnight() {
  const jakartaSeconds = Math.floor(Date.now() / 1000) + JAKARTA_OFFSET_SECONDS;
  return DAY_SECONDS - (jakartaSeconds % DAY_SECONDS);
}

export default async function handler(req: GatsbyFunctionRequest, res: GatsbyFunctionResponse) {
  let ttl = constructTtlExpirationToMidnight();
  let opt: ReportingPluginOption = {
    privateKey: process.env.ANALYTICS_PRIVATE_KEY,
    property: process.env.ANALYTICS_GA4,
    serviceAccountEmail: process.env.ANALYTICS_EMAIL,
    desc: true,
    startDate: "30daysAgo",
    endDate: "yesterday",
    limit: 5,
    metric: "organicGoogleSearchClicks",
    regexFilter: "^/blog/",
  };
  let reports: TrendingReport[];
  try {
    reports = await getReport(opt);
  } catch (error) {
    console.error("failed to get trending report", error);
    res.status(500).setHeader("Cache-Control", "no-store").json({ nodes: [] });
    return;
  }
  const country = headerValue(req.headers["x-vercel-ip-country"]);
  res.setHeader("Cache-Control", `public, max-age=${ttl}, s-maxage=${ttl + 3600}, stale-while-revalidate=300`).json({
    nodes: reports,
    country: country,
  });
}

type Header = string | string[] | undefined;

const headerValue = (header: Header) => (Array.isArray(header) ? header[0] : header);
