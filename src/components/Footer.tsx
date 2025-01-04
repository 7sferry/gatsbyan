/************************
 * Made by [MR Ferry™]  *
 * on Januari 2025      *
 ************************/

import SiteMetadata from "../utils/SiteMetadata.tsx";
import React from "react";

export function Footer() {
  const { siteMetadata: metadata } = SiteMetadata();
  return (
    <footer className="text-center">
      <div className="my-emoji mb-2">{metadata.copyright}</div>
    </footer>
  );
}
