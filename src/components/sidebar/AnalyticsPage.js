/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React from "react";
import { graphql, Link, StaticQuery } from "gatsby";
import "./sidebar.css";
import { capital as startCase } from "case";

const AnalyticsPage = () => {
  return (
    <StaticQuery
      query={graphql`
        query AnalyticsPageQuery {
          allPageViews(
            sort: { order: DESC, fields: totalCount }
            filter: { path: { regex: "/(^/blog?)(?!.*\\\\?)(?!.*.json)(.*(?<!/)$)/" } }
            limit: 5
          ) {
            nodes {
              path
            }
          }
        }
      `}
      render={data => {
        const { allPageViews } = data;
        return (
          <ul>
            {allPageViews.nodes.map(node => {
              return (
                <li key={node.path}>
                  <small className="title">
                    <Link className="text-link" to={`${node.path}`}>
                      {startCase(node.path.replace(/^\/blog\/+/i, ""))}
                    </Link>
                  </small>
                </li>
              );
            })}
          </ul>
        );
      }}
    />
  );
};

export default AnalyticsPage;
