/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import Layout from "../components/Layout.tsx";
import React from "react";
import { algoliasearch } from "algoliasearch";
import { Configure, InstantSearch, SearchBox } from "react-instantsearch";
import Seo from "../components/Seo.tsx";
import { SearchClient } from "algoliasearch-helper/types/algoliasearch";
import { HeadProps, Slice } from "gatsby";
import { SEARCH_COUNT } from "../utils/GatsbyanUtils.tsx";

const SearchPage = () => {
  const algoliaClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID ?? "",
    process.env.GATSBY_ALGOLIA_SEARCH_KEY ?? ""
  );

  const searchClient: SearchClient = {
    search(queries): Promise<any> {
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
          advancedSyntax={true}
          advancedSyntaxFeatures={["exactPhrase", "excludeWords"]}
        />
        <Slice alias="VoiceSearchElement" searchAsYouSpeak={false} />
        <SearchBox className={"search-box"} searchAsYouType={false} />
        <Slice alias="SearchHitsResult" />
        <Slice alias="PaginationSearchResult" />
      </InstantSearch>
    </Layout>
  );
};

export default SearchPage;

export function Head({ location }: HeadProps) {
  return <Seo title={"Search"} path={location?.pathname} />;
}
