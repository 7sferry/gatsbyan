/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React from "react";
import { Link } from "gatsby";
import "./sidebar.css";
import { fetchTopTrending } from "../../utils/TopTrendingFetcher.tsx";
import fetchTitleByPath from "../../utils/AllPostFetcher.tsx";

const TopTrendingPage = () => {
  const titleByPath = fetchTitleByPath();
  const trendingNodes = fetchTopTrending(titleByPath);
  return (
    trendingNodes.length > 0 && (
      <div>
        <div className="second-header">Top Searched</div>
        <ul>
          {trendingNodes.map((node) => {
            return (
              <li key={node.path}>
                <small className="title">
                  <Link className="text-link" to={node.path}>
                    {node.title}
                  </Link>
                </small>
              </li>
            );
          })}
        </ul>
      </div>
    )
  );
};

export default TopTrendingPage;
