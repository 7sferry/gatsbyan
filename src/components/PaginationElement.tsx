/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import "./pagination.css";
import { getPagingCalculator } from "../utils/GatsbyanUtils";
import { PaginationAttr, PagingLinkAttr } from "../types/DataTypes";

const PaginationElement = ({ totalPageCount, currentPage, url }: PaginationAttr): React.JSX.Element => {
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

  let pagingCalculator = getPagingCalculator(currentPage, totalPageCount);
  let pageStart = pagingCalculator.pageStart;

  return (
    <>
      {totalPageCount > 1 && (
        <nav data-pagination="">
          <span>
            <PagingLink
              className={`page-number text-second-link`}
              disabled={currentPage === 1 || totalPageCount < 1}
              pageNo={null}
              text={"First"}
            />
          </span>

          <span>
            <PagingLink
              disabled={currentPage <= 1}
              className={`page-number text-second-link`}
              pageNo={pagingCalculator.previousPage === 1 ? null : pagingCalculator.previousPage}
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
              text={"Next"}
            />
          </span>

          <span>
            <PagingLink
              disabled={currentPage === totalPageCount || totalPageCount < 1}
              className={"page-number text-second-link"}
              pageNo={totalPageCount}
              text={"Last"}
            />
          </span>
        </nav>
      )}
    </>
  );
};

export default PaginationElement;
