/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React, { useEffect, useState } from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import "./sidebar.css";
import { AnalyticsData, PageView, PageViews } from "../../types/DataTypes";

const AnalyticsPage = () => {
  const data: AnalyticsData = useStaticQuery(graphql`
      query AnalyticsPageQuery {
          allPageViews(sort: { totalCount: DESC }, filter: { path: { regex: "/^\/blog\/(?!$)(?!.*(%|\\?|=|&)).*$/" } }, limit: 5) {
              nodes {
                  path
              }
          }
          allContentfulBlogPost {
              nodes {
                  slug
                  title
              }
          }
    }
  `);
  const [nodes, setNodes] = useState<PageView[]>([]);
  useEffect(() => {
    getAnaly().then((d) => {
      let counter = 5;
      let views: PageView[] = [];
      for (const pageView of d.nodes) {
        if (pageView.path.startsWith("/blog/") && counter > 0) {
          views.push(pageView);
          counter--;
        }
      }
      setNodes(views);
    });
  }, []);

  const { allPageViews } = data;
  const titleByPath = new Map<string, string>();
  data?.allContentfulBlogPost?.nodes?.forEach((n) => {
    titleByPath.set("/blog/" + n.slug, n.title);
  });

  return (
    allPageViews && (
      <>
        <div className="second-header">Most Viewed</div>
        <ul>
          {nodes?.map((view) => {
            let result = titleByPath.get(view.path);
            return (
              result && (
                <li key={view.path}>
                  <small className="title">
                    <Link className="text-link" to={`${view.path}`}>
                      {result}
                    </Link>
                  </small>
                </li>
              )
            );
          })}
        </ul>
      </>
    )
  );
};

async function getAnaly(): Promise<PageViews> {
  let response = await fetch("/api/analy");
  if (response.status !== 200) {
    return {
      nodes: [],
    };
  }
  return await response.json();
}

export default AnalyticsPage;
