/************************
 * Made by [MR Ferry™]  *
 * on March 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";

export const getTechTags = tags => {
  const techTags = [];
  if (tags !== undefined && tags !== null) {
    tags.forEach((tag, i) => {
      techTags.push(
        <span key={tag}>
          {i > 0 ? ", " : ""}
          <Link to={`/tags/${tag}/`}>{tag}</Link>
        </span>
      );
    });
  }
  return techTags;
};

export const getPlurals = count => {
  return count > 1 ? "s" : "";
};

export const PAGE_COUNT = 11;
