/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { connectHits } from "react-instantsearch-dom";

const Hits = connectHits(({ hits }) => {
  return (
    <div>
      {hits.length > 0 ? (
        <>
          {hits.map(hit => {
            return (
              <div key={hit.objectID}>
                <div className="title">
                  <Link className="text-link" to={`/blog/${hit.slug}`}>
                    <h3>{hit.title}</h3>
                  </Link>
                  <span className="page-info">{hit.publishDate}</span>
                </div>
                <div>
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

export default Hits;
