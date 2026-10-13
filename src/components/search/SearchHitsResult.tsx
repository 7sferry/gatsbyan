/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { useInstantSearch } from "react-instantsearch";
import type { HighlightResult } from "algoliasearch-helper/types/algoliasearch";
import { AlgoliaNodeResult } from "../../types/DataTypes.ts";
import { SearchResultsApi } from "react-instantsearch-core/dist/es/lib/useSearchResults";

const SearchHitsResult = (): React.JSX.Element => {
  const { results }: SearchResultsApi = useInstantSearch();
  if (!results.query) {
    return <></>;
  }

  let hits = results.hits;
  if (hits.length <= 0) {
    return <p>There were no results yet.</p>;
  }

  const highlightPattern = getHighlightPattern(
    hits.map((hit) => hit._highlightResult as HighlightResult<AlgoliaNodeResult>),
    results.query
  );

  return (
    <div>
      {hits.map((hit) => {
        const highlightResult: HighlightResult<AlgoliaNodeResult> = hit._highlightResult;
        const title = highlightMissing(highlightResult?.title?.value ?? "", highlightPattern);
        let html = getHtml(highlightResult, highlightPattern);
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
  const matchedIndex = excerpt?.indexOf(`<${HIGHLIGHT_TAG}`);
  const lastHundredCharIndex = matchedIndex - LIMIT_CHAR;
  if (lastHundredCharIndex < 0) {
    return lastHundredCharIndex;
  }
  if (excerpt.length - lastHundredCharIndex > LIMIT_CHAR_ALTERNATE) {
    return excerpt?.indexOf(" ", lastHundredCharIndex) + 1;
  }
  return excerpt?.indexOf(" ", matchedIndex - LIMIT_CHAR_ALTERNATE) + 1;
};

const getHtml = (highlightResult: HighlightResult<AlgoliaNodeResult>, highlightPattern: RegExp | null) => {
  const excerpt = highlightMissing(highlightResult?.excerpt?.value?.trim() ?? "", highlightPattern);
  return excerpt.substring(Math.max(getStartIndex(excerpt), 0));
};

/** Matches the query and every word Algolia highlighted in the given results, longest first, ignoring case */
const getHighlightPattern = (highlightResults: HighlightResult<AlgoliaNodeResult>[], query: string) => {
  const words = new Map<string, string>();
  const addWord = (word: string) => {
    if (word.trim()) {
      words.set(word.toLowerCase(), word);
    }
  };
  addWord(query);
  highlightResults.forEach((highlightResult) =>
    [highlightResult?.title?.value, highlightResult?.excerpt?.value].forEach((value) => {
      for (const [, word] of value?.matchAll(HIGHLIGHTED_WORD) ?? []) {
        addWord(word);
      }
    })
  );
  if (words.size === 0) {
    return null;
  }
  const alternatives = Array.from(words.values())
    .sort((a, b) => b.length - a.length)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(alternatives.join("|"), "gi");
};

/** Wraps the matches of the pattern in highlight tags, skipping what is already highlighted and HTML entities */
const highlightMissing = (value: string, highlightPattern: RegExp | null) => {
  if (!highlightPattern) {
    return value;
  }
  return value
    .split(PROTECTED_SEGMENT)
    .map((segment, index) =>
      // split with a capturing group puts the protected segments at the odd indexes
      index % 2 === 1
        ? segment
        : segment.replace(highlightPattern, (match) => `<${HIGHLIGHT_TAG}>${match}</${HIGHLIGHT_TAG}>`)
    )
    .join("");
};

const HIGHLIGHT_TAG = "ais-highlight-0000000000";

const HIGHLIGHTED_WORD = new RegExp(`<${HIGHLIGHT_TAG}>([\\s\\S]*?)</${HIGHLIGHT_TAG}>`, "g");

const PROTECTED_SEGMENT = new RegExp(`(<${HIGHLIGHT_TAG}>[\\s\\S]*?</${HIGHLIGHT_TAG}>|&#?\\w+;)`);

const LIMIT_CHAR = 100;

const LIMIT_CHAR_ALTERNATE = 3 * LIMIT_CHAR;

export default SearchHitsResult;
