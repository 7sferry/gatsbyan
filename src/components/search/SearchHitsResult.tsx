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
  const queryWords = getQueryWords(results.query);

  return (
    <div>
      {hits.map((hit) => {
        const highlightResult: HighlightResult<AlgoliaNodeResult> = hit._highlightResult;
        let title = highlightMissing(highlightResult?.title?.value ?? "", highlightPattern);
        let excerpt = highlightMissing(highlightResult?.excerpt?.value?.trim() ?? "", highlightPattern);
        if (!title.includes(`<${HIGHLIGHT_TAG}>`) && !excerpt.includes(`<${HIGHLIGHT_TAG}>`)) {
          title = highlightTypos(title, queryWords);
          excerpt = highlightTypos(excerpt, queryWords);
        }
        const html = excerpt.substring(Math.max(getStartIndex(excerpt), 0));
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
  return highlightUnprotected(value, (segment) => segment.replace(highlightPattern, wrapHighlight));
};

const highlightTypos = (value: string, queryWords: string[]) =>
  highlightUnprotected(value, (segment) =>
    segment.replace(WORD, (word) =>
      queryWords.some((queryWord) => isTypo(word.toLowerCase(), queryWord)) ? wrapHighlight(word) : word
    )
  );

const highlightUnprotected = (value: string, highlight: (segment: string) => string) =>
  value
    .split(PROTECTED_SEGMENT)
    // split with a capturing group puts the protected segments at the odd indexes
    .map((segment, index) => (index % 2 === 1 ? segment : highlight(segment)))
    .join("");

const wrapHighlight = (match: string) => `<${HIGHLIGHT_TAG}>${match}</${HIGHLIGHT_TAG}>`;

const getQueryWords = (query: string) =>
  query
    .split(/\s+/)
    .filter((word) => !word.startsWith("-"))
    .flatMap((word) => word.toLowerCase().match(WORD) ?? []);

const isTypo = (word: string, queryWord: string) => {
  const allowedTypos =
    queryWord.length >= MIN_WORD_SIZE_FOR_2_TYPOS ? 2 : queryWord.length >= MIN_WORD_SIZE_FOR_1_TYPO ? 1 : 0;
  return Math.min(getTypos(word, queryWord), getTypos(word.substring(0, queryWord.length), queryWord)) <= allowedTypos;
};

const getTypos = (word: string, other: string) => {
  const typos = Array.from({ length: word.length + 1 }, (_, i) =>
    Array.from({ length: other.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= word.length; i++) {
    for (let j = 1; j <= other.length; j++) {
      typos[i][j] = Math.min(
        typos[i - 1][j] + 1,
        typos[i][j - 1] + 1,
        typos[i - 1][j - 1] + (word[i - 1] === other[j - 1] ? 0 : 1)
      );
      if (i > 1 && j > 1 && word[i - 1] === other[j - 2] && word[i - 2] === other[j - 1]) {
        typos[i][j] = Math.min(typos[i][j], typos[i - 2][j - 2] + 1);
      }
    }
  }
  return typos[word.length][other.length];
};

const HIGHLIGHT_TAG = "ais-highlight-0000000000";

const HIGHLIGHTED_WORD = new RegExp(`<${HIGHLIGHT_TAG}>([\\s\\S]*?)</${HIGHLIGHT_TAG}>`, "g");

const PROTECTED_SEGMENT = new RegExp(`(<${HIGHLIGHT_TAG}>[\\s\\S]*?</${HIGHLIGHT_TAG}>|&#?\\w+;)`);

const WORD = /[\p{L}\p{N}]+/gu;

const MIN_WORD_SIZE_FOR_1_TYPO = 4;

const MIN_WORD_SIZE_FOR_2_TYPOS = 8;

const LIMIT_CHAR = 100;

const LIMIT_CHAR_ALTERNATE = 3 * LIMIT_CHAR;

export default SearchHitsResult;
