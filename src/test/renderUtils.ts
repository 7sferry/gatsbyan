/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

export interface RenderedLink {
  readonly text: string;
  readonly href: string;
  readonly disabled: boolean;
  readonly className: string;
}

export function getLinks(html: string): RenderedLink[] {
  return Array.from(html.matchAll(/<a href="([^"]*)"([^>]*)>([^<]*)<\/a>/g), ([, href, attributes, text]) => ({
    text,
    href,
    disabled: /\sdisabled=""/.test(attributes),
    className: /class="([^"]*)"/.exec(attributes)?.[1] ?? "",
  }));
}

export function getText(html: string): string {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.textContent ?? "";
}

export function getParagraphs(html: string): string[] {
  return Array.from(html.matchAll(/<p>([\s\S]*?)<\/p>/g), ([, text]) => text.replace(/\s+/g, " ").trim());
}
