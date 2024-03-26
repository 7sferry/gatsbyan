import { findTimeZone, getUTCOffset } from "timezone-support";
import { format } from "date-fns";

const defaultTimeZone = "Asia/Jakarta";

export function formatToPattern(dateArg: string | Date, formatString: string, timeZone: string = defaultTimeZone) {
  const date = typeof dateArg === "string" ? new Date(dateArg) : dateArg;
  // let timeZoneInfo = findTimeZone(timeZone);
  // const { offset } = getUTCOffset(date, timeZoneInfo);
  // const offsetDiff = offset - date.getTimezoneOffset();
  // const zonedDate = new Date(date.getTime() - offsetDiff * 60 * 1000);
  const zonedDate = date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" });
  console.log(zonedDate);
  return format(zonedDate, formatString);
}
