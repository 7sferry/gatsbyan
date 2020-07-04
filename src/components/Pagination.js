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
  const createURL = pageNo => `${url}/${pageNo && pageNo + '/'}`;
  const PagingLink = ({ to, children, ...rest }) => {
    return refine ? (
      <a href={to} {...rest}>
        {children}
      </a>
    ) : (
      <Link to={to} {...rest}>
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
      {({ pages, currentPage, hasNextPage, hasPreviousPage, previousPage, nextPage, totalPages }) => (
        <nav data-pagination>
          <PagingLink
            className={"page-number"}
            disabled={currentPage === 1 || totalPages < 1}
            to={createURL("")}
            style={{ textDecoration: `none` }}
            onClick={e => {
              click(e, 1);
            }}
          >
            <span>First</span>
          </PagingLink>

          <PagingLink
            disabled={!hasPreviousPage}
            className={"page-number"}
            style={{ textDecoration: `none` }}
            to={createURL(previousPage === 1 ? "" : previousPage)}
            onClick={e => {
              click(e, previousPage);
            }}
          >
            <span>Prev</span>
          </PagingLink>

          <ul>
            {pages.map(page => {
              const className = currentPage === page ? "current" : "";
              return (
                <li key={page} className={className}>
                  <PagingLink
                    disabled={className}
                    className={`page-number ${className}`}
                    to={createURL(page === 1 ? "" : page)}
                    style={{ textDecoration: `none` }}
                    onClick={e => {
                      click(e, page);
                    }}
                  >
                    <span>{page}</span>
                  </PagingLink>
                </li>
              );
            })}
          </ul>

          <PagingLink
            disabled={!hasNextPage}
            className={"page-number"}
            style={{ textDecoration: `none` }}
            to={createURL(nextPage)}
            onClick={e => {
              click(e, nextPage);
            }}
          >
            <span>Next</span>
          </PagingLink>

          <PagingLink
            disabled={currentPage === totalPages || totalPages < 1}
            className={"page-number"}
            style={{ textDecoration: `none` }}
            to={createURL(totalPages)}
            onClick={e => {
              click(e, totalPages);
            }}
          >
            <span>Last</span>
          </PagingLink>
        </nav>
      )}
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
