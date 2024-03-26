import { findTimeZone, getUTCOffset } from "timezone-support";
import { format } from "date-fns";

const defaultTimeZone = "Asia/Jakarta";

export function formatToPattern(dateArg: string | Date, formatString: string, timeZone: string = defaultTimeZone) {
  const date = typeof dateArg === "string" ? new Date(dateArg) : dateArg;
  let timeZoneInfo = findTimeZone(timeZone);
  const utcOffset = getUTCOffset(date, timeZoneInfo);
  const offsetDiff = utcOffset.offset - date.getTimezoneOffset();
  const zonedDate = new Date(date.getTime() - offsetDiff * 60 * 1000);
  return format(zonedDate, formatString);
}
