/************************
 * Made by [MR Ferry™]  *
 * on February 2021     *
 ************************/

import React from "react";
import { Link } from "gatsby";
import "./sidebar.css";
import { FeaturedPageAttr } from "../../types/DataTypes";

const FeaturedPage = ({ featuredNodes }: FeaturedPageAttr) => {
  return (
    featuredNodes && (
      <div>
        <div className="second-header">Featured Post</div>
        <ul>
          {featuredNodes.map((node) => {
            return (
              <li key={node.slug}>
                <Link className="text-link" to={`/blog/${node.slug}`}>
                  <small className="title">{node.title}</small>
                </Link>
              </li>
            );
          })}
          <li>
            <Link className="text-link" to={"/features/value-averaging-calculator"}>
              <small className="title">{"Value Averaging Calculator"}</small>
            </Link>
          </li>
        </ul>
      </div>
    )
  );
};

export default FeaturedPage;
