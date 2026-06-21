/************************
 * Made by [MR Ferry™]  *
 * on Juni 2026         *
 ************************/

let initialized = false;
let overlayEl: HTMLDivElement | null = null;
let viewerEl: HTMLDivElement | null = null;
let imgEl: HTMLImageElement | null = null;
let startScrollY = 0;
let scrollHandler: ((this: Window, ev: Event) => any) | null = null;

const IMAGE_SELECTOR = ".gatsby-resp-image-image, .heroImage img, .index-thumbnail img";

export const ImageZoom = () => {
  if (typeof document === "undefined") {
    return;
  }

  injectStyles();

  if (initialized) {
    return;
  }
  initialized = true;

  document.addEventListener("click", handleDocumentClick, true);
  document.addEventListener("keydown", handleKeyDown);
};

function injectStyles() {
  if (document.getElementById("gatsby-image-fullwidth-zoom-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "gatsby-image-fullwidth-zoom-styles";
  style.textContent = `
    .gatsby-image-fullwidth-lock #___gatsby {
      filter: blur(10px);
      transition-delay: 0.1s;
    }
    
    .gatsby-image-fullwidth-overlay {
      position: fixed;
      inset: 0;
      background: none;
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .gatsby-image-fullwidth-overlay.is-open {
      opacity: 1;
      pointer-events: auto;
    }
    
    ${IMAGE_SELECTOR} {
      cursor: zoom-in;
      transition:
        transform 1000ms cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 1000ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .gatsby-image-fullwidth-img.is-open {
      transform: scale(1);
      opacity: 1;
    }

    .gatsby-image-fullwidth-viewer {
      width: 100%;
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      box-sizing: border-box;
    }

    .gatsby-image-fullwidth-img {
      display: block;
      max-width: 100vw;
      height: auto;
      max-height: 90vh;
      margin: 0;
      cursor: zoom-out;
      transform: scale(0.1);
      opacity: 0.1;
      transition:
        transform 1000ms cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 1000ms cubic-bezier(0.2, 0.8, 0.2, 1);
      will-change: transform, opacity;
    }

  `;
  document.head.appendChild(style);
}

function cleanup() {
  overlayEl?.remove();
  viewerEl?.remove();
  imgEl?.remove();

  overlayEl = null;
  viewerEl = null;
  imgEl = null;

  document.body.classList.remove("gatsby-image-fullwidth-lock");
}

function closeZoom() {
  if (!overlayEl) return;

  overlayEl.classList.remove("is-open");
  imgEl?.classList.remove("is-open");
  document.body.classList.remove("gatsby-image-fullwidth-lock");
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
    scrollHandler = null;
  }

  window.setTimeout(() => {
    cleanup();
  }, 220);
}

function handleScrollToClose() {
  startScrollY = window.scrollY;

  scrollHandler = () => {
    if (Math.abs(window.scrollY - startScrollY) > 300) {
      closeZoom();
    }
  };

  window.addEventListener("scroll", scrollHandler, { passive: true });
}

function openZoom(sourceImg: HTMLImageElement) {
  if (document.querySelector(".gatsby-image-fullwidth-overlay")) {
    return;
  }
  cleanup();

  overlayEl = document.createElement("div");
  overlayEl.className = "gatsby-image-fullwidth-overlay";
  overlayEl.addEventListener("click", closeZoom);

  viewerEl = document.createElement("div");
  viewerEl.className = "gatsby-image-fullwidth-viewer";

  imgEl = document.createElement("img");
  imgEl.className = "gatsby-image-fullwidth-img";
  imgEl.src = sourceImg.src;
  imgEl.alt = sourceImg.alt || "";
  imgEl.title = sourceImg.title || "";
  imgEl.decoding = "async";
  imgEl.classList.remove("is-open");

  viewerEl.appendChild(imgEl);
  overlayEl.appendChild(viewerEl);

  document.body.appendChild(overlayEl);
  document.body.classList.add("gatsby-image-fullwidth-lock");

  window.requestAnimationFrame(() => {
    overlayEl?.classList.add("is-open");
    imgEl?.classList.add("is-open");
  });

  handleScrollToClose();
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null;
  if (!target) return;

  const img = target.closest(IMAGE_SELECTOR) as HTMLImageElement | null;
  if (!img) return;

  event.preventDefault();
  openZoom(img);
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeZoom();
  }
}
