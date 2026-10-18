/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { describe, expect, test } from "bun:test";
import { isSiteOrigin } from "./AnalyticsConfig.ts";

describe("isSiteOrigin", () => {
  test("accepts the production site origin", () => {
    expect(isSiteOrigin("https://ferry.vercel.app")).toBe(true);
  });

  test.each([
    "http://ferry.vercel.app",
    "http://localhost:8000",
    "https://gatsbyan-xxxx.vercel.app",
    "https://ferry.vercel.app.evil.com",
    "https://ferry.vercel.app/",
    "",
    "null",
  ])("rejects %p", (origin) => {
    expect(isSiteOrigin(origin)).toBe(false);
  });

  test("rejects a missing origin", () => {
    expect(isSiteOrigin(undefined)).toBe(false);
    expect(isSiteOrigin(null)).toBe(false);
  });
});
