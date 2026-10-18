/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { Minimatch } from "minimatch";
import { trackingExclude } from "./AnalyticsConfig.ts";

export const excludedPaths: RegExp[] = trackingExclude
  .map((glob) => new Minimatch(glob).makeRe())
  .filter((regex): regex is RegExp => regex instanceof RegExp);

export const isExcludedPath = (path: string) => excludedPaths.some((regex) => regex.test(path));

export const excludeTrackingPathsScript = () => `window.excludeTrackingPaths=[${excludedPaths.join(",")}];`;
