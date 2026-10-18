/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { describe, expect, mock, test } from "bun:test";
import React from "react";
import { onRenderBody } from "../../gatsby-ssr.tsx";
import { trackingExclude } from "../utils/AnalyticsConfig.ts";
import { isExcludedPath } from "../utils/TrackingExclude.ts";

const renderExcludedPaths = () => {
  const setHeadComponents = mock();
  onRenderBody({ setHeadComponents });
  const components: React.ReactElement<{ dangerouslySetInnerHTML?: { __html: string } }>[] =
    setHeadComponents.mock.calls[0][0];
  const script = components.find((component) => component.key === "exclude-tracking-paths")!;
  const target: { excludeTrackingPaths?: RegExp[] } = {};
  new Function("window", script.props.dangerouslySetInnerHTML!.__html)(target);
  return target.excludeTrackingPaths!;
};

describe("onRenderBody", () => {
  test("renders one regex per tracking exclude entry", () => {
    const regexes = renderExcludedPaths();

    expect(regexes).toHaveLength(trackingExclude.length);
    regexes.forEach((regex) => expect(regex).toBeInstanceOf(RegExp));
  });

  test.each([
    ["/tags/java", true],
    ["/tags/java/2", true],
    ["/page/2", true],
    ["/search", true],
    ["/archive", true],
    ["/404", true],
    ["/blog/a", false],
    ["/", false],
    ["/features/value-averaging-calculator", false],
  ])("matches %p like the function (excluded: %p)", (path, excluded) => {
    const inBrowser = renderExcludedPaths().some((regex) => regex.test(path));

    expect(inBrowser).toBe(excluded);
    expect(isExcludedPath(path)).toBe(excluded);
  });
});
