/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Registered in its own preload so the DOM exists before Testing Library is imported.
// External scripts and stylesheets (e.g. utterances) are never fetched.
GlobalRegistrator.register({
  url: "http://localhost/",
  settings: {
    disableJavaScriptFileLoading: true,
    disableJavaScriptEvaluation: true,
    disableCSSFileLoading: true,
    handleDisabledFileLoadingAsSuccess: true,
  },
});
