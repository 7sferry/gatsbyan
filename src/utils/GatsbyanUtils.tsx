/************************
 * Made by [MR Ferry™]  *
 * on March 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { kebab as kebabCase } from "case";
import { formatToTimeZone } from "date-fns-timezone";

export const getPostTags = (tags: Array<string> | null) => {
  const techTags = new Set<React.ReactNode>();
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

export const getTags = (tag: string) => {
  return <Link to={`/tags/${kebabCase(tag)}`}>{tag}</Link>;
};

const timeZone = "Asia/Jakarta";

export const getPublishDate = (date: Date) => formatToTimeZone(date, "MMMM Do, YYYY", { timeZone: timeZone });

export const getPublishDateTime = (date: Date) =>
  formatToTimeZone(date, "dddd MMM Do, YYYY hh:mm a", { timeZone: timeZone });

export const getMonthYearDate = (date: Date) => formatToTimeZone(date, "YYYY-MMMM", { timeZone: timeZone });

export const getPlurals = (count: number) => {
  return count > 1 ? "s" : "";
};

let thousandSeparator = ".";
let decimalSeparator = ",";
const locales = "id-ID";
const currencySymbol = "Rp";

export function getNumberValueFromRupiah(input: string) {
  input = input.replace(currencySymbol, "").replaceAll(thousandSeparator, "");
  const fixedNumber = input.replaceAll(decimalSeparator, thousandSeparator);
  let val = parseFloat(fixedNumber);
  return isNaN(val) ? 0 : val;
}

export const onChangeRupiah = (event: React.ChangeEvent<HTMLInputElement>) => {
  let input = event?.target?.value;
  if (input === currencySymbol + "0") {
    return input;
  }
  let result: number = getNumberValueFromRupiah(input);
  let decimal = "";
  const split = input.split(decimalSeparator);
  if (input.endsWith(decimalSeparator) && (split.length <= 2 || input.endsWith(decimalSeparator + decimalSeparator))) {
    decimal = decimalSeparator;
  }
  if (input === decimalSeparator || input.startsWith(currencySymbol + decimalSeparator)) {
    result = 0;
  }
  let lastZero = "";
  if (split.length >= 2) {
    const secondElement: string = split[1];
    let temp = "1" + secondElement;
    const parsedSecondElement = parseInt(temp);
    lastZero = parsedSecondElement.toString().slice(1);

    decimal = decimalSeparator;
    result = parseInt(result.toString());
  }
  return rp(Number(result)) + decimal + lastZero;
};

export function getMonthDifference(startDate: Date, endDate: Date) {
  return endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());
}

export function rp(val: number) {
  return currencySymbol + (val?.toLocaleString(locales, { maximumFractionDigits: 15 }) ?? 0);
}

export const PAGE_COUNT = 5;

export const SEARCH_COUNT = 26;

export const DEFAULT_ICON_SIZE = 20;