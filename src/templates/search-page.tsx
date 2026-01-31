/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import Layout from "../components/Layout.tsx";
import React from "react";
import { algoliasearch } from "algoliasearch";
import { Configure, InstantSearch, SearchBox } from "react-instantsearch";
import { SearchClient } from "algoliasearch-helper/types/algoliasearch";
import { Slice } from "gatsby";
import { SEARCH_COUNT } from "../utils/GatsbyanUtils.tsx";
import Seo, { SEO_CONSTANTS, useSeo } from "../components/Seo";
import { LocationProp, SeoData } from "../types/DataTypes";

const SearchPage = ({ location }: LocationProp) => {
  const seo: SeoData = useSeo({
    title: "Search",
    path: location?.pathname,
  });

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
      <link rel="canonical" href={seo.metaUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seo.schemaDataJson }} />
      <title>{`${seo.title} `}</title>
      <meta name="description" content={seo.metaDescription} />
      <meta name="og:title" content={seo.title} />
      <meta name="og:description" content={seo.metaDescription} />
      <meta name="og:type" content={SEO_CONSTANTS.OG_TYPE} />
      <meta name="og:site_name" content={SEO_CONSTANTS.OG_SITE_NAME} />
      <meta name="og:url" content={seo.metaUrl} />
      <meta name="og:image" content={seo.metaImageLarge} />
      <meta name="og:image:type" content={SEO_CONSTANTS.OG_IMAGE_TYPE} />
      <meta name="og:image:width" content={SEO_CONSTANTS.OG_IMAGE_WIDTH} />
      <meta name="og:image:height" content={SEO_CONSTANTS.OG_IMAGE_HEIGHT} />
      <meta name="twitter:card" content={SEO_CONSTANTS.TWITTER_CARD} />
      <meta name="twitter:creator" content={seo.metadata.author} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:image" content={seo.metaImage} />
      <meta name="twitter:description" content={seo.metaDescription} />
      <meta name="fb:app_id" content={SEO_CONSTANTS.FB_APP_ID} />
      <meta name="google-site-verification" content={SEO_CONSTANTS.GOOGLE_SITE_VERIFICATION} />
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

export function Head() {
  return <Seo />;
}
