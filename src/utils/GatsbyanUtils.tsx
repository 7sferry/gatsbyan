/************************
 * Made by [MR Ferry™]  *
 * on March 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { add, format, formatDistanceToNow, isAfter } from "date-fns";
import { getUTCOffset, findTimeZone } from "timezone-support";

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

const defaultTimeZone = "Asia/Jakarta";

function formatToPattern(dateArg: string | Date, formatString: string, timeZone: string = defaultTimeZone) {
  const date = typeof dateArg === "string" ? new Date(dateArg) : dateArg;
  let timeZoneInfo = findTimeZone(timeZone);
  const utcOffset = getUTCOffset(date, timeZoneInfo);
  const offsetDiff = utcOffset.offset - date.getTimezoneOffset();
  const zonedDate = new Date(date.getTime() - offsetDiff * 60 * 1000);
  return format(zonedDate, formatString);
}

export const getPublishDate = (date: Date | string) => formatToPattern(date, "MMMM do, yyyy");

export const getPublishDateTime = (date: Date | string) => formatToPattern(date, "eee. MMM do, yyyy hh:mm a");

export const getMonthYearDate = (date: Date | string) => formatToPattern(date, "yyyy-MMMM");

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
