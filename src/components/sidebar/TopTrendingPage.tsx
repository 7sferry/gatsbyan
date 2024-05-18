/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React from "react";
import { Link } from "gatsby";
import "./sidebar.css";
import { TopTrendingPageAttr } from "../../types/DataTypes";

const TopTrendingPage = ({ reports, titleByPath }: TopTrendingPageAttr) => {
  return (
    reports.length > 0 && (
      <>
        <div className="second-header">Top Trending</div>
        <ul>
          {reports.map((report) => {
            let result = titleByPath[report.path ?? ""];
            return (
              result && (
                <li key={report.path}>
                  <small className="title">
                    <Link className="text-link" to={`${report.path}`}>
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

export default TopTrendingPage;
