/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/
import { TrendingReport } from "../types/DataTypes.ts";
import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";
import { google } from "googleapis";

const metric = "scrolledUsers";
const dimension = "pagePath";
const scopes = ["https://www.googleapis.com/auth/analytics", "https://www.googleapis.com/auth/analytics.readonly"];
const pathPrefix = "/blog/";

async function executeAnalytics() {
  const jwt = new google.auth.JWT(
    process.env.ANALYTICS_EMAIL,
    undefined,
    process.env.ANALYTICS_PRIVATE_KEY?.replace(/\\n/gm, "\n"),
    scopes
  );
  await jwt.authorize();

  const analyticsReporting = google.analyticsdata({
    version: "v1beta",
    auth: jwt,
  });

  const properties = analyticsReporting.properties;
  const data = await properties.runReport({
    property: `properties/${process.env.ANALYTICS_GA4}`,
    requestBody: {
      dimensions: [{ name: dimension }],
      metrics: [{ name: metric }],
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensionFilter: {
        filter: {
          fieldName: dimension,
          stringFilter: {
            matchType: "BEGINS_WITH",
            value: pathPrefix,
          },
        },
      },
      limit: "5",
      orderBys: [{ metric: { metricName: metric }, desc: true }],
    },
  });

  const reports: TrendingReport[] = [];
  const rows = data.data.rows ?? [];
  for (const row of rows) {
    reports.push({ path: String(row?.dimensionValues?.[0]?.value), value: Number(row?.metricValues?.[0].value) });
  }
  return reports;
}

export default async function handler(req: GatsbyFunctionRequest, res: GatsbyFunctionResponse) {
  let ttl = (24 - new Date().getHours()) * 3600;
  let reports = await executeAnalytics();
  res.setHeader("Cache-Control", `public, max-age=${ttl}, s-maxage=${ttl + 3600}, stale-while-revalidate=300`).json({
    nodes: reports,
  });
}
