/************************
 * Made by [MR Ferry™]  *
 * on March 2020        *
 ************************/

import React from "react";
import { add, format, isAfter } from "date-fns";
import slugify from "@sindresorhus/slugify";
import { PaginationProp } from "../types/DataTypes.ts";
import { DateTime } from "luxon";

const wibZone = "Asia/Tokyo";

export const kebabCase = (str: string) => {
  return slugify(str);
};

export const getPublishDate = (date: string) => DateTime.fromISO(date).setZone(wibZone).toFormat("MMMM d, yyyy");

export const getPublishDateTime = (date: string) =>
  DateTime.fromISO(date).setZone(wibZone).toFormat("EEE. MMM d, yyyy hh:mm a");

export const getDateYear = (date: string) => DateTime.fromISO(date).setZone(wibZone).toFormat("yyyy-MM-dd");

export const getMonthYearDate = (date: string) => DateTime.fromISO(date).setZone(wibZone).toFormat("yyyy-MMMM");

export const toNow = (date: string) => DateTime.fromISO(date).setZone(wibZone).toRelative();

export const isAfterDate = (date1: string | Date, date2: string | Date) => isAfter(date1, date2);

export const plusDays = (date: string | Date, day: number) => add(date, { days: day });

function formatToPattern(dateArg: string, formatString: string, timeZone: string = wibZone) {
  const date = new Date(dateArg);
  const zonedDate = date.toLocaleString("en-US", { timeZone: timeZone });
  return format(zonedDate, formatString);
}

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
  if (!input || input === currencySymbol || input?.trim() === "") {
    return "";
  }
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
  return currencySymbol + (val?.toLocaleString(locales, { maximumFractionDigits: 2 }) ?? 0);
}

export const PAGE_COUNT = 5;

export const SEARCH_COUNT = 7;

export const DEFAULT_ICON_SIZE = 20;

export const getPagingCalculator = (currentPage: number, totalPage: number): PaginationProp => {
  const range = Math.floor(PAGE_COUNT / 2);
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;
  let minRange = currentPage - range;
  let maxRange = currentPage + range;

  function getStartRange() {
    if (minRange <= 0 || totalPage <= PAGE_COUNT) {
      return 1;
    }
    if (maxRange > totalPage) {
      return totalPage - PAGE_COUNT + 1;
    }
    return minRange;
  }

  let pageStart = getStartRange();
  return {
    nextPage: nextPage,
    previousPage: previousPage,
    pageStart: pageStart,
    pageLimit: Math.min(totalPage, PAGE_COUNT),
  };
};
