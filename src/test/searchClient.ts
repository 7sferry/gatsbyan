/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { mock } from "bun:test";

export const INDEX_NAME = "blog";

export interface SearchRequest {
  readonly indexName: string;
  readonly params: { readonly query?: string; readonly page?: number; readonly [key: string]: unknown };
}

export interface FakeHit {
  readonly objectID: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
}

export const createHit = (slug: string, title: string, excerpt: string): FakeHit => ({
  objectID: slug,
  slug,
  title,
  excerpt,
});

/** Highlights every occurrence of the query, like Algolia does with the search page highlight tags */
export const highlight = (text: string, query: string) =>
  text.replaceAll(query, `<ais-highlight-0000000000>${query}</ais-highlight-0000000000>`);

/**
 * Stands in for the Algolia client: answers every request with the given hits,
 * highlighted for the request query, and with `nbPages` pages.
 */
export function createSearchClient(hits: FakeHit[] = [], nbPages = 1) {
  const search = mock(async (requests: SearchRequest[]) => ({
    results: requests.map(({ indexName, params }) => {
      const query = params.query ?? "";
      return {
        index: indexName,
        query,
        params: "",
        page: params.page ?? 0,
        hitsPerPage: hits.length || 1,
        nbHits: hits.length * nbPages,
        nbPages,
        processingTimeMS: 0,
        exhaustiveNbHits: true,
        hits: hits.map((hit) => ({
          ...hit,
          _highlightResult: {
            title: { value: highlight(hit.title, query), matchLevel: "full", matchedWords: [query] },
            excerpt: { value: highlight(hit.excerpt, query), matchLevel: "full", matchedWords: [query] },
          },
        })),
      };
    }),
  }));
  return { search };
}

export const lastQuery = (client: ReturnType<typeof createSearchClient>) =>
  client.search.mock.lastCall?.[0]?.[0]?.params;
