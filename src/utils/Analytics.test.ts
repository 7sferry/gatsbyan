/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, Mock, mock, setSystemTime, spyOn, test } from "bun:test";
import { Minimatch } from "minimatch";
import { createAnalytics, STORAGE_KEY } from "./Analytics.tsx";
import { AnalyticsEvent } from "../types/DataTypes.ts";

const SITE_URL = "https://ferry.vercel.app";
const GA_CLIENT_ID = "123456789.1792277505";

type Listener = [string, EventListenerOrEventListenerObject];

const happyDOM = (globalThis as unknown as { happyDOM: { setURL(url: string): void } }).happyDOM;
const testWindow = window as unknown as Record<string, unknown>;

const nextFrames = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  );

const setProperty = (target: object, key: string, value: unknown) =>
  Object.defineProperty(target, key, { value, configurable: true, writable: true });

const realStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage")!;

const useFakeStorage = (getItem = mock((_key: string): string | null => null)) => {
  const storage = { getItem, setItem: mock(), removeItem: mock(), clear: mock() };
  setProperty(globalThis, "localStorage", storage);
  return storage;
};

const setCookie = (cookie: string) => {
  document.cookie = `${cookie}; domain=ferry.vercel.app; path=/`;
};

const cookieNames = () =>
  document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter(Boolean);

const at = (time: string) => setSystemTime(new Date(`2026-10-18T${time}Z`));

const setHidden = (hidden: boolean) => {
  setProperty(document, "hidden", hidden);
  document.dispatchEvent(new Event("visibilitychange"));
};

describe("createAnalytics", () => {
  let beacon: Mock<(url: string, data: Blob) => boolean>;
  let windowListeners: Mock<typeof window.addEventListener>;
  let documentListeners: Mock<typeof document.addEventListener>;

  const sentEvents = async (): Promise<AnalyticsEvent[]> =>
    Promise.all(beacon.mock.calls.map(async ([, blob]) => JSON.parse(await blob.text())));

  const sentNames = async () => (await sentEvents()).map((event) => `${event.name} ${event.path}`);

  const loadPage = async (path: string) => {
    const analytics = createAnalytics();
    analytics.onRouteUpdate({ pathname: path }, null);
    await nextFrames();
    return analytics;
  };

  const navigate = async (analytics: ReturnType<typeof createAnalytics>, from: string, to: string) => {
    analytics.onRouteUpdate({ pathname: to }, { pathname: from });
    await nextFrames();
  };

  const scrollArticleTo = async (bottom: number) => {
    const article = document.querySelector(".content-post")!;
    setProperty(article, "getBoundingClientRect", () => ({ bottom }));
    window.dispatchEvent(new Event("scroll"));
    await nextFrames();
  };

  beforeEach(() => {
    happyDOM.setURL(`${SITE_URL}/blog/a`);
    localStorage.clear();
    document.title = "Post A | MR Ferry";
    document.body.innerHTML = `<div class="content-post"></div><div class="comments"></div>`;
    beacon = mock(() => true);
    setProperty(navigator, "sendBeacon", beacon);
    windowListeners = spyOn(window, "addEventListener");
    documentListeners = spyOn(document, "addEventListener");
  });

  afterEach(() => {
    (windowListeners.mock.calls as Listener[]).forEach(([type, listener]) =>
      window.removeEventListener(type, listener)
    );
    (documentListeners.mock.calls as Listener[]).forEach(([type, listener]) =>
      document.removeEventListener(type, listener)
    );
    windowListeners.mockRestore();
    documentListeners.mockRestore();
    cookieNames().forEach((name) => setCookie(`${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`));
    delete testWindow.excludeTrackingPaths;
    delete (navigator as unknown as Record<string, unknown>).globalPrivacyControl;
    delete (document as unknown as Record<string, unknown>).referrer;
    delete (document as unknown as Record<string, unknown>).hidden;
    document.body.innerHTML = "";
    Object.defineProperty(globalThis, "localStorage", realStorage);
    setSystemTime();
    happyDOM.setURL("http://localhost/");
  });

  test("sends the page view right away", async () => {
    await loadPage("/blog/a");

    const [event] = await sentEvents();
    expect(beacon.mock.calls[0][0]).toBe("/api/ituang");
    expect(beacon.mock.calls[0][1].type).toBe("application/json");
    expect(event).toMatchObject({ name: "page_view", path: "/blog/a", title: "Post A | MR Ferry", engagementMs: 1 });
    expect(event.clientId).toMatch(/^\d{1,10}\.\d{10}$/);
    expect(event.sessionId).toMatch(/^\d{10}$/);
  });

  test("sends later page views with the previous page as referrer", async () => {
    const analytics = await loadPage("/blog/a");
    document.title = "Post B | MR Ferry";

    await navigate(analytics, "/blog/a", "/blog/b");

    const events = (await sentEvents()).filter((event) => event.name === "page_view");
    expect(events).toHaveLength(2);
    expect(events[1]).toMatchObject({
      path: "/blog/b",
      title: "Post B | MR Ferry",
      referrer: `${SITE_URL}/blog/a`,
      engagementMs: 1,
    });
  });

  test("leaves out referrers that are not web urls", async () => {
    setProperty(document, "referrer", "android-app://com.google.android.gm/");

    await loadPage("/blog/a");

    const [event] = await sentEvents();
    expect(event.referrer).toBeUndefined();
  });

  test("truncates long titles", async () => {
    document.title = "a".repeat(150);

    await loadPage("/blog/a");

    const [event] = await sentEvents();
    expect(event.title).toHaveLength(100);
  });

  test("reuses the client id across page loads", async () => {
    await loadPage("/blog/a");
    await loadPage("/blog/b");

    const [first, second] = await sentEvents();
    expect(second.clientId).toBe(first.clientId);
    expect(second.sessionId).toBe(first.sessionId);
  });

  test("starts a new session after 30 minutes idle", async () => {
    at("10:00:00");
    await loadPage("/blog/a");
    at("10:29:59");
    await loadPage("/blog/b");
    at("11:00:00");
    await loadPage("/blog/c");

    const [first, second, third] = await sentEvents();
    expect(second.sessionId).toBe(first.sessionId);
    expect(third.sessionId).not.toBe(second.sessionId);
    expect(third.sessionId).toBe(String(Date.parse("2026-10-18T11:00:00Z") / 1000));
    expect(third.clientId).toBe(first.clientId);
  });

  describe("user engagement", () => {
    test("is sent for the previous page before the next page view", async () => {
      at("10:00:00");
      const analytics = await loadPage("/blog/a");
      at("10:00:05");

      await navigate(analytics, "/blog/a", "/blog/b");

      const events = await sentEvents();
      expect(events.map((event) => `${event.name} ${event.path}`)).toEqual([
        "page_view /blog/a",
        "user_engagement /blog/a",
        "page_view /blog/b",
      ]);
      expect(events[1].engagementMs).toBe(5000);
      expect(events[1].title).toBeUndefined();
      expect(events[1].referrer).toBeUndefined();
      expect(events[2].engagementMs).toBe(1);
    });

    test("is sent when the tab is hidden", async () => {
      at("10:00:00");
      await loadPage("/blog/a");
      at("10:00:03");

      setHidden(true);

      const [, event] = await sentEvents();
      expect(event).toMatchObject({ name: "user_engagement", path: "/blog/a", engagementMs: 3000 });
    });

    test("is skipped under one second", async () => {
      at("10:00:00");
      const analytics = await loadPage("/blog/a");
      at("10:00:00.900");

      await navigate(analytics, "/blog/a", "/blog/b");
      at("10:00:01.800");
      setHidden(true);

      expect(await sentNames()).toEqual(["page_view /blog/a", "page_view /blog/b"]);
    });

    test("adds up short visible periods until a second is reached", async () => {
      at("10:00:00");
      const analytics = await loadPage("/blog/a");
      at("10:00:00.600");
      setHidden(true);
      at("10:05:00");
      setHidden(false);
      at("10:05:00.600");

      await navigate(analytics, "/blog/a", "/blog/b");

      const [, event] = await sentEvents();
      expect(event).toMatchObject({ name: "user_engagement", path: "/blog/a", engagementMs: 1200 });
    });

    test("counts only the visible time since the last event", async () => {
      at("10:00:00");
      const analytics = await loadPage("/blog/a");
      at("10:00:05");
      setHidden(true);
      at("10:10:00");
      setHidden(false);
      at("10:10:02");

      await navigate(analytics, "/blog/a", "/blog/b");

      const engagements = (await sentEvents()).filter((event) => event.name === "user_engagement");
      expect(engagements.map((event) => event.engagementMs)).toEqual([5000, 2000]);
    });

    test("is not sent for excluded pages", async () => {
      testWindow.excludeTrackingPaths = [new Minimatch("/tags/**").makeRe()];
      at("10:00:00");
      const analytics = await loadPage("/tags/java");
      at("10:00:05");
      setHidden(true);
      setHidden(false);
      at("10:00:10");

      await navigate(analytics, "/tags/java", "/blog/a");

      expect(await sentNames()).toEqual(["page_view /blog/a"]);
    });
  });

  describe("article end scroll", () => {
    test("is sent once when the end of the article is within 300px of the viewport", async () => {
      await loadPage("/blog/a");

      await scrollArticleTo(3000);
      await scrollArticleTo(1069);
      await scrollArticleTo(1068);
      await scrollArticleTo(-200);

      expect(await sentNames()).toEqual(["page_view /blog/a", "scroll /blog/a"]);
    });

    test("is sent again for the next post", async () => {
      const analytics = await loadPage("/blog/a");
      await scrollArticleTo(500);

      await navigate(analytics, "/blog/a", "/blog/b");
      await scrollArticleTo(500);

      const scrolls = (await sentEvents()).filter((event) => event.name === "scroll");
      expect(scrolls.map((event) => event.path)).toEqual(["/blog/a", "/blog/b"]);
    });

    test("carries the time since the last event on the page", async () => {
      at("10:00:00");
      await loadPage("/blog/a");
      at("10:02:00");

      await scrollArticleTo(500);

      const [, scroll] = await sentEvents();
      expect(scroll).toMatchObject({ name: "scroll", engagementMs: 120_000 });
    });

    test("ignores the height of the page below the article", async () => {
      setProperty(document.documentElement, "scrollHeight", 20_000);
      await loadPage("/blog/a");

      await scrollArticleTo(700);

      expect(await sentNames()).toContain("scroll /blog/a");
      delete (document.documentElement as unknown as Record<string, unknown>).scrollHeight;
    });

    test("is not sent without a scroll event", async () => {
      setProperty(document.querySelector(".content-post")!, "getBoundingClientRect", () => ({ bottom: 300 }));

      await loadPage("/blog/a");
      await nextFrames();

      expect(await sentNames()).toEqual(["page_view /blog/a"]);
    });

    test("is not sent on pages other than blog posts", async () => {
      await loadPage("/features/value-averaging-calculator");

      await scrollArticleTo(300);

      expect(await sentNames()).toEqual(["page_view /features/value-averaging-calculator"]);
    });
  });

  describe("_ga cookie", () => {
    test("keeps the client id of a returning gtag visitor and removes the cookies", async () => {
      setCookie(`_ga=GA1.1.${GA_CLIENT_ID}`);
      setCookie("_ga_TEST123=GS2.1.s1792277505$o1$g1$t1792277600$j60$l0$h0");
      setCookie("other=1");

      await loadPage("/blog/a");
      await loadPage("/blog/b");

      const [first, second] = await sentEvents();
      expect(first.clientId).toBe(GA_CLIENT_ID);
      expect(second.clientId).toBe(GA_CLIENT_ID);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).clientId).toBe(GA_CLIENT_ID);
      expect(cookieNames()).toEqual(["other"]);
    });

    test("creates a new client id for a malformed cookie", async () => {
      setCookie("_ga=GA1.1.abc.def");

      await loadPage("/blog/a");

      const [event] = await sentEvents();
      expect(event.clientId).toMatch(/^\d{1,10}\.\d{10}$/);
      expect(event.clientId).not.toContain("abc");
    });

    test("is not read when an id is already stored", async () => {
      await loadPage("/blog/a");
      setCookie(`_ga=GA1.1.${GA_CLIENT_ID}`);

      await loadPage("/blog/b");

      const [, event] = await sentEvents();
      expect(event.clientId).not.toBe(GA_CLIENT_ID);
      expect(cookieNames()).toEqual(["_ga"]);
    });

    test("is not read with global privacy control", async () => {
      setProperty(navigator, "globalPrivacyControl", true);
      setCookie(`_ga=GA1.1.${GA_CLIENT_ID}`);

      await loadPage("/blog/a");

      const [event] = await sentEvents();
      expect(event.clientId).not.toBe(GA_CLIENT_ID);
      expect(cookieNames()).toEqual(["_ga"]);
    });
  });

  test("sends nothing on excluded paths", async () => {
    testWindow.excludeTrackingPaths = [new Minimatch("/tags/**").makeRe()];

    await loadPage("/tags/java");
    window.dispatchEvent(new Event("scroll"));
    await nextFrames();

    expect(beacon).not.toHaveBeenCalled();
  });

  test("does nothing on other origins", async () => {
    happyDOM.setURL("https://gatsbyan-git-feat.vercel.app/blog/a");
    const storage = useFakeStorage();

    await loadPage("/blog/a");
    await scrollArticleTo(300);

    expect(beacon).not.toHaveBeenCalled();
    expect(storage.getItem).not.toHaveBeenCalled();
    expect(windowListeners.mock.calls.some(([type]) => type === "scroll")).toBe(false);
  });

  test("keeps ids in memory per page load for global privacy control", async () => {
    setProperty(navigator, "globalPrivacyControl", true);
    const storage = useFakeStorage();

    const analytics = await loadPage("/blog/a");
    await navigate(analytics, "/blog/a", "/blog/b");
    await loadPage("/blog/c");

    const [first, sameLoad, nextLoad] = (await sentEvents()).filter((event) => event.name === "page_view");
    expect(sameLoad.clientId).toBe(first.clientId);
    expect(sameLoad.sessionId).toBe(first.sessionId);
    expect(nextLoad.clientId).not.toBe(first.clientId);
    expect(storage.getItem).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  test("still sends with per-load ids when storage throws", async () => {
    const storage = useFakeStorage(
      mock((_key: string): string | null => {
        throw new Error("blocked");
      })
    );

    const analytics = await loadPage("/blog/a");
    await navigate(analytics, "/blog/a", "/blog/b");
    await loadPage("/blog/c");

    const [first, sameLoad, nextLoad] = (await sentEvents()).filter((event) => event.name === "page_view");
    expect(sameLoad.clientId).toBe(first.clientId);
    expect(nextLoad.clientId).not.toBe(first.clientId);
    expect(storage.getItem).toHaveBeenCalledTimes(2);
  });

  test("stores the ids in local storage", async () => {
    await loadPage("/blog/a");

    const [event] = await sentEvents();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({
      clientId: event.clientId,
      sessionId: event.sessionId,
      lastSeen: expect.any(Number),
    });
  });

  test("falls back to fetch with keepalive without sendBeacon", async () => {
    setProperty(navigator, "sendBeacon", undefined);
    const fetchMock = spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    await loadPage("/blog/a");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/ituang");
    expect(init).toMatchObject({ method: "POST", keepalive: true, headers: { "Content-Type": "application/json" } });
    expect(JSON.parse(init.body as string)).toMatchObject({ name: "page_view", path: "/blog/a" });
    fetchMock.mockRestore();
  });
});
