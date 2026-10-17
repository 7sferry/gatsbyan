/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { AnalyticsEvent, AnalyticsEventName } from "../types/DataTypes.ts";
import {
  ANALYTICS_ENDPOINT,
  CLIENT_ID_PATTERN,
  isSiteOrigin,
  LANGUAGE_PATTERN,
  MAX_ENGAGEMENT_MS,
  MAX_TEXT_LENGTH,
  SCREEN_PATTERN,
  SESSION_ID_PATTERN,
  URL_PATTERN,
} from "./AnalyticsConfig.ts";

declare global {
  interface Window {
    excludeGtagPaths?: RegExp[];
    disableStr?: string;
    google_tag_manager?: Record<string, unknown>;
  }

  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

type GtagState = "pending" | "gtag" | "fallback";

type PendingEvent = Omit<AnalyticsEvent, "clientId" | "sessionId">;

interface RouteLocation {
  readonly pathname: string;
}

interface Ids {
  readonly clientId: string;
  readonly sessionId: string;
  readonly lastSeen: number;
}

interface IdStore {
  read(): Ids | null;
  write(ids: Ids): void;
}

export interface AnalyticsFallback {
  onRouteUpdate(location: RouteLocation, prevLocation?: RouteLocation | null): void;
}

export interface AnalyticsFallbackOptions {
  readonly gtagCheckDelayMs?: number;
}

export const STORAGE_KEY = "ituang";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const SCROLL_THRESHOLD = 0.9;

const isIds = (value: unknown): value is Ids => {
  const ids = value as Ids | null;
  return (
    typeof ids?.clientId === "string" &&
    CLIENT_ID_PATTERN.test(ids.clientId) &&
    typeof ids.sessionId === "string" &&
    SESSION_ID_PATTERN.test(ids.sessionId) &&
    typeof ids.lastSeen === "number"
  );
};

const memoryStore = (): IdStore => {
  let ids: Ids | null = null;
  return {
    read: () => ids,
    write: (next) => {
      ids = next;
    },
  };
};

const localStore: IdStore = {
  read() {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return isIds(stored) ? stored : null;
  },
  write(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  },
};

const randomNumber = () => crypto.getRandomValues(new Uint32Array(1))[0];

const renewIds = (previous: Ids | null, now: number): Ids => {
  const seconds = Math.floor(now / 1000);
  const sameSession = previous !== null && now - previous.lastSeen < SESSION_TIMEOUT_MS;
  return {
    clientId: previous?.clientId ?? `${randomNumber()}.${seconds}`,
    sessionId: sameSession ? previous.sessionId : String(seconds),
    lastSeen: now,
  };
};

const truncate = (text: string) => text.slice(0, MAX_TEXT_LENGTH) || undefined;

const pageReferrer = (url: string) => (URL_PATTERN.test(url) ? truncate(url) : undefined);

const hasGtag = () => Object.keys(window.google_tag_manager ?? {}).some((key) => key.startsWith("G-"));

const isExcluded = (path: string) => (window.excludeGtagPaths ?? []).some((regex) => regex.test(path));

const isOptedOut = () => {
  const key = window.disableStr;
  return typeof key === "string" && (window as unknown as Record<string, unknown>)[key] === true;
};

const deviceInfo = () => {
  const language = navigator.language;
  const screenSize = `${window.screen.width}x${window.screen.height}`;
  return {
    ...(LANGUAGE_PATTERN.test(language) ? { language } : {}),
    ...(SCREEN_PATTERN.test(screenSize) ? { screen: screenSize } : {}),
  };
};

const send = (event: AnalyticsEvent) => {
  const body = JSON.stringify(event);
  if (navigator.sendBeacon?.(ANALYTICS_ENDPOINT, new Blob([body], { type: "application/json" }))) {
    return;
  }
  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
};

const afterRender = (callback: () => void) => {
  requestAnimationFrame(() => requestAnimationFrame(callback));
};

const disabled: AnalyticsFallback = { onRouteUpdate: () => undefined };

export function createAnalyticsFallback({ gtagCheckDelayMs = 3000 }: AnalyticsFallbackOptions = {}): AnalyticsFallback {
  if (!isSiteOrigin(window.location.origin)) {
    return disabled;
  }

  let state: GtagState = "pending";
  let queue: PendingEvent[] = [];
  let store: IdStore = navigator.globalPrivacyControl === true ? memoryStore() : localStore;
  let currentPath: string | null = null;
  let scrolled = false;
  let scrollFrame = 0;
  let engagedMs = 0;
  let visibleSince: number | null = document.hidden ? null : Date.now();

  const nextIds = () => {
    let previous: Ids | null = null;
    try {
      previous = store.read();
    } catch {
      store = memoryStore();
    }
    const ids = renewIds(previous, Date.now());
    try {
      store.write(ids);
    } catch {
      store = memoryStore();
      store.write(ids);
    }
    return ids;
  };

  const takeEngagement = () => {
    const now = Date.now();
    const total = engagedMs + (visibleSince === null ? 0 : now - visibleSince);
    engagedMs = 0;
    visibleSince = document.hidden ? null : now;
    return Math.min(Math.max(1, Math.round(total)), MAX_ENGAGEMENT_MS);
  };

  const deliver = (event: PendingEvent) => {
    const { clientId, sessionId } = nextIds();
    send({ ...event, clientId, sessionId });
  };

  const raise = (name: AnalyticsEventName, path: string, page: Pick<AnalyticsEvent, "title" | "referrer"> = {}) => {
    if (state === "gtag" || isOptedOut()) {
      return;
    }
    const event: PendingEvent = { name, path, ...page, engagementMs: takeEngagement(), ...deviceInfo() };
    if (state === "fallback") {
      deliver(event);
    } else {
      queue.push(event);
    }
  };

  const detectGtag = () => {
    state = hasGtag() ? "gtag" : "fallback";
    const pending = queue;
    queue = [];
    if (state === "fallback") {
      pending.forEach(deliver);
    }
  };

  const checkScroll = () => {
    scrollFrame = 0;
    const height = document.documentElement.scrollHeight;
    if (scrolled || currentPath === null || height <= window.innerHeight) {
      return;
    }
    if (window.scrollY + window.innerHeight >= height * SCROLL_THRESHOLD) {
      scrolled = true;
      raise("scroll", currentPath);
    }
  };

  const scheduleDetection = () => {
    setTimeout(detectGtag, gtagCheckDelayMs);
  };
  if (document.readyState === "complete") {
    scheduleDetection();
  } else {
    window.addEventListener("load", scheduleDetection, { once: true });
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      visibleSince = Date.now();
    } else if (visibleSince !== null) {
      engagedMs += Date.now() - visibleSince;
      visibleSince = null;
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollFrame) {
        scrollFrame = requestAnimationFrame(checkScroll);
      }
    },
    { passive: true }
  );

  return {
    onRouteUpdate(location, prevLocation) {
      const path = location.pathname;
      scrolled = false;
      currentPath = isExcluded(path) ? null : path;
      if (currentPath === null) {
        return;
      }
      const referrer = prevLocation ? `${window.location.origin}${prevLocation.pathname}` : document.referrer;
      afterRender(() =>
        raise("page_view", path, { title: truncate(document.title), referrer: pageReferrer(referrer) })
      );
    },
  };
}

let analyticsFallback: AnalyticsFallback | undefined;

export const trackRouteUpdate: AnalyticsFallback["onRouteUpdate"] = (location, prevLocation) => {
  analyticsFallback ??= createAnalyticsFallback();
  analyticsFallback.onRouteUpdate(location, prevLocation);
};
