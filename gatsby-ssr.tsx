/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import * as React from "react";

export function onPreRenderHTML({ getHeadComponents, replaceHeadComponents }: any) {
  const headComponents = getHeadComponents();
  const styleHeadComponents = headComponents.filter((component: { type: string }) => component.type === "style");
  const nonStyleHeadComponents = headComponents.filter((component: { type: string }) => component.type !== "style");
  replaceHeadComponents([nonStyleHeadComponents, styleHeadComponents]);
}

export const onRenderBody = ({ setHeadComponents }: any) => {
  setHeadComponents([
    <link
      key="work-sans-italic-vietnam"
      rel="preload"
      href="/fonts/QGYqz_wNahGAdqQ43Rh_eZDkv_1w4A.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="work-sans-italic-latin-ext"
      rel="preload"
      href="/fonts/QGYqz_wNahGAdqQ43Rh_eZDlv_1w4A.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="work-sans-italic-latin"
      rel="preload"
      href="/fonts/QGYqz_wNahGAdqQ43Rh_eZDrv_0.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="work-sans-normal-vietnam"
      rel="preload"
      href="/fonts/QGYsz_wNahGAdqQ43Rh_c6Dpp_k.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="work-sans-normal-latin-ext"
      rel="preload"
      href="/fonts/QGYsz_wNahGAdqQ43Rh_cqDpp_k.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="work-sans-normal-latin"
      rel="preload"
      href="/fonts/QGYsz_wNahGAdqQ43Rh_fKDp.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
  ]);
};
