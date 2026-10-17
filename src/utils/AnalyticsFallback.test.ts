/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, Mock, mock, setSystemTime, spyOn, test } from "bun:test";
import { Minimatch } from "minimatch";
import { createAnalyticsFallback, STORAGE_KEY } from "./AnalyticsFallback.tsx";
import { AnalyticsEvent } from "../types/DataTypes.ts";

const SITE_URL = "https://ferry.vercel.app";

type Listener = [string, EventListenerOrEventListenerObject];

const happyDOM = (globalThis as unknown as { happyDOM: { setURL(url: string): void } }).happyDOM;
const testWindow = window as unknown as Record<string, unknown>;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
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

describe("createAnalyticsFallback", () => {
  let beacon: Mock<(url: string, data: Blob) => boolean>;
  let windowListeners: Mock<typeof window.addEventListener>;
  let documentListeners: Mock<typeof document.addEventListener>;

  const sentEvents = async (): Promise<AnalyticsEvent[]> =>
    Promise.all(beacon.mock.calls.map(async ([, blob]) => JSON.parse(await blob.text())));

  const loadPage = async (path: string, options = { gtagCheckDelayMs: 0 }) => {
    const fallback = createAnalyticsFallback(options);
    fallback.onRouteUpdate({ pathname: path }, null);
    await nextFrames();
    await sleep(options.gtagCheckDelayMs);
    return fallback;
  };

  const scrollTo = async (scrollY: number, scrollHeight = 2000) => {
    setProperty(document.documentElement, "scrollHeight", scrollHeight);
    setProperty(window, "scrollY", scrollY);
    window.dispatchEvent(new Event("scroll"));
    await nextFrames();
  };

  beforeEach(() => {
    happyDOM.setURL(`${SITE_URL}/blog/a`);
    localStorage.clear();
    document.title = "Post A | MR Ferry";
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
    delete testWindow.google_tag_manager;
    delete testWindow.excludeGtagPaths;
    delete testWindow.disableStr;
    delete testWindow["ga-disable-G-TEST"];
    delete (navigator as unknown as Record<string, unknown>).globalPrivacyControl;
    delete (document as unknown as Record<string, unknown>).referrer;
    delete (document.documentElement as unknown as Record<string, unknown>).scrollHeight;
    delete testWindow.scrollY;
    Object.defineProperty(globalThis, "localStorage", realStorage);
    setSystemTime();
    happyDOM.setURL("http://localhost/");
  });

  test("sends nothing when gtag is loaded and drops queued events", async () => {
    testWindow.google_tag_manager = { "G-TEST": {} };
    const storage = useFakeStorage();

    await loadPage("/blog/a", { gtagCheckDelayMs: 20 });
    await scrollTo(1500);

    expect(beacon).not.toHaveBeenCalled();
    expect(storage.getItem).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  test("ignores a tag manager without a measurement id", async () => {
    testWindow.google_tag_manager = { "GTM-TEST": {} };

    await loadPage("/blog/a", { gtagCheckDelayMs: 20 });

    expect(beacon).toHaveBeenCalledTimes(1);
  });

  test("flushes the queued page view when gtag is blocked", async () => {
    const fallback = createAnalyticsFallback({ gtagCheckDelayMs: 30 });
    fallback.onRouteUpdate({ pathname: "/blog/a" }, null);
    await nextFrames();

    expect(beacon).not.toHaveBeenCalled();

    await sleep(30);
    const [event] = await sentEvents();
    expect(beacon.mock.calls[0][0]).toBe("/api/ituang");
    expect(beacon.mock.calls[0][1].type).toBe("application/json");
    expect(event).toMatchObject({ name: "page_view", path: "/blog/a", title: "Post A | MR Ferry" });
    expect(event.clientId).toMatch(/^\d{1,10}\.\d{10}$/);
    expect(event.sessionId).toMatch(/^\d{10}$/);
    expect(event.engagementMs).toBeGreaterThanOrEqual(1);
  });

  test("sends later page views directly with the previous page as referrer", async () => {
    const fallback = await loadPage("/blog/a");
    document.title = "Post B | MR Ferry";

    fallback.onRouteUpdate({ pathname: "/blog/b" }, { pathname: "/blog/a" });
    await nextFrames();

    const events = await sentEvents();
    expect(events).toHaveLength(2);
    expect(events[1]).toMatchObject({
      name: "page_view",
      path: "/blog/b",
      title: "Post B | MR Ferry",
      referrer: `${SITE_URL}/blog/a`,
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
    setSystemTime(new Date("2026-10-18T10:00:00Z"));
    await loadPage("/blog/a");
    setSystemTime(new Date("2026-10-18T10:29:59Z"));
    await loadPage("/blog/b");
    setSystemTime(new Date("2026-10-18T11:00:00Z"));
    await loadPage("/blog/c");

    const [first, second, third] = await sentEvents();
    expect(second.sessionId).toBe(first.sessionId);
    expect(third.sessionId).not.toBe(second.sessionId);
    expect(third.sessionId).toBe(String(Date.parse("2026-10-18T11:00:00Z") / 1000));
    expect(third.clientId).toBe(first.clientId);
  });

  test("sends one scroll per page at 90% depth", async () => {
    const fallback = await loadPage("/blog/a");

    await scrollTo(500);
    await scrollTo(1100);
    await scrollTo(1300);
    await scrollTo(1500);

    fallback.onRouteUpdate({ pathname: "/blog/b" }, { pathname: "/blog/a" });
    await nextFrames();
    await scrollTo(1500);

    const scrolls = (await sentEvents()).filter((event) => event.name === "scroll");
    expect(scrolls.map((event) => event.path)).toEqual(["/blog/a", "/blog/b"]);
  });

  test("sends no scroll on a page that cannot scroll", async () => {
    await loadPage("/blog/a");

    await scrollTo(0, 500);

    expect((await sentEvents()).map((event) => event.name)).toEqual(["page_view"]);
  });

  test("sends nothing on excluded paths", async () => {
    testWindow.excludeGtagPaths = [new Minimatch("/tags/**").makeRe()];

    await loadPage("/tags/java");
    await scrollTo(1500);

    expect(beacon).not.toHaveBeenCalled();
  });

  test("sends nothing when the visitor opted out", async () => {
    testWindow.disableStr = "ga-disable-G-TEST";
    testWindow["ga-disable-G-TEST"] = true;

    await loadPage("/blog/a");
    await scrollTo(1500);

    expect(beacon).not.toHaveBeenCalled();
  });

  test("does nothing on other origins", async () => {
    happyDOM.setURL("https://gatsbyan-git-feat.vercel.app/blog/a");
    const storage = useFakeStorage();

    await loadPage("/blog/a");
    await scrollTo(1500);

    expect(beacon).not.toHaveBeenCalled();
    expect(storage.getItem).not.toHaveBeenCalled();
    expect(windowListeners.mock.calls.some(([type]) => type === "scroll")).toBe(false);
  });

  test("keeps ids in memory per page load for global privacy control", async () => {
    setProperty(navigator, "globalPrivacyControl", true);
    const storage = useFakeStorage();

    const fallback = await loadPage("/blog/a");
    fallback.onRouteUpdate({ pathname: "/blog/b" }, { pathname: "/blog/a" });
    await nextFrames();
    await loadPage("/blog/c");

    const [first, sameLoad, nextLoad] = await sentEvents();
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

    const fallback = await loadPage("/blog/a");
    fallback.onRouteUpdate({ pathname: "/blog/b" }, { pathname: "/blog/a" });
    await nextFrames();
    await loadPage("/blog/c");

    const [first, sameLoad, nextLoad] = await sentEvents();
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

  test("counts only visible time as engagement", async () => {
    setSystemTime(new Date("2026-10-18T10:00:00Z"));
    const fallback = await loadPage("/blog/a");

    setSystemTime(new Date("2026-10-18T10:00:05Z"));
    setProperty(document, "hidden", true);
    document.dispatchEvent(new Event("visibilitychange"));
    setSystemTime(new Date("2026-10-18T10:10:00Z"));
    setProperty(document, "hidden", false);
    document.dispatchEvent(new Event("visibilitychange"));
    setSystemTime(new Date("2026-10-18T10:10:02Z"));
    fallback.onRouteUpdate({ pathname: "/blog/b" }, { pathname: "/blog/a" });
    await nextFrames();

    const [, second] = await sentEvents();
    expect(second.engagementMs).toBe(7000);
    delete (document as unknown as Record<string, unknown>).hidden;
  });
});
