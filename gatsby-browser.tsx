/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import type { GatsbyBrowser } from "gatsby";
import { Sign } from "./src/utils/Sign.tsx";
import { ImageZoom } from "./src/components/ImageZoom.tsx";
import { trackRouteUpdate } from "./src/utils/Analytics.tsx";
import { ExternalLinks } from "./src/utils/ExternalLinks.ts";

export const onClientEntry: GatsbyBrowser["onClientEntry"] = () => {
  ExternalLinks();
};

export const onRouteUpdate: GatsbyBrowser["onRouteUpdate"] = ({ location, prevLocation }) => {
  trackRouteUpdate(location, prevLocation);
  ImageZoom();
  if (!navigator.clipboard || !window.isSecureContext) {
    return;
  }
  const elementNodeListOf = document.querySelectorAll(".gatsby-remark-prismjs-copy-button-container");
  elementNodeListOf.forEach((el) => {
    (el as HTMLElement).style.setProperty("display", "flex", "important");
  });
};

export const onInitialClientRender = () => {
  Sign();
};
