/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import Sidebar from "../../components/sidebar/Sidebar";
import React from "react";
import algoliasearch from "algoliasearch/lite";
import Hits from "./hits";
import { InstantSearch, SearchBox, VoiceSearch, Configure, connectPagination } from "react-instantsearch-dom";
import Pagination from "../../components/Pagination";

class SearchPage extends React.Component {
  render() {
    const algoliaClient = algoliasearch(process.env.GATSBY_ALGOLIA_APP_ID, process.env.GATSBY_ALGOLIA_SEARCH_KEY);

    const chrome =
      typeof window !== "undefined"
        ? !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
        : undefined;

    const searchClient = {
      search(requests) {
        if (requests.every(({ params }) => !params.query)) {
          return Promise.resolve({
            results: requests.map(() => ({
              hits: [],
              nbHits: 0,
              nbPages: 0,
              processingTimeMS: 0,
            })),
          });
        }
        return algoliaClient.search(requests);
      },
    };

    const Paging = connectPagination(({ createURL, currentRefinement, nbPages, refine }) => {
      const url = "/search";

      return <Pagination totalPageCount={nbPages} currentPage={currentRefinement} url={url} refine={refine} />;
    });

    return (
      <Layout>
        <SEO title="Pencarian" keywords={[`gatsby`, `javascript`, `react`, `web development`, `blog`, `graphql`]} />
        <div className="index-main">
          <div className="sidebar border-right px-4 py-2">
            <Sidebar />
          </div>
          <div className="post-list-main">
            <InstantSearch indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME} searchClient={searchClient}>
              <Configure hitsPerPage={1} />
              {chrome ? <VoiceSearch searchAsYouSpeak={false} /> : <></>}
              <SearchBox className={"search-box"} showLoadingIndicator={true} searchAsYouType={false} />
              <Paging />
              <Hits />
            </InstantSearch>
          </div>
          <div className="sidebar px-4 py-2">{/*<Sidebar />*/}</div>
        </div>
      </Layout>
    );
  }
}

export default SearchPage;
