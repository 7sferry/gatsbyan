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
          {hits.map(hit => {
            return (
              <div key={hit.objectID} className="search-result-container">
                <div className="title">
                  <Link className="text-link" to={`/blog/${hit.slug}`}>
                    <h3>{hit.title}</h3>
                  </Link>
                </div>
                <div className="ellipsis">
                  <p>{hit.excerpt}</p>
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

export default Hit;
