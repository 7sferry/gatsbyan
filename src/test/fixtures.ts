/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { spyOn } from "bun:test";

export const ART_DIRECTION_MEDIA = ["(max-width: 416px)", "(max-width: 1024px)", "(max-width: 1360px)"];

/** Image data in the shape the gatsby-plugin-image stand-in renders: `src` becomes the img src */
export const createImages = (name: string) => ({
  original: { src: `/${name}-original.jpg` },
  phone: { src: `/${name}-phone.jpg` },
  ipad: { src: `/${name}-ipad.jpg` },
  laptop: { src: `/${name}-laptop.jpg` },
});

export const expectedArtDirection = (name: string) => {
  const images = createImages(name);
  return {
    ...images.original,
    artDirected: [
      { media: ART_DIRECTION_MEDIA[0], image: images.phone },
      { media: ART_DIRECTION_MEDIA[1], image: images.ipad },
      { media: ART_DIRECTION_MEDIA[2], image: images.laptop },
    ],
  };
};

type TrendingNode = { path: string; value: number };

/** A fetch implementation answering like `/api/trending` */
export const trendingApi = (nodes: TrendingNode[], status = 200) =>
  (async () => new Response(JSON.stringify({ nodes }), { status })) as unknown as typeof fetch;

/** Replaces fetch for `/api/trending`; call `mockRestore()` on the result when done */
export function mockTrendingApi(nodes: TrendingNode[], status = 200) {
  return spyOn(globalThis, "fetch").mockImplementation(trendingApi(nodes, status));
}
