/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, setSystemTime, test } from "bun:test";
import {
  getIsoFormat,
  getMonthYearDate,
  getPublishDate,
  getPublishDateTime,
  isAfterDate,
  plusDays,
  toNow,
} from "./DateUtils.tsx";

// 20:00 UTC is already the next day (03:00) in Asia/Jakarta
const LATE_UTC = "2024-01-15T20:00:00Z";

describe("date formatting in Asia/Jakarta", () => {
  test("getPublishDate", () => {
    expect(getPublishDate(LATE_UTC)).toBe("January 16th, 2024");
  });

  test("getPublishDateTime", () => {
    expect(getPublishDateTime(LATE_UTC)).toBe("Tue. Jan 16th, 2024 03:00 AM");
  });

  test("getIsoFormat", () => {
    expect(getIsoFormat(LATE_UTC)).toBe("2024-01-16T03:00:00");
  });

  test("getMonthYearDate", () => {
    expect(getMonthYearDate("2024-03-31T18:00:00Z")).toBe("2024-April");
  });
});

describe("toNow", () => {
  afterEach(() => {
    setSystemTime();
  });

  test("describes past and future dates relative to now", () => {
    setSystemTime(new Date("2024-01-10T00:00:00Z"));
    expect(toNow("2024-01-07T00:00:00Z")).toBe("3 days ago");
    expect(toNow(new Date("2024-01-12T00:00:00Z"))).toBe("in 2 days");
  });
});

describe("isAfterDate", () => {
  test("accepts strings and dates", () => {
    expect(isAfterDate("2024-02-01", "2024-01-01")).toBe(true);
    expect(isAfterDate(new Date("2024-01-01"), new Date("2024-02-01"))).toBe(false);
    expect(isAfterDate("2024-01-01", "2024-01-01")).toBe(false);
  });
});

describe("plusDays", () => {
  test("adds days across a month boundary", () => {
    expect(plusDays("2024-01-30", 3).toISOString()).toBe("2024-02-02T00:00:00.000Z");
    expect(plusDays(new Date("2024-03-01"), -1).toISOString()).toBe("2024-02-29T00:00:00.000Z");
  });
});
