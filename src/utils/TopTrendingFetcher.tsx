/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/
import { TrendingReport } from "../types/DataTypes.ts";
import { useEffect, useState } from "react";

let loadedReports: TrendingReport[] | undefined;
let pendingReports: Promise<TrendingReport[]> | undefined;

export const clearTopTrendingCache = () => {
  loadedReports = undefined;
  pendingReports = undefined;
};

export const fetchTopTrending = (titleByPath: Map<string, string>) => {
  const [trendingReports, setTrendingReports] = useState<TrendingReport[]>(() => loadedReports ?? []);
  useEffect(() => {
    if (!loadedReports) {
      loadTopTrendingReports().then(setTrendingReports);
    }
  }, []);

  return trendingReports
    .filter((report) => titleByPath.has(report.path))
    .map((report) => ({ path: report.path, title: titleByPath.get(report.path) }));
};

function loadTopTrendingReports(): Promise<TrendingReport[]> {
  pendingReports ??= getTopTrendingReports().then((reports) => {
    pendingReports = undefined;
    loadedReports = reports ?? undefined;
    return reports ?? [];
  });
  return pendingReports;
}

async function getTopTrendingReports(): Promise<TrendingReport[] | null> {
  try {
    let response = await fetch("/api/trending");
    if (response.status !== 200) {
      return null;
    }
    const reportNode = await response.json();
    let reports: TrendingReport[] = [];
    for (const node of reportNode.nodes) {
      reports.push(node);
    }
    return reports;
  } catch {
    return null;
  }
}
