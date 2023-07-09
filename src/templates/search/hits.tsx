/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { connectHits } from "react-instantsearch-dom";

const Hit = connectHits(({ hits }) => {
  return (
    <div>
      {hits.length > 0 ? (
        <>
          {hits.map((hit) => {
            const highlightResult = hit._highlightResult;
            const title = highlightResult?.title?.value;
            const excerpt = highlightResult?.excerpt?.value?.trim() ?? "";
            let matchedStartIndex = getStartIndex(excerpt);

            return (
              <div key={hit.objectID} className="search-result-container">
                <div className="title">
                  <Link className="text-link" to={`/blog/${hit.slug}`}>
                    <h3 dangerouslySetInnerHTML={{ __html: title }} />
                  </Link>
                </div>
                <div className="ellipsis">
                  <p dangerouslySetInnerHTML={{ __html: excerpt?.substring(matchedStartIndex) }} />
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          <p>There were no results yet.</p>
        </>
      )}
    </div>
  );
});

function getStartIndex(excerpt: string) {
  const matchedIndex = excerpt?.indexOf("<ais-highlight-0000000000");
  return excerpt?.indexOf(" ", matchedIndex - 100) + 1;
}

export default Hit;
