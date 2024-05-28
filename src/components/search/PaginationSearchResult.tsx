/************************
 * Made by [MR Ferry™]  *
 * on Januari 2024      *
 ************************/
import connectPagination, {
  PaginationConnectorParams,
  PaginationRenderState,
  PaginationWidgetDescription,
} from "instantsearch.js/es/connectors/pagination/connectPagination";
import { AdditionalWidgetProperties, useConnector } from "react-instantsearch";
import React from "react";
import { PaginationAttr, PagingLinkAttr } from "../../types/DataTypes.ts";
import { getPagingCalculator } from "../../utils/GatsbyanUtils.tsx";

const PaginationSearchResult = (props: PaginationConnectorParams): React.JSX.Element => {
  let pagination: PaginationRenderState = usePagination(props, {});

  return (
    <>
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

const usePagination = (props: PaginationConnectorParams, additionalWidgetProperties: AdditionalWidgetProperties) =>
  useConnector<PaginationConnectorParams, PaginationWidgetDescription>(
    connectPagination,
    props,
    additionalWidgetProperties
  );

const PaginationSearch = ({ totalPageCount, currentPage, url, refine }: PaginationAttr): React.JSX.Element => {
  const createURL = (pageNo: number | null) => {
    return `${pageNo === null ? `${url === "/page" ? "/" : url}` : `${url}/${pageNo}`}`;
  };
  const PagingLink = ({ pageNo, text, ...rest }: React.PropsWithChildren<PagingLinkAttr>) => {
    return (
      <a href={createURL(pageNo)} style={{ textDecoration: `none` }} {...rest}>
        {text}
      </a>
    );
  };

  function click(e: React.BaseSyntheticEvent, pageNo: number) {
    e.preventDefault();
    if (refine) {
      refine(pageNo);
    }
  }

  let pagingCalculator = getPagingCalculator(currentPage, totalPageCount);
  let pageStart = pagingCalculator.pageStart;

  return (
    <>
      {totalPageCount > 0 && (
        <nav data-pagination="">
          <span>
            <PagingLink
              className={`page-number text-second-link`}
              disabled={currentPage === 1 || totalPageCount < 1}
              pageNo={null}
              onClick={(e) => {
                click(e, 0);
              }}
              text={"First"}
            />
          </span>

          <span>
            <PagingLink
              disabled={currentPage <= 1}
              className={`page-number text-second-link`}
              pageNo={pagingCalculator.previousPage === 1 ? null : pagingCalculator.previousPage}
              onClick={(e) => {
                click(e, pagingCalculator.previousPage - 1);
              }}
              text={"Prev"}
            />
          </span>

          <ul>
            {Array.from({ length: pagingCalculator.pageLimit }).map((_) => {
              const page = pageStart++;
              const className = currentPage === page ? "current" : "";
              return (
                <li key={page} className={className}>
                  <span>
                    <PagingLink
                      disabled={Boolean(className)}
                      className={`text-second-link page-number ${className}`}
                      pageNo={page === 1 ? null : page}
                      onClick={(e) => {
                        click(e, page - 1);
                      }}
                      text={page.toString()}
                    />
                  </span>
                </li>
              );
            })}
          </ul>

          <span>
            <PagingLink
              disabled={currentPage >= totalPageCount}
              className={"page-number text-second-link"}
              pageNo={pagingCalculator.nextPage}
              onClick={(e) => {
                click(e, pagingCalculator.nextPage - 1);
              }}
              text={"Next"}
            />
          </span>

          <span>
            <PagingLink
              disabled={currentPage === totalPageCount || totalPageCount < 1}
              className={"page-number text-second-link"}
              pageNo={totalPageCount}
              onClick={(e) => {
                click(e, totalPageCount - 1);
              }}
              text={"Last"}
            />
          </span>
        </nav>
      )}
    </>
  );
};

export default PaginationSearchResult;
