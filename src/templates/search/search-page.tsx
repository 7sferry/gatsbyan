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
import { SEARCH_COUNT } from "../../utils/GatsbyanUtils";
import Seo from "../../components/Seo";

class SearchPage extends React.Component<{}, {}> {
  render() {
    const algoliaClient = algoliasearch(
      process.env.GATSBY_ALGOLIA_APP_ID ?? "",
      process.env.GATSBY_ALGOLIA_SEARCH_KEY ?? ""
    );
    const chrome = typeof window !== "undefined" ? !!window.chrome : null;
    console.log("hihi " + chrome);
    console.log("huhu " + !process.env.PREVIEW_TOKEN);

    const searchClient = {
      search(requests: any) {
        if (requests.every(({ params }: any) => !params.query)) {
          return Promise.resolve({
            results: requests.map(() => ({
              hits: null,
              nbHits: 0,
              nbPages: 0,
              processingTimeMS: 0
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
        <div className="post-main">
          <InstantSearch indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME ?? ""} searchClient={searchClient}>
            <Configure distinct hitsPerPage={SEARCH_COUNT} />
            {chrome ? <VoiceSearch searchAsYouSpeak={false} /> : <></>}
            <SearchBox className={"search-box"} searchAsYouType={false} />
            <SearchResult />
          </InstantSearch>
        </div>
      </Layout>
    );
  }
}

declare namespace window {
  let chrome: any;
}

export default SearchPage;

export function Head({ location }: any) {
  return <Seo title={"Search"} path={location?.pathname} />;
}
