/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import Layout from "../../components/Layout";
import React from "react";
import algoliasearch from "algoliasearch/lite";
import Hits from "./hits";
import { Configure, connectPagination, InstantSearch, SearchBox, VoiceSearch } from "react-instantsearch-dom";
import Pagination from "../../components/Pagination";
import Seo from "../../components/Seo";
import { SEARCH_COUNT } from "../../utils/GatsbyanUtils";

class SearchPage extends React.Component {
  render() {
    const algoliaClient = algoliasearch(process.env.GATSBY_ALGOLIA_APP_ID, process.env.GATSBY_ALGOLIA_SEARCH_KEY);
    const chrome = typeof window !== "undefined" ? !!window.chrome : undefined;

    const searchClient = {
      search(requests) {
        if (requests.every(({ params }) => !params.query)) {
          return Promise.resolve({
            results: requests.map(() => ({
              hits: null,
              nbHits: 0,
              nbPages: 0,
              processingTimeMS: 0,
            })),
          });
        }
        return algoliaClient.search(requests);
      },
    };

    const SearchResult = connectPagination(({ currentRefinement, nbPages, refine }) => {
      const url = "/search";

      return (
        <>
          <Hits />
          <Pagination totalPageCount={nbPages} currentPage={currentRefinement} url={url} refine={refine} />
        </>
      );
    });

    return (
      <Layout>
        <Seo title={"Search Page"} description={"Search Engine to search something Powered By Algolia"} lang={"en"} />
        <div className="post-main">
          <InstantSearch indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME} searchClient={searchClient}>
            <Configure distinct hitsPerPage={SEARCH_COUNT} />
            {chrome ? <VoiceSearch searchAsYouSpeak={false} /> : <></>}
            <SearchBox isSearchStalled={true} className={"search-box"} searchAsYouType={false} />
            <SearchResult />
          </InstantSearch>
        </div>
      </Layout>
    );
  }
}

export default SearchPage;
