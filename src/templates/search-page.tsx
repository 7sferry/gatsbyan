/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import Layout from "../components/Layout.tsx";
import React from "react";
import algoliasearch, { SearchClient } from "algoliasearch/lite";
import { Configure, InstantSearch, SearchBox } from "react-instantsearch";
import Seo from "../components/Seo.tsx";
import { MultipleQueriesQuery } from "@algolia/client-search";
import { SEARCH_COUNT } from "../utils/GatsbyanUtils.tsx";
import VoiceSearchElement from "../components/search/VoiceSearchElement.tsx";
import PaginationSearchResult from "../components/search/PaginationSearchResult.tsx";

const SearchPage = () => {
  const algoliaClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID ?? "",
    process.env.GATSBY_ALGOLIA_SEARCH_KEY ?? ""
  );

  const searchClient: SearchClient = {
    ...algoliaClient,
    search(queries: readonly MultipleQueriesQuery[]): Readonly<Promise<any>> {
      if (queries.every(({ params }: any) => !params.query)) {
        return Promise.resolve({
          results: queries.map(() => ({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            processingTimeMS: 0,
          })),
        });
      }
      return algoliaClient.search(queries);
    },
  };

  return (
    <Layout>
      <div className="post-main">
        <InstantSearch
          future={{
            preserveSharedStateOnUnmount: true,
          }}
          indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME ?? ""}
          searchClient={searchClient}
        >
          <Configure
            highlightPreTag={"<ais-highlight-0000000000>"}
            highlightPostTag={"</ais-highlight-0000000000>"}
            distinct
            hitsPerPage={SEARCH_COUNT}
          />
          <VoiceSearchElement searchAsYouSpeak={false} />
          <SearchBox className={"search-box"} searchAsYouType={false} />
          <PaginationSearchResult />
        </InstantSearch>
      </div>
    </Layout>
  );
};

export default SearchPage;

export function Head({ location }: any) {
  return <Seo title={"Search"} path={location?.pathname} />;
}
