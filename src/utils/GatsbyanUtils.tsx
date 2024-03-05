/************************
 * Made by [MR Ferry™]  *
 * on March 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { add, format, formatDistanceToNow, isAfter } from "date-fns";

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

const reparseDate = (date: Date) => {
  let offsetFromDate = getOffsetFromDate(date);
  let options = offsetFromDate === "0" ? undefined : { timeZone: offsetFromDate };
  return date.toLocaleString("en-US", options);
};

const getOffsetFromDate = (date: Date) => {
  const offsetMinutes = -date.getTimezoneOffset();
  if (offsetMinutes === 0) {
    return "0";
  }

  const hours = Math.floor(offsetMinutes / 60);
  const minutes = offsetMinutes % 60;

  const offsetSign = offsetMinutes < 0 ? "-" : "+";
  return `${offsetSign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const getPublishDate = (date: Date) => format(reparseDate(date), "MMMM do, yyyy");

export const getPublishDateTime = (date: Date) => format(reparseDate(date), "eee. MMM do, yyyy hh:mm a");

export const getMonthYearDate = (date: Date) => format(reparseDate(date), "yyyy-MMMM");

export const toNow = (date: Date) => formatDistanceToNow(reparseDate(date));

export const isAfterDate = (date1: Date, date2: Date) => isAfter(reparseDate(date1), reparseDate(date2));

export const plusDays = (date: Date, day: number) => add(reparseDate(date), { days: day });

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
