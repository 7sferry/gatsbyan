/************************
 * Made by [MR Ferry™]  *
 * on March 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { kebabCase } from "lodash";
import { format } from "date-fns"

export const getTechTags = tags => {
  const techTags = [];
  if (tags !== undefined && tags !== null) {
    tags.forEach((tag, i) => {
      const kebabTag = kebabCase(tag);
      techTags.push(
        <span key={kebabTag}>
          {i > 0 ? ", " : ""}
          <Link to={`/tags/${kebabTag}/`}>{tag}</Link>
        </span>
      );
    });
  }
  return techTags;
};

export const getDate = date => format(Date.parse(date), "MMM do, yyyy");

export const getPlurals = count => {
  return count > 1 ? "s" : "";
};

export const PAGE_COUNT = 5;
