/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

const WEB_PROTOCOLS = ["http:", "https:"];

export const isExternalLink = (anchor: HTMLAnchorElement) =>
  WEB_PROTOCOLS.includes(anchor.protocol) && anchor.origin !== window.location.origin;

export const openExternalLinkInNewTab = (event: Event) => {
  if (!(event.target instanceof Element)) {
    return;
  }
  const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
  if (!anchor || anchor.hasAttribute("target") || !isExternalLink(anchor)) {
    return;
  }
  anchor.target = "_blank";
  anchor.relList.add("noopener", "noreferrer");
};

export const ExternalLinks = () => {
  document.addEventListener("click", openExternalLinkInNewTab);
};
