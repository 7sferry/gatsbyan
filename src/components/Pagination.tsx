/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import ReactPagination from "react-paginating";
import "./pagination.css";
import { PAGE_COUNT } from "../utils/GatsbyanUtils";
import { PaginationAttr, PagingLinkAttr } from "../types/DataTypes";

const Pagination = ({ totalPageCount, currentPage, url, refine }: PaginationAttr) => {
  const limit = 1;
  const createURL = (pageNo: number | null) => {
    return `${pageNo === null ? `${url === "/page" ? "/" : url}` : `${url}/${pageNo}`}`;
  };
  const PagingLink = ({ pageNo, children, ...rest }: React.PropsWithChildren<PagingLinkAttr>) => {
    return refine ? (
      <a href={createURL(pageNo)} style={{ textDecoration: `none` }} {...rest}>
        {children}
      </a>
    ) : (
      <Link to={createURL(pageNo)} style={{ textDecoration: `none` }} {...rest}>
        {children}
      </Link>
    );
  };

  function click(e: React.BaseSyntheticEvent, pageNo: number) {
    if (refine) {
      e.preventDefault();
      refine(pageNo);
    }
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
                    click(e, 1);
                  }}
                >
                  First
                </PagingLink>
              </span>

              <span>
                <PagingLink
                  disabled={!hasPreviousPage}
                  className={`page-number text-second-link`}
                  pageNo={previousPage === 1 ? null : previousPage}
                  onClick={(e) => {
                    click(e, previousPage);
                  }}
                >
                  Prev
                </PagingLink>
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
                            click(e, page);
                          }}
                        >
                          {page}
                        </PagingLink>
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
                    click(e, nextPage);
                  }}
                >
                  Next
                </PagingLink>
              </span>

              <span>
                <PagingLink
                  disabled={currentPage === totalPages || totalPages < 1}
                  className={"page-number text-second-link"}
                  pageNo={totalPages}
                  onClick={(e) => {
                    click(e, totalPages);
                  }}
                >
                  Last
                </PagingLink>
              </span>
            </nav>
          )
        );
      }}
    </ReactPagination>
  );
};

export default Pagination;
