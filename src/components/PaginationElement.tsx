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

const PaginationElement = ({ totalPageCount, currentPage, url }: PaginationAttr): React.JSX.Element => {
  const limit = 1;
  const createURL = (pageNo: number | null) => {
    return `${pageNo === null ? `${url === "/page" ? "/" : url}` : `${url}/${pageNo}`}`;
  };
  const PagingLink = ({ pageNo, text, ...rest }: React.PropsWithChildren<PagingLinkAttr>) => {
    return (
      <Link to={createURL(pageNo)} style={{ textDecoration: `none` }} {...rest}>
        {text}
      </Link>
    );
  };

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
                  text={"First"}
                />
              </span>

              <span>
                <PagingLink
                  disabled={!hasPreviousPage}
                  className={`page-number text-second-link`}
                  pageNo={previousPage === 1 ? null : previousPage}
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
                  text={"Next"}
                />
              </span>

              <span>
                <PagingLink
                  disabled={currentPage === totalPages || totalPages < 1}
                  className={"page-number text-second-link"}
                  pageNo={totalPages}
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
