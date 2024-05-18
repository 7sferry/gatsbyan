/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/
import { TrendingReport } from "../types/DataTypes.ts";
import { useEffect, useState } from "react";

export const fetchTopTrending = (titleByPath: Map<string, string>) => {
  const [trendingReports, setTrendingReports] = useState<TrendingReport[]>([]);
  useEffect(() => {
    getTopTrendingReports().then((reports) => {
      setTrendingReports(reports);
    });
  }, []);
  return trendingReports.map((report) => ({ path: report.path, title: titleByPath.get(report.path) }));
};

async function getTopTrendingReports(): Promise<TrendingReport[]> {
  let response = await fetch("/api/trending");
  if (response.status !== 200) {
    return [];
  }
  const reportNode = await response.json();
  let reports: TrendingReport[] = [];
  for (const node of reportNode.nodes) {
    reports.push(node);
  }
  return reports;
}
