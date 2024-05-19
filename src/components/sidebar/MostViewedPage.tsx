/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React from "react";
import { Link } from "gatsby";
import "./sidebar.css";
import { MostViewedAttr } from "../../types/DataTypes";

const MostViewedPage = ({ mostViewedNodes }: MostViewedAttr) => {
  return (
    mostViewedNodes && (
      <>
        <div className="second-header">Most Viewed</div>
        <ul>
          {mostViewedNodes.map((node) => {
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

export default MostViewedPage;
