/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/

async function executeAnalytics() {
  const { google } = require("googleapis");

  const scopes = [
    // View and manage your Google Analytics data
    "https://www.googleapis.com/auth/analytics",

    // See and download your Google Analytics data
    "https://www.googleapis.com/auth/analytics.readonly",
  ];
  const jwt = new google.auth.JWT(
    process.env.ANALYTICS_EMAIL,
    null,
    // fix netlify \n in env vars
    // https://github.com/auth0/node-jsonwebtoken/issues/642#issuecomment-585173594
    process.env.ANALYTICS_PRIVATE_KEY?.replace(/\\n/gm, "\n"),
    scopes
  );
  await jwt.authorize();

  const analyticsReporting = google.analyticsdata({
    version: "v1beta",
    auth: jwt,
  });

  const prope = analyticsReporting.properties;
  const data = await prope.runReport({
    property: `properties/${process.env.ANALYTICS_GA4}`,
    requestBody: {
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
      limit: "20",
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    },
  });

  const res: Report[] = [];
  const rows = data.data.rows;
  for (const row of rows) {
    // console.log(row.dimensionValues[0].value + " = " + row.metricValues[0].value);
    res.push({ path: row.dimensionValues[0].value, value: row.metricValues[0].value });
  }
  return res;
}

interface Report {
  path: string;
  value: number;
}

import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";

export default async function handler(req: GatsbyFunctionRequest<any>, res: GatsbyFunctionResponse) {
  let reports = await executeAnalytics();
  res.json({
    title: `I am TYPESCRIPT`,
    params: JSON.stringify(req.params),
    query: JSON.stringify(req.query),
    nodes: reports,
  });
}
