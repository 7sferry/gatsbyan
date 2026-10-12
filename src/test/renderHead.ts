/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

/** Renders a Gatsby Head export the way it ends up in the page head */
export function renderHead(element: React.ReactElement) {
  const markup = renderToStaticMarkup(element);
  const head = document.createElement("div");
  head.innerHTML = markup;

  const meta = (key: string) =>
    head.querySelector(`meta[name="${key}"], meta[property="${key}"]`)?.getAttribute("content") ?? null;

  return {
    markup,
    title: head.querySelector("title")?.textContent ?? null,
    canonical: head.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    schema: JSON.parse(head.querySelector('script[type="application/ld+json"]')?.innerHTML ?? "null"),
    meta,
  };
}
