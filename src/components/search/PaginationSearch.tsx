/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import ReactPagination from "react-paginating";
import "../pagination.css";
import { PAGE_COUNT } from "../../utils/GatsbyanUtils";
import { PaginationAttr, PagingLinkAttr } from "../../types/DataTypes";

const PaginationElement = ({ totalPageCount, currentPage, url, refine }: PaginationAttr): React.JSX.Element => {
  const limit = 1;
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
    refine(pageNo);
  }

  return (
    <ReactPagination total={totalPageCount} limit={limit} pageCount={PAGE_COUNT} currentPage={currentPage}>
      {({ pages, currentPage, hasNextPage, hasPreviousPage, previousPage, nextPage, totalPages }) => {
        return (
          pages.length > 0 && (
            <nav data-pagination="">
              <span>
                <PagingLink
                  className={`page-number text-second-link`}
                  disabled={currentPage === 1 || totalPages < 1}
                  pageNo={null}
                  onClick={(e) => {
                    click(e, 0);
                  }}
                  text={"First"}
                />
              </span>

              <span>
                <PagingLink
                  disabled={!hasPreviousPage}
                  className={`page-number text-second-link`}
                  pageNo={previousPage === 1 ? null : previousPage}
                  onClick={(e) => {
                    click(e, previousPage - 1);
                  }}
                  text={"Prev"}
                />
              </span>

              <ul>
                {pages.map((page) => {
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
                  disabled={!hasNextPage}
                  className={"page-number text-second-link"}
                  pageNo={nextPage}
                  onClick={(e) => {
                    click(e, nextPage - 1);
                  }}
                  text={"Next"}
                />
              </span>

              <span>
                <PagingLink
                  disabled={currentPage === totalPages || totalPages < 1}
                  className={"page-number text-second-link"}
                  pageNo={totalPages}
                  onClick={(e) => {
                    click(e, totalPages - 1);
                  }}
                  text={"Last"}
                />
              </span>
            </nav>
          )
        );
      }}
    </ReactPagination>
  );
};

export default PaginationElement;
