/************************
 * Made by [MR Ferry™]  *
 * on Januari 2024      *
 ************************/
import {
  PaginationConnectorParams,
  PaginationRenderState,
  PaginationWidgetDescription,
} from "instantsearch.js/es/connectors/pagination/connectPagination";
import { useConnector } from "react-instantsearch";
import { connectPagination } from "instantsearch.js/es/connectors";
import React from "react";
import SearchHitsResult from "./SearchHitsResult.tsx";
import PaginationSearch from "./PaginationSearch.tsx";

const usePagination = (props: PaginationConnectorParams, additionalWidgetProperties: any): PaginationRenderState =>
  useConnector<PaginationConnectorParams, PaginationWidgetDescription>(
    connectPagination,
    props,
    additionalWidgetProperties
  );

const PaginationSearchResult = (props: PaginationConnectorParams): React.JSX.Element => {
  let pagination: PaginationRenderState = usePagination(props, {});

  return (
    <>
      <SearchHitsResult />
      {pagination.canRefine && (
        <PaginationSearch
          totalPageCount={pagination.nbPages}
          currentPage={pagination.currentRefinement + 1}
          url={"/search"}
          refine={pagination.refine}
        />
      )}
    </>
  );
};

export default PaginationSearchResult;
