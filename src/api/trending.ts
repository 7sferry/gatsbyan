/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/
import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";
import { getReport, ReportingPluginOption, TrendingReport } from "gatsby-plugin-google-analytics-data-reporting-api";

function constructTtlExpirationToMidnight() {
  let currentDate = new Date();
  return (23 - currentDate.getHours()) * 3600 + (59 - currentDate.getMinutes()) * 60;
}

export default async function handler(_: GatsbyFunctionRequest, res: GatsbyFunctionResponse) {
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
  let reports: TrendingReport[] = await getReport(opt);
  res.setHeader("Cache-Control", `public, max-age=${ttl}, s-maxage=${ttl + 3600}, stale-while-revalidate=300`).json({
    nodes: reports,
  });
}
