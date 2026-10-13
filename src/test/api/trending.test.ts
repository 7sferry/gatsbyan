/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, mock, setSystemTime, spyOn, test } from "bun:test";
import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";

const reports = [
  { path: "/blog/a", value: 10 },
  { path: "/blog/b", value: 5 },
];
const getReport = mock(async () => reports);
mock.module("gatsby-plugin-google-analytics-data-reporting-api", () => ({ getReport }));

const createResponse = () => {
  const response = { status: mock(), setHeader: mock(), json: mock() };
  response.status.mockReturnValue(response);
  response.setHeader.mockReturnValue(response);
  return response;
};

// Imported lazily so the analytics plugin is mocked before the handler loads it
const callHandler = async (response: ReturnType<typeof createResponse>) => {
  const { default: handler } = await import("../../api/trending.ts");
  await handler({} as GatsbyFunctionRequest, response as unknown as GatsbyFunctionResponse);
};

describe("trending api", () => {
  afterEach(() => {
    setSystemTime();
  });

  test("requests organic search report for blog posts", async () => {
    process.env.ANALYTICS_PRIVATE_KEY = "private-key";
    process.env.ANALYTICS_GA4 = "properties/123";
    process.env.ANALYTICS_EMAIL = "service@example.com";

    await callHandler(createResponse());

    expect(getReport).toHaveBeenCalledWith({
      privateKey: "private-key",
      property: "properties/123",
      serviceAccountEmail: "service@example.com",
      desc: true,
      startDate: "30daysAgo",
      endDate: "yesterday",
      limit: 5,
      metric: "organicGoogleSearchClicks",
      regexFilter: "^/blog/",
    });
  });

  test("caches the report until midnight in Jakarta", async () => {
    // 05:30 in Jakarta, 18.5 hours before midnight
    setSystemTime(new Date("2024-01-10T22:30:00Z"));
    const response = createResponse();

    await callHandler(response);

    expect(response.setHeader).toHaveBeenCalledWith(
      "Cache-Control",
      "public, max-age=66600, s-maxage=70200, stale-while-revalidate=300"
    );
    expect(response.json).toHaveBeenCalledWith({ nodes: reports });
  });

  test("expires right before midnight in Jakarta", async () => {
    // 23:59:30 in Jakarta
    setSystemTime(new Date("2024-01-10T16:59:30Z"));
    const response = createResponse();

    await callHandler(response);

    expect(response.setHeader).toHaveBeenCalledWith(
      "Cache-Control",
      "public, max-age=30, s-maxage=3630, stale-while-revalidate=300"
    );
  });

  test("does not cache a failed report", async () => {
    getReport.mockImplementationOnce(async () => {
      throw new Error("quota exceeded");
    });
    const consoleError = spyOn(console, "error").mockImplementation(() => {});
    const response = createResponse();

    await callHandler(response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.setHeader).toHaveBeenCalledWith("Cache-Control", "no-store");
    expect(response.json).toHaveBeenCalledWith({ nodes: [] });
    consoleError.mockRestore();
  });
});
