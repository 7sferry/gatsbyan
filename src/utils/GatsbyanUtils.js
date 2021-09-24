/************************
 * Made by [MR Ferry™]  *
 * on March 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { kebab as kebabCase } from "case";
import { formatToTimeZone } from "date-fns-timezone";

export const getPostTags = tags => {
  const techTags = new Set();
  tags &&
    tags.forEach((tag, i) => {
      const kebabTag = kebabCase(tag);
      techTags.add(
        <span key={kebabTag}>
          {i > 0 ? ", " : ""}
          <Link to={`/tags/${kebabTag}/`}>{tag}</Link>
        </span>
      );
    });
  return techTags;
};

export const getTags = (tag) => {
  return <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
}

const timeZone = "Asia/Jakarta";

export const getPublishDate = date => formatToTimeZone(Date.parse(date), "MMMM Do, YYYY", { timeZone: timeZone });

export const getPublishDateTime = date =>
  formatToTimeZone(Date.parse(date), "dddd MMM Do, YYYY hh:mm a", { timeZone: timeZone });

export const getMonthYearDate = date => formatToTimeZone(Date.parse(date), "YYYY-MMMM", { timeZone: timeZone });

export const getPlurals = count => {
  return count > 1 ? "s" : "";
};

export const PAGE_COUNT = 5;

export const SEARCH_COUNT = 26;

export const DEFAULT_ICON_SIZE = 20;
