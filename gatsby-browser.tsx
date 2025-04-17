/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import mediumZoom from "medium-zoom";
import { Sign } from "./src/utils/Sign.tsx";

export const onClientEntry = () => {
  const styles = `
    .medium-zoom-overlay, .medium-zoom-image {
      z-index: 0;
    }
  `;

  const node = document.createElement(`style`);
  node.id = `medium-zoom-styles`;
  node.innerHTML = styles;
  document.head.appendChild(node);
};

export const onRouteUpdate = () => {
  const options = {
    margin: 20,
    zIndex: 0,
    background: "none",
  };
  mediumZoom(".gatsby-resp-image-image", options);

  if (navigator.clipboard && window.isSecureContext) {
    return;
  }
  const elementNodeListOf = document.querySelectorAll(".gatsby-remark-prismjs-copy-button-container");
  elementNodeListOf.forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });
};

export const onInitialClientRender = () => {
  Sign();
};
