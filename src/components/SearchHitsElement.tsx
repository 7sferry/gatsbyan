/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { useInstantSearch } from "react-instantsearch";
import type { HighlightResult } from "algoliasearch-helper/types/algoliasearch";
import { AlgoliaNodeResult } from "../types/DataTypes.ts";
import { SearchResultsApi } from "react-instantsearch-core/dist/es/lib/useSearchResults";

const SearchHitsElement = (): React.JSX.Element => {
  const { results }: SearchResultsApi = useInstantSearch();

  let hits = results.hits;
  if (hits.length <= 0) {
    return <p>There were no results yet.</p>;
  }

  return (
    <div>
      {hits.map((hit) => {
        const highlightResult: HighlightResult<AlgoliaNodeResult> = hit._highlightResult;
        const title = highlightResult?.title?.value ?? "";
        let html = getHtml(highlightResult, results.query);
        return (
          <div key={hit.objectID} className="search-result-container">
            <div className="title">
              <Link className="text-link" to={`/blog/${hit.slug}`}>
                <h3 dangerouslySetInnerHTML={{ __html: title }} />
              </Link>
            </div>
            <div className="ellipsis">
              <p dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const getStartIndex = (excerpt: string) => {
  const matchedIndex = excerpt?.indexOf("<ais-highlight-0000000000");
  const lastHundredCharIndex = matchedIndex - LIMIT_CHAR;
  if (lastHundredCharIndex < 0) {
    return lastHundredCharIndex;
  }
  if (excerpt.length - lastHundredCharIndex > LIMIT_CHAR_ALTERNATE) {
    return excerpt?.indexOf(" ", lastHundredCharIndex) + 1;
  }
  return excerpt?.indexOf(" ", matchedIndex - LIMIT_CHAR_ALTERNATE) + 1;
};

const getHtml = (highlightResult: HighlightResult<AlgoliaNodeResult>, query: string) => {
  const excerpt = highlightResult?.excerpt?.value?.trim() ?? "";
  const matchedStartIndex = getStartIndex(excerpt);
  if (matchedStartIndex < 0) {
    return reconstructExcerpt(excerpt, query);
  }
  return excerpt?.substring(matchedStartIndex);
};

const reconstructExcerpt = (excerpt: string, query: string) => {
  const newExcerpt = excerpt.replaceAll(query, `<ais-highlight-0000000000>${query}</ais-highlight-0000000000>`);
  const matchedIndex = getStartIndex(newExcerpt);
  return newExcerpt.substring(matchedIndex);
};

const LIMIT_CHAR = 100;

const LIMIT_CHAR_ALTERNATE = 3 * LIMIT_CHAR;

export default SearchHitsElement;
