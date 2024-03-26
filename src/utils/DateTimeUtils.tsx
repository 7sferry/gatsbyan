import { findTimeZone, getUTCOffset } from "timezone-support";
import { format } from "date-fns";

const defaultTimeZone = "Asia/Jakarta";

export function formatToPattern(dateArg: string | Date, formatString: string, timeZone: string = defaultTimeZone) {
  const date = typeof dateArg === "string" ? new Date(dateArg) : dateArg;
  const zonedDate = date.toLocaleString("en-US", { timeZone: timeZone });
  return format(zonedDate, formatString);
}
