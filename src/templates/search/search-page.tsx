/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import Layout from "../../components/Layout";
import React from "react";
import algoliasearch, { SearchClient } from "algoliasearch/lite";
import { connectPagination } from "instantsearch.js/es/connectors";
import { Configure, Hits, InstantSearch, SearchBox, useConnector } from "react-instantsearch";
import Seo from "../../components/Seo";
import { MultipleQueriesQuery } from "@algolia/client-search";
import Pagination from "../../components/Pagination.tsx";
import {
  PaginationConnectorParams,
  PaginationRenderState,
  PaginationWidgetDescription,
} from "instantsearch.js/es/connectors/pagination/connectPagination";
import HitsElement from "./hits-element.tsx";

function SearchPage() {
  const algoliaClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID ?? "",
    process.env.GATSBY_ALGOLIA_SEARCH_KEY ?? ""
  );
  const chrome = typeof window !== "undefined" ? !!window.chrome : null;

  const searchClient: SearchClient = {
    ...algoliaClient,
    search(queries: readonly MultipleQueriesQuery[]): Readonly<Promise<any>> {
      console.log("masuk " + JSON.stringify(queries));
      if (queries.every(({ params }: any) => !params.query)) {
        console.log("masuk lagi " + JSON.stringify(queries));
        return Promise.resolve({
          results: queries.map(() => ({
            hits: "lululu",
            nbHits: 0,
            nbPages: 0,
            processingTimeMS: 0,
          })),
        });
      }
      return algoliaClient.search(queries);
    },
  };

  function usePagination(props: PaginationConnectorParams, additionalWidgetProperties: any): PaginationRenderState {
    return useConnector<PaginationConnectorParams, PaginationWidgetDescription>(
      connectPagination,
      props,
      additionalWidgetProperties
    );
  }

  function PaginationSearchResult(props: PaginationConnectorParams) {
    let pagination: PaginationRenderState = usePagination(props, {});
    console.log("pag " + JSON.stringify(pagination));
    console.log("props " + JSON.stringify(props));

    return (
      <>
        <Hits hitComponent={HitsElement} />
        <Pagination
          totalPageCount={pagination.nbPages}
          currentPage={pagination.currentRefinement}
          url={"/search"}
          refine={pagination.refine}
        />
      </>
    );
  }

  return (
    <Layout>
      <div className="post-main">
        <InstantSearch
          initialUiState={{}}
          indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME ?? ""}
          searchClient={searchClient}
        >
          <Configure distinct hitsPerPage={2} />
          {/*{chrome ? <VoiceSearch searchAsYouSpeak={false} /> : <></>}*/}
          <SearchBox className={"search-box"} searchAsYouType={false} />
          <PaginationSearchResult />
        </InstantSearch>
      </div>
    </Layout>
  );
}

declare namespace window {
  let chrome: any;
}

export default SearchPage;

export function Head({ location }: any) {
  return <Seo title={"Search"} path={location?.pathname} />;
}
