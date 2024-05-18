/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React from "react";
import { Link } from "gatsby";
import "./sidebar.css";
import { MostViewedAttr } from "../../types/DataTypes";

const MostViewedPage = ({ analyticNodePaths, titleByPath }: MostViewedAttr) => {
  return (
    analyticNodePaths && (
      <>
        <div className="second-header">Most Viewed</div>
        <ul>
          {analyticNodePaths.map((path) => {
            let result = titleByPath[path];
            return (
              result && (
                <li key={path}>
                  <small className="title">
                    <Link className="text-link" to={`${path}`}>
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

export default MostViewedPage;
