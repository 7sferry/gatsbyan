/************************
 * Made by [MR Ferry™]  *
 * on March 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { kebab as kebabCase } from "case";
import { formatToTimeZone } from "date-fns-timezone";

export const getPostTags = (tags) => {
  const techTags = new Set();
  tags &&
    tags.forEach((tag, i) => {
      const kebabTag = kebabCase(tag);
      techTags.add(
        <span key={kebabTag}>
          {i > 0 ? ", " : ""}
          <Link to={`/tags/${kebabTag}`}>{tag}</Link>
        </span>
      );
    });
  return techTags;
};

export const getTags = (tag) => {
  return <Link to={`/tags/${kebabCase(tag)}`}>{tag}</Link>;
};

const timeZone = "Asia/Jakarta";

export const getPublishDate = (date) => formatToTimeZone(Date.parse(date), "MMMM Do, YYYY", { timeZone: timeZone });

export const getPublishDateTime = (date) =>
  formatToTimeZone(Date.parse(date), "dddd MMM Do, YYYY hh:mm a", { timeZone: timeZone });

export const getMonthYearDate = (date) => formatToTimeZone(Date.parse(date), "YYYY-MMMM", { timeZone: timeZone });

export const getPlurals = (count) => {
  return count > 1 ? "s" : "";
};

let thousandSeparator = ".";
let decimalSeparator = ",";
const locales = "id-ID";
const currencySymbol = "Rp";

export function getNumberValueFromRupiah(input) {
  input = input.replace(currencySymbol, "").replaceAll(thousandSeparator, "");
  const fixedNumber = input.replaceAll(decimalSeparator, thousandSeparator);
  let val = parseFloat(fixedNumber);
  return isNaN(val) ? 0 : val
}

export const onChangeRupiah = (event) => {
  let input = event.target.value;
  if(input === currencySymbol + '0'){
    return input;
  }
  let result = getNumberValueFromRupiah(input);
  let decimal = "";
  const split = input.split(decimalSeparator);
  if (
    input.endsWith(decimalSeparator) &&
    (split.length <= 2 || input.endsWith(decimalSeparator + decimalSeparator))
  ) {
    decimal = decimalSeparator;
  }
  if(result === 0){
    result = (input === '0' || input.startsWith(currencySymbol + '0')) ? 0 : '';
  }
  if(input === decimalSeparator || input.startsWith(currencySymbol + decimalSeparator)){
    result = 0;
  }
  let lastZero = ''
  console.log(result)
  if(split.length === 2){
    const secondElement = split[1];
    // if(secondElement.toString().endsWith('0')){
      result = parseInt(result.toString());
      lastZero = isNaN(secondElement) ? '' : secondElement;
        decimal = decimalSeparator;
    // }
  }
  return rp(result) + decimal + lastZero;
};

export function getMonthDifference(startDate, endDate) {
  return endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());
}

export function rp(val) {
  return currencySymbol + (val?.toLocaleString(locales, {maximumFractionDigits: 15}) ?? 0);
}

export const PAGE_COUNT = 5;

export const SEARCH_COUNT = 26;

export const DEFAULT_ICON_SIZE = 20;
