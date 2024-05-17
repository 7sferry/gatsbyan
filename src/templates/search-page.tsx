/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import algoliasearch from "algoliasearch/lite";
import { Configure, InstantSearch, SearchBox } from "react-instantsearch";
import { SEARCH_COUNT } from "../utils/GatsbyanUtils.tsx";
import { SearchClient } from "algoliasearch-helper/types/algoliasearch";
import { MultipleQueriesQuery } from "@algolia/client-search";
import { HeadProps, Slice } from "gatsby";
import Seo from "../components/Seo.tsx";
import Layout from "../components/Layout.tsx";

const SearchPage = () => {
  const algoliaClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID ?? "",
    process.env.GATSBY_ALGOLIA_SEARCH_KEY ?? ""
  );

  const searchClient: SearchClient = {
    search(queries: readonly MultipleQueriesQuery[]): Promise<any> {
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
          {/*<VoiceSearchElement searchAsYouSpeak={false} />*/}
          <Slice alias="Comment" searchAsYouSpeak={false} />
          <SearchBox className={"search-box"} searchAsYouType={false} />
          {/*<PaginationSearchResult />*/}
          <Slice alias="Comment" />
        </InstantSearch>
      </div>
    </Layout>
  );
};

export default SearchPage;

export function Head({ location }: HeadProps) {
  return <Seo title={"Search"} path={location?.pathname} />;
}
