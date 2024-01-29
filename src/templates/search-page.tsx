/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import Layout from "../components/Layout.tsx";
import React from "react";
import algoliasearch, { SearchClient } from "algoliasearch/lite";
import { connectPagination } from "instantsearch.js/es/connectors";
import { Configure, InstantSearch, SearchBox, useConnector } from "react-instantsearch";
import Seo from "../components/Seo.tsx";
import { MultipleQueriesQuery } from "@algolia/client-search";
import { PaginationElement } from "../components/PaginationElement.tsx";
import {
  PaginationConnectorParams,
  PaginationRenderState,
  PaginationWidgetDescription,
} from "instantsearch.js/es/connectors/pagination/connectPagination";
import SearchHitsElement from "../components/SearchHitsElement.tsx";
import { SEARCH_COUNT } from "../utils/GatsbyanUtils.tsx";

const SearchPage = () => {
  const algoliaClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID ?? "",
    process.env.GATSBY_ALGOLIA_SEARCH_KEY ?? ""
  );
  const chrome = typeof window !== "undefined" ? !!window.chrome : null;

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

  const usePagination = (props: PaginationConnectorParams, additionalWidgetProperties: any): PaginationRenderState =>
    useConnector<PaginationConnectorParams, PaginationWidgetDescription>(
      connectPagination,
      props,
      additionalWidgetProperties
    );

  const PaginationSearchResult = (props: PaginationConnectorParams): React.JSX.Element => {
    let pagination: PaginationRenderState = usePagination(props, {});
    if (pagination.nbPages <= 0) {
      return <></>;
    }

    return (
      <>
        <SearchHitsElement />
        <PaginationElement
          totalPageCount={pagination.nbPages}
          currentPage={pagination.currentRefinement}
          url={"/search"}
          refine={pagination.refine}
        />
      </>
    );
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
          {/*{chrome ? <VoiceSearch searchAsYouSpeak={false} /> : <></>}*/}
          <SearchBox className={"search-box"} searchAsYouType={false} />
          <PaginationSearchResult />
        </InstantSearch>
      </div>
    </Layout>
  );
};

declare namespace window {
  let chrome: any;
}

export default SearchPage;

export function Head({ location }: any) {
  return <Seo title={"Search"} path={location?.pathname} />;
}
