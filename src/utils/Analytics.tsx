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
    excludeTrackingPaths?: RegExp[];
  }

  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

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

interface TrackedPage {
  readonly path: string;
  readonly isPost: boolean;
  scrolled: boolean;
}

export interface Analytics {
  onRouteUpdate(location: RouteLocation, prevLocation?: RouteLocation | null): void;
}

export const STORAGE_KEY = "ituang";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const MIN_ENGAGEMENT_MS = 1000;
const POST_PATH_PREFIX = "/blog/";
const ARTICLE_SELECTOR = ".content-post";
const ARTICLE_END_TOLERANCE_PX = 300;
const GA_COOKIE = "_ga";
const GA_COOKIE_PATTERN = /^GA1\.\d+\.(.+)$/;

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

const renewIds = (previous: Ids | null, now: number, migratedClientId?: string): Ids => {
  const seconds = Math.floor(now / 1000);
  const sameSession = previous !== null && now - previous.lastSeen < SESSION_TIMEOUT_MS;
  return {
    clientId: previous?.clientId ?? migratedClientId ?? `${randomNumber()}.${seconds}`,
    sessionId: sameSession ? previous.sessionId : String(seconds),
    lastSeen: now,
  };
};

const readGaCookies = () =>
  document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("="))
    .filter(([name]) => name === GA_COOKIE || name.startsWith(`${GA_COOKIE}_`));

const gaClientId = (cookies: string[][]) => {
  const value = cookies.find(([name]) => name === GA_COOKIE)?.[1] ?? "";
  const clientId = GA_COOKIE_PATTERN.exec(value)?.[1];
  return clientId && CLIENT_ID_PATTERN.test(clientId) ? clientId : undefined;
};

const expireCookie = ([name]: string[]) => {
  document.cookie = `${name}=; domain=${window.location.hostname}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

const truncate = (text: string) => text.slice(0, MAX_TEXT_LENGTH) || undefined;

const pageReferrer = (url: string) => (URL_PATTERN.test(url) ? truncate(url) : undefined);

const isExcluded = (path: string) => (window.excludeTrackingPaths ?? []).some((regex) => regex.test(path));

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

const disabled: Analytics = { onRouteUpdate: () => undefined };

export function createAnalytics(): Analytics {
  if (!isSiteOrigin(window.location.origin)) {
    return disabled;
  }

  let store: IdStore = navigator.globalPrivacyControl === true ? memoryStore() : localStore;
  let page: TrackedPage | null = null;
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
    const gaCookies = previous === null && store === localStore ? readGaCookies() : [];
    const ids = renewIds(previous, Date.now(), gaClientId(gaCookies));
    try {
      store.write(ids);
      gaCookies.forEach(expireCookie);
    } catch {
      store = memoryStore();
      store.write(ids);
    }
    return ids;
  };

  const engagedTime = () => engagedMs + (visibleSince === null ? 0 : Date.now() - visibleSince);

  const resetEngagement = () => {
    engagedMs = 0;
    visibleSince = document.hidden ? null : Date.now();
  };

  const takeEngagement = () => {
    const total = engagedTime();
    resetEngagement();
    return Math.min(Math.max(1, Math.round(total)), MAX_ENGAGEMENT_MS);
  };

  const deliver = (
    name: AnalyticsEventName,
    path: string,
    engagementMs: number,
    details: Pick<AnalyticsEvent, "title" | "referrer"> = {}
  ) => {
    const { clientId, sessionId } = nextIds();
    send({ name, path, ...details, clientId, sessionId, engagementMs, ...deviceInfo() });
  };

  const sendEngagement = (path: string) => {
    if (engagedTime() >= MIN_ENGAGEMENT_MS) {
      deliver("user_engagement", path, takeEngagement());
    }
  };

  const checkScroll = () => {
    scrollFrame = 0;
    if (!page?.isPost || page.scrolled) {
      return;
    }
    const article = document.querySelector(ARTICLE_SELECTOR);
    if (article && article.getBoundingClientRect().bottom <= window.innerHeight + ARTICLE_END_TOLERANCE_PX) {
      page.scrolled = true;
      deliver("scroll", page.path, takeEngagement());
    }
  };

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      visibleSince = Date.now();
      return;
    }
    if (visibleSince !== null) {
      engagedMs += Date.now() - visibleSince;
      visibleSince = null;
    }
    if (page) {
      sendEngagement(page.path);
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollFrame && page?.isPost && !page.scrolled) {
        scrollFrame = requestAnimationFrame(checkScroll);
      }
    },
    { passive: true }
  );

  return {
    onRouteUpdate(location, prevLocation) {
      if (page) {
        sendEngagement(page.path);
      }
      resetEngagement();
      const path = location.pathname;
      page = isExcluded(path) ? null : { path, isPost: path.startsWith(POST_PATH_PREFIX), scrolled: false };
      if (page === null) {
        return;
      }
      const referrer = prevLocation ? `${window.location.origin}${prevLocation.pathname}` : document.referrer;
      afterRender(() =>
        deliver("page_view", path, 1, { title: truncate(document.title), referrer: pageReferrer(referrer) })
      );
    },
  };
}

let analytics: Analytics | undefined;

export const trackRouteUpdate: Analytics["onRouteUpdate"] = (location, prevLocation) => {
  analytics ??= createAnalytics();
  analytics.onRouteUpdate(location, prevLocation);
};
