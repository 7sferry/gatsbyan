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
import PaginationElement from "../PaginationElement.tsx";

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
      <SearchHitsResult />
      <PaginationElement
        totalPageCount={pagination.nbPages}
        currentPage={pagination.currentRefinement}
        url={"/search"}
        refine={pagination.refine}
      />
    </>
  );
};

export default PaginationSearchResult;
