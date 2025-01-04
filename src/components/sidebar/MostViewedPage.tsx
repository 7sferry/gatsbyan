/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React from "react";
import { Link } from "gatsby";
import "./sidebar.css";
import fetchTitleByPath from "../../utils/AllPostFetcher.tsx";
import { fetchMostViewed } from "../../utils/MostViewedCounter.tsx";

const MostViewedPage = () => {
  const titleByPath = fetchTitleByPath();
  const mostViewedNodes = fetchMostViewed(titleByPath);
  return (
    mostViewedNodes && (
      <div>
        <div className="second-header">Most Viewed</div>
        <ul>
          {mostViewedNodes.map((node) => {
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

export default MostViewedPage;
