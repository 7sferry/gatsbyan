/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React from "react";
import { Link } from "gatsby";
import "./sidebar.css";
import { TrendingPageAttr } from "../../types/DataTypes";

const TopTrendingPage = ({ trendingNodes }: TrendingPageAttr) => {
  return (
    trendingNodes.length > 0 && (
      <>
        <div className="second-header">Top Trending</div>
        <ul>
          {trendingNodes.map((node) => {
            return (
              <li key={node.path}>
                <small className="title">
                  <Link className="text-link" to={`${node.path}`}>
                    {node.title}
                  </Link>
                </small>
              </li>
            );
          })}
        </ul>
      </>
    )
  );
};

export default TopTrendingPage;
