/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import ReactPagination from "react-paginating";
import PropTypes from "prop-types";
import "./pagination.css";
import { PAGE_COUNT } from "../utils/GatsbyanUtils";

const Pagination = ({ totalPageCount, currentPage, url, refine }) => {
  const limit = 1;
  const createURL = pageNo => `${url === "/page" && pageNo === "" ? "" : url}/${pageNo}`;
  const PagingLink = ({ to, children, ...rest }) => {
    return refine ? (
      <a href={createURL(to)} style={{ textDecoration: `none` }} {...rest}>
        {children}
      </a>
    ) : (
      <Link to={createURL(to)} style={{ textDecoration: `none` }} {...rest}>
        {children}
      </Link>
    );
  };

  function click(e, pageNo) {
    if (refine) {
      e.preventDefault();
      refine(pageNo);
    }
  }

  return (
    <ReactPagination total={totalPageCount} limit={limit} pageCount={PAGE_COUNT} currentPage={currentPage}>
      {({ pages, currentPage, hasNextPage, hasPreviousPage, previousPage, nextPage, totalPages }) => {
        return (
          <nav data-pagination="">
            <span>
              <PagingLink
                className={`page-number text-second-link`}
                disabled={currentPage === 1 || totalPages < 1}
                to=""
                onClick={e => {
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
                to={previousPage === 1 ? "" : previousPage}
                onClick={e => {
                  click(e, previousPage);
                }}
              >
                Prev
              </PagingLink>
            </span>

            <ul>
              {pages.map(page => {
                const className = currentPage === page ? "current" : "";
                return (
                  <li key={page} className={className}>
                    <span>
                      <PagingLink
                        disabled={className}
                        className={`text-second-link page-number ${className}`}
                        to={page === 1 ? "" : page}
                        onClick={e => {
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
                to={nextPage}
                onClick={e => {
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
                to={totalPages}
                onClick={e => {
                  click(e, totalPages);
                }}
              >
                Last
              </PagingLink>
            </span>
          </nav>
        );
      }}
    </ReactPagination>
  );
};

Pagination.propTypes = {
  totalPageCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  refine: PropTypes.func,
};
export default Pagination;
