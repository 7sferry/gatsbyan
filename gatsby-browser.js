/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

// import "./src/templates/prism.css";

import "./src/templates/prism.css";
import { render } from "react-dom";
import { loadableReady } from "@loadable/component";

export function replaceHydrateFunction() {
  return (element, container, callback) => {
    loadableReady(() => {
      render(element, container, callback);
    });
  };
}
