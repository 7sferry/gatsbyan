/************************
 * Made by [MR Ferry™]  *
 * on March 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { add, formatDistanceToNow, isAfter, toDate } from "date-fns";
import { formatDate } from "date-fns/format";
import { findTimeZone, getUTCOffset } from "timezone-support";
// import { formatToTimeZone } from "date-fns-timezone";
// import { parse } from "date-fns/parse";

export const kebabCase = (str: string) => {
  return str.trim().toLowerCase().replace(" ", "-");
};

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
function formatToTimeZone(argument: string | Date, formatString: string, options: any) {
  let date = toDate(argument);
  console.log("date " + date);
  let { timeZone, convertTimeZone } = options;
  console.log("convertTimeZone " + convertTimeZone);
  timeZone = findTimeZone(timeZone);
  console.log("timezone " + JSON.stringify(timeZone));
  timeZone = getUTCOffset(date, timeZone);
  console.log("utc " + JSON.stringify(timeZone));
  if (convertTimeZone !== false) {
    const offset = timeZone.offset - date.getTimezoneOffset();
    console.log("offset " + offset);
    date = new Date(date.getTime() - offset * 60 * 1000);
    console.log("date2 " + date);
  }
  formatString = formatTimeZoneTokens(formatString, timeZone);
  console.log("fmt str " + formatString);
  console.log("options " + JSON.stringify(options));
  return formatDate(date, formatString, options);
}

function padToTwoDigits(number: number) {
  return number > 9 ? number : `0${number}`;
}

function formatTimeZoneOffset(offset: number, separator: string) {
  let sign;
  if (offset <= 0) {
    offset = -offset;
    sign = "+";
  } else {
    sign = "-";
  }
  const hours = padToTwoDigits(Math.floor(offset / 60));
  const minutes = padToTwoDigits(offset % 60);
  return sign + hours + separator + minutes;
}

function formatTimeZoneTokens(format: string, timeZone: any) {
  return format.replace(/z|ZZ?/g, (match) => {
    switch (match) {
      case "z":
        return `[${timeZone.abbreviation}]`;
      case "Z":
        return formatTimeZoneOffset(timeZone.offset, ":");
      default: // 'ZZ'
        return formatTimeZoneOffset(timeZone.offset, "");
    }
  });
}
export const getPublishDate = (date: Date | string) => {
  return formatToTimeZone(date, "MMMM do, yyyy", { timeZone: timeZone });
};

export const getPublishDateTime = (date: Date | string) =>
  formatToTimeZone(date, "eee. MMM do, yyyy hh:mm a", { timeZone: timeZone });

export const getMonthYearDate = (date: Date | string) => formatToTimeZone(date, "yyyy-MMMM", { timeZone: timeZone });

export const toNow = (date: string | Date) => formatDistanceToNow(date);

export const isAfterDate = (date1: string | Date, date2: string | Date) => isAfter(date1, date2);

export const plusDays = (date: string | Date, day: number) => add(date, { days: day });

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

export function isCommentShown() {
  const [commentShown, setCommentShown] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const innerHeight = window.innerHeight + document.documentElement.scrollTop;
    const clientHeight = document.body.clientHeight;
    const percentage = (innerHeight / clientHeight) * 100;
    if (!commentShown && percentage > 50) {
      setCommentShown(true);
    }
  };
  return commentShown;
}
