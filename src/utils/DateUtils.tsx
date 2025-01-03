/************************
 * Made by [MR Ferry™]  *
 * on Januari 2025      *
 ************************/

import { add, format, formatDistanceToNow, isAfter } from "date-fns";

export const getPublishDate = (date: string) => formatToPattern(date, "MMMM do, yyyy");
export const getPublishDateTime = (date: string) => formatToPattern(date, "eee. MMM do, yyyy hh:mm a");
export const getDateYear = (date: string) => formatToPattern(date, "yyyy-MM-dd");
export const getMonthYearDate = (date: string) => formatToPattern(date, "yyyy-MMMM");
export const toNow = (date: string | Date) =>
  formatDistanceToNow(typeof date === "string" ? new Date(date) : date, { addSuffix: true });
export const isAfterDate = (date1: string | Date, date2: string | Date) =>
  isAfter(typeof date1 === "string" ? new Date(date1) : date1, typeof date2 === "string" ? new Date(date2) : date2);
export const plusDays = (date: string | Date, day: number) =>
  add(typeof date === "string" ? new Date(date) : date, { days: day });

function formatToPattern(dateArg: string, formatString: string, timeZone: string = "Asia/Jakarta") {
  const date = new Date(dateArg);
  const zonedDate = date.toLocaleString("en-US", { timeZone: timeZone });
  return format(new Date(zonedDate), formatString);
}
