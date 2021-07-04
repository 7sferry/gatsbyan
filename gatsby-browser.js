/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import "./src/templates/ignored/prism.css";
import mediumZoom from "medium-zoom";
// import { render } from "react-dom";
// import { loadableReady } from "@loadable/component";

// export function replaceHydrateFunction() {
//   return (element, container, callback) => {
//     loadableReady(() => {
//       render(element, container, callback);
//     });
//   };
// }

export const onClientEntry = (_) => {
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

export const onRouteUpdate = (_) => {
  const options = {
    margin: 20,
    zIndex: 0,
    background: "none",
  };
  mediumZoom(".gatsby-resp-image-image", options);
};
