/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import React from "react";
import { render } from "@testing-library/react";
import { InstantSearch, InstantSearchProps, useSearchBox } from "react-instantsearch";
import { createSearchClient, INDEX_NAME } from "./searchClient.ts";

// Mounts the search box widget without UI, so the initial query is applied and a search is sent
const VirtualSearchBox = () => {
  useSearchBox();
  return null;
};

/** Renders inside a real InstantSearch backed by the fake Algolia client */
export function renderWithSearch(ui: React.ReactNode, client: ReturnType<typeof createSearchClient>, query = "java") {
  return render(
    <InstantSearch
      indexName={INDEX_NAME}
      searchClient={client as unknown as InstantSearchProps["searchClient"]}
      initialUiState={{ [INDEX_NAME]: { query } }}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <VirtualSearchBox />
      {ui}
    </InstantSearch>
  );
}
