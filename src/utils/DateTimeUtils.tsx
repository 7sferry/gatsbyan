import { findTimeZone, getUTCOffset } from "timezone-support";
import { format } from "date-fns";

const defaultTimeZone = "Asia/Jakarta";

export function formatToPattern(dateArg: string | Date, formatString: string, timeZone: string = defaultTimeZone) {
  const zonedDate = typeof dateArg === "string" ? new Date(dateArg) : dateArg;
  // const zonedDate = date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" });
  console.log(zonedDate);
  return format(zonedDate, formatString);
}
