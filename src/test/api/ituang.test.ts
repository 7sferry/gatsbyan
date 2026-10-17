/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, Mock, mock, spyOn, test } from "bun:test";
import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";
import handler from "../../api/ituang.ts";

const SITE_URL = "https://ferry.vercel.app";

const validEvent = {
  name: "page_view",
  path: "/blog/a",
  title: "Post A | MR Ferry",
  referrer: "https://www.google.com/",
  clientId: "123456789.1792277505",
  sessionId: "1792277505",
  engagementMs: 1500,
  language: "id-ID",
  screen: "390x844",
};

const createResponse = () => {
  const response = { status: mock(), setHeader: mock(), end: mock() };
  response.status.mockReturnValue(response);
  response.setHeader.mockReturnValue(response);
  return response;
};

const createRequest = (body: unknown, headers: Record<string, string> = {}, method = "POST") =>
  ({
    method,
    body,
    headers: { origin: SITE_URL, ...headers },
  }) as unknown as GatsbyFunctionRequest;

const callHandler = async (request: GatsbyFunctionRequest) => {
  const response = createResponse();
  await handler(request, response as unknown as GatsbyFunctionResponse);
  return response;
};

const statusOf = (response: ReturnType<typeof createResponse>) => response.status.mock.calls[0][0];

describe("ituang api", () => {
  let fetchMock: Mock<typeof fetch>;

  const sentPayload = () => JSON.parse(fetchMock.mock.calls[0][1]!.body as string);

  beforeEach(() => {
    process.env.ANALYTICS_MEASUREMENT_ID = "G-TEST";
    process.env.ANALYTICS_API_SECRET = "secret";
    fetchMock = spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  test.each(["GET", "PUT", "OPTIONS"])("rejects %s with 405", async (method) => {
    const response = await callHandler(createRequest(validEvent, {}, method));

    expect(statusOf(response)).toBe(405);
    expect(response.setHeader).toHaveBeenCalledWith("Allow", "POST");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each(["https://evil.com", "https://gatsbyan-git-feat.vercel.app", "http://localhost:8000"])(
    "rejects origin %p with 403",
    async (origin) => {
      const response = await callHandler(createRequest(validEvent, { origin }));

      expect(statusOf(response)).toBe(403);
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  test("rejects a missing origin with 403", async () => {
    const request = { method: "POST", body: validEvent, headers: {} } as unknown as GatsbyFunctionRequest;

    const response = await callHandler(request);

    expect(statusOf(response)).toBe(403);
  });

  test("rejects oversized bodies with 413", async () => {
    const response = await callHandler(createRequest({ ...validEvent, title: "a".repeat(2000) }));

    expect(statusOf(response)).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("rejects a declared content length over the limit with 413", async () => {
    const response = await callHandler(createRequest(validEvent, { "content-length": "5000" }));

    expect(statusOf(response)).toBe(413);
  });

  test.each([
    ["an unknown event", { name: "purchase" }],
    ["a path without a leading slash", { path: "blog/a" }],
    ["a path with a query", { path: "/blog/a?x=1" }],
    ["a path with whitespace", { path: "/blog/a b" }],
    ["a too long path", { path: `/blog/${"a".repeat(200)}` }],
    ["an excluded tag path", { path: "/tags/java" }],
    ["an excluded page path", { path: "/page/2" }],
    ["the search page", { path: "/search" }],
    ["the 404 page", { path: "/404" }],
    ["a too long title", { title: "a".repeat(101) }],
    ["a referrer that is not a url", { referrer: "android-app://com.google" }],
    ["a malformed client id", { clientId: "abc" }],
    ["a malformed session id", { sessionId: "123" }],
    ["a numeric session id", { sessionId: 1792277505 }],
    ["a zero engagement", { engagementMs: 0 }],
    ["a fractional engagement", { engagementMs: 1.5 }],
    ["a too long engagement", { engagementMs: 3_600_001 }],
    ["a malformed language", { language: "<script>" }],
    ["a malformed screen", { screen: "big" }],
  ])("rejects %s with 400", async (_, override) => {
    const response = await callHandler(createRequest({ ...validEvent, ...override }));

    expect(statusOf(response)).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each([null, "not json", 42])("rejects body %p with 400", async (body) => {
    const response = await callHandler(createRequest(body));

    expect(statusOf(response)).toBe(400);
  });

  test("forwards a page view to the measurement protocol", async () => {
    const response = await callHandler(createRequest(validEvent));

    expect(statusOf(response)).toBe(204);
    expect(response.setHeader).toHaveBeenCalledWith("Cache-Control", "no-store");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://www.google-analytics.com/mp/collect?measurement_id=G-TEST&api_secret=secret");
    expect(init).toMatchObject({ method: "POST", headers: { "Content-Type": "application/json" } });
    expect(sentPayload()).toEqual({
      client_id: "123456789.1792277505",
      device: { category: "desktop", language: "id-ID", screen_resolution: "390x844" },
      events: [
        {
          name: "page_view",
          params: {
            page_location: `${SITE_URL}/blog/a`,
            page_title: "Post A | MR Ferry",
            page_referrer: "https://www.google.com/",
            session_id: "1792277505",
            engagement_time_msec: 1500,
          },
        },
      ],
    });
  });

  test("accepts a json string body", async () => {
    const response = await callHandler(createRequest(JSON.stringify(validEvent)));

    expect(statusOf(response)).toBe(204);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("leaves out optional fields that were not sent", async () => {
    const { title, referrer, language, screen, ...required } = validEvent;

    await callHandler(createRequest(required));

    expect(sentPayload().device).toEqual({ category: "desktop" });
    expect(Object.keys(sentPayload().events[0].params)).toEqual([
      "page_location",
      "session_id",
      "engagement_time_msec",
    ]);
  });

  test("adds the scroll depth to scroll events", async () => {
    await callHandler(createRequest({ ...validEvent, name: "scroll" }));

    expect(sentPayload().events[0]).toMatchObject({ name: "scroll", params: { percent_scrolled: 90 } });
  });

  test("sends the vercel location without the ip address", async () => {
    await callHandler(
      createRequest(validEvent, {
        "x-forwarded-for": "203.0.113.7",
        "x-vercel-ip-country": "ID",
        "x-vercel-ip-country-region": "SB",
        "x-vercel-ip-city": "Kota%20Solok",
      })
    );

    expect(sentPayload().user_location).toEqual({ country_id: "ID", region_id: "ID-SB", city: "Kota Solok" });
    expect(fetchMock.mock.calls[0][1]!.body).not.toContain("203.0.113.7");
  });

  test("ignores malformed location headers", async () => {
    await callHandler(
      createRequest(validEvent, {
        "x-vercel-ip-country": "Indonesia",
        "x-vercel-ip-city": "Solok",
      })
    );

    expect(sentPayload().user_location).toBeUndefined();
  });

  test("leaves out an undecodable city", async () => {
    await callHandler(createRequest(validEvent, { "x-vercel-ip-country": "ID", "x-vercel-ip-city": "%E0%A4%A" }));

    expect(sentPayload().user_location).toEqual({ country_id: "ID" });
  });

  test.each([
    ["mobile client hint", { "sec-ch-ua-mobile": "?1" }, "mobile"],
    ["iPhone", { "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile/15E148" }, "mobile"],
    ["Android phone", { "user-agent": "Mozilla/5.0 (Linux; Android 15; Pixel 9) Mobile Safari/537.36" }, "mobile"],
    ["Android tablet", { "user-agent": "Mozilla/5.0 (Linux; Android 15; SM-X910) Safari/537.36" }, "tablet"],
    ["iPad", { "user-agent": "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)" }, "tablet"],
    ["Windows", { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0" }, "desktop"],
  ])("derives the device category for %s", async (_, headers, category) => {
    await callHandler(createRequest(validEvent, headers));

    expect(sentPayload().device.category).toBe(category);
    expect(fetchMock.mock.calls[0][1]!.body).not.toContain("Mozilla");
  });

  test("still responds 204 when the measurement protocol fails", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    const consoleError = spyOn(console, "error").mockImplementation(() => undefined);

    const response = await callHandler(createRequest(validEvent));

    expect(statusOf(response)).toBe(204);
    expect(consoleError).toHaveBeenCalledTimes(1);
    consoleError.mockRestore();
  });

  test("logs an upstream error status without the secret", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));
    const consoleError = spyOn(console, "error").mockImplementation(() => undefined);

    const response = await callHandler(createRequest(validEvent));

    expect(statusOf(response)).toBe(204);
    expect(consoleError).toHaveBeenCalledWith("failed to forward analytics event", 500);
    consoleError.mockRestore();
  });

  test.each(["ANALYTICS_MEASUREMENT_ID", "ANALYTICS_API_SECRET"])(
    "responds 204 without forwarding when %s is missing",
    async (name) => {
      delete process.env[name];
      const consoleError = spyOn(console, "error");

      const response = await callHandler(createRequest(validEvent));

      expect(statusOf(response)).toBe(204);
      expect(fetchMock).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();
      consoleError.mockRestore();
    }
  );
});
