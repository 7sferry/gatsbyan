/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, mock, setSystemTime, test } from "bun:test";
import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";

const reports = [
  { path: "/blog/a", value: 10 },
  { path: "/blog/b", value: 5 },
];
const getReport = mock(async () => reports);
mock.module("gatsby-plugin-google-analytics-data-reporting-api", () => ({ getReport }));

const createResponse = () => {
  const response = { setHeader: mock(), json: mock() };
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

  test("caches the report until midnight", async () => {
    setSystemTime(new Date("2024-01-10T22:30:00Z"));
    const response = createResponse();

    await callHandler(response);

    expect(response.setHeader).toHaveBeenCalledWith(
      "Cache-Control",
      "public, max-age=5340, s-maxage=8940, stale-while-revalidate=300"
    );
    expect(response.json).toHaveBeenCalledWith({ nodes: reports });
  });
});
